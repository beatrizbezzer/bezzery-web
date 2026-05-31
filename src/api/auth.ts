import { supabase } from '../lib/supabase'
import client from './client'
import type { User } from '../types'

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const loginWithSupabase = async (login: string, password: string) => {
  let email = login.trim()

  if (!isEmail(email)) {
    // Resolve username → email via backend
    const { data } = await client.post<{ email: string }>('/auth/lookup', { username: email })
    email = data.email
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  if (!data.session) throw new Error('No session returned')

  const { data: syncData } = await client.post<User | { needsSetup: true }>('/auth/sync', {})

  if ('needsSetup' in syncData) {
    return { user: null, token: data.session.access_token, needsSetup: true }
  }

  return { user: syncData, token: data.session.access_token, needsSetup: false }
}

export const registerWithSupabase = async (
  email: string,
  password: string,
  username: string,
  name: string
) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)

  if (!data.session) {
    return { requiresConfirmation: true, user: null, token: null }
  }

  const { data: profile } = await client.post<User>('/auth/sync', { username, name })
  return { requiresConfirmation: false, user: profile, token: data.session.access_token }
}

export const logoutFromSupabase = async () => {
  await supabase.auth.signOut()
}

export const getMe = async () => {
  const { data } = await client.get<User>('/auth/me')
  return data
}
