import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API_BASE = 'http://localhost:5000'

// Mapa de tipo del backend → etiqueta visual
const TIPO_LABEL = {
  Tinto:     'Tinto',
  Blanco:    'Blanco',
  Rosado:    'Rosado',
  Espumante: 'Espumante',
}

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio)
}

export default function WineCard({ vino }) {
  const { addToCart } = useCart()

  const imageUrl = vino.image
    ? `${API_BASE}${vino.image}`
    : 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80'

  const handleAgregar = () => {
    const resultado = addToCart(vino)
    if (!resultado.ok) {
      alert(resultado.mensaje)
    }
  }

  return (
    <article className="group flex flex-col border border-ink/10 bg-white transition-colors hover:border-wine/40">
      {/* Imagen */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
        <img
          src={imageUrl}
          alt={`Botella de ${vino.nombre}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="wine-badge">
          {TIPO_LABEL[vino.tipo] || vino.tipo}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow text-xs text-vine">
          {vino.tipo} · {vino.anio || '—'}
        </p>
        <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-ink">
          {vino.nombre}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">
          {vino.bodega}
        </p>

        {/* Stock */}
        {vino.stock <= 3 && vino.stock > 0 && (
          <p className="mt-2 text-xs font-medium text-amber-600 uppercase tracking-wide">
            Últimas {vino.stock} unidades
          </p>
        )}
        {vino.stock === 0 && (
          <p className="mt-2 text-xs font-medium text-red-600 uppercase tracking-wide">
            Sin stock
          </p>
        )}

        {/* Precio + botón */}
        <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="font-serif text-xl font-semibold text-wine">
            {formatPrecio(vino.precio)}
          </span>
          {vino.stock > 0 ? (
            <button
              onClick={handleAgregar}
              className="text-xs font-medium uppercase tracking-wide text-ink/60 transition-colors hover:text-wine"
            >
              Agregar →
            </button>
          ) : (
            <span className="text-xs font-medium uppercase tracking-wide text-ink/30">
              Por botella
            </span>
          )}
        </div>
      </div>
    </article>
  )
}