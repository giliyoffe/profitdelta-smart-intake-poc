type FeatureCardProps = {
  title: string;
  text?: string;
  index?: number;
};

export function FeatureCard({ title, text, index }: FeatureCardProps) {
  return (
    <article className="group rounded-lg border border-line bg-white p-6 shadow-[0_1px_0_rgba(17,24,39,0.03)] transition duration-200 hover:-translate-y-1 hover:border-delta/40 hover:shadow-soft">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-delta/10 text-sm font-bold text-delta">
          {typeof index === "number" ? String(index).padStart(2, "0") : "Δ"}
        </span>
        <h3 className="text-lg font-bold tracking-normal text-ink">{title}</h3>
      </div>
      {text ? <p className="leading-7 text-muted">{text}</p> : null}
    </article>
  );
}
