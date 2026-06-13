import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('vinoteca_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vinoteca_cart', JSON.stringify(cart));
  }, [cart]);

  // Fix #10: addToCart ahora valida stock antes de agregar.
  // Retorna un objeto { ok, mensaje } para que el componente pueda mostrar feedback.
  const addToCart = (vino, cantidad = 1) => {
    if (vino.stock <= 0) {
      return { ok: false, mensaje: `${vino.nombre} no tiene stock disponible.` };
    }

    let mensaje = null;

    setCart(prev => {
      const exists = prev.find(item => item.vino._id === vino._id);

      if (exists) {
        const nuevaCantidad = exists.cantidad + cantidad;

        if (nuevaCantidad > vino.stock) {
          // No actualizamos el carrito, marcamos el error
          mensaje = `No podés agregar más unidades. Stock disponible: ${vino.stock}`;
          return prev;
        }

        return prev.map(item =>
          item.vino._id === vino._id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      }

      return [...prev, { vino, cantidad }];
    });

    if (mensaje) return { ok: false, mensaje };
    return { ok: true, mensaje: `${vino.nombre} agregado al carrito.` };
  };

  const removeFromCart = (vinoId) => {
    setCart(prev => prev.filter(item => item.vino._id !== vinoId));
  };

  // Fix #10: updateQuantity también valida contra el stock
  const updateQuantity = (vinoId, cantidad) => {
    setCart(prev => prev.map(item => {
      if (item.vino._id === vinoId) {
        if (cantidad <= 0) return item; // No permitir 0 o negativo, usar removeFromCart para eso
        if (cantidad > item.vino.stock) return item; // No exceder stock
        return { ...item, cantidad };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.vino.precio * item.cantidad), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
