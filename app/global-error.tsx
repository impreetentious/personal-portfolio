'use client'

// Last-resort boundary for errors thrown in the root layout itself. It replaces
// the entire document, so it must render its own <html>/<body> and cannot rely
// on Tailwind/global styles being present — hence the inline styling.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#050505',
          color: '#ABB2BF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Code", monospace',
        }}
      >
        <div style={{ maxWidth: 480, padding: '0 24px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(244,71,71,0.5)',
              marginBottom: 16,
            }}
          >
            fatal · application error
          </p>
          <p style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>
            The application failed to load.
          </p>
          <p
            style={{
              color: 'rgba(171,178,191,0.6)',
              fontSize: 13,
              lineHeight: 1.7,
              marginBottom: 24,
              wordBreak: 'break-word',
            }}
          >
            {error?.message || 'A critical error occurred. Please try again.'}
          </p>
          <button
            onClick={() => reset()}
            style={{
              border: '1px solid rgba(56,189,248,0.3)',
              background: 'rgba(56,189,248,0.1)',
              color: '#38BDF8',
              padding: '8px 16px',
              borderRadius: 6,
              fontFamily: 'inherit',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            ↻ retry
          </button>
        </div>
      </body>
    </html>
  )
}
