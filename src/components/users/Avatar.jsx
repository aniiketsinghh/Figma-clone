import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const Avatar = ({ name, otherStyles }) => (
  <Tooltip>
    <TooltipTrigger>
      <div
        className={`relative h-9 w-9 rounded-full ${otherStyles}`}
        data-tooltip={name}
      >
        <img
          src={`https://liveblocks.io/avatars/avatar-${Math.floor(
            Math.random() * 30
          )}.png`}
          alt={name}
          className="rounded-full h-full w-full object-cover"
        />
      </div>
    </TooltipTrigger>
    <TooltipContent className="border-none bg-primary-grey-200 px-2.5 py-1.5 text-xs">
      {name}
    </TooltipContent>
  </Tooltip>
);

export default Avatar;
