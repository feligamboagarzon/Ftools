import { motion } from 'framer-motion'
import { ArrowDown, ShieldCheck, Gift, UserX, Zap } from 'lucide-react'
import { TOOLS } from '../lib/tools'
import { ToolCard } from '../components/ToolCard'
import { buttonClass } from '../components/Button'
import { Sticker, Blob } from '../components/Decorations'

const PERKS = [
  { icon: ShieldCheck, color: 'lime', title: '100% privado', text: 'Tus archivos se quedan en tu navegador. Nunca se suben.' },
  { icon: Gift, color: 'pink', title: 'Gratis de verdad', text: 'Sin marcas de agua, sin límites artificiales, sin trucos.' },
  { icon: UserX, color: 'blue', title: 'Sin cuenta', text: 'No pedimos correo ni registro. Entras y usas.' },
  { icon: Zap, color: 'orange', title: 'Al instante', text: 'Procesamiento local: sin esperar colas de un servidor.' },
] as const

export function Home() {
  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        <Blob color="yellow" className="absolute -left-24 -top-16 opacity-80" size={300} />
        <Blob color="teal" className="absolute -right-24 top-20 opacity-70" size={260} />
        <Sticker shape="star" color="pink" anim="bob" className="absolute right-8 top-10 sm:right-24" size={80} />
        <Sticker shape="squiggle" color="blue" anim="float" className="absolute left-6 top-44 hidden sm:block" size={90} />
        <Sticker shape="plus" color="purple" anim="spin" className="absolute bottom-10 left-1/4 hidden opacity-80 lg:block" size={60} />

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-14 text-center sm:pt-20">
          <motion.span
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-lime px-4 py-1.5 text-sm font-extrabold uppercase shadow-brutal"
          >
            <ShieldCheck className="h-4 w-4" /> Privacidad total · sin servidores
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 font-display text-6xl font-extrabold leading-[0.9] tracking-tight sm:text-8xl"
          >
            <span className="text-pink">F</span>{' '}
            <span className="text-blue">Tools</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-lg font-semibold sm:text-2xl"
          >
            Herramientas <span className="rounded-md bg-yellow px-1.5 box-decoration-clone border-2 border-ink">gratis y útiles</span>{' '}
            que corren en tu navegador. Tus archivos jamás salen de tu equipo. 🎉
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <a href="#herramientas" className={buttonClass('pink', 'lg')}>
              Ver herramientas <ArrowDown className="h-5 w-5" strokeWidth={3} />
            </a>
            <span className="font-display text-sm font-bold uppercase opacity-70">
              4 herramientas · 2 listas hoy
            </span>
          </motion.div>
        </div>
      </section>

      {/* ===================== PERKS ===================== */}
      <section className="border-y-[3px] border-ink bg-purple">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 lg:grid-cols-4">
          {PERKS.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.title} className="flex flex-col items-center gap-2 rounded-2xl border-[3px] border-ink bg-cream p-4 text-center shadow-brutal">
                <span className="grid h-12 w-12 place-items-center rounded-xl border-[3px] border-ink bg-yellow">
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </span>
                <h3 className="font-display text-lg font-extrabold">{p.title}</h3>
                <p className="text-xs font-semibold opacity-80">{p.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===================== TOOLS GRID ===================== */}
      <section id="herramientas" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
            Las herramientas
            <span className="ml-2 inline-block -rotate-2 rounded-lg border-[3px] border-ink bg-orange px-2 text-2xl text-cream shadow-brutal-sm">
              ¡elige!
            </span>
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </section>
    </>
  )
}
