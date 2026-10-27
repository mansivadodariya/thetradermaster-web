'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './customDatePicker.module.scss';
import {
    formatDateStr,
    parseDateStr,
    getTodayDateStr
} from '@/utils/dateRangeUtils';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CustomDatePicker({

    value = '',
    onChange,
    min = '',
    max = '',
    placeholder = 'Select Date',
    width = '135px',
    align = 'left',
    disabled = false
}) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState('days'); // 'days' | 'monthsYears'
    const containerRef = useRef(null);

    // Track active month & year view in calendar
    const initialDate = useMemo(() => {
        const parsed = parseDateStr(value);
        return parsed && !isNaN(parsed.getTime()) ? parsed : new Date();
    }, [value]);

    const [viewYear, setViewYear] = useState(() => initialDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(() => initialDate.getMonth());

    // When value updates externally, synchronize view state if closed
    useEffect(() => {
        if (!isOpen && value) {
            const parsed = parseDateStr(value);
            if (parsed && !isNaN(parsed.getTime())) {
                setViewYear(parsed.getFullYear());
                setViewMonth(parsed.getMonth());
            }
        }
    }, [value, isOpen]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setViewMode('days');
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Allowed Year Range based on min and max or past 3 years to current year
    const allowedYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const minYear = min ? parseDateStr(min)?.getFullYear() || currentYear - 3 : currentYear - 3;
        const maxYear = max ? parseDateStr(max)?.getFullYear() || currentYear : currentYear;
        const years = [];
        for (let y = minYear; y <= maxYear; y++) {
            years.push(y);
        }
        return years;
    }, [min, max]);

    // Calculate calendar grid days
    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
        const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);
        const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
        const totalDaysInMonth = lastDayOfMonth.getDate();

        // Days from previous month to fill first week
        const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
        const days = [];

        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayNum = prevMonthLastDay - i;
            const d = new Date(viewYear, viewMonth - 1, dayNum);
            const dateStr = formatDateStr(d);
            days.push({
                dayNumber: dayNum,
                dateStr,
                isCurrentMonth: false,
                isDisabled: (min && dateStr < min) || (max && dateStr > max)
            });
        }

        // Current month days
        const todayStr = getTodayDateStr();
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const d = new Date(viewYear, viewMonth, day);
            const dateStr = formatDateStr(d);
            days.push({
                dayNumber: day,
                dateStr,
                isCurrentMonth: true,
                isToday: dateStr === todayStr,
                isSelected: dateStr === value,
                isDisabled: (min && dateStr < min) || (max && dateStr > max)
            });
        }

        // Fill remaining days to make 35 or 42 grid cells
        const remainingCells = (7 - (days.length % 7)) % 7;
        for (let i = 1; i <= remainingCells; i++) {
            const d = new Date(viewYear, viewMonth + 1, i);
            const dateStr = formatDateStr(d);
            days.push({
                dayNumber: i,
                dateStr,
                isCurrentMonth: false,
                isDisabled: (min && dateStr < min) || (max && dateStr > max)
            });
        }

        return days;
    }, [viewYear, viewMonth, min, max, value]);

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(prev => prev - 1);
        } else {
            setViewMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(prev => prev + 1);
        } else {
            setViewMonth(prev => prev + 1);
        }
    };

    const handleSelectDate = (dateStr, isDisabled) => {
        if (isDisabled || disabled) return;
        if (onChange) {
            onChange(dateStr);
        }
        setIsOpen(false);
        setViewMode('days');
    };

    const handleSelectToday = (e) => {
        e.stopPropagation();
        const todayStr = getTodayDateStr();
        if (min && todayStr < min) return;
        if (max && todayStr > max) return;
        if (onChange) onChange(todayStr);
        setIsOpen(false);
        setViewMode('days');
    };

    // Format display string as MM/DD/YYYY or placeholder
    const displayValue = useMemo(() => {
        if (!value) return '';
        const parsed = parseDateStr(value);
        if (!parsed || isNaN(parsed.getTime())) return value;
        const mm = String(parsed.getMonth() + 1).padStart(2, '0');
        const dd = String(parsed.getDate()).padStart(2, '0');
        const yyyy = parsed.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }, [value]);

    return (
        <div
            ref={containerRef}
            className={styles.datePickerContainer}
            style={{ width }}
        >
            <button
                type="button"
                className={`${styles.datePickerTrigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
                onClick={() => !disabled && setIsOpen(prev => !prev)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                disabled={disabled}
            >
                <span className={displayValue ? styles.datePickerValue : styles.datePickerPlaceholder}>
                    {displayValue || placeholder}
                </span>

                <span className={styles.calendarIconWrap}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div
                    className={`${styles.calendarDropdown} ${align === 'right' ? styles.alignRight : ''}`}
                    onWheel={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header */}
                    <div className={styles.calendarHeader}>
                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={handlePrevMonth}
                            aria-label={t('components.datePicker.previousMonth', 'Previous Month')}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className={`${styles.monthYearToggle} ${viewMode === 'monthsYears' ? styles.viewSelectorOpen : ''}`}
                            onClick={() => setViewMode(prev => prev === 'days' ? 'monthsYears' : 'days')}
                        >
                            <span>{MONTH_NAMES[viewMonth]} {viewYear}</span>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={handleNextMonth}
                            aria-label={t('components.datePicker.nextMonth', 'Next Month')}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>

                    {/* View 1: Month / Year Jump Selector */}
                    {viewMode === 'monthsYears' ? (
                        <div className={styles.selectorView}>
                            {/* Years Pill Row */}
                            <div className={styles.yearsRow}>
                                {allowedYears.map(yr => {
                                    const isSelected = yr === viewYear;
                                    return (
                                        <button
                                            key={yr}
                                            type="button"
                                            className={`${styles.yearPill} ${isSelected ? styles.yearSelected : ''}`}
                                            onClick={() => setViewYear(yr)}
                                        >
                                            {yr}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* 12 Months Grid */}
                            <div className={styles.monthsGrid}>
                                {MONTH_SHORT.map((mName, idx) => {
                                    const isSelected = idx === viewMonth;
                                    const testDate = `${viewYear}-${String(idx + 1).padStart(2, '0')}-01`;
                                    const isMonthDisabled = (max && `${viewYear}-${String(idx + 1).padStart(2, '0')}-01` > max) ||
                                                           (min && `${viewYear}-${String(idx + 1).padStart(2, '0')}-31` < min);

                                    return (
                                        <button
                                            key={mName}
                                            type="button"
                                            disabled={isMonthDisabled}
                                            className={`${styles.monthPill} ${isSelected ? styles.monthSelected : ''} ${isMonthDisabled ? styles.monthDisabled : ''}`}
                                            onClick={() => {
                                                setViewMonth(idx);
                                                setViewMode('days');
                                            }}
                                        >
                                            {mName}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* View 2: Days Grid */
                        <>
                            <div className={styles.weekDaysGrid}>
                                {WEEKDAYS.map(day => (
                                    <div key={day} className={styles.weekDayCell}>
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.daysGrid}>
                                {calendarDays.map((cell, idx) => {
                                    const cellClass = [
                                        styles.dayCell,
                                        cell.isSelected ? styles.daySelected : '',
                                        cell.isToday ? styles.dayToday : '',
                                        !cell.isCurrentMonth ? styles.dayOutside : '',
                                        cell.isDisabled ? styles.dayDisabled : ''
                                    ].filter(Boolean).join(' ');

                                    return (
                                        <button
                                            key={`${cell.dateStr}_${idx}`}
                                            type="button"
                                            disabled={cell.isDisabled}
                                            className={cellClass}
                                            onClick={() => handleSelectDate(cell.dateStr, cell.isDisabled)}
                                        >
                                            {cell.dayNumber}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Quick Action Footer */}
                    <div className={styles.calendarFooter}>
                        <button
                            type="button"
                            className={styles.presetBtn}
                            onClick={handleSelectToday}
                        >
                            Today
                        </button>
                        <button
                            type="button"
                            className={styles.presetBtn}
                            onClick={() => {
                                setIsOpen(false);
                                setViewMode('days');
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
