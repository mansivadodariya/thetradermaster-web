"use client";
import React from 'react';
import classNames from 'classnames';
import Textbutton from '@/components/textbutton';
import styles from './sectionHeader.module.scss';

export default function SectionHeader({
  badge,
  title1,
  title2,
  title,
  highlight,
  highlightText,
  breakLine = true,
  description,
  desc,
  align = 'center',
  className = '',
  descMaxWidth,
  children,
  action,
  as,
  asTag,
  headingTag,
}) {
  const descriptionContent = description || desc || children;

  const alignClass = {
    center: styles.alignCenter,
    left: styles.alignLeft,
    right: styles.alignRight,
    split: styles.alignSplit
  }[align] || styles.alignCenter;

  const renderBadge = () => {
    if (!badge || (typeof badge === 'string' && !badge.trim())) return null;
    if (typeof badge === 'string') {
      return (
        <div className={styles.badgeWrapper}>
          <Textbutton text={badge} />
        </div>
      );
    }
    return <div className={styles.badgeWrapper}>{badge}</div>;
  };

  const renderTitle = () => {
    const Tag = as || asTag || headingTag || 'h2';

    if (title1 || title2) {
      return (
        <Tag className={styles.title}>
          {title1 && <span className={styles.title1}>{title1}</span>}
          {title1 && title2 && breakLine && <br />}
          {title1 && title2 && !breakLine && ' '}
          {title2 && <span className={styles.title2}>{title2}</span>}
        </Tag>
      );
    }

    const resolvedHighlight = highlightText || highlight;
    if (title && resolvedHighlight) {
      return (
        <Tag className={styles.title}>
          <span className={styles.title1}>{title}</span>
          {breakLine ? <br /> : ' '}
          <span className={styles.title2}>{resolvedHighlight}</span>
        </Tag>
      );
    }

    if (typeof title === 'string' && title.trim()) {
      const words = title.trim().split(/\s+/);
      if (words.length >= 2) {
        const midpoint = Math.ceil(words.length / 2);
        const firstHalf = words.slice(0, midpoint).join(' ');
        const secondHalf = words.slice(midpoint).join(' ');
        return (
          <Tag className={styles.title}>
            <span className={styles.title1}>{firstHalf}</span>
            {breakLine ? <br /> : ' '}
            <span className={styles.title2}>{secondHalf}</span>
          </Tag>
        );
      }
      return (
        <Tag className={styles.title}>
          <span className={styles.title1}>{title}</span>
        </Tag>
      );
    }

    if (title) {
      return <Tag className={styles.title}>{title}</Tag>;
    }

    return null;
  };

  const renderDescription = () => {
    if (!descriptionContent) return null;
    return (
      <p
        className={styles.description}
        style={descMaxWidth ? { maxWidth: descMaxWidth } : undefined}
      >
        {descriptionContent}
      </p>
    );
  };

  if (align === 'split') {
    return (
      <div className={classNames(styles.sectionHeaderWrapper, alignClass, className)}>
        <div className={styles.splitLayout}>
          <div className={styles.titleColumn}>
            {renderBadge()}
            {renderTitle()}
          </div>
          <div className={styles.descColumn}>
            {renderDescription()}
            {action && <div className={styles.actionWrapper}>{action}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.sectionHeaderWrapper, alignClass, className)}>
      {renderBadge()}
      {renderTitle()}
      {renderDescription()}
      {action && <div className={styles.actionWrapper}>{action}</div>}
    </div>
  );
}
