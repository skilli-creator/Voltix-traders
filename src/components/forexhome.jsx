// src/components/forexhome.jsx
import { useState } from 'react';
import { useTheme } from 'styled-components';
import {
  CURRENCIES, CUR_NAMES, WATCHLIST,
  fmt, fmtMoney, fmtPrice,
  currencyStrength, Sparkline,
} from '../pages/forexdash';

/* ------------------------------------------------------------------ */
/*  STATIC CONTENT                                                     */
/* ------------------------------------------------------------------ */

const MARKETS = [
  {
    sym: 'EURUSD',
    label: 'EUR/USD',
    name: 'Euro / US Dollar',
    tag: 'Major',
    desc: 'The world’s most liquid pair. Tight spreads, deep liquidity and clean London/New York session trends.',
    spread: '0.4 pips',
    session: 'London · New York',
    vol: 'Medium',
    accent: '#3b82f6',
  },
  {
    sym: 'BTCUSD',
    label: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    tag: 'Crypto',
    desc: '24/7 volatility with huge intraday ranges. Ideal for momentum and breakout automation.',
    spread: '$12',
    session: '24 / 7',
    vol: 'High',
    accent: '#f5a524',
  },
  {
    sym: 'XAUUSD',
    label: 'XAU/USD',
    name: 'Gold / US Dollar',
    tag: 'Metal',
    desc: 'The classic safe-haven. Strong directional runs during risk-off flows and US data releases.',
    spread: '18 pts',
    session: 'London · New York',
    vol: 'High',
    accent: '#00d68f',
  },
];

const SERVICES = [
  {
    key: 'bots',
    title: 'Automated Trading Bots',
    desc: 'Five pre-built, broker-agnostic strategies tuned exclusively for EUR/USD, BTC/USD and XAU/USD. Toggle on, track live P/L.',
    cta: 'Manage bots',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="7.5" width="17" height="12" rx="3.5" />
        <path d="M12 7.5V4" />
        <circle cx="12" cy="3.4" r="1" />
        <path d="M9 13h.01M15 13h.01" />
        <path d="M9.5 16.5h5" />
      </svg>
    ),
  },
  {
    key: 'lot',
    title: 'Lot Size Calculator',
    desc: 'Risk-based position sizing on every instrument. Enter balance, risk % and stop-loss — get the exact lot size instantly.',
    cta: 'Calculate size',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2.5" />
        <path d="M8 7.5h8" />
        <path d="M8 12h1.5M12 12h1.5M16 12h.01M8 16h1.5M12 16h1.5M16 16h.01" />
      </svg>
    ),
  },
  {
    key: 'strength',
    title: 'Currency Strength Meter',
    desc: 'Rank the eight majors against a weighted basket and spot the strongest / weakest pairs at a single glance.',
    cta: 'View strength',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 20v-8" />
        <path d="M12 20V4" />
        <path d="M19 20v-5" />
      </svg>
    ),
  },
  {
    key: 'signals',
    title: 'Live Signal Alerts',
    desc: 'Momentum, breakout and mean-reversion alerts delivered the moment price structure shifts on your watchlist.',
    cta: 'See alerts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 01-3.4 0" />
      </svg>
    ),
  },
  {
    key: 'risk',
    title: 'Risk & Margin Manager',
    desc: 'Real-time margin level, free margin and exposure warnings so you never blow an account on one bad trade.',
    cta: 'Review risk',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: 'journal',
    title: 'Trade Journal & Analytics',
    desc: 'Every fill, every pip. Win rate, expectancy, drawdown and equity curve — logged automatically for review.',
    cta: 'Open journal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
        <path d="M8 8h7M8 12h7M8 16h4" />
      </svg>
    ),
  },
];

const BOTS = [
  {
    name: 'Tonny Scalper',
    market: 'EUR/USD',
    tf: 'M5',
    win: 68,
    trades: 1243,
    dd: '4.2%',
    risk: 'Low',
    tag: 'Scalping',
  },
  {
    name: 'Momentum Rider',
    market: 'BTC/USD',
    tf: 'H1',
    win: 61,
    trades: 486,
    dd: '9.8%',
    risk: 'Medium',
    tag: 'Trend',
  },
  {
    name: 'Gold Reversal',
    market: 'XAU/USD',
    tf: 'M30',
    win: 57,
    trades: 712,
    dd: '11.4%',
    risk: 'High',
    tag: 'Mean reversion',
  },
];

const STEPS = [
  {
    n: '01',
    t: 'Create your account',
    d: 'Sign up in under a minute. No broker lock-in — connect any supported MT4/MT5 or crypto venue.',
  },
  {
    n: '02',
    t: 'Size your risk',
    d: 'Run the lot size calculator, set your risk %, and let the risk manager cap your daily exposure.',
  },
  {
    n: '03',
    t: 'Switch on a bot',
    d: 'Pick a strategy for EUR/USD, BTC/USD or XAU/USD and let it execute while you watch the equity curve.',
  },
  {
    n: '04',
    t: 'Review & refine',
    d: 'Every trade lands in your journal with expectancy stats, so the next week is sharper than the last.',
  },
];

const TESTIMONIALS = [
  {
    q: 'The lot size calculator alone saved my account. I stopped guessing and started sizing properly — drawdown dropped by half.',
    n: 'Daniel M.',
    r: 'Swing trader · EUR/USD',
  },
  {
    q: 'I run the Gold Reversal bot overnight and the Momentum Rider during US hours. Clean execution, no drama, clear reporting.',
    n: 'Priya S.',
    r: 'Part-time trader · XAU/USD',
  },
  {
    q: 'The strength meter tells me in two seconds whether I should be long or short the dollar. That one screen changed my bias.',
    n: 'Kwame A.',
    r: 'Day trader · Majors',
  },
];

