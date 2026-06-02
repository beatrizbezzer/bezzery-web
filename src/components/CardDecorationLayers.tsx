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
  <div
    className="absolute inset-0 pointer-events-none select-none"
    style={{ zIndex: 20, overflow: 'visible', borderRadius: 'inherit' }}
  >

    {/* === Main solid grunge frame === */}
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 400 560"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Rough inner-edge displacement */}
        <filter id="ef3-rough" x="-8%" y="-4%" width="116%" height="108%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.025" numOctaves="3" seed="11" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        {/* Frame mask: white full card, black center cutout (with rough edge) */}
        <mask id="ef3-mask">
          <rect width="400" height="560" fill="white"/>
          <rect x="32" y="28" width="336" height="504" rx="6" fill="black" filter="url(#ef3-rough)"/>
        </mask>
      </defs>

      {/* Solid dark-purple frame body */}
      <rect width="400" height="560" fill="#160030" mask="url(#ef3-mask)"/>

      {/* Outer edge subtle purple sheen */}
      <rect width="400" height="560" fill="none" stroke="#3a0a66" strokeWidth="3"/>

      {/* Inner-edge rough glow line */}
      <rect
        x="32" y="28" width="336" height="504" rx="6"
        fill="none" stroke="#5b21b6" strokeWidth="1.6"
        filter="url(#ef3-rough)" opacity="0.55"
      />

      {/* Grunge scratch marks scattered on frame */}
      <path d="M5,88 L13,84 M6,98 L10,103" stroke="#3d0d70" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
      <path d="M5,260 L14,257 M7,272 L12,276" stroke="#2d0054" strokeWidth="0.7" strokeLinecap="round" opacity="0.45"/>
      <path d="M395,185 L386,182 M394,198 L388,202" stroke="#3d0d70" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
      <path d="M140,4 L138,13 M156,5 L160,10" stroke="#2d0054" strokeWidth="0.7" strokeLinecap="round" opacity="0.45"/>
      <path d="M220,555 L222,546 M236,556 L235,549" stroke="#3d0d70" strokeWidth="0.7" strokeLinecap="round" opacity="0.45"/>
      <path d="M5,420 L11,417 M6,432 L10,436" stroke="#2d0054" strokeWidth="0.7" strokeLinecap="round" opacity="0.4"/>
      <path d="M395,360 L387,357 M394,372 L389,375" stroke="#3d0d70" strokeWidth="0.7" strokeLinecap="round" opacity="0.4"/>
    </svg>

    {/* === TOP-LEFT: outlined star + camera === */}
    <div className="absolute top-0 left-0" style={{ zIndex: 22 }}>
      <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef3-tl-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Star - hand-drawn outline, two-trace */}
        <path d="M22,5 L26.5,16.5 L39,17 L30,24.5 L33,36 L22,29.5 L11,36 L14,24.5 L5,17 L17.5,16.5 Z"
              fill="none" stroke="#8b5cf6" strokeWidth="2.3" strokeLinejoin="round"
              filter="url(#ef3-tl-glow)"/>
        <path d="M22,8 L25.5,18 L37,18.5 L28.5,25.5 L31,35 L22,29 L13,35 L15.5,25.5 L7,18.5 L18.5,18 Z"
              fill="none" stroke="#a78bfa" strokeWidth="0.9" strokeLinejoin="round" opacity="0.3"/>
        {/* Camera body */}
        <rect x="4" y="47" width="24" height="17" rx="3" stroke="#7c3aed" strokeWidth="1.7" fill="rgba(91,33,182,0.13)"/>
        {/* Lens */}
        <circle cx="16" cy="55.5" r="5.5" stroke="#8b5cf6" strokeWidth="1.5" fill="rgba(91,33,182,0.2)"/>
        <circle cx="16" cy="55.5" r="2.5" fill="#6d28d9" opacity="0.75"/>
        {/* Viewfinder bump */}
        <rect x="21" y="43.5" width="6" height="4.5" rx="1.2" stroke="#7c3aed" strokeWidth="1.3" fill="none"/>
        {/* Flash dot */}
        <circle cx="7.5" cy="51" r="1.3" fill="#4c1d95" opacity="0.65"/>
      </svg>
    </div>

    {/* === TOP-RIGHT: safety pin + chain + tag === */}
    <div className="absolute top-0 right-0" style={{ zIndex: 22 }}>
      <svg width="88" height="178" viewBox="0 0 88 178" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef3-pin-glow" x="-50%" y="-20%" width="200%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Safety pin */}
        <g filter="url(#ef3-pin-glow)">
          {/* Needle */}
          <line x1="70" y1="46" x2="70" y2="82" stroke="#ddd6fe" strokeWidth="2.6" strokeLinecap="round"/>
          {/* Head loop */}
          <circle cx="70" cy="45" r="5.5" fill="none" stroke="#e9d5ff" strokeWidth="2.3"/>
          <circle cx="70" cy="45" r="2.4" fill="#c4b5fd"/>
          {/* Guard/clasp */}
          <path d="M70,82 C70,94 55,94 55,82 L55,61 C55,53 63,50 67,55.5 L70,61"
                fill="rgba(91,33,182,0.2)" stroke="#c4b5fd" strokeWidth="1.9" strokeLinecap="round"/>
          {/* Tip */}
          <line x1="70" y1="82" x2="71.5" y2="89" stroke="#e9d5ff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85"/>
        </g>

        {/* Chain links — alternating orientation */}
        <ellipse cx="64" cy="106" rx="4.5" ry="8" fill="rgba(91,33,182,0.14)" stroke="#a78bfa" strokeWidth="1.6" transform="rotate(-12,64,106)"/>
        <ellipse cx="62" cy="122" rx="8" ry="4.5" fill="rgba(91,33,182,0.12)" stroke="#8b5cf6" strokeWidth="1.6" transform="rotate(6,62,122)"/>
        <ellipse cx="64" cy="138" rx="4.5" ry="8" fill="rgba(91,33,182,0.14)" stroke="#a78bfa" strokeWidth="1.6" transform="rotate(-12,64,138)"/>
        <ellipse cx="62" cy="154" rx="8" ry="4.5" fill="rgba(91,33,182,0.12)" stroke="#8b5cf6" strokeWidth="1.6" transform="rotate(6,62,154)"/>

        {/* Tag */}
        <rect x="46" y="160" width="28" height="20" rx="3" fill="rgba(18,0,42,0.8)" stroke="#7c3aed" strokeWidth="1.6"/>
        <path d="M50,177 L50,163 L58,177 L58,163" stroke="#9f7aea" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="71" cy="164" r="2" fill="none" stroke="#5b21b6" strokeWidth="1.1"/>
      </svg>
    </div>

    {/* === BOTTOM-LEFT: two dripping hearts === */}
    <div className="absolute bottom-0 left-0" style={{ zIndex: 22 }}>
      <svg width="82" height="76" viewBox="0 0 82 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef3-bl-glow" x="-50%" y="-60%" width="200%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Heart 1 — larger, left */}
        <path d="M20,54 C11,45 3,37 3,29.5 C3,24.5 6.5,21 11.5,21 C14,21 16.5,22.5 18,25 C19.5,22.5 22,21 24.5,21 C29.5,21 33,24.5 33,29.5 C33,37 25,54 20,54 Z"
              fill="none" stroke="#8b5cf6" strokeWidth="2.3" strokeLinejoin="round"
              filter="url(#ef3-bl-glow)"/>
        {/* Drips 1 */}
        <path d="M17,54 Q16.5,60 16,65 Q15.7,69.5 16,72" stroke="#7c3aed" strokeWidth="2.1" strokeLinecap="round"/>
        <path d="M22,56 Q22,62 21.5,66" stroke="#7c3aed" strokeWidth="1.7" strokeLinecap="round"/>
        <ellipse cx="16" cy="73" rx="2.2" ry="1.3" fill="#5b21b6" opacity="0.85"/>
        <ellipse cx="21.5" cy="67.5" rx="1.6" ry="1.1" fill="#5b21b6" opacity="0.65"/>

        {/* Heart 2 — smaller, slightly right */}
        <path d="M44,51 C37,43.5 31,37 31,31.5 C31,27.5 34,24.5 37,24.5 C38.7,24.5 40.3,25.7 41.5,27.3 C42.7,25.7 44.3,24.5 46,24.5 C49,24.5 52,27.5 52,31.5 C52,37 46,51 44,51 Z"
              fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinejoin="round"/>
        {/* Drips 2 */}
        <path d="M42,51 Q41.5,57 41,62" stroke="#8b5cf6" strokeWidth="1.7" strokeLinecap="round"/>
        <path d="M46,53 Q46,58 45.5,62" stroke="#8b5cf6" strokeWidth="1.4" strokeLinecap="round"/>
        <ellipse cx="41" cy="63.5" rx="1.7" ry="1.1" fill="#7c3aed" opacity="0.65"/>
        <ellipse cx="45.5" cy="63" rx="1.4" ry="1" fill="#7c3aed" opacity="0.55"/>
      </svg>
    </div>

    {/* === BOTTOM-RIGHT: dripping heart === */}
    <div className="absolute bottom-0 right-0" style={{ zIndex: 22 }}>
      <svg width="62" height="66" viewBox="0 0 62 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ef3-br-glow" x="-60%" y="-50%" width="220%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M36,50 C27.5,41.5 19,34 19,26.5 C19,21.5 22.5,18 27.5,18 C30,18 32.5,19.5 34,22 C35.5,19.5 38,18 40.5,18 C45.5,18 49,21.5 49,26.5 C49,34 40.5,50 36,50 Z"
              fill="none" stroke="#8b5cf6" strokeWidth="2.3" strokeLinejoin="round"
              filter="url(#ef3-br-glow)"/>
        {/* Drips */}
        <path d="M33,50 Q32.5,57 32,62" stroke="#7c3aed" strokeWidth="2.1" strokeLinecap="round"/>
        <path d="M38,52 Q38,58 37.5,63" stroke="#7c3aed" strokeWidth="1.7" strokeLinecap="round"/>
        <ellipse cx="32" cy="63.5" rx="2.2" ry="1.3" fill="#5b21b6" opacity="0.85"/>
        <ellipse cx="37.5" cy="64" rx="1.7" ry="1.1" fill="#5b21b6" opacity="0.65"/>
      </svg>
    </div>

    {/* Subtle outer purple glow */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ borderRadius: 'inherit', boxShadow: '0 0 28px rgba(91,33,182,0.25)' }}
    />
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
