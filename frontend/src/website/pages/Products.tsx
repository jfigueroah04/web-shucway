import { useState, useEffect, useMemo } from 'react';
import type React from 'react';
import type { LucideProps } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Beef, Sandwich, Pizza, Drumstick, Utensils, Star, Coffee } from 'lucide-react';
import { FaCartPlus, FaTrash } from 'react-icons/fa';
import './Products.css';
import { buildWhatsAppUrl } from '../../config/whatsapp';

const menuItems = [
  { name: 'Shucos', img: '/image/shucos/salami.jpeg', desc: 'Variedad de clásicos' },
  { name: 'Hamburguesas', img: '/image/hamburguesas/bacon.jpg', desc: 'Muchos tipos' },
  { name: 'Gringas', img: '/image/gringa/adobada.jpeg', desc: 'Delicias estilo gringa' },
  { name: 'Pollo', img: '/image/hamburguesas/chicken_fried.jpg', desc: 'Opciones de pollo' },
  { name: 'Papas Fritas y Salchipapas', img: '/image/papas/salchipapas.jpg', desc: 'Acompañamientos' },
  { name: 'Bebidas', img: '/image/other/logo-umg.png', desc: 'Refrescos' },
];

// Productos del menú con imágenes desde public/image
type Product = { id: number; name: string; category: string; price: number; img: string };

const productsList: Product[] = [
  // Gringas
  { id: 1, name: 'Gringa Adobada', category: 'Gringas', price: 20.0, img: '/image/gringa/gringa_adobada.jpg' },
  { id: 2, name: 'Gringa de Asada', category: 'Gringas', price: 18.0, img: '/image/gringa/gringa_asada.jpg' },
  { id: 3, name: 'Gringa de Chorizo', category: 'Gringas', price: 16.0, img: '/image/gringa/gringa_chorizo.jpg' },
  { id: 4, name: 'Gringa de Pollo', category: 'Gringas', price: 16.0, img: '/image/gringa/gringa_pollo.jpg' },
  { id: 5, name: 'Gringa Mixta', category: 'Gringas', price: 20.0, img: '/image/gringa/gringa_mixta.jpg' },
  // Hamburguesas
  { id: 6, name: 'Bacon Burger', category: 'Hamburguesas', price: 20.0, img: '/image/hamburguesas/bacon_burger.jpg' },
  { id: 7, name: 'Cheese Burger', category: 'Hamburguesas', price: 15.0, img: '/image/hamburguesas/cheese_burger.jpg' },
  { id: 8, name: 'Double Cheese Burger', category: 'Hamburguesas', price: 20.0, img: '/image/hamburguesas/double_cheese_burger.jpg' },
  { id: 9, name: 'Hamburguesa Clásica', category: 'Hamburguesas', price: 25.0, img: '/image/hamburguesas/hamburguesa_clasica.jpg' },
  { id: 10, name: 'Hamburguesa con Queso', category: 'Hamburguesas', price: 28.0, img: '/image/hamburguesas/hamburguesa_con_queso.jpg' },
  { id: 11, name: 'Hamburguesa Doble', category: 'Hamburguesas', price: 35.0, img: '/image/hamburguesas/hamburguesa_doble.jpg' },
  // Shucos
  { id: 12, name: 'Shuco de Adobado', category: 'Shucos', price: 15.0, img: '/image/shucos/shuco_adobado.jpg' },
  { id: 13, name: 'Shuco de Asada', category: 'Shucos', price: 15.0, img: '/image/shucos/shuco_asada.jpg' },
  { id: 14, name: 'Shuco de Chorizo', category: 'Shucos', price: 12.0, img: '/image/shucos/shuco_chorizo.jpg' },
  { id: 15, name: 'Shuco de Longaniza', category: 'Shucos', price: 12.0, img: '/image/shucos/shuco_longaniza.jpg' },
  { id: 16, name: 'Shuco de Salami', category: 'Shucos', price: 12.0, img: '/image/shucos/shuco_salami.jpg' },
  { id: 17, name: 'Shuco de Salchicha', category: 'Shucos', price: 12.0, img: '/image/shucos/shuco_salchicha.jpg' },
  // Pollo
  { id: 18, name: 'Cuadril de Pollo', category: 'Pollo', price: 10.0, img: '/image/pollo/cuadril_pollo.jpg' },
  { id: 19, name: 'French Fries (Pollo)', category: 'Pollo', price: 15.0, img: '/image/pollo/french_fries_pollo.jpg' },
  { id: 20, name: 'Pollo Frito con Papitas', category: 'Pollo', price: 18.0, img: '/image/pollo/pollo_frito_con_papitas.jpg' },
  // Papas Fritas y Salchipapas
  { id: 21, name: 'Salchipapas', category: 'Papas Fritas y Salchipapas', price: 20.0, img: '/image/papas/salchipapas.jpg' },
  { id: 22, name: 'McPatatas (Papas Fritas)', category: 'Papas Fritas y Salchipapas', price: 15.0, img: '/image/papas/mcpatatas.jpg' },
  // Bebidas
  { id: 23, name: 'Coca Cola', category: 'Bebidas', price: 6.0, img: '/image/bebidas/coca_cola.jpg' },
];

