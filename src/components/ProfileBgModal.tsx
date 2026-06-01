import React, { useEffect } from 'react'
import { PROFILE_BACKGROUNDS } from '../lib/profileBackgrounds'

interface ProfileBgModalProps {
  current: string | null | undefined
  onSelect: (id: string | null) => void
  onClose: () => void
}

export const ProfileBgModal: React.FC<ProfileBgModalProps> = ({ current, onSelect, onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bz-card border border-bz-surface rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-black/60 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bz-surface flex-shrink-0">
          <h2 className="font-syne font-bold text-lg text-bz-white">Imagem de fundo do perfil</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-bz-white/40 hover:text-bz-white hover:bg-bz-surface transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* No background option */}
            <button
              onClick={() => { onSelect(null); onClose() }}
              className={[
                'relative aspect-video rounded-xl border-2 overflow-hidden transition-all cursor-pointer flex items-center justify-center bg-bz-surface',
                !current ? 'border-bz-electric' : 'border-transparent hover:border-bz-surface/80',
              ].join(' ')}
            >
              <span className="text-xs font-mono text-bz-white/40">Sem imagem</span>
              {!current && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-bz-electric flex items-center justify-center">
                  <svg className="w-3 h-3 text-bz-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            {PROFILE_BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => { onSelect(bg.id); onClose() }}
                className={[
                  'relative aspect-video rounded-xl border-2 overflow-hidden transition-all cursor-pointer group',
                  current === bg.id ? 'border-bz-electric' : 'border-transparent hover:border-bz-surface/80',
                ].join(' ')}
              >
                <img
                  src={bg.url}
                  alt={bg.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-2 left-2 text-xs font-mono text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bg.label}
                </span>
                {current === bg.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-bz-electric flex items-center justify-center">
                    <svg className="w-3 h-3 text-bz-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
