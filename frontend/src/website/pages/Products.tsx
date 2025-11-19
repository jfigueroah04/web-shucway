import { useState, useEffect, useMemo } from 'react';
import type React from 'react';
import type { LucideProps } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Beef, Sandwich, Pizza, Drumstick, Utensils, Star } from 'lucide-react';
import { FaCartPlus, FaTrash } from 'react-icons/fa';
import './Products.css';

const menuItems = [
  { name: 'Shucos', img: '/image/shucos/salami.jpeg', desc: 'Variedad de clásicos' },
  { name: 'Hamburguesa', img: '/image/hamburguesas/bacon.jpg', desc: 'Muchos tipos' },
  { name: 'Gringa', img: '/image/gringa/adobada.jpeg', desc: 'Delicias estilo gringa' },
  { name: 'Salchipapas', img: '/image/papas/salchipapas.jpg', desc: 'Sabor único' },
  { name: 'Papas Fritas', img: '/image/papas/french_fries.jpg', desc: 'Acompañamiento dorado, hecho en el local' },
];

// Productos del menú con imágenes desde public/image
type Product = { id: number; name: string; category: string; price: number; img: string };

const productsList: Product[] = [
  { id: 1, name: 'Bcon Burger', category: 'Hamburguesa', price: 20.0, img: '/image/hamburguesas/bacon.jpg' },
  { id: 2, name: 'Cheesse Burger', category: 'Hamburguesa', price: 15.0, img: '/image/hamburguesas/chesse_burger.webp' },
  { id: 3, name: 'Coca Cola', category: 'Bebida', price: 6.0, img: '/image/other/logo-umg.png' },
  { id: 4, name: 'Cuadril de Pollo', category: 'Pollo', price: 25.0, img: '/image/hamburguesas/chicken_fried.jpg' },
  { id: 5, name: 'Double Cheese Burger', category: 'Hamburguesa', price: 18.0, img: '/image/hamburguesas/double_cheese.webp' },
  { id: 6, name: 'French Fries', category: 'Papas Fritas', price: 10.0, img: '/image/papas/french_fries.jpg' },
  { id: 7, name: 'Shuco Adobado', category: 'Shucos', price: 12.0, img: '/image/shucos/adobado.jpeg' },
  { id: 8, name: 'Gringa Mixta', category: 'Gringa', price: 16.0, img: '/image/gringa/mixta.jpg' },
];

const categories = ['Todos', ...menuItems.map(m => m.name)];

const categoryIcons: Record<string, React.ComponentType<LucideProps>> = {
  'Todos': Star,
  'Hamburguesa': Beef,
  'Shucos': Sandwich,
  'Gringa': Pizza,
  'Salchipapas': Drumstick,
  'Papas Fritas': Utensils,
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
  const [clientName, setClientName] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [page, setPage] = useState(1);
  const productsPerPage = 8; // show 8 products per page (4 cols x 2 rows)
  const [cartExpanded, setCartExpanded] = useState(false);
  const [nameError, setNameError] = useState(false);
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
    if (!clientName.trim()) {
      setNameError(true);
      // scroll to cart to force user to see the message
      const el = document.querySelector('.cart-sidebar');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const phone = '50252025909';
    const messageLines = cart.map((c) => `${c.qty} x ${c.name} - Q${(c.qty * c.price).toFixed(2)}`);
    const extras = [] as string[];
    if (clientName) extras.push(`Cliente: ${clientName}`);
    if (orderNote) extras.push(`Notas: ${orderNote}`);
    const message = `Hola! Quisiera ordenar:\n${messageLines.join('\n')}\n\n${extras.join('\n')}\n\nTotal: Q${totalAmount.toFixed(2)}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={clientName}
                  aria-invalid={nameError}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (nameError && e.target.value.trim()) setNameError(false);
                  }}
                  className={nameError ? 'invalid' : ''}
                />

                {/* 'Cómo lo quieres' removed per request */}

                <label>Notas / Descripción</label>
                <textarea placeholder="Ej: Sin cebolla, extra salsa..." value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
                {nameError && <div className="input-error">El nombre del cliente es obligatorio</div>}
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
                  disabled={!clientName.trim() || cart.length === 0}
                  title={!clientName.trim() ? 'Agrega el nombre del cliente' : ''}
                >CONTINUAR</button>
              </div>
            </aside>
            {/* Floating cart button for small screens (visible via CSS) */}
            <a href="/cart" className="responsive-cart-button" aria-label="Ver carrito">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'white'}}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span style={{marginLeft:6, marginRight:6}}>Ver carrito</span>
              <span className="badge">{cartCount}</span>
            </a>
        </div>
      </section>
    </div>
  );
};

export default Products;
