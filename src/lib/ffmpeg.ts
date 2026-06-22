// Conversión de audio con ffmpeg.wasm — 100% local, el archivo nunca se sube.
// El core pesa ~25MB: se carga BAJO DEMANDA (lazy) la primera vez que se usa.
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// ¿Tenemos aislamiento cross-origin? Entonces podemos usar el core multihilo.
export const isMultiThread = () =>
  typeof window !== 'undefined' && window.crossOriginIsolated === true

const CORE_VERSION = '0.12.6'
const corePkg = () => (isMultiThread() ? '@ffmpeg/core-mt' : '@ffmpeg/core')
const coreBase = () => `https://unpkg.com/${corePkg()}@${CORE_VERSION}/dist/umd`

export interface AudioFormat {
  key: string
  label: string
  ext: string
  mime: string
  args: string[] // flags de codec; vacío = ffmpeg infiere por extensión
}

export const AUDIO_FORMATS: AudioFormat[] = [
  { key: 'mp3', label: 'MP3', ext: 'mp3', mime: 'audio/mpeg', args: ['-c:a', 'libmp3lame', '-q:a', '2'] },
  { key: 'wav', label: 'WAV', ext: 'wav', mime: 'audio/wav', args: [] },
  { key: 'm4a', label: 'M4A (AAC)', ext: 'm4a', mime: 'audio/mp4', args: ['-c:a', 'aac', '-b:a', '192k'] },
  { key: 'aac', label: 'AAC', ext: 'aac', mime: 'audio/aac', args: ['-c:a', 'aac', '-b:a', '192k'] },
  { key: 'ogg', label: 'OGG (Vorbis)', ext: 'ogg', mime: 'audio/ogg', args: ['-c:a', 'libvorbis', '-q:a', '5'] },
  { key: 'flac', label: 'FLAC', ext: 'flac', mime: 'audio/flac', args: [] },
]

export type FFProgress = (ratio: number) => void

let loadPromise: Promise<FFmpeg> | null = null
let progressHandler: FFProgress | null = null // un solo listener, reasignable

/** Carga ffmpeg una sola vez. El core (~25MB) se descarga aquí. */
export async function loadFFmpeg(): Promise<FFmpeg> {
  if (loadPromise) return loadPromise
  loadPromise = (async () => {
    const ff = new FFmpeg()
    ff.on('progress', ({ progress }) => progressHandler?.(progress))
    const base = coreBase()
    const opts: Record<string, string> = {
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
    }
    if (isMultiThread()) {
      opts.workerURL = await toBlobURL(`${base}/ffmpeg-core.worker.js`, 'text/javascript')
    }
    await ff.load(opts)
    return ff
  })()
  return loadPromise
}

export interface ConvertResult { data: Uint8Array; filename: string; mime: string }

/** Convierte un archivo de audio al formato destino. */
export async function convertAudio(
  file: File,
  target: AudioFormat,
  onProgress?: FFProgress,
): Promise<ConvertResult> {
  const ff = await loadFFmpeg()
  progressHandler = onProgress ?? null

  const inExt = file.name.split('.').pop()?.toLowerCase() || 'dat'
  const input = `in.${inExt}`
  const output = `out.${target.ext}`

  try {
    await ff.writeFile(input, await fetchFile(file))
    await ff.exec(['-i', input, ...target.args, output])
    const data = (await ff.readFile(output)) as Uint8Array
    // Limpieza del sistema de archivos virtual.
    await ff.deleteFile(input).catch(() => {})
    await ff.deleteFile(output).catch(() => {})
    return { data, filename: `${file.name.replace(/\.[^.]+$/, '') || 'audio'}.${target.ext}`, mime: target.mime }
  } finally {
    progressHandler = null
  }
}
