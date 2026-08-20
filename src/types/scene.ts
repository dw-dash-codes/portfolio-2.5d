export type DoorType =
  | 'none'
  | 'sliding-double'
  | 'hinge-left'
  | 'hinge-right';

export interface CameraMove {
  scale: [number, number];       // [startScale, endScale]
  xPercent: [number, number];   // [startX, endX]
  yPercent: [number, number];   // [startY, endY]
  ease?: string;                // default "power2.inOut"
}

export interface LayerParallax {
  xRange: [number, number];     // [startPercent, endPercent]
  yRange: [number, number];     // [startPercent, endPercent]
}

export interface Layer {
  id: string;
  name: string;
  src: string;                  // Base image asset path
  depth: number;                // 0.0 (infinite background) to 1.0 (extreme foreground)
  zIndex: number;               // Explicit stacking order (1 to 50)
  isCutout: boolean;            // true = transparent cutout, false = full-bleed plate
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
