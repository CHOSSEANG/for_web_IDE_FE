import { create } from "zustand";

type AccountModalState = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useAccountModal = create<AccountModalState>((set) => {
  console.log("zustand store initialized");
  return {
    open: false,
    openModal: () => set({ open: true }),
    closeModal: () => set({ open: false }),
  };
});