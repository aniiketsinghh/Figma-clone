// index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Room from "./liveblocks/Room.jsx"; // <-- correct path depending on your project

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Room>
      <App />
    </Room>
  </StrictMode>
);
