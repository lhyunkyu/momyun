import { cn } from '@/lib/cn'

type BadgeVariant = 'brand' | 'success' | 'error' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  brand:   'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  error:   'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  neutral: 'bg-black/5 text-gray-500 dark:bg-white/10 dark:text-gray-400',
}

export function Badge({ variant = 'brand', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
