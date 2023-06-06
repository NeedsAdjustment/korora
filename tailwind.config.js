/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '530px',
      md: '785px',
      lg: '1200px',
    },
    extend: {
      fontFamily: {
        heading: ['var(--font-ogg)'],
        display: ['var(--font-styrene-a)'],
        body: ['var(--font-styrene-b)'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        green: {
          primary: '#D1C1D7',
          secondary: '#F6CBD1',
          accent: '#89eda9',
          neutral: '#fff',
          'base-100': '#31553d',

          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
    ],
  },
}
