import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useDetailPageTutorialStore = create(
    persist(
        (set) => ({
            hasSeenTutorial: false,
            setHasSeenTutorial: () => set({ hasSeenTutorial: true }),
            resetTutorialState: () => set({ hasSeenTutorial: false }),
        }),
        {
            name: 'tutorial-state',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
