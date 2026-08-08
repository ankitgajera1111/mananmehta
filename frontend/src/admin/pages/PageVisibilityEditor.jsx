import React from 'react';
import { Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import PageHeader from '../components/PageHeader';
import { Section } from '../components/fields';
import { usePageEditor, useUnsavedWarning } from '../hooks';
import { PUBLIC_PAGES } from '../../lib/pages';

/**
 * What each switch actually does, in the client's terms rather than ours.
 * Keyed to match PUBLIC_PAGES / the PageVisibility model.
 */
const DESCRIPTIONS = {
  films: 'Your film and TV scores, plus the Films section on the home page.',
  ads: 'Your advertising work, plus the Ads section on the home page.',
  about: 'Your biography, skills and process.',
  credits: 'Your full filmography list.',
  contact:
    'Your enquiry form, and the "Get in Touch" buttons across the site.',
};

const PageRow = ({ page, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 py-4 border-b border-[#f5f5f0]/5 last:border-0">
    <div className="min-w-0">
      <Label
        htmlFor={`visible-${page.key}`}
        className="flex items-center gap-2 text-[#f5f5f0] text-sm cursor-pointer"
      >
        {checked ? (
          <Eye className="w-4 h-4 text-amber-500 flex-shrink-0" />
        ) : (
          <EyeOff className="w-4 h-4 text-[#f5f5f0]/30 flex-shrink-0" />
        )}
        {page.label}
        <span className="font-mono text-[10px] text-[#f5f5f0]/30">
          {page.path}
        </span>
      </Label>
      <p className="text-[#f5f5f0]/40 text-xs mt-1.5 ml-6">
        {DESCRIPTIONS[page.key]}
      </p>
    </div>
    <Switch
      id={`visible-${page.key}`}
      checked={checked}
      onCheckedChange={onChange}
    />
  </div>
);

/**
 * Switches whole pages on and off on the public site.
 *
 * Hiding a page removes its route as well as its links, so the URL stops
 * working for anyone who has it bookmarked or finds it in search results - they
 * land on the home page instead. Editing a hidden page here in the admin panel
 * carries on working, which is the point: you get it right before showing it.
 */
const PageVisibilityEditor = () => {
  const { draft, setField, save, saving, loading, isDirty } =
    usePageEditor('page_visibility');
  useUnsavedWarning(isDirty);

  if (loading || !draft) {
    return (
      <div className="flex items-center gap-3 text-[#f5f5f0]/40 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading…
      </div>
    );
  }

  // Same rule the website applies: only an explicit false hides a page, so a
  // field this document predates still reads as visible.
  const isVisible = (key) => draft[key] !== false;
  const hiddenCount = PUBLIC_PAGES.filter(({ key }) => !isVisible(key)).length;

  return (
    <>
      <PageHeader
        title="Page Visibility"
        description="Choose which pages appear on your website. Hidden pages disappear from the menu and stop opening, but you can still edit them here."
        isDirty={isDirty}
        saving={saving}
        onSave={save}
      />

      <div className="space-y-5">
        <Section
          title="Pages"
          description="Your home page is always visible — it is where visitors land, including anyone who follows a link to a page you have hidden."
        >
          <div>
            {PUBLIC_PAGES.map((page) => (
              <PageRow
                key={page.key}
                page={page}
                checked={isVisible(page.key)}
                onChange={(value) => setField(page.key, value)}
              />
            ))}
          </div>
        </Section>

        {!isVisible('contact') && (
          <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-[#f5f5f0]">Your contact form will be hidden.</p>
              <p className="text-[#f5f5f0]/50 mt-1">
                Visitors will not be able to send you enquiries through the
                website, so nothing new will arrive in Messages. Your email
                address stays in the footer, so people can still reach you.
              </p>
            </div>
          </div>
        )}

        {hiddenCount > 0 && (
          <p className="text-[#f5f5f0]/30 text-xs">
            {hiddenCount} {hiddenCount === 1 ? 'page is' : 'pages are'} hidden.
            Search engines may take a few weeks to stop listing{' '}
            {hiddenCount === 1 ? 'it' : 'them'}; until then, anyone clicking
            through from Google lands on your home page.
          </p>
        )}
      </div>
    </>
  );
};

export default PageVisibilityEditor;
