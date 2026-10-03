// src/components/Strength.jsx
import { useState, useEffect, useMemo } from 'react';
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

/**
 * Turn a raw strength value into a 0..100 score using the current
 * dataset's max positive / max negative as the anchors.
 *   100 = strongest positive reading in the basket
 *    50 = neutral
 *     0 = weakest negative reading in the basket
 */
const toScore = (v, maxPos, maxNeg) => {
  if (v >= 0) return 50 + (maxPos > 0 ? (v / maxPos) * 50 : 0);
  return 50 - (maxNeg > 0 ? (Math.abs(v) / maxNeg) * 50 : 0);
};

/**
 * Return a colour tier for a strength value. Positive momentum
 * transitions bright green → medium green → amber; anything
 * negative goes red.
 */
const getTier = (v, maxPos) => {
  if (v < 0) return 'neg';
  const ratio = maxPos > 0 ? v / maxPos : 0;
  if (ratio >= 0.7) return 'ultra';
  if (ratio >= 0.35) return 'strong';
  return 'mild';
};

const TIER_STYLES = {
  ultra:  { bar: 'linear-gradient(90deg, #00e89a 0%, #00a86f 100%)', text: '#00e89a', glow: 'rgba(0,232,154,.38)' },
  strong: { bar: 'linear-gradient(90deg, #4ade80 0%, #16a34a 100%)', text: '#4ade80', glow: 'rgba(74,222,128,.30)' },
  mild:   { bar: 'linear-gradient(90deg, #f5b400 0%, #d99800 100%)', text: '#f5b400', glow: 'rgba(245,180,0,.32)'  },
  neg:    { bar: 'linear-gradient(90deg, #ff4d6a 0%, #c92444 100%)', text: '#ff4d6a', glow: 'rgba(255,77,106,.35)' },
};

const tierLabel = (tier, v) => {
  if (tier === 'ultra')  return 'Very strong';
  if (tier === 'strong') return 'Strong';
  if (tier === 'mild')   return v >= 0 ? 'Mildly bullish' : 'Neutral';
  return v < -0.05 ? 'Very weak' : 'Weak';
};

