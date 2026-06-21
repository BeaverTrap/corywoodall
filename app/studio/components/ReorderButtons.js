export default function ReorderButtons({
  onMoveUp,
  onMoveDown,
  disableUp = false,
  disableDown = false,
  onRemove,
  removeLabel = 'Remove',
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="text-sm px-2 py-1 border rounded disabled:opacity-40"
        disabled={disableUp}
        onClick={onMoveUp}
      >
        Move up
      </button>
      <button
        type="button"
        className="text-sm px-2 py-1 border rounded disabled:opacity-40"
        disabled={disableDown}
        onClick={onMoveDown}
      >
        Move down
      </button>
      {onRemove ? (
        <button type="button" className="text-sm text-red-700" onClick={onRemove}>
          {removeLabel}
        </button>
      ) : null}
    </div>
  );
}
