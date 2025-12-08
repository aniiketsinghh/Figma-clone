"use client";

import { useOthers } from "@liveblocks/react";
import Home from "./Home";

export default function Room() {
  const others = useOthers();
  const userCount = others.length;

  return <div>
    <div>User count: {userCount}</div>
    <Home />
  </div>;
}