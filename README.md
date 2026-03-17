# homepage-sample

기업 홈페이지 웹 애플리케이션

---

## 기술 스택

- **백엔드**: Node.js + TypeScript
- **프론트엔드**: React + TypeScript

---

## 프론트엔드 기법 분석 (섹션 1~7)

### 전체 구조: Full-page Scroll 패턴

외부 라이브러리 없이 순수 React로 **풀페이지 스크롤(Full-page Scroll)** 을 직접 구현했습니다.

### 1. 스크롤 하이재킹 (Scroll Hijacking)

브라우저 기본 스크롤을 가로채서 **섹션 단위 스냅 스크롤**로 동작합니다.

- **Wheel**: `e.preventDefault()`로 기본 스크롤 차단 → 스크롤 강도(`deltaY`)에 따라 1~5 섹션 점프
- **Touch**: `touchstart`/`touchend`로 스와이프 감지 (40px 이상 이동 시 섹션 전환)
- **Keyboard**: ArrowUp/Down, PageUp/Down 키 지원

영상 구간(섹션 1~5)에서는 강한 스크롤 시 한 번에 여러 섹션을 건너뛸 수 있습니다.

### 2. 커스텀 이징 애니메이션 (Custom Easing with rAF)

`scrollTo` API 대신 **`requestAnimationFrame`** 기반 수동 스크롤 애니메이션을 구현합니다.

- **ease-in-out-quad** 이징 함수로 부드러운 가감속
- 400ms 동안 `scrollTop`을 프레임마다 업데이트
- `isAnimating` ref로 중복 애니메이션 방지

### 3. 고정 비디오 배경 + 오버레이 (Fixed Video Background)

```
┌─────────────────────────┐
│  position: fixed (z:0)  │  ← 비디오 (전체화면 고정)
│  ┌───────────────────┐  │
│  │ rgba(0,0,0,0.3)   │  │  ← 반투명 오버레이
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ sections (z:1)    │  │  ← 콘텐츠가 위를 스크롤
│  └───────────────────┘  │
└─────────────────────────┘
```

- 비디오는 `position: fixed; inset: 0`으로 뷰포트에 고정
- `object-fit: cover`로 비율 유지 채움
- 섹션 6 이후 `opacity: 0` 전환 (0.6s ease)
- 오버레이(`rgba(0,0,0,0.3)`)로 텍스트 가독성 확보

### 4. 스크롤 연동 브랜드 텍스트 애니메이션 (Scroll-driven Brand Animation)

**핵심 기법** — 연속적 스크롤 진행률(`progress = scrollTop / vh`) 기반으로 동작합니다.

```
섹션1: "DOZN EXCHANGE" 투명
섹션2: "DOZN EXCHANGE" 페이드 인
섹션3: "DOZN     EXCHANGE" 라인 성장 시작, 글자 벌어짐
섹션4: "DOZN────────EXCHANGE" 라인 계속 성장
섹션5: "DOZN═══════════EXCHANGE" 라인 최대
섹션6: 흰 배경 + 검정 글자
섹션7: 키오스크 이미지 등장
```

- **브랜드 opacity**: progress 0.5~1.5에서 페이드 인, 6.5 이후 페이드 아웃
- **라인 너비**: progress 1.5~4.5에서 0→maxWidth(최대 520px) 성장
- **DOM 위치 계산**: `getBoundingClientRect`로 Z~E 글자 사이 실시간 측정 → 반응형에서도 정확한 라인 배치

### 5. rAF 기반 스크롤 성능 최적화

- 스크롤 이벤트를 `requestAnimationFrame`으로 쓰로틀링 (프레임당 1회 실행)
- `{ passive: true }`로 브라우저에 스크롤 차단 없음을 알림
- `will-change: opacity`, `will-change: width, left, bottom`으로 GPU 합성 레이어 힌트

### 6. 다크/라이트 모드 전환

섹션 6(index 5)부터 흰 배경으로 전환됩니다.

| 요소 | 어두운 모드 (섹션 1~5) | 밝은 모드 (섹션 6~7) |
|------|----------------------|---------------------|
| 비디오 배경 | 표시 | `opacity: 0` |
| 브랜드 텍스트 | 흰색 + text-shadow | 검정 (`#111`) |
| Navbar | 투명 | 반투명 흰색 + `backdrop-filter: blur` |
| Page indicator | 흰색 dot | 검정 dot |

모두 CSS `transition`으로 0.4~0.6초에 걸쳐 부드럽게 전환됩니다.

### 7. 키오스크 이미지 등장/퇴장 (섹션 7)

3단계 상태 전이:

| 상태 | 조건 | transform | opacity |
|------|------|-----------|---------|
| 숨김 | 섹션 < 7 | `translate(-50%, 30%)` (아래) | 0 |
| 등장 | 섹션 = 7 | `translate(-50%, -50%)` (중앙) | 1 |
| 퇴장 | 섹션 > 7 | `translate(-50%, -130%)` (위) | 0 |

- 등장: `cubic-bezier(0.16, 1, 0.3, 1)` — overshoot 이징으로 톡 튀어오르는 느낌
- 퇴장: `ease-in`으로 위로 빨려 올라가는 느낌
- 가로 위치는 Z와 E 글자의 중간점으로 자동 계산

### 기법 요약

| 기법 | 적용 위치 | 목적 |
|------|----------|------|
| Full-page snap scroll | 전체 | 섹션 단위 탐색 UX |
| rAF 커스텀 이징 | 섹션 전환 | 부드러운 가감속 |
| Fixed 비디오 + 오버레이 | 섹션 1~5 배경 | 몰입감 있는 비주얼 |
| Scroll-driven 연속 애니메이션 | 브랜드 텍스트/라인 | 스크롤에 반응하는 인터랙티브 로고 |
| getBoundingClientRect 실시간 측정 | 브랜드 라인/키오스크 | 반응형에서도 정확한 위치 |
| CSS transition 테마 전환 | 섹션 6~ | 어두운→밝은 모드 전환 |
| 3-state CSS 전이 | 키오스크 이미지 | 등장/퇴장 모션 |

---

## 라이선스

MIT License
