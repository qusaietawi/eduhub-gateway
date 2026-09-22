import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAccess, PERMISSION_LABELS, ALL_PERMISSIONS } from "@/lib/permissions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

const CONTENT_TABLES = ["services", "features", "blog_posts", "albums", "faqs"] as const;
const SUBMISSION_TABLES = ["contact_messages", "subscribers"] as const;

function Overview() {
  const access = useAdminAccess();

  const tables = [
    ...(access.can("content") ? CONTENT_TABLES : []),
    ...(access.can("submissions") ? SUBMISSION_TABLES : []),
  ];

  const { data: counts = {} } = useQuery({
    queryKey: ["admin", "counts", tables],
    enabled: tables.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        tables.map(async (table) => {
          const { count } = await (supabase as any)
            .from(table)
            .select("id", { count: "exact", head: true });
          return [table, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
  });

  const labels: Record<string, string> = {
    services: "Services",
    features: "Features",
    blog_posts: "Blog posts",
    albums: "Gallery albums",
    faqs: "FAQs",
    contact_messages: "Contact messages",
    subscribers: "Subscribers",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          You see only the areas your access level covers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tables.map((table) => (
          <Card key={table}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {labels[table]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{counts[table] ?? "—"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your access levels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ALL_PERMISSIONS.map((permission) => (
            <div key={permission} className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{PERMISSION_LABELS[permission].en}</p>
                <p className="text-xs text-muted-foreground">{PERMISSION_LABELS[permission].hint}</p>
              </div>
              <span
                className={
                  access.can(permission)
                    ? "text-sm font-medium text-primary"
                    : "text-sm text-muted-foreground"
                }
              >
                {access.can(permission) ? "Granted" : "Not granted"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
