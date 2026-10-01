/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Preto e verde da identidade Zap Page.
        bg: {
          primary: '#000000',
          secondary: '#000000',
          card: '#000000',
          cardPremium: '#000000',
        },
        neon: {
          DEFAULT: '#37c400',
          secondary: '#41d108',
          dark: '#37c400',
        },
        ink: {
          white: '#FFFFFF',
          light: '#e9ede8',
          dark: '#e9ede8',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        neon: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 8px rgba(55,196,0, 0.052)',
        'neon-sm': '0 6px 18px rgba(0, 0, 0, 0.22), 0 0 5px rgba(55,196,0, 0.038)',
        'neon-strong':
          '0 14px 36px rgba(0, 0, 0, 0.32), 0 0 12px rgba(55,196,0, 0.068)',
      },
      borderColor: {
        neon: 'rgba(55,196,0, 0.25)',
      },
      backgroundImage: {
        'radial-gold':
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(55,196,0, 0.12), transparent 58%)',
        'radial-gold-bottom':
          'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(65,209,8, 0.10), transparent 58%)',
        'grid-lines':
          "linear-gradient(rgba(55,196,0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(55,196,0, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.02)',
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
        float: 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
