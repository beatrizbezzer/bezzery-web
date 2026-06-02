import React, { useState, useEffect } from 'react'
import { CARD_BORDERS, CARD_STICKERS, CARD_OVERLAYS, getBorderShadow } from '../lib/cardDecorations'

type Tab = 'borders' | 'stickers' | 'overlays'

interface Props {
  currentBorder: string | null | undefined
  currentSticker: string | null | undefined
  currentOverlay: string | null | undefined
  onSelectBorder: (id: string | null) => void
  onSelectSticker: (id: string | null) => void
  onSelectOverlay: (id: string | null) => void
  onClose: () => void
  saving?: boolean
}

const MiniCard: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full h-14 rounded-lg bg-bz-black/60 flex items-center gap-2 px-2 overflow-visible">
    <div className="w-7 h-7 rounded-full bg-bz-white/10 flex-shrink-0" />
    <div className="flex-1 space-y-1">
      <div className="h-1.5 rounded-sm bg-bz-white/20 w-3/4" />
      <div className="h-1 rounded-sm bg-bz-white/10 w-1/2" />
    </div>
    {children}
  </div>
)

const BorderPreview: React.FC<{ id: string }> = ({ id }) => {
  if (id === 'emo-frame') {
    return (
      <div style={{
        borderRadius: '12px',
        boxShadow: '0 0 0 1.5px #8b5cf6, 0 0 0 3px rgba(0,0,0,0.95), 0 0 0 4.5px #6d28d9, 0 0 14px rgba(109,40,217,0.6)',
        position: 'relative',
      }}>
        <MiniCard>
          <span className="absolute -top-2 -left-2 text-[10px] select-none" style={{ color: '#8b5cf6', lineHeight: 1 }}>✦</span>
          <span className="absolute -top-1 -right-1 text-[8px] select-none" style={{ color: '#6d28d9' }}>♥</span>
          <span className="absolute -bottom-1.5 -right-1.5 text-[10px] select-none" style={{ color: '#8b5cf6' }}>♥</span>
        </MiniCard>
      </div>
    )
  }
  if (id === 'gradient-vp') {
    return (
      <div className="p-[2px] rounded-lg w-full" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
        <div className="rounded-[6px] overflow-hidden">
          <MiniCard />
        </div>
      </div>
    )
  }
  const shadow = getBorderShadow(id)
  return (
    <div style={{ borderRadius: '8px', boxShadow: shadow || undefined }}>
      <MiniCard />
    </div>
  )
}

const StickerPreview: React.FC<{ id: string }> = ({ id }) => {
  const stickerMap: Record<string, React.ReactNode> = {
    sparkles: (
      <>
        <span className="absolute -top-1 -right-1 text-sm select-none" style={{ color: 'rgba(0,200,255,0.9)' }}>✦</span>
        <span className="absolute top-3 -right-0.5 text-[9px] select-none" style={{ color: 'rgba(139,92,246,0.7)' }}>✦</span>
        <span className="absolute -bottom-1 -left-1 text-sm select-none" style={{ color: 'rgba(236,72,153,0.9)' }}>✦</span>
        <span className="absolute bottom-3 -left-0.5 text-[9px] select-none" style={{ color: 'rgba(0,200,255,0.7)' }}>✦</span>
      </>
    ),
    skulls: (
      <>
        <span className="absolute -top-2.5 -left-1.5 text-base select-none" style={{ opacity: 0.8 }}>💀</span>
        <span className="absolute -top-2.5 -right-1.5 text-base select-none" style={{ opacity: 0.8 }}>💀</span>
        <span className="absolute -bottom-2.5 -left-1.5 text-base select-none" style={{ opacity: 0.8 }}>💀</span>
        <span className="absolute -bottom-2.5 -right-1.5 text-base select-none" style={{ opacity: 0.8 }}>💀</span>
      </>
    ),
  }
  return (
    <div className="relative overflow-visible py-1">
      <MiniCard>{stickerMap[id]}</MiniCard>
    </div>
  )
}

const OverlayPreview: React.FC<{ id: string }> = ({ id }) => {
  const overlayStyles: Record<string, React.CSSProperties> = {
    scanlines: {
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)',
    },
  }
  return (
    <div className="relative overflow-hidden rounded-lg">
      <MiniCard />
      {overlayStyles[id] && (
        <div className="absolute inset-0 rounded-lg pointer-events-none" style={overlayStyles[id]} />
      )}
    </div>
  )
}

const TABS: { id: Tab; label: string; items: typeof CARD_BORDERS }[] = [
  { id: 'borders', label: 'Bordas', items: CARD_BORDERS },
  { id: 'stickers', label: 'Stickers', items: CARD_STICKERS },
  { id: 'overlays', label: 'Overlays', items: CARD_OVERLAYS },
].filter((t) => t.items.length > 0) as { id: Tab; label: string; items: typeof CARD_BORDERS }[]

export const ProfileCardCustomModal: React.FC<Props> = ({
  currentBorder, currentSticker, currentOverlay,
  onSelectBorder, onSelectSticker, onSelectOverlay, onClose, saving = false,
}) => {
  const [tab, setTab] = useState<Tab>(TABS[0]?.id ?? 'borders')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const currentForTab = (t: Tab) => {
    if (t === 'borders') return currentBorder
    if (t === 'stickers') return currentSticker
    return currentOverlay
  }

  const handleSelect = (t: Tab, id: string) => {
    const current = currentForTab(t)
    const next = current === id ? null : id
    if (t === 'borders') onSelectBorder(next)
    else if (t === 'stickers') onSelectSticker(next)
    else onSelectOverlay(next)
  }

  const activeTab = TABS.find((t) => t.id === tab)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bz-card border border-bz-surface rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl shadow-black/60 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bz-surface flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-syne font-bold text-lg text-bz-white">Personalizar Card</h2>
            {saving && <span className="text-xs font-mono text-bz-white/40 animate-pulse">Salvando...</span>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-bz-white/40 hover:text-bz-white hover:bg-bz-surface transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-bz-surface flex-shrink-0 px-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'relative px-4 py-3 text-sm font-mono transition-colors cursor-pointer',
                tab === t.id ? 'text-bz-electric' : 'text-bz-white/40 hover:text-bz-white/70',
              ].join(' ')}
            >
              {t.label}
              {tab === t.id && (
                <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-bz-electric rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-bz-white/30 uppercase tracking-wider">
              {activeTab?.label}
            </span>
            {currentForTab(tab) && (
              <button
                onClick={() => handleSelect(tab, currentForTab(tab)!)}
                className="text-xs font-mono text-bz-white/40 hover:text-bz-pink transition-colors cursor-pointer"
              >
                Remover
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {activeTab?.items.map((item) => {
              const selected = currentForTab(tab) === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => !saving && handleSelect(tab, item.id)}
                  disabled={saving}
                  className={[
                    'relative rounded-xl border-2 p-3 text-left transition-all',
                    saving ? 'opacity-60 cursor-wait' : 'cursor-pointer',
                    selected ? 'border-bz-electric' : 'border-bz-surface hover:border-bz-surface/80',
                  ].join(' ')}
                  style={{ overflow: tab === 'stickers' ? 'visible' : 'hidden' }}
                >
                  <div className="mb-2">
                    {tab === 'borders' && <BorderPreview id={item.id} />}
                    {tab === 'stickers' && <StickerPreview id={item.id} />}
                    {tab === 'overlays' && <OverlayPreview id={item.id} />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-bz-white/60">{item.label}</span>
                    {selected && (
                      <div className="w-4 h-4 rounded-full bg-bz-electric flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-bz-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
