import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Image optimization service using Sharp
 */
export class ImageOptimizer {
  private readonly outputDir: string;
  private readonly quality: number;
  private readonly maxWidth: number;

  constructor() {
    this.outputDir = join(process.cwd(), 'public', 'images');
    this.quality = parseInt(process.env.IMAGE_QUALITY || '80');
    this.maxWidth = parseInt(process.env.MAX_IMAGE_SIZE || '2048');
  }

  /**
   * Optimize and resize image for web display
   */
  async optimizeImage(
    inputBuffer: Buffer,
    filename: string,
    options: {
      width?: number;
      height?: number;
      format?: 'jpeg' | 'webp' | 'png';
      quality?: number;
    } = {}
  ): Promise<{ path: string; metadata: any }> {
    const {
      width = this.maxWidth,
      format = 'webp',
      quality = this.quality
    } = options;

    // Ensure output directory exists
    await mkdir(this.outputDir, { recursive: true });

    // Process image with Sharp
    const sharpInstance = sharp(inputBuffer)
      .resize(width, options.height, {
        fit: 'inside',
        withoutEnlargement: true
      });

    // Apply format-specific options
    let processedBuffer: Buffer;
    const extension = format;

    switch (format) {
      case 'jpeg':
        processedBuffer = await sharpInstance
          .jpeg({ quality, progressive: true })
          .toBuffer();
        break;
      case 'webp':
        processedBuffer = await sharpInstance
          .webp({ quality })
          .toBuffer();
        break;
      case 'png':
        processedBuffer = await sharpInstance
          .png({ quality })
          .toBuffer();
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Generate output filename
    const outputFilename = `${filename.split('.')[0]}.${extension}`;
    const outputPath = join(this.outputDir, outputFilename);

    // Save optimized image
    await writeFile(outputPath, processedBuffer);

    // Get metadata
    const metadata = await sharp(processedBuffer).metadata();

    return {
      path: `/images/${outputFilename}`,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: processedBuffer.length
      }
    };
  }

  /**
   * Generate multiple responsive image sizes
   */
  async generateResponsiveImages(
    inputBuffer: Buffer,
    baseFilename: string,
    sizes: number[] = [480, 768, 1024, 1440]
  ): Promise<Array<{ size: number; path: string; metadata: any }>> {
    const results = [];

    for (const size of sizes) {
      const filename = `${baseFilename}-${size}w`;
      const result = await this.optimizeImage(inputBuffer, filename, {
        width: size,
        format: 'webp'
      });

      results.push({
        size,
        ...result
      });
    }

    return results;
  }

  /**
   * Create thumbnail from image
   */
  async createThumbnail(
    inputBuffer: Buffer,
    filename: string,
    size: number = 300
  ): Promise<{ path: string; metadata: any }> {
    return this.optimizeImage(inputBuffer, `thumb-${filename}`, {
      width: size,
      height: size,
      format: 'webp'
    });
  }
}

/**
 * Global image optimizer instance
 */
export const imageOptimizer = new ImageOptimizer();