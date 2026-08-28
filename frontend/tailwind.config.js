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
        cyber: {
          dark: '#0a0d14',
          darker: '#06080d',
          card: '#0f172a',
          cardBorder: '#1e293b',
          cardHover: '#1e293b',
          cyan: '#06b6d4',
          cyanGlow: 'rgba(6, 182, 212, 0.25)',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          blue: '#3b82f6',
          cisco: '#049fd9'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'cyber-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'cyber-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'cyber-rose': '0 0 20px -5px rgba(244, 63, 94, 0.35)',
        'cyber-amber': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'laser-flow': 'laserFlow 2s linear infinite',
      },
      keyframes: {
        laserFlow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
