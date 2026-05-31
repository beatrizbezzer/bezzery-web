import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { registerWithSupabase } from '../api/auth'

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [emailSent, setEmailSent] = useState(false)

  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<{
    name?: string; username?: string; email?: string
    password?: string; confirmPassword?: string; general?: string
  }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = `${t('auth.name')} ${t('common.required')}`
    if (!form.username.trim()) e.username = `${t('auth.username')} ${t('common.required')}`
    else if (!/^[a-z0-9._-]{3,20}$/.test(form.username)) e.username = 'Nome de usuário não permitido'
    if (!form.email) e.email = `Email ${t('common.required')}`
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.password) e.password = `${t('auth.password')} ${t('common.required')}`
    else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (!form.confirmPassword) e.confirmPassword = `${t('auth.confirm_password')} ${t('common.required')}`
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Senhas não coincidem'
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const normalized = name === 'username' ? value.toLowerCase() : value
    setForm((prev) => ({ ...prev, [name]: normalized }))
    if (name === 'username') {
      if (!normalized.trim() || /^[a-z0-9._-]{3,20}$/.test(normalized)) {
        setErrors((prev) => ({ ...prev, username: undefined }))
      } else {
        setErrors((prev) => ({ ...prev, username: 'Nome de usuário não permitido' }))
      }
    } else if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    setLoading(true)
    setErrors({})
    try {
      const result = await registerWithSupabase(form.email, form.password, form.username, form.name)

      if (result.requiresConfirmation) {
        setEmailSent(true)
        return
      }

      setAuth(result.user!, result.token!)
      navigate('/feed', { replace: true })
    } catch (err: unknown) {
      setErrors({ general: (err as Error).message || 'Falha no cadastro. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-bz-black flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">📬</div>
          <h1 className="font-syne font-bold text-2xl text-bz-white mb-3">{t('auth.email_sent_title')}</h1>
          <p className="text-bz-white/50 mb-6">
            {t('auth.email_sent_body')} <span className="text-bz-electric">{form.email}</span>.<br />
            Acesse o link para ativar sua conta e depois faça login.
          </p>
          <Link to="/login" className="text-bz-electric font-semibold hover:underline font-mono text-sm">
            {t('auth.go_to_login')} →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bz-black flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-bz-pink/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-bz-violet/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-syne font-extrabold text-4xl gradient-text">bezzery</span>
          </Link>
          <p className="mt-2 text-sm font-mono text-bz-white/40">{t('auth.tagline')}</p>
        </div>

        <div className="bg-bz-card border border-bz-surface rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h1 className="font-syne font-bold text-2xl text-bz-white mb-6">{t('auth.join')}</h1>

          {errors.general && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-bz-pink/10 border border-bz-pink/30 text-bz-pink text-sm font-mono">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t('auth.name')} type="text" name="name" value={form.name}
              onChange={handleChange} placeholder="Seu nome" error={errors.name} autoComplete="name" />
            <Input label={t('auth.username')} type="text" name="username" value={form.username}
              onChange={handleChange} placeholder="seu_usuario" error={errors.username}
              autoComplete="username" />
            <Input label="Email" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="seu@email.com" error={errors.email} autoComplete="email" />
            <Input label={t('auth.password')} type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Mínimo 8 caracteres" error={errors.password} autoComplete="new-password" />
            <Input label={t('auth.confirm_password')} type="password" name="confirmPassword" value={form.confirmPassword}
              onChange={handleChange} placeholder="Repita a senha" error={errors.confirmPassword} autoComplete="new-password" />

            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
              {t('auth.create_account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-bz-white/40">
              {t('auth.has_account')}{' '}
              <Link to="/login" className="text-bz-electric font-semibold hover:text-bz-electric/80 transition-colors">
                {t('auth.sign_in_link')}
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
