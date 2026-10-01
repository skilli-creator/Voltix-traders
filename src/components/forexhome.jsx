// src/components/forexhome.jsx
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import {
  CURRENCIES, CUR_NAMES, WATCHLIST,
  fmt, fmtMoney, fmtPrice,
  currencyStrength, Sparkline,
} from '../pages/forexdash';
import tonnyPhoto from '../assets/images/image13.png';

/* ================================================================== */
/*  MASSIVE CONTENT LIBRARY                                            */
/* ================================================================== */

const MARKETS = [
  { sym:'EURUSD', label:'EUR/USD', name:'Euro / US Dollar', tag:'Major', accent:'#3b82f6',
    desc:'The world’s most liquid currency pair. Tight spreads, deep liquidity and clean directional trends during the London and New York sessions.',
    spread:'0.4 pips', session:'London · New York', vol:'Medium', atr:'65 pips', margin:'0.5%' },
  { sym:'BTCUSD', label:'BTC/USD', name:'Bitcoin / US Dollar', tag:'Crypto', accent:'#f5a524',
    desc:'24/7 volatility with enormous intraday ranges. Built for momentum, breakout and session-based automation strategies.',
    spread:'$12', session:'24 / 7', vol:'High', atr:'$1,200', margin:'2.0%' },
  { sym:'XAUUSD', label:'XAU/USD', name:'Gold / US Dollar', tag:'Metal', accent:'#00d68f',
    desc:'The classic safe-haven asset. Strong directional runs during risk-off flows, US data releases and geopolitical events.',
    spread:'18 pts', session:'London · New York', vol:'High', atr:'$24', margin:'1.0%' },
];

const SERVICES = [
  { key:'bots', title:'Automated Trading Bots', desc:'Six pre-built, broker-agnostic strategies tuned exclusively for EUR/USD, BTC/USD and XAU/USD. Toggle on, track live P/L and let execution run itself.', cta:'Manage bots',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="7.5" width="17" height="12" rx="3.5"/><path d="M12 7.5V4"/><circle cx="12" cy="3.4" r="1"/><path d="M9 13h.01M15 13h.01"/><path d="M9.5 16.5h5"/></svg>) },
  { key:'lot', title:'Lot Size Calculator', desc:'Risk-based position sizing for every instrument. Enter your balance, risk % and stop-loss distance — get the exact lot size instantly.', cta:'Calculate size',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 7.5h8"/><path d="M8 12h1.5M12 12h1.5M16 12h.01M8 16h1.5M12 16h1.5M16 16h.01"/></svg>) },
  { key:'strength', title:'Currency Strength Meter', desc:'Rank the eight majors against a weighted basket and identify the strongest and weakest currencies at a single glance.', cta:'View strength',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 20v-8"/><path d="M12 20V4"/><path d="M19 20v-5"/></svg>) },
  { key:'signals', title:'Live Signal Alerts', desc:'Momentum, breakout and mean-reversion alerts delivered the moment price structure shifts on any instrument you follow.', cta:'See alerts',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>) },
  { key:'risk', title:'Risk & Margin Manager', desc:'Real-time margin level, free margin and exposure warnings so a single bad trade never takes down your whole account.', cta:'Review risk',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>) },
  { key:'journal', title:'Trade Journal & Analytics', desc:'Every fill, every pip, every decision logged automatically. Win rate, expectancy, drawdown and equity curve all in one view.', cta:'Open journal',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 8h7M8 12h7M8 16h4"/></svg>) },
  { key:'pipvalue', title:'Pip Value Calculator', desc:'Instantly compute the monetary value of one pip per lot for any pair, account currency and position size.', cta:'Compute pips',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="18" cy="18" r="2.5"/></svg>) },
  { key:'calendar', title:'Economic Calendar', desc:'High-impact events — NFP, CPI, FOMC, ECB — filtered for the three instruments you actually trade, with volatility forecasts.', cta:'View calendar',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>) },
  { key:'backtest', title:'Backtesting Engine', desc:'Run any bot against years of historical tick data before risking a cent. See drawdown, Sharpe and profit factor up front.', cta:'Run backtest',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18"/><path d="M6 20V9l4 4 4-8 4 6v9"/></svg>) },
  { key:'builder', title:'Strategy Builder', desc:'Drag-and-drop entry, exit and filter rules to compose your own bot — zero code, fully exportable, backtestable.', cta:'Build strategy',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>) },
  { key:'vps', title:'Low-Latency VPS Hosting', desc:'Bots run from data centres in London and New York with sub-2ms broker latency — always on, always connected, never offline.', cta:'Deploy VPS',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg>) },
  { key:'coaching', title:'1-on-1 Trader Coaching', desc:'Direct one-hour sessions with Tonny covering risk, journaling, bot selection and strategy design — built around your account.', cta:'Book session',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>) },
  { key:'mobile', title:'Mobile Trading App', desc:'Monitor bots, close positions and check equity from your phone. Full sync with the web terminal, push alerts included.', cta:'Get app',
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M12 18h.01"/></svg>) },
];

const BOTS = [
  { name:'Pip Scalper', market:'EUR/USD', tf:'M5', win:68, trades:1243, dd:'4.2%', risk:'Low', tag:'Scalping', live:true, pf:2.1, sharpe:1.8 },
  { name:'Momentum Rider', market:'BTC/USD', tf:'H1', win:61, trades:486, dd:'9.8%', risk:'Medium', tag:'Trend', live:true, pf:1.9, sharpe:1.5 },
  { name:'Gold Reversal', market:'XAU/USD', tf:'M30', win:57, trades:712, dd:'11.4%', risk:'High', tag:'Mean reversion', live:true, pf:1.7, sharpe:1.2 },
  { name:'London Breakout', market:'EUR/USD', tf:'M15', win:64, trades:894, dd:'6.1%', risk:'Medium', tag:'Breakout', live:true, pf:2.0, sharpe:1.6 },
  { name:'Asian Range Fade', market:'XAU/USD', tf:'M15', win:59, trades:534, dd:'7.9%', risk:'Low', tag:'Range', live:true, pf:1.6, sharpe:1.3 },
  { name:'Crypto Session Bot', market:'BTC/USD', tf:'H4', win:55, trades:312, dd:'13.2%', risk:'High', tag:'Swing', live:true, pf:1.8, sharpe:1.4 },
];

const PHILOSOPHY = [
  { icon:'◆', title:'Risk first, always', text:'No trade idea matters if the position size is wrong. Every tool in MyTradeApp starts from the same question: how much can I lose?' },
  { icon:'▣', title:'One market, one edge', text:'I trade three instruments — EUR/USD, BTC/USD and XAU/USD. Specialising beats generalising, and every bot reflects that.' },
  { icon:'▲', title:'Let the data decide', text:'Journal everything. Review every week. Stats will tell you which strategy is working long before your feelings do.' },
  { icon:'●', title:'Automate the boring part', text:'Execution should be mechanical. The edge lives in the rules, not in your mouse clicks. Bots remove emotion from the equation.' },
];

const TIMELINE = [
  { year:'2014', title:'First live account', text:'Opened my first trading account with $500. Lost most of it in three months. That loss became the foundation for everything I built afterward.' },
  { year:'2016', title:'Full-time trader', text:'Left the day job after 18 months of consistent profitability. Focused entirely on EUR/USD and risk management — nothing else.' },
  { year:'2018', title:'Built my first bot', text:'Wrote a simple M5 scalper for EUR/USD that ran overnight. It wasn’t profitable yet, but it never skipped a session and never traded on emotion.' },
  { year:'2020', title:'Added gold and crypto', text:'Extended the framework to XAU/USD and BTC/USD. Discovered that the same risk rules applied — the markets were different, but discipline was universal.' },
  { year:'2023', title:'MyTradeApp is born', text:'Packaged the tools I’d built for myself into one terminal. Third-party, broker-agnostic, and focused on what actually moves the needle.' },
  { year:'2025', title:'A community of traders', text:'Thousands of retail traders now use MyTradeApp every week. Same tools, same discipline, no hype, no signal groups.' },
];

const TESTIMONIALS = [
  { q:'The lot size calculator alone saved my account. I stopped guessing position sizes and started sizing properly — my drawdown dropped by half in two months.', n:'Daniel M.', r:'Swing trader · EUR/USD' },
  { q:'I run the Gold Reversal bot overnight and the Momentum Rider during US hours. Clean execution, no drama, clear reporting every single morning.', n:'Priya S.', r:'Part-time trader · XAU/USD' },
  { q:'The strength meter tells me in two seconds whether I should be long or short the dollar. That one screen changed my entire directional bias.', n:'Kwame A.', r:'Day trader · Majors' },
  { q:'Tonny’s coaching session was worth more than every course I’ve bought combined. We rebuilt my risk plan from scratch in one hour.', n:'Marco L.', r:'Beginner · All pairs' },
  { q:'The backtesting engine let me test five strategies before committing real money. That feature alone paid for the whole subscription.', n:'Sarah K.', r:'Systematic trader · BTC/USD' },
  { q:'Finally a platform that treats EUR/USD, gold and crypto as three different animals. The bots clearly reflect that intelligence.', n:'Yusuf B.', r:'Multi-asset · XAU/USD' },
];

