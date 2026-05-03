/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#98cbff',
        'primary-container': '#00a3ff',
        'primary-fixed-dim': '#98cbff',
        secondary: '#b7c8e1',
        'secondary-container': '#3a4a5f',
        tertiary: '#4edea3',
        'tertiary-container': '#00b27b',
        error: '#ffb4ab',
        'error-container': '#93000a',
        background: '#10131a',
        surface: '#10131a',
        'surface-container': '#1d2026',
        'surface-container-low': '#191c22',
        'surface-container-high': '#272a31',
        'surface-container-highest': '#32353c',
        'surface-variant': '#32353c',
        'on-surface': '#e1e2eb',
        'on-surface-variant': '#bec7d4',
        'on-background': '#e1e2eb',
        'on-primary': '#003354',
        'on-secondary': '#213145',
        outline: '#88919d',
        'outline-variant': '#3f4852',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
