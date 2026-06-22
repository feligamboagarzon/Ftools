import { Link, NavLink, Outlet } from 'react-router-dom'
import { ShieldCheck, Heart } from 'lucide-react'
import { cn } from '../lib/cn'
import { TOOLS } from '../lib/tools'

function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-2" aria-label="F Tools — inicio">
      <span className="grid h-10 w-10 -rotate-3 place-items-center rounded-xl border-[3px] border-ink bg-pink text-cream shadow-brutal-sm transition-transform group-hover:rotate-3">
        <span className="font-display text-2xl font-extrabold">F</span>
      </span>
      <span className="font-display text-2xl font-extrabold tracking-tight">F&nbsp;Tools</span>
    </Link>
  )
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-cream/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          <div className="hidden items-center gap-1 sm:flex">
            {TOOLS.filter((t) => t.status === 'live').map((t) => (
              <NavLink
                key={t.id}
                to={t.route}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg border-2 border-transparent px-3 py-1.5 text-sm font-bold transition-colors',
                    'hover:border-ink hover:bg-yellow',
                    isActive && 'border-ink bg-yellow shadow-brutal-sm',
                  )
                }
              >
                {t.name}
              </NavLink>
            ))}
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border-2 border-ink bg-lime px-3 py-1 text-xs font-extrabold uppercase shadow-brutal-sm md:inline-flex">
            <ShieldCheck className="h-4 w-4" /> Sin servidores
          </span>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t-[3px] border-ink bg-ink text-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row">
          <p className="inline-flex items-center gap-1.5 font-semibold">
            Hecho con <Heart className="h-4 w-4 fill-pink text-pink" /> y sin servidores.
          </p>
          <p className="font-semibold opacity-80">
            F&nbsp;Tools · también conocido como <em>Aptitudes</em>
          </p>
        </div>
      </footer>
    </div>
  )
}
