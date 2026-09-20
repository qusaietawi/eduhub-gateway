-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','editor','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- helper trigger fn
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL, title_ar text NOT NULL,
  summary_en text NOT NULL DEFAULT '', summary_ar text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '', content_ar text NOT NULL DEFAULT '',
  features_en text[] NOT NULL DEFAULT '{}', features_ar text[] NOT NULL DEFAULT '{}',
  category_en text NOT NULL DEFAULT '', category_ar text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'GraduationCap',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "services admin write" ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER services_touch BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- FEATURES
CREATE TABLE public.features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Sparkles',
  title_en text NOT NULL, title_ar text NOT NULL,
  description_en text NOT NULL DEFAULT '', description_ar text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.features TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.features TO authenticated;
GRANT ALL ON public.features TO service_role;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "features public read" ON public.features FOR SELECT USING (true);
CREATE POLICY "features admin write" ON public.features FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- BLOG CATEGORIES
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL, name_ar text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_categories TO service_role;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cats public read" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "cats admin write" ON public.blog_categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  title_en text NOT NULL, title_ar text NOT NULL,
  excerpt_en text NOT NULL DEFAULT '', excerpt_ar text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '', content_ar text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  author_en text NOT NULL DEFAULT '', author_ar text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts public read" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "posts admin write" ON public.blog_posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER posts_touch BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ALBUMS
CREATE TABLE public.albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL, title_ar text NOT NULL,
  description_en text NOT NULL DEFAULT '', description_ar text NOT NULL DEFAULT '',
  cover_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.albums TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.albums TO authenticated;
GRANT ALL ON public.albums TO service_role;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "albums public read" ON public.albums FOR SELECT USING (true);
CREATE POLICY "albums admin write" ON public.albums FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.album_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption_en text NOT NULL DEFAULT '', caption_ar text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.album_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.album_images TO authenticated;
GRANT ALL ON public.album_images TO service_role;
ALTER TABLE public.album_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "album images public read" ON public.album_images FOR SELECT USING (true);
CREATE POLICY "album images admin write" ON public.album_images FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- FAQS
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_en text NOT NULL, question_ar text NOT NULL,
  answer_en text NOT NULL DEFAULT '', answer_ar text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs public read" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "faqs admin write" ON public.faqs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- TEAM
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL, name_ar text NOT NULL,
  role_en text NOT NULL DEFAULT '', role_ar text NOT NULL DEFAULT '',
  bio_en text NOT NULL DEFAULT '', bio_ar text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team public read" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "team admin write" ON public.team_members FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SITE PAGES (about blocks, privacy, terms)
CREATE TABLE public.site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL DEFAULT '', title_ar text NOT NULL DEFAULT '',
  body_en text NOT NULL DEFAULT '', body_ar text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_pages TO authenticated;
GRANT ALL ON public.site_pages TO service_role;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages public read" ON public.site_pages FOR SELECT USING (true);
CREATE POLICY "pages admin write" ON public.site_pages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER pages_touch BEFORE UPDATE ON public.site_pages FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- CONTACT MESSAGES
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin reads messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin updates messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin deletes messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- SUBSCRIBERS
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  locale text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscribers TO authenticated;
GRANT ALL ON public.subscribers TO service_role;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can subscribe" ON public.subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin reads subscribers" ON public.subscribers FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin deletes subscribers" ON public.subscribers FOR DELETE TO authenticated USING (public.is_admin());

