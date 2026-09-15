// Fixed-route proxy to the central Playground API. The browser cannot choose the upstream URL.
const routes = {
  login: { method: 'POST', path: '/api/auth/login', auth: false },
  plans: { method: 'GET', path: '/api/membership/plans', auth: false },
  me: { method: 'GET', path: '/api/auth/me', auth: true },
  quote: { method: 'GET', path: '/api/membership/quote', auth: true },
  prepare: { method: 'POST', path: '/api/membership/payments/prepare', auth: true },
  confirm: { method: 'POST', path: '/api/membership/payments/confirm', auth: true },
  billing: { method: 'POST', path: '/api/membership/billing/issue', auth: true },
  adminMe: { method: 'GET', path: '/api/admin/me', auth: true, admin: true },
  adminUsers: { method: 'GET', path: '/api/admin/users', auth: true, admin: true },
  adminOrders: { method: 'GET', userPath: '/api/admin/users/:id/kmong-orders', auth: true, admin: true },
  adminPurchase: { method: 'POST', userPath: '/api/admin/users/:id/purchase', auth: true, admin: true },
  adminActive: { method: 'PATCH', userPath: '/api/admin/users/:id/active', auth: true, admin: true },
  adminReleaseDevice: { method: 'POST', userPath: '/api/admin/devices/by-id/:id/release', idKey: 'device_id', auth: true, admin: true },
};

function upstreamBase() {
  const base = new URL(process.env.PG_CHECKOUT_API_BASE);
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash ||
      /^(localhost|127\.|0\.|\[|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(base.hostname)) throw new Error();
  return base.href.replace(/\/$/, '');
}

function userId(value) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');
  const action = typeof req.query.action === 'string' ? req.query.action : '';
  if (!Object.hasOwn(routes, action)) return res.status(404).json({ detail: '요청을 찾을 수 없습니다.' });
  const route = routes[action];
  if (req.method !== route.method) return res.status(405).json({ detail: '허용되지 않은 요청입니다.' });
  const authorization = req.headers.authorization;
  if (route.auth && (typeof authorization !== 'string' || !/^Bearer \S+$/.test(authorization))) {
    return res.status(401).json({ detail: 'Playground 계정으로 로그인해 주세요.' });
  }

  let path = route.path;
  if (route.userPath) {
    const id = userId(req.query[route.idKey || 'user_id']);
    if (!id) return res.status(400).json({ detail: '회원을 선택해 주세요.' });
    path = route.userPath.replace(':id', String(id));
  }
  if (action === 'adminUsers') {
    const search = new URLSearchParams({ page: String(Math.max(1, Number(req.query.page) || 1)) });
    if (typeof req.query.q === 'string' && req.query.q.trim()) search.set('q', req.query.q.trim().slice(0, 200));
    path += `?${search}`;
  }
  if (action === 'adminActive') {
    if (!['true', 'false'].includes(req.query.is_active)) return res.status(400).json({ detail: '계정 상태가 올바르지 않습니다.' });
    path += `?is_active=${req.query.is_active}`;
  }

  let body;
  if (req.method === 'POST') {
    if (!req.headers['content-type']?.startsWith('application/json')) return res.status(415).json({ detail: 'JSON 요청이 필요합니다.' });
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || typeof body !== 'object' || Array.isArray(body) || JSON.stringify(body).length > 12000) throw new Error();
    } catch {
      return res.status(400).json({ detail: '요청 형식이 올바르지 않습니다.' });
    }
    if ((action === 'billing' || (action === 'prepare' && body.auto_renew)) && process.env.PG_CHECKOUT_BILLING_ENABLED !== '1') {
      return res.status(409).json({ detail: '자동결제는 아직 준비 중입니다. 1개월 결제를 이용해 주세요.' });
    }
  }

  let base;
  try { base = upstreamBase(); }
  catch { return res.status(503).json({ detail: 'Playground 웹 서비스를 준비 중입니다. 잠시 후 다시 이용해 주세요.' }); }

  try {
    const upstream = await fetch(base + path, {
      method: route.method,
      redirect: 'error',
      headers: { 'Content-Type': 'application/json', ...(route.auth ? { Authorization: authorization } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(65000),
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      const detail = upstream.status < 500 && typeof data.detail === 'string'
        ? data.detail : 'Playground 서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 확인해 주세요.';
      return res.status(upstream.status).json({ detail });
    }
    if (action === 'login') return res.status(200).json({ access_token: data.access_token, user: data.user });
    if (action === 'plans') data.billing_enabled = process.env.PG_CHECKOUT_BILLING_ENABLED === '1';
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ detail: 'Playground 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.' });
  }
}
