/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FingerprintIconProps {
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
}

export const FingerprintIcon: React.FC<FingerprintIconProps> = ({
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
        {/* Neon Cyber Cyan-to-Purple Gradient */}
        <linearGradient id="neonFpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#67e8f9" />
          <stop offset="55%" stopColor="#00d4ff" />
          <stop offset="80%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Emboss Bevel Highlight Gradient */}
        <linearGradient id="fpEmbossLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.3" />
        </linearGradient>

        {/* Neon Ambient Glow Filter */}
        <filter id="neonFpGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#ffffff" floodOpacity="0.8" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00f0ff" floodOpacity="0.85" />
          <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#3b82f6" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter={glow ? 'url(#neonFpGlow)' : undefined}>
        {/* Embossed Drop Shadow Underlying Paths */}
        <g stroke="#030712" strokeWidth="3" strokeLinecap="round" opacity="0.6" transform="translate(0, 1.5)">
          <path d="M24 6C15.7 6 9 12.7 9 21c0 5 2.1 9.5 5.5 12.7" />
          <path d="M39 21c0-4.5-1.9-8.5-4.9-11.4" />
          <path d="M14 21c0-5.5 4.5-10 10-10s10 4.5 10 10c0 7.5-3.5 14-9 17.5" />
          <path d="M19 21c0-2.8 2.2-5 5-5s5 2.2 5 5c0 6-3 11-7.5 14" />
          <path d="M24 21v8" />
          <path d="M14 39c2.8 2 6.3 3 10 3s7.2-1 10-3" />
          <path d="M30 35c2.5-1.8 4.6-4.2 6-7" />
        </g>

        {/* Main Embossed Metallic Neon Ridges */}
        <g stroke="url(#neonFpGrad)" strokeWidth="2.8" strokeLinecap="round">
          {/* Outer Loop Left */}
          <path d="M24 6C15.7 6 9 12.7 9 21c0 5 2.1 9.5 5.5 12.7" />
          {/* Outer Loop Right */}
          <path d="M39 21c0-4.5-1.9-8.5-4.9-11.4" />
          {/* Mid Ridge Arch */}
          <path d="M14 21c0-5.5 4.5-10 10-10s10 4.5 10 10c0 7.5-3.5 14-9 17.5" />
          {/* Inner Ridge Arch */}
          <path d="M19 21c0-2.8 2.2-5 5-5s5 2.2 5 5c0 6-3 11-7.5 14" />
          {/* Core Ridge */}
          <path d="M24 21v8" />
          {/* Bottom Arch Loop */}
          <path d="M14 39c2.8 2 6.3 3 10 3s7.2-1 10-3" />
          {/* Bottom Right Delta */}
          <path d="M30 35c2.5-1.8 4.6-4.2 6-7" />
        </g>

        {/* Top Edge Specular Highlights (Chiseled Emboss Feel) */}
        <g stroke="url(#fpEmbossLight)" strokeWidth="1.2" strokeLinecap="round" opacity="0.9">
          <path d="M24 6C18 6 12 11 10 18" />
          <path d="M16 19C16 15 20 10 24 10C28 10 31 12 33 16" />
          <path d="M20 20C20 17 22 15 24 15C26 15 28 17 28 20" />
        </g>
      </g>
    </svg>
  );
};
