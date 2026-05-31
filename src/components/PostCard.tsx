import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from './ui/Avatar'
import { FollowButton } from './FollowButton'
import { likePost, unlikePost, deletePost } from '../api/posts'
import { useAuthStore } from '../store/authStore'
import { CommentSection } from './CommentSection'
import type { Post } from '../types'

interface PostCardProps {
  post: Post
  onDelete?: (postId: string) => void
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user: currentUser } = useAuthStore()
  const [liked, setLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [likeLoading, setLikeLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0)
  const menuRef = useRef<HTMLDivElement>(null)

  const isOwn = currentUser?.id === post.author.id

  useEffect(() => {
    setLiked(post.isLiked ?? false)
    setLikesCount(post.likesCount ?? 0)
    setCommentsCount(post.commentsCount ?? 0)
  }, [post.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLike = async () => {
    if (likeLoading) return
    setLikeLoading(true)
    try {
      if (liked) {
        await unlikePost(post.id)
        setLiked(false)
        setLikesCount((c) => Math.max(0, c - 1))
      } else {
        await likePost(post.id)
        setLiked(true)
        setLikesCount((c) => c + 1)
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (!liked && status === 409) {
        // Server says already liked — sync state
        setLiked(true)
      } else {
        setLiked(post.isLiked ?? false)
        setLikesCount(post.likesCount ?? 0)
      }
    } finally {
      setLikeLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleting) return
    setMenuOpen(false)
    setDeleting(true)
    try {
      await deletePost(post.id)
      onDelete?.(post.id)
    } catch {
      setDeleting(false)
    }
  }

  if (deleting) return null

  return (
    <article className="bg-bz-card border border-bz-surface rounded-xl p-5 hover:border-bz-electric/20 transition-all duration-300 animate-slide-up">
      {/* Author row */}
      <div className="flex items-start gap-3 mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <Avatar src={post.author.avatarUrl} name={post.author.name} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/profile/${post.author.username}`}
              className="font-semibold text-bz-white hover:text-bz-electric transition-colors duration-150 truncate"
            >
              {post.author.name}
            </Link>
            <span className="text-bz-white/40 text-sm font-mono truncate">
              @{post.author.username}
            </span>
          </div>
          <span className="text-xs font-mono text-bz-white/30">
            {formatRelativeTime(post.createdAt)}
          </span>
        </div>

        {/* Follow button — visible only for other users' posts */}
        {!isOwn && currentUser && (
          <FollowButton
            username={post.author.username}
            isFollowing={post.authorIsFollowedByMe ?? false}
            size="sm"
          />
        )}

        {/* 3-dot menu */}
        {isOwn && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-bz-white/30 hover:text-bz-white hover:bg-bz-surface transition-colors cursor-pointer"
            >
              <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-bz-card border border-bz-surface rounded-xl shadow-xl shadow-black/50 overflow-hidden z-20 animate-fade-in">
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-bz-pink hover:bg-bz-pink/10 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Apagar post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <p className="text-bz-white/85 text-sm leading-relaxed whitespace-pre-wrap break-words mb-4">
          {post.content}
        </p>
      )}

      {/* Image */}
      {post.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-bz-surface aspect-[4/5]">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-bz-surface">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={[
            'flex items-center gap-1.5 text-sm font-mono transition-all duration-200 cursor-pointer rounded-lg px-2 py-1 -mx-2',
            liked ? 'text-bz-pink' : 'text-bz-white/40 hover:text-bz-pink',
            likeLoading ? 'opacity-50' : '',
          ].filter(Boolean).join(' ')}
        >
          <svg
            style={{ width: '18px', height: '18px' }}
            viewBox="0 0 24 24"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setCommentsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 text-sm font-mono text-bz-white/40 hover:text-bz-electric transition-colors duration-200 cursor-pointer rounded-lg px-2 py-1 -mx-2"
        >
          <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{commentsCount}</span>
        </button>
      </div>

      {commentsOpen && (
        <CommentSection
          postId={post.id}
          postAuthorId={post.author.id}
          onClose={() => setCommentsOpen(false)}
          onCommentAdded={() => setCommentsCount((c) => c + 1)}
          onCommentDeleted={() => setCommentsCount((c) => Math.max(0, c - 1))}
        />
      )}
    </article>
  )
}
