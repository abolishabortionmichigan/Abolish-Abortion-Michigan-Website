import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

export function generateOGImage(title: string, subtitle?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: '0.05em',
            marginBottom: 24,
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: '#dc2626',
            marginBottom: 24,
          }}
        />
        {subtitle && (
          <div
            style={{
              fontSize: 28,
              color: '#d1d5db',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            color: '#9ca3af',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Abolish Abortion Michigan
        </div>
      </div>
    ),
    ogSize,
  );
}
