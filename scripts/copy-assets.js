import fs from 'fs';
import path from 'path';

// Files to copy to dist
const filesToCopy = [
    { src: 'dist/index-static.html', dest: 'dist/index.html' },
    { src: 'public/favicon.ico', dest: 'dist/favicon.ico' },
    { src: 'public/favicon.svg', dest: 'dist/favicon.svg' },
    { src: 'public/apple-touch-icon.png', dest: 'dist/apple-touch-icon.png' },
    { src: 'public/robots.txt', dest: 'dist/robots.txt' },
    { src: 'public/logo.svg', dest: 'dist/logo.svg' },
    { src: 'public/_redirects', dest: 'dist/_redirects' }
];

// Copy files
filesToCopy.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied ${src} → ${dest}`);
    } else {
        console.log(`⚠ File not found: ${src}`);
    }
});

console.log('✅ Asset copying completed!');