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

  const accent    = c.accent      || '#f5b400';
  const text      = c.text        || '#e8eefb';
  const textMuted = c.textMuted   || '#8b8b93';
  const textSec   = c.textSecondary || c.textMuted || '#b0b0b8';
  const card      = c.surface     || '#111114';
  const cardElev  = c.surfaceElevated || card;
  const bg        = c.bg          || c.background || '#0a0a0a';
  const border    = c.border      || 'rgba(255,255,255,0.08)';

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

        /* ============================================================
           HERO STRIP
           ============================================================ */
        .fb-hero{
          position:relative;
          overflow:hidden;
          padding:28px 28px 26px;
          border-radius:16px;
          margin-bottom:24px;
          border:1px solid ${border};
          background:${card};
        }
        .fb-hero::before{
          content:'';
          position:absolute;
          top:-120px; left:-80px;
          width:340px; height:340px;
          border-radius:50%;
          background:radial-gradient(circle, ${withAlpha(accent, 0.30)}, transparent 65%);
          filter:blur(30px);
          opacity:.55;
          pointer-events:none;
        }
        .fb-hero-inner{
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
          gap:20px;
          flex-wrap:wrap;
        }
        .fb-hero-icon{
          width:52px; height:52px; border-radius:15px;
          display:flex; align-items:center; justify-content:center;
          background:${withAlpha(accent, 0.12)};
          border:1px solid ${withAlpha(accent, 0.30)};
          color:${accent};
          flex-shrink:0;
        }
        .fb-hero-text{ flex:1; min-width:220px; }
        .fb-hero-eyebrow{
          display:inline-flex; align-items:center; gap:8px;
          font-size:10.5px; font-weight:800; letter-spacing:1.6px;
          text-transform:uppercase;
          color:${accent};
          margin-bottom:10px;
        }
        .fb-hero-eyebrow::before{
          content:'';
          width:20px; height:2px;
          background:${accent};
        }
        .fb-hero-title{
          font-size:24px; font-weight:800; letter-spacing:-.6px;
          color:${text};
          margin:0 0 8px;
          line-height:1.15;
        }
        .fb-hero-title .accent{ color:${accent}; }
        .fb-hero-sub{
          font-size:13px; line-height:1.6;
          color:${textSec};
          max-width:680px;
          margin:0;
        }

        /* ============================================================
           BOT GRID
           ============================================================ */
        .fb-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:24px;
          align-items:stretch;
        }

        /* ============================================================
           BOT CARD
           ============================================================ */
        .fb-card{
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
          padding:28px 24px 26px;
          border-radius:16px;
          background:${card};
          border:1px solid ${border};
          transition:border-color .2s ease, transform .2s ease;
        }
        .fb-card:hover{
          border-color:${withAlpha(accent, 0.35)};
          transform:translateY(-2px);
        }

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

        .fb-name{
          font-size:16px;
          font-weight:700;
          letter-spacing:-.2px;
          color:${text};
          margin:0 0 16px;
          line-height:1.3;
        }

        .fb-winrate{
          display:inline-flex;
          align-items:center;
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
          background:var(--fb-accent);
          border-color:var(--fb-accent);
          color:${bg};
        }
        .fb-configure:active{
          transform:scale(.98);
        }
        .fb-configure svg{
          width:14px; height:14px;
          flex-shrink:0;
        }

        /* ============================================================
           TABLET
           ============================================================ */
        @media (max-width:1080px){
          .fb-grid{ grid-template-columns:repeat(2,1fr); gap:18px; }
        }

        /* ============================================================
           PHONE — the important one
           ============================================================ */
        @media (max-width:720px){
          .fb-root{ padding:4px 0 40px; }

          /* Hero becomes a compact banner */
          .fb-hero{
            padding:20px 18px 20px;
            border-radius:14px;
            margin-bottom:18px;
          }
          .fb-hero-inner{ gap:14px; }
          .fb-hero-icon{
            width:44px; height:44px; border-radius:12px;
          }
          .fb-hero-icon svg{ width:20px; height:20px; }
          .fb-hero-eyebrow{
            font-size:10px;
            letter-spacing:1.4px;
            margin-bottom:8px;
          }
          .fb-hero-eyebrow::before{ width:16px; }
          .fb-hero-title{
            font-size:18px;
            letter-spacing:-.4px;
            margin-bottom:6px;
          }
          .fb-hero-sub{
            font-size:12px;
            line-height:1.55;
          }

          /* Grid becomes a vertical stack with tighter gaps */
          .fb-grid{
            grid-template-columns:1fr;
            gap:14px;
          }

          /* Card becomes a compact horizontal-friendly block */
          .fb-card{
            padding:20px 18px 20px;
            border-radius:14px;
          }

          /* Smaller, well-proportioned image */
          .fb-img{
            max-width:140px;
            border-radius:10px;
            margin-bottom:16px;
          }

          .fb-name{
            font-size:15.5px;
            margin-bottom:12px;
          }

          .fb-winrate{
            padding:7px 15px;
            margin-bottom:16px;
            border-radius:9px;
          }
          .fb-winrate-label{ font-size:10.5px; }
          .fb-winrate-value{ font-size:14px; }

          .fb-configure{
            max-width:none;
            padding:11px 18px;
            font-size:13px;
            border-radius:10px;
          }
        }

        /* ============================================================
           NARROW PHONE
           ============================================================ */
        @media (max-width:400px){
          .fb-hero-title{ font-size:16.5px; }
          .fb-hero-sub{ font-size:11.5px; }
          .fb-img{ max-width:120px; margin-bottom:14px; }
          .fb-name{ font-size:15px; }
          .fb-winrate{ margin-bottom:14px; }
        }
      `}</style>

      <section className="view active fb-root">

        {/* ============================================================
            HERO
           ============================================================ */}
        <div className="fb-hero">
          <div className="fb-hero-inner">
            <div className="fb-hero-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3.5" y="7.5" width="17" height="12" rx="3.5" />
                <path d="M12 7.5V4" />
                <circle cx="12" cy="3.4" r="1" />
                <path d="M9 13h.01M15 13h.01" />
                <path d="M9.5 16.5h5" />
              </svg>
            </div>
            <div className="fb-hero-text">
              <div className="fb-hero-eyebrow">Automated Trading</div>
              <h1 className="fb-hero-title">
                Three <span className="accent">master bots</span>, one per instrument.
              </h1>
              <p className="fb-hero-sub">
                Each bot is tuned to the personality of a single market — EUR/USD’s liquidity,
                BTC/USD’s volatility, XAU/USD’s safe-haven rhythms. Open one up to configure
                its rules, risk and session window.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            BOTS
           ============================================================ */}
        <div className="fb-grid">
          {orderedBots.map((b) => {
            const meta = BOTS_META[b.sym] || {};
            const botAccent = getBotAccent(b.sym);

            return (
              <article
                key={b.id}
                className="fb-card"
                style={{ '--fb-accent': botAccent }}
              >
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