// OCR en el navegador con tesseract.js (español + inglés).
// El worker es pesado: se crea una sola vez y se reutiliza entre páginas.
import { createWorker, type Worker } from 'tesseract.js'

export type OcrProgress = (status: string, progress: number) => void

let workerPromise: Promise<Worker> | null = null
let progressCb: OcrProgress | null = null

async function getWorker(onProgress?: OcrProgress): Promise<Worker> {
  if (onProgress) progressCb = onProgress
  if (!workerPromise) {
    workerPromise = createWorker('spa+eng', 1, {
      logger: (m) => progressCb?.(m.status, m.progress),
    })
  }
  return workerPromise
}

/** Reconoce el texto de un canvas/imagen y lo devuelve como string. */
export async function ocrImage(
  image: HTMLCanvasElement | HTMLImageElement,
  onProgress?: OcrProgress,
): Promise<string> {
  const worker = await getWorker(onProgress)
  const { data } = await worker.recognize(image)
  return data.text
}

export async function disposeOcr() {
  if (workerPromise) {
    const w = await workerPromise
    await w.terminate()
    workerPromise = null
  }
}
