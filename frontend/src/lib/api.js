import axios from 'axios';

/**
 * All requests are same-origin and relative.
 *
 * In production Vercel serves the built site and the Python function from one
 * domain, so `/api/...` just works. In development CRA proxies `/api` to
 * http://localhost:8001 (see the "proxy" field in package.json), which keeps
 * dev and production on identical code paths - no REACT_APP_BACKEND_URL, and
 * no CORS or cookie-domain differences to trip over.
 */
const api = axios.create({
  baseURL: '/api',
  // Required for the httpOnly admin session cookie to be sent back.
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/** Turn an axios error into something worth showing a person. */
export const errorMessage = (error, fallback = 'Something went wrong.') => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  // FastAPI validation errors arrive as a list of {loc, msg}.
  if (Array.isArray(detail) && detail.length) {
    return detail.map((d) => d.msg).filter(Boolean).join(', ') || fallback;
  }
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the server.';
  return error?.message || fallback;
};

// --- Public ---------------------------------------------------------------
export const fetchContent = () => api.get('/content').then((r) => r.data);

export const submitContact = (payload) =>
  api.post('/contact', payload).then((r) => r.data);

// --- Admin: session -------------------------------------------------------
export const login = (email, password) =>
  api.post('/admin/login', { email, password }).then((r) => r.data);

export const logout = () => api.post('/admin/logout').then((r) => r.data);

export const fetchMe = () => api.get('/admin/me').then((r) => r.data);

export const changePassword = (currentPassword, newPassword) =>
  api
    .post('/admin/change-password', { currentPassword, newPassword })
    .then((r) => r.data);

// --- Admin: singleton pages ----------------------------------------------
export const fetchPage = (key) =>
  api.get(`/admin/pages/${key}`).then((r) => r.data);

export const savePage = (key, payload) =>
  api.put(`/admin/pages/${key}`, payload).then((r) => r.data);

// --- Admin: content lists (films | ads | credits) -------------------------
export const fetchList = (resource) =>
  api.get(`/admin/content/${resource}`).then((r) => r.data);

export const createItem = (resource, payload) =>
  api.post(`/admin/content/${resource}`, payload).then((r) => r.data);

export const updateItem = (resource, id, payload) =>
  api.put(`/admin/content/${resource}/${id}`, payload).then((r) => r.data);

export const deleteItem = (resource, id) =>
  api.delete(`/admin/content/${resource}/${id}`).then((r) => r.data);

export const reorderItems = (resource, ids) =>
  api.put(`/admin/content/${resource}/reorder`, { ids }).then((r) => r.data);

// --- Admin: messages ------------------------------------------------------
export const fetchMessages = (unreadOnly = false) =>
  api
    .get('/admin/messages', { params: { unread_only: unreadOnly } })
    .then((r) => r.data);

export const setMessageRead = (id, read) =>
  api.patch(`/admin/messages/${id}`, { read }).then((r) => r.data);

export const deleteMessage = (id) =>
  api.delete(`/admin/messages/${id}`).then((r) => r.data);

// --- Admin: media ---------------------------------------------------------
export const fetchUploadSignature = () =>
  api.post('/admin/media/upload-signature').then((r) => r.data);

/**
 * Upload straight from the browser to Cloudinary.
 *
 * The file never passes through our own API, which is what keeps large cover
 * art clear of Vercel's 4.5 MB request-body cap and 10s function timeout.
 */
export const uploadImage = async (file, onProgress) => {
  const sig = await fetchUploadSignature();

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', sig.timestamp);
  form.append('signature', sig.signature);
  form.append('folder', sig.folder);

  // Deliberately a bare axios call: our instance's baseURL and credentials
  // must not be applied to a third-party host.
  const { data } = await axios.post(sig.uploadUrl, form, {
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return { url: data.secure_url, publicId: data.public_id };
};

export default api;
