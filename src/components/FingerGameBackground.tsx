/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeId } from '../types';
import { THEMES } from '../lib/themes';

interface FingerGameBackgroundProps {
  theme: ThemeId;
}

export const FingerGameBackground: React.FC<FingerGameBackgroundProps> = ({ theme }) => {
  const currentTheme = THEMES[theme] || THEMES['cyber-neon'];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Ambient Moving Neon Atmosphere Glow */}
      <div className="absolute inset-0 moving-gradient-layer opacity-30" />

      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse 80% 65% at 50% 50%, ${currentTheme.primary}15 0%, ${currentTheme.secondary}0d 45%, transparent 75%)`,
        }}
      />

      {/* 2. Cyber Holographic Tile Line Grid with Intersection Crosshairs */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, rgba(0,0,0,0.5) 70%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, rgba(0,0,0,0.5) 70%, transparent 95%)',
        }}
      >
        <defs>
          {/* Main 48px square tile pattern */}
          <pattern
            id="finger-tile-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            {/* Fine tile boundary lines */}
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke={currentTheme.primary}
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />
            {/* Subtle sub-division dashed center line */}
            <line
              x1="24"
              y1="0"
              x2="24"
              y2="48"
              stroke={currentTheme.secondary}
              strokeWidth="0.5"
              strokeDasharray="2 6"
              strokeOpacity="0.25"
            />
            <line
              x1="0"
              y1="24"
              x2="48"
              y2="24"
              stroke={currentTheme.secondary}
              strokeWidth="0.5"
              strokeDasharray="2 6"
              strokeOpacity="0.25"
            />
            {/* Tile intersection corner crosshairs '+' */}
            <path
              d="M 45 48 L 51 48 M 48 45 L 48 51"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeOpacity="0.75"
            />
          </pattern>

          {/* Holographic Radar Gradient */}
          <linearGradient id="holo-radar-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentTheme.primary} stopOpacity="0.6" />
            <stop offset="50%" stopColor={currentTheme.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={currentTheme.secondary} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Fill entire screen with tile grid */}
        <rect width="100%" height="100%" fill="url(#finger-tile-grid)" />
      </svg>

      {/* 3. Concentric Holographic Biometric Target Rings & Radar Arcs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <svg
          viewBox="0 0 800 800"
          className="w-[min(96vw,96vh)] h-[min(96vw,96vh)] max-w-[760px] max-h-[760px] animate-spin"
          style={{ animationDuration: '90s' }}
        >
          {/* Outer Ring with Telemetry Notches */}
          <circle
            cx="400"
            cy="400"
            r="360"
            fill="none"
            stroke={currentTheme.primary}
            strokeWidth="1.2"
            strokeDasharray="4 8"
            strokeOpacity="0.5"
          />
          {/* Segmented Middle Radar Arcs */}
          <circle
            cx="400"
            cy="400"
            r="270"
            fill="none"
            stroke={currentTheme.secondary}
            strokeWidth="1.5"
            strokeDasharray="18 12 6 12"
            strokeOpacity="0.65"
          />
          {/* Fine Inner Radar Ring */}
          <circle
            cx="400"
            cy="400"
            r="180"
            fill="none"
            stroke={currentTheme.primary}
            strokeWidth="1"
            strokeDasharray="2 6"
            strokeOpacity="0.6"
          />
          {/* Center Target Ring */}
          <circle
            cx="400"
            cy="400"
            r="90"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="8 8"
            strokeOpacity="0.45"
          />

          {/* Coordinate Crosshair Guides */}
          <line x1="40" y1="400" x2="360" y2="400" stroke={currentTheme.primary} strokeWidth="0.75" strokeDasharray="6 6" strokeOpacity="0.35" />
          <line x1="440" y1="400" x2="760" y2="400" stroke={currentTheme.primary} strokeWidth="0.75" strokeDasharray="6 6" strokeOpacity="0.35" />
          <line x1="400" y1="40" x2="400" y2="360" stroke={currentTheme.primary} strokeWidth="0.75" strokeDasharray="6 6" strokeOpacity="0.35" />
          <line x1="400" y1="440" x2="400" y2="760" stroke={currentTheme.primary} strokeWidth="0.75" strokeDasharray="6 6" strokeOpacity="0.35" />

          {/* Cardinal Ticks */}
          <line x1="400" y1="28" x2="400" y2="46" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.7" />
          <line x1="400" y1="754" x2="400" y2="772" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.7" />
          <line x1="28" y1="400" x2="46" y2="400" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.7" />
          <line x1="754" y1="400" x2="772" y2="400" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.7" />
        </svg>
      </div>

      {/* 4. Subtle Holographic HUD Telemetry Corner Labels */}
      <div className="absolute inset-x-6 top-[max(4.6rem,calc(env(safe-area-inset-top)+3.4rem))] flex justify-between items-center text-[9px] font-mono font-bold tracking-widest uppercase opacity-45 pointer-events-none">
        <span style={{ color: currentTheme.primary, textShadow: `0 0 6px ${currentTheme.primary}` }}>
          [SYS.SCAN // 01]
        </span>
        <span style={{ color: currentTheme.secondary, textShadow: `0 0 6px ${currentTheme.secondary}` }}>
          [TOUCH SENSORS ARMED]
        </span>
      </div>

      <div className="absolute inset-x-6 bottom-[max(0.6rem,calc(env(safe-area-inset-bottom)+0.2rem))] flex justify-between items-center text-[8px] font-mono font-bold tracking-widest uppercase opacity-35 pointer-events-none">
        <span style={{ color: currentTheme.secondary, textShadow: `0 0 6px ${currentTheme.secondary}` }}>
          [HOLOGRAPHIC MATRIX]
        </span>
        <span style={{ color: currentTheme.primary, textShadow: `0 0 6px ${currentTheme.primary}` }}>
          [AWAITING MULTI-TOUCH]
        </span>
      </div>

      {/* 5. Continuous Holographic Laser Scanner Blade (Sweeps Up and Down) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-70">
        <div className="animate-hologram-sweep absolute inset-x-0 h-16 flex flex-col items-center justify-center pointer-events-none">
          {/* Luminous upper flare tail */}
          <div
            className="w-full h-8"
            style={{
              background: `linear-gradient(to bottom, transparent, ${currentTheme.scannerLaserColor || currentTheme.primary}26)`,
            }}
          />
          {/* Intense laser blade line with white core and glowing neon bloom */}
          <div
            className="w-full h-[1.5px] bg-white relative"
            style={{
              boxShadow: `0 0 8px #ffffff, 0 0 16px ${currentTheme.scannerLaserColor || currentTheme.primary}, 0 0 32px ${currentTheme.secondary}`,
            }}
          >
            {/* Center scanning pulse point */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 rounded-full bg-white blur-[1px]"
              style={{
                boxShadow: `0 0 10px #ffffff, 0 0 20px ${currentTheme.primary}`,
              }}
            />
          </div>
          {/* Luminous lower flare tail */}
          <div
            className="w-full h-8"
            style={{
              background: `linear-gradient(to top, transparent, ${currentTheme.scannerLaserColor || currentTheme.primary}26)`,
            }}
          />
        </div>
      </div>

      {/* 6. Subtle Holographic Scanlines Raster Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0px, rgba(0, 0, 0, 0.3) 1px, transparent 1px, transparent 3px)',
        }}
      />
    </div>
  );
};
