import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { loginWithSupabase } from '../api/auth'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/feed'

  const [form, setForm] = useState({ login: '', password: '' })
  const [errors, setErrors] = useState<{ login?: string; password?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: typeof errors = {}
    if (!form.login.trim()) e.login = `${t('auth.email_or_username')} ${t('common.required')}`
    if (!form.password) e.password = `${t('auth.password')} ${t('common.required')}`
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    setLoading(true)
    setErrors({})
    try {
      const { user, token, needsSetup } = await loginWithSupabase(form.login, form.password)
      if (needsSetup) {
        sessionStorage.setItem('bz_setup_token', token)
        navigate('/setup-profile', { replace: true })
        return
      }
      setAuth(user!, token)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setErrors({ general: (err as Error).message || t('auth.invalid_credentials') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bz-black flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bz-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-bz-electric/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-syne font-extrabold text-4xl gradient-text">bezzery</span>
          </Link>
          <p className="mt-2 text-sm font-mono text-bz-white/40">{t('auth.tagline')}</p>
        </div>

        <div className="bg-bz-card border border-bz-surface rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h1 className="font-syne font-bold text-2xl text-bz-white mb-6">{t('auth.welcome_back')}</h1>

          {errors.general && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-bz-pink/10 border border-bz-pink/30 text-bz-pink text-sm font-mono">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.email_or_username')}
              type="text"
              name="login"
              value={form.login}
              onChange={handleChange}
              placeholder="seu@email.com ou seu_username"
              error={errors.login}
              autoComplete="username"
            />
            <Input
              label={t('auth.password')}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              autoComplete="current-password"
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
              {t('auth.sign_in')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-bz-white/40">
              {t('auth.no_account')}{' '}
              <Link to="/register" className="text-bz-electric font-semibold hover:text-bz-electric/80 transition-colors">
                {t('auth.create_now')}
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-xs font-mono text-bz-white/20">
          {t('auth.terms')}
        </p>
      </div>
    </div>
  )
}
