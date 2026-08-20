# 2.5D Scroll-Story Portfolio: Architecture & Technical Specification

## Executive Summary
This document defines the complete technical architecture, data model, performance budget, asset pipeline, and visual breakdown for the **2.5D Scroll-Story Portfolio**. The project is an ultra-performant, scroll-driven cinematic experience that leads a visitor through 6 scenes using layered 2.5D parallax, CSS 3D transforms, and synchronized DOM elements driven strictly by scroll progress.

---

## 1. 2026 Best Practices Research: Scroll-Driven Layered Parallax

### 1.1 Single-Stage Pinning & Master Timeline Scrubbing
* **Architecture Pattern:** A single fixed viewport stage (`<div id="viewport-stage" className="fixed inset-0 w-screen h-screen overflow-hidden">`) is pinned while the parent scroll container (`<div id="scroll-track" className="h-[600vh] relative">`) provides the total scroll distance.
* **Master Timeline Choreography:** A single master `gsap.timeline()` controls all 6 scenes. Each scene is constructed as an independent nested sub-timeline sequenced using relative position labels (`tl.add(scene1Tl, 0).add(scene2Tl, 1.0)...`).
* **Lenis + ScrollTrigger Synchronization:**
  To eliminate frame drops and scroll-lag jitter between the virtual smooth scroll loop and GSAP's internal ticker, Lenis is bound directly to the `gsap.ticker`:
  ```typescript
  // Lenis + GSAP Ticker Synchronization
  const lenis = new Lenis({
    lerp: 0.08, // Liquid momentum feel
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0); // Prevents jumps after tab refocus
  ```
* **Benefits:** Scrubbing one master timeline eliminates race conditions, scroll-snapping glitches, and competing layout recalculations between disjointed ScrollTrigger instances.

### 1.2 GPU Memory Optimization & Layer Mitigation
* **The Layer Explosion Problem:** An uncompressed 1920×1080 RGBA layer occupies $1920 \times 1080 \times 4 \text{ bytes} \approx 8.29\text{ MB}$ of GPU VRAM. In a 6-scene project with 4–5 layers per scene (25–30 layers total), holding all layers in VRAM simultaneously would consume **~250 MB VRAM**, crashing mobile Safari (iOS WebKit memory limit) and causing dropped frames on low-end GPUs.
* **Production Mitigation Strategies:**
  1. **Layer Virtualization & Active Range Toggling:**
     Only the currently active scene and the immediate adjacent transition scene are rendered in the GPU compositor. Off-stage scenes are set to `visibility: hidden` (or `pointer-events: none; opacity: 0`) and their `will-change` properties are dynamically released.
  2. **Tight Bounding-Box Cutouts vs. Full Plates:**
     Full 1920×1080 canvases are used *only* for base background plates. All foreground elements (doors, character, pillars, frames) are trimmed to their exact non-transparent bounding boxes and positioned via percentage offsets.
  3. **Strict Composite-Only Property Animation:**
     Animations strictly manipulate `transform` (`translate3d`, `scale3d`, `rotate3d`) and `opacity`. Never animate `top`, `left`, `width`, `height`, or `filter` (which force CPU layout and repaint cycles).
  4. **Subpixel Jitter & Squashing Prevention:**
     Each layer receives `transform: translateZ(0)` to promote to an isolated compositor layer during its active window, preventing browser layer squashing artifacts.

### 1.3 `gsap.quickSetter` / `gsap.quickTo` vs. Standard Tweens
* **Master Timeline Tweens:**
  Pre-compiled standard GSAP tweens (`tl.to(layer, { xPercent, yPercent, scale, ease: "none" })`) are used for all deterministic scroll-scrubbed transformations. GSAP interpolates timeline values directly based on scroll progress with near-zero runtime allocation.
* **`gsap.quickSetter`:**
  Used for direct per-frame property assignment without tween overhead (up to 250% faster than `gsap.set`). Ideal for high-frequency cursor/gyro micro-parallax on foreground layers.
* **`gsap.quickTo`:**
  Reuses a single persistent tween instance with smoothing (`duration`, `ease: "power2.out"`). Ideal for tracking scroll velocity damping, camera inertia, and walk-cycle bobbing.

### 1.4 CSS 3D Hinge Physics (`perspective`, `rotateY`, `transform-origin`)
* **3D Viewport Geometry:**
  The stage defines `perspective: 1200px` (approximating a natural 35mm camera focal length on desktop viewports) and `perspective-origin: 50% 50%`.
* **Hinge Mechanics:**
  - **Left Door Hinge (Scene 3):** `transform-origin: left center`, `transform: rotateY(0deg) -> rotateY(-85deg) translateZ(0)`.
  - **Right Door Hinge (Scene 4):** `transform-origin: right center`, `transform: rotateY(0deg) -> rotateY(85deg) translateZ(0)`.
  - **Sliding Portal Doors (Scene 2 & 5):** Dual panels animating `xPercent: 0 -> -100` (Left) and `xPercent: 0 -> 100` (Right) with subtle depth recession `scale: 1.0 -> 0.96`.
* **Lighting & Shading Compensation:**
  A dynamic CSS overlay gradient (`linear-gradient(...)`) interpolates `opacity` as the door rotates, simulating directional light falloff and shadows cast as the door swings open.

### 1.5 Scroll Velocity-Driven Walk Cycle
* **Sprite Architecture:**
  The character uses a 12-frame walk cycle sprite sheet (AVIF/WebP) with transparent background.
