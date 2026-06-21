/** Cloudinary delivery transforms — originals are kept; URLs are optimized for the web. */

export const UPLOAD_PRESETS = {
  /** Full-width homepage hero background */
  hero: {
    width: 2400,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  /** Gallery series cover (shown in a square frame with object-contain) */
  cover: {
    width: 1200,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  /** Gallery lightbox / full images */
  gallery: {
    width: 2000,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  /** Article inline images */
  article: {
    width: 1600,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
};

const FOLDER_PRESET = {
  site: 'hero',
  galleries: 'gallery',
  articles: 'article',
};

export function resolveUploadPreset(folder, explicitPreset) {
  if (explicitPreset && UPLOAD_PRESETS[explicitPreset]) {
    return explicitPreset;
  }

  return FOLDER_PRESET[folder] || 'gallery';
}

export function presetHint(preset) {
  switch (preset) {
    case 'hero':
      return 'Auto-resized to max 2400px wide for the homepage background.';
    case 'cover':
      return 'Auto-resized to max 1200px wide for gallery covers.';
    case 'gallery':
      return 'Auto-resized to max 2000px wide for gallery viewing.';
    case 'article':
      return 'Auto-resized to max 1600px wide for articles.';
    default:
      return 'Images are automatically optimized for web.';
  }
}
