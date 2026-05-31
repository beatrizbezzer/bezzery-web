import { create } from 'zustand'
import type { Post } from '../types'

interface FeedState {
  newPost: Post | null
  publishPost: (post: Post) => void
  clearNewPost: () => void
}

export const useFeedStore = create<FeedState>((set) => ({
  newPost: null,
  publishPost: (post) => set({ newPost: post }),
  clearNewPost: () => set({ newPost: null }),
}))
