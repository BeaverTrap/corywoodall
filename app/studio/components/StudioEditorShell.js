'use client';

import { useEffect, useState } from 'react';
import { PreviewVisibilityProvider } from '@/app/studio/components/PreviewVisibilityContext';

function useDefaultPreviewVisible() {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setShowPreview(window.matchMedia('(min-width: 768px)').matches);
  }, []);

  return [showPreview, setShowPreview];
}

export default function StudioEditorShell({ header, children }) {
  const [showPreview, setShowPreview] = useDefaultPreviewVisible();

  return (
    <PreviewVisibilityProvider showPreview={showPreview}>
      <div className="space-y-8 pb-8">
        {header}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-black/60">
            Live preview matches each section — save to publish.
            <span className="md:hidden"> Preview is off on small screens; tap Show preview to check layout.</span>
          </p>
          <button
            type="button"
            onClick={() => setShowPreview((value) => !value)}
            className="px-4 py-2 rounded-lg border border-black/20 text-sm font-medium hover:bg-black/5 shrink-0"
          >
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
        </div>

        <div className="space-y-8 pb-28">{children}</div>
      </div>
    </PreviewVisibilityProvider>
  );
}
