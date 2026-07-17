import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const IMG_BODEGA = 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=80'
const IMG_COPA   = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80'

const hitos = [
  { anio: '1952', titulo: 'El primer viñedo',       texto: 'Don Antonio planta las primeras cepas de Malbec en el valle del Tulum, dando inicio a la tradición familiar.' },
  { anio: '1985', titulo: 'Nace la bodega',          texto: 'La segunda generación construye la bodega y comienza a elaborar sus propios vinos con identidad sanjuanina.' },
  { anio: '2008', titulo: 'Vinos de altura',         texto: 'Incorporamos viñedos a más de 1.100 metros, buscando la máxima expresión del terroir andino.' },
  { anio: 'Hoy',  titulo: 'Tradición e innovación',  texto: 'La tercera generación combina el oficio heredado con técnicas modernas para llevar nuestros vinos al mundo.' },
]

export default function NosotrosPage() {
  return (
    <>
      <SiteHeader />
      <main>

        {/* Hero */}
        <section className="relative flex min-h-[55vh] items-center overflow-hidden">
          <img src={IMG_BODEGA} alt="Interior de la bodega" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-wine/80" />
          <div className="relative mx-auto w-full max-w-6xl px-6 text-white">
            <p className="eyebrow text-white/80">Nuestra historia</p>
            <h1 className="mt-5 max-w-2xl font-serif text-5xl font-semibold leading-tight text-balance md:text-6xl">
              El alma de la tierra sanjuanina
            </h1>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-xl leading-relaxed text-ink">
            En Bodega G1 creemos que un gran vino no se hace en la bodega,
            sino en el viñedo. Por eso cuidamos cada cepa como lo hicieron
            nuestros abuelos: con paciencia, respeto y una profunda conexión con
            la tierra.
          </p>
          <p className="mt-6 leading-relaxed text-ink/60">
            San Juan nos regala un clima único: días soleados, noches frescas y
            una luz que madura las uvas a la perfección. Ese carácter andino es
            lo que querés sentir en cada copa.
          </p>
        </section>

        {/* Línea de tiempo */}
        <section className="border-y border-ink/10 bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-serif text-4xl font-semibold text-ink md:text-5xl">
              Nuestra trayectoria
            </h2>
            <div className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {hitos.map(hito => (
                <div key={hito.anio} className="bg-white p-8">
                  <p className="font-serif text-3xl font-semibold text-wine">{hito.anio}</p>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-ink">{hito.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">{hito.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="eyebrow text-vine">Nuestra filosofía</p>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight text-ink text-balance md:text-5xl">
              Respeto por la naturaleza, pasión por el oficio
            </h2>
            <p className="mt-6 leading-relaxed text-ink/60">
              Trabajamos con prácticas sustentables que cuidan el suelo y el
              agua, recursos preciados en nuestra región semidesértica. Creemos
              en una viticultura honesta, que deje hablar al terroir.
            </p>
            <Link to="/contacto" className="link-arrow mt-8">
              Visitá la bodega →
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <img src={IMG_COPA} alt="Copa de vino tinto" className="h-full w-full object-cover" />
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}