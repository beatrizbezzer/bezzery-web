import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/Navbar'
import { ProfileCard } from '../components/ProfileCard'
import { PostCard } from '../components/PostCard'
import { getUserProfile } from '../api/users'
import { getUserPosts } from '../api/posts'
import { useAuthStore } from '../store/authStore'
import type { User, Post } from '../types'
import { ProfileEffect } from '../components/ProfileEffect'
import { PROFILE_BACKGROUNDS } from '../lib/profileBackgrounds'

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuthStore()

  const [profile, setProfile] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [notFound, setNotFound] = useState(false)
  useEffect(() => {
    if (!username) return
    setLoadingProfile(true)
    setNotFound(false)

    getUserProfile(username)
      .then((data) => {
        setProfile(data)
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoadingProfile(false))

    setLoadingPosts(true)
    getUserPosts(username)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false))
  }, [username])

  const handleFollowToggle = (isFollowing: boolean) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            isFollowing,
            followersCount: prev.followersCount + (isFollowing ? 1 : -1),
          }
        : prev
    )
  }

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  if (notFound) return <Navigate to="/feed" replace />

  const isOwnProfile = currentUser?.username === username

  // For own profile, decorations come from authStore (always up-to-date after save).
  // For other profiles they come from the API fetch.
  const displayProfile: User | null = profile
    ? isOwnProfile && currentUser
      ? {
          ...profile,
          bgImage: currentUser.bgImage ?? profile.bgImage,
          profileEffect: currentUser.profileEffect ?? profile.profileEffect,
          cardBorder: currentUser.cardBorder ?? profile.cardBorder,
          cardSticker: currentUser.cardSticker ?? profile.cardSticker,
          cardOverlay: currentUser.cardOverlay ?? profile.cardOverlay,
        }
      : profile
    : null

  const bgImageUrl = displayProfile?.bgImage
    ? PROFILE_BACKGROUNDS.find((b) => b.id === displayProfile.bgImage)?.url
    : undefined

  return (
    <div
      className="min-h-screen bg-bz-black"
      style={bgImageUrl ? {
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      } : undefined}
    >
      <Navbar />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {bgImageUrl && <div className="absolute inset-0 bg-bz-black/55" />}
        {!bgImageUrl && <div className="absolute top-24 right-8 w-72 h-72 bg-bz-pink/5 rounded-full blur-3xl" />}
        {!bgImageUrl && <div className="absolute top-96 left-8 w-56 h-56 bg-bz-violet/6 rounded-full blur-3xl" />}
        <ProfileEffect effect={displayProfile?.profileEffect} />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 relative">
        {/* Profile card */}
        {loadingProfile ? (
          <div className="bg-bz-card border border-bz-surface rounded-xl overflow-hidden mb-6 animate-pulse">
            <div className="h-56 bg-bz-surface" />
            <div className="p-6">
              <div className="flex items-end justify-between -mt-14 mb-5">
                <div className="w-28 h-28 rounded-full bg-bz-surface ring-4 ring-bz-card" />
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-bz-surface rounded w-44" />
                <div className="h-4 bg-bz-surface rounded w-28" />
                <div className="h-4 bg-bz-surface rounded w-3/4 mt-2" />
              </div>
            </div>
          </div>
        ) : displayProfile ? (
          <div className="mb-6">
            <ProfileCard
              user={displayProfile}
              isOwnProfile={isOwnProfile}
              onFollowToggle={handleFollowToggle}
            />
          </div>
        ) : null}

        {/* Posts section */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-bz-surface" />
          <span className="text-xs font-mono text-bz-white/25 uppercase tracking-wider">
            {isOwnProfile ? t('feed.latest') : `${displayProfile?.name ?? username}'s buzzes`}
          </span>
          <div className="flex-1 h-px bg-bz-surface" />
        </div>

        {loadingPosts ? (
          <div className="flex flex-col gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-bz-card border border-bz-surface rounded-xl p-5 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-bz-surface" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-bz-surface rounded w-1/3" />
                    <div className="h-3 bg-bz-surface rounded w-1/5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-bz-surface rounded w-full" />
                  <div className="h-4 bg-bz-surface rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-bz-surface flex items-center justify-center">
              <svg className="w-7 h-7 text-bz-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="text-sm font-mono text-bz-white/30">
              {t('profile.no_posts')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
