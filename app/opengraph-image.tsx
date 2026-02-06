import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Abolish Abortion Michigan';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontSize: '72px',
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            ABOLISH ABORTION
          </h1>
          <div
            style={{
              width: '80px',
              height: '4px',
              background: '#dc2626',
            }}
          />
          <h2
            style={{
              color: '#dc2626',
              fontSize: '48px',
              fontWeight: 700,
              textAlign: 'center',
              margin: 0,
            }}
          >
            MICHIGAN
          </h2>
          <p
            style={{
              color: '#9ca3af',
              fontSize: '24px',
              textAlign: 'center',
              marginTop: '16px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Immediate and Total Abolition
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
