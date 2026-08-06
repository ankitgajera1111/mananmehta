import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchContent } from '../lib/api';

const ContentContext = createContext(null);

const CACHE_KEY = 'mm_content_cache_v1';

/**
 * Read the last good payload from localStorage.
 *
 * This is what makes the site feel static despite being API-driven: a repeat
 * visitor paints instantly from cache while the network request revalidates in
 * the background, so they never watch a Vercel Python cold start. It also means
 * a database outage degrades to slightly stale content instead of a broken page.
 */
const readCache = () => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Private mode, quota, or corrupt JSON - cache is strictly optional.
    return null;
  }
};

const writeCache = (data) => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
};

export const ContentProvider = ({ children }) => {
  const cached = useMemo(readCache, []);
  const [content, setContent] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ showSpinner } = {}) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await fetchContent();
      setContent(data);
      writeCache(data);
      setError(null);
    } catch (err) {
      // Keep whatever is already in state: if we painted from cache, a failed
      // revalidation should not blank the page. `error` alone drives the
      // fatal-vs-stale distinction below.
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load({ showSpinner: !cached });
  }, [load, cached]);

  const value = useMemo(
    () => ({
      content,
      loading,
      // Only a fatal error if we have nothing cached to fall back on.
      error: content ? null : error,
      isStale: Boolean(error && content),
      refresh: () => load({ showSpinner: false }),
    }),
    [content, loading, error, load]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used inside a <ContentProvider>');
  }
  return ctx;
};

/**
 * Section-level accessor with a guaranteed-object result.
 *
 * Pages call e.g. `useSection('home')` and can then read fields without
 * optional chaining on every line, which keeps the JSX close to how it looked
 * when it read from the old static mock module.
 */
export const useSection = (key) => {
  const { content } = useContent();
  return content?.[key] ?? {};
};

export const useCollection = (key) => {
  const { content } = useContent();
  const value = content?.[key];
  return Array.isArray(value) ? value : [];
};