* **Velocity Tracking & Frame Quantization:**
  Lenis scroll updates and `ScrollTrigger.getVelocity()` provide the instantaneous scroll velocity ($v$).
  ```typescript
  // Velocity-driven character sprite controller
  let isWalking = false;
  let currentFrame = 0;
  const totalFrames = 12;

  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity(); // px/sec
      const direction = self.direction; // 1 (forward) or -1 (reverse)

      if (Math.abs(velocity) > 50) {
        // Character is in motion: step frame based on scroll distance traversed
        const frameIndex = Math.floor(Math.abs(self.progress * 120)) % totalFrames;
        characterSetter(direction > 0 ? `-${frameIndex * 100}% 0` : `-${(totalFrames - 1 - frameIndex) * 100}% 0`);
      } else {
        // Snap smoothly to neutral idle frame (Frame 0)
        characterSetter("0% 0");
      }
    }
  });
  ```
* **Character Spatial Trajectory:**
  While the sprite sheet steps through the walk animation, the master timeline translates and scales the character element (`yPercent`, `xPercent`, `scale`), physically walking them deeper into the scene or opening doors.

### 1.6 Research Citations
1. **GSAP Documentation (2025–2026):** ScrollTrigger Performance & Master Timeline Scrubbing (`gsap.com/docs/v3/Plugins/ScrollTrigger`).
2. **Lenis Smooth Scroll Specification:** Hardware-accelerated RAF synchronization and momentum scrolling by Studio Freight / Darkroom (`github.com/darkroomengineering/lenis`).
3. **Google Chrome Web Fundamentals:** GPU Compositing, Layer Memory Allocation, and `will-change` lifecycle management (`web.dev/articles/gpu-compositing`).
4. **W3C CSS Transforms Module Level 2:** 3D Rendering Contexts, Perspective Projection, and Matrix Decomposition (`w3.org/TR/css-transforms-2`).

---

## 2. Scene & Layer TypeScript Data Model

The entire portfolio story is structured as a typed configuration schema.

```typescript
// src/types/scene.ts

export type DoorType = 
  | 'none' 
  | 'sliding-double' 
  | 'hinge-left' 
  | 'hinge-right';

export interface CameraMove {
  scale: [number, number];       // [startScale, endScale] e.g. [1.0, 1.35]
  xPercent: [number, number];   // [startX, endX]
  yPercent: [number, number];   // [startY, endY]
  ease?: string;                // default "power2.inOut"
}

export interface LayerParallax {
  xRange: [number, number];     // [startPxOrPercent, endPxOrPercent]
  yRange: [number, number];     // [startPxOrPercent, endPxOrPercent]
}

export interface Layer {
  id: string;
  name: string;
  src: string;                  // Base image asset path (without extension)
  depth: number;                // 0.0 (infinite background) to 1.0 (extreme foreground)
  zIndex: number;               // Explicit stacking order (1 to 50)
  isCutout: boolean;            // true = transparent cutout PNG/AVIF, false = full-bleed plate
  dimensions: {
    width: number;
    height: number;
  };
  parallax: LayerParallax;
  scaleRange: [number, number]; // [startScale, endScale]
  opacityRange: [number, number]; // [startOpacity, endOpacity]
  transformOrigin?: string;     // e.g. "left center" for doors
  customStyle?: React.CSSProperties;
}

export interface SceneDOMContent {
  sectionKey: string;
  heading: string;
  subheading?: string;
  category: 'exterior' | 'threshold' | 'skills' | 'architecture' | 'gallery' | 'contact';
}

export interface Scene {
  id: string;
  index: number;
  title: string;
  slug: string;
  durationVh: number;           // Scroll distance in viewport heights (e.g. 100vh)
  doorType: DoorType;
  cameraMove: CameraMove;
  layers: Layer[];
  domContent: SceneDOMContent;
}
```

---

## 3. Concrete 6-Scene Mapping & Mathematical Justification

### Depth & Parallax Law
In a realistic 2.5D camera projection:
* **Background ($D = 0.05 - 0.20$):** High depth, minimal movement ($\Delta y \approx 2\% - 6\%$, $\Delta \text{scale} \approx 1.0 - 1.04$).
* **Midground Architecture ($D = 0.35 - 0.60$):** Moderate movement ($\Delta y \approx 8\% - 18\%$, $\Delta \text{scale} \approx 1.0 - 1.18$).
* **Character ($D = 0.65 - 0.80$):** Walks inward, scaling up/down to match perspective camera push.
* **Interactive Elements / Doors ($D = 0.70 - 0.85$):** Active spatial transforms (rotations, slides).
* **Foreground Framing ($D = 0.90 - 1.00$):** Low depth / close to lens, high parallax motion ($\Delta y \approx 25\% - 45\%$, $\Delta \text{scale} \approx 1.1 - 1.35$).

