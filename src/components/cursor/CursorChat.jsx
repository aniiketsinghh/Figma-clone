import React from "react";
import CursorSVG from "../assets/CursorSVG";

const CursorChat = ({ cursor, cursorState, setCursorState, updateMyPresence }) => {
  const handleChange = (e) => {
    updateMyPresence({ message: e.target.value });
    setCursorState({
      mode: "chat",
      previousMessage: null,
      message: e.target.value,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setCursorState({
        mode: "chat",
        previousMessage: cursorState.message,
        message: "",
      });
    } else if (e.key === "Escape") {
      setCursorState({ mode: "hidden" });
    }
  };

  return (
    <div
      className="absolute top-0 left-0"
      style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
    >
      {cursorState.mode === "chat" && (
        <>
          <CursorSVG color="#000" />

          <div
            className="absolute left-2 top-5 bg-blue-500 px-4 py-2 text-sm text-white leading-relaxed"
            onKeyUp={(e) => e.stopPropagation()}
            style={{ borderRadius: 20 }}
          >
            {cursorState.previousMessage && (
              <div>{cursorState.previousMessage}</div>
            )}

            <input
              className="z-10 w-60 bg-transparent border-none text-white placeholder-blue-300 outline-none"
              autoFocus
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={cursorState.previousMessage ? "" : "Say something…"}
              value={cursorState.message}
              maxLength={50}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CursorChat;
