// =============================================================================
// src/app/opengraph-image.tsx — og:image dynamique (Next.js ImageResponse)
// =============================================================================

import { ImageResponse } from 'next/og';

export const runtime     = 'edge';
export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 80px',
          background: '#0A0A0A',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow violet */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
          }}
        />

        {/* Badge disponible */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#48BB78',
            }}
          />
          <span style={{ color: '#48BB78', fontSize: 18, fontWeight: 600 }}>
            Disponible — Freelance
          </span>
        </div>

        {/* Nom */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#EAEAEA',
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          Just&apos;un Dev
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(234,234,234,0.6)',
            marginBottom: 48,
          }}
        >
          Simple à dire, sérieux à faire.
        </div>

        {/* Badges stack */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['TypeScript', 'Next.js', 'Node.js', 'D3.js', 'React'].map((tech) => (
            <div
              key={tech}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.4)',
                color: '#8B5CF6',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 80,
            color: 'rgba(234,234,234,0.35)',
            fontSize: 18,
          }}
        >
          justundev.fr
        </div>
      </div>
    ),
    { ...size }
  );
}
