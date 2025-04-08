import { create } from "zustand";

interface AppState {
  isHeaderVisible: boolean;
  toggleHeader: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isHeaderVisible: false, // 👀 скрыта по умолчанию
  toggleHeader: () => set((state) => ({ isHeaderVisible: !state.isHeaderVisible })),
}));
