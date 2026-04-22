/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cryo-bg':     '#0A0A0A',
        'cryo-bg-2':   '#111111',
        'cryo-bg-3':   '#1A1A1A',
        'cryo-fg':     '#F0F0F0',
        'cryo-mid':    '#888888',
        'cryo-dim':    '#444444',
        'cryo-border': 'rgba(240,240,240,0.08)',
      },
      fontFamily: {
        logo:     ['Cal Sans', 'sans-serif'],
        headline: ['Old Standard TT', 'serif'],
        ui:       ['IBM Plex Mono', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
      borderRadius: {
        none: '0px',
      },
    },
  },
  plugins: [],
};