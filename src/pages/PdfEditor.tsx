import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Type, Download,
  ScanText, Copy, Check, AlertTriangle, Trash2,
} from 'lucide-react'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { ToolShell } from '../components/ToolShell'
import { FileDropzone } from '../components/FileDropzone'
import { ProgressBar } from '../components/ProgressBar'
import { Button } from '../components/Button'
import { getTool } from '../lib/tools'
import {
  loadPdf, renderPage, exportPdfWithText, downloadBytes,
  type TextAnnotation, type PageSize,
} from '../lib/pdf'
import { cn } from '../lib/cn'

const tool = getTool('/editor-pdf')!

const SIZES = [12, 16, 20, 28, 40]
const COLORS = ['#0a0a0a', '#ff2e97', '#2d5bff', '#ff3b30', '#9a3cff', '#ff6b2c']

type Mode = 'view' | 'text'

export function PdfEditor() {
  const [original, setOriginal] = useState<ArrayBuffer | null>(null)
  const [fileName, setFileName] = useState('documento.pdf')
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [scale, setScale] = useState(1.3)
  const [pageSize, setPageSize] = useState<PageSize | null>(null)
  const [mode, setMode] = useState<Mode>('text')
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([])
  const [size, setSize] = useState(16)
  const [color, setColor] = useState('#0a0a0a')
  const [busy, setBusy] = useState(false)

  // OCR
  const [ocrText, setOcrText] = useState('')
  const [ocrStatus, setOcrStatus] = useState('')
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrRunning, setOcrRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const idRef = useRef(0)

  async function onFile(f: File) {
    const buf = await f.arrayBuffer()
    setOriginal(buf)
    setFileName(f.name)
    const d = await loadPdf(buf)
    setDoc(d)
    setNumPages(d.numPages)
    setPage(1)
    setAnnotations([])
    setOcrText('')
  }

  // Render de la página actual
  useEffect(() => {
    if (!doc || !canvasRef.current) return
    let alive = true
    renderPage(doc, page, scale, canvasRef.current).then((size) => {
      if (alive) setPageSize(size)
    }).catch((e) => console.error(e))
    return () => { alive = false }
  }, [doc, page, scale])

  const pageAnns = annotations.filter((a) => a.page === page)
  const updateAnn = (id: string, patch: Partial<TextAnnotation>) =>
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  const removeAnn = (id: string) =>
    setAnnotations((prev) => prev.filter((a) => a.id !== id))

  function addTextAt(e: ReactMouseEvent<HTMLDivElement>) {
    if (mode !== 'text' || e.target !== e.currentTarget) return
    const rect = e.currentTarget.getBoundingClientRect()
    const xR = (e.clientX - rect.left) / rect.width
    const yR = (e.clientY - rect.top) / rect.height
    const id = `a${idRef.current++}`
    setAnnotations((prev) => [...prev, { id, page, xR, yR, text: '', sizePt: size, color }])
    // Enfocar el nuevo input tras render
    requestAnimationFrame(() => {
      document.getElementById(`inp-${id}`)?.focus()
    })
  }

  async function exportPdf() {
    if (!original) return
    setBusy(true)
    try {
      const bytes = await exportPdfWithText(original.slice(0), annotations)
      downloadBytes(bytes, fileName.replace(/\.pdf$/i, '') + '-editado.pdf', 'application/pdf')
    } catch (e) {
      console.error(e)
      alert('No se pudo exportar el PDF.')
    } finally {
      setBusy(false)
    }
  }

  async function runOcr() {
    if (!doc) return
    setOcrRunning(true)
    setOcrText('')
    setOcrProgress(0)
    setOcrStatus('Preparando OCR…')
    try {
      const { ocrImage } = await import('../lib/ocr') // tesseract pesa: carga bajo demanda
      const off = document.createElement('canvas')
      await renderPage(doc, page, 2, off) // mayor escala = mejor reconocimiento
      const text = await ocrImage(off, (status, p) => {
        setOcrStatus(status)
        setOcrProgress(Math.round(p * 100))
      })
      setOcrText(text.trim() || '(No se reconoció texto en esta página.)')
    } catch (e) {
      console.error(e)
      setOcrText('Error al ejecutar el OCR.')
    } finally {
      setOcrRunning(false)
    }
  }

  function reset() {
    setDoc(null); setOriginal(null); setAnnotations([]); setOcrText(''); setPage(1)
  }

  if (!doc) {
    return (
      <ToolShell tool={tool}>
        <FileDropzone
          accept="application/pdf,.pdf"
          color="pink"
          icon={<Type className="h-8 w-8" strokeWidth={2.5} />}
          title="Arrastra tu PDF aquí"
          hint="o haz click para elegirlo · se queda en tu navegador"
          onFiles={(f) => onFile(f[0])}
        />
      </ToolShell>
    )
  }

  const fontPx = (pt: number) => pt * scale

  return (
    <ToolShell tool={tool}>
      {/* ===== Barra de herramientas ===== */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border-[3px] border-ink bg-cream p-3 shadow-brutal">
        {/* Navegación de página */}
        <div className="flex items-center gap-1">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-cream disabled:opacity-40 pressable shadow-brutal-sm" aria-label="Página anterior">
            <ChevronLeft className="h-5 w-5" strokeWidth={3} />
          </button>
          <span className="px-2 text-sm font-bold tabular-nums">{page} / {numPages}</span>
          <button onClick={() => setPage((p) => Math.min(numPages, p + 1))} disabled={page >= numPages}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-cream disabled:opacity-40 pressable shadow-brutal-sm" aria-label="Página siguiente">
            <ChevronRight className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>

        <div className="mx-1 h-6 w-0.5 bg-ink/20" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button onClick={() => setScale((s) => Math.max(0.6, +(s - 0.2).toFixed(2)))}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-cream pressable shadow-brutal-sm" aria-label="Alejar">
            <ZoomOut className="h-5 w-5" strokeWidth={3} />
          </button>
          <span className="w-12 text-center text-sm font-bold tabular-nums">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(3, +(s + 0.2).toFixed(2)))}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-cream pressable shadow-brutal-sm" aria-label="Acercar">
            <ZoomIn className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>

        <div className="mx-1 h-6 w-0.5 bg-ink/20" />

        {/* Modo agregar texto */}
        <button onClick={() => setMode((m) => (m === 'text' ? 'view' : 'text'))} aria-pressed={mode === 'text'}
          className={cn('inline-flex items-center gap-2 rounded-lg border-2 border-ink px-3 py-1.5 text-sm font-extrabold uppercase pressable shadow-brutal-sm',
            mode === 'text' ? 'bg-pink text-cream' : 'bg-cream')}>
          <Type className="h-4 w-4" strokeWidth={3} /> Agregar texto
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={reset} className="rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-sm font-extrabold uppercase pressable shadow-brutal-sm">
            Otro PDF
          </button>
          <Button color="pink" size="sm" onClick={exportPdf} disabled={busy}>
            <Download className="h-4 w-4" strokeWidth={3} /> {busy ? 'Generando…' : 'Descargar'}
          </Button>
        </div>
      </div>

      {/* Estilo del texto (visible en modo texto) */}
      {mode === 'text' && (
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded-2xl border-[3px] border-ink bg-yellow p-3 shadow-brutal">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase">Tamaño</span>
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSize(s)} aria-pressed={size === s}
                className={cn('h-8 min-w-8 rounded-md border-2 border-ink px-2 text-xs font-bold pressable',
                  size === s ? 'bg-ink text-cream' : 'bg-cream')}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase">Color</span>
            {COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)} aria-label={`Color ${c}`} aria-pressed={color === c}
                className={cn('h-7 w-7 rounded-full border-2 border-ink pressable', color === c && 'ring-2 ring-ink ring-offset-2 ring-offset-yellow')}
                style={{ backgroundColor: c }} />
            ))}
          </div>
          <p className="text-xs font-semibold opacity-80">💡 Haz click en la página para escribir.</p>
        </div>
      )}

      {/* ===== Lienzo del PDF ===== */}
      <div className="flex justify-center overflow-auto rounded-2xl border-[3px] border-ink bg-ink/5 p-4">
        <div className="relative inline-block shadow-brutal-lg" style={{ lineHeight: 0 }}>
          <canvas ref={canvasRef} className="block border-[3px] border-ink bg-white" />
          {/* Capa de anotaciones */}
          <div
            onClick={addTextAt}
            className={cn('absolute inset-0', mode === 'text' ? 'cursor-text' : 'pointer-events-none')}
          >
            {pageSize && pageAnns.map((a) => (
              <div key={a.id} className="group absolute" style={{ left: `${a.xR * 100}%`, top: `${a.yR * 100}%` }}>
                <input
                  id={`inp-${a.id}`}
                  value={a.text}
                  onChange={(e) => updateAnn(a.id, { text: e.target.value })}
                  onBlur={() => { if (!a.text.trim()) removeAnn(a.id) }}
                  placeholder="texto…"
                  className="bg-transparent outline-none placeholder:opacity-40 focus:bg-yellow/40"
                  style={{
                    fontSize: fontPx(a.sizePt),
                    color: a.color,
                    lineHeight: 1,
                    width: `${Math.max(4, a.text.length + 2)}ch`,
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                />
                {mode === 'text' && (
                  <button onClick={() => removeAnn(a.id)}
                    className="absolute -right-2 -top-2 hidden h-5 w-5 place-items-center rounded-full border-2 border-ink bg-red text-cream group-focus-within:grid group-hover:grid"
                    aria-label="Borrar texto">
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== OCR ===== */}
      <div className="mt-6 rounded-2xl border-[3px] border-ink bg-cream p-5 shadow-brutal">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl border-[3px] border-ink bg-purple text-cream">
              <ScanText className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div>
              <h2 className="font-display text-xl font-extrabold">Reconocer texto (OCR)</h2>
              <p className="text-xs font-semibold opacity-70">Español + inglés · ideal para PDF escaneados</p>
            </div>
          </div>
          <Button color="purple" size="sm" onClick={runOcr} disabled={ocrRunning}>
            <ScanText className="h-4 w-4" strokeWidth={3} /> {ocrRunning ? 'Reconociendo…' : `OCR de la página ${page}`}
          </Button>
        </div>

        {ocrRunning && (
          <ProgressBar className="mt-4" color="purple" value={ocrProgress} label={ocrStatus} />
        )}

        {ocrText && !ocrRunning && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase opacity-70">Texto reconocido</span>
              <button
                onClick={() => { navigator.clipboard.writeText(ocrText); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-lime px-3 py-1 text-xs font-extrabold uppercase pressable shadow-brutal-sm">
                {copied ? <><Check className="h-3.5 w-3.5" /> Copiado</> : <><Copy className="h-3.5 w-3.5" /> Copiar</>}
              </button>
            </div>
            <textarea
              readOnly
              value={ocrText}
              className="h-48 w-full resize-y rounded-xl border-[3px] border-ink bg-white p-3 font-mono text-sm"
            />
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold opacity-60">
        <AlertTriangle className="h-3.5 w-3.5" /> El texto se incrusta con la fuente Helvetica. Tildes y ñ funcionan; emojis no.
      </p>
    </ToolShell>
  )
}
