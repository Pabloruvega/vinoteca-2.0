import { useState, useEffect } from 'react';
import api from '../api';

const API_URL = 'http://localhost:5000';

const TIPOS = ['Tinto', 'Blanco', 'Rosado', 'Espumante'];

export default function FormularioVino({ onActualizar, vinoEditando, setVinoEditando }) {
  const [nombre,    setNombre]    = useState('');
  const [bodega,    setBodega]    = useState('');
  const [tipo,      setTipo]      = useState('Tinto');
  const [anio,      setAnio]      = useState('');
  const [precio,    setPrecio]    = useState('');
  const [stock,     setStock]     = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [cargando,  setCargando]  = useState(false);
  const [mensaje,   setMensaje]   = useState(null); // { tipo: 'ok'|'error', texto }

  useEffect(() => {
    if (vinoEditando) {
      setNombre(vinoEditando.nombre    || '');
      setBodega(vinoEditando.bodega    || '');
      setTipo(vinoEditando.tipo        || 'Tinto');
      setAnio(vinoEditando.anio        || '');
      setPrecio(vinoEditando.precio    || '');
      setStock(vinoEditando.stock ?? '');
      setPreview(vinoEditando.image ? `${API_URL}${vinoEditando.image}` : null);
      setImageFile(null);
    } else {
      resetForm();
    }
  }, [vinoEditando]);

  const resetForm = () => {
    setNombre(''); setBodega(''); setTipo('Tinto'); setAnio('');
    setPrecio(''); setStock(''); setImageFile(null); setPreview(null);
    setMensaje(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('bodega', bodega);
    formData.append('tipo',   tipo);
    formData.append('anio',   Number(anio));
    formData.append('precio', Number(precio));
    formData.append('stock',  Number(stock));
    if (imageFile) formData.append('image', imageFile);

    try {
      if (vinoEditando) {
        await api.put(`/vinos/${vinoEditando._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/vinos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setMensaje({ tipo: 'ok', texto: vinoEditando ? 'Vino actualizado.' : 'Vino cargado con éxito.' });
      onActualizar();
      if (!vinoEditando) resetForm();
      else setVinoEditando(null);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.mensaje || 'Error al guardar el vino.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="font-serif text-2xl font-semibold text-ink mb-6">
        {vinoEditando ? 'Editar vino' : 'Cargar nuevo vino'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Nombre */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Nombre *</label>
          <input
            type="text" required value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="form-input" placeholder="Ej: Reserva de Altura"
          />
        </div>

        {/* Bodega */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Bodega *</label>
          <input
            type="text" required value={bodega}
            onChange={e => setBodega(e.target.value)}
            className="form-input" placeholder="Ej: Bodega del Sol"
          />
        </div>

        {/* Tipo + Año */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Tipo *</label>
            <select
              value={tipo} onChange={e => setTipo(e.target.value)}
              className="form-input"
            >
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Añada</label>
            <input
              type="number" value={anio}
              onChange={e => setAnio(e.target.value)}
              className="form-input" placeholder="Ej: 2021"
              min="1900" max={new Date().getFullYear()}
            />
          </div>
        </div>

        {/* Precio + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Precio (ARS) *</label>
            <input
              type="number" required value={precio}
              onChange={e => setPrecio(e.target.value)}
              className="form-input" placeholder="Ej: 9800"
              min="0"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Stock (unidades) *</label>
            <input
              type="number" required value={stock}
              onChange={e => setStock(e.target.value)}
              className="form-input" placeholder="Ej: 24"
              min="0"
            />
          </div>
        </div>

        {/* Imagen */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Imagen de la botella
          </label>
          <div className="flex gap-5 items-start">
            <div className="flex-1">
              <input
                type="file" accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-ink/60
                  file:mr-4 file:py-2 file:px-4
                  file:border file:border-ink/20 file:bg-cream
                  file:text-sm file:font-medium file:text-ink
                  file:cursor-pointer file:transition-colors
                  hover:file:border-wine hover:file:text-wine"
              />
              <p className="mt-1.5 text-xs text-ink/40">JPG, PNG o WEBP · máx 5MB</p>
            </div>
            {preview && (
              <img
                src={preview} alt="Preview"
                className="h-24 w-16 object-cover border border-ink/10 flex-shrink-0"
              />
            )}
          </div>
        </div>

        {/* Mensaje feedback */}
        {mensaje && (
          <div className={`px-4 py-3 text-sm border ${
            mensaje.tipo === 'ok'
              ? 'border-vine/30 bg-vine/5 text-vine'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={cargando}
            className="btn-primary"
          >
            {cargando ? 'Guardando...' : vinoEditando ? 'Actualizar vino →' : 'Cargar vino →'}
          </button>
          {vinoEditando && (
            <button
              type="button"
              onClick={() => { setVinoEditando(null); resetForm(); }}
              className="btn-outline"
            >
              Cancelar
            </button>
          )}
        </div>

      </form>
    </div>
  );
}