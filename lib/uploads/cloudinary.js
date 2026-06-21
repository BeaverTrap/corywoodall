import { v2 as cloudinary } from 'cloudinary';
import { UPLOAD_PRESETS, resolveUploadPreset } from '@/lib/uploads/presets';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const MAX_BYTES = 10 * 1024 * 1024;

function ensureConfig() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function validateImageFile(file) {
  if (!file || typeof file === 'string') {
    return 'No file provided.';
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return 'Upload a JPEG, PNG, WebP, GIF, or AVIF image.';
  }

  if (file.size > MAX_BYTES) {
    return 'Images must be 10 MB or smaller.';
  }

  return null;
}

export async function uploadImageFile(file, folder = 'uploads', presetKey) {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  ensureConfig();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '') || 'uploads';
  const preset = resolveUploadPreset(safeFolder, presetKey);
  const transformation = UPLOAD_PRESETS[preset];

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `corywoodall/${safeFolder}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        const url = cloudinary.url(result.public_id, {
          secure: true,
          transformation: [transformation],
        });

        resolve(url);
      }
    );

    stream.end(buffer);
  });
}