-- ============ SEED DATA ============
INSERT INTO public.services (slug,title_en,title_ar,summary_en,summary_ar,content_en,content_ar,features_en,features_ar,category_en,category_ar,image_url,icon,sort_order) VALUES
('professional-diplomas','Professional Diplomas','الدبلومات المهنية','Accredited one-year diplomas designed with employers to fast-track careers.','دبلومات معتمدة لمدة عام مصممة بالتعاون مع جهات العمل لتسريع المسار المهني.','Our professional diplomas combine academic depth with hands-on practice. Each track runs for two semesters, includes a capstone project reviewed by industry mentors, and ends with an accredited certificate recognised across the region. Students study in small cohorts with weekly labs, career coaching and an optional internship placement.','تجمع دبلوماتنا المهنية بين العمق الأكاديمي والتطبيق العملي. يمتد كل مسار على فصلين دراسيين، ويتضمن مشروع تخرج يقيّمه مرشدون من سوق العمل، وينتهي بشهادة معتمدة معترف بها في المنطقة. يدرس الطلاب في مجموعات صغيرة مع مختبرات أسبوعية وإرشاد مهني وفرصة تدريب عملي اختيارية.','{"Accredited certification","Industry capstone project","Weekly practical labs","Career coaching"}','{"شهادة معتمدة","مشروع تخرج تطبيقي","مختبرات عملية أسبوعية","إرشاد مهني"}','Academic Programs','البرامج الأكاديمية','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80','GraduationCap',1),
('corporate-training','Corporate Training','التدريب المؤسسي','Tailored upskilling programs delivered on-site or online for teams of any size.','برامج تدريبية مخصصة لتطوير مهارات الفرق تُقدَّم في مقر الشركة أو عبر الإنترنت.','We audit your team''s current capability, design a curriculum around real business goals, and deliver it through workshops, simulations and measurable assessments. Programs are available in English and Arabic, with detailed progress reporting for HR and L&D leaders.','نقوم بتقييم قدرات فريقك الحالية، ونصمم منهجاً يرتبط بأهداف العمل الفعلية، ونقدمه عبر ورش عمل ومحاكاة وتقييمات قابلة للقياس. تتوفر البرامج بالعربية والإنجليزية مع تقارير تقدم مفصلة لمسؤولي الموارد البشرية والتطوير.','{"Needs assessment","Bilingual delivery","On-site or virtual","HR progress reports"}','{"تحليل الاحتياجات","تقديم بلغتين","حضورياً أو عن بعد","تقارير تقدم للموارد البشرية"}','Corporate','الخدمات المؤسسية','https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80','Briefcase',2),
('language-institute','Language Institute','معهد اللغات','English, Arabic and French courses from beginner to advanced with certified tutors.','دورات في الإنجليزية والعربية والفرنسية من المستوى المبتدئ إلى المتقدم مع مدرسين معتمدين.','Placement tests map every learner onto the CEFR scale. Courses run in eight-week cycles with four contact hours per week, conversation clubs, and preparation tracks for IELTS and TOEFL. Certified tutors keep class sizes under twelve learners.','تحدد اختبارات تحديد المستوى موقع كل متعلم على مقياس الإطار الأوروبي المرجعي. تمتد الدورات على ثماني أسابيع بأربع ساعات أسبوعياً، وتشمل أندية محادثة ومسارات تحضيرية لاختباري آيلتس وتوفل، مع مدرسين معتمدين وفصول لا تتجاوز اثني عشر متعلماً.','{"CEFR placement test","IELTS & TOEFL prep","Conversation clubs","Max 12 learners per class"}','{"اختبار تحديد المستوى","تحضير آيلتس وتوفل","أندية محادثة","١٢ متعلماً كحد أقصى"}','Languages','اللغات','https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80','Languages',3),
('tech-bootcamps','Technology Bootcamps','معسكرات التقنية','Intensive 12-week bootcamps in software, data and cloud engineering.','معسكرات مكثفة لمدة ١٢ أسبوعاً في هندسة البرمجيات والبيانات والحوسبة السحابية.','Bootcamps are project-first: learners ship six portfolio projects, pair-program daily and present to a hiring panel in the final week. Tracks cover full-stack web development, data analytics and cloud operations, with a graduate employment support program.','تعتمد المعسكرات على المشاريع أولاً: ينجز المتعلمون ستة مشاريع لملف أعمالهم، ويبرمجون بشكل تشاركي يومياً، ويقدمون عروضهم أمام لجنة توظيف في الأسبوع الأخير. تشمل المسارات تطوير الويب المتكامل وتحليل البيانات وعمليات السحابة، مع برنامج دعم للتوظيف بعد التخرج.','{"Six portfolio projects","Daily pair programming","Hiring demo day","Employment support"}','{"ستة مشاريع لملف الأعمال","برمجة تشاركية يومية","يوم عرض أمام جهات التوظيف","دعم التوظيف"}','Technology','التقنية','https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80','Code',4),
('academic-advising','Academic Advising','الإرشاد الأكاديمي','One-to-one guidance on study plans, scholarships and university applications.','إرشاد فردي حول الخطط الدراسية والمنح والتقديم للجامعات.','Advisors work with students and families to build a realistic academic roadmap: choosing majors, scheduling admission tests, preparing scholarship files and reviewing personal statements. Sessions are available in Arabic and English, in person or online.','يعمل المرشدون مع الطلاب وأسرهم لبناء خطة أكاديمية واقعية: اختيار التخصص، وجدولة اختبارات القبول، وإعداد ملفات المنح، ومراجعة خطابات الدافع. الجلسات متاحة بالعربية والإنجليزية حضورياً أو عبر الإنترنت.','{"Personal study roadmap","Scholarship file review","Admission test planning","Family consultation"}','{"خطة دراسية شخصية","مراجعة ملف المنح","تخطيط اختبارات القبول","استشارة أسرية"}','Student Services','خدمات الطلاب','https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80','Compass',5),
('professional-certifications','Professional Certifications','الشهادات الاحترافية','Exam preparation for PMP, CMA, HR and quality management certifications.','تحضير لاختبارات شهادات إدارة المشاريع والمحاسبة الإدارية والموارد البشرية وإدارة الجودة.','Preparation courses follow the official bodies of knowledge, include full mock exams with analytics, and are taught by certified practitioners. We track each candidate''s readiness score weekly and provide a retake guarantee on eligible tracks.','تتبع دورات التحضير أدلة المعرفة الرسمية، وتتضمن اختبارات محاكية كاملة مع تحليلات، ويقدمها ممارسون معتمدون. نتابع درجة جاهزية كل مرشح أسبوعياً ونوفر ضمان إعادة الاختبار في المسارات المؤهلة.','{"Official curriculum alignment","Full mock exams","Weekly readiness score","Retake guarantee"}','{"مطابقة المنهج الرسمي","اختبارات محاكية كاملة","درجة جاهزية أسبوعية","ضمان إعادة الاختبار"}','Corporate','الخدمات المؤسسية','https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80','Award',6);

