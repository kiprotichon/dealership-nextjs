/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0b0b0b',   // Daily Bazaar black
        accent: '#f0bc00'     // Daily Bazaar gold/yellow
      }
    }
  },
  plugins: []
};
