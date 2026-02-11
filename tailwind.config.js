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
        "navy-dark": "#0B1120",
        "navy-900": "#111827",
        "navy-800": "#1F2937",
        "attendance-present": "#2563eb",
        "attendance-half": "#d97706",
        "attendance-absent": "#dc2626",
        "danger": "#dc2626",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [],
}