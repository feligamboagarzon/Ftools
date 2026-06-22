import { Construction, AlertTriangle, Server, Link2 } from 'lucide-react'
import { ToolShell } from '../components/ToolShell'
import { getTool } from '../lib/tools'

// ⚖️ ADVERTENCIA LEGAL (documentada también en la UI):
// Descargar videos de YouTube viola sus Términos de Servicio y puede infringir
// derechos de autor. Muchos proveedores de hosting prohíben este tipo de servicio
// y pueden bloquear la IP del servidor. Esta función SÓLO puede existir con un
// backend propio (Fase 2: Node/Python + yt-dlp). No hay —ni habrá— una versión
// "client-side" falsa: el navegador no puede saltarse esas restricciones de YouTube.
const tool = getTool('/descargar-youtube')!

export function YoutubeDownloader() {
  return (
    <ToolShell tool={tool}>
      {/* Mockup honesto y deshabilitado: deja claro que aún no funciona. */}
      <div aria-disabled className="rounded-2xl border-[3px] border-ink bg-cream p-5 shadow-brutal opacity-70">
        <label className="mb-2 block font-display text-sm font-extrabold uppercase">
          Enlace del video
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border-[3px] border-ink bg-white px-4 py-3">
            <Link2 className="h-5 w-5 opacity-50" />
            <span className="text-sm opacity-50">https://youtube.com/watch?v=…</span>
          </div>
          <button
            disabled
            className="cursor-not-allowed rounded-xl border-[3px] border-ink bg-orange px-6 py-3 font-display font-extrabold uppercase text-ink shadow-brutal-sm"
          >
            Descargar
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-4 rounded-2xl border-[3px] border-ink bg-yellow p-5 shadow-brutal">
        <Construction className="mt-0.5 h-8 w-8 shrink-0" strokeWidth={2.5} />
        <div>
          <h2 className="font-display text-2xl font-extrabold">Próximamente (Fase 2)</h2>
          <p className="mt-1 text-sm font-semibold">
            Esta herramienta necesita un servidor propio con <code className="rounded bg-ink/10 px-1">yt-dlp</code>:
            el navegador no puede descargar de YouTube por sí solo. La activaremos cuando el backend esté listo.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold">
            <Server className="h-4 w-4" /> Requiere backend · no es client-side
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-4 rounded-2xl border-[3px] border-ink bg-red p-5 text-cream shadow-brutal">
        <AlertTriangle className="mt-0.5 h-8 w-8 shrink-0" strokeWidth={2.5} />
        <div>
          <h2 className="font-display text-xl font-extrabold uppercase">Aviso legal</h2>
          <p className="mt-1 text-sm font-semibold">
            Descargar de YouTube viola sus Términos de Servicio y puede infringir derechos de autor.
            Muchos servicios de hosting lo prohíben y pueden bloquear el servidor. Úsala solo con
            contenido propio o con permiso, bajo tu responsabilidad.
          </p>
        </div>
      </div>
    </ToolShell>
  )
}
