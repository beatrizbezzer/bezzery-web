import { create } from 'zustand'
import type { User } from '../types'
import { supabase } from '../lib/supabase'
import { getMe } from '../api/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  logout: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: User, token: string) => {
    set({ user, token, isAuthenticated: true, isLoading: false })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, token: null, isAuthenticated: false, isLoading: false })
  },

  setUser: (user: User) => {
    set({ user })
  },
}))

// Restore session on app load
supabase.auth.getSession().then(async ({ data: { session } }) => {
  if (session) {
    try {
      const profile = await getMe()
      useAuthStore.getState().setAuth(profile, session.access_token)
    } catch {
      useAuthStore.setState({ isLoading: false })
    }
  } else {
    useAuthStore.setState({ isLoading: false })
  }
})

// Keep auth state in sync with Supabase
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || !session) {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }
})
