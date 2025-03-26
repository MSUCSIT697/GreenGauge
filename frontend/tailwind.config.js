/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Ensure Tailwind scans all files
  darkMode: 'class', // or 'media' or false
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // Include DaisyUI plugin
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#10b981",
          "secondary": "#108981",
          "accent": "#fecaca",
          "neutral": "#053330",
          "base-100": "#edfff7",
          "info": "#316bd6",
          "success": "#6fd66f",
          "warning": "#f09e41",
          "error": "#ef4444",
        },
      },
    ],
  },
};
