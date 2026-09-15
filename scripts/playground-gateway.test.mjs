import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../api/playground-gateway.js', import.meta.url), 'utf8');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const { default: handler } = await import(moduleUrl);
const checkoutSource = await readFile(new URL('../public/playground/checkout.js', import.meta.url), 'utf8');
const manageSource = await readFile(new URL('../public/playground/manage.js', import.meta.url), 'utf8');

test('member management ignores stale orders and keeps selection fixed during mutation', async () => {
  let resolveOrders;
  let renders = 0;
  const elements = new Map();
  const context = vm.createContext({
    URLSearchParams,
    sessionStorage: { getItem: () => null },
    document: { getElementById: (id) => {
      if (!elements.has(id)) elements.set(id, { addEventListener() {}, replaceChildren() { renders++; } });
      return elements.get(id);
    } },
    fetch: () => new Promise((resolve) => { resolveOrders = resolve; }),
  });
  vm.runInContext(manageSource, context);
  vm.runInContext('selected = {id:1}; busy=true;', context);
  await vm.runInContext('selectUser({id:2}, null)', context);
  assert.equal(vm.runInContext('selected.id', context), 1);
  vm.runInContext('busy=false;', context);
  const pendingOrders = vm.runInContext('loadOrders()', context);
  vm.runInContext('selected = {id:2};', context);
  resolveOrders({ ok: true, json: async () => ({ items: [] }) });
  await pendingOrders;
  assert.equal(renders, 0);
});

function response() {
  return {
    statusCode: 200, headers: {}, payload: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.payload = value; return this; },
  };
}

async function call(query, { method = 'GET', headers = {}, body } = {}) {
  const res = response();
  await handler({ query, method, headers, body }, res);
  return res;
}

test('unknown routes and missing authorization fail closed', async () => {
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error('must not call'); };
  assert.equal((await call({ action: '__proto__' })).statusCode, 404);
  assert.equal((await call({ action: 'adminUsers' })).statusCode, 401);
  assert.equal(called, false);
});

test('admin member route forwards only approved query values', async () => {
  process.env.PG_CHECKOUT_API_BASE = 'https://api.example.test/pg';
  let target;
  globalThis.fetch = async (url) => {
    target = String(url);
    return { ok: true, status: 200, json: async () => ({ items: [] }) };
  };
  const res = await call({ action: 'adminUsers', q: 'user+one@example.com', page: '2', ignored: '/evil' }, {
    headers: { authorization: 'Bearer token' },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(target, 'https://api.example.test/pg/api/admin/users?page=2&q=user%2Bone%40example.com');
  assert.equal(target.includes('ignored'), false);
});

test('admin purchase route validates member id and forwards JSON', async () => {
  process.env.PG_CHECKOUT_API_BASE = 'https://api.example.test';
  assert.equal((await call({ action: 'adminPurchase', user_id: '../1' }, {
    method: 'POST', headers: { authorization: 'Bearer token', 'content-type': 'application/json' }, body: {},
  })).statusCode, 400);
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url: String(url), options };
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  };
  const body = { action: 'grant', order_id: 'KMONG-1', note: 'verified' };
  const res = await call({ action: 'adminPurchase', user_id: '42' }, {
    method: 'POST', headers: { authorization: 'Bearer token', 'content-type': 'application/json' }, body,
  });
  assert.equal(res.statusCode, 200);
  assert.equal(request.url, 'https://api.example.test/api/admin/users/42/purchase');
  assert.deepEqual(JSON.parse(request.options.body), body);
});

test('account status and device release use fixed administrator paths', async () => {
  process.env.PG_CHECKOUT_API_BASE = 'https://api.example.test';
  const targets = [];
  globalThis.fetch = async (url) => {
    targets.push(String(url));
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  };
  const auth = { authorization: 'Bearer token' };
  assert.equal((await call({ action: 'adminActive', user_id: '7', is_active: 'false' }, { method: 'PATCH', headers: auth })).statusCode, 200);
  assert.equal((await call({ action: 'adminReleaseDevice', device_id: '31' }, {
    method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: { confirm: true },
  })).statusCode, 200);
  assert.deepEqual(targets, [
    'https://api.example.test/api/admin/users/7/active?is_active=false',
    'https://api.example.test/api/admin/devices/by-id/31/release',
  ]);
});

test('login response does not expose refresh token', async () => {
  process.env.PG_CHECKOUT_API_BASE = 'https://api.example.test';
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({
    access_token: 'access', refresh_token: 'refresh', user: { id: 1 },
  }) });
  const res = await call({ action: 'login' }, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: { email: 'a@b.co', password: 'x' },
  });
  assert.deepEqual(res.payload, { access_token: 'access', user: { id: 1 } });
});

