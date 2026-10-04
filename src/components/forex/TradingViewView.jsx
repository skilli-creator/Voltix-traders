// src/components/forex/TradingViewView.jsx
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

export default function TradingViewView() {
  const theme = useTheme();
  const c = theme?.colors || {};
  const isLight = theme?.category === 'light';
  const tvTheme = isLight ? 'light' : 'dark';

  const containerRef = useRef(null);
  const widgetId = useRef('tv_' + Math.random().toString(36).slice(2, 10));
  const [symbol, setSymbol] = useState('OANDA:EURUSD');

  const WATCH = [
    { label: 'EUR/USD', sym: 'OANDA:EURUSD' },
    { label: 'GBP/USD', sym: 'OANDA:GBPUSD' },
    { label: 'USD/JPY', sym: 'OANDA:USDJPY' },
    { label: 'AUD/USD', sym: 'OANDA:AUDUSD' },
    { label: 'USD/CAD', sym: 'OANDA:USDCAD' },
    { label: 'XAU/USD', sym: 'OANDA:XAUUSD' },
    { label: 'BTC/USD', sym: 'BITSTAMP:BTCUSD' },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tradingview-widget-container';
    wrapper.style.height = '100%';
    wrapper.style.width = '100%';
    wrapper.id = widgetId.current;

    const inner = document.createElement('div');
    inner.className = 'tradingview-widget-container__widget';
    inner.style.height = '100%';
    inner.style.width = '100%';

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: '15',
      timezone: 'Africa/Nairobi',
      theme: tvTheme,
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      withdateranges: true,
      save_image: false,
      backgroundColor: c.bg || (isLight ? '#ffffff' : '#0b0a08'),
      gridColor:       c.border || (isLight ? '#e2e8f0' : '#2a2620'),
      container_id:    widgetId.current,
    });

    wrapper.appendChild(inner);
    wrapper.appendChild(script);
    container.appendChild(wrapper);

    return () => { container.innerHTML = ''; };
  }, [tvTheme, symbol, isLight, c.bg, c.border]);

  return (
    <div
      style={{
        // 🎯 Break out of the .forex-content padding & max-width so the chart fills the page
        margin: '-24px -26px -60px',
        width: 'calc(100% + 52px)',
        height: 'calc(100vh - 76px)',
        display: 'flex',
        flexDirection: 'column',
        background: c.bg || '#0b0a08',
        overflow: 'hidden',
      }}
      className="tv-fullbleed"
    >
      {/* Mobile override: smaller negative margin, responsive height */}
      <style>{`
        @media (max-width: 768px) {
          .tv-fullbleed {
            margin: -18px -14px -80px !important;
            width: calc(100% + 28px) !important;
            height: calc(100vh - 56px) !important;
          }
        }
      `}</style>

      {/* ===== Compact header bar ===== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          borderBottom: `1px solid ${c.border || '#2a2620'}`,
          background: c.surfaceElevated || c.surface || '#141310',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: '-0.3px',
              color: c.text || '#f8f5ef',
              whiteSpace: 'nowrap',
            }}
          >
            TradingView
          </h1>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 9px',
              borderRadius: 6,
              background: c.accentLight || 'rgba(212,175,55,0.1)',
              border: `1px solid ${c.accentMuted || 'rgba(212,175,55,0.2)'}`,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.7,
              textTransform: 'uppercase',
              color: c.accent || '#d4af37',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: c.accent || '#d4af37',
                boxShadow: `0 0 6px ${c.accent || '#d4af37'}`,
              }}
            />
            {isLight ? 'Light' : 'Dark'} · theme-synced
          </span>
        </div>

        {/* Symbol chips — horizontally scrollable */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 2,
          }}
        >
          {WATCH.map((w) => {
            const active = w.sym === symbol;
            return (
              <button
                key={w.sym}
                onClick={() => setSymbol(w.sym)}
                style={{
                  flexShrink: 0,
                  padding: '5px 12px',
                  borderRadius: 7,
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: 0.2,
                  cursor: 'pointer',
                  transition: 'all .18s ease',
                  background: active
                    ? c.accentLight || 'rgba(212,175,55,0.14)'
                    : c.surfaceHover || 'rgba(255,255,255,0.04)',
                  border: `1px solid ${
                    active
                      ? c.accentMuted || 'rgba(212,175,55,0.4)'
                      : c.border || 'rgba(255,255,255,0.08)'
                  }`,
                  color: active
                    ? c.accent || '#d4af37'
                    : c.textSecondary || '#b8b0a0',
                  whiteSpace: 'nowrap',
                }}
              >
                {w.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Full-height chart area ===== */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          width: '100%',
          minHeight: 0,
          position: 'relative',
          background: c.surfaceElevated || c.surface || '#141310',
        }}
      />

      {/* ===== Slim footer notice ===== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 16px',
          background: c.surfaceElevated || c.surface || '#141310',
          borderTop: `1px solid ${c.border || '#2a2620'}`,
          fontSize: 11,
          color: c.textMuted || '#7a7368',
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          stroke={c.accent || '#d4af37'}
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8h.01M11 12h1v4h1" />
        </svg>
        <span>
          Charts embedded from TradingView · follows your active theme · accent tints are approximate
        </span>
      </div>
    </div>
  );
}