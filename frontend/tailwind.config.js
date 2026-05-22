/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'consultoria-green': '#004d00',
        'consultoria-gold': '#d4af37',
      }
    },
  },
  plugins: [],
}
