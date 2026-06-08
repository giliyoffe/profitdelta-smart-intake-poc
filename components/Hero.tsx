import { siteContent } from "@/content/siteContent";
import { ButtonLink } from "./ButtonLink";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section id="top" className="overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-muted shadow-[0_1px_0_rgba(17,24,39,0.03)]">
            {siteContent.company.slogan}
          </p>
          <h1 className="max-w-4xl text-balance text-5xl font-bold tracking-normal text-ink sm:text-6xl lg:text-7xl">
            {siteContent.hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-muted">{siteContent.hero.subheadline}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={siteContent.cta.href}>{siteContent.cta.primary}</ButtonLink>
            <ButtonLink href="#proof-of-value" variant="secondary">
              {siteContent.cta.secondary}
            </ButtonLink>
          </div>

          <ul className="mt-9 grid gap-3 sm:grid-cols-3" aria-label="ProfitDelta value points">
            {siteContent.hero.trustPoints.map((point) => (
              <li className="flex items-start gap-3 text-sm font-semibold leading-6 text-ink" key={point}>
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-profit/10 text-xs text-profit">
                  Δ
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
