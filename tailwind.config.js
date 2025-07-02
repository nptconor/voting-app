/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        special: ["'Special Gothic Condensed One'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
