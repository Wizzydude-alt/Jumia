/** @type {import('tailwindcss').Config} */
export default {
  // This tells Tailwind to look inside all JSX files for class names
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // We add Jumia's official orange color here so we can use it everywhere
      colors: {
        jumia: {
          orange: "#F68B1E",       // Main Jumia orange
          dark: "#1A1A2E",         // Dark header/footer color
          gray: "#F5F5F5",         // Light background sections
        },
      },
    },
  },
  plugins: [],
}
