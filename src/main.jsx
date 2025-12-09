import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./Home.jsx";
import Room from "./Room.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Room>
      <Home />
    </Room>
  </StrictMode>
);
