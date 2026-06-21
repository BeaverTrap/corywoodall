'use client';

export default function DragHandle({ dragHandleProps, className = '' }) {
  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      title="Drag to reorder"
      className={`inline-flex items-center justify-center px-2 py-1 border border-black/15 rounded text-black/50 hover:text-black hover:bg-black/5 cursor-grab active:cursor-grabbing shrink-0 ${className}`}
      {...dragHandleProps}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="4" r="1.2" />
        <circle cx="11" cy="4" r="1.2" />
        <circle cx="5" cy="8" r="1.2" />
        <circle cx="11" cy="8" r="1.2" />
        <circle cx="5" cy="12" r="1.2" />
        <circle cx="11" cy="12" r="1.2" />
      </svg>
    </button>
  );
}
