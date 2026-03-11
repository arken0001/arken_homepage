import re, random, base64, io
from PIL import Image

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

random.seed(77)
colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bdf','#ffa96b','#6bfff1','#c56bff','#ff9ff3','#54a0ff','#f368e0','#ff9f43','#ee5a24','#0abde3','#01a3a4','#5f27cd']

# ===== 1. 배지 텍스트 변경 =====
content = content.replace('<span class="st st-live">Live</span>', '<span class="st st-live">완료</span>')
content = content.replace('<span class="st st-dev">Dev</span>', '<span class="st st-dev">개발중</span>')

# Timebox: 개발중 -> 완료
content = content.replace(
    '<span class="st st-dev">개발중</span></div><div class="pc-name">Timebox</div>',
    '<span class="st st-live">완료</span></div><div class="pc-name">Timebox</div>'
)

# ===== 2. 설명 수정 =====
# AU_rent
content = content.replace(
    '호주 현지 부동산 플랫폼에서 렌트 매물 정보를 자동 수집·분석하는 스크래퍼. 장기 실가동 이력 보유. 호주살이 커뮤니티 연계 실서비스.',
    '호주 현지 부동산 4개의 플랫폼에서 렌트 매물 정보를 자동 수집하여 한국어로 번역하여 N카페에 자동등록 및 한국 10대 뉴스·호주 10대 뉴스를 수집하여 한국어 번역 후 N카페에 자동 글쓰기 등록을 하는 데스크톱 프로그램.'
)

# Gmarket Crawler
content = content.replace(
    '<div class="pc-name">Coupang / Gmarket Crawler</div><div class="pc-desc">쿠팡·지마켓 상품 가격, 랭킹, 키워드 순위, 리뷰 데이터를 주기적으로 자동 수집하는 크롤링 엔진. 경쟁사 모니터링, 키워드 트렌드 분석에 활용.</div>',
    '<div class="pc-name">Gmarket Crawler</div><div class="pc-desc">지마켓에서 키워드로 상품을 검색하고, 가격, 할인율, 평점, 구매수량 등 각 조건에 맞는 상품정보를 자동으로 수집하는 브라우저용 프로그램.</div>'
)

# ARKEN Capture
content = content.replace(
    '반복 화면 캡처 작업을 자동화하는 윈도우 데스크톱 앱. 지정 영역 캡처, 자동 파일명 생성, 폴더 저장을 단일 EXE로 배포. 설치 없이 즉시 실행.',
    '화면의 원하는 영역을 한 번에 캡처할 수 있고, 내장 에디터를 통한 즉각적인 편집(펜, 화살표, 도형, 모자이크, 텍스트 등)으로 작업 효율을 극대화하며, 글로벌 핫키로 어떤 상황에서든 즉시 캡처가 가능한 Windows 데스크톱용 스크린캡처 유틸리티.'
)

# Dev Server Manager
content = content.replace(
    '로컬·원격 개발 서버의 실행 상태를 한 화면에서 통합 관리하는 GUI 유틸리티. 서버 시작·중지·재시작, 실시간 상태 모니터링 지원.',
    '여러 개발 프로젝트의 서버를 한 화면에서 실행/중지하고, Git 상태·리소스 사용량·배포 현황을 실시간으로 모니터링하며, AI 프롬프트 최적화부터 MCP 확장 관리, 원클릭 빌드·배포까지 개발 워크플로우 전체를 통합 관리하는 데스크톱 프로그램.'
)

# AI Clipboard Cleaner
content = content.replace(
    'AI 생성 텍스트나 웹 복사본의 불필요한 특수문자·마크다운 기호를 자동 제거하는 윈도우 유틸리티. 클립보드 감지→정제→붙여넣기를 원클릭으로 처리.',
    'AI(ChatGPT, Claude, Gemini 등)의 다크모드 응답을 붙여넣기 한 번으로 깔끔한 문서 서식으로 자동 변환하고, Word/Google Docs용 서식 유지 모드와 메모장/Keep용 텍스트 모드를 탭 전환으로 즉시 비교할 수 있으며, 마크다운(.md) 파일도 자동 감지하여 헤더·표·코드블록·목록 등을 문서 양식으로 렌더링해주는 웹 기반 클립보드 서식 정리 도구.'
)

