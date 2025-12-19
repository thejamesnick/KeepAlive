const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_PATH = path.join(__dirname, '../public/logo.svg');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateAssets() {
    console.log('Generatng assets from logo.svg...');

    const svgBuffer = fs.readFileSync(SVG_PATH);

    // 1. favicon.ico (32x32) - actually PNG format inside ICO usually, but here just PNG 32 rename
    // For modern browseers, icon.png is better.
    // We'll make a nice rounded white square with the black logo on it.

    const bg = Buffer.from('<svg><rect x="0" y="0" width="512" height="512" rx="128" fill="white"/></svg>');

    // Composite: White Squrcle Background + Scaled Down Logo
    // Logo is 24x24 viewport. We resize it to 300x300 and center it on 512x512

    const logoResized = await sharp(svgBuffer)
        .resize(300, 300)
        .toBuffer();

    const appIcon = await sharp({
        create: {
            width: 512,
            height: 512,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 1 } // Black background for "KeepAlive" dark mode feel
        }
    })
        // mask with squircle
        .composite([
            // Actually, let's just make it a Black Filled Squircle with White Logo?
            // User asked for "Black BG, White Pulse".
            // The SVG is currently black stroke. We need to invert it for the dark icon.
        ]);

    // SIMPLER APPROACH:
    // Create a 512x512 Black Square.
    // Invert the SVG to be White.
    // Composite.

    // 1. Invert SVG (Hack: replace stroke="#000000" with stroke="white")
    let svgString = fs.readFileSync(SVG_PATH, 'utf8');
    svgString = svgString.replace('stroke="#000000"', 'stroke="white"');
    const whiteLogoBuffer = Buffer.from(svgString);

    // 2. Create the App Icon (512x512)
    await sharp({
        create: {
            width: 512,
            height: 512,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 1 } // Black
        }
    })
        .composite([{
            input: await sharp(whiteLogoBuffer).resize(300, 300).toBuffer(),
            gravity: 'center'
        }])
        .toFile(path.join(PUBLIC_DIR, 'icon.png')); // Apple Touch Icon / Android

    // 3. Favicon (32x32)
    await sharp({
        create: {
            width: 32,
            height: 32,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 1 }
        }
    })
        .composite([{
            input: await sharp(whiteLogoBuffer).resize(24, 24).toBuffer(),
            gravity: 'center'
        }])
        .toFile(path.join(PUBLIC_DIR, 'favicon.png')); // Modern browsers support PNG favicons

    // 4. OG Image (1200x630)
    // Black BG, Centered White Logo, "KeepAlive" text
    console.log('Generating OG Image...');

    // We will create an SVG wrapper for text
    const textSvg = Buffer.from(`
    <svg width="1200" height="630">
      <text x="50%" y="75%" font-family="sans-serif" font-weight="bold" font-size="80" text-anchor="middle" fill="white">KeepAlive</text>
    </svg>
  `);

    await sharp({
        create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 1 } // Black
        }
    })
        .composite([
            {
                input: await sharp(whiteLogoBuffer).resize(250, 250).toBuffer(),
                top: 150,
                left: 475 // (1200 - 250) / 2
            },
            {
                input: textSvg,
                top: 0,
                left: 0
            }
        ])
        .toFile(path.join(PUBLIC_DIR, 'og-image.png'));

    console.log('✅ Assets generated: icon.png, favicon.ico, og-image.png');
}

generateAssets();
