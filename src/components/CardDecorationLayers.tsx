import React from 'react'

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
