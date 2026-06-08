import { siteContent } from "@/content/siteContent";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-lg font-bold text-white">Δ</span>
            <div>
              <p className="font-bold text-ink">{siteContent.company.name}</p>
              <p className="text-sm text-muted">{siteContent.company.slogan}</p>
            </div>
          </div>
          <p className="mt-5 max-w-xl leading-7 text-muted">{siteContent.company.description}</p>
          <a className="focus-ring mt-4 inline-flex rounded-full text-sm font-semibold text-delta hover:text-profit" href={`mailto:${siteContent.company.email}`}>
            {siteContent.company.email}
          </a>
        </div>
        <div className="flex gap-5 text-sm font-semibold text-muted">
          <a className="focus-ring rounded-full hover:text-ink" href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="focus-ring rounded-full hover:text-ink" href={`mailto:${siteContent.company.email}`}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