const FOREX_BASICS = [
  { t:'What is forex trading?', d:'Forex is the global marketplace for exchanging national currencies. With roughly $7.5 trillion traded every single day, it is by far the largest and most liquid financial market in the world.' },
  { t:'The major pairs explained', d:'EUR/USD, USD/JPY, GBP/USD and USD/CHF are the majors. They carry the tightest spreads and deepest liquidity — which is exactly why MyTradeApp focuses on EUR/USD first.' },
  { t:'What is a pip?', d:'A pip is the smallest standardised move in a currency pair — usually 0.0001 for most pairs and 0.01 for JPY pairs. Pip value depends on your lot size and account currency.' },
  { t:'Lots, mini lots and micro lots', d:'A standard lot is 100,000 units. A mini lot is 10,000. A micro lot is 1,000. Position sizing tools work in all three, so a $200 account can trade without over-leveraging.' },
  { t:'Leverage and margin', d:'Leverage lets you control a large position with a small deposit. It magnifies both profits and losses. Margin is the collateral your broker locks while the trade is open.' },
  { t:'Trading sessions', d:'Forex runs 24 hours a day, five days a week, across three overlapping sessions: Sydney/Tokyo, London and New York. Volatility peaks during the London–New York overlap.' },
  { t:'Technical vs fundamental analysis', d:'Technical analysis studies price structure and momentum. Fundamental analysis studies interest rates, inflation and geopolitics. Serious traders use both.' },
  { t:'Risk management rules', d:'The golden rule: never risk more than 1–2% of your account on a single trade. The second rule: always use a stop-loss. MyTradeApp enforces both automatically.' },
];

const GLOSSARY = [
  { k:'Spread', v:'The difference between the bid and ask price — your cost to enter a trade.' },
  { k:'Leverage', v:'A multiplier that lets you control a larger position than your deposit would allow.' },
  { k:'Margin call', v:'A broker demand for additional funds when your equity falls below required margin.' },
  { k:'Drawdown', v:'The peak-to-trough decline in your equity. The single most important risk metric.' },
  { k:'Stop-loss', v:'A pre-set order that closes your trade automatically at a defined loss level.' },
  { k:'Take-profit', v:'A pre-set order that closes your trade automatically once a profit target is hit.' },
  { k:'Slippage', v:'The difference between the expected price and the actual fill price on execution.' },
  { k:'Win rate', v:'The percentage of trades that close in profit. Meaningless without average risk/reward.' },
  { k:'Expectancy', v:'The average profit per trade. Calculated as (win rate × avg win) − (loss rate × avg loss).' },
  { k:'Sharpe ratio', v:'Return per unit of risk. Above 1.0 is good; above 2.0 is considered excellent.' },
];

const SESSIONS = [
  { name:'Sydney', hours:'22:00 – 07:00 UTC', color:'#a855f7', note:'Thin liquidity · tight ranges · AUD & NZD most active' },
  { name:'Tokyo',  hours:'00:00 – 09:00 UTC', color:'#3b82f6', note:'JPY pairs dominate · steady, methodical price action' },
  { name:'London', hours:'07:00 – 16:00 UTC', color:'#00d68f', note:'Highest volume · strongest trends · EUR & GBP active' },
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
  { name:'London Breakout', market:'EUR/USD', tf:'M15', desc:'Fade the Asian range and ride the first London impulse. Classic, robust, session-based — a workhorse strategy for the euro.' },
  { name:'Trend Continuation', market:'BTC/USD', tf:'H1', desc:'Enter on pullbacks in the direction of the daily trend, using the H1 EMA ribbon as a filter. Trend-following with a crypto edge.' },
  { name:'Gold Mean Reversion', market:'XAU/USD', tf:'M30', desc:'Fade extremes against the 200 EMA. Tight targets, high win rate, capped upside — perfect for range-bound gold sessions.' },
  { name:'NY Reversal', market:'EUR/USD', tf:'M5', desc:'Trade the first exhaustion candle after the US cash open, targeting the London close. Fast, precise, and time-of-day specific.' },
];

const EVENTS = [
  { day:'MON', time:'14:00', event:'US ISM Manufacturing PMI', impact:'High', affect:'EUR/USD · XAU/USD' },
  { day:'WED', time:'18:00', event:'FOMC Interest Rate Decision', impact:'Very High', affect:'All instruments' },
  { day:'THU', time:'12:30', event:'US Initial Jobless Claims', impact:'Medium', affect:'EUR/USD' },
  { day:'FRI', time:'12:30', event:'US Non-Farm Payrolls (NFP)', impact:'Very High', affect:'All instruments' },
  { day:'FRI', time:'14:00', event:'ECB President Speech', impact:'High', affect:'EUR/USD' },
];

const ARTICLES = [
  { cat:'Risk', title:'Why 1% risk per trade beats every indicator you will ever buy', read:'6 min', date:'Oct 12, 2026' },
  { cat:'Strategy', title:'The London Breakout, explained step by step with real examples', read:'9 min', date:'Oct 8, 2026' },
  { cat:'Psychology', title:'How to stop revenge trading after a loss — a practical framework', read:'5 min', date:'Oct 3, 2026' },
  { cat:'Gold', title:'Trading XAU/USD around NFP: a practical, no-nonsense guide', read:'7 min', date:'Sep 28, 2026' },
  { cat:'Crypto', title:'Why BTC/USD behaves differently from every other market', read:'8 min', date:'Sep 22, 2026' },
  { cat:'Systems', title:'Backtesting your first strategy without fooling yourself', read:'10 min', date:'Sep 15, 2026' },
];

const MILESTONES = [
  { n:'12,400+', l:'Trades logged monthly' },
  { n:'$48M+',   l:'Notional volume tracked' },
  { n:'3,200+',  l:'Active traders' },
  { n:'99.98%',  l:'Bot uptime' },
];

const PRICING = [
  { name:'Starter', price:'Free', period:'forever', desc:'For traders who want the core tools before committing a cent.',
    features:['Lot size calculator','Currency strength meter','Economic calendar','Pip value table','Community access','Mobile app access'],
    cta:'Start free', highlight:false },
  { name:'Trader', price:'$29', period:'/ month', desc:'For active retail traders running one or two bots on live accounts.',
    features:['Everything in Starter','2 active bots','Live signal alerts','Trade journal & analytics','Backtesting engine','Priority email support','Mobile push alerts'],
    cta:'Choose Trader', highlight:true },
  { name:'Pro', price:'$79', period:'/ month', desc:'For serious traders running a full portfolio of automated strategies.',
    features:['Everything in Trader','Unlimited bots','Strategy builder','VPS hosting included','1-on-1 coaching (1/mo)','Full API access','Priority chat support'],
    cta:'Go Pro', highlight:false },
];

const FAQS = [
  { q:'Is MyTradeApp a broker?', a:'No. MyTradeApp is a third-party analytics and automation layer built by Tonny. You keep your own broker account and we simply give you the tools — bots, calculators, strength data, journaling — to trade it better.' },
  { q:'Which instruments do the bots trade?', a:'Our production bots trade three instruments only: EUR/USD, BTC/USD and XAU/USD. Focusing on a small set lets us tune each strategy far more precisely than a generic multi-asset bot ever could.' },
  { q:'Do I need coding experience?', a:'None at all. Every bot is pre-built and configurable from the dashboard. If you can toggle a switch and type a risk percentage, you can run a bot in under five minutes.' },
  { q:'How is risk handled inside the bots?', a:'Every position is sized from your account balance and a defined stop-loss distance. The risk manager enforces a maximum daily loss and warns you before margin level becomes dangerous.' },
  { q:'Can I run bots and manual trades together?', a:'Yes. Manual positions and bot positions sit in the same book, and the dashboard aggregates P/L, margin and exposure across both in real time.' },
  { q:'Do I need a VPS to run bots?', a:'Not strictly, but we strongly recommend one. Bots need a stable connection — a London or New York VPS keeps latency under 2ms and prevents the platform from going offline mid-trade.' },
  { q:'Can I cancel my subscription anytime?', a:'Yes. There are no lock-in contracts. Cancel from your dashboard with one click and keep full access until the end of your current billing period.' },
  { q:'What is the minimum account size?', a:'You can run the tools on any account size, but we recommend at least $500 to trade the bots with sensible risk. Below that, the lot size calculator will return micro lots.' },
  { q:'How do you handle slippage and spread?', a:'Bots place limit orders where possible and use maximum-slippage caps. The journal logs the exact fill versus intended price so you can see real execution quality over time.' },
  { q:'Are the backtests realistic?', a:'Yes. The backtesting engine applies spread, commission and slippage models to historical tick data. Results you see in the lab are designed to be reproducible in the live market.' },
  { q:'Can I request a new bot or feature?', a:'Yes. Community members can vote on new strategies and features. When market regimes change, the roadmap reflects it — MyTradeApp is built around what traders actually need.' },
  { q:'What markets does the coaching cover?', a:'Coaching is tailored to you. Most sessions focus on EUR/USD, BTC/USD or XAU/USD — the three instruments the bots trade — but we can also cover general risk and psychology.' },
];

const QUOTES = [
  'Discipline beats prediction every single time.',
  'The market pays patience, not activity.',
  'Risk management is not optional — it is the entire game.',
  'Amateurs chase trades. Professionals size them.',
  'Your journal is worth more than any indicator.',
  'One good trade setup, repeated forever, beats ten random ones.',
  'Consistency compounds. Recklessness compounds faster.',
  'Trade small. Trade often. Trade the same way every day.',
];

const LIVE_ACTIVITY = [
  { t:'2m ago', u:'Daniel M.', a:'opened a long on EUR/USD', d:'0.25 lots' },
  { t:'6m ago', u:'Priya S.', a:'closed XAU/USD short', d:'+$142.30' },
  { t:'11m ago', u:'Kwame A.', a:'launched Pip Scalper', d:'EUR/USD M5' },
  { t:'18m ago', u:'Marco L.', a:'sized a trade with calculator', d:'1.2% risk' },
  { t:'24m ago', u:'Sarah K.', a:'backtested Momentum Rider', d:'2y data' },
  { t:'31m ago', u:'Yusuf B.', a:'opened a long on BTC/USD', d:'0.10 lots' },
];

/* ================================================================== */
/*  COMPONENT                                                          */
/* ================================================================== */

