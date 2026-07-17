import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import api from '../api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword]  = useState('')
  const [error, setError]     = useState('')
  const [exito, setExito]     = useState(false)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)
    try {
      await api.post(`/users/reset-password/${token}`, { password })
      setExito(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'El link es inválido o expiró')
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
              Elegí una nueva contraseña
            </h1>
          </div>

          <div className="border border-ink/10 bg-white p-8">
            {exito ? (
              <p className="text-sm text-vine text-center">
                Contraseña actualizada con éxito. Te llevamos al login...
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Nueva contraseña</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Confirmar contraseña</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
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
                  {cargando ? 'Guardando...' : 'Restablecer contraseña →'}
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
