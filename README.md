<div align="center">

# Cycle Paradise Web Experience

Premium cycling tours and travel inspiration across Sri Lanka, built with [Astro](https://astro.build), Tailwind CSS, and a sprinkling of interactive components.

</div>

## ✨ Highlights

- **Story-driven marketing site** for Cycle Paradise with SEO-first layouts and structured data.
- **Dynamic tour data** powered by Prisma repositories and reusable Astro components.
- **Comprehensive error prevention** workflow (TypeScript, ESLint, custom validation, and git hooks).
- **New About & Contact pages** that introduce the team, mission, and 24/7 rider-support channels.

## 🗺️ Key Routes

| Path | Purpose |
| --- | --- |
| `/` | Marketing homepage with featured tours, media, and Instagram gallery |
| `/packages` & `/packages/[slug]` | Tour package index and detail pages with itineraries |
| `/guides` & `/guides/[slug]` | Route library with storytelling content |
| `/about` | Mission, leadership, milestones, and community impact overview |
| `/contact` | Multi-channel support hub with interactive enquiry form |

## ⚙️ Getting Started

```powershell
npm install
npm run dev
```

The dev server boots at `http://localhost:4321` (configurable via `PORT`).

### Environment Variables

Copy `.env.example` to `.env.local` and adjust as needed.

| Variable | Description |
| --- | --- |
| `DATABASE_URL` / `DIRECT_URL` | Prisma connection strings |
| `SMTP_*`, `FROM_EMAIL`, `CONTACT_EMAIL` | Email + support identity |
| `PUBLIC_SITE_URL` | Base URL for canonical + OG tags |
| `PUBLIC_CONTACT_FORM_ENDPOINT` | Optional external endpoint (FormSubmit, Make, etc.) for the Contact page form. Leave empty to fall back to displaying the support email. |

> The Contact page form gracefully falls back to "email us" messaging when `PUBLIC_CONTACT_FORM_ENDPOINT` is unset. Once you supply a valid HTTPS endpoint, submissions will POST JSON payloads with `formName: "cycle-paradise-contact"`.

## 🧪 Useful Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build (static output) |
| `npm run preview` | Preview the built site |
| `npm run type-check` | TypeScript compiler in noEmit mode |
| `npm run lint` | ESLint across Astro + TS files |
| `npm run validate` | Custom safeguard suite (reserved words, syntax, formatting) |
| `npm run check-all` | Sequential type-check → lint → validate → build |

### Pre-commit Safety Net

Git hooks live in `.githooks/`. Run `npm run pre-commit` (or configure `git config core.hooksPath .githooks`) to execute TypeScript checks, validation passes, and reserved word scanning before every commit.

## 📦 Project Structure (abridged)

```text
src/
├── components/        Reusable UI (cards, embeds, media)
├── layouts/           Global HTML shell with SEO + nav
├── lib/               Data, db, and email helpers
├── pages/
│   ├── about.astro    ➜ About us
│   ├── contact.astro  ➜ Contact + enquiry form
│   ├── guides/        ➜ Guide index + CMS-ready detail pages
│   ├── packages/      ➜ Package index + detail pages
│   └── api/           Analytics + Instagram endpoints
└── types/             Shared TypeScript models
```

## 🤝 Support & Contributions

- Need help or want to co-launch a ride? Drop us a note at `info@cycleparadise.lk` or tap the `/contact` page.
- Pull requests are welcome—run `npm run check-all` before opening one to keep CI green.
