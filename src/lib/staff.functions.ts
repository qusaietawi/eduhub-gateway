import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type StaffMember = {
  userId: string;
  email: string;
  isAdmin: boolean;
  permissions: string[];
  createdAt: string;
  lastSignInAt: string | null;
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: administrators only");
}

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StaffMember[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (error) throw error;

    const [{ data: roles }, { data: perms }] = await Promise.all([
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("user_permissions").select("user_id, permission"),
    ]);

    return users.users.map((u) => ({
      userId: u.id,
      email: u.email ?? "",
      isAdmin: (roles ?? []).some((r) => r.user_id === u.id && r.role === "admin"),
      permissions: (perms ?? []).filter((p) => p.user_id === u.id).map((p) => p.permission),
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
    }));
  });

export const updateStaffAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; isAdmin: boolean; permissions: string[] }) => {
    const allowed = ["content", "submissions", "settings"];
    if (!input.userId) throw new Error("A staff member is required");
    return {
      userId: input.userId,
      isAdmin: Boolean(input.isAdmin),
      permissions: input.permissions.filter((p) => allowed.includes(p)),
    };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId && !data.isAdmin) {
      throw new Error("You cannot remove your own administrator access");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (data.isAdmin) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: data.userId, role: "admin" });
      if (error) throw error;
    }

    await supabaseAdmin.from("user_permissions").delete().eq("user_id", data.userId);
    if (!data.isAdmin && data.permissions.length > 0) {
      const { error } = await supabaseAdmin.from("user_permissions").insert(
        data.permissions.map((permission) => ({
          user_id: data.userId,
          permission: permission as "content" | "submissions" | "settings",
        })),
      );
      if (error) throw error;
    }

    return { ok: true };
  });
