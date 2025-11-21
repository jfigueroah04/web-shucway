// ...existing code...
import './Contact.css';
// no hooks needed here

const Contact = () => {
  // Remove the previous hack that changed the .main-content flex value.
  // That produced layout problems on mobile where the main area would shrink
  // and cause overlaps. Keep main layout controlled by CSS instead.
  return (
    <div id="contacto" className="contact-page">
      <div className="contact-main">
        <div className="contact-form-section">
          <h2 className="contact-title">CONTACTANOS</h2>
          <p className="contact-subtitle">Deja tus comentarios, para que podamos atenderte con gusto</p>
          <form className="contact-form-custom" onSubmit={async (e) => {
            e.preventDefault();

            const nombre = (e.currentTarget.elements.namedItem("nombre") as HTMLInputElement).value;
            const mensaje = (e.currentTarget.elements.namedItem("mensaje") as HTMLInputElement).value;

            const message = `Hola Shucway\nMi nombre es: ${nombre}\nMi mensaje es: ${mensaje}`;

            // use centralized helper to build WhatsApp URL
            try {
              const { buildWhatsAppUrl } = await import('../../config/whatsapp');
              window.open(buildWhatsAppUrl(message), '_blank');
            } catch (err) {
              console.error('Error loading WhatsApp helper:', err);
              // fallback
              window.open(`https://wa.me/50252025909?text=${encodeURIComponent(message)}`, '_blank');
            }
          }}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Completo *"
              required
            />
            <textarea
              name="mensaje"
              placeholder="Cuéntanos, ¿en que podemos ayudarte?"
              rows={4}
              required
              className="contact-textarea"
            ></textarea>
            <button type="submit" className="contact-btn">
              Deja un mensaje <span>&rarr;</span>
            </button>
          </form>

        </div>
        <div className="contact-info-section">
          <div className="contact-info-block">
            <div>
              <span className="contact-label">Correo Electronico</span>
              <p className="contact-value">luisrfp@gmail.com</p>
            </div>
            <div>
              <span className="contact-label">Numero</span>
              <p className="contact-value">(+502) 5202-5909</p>
            </div>
            <div>
              <span className="contact-label">Horario</span>
              <p className="contact-value">Miércoles - Sábado<br />16:00 - 22:00</p>
            </div>
          </div>

          <div className="contact-map">
            <a
              href="https://maps.app.goo.gl/s5bHJLDKRp4qvboB6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/image/other/location-static-map.png"
                alt="Mapa ubicación Shucway"
                className="contact-map-img"
              />
            </a>
          </div>

        </div>
      </div>

      {/* WhatsApp moved to Home page — keep Contact focused on form */}


      {/* Footer moved to global Footer component */}
    </div>
  );
};

export default Contact;
