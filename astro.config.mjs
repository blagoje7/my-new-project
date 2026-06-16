// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://drmedovarski.com',
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
              
              // Replace stylesheet links with preload + inline CSS loader
              html = html.replace(
                /<link rel="stylesheet" href="\/_astro\/([^"]+\.css)">/g,
                '<link rel="preload" href="/_astro/$1" as="style"><noscript><link rel="stylesheet" href="/_astro/$1"></noscript>'
              );
              
              // Add inline CSS loader script before closing head tag if not already present
              if (!html.includes('CSS preload helper')) {
                const inlineCssLoader = `<script>(function(){const e=document.querySelectorAll('link[rel="preload"][as="style"]');e.forEach(function(e){e.addEventListener("load",function(){this.onload=null,this.rel="stylesheet",this.media="all"}),e.sheet&&(e.rel="stylesheet",e.media="all")})})();</script>`;
                html = html.replace(
                  '</head>',
                  `${inlineCssLoader}</head>`
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
