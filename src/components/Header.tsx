/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Settings, Home, Smartphone, Maximize, Minimize } from 'lucide-react';
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
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  settings,
  onNavigate,
  onOpenSettings,
  onToggleSound,
  onToggleHaptics,
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
              .catch(() => {
                // Fullscreen might be blocked by iframe permissions or user agent policies
              });
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
    <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2 pointer-events-none">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {currentView !== 'hub' && (
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onNavigate('hub');
            }}
            aria-label="Return to Hub"
            className="chrome-glass-bezel w-11 h-11 flex items-center justify-center text-cyan-300 active:scale-90 transition-all cursor-pointer group"
            style={{
              boxShadow: '0 6px 18px -2px rgba(0, 212, 255, 0.5), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.8)',
            }}
          >
            <Home className="w-4.5 h-4.5 drop-shadow-[0_0_8px_rgba(0,212,255,0.9)] stroke-[2.2]" />
          </button>
        )}

        {/* Audio Button - Pink Neon (as seen in IMG_0610) */}
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onToggleSound();
          }}
          aria-label={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          className="chrome-glass-bezel w-11 h-11 flex items-center justify-center active:scale-90 transition-all cursor-pointer group"
          style={{
            boxShadow: settings.soundEnabled
              ? '0 8px 20px -2px rgba(255, 42, 133, 0.65), 0 0 10px rgba(255, 42, 133, 0.35), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.8)'
              : '0 4px 10px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.8)',
            borderColor: settings.soundEnabled ? 'rgba(255, 120, 180, 0.6)' : 'rgba(180, 180, 210, 0.3)',
          }}
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4.5 h-4.5 text-[#ff2a85] drop-shadow-[0_0_8px_#ff2a85] stroke-[2.4]" />
          ) : (
            <VolumeX className="w-4.5 h-4.5 text-gray-500 stroke-[2]" />
          )}
        </button>

        {/* Haptics Button - Orange Neon (as seen in IMG_0610) */}
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onToggleHaptics();
          }}
          aria-label={settings.hapticsEnabled ? 'Disable Haptics' : 'Enable Haptics'}
          className="chrome-glass-bezel w-11 h-11 flex items-center justify-center active:scale-90 transition-all cursor-pointer group"
          style={{
            boxShadow: settings.hapticsEnabled
              ? '0 8px 20px -2px rgba(255, 110, 40, 0.65), 0 0 10px rgba(255, 110, 40, 0.35), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.8)'
              : '0 4px 10px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.8)',
            borderColor: settings.hapticsEnabled ? 'rgba(255, 160, 100, 0.6)' : 'rgba(180, 180, 210, 0.3)',
          }}
        >
          <Smartphone
            className={`w-4.5 h-4.5 stroke-[2.4] transition-all ${
              settings.hapticsEnabled
                ? 'text-[#ff6e28] drop-shadow-[0_0_8px_#ff6e28]'
                : 'text-gray-500'
            }`}
          />
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {supportsFullscreen && (
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="chrome-glass-bezel w-11 h-11 flex items-center justify-center text-purple-300 active:scale-90 transition-all cursor-pointer group"
            style={{
              boxShadow: '0 6px 18px -2px rgba(168, 85, 247, 0.45), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {isFullscreen ? (
              <Minimize className="w-4.5 h-4.5 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] stroke-[2.2]" />
            ) : (
              <Maximize className="w-4.5 h-4.5 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] stroke-[2.2]" />
            )}
          </button>
        )}

        {/* Settings Button - Orange / Amber Neon (as seen in IMG_0610) */}
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onOpenSettings();
          }}
          aria-label="Open Settings"
          className="chrome-glass-bezel w-11 h-11 flex items-center justify-center active:scale-90 transition-all cursor-pointer group"
          style={{
            boxShadow: '0 8px 20px -2px rgba(255, 110, 40, 0.65), 0 0 10px rgba(255, 110, 40, 0.35), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.8)',
            borderColor: 'rgba(255, 160, 100, 0.6)',
          }}
        >
          <Settings className="w-4.5 h-4.5 text-[#ff6e28] drop-shadow-[0_0_8px_#ff6e28] stroke-[2.4]" />
        </button>
      </div>
    </header>
  );
};
