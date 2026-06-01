export interface ProfileBackground {
  id: string
  label: string
  url: string
}

// Add new images here as they're added to public/profile-backgrounds/
export const PROFILE_BACKGROUNDS: ProfileBackground[] = [
  { id: 'emo-1', label: 'Violet Decay', url: '/profile-backgrounds/emo-1.png' },
  { id: 'aqua-nocturne', label: 'Aqua Nocturne', url: '/profile-backgrounds/aqua-nocturne.png' },
  { id: 'las-noches', label: 'Las Noches', url: '/profile-backgrounds/las-noches.png' },
]
