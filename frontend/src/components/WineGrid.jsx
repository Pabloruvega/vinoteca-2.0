import { useState } from 'react'
import WineCard from './WineCard'

const FILTROS = ['Todos', 'Tinto', 'Blanco', 'Rosado', 'Espumante']

export default function WineGrid({ vinos = [], loading = false }) {
  const [filtro, setFiltro] = useState('Todos')

  const visibles = filtro === 'Todos'
    ? vinos
    : vinos.filter(v => v.tipo === filtro)

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wine border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        {FILTROS.map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setFiltro(f)}
            className={`px-5 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
              f === filtro
                ? 'bg-wine text-white'
                : 'border border-ink/20 text-ink/60 hover:border-wine hover:text-wine'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {visibles.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map(vino => (
            <WineCard key={vino._id} vino={vino} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-ink/50">
          No hay vinos en esta categoría por el momento.
        </p>
      )}
    </div>
  )
}