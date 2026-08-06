/**
 * Resolve an image field to a URL.
 *
 * Images are stored as `{ url, publicId }` so uploads and pasted URLs can share
 * one field. This accepts the bare string form too, so any document written
 * before that change - or by hand - still renders.
 */
export const imageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
};

/**
 * Ask Cloudinary for a resized, auto-formatted version.
 *
 * Only applies to assets we uploaded (they carry a publicId and a /upload/ path
 * we can splice transformations into). Third-party URLs are returned untouched.
 */
export const optimizedImageUrl = (image, width = 1200) => {
  const url = imageUrl(image);
  const publicId = typeof image === 'object' && image ? image.publicId : null;
  if (!publicId || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
};
