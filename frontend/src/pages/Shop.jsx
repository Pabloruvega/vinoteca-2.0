import { useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import WineGrid from '../components/WineGrid'
import api from '../api'

export default function Shop() {
  const [vinos, setVinos]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/vinos')
      .then(r => setVinos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SiteHeader />
      <main>

        {/* Header de sección */}
        <section className="border-b border-ink/10 bg-wine text-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="eyebrow text-white/70">La colección</p>
            <h1 className="mt-5 max-w-2xl font-serif text-5xl font-semibold leading-tight text-balance md:text-6xl">
              Nuestros vinos
            </h1>
            <p className="mt-6 max-w-xl leading-relaxed text-white/80">
              Cada etiqueta cuenta una historia de la tierra sanjuanina. Elegí
              tu preferido o descubrí algo nuevo.
            </p>
          </div>
        </section>

        {/* Grilla con filtros */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <WineGrid vinos={vinos} loading={loading} />
        </section>

      </main>
      <SiteFooter />
    </>
  )
}