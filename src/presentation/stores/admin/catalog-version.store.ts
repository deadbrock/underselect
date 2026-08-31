'use client';

import { create } from 'zustand';

const CATALOG_VERSION_STORAGE_KEY = 'underselect-catalog-version';

export type CatalogVersionChoice = 'web' | 'mobile';

function readStoredVersion(): CatalogVersionChoice | null {
  if (typeof window === 'undefined') return null;
  const value = window.sessionStorage.getItem(CATALOG_VERSION_STORAGE_KEY);
  if (value === 'web' || value === 'mobile') return value;
  return null;
}

function writeStoredVersion(version: CatalogVersionChoice) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(CATALOG_VERSION_STORAGE_KEY, version);
}

interface CatalogVersionState {
  isDialogOpen: boolean;
  webCatalogExpanded: boolean;
  chosenVersion: CatalogVersionChoice | null;
  autoPrompted: boolean;
}

interface CatalogVersionActions {
  openDialog: () => void;
  closeDialog: () => void;
  expandWebCatalog: () => void;
  collapseWebCatalog: () => void;
  hydrateFromStorage: () => void;
  markAutoPrompted: () => void;
}

export type CatalogVersionStore = CatalogVersionState & CatalogVersionActions;

export const useCatalogVersionStore = create<CatalogVersionStore>((set) => ({
  isDialogOpen: false,
  webCatalogExpanded: false,
  chosenVersion: null,
  autoPrompted: false,
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),
  expandWebCatalog: () => {
    writeStoredVersion('web');
    set({
      isDialogOpen: false,
      webCatalogExpanded: true,
      chosenVersion: 'web',
    });
  },
  collapseWebCatalog: () => {
    writeStoredVersion('mobile');
    set({
      isDialogOpen: false,
      webCatalogExpanded: false,
      chosenVersion: 'mobile',
    });
  },
  hydrateFromStorage: () => {
    const chosenVersion = readStoredVersion();
    set({
      chosenVersion,
      webCatalogExpanded: chosenVersion === 'web',
    });
  },
  markAutoPrompted: () => set({ autoPrompted: true }),
}));
