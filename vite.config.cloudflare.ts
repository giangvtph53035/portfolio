import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { copyFileSync, existsSync } from 'fs';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        {
            name: 'copy-static-assets',
            writeBundle() {
                const filesToCopy = [
                    'public/favicon.ico',
                    'public/favicon.svg', 
                    'public/apple-touch-icon.png',
                    'public/robots.txt',
                    'public/logo.svg',
                    'public/_redirects'
                ];
                
                filesToCopy.forEach(file => {
                    if (existsSync(file)) {
                        const filename = file.split('/').pop();
                        copyFileSync(file, `public/${filename}`);
                    }
                });
            }
        }
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
    build: {
        outDir: 'public',
        emptyOutDir: false, // Don't delete existing files in public
        rollupOptions: {
            input: './index.html',
        },
    },
    base: '/',
});