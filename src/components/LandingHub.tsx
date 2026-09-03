/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Target, Play, RotateCw } from 'lucide-react';
import { FingerprintIcon } from './FingerprintIcon';
import { SpinBottleIcon } from './SpinBottleIcon';
import { SwirlVortexCanvas } from './SwirlVortexCanvas';
import { AppSettings } from '../types';
import { THEMES } from '../lib/themes';
import { SoundEngine } from '../lib/audio';

interface LandingHubProps {
  settings: AppSettings;
  onSelectRoulette: () => void;
  onSelectBottle: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const LandingHub: React.FC<LandingHubProps> = ({
  settings,
  onSelectRoulette,
  onSelectBottle,
  onUpdateSettings,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES['cyber-neon'];

  const handlePlayerCountSelect = (e: React.MouseEvent, count: number) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    const newTarget = Math.min(settings.targetCount, count - 1);
    onUpdateSettings({ minPlayers: count, targetCount: newTarget });
  };

  const handleTargetCountSelect = (e: React.MouseEvent, target: number) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    onUpdateSettings({ targetCount: target });
  };

  const maxTargets = Math.max(1, settings.minPlayers - 1);
  const targetOptions = Array.from({ length: maxTargets }, (_, i) => i + 1);

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center px-4 pt-[max(4.2rem,calc(env(safe-area-inset-top)+3.2rem))] pb-[max(1.5rem,env(safe-area-inset-bottom))] overflow-y-auto">
      {/* Header Branding (Title elevated with clean separation and top z-index) */}
      <div className="text-center mt-0 mb-2 flex flex-col items-center select-none relative z-20">
        {/* Neon Pill Badge: "NEON ROULETTE" */}
        <div className="neon-pill-badge inline-flex items-center justify-center px-4 py-1 rounded-full text-[11px] mb-1.5 shadow-lg relative z-30">
          NEON ROULETTE
        </div>

        {/* Clean Subtitle */}
        <p className="neon-subtitle text-xs sm:text-sm font-semibold tracking-wider mb-1 relative z-30">
          Touch Decider & Bottle Spinner
        </p>

        {/* Crisp Neon Arcade Sign: "PICK'U PARTY" */}
        <h1
          className="neon-picku-title text-4xl sm:text-5xl my-0 select-none whitespace-nowrap relative z-10"
        >
          PICK'U PARTY
        </h1>
      </div>

      {/* Main Game Mode Cards */}
      <div className="w-full max-w-sm flex flex-col gap-3.5 my-auto">
        {/* Card 1: Finger Roulette */}
        <div
          onClick={() => {
            SoundEngine.playButtonClick();
            onSelectRoulette();
          }}
          className="glass-panel relative p-4 cursor-pointer transition-all active:scale-[0.985] group"
        >
          <div className="flex items-center gap-3.5">
            {/* 3D Chrome Icon Tile (Squircle with gradient & emboss) */}
            <div
              className="chrome-glass-bezel w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 p-1"
              style={{
                boxShadow: '0 8px 24px -2px rgba(0, 212, 255, 0.55), inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.9)',
              }}
            >
              <FingerprintIcon className="w-11 h-11" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-black uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Finger Roulette
              </h2>
              <p className="text-xs text-cyan-200/80 font-medium">
                Hold fingers & select targets
              </p>
            </div>
          </div>

