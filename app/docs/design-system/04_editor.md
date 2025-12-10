# ✏️ Editor Tabs & Code Editor 규칙

WebIC IDE의 중심인 코드 에디터 영역의 UI/UX 가이드입니다.
VSCode의 구조를 기본으로 하되, WebIC 브랜드 감성을 유지하는 방향으로 설계합니다.

## 1. Editor Layout 규칙

Editor 영역은 아래 2개의 컴포넌트로 구성됨:

① Tabs Area (탭 영역)
② Monaco Editor (코드 에디터)
## 2. Tabs Area 규칙
### 2.1 탭 높이 & 여백
요소	값
전체 탭 높이	36px
좌우 패딩	12px
탭 간 간격	0px (붙어 있는 형태 권장)
close 버튼 간격	6px
### 2.2 Tab Visual Style
기본(Inactive)

배경: transparent

텍스트 색: var(--text-muted)

아이콘 색: var(--text-muted)

border-bottom: 1px light-border

활성(Active)

배경: var(--bg-panel)

텍스트: var(--text-primary)

하단 강조바: 2px WebIC Point Color (#4E5FFF)

font-weight: 500

### 2.3 Tab Interaction 규칙

클릭 → 해당 파일 활성

더블클릭 → split editor 옵션(선택)

middle-click → 탭 닫기

탭이 많아지면 좌우 스크롤

드래그로 탭 위치 재정렬 가능

### 2.4 Close 버튼 규칙
요소	규칙
기본 상태	투명 아이콘 / opacity 0.5
hover	opacity 1.0
크기	14px
클릭 영역	넉넉하게 padding 4px

VSCode와 동일하게
활성 탭만 close 버튼 상시 표시,
비활성 탭은 hover 때만 표시.

## 3. Monaco Editor 규칙

WebIC의 핵심 영역이므로 세부 규칙을 명확히 정의함.

### 3.1 Editor Background / Border
요소	규칙
배경	var(--bg-editor)
border	좌/우는 없음, 상단은 Tabs와 연결, 하단은 상태바와 연결
### 3.2 Editor Font 규칙
항목	값
코드 폰트	"Fira Code", "JetBrains Mono"
기본 사이즈	14px
라인 높이	1.6
Ligature	true (옵션)
### 3.3 Editor Color Theme (Dark 기본)
요소	색상
코드 배경	#1B2539
현재 줄 강조	rgba(255,255,255,0.05)
선택 영역	rgba(78, 95, 255, 0.25)
주석	#7B8294
키워드	#4E91FF
문자열	#FFE56D
번호(라인넘버)	#6C789B

Light Mode 테마도 이후 확장.

### 3.4 Line Number 규칙

좌측 margin: 12px

color: muted

hover 시 컬럼 라인 표시 가능

### 3.5 Code Folding (접기/펼치기)

폴딩 아이콘 크기: 14px

hover 시만 표시

folding highlight: 0.1 alpha 파랑색

### 3.6 Minimap 규칙

선택 사항:

상태	규칙
기본	비활성 (off)
옵션	on 가능 (너비 60px)

WebIC는 깔끔함을 중시하여 기본 OFF 권장.

### 3.7 Editor Actions

ctrl/cmd + s → 자동 저장

ctrl/cmd + shift + p → Command Palette

ctrl + b → FileTree 토글

split view 지원

### 3.8 Error 표시

error underline: red

warning underline: yellow

gutter 아이콘 표시(⚠, ⛔)

hover tooltip로 에러 메시지 표시

## 4. Editor Scroll Behavior
요소	규칙
vertical scroll	부드럽게
horizontal scroll	Monaco 기본
Scrollbar 스타일	thin, minimal
## 5. File Save Indicator

탭에 ● 표시

unsaved: ●

saved: 없음

탭 이름 오른쪽에 붙음.

## 6. Split Editor 규칙

파일 우클릭 → Open to the Side

분할 시:

좌/우 또는 상/하 모드 지원

각 Editor 별 Tabs 독립 유지

사이 divider 사이즈: 4px

END

다음 문서: Right Panel (Chat/AI) 규칙