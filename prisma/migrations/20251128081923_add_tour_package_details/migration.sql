-- AlterTable
ALTER TABLE "tour_packages" ADD COLUMN     "faqs" JSONB,
ADD COLUMN     "highlights" JSONB,
ADD COLUMN     "reviews" JSONB,
ADD COLUMN     "supportContacts" JSONB,
ADD COLUMN     "sustainability" JSONB,
ADD COLUMN     "whatToBring" JSONB;
