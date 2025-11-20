import './Cart.css';
import { useEffect, useState, useRef } from 'react';
import { buildWhatsAppUrl } from '../../config/whatsapp';
import { FaTrash, FaPlus, FaMinus, FaBoxOpen, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [cartExpanded, setCartExpanded] = useState(false);
  const [firstName, setFirstName] = useState(() => {
    try {
      return sessionStorage.getItem('clientFirstName') || '';
    } catch (e) {
      return '';
    }
  });
  const [lastName, setLastName] = useState(() => {
    try {
      return sessionStorage.getItem('clientLastName') || '';
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
  const [pickupTime, setPickupTime] = useState<'now' | 'later'>(() => {
    try {
      return (sessionStorage.getItem('pickupTime') as 'now' | 'later') || 'now';
    } catch (e) {
      return 'now';
    }
  });
  const [pickupHour, setPickupHour] = useState(() => {
    try {
      return sessionStorage.getItem('pickupHour') || '19:00';
    } catch (e) {
      return '19:00';
    }
  });
  const [pickupHourSelect, setPickupHourSelect] = useState(() => {
    try {
      const stored = sessionStorage.getItem('pickupHourSelect');
      if (stored) return stored;
      const hour = sessionStorage.getItem('pickupHour')?.split(':')[0] || '19';
      return hour;
    } catch (e) {
      return '19';
    }
  });
  const [pickupMinuteSelect, setPickupMinuteSelect] = useState(() => {
    try {
      const stored = sessionStorage.getItem('pickupMinuteSelect');
      if (stored) return stored;
      const minute = sessionStorage.getItem('pickupHour')?.split(':')[1] || '00';
      return minute;
    } catch (e) {
      return '00';
    }
  });

  // Update pickupHour when selects change
  useEffect(() => {
    const newTime = `${pickupHourSelect}:${pickupMinuteSelect}`;
    setPickupHour(newTime);
  }, [pickupHourSelect, pickupMinuteSelect]);
  const [nameErrorMsg, setNameErrorMsg] = useState('');
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
      sessionStorage.setItem('clientFirstName', firstName);
      sessionStorage.setItem('clientLastName', lastName);
      sessionStorage.setItem('orderNote', orderNote);
      sessionStorage.setItem('pickupTime', pickupTime);
      sessionStorage.setItem('pickupHour', pickupHour);
      sessionStorage.setItem('pickupHourSelect', pickupHourSelect);
      sessionStorage.setItem('pickupMinuteSelect', pickupMinuteSelect);
      window.dispatchEvent(new CustomEvent('order-updated', { detail: { firstName, lastName, orderNote } }));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try { sessionStorage.setItem('clientFirstName', firstName); } catch (e) {}
  }, [firstName]);

  useEffect(() => {
    try { sessionStorage.setItem('clientLastName', lastName); } catch (e) {}
  }, [lastName]);

  useEffect(() => {
    try { sessionStorage.setItem('orderNote', orderNote); } catch (e) {}
  }, [orderNote]);

  useEffect(() => {
    try { sessionStorage.setItem('pickupTime', pickupTime); } catch (e) {}
  }, [pickupTime]);

  useEffect(() => {
    try { sessionStorage.setItem('pickupHour', pickupHour); } catch (e) {}
  }, [pickupHour]);

  useEffect(() => {
    try { sessionStorage.setItem('pickupHourSelect', pickupHourSelect); } catch (e) {}
  }, [pickupHourSelect]);

  useEffect(() => {
    try { sessionStorage.setItem('pickupMinuteSelect', pickupMinuteSelect); } catch (e) {}
  }, [pickupMinuteSelect]);

  // listen to external order updates
  useEffect(() => {
    const onOrder = (ev: Event) => {
      try {
        const payload = (ev as CustomEvent).detail;
        if (payload && typeof payload.firstName === 'string') setFirstName(payload.firstName);
        if (payload && typeof payload.lastName === 'string') setLastName(payload.lastName);
        if (payload && typeof payload.orderNote === 'string') setOrderNote(payload.orderNote);
        if (payload && typeof payload.pickupTime === 'string') setPickupTime(payload.pickupTime);
        if (payload && typeof payload.pickupHour === 'string') setPickupHour(payload.pickupHour);
        if (payload && typeof payload.pickupHourSelect === 'string') setPickupHourSelect(payload.pickupHourSelect);
        if (payload && typeof payload.pickupMinuteSelect === 'string') setPickupMinuteSelect(payload.pickupMinuteSelect);
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
        <div className="name-row">
          <input
            type="text"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); if (nameErrorMsg && e.target.value.trim() && lastName.trim()) setNameErrorMsg(''); }}
            className={nameErrorMsg && !firstName.trim() ? 'invalid' : ''}
          />
          <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); if (nameErrorMsg && firstName.trim() && e.target.value.trim()) setNameErrorMsg(''); }}
            className={nameErrorMsg && !lastName.trim() ? 'invalid' : ''}
          />
        </div>
        {nameErrorMsg && <div className="field-error">{nameErrorMsg}</div>}
        <label>Notas / Descripción</label>
        <textarea placeholder="Ej: Sin cebolla, extra salsa..." value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
        <p className="delivery-note">Nota: No se hacen entregas a domicilio. Recoge tu pedido en el local.</p>

        <label>Tiempo de Pedido</label>
        <div className="pickup-time-options">
          <label>
            <input type="radio" name="pickupTime" value="now" checked={pickupTime === 'now'} onChange={() => setPickupTime('now')} />
            Ahora
          </label>
          <label>
            <input type="radio" name="pickupTime" value="later" checked={pickupTime === 'later'} onChange={() => setPickupTime('later')} />
            Después
          </label>
        </div>
        {pickupTime === 'later' && (
          <div className="pickup-hour">
            <label>Hora de recogida (19:00 - 22:00)</label>
            <div className="time-selects">
              <div className="time-group">
                <label>Hora</label>
                <select value={pickupHourSelect} onChange={(e) => setPickupHourSelect(e.target.value)}>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                </select>
              </div>
              <div className="time-group">
                <label>Minuto</label>
                <select value={pickupMinuteSelect} onChange={(e) => setPickupMinuteSelect(e.target.value)}>
                  {Array.from({ length: 60 }, (_, i) => {
                    const minute = i.toString().padStart(2, '0');
                    return <option key={minute} value={minute}>{minute}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      {cart.length === 0 ? (
        <div className="cart-empty">No hay productos en el carrito.</div>
      ) : (
              <div className="cart-list">
                {/* rows wrapper - becomes scrollable after 3 items */}
                <div className="cart-items">
                {(cartExpanded ? cart : cart.slice(0, 2)).map((it) => (
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
                {cart.length > 2 && (
                  <div className="cart-expand-toggle">
                    <button className="btn btn-secondary" onClick={() => setCartExpanded((v) => !v)}>
                      {cartExpanded ? 'Mostrar menos' : `Mostrar ${cart.length - 2} más`}
                    </button>
                  </div>
                )}
              
              <div className="cart-summary">
            <div className="cart-total">Total: <strong>Q{total}</strong></div>
              <div className="cart-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/productos')}>
                <FaBoxOpen className="btn-icon" /> Seguir Comprando Productos
              </button>
                <button
                className="btn btn-success"
                onClick={() => {
                  if (!firstName.trim() || !lastName.trim()) {
                    if (!firstName.trim() && !lastName.trim()) setNameErrorMsg('Ingrese Nombre y Apellido');
                    else if (!firstName.trim()) setNameErrorMsg('Ingrese Nombre');
                    else setNameErrorMsg('Ingrese Apellido');
                    return;
                  }
                  const messageLines = cart.map(it => `${it.qty} x ${it.name} - Q${(it.qty * it.price).toFixed(2)}`);
                  const clientLine = `${firstName} ${lastName}` ? `Mi nombre es: ${firstName} ${lastName}` : '';
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
                  window.open(buildWhatsAppUrl(message), '_blank');
                }}
                disabled={!cart.length}
                title={!firstName.trim() || !lastName.trim() ? 'Agrega Nombre y Apellido del cliente' : ''}
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
