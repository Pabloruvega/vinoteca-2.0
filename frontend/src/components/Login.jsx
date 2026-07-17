import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

export default function Login({ onLoginSuccess, modo = 'login' }) {
  const { login, registro } = useAuth()
  const [nombre, setNombre]   = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [cargando, setCargando] = useState(false)

  const esRegistro = modo === 'registro'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      if (esRegistro) {
        if (!nombre.trim()) { setError('El nombre es obligatorio'); setCargando(false); return }
        await registro(nombre, email, password)
      } else {
        await login(email, password)
      }
      onLoginSuccess()
    } catch (err) {
      setError(
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        (esRegistro ? 'Error al registrarse' : 'Email o contraseña incorrectos')
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-20 bg-cream">
        <div className="w-full max-w-md">

          {/* Título */}
          <div className="mb-8 text-center">
            <p className="eyebrow text-vine">{esRegistro ? 'Nueva cuenta' : 'Bienvenido'}</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">
              {esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              {esRegistro
                ? 'Completá tus datos para empezar a comprar'
                : 'Ingresá para ver tu historial y realizar compras'}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5 border border-ink/10 bg-white p-8">

            {esRegistro && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Nombre</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="form-input"
                  placeholder="Tu nombre"
                />
              </div>
            )}

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

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-ink">Contraseña</label>
                {!esRegistro && (
                  <Link to="/olvide-password" className="text-xs font-medium text-wine hover:text-vine">
                    ¿Olvidaste tu contraseña?
                  </Link>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
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
              {cargando ? 'Cargando...' : esRegistro ? 'Crear cuenta →' : 'Ingresar →'}
            </button>
          </form>

          {/* Switch login / registro */}
          <p className="mt-6 text-center text-sm text-ink/60">
            {esRegistro ? (
              <>¿Ya tenés cuenta?{' '}
                <Link to="/login" className="font-medium text-wine hover:text-vine">
                  Iniciá sesión
                </Link>
              </>
            ) : (
              <>¿No tenés cuenta?{' '}
                <Link to="/registro" className="font-medium text-wine hover:text-vine">
                  Registrate
                </Link>
              </>
            )}
          </p>

        </div>
      </main>
      <SiteFooter />
    </>
  )
}