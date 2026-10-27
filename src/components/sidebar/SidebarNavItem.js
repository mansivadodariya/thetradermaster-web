"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./sidebar.module.scss";
import { isNavItemActive, getLocalizedHref } from "./sidebarNavConfig";

export default function SidebarNavItem({ item, pathname, onNavigate, isCollapsed, language }) {
  const Icon = item.icon;
  const router = useRouter();
  const [currentSearch, setCurrentSearch] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentSearch(window.location.search || '');
    }
  }, [pathname]);

  const isParentActive = isNavItemActive(pathname, item.href, currentSearch);
  const isAnySubActive = item.subItems?.some(sub => isNavItemActive(pathname, sub.href, currentSearch));
  const isActive = isParentActive || isAnySubActive;

  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    setIsOpen(Boolean(isActive));
  }, [isActive, pathname]);

  if (item.subItems) {
    if (isCollapsed) {
      return (
        <div className={`${styles.menuGroup} ${styles.collapsedMenuGroup}`}>
          <div
            className={styles.menu}
            data-active={isActive ? 'true' : undefined}
            onClick={() => {
              if (item.subItems && item.subItems.length > 0) {
                const rawTarget = item.subItems.find(s => !s.isExternal)?.href || item.subItems[0].href;
                const targetHref = getLocalizedHref(rawTarget, language);
                if (typeof window !== 'undefined' && pathname !== targetHref) {
                  window.dispatchEvent(new CustomEvent('page:loading:start'));
                }
                router.push(targetHref);
                onNavigate?.();
              }
            }}
          >
            <div className={styles.icon}>
              <Icon />
            </div>
            <div className={styles.flyoutMenu}>
              <div className={styles.flyoutHeader}>{item.label}</div>
              <div className={styles.flyoutList}>
                {item.subItems.map(sub => {
                  const isSubActive = isNavItemActive(pathname, sub.href, currentSearch);
                  const SubIcon = sub.icon;
                  if (sub.isExternal) {
                    return (
                      <a
                        key={sub.href}
                        href={sub.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.flyoutLink}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate?.();
                        }}
                      >
                        <div className={styles.subMenuIcon}>
                          <SubIcon />
                        </div>
                        <span>{sub.label}</span>
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={sub.href}
                      href={getLocalizedHref(sub.href, language)}
                      className={styles.flyoutLink}
                      data-active={isSubActive ? 'true' : undefined}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate?.();
                      }}
                    >
                      <div className={styles.subMenuIcon}>
                        <SubIcon />
                      </div>
                      <span>{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.menuGroup}>
        <div
          className={styles.menu}
          data-active={isActive ? 'true' : undefined}
          onClick={() => {
            if (item.subItems && item.subItems.length > 0) {
              const rawTarget = item.subItems.find(s => !s.isExternal)?.href || item.subItems[0].href;
              const targetHref = getLocalizedHref(rawTarget, language);
              if (!isAnySubActive && pathname !== targetHref) {
                // If not currently on any subpage, open and navigate to first internal subitem
                setIsOpen(true);
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('page:loading:start'));
                }
                router.push(targetHref);
                onNavigate?.();
              } else {
                // If already on a subpage, toggle collapse/expand
                setIsOpen(prev => !prev);
              }
            }
          }}
        >
          <div className={styles.icon}>
            <Icon />
          </div>
          <span>{item.label}</span>
          <div
            className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(prev => !prev);
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        {isOpen && (
          <div className={styles.subItemsList}>
            {item.subItems.map(sub => {
              const isSubActive = isNavItemActive(pathname, sub.href, currentSearch);
              const SubIcon = sub.icon;
              if (sub.isExternal) {
                return (
                  <a
                    key={sub.href}
                    href={sub.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.subMenuLink}
                    onClick={onNavigate}
                  >
                    <div className={styles.subMenuIcon}>
                      <SubIcon />
                    </div>
                    <span>{sub.label}</span>
                  </a>
                );
              }
              return (
                <Link
                  key={sub.href}
                  href={getLocalizedHref(sub.href, language)}
                  className={styles.subMenuLink}
                  data-active={isSubActive ? 'true' : undefined}
                  onClick={onNavigate}
                >
                  <div className={styles.subMenuIcon}>
                    <SubIcon />
                  </div>
                  <span>{sub.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={getLocalizedHref(item.href, language)}
      className={styles.menu}
      data-active={isActive ? 'true' : undefined}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
    >
      <div className={styles.icon}>
        <Icon />
      </div>
      {!isCollapsed && <span>{item.label}</span>}
      {isCollapsed && <span className={styles.tooltip}>{item.label}</span>}
    </Link>
  );
}
