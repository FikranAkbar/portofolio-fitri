/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Source Code Pro"', 'Courier New', 'monospace'],
      },
      colors: {
        pink: {
          accent: '#FF49DB',
        },
        canvas: '#F5F5F5',
      },
    },
  },
  plugins: [],
};

