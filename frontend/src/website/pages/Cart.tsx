import './Cart.css';
import { useEffect, useState, useRef } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cart');
      setCart(raw ? JSON.parse(raw) : []);
    } catch (e) {
      setCart([]);
    }
  }, []);

  // Save cart to sessionStorage, but avoid overwriting on initial mount
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    try {
      sessionStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
    } catch (e) {}
  }, [cart]);

  const changeQty = (id: number, qty: number) => {
    setCart((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it)));
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((it) => it.id !== id));

  const total = cart.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0);

  return (
    <div className="cart-page container">
      <h1>Tu Carrito</h1>
      {cart.length === 0 ? (
        <div className="cart-empty">No hay productos en el carrito.</div>
      ) : (
        <div className="cart-list">
          {cart.map((it) => (
            <div key={it.id} className="cart-row">
              <div className="row-left">
                <div className="cart-name">{it.name}</div>
                <div className="cart-price">Q{it.price}</div>
              </div>
              <div className="row-right">
                <div className="qty-controls">
                  <button onClick={() => changeQty(it.id, (it.qty || 0) - 1)}><FaMinus/></button>
                  <span>{it.qty}</span>
                  <button onClick={() => changeQty(it.id, (it.qty || 0) + 1)}><FaPlus/></button>
                </div>
                <button className="trash-btn" onClick={() => removeItem(it.id)}><FaTrash/></button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <div className="cart-total">Total: <strong>Q{total}</strong></div>
            <div className="cart-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/productos')}>Seguir comprando</button>
              <button className="btn btn-success" onClick={() => {
                const message = `Hola, quiero confirmar mi pedido:\n${cart.map(it => `${it.name} x${it.qty} - Q${it.price * it.qty}`).join('\n')}\nTotal: Q${total}`;
                const url = `https://wa.me/50212345678?text=${encodeURIComponent(message)}`; // Replace with actual number
                window.open(url, '_blank');
              }}>Confirmar compra</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
