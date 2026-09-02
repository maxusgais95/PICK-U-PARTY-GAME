/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Fingerprint, Users, Target, Palette, Play } from 'lucide-react';
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
      {/* Background Cyberpunk Arcade Neon Beams & Perspective Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Soft Ambient Neon Glows */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-80 h-44 bg-pink-500/20 blur-[90px] rounded-full" />
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-cyan-500/15 blur-[100px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600/20 blur-[110px] rounded-full" />

        {/* Perspective Corridor Beams (as in IMG_0612) */}
        <div className="absolute top-0 left-0 right-0 h-48 opacity-35 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.25),transparent_70%)]" />
      </div>

      {/* Header Branding (Subtitle above Title to prevent glow overlap) */}
      <div className="text-center my-auto flex flex-col items-center select-none pt-2">
        {/* Neon Pill Badge: "NEON ROULETTE" */}
        <div className="neon-pill-badge inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[11px] mb-1.5">
          NEON ROULETTE
        </div>

        {/* Top Subtitle Text */}
        <p className="neon-subtitle text-[11px] sm:text-xs tracking-wider mb-2 font-bold uppercase">
          Touch Decider & Bottle Spinner
        </p>

        {/* Dual-Glow Cyberpunk Neon Glass Tube Sign: "PICK'U PARTY" */}
        <h1
          data-text="PICK'U PARTY"
          className="neon-picku-title text-4xl sm:text-5xl my-0.5 select-none whitespace-nowrap"
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
          className="chrome-glass-bezel relative p-4 cursor-pointer transition-all active:scale-[0.98] group"
          style={{
            boxShadow: '0 12px 36px -10px rgba(0, 212, 255, 0.35), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.9)',
          }}
        >
          <div className="flex items-center gap-3.5">
            {/* 3D Chrome Icon Tile (Squircle) */}
            <div
              className="chrome-glass-bezel w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                boxShadow: '0 8px 24px -2px rgba(0, 212, 255, 0.55), inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.9)',
              }}
            >
              <Fingerprint className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_10px_#00d4ff] stroke-[2.2]" />
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

          {/* Row 1: Player Count Selection */}
          <div className="mt-3.5 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                <Users className="w-3 h-3" /> Players
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                2 to 5 touches
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[2, 3, 4, 5].map((count) => {
                const isSelected = settings.minPlayers === count;
                return (
                  <button
                    key={count}
                    onClick={(e) => handlePlayerCountSelect(e, count)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(0, 212, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#ffffff' : '#d1d5db',
                      borderColor: isSelected ? '#00d4ff' : 'rgba(255, 255, 255, 0.15)',
                      boxShadow: isSelected ? '0 0 12px rgba(0, 212, 255, 0.6), inset 0 0 8px rgba(0, 212, 255, 0.3)' : 'none',
                    }}
                    className="py-1.5 px-2 rounded-xl text-xs font-black transition-all border cursor-pointer active:scale-95 flex items-center justify-center backdrop-blur-md"
                  >
                    {count}P
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Target Count Selection */}
          <div className="mt-2 pt-2 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-400 flex items-center gap-1">
                <Target className="w-3 h-3" /> Targets (Losers)
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                Max {maxTargets}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {targetOptions.map((tgt) => {
                const isSelected = settings.targetCount === tgt;
                return (
                  <button
                    key={tgt}
                    onClick={(e) => handleTargetCountSelect(e, tgt)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(255, 42, 133, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#ffffff' : '#d1d5db',
                      borderColor: isSelected ? '#ff2a85' : 'rgba(255, 255, 255, 0.15)',
                      boxShadow: isSelected ? '0 0 12px rgba(255, 42, 133, 0.6), inset 0 0 8px rgba(255, 42, 133, 0.3)' : 'none',
                    }}
                    className="flex-1 py-1 px-1 rounded-xl text-xs font-black transition-all border cursor-pointer active:scale-95 flex items-center justify-center backdrop-blur-md"
                  >
                    {tgt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onSelectRoulette();
            }}
            style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 50%, #a855f7 100%)',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.6), inset 0 1px 1px rgba(255,255,255,0.7)',
            }}
            className="w-full mt-3 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest text-black flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-white/40"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Play Roulette ({settings.minPlayers}P • {settings.targetCount} Target{settings.targetCount > 1 ? 's' : ''})</span>
          </button>
        </div>

        {/* Card 2: Spin the Bottle (Matches IMG_0613) */}
        <div
          onClick={() => {
            SoundEngine.playButtonClick();
            onSelectBottle();
          }}
          className="chrome-glass-bezel relative p-4 cursor-pointer transition-all active:scale-[0.98] group"
          style={{
            boxShadow: '0 12px 36px -10px rgba(255, 42, 133, 0.35), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.9)',
          }}
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

          {/* Start Button */}
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onSelectBottle();
            }}
            style={{
              background: 'linear-gradient(135deg, #ff8c42 0%, #ff2a85 50%, #cc1166 100%)',
              boxShadow: '0 0 20px rgba(255, 42, 133, 0.6), inset 0 1px 1px rgba(255,255,255,0.7)',
            }}
            className="w-full mt-3 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-white/40"
          >
            <SpinBottleIcon className="w-5 h-5" glow={false} />
            <span>Spin Bottle</span>
          </button>
        </div>
      </div>

      {/* Bottom Quick Controls & Theme Pill */}
      <div className="chrome-glass-bezel w-full max-w-sm flex items-center justify-center p-1.5 rounded-2xl shadow-xl mt-auto">
        <button
          onClick={cycleTheme}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all text-xs font-bold text-white cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5 text-pink-400" />
          <span>Palette: {currentTheme.name}</span>
        </button>
      </div>
    </div>
  );
};

