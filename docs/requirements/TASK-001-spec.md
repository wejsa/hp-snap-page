# TASK-001: 풀페이지 스크롤(섹션 스냅 스크롤) 홈페이지

## 개요

기업 홈페이지를 풀페이지 스크롤 방식으로 구현한다. 각 섹션이 뷰포트 전체를 차지하며, 마우스 스크롤/터치 시 다음 섹션으로 자연스럽게 스냅 전환된다. reqm.co.kr과 유사한 UX를 React + TypeScript로 구현한다.

## 목적

- 기업 홈페이지의 첫인상을 극대화하는 몰입형 풀스크린 UI 제공
- 섹션별 순차 탐색으로 핵심 메시지 전달력 향상
- 모바일/데스크톱 모두 지원하는 반응형 풀페이지 스크롤

## 기능 요구사항

### FR-001: 프로젝트 초기 셋업
- **설명**: React + TypeScript + Vite 프로젝트 스캐폴딩 및 기본 구조 구성
- **우선순위**: P0 (필수)
- **수용 기준**:
  - `npm run dev`로 로컬 개발 서버 실행 가능
  - TypeScript strict 모드 활성화
  - 기본 디렉토리 구조 수립 (`src/components/`, `src/pages/`, `src/styles/`)

### FR-002: 풀페이지 스크롤 컨테이너
- **설명**: CSS `scroll-snap-type: y mandatory` 기반 풀페이지 스크롤 컨테이너 구현
- **우선순위**: P0 (필수)
- **수용 기준**:
  - 마우스 휠/터치 스크롤 시 섹션 단위로 스냅 전환
  - 각 섹션이 정확히 100vh를 차지
  - 키보드 방향키(↑↓) 및 Page Up/Down 지원
  - 부드러운 스크롤 전환 (`scroll-behavior: smooth`)

### FR-003: Hero 섹션
- **설명**: 메인 비주얼 + 타이틀 + CTA 버튼이 있는 첫 화면
- **우선순위**: P0 (필수)
- **수용 기준**:
  - 전체 화면 배경 이미지 또는 그라데이션
  - 회사명/슬로건 텍스트 애니메이션 (fade-in)
  - CTA 버튼 ("자세히 보기" → 다음 섹션으로 스크롤)
  - 스크롤 유도 아이콘 (하단 바운스 애니메이션)

### FR-004: About 섹션
- **설명**: 회사 소개 / 핵심 가치 섹션
- **우선순위**: P1 (높음)
- **수용 기준**:
  - 회사 소개 텍스트 + 이미지/아이콘 레이아웃
  - 섹션 진입 시 fade-in 애니메이션 (Intersection Observer)

### FR-005: Services 섹션
- **설명**: 서비스/제품 소개 카드 레이아웃
- **우선순위**: P1 (높음)
- **수용 기준**:
  - 3~4개 서비스 카드 그리드 배치
  - 섹션 진입 시 카드 순차 등장 애니메이션 (stagger)
  - 호버 시 카드 확대/그림자 효과

### FR-006: Contact 섹션 + Footer
- **설명**: 문의 정보 및 푸터
- **우선순위**: P1 (높음)
- **수용 기준**:
  - 연락처 정보 (이메일, 전화, 주소)
  - 간단한 문의 폼 UI (프론트엔드만, 백엔드 연동 없음)
  - 저작권 표시 푸터

### FR-007: 네비게이션
- **설명**: 상단 고정 헤더 + 우측 섹션 인디케이터(도트 네비게이션)
- **우선순위**: P0 (필수)
- **수용 기준**:
  - 상단 고정 헤더 (로고 + 메뉴)
  - 스크롤 시 헤더 배경 변화 (투명 → 반투명)
  - 우측 도트 네비게이션: 현재 섹션 하이라이트
  - 도트 클릭 시 해당 섹션으로 이동
  - 메뉴 클릭 시 해당 섹션으로 스크롤

### FR-008: 반응형 디자인
- **설명**: 모바일/태블릿/데스크톱 반응형 대응
- **우선순위**: P0 (필수)
- **수용 기준**:
  - 모바일 (< 768px): 햄버거 메뉴, 터치 스크롤 스냅 정상 동작
  - 태블릿 (768~1024px): 적응형 레이아웃
  - 데스크톱 (> 1024px): 풀 레이아웃

## 비기능 요구사항

### 성능
- Lighthouse Performance 점수 90+ 목표
- 첫 화면 렌더링(FCP) 1.5초 이내
- 이미지 lazy loading 적용

### 접근성
- 키보드 네비게이션 지원 (Tab, Arrow keys)
- 시맨틱 HTML (`<header>`, `<section>`, `<footer>`)
- 적절한 ARIA 레이블

### 브라우저 호환성
- Chrome, Firefox, Safari, Edge 최신 2개 버전
- CSS scroll-snap은 모든 주요 브라우저에서 지원됨

## 기술 스펙

### 기술 스택
- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **스타일링**: CSS Modules 또는 styled-components
- **애니메이션**: CSS transitions + Intersection Observer API
- **패키지 매니저**: npm

### 영향 범위
- 신규 프로젝트 (그린필드) — 기존 코드 영향 없음

### 주요 컴포넌트 구조 (예상)
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx          # 상단 고정 헤더
│   │   ├── DotNavigation.tsx   # 우측 도트 네비게이션
│   │   └── Footer.tsx          # 푸터
│   ├── sections/
│   │   ├── HeroSection.tsx     # 메인 비주얼
│   │   ├── AboutSection.tsx    # 회사 소개
│   │   ├── ServicesSection.tsx  # 서비스 소개
│   │   └── ContactSection.tsx  # 문의/연락처
│   └── common/
│       ├── ScrollContainer.tsx  # 풀페이지 스크롤 컨테이너
│       └── AnimatedSection.tsx  # 진입 애니메이션 래퍼
├── hooks/
│   ├── useScrollSnap.ts        # 스크롤 스냅 상태 관리
│   └── useIntersectionObserver.ts
├── styles/
│   └── global.css              # 전역 스타일 + 스크롤 스냅
├── App.tsx
└── main.tsx
```

### 의존성
- `react`, `react-dom` (v18)
- `typescript` (v5)
- `vite` (빌드)
- 외부 풀페이지 라이브러리 사용하지 않음 (CSS 네이티브 구현)

## 테스트 계획

| 테스트 유형 | 항목 | 기준 |
|------------|------|------|
| 단위 테스트 | useScrollSnap 훅, useIntersectionObserver 훅 | 커버리지 80% |
| 통합 테스트 | 섹션 간 스크롤 전환, 도트 네비게이션 클릭 | 주요 시나리오 통과 |
| 시각적 테스트 | 반응형 레이아웃 (모바일/태블릿/데스크톱) | 3개 뷰포트 정상 렌더링 |
| 성능 테스트 | Lighthouse 측정 | Performance 90+ |

## 참고자료

- [CSS Scroll Snap (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap)
- [Intersection Observer API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- reqm.co.kr — 풀페이지 스크롤 참고 사이트
