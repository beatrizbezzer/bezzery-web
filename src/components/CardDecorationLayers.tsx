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

const BrushStar: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 32, color = '#8b5cf6', opacity = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="bstar-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Thick brushy outer trace */}
    <path
      d="M16,2 L19.5,12.2 L30.5,12.5 L22,19.5 L25,30 L16,23.5 L7,30 L10,19.5 L1.5,12.5 L12.5,12.2 Z"
      fill="none" stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"
      opacity={opacity} filter="url(#bstar-glow)"
    />
    {/* Second rough inner stroke — gives the brush layering feel */}
    <path
      d="M16,4.5 L19,13.5 L29,13.8 L21,20.2 L23.5,29 L16,23 L8.5,29 L11,20.2 L3,13.8 L13,13.5 Z"
      fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"
      opacity={opacity * 0.45}
    />
    {/* Rough brush flick at tip of each main point */}
    <path d="M16,2 L15.2,0.5 M16,2 L16.8,0.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity={opacity * 0.6}/>
    <path d="M30.5,12.5 L31.8,11.8" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={opacity * 0.5}/>
    <path d="M1.5,12.5 L0.2,11.8" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={opacity * 0.5}/>
    <path d="M25,30 L25.8,31.5" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={opacity * 0.5}/>
    <path d="M7,30 L6.2,31.5" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={opacity * 0.5}/>
  </svg>
)

export const EmoFrameDecorations: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 20, overflow: 'visible' }}>
    {/* Top-left */}
    <div className="absolute" style={{ top: -14, left: -14 }}>
      <BrushStar size={36} color="#4b2952" opacity={0.95}/>
    </div>
    {/* Top-right */}
    <div className="absolute" style={{ top: -14, right: -14 }}>
      <BrushStar size={30} color="#4b2952" opacity={0.85}/>
    </div>
    {/* Bottom-left */}
    <div className="absolute" style={{ bottom: -14, left: -14 }}>
      <BrushStar size={28} color="#4b2952" opacity={0.8}/>
    </div>
    {/* Bottom-right */}
    <div className="absolute" style={{ bottom: -14, right: -14 }}>
      <BrushStar size={34} color="#4b2952" opacity={0.9}/>
    </div>
    {/* Mid-left small */}
    <div className="absolute" style={{ top: '50%', left: -12, transform: 'translateY(-50%)' }}>
      <BrushStar size={20} color="#4b2952" opacity={0.7}/>
    </div>
    {/* Mid-right small */}
    <div className="absolute" style={{ top: '50%', right: -12, transform: 'translateY(-50%)' }}>
      <BrushStar size={20} color="#4b2952" opacity={0.7}/>
    </div>
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
