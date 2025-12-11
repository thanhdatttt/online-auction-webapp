import { create } from 'zustand';

const useTimeStore = create((set, get) => ({
  now: new Date(),

  startClock: () => {
    if (get().intervalId) return;

    const id = setInterval(() => {
      set({ now: new Date() });
    }, 1000);

    set({ intervalId: id });
  },

  stopClock: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ intervalId: null });
  }
}));

export default useTimeStore;