# Timebox
content = content.replace(
    '뽀모도로 기법 기반 시간 관리 데스크톱 앱. 업무 집중·휴식 시간 시각화, 작업별 시간 기록, 일별 업무 통계 및 알림 기능.',
    '일론 머스크의 업무 방식인 타임박싱(Timeboxing) 기법을 모티브로 제작한 시간 관리 데스크톱 프로그램. 하루를 5분 단위의 타임블록으로 나누어 모든 활동을 사전에 계획하고, 실시간 카운트다운 타이머로 실행을 추적하며, Google 캘린더 연동·브레인덤프·오늘의 우선순위·미니 캘린더 등을 통해 극한의 시간 관리를 지원하는 Tauri 기반 데스크톱 앱 (PC/모바일 대응).'
)

# Flow Chart
content = content.replace(
    '복잡한 업무 흐름, 자동화 파이프라인, 서비스 구조를 직관적인 플로우차트로 설계하고 시각화하는 웹 기반 도구.',
    '모바일 앱의 화면 흐름을 직관적으로 설계할 수 있고, 스마트폰 프리셋(iPhone, Galaxy 등) 기반의 실제 비율 화면 박스와 드래그 연결선으로 UX 플로우를 시각화하며, URL 기반 실시간 스크린 캡처와 이미지 드래그앤드롭으로 기획 문서를 빠르게 완성할 수 있는 웹 기반 앱 플로우차트 디자인 도구.'
)

# PC Checker
content = content.replace(
    'CPU·메모리·디스크·네트워크 상태를 실시간 모니터링하는 경량 데스크톱 유틸리티. 임계값 초과 알림, 장애 사전 감지, 로그 기록 지원.',
    'PC의 디스크 I/O 사용률을 시스템 트레이에서 실시간으로 모니터링하며, 초록/주황/빨강 아이콘 색상으로 현재 상태를 직관적으로 시각화하고, 설정한 임계값 초과 시 풍선 알림으로 즉시 알려주는 Windows 데스크톱용 시스템 모니터링 유틸리티.'
)

# 기술스택 설명
content = content.replace(
    '프론트엔드부터 자동화, AI 통합까지 전 영역을 직접 개발합니다.',
    '10년 이상의 온라인 이커머스 실전 경험과 대규모 커뮤니티 운영 노하우를 기반으로, 비즈니스가 실제로 요구하는 자동화·데이터 수집·AI 통합까지 직접 설계하고 개발합니다.'
)

# ===== 3. 스크린샷 추가 (workspace 이미지 -> base64) =====
def add_screenshot(content, card_name, img_files, is_after_name=True):
    """카드에 스크린샷 추가"""
    imgs_html = ''
    for img_file in img_files:
        img = Image.open(f'workspace/{img_file}')
        # 원본 비율 유지하며 적절히 리사이즈
        buf = io.BytesIO()
        img.save(buf, format='PNG', optimize=True, quality=85)
        b64 = base64.b64encode(buf.getvalue()).decode()
        imgs_html += f'<img class="pc-screen-img" alt="{card_name}" src="data:image/png;base64,{b64}">'

    screenshot_div = f'<div class="pc-screenshot">{imgs_html}</div>'

    old = f'<div class="pc-name">{card_name}</div><div class="pc-desc">'
    new = f'<div class="pc-name">{card_name}</div>{screenshot_div}<div class="pc-desc">'
    content = content.replace(old, new)
    return content

import os
screenshot_map = {
    'AU_rent': ['Au_rent.png'],
    'Gmarket Crawler': ['Gmarket.png'],
    'ARKEN Capture': ['arken_acpture.png', 'arken_acpture2.png'],
    'Dev Server Manager': ['Dev_server_manager.png'],
    'AI Clipboard Cleaner': ['AI_Cliboard_Cleaner.png'],
    'Timebox': ['timebox.png'],
    'Flow Chart': ['flow_chart.png'],
    'PC Checker': ['PC_Checker.png'],
}

for card_name, img_files in screenshot_map.items():
    existing = [f for f in img_files if os.path.exists(f'workspace/{f}')]
    if existing:
        content = add_screenshot(content, card_name, existing)
        print(f'Added screenshot for {card_name}')

# ===== 4. 네비게이션 메뉴 수정 =====
content = content.replace(
    '<li><a href="#about">회사소개</a></li>\n    <li><a href="#projects">개발현황</a></li>\n    <li><a href="#develop">서비스</a></li>',
    '<li><a href="#about">회사소개</a></li>\n    <li><a href="#develop">서비스</a></li>\n    <li><a href="#projects">포트폴리오</a></li>'
)

