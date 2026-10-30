import React from 'react';
import { Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  onStart: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-xs overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div className="relative flex w-full max-w-sm flex-col gap-3 rounded-2xl border-2 border-pink-400/80 bg-[#1e1b2e] p-4 text-amber-50 shadow-[0_0_35px_rgba(244,114,182,0.35)] text-center">
        {/* Title */}
        <h1
          id="welcome-modal-title"
          className="font-arcade text-xs sm:text-sm text-pink-300 leading-snug drop-shadow-[0_2px_8px_rgba(244,114,182,0.5)]"
        >
          WELCOME TO SHAILY'S MIDNIGHT MATSURI! 🏮
        </h1>

        {/* Short Text */}
        <p className="font-note text-xs sm:text-sm leading-relaxed text-amber-100/90 border border-amber-500/20 bg-[#14111d] p-3 rounded-xl">
          Tap, click, or use arrow keys to move Shaily around the screen, interact with objects, and find all 10 secret messages!
        </p>

        {/* Start Button */}
        <button
          type="button"
          onClick={onStart}
          className="arcade-btn w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-2.5 font-arcade text-xs text-white shadow-[0_4px_15px_rgba(219,39,119,0.4)] hover:from-pink-500 hover:to-purple-500 active:scale-[0.98] transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>START PLAYING 🌸</span>
        </button>
      </div>
    </div>
  );
};
