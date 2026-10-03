// src/components/forexhome.jsx
import { useState, useEffect } from 'react';
import {
  CURRENCIES, WATCHLIST,
  fmt, fmtMoney, fmtPrice,
  currencyStrength, Sparkline,
} from '../pages/forexdash';
import tonnyPhoto from '../assets/images/image13.png';

/* ================================================================ */
/*  DESIGN TOKENS                                                   */
/* ================================================================ */
const C = {
  bg: '#070707', bg2: '#0d0d0d', card: '#111111', card2: '#161616',
  border: '#1e1e1e', border2: '#2a2a2a',
  gold: '#f5b400', gold2: '#e0a200',
  goldSoft: 'rgba(245,180,0,.12)', goldBorder: 'rgba(245,180,0,.28)',
  text: '#ffffff', text2: '#a8a8a8', text3: '#6b6b6b',
  green: '#22c55e', red: '#ef4444',
};

/* ================================================================ */
/*  CONTENT                                                         */
/* ================================================================ */
const SERVICES = [
  { key:'bots',     title:'Automated Trading Bots',    desc:'Six pre-built strategies tuned for EUR/USD, BTC/USD and XAU/USD. Toggle on and let them run.',              cta:'Manage bots', icon:'bot' },
  { key:'lot',      title:'Lot Size Calculator',       desc:'Risk-based sizing on every instrument. Balance, risk % and stop-loss — instant lot size.',                  cta:'Calculate',   icon:'calc' },
  { key:'strength', title:'Currency Strength Meter',   desc:'Rank the eight majors against a weighted basket. Spot the strongest and weakest in one glance.',           cta:'View strength', icon:'bars' },
  { key:'signals',  title:'Live Signal Alerts',        desc:'Momentum, breakout and mean-reversion alerts the moment price structure shifts on your watchlist.',        cta:'See alerts',  icon:'bell' },
  { key:'risk',     title:'Risk & Margin Manager',     desc:'Real-time margin level, free margin and exposure warnings — so one trade never takes down your account.',  cta:'Review risk', icon:'shield' },
  { key:'journal',  title:'Trade Journal & Analytics', desc:'Every fill and every pip logged automatically. Win rate, expectancy, drawdown, equity curve.',              cta:'Open journal', icon:'journal' },
];

const STATS = [
  { n:'10+',   l:'Years trading' },
  { n:'3.2k+', l:'Traders mentored' },
  { n:'6+',    l:'Live bots' },
  { n:'24/7',  l:'Community support' },
];

const MILESTONES = [
  { n:'12,400+', l:'Trades logged monthly' },
  { n:'$48M+',   l:'Notional volume tracked' },
  { n:'3,200+',  l:'Active traders' },
  { n:'99.98%',  l:'Bot uptime' },
];

const FOREX_BASICS = [
  { t:'What is forex trading?',              d:'Forex is the global marketplace for exchanging national currencies. Roughly $7.5 trillion trades every single day — the largest and most liquid market in the world.' },
  { t:'The major pairs explained',           d:'EUR/USD, USD/JPY, GBP/USD and USD/CHF are the majors. Tightest spreads, deepest liquidity — which is why MyTradeApp focuses on EUR/USD first.' },
  { t:'What is a pip?',                      d:'The smallest standardised move in a currency pair — usually 0.0001 for most pairs and 0.01 for JPY pairs. Pip value depends on lot size and account currency.' },
  { t:'Lots, mini lots and micro lots',      d:'Standard lot = 100,000 units. Mini = 10,000. Micro = 1,000. Position sizing tools work in all three, so a $200 account can trade without over-leveraging.' },
  { t:'Leverage and margin',                 d:'Leverage lets you control a large position with a small deposit. It magnifies both profits and losses. Margin is the collateral your broker locks while the trade is open.' },
  { t:'Trading sessions',                    d:'Forex runs 24/5 across three overlapping sessions: Sydney/Tokyo, London, and New York. Volatility peaks during the London–New York overlap.' },
  { t:'Technical vs fundamental analysis',   d:'Technical analysis studies price structure and momentum. Fundamental analysis studies interest rates, inflation and geopolitics. Serious traders use both.' },
  { t:'Risk management rules',               d:'The golden rule: never risk more than 1–2% of your account on a single trade. The second rule: always use a stop-loss. MyTradeApp enforces both.' },
];

const GLOSSARY = [
  { k:'Spread',      v:'The difference between the bid and ask price — your cost to enter a trade.' },
  { k:'Leverage',    v:'A multiplier that lets you control a larger position than your deposit would allow.' },
  { k:'Margin call', v:'A broker demand for additional funds when your equity falls below required margin.' },
  { k:'Drawdown',    v:'The peak-to-trough decline in your equity. The single most important risk metric.' },
  { k:'Stop-loss',   v:'A pre-set order that closes your trade automatically at a defined loss level.' },
  { k:'Take-profit', v:'A pre-set order that closes your trade once a profit target is hit.' },
  { k:'Slippage',    v:'The difference between the expected price and the actual fill price on execution.' },
  { k:'Win rate',    v:'The percentage of trades that close in profit. Meaningless without average risk/reward.' },
  { k:'Expectancy',  v:'Average profit per trade: (win rate × avg win) − (loss rate × avg loss).' },
  { k:'Sharpe ratio', v:'Return per unit of risk. Above 1.0 is good; above 2.0 is considered excellent.' },
];

const SESSIONS = [
  { name:'Sydney',   hours:'22:00 – 07:00 UTC', color:'#a855f7', note:'Thin liquidity · tight ranges · AUD & NZD most active' },
  { name:'Tokyo',    hours:'00:00 – 09:00 UTC', color:'#3b82f6', note:'JPY pairs dominate · steady, methodical price action' },
  { name:'London',   hours:'07:00 – 16:00 UTC', color:'#22c55e', note:'Highest volume · strongest trends · EUR & GBP active' },
  { name:'New York', hours:'12:00 – 21:00 UTC', color:'#f5a524', note:'US data drops · high volatility · USD & gold move hard' },
];

