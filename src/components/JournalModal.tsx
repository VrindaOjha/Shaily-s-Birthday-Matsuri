import React, { useState } from 'react';
import { BookOpen, CheckCircle2, HelpCircle, X } from 'lucide-react';
import { WORLD_OBJECTS, WorldObject } from '../data/worldObjects';

interface JournalModalProps {
  discoveredNoteIds: number[];
  onClose: () => void;
  onSelectNote: (obj: WorldObject) => void;
}

type FilterMode = 'all' | 'discovered' | 'undiscovered';

export const JournalModal: React.FC<JournalModalProps> = ({
  discoveredNoteIds,
  onClose,
  onSelectNote,
}) => {
  const [filter, setFilter] = useState<FilterMode>('all');

  const noteObjects = WORLD_OBJECTS.filter((obj) => obj.hasNote).sort(
    (a, b) => (a.noteId || 0) - (b.noteId || 0)
  );

  const filteredNotes = noteObjects.filter((obj) => {
    const isFound = obj.noteId ? discoveredNoteIds.includes(obj.noteId) : false;
    if (filter === 'discovered') return isFound;
    if (filter === 'undiscovered') return !isFound;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-modal-title"
    >
      <div className="flex max-h-[85vh] sm:max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-2 border-amber-500/80 bg-[#18151f] text-amber-50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/25 px-3.5 py-3 sm:px-6 sm:py-4">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-amber-400">
              <span>SHAILY'S BIRTHDAY NOTE ARCHIVE</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {discoveredNoteIds.length} OF 10 SECRET NOTES FOUND
              </span>
            </div>
            <h2
              id="journal-modal-title"
              className="mt-1 flex items-center gap-2 font-arcade text-xs text-amber-50 sm:text-base"
            >
              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
              <span>NOTES JOURNAL</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Notes Journal"
            className="arcade-btn flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border border-amber-500/40 bg-[#231f2e] text-amber-200 hover:border-amber-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-amber-500/15 bg-[#1e1b2e] px-3.5 py-2.5 sm:px-6 sm:py-3 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap" role="tablist" aria-label="Filter Secret Notes">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              onClick={() => setFilter('all')}
              className={`arcade-btn px-2.5 py-1 font-arcade text-[9px] sm:text-[10px] whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-[#18151f] text-amber-200/80 hover:text-white'
              }`}
            >
              All 10 ({noteObjects.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'discovered'}
              onClick={() => setFilter('discovered')}
              className={`arcade-btn px-2.5 py-1 font-arcade text-[9px] sm:text-[10px] whitespace-nowrap transition-colors ${
                filter === 'discovered'
                  ? 'bg-orange-600 text-white'
                  : 'bg-[#18151f] text-amber-200/80 hover:text-white'
              }`}
            >
              Discovered ({discoveredNoteIds.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'undiscovered'}
              onClick={() => setFilter('undiscovered')}
              className={`arcade-btn px-2.5 py-1 font-arcade text-[9px] sm:text-[10px] whitespace-nowrap transition-colors ${
                filter === 'undiscovered'
                  ? 'bg-orange-600 text-white'
                  : 'bg-[#18151f] text-amber-200/80 hover:text-white'
              }`}
            >
              Undiscovered ({10 - discoveredNoteIds.length})
            </button>
          </div>

          <span className="text-[10px] sm:text-xs text-amber-300/75 hidden sm:inline">
            Click any discovered note to re-read its full story
          </span>
        </div>

        {/* Notes List */}
        <div className="flex-1 space-y-2.5 sm:space-y-3 overflow-y-auto p-3.5 sm:p-6 custom-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="py-8 sm:py-12 text-center text-xs sm:text-sm text-amber-300/70">
              {filter === 'discovered'
                ? 'No secret notes discovered yet. Walk near objects in the alley and press [E] or tap [INTERACT]!'
                : 'All 10 secret notes have been discovered! You are a true master of the alleyway.'}
            </div>
          ) : (
            filteredNotes.map((obj) => {
              const isFound = obj.noteId ? discoveredNoteIds.includes(obj.noteId) : false;

              if (isFound) {
                return (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => onSelectNote(obj)}
                    className="w-full border border-amber-500/40 bg-[#231f2e] p-3 sm:p-4 text-left transition-colors hover:border-amber-400 hover:bg-[#2a2538] rounded-lg"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-amber-400">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 shrink-0" />
                        <span className="font-arcade text-[9px] sm:text-[10px] text-orange-400">
                          NOTE #{String(obj.noteId).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{obj.name}</span>
                        <span aria-hidden="true">·</span>
                        <span>{obj.year}</span>
                      </div>
                      <span className="font-arcade text-[8px] sm:text-[9px] text-amber-300 underline">
                        READ FULL NOTE →
                      </span>
                    </div>

                    <div className="mt-1 font-arcade text-[10px] sm:text-xs text-amber-400">
                      From: {obj.sender || 'ALPHA'}
                    </div>
                    <p className="mt-1.5 line-clamp-2 font-note text-xs text-amber-200/90 leading-relaxed">
                      {obj.lore}
                    </p>
                  </button>
                );
              }

              return (
                <div
                  key={obj.id}
                  className="border border-purple-500/25 bg-[#14111d] p-3 sm:p-4 text-amber-200/70 rounded-lg"
                >
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-purple-300/80">
                    <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 shrink-0" />
                    <span className="font-arcade text-[9px] sm:text-[10px]">
                      NOTE #{String(obj.noteId).padStart(2, '0')} · UNDISCOVERED CLUE
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{obj.zone}</span>
                  </div>
                  <p className="mt-1.5 font-jp-pixel text-xs sm:text-sm italic text-amber-100/85">
                    “{obj.locationClue}”
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-amber-500/25 bg-[#1e1b2e] px-3.5 py-2.5 sm:px-6 sm:py-3">
          <button
            type="button"
            onClick={onClose}
            className="arcade-btn flex items-center gap-1.5 rounded-lg bg-[#7c2d12] px-3 py-1 font-arcade text-[9px] sm:text-[10px] text-amber-200/90 hover:bg-[#6c2308] hover:text-white transition-colors whitespace-nowrap"
          >
            CLOSE JOURNAL
          </button>
        </div>
      </div>
    </div>
  );
};
