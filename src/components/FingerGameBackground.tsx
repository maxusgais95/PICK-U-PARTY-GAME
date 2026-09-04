/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ThemeId, TouchPlayer } from '../types';
import { THEMES } from '../lib/themes';

interface FingerGameBackgroundProps {
  theme: ThemeId;
  activeFingersCount?: number;
  touches?: TouchPlayer[];
}

export const FingerGameBackground: React.FC<FingerGameBackgroundProps> = ({
  theme,
  activeFingersCount = 0,
  touches = [],
}) => {
  const currentTheme = THEMES[theme] || THEMES['cyber-neon'];
  const isScannerActive = activeFingersCount > 0;

  // Track session so scanning cycle restarts cleanly when fingers touch down
  const [scanSession, setScanSession] = useState(0);
  const prevActiveRef = useRef(false);

  useEffect(() => {
    if (isScannerActive && !prevActiveRef.current) {
      setScanSession((s) => s + 1);
    }
    prevActiveRef.current = isScannerActive;
  }, [isScannerActive]);

  // Extract vibrant palette colors for the laser system
  const palette = useMemo(() => {
    const thm = THEMES[theme] || THEMES['cyber-neon'];
    const themeLaserColors =
      thm.laserColors && thm.laserColors.length >= 4
        ? thm.laserColors
        : [thm.primary, thm.secondary, thm.accent, thm.scannerLaserGlow || thm.primary];

    // If active touch players exist, pull the actual player palette colors currently on screen
    if (touches && touches.length > 0) {
      const touchColors = touches.map((t) => {
        const p = thm.playerPalettes[t.colorIndex % thm.playerPalettes.length];
        return p.solid || p.border || thm.primary;
      });
      const combined = Array.from(new Set([...touchColors, ...themeLaserColors]));
      while (combined.length < 6) {
        combined.push(...themeLaserColors);
      }
      return combined.slice(0, 8);
    }

    const combined = [...themeLaserColors];
    while (combined.length < 6) {
      combined.push(...themeLaserColors);
    }
    return combined.slice(0, 8);
  }, [theme, touches]);

  const p0 = palette[0];
  const p1 = palette[1];
  const p2 = palette[2];
  const p3 = palette[3];
  const p4 = palette[4];
  const p5 = palette[5] || palette[0];

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ contain: 'strict' }}
    >
      {/* Scoped CSS Keyframes: Smooth, GPU-composited color shifting according to active palette */}
      <style>{`
        @keyframes laserColorTop {
          0% { color: ${p0}; }
          11.25% { color: ${p0}; }
          22.5% { color: ${p1}; }
          42% { color: ${p2}; }
          50% { color: ${p3}; }
          61.25% { color: ${p3}; }
          72.5% { color: ${p4}; }
          92% { color: ${p5}; }
          100% { color: ${p0}; }
        }
        @keyframes laserColorBottom {
          0% { color: ${p1}; }
          11.25% { color: ${p1}; }
          22.5% { color: ${p2}; }
          42% { color: ${p3}; }
          50% { color: ${p4}; }
          61.25% { color: ${p4}; }
          72.5% { color: ${p5}; }
          92% { color: ${p0}; }
          100% { color: ${p1}; }
        }
        @keyframes laserColorLeft {
          0%, 25% { color: ${p2}; }
          26.5% { color: ${p2}; }
          36.25% { color: ${p3}; }
          46% { color: ${p4}; }
          50%, 75% { color: ${p4}; }
          76.5% { color: ${p5}; }
          86.25% { color: ${p0}; }
          96% { color: ${p1}; }
          100% { color: ${p2}; }
        }
        @keyframes laserColorRight {
          0%, 25% { color: ${p4}; }
          26.5% { color: ${p4}; }
          36.25% { color: ${p5}; }
          46% { color: ${p0}; }
          50%, 75% { color: ${p0}; }
          76.5% { color: ${p1}; }
          86.25% { color: ${p2}; }
          96% { color: ${p3}; }
          100% { color: ${p4}; }
        }
      `}</style>

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
          maskImage:
            'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, rgba(0,0,0,0.5) 70%, transparent 95%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, rgba(0,0,0,0.5) 70%, transparent 95%)',
        }}
      >
        <defs>
          <pattern
            id="finger-tile-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke={currentTheme.primary}
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />
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
            <path
              d="M 45 48 L 51 48 M 48 45 L 48 51"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeOpacity="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#finger-tile-grid)" />
      </svg>

      {/* 3. Concentric Holographic Biometric Target Rings & Radar Arcs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <svg
          viewBox="0 0 800 800"
          className="w-[min(96vw,96vh)] h-[min(96vw,96vh)] max-w-[760px] max-h-[760px] animate-spin"
          style={{ animationDuration: '90s' }}
        >
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
          <line
            x1="40"
            y1="400"
            x2="360"
            y2="400"
            stroke={currentTheme.primary}
            strokeWidth="0.75"
            strokeDasharray="6 6"
            strokeOpacity="0.35"
          />
          <line
            x1="440"
            y1="400"
            x2="760"
            y2="400"
            stroke={currentTheme.primary}
            strokeWidth="0.75"
            strokeDasharray="6 6"
            strokeOpacity="0.35"
          />
          <line
            x1="400"
            y1="40"
            x2="400"
            y2="360"
            stroke={currentTheme.primary}
            strokeWidth="0.75"
            strokeDasharray="6 6"
            strokeOpacity="0.35"
          />
          <line
            x1="400"
            y1="440"
            x2="400"
            y2="760"
            stroke={currentTheme.primary}
            strokeWidth="0.75"
            strokeDasharray="6 6"
            strokeOpacity="0.35"
          />
          <line x1="400" y1="28" x2="400" y2="46" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.7" />
          <line x1="400" y1="754" x2="400" y2="772" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.7" />
          <line x1="28" y1="400" x2="46" y2="400" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.7" />
          <line x1="754" y1="400" x2="772" y2="400" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.7" />
        </svg>
      </div>

      {/* 4. Holographic HUD Telemetry Corner Labels (Dynamic Palette Harmony) */}
      <div className="absolute inset-x-6 top-[max(4.6rem,calc(env(safe-area-inset-top)+3.4rem))] flex justify-between items-center text-[9px] font-mono font-bold tracking-widest uppercase pointer-events-none transition-opacity duration-300">
        <span
          className="transition-colors duration-300"
          style={{
            color: isScannerActive ? p0 : currentTheme.primary,
            opacity: isScannerActive ? 0.85 : 0.4,
            textShadow: `0 0 6px ${isScannerActive ? p0 : currentTheme.primary}`,
          }}
        >
          {isScannerActive ? `[DUAL.SCAN // ACTIVE]` : `[SYS.SCAN // STANDBY]`}
        </span>
        <span
          className="transition-colors duration-300"
          style={{
            color: isScannerActive ? p1 : currentTheme.secondary,
            opacity: isScannerActive ? 0.85 : 0.4,
            textShadow: `0 0 6px ${isScannerActive ? p1 : currentTheme.secondary}`,
          }}
        >
          {isScannerActive ? `[BIOMETRIC TARGETS: ${activeFingersCount}P]` : `[TOUCH SENSORS ARMED]`}
        </span>
      </div>

      <div className="absolute inset-x-6 bottom-[max(0.6rem,calc(env(safe-area-inset-bottom)+0.2rem))] flex justify-between items-center text-[8px] font-mono font-bold tracking-widest uppercase pointer-events-none transition-opacity duration-300">
        <span
          className="transition-colors duration-300"
          style={{
            color: isScannerActive ? p2 : currentTheme.secondary,
            opacity: isScannerActive ? 0.75 : 0.35,
            textShadow: `0 0 6px ${isScannerActive ? p2 : currentTheme.secondary}`,
          }}
        >
          {isScannerActive ? `[PALETTE MATRIX ONLINE]` : `[HOLOGRAPHIC MATRIX]`}
        </span>
        <span
          className="transition-colors duration-300"
          style={{
            color: isScannerActive ? p0 : currentTheme.primary,
            opacity: isScannerActive ? 0.75 : 0.35,
            textShadow: `0 0 6px ${isScannerActive ? p0 : currentTheme.primary}`,
          }}
        >
          {isScannerActive ? `[SYNCED CENTER IMPACT]` : `[AWAITING MULTI-TOUCH]`}
        </span>
      </div>

      {/* 5. Dual-Direction Holographic Laser Scanners with Dynamic Palette Colors */}
      {/* Activated strictly when finger(s) are detected on screen. When inactive, display: none saves 100% GPU/CPU */}
      <div
        key={scanSession}
        className={`absolute inset-0 pointer-events-none overflow-hidden z-10 transition-opacity duration-300 ease-out ${
          isScannerActive ? 'opacity-95' : 'opacity-0'
        }`}
        style={{
          mixBlendMode: 'screen',
          display: isScannerActive ? 'block' : 'none',
        }}
      >
        {/* =========================================================================
            PHASE 1 - BEAM 1: TOP SCANNER (Sweeping Downwards ↓)
            Volumetric gradient echo wash extending UPWARDS behind blade (above y=0)
            ========================================================================= */}
        <div
          className="animate-laser-scan-top absolute inset-x-0 top-0 h-0 pointer-events-none"
          style={{
            animation: 'laserScanFromTop 4.2s linear infinite, laserColorTop 8.4s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        >
          {/* Volumetric Echo Wash sitting strictly ABOVE y=0 */}
          <div
            className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, currentColor 0%, rgba(255,255,255,0.06) 30%, transparent 100%)',
              opacity: 0.65,
            }}
          />

          {/* Harmonic Echo Line 1 (Close behind blade) */}
          <div
            className="absolute bottom-3.5 inset-x-0 h-[1.2px] pointer-events-none"
            style={{
              backgroundColor: 'currentColor',
              boxShadow: '0 0 10px currentColor',
              opacity: 0.75,
            }}
          />

          {/* Harmonic Echo Line 2 (Ambient fringe) */}
          <div
            className="absolute bottom-9 inset-x-0 h-[0.75px] pointer-events-none"
            style={{
              backgroundColor: 'currentColor',
              boxShadow: '0 0 8px currentColor',
              opacity: 0.45,
            }}
          />

          {/* THE LEADING LASER BLADE: Exactly centered at y=0 */}
          <div
            className="w-full h-[2.5px] -translate-y-1/2 bg-white relative z-10"
            style={{
              boxShadow: '0 0 8px #ffffff, 0 0 18px currentColor, 0 0 36px currentColor',
            }}
          >
            {/* Center Biometric Sensor Node */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-2 rounded-full bg-white blur-[0.5px]"
              style={{
                boxShadow: '0 0 10px #ffffff, 0 0 22px currentColor, 0 0 42px currentColor',
              }}
            />
            {/* Center Crosshair Pip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
            {/* Holographic calibration markers */}
            <div className="absolute top-1/2 left-12 -translate-y-1/2 w-8 h-[1px] bg-white/70" />
            <div className="absolute top-1/2 right-12 -translate-y-1/2 w-8 h-[1px] bg-white/70" />
          </div>

          {/* Leading Edge Cutting Flare (Downward bleed below y=0) */}
          <div
            className="absolute top-0 inset-x-0 h-3 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, currentColor 0%, transparent 100%)',
              opacity: 0.65,
            }}
          />
        </div>

        {/* =========================================================================
            PHASE 1 - BEAM 2: BOTTOM SCANNER (Sweeping Upwards ↑)
            Volumetric gradient echo wash extending DOWNWARDS behind blade (below y=0)
            ========================================================================= */}
        <div
          className="animate-laser-scan-bottom absolute inset-x-0 top-0 h-0 pointer-events-none"
          style={{
            animation: 'laserScanFromBottom 4.2s linear infinite, laserColorBottom 8.4s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        >
          {/* Leading Edge Cutting Flare (Upward bleed above y=0) */}
          <div
            className="absolute bottom-0 inset-x-0 h-3 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, currentColor 0%, transparent 100%)',
              opacity: 0.65,
            }}
          />

          {/* THE LEADING LASER BLADE: Exactly centered at y=0 */}
          <div
            className="w-full h-[2.5px] -translate-y-1/2 bg-white relative z-10"
            style={{
              boxShadow: '0 0 8px #ffffff, 0 0 18px currentColor, 0 0 36px currentColor',
            }}
          >
            {/* Center Biometric Sensor Node */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-2 rounded-full bg-white blur-[0.5px]"
              style={{
                boxShadow: '0 0 10px #ffffff, 0 0 22px currentColor, 0 0 42px currentColor',
              }}
            />
            {/* Center Crosshair Pip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
            {/* Holographic calibration markers */}
            <div className="absolute top-1/2 left-12 -translate-y-1/2 w-8 h-[1px] bg-white/70" />
            <div className="absolute top-1/2 right-12 -translate-y-1/2 w-8 h-[1px] bg-white/70" />
          </div>

          {/* Volumetric Echo Wash sitting strictly BELOW y=0 */}
          <div
            className="absolute top-0 inset-x-0 h-28 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, currentColor 0%, rgba(255,255,255,0.06) 30%, transparent 100%)',
              opacity: 0.65,
            }}
          />

          {/* Harmonic Echo Line 1 (Close behind blade) */}
          <div
            className="absolute top-3.5 inset-x-0 h-[1.2px] pointer-events-none"
            style={{
              backgroundColor: 'currentColor',
              boxShadow: '0 0 10px currentColor',
              opacity: 0.75,
            }}
          />

          {/* Harmonic Echo Line 2 (Ambient fringe) */}
          <div
            className="absolute top-9 inset-x-0 h-[0.75px] pointer-events-none"
            style={{
              backgroundColor: 'currentColor',
              boxShadow: '0 0 8px currentColor',
              opacity: 0.45,
            }}
          />
        </div>

        {/* =========================================================================
            PHASE 2 - BEAM 3: LEFT SCANNER (Sweeping Rightwards →)
            Volumetric gradient echo wash extending LEFTWARDS behind blade (left of x=0)
            ========================================================================= */}
        <div
          className="animate-laser-scan-left absolute inset-y-0 left-0 w-0 pointer-events-none"
          style={{
            animation: 'laserScanFromLeft 4.2s linear infinite, laserColorLeft 8.4s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        >
          {/* Volumetric Echo Wash sitting strictly to the LEFT of x=0 */}
          <div
            className="absolute top-0 right-0 h-full w-28 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, currentColor 0%, rgba(255,255,255,0.06) 30%, transparent 100%)',
              opacity: 0.65,
            }}
          />

          {/* Harmonic Echo Line 1 (Close behind blade) */}
          <div
            className="absolute top-0 right-3.5 h-full w-[1.2px] pointer-events-none"
            style={{
              backgroundColor: 'currentColor',
              boxShadow: '0 0 10px currentColor',
              opacity: 0.75,
            }}
          />

          {/* Harmonic Echo Line 2 (Ambient fringe) */}
          <div
            className="absolute top-0 right-9 h-full w-[0.75px] pointer-events-none"
            style={{
              backgroundColor: 'currentColor',
              boxShadow: '0 0 8px currentColor',
              opacity: 0.45,
            }}
          />

          {/* THE LEADING LASER BLADE: Exactly centered at x=0 */}
          <div
            className="h-full w-[2.5px] -translate-x-1/2 bg-white relative z-10"
            style={{
              boxShadow: '0 0 8px #ffffff, 0 0 18px currentColor, 0 0 36px currentColor',
            }}
          >
            {/* Center Biometric Sensor Node */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-2 rounded-full bg-white blur-[0.5px]"
              style={{
                boxShadow: '0 0 10px #ffffff, 0 0 22px currentColor, 0 0 42px currentColor',
              }}
            />
            {/* Center Crosshair Pip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
            {/* Holographic calibration markers */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-white/70" />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-white/70" />
          </div>

          {/* Leading Edge Cutting Flare (Rightward bleed to the right of x=0) */}
          <div
            className="absolute top-0 left-0 h-full w-3 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, currentColor 0%, transparent 100%)',
              opacity: 0.65,
            }}
          />
        </div>

        {/* =========================================================================
            PHASE 2 - BEAM 4: RIGHT SCANNER (Sweeping Leftwards ←)
            Volumetric gradient echo wash extending RIGHTWARDS behind blade (right of x=0)
            ========================================================================= */}
        <div
          className="animate-laser-scan-right absolute inset-y-0 left-0 w-0 pointer-events-none"
          style={{
            animation: 'laserScanFromRight 4.2s linear infinite, laserColorRight 8.4s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        >
          {/* Leading Edge Cutting Flare (Leftward bleed to the left of x=0) */}
          <div
            className="absolute top-0 right-0 h-full w-3 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, currentColor 0%, transparent 100%)',
              opacity: 0.65,
            }}
          />

          {/* THE LEADING LASER BLADE: Exactly centered at x=0 */}
          <div
            className="h-full w-[2.5px] -translate-x-1/2 bg-white relative z-10"
            style={{
              boxShadow: '0 0 8px #ffffff, 0 0 18px currentColor, 0 0 36px currentColor',
            }}
          >
            {/* Center Biometric Sensor Node */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-2 rounded-full bg-white blur-[0.5px]"
              style={{
                boxShadow: '0 0 10px #ffffff, 0 0 22px currentColor, 0 0 42px currentColor',
              }}
            />
            {/* Center Crosshair Pip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
            {/* Holographic calibration markers */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-white/70" />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-white/70" />
          </div>

          {/* Volumetric Echo Wash sitting strictly to the RIGHT of x=0 */}
          <div
            className="absolute top-0 left-0 h-full w-28 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, currentColor 0%, rgba(255,255,255,0.06) 30%, transparent 100%)',
              opacity: 0.65,
            }}
          />

          {/* Harmonic Echo Line 1 (Close behind blade) */}
          <div
            className="absolute top-0 left-3.5 h-full w-[1.2px] pointer-events-none"
            style={{
              backgroundColor: 'currentColor',
              boxShadow: '0 0 10px currentColor',
              opacity: 0.75,
            }}
          />

          {/* Harmonic Echo Line 2 (Ambient fringe) */}
          <div
            className="absolute top-0 left-9 h-full w-[0.75px] pointer-events-none"
            style={{
              backgroundColor: 'currentColor',
              boxShadow: '0 0 8px currentColor',
              opacity: 0.45,
            }}
          />
        </div>
      </div>

      {/* 6. Subtle Holographic Scanlines Raster Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0px, rgba(0, 0, 0, 0.3) 1px, transparent 1px, transparent 3px)',
        }}
      />
    </div>
  );
};
