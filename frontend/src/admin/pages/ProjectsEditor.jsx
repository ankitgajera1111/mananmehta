import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  ImageOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import PageHeader from '../components/PageHeader';
import ImageField from '../components/ImageField';
import { TextField, NumberField, TextAreaField, RepeaterField } from '../components/fields';
import { useListEditor } from '../hooks';
import { errorMessage } from '../../lib/api';
import { imageUrl } from '../../lib/media';

/**
 * One editor driving Films, Ads and Credits.
 *
 * The three differ only in which fields a row has, so they are described as
 * data here rather than written out as three near-identical screens.
 */
const CONFIG = {
  films: {
    title: 'Films & TV',
    description:
      'Feature films, documentaries and short films. These appear on the Films page and can be picked for the home banner.',
    singular: 'film',
    blank: {
      title: '',
      type: 'Feature Film',
      year: new Date().getFullYear(),
      director: '',
      genre: '',
      role: '',
      description: '',
      coverImage: { url: '', publicId: null },
      soundcloudPlaylist: '',
      tracks: [],
      published: true,
    },
    subtitle: (item) => [item.type, item.year].filter(Boolean).join(' • '),
  },
  ads: {
    title: 'Ads & Commercials',
    description:
      'Brand and commercial work shown on the Ads page. Also selectable for the home banner.',
    singular: 'ad',
    blank: {
      title: '',
      brand: '',
      type: 'TVC',
      year: new Date().getFullYear(),
      description: '',
      coverImage: { url: '', publicId: null },
      youtubeId: '',
      duration: '',
      published: true,
    },
    subtitle: (item) => [item.brand, item.year].filter(Boolean).join(' • '),
  },
  credits: {
    title: 'Credits',
    description:
      'The filmography list. The counters on the Credits page are calculated from these rows automatically.',
    singular: 'credit',
    blank: {
      title: '',
      year: new Date().getFullYear(),
      role: '',
      type: 'Feature Film',
      director: '',
      published: true,
    },
    subtitle: (item) => [item.type, item.year].filter(Boolean).join(' • '),
    noImage: true,
  },
};

const FilmFields = ({ draft, set }) => (
  <>
    <TextField label="Title" value={draft.title} onChange={(v) => set('title', v)} />
    <div className="grid sm:grid-cols-2 gap-4">
      <TextField
        label="Type"
        value={draft.type}
        onChange={(v) => set('type', v)}
        hint="Feature Film, Documentary, Short Film…"
      />
      <NumberField label="Year" value={draft.year} onChange={(v) => set('year', v)} />
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <TextField label="Director" value={draft.director} onChange={(v) => set('director', v)} />
      <TextField label="Genre" value={draft.genre} onChange={(v) => set('genre', v)} />
    </div>
    <TextField
      label="Your role"
      value={draft.role}
      onChange={(v) => set('role', v)}
      hint="e.g. Additional Music, Music Composer. Leave blank to hide the badge."
    />
    <TextAreaField
      label="Description"
      value={draft.description}
      onChange={(v) => set('description', v)}
      rows={4}
    />
    <ImageField
      label="Cover image"
      value={draft.coverImage}
      onChange={(v) => set('coverImage', v)}
      hint="Shown on the card and as the banner background if this project is featured."
    />
    <TextField
      label="SoundCloud playlist URL"
      value={draft.soundcloudPlaylist}
      onChange={(v) => set('soundcloudPlaylist', v)}
      hint="Optional."
    />
    <RepeaterField
      label="Tracks"
      items={draft.tracks || []}
      onChange={(v) => set('tracks', v)}
      addLabel="Add track"
      emptyText="No tracks added."
      blank={{ title: '', embedUrl: '', url: '' }}
      fields={[
        { key: 'title', label: 'Track title' },
        {
          key: 'embedUrl',
          label: 'SoundCloud embed URL',
          placeholder: 'https://w.soundcloud.com/player/?url=…',
        },
        { key: 'url', label: 'Or plain track link', placeholder: 'https://soundcloud.com/…' },
      ]}
    />
  </>
);

const AdFields = ({ draft, set }) => (
  <>
    <TextField label="Title" value={draft.title} onChange={(v) => set('title', v)} />
    <div className="grid sm:grid-cols-2 gap-4">
      <TextField
        label="Brand"
        value={draft.brand}
        onChange={(v) => set('brand', v)}
        hint="Also drives the brand filter and logo strip on the Ads page."
      />
      <NumberField label="Year" value={draft.year} onChange={(v) => set('year', v)} />
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <TextField label="Type" value={draft.type} onChange={(v) => set('type', v)} hint="TVC, Brand Film…" />
      <TextField
        label="Duration"
        value={draft.duration}
        onChange={(v) => set('duration', v)}
        placeholder="0:45"
      />
    </div>
    <TextAreaField
      label="Description"
      value={draft.description}
      onChange={(v) => set('description', v)}
      rows={4}
    />
    <TextField
      label="YouTube video ID"
      value={draft.youtubeId}
      onChange={(v) => set('youtubeId', v)}
      hint="Just the ID, e.g. dQw4w9WgXcQ — not the whole URL. This enables the play button."
    />
    <ImageField
      label="Cover image"
      value={draft.coverImage}
      onChange={(v) => set('coverImage', v)}
      hint="Tip: a YouTube thumbnail works — https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
    />
  </>
);