```typescript
// src/config/scenes.ts
import { Scene } from '../types/scene';

export const SCENES_CONFIG: Scene[] = [
  // =========================================================================
  // SCENE 1: ARRIVAL / EXTERIOR
  // =========================================================================
  {
    id: 'scene-1-exterior',
    index: 1,
    title: 'Arrival / Exterior',
    slug: 'arrival',
    durationVh: 100,
    doorType: 'none',
    cameraMove: {
      scale: [1.0, 1.28],
      xPercent: [0, 0],
      yPercent: [0, -6],
      ease: 'power2.inOut',
    },
    domContent: {
      sectionKey: 'hero',
      heading: 'ALEX MORGAN',
      subheading: 'Principal Software Architect & Full-Stack Systems Engineer',
      category: 'exterior',
    },
    layers: [
      {
        id: 's1-sky-mountains',
        name: 'Background Sky & Distant Horizon',
        src: '/assets/images/scene1/sky_bg',
        depth: 0.1,
        zIndex: 10,
        isCutout: false,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, 0], yRange: [0, -3] },
        scaleRange: [1.0, 1.03],
        opacityRange: [1.0, 0.0], // Fades to transition to interior
      },
      {
        id: 's1-building-facade',
        name: 'Modernist House Architecture',
        src: '/assets/images/scene1/building_facade',
        depth: 0.45,
        zIndex: 20,
        isCutout: true,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, 0], yRange: [0, -8] },
        scaleRange: [1.0, 1.20],
        opacityRange: [1.0, 0.0],
      },
      {
        id: 's1-entrance-steps',
        name: 'Concrete Stairs & Courtyard Entrance',
        src: '/assets/images/scene1/entrance_steps',
        depth: 0.65,
        zIndex: 25,
        isCutout: true,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, 0], yRange: [0, -14] },
        scaleRange: [1.0, 1.28],
        opacityRange: [1.0, 0.0],
      },
      {
        id: 's1-character-walk',
        name: 'Walking Character (Approaching Portal)',
        src: '/assets/images/character/walk_cycle_sprite',
        depth: 0.75,
        zIndex: 30,
        isCutout: true,
        dimensions: { width: 3840, height: 640 }, // 12-frame sprite sheet (320x640 per frame)
        parallax: { xRange: [-8, -2], yRange: [12, -18] }, // Moves from left-center toward door
        scaleRange: [1.0, 0.72], // Scales down as character walks into distance
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's1-foreground-flora',
        name: 'Courtyard Desert Flora Framing',
        src: '/assets/images/scene1/foreground_flora',
        depth: 0.95,
        zIndex: 40,
        isCutout: true,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [-4, 6], yRange: [0, -32] },
        scaleRange: [1.0, 1.42],
        opacityRange: [1.0, 0.0],
      },
    ],
  },

  // =========================================================================
  // SCENE 2: ENTRANCE / THRESHOLD
  // =========================================================================
  {
    id: 'scene-2-threshold',
    index: 2,
    title: 'Entrance / Threshold',
    slug: 'threshold',
    durationVh: 100,
    doorType: 'sliding-double',
    cameraMove: {
      scale: [1.0, 1.35],
      xPercent: [0, 0],
      yPercent: [0, -4],
      ease: 'power2.inOut',
    },
    domContent: {
      sectionKey: 'threshold',
      heading: 'ENTER THE WORKSPACE',
      subheading: 'Exploring systems architecture from core to edge',
      category: 'threshold',
    },
    layers: [
      {
        id: 's2-corridor-deep',
        name: 'Deep Corridor Perspective & Ceiling Light Cove',
        src: '/assets/images/scene2/corridor_bg',
        depth: 0.15,
        zIndex: 10,
        isCutout: false,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, 0], yRange: [0, -4] },
        scaleRange: [1.0, 1.08],
        opacityRange: [0.0, 1.0],
      },
      {
        id: 's2-sliding-door-left',
        name: 'Architectural Door Panel Left',
        src: '/assets/images/scene2/door_panel_left',
        depth: 0.70,
        zIndex: 22,
        isCutout: true,
        dimensions: { width: 800, height: 1440 },
        parallax: { xRange: [0, -85], yRange: [0, 0] }, // Slides left to open
        scaleRange: [1.0, 1.15],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's2-sliding-door-right',
        name: 'Architectural Door Panel Right',
        src: '/assets/images/scene2/door_panel_right',
        depth: 0.70,
        zIndex: 22,
        isCutout: true,
        dimensions: { width: 800, height: 1440 },
        parallax: { xRange: [0, 85], yRange: [0, 0] }, // Slides right to open
        scaleRange: [1.0, 1.15],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's2-character-opening',
        name: 'Character Pushing Door & Stepping Through',
        src: '/assets/images/character/walk_cycle_sprite',
        depth: 0.78,
        zIndex: 30,
        isCutout: true,
        dimensions: { width: 3840, height: 640 },
        parallax: { xRange: [-25, -12], yRange: [6, -10] },
        scaleRange: [1.0, 0.88],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's2-portal-frame',
        name: 'Threshold Portal Wall & Shadow Bevel',
        src: '/assets/images/scene2/portal_frame',
        depth: 0.90,
        zIndex: 40,
        isCutout: true,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, 0], yRange: [0, -26] },
        scaleRange: [1.0, 1.45],
        opacityRange: [1.0, 0.0],
      },
    ],
  },

  // =========================================================================
  // SCENE 3: FULL-STACK DEVELOPMENT (Room 1)
  // =========================================================================
  {
    id: 'scene-3-fullstack',
    index: 3,
    title: 'Full-Stack Development',
    slug: 'full-stack',
    durationVh: 120,
    doorType: 'hinge-left',
    cameraMove: {
      scale: [1.0, 1.30],
      xPercent: [0, 8],
      yPercent: [0, -3],
      ease: 'power2.inOut',
    },
    domContent: {
      sectionKey: 'skills',
      heading: 'FULL-STACK DEVELOPMENT',
      subheading: 'Modern web architectures, responsive systems, and end-to-end tooling',
      category: 'skills',
    },
    layers: [
      {
        id: 's3-room-interior-bg',
        name: 'Skylit Room Chamber with Wall Wash Lighting',
        src: '/assets/images/scene3/room_bg',
        depth: 0.20,
        zIndex: 10,
        isCutout: false,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, -4], yRange: [0, -6] },
        scaleRange: [1.0, 1.10],
        opacityRange: [0.0, 1.0],
      },
      {
        id: 's3-door-hinge-left',
        name: 'Left Hinged Architectural Room Door',
        src: '/assets/images/scene3/door_hinge_left',
        depth: 0.72,
        zIndex: 25,
        isCutout: true,
        dimensions: { width: 720, height: 1440 },
        parallax: { xRange: [0, -15], yRange: [0, 0] },
        scaleRange: [1.0, 1.12],
        opacityRange: [1.0, 1.0],
        transformOrigin: 'left center', // Rotates -85deg on Y axis
      },
      {
        id: 's3-character-holding-door',
        name: 'Character at Left Holding Open Chamber Door',
        src: '/assets/images/character/walk_cycle_sprite',
        depth: 0.76,
        zIndex: 30,
        isCutout: true,
        dimensions: { width: 3840, height: 640 },
        parallax: { xRange: [-35, -30], yRange: [4, -4] },
        scaleRange: [0.95, 0.95],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's3-foreground-corridor-pillar',
        name: 'Foreground Corridor Wall Cutout',
        src: '/assets/images/scene3/corridor_pillar',
        depth: 0.95,
        zIndex: 40,
        isCutout: true,
        dimensions: { width: 600, height: 1440 },
        parallax: { xRange: [0, -35], yRange: [0, -28] },
        scaleRange: [1.0, 1.40],
        opacityRange: [1.0, 0.0],
      },
    ],
  },

  // =========================================================================
  // SCENE 4: BACKEND & AI PIPELINES (Room 2)
  // =========================================================================
  {
    id: 'scene-4-backend-ai',
    index: 4,
    title: 'Backend & AI Pipelines',
    slug: 'backend-ai',
    durationVh: 130,
    doorType: 'hinge-right',
    cameraMove: {
      scale: [1.0, 1.25],
      xPercent: [0, -6],
      yPercent: [0, -4],
      ease: 'power2.inOut',
    },
    domContent: {
      sectionKey: 'architecture',
      heading: 'BACKEND ARCHITECTURE & AI PIPELINES',
      subheading: 'Distributed microservices, vector search pipelines, and low-latency inference',
      category: 'architecture',
    },
    layers: [
      {
        id: 's4-indigo-chamber-bg',
        name: 'Indigo High-Contrast Tech Chamber Atmosphere',
        src: '/assets/images/scene4/indigo_chamber_bg',
        depth: 0.20,
        zIndex: 10,
        isCutout: false,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, 4], yRange: [0, -5] },
        scaleRange: [1.0, 1.08],
        opacityRange: [0.0, 1.0],
      },
      {
        id: 's4-door-hinge-right',
        name: 'Right Hinged Monolithic Chamber Door',
        src: '/assets/images/scene4/door_hinge_right',
        depth: 0.75,
        zIndex: 25,
        isCutout: true,
        dimensions: { width: 780, height: 1440 },
        parallax: { xRange: [0, 18], yRange: [0, 0] },
        scaleRange: [1.0, 1.14],
        opacityRange: [1.0, 1.0],
        transformOrigin: 'right center', // Rotates 85deg on Y axis
      },
      {
        id: 's4-character-right-door',
        name: 'Character at Right Opening Blueprint Door',
        src: '/assets/images/character/walk_cycle_sprite',
        depth: 0.78,
        zIndex: 30,
        isCutout: true,
        dimensions: { width: 3840, height: 640 },
        parallax: { xRange: [28, 24], yRange: [6, -2] },
        scaleRange: [0.95, 0.95],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's4-foreground-edge',
        name: 'Corridor Perspective Foreground Framing',
        src: '/assets/images/scene4/corridor_edge',
        depth: 0.95,
        zIndex: 40,
        isCutout: true,
        dimensions: { width: 500, height: 1440 },
        parallax: { xRange: [0, 30], yRange: [0, -25] },
        scaleRange: [1.0, 1.38],
        opacityRange: [1.0, 0.0],
      },
    ],
  },

  // =========================================================================
  // SCENE 5: WEB APPLICATION GALLERY (Room 3)
  // =========================================================================
  {
    id: 'scene-5-gallery',
    index: 5,
    title: 'Web Application Gallery',
    slug: 'gallery',
    durationVh: 140,
    doorType: 'sliding-double',
    cameraMove: {
      scale: [1.0, 1.32],
      xPercent: [0, 0],
      yPercent: [0, -5],
      ease: 'power2.inOut',
    },
    domContent: {
      sectionKey: 'gallery',
      heading: 'FEATURED CASE STUDIES',
      subheading: 'Interactive SaaS platforms, design systems, and enterprise cloud applications',
      category: 'gallery',
    },
    layers: [
      {
        id: 's5-gallery-space-bg',
        name: 'Expansive Modern Gallery Space with Diffuse Light Ceiling',
        src: '/assets/images/scene5/gallery_space_bg',
        depth: 0.18,
        zIndex: 10,
        isCutout: false,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, 0], yRange: [0, -5] },
        scaleRange: [1.0, 1.10],
        opacityRange: [0.0, 1.0],
      },
      {
        id: 's5-pedestals-floor',
        name: 'Architectural Pedestals & Polished Floor Reflection',
        src: '/assets/images/scene5/pedestals_floor',
        depth: 0.50,
        zIndex: 20,
        isCutout: true,
        dimensions: { width: 2560, height: 800 },
        parallax: { xRange: [0, 0], yRange: [0, -12] },
        scaleRange: [1.0, 1.20],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's5-gallery-doors-left',
        name: 'Gallery Double Portal Left Door',
        src: '/assets/images/scene5/portal_door_left',
        depth: 0.70,
        zIndex: 22,
        isCutout: true,
        dimensions: { width: 650, height: 1440 },
        parallax: { xRange: [0, -70], yRange: [0, 0] },
        scaleRange: [1.0, 1.12],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's5-gallery-doors-right',
        name: 'Gallery Double Portal Right Door',
        src: '/assets/images/scene5/portal_door_right',
        depth: 0.70,
        zIndex: 22,
        isCutout: true,
        dimensions: { width: 650, height: 1440 },
        parallax: { xRange: [0, 70], yRange: [0, 0] },
        scaleRange: [1.0, 1.12],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's5-character-gallery-walk',
        name: 'Character Walking Forward Into Gallery Center',
        src: '/assets/images/character/walk_cycle_sprite',
        depth: 0.74,
        zIndex: 30,
        isCutout: true,
        dimensions: { width: 3840, height: 640 },
        parallax: { xRange: [-18, -6], yRange: [8, -8] },
        scaleRange: [1.0, 0.82],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's5-foreground-portal-arch',
        name: 'Foreground Portal Archway Framing',
        src: '/assets/images/scene5/portal_arch',
        depth: 0.95,
        zIndex: 40,
        isCutout: true,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, 0], yRange: [0, -30] },
        scaleRange: [1.0, 1.42],
        opacityRange: [1.0, 0.0],
      },
    ],
  },

  // =========================================================================
  // SCENE 6: CONTACT / DESTINATION
  // =========================================================================
  {
    id: 'scene-6-contact',
    index: 6,
    title: 'Contact / Destination',
    slug: 'contact',
    durationVh: 100,
    doorType: 'none',
    cameraMove: {
      scale: [1.0, 1.15],
      xPercent: [0, 0],
      yPercent: [0, -2],
      ease: 'power2.out',
    },
    domContent: {
      sectionKey: 'contact',
      heading: "LET'S BUILD SOMETHING GREAT",
      subheading: 'Available for high-impact architecture, engineering leadership, and bespoke web platforms.',
      category: 'contact',
    },
    layers: [
      {
        id: 's6-contact-wall-bg',
        name: 'Monolithic Architectural Feature Wall with Overhead Spotlight Cones',
        src: '/assets/images/scene6/contact_wall_bg',
        depth: 0.25,
        zIndex: 10,
        isCutout: false,
        dimensions: { width: 2560, height: 1440 },
        parallax: { xRange: [0, 0], yRange: [0, -4] },
        scaleRange: [1.0, 1.05],
        opacityRange: [0.0, 1.0],
      },
      {
        id: 's6-character-standing-destination',
        name: 'Character Reached Final Destination (Stands Contemplating Wall)',
        src: '/assets/images/character/walk_cycle_sprite',
        depth: 0.80,
        zIndex: 30,
        isCutout: true,
        dimensions: { width: 3840, height: 640 },
        parallax: { xRange: [0, 0], yRange: [6, 0] },
        scaleRange: [0.85, 0.85],
        opacityRange: [1.0, 1.0],
      },
      {
        id: 's6-foreground-floor-plane',
        name: 'Polished Concrete Foreground Floor Reflection',
        src: '/assets/images/scene6/floor_reflection',
        depth: 0.90,
        zIndex: 40,
        isCutout: true,
        dimensions: { width: 2560, height: 600 },
        parallax: { xRange: [0, 0], yRange: [0, -18] },
        scaleRange: [1.0, 1.25],
        opacityRange: [1.0, 1.0],
      },
    ],
  },
];
```

