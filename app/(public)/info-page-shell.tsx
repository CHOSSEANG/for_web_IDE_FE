type InfoSection = {
  title: string;
  description: string;
  details?: string[];
};

type InfoPageShellProps = {
  pageTitle: string;
  pageSubtitle: string;
  highlight?: string;
  sections: InfoSection[];
  cta?: { label: string; href: string };
};

export default function InfoPageShell({
  pageTitle,
  pageSubtitle,
  highlight,
  sections,
  cta,
}: InfoPageShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 lg:px-0">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            WebIC overview
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {pageTitle}
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            {pageSubtitle}
          </p>
          {highlight && (
            <span className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
              {highlight}
            </span>
          )}
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{section.description}</p>
              {section.details && (
                <ul className="mt-4 space-y-2 text-sm text-slate-500">
                  {section.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-slate-900" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>

        {cta && (
          <div className="flex justify-center">
            <a
              href={cta.href}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-slate-800"
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
