import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--white)',
        foreground: 'var(--black)',
        primary: {
          DEFAULT: '#B85C12', // Caju color - orange
          50: '#FDF3E7',
          100: '#FCE7CF',
          200: '#F8CFA0',
          300: '#F4B770',
          400: '#F09F41',
          500: '#B85C12', // Primary
          600: '#A05010',
          700: '#88440E',
          800: '#70380C',
          900: '#582C0A',
        },
        secondary: {
          DEFAULT: '#34495E', // Dark blue
          50: '#EAF0F6',
          100: '#D5E1EC',
          200: '#ACC3DA',
          300: '#82A5C7',
          400: '#5887B4',
          500: '#34495E', // Secondary
          600: '#2B3D4F',
          700: '#233240',
          800: '#1A2631',
          900: '#111B22',
        },
        success: '#27AE60',
        warning: '#F1C40F',
        error: '#E74C3C',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      animation: {
        'fade-in-out': 'fadeInOut 2s ease-in-out infinite',
        shake:
          'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)',
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)',
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)',
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
