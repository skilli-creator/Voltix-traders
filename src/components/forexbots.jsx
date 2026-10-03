// src/components/forexbots.jsx
import { useTheme } from 'styled-components';
import { fmt } from '../pages/forexdash';

import euroBotImg from '../assets/images/image14.png';
import btcBotImg  from '../assets/images/image15.png';
import goldBotImg from '../assets/images/image16.png';

const BOTS_META = {
  EURUSD: { name: 'Euro Master',    image: euroBotImg, accentKey: 'info'    },
  BTCUSD: { name: 'Bitcoin Master', image: btcBotImg,  accentKey: 'warning' },
  XAUUSD: { name: 'Gold Master',    image: goldBotImg, accentKey: 'accent'  },
};

const ORDER = ['EURUSD', 'BTCUSD', 'XAUUSD'];

const withAlpha = (color, a) => {
  if (typeof color !== 'string') return color;
  if (color.startsWith('rgb') || color.startsWith('hsl')) return color;
  if (/^#[0-9a-f]{8}$/i.test(color)) return color;
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color + Math.round(Math.min(1, Math.max(0, a)) * 255)
      .toString(16).padStart(2, '0');
  }
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    const e = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    return withAlpha(e, a);
  }
  return color;
};

export default function ForexBots({ bots = [], onConfigureBot, onToggleBot }) {
  const theme = useTheme();
  const c = theme?.colors || {};

  const accent       = c.accent      || '#f5b400';
  const text         = c.text        || '#e8eefb';
  const textMuted    = c.textMuted   || '#8b8b93';
  const card         = c.surface     || '#111114';
  const cardElev     = c.surfaceElevated || card;
  const bg           = c.bg          || c.background || '#0a0a0a';
  const border       = c.border      || 'rgba(255,255,255,0.08)';
  const shadow       = c.shadow      || '0 12px 32px -12px rgba(0,0,0,0.55)';

  const getBotAccent = (sym) => {
    const themed = c.bots?.[sym];
    if (themed) return themed;
    const key = BOTS_META[sym]?.accentKey || 'accent';
    return c[key] || accent;
  };

  const orderedBots = ORDER
    .map((sym) => bots.find((b) => b.sym === sym))
    .filter(Boolean);

  return (
    <>
      <style>{`
        .view.active.fb-root{
          overflow-y:auto !important;
          overflow-x:hidden !important;
          height:100% !important;
          max-height:100vh;
          -webkit-overflow-scrolling:touch;
          scroll-behavior:smooth;
        }

        .fb-root{
          display:block;
          padding:8px 0 48px;
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
          color:${text};
        }
        .fb-root *{ box-sizing:border-box; }

        .fb-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:24px;
          align-items:stretch;
        }

        /* ---------- Card ---------- */
        .fb-card{
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
          padding:28px 24px 26px;
          border-radius:16px;
          background:${card};
          border:1px solid ${border};
          transition:border-color .2s ease, box-shadow .2s ease, transform .2s ease;
        }
        .fb-card:hover{
          border-color:${withAlpha(accent, 0.35)};
          box-shadow:${shadow};
          transform:translateY(-2px);
        }

        /* ---------- Image (natural size, no stretch) ---------- */
        .fb-img{
          display:block;
          width:100%;
          max-width:200px;
          height:auto;
          object-fit:contain;
          border-radius:12px;
          margin-bottom:22px;
          user-select:none;
        }

        /* ---------- Name ---------- */
        .fb-name{
          font-size:16px;
          font-weight:700;
          letter-spacing:-.2px;
          color:${text};
          margin:0 0 16px;
          line-height:1.3;
        }

        /* ---------- Win rate ---------- */
        .fb-winrate{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          padding:9px 18px;
          border-radius:10px;
          background:${cardElev};
          border:1px solid ${border};
          margin-bottom:24px;
        }
        .fb-winrate-label{
          font-size:11px;
          font-weight:600;
          letter-spacing:.6px;
          text-transform:uppercase;
          color:${textMuted};
        }
        .fb-winrate-value{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:15px;
          font-weight:700;
          color:${text};
          font-variant-numeric:tabular-nums;
        }

        /* ---------- Configure button ---------- */
        .fb-configure{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          width:100%;
          max-width:220px;
          padding:11px 20px;
          border-radius:10px;
          font-family:inherit;
          font-size:13px;
          font-weight:700;
          cursor:pointer;
          margin-top:auto;
          background:${cardElev};
          border:1px solid ${border};
          color:${text};
          transition:background .18s ease, border-color .18s ease, color .18s ease;
        }
        .fb-configure:hover{
          background:${accent};
          border-color:${accent};
          color:${bg};
        }
        .fb-configure:active{
          transform:scale(.98);
        }
        .fb-configure svg{
          width:14px; height:14px;
          flex-shrink:0;
        }

        /* ---------- Responsive ---------- */
        @media (max-width:1080px){
          .fb-grid{ grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:720px){
          .fb-grid{ grid-template-columns:1fr; gap:16px; }
          .fb-card{ padding:24px 20px 22px; }
          .fb-img{ max-width:170px; margin-bottom:18px; }
          .fb-name{ font-size:15px; margin-bottom:14px; }
          .fb-winrate{ margin-bottom:20px; padding:8px 16px; }
        }
      `}</style>

      <section className="view active fb-root">
        <div className="fb-grid">
          {orderedBots.map((b) => {
            const meta = BOTS_META[b.sym] || {};
            const botAccent = getBotAccent(b.sym);

            return (
              <article key={b.id} className="fb-card">
                <img
                  src={meta.image}
                  alt={meta.name || b.name}
                  className="fb-img"
                  loading="lazy"
                  draggable="false"
                />

                <h3 className="fb-name">{meta.name || b.name}</h3>

                <div className="fb-winrate">
                  <span className="fb-winrate-label">Win rate</span>
                  <span className="fb-winrate-value">{fmt(b.winRate || 0, 1)}%</span>
                </div>

                <button
                  className="fb-configure"
                  type="button"
                  onClick={() =>
                    onConfigureBot
                      ? onConfigureBot(b.id)
                      : (onToggleBot && onToggleBot(b.id))
                  }
                  style={{
                    '--fb-accent': botAccent,
                  }}
                  aria-label={`Configure ${meta.name || b.name}`}
                >
                  <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Configure</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}