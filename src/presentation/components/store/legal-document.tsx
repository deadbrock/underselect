import type { LegalDocumentContent } from '@shared/content/legal-documents';

interface LegalDocumentProps {
  document: LegalDocumentContent;
}

export function LegalDocument({ document }: LegalDocumentProps) {
  return (
    <article className="max-w-3xl space-y-8">
      <p className="text-muted-foreground text-sm">
        Última atualização: {document.lastUpdated}
      </p>

      {document.sections.map((section) => (
        <section key={section.id} id={section.id} className="space-y-3">
          <h2 className="text-lg font-medium tracking-tight">
            {section.title}
          </h2>

          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-muted-foreground text-sm leading-relaxed md:text-base"
            >
              {paragraph}
            </p>
          ))}

          {section.list?.length ? (
            <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm leading-relaxed md:text-base">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  );
}
