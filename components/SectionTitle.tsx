type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
};

export function SectionTitle({ eyebrow, title, text, align = "left" }: SectionTitleProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-profit">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-3xl font-bold tracking-normal text-ink sm:text-4xl">{title}</h2>
      {text ? <p className="mt-5 text-lg leading-8 text-muted">{text}</p> : null}
    </div>
  );
}
