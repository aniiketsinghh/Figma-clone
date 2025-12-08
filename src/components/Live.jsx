import React, { useCallback, useEffect, useState } from "react";
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "./liveblocks.config"; // adjust path
import useInterval from "./hooks/useInterval"; // adjust path
import { CursorMode } from "./types/type"; // adjust path
import { shortcuts } from "./constants"; // adjust path

import { Comments } from "./comments/Comments";
import { CursorChat, FlyingReaction, LiveCursors, ReactionSelector } from "./index";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";

const Live = ({ canvasRef, undo, redo }) => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence();

  const broadcast = useBroadcastEvent();

  const [reactions, setReactions] = useState([]);
  const [cursorState, setCursorState] = useState({
    mode: CursorMode.Hidden,
  });

  const setReaction = useCallback((reaction) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  // Remove old reactions every 1 second
  useInterval(() => {
    setReactions((reactions) => reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000));
  }, 1000);

  // Broadcast reactions every 100ms
  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      setReactions((reactions) =>
        reactions.concat([{ point: { x: cursor.x, y: cursor.y }, value: cursorState.reaction, timestamp: Date.now() }])
      );

      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  useEventListener((eventData) => {
    const event = eventData.event;
    setReactions((reactions) =>
      reactions.concat([{ point: { x: event.x, y: event.y }, value: event.value, timestamp: Date.now() }])
    );
  });

  useEffect(() => {
    const onKeyUp = (e) => {
      if (e.key === "/") {
        setCursorState({ mode: CursorMode.Chat, previousMessage: null, message: "" });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "/") e.preventDefault();
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  const handlePointerMove = useCallback((event) => {
    event.preventDefault();
    if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({ cursor: { x, y } });
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    setCursorState({ mode: CursorMode.Hidden });
    updateMyPresence({ cursor: null, message: null });
  }, []);

  const handlePointerDown = useCallback((event) => {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({ cursor: { x, y } });

    setCursorState((state) =>
      cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
    );
  }, [cursorState.mode]);

  const handlePointerUp = useCallback(() => {
    setCursorState((state) =>
      cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
    );
  }, [cursorState.mode]);

  const handleContextMenuClick = useCallback((key) => {
    switch (key) {
      case "Chat":
        setCursorState({ mode: CursorMode.Chat, previousMessage: null, message: "" });
        break;
      case "Reactions":
        setCursorState({ mode: CursorMode.ReactionSelector });
        break;
      case "Undo":
        undo();
        break;
      case "Redo":
        redo();
        break;
      default:
        break;
    }
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="relative flex h-full w-full flex-1 items-center justify-center"
        id="canvas"
        style={{ cursor: cursorState.mode === CursorMode.Chat ? "none" : "auto" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <canvas ref={canvasRef} />

        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}

        {cursor && (
          <CursorChat
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />
        )}

        {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector setReaction={setReaction} />
        )}

        <LiveCursors others={others} />
        <Comments />
      </ContextMenuTrigger>

      <ContextMenuContent className="right-menu-content">
        {shortcuts.map((item) => (
          <ContextMenuItem
            key={item.key}
            className="right-menu-item"
            onClick={() => handleContextMenuClick(item.name)}
          >
            <p>{item.name}</p>
            <p className="text-xs text-primary-grey-300">{item.shortcut}</p>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Live;
