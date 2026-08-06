import React, { useMemo } from 'react';
import { Loader2, ChevronUp, ChevronDown, X, ImageOff, Film, Megaphone } from 'lucide-react';
import { Label } from '../../components/ui/label';
import PageHeader from '../components/PageHeader';
import {
  TextField,
  NumberField,
  TextAreaField,
  RepeaterField,
  Section,
} from '../components/fields';
import { usePageEditor, useListEditor, useUnsavedWarning } from '../hooks';
import { imageUrl } from '../../lib/media';
import { cn } from '../../lib/utils';

/**
 * The banner picker.
 *
 * Stores references ({kind, projectId}) rather than copies of the projects, so
 * editing a film's cover art updates its slide with no action here. Ordering is
 * the rotation order.
 */
const BannerPicker = ({ selected = [], onChange, films, ads }) => {
  const catalogue = useMemo(
    () => [
      ...films.map((p) => ({ ...p, kind: 'film' })),
      ...ads.map((p) => ({ ...p, kind: 'ad' })),
    ],
    [films, ads]
  );

  const find = (ref) =>
    catalogue.find((p) => p.kind === ref.kind && p.id === ref.projectId);

  const isSelected = (project) =>
    selected.some((r) => r.kind === project.kind && r.projectId === project.id);

  const toggle = (project) => {
    if (isSelected(project)) {
      onChange(
        selected.filter(
          (r) => !(r.kind === project.kind && r.projectId === project.id)
        )
      );
    } else {
      onChange([...selected, { kind: project.kind, projectId: project.id }]);
    }
  };

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= selected.length) return;
    const next = [...selected];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase mb-3 block">
          In the banner ({selected.length})
        </Label>

        {selected.length === 0 ? (
          <p className="text-[#f5f5f0]/30 text-sm italic">
            Nothing selected — the banner will fall back to your first few films.
          </p>
        ) : (
          <div className="space-y-2">
            {selected.map((ref, index) => {
              const project = find(ref);
              if (!project) {
                return (
                  <div
                    key={`${ref.kind}-${ref.projectId}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                  >
                    <p className="text-red-300/80 text-sm">
                      A deleted project is still listed here.
                    </p>
                    <button
                      onClick={() =>
                        onChange(selected.filter((_, i) => i !== index))
                      }
                      className="p-1.5 rounded text-red-400 hover:bg-red-500/10"
                      aria-label="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              }
              return (
                <div
                  key={`${ref.kind}-${ref.projectId}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0a0a0a] border border-[#f5f5f0]/10"
                >
                  <span className="w-6 text-center font-mono text-xs text-amber-500">
                    {index + 1}
                  </span>
                  <div className="w-16 h-11 rounded bg-[#151515] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {imageUrl(project.coverImage) ? (
                      <img
                        src={imageUrl(project.coverImage)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageOff className="w-3.5 h-3.5 text-[#f5f5f0]/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#f5f5f0] text-sm truncate">{project.title}</p>
                    <p className="text-[#f5f5f0]/40 text-xs truncate">
                      {project.kind === 'film' ? project.type : project.brand}
                    </p>
                  </div>
                  {!project.published && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-500/80 px-2 py-1 rounded bg-amber-500/10">
                      Hidden
                    </span>
                  )}
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="p-1 rounded text-[#f5f5f0]/30 hover:text-[#f5f5f0] disabled:opacity-20"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === selected.length - 1}
                      aria-label="Move down"
                      className="p-1 rounded text-[#f5f5f0]/30 hover:text-[#f5f5f0] disabled:opacity-20"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggle(project)}
                    aria-label="Remove from banner"
                    className="p-1.5 rounded text-[#f5f5f0]/40 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <Label className="text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase mb-3 block">
          Click to add or remove
        </Label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {catalogue.map((project) => {
            const active = isSelected(project);
            const Icon = project.kind === 'film' ? Film : Megaphone;
            return (
              <button
                key={`${project.kind}-${project.id}`}
                onClick={() => toggle(project)}
                className={cn(
                  'flex items-center gap-2.5 p-2 rounded-lg border text-left transition-colors',
                  active
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-[#0a0a0a] border-[#f5f5f0]/10 hover:border-[#f5f5f0]/25'
                )}
              >
                <div className="w-12 h-9 rounded bg-[#151515] overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {imageUrl(project.coverImage) ? (
                    <img
                      src={imageUrl(project.coverImage)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageOff className="w-3 h-3 text-[#f5f5f0]/20" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-xs truncate',
                      active ? 'text-amber-500' : 'text-[#f5f5f0]/80'
                    )}
                  >
                    {project.title}
                  </p>
                  <p className="text-[#f5f5f0]/30 text-[10px] flex items-center gap-1">
                    <Icon className="w-2.5 h-2.5" />
                    {project.kind === 'film' ? 'Film' : 'Ad'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HomeEditor = () => {
  const { draft, setField, save, saving, loading, isDirty } = usePageEditor('home_page');
  const { items: films } = useListEditor('films');
  const { items: ads } = useListEditor('ads');
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
        title="Home page"
        description="The banner rotation and every piece of text on the home page."
        isDirty={isDirty}
        saving={saving}
        onSave={save}
      />

      <div className="space-y-5">
        <Section
          title="Banner"
          description="Pick which projects rotate behind the hero, and in what order."
        >
          <BannerPicker
            selected={draft.featuredWork || []}
            onChange={(v) => setField('featuredWork', v)}
            films={films}
            ads={ads}
          />
          <NumberField
            label="Seconds per slide"
            value={Math.round((draft.rotationMs || 5000) / 1000)}
            onChange={(v) => setField('rotationMs', Math.max(1, v || 5) * 1000)}
            min={1}
            max={30}
            hint="How long each banner image stays before moving on."
          />
        </Section>

        <Section title="Hero text">
          <TextField
            label="Small heading above your name"
            value={draft.heroKicker}
            onChange={(v) => setField('heroKicker', v)}
          />
          <TextField
            label="Tagline"
            value={draft.heroTagline}
            onChange={(v) => setField('heroTagline', v)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Main button"
              value={draft.heroPrimaryCta}
              onChange={(v) => setField('heroPrimaryCta', v)}
            />
            <TextField
              label="Second button"
              value={draft.heroSecondaryCta}
              onChange={(v) => setField('heroSecondaryCta', v)}
            />
          </div>
        </Section>

        <Section
          title="Introduction"
          description="The two-column section below the banner."
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Heading line 1"
              value={draft.introHeadingLine1}
              onChange={(v) => setField('introHeadingLine1', v)}
            />
            <TextField
              label="Heading line 2 (amber)"
              value={draft.introHeadingLine2}
              onChange={(v) => setField('introHeadingLine2', v)}
            />
          </div>
          <TextAreaField
            label="Body text"
            value={draft.introBody}
            onChange={(v) => setField('introBody', v)}
          />
          <TextField
            label="Button label"
            value={draft.introCtaLabel}
            onChange={(v) => setField('introCtaLabel', v)}
          />
          <RepeaterField
            label="Service cards"
            items={draft.services || []}
            onChange={(v) => setField('services', v)}
            addLabel="Add service"
            blank={{ title: '', description: '' }}
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description', type: 'textarea', rows: 2 },
            ]}
          />
        </Section>

        <Section title="Section headings">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Films — small heading"
              value={draft.filmsKicker}
              onChange={(v) => setField('filmsKicker', v)}
            />
            <TextField
              label="Films — heading"
              value={draft.filmsHeading}
              onChange={(v) => setField('filmsHeading', v)}
            />
            <TextField
              label="Ads — small heading"
              value={draft.adsKicker}
              onChange={(v) => setField('adsKicker', v)}
            />
            <TextField
              label="Ads — heading"
              value={draft.adsHeading}
              onChange={(v) => setField('adsHeading', v)}
            />
          </div>
        </Section>

        <Section title="Closing call to action">
          <TextField
            label="Small heading"
            value={draft.ctaKicker}
            onChange={(v) => setField('ctaKicker', v)}
          />
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

export default HomeEditor;
