import React from "react";
import Cursor from "./Cursor";
import { COLORS } from "../../constants/index.js";

const LiveCursors = ({ others }) => {
  return others.map(({ connectionId, presence }) => {
    if (!presence || !presence.cursor) return null;

    return (
      <Cursor
        key={connectionId}
        color={COLORS[connectionId % COLORS.length]}
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message}
      />
    );
  });
};

export default LiveCursors;
