# 📋 KOSNOVA 일일 보고서 — 2026-06-30 (화) 08:01 KST

> 자동 생성 · ARKEN KOSNOVA 일일 점검 루틴

---

## ⚠️ 긴급 이슈 요약

1. **[보안] auth/callback 이메일 로깅** — `KOMOSHNIK/app/auth/callback/route.ts:23` 에서 `data.user.email` 이 `console.log`로 출력 중. 프로덕션 배포 전 즉시 제거 필요.
2. **[보안] webpack SSRF 취약점** — `webpack 5.x` SSRF 취약점, `npm audit fix` 로 수정 가능 (KOSNOVA/KOMOSHNIK 모두).
3. **[보안] xlsx Prototype Pollution + ReDoS** — 공식 수정 버전 없음. 대체 라이브러리 교체 검토 필요.

---

## 파트 1 · 한국 정착 정보

### 💱 오늘의 환율 (2026-06-30)

| 통화쌍 | 환율 | 비고 |
|--------|------|------|
| USD/KRW | ₩1,534 | 2026-06-26 기준, 고환율 지속 |
| RUB/KRW | ₩18.6 | 1루블당 원화 (미드마켓 기준) |
| 6월 범위 | 1,500~1,560원 | 변동성 주의 |

### 📌 콘텐츠 A: 2026년 비자·법률·생활 정보 요약

**▸ K-STAR 비자트랙 신설** — 국내 이공계 석·박사 졸업 외국인을 위한 영주권 패스트트랙. 기존 5개 이공계 특수대학에서 서울대·고려대·연세대 등 27개 일반대학 추가, 총 32개 대학으로 확대.

**▸ 방문취업(H-2) 비자 신규 발급 중단** — 2026년 2월 12일부로 중단. 중국·구소련 지역 동포는 재외동포(F-4) 비자로 통합. H-2 비자 소지자는 갱신 필요.

**▸ F-4 영주권 요건 완화** — 한국어 능력 및 봉사활동 실적에 따라 F-5(영주권) 소득 요건 완화. 장기체류 동포에게 유리.

**▸ D-2 유학비자 제한** — 2026년 가을학기부터 부실 관리 20개 대학(학위 16, 어학원 4) 신규 유학비자 1년간 금지. 입학 예정자 주의.

**▸ 고유가 피해지원금 외국인 수령 가능** — 영주권자(F-5)·결혼이민자(F-6)·난민인정자(F-2-4)로 건강보험 가입자에 한해 지원금 수령 가능.

**▸ 주거급여 외국인 수령** — 결혼이민자 및 한국 국적 자녀 양육 외국인 부모 대상. 2026년 서울 기준 1인 가구 최대 월 369,000원, 2인 가구 414,000원.

### 💡 콘텐츠 B: 환율 & 생활 요약

원/달러 환율이 1,534원 수준을 유지하며 고환율 기조가 지속 중입니다. 러시아 루블화는 1루블 ≈ 18.6원으로 지난 보고(20.6원) 대비 소폭 하락했습니다. 러시아 MIR 카드는 한국에서 여전히 사용 불가이며, 한국 내 CIS 커뮤니티 환전 네트워크가 주요 대안입니다. 외국인종합안내센터(☎ 1345)에서 러시아어 포함 다국어 생활 민원 상담을 무료로 제공합니다.

> 💡 **KOMOSHNIK 활용 아이디어**: H-2→F-4 비자 통합 안내 배너 + 고유가 지원금 자격 확인 기능 검토 권장

---

## 파트 2 · 코드 야간 점검 결과

### 📦 최근 7일 커밋

**arken_homepage** (14건):
```
b22b5b5 Feat: komoshnik 페이지 모바일 최적화 — 햄버거 네비 메뉴 추가
19d6f4b Style: 다운로드 QR — 앱별 주황 테두리 박스 + 카드 하단 웹 주소
e87ffad Fix: QR 구분선 가시성 문제 — 네이비 톤으로 변경
c544e07 Add: KOMOSHNIK/KOSNOVA 스토어 다운로드 QR 및 링크 (KR/RU/EN)
ac8b7ea Add: AI 뉴스 브리핑 - 2026-06-29
... (총 14건)
```

**KOSNOVA-WORKSPACE** (12건):
```
3fe713d feat(studio): 진행상황(체크박스/KPI/회고) 저장 API 추가
9d35a6d fix(studio): integrated-users-data 빌드 타입오류 수정
61689fa feat(studio): KOMOSHNIK Studio 연동용 external API 추가
d084a1d fix(KOSNOVA-APP): webview_flutter_wkwebview direct dependency 추가
af38bd4 feat(KOSNOVA marketing): GA4 전환 이벤트 2종 추가
f351989 fix(KOSNOVA-APP): iOS 심사 거절 대응 (1.0.55+67)
... (총 12건)
```

