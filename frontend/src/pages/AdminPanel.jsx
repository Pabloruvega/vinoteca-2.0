import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import api from '../api';
import FormularioVino from '../components/FormularioVino';
import CajaVentas from '../components/CajaVentas';
import HistorialVentas from '../components/HistorialVentas';

const API_URL = 'http://localhost:5000';

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(precio);
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ seccion, setSeccion, onLogout, onVerTienda }) {
  const items = [
    { id: 'vinos',    label: 'Vinos',    icon: '🍷' },
    { id: 'ventas',   label: 'Ventas',   icon: '🛒' },
    { id: 'usuarios', label: 'Usuarios', icon: '👥' },
  ];
  return (
    <aside className="w-56 flex-shrink-0 bg-wine min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/15">
        <p className="font-serif text-xl font-semibold text-cream">Bodega G1</p>
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/50 mt-0.5">Panel Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setSeccion(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors ${
              seccion === item.id
                ? 'bg-white/15 text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/15 space-y-1">
        <button
          onClick={onVerTienda}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors text-left"
        >
          <span>🛍️</span> Ver tienda
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/40 hover:text-red-300 transition-colors text-left"
        >
          <span>↩</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

// ─── Sección Vinos ────────────────────────────────────────────────────────────
function SeccionVinos() {
  const [vinos, setVinos]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [vinoEditando, setVinoEditando] = useState(null);
  const [subvista, setSubvista]       = useState('lista'); // 'lista' | 'nuevo'

  useEffect(() => { cargarVinos(); }, []);

  const cargarVinos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vinos');
      setVinos(res.data);
    } finally {
      setLoading(false);
    }
  };

  const eliminarVino = async (vino) => {
    if (!window.confirm(`¿Eliminar "${vino.nombre}"?`)) return;
    try {
      await api.delete(`/vinos/${vino._id}`);
      cargarVinos();
    } catch {
      alert('Error al eliminar.');
    }
  };

  const handleEditar = (vino) => {
    setVinoEditando(vino);
    setSubvista('nuevo');
  };

  const handleActualizar = () => {
    cargarVinos();
    setSubvista('lista');
  };

  return (
    <div>
      {/* Header de sección */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow text-vine">Gestión</p>
          <h2 className="font-serif text-3xl font-semibold text-ink">Vinos</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setSubvista('lista'); setVinoEditando(null); }}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
              subvista === 'lista'
                ? 'bg-wine text-white'
                : 'border border-ink/20 text-ink/60 hover:border-wine hover:text-wine'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => { setSubvista('nuevo'); setVinoEditando(null); }}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
              subvista === 'nuevo'
                ? 'bg-wine text-white'
                : 'border border-ink/20 text-ink/60 hover:border-wine hover:text-wine'
            }`}
          >
            + Cargar vino
          </button>
        </div>
      </div>

      {subvista === 'nuevo' ? (
        <FormularioVino
          onActualizar={handleActualizar}
          vinoEditando={vinoEditando}
          setVinoEditando={(v) => { setVinoEditando(v); if (!v) setSubvista('lista'); }}
        />
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-wine border-t-transparent" />
            </div>
          ) : vinos.length === 0 ? (
            <p className="text-ink/50 text-center py-20">No hay vinos cargados.</p>
          ) : (
            <div className="border border-ink/10 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10 bg-cream">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Vino</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Tipo</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Precio</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Stock</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Imagen</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {vinos.map(vino => (
                    <tr key={vino._id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-ink">{vino.nombre}</p>
                        <p className="text-xs text-ink/50">{vino.bodega}</p>
                      </td>
                      <td className="px-5 py-4 text-ink/70">{vino.tipo}</td>
                      <td className="px-5 py-4 font-medium text-wine">{formatPrecio(vino.precio)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${
                          vino.stock === 0 ? 'text-red-600' :
                          vino.stock <= 3 ? 'text-amber-600' : 'text-vine'
                        }`}>
                          {vino.stock} u.
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {vino.image
                          ? <img src={`${API_URL}${vino.image}`} alt={vino.nombre} className="h-10 w-7 object-cover border border-ink/10" />
                          : <span className="text-xs text-ink/30">—</span>
                        }
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => handleEditar(vino)}
                            className="text-xs font-medium uppercase tracking-wide text-ink/50 hover:text-wine transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarVino(vino)}
                            className="text-xs font-medium uppercase tracking-wide text-ink/30 hover:text-red-600 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Sección Ventas ───────────────────────────────────────────────────────────
function SeccionVentas() {
  const [vinos, setVinos]     = useState([]);
  const [subvista, setSubvista] = useState('historial');

  useEffect(() => {
    api.get('/vinos').then(r => setVinos(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow text-vine">Gestión</p>
          <h2 className="font-serif text-3xl font-semibold text-ink">Ventas</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSubvista('historial')}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
              subvista === 'historial'
                ? 'bg-wine text-white'
                : 'border border-ink/20 text-ink/60 hover:border-wine hover:text-wine'
            }`}
          >
            Historial
          </button>
          <button
            onClick={() => setSubvista('nueva')}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
              subvista === 'nueva'
                ? 'bg-wine text-white'
                : 'border border-ink/20 text-ink/60 hover:border-wine hover:text-wine'
            }`}
          >
            + Nueva venta
          </button>
        </div>
      </div>

      {subvista === 'nueva'
        ? <CajaVentas vinos={vinos} onVentaRealizada={() => { api.get('/vinos').then(r => setVinos(r.data)); setSubvista('historial'); }} />
        : <HistorialVentas />
      }
    </div>
  );
}

