import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import { Avatar } from './ui/Avatar'
import { PostModal } from './PostModal'
import { SearchModal } from './SearchModal'
import { NotificationPanel } from './NotificationPanel'
import { useNotifications } from '../hooks/useNotifications'

export const Navbar: React.FC = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const { unreadCount, markAllRead } = useNotifications()
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-bz-card/60 bg-bz-black/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to={isAuthenticated ? '/feed' : '/login'} className="flex items-center gap-2 select-none">
          <span className="font-syne font-extrabold text-2xl gradient-text tracking-tight">
            bezzery
          </span>
        </Link>

        {/* Nav links */}
        {isAuthenticated && (
          <nav className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setPostModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-bz-electric text-bz-black hover:shadow-[0_0_12px_rgba(0,245,196,0.4)] transition-all duration-200 cursor-pointer font-bold text-lg leading-none"
              title="Nova publicação"
            >
              +
            </button>
            <Link
              to="/feed"
              className={[
                'px-4 py-2 rounded-lg text-sm font-grotesk font-semibold transition-colors duration-200',
                isActive('/feed')
                  ? 'text-bz-electric bg-bz-electric/10'
                  : 'text-bz-white/60 hover:text-bz-white hover:bg-bz-surface',
              ].join(' ')}
            >
              {t('nav.feed')}
            </Link>
            <Link
              to="/explore"
              className={[
                'px-4 py-2 rounded-lg text-sm font-grotesk font-semibold transition-colors duration-200',
                isActive('/explore')
                  ? 'text-bz-electric bg-bz-electric/10'
                  : 'text-bz-white/60 hover:text-bz-white hover:bg-bz-surface',
              ].join(' ')}
            >
              Explorar
            </Link>
            {user && (
              <Link
                to={`/profile/${user.username}`}
                className={[
                  'px-4 py-2 rounded-lg text-sm font-grotesk font-semibold transition-colors duration-200',
                  location.pathname.startsWith('/profile')
                    ? 'text-bz-electric bg-bz-electric/10'
                    : 'text-bz-white/60 hover:text-bz-white hover:bg-bz-surface',
                ].join(' ')}
              >
                {t('nav.profile')}
              </Link>
            )}
            <Link
              to="/settings"
              className={[
                'px-4 py-2 rounded-lg text-sm font-grotesk font-semibold transition-colors duration-200',
                isActive('/settings')
                  ? 'text-bz-electric bg-bz-electric/10'
                  : 'text-bz-white/60 hover:text-bz-white hover:bg-bz-surface',
              ].join(' ')}
            >
              {t('nav.settings')}
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-bz-white/50 hover:text-bz-white hover:bg-bz-surface transition-colors duration-200 cursor-pointer"
              title="Buscar usuários"
            >
              <svg className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg text-bz-white/50 hover:text-bz-white hover:bg-bz-surface transition-colors duration-200 cursor-pointer"
                title="Notificações"
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full bg-bz-pink text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <NotificationPanel
                  onClose={() => setNotifOpen(false)}
                  onRead={markAllRead}
                />
              )}
            </div>
          </nav>
        )}

        {/* User menu */}
        {isAuthenticated && user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-bz-surface transition-colors duration-200 cursor-pointer"
            >
              <Avatar src={user.avatarUrl} name={user.name} size="sm" />
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-semibold text-bz-white leading-none">{user.name}</span>
                <span className="text-xs font-mono text-bz-white/40">@{user.username}</span>
              </div>
              <svg
                className={`w-4 h-4 text-bz-white/40 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-bz-card border border-bz-surface rounded-xl shadow-xl shadow-black/50 overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-bz-surface">
                  <p className="text-sm font-semibold text-bz-white">{user.name}</p>
                  <p className="text-xs font-mono text-bz-white/40">@{user.username}</p>
                </div>
                <div className="p-1">
                  <Link
                    to={`/profile/${user.username}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-bz-white/70 hover:text-bz-white hover:bg-bz-surface transition-colors duration-150"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t('nav.profile')}
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-bz-white/70 hover:text-bz-white hover:bg-bz-surface transition-colors duration-150"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t('nav.settings')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-bz-pink/80 hover:text-bz-pink hover:bg-bz-pink/10 transition-colors duration-150 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-grotesk font-semibold text-bz-white/60 hover:text-bz-white transition-colors"
            >
              {t('auth.sign_in')}
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg text-sm font-grotesk font-semibold bg-bz-electric text-bz-black hover:shadow-[0_0_16px_rgba(0,245,196,0.4)] transition-all"
            >
              {t('auth.register')}
            </Link>
          </div>
        )}
      </div>
    </header>

    {postModalOpen && <PostModal onClose={() => setPostModalOpen(false)} />}
    {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
  </>
  )
}
