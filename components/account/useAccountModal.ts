import { create } from "zustand";

type AccountModalState = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useAccountModal = create<AccountModalState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
