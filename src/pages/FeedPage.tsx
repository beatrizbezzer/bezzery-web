import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/Navbar'
import { PostCard } from '../components/PostCard'
import { SuggestionsSection } from '../components/SuggestionsSection'
import { getFeedPosts } from '../api/posts'
import { useFeedStore } from '../store/feedStore'
import type { Post } from '../types'

export const FeedPage: React.FC = () => {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { newPost, clearNewPost } = useFeedStore()

  useEffect(() => {
    loadFeed()
  }, [])

  // Prepend new post when published via modal
  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev])
      clearNewPost()
    }
  }, [newPost, clearNewPost])

  const loadFeed = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getFeedPosts()
      setPosts(data)
    } catch {
      setError(t('feed.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <div className="min-h-screen bg-bz-black">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-10 w-64 h-64 bg-bz-violet/5 rounded-full blur-3xl" />
        <div className="absolute top-80 right-10 w-48 h-48 bg-bz-electric/5 rounded-full blur-3xl" />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 relative">
        <SuggestionsSection />

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-bz-card border border-bz-surface rounded-xl p-5 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-bz-surface" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-bz-surface rounded w-1/3" />
                    <div className="h-3 bg-bz-surface rounded w-1/5" />
                  </div>
                </div>
                <div className="aspect-[4/5] bg-bz-surface rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-bz-pink/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-bz-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-bz-pink font-mono text-sm mb-3">{error}</p>
            <button
              onClick={loadFeed}
              className="text-sm font-semibold text-bz-electric hover:text-bz-electric/80 transition-colors cursor-pointer"
            >
              {t('feed.retry')}
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bz-surface flex items-center justify-center">
              <svg className="w-8 h-8 text-bz-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-syne font-bold text-lg text-bz-white mb-2">{t('feed.no_posts')}</h2>
            <p className="text-sm font-mono text-bz-white/40">{t('feed.no_posts_sub')}</p>
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
