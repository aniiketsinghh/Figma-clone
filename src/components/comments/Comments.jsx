// src/components/comments/Comments.jsx
import React from "react";
import { ClientSideSuspense } from "@liveblocks/react";

import CommentsOverlay from "./CommentsOverlay";

export const Comments = () => (
  <ClientSideSuspense fallback={null}>
    {() => <CommentsOverlay />}
  </ClientSideSuspense>
);

export default Comments;
