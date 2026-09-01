/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SpinBottleIconProps {
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
}

export const SpinBottleIcon: React.FC<SpinBottleIconProps> = ({
  className = 'w-7 h-7',
  style,
  glow = true,
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={style}
    >
      <defs>
        {/* Neon Orange to Hot Pink Gradient */}
        <linearGradient id="neonSpinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb380" />
          <stop offset="35%" stopColor="#ff5e7e" />
          <stop offset="100%" stopColor="#ff2a8d" />
        </linearGradient>

        {/* Inner Bottle Liquid Fill Gradient */}
        <linearGradient id="bottleFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff8c42" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#ff3377" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#cc1166" stopOpacity="0.95" />
        </linearGradient>

        {/* Soft Neon Glow Filter */}
        <filter id="neonIconGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ff3b88" floodOpacity="0.8" />
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ff6633" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter={glow ? "url(#neonIconGlow)" : undefined}>
        {/* Top-Left Curved Arrow */}
        <path
          d="M 10 7.5 C 13.5 5.5 17 6.5 19 8.5"
          stroke="url(#neonSpinGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <polyline
          points="15.5 8.5 19 8.5 18.5 5"
          stroke="url(#neonSpinGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom-Right Curved Arrow */}
        <path
          d="M 22 24.5 C 18.5 26.5 15 25.5 13 23.5"
          stroke="url(#neonSpinGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <polyline
          points="16.5 23.5 13 23.5 13.5 27"
          stroke="url(#neonSpinGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center Diagonal Tilted Bottle (~45°) */}
        <g transform="translate(16, 16) rotate(42) translate(-16, -16)">
          {/* Bottle Rim / Cap */}
          <rect
            x="14"
            y="5"
            width="4"
            height="2"
            rx="0.75"
            fill="url(#neonSpinGrad)"
            stroke="url(#neonSpinGrad)"
            strokeWidth="0.8"
          />

          {/* Bottle Neck */}
          <line x1="14.6" y1="7" x2="14.6" y2="10.5" stroke="url(#neonSpinGrad)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="17.4" y1="7" x2="17.4" y2="10.5" stroke="url(#neonSpinGrad)" strokeWidth="2.2" strokeLinecap="round" />

          {/* Bottle Body Outer Outline */}
          <path
            d="M 14.6 10.5 C 12.5 12.5 11.8 14 11.8 17 L 11.8 24.5 A 2 2 0 0 0 13.8 26.5 L 18.2 26.5 A 2 2 0 0 0 20.2 24.5 L 20.2 17 C 20.2 14 19.5 12.5 17.4 10.5 Z"
            stroke="url(#neonSpinGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Glowing Liquid / Label Fill */}
          <path
            d="M 12.5 17.5 L 12.5 23.5 A 1 1 0 0 0 13.5 24.5 L 18.5 24.5 A 1 1 0 0 0 19.5 23.5 L 19.5 17.5 C 19.5 16 19 14.8 18 13.8 L 14 13.8 C 13 14.8 12.5 16 12.5 17.5 Z"
            fill="url(#bottleFillGrad)"
            opacity="0.85"
          />

          {/* Specular Highlight Streak */}
          <path
            d="M 13.5 16.5 L 13.5 23"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      </g>
    </svg>
  );
};
