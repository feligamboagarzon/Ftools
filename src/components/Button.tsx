import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { ACCENT_BG, TEXT_ON_ACCENT as TEXT_ON, type ToolColor } from '../lib/tools'

type Size = 'sm' | 'md' | 'lg'

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
}

/** Clases del botón neo-brutalista — reutilizable también en <Link>. */
export function buttonClass(color: ToolColor = 'yellow', size: Size = 'md', extra?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 select-none cursor-pointer',
    'font-display font-extrabold uppercase tracking-wide',
    'border-[3px] border-ink shadow-brutal pressable',
    'disabled:opacity-50 disabled:pointer-events-none disabled:shadow-brutal',
    ACCENT_BG[color], TEXT_ON[color], SIZES[size], extra,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ToolColor
  size?: Size
  children: ReactNode
}

export function Button({ color = 'yellow', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <button className={buttonClass(color, size, className)} {...rest}>
      {children}
    </button>
  )
}
