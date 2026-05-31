import React, { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useFeedStore } from '../store/feedStore'
import { createPost } from '../api/posts'
import { uploadImage } from '../lib/uploadImage'
import { Button } from './ui/Button'

interface PostModalProps {
  onClose: () => void
}

export const PostModal: React.FC<PostModalProps> = ({ onClose }) => {
  const { user } = useAuthStore()
  const { publishPost } = useFeedStore()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError('')
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile || !user || loading) return
    setLoading(true)
    setError('')
    try {
      const ext = imageFile.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `posts/${user.id}/${Date.now()}.${ext}`
      const imageUrl = await uploadImage(imageFile, path)
      const post = await createPost('', imageUrl)
      publishPost(post)
      onClose()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error).message ||
        'Falha ao publicar. Tente novamente.'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bz-card border border-bz-surface rounded-2xl w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-bz-surface">
          <h2 className="font-syne font-bold text-base text-bz-white">Nova publicação</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-bz-white/40 hover:text-bz-white hover:bg-bz-surface transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5">
          {!imagePreview ? (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-full aspect-[4/5] rounded-xl border-2 border-dashed border-bz-surface flex flex-col items-center justify-center gap-3 text-bz-white/30 hover:text-bz-electric hover:border-bz-electric/40 transition-all duration-200 cursor-pointer"
            >
              <svg style={{ width: '40px', height: '40px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-mono">Toque para escolher uma foto</span>
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-bz-surface aspect-[4/5]">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-bz-black/70 flex items-center justify-center hover:bg-bz-black transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-bz-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {error && (
            <p className="text-xs text-bz-pink font-mono mt-3">{error}</p>
          )}

          {imagePreview && (
            <div className="mt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Publicando...' : 'Publicar'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
