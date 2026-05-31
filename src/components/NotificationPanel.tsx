import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from './ui/Avatar'
import { FollowButton } from './FollowButton'
import { getNotifications, markNotificationsRead } from '../api/notifications'
import type { Notification } from '../types'

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

const TypeIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  const base = 'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center'
  if (type === 'FOLLOW') return (
    <span className={`${base} bg-bz-violet`}>
      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
      </svg>
    </span>
  )
  if (type === 'LIKE') return (
    <span className={`${base} bg-bz-pink`}>
      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" />
      </svg>
    </span>
  )
  return (
    <span className={`${base} bg-bz-electric`}>
      <svg className="w-2.5 h-2.5 text-bz-black" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    </span>
  )
}

function NotificationText({ n }: { n: Notification }) {
  if (n.type === 'FOLLOW') return <span>começou a seguir você</span>
  if (n.type === 'LIKE') return <span>curtiu sua foto</span>
  return (
    <span>comentou: <span className="text-bz-white/50 italic">"{n.commentContent}"</span></span>
  )
}

interface Props {
  onClose: () => void
  onRead: () => void
}

export const NotificationPanel: React.FC<Props> = ({ onClose, onRead }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications()
      .then(({ notifications }) => setNotifications(notifications))
      .finally(() => setLoading(false))
    markNotificationsRead().then(onRead)
  }, [onRead])

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-bz-card border border-bz-surface rounded-xl shadow-xl shadow-black/60 overflow-hidden z-50 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-bz-surface">
        <span className="text-sm font-semibold text-bz-white">Notificações</span>
        <button onClick={onClose} className="text-bz-white/40 hover:text-bz-white transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-1 p-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                <div className="w-9 h-9 rounded-full bg-bz-surface flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-bz-surface rounded w-3/4" />
                  <div className="h-2.5 bg-bz-surface rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-bz-surface flex items-center justify-center">
              <svg className="w-5 h-5 text-bz-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-xs font-mono text-bz-white/30">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="p-2 flex flex-col gap-0.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={[
                  'flex items-center gap-2 p-2.5 rounded-lg transition-colors duration-150',
                  !n.read ? 'bg-bz-electric/5' : '',
                ].join(' ')}
              >
                {/* Avatar + text — clicável, navega para perfil */}
                <Link
                  to={`/profile/${n.actor.username}`}
                  onClick={onClose}
                  className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                >
                  <div className="relative flex-shrink-0">
                    <Avatar src={n.actor.avatarUrl} name={n.actor.name} size="sm" />
                    <TypeIcon type={n.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-bz-white/85 leading-snug">
                      <span className="font-semibold text-bz-white">{n.actor.name}</span>{' '}
                      <NotificationText n={n} />
                    </p>
                    <span className="text-[10px] font-mono text-bz-white/30">{timeAgo(n.createdAt)}</span>
                  </div>
                </Link>

                {/* Direita: thumbnail do post OU botão seguir de volta */}
                {n.type === 'FOLLOW' ? (
                  <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <FollowButton
                      username={n.actor.username}
                      isFollowing={n.actorIsFollowedByMe}
                      size="sm"
                    />
                  </div>
                ) : n.post?.imageUrl ? (
                  <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 border border-bz-surface">
                    <img src={n.post.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