# 네비 글자 두껍게
content = content.replace(
    '.nav-links a{color:var(--muted);font-size:.8rem;letter-spacing:.1em;text-decoration:none;transition:color .25s;text-transform:uppercase}',
    '.nav-links a{color:var(--muted);font-size:.8rem;font-weight:600;letter-spacing:.1em;text-decoration:none;transition:color .25s;text-transform:uppercase}'
)

# ===== 5. 그리드 3열 고정 =====
content = content.replace(
    '.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.2rem}',
    '.proj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}'
)

# ===== 6. Cafe Manager v2를 가로 2칸 wide 레이아웃으로 =====
# pc-tag CSS 뒤에 wide + 더보기 + gift 관련 CSS 추가
old_tag_css = '.pc-tag{padding:.18rem .5rem;font-size:.62rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:4px;color:var(--muted)}'
new_tag_css = old_tag_css + """
    .pc-more{display:inline-block;margin-top:.8rem;padding:.35rem .9rem;font-size:.7rem;color:var(--accent);background:rgba(91,189,255,.08);border:1px solid rgba(91,189,255,.25);border-radius:6px;cursor:pointer;text-decoration:none;transition:all .25s ease}
    .pc-more:hover{background:rgba(91,189,255,.18);border-color:rgba(91,189,255,.45)}
    .pc-wide{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:1.6rem;align-items:center}
    .pc-wide .pc-left{overflow:hidden;border-radius:8px}
    .pc-wide .pc-left img{width:100%;display:block;border-radius:8px}
    .pc-wide .pc-right{}"""
content = content.replace(old_tag_css, new_tag_css)

# 스크린샷 높이 통일
old_ss_css = """.pc-screenshot {
      margin: .8rem 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(74,150,205,.2);
    }
    .pc-screen-img {
      width: 100%;
      display: block;
      border-radius: 8px;
    }"""
new_ss_css = """.pc-screenshot {
      margin: .8rem 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(74,150,205,.2);
      max-height: 200px;
    }
    .pc-screen-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      display: block;
      border-radius: 8px;
    }"""
content = content.replace(old_ss_css, new_ss_css)

# Cafe Manager 카드를 wide로 변환
cm_start = content.find('<div class="pc fade"><div class="pc-top"><div class="pc-ico">⚙️</div>')
sm_start = content.find('<div class="pc fade"><div class="pc-top"><div class="pc-ico">🛒</div>')
cm_card = content[cm_start:sm_start]

# 스크린샷 추출
img_match = re.search(r'<div class="pc-screenshot">(.*?)</div>', cm_card, re.DOTALL)
screenshot_html = img_match.group(1) if img_match else ''
desc_match = re.search(r'<div class="pc-desc">(.*?)</div>', cm_card)
desc = desc_match.group(1) if desc_match else ''
tags_match = re.search(r'<div class="pc-tags">(.*?)</div>', cm_card)
tags = tags_match.group(1) if tags_match else ''

new_cm = f"""<div class="pc pc-wide fade">
        <div class="pc-left">{screenshot_html}</div>
        <div class="pc-right">
          <div class="pc-top"><div class="pc-ico">⚙️</div><span class="st st-live">완료</span></div>
          <div class="pc-name">Cafe Manager v2</div>
          <div class="pc-desc">{desc}</div>
          <div class="pc-tags">{tags}</div>
          <div style="margin-top:.8rem;text-align:right"><a class="pc-more" href="#">더보기</a></div>
        </div>
      </div>

      """
content = content[:cm_start] + new_cm + content[sm_start:]

# ===== 7. info-card -> 선물상자 애니메이션 =====
# 로고 추출
logo_match = re.search(r'"pc-left">\s*<img[^>]+src="(data:image/[^"]+)"', content)
if not logo_match:
    logo_match = re.search(r'class="ic-logo"[^>]*src="([^"]+)"', content)
    if not logo_match:
        logo_match = re.search(r'src="(data:image/png;base64,[^"]+)"[^>]*alt="ARKEN"', content)

logo_src = logo_match.group(1) if logo_match else ''
print(f'Logo found: {len(logo_src)} chars')

