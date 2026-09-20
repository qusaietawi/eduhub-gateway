import type { ReactNode } from "react";

export function PageHero({
  kicker,
  title,
  lead,
  children,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-brand-deep py-16 text-white sm:py-20">
      <div className="hero-mesh absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {kicker && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{kicker}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="rule-accent font-display text-2xl font-bold text-brand-deep sm:text-3xl">
          {title}
        </h2>
        {lead && <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-4 text-[15px] leading-8 text-foreground/85">
      {text
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
    </div>
  );
}