### 🛡️ 보안 점검 결과

| 항목 | arken_homepage | KOSNOVA-WORKSPACE | 판정 |
|------|---------------|-------------------|------|
| .env gitignore 등록 | ✅ 정상 | ✅ 정상 | PASS |
| API 키 하드코딩 | ✅ 없음 | ✅ 없음 | PASS |
| 민감정보 console.log | ✅ 없음 | ❌ 이메일 로깅 발견 | **FAIL** |
| npm 취약점 (high) | - | ❌ KOSNOVA 16건 / KOMOSHNIK 10건 | **FAIL** |

### 🚨 긴급 이슈 상세

**① auth/callback 이메일 로깅** (`KOMOSHNIK/app/auth/callback/route.ts:23`)

```ts
// ⚠️ 아래 코드에서 email이 서버 로그에 기록됨
console.log('[Auth Callback] 세션 생성 성공:', {
  userId: data.user.id,
  email: data.user.email,   // ← 민감정보 로깅
  emailConfirmed: !!data.user.email_confirmed_at,
  type
})
```

**조치**: 프로덕션 배포 전 이메일 필드 제거 또는 `process.env.NODE_ENV === 'development'` 조건부 처리.

**② webpack SSRF 취약점** (수정 가능)

```bash
# KOSNOVA, KOMOSHNIK 각각 실행
npm audit fix
```

취약점: webpack `buildHttp` SSRF (URL userinfo 우회) — `npm audit fix`로 수정 가능, 브레이킹 체인지 없음.

**③ xlsx Prototype Pollution + ReDoS** (수정 불가)

```
Prototype Pollution in sheetJS — GHSA-4r6h-8v6p-xvw6
SheetJS ReDoS — GHSA-5pgg-2g8v-p4x9
No fix available
```

**조치**: KOSNOVA에서 xlsx 사용 여부 파악 후 `exceljs` 또는 `fast-xlsx`로 교체 검토.

**④ ws 메모리 관련 취약점** (수정 가능)

`ws 8.0.0–8.20.1` — 메모리 공개(Memory Disclosure) + DoS. `npm audit fix`로 함께 해결됨.

### 🧹 코드 품질 점검

| 항목 | arken_homepage | KOSNOVA-WORKSPACE | 판정 |
|------|---------------|-------------------|------|
| console.log 수 | 0건 | **1,754건** | 개선 권장 |
| TODO/FIXME | 0건 | 12건 (실질 2건) | 정보 |

**console.log 주요 발생 파일 (KOSNOVA-WORKSPACE)**:
- `app/auth/callback/route.ts` — 이메일 등 민감정보 포함 ⚠️ 우선 제거
- `components/institution/AIRecommendations.tsx` — API 응답/tier 디버그 로깅
- `components/map/InstitutionMap.tsx` — 마커 클릭/줌 이벤트 로깅
- `app/(main)/settlement/[visaType]/SettlementClient.tsx` — 데이터 구조 디버그

**console.log 권장 조치** (`next.config.js`):
```js
compiler: { removeConsole: { exclude: ['error', 'warn'] } }
```

**TODO 목록 (KOSNOVA-WORKSPACE)**:
- `KOMOSHNIK/app/api/recommendations/route.ts:204` — 검색 이력 테이블 미구현
- `KOMOSHNIK/lib/api/institutions-api.ts:379` — ML 모델 확장 예정

### ✅ 정상 확인 항목

- .env 파일 모든 저장소에서 gitignore 정상 등록
- API 키 하드코딩 없음 (소스코드 전체 스캔)
- arken_homepage console.log 0건 (매우 깨끗)

---

## 📊 오늘의 요약

| 구분 | 건수 | 비고 |
|------|------|------|
| 🔴 긴급 보안 이슈 | 3건 | 이메일 로깅, webpack SSRF, xlsx 취약점 |
| 🟠 npm 취약점 (high) | 26건 | KOSNOVA 16 + KOMOSHNIK 10 |
| 🟡 개선 권장 항목 | 1건 | console.log 1,754건 정리 |
| 📝 TODO 미해결 | 2건 | recommendations, ML 모델 |
| 🟢 보안 통과 항목 | 2/4건 | env, API키 정상 |
| 📦 7일 신규 커밋 | 26건 | arken_homepage 14 + KOSNOVA-WORKSPACE 12 |

---
*자동 생성 · 2026-06-30 08:01 KST · ARKEN KOSNOVA 일일 점검 루틴*
