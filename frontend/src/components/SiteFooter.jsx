import { Link } from 'react-router-dom'

const navegacion = [
  { href: '/',         label: 'Inicio' },
  { href: '/vinos',    label: 'Vinos' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-wine text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-semibold">Bodega del Sol</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            Vinos de altura nacidos al pie de los Andes, en el corazón del valle
            del Tulum, San Juan, Argentina.
          </p>
        </div>

        <div>
          <p className="eyebrow text-white/60 text-xs">Navegación</p>
          <ul className="mt-4 space-y-2">
            {navegacion.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-white/60 text-xs">Visitanos</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>Ruta 40, Pocito</li>
            <li>San Juan, Argentina</li>
            <li>+54 264 000 0000</li>
            <li>hola@bodegag1.com.ar</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Bodega G1. Todos los derechos reservados.</p>
          <p>Beber con moderación. Prohibida su venta a menores de 18 años.</p>
        </div>
      </div>
    </footer>
  )
}