// ─── Sección Usuarios ─────────────────────────────────────────────────────────
function SeccionUsuarios() {
  const [usuarios, setUsuarios]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [subvista, setSubvista]             = useState('lista');

  // Campos formulario
  const [nombre,   setNombre]   = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [rol,      setRol]      = useState('empleado');
  const [mensaje,  setMensaje]  = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => { cargarUsuarios(); }, []);

  useEffect(() => {
    if (usuarioEditando) {
      setNombre(usuarioEditando.username || '');
      setEmail(usuarioEditando.email || '');
      setRol(usuarioEditando.isAdmin ? 'admin' : 'empleado');
      setPassword('');
    } else {
      setNombre(''); setEmail(''); setPassword(''); setRol('empleado');
    }
    setMensaje(null);
  }, [usuarioEditando]);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsuarios(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    try {
      if (usuarioEditando) {
        await api.put(`/users/${usuarioEditando._id}`, { nombre, email, rol, password: password || undefined });
      } else {
        await api.post('/users/admin/crear', { nombre, email, password, rol });
      }
      setMensaje({ tipo: 'ok', texto: usuarioEditando ? 'Usuario actualizado.' : 'Usuario creado.' });
      cargarUsuarios();
      setUsuarioEditando(null);
      setSubvista('lista');
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.mensaje || 'Error al guardar.' });
    } finally {
      setCargando(false);
    }
  };

  const eliminarUsuario = async (usuario) => {
    if (!window.confirm(`¿Eliminar a "${usuario.username}"?`)) return;
    try {
      await api.delete(`/users/${usuario._id}`);
      cargarUsuarios();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al eliminar.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow text-vine">Gestión</p>
          <h2 className="font-serif text-3xl font-semibold text-ink">Usuarios</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setSubvista('lista'); setUsuarioEditando(null); }}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
              subvista === 'lista'
                ? 'bg-wine text-white'
                : 'border border-ink/20 text-ink/60 hover:border-wine hover:text-wine'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => { setSubvista('nuevo'); setUsuarioEditando(null); }}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
              subvista === 'nuevo'
                ? 'bg-wine text-white'
                : 'border border-ink/20 text-ink/60 hover:border-wine hover:text-wine'
            }`}
          >
            + Nuevo usuario
          </button>
        </div>
      </div>

      {subvista !== 'lista' ? (
        /* Formulario */
        <div className="max-w-lg">
          <h3 className="font-serif text-2xl font-semibold text-ink mb-6">
            {usuarioEditando ? 'Editar usuario' : 'Crear usuario'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Nombre *</label>
              <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="form-input" placeholder="Nombre completo" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Email *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="usuario@email.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                {usuarioEditando ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
              </label>
              <input
                type="password"
                required={!usuarioEditando}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Rol *</label>
              <select value={rol} onChange={e => setRol(e.target.value)} className="form-input">
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
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

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={cargando} className="btn-primary">
                {cargando ? 'Guardando...' : usuarioEditando ? 'Actualizar →' : 'Crear usuario →'}
              </button>
              <button
                type="button"
                onClick={() => { setSubvista('lista'); setUsuarioEditando(null); }}
                className="btn-outline"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Lista */
        <>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-wine border-t-transparent" />
            </div>
          ) : (
            <div className="border border-ink/10 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10 bg-cream">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Usuario</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Rol</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">Creado</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {usuarios.map(u => (
                    <tr key={u._id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-ink">{u.username}</td>
                      <td className="px-5 py-4 text-ink/70">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${
                          u.isAdmin ? 'text-wine' : 'text-vine'
                        }`}>
                          {u.isAdmin ? 'Admin' : 'Empleado'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-ink/40">
                        {new Date(u.createdAt).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => { setUsuarioEditando(u); setSubvista('nuevo'); }}
                            className="text-xs font-medium uppercase tracking-wide text-ink/50 hover:text-wine transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarUsuario(u)}
                            className="text-xs font-medium uppercase tracking-wide text-ink/30 hover:text-red-600 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── AdminPanel principal ─────────────────────────────────────────────────────
export default function AdminPanel() {
  const [seccion, setSeccion] = useState('vinos');
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar
        seccion={seccion}
        setSeccion={setSeccion}
        onLogout={() => { logout(); navigate('/'); }}
        onVerTienda={() => navigate('/')}
      />
      <main className="flex-1 p-10 overflow-auto">
        {seccion === 'vinos'    && <SeccionVinos />}
        {seccion === 'ventas'   && <SeccionVentas />}
        {seccion === 'usuarios' && <SeccionUsuarios />}
      </main>
    </div>
  );
}