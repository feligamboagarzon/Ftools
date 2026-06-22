import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { cn } from '../lib/cn'
import { ACCENT_BG, TEXT_ON_ACCENT, type Tool } from '../lib/tools'

interface ToolCardProps {
  tool: Tool
  index?: number
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const { icon: Icon, color, status } = tool
  const soon = status === 'soon'
  const tilt = index % 2 === 0 ? -1.5 : 1.5
  const onAccent = TEXT_ON_ACCENT[color]

  const body = (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.05 }}
      whileHover={{ y: -6, rotate: 0, transition: { duration: 0.15 } }}
      className={cn(
        'relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border-[3px] border-ink p-6',
        'shadow-brutal-lg hover:shadow-brutal-xl transition-shadow',
        ACCENT_BG[color], onAccent,
      )}
    >
      {/* círculos decorativos al fondo de la card */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-[3px] border-ink/30" />
      <div className="pointer-events-none absolute -right-2 top-10 h-10 w-10 rounded-full bg-cream/30" />

      <div className="flex items-start justify-between gap-3">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border-[3px] border-ink bg-cream text-ink shadow-brutal-sm">
          <Icon className="h-9 w-9" strokeWidth={2.5} />
        </div>
        {soon && (
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-cream px-3 py-1 text-xs font-extrabold uppercase text-ink shadow-brutal-sm">
            <Lock className="h-3.5 w-3.5" /> Pronto
          </span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-display text-2xl font-extrabold leading-tight">{tool.name}</h3>
        <p className={cn('mt-1 text-sm font-semibold', onAccent, 'opacity-90')}>{tool.tagline}</p>
        <p className={cn('mt-3 text-sm leading-relaxed', onAccent, 'opacity-90')}>{tool.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tool.badges.map((b) => (
          <span
            key={b}
            className="rounded-full border-2 border-ink bg-cream/90 px-2.5 py-0.5 text-[11px] font-bold uppercase text-ink"
          >
            {b}
          </span>
        ))}
      </div>

      <div className="mt-1 flex items-center justify-between">
        <span className="font-display text-base font-extrabold uppercase">
          {soon ? 'Próximamente' : 'Abrir herramienta'}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full border-[3px] border-ink bg-cream text-ink">
          {soon ? <Lock className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" strokeWidth={2.5} />}
        </span>
      </div>
    </motion.div>
  )

  return (
    <Link
      to={tool.route}
      aria-label={soon ? `${tool.name} (próximamente)` : `Abrir ${tool.name}`}
      className="block h-full"
    >
      {body}
    </Link>
  )
}
