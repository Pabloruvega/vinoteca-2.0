import { useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const datos = [
  { titulo: 'Dirección', lineas: ['Ruta 40 y Calle 11, Pocito', 'San Juan, Argentina'] },
  { titulo: 'Teléfono',  lineas: ['+54 264 5123456'] },
  { titulo: 'Email',     lineas: ['gestion@bodegag1.com.ar'] },
  { titulo: 'Horarios',  lineas: ['Lun a Sáb: 10 a 18 h', 'Domingos: con reserva'] },
]

function ContactForm() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Por ahora solo simula el envío — conectar con backend o servicio de email
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="border border-vine/30 bg-vine/5 p-6">
        <p className="font-medium text-ink">¡Mensaje enviado!</p>
        <p className="mt-1 text-sm text-ink/60">Te respondemos a la brevedad.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Nombre</label>
        <input
          type="text"
          required
          value={form.nombre}
          onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
          className="form-input"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          className="form-input"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Mensaje</label>
        <textarea
          required
          rows={5}
          value={form.mensaje}
          onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
          className="form-input resize-none"
          placeholder="¿En qué podemos ayudarte?"
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center">
        Enviar mensaje →
      </button>
    </form>
  )
}

export default function ContactoPage() {
  return (
    <>
      <SiteHeader />
      <main>

        {/* Header */}
        <section className="border-b border-ink/10 bg-wine text-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="eyebrow text-white/70">Estamos para ayudarte</p>
            <h1 className="mt-5 max-w-2xl font-serif text-5xl font-semibold leading-tight text-balance md:text-6xl">
              Contacto
            </h1>
            <p className="mt-6 max-w-xl leading-relaxed text-white/80">
              Reservá una visita, consultá por pedidos o simplemente vení a
              conocernos. Nos encanta compartir nuestros vinos.
            </p>
          </div>
        </section>

        {/* Formulario + info */}
        <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">Envianos un mensaje</h2>
            <p className="mt-3 text-ink/60">Completá el formulario y te respondemos a la brevedad.</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">Información</h2>
            <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-2">
              {datos.map(dato => (
                <div key={dato.titulo} className="bg-white p-7">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
                    {dato.titulo}
                  </h3>
                  {dato.lineas.map(linea => (
                    <p key={linea} className="mt-1 text-sm text-ink/60">{linea}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Mapa */}
            <div className="mt-px aspect-video w-full overflow-hidden border border-ink/10">
              <iframe
                title="Ubicación Bodega del Sol"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-68.65%2C-31.65%2C-68.45%2C-31.50&layer=mapnik&marker=-31.57%2C-68.55"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}