test('billing and private upstream stay disabled', async () => {
  delete process.env.PG_CHECKOUT_BILLING_ENABLED;
  process.env.PG_CHECKOUT_API_BASE = 'https://api.example.test';
  const billing = await call({ action: 'prepare' }, {
    method: 'POST', headers: { authorization: 'Bearer token', 'content-type': 'application/json' }, body: { auto_renew: true },
  });
  assert.equal(billing.statusCode, 409);
  process.env.PG_CHECKOUT_API_BASE = 'http://127.0.0.1:6009';
  const plans = await call({ action: 'plans' });
  assert.equal(plans.statusCode, 503);
});

test('page scripts reference existing elements and private pages are not advertised', async () => {
  for (const name of ['checkout', 'manage']) {
    const [html, script] = await Promise.all([
      readFile(new URL(`../public/playground/${name}.html`, import.meta.url), 'utf8'),
      readFile(new URL(`../public/playground/${name}.js`, import.meta.url), 'utf8'),
    ]);
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
    const references = [...script.matchAll(/\bel\('([^']+)'\)/g)].map((match) => match[1]);
    assert.deepEqual([...new Set(references.filter((id) => !ids.has(id)))], []);
    assert.match(html, /noindex/);
  }
  const [index, guide, sitemap] = await Promise.all([
    readFile(new URL('../public/playground/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../public/playground/guide.html', import.meta.url), 'utf8'),
    readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8'),
  ]);
  assert.equal(/href=["'][^"']*(checkout|manage)/i.test(index), false);
  assert.equal(/playground\/(checkout|manage)/i.test(sitemap), false);
  assert.doesNotMatch(index, /첫 2개월|출시 후 2개월/);
  assert.match(index, /2026년 10월 1일부터 11월 30일까지/);
  assert.match(index, /2026-11-30T15:00:00Z/);
  assert.match(index, /launch_discount_status/);
  assert.match(index, /href="\/playground\/guide\.html"/);
  assert.match(guide, /Playground 사용법/);
  assert.match(guide, /ID &amp; API 설정/);
  assert.match(sitemap, /playground\/guide\.html/);
  assert.doesNotMatch(checkoutSource, /첫 2개월|출시 후 2개월|launch_discount_eligible/);
});

function checkoutBrowser(search = '', storage = {}, responses = {}, windowObject = {}) {
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) elements.set(id, {
      value: '', hidden: false, checked: false, disabled: false, textContent: '',
      add(option) { if (!this.value) this.value = option.value; },
      addEventListener(name, fn) { this[name] = fn; },
    });
    return elements.get(id);
  };
  get('mode').value = 'once';
  const calls = [];
  const context = vm.createContext({
    URL, URLSearchParams, console, crypto: { randomUUID: () => 'state-fixture' },
    Option: function Option(_text, value) { this.value = value; },
    location: { search, pathname: '/playground/checkout.html', origin: 'https://fixture.invalid' },
    history: { replaceState() {} },
    sessionStorage: {
      getItem: (key) => storage[key] ?? null,
      setItem: (key, value) => { storage[key] = value; },
      removeItem: (key) => { delete storage[key]; },
    },
    document: { getElementById: get }, window: windowObject,
    fetch: async (url, options) => {
      const action = new URL(url, 'https://fixture.invalid').searchParams.get('action');
      calls.push({ action, body: options.body && JSON.parse(options.body) });
      const reply = responses[action];
      if (typeof reply === 'function') return reply(options);
      return { ok: true, status: 200, json: async () => reply || {} };
    },
  });
  vm.runInContext(checkoutSource, context);
  return { calls, get, storage };
}

const plans = { plans: [{ code: 'basic', name: 'Basic', description: 'fixture', price_krw: 49000, launch_price_krw: 24500, launch_discount_percent: 50, launch_discount_status: 'active', launch_discount_active: true, launch_discount_starts_at: '2026-10-01T00:00:00+09:00', launch_discount_ends_at: '2026-12-01T00:00:00+09:00', launch_discount_period: '2026-10-01~2026-11-30' }] };
const pending = () => ({ pg_checkout_access: 'fixture', pg_checkout_order: JSON.stringify({ userId: 1, state: 's', orderId: 'order-fixture', amount: 24500, auto: false }) });
const settle = () => new Promise((resolve) => setImmediate(resolve));

test('checkout does not initiate payment on direct page load', async () => {
  const page = checkoutBrowser('', {}, { plans });
  await settle();
  assert.equal(page.get('login').hidden, false);
  assert.equal(page.get('pay').disabled, true);
  assert.deepEqual(page.calls.map((item) => item.action), ['plans']);
});

test('checkout rejects a tampered callback before confirmation', async () => {
  const page = checkoutBrowser('?paymentKey=fixture&orderId=order-fixture&amount=1&state=s', pending(), {
    plans, me: { id: 1, email: 'fixture@example.invalid' },
  });
  await settle();
  assert.equal(page.calls.some((item) => item.action === 'confirm'), false);
  assert.equal(page.get('retry').hidden, false);
});

test('checkout shows direct payment only after account quote', async () => {
  const storage = { pg_checkout_access: 'fixture' };
  const page = checkoutBrowser('', storage, {
    plans,
    me: { id: 1, email: 'fixture@example.invalid', direct_checkout_allowed: true },
    quote: { plans: [{ code: 'basic', amount: 24500, launch_discount_status: 'active', launch_discount_active: true }] },
  });
  await settle();
  assert.equal(page.get('order').hidden, false);
  assert.deepEqual(page.calls.map((item) => item.action), ['plans', 'me', 'quote']);
  assert.match(page.get('price').textContent, /24,500/);
});

const planList = (status) => ({ plans: plans.plans.map((plan) => ({ ...plan, launch_discount_status: status, launch_discount_active: status === 'active' })) });
const failure = (status, detail) => async () => ({ ok: false, status, json: async () => ({ detail }) });

test('expired price callback can restart while uncertain failures preserve the order', async () => {
  for (const status of [409, 502]) {
    const storage = pending();
    const page = checkoutBrowser('?paymentKey=fixture&orderId=order-fixture&amount=24500&state=s', storage, {
      plans, me: { id: 1, email: 'fixture@example.invalid', direct_checkout_allowed: true },
      confirm: failure(status, '결제 확인 결과'),
    });
    await settle();
    assert.equal(page.calls.filter((call) => call.action === 'confirm').length, 1);
    assert.equal(page.get('login').hidden, false);
    assert.equal(Boolean(storage.pg_checkout_order), status !== 409);
    assert.equal(Boolean(storage.pg_checkout_result), status !== 409);
    assert.equal(page.get('retry').hidden, status === 409);
  }
});

test('checkout shows the regular price before and after the fixed promotion', async () => {
  const before = checkoutBrowser('', {}, { plans: planList('upcoming') });
  await settle();
  assert.match(before.get('price').textContent, /49,000/);
  assert.equal(before.get('regular').textContent, '');
  assert.match(before.get('discount').textContent, /10월 1일부터 11월 30일까지/);
  const after = checkoutBrowser('', {}, { plans: planList('ended') });
  await settle();
  assert.match(after.get('price').textContent, /49,000/);
  assert.match(after.get('discount').textContent, /종료/);
});

test('Kmong account never requests a direct checkout quote and can switch account', async () => {
  const storage = { pg_checkout_access: 'fixture' };
  const page = checkoutBrowser('', storage, {
    plans,
    me: { id: 2, email: 'kmong@example.invalid', purchase_channel: 'kmong', direct_checkout_allowed: false, message: '크몽 구매 계정입니다.' },
  });
  await settle();
  assert.equal(page.calls.some((item) => item.action === 'quote'), false);
  assert.equal(page.get('order').hidden, true);
  assert.equal(page.get('login').hidden, false);
  assert.equal(storage.pg_checkout_access, undefined);
  assert.equal(page.get('pay').disabled, true);
  assert.match(page.get('message').textContent, /크몽/);
});

test('failed or incomplete quote keeps checkout closed', async () => {
  for (const quote of [failure(409, '크몽 구매 계정입니다.'), { plans: [] }, { plans: [{ code: 'basic', amount: '24500' }] }]) {
    const storage = { pg_checkout_access: 'fixture' };
    const page = checkoutBrowser('', storage, {
      plans, me: { id: 1, email: 'fixture@example.invalid', direct_checkout_allowed: true }, quote,
    });
    await settle();
    assert.equal(page.get('order').hidden, true);
    assert.equal(page.get('login').hidden, false);
    assert.equal(page.get('pay').disabled, true);
    assert.equal(storage.pg_checkout_access, undefined);
  }
});

test('logout clears the previous account quote', async () => {
  const storage = { pg_checkout_access: 'fixture' };
  const page = checkoutBrowser('', storage, {
    plans,
    me: { id: 1, email: 'fixture@example.invalid', direct_checkout_allowed: true },
    quote: { plans: [{ code: 'basic', amount: 49000, launch_discount_status: 'ended', launch_discount_active: false }] },
  });
  await settle();
  assert.match(page.get('price').textContent, /49,000/);
  page.get('logout').click();
  assert.equal(page.get('order').hidden, true);
  assert.equal(page.get('login').hidden, false);
  assert.equal(storage.pg_checkout_access, undefined);
  assert.match(page.get('price').textContent, /24,500/);
});

test('payment does not open when the prepared amount differs from the quote', async () => {
  const storage = { pg_checkout_access: 'fixture' };
  let tossCalled = false;
  const page = checkoutBrowser('', storage, {
    plans,
    me: { id: 1, email: 'fixture@example.invalid', direct_checkout_allowed: true },
    quote: { plans: [{ code: 'basic', amount: 24500, launch_discount_status: 'active', launch_discount_active: true }] },
    prepare: { order_uid: 'order-fixture', amount: 49000, auto_renew: false, client_key: 'fixture' },
  }, { TossPayments: () => { tossCalled = true; return { payment: () => ({ requestPayment: async () => {} }) }; } });
  await settle();
  page.get('agree').checked = true;
  page.get('agree').change();
  assert.equal(page.get('pay').disabled, false);
  await page.get('pay').click();
  assert.equal(tossCalled, false);
  assert.equal(storage.pg_checkout_order, undefined);
  assert.match(page.get('message').textContent, /결제 조건이 변경/);
});

const indexHtml = await readFile(new URL('../public/playground/index.html', import.meta.url), 'utf8');

function indexBrowser(nowIso, plansResponse) {
  const script = [...indexHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]).find((code) => code.includes('applyPromotion'));
  const cards = [...indexHtml.matchAll(/data-plan-code="(\w+)" data-price-krw="(\d+)" data-launch-price-krw="(\d+)"/g)].map(([, planCode, priceKrw, launchPriceKrw]) => {
    const parts = { '.plan-regular': { hidden: true, textContent: '' }, '.plan-price-value': { textContent: '' }, '.plan-discount': { textContent: '' } };
    return { dataset: { planCode, priceKrw, launchPriceKrw }, parts, querySelector: (selector) => parts[selector] };
  });
  const byId = {};
  const now = Date.parse(nowIso);
  const context = vm.createContext({
    document: { getElementById: (id) => (byId[id] ||= { textContent: '' }), querySelectorAll: () => cards },
    fetch: async (url) => (url.includes('action=plans') && plansResponse
      ? { ok: true, json: async () => plansResponse }
      : { ok: false, json: async () => ({}) }),
  });
  vm.runInContext('Date.now = () => NOW;', Object.assign(context, { NOW: now }));
  vm.runInContext(script, context);
  const view = () => cards.map((card) => ({
    price: card.parts['.plan-price-value'].textContent,
    regularVisible: !card.parts['.plan-regular'].hidden,
    discount: card.parts['.plan-discount'].textContent,
  }));
  return { view, byId };
}

