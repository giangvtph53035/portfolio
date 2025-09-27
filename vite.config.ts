import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
    const plugins = [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ];

    // Don't add wayfinder plugin for production builds
    // It will be added through Laravel plugin when running dev server

    return {
        plugins,
        esbuild: {
            jsx: 'automatic',
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
            rollupOptions: {
                output: {
                    manualChunks: undefined,
                },
            },
        },
        base: process.env.NODE_ENV === 'production' ? '/' : '/',
    };
});
