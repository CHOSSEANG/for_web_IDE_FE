/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ['class'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Background Tokens */
        "bg-base": "var(--bg-base)",
        "bg-subtle": "var(--bg-subtle)",
        "bg-raised": "var(--bg-raised)",
        "bg-code-block": "var(--bg-code-block)",

        /* Text Tokens */
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",

        /* Borders */
        "border-light": "var(--border-light)",
        "border-strong": "var(--border-strong)",

        /* Brand Blues */
        "blue-600": "var(--blue-600)",
        "blue-500": "var(--blue-500)",
        "blue-400": "var(--blue-400)",
        "blue-300": "var(--blue-300)",

        /* Semantic Colors */
        "success": "var(--success)",
        "error": "var(--error)",
        "warning": "var(--warning)",
        "info": "var(--info)",
      },
    },
  },
  plugins: [],
};

/* 
배경 
bg-bg-base
bg-bg-subtle
bg-bg-raised
bg-bg-code-block

텍스트 
text-text-primary
text-text-secondary
text-text-muted

강조색
bg-blue-600
text-blue-500
border-blue-400
hover:bg-blue-300

경고/에러/성공
text-success
bg-error
border-warning
bg-info/20

적용예시 
Topbar
<div className="h-10 w-full bg-bg-raised border-b border-border-light text-text-primary">
  WebIC Topbar
</div>

sidebar
<div className="h-full w-56 bg-bg-subtle border-r border-border-strong text-text-secondary">
  Sidebar
</div>

Editor bg
<div className="bg-bg-base text-text-primary">
  <Editor />
</div>

button ex
<button className="bg-blue-600 text-white hover:bg-blue-500">
  Run
</button>

*/ 
