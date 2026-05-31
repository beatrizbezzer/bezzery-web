import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { useAuthStore } from '../store/authStore'
import { createPost } from '../api/posts'
import { uploadImage } from '../lib/uploadImage'
import type { Post } from '../types'

interface CreatePostProps {
  onPostCreated?: (post: Post) => void
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

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
    if (!imageFile || loading) return
    setLoading(true)
    setError('')
    try {
      const ext = imageFile.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `posts/${user!.id}/${Date.now()}.${ext}`
      const imageUrl = await uploadImage(imageFile, path)
      const post = await createPost('', imageUrl)
      handleRemoveImage()
      onPostCreated?.(post)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error).message ||
        'Falha ao publicar. Tente novamente.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bz-card border border-bz-surface rounded-xl p-5 hover:border-bz-electric/20 transition-all duration-300">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 items-center">
          <Avatar src={user?.avatarUrl} name={user?.name} size="md" />

          {/* Image picker trigger */}
          {!imagePreview && (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={loading}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-bz-surface text-bz-white/30 hover:text-bz-electric hover:border-bz-electric/40 transition-all duration-200 cursor-pointer disabled:opacity-40"
            >
              <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-mono">Adicionar foto</span>
            </button>
          )}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="mt-4">
            <div className="relative rounded-xl overflow-hidden border border-bz-surface aspect-[4/5]">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
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

            {error && (
              <p className="text-xs text-bz-pink font-mono mt-2">{error}</p>
            )}

            <div className="flex justify-end mt-3">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Publicando...' : t('post.submit')}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
