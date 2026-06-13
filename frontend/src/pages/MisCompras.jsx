import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import api from '../api'

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio)
}

function formatFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function MisCompras() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ventas')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SiteHeader />
      <main>

        {/* Header */}
        <section className="border-b border-ink/10 bg-wine text-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="eyebrow text-white/70">Tu cuenta</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">
              Mis compras
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-wine border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="font-serif text-3xl font-semibold text-ink">Todavía no realizaste compras</p>
              <p className="mt-3 text-ink/60">Explorá nuestro catálogo y elegí tus vinos.</p>
              <Link to="/vinos" className="btn-primary mt-8">
                Ver vinos →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="border border-ink/10 bg-white">

                  {/* Cabecera de la orden */}
                  <div className="flex flex-col items-start justify-between gap-3 border-b border-ink/10 px-6 py-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
                        Pedido del {formatFecha(order.createdAt)}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/30">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <span className="font-serif text-xl font-semibold text-wine">
                      {formatPrecio(order.total)}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-ink/5 px-6">
                    {order.items.map(item => (
                      <div
                        key={`${order._id}-${item.vino}`}
                        className="flex items-center justify-between py-4"
                      >
                        <div>
                          <p className="font-medium text-ink">{item.nombre}</p>
                          <p className="mt-0.5 text-sm text-ink/50">
                            {item.cantidad} {item.cantidad === 1 ? 'botella' : 'botellas'} × {formatPrecio(item.precioUnitario)}
                          </p>
                        </div>
                        <span className="font-serif text-lg font-semibold text-ink">
                          {formatPrecio(item.precioUnitario * item.cantidad)}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}

        </section>

      </main>
      <SiteFooter />
    </>
  )
}