"use client";
import React from 'react';
import CommonCta from '@/components/commonCta';
import { useLanguage } from '@/context/LanguageContext';

export default function ReadytoPut() {
  const { t } = useLanguage();

  return (
    <CommonCta
      badge={t('homeSections.readyToPut.badge', 'INSTANT INSTITUTIONAL ACCESS')}
      title1={t('homeSections.readyToPut.title1', 'Ready to Bring AI to')}
      title2={t('homeSections.readyToPut.title2', 'Your Trading Desk?')}
      description={t('homeSections.readyToPut.description', 'Experience institutional-grade AI chart intelligence, pattern detection, and quantitative strategies in just a few minutes.')}
      primaryBtnText={t('homeSections.readyToPut.primaryBtnText', 'GET STARTED NOW')}
      primaryBtnAction="/dashboard"
    />
  );
}
