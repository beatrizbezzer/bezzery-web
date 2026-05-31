import React, { useState, useEffect, useCallback } from 'react'
import { Navbar } from '../components/Navbar'
import { PostCard } from '../components/PostCard'
import { getExplorePosts } from '../api/posts'
import type { Post } from '../types'

export const ExplorePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')

  const load = useCallback(async (p: number, replace: boolean) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)
    setError('')
    try {
      const { posts: newPosts, hasMore: more } = await getExplorePosts(p)
      setPosts((prev) => replace ? newPosts : [...prev, ...newPosts])
      setHasMore(more)
      setPage(p)
    } catch {
      setError('Erro ao carregar posts.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => { load(1, true) }, [load])

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <div className="min-h-screen bg-bz-black">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 right-8 w-64 h-64 bg-bz-violet/5 rounded-full blur-3xl" />
        <div className="absolute top-96 left-8 w-48 h-48 bg-bz-pink/5 rounded-full blur-3xl" />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-bz-surface" />
          <span className="text-xs font-mono text-bz-white/25 uppercase tracking-wider">Explorar</span>
          <div className="flex-1 h-px bg-bz-surface" />
        </div>

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
            <p className="text-bz-pink font-mono text-sm mb-3">{error}</p>
            <button
              onClick={() => load(1, true)}
              className="text-sm font-semibold text-bz-electric hover:text-bz-electric/80 transition-colors cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bz-surface flex items-center justify-center">
              <svg className="w-8 h-8 text-bz-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="font-syne font-bold text-lg text-bz-white mb-2">Nada por aqui</h2>
            <p className="text-sm font-mono text-bz-white/40">Você já segue todos os usuários.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handleDelete} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => load(page + 1, false)}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-bz-surface text-bz-white/70 hover:text-bz-white hover:bg-bz-surface/80 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Carregando...
                    </span>
                  ) : 'Carregar mais'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
