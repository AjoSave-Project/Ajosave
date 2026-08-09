/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // AjoSave brand — Royal Blue (matches mobile app colors.ts Primary)
        // Primary.main: #3d71d9  Primary.light: #7BA5F3  Primary.dark: #2760d3
        primary: {
          50:  '#EBF2FF', // Primary.background
          100: '#D6E5FF',
          200: '#ADC9FF',
          300: '#7BA5F3', // Primary.light
          400: '#5888EC',
          500: '#3d71d9', // Primary.main  ← brand blue
          600: '#2760d3', // Primary.dark
          700: '#1f4fad',
          800: '#163a82',
          900: '#0e2657',
        },
        // Alias kept for backward-compat — same scale as primary
        deepBlue: {
          50:  '#EBF2FF',
          100: '#D6E5FF',
          200: '#ADC9FF',
          300: '#7BA5F3',
          400: '#5888EC',
          500: '#3d71d9',
          600: '#2760d3',
          700: '#1f4fad',
          800: '#163a82',
          900: '#0e2657',
        },
      },
      keyframes: {
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideFromRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.2s ease-out',
        slideFromRight: 'slideFromRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}