export const metadata = {
  title: "WEBIC - Contact",
};

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
    <main className="w-full flex flex-col items-center px-6 py-20 gap-20">
      {/* Hero 영역 – 기존 페이지들과 동일 */}
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">문의하기</h1>
        <p className="text-text-muted text-lg">
          WebIC 팀과 직접 대화하고 협업의 문을 여세요.
        </p>
      </section>

      {/* Contact Cards – 동일한 카드 레이아웃 */}
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

      {/* CTA 영역 – 웰컴 톤에 맞춘 단일 액션 */}
      <div className="mt-4">
        <a
          href="mailto:hello@webic.dev"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
        >
          이메일 보내기
        </a>
      </div>
    </main>
  );
}
