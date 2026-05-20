/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        '2f-green': '#004d00',
        '2f-gold': '#d4af37',
        '2f-black': '#000000',
        '2f-white': '#ffffff',
      }
    },
  },
  plugins: [],
}
