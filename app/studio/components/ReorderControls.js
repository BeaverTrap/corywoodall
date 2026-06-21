import { DragHandle } from '@/app/studio/components/SortableList';

export default function ReorderControls({ dragHandleProps, onRemove, removeLabel = 'Remove' }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DragHandle dragHandleProps={dragHandleProps} />
      {onRemove ? (
        <button type="button" className="text-sm text-red-700" onClick={onRemove}>
          {removeLabel}
        </button>
      ) : null}
    </div>
  );
}
