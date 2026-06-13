// mobile/api.js
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://192.168.0.153:5000';

export const getVinos = async () => {
  const res = await fetch(`${API_BASE}/api/vinos`);
  if (!res.ok) throw new Error('No se pudo obtener el catálogo.');
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión.');
  return data;
};

export const crearVenta = async (items, total, token) => {
  const res = await fetch(`${API_BASE}/api/ventas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ items, total }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al confirmar la venta.');
  return data;
};

export const obtenerMisCompras = async (token) => {
  const res = await fetch(`${API_BASE}/api/ventas`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener compras.');
  return res.json();
};