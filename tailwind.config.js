/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd3ff",
          300: "#8fb6ff",
          400: "#5b90ff",
          500: "#3468ff",
          600: "#1d47f5",
          700: "#1836e0",
          800: "#1a2eb5",
          900: "#1b2c8e",
          950: "#141a52",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 24, 40, 0.05), 0 1px 3px 0 rgba(16, 24, 40, 0.06)",
      },
    },
  },
  plugins: [],
};
