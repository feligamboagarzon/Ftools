import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'

// Las herramientas cargan librerías pesadas (pdf.js, tesseract, ffmpeg.wasm):
// se dividen en chunks aparte y sólo se descargan al entrar a cada una.
const PdfEditor = lazy(() => import('./pages/PdfEditor').then((m) => ({ default: m.PdfEditor })))
const AudioConverter = lazy(() => import('./pages/AudioConverter').then((m) => ({ default: m.AudioConverter })))
const YoutubeDownloader = lazy(() => import('./pages/YoutubeDownloader').then((m) => ({ default: m.YoutubeDownloader })))
const PdfDocx = lazy(() => import('./pages/PdfDocx').then((m) => ({ default: m.PdfDocx })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

function Loader() {
  return (
    <div className="grid place-items-center py-32">
      <div className="animate-bob font-display text-2xl font-extrabold">
        Cargando herramienta… 🛠️
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="editor-pdf" element={<Suspense fallback={<Loader />}><PdfEditor /></Suspense>} />
        <Route path="conversor-audio" element={<Suspense fallback={<Loader />}><AudioConverter /></Suspense>} />
        <Route path="descargar-youtube" element={<Suspense fallback={<Loader />}><YoutubeDownloader /></Suspense>} />
        <Route path="pdf-docx" element={<Suspense fallback={<Loader />}><PdfDocx /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<Loader />}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  )
}

export default App