const PIP_TABLE = [
  { pair:'EUR/USD', pip:'0.0001', std:'$10.00', mini:'$1.00', micro:'$0.10' },
  { pair:'GBP/USD', pip:'0.0001', std:'$10.00', mini:'$1.00', micro:'$0.10' },
  { pair:'USD/JPY', pip:'0.01',   std:'$9.10',  mini:'$0.91', micro:'$0.09' },
  { pair:'XAU/USD', pip:'0.01',   std:'$1.00',  mini:'$0.10', micro:'$0.01' },
  { pair:'BTC/USD', pip:'$1.00',  std:'$1.00',  mini:'$0.10', micro:'$0.01' },
];

const ARTICLES = [
  { cat:'Risk',       title:'Why 1% risk per trade beats every indicator you will ever buy', read:'6 min',  date:'Oct 12, 2026' },
  { cat:'Strategy',   title:'The London Breakout, explained step by step with real examples', read:'9 min',  date:'Oct 8, 2026'  },
  { cat:'Psychology', title:'How to stop revenge trading after a loss — a practical framework', read:'5 min', date:'Oct 3, 2026'  },
  { cat:'Gold',       title:'Trading XAU/USD around NFP: a practical, no-nonsense guide',    read:'7 min',  date:'Sep 28, 2026' },
  { cat:'Crypto',     title:'Why BTC/USD behaves differently from every other market',       read:'8 min',  date:'Sep 22, 2026' },
  { cat:'Systems',    title:'Backtesting your first strategy without fooling yourself',       read:'10 min', date:'Sep 15, 2026' },
];

const PRICING = [
  { name:'Starter', price:'Free', period:'forever', highlight:false,
    desc:'For traders who want the core tools before committing a cent.',
    features:['Lot size calculator','Currency strength meter','Economic calendar','Pip value table','Community access','Mobile app access'],
    cta:'Start free' },
  { name:'Trader', price:'$29', period:'/ month', highlight:true,
    desc:'For active retail traders running one or two live bots.',
    features:['Everything in Starter','2 active bots','Live signal alerts','Trade journal & analytics','Backtesting engine','Priority email support','Mobile push alerts'],
    cta:'Choose Trader' },
  { name:'Pro', price:'$79', period:'/ month', highlight:false,
    desc:'For serious traders running a full portfolio of automated strategies.',
    features:['Everything in Trader','Unlimited bots','Strategy builder','VPS hosting included','1-on-1 coaching (1/mo)','Full API access','Priority chat support'],
    cta:'Go Pro' },
];

const FAQS = [
  { q:'Is MyTradeApp a broker?',                          a:'No. MyTradeApp is a third-party analytics and automation layer built by Tonny. You keep your own broker account and we give you the tools to trade it better.' },
  { q:'Which instruments do the bots trade?',             a:'Three only: EUR/USD, BTC/USD and XAU/USD. Focusing on a small set lets us tune each strategy far more precisely than a generic multi-asset bot.' },
  { q:'Do I need coding experience?',                     a:'None at all. Every bot is pre-built and configurable from the dashboard. If you can toggle a switch and type a risk %, you can run one.' },
  { q:'How is risk handled?',                             a:'Every position is sized from your balance and a stop-loss distance. The risk manager enforces a daily loss cap and warns you before margin gets dangerous.' },
  { q:'Can I run bots and manual trades together?',       a:'Yes. Both sit in the same book and the dashboard aggregates P/L, margin and exposure across both.' },
  { q:'Do I need a VPS?',                                 a:'Not strictly, but recommended. A London or New York VPS keeps latency under 2ms and prevents the platform from going offline mid-trade.' },
  { q:'Can I cancel my subscription anytime?',            a:'Yes. No lock-in contracts. Cancel from your dashboard with one click and keep full access until the end of your billing period.' },
  { q:'What is the minimum account size?',                a:'You can run the tools on any account size, but we recommend at least $500 to trade the bots with sensible risk. Below that, the lot size calculator returns micro lots.' },
  { q:'How do you handle slippage and spread?',           a:'Bots place limit orders where possible and use maximum-slippage caps. The journal logs exact fill versus intended price so you can see real execution quality.' },
  { q:'Are the backtests realistic?',                     a:'Yes. The backtesting engine applies spread, commission and slippage models to historical tick data. Results are designed to be reproducible in the live market.' },
];

const QUOTES = [
  'Discipline beats prediction every single time.',
  'The market pays patience, not activity.',
  'Amateurs chase trades. Professionals size them.',
  'Consistency compounds — recklessness compounds faster.',
];

