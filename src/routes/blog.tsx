import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/site/PageHero";
import { useLocale, pick, formatDate } from "@/lib/i18n";
import { categoriesQuery, postsQuery } from "@/lib/content";

const PAGE_SIZE = 6;

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Study Tips, Careers & Campus News | EduHub" },
      {
        name: "description",
        content: "Bilingual articles on study methods, career development, technology and campus news.",
      },
      { property: "og:title", content: "Blog — Study Tips, Careers & Campus News | EduHub" },
      { property: "og:description", content: "Study guidance, career advice and campus news." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const { t, locale } = useLocale();
  const posts = useQuery(postsQuery);
  const cats = useQuery(categoriesQuery);
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const [count, setCount] = React.useState(PAGE_SIZE);

  const filtered = (posts.data ?? []).filter((p) => {
    const inCat = cat === "all" || p.category_id === cat;
    const text = `${pick(p, "title", locale)} ${pick(p, "excerpt", locale)}`.toLowerCase();
    return inCat && text.includes(q.trim().toLowerCase());
  });
  const shown = filtered.slice(0, count);

  return (
    <>
      <PageHero kicker={t("navBlog")} title={t("latestBlog")} lead={t("blogLead")} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute top-2.5 start-3 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setCount(PAGE_SIZE);
              }}
              placeholder={t("searchPosts")}
              className="ps-9"
              maxLength={80}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={cat === "all" ? "default" : "outline"}
              className={cat === "all" ? "bg-brand hover:bg-brand-deep" : ""}
              onClick={() => {
                setCat("all");
                setCount(PAGE_SIZE);
              }}
            >
              {t("allCategories")}
            </Button>
            {(cats.data ?? []).map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={cat === c.id ? "default" : "outline"}
                className={cat === c.id ? "bg-brand hover:bg-brand-deep" : ""}
                onClick={() => {
                  setCat(c.id);
                  setCount(PAGE_SIZE);
                }}
              >
                {pick(c, "name", locale)}
              </Button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">{t("noResults")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => {
              const c = (cats.data ?? []).find((x) => x.id === p.category_id);
              return (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
                >
                  <img
                    src={p.image_url}
                    alt={pick(p, "title", locale)}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {c && <span className="font-semibold text-gold">{pick(c, "name", locale)}</span>}
                      <span>·</span>
                      <span>{formatDate(p.published_at, locale)}</span>
                    </div>
                    <h2 className="mt-2 font-display text-lg font-semibold text-brand-deep">
                      {pick(p, "title", locale)}
                    </h2>
                    <p className="mt-2 flex-1 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {pick(p, "excerpt", locale)}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-brand">{t("readMore")}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {count < filtered.length && (
          <div className="mt-10 text-center">
            <Button variant="outline" onClick={() => setCount((c) => c + PAGE_SIZE)}>
              {t("loadMore")}
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
