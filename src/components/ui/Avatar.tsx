import React from 'react'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getGradient(name?: string): string {
  const gradients = [
    'from-bz-electric to-bz-violet',
    'from-bz-violet to-bz-pink',
    'from-bz-pink to-bz-electric',
    'from-bz-electric to-bz-pink',
  ]
  if (!name) return gradients[0]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.removeAttribute('style') }}
        className={[
          'rounded-full object-cover flex-shrink-0',
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    )
  }

  return (
    <div
      className={[
        'rounded-full flex items-center justify-center flex-shrink-0 font-syne font-bold bg-gradient-to-br',
        getGradient(name),
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ color: '#080810' }}
    >
      {getInitials(name)}
    </div>
  )
}
