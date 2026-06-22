import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../lib/cn'
import { ACCENT_BG, type Tool } from '../lib/tools'
import { PrivacyBanner } from './PrivacyBanner'
import { Sticker } from './Decorations'

interface ToolShellProps {
  tool: Tool
  children: ReactNode
}

/** Marco compartido de cada página de herramienta. */
export function ToolShell({ tool, children }: ToolShellProps) {
  const Icon = tool.icon
  return (
    <div className="relative overflow-hidden">
      <Sticker shape="spark" color={tool.color} anim="spin" className="absolute -right-4 top-10 opacity-70 sm:right-10" size={72} />
      <Sticker shape="zigzag" color={tool.color} anim="float" className="absolute left-2 top-40 hidden opacity-60 lg:block" size={90} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border-[3px] border-ink bg-cream px-4 py-2 text-sm font-extrabold uppercase shadow-brutal-sm pressable"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={3} /> Todas las herramientas
        </Link>

        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className={cn('grid h-20 w-20 shrink-0 -rotate-2 place-items-center rounded-2xl border-[3px] border-ink shadow-brutal', ACCENT_BG[tool.color])}>
            <Icon className="h-11 w-11 text-ink" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{tool.name}</h1>
            <p className="mt-1 text-base font-semibold opacity-80 sm:text-lg">{tool.tagline}</p>
          </div>
        </header>

        {tool.phase === 1 && <PrivacyBanner className="mt-6" />}

        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}
