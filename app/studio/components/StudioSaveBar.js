'use client';

import Link from 'next/link';
import StudioStatusMessage from '@/app/studio/components/StudioStatusMessage';

export default function StudioSaveBar({
  saveLabel = 'Save',
  onSave,
  saving = false,
  disabled = false,
  viewHref = null,
  viewLabel = 'View on site',
  message = '',
  messageTone = 'info',
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="container mx-auto max-w-7xl px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          {message ? <StudioStatusMessage message={message} tone={messageTone} /> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {viewHref ? (
            <Link
              href={viewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-lg border border-black/20 text-sm font-medium hover:bg-black/5"
            >
              {viewLabel}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onSave}
            disabled={disabled || saving}
            className="px-5 py-2.5 rounded-lg bg-black text-white text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
