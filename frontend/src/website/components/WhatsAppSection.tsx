import './WhatsAppSection.css';
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
        <a href="https://wa.me/50256252922" target="_blank" rel="noopener noreferrer">
          <button className="whatsapp-section-btn">INGRESA AQUÍ</button>
        </a>
      </div>
    </div>
  );
};

export default WhatsAppSection;
