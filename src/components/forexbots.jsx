// src/components/forexbots.jsx
import { useTheme } from 'styled-components';
import { fmt, fmtMoney, Sparkline, StatCard } from '../pages/forexdash';

// AI bot avatars — one per instrument
import euroBotImg from '../assets/images/image14.png';   // EUR/USD
import btcBotImg  from '../assets/images/image15.png';   // BTC/USD
import goldBotImg from '../assets/images/image16.png';   // XAU/USD

/* ================================================================
   PRESENTATION MAP
   Only three bots — one master per instrument. Visual identity
   (name, tagline, image, accent) lives here; live data still
   comes from the `bots` prop so nothing else needs to change.
   ================================================================ */
const BOT_PRESENTATION = {
  EURUSD: {
    name: 'Euro Master',
    tagline: 'Precision scalping on the world’s most liquid pair',
    image: euroBotImg,
    accent: '#3b82f6',
    accent2: '#60a5fa',
    initials: 'EM',
    badge: 'FX',
  },
  BTCUSD: {
    name: 'Bitcoin Master',
    tagline: 'Momentum and breakout hunting on 24/7 crypto',
    image: btcBotImg,
    accent: '#f7931a',
    accent2: '#ffb04d',
    initials: 'BM',
    badge: 'CRYPTO',
  },
  XAUUSD: {
    name: 'Gold Master',
    tagline: 'Safe-haven reversal plays around US session flows',
    image: goldBotImg,
    accent: '#f5b400',
    accent2: '#ffcb45',
    initials: 'GM',
    badge: 'METAL',
  },
};

const FALLBACK_ORDER = ['EURUSD', 'BTCUSD', 'XAUUSD'];

/* ================================================================
   COMPONENT
   ================================================================ */
