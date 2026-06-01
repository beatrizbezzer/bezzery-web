import React from 'react'

interface ProfileEffectProps {
  effect: string | null | undefined
}

export const EFFECTS: { id: string; label: string }[] = [
  { id: 'glitch', label: 'Glitch' },
  { id: 'flicker', label: 'Flicker' },
]

export const ProfileEffect: React.FC<ProfileEffectProps> = ({ effect }) => {
  if (!effect) return null

  switch (effect) {
    case 'glitch':
      return (
        <>
          <style>{`
            @keyframes bz-glitch-slice {
              0%,89%,100% { clip-path: inset(0 0 100% 0); opacity: 0; transform: translateX(0); }
              90% { clip-path: inset(20% 0 60% 0); opacity: 1; transform: translateX(-6px); }
              91% { clip-path: inset(55% 0 20% 0); opacity: 1; transform: translateX(6px); }
              92% { clip-path: inset(40% 0 40% 0); opacity: 1; transform: translateX(-3px); }
              93% { clip-path: inset(70% 0 5%  0); opacity: 1; transform: translateX(4px); }
              94% { clip-path: inset(10% 0 80% 0); opacity: 1; transform: translateX(-2px); }
              95% { clip-path: inset(0 0 100% 0); opacity: 0; transform: translateX(0); }
            }
            @keyframes bz-glitch-rgb {
              0%,87%,100% { opacity: 0; transform: translateX(0); }
              88% { opacity: 0.5; transform: translateX(-4px); }
              89% { opacity: 0.4; transform: translateX(4px); }
              90% { opacity: 0.3; transform: translateX(-2px); }
              91% { opacity: 0; }
            }
            @keyframes bz-glitch-rgb2 {
              0%,91%,100% { opacity: 0; transform: translateX(0); }
              92% { opacity: 0.4; transform: translateX(5px); }
              93% { opacity: 0.3; transform: translateX(-5px); }
              94% { opacity: 0; }
            }
          `}</style>

          {/* Scanlines */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
          }} />

          {/* Glitch slice — displaces a horizontal band */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,245,196,0.07) 0%, rgba(124,58,237,0.07) 100%)',
            animation: 'bz-glitch-slice 7s steps(1) infinite',
          }} />

          {/* RGB aberration red */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(255,0,60,0.12), transparent 50%, transparent)',
            animation: 'bz-glitch-rgb 7s steps(1) infinite 0.3s',
            mixBlendMode: 'screen',
          }} />

          {/* RGB aberration blue */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent 50%, rgba(0,100,255,0.12), transparent)',
            animation: 'bz-glitch-rgb2 7s steps(1) infinite 0.6s',
            mixBlendMode: 'screen',
          }} />
        </>
      )

    case 'flicker':
      return (
        <>
          <style>{`
            @keyframes bz-flicker-glow {
              0%,100% { opacity: 0.12; }
              8%  { opacity: 0.06; }
              9%  { opacity: 0.18; }
              10% { opacity: 0.04; }
              11% { opacity: 0.14; }
              40% { opacity: 0.12; }
              41% { opacity: 0.02; }
              42% { opacity: 0.16; }
              43% { opacity: 0.12; }
              75% { opacity: 0.10; }
              76% { opacity: 0.00; }
              77% { opacity: 0.14; }
              78% { opacity: 0.08; }
              79% { opacity: 0.16; }
              80% { opacity: 0.12; }
            }
            @keyframes bz-flicker-line {
              0%,100% { opacity: 0.04; transform: translateY(0); }
              9%  { opacity: 0.10; transform: translateY(-2px); }
              10% { opacity: 0.01; }
              41% { opacity: 0.08; transform: translateY(1px); }
              42% { opacity: 0.00; }
              76% { opacity: 0.07; transform: translateY(-1px); }
              77% { opacity: 0.00; }
            }
          `}</style>

          {/* Main flicker glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(0,245,196,0.22) 0%, transparent 65%)',
            animation: 'bz-flicker-glow 4s linear infinite',
          }} />

          {/* Horizontal shimmer line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '15%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,245,196,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(0,245,196,0.4) 70%, transparent)',
            animation: 'bz-flicker-line 4s linear infinite',
            filter: 'blur(1px)',
          }} />

          {/* Bottom vignette that pulses */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 30% at 50% 85%, rgba(124,58,237,0.08) 0%, transparent 70%)',
            animation: 'bz-flicker-glow 4s linear infinite 2s',
          }} />
        </>
      )

    default:
      return null
  }
}
