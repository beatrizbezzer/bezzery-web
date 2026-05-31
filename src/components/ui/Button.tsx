import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-bz-electric text-bz-black font-semibold hover:bg-opacity-90 hover:shadow-[0_0_20px_rgba(0,245,196,0.4)] active:scale-95',
  secondary:
    'bg-transparent border border-bz-electric text-bz-electric hover:bg-bz-electric hover:bg-opacity-10 hover:shadow-[0_0_16px_rgba(0,245,196,0.2)] active:scale-95',
  ghost:
    'bg-transparent border border-bz-violet text-bz-violet hover:bg-bz-violet hover:bg-opacity-10 hover:shadow-[0_0_16px_rgba(123,79,255,0.2)] active:scale-95',
  danger:
    'bg-transparent border border-bz-pink text-bz-pink hover:bg-bz-pink hover:bg-opacity-10 hover:shadow-[0_0_16px_rgba(255,62,157,0.2)] active:scale-95',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-grotesk font-semibold transition-all duration-200 cursor-pointer select-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
