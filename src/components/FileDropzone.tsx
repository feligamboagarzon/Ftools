import { useRef, useState, type DragEvent, type ReactNode } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '../lib/cn'
import { ACCENT_BG, type ToolColor } from '../lib/tools'

interface FileDropzoneProps {
  accept?: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  color?: ToolColor
  title?: string
  hint?: string
  icon?: ReactNode
}

/** Zona de arrastre con respaldo de botón. Drag & drop + click + teclado. */
export function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  color = 'pink',
  title = 'Arrastra tu archivo aquí',
  hint = 'o haz click para elegirlo',
  icon,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const pick = (list: FileList | null) => {
    if (!list || list.length === 0) return
    onFiles(Array.from(list))
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    pick(e.dataTransfer.files)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        'group flex cursor-pointer flex-col items-center justify-center gap-3 text-center',
        'rounded-2xl border-[4px] border-dashed border-ink p-10 sm:p-14',
        'pressable shadow-brutal',
        dragging ? cn(ACCENT_BG[color], 'border-solid scale-[1.01]') : 'bg-cream',
      )}
    >
      <div className={cn('grid h-16 w-16 place-items-center rounded-2xl border-[3px] border-ink shadow-brutal-sm', ACCENT_BG[color])}>
        {icon ?? <UploadCloud className="h-8 w-8" strokeWidth={2.5} />}
      </div>
      <div>
        <p className="font-display text-xl font-extrabold">{title}</p>
        <p className="text-sm font-medium opacity-80">{hint}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => pick(e.target.files)}
      />
    </div>
  )
}
