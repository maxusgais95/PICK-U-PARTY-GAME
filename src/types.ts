/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenView = 'hub' | 'roulette' | 'bottle' | 'settings';

export type ThemeId = 'cyber-neon' | 'synthwave';

export type BottleBuiltinStyle = 'classic_bottle' | 'laser_dart' | 'retro_soda';

export interface CustomBottleSprite {
  id: string;
  name: string;
  dataUrl: string; // Stored in IndexedDB
  createdAt: number;
  rotationOffset: number; // 0, 90, 180, 270 degrees
}

export interface TouchPlayer {
  id: number | string;
  x: number;
  y: number;
  colorIndex: number;
  isTarget?: boolean;
  playerLabel: string;
}

export interface ThemeColors {
  id: ThemeId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bgGrad: string;
  playerPalettes: {
    gradient: string;
    glow: string;
    text: string;
    border: string;
    solid: string;
  }[];
}

export interface AppSettings {
  // Game Play
  minPlayers: number; // 2..5
  targetCount: number; // 1..(minPlayers - 1)
  countdownSeconds: number; // 3, 5, 8, 10
  
  // Bottle
  bottleStyle: BottleBuiltinStyle | 'custom';
  selectedCustomSpriteId: string | null;
  bottleFriction: number; // 0.985 standard
  
  // Theme & Appearance
  theme: ThemeId;
  
  // Audio & Haptics
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  hapticsEnabled: boolean;
}

export interface AppStats {
  totalRouletteRounds: number;
  totalBottleSpins: number;
  lastPlayedAt: number;
}
