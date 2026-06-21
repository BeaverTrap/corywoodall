'use client';

import { useState } from 'react';
import { reorderItems } from '@/lib/studio/reorderItems';

export function DragHandle({ dragHandleProps, className = '' }) {
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

export default function SortableList({
  items,
  onReorder,
  renderItem,
  getItemKey,
  className = 'space-y-3',
}) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const finishDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      finishDrag();
      return;
    }

    onReorder(reorderItems(items, dragIndex, index));
    finishDrag();
  };

  return (
    <div className={className}>
      {items.map((item, index) => {
        const dragHandleProps = {
          draggable: true,
          onDragStart: (event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', String(index));
            setDragIndex(index);
          },
          onDragEnd: finishDrag,
        };

        const isDragging = dragIndex === index;
        const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;

        return (
          <div
            key={getItemKey(item, index)}
            onDragOver={(event) => {
              event.preventDefault();
              setOverIndex(index);
            }}
            onDrop={handleDrop(index)}
            className={`transition-shadow ${isDragging ? 'opacity-50' : ''} ${
              isOver ? 'ring-2 ring-black/20 rounded-lg' : ''
            }`}
          >
            {renderItem(item, index, { dragHandleProps })}
          </div>
        );
      })}
    </div>
  );
}
