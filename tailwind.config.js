/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'], // Adds 'Roboto' to the 'sans' stack
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "fadeInRotate": {
          '0%': { opacity: '0', transform: 'rotate(-10deg)' },
          '100%': { opacity: '1', transform: 'rotate(0deg)' },
        },
        "fadeInScale": {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        "fadeInLeft": {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        "fadeInRight": {
          '0%': { opacity: '0', transform: 'translateX(0)' },
          '100%': { opacity: '1', transform: 'translateX(-20px)' },
        },
        "fadeIn": {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": "fadeIn 2s ease-in-out forwards",
        "fadeInScale": 'fadeInScale 2s ease-in-out forwards',
        "fadeIn": 'fadeIn 2s ease-in-out forwards',
        "fadeInLeft": 'fadeInLeft 2s ease-in-out forwards',
        "fadeInRight": 'fadeInRight 2s ease-in-out forwards',
        "fadeInRotate": 'fadeInRotate 2s ease-in-out forwards',

      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}