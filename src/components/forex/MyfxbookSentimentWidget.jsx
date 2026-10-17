// src/components/forex/MyfxbookSentimentWidget.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

export default function MyfxbookSentimentWidget() {
  const theme = useTheme();
  const c = theme?.colors || {};

  const bg = c.bg || '#0b0a08';
  const textMuted = c.textMuted || '#94a3b8';
  const accent = c.accent || '#3b82f6';
  const border = c.border || 'rgba(255,255,255,0.05)';

  const isDarkTheme = theme?.category === 'dark' || (theme?.name && theme.name !== 'White');
  const containerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // 1. Inject the Myfxbook script
    const script = document.createElement('script');
    script.src = "https://widgets.mfbcdn.net/scripts/fxOutlook.js?type=1&symbols=,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,27,28,29,31,34,36,37,38,40,41,42,43,45,46,47,48,49,50,51,103,107,131,137,1233,1234,1236,1245,1246,1247,1815,1863,1893,2012,2076,2090,2114,2115,2119,2521,2603,2872,3005,3240,3473,5079,5435,5779";
    script.async = true;
    script.className = "powered";

    script.onload = () => {
      // 2. Once loaded, call the global function Myfxbook provides
      if (typeof window.showOutlookWidget === 'function') {
        try {
          window.showOutlookWidget();
        } catch (e) {
          console.error("Myfxbook Sentiment Widget error:", e);
        }
      }
      setScriptLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src*="fxOutlook.js"]');
      if (existingScript) existingScript.remove();
    };
  }, []);

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
      }}
    >
      <div 
        style={{ 
          flex: 1, 
          position: 'relative', 
          overflow: 'auto', // Allow scrolling if the script widget is tall
          padding: '20px',
        }}
      >
        {/* 
          The script injects its UI here. We apply the theme filter to this container 
          so the injected HTML obeys the dark/gold/ocean theme.
        */}
        <div
          ref={containerRef}
          id="myfxbook-sentiment-container"
          style={{
            filter: isDarkTheme ? 'invert(0.9) hue-rotate(180deg)' : 'none',
            transition: 'filter 0.3s ease',
            minHeight: '100%',
            position: 'relative',
          }}
        >
          {/* The script dynamically inserts content below this div, or replaces it */}
        </div>

        {/* Tint Overlay for the script content */}
        {isDarkTheme && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: accent,
              opacity: 0.12,
              pointerEvents: 'none',
              mixBlendMode: 'color',
              zIndex: 2,
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
          zIndex: 3,
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