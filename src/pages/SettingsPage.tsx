import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/Navbar'
import { Input, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Tag, autoVariant } from '../components/ui/Tag'
import { useAuthStore } from '../store/authStore'
import { updateProfile } from '../api/users'
import { uploadImage } from '../lib/uploadImage'
import { COUNTRIES, getLanguageForCountry } from '../lib/countryLanguage'
import { EFFECTS } from '../components/ProfileEffect'
import { ProfileBgModal } from '../components/ProfileBgModal'
import { ProfileCardCustomModal } from '../components/ProfileCardCustomModal'
import { PROFILE_BACKGROUNDS } from '../lib/profileBackgrounds'
import { CARD_BORDERS, CARD_STICKERS, CARD_OVERLAYS } from '../lib/cardDecorations'
import i18n from '../lib/i18n'

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  const { user, setUser } = useAuthStore()

  const [form, setForm] = useState({
    name: user?.name ?? '',
    bio: user?.bio ?? '',
    avatarUrl: user?.avatarUrl ?? '',
    bannerUrl: user?.bannerUrl ?? '',
    bgImage: user?.bgImage ?? '',
    profileEffect: user?.profileEffect ?? '',
    cardBorder: user?.cardBorder ?? '',
    cardSticker: user?.cardSticker ?? '',
    cardOverlay: user?.cardOverlay ?? '',
    tagInput: '',
    tags: user?.tags ?? [],
    country: user?.country ?? '',
  })
  const [bgModalOpen, setBgModalOpen] = useState(false)
  const [cardModalOpen, setCardModalOpen] = useState(false)
  const [cardSaving, setCardSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<{ name?: string }>({})

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    setSuccess(false)
  }

  const handleAddTag = () => {
    const tag = form.tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (!tag || form.tags.includes(tag) || form.tags.length >= 8) return
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: '' }))
    setSuccess(false)
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
    setSuccess(false)
  }

  const saveCardDecoration = async (patch: { cardBorder?: string | null; cardSticker?: string | null; cardOverlay?: string | null }) => {
    setCardSaving(true)
    try {
      const updated = await updateProfile(patch)
      setUser(updated)
      setForm((p) => ({
        ...p,
        cardBorder: updated.cardBorder ?? '',
        cardSticker: updated.cardSticker ?? '',
        cardOverlay: updated.cardOverlay ?? '',
      }))
    } catch { /* ignore */ } finally {
      setCardSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setAvatarUploading(true)
    setError('')
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `avatars/${user.id}.${ext}`
      const url = await uploadImage(file, path)
      setForm((prev) => ({ ...prev, avatarUrl: url }))
      // Auto-save immediately so the photo appears everywhere right away
      const updated = await updateProfile({ avatarUrl: url })
      setUser(updated)
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Erro ao enviar foto. Verifique as permissões do bucket no Supabase.'
      setError(msg)
    } finally {
      setAvatarUploading(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setBannerUploading(true)
    setError('')
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `banners/${user.id}.${ext}`
      const url = await uploadImage(file, path)
      setForm((prev) => ({ ...prev, bannerUrl: url }))
      // Auto-save immediately
      const updated = await updateProfile({ bannerUrl: url })
      setUser(updated)
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Erro ao enviar foto de capa. Verifique as permissões do bucket no Supabase.'
      setError(msg)
    } finally {
      setBannerUploading(false)
      if (bannerInputRef.current) bannerInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setErrors({ name: `${t('settings.display_name')} ${t('common.required')}` })
      return
    }
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const updated = await updateProfile({
        name: form.name.trim(),
        bio: form.bio.trim() || undefined,
        avatarUrl: form.avatarUrl.trim() || undefined,
        bannerUrl: form.bannerUrl.trim() || undefined,
        bgImage: form.bgImage || null,
        profileEffect: form.profileEffect || null,
        cardBorder: form.cardBorder || null,
        cardSticker: form.cardSticker || null,
        cardOverlay: form.cardOverlay || null,
        tags: form.tags,
        country: form.country || undefined,
      })
      setUser(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Change language based on selected country
      if (form.country) {
        const lang = getLanguageForCountry(form.country)
        await i18n.changeLanguage(lang)
        localStorage.setItem('bz_language', lang)
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update profile. Try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bz-black">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 left-12 w-60 h-60 bg-bz-electric/5 rounded-full blur-3xl" />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 relative">
        <div className="mb-8">
          <h1 className="font-syne font-bold text-2xl text-bz-white">{t('settings.title')}</h1>
          <p className="text-sm font-mono text-bz-white/35 mt-1">
            {t('setup.choose_display')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile preview */}
          <div className="bg-bz-card border border-bz-surface rounded-xl p-5">
            <h2 className="font-syne font-bold text-base text-bz-white mb-4">Preview</h2>
            <div className="flex items-center gap-4">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt={form.name || user?.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-bz-surface"
                />
              ) : (
                <Avatar
                  src={undefined}
                  name={form.name || user?.name}
                  size="lg"
                />
              )}
              <div>
                <p className="font-syne font-bold text-lg text-bz-white">
                  {form.name || user?.name || 'Your Name'}
                </p>
                <p className="text-sm font-mono text-bz-white/40">@{user?.username}</p>
                {form.bio && (
                  <p className="text-sm text-bz-white/60 mt-1 max-w-xs truncate">{form.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Success/Error banners */}
          {success && (
            <div className="px-4 py-3 rounded-lg bg-bz-electric/10 border border-bz-electric/30 text-bz-electric text-sm font-mono flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('settings.saved')}
            </div>
          )}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-bz-pink/10 border border-bz-pink/30 text-bz-pink text-sm font-mono">
              {error}
            </div>
          )}

          {/* Basic info */}
          <div className="bg-bz-card border border-bz-surface rounded-xl p-5 space-y-4">
            <h2 className="font-syne font-bold text-base text-bz-white">Profile Info</h2>

            <Input
              label={t('settings.display_name')}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              error={errors.name}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-bz-white/60 uppercase tracking-wider">
                {t('settings.bio')}
              </label>
              <Textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder={t('settings.bio_placeholder')}
                rows={3}
              />
            </div>
          </div>

          {/* Avatar upload */}
          <div className="bg-bz-card border border-bz-surface rounded-xl p-5 space-y-4">
            <h2 className="font-syne font-bold text-base text-bz-white">{t('settings.avatar')}</h2>

            <div className="flex items-center gap-4">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-bz-surface"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-bz-surface flex items-center justify-center">
                  <svg className="w-8 h-8 text-bz-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-bz-surface text-bz-white/70 hover:text-bz-white hover:bg-bz-surface/80 border border-bz-surface/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {avatarUploading ? t('settings.uploading') : t('settings.upload_avatar')}
                </button>
                <p className="text-xs font-mono text-bz-white/30 mt-2">{t('settings.avatar_hint')}</p>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Banner upload */}
          <div className="bg-bz-card border border-bz-surface rounded-xl p-5 space-y-4">
            <h2 className="font-syne font-bold text-base text-bz-white">{t('settings.banner')}</h2>

            <div className="space-y-3">
              {form.bannerUrl ? (
                <img
                  src={form.bannerUrl}
                  alt="Banner preview"
                  className="w-full h-24 rounded-lg object-cover ring-2 ring-bz-surface"
                />
              ) : (
                <div className="w-full h-24 rounded-lg bg-gradient-to-br from-bz-violet via-bz-pink to-bz-electric opacity-40" />
              )}
              <div>
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={bannerUploading}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-bz-surface text-bz-white/70 hover:text-bz-white hover:bg-bz-surface/80 border border-bz-surface/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {bannerUploading ? t('settings.uploading') : t('settings.upload_banner')}
                </button>
                <p className="text-xs font-mono text-bz-white/30 mt-2">{t('settings.banner_hint')}</p>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Country selector */}
          <div className="bg-bz-card border border-bz-surface rounded-xl p-5 space-y-4">
            <h2 className="font-syne font-bold text-base text-bz-white">{t('settings.country')}</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-bz-white/60 uppercase tracking-wider">
                {t('settings.country')}
              </label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full bg-bz-surface border border-bz-surface/60 rounded-lg px-3 py-2.5 text-sm text-bz-white font-grotesk focus:outline-none focus:border-bz-electric/50 transition-colors cursor-pointer"
              >
                <option value="">{t('settings.select_country')}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Background image */}
          <div className="bg-bz-card border border-bz-surface rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-syne font-bold text-base text-bz-white">Imagem de fundo do perfil</h2>
              {form.bgImage && (
                <button
                  type="button"
                  onClick={() => { setForm((p) => ({ ...p, bgImage: '' })); setSuccess(false) }}
                  className="text-xs font-mono text-bz-white/40 hover:text-bz-pink transition-colors cursor-pointer"
                >
                  Remover imagem
                </button>
              )}
            </div>

            {/* Preview + open modal button */}
            <button
              type="button"
              onClick={() => setBgModalOpen(true)}
              className="w-full relative rounded-xl overflow-hidden border border-bz-surface hover:border-bz-electric/40 transition-all cursor-pointer group"
              style={{ aspectRatio: '16/5' }}
            >
              {form.bgImage ? (
                <>
                  <img
                    src={PROFILE_BACKGROUNDS.find((b) => b.id === form.bgImage)?.url}
                    alt="Fundo selecionado"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">Trocar imagem</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-bz-surface flex flex-col items-center justify-center gap-2">
                  <svg className="w-6 h-6 text-bz-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-mono text-bz-white/30">Clique para escolher uma imagem</span>
                </div>
              )}
            </button>
          </div>

          {/* Profile effect */}
          {EFFECTS.length > 0 && (
            <div className="bg-bz-card border border-bz-surface rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-syne font-bold text-base text-bz-white">Efeito do perfil</h2>
                {form.profileEffect && (
                  <button
                    type="button"
                    onClick={() => { setForm((p) => ({ ...p, profileEffect: '' })); setSuccess(false) }}
                    className="text-xs font-mono text-bz-white/40 hover:text-bz-pink transition-colors cursor-pointer"
                  >
                    Remover efeito
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EFFECTS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => { setForm((p) => ({ ...p, profileEffect: p.profileEffect === e.id ? '' : e.id })); setSuccess(false) }}
                    className={[
                      'relative h-20 rounded-xl border-2 overflow-hidden transition-all cursor-pointer text-sm font-semibold',
                      form.profileEffect === e.id
                        ? 'border-bz-electric text-bz-electric'
                        : 'border-bz-surface text-bz-white/50 hover:border-bz-surface/80',
                    ].join(' ')}
                  >
                    <span className="relative z-10">{e.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card decorations */}
          {(CARD_BORDERS.length > 0 || CARD_STICKERS.length > 0 || CARD_OVERLAYS.length > 0) && (
            <div className="bg-bz-card border border-bz-surface rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-syne font-bold text-base text-bz-white">Decorações do card</h2>
                  <p className="text-xs font-mono text-bz-white/35 mt-0.5">Bordas, stickers e overlays</p>
                </div>
                {(form.cardBorder || form.cardSticker || form.cardOverlay) && (
                  <button
                    type="button"
                    onClick={() => saveCardDecoration({ cardBorder: null, cardSticker: null, cardOverlay: null })}
                    className="text-xs font-mono text-bz-white/40 hover:text-bz-pink transition-colors cursor-pointer"
                  >
                    Remover tudo
                  </button>
                )}
              </div>

              {/* Current selections summary */}
              {(form.cardBorder || form.cardSticker || form.cardOverlay) && (
                <div className="flex flex-wrap gap-2">
                  {form.cardBorder && (
                    <span className="px-2 py-1 rounded-md bg-bz-surface text-xs font-mono text-bz-electric/80">
                      {CARD_BORDERS.find((b) => b.id === form.cardBorder)?.label ?? form.cardBorder}
                    </span>
                  )}
                  {form.cardSticker && (
                    <span className="px-2 py-1 rounded-md bg-bz-surface text-xs font-mono text-bz-pink/80">
                      {CARD_STICKERS.find((s) => s.id === form.cardSticker)?.label ?? form.cardSticker}
                    </span>
                  )}
                  {form.cardOverlay && (
                    <span className="px-2 py-1 rounded-md bg-bz-surface text-xs font-mono text-bz-violet/80">
                      {CARD_OVERLAYS.find((o) => o.id === form.cardOverlay)?.label ?? form.cardOverlay}
                    </span>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => setCardModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-bz-surface text-bz-white/50 hover:text-bz-white hover:border-bz-electric/40 transition-all cursor-pointer text-sm font-mono group"
              >
                <svg className="w-4 h-4 group-hover:text-bz-electric transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Personalizar card
              </button>
            </div>
          )}

          {/* Tags */}
          <div className="bg-bz-card border border-bz-surface rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-syne font-bold text-base text-bz-white">{t('settings.tags')}</h2>
              <span className="text-xs font-mono text-bz-white/30">{form.tags.length}/8</span>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  name="tagInput"
                  value={form.tagInput}
                  onChange={handleChange}
                  onKeyDown={handleTagKeyDown}
                  placeholder={t('settings.add_tag')}
                  hint="Press Enter or click Add"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!form.tagInput.trim() || form.tags.length >= 8}
                className="mt-0 px-4 py-3 rounded-lg text-sm font-semibold bg-bz-surface text-bz-white/60 hover:text-bz-white hover:bg-bz-surface/80 border border-bz-surface transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer self-start"
              >
                Add
              </button>
            </div>

            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, i) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="group cursor-pointer"
                  >
                    <Tag variant={autoVariant(i)} className="group-hover:opacity-60 transition-opacity pr-1">
                      {tag}
                      <svg className="w-3 h-3 ml-1 inline opacity-60 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Tag>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pb-8">
            <Button type="submit" variant="primary" size="lg" loading={loading}>
              {loading ? t('settings.saving') : t('settings.save')}
            </Button>
          </div>
        </form>
      </main>

      {bgModalOpen && (
        <ProfileBgModal
          current={form.bgImage}
          onSelect={(id) => { setForm((p) => ({ ...p, bgImage: id ?? '' })); setSuccess(false) }}
          onClose={() => setBgModalOpen(false)}
        />
      )}

      {cardModalOpen && (
        <ProfileCardCustomModal
          currentBorder={form.cardBorder || null}
          currentSticker={form.cardSticker || null}
          currentOverlay={form.cardOverlay || null}
          onSelectBorder={(id) => saveCardDecoration({ cardBorder: id })}
          onSelectSticker={(id) => saveCardDecoration({ cardSticker: id })}
          onSelectOverlay={(id) => saveCardDecoration({ cardOverlay: id })}
          onClose={() => setCardModalOpen(false)}
          saving={cardSaving}
        />
      )}
    </div>
  )
}
