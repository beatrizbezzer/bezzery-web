import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import client from '../api/client'
import type { User } from '../types'

export const SetupProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ name: '', username: '' })
  const [errors, setErrors] = useState<{ name?: string; username?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('bz_setup_token')) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  const validate = () => {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = `${t('setup.display_name')} ${t('common.required')}`
    if (!form.username.trim()) e.username = `${t('auth.username')} ${t('common.required')}`
    else if (!/^[a-z0-9._-]{3,20}$/.test(form.username)) e.username = t('auth.username_hint')
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const normalized = name === 'username' ? value.toLowerCase() : value
    setForm((prev) => ({ ...prev, [name]: normalized }))
    if (errors[name as keyof typeof errors]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    setLoading(true)
    setErrors({})
    try {
      const token = sessionStorage.getItem('bz_setup_token')!
      const { data: profile } = await client.post<User>('/auth/sync', {
        username: form.username,
        name: form.name,
      }, { headers: { Authorization: `Bearer ${token}` } })

      sessionStorage.removeItem('bz_setup_token')
      setAuth(profile, token)
      navigate('/feed', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErrors({ general: msg || 'Erro ao criar perfil. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bz-black flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-bz-electric/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-bz-violet/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <span className="font-syne font-extrabold text-4xl gradient-text">bezzery</span>
          <p className="mt-2 text-sm font-mono text-bz-white/40">{t('setup.subtitle')}</p>
        </div>

        <div className="bg-bz-card border border-bz-surface rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h1 className="font-syne font-bold text-2xl text-bz-white mb-2">{t('setup.title')}</h1>
          <p className="text-bz-white/40 text-sm mb-6">{t('setup.choose_display')}</p>

          {errors.general && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-bz-pink/10 border border-bz-pink/30 text-bz-pink text-sm font-mono">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('setup.display_name')}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Seu nome"
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label={t('auth.username')}
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="seu_handle"
              error={errors.username}
              hint={t('auth.username_hint')}
              autoComplete="username"
            />
            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
              {t('setup.enter_bezzery')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
