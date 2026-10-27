'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './noRefundPolicy.module.scss';

export default function NoRefundPolicy() {
    const { t } = useLanguage();

    return (
        <div className={styles.noRefundPolicy}>
            <div className="container-xs">
                <div className={styles.header}>
                    <h1>{t('noRefundPolicy.title', 'No Refund Policy')}</h1>
                    <p>{t('noRefundPolicy.lastUpdated', 'Last Updated: May 2026')}</p>
                </div>
                <div className={styles.content}>
                    <p>
                        {t('noRefundPolicy.intro', 'At TraderMaster, we provide AI-powered trading intelligence, analytical tools, market research features, software functionality, subscriptions, credits, and other digital services. Because these products and services are delivered digitally and may provide immediate access after purchase, all purchases are generally final and non-refundable, except where otherwise required by applicable law or expressly stated below.')}
                    </p>
                    <br />
                    <br />

                    <section>
                        <h2>{t('noRefundPolicy.sec1Title', '1. No Refunds for Purchased Services')}</h2>
                        <p>{t('noRefundPolicy.sec1Desc', 'Once a payment has been successfully completed, we generally do not provide refunds, credits, or cancellations for:')}</p>
                        <ul>
                            <li>{t('noRefundPolicy.sec1Item1', 'Subscription plans')}</li>
                            <li>{t('noRefundPolicy.sec1Item2', 'Digital services')}</li>
                            <li>{t('noRefundPolicy.sec1Item3', 'AI credits or usage credits')}</li>
                            <li>{t('noRefundPolicy.sec1Item4', 'Trading analysis services')}</li>
                            <li>{t('noRefundPolicy.sec1Item5', 'AI-generated reports or analyses')}</li>
                            <li>{t('noRefundPolicy.sec1Item6', 'Backtesting usage')}</li>
                            <li>{t('noRefundPolicy.sec1Item7', 'Trading tools or platform access')}</li>
                            <li>{t('noRefundPolicy.sec1Item8', 'Other digital products or features made available through TraderMaster')}</li>
                        </ul>
                        <p>{t('noRefundPolicy.sec1Footer', 'By completing a purchase, you acknowledge and agree to this No Refund Policy.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec2Title', '2. Subscription Plans')}</h2>
                        <p>{t('noRefundPolicy.sec2P1', 'Subscription fees are charged according to the plan and billing cycle selected at the time of purchase.')}</p>
                        <p>{t('noRefundPolicy.sec2P2', 'Cancelling a subscription does not automatically create an entitlement to a refund for the current billing period.')}</p>
                        <p>{t('noRefundPolicy.sec2P3', 'When a subscription is cancelled, access may remain available until the end of the already-paid billing period, subject to the applicable subscription terms.')}</p>
                        <p>{t('noRefundPolicy.sec2P4', 'Unless otherwise stated, cancellation prevents future renewals but does not reverse a completed payment.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec3Title', '3. Unused Credits')}</h2>
                        <p>{t('noRefundPolicy.sec3Desc', 'Purchased credits or usage balances are generally non-refundable, including where:')}</p>
                        <ul>
                            <li>{t('noRefundPolicy.sec3Item1', 'Credits have not been fully used')}</li>
                            <li>{t('noRefundPolicy.sec3Item2', 'You decide not to use the service')}</li>
                            <li>{t('noRefundPolicy.sec3Item3', 'You change your mind after purchase')}</li>
                            <li>{t('noRefundPolicy.sec3Item4', 'You no longer require the service')}</li>
                            <li>{t('noRefundPolicy.sec3Item5', 'Your trading activity or requirements change')}</li>
                        </ul>
                        <p>{t('noRefundPolicy.sec3Footer', 'Unused credits do not have cash value and cannot generally be exchanged for cash.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec4Title', '4. Free Trials and Promotional Offers')}</h2>
                        <p>{t('noRefundPolicy.sec4P1', 'Where TraderMaster offers a free trial, promotional period, discount, coupon, or other special offer, the terms of that specific promotion will apply.')}</p>
                        <p>{t('noRefundPolicy.sec4P2', 'A promotional offer does not create an automatic right to a refund unless the applicable offer explicitly states otherwise.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec5Title', '5. Duplicate or Incorrect Charges')}</h2>
                        <p>{t('noRefundPolicy.sec5P1', 'If you believe that you have been charged more than once for the same transaction or have identified an obvious billing error, please contact our support team.')}</p>
                        <p>{t('noRefundPolicy.sec5P2', 'After reviewing the transaction, TraderMaster may correct an eligible duplicate or erroneous charge where appropriate.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec6Title', '6. Unauthorized Transactions')}</h2>
                        <p>{t('noRefundPolicy.sec6P1', 'If you believe that a payment was made without your authorization, contact us as soon as possible with the relevant transaction information.')}</p>
                        <p>{t('noRefundPolicy.sec6P2', 'We may review the transaction and request additional information to determine whether the charge was unauthorized.')}</p>
                        <p>{t('noRefundPolicy.sec6P3', 'This policy does not limit any rights you may have under applicable payment, consumer-protection, or other laws.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec7Title', '7. Service Issues')}</h2>
                        <p>{t('noRefundPolicy.sec7P1', 'Temporary interruptions, maintenance, technical issues, delays, or inability to access a particular feature do not automatically create an entitlement to a refund.')}</p>
                        <p>{t('noRefundPolicy.sec7P2', 'TraderMaster may, at its discretion and where appropriate, investigate service-related issues and provide a technical resolution, account adjustment, extension, or other remedy.')}</p>
                        <p>{t('noRefundPolicy.sec7P3', 'Any such remedy will depend on the circumstances and does not establish a general refund entitlement.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec8Title', '8. Trading Performance Does Not Qualify for a Refund')}</h2>
                        <p>{t('noRefundPolicy.sec8P1', 'TraderMaster provides AI-powered analytical and informational tools. Trading results, profits, losses, strategy performance, backtesting results, market conditions, or investment outcomes are not grounds for a refund.')}</p>
                        <p>{t('noRefundPolicy.sec8P2', 'TraderMaster does not guarantee that any analysis, signal, strategy, backtest, AI-generated output, or trading-related information will result in profits or prevent losses.')}</p>
                        <p>{t('noRefundPolicy.sec8P3', 'Past performance and simulated results do not guarantee future results.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec9Title', '9. User Responsibility')}</h2>
                        <p>{t('noRefundPolicy.sec9Desc', 'Before purchasing a TraderMaster product or subscription, you are responsible for reviewing:')}</p>
                        <ul>
                            <li>{t('noRefundPolicy.sec9Item1', 'The selected plan')}</li>
                            <li>{t('noRefundPolicy.sec9Item2', 'Pricing')}</li>
                            <li>{t('noRefundPolicy.sec9Item3', 'Billing frequency')}</li>
                            <li>{t('noRefundPolicy.sec9Item4', 'Included features')}</li>
                            <li>{t('noRefundPolicy.sec9Item5', 'Credit or usage limits')}</li>
                            <li>{t('noRefundPolicy.sec9Item6', 'Applicable subscription terms')}</li>
                            <li>{t('noRefundPolicy.sec9Item7', 'Applicable promotional conditions')}</li>
                        </ul>
                        <p>{t('noRefundPolicy.sec9Footer', 'By completing a purchase, you confirm that you have reviewed the relevant purchase information.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec10Title', '10. Cancellation of Subscription')}</h2>
                        <p>{t('noRefundPolicy.sec10P1', 'You may cancel an eligible recurring subscription according to the cancellation options available through your account or the relevant payment provider.')}</p>
                        <p>{t('noRefundPolicy.sec10P2', 'Cancellation generally applies to future billing periods and does not automatically result in a refund of amounts already charged.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec11Title', '11. Exceptions Required by Law')}</h2>
                        <p>{t('noRefundPolicy.sec11P1', 'Nothing in this policy is intended to exclude, restrict, or override any refund, cancellation, consumer-protection, or other legal rights that cannot lawfully be excluded under applicable law.')}</p>
                        <p>{t('noRefundPolicy.sec11P2', 'Where applicable law requires a refund or other remedy, TraderMaster will comply with those requirements.')}</p>
                    </section>

                    <section>
                        <h2>{t('noRefundPolicy.sec12Title', '12. Contact Us')}</h2>
                        <p>{t('noRefundPolicy.sec12P1', 'If you have a billing question, believe you were charged incorrectly, or need assistance with your account, please contact TraderMaster Support.')}</p>
                        <p><strong>{(t('noRefundPolicy.sec12Email', 'Email:') || 'Email:').replace(/support@TraderMaster\.com/gi, '').trim() || 'Email:'}</strong> <a href="mailto:support@thetradermaster.com">support@thetradermaster.com</a></p>
                        <p>{t('noRefundPolicy.sec12P2', 'Please include your registered email address and relevant transaction details so we can locate your account and investigate the matter.')}</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