/* ================================================================ */
/*  ICONS                                                           */
/* ================================================================ */
const Icon = ({ name, size = 20 }) => {
  const p = { width:size, height:size, viewBox:'0 0 24 24', fill:'none',
    stroke:'currentColor', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' };
  switch (name) {
    case 'book':  return <svg {...p}><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 7h7M8 11h7"/></svg>;
    case 'chart': return <svg {...p}><path d="M3 17l5-6 4 4 8-9"/><path d="M15 6h5v5"/></svg>;
    case 'users': return <svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M3 20v-1.5A4.5 4.5 0 017.5 14h3A4.5 4.5 0 0115 18.5V20"/><path d="M17 11a3 3 0 100-6"/><path d="M21 20v-1.5a4.5 4.5 0 00-3.5-4.36"/></svg>;
    case 'medal': return <svg {...p}><circle cx="12" cy="15" r="5.5"/><path d="M8.5 9.5L6 3h12l-2.5 6.5"/></svg>;
    case 'bot':   return <svg {...p}><rect x="3.5" y="7.5" width="17" height="12" rx="3.5"/><path d="M12 7.5V4"/><circle cx="12" cy="3.4" r="1"/><path d="M9 13h.01M15 13h.01"/><path d="M9.5 16.5h5"/></svg>;
    case 'calc':  return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 7.5h8"/><path d="M8 12h1.5M12 12h1.5M16 12h.01M8 16h1.5M12 16h1.5M16 16h.01"/></svg>;
    case 'bars':  return <svg {...p}><path d="M5 20v-8M12 20V4M19 20v-5"/></svg>;
    case 'bell':  return <svg {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>;
    case 'shield':return <svg {...p}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'journal':return <svg {...p}><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 8h7M8 12h7M8 16h4"/></svg>;
    case 'flask': return <svg {...p}><path d="M3 20h18"/><path d="M6 20V9l4 4 4-8 4 6v9"/></svg>;
    case 'user':  return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>;
    case 'arrow': return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'star':  return <svg {...p} fill="currentColor" stroke="none"><path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9l6.6-.9z"/></svg>;
    case 'phone': return <svg {...p}><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M12 18h.01"/></svg>;
    default: return null;
  }
};

/* ================================================================ */
/*  MAIN                                                            */
/* ================================================================ */
export default function ForexHome({
  pairs, positions = [], account, equityHistory = [], strength,
  onTrade, onClosePosition, onViewChange,
}) {
  const go = (k) => onViewChange && onViewChange(k);

  const priceOf  = (sym) => pairs?.[sym]?.price ?? 0;
  const changeOf = (sym) => {
    const p = pairs?.[sym];
    if (!p || !p.open) return 0;
    return ((p.price - p.open) / p.open) * 100;
  };

  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,900&family=Inter:wght@400;600;700;800;900&family=JetBrains+Mono:wght@600;700;800&display=swap');

        /* ============================================================
           FORCE THE VIEW CONTAINER TO SCROLL
           ============================================================ */
        .view.active,
        .view.active.tf-page {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: 100% !important;
          max-height: 100vh;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        .tf-page{
          background:${C.bg};
          color:${C.text};
          min-height:100%;
          display:block;
          font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        }
        .tf-page *{ box-sizing:border-box; }

        /* ---------- wrappers ---------- */
        .tf-wrap{ max-width:1240px; margin:0 auto; width:100%; padding:0 22px; }
        .tf-sec{ padding:80px 0; }
        .tf-sec-sm{ padding:52px 0; }
        .tf-alt{ background:${C.bg2}; }

        .tf-eyebrow{ display:inline-flex; align-items:center; gap:8px; font-size:11px;
          font-weight:800; letter-spacing:1.6px; text-transform:uppercase;
          color:${C.gold}; margin-bottom:14px; }
        .tf-eyebrow::before{ content:''; width:22px; height:2px; background:${C.gold}; }

        .tf-h2{ font-size:42px; line-height:1.1; font-weight:800; letter-spacing:-1.5px;
          color:${C.text}; margin:0 0 14px; }
        .tf-h2 .g{ color:${C.gold}; }
        .tf-sub{ font-size:15px; line-height:1.65; color:${C.text2};
          max-width:640px; margin:0 auto; }
        .tf-head{ text-align:center; margin-bottom:52px; }
        .tf-head .tf-eyebrow{ display:inline-flex; }

        /* ---------- buttons ---------- */
        .tf-btn{ display:inline-flex; align-items:center; justify-content:center;
          gap:9px; padding:15px 30px; border-radius:10px; border:none;
          font-family:inherit; font-size:14.5px; font-weight:700;
          letter-spacing:.1px; cursor:pointer;
          transition:.2s cubic-bezier(.16,1,.3,1); white-space:nowrap; }
        .tf-btn-gold{ background:${C.gold}; color:#0a0a0a;
          box-shadow:0 8px 22px rgba(245,180,0,.28); }
        .tf-btn-gold:hover{ background:${C.gold2}; transform:translateY(-2px);
          box-shadow:0 14px 30px rgba(245,180,0,.4); }
        .tf-btn-outline{ background:transparent; color:${C.gold};
          border:1.5px solid ${C.gold}; }
        .tf-btn-outline:hover{ background:${C.goldSoft}; transform:translateY(-2px); }
        .tf-btn-sm{ padding:10px 18px; font-size:12.5px; }
        .pos{ color:${C.green}; } .neg{ color:${C.red}; }

        /* ============================================================
           HERO — SUPER UI
           ============================================================ */
        .tf-hero{ position:relative; overflow:hidden;
          padding:112px 0 128px; text-align:center;
          background:
            radial-gradient(ellipse 900px 500px at 50% -10%, rgba(245,180,0,.14), transparent 65%),
            radial-gradient(ellipse 700px 400px at 50% 110%, rgba(245,180,0,.05), transparent 60%),
            linear-gradient(180deg, #0a0a0a 0%, #070707 100%); }
        .tf-hero::before{ content:''; position:absolute; inset:0;
          pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px);
          background-size:52px 52px;
          mask-image:radial-gradient(ellipse at 50% 40%, black 20%, transparent 78%);
          -webkit-mask-image:radial-gradient(ellipse at 50% 40%, black 20%, transparent 78%); }

        /* Rotating gold conic glow behind the headline */
        .tf-hero::after{
          content:'';
          position:absolute;
          top:-260px; left:50%;
          width:900px; height:900px;
          margin-left:-450px;
          border-radius:50%;
          background:conic-gradient(from 0deg,
            transparent 0deg,
            rgba(245,180,0,.12) 60deg,
            transparent 130deg,
            rgba(245,180,0,.08) 240deg,
            transparent 300deg);
          filter:blur(60px);
          animation:tfSpinSlow 40s linear infinite;
          pointer-events:none;
          z-index:0;
        }
        @keyframes tfSpinSlow{ to{ transform:rotate(360deg); } }

        .tf-candles{ position:absolute; inset:0; pointer-events:none; opacity:.5; z-index:1; }
        .tf-candles svg{ width:100%; height:100%; }

        .tf-hero-inner{ position:relative; z-index:2; max-width:980px;
          margin:0 auto; padding:0 22px; }

        /* Badge above headline */
        .tf-hero-badge{
          display:inline-flex; align-items:center; gap:10px;
          padding:8px 18px 8px 12px;
          border-radius:100px;
          background:rgba(245,180,0,.08);
          border:1px solid rgba(245,180,0,.28);
          font-family:'JetBrains Mono',monospace;
          font-size:11.5px; font-weight:700;
          letter-spacing:1.4px; text-transform:uppercase;
          color:${C.gold};
          margin-bottom:32px;
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
        }
        .tf-hero-badge .pulse{
          width:7px; height:7px; border-radius:50%;
          background:${C.green};
          box-shadow:0 0 10px ${C.green};
          animation:tfPulseDot 2s ease-in-out infinite;
        }
        @keyframes tfPulseDot{
          0%,100%{ opacity:1; transform:scale(1); }
          50%{ opacity:.55; transform:scale(1.35); }
        }

        /* Headline composition */
        .tf-hero-head{ margin:0 0 30px; }

        /* Line 1: "Master Forex Trading" — Playfair Display, italic serif */
        .tf-hero-line1{
          display:block;
          font-family:'Playfair Display', Georgia, serif;
          font-style:italic;
          font-weight:700;
          font-size:72px;
          line-height:1.02;
          letter-spacing:-2.4px;
          color:${C.text};
          text-shadow:
            0 2px 30px rgba(0,0,0,.6),
            0 0 60px rgba(245,180,0,.08);
          animation:tfRiseIn .9s cubic-bezier(.16,1,.3,1) both;
        }

        /* Line 2: "with Tonnyfx" — massive gradient gold */
        .tf-hero-line2{
          display:block;
          margin-top:6px;
          font-family:'Inter', sans-serif;
          font-weight:900;
          font-size:120px;
          line-height:.95;
          letter-spacing:-6px;
          background:linear-gradient(180deg, #fff5cc 0%, ${C.gold} 45%, ${C.gold2} 100%);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
          -webkit-text-fill-color:transparent;
          filter:drop-shadow(0 8px 30px rgba(245,180,0,.35));
          animation:tfRiseIn .9s .1s cubic-bezier(.16,1,.3,1) both;
        }

        @keyframes tfRiseIn{
          from{ opacity:0; transform:translateY(26px); filter:blur(6px); }
          to{ opacity:1; transform:translateY(0); filter:blur(0); }
        }

        /* Word divider under headline */
        .tf-hero-divider{
          display:flex; align-items:center; justify-content:center;
          gap:14px; margin:0 auto 32px; max-width:340px;
          opacity:0;
          animation:tfFadeIn .9s .35s ease-out both;
        }
        .tf-hero-divider .line{
          flex:1; height:1px;
          background:linear-gradient(90deg, transparent, rgba(245,180,0,.6), transparent);
        }
        .tf-hero-divider .dot{
          width:6px; height:6px; border-radius:50%;
          background:${C.gold};
          box-shadow:0 0 12px ${C.gold};
        }
        @keyframes tfFadeIn{ to{ opacity:1; } }

        /* Lead paragraph with side accents */
        .tf-hero-lead{
          position:relative;
          display:inline-block;
          font-family:'Inter', sans-serif;
          font-size:17.5px;
          font-weight:500;
          line-height:1.65;
          color:${C.text2};
          max-width:660px;
          margin:0 auto 40px;
          padding:0 22px;
          opacity:0;
          animation:tfFadeIn .9s .5s ease-out both;
        }
        .tf-hero-lead::before,
        .tf-hero-lead::after{
          content:'';
          position:absolute;
          top:50%;
          width:3px;
          height:3px;
          border-radius:50%;
          background:${C.gold};
          transform:translateY(-50%);
          opacity:.6;
        }
        .tf-hero-lead::before{ left:0; }
        .tf-hero-lead::after{ right:0; }

        .tf-hero-cta{
          display:flex; justify-content:center; gap:14px;
          flex-wrap:wrap; margin-bottom:50px;
          opacity:0;
          animation:tfFadeIn .9s .6s ease-out both;
        }

        /* Trust row upgraded */
        .tf-trust{
          display:flex; justify-content:center; gap:36px; flex-wrap:wrap;
          opacity:0;
          animation:tfFadeIn .9s .75s ease-out both;
        }
        .tf-trust span{
          display:flex; align-items:center; gap:10px;
          font-family:'JetBrains Mono', monospace;
          font-size:12px; font-weight:700;
          letter-spacing:1.2px; text-transform:uppercase;
          color:${C.text2};
          padding:9px 16px;
          border-radius:100px;
          background:rgba(255,255,255,.025);
          border:1px solid ${C.border};
        }
        .tf-trust svg{ color:${C.gold}; flex-shrink:0; }

        /* ---------- FOUNDER ---------- */
        .tf-founder{ display:grid; grid-template-columns:320px 1fr; gap:44px;
          padding:44px; border-radius:20px; border:1px solid ${C.border};
          background:linear-gradient(180deg, ${C.card} 0%, ${C.bg2} 100%);
          position:relative; overflow:hidden; }
        .tf-founder::before{ content:''; position:absolute; top:-140px; right:-140px;
          width:380px; height:380px; border-radius:50%;
          background:radial-gradient(circle, ${C.goldSoft}, transparent 70%);
          pointer-events:none; }
        .tf-founder-photo{ position:relative; align-self:start; }
        .tf-founder-photo img{ display:block; width:100%; aspect-ratio:1/1;
          object-fit:cover; border-radius:16px; background:${C.card2};
          border:1px solid ${C.border2}; }
        .tf-founder-tag{ position:absolute; left:16px; bottom:16px;
          padding:7px 16px; border-radius:22px; background:${C.gold};
          color:#0a0a0a; font-size:10px; font-weight:900; letter-spacing:1.3px;
          text-transform:uppercase; }
        .tf-founder-body{ position:relative; z-index:1; }
        .tf-founder-name{ font-size:32px; font-weight:800; letter-spacing:-1px;
          color:${C.text}; margin:0 0 8px; }
        .tf-founder-role{ font-size:13px; font-weight:700; letter-spacing:.9px;
          text-transform:uppercase; color:${C.gold}; margin-bottom:22px; }
        .tf-founder-bio{ font-size:14.5px; line-height:1.85; color:${C.text2};
          margin:0 0 28px; }
        .tf-founder-bio strong{ color:${C.text}; font-weight:700; }
        .tf-founder-stats{ display:grid; grid-template-columns:repeat(4,1fr);
          gap:20px; padding-top:26px; border-top:1px solid ${C.border}; }
        .tf-fstat .n{ font-family:'JetBrains Mono',monospace; font-size:26px;
          font-weight:800; letter-spacing:-1px; color:${C.gold}; line-height:1; }
        .tf-fstat .l{ font-size:10.5px; font-weight:700; letter-spacing:1px;
          text-transform:uppercase; color:${C.text3}; margin-top:8px; }

        /* ---------- SERVICES ---------- */
        .tf-services{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .tf-service{ padding:28px 22px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card}; cursor:pointer;
          transition:.24s cubic-bezier(.16,1,.3,1);
          position:relative; overflow:hidden; }
        .tf-service::before{ content:''; position:absolute; top:0; left:0; right:0;
          height:2px; background:${C.gold}; opacity:0; transition:opacity .25s; }
        .tf-service:hover{ transform:translateY(-4px);
          border-color:${C.goldBorder}; background:${C.card2}; }
        .tf-service:hover::before{ opacity:1; }
        .tf-service-icon{ width:46px; height:46px; border-radius:12px;
          display:grid; place-items:center; margin-bottom:18px;
          background:${C.goldSoft}; border:1px solid ${C.goldBorder};
          color:${C.gold}; }
        .tf-service h3{ font-size:15px; font-weight:800; color:${C.text};
          margin:0 0 9px; letter-spacing:-.2px; }
        .tf-service p{ font-size:12.5px; line-height:1.65; color:${C.text2};
          margin:0 0 16px; min-height:66px; }
        .tf-service-cta{ display:inline-flex; align-items:center; gap:6px;
          font-size:11.5px; font-weight:800; letter-spacing:.4px;
          color:${C.gold}; text-transform:uppercase; }
        .tf-service-cta::after{ content:'→'; transition:transform .2s; }
        .tf-service:hover .tf-service-cta::after{ transform:translateX(4px); }

        /* ---------- BASICS ---------- */
        .tf-basics{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
        .tf-basic{ padding:24px 26px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card};
          transition:.22s; }
        .tf-basic:hover{ border-color:${C.goldBorder}; }
        .tf-basic h4{ font-size:14px; font-weight:800; color:${C.text};
          margin:0 0 8px; }
        .tf-basic p{ font-size:12.5px; line-height:1.7; color:${C.text2};
          margin:0; }

        /* ---------- SESSIONS ---------- */
        .tf-sessions{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .tf-session{ padding:24px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card};
          position:relative; overflow:hidden; }
        .tf-session::before{ content:''; position:absolute; top:0; left:0;
          bottom:0; width:3px; background:var(--sc); }
        .tf-session .nm{ font-size:15px; font-weight:800; color:${C.text};
          margin-bottom:6px; }
        .tf-session .hr{ font-family:'JetBrains Mono',monospace;
          font-size:11.5px; font-weight:700; color:var(--sc);
          margin-bottom:12px; }
        .tf-session .nt{ font-size:11.5px; line-height:1.6;
          color:${C.text2}; }

        /* ---------- PIP TABLE ---------- */
        .tf-tbl-wrap{ border-radius:14px; border:1px solid ${C.border};
          background:${C.card}; overflow:hidden; }
        .tf-tbl{ width:100%; border-collapse:collapse; }
        .tf-tbl th{ text-align:left; padding:16px 22px;
          font-size:10.5px; font-weight:800; letter-spacing:1px;
          text-transform:uppercase; color:${C.text3};
          background:${C.bg2}; border-bottom:1px solid ${C.border}; }
        .tf-tbl th.r, .tf-tbl td.r{ text-align:right; }
        .tf-tbl td{ padding:16px 22px; font-size:13px;
          color:${C.text2}; border-bottom:1px solid ${C.border}; }
        .tf-tbl tr:last-child td{ border-bottom:none; }
        .tf-tbl td.num{ font-family:'JetBrains Mono',monospace;
          font-size:12.5px; font-weight:700; color:${C.text}; }
        .tf-tbl tr:hover td{ background:rgba(245,180,0,.03); }

        /* ---------- GLOSSARY ---------- */
        .tf-gloss{ display:grid; grid-template-columns:repeat(2,1fr);
          gap:10px; }
        .tf-term{ display:flex; gap:16px; align-items:flex-start;
          padding:16px 18px; border-radius:12px;
          border:1px solid ${C.border}; background:${C.card}; }
        .tf-term .k{ font-family:'JetBrains Mono',monospace;
          font-size:12px; font-weight:800; color:${C.gold};
          min-width:100px; padding-top:2px; }
        .tf-term .v{ font-size:12.5px; line-height:1.65;
          color:${C.text2}; }

        /* ---------- MILESTONES ---------- */
        .tf-miles{ display:grid; grid-template-columns:repeat(4,1fr);
          gap:14px; }
        .tf-mile{ padding:28px 22px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card};
          text-align:center; }
        .tf-mile .n{ font-family:'JetBrains Mono',monospace;
          font-size:28px; font-weight:800; letter-spacing:-1.2px;
          color:${C.gold}; line-height:1; margin-bottom:10px; }
        .tf-mile .l{ font-size:10.5px; font-weight:700;
          letter-spacing:1px; text-transform:uppercase;
          color:${C.text3}; }

        /* ---------- PRICING ---------- */
        .tf-pricing{ display:grid; grid-template-columns:repeat(3,1fr);
          gap:16px; }
        .tf-plan{ position:relative; padding:32px 28px 28px;
          border-radius:18px; border:1px solid ${C.border};
          background:${C.card}; transition:.24s; }
        .tf-plan.hl{ border-color:${C.gold};
          background:
            radial-gradient(ellipse at 50% 0%, ${C.goldSoft}, transparent 60%),
            ${C.card};
          box-shadow:0 22px 52px rgba(245,180,0,.15); }
        .tf-plan .pop{ position:absolute; top:-12px; left:50%;
          transform:translateX(-50%); padding:6px 16px; border-radius:22px;
          background:${C.gold}; color:#0a0a0a; font-size:9.5px;
          font-weight:900; letter-spacing:1.2px; text-transform:uppercase; }
        .tf-plan h4{ font-size:14px; font-weight:800; letter-spacing:.7px;
          text-transform:uppercase; color:${C.gold}; margin-bottom:14px; }
        .tf-plan .price{ display:flex; align-items:baseline; gap:6px;
          margin-bottom:16px; }
        .tf-plan .price .a{ font-family:'JetBrains Mono',monospace;
          font-size:38px; font-weight:800; letter-spacing:-1.6px;
          color:${C.text}; line-height:1; }
        .tf-plan .price .p{ font-size:12.5px; color:${C.text3};
          font-weight:600; }
        .tf-plan .desc{ font-size:12.5px; line-height:1.65;
          color:${C.text2}; margin-bottom:22px; min-height:42px; }
        .tf-plan ul{ list-style:none; padding:0; margin:0 0 22px;
          display:flex; flex-direction:column; gap:10px; }
        .tf-plan li{ display:flex; align-items:flex-start; gap:10px;
          font-size:12.5px; line-height:1.5; color:${C.text2}; }
        .tf-plan li::before{ content:'✓'; color:${C.gold};
          font-weight:900; font-size:13px; flex-shrink:0;
          margin-top:1px; }
        .tf-plan .tf-btn{ width:100%; }

        /* ---------- ARTICLES ---------- */
        .tf-articles{ display:grid; grid-template-columns:repeat(3,1fr);
          gap:14px; }
        .tf-article{ padding:24px 22px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card};
          cursor:pointer; transition:.22s; }
        .tf-article:hover{ border-color:${C.goldBorder};
          transform:translateY(-3px); }
        .tf-article .cat{ font-size:9.5px; font-weight:800;
          letter-spacing:1.1px; text-transform:uppercase;
          color:${C.gold}; margin-bottom:12px; }
        .tf-article h5{ font-size:13.5px; font-weight:800;
          color:${C.text}; line-height:1.45; margin-bottom:14px;
          min-height:40px; }
        .tf-article .meta{ display:flex; justify-content:space-between;
          font-size:10.5px; color:${C.text3}; }

        /* ---------- NEWSLETTER ---------- */
        .tf-news{ padding:38px 34px; border-radius:16px;
          border:1px solid ${C.goldBorder};
          background:
            radial-gradient(ellipse at 100% 0%, ${C.goldSoft}, transparent 60%),
            ${C.card};
          display:grid; grid-template-columns:1.2fr 1fr;
          gap:32px; align-items:center; }
        .tf-news h3{ font-size:20px; font-weight:800;
          letter-spacing:-.5px; color:${C.text}; margin-bottom:10px; }
        .tf-news p{ font-size:12.5px; line-height:1.65;
          color:${C.text2}; margin:0; }
        .tf-news-form{ display:flex; gap:10px; flex-wrap:wrap; }
        .tf-news-form input{ flex:1 1 220px; padding:14px 16px;
          border-radius:10px; font-family:inherit; font-size:13px;
          color:${C.text}; background:${C.bg2};
          border:1px solid ${C.border2}; outline:none; }
        .tf-news-form input:focus{ border-color:${C.gold}; }

        /* ---------- FAQ ---------- */
        .tf-faq{ display:grid; grid-template-columns:1fr 1fr;
          gap:12px; }
        .tf-faq details{ border-radius:12px;
          border:1px solid ${C.border}; background:${C.card};
          overflow:hidden; }
        .tf-faq summary{ list-style:none; cursor:pointer;
          padding:18px 22px; display:flex; align-items:center;
          gap:12px; font-size:13.5px; font-weight:700;
          color:${C.text}; transition:.2s; }
        .tf-faq summary::-webkit-details-marker{ display:none; }
        .tf-faq summary::after{ content:'+'; margin-left:auto;
          font-size:20px; font-weight:400; color:${C.gold};
          transition:transform .22s; }
        .tf-faq details[open] summary::after{ transform:rotate(45deg); }
        .tf-faq summary:hover{ color:${C.gold}; }
        .tf-faq details p{ padding:0 22px 20px;
          font-size:13px; line-height:1.7; color:${C.text2};
          margin:0; }

        /* ---------- CTA ---------- */
        .tf-cta{ position:relative; overflow:hidden;
          padding:84px 40px; border-radius:22px;
          text-align:center; border:1px solid ${C.goldBorder};
          background:
            radial-gradient(ellipse at 50% 0%, rgba(245,180,0,.16), transparent 62%),
            linear-gradient(180deg, ${C.card} 0%, ${C.bg} 100%); }
        .tf-cta h2{ font-size:40px; font-weight:900;
          letter-spacing:-1.6px; color:${C.text};
          margin:0 0 16px; line-height:1.1; }
        .tf-cta h2 .g{ color:${C.gold}; }
        .tf-cta p{ font-size:15px; line-height:1.65;
          color:${C.text2}; max-width:580px;
          margin:0 auto 34px; }
        .tf-cta-row{ display:flex; justify-content:center;
          gap:14px; flex-wrap:wrap; }

        /* ---------- NOTICE ---------- */
        .tf-notice{ display:flex; align-items:flex-start; gap:12px;
          padding:20px 22px; border-radius:12px;
          background:rgba(245,180,0,.05);
          border:1px solid rgba(245,180,0,.18); }
        .tf-notice svg{ width:18px; height:18px; flex-shrink:0;
          margin-top:1px; stroke:${C.gold}; fill:none;
          stroke-width:1.8; stroke-linecap:round;
          stroke-linejoin:round; }
        .tf-notice span{ font-size:12.5px; line-height:1.7;
          color:${C.text2}; }

        /* ============================================================
           RESPONSIVE
           ============================================================ */
        @media (max-width:1100px){
          .tf-hero-line1{ font-size:58px; letter-spacing:-1.8px; }
          .tf-hero-line2{ font-size:96px; letter-spacing:-4.4px; }
          .tf-services{ grid-template-columns:repeat(2,1fr); }
          .tf-h2{ font-size:36px; letter-spacing:-1.2px; }
          .tf-articles{ grid-template-columns:repeat(2,1fr); }
          .tf-sessions{ grid-template-columns:repeat(2,1fr); }
          .tf-pricing{ grid-template-columns:1fr; max-width:520px; margin:0 auto; }
        }

        @media (max-width:900px){
          .tf-hero{ padding:88px 0 100px; }
          .tf-hero-line1{ font-size:46px; letter-spacing:-1.4px; }
          .tf-hero-line2{ font-size:76px; letter-spacing:-3.2px; margin-top:4px; }
          .tf-hero-lead{ font-size:15.5px; }
          .tf-founder{ grid-template-columns:1fr; gap:32px; padding:32px; }
          .tf-founder-photo{ max-width:320px; }
          .tf-founder-stats{ grid-template-columns:repeat(2,1fr); gap:22px; }
          .tf-sec{ padding:60px 0; }
          .tf-news{ grid-template-columns:1fr; gap:22px; padding:28px 26px; }
          .tf-miles{ grid-template-columns:repeat(2,1fr); }
        }

        @media (max-width:640px){
          .tf-wrap{ padding:0 16px; }
          .tf-hero{ padding:64px 0 76px; }
          .tf-hero-badge{ font-size:10px; padding:7px 14px 7px 10px; margin-bottom:24px; letter-spacing:1.1px; }
          .tf-hero-line1{ font-size:34px; letter-spacing:-.9px; }
          .tf-hero-line2{ font-size:56px; letter-spacing:-2.2px; margin-top:2px; }
          .tf-hero-divider{ margin-bottom:24px; max-width:220px; }
          .tf-hero-lead{ font-size:14.5px; margin-bottom:32px; padding:0 16px; }
          .tf-hero-cta{ gap:10px; margin-bottom:40px; }
          .tf-btn{ flex:1 1 100%; padding:14px 22px; font-size:13.5px; }
          .tf-trust{ gap:12px; }
          .tf-trust span{ font-size:10.5px; padding:7px 12px; letter-spacing:1px; }
          .tf-h2{ font-size:27px; letter-spacing:-.9px; }
          .tf-sub{ font-size:13.5px; }
          .tf-sec{ padding:52px 0; }
          .tf-sec-sm{ padding:40px 0; }
          .tf-head{ margin-bottom:38px; }
          .tf-services{ grid-template-columns:1fr; gap:12px; }
          .tf-service{ padding:22px 18px; }
          .tf-service p{ min-height:0; }
          .tf-founder{ padding:22px 18px; gap:26px; }
          .tf-founder-photo{ max-width:100%; }
          .tf-founder-name{ font-size:25px; }
          .tf-founder-bio{ font-size:13.5px; }
          .tf-founder-stats{ grid-template-columns:1fr 1fr; gap:18px; }
          .tf-fstat .n{ font-size:22px; }
          .tf-basics{ grid-template-columns:1fr; gap:11px; }
          .tf-sessions{ grid-template-columns:1fr; gap:11px; }
          .tf-gloss{ grid-template-columns:1fr; gap:9px; }
          .tf-miles{ grid-template-columns:1fr 1fr; gap:11px; }
          .tf-articles{ grid-template-columns:1fr; gap:11px; }
          .tf-tbl th, .tf-tbl td{ padding:12px 14px; font-size:12px; }
          .tf-news{ padding:24px 20px; }
          .tf-news h3{ font-size:18px; }
          .tf-news-form input{ flex:1 1 100%; }
          .tf-cta{ padding:54px 22px; border-radius:18px; }
          .tf-cta h2{ font-size:27px; letter-spacing:-1px; }
          .tf-cta p{ font-size:13.5px; }
          .tf-faq summary{ font-size:12.5px; padding:15px 18px; }
          .tf-faq details p{ padding:0 18px 17px; font-size:12.5px; }
        }

        @media (max-width:420px){
          .tf-hero-line1{ font-size:29px; }
          .tf-hero-line2{ font-size:46px; letter-spacing:-1.8px; }
          .tf-fstat .n{ font-size:19px; }
          .tf-founder-stats{ grid-template-columns:1fr; }
          .tf-miles{ grid-template-columns:1fr; }
        }
      `}</style>

      {/* ============ PAGE ROOT ============ */}
      <section className="view active tf-page">

        {/* ============================================================
            HERO — SUPER UI
           ============================================================ */}
        <div className="tf-hero">
          <div className="tf-candles">
            <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(34,197,94,.32)" />
                  <stop offset="100%" stopColor="rgba(34,197,94,0)" />
                </linearGradient>
                <linearGradient id="cr" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(239,68,68,.30)" />
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
                      fill={up ? 'url(#cg)' : 'url(#cr)'} />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="tf-hero-inner">
            <div className="tf-hero-badge">
              <span className="pulse" />
              Live · EUR/USD · BTC/USD · XAU/USD
            </div>

            <h1 className="tf-hero-head">
              <span className="tf-hero-line1">Master Forex Trading</span>
              <span className="tf-hero-line2">with Tonnyfx</span>
            </h1>

            <div className="tf-hero-divider">
              <span className="line" />
              <span className="dot" />
              <span className="line" />
            </div>

            <p className="tf-hero-lead">
              Learn, trade and grow with proven strategies and real results.
              MyTradeApp is the terminal I built for EUR/USD, BTC/USD and XAU/USD —
              bots, calculators and risk tools in one place.
            </p>

            <div className="tf-hero-cta">
              <button className="tf-btn tf-btn-gold" onClick={() => go('bots')}>
                Join MyTradeApp <Icon name="arrow" size={16} />
              </button>
              <button className="tf-btn tf-btn-outline" onClick={() => go('lot')}>
                Create Trading Account
              </button>
            </div>

            <div className="tf-trust">
              <span><Icon name="users" size={15} /> 3,200+ Traders</span>
              <span><Icon name="shield" size={15} /> Verified Results</span>
              <span><Icon name="phone" size={15} /> 24/7 Support</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            ABOUT (founder only)
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">About</div>
              <h2 className="tf-h2">About <span className="g">MyTradeApp</span></h2>
              <p className="tf-sub">
                MyTradeApp is a results-driven forex automation and trading-tools brand by Tonnyfx,
                helping traders from beginner to advanced become consistently profitable.
                We combine structured bots, live market analysis and a thriving community.
              </p>
            </div>

            <div className="tf-founder">
              <div className="tf-founder-photo">
                <img src={tonnyPhoto} alt="Tonny — founder of MyTradeApp" loading="lazy" />
                <span className="tf-founder-tag">Founder</span>
              </div>
              <div className="tf-founder-body">
                <h3 className="tf-founder-name">Tonny (Tonnyfx)</h3>
                <div className="tf-founder-role">Forex Trader · Mentor · Founder</div>
                <p className="tf-founder-bio">
                  Tonny is a full-time forex trader, mentor and the founder of MyTradeApp,
                  with <strong>over 10 years of experience</strong> in the financial markets.
                  Known for his practical, no-hype approach to trading, he focuses on helping
                  traders develop discipline, consistency and profitable habits through
                  mentorship and real market execution. He trades three instruments only —{' '}
                  <strong>EUR/USD, BTC/USD and XAU/USD</strong> — and every tool inside
                  MyTradeApp reflects that focus.
                </p>
                <div className="tf-founder-stats">
                  {STATS.map((s) => (
                    <div className="tf-fstat" key={s.l}>
                      <div className="n">{s.n}</div>
                      <div className="l">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            SERVICES (6 — backtest & coaching removed)
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Our Services</div>
              <h2 className="tf-h2">What <span className="g">MyTradeApp</span> provides</h2>
              <p className="tf-sub">
                Choose the service that fits your trading journey — from free tools
                to fully automated bots and risk management.
              </p>
            </div>
            <div className="tf-services">
              {SERVICES.map((s) => (
                <div className="tf-service" key={s.key}
                  onClick={() => go(s.key)} role="button" tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') go(s.key); }}>
                  <div className="tf-service-icon"><Icon name={s.icon} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="tf-service-cta">{s.cta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            FOREX BASICS
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Forex 101</div>
              <h2 className="tf-h2">Everything a new trader <span className="g">needs to know</span></h2>
              <p className="tf-sub">
                Straight answers to the questions every retail trader asks in their first month.
              </p>
            </div>
            <div className="tf-basics">
              {FOREX_BASICS.map((b) => (
                <div className="tf-basic" key={b.t}>
                  <h4>{b.t}</h4>
                  <p>{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            SESSIONS
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Market clock</div>
              <h2 className="tf-h2">The four <span className="g">forex sessions</span></h2>
              <p className="tf-sub">Know when the market moves — timing matters as much as direction.</p>
            </div>
            <div className="tf-sessions">
              {SESSIONS.map((s) => (
                <div className="tf-session" key={s.name} style={{ '--sc': s.color }}>
                  <div className="nm">{s.name}</div>
                  <div className="hr">{s.hours}</div>
                  <div className="nt">{s.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            PIP TABLE
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Reference</div>
              <h2 className="tf-h2">Pip value <span className="g">cheat-sheet</span></h2>
              <p className="tf-sub">What one pip is worth per lot size, for the instruments you actually trade.</p>
            </div>
            <div className="tf-tbl-wrap">
              <table className="tf-tbl">
                <thead>
                  <tr>
                    <th>Instrument</th>
                    <th className="r">1 Pip</th>
                    <th className="r">Standard lot</th>
                    <th className="r">Mini lot</th>
                    <th className="r">Micro lot</th>
                  </tr>
                </thead>
                <tbody>
                  {PIP_TABLE.map((r) => (
                    <tr key={r.pair}>
                      <td><strong style={{ color: C.text }}>{r.pair}</strong></td>
                      <td className="r num">{r.pip}</td>
                      <td className="r num">{r.std}</td>
                      <td className="r num">{r.mini}</td>
                      <td className="r num">{r.micro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============================================================
            GLOSSARY
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Glossary</div>
              <h2 className="tf-h2">Forex terms, <span className="g">defined plainly</span></h2>
            </div>
            <div className="tf-gloss">
              {GLOSSARY.map((g) => (
                <div className="tf-term" key={g.k}>
                  <div className="k">{g.k}</div>
                  <div className="v">{g.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            MILESTONES
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">By the numbers</div>
              <h2 className="tf-h2">The platform in <span className="g">real numbers</span></h2>
            </div>
            <div className="tf-miles">
              {MILESTONES.map((m) => (
                <div className="tf-mile" key={m.l}>
                  <div className="n">{m.n}</div>
                  <div className="l">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            QUOTE ROTATOR
           ============================================================ */}
        <div className="tf-wrap tf-sec-sm">
          <div style={{
            padding:'30px 40px', borderRadius:16,
            border:`1px solid ${C.border}`, background:C.card,
            display:'flex', alignItems:'center', gap:22,
          }}>
            <div style={{
              fontFamily:'Georgia,serif', fontSize:56, lineHeight:.55,
              color:C.gold, opacity:.35, flexShrink:0,
            }}>“</div>
            <div style={{
              fontSize:17, fontWeight:600, color:C.text,
              letterSpacing:-.3, lineHeight:1.5,
            }}>{QUOTES[quoteIdx]}</div>
          </div>
        </div>

        {/* ============================================================
            PRICING
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Pricing</div>
              <h2 className="tf-h2">Simple plans. <span className="g">No lock-in.</span></h2>
              <p className="tf-sub">Start free, upgrade when you are ready to run live bots.</p>
            </div>
            <div className="tf-pricing">
              {PRICING.map((p) => (
                <div className={`tf-plan ${p.highlight ? 'hl' : ''}`} key={p.name}>
                  {p.highlight && <span className="pop">Most popular</span>}
                  <h4>{p.name}</h4>
                  <div className="price">
                    <span className="a">{p.price}</span>
                    <span className="p">{p.period}</span>
                  </div>
                  <div className="desc">{p.desc}</div>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <button className={`tf-btn ${p.highlight ? 'tf-btn-gold' : 'tf-btn-outline'}`}
                    onClick={() => go('bots')}>
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            ARTICLES
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">From the journal</div>
              <h2 className="tf-h2">Latest <span className="g">articles & guides</span></h2>
              <p className="tf-sub">
                Written by Tonny and the community — practical, no-hype content, updated weekly.
              </p>
            </div>
            <div className="tf-articles">
              {ARTICLES.map((a) => (
                <div className="tf-article" key={a.title}>
                  <div className="cat">{a.cat}</div>
                  <h5>{a.title}</h5>
                  <div className="meta">
                    <span>{a.date}</span>
                    <span>{a.read}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            NEWSLETTER
           ============================================================ */}
        <div className="tf-wrap tf-sec-sm">
          <div className="tf-news">
            <div>
              <h3>Get one useful forex idea each week.</h3>
              <p>
                No spam, no affiliate links. Just a short note on what moved in EUR/USD,
                BTC/USD and XAU/USD, plus one practical risk tip. Unsubscribe anytime.
              </p>
            </div>
            <form className="tf-news-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@email.com" aria-label="Email address" />
              <button className="tf-btn tf-btn-gold" type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* ============================================================
            FAQ
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">FAQ</div>
              <h2 className="tf-h2">Questions traders <span className="g">ask first</span></h2>
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
        </div>

        {/* ============================================================
            FINAL CTA
           ============================================================ */}
        <div className="tf-wrap tf-sec">
          <div className="tf-cta">
            <h2>Ready to trade with <span className="g">an edge</span>?</h2>
            <p>
              Start with the free tools, then let a bot handle the execution. No broker lock-in,
              no hidden promises — just a better way to trade EUR/USD, BTC/USD and XAU/USD.
            </p>
            <div className="tf-cta-row">
              <button className="tf-btn tf-btn-gold" onClick={() => go('bots')}>
                Join MyTradeApp <Icon name="arrow" size={16} />
              </button>
              <button className="tf-btn tf-btn-outline" onClick={() => go('strength')}>
                Check Currency Strength
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            NOTICE
           ============================================================ */}
        <div className="tf-wrap" style={{ paddingBottom: 60 }}>
          <div className="tf-notice">
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