/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, CheckCircle, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { SoundEngine, Haptics } from '../lib/audio';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'button' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // When already running in standalone mode on the phone, suppress the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();

    if (isInstallable) {
      await install();
    } else {
      // Show guided instructions for iOS / mobile browsers
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'header' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          aria-label="Add to Home Screen"
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[18px] bg-black/40 backdrop-blur-md border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center text-cyan-300 hover:border-cyan-300 active:scale-95 transition-all ${className}`}
        >
          <Download className="w-5 h-5 stroke-[2.2] drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        </button>
      ) : variant === 'compact' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_0_12px_rgba(6,182,212,0.25)] ${className}`}
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add to Home Screen</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/40 text-cyan-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_16px_rgba(6,182,212,0.2)] ${className}`}
        >
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>Install App / Add to Home Screen</span>
        </button>
      )}

      {/* Guided Share to Home Screen Modal (iOS Safari & Mobile Web) */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn select-none">
          <div className="relative w-full max-w-sm rounded-3xl bg-gray-950/95 border border-cyan-400/40 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white">
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 active:scale-90 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Smartphone className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide uppercase">
                  Add to Home Screen
                </h3>
                <p className="text-xs text-gray-400">Play full-screen with offline support</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0 font-black text-xs">
                  1
                </div>
                <div>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    Tap the Share Button <Share2 className="w-3.5 h-3.5 text-blue-400 inline" />
                  </p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    In the Safari toolbar at the bottom or top of your screen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0 font-black text-xs">
                  2
                </div>
                <div>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    Select "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 text-purple-400 inline" />
                  </p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Scroll down in the share sheet options and tap "Add to Home Screen".
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 font-black text-xs">
                  3
                </div>
                <div>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    Tap "Add" <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" />
                  </p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Confirm in the top-right corner to place PICK'U PARTY on your phone screen!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs sm:text-sm text-white uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-98 transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
