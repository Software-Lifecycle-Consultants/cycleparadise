-- Add duration in hours and guide details to TourPackage
-- Migration: Add duration hours and tour guide information

-- Add new columns to tour_packages table
ALTER TABLE tour_packages 
  ADD COLUMN "durationHours" INTEGER,
  ADD COLUMN "guideName" TEXT,
  ADD COLUMN "guideBio" TEXT,
  ADD COLUMN "guidePhoto" TEXT,
  ADD COLUMN "guideExperience" TEXT,
  ADD COLUMN "guideLanguages" JSONB,
  ADD COLUMN "guideCertifications" JSONB,
  ADD COLUMN "guideSpecialties" JSONB;

-- Update existing duration in days to hours (assuming 8 hours per day)
UPDATE tour_packages 
SET "durationHours" = duration * 8 
WHERE "durationHours" IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN tour_packages."durationHours" IS 'Tour duration in hours for more accurate scheduling';
COMMENT ON COLUMN tour_packages."guideName" IS 'Name of the tour guide (optional, only shown if provided)';
COMMENT ON COLUMN tour_packages."guideBio" IS 'Biography/description of the tour guide';
COMMENT ON COLUMN tour_packages."guidePhoto" IS 'URL or path to guide photo';
COMMENT ON COLUMN tour_packages."guideExperience" IS 'Years of experience or experience description';
COMMENT ON COLUMN tour_packages."guideLanguages" IS 'JSON array of languages spoken by guide';
COMMENT ON COLUMN tour_packages."guideCertifications" IS 'JSON array of certifications/qualifications';
COMMENT ON COLUMN tour_packages."guideSpecialties" IS 'JSON array of guide specialties or expertise areas';
