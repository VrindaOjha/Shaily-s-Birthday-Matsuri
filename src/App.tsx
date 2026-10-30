/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Compass,
  Sparkles,
} from 'lucide-react';
import {
  createInitialParticles,
  findNearestObject,
  PlayerState,
  renderWorld,
  resolvePlayerMovement,
} from './canvas/renderWorld';
import { JournalModal } from './components/JournalModal';
import { NoteModal } from './components/NoteModal';
import { VictoryModal } from './components/VictoryModal';
import { WelcomeModal } from './components/WelcomeModal';
import {
  INTERACT_RADIUS,
  LightingMode,
  PLAY_AREA_HEIGHT,
  SKY_OFFSET,
  WORLD_HEIGHT,
  WORLD_OBJECTS,
  WORLD_WIDTH,
  WorldObject,
} from './data/worldObjects';
import { soundEngine } from './utils/soundEngine';

const STORAGE_KEY = 'halloween_in_japan_discovered_notes_v1';

export default function App() {
  // Persistent discovered note IDs (1..10)
  const [discoveredNoteIds, setDiscoveredNoteIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Locked to Witching Hour Night with sunsetty pinker hue & CRT permanently ON
  const lighting: LightingMode = 'night';
  const crtEnabled = true;
  const [droneEnabled, setDroneEnabled] = useState<boolean>(true);

  // Resume Web Audio and start Haunted Happy Birthday on first user interaction
  useEffect(() => {
    const handleFirstGesture = () => {
      soundEngine.ensureContext();
      if (droneEnabled) {
        soundEngine.toggleDrone(true);
      }
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [droneEnabled]);

  // Active modals
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(true);
  const [activeNoteObject, setActiveNoteObject] = useState<WorldObject | null>(null);
  const [isNewDiscovery, setIsNewDiscovery] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);

  const handleStartGame = useCallback(() => {
    setIsWelcomeOpen(false);
    soundEngine.ensureContext();
    if (droneEnabled) {
      soundEngine.toggleDrone(true);
    }
  }, [droneEnabled]);

  // React state mirrored for subtle HUD status
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({
    x: 410,
    y: 206,
  });
  const [nearbyObject, setNearbyObject] = useState<WorldObject | null>(() =>
    findNearestObject(410, 206)
  );

  // Mutable game loop refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<PlayerState>({
    x: 410,
    y: 206,
    dir: 'up',
    isMoving: false,
    walkFrame: 0,
    targetX: null,
    targetY: null,
  });
  const pendingInspectObjectRef = useRef<WorldObject | null>(null);
  const keysPressedRef = useRef<Set<string>>(new Set());
  const particlesRef = useRef(createInitialParticles(28));
  const discoveredRef = useRef<number[]>(discoveredNoteIds);
  const vampireSpeechUntilRef = useRef<number>(0);
  const parkCheerUntilRef = useRef<number>(0);

  useEffect(() => {
    discoveredRef.current = discoveredNoteIds;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(discoveredNoteIds));
    } catch {}
  }, [discoveredNoteIds]);

  // Core Inspection Handler (Strict 20-Object & 10-Note Game Rule)
  const inspectObject = useCallback((obj: WorldObject | null) => {
    if (!obj) return;

    // Special cute 8-bit cat chirp on Black Witch Cat in Cardboard Box (#16)
    if (obj.playsCatSound) {
      soundEngine.playCatChirp();
    }

    // Special dramatic 8-bit vampire sound & dialogue on Count Vlad (#21)
    if (obj.playsVampireSound) {
      soundEngine.playVampireSound();
      vampireSpeechUntilRef.current = Date.now() + 4500;
    }

    // Special festive 8-bit cheer sound & birthday dialogue on Chilling Park Friends (#22)
    if (obj.playsCheerSound) {
      soundEngine.playCheerSound();
      parkCheerUntilRef.current = Date.now() + 4500;
    }

    // Rule 5B: Objects with NO notes produce strictly NO modal reaction
    if (!obj.hasNote || !obj.noteId) {
      return;
    }

    // Rule 5A: The 10 objects hiding notes display Note Modal + 8-bit fanfare
    const alreadyFound = discoveredRef.current.includes(obj.noteId);
    const updatedFound = alreadyFound
      ? discoveredRef.current
      : [...discoveredRef.current, obj.noteId];

    if (!alreadyFound) {
      setDiscoveredNoteIds(updatedFound);
    }

    setIsNewDiscovery(!alreadyFound);
    setActiveNoteObject(obj);

    if (!alreadyFound && updatedFound.length === 10) {
      soundEngine.playVictoryFanfare();
    } else {
      soundEngine.playNoteFanfare();
    }
  }, []);

  // Trigger interaction with currently nearby object
  const handleInteractTrigger = useCallback(() => {
    const currentNear = findNearestObject(playerRef.current.x, playerRef.current.y);
    if (currentNear) {
      inspectObject(currentNear);
    }
  }, [inspectObject]);

  // Close Note Modal and check if 10th note was just completed
  const handleCloseNoteModal = useCallback(() => {
    const wasNew = isNewDiscovery;
    setActiveNoteObject(null);
    if (wasNew && discoveredRef.current.length === 10) {
      setIsVictoryOpen(true);
    }
  }, [isNewDiscovery]);

  // Reset & Replay progression
  const handleResetGame = useCallback(() => {
    setDiscoveredNoteIds([]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
    setActiveNoteObject(null);
    setIsVictoryOpen(false);
    setIsJournalOpen(false);
    playerRef.current = {
      x: 410,
      y: 330,
      dir: 'down',
      isMoving: false,
      walkFrame: 0,
      targetX: null,
      targetY: null,
    };
    setPlayerPos({ x: 410, y: 330 });
    setNearbyObject(findNearestObject(410, 330));
  }, []);

  // Keyboard Listeners (WASD, Arrows, E / Space / Enter / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        setActiveNoteObject(null);
        setIsJournalOpen(false);
        setIsVictoryOpen(false);
        return;
      }

      // If Note Modal is open, Enter/Space closes it
      if (activeNoteObject && (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'e')) {
        e.preventDefault();
        handleCloseNoteModal();
        return;
      }

      if (isJournalOpen || isVictoryOpen) return;

      if (e.key.toLowerCase() === 'e' || e.key === 'Enter' || e.key === ' ') {
        handleInteractTrigger();
        return;
      }

      keysPressedRef.current.add(e.key.toLowerCase());
      playerRef.current.targetX = null;
      playerRef.current.targetY = null;
      pendingInspectObjectRef.current = null;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNoteObject, isJournalOpen, isVictoryOpen, handleInteractTrigger, handleCloseNoteModal]);

  // Click on canvas to walk or click objects directly
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = WORLD_WIDTH / rect.width;
    const scaleY = WORLD_HEIGHT / rect.height;

    const p = playerRef.current;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY - SKY_OFFSET;

    // Check if user clicked directly on one of the 20 objects
    const clickedObj = WORLD_OBJECTS.find(
      (obj) =>
        Math.abs(clickX - obj.x) <= obj.width / 2 + 14 &&
        Math.abs(clickY - obj.y) <= obj.height / 2 + 14
    );

    if (clickedObj) {
      const dist = Math.hypot(p.x - clickedObj.x, p.y - clickedObj.y);
      if (dist <= INTERACT_RADIUS) {
        // Already within proximity: inspect immediately!
        inspectObject(clickedObj);
        return;
      }
      // Walk towards a point just outside the object's front edge and inspect on arrival
      const angle = Math.atan2(p.y - clickedObj.y, p.x - clickedObj.x);
      const stopDist = Math.max(clickedObj.width, clickedObj.height) * 0.55 + 14;
      p.targetX = Math.max(24, Math.min(WORLD_WIDTH - 24, clickedObj.x + Math.cos(angle) * stopDist));
      p.targetY = Math.max(118, Math.min(PLAY_AREA_HEIGHT - 24, clickedObj.y + Math.sin(angle) * stopDist));
      pendingInspectObjectRef.current = clickedObj;
      return;
    }

    // Otherwise walk to the clicked point
    p.targetX = Math.max(24, Math.min(WORLD_WIDTH - 24, clickX));
    p.targetY = Math.max(115, Math.min(PLAY_AREA_HEIGHT - 24, clickY));
    pendingInspectObjectRef.current = null;
  };

  // Main 60FPS Canvas Animation & Collision Physics Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastHudSync = 0;

    const updateAndDraw = (time: number) => {
      const p = playerRef.current;
      const keys = keysPressedRef.current;

      let dx = 0;
      let dy = 0;

      if (keys.has('arrowup') || keys.has('w')) dy -= 1;
      if (keys.has('arrowdown') || keys.has('s')) dy += 1;
      if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
      if (keys.has('arrowright') || keys.has('d')) dx += 1;

      const speed = 3.2;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        const nextX = p.x + (dx / len) * speed;
        const nextY = p.y + (dy / len) * speed;

        if (Math.abs(dx) > Math.abs(dy)) {
          p.dir = dx < 0 ? 'left' : 'right';
        } else {
          p.dir = dy < 0 ? 'up' : 'down';
        }

        const resolved = resolvePlayerMovement(p.x, p.y, nextX, nextY);
        const moved = Math.hypot(resolved.x - p.x, resolved.y - p.y) > 0.1;
        p.x = resolved.x;
        p.y = resolved.y;
        p.isMoving = moved;
        if (moved) {
          soundEngine.playFootstep();
        }
      } else if (p.targetX !== null && p.targetY !== null) {
        const tdx = p.targetX - p.x;
        const tdy = p.targetY - p.y;
        const dist = Math.hypot(tdx, tdy);

        // Check if we are already within interaction range of a pending clicked object
        const pendingObj = pendingInspectObjectRef.current;
        const reachedPendingObj =
          pendingObj && Math.hypot(p.x - pendingObj.x, p.y - pendingObj.y) <= INTERACT_RADIUS - 4;

        if (dist <= 4 || reachedPendingObj) {
          p.targetX = null;
          p.targetY = null;
          p.isMoving = false;

          if (pendingObj) {
            pendingInspectObjectRef.current = null;
            inspectObject(pendingObj);
          }
        } else {
          const nextX = p.x + (tdx / dist) * speed;
          const nextY = p.y + (tdy / dist) * speed;

          if (Math.abs(tdx) > Math.abs(tdy)) {
            p.dir = tdx < 0 ? 'left' : 'right';
          } else {
            p.dir = tdy < 0 ? 'up' : 'down';
          }

          const resolved = resolvePlayerMovement(p.x, p.y, nextX, nextY);
          const movedDist = Math.hypot(resolved.x - p.x, resolved.y - p.y);
          p.x = resolved.x;
          p.y = resolved.y;

          if (movedDist < 0.2) {
            // Stopped against solid obstacle edge
            p.targetX = null;
            p.targetY = null;
            p.isMoving = false;
            if (
              pendingObj &&
              Math.hypot(p.x - pendingObj.x, p.y - pendingObj.y) <= INTERACT_RADIUS
            ) {
              pendingInspectObjectRef.current = null;
              inspectObject(pendingObj);
            } else {
              pendingInspectObjectRef.current = null;
            }
          } else {
            p.isMoving = true;
            soundEngine.playFootstep();
          }
        }
      } else {
        p.isMoving = false;
      }

      // Update drifting leaves & magic embers
      const isWebDriver = typeof navigator !== 'undefined' && navigator.webdriver;
      particlesRef.current.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (!isWebDriver) {
          pt.angle += pt.vAngle;
        }
        if (pt.y > WORLD_HEIGHT + 10) {
          pt.y = -10;
          pt.x = Math.random() * WORLD_WIDTH;
        }
        if (pt.x < -10) {
          pt.x = WORLD_WIDTH + 10;
        }
      });

      const currentNear = findNearestObject(p.x, p.y);

      // Sync React HUD state every ~90ms when moving
      if (time - lastHudSync > 90) {
        lastHudSync = time;
        setPlayerPos((prev) =>
          prev.x === Math.round(p.x) && prev.y === Math.round(p.y)
            ? prev
            : { x: Math.round(p.x), y: Math.round(p.y) }
        );
        setNearbyObject((prev) => (prev?.id === currentNear?.id ? prev : currentNear));
      }

      // Render world onto 1000x640 canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const isVampireSpeaking = Date.now() < vampireSpeechUntilRef.current;
          const isParkCheering = Date.now() < parkCheerUntilRef.current;
          renderWorld(
            ctx,
            time,
            p,
            lighting,
            discoveredRef.current,
            currentNear,
            particlesRef.current,
            isVampireSpeaking,
            isParkCheering
          );
        }
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    animationFrameId = requestAnimationFrame(updateAndDraw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [lighting, inspectObject]);

  // Mobile device and orientation detection
  const [deviceInfo, setDeviceInfo] = useState<{
    isMobile: boolean;
    isPortrait: boolean;
  }>({
    isMobile: false,
    isPortrait: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      if (typeof window === 'undefined') return;
      const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      const isSmallScreen = window.innerWidth < 1024 || window.innerHeight < 600;
      const isMobile = isTouch || isSmallScreen;
      const isPortrait = isMobile && window.innerHeight > window.innerWidth;
      setDeviceInfo({ isMobile, isPortrait });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  const handleToggleDrone = () => {
    const nextDrone = !droneEnabled;
    setDroneEnabled(nextDrone);
    soundEngine.toggleDrone(nextDrone);
  };

  // ===================================================================
  // 1. MOBILE PORTRAIT MODE: Game is NOT visible. ONLY rotation prompt.
  // ===================================================================
  if (deviceInfo.isMobile && deviceInfo.isPortrait) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#110e19] text-amber-50 p-6 text-center select-none">
        <div className="max-w-xs sm:max-w-sm flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-pink-500/50 bg-[#1a1528] shadow-[0_0_35px_rgba(244,114,182,0.3)] backdrop-blur-md">
          <span className="text-5xl animate-bounce" role="img" aria-label="Rotate device to landscape">
            📱🔄
          </span>
          <h2 className="font-arcade text-xs sm:text-sm text-pink-300 tracking-wider">
            PLEASE ROTATE YOUR DEVICE
          </h2>
          <p className="text-xs text-amber-200/90 leading-relaxed font-note">
            Shaily's Midnight Matsuri is a landscape-only game. Please turn your phone sideways to play!
          </p>
        </div>
      </div>
    );
  }

  // ===================================================================
  // 2. MAIN APP VIEW (Mobile Landscape & Desktop)
  // ===================================================================
  return (
    <div
      className="h-screen w-screen max-h-screen overflow-hidden bg-[#14111d] text-amber-50 flex flex-col justify-between select-none"
      data-state="playing"
      data-discovered-notes={discoveredNoteIds.length}
    >
      {/* ===================================================================
          FIXED TOP HEADER
         =================================================================== */}
      <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between gap-1.5 sm:gap-2 border-b border-pink-500/20 bg-[#110e19]/95 px-2.5 py-2 sm:px-5 sm:py-2 w-full">
        {/* Title */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="font-arcade text-[10px] sm:text-sm tracking-tight sm:tracking-wide text-pink-300 drop-shadow-[0_2px_8px_rgba(244,114,182,0.45)] whitespace-nowrap">
            Shaily's Midnight Matsuri
          </span>
          <span className="text-pink-400 font-bold select-none text-xs sm:text-sm hidden md:inline">·</span>
          <span className="font-jp-pixel text-xs sm:text-sm tracking-wide text-pink-300 drop-shadow-[0_2px_8px_rgba(244,114,182,0.45)] whitespace-nowrap hidden md:inline">
            シェイリーの真夜中祭り
          </span>
        </div>

        {/* Action Controls: Mobile Landscape (Emoji Icons) vs Desktop (Text Buttons) */}
        {deviceInfo.isMobile ? (
          /* Mobile Landscape Emoji Header Buttons ONLY */
          <div className="flex shrink-0 items-center gap-2">
            {/* BGM Emoji Button */}
            <button
              type="button"
              onClick={handleToggleDrone}
              aria-label={`Toggle BGM (currently ${droneEnabled ? 'ON' : 'OFF'})`}
              title={`BGM ${droneEnabled ? 'ON' : 'OFF'}`}
              className={`arcade-btn flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-all ${
                droneEnabled
                  ? 'border-pink-400/80 bg-pink-950/90 text-pink-200 shadow-[0_0_8px_rgba(244,114,182,0.4)]'
                  : 'border-amber-500/20 bg-[#1b1726] opacity-60 text-amber-200/60'
              }`}
            >
              <span aria-hidden="true">{droneEnabled ? '🎵' : '🔇'}</span>
            </button>

            {/* Notes Journal Emoji Button with Count */}
            <button
              type="button"
              onClick={() => setIsJournalOpen(true)}
              aria-label={`Open Notes Journal (${discoveredNoteIds.length} of 10 found)`}
              title="Open Notes Journal"
              className="arcade-btn flex items-center gap-1 rounded-lg border border-amber-500/40 bg-[#7c2d12] px-2 py-1 font-arcade text-[9px] text-amber-100 shadow-[0_0_8px_rgba(180,83,9,0.3)] whitespace-nowrap"
            >
              <span aria-hidden="true" className="text-sm">📜</span>
              <span className="tabular-nums font-bold text-[10px]">{discoveredNoteIds.length}/10</span>
            </button>

            {/* Reset Game Emoji Button next to Notes */}
            <button
              type="button"
              onClick={handleResetGame}
              aria-label="Reset game"
              title="Reset game and notes to 0"
              className="arcade-btn flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-950/80 text-sm text-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.3)] hover:bg-rose-900 active:scale-95 transition-transform"
            >
              <span aria-hidden="true">🔄</span>
            </button>
          </div>
        ) : (
          /* Desktop Header Actions (UNCHANGED) */
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={handleToggleDrone}
              aria-label="Toggle BGM"
              title="Toggle BGM"
              className={`arcade-btn flex items-center gap-1 rounded-lg border px-1.5 py-1 sm:px-2.5 font-arcade text-[8px] sm:text-[9px] whitespace-nowrap transition-colors ${
                droneEnabled
                  ? 'border-pink-400/70 bg-pink-950/80 text-pink-200 shadow-[0_0_10px_rgba(244,114,182,0.35)]'
                  : 'border-amber-500/20 bg-[#1b1726] text-amber-200/60 hover:text-white'
              }`}
            >
              <Sparkles className={`h-3 w-3 text-pink-300 ${droneEnabled ? 'animate-pulse' : 'opacity-60'}`} />
              <span>BGM {droneEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsJournalOpen(true)}
              className="arcade-btn flex items-center gap-1 sm:gap-1.5 rounded-lg bg-[#7c2d12] px-2 py-1 sm:px-3 font-arcade text-[8px] sm:text-[10px] text-amber-200/90 hover:bg-[#6c2308] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-300/80" />
              <span className="tabular-nums">NOTES ({discoveredNoteIds.length}/10)</span>
            </button>
          </div>
        )}
      </header>

      {/* ===================================================================
          MAIN WORKSPACE: FULL WIDTH PAN CANVAS (Vertically Scrollable)
         =================================================================== */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-start sm:justify-center p-0 sm:p-2 pb-12 sm:pb-2 overflow-y-auto overflow-x-hidden w-full custom-scrollbar">
        <section
          id="world"
          aria-label="Interactive 16-Bit Shōwa Tokyo World"
          className="relative flex flex-col items-center justify-start sm:justify-center w-full my-0 sm:my-auto"
        >
          {/* Canvas Viewport */}
          <div
            className={`relative overflow-hidden w-full bg-[#14111d] ${
              deviceInfo.isMobile
                ? 'aspect-[1000/720] rounded-none border-y border-amber-500/35 shadow-none'
                : 'rounded-xl border border-amber-500/35 shadow-[0_16px_50px_rgba(0,0,0,0.85)] max-w-[1000px] aspect-[1000/720] max-h-[calc(100vh-96px)] max-w-[calc((100vh-96px)*(1000/720))]'
            }`}
          >
            <canvas
              ref={canvasRef}
              width={WORLD_WIDTH}
              height={WORLD_HEIGHT}
              onClick={handleCanvasClick}
              data-testid="halloween-world-canvas"
              aria-label="Interactive 2D explorable canvas. Tap anywhere to walk and inspect objects."
              className="pixelated-canvas block h-full w-full cursor-pointer touch-pan-y"
            />

            {/* Permanent CRT Scanlines & Curved Screen Vignette */}
            <div
              aria-hidden="true"
              className="crt-scanlines crt-curvature pointer-events-none absolute inset-0 rounded-none sm:rounded-xl"
            />
          </div>
        </section>

        {/* Extra bottom space below canvas bottom line on mobile (same height as header) */}
        {deviceInfo.isMobile && (
          <div className="h-12 w-full shrink-0" aria-hidden="true" />
        )}
      </main>

      {/* ===================================================================
          FOOTER: DESKTOP ONLY (Completely removed on mobile)
         =================================================================== */}
      {!deviceInfo.isMobile && (
        <footer className="sticky bottom-0 z-30 flex shrink-0 items-center justify-between border-t border-amber-500/20 bg-[#110e19]/95 px-2 py-1.5 text-[10px] sm:text-xs text-amber-200/80 w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <Compass className="h-3 w-3 shrink-0 text-orange-400" />
            <span className="font-arcade text-[8px] sm:text-[9px] tabular-nums text-amber-300/90 shrink-0">
              ({playerPos.x}, {playerPos.y})
            </span>
            <span aria-hidden="true" className="shrink-0">·</span>
            <span className="truncate">
              {nearbyObject ? (
                <>
                  <strong className="text-pink-300">
                    Near: {nearbyObject.name}
                  </strong>
                  <span className="text-amber-300/80 hidden sm:inline"> · press [space] to inspect</span>
                </>
              ) : (
                <span className="truncate">arrows or tap canvas to walk</span>
              )}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleResetGame}
              className="arcade-btn px-2 py-0.5 sm:px-2.5 rounded text-[8px] sm:text-[9px] font-arcade tracking-wider text-rose-300/80 hover:text-rose-100 hover:bg-rose-950/70 border border-rose-500/30 transition-colors uppercase whitespace-nowrap"
              title="Reset game and set notes found to 0"
            >
              RESET GAME
            </button>
          </div>
        </footer>
      )}

      {/* ===================================================================
          MODALS (Welcome Modal, Note Discovery, Journal, 100% Victory)
         =================================================================== */}
      {isWelcomeOpen && !deviceInfo.isPortrait && (
        <WelcomeModal onStart={handleStartGame} />
      )}

      {activeNoteObject && (
        <NoteModal
          object={activeNoteObject}
          isNewDiscovery={isNewDiscovery}
          discoveredCount={discoveredNoteIds.length}
          onClose={handleCloseNoteModal}
          onOpenJournal={() => {
            setActiveNoteObject(null);
            setIsJournalOpen(true);
          }}
        />
      )}

      {isJournalOpen && (
        <JournalModal
          discoveredNoteIds={discoveredNoteIds}
          onClose={() => setIsJournalOpen(false)}
          onSelectNote={(obj) => {
            setIsJournalOpen(false);
            setIsNewDiscovery(false);
            setActiveNoteObject(obj);
          }}
        />
      )}

      {isVictoryOpen && (
        <VictoryModal
          onKeepExploring={() => setIsVictoryOpen(false)}
          onResetGame={handleResetGame}
        />
      )}
    </div>
  );
}
