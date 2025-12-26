export type TemplateId = "java" | "python" | "javascript";

export type TemplateMeta = {
  id: TemplateId;
  displayName: string;
  desc: string;
};

export const TEMPLATE_META: TemplateMeta[] = [
  {
    id: "java",
    displayName: "Java",
    desc: "Java runtime with Gradle/Maven support",
  },
  {
    id: "python",
    displayName: "Python",
    desc: "Python interpreter with pip tooling",
  },
  {
    id: "javascript",
    displayName: "JavaScript",
    desc: "Vanilla JavaScript runtime",
  },
];
