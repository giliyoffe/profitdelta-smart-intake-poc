type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  const base =
    "focus-ring inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200";
  const styles =
    variant === "primary"
      ? "bg-ink text-white shadow-soft hover:-translate-y-0.5 hover:bg-delta hover:shadow-lift"
      : "border border-line bg-white text-ink hover:-translate-y-0.5 hover:border-delta hover:text-delta";

  return (
    <a className={`${base} ${styles} ${className}`} href={href}>
      {children}
    </a>
  );
}
