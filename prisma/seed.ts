import { PrismaClient } from '@prisma/client';
import { fallbackCyclingGuides } from '../src/data/fallback-cycling-guides.js';
import { fallbackTourPackages } from '../src/data/fallback-tour-packages.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Cycling Guides
  console.log('\n📚 Seeding Cycling Guides...');

  for (const guide of fallbackCyclingGuides) {
    // Map fallback data to schema fields
    const guideData = {
      title: guide.title,
      slug: guide.slug,
      region: guide.region,
      content: guide.content,
      description: guide.description || null,
      shortDescription: guide.shortDescription || null,
      difficultyRating: guide.difficultyRating,
      estimatedDuration: guide.estimatedDuration || null,
      estimatedDistance: guide.estimatedDistance || null,
      startingPoint: guide.startingPoint || null,
      endingPoint: guide.endingPoint || null,
      terrainType: guide.terrainType || null,
      bestSeason: guide.bestTimeToVisit || guide.bestSeason || null,
      highlights: guide.highlights || [],
      safetyTips: guide.safetyTips || [],
      gearChecklist: guide.gearChecklist || [],
      nearbyAttractions: guide.nearbyAttractions || [],
      routeSegments: guide.routeSegments || [],
      hydrationStops: guide.hydrationStops || [],
      faqs: guide.faqs || [],
      mapImageUrl: guide.mapImageUrl || null,
      gpxFileUrl: guide.gpxFileUrl || null,
      routeMap: guide.routeMap || null,
      pointsOfInterest: guide.pointsOfInterest || null,
      images: guide.images || [],
      isPublished: guide.isPublished ?? true,
      featured: guide.featured ?? false,
      metaTitle: guide.metaTitle || null,
      metaDescription: guide.metaDescription || null,
    };

    await prisma.cyclingGuide.upsert({
      where: { slug: guide.slug },
      update: guideData,
      create: guideData,
    });

    console.log(`  ✅ Processed Guide: "${guide.title}"`);
  }

  // Seed Tour Packages
  console.log('\n📦 Seeding Tour Packages...');

  for (const pkg of fallbackTourPackages) {
    // Map difficulty level to Enum
    let difficultyLevel = 'INTERMEDIATE'; // Default
    const level = pkg.difficultyLevel as unknown as string;

    if (level === 'EASY') difficultyLevel = 'BEGINNER';
    else if (level === 'INTERMEDIATE') difficultyLevel = 'INTERMEDIATE';
    else if (level === 'CHALLENGING') difficultyLevel = 'ADVANCED';
    else if (level === 'EXPERT') difficultyLevel = 'EXPERT';

    const pkgData = {
      title: pkg.title,
      slug: pkg.slug,
      description: pkg.description || null,
      shortDescription: pkg.shortDescription || null,
      itinerary: pkg.itinerary || [],
      duration: pkg.duration,
      difficultyLevel: difficultyLevel as any, // Cast to any to avoid TS issues with string vs Enum
      region: pkg.region,
      basePrice: pkg.basePrice,
      maxParticipants: pkg.maxParticipants,
      includedServices: pkg.includedServices || [],
      excludedServices: pkg.excludedServices || [],
      highlights: pkg.highlights || [],
      whatToBring: pkg.whatToBring || [],
      faqs: pkg.faqs || [],
      reviews: pkg.reviews || [],
      supportContacts: pkg.supportContacts || [],
      sustainability: pkg.sustainability || {},
      mediaGallery: pkg.mediaGallery || {},
      youtubeVideoId: pkg.videoUrl ? pkg.videoUrl.split('/').pop() : null, // Simple extraction, might need better logic if full URL
      isActive: pkg.isActive ?? true,
      featured: pkg.featured ?? false,
      metaTitle: pkg.metaTitle || null,
      metaDescription: pkg.metaDescription || null,
    };

    await prisma.tourPackage.upsert({
      where: { slug: pkg.slug },
      update: pkgData,
      create: pkgData,
    });

    console.log(`  ✅ Processed Package: "${pkg.title}"`);
  }

  console.log(`\n✨ Seed completed successfully!`);
  console.log(`   Processed ${fallbackCyclingGuides.length} guides`);
  console.log(`   Processed ${fallbackTourPackages.length} packages`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
