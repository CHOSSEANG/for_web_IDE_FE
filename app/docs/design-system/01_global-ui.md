# WebIC 🎨 Design System 
# Global UI 규칙 (1단계)

WebIC IDE의 모든 화면·컴포넌트가 따라야 하는 전역 UI/UX 가이드라인입니다.
프론트엔드 팀원 전체가 동일한 기준을 사용하도록 하기 위해 작성되었습니다.

## 1. Spacing Rules (여백 규칙)
항목	기준
기본 내부 여백	8px
패널 간 간격	12px
컴포넌트 간 간격	6–10px
페이지 외곽 여백	16px
## 2. Border & Divider 규칙

패널 구분선:
1px solid var(--border)

에디터와 패널 경계:
얇고 흐린 border 1px

탭(Tab) 하단 라인:
필요 시 1px 약한 border

FileTree indent 라인:
표시하지 않음 (심플 UI)

## 3. Radius(모서리 곡률)
컴포넌트	Radius
버튼	6px
Input	6px
모달	12px
기본 패널	0px (IDE 직선형 스타일 유지)
## 4. Shadow (그림자)
요소	Shadow
Top Bar	없음
드롭다운 / 메뉴	0 2px 6px rgba(0,0,0,0.15)
모달	0 4px 12px rgba(0,0,0,0.2)
## 5. Typography (폰트 규칙)
### Font Family

UI 기본: "Inter", "Pretendard", sans-serif

Editor(Monaco): "Fira Code", "JetBrains Mono"

### Font Size Guide
요소	크기
본문 텍스트	14px
FileTree 라벨	13px
Editor Tab	13–14px
Status Bar	12px
모달 제목	16–18px
## 6. Color System (Theme)
### 🌙 Dark Mode
Token	Value
--bg-base	#0A0F1D
--bg-panel	#111725
--bg-editor	#1B2539
--text-primary	#FFFFFF
--text-muted	#8B93A6
--border	rgba(255,255,255,0.08)
--icon-hover-dark	#7AA2FF
### ☀️ Light Mode
Token	Value
--bg-base	#F6F7FB
--bg-panel	#FFFFFF
--bg-editor	#FAFBFF
--text-primary	#1A1A1A
--text-muted	#6F7380
--border	rgba(0,0,0,0.08)
--icon-hover-light	#4E5FFF
## 7. Icon System

아이콘 라인 두께: 1.5px

사이즈:

좌측 네비게이션: 20px

일반 패널: 16px

아이콘 + 텍스트 간격: 6px

Theme Toggle / UserToggle: 24px 권장

## 8. Animation 규칙
허용

hover: 색상 변경 (0.15s ease)

패널 slide/fade: (0.2s)

탭 전환: 연한 opacity(0.15s)

비권장 (성능 악영향)

scale(확대/축소)

bounce(튀김 효과)

무거운 shadow transition

## 목적

WebIC IDE의 UI/UX 일관성 유지

팀원이 레이아웃/컴포넌트 개발 시 동일 기준 적용

유지보수 시 기준점 제공

디자이너와 개발자 간 커뮤니케이션 비용 절감

END

추가 규칙(예: FileTree, Editor 탭 스타일)은 다음 버전에서 이어서 작성됩니다.