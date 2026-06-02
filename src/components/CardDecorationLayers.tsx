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
  <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 20, overflow: 'visible', borderRadius: 'inherit' }}>

    {/* ── TOP torn fabric strip ── */}
    <div className="absolute top-0 left-0 right-0" style={{ height: 52 }}>
      <svg width="100%" height="52" viewBox="0 0 600 52" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef-rip-top" x="-4%" y="-20%" width="108%" height="160%">
            <feTurbulence type="turbulence" baseFrequency="0.065 0.035" numOctaves="4" seed="9" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <linearGradient id="ef-grad-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2e0654" stopOpacity="1"/>
            <stop offset="50%"  stopColor="#5b21b6" stopOpacity="0.95"/>
            <stop offset="78%"  stopColor="#7c3aed" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="600" height="52" fill="url(#ef-grad-top)" filter="url(#ef-rip-top)"/>
        {/* Fray threads */}
        <path d="M80,38 L77,50 M160,36 L163,47 M260,37 L258,49 M360,36 L363,48 M460,37 L457,49 M520,38 L523,50"
              stroke="#a78bfa" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
      </svg>
    </div>

    {/* ── BOTTOM torn fabric strip ── */}
    <div className="absolute bottom-0 left-0 right-0" style={{ height: 52 }}>
      <svg width="100%" height="52" viewBox="0 0 600 52" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef-rip-bot" x="-4%" y="-40%" width="108%" height="160%">
            <feTurbulence type="turbulence" baseFrequency="0.065 0.035" numOctaves="4" seed="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <linearGradient id="ef-grad-bot" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#2e0654" stopOpacity="1"/>
            <stop offset="50%"  stopColor="#5b21b6" stopOpacity="0.95"/>
            <stop offset="78%"  stopColor="#7c3aed" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="600" height="52" fill="url(#ef-grad-bot)" filter="url(#ef-rip-bot)"/>
        <path d="M90,14 L88,4 M200,15 L203,5 M310,14 L307,4 M420,15 L423,5 M510,14 L508,4"
              stroke="#a78bfa" strokeWidth="0.7" strokeLinecap="round" opacity="0.45"/>
      </svg>
    </div>

    {/* ── LEFT torn fabric strip ── */}
    <div className="absolute top-0 left-0 bottom-0" style={{ width: 46 }}>
      <svg width="46" height="100%" viewBox="0 0 46 500" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef-rip-left" x="-20%" y="-4%" width="160%" height="108%">
            <feTurbulence type="turbulence" baseFrequency="0.035 0.065" numOctaves="4" seed="6" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <linearGradient id="ef-grad-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#2e0654" stopOpacity="1"/>
            <stop offset="55%"  stopColor="#5b21b6" stopOpacity="0.95"/>
            <stop offset="80%"  stopColor="#7c3aed" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="46" height="500" fill="url(#ef-grad-left)" filter="url(#ef-rip-left)"/>
        <path d="M32,80 L42,78 M31,180 L41,182 M32,280 L42,278 M31,380 L41,382"
              stroke="#a78bfa" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
      </svg>
    </div>

    {/* ── RIGHT torn fabric strip ── */}
    <div className="absolute top-0 right-0 bottom-0" style={{ width: 46 }}>
      <svg width="46" height="100%" viewBox="0 0 46 500" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef-rip-right" x="-40%" y="-4%" width="160%" height="108%">
            <feTurbulence type="turbulence" baseFrequency="0.035 0.065" numOctaves="4" seed="14" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <linearGradient id="ef-grad-right" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%"   stopColor="#2e0654" stopOpacity="1"/>
            <stop offset="55%"  stopColor="#5b21b6" stopOpacity="0.95"/>
            <stop offset="80%"  stopColor="#7c3aed" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="46" height="500" fill="url(#ef-grad-right)" filter="url(#ef-rip-right)"/>
        <path d="M14,80 L4,78 M15,180 L5,182 M14,280 L4,278 M15,380 L5,382"
              stroke="#a78bfa" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
      </svg>
    </div>

    {/* ── TOP-LEFT: paint star + scrawl marks ── */}
    <div className="absolute top-0 left-0" style={{ zIndex: 22 }}>
      <svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef-star-tl" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Second trace — scribble shadow */}
        <path d="M34,7 L38,19.5 L52,20 L42,28 L45.5,40.5 L34,33.5 L22.5,40.5 L26,28 L16,20 L30,19.5 Z"
              stroke="#4c1d95" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.6"/>
        {/* Main star with paint glow */}
        <path d="M34,5 L38,18 L52,18.5 L42,26.5 L45.5,39 L34,32 L22.5,39 L26,26.5 L16,18.5 L30,18 Z"
              fill="rgba(91,33,182,0.2)" stroke="#c4b5fd" strokeWidth="2.2" strokeLinejoin="round"
              filter="url(#ef-star-tl)"/>
        {/* Rough brush inner highlight */}
        <path d="M34,10 L37,19.5 L48,20 L40,26 L43,36 L34,30 L25,36 L28,26 L20,20 L31,19.5 Z"
              fill="none" stroke="#a78bfa" strokeWidth="0.9" strokeLinejoin="round" opacity="0.4"/>
        {/* Scrawl marks */}
        <path d="M56,10 L63,8 M54,17 L64,15" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
        <path d="M10,54 L18,56 M8,62 L17,63" stroke="#6d28d9" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
        <text x="60" y="14" fill="#a78bfa" fontSize="10" opacity="0.6" fontFamily="Georgia, serif">×</text>
        <text x="9" y="48" fill="#7c3aed" fontSize="8" opacity="0.5" fontFamily="Georgia, serif">×</text>
      </svg>
    </div>

    {/* ── TOP-RIGHT: paint star + safety pin + chain ── */}
    <div className="absolute top-0 right-0" style={{ zIndex: 22 }}>
      <svg width="90" height="200" viewBox="0 0 90 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef-star-tr" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="ef-pin-glow" x="-60%" y="-20%" width="220%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Star — top right corner */}
        <path d="M52,7 L56,19 L70,19.5 L60,27.5 L63.5,40 L52,33 L40.5,40 L44,27.5 L34,19.5 L48,19 Z"
              fill="rgba(91,33,182,0.2)" stroke="#c4b5fd" strokeWidth="2.2" strokeLinejoin="round"
              filter="url(#ef-star-tr)"/>
        <path d="M52,10 L55.5,20 L68,20.5 L58.5,28 L62,38 L52,31.5 L42,38 L45.5,28 L36,20.5 L48.5,20 Z"
              fill="none" stroke="#8b5cf6" strokeWidth="0.8" strokeLinejoin="round" opacity="0.4"/>

        {/* Safety pin — metallic */}
        <g filter="url(#ef-pin-glow)">
          {/* Needle shaft */}
          <line x1="76" y1="52" x2="76" y2="90" stroke="#e9d5ff" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Head loop */}
          <circle cx="76" cy="52" r="5" fill="none" stroke="#e9d5ff" strokeWidth="2.2"/>
          <circle cx="76" cy="52" r="2.2" fill="#ddd6fe"/>
          {/* Clasp/guard */}
          <path d="M76,90 C76,101 62,101 62,90 L62,68 C62,60 69,57 72.5,62 L76,67"
                fill="rgba(91,33,182,0.15)" stroke="#c4b5fd" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Pin tip */}
          <path d="M76,90 L77.5,96" stroke="#e9d5ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
        </g>

        {/* Chain links */}
        <g>
          <ellipse cx="71" cy="110" rx="4.5" ry="8"   fill="rgba(91,33,182,0.12)" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(-12,71,110)"/>
          <ellipse cx="68" cy="127" rx="8"   ry="4.5" fill="rgba(91,33,182,0.12)" stroke="#8b5cf6" strokeWidth="1.5" transform="rotate(6,68,127)"/>
          <ellipse cx="71" cy="144" rx="4.5" ry="8"   fill="rgba(91,33,182,0.12)" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(-12,71,144)"/>
          <ellipse cx="68" cy="161" rx="8"   ry="4.5" fill="rgba(91,33,182,0.12)" stroke="#8b5cf6" strokeWidth="1.5" transform="rotate(6,68,161)"/>
          <ellipse cx="71" cy="178" rx="4.5" ry="8"   fill="rgba(91,33,182,0.12)" stroke="#a78bfa" strokeWidth="1.5" transform="rotate(-12,71,178)"/>
          {/* End jewel */}
          <circle cx="69" cy="192" r="6" fill="rgba(91,33,182,0.2)" stroke="#8b5cf6" strokeWidth="1.4"/>
          <circle cx="69" cy="192" r="3" fill="#7c3aed" opacity="0.7"/>
        </g>

        {/* Scrawl mark near star */}
        <text x="18" y="20" fill="#6d28d9" fontSize="9" opacity="0.5" fontFamily="Georgia, serif">×</text>
      </svg>
    </div>

    {/* ── BOTTOM-LEFT: small accent star ── */}
    <div className="absolute bottom-0 left-0" style={{ zIndex: 22 }}>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef-star-bl" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M26,54 L29,45 L38,44.5 L31.5,39.5 L34,31 L26,36 L18,31 L20.5,39.5 L14,44.5 L23,45 Z"
              fill="rgba(91,33,182,0.18)" stroke="#a78bfa" strokeWidth="1.8" strokeLinejoin="round"
              filter="url(#ef-star-bl)"/>
        <text x="38" y="58" fill="#8b5cf6" fontSize="8" opacity="0.45" fontFamily="Georgia, serif">×</text>
      </svg>
    </div>

    {/* ── Outer glow ring (CSS ring applied via wrapper, this adds inner edge shimmer) ── */}
    <div className="absolute inset-0 pointer-events-none" style={{
      borderRadius: 'inherit',
      boxShadow: 'inset 0 0 18px rgba(109,40,217,0.18)',
    }}/>
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
