import { cn } from '../lib/cn'
import { ACCENT_BG, type ToolColor } from '../lib/tools'

interface ProgressBarProps {
  /** 0–100. Omítelo (undefined) para barra indeterminada. */
  value?: number
  color?: ToolColor
  label?: string
  className?: string
}

export function ProgressBar({ value, color = 'lime', label, className }: ProgressBarProps) {
  const indeterminate = value === undefined
  const pct = indeterminate ? 100 : Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className={cn('w-full', className)}>
      {(label || !indeterminate) && (
        <div className="mb-1.5 flex items-center justify-between text-sm font-bold">
          <span>{label}</span>
          {!indeterminate && <span className="tabular-nums">{pct}%</span>}
        </div>
      )}
      <div
        className="h-5 w-full overflow-hidden border-[3px] border-ink rounded-full bg-cream"
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full rounded-full border-r-2 border-ink transition-[width] duration-300 ease-out',
            ACCENT_BG[color],
            indeterminate && 'animate-pulse',
          )}
          style={{ width: `${indeterminate ? 45 : pct}%` }}
        />
      </div>
    </div>
  )
}
