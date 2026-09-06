/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import neonHyperGridVideo from '../assets/videos/Neon Hyper Grid Background Animated.mov';
import { ThemeId, TouchPlayer } from '../types';
import { THEMES } from '../lib/themes';

interface FingerGameBackgroundProps {
  theme: ThemeId;
  active?: boolean;
  activeFingersCount?: number;
  touches?: TouchPlayer[];
}

export const FingerGameBackground: React.FC<FingerGameBackgroundProps> = ({
  theme,
  active = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentTheme = THEMES[theme] || THEMES['cyber-neon'];

  // Ensure video auto-plays and auto-resumes reliably across mobile browsers, and pauses when inactive
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    if (active) {
      const tryPlay = () => {
        video.play().catch(() => {
          const onInteract = () => {
            video.play().catch(() => {});
            window.removeEventListener('touchstart', onInteract);
            window.removeEventListener('click', onInteract);
          };
          window.addEventListener('touchstart', onInteract, { once: true });
          window.addEventListener('click', onInteract, { once: true });
        });
      };
      tryPlay();
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ backgroundColor: currentTheme.bgBase }}
    >
      {/* 1. Animated Video Background: Neon Hyper Grid Background Animated.mov */}
      <video
        ref={videoRef}
        src={neonHyperGridVideo}
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
        style={{
          filter: 'contrast(1.08) brightness(1.05) saturate(1.2)',
        }}
      />

      {/* 2. Light Theme Ambient Glow (Subtle blending without dimming the neon grid) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-15 mix-blend-screen transition-colors duration-500"
        style={{ background: currentTheme.bgGrad }}
      />

      {/* 3. Top and Bottom Dim Darken Edge Vignettes */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none z-[2]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none z-[2]" />
    </div>
  );
};
