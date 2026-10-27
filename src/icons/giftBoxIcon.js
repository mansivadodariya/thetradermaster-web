import React from 'react';

// Top Header Hexagonal Gift Icon
export const HexGiftBoxIcon = () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <polygon points="16 2 29 9.5 29 24.5 16 32 3 24.5 3 9.5" stroke="#10B981" strokeWidth="1.8" fill="rgba(24, 201, 139, 0.08)" />
        <path d="M10 13h12v12H10z" stroke="#18C98B" strokeWidth="1.5" fill="none" />
        <path d="M16 13v12M10 18h12" stroke="#18C98B" strokeWidth="1.5" />
        <path d="M12 11c-1.5-1.5-1.5-3 0-3s3 1.5 4 2.5c1-1 2.5-2.5 4-2.5s1.5 1.5 0 3c-1 1-2.5 1.5-4 2-1.5-.5-3-1-4-2z" fill="#18C98B" />
    </svg>
);

// Seamless 3D Gold Gift Box Illustration Component
export const Gold3DGiftBox = () => (
    <div style={{
        position: 'relative',
        width: 135,
        height: 135,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: 'transparent',
    }}>
        <img
            src="/assets/images/gold_3d_gift_box.jpg"
            alt="Gold 3D Gift Box"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 0 16px rgba(24, 201, 139, 0.45))',
            }}
        />
    </div>
);
