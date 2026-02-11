/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          dark: '#6d28d9',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
        pixel: ['Press Start 2P', 'cursive'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
