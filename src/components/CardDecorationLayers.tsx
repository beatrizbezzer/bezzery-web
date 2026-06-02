import React from 'react'

export function getBorderShadow(borderId: string | null | undefined): string | null {
  const shadows: Record<string, string> = {
    'violet-glow': '0 0 0 1.5px rgba(139,92,246,0.65), 0 0 40px rgba(139,92,246,0.2)',
    'electric-glow': '0 0 0 1.5px rgba(0,200,255,0.65), 0 0 40px rgba(0,200,255,0.2)',
    'neon-pink': '0 0 0 1.5px rgba(236,72,153,0.65), 0 0 40px rgba(236,72,153,0.2)',
  }
  return borderId ? (shadows[borderId] ?? null) : null
}

/* ─── Emo Frame ─────────────────────────────────────────────────────────── */

export const EmoFrameDecorations: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 20, overflow: 'visible' }}>
    <span className="absolute -top-2 -left-2 text-[10px]" style={{ color: '#8b5cf6', lineHeight: 1 }}>✦</span>
    <span className="absolute -top-2 -right-2 text-[10px]" style={{ color: '#a78bfa' }}>✦</span>
    <span className="absolute -bottom-2 -left-2 text-[10px]" style={{ color: '#6d28d9' }}>✦</span>
    <span className="absolute -bottom-2 -right-2 text-[10px]" style={{ color: '#8b5cf6' }}>✦</span>
    <span className="absolute top-1/2 -left-2 text-[8px]" style={{ color: '#7c3aed', transform: 'translateY(-50%)' }}>✦</span>
    <span className="absolute top-1/2 -right-2 text-[8px]" style={{ color: '#7c3aed', transform: 'translateY(-50%)' }}>✦</span>
  </div>
)

/* ─── Sticker layers ────────────────────────────────────────────────────── */

export const CardStickerLayer: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'sparkles':
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
          <span className="absolute -top-1.5 -right-1.5 text-base select-none" style={{ color: 'rgba(0,200,255,0.85)' }}>✦</span>
          <span className="absolute top-6 -right-1 text-xs select-none" style={{ color: 'rgba(139,92,246,0.65)' }}>✦</span>
          <span className="absolute -top-1 right-7 text-xs select-none" style={{ color: 'rgba(236,72,153,0.65)' }}>✦</span>
          <span className="absolute -bottom-1.5 -left-1.5 text-base select-none" style={{ color: 'rgba(236,72,153,0.85)' }}>✦</span>
          <span className="absolute bottom-6 -left-1 text-xs select-none" style={{ color: 'rgba(139,92,246,0.65)' }}>✦</span>
          <span className="absolute -bottom-1 left-7 text-xs select-none" style={{ color: 'rgba(0,200,255,0.65)' }}>✦</span>
        </div>
      )
    case 'skulls':
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
          <span className="absolute -top-3 -left-2 text-xl select-none" style={{ opacity: 0.75 }}>💀</span>
          <span className="absolute -top-3 -right-2 text-xl select-none" style={{ opacity: 0.75 }}>💀</span>
          <span className="absolute -bottom-3 -left-2 text-xl select-none" style={{ opacity: 0.75 }}>💀</span>
          <span className="absolute -bottom-3 -right-2 text-xl select-none" style={{ opacity: 0.75 }}>💀</span>
        </div>
      )
    default:
      return null
  }
}

/* ─── Overlay layers ────────────────────────────────────────────────────── */

export const CardOverlayLayer: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'scanlines':
      return (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
            zIndex: 10,
          }}
        />
      )
    default:
      return null
  }
}
