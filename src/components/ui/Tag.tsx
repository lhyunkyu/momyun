import { cn } from '@/lib/cn'

interface TagProps {
  children: React.ReactNode
  selectable?: boolean
  active?: boolean
  onClick?: () => void
  className?: string
}

export function Tag({ children, selectable = false, active = false, onClick, className }: TagProps) {
  const base = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-[0.18s]'

  if (selectable) {
    return (
      <button
        onClick={onClick}
        className={cn(
          base,
          active
            ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
            : 'border-[var(--border-default)] bg-[var(--bg-card)] text-gray-500 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-500/10 dark:hover:text-amber-300',
          className
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <span
      className={cn(
        base,
        'border-[var(--border-default)] bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400',
        className
      )}
    >
      {children}
    </span>
  )
}
