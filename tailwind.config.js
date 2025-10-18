/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ponte-blue': 'rgb(0, 18, 66)',
        'ponte-gold': 'rgb(166, 133, 66)',
        'ponte-gold-dark': 'rgb(145, 115, 58)',
        'ponte-gold-light': 'rgb(185, 155, 85)',
      },
    },
  },
}
