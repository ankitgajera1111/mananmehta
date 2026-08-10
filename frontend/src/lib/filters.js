/**
 * Filter bars derived from the content itself.
 *
 * The Films and Ads pages both offer a row of buttons that narrow the list.
 * Building those buttons from a hand-written array means a category the client
 * invents in the admin panel has no button, and its projects are only ever
 * visible under "All" - so the page quietly under-reports the work.
 *
 * Matching is normalised as well as the options. The Type and Brand fields are
 * free text, so "Documentary", "documentary" and "Documentary " are all one
 * category as far as a visitor is concerned, and a stray capital or trailing
 * space must not split a button in two or make one match nothing.
 */

export const ALL = 'all';

const normalise = (value) => String(value ?? '').trim().toLowerCase();

/**
 * The distinct values of `key` across `items`, in the order they first appear -
 * which is the order the client arranged them in, not alphabetical.
 *
 * Blanks are dropped: a project whose Type was never filled in should not
 * contribute an unlabelled button.
 */
export const filterOptions = (items, key) => {
  const firstSpelling = new Map();
  for (const item of items) {
    const raw = String(item?.[key] ?? '').trim();
    if (!raw) continue;
    // Keep whichever spelling appeared first and let it stand for the rest.
    if (!firstSpelling.has(normalise(raw))) {
      firstSpelling.set(normalise(raw), raw);
    }
  }
  return [...firstSpelling.values()];
};

/** Whether an item's value belongs under the currently selected filter. */
export const matchesFilter = (value, filter) =>
  filter === ALL || normalise(value) === normalise(filter);
