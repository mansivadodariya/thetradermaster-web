'use client';
import React, { useState } from 'react';
import styles from './input.module.scss';

const EyeOpen = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeClosed = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);

const Input = ({ label, placeholder, type = 'text', value, onChange, name, icon, error, autoComplete = 'off', ...rest }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const handleChange = (e) => {
        if (e && e.target && type !== 'file') {
            let val = e.target.value;
            if (type === 'email' || type === 'password') {
                // no spaces allowed at all
                val = val.replace(/\s/g, '');
            } else {
                // strip leading spaces from all other fields
                val = val.replace(/^\s+/, '');
            }
            e.target.value = val;
        }
        if (onChange) onChange(e);
    };

    return (
        <div className={styles.input}>
            {label && <label htmlFor={name}>{label}</label>}
            <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
                {icon && (
                    typeof icon === 'string' ? (
                        <img src={icon} alt="" aria-hidden="true" className={styles.iconLeft} />
                    ) : (
                        <span className={styles.iconLeft}>{icon}</span>
                    )
                )}
                <input
                    id={name}
                    type={resolvedType}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    autoComplete={autoComplete}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    className={`${styles.inputField} ${icon ? styles.hasIconLeft : ''} ${isPassword ? styles.hasEyeBtn : ''}`}
                    {...rest}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowPassword((v) => !v);
                        }}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        title={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeClosed /> : <EyeOpen />}
                    </button>
                )}
            </div>
            {error && (
                <p id={`${name}-error`} className={styles.errorMsg} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
