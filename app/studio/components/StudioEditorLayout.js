'use client';

import { useState } from 'react';

export default function StudioEditorLayout({
  preview,
  previewLabel = 'Live preview',
  children,
}) {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div>
      <div className="mb-4 flex justify-end xl:hidden">
        <button
          type="button"
          onClick={() => setShowPreview((value) => !value)}
          className="px-4 py-2 rounded-lg border border-black/20 text-sm font-medium hover:bg-black/5"
        >
          {showPreview ? 'Hide preview' : 'Show live preview'}
        </button>
      </div>

      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <div className="min-w-0 space-y-8">{children}</div>

        <div className={`min-w-0 ${showPreview ? 'block' : 'hidden'}`}>
          <div className="xl:sticky xl:top-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">{previewLabel}</p>
                <p className="text-sm text-black/60">Updates as you type — save to publish</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="hidden xl:inline-flex px-3 py-1.5 rounded border border-black/20 text-xs hover:bg-black/5"
              >
                Hide
              </button>
            </div>

            <div className="rounded-xl border border-black/10 bg-white shadow-lg overflow-hidden">
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">{preview}</div>
            </div>
          </div>
        </div>
      </div>

      {!showPreview && (
        <div className="hidden xl:flex justify-end mt-4">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 rounded-lg border border-black/20 text-sm font-medium hover:bg-black/5"
          >
            Show live preview
          </button>
        </div>
      )}
    </div>
  );
}
