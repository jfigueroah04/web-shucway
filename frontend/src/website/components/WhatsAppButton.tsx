import './WhatsAppButton.css';
import { useLocation, useNavigate } from 'react-router-dom';

const WhatsAppButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // hide the floating whatsapp button on the products page
  if (location.pathname && location.pathname.startsWith('/productos')) return null;

  return (
    <button
      type="button"
      className="whatsapp-float"
      onClick={() => navigate('/productos')}
      aria-label="Ir a productos"
    >
      <img
        src="/image/other/wsp.png"
        alt="WhatsApp"
        width={36}
        height={36}
        className="whatsapp-img"
      />
    </button>
  );
};

export default WhatsAppButton;

