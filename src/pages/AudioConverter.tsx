import { useState } from 'react'
import { Music, Download, RefreshCw, AlertTriangle, Cpu, Zap, FileAudio } from 'lucide-react'
import { ToolShell } from '../components/ToolShell'
import { FileDropzone } from '../components/FileDropzone'
import { ProgressBar } from '../components/ProgressBar'
import { Button, buttonClass } from '../components/Button'
import { getTool } from '../lib/tools'
import { downloadBytes } from '../lib/pdf'
import { AUDIO_FORMATS, convertAudio, isMultiThread, type AudioFormat } from '../lib/ffmpeg'
import { cn } from '../lib/cn'

const tool = getTool('/conversor-audio')!

type Status = 'idle' | 'loading' | 'converting' | 'done' | 'error'

function prettySize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function AudioConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [target, setTarget] = useState<AudioFormat>(AUDIO_FORMATS[0])
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ data: Uint8Array; filename: string; mime: string } | null>(null)

  const big = file && file.size > 40 * 1024 * 1024

  async function run() {
    if (!file) return
    setError('')
    setResult(null)
    setProgress(0)
    try {
      setStatus('loading') // descarga del core (~25MB) la primera vez
      setStatus('converting')
      const out = await convertAudio(file, target, (r) => setProgress(Math.round(r * 100)))
      setResult(out)
      setStatus('done')
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : 'Algo salió mal en la conversión.')
      setStatus('error')
    }
  }

  function reset() {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setError('')
    setResult(null)
  }

  return (
    <ToolShell tool={tool}>
      {/* Estado del motor: multihilo vs single-thread */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold shadow-brutal-sm">
        {isMultiThread() ? (
          <><Cpu className="h-4 w-4 text-blue" /> Motor multihilo activo (rápido)</>
        ) : (
          <><Zap className="h-4 w-4 text-orange" /> Motor single-thread (sin aislamiento cross-origin)</>
        )}
      </div>

      {!file && (
        <FileDropzone
          accept="audio/*,video/mp4,.m4a,.aac,.ogg,.flac,.wav,.mp3"
          color="blue"
          icon={<FileAudio className="h-8 w-8" strokeWidth={2.5} />}
          title="Arrastra tu audio aquí"
          hint="MP3, WAV, M4A, OGG, FLAC… · o haz click"
          onFiles={(f) => { setFile(f[0]); setStatus('idle'); setResult(null); setError('') }}
        />
      )}

      {file && (
        <div className="space-y-6">
          {/* Archivo elegido */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border-[3px] border-ink bg-cream p-4 shadow-brutal">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-[3px] border-ink bg-blue text-cream">
                <Music className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold">{file.name}</p>
                <p className="text-xs font-semibold opacity-70">{prettySize(file.size)}</p>
              </div>
            </div>
            <button onClick={reset} className="rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-xs font-extrabold uppercase pressable shadow-brutal-sm">
              Cambiar
            </button>
          </div>

          {/* Selector de formato */}
          <div>
            <p className="mb-2 font-display text-sm font-extrabold uppercase">Convertir a:</p>
            <div className="flex flex-wrap gap-2">
              {AUDIO_FORMATS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setTarget(f)}
                  aria-pressed={target.key === f.key}
                  className={cn(
                    'rounded-xl border-[3px] border-ink px-4 py-2 font-display text-sm font-extrabold uppercase shadow-brutal-sm pressable',
                    target.key === f.key ? 'bg-blue text-cream' : 'bg-cream',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {big && status === 'idle' && (
            <p className="flex items-center gap-2 rounded-xl border-2 border-ink bg-yellow px-3 py-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4" /> Archivo grande: la conversión puede tardar un poco.
            </p>
          )}

          {/* Acción / progreso */}
          {status === 'idle' && (
            <Button color="blue" size="lg" onClick={run} className="w-full sm:w-auto">
              <RefreshCw className="h-5 w-5" strokeWidth={3} /> Convertir a {target.label}
            </Button>
          )}

          {status === 'loading' && (
            <ProgressBar color="blue" label="Cargando el motor de audio (~25MB)…" />
          )}

          {status === 'converting' && (
            <ProgressBar color="blue" value={progress} label={`Convirtiendo a ${target.label}…`} />
          )}

          {status === 'error' && (
            <div className="flex items-start gap-3 rounded-2xl border-[3px] border-ink bg-red p-4 text-cream shadow-brutal">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0" />
              <div>
                <p className="font-display font-extrabold uppercase">No se pudo convertir</p>
                <p className="text-sm font-semibold">{error}</p>
                <button onClick={() => setStatus('idle')} className="mt-2 rounded-lg border-2 border-cream px-3 py-1 text-xs font-extrabold uppercase">
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {status === 'done' && result && (
            <div className="flex flex-col items-start gap-4 rounded-2xl border-[3px] border-ink bg-lime p-5 shadow-brutal sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-xl font-extrabold uppercase">¡Listo! 🎉</p>
                <p className="text-sm font-semibold">{result.filename} · {prettySize(result.data.byteLength)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => downloadBytes(result.data, result.filename, result.mime)}
                  className={buttonClass('pink', 'md')}
                >
                  <Download className="h-5 w-5" strokeWidth={3} /> Descargar
                </button>
                <button onClick={reset} className={buttonClass('yellow', 'md')}>
                  Otro archivo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  )
}
