'use client';

import { useState } from 'react';
import { reorderItems } from '@/lib/studio/reorderItems';

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
