import type { ToolColor } from '../lib/tools'
import { cn } from '../lib/cn'

const HEX: Record<ToolColor, string> = {
  pink: '#ff2e97', blue: '#2d5bff', lime: '#b8ff3d', yellow: '#ffd400',
  orange: '#ff6b2c', purple: '#9a3cff', teal: '#00d6c2',
}

export type ShapeName = 'star' | 'spark' | 'zigzag' | 'squiggle' | 'circle' | 'plus' | 'flower'

interface StickerProps {
  shape: ShapeName
  color?: ToolColor
  className?: string
  /** animación: float | bob | spin | none */
  anim?: 'float' | 'float-slow' | 'bob' | 'spin' | 'none'
  size?: number
}

const ANIM: Record<NonNullable<StickerProps['anim']>, string> = {
  float: 'animate-float', 'float-slow': 'animate-float-slow', bob: 'animate-bob',
  spin: 'animate-spin-slow', none: '',
}

/** Sticker Memphis: forma geométrica con contorno negro grueso. Decorativo. */
export function Sticker({ shape, color = 'yellow', className, anim = 'float', size = 64 }: StickerProps) {
  const fill = HEX[color]
  const stroke = '#0a0a0a'
  const sw = 6
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn('pointer-events-none select-none', ANIM[anim], className)}
    >
      {shape === 'star' && (
        <path d="M50 6l11 27 29 2-22 19 7 28-25-15-25 15 7-28L7 35l29-2z"
          fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      )}
      {shape === 'spark' && (
        <path d="M50 8C54 34 66 46 92 50 66 54 54 66 50 92 46 66 34 54 8 50 34 46 46 34 50 8z"
          fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      )}
      {shape === 'zigzag' && (
        <path d="M8 30l14 18 14-18 14 18 14-18 14 18 14-18" fill="none"
          stroke={fill} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {shape === 'squiggle' && (
        <path d="M10 60c10-30 25 30 40 0s25 30 40 0" fill="none"
          stroke={fill} strokeWidth={11} strokeLinecap="round" />
      )}
      {shape === 'circle' && (
        <circle cx="50" cy="50" r="38" fill={fill} stroke={stroke} strokeWidth={sw} />
      )}
      {shape === 'plus' && (
        <path d="M40 10h20v30h30v20H60v30H40V60H10V40h30z"
          fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      )}
      {shape === 'flower' && (
        <g fill={fill} stroke={stroke} strokeWidth={sw}>
          <circle cx="50" cy="22" r="16" /><circle cx="50" cy="78" r="16" />
          <circle cx="22" cy="50" r="16" /><circle cx="78" cy="50" r="16" />
          <circle cx="50" cy="50" r="14" fill="#fff8e7" />
        </g>
      )}
    </svg>
  )
}

interface BlobProps {
  color?: ToolColor
  className?: string
  size?: number
  anim?: StickerProps['anim']
}

/** Mancha orgánica de fondo, con contorno grueso. */
export function Blob({ color = 'pink', className, size = 240, anim = 'float-slow' }: BlobProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 200 200" aria-hidden="true"
      className={cn('pointer-events-none select-none', ANIM[anim ?? 'none'], className)}
    >
      <path
        d="M48 -64C62 -52 71 -31 73 -10C75 11 70 33 57 49C44 65 22 75 -2 78C-26 81 -52 77 -68 62C-84 47 -90 21 -86 -3C-82 -27 -68 -49 -49 -63C-30 -77 -6 -83 14 -79C34 -75 34 -76 48 -64Z"
        transform="translate(100 100)"
        fill={HEX[color]} stroke="#0a0a0a" strokeWidth={5} opacity={0.9}
      />
    </svg>
  )
}
