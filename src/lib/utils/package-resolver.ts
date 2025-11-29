import { db } from '../db/client';

/**
 * Convert a package slug to its UUID for database operations
 *
 * The frontend uses slugs for user-friendly URLs and selection,
 * but the database uses UUIDs as foreign keys.
 *
 * @param slug - Package slug (e.g., 'hill-country-explorer')
 * @returns Promise<string | null> - Package UUID or null if not found
 */
export async function getPackageIdBySlug(slug: string): Promise<string | null> {
  if (!slug) {
    return null;
  }

  try {
    const tourPackage = await db.prisma.tourPackage.findUnique({
      where: { slug },
      select: { id: true }
    });

    return tourPackage?.id || null;
  } catch (error) {
    console.error('Error finding package by slug:', error);
    return null;
  }
}

/**
 * Get package details by slug including title for emails
 *
 * @param slug - Package slug
 * @returns Promise<{id: string, title: string} | null>
 */
export async function getPackageBySlug(slug: string): Promise<{id: string, title: string} | null> {
  if (!slug) {
    return null;
  }

  try {
    const tourPackage = await db.prisma.tourPackage.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true
      }
    });

    return tourPackage || null;
  } catch (error) {
    console.error('Error finding package by slug:', error);
    return null;
  }
}
