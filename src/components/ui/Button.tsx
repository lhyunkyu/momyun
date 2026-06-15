import { cn } from '@/lib/cn'
import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize    = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-amber-500 text-white hover:bg-amber-600',
  secondary: 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-gray-100 border border-[var(--border-default)] hover:bg-black/10 dark:hover:bg-white/15',
  ghost:     'text-gray-500 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-gray-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm:   'px-3.5 py-1.5 text-[13px] rounded-md',
  md:   'px-5 py-2.5 text-sm rounded-xl',
  lg:   'px-7 py-3.5 text-base rounded-2xl',
  icon: 'w-9 h-9 p-0 rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-[0.18s] cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
