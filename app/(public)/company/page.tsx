import InfoPageShell from "@/components/info-page-shell";
import SiteShell from "@/components/site-shell";

export const metadata = { title: "WEBIC - company" };

export default function CompanyPage() {
  const sections = [
    {
      title: "Our Mission",
      description:
        "브라우저 위에서 개발자가 자유롭게 협업하고 창의력을 발휘할 수 있는 환경을 만드는 것이 목표입니다.",
      details: ["개방형 개발 문화", "팀 중심 의사결정", "고객 중심 피드백"],
    },
    {
      title: "Core Values",
      description:
        "정확성과 속도, 그리고 진정성을 중요하게 생각하며 항상 사용자 경험을 앞세웁니다.",
      details: ["투명한 커뮤니케이션", "지속적인 학습", "책임감 있는 배포"],
    },
    {
      title: "지속 성장",
      description:
        "성장 가능성이 큰 WebIE(웹 IDE) 시장에서 뛰어난 엔지니어들과 협력하며 제품을 진화시키고 있습니다.",
      details: ["오픈 소스 연계", "커뮤니티 프로그램", "글로벌 확장 준비"],
    },
  ];

  return (
    <SiteShell>
      <InfoPageShell
        highlight="webic team"
        pageTitle="회사 소개"
        pageSubtitle="WebIC 팀이 어떤 비전과 방식으로 제품을 만드는지 보여줍니다."
        sections={sections}
        cta={{ label: "팀에 연락하기", href: "/contact" }}
      />
    </SiteShell>
  );
}
