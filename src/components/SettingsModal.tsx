/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  Trash2,
  RotateCw,
  Sliders,
  BarChart2,
  Volume2,
  Check,
  Palette,
  Smartphone,
  Zap,
  Sparkles,
} from 'lucide-react';
import { SpinBottleIcon } from './SpinBottleIcon';
import {
  AppSettings,
  AppStats,
  BottleBuiltinStyle,
  BottleBlendMode,
  CustomBottleSprite,
} from '../types';
import { THEMES } from '../lib/themes';
import { SoundEngine, Haptics } from '../lib/audio';
import { saveCustomSprite, deleteCustomSprite, saveStats } from '../lib/db';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  stats: AppStats;
  customSprites: CustomBottleSprite[];
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onRefreshSprites: () => void;
  onRefreshStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  stats,
  customSprites,
  onClose,
  onUpdateSettings,
  onRefreshSprites,
  onRefreshStats,
}) => {
  const [activeTab, setActiveTab] = useState<'game' | 'bottle' | 'stats'>('game');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentTheme = THEMES[settings.theme] || THEMES['cyber-neon'];

  // Handle Custom Sprite Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const newSprite: CustomBottleSprite = {
          id: `sprite-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 16),
          dataUrl,
          createdAt: Date.now(),
          rotationOffset: 0,
        };

        await saveCustomSprite(newSprite);
        onUpdateSettings({
          bottleStyle: 'custom',
          selectedCustomSpriteId: newSprite.id,
        });
        onRefreshSprites();
        SoundEngine.playButtonClick();
      }
      setIsUploading(false);
    };
    reader.onerror = () => setIsUploading(false);
    reader.readAsDataURL(file);
  };

  // Rotate custom sprite orientation
  const handleRotateSprite = async (sprite: CustomBottleSprite, e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    const updated: CustomBottleSprite = {
      ...sprite,
      rotationOffset: ((sprite.rotationOffset || 0) + 90) % 360,
    };
    await saveCustomSprite(updated);
    onRefreshSprites();
  };

  // Change custom sprite blend mode
  const handleChangeBlendMode = async (
    sprite: CustomBottleSprite,
    mode: BottleBlendMode,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    const updated: CustomBottleSprite = {
      ...sprite,
      blendMode: mode,
    };
    await saveCustomSprite(updated);
    onRefreshSprites();
  };

  // Delete custom sprite
  const handleDeleteSprite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    await deleteCustomSprite(id);
    if (settings.selectedCustomSpriteId === id) {
      onUpdateSettings({
        bottleStyle: 'classic_bottle',
        selectedCustomSpriteId: null,
      });
    }
    onRefreshSprites();
  };

  const BUILTIN_STYLES: { id: BottleBuiltinStyle; name: string }[] = [
    { id: 'classic_bottle', name: 'Classic Bottle' },
    { id: 'laser_dart', name: 'Laser Dart' },
    { id: 'retro_soda', name: 'Retro Soda' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel relative w-full max-w-md max-h-[88vh] flex flex-col overflow-hidden shadow-2xl"
        style={{
          boxShadow: '0 24px 60px -10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(255, 42, 133, 0.25)',
        }}
      >
        {/* Modal Header without Close 'X' Button (Done button in footer only) */}
        <div className="flex items-center justify-center px-5 pt-5 pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-pink-400 drop-shadow-[0_0_8px_#ff2a85]" />
            <h2 className="text-base font-black uppercase tracking-widest text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Settings & Rules
            </h2>
          </div>
        </div>

        {/* Tab Navigation (Theme tab removed) */}
        <div className="flex items-center gap-1.5 p-1.5 mx-4 mt-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              setActiveTab('game');
            }}
            style={{
              backgroundColor: activeTab === 'game' ? 'rgba(0, 212, 255, 0.25)' : 'transparent',
              color: activeTab === 'game' ? '#00d4ff' : '#9ca3af',
              borderColor: activeTab === 'game' ? '#00d4ff' : 'transparent',
              boxShadow: activeTab === 'game' ? '0 0 10px rgba(0, 212, 255, 0.4)' : 'none',
            }}
            className="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Rules</span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              setActiveTab('bottle');
            }}
            style={{
              backgroundColor: activeTab === 'bottle' ? 'rgba(255, 42, 133, 0.25)' : 'transparent',
              color: activeTab === 'bottle' ? '#ff2a85' : '#9ca3af',
              borderColor: activeTab === 'bottle' ? '#ff2a85' : 'transparent',
              boxShadow: activeTab === 'bottle' ? '0 0 10px rgba(255, 42, 133, 0.4)' : 'none',
            }}
            className="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border"
          >
            <SpinBottleIcon className="w-4.5 h-4.5" glow={false} />
            <span>Bottle</span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              setActiveTab('stats');
            }}
            style={{
              backgroundColor: activeTab === 'stats' ? 'rgba(255, 110, 40, 0.25)' : 'transparent',
              color: activeTab === 'stats' ? '#ff6e28' : '#9ca3af',
              borderColor: activeTab === 'stats' ? '#ff6e28' : 'transparent',
              boxShadow: activeTab === 'stats' ? '0 0 10px rgba(255, 110, 40, 0.4)' : 'none',
            }}
            className="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Stats</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: GAME RULES */}
          {activeTab === 'game' && (
            <div className="space-y-3.5">
              {/* Countdown Duration */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wide text-white">
                    Countdown
                  </div>
                  <div className="text-[11px] text-gray-400">Suspense hold timer</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {[3, 5, 8].map((sec) => {
                    const isSelected = settings.countdownSeconds === sec;
                    return (
                      <button
                        key={sec}
                        onClick={() => {
                          SoundEngine.playButtonClick();
                          onUpdateSettings({ countdownSeconds: sec });
                        }}
                        style={{
                          backgroundColor: isSelected ? currentTheme.secondary : 'rgba(255, 255, 255, 0.05)',
                          color: isSelected ? '#ffffff' : '#d1d5db',
                          borderColor: isSelected ? currentTheme.secondary : 'rgba(255, 255, 255, 0.1)',
                          boxShadow: isSelected ? `0 0 10px ${currentTheme.secondary}66` : 'none',
                        }}
                        className="px-2.5 py-1.5 rounded-xl font-black text-xs transition-all border cursor-pointer active:scale-95"
                      >
                        {sec}s
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audio Volume */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-white">
                    <Volume2 className="w-4 h-4" style={{ color: currentTheme.primary }} />
                    <span>Sound Volume</span>
                  </div>
                  <span className="text-xs font-black" style={{ color: currentTheme.primary }}>
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    onUpdateSettings({ soundVolume: vol });
                    SoundEngine.updateConfig(settings.soundEnabled, vol, settings.hapticsEnabled);
                  }}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Haptic Feedback & Tactile Pulse Profiles */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#ff6e28]" />
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wide text-white">
                        Vibration & Haptics
                      </div>
                      <div className="text-[11px] text-gray-400">Tactile pulses for targets & bottle stop</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const nextVal = !settings.hapticsEnabled;
                      onUpdateSettings({ hapticsEnabled: nextVal });
                      SoundEngine.updateConfig(settings.soundEnabled, settings.soundVolume, nextVal);
                      if (nextVal) {
                        Haptics.buttonClick();
                      }
                    }}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    style={{
                      backgroundColor: settings.hapticsEnabled ? '#ff6e28' : 'rgba(255, 255, 255, 0.15)',
                      boxShadow: settings.hapticsEnabled ? '0 0 10px rgba(255, 110, 40, 0.6)' : 'none',
                    }}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Haptic Pulse Pattern Testers */}
                {settings.hapticsEnabled && (
                  <div className="pt-1 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        Haptics.targetSelected();
                        SoundEngine.playTargetImpact();
                      }}
                      className="px-2.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    >
                      <Zap className="w-3 h-3 text-pink-400" />
                      <span>Test Target Pulse</span>
                    </button>
                    <button
                      onClick={() => {
                        Haptics.bottleSettled();
                        SoundEngine.playBottleSettle();
                      }}
                      className="px-2.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    >
                      <RotateCw className="w-3 h-3 text-cyan-400" />
                      <span>Test Bottle Stop</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Color Theme (2 Harmonized Palettes) */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-white">
                    <Palette className="w-4 h-4 text-pink-400" />
                    <span>Color Palette</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {(['cyber-neon', 'synthwave'] as const).map((thmId) => {
                    const thm = THEMES[thmId];
                    const isSelected = settings.theme === thmId;
                    return (
                      <button
                        key={thmId}
                        onClick={() => {
                          SoundEngine.playButtonClick();
                          onUpdateSettings({ theme: thmId });
                        }}
                        style={{
                          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                          borderColor: isSelected ? thm.primary : 'rgba(255, 255, 255, 0.12)',
                          boxShadow: isSelected ? `0 0 14px ${thm.primary}66` : 'none',
                        }}
                        className="p-2.5 rounded-xl border flex flex-col items-start gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-black text-white">{thm.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" style={{ color: thm.primary }} />}
                        </div>
                        <div className="flex items-center gap-1 w-full mt-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: thm.primary }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: thm.secondary }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: thm.accent }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOTTLE SPRITES & UPLOAD */}
          {activeTab === 'bottle' && (
            <div className="space-y-4">
              {/* Built-in Skins (Classic, Dart, Soda only) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                  Bottle Style
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {BUILTIN_STYLES.map((style) => {
                    const isSelected = settings.bottleStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          SoundEngine.playButtonClick();
                          onUpdateSettings({
                            bottleStyle: style.id,
                            selectedCustomSpriteId: null,
                          });
                        }}
                        style={{
                          backgroundColor: isSelected ? `${currentTheme.primary}22` : 'rgba(255, 255, 255, 0.05)',
                          borderColor: isSelected ? currentTheme.primary : 'rgba(255, 255, 255, 0.1)',
                          boxShadow: isSelected ? `0 0 12px ${currentTheme.primary}33` : 'none',
                        }}
                        className="p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span className="text-xs font-bold text-white">{style.name}</span>
                        {isSelected && <Check className="w-4 h-4" style={{ color: currentTheme.primary }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Custom Sprite Section */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                    Custom Uploaded Bottles
                  </label>
                  <span className="text-[10px] font-bold" style={{ color: currentTheme.primary }}>
                    {customSprites.length} Saved
                  </span>
                </div>

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => {
                    SoundEngine.playButtonClick();
                    fileInputRef.current?.click();
                  }}
                  disabled={isUploading}
                  style={{
                    borderColor: `${currentTheme.primary}66`,
                    color: currentTheme.primary,
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed bg-white/5 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all mb-3 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Saving...' : '+ Upload Custom Bottle / Photo'}</span>
                </button>

                {/* List of Custom Uploaded Sprites */}
                {customSprites.length > 0 && (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {customSprites.map((sprite) => {
                      const isSelected =
                        settings.bottleStyle === 'custom' &&
                        settings.selectedCustomSpriteId === sprite.id;
                      const activeBlend = sprite.blendMode || 'normal';

                      const BLEND_OPTIONS: { id: BottleBlendMode; label: string; desc: string }[] = [
                        { id: 'screen', label: 'Screen', desc: 'Hides black background' },
                        { id: 'color-dodge', label: 'Color Dodge', desc: 'Vibrant neon glow' },
                        { id: 'lighten', label: 'Lighten', desc: 'Filters out dark areas' },
                        { id: 'plus-lighter', label: 'Add / Glow', desc: 'Intense luminous pop' },
                        { id: 'normal', label: 'Normal', desc: 'Original opacity' },
                      ];

                      return (
                        <div
                          key={sprite.id}
                          onClick={() => {
                            SoundEngine.playButtonClick();
                            onUpdateSettings({
                              bottleStyle: 'custom',
                              selectedCustomSpriteId: sprite.id,
                            });
                          }}
                          style={{
                            backgroundColor: isSelected ? `${currentTheme.primary}18` : 'rgba(255, 255, 255, 0.04)',
                            borderColor: isSelected ? currentTheme.primary : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: isSelected ? `0 0 14px ${currentTheme.primary}33` : 'none',
                          }}
                          className="p-3 rounded-2xl border flex flex-col gap-2.5 cursor-pointer transition-all"
                        >
                          {/* Row 1: Sprite Info, Preview & Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Dark Preview Canvas showing blend effect */}
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-950/80 to-blue-950/80 border border-white/15 flex items-center justify-center overflow-hidden p-1 shrink-0 relative">
                                <img
                                  src={sprite.dataUrl}
                                  alt={sprite.name}
                                  className="max-w-full max-h-full object-contain"
                                  style={{
                                    transform: `rotate(${sprite.rotationOffset || 0}deg)`,
                                    mixBlendMode: activeBlend,
                                  }}
                                />
                              </div>
                              <div>
                                <div className="text-xs font-black text-white truncate max-w-[140px]">
                                  {sprite.name}
                                </div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                                  <span>{sprite.rotationOffset || 0}° rotation</span>
                                  <span>•</span>
                                  <span className="font-semibold text-cyan-300 capitalize">{activeBlend.replace('-', ' ')}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => handleRotateSprite(sprite, e)}
                                title="Rotate 90°"
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 active:scale-95 transition-all cursor-pointer"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteSprite(sprite.id, e)}
                                title="Delete Sprite"
                                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 active:scale-95 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Blending Modes (Screen, Color Dodge, Lighten, etc.) for black background removal */}
                          <div className="pt-2 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-pink-400" />
                                <span>Blend Mode (Black BG)</span>
                              </span>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                              {BLEND_OPTIONS.map((opt) => {
                                const isBlendActive = activeBlend === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={(e) => handleChangeBlendMode(sprite, opt.id, e)}
                                    title={opt.desc}
                                    style={{
                                      backgroundColor: isBlendActive
                                        ? 'rgba(0, 240, 255, 0.25)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                      borderColor: isBlendActive
                                        ? '#00f0ff'
                                        : 'rgba(255, 255, 255, 0.08)',
                                      color: isBlendActive ? '#00f0ff' : '#9ca3af',
                                    }}
                                    className="py-1 px-1 rounded-lg border text-[10px] font-bold text-center transition-all cursor-pointer active:scale-95 hover:text-white"
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black" style={{ color: currentTheme.primary }}>
                    {stats.totalRouletteRounds}
                  </div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                    Roulette Rounds
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black" style={{ color: currentTheme.secondary }}>
                    {stats.totalBottleSpins}
                  </div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                    Bottle Spins
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300">
                💾 Saved offline in local browser storage.
              </div>

              <button
                onClick={async () => {
                  SoundEngine.playButtonClick();
                  const cleared: AppStats = {
                    totalRouletteRounds: 0,
                    totalBottleSpins: 0,
                    lastPlayedAt: Date.now(),
                  };
                  await saveStats(cleared);
                  onRefreshStats();
                }}
                className="w-full py-2.5 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-950/40 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Reset Statistics
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer with Single Done Button */}
        <div className="p-4 border-t border-white/10 bg-black/40 shrink-0">
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onClose();
            }}
            className="gloss-jelly-btn btn-play-roulette"
          >
            <span className="relative z-10 text-sm font-black tracking-widest text-black">
              DONE
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

