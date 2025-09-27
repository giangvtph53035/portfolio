import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
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
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: './index.html',
        },
    },
    base: '/',
});