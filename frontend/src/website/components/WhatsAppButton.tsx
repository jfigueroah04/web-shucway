import './WhatsAppButton.css';
import { useLocation } from 'react-router-dom';

const WhatsAppButton = () => {
  const location = useLocation();
  // hide the floating whatsapp button on the products page
  if (location.pathname && location.pathname.startsWith('/productos')) return null;

  return (
    <a
      href="https://wa.me/50256252922"
    className="whatsapp-float"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chatea con nosotros en WhatsApp"
  >
    <img
      src="/image/other/wsp.png"
      alt="WhatsApp"
      width={36}
      height={36}
      className="whatsapp-img"
    />
  </a>
  );
};

export default WhatsAppButton;

