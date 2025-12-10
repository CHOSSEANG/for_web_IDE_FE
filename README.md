
# 📘 WebIC – Frontend 프로젝트 구조 안내 (for_webic)

## 1. 프로젝트 개요
WebIC(Web IDE + Metric)는 웹 기반 코드 편집기 환경에  
코딩 활동 데이터(타자 시간, 코딩량, 생산성 등)를 추적하는 Metric 기능을 결합한 서비스입니다.  
Monaco Editor 기반 IDE UI + GitHub Repository 연동 + AI 보조 기능을 포함합니다.

---

## 2. 폴더 구조
폴더구조는 상이할 수 있습니다. 컴포넌트 분리로 추가페이지나 링크 있을 수 있음. 
```
for_webic/
 ├─ app/
 │   ├─ (auth)/        # 로그인 / 회원가입 (Clerk)
 │   ├─ main/          # WebIC 메인 페이지
 │   ├─ layout.tsx     # 전체 레이아웃
 │   └─ globals.css    # 전역 스타일 (Tailwind)
 │
 ├─ components/
 │   ├─ sidebar/       # Left Sidebar, Navigation
 │   ├─ filetree/      # 파일트리 UI
 │   ├─ editor/        # Monaco Editor 컴포넌트
 │   ├─ terminal/      # (예정) Terminal UI
 │   ├─ replychat/     # 댓글/스레드 패널
 │   └─ ui/            # shadcn/ui 기반 공통 UI
 │
 ├─ lib/
 │   ├─ client/        # Clerk · Liveblocks · GitHub client
 │   ├─ utils/         # 유틸 함수
 │   └─ types/         # 타입 정의
 │
 ├─ public/
 │   └─ icons/         # 아이콘 파일
 │
 ├─ styles/
 │
 ├─ package.json
 └─ README.md
```
---

## 3. UI/UX 규칙

### 3.1 Component Design Rules
- 1 컴포넌트 = 1 기능  
- UI 컴포넌트는 components/ui/  
- IDE 기능 컴포넌트는 영역별 폴더 분리  
  (editor, filetree, sidebar, replychat 등)

### 3.2 Theme / Branding
- 기본 테마: Dark  
- 메인 컬러: Indigo / Blue  
- 포인트 컬러: Purple, Pink  
- 로고: 각진 형태 W / 사각형 파비콘에서도 선명

### 3.3 Layout Grid
- Left Sidebar  
- FileTree  
- Editor + Tabs  
- Right Panel(Chat/AI)

---

## 4. 기술 스택

| 기능 | 기술 |
|------|-------|
| 프레임워크 | Next.js |
| UI | TailwindCSS v3 + shadcn/ui |
| 에디터 | Monaco Editor |
| 인증 | Clerk |
| 실시간 협업 | Liveblocks |
| 상태관리 | React Hooks |
| 배포 | Vercel |

---

## 5. GitHub OAuth & Repo 연동 개요

### 5.1 1차 구현 범위
- GitHub OAuth 로그인  
- 사용자 Repo 목록 가져오기  
- Repo 선택 후 DB 저장  
- Repo 파일 구조 읽기

### 5.2 2차 확장 범위
- 파일 쓰기 → 커밋 기능  
- 브랜치 선택  
- 파일 업로드 기능

---

## 6. 공통 개발 규칙

### 6.1 임포트 규칙
- @/components/... alias 사용  
- 비즈니스 로직 → lib/  
- UI 요소 → components/ui/

### 6.2 스타일 규칙

필수 Tailwind 선언:

@tailwind base;
@tailwind components;
@tailwind utilities;

### 6.3 환경 변수
- .env.local  
- Clerk / Liveblocks / GitHub OAuth 키 필요

---

## 7. 실행 방법

### Install
npm install

### 개발 서버 실행
npm run dev

### Tailwind 오류 체크
- globals.css 내부에 @tailwind base 누락 여부 확인

---

## 8. 현재 이슈 정리

### 8.1 파일트리 아이콘 문제
react-arborist 기본 아이콘이 덮어써져 VSCode 스타일 아이콘 강제 적용 작업 필요.

### 8.2 ReplychatPanel 오류
Liveblocks Thread 렌더링 에러 발생 → 로그 기반 원인 분석 중.

---

## 9. 향후 작업 로드맵

### Week 1 — UI 구조 & 라우팅
- Clerk 로그인/회원가입  
- IDE 레이아웃 구축  
- Sidebar / FileTree / Editor 배치

### Week 2 — 기능 통합
- Monaco Editor 적용  
- FileTree 연동  
- GitHub OAuth → Repo 목록 표시

### Week 3 — 협업 기능 + Metric
- 타자 시간 Tracking 기능  
- Today/Weekly Graph 페이지 추가  
- Replychat 안정화

---

## 10. 참고 자료
- Monaco Editor 문서  
- GitHub OAuth Flow  
- 멘토링 가이드


--- 
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
