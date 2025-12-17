# 📦 WebIC Package 개발자 가이드

이 패키지는 웹 기반 IDE를 쉽고 빠르게 구축할 수 있도록 돕는 모듈입니다.
`Monaco Editor`, `Terminal`, `File System`, `Split Layout` 등이 모두 포함되어 있습니다.

## 📂 구조

```
webic_package/
├── components/
│   ├── editor/           # WebICEditor, MonacoEditor
│   ├── terminal/         # TerminalPanel
│   ├── files/            # FileTree, FileSidebar
│   └── ui/               # SplitLayout
├── styles/               # 테마 상수 (colors, initialFiles)
├── types/                # 타입 정의 (FileSystemItem)
├── hooks/                # 유틸리티 훅 (useClickOutside)
└── DEVELOPER_GUIDE.md    # 본 문서
```

## 🚀 시작하기

`WebICEditor` 컴포넌트를 사용하여 페이지 전체를 IDE로 구성할 수 있습니다.

```tsx
import WebICEditor from './webic_package/components/editor/WebICEditor'

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <WebICEditor />
    </div>
  )
}
```

## 🎨 스타일링 (Tailwind CSS)

이 패키지는 **Tailwind CSS**를 사용하여 스타일링되었습니다.
별도의 CSS 파일(`import './style.css'`) 없이, 컴포넌트 자체에 스타일이 포함되어 있습니다.
(단, Tailwind 설정을 공유하거나 JIT 모드가 활성화되어 있어야 합니다.)

## 🛠️ 주요 기능

### 1. 폴더 내 폴더 생성
파일 탐색기에서 폴더 항목에 마우스를 올리면 `+` (파일 추가) 버튼과 `📁+` (폴더 추가) 버튼이 나타납니다.
루트 경로에는 상단의 `EXPLORER` 헤더에 있는 버튼을 사용하세요.

### 2. 코드 실행
`MonacoEditor` 상단의 `Run` 버튼을 누르면 내부적으로 `new Function`을 사용해 코드를 실행하고 터미널의 `OUTPUT` 탭에 결과를 출력합니다.

### 3. 레이아웃 리사이징
`SplitLayout` 컴포넌트는 마우스 드래그를 통해 사이드바 너비와 터미널 높이를 조절할 수 있습니다.
