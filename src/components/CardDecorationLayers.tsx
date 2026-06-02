import React from 'react'

export function getBorderShadow(borderId: string | null | undefined): string | null {
  const shadows: Record<string, string> = {
    'violet-glow': '0 0 0 1.5px rgba(139,92,246,0.65), 0 0 40px rgba(139,92,246,0.2)',
    'electric-glow': '0 0 0 1.5px rgba(0,200,255,0.65), 0 0 40px rgba(0,200,255,0.2)',
    'neon-pink': '0 0 0 1.5px rgba(236,72,153,0.65), 0 0 40px rgba(236,72,153,0.2)',
  }
  return borderId ? (shadows[borderId] ?? null) : null
}

/* ─── Emo Frame corner decorations ─────────────────────────────────────── */

export const EmoFrameDecorations: React.FC = () => (
  <>
    {/* ── Top-left: scribbled neon star + hand-drawn marks ── */}
    <div className="absolute top-0 left-0 pointer-events-none select-none" style={{ transform: 'translate(-10px, -10px)', zIndex: 20 }}>
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-tl" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Outer star trace (scribble) */}
        <path d="M28,10 L32,21.5 L45,22 L36,29.5 L39,41 L28,34 L17,41 L20,29.5 L11,22 L24,21.5 Z"
              stroke="#6d28d9" strokeWidth="1" fill="none" strokeLinejoin="round" opacity="0.5"/>
        {/* Main star */}
        <path d="M28,8 L32,20 L45,20.5 L35.5,28 L38.5,40 L28,33 L17.5,40 L20.5,28 L11,20.5 L24,20 Z"
              stroke="#8b5cf6" strokeWidth="1.8" fill="rgba(139,92,246,0.08)"
              strokeLinejoin="round" filter="url(#glow-tl)"/>
        {/* Hand-drawn tick marks near star */}
        <path d="M50,12 L56,10 M52,18 L60,16" stroke="#6d28d9" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
        <path d="M48,8 L54,11" stroke="#8b5cf6" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
        {/* × symbols */}
        <text x="58" y="13" fill="#8b5cf6" fontSize="9" opacity="0.7" fontFamily="serif">×</text>
        <text x="12" y="56" fill="#6d28d9" fontSize="7" opacity="0.5" fontFamily="serif">×</text>
        {/* Subtle scratches along left edge */}
        <path d="M14,62 L19,66 M13,72 L18,75 M14,80 L20,83" stroke="#6d28d9" strokeWidth="0.7" strokeLinecap="round" opacity="0.35"/>
      </svg>
    </div>

    {/* ── Top-right: safety pin + chain + heart outline ── */}
    <div className="absolute top-0 right-0 pointer-events-none select-none" style={{ transform: 'translate(10px, -10px)', zIndex: 20 }}>
      <svg width="88" height="138" viewBox="0 0 88 138" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-tr" x="-80%" y="-60%" width="260%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Heart outline (top-right area) */}
        <path d="M28,18 C28,12 18,8 14,16 C10,24 20,32 28,40 C36,32 46,24 42,16 C38,8 28,12 28,18 Z"
              fill="none" stroke="#8b5cf6" strokeWidth="1.5" filter="url(#glow-tr)" opacity="0.85"/>
        {/* Safety pin — needle */}
        <line x1="72" y1="8" x2="72" y2="42" stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round" filter="url(#glow-tr)"/>
        {/* Pin head (loop) */}
        <circle cx="72" cy="8" r="3.5" fill="none" stroke="#8b5cf6" strokeWidth="1.8"/>
        <circle cx="72" cy="8" r="1.5" fill="#8b5cf6" opacity="0.6"/>
        {/* Safety guard / clasp */}
        <path d="M72,42 C72,50 58,50 58,42 L58,24 C58,18 64,16 68,19 L72,22"
              fill="none" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round"/>
        {/* Chain links hanging from pin */}
        <ellipse cx="66" cy="58"  rx="4" ry="7"  stroke="#9d7ede" strokeWidth="1.3" fill="none" transform="rotate(-12,66,58)"/>
        <ellipse cx="62" cy="72"  rx="7" ry="4"  stroke="#7c3aed" strokeWidth="1.3" fill="none" transform="rotate(8,62,72)"/>
        <ellipse cx="65" cy="86"  rx="4" ry="7"  stroke="#9d7ede" strokeWidth="1.3" fill="none" transform="rotate(-12,65,86)"/>
        <ellipse cx="61" cy="100" rx="7" ry="4"  stroke="#7c3aed" strokeWidth="1.3" fill="none" transform="rotate(8,61,100)"/>
        <ellipse cx="64" cy="114" rx="4" ry="7"  stroke="#9d7ede" strokeWidth="1.3" fill="none" transform="rotate(-12,64,114)"/>
        {/* Chain end loop */}
        <circle cx="62" cy="128" r="4" fill="none" stroke="#6d28d9" strokeWidth="1.2" opacity="0.7"/>
      </svg>
    </div>

    {/* ── Bottom-right: spray-paint dripping heart ── */}
    <div className="absolute bottom-0 right-0 pointer-events-none select-none" style={{ transform: 'translate(10px, 10px)', zIndex: 20 }}>
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-br" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Spray paint texture via turbulence */}
          <filter id="spray">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        {/* Heart shape with spray paint look */}
        <path d="M44,20 C44,14 34,10 30,18 C26,26 36,35 44,44 C52,35 62,26 58,18 C54,10 44,14 44,20 Z"
              fill="rgba(109,40,217,0.30)" stroke="#8b5cf6" strokeWidth="2"
              filter="url(#glow-br)" strokeLinejoin="round"/>
        {/* Spray edge (slightly rough) */}
        <path d="M44,20 C44,14 34,10 30,18 C26,26 36,35 44,44 C52,35 62,26 58,18 C54,10 44,14 44,20 Z"
              fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.4"/>
        {/* Main drip */}
        <path d="M40,44 C39,55 41,62 39,70" stroke="#8b5cf6" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow-br)"/>
        <ellipse cx="39" cy="72" rx="3.5" ry="4.5" fill="#8b5cf6" filter="url(#glow-br)"/>
        {/* Second drip */}
        <path d="M50,43 C51,52 49,57 51,64" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"/>
        <ellipse cx="51" cy="65.5" rx="2.8" ry="3.5" fill="#7c3aed"/>
        {/* Thin drip */}
        <path d="M33,41 C32,48 34,53 32,58" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" opacity="0.75"/>
        <circle cx="32" cy="59.5" r="2.2" fill="#a78bfa" opacity="0.75"/>
        {/* Tiny splash dots */}
        <circle cx="57" cy="38" r="1.2" fill="#8b5cf6" opacity="0.5"/>
        <circle cx="60" cy="30" r="0.9" fill="#6d28d9" opacity="0.4"/>
        <circle cx="27" cy="36" r="1" fill="#8b5cf6" opacity="0.45"/>
      </svg>
    </div>

    {/* ── Left side subtle scratches ── */}
    <div className="absolute left-0 top-1/3 pointer-events-none select-none" style={{ zIndex: 20 }}>
      <svg width="18" height="160" viewBox="0 0 18 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6,8 L11,18 M5,32 L13,40 M7,58 L10,70 M5,92 L12,102 M6,124 L11,136 M7,148 L10,156"
              stroke="#6d28d9" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"/>
        <path d="M4,22 L14,24 M4,75 L14,73 M4,112 L14,114"
              stroke="#8b5cf6" strokeWidth="0.5" strokeLinecap="round" opacity="0.2"/>
      </svg>
    </div>

    {/* ── Right side subtle scratches ── */}
    <div className="absolute right-0 top-1/3 pointer-events-none select-none" style={{ zIndex: 20 }}>
      <svg width="18" height="160" viewBox="0 0 18 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,8 L7,18 M13,32 L5,40 M11,58 L8,70 M13,92 L6,102 M12,124 L7,136 M11,148 L8,156"
              stroke="#6d28d9" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"/>
        <path d="M14,22 L4,24 M14,75 L4,73 M14,112 L4,114"
              stroke="#8b5cf6" strokeWidth="0.5" strokeLinecap="round" opacity="0.2"/>
      </svg>
    </div>
  </>
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
