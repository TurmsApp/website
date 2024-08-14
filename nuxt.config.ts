export default defineNuxtConfig({
  app: {
    keepalive: true,
    head: {
      charset: "utf-8",
      viewport: "width=device-width,initial-scale=1",
      title: "Turms",
      meta: [
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Turms" },
        { property: "og:title", content: "Turms" },
        {
          name: "og:description",
          content: "Turms, a PoC of decentralized chat service.",
        },
        { name: "theme-color", content: "#8b5cf6" },
        { name: "robots", content: "index, follow" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:site", content: "@gravitaliaoss" },
        {
          name: "description",
          content: "Turms, a PoC of decentralized chat service.",
        },
      ],
      bodyAttrs: {
        class: "dark:bg-zinc-900 dark:text-white",
      },
    },
  },

  ssr: false,
  components: true,
  sourcemap: false,

  modules: [
    "@nuxt/image",
    [
      "@nuxtjs/color-mode",
      {
        preference: "system",
        fallback: "light",
        hid: "color-script",
        globalName: "__NUXT_COLOR_MODE__",
        componentName: "ColorScheme",
        classPrefix: "",
        classSuffix: "",
        storageKey: "mode",
      },
    ],
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
  ],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      APP_NAME: process.env.APP_NAME,
    },
  },

  nitro: {
    preset: "cloudflare_pages",
  },

  experimental: {
    headNext: true,
    payloadExtraction: false,
    renderJsonPayloads: true,
  },

  compatibilityDate: "2024-08-14",
});