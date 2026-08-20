import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const RAW_DIR = path.resolve(process.cwd(), 'assets-raw');

const PALETTE = {
  sand50: '#E6DFD2',
  sand200: '#CBBFAB',
  sand400: '#A4937A',
  ink600: '#4A453F',
  navy800: '#1B2133',
  navy900: '#0F1422',
  warmLight: '#F5EFEB',
};

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

const LAYERS = [
  // =========================================================================
  // SCENE 1: ARRIVAL / EXTERIOR (Warm Sand / Daylight)
  // =========================================================================
  {
    folder: 'scenes/scene-1',
    file: 'sky_bg.png',
    width: 2560,
    height: 1440,
    isCutout: false,
    name: 'Background Sky & Distant Horizon',
    depth: 0.1,
    bg: PALETTE.sand50,
    stroke: PALETTE.sand400,
    accent: PALETTE.sand200,
    renderCustom: () => `
      <!-- Warm Golden Horizon Gradient -->
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${PALETTE.warmLight}"/>
          <stop offset="65%" stop-color="${PALETTE.sand50}"/>
          <stop offset="100%" stop-color="${PALETTE.sand200}"/>
        </linearGradient>
      </defs>
      <rect width="2560" height="1440" fill="url(#skyGrad)"/>
      <line x1="0" y1="1020" x2="2560" y2="1020" stroke="${PALETTE.sand400}" stroke-width="2" stroke-opacity="0.5"/>
    `,
  },
  {
    folder: 'scenes/scene-1',
    file: 'building_facade.png',
    width: 2560,
    height: 1440,
    isCutout: true,
    name: 'Modernist House Architecture',
    depth: 0.45,
    stroke: PALETTE.sand400,
    accent: PALETTE.sand200,
    renderCustom: () => `
      <!-- Minimalist Sandstone Villa Facade -->
      <rect x="580" y="320" width="1400" height="700" fill="${PALETTE.sand200}" fill-opacity="0.9" stroke="${PALETTE.sand400}" stroke-width="4" rx="8"/>
      <rect x="700" y="380" width="1160" height="280" fill="${PALETTE.sand50}" fill-opacity="0.85" stroke="${PALETTE.sand400}" stroke-width="3"/>
      <!-- Recessed Entrance Porch & Oak Doors -->
      <rect x="1120" y="660" width="320" height="360" fill="${PALETTE.ink600}" fill-opacity="0.75" stroke="${PALETTE.sand400}" stroke-width="4"/>
      <rect x="1140" y="680" width="135" height="340" fill="${PALETTE.sand400}" stroke="${PALETTE.ink600}" stroke-width="2"/>
      <rect x="1285" y="680" width="135" height="340" fill="${PALETTE.sand400}" stroke="${PALETTE.ink600}" stroke-width="2"/>
    `,
  },
  {
    folder: 'scenes/scene-1',
    file: 'entrance_steps.png',
    width: 2560,
    height: 1440,
    isCutout: true,
    name: 'Concrete Stairs & Courtyard Entrance',
    depth: 0.65,
    stroke: PALETTE.sand400,
    accent: PALETTE.ink600,
    renderCustom: () => `
      <polygon points="360,1440 2200,1440 1800,1020 760,1020" fill="${PALETTE.sand200}" fill-opacity="0.95" stroke="${PALETTE.sand400}" stroke-width="4"/>
      <line x1="680" y1="1120" x2="1880" y2="1120" stroke="${PALETTE.ink600}" stroke-width="3" stroke-opacity="0.6"/>
      <line x1="600" y1="1220" x2="1960" y2="1220" stroke="${PALETTE.ink600}" stroke-width="3" stroke-opacity="0.6"/>
      <line x1="480" y1="1320" x2="2080" y2="1320" stroke="${PALETTE.ink600}" stroke-width="3" stroke-opacity="0.6"/>
    `,
  },
  {
    folder: 'scenes/scene-1',
    file: 'foreground_flora.png',
    width: 2560,
    height: 1440,
    isCutout: true,
    name: 'Courtyard Desert Flora Framing',
    depth: 0.95,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand400,
    renderCustom: () => `
      <!-- Left Desert Plants -->
      <path d="M0,1440 Q150,1100 0,900 Q200,1150 220,1440 Z" fill="${PALETTE.ink600}" stroke="${PALETTE.sand400}" stroke-width="3"/>
      <path d="M50,1440 Q250,1180 180,980 Q300,1220 320,1440 Z" fill="${PALETTE.sand400}" stroke="${PALETTE.ink600}" stroke-width="3"/>
      <!-- Right Desert Plants -->
      <path d="M2560,1440 Q2410,1100 2560,900 Q2360,1150 2340,1440 Z" fill="${PALETTE.ink600}" stroke="${PALETTE.sand400}" stroke-width="3"/>
      <path d="M2510,1440 Q2310,1180 2380,980 Q2260,1220 2240,1440 Z" fill="${PALETTE.sand400}" stroke="${PALETTE.ink600}" stroke-width="3"/>
    `,
  },

  // =========================================================================
  // SCENE 2: ENTRANCE / THRESHOLD (Warm Corridor Interior)
  // =========================================================================
  {
    folder: 'scenes/scene-2',
    file: 'corridor_bg.png',
    width: 2560,
    height: 1440,
    isCutout: false,
    name: 'Deep Corridor Perspective & Ceiling Light Cove',
    depth: 0.15,
    bg: PALETTE.sand50,
    stroke: PALETTE.sand400,
    accent: PALETTE.ink600,
    renderCustom: () => `
      <!-- Perspective Hallway Walls -->
      <polygon points="760,0 1800,0 1600,1440 960,1440" fill="${PALETTE.sand200}" fill-opacity="0.5"/>
      <line x1="760" y1="0" x2="960" y2="1440" stroke="${PALETTE.ink600}" stroke-width="2" stroke-dasharray="8 8" stroke-opacity="0.4"/>
      <line x1="1800" y1="0" x2="1600" y2="1440" stroke="${PALETTE.ink600}" stroke-width="2" stroke-dasharray="8 8" stroke-opacity="0.4"/>
      <!-- Bright Ceiling Light Cove -->
      <rect x="1140" y="40" width="280" height="960" fill="${PALETTE.warmLight}" stroke="${PALETTE.sand200}" stroke-width="2" rx="8"/>
    `,
  },
  {
    folder: 'scenes/scene-2',
    file: 'door_panel_left.png',
    width: 800,
    height: 1440,
    isCutout: true,
    name: 'Architectural Door Panel Left',
    depth: 0.7,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand400,
    renderCustom: () => `
      <rect x="40" y="40" width="720" height="1360" fill="${PALETTE.sand400}" stroke="${PALETTE.ink600}" stroke-width="4" rx="8"/>
      <rect x="680" y="560" width="24" height="320" fill="${PALETTE.ink600}" rx="12"/>
    `,
  },
  {
    folder: 'scenes/scene-2',
    file: 'door_panel_right.png',
    width: 800,
    height: 1440,
    isCutout: true,
    name: 'Architectural Door Panel Right',
    depth: 0.7,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand400,
    renderCustom: () => `
      <rect x="40" y="40" width="720" height="1360" fill="${PALETTE.sand400}" stroke="${PALETTE.ink600}" stroke-width="4" rx="8"/>
      <rect x="96" y="560" width="24" height="320" fill="${PALETTE.ink600}" rx="12"/>
    `,
  },
  {
    folder: 'scenes/scene-2',
    file: 'portal_frame.png',
    width: 2560,
    height: 1440,
    isCutout: true,
    name: 'Threshold Portal Wall & Shadow Bevel',
    depth: 0.9,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand400,
    renderCustom: () => `
      <path d="M0,0 L2560,0 L2560,1440 L2160,1440 L2160,160 L400,160 L400,1440 L0,1440 Z" fill="${PALETTE.sand200}" stroke="${PALETTE.ink600}" stroke-width="4"/>
    `,
  },

  // =========================================================================
  // SCENE 3: FULL-STACK DEVELOPMENT (Warm Skylit Room)
  // =========================================================================
  {
    folder: 'scenes/scene-3',
    file: 'room_bg.png',
    width: 2560,
    height: 1440,
    isCutout: false,
    name: 'Skylit Room Chamber with Wall Wash Lighting',
    depth: 0.2,
    bg: PALETTE.sand50,
    stroke: PALETTE.sand400,
    accent: PALETTE.sand200,
    renderCustom: () => `
      <polygon points="400,160 2160,160 2560,1440 0,1440" fill="${PALETTE.sand200}" fill-opacity="0.4"/>
      <rect x="880" y="60" width="800" height="140" fill="${PALETTE.warmLight}" stroke="${PALETTE.sand400}" stroke-width="2" rx="16"/>
    `,
  },
  {
    folder: 'scenes/scene-3',
    file: 'door_hinge_left.png',
    width: 720,
    height: 1440,
    isCutout: true,
    name: 'Left Hinged Architectural Room Door',
    depth: 0.72,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand400,
    renderCustom: () => `
      <rect x="20" y="40" width="680" height="1360" fill="${PALETTE.sand400}" stroke="${PALETTE.ink600}" stroke-width="4" rx="8"/>
      <rect x="620" y="600" width="20" height="240" fill="${PALETTE.ink600}" rx="10"/>
    `,
  },
  {
    folder: 'scenes/scene-3',
    file: 'corridor_pillar.png',
    width: 600,
    height: 1440,
    isCutout: true,
    name: 'Foreground Corridor Wall Cutout',
    depth: 0.95,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand200,
    renderCustom: () => `
      <rect x="0" y="0" width="560" height="1440" fill="${PALETTE.sand200}" stroke="${PALETTE.ink600}" stroke-width="4"/>
    `,
  },

  // =========================================================================
  // SCENE 4: BACKEND & AI PIPELINES (ONLY DARK SCENE: Indigo & Navy)
  // =========================================================================
  {
    folder: 'scenes/scene-4',
    file: 'indigo_chamber_bg.png',
    width: 2560,
    height: 1440,
    isCutout: false,
    name: 'Indigo High-Contrast Tech Chamber Atmosphere',
    depth: 0.2,
    bg: PALETTE.navy900,
    stroke: '#6366F1',
    accent: PALETTE.sand50,
    renderCustom: () => `
      <pattern id="indigoGrid" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#6366F1" stroke-width="1" stroke-opacity="0.3"/>
      </pattern>
      <rect width="2560" height="1440" fill="${PALETTE.navy900}"/>
      <rect width="2560" height="1440" fill="url(#indigoGrid)"/>
      <circle cx="1280" cy="720" r="400" fill="#6366F1" fill-opacity="0.1" filter="blur(40px)"/>
    `,
  },
  {
    folder: 'scenes/scene-4',
    file: 'door_hinge_right.png',
    width: 780,
    height: 1440,
    isCutout: true,
    name: 'Right Hinged Monolithic Chamber Door',
    depth: 0.75,
    stroke: '#6366F1',
    accent: PALETTE.sand200,
    renderCustom: () => `
      <rect x="20" y="40" width="740" height="1360" fill="${PALETTE.navy800}" stroke="#6366F1" stroke-width="4" rx="8"/>
      <rect x="80" y="600" width="20" height="240" fill="#818CF8" rx="10"/>
    `,
  },
  {
    folder: 'scenes/scene-4',
    file: 'corridor_edge.png',
    width: 500,
    height: 1440,
    isCutout: true,
    name: 'Corridor Perspective Foreground Framing',
    depth: 0.95,
    stroke: '#6366F1',
    accent: PALETTE.navy800,
    renderCustom: () => `
      <polygon points="40,0 500,0 500,1440 0,1440" fill="${PALETTE.navy900}" stroke="#6366F1" stroke-width="3"/>
    `,
  },

  // =========================================================================
  // SCENE 5: WEB APPLICATION GALLERY (Warm Modern Gallery)
  // =========================================================================
  {
    folder: 'scenes/scene-5',
    file: 'gallery_space_bg.png',
    width: 2560,
    height: 1440,
    isCutout: false,
    name: 'Expansive Modern Gallery Space with Diffuse Light Ceiling',
    depth: 0.18,
    bg: PALETTE.sand50,
    stroke: PALETTE.sand400,
    accent: PALETTE.ink600,
    renderCustom: () => `
      <rect x="360" y="40" width="1840" height="220" fill="${PALETTE.warmLight}" stroke="${PALETTE.sand400}" stroke-width="2" rx="12"/>
      <polygon points="200,260 2360,260 2560,1440 0,1440" fill="${PALETTE.sand200}" fill-opacity="0.4"/>
    `,
  },
  {
    folder: 'scenes/scene-5',
    file: 'pedestals_floor.png',
    width: 2560,
    height: 800,
    isCutout: true,
    name: 'Architectural Pedestals & Polished Floor Reflection',
    depth: 0.5,
    stroke: PALETTE.sand400,
    accent: PALETTE.ink600,
    renderCustom: () => `
      <rect x="280" y="240" width="500" height="130" fill="${PALETTE.sand200}" stroke="${PALETTE.sand400}" stroke-width="3" rx="8"/>
      <rect x="1030" y="240" width="500" height="130" fill="${PALETTE.sand200}" stroke="${PALETTE.sand400}" stroke-width="3" rx="8"/>
      <rect x="1780" y="240" width="500" height="130" fill="${PALETTE.sand200}" stroke="${PALETTE.sand400}" stroke-width="3" rx="8"/>
    `,
  },
  {
    folder: 'scenes/scene-5',
    file: 'portal_door_left.png',
    width: 650,
    height: 1440,
    isCutout: true,
    name: 'Gallery Double Portal Left Door',
    depth: 0.7,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand400,
    renderCustom: () => `
      <rect x="30" y="40" width="590" height="1360" fill="${PALETTE.sand400}" stroke="${PALETTE.ink600}" stroke-width="4" rx="8"/>
      <rect x="540" y="580" width="18" height="280" fill="${PALETTE.ink600}" rx="9"/>
    `,
  },
  {
    folder: 'scenes/scene-5',
    file: 'portal_door_right.png',
    width: 650,
    height: 1440,
    isCutout: true,
    name: 'Gallery Double Portal Right Door',
    depth: 0.7,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand400,
    renderCustom: () => `
      <rect x="30" y="40" width="590" height="1360" fill="${PALETTE.sand400}" stroke="${PALETTE.ink600}" stroke-width="4" rx="8"/>
      <rect x="90" y="580" width="18" height="280" fill="${PALETTE.ink600}" rx="9"/>
    `,
  },
  {
    folder: 'scenes/scene-5',
    file: 'portal_arch.png',
    width: 2560,
    height: 1440,
    isCutout: true,
    name: 'Foreground Portal Archway Framing',
    depth: 0.95,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand200,
    renderCustom: () => `
      <path d="M0,0 L2560,0 L2560,1440 L2200,1440 L2200,200 L360,200 L360,1440 L0,1440 Z" fill="${PALETTE.sand200}" stroke="${PALETTE.ink600}" stroke-width="4"/>
    `,
  },

  // =========================================================================
  // SCENE 6: CONTACT / DESTINATION (Warm Sandstone Wall with Spotlights)
  // =========================================================================
  {
    folder: 'scenes/scene-6',
    file: 'contact_wall_bg.png',
    width: 2560,
    height: 1440,
    isCutout: false,
    name: 'Monolithic Architectural Feature Wall with Overhead Spotlight Cones',
    depth: 0.25,
    bg: PALETTE.sand50,
    stroke: PALETTE.sand400,
    accent: PALETTE.ink600,
    renderCustom: () => `
      <!-- Spotlight Light Cones -->
      <polygon points="680,0 240,1440 1120,1440" fill="${PALETTE.warmLight}" fill-opacity="0.6"/>
      <polygon points="1880,0 1440,1440 2320,1440" fill="${PALETTE.warmLight}" fill-opacity="0.6"/>
      <rect x="480" y="280" width="1600" height="880" fill="${PALETTE.sand200}" fill-opacity="0.3" stroke="${PALETTE.sand400}" stroke-width="3" rx="16"/>
    `,
  },
  {
    folder: 'scenes/scene-6',
    file: 'floor_reflection.png',
    width: 2560,
    height: 600,
    isCutout: true,
    name: 'Polished Concrete Foreground Floor Reflection',
    depth: 0.9,
    stroke: PALETTE.sand400,
    accent: PALETTE.ink600,
    renderCustom: () => `
      <rect x="0" y="0" width="2560" height="600" fill="${PALETTE.sand200}" fill-opacity="0.35" stroke="${PALETTE.sand400}" stroke-width="2"/>
    `,
  },

  // =========================================================================
  // CHARACTER: 12-Frame Walk Cycle Sprite Sheet
  // =========================================================================
  {
    folder: 'character',
    file: 'walk_cycle_sprite.png',
    width: 3840,
    height: 640,
    isCutout: true,
    name: 'Character Walk Cycle Sprite Sheet (12 Frames)',
    depth: 0.75,
    stroke: PALETTE.ink600,
    accent: PALETTE.sand400,
    renderCustom: () => {
      let frames = '';
      const frameWidth = 320;
      for (let i = 0; i < 12; i++) {
        const cx = i * frameWidth + frameWidth / 2;
        const legOffset = Math.sin((i / 12) * Math.PI * 2) * 22;
        frames += `
          <g id="frame-${i}">
            <circle cx="${cx}" cy="180" r="28" fill="${PALETTE.sand200}" stroke="${PALETTE.ink600}" stroke-width="2"/>
            <rect x="${cx - 36}" y="220" width="72" height="150" fill="${PALETTE.ink600}" stroke="${PALETTE.sand400}" stroke-width="3" rx="14"/>
            <line x1="${cx - 16}" y1="370" x2="${cx - 16 - legOffset}" y2="540" stroke="${PALETTE.sand400}" stroke-width="18" stroke-linecap="round"/>
            <line x1="${cx + 16}" y1="370" x2="${cx + 16 + legOffset}" y2="540" stroke="${PALETTE.sand400}" stroke-width="18" stroke-linecap="round"/>
            <rect x="${cx - 26 - legOffset}" y="534" width="32" height="16" fill="${PALETTE.sand50}" stroke="${PALETTE.ink600}" stroke-width="2" rx="4"/>
            <rect x="${cx + 6 + legOffset}" y="534" width="32" height="16" fill="${PALETTE.sand50}" stroke="${PALETTE.ink600}" stroke-width="2" rx="4"/>
          </g>
        `;
      }
      return frames;
    },
  },
];

