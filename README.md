# F Tools (Aptitudes)

Herramientas gratis y útiles que corren **100% en tu navegador**. Tus archivos
nunca se suben a un servidor. Diseño maximalista: neo-brutalismo + Memphis +
paquete de stickers.

## Stack

React 19 · Vite · TypeScript · Tailwind v4 · react-router · framer-motion · lucide-react

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build → dist/
```

## Arquitectura por fases

**Fase 1 — client-side, sin servidor (LISTO):**
- **Editor de PDF** (`/editor-pdf`) — render con `pdf.js`, agregar texto con
  `pdf-lib`, OCR español+inglés con `tesseract.js`.
- **Conversor de audio** (`/conversor-audio`) — `ffmpeg.wasm`
  (MP3/WAV/M4A/AAC/OGG/FLAC).

**Fase 2 — requiere backend (placeholders honestos "Próximamente"):**
- **Descargador de YouTube** — backend con `yt-dlp`. ⚠️ Descargar de YouTube
  viola sus ToS y puede infringir copyright; muchos hosts lo prohíben.
- **PDF ↔ DOCX** — `libreoffice --headless`. PDF→DOCX nunca es de fidelidad
  perfecta (se avisa en la UI).

No hay versiones client-side falsas de la Fase 2: el navegador no puede hacerlo.

## Cross-origin isolation (importante)

`ffmpeg.wasm` multihilo necesita los headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Ya configurados en: `vite.config.ts` (dev), `vercel.json`, `netlify.toml`,
`firebase.json`. Sin ellos, el conversor cae automáticamente al core
single-thread. El núcleo de ffmpeg (~25MB) se descarga **bajo demanda** desde
unpkg la primera vez que se usa el conversor.

## Deploy

Hosting estático en Vercel / Netlify / Firebase Hosting. El SPA usa rutas de
`react-router`: los redirects/rewrites a `index.html` ya están en cada config.

## Estructura

```
src/
  components/   Button, ToolCard, FileDropzone, ProgressBar, Badge,
                Decorations (Blob/Sticker), Layout, ToolShell, PrivacyBanner
  pages/        Home, PdfEditor, AudioConverter, YoutubeDownloader, PdfDocx, NotFound
  lib/          tools (registro), pdf, ocr, ffmpeg, cn
```
