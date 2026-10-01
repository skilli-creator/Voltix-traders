// src/components/forexhome.jsx
import { useState, useEffect } from 'react';
import {
  CURRENCIES, CUR_NAMES, WATCHLIST,
  fmt, fmtMoney, fmtPrice,
  currencyStrength, Sparkline,
} from '../pages/forexdash';
import tonnyPhoto from '../assets/images/image13.png';

/* ================================================================== */
/*  DESIGN TOKENS — matching the reference aesthetic                   */
/* ================================================================== */
const C = {
  bg: '#070707',
  bg2: '#0d0d0d',
  card: '#111111',
  card2: '#151515',
  border: '#1e1e1e',
  border2: '#262626',
  gold: '#f5b400',
  gold2: '#e0a200',
  goldSoft: 'rgba(245,180,0,.12)',
  goldBorder: 'rgba(245,180,0,.28)',
  text: '#ffffff',
  text2: '#a8a8a8',
  text3: '#6b6b6b',
  green: '#22c55e',
  red: '#ef4444',
};

/* ================================================================== */
/*  CONTENT                                                            */
/* ================================================================== */

const MARKETS = [
  { sym:'EURUSD', label:'EUR/USD', name:'Euro / US Dollar', tag:'Major',
    desc:'The world’s most liquid pair. Tight spreads, deep liquidity and clean directional trends during the London and New York sessions.',
    spread:'0.4 pips', session:'London · New York', vol:'Medium', atr:'65 pips' },
  { sym:'BTCUSD', label:'BTC/USD', name:'Bitcoin / US Dollar', tag:'Crypto',
    desc:'24/7 volatility with enormous intraday ranges. Built for momentum, breakout and session-based automation strategies.',
    spread:'$12', session:'24 / 7', vol:'High', atr:'$1,200' },
  { sym:'XAUUSD', label:'XAU/USD', name:'Gold / US Dollar', tag:'Metal',
    desc:'The classic safe-haven asset. Strong directional runs during risk-off flows, US data releases and geopolitical events.',
    spread:'18 pts', session:'London · New York', vol:'High', atr:'$24' },
];

const FEATURES = [
  { icon:'book', title:'Structured Learning', desc:'From beginner to advanced, our curriculum is designed for real, measurable results on live accounts.' },
  { icon:'chart', title:'Live Market Analysis', desc:'Daily market breakdowns and real-time trading sessions across EUR/USD, gold and crypto.' },
  { icon:'users', title:'Thriving Community', desc:'Connect with 3,200+ traders on their journey to consistent profitability and financial freedom.' },
  { icon:'medal', title:'Proven Track Record', desc:'Verified results with consistent monthly returns — logged, audited and shown openly.' },
];

const SERVICES = [
  { key:'bots', title:'Automated Trading Bots',
    desc:'Six pre-built, broker-agnostic strategies tuned exclusively for EUR/USD, BTC/USD and XAU/USD. Toggle on and let them run.',
    cta:'Manage bots' },
  { key:'lot', title:'Lot Size Calculator',
    desc:'Risk-based position sizing on every instrument. Enter balance, risk % and stop-loss — get the exact lot size instantly.',
    cta:'Calculate size' },
  { key:'strength', title:'Currency Strength Meter',
    desc:'Rank the eight majors against a weighted basket and spot the strongest and weakest currencies at a glance.',
    cta:'View strength' },
  { key:'signals', title:'Live Signal Alerts',
    desc:'Momentum, breakout and mean-reversion alerts delivered the moment price structure shifts on your watchlist.',
    cta:'See alerts' },
  { key:'risk', title:'Risk & Margin Manager',
    desc:'Real-time margin level, free margin and exposure warnings so a single trade never takes down your account.',
    cta:'Review risk' },
  { key:'journal', title:'Trade Journal & Analytics',
    desc:'Every fill and every pip logged automatically. Win rate, expectancy, drawdown and equity curve in one view.',
    cta:'Open journal' },
  { key:'backtest', title:'Backtesting Engine',
    desc:'Run any bot against years of historical tick data before risking a cent. Drawdown, Sharpe and profit factor up front.',
    cta:'Run backtest' },
  { key:'coaching', title:'1-on-1 Coaching',
    desc:'Direct sessions with Tonny covering risk, journaling, bot selection and strategy design — built around your account.',
    cta:'Book session' },
];

const BOTS = [
  { name:'Pip Scalper', market:'EUR/USD', tf:'M5', win:68, trades:1243, dd:'4.2%', pf:2.1, live:true },
  { name:'Momentum Rider', market:'BTC/USD', tf:'H1', win:61, trades:486, dd:'9.8%', pf:1.9, live:true },
  { name:'Gold Reversal', market:'XAU/USD', tf:'M30', win:57, trades:712, dd:'11.4%', pf:1.7, live:true },
  { name:'London Breakout', market:'EUR/USD', tf:'M15', win:64, trades:894, dd:'6.1%', pf:2.0, live:true },
];

const STATS = [
  { n:'10+',  l:'Years trading' },
  { n:'3.2k+', l:'Traders mentored' },
  { n:'6+',   l:'Live bots' },
  { n:'24/7', l:'Community support' },
];

const TESTIMONIALS = [
  { q:'The lot size calculator alone saved my account. My drawdown dropped by half in two months.', n:'Daniel M.', r:'Swing trader · EUR/USD' },
  { q:'I run Gold Reversal overnight and Momentum Rider during US hours. Clean execution, zero drama.', n:'Priya S.', r:'Part-time · XAU/USD' },
  { q:'The strength meter tells me in two seconds whether I should be long or short the dollar.', n:'Kwame A.', r:'Day trader · Majors' },
];

const FAQS = [
  { q:'Is MyTradeApp a broker?', a:'No. MyTradeApp is a third-party analytics and automation layer built by Tonny. You keep your own broker account and we give you the tools to trade it better.' },
  { q:'Which instruments do the bots trade?', a:'Three only: EUR/USD, BTC/USD and XAU/USD. Focusing on a small set lets us tune each strategy far more precisely than a generic multi-asset bot.' },
  { q:'Do I need coding experience?', a:'None at all. Every bot is pre-built and configurable from the dashboard. If you can toggle a switch and type a risk %, you can run one.' },
  { q:'How is risk handled?', a:'Every position is sized from your balance and a stop-loss distance. The risk manager enforces a daily loss cap and warns you before margin gets dangerous.' },
  { q:'Can I run bots and manual trades together?', a:'Yes. Both sit in the same book and the dashboard aggregates P/L, margin and exposure across both.' },
  { q:'Do I need a VPS?', a:'Not strictly, but recommended. A London or New York VPS keeps latency under 2ms and prevents the platform from going offline mid-trade.' },
];

