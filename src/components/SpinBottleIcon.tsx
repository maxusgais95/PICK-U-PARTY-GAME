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
  className = 'w-10 h-10',
  style,
  glow = true,
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        {/* Vibrant Neon Magenta-Orange Gradient */}
        <linearGradient id="neonSpinGradV2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe17d" />
          <stop offset="30%" stopColor="#ff5e3a" />
          <stop offset="70%" stopColor="#ff1493" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Electric Cyan Orbit Gradient */}
        <linearGradient id="neonOrbitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#ff2a8d" />
        </linearGradient>

        {/* Inner Glowing Liquid Gradient */}
        <linearGradient id="bottleFillGradV2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ff1493" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0.95" />
        </linearGradient>

        {/* Radial highlight for bottle base */}
        <radialGradient id="bottleGlowSpot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff007f" stopOpacity="0" />
        </radialGradient>

        {/* High-Impact Neon Glow Filter */}
        <filter id="neonBottleMasterGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ff007f" floodOpacity="0.9" />
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#ff5e3a" floodOpacity="0.6" />
        </filter>
      </defs>

      <g filter={glow ? 'url(#neonBottleMasterGlow)' : undefined}>
        {/* Outer Orbit Speed Rings (Cyberpunk Spin Motion) */}
        {/* Top Arc Arrow with Arrowhead */}
        <path
          d="M 12 14 C 17 8 31 8 36 14"
          stroke="url(#neonOrbitGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 31 14.5 L 36.5 14 L 35.5 8.5"
          stroke="url(#neonOrbitGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom Arc Arrow with Arrowhead */}
        <path
          d="M 36 34 C 31 40 17 40 12 34"
          stroke="url(#neonOrbitGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 17 33.5 L 11.5 34 L 12.5 39.5"
          stroke="url(#neonOrbitGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ambient Orbit Sparkles */}
        <circle cx="9" cy="22" r="1.5" fill="#00f0ff" opacity="0.9" />
        <circle cx="39" cy="26" r="1.5" fill="#ffe17d" opacity="0.9" />

        {/* Center Diagonal Tilted Bottle (~45°) */}
        <g transform="translate(24, 24) rotate(42) translate(-24, -24)">
          {/* Glass Outer Glow Silhouette */}
          <path
            d="M 21.5 10 L 21.5 15 C 18 18 17 21 17 26 L 17 37 C 17 39 18.5 40.5 20.5 40.5 L 27.5 40.5 C 29.5 40.5 31 39 31 37 L 31 26 C 31 21 30 18 26.5 15 L 26.5 10 Z"
            fill="url(#bottleFillGradV2)"
            opacity="0.88"
          />

          {/* Bottle Rim / Golden Cap */}
          <rect
            x="20.5"
            y="6.5"
            width="7"
            height="3.5"
            rx="1.5"
            fill="#ffe17d"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* Cap Ring */}
          <line x1="20" y1="10" x2="28" y2="10" stroke="#ff5e3a" strokeWidth="1.5" strokeLinecap="round" />

          {/* Bottle Neck and Shoulder Contours */}
          <path
            d="M 21.5 10 L 21.5 15.5 C 18 18.5 17 21.5 17 26 L 17 37 C 17 39.2 18.8 41 21 41 L 27 41 C 29.2 41 31 39.2 31 37 L 31 26 C 31 21.5 30 18.5 26.5 15.5 L 26.5 10"
            stroke="url(#neonSpinGradV2)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Label / Core Power Cell */}
          <rect
            x="19.5"
            y="26.5"
            width="9"
            height="10.5"
            rx="2.5"
            fill="rgba(0, 0, 0, 0.45)"
            stroke="#00f0ff"
            strokeWidth="1.2"
          />
          {/* Lightning / Star emblem inside label */}
          <path
            d="M 24.5 28 L 22.5 32 L 25 32 L 23.5 35.5"
            stroke="#ffe17d"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sleek Specular Glass Light Reflections */}
          <path
            d="M 19 25 L 19 36"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 29 27 L 29 35"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.65"
          />
        </g>
      </g>
    </svg>
  );
};

