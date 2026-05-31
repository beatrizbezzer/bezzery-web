import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const baseInputClasses =
  'w-full bg-bz-surface border border-bz-card text-bz-white placeholder-bz-white/30 font-grotesk rounded-lg px-4 py-3 text-sm transition-all duration-200 outline-none focus:border-bz-electric focus:ring-1 focus:ring-bz-electric/30 focus:shadow-[0_0_12px_rgba(0,245,196,0.15)]'

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-mono text-bz-white/60 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={[
          baseInputClasses,
          error ? 'border-bz-pink focus:border-bz-pink focus:ring-bz-pink/30' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <span className="text-xs text-bz-pink font-mono">{error}</span>}
      {hint && !error && <span className="text-xs text-bz-white/40 font-mono">{hint}</span>}
    </div>
  )
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-mono text-bz-white/60 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={[
          baseInputClasses,
          'resize-none min-h-[80px]',
          error ? 'border-bz-pink focus:border-bz-pink focus:ring-bz-pink/30' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <span className="text-xs text-bz-pink font-mono">{error}</span>}
      {hint && !error && <span className="text-xs text-bz-white/40 font-mono">{hint}</span>}
    </div>
  )
}
