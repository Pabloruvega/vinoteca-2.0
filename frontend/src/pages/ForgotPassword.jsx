import { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import api from '../api'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError]     = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await api.post('/users/forgot-password', { email })
      setEnviado(true)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Ocurrió un error, intentá de nuevo')
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-20 bg-cream">
        <div className="w-full max-w-md">

          <div className="mb-8 text-center">
            <p className="eyebrow text-vine">Recuperar acceso</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              Ingresá tu email y te mandamos un link para restablecerla.
            </p>
          </div>

          <div className="border border-ink/10 bg-white p-8">
            {enviado ? (
              <div className="space-y-5 text-center">
                <p className="text-sm text-ink/70">
                  Si el email <strong>{email}</strong> está registrado, en unos minutos vas a recibir
                  un link para restablecer tu contraseña. Revisá también la carpeta de spam.
                </p>
                <Link to="/login" className="btn-primary inline-flex">
                  Volver a iniciar sesión →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="tu@email.com"
                  />
                </div>

                {error && (
                  <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="btn-primary w-full justify-center"
                >
                  {cargando ? 'Enviando...' : 'Enviar link de recuperación →'}
                </button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-ink/60">
            <Link to="/login" className="font-medium text-wine hover:text-vine">
              Volver a iniciar sesión
            </Link>
          </p>

        </div>
      </main>
      <SiteFooter />
    </>
  )
}
