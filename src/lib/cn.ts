// Une clases condicionales sin dependencias. ponytail: clsx en 1 línea.
export type ClassValue = string | false | null | undefined
export const cn = (...parts: ClassValue[]) => parts.filter(Boolean).join(' ')
