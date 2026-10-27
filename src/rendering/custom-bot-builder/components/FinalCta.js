"use client";
import React from 'react';
import CommonCta from '@/components/commonCta';

export default function FinalCta({ onBuildClick }) {
  return (
    <CommonCta
      badge="AI TRADING BOT BUILDER"
      title1="Your Strategy Shouldn't"
      title2="Stay on Paper."
      description="Build it. Test it. Refine it. Turn your trading logic into a bot with ChronosX."
      primaryBtnText="CREATE YOUR FIRST BOT"
      primaryBtnAction={onBuildClick || "/dashboard"}
    />
  );
}
