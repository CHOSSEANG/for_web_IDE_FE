"use client";

import { Tree } from "react-arborist";

// 1) MyNode 를 컴포넌트 밖으로 빼기 (핵심)
function MyNodeComponent({ node, style, dragHandle }) {
  console.log("🔥 MyNode 렌더됨:", node.data.name);

  return (
      <div
        ref={dragHandle}
        style={style}
        onClick={node.toggle}
        className="flex items-center gap-2 px-2 py-[3px]"
      >
        <img
          src="/icons/default_file.svg"
          alt="default file icon"
          className="w-4 h-4"
        />
        <span>{node.data.name}</span>
      </div>
  );
}

// 2) Tree 컴포넌트
const sampleData = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      { id: "2", name: "index.html", type: "file", children: [] },
      { id: "3", name: "styles.css", type: "file", children: [] },
      { id: "4", name: "main.js", type: "file", children: [] },
      { id: "5", name: "App.tsx", type: "file", children: [] },
      { id: "6", name: "components", type: "folder", children: [] }
    ],
  },
];

export function FileTree() {
  return (
    <Tree
      data={sampleData}
      initialOpen
      rowHeight={24}
      indent={20}
      renderNode={MyNodeComponent}   // ⭐ 함수 identity 변화 없음
    />
  );
}
