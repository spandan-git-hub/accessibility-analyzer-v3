/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}" ],
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.gray,
          650: '#4B5563'
        },
      },
    },
  },
  plugins: [],
}

