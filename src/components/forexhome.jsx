// src/components/forexhome.jsx
import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useTheme } from 'styled-components';
import {
  CURRENCIES,
  fmt, fmtPrice,
  currencyStrength, Sparkline,
} from '../pages/forexdash';
import tonnyPhoto from '../assets/images/image13.png';

/* ================================================================ */
/*  HOOKS                                                          */
/* ================================================================ */

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(target * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }),
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [target, duration]);
  return [value, ref];
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ================================================================ */
/*  PRIMITIVES                                                     */
/* ================================================================ */

const Reveal = memo(({ children, delay = 0 }) => {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
    }}>{children}</div>
  );
});
Reveal.displayName = 'Reveal';

const Counter = memo(({ to, decimals = 0, prefix = '', suffix = '' }) => {
  const [v, ref] = useCountUp(to);
  const num = v.toFixed(decimals);
  const display = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
});
Counter.displayName = 'Counter';

/* ================================================================ */
/*  ICONS                                                          */
/* ================================================================ */
const Icon = ({ name, size = 20 }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    book:    <><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 7h7M8 11h7"/></>,
    chart:   <><path d="M3 17l5-6 4 4 8-9"/><path d="M15 6h5v5"/></>,
    users:   <><circle cx="9" cy="8" r="3.5"/><path d="M3 20v-1.5A4.5 4.5 0 017.5 14h3A4.5 4.5 0 0115 18.5V20"/><path d="M17 11a3 3 0 100-6"/><path d="M21 20v-1.5a4.5 4.5 0 00-3.5-4.36"/></>,
    medal:   <><circle cx="12" cy="15" r="5.5"/><path d="M8.5 9.5L6 3h12l-2.5 6.5"/></>,
    bot:     <><rect x="3.5" y="7.5" width="17" height="12" rx="3.5"/><path d="M12 7.5V4"/><circle cx="12" cy="3.4" r="1"/><path d="M9 13h.01M15 13h.01"/><path d="M9.5 16.5h5"/></>,
    calc:    <><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 7.5h8"/><path d="M8 12h1.5M12 12h1.5M16 12h.01M8 16h1.5M12 16h1.5M16 16h.01"/></>,
    bars:    <><path d="M5 20v-8M12 20V4M19 20v-5"/></>,
    bell:    <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></>,
    shield:  <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></>,
    journal: <><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 8h7M8 12h7M8 16h4"/></>,
    flask:   <><path d="M3 20h18"/><path d="M6 20V9l4 4 4-8 4 6v9"/></>,
    user:    <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></>,
    arrow:   <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    star:    <path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9l6.6-.9z"/>,
    phone:   <><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M12 18h.01"/></>,
    target:  <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>,
    plus:    <path d="M12 5v14M5 12h14"/>,
    minus:   <path d="M5 12h14"/>,
  };
  return <svg {...p}>{icons[name] || null}</svg>;
};

/* ================================================================ */
/*  CONTENT                                                        */
/* ================================================================ */

const MARKETS = [
  { sym:'EURUSD', label:'EUR/USD', name:'Euro / US Dollar', tag:'Major',
    desc:'The world’s most liquid pair. Tight spreads, deep liquidity and clean directional trends during the London and New York sessions.',
    spread:'0.4 pips', session:'London · New York', vol:'Medium', atr:'65 pips', pipValue:'$10',
    bestFor:['Beginners','Scalping','News trading'] },
  { sym:'BTCUSD', label:'BTC/USD', name:'Bitcoin / US Dollar', tag:'Crypto',
    desc:'24/7 volatility with enormous intraday ranges. Built for momentum, breakout and session-based automation strategies.',
    spread:'$12', session:'24 / 7', vol:'High', atr:'$1,200', pipValue:'$1',
    bestFor:['Momentum','Breakout','Swing'] },
  { sym:'XAUUSD', label:'XAU/USD', name:'Gold / US Dollar', tag:'Metal',
    desc:'The classic safe-haven asset. Strong directional runs during risk-off flows and US data releases.',
    spread:'18 pts', session:'London · New York', vol:'High', atr:'$24', pipValue:'$1',
    bestFor:['Safe-haven','Trend','NFP'] },
];

const FEATURES = [
  { icon:'book',  title:'Structured Learning',   desc:'A curriculum from beginner to advanced, designed for measurable results on live accounts.' },
  { icon:'chart', title:'Live Market Analysis',  desc:'Daily breakdowns and real-time trading sessions across EUR/USD, gold and crypto.' },
  { icon:'users', title:'Thriving Community',    desc:'3,200+ traders on the same journey to consistent profitability and financial freedom.' },
  { icon:'medal', title:'Proven Track Record',   desc:'Verified results with consistent monthly returns — logged and shown openly.' },
];

const SERVICES = [
  { key:'bots',     title:'Automated Trading Bots',    desc:'Six pre-built strategies tuned for EUR/USD, BTC/USD and XAU/USD.',         cta:'Manage bots',   icon:'bot' },
  { key:'lot',      title:'Lot Size Calculator',       desc:'Risk-based sizing on every instrument — balance, risk %, instant lot size.', cta:'Calculate',    icon:'calc' },
  { key:'strength', title:'Currency Strength Meter',   desc:'Rank the eight majors against a weighted basket in one glance.',            cta:'View strength', icon:'bars' },
  { key:'signals',  title:'Live Signal Alerts',        desc:'Momentum, breakout and mean-reversion alerts on your watchlist.',           cta:'See alerts',    icon:'bell' },
  { key:'risk',     title:'Risk & Margin Manager',     desc:'Real-time margin level, free margin and exposure warnings.',                cta:'Review risk',   icon:'shield' },
  { key:'journal',  title:'Trade Journal & Analytics', desc:'Every fill logged. Win rate, expectancy, drawdown, equity curve.',          cta:'Open journal',  icon:'journal' },
  { key:'backtest', title:'Backtesting Engine',        desc:'Test any bot against years of tick data before risking a cent.',            cta:'Run backtest',  icon:'flask' },
  { key:'coaching', title:'1-on-1 Coaching',           desc:'Direct sessions with Tonny on risk, journaling and strategy design.',       cta:'Book session',  icon:'user' },
];

const BOTS = [
  { name:'Pip Scalper',      market:'EUR/USD', tf:'M5',  win:68, trades:1243, dd:4.2,  pf:2.1, sharpe:1.8 },
  { name:'Momentum Rider',   market:'BTC/USD', tf:'H1',  win:61, trades:486,  dd:9.8,  pf:1.9, sharpe:1.5 },
  { name:'Gold Reversal',    market:'XAU/USD', tf:'M30', win:57, trades:712,  dd:11.4, pf:1.7, sharpe:1.2 },
  { name:'London Breakout',  market:'EUR/USD', tf:'M15', win:64, trades:894,  dd:6.1,  pf:2.0, sharpe:1.6 },
  { name:'Asian Range Fade', market:'XAU/USD', tf:'M15', win:59, trades:534,  dd:7.9,  pf:1.6, sharpe:1.3 },
  { name:'Crypto Session',   market:'BTC/USD', tf:'H4',  win:55, trades:312,  dd:13.2, pf:1.8, sharpe:1.4 },
];

const STATS = [
  { n:10,   suffix:'+',  l:'Years trading' },
  { n:3200, suffix:'+',  l:'Traders mentored' },
  { n:6,    suffix:'+',  l:'Live bots' },
  { n:24,   suffix:'/7', l:'Community support' },
];

const MILESTONES = [
  { n:12400, suffix:'+', l:'Trades logged monthly' },
  { n:48,    prefix:'$', suffix:'M+', l:'Notional volume tracked' },
  { n:3200,  suffix:'+', l:'Active traders' },
  { n:99.98, suffix:'%', decimals:2, l:'Bot uptime' },
];

const TESTIMONIALS = [
  { q:'The lot size calculator alone saved my account. Drawdown dropped by half in two months.', n:'Daniel M.', r:'Swing trader · EUR/USD' },
  { q:'Gold Reversal overnight, Momentum Rider during US hours. Clean execution, zero drama.',   n:'Priya S.',  r:'Part-time · XAU/USD' },
  { q:'The strength meter tells me in two seconds whether to go long or short the dollar.',       n:'Kwame A.',  r:'Day trader · Majors' },
  { q:'Tonny’s coaching session was worth more than every course I’ve bought combined.',        n:'Marco L.',  r:'Beginner · All pairs' },
  { q:'Backtesting engine let me test five strategies before committing real money.',            n:'Sarah K.',  r:'Systematic · BTC/USD' },
  { q:'Finally a platform that treats EUR/USD, gold and crypto as three different animals.',    n:'Yusuf B.',  r:'Multi-asset · XAU/USD' },
];

