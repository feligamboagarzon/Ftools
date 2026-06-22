// Render con pdf.js + incrustado de texto real con pdf-lib.
// Todo en el navegador: el PDF nunca se sube a ningún servidor.
import * as pdfjs from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

/** Una anotación de texto, posicionada como fracción de la página (0..1)
 *  desde la esquina superior izquierda, con tamaño en puntos PDF. */
export interface TextAnnotation {
  id: string
  page: number // 1-based
  xR: number
  yR: number
  text: string
  sizePt: number
  color: string // hex #rrggbb
}

export async function loadPdf(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  // pdf.js consume (y "detacha") el buffer; clonamos para conservar el original.
  return pdfjs.getDocument({ data: data.slice(0) }).promise
}

export interface PageSize { width: number; height: number } // en puntos PDF

/** Dibuja una página en un canvas a la escala dada. Devuelve el tamaño en puntos. */
export async function renderPage(
  doc: PDFDocumentProxy,
  pageNum: number,
  scale: number,
  canvas: HTMLCanvasElement,
): Promise<PageSize> {
  const page = await doc.getPage(pageNum)
  const viewport = page.getViewport({ scale })
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo obtener el contexto del canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.floor(viewport.width * dpr)
  canvas.height = Math.floor(viewport.height * dpr)
  canvas.style.width = `${viewport.width}px`
  canvas.style.height = `${viewport.height}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  // Cancela cualquier render previo sobre este canvas (evita el error de
  // "same canvas during multiple render()" en cambios rápidos / StrictMode).
  const c = canvas as HTMLCanvasElement & { __task?: { cancel: () => void; promise: Promise<void> } }
  c.__task?.cancel()
  const task = page.render({ canvas, canvasContext: ctx, viewport })
  c.__task = task
  try {
    await task.promise
  } catch (e) {
    if ((e as { name?: string })?.name !== 'RenderingCancelledException') throw e
  }
  const base = page.getViewport({ scale: 1 })
  return { width: base.width, height: base.height }
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

/** Incrusta todas las anotaciones en el PDF original y devuelve los bytes. */
export async function exportPdfWithText(
  original: ArrayBuffer,
  annotations: TextAnnotation[],
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(original)
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const pages = pdf.getPages()
  for (const a of annotations) {
    const page = pages[a.page - 1]
    if (!page || !a.text.trim()) continue
    const { width, height } = page.getSize()
    try {
      page.drawText(a.text, {
        x: a.xR * width,
        // yR mide desde arriba; pdf-lib usa origen abajo-izquierda en la línea base.
        y: height - a.yR * height - a.sizePt,
        size: a.sizePt,
        font,
        color: hexToRgb(a.color),
        lineHeight: a.sizePt * 1.15,
      })
    } catch (e) {
      // Helvetica sólo codifica Latin-1; un carácter raro (emoji) no debe
      // tumbar todo el export — se omite esa anotación.
      console.warn('No se pudo incrustar el texto:', a.text, e)
    }
  }
  return pdf.save()
}

export function downloadBytes(data: Uint8Array, filename: string, mime: string) {
  const buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer
  const url = URL.createObjectURL(new Blob([buf], { type: mime }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