const CreditFields = ({ draft, set }) => (
  <>
    <TextField label="Title" value={draft.title} onChange={(v) => set('title', v)} />
    <div className="grid sm:grid-cols-2 gap-4">
      <NumberField label="Year" value={draft.year} onChange={(v) => set('year', v)} />
      <TextField
        label="Type"
        value={draft.type}
        onChange={(v) => set('type', v)}
        hint="Feature Film, Documentary, Short Film, TV Series, Commercial"
      />
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <TextField label="Your role" value={draft.role} onChange={(v) => set('role', v)} />
      <TextField label="Director" value={draft.director} onChange={(v) => set('director', v)} />
    </div>
  </>
);

const FIELD_COMPONENTS = { films: FilmFields, ads: AdFields, credits: CreditFields };

const ProjectsEditor = ({ resource }) => {
  const config = CONFIG[resource];
  const Fields = FIELD_COMPONENTS[resource];
  const { items, loading, error, create, update, remove, move } = useListEditor(resource);

  const [draft, setDraft] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const set = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const openNew = () => {
    setDraft({ ...config.blank });
    setEditingId(null);
  };

  const openEdit = (item) => {
    setDraft({ ...item });
    setEditingId(item.id);
  };

  const closeDialog = () => {
    setDraft(null);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!draft.title?.trim()) {
      toast.error('Please give it a title.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) await update(editingId, draft);
      else await create(draft);
      closeDialog();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not save.'));
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item) => {
    try {
      await update(item.id, { ...item, published: !item.published });
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update.'));
    }
  };

  const confirmDelete = async () => {
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await remove(target.id);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete.'));
    }
  };

  return (
    <>
      <PageHeader title={config.title} description={config.description}>
        <Button
          onClick={openNew}
          className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {config.singular}
        </Button>
      </PageHeader>

      {loading && (
        <div className="flex items-center gap-3 text-[#f5f5f0]/40 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading…
        </div>
      )}

      {error && !loading && (
        <p className="text-red-300 text-sm">{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl bg-[#151515] border border-dashed border-[#f5f5f0]/10 p-10 text-center">
          <p className="text-[#f5f5f0]/40">
            Nothing here yet. Add your first {config.singular}.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 rounded-xl bg-[#151515] border border-[#f5f5f0]/5"
          >
            <div className="flex flex-col">
              <button
                onClick={() => move(item.id, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="p-1 rounded text-[#f5f5f0]/30 hover:text-[#f5f5f0] disabled:opacity-20"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => move(item.id, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="p-1 rounded text-[#f5f5f0]/30 hover:text-[#f5f5f0] disabled:opacity-20"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {!config.noImage && (
              <div className="w-20 h-14 rounded-lg bg-[#0a0a0a] overflow-hidden flex-shrink-0 flex items-center justify-center">
                {imageUrl(item.coverImage) ? (
                  <img
                    src={imageUrl(item.coverImage)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageOff className="w-4 h-4 text-[#f5f5f0]/20" />
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-[#f5f5f0] truncate">
                {item.title || <span className="italic text-[#f5f5f0]/30">Untitled</span>}
              </p>
              <p className="text-[#f5f5f0]/40 text-xs truncate">
                {config.subtitle(item)}
              </p>
            </div>

            <button
              onClick={() => togglePublished(item)}
              title={item.published ? 'Visible on the site' : 'Hidden from the site'}
              className={
                item.published
                  ? 'p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10'
                  : 'p-2 rounded-lg text-[#f5f5f0]/25 hover:bg-[#f5f5f0]/10'
              }
            >
              {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => openEdit(item)}
              aria-label="Edit"
              className="p-2 rounded-lg text-[#f5f5f0]/50 hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/10"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPendingDelete(item)}
              aria-label="Delete"
              className="p-2 rounded-lg text-[#f5f5f0]/50 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={!!draft} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl bg-[#0d0d0d] border-[#f5f5f0]/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-[#f5f5f0]">
              {editingId ? `Edit ${config.singular}` : `New ${config.singular}`}
            </DialogTitle>
          </DialogHeader>

          {draft && (
            <div className="space-y-4 py-2">
              <Fields draft={draft} set={set} />

              <div className="flex items-center gap-3 pt-2 border-t border-[#f5f5f0]/10">
                <Switch
                  id="published"
                  checked={draft.published !== false}
                  onCheckedChange={(v) => set('published', v)}
                />
                <Label htmlFor="published" className="text-[#f5f5f0]/70 text-sm">
                  Visible on the website
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={closeDialog}
              className="text-[#f5f5f0]/60 hover:text-[#f5f5f0]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a]"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Save changes' : `Add ${config.singular}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent className="bg-[#0d0d0d] border-[#f5f5f0]/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f5f5f0]">
              Delete “{pendingDelete?.title}”?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#f5f5f0]/50">
              This cannot be undone. If you only want to take it off the site,
              use the eye icon to hide it instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#f5f5f0]/20 text-[#f5f5f0] hover:bg-[#f5f5f0]/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectsEditor;
