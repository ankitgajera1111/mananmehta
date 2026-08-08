/**
 * The public pages that Page Visibility can switch off, in nav order.
 *
 * `key` matches a field on the PageVisibility document (see backend
 * models.py). App.js, Navigation and Footer all read this one list, so a hidden
 * page loses its route and its links together - hiding it in one place but not
 * the other is exactly what leaves dead links behind.
 *
 * Home is absent deliberately: it is always routed, both because the site needs
 * a landing page and because it is where a hidden page redirects to.
 *
 * This lives outside App.js so the layout components can import it without
 * creating a cycle back through App.
 */
export const PUBLIC_PAGES = [
  { path: '/films', key: 'films', label: 'Films' },
  { path: '/ads', key: 'ads', label: 'Ads' },
  { path: '/about', key: 'about', label: 'About' },
  { path: '/credits', key: 'credits', label: 'Credits' },
  { path: '/contact', key: 'contact', label: 'Contact' },
];
