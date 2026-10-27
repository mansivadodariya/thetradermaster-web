"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import CommonCta from '@/components/commonCta';

export default function FinalCta({ onJoinClick, onTiersClick }) {
  const { t } = useLanguage();
  return (
    <CommonCta
      badge={t('publicAffiliate.programTitle', 'TRADERMASTER AFFILIATE PROGRAM')}
      title1={t('publicAffiliate.programSubtitle1', 'Start Earning Recurring')}
      title2={t('publicAffiliate.programSubtitle2', 'Commissions Today')}
      description={t('publicAffiliate.programDesc', 'Join hundreds of partners sharing TraderMaster with their network.')}
      primaryBtnText={t('publicAffiliate.ctaJoin', 'JOIN AFFILIATE PROGRAM')}
      primaryBtnAction={onJoinClick}
      secondaryBtnText={t('publicAffiliate.ctaTiers', 'VIEW COMMISSION DETAILS')}
      secondaryBtnAction={onTiersClick}
    />
  );
}
