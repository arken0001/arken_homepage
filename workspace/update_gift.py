import re, random

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

random.seed(77)
colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bdf','#ffa96b','#6bfff1','#c56bff','#ff9ff3','#54a0ff','#f368e0','#ff9f43','#ee5a24','#0abde3','#01a3a4','#5f27cd']

# 기존 CSS 교체
old_css_start = content.find('/* ── GIFT BOX ANIMATION ── */')
old_css_end = content.find('/* ── CONTACT CARD HEADER ── */')

new_css = """/* ── GIFT BOX ANIMATION ── */
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
    .fly-ribbon{position:absolute;bottom:100px;left:50%;width:4px;opacity:0;z-index:3;border-radius:2px}
    .fly-spark{position:absolute;bottom:100px;left:50%;border-radius:50%;opacity:0;z-index:3}
    @keyframes lidOpen{
      0%,90%,100%{transform:rotate(0deg)}
      10%{transform:rotate(-70deg)}
      20%{transform:rotate(-55deg)}
      80%{transform:rotate(-65deg)}
    }
    @keyframes giftGlow{
      0%,100%{opacity:.3;transform:translateX(-50%) scale(1)}
      50%{opacity:.8;transform:translateX(-50%) scale(1.5)}
    }
    """

content = content[:old_css_start] + new_css + content[old_css_end:]

# 제품 썸네일 추출
thumbs = re.findall(r'<div class="(?:fly-product|gift-product)"[^>]*>\s*<img src="([^"]+)" alt="([^"]+)"', content)
print(f'Found {len(thumbs)} thumbs')

all_keyframes = ''
all_elements = ''

# 제품 사진 10개
sizes = [(130,90),(90,65),(120,80),(100,70),(85,60),(115,80),(110,75),(95,68),(125,85),(80,58)]
for i, (src, name) in enumerate(thumbs):
    w, h = sizes[i]
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
    all_keyframes += f"""@keyframes {kf}{{
      0%{{opacity:0;transform:translate(0,0) scale(.3) rotate(0deg)}}
      8%{{opacity:1;transform:translate(0,-20px) scale(.8)}}
      25%{{opacity:1;transform:translate({x1}px,{y1}px) scale(1) rotate({r1}deg)}}
      50%{{opacity:1;transform:translate({x2}px,{y2}px) scale(.95) rotate({r2}deg)}}
      75%{{opacity:.6;transform:translate({x3}px,{y1//2}px) scale(.8) rotate({r1+r2}deg)}}
      100%{{opacity:0;transform:translate({x3}px,20px) scale(.4) rotate(0deg)}}
    }}
    """
    all_elements += f'<div class="fly-product" style="animation:{kf} {dur}s ease-in-out {delay}s infinite"><img src="{src}" alt="{name}" style="width:{w}px;height:{h}px"/></div>\n'

# 꽃가루 60개
for i in range(60):
    x1 = random.randint(-300, 300)
    y1 = random.randint(-300, -150)
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
    all_keyframes += f"""@keyframes {kf}{{
      0%{{opacity:0;transform:translate(0,0) rotate(0deg) scale(.2)}}
      10%{{opacity:1}}
      30%{{opacity:1;transform:translate({x1}px,{y1}px) rotate({r}deg) scale(1.1)}}
      60%{{opacity:.7;transform:translate({x2}px,{y2}px) rotate({r*2}deg) scale(.8)}}
      100%{{opacity:0;transform:translate({x3}px,{random.randint(-30,30)}px) rotate({r*3}deg) scale(.2)}}
    }}
    """
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
    all_keyframes += f"""@keyframes {kf}{{
      0%{{opacity:0;transform:translate(0,0) rotate(0deg)}}
      12%{{opacity:.8}}
      30%{{opacity:.8;transform:translate({x1}px,{y1}px) rotate({r}deg)}}
      65%{{opacity:.5;transform:translate({x2}px,{y1+random.randint(50,150)}px) rotate({r2}deg)}}
      100%{{opacity:0;transform:translate({x2}px,{random.randint(-20,20)}px) rotate({r*2}deg)}}
    }}
    """
    all_elements += f'<div class="fly-ribbon" style="height:{length}px;background:{color};animation:{kf} {dur}s ease-out {delay}s infinite"></div>\n'

# 불꽃 스파크 30개
for i in range(30):
    x1 = random.randint(-250, 250)
    y1 = random.randint(-300, -180)
    delay = round(random.uniform(0.0, 1.5), 2)
    dur = round(random.uniform(1.5, 3.5), 1)
    color = random.choice(['#f1c40f','#fff','#ff6b6b','#6bfff1','#ff9ff3'])
    size = random.randint(3, 7)

    kf = f'flyS{i}'
    all_keyframes += f"""@keyframes {kf}{{
      0%{{opacity:0;transform:translate(0,0)}}
      15%{{opacity:1;transform:translate({x1//2}px,{y1//2}px)}}
      30%{{opacity:1;transform:translate({x1}px,{y1}px)}}
      100%{{opacity:0;transform:translate({x1+random.randint(-50,50)}px,{random.randint(-50,50)}px)}}
    }}
    """
    all_elements += f'<div class="fly-spark" style="width:{size}px;height:{size}px;background:{color};animation:{kf} {dur}s ease-out {delay}s infinite"></div>\n'

# keyframes를 CSS에 추가
cc_pos = content.find('/* ── CONTACT CARD HEADER ── */')
content = content[:cc_pos] + all_keyframes + '\n    ' + content[cc_pos:]

# scene HTML 교체
scene_start = content.find('<div class="gift-scene fade">')
scene_end = content.find('</div>\n    </div>', scene_start) + len('</div>\n    </div>')

new_scene = """<div class="gift-scene fade">
        <div class="gift-canvas">
          """ + all_elements + """
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

content = content[:scene_start] + new_scene + content[scene_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
