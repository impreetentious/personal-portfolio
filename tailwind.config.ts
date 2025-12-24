import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
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
        accent: '#38BDF8',
        success: '#d0752fff',
        metaphor: '#eded80ff',
        hairline: 'rgba(255,255,255,0.08)',
        'muted-foreground': 'rgba(171,178,191,0.50)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
        display: ['var(--font-display)', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        panel:
          'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0, 0, 0, 0.28), 0 48px 100px rgba(0, 0, 0, 0.40)',
      },
    },
  },
  plugins: [],
}

export default config
