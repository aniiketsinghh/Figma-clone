import React from "react";
import styles from "./FlyingReaction.module.css";

const FlyingReaction = ({ x, y, timestamp, value }) => {
  return (
    <div
      className={`pointer-events-none absolute select-none text-${
        (timestamp % 5) + 2
      }xl ${styles["disappear"]} ${styles["goUp" + (timestamp % 3)]}`}
      style={{ left: x, top: y }}
    >
      <div className={styles["leftRight" + (timestamp % 3)]}>
        <div className="-translate-x-1/2 -translate-y-1/2 transform">
          {value}
        </div>
      </div>
    </div>
  );
};

export default FlyingReaction;
