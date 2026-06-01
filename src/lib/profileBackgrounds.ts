export interface ProfileBackground {
  id: string
  label: string
  url: string
}

// Add new images here as they're added to public/profile-backgrounds/
export const PROFILE_BACKGROUNDS: ProfileBackground[] = [
  { id: 'emo-1', label: 'Emo 1', url: '/profile-backgrounds/emo-1.png' },
]
