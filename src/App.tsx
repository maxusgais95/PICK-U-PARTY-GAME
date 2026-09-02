/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppSettings, AppStats, CustomBottleSprite, ScreenView, TouchPlayer } from './types';
import { THEMES } from './lib/themes';
import { getSettings, saveSettings, getStats, getAllCustomSprites } from './lib/db';
import { SoundEngine } from './lib/audio';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Header } from './components/Header';
import { LandingHub } from './components/LandingHub';
import { FingerRoulette } from './components/FingerRoulette';
import { BottleSpin } from './components/BottleSpin';
import { SettingsModal } from './components/SettingsModal';
import { PartyBackground } from './components/PartyBackground';

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('hub');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    minPlayers: 2,
    targetCount: 1,
    countdownSeconds: 5,
    bottleStyle: 'classic_bottle',
    selectedCustomSpriteId: null,
    bottleFriction: 0.985,
    theme: 'cyber-neon',
    soundEnabled: true,
    soundVolume: 0.8,
    hapticsEnabled: true,
  });

  const [stats, setStats] = useState<AppStats>({
    totalRouletteRounds: 0,
    totalBottleSpins: 0,
    lastPlayedAt: Date.now(),
  });

  const [customSprites, setCustomSprites] = useState<CustomBottleSprite[]>([]);
  const [currentTouches, setCurrentTouches] = useState<TouchPlayer[]>([]);
  const [showTeamLines, setShowTeamLines] = useState<boolean>(false);
  const [isBottleSpinning, setIsBottleSpinning] = useState<boolean>(false);
  const [bottleSpinSpeed, setBottleSpinSpeed] = useState<number>(0);

  // Load from IndexedDB on startup
  useEffect(() => {
    async function loadDB() {
      const loadedSettings = await getSettings();
      const loadedStats = await getStats();
      const loadedSprites = await getAllCustomSprites();
      setSettings(loadedSettings);
      setStats(loadedStats);
      setCustomSprites(loadedSprites);
      SoundEngine.updateConfig(
        loadedSettings.soundEnabled,
        loadedSettings.soundVolume,
        loadedSettings.hapticsEnabled
      );
    }
    loadDB();
  }, []);

  const refreshSprites = useCallback(async () => {
    const sprites = await getAllCustomSprites();
    setCustomSprites(sprites);
  }, []);

  const refreshStats = useCallback(async () => {
    const loadedStats = await getStats();
    setStats(loadedStats);
  }, []);

  const handleUpdateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      SoundEngine.updateConfig(
        updated.soundEnabled,
        updated.soundVolume,
        updated.hapticsEnabled
      );
      return updated;
    });
  }, []);

  const handleToggleSound = useCallback(() => {
    handleUpdateSettings({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, handleUpdateSettings]);

  const handleToggleHaptics = useCallback(() => {
    handleUpdateSettings({ hapticsEnabled: !settings.hapticsEnabled });
  }, [settings.hapticsEnabled, handleUpdateSettings]);

  const handleTouchUpdate = useCallback((touches: TouchPlayer[], showTeams: boolean) => {
    setCurrentTouches(touches);
    setShowTeamLines(showTeams);
  }, []);

  const activeCustomSprite = useMemo(() => {
    if (settings.bottleStyle !== 'custom' || !settings.selectedCustomSpriteId) return null;
    return customSprites.find((s) => s.id === settings.selectedCustomSpriteId) || null;
  }, [settings.bottleStyle, settings.selectedCustomSpriteId, customSprites]);

  const currentTheme = THEMES[settings.theme] || THEMES['cyber-neon'];

  return (
    <main
      className="relative w-screen h-screen overflow-hidden select-none touch-none font-sans bg-[#080516]"
    >
      {/* 1. Main Hub Background: Static Nightclub Atmosphere + 60FPS Upward DJ Lasers & Blurred Bottom Half */}
      {currentView === 'hub' && <PartyBackground />}

      {/* 2. Active Gameplay Backgrounds (Finger Roulette & Spin Bottle only) */}
      {currentView !== 'hub' && (
        <>
          {/* Dynamic Moving Animated Neon Gradient */}
          <div className="absolute inset-0 pointer-events-none z-0 moving-gradient-layer opacity-75" />

          {/* Sweeping Dynamic Laser Beams */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div
              className="absolute -top-1/4 -left-1/4 w-[150%] h-[90px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-md animate-laser-sweep1 pointer-events-none"
              style={{ mixBlendMode: 'screen' }}
            />
            <div
              className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[80px] bg-gradient-to-r from-transparent via-pink-500 to-transparent blur-md animate-laser-sweep2 pointer-events-none"
              style={{ mixBlendMode: 'screen' }}
            />
            <div
              className="absolute w-96 h-96 rounded-full blur-3xl opacity-35 pointer-events-none -top-10 -left-10 animate-orb-drift1"
              style={{
                backgroundColor: currentTheme.primary,
                mixBlendMode: 'screen',
              }}
            />
            <div
              className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none -bottom-10 -right-10 animate-orb-drift2"
              style={{
                backgroundColor: currentTheme.accent,
                mixBlendMode: 'screen',
              }}
            />
          </div>

          {/* Subtle Cyber Digital Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </>
      )}

      {/* 3. 60FPS Background Particle & Shockwave Canvas */}
      <BackgroundCanvas
        theme={settings.theme}
        touches={currentTouches}
        showTeamLines={showTeamLines}
        isBottleSpinning={isBottleSpinning}
        bottleSpinSpeed={bottleSpinSpeed}
      />

      {/* Persistent Mobile Top Action Header */}
      <Header
        currentView={currentView}
        settings={settings}
        onNavigate={(view) => {
          setCurrentTouches([]);
          setShowTeamLines(false);
          setIsBottleSpinning(false);
          setBottleSpinSpeed(0);
          setCurrentView(view);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSound={handleToggleSound}
        onToggleHaptics={handleToggleHaptics}
      />

      {/* Screen Views */}
      <div className="relative w-full h-full z-20">
        {currentView === 'hub' && (
          <LandingHub
            settings={settings}
            onSelectRoulette={() => setCurrentView('roulette')}
            onSelectBottle={() => setCurrentView('bottle')}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentView === 'roulette' && (
          <FingerRoulette
            settings={settings}
            onTouchUpdate={handleTouchUpdate}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentView === 'bottle' && (
          <BottleSpin
            settings={settings}
            customSprite={activeCustomSprite}
            onSpinStateChange={(spinning, speed) => {
              setIsBottleSpinning(spinning);
              setBottleSpinSpeed(speed);
            }}
          />
        )}
      </div>

      {/* Settings & Custom Sprite Upload Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        stats={stats}
        customSprites={customSprites}
        onClose={() => {
          refreshStats();
          setIsSettingsOpen(false);
        }}
        onUpdateSettings={handleUpdateSettings}
        onRefreshSprites={refreshSprites}
        onRefreshStats={refreshStats}
      />
    </main>
  );
}
