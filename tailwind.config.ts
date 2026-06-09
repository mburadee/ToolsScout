import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0f0e0d',
          muted: '#3d3a36',
          faint: '#8b8580',
        },
        paper: {
          DEFAULT: '#faf8f5',
          2: '#f2efe9',
          3: '#e8e4dc',
        },
        accent: {
          DEFAULT: '#e8642c',
          dark: '#c94f1a',
          light: '#fdf1eb',
        },
        brand: {
          green: '#2a7a4b',
          'green-light': '#edf7f2',
          blue: '#1a5fac',
          'blue-light': '#eaf1fb',
        },
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
