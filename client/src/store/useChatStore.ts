import { create } from 'zustand';

interface ChatStore {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
