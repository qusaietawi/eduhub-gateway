import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Permission = "content" | "submissions" | "settings";

export const PERMISSION_LABELS: Record<Permission, { en: string; ar: string; hint: string }> = {
  content: {
    en: "Content editing",
    ar: "تحرير المحتوى",
    hint: "Services, features, blog, gallery and FAQs",
  },
  submissions: {
    en: "Submissions",
    ar: "الرسائل والمشتركين",
    hint: "Contact messages and newsletter subscribers",
  },
  settings: {
    en: "Site settings",
    ar: "إعدادات الموقع",
    hint: "About page, team, privacy policy and terms",
  },
};

export const ALL_PERMISSIONS: Permission[] = ["content", "submissions", "settings"];

export type AdminAccess = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
  permissions: Permission[];
  can: (permission: Permission) => boolean;
};

export function useAdminAccess(): AdminAccess {
  const [state, setState] = useState<Omit<AdminAccess, "can">>({
    loading: true,
    userId: null,
    email: null,
    isAdmin: false,
    permissions: [],
  });

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        if (active) {
          setState({ loading: false, userId: null, email: null, isAdmin: false, permissions: [] });
        }
        return;
      }

      const [roles, perms] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase.from("user_permissions").select("permission").eq("user_id", user.id),
      ]);

      const isAdmin = (roles.data ?? []).some((r) => r.role === "admin");
      const granted = (perms.data ?? []).map((p) => p.permission as Permission);

      if (active) {
        setState({
          loading: false,
          userId: user.id,
          email: user.email ?? null,
          isAdmin,
          permissions: isAdmin ? ALL_PERMISSIONS : granted,
        });
      }
    }

    void load();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void load();
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    ...state,
    can: (permission: Permission) => state.isAdmin || state.permissions.includes(permission),
  };
}