async function generateAllPlaceholders() {
  console.log('🎨 Generating warm-toned placeholder assets in assets-raw/ ...\n');

  for (const layer of LAYERS) {
    const targetDir = path.join(RAW_DIR, layer.folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFile = path.join(targetDir, layer.file);

    const svg = `
      <svg width="${layer.width}" height="${layer.height}" viewBox="0 0 ${layer.width} ${layer.height}" xmlns="http://www.w3.org/2000/svg">
        ${
          layer.isCutout
            ? ''
            : `<rect width="${layer.width}" height="${layer.height}" fill="${layer.bg || PALETTE.sand50}"/>`
        }
        
        <defs>
          <pattern id="arch-grid-${String(layer.depth).replace('.', '_')}" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="${layer.stroke}" stroke-width="1" stroke-opacity="0.15"/>
          </pattern>
        </defs>
        <rect width="${layer.width}" height="${layer.height}" fill="url(#arch-grid-${String(layer.depth).replace('.', '_')})"/>

        ${layer.renderCustom ? layer.renderCustom() : ''}

        ${
          layer.folder !== 'character'
            ? `
        <rect x="30" y="30" width="560" height="100" fill="${layer.bg === PALETTE.navy900 ? PALETTE.navy900 : PALETTE.sand50}" fill-opacity="0.9" stroke="${layer.stroke}" stroke-width="2" rx="8"/>
        <text x="50" y="65" fill="${layer.bg === PALETTE.navy900 ? PALETTE.sand50 : PALETTE.ink600}" font-family="monospace" font-size="20" font-weight="bold">${escapeXml(layer.name)}</text>
        <text x="50" y="100" fill="${layer.bg === PALETTE.navy900 ? PALETTE.sand400 : PALETTE.ink600}" font-family="monospace" font-size="16">Depth: ${layer.depth} | Size: ${layer.width}x${layer.height} | Cutout: ${layer.isCutout}</text>
        `
            : ''
        }
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 6 })
      .toFile(targetFile);

    console.log(`  ✓ Generated: ${layer.folder}/${layer.file} (${layer.width}x${layer.height})`);
  }

  console.log('\n🎉 Successfully re-generated all placeholder layers into assets-raw/\n');
}

generateAllPlaceholders().catch((err) => {
  console.error('Error generating placeholders:', err);
  process.exit(1);
});
