'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { WalletCryptoIcon, CopyIcon, ExternalLinkIcon } from './AffiliateIcons';

export function WithdrawalsTab({
    styles,
    t,
    withdrawalsList,
    setShowWithdrawModal,
    handleCopyText,
    loading = false
}) {
    return (
        <div className={styles.tableWrapperCard}>
            <div className={styles.tableToolbar}>
                <div className={styles.tableTitleGroup}>
                    <h3>{t('affiliate.cryptoWithdrawalTitle', 'Crypto Withdrawal Requests')}</h3>
                    <p>{t('affiliate.cryptoWithdrawalDesc', 'History of on-chain crypto settlements to your destination wallet addresses.')}</p>
                </div>
                <button
                    type="button"
                    className={styles.secondaryWithdrawBtn}
                    onClick={() => setShowWithdrawModal(true)}
                >
                    <WalletCryptoIcon />
                    <span>{t('affiliate.requestNewWithdrawal', 'Request New Withdrawal')}</span>
                </button>
            </div>

            <div className={styles.tableScroll}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>{t('affiliate.thRequestId', 'Request ID')}</th>
                            <th>{t('affiliate.thDate', 'Date')}</th>
                            <th>{t('affiliate.thAssetNetwork', 'Asset & Network')}</th>
                            <th>{t('affiliate.thAmount', 'Amount')}</th>
                            <th>{t('affiliate.thDestAddress', 'Destination Address')}</th>
                            <th>{t('affiliate.thStatus', 'Status')}</th>
                            <th>{t('affiliate.thTxHash', 'Transaction Hash')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <tr key={`skel-with-${idx}`}>
                                    <td><div className={styles.skeletonPulse} style={{ width: '85px', height: '18px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '75px', height: '18px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '60px', height: '18px', borderRadius: '4px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '85px', height: '18px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '130px', height: '18px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '70px', height: '18px', borderRadius: '4px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '90px', height: '18px' }} /></td>
                                </tr>
                            ))
                        ) : withdrawalsList.length > 0 ? (
                            withdrawalsList.map((item) => {
                                const assetName = item.crypto_currency || item.asset || 'USDT';
                                return (
                                    <tr key={item.id || item.created_at + item.wallet_address}>
                                        <td className={styles.monoId}>{item.id || 'WTH-PEND'}</td>
                                        <td>{new Date(item.created_at || item.date || Date.now()).toLocaleDateString()}</td>
                                        <td>
                                            <span className={styles.assetBadge}>{assetName}</span>
                                            <span className={styles.networkSub}>{item.network || 'TRC20'}</span>
                                        </td>
                                        <td className={styles.withdrawAmountVal}>
                                            ${Number(item.amount || 0).toFixed(2)} {assetName}
                                        </td>
                                        <td>
                                            <div className={styles.addressBox}>
                                                <span>{item.wallet_address?.slice(0, 8)}...{item.wallet_address?.slice(-6)}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyText(item.wallet_address, 'Wallet address copied!')}
                                                    className={styles.miniCopyIconBtn}
                                                >
                                                    <CopyIcon />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${
                                                (item.status || '').toUpperCase() === 'APPROVED' || (item.status || '').toUpperCase() === 'COMPLETED' ? styles.statusApproved :
                                                (item.status || '').toUpperCase() === 'PENDING' ? styles.statusPending :
                                                styles.statusRejected
                                            }`}>
                                                {item.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td>
                                            {item.tx_hash ? (
                                                <a
                                                    href={`https://tronscan.org/#/transaction/${item.tx_hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.txLink}
                                                >
                                                    <span>{item.tx_hash.slice(0, 10)}...</span>
                                                    <ExternalLinkIcon />
                                                </a>
                                            ) : (
                                                <span className={styles.pendingTxText}>{t('affiliate.processingSettlement', 'Processing settlement...')}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className={styles.emptyTableRow}>
                                    {t('affiliate.noWithdrawalRecords', 'No withdrawal history records found.')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
