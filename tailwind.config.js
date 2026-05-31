/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bz: {
          black: '#080810',
          void: '#0D0D1A',
          surface: '#12121F',
          card: '#1A1A2E',
          electric: '#00F5C4',
          violet: '#7B4FFF',
          pink: '#FF3E9D',
          white: '#F0F0FF',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-bz': 'linear-gradient(135deg, #7B4FFF 0%, #00F5C4 100%)',
        'gradient-bz-pink': 'linear-gradient(135deg, #FF3E9D 0%, #7B4FFF 100%)',
        'gradient-bz-electric': 'linear-gradient(135deg, #00F5C4 0%, #7B4FFF 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
