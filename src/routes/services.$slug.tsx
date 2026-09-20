import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prose, SectionHeading } from "@/components/site/PageHero";
import { useLocale, pick, pickList } from "@/lib/i18n";
import { servicesQuery } from "@/lib/content";

export const Route = createFileRoute("/services/$slug")({
  head: () => ({
    meta: [
      { title: "Program details — EduHub" },
      { name: "description", content: "Full program description, key features and related programs." },
      { property: "og:title", content: "Program details — EduHub" },
      { property: "og:description", content: "Full program description and key features." },
    ],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { t, locale } = useLocale();
  const services = useQuery(servicesQuery);
  const all = services.data ?? [];
  const service = all.find((s) => s.slug === slug);

  if (services.isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-20 text-muted-foreground">{t("loading")}</p>;
  }
  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">{t("notFound")}</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/services">{t("backToServices")}</Link>
        </Button>
      </div>
    );
  }

  const related = all.filter((s) => s.id !== service.id && s.category_en === service.category_en);
  const features = pickList(service, "features", locale);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-deep text-white">
        <img
          src={service.image_url}
          alt={pick(service, "title", locale)}
          className="absolute inset-0 size-full object-cover opacity-30"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-gold"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" /> {t("backToServices")}
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {pick(service, "category", locale)}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl lg:text-5xl">
            {pick(service, "title", locale)}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/80">
            {pick(service, "summary", locale)}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <Prose text={pick(service, "content", locale)} />
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold text-brand-deep">
              {t("keyFeatures")}
            </h2>
            <ul className="mt-4 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-brand-deep p-6 text-white shadow-soft">
            <h2 className="font-display text-lg font-semibold">{t("ctaTitle")}</h2>
            <p className="mt-2 text-sm text-white/80">{t("ctaText")}</p>
            <Button asChild className="mt-4 w-full bg-gold text-brand-deep hover:bg-gold/90">
              <Link to="/contact">{t("applyNow")}</Link>
            </Button>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="bg-secondary/60 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title={t("relatedServices")} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <Link
                  key={s.id}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
                >
                  <img
                    src={s.image_url}
                    alt={pick(s, "title", locale)}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-brand-deep">
                      {pick(s, "title", locale)}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {pick(s, "summary", locale)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
