// src/components/forex/TradingViewView.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'styled-components';

/**
 * Theme-aware TradingView Advanced Chart.
 * Renders inside an iframe, so we can only flip between light/dark
 * and nudge its bg / grid / text colors toward the active theme.
 */
export default function TradingViewView() {
  const theme = useTheme();
  const containerRef = useRef(null);
  const widgetId = useRef('tv_' + Math.random().toString(36).slice(2, 10));

  // Your theme key → TradingView's binary light/dark
  const tvTheme = useMemo(() => {
    const key = (theme?.name || theme?.key || '').toLowerCase();
    return key === 'white' ? 'light' : 'dark';
  }, [theme]);

  // Nudge the widget's palette toward your site's
  const tvColors = useMemo(() => {
    const c = theme?.colors || {};
    return {
      backgroundColor: c.bg     || (tvTheme === 'light' ? '#ffffff' : '#070707'),
      gridColor:       c.border || (tvTheme === 'light' ? '#e5e7eb' : '#1e1e1e'),
      textColor:       c.text   || (tvTheme === 'light' ? '#0a0a0a' : '#ffffff'),
    };
  }, [theme, tvTheme]);

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
      symbol: 'OANDA:EURUSD',
      interval: '15',
      timezone: 'Africa/Nairobi',
      theme: tvTheme,
      style: '1',               // 1 = candles
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      withdateranges: true,
      save_image: false,
      backgroundColor: tvColors.backgroundColor,
      gridColor:       tvColors.gridColor,
      container_id:    widgetId.current,
    });

    wrapper.appendChild(inner);
    wrapper.appendChild(script);
    container.appendChild(wrapper);

    return () => { container.innerHTML = ''; };
  }, [tvTheme, tvColors]);

  const c = theme?.colors || {};

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        background: c.bg || '#070707',
        color: c.text || '#fff',
        padding: 20,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
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
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: c.text || '#fff',
            }}
          >
            TradingView
          </h1>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 13,
              color: c.textMuted || '#94a3b8',
            }}
          >
            Live charts for EUR/USD, BTC/USD, XAU/USD and every other market — theme-aware.
          </p>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            padding: '6px 12px',
            borderRadius: 8,
            background: c.accentLight || 'rgba(59,130,246,0.12)',
            border: `1px solid ${c.accentMuted || 'rgba(59,130,246,0.3)'}`,
            color: c.accent || '#3b82f6',
          }}
        >
          {tvTheme === 'light' ? '☀ Light' : '🌙 Dark'} · Follows your theme
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: 'calc(100vh - 200px)',
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${c.border || '#1e1e1e'}`,
          background: c.surfaceElevated || '#111',
        }}
      />
    </div>
  );
}