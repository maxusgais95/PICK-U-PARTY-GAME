/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface ParticleDef {
  id: number;
  left: number; // percentage
  top: number; // percentage
  size: number; // px
  color: string;
  delay: number; // sec
  duration: number; // sec
  type: 'star' | 'dot' | 'diamond';
}

// Curated atmospheric particles distributed around the PICK'U PARTY title banner
const AMBIENT_PARTICLES: ParticleDef[] = [
  { id: 1, left: 2, top: 18, size: 14, color: '#38bdf8', delay: 0, duration: 3.2, type: 'star' },
  { id: 2, left: 12, top: -14, size: 9, color: '#ec4899', delay: 0.8, duration: 3.6, type: 'diamond' },
  { id: 3, left: 22, top: 76, size: 6, color: '#fbbf24', delay: 1.4, duration: 2.8, type: 'dot' },
  { id: 4, left: 32, top: -20, size: 13, color: '#818cf8', delay: 0.4, duration: 3.4, type: 'star' },
  { id: 5, left: 44, top: 82, size: 10, color: '#f97316', delay: 1.9, duration: 3.0, type: 'diamond' },
  { id: 6, left: 55, top: -12, size: 7, color: '#34d399', delay: 1.1, duration: 3.5, type: 'dot' },
  { id: 7, left: 66, top: 78, size: 14, color: '#c084fc', delay: 0.2, duration: 3.8, type: 'star' },
  { id: 8, left: 78, top: -18, size: 10, color: '#f43f5e', delay: 1.7, duration: 3.1, type: 'diamond' },
  { id: 9, left: 87, top: 72, size: 7, color: '#38bdf8', delay: 0.9, duration: 2.9, type: 'dot' },
  { id: 10, left: 96, top: 12, size: 15, color: '#fbbf24', delay: 0.5, duration: 3.3, type: 'star' },
  { id: 11, left: 6, top: 78, size: 8, color: '#ec4899', delay: 2.2, duration: 3.7, type: 'diamond' },
  { id: 12, left: 92, top: -16, size: 12, color: '#818cf8', delay: 1.3, duration: 3.2, type: 'star' },
  { id: 13, left: 50, top: -22, size: 8, color: '#fbbf24', delay: 2.5, duration: 3.9, type: 'dot' },
  { id: 14, left: 38, top: 72, size: 11, color: '#38bdf8', delay: 1.6, duration: 3.3, type: 'star' },
];

interface BurstParticle {
  id: number;
  dx: number;
  dy: number;
  color: string;
  size: number;
}

export const TitlePartyParticles: React.FC<{
  burstTrigger?: number;
}> = ({ burstTrigger = 0 }) => {
  const [bursts, setBursts] = useState<BurstParticle[]>([]);
  const [isBursting, setIsBursting] = useState(false);

  useEffect(() => {
    if (burstTrigger === 0) return;
    const colors = ['#38bdf8', '#ec4899', '#fbbf24', '#f97316', '#a855f7', '#34d399', '#ffffff'];
    const newBursts: BurstParticle[] = Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 45 + Math.random() * 55;
      return {
        id: Date.now() + i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        color: colors[i % colors.length],
        size: 5 + Math.random() * 5,
      };
    });

    setBursts(newBursts);
    setIsBursting(true);

    const timer = setTimeout(() => {
      setIsBursting(false);
      setBursts([]);
    }, 750);

    return () => clearTimeout(timer);
  }, [burstTrigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-10 select-none">
      {/* 1. Ambient Floating & Twinkling Neon Particles */}
      {AMBIENT_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `${p.type === 'dot' ? 'partyParticleTwinkle' : 'partyParticleFloat'} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.type === 'star' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill={p.color}
              className="drop-shadow-[0_0_8px_currentColor]"
              style={{ color: p.color }}
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          )}

          {p.type === 'diamond' && (
            <div
              className="rotate-45"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 10px ${p.color}, 0 0 16px ${p.color}aa`,
                borderRadius: '1px',
              }}
            />
          )}

          {p.type === 'dot' && (
            <div
              className="rounded-full"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}, 0 0 14px ${p.color}`,
              }}
            />
          )}
        </div>
      ))}

      {/* 2. Interactive Burst Particles on Tap */}
      {bursts.map((b) => (
        <div
          key={b.id}
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none transition-all duration-700 ease-out"
          style={{
            transform: isBursting
              ? `translate(calc(-50% + ${b.dx}px), calc(-50% + ${b.dy}px)) scale(0.3)`
              : 'translate(-50%, -50%) scale(1)',
            opacity: isBursting ? 0 : 1,
            width: `${b.size}px`,
            height: `${b.size}px`,
            backgroundColor: b.color,
            boxShadow: `0 0 12px ${b.color}`,
          }}
        />
      ))}
    </div>
  );
};
