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
const MARKETS = [
  { sym:'EURUSD', label:'EUR/USD', name:'Euro / US Dollar', tag:'Major',
    desc:'The world’s most liquid pair. Tight spreads, deep liquidity and clean directional trends during London and New York.',
    spread:'0.4 pips', session:'London · New York', vol:'Medium', atr:'65 pips' },
  { sym:'BTCUSD', label:'BTC/USD', name:'Bitcoin / US Dollar', tag:'Crypto',
    desc:'24/7 volatility with enormous intraday ranges. Built for momentum, breakout and session-based automation.',
    spread:'$12', session:'24 / 7', vol:'High', atr:'$1,200' },
  { sym:'XAUUSD', label:'XAU/USD', name:'Gold / US Dollar', tag:'Metal',
    desc:'The classic safe-haven asset. Strong directional runs during risk-off flows and US data releases.',
    spread:'18 pts', session:'London · New York', vol:'High', atr:'$24' },
];

const FEATURES = [
  { icon:'book',  title:'Structured Learning',    desc:'From beginner to advanced — a curriculum designed for real, measurable results.' },
  { icon:'chart', title:'Live Market Analysis',   desc:'Daily breakdowns and real-time trading sessions across EUR/USD, gold and crypto.' },
  { icon:'users', title:'Thriving Community',     desc:'Connect with 3,200+ traders on their journey to consistent profitability.' },
  { icon:'medal', title:'Proven Track Record',    desc:'Verified results with consistent monthly returns — logged and shown openly.' },
];

const SERVICES = [
  { key:'bots',     title:'Automated Trading Bots',    desc:'Six pre-built strategies tuned for EUR/USD, BTC/USD and XAU/USD. Toggle on and let them run.',              cta:'Manage bots', icon:'bot' },
  { key:'lot',      title:'Lot Size Calculator',       desc:'Risk-based sizing on every instrument. Balance, risk % and stop-loss — instant lot size.',                  cta:'Calculate',   icon:'calc' },
  { key:'strength', title:'Currency Strength Meter',   desc:'Rank the eight majors against a weighted basket. Spot the strongest and weakest in one glance.',           cta:'View strength', icon:'bars' },
  { key:'signals',  title:'Live Signal Alerts',        desc:'Momentum, breakout and mean-reversion alerts the moment price structure shifts on your watchlist.',        cta:'See alerts',  icon:'bell' },
  { key:'risk',     title:'Risk & Margin Manager',     desc:'Real-time margin level, free margin and exposure warnings — so one trade never takes down your account.',  cta:'Review risk', icon:'shield' },
  { key:'journal',  title:'Trade Journal & Analytics', desc:'Every fill and every pip logged automatically. Win rate, expectancy, drawdown, equity curve.',              cta:'Open journal', icon:'journal' },
  { key:'backtest', title:'Backtesting Engine',        desc:'Run any bot against years of tick data before risking a cent. Drawdown, Sharpe and profit factor up front.', cta:'Run backtest', icon:'flask' },
  { key:'coaching', title:'1-on-1 Coaching',           desc:'Direct sessions with Tonny covering risk, journaling, bot selection and strategy design.',                 cta:'Book session', icon:'user' },
];

