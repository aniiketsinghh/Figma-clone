// src/components/comments/PinnedComposer.jsx
import React from "react";
import { Composer } from "@liveblocks/react-comments";

/**
 * Simple pinned composer. Replaces next/image with an <img>.
 * onComposerSubmit will be called with (payload, event) by the Composer.
 */
const PinnedComposer = ({ onComposerSubmit, ...props }) => {
  const avatarUrl = `https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`;

  return (
    <div className="absolute flex gap-4" {...props}>
      <div className="select-none relative w-9 h-9 shadow rounded-tl-md rounded-tr-full rounded-br-full rounded-bl-full bg-white flex justify-center items-center">
        <img src={avatarUrl} alt="someone" width={28} height={28} className="rounded-full" />
      </div>

      <div className="shadow bg-white rounded-lg flex flex-col text-sm min-w-96 overflow-hidden p-2">
        <Composer
          onComposerSubmit={onComposerSubmit}
          autoFocus={true}
          onKeyUp={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
};

export default PinnedComposer;
