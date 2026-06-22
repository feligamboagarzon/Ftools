import type { LucideIcon } from 'lucide-react'
import { FileText, AudioLines, MonitorPlay, FileType2 } from 'lucide-react'

export type ToolColor =
  | 'pink' | 'blue' | 'lime' | 'yellow' | 'orange' | 'purple' | 'teal'
export type ToolStatus = 'live' | 'soon'

export interface Tool {
  id: string
  name: string
  tagline: string
  description: string
  route: string
  icon: LucideIcon
  color: ToolColor
  status: ToolStatus
  phase: 1 | 2
  badges: string[]
}

export const TOOLS: Tool[] = [
  {
    id: 'pdf-editor',
    name: 'Editor de PDF',
    tagline: 'Escribe sobre tus PDF y reconoce texto (OCR)',
    description:
      'Abre un PDF, agrega texto donde quieras y descárgalo sin marca de agua. Incluye OCR en español e inglés para documentos escaneados.',
    route: '/editor-pdf',
    icon: FileText,
    color: 'pink',
    status: 'live',
    phase: 1,
    badges: ['100% privado', 'Sin marca de agua'],
  },
  {
    id: 'audio-converter',
    name: 'Conversor de audio',
    tagline: 'MP3 · WAV · M4A · OGG · FLAC, sin subir nada',
    description:
      'Convierte entre los formatos de audio más comunes directo en tu navegador con ffmpeg. Tus archivos nunca salen de tu equipo.',
    route: '/conversor-audio',
    icon: AudioLines,
    color: 'blue',
    status: 'live',
    phase: 1,
    badges: ['100% privado', 'Corre con ffmpeg.wasm'],
  },
  {
    id: 'youtube',
    name: 'Descargador de YouTube',
    tagline: 'Guarda videos en MP4 o MP3',
    description:
      'Pega un enlace y descarga el video o solo el audio. Necesita un servidor propio, así que llega en la Fase 2.',
    route: '/descargar-youtube',
    icon: MonitorPlay,
    color: 'orange',
    status: 'soon',
    phase: 2,
    badges: ['Próximamente', 'Requiere servidor'],
  },
  {
    id: 'pdf-docx',
    name: 'Conversor PDF ↔ DOCX',
    tagline: 'Pasa de Word a PDF y de vuelta',
    description:
      'Convierte documentos de Word a PDF y de PDF a Word. La conversión de alta fidelidad necesita un servidor: llega en la Fase 2.',
    route: '/pdf-docx',
    icon: FileType2,
    color: 'purple',
    status: 'soon',
    phase: 2,
    badges: ['Próximamente', 'Requiere servidor'],
  },
]

export const getTool = (route: string) => TOOLS.find((t) => t.route === route)

// Clases de acento estáticas (Tailwind las detecta porque están literales aquí).
export const ACCENT_BG: Record<ToolColor, string> = {
  pink: 'bg-pink', blue: 'bg-blue', lime: 'bg-lime', yellow: 'bg-yellow',
  orange: 'bg-orange', purple: 'bg-purple', teal: 'bg-teal',
}
export const ACCENT_TEXT: Record<ToolColor, string> = {
  pink: 'text-pink', blue: 'text-blue', lime: 'text-lime', yellow: 'text-yellow',
  orange: 'text-orange', purple: 'text-purple', teal: 'text-teal',
}
// Color de texto legible ENCIMA de cada acento (oscuros → crema, claros → tinta).
export const TEXT_ON_ACCENT: Record<ToolColor, string> = {
  pink: 'text-cream', blue: 'text-cream', purple: 'text-cream',
  orange: 'text-ink', lime: 'text-ink', yellow: 'text-ink', teal: 'text-ink',
}
