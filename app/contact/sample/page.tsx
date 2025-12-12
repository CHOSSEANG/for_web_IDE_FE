import InfoPageShell from "@/components/info-page-shell";
import SiteShell from "@/components/site-shell";

export const metadata = { title: "WEBIC - contact sample" };

export default function ContactSamplePage() {
  const sections = [
    {
      title: "샘플 지원",
      description: "문의 흐름을 설명하는 텍스트와 샘플 연락처를 함께 보여줍니다.",
      details: ["이메일 응답 템플릿", "우선 처리 안내", "자주 묻는 질문 안내"],
    },
    {
      title: "샘플 파트너십",
      description: "협업 요청을 받아 처리하는 절차를 소개하는 카드입니다.",
      details: ["파트너 전담팀", "NDA 안내", "시범 운영 제안"],
    },
    {
      title: "샘플 오피스",
      description: "가상의 지점/위치나 지원 채널을 정리하는 형태로 제작합니다.",
      details: ["서울 HQ", "온라인 상담룸", "월간 웹 세미나"],
    },
  ];

  return (
    <SiteShell>
      <InfoPageShell
        highlight="sample contact"
        pageTitle="문의하기 샘플"
        pageSubtitle="실제 페이지처럼 보이도록 동일한 구성으로 예제 콘텐츠를 보여줍니다."
        sections={sections}
        cta={{ label: "지원 티켓 생성", href: "/contact" }}
      />
    </SiteShell>
  );
}