          {/* Row 1: Player Count Selection (IMG_0642: Sleek Rounded Pills) */}
          <div className="mt-3.5 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-400 flex items-center gap-1.5 drop-shadow-[0_0_6px_rgba(255,42,133,0.5)]">
                <Users className="w-3.5 h-3.5" /> PLAYERS
              </span>
              <span className="text-[10px] text-gray-300/90 font-medium">
                2 to 5 touches
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map((count) => {
                const isSelected = settings.minPlayers === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={(e) => handlePlayerCountSelect(e, count)}
                    className={`pill-count-btn ${
                      isSelected ? 'pill-count-selected-pink' : ''
                    }`}
                  >
                    <span>{count}P</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Target Count Selection (IMG_0642: Sleek Rounded Pills) */}
          <div className="mt-3 pt-2.5 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-400 flex items-center gap-1.5 drop-shadow-[0_0_6px_rgba(255,42,133,0.5)]">
                <Target className="w-3.5 h-3.5" /> TARGETS (LOSERS)
              </span>
              <span className="text-[10px] text-gray-300/90 font-medium">
                Max {maxTargets}
              </span>
            </div>
            {/* Target Count Pill-Bar - Sleek segmented capsule fitting full width */}
            <div className="w-full flex rounded-full overflow-hidden border border-white/80 divide-x divide-white/70 bg-black/40 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              {targetOptions.map((tgt) => {
                const isSelected = settings.targetCount === tgt;
                return (
                  <button
                    key={tgt}
                    type="button"
                    onClick={(e) => handleTargetCountSelect(e, tgt)}
                    className={`flex-1 min-w-0 h-8 flex items-center justify-center text-xs sm:text-sm font-black transition-all active:scale-[0.98] select-none ${
                      isSelected
                        ? 'bg-[#ff2a85] text-white shadow-[0_0_18px_rgba(255,42,133,0.85)]'
                        : 'bg-[#ff2a85]/20 text-pink-100 hover:bg-[#ff2a85]/35 hover:text-white'
                    }`}
                  >
                    <span>{tgt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Button: 3D Scanner Capsule with Scanning Laser Effect (Matches IMG_0657 pill style) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              SoundEngine.playButtonClick();
              onSelectRoulette();
            }}
            className="btn-play-roulette-scanner relative w-full h-11 sm:h-12 mt-3.5 rounded-full overflow-hidden flex items-center justify-center gap-2 px-5 cursor-pointer active:scale-[0.97] transition-all select-none group"
            style={{
              boxShadow:
                '0 8px 24px -2px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 240, 255, 0.45), 0 0 24px rgba(255, 42, 133, 0.4)',
            }}
          >
            {/* Holographic Biometric Scanner Background */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
              viewBox="0 0 400 48"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Horizontal flow: Electric Cyan -> Azure Blue -> Violet -> Neon Magenta */}
                <linearGradient id="scan-base-flow" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="25%" stopColor="#0077fe" />
                  <stop offset="55%" stopColor="#7928ca" />
                  <stop offset="82%" stopColor="#ff0080" />
                  <stop offset="100%" stopColor="#ff2a85" />
                </linearGradient>

                <linearGradient id="scan-grid-flow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#d946ef" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ff007f" stopOpacity="0.4" />
                </linearGradient>

                <filter id="scan-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" />
                </filter>
              </defs>

              {/* Base Gradient Fill */}
              <rect width="400" height="48" fill="url(#scan-base-flow)" rx="24" />

              {/* Concentric Biometric Radar Rings & Scanner Arcs */}
              <g opacity="0.45" stroke="url(#scan-grid-flow)" strokeWidth="1.2">
                <circle cx="200" cy="24" r="16" strokeDasharray="3 3" />
                <circle cx="200" cy="24" r="32" />
                <circle cx="200" cy="24" r="54" strokeDasharray="4 4" />
                <circle cx="200" cy="24" r="85" />
                <circle cx="200" cy="24" r="120" strokeDasharray="5 5" />
                <circle cx="200" cy="24" r="165" />
              </g>

              {/* Horizontal Holographic Scan Gridlines */}
              <g opacity="0.2" stroke="#ffffff" strokeWidth="0.8">
                <line x1="0" y1="8" x2="400" y2="8" strokeDasharray="4 6" />
                <line x1="0" y1="16" x2="400" y2="16" />
                <line x1="0" y1="24" x2="400" y2="24" strokeDasharray="6 6" />
                <line x1="0" y1="32" x2="400" y2="32" />
                <line x1="0" y1="40" x2="400" y2="40" strokeDasharray="4 6" />
              </g>

              {/* Ambient Biometric Target Crosshairs */}
              <g opacity="0.35" stroke="#ffffff" strokeWidth="1">
                <line x1="180" y1="24" x2="192" y2="24" />
                <line x1="208" y1="24" x2="220" y2="24" />
                <line x1="200" y1="6" x2="200" y2="16" />
                <line x1="200" y1="32" x2="200" y2="42" />
              </g>
            </svg>

            {/* Dynamic Sweeping Laser Scanner Beam (Top to Bottom and Back) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-10">
              <div className="animate-scanner-laser w-full h-3 flex flex-col items-center justify-center">
                {/* Holographic cyan flare tail */}
                <div className="w-full h-full bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent blur-[2px]" />
                {/* Crisp neon laser blade */}
                <div className="absolute w-full h-[1.5px] bg-white shadow-[0_0_8px_#ffffff,0_0_16px_#00f5ff,0_0_24px_#00d4ff]" />
                {/* Secondary bright horizontal flare highlight */}
                <div className="absolute w-full h-2 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
              </div>
            </div>

            {/* Top Gloss Specular Sheen (Curved glass highlight matching IMG_0657) */}
            <div
              className="absolute top-[2px] inset-x-3 h-[46%] rounded-[9999px_9999px_120px_120px] pointer-events-none z-15"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0) 100%)',
              }}
            />

            {/* Bottom Subtle Glass Specular Rim */}
            <div
              className="absolute bottom-[2px] inset-x-4 h-[25%] rounded-[120px_120px_9999px_9999px] pointer-events-none z-15"
              style={{
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 100%)',
              }}
            />

            {/* Translucent Glass Capsule Rim (Matching IMG_0657's lavender/white edge) */}
            <div className="absolute inset-0 rounded-full border-[1.5px] border-white/75 pointer-events-none z-20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1.5px_2px_rgba(0,0,0,0.35)]" />

            {/* Centered Button Content: Play Arrow + Bold White Text */}
            <div className="relative z-30 flex items-center justify-center gap-2">
              <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white text-white shrink-0 stroke-[1.2] ml-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
              <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                PLAY ROULETTE
              </span>
            </div>
          </button>
        </div>

        {/* Card 2: Spin the Bottle (Matches IMG_0613) */}
        <div
          onClick={() => {
            SoundEngine.playButtonClick();
            onSelectBottle();
          }}
          className="glass-panel relative p-4 cursor-pointer transition-all active:scale-[0.985] group"
        >
          <div className="flex items-center gap-3.5">
            {/* 3D Chrome Squircle Icon Tile (Exact match to IMG_0613) */}
            <div
              className="chrome-glass-bezel w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 p-1"
              style={{
                boxShadow: '0 8px 24px -2px rgba(255, 42, 133, 0.55), inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.9)',
              }}
            >
              <SpinBottleIcon className="w-11 h-11" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-black uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Spin the Bottle
              </h2>
              <p className="text-xs text-pink-200/80 font-medium">
                Physics swipe & flick
              </p>
            </div>
          </div>

          {/* Start Button: 3D Swirl Vortex Jelly Capsule (Exact match to IMG_0657) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              SoundEngine.playButtonClick();
              onSelectBottle();
            }}
            className="btn-spin-bottle-swirl relative w-full h-11 sm:h-12 mt-3.5 rounded-full overflow-hidden flex items-center justify-center gap-2 px-5 cursor-pointer active:scale-[0.97] transition-all select-none group"
            style={{
              boxShadow:
                '0 8px 24px -2px rgba(0, 0, 0, 0.6), 0 0 16px rgba(168, 85, 247, 0.4), 0 0 24px rgba(255, 106, 0, 0.35)',
            }}
          >
            {/* Swirling 3D Vortex Canvas matching IMG_0657 */}
            <SwirlVortexCanvas />

            {/* Top Gloss Specular Sheen (Curved glass highlight) */}
            <div
              className="absolute top-[2px] inset-x-3 h-[46%] rounded-[9999px_9999px_120px_120px] pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0) 100%)',
              }}
            />

            {/* Bottom Subtle Glass Specular Rim */}
            <div
              className="absolute bottom-[2px] inset-x-4 h-[25%] rounded-[120px_120px_9999px_9999px] pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 100%)',
              }}
            />

            {/* Translucent Glass Capsule Rim (Matching IMG_0657's lavender/white edge) */}
            <div className="absolute inset-0 rounded-full border-[1.5px] border-white/75 pointer-events-none z-20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1.5px_2px_rgba(0,0,0,0.35)]" />

            {/* Centered Button Content: Rotate Arrow + Bold White Text */}
            <div className="relative z-30 flex items-center justify-center gap-2">
              <RotateCw className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0 stroke-[2.4] drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]" />
              <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                SPIN BOTTLE
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

