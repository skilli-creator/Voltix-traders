// src/components/forex/MyfxbookWidget.jsx
import React from 'react';
import { useTheme } from 'styled-components';

export default function MyfxbookWidget({ src, title }) {
  const theme = useTheme();
  const c = theme?.colors || {};

  const bg = c.bg || '#0b0a08';
  const textMuted = c.textMuted || '#94a3b8';
  const accent = c.accent || '#3b82f6';
  const border = c.border || 'rgba(255,255,255,0.05)';

  // Fallback check ensures Gold, Ocean, etc., trigger the dark mode filter
  const isDarkTheme = theme?.category === 'dark' || (theme?.name && theme.name !== 'White');

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--topbar-h, 76px)',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        zIndex: 1,
        transition: 'background 0.3s ease',
      }}
    >
      {/* Iframe Container */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <iframe
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          title={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            filter: isDarkTheme ? 'invert(0.9) hue-rotate(180deg)' : 'none',
            transition: 'filter 0.3s ease',
          }}
        />

        {/* 
          THEME TINT OVERLAY
          This overlays the iframe with your theme's accent color.
          mix-blend-mode: 'color' applies the hue (Gold, Ocean, Red) 
          without destroying the brightness of the iframe text.
        */}
        {isDarkTheme && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: accent,
              opacity: 0.12, 
              pointerEvents: 'none', // Allows clicking through to the iframe
              mixBlendMode: 'color',
              zIndex: 2,
              transition: 'background-color 0.3s ease',
            }}
          />
        )}
      </div>

      {/* Attribution Footer */}
      <div
        style={{
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '11px',
          background: bg,
          color: textMuted,
          borderTop: `1px solid ${border}`,
          transition: 'all 0.3s ease',
        }}
      >
        <a
          href="https://www.myfxbook.com"
          title="Myfxbook"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: textMuted,
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
        >
          Powered by Myfxbook.com
        </a>
      </div>
    </div>
  );
}