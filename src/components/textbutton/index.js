import React from 'react'
import styles from './textbutton.module.scss';
export default function Textbutton({ text }) {
    return (
        <div className={styles.textbutton}>
            <button aria-label={text}>
                <span className={styles.labelText}>{text}</span>
            </button>
        </div>
    )
}
