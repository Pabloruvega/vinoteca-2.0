import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router no resetea el scroll al cambiar de ruta: al navegar desde el
// pie de una página a otra, la nueva queda scrolleada a la misma altura.
// Este componente lleva la ventana al inicio cada vez que cambia el pathname.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
