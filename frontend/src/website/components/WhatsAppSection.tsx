import './WhatsAppSection.css';
import { WHATSAPP_PHONE } from '../../config/whatsapp';

// no icons used here currently

const WhatsAppSection = () => {
  return (
    <div className="whatsapp-section">
      <div className="whatsapp-icon">
        <img src="/image/other/wsp.png" alt="WhatsApp" className="whatsapp-section-img" />
      </div>
      <div className="whatsapp-section-text">
        <span className="whatsapp-section-title">CONTACTANOS MEDIANTE WHATSAPP</span>
      </div>
      <div>
        <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer">
          <button className="whatsapp-section-btn">INGRESA AQUÍ</button>
        </a>
      </div>
    </div>
  );
};

export default WhatsAppSection;
