'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './pro.module.scss'

export default function ProPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        tradingStyle: 'Day Trading',
        experience: 'Beginner',
        message: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Mock submission
        alert('Thank you for applying to Trader Master Pro! We will be in touch shortly.')
        setFormData({
            name: '',
            email: '',
            tradingStyle: 'Day Trading',
            experience: 'Beginner',
            message: ''
        })
    }

    return (
        <div className={styles.proPage}>
                <div className="container-xs">
                    <div className={styles.container}>
                        <motion.div 
                            className={styles.content}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1>Unlock Institutional Grade <span>AI Trading</span></h1>
                            <p>
                                Get exclusive access to Trader Master Pro. Elevate your trading with zero-lag AI insights, multi-asset scanning, and real-time algorithmic execution setups built on our dark green premium ecosystem.
                            </p>
                            
                            <div className={styles.features}>
                                <motion.div className={styles.featureItem} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                    <div className={styles.iconWrap}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                    </div>
                                    <div className={styles.text}>
                                        <h3>Real-Time Data Feeds</h3>
                                        <p>Institutional latency with our direct fiber connections.</p>
                                    </div>
                                </motion.div>
                                <motion.div className={styles.featureItem} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                    <div className={styles.iconWrap}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    </div>
                                    <div className={styles.text}>
                                        <h3>Priority AI Processing</h3>
                                        <p>Your charts are analyzed in milliseconds using dedicated neural cores.</p>
                                    </div>
                                </motion.div>
                                <motion.div className={styles.featureItem} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                    <div className={styles.iconWrap}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                    </div>
                                    <div className={styles.text}>
                                        <h3>100% Secure Integration</h3>
                                        <p>End-to-end encryption for all API connections and broker integrations.</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={styles.formWrapper}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h2>Apply for Pro Access</h2>
                            <p>Fill out the form below to join the waitlist.</p>
                            
                            <form onSubmit={handleSubmit}>
                                <div className={styles.inputGroup}>
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder="John Doe" 
                                        value={formData.name}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="john@example.com" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className={styles.inputGroup}>
                                        <label>Trading Style</label>
                                        <select name="tradingStyle" value={formData.tradingStyle} onChange={handleChange}>
                                            <option>Day Trading</option>
                                            <option>Swing Trading</option>
                                            <option>Scalping</option>
                                            <option>Position Trading</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Experience</label>
                                        <select name="experience" value={formData.experience} onChange={handleChange}>
                                            <option>Beginner (0-1 yrs)</option>
                                            <option>Intermediate (1-3 yrs)</option>
                                            <option>Advanced (3+ yrs)</option>
                                            <option>Professional</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Why do you want Pro access?</label>
                                    <textarea 
                                        name="message" 
                                        placeholder="Tell us about your trading goals..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className={styles.submitBtn}>
                                    Join the Waitlist
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
    )
}



