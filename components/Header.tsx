import { siteContent } from "@/content/siteContent";
import { ButtonLink } from "./ButtonLink";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur-xl">
      <div className="section-shell flex min-h-20 items-center justify-between gap-5">
        <a className="focus-ring group flex items-center gap-3 rounded-full" href="#top" aria-label="ProfitDelta home">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-lg font-bold text-white transition group-hover:bg-delta">
            Δ
          </span>
          <span>
            <span className="block text-base font-bold tracking-normal text-ink">{siteContent.company.name}</span>
            <span className="hidden text-xs font-medium text-muted sm:block">{siteContent.company.slogan}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {siteContent.nav.map((item) => (
            <a
              className="focus-ring rounded-full text-sm font-semibold text-muted transition hover:text-ink"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ButtonLink href={siteContent.cta.href} className="hidden sm:inline-flex">
          {siteContent.cta.primary}
        </ButtonLink>
      </div>
    </header>
  );
}
