import InfoPageShell from "@/components/info-page-shell";
import SiteShell from "@/components/site-shell";

export const metadata = { title: "WEBIC - services" };

export default function AboutPage() {
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
    <SiteShell>
      <InfoPageShell
        highlight="coming soon"
        pageTitle="서비스 소개"
        pageSubtitle="WebIC에서 제공하는 다양한 협업 기능과 AI 기반 개발 도구를 살펴보세요."
        sections={sections}
        cta={{ label: "문의하기", href: "/contact" }}
      />
    </SiteShell>
  );
}
