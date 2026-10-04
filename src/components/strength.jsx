// src/components/Strength.jsx
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import { CURRENCIES, PAIRS, fmt, currencyStrength } from '../pages/forexdash';

/* ================================================================ */
/*  CURRENCY METADATA                                               */
/* ================================================================ */
const CURRENCY_META = {
  USD: { flag: '🇺🇸', name: 'US Dollar' },
  EUR: { flag: '🇪🇺', name: 'Euro' },
  GBP: { flag: '🇬🇧', name: 'British Pound' },
  JPY: { flag: '🇯🇵', name: 'Japanese Yen' },
  CHF: { flag: '🇨🇭', name: 'Swiss Franc' },
  AUD: { flag: '🇦🇺', name: 'Australian Dollar' },
  NZD: { flag: '🇳🇿', name: 'New Zealand Dollar' },
  CAD: { flag: '🇨🇦', name: 'Canadian Dollar' },
};

const TIMEFRAMES = [
  { key: '1H', label: '1 Hour'  },
  { key: '4H', label: '4 Hours' },
  { key: 'D',  label: 'Daily'   },
];

/* ================================================================ */
/*  HELPERS                                                         */
/* ================================================================ */
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

const toScore = (v, maxPos, maxNeg) => {
  if (!Number.isFinite(v)) return 50;
  if (v >= 0) return 50 + (maxPos > 0 ? (v / maxPos) * 50 : 0);
  return 50 - (maxNeg > 0 ? (Math.abs(v) / maxNeg) * 50 : 0);
};

const getTier = (v, maxPos) => {
  if (!Number.isFinite(v)) return 'mild';
  if (v < 0) return 'neg';
  const ratio = maxPos > 0 ? v / maxPos : 0;
  if (ratio >= 0.7)  return 'ultra';
  if (ratio >= 0.35) return 'strong';
  return 'mild';
};