test('index static prices lead with the launch discount and strike regular prices', () => {
  const prices = [...indexHtml.matchAll(/class="plan-price-value">([^<]+)</g)].map((match) => match[1]);
  assert.deepEqual(prices, ['24,500원', '44,500원', '74,500원']);
  assert.equal([...indexHtml.matchAll(/class="plan-regular">/g)].length, 3);
  assert.equal([...indexHtml.matchAll(/11월 30일까지 50% 할인/g)].length >= 3, true);
});

test('index shows fixed promotion windows by Korean time without server data', async () => {
  const regular = ['49,000원', '89,000원', '149,000원'];
  const launch = ['24,500원', '44,500원', '74,500원'];
  for (const [at, expected, visible] of [
    ['2026-09-30T23:59:59+09:00', launch, true],
    ['2026-10-01T00:00:00+09:00', launch, true],
    ['2026-11-30T23:59:59+09:00', launch, true],
    ['2026-12-01T00:00:00+09:00', regular, false],
  ]) {
    const page = indexBrowser(at);
    await settle();
    assert.deepEqual(page.view().map((card) => card.price), expected, at);
    assert.equal(page.view().every((card) => card.regularVisible === visible), true, at);
  }
  const before = indexBrowser('2026-09-15T12:00:00+09:00');
  assert.equal(before.view()[0].price, '24,500원');
  assert.match(before.view()[0].discount, /11월 30일까지 50% 할인/);
  const after = indexBrowser('2026-12-01T00:00:00+09:00');
  assert.match(after.byId['pricing-sub'].textContent, /종료/);
});

test('index prefers server promotion status and ignores unknown values', async () => {
  const server = (status) => ({ plans: [
    { code: 'basic', price_krw: 49000, launch_price_krw: 24500, launch_discount_status: status },
    { code: 'operation', price_krw: 89000, launch_price_krw: 44500, launch_discount_status: status },
    { code: 'expansion', price_krw: 149000, launch_price_krw: 74500, launch_discount_status: status },
  ] });
  const ended = indexBrowser('2026-10-15T12:00:00+09:00', server('ended'));
  await settle();
  assert.equal(ended.view()[0].price, '49,000원');
  const active = indexBrowser('2026-12-15T12:00:00+09:00', server('active'));
  await settle();
  assert.equal(active.view()[0].price, '24,500원');
  const unknown = indexBrowser('2026-12-15T12:00:00+09:00', server('weird'));
  await settle();
  assert.equal(unknown.view()[0].price, '49,000원');
});