const FAQS = [
  {
    q: 'Is Tonnyfx a broker?',
    a: 'No. Tonnyfx is a third-party analytics and automation layer. You keep your own broker account and we simply give you the tools — bots, calculators, strength data — to trade it better.',
  },
  {
    q: 'Which instruments do the bots trade?',
    a: 'Our production bots trade three instruments only: EUR/USD, BTC/USD and XAU/USD. Focusing on a small set lets us tune each strategy far more precisely than a generic multi-asset bot.',
  },
  {
    q: 'Do I need coding experience?',
    a: 'None at all. Every bot is pre-built and configurable from the dashboard. If you can toggle a switch and type a risk percentage, you can run it.',
  },
  {
    q: 'How is risk handled?',
    a: 'Every position is sized from your account balance and a stop-loss distance. The risk manager enforces a maximum daily loss and warns you before margin level becomes dangerous.',
  },
  {
    q: 'Can I run bots and manual trades together?',
    a: 'Yes. Manual positions and bot positions sit in the same book, and the dashboard aggregates P/L, margin and exposure across both.',
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function ForexHome({
  pairs,
  positions = [],
  account,
  equityHistory = [],
  strength,
  onTrade,
  onClosePosition,
  onViewChange,
}) {
  const theme = useTheme();
  const c = theme?.colors || {};

  const go = (k) => onViewChange && onViewChange(k);

  /* ---------- live data helpers ---------- */
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

  /* ---------- mini lot-size calculator ---------- */
  const [calc, setCalc] = useState({ bal: 10000, risk: 1, sl: 25 });
  const riskAmount = (Number(calc.bal) * Number(calc.risk)) / 100;
  const lots = calc.sl > 0 ? riskAmount / (Number(calc.sl) * 10) : 0;

  return (
    <>
      <style>{`
        /* ============================================================
           TONNYFX HOME — scoped styles
           ============================================================ */
        .tf-home{ display:flex; flex-direction:column; gap:26px; }

        .tf-card{
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'} 0%, ${c.surface || '#0d1524'} 100%);
          border:1px solid ${c.border || '#16223a'};
          border-radius:16px;
        }

        /* ---------- shared section head ---------- */
        .tf-sec-head{
          display:flex; align-items:flex-end; justify-content:space-between;
          gap:16px; flex-wrap:wrap; margin-bottom:16px;
        }
        .tf-eyebrow{
          display:inline-flex; align-items:center; gap:7px;
          font-size:10.5px; font-weight:700; letter-spacing:1.4px;
          text-transform:uppercase; color:${c.accent || '#00d68f'};
          margin-bottom:8px;
        }
        .tf-eyebrow::before{
          content:''; width:18px; height:1px;
          background:${c.accent || '#00d68f'}; opacity:.7;
        }
        .tf-sec-head h2{
          font-size:23px; font-weight:800; letter-spacing:-.7px;
          color:${c.text || '#e8eefb'}; line-height:1.2;
        }
        .tf-sec-head p{
          font-size:13px; color:${c.textSecondary || '#7d90b0'};
          margin-top:6px; max-width:560px; line-height:1.55;
        }
        .tf-sec-count{
          font-size:11px; font-weight:600; letter-spacing:1px;
          text-transform:uppercase; color:${c.textMuted || '#5a6b88'};
          white-space:nowrap;
        }

        /* ============================================================
           1. HERO
           ============================================================ */
        .tf-hero{
          position:relative; overflow:hidden;
          padding:44px 36px;
          border-radius:20px;
          border:1px solid ${c.glassBorder || 'rgba(255,255,255,.08)'};
          background:
            radial-gradient(ellipse at 0% 0%, ${c.accentLight || 'rgba(0,214,143,.16)'}, transparent 55%),
            radial-gradient(ellipse at 100% 100%, ${c.accentLight || 'rgba(59,130,246,.14)'}, transparent 55%),
            linear-gradient(180deg, ${c.surfaceElevated || '#0c1523'} 0%, ${c.bg || '#0a121e'} 100%);
        }
        .tf-hero::before{
          content:''; position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(${c.text}06 1px, transparent 1px),
            linear-gradient(90deg, ${c.text}06 1px, transparent 1px);
          background-size:44px 44px;
          mask-image:radial-gradient(ellipse at 30% 40%, black, transparent 78%);
          -webkit-mask-image:radial-gradient(ellipse at 30% 40%, black, transparent 78%);
        }
        .tf-hero-inner{
          position:relative; z-index:1;
          display:grid; grid-template-columns:1.12fr .88fr;
          gap:38px; align-items:center;
        }

        .tf-badge{
          display:inline-flex; align-items:center; gap:8px;
          padding:6px 13px; border-radius:20px;
          background:${c.accentLight || 'rgba(0,214,143,.12)'};
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.28)'};
          color:${c.accent || '#00d68f'};
          font-size:10.5px; font-weight:700; letter-spacing:1.3px;
          text-transform:uppercase; margin-bottom:18px;
        }
        .tf-badge .tf-dot-live{
          width:6px; height:6px; border-radius:50%;
          background:${c.accent || '#00d68f'};
          animation:tfPulse 2s infinite;
        }
        @keyframes tfPulse{
          0%{ box-shadow:0 0 0 0 ${c.accentMuted || 'rgba(0,214,143,.75)'}; }
          70%{ box-shadow:0 0 0 9px transparent; }
          100%{ box-shadow:0 0 0 0 transparent; }
        }

        .tf-hero h1{
          font-size:44px; line-height:1.08; font-weight:800;
          letter-spacing:-1.8px; color:${c.text || '#e8eefb'};
          margin-bottom:16px; max-width:640px;
        }
        .tf-hero h1 .tf-grad{
          background:linear-gradient(100deg, ${c.accent || '#00d68f'} 0%, ${c.accentHover || '#3b82f6'} 100%);
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
        }
        .tf-hero-lead{
          font-size:15px; line-height:1.65;
          color:${c.textSecondary || '#7d90b0'};
          max-width:560px; margin-bottom:26px;
        }

        .tf-hero-actions{ display:flex; flex-wrap:wrap; gap:12px; margin-bottom:30px; }
        .tf-btn{
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 22px; border-radius:11px; border:none;
          font-size:13.5px; font-weight:700; letter-spacing:.2px;
          cursor:pointer; transition:.2s cubic-bezier(.16,1,.3,1);
          font-family:inherit;
        }
        .tf-btn-primary{
          background:linear-gradient(135deg, ${c.accent || '#00d68f'}, ${c.accentHover || '#3b82f6'});
          color:#04121c;
          box-shadow:0 10px 26px ${c.accentLight || 'rgba(0,214,143,.28)'};
        }
        .tf-btn-primary:hover{ transform:translateY(-2px); box-shadow:0 16px 34px ${c.accentLight || 'rgba(0,214,143,.36)'}; }
        .tf-btn-ghost{
          background:transparent;
          border:1px solid ${c.border || 'rgba(255,255,255,.12)'};
          color:${c.text || '#e8eefb'};
        }
        .tf-btn-ghost:hover{
          border-color:${c.accentMuted || 'rgba(0,214,143,.4)'};
          color:${c.accent || '#00d68f'};
          transform:translateY(-2px);
        }

        .tf-hero-stats{
          display:flex; flex-wrap:wrap; gap:26px 42px;
          padding-top:22px;
          border-top:1px solid ${c.border || 'rgba(255,255,255,.07)'};
        }
        .tf-hero-stat .n{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:23px; font-weight:700; letter-spacing:-.8px;
          color:${c.text || '#e8eefb'}; line-height:1;
        }
        .tf-hero-stat .n span{ color:${c.accent || '#00d68f'}; }
        .tf-hero-stat .l{
          font-size:10.5px; font-weight:600; letter-spacing:.9px;
          text-transform:uppercase; color:${c.textMuted || '#5a6b88'};
          margin-top:6px;
        }

        /* ---------- hero terminal visual ---------- */
        .tf-visual{ position:relative; }
        .tf-terminal{
          border-radius:16px; overflow:hidden;
          border:1px solid ${c.border || 'rgba(255,255,255,.1)'};
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.surface || '#0b1320'});
          box-shadow:0 26px 60px rgba(0,0,0,.45);
        }
        .tf-term-head{
          display:flex; align-items:center; gap:6px;
          padding:11px 14px;
          border-bottom:1px solid ${c.border || 'rgba(255,255,255,.07)'};
          background:${c.surface || 'rgba(255,255,255,.02)'};
        }
        .tf-term-head .d{
          width:8px; height:8px; border-radius:50%;
          background:${c.border || 'rgba(255,255,255,.15)'};
        }
        .tf-term-head .d.a{ background:${c.danger || '#ff4d6a'}; opacity:.7; }
        .tf-term-head .d.b{ background:${c.warning || '#f5a524'}; opacity:.7; }
        .tf-term-head .d.c{ background:${c.success || '#00d68f'}; opacity:.7; }
        .tf-term-title{
          margin-left:auto; font-size:9.5px; font-weight:700;
          letter-spacing:1.4px; text-transform:uppercase;
          color:${c.textMuted || '#5a6b88'};
        }

        .tf-term-row{
          display:flex; align-items:center; gap:12px;
          padding:13px 15px;
          border-bottom:1px solid ${c.border || 'rgba(255,255,255,.05)'};
        }
        .tf-term-row:last-of-type{ border-bottom:none; }
        .tf-term-sym{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:12px; font-weight:700; letter-spacing:.3px;
          color:${c.text || '#e8eefb'}; min-width:74px;
        }
        .tf-term-tag{
          font-size:9px; font-weight:700; letter-spacing:.8px;
          text-transform:uppercase; padding:3px 7px; border-radius:5px;
          background:${c.accentLight || 'rgba(0,214,143,.1)'};
          color:${c.accent || '#00d68f'};
        }
        .tf-term-price{
          margin-left:auto;
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:13px; font-weight:700; color:${c.text || '#e8eefb'};
        }
        .tf-term-chg{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:11.5px; font-weight:700; min-width:58px; text-align:right;
        }
        .tf-pos{ color:${c.success || '#00d68f'}; }
        .tf-neg{ color:${c.danger || '#ff4d6a'}; }

        .tf-term-foot{
          display:flex; align-items:center; justify-content:space-between;
          padding:12px 15px;
          background:${c.accentLight || 'rgba(0,214,143,.05)'};
          border-top:1px solid ${c.border || 'rgba(255,255,255,.06)'};
        }
        .tf-term-foot .k{
          font-size:10px; letter-spacing:1px; text-transform:uppercase;
          color:${c.textMuted || '#5a6b88'}; font-weight:600;
        }
        .tf-term-foot .v{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:14px; font-weight:700; color:${c.text || '#e8eefb'};
        }

        .tf-float{
          position:absolute; z-index:2;
          padding:10px 14px; border-radius:12px;
          background:${c.surfaceElevated || '#0f1829'};
          border:1px solid ${c.border || 'rgba(255,255,255,.1)'};
          box-shadow:0 16px 38px rgba(0,0,0,.5);
          backdrop-filter:blur(8px);
        }
        .tf-float .t{
          font-size:9.5px; font-weight:700; letter-spacing:1px;
          text-transform:uppercase; color:${c.textMuted || '#5a6b88'};
        }
        .tf-float .v{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:15px; font-weight:700; margin-top:3px;
          color:${c.text || '#e8eefb'};
        }
        .tf-float-a{ top:-14px; right:-10px; animation:tfFloat 5s ease-in-out infinite; }
        .tf-float-b{ bottom:-16px; left:-14px; animation:tfFloat 6.5s ease-in-out infinite reverse; }
        @keyframes tfFloat{
          0%,100%{ transform:translateY(0); }
          50%{ transform:translateY(-9px); }
        }

        /* ============================================================
           2. TICKER MARQUEE
           ============================================================ */
        .tf-marquee{
          overflow:hidden; position:relative;
          border-radius:13px;
          border:1px solid ${c.border || '#16223a'};
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.surface || '#0d1524'});
          mask-image:linear-gradient(90deg, transparent, black 7%, black 93%, transparent);
          -webkit-mask-image:linear-gradient(90deg, transparent, black 7%, black 93%, transparent);
        }
        .tf-marquee-track{
          display:flex; width:max-content;
          animation:tfScroll 38s linear infinite;
        }
        .tf-marquee:hover .tf-marquee-track{ animation-play-state:paused; }
        @keyframes tfScroll{
          from{ transform:translateX(0); }
          to{ transform:translateX(-50%); }
        }
        .tf-tick{
          display:flex; align-items:center; gap:9px;
          padding:13px 22px;
          border-right:1px solid ${c.border || 'rgba(255,255,255,.05)'};
          white-space:nowrap;
        }
        .tf-tick .s{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:11.5px; font-weight:700; letter-spacing:.5px;
          color:${c.textSecondary || '#7d90b0'};
        }
        .tf-tick .p{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:12px; font-weight:700; color:${c.text || '#e8eefb'};
        }
        .tf-tick .c{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:11px; font-weight:700;
        }

        /* ============================================================
           3. MARKETS WE TRADE
           ============================================================ */
        .tf-markets{
          display:grid; grid-template-columns:repeat(3,1fr); gap:15px;
        }
        .tf-market{
          position:relative; overflow:hidden;
          padding:22px 20px;
          border-radius:16px;
          border:1px solid ${c.border || '#16223a'};
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.surface || '#0d1524'});
          transition:.24s cubic-bezier(.16,1,.3,1);
        }
        .tf-market::after{
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:var(--mk); opacity:.85;
        }
        .tf-market:hover{
          transform:translateY(-4px);
          border-color:${c.accentMuted || '#243550'};
          box-shadow:${c.shadowElevated || '0 18px 42px rgba(0,0,0,.4)'};
        }
        .tf-market-top{
          display:flex; align-items:center; gap:10px; margin-bottom:14px;
        }
        .tf-market-logo{
          width:40px; height:40px; border-radius:11px;
          display:grid; place-items:center;
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:11px; font-weight:800; letter-spacing:.2px;
          color:var(--mk);
          background:color-mix(in srgb, var(--mk) 14%, transparent);
          border:1px solid color-mix(in srgb, var(--mk) 32%, transparent);
        }
        .tf-market-name{
          font-size:15px; font-weight:800; letter-spacing:-.3px;
          color:${c.text || '#e8eefb'};
        }
        .tf-market-sub{
          font-size:11px; color:${c.textMuted || '#5a6b88'}; margin-top:2px;
        }
        .tf-market-tag{
          margin-left:auto;
          font-size:9px; font-weight:700; letter-spacing:.9px;
          text-transform:uppercase; padding:4px 8px; border-radius:6px;
          color:var(--mk);
          background:color-mix(in srgb, var(--mk) 12%, transparent);
        }
        .tf-market-desc{
          font-size:12.5px; line-height:1.6;
          color:${c.textSecondary || '#7d90b0'};
          margin-bottom:16px; min-height:60px;
        }
        .tf-market-meta{
          display:grid; grid-template-columns:repeat(3,1fr); gap:8px;
          padding-top:14px;
          border-top:1px solid ${c.border || 'rgba(255,255,255,.06)'};
        }
        .tf-market-meta .k{
          font-size:9.5px; font-weight:600; letter-spacing:.8px;
          text-transform:uppercase; color:${c.textMuted || '#5a6b88'};
        }
        .tf-market-meta .v{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:12px; font-weight:700; margin-top:4px;
          color:${c.text || '#e8eefb'};
        }
        .tf-market-live{
          display:flex; align-items:center; justify-content:space-between;
          gap:10px; margin-top:15px; padding-top:13px;
          border-top:1px solid ${c.border || 'rgba(255,255,255,.06)'};
        }
        .tf-market-live .lp{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:14px; font-weight:700; color:${c.text || '#e8eefb'};
        }

        /* ============================================================
           4. SERVICES
           ============================================================ */
        .tf-services{
          display:grid; grid-template-columns:repeat(3,1fr); gap:15px;
        }
        .tf-service{
          position:relative; overflow:hidden;
          padding:22px 20px 19px;
          border-radius:15px; cursor:pointer;
          border:1px solid ${c.border || '#16223a'};
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.surface || '#0d1524'});
          transition:.24s cubic-bezier(.16,1,.3,1);
        }
        .tf-service::before{
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg, ${c.accent || '#00d68f'}, transparent);
          opacity:0; transition:opacity .25s;
        }
        .tf-service:hover{
          transform:translateY(-4px);
          border-color:${c.accentMuted || '#243550'};
          box-shadow:${c.shadowElevated || '0 18px 42px rgba(0,0,0,.4)'};
        }
        .tf-service:hover::before{ opacity:1; }
        .tf-service-icon{
          width:42px; height:42px; border-radius:12px;
          display:grid; place-items:center; margin-bottom:15px;
          background:linear-gradient(135deg, ${c.accentLight || 'rgba(0,214,143,.16)'}, ${c.accentLight || 'rgba(59,130,246,.12)'});
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.22)'};
          color:${c.accent || '#00d68f'};
        }
        .tf-service-icon svg{ width:19px; height:19px; }
        .tf-service h3{
          font-size:14.5px; font-weight:700; letter-spacing:-.25px;
          color:${c.text || '#e8eefb'}; margin-bottom:8px;
        }
        .tf-service p{
          font-size:12.5px; line-height:1.6;
          color:${c.textSecondary || '#7d90b0'};
          margin-bottom:15px; min-height:62px;
        }
        .tf-service-cta{
          display:inline-flex; align-items:center; gap:6px;
          font-size:12px; font-weight:700;
          color:${c.accent || '#00d68f'};
        }
        .tf-service-cta::after{
          content:'→'; transition:transform .2s;
        }
        .tf-service:hover .tf-service-cta::after{ transform:translateX(4px); }

        /* ============================================================
           5. BIO
           ============================================================ */
        .tf-bio{
          display:grid; grid-template-columns:.85fr 1.15fr;
          gap:38px; align-items:center;
          padding:36px;
          border-radius:20px;
          border:1px solid ${c.border || '#16223a'};
          background:
            radial-gradient(ellipse at 100% 0%, ${c.accentLight || 'rgba(0,214,143,.1)'}, transparent 58%),
            linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.surface || '#0d1524'});
        }
        .tf-bio-photo{
          position:relative;
          border-radius:18px;
          padding:5px;
          background:linear-gradient(140deg, ${c.accent || '#00d68f'}, ${c.accentHover || '#3b82f6'}, transparent 75%);
        }
        .tf-bio-photo img{
          display:block; width:100%; height:auto;
          aspect-ratio:4 / 4.4; object-fit:cover;
          border-radius:14px;
          background:${c.surface || '#0d1524'};
        }
        .tf-bio-chip{
          position:absolute; left:50%; bottom:-16px;
          transform:translateX(-50%);
          display:flex; align-items:center; gap:8px;
          padding:9px 16px; border-radius:24px; white-space:nowrap;
          background:${c.surfaceElevated || '#0f1829'};
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.3)'};
          box-shadow:0 14px 32px rgba(0,0,0,.5);
        }
        .tf-bio-chip .d{
          width:7px; height:7px; border-radius:50%;
          background:${c.accent || '#00d68f'};
          box-shadow:0 0 10px ${c.accent || '#00d68f'};
        }
        .tf-bio-chip span{
          font-size:11px; font-weight:700; letter-spacing:.7px;
          text-transform:uppercase; color:${c.text || '#e8eefb'};
        }

        .tf-bio h2{
          font-size:28px; font-weight:800; letter-spacing:-1px;
          color:${c.text || '#e8eefb'}; margin-bottom:6px;
        }
        .tf-bio .role{
          font-size:12px; font-weight:700; letter-spacing:1.1px;
          text-transform:uppercase; color:${c.accent || '#00d68f'};
          margin-bottom:18px;
        }
        .tf-bio p{
          font-size:13.5px; line-height:1.75;
          color:${c.textSecondary || '#7d90b0'};
          margin-bottom:14px;
        }
        .tf-bio-facts{
          display:grid; grid-template-columns:repeat(3,1fr);
          gap:12px; margin-top:22px;
          padding-top:20px;
          border-top:1px solid ${c.border || 'rgba(255,255,255,.07)'};
        }
        .tf-bio-fact .n{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:20px; font-weight:700; letter-spacing:-.6px;
          color:${c.accent || '#00d68f'}; line-height:1;
        }
        .tf-bio-fact .l{
          font-size:10px; font-weight:600; letter-spacing:.8px;
          text-transform:uppercase; color:${c.textMuted || '#5a6b88'};
          margin-top:6px;
        }

        /* ============================================================
           6. BOTS
           ============================================================ */
        .tf-bots{
          display:grid; grid-template-columns:repeat(3,1fr); gap:15px;
        }
        .tf-bot{
          padding:22px 20px;
          border-radius:16px;
          border:1px solid ${c.border || '#16223a'};
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.surface || '#0d1524'});
          transition:.24s cubic-bezier(.16,1,.3,1);
        }
        .tf-bot:hover{
          transform:translateY(-4px);
          border-color:${c.accentMuted || '#243550'};
          box-shadow:${c.shadowElevated || '0 18px 42px rgba(0,0,0,.4)'};
        }
        .tf-bot-head{
          display:flex; align-items:center; justify-content:space-between;
          gap:10px; margin-bottom:16px;
        }
        .tf-bot-name{
          font-size:14.5px; font-weight:800; letter-spacing:-.3px;
          color:${c.text || '#e8eefb'};
        }
        .tf-bot-market{
          font-size:10.5px; font-weight:600;
          color:${c.textMuted || '#5a6b88'}; margin-top:3px;
        }
        .tf-bot-pill{
          font-size:9px; font-weight:700; letter-spacing:.9px;
          text-transform:uppercase; padding:4px 9px; border-radius:6px;
          background:${c.accentLight || 'rgba(0,214,143,.12)'};
          color:${c.accent || '#00d68f'};
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.22)'};
        }
        .tf-bot-stats{
          display:grid; grid-template-columns:repeat(2,1fr);
          gap:11px; margin-bottom:16px;
        }
        .tf-bot-stat{
          padding:10px 12px; border-radius:10px;
          background:${c.bg || 'rgba(0,0,0,.18)'};
          border:1px solid ${c.border || 'rgba(255,255,255,.05)'};
        }
        .tf-bot-stat .k{
          font-size:9px; font-weight:600; letter-spacing:.8px;
          text-transform:uppercase; color:${c.textMuted || '#5a6b88'};
        }
        .tf-bot-stat .v{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:15px; font-weight:700; margin-top:5px;
          color:${c.text || '#e8eefb'};
        }
        .tf-bot-bar{
          height:5px; border-radius:4px; overflow:hidden;
          background:${c.border || 'rgba(255,255,255,.07)'};
          margin-bottom:8px;
        }
        .tf-bot-bar i{
          display:block; height:100%; border-radius:4px;
          background:linear-gradient(90deg, ${c.accent || '#00d68f'}, ${c.accentHover || '#3b82f6'});
        }
        .tf-bot-bar-label{
          display:flex; justify-content:space-between;
          font-size:10px; font-weight:600;
          color:${c.textMuted || '#5a6b88'};
          text-transform:uppercase; letter-spacing:.6px;
          margin-bottom:16px;
        }
        .tf-bot-btn{
          width:100%; padding:10px; border-radius:10px;
          font-size:12px; font-weight:700; cursor:pointer;
          font-family:inherit;
          background:${c.accentLight || 'rgba(0,214,143,.1)'};
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.28)'};
          color:${c.accent || '#00d68f'};
          transition:.2s;
        }
        .tf-bot-btn:hover{
          background:${c.accent || '#00d68f'};
          color:#04121c;
        }

        /* ============================================================
           7. TOOLS
           ============================================================ */
        .tf-tools{
          display:grid; grid-template-columns:1fr 1fr; gap:15px;
        }
        .tf-tool{ padding:24px 22px; }

        /* calculator */
        .tf-calc-grid{
          display:grid; grid-template-columns:1fr 1fr; gap:12px;
          margin-bottom:16px;
        }
        .tf-field label{
          display:block; font-size:10px; font-weight:700;
          letter-spacing:.9px; text-transform:uppercase;
          color:${c.textMuted || '#5a6b88'}; margin-bottom:7px;
        }
        .tf-field input{
          width:100%; box-sizing:border-box;
          padding:11px 13px; border-radius:10px;
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:13.5px; font-weight:700;
          color:${c.text || '#e8eefb'};
          background:${c.bg || 'rgba(0,0,0,.22)'};
          border:1px solid ${c.border || 'rgba(255,255,255,.09)'};
          outline:none; transition:.2s;
        }
        .tf-field input:focus{
          border-color:${c.accent || '#00d68f'};
          box-shadow:0 0 0 3px ${c.accentLight || 'rgba(0,214,143,.14)'};
        }
        .tf-calc-out{
          display:flex; align-items:center; justify-content:space-between;
          gap:14px; padding:16px 18px; border-radius:12px;
          background:linear-gradient(135deg, ${c.accentLight || 'rgba(0,214,143,.12)'}, transparent);
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.26)'};
          margin-bottom:14px;
        }
        .tf-calc-out .k{
          font-size:10px; font-weight:700; letter-spacing:1px;
          text-transform:uppercase; color:${c.textMuted || '#5a6b88'};
        }
        .tf-calc-out .v{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:26px; font-weight:800; letter-spacing:-1px;
          color:${c.accent || '#00d68f'}; line-height:1;
        }
        .tf-calc-out .s{
          font-size:11px; color:${c.textSecondary || '#7d90b0'};
          margin-top:5px;
        }

        /* strength */
        .tf-st-row{
          display:flex; align-items:center; gap:12px;
          padding:8px 0;
        }
        .tf-st-cur{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:12px; font-weight:700; letter-spacing:.6px;
          color:${c.text || '#e8eefb'}; width:36px;
        }
        .tf-st-track{
          position:relative; flex:1; height:7px; border-radius:5px;
          background:${c.border || 'rgba(255,255,255,.06)'};
        }
        .tf-st-mid{
          position:absolute; left:50%; top:-3px; bottom:-3px;
          width:1px; background:${c.border || 'rgba(255,255,255,.18)'};
        }
        .tf-st-bar{
          position:absolute; top:0; bottom:0; border-radius:5px;
        }
        .tf-st-bar.pos{ background:linear-gradient(90deg, ${c.success || '#00d68f'}, ${c.accentHover || '#3b82f6'}); }
        .tf-st-bar.neg{ background:linear-gradient(270deg, ${c.danger || '#ff4d6a'}, ${c.warning || '#f5a524'}); }
        .tf-st-val{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:11.5px; font-weight:700;
          min-width:52px; text-align:right;
        }

        /* ============================================================
           8. STEPS
           ============================================================ */
        .tf-steps{
          display:grid; grid-template-columns:repeat(4,1fr); gap:15px;
        }
        .tf-step{
          position:relative;
          padding:22px 20px;
          border-radius:15px;
          border:1px solid ${c.border || '#16223a'};
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.surface || '#0d1524'});
        }
        .tf-step .n{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:30px; font-weight:800; letter-spacing:-1.6px;
          line-height:1;
          background:linear-gradient(135deg, ${c.accent || '#00d68f'}, ${c.accentHover || '#3b82f6'});
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          margin-bottom:14px; display:block;
        }
        .tf-step h4{
          font-size:13.5px; font-weight:700; letter-spacing:-.2px;
          color:${c.text || '#e8eefb'}; margin-bottom:8px;
        }
        .tf-step p{
          font-size:12.5px; line-height:1.6;
          color:${c.textSecondary || '#7d90b0'};
        }

        /* ============================================================
           9. TESTIMONIALS
           ============================================================ */
        .tf-testi{
          display:grid; grid-template-columns:repeat(3,1fr); gap:15px;
        }
        .tf-quote{
          padding:22px 20px;
          border-radius:15px;
          border:1px solid ${c.border || '#16223a'};
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.surface || '#0d1524'});
        }
        .tf-quote .mark{
          font-family:Georgia,serif;
          font-size:38px; line-height:.6;
          color:${c.accentMuted || 'rgba(0,214,143,.35)'};
          margin-bottom:12px; display:block;
        }
        .tf-quote p{
          font-size:13px; line-height:1.7;
          color:${c.textSecondary || '#7d90b0'};
          margin-bottom:16px;
        }
        .tf-quote .who{
          display:flex; align-items:center; gap:10px;
          padding-top:14px;
          border-top:1px solid ${c.border || 'rgba(255,255,255,.06)'};
        }
        .tf-quote .av{
          width:32px; height:32px; border-radius:50%;
          display:grid; place-items:center;
          font-size:12px; font-weight:800;
          color:${c.accent || '#00d68f'};
          background:${c.accentLight || 'rgba(0,214,143,.12)'};
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.25)'};
        }
        .tf-quote .nm{
          font-size:12.5px; font-weight:700;
          color:${c.text || '#e8eefb'};
        }
        .tf-quote .rl{
          font-size:10.5px; color:${c.textMuted || '#5a6b88'};
          margin-top:2px;
        }

        /* ============================================================
           10. FAQ
           ============================================================ */
        .tf-faq{ display:flex; flex-direction:column; gap:9px; }
        .tf-faq details{
          border-radius:12px;
          border:1px solid ${c.border || '#16223a'};
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.surface || '#0d1524'});
          overflow:hidden;
        }
        .tf-faq summary{
          list-style:none; cursor:pointer;
          padding:16px 18px;
          display:flex; align-items:center; gap:12px;
          font-size:13.5px; font-weight:700;
          color:${c.text || '#e8eefb'};
          transition:.2s;
        }
        .tf-faq summary::-webkit-details-marker{ display:none; }
        .tf-faq summary::after{
          content:'+';
          margin-left:auto;
          font-size:18px; font-weight:400;
          color:${c.accent || '#00d68f'};
          transition:transform .22s;
        }
        .tf-faq details[open] summary::after{ transform:rotate(45deg); }
        .tf-faq summary:hover{ color:${c.accent || '#00d68f'}; }
        .tf-faq details p{
          padding:0 18px 17px;
          font-size:12.8px; line-height:1.7;
          color:${c.textSecondary || '#7d90b0'};
        }

        /* ============================================================
           11. CTA BANNER
           ============================================================ */
        .tf-cta{
          position:relative; overflow:hidden;
          padding:40px 36px; border-radius:20px;
          text-align:center;
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.25)'};
          background:
            radial-gradient(ellipse at 50% 0%, ${c.accentLight || 'rgba(0,214,143,.16)'}, transparent 62%),
            linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'}, ${c.bg || '#0a121e'});
        }
        .tf-cta h2{
          font-size:26px; font-weight:800; letter-spacing:-.9px;
          color:${c.text || '#e8eefb'}; margin-bottom:10px;
        }
        .tf-cta p{
          font-size:13.5px; line-height:1.65;
          color:${c.textSecondary || '#7d90b0'};
          max-width:520px; margin:0 auto 24px;
        }
        .tf-cta .row{
          display:flex; justify-content:center; flex-wrap:wrap; gap:12px;
        }

        /* ============================================================
           12. NOTICE
           ============================================================ */
        .tf-notice{
          display:flex; align-items:flex-start; gap:11px;
          padding:15px 17px; border-radius:12px;
          background:${c.warningLight || 'rgba(245,165,36,.07)'};
          border:1px solid ${c.warningMuted || 'rgba(245,165,36,.22)'};
        }
        .tf-notice svg{
          width:17px; height:17px; flex-shrink:0; margin-top:1px;
          fill:none; stroke:${c.warning || '#f5a524'};
          stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round;
        }
        .tf-notice span{
          font-size:12px; line-height:1.6;
          color:${c.textSecondary || '#7d90b0'};
        }

        /* ============================================================
           RESPONSIVE — LAPTOP
           ============================================================ */
        @media (max-width:1180px){
          .tf-hero{ padding:36px 28px; }
          .tf-hero h1{ font-size:36px; letter-spacing:-1.3px; }
          .tf-hero-inner{ grid-template-columns:1fr .9fr; gap:28px; }
          .tf-services{ grid-template-columns:repeat(2,1fr); }
          .tf-bots{ grid-template-columns:repeat(2,1fr); }
          .tf-steps{ grid-template-columns:repeat(2,1fr); }
          .tf-testi{ grid-template-columns:repeat(2,1fr); }
        }

        @media (max-width:980px){
          .tf-hero-inner{ grid-template-columns:1fr; gap:34px; }
          .tf-hero h1{ font-size:34px; max-width:100%; }
          .tf-visual{ max-width:520px; }
          .tf-float-a{ right:6px; }
          .tf-float-b{ left:6px; }
          .tf-bio{ grid-template-columns:1fr; gap:40px; padding:28px 24px; }
          .tf-bio-photo{ max-width:340px; margin:0 auto; }
          .tf-tools{ grid-template-columns:1fr; }
          .tf-markets{ grid-template-columns:1fr; }
          .tf-market-desc{ min-height:0; }
        }

        /* ============================================================
           RESPONSIVE — MOBILE
           ============================================================ */
        @media (max-width:760px){
          .tf-home{ gap:20px; }
          .tf-hero{ padding:26px 18px; border-radius:16px; }
          .tf-hero h1{ font-size:27px; letter-spacing:-1px; line-height:1.15; }
          .tf-hero-lead{ font-size:13.5px; margin-bottom:22px; }
          .tf-hero-actions{ gap:10px; margin-bottom:24px; }
          .tf-btn{ flex:1 1 100%; justify-content:center; padding:12px 18px; }
          .tf-hero-stats{ gap:18px 26px; padding-top:18px; }
          .tf-hero-stat .n{ font-size:19px; }
          .tf-float{ display:none; }

          .tf-sec-head h2{ font-size:19px; }
          .tf-sec-head p{ font-size:12.5px; }

          .tf-services{ grid-template-columns:1fr; gap:11px; }
          .tf-service{ padding:17px 16px; }
          .tf-service p{ min-height:0; }

          .tf-bots{ grid-template-columns:1fr; gap:11px; }
          .tf-bot{ padding:18px 16px; }

          .tf-steps{ grid-template-columns:1fr; gap:11px; }
          .tf-step{ padding:18px 16px; }

          .tf-testi{ grid-template-columns:1fr; gap:11px; }
          .tf-quote{ padding:18px 16px; }

          .tf-markets{ gap:11px; }
          .tf-market{ padding:18px 16px; }

          .tf-calc-grid{ grid-template-columns:1fr; }
          .tf-calc-out .v{ font-size:21px; }
          .tf-tool{ padding:19px 17px; }

          .tf-bio{ padding:24px 18px; gap:34px; }
          .tf-bio h2{ font-size:22px; }
          .tf-bio-facts{ grid-template-columns:1fr 1fr; gap:14px; }

          .tf-cta{ padding:28px 20px; border-radius:16px; }
          .tf-cta h2{ font-size:20px; }
          .tf-cta .row .tf-btn{ flex:1 1 100%; }

          .tf-faq summary{ font-size:12.8px; padding:14px 15px; }
          .tf-faq details p{ padding:0 15px 15px; font-size:12.2px; }

          .tf-tick{ padding:11px 16px; }
        }

        @media (max-width:420px){
          .tf-hero h1{ font-size:24px; }
          .tf-hero-stat .n{ font-size:17px; }
          .tf-bio-facts{ grid-template-columns:1fr; }
        }
      `}</style>

      <section className="view active tf-home">

        {/* ============================================================
            HERO — "Master Forex Trading With Tonnyfx"
           ============================================================ */}
        <div className="tf-hero">
          <div className="tf-hero-inner">

            <div>
              <div className="tf-badge">
                <span className="tf-dot-live" /> Tonnyfx · Third-Party Trading Terminal
              </div>

              <h1>
                Master Forex Trading With{' '}
                <span className="tf-grad">Tonnyfx</span>
              </h1>

              <p className="tf-hero-lead">
                Precision bots, institutional-grade risk tools and live market intelligence —
                built for three instruments only: <strong>EUR/USD</strong>, <strong>BTC/USD</strong> and{' '}
                <strong>XAU/USD</strong>. Everything you need to trade them like a professional,
                in one clean terminal.
              </p>

              <div className="tf-hero-actions">
                <button className="tf-btn tf-btn-primary" onClick={() => go('bots')}>
                  Launch a Trading Bot
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <button className="tf-btn tf-btn-ghost" onClick={() => go('lot')}>
                  Open Lot Size Calculator
                </button>
              </div>

              <div className="tf-hero-stats">
                <div className="tf-hero-stat">
                  <div className="n">3<span>+</span></div>
                  <div className="l">Core instruments</div>
                </div>
                <div className="tf-hero-stat">
                  <div className="n">5<span>+</span></div>
                  <div className="l">Built-in bots</div>
                </div>
                <div className="tf-hero-stat">
                  <div className="n">1.5<span>s</span></div>
                  <div className="l">Live tick rate</div>
                </div>
                <div className="tf-hero-stat">
                  <div className="n">24<span>/7</span></div>
                  <div className="l">Market coverage</div>
                </div>
              </div>
            </div>

            {/* live terminal mock */}
            <div className="tf-visual">
              <div className="tf-terminal">
                <div className="tf-term-head">
                  <span className="d a" /><span className="d b" /><span className="d c" />
                  <span className="tf-term-title">Live Terminal</span>
                </div>

                {MARKETS.map((m) => {
                  const price = priceOf(m.sym);
                  const chg = changeOf(m.sym);
                  const up = chg >= 0;
                  return (
                    <div className="tf-term-row" key={m.sym}>
                      <span className="tf-term-sym">{m.label}</span>
                      <span className="tf-term-tag">{m.tag}</span>
                      <span className="tf-term-price">
                        {price ? fmtPrice(m.sym, price) : '—'}
                      </span>
                      <span className={`tf-term-chg ${up ? 'tf-pos' : 'tf-neg'}`}>
                        {up ? '+' : ''}{fmt(chg, 2)}%
                      </span>
                    </div>
                  );
                })}

                <div className="tf-term-foot">
                  <span className="k">Session Equity</span>
                  <span className="v">
                    {fmtMoney(account?.balance ?? 0)}
                  </span>
                </div>
              </div>

              <div className="tf-float tf-float-a">
                <div className="t">Win Rate</div>
                <div className="v tf-pos">68.4%</div>
              </div>

              <div className="tf-float tf-float-b">
                <div className="t">Risk / Trade</div>
                <div className="v">1.0%</div>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================
            LIVE TICKER
           ============================================================ */}
        <div className="tf-marquee">
          <div className="tf-marquee-track">
            {[0, 1].map((dup) =>
              WATCHLIST.map((sym) => {
                const price = priceOf(sym);
                const chg = changeOf(sym);
                const up = chg >= 0;
                return (
                  <div className="tf-tick" key={`${dup}-${sym}`}>
                    <span className="s">{sym.slice(0, 3)}/{sym.slice(3, 6)}</span>
                    <span className="p">{price ? fmtPrice(sym, price) : '—'}</span>
                    <span className={`c ${up ? 'tf-pos' : 'tf-neg'}`}>
                      {up ? '▲' : '▼'} {fmt(Math.abs(chg), 2)}%
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ============================================================
            MARKETS WE TRADE
           ============================================================ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Focus</div>
              <h2>Three instruments. Total mastery.</h2>
              <p>
                We deliberately trade a tiny universe so every bot, every calculator and every
                risk rule is tuned to the exact behaviour of that market.
              </p>
            </div>
            <span className="tf-sec-count">03 markets</span>
          </div>

          <div className="tf-markets">
            {MARKETS.map((m) => {
              const price = priceOf(m.sym);
              const chg = changeOf(m.sym);
              const up = chg >= 0;
              const hist = pairs?.[m.sym]?.history || [];
              return (
                <div
                  className="tf-market"
                  key={m.sym}
                  style={{ '--mk': m.accent }}
                >
                  <div className="tf-market-top">
                    <div className="tf-market-logo">
                      {m.label.split('/')[0]}
                    </div>
                    <div>
                      <div className="tf-market-name">{m.label}</div>
                      <div className="tf-market-sub">{m.name}</div>
                    </div>
                    <span className="tf-market-tag">{m.tag}</span>
                  </div>

                  <p className="tf-market-desc">{m.desc}</p>

                  <div className="tf-market-meta">
                    <div>
                      <div className="k">Spread</div>
                      <div className="v">{m.spread}</div>
                    </div>
                    <div>
                      <div className="k">Session</div>
                      <div className="v">{m.session}</div>
                    </div>
                    <div>
                      <div className="k">Volatility</div>
                      <div className="v">{m.vol}</div>
                    </div>
                  </div>

                  <div className="tf-market-live">
                    <div>
                      <div className="lp">{price ? fmtPrice(m.sym, price) : '—'}</div>
                      <div className={`tf-term-chg ${up ? 'tf-pos' : 'tf-neg'}`} style={{ textAlign: 'left', marginTop: 3 }}>
                        {up ? '+' : ''}{fmt(chg, 2)}% today
                      </div>
                    </div>
                    {hist.length > 1 && (
                      <Sparkline
                        values={hist}
                        w={92}
                        h={30}
                        color={up ? (c.success || '#00d68f') : (c.danger || '#ff4d6a')}
                      />
                    )}
                    <button className="tf-btn tf-btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => onTrade && onTrade(m.sym)}>
                      Trade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            SERVICES WE PROVIDE
           ============================================================ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Services we provide</div>
              <h2>Everything a retail trader actually needs</h2>
              <p>
                Tonnyfx is not a broker. We are the third-party layer that sits on top of your
                account — automation, sizing, strength data and risk control.
              </p>
            </div>
            <span className="tf-sec-count">{SERVICES.length} services</span>
          </div>

          <div className="tf-services">
            {SERVICES.map((s) => (
              <div
                className="tf-service"
                key={s.key}
                onClick={() => go(s.key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') go(s.key); }}
              >
                <div className="tf-service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="tf-service-cta">{s.cta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            BIO
           ============================================================ */}
        <div className="tf-bio">
          <div className="tf-bio-photo">
            <img src="/assets/images/image13.png" alt="Tonny — founder of Tonnyfx" loading="lazy" />
            <div className="tf-bio-chip">
              <span className="d" />
              <span>Founder · Tonnyfx</span>
            </div>
          </div>

          <div>
            <div className="tf-eyebrow">About me</div>
            <h2>Hi, I'm Tonny.</h2>
            <div className="role">Trader · System Builder · Founder of Tonnyfx</div>

            <p>
              I've spent the last decade in front of charts — first losing money like most
              retail traders, then slowly building the discipline and systems that turned it
              around. Along the way I learned one thing: most people don't fail because they
              picked the wrong direction. They fail because they sized the trade wrong, risked
              too much, and had no rules.
            </p>
            <p>
              Tonnyfx is the toolset I wish I'd had at the start. I built it as a third-party
              layer that sits on top of any broker account — automation for EUR/USD, BTC/USD
              and XAU/USD, a proper lot size calculator, a currency strength meter, and a risk
              manager that stops you before you stop yourself.
            </p>
            <p>
              No hype, no "signal group" promises. Just clean execution, transparent stats and
              tools that make you a more consistent trader.
            </p>

            <div className="tf-bio-facts">
              <div className="tf-bio-fact">
                <div className="n">10+</div>
                <div className="l">Years trading</div>
              </div>
              <div className="tf-bio-fact">
                <div className="n">3</div>
                <div className="l">Core markets</div>
              </div>
              <div className="tf-bio-fact">
                <div className="n">5</div>
                <div className="l">Live bots</div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            TRADING BOTS
           ============================================================ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Automation</div>
              <h2>Trading bots, tuned to one market each</h2>
              <p>
                Every strategy is built for a single instrument. No generic multi-asset logic —
                just focused systems with transparent performance.
              </p>
            </div>
            <span className="tf-sec-count">{BOTS.length} live strategies</span>
          </div>

          <div className="tf-bots">
            {BOTS.map((b) => (
              <div className="tf-bot" key={b.name}>
                <div className="tf-bot-head">
                  <div>
                    <div className="tf-bot-name">{b.name}</div>
                    <div className="tf-bot-market">{b.market} · {b.tf} · {b.tag}</div>
                  </div>
                  <span className="tf-bot-pill">{b.risk} risk</span>
                </div>

                <div className="tf-bot-stats">
                  <div className="tf-bot-stat">
                    <div className="k">Win rate</div>
                    <div className="v tf-pos">{b.win}%</div>
                  </div>
                  <div className="tf-bot-stat">
                    <div className="k">Trades</div>
                    <div className="v">{b.trades}</div>
                  </div>
                  <div className="tf-bot-stat">
                    <div className="k">Max DD</div>
                    <div className="v tf-neg">{b.dd}</div>
                  </div>
                  <div className="tf-bot-stat">
                    <div className="k">Timeframe</div>
                    <div className="v">{b.tf}</div>
                  </div>
                </div>

                <div className="tf-bot-bar">
                  <i style={{ width: `${b.win}%` }} />
                </div>
                <div className="tf-bot-bar-label">
                  <span>Performance</span>
                  <span>{b.win}/100</span>
                </div>

                <button className="tf-bot-btn" onClick={() => go('bots')}>
                  Configure this bot
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            TOOLS — CALCULATOR + STRENGTH
           ============================================================ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Free tools</div>
              <h2>Size every trade. Read every currency.</h2>
              <p>Two tools that do more for your account than any indicator ever will.</p>
            </div>
          </div>

          <div className="tf-tools">

            {/* --- lot size calculator --- */}
            <div className="tf-card tf-tool">
              <div className="tf-sec-head" style={{ marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontSize: 16 }}>Lot Size Calculator</h2>
                  <p style={{ fontSize: 12 }}>EUR/USD standard lot · pip value $10</p>
                </div>
              </div>

              <div className="tf-calc-grid">
                <div className="tf-field">
                  <label htmlFor="tf-bal">Account balance ($)</label>
                  <input
                    id="tf-bal"
                    type="number"
                    min="0"
                    value={calc.bal}
                    onChange={(e) => setCalc({ ...calc, bal: e.target.value })}
                  />
                </div>
                <div className="tf-field">
                  <label htmlFor="tf-risk">Risk per trade (%)</label>
                  <input
                    id="tf-risk"
                    type="number"
                    min="0"
                    step="0.1"
                    value={calc.risk}
                    onChange={(e) => setCalc({ ...calc, risk: e.target.value })}
                  />
                </div>
                <div className="tf-field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="tf-sl">Stop-loss (pips)</label>
                  <input
                    id="tf-sl"
                    type="number"
                    min="1"
                    value={calc.sl}
                    onChange={(e) => setCalc({ ...calc, sl: e.target.value })}
                  />
                </div>
              </div>

              <div className="tf-calc-out">
                <div>
                  <div className="k">Position size</div>
                  <div className="v">{fmt(lots, 2)}</div>
                  <div className="s">standard lots</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="k">Risk amount</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: c.text || '#e8eefb', marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                    {fmtMoney(riskAmount)}
                  </div>
                </div>
              </div>

              <button
                className="tf-btn tf-btn-ghost"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => go('lot')}
              >
                Open full calculator
              </button>
            </div>

            {/* --- strength meter --- */}
            <div className="tf-card tf-tool">
              <div className="tf-sec-head" style={{ marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontSize: 16 }}>Currency Strength Meter</h2>
                  <p style={{ fontSize: 12 }}>Eight majors vs a weighted basket</p>
                </div>
                <span className="tf-sec-count">Live</span>
              </div>

              <div style={{ padding: '4px 0 12px' }}>
                {pick.map((curr) => {
                  const v = st[curr] || 0;
                  const w = (Math.abs(v) / maxAbs) * 50;
                  const pos = v >= 0;
                  return (
                    <div className="tf-st-row" key={curr}>
                      <div className="tf-st-cur">{curr}</div>
                      <div className="tf-st-track">
                        <div className="tf-st-mid" />
                        <div
                          className={`tf-st-bar ${pos ? 'pos' : 'neg'}`}
                          style={pos ? { left: '50%', width: `${w}%` } : { right: '50%', width: `${w}%` }}
                        />
                      </div>
                      <div className={`tf-st-val ${pos ? 'tf-pos' : 'tf-neg'}`}>
                        {pos ? '+' : ''}{fmt(v, 2)}%
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="tf-btn tf-btn-ghost"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => go('strength')}
              >
                Open Strength Meter
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================
            HOW IT WORKS
           ============================================================ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">How it works</div>
              <h2>From sign-up to automated in four steps</h2>
            </div>
          </div>

          <div className="tf-steps">
            {STEPS.map((s) => (
              <div className="tf-step" key={s.n}>
                <span className="n">{s.n}</span>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            TESTIMONIALS
           ============================================================ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Trader feedback</div>
              <h2>What the community says</h2>
            </div>
          </div>

          <div className="tf-testi">
            {TESTIMONIALS.map((t) => (
              <div className="tf-quote" key={t.n}>
                <span className="mark">“</span>
                <p>{t.q}</p>
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

        {/* ============================================================
            FAQ
           ============================================================ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">FAQ</div>
              <h2>Questions traders ask first</h2>
            </div>
          </div>

          <div className="tf-faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* ============================================================
            FINAL CTA
           ============================================================ */}
        <div className="tf-cta">
          <h2>Ready to trade with an edge?</h2>
          <p>
            Start with the free tools, then let a bot handle the execution. No broker lock-in,
            no hidden promises — just a better way to trade EUR/USD, BTC/USD and XAU/USD.
          </p>
          <div className="row">
            <button className="tf-btn tf-btn-primary" onClick={() => go('bots')}>
              Explore Trading Bots
            </button>
            <button className="tf-btn tf-btn-ghost" onClick={() => go('strength')}>
              Check Currency Strength
            </button>
          </div>
        </div>

        {/* ============================================================
            NOTICE
           ============================================================ */}
        <div className="tf-notice">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <span>
            Tonnyfx is a third-party analytics and automation provider — not a broker or
            investment advisor. All performance figures shown are simulated and for
            illustration only. Trading forex, crypto and metals carries significant risk of
            loss. Never risk capital you cannot afford to lose.
          </span>
        </div>

      </section>
    </>
  );
}