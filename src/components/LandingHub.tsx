/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NeonFingerTouchIcon, NeonTiltedBottleIcon, NeonBombIcon } from './NeonHubIcons';
import pickuPartyLogo from '../assets/images/PICK\'U PARTY Logo.png';
import { AppSettings } from '../types';
import { SoundEngine, Haptics } from '../lib/audio';

interface LandingHubProps {
  settings: AppSettings;
  onSelectRoulette: () => void;
  onSelectBottle: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenVersionNotes?: () => void;
}

export const LandingHub: React.FC<LandingHubProps> = ({
  onSelectRoulette,
  onSelectBottle,
  onOpenVersionNotes,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTitleClick = () => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
  };

  const handleKaboomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    setToastMessage("💣 KABOOM Mode Coming Soon! Get ready...");
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto flex flex-col justify-between items-center px-4 pt-[max(3.8rem,calc(env(safe-area-inset-top)+3rem))] pb-[max(0.6rem,env(safe-area-inset-bottom))] overflow-hidden select-none">
      {/* Toast notification for Kaboom or actions */}
      {toastMessage && (
        <div className="fixed top-16 z-50 animate-bounce">
          <div className="px-4 py-2 rounded-full bg-orange-600/90 text-white font-bold text-xs shadow-[0_0_20px_rgba(249,115,22,0.6)] border border-orange-300/80 backdrop-blur-md flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Title: PICK'U PARTY (Bigger, animated moving spectrum gradient, pulse animation, glowing particles) */}
      <div className="text-center mt-[1.5vh] sm:mt-[2.2vh] mb-0 flex flex-col items-center select-none relative z-20 shrink-0 w-full px-2">
        <div
          onClick={handleTitleClick}
          className="relative w-full max-w-[370px] sm:max-w-[430px] md:max-w-[470px] flex items-center justify-center cursor-pointer group"
          title="Tap to party!"
        >
          {/* Ambient Pink-Purple Outer Backlight Glow */}
          <div
            className="absolute -inset-x-8 -inset-y-4 rounded-full pointer-events-none -z-10 blur-2xl opacity-85 animate-pulse"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.55) 0%, rgba(168, 85, 247, 0.45) 48%, rgba(147, 51, 234, 0) 78%)',
            }}
          />

          {/* Official PICK'U PARTY Logo with party pulse and glow */}
          <img
            src={pickuPartyLogo}
            alt="PICK'U PARTY"
            className="w-full h-auto max-h-[72px] sm:max-h-[85px] md:max-h-[96px] object-contain select-none pointer-events-none animate-title-pulse"
            style={{
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Subtitle (Bigger subject matching reference image) */}
        <p className="text-[13px] sm:text-[15px] md:text-base font-semibold tracking-normal sm:tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] mt-1 mb-0 select-none">
          Select game mode and have fun with your friends
        </p>
      </div>

      {/* Main Game Mode Cards (Compact height, full width, sitting slightly above version notes) */}
      <div className="w-full max-w-sm flex flex-col gap-2 sm:gap-2.5 mt-auto mb-2 flex-initial justify-end">
        {/* Card 1: FINGER ROULETTE */}
        <div
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            onSelectRoulette();
          }}
          className="relative rounded-[20px] sm:rounded-[22px] py-2.5 px-3.5 sm:py-3 sm:px-4 bg-black/40 backdrop-blur-md border-[1.5px] border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.4),inset_0_0_10px_rgba(6,182,212,0.12)] flex flex-col items-center text-center cursor-pointer active:scale-[0.985] transition-all group hover:border-cyan-300"
        >
          {/* Glowing Touch Icon */}
          <NeonFingerTouchIcon className="w-10 h-7 sm:w-11 sm:h-7.5 mb-0.5" />

          {/* Heading */}
          <h2 className="text-xs sm:text-sm font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0 mb-0 leading-tight">
            FINGER ROULETTE
          </h2>

          {/* Subtitle */}
          <p className="text-[10px] sm:text-[11px] text-white/75 font-normal mt-0.5 mb-1.5 sm:mb-2 leading-tight">
            Place your finger and have fun
          </p>

          {/* 3D Glossy Capsule Button: PLAY PICKER */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              SoundEngine.playButtonClick();
              Haptics.buttonClick();
              onSelectRoulette();
            }}
            className="relative w-full h-8 sm:h-8.5 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-[0_3px_16px_rgba(6,182,212,0.45)] active:scale-[0.98] transition-all border-[1.2px] border-white/70 select-none group"
            style={{
              background: 'linear-gradient(90deg, #00e5ff 0%, #06b6d4 30%, #a855f7 70%, #d946ef 100%)',
            }}
          >
            {/* Top Gloss Specular Sheen */}
            <div
              className="absolute top-[1px] inset-x-2 h-[45%] rounded-[9999px_9999px_80px_80px] pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.22) 55%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
            {/* Bottom Glass Rim */}
            <div
              className="absolute bottom-[1px] inset-x-3 h-[25%] rounded-[80px_80px_9999px_9999px] pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
            {/* Button Label */}
            <span className="relative z-20 text-[10px] sm:text-[11px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              PLAY PICKER
            </span>
          </button>
        </div>

        {/* Card 2: SPIN THE BOTTLE */}
        <div
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            onSelectBottle();
          }}
          className="relative rounded-[20px] sm:rounded-[22px] py-2.5 px-3.5 sm:py-3 sm:px-4 bg-black/40 backdrop-blur-md border-[1.5px] border-pink-500 shadow-[0_0_18px_rgba(236,72,153,0.4),inset_0_0_10px_rgba(236,72,153,0.12)] flex flex-col items-center text-center cursor-pointer active:scale-[0.985] transition-all group hover:border-pink-400"
        >
          {/* Glowing Tilted Bottle with Sparkles */}
          <NeonTiltedBottleIcon className="w-10 h-7 sm:w-11 sm:h-7.5 mb-0.5" />

          {/* Heading */}
          <h2 className="text-xs sm:text-sm font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0 mb-0 leading-tight">
            SPIN THE BOTTLE
          </h2>

          {/* Subtitle */}
          <p className="text-[10px] sm:text-[11px] text-white/75 font-normal mt-0.5 mb-1.5 sm:mb-2 leading-tight">
            Flick or tap to spin the bottle
          </p>

          {/* 3D Glossy Capsule Button: SPIN BOTTLE */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              SoundEngine.playButtonClick();
              Haptics.buttonClick();
              onSelectBottle();
            }}
            className="relative w-full h-8 sm:h-8.5 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-[0_3px_16px_rgba(236,72,153,0.45)] active:scale-[0.98] transition-all border-[1.2px] border-white/70 select-none group"
            style={{
              background: 'linear-gradient(90deg, #9333ea 0%, #a855f7 35%, #ec4899 75%, #f43f5e 100%)',
            }}
          >
            {/* Top Gloss Specular Sheen */}
            <div
              className="absolute top-[1px] inset-x-2 h-[45%] rounded-[9999px_9999px_80px_80px] pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.22) 55%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
            {/* Bottom Glass Rim */}
            <div
              className="absolute bottom-[1px] inset-x-3 h-[25%] rounded-[80px_80px_9999px_9999px] pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
            {/* Button Label */}
            <span className="relative z-20 text-[10px] sm:text-[11px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              SPIN BOTTLE
            </span>
          </button>
        </div>

        {/* Card 3: KABOOM */}
        <div
          onClick={handleKaboomClick}
          className="relative rounded-[20px] sm:rounded-[22px] py-2.5 px-3.5 sm:py-3 sm:px-4 bg-black/40 backdrop-blur-md border-[1.5px] border-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.4),inset_0_0_10px_rgba(249,115,22,0.12)] flex flex-col items-center text-center cursor-pointer active:scale-[0.985] transition-all group hover:border-orange-400"
        >
          {/* Glowing Bomb Icon with Lit Spark Fuse */}
          <NeonBombIcon className="w-10 h-7 sm:w-11 sm:h-7.5 mb-0.5" />

          {/* Heading */}
          <h2 className="text-xs sm:text-sm font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0 mb-0 leading-tight">
            KABOOM
          </h2>

          {/* Subtitle */}
          <p className="text-[10px] sm:text-[11px] text-white/75 font-normal mt-0.5 mb-1.5 sm:mb-2 leading-tight">
            Avoid the bomb and don't get exploded
          </p>

          {/* 3D Glossy Capsule Button: LET'S GO */}
          <button
            type="button"
            onClick={handleKaboomClick}
            className="relative w-full h-8 sm:h-8.5 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-[0_3px_16px_rgba(249,115,22,0.45)] active:scale-[0.98] transition-all border-[1.2px] border-white/70 select-none group"
            style={{
              background: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ff5500 100%)',
            }}
          >
            {/* Top Gloss Specular Sheen */}
            <div
              className="absolute top-[1px] inset-x-2 h-[45%] rounded-[9999px_9999px_80px_80px] pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.22) 55%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
            {/* Bottom Glass Rim */}
            <div
              className="absolute bottom-[1px] inset-x-3 h-[25%] rounded-[80px_80px_9999px_9999px] pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
            {/* Button Label */}
            <span className="relative z-20 text-[10px] sm:text-[11px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              LET'S GO
            </span>
          </button>
        </div>
      </div>

      {/* Footer Version Notes: v1.2.085 */}
      <div className="shrink-0 mt-1 mb-0.5 text-center select-none">
        <button
          type="button"
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            if (onOpenVersionNotes) onOpenVersionNotes();
          }}
          className="text-[10px] sm:text-[11px] text-gray-400/80 hover:text-white transition-colors tracking-wide cursor-pointer focus:outline-none py-1"
        >
          Version notes: v1.2.085
        </button>
      </div>
    </div>
  );
};
