import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ServiceRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  content_en: string;
  content_ar: string;
  features_en: string[];
  features_ar: string[];
  category_en: string;
  category_ar: string;
  image_url: string;
  icon: string;
  sort_order: number;
};

export type FeatureRow = {
  id: string;
  icon: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  sort_order: number;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
};

export type PostRow = {
  id: string;
  slug: string;
  category_id: string | null;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  image_url: string;
  author_en: string;
  author_ar: string;
  published_at: string;
};

export type AlbumRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  cover_url: string;
  sort_order: number;
};

export type AlbumImageRow = {
  id: string;
  album_id: string;
  image_url: string;
  caption_en: string;
  caption_ar: string;
  sort_order: number;
};

export type FaqRow = {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  sort_order: number;
};

export type TeamRow = {
  id: string;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  bio_en: string;
  bio_ar: string;
  photo_url: string;
  sort_order: number;
};

export type PageRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
};

async function list<T>(table: string, order: string, ascending = true): Promise<T[]> {
  const client = supabase as unknown as {
    from: (t: string) => {
      select: (c: string) => {
        order: (
          col: string,
          opts: { ascending: boolean },
        ) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  };
  const { data, error } = await client.from(table).select("*").order(order, { ascending });
  if (error) throw new Error(error.message);
  return (data ?? []) as T[];
}

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () => list<ServiceRow>("services", "sort_order"),
});

export const featuresQuery = queryOptions({
  queryKey: ["features"],
  queryFn: () => list<FeatureRow>("features", "sort_order"),
});

export const categoriesQuery = queryOptions({
  queryKey: ["blog_categories"],
  queryFn: () => list<CategoryRow>("blog_categories", "name_en"),
});

export const postsQuery = queryOptions({
  queryKey: ["blog_posts"],
  queryFn: () => list<PostRow>("blog_posts", "published_at", false),
});

export const albumsQuery = queryOptions({
  queryKey: ["albums"],
  queryFn: () => list<AlbumRow>("albums", "sort_order"),
});

export const albumImagesQuery = queryOptions({
  queryKey: ["album_images"],
  queryFn: () => list<AlbumImageRow>("album_images", "sort_order"),
});

export const faqsQuery = queryOptions({
  queryKey: ["faqs"],
  queryFn: () => list<FaqRow>("faqs", "sort_order"),
});

export const teamQuery = queryOptions({
  queryKey: ["team_members"],
  queryFn: () => list<TeamRow>("team_members", "sort_order"),
});

export const pagesQuery = queryOptions({
  queryKey: ["site_pages"],
  queryFn: () => list<PageRow>("site_pages", "slug"),
});

export function findPage(pages: PageRow[] | undefined, slug: string): PageRow | undefined {
  return pages?.find((p) => p.slug === slug);
}
