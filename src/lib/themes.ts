/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeColors, ThemeId } from '../types';

export const THEMES: Record<ThemeId, ThemeColors> = {
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    primary: '#00f0ff',
    secondary: '#ff2a85',
    accent: '#ffaa00',
    bgGrad: 'radial-gradient(ellipse at 50% 30%, #0d122e 0%, #060818 60%, #03040c 100%)',
    playerPalettes: [
      { gradient: 'linear-gradient(135deg, #00f0ff, #0070f3)', glow: 'rgba(0, 240, 255, 0.85)', text: '#030712', border: '#00f0ff', solid: '#00f0ff' },
      { gradient: 'linear-gradient(135deg, #ff2a85, #ff0055)', glow: 'rgba(255, 42, 133, 0.85)', text: '#ffffff', border: '#ff2a85', solid: '#ff2a85' },
      { gradient: 'linear-gradient(135deg, #ffaa00, #ff5500)', glow: 'rgba(255, 170, 0, 0.85)', text: '#030712', border: '#ffaa00', solid: '#ffaa00' },
      { gradient: 'linear-gradient(135deg, #a855f7, #6366f1)', glow: 'rgba(168, 85, 247, 0.85)', text: '#ffffff', border: '#a855f7', solid: '#a855f7' },
      { gradient: 'linear-gradient(135deg, #00f59b, #00b4d8)', glow: 'rgba(0, 245, 155, 0.85)', text: '#030712', border: '#00f59b', solid: '#00f59b' },
      { gradient: 'linear-gradient(135deg, #ff6363, #ff1f71)', glow: 'rgba(255, 99, 99, 0.85)', text: '#ffffff', border: '#ff6363', solid: '#ff6363' },
      { gradient: 'linear-gradient(135deg, #ffd000, #ff8800)', glow: 'rgba(255, 208, 0, 0.85)', text: '#030712', border: '#ffd000', solid: '#ffd000' },
      { gradient: 'linear-gradient(135deg, #38bdf8, #818cf8)', glow: 'rgba(56, 189, 248, 0.85)', text: '#030712', border: '#38bdf8', solid: '#38bdf8' },
    ],
  },
  'synthwave': {
    id: 'synthwave',
    name: 'Neon Sunset',
    primary: '#ff2a85',
    secondary: '#ff9e00',
    accent: '#8b5cf6',
    bgGrad: 'radial-gradient(ellipse at 50% 30%, #1e0b2b 0%, #0d0417 60%, #04010a 100%)',
    playerPalettes: [
      { gradient: 'linear-gradient(135deg, #ff007f, #ff4081)', glow: 'rgba(255, 0, 127, 0.85)', text: '#ffffff', border: '#ff007f', solid: '#ff007f' },
      { gradient: 'linear-gradient(135deg, #ff9e00, #ff5400)', glow: 'rgba(255, 158, 0, 0.85)', text: '#030712', border: '#ff9e00', solid: '#ff9e00' },
      { gradient: 'linear-gradient(135deg, #9d4edd, #5a189a)', glow: 'rgba(157, 78, 221, 0.85)', text: '#ffffff', border: '#9d4edd', solid: '#9d4edd' },
      { gradient: 'linear-gradient(135deg, #ff4d6d, #c9184a)', glow: 'rgba(255, 77, 109, 0.85)', text: '#ffffff', border: '#ff4d6d', solid: '#ff4d6d' },
      { gradient: 'linear-gradient(135deg, #c77dff, #7b2cbf)', glow: 'rgba(199, 125, 255, 0.85)', text: '#ffffff', border: '#c77dff', solid: '#c77dff' },
      { gradient: 'linear-gradient(135deg, #ffb703, #fb8500)', glow: 'rgba(255, 183, 3, 0.85)', text: '#030712', border: '#ffb703', solid: '#ffb703' },
      { gradient: 'linear-gradient(135deg, #48cae4, #0077b6)', glow: 'rgba(72, 202, 228, 0.85)', text: '#030712', border: '#48cae4', solid: '#48cae4' },
      { gradient: 'linear-gradient(135deg, #ff0054, #9e0059)', glow: 'rgba(255, 0, 84, 0.85)', text: '#ffffff', border: '#ff0054', solid: '#ff0054' },
    ],
  },
};
