const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const inputDir = './input-images';
const outputDir = './optimized-images';

async function ensureOutputDir() {
    try {
        await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
        console.error('Error creating directory:', err);
    }
}

async function optimizeImages() {
    try {
        const files = await fs.readdir(inputDir);
        for (const file of files) {
            const inputFile = path.join(inputDir, file);
            const outputFile = path.join(outputDir, `${path.parse(file).name}.webp`);

            await sharp(inputFile)
                .resize(500, 650)
                .toFormat('webp', { quality: 80 })
                .toFile(outputFile);

            console.log(`Optimized: ${file}`);
        }
    } catch (err) {
        console.error('Error processing images:', err);
    }
}

(async () => {
    await ensureOutputDir();
    await optimizeImages();
})();
