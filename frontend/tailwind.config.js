export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { nunito: ["Nunito", "sans-serif"] },
      colors: {
        paper:  "#faf7f2",
        ink:    "#2d2a26",
        muted:  "#8a7f74",
        border: "#e0d9cf",
        nom:         "#2d2a26",
        determinant: "#7c5c2e",
        adjectif:    "#1e3a8a",
        verbe:       "#b91c1c",
        pronom:      "#6d28d9",
        adverbe:     "#c2410c",
        preposition: "#15803d",
        conjonction: "#be185d",
      },
    },
  },
  plugins: [],
};
