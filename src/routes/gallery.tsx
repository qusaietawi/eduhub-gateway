import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useLocale, pick } from "@/lib/i18n";
import { albumImagesQuery, albumsQuery } from "@/lib/content";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery Albums — EduHub" },
      {
        name: "description",
        content: "Photo albums from campus life, graduation ceremonies, workshops and community events.",
      },
      { property: "og:title", content: "Gallery Albums — EduHub" },
      { property: "og:description", content: "Moments from classrooms, labs and ceremonies." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { t, locale } = useLocale();
  const albums = useQuery(albumsQuery);
  const images = useQuery(albumImagesQuery);

  return (
    <>
      <PageHero kicker={t("navGallery")} title={t("galleryTitle")} lead={t("galleryLead")} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(albums.data ?? []).map((a) => {
            const count = (images.data ?? []).filter((i) => i.album_id === a.id).length;
            return (
              <Link
                key={a.id}
                to="/gallery/$slug"
                params={{ slug: a.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
              >
                <div className="relative">
                  <img
                    src={a.cover_url}
                    alt={pick(a, "title", locale)}
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute bottom-3 end-3 flex items-center gap-1.5 rounded-full bg-brand-deep/85 px-2.5 py-1 text-xs text-white">
                    <ImageIcon className="size-3.5" /> {count} {t("photos")}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-display text-lg font-semibold text-brand-deep">
                    {pick(a, "title", locale)}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {pick(a, "description", locale)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
