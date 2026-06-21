'use client';

export default function PublishedToggle({
  published,
  onChange,
  checkboxLabel,
  draftNote,
  liveNote,
}) {
  const isLive = Boolean(published);

  return (
    <div
      className={`rounded-lg border p-4 ${
        isLive ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span
            className={`inline-block text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${
              isLive ? 'bg-green-200 text-green-900' : 'bg-amber-200 text-amber-900'
            }`}
          >
            {isLive ? 'Live on site' : 'Draft — hidden from visitors'}
          </span>
          <p className="text-sm text-black/70 mt-2">{isLive ? liveNote : draftNote}</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={isLive}
            onChange={(e) => onChange(e.target.checked)}
          />
          {checkboxLabel}
        </label>
      </div>
    </div>
  );
}
