/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-color": "var(--blue-color)",
        "red-color": "var(--red-color)",
        "yellow-color": "var(--yellow-color)",
        "background-color": "var(--background-color)",
      },
    },
  },
  plugins: [],
};
