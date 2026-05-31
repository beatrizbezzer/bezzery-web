import React from 'react'

type TagVariant = 'electric' | 'violet' | 'pink'

interface TagProps {
  children: React.ReactNode
  variant?: TagVariant
  className?: string
}

const variantClasses: Record<TagVariant, string> = {
  electric: 'bg-bz-electric/10 text-bz-electric border-bz-electric/30',
  violet: 'bg-bz-violet/10 text-bz-violet border-bz-violet/30',
  pink: 'bg-bz-pink/10 text-bz-pink border-bz-pink/30',
}

const variantIndex: TagVariant[] = ['electric', 'violet', 'pink']

export const Tag: React.FC<TagProps> = ({ children, variant, className = '' }) => {
  const resolvedVariant = variant ?? variantIndex[0]

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono border',
        variantClasses[resolvedVariant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}

export const autoVariant = (index: number): TagVariant => {
  return variantIndex[index % variantIndex.length]
}
