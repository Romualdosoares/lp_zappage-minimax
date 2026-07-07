/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oficial VendeZap™
        bg: {
          primary: '#020402',
          secondary: '#071107',
          card: '#0B140B',
          cardPremium: '#101C10',
        },
        neon: {
          DEFAULT: '#39FF14',
          secondary: '#00FF66',
          dark: '#0B3D18',
        },
        ink: {
          white: '#FFFFFF',
          light: '#B8C7B8',
          dark: '#6F7F6F',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        neon: '0 0 25px rgba(57, 255, 20, 0.45), 0 0 60px rgba(57, 255, 20, 0.25)',
        'neon-sm': '0 0 12px rgba(57, 255, 20, 0.5)',
        'neon-strong':
          '0 0 30px rgba(57, 255, 20, 0.6), 0 0 80px rgba(57, 255, 20, 0.3)',
      },
      borderColor: {
        neon: 'rgba(57, 255, 20, 0.25)',
      },
      backgroundImage: {
        'radial-green':
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(57, 255, 20, 0.18), transparent 60%)',
        'radial-green-bottom':
          'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0, 255, 102, 0.15), transparent 60%)',
        'grid-lines':
          "linear-gradient(rgba(57, 255, 20, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow:
              '0 0 18px rgba(57, 255, 20, 0.45), 0 0 40px rgba(57, 255, 20, 0.18)',
          },
          '50%': {
            boxShadow:
              '0 0 28px rgba(57, 255, 20, 0.75), 0 0 70px rgba(57, 255, 20, 0.32)',
          },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
