'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './readyTostart.module.scss';
import LineText from '@/components/lineText';
import Button from '@/components/button';
import { useLanguage } from '@/context/LanguageContext';

const ArrowIcon = '/assets/icons/arrow.svg';
const RoundImage = '/assets/images/round-vec.svg';

export default function ReadyTostart() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <div className={styles.readyTostart}>
            <div className='container-xs'>
                <div className={styles.box}>
                    <LineText text={t('home.readyDeskLine', 'Trading Desk')} />
                    <div className={styles.title}>
                        <h2>
                            {t('home.readyDeskTitlePart1', 'Ready To Put An AI In Your')}{' '}
                            <span className={styles.neonText}>
                                {t('home.readyDeskTitlePart2', 'Trading Desk?')}
                            </span>
                        </h2>
                        <p>
                            {t('home.readyDeskSubtitle', 'Claim credits, and start asking Trader Master in under five minutes.')}
                        </p>
                    </div>
                    <div className={styles.buttonCenter}>
                        <Button icon={ArrowIcon} text={t('nav.getStarted', 'Get Started')} onClick={() => authNavigate(router, '/dashboard')} />
                    </div>
                    <div className={styles.round}>
                        <img src={RoundImage} alt="RoundImage" />
                    </div>
                </div>
            </div>
        </div>
    )
}
