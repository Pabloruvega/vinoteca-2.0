// --- frontend/src/pages/VinoDetails.jsx ---
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../auth/AuthProvider'
import { useCart } from '../context/CartContext'

const API_URL = "http://localhost:5000"

export default function VinoDetails() {
  const { id } = useParams()
  const [vino, setVino] = useState(null)
  const nav = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/vinos/${id}`)
        setVino(res.data)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [id])

  const handleBuyNow = () => {
    addToCart(vino, 1)
    nav(`/carrito`)
  }

  const handleAddToCart = () => {
    addToCart(vino, 1)
    alert('Vino añadido al carrito 🛒')
  }

  if (!vino) return <div className="p-6 text-white">Cargando...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <button
        onClick={() => nav(-1)}
        className="mb-4 px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
      >
        ← Volver
      </button>
      <div className="w-full h-80 bg-gray-900 rounded flex items-center justify-center overflow-hidden">
        <img
          src={
            vino.image 
              ? `${API_URL}${vino.image}` 
              : "/placeholder.png"
          }
          alt={vino.nombre}
          className="h-full w-auto object-contain"
        />
      </div>

      <h1 className="text-3xl mt-4">{vino.nombre}</h1>
      <p className="mt-2 text-gray-300">Bodega: {vino.bodega}</p>
      <p className="text-gray-400">Stock disponible: {vino.stock}</p>

      <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4">
        <span className="text-2xl font-bold">${vino.precio}</span>
        {vino.stock > 0 ? (
          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Añadir al Carrito
            </button>
            <button 
              onClick={handleBuyNow} 
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              Comprar Ahora
            </button>
          </div>
        ) : (
          <span className="text-red-500 font-bold">Sin Stock</span>
        )}
      </div>
    </div>
  )
}
