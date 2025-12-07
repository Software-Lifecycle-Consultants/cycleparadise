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

| Route       | Description                                             |
| ----------- | ------------------------------------------------------- |
| `/`         | Marketing homepage with featured tours and media        |
| `/packages` | Tour packages listing with search and filters           |
| `/guides`   | Cycling guides listing with regional filters            |
| `/about`    | Mission, leadership, milestones, and community impact   |
| `/contact`  | Multi-channel support hub with interactive enquiry form |
| `/admin`    | Admin Dashboard (Requires authentication)               |

## 🚀 Getting Started

The easiest way to run Cycle Paradise is using Docker Compose, which sets up both the application and the PostgreSQL database automatically.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 20+ (for local development utilities)

### Quick Start (Docker)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cycleparadise
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env`. The default settings work out-of-the-box with Docker Compose.

   ```bash
   cp .env.example .env
   ```

3. **Start the Application**
   Run the following command to build and start the specific services (Database and Web App):

   ```bash
   docker compose up --build
   ```

   The site will be available at [http://localhost:4321](http://localhost:4321).
   The database will be running on port `5432`.

### Local Development (No Docker)

If you prefer running Node.js locally:

```bash
# Install dependencies
npm install

# Start dev server (uses Fallback Data mode if no DB configured)
npm run dev
```

### Available Commands

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start development server        |
| `npm run build`     | Build for production            |
| `npm run preview`   | Preview production build        |
| `npm run db:seed`   | Seed database with initial data |
| `npx prisma studio` | Open database GUI               |

## 🛠️ Tech Stack

- **Framework**: Astro 4.16+ (Hybrid Rendering)
- **Language**: TypeScript (Strict Mode)
- **Styling**: TailwindCSS 3.0+
- **Database**: PostgreSQL 15 + Prisma ORM
- **Authentication**: Session-based (HttpOnly Cookies, bcrypt)
- **Email**: NodeMailer (SMTP)
- **Media**: Sharp (Optimization)
- **Containerization**: Docker & Docker Compose

## 🔑 Admin Panel

Cycle Paradise includes a comprehensive Admin Panel for managing the site's content.

**Access**: [http://localhost:4321/admin/login](http://localhost:4321/admin/login)

### Default Credentials (Dev)

- **Email**: `admin@cycleparadise.lk`
- **Password**: `Admin123!`

_(Make sure to seed the database first using `npm run db:seed` if running manually, or let Docker handle it on first start)._

### Key Capabilities

- **Dashboard**: Real-time sales metrics and booking overview.
- **Tour Packages**: Create and edit tours, including itineraries and pricing.
- **Media Library**: Drag-and-drop upload for managing site assets.
- **Bookings**: Manage customer reservations and statuses.
- **User Management**: Control admin access with Role-Based Access Control (RBAC).

## 💾 Database & Fallback System

Cycle Paradise features a robust **Hybrid Data System** that ensures the marketing site remains accessible even without a database connection.

1. **PostgreSQL Mode (Recommended)**:
   - Activates when `DATABASE_URL` is set.
   - Enables full dynamic functionality (Bookings, Admin Panel, Live Availability).
   - Managed via Prisma ORM.

2. **Fallback Mode**:
   - Activates when `DATABASE_URL` is missing.
   - Serves rich static content from `src/data/`.
   - Ideal for static deployments, demos, or offline development.

### Database Commands

```bash
# Seed database with initial data
npm run db:seed

# Open Prisma Studio (Database GUI)
npx prisma studio

# Push schema changes (during dev)
npx prisma db push
```

## 📦 Project Structure

```text
cycleparadise/
├── docker/                 # Docker configuration files
├── prisma/                 # Database schema and seed scripts
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable Astro components
│   ├── data/               # Fallback static data
│   ├── layouts/            # Page layouts
│   ├── lib/                # Core utilities (Auth, DB, Email)
│   ├── pages/              # File-based routing & API endpoints
│   └── styles/             # Global Tailwind styles
├── docker-compose.yml      # Service orchestration
└── astro.config.mjs        # Astro framework config
```

## 🔧 Configuration

Configure the application via environment variables in `.env`:

```bash
# Database (Auto-configured in Docker)
DATABASE_URL="postgresql://cycleparadise:cycleparadise_dev@localhost:5432/cycleparadise"

# Email Configuration (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
FROM_EMAIL=noreply@cycleparadise.lk

# Site Settings
PUBLIC_SITE_URL=http://localhost:4321
```

## 🚀 Deployment

### Docker (Production)

```bash
docker build -t cycleparadise .
docker run -p 80:4321 -e DATABASE_URL=... cycleparadise
```

## 🤝 Support

- **Admin Guide**: See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for editorial help.
- **Issues**: Please file internal tickets for bugs.

---

<div align="center">
  <sub>Built with ❤️ for Cycling Adventures in Sri Lanka</sub>
</div>
