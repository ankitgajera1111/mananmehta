import React from 'react';
import { Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import {
  TextField,
  TextAreaField,
  RepeaterField,
  Section,
} from '../components/fields';
import { usePageEditor, useUnsavedWarning } from '../hooks';

const ContactEditor = () => {
  const { draft, setField, save, saving, loading, isDirty } =
    usePageEditor('contact_page');
  useUnsavedWarning(isDirty);

  if (loading || !draft) {
    return (
      <div className="flex items-center gap-3 text-[#f5f5f0]/40 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Contact page"
        description="Headings, the enquiry form's options, and the FAQ."
        isDirty={isDirty}
        saving={saving}
        onSave={save}
      />

      <div className="space-y-5">
        <Section title="Header">
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
              hint="This word appears in amber. Must match part of the heading."
            />
          </div>
          <TextAreaField
            label="Introduction"
            value={draft.intro}
            onChange={(v) => setField('intro', v)}
          />
        </Section>

        <Section
          title="Enquiry form"
          description="Your email address and location come from Settings."
        >
          <RepeaterField
            label="Project type options"
            items={draft.projectTypeOptions || []}
            onChange={(v) => setField('projectTypeOptions', v)}
            addLabel="Add option"
            blank={{ value: '', label: '' }}
            fields={[
              { key: 'label', label: 'What visitors see', placeholder: 'Feature Film' },
              {
                key: 'value',
                label: 'Internal value',
                placeholder: 'feature-film',
              },
            ]}
          />
          <TextField
            label="Success heading"
            value={draft.successHeading}
            onChange={(v) => setField('successHeading', v)}
          />
          <TextAreaField
            label="Success message"
            value={draft.successBody}
            onChange={(v) => setField('successBody', v)}
            rows={2}
          />
        </Section>

        <Section title="FAQ">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Small heading"
              value={draft.faqKicker}
              onChange={(v) => setField('faqKicker', v)}
            />
            <TextField
              label="Heading"
              value={draft.faqHeading}
              onChange={(v) => setField('faqHeading', v)}
            />
          </div>
          <RepeaterField
            label="Questions"
            items={draft.faqs || []}
            onChange={(v) => setField('faqs', v)}
            addLabel="Add question"
            blank={{ q: '', a: '' }}
            fields={[
              { key: 'q', label: 'Question' },
              { key: 'a', label: 'Answer', type: 'textarea', rows: 3 },
            ]}
          />
        </Section>
      </div>
    </>
  );
};

export default ContactEditor;
