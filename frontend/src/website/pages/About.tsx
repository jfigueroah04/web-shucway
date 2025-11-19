import "./About.css";
import {
  Hourglass,
  Truck,
  CreditCard,
  Handshake,
  Info,
} from "lucide-react";

const About = () => {
  return (
    <div className="about-page">
      {/* Hero/Intro Section */}
      <section className="about-hero-section animate-fade-in">
        <div className="about-hero-bg"></div>
        <div className="about-hero-content animate-slide-up">
          <h1 className="about-title">SOBRE NOSOTROS</h1>
          <p className="about-subtitle">
            Descubre más acerca de la historia y los objetivos de este
            maravilloso negocio
          </p>
        </div>
      </section>

      {/* Features Row */}
      <section className="about-features animate-fade-in-delay">
        <div className="about-features-grid">
          <div className="about-feature-card animate-slide-up">
            <Hourglass className="w-10 h-10 text-[#00B074] mx-auto mb-2" />
            <h4>Año Apertura</h4>
            <p>01 de Julio 2024</p>
          </div>
          <div className="about-feature-card animate-slide-up">
            <Truck className="w-10 h-10 text-[#00B074] mx-auto mb-2" />
            <h4>Despacho Rápido</h4>
            <p>Entrega en el local eficiente</p>
          </div>
          <div className="about-feature-card animate-slide-up">
            <CreditCard className="w-10 h-10 text-[#00B074] mx-auto mb-2" />
            <h4>Pago Seguro</h4>
            <p>Acepta pagos con tarjeta de crédito, débito y transferencias</p>
          </div>
          <div className="about-feature-card animate-slide-up">
            <Handshake className="w-10 h-10 text-[#00B074] mx-auto mb-2" />
            <h4>Atención Personalizada</h4>
            <p>
              Nos esforzamos en ofrecer un servicio al cliente cálido y cercano
            </p>
          </div>
        </div>
      </section>

      {/* Historia Section */}
      <section className="about-history-section animate-fade-in">
        <div className="about-history-content animate-slide-left">
          <h2>NUESTRA HISTORIA</h2>
          <div className="about-history-text">
            <p>
              Shucway nació en marzo de 2015 como un proyecto familiar que
              complementaba las actividades profesionales del equipo fundador.
              Desde el inicio recibió una acogida muy positiva de la comunidad
              local, y rápidamente se convirtió en un espacio cercano para
              vecinos y visitantes.
            </p>

            <p>
              Tras una pausa motivada por compromisos personales, el 1 de julio
              de 2024 decidimos reabrir Shucway con nuevos colaboradores y una
              visión renovada: fortalecer el proyecto desde lo familiar y
              ofrecer un servicio de mayor calidad, sin perder la cercanía que
              nos caracteriza.
            </p>
          </div>
        </div>

        {/* Icono grande reemplazando la imagen */}
        <div className="about-history-img animate-zoom-in">
          <div className="bg-icon-wrapper">
            <Info className="icon-bounce" />
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="about-mv-section animate-fade-in-delay">
        <div className="about-mv-grid">
          <div
            className="about-mv-box about-mv-mision animate-slide-left"
            style={{ background: "#FFD40D", color: "#12443D" }}
          >
            <h3>MISIÓN</h3>
            <p>
              La misión principal de la empresa radica en consolidar un proyecto
              familiar que promueva valores en las nuevas generaciones. Al mismo
              tiempo, busca ofrecer productos y servicios de óptima calidad,
              garantizando la satisfacción y la confianza de los clientes que
              eligen Shucway.
            </p>
          </div>
          <div
            className="about-mv-box about-mv-vision animate-slide-right"
            style={{ background: "#00B074", color: "#fff" }}
          >
            <h3>VISIÓN</h3>
            <p>
              Lograr que Shucway sea reconocido como un negocio eficiente y
              organizado gracias al uso de herramientas tecnológicas accesibles.
              Esto permitirá su expansión y consolidación sin perder su esencia
              familiar.
            </p>
          </div>
        </div>
      </section>

      {/* Galería de fotos */}
      {/* Galería de fotos */}
<section className="about-gallery-section animate-fade-in">
  <div className="about-gallery-grid">
    <img
      src="/image/fotos-local/local1.jpg"
      alt="Local Shucway exterior"
      className="about-gallery-img animate-zoom-in"
    />
    <img
      src="/image/fotos-local/local2.jpg"
      alt="Local Shucway interior"
      className="about-gallery-img animate-zoom-in"
    />
    <img
      src="/image/fotos-local/local3.jpg"
      alt="Equipo Shucway"
      className="about-gallery-img animate-zoom-in"
    />
    <img
      src="/image/fotos-local/local4.jpg"
      alt="Menú Shucway"
      className="about-gallery-img animate-zoom-in"
    />
    <img
      src="/image/fotos-local/local5.jpg"
      alt="Clientes en Shucway"
      className="about-gallery-img animate-zoom-in"
    />
    <img
      src="/image/fotos-local/local.jpg"
      alt="Ambiente Shucway"
      className="about-gallery-img animate-zoom-in"
    />
  </div>
</section>

    </div>
  );
};

export default About;
