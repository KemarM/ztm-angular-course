/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'], //This tells the pruger to search through the /src dir for html and ts files, it'll search for tailwind classes as well, if any, they won't be removed
  theme: {
    extend: {},
  },
  plugins: [],
}
