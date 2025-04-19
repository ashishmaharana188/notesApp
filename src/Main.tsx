import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/GlobalCssProps.css";
import App from "./App.tsx";
import ".././src/styles/color.module.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
