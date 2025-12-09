// src/components/comments/PinnedThread.jsx
import React, { useMemo, useState } from "react";
import { Thread } from "@liveblocks/react-comments";

const PinnedThread = ({ thread, onFocus, ...props }) => {
  const startMinimized = useMemo(() => Number(new Date()) - Number(new Date(thread.createdAt)) > 100, [thread.createdAt]);
  const [minimized, setMinimized] = useState(startMinimized);

  const memoizedContent = useMemo(
    () => (
      <div
        className="absolute flex cursor-pointer gap-4"
        {...props}
        onClick={(e) => {
          onFocus(thread.id);

          if (e.target && e.target.classList && e.target.classList.contains("lb-icon") && e.target.classList.contains("lb-button-icon")) {
            return;
          }

          setMinimized((m) => !m);
        }}
      >
        <div className="relative flex h-9 w-9 select-none items-center justify-center rounded-bl-full rounded-br-full rounded-tl-md rounded-tr-full bg-white shadow" data-draggable={true}>
          <img
            src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
            alt="Dummy Name"
            width={28}
            height={28}
            draggable={false}
            className="rounded-full"
          />
        </div>

        {!minimized ? (
          <div className="flex min-w-60 flex-col overflow-hidden rounded-lg bg-white text-sm shadow">
            <Thread
              thread={thread}
              indentCommentContent={false}
              onKeyUp={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
        ) : null}
      </div>
    ),
    // rerender when comments length or minimized changes
    [thread.comments.length, minimized, thread.id]
  );

  return <>{memoizedContent}</>;
};

export default PinnedThread;
