/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, X, Smartphone, Maximize2, Palette, Flame } from 'lucide-react';
import { SoundEngine, Haptics } from '../lib/audio';

interface VersionNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionNotesModal: React.FC<VersionNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-slate-950/90 border border-purple-500/40 p-5 shadow-[0_0_40px_rgba(168,85,247,0.35)] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_#00f0ff]" />
            <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
              Version Notes
            </h2>
          </div>
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              Haptics.buttonClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badge & Version */}
        <div className="mt-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            v1.2.084
          </span>
          <span className="text-[11px] text-gray-400 font-medium">Latest Release</span>
        </div>

        {/* Change List */}
        <div className="mt-4 space-y-2.5 text-xs text-gray-200 max-h-[300px] overflow-y-auto pr-1">
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Animated Title: Gradient & Pulse</p>
              <p className="text-[11px] text-gray-400">PICK'U PARTY title now features an energetic club pulse animation and continuously moving spectrum gradient fill.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Flame className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Title Party Particles & Tap Burst</p>
              <p className="text-[11px] text-gray-400">Added ambient floating neon sparkles, diamonds, and twinkling stars around the title, plus an interactive tap confetti burst.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Settings "Done" Button Style</p>
              <p className="text-[11px] text-gray-400">Updated the Done button in Settings to match the modern pill gradient style with neon cyan-fuchsia glow and haptic click.</p>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            onClose();
          }}
          className="mt-5 w-full py-2.5 rounded-full font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-98 transition-all"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
