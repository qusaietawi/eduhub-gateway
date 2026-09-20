import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/site/Icon";
import { useLocale, pick } from "@/lib/i18n";
import { featuresQuery } from "@/lib/content";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Why Choose EduHub — Our Advantages" },
      {
        name: "description",
        content:
          "Accredited programs, expert instructors, bilingual delivery, flexible schedules and measurable career outcomes.",
      },
      { property: "og:title", content: "Why Choose EduHub — Our Advantages" },
      { property: "og:description", content: "The advantages our learners mention most often." },
    ],
  }),
  component: Features,
});

function Features() {
  const { t, locale } = useLocale();
  const features = useQuery(featuresQuery);

  return (
    <>
      <PageHero kicker={t("whyUs")} title={t("navFeatures")} lead={t("featuresLead")} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(features.data ?? []).map((f) => (
            <div key={f.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon name={f.icon} className="size-6" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-brand-deep">
                {pick(f, "title", locale)}
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {pick(f, "description", locale)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-3xl bg-brand-deep p-8 text-white shadow-lift lg:p-12">
          <h2 className="font-display text-2xl font-bold">{t("ctaTitle")}</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/80">{t("ctaText")}</p>
          <Button asChild className="mt-6 bg-gold text-brand-deep hover:bg-gold/90">
            <Link to="/contact">{t("contactUs")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