const BOTS = [
  { name:'Pip Scalper',      market:'EUR/USD', tf:'M5',  win:68, trades:1243, dd:'4.2%',  pf:2.1, sharpe:1.8, live:true },
  { name:'Momentum Rider',   market:'BTC/USD', tf:'H1',  win:61, trades:486,  dd:'9.8%',  pf:1.9, sharpe:1.5, live:true },
  { name:'Gold Reversal',    market:'XAU/USD', tf:'M30', win:57, trades:712,  dd:'11.4%', pf:1.7, sharpe:1.2, live:true },
  { name:'London Breakout',  market:'EUR/USD', tf:'M15', win:64, trades:894,  dd:'6.1%',  pf:2.0, sharpe:1.6, live:true },
  { name:'Asian Range Fade', market:'XAU/USD', tf:'M15', win:59, trades:534,  dd:'7.9%',  pf:1.6, sharpe:1.3, live:true },
  { name:'Crypto Session',   market:'BTC/USD', tf:'H4',  win:55, trades:312,  dd:'13.2%', pf:1.8, sharpe:1.4, live:true },
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

const TESTIMONIALS = [
  { q:'The lot size calculator alone saved my account. My drawdown dropped by half in two months.',                       n:'Daniel M.', r:'Swing trader · EUR/USD' },
  { q:'I run Gold Reversal overnight and Momentum Rider during US hours. Clean execution, zero drama.',                    n:'Priya S.',  r:'Part-time · XAU/USD' },
  { q:'The strength meter tells me in two seconds whether I should be long or short the dollar.',                          n:'Kwame A.',  r:'Day trader · Majors' },
  { q:'Tonny’s coaching session was worth more than every course I’ve bought combined. We rebuilt my risk plan in an hour.', n:'Marco L.', r:'Beginner · All pairs' },
  { q:'The backtesting engine let me test five strategies before committing real money. Paid for itself immediately.',    n:'Sarah K.',  r:'Systematic · BTC/USD' },
  { q:'Finally a platform that treats EUR/USD, gold and crypto as three different animals. The bots clearly reflect that.', n:'Yusuf B.', r:'Multi-asset · XAU/USD' },
];

const PHILOSOPHY = [
  { icon:'◆', title:'Risk first, always',   text:'No trade idea matters if the position size is wrong. Every tool starts from: how much can I lose?' },
  { icon:'▣', title:'One market, one edge', text:'I trade three instruments only. Specialising beats generalising — every bot reflects that.' },
  { icon:'▲', title:'Let the data decide',  text:'Journal everything. Review every week. Stats tell you what works long before feelings do.' },
  { icon:'●', title:'Automate the boring',  text:'Execution should be mechanical. The edge lives in the rules, not in your mouse clicks.' },
];

const TIMELINE = [
  { year:'2014', title:'First live account',      text:'Opened my first account with $500. Lost most of it in three months. That loss became the foundation for everything.' },
  { year:'2016', title:'Full-time trader',        text:'Left the day job after 18 months of consistent profitability. Focused entirely on EUR/USD and risk management.' },
  { year:'2018', title:'Built my first bot',      text:'A simple M5 scalper for EUR/USD that ran overnight. Not profitable yet, but it never skipped a session.' },
  { year:'2020', title:'Added gold and crypto',   text:'Extended the framework to XAU/USD and BTC/USD. Same risk rules — different animals.' },
  { year:'2023', title:'MyTradeApp is born',      text:'Packaged the tools I’d built for myself into one terminal. Third-party, broker-agnostic, focused.' },
  { year:'2025', title:'A community of traders',  text:'Thousands of retail traders now use MyTradeApp every week. Same tools, same discipline, no hype.' },
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

const STRATEGIES = [
  { name:'London Breakout',     market:'EUR/USD', tf:'M15', desc:'Fade the Asian range and ride the first London impulse. Classic, robust, session-based.' },
  { name:'Trend Continuation',  market:'BTC/USD', tf:'H1',  desc:'Enter on pullbacks in the direction of the daily trend, using the H1 EMA ribbon as a filter.' },
  { name:'Gold Mean Reversion', market:'XAU/USD', tf:'M30', desc:'Fade extremes against the 200 EMA. Tight targets, high win rate, capped upside.' },
  { name:'NY Reversal',         market:'EUR/USD', tf:'M5',  desc:'Trade the first exhaustion candle after the US cash open, targeting the London close.' },
];

const EVENTS = [
  { day:'MON', time:'14:00', event:'US ISM Manufacturing PMI',      impact:'High',      affect:'EUR/USD · XAU/USD' },
  { day:'WED', time:'18:00', event:'FOMC Interest Rate Decision',   impact:'Very High', affect:'All instruments' },
  { day:'THU', time:'12:30', event:'US Initial Jobless Claims',     impact:'Medium',    affect:'EUR/USD' },
  { day:'FRI', time:'12:30', event:'US Non-Farm Payrolls (NFP)',    impact:'Very High', affect:'All instruments' },
  { day:'FRI', time:'14:00', event:'ECB President Speech',          impact:'High',      affect:'EUR/USD' },
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

const LIVE_ACTIVITY = [
  { t:'2m ago',  u:'Daniel M.', a:'opened a long on EUR/USD',     d:'0.25 lots' },
  { t:'6m ago',  u:'Priya S.',  a:'closed XAU/USD short',         d:'+$142.30' },
  { t:'11m ago', u:'Kwame A.',  a:'launched Pip Scalper',         d:'EUR/USD M5' },
  { t:'18m ago', u:'Marco L.',  a:'sized a trade with calculator', d:'1.2% risk' },
  { t:'24m ago', u:'Sarah K.',  a:'backtested Momentum Rider',    d:'2y data' },
  { t:'31m ago', u:'Yusuf B.',  a:'opened a long on BTC/USD',     d:'0.10 lots' },
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

  const st        = strength ? currencyStrength(strength) : {};
  const sortedCur = CURRENCIES.slice().sort((a, b) => (st[b] || 0) - (st[a] || 0));
  const pick      = [...sortedCur.slice(0, 4), ...sortedCur.slice(-4)];
  const maxAbs    = Math.max(...pick.map((x) => Math.abs(st[x] || 0)), 0.05);

  const [calc, setCalc] = useState({ bal: 10000, risk: 1, sl: 25 });
  const riskAmount = (Number(calc.bal) * Number(calc.risk)) / 100;
  const lots       = calc.sl > 0 ? riskAmount / (Number(calc.sl) * 10) : 0;

  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
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
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
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

        /* ---------- HERO ---------- */
        .tf-hero{ position:relative; overflow:hidden; padding:96px 0 108px;
          text-align:center;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(245,180,0,.10), transparent 60%),
            linear-gradient(180deg, #0a0a0a 0%, #070707 100%); }
        .tf-hero::before{ content:''; position:absolute; inset:0;
          pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size:48px 48px;
          mask-image:radial-gradient(ellipse at 50% 30%, black, transparent 75%);
          -webkit-mask-image:radial-gradient(ellipse at 50% 30%, black, transparent 75%); }
        .tf-candles{ position:absolute; inset:0; pointer-events:none; opacity:.55; }
        .tf-candles svg{ width:100%; height:100%; }
        .tf-hero-inner{ position:relative; z-index:2; max-width:920px;
          margin:0 auto; padding:0 22px; }
        .tf-hero h1{ font-size:76px; line-height:1.02; font-weight:900;
          letter-spacing:-3px; color:${C.text}; margin:0 0 22px; }
        .tf-hero h1 .g{ color:${C.gold}; }
        .tf-hero-lead{ font-size:19px; line-height:1.55; color:${C.text2};
          max-width:660px; margin:0 auto 38px; }
        .tf-hero-cta{ display:flex; justify-content:center; gap:14px;
          flex-wrap:wrap; margin-bottom:44px; }
        .tf-trust{ display:flex; justify-content:center; gap:42px; flex-wrap:wrap; }
        .tf-trust span{ display:flex; align-items:center; gap:10px;
          font-size:14px; color:${C.text2}; font-weight:600; }
        .tf-trust svg{ color:${C.gold}; flex-shrink:0; }

        /* ---------- TICKER ---------- */
        .tf-ticker{ border-top:1px solid ${C.border}; border-bottom:1px solid ${C.border};
          background:${C.bg2}; overflow:hidden; position:relative;
          mask-image:linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
          -webkit-mask-image:linear-gradient(90deg, transparent, black 6%, black 94%, transparent); }
        .tf-ticker-track{ display:flex; width:max-content;
          animation:tfScroll 40s linear infinite; }
        .tf-ticker:hover .tf-ticker-track{ animation-play-state:paused; }
        @keyframes tfScroll{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
        .tf-tick{ display:flex; align-items:center; gap:10px;
          padding:16px 26px; border-right:1px solid ${C.border};
          white-space:nowrap; }
        .tf-tick .s{ font-family:'JetBrains Mono',monospace; font-size:12px;
          font-weight:700; color:${C.text2}; letter-spacing:.3px; }
        .tf-tick .p{ font-family:'JetBrains Mono',monospace; font-size:12.5px;
          font-weight:700; color:${C.text}; }
        .tf-tick .c{ font-family:'JetBrains Mono',monospace; font-size:11.5px;
          font-weight:700; }

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

        /* ---------- FEATURES ---------- */
        .tf-features{ display:grid; grid-template-columns:repeat(4,1fr);
          gap:16px; margin-top:32px; }
        .tf-feature{ padding:28px 24px; border-radius:16px;
          border:1px solid ${C.border}; background:${C.card};
          transition:.24s cubic-bezier(.16,1,.3,1); }
        .tf-feature:hover{ transform:translateY(-4px);
          border-color:${C.goldBorder}; background:${C.card2}; }
        .tf-feature-icon{ width:46px; height:46px; border-radius:12px;
          display:grid; place-items:center; margin-bottom:18px;
          background:${C.goldSoft}; border:1px solid ${C.goldBorder};
          color:${C.gold}; }
        .tf-feature h4{ font-size:15.5px; font-weight:700; color:${C.text};
          margin:0 0 9px; letter-spacing:-.2px; }
        .tf-feature p{ font-size:13px; line-height:1.65; color:${C.text2}; margin:0; }

        /* ---------- PHILOSOPHY ---------- */
        .tf-philo{ display:grid; grid-template-columns:repeat(4,1fr);
          gap:14px; margin-top:32px; }
        .tf-philo-card{ padding:22px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card}; }
        .tf-philo-card .ic{ font-size:18px; color:${C.gold}; display:block;
          margin-bottom:10px; }
        .tf-philo-card h5{ font-size:13.5px; font-weight:800; color:${C.text};
          margin:0 0 8px; }
        .tf-philo-card p{ font-size:12.5px; line-height:1.6; color:${C.text2};
          margin:0; }

        /* ---------- TIMELINE ---------- */
        .tf-timeline{ position:relative; padding-left:32px; margin-top:24px; }
        .tf-timeline::before{ content:''; position:absolute; left:8px; top:8px;
          bottom:8px; width:2px; background:${C.border}; }
        .tf-tl-item{ position:relative; padding-bottom:26px; }
        .tf-tl-item:last-child{ padding-bottom:0; }
        .tf-tl-item::before{ content:''; position:absolute; left:-30px; top:6px;
          width:12px; height:12px; border-radius:50%; background:${C.bg};
          border:2px solid ${C.gold}; box-shadow:0 0 0 4px ${C.goldSoft}; }
        .tf-tl-item .y{ font-family:'JetBrains Mono',monospace; font-size:11.5px;
          font-weight:800; letter-spacing:1px; color:${C.gold}; }
        .tf-tl-item h6{ font-size:14px; font-weight:800; color:${C.text};
          margin:4px 0 5px; }
        .tf-tl-item p{ font-size:12.5px; line-height:1.65; color:${C.text2};
          margin:0; }

        /* ---------- SERVICES ---------- */
        .tf-services{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
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

        /* ---------- MARKETS ---------- */
        .tf-markets{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .tf-market{ padding:28px 24px; border-radius:16px;
          border:1px solid ${C.border}; background:${C.card};
          position:relative; transition:.24s cubic-bezier(.16,1,.3,1);
          overflow:hidden; }
        .tf-market::before{ content:''; position:absolute; top:0; left:0; right:0;
          height:3px; background:${C.gold}; opacity:.75; }
        .tf-market:hover{ transform:translateY(-5px);
          border-color:${C.goldBorder};
          box-shadow:0 20px 44px rgba(0,0,0,.55); }
        .tf-market-top{ display:flex; align-items:center; gap:12px;
          margin-bottom:18px; }
        .tf-market-logo{ width:48px; height:48px; border-radius:12px;
          display:grid; place-items:center; background:${C.goldSoft};
          border:1px solid ${C.goldBorder}; color:${C.gold};
          font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:800; }
        .tf-market-name{ font-size:17px; font-weight:800; color:${C.text};
          letter-spacing:-.4px; }
        .tf-market-sub{ font-size:11.5px; color:${C.text3}; margin-top:3px; }
        .tf-market-tag{ margin-left:auto; font-size:9.5px; font-weight:800;
          letter-spacing:1px; text-transform:uppercase; padding:5px 10px;
          border-radius:6px; background:${C.goldSoft}; color:${C.gold};
          border:1px solid ${C.goldBorder}; }
        .tf-market-desc{ font-size:13px; line-height:1.65; color:${C.text2};
          margin:0 0 20px; min-height:66px; }
        .tf-market-meta{ display:grid; grid-template-columns:repeat(3,1fr);
          gap:10px; padding-top:16px; border-top:1px solid ${C.border}; }
        .tf-market-meta .k{ font-size:9.5px; font-weight:700;
          letter-spacing:.9px; text-transform:uppercase; color:${C.text3}; }
        .tf-market-meta .v{ font-family:'JetBrains Mono',monospace;
          font-size:12.5px; font-weight:700; color:${C.text}; margin-top:5px; }
        .tf-market-live{ display:flex; align-items:center;
          justify-content:space-between; gap:12px; margin-top:18px;
          padding-top:16px; border-top:1px solid ${C.border}; }
        .tf-market-live .lp{ font-family:'JetBrains Mono',monospace;
          font-size:15px; font-weight:800; color:${C.text}; }
        .tf-market-live .chg{ font-family:'JetBrains Mono',monospace;
          font-size:11.5px; font-weight:700; margin-top:3px; }
        .tf-market-trade{ padding:9px 16px; border-radius:8px;
          background:${C.gold}; color:#0a0a0a; font-family:inherit;
          font-size:12px; font-weight:800; border:none; cursor:pointer;
          letter-spacing:.2px; transition:.2s; }
        .tf-market-trade:hover{ background:${C.gold2}; }

        /* ---------- BOTS ---------- */
        .tf-bots{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .tf-bot{ padding:28px 24px; border-radius:16px;
          border:1px solid ${C.border}; background:${C.card};
          transition:.24s cubic-bezier(.16,1,.3,1); }
        .tf-bot:hover{ transform:translateY(-4px); border-color:${C.goldBorder};
          box-shadow:0 18px 40px rgba(0,0,0,.5); }
        .tf-bot-head{ display:flex; align-items:flex-start;
          justify-content:space-between; gap:10px; margin-bottom:20px; }
        .tf-bot-name{ font-size:15.5px; font-weight:800; color:${C.text};
          letter-spacing:-.3px; }
        .tf-bot-market{ font-size:11px; color:${C.text3}; margin-top:4px;
          font-family:'JetBrains Mono',monospace; font-weight:600; }
        .tf-bot-live{ font-size:9px; font-weight:800; letter-spacing:1px;
          text-transform:uppercase; padding:5px 9px; border-radius:6px;
          background:rgba(34,197,94,.1); color:${C.green};
          border:1px solid rgba(34,197,94,.28); }
        .tf-bot-live::before{ content:'●'; margin-right:5px; }
        .tf-bot-stats{ display:grid; grid-template-columns:1fr 1fr; gap:10px;
          margin-bottom:18px; }
        .tf-bot-stat{ padding:12px 13px; border-radius:10px;
          background:${C.bg2}; border:1px solid ${C.border}; }
        .tf-bot-stat .k{ font-size:9px; font-weight:700; letter-spacing:.9px;
          text-transform:uppercase; color:${C.text3}; }
        .tf-bot-stat .v{ font-family:'JetBrains Mono',monospace; font-size:15px;
          font-weight:800; color:${C.text}; margin-top:5px; }
        .tf-bot-bar{ height:5px; border-radius:4px; overflow:hidden;
          background:${C.border}; margin-bottom:8px; }
        .tf-bot-bar i{ display:block; height:100%; background:${C.gold};
          border-radius:4px; }
        .tf-bot-bar-label{ display:flex; justify-content:space-between;
          font-size:10px; font-weight:700; color:${C.text3};
          text-transform:uppercase; letter-spacing:.7px; margin-bottom:18px; }
        .tf-bot-btn{ width:100%; padding:11px; border-radius:9px;
          background:transparent; border:1.5px solid ${C.goldBorder};
          color:${C.gold}; font-family:inherit; font-size:12px;
          font-weight:800; letter-spacing:.3px; cursor:pointer;
          transition:.2s; }
        .tf-bot-btn:hover{ background:${C.gold}; color:#0a0a0a;
          border-color:${C.gold}; }

        /* ---------- TOOLS ---------- */
        .tf-tools{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .tf-tool{ padding:34px 30px; border-radius:18px;
          border:1px solid ${C.border}; background:${C.card}; }
        .tf-tool h3{ font-size:19px; font-weight:800; color:${C.text};
          margin:0 0 4px; letter-spacing:-.5px; }
        .tf-tool .hint{ font-size:12px; color:${C.text3}; margin:0 0 24px; }
        .tf-calc-grid{ display:grid; grid-template-columns:1fr 1fr;
          gap:14px; margin-bottom:20px; }
        .tf-field label{ display:block; font-size:10px; font-weight:800;
          letter-spacing:1px; text-transform:uppercase; color:${C.text3};
          margin-bottom:8px; }
        .tf-field input{ width:100%; padding:13px 15px; border-radius:10px;
          background:${C.bg2}; border:1px solid ${C.border2};
          color:${C.text}; font-family:'JetBrains Mono',monospace;
          font-size:14px; font-weight:700; outline:none; transition:.2s; }
        .tf-field input:focus{ border-color:${C.gold};
          box-shadow:0 0 0 3px ${C.goldSoft}; }
        .tf-calc-out{ display:flex; align-items:center;
          justify-content:space-between; gap:16px; padding:22px;
          border-radius:12px; background:${C.goldSoft};
          border:1px solid ${C.goldBorder}; margin-bottom:18px; }
        .tf-calc-out .k{ font-size:10px; font-weight:800;
          letter-spacing:1.1px; text-transform:uppercase; color:${C.text3}; }
        .tf-calc-out .v{ font-family:'JetBrains Mono',monospace;
          font-size:32px; font-weight:800; letter-spacing:-1.2px;
          color:${C.gold}; line-height:1; margin-top:5px; }
        .tf-calc-out .s{ font-size:11px; color:${C.text2}; margin-top:4px; }
        .tf-st-row{ display:flex; align-items:center; gap:14px; padding:9px 0; }
        .tf-st-cur{ font-family:'JetBrains Mono',monospace; font-size:12.5px;
          font-weight:800; color:${C.text}; width:44px; letter-spacing:.5px; }
        .tf-st-track{ position:relative; flex:1; height:8px;
          border-radius:5px; background:${C.border}; }
        .tf-st-mid{ position:absolute; left:50%; top:-3px; bottom:-3px;
          width:1px; background:${C.border2}; }
        .tf-st-bar{ position:absolute; top:0; bottom:0; border-radius:5px; }
        .tf-st-val{ font-family:'JetBrains Mono',monospace; font-size:12px;
          font-weight:800; min-width:56px; text-align:right; }

        /* ---------- STEPS ---------- */
        .tf-steps{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .tf-step{ padding:30px 24px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card}; }
        .tf-step .n{ font-family:'JetBrains Mono',monospace; font-size:36px;
          font-weight:900; letter-spacing:-2px; color:${C.gold};
          line-height:1; margin-bottom:16px; display:block; }
        .tf-step h4{ font-size:14.5px; font-weight:800; color:${C.text};
          margin:0 0 9px; letter-spacing:-.2px; }
        .tf-step p{ font-size:12.5px; line-height:1.65; color:${C.text2};
          margin:0; }

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

        /* ---------- STRATEGIES ---------- */
        .tf-strats{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
        .tf-strat{ padding:24px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card};
          transition:.22s; }
        .tf-strat:hover{ border-color:${C.goldBorder};
          transform:translateY(-3px); }
        .tf-strat-head{ display:flex; align-items:center;
          justify-content:space-between; gap:10px; margin-bottom:12px; }
        .tf-strat h4{ font-size:14px; font-weight:800; color:${C.text}; }
        .tf-strat .meta{ font-family:'JetBrains Mono',monospace;
          font-size:10px; font-weight:700; color:${C.gold};
          padding:4px 8px; border-radius:5px; background:${C.goldSoft}; }
        .tf-strat p{ font-size:12.5px; line-height:1.7;
          color:${C.text2}; margin:0; }

        /* ---------- EVENTS ---------- */
        .tf-events{ border-radius:14px; border:1px solid ${C.border};
          background:${C.card}; overflow:hidden; }
        .tf-event{ display:grid;
          grid-template-columns:80px 80px 1fr 120px 170px;
          gap:16px; align-items:center; padding:16px 22px;
          border-bottom:1px solid ${C.border}; }
        .tf-event:last-child{ border-bottom:none; }
        .tf-event .d{ font-family:'JetBrains Mono',monospace;
          font-size:11px; font-weight:800; letter-spacing:1px;
          color:${C.gold}; }
        .tf-event .t{ font-family:'JetBrains Mono',monospace;
          font-size:12px; font-weight:700; color:${C.text2}; }
        .tf-event .e{ font-size:13px; font-weight:600; color:${C.text}; }
        .tf-event .imp{ font-size:9.5px; font-weight:800;
          letter-spacing:.9px; text-transform:uppercase;
          padding:5px 10px; border-radius:6px; text-align:center; }
        .tf-event .imp.vh{ background:rgba(239,68,68,.12); color:${C.red}; }
        .tf-event .imp.h { background:rgba(245,165,36,.12); color:#f5a524; }
        .tf-event .imp.m { background:rgba(59,130,246,.12); color:#3b82f6; }
        .tf-event .af{ font-size:11.5px; color:${C.text3}; }

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

        /* ---------- LIVE ACTIVITY ---------- */
        .tf-activity{ border-radius:14px; border:1px solid ${C.border};
          background:${C.card}; overflow:hidden; }
        .tf-act{ display:flex; align-items:center; gap:16px;
          padding:15px 22px; border-bottom:1px solid ${C.border}; }
        .tf-act:last-child{ border-bottom:none; }
        .tf-act-dot{ width:7px; height:7px; border-radius:50%;
          background:${C.gold}; flex-shrink:0;
          box-shadow:0 0 8px ${C.gold}; animation:tfPulse 2s infinite; }
        @keyframes tfPulse{
          0%{ box-shadow:0 0 0 0 rgba(245,180,0,.6); }
          70%{ box-shadow:0 0 0 9px transparent; }
          100%{ box-shadow:0 0 0 0 transparent; }
        }
        .tf-act-u{ font-size:12.5px; font-weight:800; color:${C.text};
          min-width:96px; }
        .tf-act-a{ font-size:12.5px; color:${C.text2}; flex:1; }
        .tf-act-d{ font-family:'JetBrains Mono',monospace;
          font-size:11.5px; font-weight:700; color:${C.gold}; }
        .tf-act-t{ font-size:10.5px; color:${C.text3};
          min-width:66px; text-align:right; }

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

        /* ---------- TESTIMONIALS ---------- */
        .tf-testi{ display:grid; grid-template-columns:repeat(3,1fr);
          gap:16px; }
        .tf-quote-card{ padding:28px 24px; border-radius:14px;
          border:1px solid ${C.border}; background:${C.card}; }
        .tf-quote-card .stars{ display:flex; gap:3px; color:${C.gold};
          margin-bottom:16px; }
        .tf-quote-card p{ font-size:13.5px; line-height:1.75;
          color:${C.text2}; margin:0 0 20px; }
        .tf-quote-card .who{ display:flex; align-items:center; gap:12px;
          padding-top:18px; border-top:1px solid ${C.border}; }
        .tf-quote-card .av{ width:40px; height:40px; border-radius:50%;
          display:grid; place-items:center; background:${C.goldSoft};
          border:1px solid ${C.goldBorder}; color:${C.gold};
          font-weight:800; font-size:14px; }
        .tf-quote-card .nm{ font-size:13px; font-weight:800;
          color:${C.text}; }
        .tf-quote-card .rl{ font-size:11px; color:${C.text3};
          margin-top:3px; }

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
          .tf-hero h1{ font-size:60px; letter-spacing:-2.4px; }
          .tf-features{ grid-template-columns:repeat(2,1fr); }
          .tf-philo{ grid-template-columns:repeat(2,1fr); }
          .tf-services{ grid-template-columns:repeat(2,1fr); }
          .tf-bots{ grid-template-columns:repeat(2,1fr); }
          .tf-steps{ grid-template-columns:repeat(2,1fr); }
          .tf-h2{ font-size:36px; letter-spacing:-1.2px; }
          .tf-articles{ grid-template-columns:repeat(2,1fr); }
          .tf-sessions{ grid-template-columns:repeat(2,1fr); }
          .tf-pricing{ grid-template-columns:1fr; max-width:520px; margin:0 auto; }
        }

        @media (max-width:900px){
          .tf-hero{ padding:72px 0 84px; }
          .tf-hero h1{ font-size:50px; letter-spacing:-1.9px; }
          .tf-hero-lead{ font-size:16.5px; }
          .tf-founder{ grid-template-columns:1fr; gap:32px; padding:32px; }
          .tf-founder-photo{ max-width:320px; }
          .tf-founder-stats{ grid-template-columns:repeat(2,1fr); gap:22px; }
          .tf-markets{ grid-template-columns:1fr; }
          .tf-market-desc{ min-height:0; }
          .tf-tools{ grid-template-columns:1fr; }
          .tf-testi{ grid-template-columns:1fr; }
          .tf-faq{ grid-template-columns:1fr; }
          .tf-sec{ padding:60px 0; }
          .tf-event{ grid-template-columns:70px 70px 1fr 100px; }
          .tf-event .af{ display:none; }
          .tf-news{ grid-template-columns:1fr; gap:22px; padding:28px 26px; }
          .tf-miles{ grid-template-columns:repeat(2,1fr); }
        }

        @media (max-width:640px){
          .tf-wrap{ padding:0 16px; }
          .tf-hero{ padding:54px 0 64px; }
          .tf-hero h1{ font-size:38px; letter-spacing:-1.4px; line-height:1.08; }
          .tf-hero-lead{ font-size:14.5px; margin-bottom:30px; }
          .tf-hero-cta{ gap:10px; margin-bottom:34px; }
          .tf-btn{ flex:1 1 100%; padding:14px 22px; font-size:13.5px; }
          .tf-trust{ gap:20px; }
          .tf-trust span{ font-size:12.5px; }
          .tf-h2{ font-size:27px; letter-spacing:-.9px; }
          .tf-sub{ font-size:13.5px; }
          .tf-sec{ padding:52px 0; }
          .tf-sec-sm{ padding:40px 0; }
          .tf-head{ margin-bottom:38px; }
          .tf-features{ grid-template-columns:1fr; gap:12px; }
          .tf-feature{ padding:22px 18px; }
          .tf-philo{ grid-template-columns:1fr; gap:12px; }
          .tf-services{ grid-template-columns:1fr; gap:12px; }
          .tf-service{ padding:22px 18px; }
          .tf-service p{ min-height:0; }
          .tf-bots{ grid-template-columns:1fr; gap:12px; }
          .tf-bot{ padding:22px 18px; }
          .tf-steps{ grid-template-columns:1fr; gap:12px; }
          .tf-step{ padding:22px 18px; }
          .tf-founder{ padding:22px 18px; gap:26px; }
          .tf-founder-photo{ max-width:100%; }
          .tf-founder-name{ font-size:25px; }
          .tf-founder-bio{ font-size:13.5px; }
          .tf-founder-stats{ grid-template-columns:1fr 1fr; gap:18px; }
          .tf-fstat .n{ font-size:22px; }
          .tf-quote-card{ padding:22px 18px; }
          .tf-calc-grid{ grid-template-columns:1fr; }
          .tf-calc-out .v{ font-size:26px; }
          .tf-tool{ padding:22px 18px; }
          .tf-basics{ grid-template-columns:1fr; gap:11px; }
          .tf-sessions{ grid-template-columns:1fr; gap:11px; }
          .tf-strats{ grid-template-columns:1fr; gap:11px; }
          .tf-gloss{ grid-template-columns:1fr; gap:9px; }
          .tf-miles{ grid-template-columns:1fr 1fr; gap:11px; }
          .tf-articles{ grid-template-columns:1fr; gap:11px; }
          .tf-event{ grid-template-columns:60px 60px 1fr; gap:10px;
            padding:13px 15px; }
          .tf-event .imp{ display:none; }
          .tf-tbl th, .tf-tbl td{ padding:12px 14px; font-size:12px; }
          .tf-news{ padding:24px 20px; }
          .tf-news h3{ font-size:18px; }
          .tf-news-form input{ flex:1 1 100%; }
          .tf-cta{ padding:54px 22px; border-radius:18px; }
          .tf-cta h2{ font-size:27px; letter-spacing:-1px; }
          .tf-cta p{ font-size:13.5px; }
          .tf-faq summary{ font-size:12.5px; padding:15px 18px; }
          .tf-faq details p{ padding:0 18px 17px; font-size:12.5px; }
          .tf-tick{ padding:13px 18px; }
          .tf-act{ padding:12px 15px; gap:11px; }
          .tf-act-u{ min-width:76px; font-size:12px; }
          .tf-act-a{ font-size:11.5px; }
          .tf-act-t{ display:none; }
        }

        @media (max-width:420px){
          .tf-hero h1{ font-size:32px; }
          .tf-fstat .n{ font-size:19px; }
          .tf-founder-stats{ grid-template-columns:1fr; }
          .tf-miles{ grid-template-columns:1fr; }
        }
      `}</style>

      {/* ============ PAGE ROOT (keeps .view.active for scroll) ============ */}
      <section className="view active tf-page">

        {/* ============================================================
            HERO
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
            <h1>
              Master Forex Trading<br />
              with <span className="g">Tonnyfx</span>
            </h1>
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
              <span><Icon name="users" size={17} /> 3,200+ Traders</span>
              <span><Icon name="shield" size={17} /> Verified Results</span>
              <span><Icon name="phone" size={17} /> 24/7 Support</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            TICKER
           ============================================================ */}
        <div className="tf-ticker">
          <div className="tf-ticker-track">
            {[0, 1].map((dup) =>
              WATCHLIST.map((sym) => {
                const price = priceOf(sym);
                const chg = changeOf(sym);
                const up = chg >= 0;
                return (
                  <div className="tf-tick" key={`${dup}-${sym}`}>
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

        {/* ============================================================
            ABOUT
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

            <div className="tf-features">
              {FEATURES.map((f) => (
                <div className="tf-feature" key={f.title}>
                  <div className="tf-feature-icon"><Icon name={f.icon} /></div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="tf-philo">
              {PHILOSOPHY.map((p) => (
                <div className="tf-philo-card" key={p.title}>
                  <span className="ic">{p.icon}</span>
                  <h5>{p.title}</h5>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            OUR JOURNEY
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Journey</div>
              <h2 className="tf-h2">The road to <span className="g">MyTradeApp</span></h2>
              <p className="tf-sub">
                A decade of trading, losing, learning and rebuilding — written down honestly.
              </p>
            </div>
            <div className="tf-timeline">
              {TIMELINE.map((t) => (
                <div className="tf-tl-item" key={t.year}>
                  <div className="y">{t.year}</div>
                  <h6>{t.title}</h6>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            SERVICES
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Our Services</div>
              <h2 className="tf-h2">What <span className="g">MyTradeApp</span> provides</h2>
              <p className="tf-sub">
                Choose the service that fits your trading journey — from free tools
                to fully automated bots and 1-on-1 coaching.
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
            MARKETS
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Markets</div>
              <h2 className="tf-h2">Three instruments. <span className="g">Total mastery.</span></h2>
              <p className="tf-sub">
                We deliberately trade a tiny universe so every bot, every calculator
                and every risk rule is tuned to the exact behaviour of that market.
              </p>
            </div>
            <div className="tf-markets">
              {MARKETS.map((m) => {
                const price = priceOf(m.sym);
                const chg = changeOf(m.sym);
                const up = chg >= 0;
                const hist = pairs?.[m.sym]?.history || [];
                return (
                  <div className="tf-market" key={m.sym}>
                    <div className="tf-market-top">
                      <div className="tf-market-logo">{m.label.split('/')[0]}</div>
                      <div>
                        <div className="tf-market-name">{m.label}</div>
                        <div className="tf-market-sub">{m.name}</div>
                      </div>
                      <span className="tf-market-tag">{m.tag}</span>
                    </div>
                    <p className="tf-market-desc">{m.desc}</p>
                    <div className="tf-market-meta">
                      <div><div className="k">Spread</div><div className="v">{m.spread}</div></div>
                      <div><div className="k">ATR (D1)</div><div className="v">{m.atr}</div></div>
                      <div><div className="k">Volatility</div><div className="v">{m.vol}</div></div>
                    </div>
                    <div className="tf-market-live">
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
                      <button className="tf-market-trade"
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

        {/* ============================================================
            TRADING BOTS
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Automation</div>
              <h2 className="tf-h2">Trading bots, tuned <span className="g">one market each</span></h2>
              <p className="tf-sub">
                Every strategy is built for a single instrument. No generic multi-asset logic —
                just focused systems with transparent performance.
              </p>
            </div>
            <div className="tf-bots">
              {BOTS.map((b) => (
                <div className="tf-bot" key={b.name}>
                  <div className="tf-bot-head">
                    <div>
                      <div className="tf-bot-name">{b.name}</div>
                      <div className="tf-bot-market">{b.market} · {b.tf}</div>
                    </div>
                    {b.live && <span className="tf-bot-live">Live</span>}
                  </div>
                  <div className="tf-bot-stats">
                    <div className="tf-bot-stat">
                      <div className="k">Win rate</div>
                      <div className="v pos">{b.win}%</div>
                    </div>
                    <div className="tf-bot-stat">
                      <div className="k">Trades</div>
                      <div className="v">{b.trades}</div>
                    </div>
                    <div className="tf-bot-stat">
                      <div className="k">Max DD</div>
                      <div className="v neg">{b.dd}</div>
                    </div>
                    <div className="tf-bot-stat">
                      <div className="k">Profit factor</div>
                      <div className="v">{b.pf}</div>
                    </div>
                  </div>
                  <div className="tf-bot-bar"><i style={{ width: `${b.win}%` }} /></div>
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
        </div>

        {/* ============================================================
            FREE TOOLS
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Free Tools</div>
              <h2 className="tf-h2">Size every trade. <span className="g">Read every currency.</span></h2>
              <p className="tf-sub">
                Two tools that do more for your account than any indicator ever will.
              </p>
            </div>
            <div className="tf-tools">
              <div className="tf-tool">
                <h3>Lot Size Calculator</h3>
                <p className="hint">EUR/USD standard lot · pip value $10</p>
                <div className="tf-calc-grid">
                  <div className="tf-field">
                    <label htmlFor="tf-bal">Account balance ($)</label>
                    <input id="tf-bal" type="number" min="0"
                      value={calc.bal}
                      onChange={(e) => setCalc({ ...calc, bal: e.target.value })} />
                  </div>
                  <div className="tf-field">
                    <label htmlFor="tf-risk">Risk per trade (%)</label>
                    <input id="tf-risk" type="number" min="0" step="0.1"
                      value={calc.risk}
                      onChange={(e) => setCalc({ ...calc, risk: e.target.value })} />
                  </div>
                  <div className="tf-field" style={{ gridColumn:'1 / -1' }}>
                    <label htmlFor="tf-sl">Stop-loss (pips)</label>
                    <input id="tf-sl" type="number" min="1"
                      value={calc.sl}
                      onChange={(e) => setCalc({ ...calc, sl: e.target.value })} />
                  </div>
                </div>
                <div className="tf-calc-out">
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
                <button className="tf-btn tf-btn-gold" style={{ width:'100%' }}
                  onClick={() => go('lot')}>
                  Open full calculator <Icon name="arrow" size={15} />
                </button>
              </div>

              <div className="tf-tool">
                <h3>Currency Strength Meter</h3>
                <p className="hint">Eight majors vs a weighted basket · live</p>
                <div style={{ padding:'4px 0 20px' }}>
                  {pick.map((curr) => {
                    const v = st[curr] || 0;
                    const w = (Math.abs(v) / maxAbs) * 50;
                    const pos = v >= 0;
                    return (
                      <div className="tf-st-row" key={curr}>
                        <div className="tf-st-cur">{curr}</div>
                        <div className="tf-st-track">
                          <div className="tf-st-mid" />
                          <div className="tf-st-bar"
                            style={pos
                              ? { left:'50%', width:`${w}%`, background:C.gold }
                              : { right:'50%', width:`${w}%`, background:C.red }} />
                        </div>
                        <div className={`tf-st-val ${pos ? 'pos' : 'neg'}`}>
                          {pos ? '+' : ''}{fmt(v, 2)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="tf-btn tf-btn-gold" style={{ width:'100%' }}
                  onClick={() => go('strength')}>
                  Open Strength Meter <Icon name="arrow" size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            HOW IT WORKS
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">How it works</div>
              <h2 className="tf-h2">From sign-up to <span className="g">automated</span> in four steps</h2>
            </div>
            <div className="tf-steps">
              {[
                { n:'01', t:'Create your account', d:'Sign up in under a minute. No broker lock-in — connect any supported MT4/MT5 or crypto venue.' },
                { n:'02', t:'Size your risk', d:'Run the lot size calculator, set your risk %, and let the risk manager cap your daily exposure.' },
                { n:'03', t:'Switch on a bot', d:'Pick a strategy for EUR/USD, BTC/USD or XAU/USD and let it execute while you watch the equity curve.' },
                { n:'04', t:'Review & refine', d:'Every trade lands in your journal with expectancy stats, so next week is sharper than the last.' },
              ].map((s) => (
                <div className="tf-step" key={s.n}>
                  <span className="n">{s.n}</span>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            FOREX BASICS
           ============================================================ */}
        <div className="tf-sec tf-alt">
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
        <div className="tf-sec">
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
        <div className="tf-sec tf-alt">
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
            STRATEGIES
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Strategy library</div>
              <h2 className="tf-h2">Four strategies, <span className="g">explained simply</span></h2>
              <p className="tf-sub">The playbooks behind our bots — written so a beginner can follow.</p>
            </div>
            <div className="tf-strats">
              {STRATEGIES.map((s) => (
                <div className="tf-strat" key={s.name}>
                  <div className="tf-strat-head">
                    <h4>{s.name}</h4>
                    <span className="meta">{s.market} · {s.tf}</span>
                  </div>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            ECONOMIC EVENTS
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">This week</div>
              <h2 className="tf-h2">High-impact <span className="g">events to watch</span></h2>
              <p className="tf-sub">
                Filtered for EUR/USD, BTC/USD and XAU/USD. Volatility clusters around these releases.
              </p>
            </div>
            <div className="tf-events">
              {EVENTS.map((e, i) => (
                <div className="tf-event" key={i}>
                  <div className="d">{e.day}</div>
                  <div className="t">{e.time}</div>
                  <div className="e">{e.event}</div>
                  <div className={`imp ${e.impact === 'Very High' ? 'vh' : e.impact === 'High' ? 'h' : 'm'}`}>
                    {e.impact}
                  </div>
                  <div className="af">{e.affect}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            GLOSSARY
           ============================================================ */}
        <div className="tf-sec">
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
            MILESTONES + LIVE ACTIVITY
           ============================================================ */}
        <div className="tf-sec tf-alt">
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

            <div style={{ height: 40 }} />

            <div className="tf-head" style={{ marginBottom: 26 }}>
              <div className="tf-eyebrow">Live activity</div>
              <h2 className="tf-h2" style={{ fontSize: 28 }}>What traders are doing <span className="g">right now</span></h2>
            </div>
            <div className="tf-activity">
              {LIVE_ACTIVITY.map((a, i) => (
                <div className="tf-act" key={i}>
                  <span className="tf-act-dot" />
                  <span className="tf-act-u">{a.u}</span>
                  <span className="tf-act-a">{a.a}</span>
                  <span className="tf-act-d">{a.d}</span>
                  <span className="tf-act-t">{a.t}</span>
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
        <div className="tf-sec">
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
            TESTIMONIALS
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Feedback</div>
              <h2 className="tf-h2">What the <span className="g">community</span> says</h2>
            </div>
            <div className="tf-testi">
              {TESTIMONIALS.map((t) => (
                <div className="tf-quote-card" key={t.n}>
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