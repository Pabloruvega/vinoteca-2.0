import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../auth/AuthProvider'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import api from '../api'

const API_BASE = 'http://localhost:5000'

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio)
}

export default function Carrito() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const payload = {
        items: cart.map(item => ({
          vino: item.vino._id,
          nombre: item.vino.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.vino.precio,
        })),
        total: getCartTotal(),
      }
      await api.post('/ventas', payload)
      clearCart()
      navigate('/mis-compras')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.mensaje || 'Error al procesar la compra.')
    }
  }

  return (
    <>
      <SiteHeader />
      <main>

        {/* Header */}
        <section className="border-b border-ink/10 bg-wine text-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="eyebrow text-white/70">Tu selección</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">
              Carrito de compras
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">

          {cart.length === 0 ? (
            /* Carrito vacío */
            <div className="flex flex-col items-center py-20 text-center">
              <p className="font-serif text-3xl font-semibold text-ink">Tu carrito está vacío</p>
              <p className="mt-3 text-ink/60">Explorá nuestro catálogo y elegí tus vinos.</p>
              <Link to="/vinos" className="btn-primary mt-8">
                Ver vinos →
              </Link>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-3">

              {/* Lista de items */}
              <div className="lg:col-span-2">
                <div className="divide-y divide-ink/10">
                  {cart.map(item => (
                    <div key={item.vino._id} className="flex gap-5 py-6">
                      {/* Imagen */}
                      <img
                        src={item.vino.image ? `${API_BASE}${item.vino.image}` : 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&q=80'}
                        alt={item.vino.nombre}
                        className="h-24 w-16 flex-shrink-0 object-cover border border-ink/10"
                      />

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-serif text-xl font-semibold text-ink">
                              {item.vino.nombre}
                            </h3>
                            <p className="mt-0.5 text-sm text-ink/50">{item.vino.bodega}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.vino._id)}
                            className="text-xs font-medium uppercase tracking-wide text-ink/40 transition-colors hover:text-red-600"
                          >
                            Eliminar
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Cantidad */}
                          <div className="flex items-center gap-3 border border-ink/15">
                            <button
                              onClick={() => updateQuantity(item.vino._id, item.cantidad - 1)}
                              disabled={item.cantidad <= 1}
                              className="px-3 py-1.5 text-ink/60 transition-colors hover:text-ink disabled:opacity-30"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-ink">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.vino._id, item.cantidad + 1)}
                              className="px-3 py-1.5 text-ink/60 transition-colors hover:text-ink"
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <span className="font-serif text-lg font-semibold text-wine">
                            {formatPrecio(item.vino.precio * item.cantidad)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vaciar */}
                <button
                  onClick={clearCart}
                  className="mt-4 text-xs font-medium uppercase tracking-wide text-ink/40 transition-colors hover:text-red-600"
                >
                  Vaciar carrito
                </button>
              </div>

              {/* Resumen */}
              <div className="lg:col-span-1">
                <div className="border border-ink/10 bg-white p-8">
                  <h2 className="font-serif text-2xl font-semibold text-ink">Resumen</h2>

                  <div className="mt-6 space-y-3">
                    {cart.map(item => (
                      <div key={item.vino._id} className="flex justify-between text-sm text-ink/70">
                        <span>{item.vino.nombre} × {item.cantidad}</span>
                        <span>{formatPrecio(item.vino.precio * item.cantidad)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
                    <span className="text-sm font-medium uppercase tracking-wide text-ink/60">Total</span>
                    <span className="font-serif text-2xl font-semibold text-wine">
                      {formatPrecio(getCartTotal())}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="btn-primary mt-8 w-full justify-center"
                  >
                    {user ? 'Confirmar compra →' : 'Ingresar para comprar →'}
                  </button>

                  <Link
                    to="/vinos"
                    className="mt-4 block text-center text-xs font-medium uppercase tracking-wide text-ink/50 transition-colors hover:text-wine"
                  >
                    Seguir comprando
                  </Link>
                </div>
              </div>

            </div>
          )}
        </section>

      </main>
      <SiteFooter />
    </>
  )
}