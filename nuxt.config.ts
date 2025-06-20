import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-06-16',
  ssr: false,
  app: {
    baseURL: '/mtl-irr-calculation/', // e.g., '/my-nuxt-blog/'
    // buildAssetsDir: 'assets', // Prevents GitHub Pages from ignoring folders starting with '_'
  },
  css: ['~/assets/css/input.css'], // you'll have to create this file
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});