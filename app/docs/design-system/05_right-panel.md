# 💬 Right Utility Panel 규칙

WebIC IDE 오른쪽 영역은 개발 보조 패널로 구성되며,
Chat / AI Assistant / ReplyChat / Terminal / Debug 등을 탭 형태로 포함합니다.

이 패널은 사용자가 작업하며 가장 자주 전환하는 보조기능이므로
UX적으로 직관적이고 빠르게 접근 가능한 구조여야 합니다.

## 1. Panel Layout 규칙
요소	값
기본 너비	360–420px
최소 너비	320px
최대 너비	600px
상단 패딩	12px
내부 여백	10–12px
border-left	1px solid var(--border)

Split된 Editor와 자연스럽게 연결되도록 Border는 얇고 밝은 색을 사용합니다.

## 2. Panel Tabs 규칙 (Chat / AI / Terminal 등)
탭 높이

34px

구조
-------------------------------------------------
|  Chat  |  AI  |  Reply  | Terminal | Debug |
-------------------------------------------------
|              Content Area                     |

스타일
기본(Inactive)

텍스트: var(--text-muted)

배경: 투명

아래 border: 1px light-border

활성(Active)

텍스트: var(--text-primary)

border-bottom: 2px WebIC Point Color (#4E5FFF)

배경: var(--bg-panel)

탭 아이콘

크기: 14px

아이콘+텍스트 간격: 6px

## 3. Content Area UI 규칙

각 패널의 콘텐츠 영역은 공통된 스타일로 통일합니다.

공통 규칙

padding: 12px

스크롤: y-scroll

배경: transparent (메인 테마 유지)

폰트: 14px

줄 간격: 1.5

## 4. Chat Panel 규칙

Chat Panel에서는 AI와의 대화형 UI를 표시합니다.

메시지 리스트

Gap: 12px

sender: 좌측

user: 우측 Blue bubble

시스템 메시지: muted tone

메시지 버블 스타일
AI 메시지

배경: rgba(255,255,255,0.05)

border: 1px solid var(--border)

radius: 8px

padding: 12px 14px

User 메시지

배경: #4E5FFF

color: white

radius: 8px

padding: 12px 14px

## 5. Chat Input 영역
요소	규칙
높이	44px
radius	8px
padding	10px
send 버튼	아이콘 22px
border	1px solid var(--border)
배경	var(--bg-panel)

input 영역은 항상 패널 하단에 고정되며
스크롤이 있어도 따라오지 않습니다.

## 6. AI Assistant Panel 규칙

AI Panel은 일반 채팅보다
코드 설명·에러 분석·자동 리팩토링 중심의 UI 구성.

Box 스타일

카드 형태

border: 1px solid rgba(255,255,255,0.12)

radius: 8px

margin-bottom: 12px

padding: 16px

코드 출력

Monaco Mini Editor 적용 가능

배경: var(--bg-editor)

radius: 6px

## 7. ReplyChat Panel 규칙 (실시간 협업 채팅)

ReplyChat은 Liveblocks 기반으로 제공하며 아래 규칙 적용:

메시지 스타일

avatar 표시

username 표시

시간 표시

시스템 메시지는 회색 small text

구분 기준

내가 보낸 메시지: 오른쪽

팀원이 보낸 메시지: 왼쪽

실시간 highlight: 1초 flash 효과

## 8. Terminal Panel 규칙

Terminal은 개발자용이므로 최소한의 꾸밈만 적용.

요소	규칙
배경	#0A0F1D 보다 약간 밝은 톤
폰트	JetBrains Mono
폰트 크기	13px
출력 라인 간격	1.4
입력바 높이	38px
border-top	1px solid var(--border)

터미널 내 스크롤은 반드시 독립되어야 함.

## 9. Debug Panel 규칙 (선택)

Stack trace

Console output

Variable inspector

Error highlight red tone(#FF5F5F) 사용

## 10. Panel Resize 규칙

Right Panel은 마우스로 드래그해 너비 변경 가능해야 함.

요소	값
Resizer width	4px
resizer hover	파랑(#4E5FFF)
min width	320px
max width	600px
## 11. Animation 규칙

Panel 애니메이션: slide-in 0.2s

tab switching: fade 0.15s

scale, bounce 등의 과도한 효과 금지

END

다음 문서: Status Bar 규칙