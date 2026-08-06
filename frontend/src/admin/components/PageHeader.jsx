import React from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';

/**
 * Title row with the save action.
 *
 * The button is disabled until something actually changed, which doubles as the
 * unsaved-changes indicator - no separate "you have unsaved edits" banner to
 * keep in sync.
 */
const PageHeader = ({ title, description, isDirty, saving, onSave, children }) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="font-display text-2xl lg:text-3xl text-[#f5f5f0]">{title}</h1>
      {description && (
        <p className="text-[#f5f5f0]/40 text-sm mt-1 max-w-2xl">{description}</p>
      )}
    </div>

    <div className="flex items-center gap-3">
      {children}
      {onSave && (
        <>
          {isDirty && (
            <span className="text-amber-500/80 font-mono text-[10px] tracking-wider uppercase">
              Unsaved
            </span>
          )}
          <Button
            onClick={onSave}
            disabled={saving || !isDirty}
            className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] disabled:opacity-40"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save changes
          </Button>
        </>
      )}
    </div>
  </div>
);

export default PageHeader;
