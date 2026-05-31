import client from './client'
import type { Post, Comment } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(raw: any): Post {
  return {
    ...raw,
    likesCount: raw.likesCount ?? raw.likeCount ?? 0,
    commentsCount: raw.commentsCount ?? raw.commentCount ?? 0,
    isLiked: raw.isLiked ?? raw.likedByMe ?? false,
    authorIsFollowedByMe: raw.authorIsFollowedByMe ?? false,
  }
}

export const getFeedPosts = async (): Promise<Post[]> => {
  const { data } = await client.get<{ posts: unknown[] }>('/posts/feed')
  return data.posts.map(mapPost)
}

export const getExplorePosts = async (page = 1): Promise<{ posts: Post[]; hasMore: boolean }> => {
  const { data } = await client.get<{ posts: unknown[]; pagination: { hasMore: boolean } }>('/posts/explore', { params: { page } })
  return { posts: data.posts.map(mapPost), hasMore: data.pagination.hasMore }
}

export const getUserPosts = async (username: string): Promise<Post[]> => {
  const { data } = await client.get<unknown[]>(`/posts/user/${username}`)
  return data.map(mapPost)
}

export const createPost = async (content: string, imageUrl?: string): Promise<Post> => {
  const { data } = await client.post<unknown>('/posts', { content, imageUrl })
  return mapPost(data)
}

export const deletePost = async (postId: string): Promise<void> => {
  await client.delete(`/posts/${postId}`)
}

export const likePost = async (postId: string): Promise<void> => {
  await client.post(`/posts/${postId}/like`)
}

export const unlikePost = async (postId: string): Promise<void> => {
  await client.delete(`/posts/${postId}/like`)
}

export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
  await client.delete(`/posts/${postId}/comments/${commentId}`)
}

export const getComments = async (postId: string): Promise<Comment[]> => {
  const { data } = await client.get<Comment[]>(`/posts/${postId}/comments`)
  return data
}

export const addComment = async (postId: string, content: string): Promise<Comment> => {
  const { data } = await client.post<Comment>(`/posts/${postId}/comments`, { content })
  return data
}
