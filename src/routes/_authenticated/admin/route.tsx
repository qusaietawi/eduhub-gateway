import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, FileText, Inbox, Settings, Users, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAccess, PERMISSION_LABELS, type Permission } from "@/lib/permissions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const access = useAdminAccess();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const links: { to: string; label: string; icon: typeof FileText; permission?: Permission; adminOnly?: boolean }[] = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/content", label: "Content", icon: FileText, permission: "content" },
    { to: "/admin/submissions", label: "Submissions", icon: Inbox, permission: "submissions" },
    { to: "/admin/settings", label: "Site settings", icon: Settings, permission: "settings" },
    { to: "/admin/staff", label: "Staff & access", icon: Users, adminOnly: true },
  ].filter((l) => {
    if (l.adminOnly) return access.isAdmin;
    if (l.permission) return access.can(l.permission);
    return true;
  });

  return (
    <div className="min-h-screen bg-muted/30" dir="ltr">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-semibold">
              EduHub
            </Link>
            <span className="text-sm text-muted-foreground">Admin dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            {access.isAdmin ? (
              <Badge>Administrator</Badge>
            ) : (
              access.permissions.map((p) => (
                <Badge key={p} variant="secondary">
                  {PERMISSION_LABELS[p].en}
                </Badge>
              ))
            )}
            <span className="hidden text-sm text-muted-foreground sm:inline">{access.email}</span>
            <Button size="sm" variant="outline" onClick={signOut}>
              <LogOut className="me-1 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row">
        <nav className="flex flex-wrap gap-1 md:w-56 md:flex-col">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/admin" }}
                activeProps={{ className: "bg-primary text-primary-foreground" }}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <main className="min-w-0 flex-1">
          {!access.loading && !access.isAdmin && access.permissions.length === 0 ? (
            <div className="rounded-lg border bg-background p-6">
              <h2 className="text-lg font-semibold">No access assigned yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your account is signed in, but an administrator has not given you an access level
                yet. Ask them to grant content, submissions or site settings access.
              </p>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export function NoAccess({ area }: { area: string }) {
  return (
    <div className="rounded-lg border bg-background p-6">
      <h2 className="text-lg font-semibold">You don't have access to {area}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ask an administrator to grant you this access level.
      </p>
    </div>
  );
}
