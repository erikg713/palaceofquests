/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palace palette: deep space purples + Pi violet + quest gold.
        shadow: '#0a0a1a',
        abyss: '#0e0e1a',
        palace: '#1a1230',
        quest: {
          royal: '#865DFF',
          deep: '#6b48c8',
        },
        gold: '#f5c542',
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        sans: ['system-ui', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        fade: 'fadeOut 4s ease-in-out',
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
