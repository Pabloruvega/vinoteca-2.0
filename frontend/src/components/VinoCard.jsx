// --- frontend/src/components/VinoCard.jsx ---
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API_URL = "http://localhost:5000";

export default function VinoCard({ vino }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-gray-800 p-4 rounded shadow-md">
      <div className="w-full h-52 bg-gray-900 rounded flex items-center justify-center overflow-hidden">
        <img 
          src={
            vino.image 
              ? `${API_URL}${vino.image}` 
              : '/placeholder.png'
          } 
          alt={vino.nombre} 
          className="h-full w-full object-contain" 
        />
      </div>

      <h3 className="mt-2 font-semibold">{vino.nombre}</h3>
      <p className="text-sm text-gray-300">
        Bodega: {vino.bodega} • Stock: {vino.stock}
      </p>

      <div className="flex items-center justify-between mt-3">
        <span className="font-bold">${vino.precio}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              addToCart(vino, 1);
              alert('Añadido al carrito 🛒');
            }}
            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
            title="Añadir al carrito"
          >
            🛒
          </button>
          <Link 
            to={`/vinos/${vino._id}`} 
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  )
}
    