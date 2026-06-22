'use client';

export default function StudioEditorShell({ header, children }) {
  return (
    <div className="space-y-8 pb-8">
      {header}
      <p className="text-sm text-black/60">
        Click directly in each section to edit. What you see is what visitors get — save or wait for auto-save to
        publish.
      </p>
      <div className="space-y-8 pb-28">{children}</div>
    </div>
  );
}
