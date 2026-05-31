import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/Button'
import { followUser, unfollowUser } from '../api/users'

interface FollowButtonProps {
  username: string
  isFollowing: boolean
  onToggle?: (isFollowing: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  username,
  isFollowing: initialFollowing,
  onToggle,
  size = 'sm',
}) => {
  const { t } = useTranslation()
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleToggle = async () => {
    if (loading) return
    setLoading(true)
    try {
      if (following) {
        await unfollowUser(username)
        setFollowing(false)
        onToggle?.(false)
      } else {
        await followUser(username)
        setFollowing(true)
        onToggle?.(true)
      }
    } catch {
      // revert on error - no-op, state stays same
    } finally {
      setLoading(false)
    }
  }

  if (following) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={[
          'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-grotesk font-semibold transition-all duration-200 cursor-pointer border',
          hovered
            ? 'bg-bz-pink/10 border-bz-pink text-bz-pink'
            : 'bg-bz-electric/10 border-bz-electric text-bz-electric',
          loading ? 'opacity-50 cursor-not-allowed' : '',
          size === 'lg' ? 'px-6 py-2.5 text-base' : size === 'md' ? 'px-5 py-2' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : hovered ? (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {t('profile.unfollow')}
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('profile.following')}
          </>
        )}
      </button>
    )
  }

  return (
    <Button
      variant="primary"
      size={size}
      loading={loading}
      onClick={handleToggle}
    >
      {t('profile.follow')}
    </Button>
  )
}