export default function ForexBots({ bots = [], onToggleBot }) {
  const theme = useTheme();
  const c = theme?.colors || {};

  // Normalise to exactly three bots (one per pair) in a stable order
  const orderedBots = FALLBACK_ORDER
    .map((sym) => bots.find((b) => b.sym === sym))
    .filter(Boolean);

  const active      = orderedBots.filter((b) => b.on).length;
  const totalPL     = orderedBots.reduce((s, b) => s + (b.pnl || 0), 0);
  const avgWin      = orderedBots.length
    ? orderedBots.reduce((s, b) => s + (b.winRate || 0), 0) / orderedBots.length
    : 0;
  const totalTrades = orderedBots.reduce((s, b) => s + (b.trades || 0), 0);

  return (
    <>
      <style>{`
        /* ============================================================
           SCOPED STYLES — prefix: fb-
           ============================================================ */
        .fb-root{
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
          color:var(--text,#e8eefb);
        }
        .fb-root *{ box-sizing:border-box; }

        /* ---------- Hero strip ---------- */
        .fb-hero{
          position:relative;
          overflow:hidden;
          padding:26px 26px 24px;
          border-radius:18px;
          margin-bottom:18px;
          border:1px solid ${'var(--border,#16223a)'};
          background:
            radial-gradient(ellipse at 0% 0%, rgba(0,214,143,.10), transparent 55%),
            radial-gradient(ellipse at 100% 100%, rgba(245,180,0,.08), transparent 55%),
            linear-gradient(180deg, ${'var(--surface,#0d1524)'} 0%, ${'var(--surface,#0d1524)'} 100%);
        }
        .fb-hero::before{
          content:'';
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
          background-size:34px 34px;
          mask-image:radial-gradient(ellipse at 50% 0%, black, transparent 78%);
          -webkit-mask-image:radial-gradient(ellipse at 50% 0%, black, transparent 78%);
          pointer-events:none;
        }
        .fb-hero-inner{
          position:relative; z-index:1;
          display:flex; align-items:flex-end; gap:18px; flex-wrap:wrap;
        }
        .fb-hero-icon{
          width:46px; height:46px; border-radius:13px;
          display:flex; align-items:center; justify-content:center;
          background:linear-gradient(135deg, rgba(0,214,143,.18), rgba(0,214,143,.05));
          border:1px solid rgba(0,214,143,.32);
          color:${'var(--success,#00d68f)'};
          flex-shrink:0;
          box-shadow:0 0 24px rgba(0,214,143,.22);
        }
        .fb-hero-text{ flex:1; min-width:0; }
        .fb-hero-eyebrow{
          display:inline-flex; align-items:center; gap:8px;
          font-size:10.5px; font-weight:800; letter-spacing:1.6px;
          text-transform:uppercase;
          color:${'var(--success,#00d68f)'};
          margin-bottom:8px;
        }
        .fb-hero-eyebrow::before{
          content:'';
          width:18px; height:2px;
          background:${'var(--success,#00d68f)'};
        }
        .fb-hero-title{
          font-size:24px; font-weight:800; letter-spacing:-.7px;
          color:${'var(--text,#e8eefb)'};
          margin:0 0 6px;
          line-height:1.15;
        }
        .fb-hero-title .accent{
          background:linear-gradient(135deg, ${'var(--success,#00d68f)'}, #34d399);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }
        .fb-hero-sub{
          font-size:12.5px; line-height:1.6;
          color:${'var(--text-muted,#5a6b88)'};
          max-width:640px;
        }
        .fb-hero-live{
          display:inline-flex; align-items:center; gap:8px;
          padding:8px 14px; border-radius:11px;
          background:${'var(--surface,#0d1524)'};
          border:1px solid ${'var(--border,#16223a)'};
          font-size:11px; font-weight:800;
          letter-spacing:.9px;
          text-transform:uppercase;
          color:${'var(--text,#e8eefb)'};
          flex-shrink:0;
        }
        .fb-hero-live .dot{
          width:8px; height:8px; border-radius:50%;
          background:${'var(--success,#00d68f)'};
          box-shadow:0 0 10px ${'var(--success,#00d68f)'};
          animation:fbPulse 2s ease-in-out infinite;
        }
        @keyframes fbPulse{
          0%,100%{ opacity:.65; transform:scale(1); }
          50%    { opacity:1;  transform:scale(1.18); }
        }

        /* ---------- Summary strip ---------- */
        .fb-summary{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:14px;
          margin-bottom:18px;
        }

        /* ---------- Bots grid ---------- */
        .fb-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:18px;
          margin-bottom:18px;
        }

        /* ---------- Bot card ---------- */
        .fb-card{
          position:relative;
          border-radius:20px;
          overflow:hidden;
          background:${'var(--surface,#0d1524)'};
          border:1px solid ${'var(--border,#16223a)'};
          transition:transform .32s cubic-bezier(.16,1,.3,1), box-shadow .32s ease, border-color .3s ease;
          isolation:isolate;
        }
        .fb-card:hover{
          transform:translateY(-6px);
          border-color:var(--fb-accent);
          box-shadow:
            0 22px 48px -20px rgba(0,0,0,.75),
            0 0 0 1px var(--fb-accent),
            0 0 32px -8px var(--fb-accent);
        }
        .fb-card.running{
          border-color:var(--fb-accent);
        }
        .fb-card.running::after{
          content:'';
          position:absolute;
          inset:-1px;
          border-radius:inherit;
          pointer-events:none;
          background:linear-gradient(135deg, var(--fb-accent), transparent 45%, transparent 55%, var(--fb-accent));
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor;
          mask-composite:exclude;
          padding:1px;
          opacity:.7;
          animation:fbEdgeShine 6s linear infinite;
          background-size:200% 200%;
        }
        @keyframes fbEdgeShine{
          0%  { background-position:0% 0%; }
          100%{ background-position:200% 200%; }
        }

        /* ---------- Image area ---------- */
        .fb-img-wrap{
          position:relative;
          aspect-ratio:16/11;
          overflow:hidden;
          background:
            radial-gradient(ellipse at 50% 30%, var(--fb-accent-20), transparent 70%),
            ${'var(--surface-2,#0a1220)'};
        }
        .fb-img{
          position:absolute;
          inset:0;
          width:100%; height:100%;
          object-fit:cover;
          transform:scale(1.02);
          transition:transform .9s cubic-bezier(.16,1,.3,1), filter .4s ease;
          filter:saturate(1.05) contrast(1.02);
        }
        .fb-card:hover .fb-img{
          transform:scale(1.08);
        }
        .fb-img-wrap::after{
          content:'';
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg, rgba(0,0,0,.15) 0%, transparent 30%, transparent 45%, rgba(0,0,0,.72) 100%);
          pointer-events:none;
        }
        .fb-img-wrap::before{
          content:'';
          position:absolute;
          inset:0;
          background:radial-gradient(ellipse at 50% 120%, var(--fb-accent-45), transparent 60%);
          mix-blend-mode:screen;
          pointer-events:none;
        }
        .fb-shine{
          position:absolute;
          inset:0;
          background:linear-gradient(115deg, transparent 40%, rgba(255,255,255,.14) 50%, transparent 60%);
          background-size:220% 100%;
          animation:fbShine 5.5s linear infinite;
          pointer-events:none;
          mix-blend-mode:overlay;
        }
        @keyframes fbShine{
          0%  { background-position:-200% 0; }
          100%{ background-position: 200% 0; }
        }

        /* ---------- Overlay chips ---------- */
        .fb-chip{
          position:absolute;
          z-index:2;
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
          top:14px; left:14px;
          color:${'var(--text,#e8eefb)'};
          background:rgba(0,0,0,.55);
          border:1px solid rgba(255,255,255,.12);
        }
        .fb-chip.status.on{
          color:#4ade80;
          background:rgba(34,197,94,.18);
          border-color:rgba(34,197,94,.45);
          box-shadow:0 0 14px rgba(34,197,94,.35);
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
          top:14px; right:14px;
          color:#fff;
          background:rgba(0,0,0,.6);
          border:1px solid rgba(255,255,255,.14);
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          letter-spacing:1px;
        }
        .fb-chip.symbol .flag{
          font-size:12px;
          line-height:1;
        }
        .fb-chip.badge{
          position:absolute;
          bottom:98px; left:16px;
          color:var(--fb-accent);
          background:rgba(0,0,0,.55);
          border:1px solid var(--fb-accent-45);
          box-shadow:0 0 14px -2px var(--fb-accent);
          z-index:3;
        }

        /* ---------- Bottom-of-image title block ---------- */
        .fb-title-block{
          position:absolute;
          left:0; right:0; bottom:0;
          z-index:2;
          padding:22px 20px 18px;
          display:flex;
          flex-direction:column;
          gap:6px;
        }
        .fb-title-row{
          display:flex; align-items:center; gap:12px;
        }
        .fb-avatar{
          width:46px; height:46px; border-radius:13px;
          display:flex; align-items:center; justify-content:center;
          font-size:14px; font-weight:900;
          letter-spacing:-.4px;
          color:#0a0a0a;
          background:linear-gradient(135deg, var(--fb-accent), var(--fb-accent-2));
          border:1px solid rgba(255,255,255,.16);
          box-shadow:
            0 8px 20px -6px var(--fb-accent),
            inset 0 1px 0 rgba(255,255,255,.35);
          flex-shrink:0;
        }
        .fb-name{
          font-size:19px;
          font-weight:800;
          letter-spacing:-.5px;
          color:#fff;
          line-height:1.1;
          text-shadow:0 2px 12px rgba(0,0,0,.7);
          margin:0;
        }
        .fb-tagline{
          font-size:11.5px;
          font-weight:500;
          color:rgba(255,255,255,.75);
          line-height:1.45;
          text-shadow:0 1px 8px rgba(0,0,0,.75);
          margin:0;
        }

        /* ---------- Body ---------- */
        .fb-body{
          padding:18px 20px 18px;
          display:flex;
          flex-direction:column;
          gap:14px;
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
          background:${'var(--surface-2,#0a1220)'};
          border:1px solid ${'var(--border,#16223a)'};
          position:relative;
          overflow:hidden;
          transition:border-color .2s ease, background .2s ease;
        }
        .fb-stat:hover{
          border-color:var(--fb-accent-45);
          background:${'var(--surface-hover,#111c2e)'};
        }
        .fb-stat .k{
          display:block;
          font-size:9px;
          font-weight:800;
          letter-spacing:1px;
          text-transform:uppercase;
          color:${'var(--text-muted,#5a6b88)'};
          margin-bottom:4px;
        }
        .fb-stat .v{
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-size:14px;
          font-weight:800;
          letter-spacing:-.3px;
          color:${'var(--text,#e8eefb)'};
          font-variant-numeric:tabular-nums;
        }
        .fb-stat .v.pos{ color:${'var(--success,#00d68f)'}; }
        .fb-stat .v.neg{ color:${'var(--danger,#ff4d6a)'}; }

        /* ---------- Sparkline frame ---------- */
        .fb-spark-wrap{
          position:relative;
          height:52px;
          border-radius:11px;
          padding:6px 4px;
          background:
            linear-gradient(180deg, var(--fb-accent-08) 0%, transparent 100%),
            ${'var(--surface-2,#0a1220)'};
          border:1px solid ${'var(--border,#16223a)'};
          overflow:hidden;
        }
        .fb-spark-wrap::after{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent);
          background-size:60% 100%;
          animation:fbShine 4s linear infinite;
          pointer-events:none;
        }
        .fb-spark-label{
          position:absolute;
          top:6px; right:9px;
          z-index:2;
          font-size:9px;
          font-weight:800;
          letter-spacing:1px;
          text-transform:uppercase;
          color:var(--fb-accent);
          opacity:.9;
          pointer-events:none;
        }

        /* ---------- Footer ---------- */
        .fb-foot{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding-top:14px;
          border-top:1px solid ${'var(--border,#16223a)'};
        }
        .fb-dd{
          font-size:10.5px;
          font-weight:600;
          color:${'var(--text-muted,#5a6b88)'};
          letter-spacing:.4px;
          text-transform:uppercase;
        }
        .fb-dd strong{
          color:${'var(--text,#e8eefb)'};
          font-family:'JetBrains Mono','SF Mono','Courier New',monospace;
          font-weight:800;
          letter-spacing:-.2px;
          margin-left:4px;
          text-transform:none;
        }

        /* ---------- Premium switch ---------- */
        .fb-switch{
          position:relative;
          width:52px; height:28px;
          border-radius:20px;
          background:${'var(--surface-hover,#1d2a44)'};
          border:1px solid ${'var(--border,#16223a)'};
          cursor:pointer;
          transition:background .25s ease, border-color .25s ease, box-shadow .25s ease;
          flex-shrink:0;
        }
        .fb-switch::after{
          content:'';
          position:absolute;
          top:2px; left:2px;
          width:22px; height:22px;
          border-radius:50%;
          background:${'var(--text-muted,#5a6b88)'};
          transition:transform .28s cubic-bezier(.4,0,.2,1), background .25s ease, box-shadow .25s ease;
        }
        .fb-switch:hover{
          border-color:var(--fb-accent-45);
        }
        .fb-switch.on{
          background:var(--fb-accent-20);
          border-color:var(--fb-accent-45);
          box-shadow:0 0 16px -4px var(--fb-accent);
        }
        .fb-switch.on::after{
          transform:translateX(24px);
          background:var(--fb-accent);
          box-shadow:0 0 12px var(--fb-accent);
        }
        .fb-switch:active::after{
          width:26px;
        }

        /* ---------- Notice ---------- */
        .fb-notice{
          display:flex; align-items:flex-start; gap:12px;
          padding:16px 18px;
          border-radius:13px;
          background:${'var(--surface,#0d1524)'};
          border:1px solid ${'var(--border,#16223a)'};
        }
        .fb-notice svg{
          width:18px; height:18px; flex-shrink:0;
          margin-top:1px;
          stroke:${'var(--warning,#f5a524)'};
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .fb-notice span{
          font-size:12px; line-height:1.65;
          color:${'var(--text-muted,#5a6b88)'};
        }

        /* ============================================================
           RESPONSIVE
           ============================================================ */
        @media (max-width:1180px){
          .fb-summary{ grid-template-columns:repeat(2,1fr); }
          .fb-grid{ grid-template-columns:1fr; gap:16px; }
          .fb-img-wrap{ aspect-ratio:16/8; }
        }
        @media (max-width:760px){
          .fb-hero{ padding:20px 18px; border-radius:16px; }
          .fb-hero-title{ font-size:20px; letter-spacing:-.5px; }
          .fb-hero-sub{ font-size:12px; }
          .fb-hero-live{ width:100%; justify-content:center; }
          .fb-summary{ grid-template-columns:1fr 1fr; gap:10px; }
          .fb-img-wrap{ aspect-ratio:16/10; }
          .fb-title-block{ padding:18px 16px 14px; }
          .fb-name{ font-size:17px; }
          .fb-tagline{ font-size:11px; }
          .fb-avatar{ width:40px; height:40px; font-size:12.5px; border-radius:11px; }
          .fb-body{ padding:16px 16px; }
          .fb-stats{ gap:6px; }
          .fb-stat{ padding:9px 10px; border-radius:10px; }
          .fb-stat .k{ font-size:8.5px; }
          .fb-stat .v{ font-size:13px; }
          .fb-chip.badge{ bottom:82px; left:14px; font-size:9px; padding:5px 9px; }
        }
        @media (max-width:480px){
          .fb-summary{ grid-template-columns:1fr; }
          .fb-img-wrap{ aspect-ratio:16/11; }
        }
      `}</style>

      <section className="view active fb-root">

        {/* ============================================================
            HERO STRIP
           ============================================================ */}
        <div className="fb-hero">
          <div className="fb-hero-inner">
            <div className="fb-hero-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
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
                BTC/USD’s volatility, XAU/USD’s safe-haven rhythms. Toggle a strategy on and
                let the rules do the work.
              </p>
            </div>
            <div className="fb-hero-live">
              <span className="dot" />
              {active} of {orderedBots.length} running
            </div>
          </div>
        </div>

        {/* ============================================================
            SUMMARY STRIP
           ============================================================ */}
        <div className="fb-summary">
          <StatCard
            label="Active Bots"
            value={`${active} / ${orderedBots.length}`}
            sub="Automated strategies"
            accent={c.success || '#00d68f'}
          />
          <StatCard
            label="Combined P/L"
            value={(totalPL >= 0 ? '+' : '') + fmtMoney(totalPL)}
            valueClass={totalPL >= 0 ? 'pos' : 'neg'}
            sub="Since inception"
            accent={c.accent || '#3b82f6'}
          />
          <StatCard
            label="Avg Win Rate"
            value={`${fmt(avgWin, 1)}%`}
            sub="Across all strategies"
            accent={c.warning || '#f5a524'}
          />
          <StatCard
            label="Total Trades"
            value={totalTrades.toLocaleString('en-US')}
            sub="Executed orders"
            accent={c.accentSoft || '#a855f7'}
          />
        </div>

        {/* ============================================================
            BOT CARDS
           ============================================================ */}
        <div className="fb-grid">
          {orderedBots.map((b) => {
            const pres = BOT_PRESENTATION[b.sym] || {};
            const up = (b.pnl || 0) >= 0;
            const accent  = pres.accent  || (c.accent || '#3b82f6');
            const accent2 = pres.accent2 || accent;

            const base = b.sym.slice(0, 3);
            const quote = b.sym.slice(3, 6);
            const baseFlag  = { EUR: '🇪🇺', BTC: '₿',  XAU: '🥇' }[base]  || '';
            const quoteFlag = { USD: '🇺🇸' }[quote] || '';

            return (
              <article
                key={b.id}
                className={`fb-card ${b.on ? 'running' : ''}`}
                style={{
                  '--fb-accent': accent,
                  '--fb-accent-2': accent2,
                  '--fb-accent-20': accent + '33',
                  '--fb-accent-45': accent + '73',
                  '--fb-accent-08': accent + '15',
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

                  <span className={`fb-chip status ${b.on ? 'on' : ''}`}>
                    <span className="dot" />
                    {b.on ? 'Running' : 'Stopped'}
                  </span>

                  <span className="fb-chip symbol">
                    {baseFlag && <span className="flag">{baseFlag}</span>}
                    {base}/{quote}
                  </span>

                  <span className="fb-chip badge">{pres.badge || 'BOT'}</span>

                  <div className="fb-title-block">
                    <div className="fb-title-row">
                      <div className="fb-avatar">{pres.initials || 'AI'}</div>
                      <h3 className="fb-name">{pres.name || b.name}</h3>
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
                    <span className="fb-spark-label">Equity curve</span>
                    <Sparkline
                      values={b.history || []}
                      w={300}
                      h={44}
                      color={up ? (c.success || '#00d68f') : (c.danger || '#ff4d6a')}
                    />
                  </div>

                  <div className="fb-foot">
                    <span className="fb-dd">
                      Max DD <strong>{b.dd || '—'}</strong>
                    </span>
                    <button
                      className={`fb-switch ${b.on ? 'on' : ''}`}
                      onClick={() => onToggleBot && onToggleBot(b.id)}
                      aria-label={`Toggle ${pres.name || b.name}`}
                      aria-pressed={b.on}
                    />
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