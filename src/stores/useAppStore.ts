import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  soundEnabled: boolean;
  bgmEnabled: boolean;

  setSoundEnabled: (enable: boolean) => void;
  setBgmEnabled: (enable: boolean) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      bgmEnabled: true,

      setSoundEnabled: (enable) => set(() => ({ soundEnabled: enable })),
      setBgmEnabled: (enable) => set(() => ({ bgmEnabled: enable })),
    }),
    {
      name: "tongue-twister-app-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAppStore;
