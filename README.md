# homepage-sample v0.1.0

기업 홈페이지 웹 애플리케이션

---

## 프로젝트 개요

| 항목 | 값 |
|------|-----|
| **도메인** | 🔧 범용 |
| **기술 스택** | Node.js + TypeScript, React + TypeScript |
| **인프라** | Docker Compose |

---

## 기술 스택

- **백엔드**: Node.js + TypeScript
- **프론트엔드**: React + TypeScript

---

## 에이전트 팀

| 에이전트 | 역할 |
|---------|------|
| 🎯 agent-pm | 총괄 오케스트레이터 |
| ⚙️ agent-backend | 백엔드 개발 |
| 🎨 agent-frontend | 프론트엔드 개발 |
| 👀 agent-code-reviewer | 코드 리뷰 |
| 📋 agent-planner | 기획/요구사항 정의 |

---

## 시작하기

```bash
# Claude Code 실행
claude

# 상태 확인
/skill-status

# 백로그 확인
/skill-backlog

# 다음 작업 가져오기
/skill-plan
```

---

## 디렉토리 구조

```
homepage-sample/
├── .claude/state/
│   ├── project.json      # 프로젝트 설정
│   └── backlog.json      # 백로그
├── docs/
│   └── requirements/     # 요구사항 문서
├── CLAUDE.md             # AI 에이전트 지시문
├── VERSION               # 프로젝트 버전
└── README.md             # 이 파일
```

---

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `/skill-status` | 프로젝트 상태 확인 |
| `/skill-backlog` | 백로그 조회/관리 |
| `/skill-feature` | 새 기능 기획 |
| `/skill-plan` | 설계 + 스텝 계획 수립 |
| `/skill-impl` | 코드 구현 (스텝별) |
| `/skill-review-pr` | PR 리뷰 |
| `/skill-merge-pr` | PR 머지 |

---

## Git 브랜치 전략

```
main (운영)
  └── develop (개발 통합)
        ├── feature/TASK-XXX-stepN
        └── bugfix/TASK-XXX-버그명
```

---

<!-- CUSTOM_SECTION_START -->
<!-- CUSTOM_SECTION_END -->

## 라이선스

MIT License
