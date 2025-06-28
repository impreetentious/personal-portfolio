import type {Config} from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0F1015',
        surface2: '#090A10',
        foreground: '#ABB2BF',
        accent: '#00C8FF',
        success: '#d0752fff',
        metaphor: '#d6d1daff',
        hairline: 'rgba(255,255,255,0.08)',
        'muted-foreground': 'rgba(171,178,191,0.50)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        panel: '0 20px 40px rgba(0, 0, 0, 0.28)',
      },
      backgroundImage: {
        'hero-raster':
          'radial-gradient(circle at top, rgba(97, 175, 239, 0.16), transparent 34%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'hero-raster': '100% 100%, 32px 32px, 32px 32px',
      },
    },
  },
  plugins: [],
}

export default config
