import { useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCENES } from '../data/scenes';
import { useLenis } from '../components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollMasterState {
  currentSceneIndex: number;
  sceneProgress: number; // 0 to 1 progress within current active scene
  globalProgress: number; // 0 to 1 across entire experience
  scrollToScene: (sceneIndex: number) => void;
}

export const useScrollMaster = (containerRef: React.RefObject<HTMLElement | null>): ScrollMasterState => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(1);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [globalProgress, setGlobalProgress] = useState<number>(0);
  const { lenis } = useLenis();

  const totalScenes = SCENES.length;

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

        // Map global progress (0.0 to 1.0) to discrete scene index (1 to totalScenes)
        const rawScene = progress * totalScenes;
        const index = progress >= 0.99 ? totalScenes : Math.min(totalScenes, Math.max(1, Math.floor(rawScene) + 1));
        const subProgress = progress >= 0.99 ? 1 : rawScene - (index - 1);

        setCurrentSceneIndex(index);
        setSceneProgress(Math.max(0, Math.min(1, subProgress)));
      },
    });

    return () => {
      trigger.kill();
    };
  }, [containerRef, totalScenes]);

  const scrollToScene = useCallback(
    (sceneIndex: number) => {
      if (!containerRef.current) return;
      const targetProgress =
        sceneIndex === 1
          ? 0
          : sceneIndex === totalScenes
          ? 1
          : ((sceneIndex - 1) + 0.1) / totalScenes;

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

  return {
    currentSceneIndex,
    sceneProgress,
    globalProgress,
    scrollToScene,
  };
};
