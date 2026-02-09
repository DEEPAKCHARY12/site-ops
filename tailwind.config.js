/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#2563eb",
        "navy-dark": "#0f172a",
        "attendance-present": "#2563eb",
        "attendance-half": "#d97706",
        "attendance-absent": "#dc2626",
        "danger": "#dc2626",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [],
}