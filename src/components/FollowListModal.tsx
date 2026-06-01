import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from './ui/Avatar'
import { FollowButton } from './FollowButton'
import { getFollowers, getFollowing, type FollowUser } from '../api/users'
import { useAuthStore } from '../store/authStore'

interface FollowListModalProps {
  username: string
  mode: 'followers' | 'following'
  onClose: () => void
}

export const FollowListModal: React.FC<FollowListModalProps> = ({ username, mode, onClose }) => {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<FollowUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fn = mode === 'followers' ? getFollowers : getFollowing
    fn(username)
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [username, mode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bz-card border border-bz-surface rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col shadow-2xl shadow-black/60 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-bz-surface flex-shrink-0">
          <h2 className="font-syne font-bold text-base text-bz-white">
            {mode === 'followers' ? 'Seguidores' : 'Seguindo'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-bz-white/40 hover:text-bz-white hover:bg-bz-surface transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-bz-white/40 text-sm">
              Carregando...
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-bz-white/30 text-sm font-mono">
              {mode === 'followers' ? 'Nenhum seguidor ainda' : 'Não está seguindo ninguém'}
            </div>
          ) : (
            users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-bz-surface/40 transition-colors">
                <Link to={`/profile/${u.username}`} onClick={onClose} className="flex-shrink-0">
                  <Avatar src={u.avatarUrl} name={u.name} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${u.username}`} onClick={onClose}>
                    <p className="text-sm font-semibold text-bz-white hover:text-bz-electric transition-colors truncate">
                      {u.name}
                    </p>
                    <p className="text-xs font-mono text-bz-white/40 truncate">@{u.username}</p>
                  </Link>
                </div>
                {currentUser && currentUser.username !== u.username && (
                  <FollowButton username={u.username} isFollowing={u.isFollowing ?? false} size="sm" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
