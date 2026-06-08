type ProcessStepProps = {
  number: number;
  title: string;
  text: string;
};

export function ProcessStep({ number, title, text }: ProcessStepProps) {
  return (
    <li className="grid gap-4 rounded-lg border border-line bg-white p-5 transition duration-200 hover:border-delta/40 hover:shadow-soft sm:grid-cols-[56px_1fr]">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-sm font-bold text-white">
        {number}
      </span>
      <div>
        <h3 className="text-lg font-bold tracking-normal text-ink">{title}</h3>
        <p className="mt-2 leading-7 text-muted">{text}</p>
      </div>
    </li>
  );
}
