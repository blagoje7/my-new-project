// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          assetFileNames: (assetInfo) => {
            // Keep CSS filenames predictable
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return '_astro/[name].[hash][extname]';
            }
            return '_astro/[name].[hash][extname]';
          }
        }
      }
    },
    css: {
      devSourcemap: false
    }
  },
  build: {
    inlineStylesheets: 'never', // Keep CSS external so we can defer it
  },
  integrations: [
    {
      name: 'defer-css',
      hooks: {
        'astro:build:done': async ({ dir, pages }) => {
          const fs = await import('fs');
          const path = await import('path');
          
          // Process all HTML files
          for (const page of pages) {
            const htmlPath = path.join(dir.pathname, page.pathname, 'index.html');
            try {
              let html = fs.readFileSync(htmlPath, 'utf-8');
              
              // Replace stylesheet links with preload + add CSS loader script
              html = html.replace(
                /<link rel="stylesheet" href="\/_astro\/([^"]+\.css)">/g,
                '<link rel="preload" href="/_astro/$1" as="style"><noscript><link rel="stylesheet" href="/_astro/$1"></noscript>'
              );
              
              // Add CSS loader script before closing head tag if not already present
              if (!html.includes('css-loader.js')) {
                html = html.replace(
                  '</head>',
                  '<script src="/assets/css-loader.js"></script></head>'
                );
              }
              
              fs.writeFileSync(htmlPath, html);
            } catch (e) {
              // Skip if file doesn't exist or other error
            }
          }
        }
      }
    }
  ]
});