# 썸네일 생성 (60px 높이)
thumb_data = {}
for card_name, img_files in screenshot_map.items():
    if os.path.exists(f'workspace/{img_files[0]}'):
        img = Image.open(f'workspace/{img_files[0]}')
        ratio = 60 / img.height
        new_w = int(img.width * ratio)
        img = img.resize((new_w, 60), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format='PNG', optimize=True)
        b64 = base64.b64encode(buf.getvalue()).decode()
        thumb_data[card_name] = f'data:image/png;base64,{b64}'

# Cafe Manager / Seller Manager 썸네일은 HTML 내 base64에서 추출
for name_pattern, thumb_name in [('Seller Manager v2', 'Seller Manager')]:
    match = re.search(f'<div class="pc-name">{name_pattern}</div><div class="pc-screenshot"><img[^>]+src="(data:image/[^"]+)"', content)
    if match:
        b64_raw = match.group(1).split(',')[1]
        img = Image.open(io.BytesIO(base64.b64decode(b64_raw)))
        ratio = 60 / img.height
        img = img.resize((int(img.width * ratio), 60), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format='PNG', optimize=True)
        thumb_data[thumb_name] = f'data:image/png;base64,{base64.b64encode(buf.getvalue()).decode()}'

# Cafe Manager wide의 pc-left에서 추출
cm_img_match = re.search(r'"pc-left"><img[^>]+src="(data:image/[^"]+)"', content)
if cm_img_match:
    b64_raw = cm_img_match.group(1).split(',')[1]
    img = Image.open(io.BytesIO(base64.b64decode(b64_raw)))
    ratio = 60 / img.height
    img = img.resize((int(img.width * ratio), 60), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='PNG', optimize=True)
    thumb_data['Cafe Manager'] = f'data:image/png;base64,{base64.b64encode(buf.getvalue()).decode()}'

print(f'Thumbnails: {list(thumb_data.keys())}')

# info-card를 선물상자로 교체
ic_start = content.find('<div class="info-card fade">')
ic_end = content.find('</div>\n    </div>', ic_start) + len('</div>\n    </div>')

# 선물상자 CSS
gift_css = """
    /* ── GIFT BOX ANIMATION ── */
    .gift-scene{position:relative;height:500px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
    .gift-box-wrap{position:relative;z-index:5;margin-bottom:20px}
    .gift-base{width:120px;height:80px;background:linear-gradient(180deg,#e74c3c,#c0392b);border-radius:0 0 8px 8px;position:relative;box-shadow:0 8px 30px rgba(231,76,60,.4)}
    .gift-ribbon-v{position:absolute;top:0;left:50%;transform:translateX(-50%);width:20px;height:100%;background:linear-gradient(180deg,#f1c40f,#e67e22)}
    .gift-glow{position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:200px;height:80px;background:radial-gradient(ellipse,rgba(241,196,15,.5),transparent);animation:giftGlow 2s ease-in-out infinite}
    .gift-lid{position:relative;z-index:6;transform-origin:left bottom;animation:lidOpen 4s ease-in-out infinite}
    .gift-lid-top{width:135px;height:18px;background:linear-gradient(180deg,#e74c3c,#c0392b);border-radius:5px 5px 0 0;position:relative;left:-7px;box-shadow:0 -2px 10px rgba(0,0,0,.2)}
    .gift-ribbon-h{position:absolute;top:50%;left:-7px;transform:translateY(-50%);width:135px;height:14px;background:linear-gradient(90deg,#f1c40f,#e67e22,#f1c40f);border-radius:3px}
    .gift-canvas{position:absolute;inset:0;pointer-events:none;overflow:hidden}
    .fly-product{position:absolute;bottom:100px;left:50%;opacity:0;z-index:4}
    .fly-product img{object-fit:cover;border-radius:6px;border:2px solid rgba(255,255,255,.4);box-shadow:0 4px 20px rgba(0,0,0,.5)}
    .fly-confetti{position:absolute;bottom:100px;left:50%;opacity:0;z-index:3}
    .fly-ribbon-piece{position:absolute;bottom:100px;left:50%;width:4px;opacity:0;z-index:3;border-radius:2px}
    .fly-spark{position:absolute;bottom:100px;left:50%;border-radius:50%;opacity:0;z-index:3}
    @keyframes lidOpen{0%,90%,100%{transform:rotate(0deg)}10%{transform:rotate(-70deg)}20%{transform:rotate(-55deg)}80%{transform:rotate(-65deg)}}
    @keyframes giftGlow{0%,100%{opacity:.3;transform:translateX(-50%) scale(1)}50%{opacity:.8;transform:translateX(-50%) scale(1.5)}}
    /* ── CONTACT CARD HEADER ── */
    .cc-header{display:flex;align-items:center;gap:1rem;padding-bottom:1.2rem;margin-bottom:1.2rem;border-bottom:1px solid var(--border)}
    .cc-logo{width:56px;height:56px;border-radius:10px;background:var(--card);border:1px solid var(--border);padding:6px}
    .cc-name h3{margin:0;font-size:1rem;font-weight:700}
    .cc-name span{font-size:.72rem;color:var(--muted)}"""

