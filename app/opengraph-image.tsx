import { ImageResponse } from 'next/og'

// Keep the edge runtime: next/og's Node build fails at prerender on Windows
// (fileURLToPath "Invalid URL" inside @vercel/og), so this route must stay
// dynamic. The "disables static generation" build warning is expected.
export const runtime = 'edge'

export const alt = 'Sidakpreet Singh — Portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050505',
          backgroundImage:
            'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(56,189,248,0.10), transparent 70%)',
        }}
      >
        {/* Terminal window */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 960,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            background: '#0A0B10',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 52,
              background: '#080808',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '0 24px',
              color: 'rgba(171,178,191,0.55)',
              fontSize: 18,
            }}
          >
            <span style={{ color: '#38BDF8', marginRight: 12 }}>{'>_'}</span>
            <span>sidakpreet@portfolio: ~</span>
          </div>

          {/* Body */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '48px 56px 56px',
            }}
          >
            <div
              style={{
                display: 'flex',
                color: 'rgba(171,178,191,0.45)',
                fontSize: 22,
                marginBottom: 28,
              }}
            >
              {'/** @profile . latest */'}
            </div>

            <div
              style={{
                display: 'flex',
                color: '#FFFFFF',
                fontSize: 76,
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              Sidakpreet Singh
            </div>

            <div
              style={{
                display: 'flex',
                color: '#38BDF8',
                fontSize: 28,
                marginTop: 24,
              }}
            >
              {'// Product Strategy · Tech · Systems'}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 40,
                fontSize: 24,
                color: 'rgba(171,178,191,0.85)',
              }}
            >
              <span style={{ color: '#4ADE80', marginRight: 14 }}>{'>'}</span>
              <span>Welcome to my portfolio — glad to connect.</span>
              <span
                style={{
                  width: 13,
                  height: 30,
                  background: '#FB923C',
                  marginLeft: 10,
                }}
              />
            </div>
          </div>

          {/* Status bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 40,
              background: '#007acc',
              padding: '0 24px',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 17,
            }}
          >
            <span>⎇ main · 0 errors</span>
            <span>UTF-8 · TypeScript</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