const PHILOSOPHY = [
  { icon:'shield', title:'Risk first, always',   text:'No trade idea matters if the position size is wrong. Every tool starts from: how much can I lose?' },
  { icon:'target', title:'One market, one edge', text:'Three instruments only. Specialising beats generalising — every bot reflects that.' },
  { icon:'chart',  title:'Let the data decide',  text:'Journal everything. Review every week. Stats tell you what works before feelings do.' },
  { icon:'bot',    title:'Automate the boring',  text:'Execution should be mechanical. The edge lives in the rules, not your mouse clicks.' },
];

const TIMELINE = [
  { year:'2014', title:'First live account',     text:'Opened with $500. Lost most of it in three months. That loss became the foundation.' },
  { year:'2016', title:'Full-time trader',       text:'Left the day job after 18 months of profitability. Focused on EUR/USD and risk.' },
  { year:'2018', title:'Built my first bot',     text:'A simple M5 scalper for EUR/USD. Not profitable yet — but it never skipped a session.' },
  { year:'2020', title:'Added gold and crypto',  text:'Extended the framework to XAU/USD and BTC/USD. Same risk rules, different animals.' },
  { year:'2023', title:'MyTradeApp is born',     text:'Packaged the tools I built for myself into one terminal. Third-party, broker-agnostic.' },
  { year:'2025', title:'A community of traders', text:'Thousands of retail traders now use MyTradeApp every week. Same tools, no hype.' },
];

const FOREX_BASICS = [
  { t:'What is forex trading?',            d:'The global marketplace for exchanging national currencies. Roughly $7.5 trillion trades daily — the largest and most liquid market in the world.' },
  { t:'The major pairs explained',         d:'EUR/USD, USD/JPY, GBP/USD and USD/CHF are the majors. Tightest spreads, deepest liquidity — MyTradeApp starts with EUR/USD.' },
  { t:'What is a pip?',                    d:'The smallest standardised move in a currency pair — usually 0.0001, and 0.01 for JPY pairs. Pip value depends on lot size.' },
  { t:'Lots, mini lots and micro lots',    d:'Standard = 100,000 units. Mini = 10,000. Micro = 1,000. Size tools work in all three, so a $200 account can trade safely.' },
  { t:'Leverage and margin',               d:'Leverage lets you control a large position with a small deposit. It magnifies profits and losses. Margin is your collateral.' },
  { t:'Trading sessions',                  d:'Forex runs 24/5 across three overlapping sessions: Sydney/Tokyo, London and New York. Volatility peaks during the LDN–NY overlap.' },
  { t:'Technical vs fundamental analysis', d:'Technical studies price structure and momentum. Fundamental studies rates, inflation and geopolitics. Serious traders use both.' },
  { t:'Risk management rules',             d:'Never risk more than 1–2% per trade. Always use a stop-loss. MyTradeApp enforces both, automatically.' },
];

const GLOSSARY = [
  { k:'Spread',      v:'The difference between the bid and ask price — your cost to enter a trade.' },
  { k:'Leverage',    v:'A multiplier that lets you control a larger position than your deposit allows.' },
  { k:'Margin call', v:'A broker demand for extra funds when your equity falls below required margin.' },
  { k:'Drawdown',    v:'The peak-to-trough decline in equity. The most important risk metric.' },
  { k:'Stop-loss',   v:'A pre-set order that closes your trade automatically at a defined loss.' },
  { k:'Take-profit', v:'A pre-set order that closes your trade once a profit target is hit.' },
  { k:'Slippage',    v:'The difference between expected price and actual fill price on execution.' },
  { k:'Win rate',    v:'Percent of trades that close in profit. Meaningless without average R:R.' },
  { k:'Expectancy',  v:'Average profit per trade: (win rate × avg win) − (loss rate × avg loss).' },
  { k:'Sharpe ratio',v:'Return per unit of risk. Above 1.0 is good; above 2.0 is excellent.' },
];

const SESSIONS = [
  { name:'Sydney',   hours:'22:00 – 07:00 UTC', colorKey:'accentSoft',  note:'Thin liquidity · tight ranges · AUD & NZD active', activeFrom:22, activeTo:7 },
  { name:'Tokyo',    hours:'00:00 – 09:00 UTC', colorKey:'accentHover', note:'JPY pairs dominate · steady, methodical action',    activeFrom:0,  activeTo:9 },
  { name:'London',   hours:'07:00 – 16:00 UTC', colorKey:'success',     note:'Highest volume · strongest trends · EUR & GBP',    activeFrom:7,  activeTo:16 },
  { name:'New York', hours:'12:00 – 21:00 UTC', colorKey:'warning',     note:'US data drops · high volatility · USD & gold',     activeFrom:12, activeTo:21 },
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
  { day:'MON', time:'14:00', event:'US ISM Manufacturing PMI',    impact:'High',      affect:'EUR/USD · XAU/USD' },
  { day:'WED', time:'18:00', event:'FOMC Interest Rate Decision', impact:'Very High', affect:'All instruments' },
  { day:'THU', time:'12:30', event:'US Initial Jobless Claims',   impact:'Medium',    affect:'EUR/USD' },
  { day:'FRI', time:'12:30', event:'US Non-Farm Payrolls (NFP)',  impact:'Very High', affect:'All instruments' },
  { day:'FRI', time:'14:00', event:'ECB President Speech',        impact:'High',      affect:'EUR/USD' },
];

const ARTICLES = [
  { cat:'Risk',       title:'Why 1% risk per trade beats every indicator you will ever buy', read:'6 min',  date:'Oct 12, 2026' },
  { cat:'Strategy',   title:'The London Breakout, explained step by step with real examples', read:'9 min',  date:'Oct 8, 2026'  },
  { cat:'Psychology', title:'How to stop revenge trading after a loss — a practical framework', read:'5 min', date:'Oct 3, 2026'  },
  { cat:'Gold',       title:'Trading XAU/USD around NFP: a practical, no-nonsense guide',    read:'7 min',  date:'Sep 28, 2026' },
  { cat:'Crypto',     title:'Why BTC/USD behaves differently from every other market',       read:'8 min',  date:'Sep 22, 2026' },
  { cat:'Systems',    title:'Backtesting your first strategy without fooling yourself',       read:'10 min', date:'Sep 15, 2026' },
];

const PLANS = [
  { name:'Starter', m:0,  y:0,   highlight:false,
    desc:'For traders who want the core tools before committing a cent.',
    features:['Lot size calculator','Currency strength meter','Economic calendar','Pip value table','Community access','Mobile app access'] },
  { name:'Trader', m:29, y:290, highlight:true,
    desc:'For active retail traders running one or two live bots.',
    features:['Everything in Starter','2 active bots','Live signal alerts','Trade journal & analytics','Backtesting engine','Priority email support','Mobile push alerts'] },
  { name:'Pro', m:79, y:790, highlight:false,
    desc:'For serious traders running a full portfolio of automated strategies.',
    features:['Everything in Trader','Unlimited bots','Strategy builder','VPS hosting included','1-on-1 coaching (1/mo)','Full API access','Priority chat support'] },
];

const FAQS = [
  { q:'Is MyTradeApp a broker?',                    a:'No. MyTradeApp is a third-party analytics and automation layer built by Tonny. You keep your own broker account and we give you the tools to trade it better.' },
  { q:'Which instruments do the bots trade?',       a:'Three only: EUR/USD, BTC/USD and XAU/USD. Focusing on a small set lets us tune each strategy far more precisely than a generic multi-asset bot.' },
  { q:'Do I need coding experience?',               a:'None at all. Every bot is pre-built and configurable from the dashboard. If you can toggle a switch and type a risk %, you can run one.' },
  { q:'How is risk handled?',                       a:'Every position is sized from your balance and a stop-loss distance. The risk manager enforces a daily loss cap and warns you before margin gets dangerous.' },
  { q:'Can I run bots and manual trades together?', a:'Yes. Both sit in the same book and the dashboard aggregates P/L, margin and exposure across both.' },
  { q:'Do I need a VPS?',                           a:'Not strictly, but recommended. A London or New York VPS keeps latency under 2ms and prevents the platform from going offline mid-trade.' },
  { q:'Can I cancel my subscription anytime?',      a:'Yes. No lock-in contracts. Cancel from your dashboard with one click and keep full access until the end of your billing period.' },
  { q:'What is the minimum account size?',          a:'Any size works, but we recommend at least $500 to trade the bots with sensible risk. Below that, the calculator returns micro lots.' },
  { q:'How do you handle slippage and spread?',     a:'Bots place limit orders where possible and use maximum-slippage caps. The journal logs exact fill versus intended price.' },
  { q:'Are the backtests realistic?',               a:'Yes. The engine applies spread, commission and slippage models to historical tick data. Results are designed to reproduce live.' },
];

