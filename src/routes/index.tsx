import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/PageHero";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Icon } from "@/components/site/Icon";
import { useLocale, pick, formatDate } from "@/lib/i18n";
import {
  albumImagesQuery,
  albumsQuery,
  faqsQuery,
  featuresQuery,
  postsQuery,
  servicesQuery,
} from "@/lib/content";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduHub — Accredited Bilingual Education & Training" },
      {
        name: "description",
        content:
          "Diplomas, language courses, technology bootcamps and corporate training taught in Arabic and English.",
      },
      { property: "og:title", content: "EduHub — Accredited Bilingual Education & Training" },
      {
        property: "og:description",
        content: "Programs built with employers and delivered fully in Arabic and English.",
      },
      { property: "og:image", content: HERO_IMAGE },
      { name: "twitter:image", content: HERO_IMAGE },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, locale } = useLocale();
  const services = useQuery(servicesQuery);
  const features = useQuery(featuresQuery);
  const posts = useQuery(postsQuery);
  const albums = useQuery(albumsQuery);
  const images = useQuery(albumImagesQuery);
  const faqs = useQuery(faqsQuery);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-deep text-white">
        <div className="hero-mesh absolute inset-0 opacity-80" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
          <div>
            <p className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {t("heroKicker")}
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {t("heroText")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-brand-deep hover:bg-gold/90">
                <Link to="/services">{t("exploreServices")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/contact">{t("talkToAdvisor")}</Link>
              </Button>
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">
              {[
                { v: "14,000+", k: "statLearners" },
                { v: "11", k: "statPrograms" },
                { v: "120+", k: "statInstructors" },
                { v: "78%", k: "statOutcome" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-2xl font-bold text-gold">{s.v}</dt>
                  <dd className="mt-1 text-xs text-white/70">{t(s.k)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={HERO_IMAGE}
              alt={t("brand")}
              className="aspect-4/3 w-full rounded-3xl object-cover shadow-lift"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          title={t("ourServices")}
          lead={t("servicesLead")}
          action={
            <Button asChild variant="ghost" className="text-brand">
              <Link to="/services">
                {t("viewAll")} <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(services.data ?? []).slice(0, 6).map((s) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
            >
              <img
                src={s.image_url}
                alt={pick(s, "title", locale)}
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="p-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                  {pick(s, "category", locale)}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-brand-deep">
                  {pick(s, "title", locale)}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {pick(s, "summary", locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("whyUs")}
            lead={t("featuresLead")}
            action={
              <Button asChild variant="ghost" className="text-brand">
                <Link to="/features">
                  {t("viewAll")} <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(features.data ?? []).slice(0, 8).map((f) => (
              <div key={f.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon name={f.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-brand-deep">
                  {pick(f, "title", locale)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pick(f, "description", locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          title={t("latestBlog")}
          lead={t("blogLead")}
          action={
            <Button asChild variant="ghost" className="text-brand">
              <Link to="/blog">
                {t("viewAll")} <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(posts.data ?? []).slice(0, 3).map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
            >
              <img
                src={p.image_url}
                alt={pick(p, "title", locale)}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="p-5">
                <span className="text-xs text-muted-foreground">
                  {formatDate(p.published_at, locale)}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-brand-deep">
                  {pick(p, "title", locale)}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {pick(p, "excerpt", locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("galleryTitle")}
            lead={t("galleryLead")}
            action={
              <Button asChild variant="ghost" className="text-brand">
                <Link to="/gallery">
                  {t("viewAll")} <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(albums.data ?? []).map((a) => {
              const count = (images.data ?? []).filter((i) => i.album_id === a.id).length;
              return (
                <Link
                  key={a.id}
                  to="/gallery/$slug"
                  params={{ slug: a.slug }}
                  className="group relative overflow-hidden rounded-2xl shadow-soft"
                >
                  <img
                    src={a.cover_url}
                    alt={pick(a, "title", locale)}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-deep/85 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="font-display text-base font-semibold">
                      {pick(a, "title", locale)}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                      <ImageIcon className="size-3.5" /> {count} {t("photos")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading title={t("faqTitle")} lead={t("faqLead")} />
        <Accordion type="single" collapsible className="w-full">
          {(faqs.data ?? []).slice(0, 5).map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="text-start font-display text-base text-brand-deep">
                {pick(f, "question", locale)}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">
                {pick(f, "answer", locale)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link to="/faq">{t("viewAll")}</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl bg-brand-deep p-8 text-white shadow-lift lg:grid-cols-2 lg:p-12">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("ctaTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{t("ctaText")}</p>
            <Button asChild className="mt-6 bg-gold text-brand-deep hover:bg-gold/90">
              <Link to="/contact">{t("contactUs")}</Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
            <h3 className="font-display text-lg font-semibold">{t("newsletterTitle")}</h3>
            <p className="mt-2 text-sm text-white/75">{t("newsletterText")}</p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
