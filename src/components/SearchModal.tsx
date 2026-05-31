import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from './ui/Avatar'
import { FollowButton } from './FollowButton'
import { searchUsers } from '../api/users'
import { useAuthStore } from '../store/authStore'
import type { User } from '../types'

interface SearchModalProps {
  onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const { user: currentUser } = useAuthStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    setTimeout(() => inputRef.current?.focus(), 50)
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) {
      setResults([])
      setSearched(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchUsers(query.trim())
        setResults(data)
        setSearched(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bz-card border border-bz-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-bz-surface">
          <svg className="w-5 h-5 text-bz-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar usuários..."
            className="flex-1 bg-transparent outline-none text-bz-white placeholder-bz-white/25 font-grotesk text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-bz-white/30 hover:text-bz-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col divide-y divide-bz-surface">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-bz-surface flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-bz-surface rounded w-32" />
                    <div className="h-3 bg-bz-surface rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-bz-surface">
              {results.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-bz-surface/40 transition-colors">
                  <Link
                    to={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <Avatar src={user.avatarUrl} name={user.name} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-bz-white truncate">{user.name}</p>
                      <p className="text-xs font-mono text-bz-white/40 truncate">@{user.username}</p>
                    </div>
                  </Link>
                  {currentUser?.username !== user.username && (
                    <FollowButton
                      username={user.username}
                      isFollowing={user.isFollowing ?? false}
                      size="sm"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : searched && query.trim().length >= 2 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-mono text-bz-white/30">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-mono text-bz-white/20">Digite pelo menos 2 caracteres</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
