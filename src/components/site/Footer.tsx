import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const { t } = useLocale();
  const year = 2026;

  return (
    <footer className="mt-24 bg-brand-deep text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gold text-brand-deep">
              <GraduationCap className="size-5.5" />
            </span>
            <span className="font-display text-lg font-bold text-white">{t("brand")}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">{t("footerAbout")}</p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("quickLinks")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { to: "/about", key: "navAbout" },
              { to: "/services", key: "navServices" },
              { to: "/features", key: "navFeatures" },
              { to: "/blog", key: "navBlog" },
              { to: "/gallery", key: "navGallery" },
              { to: "/faq", key: "navFaq" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-gold">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("contactUs")}
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>Al Nahda Street, Building 42</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
              <span dir="ltr">+962 6 500 1234</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
              <span dir="ltr">info@eduhub.example</span>
            </li>
          </ul>
          <h4 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("legal")}
          </h4>
          <ul className="mt-3 space-y-2.5 text-sm">
            <li>
              <Link to="/privacy" className="transition-colors hover:text-gold">
                {t("navPrivacy")}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="transition-colors hover:text-gold">
                {t("navTerms")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            {t("newsletterTitle")}
          </h4>
          <p className="mt-4 text-sm leading-relaxed">{t("newsletterText")}</p>
          <div className="mt-4">
            <NewsletterForm compact />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            © {year} {t("brand")}. {t("rights")}
          </span>
          <Link to="/auth" className="transition-colors hover:text-gold">
            {t("adminLogin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
