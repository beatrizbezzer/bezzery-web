export interface CardDecoration {
  id: string
  label: string
}

export const CARD_BORDERS: CardDecoration[] = [
  { id: 'emo-frame', label: 'Purple Stars' },
  { id: 'violet-glow', label: 'Violet Glow' },
  { id: 'electric-glow', label: 'Electric Glow' },
  { id: 'neon-pink', label: 'Neon Pink' },
  { id: 'gradient-vp', label: 'Violet Dream' },
]

export const CARD_STICKERS: CardDecoration[] = [
  { id: 'sparkles', label: 'Sparkles' },
  { id: 'skulls', label: 'Skulls' },
]

export const CARD_OVERLAYS: CardDecoration[] = [
  { id: 'scanlines', label: 'Scanlines' },
]

export function getBorderShadow(borderId: string | null | undefined): string | null {
  const shadows: Record<string, string> = {
    'violet-glow': '0 0 0 1.5px rgba(139,92,246,0.65), 0 0 40px rgba(139,92,246,0.2)',
    'electric-glow': '0 0 0 1.5px rgba(0,200,255,0.65), 0 0 40px rgba(0,200,255,0.2)',
    'neon-pink': '0 0 0 1.5px rgba(236,72,153,0.65), 0 0 40px rgba(236,72,153,0.2)',
  }
  return borderId ? (shadows[borderId] ?? null) : null
}
