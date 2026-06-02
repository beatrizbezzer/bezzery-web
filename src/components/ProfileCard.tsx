import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FollowListModal } from './FollowListModal'
import { useTranslation } from 'react-i18next'
import { Avatar } from './ui/Avatar'
import { Tag, autoVariant } from './ui/Tag'
import { FollowButton } from './FollowButton'
import { CardStickerLayer, CardOverlayLayer, EmoFrameDecorations } from './CardDecorationLayers'
import { getBorderShadow } from '../lib/cardDecorations'
import type { User } from '../types'

interface ProfileCardProps {
  user: User
  isOwnProfile?: boolean
  onFollowToggle?: (isFollowing: boolean) => void
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  isOwnProfile = false,
  onFollowToggle,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [followModal, setFollowModal] = useState<'followers' | 'following' | null>(null)

  const isGradientBorder = user.cardBorder === 'gradient-vp'
  const isEmoFrame = user.cardBorder === 'emo-frame'
  const borderShadow = getBorderShadow(user.cardBorder)

  const cardInner = (
    <div
      className={`relative bg-bz-card overflow-hidden ${
        isEmoFrame ? 'rounded-[22px]' :
        isGradientBorder ? 'rounded-xl' :
        'rounded-xl border border-bz-surface'
      }`}
    >
      {/* Banner */}
      <div className="relative h-44 sm:h-56">
        {user.bannerUrl ? (
          <img
            src={user.bannerUrl}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bz-violet via-bz-pink to-bz-electric opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bz-card via-transparent to-transparent" />
      </div>

      {/* Profile info */}
      <div className="px-6 pb-6">
        {/* Avatar overlapping banner */}
        <div className="flex items-end justify-between -mt-14 mb-5">
          <div className="ring-4 ring-bz-card rounded-full relative z-10">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <Avatar src={user.avatarUrl} name={user.name} size="xl" className="w-28 h-28 text-4xl" />
            )}
          </div>
          {!isOwnProfile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/messages?with=${user.id}`)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-bz-surface text-bz-white/50 hover:text-bz-electric hover:border-bz-electric/40 transition-all duration-200 cursor-pointer"
                title="Enviar mensagem"
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <FollowButton
                username={user.username}
                isFollowing={user.isFollowing ?? false}
                onToggle={onFollowToggle}
                size="md"
              />
            </div>
          )}
          {isOwnProfile && (
            <Link
              to="/settings"
              className="px-5 py-2.5 rounded-lg text-sm font-grotesk font-semibold border border-bz-surface text-bz-white/60 hover:text-bz-white hover:border-bz-electric/40 transition-all duration-200"
            >
              {t('profile.edit_profile')}
            </Link>
          )}
        </div>

        {/* Name & handle */}
        <div className="mb-3">
          <h2 className="font-syne font-bold text-2xl text-bz-white leading-tight">{user.name}</h2>
          <span className="text-base font-mono text-bz-white/40">@{user.username}</span>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-base text-bz-white/70 leading-relaxed mb-4">{user.bio}</p>
        )}

        {/* Tags */}
        {user.tags && user.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {user.tags.map((tag, i) => (
              <Tag key={tag} variant={autoVariant(i)}>
                {tag}
              </Tag>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-8 pt-4 border-t border-bz-surface">
          <div className="text-center">
            <span className="block font-syne font-bold text-xl text-bz-white">
              {user.postsCount ?? 0}
            </span>
            <span className="text-xs font-mono text-bz-white/40 uppercase tracking-wider">{t('profile.posts')}</span>
          </div>
          <button
            className="text-center cursor-pointer group"
            onClick={() => setFollowModal('followers')}
          >
            <span className="block font-syne font-bold text-xl text-bz-white group-hover:text-bz-electric transition-colors">
              {user.followersCount ?? 0}
            </span>
            <span className="text-xs font-mono text-bz-white/40 uppercase tracking-wider group-hover:text-bz-electric/60 transition-colors">{t('profile.followers')}</span>
          </button>
          <button
            className="text-center cursor-pointer group"
            onClick={() => setFollowModal('following')}
          >
            <span className="block font-syne font-bold text-xl text-bz-white group-hover:text-bz-electric transition-colors">
              {user.followingCount ?? 0}
            </span>
            <span className="text-xs font-mono text-bz-white/40 uppercase tracking-wider group-hover:text-bz-electric/60 transition-colors">{t('profile.following')}</span>
          </button>
        </div>
      </div>

      {/* Overlay decoration (inside card so it clips to rounded corners) */}
      {user.cardOverlay && <CardOverlayLayer id={user.cardOverlay} />}
    </div>
  )

  return (
    <>
      <div className="relative">
        {/* Border wrapper */}
        {isEmoFrame ? (
          <div style={{
            borderRadius: '24px',
            boxShadow: [
              '0 0 0 2px #8b5cf6',
              '0 0 0 4px rgba(0,0,0,0.95)',
              '0 0 0 6px #6d28d9',
              '0 0 28px rgba(109,40,217,0.55)',
              '0 0 70px rgba(109,40,217,0.18)',
            ].join(', '),
          }}>
            {cardInner}
          </div>
        ) : isGradientBorder ? (
          <div className="p-[2px] rounded-xl" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
            {cardInner}
          </div>
        ) : borderShadow ? (
          <div style={{ borderRadius: '12px', boxShadow: borderShadow }}>
            {cardInner}
          </div>
        ) : (
          cardInner
        )}

        {/* Sticker decoration (outside card so it can overflow edges) */}
        {user.cardSticker && <CardStickerLayer id={user.cardSticker} />}
        {isEmoFrame && <EmoFrameDecorations />}
      </div>

      {followModal && (
        <FollowListModal
          username={user.username}
          mode={followModal}
          onClose={() => setFollowModal(null)}
        />
      )}
    </>
  )
}
