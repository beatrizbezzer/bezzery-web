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

/* ─── Safety Pins Border ────────────────────────────────────────────────── */

const SafetyPin: React.FC = () => (
  <svg width="10" height="26" viewBox="0 0 10 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="5" y1="23" x2="5" y2="4" stroke="#ccc8dc" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="5" cy="3.5" r="3" fill="none" stroke="#e0dcea" strokeWidth="1.7"/>
    <circle cx="5" cy="3.5" r="1.3" fill="#b8b4cc"/>
    <path d="M5,23 C5,30 0,30 0,23 L0,12 C0,7.5 3.5,6 4.5,9.5 L5,12"
          fill="rgba(60,50,80,0.28)" stroke="#a89ec0" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="5" y1="23" x2="5.7" y2="27" stroke="#e0dcea" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
  </svg>
)

export const SafetyPinsBorderLayer: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 20, overflow: 'visible' }}>
    {[16, 33, 50, 67, 84].map(p => (
      <div key={`pt${p}`} className="absolute" style={{ top: -9, left: `${p}%`, transform: 'translateX(-50%)' }}>
        <SafetyPin />
      </div>
    ))}
    {[16, 33, 50, 67, 84].map(p => (
      <div key={`pb${p}`} className="absolute" style={{ bottom: -9, left: `${p}%`, transform: 'translateX(-50%) rotate(180deg)' }}>
        <SafetyPin />
      </div>
    ))}
    {[20, 40, 60, 80].map(p => (
      <div key={`pl${p}`} className="absolute" style={{ left: -9, top: `${p}%`, transform: 'translateY(-50%) rotate(-90deg)' }}>
        <SafetyPin />
      </div>
    ))}
    {[20, 40, 60, 80].map(p => (
      <div key={`pr${p}`} className="absolute" style={{ right: -9, top: `${p}%`, transform: 'translateY(-50%) rotate(90deg)' }}>
        <SafetyPin />
      </div>
    ))}
  </div>
)

/* ─── Dark Chain Border ──────────────────────────────────────────────────── */

export const ChainDarkBorderLayer: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 20, overflow: 'visible' }}>
    {/* Top */}
    <div className="absolute left-0 right-0" style={{ top: -7, height: 14 }}>
      <svg width="100%" height="14" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cd-top" x="0" y="0" width="22" height="14" patternUnits="userSpaceOnUse">
            <ellipse cx="6"  cy="7" rx="5" ry="3" fill="rgba(55,45,72,0.35)" stroke="#5c4e70" strokeWidth="1.6" transform="rotate(25 6 7)"/>
            <ellipse cx="16" cy="7" rx="5" ry="3" fill="rgba(55,45,72,0.35)" stroke="#4a3d5e" strokeWidth="1.6" transform="rotate(-25 16 7)"/>
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#cd-top)"/>
      </svg>
    </div>
    {/* Bottom */}
    <div className="absolute left-0 right-0" style={{ bottom: -7, height: 14 }}>
      <svg width="100%" height="14" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cd-bot" x="0" y="0" width="22" height="14" patternUnits="userSpaceOnUse">
            <ellipse cx="6"  cy="7" rx="5" ry="3" fill="rgba(55,45,72,0.35)" stroke="#5c4e70" strokeWidth="1.6" transform="rotate(-25 6 7)"/>
            <ellipse cx="16" cy="7" rx="5" ry="3" fill="rgba(55,45,72,0.35)" stroke="#4a3d5e" strokeWidth="1.6" transform="rotate(25 16 7)"/>
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#cd-bot)"/>
      </svg>
    </div>
    {/* Left */}
    <div className="absolute top-0 bottom-0" style={{ left: -7, width: 14 }}>
      <svg height="100%" width="14" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cd-left" x="0" y="0" width="14" height="22" patternUnits="userSpaceOnUse">
            <ellipse cx="7" cy="6"  rx="3" ry="5" fill="rgba(55,45,72,0.35)" stroke="#5c4e70" strokeWidth="1.6" transform="rotate(25 7 6)"/>
            <ellipse cx="7" cy="16" rx="3" ry="5" fill="rgba(55,45,72,0.35)" stroke="#4a3d5e" strokeWidth="1.6" transform="rotate(-25 7 16)"/>
          </pattern>
        </defs>
        <rect width="14" height="100%" fill="url(#cd-left)"/>
      </svg>
    </div>
    {/* Right */}
    <div className="absolute top-0 bottom-0" style={{ right: -7, width: 14 }}>
      <svg height="100%" width="14" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cd-right" x="0" y="0" width="14" height="22" patternUnits="userSpaceOnUse">
            <ellipse cx="7" cy="6"  rx="3" ry="5" fill="rgba(55,45,72,0.35)" stroke="#5c4e70" strokeWidth="1.6" transform="rotate(-25 7 6)"/>
            <ellipse cx="7" cy="16" rx="3" ry="5" fill="rgba(55,45,72,0.35)" stroke="#4a3d5e" strokeWidth="1.6" transform="rotate(25 7 16)"/>
          </pattern>
        </defs>
        <rect width="14" height="100%" fill="url(#cd-right)"/>
      </svg>
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