---

## 4. Complete Project Directory Structure

```
portfolio-2.5d/
├── .agents/
├── docs/
│   ├── ARCHITECTURE.md                  # This document
│   └── STORYBOARD_SPEC.md              # Storyboard breakdown & frame cues
├── public/
│   ├── assets/
│   │   ├── fonts/                       # Self-hosted Inter & Outfit WOFF2
│   │   └── images/
│   │       ├── character/
│   │       │   ├── walk_cycle_sprite.avif
│   │       │   └── walk_cycle_sprite.webp
│   │       ├── scene1/
│   │       │   ├── sky_bg-1920.avif / .webp
│   │       │   ├── building_facade-1920.avif / .webp
│   │       │   ├── entrance_steps-1920.avif / .webp
│   │       │   └── foreground_flora-1920.avif / .webp
│   │       ├── scene2/
│   │       │   ├── corridor_bg-1920.avif / .webp
│   │       │   ├── door_panel_left.avif / .webp
│   │       │   ├── door_panel_right.avif / .webp
│   │       │   └── portal_frame-1920.avif / .webp
│   │       ├── scene3/
│   │       │   ├── room_bg-1920.avif / .webp
│   │       │   ├── door_hinge_left.avif / .webp
│   │       │   └── corridor_pillar.avif / .webp
│   │       ├── scene4/
│   │       │   ├── indigo_chamber_bg-1920.avif / .webp
│   │       │   ├── door_hinge_right.avif / .webp
│   │       │   └── corridor_edge.avif / .webp
│   │       ├── scene5/
│   │       │   ├── gallery_space_bg-1920.avif / .webp
│   │       │   ├── pedestals_floor.avif / .webp
│   │       │   ├── portal_door_left.avif / .webp
│   │       │   ├── portal_door_right.avif / .webp
│   │       │   └── portal_arch-1920.avif / .webp
│   │       └── scene6/
│   │           ├── contact_wall_bg-1920.avif / .webp
│   │           └── floor_reflection.avif / .webp
├── scripts/
│   ├── generate-placeholders.ts         # Sharp generator for ultra-crisp test assets
│   └── optimize-images.ts              # Production Sharp AVIF/WebP multi-breakpoint converter
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── PerspectiveStage.tsx    # Pinning stage with perspective: 1200px
│   │   │   ├── ParallaxLayer.tsx       # Individual depth layer with GPU compositing
│   │   │   └── Door3D.tsx              # Hinge rotation & sliding door engine
│   │   ├── character/
│   │   │   └── CharacterSprite.tsx     # Velocity-driven 12-frame sprite walker
│   │   ├── dom-content/
│   │   │   ├── HeroOverlay.tsx         # Scene 1 HUD title & scroll prompt
│   │   │   ├── ThresholdPrompt.tsx     # Scene 2 Spatial subtitle
│   │   │   ├── FullStackDeck.tsx       # Scene 3 Tabbed skills cards & profile pills
│   │   │   ├── ArchitectureDiagram.tsx # Scene 4 Interactive SVG graph & node cards
│   │   │   ├── GalleryShowcase.tsx     # Scene 5 3D floating SaaS project cards
│   │   │   └── ContactWall.tsx         # Scene 6 Typographic contact links & form
│   │   ├── navigation/
│   │   │   ├── StoryProgressBar.tsx    # Minimalist discrete scene dot indicator
│   │   │   └── AudioAmbienceToggle.tsx # Optional ambient spatial audio toggle
│   │   └── ui/
│   │       ├── Card3D.tsx              # Glassmorphic 3D hoverable card component
│   │       └── Badge.tsx               # Tech token badge
│   ├── config/
│   │   ├── scenes.ts                   # Master scene & layer data configuration
│   │   ├── projects.ts                 # Full-stack projects data
│   │   └── skills.ts                   # Categorized skills & architecture specs
│   ├── hooks/
│   │   ├── useLenis.ts                 # Lenis initialization & GSAP ticker hook
│   │   ├── useScrollMaster.ts          # Master timeline orchestrator & scene scrubbing
│   │   ├── usePrefersReducedMotion.ts  # Fallback to simple fade-between-scenes
│   │   └── useAssetPreloader.ts        # Scene 1 eager loader + Scenes 2-6 lazy loader
│   ├── styles/
│   │   └── index.css                   # Custom CSS variables, tailwind tokens & font imports
│   ├── types/
│   │   ├── scene.ts                    # TypeScript types for Scene, Layer, Camera
│   │   ├── project.ts                  # Project data types
│   │   └── lenis.d.ts                  # Type definitions for Lenis
│   ├── utils/
│   │   ├── assetLoader.ts              # Dynamic responsive srcset generator
│   │   └── math.ts                     # Lerp & matrix math utilities
│   ├── App.tsx                         # Main app root assembly
│   └── main.tsx                        # React DOM root
├── index.html                          # Preload Scene 1 links & meta tags
├── package.json
├── tailwind.config.js                  # Sand & Navy color tokens & custom perspective utilities
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Performance Budget & Optimization Strategy

### 5.1 Hard Budgets (per `AGENTS.md`)
* **Initial Page Load Weight:** $< 1.2\text{ MB}$ (on Fast 3G)
* **Total Site Assets:** $< 3.0\text{ MB}$
* **Lighthouse Performance Score:** $\ge 90$ on Mobile
* **Largest Contentful Paint (LCP):** $< 2.0\text{s}$

### 5.2 Scene-by-Scene Asset Budget Breakdown

| Scene | Plate / Background (AVIF) | Cutouts & Overlays (AVIF) | Shared Character (AVIF) | Scene Total | Loading Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Scene 1: Exterior** | 85 KB (`sky_bg`) | 95 KB (`building`, `steps`, `flora`) | 80 KB (`walk_sprite`) | **260 KB** | `<link rel="preload">` in `<head>` |
| **Scene 2: Threshold** | 70 KB (`corridor_bg`) | 65 KB (`doors`, `frame`) | (Cached) | **135 KB** | Preload during Scene 1 progress |
| **Scene 3: Full-Stack** | 75 KB (`room_bg`) | 50 KB (`door_hinge`, `pillar`) | (Cached) | **125 KB** | Lazy loaded on reaching Scene 2 |
| **Scene 4: Backend/AI** | 68 KB (`indigo_chamber`) | 48 KB (`door_right`, `edge`) | (Cached) | **116 KB** | Lazy loaded on reaching Scene 3 |
| **Scene 5: Gallery** | 82 KB (`gallery_bg`) | 78 KB (`pedestals`, `portal`) | (Cached) | **160 KB** | Lazy loaded on reaching Scene 4 |
| **Scene 6: Contact** | 72 KB (`contact_wall`) | 35 KB (`floor_reflect`) | (Cached) | **107 KB** | Lazy loaded on reaching Scene 5 |
| **Global Code Bundle**| React, GSAP, Lenis, CSS (Minified + Gzip) | — | — | **145 KB** | Eager (HTTP/2 multiplexed) |
| **Total Cumulative** | — | — | — | **1,048 KB** | **Well under 3.0 MB limit** |

### 5.3 How We Will Hit the Budget
1. **Multi-Resolution Generation via `sharp`:**
   Each source plate is resized to `1920w`, `1280w`, and `768w`.
   - AVIF (quality 80, effort 6, chromaSubsampling 4:2:0) as primary format.
   - WebP (quality 85) as universal fallback.
2. **Explicit Image Dimensions:**
   All `<img>` tags carry explicit `width` and `height` attributes to prevent Cumulative Layout Shift (CLS = 0).
3. **No Three.js / WebGL Library Overhead:**
   Using pure CSS 3D matrix math and GSAP saves over 600 KB of WebGL runtime overhead.
4. **Font Optimization:**
   Self-hosted variable WOFF2 subsetted to Latin glyphs (~35 KB total).

---

## 6. Image Asset Inventory (Source & Production)

| File Base Name | Output Dimensions | Type | Visual Contents & Role |
| :--- | :--- | :--- | :--- |
| `assets/images/character/walk_cycle_sprite` | $3840 \times 640$ (12 frames) | Cutout (Alpha) | Back/profile perspective walking character with dark navy jacket, khaki trousers, and white sneakers. |
| `assets/images/scene1/sky_bg` | $2560 \times 1440$ | Full-Bleed Plate | Warm golden horizon, subtle cirrus clouds, minimalist atmospheric sky. |
| `assets/images/scene1/building_facade` | $2560 \times 1440$ | Cutout (Alpha) | Cantilevered concrete modernist house facade with entrance porch recess. |
| `assets/images/scene1/entrance_steps` | $2560 \times 1440$ | Cutout (Alpha) | Sandstone stairs, low architectural retaining walls, entryway landing. |
| `assets/images/scene1/foreground_flora` | $2560 \times 1440$ | Cutout (Alpha) | Desert architectural shrubs and agave plants framing bottom viewport corners. |
| `assets/images/scene2/corridor_bg` | $2560 \times 1440$ | Full-Bleed Plate | Long minimalist hallway stretching into distance, illuminated by linear ceiling cove light. |
| `assets/images/scene2/door_panel_left` | $800 \times 1440$ | Cutout (Alpha) | Left architectural door slab with vertical bronze handle bar. |
| `assets/images/scene2/door_panel_right` | $800 \times 1440$ | Cutout (Alpha) | Right architectural door slab with vertical bronze handle bar. |
| `assets/images/scene2/portal_frame` | $2560 \times 1440$ | Cutout (Alpha) | Threshold opening border and floor transition line. |
| `assets/images/scene3/room_bg` | $2560 \times 1440$ | Full-Bleed Plate | Minimalist interior room with warm top skylight and smooth stucco walls. |
| `assets/images/scene3/door_hinge_left` | $720 \times 1440$ | Cutout (Alpha) | Left-hinged interior door panel with bronze handle. |
| `assets/images/scene3/corridor_pillar` | $600 \times 1440$ | Cutout (Alpha) | Left-side foreground corridor wall reveal and shadow casting. |
| `assets/images/scene4/indigo_chamber_bg` | $2560 \times 1440$ | Full-Bleed Plate | Dark architectural room flooded with deep indigo atmospheric lighting and subtle grid. |
| `assets/images/scene4/door_hinge_right` | $780 \times 1440$ | Cutout (Alpha) | Monolithic dark right-hinged door swinging inward to reveal tech blueprints. |
| `assets/images/scene4/corridor_edge` | $500 \times 1440$ | Cutout (Alpha) | Right-side corridor doorway casing and shadow frame. |
| `assets/images/scene5/gallery_space_bg` | $2560 \times 1440$ | Full-Bleed Plate | Expansive bright gallery hall with illuminated translucent stretch ceiling. |
| `assets/images/scene5/pedestals_floor` | $2560 \times 800$ | Cutout (Alpha) | Low architectural display plinths and polished reflective gallery floor. |
| `assets/images/scene5/portal_door_left` | $650 \times 1440$ | Cutout (Alpha) | Left gallery entry door panel. |
| `assets/images/scene5/portal_door_right` | $650 \times 1440$ | Cutout (Alpha) | Right gallery entry door panel. |
| `assets/images/scene5/portal_arch` | $2560 \times 1440$ | Cutout (Alpha) | Gallery entrance portal archway framing the screen edges. |
| `assets/images/scene6/contact_wall_bg` | $2560 \times 1440$ | Full-Bleed Plate | Sandstone architectural feature wall illuminated by two warm ceiling spotlights. |
| `assets/images/scene6/floor_reflection` | $2560 \times 600$ | Cutout (Alpha) | Polished floor plane catching ambient warm spotlight reflections. |

---

## 7. DOM / HTML Real-Text Specification (Zero Baked Text)

To guarantee 100% accessibility, dynamic responsiveness, SEO indexing, and sharp high-DPI rendering, **zero text will be baked into images**. All typography, UI cards, and diagrams are real DOM elements styled with Tailwind CSS and positioned in 3D space:

### Scene 1: Arrival / Exterior
* **DOM Elements:**
  - `<h1>`: "ALEX MORGAN" (Font: Outfit/Inter, `--sand-50`, tracking-widest, uppercase).
  - `<p>`: "Principal Systems Architect & Creative Technologist".
  - Scroll Indicator: Floating animated pill with "SCROLL TO EXPLORE" and pulsing Chevron SVG.

### Scene 2: Entrance / Threshold
* **DOM Elements:**
  - Section Indicator: "01 // THE PORTAL".
  - Spatial Subtitle: "Entering Architecture Space" (fades in as doors slide open).

### Scene 3: Full-Stack Development
* **DOM Elements:**
  - Section Header: `<h2>FULL-STACK DEVELOPMENT</h2>`.
  - Category Filter Tabs: `<button>` group: `[Frontend]`, `[Backend]`, `[Database]`, `[Tools]`.
  - Floating 3D Profile / Skill Cards:
    - 4 interactive glassmorphic cards (`Alex Morgan`, `Sam Williams`, `Jordan Taylor`, `Taylor Reed` or feature capability cards).
    - Real avatars (`<img>`), role descriptions, tech stack pills (`React`, `Next.js`, `TypeScript`, `PostgreSQL`, `GraphQL`, `Docker`).
    - Interactive "VIEW PROFILE" / "EXPLORE TECH" CTA button with hover elevation.

### Scene 4: Backend & AI Pipelines
* **DOM Elements:**
  - Header Left: `<h3>BACKEND ARCHITECTURE</h3>`.
  - Header Right: `<h3>AI PIPELINES</h3>`.
  - Flowchart Node Graph (DOM + SVG):
    - Real DOM nodes: `[Client]`, `[API Gateway]`, `[Auth Service]`, `[Order Service]`, `[PostgreSQL]`, `[Redis Cache]`, `[Object Storage]`.
    - Real AI pipeline nodes: `[Data Ingest]`, `[Preprocessing]`, `[Model Cluster]`, `[Inference Engine]`, `[Output / Vector DB]`.
    - Real animated SVG curved connectors with stroke-dasharray pulse lines in `--navy-800` / indigo neon.

### Scene 5: Web Application Gallery
* **DOM Elements:**
  - Section Header: `<h2>WEB APPLICATION GALLERY</h2>`.
  - 3 Floating Perspective Showcase Cards:
    - **Left Card (Dashboard Mockup):** Live DOM charts, metric counters ("99.98% Uptime", "1.2M Events/s").
    - **Center Card (ProjectFlow Platform):** "Manage projects. Ship products. Grow faster." with live interactive buttons and UI tabs.
    - **Right Card (E-commerce Engine):** Product grid with interactive hover states and shopping cart HUD.
  - Links: Real `<a href="...">` anchors with external launch icons.

### Scene 6: Contact / Destination
* **DOM Elements:**
  - Title: `<h1>LET'S BUILD SOMETHING GREAT</h1>`.
  - Contact Data List:
    - Email: `<a href="mailto:hello@yourstudio.com">hello@yourstudio.com</a>` (with one-click clipboard copy).
    - Phone: `<a href="tel:+12345678901">+1 (234) 567-8901</a>`.
    - Location: `<span>Remote Worldwide</span>`.
    - Web: `<a href="https://yourstudio.com">yourstudio.com</a>`.
  - Social Links: Accessible SVG icon anchors for LinkedIn, GitHub, X (Twitter).
  - Quick Inquiry Trigger: Interactive "SEND A MESSAGE" button opening an accessible modal.

