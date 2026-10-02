const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '../public/assets/images');

async function processImages() {
    const files = fs.readdirSync(dir);
    let totalOld = 0;
    let totalNew = 0;

    for (const file of files) {
        if (!file.match(/\.(png|jpg|jpeg)$/i)) continue;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        totalOld += stat.size;

        if (stat.size > 100 * 1024) {
            console.log(`Processing ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);
            const tempPath = filePath + '.tmp';
            
            if (file.endsWith('.png')) {
                await sharp(filePath)
                    .png({ quality: 80, compressionLevel: 9, palette: true })
                    .toFile(tempPath);
            } else {
                await sharp(filePath)
                    .jpeg({ quality: 80, mozjpeg: true })
                    .toFile(tempPath);
            }

            const newStat = fs.statSync(tempPath);
            if (newStat.size < stat.size) {
                fs.renameSync(tempPath, filePath);
                console.log(`  -> Compressed PNG to ${(newStat.size / 1024).toFixed(0)} KB (${((1 - newStat.size / stat.size) * 100).toFixed(1)}% reduction)`);
                totalNew += newStat.size;
            } else {
                fs.unlinkSync(tempPath);
                totalNew += stat.size;
            }

            // Also create high-efficiency webp version
            const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
            await sharp(filePath)
                .webp({ quality: 80, lossless: false })
                .toFile(webpPath);
            const webpStat = fs.statSync(webpPath);
            console.log(`  -> Created WebP: ${(webpStat.size / 1024).toFixed(0)} KB`);
        } else {
            totalNew += stat.size;
        }
    }

    console.log(`\nDONE! Total PNG/JPG size before: ${(totalOld / 1024 / 1024).toFixed(2)} MB, after: ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
}

processImages().catch(err => console.error(err));
