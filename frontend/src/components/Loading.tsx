import React from 'react';
import './Loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img src="/img/icon.png" alt="Loading" className="loading-icon" />
        <p>Cargando<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></p>
      </div>
    </div>
  );
};

export default Loading;