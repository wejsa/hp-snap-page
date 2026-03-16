# TASK-002: REQM 스타일 Hero 리디자인 — 영상 배경 + 스크롤 연동 텍스트 분할

## 개요

reqm.co.kr 메인페이지와 동일한 Hero 효과를 구현한다. 전체 화면 배경 영상 위에 "REQM" 텍스트가 표시되며, 스크롤 시 "RE"와 "QM" 사이의 간격이 점점 벌어지는 스크롤 연동(scroll-driven) 텍스트 분할 애니메이션을 적용한다.

## 목적

- reqm.co.kr과 동일한 몰입감 있는 Hero 경험 구현
- 스크롤 연동 인터랙티브 애니메이션으로 사용자 관심 유도
- 영상 배경으로 브랜드 이미지 강화

## 기능 요구사항

### FR-001: 영상 배경 Hero
- **설명**: 전체 화면 비디오 배경으로 Hero 섹션 교체
- **우선순위**: P0 (필수)
- **수용 기준**:
  - `<video>` 태그: autoplay, muted, loop, playsinline
  - 영상이 뷰포트 전체를 cover로 채움 (`object-fit: cover`)
  - 영상 위에 반투명 오버레이 (가독성 확보)
  - 영상 로드 전까지 다크 그라데이션 fallback
  - 샘플 영상은 public 폴더에 배치 (또는 외부 URL)

### FR-002: 스크롤 연동 텍스트 분할 애니메이션
- **설명**: "RE"와 "QM" 텍스트가 스크롤 진행도에 따라 좌우로 벌어지는 효과
- **우선순위**: P0 (필수)
- **수용 기준**:
  - 초기 상태: "REQM" 한 단어처럼 보임 (간격 0)
  - 스크롤 시: "RE" ← → "QM" 간격이 점진적으로 벌어짐
  - 최대 분리 시: 화면 양쪽 끝 근처까지 분리
  - 텍스트 페이드아웃: 스크롤 진행도 70% 이후 점차 투명해짐
  - 60fps 부드러운 애니메이션 (requestAnimationFrame 또는 CSS transform)

### FR-003: 스크롤 컨테이너 구조 변경
- **설명**: Hero의 스크롤 연동 애니메이션을 위해 scroll-snap 방식 변경
- **우선순위**: P0 (필수)
- **수용 기준**:
  - Hero 섹션: 높이 300vh (스크롤 여유 공간), 내부 콘텐츠는 `position: sticky; top: 0` (100vh)
  - 스크롤 컨테이너: `scroll-snap-type: y mandatory` → `y proximity`로 변경
  - 나머지 섹션(About, Services, Contact): 기존 100vh + snap-align 유지
  - 스크롤 유도 아이콘 유지

### FR-004: 스크롤 진행도 훅
- **설명**: Hero 섹션 내 스크롤 진행도(0~1)를 추적하는 커스텀 훅
- **우선순위**: P0 (필수)
- **수용 기준**:
  - `useScrollProgress(sectionRef, containerRef)` → progress: 0~1
  - Hero 섹션 상단이 뷰포트에 있을 때 0, 벗어나면 1
  - requestAnimationFrame 기반 성능 최적화
  - passive scroll 이벤트 리스너

## 비기능 요구사항

### 성능
- 스크롤 애니메이션 60fps 유지 (CSS transform 사용, layout thrashing 방지)
- 영상: 웹 최적화 포맷 (MP4 H.264), 파일 크기 5MB 이하 권장
- 모바일: 영상 대신 정적 이미지 fallback 옵션

### 접근성
- `prefers-reduced-motion`: 애니메이션 비활성화, 정적 "REQM" 표시
- 영상: `aria-hidden="true"` (장식 요소)

## 기술 스펙

### 영향 범위
- **수정**: `ScrollContainer.module.css` (snap 방식 변경), `App.tsx` (Hero 구조 변경), `HeroSection.tsx/css` (전면 재작성)
- **신규**: `useScrollProgress.ts` 훅, 샘플 영상 파일
- **유지**: AboutSection, ServicesSection, ContactSection, Header, DotNavigation (변경 없음)

### 핵심 구현 로직
```
Hero 섹션 (300vh)
├── sticky 컨테이너 (100vh, top: 0)
│   ├── <video> 배경 (fullscreen cover)
│   ├── 오버레이 (semi-transparent)
│   └── 텍스트 컨테이너
│       ├── "RE" (transform: translateX(-gap))
│       └── "QM" (transform: translateX(+gap))
│           gap = progress * maxDistance
└── 스크롤 여유 공간 (나머지 200vh)
```

### 의존성
- 기존 의존성만 사용 (추가 라이브러리 없음)
- 샘플 영상: public/videos/hero-bg.mp4 (사용자 제공 또는 placeholder)

## 테스트 계획

| 테스트 유형 | 항목 | 기준 |
|------------|------|------|
| 시각적 테스트 | 텍스트 분할 애니메이션 스무스 여부 | 60fps, jank 없음 |
| 기능 테스트 | 스크롤 진행도 0→1 정확성 | Hero 영역 내 정확한 progress 추적 |
| 반응형 | 모바일에서 영상/텍스트 동작 | 터치 스크롤 정상 동작 |
| 접근성 | prefers-reduced-motion | 모션 비활성화 시 정적 표시 |

## 참고자료

- reqm.co.kr — 텍스트 분할 효과 참조
- CSS `position: sticky` + 스크롤 진행도 패턴
