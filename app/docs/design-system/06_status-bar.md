# 📏 Status Bar UI 규칙

WebIC IDE의 하단에 위치하는 Status Bar는
파일/에디터 상태 정보를 요약해서 보여주는 IDE의 핵심 정보 패널입니다.

VSCode 스타일을 기반으로 WebIC 브랜드 톤에 맞게 간결하게 구성합니다.

## 1. Status Bar Layout
요소	값
높이	24–28px
좌측 padding	12px
우측 padding	12px
내부 컴포넌트 간 간격	10–14px
border-top	1px solid var(--border)
background	var(--bg-panel)
## 2. 기본 구조

Status Bar는 좌측 정보 / 우측 상태로 구성됨:

┌──────────────────────────────────────────────────────────┐
│  [file path]   [encoding]   [EOL]        [Git branch]    │
│                                                   [LN | COL]  │
└──────────────────────────────────────────────────────────┘

## 3. 표시해야 할 정보 요소

WebIC는 VSCode보다 단순하지만
IDE 필수 요소 6개는 꼭 들어가야 함.

① File Path

예: src/app/page.tsx

클릭 시: 파일 위치 이동 가능 (선택 기능)

② Language Mode

예: TypeScript, JavaScript, JSON, Markdown

클릭 시: 언어 변경 팝업 가능

③ Encoding

기본: UTF-8

④ EOL(Line Ending)

기본: LF

변환 가능 UI는 옵션

⑤ Git Branch

예: main, feature/ui-refactor

색상: branch active 색 (#4E5FFF)

⑥ Line / Column Position

예: Ln 32, Col 14

Editor 커서 움직일 때 실시간 업데이트

## 4. Typography
요소	규칙
글자 크기	12px
폰트	"Inter", sans-serif
weight	400
줄 높이	1

small하지만 가독성 좋은 Light UI.

## 5. Color & Styling
Text Colors
상태	색상
기본(primary)	var(--text-muted)
강조(active)	var(--text-primary)
branch	#4E5FFF (WebIC Point Color)
Background

Dark: var(--bg-panel)

Light: #ffffff (투명한 그림자 없음)

Hover

배경만 약간 어두워짐 (0.1 alpha)

## 6. Interaction Rules

StatusBar의 각 요소는 클릭 가능한 “미니 버튼”처럼 취급

요소	클릭 시 기능
File Path	파일 위치 이동 or Reveal 기능
Encoding	encoding 선택 메뉴
EOL	EOL 변경 메뉴
Language	언어 모드 선택
Git Branch	Git 패널 열기
Line/Column	이동 기능 없음 (단순 표시)
## 7. 아이콘 규칙

일부 항목은 텍스트 알파벳보다 아이콘이 더 직관적임
WebIC 권장 UI:

항목	아이콘
Git Branch	🌱 또는 git-branch 아이콘
Encoding	⌁ 또는 lucide icon
EOL	↵
Language	{} 아이콘

아이콘 크기: 14px

## 8. Error or Warning Indicators

Editor에 오류가 있을 경우 StatusBar 좌측에 표시:

Error

🔴 5 Errors

hover 시 tooltip로 상세 메시지

Warning

🟡 2 Warnings

아이콘은 가벼운 라인 스타일 유지.

## 9. Status Bar 위치 정책

항상 IDE 하단 고정 (sticky)

FileTree, Editor, Right Panel과 자연스럽게 이어진 border

Z-index 낮게 설정 (floating UI 아님)

## 10. Animation 규칙

Status Bar는 고정된 정보 패널이므로 애니메이션 최소화:

Hover 시 글자색만 변함

전환 애니메이션 없음

END

WebIC IDE UI/UX Design System 1차 버전 문서 전체 완료! 🎉d