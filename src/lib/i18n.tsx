import * as React from "react";

export type Locale = "en" | "ar";

const STORAGE_KEY = "eduhub-locale";

type Dict = Record<string, { en: string; ar: string }>;

export const dict: Dict = {
  brand: { en: "EduHub", ar: "إديو هَب" },
  brandTag: { en: "University & Training Center", ar: "جامعة ومركز تدريب" },
  navHome: { en: "Home", ar: "الرئيسية" },
  navAbout: { en: "About Us", ar: "من نحن" },
  navServices: { en: "Services", ar: "الخدمات" },
  navFeatures: { en: "Features", ar: "الميزات" },
  navBlog: { en: "Blog", ar: "المدونة" },
  navGallery: { en: "Gallery", ar: "معرض الصور" },
  navFaq: { en: "FAQ", ar: "الأسئلة الشائعة" },
  navContact: { en: "Contact Us", ar: "اتصل بنا" },
  navNewsletter: { en: "Newsletter", ar: "النشرة البريدية" },
  navPrivacy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  navTerms: { en: "Terms & Conditions", ar: "الشروط والأحكام" },
  switchLang: { en: "العربية", ar: "English" },
  switchLangLabel: { en: "Switch to Arabic", ar: "التبديل إلى الإنجليزية" },
  applyNow: { en: "Apply Now", ar: "سجّل الآن" },
  heroKicker: { en: "Accredited since 2009", ar: "معتمدون منذ ٢٠٠٩" },
  heroTitle: {
    en: "Learning that leads somewhere real",
    ar: "تعلّم يقودك إلى نتيجة حقيقية",
  },
  heroText: {
    en: "Accredited diplomas, language courses, technology bootcamps and corporate training — taught fully in Arabic and English by practitioners.",
    ar: "دبلومات معتمدة ودورات لغات ومعسكرات تقنية وتدريب مؤسسي — تُدرّس بالكامل بالعربية والإنجليزية على أيدي ممارسين.",
  },
  exploreServices: { en: "Explore programs", ar: "استكشف البرامج" },
  talkToAdvisor: { en: "Talk to an advisor", ar: "تحدّث إلى مرشد" },
  statLearners: { en: "Learners trained", ar: "متعلم تم تدريبهم" },
  statPrograms: { en: "Active programs", ar: "برنامجاً نشطاً" },
  statInstructors: { en: "Instructors & staff", ar: "مدرباً وموظفاً" },
  statOutcome: { en: "Career progress in 9 months", ar: "تقدّم مهني خلال ٩ أشهر" },
  ourServices: { en: "Our Services", ar: "خدماتنا" },
  servicesLead: {
    en: "Programs built with employers, delivered in two languages.",
    ar: "برامج مبنية بالتعاون مع جهات العمل وتُقدَّم بلغتين.",
  },
  whyUs: { en: "Why choose EduHub", ar: "لماذا إديو هَب" },
  featuresLead: {
    en: "The advantages our learners mention most often.",
    ar: "الميزات التي يذكرها متعلمونا أكثر من غيرها.",
  },
  latestBlog: { en: "Latest from the blog", ar: "أحدث المقالات" },
  blogLead: {
    en: "Study guidance, career advice and campus news.",
    ar: "إرشاد دراسي ونصائح مهنية وأخبار الحرم.",
  },
  galleryTitle: { en: "Gallery albums", ar: "ألبومات الصور" },
  galleryLead: {
    en: "Moments from classrooms, labs and ceremonies.",
    ar: "لحظات من القاعات والمختبرات والحفلات.",
  },
  faqTitle: { en: "Frequently asked questions", ar: "الأسئلة الشائعة" },
  faqLead: {
    en: "Answers to what applicants ask before enrolling.",
    ar: "إجابات عمّا يسأل عنه المتقدمون قبل التسجيل.",
  },
  viewAll: { en: "View all", ar: "عرض الكل" },
  readMore: { en: "Read more", ar: "اقرأ المزيد" },
  learnMore: { en: "Learn more", ar: "اعرف المزيد" },
  photos: { en: "photos", ar: "صورة" },
  newsletterTitle: { en: "Stay in the loop", ar: "ابقَ على اطلاع" },
  newsletterText: {
    en: "One monthly email with new program dates, scholarships and study guides.",
    ar: "رسالة شهرية واحدة تحتوي مواعيد البرامج الجديدة والمنح وأدلة الدراسة.",
  },
  emailPlaceholder: { en: "your@email.com", ar: "بريدك@مثال.com" },
  subscribe: { en: "Subscribe", ar: "اشترك" },
  subscribed: { en: "You are subscribed. Thank you!", ar: "تم اشتراكك. شكراً لك!" },
  alreadySubscribed: { en: "This email is already subscribed.", ar: "هذا البريد مشترك بالفعل." },
  invalidEmail: { en: "Enter a valid email address.", ar: "أدخل بريداً إلكترونياً صحيحاً." },
  ctaTitle: { en: "Ready to start your next program?", ar: "هل أنت مستعد لبدء برنامجك القادم؟" },
  ctaText: {
    en: "Tell us your goal and an advisor will map the right track for you within two working days.",
    ar: "أخبرنا بهدفك وسيحدد لك أحد المرشدين المسار المناسب خلال يومي عمل.",
  },
  contactUs: { en: "Contact us", ar: "تواصل معنا" },
  ourMission: { en: "Our Mission", ar: "رسالتنا" },
  ourVision: { en: "Our Vision", ar: "رؤيتنا" },
  ourValues: { en: "Our Values", ar: "قيمنا" },
  ourTeam: { en: "Our Team", ar: "فريقنا" },
  ourStory: { en: "Our Story", ar: "قصتنا" },
  keyFeatures: { en: "Key features", ar: "الميزات الرئيسية" },
  relatedServices: { en: "Related services", ar: "خدمات ذات صلة" },
  relatedPosts: { en: "Related posts", ar: "مقالات ذات صلة" },
  category: { en: "Category", ar: "التصنيف" },
  allCategories: { en: "All categories", ar: "كل التصنيفات" },
  searchPosts: { en: "Search articles…", ar: "ابحث في المقالات…" },
  loadMore: { en: "Load more", ar: "عرض المزيد" },
  noResults: { en: "Nothing matched your search.", ar: "لا توجد نتائج مطابقة لبحثك." },
  by: { en: "By", ar: "بقلم" },
  backToBlog: { en: "Back to blog", ar: "العودة إلى المدونة" },
  backToGallery: { en: "Back to gallery", ar: "العودة إلى المعرض" },
  backToServices: { en: "Back to services", ar: "العودة إلى الخدمات" },
  address: { en: "Address", ar: "العنوان" },
  phone: { en: "Phone", ar: "الهاتف" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  workingHours: { en: "Working hours", ar: "ساعات العمل" },
  sendMessage: { en: "Send message", ar: "إرسال الرسالة" },
  formName: { en: "Full name", ar: "الاسم الكامل" },
  formPhone: { en: "Phone (optional)", ar: "الهاتف (اختياري)" },
  formSubject: { en: "Subject", ar: "الموضوع" },
  formMessage: { en: "Message", ar: "الرسالة" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…" },
  messageSent: {
    en: "Thank you. We will reply within two working days.",
    ar: "شكراً لك. سنرد خلال يومي عمل.",
  },
  required: { en: "This field is required.", ar: "هذا الحقل مطلوب." },
  tooLong: { en: "This value is too long.", ar: "هذه القيمة طويلة جداً." },
  mapArea: { en: "Find us on the map", ar: "اعثر علينا على الخريطة" },
  loading: { en: "Loading…", ar: "جارٍ التحميل…" },
  notFound: { en: "Not found", ar: "غير موجود" },
  footerAbout: {
    en: "A university and training centre combining accredited academic programs with practical, employer-designed training.",
    ar: "جامعة ومركز تدريب يجمع بين البرامج الأكاديمية المعتمدة والتدريب العملي المصمم مع جهات العمل.",
  },
  quickLinks: { en: "Quick links", ar: "روابط سريعة" },
  legal: { en: "Legal", ar: "قانوني" },
  rights: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  adminLogin: { en: "Admin sign in", ar: "دخول المشرف" },
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
};

export function tr(key: keyof typeof dict | string, locale: Locale): string {
  const entry = dict[key as string];
  return entry ? entry[locale] : (key as string);
}

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  isRtl: boolean;
};

const LocaleContext = React.createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") setLocaleState(stored);
  }, []);

  React.useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo<Ctx>(
    () => ({
      locale,
      setLocale,
      t: (key: string) => tr(key, locale),
      dir: locale === "ar" ? "rtl" : "ltr",
      isRtl: locale === "ar",
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Ctx {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}

/** Pick the localized variant of a bilingual row field. */
export function pick<T extends Record<string, unknown>>(
  row: T | null | undefined,
  field: string,
  locale: Locale,
): string {
  if (!row) return "";
  const localized = row[`${field}_${locale}`];
  if (typeof localized === "string" && localized.trim().length > 0) return localized;
  const fallback = row[`${field}_en`];
  return typeof fallback === "string" ? fallback : "";
}

export function pickList<T extends Record<string, unknown>>(
  row: T | null | undefined,
  field: string,
  locale: Locale,
): string[] {
  if (!row) return [];
  const localized = row[`${field}_${locale}`];
  if (Array.isArray(localized) && localized.length) return localized as string[];
  const fallback = row[`${field}_en`];
  return Array.isArray(fallback) ? (fallback as string[]) : [];
}

export function formatDate(value: string, locale: Locale): string {
  try {
    return new Date(value).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return value;
  }
}
