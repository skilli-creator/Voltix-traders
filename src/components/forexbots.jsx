// src/components/forexbots.jsx
import { useTheme } from 'styled-components';
import { fmt } from '../pages/forexdash';

import euroBotImg from '../assets/images/image14.png';
import btcBotImg  from '../assets/images/image15.png';
import goldBotImg from '../assets/images/image16.png';

/* ================================================================ */
/*  BOTS                                                            */
/* ================================================================ */
const BOTS_META = {
  EURUSD: { name: 'Euro Master',    image: euroBotImg, accentKey: 'info'    },
  BTCUSD: { name: 'Bitcoin Master', image: btcBotImg,  accentKey: 'warning' },
  XAUUSD: { name: 'Gold Master',    image: goldBotImg, accentKey: 'accent'  },
};

const ORDER = ['EURUSD', 'BTCUSD', 'XAUUSD'];

/* Alpha helper */
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

/* ================================================================ */
/*  COMPONENT                                                       */
/* ================================================================ */
export default function ForexBots({ bots = [], onConfigureBot, onToggleBot }) {
  const theme = useTheme();
  const c = theme?.colors || {};

  /* Theme tokens */
  const accent      = c.accent      || '#f5b400';
  const text        = c.text        || '#e8eefb';
  const textMuted   = c.textMuted   || '#8b8b93';
  const card        = c.surface     || '#111114';
  const cardElev    = c.surfaceElevated || card;
  const bg          = c.bg          || c.background || '#0a0a0a';
  const border      = c.border      || 'rgba(255,255,255,0.08)';
  const shadowStrong= c.shadowStrong|| '0 28px 60px -20px rgba(0,0,0,0.8)';

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
        /* ============================================================
           SCROLL — parent view becomes scrollable
           ============================================================ */
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
          padding:4px 0 40px;
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
          color:${text};
          transition:color .25s ease;
        }
        .fb-root *{ box-sizing:border-box; }

        /* ============================================================
           GRID
           ============================================================ */
        .fb-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:20px;
          align-items:stretch;
        }

        /* ============================================================
           CARD
           ============================================================ */
        .fb-card{
          position:relative;
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
          padding:24px 22px 24px;
          border-radius:20px;
          background:${card};
          border:1px solid ${border};
          transition:
            transform .32s cubic-bezier(.16,1,.3,1),
            border-color .3s ease,
            box-shadow .32s ease;
        }
        .fb-card:hover{
          transform:translateY(-4px);
          border-color:var(--fb-accent-border);
          box-shadow:
            ${shadowStrong},
            0 0 0 1px var(--fb-accent-border),
            0 0 36px -14px var(--fb-accent);
        }

        /* ---------- Image at natural aspect ratio ---------- */
        .fb-image-box{
          position:relative;
          width:100%;
          max-width:220px;
          margin-bottom:18px;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .fb-image-box::before{
          content:'';
          position:absolute;
          inset:-10%;
          background:radial-gradient(circle, var(--fb-accent-glow), transparent 68%);
          opacity:.65;
          pointer-events:none;
          z-index:0;
        }
        .fb-image{
          position:relative;
          z-index:1;
          display:block;
          width:100%;
          height:auto;
          object-fit:contain;
          border-radius:16px;
          border:1px solid var(--fb-accent-border);
          box-shadow:
            0 12px 28px -14px var(--fb-accent),
            inset 0 1px 0 rgba(255,255,255,.12);
          user-select:none;
          transition:transform .35s cubic-bezier(.16,1,.3,1);
        }
        .fb-card:hover .fb-image{
          transform:scale(1.03);
        }

        /* ---------- Name ---------- */
        .fb-name{
          font-size:17px;
          font-weight:800;
          letter-spacing:-.4px;
          color:${text};
          margin:0 0 14px;
          line-height:1.2;
        }

        /* ---------- Win rate pill ---------- */
        .fb-winrate{
          display:inline-flex;
          align-items:baseline;
          gap:8px;
          padding:8px 16px;
          border-radius:11px;
          background:${cardElev};
          border:1px solid ${border};
          margin-bottom:22px;
          transition:border-color .2s ease;
        }
        .fb-card:hover .fb-winrate{
          border-color:var(--fb-accent-border);
        }
        .fb-winrate .label{
          font-size:9.5px;
          font-weight:800;
          letter-spacing:1.1px;
          text-transform:uppercase;
          color:${textMuted};
        }
        .fb-winrate .value{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:16px;
          font-weight:800;
          letter-spacing:-.4px;
          color:var(--fb-accent);
          font-variant-numeric:tabular-nums;
        }

        /* ---------- Configure button ---------- */
        .fb-configure{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          padding:11px 28px;
          border-radius:11px;
          font-family:inherit;
          font-size:13px;
          font-weight:800;
          letter-spacing:.2px;
          cursor:pointer;
          white-space:nowrap;
          margin-top:auto;
          background:var(--fb-accent-soft);
          border:1px solid var(--fb-accent-border);
          color:var(--fb-accent);
          transition:
            background .22s ease,
            color .22s ease,
            transform .22s cubic-bezier(.16,1,.3,1),
            box-shadow .22s ease;
        }
        .fb-configure:hover{
          background:var(--fb-accent);
          color:${bg};
          transform:translateY(-1px);
          box-shadow:0 10px 24px -10px var(--fb-accent);
        }
        .fb-configure:active{
          transform:translateY(0) scale(.98);
        }
        .fb-configure svg{
          width:15px; height:15px;
          flex-shrink:0;
        }

        /* ============================================================
           RESPONSIVE
           ============================================================ */
        @media (max-width:1180px){
          .fb-grid{ grid-template-columns:repeat(2,1fr); gap:18px; }
        }
        @media (max-width:760px){
          .fb-grid{ grid-template-columns:1fr; gap:16px; }
          .fb-card{ padding:20px 18px 22px; }
          .fb-image-box{ max-width:180px; margin-bottom:16px; }
          .fb-name{ font-size:16px; margin-bottom:12px; }
          .fb-winrate{ margin-bottom:18px; padding:7px 14px; }
          .fb-configure{ padding:10px 24px; font-size:12.5px; }
        }
        @media (max-width:400px){
          .fb-image-box{ max-width:150px; }
          .fb-name{ font-size:15.5px; }
        }
      `}</style>

      <section className="view active fb-root">
        <div className="fb-grid">
          {orderedBots.map((b) => {
            const meta = BOTS_META[b.sym] || {};
            const botAccent = getBotAccent(b.sym);

            return (
              <article
                key={b.id}
                className="fb-card"
                style={{
                  '--fb-accent':        botAccent,
                  '--fb-accent-soft':   withAlpha(botAccent, 0.14),
                  '--fb-accent-border': withAlpha(botAccent, 0.42),
                  '--fb-accent-glow':   withAlpha(botAccent, 0.30),
                }}
              >
                {/* Image at original aspect ratio */}
                <div className="fb-image-box">
                  <img
                    src={meta.image}
                    alt={meta.name || b.name}
                    className="fb-image"
                    loading="lazy"
                    draggable="false"
                  />
                </div>

                {/* Name */}
                <h3 className="fb-name">{meta.name || b.name}</h3>

                {/* Win rate */}
                <div className="fb-winrate">
                  <span className="label">Win rate</span>
                  <span className="value">{fmt(b.winRate || 0, 1)}%</span>
                </div>

                {/* Configure */}
                <button
                  className="fb-configure"
                  type="button"
                  onClick={() =>
                    onConfigureBot
                      ? onConfigureBot(b.id)
                      : (onToggleBot && onToggleBot(b.id))
                  }
                  aria-label={`Configure ${meta.name || b.name}`}
                >
                  <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2"
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