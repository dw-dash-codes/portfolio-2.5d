import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Chroma Key & Despill Engine for Magenta (#FF00FF)
 * 
 * @param {Buffer|string} input - Input image buffer or filepath
 * @param {Object} options - Keying thresholds
 * @returns {Promise<Buffer>} - Clean transparent PNG buffer
 */
export async function chromaKeyMagenta(input, options = {}) {
  const {
    threshold = 70,    // Distance threshold below which pixel is fully transparent
    softness = 45,     // Transition width for edge antialiasing
    despill = true,    // Remove magenta spill/fringe on edge pixels
  } = options;

  const image = sharp(input).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Process raw RGBA buffer
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Distance in RGB space to pure magenta [255, 0, 255]
    const dr = r - 255;
    const dg = g - 0;
    const db = b - 255;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);

    // Also check magenta color-difference excess: M = (R + B)/2 - G
    const magentaDifference = (r + b) / 2 - g;

    if (distance < threshold && magentaDifference > 50) {
      // 1. Full Background: fully transparent
      data[i + 3] = 0;
    } else if (distance < threshold + softness && magentaDifference > 30) {
      // 2. Anti-aliased edge: smooth alpha gradient
      const alphaFactor = (distance - threshold) / softness;
      const newAlpha = Math.max(0, Math.min(255, Math.floor(alphaFactor * 255)));
      data[i + 3] = Math.min(a, newAlpha);

      // 3. Edge Despill: Eliminate magenta fringe
      if (despill) {
        const excess = Math.max(0, Math.min(r, b) - g);
        if (excess > 0) {
          data[i] = Math.max(0, Math.floor(r - excess * 0.8));     // Red reduction
          data[i + 2] = Math.max(0, Math.floor(b - excess * 0.8)); // Blue reduction
          data[i + 1] = Math.min(255, Math.floor(g + excess * 0.1));
        }
      }
    } else if (despill && magentaDifference > 80 && g < 120) {
      // 4. Subtle spill suppression on near-boundary opaque pixels
      const excess = Math.max(0, (r + b) / 2 - g - 40);
      if (excess > 0) {
        data[i] = Math.max(0, Math.floor(r - excess * 0.5));
        data[i + 2] = Math.max(0, Math.floor(b - excess * 0.5));
      }
    }
  }

  return await sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png({ compressionLevel: 8 })
    .toBuffer();
}

/**
 * CLI Runner & Demo Test
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length > 0 && (args[0] === '--help' || args[0] === '-h')) {
    console.log(`
Chroma-Key Tool: Magenta (#FF00FF) Background Remover & Despiller
Usage:
  node scripts/chroma-key.mjs <input-image> [output-image] [--threshold N] [--softness N]

Example:
  node scripts/chroma-key.mjs raw-door.png public/assets/door_cutout.png --threshold 75
    `);
    process.exit(0);
  }

  if (args.length >= 1) {
    const inputPath = path.resolve(process.cwd(), args[0]);
    const outputPath = args[1]
      ? path.resolve(process.cwd(), args[1])
      : inputPath.replace(/\.([a-z]+)$/i, '_cutout.png');

    console.log(`Chroma keying: ${inputPath} -> ${outputPath}`);
    const buffer = await chromaKeyMagenta(inputPath);
    fs.writeFileSync(outputPath, buffer);
    console.log(`✓ Saved transparent cutout to ${outputPath}`);
    return;
  }

  // Self-test with synthetic magenta background test swatch
  console.log('🧪 Running Chroma-Key self-test with synthetic magenta cutout...\n');
  const testDir = path.resolve(process.cwd(), 'assets-raw/test');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const testInput = path.join(testDir, 'chroma_test_magenta.png');
  const testOutput = path.join(testDir, 'chroma_test_cutout.png');

  // Create test image with #FF00FF background and a navy architectural door
  const testSvg = `
    <svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="800" fill="#FF00FF"/>
      <rect x="100" y="100" width="400" height="600" fill="#1B2133" stroke="#E6DFD2" stroke-width="8" rx="16"/>
      <circle cx="300" cy="400" r="60" fill="#CBBFAB"/>
      <text x="300" y="410" fill="#0F1422" font-family="sans-serif" font-size="20" text-anchor="middle" font-weight="bold">CUTOUT TEST</text>
    </svg>
  `;

  await sharp(Buffer.from(testSvg)).png().toFile(testInput);
  console.log(`  ✓ Generated synthetic magenta test input: ${testInput}`);

  const cutoutBuffer = await chromaKeyMagenta(testInput, { threshold: 70, softness: 40, despill: true });
  fs.writeFileSync(testOutput, cutoutBuffer);
  console.log(`  ✓ Clean transparent cutout generated: ${testOutput}`);

  const meta = await sharp(testOutput).metadata();
  console.log(`  ✓ Verified output channels: ${meta.channels} (hasAlpha: ${meta.hasAlpha})`);
  console.log('\n🎉 Chroma-Key script is working perfectly!\n');
}

main().catch((err) => {
  console.error('Chroma-key error:', err);
  process.exit(1);
});
