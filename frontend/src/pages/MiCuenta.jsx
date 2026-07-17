import { useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { useAuth } from '../auth/AuthProvider'

export default function MiCuenta() {
  const { user, cambiarPassword } = useAuth()

  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva]   = useState('')
  const [confirmar, setConfirmar]           = useState('')
  const [mensaje, setMensaje]               = useState(null)
  const [cargando, setCargando]             = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje(null)

    if (passwordNueva !== confirmar) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden' })
      return
    }
    if (passwordNueva.length < 6) {
      setMensaje({ tipo: 'error', texto: 'La nueva contraseña debe tener al menos 6 caracteres' })
      return
    }

    setCargando(true)
    try {
      await cambiarPassword(passwordActual, passwordNueva)
      setMensaje({ tipo: 'ok', texto: 'Contraseña actualizada con éxito' })
      setPasswordActual('')
      setPasswordNueva('')
      setConfirmar('')
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.mensaje || 'Error al cambiar la contraseña' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-ink/10 bg-wine text-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="eyebrow text-white/70">Tu cuenta</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">
              Mi cuenta
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-lg">
            <p className="mb-1 text-sm text-ink/50">Sesión iniciada como</p>
            <p className="mb-8 font-medium text-ink">{user?.username} · {user?.email}</p>

            <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Cambiar contraseña</h2>

            <form onSubmit={handleSubmit} className="space-y-5 border border-ink/10 bg-white p-8">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Contraseña actual</label>
                <input
                  type="password"
                  required
                  value={passwordActual}
                  onChange={e => setPasswordActual(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Nueva contraseña</label>
                <input
                  type="password"
                  required
                  value={passwordNueva}
                  onChange={e => setPasswordNueva(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  required
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              {mensaje && (
                <div className={`px-4 py-3 text-sm border ${
                  mensaje.tipo === 'ok'
                    ? 'border-vine/30 bg-vine/5 text-vine'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}>
                  {mensaje.texto}
                </div>
              )}

              <button type="submit" disabled={cargando} className="btn-primary">
                {cargando ? 'Guardando...' : 'Actualizar contraseña →'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
