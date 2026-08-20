import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCENES } from '../data/scenes';
import { useLenis } from '../components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

export interface SceneState {
  index: number;
  id: string;
  localProgress: number; // 0 to 1 strictly clamped
  opacity: number;       // 0 to 1 with 15% crossfade
  isVisible: boolean;    // true when opacity > 0
  zIndex: number;        // dynamic stacking
}

export interface SceneProgressOutput {
  globalProgress: number;
  activeSceneIndex: number;
  scenesState: SceneState[];
  visibleScenes: { index: number; title: string; opacity: number }[];
  scrollVelocity: number;
  accumulatedDistance: number;
  scrollToScene: (index: number) => void;
}

export const useSceneProgress = (containerRef: React.RefObject<HTMLElement | null>): SceneProgressOutput => {
  const [globalProgress, setGlobalProgress] = useState<number>(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(1);
  const [scrollVelocity, setScrollVelocity] = useState<number>(0);
  const [accumulatedDistance, setAccumulatedDistance] = useState<number>(0);
  const { lenis } = useLenis();

  const totalScenes = SCENES.length;
  const lastScrollYRef = useRef<number>(0);
  const accumulatedDistanceRef = useRef<number>(0);

  // 15% crossfade overlap window relative to each scene's segment
  const CROSSFADE_RATIO = 0.15;

  // Calculate per-scene visibility, local progress, and opacity
  const computeScenesState = useCallback(
    (progress: number): SceneState[] => {
      const segmentSize = 1 / totalScenes;
      const crossfadeSize = segmentSize * CROSSFADE_RATIO;

      return SCENES.map((scene) => {
        const i = scene.index; // 1-indexed
        const startP = (i - 1) * segmentSize;
        const endP = i * segmentSize;

        // Active range including crossfade window
        const activeStart = Math.max(0, startP - (i > 1 ? crossfadeSize : 0));
        const activeEnd = Math.min(1, endP + (i < totalScenes ? crossfadeSize : 0));

        let localP = (progress - startP) / segmentSize;
        // Strictly clamp local progress at boundaries to prevent layer drift off-screen
        localP = Math.max(0, Math.min(1, localP));

        let opacity = 0;
        if (progress >= activeStart && progress <= activeEnd) {
          if (progress < startP && i > 1) {
            // Fade in during entry crossfade
            opacity = (progress - activeStart) / crossfadeSize;
          } else if (progress > endP && i < totalScenes) {
            // Fade out during exit crossfade
            opacity = 1 - (progress - endP) / crossfadeSize;
          } else {
            // Fully opaque within core active interval
            opacity = 1.0;
          }
        }

        // Round tiny residual values
        opacity = Math.max(0, Math.min(1, Math.round(opacity * 1000) / 1000));
        const isVisible = opacity > 0.001;

        return {
          index: i,
          id: scene.id,
          localProgress: localP,
          opacity,
          isVisible,
          zIndex: isVisible ? i * 10 : 0,
        };
      });
    },
    [totalScenes]
  );

  const [scenesState, setScenesState] = useState<SceneState[]>(() => computeScenesState(0));

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));
        setGlobalProgress(progress);

        // Update active scene index
        const rawScene = progress * totalScenes;
        const index = progress >= 0.99 ? totalScenes : Math.min(totalScenes, Math.max(1, Math.floor(rawScene) + 1));
        setActiveSceneIndex(index);

        // Compute scenes state with strict visibility gating
        const computed = computeScenesState(progress);
        setScenesState(computed);

        // Track velocity and cumulative distance for walk cycle
        const velocity = Math.abs(self.getVelocity());
        setScrollVelocity(velocity);

        const currentY = self.scroll();
        const deltaY = Math.abs(currentY - lastScrollYRef.current);
        lastScrollYRef.current = currentY;

        if (deltaY > 0) {
          accumulatedDistanceRef.current += deltaY;
          setAccumulatedDistance(accumulatedDistanceRef.current);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [containerRef, totalScenes, computeScenesState]);

  const scrollToScene = useCallback(
    (sceneIndex: number) => {
      if (!containerRef.current) return;
      const targetProgress =
        sceneIndex === 1
          ? 0
          : sceneIndex === totalScenes
          ? 1
          : ((sceneIndex - 1) + 0.05) / totalScenes;

      const scrollHeight = containerRef.current.offsetHeight - window.innerHeight;
      const targetScroll = targetProgress * scrollHeight;

      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    },
    [containerRef, totalScenes, lenis]
  );

  const visibleScenes = scenesState
    .filter((s) => s.isVisible)
    .map((s) => {
      const sc = SCENES.find((x) => x.index === s.index);
      return {
        index: s.index,
        title: sc ? sc.title : `Scene ${s.index}`,
        opacity: s.opacity,
      };
    });

  return {
    globalProgress,
    activeSceneIndex,
    scenesState,
    visibleScenes,
    scrollVelocity,
    accumulatedDistance,
    scrollToScene,
  };
};
