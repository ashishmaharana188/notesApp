/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Includes all JSX/TSX files in src
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.{css}", // Ensure components are covered// Ensures Tailwind scans all component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
