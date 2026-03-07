import { create } from "zustand";
import type { SearchFilters, RiskLevel, AuditStatus } from "./types";

interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  toastMessage: { text: string; type: "success" | "error" | "info" } | null;
  searchQuery: string;
  filters: SearchFilters;
  selectedAuditId: string | null;
  joyrideTour: boolean;
}

interface UIActions {
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
  showToast: (text: string, type: "success" | "error" | "info") => void;
  clearToast: () => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  clearFilters: () => void;
  setSelectedAuditId: (id: string | null) => void;
  startJoyrideTour: () => void;
  endJoyrideTour: () => void;
}

const defaultFilters: SearchFilters = {
  sortBy: "date",
  sortOrder: "desc",
};

export const useUIStore = create<UIState & UIActions>((set) => ({
  // State
  theme: "light",
  sidebarOpen: true,
  toastMessage: null,
  searchQuery: "",
  filters: defaultFilters,
  selectedAuditId: null,
  joyrideTour: false,

  // Actions
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  showToast: (text, type) => set({ toastMessage: { text, type } }),
  clearToast: () => set({ toastMessage: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  clearFilters: () => set({ filters: defaultFilters }),
  setSelectedAuditId: (id) => set({ selectedAuditId: id }),
  startJoyrideTour: () => set({ joyrideTour: true }),
  endJoyrideTour: () => set({ joyrideTour: false }),
}));

interface ReconciliationCache {
  [sessionId: string]: any;
}

interface CacheState {
  reconciliationCache: ReconciliationCache;
  vendorCache: { [gstin: string]: any };
}

interface CacheActions {
  setCachedReconciliation: (sessionId: string, data: any) => void;
  getCachedReconciliation: (sessionId: string) => any;
  clearReconciliationCache: () => void;
  setCachedVendor: (gstin: string, data: any) => void;
  getCachedVendor: (gstin: string) => any;
}

export const useCacheStore = create<CacheState & CacheActions>((set, get) => ({
  // State
  reconciliationCache: {},
  vendorCache: {},

  // Actions
  setCachedReconciliation: (sessionId, data) =>
    set((state) => ({
      reconciliationCache: { ...state.reconciliationCache, [sessionId]: data },
    })),
  getCachedReconciliation: (sessionId) => get().reconciliationCache[sessionId],
  clearReconciliationCache: () => set({ reconciliationCache: {} }),
  setCachedVendor: (gstin, data) =>
    set((state) => ({
      vendorCache: { ...state.vendorCache, [gstin]: data },
    })),
  getCachedVendor: (gstin) => get().vendorCache[gstin],
}));

interface UserPreferences {
  defaultExportFormat: "pdf" | "csv" | "excel";
  showOnboarding: boolean;
  notificationsEnabled: boolean;
  defaultTimeRange: "week" | "month" | "quarter" | "year";
}

interface PreferencesState extends UserPreferences {}

interface PreferencesActions {
  updatePreference: (key: keyof UserPreferences, value: any) => void;
  getPreferences: () => UserPreferences;
}

export const usePreferencesStore = create<PreferencesState & PreferencesActions>((set, get) => {
  const defaultPrefs: UserPreferences = {
    defaultExportFormat: "pdf",
    showOnboarding: true,
    notificationsEnabled: true,
    defaultTimeRange: "month",
  };

  return {
    ...defaultPrefs,
    updatePreference: (key, value) => set({ [key]: value }),
    getPreferences: () => {
      const state = get();
      return {
        defaultExportFormat: state.defaultExportFormat,
        showOnboarding: state.showOnboarding,
        notificationsEnabled: state.notificationsEnabled,
        defaultTimeRange: state.defaultTimeRange,
      };
    },
  };
});
