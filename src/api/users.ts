import client from './client'
import type { User } from '../types'

export const searchUsers = async (q: string): Promise<User[]> => {
  const { data } = await client.get<{ users: User[] }>('/users/search', { params: { q } })
  return data.users
}

export interface Suggestion {
  id: string
  username: string
  name: string
  bio?: string
  avatarUrl?: string
  followersCount: number
}

export const getSuggestions = async (): Promise<Suggestion[]> => {
  const { data } = await client.get<{ suggestions: Suggestion[] }>('/follows/suggestions')
  return data.suggestions
}

export const getUserProfile = async (username: string): Promise<User> => {
  const { data } = await client.get<User>(`/users/${username}`)
  return data
}

export const followUser = async (username: string): Promise<void> => {
  await client.post(`/users/${username}/follow`)
}

export const unfollowUser = async (username: string): Promise<void> => {
  await client.delete(`/users/${username}/follow`)
}

export interface UpdateProfilePayload {
  name?: string
  bio?: string
  avatarUrl?: string
  bannerUrl?: string
  bgColor?: string | null
  profileEffect?: string | null
  tags?: string[]
  country?: string
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<User> => {
  const { data } = await client.put<User>('/users/me', payload)
  return data
}
