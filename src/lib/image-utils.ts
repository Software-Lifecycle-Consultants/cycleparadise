import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Configuration for image handling
 */
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

/**
 * Ensure the upload directory exists
 */
export async function ensureUploadDir(): Promise<void> {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Save a file to disk
 * @param file The File object from FormData
 * @returns The relative path to the saved file (e.g., '/uploads/image.jpg')
 */
export async function saveFile(file: File): Promise<{
  filename: string;
  storageKey: string;
  url: string;
  size: number;
  mimeType: string;
}> {
  await ensureUploadDir();

  const extension = path.extname(file.name);
  const storageKey = `${uuidv4()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, storageKey);
  const url = `/uploads/${storageKey}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fs.writeFile(filePath, buffer);

  return {
    filename: file.name,
    storageKey,
    url,
    size: file.size,
    mimeType: file.type,
  };
}

/**
 * Delete a file from disk
 * @param storageKey The storage key (filename on disk)
 */
export async function deleteFile(storageKey: string): Promise<boolean> {
  try {
    const filePath = path.join(UPLOAD_DIR, storageKey);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${storageKey}:`, error);
    return false;
  }
}
