<div align="center">

# Cycle Paradise - Sri Lanka Cycling Tours

Premium cycling tours and travel inspiration across Sri Lanka, built with [Astro](https://astro.build), Tailwind CSS, PostgreSQL, and Prisma ORM.

📖 **[Admin Guide](./ADMIN_GUIDE.md)** - Content management, data updates, and administration

</div>

## ✨ Features

- **SEO-Optimized**: Static site generation with rich meta tags, OpenGraph, and structured data
- **Performance-First**: Fast page loads with Astro's partial hydration and static generation
- **Offline-Ready**: Service worker caching with fallback content
- **Database or Fallback**: Works with PostgreSQL via Prisma OR fallback TypeScript data files
- **Docker Support**: Multi-stage Dockerfile with optional PostgreSQL via Docker Compose
- **Booking System**: Calendar-based booking with accommodation management
- **Admin Panel**: Secure session-based authentication for content management
- **Rich Content**: Tour packages, cycling guides, image galleries, YouTube embeds, Instagram feeds

## 🗺️ Key Routes

| Route | Description |
| --- | --- |
| `/` | Marketing homepage with featured tours, media, and Instagram gallery |
| `/packages` | Tour packages listing with search and filters |
| `/packages/[slug]` | Individual package detail with itineraries, pricing, booking |
| `/guides` | Cycling guides listing with regional filters |
| `/guides/[slug]` | Guide detail with maps, GPX downloads, route segments |
| `/about` | Mission, leadership, milestones, and community impact |
| `/contact` | Multi-channel support hub with interactive enquiry form |
| `/search` | Site-wide search across packages and guides |
| `/offline` | Offline fallback page (service worker) |

## 🛠️ Tech Stack

- **Framework**: Astro 4.16+ (static site generation)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 3.0+
- **Database**: PostgreSQL + Prisma ORM (optional - has fallback data)
- **Authentication**: Session-based (bcrypt)
- **Email**: NodeMailer with SMTP
- **Media**: Sharp for image optimization
- **Deployment**: Docker, Vercel, Netlify compatible

## ⚙️ Quick Start

### Prerequisites
- Node.js 20+
- npm or pnpm
- PostgreSQL (optional - site works with fallback data)

### Development Setup

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:4321
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database (optional - uses fallback data if not set)
DATABASE_URL="postgresql://user:password@localhost:5432/cycleparadise"

# Email (NodeMailer SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=info@cycleparadise.lk

# Instagram Integration (optional)
INSTAGRAM_ACCESS_TOKEN=your_token_here

# Contact Form (optional - falls back to email link)
PUBLIC_CONTACT_FORM_ENDPOINT=https://formsubmit.co/your-email@example.com

# Site URL
PUBLIC_SITE_URL=https://cycleparadise.lk
```

## 📧 Email Setup

Cycle Paradise uses **NodeMailer** with SMTP for sending contact form notifications and booking confirmations.

### Supported Email Providers

#### Gmail (Recommended for Testing)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@cycleparadise.lk
```

**Setup Steps:**
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and your device/app name
4. Copy the 16-character app password to `SMTP_PASSWORD`

#### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@cycleparadise.lk
```

#### SendGrid (Recommended for Production)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
FROM_EMAIL=noreply@cycleparadise.lk
```

**Setup Steps:**
1. Create account at https://sendgrid.com (free tier: 100 emails/day)
2. Create API key in Settings → API Keys
3. Use `apikey` as username (literal string)
4. Use your API key as password

#### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
FROM_EMAIL=noreply@cycleparadise.lk
```

#### AWS SES (Amazon Simple Email Service)

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
FROM_EMAIL=verified-sender@yourdomain.com
```

**Note:** Must verify sender email/domain in AWS SES console first.

#### Custom SMTP Server

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587                    # or 465 for SSL
SMTP_USER=your-username
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@yourdomain.com
```

### Testing Email Configuration

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Submit contact form:**
   - Visit http://localhost:4321/contact
   - Fill out the form
   - Submit and check console for "Email sent successfully"

3. **Check logs:**
   - Console will show: `Email sent successfully: <message-id>`
   - Or error: `Failed to send email: <error-details>`

### Email Templates

Email templates are defined in `src/lib/email/service.ts`.

**Available templates:**
- Contact form notification
- Booking confirmation
- Booking status update
- Admin notifications

**Customizing templates:**
Edit the template functions in `src/lib/email/service.ts` to change HTML/text content.

### Production Recommendations

- ✅ **Use dedicated email service** (SendGrid, Mailgun, AWS SES)
- ✅ **Verify domain SPF/DKIM records** to prevent spam filtering
- ✅ **Set up DMARC policy** for domain authentication
- ✅ **Monitor sending limits** (free tiers have daily caps)
- ✅ **Use transactional email addresses** (e.g., noreply@, bookings@)
- ❌ **Avoid using personal Gmail** in production

### Troubleshooting Email

**Error: "Invalid login"**
- Check username/password are correct
- For Gmail: Use App Password, not regular password
- For SendGrid: Username must be exactly `apikey`

**Error: "Connection timeout"**
- Check `SMTP_HOST` and `SMTP_PORT` are correct
- Verify firewall allows outbound SMTP connections
- Try port 465 (SSL) instead of 587 (TLS)

**Emails going to spam:**
- Verify sender domain SPF/DKIM records
- Use professional "from" address matching your domain
- Avoid spam trigger words in subject/body
- Use dedicated IP (available with paid email services)

**No emails sent, no errors:**
- Check email service dashboard for bounces/rejections
- Verify `FROM_EMAIL` is allowed by your SMTP provider
- Check console logs for hidden errors

## 🗄️ Database Setup (Optional)

The site works with **fallback data** from `src/data/` when no database is configured. To enable full functionality:

### Option 1: Local PostgreSQL

```powershell
# Install PostgreSQL from https://www.postgresql.org/download/windows/

# Create database
psql -U postgres
CREATE DATABASE cycleparadise;
CREATE USER cycleparadise_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cycleparadise TO cycleparadise_user;
\q

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://cycleparadise_user:your_secure_password@localhost:5432/cycleparadise"

# Run migrations and seed
npx prisma db push
npm run db:seed

# View database (optional)
npx prisma studio
```

### Option 2: Docker PostgreSQL (Recommended for Dev)

```powershell
# Start database with Docker Compose
docker-compose up -d db

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://cycleparadise_user:secure_password_change_me@localhost:5432/cycleparadise"

# Run migrations and seed
npx prisma db push
npm run db:seed
```

### Option 3: Cloud Database (Production)

**Free-tier options:**
- **Supabase**: https://supabase.com (500MB free)
- **Neon**: https://neon.tech (3GB free)
- **Railway**: https://railway.app (free tier with credit)

1. Create database on your chosen platform
2. Copy the connection string to `DATABASE_URL` in `.env`
3. Run migrations: `npx prisma db push`
4. Seed data: `npm run db:seed`

### Database vs Fallback Data

| Feature | Without Database | With Database |
|---------|-----------------|---------------|
| Tour Packages | ✅ 3 sample packages | ✅ Dynamic packages from PostgreSQL |
| Cycling Guides | ✅ 3 sample guides | ✅ Dynamic guides from PostgreSQL |
| Bookings | ❌ Form only (no storage) | ✅ Stored with status tracking |
| Admin Panel | ❌ No database operations | ✅ Full CRUD operations |
| Real-time Availability | ❌ Not available | ✅ Checks actual booking dates |
| Email Confirmations | ⚠️ Manual only | ✅ Automated on booking |

**When to use fallback data:**
- Quick development/testing
- Static demo sites
- No booking functionality needed

**When to use database:**
- Production booking system
- Admin content management
- Real customer data tracking

## 💾 Fallback Data System

The marketing site boots even when Prisma can't reach a database. Enriched datasets in `src/data/`:

| File | Purpose |
| --- | --- |
| `src/data/fallback-tour-packages.ts` | 3 complete tour packages with itineraries, FAQs, reviews, sustainability |
| `src/data/fallback-cycling-guides.ts` | 3 cycling guides with route segments, gear lists, hydration stops |

During `npm run dev` or `npm run build`, pages check `process.env.DATABASE_URL`:
- **Not set**: Uses fallback TypeScript data (static content)
- **Set**: Uses PostgreSQL via Prisma (dynamic content)

The transition is seamless - no code changes needed. Just set `DATABASE_URL` to switch from fallback to database mode.

> **Build Optimization**: Static path generation (`getStaticPaths`) checks for database availability and falls back automatically, ensuring builds succeed without `DATABASE_URL`.

## 🧪 Available Scripts

```powershell
# Development
npm run dev              # Start dev server (http://localhost:4321)
npm run build            # Production build (outputs to ./dist)
npm run preview          # Preview production build locally

# Database
npm run db:seed          # Populate database with initial data
npx prisma studio        # Open database GUI (http://localhost:5555)
npx prisma db push       # Sync schema to database
npx prisma generate      # Generate Prisma Client types

# Code Quality
npm run validate         # Custom validation checks
npm run type-check       # TypeScript type checking
npm run lint             # ESLint
npm run check-all        # Run all checks + build
```

## 🐳 Docker

### Quick Start (Static Site Only)

```powershell
# Build image
docker build -t cycleparadise .

# Run container
docker run --rm -p 4321:4321 cycleparadise

# Visit http://localhost:4321
```

The container includes:
- ✅ Node.js 20 Alpine
- ✅ All npm dependencies (Astro, Tailwind, Prisma, etc.)
- ✅ Pre-built static site
- ✅ `serve` static file server
- ✅ Fallback data (works without database)

**Pass environment variables:**
```powershell
docker run --rm -p 4321:4321 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  cycleparadise
```

### Docker Compose (Site + PostgreSQL)

For full database functionality:

```powershell
# Start both database and web server
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f web
```

**What Docker Compose includes:**
- PostgreSQL 15 with persistent volume
- Automatic database migrations on startup
- Database health checks
- Web server on port 4321
- Environment variables from `.env` file

**File structure:**
```yaml
# docker-compose.yml
services:
  db:        # PostgreSQL database
  web:       # Astro site with auto-migrations
```

To customize database credentials, edit `docker-compose.yml` or create a `.env` file.

## 📦 Project Structure

```text
cycleparadise/
├── prisma/
│   ├── schema.prisma          # Database schema (PostgreSQL)
│   └── seed.ts               # Database seeding script (optional)
├── public/                   # Static assets (images, fonts)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Header, Footer, Navigation
│   │   ├── media/          # YouTubeEmbed, InstagramFeed, PackageGallery
│   │   └── ui/             # PackageCard, OptimizedImage
│   ├── data/               # Fallback content (no database required)
│   │   ├── fallback-tour-packages.ts
│   │   └── fallback-cycling-guides.ts
│   ├── layouts/            # Page layouts
│   │   └── Layout.astro    # Main layout with SEO, navigation
│   ├── lib/
│   │   ├── db/            # Database layer (Prisma)
│   │   │   ├── client.ts  # Database client singleton
│   │   │   ├── connection.ts  # Connection management
│   │   │   └── repositories/  # Data access layer (packages, guides)
│   │   ├── auth.ts        # Session-based authentication
│   │   ├── email.ts       # Email notifications (NodeMailer)
│   │   └── media.ts       # Image optimization (Sharp)
│   ├── pages/             # Routes (file-based routing)
│   │   ├── index.astro    # Homepage
│   │   ├── packages.astro # Tour packages listing
│   │   ├── packages/[slug].astro  # Package detail pages
│   │   ├── guides.astro   # Cycling guides listing
│   │   ├── guides/[slug].astro    # Guide detail pages
│   │   ├── about.astro    # About page
│   │   ├── contact.astro  # Contact page with form
│   │   ├── search.astro   # Site-wide search
│   │   ├── offline.astro  # Offline fallback page
│   │   └── api/           # API endpoints
│   ├── styles/            # Global styles (Tailwind)
│   └── types/             # TypeScript type definitions
├── .env.example           # Environment variables template
├── .dockerignore          # Docker build exclusions
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Docker Compose with PostgreSQL
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🗄️ Database Schema

8 core entities managed by Prisma ORM:

- **TourPackage**: Cycling tour packages (price, duration, difficulty, region)
- **Accommodation**: Hotels, guesthouses linked to packages
- **Booking**: Customer bookings with status (PENDING → CONFIRMED → COMPLETED)
- **CyclingGuide**: Regional guides (routes, maps, GPX files)
- **AdminUser**: Admin authentication and sessions
- **MediaAsset**: Images and videos with optimization metadata
- **InstagramPost**: Cached social media content
- **BookingAccommodation**: Junction table for bookings + accommodations

View full schema: `prisma/schema.prisma`

## 🚀 Deployment

### Vercel (Recommended)

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# DATABASE_URL, SMTP_*, CONTACT_EMAIL, etc.
```

### Netlify

```powershell
# Install Netlify CLI  
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker Deployment

```powershell
# Build for production
docker build -t cycleparadise .

# Push to registry
docker tag cycleparadise your-registry/cycleparadise
docker push your-registry/cycleparadise

# Deploy to your hosting platform
# (AWS ECS, Google Cloud Run, Azure Container Apps, etc.)
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Secure HTTP-only cookies
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Protection**: Astro auto-escapes output
- **CSRF Protection**: Session validation on admin routes
- **Environment Variables**: Sensitive data never committed

## 🧪 Code Quality

Pre-commit hooks in `.githooks/`:

```powershell
# Configure git to use hooks
git config core.hooksPath .githooks

# Or run manually before commits
npm run pre-commit
```

Validation checks:
- TypeScript type checking
- Reserved word scanning
- Syntax validation
- Code formatting consistency

## � Documentation

- **[Admin Guide](./ADMIN_GUIDE.md)** - Complete guide for managing content, updating tour packages, editing guides, and database operations
- **[README](./README.md)** - This file - setup, deployment, and configuration
- **[Error Prevention](./ERROR_PREVENTION.md)** - Code quality guidelines and validation rules
- **API Documentation** - Coming soon

## �📄 License

Proprietary - Software Lifecycle Consultants

## 🤝 Support & Contributing

- **Email**: info@cycleparadise.lk
- **Contact Form**: https://cycleparadise.lk/contact
- **Pull Requests**: Run `npm run check-all` before submitting

---

Built with ❤️ for cycling adventures across Sri Lanka