const categories = ['Todos', ...menuItems.map(m => m.name)];

const categoryIcons: Record<string, React.ComponentType<LucideProps>> = {
  'Todos': Star,
  'Hamburguesas': Beef,
  'Shucos': Sandwich,
  'Gringas': Pizza,
  'Pollo': Utensils,
  'Papas Fritas y Salchipapas': Drumstick,
  'Bebidas': Coffee,
};

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState<(Product & { qty: number })[]>(() => {
    try {
      const raw = sessionStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
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
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const productsPerPage = isMobile ? 6 : 8;
  const [cartExpanded, setCartExpanded] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState('');
  const [, setTimeLeft] = useState(604800); // 7 días en segundos
    const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 604800));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cartCount = cart.reduce((s, i) => s + (i.qty || 0), 0);
  const cartTotal = cart.reduce((s, i) => s + (i.qty || 0) * i.price, 0);

   useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const filtered = useMemo(() => {
    if (activeCategory === 'Todos') return productsList;
    return productsList.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  // clamp page when filtered count changes
  useEffect(() => {
    const count = filtered.length;
    const max = Math.max(1, Math.ceil(count / productsPerPage));
    if (page > max) setPage(max);
  }, [filtered.length, page]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: number) => setCart((prev) => prev.filter((i) => i.id !== productId));

  const changeQty = (productId: number, qty: number) => setCart((prev) => prev.map((i) => i.id === productId ? { ...i, qty: Math.max(1, qty) } : i));

  const totalAmount = cart.reduce((s, item) => s + item.qty * item.price, 0);

  const confirmWhatsApp = () => {
    if (cart.length === 0) return;
    if (!firstName.trim() || !lastName.trim()) {
      if (!firstName.trim() && !lastName.trim()) setNameErrorMsg('Ingrese Nombre y Apellido');
      else if (!firstName.trim()) setNameErrorMsg('Ingrese Nombre');
      else setNameErrorMsg('Ingrese Apellido');
      const el = document.querySelector('.cart-sidebar');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const phone = '50256252922';
    const messageLines = cart.map((c) => `${c.qty} x ${c.name} - Q${(c.qty * c.price).toFixed(2)}`);
    // Build message: client first, then list of items, then total, then notes
    const clientLine = `${firstName} ${lastName}` ? `Cliente: ${firstName} ${lastName}` : '';
    const itemsSection = `Pedido:\n${messageLines.join('\n')}`;
    const totalLine = `Total: Q${totalAmount.toFixed(2)}`;
    const notesLine = orderNote ? `Notas: ${orderNote}` : '';
    // Ensure Total and Notas are on their own lines
    const message = [
      'Hola, quiero confirmar mi pedido:',
      clientLine,
      itemsSection,
      totalLine,
      notesLine,
    ].filter(Boolean).join('\n\n');
    window.open(buildWhatsAppUrl(message), '_blank');
  };

  // persist cart to sessionStorage and notify header
  useEffect(() => {
    try {
      sessionStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
    // dispatch a custom event so Header can listen and update
    try {
      const ev = new CustomEvent('cart-updated', { detail: cart });
      window.dispatchEvent(ev);
    } catch (e) {
      // ignore
    }
  }, [cart]);

  // persist client/order info and notify other pages
  useEffect(() => {
    try {
      sessionStorage.setItem('clientFirstName', firstName);
      sessionStorage.setItem('clientLastName', lastName);
      sessionStorage.setItem('orderNote', orderNote);
      window.dispatchEvent(new CustomEvent('order-updated', { detail: { firstName, lastName, orderNote } }));
    } catch (e) {}
  }, [firstName, lastName, orderNote]);

  // also listen for cart updates from other components (e.g., Header dropdown)
  useEffect(() => {
    const handler = (ev: Event) => {
      try {
        // @ts-ignore
        const payload = (ev as CustomEvent).detail as Array<any>;
        setCart(payload);
      } catch (e) {
        try {
          const raw = sessionStorage.getItem('cart');
          setCart(raw ? JSON.parse(raw) : []);
        } catch (e2) {}
      }
    };
    window.addEventListener('cart-updated', handler as EventListener);
    // keep client/order in sync with other components
    const onOrder = (ev: Event) => {
      try {
        // @ts-ignore
        const payload = (ev as CustomEvent).detail || {};
        // support both legacy `clientName` and new `firstName`/`lastName`
        if (typeof payload.clientName === 'string') {
          // legacy single-field name
          const parts = payload.clientName.trim().split(/\s+/);
          setFirstName(parts.shift() || '');
          setLastName(parts.join(' ') || '');
        }
        if (typeof payload.firstName === 'string') setFirstName(payload.firstName);
        if (typeof payload.lastName === 'string') setLastName(payload.lastName);
        if (typeof payload.orderNote === 'string') setOrderNote(payload.orderNote);
      } catch (e) {}
    };
    window.addEventListener('order-updated', onOrder as EventListener);
    return () => window.removeEventListener('cart-updated', handler as EventListener);
  }, []);

  return (
    <div className="products">
      {/* Productos y Carrito */}
      <section className="products-destacados-section">
        {/* Title removed per request; show a short instruction instead */}
        <p className="products-description">Selecciona tus productos y agrégalos al carrito. Llena tu nombre y notas antes de continuar.</p>

        <div className="products-destacados-grid">
          <div className="category-and-pagination">
            <div className="category-bar">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
              <button
                key={cat}
                className={`chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {Icon && <Icon size={20} style={{ marginRight: 8 }} />}
                {cat}
              </button>
                );
            })}
            </div>
            {/* pagination moved above to align with filters */}
          </div>

          <div className="products-and-pagination">
            <div className="products-grid">
              {filtered.slice((page - 1) * productsPerPage, page * productsPerPage).map((p) => (
                <div className="products-destacado-card product-card" key={p.id}>
                  <img src={p.img} alt={p.name} />
                  <div className="products-destacado-info">
                    <div className="products-destacado-title">{p.name}</div>
                    <div className="products-destacado-price">Q{p.price.toFixed(2)}</div>
                      <div style={{ marginTop: 10 }}>
                      <button className="btn btn-primary btn-add" onClick={() => addToCart(p)}>
                        <FaCartPlus style={{ marginRight: 8 }} /> Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          {/* Catalog bar with load more */}
            <div className="catalog-bar">
              <div className="pagination-controls">
                <button
                  className="btn btn-secondary"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {page} de {Math.max(1, Math.ceil(filtered.length / productsPerPage))}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPage(page + 1)}
                  disabled={page === Math.max(1, Math.ceil(filtered.length / productsPerPage))}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

            <aside className="cart-sidebar">
              <div className="cart-header">ORDEN #</div>
              <div className="cart-highlight-msg">Agrega tu nombre o instrucciones para la orden</div>
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

                <label>Notas / Descripción</label>
                <textarea placeholder="Ej: Sin cebolla, extra salsa..." value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
                {nameErrorMsg && <div className="input-error">{nameErrorMsg}</div>}
              </div>
              <div className={`cart-list ${cartExpanded ? 'expanded' : 'collapsed'}`}>
                {cart.length === 0 && <div className="cart-empty">Tu orden está vacía</div>}
                {cart.map((i) => (
                  <div className="cart-item" key={i.id}>
                    <div className="cart-item-info">
                      <div className="name">{i.name}</div>
                      <div className="price">Q{(i.price * i.qty).toFixed(2)}</div>
                    </div>
                    <div className="cart-item-actions">
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => changeQty(i.id, i.qty - 1)}>-</button>
                        <input type="number" min={1} value={i.qty} onChange={(e) => changeQty(i.id, Number(e.target.value))} />
                        <button className="qty-btn" onClick={() => changeQty(i.id, i.qty + 1)}>+</button>
                      </div>
                      <button className="btn btn-danger remove-icon" onClick={() => removeFromCart(i.id)} aria-label="Eliminar">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expand toggle when there are more than 3 products */}
              {cart.length > 3 && (
                <div className="cart-expand-toggle">
                  {/* small toggle bar instead of button */}
                  <div className={`cart-toggle-bar ${cartExpanded ? 'open' : ''}`} onClick={() => setCartExpanded((v) => !v)} aria-hidden>
                    <div className="handle" />
                  </div>
                </div>
              )}

              <div className="cart-total">
                <div className="cart-total-label">TOTAL</div>
                <div className="cart-total-value">Q{totalAmount.toFixed(2)}</div>
              </div>

              <div className="cart-actions">
                <button className="btn btn-secondary">CANCELAR</button>
                <button
                  className="btn btn-success"
                  onClick={confirmWhatsApp}
                  disabled={!firstName.trim() || !lastName.trim() || cart.length === 0}
                  title={!firstName.trim() || !lastName.trim() ? 'Agrega Nombre y Apellido del cliente' : ''}
                >CONTINUAR</button>
              </div>
            </aside>
            {/* Floating cart button for small screens (visible via CSS) */}
            <button 
              onClick={() => {
                if (cart.length === 0) return;
                const name = prompt('Ingresa tu nombre para el pedido:');
                  if (name) {
                  const messageLines = cart.map((c) => `${c.qty} x ${c.name} - Q${(c.qty * c.price).toFixed(2)}`);
                  const client = name.trim();
                  const message = `Hola! Quisiera ordenar:\n${messageLines.join('\n')}\n\nCliente: ${client}\n\nTotal: Q${totalAmount.toFixed(2)}`;
                  window.open(buildWhatsAppUrl(message), '_blank');
                }
              }}
              className="responsive-cart-button" 
              aria-label="Enviar pedido por WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'white'}}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span style={{marginLeft:6, marginRight:6}}>Enviar pedido</span>
              <span className="badge">{cartCount}</span>
            </button>
        </div>
      </section>
    </div>
  );
};

export default Products;
