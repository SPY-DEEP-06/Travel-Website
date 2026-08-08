const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const imagesDir = path.join(projectRoot, 'images');

function getFilesRecursively(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursively(filePath));
        } else {
            if (/\.(jpe?g|png|webp|gif)$/i.test(file)) {
                // convert backslashes to forward slashes for web
                const relPath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
                results.push(relPath);
            }
        }
    });
    return results;
}

const nationalDir = path.join(imagesDir, 'national');
const internationalDir = path.join(imagesDir, 'international');

const allNationalImages = getFilesRecursively(nationalDir);
const allInternationalImages = getFilesRecursively(internationalDir);
const allImages = [...allNationalImages, ...allInternationalImages];

const destinations = {};

// Scan national
if (fs.existsSync(nationalDir)) {
    const folders = fs.readdirSync(nationalDir);
    folders.forEach(folder => {
        const folderPath = path.join(nationalDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            destinations[folder] = getFilesRecursively(folderPath);
        }
    });
}

// Scan international
if (fs.existsSync(internationalDir)) {
    const folders = fs.readdirSync(internationalDir);
    folders.forEach(folder => {
        const folderPath = path.join(internationalDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            destinations[folder] = getFilesRecursively(folderPath);
        }
    });
}

const manifestContent = `window.ttcMedia = {
    "images": ${JSON.stringify(allImages, null, 4)},
    "destinations": ${JSON.stringify(destinations, null, 4)},
    "videos": []
};
`;

fs.writeFileSync(path.join(projectRoot, 'media-manifest.js'), manifestContent, 'utf8');
console.log(`Successfully updated media-manifest.js with ${allImages.length} images and ${Object.keys(destinations).length} destination folders.`);
