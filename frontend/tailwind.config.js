/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twitter: {
          blue: '#1d9bf0',
          hover: '#1a8cd8',
          border: '#2f3336',
          dark: '#000000',
          card: '#16181c',
          hoverBg: '#0f14191a',
          textMuted: '#71767b',
        }
      }
    },
  },
  plugins: [],
}
