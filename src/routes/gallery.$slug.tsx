import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PageHero } from "@/components/site/PageHero";
import { useLocale, pick } from "@/lib/i18n";
import { albumImagesQuery, albumsQuery } from "@/lib/content";

export const Route = createFileRoute("/gallery/$slug")({
  head: () => ({
    meta: [
      { title: "Album — EduHub Gallery" },
      { name: "description", content: "Browse all photographs in this EduHub gallery album." },
      { property: "og:title", content: "Album — EduHub Gallery" },
      { property: "og:description", content: "Browse all photographs in this album." },
    ],
  }),
  component: AlbumDetail,
});

function AlbumDetail() {
  const { slug } = Route.useParams();
  const { t, locale } = useLocale();
  const albums = useQuery(albumsQuery);
  const images = useQuery(albumImagesQuery);
  const [open, setOpen] = React.useState<string | null>(null);

  const album = (albums.data ?? []).find((a) => a.slug === slug);
  const photos = album ? (images.data ?? []).filter((i) => i.album_id === album.id) : [];
  const active = photos.find((p) => p.id === open);

  if (albums.isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-20 text-muted-foreground">{t("loading")}</p>;
  }
  if (!album) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">{t("notFound")}</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/gallery">{t("backToGallery")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHero
        kicker={`${photos.length} ${t("photos")}`}
        title={pick(album, "title", locale)}
        lead={pick(album, "description", locale)}
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          to="/gallery"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t("backToGallery")}
        </Link>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpen(p.id)}
              className="group relative overflow-hidden rounded-xl shadow-soft"
            >
              <img
                src={p.image_url}
                alt={pick(p, "caption", locale)}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-deep/85 to-transparent p-2 text-start text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {pick(p, "caption", locale)}
              </span>
            </button>
          ))}
        </div>
      </section>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{pick(active, "caption", locale)}</DialogTitle>
          {active && (
            <figure>
              <img
                src={active.image_url}
                alt={pick(active, "caption", locale)}
                className="max-h-[75vh] w-full rounded-xl object-contain"
              />
              <figcaption className="mt-3 text-center text-sm text-white drop-shadow">
                {pick(active, "caption", locale)}
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
