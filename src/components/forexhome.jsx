// src/components/forexhome.jsx
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from 'styled-components';

// Images
import tonnyPhoto from '../assets/images/image13.png';
import spreadsImg from '../assets/images/spreads.png';
import strengthImg from '../assets/images/strength.png'; 
import heatmapImg from '../assets/images/heatmap.png';
import correlationImg from '../assets/images/correlation.png';
import sentimentsImg from '../assets/images/sentiments.png';
import liquidityImg from '../assets/images/liquidity.png';
import volatilityImg from '../assets/images/volatility.png';
import calendarImg from '../assets/images/calender.png'; 
import botsImg from '../assets/images/bots.png';
import tradingviewImg from '../assets/images/tradingview.png';
import patternsImg from '../assets/images/patterns.png';
import currencyImg from '../assets/images/currency.png';

/* ================================================================ */
/*  EXTERNAL LINKS                                                  */
/* ================================================================ */
const ABOUT_TONNYFX_URL   = '#';   
const COMMUNITY_URL       = '#';   

/* ================================================================ */
/*  CONTENT                                                         */
/* ================================================================ */
const STATS = [
  { n:'10+',   l:'Years trading' },
  { n:'3.2k+', l:'Traders mentored' },
  { n:'6+',    l:'Live bots' },
  { n:'24/7',  l:'Community support' },
];

const FEATURES = [
  {
    key: 'spreads',
    title: 'Forex Spreads',
    subtitle: 'Real-time broker comparison',
    img: spreadsImg,
    route: 'spreads',
    desc: 'Forex brokers spread comparison in real time. Best spread is colored in green, worst spread is colored in red.',
    extra: 'For overall best spreads, look for the row colored mostly with green cells.'
  },
  {
    key: 'strength',
    title: 'Strength Meter',
    subtitle: 'Rank the majors',
    img: strengthImg,
    route: 'strength',
    desc: 'Rank the eight major currencies against a weighted basket. Spot the strongest and weakest in one glance to find the best trading opportunities.',
    extra: 'Use this tool to identify which currency pairs are trending the strongest and which are lagging, helping you trade with momentum.'
  },
  {
    key: 'heatmap',
    title: 'Market Heatmap',
    subtitle: 'Strongest & weakest currencies',
    img: heatmapImg,
    route: 'heatmap',
    desc: 'Use the heatmap table to view in real time the strongest and weakest currencies in each timeframe. You can switch the search mode to pips or percent.',
    extra: 'Visualize momentum across all major pairs instantly.'
  },
  {
    key: 'correlation',
    title: 'Currency Correlation',
    subtitle: 'Historical analysis & risk management',
    img: correlationImg,
    route: 'correlation',
    desc: 'Correlation ranges from -100% to +100%, where -100% represents currencies moving in opposite directions (negative correlation) and +100% represents currencies moving in the same direction.',
    extra: 'Click on a correlation number to view a historical correlation analysis and compare it against other currency correlations. Click on a currency to view the top correlations analysis.'
  },
  {
    key: 'sentiment',
    title: 'Market Sentiment',
    subtitle: 'Understand the crowd',
    img: sentimentsImg,
    route: 'sentiment',
    desc: 'Forex market sentiment can be measured using various tools and indicators. One of the most popular methods is using sentiment indicators. These indicators provide insights into market sentiment, such as the percentage of traders who are bullish or bearish on a particular currency.',
    extra: 'By understanding the overall sentiment of the market, traders can better anticipate price movements, identify potential trading opportunities, and manage risk more effectively.'
  },
  {
    key: 'liquidity',
    title: 'Forex Liquidity',
    subtitle: 'Real-time market pulse',
    img: liquidityImg,
    route: 'liquidity',
    desc: 'Forex Liquidity refers to the ease with which a currency pair can be bought or sold in the market without causing a significant impact on its price. It is a measure of the market\'s ability to absorb large trading volumes without causing substantial price fluctuations.',
    extra: 'Our platform gathers data from many brokers and the top 10 traded currencies to compute the liquidity per minute for the last 48 hours.'
  },
  {
    key: 'volatility',
    title: 'Market Volatility',
    subtitle: 'Track price variation',
    img: volatilityImg,
    route: 'volatility',
    desc: 'Volatility is a term used to statistically describe the variation in trading prices. The higher the number, the higher the market volatility is. Alternatively, the lower the number, the lower volatility is.',
    extra: 'Volatility is the difference between the high and low values of a price in a symbol. Compare multiple symbols across different timeframes to save time.'
  },
  {
    key: 'economic-calendar',
    title: 'Economic Calendar',
    subtitle: 'Stay ahead of market movers',
    img: calendarImg,
    route: 'economic-calendar',
    desc: 'The Forex market is highly responsive to economic news and data. An Economic Calendar is a tool for traders that tracks and displays upcoming economic events, including releases of economic indicators, reports, and other financial data in real-time.',
    extra: 'Set up personalized notifications for specific economic events. Each event is categorized by impact level - from no impact to high impact - facilitating the anticipation and reduction of risks.'
  },
  {
    key: 'bots',
    title: 'Automated Bots',
    subtitle: 'Algorithmic trading 24/5',
    img: botsImg,
    route: 'bots',
    desc: 'Execute proven strategies 24/5 with our pre-built and custom algorithmic bots. Manage risk, set stop-losses, and let the system work for you.',
    extra: 'Our bots are tuned specifically for EUR/USD, BTC/USD, and XAU/USD, combining trend-following and mean-reversion logic to capture market moves without emotional interference.'
  },
  {
    key: 'tradingview',
    title: 'TradingView Charts',
    subtitle: 'Institutional-grade charting',
    img: tradingviewImg,
    route: 'tradingview',
    desc: 'Access institutional-grade charting with over 100 indicators, drawing tools, and real-time market data directly inside your dashboard.',
    extra: 'Powered by TradingView, this integrated view allows you to perform deep technical analysis on any asset without ever leaving the platform.'
  },
  {
    key: 'patterns',
    title: 'Chart Patterns',
    subtitle: 'Automated technical scanning',
    img: patternsImg,
    route: 'patterns',
    desc: 'Patterns are being scanned in real time and presented in a table (refreshes automatically every 30 seconds).',
    extra: 'Please note that some patterns should be confirmed with the price, for example a pattern may be valid only if occurs during an uptrend or a downtrend. Green = Bullish, Red = Bearish, Yellow = Uncertainty.'
  },
  {
    key: 'currencies',
    title: 'Live Currencies',
    subtitle: 'Real-time forex rates',
    img: currencyImg,
    route: 'currencies',
    desc: 'Forex exchange rates of most currencies\' value are determined by the market. Forex rates conversion may be as easy as exchanging one currency for another at a local bank.',
    extra: 'There are multiple causes why forex exchange rates vary so often. Interest rates, inflation, geopolitical stability, and export and import levels are all significant factors.'
  }
];

