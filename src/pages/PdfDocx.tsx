import { Construction, Server, FileText, FileType2, ArrowRight } from 'lucide-react'
import { ToolShell } from '../components/ToolShell'
import { getTool } from '../lib/tools'

// Fase 2 — requiere backend:
//   DOCX → PDF: LibreOffice headless (`libreoffice --headless --convert-to pdf`).
//   PDF → DOCX: difícil con buena fidelidad (LibreOffice limitado, o API externa).
// NO existe una conversión de alta fidelidad 100% client-side; por eso es placeholder.
const tool = getTool('/pdf-docx')!

export function PdfDocx() {
  return (
    <ToolShell tool={tool}>
      <div aria-disabled className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: FileType2, from: 'DOCX', to: 'PDF', note: 'LibreOffice headless en el servidor.' },
          { icon: FileText, from: 'PDF', to: 'DOCX', note: 'Fidelidad limitada: el formato puede no quedar perfecto.' },
        ].map((c) => {
          const Icon = c.icon
          return (
            <div key={c.from} className="rounded-2xl border-[3px] border-ink bg-cream p-5 shadow-brutal opacity-75">
              <div className="flex items-center gap-2 font-display text-xl font-extrabold">
                <Icon className="h-6 w-6" strokeWidth={2.5} /> {c.from}
                <ArrowRight className="h-5 w-5" /> {c.to}
              </div>
              <p className="mt-2 text-sm font-semibold opacity-80">{c.note}</p>
              <button
                disabled
                className="mt-4 w-full cursor-not-allowed rounded-xl border-[3px] border-ink bg-purple px-6 py-3 font-display font-extrabold uppercase text-cream shadow-brutal-sm"
              >
                Convertir
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-start gap-4 rounded-2xl border-[3px] border-ink bg-yellow p-5 shadow-brutal">
        <Construction className="mt-0.5 h-8 w-8 shrink-0" strokeWidth={2.5} />
        <div>
          <h2 className="font-display text-2xl font-extrabold">Próximamente (Fase 2)</h2>
          <p className="mt-1 text-sm font-semibold">
            La conversión de alta fidelidad entre PDF y Word necesita LibreOffice corriendo en un
            servidor. Lo haremos honestamente: <strong>PDF → DOCX</strong> nunca es perfecto, y te lo
            diremos antes de convertir. Sin trucos client-side que degraden tu documento.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold">
            <Server className="h-4 w-4" /> Requiere backend · no es client-side
          </div>
        </div>
      </div>
    </ToolShell>
  )
}
