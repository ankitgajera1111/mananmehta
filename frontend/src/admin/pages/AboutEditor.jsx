import React from 'react';
import { Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import {
  TextField,
  TextAreaField,
  RepeaterField,
  StringListField,
  Section,
} from '../components/fields';
import { usePageEditor, useUnsavedWarning } from '../hooks';

const AboutEditor = () => {
  const { draft, setField, save, saving, loading, isDirty } = usePageEditor('about_page');
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
        title="About page"
        description="Your biography, skills and working process."
        isDirty={isDirty}
        saving={saving}
        onSave={save}
      />

      <div className="space-y-5">
        <Section title="Biography">
          <TextField
            label="Small heading"
            value={draft.kicker}
            onChange={(v) => setField('kicker', v)}
          />
          <TextAreaField
            label="Full biography"
            value={draft.fullBio}
            onChange={(v) => setField('fullBio', v)}
            rows={10}
            hint="Leave a blank line between paragraphs — each becomes its own paragraph on the page."
          />
          <StringListField
            label="Achievements"
            items={draft.achievements || []}
            onChange={(v) => setField('achievements', v)}
            addLabel="Add achievement"
          />
        </Section>

        <Section
          title="Skills & services"
          description="The six cards under the biography."
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Small heading"
              value={draft.skillsKicker}
              onChange={(v) => setField('skillsKicker', v)}
            />
            <TextField
              label="Heading"
              value={draft.skillsHeading}
              onChange={(v) => setField('skillsHeading', v)}
            />
          </div>
          <RepeaterField
            label="Skills"
            items={draft.skills || []}
            onChange={(v) => setField('skills', v)}
            addLabel="Add skill"
            blank={{ title: '', description: '' }}
            fields={[
              { key: 'title', label: 'Skill' },
              { key: 'description', label: 'Description', type: 'textarea', rows: 2 },
            ]}
          />
        </Section>

        <Section title="The process" description="The numbered steps.">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Small heading"
              value={draft.processKicker}
              onChange={(v) => setField('processKicker', v)}
            />
            <TextField
              label="Heading"
              value={draft.processHeading}
              onChange={(v) => setField('processHeading', v)}
            />
          </div>
          <RepeaterField
            label="Steps"
            items={draft.process || []}
            onChange={(v) => setField('process', v)}
            addLabel="Add step"
            blank={{ step: '', title: '', description: '' }}
            fields={[
              { key: 'step', label: 'Number', placeholder: '01' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description', type: 'textarea', rows: 2 },
            ]}
          />
        </Section>

        <Section title="Closing call to action">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Heading line 1"
              value={draft.ctaHeadingLine1}
              onChange={(v) => setField('ctaHeadingLine1', v)}
            />
            <TextField
              label="Heading line 2 (amber)"
              value={draft.ctaHeadingLine2}
              onChange={(v) => setField('ctaHeadingLine2', v)}
            />
          </div>
          <TextAreaField
            label="Body text"
            value={draft.ctaBody}
            onChange={(v) => setField('ctaBody', v)}
          />
          <TextField
            label="Button label"
            value={draft.ctaButtonLabel}
            onChange={(v) => setField('ctaButtonLabel', v)}
          />
        </Section>
      </div>
    </>
  );
};

export default AboutEditor;
