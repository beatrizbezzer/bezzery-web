import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from './ui/Avatar'
import { FollowButton } from './FollowButton'
import { getSuggestions } from '../api/users'
import type { Suggestion } from '../api/users'

export const SuggestionsSection: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSuggestions()
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false))
  }, [])

  const handleFollowed = (username: string) => {
    setSuggestions((prev) => prev.filter((u) => u.username !== username))
  }

  if (!loading && suggestions.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-bz-surface" />
        <span className="text-xs font-mono text-bz-white/25 uppercase tracking-wider">Sugestões para você</span>
        <div className="flex-1 h-px bg-bz-surface" />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-36 bg-bz-card border border-bz-surface rounded-xl p-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-bz-surface mx-auto mb-2" />
                <div className="h-3 bg-bz-surface rounded w-3/4 mx-auto mb-1" />
                <div className="h-2.5 bg-bz-surface rounded w-1/2 mx-auto mb-3" />
                <div className="h-7 bg-bz-surface rounded-lg" />
              </div>
            ))
          : suggestions.map((user) => (
              <div key={user.id} className="flex-shrink-0 w-36 bg-bz-card border border-bz-surface rounded-xl p-3 flex flex-col items-center text-center hover:border-bz-electric/20 transition-colors">
                <Link to={`/profile/${user.username}`} className="mb-2">
                  <Avatar src={user.avatarUrl} name={user.name} size="md" />
                </Link>
                <Link to={`/profile/${user.username}`} className="w-full">
                  <p className="text-sm font-semibold text-bz-white truncate">{user.name}</p>
                  <p className="text-xs font-mono text-bz-white/35 truncate mb-2">@{user.username}</p>
                </Link>
                <FollowButton
                  username={user.username}
                  isFollowing={false}
                  size="sm"
                  onToggle={(following) => { if (following) handleFollowed(user.username) }}
                />
              </div>
            ))}
      </div>
    </div>
  )
}
