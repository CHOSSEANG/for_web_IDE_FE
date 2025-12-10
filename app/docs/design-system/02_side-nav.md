# 🎛 Side Navigation Bar 규칙

WebIC IDE 좌측에 위치하는 Main Navigation Bar 의 UI/UX 가이드라인입니다.

IDE의 모든 툴(FileTree / Chat / AI / Settings 등)은
이 네비게이션을 통해 접근합니다.

## 1. Layout & Width
요소	값
전체 너비	56px
내부 패딩	12px 0
아이콘 간 간격	18px
Top Section 패딩	12px
Bottom Section 패딩	12px

좌측 전체는 "툴 모음"이라는 느낌을 주기 위해
단색 패널 + 일렬 정렬 아이콘 형태를 유지합니다.

## 2. 아이콘 규칙

기본 크기: 20px

active 상태: WebIC Point Color 사용 (#4E5FFF)

inactive: var(--text-muted)

hover 시:

dark: var(--icon-hover-dark)

light: var(--icon-hover-light)

transition: 0.15s ease-in-out

아이콘은 모두 라운드된 1.5px stroke 계열 사용(Lucide 스타일).

## 3. Active Rule (선택된 메뉴 표시 방법)
필수 규칙

아래 2가지를 동시에 적용해 명확한 active 요소 제공:

아이콘 색상 → Point Color

왼쪽에 3px 굵기의 indicator bar

| │ | icon |
| active indicator |

Indicator 스타일
요소	값
너비	3px
radius	4px
color	#4E5FFF
transition	0.15s
## 4. 구성 요소 규칙

SideNav는 두 그룹으로 나뉩니다.

① Top Section

FileTree

Search(옵션)

Editor Tabs List (아이콘 버전)

Git(옵션)

② Bottom Section

Settings

ThemeToggle(선택)

UserToggle(선택)

Help

Bottom은 불필요하게 많아지지 않도록 4개 이하 유지.

## 5. Tooltip 규칙

아이콘만 노출되므로 Tooltip은 필수.

방향: Right

Delay: 0ms (즉시 표시)

Background: var(--bg-panel)

Border: 1px

Text: 12px

## 6. 스크롤 정책

아이콘 목록이 길어질 경우:

Top Section: 고정

Bottom Section: 고정

중간 목록만 y-scroll

vsCode UX 기준.

## 7. Interaction (동작 규칙)

클릭: 해당 패널 활성화

더블클릭: 없음

우클릭(옵션): context menu

드래그: 미사용 (Nav는 고정 구조)

## 8. Dark/Light Theme 예시
상태	색상
Dark 배경	#111725
Light 배경	#FFFFFF
Active Icon	#4E5FFF
Hover Icon	Blue 계열 강조
Divider	rgba(255,255,255,0.08)
END

다음 문서: FileTree UI 규칙