/* ================================================================ */
/*  COMPONENT                                                       */
/* ================================================================ */
export default function Strength({ strength, onNavigate }) {
  const theme = useTheme();
  const rootRef = useRef(null);
  const [tf, setTf]   = useState('4H');
  const [now, setNow] = useState(() => new Date());

  /* Live clock */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* Reset scroll to the top whenever this page mounts so the
     browser's scroll restoration doesn't auto-scroll us to the
     bottom of a previously visited page. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Run after layout so the container has its final scrollHeight.
    const raf = requestAnimationFrame(() => {
      el.scrollTop = 0;
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ================================================================
     THEME TOKENS
     ================================================================ */
  const c = theme?.colors || {};

  const accent       = c.accent       || c.gold      || '#f5b400';
  const accentHover  = c.accentHover  || accent;
  const accentSoft   = c.accentLight  || withAlpha(accent, 0.10);
  const accentBorder = withAlpha(accent, 0.25);
  const accentBorderStrong = withAlpha(accent, 0.45);
  const accentGlow   = withAlpha(accent, 0.30);

  const success      = c.success      || '#00d68f';
  const successBorder= withAlpha(success, 0.25);
  const successGlow  = withAlpha(success, 0.35);

  const danger       = c.danger       || '#ff4d6a';
  const dangerBorder = withAlpha(danger, 0.25);
  const dangerGlow   = withAlpha(danger, 0.32);

  const text         = c.text         || '#f5f5f7';
  const textSecondary= c.textSecondary|| c.textMuted || '#b0b0b8';
  const textMuted    = c.textMuted    || '#8b8b93';

  const card         = c.surface      || c.card      || '#111114';
  const cardElev     = c.surfaceElevated || card;
  const cardHover    = c.surfaceHover || c.surfaceElevated || card;
  const bg           = c.bg           || c.background|| '#0a0a0a';

  const border       = c.border       || '#1e1e22';
  const borderHover  = c.borderHover  || border;
  const borderStrong = c.borderStrong || borderHover;

  const TIER_STYLES = {
    ultra:  { bar: `linear-gradient(90deg, ${success} 0%, ${success} 100%)`, text: success, glow: successGlow },
    strong: { bar: `linear-gradient(90deg, ${success} 0%, ${success} 100%)`, text: success, glow: successGlow },
    mild:   { bar: `linear-gradient(90deg, ${accent} 0%, ${accentHover} 100%)`, text: accent, glow: accentGlow },
    neg:    { bar: `linear-gradient(90deg, ${danger} 0%, ${danger} 100%)`, text: danger, glow: dangerGlow },
  };

  /* ================================================================
     DERIVED DATA
     ================================================================ */
  const st = currencyStrength(strength) || {};
  const safe = (code) => (Number.isFinite(st[code]) ? st[code] : 0);

  const sorted = CURRENCIES.slice().sort((a, b) => safe(b) - safe(a));

  const positives = CURRENCIES.map(safe).filter(v => v > 0);
  const negatives = CURRENCIES.map(safe).filter(v => v < 0).map(v => Math.abs(v));
  const maxPos = positives.length ? Math.max(...positives) : 0.0001;
  const maxNeg = negatives.length ? Math.max(...negatives) : 0.0001;

  const pairData = PAIRS.map((sym) => {
    const b = sym.slice(0, 3);
    const q = sym.slice(3, 6);
    return { sym, base: b, quote: q, diff: safe(b) - safe(q) };
  }).sort((a, b) => b.diff - a.diff);

  const strongest   = sorted[0];
  const weakest     = sorted[sorted.length - 1];
  const pairToWatch = pairData[0];

  const clock =
    `${String(now.getHours()).padStart(2, '0')}:` +
    `${String(now.getMinutes()).padStart(2, '0')}:` +
    `${String(now.getSeconds()).padStart(2, '0')}`;

  const go = (path) => { if (onNavigate) onNavigate(path); };

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <>
      <style>{`
        /* ============================================================
           SCROLL — definite height (viewport minus topbar).
           No scroll-behavior, no scroll anchoring — the browser
           will not restore the previous page's scroll position.
           ============================================================ */
        .view.active.sm-root{
          height: calc(100vh - var(--topbar-h, 76px)) !important;
          height: calc(100dvh - var(--topbar-h, 76px)) !important;
          max-height: calc(100vh - var(--topbar-h, 76px)) !important;
          max-height: calc(100dvh - var(--topbar-h, 76px)) !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          overflow-anchor: none;   /* stops the "jump to bottom" behaviour */
          scroll-padding-top: 8px;
          padding: 0;              /* padding lives on .sm-root instead */
          margin: 0;
        }

        .view.active.sm-root::-webkit-scrollbar{ width: 10px; }
        .view.active.sm-root::-webkit-scrollbar-track{ background: transparent; }
        .view.active.sm-root::-webkit-scrollbar-thumb{
          background: ${withAlpha(text, 0.10)};
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
          transition: background .25s ease;
        }
        .view.active.sm-root::-webkit-scrollbar-thumb:hover{
          background: ${withAlpha(text, 0.22)};
          background-clip: content-box;
        }

        /* ---------- Root ---------- */
        .sm-root{
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
          color:${text};
          background:transparent;
          transition:color .25s ease;
          /* Extra bottom padding so the last card is never clipped */
          padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
        }
        .sm-root *{ box-sizing:border-box; }

        /* Entrance animations */
        @keyframes smFadeUp{
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes smPulse{
          0%,100%{ opacity:.6; transform:scale(1); }
          50%    { opacity:1;  transform:scale(1.15); }
        }
        @keyframes smShine{
          0%  { background-position:-200% 0; }
          100%{ background-position: 200% 0; }
        }
        @keyframes smRowIn{
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes smAuraDrift{
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: .35; }
          50%      { transform: translate3d(4%, -4%, 0) scale(1.08); opacity: .55; }
        }

        /* ---------- Top bar ---------- */
        .sm-topbar{
          display:flex; align-items:center; justify-content:space-between;
          gap:16px; flex-wrap:wrap; margin-bottom:18px;
          animation: smFadeUp .45s cubic-bezier(.16,1,.3,1) both;
        }
        .sm-tabs{
          display:inline-flex; gap:4px; padding:4px;
          background:${card};
          border:1px solid ${border};
          border-radius:12px;
          transition:background .25s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .sm-tabs:hover{ box-shadow: 0 6px 18px ${withAlpha(text, 0.04)}; }
        .sm-tab{
          padding:8px 18px; border-radius:9px;
          font-family:inherit; font-size:12.5px; font-weight:700;
          color:${textMuted};
          background:transparent; border:none; cursor:pointer;
          transition:all .25s cubic-bezier(.16,1,.3,1);
          white-space:nowrap;
          position: relative;
        }
        .sm-tab:hover{ color:${text}; background:${withAlpha(text, 0.05)}; }
        .sm-tab.active{
          background:linear-gradient(135deg, ${accent} 0%, ${accentHover} 100%);
          color:${bg};
          box-shadow:0 4px 14px ${accentGlow};
        }
        .sm-status{
          display:inline-flex; align-items:center; gap:8px;
          font-size:11.5px; font-weight:600;
          color:${textMuted};
          letter-spacing:.2px;
        }
        .sm-status .dot{
          width:7px; height:7px; border-radius:50%;
          background:${accent};
          box-shadow:0 0 8px ${accent};
          animation:smPulse 2s ease-in-out infinite;
        }
        .sm-status .clock{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          color:${text};
          font-weight:800;
          font-variant-numeric:tabular-nums;
        }

        /* ---------- Main card ---------- */
        .sm-card{
          position: relative;
          background:${card};
          border:1px solid ${border};
          border-radius:16px;
          overflow:hidden;
          margin-bottom:16px;
          transition:background .25s ease, border-color .25s ease, box-shadow .3s ease;
          animation: smFadeUp .55s cubic-bezier(.16,1,.3,1) both;
        }
        .sm-card::before{
          content:'';
          position:absolute; top:0; left:0; right:0;
          height:2px;
          background:linear-gradient(90deg, transparent, ${accent}, transparent);
          background-size:200% 100%;
          opacity:.55;
          pointer-events:none;
        }
        .sm-card:hover{
          border-color:${borderStrong};
          box-shadow: 0 12px 36px -18px ${withAlpha(text, 0.35)};
        }
        .sm-card-head{
          display:flex; align-items:center; gap:12px;
          padding:18px 22px 14px;
          border-bottom:1px solid ${border};
        }
        .sm-card-head .icon{
          width:32px; height:32px; border-radius:9px;
          display:flex; align-items:center; justify-content:center;
          background:${accentSoft};
          border:1px solid ${accentBorder};
          color:${accent};
          flex-shrink:0;
          box-shadow: 0 0 12px -4px ${accentGlow};
        }
        .sm-card-head .title{
          font-size:14px; font-weight:800; letter-spacing:.6px;
          text-transform:uppercase;
          color:${text};
        }
        .sm-card-head .title .accent{ color:${accent}; }
        .sm-card-head .sep{ color:${textMuted}; font-weight:400; margin:0 4px; }
        .sm-card-head .spacer{ flex:1; }
        .sm-card-head .meta{
          font-size:11px;
          color:${textMuted};
          font-weight:600;
        }

        /* ---------- Ladder ---------- */
        .sm-ladder{ padding:8px 0 12px; }
        .sm-row{
          display:grid;
          grid-template-columns:32px 34px 54px 1fr 96px;
          align-items:center;
          gap:14px;
          padding:11px 22px;
          transition:background .22s ease, transform .22s cubic-bezier(.16,1,.3,1);
          position:relative;
          animation: smRowIn .5s cubic-bezier(.16,1,.3,1) both;
        }
        .sm-row:hover{
          background:${withAlpha(text, 0.03)};
          transform: translateX(2px);
        }
        .sm-row + .sm-row{ border-top:1px solid ${withAlpha(text, 0.03)}; }
        .sm-rank{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:12px; font-weight:800;
          color:${textMuted};
          text-align:right;
          font-variant-numeric:tabular-nums;
        }
        .sm-row.top .sm-rank{ color:${accent}; }
        .sm-flag{
          font-size:22px; line-height:1;
          display:flex; align-items:center; justify-content:center;
        }
        .sm-sym{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:13.5px; font-weight:800;
          letter-spacing:.4px;
          color:${text};
        }
        .sm-bar-wrap{
          position:relative;
          height:26px;
          border-radius:8px;
          background:${withAlpha(text, 0.035)};
          border:1px solid ${withAlpha(text, 0.04)};
          overflow:hidden;
        }
        .sm-bar{
          position:absolute;
          top:0; bottom:0; left:0;
          border-radius:8px;
          transition:width .9s cubic-bezier(.16,1,.3,1);
        }
        .sm-bar::after{
          content:'';
          position:absolute; inset:0;
          background:linear-gradient(
            90deg,
            transparent 0%,
            ${withAlpha('#ffffff', 0.18)} 50%,
            transparent 100%
          );
          background-size:220% 100%;
          animation:smShine 3.6s linear infinite;
          border-radius:8px;
        }
        .sm-val{
          display:flex; flex-direction:column;
          align-items:flex-end;
          line-height:1.15;
          font-variant-numeric:tabular-nums;
        }
        .sm-val .score{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:14px; font-weight:800;
          letter-spacing:-.3px;
        }
        .sm-val .pct{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:10.5px; font-weight:700;
          color:${textMuted};
          margin-top:3px;
        }

        /* ---------- Summary cards ---------- */
        .sm-summary{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:12px;
          margin-bottom:18px;
        }
        .sm-sumcard{
          position: relative;
          background:${card};
          border:1px solid ${border};
          border-radius:14px;
          padding:18px 20px 20px;
          overflow:hidden;
          transition:
            transform .28s cubic-bezier(.16,1,.3,1),
            border-color .28s ease,
            background .28s ease,
            box-shadow .28s ease;
          animation: smFadeUp .6s cubic-bezier(.16,1,.3,1) both;
        }
        .sm-sumcard:nth-child(1){ animation-delay: .05s; }
        .sm-sumcard:nth-child(2){ animation-delay: .12s; }
        .sm-sumcard:nth-child(3){ animation-delay: .19s; }

        .sm-sumcard:hover{ transform:translateY(-3px); }
        .sm-sumcard.strongest{ border-color:${successBorder}; }
        .sm-sumcard.strongest:hover{ box-shadow:0 10px 28px -10px ${successGlow}; }
        .sm-sumcard.weakest{ border-color:${dangerBorder}; }
        .sm-sumcard.weakest:hover{ box-shadow:0 10px 28px -10px ${dangerGlow}; }
        .sm-sumcard.watch{
          border-color:${accentBorderStrong};
          background:
            radial-gradient(ellipse at 100% 0%, ${withAlpha(accent, 0.09)}, transparent 60%),
            ${card};
        }
        .sm-sumcard.watch:hover{ box-shadow:0 10px 28px -10px ${accentGlow}; }

        .sm-sumcard.watch::before{
          content:'';
          position:absolute;
          top:-40%; right:-30%;
          width:180px; height:180px;
          border-radius:50%;
          background:radial-gradient(circle, ${withAlpha(accent, 0.22)}, transparent 65%);
          filter: blur(24px);
          animation: smAuraDrift 9s ease-in-out infinite;
          pointer-events:none;
        }

        .sm-sumcard .label{
          display:flex; align-items:center; gap:7px;
          font-size:10px; font-weight:900; letter-spacing:1.1px;
          text-transform:uppercase;
          margin-bottom:12px;
          position:relative; z-index:1;
        }
        .sm-sumcard.strongest .label{ color:${success}; }
        .sm-sumcard.weakest   .label{ color:${danger}; }
        .sm-sumcard.watch     .label{ color:${accent}; }
        .sm-sumcard .label::before{
          content:'';
          width:6px; height:6px; border-radius:50%;
          background:currentColor;
          box-shadow:0 0 8px currentColor;
        }
        .sm-sumcard .value{
          display:flex; align-items:center; gap:10px;
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:22px; font-weight:900;
          letter-spacing:-.6px;
          color:${text};
          position:relative; z-index:1;
        }
        .sm-sumcard .value .flag{ font-size:22px; line-height:1; }
        .sm-sumcard .sub{
          font-size:11px; font-weight:600;
          color:${textMuted};
          margin-top:8px;
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          position:relative; z-index:1;
        }
        .sm-sumcard.watch .sub{ color:${accent}; }

        /* ---------- How-to-use ---------- */
        .sm-howto{
          background:${card};
          border:1px solid ${border};
          border-radius:14px;
          padding:22px 24px;
          transition:background .25s ease, border-color .25s ease, box-shadow .3s ease;
          animation: smFadeUp .65s cubic-bezier(.16,1,.3,1) .22s both;
        }
        .sm-howto:hover{
          border-color:${borderStrong};
          box-shadow: 0 12px 32px -20px ${withAlpha(text, 0.35)};
        }
        .sm-howto h4{
          font-size:12px; font-weight:900; letter-spacing:1.2px;
          text-transform:uppercase;
          color:${text};
          margin:0 0 14px;
        }
        .sm-howto ul{
          list-style:none; padding:0; margin:0 0 20px;
          display:flex; flex-direction:column; gap:10px;
        }
        .sm-howto li{
          display:flex; align-items:flex-start; gap:12px;
          font-size:12.5px; line-height:1.65;
          color:${textSecondary};
        }
        .sm-howto li::before{
          content:'';
          flex-shrink:0;
          width:5px; height:5px; border-radius:50%;
          background:${accent};
          margin-top:9px;
          box-shadow: 0 0 8px ${accentGlow};
        }
        .sm-howto .cta-row{ display:flex; gap:10px; flex-wrap:wrap; }
        .sm-btn{
          display:inline-flex; align-items:center; justify-content:center;
          gap:8px;
          padding:11px 22px; border-radius:10px;
          font-family:inherit; font-size:12.5px; font-weight:800;
          letter-spacing:.2px;
          cursor:pointer;
          transition:all .25s cubic-bezier(.16,1,.3,1);
          white-space:nowrap;
        }
        .sm-btn.primary{
          background:linear-gradient(135deg, ${accent} 0%, ${accentHover} 100%);
          color:${bg};
          border:none;
          box-shadow:0 6px 18px ${accentGlow};
        }
        .sm-btn.primary:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 28px ${withAlpha(accent, 0.45)};
        }
        .sm-btn.primary:active{ transform:translateY(0); }
        .sm-btn.ghost{
          background:transparent;
          color:${text};
          border:1.5px solid ${borderStrong};
        }
        .sm-btn.ghost:hover{
          border-color:${accent};
          color:${accent};
          background:${accentSoft};
          transform:translateY(-2px);
          box-shadow: 0 8px 20px -12px ${accentGlow};
        }
        .sm-btn.ghost:active{ transform:translateY(0); }

        /* ---------- Responsive ---------- */
        @media (max-width: 900px){
          .sm-summary{ grid-template-columns:1fr 1fr 1fr; gap:10px; }
          .sm-sumcard{ padding:15px 14px 16px; }
          .sm-sumcard .value{ font-size:18px; }
          .sm-sumcard .value .flag{ font-size:18px; }
          .sm-sumcard .sub{ font-size:10.5px; }
        }
        @media (max-width: 640px){
          .sm-root{ padding-bottom: calc(40px + env(safe-area-inset-bottom, 0px)); }
          .sm-topbar{ gap:12px; }
          .sm-tabs{ width:100%; justify-content:space-between; }
          .sm-tab{ flex:1; padding:8px 10px; font-size:12px; }
          .sm-status{ font-size:11px; }
          .sm-card-head{ padding:14px 16px 12px; gap:9px; }
          .sm-card-head .meta{ display:none; }
          .sm-card-head .title{ font-size:12.5px; letter-spacing:.4px; }
          .sm-row{
            grid-template-columns:20px 26px 44px 1fr 78px;
            gap:8px;
            padding:10px 14px;
          }
          .sm-rank{ font-size:10.5px; }
          .sm-flag{ font-size:17px; }
          .sm-sym{ font-size:12px; }
          .sm-bar-wrap{ height:22px; }
          .sm-val .score{ font-size:12px; }
          .sm-val .pct{ font-size:9.5px; }
          .sm-summary{ grid-template-columns:1fr; gap:9px; }
          .sm-sumcard{ padding:14px 16px 16px; }
          .sm-sumcard .value{ font-size:20px; }
          .sm-howto{ padding:18px 18px; }
          .sm-howto li{ font-size:12px; }
          .sm-howto .cta-row{ gap:8px; }
          .sm-btn{ flex:1 1 100%; }
        }
      `}</style>

      <section className="view active sm-root" ref={rootRef}>

        {/* ============================================================
            TOP BAR
           ============================================================ */}
        <div className="sm-topbar">
          <div className="sm-tabs" role="tablist">
            {TIMEFRAMES.map((t) => (
              <button
                key={t.key}
                className={`sm-tab ${tf === t.key ? 'active' : ''}`}
                onClick={() => setTf(t.key)}
                role="tab"
                aria-selected={tf === t.key}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="sm-status">
            <span className="dot" />
            <span>Market closed</span>
            <span>·</span>
            <span>updated</span>
            <span className="clock">{clock}</span>
          </div>
        </div>

        {/* ============================================================
            MAIN LADDER
           ============================================================ */}
        <div className="sm-card">
          <div className="sm-card-head">
            <div className="icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="title">
              Strength Ladder <span className="sep">·</span> <span className="accent">{tf}</span>
            </div>
            <div className="spacer" />
            <div className="meta">8 majors · vs weighted basket</div>
          </div>

          <div className="sm-ladder">
            {sorted.map((cur, i) => {
              const v = safe(cur);
              const w = (Math.abs(v) / Math.max(maxPos, maxNeg)) * 100;
              const tier = getTier(v, maxPos);
              const style = TIER_STYLES[tier];
              const score = toScore(v, maxPos, maxNeg);
              const isEdge = i === 0 || i === sorted.length - 1;

              return (
                <div
                  className={`sm-row ${isEdge ? 'top' : ''}`}
                  key={cur}
                  style={{ animationDelay: `${0.05 + i * 0.045}s` }}
                >
                  <div className="sm-rank">{i + 1}</div>
                  <div className="sm-flag">{CURRENCY_META[cur]?.flag || '🏳️'}</div>
                  <div className="sm-sym">{cur}</div>
                  <div className="sm-bar-wrap">
                    <div
                      className="sm-bar"
                      style={{
                        width: `${Math.max(w, 6)}%`,
                        background: style.bar,
                        boxShadow: `0 0 16px ${style.glow}`,
                      }}
                    />
                  </div>
                  <div className="sm-val">
                    <div className="score" style={{ color: style.text }}>
                      {score.toFixed(1)}
                    </div>
                    <div className="pct" style={{ color: style.text, opacity: .8 }}>
                      {v >= 0 ? '+' : ''}{fmt(v, 2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            SUMMARY CARDS
           ============================================================ */}
        <div className="sm-summary">
          <div className="sm-sumcard strongest">
            <div className="label">Strongest</div>
            <div className="value">
              <span className="flag">{CURRENCY_META[strongest]?.flag}</span>
              {strongest}
            </div>
            <div className="sub">
              {safe(strongest) >= 0 ? '+' : ''}{fmt(safe(strongest), 2)}% · {CURRENCY_META[strongest]?.name}
            </div>
          </div>

          <div className="sm-sumcard weakest">
            <div className="label">Weakest</div>
            <div className="value">
              <span className="flag">{CURRENCY_META[weakest]?.flag}</span>
              {weakest}
            </div>
            <div className="sub">
              {safe(weakest) >= 0 ? '+' : ''}{fmt(safe(weakest), 2)}% · {CURRENCY_META[weakest]?.name}
            </div>
          </div>

          <div className="sm-sumcard watch">
            <div className="label">Pair to watch</div>
            <div className="value">
              <span className="flag">{CURRENCY_META[pairToWatch?.base]?.flag}</span>
              {pairToWatch?.base}/{pairToWatch?.quote}
            </div>
            <div className="sub">
              Strength gap {fmt(pairToWatch?.diff ?? 0, 2)} pts · long bias
            </div>
          </div>
        </div>

        {/* ============================================================
            HOW TO USE IT
           ============================================================ */}
        <div className="sm-howto">
          <h4>How to use it</h4>
          <ul>
            <li>Pick the timeframe that matches your trading style, then read the top and bottom of the ladder.</li>
            <li>Pair the strongest currency against the weakest for the cleanest directional bias.</li>
            <li>Confirm with structure and your entry rules — the meter is a filter, not a signal.</li>
            <li>Wide divergence between the base and quote currency usually signals the best trending conditions.</li>
          </ul>

          <div className="cta-row">
            <button className="sm-btn primary" onClick={() => go('signals')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.7 21a2 2 0 01-3.4 0"/>
              </svg>
              Get daily signals
            </button>
            <button className="sm-btn ghost" onClick={() => go('lot')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="18" rx="2.5"/>
                <path d="M8 7.5h8"/>
                <path d="M8 12h1.5M12 12h1.5M16 12h.01M8 16h1.5M12 16h1.5M16 16h.01"/>
              </svg>
              Lot size calculator
            </button>
          </div>
        </div>

      </section>
    </>
  );
}