INSERT INTO public.features (icon,title_en,title_ar,description_en,description_ar,sort_order) VALUES
('BadgeCheck','Accredited Programs','برامج معتمدة','Every diploma and certificate is recognised by regional accreditation bodies and employers.','كل دبلوم وشهادة معترف بها من جهات الاعتماد الإقليمية وجهات العمل.',1),
('Users','Expert Instructors','مدربون خبراء','Our faculty combines academic credentials with an average of 12 years of field practice.','يجمع أعضاء هيئة التدريب بين المؤهلات الأكاديمية وخبرة ميدانية تبلغ ١٢ عاماً في المتوسط.',2),
('Languages','Fully Bilingual','بلغتين بالكامل','Study, materials and support in both Arabic and English, with no difference in quality.','الدراسة والمواد والدعم بالعربية والإنجليزية دون أي فرق في الجودة.',3),
('Laptop','Flexible Learning','تعلّم مرن','Choose on-campus, live online or blended schedules including evenings and weekends.','اختر الحضور في الحرم الجامعي أو التعلم المباشر عبر الإنترنت أو الدمج بينهما مع جداول مسائية ونهاية الأسبوع.',4),
('Building2','Modern Facilities','مرافق حديثة','Smart classrooms, computer labs, a language lab and a quiet library across two floors.','قاعات ذكية ومختبرات حاسوب ومختبر لغات ومكتبة هادئة على طابقين.',5),
('TrendingUp','Career Outcomes','نتائج مهنية','78% of our graduates report a promotion or new role within nine months.','٧٨٪ من متخرجينا يحصلون على ترقية أو وظيفة جديدة خلال تسعة أشهر.',6),
('HeartHandshake','Personal Support','دعم شخصي','A dedicated advisor follows every learner from enrolment to graduation.','مرشد مخصص يتابع كل متعلم من التسجيل حتى التخرج.',7),
('ShieldCheck','Quality Assurance','ضمان الجودة','Independent course evaluations every cycle, published to students and partners.','تقييمات مستقلة للدورات في كل دورة تدريبية تُنشر للطلاب والشركاء.',8);

INSERT INTO public.blog_categories (slug,name_en,name_ar) VALUES
('study-tips','Study Tips','نصائح الدراسة'),
('career','Career Development','التطوير المهني'),
('campus-news','Campus News','أخبار الحرم'),
('technology','Technology','التقنية'),
('languages','Languages','اللغات');

