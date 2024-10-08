/** @type {import("tailwindcss").Config} */
module.exports = {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue",
      "./error.vue",
      "./nuxt.config.{js,ts}",
    ],
    theme: {
      extend: {
        keyframes: {
          change: {
            "0%, 12.66%, 100%": { transform: "translate3d(0,0,0)" },
            "16.66%, 29.32%": { transform: "translate3d(0,-25%,0)" },
            "33.32%, 45.98%": { transform: "translate3d(0,-50%,0)" },
            "49.98%, 62.64%": { transform: "translate3d(0,-75%,0)" },
            "66.64%, 79.3%": { transform: "translate3d(0,-50%,0)" },
            "83.3%, 95.96%": { transform: "translate3d(0,-25%,0)" },
          },
        },
        animation: {
          change: "change 16s infinite",
        },
      },
    },
    plugins: [],
  };