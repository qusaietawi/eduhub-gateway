import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrudSection } from "@/components/admin/CrudSection";
import { useAdminAccess } from "@/lib/permissions";
import { NoAccess } from "./route";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentArea,
});

function ContentArea() {
  const access = useAdminAccess();
  if (access.loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!access.can("content")) return <NoAccess area="content editing" />;
  const canWrite = true;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Content</h1>
        <p className="text-sm text-muted-foreground">
          Services, features, blog, gallery and FAQs — English and Arabic fields.
        </p>
      </div>

      <Tabs defaultValue="services">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="posts">Blog posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="images">Album photos</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-4">
          <CrudSection
            table="services"
            title="Services"
            description="Programs shown on the services pages."
            orderBy={{ column: "sort_order" }}
            canWrite={canWrite}
            columns={[
              { key: "title_en", label: "Title (EN)" },
              { key: "title_ar", label: "Title (AR)" },
              { key: "category_en", label: "Category" },
              { key: "is_published", label: "Published" },
            ]}
            fields={[
              { key: "slug", label: "Slug" },
              { key: "title_en", label: "Title (EN)" },
              { key: "title_ar", label: "Title (AR)" },
              { key: "summary_en", label: "Summary (EN)", type: "textarea" },
              { key: "summary_ar", label: "Summary (AR)", type: "textarea" },
              { key: "content_en", label: "Full content (EN)", type: "textarea" },
              { key: "content_ar", label: "Full content (AR)", type: "textarea" },
              { key: "features_en", label: "Key features (EN)", type: "list" },
              { key: "features_ar", label: "Key features (AR)", type: "list" },
              { key: "category_en", label: "Category (EN)" },
              { key: "category_ar", label: "Category (AR)" },
              { key: "image_url", label: "Image URL" },
              { key: "icon", label: "Icon name", defaultValue: "GraduationCap" },
              { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
              { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
            ]}
          />
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <CrudSection
            table="features"
            title="Features"
            description="Advantages shown on the features page."
            orderBy={{ column: "sort_order" }}
            canWrite={canWrite}
            columns={[
              { key: "title_en", label: "Title (EN)" },
              { key: "title_ar", label: "Title (AR)" },
              { key: "icon", label: "Icon" },
            ]}
            fields={[
              { key: "icon", label: "Icon name", defaultValue: "Sparkles" },
              { key: "title_en", label: "Title (EN)" },
              { key: "title_ar", label: "Title (AR)" },
              { key: "description_en", label: "Description (EN)", type: "textarea" },
              { key: "description_ar", label: "Description (AR)", type: "textarea" },
              { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
            ]}
          />
        </TabsContent>

        <TabsContent value="posts" className="mt-4">
          <CrudSection
            table="blog_posts"
            title="Blog posts"
            description="Articles with bilingual content."
            orderBy={{ column: "published_at", ascending: false }}
            canWrite={canWrite}
            columns={[
              { key: "title_en", label: "Title (EN)" },
              { key: "title_ar", label: "Title (AR)" },
              { key: "is_published", label: "Published" },
            ]}
            fields={[
              { key: "slug", label: "Slug" },
              { key: "title_en", label: "Title (EN)" },
              { key: "title_ar", label: "Title (AR)" },
              { key: "excerpt_en", label: "Excerpt (EN)", type: "textarea" },
              { key: "excerpt_ar", label: "Excerpt (AR)", type: "textarea" },
              { key: "content_en", label: "Content (EN)", type: "textarea" },
              { key: "content_ar", label: "Content (AR)", type: "textarea" },
              { key: "author_en", label: "Author (EN)" },
              { key: "author_ar", label: "Author (AR)" },
              { key: "image_url", label: "Featured image URL" },
              { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
            ]}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <CrudSection
            table="blog_categories"
            title="Blog categories"
            description="Categories used to filter the blog."
            orderBy={{ column: "name_en" }}
            canWrite={canWrite}
            columns={[
              { key: "name_en", label: "Name (EN)" },
              { key: "name_ar", label: "Name (AR)" },
              { key: "slug", label: "Slug" },
            ]}
            fields={[
              { key: "slug", label: "Slug" },
              { key: "name_en", label: "Name (EN)" },
              { key: "name_ar", label: "Name (AR)" },
            ]}
          />
        </TabsContent>

        <TabsContent value="albums" className="mt-4">
          <CrudSection
            table="albums"
            title="Gallery albums"
            description="Albums shown in the gallery."
            orderBy={{ column: "sort_order" }}
            canWrite={canWrite}
            columns={[
              { key: "title_en", label: "Title (EN)" },
              { key: "title_ar", label: "Title (AR)" },
              { key: "slug", label: "Slug" },
            ]}
            fields={[
              { key: "slug", label: "Slug" },
              { key: "title_en", label: "Title (EN)" },
              { key: "title_ar", label: "Title (AR)" },
              { key: "description_en", label: "Description (EN)", type: "textarea" },
              { key: "description_ar", label: "Description (AR)", type: "textarea" },
              { key: "cover_url", label: "Cover image URL" },
              { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
            ]}
          />
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          <CrudSection
            table="album_images"
            title="Album photos"
            description="Photos inside albums (paste the album ID)."
            orderBy={{ column: "sort_order" }}
            canWrite={canWrite}
            columns={[
              { key: "caption_en", label: "Caption (EN)" },
              { key: "image_url", label: "Image URL" },
              { key: "album_id", label: "Album ID" },
            ]}
            fields={[
              { key: "album_id", label: "Album ID" },
              { key: "image_url", label: "Image URL" },
              { key: "caption_en", label: "Caption (EN)" },
              { key: "caption_ar", label: "Caption (AR)" },
              { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
            ]}
          />
        </TabsContent>

        <TabsContent value="faqs" className="mt-4">
          <CrudSection
            table="faqs"
            title="FAQs"
            description="Questions and answers in both languages."
            orderBy={{ column: "sort_order" }}
            canWrite={canWrite}
            columns={[
              { key: "question_en", label: "Question (EN)" },
              { key: "question_ar", label: "Question (AR)" },
            ]}
            fields={[
              { key: "question_en", label: "Question (EN)" },
              { key: "question_ar", label: "Question (AR)" },
              { key: "answer_en", label: "Answer (EN)", type: "textarea" },
              { key: "answer_ar", label: "Answer (AR)", type: "textarea" },
              { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