INSERT INTO public.blog_posts (slug,category_id,title_en,title_ar,excerpt_en,excerpt_ar,content_en,content_ar,image_url,author_en,author_ar,published_at) VALUES
('active-recall-study-method',(SELECT id FROM public.blog_categories WHERE slug='study-tips'),'Active Recall: The Study Method That Actually Works','الاستدعاء النشط: طريقة الدراسة التي تنجح فعلاً','Re-reading notes feels productive but rarely sticks. Here is how to replace it with active recall.','إعادة قراءة الملاحظات تبدو مفيدة لكنها نادراً ما تثبت. إليك كيف تستبدلها بالاستدعاء النشط.','Most learners revise by re-reading, highlighting and copying notes. These methods create a comfortable feeling of familiarity without building retrieval strength. Active recall flips the process: you close the book and force your brain to reconstruct the answer.

Start by turning every heading in your notes into a question. Answer it from memory, then check. Space the sessions: one day, three days, one week, one month. Pair it with short written explanations, as if teaching a classmate.

Our learners who switched to structured recall schedules improved mid-term results by an average of 14 percent in one semester.','يراجع معظم المتعلمين بإعادة القراءة والتظليل ونسخ الملاحظات. تخلق هذه الطرق شعوراً مريحاً بالألفة دون بناء قدرة على الاستدعاء. الاستدعاء النشط يعكس العملية: تغلق الكتاب وتجبر عقلك على إعادة بناء الإجابة.

ابدأ بتحويل كل عنوان في ملاحظاتك إلى سؤال. أجب عنه من الذاكرة ثم تحقق. وزّع الجلسات: يوم، ثلاثة أيام، أسبوع، شهر. أضف إليها شرحاً مكتوباً قصيراً كأنك تدرّس زميلاً.

حقق المتعلمون الذين انتقلوا إلى جداول استدعاء منظمة تحسناً في نتائج منتصف الفصل بمعدل ١٤٪ في فصل واحد.','https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80','Dr. Layla Mansour','د. ليلى منصور',now() - interval '3 days'),
('cv-that-passes-screening',(SELECT id FROM public.blog_categories WHERE slug='career'),'Writing a CV That Passes the First Screening','كتابة سيرة ذاتية تتجاوز الفحص الأول','Recruiters spend under a minute per CV. Structure yours so the important facts surface first.','يمنح المسؤولون عن التوظيف أقل من دقيقة لكل سيرة ذاتية. رتّب سيرتك ليظهر المهم أولاً.','A first screening is a filtering exercise, not a reading exercise. Lead with a three-line professional summary that names your field, years of experience and strongest measurable result.

Write achievements, not duties. "Reduced monthly reporting time from five days to one" beats "responsible for reporting". Keep one page for under five years of experience, two at most beyond that.

Mirror the vocabulary of the job posting, because most mid-size employers now filter applications by keyword before a human reads them.','الفحص الأول عملية تصفية وليس عملية قراءة. ابدأ بملخص مهني من ثلاثة أسطر يذكر مجالك وسنوات خبرتك وأقوى نتيجة قابلة للقياس.

اكتب الإنجازات لا المهام. عبارة «قلّصت وقت التقارير الشهرية من خمسة أيام إلى يوم» أقوى من «مسؤول عن التقارير». التزم بصفحة واحدة لمن خبرته أقل من خمس سنوات، وصفحتين كحد أقصى بعد ذلك.

استخدم مفردات الإعلان الوظيفي نفسها، لأن معظم جهات العمل المتوسطة تصفّي الطلبات بالكلمات المفتاحية قبل أن يقرأها إنسان.','https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80','Omar Haddad','عمر حداد',now() - interval '9 days'),
('new-language-lab-opening',(SELECT id FROM public.blog_categories WHERE slug='campus-news'),'Our New Language Lab Opens This Term','افتتاح مختبر اللغات الجديد هذا الفصل','Twenty-four stations, live pronunciation feedback and a dedicated recording booth.','أربع وعشرون محطة وتغذية راجعة فورية للنطق وغرفة تسجيل مخصصة.','The new language lab on the second floor opens to all Language Institute students this term. It holds twenty-four individual stations with headsets, pronunciation analysis software and a soundproof recording booth for speaking assessments.

Tutors can now review recordings asynchronously and leave timestamped comments, so speaking feedback no longer waits for the next class. Open lab hours run daily from 4pm to 8pm.','يفتح مختبر اللغات الجديد في الطابق الثاني أبوابه لجميع طلاب معهد اللغات هذا الفصل. يضم أربعاً وعشرين محطة فردية مزودة بسماعات وبرمجيات تحليل النطق وغرفة تسجيل معزولة صوتياً لتقييم المحادثة.

يمكن للمدرسين الآن مراجعة التسجيلات في أي وقت وترك ملاحظات مرتبطة بالتوقيت، فلم تعد التغذية الراجعة للمحادثة تنتظر الحصة التالية. ساعات المختبر المفتوحة يومياً من الرابعة حتى الثامنة مساءً.','https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80','EduHub Newsroom','غرفة أخبار إديو هَب',now() - interval '16 days'),
('choosing-first-programming-language',(SELECT id FROM public.blog_categories WHERE slug='technology'),'Choosing Your First Programming Language','اختيار لغة البرمجة الأولى','The language matters far less than finishing something real with it.','اللغة أقل أهمية بكثير من إنجاز شيء حقيقي بها.','Beginners lose months comparing languages. The honest answer: pick the one used by the jobs or projects nearest to you, then stay with it for at least six months.

For web work start with JavaScript; for data and automation start with Python; for enterprise backends Java or C# remain safe bets. What separates people who learn to program from people who keep starting is shipping a finished, imperfect project.

Build something you will actually use — a budget tracker, a class schedule, a small shop page — and let the language be a tool rather than the goal.','يهدر المبتدئون أشهراً في مقارنة اللغات. الجواب الصريح: اختر اللغة المستخدمة في الوظائف أو المشاريع الأقرب إليك، ثم التزم بها ستة أشهر على الأقل.

لعمل الويب ابدأ بجافاسكربت، وللبيانات والأتمتة ابدأ بپايثون، وللأنظمة المؤسسية تبقى جافا أو سي شارب خياراً آمناً. ما يفرق بين من يتعلم البرمجة ومن يبدأ دائماً من جديد هو إنجاز مشروع مكتمل وإن كان غير مثالي.

ابنِ شيئاً ستستخدمه فعلاً: متتبع ميزانية، جدول حصص، صفحة متجر صغيرة، ولتكن اللغة أداة لا هدفاً.','https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80','Nadia Al-Amin','نادية الأمين',now() - interval '24 days'),
('speak-english-with-confidence',(SELECT id FROM public.blog_categories WHERE slug='languages'),'Five Habits to Speak English With Confidence','خمس عادات للتحدث بالإنجليزية بثقة','Fluency is built in small daily reps, not in occasional long study sessions.','الطلاقة تُبنى بتكرار يومي قصير لا بجلسات دراسة طويلة متفرقة.','Confidence in speaking comes from reducing hesitation, not from knowing more words. Five habits do most of the work.

Speak for two minutes a day out loud, record it and listen back. Learn phrases instead of isolated words. Shadow a short audio clip line by line. Keep a list of your ten most common errors and check it weekly. Finally, join one conversation session a week where mistakes are expected.

Learners who keep this routine for eight weeks typically move a full CEFR sub-level in speaking.','تأتي الثقة في التحدث من تقليل التردد لا من معرفة كلمات أكثر. خمس عادات تنجز معظم العمل.

تحدث بصوت عالٍ دقيقتين يومياً، وسجّل واستمع لنفسك. تعلّم العبارات بدلاً من الكلمات المفردة. ردّد مقطعاً صوتياً قصيراً سطراً بسطر. احتفظ بقائمة بأكثر عشرة أخطاء تكرراً لديك وراجعها أسبوعياً. وأخيراً، انضم إلى جلسة محادثة أسبوعية يكون الخطأ فيها متوقعاً.

من يحافظ على هذا الروتين ثمانية أسابيع يتقدم عادة مستوى فرعياً كاملاً في المحادثة.','https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80','Sarah Khoury','سارة خوري',now() - interval '31 days'),
('time-management-for-working-students',(SELECT id FROM public.blog_categories WHERE slug='study-tips'),'Time Management for Working Students','إدارة الوقت للطلاب العاملين','A realistic weekly system for people who study after a full day of work.','نظام أسبوعي واقعي لمن يدرس بعد يوم عمل كامل.','Working students fail schedules that assume unlimited energy. Plan around energy, not hours.

Reserve your sharpest 90 minutes for the hardest subject, and use low-energy slots for review, flashcards and admin. Batch similar tasks. Protect one full evening off each week; burnout costs more than the hours it saves.

Write the week on a single page every Sunday, then only negotiate with that page — not with your memory.','يفشل الطلاب العاملون في الجداول التي تفترض طاقة غير محدودة. خطط حسب الطاقة لا حسب الساعات.

احتفظ بأفضل ٩٠ دقيقة لديك للمادة الأصعب، واستخدم أوقات الطاقة المنخفضة للمراجعة والبطاقات والمهام الإدارية. اجمع المهام المتشابهة معاً. احمِ مساءً كاملاً خالياً كل أسبوع، فالإنهاك يكلف أكثر من الساعات التي يوفرها.

اكتب أسبوعك في صفحة واحدة كل أحد، ثم تفاوض مع تلك الصفحة فقط لا مع ذاكرتك.','https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80','Dr. Layla Mansour','د. ليلى منصور',now() - interval '40 days'),
('data-skills-every-manager-needs',(SELECT id FROM public.blog_categories WHERE slug='career'),'Four Data Skills Every Manager Now Needs','أربع مهارات بيانات يحتاجها كل مدير اليوم','You do not need to code, but you do need to read numbers critically.','لا تحتاج إلى البرمجة، لكنك تحتاج إلى قراءة الأرقام بعين ناقدة.','Managers are increasingly asked to defend decisions with data. Four skills cover most of it.

First, read a chart critically: axis ranges, sample size and what is missing. Second, understand averages versus distributions. Third, write a clear metric definition — half of reporting disputes are definition disputes. Fourth, learn enough spreadsheet modelling to test a scenario yourself before requesting analyst time.

Our corporate track teaches all four in twelve evening sessions, with cases from participants'' own reports.','يُطلب من المدراء بشكل متزايد تبرير قراراتهم بالبيانات. أربع مهارات تغطي معظم الأمر.

أولاً، اقرأ الرسم البياني بعين ناقدة: نطاق المحاور وحجم العينة وما هو غائب. ثانياً، افهم الفرق بين المتوسطات والتوزيعات. ثالثاً، اكتب تعريفاً واضحاً للمؤشر، فنصف الخلافات حول التقارير هي خلافات تعريف. رابعاً، تعلّم من النمذجة في الجداول ما يكفي لاختبار سيناريو بنفسك قبل طلب وقت المحلل.

يغطي مسارنا المؤسسي المهارات الأربع في اثنتي عشرة جلسة مسائية بحالات من تقارير المشاركين أنفسهم.','https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80','Omar Haddad','عمر حداد',now() - interval '52 days'),
('spring-graduation-ceremony',(SELECT id FROM public.blog_categories WHERE slug='campus-news'),'Spring Graduation Ceremony Highlights','أبرز لحظات حفل تخرج الربيع','412 graduates across eleven programs, and three new employer partnerships announced.','٤١٢ متخرجاً في أحد عشر برنامجاً وثلاث شراكات جديدة مع جهات عمل.','This spring 412 learners graduated across eleven diploma and certification programs — our largest cohort so far. Twenty-nine graduated with distinction, and eighteen capstone projects were adopted by partner organisations.

During the ceremony we announced three new employer partnerships that add guaranteed interview slots for graduates of the technology and corporate tracks. Photographs from the day are available in the gallery.','تخرّج هذا الربيع ٤١٢ متعلماً في أحد عشر برنامج دبلوم وشهادة، وهي أكبر دفعة لدينا حتى الآن. تخرّج تسعة وعشرون بمرتبة الشرف، وتبنت جهات شريكة ثمانية عشر مشروع تخرج.

وأعلنا خلال الحفل ثلاث شراكات جديدة مع جهات عمل تتيح مقابلات مضمونة لمتخرجي مسارات التقنية والبرامج المؤسسية. صور اليوم متاحة في معرض الصور.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80','EduHub Newsroom','غرفة أخبار إديو هَب',now() - interval '68 days'),
('cloud-skills-2026',(SELECT id FROM public.blog_categories WHERE slug='technology'),'Cloud Skills Employers Ask For in 2026','مهارات السحابة التي تطلبها جهات العمل في ٢٠٢٦','Infrastructure as code, cost awareness and security fundamentals top the list.','البنية التحتية كشيفرة والوعي بالتكاليف وأساسيات الأمن تتصدر القائمة.','Hiring managers in our partner network now screen for three cloud competencies far more than certifications alone.

Infrastructure as code comes first: describing environments in version-controlled files instead of clicking through consoles. Cost awareness comes second — engineers who can explain and reduce a monthly bill are disproportionately valuable. Security fundamentals come third: least privilege, secret handling and audit trails.

Our cloud operations track now dedicates a full module to each of the three.','يبحث مسؤولو التوظيف في شبكة شركائنا عن ثلاث كفاءات سحابية أكثر بكثير من الشهادات وحدها.

تأتي البنية التحتية كشيفرة أولاً: وصف البيئات في ملفات خاضعة لإدارة الإصدارات بدلاً من النقر في لوحات التحكم. ويأتي الوعي بالتكاليف ثانياً، فالمهندس الذي يشرح فاتورة شهرية ويقلّصها ذو قيمة استثنائية. وتأتي أساسيات الأمن ثالثاً: أقل صلاحية ممكنة، وإدارة الأسرار، وسجلات التتبع.

يخصص مسار عمليات السحابة لدينا الآن وحدة كاملة لكل من الثلاثة.','https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80','Nadia Al-Amin','نادية الأمين',now() - interval '85 days');

INSERT INTO public.albums (slug,title_en,title_ar,description_en,description_ar,cover_url,sort_order) VALUES
('campus-life','Campus Life','الحياة في الحرم','Everyday moments from our classrooms, library and courtyard.','لحظات يومية من قاعاتنا ومكتبتنا والساحة الداخلية.','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',1),
('graduation-2026','Graduation 2026','حفل التخرج ٢٠٢٦','Highlights from the spring graduation ceremony and family celebrations.','أبرز لحظات حفل تخرج الربيع واحتفالات الأسر.','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',2),
('workshops','Workshops & Labs','ورش العمل والمختبرات','Hands-on sessions from our technology, language and corporate tracks.','جلسات تطبيقية من مسارات التقنية واللغات والبرامج المؤسسية.','https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',3),
('community-events','Community Events','فعاليات المجتمع','Open days, career fairs and partner events hosted on campus.','أيام مفتوحة ومعارض وظائف وفعاليات الشركاء في الحرم.','https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',4);

INSERT INTO public.album_images (album_id,image_url,caption_en,caption_ar,sort_order)
SELECT a.id, i.url, i.cen, i.car, i.ord FROM public.albums a
JOIN (VALUES
 ('campus-life','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80','Main courtyard in the morning','الساحة الرئيسية في الصباح',1),
 ('campus-life','https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80','Lecture hall session','محاضرة في القاعة الكبرى',2),
 ('campus-life','https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=80','Quiet study in the library','دراسة هادئة في المكتبة',3),
 ('campus-life','https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80','Group discussion','نقاش جماعي',4),
 ('campus-life','https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80','Language lab stations','محطات مختبر اللغات',5),
 ('campus-life','https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1400&q=80','Evening classes','الحصص المسائية',6),
 ('graduation-2026','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80','Graduates entering the hall','المتخرجون يدخلون القاعة',1),
 ('graduation-2026','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80','Certificates handover','تسليم الشهادات',2),
 ('graduation-2026','https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?auto=format&fit=crop&w=1400&q=80','Family celebrations','احتفالات الأسر',3),
 ('graduation-2026','https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80','Guest speaker address','كلمة المتحدث الضيف',4),
 ('graduation-2026','https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80','Class photograph','الصورة الجماعية للدفعة',5),
 ('workshops','https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80','Coding bootcamp sprint','ورشة برمجة مكثفة',1),
 ('workshops','https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80','Corporate leadership workshop','ورشة قيادة مؤسسية',2),
 ('workshops','https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80','Advising session','جلسة إرشاد أكاديمي',3),
 ('workshops','https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80','Data analytics lab','مختبر تحليل البيانات',4),
 ('workshops','https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1400&q=80','Conversation club','نادي المحادثة',5),
 ('community-events','https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80','Annual open day','اليوم المفتوح السنوي',1),
 ('community-events','https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1400&q=80','Career fair booths','أجنحة معرض الوظائف',2),
 ('community-events','https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80','Partner networking evening','أمسية تواصل الشركاء',3),
 ('community-events','https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80','Community lecture','محاضرة مجتمعية',4)
) AS i(slug,url,cen,car,ord) ON i.slug = a.slug;

INSERT INTO public.faqs (question_en,question_ar,answer_en,answer_ar,sort_order) VALUES
('How do I enrol in a program?','كيف أسجل في أحد البرامج؟','Submit the contact form or visit the admissions office with your ID and latest certificate. An advisor will confirm your eligibility and reserve a seat within two working days.','أرسل نموذج التواصل أو زر مكتب التسجيل مع هويتك وآخر شهادة حصلت عليها. سيؤكد المرشد أهليتك ويحجز مقعدك خلال يومي عمل.',1),
('Are your certificates accredited?','هل شهاداتكم معتمدة؟','Yes. All diplomas and professional certificates are issued under our accredited training licence and are recognised by regional employers and accreditation bodies.','نعم. تُصدر جميع الدبلومات والشهادات الاحترافية بموجب ترخيص التدريب المعتمد لدينا، وهي معترف بها من جهات العمل وجهات الاعتماد في المنطقة.',2),
('Can I study in Arabic only?','هل يمكنني الدراسة بالعربية فقط؟','Most programs run in parallel Arabic and English sections. Course materials, assessments and support are available in both languages.','تُقدَّم معظم البرامج في شعب عربية وإنجليزية متوازية. المواد والتقييمات والدعم متاحة باللغتين.',3),
('Do you offer evening or weekend classes?','هل تتوفر حصص مسائية أو في نهاية الأسبوع؟','Yes. Evening groups start at 6pm on weekdays, and intensive weekend groups run on Friday and Saturday mornings.','نعم. تبدأ المجموعات المسائية في السادسة مساءً في أيام الأسبوع، وتعمل المجموعات المكثفة في صباح الجمعة والسبت.',4),
('Is there a payment plan?','هل توجد خطة سداد؟','Tuition can be split across up to four instalments per program. Details are confirmed with the admissions office at registration.','يمكن تقسيم الرسوم على أربع دفعات كحد أقصى لكل برنامج. تُحدد التفاصيل مع مكتب التسجيل عند التسجيل.',5),
('What is the class size?','ما عدد الطلاب في الشعبة؟','Language classes hold a maximum of twelve learners; diploma and bootcamp cohorts are capped at twenty-four.','تضم شعب اللغات اثني عشر متعلماً كحد أقصى، بينما تصل دفعات الدبلومات والمعسكرات إلى أربعة وعشرين.',6),
('Do you provide corporate invoices?','هل تصدرون فواتير للشركات؟','Yes. Corporate training and sponsored enrolments receive formal invoices and a signed training agreement.','نعم. تحصل برامج التدريب المؤسسي والتسجيلات المدعومة على فواتير رسمية واتفاقية تدريب موقّعة.',7),
('Can I transfer between programs?','هل يمكنني الانتقال بين البرامج؟','Transfers are possible within the first two weeks of a cycle, subject to seat availability and advisor approval.','الانتقال ممكن خلال الأسبوعين الأولين من الدورة، بحسب توفر المقاعد وموافقة المرشد.',8);

INSERT INTO public.team_members (name_en,name_ar,role_en,role_ar,bio_en,bio_ar,photo_url,sort_order) VALUES
('Dr. Layla Mansour','د. ليلى منصور','Academic Director','المديرة الأكاديمية','Twenty years in curriculum design and higher education quality assurance.','عشرون عاماً في تصميم المناهج وضمان الجودة في التعليم العالي.','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',1),
('Omar Haddad','عمر حداد','Head of Corporate Training','رئيس التدريب المؤسسي','Former HR director who now designs measurable upskilling programs for teams.','مدير موارد بشرية سابق يصمم الآن برامج تطوير مهارات قابلة للقياس للفرق.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',2),
('Sarah Khoury','سارة خوري','Language Institute Manager','مديرة معهد اللغات','CELTA-certified trainer specialising in CEFR-aligned speaking assessment.','مدربة معتمدة من CELTA متخصصة في تقييم المحادثة وفق الإطار الأوروبي المرجعي.','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',3),
('Nadia Al-Amin','نادية الأمين','Technology Lead','قائدة مسار التقنية','Cloud engineer and bootcamp mentor with a focus on employability outcomes.','مهندسة سحابة ومرشدة معسكرات تركز على نتائج قابلية التوظيف.','https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',4),
('Yousef Darwish','يوسف درويش','Student Affairs Officer','مسؤول شؤون الطلاب','First point of contact for enrolment, schedules and student support.','نقطة الاتصال الأولى للتسجيل والجداول ودعم الطلاب.','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',5),
('Rana Suleiman','رنا سليمان','Quality Assurance Lead','قائدة ضمان الجودة','Runs independent course evaluations and accreditation reporting.','تدير تقييمات الدورات المستقلة وتقارير الاعتماد.','https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',6);

INSERT INTO public.site_pages (slug,title_en,title_ar,body_en,body_ar) VALUES
('about-intro','Who We Are','من نحن','EduHub is a university and training centre built around one idea: learning should lead somewhere. Since 2009 we have combined accredited academic programs with practical, employer-designed training for more than 14,000 learners.

We operate two campuses, a language institute and a corporate training unit, teaching fully in both Arabic and English.','إديو هَب جامعة ومركز تدريب قائم على فكرة واحدة: التعلّم يجب أن يؤدي إلى نتيجة. منذ عام ٢٠٠٩ نجمع بين البرامج الأكاديمية المعتمدة والتدريب العملي المصمم مع جهات العمل لأكثر من ١٤٠٠٠ متعلم.

ندير حرمين جامعيين ومعهداً للغات ووحدة للتدريب المؤسسي، وندرّس بالعربية والإنجليزية بالكامل.'),
('about-mission','Our Mission','رسالتنا','To deliver accessible, accredited education that measurably improves our learners'' professional lives, taught equally well in Arabic and English.','تقديم تعليم معتمد وميسّر يحسّن حياة متعلمينا المهنية بشكل قابل للقياس، ويُدرَّس بالعربية والإنجليزية بالجودة نفسها.'),
('about-vision','Our Vision','رؤيتنا','To be the region''s most trusted bridge between classroom learning and real employment outcomes.','أن نكون الجسر الأكثر موثوقية في المنطقة بين التعلّم في القاعة ونتائج التوظيف الحقيقية.'),
('about-history','Our Story','قصتنا','EduHub opened in 2009 as a single language institute with four classrooms. Professional diplomas followed in 2012, the corporate training unit in 2016, and the technology bootcamps in 2021. Our second campus and language lab opened in 2024, and today more than 120 instructors and staff serve over 2,300 active learners each year.','بدأ إديو هَب عام ٢٠٠٩ معهداً للغات بأربع قاعات فقط. ثم جاءت الدبلومات المهنية عام ٢٠١٢، ووحدة التدريب المؤسسي عام ٢٠١٦، ومعسكرات التقنية عام ٢٠٢١. افتُتح الحرم الثاني ومختبر اللغات عام ٢٠٢٤، ويخدم اليوم أكثر من ١٢٠ مدرباً وموظفاً ما يزيد على ٢٣٠٠ متعلم نشط سنوياً.'),
('privacy','Privacy Policy','سياسة الخصوصية','Last updated: January 2026

1. Information we collect
We collect the details you provide through our contact and newsletter forms — name, email address, phone number and message content — together with basic technical information such as browser type and pages visited.

2. How we use information
We use your details to answer enquiries, process enrolment requests, send the newsletter you subscribed to, and improve our programs. We do not sell personal data.

3. Newsletter
You may unsubscribe at any time using the link in any newsletter email or by contacting us. We then delete your address from the mailing list.

4. Data retention
Enquiry records are kept for up to 24 months. Student academic records are kept as required by accreditation rules.

5. Sharing
We share data only with service providers who help us operate the website and email delivery, and only to the extent needed.

6. Your rights
You may request a copy of your data, correction of inaccurate data, or deletion, by writing to privacy@eduhub.example.

7. Cookies
We use essential cookies for site function and anonymous analytics cookies to understand usage.

8. Contact
Questions about this policy can be sent to privacy@eduhub.example.','آخر تحديث: يناير ٢٠٢٦

١. المعلومات التي نجمعها
نجمع البيانات التي تقدمها عبر نماذج التواصل والنشرة البريدية — الاسم والبريد الإلكتروني ورقم الهاتف ونص الرسالة — إلى جانب معلومات تقنية أساسية مثل نوع المتصفح والصفحات التي زرتها.

٢. كيف نستخدم المعلومات
نستخدم بياناتك للرد على الاستفسارات ومعالجة طلبات التسجيل وإرسال النشرة التي اشتركت بها وتحسين برامجنا. ولا نبيع البيانات الشخصية.

٣. النشرة البريدية
يمكنك إلغاء الاشتراك في أي وقت عبر الرابط في أي رسالة أو بالتواصل معنا، وعندها نحذف عنوانك من قائمة المراسلة.

٤. مدة الاحتفاظ بالبيانات
نحتفظ بسجلات الاستفسارات حتى ٢٤ شهراً، وبالسجلات الأكاديمية للطلاب بحسب ما تقتضيه قواعد الاعتماد.

٥. مشاركة البيانات
نشارك البيانات فقط مع مزودي الخدمات الذين يساعدوننا في تشغيل الموقع وإرسال البريد، وبالقدر اللازم فقط.

٦. حقوقك
يمكنك طلب نسخة من بياناتك أو تصحيحها أو حذفها بالكتابة إلى privacy@eduhub.example.

٧. ملفات تعريف الارتباط
نستخدم ملفات ضرورية لعمل الموقع وملفات تحليلات مجهولة لفهم الاستخدام.

٨. التواصل
ترسل الأسئلة حول هذه السياسة إلى privacy@eduhub.example.'),
('terms','Terms & Conditions','الشروط والأحكام','Last updated: January 2026

1. Acceptance
By using this website or enrolling in a program you accept these terms.

2. Enrolment
A seat is confirmed only after the admissions office issues a written confirmation and the first instalment is received.

3. Fees and instalments
Published fees apply to the stated cycle. Instalment dates are set in the registration agreement. Unpaid instalments may suspend access to classes.

4. Withdrawal and refunds
Withdrawal within the first week of a cycle is refunded at 75% of fees paid. After the second week no refund applies, except in documented medical cases reviewed by the academic director.

5. Attendance
A minimum of 75% attendance is required to receive a certificate.

6. Conduct
Learners are expected to treat staff and fellow learners with respect. Harassment, cheating or damage to facilities may lead to dismissal without refund.

7. Intellectual property
Course materials are licensed for personal study only and may not be redistributed or resold.

8. Schedule changes
We may change instructors, rooms or session times with notice, and will reschedule any cancelled session.

9. Governing terms
These terms are governed by the local laws applicable to our registered training licence.','آخر تحديث: يناير ٢٠٢٦

١. القبول
باستخدامك هذا الموقع أو التسجيل في أحد البرامج فإنك تقبل هذه الشروط.

٢. التسجيل
لا يُعد المقعد مؤكداً إلا بعد إصدار مكتب التسجيل تأكيداً خطياً واستلام الدفعة الأولى.

٣. الرسوم والأقساط
تنطبق الرسوم المعلنة على الدورة المذكورة، وتُحدد مواعيد الأقساط في اتفاقية التسجيل. قد يؤدي عدم سداد الأقساط إلى إيقاف الحضور.

٤. الانسحاب والاسترداد
يُسترد ٧٥٪ من الرسوم المدفوعة عند الانسحاب في الأسبوع الأول من الدورة. ولا يوجد استرداد بعد الأسبوع الثاني، إلا في الحالات الطبية الموثقة التي يراجعها المدير الأكاديمي.

٥. الحضور
يُشترط حضور ٧٥٪ من الجلسات كحد أدنى للحصول على الشهادة.

٦. السلوك
يُتوقع من المتعلمين احترام الموظفين والزملاء. وقد يؤدي التحرش أو الغش أو الإضرار بالمرافق إلى الفصل دون استرداد.

٧. الملكية الفكرية
مواد الدورات مرخصة للدراسة الشخصية فقط ولا يجوز إعادة توزيعها أو بيعها.

٨. تغيير الجداول
يجوز لنا تغيير المدربين أو القاعات أو أوقات الجلسات بإشعار مسبق، وسنعيد جدولة أي جلسة ملغاة.

٩. القانون الحاكم
تخضع هذه الشروط للقوانين المحلية المنطبقة على ترخيص التدريب المسجل لدينا.'),
('contact-info','Contact Information','معلومات التواصل','Al Nahda Street, Building 42, Education District

Phone: +962 6 500 1234
Mobile: +962 79 123 4567
Email: info@eduhub.example

Working hours:
Sunday to Thursday, 8:00 – 18:00
Saturday, 9:00 – 14:00
Friday closed','شارع النهضة، مبنى ٤٢، الحي التعليمي

هاتف: ‎+962 6 500 1234
خلوي: ‎+962 79 123 4567
البريد: info@eduhub.example

ساعات العمل:
الأحد إلى الخميس، ٨:٠٠ – ١٨:٠٠
السبت، ٩:٠٠ – ١٤:٠٠
الجمعة مغلق');

INSERT INTO public.faqs (question_en,question_ar,answer_en,answer_ar,sort_order) VALUES
('Do you help graduates find jobs?','هل تساعدون المتخرجين في إيجاد عمل؟','Graduates of technology and corporate tracks get CV reviews, interview practice and guaranteed interview slots with partner employers.','يحصل متخرجو مسارات التقنية والبرامج المؤسسية على مراجعة السيرة الذاتية وتدريب على المقابلات ومقابلات مضمونة مع جهات عمل شريكة.',9);

INSERT INTO public.subscribers (email,locale,created_at) VALUES
('amina.saleh@example.com','ar',now() - interval '2 days'),
('j.peterson@example.com','en',now() - interval '5 days'),
('khaled.n@example.com','ar',now() - interval '11 days'),
('maria.lopez@example.com','en',now() - interval '19 days'),
('hussein.ali@example.com','ar',now() - interval '27 days');

INSERT INTO public.contact_messages (name,email,phone,subject,message,is_read,created_at) VALUES
('Amina Saleh','amina.saleh@example.com','+962 79 555 1122','Diploma enrolment','I would like to know the start date of the next professional diploma cycle and the instalment options.',false,now() - interval '6 hours'),
('James Peterson','j.peterson@example.com','+962 79 555 3344','Corporate training quote','We are a team of 18 and need a bilingual leadership program. Could you send a proposal?',false,now() - interval '2 days'),
('Khaled Nasser','khaled.n@example.com','+962 77 555 7788','Language placement test','When is the next English placement test, and is there a fee?',true,now() - interval '8 days'),
('Maria Lopez','maria.lopez@example.com','','Bootcamp schedule','Is the data analytics bootcamp available in the evenings?',true,now() - interval '15 days');