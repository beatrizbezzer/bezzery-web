import React, { useEffect, useState } from 'react'

export const SplashScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 400)
    const t2 = setTimeout(() => setPhase('out'), 1600)
    const t3 = setTimeout(() => onDone(), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-bz-black"
      style={{
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.6s ease' : undefined,
        pointerEvents: 'none',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,245,196,0.07) 0%, transparent 70%)',
          opacity: phase === 'hold' ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'scale(0.85)' : phase === 'out' ? 'scale(1.08)' : 'scale(1)',
          transition: phase === 'in'
            ? 'opacity 0.5s ease, transform 0.5s ease'
            : phase === 'out'
            ? 'opacity 0.5s ease, transform 0.6s ease'
            : undefined,
        }}
      >
        <span
          className="font-syne font-extrabold tracking-tight select-none"
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            background: 'linear-gradient(135deg, #00f5c4 0%, #7c3aed 50%, #ff2d78 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: phase === 'hold' ? 'drop-shadow(0 0 32px rgba(0,245,196,0.35))' : 'none',
            transition: 'filter 0.4s ease',
          }}
        >
          bezzery
        </span>
      </div>
    </div>
  )
}