export default function ForexHome({
  pairs, positions = [], account, equityHistory = [], strength,
  onTrade, onClosePosition, onViewChange,
}) {
  const theme = useTheme();
  const c = theme?.colors || {};
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

  const [activeTab, setActiveTab] = useState('EURUSD');
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const ACC = c.accent || '#00d68f';
  const ACC_H = c.accentHover || '#3b82f6';
  const TEXT = c.text || '#e8eefb';
  const TEXT2 = c.textSecondary || '#7d90b0';
  const TEXT3 = c.textMuted || '#5a6b88';
  const BORDER = c.border || '#16223a';
  const SURF = c.surface || '#0d1524';
  const SURF_H = c.surfaceElevated || '#0f1829';

  return (
    <>
      <style>{`
        .tf-home{ display:flex; flex-direction:column; gap:26px; }
        .tf-card{ background:linear-gradient(180deg,${SURF_H},${SURF}); border:1px solid ${BORDER}; border-radius:16px; }
        .tf-sec-head{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:16px; }
        .tf-eyebrow{ display:inline-flex; align-items:center; gap:7px; font-size:10.5px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:${ACC}; margin-bottom:8px; }
        .tf-eyebrow::before{ content:''; width:18px; height:1px; background:${ACC}; opacity:.7; }
        .tf-sec-head h2{ font-size:23px; font-weight:800; letter-spacing:-.7px; color:${TEXT}; line-height:1.2; }
        .tf-sec-head p{ font-size:13px; color:${TEXT2}; margin-top:6px; max-width:600px; line-height:1.6; }
        .tf-sec-count{ font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:${TEXT3}; white-space:nowrap; }
        .tf-btn{ display:inline-flex; align-items:center; gap:8px; padding:12px 22px; border-radius:11px; border:none; font-size:13.5px; font-weight:700; letter-spacing:.2px; cursor:pointer; transition:.2s cubic-bezier(.16,1,.3,1); font-family:inherit; }
        .tf-btn-primary{ background:linear-gradient(135deg,${ACC},${ACC_H}); color:#04121c; box-shadow:0 10px 26px ${c.accentLight||'rgba(0,214,143,.28)'}; }
        .tf-btn-primary:hover{ transform:translateY(-2px); box-shadow:0 16px 34px ${c.accentLight||'rgba(0,214,143,.36)'}; }
        .tf-btn-ghost{ background:transparent; border:1px solid ${BORDER}; color:${TEXT}; }
        .tf-btn-ghost:hover{ border-color:${ACC}; color:${ACC}; transform:translateY(-2px); }
        .tf-pos{ color:${c.success||'#00d68f'}; }
        .tf-neg{ color:${c.danger||'#ff4d6a'}; }

        /* HERO */
        .tf-hero{ position:relative; overflow:hidden; padding:46px 38px; border-radius:22px; border:1px solid ${c.glassBorder||'rgba(255,255,255,.08)'};
          background:radial-gradient(ellipse at 0% 0%,${c.accentLight||'rgba(0,214,143,.18)'},transparent 55%),radial-gradient(ellipse at 100% 100%,rgba(59,130,246,.15),transparent 55%),linear-gradient(180deg,${SURF_H} 0%,${c.bg||'#0a121e'} 100%); }
        .tf-hero::before{ content:''; position:absolute; inset:0; pointer-events:none;
          background-image:linear-gradient(${TEXT}06 1px,transparent 1px),linear-gradient(90deg,${TEXT}06 1px,transparent 1px);
          background-size:46px 46px; mask-image:radial-gradient(ellipse at 30% 40%,black,transparent 78%); -webkit-mask-image:radial-gradient(ellipse at 30% 40%,black,transparent 78%); }
        .tf-hero-inner{ position:relative; z-index:1; display:grid; grid-template-columns:1.15fr .85fr; gap:40px; align-items:center; }
        .tf-badge{ display:inline-flex; align-items:center; gap:8px; padding:6px 13px; border-radius:20px; background:${c.accentLight||'rgba(0,214,143,.12)'}; border:1px solid ${c.accentMuted||'rgba(0,214,143,.28)'}; color:${ACC}; font-size:10.5px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; margin-bottom:18px; }
        .tf-badge .tf-dot-live{ width:6px; height:6px; border-radius:50%; background:${ACC}; animation:tfPulse 2s infinite; }
        @keyframes tfPulse{ 0%{box-shadow:0 0 0 0 ${c.accentMuted||'rgba(0,214,143,.75)'};} 70%{box-shadow:0 0 0 9px transparent;} 100%{box-shadow:0 0 0 0 transparent;} }
        .tf-hero h1{ font-size:48px; line-height:1.05; font-weight:800; letter-spacing:-2px; color:${TEXT}; margin-bottom:16px; max-width:680px; }
        .tf-hero h1 .tf-grad{ background:linear-gradient(100deg,${ACC} 0%,${ACC_H} 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .tf-hero-lead{ font-size:15.5px; line-height:1.65; color:${TEXT2}; max-width:580px; margin-bottom:26px; }
        .tf-hero-lead strong{ color:${TEXT}; font-weight:700; }
        .tf-hero-actions{ display:flex; flex-wrap:wrap; gap:12px; margin-bottom:30px; }
        .tf-hero-stats{ display:flex; flex-wrap:wrap; gap:26px 42px; padding-top:22px; border-top:1px solid ${c.border||'rgba(255,255,255,.07)'}; }
        .tf-hero-stat .n{ font-family:'JetBrains Mono',monospace; font-size:24px; font-weight:700; letter-spacing:-.8px; color:${TEXT}; line-height:1; }
        .tf-hero-stat .n span{ color:${ACC}; }
        .tf-hero-stat .l{ font-size:10.5px; font-weight:600; letter-spacing:.9px; text-transform:uppercase; color:${TEXT3}; margin-top:6px; }
        .tf-visual{ position:relative; }
        .tf-terminal{ border-radius:16px; overflow:hidden; border:1px solid ${c.border||'rgba(255,255,255,.1)'}; background:linear-gradient(180deg,${SURF_H},${c.surface||'#0b1320'}); box-shadow:0 26px 60px rgba(0,0,0,.45); }
        .tf-term-head{ display:flex; align-items:center; gap:6px; padding:11px 14px; border-bottom:1px solid ${c.border||'rgba(255,255,255,.07)'}; background:rgba(255,255,255,.02); }
        .tf-term-head .d{ width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.15); }
        .tf-term-head .d.a{ background:${c.danger||'#ff4d6a'}; opacity:.7; }
        .tf-term-head .d.b{ background:${c.warning||'#f5a524'}; opacity:.7; }
        .tf-term-head .d.c{ background:${c.success||'#00d68f'}; opacity:.7; }
        .tf-term-title{ margin-left:auto; font-size:9.5px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:${TEXT3}; }
        .tf-term-row{ display:flex; align-items:center; gap:12px; padding:13px 15px; border-bottom:1px solid ${c.border||'rgba(255,255,255,.05)'}; }
        .tf-term-row:last-of-type{ border-bottom:none; }
        .tf-term-sym{ font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; color:${TEXT}; min-width:74px; }
        .tf-term-tag{ font-size:9px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; padding:3px 7px; border-radius:5px; background:${c.accentLight||'rgba(0,214,143,.1)'}; color:${ACC}; }
        .tf-term-price{ margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; color:${TEXT}; }
        .tf-term-chg{ font-family:'JetBrains Mono',monospace; font-size:11.5px; font-weight:700; min-width:58px; text-align:right; }
        .tf-term-foot{ display:flex; align-items:center; justify-content:space-between; padding:12px 15px; background:${c.accentLight||'rgba(0,214,143,.05)'}; border-top:1px solid ${c.border||'rgba(255,255,255,.06)'}; }
        .tf-term-foot .k{ font-size:10px; letter-spacing:1px; text-transform:uppercase; color:${TEXT3}; font-weight:600; }
        .tf-term-foot .v{ font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:700; color:${TEXT}; }
        .tf-float{ position:absolute; z-index:2; padding:10px 14px; border-radius:12px; background:${SURF_H}; border:1px solid ${c.border||'rgba(255,255,255,.1)'}; box-shadow:0 16px 38px rgba(0,0,0,.5); backdrop-filter:blur(8px); }
        .tf-float .t{ font-size:9.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${TEXT3}; }
        .tf-float .v{ font-family:'JetBrains Mono',monospace; font-size:15px; font-weight:700; margin-top:3px; color:${TEXT}; }
        .tf-float-a{ top:-14px; right:-10px; animation:tfFloat 5s ease-in-out infinite; }
        .tf-float-b{ bottom:-16px; left:-14px; animation:tfFloat 6.5s ease-in-out infinite reverse; }
        @keyframes tfFloat{ 0%,100%{transform:translateY(0);} 50%{transform:translateY(-9px);} }

        /* QUOTE ROTATOR */
        .tf-quote-band{ padding:22px 26px; border-radius:14px; border:1px solid ${c.border||'#16223a'}; background:linear-gradient(180deg,${SURF_H},${SURF}); display:flex; align-items:center; gap:16px; }
        .tf-quote-mark{ font-family:Georgia,serif; font-size:42px; line-height:.6; color:${ACC}; opacity:.5; flex-shrink:0; }
        .tf-quote-text{ font-size:15px; font-weight:600; color:${TEXT}; letter-spacing:-.2px; line-height:1.4; flex:1; transition:opacity .4s; }

        /* MARQUEE */
        .tf-marquee{ overflow:hidden; position:relative; border-radius:13px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); mask-image:linear-gradient(90deg,transparent,black 7%,black 93%,transparent); -webkit-mask-image:linear-gradient(90deg,transparent,black 7%,black 93%,transparent); }
        .tf-marquee-track{ display:flex; width:max-content; animation:tfScroll 38s linear infinite; }
        .tf-marquee:hover .tf-marquee-track{ animation-play-state:paused; }
        @keyframes tfScroll{ from{transform:translateX(0);} to{transform:translateX(-50%);} }
        .tf-tick{ display:flex; align-items:center; gap:9px; padding:13px 22px; border-right:1px solid ${c.border||'rgba(255,255,255,.05)'}; white-space:nowrap; }
        .tf-tick .s{ font-family:'JetBrains Mono',monospace; font-size:11.5px; font-weight:700; color:${TEXT2}; }
        .tf-tick .p{ font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; color:${TEXT}; }
        .tf-tick .c{ font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; }

        /* MARKETS */
        .tf-markets{ display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
        .tf-market{ position:relative; overflow:hidden; padding:22px 20px; border-radius:16px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); transition:.24s cubic-bezier(.16,1,.3,1); }
        .tf-market::after{ content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--mk); opacity:.85; }
        .tf-market:hover{ transform:translateY(-4px); border-color:${c.accentMuted||'#243550'}; box-shadow:${c.shadowElevated||'0 18px 42px rgba(0,0,0,.4)'}; }
        .tf-market-top{ display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .tf-market-logo{ width:40px; height:40px; border-radius:11px; display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:800; color:var(--mk); background:color-mix(in srgb,var(--mk) 14%,transparent); border:1px solid color-mix(in srgb,var(--mk) 32%,transparent); }
        .tf-market-name{ font-size:15px; font-weight:800; letter-spacing:-.3px; color:${TEXT}; }
        .tf-market-sub{ font-size:11px; color:${TEXT3}; margin-top:2px; }
        .tf-market-tag{ margin-left:auto; font-size:9px; font-weight:700; letter-spacing:.9px; text-transform:uppercase; padding:4px 8px; border-radius:6px; color:var(--mk); background:color-mix(in srgb,var(--mk) 12%,transparent); }
        .tf-market-desc{ font-size:12.5px; line-height:1.6; color:${TEXT2}; margin-bottom:16px; min-height:60px; }
        .tf-market-meta{ display:grid; grid-template-columns:repeat(3,1fr); gap:8px; padding-top:14px; border-top:1px solid ${c.border||'rgba(255,255,255,.06)'}; }
        .tf-market-meta .k{ font-size:9.5px; font-weight:600; letter-spacing:.8px; text-transform:uppercase; color:${TEXT3}; }
        .tf-market-meta .v{ font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; margin-top:4px; color:${TEXT}; }
        .tf-market-live{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:15px; padding-top:13px; border-top:1px solid ${c.border||'rgba(255,255,255,.06)'}; }
        .tf-market-live .lp{ font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:700; color:${TEXT}; }

        /* BIO — the centerpiece */
        .tf-bio-section{ position:relative; padding:38px; border-radius:22px; overflow:hidden;
          border:1px solid ${BORDER};
          background:radial-gradient(ellipse at 0% 100%,${c.accentLight||'rgba(0,214,143,.12)'},transparent 55%),linear-gradient(180deg,${SURF_H},${SURF}); }
        .tf-bio-section::before{ content:''; position:absolute; top:0; right:0; width:340px; height:340px; border-radius:50%; background:radial-gradient(circle,${c.accentLight||'rgba(0,214,143,.18)'},transparent 70%); filter:blur(40px); pointer-events:none; }
        .tf-bio-grid{ position:relative; z-index:1; display:grid; grid-template-columns:.9fr 1.1fr; gap:44px; align-items:start; }
        .tf-bio-photo-wrap{ position:sticky; top:20px; }
        .tf-bio-photo{ position:relative; border-radius:20px; padding:5px; background:linear-gradient(140deg,${ACC},${ACC_H},transparent 75%); }
        .tf-bio-photo img{ display:block; width:100%; height:auto; aspect-ratio:4/4.8; object-fit:cover; border-radius:16px; background:${SURF}; }
        .tf-bio-chip{ position:absolute; left:50%; bottom:-16px; transform:translateX(-50%); display:flex; align-items:center; gap:8px; padding:10px 18px; border-radius:24px; white-space:nowrap; background:${SURF_H}; border:1px solid ${c.accentMuted||'rgba(0,214,143,.3)'}; box-shadow:0 14px 32px rgba(0,0,0,.5); }
        .tf-bio-chip .d{ width:7px; height:7px; border-radius:50%; background:${ACC}; box-shadow:0 0 10px ${ACC}; }
        .tf-bio-chip span{ font-size:11px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; color:${TEXT}; }
        .tf-bio h2{ font-size:32px; font-weight:800; letter-spacing:-1.2px; color:${TEXT}; margin-bottom:6px; }
        .tf-bio .role{ font-size:12px; font-weight:700; letter-spacing:1.1px; text-transform:uppercase; color:${ACC}; margin-bottom:20px; }
        .tf-bio p{ font-size:14px; line-height:1.85; color:${TEXT2}; margin-bottom:15px; }
        .tf-bio p strong{ color:${TEXT}; font-weight:700; }
        .tf-bio-signature{ font-family:Georgia,serif; font-size:22px; font-style:italic; color:${ACC}; margin-top:8px; margin-bottom:24px; }
        .tf-bio-facts{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:8px; padding-top:24px; border-top:1px solid ${c.border||'rgba(255,255,255,.07)'}; }
        .tf-bio-fact .n{ font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700; letter-spacing:-.5px; color:${ACC}; line-height:1; }
        .tf-bio-fact .l{ font-size:9.5px; font-weight:600; letter-spacing:.8px; text-transform:uppercase; color:${TEXT3}; margin-top:6px; }
        .tf-philo{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-top:26px; }
        .tf-philo-card{ padding:18px; border-radius:13px; border:1px solid ${BORDER}; background:rgba(0,0,0,.18); }
        .tf-philo-card .ic{ font-size:16px; color:${ACC}; margin-bottom:9px; display:block; }
        .tf-philo-card h5{ font-size:13px; font-weight:700; color:${TEXT}; margin-bottom:6px; letter-spacing:-.2px; }
        .tf-philo-card p{ font-size:12px; line-height:1.6; color:${TEXT2}; margin:0; }
        .tf-timeline{ margin-top:32px; padding-top:26px; border-top:1px solid ${c.border||'rgba(255,255,255,.07)'}; }
        .tf-timeline h4{ font-size:15px; font-weight:700; color:${TEXT}; margin-bottom:20px; letter-spacing:-.3px; }
        .tf-tl{ position:relative; padding-left:28px; }
        .tf-tl::before{ content:''; position:absolute; left:7px; top:6px; bottom:6px; width:1px; background:${c.border||'rgba(255,255,255,.1)'}; }
        .tf-tl-item{ position:relative; padding-bottom:22px; }
        .tf-tl-item:last-child{ padding-bottom:0; }
        .tf-tl-item::before{ content:''; position:absolute; left:-27px; top:5px; width:11px; height:11px; border-radius:50%; background:${SURF_H}; border:2px solid ${ACC}; box-shadow:0 0 0 4px ${c.accentLight||'rgba(0,214,143,.12)'}; }
        .tf-tl-item .y{ font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; letter-spacing:.8px; color:${ACC}; }
        .tf-tl-item h6{ font-size:13.5px; font-weight:700; color:${TEXT}; margin:3px 0 5px; }
        .tf-tl-item p{ font-size:12.5px; line-height:1.65; color:${TEXT2}; margin:0; }

        /* SERVICES */
        .tf-services{ display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
        .tf-service{ position:relative; overflow:hidden; padding:22px 20px 19px; border-radius:15px; cursor:pointer; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); transition:.24s cubic-bezier(.16,1,.3,1); }
        .tf-service::before{ content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,${ACC},transparent); opacity:0; transition:opacity .25s; }
        .tf-service:hover{ transform:translateY(-4px); border-color:${c.accentMuted||'#243550'}; box-shadow:${c.shadowElevated||'0 18px 42px rgba(0,0,0,.4)'}; }
        .tf-service:hover::before{ opacity:1; }
        .tf-service-icon{ width:42px; height:42px; border-radius:12px; display:grid; place-items:center; margin-bottom:15px; background:linear-gradient(135deg,${c.accentLight||'rgba(0,214,143,.16)'},rgba(59,130,246,.12)); border:1px solid ${c.accentMuted||'rgba(0,214,143,.22)'}; color:${ACC}; }
        .tf-service-icon svg{ width:19px; height:19px; }
        .tf-service h3{ font-size:14.5px; font-weight:700; letter-spacing:-.25px; color:${TEXT}; margin-bottom:8px; }
        .tf-service p{ font-size:12.5px; line-height:1.6; color:${TEXT2}; margin-bottom:15px; min-height:62px; }
        .tf-service-cta{ display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:${ACC}; }
        .tf-service-cta::after{ content:'→'; transition:transform .2s; }
        .tf-service:hover .tf-service-cta::after{ transform:translateX(4px); }

        /* BOTS */
        .tf-bots{ display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
        .tf-bot{ padding:22px 20px; border-radius:16px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); transition:.24s cubic-bezier(.16,1,.3,1); }
        .tf-bot:hover{ transform:translateY(-4px); border-color:${c.accentMuted||'#243550'}; box-shadow:${c.shadowElevated||'0 18px 42px rgba(0,0,0,.4)'}; }
        .tf-bot-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:16px; }
        .tf-bot-name{ font-size:14.5px; font-weight:800; letter-spacing:-.3px; color:${TEXT}; }
        .tf-bot-market{ font-size:10.5px; font-weight:600; color:${TEXT3}; margin-top:3px; }
        .tf-bot-pill{ font-size:9px; font-weight:700; letter-spacing:.9px; text-transform:uppercase; padding:4px 9px; border-radius:6px; background:${c.accentLight||'rgba(0,214,143,.12)'}; color:${ACC}; border:1px solid ${c.accentMuted||'rgba(0,214,143,.22)'}; }
        .tf-bot-pill.live::before{ content:'●'; margin-right:5px; color:${c.success||'#00d68f'}; }
        .tf-bot-stats{ display:grid; grid-template-columns:repeat(2,1fr); gap:11px; margin-bottom:16px; }
        .tf-bot-stat{ padding:10px 12px; border-radius:10px; background:rgba(0,0,0,.18); border:1px solid ${c.border||'rgba(255,255,255,.05)'}; }
        .tf-bot-stat .k{ font-size:9px; font-weight:600; letter-spacing:.8px; text-transform:uppercase; color:${TEXT3}; }
        .tf-bot-stat .v{ font-family:'JetBrains Mono',monospace; font-size:15px; font-weight:700; margin-top:5px; color:${TEXT}; }
        .tf-bot-bar{ height:5px; border-radius:4px; overflow:hidden; background:${c.border||'rgba(255,255,255,.07)'}; margin-bottom:8px; }
        .tf-bot-bar i{ display:block; height:100%; border-radius:4px; background:linear-gradient(90deg,${ACC},${ACC_H}); }
        .tf-bot-bar-label{ display:flex; justify-content:space-between; font-size:10px; font-weight:600; color:${TEXT3}; text-transform:uppercase; letter-spacing:.6px; margin-bottom:16px; }
        .tf-bot-btn{ width:100%; padding:10px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; background:${c.accentLight||'rgba(0,214,143,.1)'}; border:1px solid ${c.accentMuted||'rgba(0,214,143,.28)'}; color:${ACC}; transition:.2s; }
        .tf-bot-btn:hover{ background:${ACC}; color:#04121c; }

        /* TOOLS */
        .tf-tools{ display:grid; grid-template-columns:1fr 1fr; gap:15px; }
        .tf-tool{ padding:24px 22px; }
        .tf-calc-grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; }
        .tf-field label{ display:block; font-size:10px; font-weight:700; letter-spacing:.9px; text-transform:uppercase; color:${TEXT3}; margin-bottom:7px; }
        .tf-field input{ width:100%; box-sizing:border-box; padding:11px 13px; border-radius:10px; font-family:'JetBrains Mono',monospace; font-size:13.5px; font-weight:700; color:${TEXT}; background:rgba(0,0,0,.22); border:1px solid ${c.border||'rgba(255,255,255,.09)'}; outline:none; transition:.2s; }
        .tf-field input:focus{ border-color:${ACC}; box-shadow:0 0 0 3px ${c.accentLight||'rgba(0,214,143,.14)'}; }
        .tf-calc-out{ display:flex; align-items:center; justify-content:space-between; gap:14px; padding:16px 18px; border-radius:12px; background:linear-gradient(135deg,${c.accentLight||'rgba(0,214,143,.12)'},transparent); border:1px solid ${c.accentMuted||'rgba(0,214,143,.26)'}; margin-bottom:14px; }
        .tf-calc-out .k{ font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${TEXT3}; }
        .tf-calc-out .v{ font-family:'JetBrains Mono',monospace; font-size:26px; font-weight:800; letter-spacing:-1px; color:${ACC}; line-height:1; }
        .tf-calc-out .s{ font-size:11px; color:${TEXT2}; margin-top:5px; }
        .tf-st-row{ display:flex; align-items:center; gap:12px; padding:8px 0; }
        .tf-st-cur{ font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; letter-spacing:.6px; color:${TEXT}; width:36px; }
        .tf-st-track{ position:relative; flex:1; height:7px; border-radius:5px; background:${c.border||'rgba(255,255,255,.06)'}; }
        .tf-st-mid{ position:absolute; left:50%; top:-3px; bottom:-3px; width:1px; background:rgba(255,255,255,.18); }
        .tf-st-bar{ position:absolute; top:0; bottom:0; border-radius:5px; }
        .tf-st-bar.pos{ background:linear-gradient(90deg,${c.success||'#00d68f'},${ACC_H}); }
        .tf-st-bar.neg{ background:linear-gradient(270deg,${c.danger||'#ff4d6a'},${c.warning||'#f5a524'}); }
        .tf-st-val{ font-family:'JetBrains Mono',monospace; font-size:11.5px; font-weight:700; min-width:52px; text-align:right; }

        /* STEPS */
        .tf-steps{ display:grid; grid-template-columns:repeat(4,1fr); gap:15px; }
        .tf-step{ padding:22px 20px; border-radius:15px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); }
        .tf-step .n{ font-family:'JetBrains Mono',monospace; font-size:30px; font-weight:800; letter-spacing:-1.6px; line-height:1; background:linear-gradient(135deg,${ACC},${ACC_H}); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:14px; display:block; }
        .tf-step h4{ font-size:13.5px; font-weight:700; letter-spacing:-.2px; color:${TEXT}; margin-bottom:8px; }
        .tf-step p{ font-size:12.5px; line-height:1.6; color:${TEXT2}; }

        /* BASICS */
        .tf-basics{ display:grid; grid-template-columns:repeat(2,1fr); gap:13px; }
        .tf-basic{ padding:18px 20px; border-radius:14px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); transition:.22s; }
        .tf-basic:hover{ border-color:${c.accentMuted||'#243550'}; }
        .tf-basic h4{ font-size:13.5px; font-weight:700; color:${TEXT}; margin-bottom:7px; letter-spacing:-.2px; }
        .tf-basic p{ font-size:12.5px; line-height:1.65; color:${TEXT2}; margin:0; }

        /* SESSIONS */
        .tf-sessions{ display:grid; grid-template-columns:repeat(4,1fr); gap:13px; }
        .tf-session{ padding:20px; border-radius:14px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); position:relative; overflow:hidden; }
        .tf-session::before{ content:''; position:absolute; top:0; left:0; bottom:0; width:3px; background:var(--sc); }
        .tf-session .nm{ font-size:14px; font-weight:800; color:${TEXT}; margin-bottom:6px; }
        .tf-session .hr{ font-family:'JetBrains Mono',monospace; font-size:11.5px; font-weight:700; color:var(--sc); margin-bottom:10px; }
        .tf-session .nt{ font-size:11.5px; line-height:1.5; color:${TEXT2}; }

        /* PIP TABLE */
        .tf-tbl-wrap{ border-radius:14px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); overflow:hidden; }
        .tf-tbl{ width:100%; border-collapse:collapse; }
        .tf-tbl th{ text-align:left; padding:13px 18px; font-size:10.5px; font-weight:700; letter-spacing:.9px; text-transform:uppercase; color:${TEXT3}; background:rgba(0,0,0,.18); border-bottom:1px solid ${BORDER}; }
        .tf-tbl th.r, .tf-tbl td.r{ text-align:right; }
        .tf-tbl td{ padding:13px 18px; font-size:13px; color:${TEXT2}; border-bottom:1px solid ${c.border||'rgba(255,255,255,.04)'}; }
        .tf-tbl tr:last-child td{ border-bottom:none; }
        .tf-tbl td.num{ font-family:'JetBrains Mono',monospace; font-size:12.5px; font-weight:700; color:${TEXT}; }
        .tf-tbl tr:hover td{ background:${c.accentLight||'rgba(0,214,143,.03)'}; }

        /* STRATEGIES */
        .tf-strats{ display:grid; grid-template-columns:repeat(2,1fr); gap:13px; }
        .tf-strat{ padding:20px; border-radius:14px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); transition:.22s; }
        .tf-strat:hover{ border-color:${c.accentMuted||'#243550'}; transform:translateY(-3px); }
        .tf-strat-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }
        .tf-strat h4{ font-size:13.5px; font-weight:800; color:${TEXT}; letter-spacing:-.2px; }
        .tf-strat .meta{ font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; color:${ACC}; padding:3px 7px; border-radius:5px; background:${c.accentLight||'rgba(0,214,143,.1)'}; }
        .tf-strat p{ font-size:12.5px; line-height:1.65; color:${TEXT2}; margin:0; }

        /* EVENTS */
        .tf-events{ border-radius:14px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); overflow:hidden; }
        .tf-event{ display:grid; grid-template-columns:70px 70px 1fr 100px 160px; gap:14px; align-items:center; padding:14px 18px; border-bottom:1px solid ${c.border||'rgba(255,255,255,.05)'}; }
        .tf-event:last-child{ border-bottom:none; }
        .tf-event .d{ font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; letter-spacing:.8px; color:${ACC}; }
        .tf-event .t{ font-family:'JetBrains Mono',monospace; font-size:11.5px; font-weight:700; color:${TEXT2}; }
        .tf-event .e{ font-size:12.5px; font-weight:600; color:${TEXT}; }
        .tf-event .imp{ font-size:9.5px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; padding:4px 8px; border-radius:6px; text-align:center; }
        .tf-event .imp.vh{ background:rgba(255,77,106,.12); color:${c.danger||'#ff4d6a'}; }
        .tf-event .imp.h{ background:rgba(245,165,36,.12); color:${c.warning||'#f5a524'}; }
        .tf-event .imp.m{ background:rgba(59,130,246,.12); color:#3b82f6; }
        .tf-event .af{ font-size:11px; color:${TEXT3}; }

        /* GLOSSARY */
        .tf-gloss{ display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
        .tf-term{ display:flex; gap:14px; align-items:flex-start; padding:14px 16px; border-radius:12px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); }
        .tf-term .k{ font-family:'JetBrains Mono',monospace; font-size:11.5px; font-weight:700; color:${ACC}; min-width:90px; padding-top:2px; }
        .tf-term .v{ font-size:12.5px; line-height:1.6; color:${TEXT2}; }

        /* MILESTONES */
        .tf-miles{ display:grid; grid-template-columns:repeat(4,1fr); gap:13px; }
        .tf-mile{ padding:24px 20px; border-radius:14px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); text-align:center; }
        .tf-mile .n{ font-family:'JetBrains Mono',monospace; font-size:26px; font-weight:800; letter-spacing:-1px; background:linear-gradient(135deg,${ACC},${ACC_H}); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; line-height:1; margin-bottom:8px; }
        .tf-mile .l{ font-size:10.5px; font-weight:600; letter-spacing:.9px; text-transform:uppercase; color:${TEXT3}; }

        /* LIVE ACTIVITY */
        .tf-activity{ border-radius:14px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); overflow:hidden; }
        .tf-act{ display:flex; align-items:center; gap:14px; padding:13px 18px; border-bottom:1px solid ${c.border||'rgba(255,255,255,.05)'}; }
        .tf-act:last-child{ border-bottom:none; }
        .tf-act-dot{ width:7px; height:7px; border-radius:50%; background:${ACC}; flex-shrink:0; box-shadow:0 0 8px ${ACC}; animation:tfPulse 2s infinite; }
        .tf-act-u{ font-size:12.5px; font-weight:700; color:${TEXT}; min-width:90px; }
        .tf-act-a{ font-size:12px; color:${TEXT2}; flex:1; }
        .tf-act-d{ font-family:'JetBrains Mono',monospace; font-size:11.5px; font-weight:700; color:${ACC}; }
        .tf-act-t{ font-size:10.5px; color:${TEXT3}; min-width:60px; text-align:right; }

        /* PRICING */
        .tf-pricing{ display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
        .tf-plan{ position:relative; padding:28px 24px 24px; border-radius:16px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); transition:.24s; }
        .tf-plan.highlight{ border-color:${ACC}; background:radial-gradient(ellipse at 50% 0%,${c.accentLight||'rgba(0,214,143,.14)'},transparent 60%),linear-gradient(180deg,${SURF_H},${SURF}); box-shadow:0 22px 52px ${c.accentLight||'rgba(0,214,143,.15)'}; }
        .tf-plan .pop{ position:absolute; top:-11px; left:50%; transform:translateX(-50%); padding:5px 14px; border-radius:20px; background:linear-gradient(135deg,${ACC},${ACC_H}); color:#04121c; font-size:9.5px; font-weight:800; letter-spacing:1px; text-transform:uppercase; }
        .tf-plan h4{ font-size:14px; font-weight:800; letter-spacing:.5px; text-transform:uppercase; color:${ACC}; margin-bottom:12px; }
        .tf-plan .price{ display:flex; align-items:baseline; gap:6px; margin-bottom:14px; }
        .tf-plan .price .a{ font-family:'JetBrains Mono',monospace; font-size:34px; font-weight:800; letter-spacing:-1.5px; color:${TEXT}; line-height:1; }
        .tf-plan .price .p{ font-size:12px; color:${TEXT3}; font-weight:600; }
        .tf-plan .desc{ font-size:12.5px; line-height:1.6; color:${TEXT2}; margin-bottom:18px; min-height:38px; }
        .tf-plan ul{ list-style:none; padding:0; margin:0 0 20px; display:flex; flex-direction:column; gap:9px; }
        .tf-plan li{ display:flex; align-items:flex-start; gap:9px; font-size:12.5px; line-height:1.5; color:${TEXT2}; }
        .tf-plan li::before{ content:'✓'; color:${ACC}; font-weight:800; font-size:12px; flex-shrink:0; margin-top:1px; }
        .tf-plan .tf-btn{ width:100%; justify-content:center; }

        /* TESTIMONIALS */
        .tf-testi{ display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
        .tf-quote-card{ padding:22px 20px; border-radius:15px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); }
        .tf-quote-card .mark{ font-family:Georgia,serif; font-size:38px; line-height:.6; color:${c.accentMuted||'rgba(0,214,143,.35)'}; margin-bottom:12px; display:block; }
        .tf-quote-card p{ font-size:13px; line-height:1.7; color:${TEXT2}; margin-bottom:16px; }
        .tf-quote-card .who{ display:flex; align-items:center; gap:10px; padding-top:14px; border-top:1px solid ${c.border||'rgba(255,255,255,.06)'}; }
        .tf-quote-card .av{ width:32px; height:32px; border-radius:50%; display:grid; place-items:center; font-size:12px; font-weight:800; color:${ACC}; background:${c.accentLight||'rgba(0,214,143,.12)'}; border:1px solid ${c.accentMuted||'rgba(0,214,143,.25)'}; }
        .tf-quote-card .nm{ font-size:12.5px; font-weight:700; color:${TEXT}; }
        .tf-quote-card .rl{ font-size:10.5px; color:${TEXT3}; margin-top:2px; }

        /* ARTICLES */
        .tf-articles{ display:grid; grid-template-columns:repeat(3,1fr); gap:13px; }
        .tf-article{ padding:20px 18px; border-radius:14px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); cursor:pointer; transition:.22s; }
        .tf-article:hover{ border-color:${c.accentMuted||'#243550'}; transform:translateY(-3px); }
        .tf-article .cat{ font-size:9.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${ACC}; margin-bottom:10px; }
        .tf-article h5{ font-size:13px; font-weight:700; color:${TEXT}; line-height:1.4; margin-bottom:12px; min-height:36px; }
        .tf-article .meta{ display:flex; justify-content:space-between; font-size:10.5px; color:${TEXT3}; }

        /* NEWSLETTER */
        .tf-news{ padding:34px 30px; border-radius:16px; border:1px solid ${c.accentMuted||'rgba(0,214,143,.25)'}; background:radial-gradient(ellipse at 100% 0%,${c.accentLight||'rgba(0,214,143,.14)'},transparent 60%),linear-gradient(180deg,${SURF_H},${SURF}); display:grid; grid-template-columns:1.2fr 1fr; gap:30px; align-items:center; }
        .tf-news h3{ font-size:19px; font-weight:800; letter-spacing:-.5px; color:${TEXT}; margin-bottom:8px; }
        .tf-news p{ font-size:12.5px; line-height:1.6; color:${TEXT2}; margin:0; }
        .tf-news-form{ display:flex; gap:10px; flex-wrap:wrap; }
        .tf-news-form input{ flex:1 1 220px; box-sizing:border-box; padding:12px 14px; border-radius:10px; font-family:inherit; font-size:13px; color:${TEXT}; background:rgba(0,0,0,.22); border:1px solid ${c.border||'rgba(255,255,255,.09)'}; outline:none; }
        .tf-news-form input:focus{ border-color:${ACC}; }

        /* FAQ */
        .tf-faq{ display:grid; grid-template-columns:1fr 1fr; gap:9px; }
        .tf-faq details{ border-radius:12px; border:1px solid ${BORDER}; background:linear-gradient(180deg,${SURF_H},${SURF}); overflow:hidden; }
        .tf-faq summary{ list-style:none; cursor:pointer; padding:16px 18px; display:flex; align-items:center; gap:12px; font-size:13px; font-weight:700; color:${TEXT}; transition:.2s; }
        .tf-faq summary::-webkit-details-marker{ display:none; }
        .tf-faq summary::after{ content:'+'; margin-left:auto; font-size:18px; font-weight:400; color:${ACC}; transition:transform .22s; }
        .tf-faq details[open] summary::after{ transform:rotate(45deg); }
        .tf-faq summary:hover{ color:${ACC}; }
        .tf-faq details p{ padding:0 18px 17px; font-size:12.5px; line-height:1.7; color:${TEXT2}; }

        /* CTA */
        .tf-cta{ position:relative; overflow:hidden; padding:46px 36px; border-radius:22px; text-align:center; border:1px solid ${c.accentMuted||'rgba(0,214,143,.25)'}; background:radial-gradient(ellipse at 50% 0%,${c.accentLight||'rgba(0,214,143,.16)'},transparent 62%),linear-gradient(180deg,${SURF_H},${c.bg||'#0a121e'}); }
        .tf-cta h2{ font-size:30px; font-weight:800; letter-spacing:-1.1px; color:${TEXT}; margin-bottom:10px; }
        .tf-cta p{ font-size:14px; line-height:1.65; color:${TEXT2}; max-width:560px; margin:0 auto 24px; }
        .tf-cta .row{ display:flex; justify-content:center; flex-wrap:wrap; gap:12px; }

        /* NOTICE */
        .tf-notice{ display:flex; align-items:flex-start; gap:11px; padding:15px 17px; border-radius:12px; background:${c.warningLight||'rgba(245,165,36,.07)'}; border:1px solid ${c.warningMuted||'rgba(245,165,36,.22)'}; }
        .tf-notice svg{ width:17px; height:17px; flex-shrink:0; margin-top:1px; fill:none; stroke:${c.warning||'#f5a524'}; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
        .tf-notice span{ font-size:12px; line-height:1.6; color:${TEXT2}; }

        /* RESPONSIVE */
        @media (max-width:1180px){
          .tf-hero{ padding:36px 28px; }
          .tf-hero h1{ font-size:38px; letter-spacing:-1.4px; }
          .tf-hero-inner{ grid-template-columns:1fr .9fr; gap:28px; }
          .tf-services{ grid-template-columns:repeat(2,1fr); }
          .tf-bots{ grid-template-columns:repeat(2,1fr); }
          .tf-steps{ grid-template-columns:repeat(2,1fr); }
          .tf-testi{ grid-template-columns:repeat(2,1fr); }
          .tf-articles{ grid-template-columns:repeat(2,1fr); }
          .tf-sessions{ grid-template-columns:repeat(2,1fr); }
          .tf-pricing{ grid-template-columns:1fr; }
          .tf-faq{ grid-template-columns:1fr; }
        }
        @media (max-width:980px){
          .tf-hero-inner{ grid-template-columns:1fr; gap:34px; }
          .tf-hero h1{ font-size:36px; max-width:100%; }
          .tf-visual{ max-width:520px; }
          .tf-float-a{ right:6px; } .tf-float-b{ left:6px; }
          .tf-bio-grid{ grid-template-columns:1fr; gap:44px; }
          .tf-bio-photo-wrap{ position:static; }
          .tf-bio-photo{ max-width:360px; margin:0 auto; }
          .tf-tools{ grid-template-columns:1fr; }
          .tf-markets{ grid-template-columns:1fr; }
          .tf-market-desc{ min-height:0; }
          .tf-news{ grid-template-columns:1fr; gap:20px; padding:26px 24px; }
          .tf-miles{ grid-template-columns:repeat(2,1fr); }
          .tf-event{ grid-template-columns:60px 60px 1fr 90px; }
          .tf-event .af{ display:none; }
        }
        @media (max-width:760px){
          .tf-home{ gap:20px; }
          .tf-hero{ padding:26px 18px; border-radius:18px; }
          .tf-hero h1{ font-size:29px; letter-spacing:-1px; line-height:1.15; }
          .tf-hero-lead{ font-size:13.5px; margin-bottom:22px; }
          .tf-hero-actions{ gap:10px; margin-bottom:24px; }
          .tf-btn{ flex:1 1 100%; justify-content:center; padding:12px 18px; }
          .tf-hero-stats{ gap:18px 26px; padding-top:18px; }
          .tf-hero-stat .n{ font-size:19px; }
          .tf-float{ display:none; }
          .tf-sec-head h2{ font-size:19px; }
          .tf-sec-head p{ font-size:12.5px; }
          .tf-quote-band{ padding:18px 20px; }
          .tf-quote-text{ font-size:13.5px; }
          .tf-quote-mark{ font-size:32px; }
          .tf-services{ grid-template-columns:1fr; gap:11px; }
          .tf-service{ padding:17px 16px; } .tf-service p{ min-height:0; }
          .tf-bots{ grid-template-columns:1fr; gap:11px; } .tf-bot{ padding:18px 16px; }
          .tf-steps{ grid-template-columns:1fr; gap:11px; } .tf-step{ padding:18px 16px; }
          .tf-testi{ grid-template-columns:1fr; gap:11px; } .tf-quote-card{ padding:18px 16px; }
          .tf-markets{ gap:11px; } .tf-market{ padding:18px 16px; }
          .tf-calc-grid{ grid-template-columns:1fr; }
          .tf-calc-out .v{ font-size:21px; }
          .tf-tool{ padding:19px 17px; }
          .tf-bio-section{ padding:24px 18px; }
          .tf-bio h2{ font-size:24px; }
          .tf-bio p{ font-size:13px; }
          .tf-bio-facts{ grid-template-columns:1fr 1fr; gap:14px; }
          .tf-philo{ grid-template-columns:1fr; }
          .tf-basics{ grid-template-columns:1fr; gap:10px; }
          .tf-sessions{ grid-template-columns:1fr; gap:10px; }
          .tf-strats{ grid-template-columns:1fr; gap:10px; }
          .tf-gloss{ grid-template-columns:1fr; gap:9px; }
          .tf-miles{ grid-template-columns:1fr 1fr; gap:10px; }
          .tf-articles{ grid-template-columns:1fr; gap:10px; }
          .tf-event{ grid-template-columns:55px 55px 1fr; gap:10px; padding:12px 14px; }
          .tf-event .imp{ display:none; }
          .tf-tbl th, .tf-tbl td{ padding:11px 12px; font-size:12px; }
          .tf-news{ padding:22px 18px; } .tf-news h3{ font-size:17px; }
          .tf-news-form input{ flex:1 1 100%; }
          .tf-cta{ padding:28px 20px; border-radius:16px; } .tf-cta h2{ font-size:21px; }
          .tf-cta .row .tf-btn{ flex:1 1 100%; }
          .tf-faq summary{ font-size:12.5px; padding:14px 15px; }
          .tf-faq details p{ padding:0 15px 15px; font-size:12px; }
          .tf-tick{ padding:11px 16px; }
          .tf-term-row{ padding:11px 12px; gap:8px; }
          .tf-term-sym{ min-width:64px; font-size:11px; }
          .tf-act{ padding:11px 14px; gap:10px; } .tf-act-u{ min-width:70px; font-size:12px; }
          .tf-act-a{ font-size:11.5px; } .tf-act-t{ display:none; }
        }
        @media (max-width:420px){
          .tf-hero h1{ font-size:25px; }
          .tf-hero-stat .n{ font-size:17px; }
          .tf-bio-facts{ grid-template-columns:1fr; }
          .tf-miles{ grid-template-columns:1fr; }
        }
      `}</style>

      <section className="view active tf-home">

        {/* ============ HERO ============ */}
        <div className="tf-hero">
          <div className="tf-hero-inner">
            <div>
              <div className="tf-badge"><span className="tf-dot-live" /> MyTradeApp · Built by Tonnyfx</div>
              <h1>Master Forex Trading With <span className="tf-grad">Tonnyfx</span></h1>
              <p className="tf-hero-lead">
                Welcome to <strong>MyTradeApp</strong> — the third-party terminal I built for the way
                I actually trade. Precision bots, institutional-grade risk tools and live market
                intelligence, focused on three instruments: <strong>EUR/USD</strong>,{' '}
                <strong>BTC/USD</strong> and <strong>XAU/USD</strong>.
              </p>
              <div className="tf-hero-actions">
                <button className="tf-btn tf-btn-primary" onClick={() => go('bots')}>
                  Launch a Trading Bot
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
                <button className="tf-btn tf-btn-ghost" onClick={() => go('lot')}>Open Lot Size Calculator</button>
              </div>
              <div className="tf-hero-stats">
                <div className="tf-hero-stat"><div className="n">3<span>+</span></div><div className="l">Core instruments</div></div>
                <div className="tf-hero-stat"><div className="n">6<span>+</span></div><div className="l">Live bots</div></div>
                <div className="tf-hero-stat"><div className="n">13<span>+</span></div><div className="l">Trading tools</div></div>
                <div className="tf-hero-stat"><div className="n">24<span>/7</span></div><div className="l">Market coverage</div></div>
              </div>
            </div>
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
                      <span className="tf-term-price">{price ? fmtPrice(m.sym, price) : '—'}</span>
                      <span className={`tf-term-chg ${up ? 'tf-pos' : 'tf-neg'}`}>{up ? '+' : ''}{fmt(chg, 2)}%</span>
                    </div>
                  );
                })}
                <div className="tf-term-foot">
                  <span className="k">Session Equity</span>
                  <span className="v">{fmtMoney(account?.balance ?? 0)}</span>
                </div>
              </div>
              <div className="tf-float tf-float-a"><div className="t">Win Rate</div><div className="v tf-pos">68.4%</div></div>
              <div className="tf-float tf-float-b"><div className="t">Risk / Trade</div><div className="v">1.0%</div></div>
            </div>
          </div>
        </div>

        {/* ============ QUOTE ROTATOR ============ */}
        <div className="tf-quote-band">
          <div className="tf-quote-mark">“</div>
          <div className="tf-quote-text">{QUOTES[quoteIdx]}</div>
        </div>

        {/* ============ TICKER ============ */}
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
                    <span className={`c ${up ? 'tf-pos' : 'tf-neg'}`}>{up ? '▲' : '▼'} {fmt(Math.abs(chg), 2)}%</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ============ MARKETS ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Markets I trade</div>
              <h2>Three instruments. Total mastery.</h2>
              <p>I deliberately trade a tiny universe so every bot, every calculator and every risk rule is tuned to the exact behaviour of that market.</p>
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
                <div className="tf-market" key={m.sym} style={{ '--mk': m.accent }}>
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
                    <div><div className="k">Margin</div><div className="v">{m.margin}</div></div>
                  </div>
                  <div className="tf-market-live">
                    <div>
                      <div className="lp">{price ? fmtPrice(m.sym, price) : '—'}</div>
                      <div className={`tf-term-chg ${up ? 'tf-pos' : 'tf-neg'}`} style={{ textAlign: 'left', marginTop: 3 }}>
                        {up ? '+' : ''}{fmt(chg, 2)}% today
                      </div>
                    </div>
                    {hist.length > 1 && <Sparkline values={hist} w={92} h={30} color={up ? (c.success || '#00d68f') : (c.danger || '#ff4d6a')} />}
                    <button className="tf-btn tf-btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => onTrade && onTrade(m.sym)}>Trade</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ SERVICES WE PROVIDE ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Services we provide</div>
              <h2>Everything a retail trader actually needs</h2>
              <p>MyTradeApp is not a broker. It is the third-party layer that sits on top of your account — automation, sizing, strength data, education and risk control.</p>
            </div>
            <span className="tf-sec-count">{SERVICES.length} services</span>
          </div>
          <div className="tf-services">
            {SERVICES.map((s) => (
              <div className="tf-service" key={s.key} onClick={() => go(s.key)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') go(s.key); }}>
                <div className="tf-service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="tf-service-cta">{s.cta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ============ BIO — THE CENTERPIECE ============ */}
        <div className="tf-bio-section">
          <div className="tf-bio-grid">
            <div className="tf-bio-photo-wrap">
              <div className="tf-bio-photo">
                <img src={tonnyPhoto} alt="Tonny — founder of MyTradeApp" loading="lazy" />
                <div className="tf-bio-chip"><span className="d" /><span>Tonny · Founder</span></div>
              </div>
            </div>
            <div className="tf-bio">
              <div className="tf-eyebrow">About me</div>
              <h2>Hi, I'm Tonny.</h2>
              <div className="role">Trader · System Builder · Creator of MyTradeApp</div>

              <p>
                I've spent the last decade in front of charts — first losing money like most retail
                traders, then slowly building the discipline and systems that turned it around. My
                first live account had <strong>$500 in it and I blew it in three months.</strong> That
                loss taught me more than any course or signal group ever could.
              </p>
              <p>
                Along the way I learned one thing that changed everything:{' '}
                <strong>most people don't fail because they picked the wrong direction.</strong>{' '}
                They fail because they sized the trade wrong, risked too much, and had no rules.
                Direction is the easy part. Risk is where accounts die.
              </p>
              <p>
                <strong>MyTradeApp</strong> is the toolset I wish I'd had at the start. I built it as a
                third-party layer that sits on top of any broker account — automation for EUR/USD,
                BTC/USD and XAU/USD, a proper lot size calculator, a currency strength meter, and a
                risk manager that stops you before you stop yourself.
              </p>
              <p>
                I still trade every single day. I run these bots on my own accounts. The performance
                numbers you see here are the same ones I watch — no marketing polish, no
                cherry-picked screenshots. Just a clean terminal for traders who want to take the
                craft seriously.
              </p>

              <div className="tf-bio-signature">— Tonny</div>

              <div className="tf-bio-facts">
                <div className="tf-bio-fact"><div className="n">10+</div><div className="l">Years trading</div></div>
                <div className="tf-bio-fact"><div className="n">3</div><div className="l">Core markets</div></div>
                <div className="tf-bio-fact"><div className="n">6+</div><div className="l">Live bots</div></div>
                <div className="tf-bio-fact"><div className="n">3.2k</div><div className="l">Active traders</div></div>
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

              <div className="tf-timeline">
                <h4>The journey so far</h4>
                <div className="tf-tl">
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
          </div>
        </div>

        {/* ============ SERVICES PROVIDED — BOTS ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Services provided · Trading bots</div>
              <h2>Automated bots for EUR/USD, BTC/USD and XAU/USD</h2>
              <p>Every strategy is built for a single instrument. No generic multi-asset logic — just focused systems with transparent performance you can verify.</p>
            </div>
            <span className="tf-sec-count">{BOTS.length} strategies</span>
          </div>
          <div className="tf-bots">
            {BOTS.map((b) => (
              <div className="tf-bot" key={b.name}>
                <div className="tf-bot-head">
                  <div>
                    <div className="tf-bot-name">{b.name}</div>
                    <div className="tf-bot-market">{b.market} · {b.tf} · {b.tag}</div>
                  </div>
                  <span className={`tf-bot-pill ${b.live ? 'live' : ''}`}>{b.live ? 'Live' : b.risk}</span>
                </div>
                <div className="tf-bot-stats">
                  <div className="tf-bot-stat"><div className="k">Win rate</div><div className="v tf-pos">{b.win}%</div></div>
                  <div className="tf-bot-stat"><div className="k">Trades</div><div className="v">{b.trades}</div></div>
                  <div className="tf-bot-stat"><div className="k">Max DD</div><div className="v tf-neg">{b.dd}</div></div>
                  <div className="tf-bot-stat"><div className="k">Profit factor</div><div className="v">{b.pf}</div></div>
                </div>
                <div className="tf-bot-bar"><i style={{ width: `${b.win}%` }} /></div>
                <div className="tf-bot-bar-label"><span>Performance</span><span>{b.win}/100</span></div>
                <button className="tf-bot-btn" onClick={() => go('bots')}>Configure this bot</button>
              </div>
            ))}
          </div>
        </div>

        {/* ============ TOOLS ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Services provided · Free tools</div>
              <h2>Size every trade. Read every currency.</h2>
              <p>Two tools that do more for your account than any indicator ever will.</p>
            </div>
          </div>
          <div className="tf-tools">
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
                  <input id="tf-bal" type="number" min="0" value={calc.bal} onChange={(e) => setCalc({ ...calc, bal: e.target.value })} />
                </div>
                <div className="tf-field">
                  <label htmlFor="tf-risk">Risk per trade (%)</label>
                  <input id="tf-risk" type="number" min="0" step="0.1" value={calc.risk} onChange={(e) => setCalc({ ...calc, risk: e.target.value })} />
                </div>
                <div className="tf-field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="tf-sl">Stop-loss (pips)</label>
                  <input id="tf-sl" type="number" min="1" value={calc.sl} onChange={(e) => setCalc({ ...calc, sl: e.target.value })} />
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
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(riskAmount)}</div>
                </div>
              </div>
              <button className="tf-btn tf-btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => go('lot')}>Open full calculator</button>
            </div>

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
                        <div className={`tf-st-bar ${pos ? 'pos' : 'neg'}`} style={pos ? { left: '50%', width: `${w}%` } : { right: '50%', width: `${w}%` }} />
                      </div>
                      <div className={`tf-st-val ${pos ? 'tf-pos' : 'tf-neg'}`}>{pos ? '+' : ''}{fmt(v, 2)}%</div>
                    </div>
                  );
                })}
              </div>
              <button className="tf-btn tf-btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => go('strength')}>Open Strength Meter</button>
            </div>
          </div>
        </div>

        {/* ============ HOW IT WORKS ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">How it works</div>
              <h2>From sign-up to automated in four steps</h2>
            </div>
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

        {/* ============ FOREX BASICS ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Forex 101</div>
              <h2>Everything a new trader needs to know</h2>
              <p>Straight answers to the questions every retail trader asks in their first month — no fluff, no sales pitch.</p>
            </div>
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

        {/* ============ SESSIONS ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Market clock</div>
              <h2>The four forex sessions</h2>
              <p>Know when the market moves — timing matters as much as direction.</p>
            </div>
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

        {/* ============ PIP TABLE ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Reference</div>
              <h2>Pip value cheat-sheet</h2>
              <p>What one pip is worth per lot size, for the instruments you actually trade.</p>
            </div>
          </div>
          <div className="tf-tbl-wrap">
            <table className="tf-tbl">
              <thead>
                <tr>
                  <th>Instrument</th><th className="r">1 Pip</th>
                  <th className="r">Standard lot</th><th className="r">Mini lot</th><th className="r">Micro lot</th>
                </tr>
              </thead>
              <tbody>
                {PIP_TABLE.map((r) => (
                  <tr key={r.pair}>
                    <td><strong style={{ color: TEXT }}>{r.pair}</strong></td>
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

        {/* ============ STRATEGIES ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Strategy library</div>
              <h2>Four strategies, explained simply</h2>
              <p>The playbooks behind our bots — written so a beginner can follow.</p>
            </div>
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

        {/* ============ EVENTS ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">This week</div>
              <h2>High-impact events to watch</h2>
              <p>Filtered for EUR/USD, BTC/USD and XAU/USD. Volatility clusters around these releases.</p>
            </div>
          </div>
          <div className="tf-events">
            {EVENTS.map((e, i) => (
              <div className="tf-event" key={i}>
                <div className="d">{e.day}</div>
                <div className="t">{e.time}</div>
                <div className="e">{e.event}</div>
                <div className={`imp ${e.impact === 'Very High' ? 'vh' : e.impact === 'High' ? 'h' : 'm'}`}>{e.impact}</div>
                <div className="af">{e.affect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ============ GLOSSARY ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Glossary</div>
              <h2>Forex terms, defined in plain English</h2>
            </div>
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

        {/* ============ LIVE ACTIVITY ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Live activity</div>
              <h2>What traders are doing right now</h2>
              <p>Real actions from the MyTradeApp community over the last hour.</p>
            </div>
            <span className="tf-sec-count">Live feed</span>
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

        {/* ============ MILESTONES ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">By the numbers</div>
              <h2>The platform in real numbers</h2>
            </div>
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

        {/* ============ PRICING ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Pricing</div>
              <h2>Simple plans. No lock-in.</h2>
              <p>Start free, upgrade when you are ready to run live bots.</p>
            </div>
          </div>
          <div className="tf-pricing">
            {PRICING.map((p) => (
              <div className={`tf-plan ${p.highlight ? 'highlight' : ''}`} key={p.name}>
                {p.highlight && <span className="pop">Most popular</span>}
                <h4>{p.name}</h4>
                <div className="price"><span className="a">{p.price}</span><span className="p">{p.period}</span></div>
                <div className="desc">{p.desc}</div>
                <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                <button className={`tf-btn ${p.highlight ? 'tf-btn-primary' : 'tf-btn-ghost'}`} onClick={() => go('bots')}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>

        {/* ============ TESTIMONIALS ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">Trader feedback</div>
              <h2>What the community says</h2>
            </div>
          </div>
          <div className="tf-testi">
            {TESTIMONIALS.map((t) => (
              <div className="tf-quote-card" key={t.n}>
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

        {/* ============ ARTICLES ============ */}
        <div>
          <div className="tf-sec-head">
            <div>
              <div className="tf-eyebrow">From the journal</div>
              <h2>Latest articles & guides</h2>
              <p>Written by Tonny and the community — practical, no-hype content.</p>
            </div>
            <span className="tf-sec-count">Updated weekly</span>
          </div>
          <div className="tf-articles">
            {ARTICLES.map((a) => (
              <div className="tf-article" key={a.title}>
                <div className="cat">{a.cat}</div>
                <h5>{a.title}</h5>
                <div className="meta"><span>{a.date}</span><span>{a.read}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* ============ NEWSLETTER ============ */}
        <div className="tf-news">
          <div>
            <h3>Get one useful forex idea each week.</h3>
            <p>No spam, no affiliate links. Just a short note on what moved in EUR/USD, BTC/USD and XAU/USD, plus one practical risk tip. Unsubscribe anytime.</p>
          </div>
          <form className="tf-news-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@email.com" aria-label="Email address" />
            <button className="tf-btn tf-btn-primary" type="submit">Subscribe</button>
          </form>
        </div>

        {/* ============ FAQ ============ */}
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

        {/* ============ CTA ============ */}
        <div className="tf-cta">
          <h2>Ready to trade with an edge?</h2>
          <p>Start with the free tools, then let a bot handle the execution. No broker lock-in, no hidden promises — just a better way to trade EUR/USD, BTC/USD and XAU/USD.</p>
          <div className="row">
            <button className="tf-btn tf-btn-primary" onClick={() => go('bots')}>Explore Trading Bots</button>
            <button className="tf-btn tf-btn-ghost" onClick={() => go('strength')}>Check Currency Strength</button>
          </div>
        </div>

        {/* ============ NOTICE ============ */}
        <div className="tf-notice">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
          <span>
            MyTradeApp is a third-party analytics and automation platform created by Tonny (Tonnyfx) — not a broker
            or investment advisor. All performance figures shown are simulated and for illustration only. Trading
            forex, crypto and metals carries significant risk of loss. Never risk capital you cannot afford to lose.
          </span>
        </div>

      </section>
    </>
  );
}