import React, { useMemo } from "react";

import { generateRandomName } from "@/lib/utils";
import { useOthers, useSelf } from "@/liveblocks.config";

import Avatar from "./Avatar";

const ActiveUsers = () => {
  // Get the list of other users in the room
  const others = useOthers();

  // Get the current user's details in the room
  const currentUser = useSelf();

  // Memoize the users display so it only recalculates when others.length changes
  const memoizedUsers = useMemo(() => {
    const hasMoreUsers = others.length > 2;

    return (
      <div className="flex items-center justify-center gap-1">
        {currentUser && (
          <Avatar name="You" otherStyles="border-[3px] border-primary-green" />
        )}

        {others.slice(0, 2).map(({ connectionId }) => (
          <Avatar
            key={connectionId}
            name={generateRandomName()}
            otherStyles="-ml-3"
          />
        ))}

        {hasMoreUsers && (
          <div className="z-10 -ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary-black">
            +{others.length - 2}
          </div>
        )}
      </div>
    );
  }, [others.length, currentUser]);

  return memoizedUsers;
};

export default ActiveUsers;
