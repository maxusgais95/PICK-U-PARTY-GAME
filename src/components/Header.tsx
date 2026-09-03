/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Settings, Home, Smartphone, Maximize, Minimize, Palette } from 'lucide-react';
import { AppSettings, ScreenView } from '../types';
import { THEMES } from '../lib/themes';
import { SoundEngine } from '../lib/audio';

interface HeaderProps {
  currentView: ScreenView;
  settings: AppSettings;
  onNavigate: (view: ScreenView) => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onCycleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  settings,
  onNavigate,
  onOpenSettings,
  onToggleSound,
  onToggleHaptics,
  onCycleTheme,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
  const [supportsFullscreen, setSupportsFullscreen] = React.useState<boolean>(true);
  const currentTheme = THEMES[settings.theme] || THEMES['cyber-neon'];

  React.useEffect(() => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    const hasFullscreenCapability = Boolean(
      docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen
    );
    setSupportsFullscreen(hasFullscreenCapability);

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    SoundEngine.playButtonClick();
    const doc = document as any;
    const docEl = document.documentElement as any;

    const isCurrentlyFullscreen = Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    if (!isCurrentlyFullscreen) {
      const requestMethod =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (typeof requestMethod === 'function') {
        try {
          const promise = requestMethod.call(docEl);
          if (promise && typeof promise.then === 'function') {
            promise
              .then(() => setIsFullscreen(true))
              .catch(() => {});
          } else {
            setIsFullscreen(true);
          }
        } catch {
          // Ignore error gracefully
        }
      }
    } else {
      const exitMethod =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen;

      if (typeof exitMethod === 'function') {
        try {
          const promise = exitMethod.call(doc);
          if (promise && typeof promise.then === 'function') {
            promise
              .then(() => setIsFullscreen(false))
              .catch(() => {});
          } else {
            setIsFullscreen(false);
          }
        } catch {
          // Ignore error gracefully
        }
      }
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 pt-[max(1.5rem,calc(env(safe-area-inset-top)+0.8rem))] pb-2 pointer-events-none">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {currentView !== 'hub' && (
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onNavigate('hub');
            }}
            aria-label="Return to Hub"
            className="bubble-toggle-btn group transition-all duration-300"
            style={{
              boxShadow: `0 8px 20px -2px ${currentTheme.primary}77, inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.8)`,
              borderColor: `${currentTheme.primary}88`,
            }}
          >
            <Home
              className="w-5 h-5 stroke-[2.4] relative z-10 transition-colors duration-300"
              style={{
                color: currentTheme.primary,
                filter: `drop-shadow(0 0 8px ${currentTheme.primary})`,
              }}
            />
          </button>
        )}

        {/* Audio Button - Dynamic Theme Tint */}
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onToggleSound();
          }}
          aria-label={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          className="bubble-toggle-btn group transition-all duration-300"
          style={{
            boxShadow: settings.soundEnabled
              ? `0 8px 24px -2px ${currentTheme.secondary}aa, 0 0 12px ${currentTheme.secondary}66, inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.8)`
              : '0 4px 12px rgba(0,0,0,0.6), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.8)',
            borderColor: settings.soundEnabled ? `${currentTheme.secondary}88` : 'rgba(255, 255, 255, 0.2)',
          }}
        >
          {settings.soundEnabled ? (
            <Volume2
              className="w-5 h-5 stroke-[2.4] relative z-10 transition-colors duration-300"
              style={{
                color: currentTheme.secondary,
                filter: `drop-shadow(0 0 10px ${currentTheme.secondary})`,
              }}
            />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400 stroke-[2] relative z-10" />
          )}
        </button>

        {/* Haptics Button - Dynamic Theme Tint */}
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onToggleHaptics();
          }}
          aria-label={settings.hapticsEnabled ? 'Disable Haptics' : 'Enable Haptics'}
          className="bubble-toggle-btn group transition-all duration-300"
          style={{
            boxShadow: settings.hapticsEnabled
              ? `0 8px 24px -2px ${currentTheme.accent}aa, 0 0 12px ${currentTheme.accent}66, inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.8)`
              : '0 4px 12px rgba(0,0,0,0.6), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.8)',
            borderColor: settings.hapticsEnabled ? `${currentTheme.accent}88` : 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Smartphone
            className="w-5 h-5 stroke-[2.4] relative z-10 transition-all duration-300"
            style={
              settings.hapticsEnabled
                ? {
                    color: currentTheme.accent,
                    filter: `drop-shadow(0 0 10px ${currentTheme.accent})`,
                  }
                : { color: '#9ca3af' }
            }
          />
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Quick Theme Cycle Button (Allows instant theme testing on the fly) */}
        {onCycleTheme && (
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onCycleTheme();
            }}
            aria-label={`Current Theme: ${currentTheme.name}. Tap to switch`}
            title={`Current Theme: ${currentTheme.name}. Tap to switch`}
            className="bubble-toggle-btn group transition-all duration-300"
            style={{
              boxShadow: `0 8px 20px -2px ${currentTheme.primary}77, 0 0 10px ${currentTheme.secondary}55, inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.8)`,
              borderColor: `${currentTheme.secondary}88`,
            }}
          >
            <Palette
              className="w-5 h-5 stroke-[2.4] relative z-10 transition-colors duration-300"
              style={{
                color: currentTheme.primary,
                filter: `drop-shadow(0 0 8px ${currentTheme.primary})`,
              }}
            />
          </button>
        )}

        {supportsFullscreen && (
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="bubble-toggle-btn group transition-all duration-300"
            style={{
              boxShadow: `0 8px 20px -2px ${currentTheme.accent}77, inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.8)`,
              borderColor: `${currentTheme.accent}66`,
            }}
          >
            {isFullscreen ? (
              <Minimize
                className="w-5 h-5 stroke-[2.2] relative z-10 transition-colors duration-300"
                style={{
                  color: currentTheme.accent,
                  filter: `drop-shadow(0 0 8px ${currentTheme.accent})`,
                }}
              />
            ) : (
              <Maximize
                className="w-5 h-5 stroke-[2.2] relative z-10 transition-colors duration-300"
                style={{
                  color: currentTheme.accent,
                  filter: `drop-shadow(0 0 8px ${currentTheme.accent})`,
                }}
              />
            )}
          </button>
        )}

        {/* Settings Button - Dynamic Theme Tint */}
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onOpenSettings();
          }}
          aria-label="Open Settings"
          className="bubble-toggle-btn group transition-all duration-300"
          style={{
            boxShadow: `0 8px 24px -2px ${currentTheme.secondary}aa, 0 0 12px ${currentTheme.secondary}66, inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.8)`,
            borderColor: `${currentTheme.secondary}88`,
          }}
        >
          <Settings
            className="w-5 h-5 stroke-[2.4] relative z-10 transition-colors duration-300"
            style={{
              color: currentTheme.secondary,
              filter: `drop-shadow(0 0 10px ${currentTheme.secondary})`,
            }}
          />
        </button>
      </div>
    </header>
  );
};
