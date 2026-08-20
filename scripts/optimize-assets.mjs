import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const RAW_DIR = path.resolve(process.cwd(), 'assets-raw');
const OUT_DIR = path.resolve(process.cwd(), 'public/assets');

const TARGET_WIDTHS = [1920, 1280, 768];
const MAX_AVIF_1920_KB = 250;

/**
 * Recursively find all PNG files in directory (excluding test directory)
 */
function findPngFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'test') continue; // skip test scratch folder
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findPngFiles(fullPath, fileList);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function optimizeAllAssets() {
  console.log('🚀 Running Asset Optimizer (Sharp AVIF + WebP multi-resolution)...\n');
  console.log(`Source Directory: ${RAW_DIR}`);
  console.log(`Target Directory: ${OUT_DIR}`);
  console.log(`Size Cap Rule: Any AVIF-1920 > ${MAX_AVIF_1920_KB}KB will FAIL the build.\n`);

  const pngFiles = findPngFiles(RAW_DIR);

  if (pngFiles.length === 0) {
    console.error('❌ Error: No PNG files found in assets-raw/. Run `node scripts/generate-placeholders.mjs` first.');
    process.exit(1);
  }

  const report = [];
  let hasFailure = false;

  for (const filePath of pngFiles) {
    const relPath = path.relative(RAW_DIR, filePath);
    const parsed = path.parse(relPath);
    const targetFolder = path.join(OUT_DIR, parsed.dir);

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const image = sharp(filePath).ensureAlpha();
    const metadata = await image.metadata();
    const originalWidth = metadata.width || 2560;

    const fileReport = {
      name: path.join(parsed.dir, parsed.name).replace(/\\/g, '/'),
      origWidth: originalWidth,
      avif1920: 0,
      avif1280: 0,
      avif768: 0,
      webp1920: 0,
      status: 'PASS',
    };

    // 1. Process across responsive breakpoints
    for (const width of TARGET_WIDTHS) {
      const targetW = Math.min(originalWidth, width);
      const resized = sharp(filePath).resize({ width: targetW, withoutEnlargement: true });

      // AVIF output (effort 2 gives fast encoding with excellent compression)
      const avifPath = path.join(targetFolder, `${parsed.name}-${width}.avif`);
      const avifBuffer = await resized
        .clone()
        .avif({ quality: 80, effort: 2, chromaSubsampling: '4:2:0' })
        .toBuffer();
      fs.writeFileSync(avifPath, avifBuffer);

      // WebP output
      const webpPath = path.join(targetFolder, `${parsed.name}-${width}.webp`);
      const webpBuffer = await resized
        .clone()
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
      fs.writeFileSync(webpPath, webpBuffer);

      if (width === 1920) {
        fileReport.avif1920 = avifBuffer.length;
        fileReport.webp1920 = webpBuffer.length;
      } else if (width === 1280) {
        fileReport.avif1280 = avifBuffer.length;
      } else if (width === 768) {
        fileReport.avif768 = avifBuffer.length;
      }
    }

    // 2. Also output un-suffixed base PNG fallback for direct img tags
    const fallbackPngPath = path.join(targetFolder, `${parsed.name}.png`);
    await image.clone().png({ compressionLevel: 6 }).toFile(fallbackPngPath);

    // 3. Performance Budget Check: Max 250KB for AVIF 1920
    const avifKb = fileReport.avif1920 / 1024;
    if (avifKb > MAX_AVIF_1920_KB) {
      fileReport.status = `FAIL (> ${MAX_AVIF_1920_KB}KB)`;
      hasFailure = true;
    }

    console.log(`  ✓ Processed: ${fileReport.name} (AVIF 1920: ${formatBytes(fileReport.avif1920)})`);
    report.push(fileReport);
  }

  // Print Size Report Table
  console.log('\n' + '═'.repeat(95));
  console.log(
    `${'Layer Asset Name'.padEnd(38)} | ${'AVIF 1920'.padEnd(11)} | ${'AVIF 1280'.padEnd(11)} | ${'AVIF 768'.padEnd(10)} | ${'WebP 1920'.padEnd(11)} | Status`
  );
  console.log('─'.repeat(95));

  let totalAvif1920 = 0;
  for (const item of report) {
    totalAvif1920 += item.avif1920;
    const line = `${item.name.padEnd(38)} | ${formatBytes(item.avif1920).padEnd(11)} | ${formatBytes(item.avif1280).padEnd(11)} | ${formatBytes(item.avif768).padEnd(10)} | ${formatBytes(item.webp1920).padEnd(11)} | ${item.status}`;
    console.log(line);
  }

  console.log('═'.repeat(95));
  console.log(`Total 1920 AVIF Assets Size: ${formatBytes(totalAvif1920)} across ${report.length} layers.\n`);

  if (hasFailure) {
    console.error('❌ Build failed: One or more layers exceeded the 250KB limit in AVIF 1920 format.');
    process.exit(1);
  } else {
    console.log('✅ All layers passed the performance budget check successfully!\n');
  }
}

optimizeAllAssets().catch((err) => {
  console.error('Fatal optimization error:', err);
  process.exit(1);
});
