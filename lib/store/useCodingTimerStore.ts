import { create } from 'zustand';

interface CodingTimerState {
    currentSessionMs: number;
    isWorking: boolean;
    setCurrentSessionMs: (ms: number) => void;
    setIsWorking: (working: boolean) => void;
    incrementTimer: (ms: number) => void;
    resetTimer: () => void;
}

export const useCodingTimerStore = create<CodingTimerState>((set) => ({
    currentSessionMs: 0,
    isWorking: false,
    setCurrentSessionMs: (ms) => set({ currentSessionMs: ms }),
    setIsWorking: (working) => set({ isWorking: working }),
    incrementTimer: (ms) => set((state) => ({ currentSessionMs: state.currentSessionMs + ms })),
    resetTimer: () => set({ currentSessionMs: 0, isWorking: false }),
}));
