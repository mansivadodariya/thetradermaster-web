'use client'
import React, { useState, useEffect } from 'react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import styles from './philippines.module.scss'
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/components/toast'
import Loader from '@/components/loader'
import Button from '@/components/button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

export default function Philippines() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        countryCode: 'PH',
        equity: '',
        isForexTrader: '',
        tradeReliance: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [showModal, setShowModal] = useState(false)

    // Auto-open modal after 2 seconds on page load (temporarily disabled for testing)
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowModal(true)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [showModal])

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    }

    const fadeInLeft = {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    }

    const fadeInRight = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone || !formData.equity || !formData.isForexTrader || !formData.tradeReliance) {
            toast.error('Please fill in all required fields.')
            return
        }

        if (!emailRegex.test(formData.email.trim())) {
            toast.error('Please enter a valid email address.')
            return
        }

        if (!supabase) {
            toast.error('Database client is not initialized.')
            return
        }

        setSubmitting(true)
        try {
            const { error } = await supabase
                .from('enquiry')
                .insert([{
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone,
                    country_code: formData.countryCode,
                    equity: formData.equity,
                    is_forex_trader: formData.isForexTrader,
                    trade_reliance: formData.tradeReliance
                }])

            if (error) {
                toast.error(error.message || 'Failed to submit enquiry.')
            } else {
                toast.success('Your enquiry has been submitted successfully!')
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    countryCode: 'PH',
                    equity: '',
                    isForexTrader: '',
                    tradeReliance: ''
                })
                setShowModal(false)
            }
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred.')
        } finally {
            setSubmitting(false)
        }
    }

    const openModal = () => {
        setShowModal(true)
    }

    return (
        <div className={styles.philippinesPage}>
            <div className='container-xs'>
                <div className={styles.webinarSection}>
                    <div className={styles.webinarRow}>
                        <div
                            className={styles.webinarImageWrapper}
                        >
                            <img src="/assets/images/liveWebinar1.jpeg" alt="Live Webinar - Nathaniel Ginson" />
                        </div>
                        <div
                            className={styles.webinarContent}
                        >
                            <h2>Meet The Trader Master - <span className={styles.highlightName}>Nathaniel Ginson</span></h2>
                            <p>
                                Join us for an exclusive, deep-dive session where presenter Nathaniel Ginson shares over a decade of institutional trading experience. Discover how top-tier professionals utilize AI-driven analytics to navigate volatile markets with pinpoint precision.
                            </p>
                            <p>
                                In this highly interactive live session, you will learn practical risk management frameworks, identify psychological trading triggers, and see firsthand how to effectively leverage the Trader Master platform to gain a sustainable edge.
                            </p>
                            <ul>
                                <li> AI Auto Chart Analysis</li>
                                <li> AI Past Trade Analysis</li>
                                <li> AI Trading Assistance</li>
                                <li> AI Chat for Traders</li>
                                <li> Trading Signals</li>
                                <li> Live Platform Demonstration</li>
                            </ul>
                            <div className={styles.actionBtn}>
                                <Button text="Join Webinar" onClick={openModal} icon="/assets/icons/arrow.svg" />
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.webinarRow} ${styles.reverse}`}>
                        <div
                            className={styles.webinarImageWrapper}
                        >
                            <Swiper
                                modules={[Autoplay, EffectFade, Pagination]}
                                effect="fade"
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                loop={true}
                                speed={800}
                                className={styles.webinarSwiper}
                            >
                                <SwiperSlide>
                                    <img src="/assets/images/liveWebinar2.jpeg" alt="Live Webinar Preview 1" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src="/assets/images/liveWebinar4.jpeg" alt="Live Webinar Preview 2" />
                                </SwiperSlide>
                            </Swiper>
                        </div>
                        <div
                            className={styles.webinarContent}
                        >
                            <h2>Claim Your FREE Trader Master Credits</h2>
                            <p>
                                Why just watch when you can trade? By attending our live webinar on Friday, 25 September 2026, you will instantly become eligible for FREE Trader Master Credits to kickstart your journey with zero initial risk.
                            </p>
                            <p>
                                Experience the power of our state-of-the-art platform. We believe in our tools, and we want you to test them in real-market conditions. Spots are strictly limited to ensure a high-quality interactive experience, so secure your place today!
                            </p>
                            <ul>
                                <li>Friday, 25 September 2026 | 7:00 PM – 9:00 PM (PHT/GMT+8)</li>
                                <li>Instant Bonus Credits Upon Attendance</li>
                                <li>Risk-Free Platform Testing Environment</li>
                                <li>Limited Seats Available for Optimal Interaction</li>
                            </ul>
                            <div className={styles.actionBtn}>
                                <Button text="Join Webinar" onClick={openModal} icon="/assets/icons/arrow.svg" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.mainGrid}>
                    <div
                        className={styles.contentCol}
                    >
                        <span className={styles.badge}>Trader Master</span>
                        <h1>Join the Revolution in Trading.</h1>
                        <p>
                            Connect with us to access institutional-grade trading tools, expert insights, and our comprehensive AI-driven platform. We are dedicated to empowering traders with advanced analytics and tailored solutions. Fill out the form, and a representative will reach out to guide you through your trading journey.
                        </p>

                        <div className={styles.benefits}>
                            <div className={styles.benefitItem}>
                                <div className={styles.iconBox}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <h4>Advanced AI Tools</h4>
                                    <span>Leverage next-gen algorithms.</span>
                                </div>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.iconBox}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4>Secure Platform</h4>
                                    <span>Your data is encrypted & protected.</span>
                                </div>
                            </div>

                            <div className={styles.benefitItem}>
                                <div className={styles.iconBox}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <h4>Real-Time Insights</h4>
                                    <span>Get instant market updates and signals.</span>
                                </div>
                            </div>

                            <div className={styles.benefitItem}>
                                <div className={styles.iconBox}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4>Expert Support</h4>
                                    <span>24/7 dedicated assistance for your journey.</span>
                                </div>
                            </div>

                            <div className={styles.benefitItem}>
                                <div className={styles.iconBox}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4>Institutional Data</h4>
                                    <span>Access premium, high-fidelity data feeds.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={styles.formCol}
                    >
                        <div className={styles.webinarImageWrapper}>
                            <img src="/assets/images/liveWebinar3.jpeg" alt="Live Webinar - Trading" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {showModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
                >
                    <div
                        className={styles.modalContent}
                    >
                        <button
                            className={styles.modalClose}
                            onClick={() => setShowModal(false)}
                            aria-label="Close modal"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className={styles.formCard}>
                            <div className={styles.formHeader}>
                                <h2>Let's Connect with us</h2>
                            </div>

                            <form className={styles.enquiryForm} onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Name <span>*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Email <span>*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Phone <span>*</span></label>
                                    <div className={styles.phoneWrapper}>
                                        <PhoneInput
                                            international
                                            defaultCountry="PH"
                                            value={formData.phone}
                                            onChange={(val) => setFormData(prev => ({ ...prev, phone: val || '' }))}
                                            onCountryChange={(country) => setFormData(prev => ({ ...prev, countryCode: country || 'PH' }))}
                                            disabled={submitting}
                                            className={styles.phoneInputComponent}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Current Equity <span>*</span></label>
                                    <div className={styles.radioGroup}>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="equity"
                                                value="$100 to $500"
                                                checked={formData.equity === '$100 to $500'}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                required
                                            />
                                            <span className={styles.radioBox}></span>
                                            $100 to $500
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="equity"
                                                value="$500 to $1000"
                                                checked={formData.equity === '$500 to $1000'}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                required
                                            />
                                            <span className={styles.radioBox}></span>
                                            $500 to $1000
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="equity"
                                                value="$1000 +"
                                                checked={formData.equity === '$1000 +'}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                required
                                            />
                                            <span className={styles.radioBox}></span>
                                            $1000 +
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Are you a Forex Trader? <span>*</span></label>
                                    <div className={styles.radioGroup}>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="isForexTrader"
                                                value="Yes"
                                                checked={formData.isForexTrader === 'Yes'}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                required
                                            />
                                            <span className={styles.radioBox}></span>
                                            Yes
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="isForexTrader"
                                                value="No"
                                                checked={formData.isForexTrader === 'No'}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                required
                                            />
                                            <span className={styles.radioBox}></span>
                                            No
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Do you rely on trading signals from others, or do your own Trade? <span>*</span></label>
                                    <div className={styles.radioGroup}>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="tradeReliance"
                                                value="Signals"
                                                checked={formData.tradeReliance === 'Signals'}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                required
                                            />
                                            <span className={styles.radioBox}></span>
                                            Signals
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="tradeReliance"
                                                value="Own Trade"
                                                checked={formData.tradeReliance === 'Own Trade'}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                required
                                            />
                                            <span className={styles.radioBox}></span>
                                            Own Trade
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.btnWrapper}>
                                    <Button
                                        text={submitting ? 'Submitting...' : 'Submit'}
                                        type="submit"
                                        disabled={submitting}
                                        fullWidth
                                        icon="/assets/icons/arrow.svg"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
