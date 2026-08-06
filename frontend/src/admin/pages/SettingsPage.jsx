import React, { useState } from 'react';
import { Loader2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import PageHeader from '../components/PageHeader';
import { TextField, TextAreaField, Section } from '../components/fields';
import { usePageEditor, useUnsavedWarning } from '../hooks';
import { changePassword, errorMessage } from '../../lib/api';

const ChangePassword = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (next.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await changePassword(current, next);
      setCurrent('');
      setNext('');
      setConfirm('');
      toast.success('Password changed');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not change password.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <TextField
        label="Current password"
        type="password"
        autoComplete="current-password"
        value={current}
        onChange={setCurrent}
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={setNext}
          hint="At least 8 characters."
        />
        <TextField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
        />
      </div>
      <Button
        type="submit"
        disabled={saving || !current || !next}
        className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] disabled:opacity-40"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <KeyRound className="w-4 h-4 mr-2" />
        )}
        Change password
      </Button>
    </form>
  );
};

const SettingsPage = () => {
  const { draft, setField, save, saving, loading, isDirty } =
    usePageEditor('site_settings');
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
        title="Settings"
        description="Your name, contact details and social links — these appear across the whole site."
        isDirty={isDirty}
        saving={saving}
        onSave={save}
      />

      <div className="space-y-5">
        <Section title="Identity">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Name"
              value={draft.name}
              onChange={(v) => setField('name', v)}
              hint="Shown in the logo, hero and footer."
            />
            <TextField
              label="Title"
              value={draft.title}
              onChange={(v) => setField('title', v)}
            />
          </div>
          <TextField
            label="Tagline"
            value={draft.tagline}
            onChange={(v) => setField('tagline', v)}
          />
        </Section>

        <Section title="Contact details">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Email"
              value={draft.email}
              onChange={(v) => setField('email', v)}
            />
            <TextField
              label="Location"
              value={draft.location}
              onChange={(v) => setField('location', v)}
            />
          </div>
        </Section>

        <Section title="Social links">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Instagram handle"
              value={draft.instagram}
              onChange={(v) => setField('instagram', v)}
              hint="Without the @."
            />
            <TextField
              label="Instagram URL"
              value={draft.instagramUrl}
              onChange={(v) => setField('instagramUrl', v)}
            />
            <TextField
              label="Spotify URL"
              value={draft.spotify}
              onChange={(v) => setField('spotify', v)}
            />
            <TextField
              label="IMDb URL"
              value={draft.imdb}
              onChange={(v) => setField('imdb', v)}
            />
          </div>
        </Section>

        <Section
          title="Search engines"
          description="What Google shows when your site appears in results."
        >
          <TextField
            label="Page title"
            value={draft.seoTitle}
            onChange={(v) => setField('seoTitle', v)}
          />
          <TextAreaField
            label="Description"
            value={draft.seoDescription}
            onChange={(v) => setField('seoDescription', v)}
            rows={3}
            hint="Around 150–160 characters works best."
          />
        </Section>

        <Section
          title="Your login"
          description="Changing this affects only how you sign in to this panel."
        >
          <ChangePassword />
        </Section>
      </div>
    </>
  );
};

export default SettingsPage;
