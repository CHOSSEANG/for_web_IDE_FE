# Web IDE Frontend (Vite + React + TypeScript)

이 프로젝트는 Vite 기반의 Web IDE 프론트엔드입니다.  
VS Code 스타일의 UI, Monaco Editor, TailwindCSS(v3), shadcn/ui 컴포넌트 시스템 기반으로 개발됩니다.

---

## 🚀 Tech Stack

| Category        | Tech |
|-----------------|------|
| Frontend Build | Vite |
| UI Framework   | React + TypeScript |
| Styling        | Tailwind CSS **v3** |
| UI Components  | shadcn/ui |
| Icons          | lucide-react |
| Code Editor    | Monaco Editor |
| Layout Split   | react-resizable-panels |
| HTTP Client    | axios |
| State Mgmt     | React Context / Custom Hooks |

> ⚠️ **중요: Tailwind CSS는 반드시 v3 버전만 사용합니다.**  
> shadcn/ui와 Tailwind v4는 호환되지 않습니다.

---

## 📦 프로젝트 설치 방법

### 1) Clone
git clone https://github.com/CHOSSEANG/for_web_IDE_FE.git
cd for_web_IDE_FE



### 2) 패키지 설치
npm install



---

## 🛠 사용된 주요 라이브러리 설치 내역

### 1) TailwindCSS (v3)
    npm uninstall tailwindcss
    npm install -D tailwindcss@3 postcss autoprefixer
    npx tailwindcss init -p



### 2) shadcn/ui
    npx shadcn-ui init
    npm install class-variance-authority clsx tailwind-merge



### 3) lucide-react (아이콘)
    npm install lucide-react



### 4) Monaco Editor
    npm install monaco-editor @monaco-editor/react



### 5) Resizable Panels
    npm install react-resizable-panels



### 6) axios
    npm install axios



---

## 📁 프로젝트 구조

src/
├─ components/
│ ├─ Editor/ # Monaco Editor, Tabs, Panels
│ ├─ Auth/ # Login / Signup UI
│ ├─ common/ # Buttons, Inputs, shared UI
│
├─ context/ # AuthContext, FileContext
├─ hooks/ # useFileSystem, useTabs, useTheme 등
├─ pages/ # LoginPage, SignupPage, EditorPage
├─ styles/ # Tailwind + Theme styles
└─ main.tsx



---

## 🎨 UI / Styling

- Tailwind CSS v3 기반
- shadcn/ui 디자인 시스템 사용
- 다크모드/라이트모드 토글 지원 예정
- lucide-react 기반 아이콘 일원화

---

## ✏️ Monaco Editor 활용

- VS Code 스타일 에디터
- 기본 코드 렌더링
- 파일 열기/저장/모두 저장 기능
- 패널 레이아웃 분할 지원

---

## 🌱 향후 개발 단계

### ✔ 1단계 (진행 중)
- 파일/폴더 depth 3 트리 구현
- 상단 HeaderBar VSCode 스타일링

### ✔ 2단계 예정
- 템플릿 자동 생성(React/HTML/JS/TS)
- 우클릭 메뉴 (Rename / Delete)
- Drag & Drop 파일 이동
- 컨테이너 선택 화면 UX 제작

### ✔ 3단계
- 백엔드 API 연결 (로그인 / 회원가입 / 컨테이너)
- 코드 실행 API 연동

---

## 👥 Team

- Frontend: 3명  
- Backend: 2명  
- PM/Design + AI 기능 담당: 공동 또는 회의진행중 

---

## 📝 Notes

- 개발 환경 유지 위해 Node 18+ 권장
- Tailwind v4 절대 설치 금지
- 설치되지 않은 패키지는 Codex AI에서 설치 요청 시 **npm install 금지** (이미 설치됨을 전제)

---

## 📄 License

MIT
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
