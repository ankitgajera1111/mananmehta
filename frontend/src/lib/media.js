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
 * Extract a YouTube video ID from whatever was entered.
 *
 * The admin field asks for a bare ID, but pasting the address bar is the
 * obvious thing to do — and the old code interpolated the value straight into
 * an embed URL, producing `youtube.com/embed/https://youtube.com/watch?v=...`.
 * YouTube does not error on that; it quietly plays something unrelated, which
 * is far harder to notice than a broken player.
 *
 * Handles watch?v=, youtu.be/, /embed/, /shorts/, /live/, extra query params,
 * and a bare ID. Returns '' when nothing usable is found.
 */
export const youtubeId = (value) => {
  if (!value) return '';
  const raw = String(value).trim();

  // Already a bare ID: exactly 11 chars of YouTube's alphabet.
  if (/^[\w-]{11}$/.test(raw)) return raw;

  const patterns = [
    /[?&]v=([\w-]{11})/, // watch?v=ID
    /youtu\.be\/([\w-]{11})/, // youtu.be/ID
    /\/embed\/([\w-]{11})/, // /embed/ID
    /\/shorts\/([\w-]{11})/, // /shorts/ID
    /\/live\/([\w-]{11})/, // /live/ID
  ];
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match) return match[1];
  }

  // Last resort: any 11-character run that looks like an ID.
  const loose = raw.match(/([\w-]{11})/);
  return loose ? loose[1] : '';
};

/** Player URL for a video, or '' if the value yields no usable ID. */
export const youtubeEmbedUrl = (value) => {
  const id = youtubeId(value);
  return id ? `https://www.youtube.com/embed/${id}` : '';
};

/** Default thumbnail for a video, useful when no cover image is set. */
export const youtubeThumbnail = (value) => {
  const id = youtubeId(value);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
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
