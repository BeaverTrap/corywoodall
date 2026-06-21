'use client';

import { useEffect, useRef } from 'react';

export function useStudioAutoSave({ enabled, isDirty, onAutoSave, delayMs = 5000 }) {
  const savingRef = useRef(false);
  const onAutoSaveRef = useRef(onAutoSave);

  useEffect(() => {
    onAutoSaveRef.current = onAutoSave;
  }, [onAutoSave]);

  useEffect(() => {
    if (!enabled || !isDirty) return undefined;

    const timer = window.setTimeout(async () => {
      if (savingRef.current) return;

      savingRef.current = true;
      try {
        await onAutoSaveRef.current();
      } finally {
        savingRef.current = false;
      }
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [enabled, isDirty, delayMs]);
}
