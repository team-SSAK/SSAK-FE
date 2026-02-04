/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#E8FBE4",
          100: "#C7F6BD",
          200: "#A4E595",
          300: "#78D462",
          400: "#3CB221",
          500: "#009D0E",
          600: "#158121",
          700: "#043C0A",
          800: "#012405",
          900: "#001402",
        },
        gray: {
          50: "#F9FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          400: "#CBD5E1",
          500: "#94A3B8",
          600: "#64758B",
          700: "#334156",
          800: "#1E293B",
          900: "#0E172A",
          950: "#020617",
        },
      },
      fontFamily: {
        jalnan: ["Jalnan_2"],
        pretendard: ["Pretendard-Variable"],
      },
    },
  },
  plugins: [],
};
