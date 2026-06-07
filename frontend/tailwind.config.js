/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "kido-green": "#01B273",
        "kido-dark": "#021526",
      },
    },
  },
  plugins: [],
};
