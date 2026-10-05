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
  const [symbol] = useState('OANDA:EURUSD');

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
        // Break out of .forex-content padding so the chart fills the page
        margin: '-24px -26px -60px',
        width: 'calc(100% + 52px)',
        height: 'calc(100vh - 76px)',
        background: c.bg || '#0b0a08',
        overflow: 'hidden',
      }}
      className="tv-fullbleed"
    >
      <style>{`
        @media (max-width: 768px) {
          .tv-fullbleed {
            margin: -18px -14px -80px !important;
            width: calc(100% + 28px) !important;
            height: calc(100vh - 56px) !important;
          }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: c.surfaceElevated || c.surface || '#141310',
        }}
      />
    </div>
  );
}