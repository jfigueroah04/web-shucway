import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Loading from "./components/Loading";
import { BrowserRouter } from "react-router-dom";

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial, o esperar a que se carguen recursos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Ajustar tiempo según necesidad

    return () => clearTimeout(timer);
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        {isLoading ? <Loading /> : <App />}
      </BrowserRouter>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
