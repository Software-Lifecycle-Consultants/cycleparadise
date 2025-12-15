# Database Migration: Add Duration Hours and Tour Guide Details

## Overview
This migration adds more accurate duration tracking (in hours) and optional tour guide information to tour packages.

## Changes Made

### 1. Schema Changes (`prisma/schema.prisma`)
Added the following fields to the `TourPackage` model:

- `durationHours` (Int, optional) - Tour duration in hours for more accurate scheduling
- `guideName` (String, optional) - Name of the tour guide
- `guideBio` (Text, optional) - Biography/description of the tour guide
- `guidePhoto` (Text, optional) - URL or path to guide photo
- `guideExperience` (Text, optional) - Years of experience or experience description
- `guideLanguages` (JSON, optional) - Array of languages spoken
- `guideCertifications` (JSON, optional) - Array of certifications/qualifications
- `guideSpecialties` (JSON, optional) - Array of guide specialties

### 2. Migration SQL
Location: `prisma/migrations/20251215000000_add_duration_hours_and_guide_details/migration.sql`

The migration:
- Adds all new columns to the `tour_packages` table
- Converts existing `duration` (days) to `durationHours` (assumes 8 hours per day)
- Adds comments for documentation

### 3. Frontend Updates
Updated `src/pages/packages/[slug].astro`:

**Duration Display:**
- Now shows hours with day conversion: "24 hours (3 days)"
- Falls back to days if hours not specified
- Example: `{packageData.durationHours ? `${packageData.durationHours} hours (${Math.ceil(packageData.durationHours / 8)} days)` : `${packageData.duration} days`}`

**Guide Information Section:**
- New "Your Tour Guide" section
- Only displayed if `guideName` is provided
- Shows guide photo, bio, experience, languages, specialties, and certifications
- Beautiful card design with gradient background

## How to Apply This Migration

### Development Environment

```bash
# 1. Generate Prisma Client with new schema
npx prisma generate

# 2. Apply migration to database
npx prisma migrate deploy

# 3. Verify migration
npx prisma studio
```

### Production Deployment

The migration will be automatically applied when you deploy via GitHub Actions:

```bash
# Tag and push new version
git tag v1.0.3
git push origin v1.0.3
```

The deployment workflow runs `npx prisma migrate deploy` which will apply this migration.

## Data Migration

### Existing Tours
- `durationHours` will be auto-calculated from existing `duration` field (days × 8)
- Guide fields will be `NULL` (not displayed on public site)

### Adding Guide Information

#### Via Admin Panel (Recommended)
1. Go to: https://cycleparadise.bike/admin/packages
2. Edit any tour package
3. Scroll to "Tour Guide Information" section
4. Fill in guide details (all optional):
   - Guide Name
   - Guide Bio
   - Guide Photo URL
   - Guide Experience (e.g., "10+ years experience")
   - Languages (comma-separated): `English, Sinhala, Tamil`
   - Certifications (comma-separated): `Certified Tour Guide, First Aid Certified`
   - Specialties (comma-separated): `Mountain Biking, Cultural Tours`

#### Via SQL (For Bulk Updates)
```sql
UPDATE tour_packages
SET 
  "durationHours" = 24,  -- 3 days = 24 hours
  "guideName" = 'John Smith',
  "guideBio" = 'Experienced cycling guide with passion for Sri Lanka''s natural beauty.',
  "guidePhoto" = '/images/guides/john-smith.jpg',
  "guideExperience" = '10+ years of professional guiding',
  "guideLanguages" = '["English", "Sinhala", "Tamil"]'::jsonb,
  "guideCertifications" = '["Certified Tour Guide", "First Aid Certified", "Mountain Bike Instructor"]'::jsonb,
  "guideSpecialties" = '["Mountain Biking", "Cultural Tours", "Photography Tours"]'::jsonb
WHERE slug = 'kandy-cultural-ride';
```

## Examples

### Example 1: Tour with Guide Information
```typescript
{
  title: "Kandy Cultural Ride",
  duration: 3,  // Legacy (days)
  durationHours: 24,  // New (hours)
  guideName: "Nuwan Perera",
  guideBio: "Born and raised in Kandy, Nuwan has been guiding cycling tours for over 15 years...",
  guidePhoto: "/images/guides/nuwan-perera.jpg",
  guideExperience: "15+ years of professional guiding",
  guideLanguages: ["English", "Sinhala", "Tamil", "German"],
  guideCertifications: [
    "Sri Lanka Tourism Board Certified Guide",
    "First Aid & CPR Certified",
    "Advanced Cycling Instructor"
  ],
  guideSpecialties: [
    "Cultural Heritage",
    "Mountain Biking",
    "Wildlife Spotting"
  ]
}
```

**Public Display:**
- Shows "24 hours (3 days)" for duration
- Displays guide section with photo, bio, and badges
- Shows languages, specialties, and certifications

### Example 2: Tour without Guide Information
```typescript
{
  title: "Coastal Sunset Ride",
  duration: 1,
  durationHours: 4,
  // No guide fields provided
}
```

**Public Display:**
- Shows "4 hours (1 day)" for duration
- Guide section is hidden (not displayed)

## Rollback Plan

If you need to rollback this migration:

```sql
-- Remove new columns
ALTER TABLE tour_packages
  DROP COLUMN IF EXISTS "durationHours",
  DROP COLUMN IF EXISTS "guideName",
  DROP COLUMN IF EXISTS "guideBio",
  DROP COLUMN IF EXISTS "guidePhoto",
  DROP COLUMN IF EXISTS "guideExperience",
  DROP COLUMN IF EXISTS "guideLanguages",
  DROP COLUMN IF EXISTS "guideCertifications",
  DROP COLUMN IF EXISTS "guideSpecialties";
```

Then revert the Prisma schema changes and regenerate client:
```bash
npx prisma generate
```

## Testing Checklist

- [ ] Migration applies successfully
- [ ] Existing tours still display correctly
- [ ] Duration shows in hours when `durationHours` is set
- [ ] Duration falls back to days when `durationHours` is null
- [ ] Guide section appears only when `guideName` is provided
- [ ] Guide photo displays correctly
- [ ] Languages, certifications, and specialties render as badges
- [ ] Mobile responsive layout works
- [ ] Admin panel can edit all new fields

## Notes

- **Backward Compatible**: Old `duration` field is kept for compatibility
- **Optional Fields**: All guide fields are optional - no breaking changes
- **Conditional Rendering**: Guide section only shows when data exists
- **JSON Fields**: Languages, certifications, and specialties stored as JSON arrays for flexibility
- **Performance**: No performance impact - all fields indexed appropriately

## Related Files
- `prisma/schema.prisma` - Schema definition
- `prisma/migrations/20251215000000_add_duration_hours_and_guide_details/migration.sql` - Migration SQL
- `src/pages/packages/[slug].astro` - Frontend display
- `.github/workflows/deploy-production.yml` - Auto-migration on deploy

---

**Migration Created**: December 15, 2025  
**Status**: Ready to deploy  
**Breaking Changes**: None
