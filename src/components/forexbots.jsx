// src/components/forexbots.jsx
import { useTheme } from 'styled-components';
import { fmt, fmtMoney, Sparkline } from '../pages/forexdash';

// AI bot avatars — one per instrument
import euroBotImg from '../assets/images/image14.png';
import btcBotImg  from '../assets/images/image15.png';
import goldBotImg from '../assets/images/image16.png';

/* ================================================================ */
/*  PRESENTATION                                                   */
/*  Identity only (name/tagline/image/initials) — colors come      */
/*  from the theme so everything obeys theme changes.              */
/* ================================================================ */
const BOT_PRESENTATION = {
  EURUSD: {
    name: 'Euro Master',
    tagline: 'Precision scalping on the world’s most liquid pair',
    image: euroBotImg,
    initials: 'EM',
    badge: 'FX',
    accentKey: 'info',
  },
  BTCUSD: {
    name: 'Bitcoin Master',
    tagline: 'Momentum and breakout hunting on 24/7 crypto',
    image: btcBotImg,
    initials: 'BM',
    badge: 'CRYPTO',
    accentKey: 'warning',
  },
  XAUUSD: {
    name: 'Gold Master',
    tagline: 'Safe-haven reversal plays around US session flows',
    image: goldBotImg,
    initials: 'GM',
    badge: 'METAL',
    accentKey: 'accent',
  },
};

const FALLBACK_ORDER = ['EURUSD', 'BTCUSD', 'XAUUSD'];

/* ---------------------------------------------------------------- */
/*  Alpha helper — turns #rrggbb / #rgb / rgb() / hsl() into an    */
/*  alpha-suffixed value. Falls back safely if unparsable.         */
/* ---------------------------------------------------------------- */
const withAlpha = (color, a) => {
  if (typeof color !== 'string') return color;
  if (color.startsWith('rgb') || color.startsWith('hsl')) return color;
  if (/^#[0-9a-f]{8}$/i.test(color)) return color;
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    const alpha = Math.round(Math.min(1, Math.max(0, a)) * 255)
      .toString(16).padStart(2, '0');
    return color + alpha;
  }
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    const e = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    return withAlpha(e, a);
  }
  return color;
};

