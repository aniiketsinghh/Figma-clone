// src/components/comments/CommentsOverlay.jsx
import React, { useRef } from "react";
import { useThreads, useUser, useEditThreadMetadata } from "../../../liveblocks.config";
import { useMaxZIndex } from "../../lib/useMaxZIndex.js";

import PinnedThread from "./PinnedThread.jsx";

const OverlayThread = ({ thread, maxZIndex }) => {
  const editThreadMetadata = useEditThreadMetadata();
  const { isLoading } = useUser(thread.comments[0].userId);
  const threadRef = useRef(null);

  const handleIncreaseZIndex = () => {
    if (maxZIndex === thread.metadata.zIndex) return;

    editThreadMetadata({
      threadId: thread.id,
      metadata: {
        zIndex: maxZIndex + 1,
      },
    });
  };

  if (isLoading) return null;

  return (
    <div
      ref={threadRef}
      id={`thread-${thread.id}`}
      className="absolute left-0 top-0 flex gap-5"
      style={{
        transform: `translate(${thread.metadata.x}px, ${thread.metadata.y}px)`,
      }}
    >
      <PinnedThread thread={thread} onFocus={handleIncreaseZIndex} />
    </div>
  );
};

const CommentsOverlay = () => {
  const { threads } = useThreads();
  const maxZIndex = useMaxZIndex();

  return (
    <div>
      {threads
        .filter((thread) => !thread.metadata.resolved)
        .map((thread) => (
          <OverlayThread key={thread.id} thread={thread} maxZIndex={maxZIndex} />
        ))}
    </div>
  );
};

export default CommentsOverlay;
