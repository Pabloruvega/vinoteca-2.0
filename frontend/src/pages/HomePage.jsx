import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import WineCard from '../components/WineCard'
import api from '../api'

// Imágenes de respaldo de Unsplash (en producción, reemplazá con las imágenes reales)
const IMG_HERO    = 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600&q=80'
const IMG_BODEGA  = 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=80'

export default function HomePage() {
  const [vinos, setVinos] = useState([])

  useEffect(() => {
    api.get('/vinos').then(r => setVinos(r.data)).catch(() => {})
  }, [])

  const destacados = vinos.slice(0, 3)

  return (
    <>
      <SiteHeader />
      <main>

        {/* ── Hero ── */}
        <section className="relative flex min-h-[88vh] items-center overflow-hidden">
          <img
            src={IMG_HERO}
            alt="Viñedos al pie de los Andes en San Juan, Argentina"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-wine/85 via-wine/55 to-wine/20" />
          <div className="relative mx-auto w-full max-w-6xl px-6">
            <div className="max-w-2xl text-white">
              <p className="eyebrow text-white/80">
                Vinoteca · San Juan, Argentina
              </p>
              <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] text-balance md:text-7xl">
                Vinos de altura, nacidos al pie de los Andes
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
                Una selección artesanal de Malbec, Syrah y Torrontés del valle
                del Tulum. Tradición, sol y tierra en cada copa.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/vinos" className="btn-primary bg-cream text-ink hover:bg-cream-dark">
                  Ver nuestros vinos →
                </Link>
                <Link to="/nosotros" className="btn-outline-light">
                  Conocé la bodega
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pilares ── */}
        <section className="border-b border-ink/10 bg-white">
          <div className="mx-auto grid max-w-6xl gap-px bg-ink/10 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="size-8 text-vine" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12z" />
                  </svg>
                ),
                titulo: 'Viñedos de altura',
                texto:  'Cepas cultivadas a más de 1.000 metros sobre el nivel del mar, donde el sol y la amplitud térmica hacen su magia.',
              },
              {
                icon: (
                  <svg className="size-8 text-vine" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                ),
                titulo: 'Cosecha artesanal',
                texto:  'Uvas seleccionadas y cosechadas a mano, respetando cada etapa del fruto para lograr su máxima expresión.',
              },
              {
                icon: (
                  <svg className="size-8 text-vine" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                ),
                titulo: 'Crianza paciente',
                texto:  'Vinos criados en barricas de roble, con el tiempo y el cuidado que exige la tradición sanjuanina.',
              },
            ].map(item => (
              <div key={item.titulo} className="bg-white p-10">
                {item.icon}
                <h3 className="mt-5 font-serif text-2xl font-semibold text-ink">
                  {item.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
                  {item.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Historia ── */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={IMG_BODEGA}
              alt="Interior de la bodega con barricas de roble"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow text-vine">Nuestra historia</p>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight text-ink text-balance md:text-5xl">
              Tres generaciones cultivando el sol sanjuanino
            </h2>
            <p className="mt-6 leading-relaxed text-ink/60">
              Desde 1952, nuestra familia trabaja la tierra del valle del Tulum.
              Lo que comenzó como un pequeño viñedo familiar se convirtió en una
              bodega que celebra el carácter único de San Juan: su luz intensa,
              sus noches frescas y su tierra generosa.
            </p>
            <p className="mt-4 leading-relaxed text-ink/60">
              Cada botella es el resultado de la paciencia, el respeto por la
              naturaleza y el amor por el oficio del vino.
            </p>
            <Link to="/nosotros" className="link-arrow mt-8">
              Leer más sobre nosotros →
            </Link>
          </div>
        </section>

        {/* ── Vinos destacados ── */}
        {destacados.length > 0 && (
          <section className="border-t border-ink/10 bg-white py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                <div>
                  <p className="eyebrow text-vine">Selección</p>
                  <h2 className="mt-4 font-serif text-4xl font-semibold text-ink md:text-5xl">
                    Vinos destacados
                  </h2>
                </div>
                <Link to="/vinos" className="link-arrow">
                  Ver toda la colección →
                </Link>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destacados.map(vino => (
                  <WineCard key={vino._id} vino={vino} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="bg-wine py-24 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-4xl font-semibold leading-tight text-balance md:text-5xl">
              Visitá nuestra bodega y viví la experiencia
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/80">
              Te invitamos a recorrer nuestros viñedos, conocer el proceso de
              elaboración y degustar nuestros mejores vinos frente a los Andes.
            </p>
            <Link to="/contacto" className="btn-primary mt-9 bg-cream text-ink hover:bg-cream-dark">
              Reservar una visita →
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}