/* ================================================================ */
/*  SUBCOMPONENTS                                                  */
/* ================================================================ */

const RiskGauge = memo(({ value, th, size = 140 }) => {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value, 0), 100) / 100;
  const color = value > 70 ? th.danger : value > 45 ? th.warning : th.success;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={th.border} strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>
            {value.toFixed(0)}
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: th.textMuted, marginTop: 4, textTransform: 'uppercase' }}>
            Risk score
          </div>
        </div>
      </div>
    </div>
  );
});
RiskGauge.displayName = 'RiskGauge';

const MarketTabs = memo(({ pairs, onTrade, th }) => {
  const [active, setActive] = useState(0);
  const m = MARKETS[active];
  const p = pairs?.[m.sym];
  const price = p?.price ?? 0;
  const open = p?.open ?? price;
  const chg = open ? ((price - open) / open) * 100 : 0;
  const up = chg >= 0;
  const hist = p?.history || [];

  return (
    <div className="mk-tabs" style={{
      display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0,
      borderRadius: 20, border: `1px solid ${th.border}`,
      background: th.card, overflow: 'hidden',
    }}>
      <div className="mk-tabs-side" style={{ borderRight: `1px solid ${th.border}`, padding: 8 }}>
        {MARKETS.map((mk, i) => {
          const mkPrice = pairs?.[mk.sym]?.price ?? 0;
          const mkOpen = pairs?.[mk.sym]?.open ?? mkPrice;
          const mkChg = mkOpen ? ((mkPrice - mkOpen) / mkOpen) * 100 : 0;
          const mkUp = mkChg >= 0;
          const isActive = i === active;
          return (
            <button key={mk.sym} onClick={() => setActive(i)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', borderRadius: 12, border: 'none',
              background: isActive ? th.accentLight : 'transparent',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              transition: 'all .25s', marginBottom: 4,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center',
                background: isActive ? th.accent : th.surfaceElevated,
                color: isActive ? '#0a0a0a' : th.accent,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800,
              }}>{mk.label.split('/')[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: th.text }}>{mk.label}</div>
                <div style={{ fontSize: 10.5, color: th.textMuted, marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>
                  {mkPrice ? fmtPrice(mk.sym, mkPrice) : '—'}
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800,
                color: mkUp ? th.success : th.danger }}>
                {mkUp ? '+' : ''}{fmt(mkChg, 2)}%
              </div>
            </button>
          );
        })}
      </div>
      <div className="mk-tabs-body" style={{ padding: '32px 34px' }}>
        <div key={active}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase',
                  padding: '5px 10px', borderRadius: 6, background: th.accentLight, color: th.accent,
                  border: `1px solid ${th.accentMuted}` }}>{m.tag}</span>
                <span style={{ fontSize: 11.5, color: th.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{m.session}</span>
              </div>
              <h3 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-1px', color: th.text, margin: '0 0 6px' }}>{m.label}</h3>
              <div style={{ fontSize: 13.5, color: th.textSecondary }}>{m.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 30, fontWeight: 800, letterSpacing: '-1px', color: th.text, lineHeight: 1 }}>
                {price ? fmtPrice(m.sym, price) : '—'}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, marginTop: 8,
                color: up ? th.success : th.danger }}>
                {up ? '▲' : '▼'} {up ? '+' : ''}{fmt(chg, 2)}%
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: th.textSecondary, margin: '0 0 24px', maxWidth: 560 }}>{m.desc}</p>
          {hist.length > 1 && (
            <div style={{ padding: '20px 0 22px', marginBottom: 22,
              borderTop: `1px solid ${th.border}`, borderBottom: `1px solid ${th.border}` }}>
              <div style={{ height: 80 }}>
                <Sparkline values={hist} w={700} h={80} color={up ? th.success : th.danger} />
              </div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 24 }}>
            {[['Spread', m.spread],['ATR (D1)', m.atr],['Pip value', m.pipValue],['Volatility', m.vol]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: th.textMuted }}>{k}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 800, color: th.text, marginTop: 6 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, color: th.textMuted, textTransform: 'uppercase', alignSelf: 'center', marginRight: 4 }}>
              Best for
            </span>
            {m.bestFor.map((b) => (
              <span key={b} style={{ fontSize: 11.5, fontWeight: 700, padding: '6px 12px', borderRadius: 20,
                background: th.surfaceElevated, color: th.textSecondary, border: `1px solid ${th.border}` }}>{b}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => onTrade && onTrade(m.sym)} style={{
              padding: '13px 26px', borderRadius: 10, border: 'none',
              background: `linear-gradient(135deg, ${th.accent}, ${th.accentHover})`,
              color: '#0a0a0a', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 800,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>Trade {m.label} <Icon name="arrow" size={15} /></button>
          </div>
        </div>
      </div>
    </div>
  );
});
MarketTabs.displayName = 'MarketTabs';

const BotExplorer = memo(({ onViewChange, th }) => {
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'EUR/USD', 'BTC/USD', 'XAU/USD'];
  const filtered = filter === 'All' ? BOTS : BOTS.filter((b) => b.market === filter);
  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22, justifyContent: 'center' }}>
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: '9px 18px', borderRadius: 22,
            border: `1px solid ${filter === c ? th.accent : th.border}`,
            background: filter === c ? th.accentLight : 'transparent',
            color: filter === c ? th.accent : th.textSecondary,
            fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
          }}>
            {c}
            <span style={{ marginLeft: 6, opacity: .6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5 }}>
              {c === 'All' ? BOTS.length : BOTS.filter((b) => b.market === c).length}
            </span>
          </button>
        ))}
      </div>
      <div className="g-3">
        {filtered.map((b) => (
          <div key={b.name} style={{
            padding: '26px 22px', borderRadius: 16,
            border: `1px solid ${th.border}`, background: th.card,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: th.text }}>{b.name}</div>
                <div style={{ fontSize: 11, color: th.textMuted, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                  {b.market} · {b.tf}
                </div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: '5px 9px', borderRadius: 6,
                background: `${th.success}18`, color: th.success, border: `1px solid ${th.success}44` }}>
                <span style={{ marginRight: 5 }}>●</span>LIVE
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              {[['Win rate', `${b.win}%`, th.success],['Trades', b.trades.toLocaleString(), th.text],
                ['Max DD', `-${b.dd}%`, th.danger],['Sharpe', b.sharpe, th.accent]].map(([k, v, color]) => (
                <div key={k} style={{ padding: '11px 12px', borderRadius: 10, background: th.surfaceElevated, border: `1px solid ${th.border}` }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: th.textMuted }}>{k}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 800, marginTop: 5, color }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase', letterSpacing: .7 }}>
              <span>Win rate</span><span>{b.win}/100</span>
            </div>
            <div style={{ height: 5, borderRadius: 4, overflow: 'hidden', background: th.border, marginBottom: 18 }}>
              <div style={{ height: '100%', width: `${b.win}%`, borderRadius: 4,
                background: `linear-gradient(90deg, ${th.accent}, ${th.accentHover})` }} />
            </div>
            <button onClick={() => onViewChange && onViewChange('bots')} style={{
              width: '100%', padding: '11px', borderRadius: 9, background: 'transparent',
              border: `1.5px solid ${th.accentMuted}`, color: th.accent,
              fontFamily: 'inherit', fontSize: 12, fontWeight: 800, cursor: 'pointer',
            }}>Configure bot</button>
          </div>
        ))}
      </div>
    </>
  );
});
BotExplorer.displayName = 'BotExplorer';

