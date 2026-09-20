import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { useLocale, pick } from "@/lib/i18n";
import { servicesQuery } from "@/lib/content";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Programs & Services — EduHub" },
      {
        name: "description",
        content:
          "Professional diplomas, corporate training, language courses, technology bootcamps, advising and certifications.",
      },
      { property: "og:title", content: "Programs & Services — EduHub" },
      { property: "og:description", content: "Accredited bilingual programs built with employers." },
    ],
  }),
  component: Services,
});

function Services() {
  const { t, locale } = useLocale();
  const services = useQuery(servicesQuery);
  const [cat, setCat] = React.useState<string>("all");

  const all = services.data ?? [];
  const categories = Array.from(new Set(all.map((s) => s.category_en))).filter(Boolean);
  const shown = cat === "all" ? all : all.filter((s) => s.category_en === cat);

  return (
    <>
      <PageHero kicker={t("ourServices")} title={t("navServices")} lead={t("servicesLead")} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={cat === "all" ? "default" : "outline"}
            onClick={() => setCat("all")}
            className={cat === "all" ? "bg-brand hover:bg-brand-deep" : ""}
          >
            {t("allCategories")}
          </Button>
          {categories.map((c) => {
            const row = all.find((s) => s.category_en === c);
            return (
              <Button
                key={c}
                size="sm"
                variant={cat === c ? "default" : "outline"}
                onClick={() => setCat(c)}
                className={cat === c ? "bg-brand hover:bg-brand-deep" : ""}
              >
                {pick(row, "category", locale)}
              </Button>
            );
          })}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
            >
              <img
                src={s.image_url}
                alt={pick(s, "title", locale)}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                  {pick(s, "category", locale)}
                </span>
                <h2 className="mt-2 font-display text-lg font-semibold text-brand-deep">
                  {pick(s, "title", locale)}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {pick(s, "summary", locale)}
                </p>
                <span className="mt-4 text-sm font-semibold text-brand">{t("learnMore")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
