module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50:  "#f5f0ff",
          100: "#ede5ff",
          200: "#d9ccff",
          300: "#bda8f5",
          400: "#9e7eea",
          500: "#7f57d9",
          600: "#6b3fa8",  // primary accent — visible but on-brand
          700: "#552f87",  // hover
          800: "#3e1f66",
          900: "#2a1149",
          950: "#180a2e",
        },
      },
    },
  },
  plugins: [],
};
