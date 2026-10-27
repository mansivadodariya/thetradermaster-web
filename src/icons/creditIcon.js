'use client';

import React from 'react';

export const CreditCardIcon = ({
  width = 18,
  height = 18,
  color = '#18C98B',
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Card body */}
    <rect x="2" y="5" width="20" height="14" rx="2.5" />
    {/* Magnetic Stripe */}
    <line x1="2" y1="10" x2="22" y2="10" />
    {/* EMV Chip */}
    <rect
      x="5.5"
      y="13.5"
      width="3.5"
      height="2.5"
      rx="0.5"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Embossed Card Data Line */}
    <line x1="12" y1="15" x2="18" y2="15" />
  </svg>
);

export const CreditIcon = CreditCardIcon;
export default CreditCardIcon;
