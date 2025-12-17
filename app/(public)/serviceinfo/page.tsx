import Logo from "@/components/brand/Logo";

export const metadata = { title: "WEBIC - services" };

export default function ServicePage() {
  const sections = [
    {
      title: "AI 도움 개발",
      description:
        "AI 코드 추천, 자동 리팩토링, 그리고 분석 결과를 IDE 안에서 바로 확인할 수 있도록 설계했습니다.",
      details: ["auto-complete", "버그 예측", "문서 생성"],
    },
    {
      title: "협업 파이프라인",
      description:
        "Liveblocks 기반으로 실시간 커서와 채팅, 공동 편집 기능을 제공하며 팀과 프로젝트를 하나의 공간에서 관리합니다.",
      details: ["공유 링크", "편집 히스토리", "역할 기반 권한"],
    },
    {
      title: "안정성과 확장성",
      description:
        "클라우드 인프라 위에 세션을 격리하고, 세부 보안 설정을 통해 기업 수준의 컴플라이언스를 준수합니다.",
      details: ["세션 격리", "로그 저장", "SSO/SCIM 지원"],
    },
  ];

  return (
    <main className="w-full flex flex-col items-center px-6 py-20 gap-20">
      {/* Hero 영역 – 웰컴과 동일한 톤 */}
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">서비스 소개</h1>
        <p className="text-text-muted text-lg">
          WebIC에서 제공하는 다양한 협업 기능과 AI 기반 개발 도구를 살펴보세요.
        </p>
      </section>

      {/* Feature Cards – 웰컴 스타일 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-6 rounded-lg bg-bg-raised border border-border-light flex flex-col gap-3"
          >
            <h3 className="font-semibold text-lg">{section.title}</h3>

            <p className="text-sm text-text-muted">
              {section.description}
            </p>

            <ul className="text-xs text-text-muted list-disc pl-4">
              {section.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
