/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppSettings, AppStats, CustomBottleSprite, ScreenView, TouchPlayer, ThemeId } from './types';
import { THEMES } from './lib/themes';
import { getSettings, saveSettings, getStats, getAllCustomSprites, saveCustomSprite } from './lib/db';
import { SoundEngine } from './lib/audio';
import { processSpriteImage } from './lib/imageProcessing';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Header } from './components/Header';
import { LandingHub } from './components/LandingHub';
import { FingerRoulette } from './components/FingerRoulette';
import { BottleSpin } from './components/BottleSpin';
import { SettingsModal } from './components/SettingsModal';
import { PartyBackground } from './components/PartyBackground';
import { FingerGameBackground } from './components/FingerGameBackground';
import { SpinBottleBackground } from './components/SpinBottleBackground';

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('hub');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    minPlayers: 2,
    targetCount: 1,
    countdownSeconds: 5,
    bottleStyle: 'classic_bottle',
    selectedCustomSpriteId: null,
    bottleFriction: 0.992,
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

      // Auto-upgrade any existing custom sprites to ensure zero-clipping transparent safety padding
      const upgradedSprites = await Promise.all(
        loadedSprites.map(async (sprite) => {
          if (!sprite.originalDataUrl) {
            sprite.originalDataUrl = sprite.dataUrl;
          }
          if ((sprite as any).cleanEdgeVersion !== 2) {
            try {
              sprite.dataUrl = await processSpriteImage(
                sprite.originalDataUrl,
                sprite.blendMode || 'normal',
                sprite.rotationOffset || 0
              );
              (sprite as any).cleanEdgeVersion = 2;
              await saveCustomSprite(sprite);
            } catch (err) {
              console.error('Error upgrading sprite:', err);
            }
          }
          return sprite;
        })
      );
      setCustomSprites(upgradedSprites);

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

  // Quick theme cycle for header action & instant switching
  const handleCycleTheme = useCallback(() => {
    const themeList: ThemeId[] = ['cyber-neon', 'synthwave', 'solar-flare', 'midnight-aurora'];
    const currentIndex = themeList.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themeList.length;
    const nextTheme = themeList[nextIndex];
    handleUpdateSettings({ theme: nextTheme });
    SoundEngine.playButtonClick();
  }, [settings.theme, handleUpdateSettings]);

  return (
    <main
      className="relative w-screen h-screen overflow-hidden select-none touch-none font-sans transition-colors duration-500"
      style={{ backgroundColor: currentTheme.bgBase }}
    >
      {/* 1. Main Hub Background: Static Nightclub Atmosphere + 60FPS Upward DJ Lasers & Blurred Bottom Half */}
      {currentView === 'hub' && <PartyBackground theme={settings.theme} />}

      {/* 2. Finger Roulette Gameplay Background: Subtle Tile Line Grid, Holographic Biometric Target Rings & Scanning Blade */}
      {currentView === 'roulette' && (
        <FingerGameBackground
          theme={settings.theme}
          activeFingersCount={currentTouches.length}
          touches={currentTouches}
        />
      )}

      {/* 3. Spin Bottle Gameplay Background: Top-Down Glass Table with Club Vibes Moving Light Beam Reflections */}
      {currentView === 'bottle' && (
        <SpinBottleBackground
          theme={settings.theme}
          isSpinning={isBottleSpinning}
          spinSpeed={bottleSpinSpeed}
        />
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
        onCycleTheme={handleCycleTheme}
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
