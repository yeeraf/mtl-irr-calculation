import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  // devtools: { enabled: true },
  css: ['~/assets/css/input.css'], // you'll have to create this file
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});