/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppSettings, CustomBottleSprite } from '../types';
import { THEMES } from '../lib/themes';
import { BottlePhysicsController } from '../lib/bottlePhysics';
import { BottleSpriteRenderer } from './BottleSprites';
import { SoundEngine } from '../lib/audio';
import { recordGameEvent } from '../lib/db';

interface BottleSpinProps {
  settings: AppSettings;
  customSprite: CustomBottleSprite | null;
  onSpinStateChange?: (isSpinning: boolean, angularVelocity: number) => void;
}

export const BottleSpin: React.FC<BottleSpinProps> = ({
  settings,
  customSprite,
  onSpinStateChange,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES['cyber-neon'];
  const [angle, setAngle] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResultCooldown, setIsResultCooldown] = useState<boolean>(false);
  const [isPointingBounce, setIsPointingBounce] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const physicsRef = useRef<BottlePhysicsController>(
    new BottlePhysicsController(Math.random() * 360, settings.bottleFriction || 0.992)
  );
  const animFrameRef = useRef<number | null>(null);
  const cooldownTimerRef = useRef<number | null>(null);
  const onSpinStateChangeRef = useRef(onSpinStateChange);
  onSpinStateChangeRef.current = onSpinStateChange;

  // Setup tick and settle callbacks
  useEffect(() => {
    const physics = physicsRef.current;
    physics.setFriction(settings.bottleFriction || 0.992);

    physics.onTick = (vel: number) => {
      SoundEngine.playBottleTick(vel);
    };

    physics.onSettle = (_finalAngle: number) => {
      setIsSpinning(false);
      setIsResultCooldown(true);
      setIsPointingBounce(true);
      if (onSpinStateChangeRef.current) {
        onSpinStateChangeRef.current(false, 0);
      }
      SoundEngine.playBottleSettle();
      recordGameEvent('bottle');

      // Trigger landing shockwave
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        window.dispatchEvent(
          new CustomEvent('app-shockwave', {
            detail: { x: cx, y: cy, color: currentTheme.primary, maxRadius: 380 },
          })
        );
      }

      // Delay 1.5s after stopping before allowing next spin
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = window.setTimeout(() => {
        setIsResultCooldown(false);
      }, 1500);
    };
  }, [settings.bottleFriction, currentTheme.primary]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  // Main 60fps animation loop for physics
  useEffect(() => {
    const loop = () => {
      const physics = physicsRef.current;
      if (physics.isSpinning) {
        physics.updatePhysics();
        setAngle(physics.angle);
        if (onSpinStateChangeRef.current) {
          onSpinStateChangeRef.current(true, physics.angularVelocity);
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Center coordinate helper
  const getCenterCoords = useCallback(() => {
    if (!containerRef.current) return { cx: window.innerWidth / 2, cy: window.innerHeight / 2 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
    };
  }, []);

  // Handle Touch Start (Drag) - disabled while spinning or during result cooldown
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSpinning || isResultCooldown || physicsRef.current.isSpinning) return;
    if (e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    const { cx, cy } = getCenterCoords();

    setIsPointingBounce(false);
    setIsDragging(true);
    physicsRef.current.startDrag(t.clientX, t.clientY, cx, cy);
    setAngle(physicsRef.current.angle);
  };

  // Handle Touch Move (Drag tracking)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isSpinning || isResultCooldown || e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    const { cx, cy } = getCenterCoords();

    physicsRef.current.updateDrag(t.clientX, t.clientY, cx, cy);
    setAngle(physicsRef.current.angle);
  };

  // Handle Touch End (Flick release)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setIsDragging(false);

    const flickVelocity = physicsRef.current.endDrag();
    if (physicsRef.current.isSpinning) {
      setIsPointingBounce(false);
      setIsSpinning(true);
      if (onSpinStateChangeRef.current) {
        onSpinStateChangeRef.current(true, flickVelocity);
      }
      SoundEngine.playBottleFlick(flickVelocity);
    }
  };

  // Mouse / Pointer fallback handlers for desktop preview
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (isSpinning || isResultCooldown || physicsRef.current.isSpinning) return;
    const { cx, cy } = getCenterCoords();
    setIsPointingBounce(false);
    setIsDragging(true);
    physicsRef.current.startDrag(e.clientX, e.clientY, cx, cy);
    setAngle(physicsRef.current.angle);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isSpinning || isResultCooldown || e.pointerType === 'touch') return;
    const { cx, cy } = getCenterCoords();
    physicsRef.current.updateDrag(e.clientX, e.clientY, cx, cy);
    setAngle(physicsRef.current.angle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || e.pointerType === 'touch') return;
    setIsDragging(false);
    const flickVel = physicsRef.current.endDrag();
    if (physicsRef.current.isSpinning) {
      setIsPointingBounce(false);
      setIsSpinning(true);
      if (onSpinStateChangeRef.current) {
        onSpinStateChangeRef.current(true, flickVel);
      }
      SoundEngine.playBottleFlick(flickVel);
    }
  };

  const isLocked = isSpinning || isResultCooldown;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full h-full select-none touch-none overflow-hidden flex items-center justify-center ${
        isLocked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Ambient Neon Pink Spotlight Aura */}
      <div
        className="absolute w-[32rem] h-[32rem] sm:w-[42rem] sm:h-[42rem] rounded-full blur-3xl pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(255, 42, 133, 0.8) 0%, rgba(255, 0, 128, 0.35) 45%, transparent 75%)',
        }}
      />

      {/* Rotating Large Bottle Container - Raw 60fps transform without CSS transition lag */}
      <div
        className="relative flex items-center justify-center origin-center select-none"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: '50% 50%',
          willChange: 'transform',
        }}
      >
        {/* Subtle pointing bounce effect along the bottle's pointing axis at result phase */}
        <div className={`relative flex items-center justify-center ${isPointingBounce ? 'animate-bottle-point' : ''}`}>
          <BottleSpriteRenderer
            styleType={settings.bottleStyle}
            customSprite={customSprite}
            themeColors={currentTheme}
            className={
              settings.bottleStyle === 'custom'
                ? 'w-[min(90vw,85vh)] h-[min(90vw,85vh)] max-w-[740px] max-h-[880px]'
                : 'h-[min(90vw,85vh)] w-auto max-h-[820px] max-w-[min(90vw,480px)]'
            }
          />
        </div>
      </div>
    </div>
  );
};


