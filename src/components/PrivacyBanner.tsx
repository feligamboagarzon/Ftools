import { ShieldCheck } from 'lucide-react'
import { cn } from '../lib/cn'

interface PrivacyBannerProps {
  className?: string
  compact?: boolean
}

/** El punto de venta clave: nada se sube a un servidor. */
export function PrivacyBanner({ className, compact = false }: PrivacyBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-lime text-ink shadow-brutal',
        compact ? 'px-4 py-2.5' : 'px-5 py-4',
        className,
      )}
    >
      <ShieldCheck className={cn(compact ? 'h-6 w-6' : 'h-8 w-8', 'shrink-0')} strokeWidth={2.5} />
      <p className={cn('font-semibold', compact ? 'text-sm' : 'text-sm sm:text-base')}>
        <strong className="font-display font-extrabold uppercase">100% privado.</strong>{' '}
        Tus archivos se procesan en tu navegador y <strong>nunca se suben a ningún servidor</strong>.
      </p>
    </div>
  )
}