const FAQS = [
  { q:'Is MyTradingZone a broker?',                       a:'No. MyTradingZone is a third-party analytics and automation layer built by Tonny. You keep your own broker account and we give you the tools to trade it better.' },
  { q:'Which instruments do the bots trade?',             a:'Three only: EUR/USD, BTC/USD and XAU/USD. Focusing on a small set lets us tune each strategy far more precisely than a generic multi-asset bot.' },
  { q:'Do I need coding experience?',                     a:'None at all. Every bot is pre-built and configurable from the dashboard. If you can toggle a switch and type a risk %, you can run one.' },
  { q:'How is risk handled?',                             a:'Every position is sized from your balance and a stop-loss distance. The risk manager enforces a daily loss cap and warns you before margin gets dangerous.' },
  { q:'Can I run bots and manual trades together?',       a:'Yes. Both sit in the same book and the dashboard aggregates P/L, margin and exposure across both.' },
];

/* ================================================================ */
/*  ICONS                                                           */
/* ================================================================ */
const Icon = ({ name, size = 20 }) => {
  const p = { width:size, height:size, viewBox:'0 0 24 24', fill:'none',
    stroke:'currentColor', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' };
  switch (name) {
    case 'arrow': return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'users': return <svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M3 20v-1.5A4.5 4.5 0 017.5 14h3A4.5 4.5 0 0115 18.5V20"/><path d="M17 11a3 3 0 100-6"/><path d="M21 20v-1.5a4.5 4.5 0 00-3.5-4.36"/></svg>;
    case 'shield':return <svg {...p}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>;
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
  const theme = useTheme();

  const C = useMemo(() => {
    const tc = theme?.colors || {};
    const accent    = tc.accent      || '#f5b400';
    const accentHov = tc.accentHover || accent;
    const accentSoft= tc.accentLight || 'rgba(245,180,0,.12)';
    const accentBrd = accent.length === 7 ? accent + '47' : 'rgba(245,180,0,.28)';

    return {
      bg:    tc.background || tc.bg       || '#070707',
      bg2:   tc.surface    || tc.bg2      || '#0d0d0d',
      card:  tc.surface    || '#111111',
      card2: tc.surfaceHover || tc.card2  || '#161616',
      border:  tc.border      || '#1e1e1e',
      border2: tc.borderHover || tc.border2 || '#2a2a2a',
      gold:       accent,
      gold2:      accentHov,
      goldSoft:   accentSoft,
      goldBorder: accentBrd,
      text:  tc.text          || '#ffffff',
      text2: tc.textSecondary || tc.textMuted || '#a8a8a8',
      text3: tc.textMuted     || '#6b6b6b',
      green: tc.success       || '#22c55e',
      red:   tc.danger        || '#ef4444',
    };
  }, [theme]);

  const openExternal = (url) => {
    if (!url || url === '#') {
      alert('Link coming soon — please check back later.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const styles = useMemo(() => `
    /* 
      FIX: Override the global height constraints to allow natural window scrolling.
      This ensures the page flows correctly and the footer is never cut off.
    */
    html, body, #root {
      height: auto !important;
      min-height: 100% !important;
      overflow-y: auto !important;
    }
    
    .forex-page {
      height: auto !important;
      min-height: 100vh !important;
    }

    .forex-content {
      height: auto !important;
      max-width: 1600px !important;
    }

    .view.active,
    .view.active.tf-page {
      display: block !important;
      width: 100% !important;
      height: auto !important;
      max-height: none !important;
      overflow: visible !important;
    }

    .tf-page{
      background:${C.bg};
      color:${C.text};
      min-height:100%;
      display:block;
      font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
      transition:background .25s ease, color .25s ease;
    }
    .tf-page *{ box-sizing:border-box; }

    .tf-wrap{ max-width:1240px; margin:0 auto; width:100%; padding:0 22px; }
    .tf-sec{ padding:80px 0; }
    .tf-sec-sm{ padding:52px 0; }
    .tf-alt{ background:${C.bg2}; transition:background .25s ease; }

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

    .tf-btn{ display:inline-flex; align-items:center; justify-content:center;
      gap:9px; padding:15px 30px; border-radius:10px; border:none;
      font-family:inherit; font-size:14.5px; font-weight:700;
      letter-spacing:.1px; cursor:pointer;
      transition:.2s cubic-bezier(.16,1,.3,1); white-space:nowrap; }
    .tf-btn-gold{ background:${C.gold}; color:${C.bg};
      box-shadow:0 8px 22px ${C.goldSoft}; }
    .tf-btn-gold:hover{ background:${C.gold2}; transform:translateY(-2px); }
    .tf-btn-outline{ background:transparent; color:${C.gold};
      border:1.5px solid ${C.gold}; }
    .tf-btn-outline:hover{ background:${C.goldSoft}; transform:translateY(-2px); }

    /* Hero */
    .tf-hero{ position:relative; overflow:hidden; padding:96px 0 108px;
      text-align:center;
      background:
        radial-gradient(ellipse at 50% 0%, ${C.goldSoft}, transparent 60%),
        linear-gradient(180deg, ${C.card} 0%, ${C.bg} 100%); }
    .tf-hero::before{ content:''; position:absolute; inset:0;
      pointer-events:none;
      background-image:
        linear-gradient(${C.border}40 1px, transparent 1px),
        linear-gradient(90deg, ${C.border}40 1px, transparent 1px);
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

    /* Founder */
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
      color:${C.bg}; font-size:10px; font-weight:900; letter-spacing:1.3px;
      text-transform:uppercase; }
    .tf-founder-body{ position:relative; z-index:1; }
    .tf-founder-name{ font-size:32px; font-weight:800; letter-spacing:-1px;
      color:${C.text}; margin:0 0 8px; }
    .tf-founder-role{ font-size:13px; font-weight:700; letter-spacing:.9px;
      text-transform:uppercase; color:${C.gold}; margin-bottom:22px; }
    .tf-founder-bio{ font-size:14.5px; line-height:1.85; color:${C.text2};
      margin:0 0 20px; }
    .tf-founder-bio strong{ color:${C.text}; font-weight:700; }
    .tf-founder-stats{ display:grid; grid-template-columns:repeat(4,1fr);
      gap:20px; padding-top:26px; border-top:1px solid ${C.border}; }
    .tf-fstat .n{ font-family:'JetBrains Mono',monospace; font-size:26px;
      font-weight:800; letter-spacing:-1px; color:${C.gold}; line-height:1; }
    .tf-fstat .l{ font-size:10.5px; font-weight:700; letter-spacing:1px;
      text-transform:uppercase; color:${C.text3}; margin-top:8px; }

    /* Feature Rows with Special Image Effects */
    .tf-feature-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      margin-bottom: 80px;
    }
    .tf-feature-row:last-child { margin-bottom: 0; }
    .tf-feature-row.reverse .tf-feature-img-wrap { order: 2; }
    .tf-feature-row.reverse .tf-feature-text { order: 1; }
    
    .tf-feature-img-wrap {
      position: relative;
      border-radius: 16px;
      background: ${C.card};
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1;
    }
    
    /* Animated gradient border */
    .tf-feature-img-wrap::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 18px;
      background: linear-gradient(135deg, ${C.border} 0%, ${C.gold} 50%, ${C.border} 100%);
      background-size: 200% 200%;
      z-index: -1;
      opacity: 0.3;
      transition: opacity 0.4s ease, animation 4s linear infinite;
    }
    
    .tf-feature-img-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.08) 45%, transparent 60%);
      background-size: 250% 100%;
      background-position: 100% 0;
      pointer-events: none;
      transition: background-position 0.7s ease;
      z-index: 2;
    }

    .tf-feature-img-wrap:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7), 0 0 30px ${C.goldSoft};
    }

    .tf-feature-img-wrap:hover::before {
      opacity: 1;
      animation: gradientShift 3s ease infinite;
    }

    .tf-feature-img-wrap:hover::after {
      background-position: -100% 0;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .tf-feature-img-wrap img {
      width: 100%;
      display: block;
      height: auto;
      object-fit: cover;
      border-radius: 15px;
      position: relative;
      z-index: 1;
    }

    .tf-feature-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .tf-feature-badge {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: ${C.gold};
      margin-bottom: 12px;
      background: ${C.goldSoft};
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid ${C.goldBorder};
    }
    .tf-feature-title {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -1px;
      color: ${C.text};
      margin-bottom: 18px;
      line-height: 1.1;
    }
    .tf-feature-title .g { color: ${C.gold}; }
    .tf-feature-desc {
      font-size: 15px;
      line-height: 1.7;
      color: ${C.text2};
      margin-bottom: 16px;
    }
    .tf-feature-extra {
      font-size: 14px;
      line-height: 1.7;
      color: ${C.text3};
      margin-bottom: 28px;
      padding-left: 16px;
      border-left: 2px solid ${C.gold};
    }

    /* FAQ */
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

    /* Footer */
    .tf-footer {
      border-top: 1px solid ${C.border};
      background: ${C.card};
      padding: 60px 22px;
      text-align: center;
      color: ${C.text3};
    }
    .tf-footer-inner {
      max-width: 800px;
      margin: 0 auto;
    }
    .tf-footer p {
      font-size: 12px;
      line-height: 1.7;
      margin: 0 0 16px;
    }
    .tf-footer .copyright {
      font-size: 12px;
      font-weight: 600;
      color: ${C.text2};
      margin: 0;
    }

    /* Responsive */
    @media (max-width:1100px){
      .tf-hero h1{ font-size:60px; letter-spacing:-2.4px; }
      .tf-h2{ font-size:36px; letter-spacing:-1.2px; }
    }
    @media (max-width:900px){
      .tf-hero{ padding:72px 0 84px; }
      .tf-hero h1{ font-size:50px; letter-spacing:-1.9px; }
      .tf-hero-lead{ font-size:16.5px; }
      .tf-founder{ grid-template-columns:1fr; gap:32px; padding:32px; }
      .tf-founder-photo{ max-width:320px; }
      .tf-founder-stats{ grid-template-columns:repeat(2,1fr); gap:22px; }
      .tf-sec{ padding:60px 0; }

      .tf-feature-row {
        grid-template-columns: 1fr;
        gap: 32px;
        margin-bottom: 60px;
      }
      .tf-feature-row.reverse .tf-feature-img-wrap { order: 1; }
      .tf-feature-row.reverse .tf-feature-text { order: 2; }
      .tf-feature-title { font-size: 28px; }
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
      .tf-founder{ padding:22px 18px; gap:26px; }
      .tf-founder-photo{ max-width:100%; }
      .tf-founder-name{ font-size:25px; }
      .tf-founder-bio{ font-size:13.5px; }
      .tf-founder-stats{ grid-template-columns:1fr 1fr; gap:18px; }
      .tf-fstat .n{ font-size:22px; }
      .tf-faq summary{ font-size:12.5px; padding:15px 18px; }
      .tf-faq details p{ padding:0 18px 17px; font-size:12.5px; }
      
      .tf-feature-title { font-size: 24px; }
      .tf-feature-desc, .tf-feature-extra { font-size: 13.5px; }

      .tf-footer { padding: 40px 18px; }
    }
    @media (max-width:420px){
      .tf-hero h1{ font-size:32px; }
      .tf-fstat .n{ font-size:19px; }
      .tf-founder-stats{ grid-template-columns:1fr; }
    }
  `, [C]);

  return (
    <>
      <style>{styles}</style>

      <section className="view active tf-page">

        {/* ============================================================
            HERO
           ============================================================ */}
        <div className="tf-hero">
          <div className="tf-candles">
            <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={C.green} stopOpacity="0.32" />
                  <stop offset="100%" stopColor={C.green} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="cr" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={C.red} stopOpacity="0.30" />
                  <stop offset="100%" stopColor={C.red} stopOpacity="0" />
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
                      stroke={up ? C.green : C.red}
                      strokeOpacity="0.35"
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
              MyTradingZone is the terminal I built for EUR/USD, BTC/USD and XAU/USD —
              bots, calculators and risk tools in one place.
            </p>
            <div className="tf-hero-cta">
              <button className="tf-btn tf-btn-gold" onClick={() => openExternal(COMMUNITY_URL)}>
                Join MyTradingZone community <Icon name="arrow" size={16} />
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
            ABOUT (founder only)
           ============================================================ */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">About</div>
              <h2 className="tf-h2">About <span className="g">MyTradingZone</span></h2>
              <p className="tf-sub">
                MyTradingZone is a results-driven forex automation and trading-tools brand by Tonnyfx,
                helping traders from beginner to advanced become consistently profitable.
              </p>
            </div>

            <div className="tf-founder">
              <div className="tf-founder-photo">
                <img src={tonnyPhoto} alt="Tonny — founder of MyTradingZone" />
                <span className="tf-founder-tag">Founder</span>
              </div>
              <div className="tf-founder-body">
                <h3 className="tf-founder-name">Tonny (Tonnyfx)</h3>
                <div className="tf-founder-role">Forex Trader · Mentor · Founder</div>
                <p className="tf-founder-bio">
                  Tonny is a full-time forex trader, mentor and the founder of MyTradingZone,
                  with <strong>over 10 years of experience</strong> in the financial markets.
                  Known for his practical, no-hype approach to trading, he focuses on helping
                  traders develop discipline, consistency and profitable habits through
                  mentorship and real market execution. He trades three instruments only —{' '}
                  <strong>EUR/USD, BTC/USD and XAU/USD</strong> — and every tool inside
                  MyTradingZone reflects that focus.
                </p>

                <button type="button" className="tf-founder-more" onClick={() => openExternal(ABOUT_TONNYFX_URL)} aria-label="More about Tonnyfx">
                  More about Tonnyfx <Icon name="arrow" size={14} />
                </button>

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
            FEATURES (Zig-zag layout)
           ============================================================ */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eyebrow">Platform Features</div>
              <h2 className="tf-h2">What <span className="g">MyTradingZone</span> provides</h2>
              <p className="tf-sub">
                Explore the powerful suite of tools built directly into your dashboard. 
                From real-time data to automated execution, everything is designed to give you an edge.
              </p>
            </div>

            <div className="tf-features-list">
              {FEATURES.map((f, i) => (
                <div className={`tf-feature-row ${i % 2 === 1 ? 'reverse' : ''}`} key={f.key}>
                  
                  {/* Image */}
                  <div className="tf-feature-img-wrap">
                    <img src={f.img} alt={f.title} />
                  </div>

                  {/* Text */}
                  <div className="tf-feature-text">
                    <div className="tf-feature-badge">{f.subtitle}</div>
                    <h3 className="tf-feature-title">{f.title}</h3>
                    <p className="tf-feature-desc">{f.desc}</p>
                    {f.extra && <p className="tf-feature-extra">{f.extra}</p>}
                    
                    <button className="tf-btn tf-btn-outline" onClick={() => go(f.route)}>
                      Explore {f.title} <Icon name="arrow" size={14} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            FAQ
           ============================================================ */}
        <div className="tf-sec">
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
            FOOTER
           ============================================================ */}
        <footer className="tf-footer">
          <div className="tf-footer-inner">
            <p>
              <strong>Risk Disclaimer:</strong> Trading forex, gold, and cryptocurrencies involves significant risk and may result in the loss of your capital. Market analysis and information provided on this platform are for informational and educational purposes only and do not constitute financial advice.
            </p>
            <p className="copyright">
              © 2026 MyTradingZone. All rights reserved.
            </p>
          </div>
        </footer>

      </section>
    </>
  );
}