/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Target, Palette, Play, RotateCw } from 'lucide-react';
import { FingerprintIcon } from './FingerprintIcon';
import { SpinBottleIcon } from './SpinBottleIcon';
import { AppSettings, ThemeId } from '../types';
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

  const cycleTheme = () => {
    SoundEngine.playButtonClick();
    const themesList: ThemeId[] = ['cyber-neon', 'synthwave'];
    const nextIdx = (themesList.indexOf(settings.theme) + 1) % themesList.length;
    onUpdateSettings({ theme: themesList[nextIdx] });
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
            <div className="grid grid-cols-4 gap-2">
              {targetOptions.map((tgt) => {
                const isSelected = settings.targetCount === tgt;
                return (
                  <button
                    key={tgt}
                    type="button"
                    onClick={(e) => handleTargetCountSelect(e, tgt)}
                    className={`pill-count-btn ${
                      isSelected ? 'pill-count-selected-pink' : ''
                    }`}
                  >
                    <span>{tgt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Button: 3D Gloss Jelly Capsule (IMG_0637) */}
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onSelectRoulette();
            }}
            className="gloss-jelly-btn btn-play-roulette mt-3.5"
          >
            <Play className="w-4 h-4 fill-black text-black shrink-0 relative z-10 ml-0.5" />
            <span className="relative z-10 text-xs sm:text-sm font-black tracking-wider text-black">
              PLAY ROULETTE
            </span>
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

          {/* Start Button: 3D Gloss Jelly Capsule (IMG_0636) */}
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onSelectBottle();
            }}
            className="gloss-jelly-btn btn-spin-bottle mt-3.5"
          >
            <RotateCw className="w-4 h-4 text-white shrink-0 stroke-[2.8] relative z-10" />
            <span className="relative z-10 text-xs sm:text-sm font-black tracking-wider text-white">
              SPIN BOTTLE
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Quick Controls & Theme Pill (IMG_0638) */}
      <div className="w-full max-w-sm flex items-center justify-center mt-auto pt-2">
        <button
          onClick={cycleTheme}
          className="glass-palette-pill w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white cursor-pointer active:scale-95 transition-all"
        >
          <Palette className="w-4 h-4 text-pink-400 shrink-0" />
          <span className="tracking-wide">Palette: {currentTheme.name}</span>
        </button>
      </div>
    </div>
  );
};

