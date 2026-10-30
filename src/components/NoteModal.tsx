import React from 'react';
import { BookOpen, Sparkles, X } from 'lucide-react';
import { WorldObject } from '../data/worldObjects';

interface NoteModalProps {
  object: WorldObject;
  isNewDiscovery: boolean;
  discoveredCount: number;
  onClose: () => void;
  onOpenJournal: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  object,
  isNewDiscovery: _isNewDiscovery,
  discoveredCount,
  onClose,
  onOpenJournal,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
    >
      <div className="relative flex w-full max-w-lg flex-col gap-3 rounded-2xl border-2 border-amber-500/80 bg-[#1e1b2e] p-5 text-amber-50 shadow-2xl sm:p-6">
        {/* 1. note number "x" - y/10 found */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
          <span className="font-arcade text-xs text-orange-400">
            Note #{object.noteId ?? 1} - {discoveredCount}/10 found
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Note Modal"
            className="arcade-btn flex h-7 w-7 items-center justify-center rounded-md border border-amber-500/30 bg-[#18151f] text-amber-200 hover:border-amber-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 2. found at: */}
        <div className="text-xs text-purple-300">
          <span>Found at: </span>
          <span className="font-medium text-amber-200">{object.name}</span>
        </div>

        {/* 3. SENDER NAME (Restored to classic arcade pixel font) */}
        <div
          id="note-modal-title"
          className="font-arcade text-sm tracking-wide text-amber-400 sm:text-base"
        >
          {object.sender || 'ALPHA'}
        </div>

        {/* 4. <textbox> with standard size, font-note for high readability & scrollbar */}
        <div className="max-h-[55vh] overflow-y-auto pr-1.5 rounded-xl border border-amber-500/30 bg-[#14111d] p-4 text-amber-50 sm:p-5 custom-scrollbar">
          <p className="font-note whitespace-pre-line text-sm leading-relaxed tracking-wide sm:text-base text-amber-100/95 font-normal">
            {object.lore}
          </p>
          {object.signature && (
            <p className="mt-4 text-right font-note font-semibold text-sm sm:text-base tracking-wide text-amber-300">
              {object.signature}
            </p>
          )}
        </div>

        {/* 5. Buttons for open notes journal and keep exploring with matching header CSS */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onOpenJournal}
            className="arcade-btn flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#581c87] px-3 py-1 font-arcade text-[10px] text-purple-200/90 hover:bg-[#4c1d95] hover:text-white transition-colors whitespace-nowrap"
          >
            <BookOpen className="h-3.5 w-3.5 text-purple-300/80" />
            <span>OPEN NOTES JOURNAL</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="arcade-btn flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#7c2d12] px-3 py-1 font-arcade text-[10px] text-amber-200/90 hover:bg-[#6c2308] hover:text-white transition-colors whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300/80" />
            <span>KEEP EXPLORING</span>
          </button>
        </div>
      </div>
    </div>
  );
};
