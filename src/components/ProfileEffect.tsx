import React from 'react'

interface ProfileEffectProps {
  effect: string | null | undefined
}

export const EFFECTS: { id: string; label: string }[] = [
  // effects are added here as they're implemented
]

export const ProfileEffect: React.FC<ProfileEffectProps> = ({ effect }) => {
  if (!effect) return null

  // Each effect is a case below
  switch (effect) {
    default:
      return null
  }
}
