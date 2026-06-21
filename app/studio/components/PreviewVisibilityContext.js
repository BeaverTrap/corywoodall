'use client';

import { createContext, useContext } from 'react';

const PreviewVisibilityContext = createContext(true);

export function PreviewVisibilityProvider({ showPreview, children }) {
  return (
    <PreviewVisibilityContext.Provider value={showPreview}>{children}</PreviewVisibilityContext.Provider>
  );
}

export function useShowPreview() {
  return useContext(PreviewVisibilityContext);
}
