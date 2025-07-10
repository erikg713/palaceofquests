// stores/usePiUserStore.ts
import { create } from "zustand"

interface PiUserStore {
  username: string | null
  setUsername: (username: string) => void
  clear: () => void
}

export const usePiUserStore = create<PiUserStore>((set) => ({
  username: null,
  setUsername: (username) => set({ username }),
  clear: () => set({ username: null }),
}))
