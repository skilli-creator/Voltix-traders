// src/components/forexbots.jsx
import { useTheme } from 'styled-components';
import { fmt } from '../pages/forexdash';

import euroBotImg from '../assets/images/image14.png';
import btcBotImg  from '../assets/images/image15.png';
import goldBotImg from '../assets/images/image16.png';

/* ================================================================ */
/*  BOTS — three only, one per instrument                           */
/* ================================================================ */
const BOTS_META = {
  EURUSD: {
    name: 'Euro Master',
    pair: 'EUR/USD',
    tagline: 'Precision scalping on the world’s most liquid pair',
    image: euroBotImg,
    accentKey: 'info',
  },
  BTCUSD: {
    name: 'Bitcoin Master',
    pair: 'BTC/USD',
    tagline: 'Momentum and breakout hunting on 24/7 crypto',
    image: btcBotImg,
    accentKey: 'warning',
  },
  XAUUSD: {
    name: 'Gold Master',
    pair: 'XAU/USD',
    tagline: 'Safe-haven reversal plays around US session flows',
    image: goldBotImg,
    accentKey: 'accent',
  },
};

const ORDER = ['EURUSD', 'BTCUSD', 'XAUUSD'];

/* ================================================================ */
/*  ALPHA HELPER                                                    */
/* ================================================================ */
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

  /* ---------- THEME TOKENS ---------- */
  const accent    = c.accent       || '#f5b400';
  const accent2   = c.accentHover  || accent;
  const text      = c.text         || '#e8eefb';
  const textMuted = c.textMuted    || '#8b8b93';
  const textSec   = c.textSecondary|| c.textMuted || '#b0b0b8';
  const card      = c.surface      || '#111114';
  const cardElev  = c.surfaceElevated || card;
  const cardHover = c.surfaceHover || cardElev;
  const bg        = c.bg           || c.background || '#0a0a0a';
  const border    = c.border       || 'rgba(255,255,255,0.08)';
  const shadow    = c.shadow       || '0 24px 48px -20px rgba(0,0,0,0.7)';

  const getBotAccent = (sym) => {
    const themed = c.bots?.[sym];
    if (themed) return themed;
    const key = BOTS_META[sym]?.accentKey || 'accent';
    return c[key] || accent;
  };

  const orderedBots = ORDER
    .map((sym) => bots.find((b) => b.sym === sym))
    .filter(Boolean);

  /* ---------- RENDER ---------- */
  return (
    <>
      <style>{`
        /* ============================================================
           SCROLL
           ============================================================ */
        .view.active.fb-root{
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: 100% !important;
          max-height: 100vh;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        .fb-root{
          display: block;
          padding: 8px 0 56px;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          color: ${text};
        }
        .fb-root *{ box-sizing: border-box; }

        /* ============================================================
           HERO
           ============================================================ */
        .fb-hero{
          position: relative;
          overflow: hidden;
          padding: 32px 32px 30px;
          border-radius: 20px;
          margin-bottom: 26px;
          border: 1px solid ${border};
          background: ${card};
        }
        .fb-hero::before{
          content: '';
          position: absolute;
          top: -140px; left: -100px;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, ${withAlpha(accent, 0.28)}, transparent 65%);
          filter: blur(40px);
          opacity: .7;
          pointer-events: none;
        }
        .fb-hero::after{
          content: '';
          position: absolute;
          bottom: -180px; right: -120px;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, ${withAlpha(text, 0.05)}, transparent 65%);
          filter: blur(40px);
          opacity: .5;
          pointer-events: none;
        }
        .fb-hero-inner{
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 22px;
          flex-wrap: wrap;
        }
        .fb-hero-icon{
          width: 58px; height: 58px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, ${withAlpha(accent, 0.18)}, ${withAlpha(accent, 0.05)});
          border: 1px solid ${withAlpha(accent, 0.35)};
          color: ${accent};
          flex-shrink: 0;
          box-shadow: 0 0 32px -8px ${withAlpha(accent, 0.45)};
        }
        .fb-hero-text{ flex: 1; min-width: 240px; }
        .fb-hero-eyebrow{
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 10.5px; font-weight: 800; letter-spacing: 1.7px;
          text-transform: uppercase;
          color: ${accent};
          margin-bottom: 12px;
        }
        .fb-hero-eyebrow::before{
          content: '';
          width: 22px; height: 2px;
          background: ${accent};
          border-radius: 2px;
        }
        .fb-hero-title{
          font-size: 26px; font-weight: 800; letter-spacing: -0.7px;
          color: ${text};
          margin: 0 0 10px;
          line-height: 1.18;
        }
        .fb-hero-title .accent{
          background: linear-gradient(135deg, ${accent}, ${accent2});
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: ${accent};
        }
        .fb-hero-sub{
          font-size: 13.5px; line-height: 1.65;
          color: ${textSec};
          max-width: 720px;
          margin: 0;
        }
        .fb-hero-pill{
          display: inline-flex; align-items: center; gap: 9px;
          padding: 10px 16px; border-radius: 12px;
          background: ${cardElev};
          border: 1px solid ${border};
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          color: ${text};
          flex-shrink: 0;
        }
        .fb-hero-pill .dot{
          width: 8px; height: 8px; border-radius: 50%;
          background: ${accent};
          box-shadow: 0 0 10px ${accent};
          animation: fbPulse 2s ease-in-out infinite;
        }
        @keyframes fbPulse{
          0%,100%{ opacity: .6; transform: scale(1); }
          50%    { opacity: 1;  transform: scale(1.15); }
        }

        /* ============================================================
           BOT GRID
           ============================================================ */
        .fb-grid{
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
        }

        /* ============================================================
           BOT CARD
           ============================================================ */
        .fb-card{
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 30px 26px 28px;
          border-radius: 20px;
          background: ${card};
          border: 1px solid ${border};
          overflow: hidden;
          isolation: isolate;
          transition:
            transform .32s cubic-bezier(.16, 1, .3, 1),
            border-color .3s ease,
            box-shadow .32s ease;
        }

        /* Soft accent aura behind the image */
        .fb-card::before{
          content: '';
          position: absolute;
          top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--fb-accent-20), transparent 65%);
          filter: blur(30px);
          opacity: 0;
          transition: opacity .4s ease;
          pointer-events: none;
          z-index: 0;
        }

        /* Top accent hairline */
        .fb-card::after{
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 42%; height: 2px;
          background: linear-gradient(90deg, transparent, var(--fb-accent), transparent);
          border-radius: 2px;
          opacity: .7;
          transition: width .35s cubic-bezier(.16, 1, .3, 1), opacity .35s ease;
          z-index: 1;
        }

        .fb-card:hover{
          transform: translateY(-4px);
          border-color: var(--fb-accent-border);
          box-shadow:
            ${shadow},
            0 0 40px -14px var(--fb-accent);
        }
        .fb-card:hover::before{ opacity: 1; }
        .fb-card:hover::after{
          width: 78%;
          opacity: 1;
        }

        /* ---------- Image ---------- */
        .fb-img-wrap{
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-bottom: 22px;
        }
        .fb-img{
          display: block;
          width: 100%;
          max-width: 190px;
          height: auto;
          object-fit: contain;
          border-radius: 16px;
          user-select: none;
          filter: drop-shadow(0 18px 32px ${withAlpha('#000000', 0.55)});
          transition: transform .5s cubic-bezier(.16, 1, .3, 1);
        }
        .fb-card:hover .fb-img{
          transform: translateY(-3px) scale(1.02);
        }

        /* ---------- Name + pair ---------- */
        .fb-name{
          position: relative;
          z-index: 2;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.3px;
          color: ${text};
          margin: 0 0 6px;
          line-height: 1.3;
        }
        .fb-pair{
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'JetBrains Mono', 'SF Mono', 'Courier New', monospace;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--fb-accent);
          padding: 3px 10px;
          border-radius: 6px;
          background: var(--fb-accent-soft);
          border: 1px solid var(--fb-accent-border);
          margin-bottom: 20px;
        }

        /* ---------- Win rate ---------- */
        .fb-winrate{
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 12px;
          background: ${cardElev};
          border: 1px solid ${border};
          margin-bottom: 22px;
          transition: border-color .25s ease, background .25s ease;
        }
        .fb-card:hover .fb-winrate{
          border-color: var(--fb-accent-border);
          background: ${cardHover};
        }
        .fb-winrate-label{
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: ${textMuted};
        }
        .fb-winrate-value{
          font-family: 'JetBrains Mono', 'SF Mono', 'Courier New', monospace;
          font-size: 17px;
          font-weight: 800;
          color: var(--fb-accent);
          font-variant-numeric: tabular-nums;
          text-shadow: 0 0 12px var(--fb-accent-40);
        }

        /* ---------- Configure button ---------- */
        .fb-configure{
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          max-width: 220px;
          padding: 12px 22px;
          border-radius: 11px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.2px;
          cursor: pointer;
          margin-top: auto;
          background: var(--fb-accent-soft);
          border: 1px solid var(--fb-accent-border);
          color: var(--fb-accent);
          transition:
            background .22s ease,
            color .22s ease,
            border-color .22s ease,
            transform .22s cubic-bezier(.16, 1, .3, 1),
            box-shadow .22s ease;
        }
        .fb-configure:hover{
          background: var(--fb-accent);
          border-color: var(--fb-accent);
          color: ${bg};
          transform: translateY(-1px);
          box-shadow: 0 10px 26px -10px var(--fb-accent);
        }
        .fb-configure:active{
          transform: translateY(0) scale(.98);
        }
        .fb-configure svg{
          width: 14px; height: 14px;
          flex-shrink: 0;
          transition: transform .4s cubic-bezier(.16, 1, .3, 1);
        }
        .fb-configure:hover svg{
          transform: rotate(60deg);
        }

        /* ============================================================
           TABLET
           ============================================================ */
        @media (max-width: 1080px) {
          .fb-grid{
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
        }

        /* ============================================================
           PHONE
           ============================================================ */
        @media (max-width: 720px) {
          .fb-root{ padding: 4px 0 44px; }

          .fb-hero{
            padding: 22px 20px 22px;
            border-radius: 16px;
            margin-bottom: 20px;
          }
          .fb-hero-inner{ gap: 16px; }
          .fb-hero-icon{
            width: 46px; height: 46px; border-radius: 13px;
          }
          .fb-hero-icon svg{ width: 22px; height: 22px; }
          .fb-hero-eyebrow{
            font-size: 10px;
            letter-spacing: 1.4px;
            margin-bottom: 8px;
          }
          .fb-hero-eyebrow::before{ width: 16px; }
          .fb-hero-title{
            font-size: 19px;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
          }
          .fb-hero-sub{
            font-size: 12.5px;
            line-height: 1.6;
          }
          .fb-hero-pill{
            width: 100%;
            justify-content: center;
            padding: 10px 14px;
            font-size: 10.5px;
          }

          .fb-grid{
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .fb-card{
            padding: 24px 20px 22px;
            border-radius: 16px;
          }
          .fb-card::before{
            width: 220px; height: 220px;
            top: -60px;
          }

          .fb-img{
            max-width: 150px;
            border-radius: 14px;
          }
          .fb-img-wrap{ margin-bottom: 18px; }

          .fb-name{ font-size: 16px; margin-bottom: 6px; }
          .fb-pair{ font-size: 10px; padding: 3px 9px; margin-bottom: 16px; }

          .fb-winrate{
            padding: 9px 18px;
            margin-bottom: 18px;
            border-radius: 10px;
          }
          .fb-winrate-label{ font-size: 9.5px; }
          .fb-winrate-value{ font-size: 15.5px; }

          .fb-configure{
            max-width: none;
            padding: 12px 20px;
            font-size: 13px;
            border-radius: 11px;
          }
        }

        /* ============================================================
           NARROW PHONE
           ============================================================ */
        @media (max-width: 400px) {
          .fb-hero{ padding: 20px 16px 20px; }
          .fb-hero-title{ font-size: 17px; }
          .fb-hero-sub{ font-size: 11.5px; }
          .fb-img{ max-width: 130px; }
          .fb-name{ font-size: 15px; }
          .fb-winrate{ padding: 8px 16px; margin-bottom: 16px; }
          .fb-winrate-value{ font-size: 14.5px; }
        }
      `}</style>

      <section className="view active fb-root">

        {/* ============================================================
            HERO
           ============================================================ */}
        <div className="fb-hero">
          <div className="fb-hero-inner">
            <div className="fb-hero-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
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
            <div className="fb-hero-pill">
              <span className="dot" />
              {orderedBots.length} available
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
                style={{
                  '--fb-accent':        botAccent,
                  '--fb-accent-soft':   withAlpha(botAccent, 0.12),
                  '--fb-accent-border': withAlpha(botAccent, 0.42),
                  '--fb-accent-20':     withAlpha(botAccent, 0.20),
                  '--fb-accent-40':     withAlpha(botAccent, 0.40),
                }}
              >
                <div className="fb-img-wrap">
                  <img
                    src={meta.image}
                    alt={meta.name || b.name}
                    className="fb-img"
                    loading="lazy"
                    draggable="false"
                  />
                </div>

                <h3 className="fb-name">{meta.name || b.name}</h3>
                <span className="fb-pair">{meta.pair || b.sym}</span>

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