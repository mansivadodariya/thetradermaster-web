import React, { useState, useEffect } from 'react';
import styles from '../aiAnalyst.module.scss';

export default function StreamingWords({ text = "", speed = 30, onComplete, isActive = true }) {
  const words = React.useMemo(() => (text ? text.split(" ") : []), [text]);
  const [wordCount, setWordCount] = useState(isActive ? 0 : words.length);
  const [isFinished, setIsFinished] = useState(!isActive);

  useEffect(() => {
    if (!isActive) {
      setWordCount(words.length);
      setIsFinished(true);
      return;
    }

    setWordCount(0);
    setIsFinished(false);

    if (words.length === 0) return;

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setWordCount(idx);
      if (idx >= words.length) {
        clearInterval(interval);
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isActive, words.length]);

  return (
    <span className={styles.streamingText}>
      {words.slice(0, wordCount).map((word, i) => (
        <span key={i} className={styles.wordSpan}>
          {word}{" "}
        </span>
      ))}
      {!isFinished && <span className={styles.typewriterCursor}>▌</span>}
    </span>
  );
}
