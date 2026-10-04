// src/components/forex/TradingViewView.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '100%' }}>
      {/* ===== Header ===== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: c.text || '#f8f5ef' }}>
            TradingView
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: c.textSecondary || '#b8b0a0' }}>
            Live charts for EUR/USD, GBP/USD, gold and more — follows your theme.
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 12px', borderRadius: 9,
            background: c.accentLight || 'rgba(212,175,55,0.1)',
            border: `1px solid ${c.accentMuted || 'rgba(212,175,55,0.2)'}`,
            fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
            color: c.accent || '#d4af37',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent || '#d4af37', boxShadow: `0 0 6px ${c.accent || '#d4af37'}` }} />
          {isLight ? 'Light' : 'Dark'} · theme-synced
        </div>
      </div>

      {/* ===== Symbol chips ===== */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
        {WATCH.map((w) => {
          const active = w.sym === symbol;
          return (
            <button
              key={w.sym}
              onClick={() => setSymbol(w.sym)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 9,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all .2s ease',
                background: active ? (c.accentLight || 'rgba(212,175,55,0.12)') : (c.surfaceHover || 'rgba(255,255,255,0.04)'),
                border: `1px solid ${active ? (c.accentMuted || 'rgba(212,175,55,0.35)') : (c.border || 'rgba(255,255,255,0.08)')}`,
                color: active ? (c.accent || '#d4af37') : (c.textSecondary || '#b8b0a0'),
              }}
            >
              {w.label}
            </button>
          );
        })}
      </div>

      {/* ===== Chart container — full height =====
          Height = viewport - (topbar 76 + content top pad 24 + header 60 + chips 40 + footer 60 + safety 40) = ~ -300
          We use a minimum of 560px so it always has room, and 100vh - 320px otherwise.
      */}
      <div
        style={{
          width: '100%',
          height: 'max(560px, calc(100vh - 320px))',
          borderRadius: 14,
          overflow: 'hidden',
          border: `1px solid ${c.border || '#2a2620'}`,
          background: c.surfaceElevated || c.surface || '#141310',
          position: 'relative',
        }}
      >
        <div
          ref={containerRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* ===== Footer note ===== */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 11,
          background: c.accentLight || 'rgba(212,175,55,0.08)',
          border: `1px solid ${c.accentMuted || 'rgba(212,175,55,0.18)'}`,
          fontSize: 12, color: c.textSecondary || '#b8b0a0', lineHeight: 1.5,
        }}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={c.accent || '#d4af37'} strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8h.01M11 12h1v4h1" />
        </svg>
        <span>
          Charts are embedded from TradingView and switch between light/dark with your theme.
          They can't inherit exact accent colors since TradingView runs in a sandboxed iframe.
        </span>
      </div>
    </div>
  );
}