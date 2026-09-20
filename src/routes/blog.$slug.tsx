import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prose, SectionHeading } from "@/components/site/PageHero";
import { useLocale, pick, formatDate } from "@/lib/i18n";
import { categoriesQuery, postsQuery } from "@/lib/content";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Article — EduHub Blog" },
      { name: "description", content: "Full article with author, date, category and related posts." },
      { property: "og:title", content: "Article — EduHub Blog" },
      { property: "og:description", content: "Read the full article on the EduHub blog." },
    ],
  }),
  component: PostDetail,
});

function PostDetail() {
  const { slug } = Route.useParams();
  const { t, locale } = useLocale();
  const posts = useQuery(postsQuery);
  const cats = useQuery(categoriesQuery);
  const all = posts.data ?? [];
  const post = all.find((p) => p.slug === slug);

  if (posts.isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-20 text-muted-foreground">{t("loading")}</p>;
  }
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">{t("notFound")}</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/blog">{t("backToBlog")}</Link>
        </Button>
      </div>
    );
  }

  const cat = (cats.data ?? []).find((c) => c.id === post.category_id);
  const related = all.filter((p) => p.id !== post.id && p.category_id === post.category_id).slice(0, 3);

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t("backToBlog")}
        </Link>
        {cat && (
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {pick(cat, "name", locale)}
          </p>
        )}
        <h1 className="mt-3 font-display text-3xl font-bold text-brand-deep sm:text-4xl">
          {pick(post, "title", locale)}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="size-4" /> {t("by")} {pick(post, "author", locale)}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" /> {formatDate(post.published_at, locale)}
          </span>
        </div>
        <img
          src={post.image_url}
          alt={pick(post, "title", locale)}
          className="mt-8 aspect-16/9 w-full rounded-2xl object-cover shadow-soft"
        />
        <p className="mt-8 border-s-4 border-gold ps-4 text-base font-medium leading-8 text-foreground/80">
          {pick(post, "excerpt", locale)}
        </p>
        <div className="mt-6">
          <Prose text={pick(post, "content", locale)} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-secondary/60 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title={t("relatedPosts")} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
                >
                  <img
                    src={p.image_url}
                    alt={pick(p, "title", locale)}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-brand-deep">
                      {pick(p, "title", locale)}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {pick(p, "excerpt", locale)}
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