# 개별 keyframes 생성
all_keyframes = ''
all_elements = ''

# 제품 사진
product_list = [
    ('Cafe Manager', 130, 90),
    ('Seller Manager', 90, 65),
    ('Gmarket Crawler', 120, 80),
    ('AU_rent', 100, 70),
    ('ARKEN Capture', 85, 60),
    ('Dev Server Manager', 115, 80),
    ('AI Clipboard Cleaner', 110, 75),
    ('Timebox', 95, 68),
    ('Flow Chart', 125, 85),
    ('PC Checker', 80, 58),
]

for i, (name, w, h) in enumerate(product_list):
    src = thumb_data.get(name, '')
    if not src:
        continue
    x1 = random.randint(-250, 250)
    y1 = random.randint(-350, -200)
    x2 = x1 + random.randint(-80, 80)
    y2 = y1 + random.randint(-50, 50)
    x3 = x2 + random.randint(-60, 60)
    r1 = random.randint(-30, 30)
    r2 = random.randint(-20, 20)
    delay = round(random.uniform(0.2, 1.8), 2)
    dur = round(random.uniform(3.0, 5.0), 1)

    kf = f'flyP{i}'
    all_keyframes += f"@keyframes {kf}{{0%{{opacity:0;transform:translate(0,0) scale(.3) rotate(0deg)}}8%{{opacity:1;transform:translate(0,-20px) scale(.8)}}25%{{opacity:1;transform:translate({x1}px,{y1}px) scale(1) rotate({r1}deg)}}50%{{opacity:1;transform:translate({x2}px,{y2}px) scale(.95) rotate({r2}deg)}}75%{{opacity:.6;transform:translate({x3}px,{y1//2}px) scale(.8) rotate({r1+r2}deg)}}100%{{opacity:0;transform:translate({x3}px,20px) scale(.4) rotate(0deg)}}}}\n    "
    all_elements += f'<div class="fly-product" style="animation:{kf} {dur}s ease-in-out {delay}s infinite"><img src="{src}" alt="{name}" style="width:{w}px;height:{h}px"/></div>\n'

# 꽃가루 60개
for i in range(60):
    x1 = random.randint(-300, 300)
    y1 = random.randint(-350, -150)
    x2 = x1 + random.randint(-100, 100)
    y2 = y1 + random.randint(-80, 80)
    x3 = x2 + random.randint(-80, 80)
    size = random.randint(5, 14)
    color = colors[i % len(colors)]
    delay = round(random.uniform(0.0, 2.0), 2)
    dur = round(random.uniform(2.5, 5.0), 1)
    r = random.randint(0, 720)
    shape = random.choice(['50%', '2px', '0'])

    kf = f'flyC{i}'
    all_keyframes += f"@keyframes {kf}{{0%{{opacity:0;transform:translate(0,0) rotate(0deg) scale(.2)}}10%{{opacity:1}}30%{{opacity:1;transform:translate({x1}px,{y1}px) rotate({r}deg) scale(1.1)}}60%{{opacity:.7;transform:translate({x2}px,{y2}px) rotate({r*2}deg) scale(.8)}}100%{{opacity:0;transform:translate({x3}px,{random.randint(-30,30)}px) rotate({r*3}deg) scale(.2)}}}}\n    "
    all_elements += f'<div class="fly-confetti" style="width:{size}px;height:{int(size*0.6)}px;background:{color};border-radius:{shape};animation:{kf} {dur}s ease-out {delay}s infinite"></div>\n'

