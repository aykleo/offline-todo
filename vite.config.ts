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
            src: "public/assets/icons/icon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "public/assets/icons/icon-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "public/assets/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "public/assets/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "public/assets/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
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
