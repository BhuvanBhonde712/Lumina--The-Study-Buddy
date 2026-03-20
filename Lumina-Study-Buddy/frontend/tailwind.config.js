/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        base: '#07090E',
        surface: '#0D1117',
        's2': '#111827',
        's3': '#1a2233',
        border: '#1E2837',
        'border-2': '#263347',
        primary: '#3B7EFF',
        'primary-hover': '#2563EB',
        teal: '#00C9A7',
        amber: '#F59E0B',
        rose: '#F43F5E',
        't1': '#E2E8F0',
        't2': '#8B9BB4',
        't3': '#4A5568',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};