# 리본줄 20개
for i in range(20):
    x1 = random.randint(-280, 280)
    y1 = random.randint(-350, -200)
    x2 = x1 + random.randint(-60, 60)
    length = random.randint(20, 50)
    color = colors[i % len(colors)]
    delay = round(random.uniform(0.1, 1.8), 2)
    dur = round(random.uniform(3.0, 5.5), 1)
    r = random.randint(-180, 180)
    r2 = r + random.randint(-90, 90)

    kf = f'flyR{i}'
    all_keyframes += f"@keyframes {kf}{{0%{{opacity:0;transform:translate(0,0) rotate(0deg)}}12%{{opacity:.8}}30%{{opacity:.8;transform:translate({x1}px,{y1}px) rotate({r}deg)}}65%{{opacity:.5;transform:translate({x2}px,{y1+random.randint(50,150)}px) rotate({r2}deg)}}100%{{opacity:0;transform:translate({x2}px,{random.randint(-20,20)}px) rotate({r*2}deg)}}}}\n    "
    all_elements += f'<div class="fly-ribbon-piece" style="height:{length}px;background:{color};animation:{kf} {dur}s ease-out {delay}s infinite"></div>\n'

# 불꽃 스파크 30개
for i in range(30):
    x1 = random.randint(-250, 250)
    y1 = random.randint(-300, -180)
    delay = round(random.uniform(0.0, 1.5), 2)
    dur = round(random.uniform(1.5, 3.5), 1)
    color = random.choice(['#f1c40f','#fff','#ff6b6b','#6bfff1','#ff9ff3'])
    size = random.randint(3, 7)

    kf = f'flyS{i}'
    all_keyframes += f"@keyframes {kf}{{0%{{opacity:0;transform:translate(0,0)}}15%{{opacity:1;transform:translate({x1//2}px,{y1//2}px)}}30%{{opacity:1;transform:translate({x1}px,{y1}px)}}100%{{opacity:0;transform:translate({x1+random.randint(-50,50)}px,{random.randint(-50,50)}px)}}}}\n    "
    all_elements += f'<div class="fly-spark" style="width:{size}px;height:{size}px;background:{color};animation:{kf} {dur}s ease-out {delay}s infinite"></div>\n'

# info-card를 선물상자 HTML로 교체
gift_html = f"""<div class="gift-scene fade">
        <div class="gift-canvas">
          {all_elements}
        </div>
        <div class="gift-box-wrap">
          <div class="gift-lid">
            <div class="gift-lid-top"></div>
            <div class="gift-ribbon-h"></div>
          </div>
          <div class="gift-base">
            <div class="gift-ribbon-v"></div>
            <div class="gift-glow"></div>
          </div>
        </div>
      </div>
    </div>"""

content = content[:ic_start] + gift_html + content[ic_end:]

# CSS 삽입 (pc-tag CSS에 이미 추가한 것 뒤에 gift CSS + keyframes)
# .ic- 관련 CSS 뒤에 gift CSS 삽입
ic_css_start = content.find('.info-card{')
if ic_css_start > 0:
    ic_css_end = content.find('/* ── DEVELOP ── */')
    # info-card CSS를 gift-scene CSS로 교체
    old_ic_css = content[ic_css_start:ic_css_end]
    content = content[:ic_css_start] + gift_css + '\n    ' + all_keyframes + '\n    ' + content[ic_css_end:]

# ===== 8. 연락처에 로고+회사명 추가 =====
old_contact = '<div class="contact-card fade">\n        <h3>연락처 정보</h3>'
new_contact = f"""<div class="contact-card fade">
        <div class="cc-header">
          <img src="{logo_src}" alt="ARKEN" class="cc-logo"/>
          <div class="cc-name"><h3>주식회사 아켄</h3><span>ARKEN Co., Ltd.</span></div>
        </div>"""
content = content.replace(old_contact, new_contact)

# ===== 9. 모바일 반응형 =====
old_mobile = '      .dev-card-img{width:100%;display:flex;justify-content:center}\n      .app-screen{width:180px;margin:0 auto}'
new_mobile = '      .dev-card-img{width:100%;display:flex;justify-content:center}\n      .app-screen{width:180px;margin:0 auto}\n      .proj-grid{grid-template-columns:1fr}\n      .pc-wide{grid-template-columns:1fr}\n      .pc-wide .pc-left{max-height:220px;overflow:hidden}'
content = content.replace(old_mobile, new_mobile)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('All done!')