/* ================================================================ */
/*  COMPONENT                                                       */
/* ================================================================ */
export default function Strength({ strength, onNavigate }) {
  const [tf, setTf] = useState('4H');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ---- Derived strength data ---- */
  const st = currencyStrength(strength);

  const sorted = useMemo(
    () => CURRENCIES.slice().sort((a, b) => st[b] - st[a]),
    [st]
  );

  const maxPos = Math.max(0.0001, ...CURRENCIES.map(c => st[c]).filter(v => v > 0));
  const maxNeg = Math.max(0.0001, ...CURRENCIES.map(c => Math.abs(st[c])).filter(v => st[c] < 0));

  /* ---- Pair rankings ---- */
  const pairData = useMemo(
    () => PAIRS.map((sym) => {
      const b = sym.slice(0, 3);
      const q = sym.slice(3, 6);
      return { sym, base: b, quote: q, diff: st[b] - st[q] };
    }).sort((a, b) => b.diff - a.diff),
    [st]
  );

  const strongest = sorted[0];
  const weakest   = sorted[sorted.length - 1];
  const pairToWatch = pairData[0];
  const pairToAvoid = pairData[pairData.length - 1];

  /* ---- Live clock ---- */
  const clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  /* ---- Navigation helper ---- */
  const go = (path) => { if (onNavigate) onNavigate(path); };

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <>
      <style>{`
        /* ============================================================
           SCOPED STYLES — prefix: sm-
           ============================================================ */
        .sm-root{
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
          color:${'var(--text,#f5f5f7)'};
        }
        .sm-root *{ box-sizing:border-box; }

        /* ---------- Top bar (timeframe tabs + status) ---------- */
        .sm-topbar{
          display:flex; align-items:center; justify-content:space-between;
          gap:16px; flex-wrap:wrap; margin-bottom:18px;
        }
        .sm-tabs{
          display:inline-flex; gap:4px; padding:4px;
          background:${'var(--card,#111114)'};
          border:1px solid ${'var(--border,#1e1e22)'};
          border-radius:12px;
        }
        .sm-tab{
          padding:8px 18px; border-radius:9px;
          font-family:inherit; font-size:12.5px; font-weight:700;
          color:${'var(--text-muted,#8b8b93)'};
          background:transparent; border:none; cursor:pointer;
          transition:all .2s cubic-bezier(.16,1,.3,1);
          white-space:nowrap;
        }
        .sm-tab:hover{
          color:${'var(--text,#f5f5f7)'};
          background:${'rgba(255,255,255,.03)'};
        }
        .sm-tab.active{
          background:linear-gradient(135deg, #f5b400 0%, #e0a200 100%);
          color:#0a0a0a;
          box-shadow:0 4px 14px rgba(245,180,0,.25);
        }
        .sm-status{
          display:inline-flex; align-items:center; gap:8px;
          font-size:11.5px; font-weight:600;
          color:${'var(--text-muted,#8b8b93)'};
          letter-spacing:.2px;
        }
        .sm-status .dot{
          width:7px; height:7px; border-radius:50%;
          background:#f5b400;
          box-shadow:0 0 8px #f5b400;
          animation:smPulse 2s ease-in-out infinite;
        }
        @keyframes smPulse{
          0%,100%{ opacity:.6; transform:scale(1); }
          50%    { opacity:1;  transform:scale(1.15); }
        }
        .sm-status .clock{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          color:${'var(--text,#f5f5f7)'};
          font-weight:800;
          font-variant-numeric:tabular-nums;
        }

        /* ---------- Main ladder card ---------- */
        .sm-card{
          background:${'var(--card,#111114)'};
          border:1px solid ${'var(--border,#1e1e22)'};
          border-radius:16px;
          overflow:hidden;
          margin-bottom:16px;
        }
        .sm-card-head{
          display:flex; align-items:center; gap:12px;
          padding:18px 22px 14px;
          border-bottom:1px solid ${'var(--border,#1e1e22)'};
        }
        .sm-card-head .icon{
          width:32px; height:32px; border-radius:9px;
          display:flex; align-items:center; justify-content:center;
          background:rgba(245,180,0,.1);
          border:1px solid rgba(245,180,0,.25);
          color:#f5b400;
          flex-shrink:0;
        }
        .sm-card-head .title{
          font-size:14px; font-weight:800; letter-spacing:.6px;
          text-transform:uppercase;
          color:${'var(--text,#f5f5f7)'};
        }
        .sm-card-head .title .accent{
          color:#f5b400;
        }
        .sm-card-head .sep{
          color:${'var(--text-muted,#8b8b93)'};
          font-weight:400;
          margin:0 4px;
        }
        .sm-card-head .tf-tag{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:11px; font-weight:800;
          color:#f5b400;
          padding:3px 9px; border-radius:6px;
          background:rgba(245,180,0,.1);
          border:1px solid rgba(245,180,0,.25);
        }
        .sm-card-head .spacer{ flex:1; }
        .sm-card-head .meta{
          font-size:11px;
          color:${'var(--text-muted,#8b8b93)'};
          font-weight:600;
        }

        /* ---------- Ladder rows ---------- */
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
        .sm-row:hover{
          background:${'rgba(255,255,255,.02)'};
        }
        .sm-row + .sm-row{
          border-top:1px solid ${'rgba(255,255,255,.03)'};
        }
        .sm-rank{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:12px; font-weight:800;
          color:${'var(--text-muted,#8b8b93)'};
          text-align:right;
          font-variant-numeric:tabular-nums;
        }
        .sm-row.top .sm-rank{ color:#f5b400; }
        .sm-flag{
          font-size:22px; line-height:1;
          display:flex; align-items:center; justify-content:center;
        }
        .sm-sym{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:13.5px; font-weight:800;
          letter-spacing:.4px;
          color:${'var(--text,#f5f5f7)'};
        }
        .sm-bar-wrap{
          position:relative;
          height:26px;
          border-radius:8px;
          background:${'rgba(255,255,255,.035)'};
          border:1px solid ${'rgba(255,255,255,.04)'};
          overflow:hidden;
        }
        .sm-bar{
          position:absolute;
          top:0; bottom:0;
          border-radius:8px;
          transition:width .9s cubic-bezier(.16,1,.3,1), left .9s cubic-bezier(.16,1,.3,1), right .9s cubic-bezier(.16,1,.3,1);
        }
        .sm-bar::after{
          content:'';
          position:absolute; inset:0;
          background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,.18) 50%, transparent 100%);
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
          color:${'var(--text-muted,#8b8b93)'};
          margin-top:3px;
        }

        /* ---------- Bottom summary cards ---------- */
        .sm-summary{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:12px;
          margin-bottom:18px;
        }
        .sm-sumcard{
          background:${'var(--card,#111114)'};
          border:1px solid ${'var(--border,#1e1e22)'};
          border-radius:14px;
          padding:18px 20px 20px;
          position:relative;
          overflow:hidden;
          transition:transform .22s cubic-bezier(.16,1,.3,1), border-color .22s ease;
        }
        .sm-sumcard:hover{
          transform:translateY(-2px);
        }
        .sm-sumcard.strongest{ border-color:rgba(0,232,154,.25); }
        .sm-sumcard.strongest:hover{ box-shadow:0 8px 24px -8px rgba(0,232,154,.35); }
        .sm-sumcard.weakest{ border-color:rgba(255,77,106,.22); }
        .sm-sumcard.weakest:hover{ box-shadow:0 8px 24px -8px rgba(255,77,106,.3); }
        .sm-sumcard.watch{
          border-color:rgba(245,180,0,.35);
          background:
            radial-gradient(ellipse at 100% 0%, rgba(245,180,0,.09), transparent 60%),
            ${'var(--card,#111114)'};
        }
        .sm-sumcard.watch:hover{ box-shadow:0 8px 24px -8px rgba(245,180,0,.4); }

        .sm-sumcard .label{
          display:flex; align-items:center; gap:7px;
          font-size:10px; font-weight:900; letter-spacing:1.1px;
          text-transform:uppercase;
          margin-bottom:12px;
        }
        .sm-sumcard.strongest .label{ color:#00e89a; }
        .sm-sumcard.weakest .label{ color:#ff4d6a; }
        .sm-sumcard.watch .label{ color:#f5b400; }
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
          color:${'var(--text,#f5f5f7)'};
        }
        .sm-sumcard .value .flag{ font-size:22px; line-height:1; }
        .sm-sumcard .sub{
          font-size:11px; font-weight:600;
          color:${'var(--text-muted,#8b8b93)'};
          margin-top:8px;
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
        }
        .sm-sumcard.watch .sub{
          color:#f5b400;
        }

        /* ---------- How-to-use ---------- */
        .sm-howto{
          background:${'var(--card,#111114)'};
          border:1px solid ${'var(--border,#1e1e22)'};
          border-radius:14px;
          padding:22px 24px;
        }
        .sm-howto h4{
          font-size:12px; font-weight:900; letter-spacing:1.2px;
          text-transform:uppercase;
          color:${'var(--text,#f5f5f7)'};
          margin:0 0 14px;
        }
        .sm-howto ul{
          list-style:none; padding:0; margin:0 0 20px;
          display:flex; flex-direction:column; gap:10px;
        }
        .sm-howto li{
          display:flex; align-items:flex-start; gap:12px;
          font-size:12.5px; line-height:1.65;
          color:${'var(--text-secondary,#b0b0b8)'};
        }
        .sm-howto li::before{
          content:'';
          flex-shrink:0;
          width:5px; height:5px; border-radius:50%;
          background:#f5b400;
          margin-top:9px;
        }
        .sm-howto .cta-row{
          display:flex; gap:10px; flex-wrap:wrap;
        }
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
          background:linear-gradient(135deg, #f5b400 0%, #e0a200 100%);
          color:#0a0a0a;
          border:none;
          box-shadow:0 6px 18px rgba(245,180,0,.28);
        }
        .sm-btn.primary:hover{
          transform:translateY(-2px);
          box-shadow:0 10px 24px rgba(245,180,0,.4);
        }
        .sm-btn.ghost{
          background:transparent;
          color:${'var(--text,#f5f5f7)'};
          border:1.5px solid ${'var(--border-strong,#2a2a30)'};
        }
        .sm-btn.ghost:hover{
          border-color:#f5b400;
          color:#f5b400;
          background:rgba(245,180,0,.05);
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
          .sm-summary{
            grid-template-columns:1fr;
            gap:9px;
          }
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
            TOP BAR — timeframe tabs + live status
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
            {sorted.map((c, i) => {
              const v = st[c];
              const w = (Math.abs(v) / Math.max(maxPos, maxNeg)) * 100;
              const tier = getTier(v, maxPos);
              const style = TIER_STYLES[tier];
              const score = toScore(v, maxPos, maxNeg);
              const isTop = i === 0;
              const isBot = i === sorted.length - 1;

              return (
                <div className={`sm-row ${isTop || isBot ? 'top' : ''}`} key={c}>
                  <div className="sm-rank">{i + 1}</div>
                  <div className="sm-flag">{CURRENCY_META[c]?.flag || '🏳️'}</div>
                  <div className="sm-sym">{c}</div>
                  <div className="sm-bar-wrap">
                    <div
                      className="sm-bar"
                      style={{
                        left: 0,
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
            SUMMARY CARDS — Strongest / Weakest / Pair to watch
           ============================================================ */}
        <div className="sm-summary">
          <div className="sm-sumcard strongest">
            <div className="label">Strongest</div>
            <div className="value">
              <span className="flag">{CURRENCY_META[strongest]?.flag}</span>
              {strongest}
            </div>
            <div className="sub">
              {st[strongest] >= 0 ? '+' : ''}{fmt(st[strongest], 2)}% · {CURRENCY_META[strongest]?.name}
            </div>
          </div>

          <div className="sm-sumcard weakest">
            <div className="label">Weakest</div>
            <div className="value">
              <span className="flag">{CURRENCY_META[weakest]?.flag}</span>
              {weakest}
            </div>
            <div className="sub">
              {st[weakest] >= 0 ? '+' : ''}{fmt(st[weakest], 2)}% · {CURRENCY_META[weakest]?.name}
            </div>
          </div>

          <div className="sm-sumcard watch">
            <div className="label">Pair to watch</div>
            <div className="value">
              <span className="flag">{CURRENCY_META[pairToWatch.base]?.flag}</span>
              {pairToWatch.base}/{pairToWatch.quote}
            </div>
            <div className="sub">
              Strength gap {fmt(pairToWatch.diff, 2)} pts · long bias
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