/* ================================================================ */
/*  COMPONENT                                                      */
/* ================================================================ */
export default function ForexBots({ bots = [], onToggleBot, onConfigureBot }) {
  const theme = useTheme();
  const c = theme?.colors || {};

  /* --------------------------------------------------------------
     THEME TOKENS
     -------------------------------------------------------------- */
  const accent        = c.accent       || '#f5b400';
  const accentSoft    = c.accentLight  || withAlpha(accent, 0.12);
  const accentBorder  = withAlpha(accent, 0.28);
  const accentGlow    = withAlpha(accent, 0.35);

  const success       = c.success      || '#00d68f';
  const successSoft   = withAlpha(success, 0.14);
  const successBorder = withAlpha(success, 0.42);
  const successGlow   = withAlpha(success, 0.45);

  const danger        = c.danger       || '#ff4d6a';
  const warning       = c.warning      || '#f5a524';

  const text          = c.text         || '#e8eefb';
  const textSecondary = c.textSecondary|| c.textMuted || '#b0b0b8';
  const textMuted     = c.textMuted    || '#8b8b93';

  const card          = c.surface      || '#111114';
  const cardElev      = c.surfaceElevated || card;
  const cardHover     = c.surfaceHover || cardElev;
  const bg            = c.bg           || c.background || '#0a0a0a';
  const border        = c.border       || 'rgba(255,255,255,0.08)';
  const shadowStrong  = c.shadowStrong || '0 28px 60px -20px rgba(0,0,0,0.8)';

  /* Per-bot accent — falls back to a themed family tone. */
  const getBotAccent = (sym) => {
    const themed = c.bots?.[sym];
    if (themed) return themed;
    const key = BOT_PRESENTATION[sym]?.accentKey || 'accent';
    return c[key] || accent;
  };

  /* --------------------------------------------------------------
     DATA
     -------------------------------------------------------------- */
  const orderedBots = FALLBACK_ORDER
    .map((sym) => bots.find((b) => b.sym === sym))
    .filter(Boolean);

  const active = orderedBots.filter((b) => b.on).length;

  /* --------------------------------------------------------------
     RENDER
     -------------------------------------------------------------- */
  return (
    <>
      <style>{`
        /* ============================================================
           SCROLL
           ============================================================ */
        .view.active.fb-root{
          overflow-y:auto !important;
          overflow-x:hidden !important;
          height:100% !important;
          max-height:100vh;
          -webkit-overflow-scrolling:touch;
          scroll-behavior:smooth;
        }

        /* ---------- Root ---------- */
        .fb-root{
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
          color:${text};
          background:transparent;
          transition:color .25s ease;
          display:block;
          padding:0;
        }
        .fb-root *{ box-sizing:border-box; }

        /* ---------- Hero strip ---------- */
        .fb-hero{
          position:relative;
          overflow:hidden;
          padding:28px 28px 26px;
          border-radius:20px;
          margin-bottom:22px;
          border:1px solid ${border};
          background:${card};
          transition:background .25s ease, border-color .25s ease;
        }
        .fb-hero::before{
          content:'';
          position:absolute;
          top:-120px; left:-80px;
          width:340px; height:340px;
          border-radius:50%;
          background:radial-gradient(circle, ${accentGlow}, transparent 65%);
          filter:blur(30px);
          opacity:.55;
          pointer-events:none;
        }
        .fb-hero::after{
          content:'';
          position:absolute;
          bottom:-140px; right:-100px;
          width:340px; height:340px;
          border-radius:50%;
          background:radial-gradient(circle, ${successGlow}, transparent 65%);
          filter:blur(30px);
          opacity:.35;
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
          background:${accentSoft};
          border:1px solid ${accentBorder};
          color:${accent};
          flex-shrink:0;
          box-shadow:0 0 24px -6px ${accentGlow};
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
          font-size:26px; font-weight:800; letter-spacing:-.8px;
          color:${text};
          margin:0 0 8px;
          line-height:1.15;
        }
        .fb-hero-title .accent{ color:${accent}; }
        .fb-hero-sub{
          font-size:13px; line-height:1.6;
          color:${textSecondary};
          max-width:680px;
          margin:0;
        }
        .fb-hero-live{
          display:inline-flex; align-items:center; gap:9px;
          padding:9px 15px; border-radius:12px;
          background:${cardHover};
          border:1px solid ${border};
          font-size:11px; font-weight:800;
          letter-spacing:.9px;
          text-transform:uppercase;
          color:${text};
          flex-shrink:0;
        }
        .fb-hero-live .dot{
          width:8px; height:8px; border-radius:50%;
          background:${success};
          box-shadow:0 0 10px ${success};
          animation:fbPulse 2s ease-in-out infinite;
        }
        @keyframes fbPulse{
          0%,100%{ opacity:.6; transform:scale(1); }
          50%    { opacity:1;  transform:scale(1.18); }
        }

        /* ---------- Bots grid ---------- */
        .fb-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:20px;
          margin-bottom:22px;
        }

        /* ---------- Bot card ---------- */
        .fb-card{
          position:relative;
          display:flex;
          flex-direction:column;
          border-radius:20px;
          overflow:hidden;
          background:${card};
          border:1px solid ${border};
          transition:
            transform .35s cubic-bezier(.16,1,.3,1),
            border-color .3s ease,
            box-shadow .35s ease,
            background .25s ease;
        }
        .fb-card:hover{
          transform:translateY(-6px);
          border-color:var(--fb-accent-border);
          box-shadow:
            ${shadowStrong},
            0 0 0 1px var(--fb-accent-border),
            0 0 40px -12px var(--fb-accent);
        }
        .fb-card.running{
          border-color:var(--fb-accent-border);
          box-shadow:
            0 0 0 1px var(--fb-accent-border),
            0 0 26px -14px var(--fb-accent);
        }

        /* ---------- Image area ---------- */
        .fb-img-wrap{
          position:relative;
          aspect-ratio:16/12;
          overflow:hidden;
          background:${cardElev};
          flex-shrink:0;
        }
        .fb-img{
          position:absolute;
          inset:0;
          width:100%; height:100%;
          object-fit:cover;
          object-position:center;
          transform:scale(1.02);
          transition:transform 1s cubic-bezier(.16,1,.3,1), filter .4s ease;
          filter:saturate(1.04) contrast(1.03);
          user-select:none;
        }
        .fb-card:hover .fb-img{
          transform:scale(1.08);
        }
        /* Dark scrim from bottom */
        .fb-img-wrap::after{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(
            180deg,
            rgba(0,0,0,.15) 0%,
            transparent 28%,
            transparent 42%,
            rgba(0,0,0,.55) 72%,
            rgba(0,0,0,.88) 100%
          );
          pointer-events:none;
          z-index:1;
        }
        /* Accent glow at bottom of image */
        .fb-img-wrap::before{
          content:'';
          position:absolute;
          bottom:-40%; left:50%;
          transform:translateX(-50%);
          width:110%; height:70%;
          background:radial-gradient(ellipse at center, var(--fb-accent-glow), transparent 65%);
          mix-blend-mode:screen;
          pointer-events:none;
          z-index:2;
          opacity:.75;
        }
        /* Live shine sweep */
        .fb-shine{
          position:absolute;
          inset:0;
          background:linear-gradient(
            115deg,
            transparent 42%,
            ${withAlpha('#ffffff', 0.14)} 50%,
            transparent 58%
          );
          background-size:220% 100%;
          animation:fbShine 6s linear infinite;
          pointer-events:none;
          mix-blend-mode:overlay;
          z-index:3;
        }
        @keyframes fbShine{
          0%  { background-position:-220% 0; }
          100%{ background-position: 220% 0; }
        }

        /* ---------- Top chips (over image) ---------- */
        .fb-top-bar{
          position:absolute;
          top:14px; left:14px; right:14px;
          z-index:4;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:8px;
          pointer-events:none;
        }
        .fb-chip{
          display:inline-flex; align-items:center; gap:6px;
          padding:6px 11px;
          border-radius:9px;
          font-size:10px; font-weight:800;
          letter-spacing:.9px;
          text-transform:uppercase;
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          white-space:nowrap;
        }
        .fb-chip.status{
          color:${text};
          background:${withAlpha('#000000', 0.55)};
          border:1px solid ${withAlpha('#ffffff', 0.14)};
        }
        .fb-chip.status.on{
          color:${success};
          background:${successSoft};
          border-color:${successBorder};
          box-shadow:0 0 16px -4px ${successGlow};
        }
        .fb-chip.status .dot{
          width:6px; height:6px; border-radius:50%;
          background:currentColor;
          box-shadow:0 0 6px currentColor;
        }
        .fb-chip.status.on .dot{
          animation:fbPulse 1.6s ease-out infinite;
        }
        .fb-chip.symbol{
          color:${withAlpha('#ffffff', 0.95)};
          background:${withAlpha('#000000', 0.6)};
          border:1px solid ${withAlpha('#ffffff', 0.14)};
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          letter-spacing:1px;
        }
        .fb-chip.symbol .flag{
          font-size:12px;
          line-height:1;
        }

        /* ---------- Title block (over image) ---------- */
        .fb-title-block{
          position:absolute;
          left:0; right:0; bottom:0;
          z-index:4;
          padding:22px 22px 20px;
        }
        .fb-title-row{
          display:flex;
          align-items:center;
          gap:14px;
          margin-bottom:8px;
        }
        .fb-avatar{
          width:48px; height:48px; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          font-size:14px; font-weight:900;
          letter-spacing:-.4px;
          color:${withAlpha('#000000', 0.92)};
          background:linear-gradient(135deg, var(--fb-accent), var(--fb-accent-2));
          border:1px solid ${withAlpha('#ffffff', 0.18)};
          box-shadow:
            0 10px 24px -8px var(--fb-accent),
            inset 0 1px 0 ${withAlpha('#ffffff', 0.4)};
          flex-shrink:0;
        }
        .fb-name-col{ min-width:0; flex:1; }
        .fb-name{
          font-size:19px;
          font-weight:800;
          letter-spacing:-.5px;
          color:${withAlpha('#ffffff', 0.98)};
          line-height:1.15;
          text-shadow:0 2px 14px ${withAlpha('#000000', 0.75)};
          margin:0 0 2px;
        }
        .fb-badge{
          display:inline-block;
          font-size:9px;
          font-weight:900;
          letter-spacing:1.1px;
          text-transform:uppercase;
          padding:2px 7px;
          border-radius:5px;
          color:var(--fb-accent);
          background:${withAlpha('#000000', 0.5)};
          border:1px solid var(--fb-accent-border);
        }
        .fb-tagline{
          font-size:11.5px;
          font-weight:500;
          color:${withAlpha('#ffffff', 0.78)};
          line-height:1.5;
          text-shadow:0 1px 10px ${withAlpha('#000000', 0.8)};
          margin:0;
        }

        /* ---------- Card body ---------- */
        .fb-body{
          padding:18px 20px 20px;
          display:flex;
          flex-direction:column;
          gap:14px;
          flex:1;
        }

        /* ---------- Stat strip ---------- */
        .fb-stats{
          display:grid;
          grid-template-columns:1fr 1fr 1fr;
          gap:8px;
        }
        .fb-stat{
          padding:11px 12px;
          border-radius:11px;
          background:${cardElev};
          border:1px solid ${border};
          position:relative;
          overflow:hidden;
          transition:border-color .2s ease, background .2s ease;
        }
        .fb-stat:hover{
          border-color:var(--fb-accent-border);
          background:${cardHover};
        }
        .fb-stat .k{
          display:block;
          font-size:9px;
          font-weight:800;
          letter-spacing:1px;
          text-transform:uppercase;
          color:${textMuted};
          margin-bottom:5px;
        }
        .fb-stat .v{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:14px;
          font-weight:800;
          letter-spacing:-.3px;
          color:${text};
          font-variant-numeric:tabular-nums;
        }
        .fb-stat .v.pos{ color:${success}; }
        .fb-stat .v.neg{ color:${danger}; }

        /* ---------- Sparkline frame ---------- */
        .fb-spark-wrap{
          position:relative;
          height:56px;
          border-radius:11px;
          padding:6px 4px 4px;
          background:${cardElev};
          border:1px solid ${border};
          overflow:hidden;
        }
        .fb-spark-wrap::before{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(180deg, var(--fb-accent-soft) 0%, transparent 70%);
          pointer-events:none;
        }
        .fb-spark-label{
          position:absolute;
          top:7px; right:10px;
          z-index:2;
          font-size:9px;
          font-weight:800;
          letter-spacing:1px;
          text-transform:uppercase;
          color:var(--fb-accent);
          opacity:.9;
          pointer-events:none;
        }

        /* ---------- Footer / Configure button ---------- */
        .fb-foot{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding-top:14px;
          border-top:1px solid ${border};
          margin-top:auto;
        }
        .fb-dd{
          font-size:10.5px;
          font-weight:700;
          color:${textMuted};
          letter-spacing:.5px;
          text-transform:uppercase;
        }
        .fb-dd strong{
          color:${text};
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-weight:800;
          letter-spacing:-.2px;
          margin-left:5px;
          text-transform:none;
        }
        .fb-configure{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:10px 18px;
          border-radius:10px;
          font-family:inherit;
          font-size:12.5px;
          font-weight:800;
          letter-spacing:.2px;
          cursor:pointer;
          white-space:nowrap;
          background:var(--fb-accent-soft);
          border:1px solid var(--fb-accent-border);
          color:var(--fb-accent);
          transition:
            background .22s ease,
            color .22s ease,
            border-color .22s ease,
            transform .22s cubic-bezier(.16,1,.3,1),
            box-shadow .22s ease;
          flex-shrink:0;
        }
        .fb-configure:hover{
          background:var(--fb-accent);
          color:${withAlpha('#000000', 0.9)};
          border-color:var(--fb-accent);
          transform:translateY(-1px);
          box-shadow:0 8px 22px -8px var(--fb-accent);
        }
        .fb-configure:active{
          transform:translateY(0) scale(.98);
        }
        .fb-configure svg{
          width:14px; height:14px;
          flex-shrink:0;
        }

        /* ---------- Notice ---------- */
        .fb-notice{
          display:flex;
          align-items:flex-start;
          gap:12px;
          padding:16px 20px;
          border-radius:13px;
          background:${card};
          border:1px solid ${border};
          transition:background .25s ease, border-color .25s ease;
        }
        .fb-notice svg{
          width:18px; height:18px; flex-shrink:0;
          margin-top:1px;
          stroke:${warning};
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .fb-notice span{
          font-size:12px;
          line-height:1.65;
          color:${textSecondary};
        }

        /* ============================================================
           RESPONSIVE
           ============================================================ */
        @media (max-width:1180px){
          .fb-grid{ grid-template-columns:1fr; gap:18px; }
          .fb-img-wrap{ aspect-ratio:16/8; }
          .fb-hero-title{ font-size:23px; }
        }
        @media (max-width:760px){
          .fb-hero{ padding:22px 20px; border-radius:16px; }
          .fb-hero-icon{ width:46px; height:46px; border-radius:13px; }
          .fb-hero-title{ font-size:20px; letter-spacing:-.5px; }
          .fb-hero-sub{ font-size:12.5px; }
          .fb-hero-live{
            width:100%;
            justify-content:center;
            margin-top:4px;
          }
          .fb-img-wrap{ aspect-ratio:16/10; }
          .fb-title-block{ padding:18px 16px 16px; }
          .fb-name{ font-size:17px; }
          .fb-tagline{ font-size:11px; }
          .fb-avatar{ width:42px; height:42px; font-size:13px; border-radius:12px; }
          .fb-body{ padding:16px 16px 18px; }
          .fb-stats{ gap:7px; }
          .fb-stat{ padding:10px 10px; border-radius:10px; }
          .fb-stat .k{ font-size:8.5px; }
          .fb-stat .v{ font-size:13px; }
          .fb-top-bar{ top:12px; left:12px; right:12px; }
          .fb-chip{ padding:5px 9px; font-size:9.5px; }
          .fb-configure{ padding:9px 15px; font-size:12px; }
        }
        @media (max-width:480px){
          .fb-img-wrap{ aspect-ratio:16/11; }
          .fb-configure span{ display:none; }
          .fb-configure{ padding:10px; gap:0; }
          .fb-configure svg{ width:16px; height:16px; }
        }
      `}</style>

      <section className="view active fb-root">

        {/* ============================================================
            HERO STRIP
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
            <div className="fb-hero-live">
              <span className="dot" />
              {active} of {orderedBots.length} running
            </div>
          </div>
        </div>

        {/* ============================================================
            BOT CARDS
           ============================================================ */}
        <div className="fb-grid">
          {orderedBots.map((b) => {
            const pres = BOT_PRESENTATION[b.sym] || {};
            const up = (b.pnl || 0) >= 0;
            const botAccent = getBotAccent(b.sym);

            const base  = b.sym.slice(0, 3);
            const quote = b.sym.slice(3, 6);
            const baseFlag  = { EUR: '🇪🇺', BTC: '₿', XAU: '🥇' }[base] || '';

            return (
              <article
                key={b.id}
                className={`fb-card ${b.on ? 'running' : ''}`}
                style={{
                  '--fb-accent':        botAccent,
                  '--fb-accent-2':      botAccent,
                  '--fb-accent-soft':   withAlpha(botAccent, 0.14),
                  '--fb-accent-border': withAlpha(botAccent, 0.42),
                  '--fb-accent-glow':   withAlpha(botAccent, 0.30),
                }}
              >
                {/* ---------- Image area ---------- */}
                <div className="fb-img-wrap">
                  <img
                    src={pres.image}
                    alt={`${pres.name || b.name} bot`}
                    className="fb-img"
                    loading="lazy"
                    draggable="false"
                  />
                  <div className="fb-shine" />

                  <div className="fb-top-bar">
                    <span className={`fb-chip status ${b.on ? 'on' : ''}`}>
                      <span className="dot" />
                      {b.on ? 'Running' : 'Stopped'}
                    </span>
                    <span className="fb-chip symbol">
                      {baseFlag && <span className="flag">{baseFlag}</span>}
                      {base}/{quote}
                    </span>
                  </div>

                  <div className="fb-title-block">
                    <div className="fb-title-row">
                      <div className="fb-avatar">{pres.initials || 'AI'}</div>
                      <div className="fb-name-col">
                        <h3 className="fb-name">{pres.name || b.name}</h3>
                        <span className="fb-badge">{pres.badge || 'BOT'}</span>
                      </div>
                    </div>
                    <p className="fb-tagline">{pres.tagline || b.tag}</p>
                  </div>
                </div>

                {/* ---------- Body ---------- */}
                <div className="fb-body">
                  <div className="fb-stats">
                    <div className="fb-stat">
                      <span className="k">P/L</span>
                      <span className={`v ${up ? 'pos' : 'neg'}`}>
                        {up ? '+' : ''}{fmtMoney(b.pnl || 0)}
                      </span>
                    </div>
                    <div className="fb-stat">
                      <span className="k">Win</span>
                      <span className="v">{fmt(b.winRate || 0, 1)}%</span>
                    </div>
                    <div className="fb-stat">
                      <span className="k">Trades</span>
                      <span className="v">{(b.trades || 0).toLocaleString('en-US')}</span>
                    </div>
                  </div>

                  <div className="fb-spark-wrap">
                    <span className="fb-spark-label">Equity</span>
                    <Sparkline
                      values={b.history || []}
                      w={300}
                      h={44}
                      color={up ? success : danger}
                    />
                  </div>

                  <div className="fb-foot">
                    <span className="fb-dd">
                      Max DD <strong>{b.dd || '—'}</strong>
                    </span>
                    <button
                      className="fb-configure"
                      type="button"
                      onClick={() =>
                        onConfigureBot
                          ? onConfigureBot(b.id)
                          : (onToggleBot && onToggleBot(b.id))
                      }
                      aria-label={`Configure ${pres.name || b.name}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      <span>Configure</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ============================================================
            NOTICE
           ============================================================ */}
        <div className="fb-notice">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <span>
            Bots run in paper-trading mode. Past performance is not indicative of future results —
            always backtest and forward-test on a demo account before committing real capital.
          </span>
        </div>

      </section>
    </>
  );
}