const flow = [
  { title: "Manual work", metric: "14 hrs", detail: "Weekly repetition", tone: "bg-amber/10 text-amber" },
  { title: "AI automation", metric: "POC", detail: "Working system", tone: "bg-delta/10 text-delta" },
  { title: "Profit delta", metric: "+20%", detail: "Measured lift", tone: "bg-profit/10 text-profit" }
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:mx-0" aria-label="Manual work to AI automation to profit improvement visual">
      <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,rgba(18,86,214,0.16),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(12,143,105,0.15),transparent_30%)]" />
      <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-lift sm:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Automation map</p>
            <p className="mt-1 text-lg font-bold text-ink">Process value curve</p>
          </div>
          <span className="rounded-full bg-profit/10 px-3 py-1 text-sm font-bold text-profit">Δ + measurable</span>
        </div>

        <div className="grid gap-4">
          {flow.map((item, index) => (
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border border-line p-4" key={item.title}>
              <div className="flex items-center gap-4">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold ${item.tone}`}>
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.detail}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-ink">{item.metric}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg bg-ink p-5 text-white">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/70">Projected first-process value</p>
              <p className="mt-2 text-4xl font-bold tracking-normal">6-8 hrs</p>
            </div>
            <div className="h-24 w-36 rounded-lg bg-white/10 p-3">
              <div className="flex h-full items-end gap-2" aria-hidden="true">
                <span className="h-[35%] flex-1 rounded-t bg-white/35" />
                <span className="h-[54%] flex-1 rounded-t bg-white/55" />
                <span className="h-[78%] flex-1 rounded-t bg-profit" />
                <span className="h-full flex-1 rounded-t bg-white" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/70">Saved per week from one focused automation opportunity</p>
        </div>
      </div>
    </div>
  );
}
