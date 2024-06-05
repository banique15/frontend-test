/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './node_modules/flowbite/**/*.js'],

  darkMode: 'light',
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        harmony: '#339933',
        harmonylight: '#EFFEEF',
        harmonydark: '#226622',
        resonance: '#221F20',
        melody: '#DA4680',
        melodylight: '#FFEDF4',
        melodydark: '#932e54',
        rhythm: '#54749E',
        rhythmlight: '#EFF6FF',
        rhythmdark: '#38516a',
        sonata: '#FDD05E',
        sonatalight: '#FFF9EA',
        sonatadark: '#bf8800',
        symphony: '#3A3F42',
        symphonylight: '#F3F3F3',
        symphonydark: '#262829',
        lightbg: '#f9fafb',
        transparent: 'transparent',
        black: '#000',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('daisyui'), require('flowbite/plugin'), require('tailwindcss-animate')],
};
