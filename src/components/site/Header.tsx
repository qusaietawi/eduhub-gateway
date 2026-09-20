import * as React from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", key: "navHome" },
  { to: "/about", key: "navAbout" },
  { to: "/services", key: "navServices" },
  { to: "/features", key: "navFeatures" },
  { to: "/blog", key: "navBlog" },
  { to: "/gallery", key: "navGallery" },
  { to: "/faq", key: "navFaq" },
  { to: "/contact", key: "navContact" },
] as const;

export function Header() {
  const { t, locale, setLocale, isRtl } = useLocale();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-primary-foreground">
            <GraduationCap className="size-5.5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-brand-deep">
              {t("brand")}
            </span>
            <span className="block text-[11px] text-muted-foreground">{t("brandTag")}</span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-brand-soft !text-brand" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className={cn("flex items-center gap-2", isRtl ? "mr-auto lg:mr-0" : "ml-auto lg:ml-0")}>
          <Button
            variant="outline"
            size="sm"
            aria-label={t("switchLangLabel")}
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="gap-1.5"
          >
            <Globe className="size-4" />
            <span className="text-xs font-semibold">{t("switchLang")}</span>
          </Button>

          <Button asChild size="sm" className="hidden bg-brand hover:bg-brand-deep sm:inline-flex">
            <Link to="/contact">{t("applyNow")}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isRtl ? "right" : "left"} className="w-72">
              <SheetTitle className="px-4 pt-4 font-display text-brand-deep">
                {t("brand")}
              </SheetTitle>
              <nav className="mt-4 flex flex-col gap-1 px-2 pb-6">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    activeProps={{ className: "bg-brand-soft !text-brand" }}
                    activeOptions={{ exact: l.to === "/" }}
                  >
                    {t(l.key)}
                  </Link>
                ))}
                <Link
                  to="/newsletter"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
                >
                  {t("navNewsletter")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
