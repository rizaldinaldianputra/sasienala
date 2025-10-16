/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
