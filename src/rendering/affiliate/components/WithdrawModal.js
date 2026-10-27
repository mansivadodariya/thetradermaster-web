import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { WalletCryptoIcon, CloseIcon } from './AffiliateIcons';

export function WithdrawModal({
    showWithdrawModal,
    setShowWithdrawModal,
    styles,
    t,
    handleWithdrawSubmit,
    stats,
    withdrawForm,
    setWithdrawForm,
    withdrawing
}) {
    return (
        <AnimatePresence>
            {showWithdrawModal && (
                <div className={styles.modalOverlay} onClick={() => setShowWithdrawModal(false)}>
                    <motion.div
                        className={styles.modalCard}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleGroup}>
                                <div className={styles.modalIconWrap}>
                                    <WalletCryptoIcon />
                                </div>
                                <div>
                                    <h3>{t('affiliate.modalWithdrawTitle', 'Request Crypto Withdrawal')}</h3>
                                    <p>{t('affiliate.modalWithdrawDesc', 'Fast on-chain settlement directly to your wallet')}</p>
                                </div>
                            </div>
                            <button type="button" className={styles.modalCloseBtn} onClick={() => setShowWithdrawModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>

                        <form onSubmit={handleWithdrawSubmit} className={styles.modalForm}>
                            {/* Balance Notice */}
                            <div className={styles.modalBalanceBox}>
                                <span className={styles.balanceLabel}>{t('affiliate.withdrawableBalance', 'Withdrawable Balance')}</span>
                                <span className={styles.balanceAmount}>${stats.withdrawable_balance.toFixed(2)} USDT</span>
                            </div>

                            {/* Zero Balance Alert Notice */}
                            {stats.withdrawable_balance <= 0 && (
                                <div className={styles.zeroBalanceAlert}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>{t('affiliate.zeroBalanceNotice', 'Withdrawal amount must be greater than $0.00. Only balances above $0.00 can be withdrawn.')}</span>
                                </div>
                            )}

                            {/* Asset Selection */}
                            <div className={styles.formGroup}>
                                <label>{t('affiliate.selectCryptoAsset', 'Select Crypto Asset')}</label>
                                <div className={styles.assetSelector}>
                                    {['USDT', 'USDC'].map((asset) => (
                                        <button
                                            type="button"
                                            key={asset}
                                            className={`${styles.assetOption} ${withdrawForm.asset === asset ? styles.assetActive : ''}`}
                                            onClick={() => setWithdrawForm(f => ({ ...f, asset }))}
                                        >
                                            <span className={styles.coinCircle}>{asset}</span>
                                            <span>{asset} ({asset === 'USDT' ? 'Tether' : 'USD Coin'})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Network Selection */}
                            <div className={styles.formGroup}>
                                <label>{t('affiliate.selectNetwork', 'Select Network')}</label>
                                <div className={styles.networkGrid}>
                                    {[
                                        { id: 'TRC20', name: 'Tron (TRC20)', speed: '~2 mins' },
                                        { id: 'BEP20', name: 'BNB Smart Chain (BEP20)', speed: '~1 min' },
                                        { id: 'SOLANA', name: 'Solana (SPL)', speed: '< 30s' },
                                        { id: 'ERC20', name: 'Ethereum (ERC20)', speed: '~5 mins' },
                                    ].map((net) => (
                                        <button
                                            type="button"
                                            key={net.id}
                                            className={`${styles.netBtn} ${withdrawForm.network === net.id ? styles.netActive : ''}`}
                                            onClick={() => setWithdrawForm(f => ({ ...f, network: net.id }))}
                                        >
                                            <span className={styles.netName}>{net.name}</span>
                                            <span className={styles.netSpeed}>{net.speed}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Destination Address */}
                            <div className={styles.formGroup}>
                                <label>{t('affiliate.destWalletAddress', 'Destination Wallet Address')}</label>
                                <div className={styles.inputWithAction}>
                                    <input
                                        type="text"
                                        placeholder={t('affiliate.pastePlaceholder', 'Paste your {network} {asset} address').replace('{network}', withdrawForm.network).replace('{asset}', withdrawForm.asset)}
                                        value={withdrawForm.wallet_address}
                                        onChange={(e) => setWithdrawForm(f => ({ ...f, wallet_address: e.target.value.trim() }))}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.inlinePasteBtn}
                                        onClick={async () => {
                                            if (navigator?.clipboard) {
                                                const clip = await navigator.clipboard.readText();
                                                if (clip) setWithdrawForm(f => ({ ...f, wallet_address: clip.trim() }));
                                            }
                                        }}
                                    >
                                        {t('affiliate.pasteBtn', 'Paste')}
                                    </button>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className={styles.formGroup}>
                                <div className={styles.amountLabelRow}>
                                    <label>{t('affiliate.withdrawalAmount', 'Withdrawal Amount (${asset})').replace('{asset}', withdrawForm.asset)}</label>
                                    <span className={styles.minLimitText}>{t('affiliate.minLimit', 'Min: ${min}.00').replace('{min}', stats.current_tier?.min_withdrawal || 50)}</span>
                                </div>
                                <div className={styles.inputWithAction}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={stats.current_tier?.min_withdrawal || 50}
                                        max={stats.withdrawable_balance}
                                        placeholder="0.00"
                                        value={withdrawForm.amount}
                                        onChange={(e) => setWithdrawForm(f => ({ ...f, amount: e.target.value }))}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.inlineMaxBtn}
                                        onClick={() => setWithdrawForm(f => ({ ...f, amount: String(stats.withdrawable_balance) }))}
                                    >
                                        {t('affiliate.maxBtn', 'MAX')}
                                    </button>
                                </div>
                            </div>

                            {/* Summary Breakdown */}
                            <div className={styles.feeBreakdown}>
                                <div className={styles.feeRow}>
                                    <span>{t('affiliate.networkFee', 'Network Transaction Fee:')}</span>
                                    <span className={styles.feeFree}>{t('affiliate.zeroFee', '$0.00 (Zero Fee)')}</span>
                                </div>
                                <div className={styles.feeRow}>
                                    <span>{t('affiliate.estimatedSettlement', 'Estimated Settlement:')}</span>
                                    <span>{t('affiliate.within24h', 'Within 24 Hours')}</span>
                                </div>
                                <div className={`${styles.feeRow} ${styles.totalRow}`}>
                                    <span>{t('affiliate.netAmountReceive', 'Net Amount to Receive:')}</span>
                                    <strong>${Number(withdrawForm.amount || 0).toFixed(2)} {withdrawForm.asset}</strong>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.modalSubmitBtn}
                                disabled={withdrawing || stats.withdrawable_balance <= 0}
                            >
                                {withdrawing
                                    ? t('affiliate.submittingRequest', 'Submitting Request...')
                                    : stats.withdrawable_balance <= 0
                                        ? t('affiliate.insufficientBalanceBtn', 'Amount must be greater than $0.00 to withdraw')
                                        : t('affiliate.confirmWithdrawal', 'Confirm Crypto Withdrawal')}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export function QrModal({
    showQrModal,
    setShowQrModal,
    styles,
    t,
    referralUrl,
    referralCode,
    handleCopyLink
}) {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const qrBgColor = isLight ? 'FFFFFF' : '040D09';
    const qrColor = isLight ? '0F172A' : '18C98B';

    return (
        <AnimatePresence>
            {showQrModal && (
                <div className={styles.modalOverlay} onClick={() => setShowQrModal(false)}>
                    <motion.div
                        className={styles.qrModalCard}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className={styles.modalHeader}>
                            <h3>{t('affiliate.scanQrTitle', 'Scan to Join via Referral')}</h3>
                            <button type="button" className={styles.modalCloseBtn} onClick={() => setShowQrModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>

                        <div className={styles.qrBox}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(referralUrl)}&color=${qrColor}&bgcolor=${qrBgColor}&margin=10`}
                                alt="Referral QR Code"
                                className={styles.qrImage}
                            />
                            <span className={styles.qrCodeText}>{t('affiliate.codePrefix', 'Code:')} {referralCode}</span>
                        </div>

                        <button
                            type="button"
                            className={styles.modalSubmitBtn}
                            onClick={handleCopyLink}
                        >
                            {t('affiliate.copyLink', 'Copy Link')} ({referralCode})
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
