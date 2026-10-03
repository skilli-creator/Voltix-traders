// src/components/Strength.jsx
import { useState, useEffect } from 'react';
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

/* Apply alpha (0..1) to a colour, tolerating hex/rgb/hsl and
   already-alpha'd values. Returns the original string if it can't
   be parsed, so a bad theme entry never throws. */
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
  const [tf, setTf]   = useState('4H');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ================================================================
     THEME TOKENS — everything the styles need is resolved here.
     ================================================================ */
  const c = theme?.colors || {};

  const accent       = c.accent       || c.gold      || '#f5b400';
  const accentHover  = c.accentHover  || accent;
  const accentSoft   = c.accentLight  || withAlpha(accent, 0.10);
  const accentBorder = withAlpha(accent, 0.25);
  const accentBorderStrong = withAlpha(accent, 0.45);
  const accentGlow   = withAlpha(accent, 0.30);

  const success      = c.success      || '#00d68f';
  const successSoft  = withAlpha(success, 0.10);
  const successBorder= withAlpha(success, 0.25);
  const successGlow  = withAlpha(success, 0.35);

  const danger       = c.danger       || '#ff4d6a';
  const dangerSoft   = withAlpha(danger, 0.10);
  const dangerBorder = withAlpha(danger, 0.25);
  const dangerGlow   = withAlpha(danger, 0.32);

  const warning      = c.warning      || '#f5a524';

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

  /* Tier visuals — all derived from the theme palette */
  const TIER_STYLES = {
    ultra:  {
      bar:  `linear-gradient(90deg, ${success} 0%, ${accentHover === success ? success : success} 100%)`,
      text: success,
      glow: successGlow,
    },
    strong: {
      bar:  `linear-gradient(90deg, ${success} 0%, ${success} 100%)`,
      text: success,
      glow: successGlow,
    },
    mild:   {
      bar:  `linear-gradient(90deg, ${accent} 0%, ${accentHover} 100%)`,
      text: accent,
      glow: accentGlow,
    },
    neg:    {
      bar:  `linear-gradient(90deg, ${danger} 0%, ${danger} 100%)`,
      text: danger,
      glow: dangerGlow,
    },
  };

  /* ================================================================
     DERIVED DATA — safe against partial props
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
        .sm-root{
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
          color:${text};
          background:transparent;
          transition:color .25s ease;
        }
        .sm-root *{ box-sizing:border-box; }

        /* ---------- Top bar ---------- */
        .sm-topbar{
          display:flex; align-items:center; justify-content:space-between;
          gap:16px; flex-wrap:wrap; margin-bottom:18px;
        }
        .sm-tabs{
          display:inline-flex; gap:4px; padding:4px;
          background:${card};
          border:1px solid ${border};
          border-radius:12px;
          transition:background .25s ease, border-color .25s ease;
        }
        .sm-tab{
          padding:8px 18px; border-radius:9px;
          font-family:inherit; font-size:12.5px; font-weight:700;
          color:${textMuted};
          background:transparent; border:none; cursor:pointer;
          transition:all .2s cubic-bezier(.16,1,.3,1);
          white-space:nowrap;
        }
        .sm-tab:hover{
          color:${text};
          background:${withAlpha(text, 0.05)};
        }
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
        @keyframes smPulse{
          0%,100%{ opacity:.6; transform:scale(1); }
          50%    { opacity:1;  transform:scale(1.15); }
        }
        .sm-status .clock{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          color:${text};
          font-weight:800;
          font-variant-numeric:tabular-nums;
        }

        /* ---------- Main card ---------- */
        .sm-card{
          background:${card};
          border:1px solid ${border};
          border-radius:16px;
          overflow:hidden;
          margin-bottom:16px;
          transition:background .25s ease, border-color .25s ease;
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
        }
        .sm-card-head .title{
          font-size:14px; font-weight:800; letter-spacing:.6px;
          text-transform:uppercase;
          color:${text};
        }
        .sm-card-head .title .accent{ color:${accent}; }
        .sm-card-head .sep{ color:${textMuted}; font-weight:400; margin:0 4px; }
        .sm-card-head .tf-tag{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:11px; font-weight:800;
          color:${accent};
          padding:3px 9px; border-radius:6px;
          background:${accentSoft};
          border:1px solid ${accentBorder};
        }
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
          transition:background .18s ease;
          position:relative;
        }
        .sm-row:hover{ background:${withAlpha(text, 0.02)}; }
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
        @keyframes smShine{
          0%  { background-position:-200% 0; }
          100%{ background-position: 200% 0; }
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
          background:${card};
          border:1px solid ${border};
          border-radius:14px;
          padding:18px 20px 20px;
          position:relative;
          overflow:hidden;
          transition:
            transform .22s cubic-bezier(.16,1,.3,1),
            border-color .22s ease,
            background .25s ease,
            box-shadow .25s ease;
        }
        .sm-sumcard:hover{ transform:translateY(-2px); }
        .sm-sumcard.strongest{ border-color:${successBorder}; }
        .sm-sumcard.strongest:hover{ box-shadow:0 8px 24px -8px ${successGlow}; }
        .sm-sumcard.weakest{ border-color:${dangerBorder}; }
        .sm-sumcard.weakest:hover{ box-shadow:0 8px 24px -8px ${dangerGlow}; }
        .sm-sumcard.watch{
          border-color:${accentBorderStrong};
          background:
            radial-gradient(ellipse at 100% 0%, ${withAlpha(accent, 0.09)}, transparent 60%),
            ${card};
        }
        .sm-sumcard.watch:hover{ box-shadow:0 8px 24px -8px ${accentGlow}; }
        .sm-sumcard .label{
          display:flex; align-items:center; gap:7px;
          font-size:10px; font-weight:900; letter-spacing:1.1px;
          text-transform:uppercase;
          margin-bottom:12px;
        }
        .sm-sumcard.strongest .label{ color:${success}; }
        .sm-sumcard.weakest   .label{ color:${danger}; }
        .sm-sumcard.watch     .label{ color:${accent}; }
        .sm-sumcard .label::before{
          content:'';
          width:6px; height:6px; border-radius:50%;
          background:currentColor;
          box-shadow:0 0 6px currentColor;
        }
        .sm-sumcard .value{
          display:flex; align-items:center; gap:10px;
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:22px; font-weight:900;
          letter-spacing:-.6px;
          color:${text};
        }
        .sm-sumcard .value .flag{ font-size:22px; line-height:1; }
        .sm-sumcard .sub{
          font-size:11px; font-weight:600;
          color:${textMuted};
          margin-top:8px;
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
        }
        .sm-sumcard.watch .sub{ color:${accent}; }

        /* ---------- How-to-use ---------- */
        .sm-howto{
          background:${card};
          border:1px solid ${border};
          border-radius:14px;
          padding:22px 24px;
          transition:background .25s ease, border-color .25s ease;
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
        }
        .sm-howto .cta-row{ display:flex; gap:10px; flex-wrap:wrap; }
        .sm-btn{
          display:inline-flex; align-items:center; justify-content:center;
          gap:8px;
          padding:11px 22px; border-radius:10px;
          font-family:inherit; font-size:12.5px; font-weight:800;
          letter-spacing:.2px;
          cursor:pointer;
          transition:all .22s cubic-bezier(.16,1,.3,1);
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
          box-shadow:0 10px 24px ${withAlpha(accent, 0.4)};
        }
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
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 900px){
          .sm-summary{ grid-template-columns:1fr 1fr 1fr; gap:10px; }
          .sm-sumcard{ padding:15px 14px 16px; }
          .sm-sumcard .value{ font-size:18px; }
          .sm-sumcard .value .flag{ font-size:18px; }
          .sm-sumcard .sub{ font-size:10.5px; }
        }
        @media (max-width: 640px){
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

      <section className="view active sm-root">

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
                <div className={`sm-row ${isEdge ? 'top' : ''}`} key={cur}>
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