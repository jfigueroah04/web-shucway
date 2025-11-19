import './Cart.css';
import { useEffect, useState, useRef } from 'react';
import { FaTrash, FaPlus, FaMinus, FaBoxOpen, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [clientName, setClientName] = useState(() => {
    try {
      return sessionStorage.getItem('clientName') || '';
    } catch (e) {
      return '';
    }
  });
  const [orderNote, setOrderNote] = useState(() => {
    try {
      return sessionStorage.getItem('orderNote') || '';
    } catch (e) {
      return '';
    }
  });
  const [nameError, setNameError] = useState(false);
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
      // also persist current order info when cart changes
      sessionStorage.setItem('clientName', clientName);
      sessionStorage.setItem('orderNote', orderNote);
      window.dispatchEvent(new CustomEvent('order-updated', { detail: { clientName, orderNote } }));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try { sessionStorage.setItem('clientName', clientName); } catch (e) {}
  }, [clientName]);

  useEffect(() => {
    try { sessionStorage.setItem('orderNote', orderNote); } catch (e) {}
  }, [orderNote]);

  // listen to external order updates
  useEffect(() => {
    const onOrder = (ev: Event) => {
      try {
        const payload = (ev as CustomEvent).detail;
        if (payload && typeof payload.clientName === 'string') setClientName(payload.clientName);
        if (payload && typeof payload.orderNote === 'string') setOrderNote(payload.orderNote);
      } catch (e) {}
    };
    window.addEventListener('order-updated', onOrder as EventListener);
    return () => window.removeEventListener('order-updated', onOrder as EventListener);
  }, []);

  const changeQty = (id: number, qty: number) => {
    setCart((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it)));
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((it) => it.id !== id));

  const total = cart.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0);

  return (
    <div className="cart-page container">
      <h1>Tu Carrito</h1>
      <div className="cart-highlight-msg">Agrega tu nombre y una descripción antes de confirmar el pedido</div>

      <div className="order-client">
        <label>Nombre del cliente</label>
        <input
          type="text"
          placeholder="Tu nombre"
          value={clientName}
          onChange={(e) => { setClientName(e.target.value); if (nameError && e.target.value.trim()) setNameError(false); }}
          className={nameError ? 'invalid' : ''}
        />
        <label>Notas / Descripción</label>
        <textarea placeholder="Ej: Sin cebolla, extra salsa..." value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
      </div>
      {cart.length === 0 ? (
        <div className="cart-empty">No hay productos en el carrito.</div>
      ) : (
              <div className="cart-list">
                {/* rows wrapper - becomes scrollable after 3 items */}
                <div className="cart-items">
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
                </div>
              <div className="cart-summary">
            <div className="cart-total">Total: <strong>Q{total}</strong></div>
              <div className="cart-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/productos')}>
                <FaBoxOpen className="btn-icon" /> Seguir comprando
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  if (!clientName.trim()) {
                    setNameError(true);
                    return;
                  }
                  const messageLines = cart.map(it => `${it.qty} x ${it.name} - Q${(it.qty * it.price).toFixed(2)}`);
                  const clientLine = clientName ? `Cliente: ${clientName}` : '';
                  const itemsSection = `Pedido:\n${messageLines.join('\n')}`;
                  const totalLine = `Total: Q${total.toFixed(2)}`;
                  const notesLine = orderNote ? `Notas: ${orderNote}` : '';
                  const message = [
                    'Hola, quiero confirmar mi pedido:',
                    clientLine,
                    itemsSection,
                    totalLine,
                    notesLine,
                  ].filter(Boolean).join('\n\n');
                  const url = `https://wa.me/50256252922?text=${encodeURIComponent(message)}`; // Replace with actual number
                  window.open(url, '_blank');
                }}
                disabled={!cart.length}
                title={!clientName.trim() ? 'Agrega el nombre del cliente' : ''}
              >
                <FaWhatsapp className="btn-icon" /> Confirmar compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
