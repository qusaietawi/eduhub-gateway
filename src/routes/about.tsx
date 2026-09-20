import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Compass, Eye, HeartHandshake, History } from "lucide-react";
import { PageHero, Prose, SectionHeading } from "@/components/site/PageHero";
import { useLocale, pick } from "@/lib/i18n";
import { findPage, pagesQuery, teamQuery } from "@/lib/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EduHub — Mission, Vision & Team" },
      {
        name: "description",
        content:
          "EduHub combines accredited academic programs with practical employer-designed training since 2009.",
      },
      { property: "og:title", content: "About EduHub — Mission, Vision & Team" },
      { property: "og:description", content: "Our mission, vision, values, history and team." },
    ],
  }),
  component: About,
});

function About() {
  const { t, locale } = useLocale();
  const pages = useQuery(pagesQuery);
  const team = useQuery(teamQuery);
  const intro = findPage(pages.data, "about-intro");
  const mission = findPage(pages.data, "about-mission");
  const vision = findPage(pages.data, "about-vision");
  const history = findPage(pages.data, "about-history");

  const values =
    locale === "ar"
      ? [
          { t: "النزاهة الأكاديمية", d: "تقييم عادل ومحتوى أصيل في كل برنامج." },
          { t: "المساواة بين اللغتين", d: "الجودة نفسها بالعربية والإنجليزية دون استثناء." },
          { t: "الأثر العملي", d: "نقيس نجاحنا بنتائج متعلمينا المهنية." },
          { t: "الاحترام", d: "بيئة تعلّم آمنة ومحترمة للجميع." },
        ]
      : [
          { t: "Academic integrity", d: "Fair assessment and original material in every program." },
          { t: "Language equality", d: "The same quality in Arabic and English, without exception." },
          { t: "Practical impact", d: "We measure success by our learners' career outcomes." },
          { t: "Respect", d: "A safe, respectful learning environment for everyone." },
        ];

  return (
    <>
      <PageHero kicker={t("navAbout")} title={pick(intro, "title", locale) || t("navAbout")} />

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <Prose text={pick(intro, "body", locale)} />
      </section>

      <section className="bg-secondary/60 py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {[
            { icon: Compass, page: mission, fallback: t("ourMission") },
            { icon: Eye, page: vision, fallback: t("ourVision") },
          ].map((b, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <b.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-brand-deep">
                {pick(b.page, "title", locale) || b.fallback}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {pick(b.page, "body", locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading title={t("ourValues")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.t} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gold-soft text-accent-foreground">
                <HeartHandshake className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-brand-deep">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={pick(history, "title", locale) || t("ourStory")} />
          <div className="flex gap-4">
            <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-primary-foreground">
              <History className="size-5" />
            </span>
            <Prose text={pick(history, "body", locale)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading title={t("ourTeam")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(team.data ?? []).map((m) => (
            <div
              key={m.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <img
                src={m.photo_url}
                alt={pick(m, "name", locale)}
                className="size-20 shrink-0 rounded-xl object-cover"
                loading="lazy"
              />
              <div>
                <h3 className="font-display text-base font-semibold text-brand-deep">
                  {pick(m, "name", locale)}
                </h3>
                <p className="text-xs font-semibold text-gold">{pick(m, "role", locale)}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {pick(m, "bio", locale)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
