import React from "react";
import CursorSVG from "../../assets/CursorSVG.jsx";

const Cursor = ({ color, x, y, message }) => {
  return (
    <div
      className="pointer-events-none absolute left-0 top-0"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <CursorSVG color={color} />

      {message && (
        <div
          className="absolute left-2 top-5 px-4 py-2"
          style={{ backgroundColor: color, borderRadius: 20 }}
        >
          <p className="whitespace-nowrap text-sm leading-relaxed text-white">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Cursor;
