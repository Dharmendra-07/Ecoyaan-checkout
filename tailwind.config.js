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
        // dark mode palette
        dark: {
          bg:    '#0f1a10',
          card:  '#1a2b1c',
          muted: '#1f2e21',
        },
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'Cambria', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.45s ease forwards',
        'slide-in':   'slideIn 0.35s ease forwards',
        'scale-in':   'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-green':'pulseGreen 2s infinite',
        'spin-slow':  'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity:'0', transform:'translateY(18px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        slideIn: { '0%': { opacity:'0', transform:'translateX(-14px)' }, '100%': { opacity:'1', transform:'translateX(0)' } },
        scaleIn: { '0%': { opacity:'0', transform:'scale(0.94)' }, '100%': { opacity:'1', transform:'scale(1)' } },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(61,138,68,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(61,138,68,0)' },
        },
      },
      boxShadow: {
        'forest-sm': '0 2px 8px rgba(27,59,30,0.08)',
        'forest-md': '0 4px 16px rgba(27,59,30,0.12)',
        'forest-lg': '0 8px 32px rgba(27,59,30,0.15)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
