import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Avatar } from './ui/Avatar'
import { getComments, addComment, deleteComment } from '../api/posts'
import { useAuthStore } from '../store/authStore'
import type { Comment } from '../types'

interface CommentSectionProps {
  postId: string
  postAuthorId: string
  onClose?: () => void
  onCommentAdded?: () => void
  onCommentDeleted?: () => void
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, postAuthorId, onClose, onCommentAdded, onCommentDeleted }) => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getComments(postId)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false))
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return
    setSubmitting(true)
    try {
      const comment = await addComment(postId, newComment.trim())
      setComments((prev) => [...prev, comment])
      setNewComment('')
      onCommentAdded?.()
    } catch {
      // silent
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit(e as unknown as React.FormEvent)
  }

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId)
    try {
      await deleteComment(postId, commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      setConfirmId(null)
      onCommentDeleted?.()
    } catch {
      // silent
    } finally {
      setDeletingId(null)
    }
  }

  const canDelete = (comment: Comment) => {
    if (!user) return false
    return comment.author.id === user.id || postAuthorId === user.id
  }

  return (
    <div className="bg-bz-card border border-bz-surface rounded-xl mt-2 animate-slide-up overflow-hidden">
      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="w-5 h-5 border-2 border-bz-electric border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length > 0 ? (
        <div className="flex flex-col divide-y divide-bz-surface/60 px-4 pt-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 py-3 group">
              <Link to={`/profile/${comment.author.username}`} className="flex-shrink-0">
                <Avatar src={comment.author.avatarUrl} name={comment.author.name} size="xs" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <Link to={`/profile/${comment.author.username}`} className="text-sm font-semibold text-bz-white leading-snug hover:text-bz-electric transition-colors">{comment.author.name}</Link>
                  <span className="text-xs font-mono text-bz-white/25">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-bz-white/70 leading-relaxed">{comment.content}</p>
              </div>
              {canDelete(comment) && (
                confirmId === comment.id ? (
                  <div className="flex items-center gap-2 flex-shrink-0 self-start mt-0.5">
                    <span className="text-xs font-mono text-bz-white/50">Apagar?</span>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="text-xs font-semibold text-bz-pink hover:text-bz-pink/80 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs font-semibold text-bz-white/40 hover:text-bz-white transition-colors cursor-pointer"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(comment.id)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-bz-white/20 hover:text-bz-pink transition-all duration-150 cursor-pointer self-start mt-0.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      ) : null}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5 px-3 py-2.5 border-t border-bz-surface/60">
        <Avatar src={user?.avatarUrl} name={user?.name} size="xs" />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('post.add_comment')}
          className="flex-1 bg-transparent outline-none text-sm text-bz-white placeholder-bz-white/25 font-grotesk"
        />
        {newComment.trim() && (
          <button
            type="submit"
            disabled={submitting}
            className="text-bz-electric text-sm font-semibold hover:text-bz-electric/80 transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? '...' : 'Enviar'}
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-bz-white/25 hover:text-bz-white/60 transition-colors cursor-pointer ml-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>
    </div>
  )
}
