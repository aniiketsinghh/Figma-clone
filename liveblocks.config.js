import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: import.meta.env.META_LIVEBLOCKS_PUBLIC_API_KEY,
});

export const {
  RoomProvider,
  useSelf,
  useOthers,
  useUpdateMyPresence,
    useMutation,
  useRedo,
  useStorage,
  useUndo,
  useCreateThread,
   useThreads, useUser, useEditThreadMetadata 

} = createRoomContext(client);
