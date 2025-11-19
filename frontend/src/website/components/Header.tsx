import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaBoxOpen, FaEnvelope, FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState<Array<{ id?: number; name?: string; price?: number; qty?: number }>>([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // initialize cart details
    try {
      const raw = sessionStorage.getItem('cart');
      const items = raw ? JSON.parse(raw) : [];
      setCart(items);
      setCartCount(items.reduce((s: number, it: any) => s + (it.qty || 0), 0));
    } catch (e) {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setCart(e.detail);
      setCartCount(e.detail.reduce((s: number, it: any) => s + (it.qty || 0), 0));
    };
    const onDocClick = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setShowCartDropdown(false);
      }
    };
    window.addEventListener('cart-updated', handler as EventListener);
    window.addEventListener('click', onDocClick);
    return () => {
      window.removeEventListener('cart-updated', handler as EventListener);
      window.removeEventListener('click', onDocClick);
    };
  }, []);

  // No hover dropdown behavior required for navbar

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <NavLink to="/home" className="logo-link">
            <img src="/img/logo.png" alt="Shucway" className="header-logo logo-hover" />
          </NavLink>
        </div>
        <nav className="nav">
          <ul className={`nav-list ${showMobileMenu ? 'mobile-open' : ''}`}>
            <li className="nav-module">
              <FaHome className="nav-icon" />
              <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>Inicio</NavLink>
            </li>
            <li className="nav-module">
              <FaUsers className="nav-icon" />
              <NavLink to="/nosotros" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>Nosotros</NavLink>
            </li>
            <li className="nav-module">
              <FaBoxOpen className="nav-icon" />
              <NavLink to="/productos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>Productos</NavLink>
            </li>
            <li className="nav-module">
              <FaEnvelope className="nav-icon" />
              <NavLink to="/contacto" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>Contacto</NavLink>
            </li>
            {/* mobile cart removed from menu: we show header cart separately on mobile */}
          </ul>
        </nav>

        <div className="header-actions">
          <div className="nav-cart" ref={cartRef}>
            <button
              className={`nav-module cart-button ${showCartDropdown ? 'open' : ''}`}
              title="Abrir carrito"
              onClick={(e) => {
                e.preventDefault();
                setShowCartDropdown((v) => !v);
              }}
            >
              <FaShoppingCart className="nav-icon" />
              <span className="cart-badge">{cartCount}</span>
            </button>
            {showCartDropdown && (
              <div className="cart-dropdown">
                <div className="cart-dropdown-header">Tu carrito</div>
                <div className="cart-dropdown-items">
                  {cart && cart.length > 0 ? (
                    cart.map((item) => (
                      <div className="dropdown-item" key={item.id}>
                        <div className="dropdown-item-main">
                          <div className="dropdown-item-name">{item.name}</div>
                          <div className="dropdown-item-price">Q{(item.qty || 0) * (item.price || 0)}</div>
                        </div>
                        <div className="dropdown-item-actions">
                          <button
                            className="qty-btn"
                            onClick={() => {
                              const newQty = Math.max(1, (item.qty || 1) - 1);
                              const updated = cart.map((it) => (it.id === item.id ? { ...it, qty: newQty } : it));
                              sessionStorage.setItem('cart', JSON.stringify(updated));
                              window.dispatchEvent(new CustomEvent('cart-updated', { detail: updated }));
                            }}
                          >
                            <FaMinus />
                          </button>
                          <span className="qty-value">{item.qty}</span>
                          <button
                            className="qty-btn"
                            onClick={() => {
                              const newQty = (item.qty || 0) + 1;
                              const updated = cart.map((it) => (it.id === item.id ? { ...it, qty: newQty } : it));
                              sessionStorage.setItem('cart', JSON.stringify(updated));
                              window.dispatchEvent(new CustomEvent('cart-updated', { detail: updated }));
                            }}
                          >
                            <FaPlus />
                          </button>
                          <button
                            className="remove-btn"
                            onClick={() => {
                              const updated = cart.filter((it) => it.id !== item.id);
                              sessionStorage.setItem('cart', JSON.stringify(updated));
                              window.dispatchEvent(new CustomEvent('cart-updated', { detail: updated }));
                            }}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-empty">Tu carrito está vacío</div>
                  )}
                </div>
                <div className="cart-dropdown-footer">
                  <div className="dropdown-total">Total: Q{(cart || []).reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0)}</div>
                  <div className="dropdown-actions">
                    <NavLink to="/cart" className="btn btn-secondary" onClick={() => setShowCartDropdown(false)}>
                      Ver carrito
                    </NavLink>
                    <NavLink to="/productos" className="btn btn-success" onClick={() => setShowCartDropdown(false)}>
                      Continuar
                    </NavLink>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`hamburger ${showMobileMenu ? 'open' : ''} ${scrolled ? 'scrolled' : ''}`}
          onClick={() => setShowMobileMenu((v) => !v)}
          role="button"
          aria-label={showMobileMenu ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={showMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* overlay for mobile menu */}
      <div className={`mobile-overlay ${showMobileMenu ? 'open' : ''}`} onClick={() => setShowMobileMenu(false)} />

      {/* Close button visible while mobile menu is open */}
      {showMobileMenu && (
        <button className="mobile-menu-close" onClick={() => setShowMobileMenu(false)} aria-label="Cerrar menu">✕</button>
      )}
    </header>
  );
};

export default Header;