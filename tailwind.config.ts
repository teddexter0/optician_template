import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50:  '#eef4fb',
          100: '#d5e4f4',
          200: '#abcae9',
          300: '#7baede',
          400: '#4b92d3',
          500: '#2176c8',
          600: '#1b5ea0',
          700: '#1B3A5C',
          800: '#152e49',
          900: '#0e2236',
        },
        accent: {
          50:  '#edfafa',
          100: '#d5f5f4',
          200: '#abebe9',
          300: '#7ddedd',
          400: '#4ECDC4',
          500: '#38b2ab',
          600: '#2c8e88',
          700: '#226b66',
          800: '#184845',
          900: '#0e2524',
        },
      },
    },
  },
  plugins: [],
}

export default config
