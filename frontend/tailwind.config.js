/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e88e5", // Customize as needed
        secondary: "#6c757d", // Customize as needed
        dark: {
          light: "#2d3748", // For navbar and elements in dark mode
          DEFAULT: "#1a202c", // Medium dark
          darker: "#111827", // Main background in dark mode
        }
      },
    },
  },
  plugins: [],
}
