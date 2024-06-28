/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'circle-in-center':
          'radial-gradient(circle, rgba(4, 128, 50, 0.8) 25%, transparent 30%)',
        'circle-check':
          'radial-gradient(circle, rgba(210, 0, 0, 0.8) 40%, rgba(210, 0, 0, 0.6) 60%, transparent 100%)',
        'circle-take-piece':
          'radial-gradient(circle, transparent 75%, rgb(4, 128, 50) 80%)',
        'circle-promotion-pawn':
          'radial-gradient(circle, rgba(156, 163, 175, 0.8) 50%, rgba(156, 163, 175, 0.6) 65%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
