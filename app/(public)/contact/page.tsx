import InfoPageShell from "@/components/info-page-shell";
import SiteShell from "@/components/site-shell";

export const metadata = { title: "WEBIC - contact" };

export default function ContactPage() {
  const sections = [
    {
      title: "Support",
      description:
        "제품 문의나 기술적인 도움이 필요할 때 WebIC 지원팀이 24시간 응답합니다.",
      details: ["support@webic.dev", "+82-2-1234-5678", "실시간 채팅"],
    },
    {
      title: "Partnership",
      description:
        "교육기관이나 기업과 협업을 위한 파트너십을 언제든지 논의할 수 있습니다.",
      details: ["맞춤형 데모", "전담 CS 매니저", "NDA 기반 협업"],
    },
    {
      title: "Campus & Office",
      description:
        "서울과 세종 두 지역에서 온/오프라인 워크숍과 컨퍼런스를 주최하고 있습니다.",
      details: ["서울 강남구 테헤란로", "세종특별자치시 어진동", "주 1회 오픈 데이"],
    },
  ];

  return (
    <SiteShell>
      <InfoPageShell
        highlight="always available"
        pageTitle="문의하기"
        pageSubtitle="WebIC 팀과 직접 대화하고 협업의 문을 여세요."
        sections={sections}
        cta={{ label: "이메일 보내기", href: "mailto:hello@webic.dev" }}
      />
    </SiteShell>
  );
}
