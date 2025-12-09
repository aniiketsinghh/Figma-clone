import React, { Suspense } from "react";
import { LiveMap } from "@liveblocks/client";
import { RoomProvider } from "../liveblocks.config";
import Loader from "./components/Loader";

export default function Room({ children }) {
  return (
    <RoomProvider
      id="fig-room"
      initialPresence={{
        cursor: null,
        cursorColor: null,
        editingText: null,
      }}
      initialStorage={{
        canvasObjects: new LiveMap(),
      }}
    >
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </RoomProvider>
  );
}
