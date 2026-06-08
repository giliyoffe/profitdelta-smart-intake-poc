import { siteContent } from "@/content/siteContent";
import { ButtonLink } from "./ButtonLink";

export function CTASection() {
  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="section-shell">
        <div className="grid gap-8 rounded-[1.5rem] bg-ink p-8 text-white shadow-lift sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="max-w-3xl text-balance text-3xl font-bold tracking-normal sm:text-4xl">
              {siteContent.finalCta.title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/72">{siteContent.finalCta.text}</p>
          </div>
          <ButtonLink href={siteContent.cta.href} className="bg-white text-ink hover:bg-profit hover:text-white">
            {siteContent.cta.primary}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
