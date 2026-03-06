/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f0',
          100: '#dceedd',
          200: '#bcdcbe',
          300: '#8fc293',
          400: '#5ea564',
          500: '#3d8a44',
          600: '#2d6e34',
          700: '#25582b',
          800: '#204624',
          900: '#1b3b1e',
        },
        earth: {
          50:  '#faf6f0',
          100: '#f2e8d9',
          200: '#e4cfb1',
          300: '#d2b080',
          400: '#c09255',
          500: '#b07a38',
          600: '#9a6530',
          700: '#7d4f27',
          800: '#664022',
          900: '#54361e',
        },
        cream: '#faf8f4',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'slide-in': 'slideIn 0.4s ease forwards',
        'pulse-green': 'pulseGreen 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(61, 138, 68, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(61, 138, 68, 0)' },
        },
      },
    },
  },
  plugins: [],
}
