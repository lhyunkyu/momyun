import { cn } from '@/lib/cn'

interface ProgressProps {
  value: number       // 0–100
  color?: string      // tailwind bg class
  className?: string
}

export function Progress({ value, color = 'bg-amber-500', className }: ProgressProps) {
  return (
    <div
      className={cn(
        'h-1.5 rounded-full overflow-hidden',
        'bg-black/5 dark:bg-white/10',
        className
      )}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
