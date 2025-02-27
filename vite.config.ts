import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Coisinhas da Lay",
        short_name: "Tarefas",
        description: "Gerencie suas tarefas com facilidade",
        theme_color: "#ce71e6",
        icons: [
          {
            src: "assets/icons/icon-48.webp",
            type: "image/png",
            sizes: "48x48",
            purpose: "any maskable",
          },
          {
            src: "assets/icons/icon-72.webp",
            type: "image/png",
            sizes: "72x72",
            purpose: "any maskable",
          },
          {
            src: "assets/icons/icon-96.webp",
            type: "image/png",
            sizes: "96x96",
            purpose: "any maskable",
          },
          {
            src: "assets/icons/icon-128.webp",
            type: "image/png",
            sizes: "128x128",
            purpose: "any maskable",
          },
          {
            src: "assets/icons/icon-192.webp",
            type: "image/png",
            sizes: "192x192",
            purpose: "any maskable",
          },
          {
            src: "assets/icons/icon-256.webp",
            type: "image/png",
            sizes: "256x256",
            purpose: "any maskable",
          },
          {
            src: "assets/icons/icon-512.webp",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "script",
            handler: "CacheFirst",
            options: {
              cacheName: "js-cache",
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "style",
            handler: "CacheFirst",
            options: {
              cacheName: "css-cache",
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
            },
          },
        ],
      },
    }),
  ],
});
