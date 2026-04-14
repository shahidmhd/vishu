import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        kerala: {
          green:  '#1a4731',
          darkGreen: '#0d2b1e',
          light: '#2d6a4f',
          gold: '#f4c430',
          amber: '#ffaa00',
          deepAmber: '#ff8c00',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        display: ['Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px #fbbf24, 0 0 40px #f59e0b, 0 0 60px #d97706' },
          '50%': { boxShadow: '0 0 40px #fbbf24, 0 0 80px #f59e0b, 0 0 120px #d97706' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
      backgroundImage: {
        'kerala-gradient': 'linear-gradient(135deg, #0d2b1e 0%, #1a4731 30%, #0d2b1e 60%, #1a1a0d 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f4c430 0%, #ffaa00 50%, #ff8c00 100%)',
        'glow-gradient': 'radial-gradient(circle, #fbbf2460 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
export default config
