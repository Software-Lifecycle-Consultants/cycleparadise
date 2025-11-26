# Cycle Paradise - Admin Guide

> **Note:** This guide covers how to manage content, update tour packages, modify guides, and manage data as an administrator.

## Table of Contents

- [Admin Panel (Recommended)](#admin-panel-recommended)
- [Overview](#overview)
- [Data Management Approaches](#data-management-approaches)
- [Managing Tour Packages](#managing-tour-packages)
- [Managing Cycling Guides](#managing-cycling-guides)
- [Homepage Content Management](#homepage-content-management)
- [Image Management](#image-management)
- [Database Operations](#database-operations)
- [Instagram Feed Management](#instagram-feed-management)
- [Email Configuration](#email-configuration)
- [Troubleshooting](#troubleshooting)

---

## Admin Panel (Recommended)

Cycle Paradise now includes a comprehensive web-based admin panel for managing all content without editing code files. This is the **recommended approach** for content management.

### 🚀 Quick Start

#### 1. Setup Database

The admin panel requires a PostgreSQL database. Use Docker for quick setup:

```powershell
# Start database
docker-compose up -d db

# Set environment variable
$env:DATABASE_URL="postgresql://cycleparadise:cycleparadise_dev@localhost:5432/cycleparadise"

# Initialize database schema
npx prisma db push
```

#### 2. Create Admin User

```powershell
# Run the admin creation script
npx tsx scripts/create-admin.ts
```

Default credentials created:
- **Email**: `admin@cycleparadise.lk`
- **Password**: `Admin123!`

**Important**: Change this password after first login!

#### 3. Access Admin Panel

```powershell
# Start development server
npm run dev

# Visit http://localhost:4321/admin/login
# Login with credentials above
```

### 📊 Admin Panel Features

#### Dashboard (`/admin`)
- **Metrics Overview**: Total bookings, pending bookings, active packages, revenue
- **Recent Bookings**: Latest customer bookings with status
- **Quick Actions**: Shortcuts to create packages, guides, upload media

#### Tour Package Management (`/admin/packages`)
- **List All Packages**: Sortable table with title, region, duration, difficulty, price, status
- **Create Package**: Multi-section form with validation
  - Basic info (title, region, duration, difficulty, price, max participants)
  - Full description (detailed package information)
  - Status & visibility (active/inactive, featured toggle)
  - SEO settings (meta title, meta description)
- **Edit Package**: Update existing packages with pre-filled forms
- **Delete Package**: Remove packages with confirmation modal
- **Auto-slug generation**: SEO-friendly URLs created automatically from titles

#### Cycling Guide Management (`/admin/guides`)
- **List All Guides**: Table view with region, difficulty, distance filters
- **Create Guide**: Form for routes, segments, points of interest
- **Edit Guide**: Update route details, safety information, gear lists
- **Delete Guide**: Remove guides with confirmation

#### Booking Management (`/admin/bookings`)
- **View Bookings**: Filter by status (pending, confirmed, paid, cancelled, completed)
- **Booking Details**: Customer information, tour dates, pricing, special requests
- **Update Status**: Change booking status and add confirmation notes
- **Payment Tracking**: Mark payments as paid/pending/partial/refunded

#### Media Library (`/admin/media`)
- **Upload Images**: Drag-and-drop or browse to upload
- **Image Gallery**: Grid view of all uploaded media
- **Image Details**: View file info, dimensions, URL
- **Delete Images**: Remove unused media files

#### User Management (`/admin/users`)
- **Admin Users List**: All admin accounts with roles and status
- **Create Admin**: Add new admin users
- **Edit Permissions**: Change user roles (Admin, Editor)
- **Deactivate Users**: Disable access without deletion

### 🔒 Security Features

- **Session-based Authentication**: Secure HTTP-only cookies
- **Password Hashing**: bcrypt with 10 salt rounds
- **Route Protection**: Middleware blocks unauthorized access
- **Remember Me**: Optional 14-day session or 24-hour default
- **Automatic Logout**: Session expiration enforced

### ✏️ Content Management Workflow

#### Creating a Tour Package

1. Navigate to `/admin/packages`
2. Click "Create Package"
3. Fill in required fields:
   - Title (e.g., "Hill Country Adventure")
   - Region (dropdown selection)
   - Duration in days
   - Difficulty level
   - Base price in LKR
   - Max participants
4. Add optional fields:
   - Short description (tagline)
   - Full description (detailed information)
   - YouTube video ID
   - Meta title and description for SEO
5. Toggle status:
   - ✓ Active (visible to customers)
   - ✓ Featured (show on homepage)
6. Click "Create Package"

The package is immediately live on the website!

#### Editing a Tour Package

1. Navigate to `/admin/packages`
2. Click "Edit" on the package you want to modify
3. Update any fields
4. Click "Update Package"

Changes are reflected immediately on the public site.

#### Managing Bookings

1. Navigate to `/admin/bookings`
2. Use filters to find bookings:
   - Filter by status (pending, confirmed, etc.)
   - Search by customer name or email
3. Click on a booking to view details
4. Update booking status:
   - Pending → Confirmed (after verification)
   - Confirmed → Paid (after payment received)
   - Any status → Cancelled (if needed)
   - Paid → Completed (after tour completion)
5. Add confirmation notes for customer communication

### 🎨 Customizing the Admin Panel

#### Change Admin User Password

```typescript
// In Prisma Studio (http://localhost:5555)
// 1. Navigate to AdminUser table
// 2. Find your user
// 3. Update the password field with a bcrypt hash

// Or use the auth library:
import { hashPassword } from './src/lib/auth';
const newHash = await hashPassword('NewSecurePassword123!');
// Update in database
```

#### Add New Admin Users

```powershell
# Option 1: Run the creation script
npx tsx scripts/create-admin.ts

# Option 2: Use Prisma Studio
npx prisma studio
# Navigate to AdminUser table
# Click "Add record"
# Fill in: email, firstName, lastName, passwordHash (use bcrypt), role
```

#### Modify Admin Permissions

Edit `prisma/schema.prisma`:

```prisma
enum AdminRole {
  ADMIN       // Full access to everything
  EDITOR      // Can edit content but not manage users
  VIEWER      // Read-only access (add this if needed)
}
```

After changes, run:
```powershell
npx prisma db push
```

### 📱 Mobile-Friendly Design

The admin panel is fully responsive:
- **Mobile**: Hamburger menu, stacked forms
- **Tablet**: Adaptive sidebar, optimized tables
- **Desktop**: Full sidebar navigation, wide forms

### 🔧 Troubleshooting Admin Panel

**Can't access /admin/login**
- Ensure dev server is running: `npm run dev`
- Check database is running: `docker-compose ps`
- Verify DATABASE_URL is set in `.env`

**Login fails with correct credentials**
- Check bcrypt hash in database is correct
- Verify AdminUser record exists: `npx prisma studio`
- Check browser console for errors

**Changes not appearing**
- For database mode: Changes are instant (refresh page)
- For fallback mode: Run `npm run build` to rebuild

**Database connection errors**
- Verify PostgreSQL is running: `docker-compose ps db`
- Check DATABASE_URL format is correct
- Test connection: `npx prisma db pull`

---

## Overview

Cycle Paradise uses a flexible data management system that supports both:
1. **Database-driven** content (PostgreSQL via Prisma)
2. **Fallback data files** (TypeScript files for development/static deployment)

As an admin, you can manage content through either approach depending on your deployment setup.

---

## Data Management Approaches

### Option 1: Fallback Data Files (Recommended for Static Sites)

**Location:** `src/data/`

Files:
- `fallback-tour-packages.ts` - Tour package definitions
- `fallback-cycling-guides.ts` - Cycling guide definitions

**When to Use:**
- Static site deployment (no database)
- Quick content updates without database setup
- Development and testing
- Simple hosting (Netlify, Vercel, GitHub Pages)

**Pros:**
- ✅ No database required
- ✅ Version controlled (Git)
- ✅ Fast build times
- ✅ Easy to update via code editor

**Cons:**
- ❌ Requires rebuild/redeploy for changes
- ❌ No admin UI
- ❌ Limited to developers/technical users

### Option 2: PostgreSQL Database (Recommended for Dynamic Sites)

**When to Use:**
- Dynamic content updates needed
- Admin panel for non-technical users
- Real-time data changes
- User bookings and reviews

**Pros:**
- ✅ Real-time updates (no rebuild)
- ✅ Admin UI capability
- ✅ User-generated content (reviews, bookings)
- ✅ Complex queries and filtering

**Cons:**
- ❌ Requires database hosting
- ❌ Additional infrastructure cost
- ❌ More complex deployment

---

## Managing Tour Packages

### Using Fallback Data Files

**File:** `src/data/fallback-tour-packages.ts`

#### Adding a New Tour Package

1. Open `src/data/fallback-tour-packages.ts`
2. Add a new package object to the `fallbackTourPackages` array:

```typescript
{
  id: 4, // Increment from last package
  slug: 'your-package-slug',
  title: 'Your Package Title',
  description: 'Short description for listings',
  longDescription: 'Detailed description with multiple paragraphs...',
  region: 'HILL_COUNTRY', // or COASTAL, CENTRAL, SOUTHERN, NORTHERN, EASTERN
  difficultyLevel: 'INTERMEDIATE', // or EASY, CHALLENGING
  duration: 7,
  price: 1200,
  maxGroupSize: 12,
  images: [
    { url: '/images/packages/your-package-1.jpg', alt: 'Description', isPrimary: true },
    { url: '/images/packages/your-package-2.jpg', alt: 'Description' }
  ],
  included: [
    'Professional cycling guide',
    'Accommodation (twin sharing)',
    'All meals',
    // ... more items
  ],
  excluded: [
    'International flights',
    'Travel insurance',
    // ... more items
  ],
  itinerary: [
    {
      day: 1,
      title: 'Day 1 Title',
      description: 'Day 1 description...',
      activities: ['Activity 1', 'Activity 2'],
      accommodation: 'Hotel Name',
      meals: 'Breakfast, Lunch, Dinner',
      cyclingDistance: 25
    },
    // ... more days
  ],
  faqs: [
    {
      question: 'Question text?',
      answer: 'Answer text...'
    },
    // ... more FAQs
  ],
  reviews: [
    {
      id: 1,
      authorName: 'Reviewer Name',
      authorCountry: 'Country',
      rating: 5,
      comment: 'Review text...',
      date: '2024-10-15',
      packageId: 4, // Match the package id
      verified: true
    },
    // ... more reviews
  ],
  seo: {
    metaTitle: 'SEO Title',
    metaDescription: 'SEO description for search engines',
    keywords: ['keyword1', 'keyword2'],
    ogImage: '/images/packages/your-package-og.jpg'
  },
  published: true,
  featured: false,
  createdAt: '2024-11-01',
  updatedAt: '2024-11-23'
}
```

3. Save the file
4. Rebuild the site: `npm run build`
5. Test: `npm run preview`

#### Updating an Existing Package

1. Find the package by `slug` or `id` in `fallback-tour-packages.ts`
2. Modify the desired fields (price, description, images, etc.)
3. Update the `updatedAt` date to current date
4. Save and rebuild

#### Removing a Package

1. Locate the package in the array
2. Set `published: false` (soft delete) OR remove the entire object (hard delete)
3. Save and rebuild

### Using Database

**Prerequisites:** Database must be connected (see  .md Database Setup section)

#### Using Prisma Studio (Visual Database Editor)

```bash
npx prisma studio
```

Opens a web interface at `http://localhost:5555`

**To Add/Edit Tour Packages:**
1. Navigate to `TourPackage` table
2. Click "Add record" or select existing record
3. Fill in all required fields
4. Save changes
5. Changes are immediately live (no rebuild needed)

#### Using SQL Commands

```bash
# Connect to your database
psql -h localhost -U youruser -d cycleparadise

# Insert new package (example)
INSERT INTO "TourPackage" (slug, title, description, region, difficulty_level, duration, price, published)
VALUES ('new-package', 'New Package Title', 'Description...', 'HILL_COUNTRY', 'EASY', 5, 950, true);
```

#### Using API Endpoints (If Implemented)

Create API routes in `src/pages/api/admin/` for CRUD operations.

---

## Managing Cycling Guides

### Using Fallback Data Files

**File:** `src/data/fallback-cycling-guides.ts`

#### Adding a New Guide

```typescript
{
  id: 4,
  slug: 'your-guide-slug',
  title: 'Guide to Amazing Location',
  description: 'Short overview...',
  region: 'CENTRAL',
  difficultyLevel: 'EASY',
  estimatedDuration: 4.5, // hours
  distance: 35, // kilometers
  elevationGain: 450, // meters
  images: [
    { url: '/images/guides/your-guide-1.jpg', alt: 'Description', isPrimary: true }
  ],
  introduction: 'Long introduction with cycling details...',
  routeSegments: [
    {
      segmentNumber: 1,
      name: 'Segment Name',
      description: 'Segment description...',
      distance: 12,
      elevationGain: 150,
      estimatedTime: 1.5,
      terrainType: 'PAVED', // or GRAVEL, DIRT, MIXED
      difficulty: 'EASY',
      keyLandmarks: ['Landmark 1', 'Landmark 2']
    },
    // ... more segments
  ],
  gearChecklist: [
    'Helmet (mandatory)',
    'Water bottles (2L minimum)',
    // ... more items
  ],
  hydrationStops: [
    {
      location: 'Stop Location',
      distanceFromStart: 8,
      facilities: ['Water', 'Restrooms', 'Food']
    },
    // ... more stops
  ],
  safetyTips: [
    'Safety tip 1...',
    'Safety tip 2...'
  ],
  bestTimeToVisit: 'December to March for best weather...',
  weatherConsiderations: 'Weather details...',
  localInsights: 'Cultural insights...',
  emergencyContacts: [
    { name: 'Local Police', phone: '+94 11 123 4567' },
    { name: 'Tourist Police', phone: '+94 11 234 5678' }
  ],
  faqs: [
    {
      question: 'Is this suitable for beginners?',
      answer: 'Yes, this route...'
    }
  ],
  relatedPackageIds: [1, 2], // IDs of related tour packages
  seo: {
    metaTitle: 'SEO Title',
    metaDescription: 'SEO description',
    keywords: ['cycling', 'sri lanka'],
    ogImage: '/images/guides/your-guide-og.jpg'
  },
  published: true,
  createdAt: '2024-11-23',
  updatedAt: '2024-11-23'
}
```

Follow the same steps as tour packages: edit → save → rebuild → test.

---

## Homepage Content Management

### Hero Section

**File:** `src/pages/index.astro`

**Location:** Lines ~30-60

```astro
<!-- Update hero heading -->
<h1>Your New Headline</h1>

<!-- Update hero description -->
<p>Your new description...</p>

<!-- Update CTA buttons -->
<a href="/packages">Browse Tours</a>
```

### Featured Statistics

**Location:** Lines ~80-120

```astro
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
  <!-- Update numbers -->
  <div>
    <div class="text-4xl font-bold">15+</div>
    <p>Unique Routes</p>
  </div>
  <!-- More stats... -->
</div>
```

### Featured Packages Section

**Dynamic Content:** Automatically loads from `fallback-tour-packages.ts` or database

To change which packages are featured:

**Fallback Files:**
```typescript
// In fallback-tour-packages.ts
{
  id: 1,
  featured: true, // Set to true to show on homepage
  // ... rest of package
}
```

**Database:**
```sql
UPDATE "TourPackage" SET featured = true WHERE id = 1;
```

### About Section

**File:** `src/pages/index.astro`

Search for the "Why Choose Us" or "About" section and edit text directly.

---

## Image Management

### Adding Images

1. **Place images in:** `public/images/`
   - `public/images/packages/` - Tour package images
   - `public/images/guides/` - Guide images
   - `public/images/hero/` - Homepage hero images

2. **Reference in code:** `/images/packages/image-name.jpg`

3. **Recommended sizes:**
   - Hero images: 1920x1080px
   - Package thumbnails: 800x600px
   - Guide images: 1200x800px
   - OG images: 1200x630px

### Optimizing Images

The site uses Sharp for automatic image optimization during build.

**Before adding images:**
```bash
# Install optimization tools (if not already)
npm install sharp

# Manual optimization (optional)
npx @squoosh/cli --webp auto images/source/*.jpg -d public/images/optimized/
```

### Image Best Practices

- ✅ Use descriptive filenames: `kandy-temple-cycling.jpg` not `img001.jpg`
- ✅ Compress images before upload (target <200KB for web)
- ✅ Use WebP format when possible
- ✅ Always provide alt text for accessibility
- ✅ Use consistent aspect ratios per section

---

## Database Operations

### Quick Database Setup with Docker

The fastest way to get a PostgreSQL database running locally:

```powershell
# Start PostgreSQL 15 container
docker-compose up -d db

# Set environment variable
$env:DATABASE_URL="postgresql://cycleparadise:cycleparadise_dev@localhost:5432/cycleparadise"

# Run migrations
npx prisma migrate dev

# Seed initial data
npm run db:seed

# Open Prisma Studio to view/edit data
npx prisma studio
```

**Docker Compose includes:**
- PostgreSQL 15-alpine (latest stable version)
- Persistent volume for data storage
- Health checks for reliability
- Default credentials: `cycleparadise` / `cycleparadise_dev`
- Port 5432 exposed for database tools

**Access with database clients (pgAdmin, DBeaver, TablePlus):**
- Host: `localhost`
- Port: `5432`
- Username: `cycleparadise`
- Password: `cycleparadise_dev`
- Database: `cycleparadise`

**Useful Docker commands:**
```powershell
# View database logs
docker-compose logs -f db

# Stop database
docker-compose stop db

# Restart database
docker-compose restart db

# Stop and remove (⚠️ deletes data)
docker-compose down -v
```

### Backup Database

```bash
# PostgreSQL backup
pg_dump -h localhost -U youruser -d cycleparadise > backup-2024-11-23.sql

# Restore from backup
psql -h localhost -U youruser -d cycleparadise < backup-2024-11-23.sql
```

### Schema Migrations

When updating the database schema:

1. **Modify:** `prisma/schema.prisma`

2. **Create migration:**
```bash
npx prisma migrate dev --name your_migration_name
```

3. **Apply to production:**
```bash
npx prisma migrate deploy
```

4. **Regenerate client:**
```bash
npx prisma generate
```

### Syncing Fallback Data to Database

If you've updated fallback files and want to import to database:

**Create a seed script:** `prisma/seed-from-fallback.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { fallbackTourPackages } from '../src/data/fallback-tour-packages';

const prisma = new PrismaClient();

async function main() {
  for (const pkg of fallbackTourPackages) {
    await prisma.tourPackage.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Run:**
```bash
npx tsx prisma/seed-from-fallback.ts
```

---

## Instagram Feed Management

### Setting Up Instagram Integration

**Prerequisites:**
1. Facebook Developer Account
2. Instagram Business/Creator Account
3. Access Token

**Configuration File:** `src/pages/instagram-admin.astro`

**Access Admin Panel:**
- Development: `http://localhost:4321/instagram-admin`
- Production: Only accessible if `SHOW_INSTAGRAM_ADMIN=true` in `.env`

### Admin Panel Features

1. **Validate Token** - Check if your Instagram access token is valid
2. **Refresh Token** - Get a new long-lived token (60 days)
3. **Clear Cache** - Force refresh of Instagram feed

### Managing Instagram Posts

**Automatic:** Posts are fetched from your Instagram Business account automatically

**Manual Fallback:** If Instagram API fails, edit fallback data:

**File:** `src/lib/instagram/fallback-posts.ts`

```typescript
export const fallbackInstagramPosts = [
  {
    id: 'unique-id',
    caption: 'Post caption...',
    media_url: '/images/instagram/post1.jpg',
    media_type: 'IMAGE',
    permalink: 'https://instagram.com/p/...',
    timestamp: '2024-11-23T10:00:00Z'
  },
  // ... more posts
];
```

---

## Email Configuration

Email is configured via environment variables. See [README.md Email Setup](#) section for detailed SMTP configuration.

**Quick Reference:**

```env
# .env file
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@cycleparadise.lk
```

### Testing Email

Create a test contact form submission at `/contact` and verify emails are sent.

**Check logs:**
```bash
# Development
npm run dev
# Watch console for "Email sent successfully" messages
```

---

## Troubleshooting

### Build Errors

**Error:** `Cannot find module 'fallback-tour-packages'`
- **Solution:** Ensure file exists at `src/data/fallback-tour-packages.ts`

**Error:** `Prisma Client initialization failed`
- **Solution:** Run `npx prisma generate` and ensure `DATABASE_URL` is set (or use fallback mode)

**Error:** `Image optimization failed`
- **Solution:** Check image file paths and ensure Sharp is installed

### Content Not Updating

**Static Site (Fallback Files):**
1. Clear build cache: `rm -rf dist .astro`
2. Rebuild: `npm run build`
3. Restart preview: `npm run preview`

**Database:**
1. Check database connection: `npx prisma studio`
2. Verify data exists in tables
3. Check `published` field is `true`
4. Clear application cache if applicable

### Images Not Loading

1. **Check file path:** Ensure path starts with `/images/` not `./images/`
2. **Verify file exists:** Check `public/images/` directory
3. **Case sensitivity:** Use exact filename (case-sensitive on Linux servers)
4. **File permissions:** Ensure images are readable (644 permissions)

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Check environment variables
echo $DATABASE_URL

# Verify PostgreSQL is running
psql -h localhost -U youruser -l
```

---

## Best Practices

### Content Updates

1. ✅ **Always test locally** before deploying
2. ✅ **Keep backups** of database and data files
3. ✅ **Use version control** (Git) for all file changes
4. ✅ **Update `updatedAt` dates** when modifying content
5. ✅ **Validate SEO fields** (meta titles, descriptions)
6. ✅ **Check responsive design** on mobile devices
7. ✅ **Test contact forms** after email config changes

### Performance

1. ✅ Optimize images before upload
2. ✅ Limit featured packages to 3-6 items
3. ✅ Keep itineraries concise (7-14 days max)
4. ✅ Cache Instagram feed (use admin panel)
5. ✅ Minimize database queries in loops

### Security

1. ✅ Never commit `.env` files to Git
2. ✅ Use strong database passwords
3. ✅ Restrict admin panel access (IP whitelist if possible)
4. ✅ Keep dependencies updated: `npm audit fix`
5. ✅ Use HTTPS in production
6. ✅ Validate all user inputs (contact forms, etc.)

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview                # Preview production build

# Database
npx prisma studio             # Visual database editor
npx prisma migrate dev        # Create/apply migrations
npx prisma generate           # Regenerate Prisma client
npx prisma db push            # Push schema changes (dev only)

# Docker
docker build -t cycleparadise .                    # Build image
docker run -p 4321:4321 cycleparadise             # Run container
docker-compose up -d                               # Start all services
docker-compose up -d db                            # Start database only
docker-compose down                                # Stop services
docker-compose logs -f db                          # View database logs
docker-compose restart db                          # Restart database

# Validation
npm run validate              # Check for code issues
npx tsc --noEmit             # TypeScript type checking
```

---

## Support

For additional help:
- 📧 Email: support@cycleparadise.lk
- 📞 Phone: +94 12 345 6789
- 📚 Documentation: [README.md](./README.md)
- 🐛 Issues: Report on GitHub

---

**Last Updated:** November 25, 2025
