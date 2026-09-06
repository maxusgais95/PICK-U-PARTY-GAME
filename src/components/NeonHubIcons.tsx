/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Neon Finger Touch Icon with left & right audio visualizer / equalizer bars
 * Matching IMG_0687.jpeg Finger Roulette Card
 */
export const NeonFingerTouchIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} select-none pointer-events-none`}>
      <svg
        viewBox="0 0 72 48"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Audio Spectrum Equalizer Bars */}
        <g stroke="#00f0ff" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" filter="url(#cyan-glow)">
          <line x1="8" y1="28" x2="8" y2="18" />
          <line x1="14" y1="32" x2="14" y2="14" />
          <line x1="20" y1="35" x2="20" y2="10" />
        </g>

        {/* Right Audio Spectrum Equalizer Bars */}
        <g stroke="#00f0ff" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" filter="url(#cyan-glow)">
          <line x1="52" y1="35" x2="52" y2="10" />
          <line x1="58" y1="32" x2="58" y2="14" />
          <line x1="64" y1="28" x2="64" y2="18" />
        </g>

        {/* Center Target Touch Circle Ring */}
        <g stroke="#00f0ff" filter="url(#cyan-glow)">
          <circle cx="36" cy="14" r="8" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="36" cy="14" r="4.5" strokeWidth="2.2" />
        </g>

        {/* Hand with extended index finger pressing the target */}
        <g
          stroke="#00f0ff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#cyan-glow)"
          fill="none"
        >
          {/* Extended Index finger pointing directly into circle */}
          <path d="M36 14 v13 c0 1.2 -1 2.2 -2.2 2.2 h-1 c-1.2 0 -2.2 -1 -2.2 -2.2 v-7" />
          {/* Middle, Ring, Pinky curled fingers */}
          <path d="M36 22 c0 -1 1 -1.8 2 -1.8 s2 0.8 2 1.8 v5 c0 1 -0.8 1.8 -1.8 1.8" />
          <path d="M40 23.5 c0 -0.8 0.8 -1.5 1.8 -1.5 s1.8 0.7 1.8 1.5 v4.5 c0 1 -0.8 1.8 -1.8 1.8" />
          <path d="M43.6 25.5 c0 -0.8 0.8 -1.5 1.7 -1.5 s1.7 0.7 1.7 1.5 v3 c0 2.5 -1.8 4.5 -4.2 4.8 l-4.8 0.7 c-2.5 0.3 -5 -0.8 -6.5 -2.8 l-3.5 -4.5 c-0.8 -1 -0.6 -2.4 0.4 -3.2 1 -0.8 2.4 -0.6 3.2 0.4 l2.5 3.2" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Neon Tilted Bottle Icon with sparkles
 * Matching IMG_0687.jpeg Spin the Bottle Card
 */
export const NeonTiltedBottleIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} select-none pointer-events-none`}>
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="magenta-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Sparkles around bottle */}
        <g fill="#ec4899" opacity="0.8" filter="url(#magenta-glow)">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="14" cy="11" r="1.8" />
          <circle cx="39" cy="37" r="1.5" />
          <circle cx="41" cy="27" r="1.8" />
        </g>

        {/* 45-degree Tilted Neon Bottle Silhouette */}
        <g
          transform="rotate(45 24 24)"
          stroke="#ec4899"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#magenta-glow)"
        >
          {/* Bottle Lip & Cap */}
          <path d="M22 6 h4" />
          {/* Bottle Neck */}
          <path d="M22.5 6 v7 c0 2.5 -3.5 5 -4.5 8 v16 c0 2 1.5 3.5 3.5 3.5 h5 c2 0 3.5 -1.5 3.5 -3.5 v-16 c-1 -3 -4.5 -5.5 -4.5 -8 v-7" />
          {/* Bottle Center Glass Label Line */}
          <line x1="19" y1="27" x2="29" y2="27" strokeWidth="1.8" opacity="0.65" />
          <line x1="19" y1="33" x2="29" y2="33" strokeWidth="1.8" opacity="0.65" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Neon Bomb Icon with lit curved spark fuse
 * Matching IMG_0687.jpeg KABOOM Card
 */
export const NeonBombIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} select-none pointer-events-none`}>
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="orange-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bomb Spherical Body */}
        <circle
          cx="21"
          cy="27"
          r="13"
          stroke="#ff6b00"
          strokeWidth="2.5"
          filter="url(#orange-glow)"
        />

        {/* Inner Curved Specular Highlight on Bomb */}
        <path
          d="M14 22 A 10 10 0 0 1 24 16"
          stroke="#ff9f43"
          strokeWidth="1.8"
          strokeLinecap="round"
          filter="url(#orange-glow)"
        />

        {/* Bomb Cap / Collar */}
        <path
          d="M28 17 l3.5 -3.5"
          stroke="#ff6b00"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#orange-glow)"
        />

        {/* Curved Lit Fuse */}
        <path
          d="M30 15 c3 -3 5 -2 7 -5"
          stroke="#ffaa00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 1.5"
          filter="url(#orange-glow)"
        />

        {/* 4-Point Shining Star Sparks on Fuse Tip */}
        <g stroke="#ffea00" strokeWidth="1.8" strokeLinecap="round" filter="url(#orange-glow)">
          <line x1="37" y1="6" x2="37" y2="14" />
          <line x1="33" y1="10" x2="41" y2="10" />
          <line x1="34.5" y1="7.5" x2="39.5" y2="12.5" strokeWidth="1.2" />
          <line x1="39.5" y1="7.5" x2="34.5" y2="12.5" strokeWidth="1.2" />
        </g>
        <circle cx="37" cy="10" r="1.5" fill="#ffffff" filter="url(#orange-glow)" />
      </svg>
    </div>
  );
};
