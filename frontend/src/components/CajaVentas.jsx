import { useState } from 'react';
import api from '../api';

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(precio);
}

export default function CajaVentas({ vinos, onVentaRealizada }) {
  const [carrito, setCarrito]               = useState([]);
  const [vinoSeleccionado, setVinoSeleccionado] = useState('');
  const [cantidad, setCantidad]             = useState(1);
  const [cargando, setCargando]             = useState(false);
  const [mensaje, setMensaje]               = useState(null);

  const vinosDisponibles = vinos.filter(v => v.stock > 0);

  const agregar = () => {
    if (!vinoSeleccionado) return;
    const vino = vinos.find(v => v._id === vinoSeleccionado);
    if (!vino) return;

    if (cantidad <= 0) { setMensaje({ tipo: 'error', texto: 'La cantidad debe ser mayor a 0.' }); return; }
    if (vino.stock < cantidad) { setMensaje({ tipo: 'error', texto: `Stock insuficiente. Disponible: ${vino.stock}` }); return; }

    const existe = carrito.find(i => i.vino === vino._id);
    if (existe) {
      if (existe.cantidad + Number(cantidad) > vino.stock) {
        setMensaje({ tipo: 'error', texto: `Stock máximo: ${vino.stock}` });
        return;
      }
      setCarrito(carrito.map(i =>
        i.vino === vino._id ? { ...i, cantidad: i.cantidad + Number(cantidad) } : i
      ));
    } else {
      setCarrito([...carrito, {
        vino: vino._id, nombre: vino.nombre,
        precioUnitario: vino.precio, cantidad: Number(cantidad)
      }]);
    }
    setVinoSeleccionado(''); setCantidad(1); setMensaje(null);
  };

  const quitar = (vinoId) => setCarrito(carrito.filter(i => i.vino !== vinoId));

  const total = carrito.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);

  const confirmar = async () => {
    if (carrito.length === 0) return;
    setCargando(true);
    setMensaje(null);
    try {
      await api.post('/ventas', { items: carrito, total });
      setMensaje({ tipo: 'ok', texto: 'Venta registrada con éxito.' });
      setCarrito([]);
      onVentaRealizada();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.mensaje || 'Error al registrar la venta.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h3 className="font-serif text-2xl font-semibold text-ink mb-6">Nueva venta</h3>

      {/* Selector */}
      <div className="flex gap-3 items-end border border-ink/10 bg-white p-5 mb-6">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/50">Vino</label>
          <select
            value={vinoSeleccionado}
            onChange={e => setVinoSeleccionado(e.target.value)}
            className="form-input"
          >
            <option value="">Seleccioná un vino</option>
            {vinosDisponibles.map(v => (
              <option key={v._id} value={v._id}>
                {v.nombre} — {formatPrecio(v.precio)} (stock: {v.stock})
              </option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/50">Cantidad</label>
          <input
            type="number" min="1" value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            className="form-input"
          />
        </div>
        <button onClick={agregar} className="btn-primary h-[42px]">
          Agregar →
        </button>
      </div>

      {/* Tabla carrito */}
      {carrito.length > 0 && (
        <div className="border border-ink/10 bg-white overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-cream">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Vino</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Cant.</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Precio unit.</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Subtotal</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {carrito.map(item => (
                <tr key={item.vino}>
                  <td className="px-5 py-3 font-medium text-ink">{item.nombre}</td>
                  <td className="px-5 py-3 text-ink/70">{item.cantidad}</td>
                  <td className="px-5 py-3 text-ink/70">{formatPrecio(item.precioUnitario)}</td>
                  <td className="px-5 py-3 font-medium text-wine">{formatPrecio(item.precioUnitario * item.cantidad)}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => quitar(item.vino)} className="text-xs text-ink/30 hover:text-red-600 transition-colors uppercase tracking-wide">
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total + confirmar */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-ink/10 bg-cream">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Total</p>
              <p className="font-serif text-2xl font-semibold text-wine">{formatPrecio(total)}</p>
            </div>
            <button onClick={confirmar} disabled={cargando} className="btn-primary">
              {cargando ? 'Registrando...' : 'Confirmar cobro →'}
            </button>
          </div>
        </div>
      )}

      {carrito.length === 0 && (
        <p className="text-sm text-ink/40 py-4">Agregá vinos para armar la venta.</p>
      )}

      {mensaje && (
        <div className={`px-4 py-3 text-sm border ${
          mensaje.tipo === 'ok'
            ? 'border-vine/30 bg-vine/5 text-vine'
            : 'border-red-200 bg-red-50 text-red-700'
        }`}>
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}