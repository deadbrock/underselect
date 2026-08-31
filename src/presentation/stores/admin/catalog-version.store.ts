'use client';

import { create } from 'zustand';

interface CatalogVersionState {
  isDialogOpen: boolean;
  webCatalogExpanded: boolean;
}

interface CatalogVersionActions {
  openDialog: () => void;
  closeDialog: () => void;
  expandWebCatalog: () => void;
  collapseWebCatalog: () => void;
}

export type CatalogVersionStore = CatalogVersionState & CatalogVersionActions;

export const useCatalogVersionStore = create<CatalogVersionStore>((set) => ({
  isDialogOpen: false,
  webCatalogExpanded: false,
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),
  expandWebCatalog: () =>
    set({ isDialogOpen: false, webCatalogExpanded: true }),
  collapseWebCatalog: () =>
    set({ isDialogOpen: false, webCatalogExpanded: false }),
}));
