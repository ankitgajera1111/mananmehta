import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import * as api from '../lib/api';
import { useContent } from '../context/ContentContext';

/**
 * Editing state for one singleton page document.
 *
 * Holds a draft separate from the last-saved value so "unsaved changes" is a
 * real comparison rather than a flag someone has to remember to set.
 */
export const usePageEditor = (key) => {
  const { refresh } = useContent();
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .fetchPage(key)
      .then((data) => {
        if (cancelled) return;
        setDraft(data);
        setSaved(data);
        setError(null);
      })
      .catch((err) => !cancelled && setError(api.errorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [key]);

  const setField = useCallback((field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const result = await api.savePage(key, draft);
      setDraft(result);
      setSaved(result);
      // Public pages read from ContentProvider, so refresh it or the site
      // would keep showing the previous values until a reload.
      refresh();
      toast.success('Saved');
      return true;
    } catch (err) {
      toast.error(api.errorMessage(err, 'Could not save.'));
      return false;
    } finally {
      setSaving(false);
    }
  }, [key, draft, refresh]);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved]
  );

  return { draft, setDraft, setField, save, saving, loading, error, isDirty };
};

/** Editing state for an ordered content list (films | ads | credits). */
export const useListEditor = (resource) => {
  const { refresh } = useContent();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.fetchList(resource));
      setError(null);
    } catch (err) {
      setError(api.errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload) => {
      const created = await api.createItem(resource, payload);
      await load();
      refresh();
      toast.success('Added');
      return created;
    },
    [resource, load, refresh]
  );

  const update = useCallback(
    async (id, payload) => {
      const updated = await api.updateItem(resource, id, payload);
      await load();
      refresh();
      toast.success('Saved');
      return updated;
    },
    [resource, load, refresh]
  );

  const remove = useCallback(
    async (id) => {
      await api.deleteItem(resource, id);
      await load();
      refresh();
      toast.success('Deleted');
    },
    [resource, load, refresh]
  );

  const move = useCallback(
    async (id, direction) => {
      const index = items.findIndex((i) => i.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= items.length) return;

      // Reorder locally first so the row moves under the cursor immediately,
      // then persist. A failure reloads the server's truth.
      const next = [...items];
      [next[index], next[target]] = [next[target], next[index]];
      setItems(next);
      try {
        await api.reorderItems(resource, next.map((i) => i.id));
        refresh();
      } catch (err) {
        toast.error(api.errorMessage(err, 'Could not reorder.'));
        load();
      }
    },
    [items, resource, load, refresh]
  );

  return { items, loading, error, reload: load, create, update, remove, move };
};

/** Warn before leaving a page with unsaved edits. */
export const useUnsavedWarning = (isDirty) => {
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;

  useEffect(() => {
    const handler = (event) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);
};
