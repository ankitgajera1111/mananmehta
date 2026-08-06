import React from 'react';
import { Loader2 } from 'lucide-react';
import { TextField, TextAreaField, Section } from '../components/fields';
import { usePageEditor } from '../hooks';
import { Button } from '../../components/ui/button';
import { Save } from 'lucide-react';

/**
 * Header copy for the Films / Ads / Credits index pages.
 *
 * Embedded inside those screens rather than given its own nav entry: the client
 * thinks in terms of "the Films page", not "the Films page header document".
 */
const ListingPageEditor = ({ pageKey, title }) => {
  const { draft, setField, save, saving, loading, isDirty } = usePageEditor(pageKey);

  if (loading || !draft) {
    return (
      <div className="flex items-center gap-2 text-[#f5f5f0]/30 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading page text…
      </div>
    );
  }

  return (
    <Section
      title={title}
      description="The heading and introduction at the top of this page."
    >
      <TextField
        label="Small heading"
        value={draft.kicker}
        onChange={(v) => setField('kicker', v)}
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Heading"
          value={draft.heading}
          onChange={(v) => setField('heading', v)}
        />
        <TextField
          label="Word to highlight"
          value={draft.accentWord}
          onChange={(v) => setField('accentWord', v)}
          hint="Appears in amber. Leave blank for none."
        />
      </div>
      <TextAreaField
        label="Introduction"
        value={draft.intro}
        onChange={(v) => setField('intro', v)}
      />
      <Button
        onClick={save}
        disabled={saving || !isDirty}
        className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] disabled:opacity-40"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        Save page text
      </Button>
    </Section>
  );
};

export default ListingPageEditor;
