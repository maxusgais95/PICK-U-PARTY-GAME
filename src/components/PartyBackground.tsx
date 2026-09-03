/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import partyBgImage from '../assets/images/party_club_bg_1788354783297.jpg';
import { ThemeId } from '../types';
import { THEMES } from '../lib/themes';

interface PartyBackgroundProps {
  className?: string;
  theme?: ThemeId;
}

export const PartyBackground: React.FC<PartyBackgroundProps> = ({
  className = '',
  theme = 'cyber-neon',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentTheme = THEMES[theme] || THEMES['cyber-neon'];
  const themeRef = useRef(currentTheme);
  themeRef.current = currentTheme;

  // 60FPS Upward Concert Laser, Spotlight & DJ Stage Light Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Upward Sweeping Concert Lasers configuration
    const laserConfigs = [
      { speed: 1.4, baseAngle: -Math.PI / 2 - 0.55, spread: 0.42, colorIdx: 0, width: 3.2 },
      { speed: 1.4, baseAngle: -Math.PI / 2 + 0.55, spread: 0.42, colorIdx: 1, width: 3.2 },
      { speed: 2.2, baseAngle: -Math.PI / 2 - 0.28, spread: 0.48, colorIdx: 2, width: 4.0 },
      { speed: 2.2, baseAngle: -Math.PI / 2 + 0.28, spread: 0.48, colorIdx: 3, width: 4.0 },
      { speed: 1.0, baseAngle: -Math.PI / 2, spread: 0.65, colorIdx: 4, width: 3.8 },
      { speed: 2.8, baseAngle: -Math.PI / 2 - 0.75, spread: 0.32, colorIdx: 5, width: 2.8 },
      { speed: 2.8, baseAngle: -Math.PI / 2 + 0.75, spread: 0.32, colorIdx: 6, width: 2.8 },
    ];

    // Floating party dust particles (drifting upwards through beams)
    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * (width || 400),
      y: Math.random() * ((height || 800) * 0.65),
      vx: (Math.random() - 0.5) * 0.7,
      vy: -Math.random() * 0.8 - 0.3, // upward drift
      size: Math.random() * 2.5 + 1.2,
      colorIdx: Math.floor(Math.random() * 5),
      alpha: Math.random() * 0.65 + 0.25,
      phase: Math.random() * Math.PI * 2,
    }));

    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      const activeTheme = themeRef.current || THEMES['cyber-neon'];

      // DJ Booth origin position in the party image
      const djX = width * 0.5;
      const djY = height * 0.42;

      // 128 BPM EDM bass pulse (2.133 beats/sec)
      const beat = Math.pow(0.5 + 0.5 * Math.cos(elapsed * Math.PI * 2 * 2.133), 3);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 1. Dynamic Upward Stage Spotlight Cones swinging across ceiling/lasers
      const numCones = 3;
      const coneColors = [activeTheme.primary, activeTheme.secondary, activeTheme.accent];

      for (let i = 0; i < numCones; i++) {
        const spotAngle = -Math.PI / 2 + Math.sin(elapsed * 1.3 + i * 1.9) * 0.52 + (i - 1) * 0.32;
        const coneLength = height * 0.75;
        const targetX = djX + Math.cos(spotAngle) * coneLength;
        const targetY = djY + Math.sin(spotAngle) * coneLength;
        const baseColor = coneColors[i % coneColors.length];

        const grad = ctx.createRadialGradient(targetX, targetY, 10, targetX, targetY, 200);
        grad.addColorStop(0, `${baseColor}aa`);
        grad.addColorStop(0.5, `${baseColor}44`);
        grad.addColorStop(1, `${baseColor}00`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(djX, djY);
        ctx.lineTo(targetX - 100, targetY);
        ctx.lineTo(targetX + 100, targetY);
        ctx.closePath();
        ctx.fill();
      }

      // 2. Sweeping High-Power Concert Lasers (Pointing UPWARD)
      laserConfigs.forEach((cfg, idx) => {
        const angle = cfg.baseAngle + Math.sin(elapsed * cfg.speed + idx * 0.85) * cfg.spread;
        const length = height * 0.95;
        const endX = djX + Math.cos(angle) * length;
        const endY = djY + Math.sin(angle) * length;

        const laserColor = activeTheme.laserColors[cfg.colorIdx % activeTheme.laserColors.length] || activeTheme.primary;

        // Laser Bloom Glow
        ctx.beginPath();
        ctx.moveTo(djX, djY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `${laserColor}bb`;
        ctx.lineWidth = cfg.width * (2.6 + 1.4 * beat);
        ctx.stroke();

        // White-hot intense core beam
        ctx.beginPath();
        ctx.moveTo(djX, djY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = cfg.width * 0.75;
        ctx.stroke();
      });

      // 3. DJ Stage Halo Strobe Pulsing Rings at origin
      const ringRadius = 26 + 18 * beat;
      ctx.beginPath();
      ctx.ellipse(djX, djY, ringRadius * 1.5, ringRadius * 0.75, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `${activeTheme.secondary}${Math.round((0.45 + 0.45 * beat) * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      const ringRadius2 = ringRadius * 1.65;
      ctx.beginPath();
      ctx.ellipse(djX, djY, ringRadius2 * 1.5, ringRadius2 * 0.75, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `${activeTheme.primary}${Math.round((0.35 + 0.35 * beat) * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 4. Floating Disco Sparkles / Upward drifting dust
      const particleColors = [
        activeTheme.primary,
        activeTheme.secondary,
        activeTheme.accent,
        '#ffffff',
        activeTheme.laserColors[0] || activeTheme.primary,
      ];

      particles.forEach((p) => {
        p.x = (p.x + p.vx + width) % width;
        p.y = p.y + p.vy;
        if (p.y < 0) p.y = height * 0.65; // Recycle back to mid-ground

        const pAlpha = p.alpha * (0.6 + 0.4 * Math.sin(elapsed * 3.5 + p.phase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.9 + 0.35 * beat), 0, Math.PI * 2);
        ctx.fillStyle = particleColors[p.colorIdx % particleColors.length];
        ctx.globalAlpha = pAlpha;
        ctx.fill();
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-500 ${className}`}
      style={{ backgroundColor: currentTheme.bgBase }}
    >
      {/* 1. Base Static Nightclub Party Image with dynamic theme tint */}
      <img
        src={partyBgImage}
        alt="Nightclub Dance Floor"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 scale-100 opacity-90 transition-all duration-500"
        style={{
          filter: 'contrast(1.12) brightness(0.92) saturate(1.22)',
        }}
      />

      {/* Dynamic Theme Color Atmosphere Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-5 opacity-20 mix-blend-color transition-all duration-500"
        style={{ background: currentTheme.bgGrad }}
      />

      {/* 2. 60FPS Upward Concert Laser, Strobe & DJ Spotlight Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 3. Dim & Blur the Bottom Half (Glassmorphic Blur + Vignette for card readability) */}
      <div
        className="absolute inset-x-0 bottom-0 top-[42%] pointer-events-none z-20 backdrop-blur-[10px] transition-all duration-500"
        style={{
          background: `linear-gradient(to bottom, ${currentTheme.bgBase}26 0%, ${currentTheme.bgBase}bf 30%, ${currentTheme.bgBase}f2 100%)`,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 100%)',
        }}
      />

      {/* 4. Top subtle vignette for header contrast */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none z-20" />
    </div>
  );
};