---

## 8. Implementation Plan & Execution Milestones

1. **Phase 1: Foundation & Tooling Setup**
   - Initialize Vite + React 18 + TypeScript + Tailwind CSS structure.
   - Configure Tailwind with exact color palette tokens (`--sand-50`, `--sand-200`, `--sand-400`, `--ink-600`, `--navy-800`, `--navy-900`).
   - Implement `scripts/generate-placeholders.ts` using `sharp` to synthesize crisp 2560px mock environment plates and cutouts for testing.
2. **Phase 2: Core Parallax & Scroll Engine**
   - Implement `useLenis` with GSAP ticker binding.
   - Build `PerspectiveStage`, `ParallaxLayer`, and `Door3D` components.
   - Build `CharacterSprite` component with scroll velocity detection and frame scrub.
   - Orchestrate master timeline in `useScrollMaster`.
3. **Phase 3: DOM Content & Spatial UI Integration**
   - Build DOM components for all 6 scenes (Hero, Skills Deck, Architecture Node Graph, Gallery Showcase, Contact Wall).
   - Position DOM elements in 3D space with CSS transforms and blur backdrops.
4. **Phase 4: Asset Pipeline & Sharp Image Optimization**
   - Run `optimize-images.ts` to output AVIF and WebP variants across breakpoints.
   - Configure preloading for Scene 1 and lazy loading for Scenes 2–6.
5. **Phase 5: Performance Verification & Browser QA**
   - Test end-to-end scroll responsiveness in browser subagent.
   - Verify 60fps frame rate, verify zero CLS, verify mobile touch scrolling and `prefers-reduced-motion`.
