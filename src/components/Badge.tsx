import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { ACCENT_BG, type ToolColor } from '../lib/tools'

interface BadgeProps {
  children: ReactNode
  color?: ToolColor
  icon?: ReactNode
  className?: string
}

/** Pastilla pequeña con borde y micro-sombra. */
export function Badge({ children, color = 'yellow', icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap',
        'px-3 py-1 text-xs font-bold uppercase tracking-wide',
        'border-2 border-ink rounded-full shadow-brutal-sm',
        ACCENT_BG[color],
        color === 'pink' || color === 'blue' || color === 'purple' ? 'text-cream' : 'text-ink',
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
