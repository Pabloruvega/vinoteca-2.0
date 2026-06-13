import { useState, useEffect } from 'react';
import api from '../api';

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(precio);
}

function formatFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function HistorialVentas() {
  const [ventas,   setVentas]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    api.get('/ventas')
      .then(r => setVentas(r.data))
      .catch(() => setError('Error al obtener el historial.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-wine border-t-transparent" />
    </div>
  );

  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  if (ventas.length === 0) return (
    <p className="text-ink/50 text-center py-20">No hay ventas registradas.</p>
  );

  return (
    <div className="space-y-4">
      {ventas.map(venta => (
        <div key={venta._id} className="border border-ink/10 bg-white overflow-hidden">
          {/* Header de la venta */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 bg-cream">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
                {formatFecha(venta.createdAt)}
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink">
                {venta.user?.username || 'Usuario eliminado'}
                <span className="ml-2 text-xs text-ink/40">{venta.user?.email}</span>
              </p>
            </div>
            <p className="font-serif text-xl font-semibold text-wine">
              {formatPrecio(venta.total)}
            </p>
          </div>

          {/* Items */}
          <table className="w-full text-sm">
            <tbody className="divide-y divide-ink/5">
              {venta.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-5 py-3 font-medium text-ink">{item.nombre}</td>
                  <td className="px-5 py-3 text-ink/60">{item.cantidad} u.</td>
                  <td className="px-5 py-3 text-ink/60">{formatPrecio(item.precioUnitario)} c/u</td>
                  <td className="px-5 py-3 text-right font-medium text-ink">
                    {formatPrecio(item.precioUnitario * item.cantidad)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}