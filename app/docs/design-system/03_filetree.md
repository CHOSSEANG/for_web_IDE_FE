# 🌲 FileTree UI 규칙

WebIC IDE의 파일 탐색기(FileTree) 구성 요소에 대한 전역 UI/UX 가이드입니다.
VSCode의 구조를 기반으로 하되 WebIC 스타일에 맞게 단순하고 직관적으로 설계합니다.

## 1. FileTree Panel Layout
요소	값
패널 너비	240–260px
좌우 패딩	10px
상단 패딩	12px
내부 아이템 간격	4px
스크롤	y-scroll 허용
## 2. Folder / File 아이콘 규칙
🎯 원칙

아이콘은 파일명/폴더명 기반 자동 매핑(VSCode 아이콘 세트 기준)
WebIC에서는 VSCode 아이콘셋을 그대로 사용.

크기

기본 아이콘: 16px

root folder: 18px (선택)

라인 스타일

stroke 1.5px

둥근 모서리

채도 낮은 톤 유지

## 3. Indent 규칙 (들여쓰기)
깊이(depth)	값
1단계	12px
2단계	24px
3단계	36px
n단계	+12px

Indent 가이드라인:

수직 라인(indent guide) 표시 안 함

대신 indent 된 위치 + 아이콘 위치로 구조 파악 가능하게 함

## 4. Hover / Active 스타일
Hover 상태

배경: rgba(255,255,255,0.04) (dark)

텍스트: var(--text-primary)

아이콘: 살짝 밝아짐

Active 상태 (선택한 파일)
요소	스타일
배경	rgba(78, 95, 255, 0.25)
border	1px solid rgba(78, 95, 255, 0.4)
text	white
아이콘	full-color or white (둘 중 선택)

선택된 파일은 Editor 탭에서도 강조 표시됨.

## 5. Folder 열림/닫힘 규칙
닫힘(closed)

아이콘: folder.svg (또는 default_folder_closed)

텍스트 바로 오른쪽에 collapse arrow 표시 가능

열림(open)

아이콘: folder_opened.svg

arrow 방향 아래로

애니메이션

0.12s fade/slide

scale 변환 사용 금지

## 6. 파일 타입별 아이콘 규칙

일부 필수 매핑 규칙을 문서화함:

파일 확장자	아이콘 이름 예시
.js	js.svg
.ts	ts.svg
.jsx/.tsx	react.svg
.json	json.svg
.css	css.svg
.html	html.svg
.md	markdown.svg
.env	env.svg
.gitignore	git.svg
package.json	npm.svg
파일명 기반 매핑 우선순위

정확한 파일명 (예: package.json)

확장자 (예: .js, .md)

폴더 타입 (예: components/)

그 외 → default_file.svg

## 7. Context Menu (우클릭 메뉴)

필수 기능:

New File

New Folder

Rename

Delete

Reveal in Editor

Collapse All

UX 규칙:

우클릭 메뉴는 에디터 메뉴와 스타일 통일

radius 6px

shadow: 0 3px 8px rgba(0,0,0,0.2)

## 8. 검색(Search) 규칙 (선택)

FileTree 상단에 Search Bar 추가할 경우:

높이: 32px

radius: 6px

아이콘: 16px

디바운스: 200ms

검색 필터: 파일명 포함, 우선순위(폴더 > 파일)

## 9. Drag & Drop 규칙

react-arborist 기반

Folder 간 이동 가능

파일 순서 재배치 가능

Hover 시 drop position guide 표시
→ 색상: #4E5FFF, 두께: 2px

## 10. Error / Empty State
파일이 없을 때
(아이콘)  
아직 파일이 없습니다.  
파일을 추가해주세요.

에러가 날 경우

FileTree 영역에 error-toast 표시

IDE 전체가 깨지지 않도록 isolate 처리

## 11. FileTree Panel Behavior
동작	규칙
더블클릭	파일 → Editor에서 열기
드래그	파일/폴더 이동
ctrl/cmd + click	여러 파일 선택 지원
Right Panel 변경 시	FileTree 상태 유지
END

다음 문서: Editor Tabs & Code Editor 규칙