/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        backgroundDark: "#0B0F14",
        accent: "#22d3ee",
        accentSoft: "#0ea5e9"
      }
    }
  },
  plugins: []
};
