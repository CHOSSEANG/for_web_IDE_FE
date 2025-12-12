import InfoPageShell from "@/components/info-page-shell";
import SiteShell from "@/components/site-shell";

export const metadata = { title: "WEBIC - company sample" };

export default function CompanySamplePage() {
  const sections = [
    {
      title: "샘플 미션",
      description: "서비스 개발의 방향을 안내하는 핵심 메시지를 간결하게 담은 카드입니다.",
      details: ["목표 중심 스토리", "팀의 가치", "장기 비전 개요"],
    },
    {
      title: "운영 구조",
      description: "팀의 협업 방식이나 조직 구성을 간략히 정리할 수 있는 영역입니다.",
      details: ["기능별 파트", "일상적인 커뮤니케이션", "운영 주기"],
    },
    {
      title: "출시 계획",
      description: "앞으로의 마일스톤과 릴리즈 일정을 안내하는 설명을 담습니다.",
      details: ["UX 업데이트", "확장 기능", "고객 대상 워크숍"],
    },
  ];

  return (
    <SiteShell>
      <InfoPageShell
        highlight="sample design"
        pageTitle="회사 소개 샘플"
        pageSubtitle="WebIC 팀 소개 페이지를 참고해서 샘플 콘텐츠를 확인해보세요."
        sections={sections}
        cta={{ label: "자세한 일정 보기", href: "/contact" }}
      />
    </SiteShell>
  );
}
