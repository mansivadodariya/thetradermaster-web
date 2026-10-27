'use client';

import React from 'react';
import styles from '../profile.module.scss';

export default function ProfileSidebarNav({
    subMenuItems,
    activeTab,
    setActiveTab
}) {
    return (
        <div className={styles.leftSidebar}>
            <div className={styles.navMenuCard}>
                {subMenuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`${styles.navMenuItem} ${isActive ? styles.navMenuItemActive : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <div className={styles.navItemIcon}>{item.icon}</div>
                            <span className={styles.navItemTitle}>{item.title}</span>
                            {typeof item.count === 'number' && item.count > 0 && (
                                <span className={styles.navItemBadge}>{item.count}</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
