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
    const customClass = className || 'w-[min(90vw,85vh)] h-[min(90vw,85vh)] max-w-[740px] max-h-[880px]';
    const blendMode = customSprite.blendMode || 'normal';
    const validBlend = (blendMode === 'screen' || blendMode === 'color-dodge') ? blendMode : 'normal';
    
    return (
      <div
        className={`relative flex items-center justify-center overflow-visible ${customClass}`}
        style={{ overflow: 'visible' }}
      >
        {/* Dynamic Theme Outer Glow Aura radiating behind the bottle (Smooth vector radial gradient - Zero clipping) */}
        <div
          className="absolute -inset-14 sm:-inset-20 pointer-events-none -z-10 rounded-full transition-all duration-500 overflow-visible"
          style={{
            background: `radial-gradient(ellipse 52% 52% at 50% 50%, ${themeColors.secondary}73 0%, ${themeColors.primary}47 28%, ${themeColors.secondary}1a 48%, transparent 68%)`,
            mixBlendMode: 'screen',
          }}
        />

        <img
          src={customSprite.dataUrl}
          alt={customSprite.name || 'Custom Bottle'}
          className="w-full h-full object-contain pointer-events-none scale-110 sm:scale-120 md:scale-130 transition-all duration-500"
          style={{
            transform: (!customSprite.originalDataUrl && customSprite.rotationOffset)
              ? `rotate(${customSprite.rotationOffset}deg)`
              : undefined,
            mixBlendMode: validBlend !== 'normal' ? (validBlend as any) : undefined,
            filter: `drop-shadow(0 0 6px ${themeColors.secondary}cc) drop-shadow(0 0 14px ${themeColors.primary}77)`,
            overflow: 'visible',
          }}
        />
      </div>
    );
  }

  const builtinClass = className || 'h-[min(90vw,85vh)] w-auto max-h-[820px] max-w-[min(90vw,480px)] scale-105 sm:scale-115';

  // Common Dynamic Outer Glow Halo for built-in bottles matching active theme (Smooth vector radial gradient - Zero clipping)
  const BuiltinOuterGlow = () => (
    <div
      className="absolute -inset-14 sm:-inset-20 pointer-events-none -z-10 rounded-full transition-all duration-500 overflow-visible"
      style={{
        background: `radial-gradient(ellipse 52% 52% at 50% 50%, ${themeColors.secondary}73 0%, ${themeColors.primary}47 28%, ${themeColors.secondary}1a 48%, transparent 68%)`,
        mixBlendMode: 'screen',
      }}
    />
  );

  // 1. Classic Neon Bottle
  if (styleType === 'classic_bottle') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-visible ${builtinClass}`}
        style={{ overflow: 'visible' }}
      >
        <BuiltinOuterGlow />
        <svg
          viewBox="0 0 100 240"
          className="w-full h-full pointer-events-none transition-all duration-500 overflow-visible"
          style={{
            overflow: 'visible',
            filter: `drop-shadow(0 0 8px ${themeColors.secondary}cc) drop-shadow(0 0 16px ${themeColors.primary}77)`,
          }}
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
      </div>
    );
  }

  // 2. Retro Soda Bottle (Cleaned, no label)
  return (
    <div
      className={`relative flex items-center justify-center overflow-visible ${builtinClass}`}
      style={{ overflow: 'visible' }}
    >
      <BuiltinOuterGlow />
      <svg
        viewBox="0 0 100 240"
        className="w-full h-full pointer-events-none transition-all duration-500 overflow-visible"
        style={{
          overflow: 'visible',
          filter: `drop-shadow(0 0 8px ${themeColors.secondary}cc) drop-shadow(0 0 16px ${themeColors.primary}77)`,
        }}
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
    </div>
  );
};
