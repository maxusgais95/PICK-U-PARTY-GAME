/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Target, Users, RotateCcw } from 'lucide-react';
import { AppSettings, TouchPlayer } from '../types';
import { THEMES } from '../lib/themes';
import { SoundEngine } from '../lib/audio';
import { recordGameEvent } from '../lib/db';

interface FingerRouletteProps {
  settings: AppSettings;
  onTouchUpdate: (touches: TouchPlayer[], showTeamLines: boolean) => void;
  onUpdateSettings?: (settings: Partial<AppSettings>) => void;
}

export const FingerRoulette: React.FC<FingerRouletteProps> = ({
  settings,
  onTouchUpdate,
  onUpdateSettings,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES['cyber-neon'];
  
  // Game state: 'waiting' | 'countdown' | 'resolved'
  const [gameState, setGameState] = useState<'waiting' | 'countdown' | 'resolved'>('waiting');
  const [isResultLocked, setIsResultLocked] = useState<boolean>(false);
  const [countdownNum, setCountdownNum] = useState<number>(settings.countdownSeconds);
  const [touches, setTouches] = useState<Map<string | number, TouchPlayer>>(new Map());

  const touchesRef = useRef<Map<string | number, TouchPlayer>>(new Map());
  const countdownIntervalRef = useRef<number | null>(null);
  const resultUnlockTimerRef = useRef<number | null>(null);
  const resolvedAtRef = useRef<number>(0);
  const gameStateRef = useRef<'waiting' | 'countdown' | 'resolved'>('waiting');
  gameStateRef.current = gameState;

  // Available color indices pool (0..7)
  const availableColorsRef = useRef<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);

  // Stable ref for parent callback
  const onTouchUpdateRef = useRef(onTouchUpdate);
  onTouchUpdateRef.current = onTouchUpdate;

  // Sync touch update to parent canvas
  const notifyTouches = useCallback((touchMap: Map<string | number, TouchPlayer>) => {
    onTouchUpdateRef.current(Array.from(touchMap.values()), false);
  }, []);

  // Clean up on unmount ONLY
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (resultUnlockTimerRef.current) clearTimeout(resultUnlockTimerRef.current);
      onTouchUpdateRef.current([], false);
    };
  }, []);

  // Reset round
  const resetRound = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (resultUnlockTimerRef.current) {
      clearTimeout(resultUnlockTimerRef.current);
      resultUnlockTimerRef.current = null;
    }
    resolvedAtRef.current = 0;
    setIsResultLocked(false);
    gameStateRef.current = 'waiting';
    setGameState('waiting');
    touchesRef.current.clear();
    setTouches(new Map());
    availableColorsRef.current = [0, 1, 2, 3, 4, 5, 6, 7];
    notifyTouches(new Map());
  }, [notifyTouches]);

  // Resolve outcome (pick targetCount losers)
  const resolveRound = useCallback(() => {
    gameStateRef.current = 'resolved';
    setGameState('resolved');
    setIsResultLocked(true);
    resolvedAtRef.current = Date.now();

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (resultUnlockTimerRef.current) {
      clearTimeout(resultUnlockTimerRef.current);
    }
    // 2-second lockout before tapping can restart the game
    resultUnlockTimerRef.current = window.setTimeout(() => {
      setIsResultLocked(false);
    }, 2000);

    const touchList: TouchPlayer[] = Array.from(touchesRef.current.values());
    if (touchList.length < settings.minPlayers) {
      resetRound();
      return;
    }

    // Shuffle touches randomly
    const shuffled: TouchPlayer[] = [...touchList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const updatedMap = new Map<string | number, TouchPlayer>();
    // Maximum targets allowed is player count - 1
    const targetCount = Math.max(1, Math.min(settings.targetCount, shuffled.length - 1));

    shuffled.forEach((touch, index) => {
      const isTarget = index < targetCount;
      const updated = { ...touch, isTarget };
      updatedMap.set(touch.id, updated);

      if (isTarget) {
        // Trigger canvas shockwave at loser position
        window.dispatchEvent(
          new CustomEvent('app-shockwave', {
            detail: { x: touch.x, y: touch.y, color: '#ff0055', maxRadius: 400 },
          })
        );
      }
    });

    SoundEngine.playTargetImpact();
    recordGameEvent('roulette');
    touchesRef.current = updatedMap;
    setTouches(new Map(updatedMap));
    notifyTouches(updatedMap);
  }, [settings.minPlayers, settings.targetCount, notifyTouches, resetRound]);

  // Check if countdown should start or cancel
  const checkCountdown = useCallback(() => {
    if (gameStateRef.current === 'resolved') return;

    const count = touchesRef.current.size;
    if (count >= settings.minPlayers) {
      if (gameStateRef.current !== 'countdown') {
        gameStateRef.current = 'countdown';
        setGameState('countdown');
        setCountdownNum(settings.countdownSeconds);
        SoundEngine.playCountdownTick(settings.countdownSeconds, settings.countdownSeconds);

        let currentVal = settings.countdownSeconds;
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        countdownIntervalRef.current = window.setInterval(() => {
          currentVal -= 1;
          if (currentVal > 0) {
            setCountdownNum(currentVal);
            SoundEngine.playCountdownTick(currentVal, settings.countdownSeconds);
          } else {
            resolveRound();
          }
        }, 1000);
      }
    } else {
      if (gameStateRef.current === 'countdown') {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        gameStateRef.current = 'waiting';
        setGameState('waiting');
      }
    }
  }, [settings.minPlayers, settings.countdownSeconds, resolveRound]);

  // Handle Touch Start
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, [data-interactive="true"]')) {
      return;
    }

    e.preventDefault();
    if (gameStateRef.current === 'resolved') {
      // 2s result lockout: prevent accidental reset until players see the results
      if (Date.now() - resolvedAtRef.current < 2000) {
        return;
      }
      resetRound();
      return;
    }

    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (touchesRef.current.size >= 10) continue;
      if (touchesRef.current.has(t.identifier)) continue;

      if (availableColorsRef.current.length === 0) {
        availableColorsRef.current = [0, 1, 2, 3, 4, 5, 6, 7];
      }
      const colorIdx = availableColorsRef.current.shift()!;
      const playerObj: TouchPlayer = {
        id: t.identifier,
        x: t.clientX,
        y: t.clientY,
        colorIndex: colorIdx,
        playerLabel: `P${colorIdx + 1}`,
      };

      touchesRef.current.set(t.identifier, playerObj);
      SoundEngine.playTouchDown(colorIdx);
    }

    setTouches(new Map(touchesRef.current));
    notifyTouches(touchesRef.current);
    checkCountdown();
  };

  // Handle Touch Move
  const handleTouchMove = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, [data-interactive="true"]')) {
      return;
    }

    e.preventDefault();
    if (gameStateRef.current === 'resolved') return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const existing = touchesRef.current.get(t.identifier);
      if (existing) {
        existing.x = t.clientX;
        existing.y = t.clientY;
      }
    }

    setTouches(new Map(touchesRef.current));
    notifyTouches(touchesRef.current);
  };

  // Handle Touch End / Cancel
  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, [data-interactive="true"]')) {
      return;
    }

    e.preventDefault();
    if (gameStateRef.current === 'resolved') return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const existing = touchesRef.current.get(t.identifier);
      if (existing) {
        availableColorsRef.current.push(existing.colorIndex);
        availableColorsRef.current.sort((a, b) => a - b);
        touchesRef.current.delete(t.identifier);
        SoundEngine.playTouchUp();
      }
    }

    setTouches(new Map(touchesRef.current));
    notifyTouches(touchesRef.current);
    checkCountdown();
  };

  // Desktop Mouse Click Simulation fallback
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, [data-interactive="true"]')) {
      return;
    }

    if (gameStateRef.current === 'resolved') {
      // 2s result lockout: prevent accidental reset until players see the results
      if (Date.now() - resolvedAtRef.current < 2000) {
        return;
      }
      resetRound();
      return;
    }

    const id = `mouse-${Date.now()}`;
    if (availableColorsRef.current.length === 0) {
      availableColorsRef.current = [0, 1, 2, 3, 4, 5, 6, 7];
    }
    const colorIdx = availableColorsRef.current.shift()!;
    const playerObj: TouchPlayer = {
      id,
      x: e.clientX,
      y: e.clientY,
      colorIndex: colorIdx,
      playerLabel: `P${colorIdx + 1}`,
    };

    touchesRef.current.set(id, playerObj);
    SoundEngine.playTouchDown(colorIdx);
    setTouches(new Map(touchesRef.current));
    notifyTouches(touchesRef.current);
    checkCountdown();
  };

  const touchArray: TouchPlayer[] = Array.from(touches.values());
  const maxPossibleTargets = Math.max(1, settings.minPlayers - 1);
  const targetOptions = Array.from({ length: maxPossibleTargets }, (_, i) => i + 1);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onPointerDown={handlePointerDown}
      className="relative w-full h-full select-none touch-none overflow-hidden"
    >
      {/* Top Floating Controls: Player Count & Target Count in 2 distinct rows */}
      {onUpdateSettings && (
        <div
          className="absolute top-[max(4.2rem,calc(env(safe-area-inset-top)+3.2rem))] left-1/2 -translate-x-1/2 z-30 flex flex-col gap-1.5 p-2 rounded-2xl bg-gray-950/85 backdrop-blur-2xl border border-white/15 shadow-2xl"
          data-interactive="true"
        >
          {/* Row 1: Players */}
          <div className="flex items-center justify-between gap-2.5">
            <span
              className="text-[10px] font-black uppercase tracking-wider pl-1 flex items-center gap-1"
              style={{ color: currentTheme.primary }}
            >
              <Users className="w-3 h-3" /> Players:
            </span>
            <div className="flex items-center gap-1">
              {[2, 3, 4, 5].map((cnt) => {
                const isSelected = settings.minPlayers === cnt;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      SoundEngine.playButtonClick();
                      const newTarget = Math.min(settings.targetCount, cnt - 1);
                      onUpdateSettings({ minPlayers: cnt, targetCount: newTarget });
                      resetRound();
                    }}
                    style={{
                      backgroundColor: isSelected ? currentTheme.primary : 'rgba(255, 255, 255, 0.06)',
                      color: isSelected ? '#030712' : '#9ca3af',
                      borderColor: isSelected ? currentTheme.primary : 'rgba(255, 255, 255, 0.12)',
                      boxShadow: isSelected ? `0 0 10px ${currentTheme.primary}88` : 'none',
                    }}
                    className="w-7 h-7 rounded-xl text-[11px] font-black transition-all border flex items-center justify-center active:scale-90 cursor-pointer"
                  >
                    {cnt}P
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Target (Losers) */}
          <div className="flex items-center justify-between gap-2.5 pt-1.5 border-t border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 pl-1 flex items-center gap-1">
              <Target className="w-3 h-3 text-pink-400" /> Target:
            </span>
            <div className="flex items-center gap-1">
              {targetOptions.map((tgt) => {
                const isSelected = settings.targetCount === tgt;
                return (
                  <button
                    key={tgt}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      SoundEngine.playButtonClick();
                      onUpdateSettings({ targetCount: tgt });
                      resetRound();
                    }}
                    style={{
                      backgroundColor: isSelected ? '#ff0055' : 'rgba(255, 255, 255, 0.06)',
                      color: isSelected ? '#ffffff' : '#9ca3af',
                      borderColor: isSelected ? '#ff0055' : 'rgba(255, 255, 255, 0.12)',
                      boxShadow: isSelected ? '0 0 10px rgba(255, 0, 85, 0.6)' : 'none',
                    }}
                    className="w-7 h-7 rounded-xl text-[11px] font-black transition-all border flex items-center justify-center active:scale-90 cursor-pointer"
                  >
                    {tgt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Giant Background Countdown Number */}
      {gameState === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <span
            className="text-[15rem] font-black tracking-tighter text-white/10 select-none animate-ping"
            style={{ animationDuration: '1s' }}
          >
            {countdownNum}
          </span>
        </div>
      )}

      {/* Interactive Touch Player Rings */}
      {touchArray.map((player) => {
        const palette = currentTheme.playerPalettes[player.colorIndex % currentTheme.playerPalettes.length];
        
        let ringBg = palette.gradient;
        let glowShadow = `0 0 35px ${palette.glow}, inset 0 0 15px ${palette.glow}`;
        let badgeContent: React.ReactNode = player.playerLabel;
        let badgeBg = 'bg-black/60 text-white';
        let isLoserAnimate = false;
        let isSafeDim = false;

        if (gameState === 'resolved') {
          if (player.isTarget) {
            isLoserAnimate = true;
            ringBg = 'linear-gradient(135deg, #ff0055, #ff3b00)';
            glowShadow = '0 0 80px #ff0055, 0 0 40px #ff0033, inset 0 0 30px #ffffff';
            badgeContent = 'LOSER';
            badgeBg = 'bg-white text-black font-black text-sm px-3 py-1 shadow-2xl';
          } else {
            isSafeDim = true;
          }
        }

        return (
          <div
            key={player.id}
            className={`absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-center transition-opacity duration-300 ${
              isSafeDim ? 'opacity-20 scale-75' : 'opacity-100 scale-100'
            }`}
            style={{
              left: `${player.x}px`,
              top: `${player.y}px`,
            }}
          >
            {/* Loser Hyper Pulsing Triple Shock Rings */}
            {isLoserAnimate && (
              <>
                <div className="absolute -inset-6 rounded-full border-4 border-pink-500 animate-hyperRing1 pointer-events-none" />
                <div className="absolute -inset-10 rounded-full border-4 border-red-500 animate-hyperRing2 pointer-events-none" />
                <div className="absolute -inset-14 rounded-full border-2 border-white animate-hyperRing3 pointer-events-none" />
              </>
            )}

            {/* Spinning Outer Dashed Ring */}
            <div
              className={`absolute -inset-2.5 rounded-full border-2 border-dashed ${
                isLoserAnimate ? 'border-red-500 animate-spin' : 'border-white/60 animate-spin'
              }`}
              style={{ animationDuration: isLoserAnimate ? '0.8s' : '4s' }}
            />

            {/* Glowing Inner Gradient Ring with Hyper Pulse for Loser */}
            <div
              className={`absolute inset-0 rounded-full flex items-center justify-center p-1.5 border-2 border-white shadow-2xl ${
                isLoserAnimate ? 'animate-hyperPulse border-4 border-yellow-300' : ''
              }`}
              style={{
                background: ringBg,
                boxShadow: glowShadow,
              }}
            >
              {/* Center Player Badge */}
              <div
                className={`rounded-full flex items-center justify-center font-black tracking-wider uppercase backdrop-blur-md shadow-md ${badgeBg}`}
              >
                {badgeContent}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