/* ================================================================== */
/*  ICONS                                                              */
/* ================================================================== */
const Icon = ({ name, size = 20 }) => {
  const p = { width:size, height:size, viewBox:'0 0 24 24', fill:'none',
    stroke:'currentColor', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' };
  switch (name) {
    case 'book': return (<svg {...p}><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 7h7M8 11h7"/></svg>);
    case 'chart': return (<svg {...p}><path d="M3 17l5-6 4 4 8-9"/><path d="M15 6h5v5"/></svg>);
    case 'users': return (<svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M3 20v-1.5A4.5 4.5 0 017.5 14h3A4.5 4.5 0 0115 18.5V20"/><path d="M17 11a3 3 0 100-6"/><path d="M21 20v-1.5a4.5 4.5 0 00-3.5-4.36"/></svg>);
    case 'medal': return (<svg {...p}><circle cx="12" cy="15" r="5.5"/><path d="M8.5 9.5L6 3h12l-2.5 6.5"/></svg>);
    case 'bot': return (<svg {...p}><rect x="3.5" y="7.5" width="17" height="12" rx="3.5"/><path d="M12 7.5V4"/><circle cx="12" cy="3.4" r="1"/><path d="M9 13h.01M15 13h.01"/><path d="M9.5 16.5h5"/></svg>);
    case 'calc': return (<svg {...p}><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 7.5h8"/><path d="M8 12h1.5M12 12h1.5M16 12h.01M8 16h1.5M12 16h1.5M16 16h.01"/></svg>);
    case 'bars': return (<svg {...p}><path d="M5 20v-8M12 20V4M19 20v-5"/></svg>);
    case 'bell': return (<svg {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>);
    case 'shield': return (<svg {...p}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>);
    case 'journal': return (<svg {...p}><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 8h7M8 12h7M8 16h4"/></svg>);
    case 'flask': return (<svg {...p}><path d="M3 20h18"/><path d="M6 20V9l4 4 4-8 4 6v9"/></svg>);
    case 'user': return (<svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>);
    case 'arrow': return (<svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>);
    case 'check': return (<svg {...p}><path d="M4 12l5 5L20 6"/></svg>);
    case 'star': return (<svg {...p} fill="currentColor" stroke="none"><path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9l6.6-.9z"/></svg>);
    case 'phone': return (<svg {...p}><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M12 18h.01"/></svg>);
    case 'telegram': return (<svg {...p} fill="currentColor" stroke="none"><path d="M21.5 4.2L2.9 11.3c-1 .4-1 1 .1 1.3l4.6 1.4 1.8 5.5c.2.6.4.7 1 .3l2.6-2 4.6 3.4c.6.4 1 .2 1.2-.5l3-13.8c.2-.9-.3-1.3-.9-1.1z"/></svg>);
    default: return null;
  }
};

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function ForexHome({
  pairs, positions = [], account, equityHistory = [], strength,
  onTrade, onClosePosition, onViewChange,
}) {
  const go = (k) => onViewChange && onViewChange(k);

  const priceOf = (sym) => pairs?.[sym]?.price ?? 0;
  const changeOf = (sym) => {
    const p = pairs?.[sym];
    if (!p || !p.open) return 0;
    return ((p.price - p.open) / p.open) * 100;
  };

  const st = strength ? currencyStrength(strength) : {};
  const sortedCur = CURRENCIES.slice().sort((a, b) => (st[b] || 0) - (st[a] || 0));
  const pick = [...sortedCur.slice(0, 4), ...sortedCur.slice(-4)];
  const maxAbs = Math.max(...pick.map((x) => Math.abs(st[x] || 0)), 0.05);

  const [calc, setCalc] = useState({ bal: 10000, risk: 1, sl: 25 });
  const riskAmount = (Number(calc.bal) * Number(calc.risk)) / 100;
  const lots = calc.sl > 0 ? riskAmount / (Number(calc.sl) * 10) : 0;

  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % 4), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        .gf{ background:${C.bg}; color:${C.text}; display:flex; flex-direction:column; gap:0;
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif; }
        .gf *{ box-sizing:border-box; }

        /* ---------- shared ---------- */
        .gf-wrap{ max-width:1240px; margin:0 auto; width:100%; padding:0 22px; }
        .gf-sec{ padding:78px 0; }
        .gf-sec-sm{ padding:52px 0; }

        .gf-eyebrow{ display:inline-flex; align-items:center; gap:8px; font-size:11px;
          font-weight:800; letter-spacing:1.6px; text-transform:uppercase; color:${C.gold};
          margin-bottom:16px; }
        .gf-eyebrow::before{ content:''; width:20px; height:2px; background:${C.gold}; }

        .gf-h2{ font-size:40px; line-height:1.1; font-weight:800; letter-spacing:-1.4px;
          color:${C.text}; margin:0 0 14px; }
        .gf-h2 .g{ color:${C.gold}; }
        .gf-sub{ font-size:15px; line-height:1.65; color:${C.text2}; max-width:640px;
          margin:0 auto; }

        .gf-center{ text-align:center; }
        .gf-center .gf-sub{ margin:0 auto; }

        /* ---------- buttons ---------- */
        .gf-btn{ display:inline-flex; align-items:center; justify-content:center; gap:9px;
          padding:15px 30px; border-radius:10px; border:none; font-family:inherit;
          font-size:14.5px; font-weight:700; letter-spacing:.1px; cursor:pointer;
          transition:.2s cubic-bezier(.16,1,.3,1); white-space:nowrap; }
        .gf-btn-gold{ background:${C.gold}; color:#0a0a0a;
          box-shadow:0 8px 22px rgba(245,180,0,.28); }
        .gf-btn-gold:hover{ background:${C.gold2}; transform:translateY(-2px);
          box-shadow:0 14px 30px rgba(245,180,0,.4); }
        .gf-btn-outline{ background:transparent; color:${C.gold};
          border:1.5px solid ${C.gold}; }
        .gf-btn-outline:hover{ background:${C.goldSoft}; transform:translateY(-2px); }
        .gf-btn-ghost{ background:transparent; color:${C.text};
          border:1.5px solid ${C.border2}; }
        .gf-btn-ghost:hover{ border-color:${C.gold}; color:${C.gold}; }

        /* ---------- hero ---------- */
        .gf-hero{ position:relative; overflow:hidden; padding:90px 0 100px; text-align:center;
          background:radial-gradient(ellipse at 50% 0%, rgba(245,180,0,.10), transparent 60%),
            linear-gradient(180deg, #0a0a0a 0%, #070707 100%); }
        .gf-hero::before{ content:''; position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size:48px 48px;
          mask-image:radial-gradient(ellipse at 50% 30%, black, transparent 75%);
          -webkit-mask-image:radial-gradient(ellipse at 50% 30%, black, transparent 75%); }
        /* candlestick chart decoration */
        .gf-hero-candles{ position:absolute; inset:0; pointer-events:none; opacity:.5; }
        .gf-hero-candles svg{ width:100%; height:100%; }

        .gf-hero-inner{ position:relative; z-index:2; max-width:900px; margin:0 auto; padding:0 22px; }
        .gf-hero h1{ font-size:74px; line-height:1.02; font-weight:900; letter-spacing:-3px;
          color:${C.text}; margin:0 0 22px; }
        .gf-hero h1 .g{ color:${C.gold}; }
        .gf-hero-lead{ font-size:19px; line-height:1.55; color:${C.text2};
          max-width:640px; margin:0 auto 38px; }

        .gf-hero-cta{ display:flex; justify-content:center; gap:14px; flex-wrap:wrap;
          margin-bottom:44px; }
        .gf-hero-trust{ display:flex; justify-content:center; gap:42px; flex-wrap:wrap; }
        .gf-trust{ display:flex; align-items:center; gap:10px; font-size:14px; color:${C.text2};
          font-weight:600; }
        .gf-trust svg{ color:${C.gold}; flex-shrink:0; }

        /* ---------- ticker strip ---------- */
        .gf-ticker{ border-top:1px solid ${C.border}; border-bottom:1px solid ${C.border};
          background:${C.bg2}; overflow:hidden; position:relative;
          mask-image:linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
          -webkit-mask-image:linear-gradient(90deg, transparent, black 6%, black 94%, transparent); }
        .gf-ticker-track{ display:flex; width:max-content;
          animation:gfScroll 40s linear infinite; }
        .gf-ticker:hover .gf-ticker-track{ animation-play-state:paused; }
        @keyframes gfScroll{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
        .gf-tick{ display:flex; align-items:center; gap:10px; padding:16px 26px;
          border-right:1px solid ${C.border}; white-space:nowrap; }
        .gf-tick .s{ font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700;
          color:${C.text2}; letter-spacing:.3px; }
        .gf-tick .p{ font-family:'JetBrains Mono',monospace; font-size:12.5px;
          font-weight:700; color:${C.text}; }
        .gf-tick .c{ font-family:'JetBrains Mono',monospace; font-size:11.5px;
          font-weight:700; }
        .pos{ color:${C.green}; } .neg{ color:${C.red}; }

        /* ---------- about ---------- */
        .gf-about-head{ text-align:center; margin-bottom:52px; }

        /* founder card */
        .gf-founder{ display:grid; grid-template-columns:300px 1fr; gap:40px;
          padding:40px; border-radius:18px; border:1px solid ${C.border};
          background:linear-gradient(180deg, ${C.card} 0%, ${C.bg2} 100%);
          position:relative; overflow:hidden; }
        .gf-founder::before{ content:''; position:absolute; top:-120px; right:-120px;
          width:340px; height:340px; border-radius:50%;
          background:radial-gradient(circle, ${C.goldSoft}, transparent 70%);
          pointer-events:none; }
        .gf-founder-photo{ position:relative; align-self:start; }
        .gf-founder-photo img{ display:block; width:100%; aspect-ratio:1/1;
          object-fit:cover; border-radius:14px; background:${C.card2};
          border:1px solid ${C.border2}; }
        .gf-founder-tag{ position:absolute; left:14px; bottom:14px;
          padding:6px 14px; border-radius:20px; background:${C.gold};
          color:#0a0a0a; font-size:10px; font-weight:900; letter-spacing:1.2px;
          text-transform:uppercase; }
        .gf-founder-body{ position:relative; z-index:1; }
        .gf-founder-name{ font-size:30px; font-weight:800; letter-spacing:-1px;
          color:${C.text}; margin:0 0 8px; }
        .gf-founder-role{ font-size:13px; font-weight:700; letter-spacing:.8px;
          text-transform:uppercase; color:${C.gold}; margin-bottom:20px; }
        .gf-founder-bio{ font-size:14.5px; line-height:1.85; color:${C.text2};
          margin:0 0 26px; }
        .gf-founder-bio strong{ color:${C.text}; font-weight:700; }
        .gf-founder-stats{ display:grid; grid-template-columns:repeat(4,1fr);
          gap:20px; padding-top:24px; border-top:1px solid ${C.border}; }
        .gf-fstat .n{ font-family:'JetBrains Mono',monospace; font-size:26px;
          font-weight:800; letter-spacing:-1px; color:${C.gold}; line-height:1; }
        .gf-fstat .l{ font-size:10.5px; font-weight:700; letter-spacing:1px;
          text-transform:uppercase; color:${C.text3}; margin-top:8px; }

        /* feature cards */
        .gf-features{ display:grid; grid-template-columns:repeat(4,1fr);
          gap:16px; margin-top:32px; }
        .gf-feature{ padding:26px 22px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card};
          transition:.24s cubic-bezier(.16,1,.3,1); }
        .gf-feature:hover{ transform:translateY(-4px);
          border-color:${C.goldBorder}; background:${C.card2}; }
        .gf-feature-icon{ width:44px; height:44px; border-radius:11px;
          display:grid; place-items:center; margin-bottom:16px;
          background:${C.goldSoft}; border:1px solid ${C.goldBorder};
          color:${C.gold}; }
        .gf-feature h4{ font-size:15.5px; font-weight:700; color:${C.text};
          margin:0 0 9px; letter-spacing:-.2px; }
        .gf-feature p{ font-size:13px; line-height:1.65; color:${C.text2}; margin:0; }

        /* ---------- services ---------- */
        .gf-services{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .gf-service{ padding:26px 22px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card}; cursor:pointer;
          transition:.24s cubic-bezier(.16,1,.3,1); position:relative; overflow:hidden; }
        .gf-service::before{ content:''; position:absolute; top:0; left:0; right:0;
          height:2px; background:${C.gold}; opacity:0; transition:opacity .25s; }
        .gf-service:hover{ transform:translateY(-4px);
          border-color:${C.goldBorder}; background:${C.card2}; }
        .gf-service:hover::before{ opacity:1; }
        .gf-service-icon{ width:44px; height:44px; border-radius:11px;
          display:grid; place-items:center; margin-bottom:16px;
          background:${C.goldSoft}; border:1px solid ${C.goldBorder};
          color:${C.gold}; }
        .gf-service h3{ font-size:15px; font-weight:700; color:${C.text};
          margin:0 0 9px; letter-spacing:-.2px; }
        .gf-service p{ font-size:12.5px; line-height:1.65; color:${C.text2};
          margin:0 0 16px; min-height:64px; }
        .gf-service-cta{ display:inline-flex; align-items:center; gap:6px;
          font-size:12px; font-weight:800; letter-spacing:.3px; color:${C.gold};
          text-transform:uppercase; }
        .gf-service-cta::after{ content:'→'; transition:transform .2s; }
        .gf-service:hover .gf-service-cta::after{ transform:translateX(4px); }

        /* ---------- markets ---------- */
        .gf-markets{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .gf-market{ padding:28px 24px; border-radius:16px;
          border:1px solid ${C.border}; background:${C.card}; position:relative;
          transition:.24s cubic-bezier(.16,1,.3,1); overflow:hidden; }
        .gf-market::before{ content:''; position:absolute; top:0; left:0; right:0;
          height:3px; background:${C.gold}; opacity:.75; }
        .gf-market:hover{ transform:translateY(-5px); border-color:${C.goldBorder};
          box-shadow:0 20px 44px rgba(0,0,0,.55); }
        .gf-market-top{ display:flex; align-items:center; gap:12px; margin-bottom:18px; }
        .gf-market-logo{ width:48px; height:48px; border-radius:12px;
          display:grid; place-items:center; background:${C.goldSoft};
          border:1px solid ${C.goldBorder}; color:${C.gold};
          font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:800; }
        .gf-market-name{ font-size:17px; font-weight:800; color:${C.text};
          letter-spacing:-.4px; }
        .gf-market-sub{ font-size:11.5px; color:${C.text3}; margin-top:3px; }
        .gf-market-tag{ margin-left:auto; font-size:9.5px; font-weight:800;
          letter-spacing:1px; text-transform:uppercase; padding:5px 10px;
          border-radius:6px; background:${C.goldSoft}; color:${C.gold};
          border:1px solid ${C.goldBorder}; }
        .gf-market-desc{ font-size:13px; line-height:1.65; color:${C.text2};
          margin:0 0 20px; min-height:66px; }
        .gf-market-meta{ display:grid; grid-template-columns:repeat(3,1fr); gap:10px;
          padding-top:16px; border-top:1px solid ${C.border}; }
        .gf-market-meta .k{ font-size:9.5px; font-weight:700; letter-spacing:.9px;
          text-transform:uppercase; color:${C.text3}; }
        .gf-market-meta .v{ font-family:'JetBrains Mono',monospace; font-size:12.5px;
          font-weight:700; color:${C.text}; margin-top:5px; }
        .gf-market-live{ display:flex; align-items:center; justify-content:space-between;
          gap:12px; margin-top:18px; padding-top:16px;
          border-top:1px solid ${C.border}; }
        .gf-market-live .lp{ font-family:'JetBrains Mono',monospace; font-size:15px;
          font-weight:800; color:${C.text}; }
        .gf-market-live .chg{ font-family:'JetBrains Mono',monospace; font-size:11.5px;
          font-weight:700; margin-top:3px; }
        .gf-market-trade{ padding:9px 16px; border-radius:8px; background:${C.gold};
          color:#0a0a0a; font-family:inherit; font-size:12px; font-weight:800;
          border:none; cursor:pointer; letter-spacing:.2px; transition:.2s; }
        .gf-market-trade:hover{ background:${C.gold2}; }

        /* ---------- bots ---------- */
        .gf-bots{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .gf-bot{ padding:26px 22px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card};
          transition:.24s cubic-bezier(.16,1,.3,1); }
        .gf-bot:hover{ transform:translateY(-4px); border-color:${C.goldBorder};
          box-shadow:0 18px 40px rgba(0,0,0,.5); }
        .gf-bot-head{ display:flex; align-items:flex-start; justify-content:space-between;
          gap:10px; margin-bottom:18px; }
        .gf-bot-name{ font-size:15px; font-weight:800; color:${C.text};
          letter-spacing:-.3px; }
        .gf-bot-market{ font-size:11px; color:${C.text3}; margin-top:4px;
          font-family:'JetBrains Mono',monospace; font-weight:600; }
        .gf-bot-live{ font-size:9px; font-weight:800; letter-spacing:1px;
          text-transform:uppercase; padding:5px 9px; border-radius:6px;
          background:rgba(34,197,94,.1); color:${C.green};
          border:1px solid rgba(34,197,94,.28); }
        .gf-bot-live::before{ content:'●'; margin-right:5px; }
        .gf-bot-stats{ display:grid; grid-template-columns:1fr 1fr; gap:10px;
          margin-bottom:16px; }
        .gf-bot-stat{ padding:11px 12px; border-radius:10px; background:${C.bg2};
          border:1px solid ${C.border}; }
        .gf-bot-stat .k{ font-size:9px; font-weight:700; letter-spacing:.9px;
          text-transform:uppercase; color:${C.text3}; }
        .gf-bot-stat .v{ font-family:'JetBrains Mono',monospace; font-size:15px;
          font-weight:800; color:${C.text}; margin-top:5px; }
        .gf-bot-bar{ height:5px; border-radius:4px; overflow:hidden;
          background:${C.border}; margin-bottom:8px; }
        .gf-bot-bar i{ display:block; height:100%; background:${C.gold};
          border-radius:4px; }
        .gf-bot-bar-label{ display:flex; justify-content:space-between;
          font-size:10px; font-weight:700; color:${C.text3};
          text-transform:uppercase; letter-spacing:.7px; margin-bottom:18px; }
        .gf-bot-btn{ width:100%; padding:11px; border-radius:9px;
          background:transparent; border:1.5px solid ${C.goldBorder};
          color:${C.gold}; font-family:inherit; font-size:12px; font-weight:800;
          letter-spacing:.3px; cursor:pointer; transition:.2s; }
        .gf-bot-btn:hover{ background:${C.gold}; color:#0a0a0a;
          border-color:${C.gold}; }

        /* ---------- tools ---------- */
        .gf-tools{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .gf-tool{ padding:32px 28px; border-radius:16px;
          border:1px solid ${C.border}; background:${C.card}; }
        .gf-tool h3{ font-size:18px; font-weight:800; color:${C.text};
          margin:0 0 4px; letter-spacing:-.4px; }
        .gf-tool .hint{ font-size:12px; color:${C.text3}; margin:0 0 22px; }
        .gf-calc-grid{ display:grid; grid-template-columns:1fr 1fr; gap:14px;
          margin-bottom:18px; }
        .gf-field label{ display:block; font-size:10px; font-weight:800;
          letter-spacing:1px; text-transform:uppercase; color:${C.text3};
          margin-bottom:8px; }
        .gf-field input{ width:100%; padding:12px 14px; border-radius:10px;
          background:${C.bg2}; border:1px solid ${C.border2}; color:${C.text};
          font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:700;
          outline:none; transition:.2s; }
        .gf-field input:focus{ border-color:${C.gold};
          box-shadow:0 0 0 3px ${C.goldSoft}; }
        .gf-calc-out{ display:flex; align-items:center; justify-content:space-between;
          gap:16px; padding:20px; border-radius:12px; background:${C.goldSoft};
          border:1px solid ${C.goldBorder}; margin-bottom:16px; }
        .gf-calc-out .k{ font-size:10px; font-weight:800; letter-spacing:1.1px;
          text-transform:uppercase; color:${C.text3}; }
        .gf-calc-out .v{ font-family:'JetBrains Mono',monospace; font-size:30px;
          font-weight:800; letter-spacing:-1px; color:${C.gold}; line-height:1;
          margin-top:4px; }
        .gf-calc-out .s{ font-size:11px; color:${C.text2}; margin-top:4px; }
        .gf-st-row{ display:flex; align-items:center; gap:14px; padding:9px 0; }
        .gf-st-cur{ font-family:'JetBrains Mono',monospace; font-size:12.5px;
          font-weight:800; color:${C.text}; width:40px; letter-spacing:.5px; }
        .gf-st-track{ position:relative; flex:1; height:8px; border-radius:5px;
          background:${C.border}; }
        .gf-st-mid{ position:absolute; left:50%; top:-3px; bottom:-3px; width:1px;
          background:${C.border2}; }
        .gf-st-bar{ position:absolute; top:0; bottom:0; border-radius:5px;
          background:${C.gold}; }
        .gf-st-val{ font-family:'JetBrains Mono',monospace; font-size:12px;
          font-weight:800; min-width:56px; text-align:right; }

        /* ---------- steps ---------- */
        .gf-steps{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .gf-step{ padding:28px 24px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card};
          position:relative; }
        .gf-step .n{ font-family:'JetBrains Mono',monospace; font-size:34px;
          font-weight:900; letter-spacing:-2px; color:${C.gold}; line-height:1;
          margin-bottom:16px; display:block; }
        .gf-step h4{ font-size:14.5px; font-weight:800; color:${C.text};
          margin:0 0 9px; letter-spacing:-.2px; }
        .gf-step p{ font-size:12.5px; line-height:1.65; color:${C.text2};
          margin:0; }

        /* ---------- quote band ---------- */
        .gf-quote{ padding:30px 40px; border-radius:16px;
          border:1px solid ${C.border}; background:${C.card};
          display:flex; align-items:center; gap:22px; }
        .gf-quote-mark{ font-family:Georgia,serif; font-size:56px; line-height:.55;
          color:${C.gold}; opacity:.35; flex-shrink:0; }
        .gf-quote-text{ font-size:17px; font-weight:600; color:${C.text};
          letter-spacing:-.3px; line-height:1.5; }

        /* ---------- testimonials ---------- */
        .gf-testi{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .gf-quote-card{ padding:28px 24px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card}; }
        .gf-quote-card .stars{ display:flex; gap:3px; color:${C.gold};
          margin-bottom:14px; }
        .gf-quote-card p{ font-size:13.5px; line-height:1.75; color:${C.text2};
          margin:0 0 20px; }
        .gf-quote-card .who{ display:flex; align-items:center; gap:12px;
          padding-top:18px; border-top:1px solid ${C.border}; }
        .gf-quote-card .av{ width:38px; height:38px; border-radius:50%;
          display:grid; place-items:center; background:${C.goldSoft};
          border:1px solid ${C.goldBorder}; color:${C.gold};
          font-weight:800; font-size:14px; }
        .gf-quote-card .nm{ font-size:13px; font-weight:800; color:${C.text}; }
        .gf-quote-card .rl{ font-size:11px; color:${C.text3}; margin-top:3px; }

        /* ---------- FAQ ---------- */
        .gf-faq{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .gf-faq details{ border-radius:12px; border:1px solid ${C.border};
          background:${C.card}; overflow:hidden; }
        .gf-faq summary{ list-style:none; cursor:pointer; padding:18px 22px;
          display:flex; align-items:center; gap:12px; font-size:13.5px;
          font-weight:700; color:${C.text}; transition:.2s; }
        .gf-faq summary::-webkit-details-marker{ display:none; }
        .gf-faq summary::after{ content:'+'; margin-left:auto; font-size:20px;
          font-weight:400; color:${C.gold}; transition:transform .22s; }
        .gf-faq details[open] summary::after{ transform:rotate(45deg); }
        .gf-faq summary:hover{ color:${C.gold}; }
        .gf-faq details p{ padding:0 22px 20px; font-size:13px;
          line-height:1.7; color:${C.text2}; margin:0; }

        /* ---------- CTA band ---------- */
        .gf-cta{ position:relative; overflow:hidden; padding:80px 40px;
          border-radius:22px; text-align:center;
          border:1px solid ${C.goldBorder};
          background:radial-gradient(ellipse at 50% 0%, rgba(245,180,0,.16), transparent 62%),
            linear-gradient(180deg, ${C.card} 0%, ${C.bg} 100%); }
        .gf-cta h2{ font-size:38px; font-weight:900; letter-spacing:-1.5px;
          color:${C.text}; margin:0 0 14px; line-height:1.1; }
        .gf-cta h2 .g{ color:${C.gold}; }
        .gf-cta p{ font-size:15px; line-height:1.65; color:${C.text2};
          max-width:560px; margin:0 auto 32px; }
        .gf-cta-row{ display:flex; justify-content:center; gap:14px;
          flex-wrap:wrap; }

        /* ---------- notice ---------- */
        .gf-notice{ display:flex; align-items:flex-start; gap:12px;
          padding:18px 20px; border-radius:12px;
          background:rgba(245,180,0,.05);
          border:1px solid rgba(245,180,0,.18); }
        .gf-notice svg{ width:18px; height:18px; flex-shrink:0; margin-top:1px;
          stroke:${C.gold}; fill:none; stroke-width:1.8;
          stroke-linecap:round; stroke-linejoin:round; }
        .gf-notice span{ font-size:12.5px; line-height:1.65; color:${C.text2}; }

        /* ===================== RESPONSIVE ===================== */
        @media (max-width:1100px){
          .gf-hero h1{ font-size:58px; letter-spacing:-2.2px; }
          .gf-features{ grid-template-columns:repeat(2,1fr); }
          .gf-services{ grid-template-columns:repeat(2,1fr); }
          .gf-bots{ grid-template-columns:repeat(2,1fr); }
          .gf-steps{ grid-template-columns:repeat(2,1fr); }
          .gf-h2{ font-size:34px; letter-spacing:-1.1px; }
        }
        @media (max-width:900px){
          .gf-hero{ padding:70px 0 80px; }
          .gf-hero h1{ font-size:48px; letter-spacing:-1.8px; }
          .gf-hero-lead{ font-size:16.5px; }
          .gf-founder{ grid-template-columns:1fr; gap:30px; padding:30px; }
          .gf-founder-photo{ max-width:320px; }
          .gf-founder-stats{ grid-template-columns:repeat(2,1fr); gap:22px; }
          .gf-markets{ grid-template-columns:1fr; }
          .gf-market-desc{ min-height:0; }
          .gf-tools{ grid-template-columns:1fr; }
          .gf-testi{ grid-template-columns:1fr; }
          .gf-faq{ grid-template-columns:1fr; }
          .gf-sec{ padding:60px 0; }
        }
        @media (max-width:640px){
          .gf-wrap{ padding:0 16px; }
          .gf-hero{ padding:52px 0 60px; }
          .gf-hero h1{ font-size:36px; letter-spacing:-1.3px; line-height:1.08; }
          .gf-hero-lead{ font-size:14.5px; margin-bottom:30px; }
          .gf-hero-cta{ gap:10px; margin-bottom:34px; }
          .gf-btn{ flex:1 1 100%; padding:14px 22px; font-size:13.5px; }
          .gf-hero-trust{ gap:20px; }
          .gf-trust{ font-size:12.5px; }
          .gf-h2{ font-size:26px; letter-spacing:-.8px; }
          .gf-sub{ font-size:13.5px; }
          .gf-sec{ padding:52px 0; }
          .gf-sec-sm{ padding:40px 0; }
          .gf-features{ grid-template-columns:1fr; gap:12px; }
          .gf-feature{ padding:22px 18px; }
          .gf-services{ grid-template-columns:1fr; gap:12px; }
          .gf-service{ padding:22px 18px; }
          .gf-service p{ min-height:0; }
          .gf-bots{ grid-template-columns:1fr; gap:12px; }
          .gf-bot{ padding:22px 18px; }
          .gf-steps{ grid-template-columns:1fr; gap:12px; }
          .gf-step{ padding:22px 18px; }
          .gf-founder{ padding:22px 18px; gap:26px; }
          .gf-founder-photo{ max-width:100%; }
          .gf-founder-name{ font-size:24px; }
          .gf-founder-bio{ font-size:13.5px; }
          .gf-founder-stats{ grid-template-columns:1fr 1fr; gap:18px; }
          .gf-fstat .n{ font-size:22px; }
          .gf-quote{ padding:22px 22px; gap:14px; flex-direction:column;
            align-items:flex-start; }
          .gf-quote-mark{ font-size:40px; }
          .gf-quote-text{ font-size:14.5px; }
          .gf-quote-card{ padding:22px 18px; }
          .gf-calc-grid{ grid-template-columns:1fr; }
          .gf-calc-out .v{ font-size:24px; }
          .gf-tool{ padding:22px 18px; }
          .gf-cta{ padding:52px 22px; border-radius:18px; }
          .gf-cta h2{ font-size:26px; letter-spacing:-1px; }
          .gf-cta p{ font-size:13.5px; }
          .gf-faq summary{ font-size:12.5px; padding:15px 18px; }
          .gf-faq details p{ padding:0 18px 17px; font-size:12.5px; }
          .gf-tick{ padding:13px 18px; }
        }
      `}</style>

      <section className="gf">

        {/* =========================================================
            HERO — "Master Forex Trading with Tonnyfx"
           ========================================================= */}
        <div className="gf-hero">
          {/* decorative candlestick chart */}
          <div className="gf-hero-candles">
            <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="candleGreen" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(34,197,94,.35)" />
                  <stop offset="100%" stopColor="rgba(34,197,94,0)" />
                </linearGradient>
                <linearGradient id="candleRed" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(239,68,68,.32)" />
                  <stop offset="100%" stopColor="rgba(239,68,68,0)" />
                </linearGradient>
              </defs>
              {Array.from({ length: 60 }).map((_, i) => {
                const x = 40 + i * 20;
                const h = 40 + Math.abs(Math.sin(i * 1.3)) * 180;
                const y = 300 - h / 2 + Math.cos(i * 0.9) * 40;
                const up = Math.sin(i * 1.7) > 0;
                return (
                  <g key={i}>
                    <line x1={x} y1={y - 30} x2={x} y2={y + h + 30}
                      stroke={up ? 'rgba(34,197,94,.35)' : 'rgba(239,68,68,.32)'}
                      strokeWidth="1" />
                    <rect x={x - 5} y={y} width="10" height={h} rx="1"
                      fill={up ? 'url(#candleGreen)' : 'url(#candleRed)'} />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="gf-hero-inner">
            <h1>
              Master Forex Trading<br />
              with <span className="g">Tonnyfx</span>
            </h1>
            <p className="gf-hero-lead">
              Learn, trade and grow with proven strategies and real results.
              MyTradeApp is the terminal I built for EUR/USD, BTC/USD and XAU/USD —
              bots, calculators and risk tools in one place.
            </p>

            <div className="gf-hero-cta">
              <button className="gf-btn gf-btn-gold" onClick={() => go('bots')}>
                Join MyTradeApp
                <Icon name="arrow" size={16} />
              </button>
              <button className="gf-btn gf-btn-outline" onClick={() => go('lot')}>
                Create Trading Account
              </button>
            </div>

            <div className="gf-hero-trust">
              <span className="gf-trust"><Icon name="users" size={17} /> 3,200+ Traders</span>
              <span className="gf-trust"><Icon name="shield" size={17} /> Verified Results</span>
              <span className="gf-trust"><Icon name="phone" size={17} /> 24/7 Support</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            LIVE TICKER STRIP
           ========================================================= */}
        <div className="gf-ticker">
          <div className="gf-ticker-track">
            {[0, 1].map((dup) =>
              WATCHLIST.map((sym) => {
                const price = priceOf(sym);
                const chg = changeOf(sym);
                const up = chg >= 0;
                return (
                  <div className="gf-tick" key={`${dup}-${sym}`}>
                    <span className="s">{sym.slice(0, 3)}/{sym.slice(3, 6)}</span>
                    <span className="p">{price ? fmtPrice(sym, price) : '—'}</span>
                    <span className={`c ${up ? 'pos' : 'neg'}`}>
                      {up ? '▲' : '▼'} {fmt(Math.abs(chg), 2)}%
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =========================================================
            ABOUT — About MyTradeApp
           ========================================================= */}
        <div className="gf-sec">
          <div className="gf-wrap">
            <div className="gf-about-head">
              <div className="gf-eyebrow" style={{ display:'inline-flex' }}>About</div>
              <h2 className="gf-h2">About <span className="g">MyTradeApp</span></h2>
              <p className="gf-sub">
                MyTradeApp is a results-driven forex automation & trading tools brand by Tonnyfx,
                helping traders from beginner to advanced become consistently profitable.
                We combine structured bots, live market analysis and a thriving community.
              </p>
            </div>

            {/* FOUNDER CARD with photo */}
            <div className="gf-founder">
              <div className="gf-founder-photo">
                <img src={tonnyPhoto} alt="Tonny — founder of MyTradeApp" loading="lazy" />
                <span className="gf-founder-tag">Founder</span>
              </div>
              <div className="gf-founder-body">
                <h3 className="gf-founder-name">Tonny (Tonnyfx)</h3>
                <div className="gf-founder-role">Forex Trader · Mentor · Founder</div>
                <p className="gf-founder-bio">
                  Tonny is a full-time forex trader, mentor and the founder of MyTradeApp,
                  with <strong>over 10 years of experience</strong> in the financial markets.
                  Known for his practical, no-hype approach to trading, he focuses on helping
                  traders develop discipline, consistency and profitable habits through
                  mentorship and real market execution. He trades three instruments only —{' '}
                  <strong>EUR/USD, BTC/USD and XAU/USD</strong> — and every tool inside
                  MyTradeApp reflects that focus.
                </p>
                <div className="gf-founder-stats">
                  {STATS.map((s) => (
                    <div className="gf-fstat" key={s.l}>
                      <div className="n">{s.n}</div>
                      <div className="l">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FEATURES */}
            <div className="gf-features">
              {FEATURES.map((f) => (
                <div className="gf-feature" key={f.title}>
                  <div className="gf-feature-icon"><Icon name={f.icon} /></div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            QUOTE ROTATOR
           ========================================================= */}
        <div className="gf-wrap gf-sec-sm">
          <div className="gf-quote">
            <div className="gf-quote-mark">“</div>
            <div className="gf-quote-text">
              {[
                'Discipline beats prediction every single time.',
                'The market pays patience, not activity.',
                'Amateurs chase trades. Professionals size them.',
                'Consistency compounds — recklessness compounds faster.',
              ][quoteIdx]}
            </div>
          </div>
        </div>

        {/* =========================================================
            SERVICES
           ========================================================= */}
        <div className="gf-sec" style={{ background:C.bg2 }}>
          <div className="gf-wrap">
            <div className="gf-about-head">
              <div className="gf-eyebrow" style={{ display:'inline-flex' }}>Our Services</div>
              <h2 className="gf-h2">What <span className="g">MyTradeApp</span> provides</h2>
              <p className="gf-sub">
                Choose the service that fits your trading journey — from free tools
                to fully automated bots and 1-on-1 coaching.
              </p>
            </div>
            <div className="gf-services">
              {SERVICES.map((s) => (
                <div className="gf-service" key={s.key}
                  onClick={() => go(s.key)} role="button" tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') go(s.key); }}>
                  <div className="gf-service-icon">
                    <Icon name={
                      s.key === 'bots' ? 'bot' :
                      s.key === 'lot' ? 'calc' :
                      s.key === 'strength' ? 'bars' :
                      s.key === 'signals' ? 'bell' :
                      s.key === 'risk' ? 'shield' :
                      s.key === 'journal' ? 'journal' :
                      s.key === 'backtest' ? 'flask' : 'user'
                    } />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="gf-service-cta">{s.cta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            MARKETS
           ========================================================= */}
        <div className="gf-sec">
          <div className="gf-wrap">
            <div className="gf-about-head">
              <div className="gf-eyebrow" style={{ display:'inline-flex' }}>Markets</div>
              <h2 className="gf-h2">Three instruments. <span className="g">Total mastery.</span></h2>
              <p className="gf-sub">
                We deliberately trade a tiny universe so every bot, every calculator
                and every risk rule is tuned to the exact behaviour of that market.
              </p>
            </div>
            <div className="gf-markets">
              {MARKETS.map((m) => {
                const price = priceOf(m.sym);
                const chg = changeOf(m.sym);
                const up = chg >= 0;
                const hist = pairs?.[m.sym]?.history || [];
                return (
                  <div className="gf-market" key={m.sym}>
                    <div className="gf-market-top">
                      <div className="gf-market-logo">{m.label.split('/')[0]}</div>
                      <div>
                        <div className="gf-market-name">{m.label}</div>
                        <div className="gf-market-sub">{m.name}</div>
                      </div>
                      <span className="gf-market-tag">{m.tag}</span>
                    </div>
                    <p className="gf-market-desc">{m.desc}</p>
                    <div className="gf-market-meta">
                      <div><div className="k">Spread</div><div className="v">{m.spread}</div></div>
                      <div><div className="k">ATR (D1)</div><div className="v">{m.atr}</div></div>
                      <div><div className="k">Volatility</div><div className="v">{m.vol}</div></div>
                    </div>
                    <div className="gf-market-live">
                      <div>
                        <div className="lp">{price ? fmtPrice(m.sym, price) : '—'}</div>
                        <div className={`chg ${up ? 'pos' : 'neg'}`}>
                          {up ? '+' : ''}{fmt(chg, 2)}% today
                        </div>
                      </div>
                      {hist.length > 1 && (
                        <Sparkline values={hist} w={90} h={30}
                          color={up ? C.green : C.red} />
                      )}
                      <button className="gf-market-trade"
                        onClick={() => onTrade && onTrade(m.sym)}>
                        Trade
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================
            TRADING BOTS
           ========================================================= */}
        <div className="gf-sec" style={{ background:C.bg2 }}>
          <div className="gf-wrap">
            <div className="gf-about-head">
              <div className="gf-eyebrow" style={{ display:'inline-flex' }}>Automation</div>
              <h2 className="gf-h2">Trading bots, tuned <span className="g">one market each</span></h2>
              <p className="gf-sub">
                Every strategy is built for a single instrument. No generic multi-asset logic —
                just focused systems with transparent performance.
              </p>
            </div>
            <div className="gf-bots">
              {BOTS.map((b) => (
                <div className="gf-bot" key={b.name}>
                  <div className="gf-bot-head">
                    <div>
                      <div className="gf-bot-name">{b.name}</div>
                      <div className="gf-bot-market">{b.market} · {b.tf}</div>
                    </div>
                    {b.live && <span className="gf-bot-live">Live</span>}
                  </div>
                  <div className="gf-bot-stats">
                    <div className="gf-bot-stat">
                      <div className="k">Win rate</div>
                      <div className="v pos">{b.win}%</div>
                    </div>
                    <div className="gf-bot-stat">
                      <div className="k">Trades</div>
                      <div className="v">{b.trades}</div>
                    </div>
                    <div className="gf-bot-stat">
                      <div className="k">Max DD</div>
                      <div className="v neg">{b.dd}</div>
                    </div>
                    <div className="gf-bot-stat">
                      <div className="k">Profit factor</div>
                      <div className="v">{b.pf}</div>
                    </div>
                  </div>
                  <div className="gf-bot-bar"><i style={{ width: `${b.win}%` }} /></div>
                  <div className="gf-bot-bar-label">
                    <span>Performance</span>
                    <span>{b.win}/100</span>
                  </div>
                  <button className="gf-bot-btn" onClick={() => go('bots')}>
                    Configure this bot
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            FREE TOOLS
           ========================================================= */}
        <div className="gf-sec">
          <div className="gf-wrap">
            <div className="gf-about-head">
              <div className="gf-eyebrow" style={{ display:'inline-flex' }}>Free Tools</div>
              <h2 className="gf-h2">Size every trade. <span className="g">Read every currency.</span></h2>
              <p className="gf-sub">Two tools that do more for your account than any indicator ever will.</p>
            </div>
            <div className="gf-tools">
              {/* calculator */}
              <div className="gf-tool">
                <h3>Lot Size Calculator</h3>
                <p className="hint">EUR/USD standard lot · pip value $10</p>
                <div className="gf-calc-grid">
                  <div className="gf-field">
                    <label htmlFor="gf-bal">Account balance ($)</label>
                    <input id="gf-bal" type="number" min="0"
                      value={calc.bal}
                      onChange={(e) => setCalc({ ...calc, bal: e.target.value })} />
                  </div>
                  <div className="gf-field">
                    <label htmlFor="gf-risk">Risk per trade (%)</label>
                    <input id="gf-risk" type="number" min="0" step="0.1"
                      value={calc.risk}
                      onChange={(e) => setCalc({ ...calc, risk: e.target.value })} />
                  </div>
                  <div className="gf-field" style={{ gridColumn:'1 / -1' }}>
                    <label htmlFor="gf-sl">Stop-loss (pips)</label>
                    <input id="gf-sl" type="number" min="1"
                      value={calc.sl}
                      onChange={(e) => setCalc({ ...calc, sl: e.target.value })} />
                  </div>
                </div>
                <div className="gf-calc-out">
                  <div>
                    <div className="k">Position size</div>
                    <div className="v">{fmt(lots, 2)}</div>
                    <div className="s">standard lots</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div className="k">Risk amount</div>
                    <div style={{ fontFamily:"'JetBrains Mono', monospace",
                      fontSize:18, fontWeight:800, color:C.text, marginTop:4 }}>
                      {fmtMoney(riskAmount)}
                    </div>
                  </div>
                </div>
                <button className="gf-btn gf-btn-gold" style={{ width:'100%' }}
                  onClick={() => go('lot')}>
                  Open full calculator <Icon name="arrow" size={15} />
                </button>
              </div>

              {/* strength meter */}
              <div className="gf-tool">
                <h3>Currency Strength Meter</h3>
                <p className="hint">Eight majors vs a weighted basket · live</p>
                <div style={{ padding:'4px 0 20px' }}>
                  {pick.map((curr) => {
                    const v = st[curr] || 0;
                    const w = (Math.abs(v) / maxAbs) * 50;
                    const pos = v >= 0;
                    return (
                      <div className="gf-st-row" key={curr}>
                        <div className="gf-st-cur">{curr}</div>
                        <div className="gf-st-track">
                          <div className="gf-st-mid" />
                          <div className="gf-st-bar"
                            style={pos
                              ? { left:'50%', width:`${w}%`, background:C.gold }
                              : { right:'50%', width:`${w}%`, background:C.red }} />
                        </div>
                        <div className={`gf-st-val ${pos ? 'pos' : 'neg'}`}>
                          {pos ? '+' : ''}{fmt(v, 2)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="gf-btn gf-btn-gold" style={{ width:'100%' }}
                  onClick={() => go('strength')}>
                  Open Strength Meter <Icon name="arrow" size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            HOW IT WORKS
           ========================================================= */}
        <div className="gf-sec" style={{ background:C.bg2 }}>
          <div className="gf-wrap">
            <div className="gf-about-head">
              <div className="gf-eyebrow" style={{ display:'inline-flex' }}>How it works</div>
              <h2 className="gf-h2">From sign-up to <span className="g">automated</span> in four steps</h2>
            </div>
            <div className="gf-steps">
              {[
                { n:'01', t:'Create your account', d:'Sign up in under a minute. No broker lock-in — connect any supported MT4/MT5 or crypto venue.' },
                { n:'02', t:'Size your risk', d:'Run the lot size calculator, set your risk %, and let the risk manager cap your daily exposure.' },
                { n:'03', t:'Switch on a bot', d:'Pick a strategy for EUR/USD, BTC/USD or XAU/USD and let it execute while you watch the equity curve.' },
                { n:'04', t:'Review & refine', d:'Every trade lands in your journal with expectancy stats, so next week is sharper than the last.' },
              ].map((s) => (
                <div className="gf-step" key={s.n}>
                  <span className="n">{s.n}</span>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            TESTIMONIALS
           ========================================================= */}
        <div className="gf-sec">
          <div className="gf-wrap">
            <div className="gf-about-head">
              <div className="gf-eyebrow" style={{ display:'inline-flex' }}>Feedback</div>
              <h2 className="gf-h2">What the <span className="g">community</span> says</h2>
            </div>
            <div className="gf-testi">
              {TESTIMONIALS.map((t) => (
                <div className="gf-quote-card" key={t.n}>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={14} />)}
                  </div>
                  <p>“{t.q}”</p>
                  <div className="who">
                    <div className="av">{t.n.charAt(0)}</div>
                    <div>
                      <div className="nm">{t.n}</div>
                      <div className="rl">{t.r}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            FAQ
           ========================================================= */}
        <div className="gf-sec" style={{ background:C.bg2 }}>
          <div className="gf-wrap">
            <div className="gf-about-head">
              <div className="gf-eyebrow" style={{ display:'inline-flex' }}>FAQ</div>
              <h2 className="gf-h2">Questions traders <span className="g">ask first</span></h2>
            </div>
            <div className="gf-faq">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            FINAL CTA
           ========================================================= */}
        <div className="gf-wrap gf-sec">
          <div className="gf-cta">
            <h2>Ready to trade with <span className="g">an edge</span>?</h2>
            <p>
              Start with the free tools, then let a bot handle the execution. No broker lock-in,
              no hidden promises — just a better way to trade EUR/USD, BTC/USD and XAU/USD.
            </p>
            <div className="gf-cta-row">
              <button className="gf-btn gf-btn-gold" onClick={() => go('bots')}>
                Join MyTradeApp <Icon name="arrow" size={16} />
              </button>
              <button className="gf-btn gf-btn-outline" onClick={() => go('strength')}>
                Check Currency Strength
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            NOTICE
           ========================================================= */}
        <div className="gf-wrap" style={{ paddingBottom:60 }}>
          <div className="gf-notice">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8h.01M11 12h1v4h1" />
            </svg>
            <span>
              MyTradeApp is a third-party analytics and automation platform created by Tonny
              (Tonnyfx) — not a broker or investment advisor. All performance figures shown are
              simulated and for illustration only. Trading forex, crypto and metals carries
              significant risk of loss. Never risk capital you cannot afford to lose.
            </span>
          </div>
        </div>

      </section>
    </>
  );
}