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
        soc: {
          deep: '#060911',      // Purest dark navy foundation
          bg: '#0a0e17',        // Deep obsidian navy
          surface: '#0f172a',   // Slate 900
          card: '#111a2e',      // Elevated dark slate
          cardHover: '#17233f', // Interactive hover state
          border: '#1e293b',    // Subtle border
          borderSubtle: '#151f33',
          borderStrong: '#334155',
          text: '#f8fafc',      // Slate 50
          textMuted: '#94a3b8', // Slate 400
          textDim: '#64748b',   // Slate 500
          primary: '#0284c7',   // Sky 600
          primaryHover: '#0369a1',
          accent: '#38bdf8',    // Sky 400
          success: '#10b981',   // Emerald 500
          successSubtle: '#064e3b',
          warning: '#f59e0b',   // Amber 500
          warningSubtle: '#78350f',
          danger: '#ef4444',    // Red 500
          dangerSubtle: '#7f1d1d',
          info: '#6366f1',      // Indigo 500
        },
        cyber: {
          dark: '#0a0e17',
          darker: '#06080d',
          card: '#0f172a',
          cardBorder: '#1e293b',
          cardHover: '#1e293b',
          cyan: '#0ea5e9',
          cyanGlow: 'rgba(14, 165, 233, 0.15)',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          blue: '#3b82f6',
          cisco: '#049fd9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'soc-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.35)',
        'soc-md': '0 4px 6px -1px rgba(0, 0, 0, 0.45), 0 2px 4px -2px rgba(0, 0, 0, 0.45)',
        'soc-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.55), 0 4px 6px -4px rgba(0, 0, 0, 0.55)',
        'soc-glow-sky': '0 0 20px -3px rgba(14, 165, 233, 0.25)',
        'soc-glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
        'soc-glow-rose': '0 0 20px -3px rgba(244, 63, 94, 0.25)',
        'soc-glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.25)',
        'cyber-cyan': '0 0 15px -3px rgba(14, 165, 233, 0.25)',
        'cyber-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
        'cyber-rose': '0 0 15px -3px rgba(244, 63, 94, 0.25)',
        'cyber-amber': '0 0 15px -3px rgba(245, 158, 11, 0.25)',
      },
      borderRadius: {
        'soc': '0.625rem',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s ease-out forwards',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
