"use client";
import React from "react";
import styles from "./sidebar.module.scss";

export default function SidebarNavSkeleton({ count = 7, isCollapsed }) {
  return (
    <div className={styles.navSkeletonWrap}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={styles.navSkeletonItem}
        >
          <div className={styles.navSkeletonIcon} />
          {!isCollapsed && (
            <div
              className={styles.navSkeletonText}
              style={{ width: `${55 + (i % 4) * 12}%` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
