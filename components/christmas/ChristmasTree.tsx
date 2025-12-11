"use client";

import { useEffect } from "react";
import "./christmas.css"; // 아래 CSS를 별도 파일로 저장한다고 가정

export default function ChristmasTree() {
  useEffect(() => {
    const COLORS = ["#c0392b", "#f8f9fa", "#d68910", "#0e6655", "#27ae60"];
    const TOGGLE_CIRCLE_SIZE = 15;
    const ANIMATION_INTERVAL = 1000;

    const container = document.getElementById("tree-container");
    if (!container) return;

    const toggles = container.querySelectorAll<HTMLDivElement>(".toggle-switch");
    const circles = container.querySelectorAll<HTMLDivElement>(".circle");

    let counter = 0;

    const circleColors = new Map<HTMLDivElement, string[]>();
    const toggleBackgroundColors = new Map<HTMLDivElement, string[]>();
    const toggleCircleColors = new Map<HTMLElement, string[]>();

    const getTwoRandomColors = () => {
      const first = Math.floor(Math.random() * COLORS.length);
      let second = Math.floor(Math.random() * COLORS.length);
      while (second === first) {
        second = Math.floor(Math.random() * COLORS.length);
      }
      return [COLORS[first], COLORS[second]];
    };

    const getUniqueColorPairs = () => {
      const pair1 = getTwoRandomColors();
      let pair2 = getTwoRandomColors();
      while (pair2.includes(pair1[0]) || pair2.includes(pair1[1])) {
        pair2 = getTwoRandomColors();
      }
      return [pair1, pair2];
    };

    circles.forEach((circle) => {
      circleColors.set(circle, getTwoRandomColors());
    });

    toggles.forEach((toggle) => {
      const [bgColors, circleColorsPair] = getUniqueColorPairs();
      toggleBackgroundColors.set(toggle, bgColors);
      const circleElem = toggle.querySelector<HTMLElement>(".toggle-circle");
      if (circleElem) {
        toggleCircleColors.set(circleElem, circleColorsPair);
      }
    });

    const animateToggles = () => {
      toggles.forEach((toggle) => {
        const toggleCircle = toggle.querySelector<HTMLElement>(".toggle-circle");
        const size = parseInt(toggle.dataset.size || "70");
        const isLarge = toggle.classList.contains("toggle-switch-l");
        const shouldToggle = isLarge ? counter % 2 === 0 : counter % 2 !== 0;

        const translateX = shouldToggle ? size - TOGGLE_CIRCLE_SIZE : 0;
        const bgColors = toggleBackgroundColors.get(toggle);
        const circleColorsPair = toggleCircle
          ? toggleCircleColors.get(toggleCircle)
          : undefined;
        const bgColorIdx = shouldToggle ? 1 : 0;
        const circleColorIdx = counter % 2;

        toggle.style.backgroundColor = bgColors?.[bgColorIdx] ?? "";
        if (toggleCircle) {
          toggleCircle.style.transform = `translateX(${translateX}px)`;
          toggleCircle.style.backgroundColor = circleColorsPair?.[circleColorIdx] ?? "";
        }
      });
    };

    const animateCircles = () => {
      circles.forEach((circle) => {
        const colors = circleColors.get(circle);
        const idx = counter % 2;
        circle.style.backgroundColor = colors?.[idx] ?? "";
      });
    };

    const animate = () => {
      counter++;
      animateToggles();
      animateCircles();
    };

    animate();
    const interval = setInterval(animate, ANIMATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="tree-container" className="tree-widget">
      <div className="star"></div>

      <div className="level" id="level-1">
  <div className="circle"></div>
</div>

<div className="level" id="level-2">
  <div className="circle"></div>
  <div className="circle"></div>
</div>

<div className="level" id="level-3">
  <div className="toggle-switch toggle-switch-s" data-size="38">
    <div className="toggle-circle"></div>
  </div>
  <div className="circle"></div>
</div>

<div className="level" id="level-4">
  <div className="circle"></div>
  <div className="circle"></div>
  <div className="toggle-switch toggle-switch-s" data-size="38">
    <div className="toggle-circle"></div>
  </div>
</div>

<div className="level" id="level-5">
  <div className="circle"></div>
  <div className="toggle-switch toggle-switch-l" data-size="63">
    <div className="toggle-circle"></div>
  </div>
  <div className="circle"></div>
</div>

<div className="level" id="level-6">
  <div className="toggle-switch toggle-switch-s" data-size="38">
    <div className="toggle-circle"></div>
  </div>
  <div className="circle"></div>
  <div className="toggle-switch toggle-switch-s" data-size="38">
    <div className="toggle-circle"></div>
  </div>
  <div className="circle"></div>
</div>

<div className="level" id="level-7">
  <div className="circle"></div>
  <div className="toggle-switch toggle-switch-m" data-size="50">
    <div className="toggle-circle"></div>
  </div>
  <div className="circle"></div>
  <div className="circle"></div>
  <div className="circle"></div>
</div>


      {/* ... 이하 동일하게 모든 level 복붙 */}
      {/* 생략한 부분은 그대로 추가 가능 */}
    </div>
  );
}
