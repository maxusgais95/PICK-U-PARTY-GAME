/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BottleBuiltinStyle, CustomBottleSprite, ThemeColors } from '../types';

interface BottleSpriteProps {
  styleType: BottleBuiltinStyle | 'custom';
  customSprite: CustomBottleSprite | null;
  themeColors: ThemeColors;
  className?: string;
}

export const BottleSpriteRenderer: React.FC<BottleSpriteProps> = ({
  styleType,
  customSprite,
  themeColors,
  className,
}) => {
  // If custom uploaded sprite exists and selected
  if (styleType === 'custom' && customSprite && customSprite.dataUrl) {
    const customClass = className || 'w-80 h-[36rem] sm:w-[26rem] sm:h-[42rem] max-w-[90vw] max-h-[72vh]';
    return (
      <div className={`relative flex items-center justify-center ${customClass}`}>
        <img
          src={customSprite.dataUrl}
          alt={customSprite.name || 'Custom Bottle'}
          className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_0_40px_rgba(0,240,255,0.85)]"
          style={{
            transform: `rotate(${customSprite.rotationOffset || 0}deg)`,
          }}
        />
      </div>
    );
  }

  const builtinClass = className || 'w-48 h-96 sm:w-60 sm:h-[28rem] max-w-[85vw] max-h-[65vh]';

  // 1. Classic Neon Bottle
  if (styleType === 'classic_bottle') {
    return (
      <svg
        viewBox="0 0 100 240"
        className={`${builtinClass} pointer-events-none filter drop-shadow-[0_0_30px_${themeColors.primary}]`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="classic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={themeColors.primary} />
            <stop offset="60%" stopColor={themeColors.secondary} />
            <stop offset="100%" stopColor={themeColors.accent} />
          </linearGradient>
          <linearGradient id="glow-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Bottle Cap */}
        <rect x="42" y="2" width="16" height="8" rx="2" fill="#ffffff" />
        {/* Bottle Neck Ring */}
        <ellipse cx="50" cy="14" rx="10" ry="3" fill="url(#classic-grad)" stroke="#ffffff" strokeWidth="1" />
        
        {/* Main Body Path */}
        <path
          d="M38 12 L38 45 C38 65, 14 85, 14 130 L14 220 C14 234, 26 238, 50 238 C74 238, 86 234, 86 220 L86 130 C86 85, 62 65, 62 45 L62 12 Z"
          fill="url(#classic-grad)"
          stroke="#ffffff"
          strokeWidth="2.5"
        />

        {/* Inner Liquid Wave */}
        <path
          d="M18 135 C30 145, 70 125, 82 135 L82 220 C82 230, 72 234, 50 234 C28 234, 18 230, 18 220 Z"
          fill="rgba(255, 255, 255, 0.2)"
        />

        {/* Gloss Refraction Stripe */}
        <path
          d="M26 120 L26 215 C26 222, 28 225, 34 225 L34 115 Z"
          fill="url(#glow-highlight)"
        />

        {/* Directional Pointing Arrow / Cap Glow */}
        <polygon points="50,0 44,8 56,8" fill="#ffffff" />
      </svg>
    );
  }

  // 2. Laser Pointer Dart
  if (styleType === 'laser_dart') {
    return (
      <svg
        viewBox="0 0 100 240"
        className={`${builtinClass} pointer-events-none filter drop-shadow-[0_0_30px_${themeColors.primary}]`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="dart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor={themeColors.primary} />
            <stop offset="100%" stopColor={themeColors.accent} />
          </linearGradient>
        </defs>

        {/* Sharp Needle Tip */}
        <polygon points="50,2 40,30 60,30" fill="#ffffff" stroke={themeColors.primary} strokeWidth="1.5" />
        
        {/* Main Sleek Dart Shaft */}
        <polygon points="40,30 50,20 60,30 65,160 35,160" fill="url(#dart-grad)" stroke="#ffffff" strokeWidth="2" />
        
        {/* Core Laser Energy Conduit */}
        <line x1="50" y1="30" x2="50" y2="155" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

        {/* Stabilizer Aerodynamic Wings */}
        <polygon points="35,140 10,210 38,195" fill={themeColors.secondary} stroke="#ffffff" strokeWidth="2" />
        <polygon points="65,140 90,210 62,195" fill={themeColors.secondary} stroke="#ffffff" strokeWidth="2" />
        <polygon points="44,160 50,236 56,160" fill={themeColors.primary} stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    );
  }

  // 3. Retro Soda Bottle (Cleaned, no label)
  return (
    <svg
      viewBox="0 0 100 240"
      className={`${builtinClass} pointer-events-none filter drop-shadow-[0_0_30px_${themeColors.primary}]`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="soda-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={themeColors.primary} />
          <stop offset="50%" stopColor={themeColors.accent} />
          <stop offset="100%" stopColor={themeColors.secondary} />
        </linearGradient>
      </defs>

      {/* Crown Cap */}
      <polygon points="40,2 60,2 64,10 36,10" fill="#ffffff" stroke={themeColors.primary} strokeWidth="1" />
      
      {/* Contoured Retro Body */}
      <path
        d="M40 10 L40 40 C40 60, 20 75, 20 110 C20 135, 30 145, 22 170 C16 190, 18 215, 22 225 C24 235, 34 238, 50 238 C66 238, 76 235, 78 225 C82 215, 84 190, 78 170 C70 145, 80 135, 80 110 C80 75, 60 60, 60 40 L60 10 Z"
        fill="url(#soda-grad)"
        stroke="#ffffff"
        strokeWidth="2.5"
      />

      {/* Gloss Refraction Stripe */}
      <path
        d="M26 80 C24 100, 24 130, 28 150"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Refraction Accent 2 */}
      <path
        d="M74 90 C76 110, 76 135, 72 155"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
