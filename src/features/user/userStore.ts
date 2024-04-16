import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { UserKeysNames } from './types'

type UserState = {
  keyOpenAIapi: string
  keyTogetherAIapi: string
  updateKey: (key: UserKeysNames, value: string) => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      set => ({
        keyOpenAIapi: '',
        keyTogetherAIapi: '',
        updateKey: (key: UserKeysNames, value: string) => set(() => ({ [key]: value })),
      }),
      { name: 'userStore' },
    ),
  ),
)