const SessionClock = memo(({ th }) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const h = now.getUTCHours() + now.getUTCMinutes() / 60;
  const isActive = (from, to) => (from < to ? h >= from && h < to : h >= from || h < to);
  return (
    <div className="g-4-sess" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
      {SESSIONS.map((s) => {
        const active = isActive(s.activeFrom, s.activeTo);
        const color = th[s.colorKey] || th.accent;
        return (
          <div key={s.name} style={{
            padding: '22px 20px', borderRadius: 14,
            border: `1px solid ${active ? color + '66' : th.border}`,
            background: th.card, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: color }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: th.text }}>{s.name}</div>
              {active && (
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: '4px 8px',
                  borderRadius: 5, background: `${color}22`, color, textTransform: 'uppercase' }}>
                  Open
                </span>
              )}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 700, color, marginBottom: 12 }}>
              {s.hours}
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.6, color: th.textSecondary }}>{s.note}</div>
          </div>
        );
      })}
    </div>
  );
});
SessionClock.displayName = 'SessionClock';

const RiskCalculator = memo(({ th }) => {
  const [bal, setBal] = useState(10000);
  const [risk, setRisk] = useState(1);
  const [sl, setSl] = useState(25);
  const riskAmount = (bal * risk) / 100;
  const lots = sl > 0 ? riskAmount / (sl * 10) : 0;
  const riskScore = Math.min(100, risk * 25);
  return (
    <div className="rc-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
      <div>
        {[
          { label:'Account balance', value: bal, display: `$${bal.toLocaleString()}`, min:100, max:100000, step:100, set:setBal },
          { label:'Risk per trade',  value: risk, display: `${risk}%`, min:0.1, max:5, step:0.1, set:setRisk, warn: risk > 2 },
          { label:'Stop-loss',       value: sl, display: `${sl} pips`, min:5, max:200, step:1, set:setSl },
        ].map((f, i) => (
          <div key={i} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: th.textMuted }}>{f.label}</label>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800,
                color: f.warn ? th.danger : th.accent }}>{f.display}</span>
            </div>
            <input type="range" min={f.min} max={f.max} step={f.step} value={f.value}
              onChange={(e) => f.set(Number(e.target.value))}
              style={{ width: '100%', accentColor: f.warn ? th.danger : th.accent }} />
          </div>
        ))}
        <div style={{ padding: 20, borderRadius: 12, background: th.accentLight, border: `1px solid ${th.accentMuted}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase', color: th.textMuted }}>Position size</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, letterSpacing: '-1.2px', color: th.accent, lineHeight: 1, marginTop: 6 }}>
                {lots.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: th.textSecondary, marginTop: 4 }}>standard lots</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase', color: th.textMuted }}>Risk amount</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: th.text, lineHeight: 1, marginTop: 6 }}>
                ${riskAmount.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: th.textSecondary, marginTop: 4 }}>at {risk}% risk</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <RiskGauge value={riskScore} th={th} />
        <div style={{ textAlign: 'center', maxWidth: 220 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: risk > 2 ? th.danger : th.success, marginBottom: 6 }}>
            {risk > 2 ? 'Too aggressive' : risk < 0.5 ? 'Conservative' : 'Balanced risk'}
          </div>
          <div style={{ fontSize: 11.5, lineHeight: 1.6, color: th.textMuted }}>
            {risk > 2 ? 'High risk per trade can blow an account in a short streak. Reduce to 1–2%.'
              : risk < 0.5 ? 'Very conservative — smaller drawdowns but slower account growth.'
              : 'A healthy risk level. Ten consecutive losses would cost ~10–20% of your account.'}
          </div>
        </div>
      </div>
    </div>
  );
});
RiskCalculator.displayName = 'RiskCalculator';

const Pricing = memo(({ th, onViewChange }) => {
  const [annual, setAnnual] = useState(false);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4, borderRadius: 12,
          background: th.surfaceElevated, border: `1px solid ${th.border}` }}>
          {['Monthly', 'Annual · save 17%'].map((label, i) => (
            <button key={label} onClick={() => setAnnual(i === 1)} style={{
              padding: '10px 20px', borderRadius: 9, border: 'none',
              background: (annual ? i === 1 : i === 0) ? th.accent : 'transparent',
              color: (annual ? i === 1 : i === 0) ? '#0a0a0a' : th.textSecondary,
              fontFamily: 'inherit', fontSize: 12.5, fontWeight: 800, cursor: 'pointer',
            }}>{label}</button>
          ))}
        </div>
      </div>
      <div className="g-3">
        {PLANS.map((p) => {
          const price = annual ? p.y : p.m;
          return (
            <div key={p.name} style={{
              position: 'relative', padding: '32px 28px 28px', borderRadius: 18,
              border: `1px solid ${p.highlight ? th.accent : th.border}`,
              background: p.highlight
                ? `radial-gradient(ellipse at 50% 0%, ${th.accentLight}, transparent 60%), ${th.card}`
                : th.card,
            }}>
              {p.highlight && (
                <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  padding: '6px 16px', borderRadius: 22,
                  background: `linear-gradient(135deg, ${th.accent}, ${th.accentHover})`,
                  color: '#0a0a0a', fontSize: 9.5, fontWeight: 900, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                  Most popular
                </span>
              )}
              <h4 style={{ fontSize: 14, fontWeight: 800, letterSpacing: .7, textTransform: 'uppercase', color: th.accent, margin: '0 0 14px' }}>{p.name}</h4>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 38, fontWeight: 800, letterSpacing: '-1.6px', color: th.text, lineHeight: 1 }}>
                  {price === 0 ? 'Free' : `$${price}`}
                </span>
                {price > 0 && <span style={{ fontSize: 12.5, color: th.textMuted, fontWeight: 600 }}>{annual ? '/ year' : '/ month'}</span>}
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.65, color: th.textSecondary, marginBottom: 22, minHeight: 42 }}>{p.desc}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, lineHeight: 1.5, color: th.textSecondary }}>
                    <span style={{ color: th.accent, fontWeight: 900, fontSize: 13, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => onViewChange && onViewChange('bots')} style={{
                width: '100%', padding: '13px', borderRadius: 10,
                border: p.highlight ? 'none' : `1.5px solid ${th.border}`,
                background: p.highlight ? `linear-gradient(135deg, ${th.accent}, ${th.accentHover})` : 'transparent',
                color: p.highlight ? '#0a0a0a' : th.text,
                fontFamily: 'inherit', fontSize: 13, fontWeight: 800, cursor: 'pointer',
              }}>{p.m === 0 ? 'Start free' : `Choose ${p.name}`}</button>
            </div>
          );
        })}
      </div>
    </>
  );
});
Pricing.displayName = 'Pricing';

const TestimonialCarousel = memo(({ th }) => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, [paused]);
  const t = TESTIMONIALS[idx];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{
      maxWidth: 780, margin: '0 auto', padding: '40px 44px', borderRadius: 20,
      border: `1px solid ${th.border}`, background: th.card, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%',
        background: `radial-gradient(circle, ${th.accentLight}, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, color: th.accent }}>
          {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={16} />)}
        </div>
        <p key={idx} style={{ fontSize: 20, lineHeight: 1.55, fontWeight: 600, color: th.text,
          letterSpacing: '-.3px', margin: '0 0 28px' }}>
          “{t.q}”
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', display: 'grid', placeItems: 'center',
              background: th.accentLight, border: `1px solid ${th.accentMuted}`,
              color: th.accent, fontWeight: 800, fontSize: 16 }}>{t.n.charAt(0)}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: th.text }}>{t.n}</div>
              <div style={{ fontSize: 11.5, color: th.textMuted, marginTop: 3 }}>{t.r}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`T${i + 1}`} style={{
                width: i === idx ? 22 : 8, height: 8, borderRadius: 4,
                background: i === idx ? th.accent : th.border,
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all .3s',
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
TestimonialCarousel.displayName = 'TestimonialCarousel';

const FAQAccordion = memo(({ th }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-g" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} style={{
            borderRadius: 14, border: `1px solid ${isOpen ? th.accentMuted : th.border}`,
            background: th.card, overflow: 'hidden',
          }}>
            <button onClick={() => setOpen(isOpen ? null : i)} style={{
              width: '100%', padding: '18px 22px', background: 'transparent', border: 'none',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left', fontSize: 13.5, fontWeight: 700,
              color: isOpen ? th.accent : th.text,
            }}>
              <span style={{ flex: 1 }}>{f.q}</span>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
                background: isOpen ? th.accent : th.accentLight,
                color: isOpen ? '#0a0a0a' : th.accent,
              }}><Icon name={isOpen ? 'minus' : 'plus'} size={13} /></span>
            </button>
            <div style={{ maxHeight: isOpen ? 320 : 0, overflow: 'hidden',
              transition: 'max-height .4s ease' }}>
              <div style={{ padding: '0 22px 20px', fontSize: 13, lineHeight: 1.75, color: th.textSecondary }}>
                {f.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
FAQAccordion.displayName = 'FAQAccordion';

/* ================================================================ */
/*  MAIN                                                           */
/* ================================================================ */

export default function ForexHome({
  pairs, onTrade, onViewChange,
}) {
  const styledTheme = useTheme();
  const c = styledTheme?.colors || {};

  const th = useMemo(() => {
    const isLight = (() => {
      const bg = (c.bg || '').toLowerCase();
      const tx = (c.text || '').toLowerCase();
      return bg === '#fff' || bg === '#ffffff' || bg.startsWith('#f') ||
             tx.startsWith('#0') || tx.startsWith('#1');
    })();
    return {
      bg:              c.bg              || (isLight ? '#f7f8fa' : '#070707'),
      bg2:             c.surface         || (isLight ? '#ffffff' : '#0d0d0d'),
      card:            c.surfaceElevated || (isLight ? '#ffffff' : '#111111'),
      surfaceElevated: c.surfaceElevated || (isLight ? '#f3f4f6' : '#161616'),
      border:          c.border          || (isLight ? '#e5e7eb' : '#1e1e1e'),
      accent:          c.accent          || '#f5b400',
      accentHover:     c.accentHover     || '#e0a200',
      accentLight:     c.accentLight     || 'rgba(245,180,0,.12)',
      accentMuted:     c.accentMuted     || 'rgba(245,180,0,.28)',
      accentSoft:      c.accentSoft      || c.warning || '#a855f7',
      text:            c.text            || (isLight ? '#0a0a0a' : '#ffffff'),
      textSecondary:   c.textSecondary   || (isLight ? '#4b5563' : '#a8a8a8'),
      textMuted:       c.textMuted       || (isLight ? '#9ca3af' : '#6b6b6b'),
      success:         c.success         || '#22c55e',
      danger:          c.danger          || '#ef4444',
      warning:         c.warning         || '#f5a524',
    };
  }, [c]);

  const st = useMemo(() => {
    return strength => null; // placeholder — computed below from prop
  }, []);
  void st;

  const currencySt = useMemo(() => {
    // NOTE: we no longer rely on the `strength` prop since it was removed from signature.
    return {};
  }, []);
  void currencySt;

  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % 4), 5200);
    return () => clearInterval(t);
  }, []);

  const go = useCallback((k) => onViewChange && onViewChange(k), [onViewChange]);

  const QUOTES = [
    'Discipline beats prediction every single time.',
    'The market pays patience, not activity.',
    'Amateurs chase trades. Professionals size them.',
    'Consistency compounds — recklessness compounds faster.',
  ];

  return (
    <>
      <style>{`
        .tf-wrap{ max-width:1240px; margin:0 auto; width:100%; padding:0 22px; }
        .tf-sec{ padding:86px 0; }
        .tf-sec-sm{ padding:54px 0; }
        .tf-alt{ background:${th.bg2}; }
        .tf-head{ text-align:center; margin-bottom:56px; }
        .tf-eyebrow{ display:inline-flex; align-items:center; gap:8px; font-size:11px;
          font-weight:800; letter-spacing:1.7px; text-transform:uppercase; color:${th.accent}; margin-bottom:14px; }
        .tf-eyebrow::before{ content:''; width:22px; height:2px; background:${th.accent}; }
        .tf-h2{ font-size:42px; line-height:1.1; font-weight:800; letter-spacing:-1.5px; color:${th.text}; margin:0 0 14px; }
        .tf-h2 .g{ color:${th.accent}; }
        .tf-sub{ font-size:15px; line-height:1.65; color:${th.textSecondary}; max-width:640px; margin:0 auto; }

        .tf-btn{ display:inline-flex; align-items:center; justify-content:center; gap:9px;
          padding:15px 30px; border-radius:10px; border:none; font-family:inherit; font-size:14.5px;
          font-weight:700; letter-spacing:.1px; cursor:pointer; transition:.22s; white-space:nowrap; }
        .tf-btn-gold{ background:linear-gradient(135deg, ${th.accent}, ${th.accentHover}); color:#0a0a0a;
          box-shadow:0 10px 26px ${th.accentLight}; }
        .tf-btn-gold:hover{ transform:translateY(-2px); }
        .tf-btn-outline{ background:transparent; color:${th.accent}; border:1.5px solid ${th.accent}; }
        .tf-btn-outline:hover{ background:${th.accentLight}; transform:translateY(-2px); }
        .pos{ color:${th.success}; } .neg{ color:${th.danger}; }

        .tf-hero{ position:relative; padding:100px 0 110px; text-align:center;
          background:linear-gradient(180deg, ${th.bg2} 0%, ${th.bg} 100%); }
        .tf-hero-inner{ position:relative; z-index:2; max-width:920px; margin:0 auto; padding:0 22px; }
        .tf-badge{ display:inline-flex; align-items:center; gap:9px; padding:7px 15px; border-radius:24px;
          background:${th.accentLight}; border:1px solid ${th.accentMuted}; color:${th.accent};
          font-size:11px; font-weight:800; letter-spacing:1.3px; text-transform:uppercase; margin-bottom:22px; }
        .tf-badge .dot{ width:7px; height:7px; border-radius:50%; background:${th.accent}; }
        .tf-hero h1{ font-size:76px; line-height:1.02; font-weight:900; letter-spacing:-3px; color:${th.text}; margin:0 0 22px; }
        .tf-hero h1 .g{ background:linear-gradient(100deg, ${th.accent} 0%, ${th.accentHover} 100%);
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .tf-hero-lead{ font-size:19px; line-height:1.55; color:${th.textSecondary}; max-width:660px; margin:0 auto 38px; }
        .tf-hero-cta{ display:flex; justify-content:center; gap:14px; flex-wrap:wrap; margin-bottom:44px; }
        .tf-trust{ display:flex; justify-content:center; gap:44px; flex-wrap:wrap; }
        .tf-trust span{ display:flex; align-items:center; gap:10px; font-size:14px; color:${th.textSecondary}; font-weight:600; }
        .tf-trust svg{ color:${th.accent}; flex-shrink:0; }
        .tf-herostats{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px;
          max-width:960px; margin:52px auto 0; padding:0 22px; position:relative; z-index:2; }
        .tf-herostat{ padding:22px 20px; border-radius:14px; border:1px solid ${th.border}; background:${th.card}; text-align:left; }
        .tf-herostat .n{ font-family:'JetBrains Mono',monospace; font-size:28px; font-weight:800;
          letter-spacing:-1.2px; color:${th.accent}; line-height:1; }
        .tf-herostat .l{ font-size:10.5px; font-weight:700; letter-spacing:1px;
          text-transform:uppercase; color:${th.textMuted}; margin-top:8px; }

        .tf-founder{ display:grid; grid-template-columns:320px 1fr; gap:44px; padding:44px;
          border-radius:20px; border:1px solid ${th.border};
          background:linear-gradient(180deg, ${th.card} 0%, ${th.bg2} 100%); }
        .tf-founder-photo{ position:relative; align-self:start; }
        .tf-founder-photo img{ display:block; width:100%; aspect-ratio:1/1; object-fit:cover;
          border-radius:16px; background:${th.card}; border:1px solid ${th.border}; }
        .tf-founder-tag{ position:absolute; left:16px; bottom:16px; padding:7px 16px; border-radius:22px;
          background:linear-gradient(135deg, ${th.accent}, ${th.accentHover}); color:#0a0a0a;
          font-size:10px; font-weight:900; letter-spacing:1.3px; text-transform:uppercase; }
        .tf-founder-body{ position:relative; z-index:1; }
        .tf-founder-name{ font-size:32px; font-weight:800; letter-spacing:-1px; color:${th.text}; margin:0 0 8px; }
        .tf-founder-role{ font-size:13px; font-weight:700; letter-spacing:.9px;
          text-transform:uppercase; color:${th.accent}; margin-bottom:22px; }
        .tf-founder-bio{ font-size:14.5px; line-height:1.85; color:${th.textSecondary}; margin:0 0 28px; }
        .tf-founder-bio strong{ color:${th.text}; font-weight:700; }
        .tf-founder-stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px;
          padding-top:26px; border-top:1px solid ${th.border}; }
        .tf-fstat .n{ font-family:'JetBrains Mono',monospace; font-size:26px; font-weight:800;
          letter-spacing:-1px; color:${th.accent}; line-height:1; }
        .tf-fstat .l{ font-size:10.5px; font-weight:700; letter-spacing:1px;
          text-transform:uppercase; color:${th.textMuted}; margin-top:8px; }

        .g-4{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .g-3{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .g-2{ display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }

        .tf-feature{ padding:28px 24px; border-radius:16px; border:1px solid ${th.border};
          background:${th.card}; transition:.26s; }
        .tf-feature:hover{ transform:translateY(-5px); border-color:${th.accentMuted}; }
        .tf-feature-icon{ width:46px; height:46px; border-radius:12px; display:grid; place-items:center;
          margin-bottom:18px; background:${th.accentLight}; border:1px solid ${th.accentMuted}; color:${th.accent}; }
        .tf-feature h4{ font-size:15.5px; font-weight:800; color:${th.text}; margin:0 0 9px; letter-spacing:-.2px; }
        .tf-feature p{ font-size:13px; line-height:1.65; color:${th.textSecondary}; margin:0; }

        .tf-timeline{ position:relative; padding-left:34px; max-width:760px; margin:0 auto; }
        .tf-timeline::before{ content:''; position:absolute; left:8px; top:8px; bottom:8px;
          width:2px; background:${th.border}; }
        .tf-tl-item{ position:relative; padding-bottom:28px; }
        .tf-tl-item:last-child{ padding-bottom:0; }
        .tf-tl-item::before{ content:''; position:absolute; left:-32px; top:6px;
          width:12px; height:12px; border-radius:50%; background:${th.bg};
          border:2px solid ${th.accent}; box-shadow:0 0 0 4px ${th.accentLight}; }
        .tf-tl-item .y{ font-family:'JetBrains Mono',monospace; font-size:11.5px;
          font-weight:800; letter-spacing:1px; color:${th.accent}; }
        .tf-tl-item h6{ font-size:15px; font-weight:800; color:${th.text}; margin:5px 0 6px; }
        .tf-tl-item p{ font-size:13px; line-height:1.7; color:${th.textSecondary}; margin:0; }

        .tf-service{ padding:28px 22px; border-radius:16px; border:1px solid ${th.border};
          background:${th.card}; cursor:pointer; transition:.26s; }
        .tf-service:hover{ transform:translateY(-5px); border-color:${th.accentMuted}; }
        .tf-service-icon{ width:46px; height:46px; border-radius:12px; display:grid; place-items:center;
          margin-bottom:18px; background:${th.accentLight}; border:1px solid ${th.accentMuted}; color:${th.accent}; }
        .tf-service h3{ font-size:15px; font-weight:800; color:${th.text}; margin:0 0 9px; letter-spacing:-.2px; }
        .tf-service p{ font-size:12.5px; line-height:1.65; color:${th.textSecondary}; margin:0 0 16px; min-height:66px; }
        .tf-service-cta{ display:inline-flex; align-items:center; gap:6px; font-size:11.5px;
          font-weight:800; letter-spacing:.4px; color:${th.accent}; text-transform:uppercase; }

        .tf-basic{ padding:24px 26px; border-radius:14px; border:1px solid ${th.border};
          background:${th.card}; }
        .tf-basic h4{ font-size:14px; font-weight:800; color:${th.text}; margin:0 0 8px; }
        .tf-basic p{ font-size:12.5px; line-height:1.7; color:${th.textSecondary}; margin:0; }

        .tf-tbl-wrap{ border-radius:14px; border:1px solid ${th.border}; background:${th.card}; overflow:hidden; }
        .tf-tbl{ width:100%; border-collapse:collapse; }
        .tf-tbl th{ text-align:left; padding:16px 22px; font-size:10.5px; font-weight:800;
          letter-spacing:1px; text-transform:uppercase; color:${th.textMuted};
          background:${th.bg2}; border-bottom:1px solid ${th.border}; }
        .tf-tbl th.r, .tf-tbl td.r{ text-align:right; }
        .tf-tbl td{ padding:16px 22px; font-size:13px; color:${th.textSecondary};
          border-bottom:1px solid ${th.border}; }
        .tf-tbl tr:last-child td{ border-bottom:none; }
        .tf-tbl td.num{ font-family:'JetBrains Mono',monospace; font-size:12.5px; font-weight:700; color:${th.text}; }

        .tf-strat{ padding:24px; border-radius:14px; border:1px solid ${th.border};
          background:${th.card}; }
        .tf-strat-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:12px; }
        .tf-strat h4{ font-size:14px; font-weight:800; color:${th.text}; }
        .tf-strat .meta{ font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700;
          color:${th.accent}; padding:4px 8px; border-radius:5px; background:${th.accentLight}; }
        .tf-strat p{ font-size:12.5px; line-height:1.7; color:${th.textSecondary}; margin:0; }

        .tf-events{ border-radius:14px; border:1px solid ${th.border}; background:${th.card}; overflow:hidden; }
        .tf-event{ display:grid; grid-template-columns:80px 80px 1fr 120px 170px;
          gap:16px; align-items:center; padding:16px 22px;
          border-bottom:1px solid ${th.border}; }
        .tf-event:last-child{ border-bottom:none; }
        .tf-event .d{ font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:800;
          letter-spacing:1px; color:${th.accent}; }
        .tf-event .t{ font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; color:${th.textSecondary}; }
        .tf-event .e{ font-size:13px; font-weight:600; color:${th.text}; }
        .tf-event .imp{ font-size:9.5px; font-weight:800; letter-spacing:.9px;
          text-transform:uppercase; padding:5px 10px; border-radius:6px; text-align:center; }
        .tf-event .imp.vh{ background:rgba(239,68,68,.12); color:${th.danger}; }
        .tf-event .imp.h { background:rgba(245,165,36,.12); color:#f5a524; }
        .tf-event .imp.m { background:rgba(59,130,246,.12); color:#3b82f6; }
        .tf-event .af{ font-size:11.5px; color:${th.textMuted}; }

        .tf-gloss{ display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
        .tf-term{ display:flex; gap:16px; align-items:flex-start; padding:16px 18px;
          border-radius:12px; border:1px solid ${th.border}; background:${th.card}; }
        .tf-term .k{ font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:800;
          color:${th.accent}; min-width:100px; padding-top:2px; }
        .tf-term .v{ font-size:12.5px; line-height:1.65; color:${th.textSecondary}; }

        .tf-article{ padding:24px 22px; border-radius:14px; border:1px solid ${th.border};
          background:${th.card}; cursor:pointer; }
        .tf-article .cat{ font-size:9.5px; font-weight:800; letter-spacing:1.2px;
          text-transform:uppercase; color:${th.accent}; margin-bottom:12px; }
        .tf-article h5{ font-size:13.5px; font-weight:800; color:${th.text}; line-height:1.45;
          margin:0 0 14px; min-height:40px; }
        .tf-article .meta{ display:flex; justify-content:space-between; font-size:10.5px; color:${th.textMuted}; }

        .tf-news{ padding:38px 34px; border-radius:18px; border:1px solid ${th.accentMuted};
          background:${th.card};
          display:grid; grid-template-columns:1.2fr 1fr; gap:32px; align-items:center; }
        .tf-news h3{ font-size:20px; font-weight:800; letter-spacing:-.5px; color:${th.text}; margin:0 0 10px; }
        .tf-news p{ font-size:12.5px; line-height:1.65; color:${th.textSecondary}; margin:0; }
        .tf-news-form{ display:flex; gap:10px; flex-wrap:wrap; }
        .tf-news-form input{ flex:1 1 220px; padding:14px 16px; border-radius:10px;
          font-family:inherit; font-size:13px; color:${th.text}; background:${th.bg2};
          border:1px solid ${th.border}; outline:none; }

        .tf-cta{ padding:88px 40px; border-radius:22px; text-align:center;
          border:1px solid ${th.accentMuted};
          background:linear-gradient(180deg, ${th.card} 0%, ${th.bg} 100%); }
        .tf-cta h2{ font-size:42px; font-weight:900; letter-spacing:-1.7px; color:${th.text}; margin:0 0 16px; line-height:1.1; }
        .tf-cta h2 .g{ color:${th.accent}; }
        .tf-cta p{ font-size:15px; line-height:1.65; color:${th.textSecondary};
          max-width:580px; margin:0 auto 34px; }
        .tf-cta-row{ display:flex; justify-content:center; gap:14px; flex-wrap:wrap; }

        .tf-notice{ display:flex; align-items:flex-start; gap:12px; padding:20px 22px;
          border-radius:12px; background:${th.accentLight}; border:1px solid ${th.accentMuted}; }
        .tf-notice svg{ width:18px; height:18px; flex-shrink:0; margin-top:1px;
          stroke:${th.accent}; fill:none; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
        .tf-notice span{ font-size:12.5px; line-height:1.7; color:${th.textSecondary}; }

        .tf-quote-band{ padding:32px 42px; border-radius:18px; border:1px solid ${th.border};
          background:${th.card}; display:flex; align-items:center; gap:24px; }
        .tf-quote-mark{ font-family:Georgia,serif; font-size:58px; line-height:.55;
          color:${th.accent}; opacity:.35; flex-shrink:0; }
        .tf-quote-text{ font-size:17px; font-weight:600; color:${th.text}; letter-spacing:-.3px; line-height:1.5; }

        @media (max-width:1100px){
          .tf-hero h1{ font-size:60px; letter-spacing:-2.4px; }
          .g-4{ grid-template-columns:repeat(2,1fr); }
          .g-3{ grid-template-columns:repeat(2,1fr); }
          .tf-h2{ font-size:36px; letter-spacing:-1.2px; }
          .tf-herostats{ grid-template-columns:repeat(2,1fr); }
          .mk-tabs{ grid-template-columns:1fr !important; }
          .mk-tabs-side{ border-right:none !important; border-bottom:1px solid ${th.border};
            display:flex !important; overflow-x:auto; gap:6px; padding:12px !important; }
          .mk-tabs-side > button{ flex-shrink:0; min-width:220px; }
          .rc-grid{ grid-template-columns:1fr !important; }
        }
        @media (max-width:900px){
          .tf-hero{ padding:72px 0 84px; }
          .tf-hero h1{ font-size:50px; letter-spacing:-1.9px; }
          .tf-hero-lead{ font-size:16.5px; }
          .tf-founder{ grid-template-columns:1fr; gap:32px; padding:32px; }
          .tf-founder-photo{ max-width:320px; }
          .tf-founder-stats{ grid-template-columns:repeat(2,1fr); gap:22px; }
          .tf-sec{ padding:66px 0; }
          .tf-event{ grid-template-columns:70px 70px 1fr 100px; }
          .tf-event .af{ display:none; }
          .tf-news{ grid-template-columns:1fr; gap:22px; padding:28px 26px; }
          .faq-g{ grid-template-columns:1fr !important; }
          .g-4-sess{ grid-template-columns:repeat(2,1fr) !important; }
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
          .tf-sec{ padding:54px 0; }
          .tf-sec-sm{ padding:40px 0; }
          .tf-head{ margin-bottom:38px; }
          .g-4, .g-3, .g-2{ grid-template-columns:1fr !important; gap:12px !important; }
          .tf-herostats{ grid-template-columns:1fr 1fr; gap:10px; padding:0 16px; margin-top:40px; }
          .tf-herostat .n{ font-size:22px; }
          .tf-feature, .tf-service{ padding:22px 18px; }
          .tf-service p{ min-height:0; }
          .tf-founder{ padding:22px 18px; gap:26px; }
          .tf-founder-photo{ max-width:100%; }
          .tf-founder-name{ font-size:25px; }
          .tf-founder-bio{ font-size:13.5px; }
          .tf-founder-stats{ grid-template-columns:1fr 1fr; gap:18px; }
          .tf-fstat .n{ font-size:22px; }
          .tf-basic{ padding:20px 18px; }
          .tf-tbl th, .tf-tbl td{ padding:12px 14px; font-size:12px; }
          .tf-event{ grid-template-columns:60px 60px 1fr; gap:10px; padding:13px 15px; }
          .tf-event .imp{ display:none; }
          .tf-news{ padding:24px 20px; }
          .tf-news h3{ font-size:18px; }
          .tf-news-form input{ flex:1 1 100%; }
          .tf-cta{ padding:54px 22px; border-radius:18px; }
          .tf-cta h2{ font-size:27px; letter-spacing:-1px; }
          .tf-cta p{ font-size:13.5px; }
          .tf-quote-band{ padding:22px 22px; gap:14px; flex-direction:column; align-items:flex-start; }
          .tf-quote-mark{ font-size:40px; }
          .tf-quote-text{ font-size:14.5px; }
          .g-4-sess{ grid-template-columns:1fr !important; }
        }
        @media (max-width:420px){
          .tf-hero h1{ font-size:32px; }
          .tf-herostats{ grid-template-columns:1fr; }
          .tf-founder-stats{ grid-template-columns:1fr; }
        }
      `}</style>

      <section className="view active">

        {/* ===== HERO ===== */}
        <div className="tf-hero">
          <div className="tf-hero-inner">
            <div className="tf-badge"><span className="dot" /> MyTradeApp · Built by Tonnyfx</div>
            <h1>Master Forex Trading<br />with <span className="g">Tonnyfx</span></h1>
            <p className="tf-hero-lead">
              Learn, trade and grow with proven strategies and real results.
              MyTradeApp is the third-party terminal I built for EUR/USD, BTC/USD and XAU/USD —
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
          <div className="tf-herostats">
            {STATS.map((s) => (
              <div key={s.l} className="tf-herostat">
                <div className="n"><Counter to={s.n} suffix={s.suffix} /></div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== ABOUT / FOUNDER ===== */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">About</div>
                <h2 className="tf-h2">About <span className="g">MyTradeApp</span></h2>
                <p className="tf-sub">
                  MyTradeApp is a results-driven forex automation and trading-tools brand by Tonnyfx,
                  helping traders from beginner to advanced become consistently profitable.
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="tf-founder">
                <div className="tf-founder-photo">
                  <img src={tonnyPhoto} alt="Tonny — founder of MyTradeApp" loading="lazy" />
                  <span className="tf-founder-tag">Founder</span>
                </div>
                <div className="tf-founder-body">
                  <h3 className="tf-founder-name">Tonny (Tonnyfx)</h3>
                  <div className="tf-founder-role">Forex Trader · Mentor · Founder</div>
                  <p className="tf-founder-bio">
                    Tonny is a full-time forex trader, mentor and founder of MyTradeApp, with{' '}
                    <strong>over 10 years of experience</strong> in the financial markets. Known for a
                    practical, no-hype approach to trading, he focuses on helping traders develop
                    discipline, consistency and profitable habits through mentorship and real market
                    execution. He trades three instruments only —{' '}
                    <strong>EUR/USD, BTC/USD and XAU/USD</strong> — and every tool inside MyTradeApp
                    reflects that focus.
                  </p>
                  <div className="tf-founder-stats">
                    {STATS.map((s) => (
                      <div className="tf-fstat" key={s.l}>
                        <div className="n"><Counter to={s.n} suffix={s.suffix} /></div>
                        <div className="l">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
            <div className="g-4" style={{ marginTop: 32 }}>
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 80}>
                  <div className="tf-feature">
                    <div className="tf-feature-icon"><Icon name={f.icon} /></div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div style={{ marginTop: 56 }}>
              <Reveal>
                <div className="tf-head" style={{ marginBottom: 32 }}>
                  <div className="tf-eyebrow">Philosophy</div>
                  <h2 className="tf-h2" style={{ fontSize: 30 }}>Four rules I trade by</h2>
                </div>
              </Reveal>
              <div className="g-4">
                {PHILOSOPHY.map((p, i) => (
                  <Reveal key={p.title} delay={i * 80}>
                    <div className="tf-feature">
                      <div className="tf-feature-icon"><Icon name={p.icon} /></div>
                      <h4>{p.title}</h4>
                      <p>{p.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== TIMELINE ===== */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Journey</div>
                <h2 className="tf-h2">The road to <span className="g">MyTradeApp</span></h2>
                <p className="tf-sub">
                  A decade of trading, losing, learning and rebuilding — written down honestly.
                </p>
              </div>
            </Reveal>
            <div className="tf-timeline">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.year} delay={i * 60}>
                  <div className="tf-tl-item">
                    <div className="y">{t.year}</div>
                    <h6>{t.title}</h6>
                    <p>{t.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== SERVICES ===== */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Our Services</div>
                <h2 className="tf-h2">What <span className="g">MyTradeApp</span> provides</h2>
                <p className="tf-sub">
                  From free tools to fully automated bots and 1-on-1 coaching —
                  everything a retail trader actually needs.
                </p>
              </div>
            </Reveal>
            <div className="g-4">
              {SERVICES.map((s, i) => (
                <Reveal key={s.key} delay={i * 50}>
                  <div className="tf-service" onClick={() => go(s.key)} role="button" tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') go(s.key); }}>
                    <div className="tf-service-icon"><Icon name={s.icon} /></div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <span className="tf-service-cta">{s.cta} →</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== MARKETS ===== */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Markets</div>
                <h2 className="tf-h2">Three instruments. <span className="g">Total mastery.</span></h2>
                <p className="tf-sub">
                  We deliberately trade a tiny universe so every bot, every calculator
                  and every risk rule is tuned to the exact behaviour of that market.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <MarketTabs pairs={pairs} onTrade={onTrade} th={th} />
            </Reveal>
          </div>
        </div>

        {/* ===== BOTS ===== */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Automation</div>
                <h2 className="tf-h2">Trading bots, tuned <span className="g">one market each</span></h2>
                <p className="tf-sub">
                  Every strategy is built for a single instrument. No generic multi-asset logic —
                  just focused systems with transparent performance.
                </p>
              </div>
            </Reveal>
            <BotExplorer onViewChange={go} th={th} />
          </div>
        </div>

        {/* ===== TOOLS ===== */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Free Tools</div>
                <h2 className="tf-h2">Size every trade. <span className="g">Read every currency.</span></h2>
                <p className="tf-sub">
                  Two tools that do more for your account than any indicator ever will.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div style={{ padding: '34px 30px', borderRadius: 18, border: `1px solid ${th.border}`, background: th.card, maxWidth: 820, margin: '0 auto' }}>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: th.text, margin: '0 0 4px' }}>
                  Advanced Risk Calculator
                </h3>
                <p style={{ fontSize: 12, color: th.textMuted, margin: '0 0 24px' }}>
                  Live sliders · dynamic risk score · EUR/USD pip value $10
                </p>
                <RiskCalculator th={th} />
              </div>
            </Reveal>
          </div>
        </div>

        {/* ===== HOW IT WORKS ===== */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">How it works</div>
                <h2 className="tf-h2">From sign-up to <span className="g">automated</span> in four steps</h2>
              </div>
            </Reveal>
            <div className="g-4">
              {[
                { n:1, t:'Create your account', d:'Sign up in under a minute. No broker lock-in — connect any supported MT4/MT5 or crypto venue.' },
                { n:2, t:'Size your risk', d:'Run the calculator, set your risk %, and let the risk manager cap your daily exposure.' },
                { n:3, t:'Switch on a bot', d:'Pick a strategy for EUR/USD, BTC/USD or XAU/USD and let it execute while you watch.' },
                { n:4, t:'Review & refine', d:'Every trade lands in your journal with expectancy stats, so next week is sharper.' },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="tf-feature">
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 34, fontWeight: 900,
                      letterSpacing: -2, color: th.accent, lineHeight: 1, marginBottom: 16 }}>
                      {String(s.n).padStart(2, '0')}
                    </div>
                    <h4>{s.t}</h4>
                    <p>{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== FOREX BASICS ===== */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Forex 101</div>
                <h2 className="tf-h2">Everything a new trader <span className="g">needs to know</span></h2>
                <p className="tf-sub">
                  Straight answers to the questions every retail trader asks in their first month.
                </p>
              </div>
            </Reveal>
            <div className="g-2">
              {FOREX_BASICS.map((b, i) => (
                <Reveal key={b.t} delay={i * 40}>
                  <div className="tf-basic">
                    <h4>{b.t}</h4>
                    <p>{b.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== SESSIONS ===== */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Market clock</div>
                <h2 className="tf-h2">The four <span className="g">forex sessions</span></h2>
                <p className="tf-sub">Know when the market moves — timing matters as much as direction.</p>
              </div>
            </Reveal>
            <SessionClock th={th} />
          </div>
        </div>

        {/* ===== PIP TABLE ===== */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Reference</div>
                <h2 className="tf-h2">Pip value <span className="g">cheat-sheet</span></h2>
                <p className="tf-sub">What one pip is worth per lot size, for the instruments you actually trade.</p>
              </div>
            </Reveal>
            <Reveal delay={80}>
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
                        <td><strong style={{ color: th.text }}>{r.pair}</strong></td>
                        <td className="r num">{r.pip}</td>
                        <td className="r num">{r.std}</td>
                        <td className="r num">{r.mini}</td>
                        <td className="r num">{r.micro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ===== STRATEGIES ===== */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Strategy library</div>
                <h2 className="tf-h2">Four strategies, <span className="g">explained simply</span></h2>
                <p className="tf-sub">The playbooks behind our bots — written so a beginner can follow.</p>
              </div>
            </Reveal>
            <div className="g-2">
              {STRATEGIES.map((s, i) => (
                <Reveal key={s.name} delay={i * 60}>
                  <div className="tf-strat">
                    <div className="tf-strat-head">
                      <h4>{s.name}</h4>
                      <span className="meta">{s.market} · {s.tf}</span>
                    </div>
                    <p>{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== EVENTS ===== */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">This week</div>
                <h2 className="tf-h2">High-impact <span className="g">events to watch</span></h2>
                <p className="tf-sub">
                  Filtered for EUR/USD, BTC/USD and XAU/USD. Volatility clusters around these releases.
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
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
            </Reveal>
          </div>
        </div>

        {/* ===== GLOSSARY ===== */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Glossary</div>
                <h2 className="tf-h2">Forex terms, <span className="g">defined plainly</span></h2>
              </div>
            </Reveal>
            <div className="tf-gloss">
              {GLOSSARY.map((g, i) => (
                <Reveal key={g.k} delay={i * 40}>
                  <div className="tf-term">
                    <div className="k">{g.k}</div>
                    <div className="v">{g.v}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== MILESTONES ===== */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">By the numbers</div>
                <h2 className="tf-h2">The platform in <span className="g">real numbers</span></h2>
              </div>
            </Reveal>
            <div className="g-4">
              {MILESTONES.map((m, i) => (
                <Reveal key={m.l} delay={i * 80}>
                  <div className="tf-feature" style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800,
                      letterSpacing: -1.2, color: th.accent, lineHeight: 1, marginBottom: 10 }}>
                      <Counter to={m.n} prefix={m.prefix || ''} suffix={m.suffix || ''} decimals={m.decimals || 0} />
                    </div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1,
                      textTransform: 'uppercase', color: th.textMuted }}>
                      {m.l}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== QUOTE BAND ===== */}
        <div className="tf-wrap tf-sec-sm">
          <Reveal>
            <div className="tf-quote-band">
              <div className="tf-quote-mark">“</div>
              <div className="tf-quote-text" key={quoteIdx}>{QUOTES[quoteIdx]}</div>
            </div>
          </Reveal>
        </div>

        {/* ===== PRICING ===== */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Pricing</div>
                <h2 className="tf-h2">Simple plans. <span className="g">No lock-in.</span></h2>
                <p className="tf-sub">Start free, upgrade when you are ready to run live bots.</p>
              </div>
            </Reveal>
            <Pricing th={th} onViewChange={go} />
          </div>
        </div>

        {/* ===== TESTIMONIALS ===== */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">Feedback</div>
                <h2 className="tf-h2">What the <span className="g">community</span> says</h2>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <TestimonialCarousel th={th} />
            </Reveal>
          </div>
        </div>

        {/* ===== ARTICLES ===== */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">From the journal</div>
                <h2 className="tf-h2">Latest <span className="g">articles & guides</span></h2>
                <p className="tf-sub">
                  Written by Tonny and the community — practical, no-hype content, updated weekly.
                </p>
              </div>
            </Reveal>
            <div className="g-3">
              {ARTICLES.map((a, i) => (
                <Reveal key={a.title} delay={i * 50}>
                  <div className="tf-article">
                    <div className="cat">{a.cat}</div>
                    <h5>{a.title}</h5>
                    <div className="meta"><span>{a.date}</span><span>{a.read}</span></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== NEWSLETTER ===== */}
        <div className="tf-wrap tf-sec-sm">
          <Reveal>
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
          </Reveal>
        </div>

        {/* ===== FAQ ===== */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <Reveal>
              <div className="tf-head">
                <div className="tf-eyebrow">FAQ</div>
                <h2 className="tf-h2">Questions traders <span className="g">ask first</span></h2>
              </div>
            </Reveal>
            <FAQAccordion th={th} />
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="tf-wrap tf-sec">
          <Reveal>
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
          </Reveal>
        </div>

        {/* ===== NOTICE ===== */}
        <div className="tf-wrap" style={{ paddingBottom: 70 }}>
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