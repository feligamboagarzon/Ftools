import { Link } from 'react-router-dom'
import { buttonClass } from '../components/Button'
import { Sticker } from '../components/Decorations'

export function NotFound() {
  return (
    <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <Sticker shape="star" color="pink" anim="bob" className="absolute left-6 top-12" size={70} />
      <Sticker shape="spark" color="blue" anim="spin" className="absolute right-6 top-20" size={64} />
      <h1 className="font-display text-8xl font-extrabold text-pink">404</h1>
      <p className="mt-4 font-display text-3xl font-extrabold">Esta página se fue de vacaciones 🏖️</p>
      <p className="mt-2 font-semibold opacity-80">No encontramos lo que buscabas.</p>
      <Link to="/" className={buttonClass('blue', 'lg', 'mt-8')}>
        Volver al inicio
      </Link>
    </div>
  )
}
