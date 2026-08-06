import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { cn } from '../../lib/utils';

const inputClass =
  'bg-[#0a0a0a] border-[#f5f5f0]/10 text-[#f5f5f0] placeholder:text-[#f5f5f0]/25 focus:border-amber-500';

const labelClass =
  'text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase mb-2 block';

export const TextField = ({ label, value, onChange, hint, ...rest }) => (
  <div>
    {label && <Label className={labelClass}>{label}</Label>}
    <Input
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
      {...rest}
    />
    {hint && <p className="text-[#f5f5f0]/40 text-xs mt-1.5">{hint}</p>}
  </div>
);

export const NumberField = ({ label, value, onChange, hint, ...rest }) => (
  <div>
    {label && <Label className={labelClass}>{label}</Label>}
    <Input
      type="number"
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value;
        // Empty means "not set", not zero - years and durations are optional.
        onChange(raw === '' ? null : Number(raw));
      }}
      className={inputClass}
      {...rest}
    />
    {hint && <p className="text-[#f5f5f0]/40 text-xs mt-1.5">{hint}</p>}
  </div>
);

export const TextAreaField = ({ label, value, onChange, rows = 4, hint, ...rest }) => (
  <div>
    {label && <Label className={labelClass}>{label}</Label>}
    <Textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={cn(inputClass, 'resize-y')}
      {...rest}
    />
    {hint && <p className="text-[#f5f5f0]/40 text-xs mt-1.5">{hint}</p>}
  </div>
);

export const Section = ({ title, description, children }) => (
  <section className="rounded-xl bg-[#151515] border border-[#f5f5f0]/5 p-6 space-y-5">
    <div>
      <h2 className="font-display text-lg text-[#f5f5f0]">{title}</h2>
      {description && (
        <p className="text-[#f5f5f0]/40 text-sm mt-1">{description}</p>
      )}
    </div>
    {children}
  </section>
);

/**
 * Editor for a list of objects - tracks, skills, FAQs, process steps.
 *
 * `fields` describes each row; `blank` is the shape of a new entry. Rows can be
 * reordered because on several of these lists (process steps, FAQs) the order
 * is what the visitor sees.
 */
export const RepeaterField = ({
  label,
  items = [],
  onChange,
  fields,
  blank,
  addLabel = 'Add item',
  emptyText = 'Nothing here yet.',
}) => {
  const update = (index, key, value) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {label && <Label className={labelClass}>{label}</Label>}

      {items.length === 0 && (
        <p className="text-[#f5f5f0]/30 text-sm italic">{emptyText}</p>
      )}

      {items.map((item, index) => (
        // Index keys are safe here: rows are only ever edited, moved or
        // removed as a whole, and the list is re-rendered from `items`.
        <div
          key={index}
          className="rounded-lg bg-[#0a0a0a] border border-[#f5f5f0]/10 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 grid gap-3">
              {fields.map((field) =>
                field.type === 'textarea' ? (
                  <TextAreaField
                    key={field.key}
                    label={field.label}
                    value={item[field.key]}
                    rows={field.rows || 3}
                    placeholder={field.placeholder}
                    onChange={(v) => update(index, field.key, v)}
                  />
                ) : (
                  <TextField
                    key={field.key}
                    label={field.label}
                    value={item[field.key]}
                    placeholder={field.placeholder}
                    onChange={(v) => update(index, field.key, v)}
                  />
                )
              )}
            </div>

            <div className="flex flex-col gap-1 pt-6">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="p-1.5 rounded text-[#f5f5f0]/40 hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/10 disabled:opacity-20 disabled:hover:bg-transparent"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="p-1.5 rounded text-[#f5f5f0]/40 hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/10 disabled:opacity-20 disabled:hover:bg-transparent"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                aria-label="Remove"
                className="p-1.5 rounded text-[#f5f5f0]/40 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...items, { ...blank }])}
        className="border-[#f5f5f0]/20 text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        {addLabel}
      </Button>
    </div>
  );
};

/** Editor for a plain list of strings (e.g. achievements). */
export const StringListField = ({ label, items = [], onChange, addLabel = 'Add' }) => (
  <div className="space-y-3">
    {label && <Label className={labelClass}>{label}</Label>}
    {items.map((item, index) => (
      <div key={index} className="flex gap-2">
        <Input
          value={item}
          onChange={(e) => {
            const next = [...items];
            next[index] = e.target.value;
            onChange(next);
          }}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => onChange(items.filter((_, i) => i !== index))}
          aria-label="Remove"
          className="px-3 rounded text-[#f5f5f0]/40 hover:text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
    <Button
      type="button"
      variant="outline"
      onClick={() => onChange([...items, ''])}
      className="border-[#f5f5f0]/20 text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/10"
    >
      <Plus className="w-4 h-4 mr-2" />
      {addLabel}
    </Button>
  </div>
);
