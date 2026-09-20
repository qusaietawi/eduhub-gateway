# EduHub Gateway

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

Project: EduHub — University & Training Center

User Specifications & Scope:
1. Public Bilingual Website (English & Arabic):
   - Fully bilingual with visible language switcher in main navigation
   - Arabic must use RTL direction with proper mirrored layout; English must use LTR direction
   - Modern, professional, responsive educational/training center visual identity (desktop, tablet, mobile)
   - Pages required:
     1. Home (Hero, intro, preview of services, features, latest blogs, gallery albums, FAQ preview, newsletter subscription, contact CTA, footer)
     2. About Us (Introduction, mission, vision, values, history, team/sections)
     3. Services (Listing with EN/AR title, short description, images, categories)
     4. Service Details (Dynamic page with full description, key features, related services, CTA)
     5. Features (Advantages, icons, bilingual titles & descriptions)
     6. Blog (Listing with search, category filter, pagination/load-more, cards)
     7. Blog Details (Dynamic page with full content, featured image, author, date, category, related posts)
     8. Gallery / Albums (Album grid with cover images, descriptions, photo counts)
     9. Album Details (Dynamic lightbox/photo grid for album images)
     10. Contact Us (Address, phone, email, working hours, interactive contact form with validation, map area)
     11. FAQ (Accordion layout with bilingual Q&A)
     12. Newsletter Subscription (Subscription form with validation)
     13. Privacy Policy (Bilingual content)
     14. Terms & Conditions (Bilingual content)

2. Admin CMS Dashboard:
   - Protected admin area with authentication
   - Overview metrics (counts of services, blogs, albums, FAQs, messages, subscribers, recent activity)
   - Full CRUD management with separate English and Arabic fields (Title EN, Title AR, Content EN, Content AR, etc.) for:
     * Services
     * Features
     * Blog Posts & Categories
     * Gallery Albums & Images
     * FAQs
     * About Us content
     * Privacy Policy & Terms
   - View & manage submissions:
     * Contact Messages (read status, details)
     * Newsletter Subscribers (list, export/filter, delete)

3. Backend & Data:
   - Persistent storage for all CMS content and submissions (services, features, blog posts, categories, albums, gallery images, faqs, contact messages, subscribers, static page content)
   - Realistic bilingual (EN & AR) sample data pre-populated for all entities so every page displays rich content right away.

4. Exclusions:
   - Do NOT include student registration, online exams, grading, payments, attendance, or complex ERP portals. Focus strictly on the public website and Admin CMS dashboard.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/729fb525-c4d3-4212-b2e6-25f20e71d698).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
