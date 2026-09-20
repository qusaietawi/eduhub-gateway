import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/lib/i18n";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useLocale();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const schema = z.object({
    email: z.string().trim().email().max(255),
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(t("invalidEmail"));
      return;
    }
    setError(null);
    setBusy(true);
    const { error: dbError } = await supabase
      .from("subscribers")
      .insert({ email: parsed.data.email.toLowerCase(), locale });
    setBusy(false);
    if (dbError) {
      if (dbError.code === "23505" || dbError.message.includes("duplicate")) {
        toast.info(t("alreadySubscribed"));
        setEmail("");
        return;
      }
      toast.error(dbError.message);
      return;
    }
    toast.success(t("subscribed"));
    setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className={compact ? "flex flex-col gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          maxLength={255}
          aria-label={t("email")}
          className="bg-background"
        />
        <Button type="submit" disabled={busy} className="bg-gold text-brand-deep hover:bg-gold/90">
          {busy ? t("sending") : t("subscribe")}
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </form>
  );
}
