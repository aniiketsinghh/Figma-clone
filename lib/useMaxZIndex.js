import { useMemo } from "react";
import { useThreads } from "@/liveblocks.config";

// Returns the highest z-index of all threads
export const useMaxZIndex = () => {
  const { threads } = useThreads();

  return useMemo(() => {
    let max = 0;

    for (const thread of threads) {
      if (thread?.metadata?.zIndex > max) {
        max = thread.metadata.zIndex;
      }
    }

    return max;
  }, [threads]);
};
