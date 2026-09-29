/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Preto e ouro da identidade Zap Page.
        bg: {
          primary: '#030302',
          secondary: '#080705',
          card: '#100D08',
          cardPremium: '#171109',
        },
        neon: {
          DEFAULT: '#E7B825',
          secondary: '#FFE071',
          dark: '#6D4C0D',
        },
        ink: {
          white: '#FFFFFF',
          light: '#CFC5AE',
          dark: '#A99A7C',
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
        neon: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 8px rgba(231, 184, 37, 0.052)',
        'neon-sm': '0 6px 18px rgba(0, 0, 0, 0.22), 0 0 5px rgba(231, 184, 37, 0.038)',
        'neon-strong':
          '0 14px 36px rgba(0, 0, 0, 0.32), 0 0 12px rgba(231, 184, 37, 0.068)',
      },
      borderColor: {
        neon: 'rgba(231, 184, 37, 0.25)',
      },
      backgroundImage: {
        'radial-green':
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(231, 184, 37, 0.12), transparent 58%)',
        'radial-green-bottom':
          'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255, 224, 113, 0.10), transparent 58%)',
        'grid-lines':
          "linear-gradient(rgba(231, 184, 37, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(231, 184, 37, 0.05) 1px, transparent 1px)",
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
