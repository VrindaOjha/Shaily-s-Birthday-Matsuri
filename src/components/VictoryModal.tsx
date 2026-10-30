import React from 'react';
import { Award, RotateCcw, Sparkles } from 'lucide-react';
import { WORLD_OBJECTS } from '../data/worldObjects';

interface VictoryModalProps {
  onKeepExploring: () => void;
  onResetGame: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  onKeepExploring,
  onResetGame,
}) => {
  const noteObjects = WORLD_OBJECTS.filter((o) => o.hasNote);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-modal-title"
    >
      <div className="relative w-full max-w-xl rounded-2xl border-2 border-amber-400/80 bg-[#1e1b2e] p-6 text-amber-50 shadow-2xl sm:p-7">
        {/* Certificate Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-amber-400">
            <Award className="h-4 w-4 text-orange-400" />
            <span className="font-arcade text-[10px] tracking-widest">
              100% SECRET NOTES FOUND
            </span>
          </div>

          <h2
            id="victory-modal-title"
            className="mt-3 font-arcade text-base text-amber-300 sm:text-lg leading-snug drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
          >
            HAPPY BIRTHDAY SHAILY! WE LOVE YOU ❤️
          </h2>
        </div>

        {/* Complete Note Roll */}
        <div className="mt-5 border border-amber-500/30 bg-[#14111d] p-4 rounded-xl">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 text-xs text-amber-400">
            <span>BIRTHDAY NOTE REGISTRY</span>
            <span className="font-arcade text-[10px] tabular-nums">10 / 10 NOTES VERIFIED</span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {noteObjects.map((obj) => (
              <div
                key={obj.id}
                className="flex items-center gap-2 text-xs text-amber-100/90"
              >
                <span className="font-arcade text-[9px] text-orange-400 tabular-nums">
                  #{String(obj.noteId).padStart(2, '0')}
                </span>
                <span className="truncate font-arcade text-[10px] text-amber-300">
                  {obj.sender || 'FRIEND'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions with matching Arcade Button CSS */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onKeepExploring}
            className="arcade-btn flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#7c2d12] px-3 py-2 font-arcade text-[10px] text-amber-200/90 hover:bg-[#6c2308] hover:text-white transition-colors whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300/80" />
            <span>KEEP WALKING ALLEYWAY</span>
          </button>

          <button
            type="button"
            onClick={onResetGame}
            className="arcade-btn flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#581c87] px-3 py-2 font-arcade text-[10px] text-purple-200/90 hover:bg-[#4c1d95] hover:text-white transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5 text-purple-300/80" />
            <span>RESET AND REPLAY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
