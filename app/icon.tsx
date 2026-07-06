import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        border: '1px solid rgba(56,189,248,0.45)',
        borderRadius: 7,
        color: '#38BDF8',
        fontSize: 17,
        fontWeight: 700,
      }}
    >
      {'>_'}
    </div>,
    { ...size },
  )
}
