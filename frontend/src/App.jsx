import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'

import HomePage     from './pages/HomePage'
import Shop         from './pages/Shop'
import NosotrosPage from './pages/NosotrosPage'
import ContactoPage from './pages/ContactoPage'
import Carrito      from './pages/Carrito'
import MisCompras   from './pages/MisCompras'
import AdminPanel   from './pages/AdminPanel'
import Login        from './components/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'
import MiCuenta        from './pages/MiCuenta'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Panel de gestión — sin diseño público. Accesible para admins y empleados;
       AdminPanel muestra distintas secciones según el rol. */}
    <Route
      path="/admin/*"
      element={
        user?.role === 'admin' || user?.role === 'empleado'
         ? <AdminPanel />
         : <Navigate to="/" replace />
  }
/>

      {/* Páginas públicas */}
      <Route path="/"          element={<HomePage />} />
      <Route path="/vinos"     element={<Shop />} />
      <Route path="/nosotros"  element={<NosotrosPage />} />
      <Route path="/contacto"  element={<ContactoPage />} />
      <Route path="/carrito"   element={<Carrito />} />

      {/* Login y registro — el componente ya incluye SiteHeader y SiteFooter */}
      <Route path="/login"    element={<Login onLoginSuccess={() => window.location.href = '/'} />} />
      <Route path="/registro" element={<Login modo="registro" onLoginSuccess={() => window.location.href = '/'} />} />

      {/* Recuperación de contraseña */}
      <Route path="/olvide-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protegidas */}
      <Route
        path="/mis-compras"
        element={
          <ProtectedRoute>
            <MisCompras />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mi-cuenta"
        element={
          <ProtectedRoute>
            <MiCuenta />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}