'use client';

import { useShowPreview } from '@/app/studio/components/PreviewVisibilityContext';

export default function EditorPreviewRow({ label, editor, preview }) {
  const showPreview = useShowPreview();

  if (!showPreview) {
    return <div className="min-w-0">{editor}</div>;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2 xl:gap-6 items-stretch">
      <div className="min-w-0">{editor}</div>
      <div className="min-w-0 flex flex-col">
        <p className="text-xs uppercase tracking-[0.2em] text-black/40 mb-2 xl:mb-3">{label}</p>
        <div className="flex-1 rounded-xl border border-black/10 bg-white shadow-sm min-h-[120px]">
          {preview}
        </div>
      </div>
    </div>
  );
}
