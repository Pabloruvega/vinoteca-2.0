import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useCart } from '../context/CartContext'

const links = [
  { href: '/',         label: 'Inicio' },
  { href: '/vinos',    label: 'Vinos' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { cart } = useCart()

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="font-serif text-2xl font-semibold tracking-tight text-wine">
            Bodega G1
          </span>
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ink/50">
            San Juan · Argentina
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-wine ${
                pathname === link.href ? 'text-wine' : 'text-ink/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Acciones desktop */}
        <div className="hidden items-center gap-4 md:flex">

          {/* Carrito */}
          <Link
            to="/carrito"
            className="relative flex items-center gap-1.5 text-sm font-medium text-ink/70 transition-colors hover:text-wine"
          >
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-wine text-[0.6rem] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Usuario */}
          {user ? (
            <div className="flex items-center gap-3">
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-medium uppercase tracking-wide text-vine transition-colors hover:text-wine"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/mis-compras"
                className="text-sm font-medium text-ink/70 transition-colors hover:text-wine"
              >
                {user.username}
              </Link>
              <Link
                to="/mi-cuenta"
                className="text-xs font-medium uppercase tracking-wide text-ink/40 transition-colors hover:text-wine"
              >
                Mi cuenta
              </Link>
              <button
                onClick={logout}
                className="text-xs font-medium uppercase tracking-wide text-ink/40 transition-colors hover:text-red-600"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary py-2.5 px-5 text-xs"
            >
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile: carrito + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link to="/carrito" className="relative p-1 text-ink/70">
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-wine text-[0.6rem] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="p-1 text-ink"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? (
              <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Nav mobile expandido */}
      {open && (
        <nav className="flex flex-col border-t border-ink/10 px-6 py-4 md:hidden bg-cream">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium uppercase tracking-wide text-ink/70 transition-colors hover:text-wine border-b border-ink/5 last:border-0"
            >
              {link.label}
            </Link>
          ))}

          {/* Usuario en mobile */}
          <div className="mt-3 pt-3 border-t border-ink/10">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/mis-compras"
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium text-ink/70 hover:text-wine"
                >
                  Mis compras ({user.username})
                </Link>
                <Link
                  to="/mi-cuenta"
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium text-ink/70 hover:text-wine"
                >
                  Mi cuenta
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm font-medium text-vine hover:text-wine"
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setOpen(false) }}
                  className="py-2 text-left text-sm font-medium text-ink/40 hover:text-red-600"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium text-wine hover:text-vine"
              >
                Ingresar →
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}