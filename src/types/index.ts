export interface User {
  id: string
  username: string
  name: string
  email: string
  bio?: string
  avatarUrl?: string
  bannerUrl?: string
  bgColor?: string | null
  tags?: string[]
  country?: string
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing?: boolean
  createdAt: string
}

export interface Post {
  id: string
  content: string
  imageUrl?: string
  author: User
  likesCount: number
  commentsCount: number
  isLiked: boolean
  authorIsFollowedByMe?: boolean
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  status?: number
}

export interface NotificationActor {
  id: string
  username: string
  name: string
  avatarUrl?: string
}

export interface NotificationPost {
  id: string
  imageUrl?: string
  content: string
}

export interface Notification {
  id: string
  type: 'FOLLOW' | 'LIKE' | 'COMMENT'
  read: boolean
  createdAt: string
  commentContent?: string
  actor: NotificationActor
  post?: NotificationPost | null
  actorIsFollowedByMe: boolean
}
