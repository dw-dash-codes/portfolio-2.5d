import React, { useState, useEffect, useRef } from 'react';

interface VisibleSceneInfo {
  index: number;
  title: string;
  opacity: number;
}

interface DebugOverlayProps {
  activeSceneIndex: number;
  globalProgress: number;
  localProgress: number;
  visibleScenes: VisibleSceneInfo[];
  scrollVelocity: number;
  accumulatedDistance: number;
  isReducedMotion?: boolean;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  activeSceneIndex,
  globalProgress,
  localProgress,
  visibleScenes,
  scrollVelocity,
  accumulatedDistance,
  isReducedMotion = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number | null>(null);

  // Toggle HUD on `~` / ` or `d` / `D`
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === '`' || e.key === '~' || e.key === 'd' || e.key === 'D') {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Rolling FPS calculation
  useEffect(() => {
    if (!isOpen) return;

    const tick = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (delta > 0) {
        const currentFps = 1000 / delta;
        frameTimesRef.current.push(currentFps);
        if (frameTimesRef.current.length > 30) {
          frameTimesRef.current.shift();
        }

        const avgFps =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;
        setFps(Math.round(avgFps));
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isOpen]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-3 left-3 z-[100] font-mono text-[10px] text-sand-400/60 pointer-events-none select-none">
        Press <span className="px-1 py-0.5 rounded bg-navy-900/60 border border-sand-400/30 text-sand-200">`</span> or <span className="px-1 py-0.5 rounded bg-navy-900/60 border border-sand-400/30 text-sand-200">D</span> for Debug HUD
      </div>
    );
  }

  const hasOverlapBug = visibleScenes.length > 2;

  return (
    <aside
      aria-label="Engine Debug Monitor"
      className="fixed bottom-4 left-4 z-[100] p-4 rounded-xl bg-navy-900/95 border border-sand-400/40 backdrop-blur-xl text-sand-50 font-mono text-xs shadow-2xl space-y-2.5 max-w-sm pointer-events-auto select-none"
    >
      <div className="flex items-center justify-between border-b border-sand-400/20 pb-2">
        <span className="font-bold tracking-wider text-sand-200 uppercase">
          ENGINE DEBUG HUD
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            fps >= 55
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : fps >= 30
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}
        >
          {fps} FPS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <span className="text-sand-400">Active Scene:</span>
          <span className="ml-1 text-sand-50 font-bold">0{activeSceneIndex}</span>
        </div>
        <div>
          <span className="text-sand-400">Global (P):</span>
          <span className="ml-1 text-sand-50 font-bold">{(globalProgress * 100).toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-sand-400">Local (p):</span>
          <span className="ml-1 text-sand-50 font-bold">{localProgress.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-sand-400">Velocity:</span>
          <span className="ml-1 text-sand-50">{Math.round(scrollVelocity)} px/s</span>
        </div>
        <div>
          <span className="text-sand-400">Distance:</span>
          <span className="ml-1 text-sand-50">{Math.round(accumulatedDistance)} px</span>
        </div>
        <div>
          <span className="text-sand-400">Reduced Motion:</span>
          <span className={`ml-1 font-bold ${isReducedMotion ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isReducedMotion ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Live Visible Scenes Gating Monitor */}
      <div className="pt-2 border-t border-sand-400/20 space-y-1">
        <div className="flex justify-between items-center text-[10px] text-sand-400">
          <span>ACTIVE SCENES (OPACITY &gt; 0):</span>
          <span className={`font-bold ${hasOverlapBug ? 'text-rose-400' : 'text-emerald-400'}`}>
            {visibleScenes.length} ACTIVE {hasOverlapBug && '(! OVERLAP BUG)'}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {visibleScenes.map((s) => (
            <div
              key={s.index}
              className="flex justify-between items-center px-2 py-1 rounded bg-navy-800/80 border border-sand-400/20 text-[10px]"
            >
              <span className="text-sand-200">
                0{s.index} // {s.title}
              </span>
              <span className="text-indigo-300 font-bold">
                op: {s.opacity.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
