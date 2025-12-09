import { useRoom, useOthers, useUpdateMyPresence } from "@liveblocks/react";

export default function Reactions() {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();

  const handleReaction = (emoji) => {
    updateMyPresence({ reaction: emoji });

    // Remove reaction after 1 second
    setTimeout(() => updateMyPresence({ reaction: null }), 1000);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => handleReaction("👍")}>👍 Like</button>
      <button onClick={() => handleReaction("🔥")}>🔥 Fire</button>
      <button onClick={() => handleReaction("😂")}>😂 Laugh</button>

      <h3>Reactions from others:</h3>

      {others.map((user) =>
        user.presence?.reaction ? (
          <div key={user.connectionId}>
            User {user.connectionId}: {user.presence.reaction}
          </div>
        ) : null
      )}
    </div>
  );
}
