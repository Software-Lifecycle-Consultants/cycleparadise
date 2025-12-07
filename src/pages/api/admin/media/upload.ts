import type { APIRoute } from 'astro';
import { getUserFromSession, isAuthenticated } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db/connection';
import { saveFile } from '../../../../lib/image-utils';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  const sessionCookie = cookies.get('admin_session')?.value;
  if (!isAuthenticated(sessionCookie)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = getUserFromSession(sessionCookie);

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const uploadedAssets = [];

    // Process each file
    for (const file of files) {
      if (!(file instanceof File)) continue;

      try {
        // Save file to disk
        const { filename, storageKey, size, mimeType } = await saveFile(file);

        // Save record to DB
        const asset = await prisma.mediaAsset.create({
          data: {
            filename,
            storageKey,
            mimeType,
            fileSize: size,
            uploadedBy: user?.userId, // Optional linkage
            isPublic: true,
          },
        });

        uploadedAssets.push({
          ...asset,
          url: `/uploads/${asset.storageKey}`,
        });
      } catch (uploadError) {
        console.error(`Failed to handle file ${file.name}:`, uploadError);
        // Continue with other files basically
      }
    }

    return new Response(
      JSON.stringify({
        message: `Successfully uploaded ${uploadedAssets.length} files`,
        data: uploadedAssets,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Upload handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
