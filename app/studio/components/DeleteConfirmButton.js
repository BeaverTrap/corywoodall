'use client';

import { useState } from 'react';

export default function DeleteConfirmButton({
  label = 'Delete',
  confirmMessage,
  onConfirm,
  disabled = false,
}) {
  const [working, setWorking] = useState(false);

  const handleClick = async () => {
    if (!window.confirm(confirmMessage)) return;

    setWorking(true);
    try {
      await onConfirm();
    } finally {
      setWorking(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || working}
      className="px-4 py-2 rounded-lg border border-red-300 text-red-800 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
    >
      {working ? 'Deleting...' : label}
    </button>
  );
}
