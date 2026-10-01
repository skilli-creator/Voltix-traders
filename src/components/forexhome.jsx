// src/components/forexhome.jsx
import { useState } from 'react';
import { fmt, fmtPrice } from '../pages/forexdash';
import tonnyPhoto from '../assets/images/image13.png';

/* ================================================================
   STATIC CONTENT
   ================================================================ */

const MARKETS = [
  { sym:'EURUSD', label:'EUR/USD', name:'Euro / US Dollar', tag:'Major', spread:'0.4 pips', atr:'65 pips', vol:'Medium',
    desc:'The world’s most liquid pair. Tight spreads, deep liquidity and clean directional trends during London and New York.' },
  { sym:'BTCUSD', label:'BTC/USD', name:'Bitcoin / US Dollar', tag:'Crypto', spread:'$12', atr:'$1,200', vol:'High',
    desc:'24/7 volatility with huge intraday ranges. Perfect for momentum, breakout and session-based automation.' },
  { sym:'XAUUSD', label:'XAU/USD', name:'Gold / US Dollar', tag:'Metal', spread:'18 pts', atr:'$24', vol:'High',
    desc:'The classic safe-haven. Strong directional runs during risk-off flows and major US data releases.' },
];

const SERVICES = [
  { k:'bots',     t:'Automated Trading Bots',    d:'Six pre-built strategies tuned for EUR/USD, BTC/USD and XAU/USD.',                 c:'Manage bots' },
  { k:'lot',      t:'Lot Size Calculator',       d:'Risk-based sizing — balance, risk % and stop-loss in, exact lot size out.',         c:'Calculate' },
  { k:'strength', t:'Currency Strength Meter',   d:'Rank the eight majors against a weighted basket in one glance.',                    c:'View strength' },
  { k:'signals',  t:'Live Signal Alerts',        d:'Momentum and breakout alerts the moment price structure shifts.',                   c:'See alerts' },
  { k:'risk',     t:'Risk & Margin Manager',     d:'Real-time margin level, free margin and exposure warnings.',                        c:'Review risk' },
  { k:'journal',  t:'Trade Journal & Analytics', d:'Every fill logged. Win rate, expectancy, drawdown, equity curve.',                  c:'Open journal' },
  { k:'backtest', t:'Backtesting Engine',        d:'Test any strategy against years of tick data before risking capital.',              c:'Run backtest' },
  { k:'coaching', t:'1-on-1 Coaching',           d:'Direct sessions with Tonny on risk, journaling and strategy design.',               c:'Book session' },
];

const BOTS = [
  { n:'Pip Scalper',      m:'EUR/USD', tf:'M5',  w:68, tr:1243, dd:4.2,  pf:2.1 },
  { n:'Momentum Rider',   m:'BTC/USD', tf:'H1',  w:61, tr:486,  dd:9.8,  pf:1.9 },
  { n:'Gold Reversal',    m:'XAU/USD', tf:'M30', w:57, tr:712,  dd:11.4, pf:1.7 },
  { n:'London Breakout',  m:'EUR/USD', tf:'M15', w:64, tr:894,  dd:6.1,  pf:2.0 },
  { n:'Asian Range Fade', m:'XAU/USD', tf:'M15', w:59, tr:534,  dd:7.9,  pf:1.6 },
  { n:'Crypto Session',   m:'BTC/USD', tf:'H4',  w:55, tr:312,  dd:13.2, pf:1.8 },
];

const BASICS = [
  { t:'What is forex trading?',   d:'The global marketplace for exchanging currencies. Roughly $7.5 trillion trades every day — the world’s largest and most liquid market.' },
  { t:'The major pairs',          d:'EUR/USD, USD/JPY, GBP/USD and USD/CHF — tightest spreads, deepest liquidity. MyTradeApp starts with EUR/USD.' },
  { t:'What is a pip?',           d:'The smallest standardised move. Usually 0.0001, and 0.01 for JPY pairs. Pip value depends on lot size and account currency.' },
  { t:'Lots, mini, micro',        d:'Standard = 100,000 units. Mini = 10,000. Micro = 1,000. Size tools work in all three, so a small account can trade safely.' },
  { t:'Leverage & margin',        d:'Leverage lets you control a large position with a small deposit. Margin is the collateral your broker holds while the trade is open.' },
  { t:'Trading sessions',         d:'Forex runs 24/5 across three overlapping sessions: Sydney/Tokyo, London and New York. Volatility peaks during the London–New York overlap.' },
  { t:'Technical vs fundamental', d:'Technical studies price and momentum. Fundamental studies rates, inflation and geopolitics. Serious traders use both.' },
  { t:'Risk management',          d:'Never risk more than 1–2% per trade. Always use a stop-loss. MyTradeApp enforces both, automatically.' },
];

const SESSIONS = [
  { n:'Sydney',   h:'22:00 – 07:00 UTC', c:'#a855f7', d:'Thin liquidity · AUD & NZD most active' },
  { n:'Tokyo',    h:'00:00 – 09:00 UTC', c:'#3b82f6', d:'JPY pairs dominate · steady, methodical action' },
  { n:'London',   h:'07:00 – 16:00 UTC', c:'#22c55e', d:'Highest volume · strongest trends · EUR & GBP' },
  { n:'New York', h:'12:00 – 21:00 UTC', c:'#f5a524', d:'US data drops · high volatility · USD & gold' },
];

const PIPS = [
  { p:'EUR/USD', pip:'0.0001', s:'$10.00', m:'$1.00', mi:'$0.10' },
  { p:'GBP/USD', pip:'0.0001', s:'$10.00', m:'$1.00', mi:'$0.10' },
  { p:'USD/JPY', pip:'0.01',   s:'$9.10',  m:'$0.91', mi:'$0.09' },
  { p:'XAU/USD', pip:'0.01',   s:'$1.00',  m:'$0.10', mi:'$0.01' },
  { p:'BTC/USD', pip:'$1.00',  s:'$1.00',  m:'$0.10', mi:'$0.01' },
];

const STRATS = [
  { n:'London Breakout',     m:'EUR/USD', tf:'M15', d:'Fade the Asian range and ride the first London impulse. Classic, robust, session-based.' },
  { n:'Trend Continuation',  m:'BTC/USD', tf:'H1',  d:'Enter on pullbacks in the direction of the daily trend, using the H1 EMA ribbon as a filter.' },
  { n:'Gold Mean Reversion', m:'XAU/USD', tf:'M30', d:'Fade extremes against the 200 EMA. Tight targets, high win rate, capped upside.' },
  { n:'NY Reversal',         m:'EUR/USD', tf:'M5',  d:'Trade the first exhaustion candle after the US cash open, targeting the London close.' },
];

const EVENTS = [
  { d:'MON', t:'14:00', e:'US ISM Manufacturing PMI',    i:'High',      a:'EUR/USD · XAU/USD' },
  { d:'WED', t:'18:00', e:'FOMC Interest Rate Decision', i:'Very High', a:'All instruments' },
  { d:'THU', t:'12:30', e:'US Initial Jobless Claims',   i:'Medium',    a:'EUR/USD' },
  { d:'FRI', t:'12:30', e:'US Non-Farm Payrolls (NFP)',  i:'Very High', a:'All instruments' },
];

const GLOSS = [
  { k:'Spread',       v:'Difference between bid and ask — your cost to enter a trade.' },
  { k:'Leverage',     v:'A multiplier that lets you control a larger position than your deposit.' },
  { k:'Margin call',  v:'Broker demand for more funds when equity drops below required margin.' },
  { k:'Drawdown',     v:'Peak-to-trough decline in equity. The most important risk metric.' },
  { k:'Stop-loss',    v:'A pre-set order that closes your trade automatically at a defined loss.' },
  { k:'Take-profit',  v:'A pre-set order that closes your trade once a profit target is hit.' },
  { k:'Slippage',     v:'Difference between expected price and actual fill price on execution.' },
  { k:'Win rate',     v:'Percent of trades closing in profit. Meaningless without average R:R.' },
  { k:'Expectancy',   v:'Average profit per trade: (win rate × avg win) − (loss rate × avg loss).' },
  { k:'Sharpe ratio', v:'Return per unit of risk. Above 1.0 is good; above 2.0 is excellent.' },
];

const PLANS = [
  { n:'Starter', p:'Free', per:'forever', hl:false, d:'For traders who want the core tools before committing a cent.',
    f:['Lot size calculator','Currency strength meter','Economic calendar','Pip value table','Community access'] },
  { n:'Trader',  p:'$29',  per:'/ month', hl:true,  d:'For active retail traders running one or two live bots.',
    f:['Everything in Starter','2 active bots','Live signal alerts','Trade journal & analytics','Backtesting engine','Priority email support'] },
  { n:'Pro',     p:'$79',  per:'/ month', hl:false, d:'For serious traders running a full portfolio of bots.',
    f:['Everything in Trader','Unlimited bots','Strategy builder','VPS hosting included','1-on-1 coaching','Full API access'] },
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
];

const QUOTES = [
  'Discipline beats prediction every single time.',
  'The market pays patience, not activity.',
  'Amateurs chase trades. Professionals size them.',
  'Consistency compounds — recklessness compounds faster.',
];

/* ================================================================
   THEME CONSTANTS
   ================================================================ */

const BG    = '#070707';
const BG2   = '#0d0d0d';
const CARD  = '#111111';
const CARD2 = '#161616';
const BORD  = '#1e1e1e';
const GOLD  = '#f5b400';
const GOLD2 = '#e0a200';
const GSOFT = 'rgba(245,180,0,.12)';
const GBORD = 'rgba(245,180,0,.28)';
const TXT   = '#ffffff';
const TXT2  = '#a8a8a8';
const TXT3  = '#6b6b6b';
const GRN   = '#22c55e';
const RED   = '#ef4444';

/* ================================================================
   COMPONENT
   ================================================================ */

export default function ForexHome({ pairs, onTrade, onViewChange }) {
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState('All');
  const [bal, setBal] = useState(10000);
  const [risk, setRisk] = useState(1);
  const [sl, setSl] = useState(25);
  const [faq, setFaq] = useState(null);
  const [annual, setAnnual] = useState(false);
  const [q, setQ] = useState(0);

  const go = (k) => { if (onViewChange) onViewChange(k); };
  const priceOf = (s) => (pairs && pairs[s] && pairs[s].price) || 0;
  const chgOf = (s) => {
    const p = pairs && pairs[s];
    if (!p || !p.open) return 0;
    return ((p.price - p.open) / p.open) * 100;
  };

  const riskAmt = (bal * risk) / 100;
  const lots = sl > 0 ? riskAmt / (sl * 10) : 0;
  const filtered = filter === 'All' ? BOTS : BOTS.filter((b) => b.m === filter);
  const m = MARKETS[tab];

  return (
    <>
      <style>{`
        .tf-wrap { max-width:1240px; margin:0 auto; width:100%; padding:0 22px; }
        .tf-sec { padding:80px 0; }
        .tf-alt { background:${BG2}; }
        .tf-head { text-align:center; margin-bottom:52px; }
        .tf-eye {
          display:inline-flex; align-items:center; gap:8px;
          font-size:11px; font-weight:800; letter-spacing:1.7px;
          text-transform:uppercase; color:${GOLD}; margin-bottom:14px;
        }
        .tf-eye::before { content:''; width:22px; height:2px; background:${GOLD}; }
        .tf-h2 { font-size:40px; font-weight:800; letter-spacing:-1.5px; color:${TXT}; margin:0 0 14px; line-height:1.1; }
        .tf-h2 .g { color:${GOLD}; }
        .tf-sub { font-size:15px; line-height:1.65; color:${TXT2}; max-width:640px; margin:0 auto; }

        .tf-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:9px;
          padding:14px 28px; border-radius:10px; border:none;
          font-family:inherit; font-size:14px; font-weight:800;
          letter-spacing:.2px; cursor:pointer; white-space:nowrap;
        }
        .tf-btn-gold {
          background:linear-gradient(135deg, ${GOLD}, ${GOLD2});
          color:#0a0a0a; box-shadow:0 10px 26px ${GSOFT};
        }
        .tf-btn-outline {
          background:transparent; color:${GOLD}; border:1.5px solid ${GOLD};
        }
        .tf-pos { color:${GRN}; }
        .tf-neg { color:${RED}; }

        .tf-g2 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .tf-g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .tf-g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }

        .tf-card {
          padding:26px 22px; border-radius:16px;
          border:1px solid ${BORD}; background:${CARD};
        }

        .tf-tbl { width:100%; border-collapse:collapse; }
        .tf-tbl th {
          text-align:left; padding:16px 22px;
          font-size:10.5px; font-weight:800; letter-spacing:1px;
          text-transform:uppercase; color:${TXT3};
          background:${BG2}; border-bottom:1px solid ${BORD};
        }
        .tf-tbl td {
          padding:16px 22px; font-size:13px; color:${TXT2};
          border-bottom:1px solid ${BORD};
        }
        .tf-tbl tr:last-child td { border-bottom:none; }
        .tf-tbl .r { text-align:right; }
        .tf-tbl .num { font-family:'JetBrains Mono','Courier New',monospace; font-size:12.5px; font-weight:700; color:${TXT}; }

        .tf-timeline { position:relative; padding-left:34px; max-width:760px; margin:0 auto; }
        .tf-timeline::before {
          content:''; position:absolute; left:8px; top:8px; bottom:8px;
          width:2px; background:${BORD};
        }
        .tf-tl { position:relative; padding-bottom:26px; }
        .tf-tl:last-child { padding-bottom:0; }
        .tf-tl::before {
          content:''; position:absolute; left:-32px; top:6px;
          width:12px; height:12px; border-radius:50%;
          background:${BG}; border:2px solid ${GOLD};
        }
        .tf-tl .y { font-family:'JetBrains Mono','Courier New',monospace; font-size:11.5px; font-weight:800; letter-spacing:1px; color:${GOLD}; }
        .tf-tl h6 { font-size:15px; font-weight:800; color:${TXT}; margin:5px 0 6px; }
        .tf-tl p { font-size:13px; line-height:1.7; color:${TXT2}; margin:0; }

        .tf-quote-band {
          max-width:780px; margin:0 auto; padding:28px 36px;
          border-radius:16px; border:1px solid ${BORD};
          background:${CARD}; display:flex; align-items:center; gap:20px; flex-wrap:wrap;
        }

        .tf-notice {
          display:flex; align-items:flex-start; gap:12px;
          padding:20px 22px; border-radius:12px;
          background:${GSOFT}; border:1px solid ${GBORD};
        }

        @media (max-width:1100px) {
          .tf-h2 { font-size:34px; letter-spacing:-1.2px; }
          .tf-g4 { grid-template-columns:repeat(2,1fr); }
          .tf-g3 { grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:900px) {
          .tf-sec { padding:66px 0; }
          .tf-g2 { grid-template-columns:1fr; }
        }
        @media (max-width:640px) {
          .tf-wrap { padding:0 16px; }
          .tf-sec { padding:52px 0; }
          .tf-h2 { font-size:26px; letter-spacing:-.9px; }
          .tf-sub { font-size:13.5px; }
          .tf-head { margin-bottom:38px; }
          .tf-g3, .tf-g4 { grid-template-columns:1fr; }
          .tf-btn { width:100%; }
          .tf-tbl th, .tf-tbl td { padding:12px 14px; font-size:12px; }
          .tf-quote-band { padding:22px 20px; }
        }
      `}</style>

      <section className="view active">

        {/* ================= HERO ================= */}
        <div style={{
          background: `linear-gradient(180deg, ${BG2} 0%, ${BG} 100%)`,
          padding: '90px 22px 100px', textAlign: 'center',
        }}>
          <div style={{ maxWidth: 920, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 15px', borderRadius: 24,
              background: GSOFT, border: `1px solid ${GBORD}`,
              color: GOLD, fontSize: 11, fontWeight: 800,
              letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 22,
            }}>
              MyTradeApp · Built by Tonnyfx
            </div>
            <h1 style={{
              fontSize: 'clamp(32px, 7vw, 72px)', lineHeight: 1.05, fontWeight: 900,
              letterSpacing: '-2px', color: TXT, margin: '0 0 22px',
            }}>
              Master Forex Trading<br />with <span style={{ color: GOLD }}>Tonnyfx</span>
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 18px)', lineHeight: 1.6, color: TXT2,
              maxWidth: 660, margin: '0 auto 34px',
            }}>
              Learn, trade and grow with proven strategies and real results.
              MyTradeApp is the third-party terminal I built for EUR/USD, BTC/USD and XAU/USD —
              bots, calculators and risk tools in one place.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 34 }}>
              <button className="tf-btn tf-btn-gold" onClick={() => go('bots')}>Join MyTradeApp →</button>
              <button className="tf-btn tf-btn-outline" onClick={() => go('lot')}>Create Trading Account</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', color: TXT2, fontSize: 13.5 }}>
              <span>✓ 3,200+ Traders</span>
              <span>✓ Verified Results</span>
              <span>✓ 24/7 Support</span>
            </div>
          </div>
        </div>

        {/* ================= ABOUT / BIO ================= */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">About</div>
              <h2 className="tf-h2">Hi, I'm <span className="g">Tonny</span>.</h2>
              <p className="tf-sub">Trader · System Builder · Creator of MyTradeApp</p>
            </div>

            <div className="tf-g2" style={{ alignItems: 'center' }}>
              <div style={{
                borderRadius: 18, padding: 4,
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD2}, transparent)`,
              }}>
                <img
                  src={tonnyPhoto}
                  alt="Tonny — founder of MyTradeApp"
                  style={{
                    display: 'block', width: '100%', aspectRatio: '1 / 1',
                    objectFit: 'cover', borderRadius: 14, background: CARD,
                  }}
                />
              </div>
              <div>
                <p style={{ fontSize: 14.5, lineHeight: 1.85, color: TXT2, margin: '0 0 16px' }}>
                  I've spent the last decade in front of charts — first losing money like most retail
                  traders, then slowly building the discipline and systems that turned it around. My
                  first live account had $500 in it and I blew it in three months. That loss taught me
                  more than any course ever could.
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.85, color: TXT2, margin: '0 0 16px' }}>
                  <strong style={{ color: TXT }}>Most people don't fail because they picked the wrong direction.</strong>{' '}
                  They fail because they sized the trade wrong, risked too much, and had no rules.
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.85, color: TXT2, margin: '0 0 24px' }}>
                  MyTradeApp is the toolset I wish I'd had at the start — automation for EUR/USD,
                  BTC/USD and XAU/USD, a proper lot size calculator, a currency strength meter, and a
                  risk manager that stops you before you stop yourself.
                </p>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontStyle: 'italic', color: GOLD, marginBottom: 26 }}>
                  — Tonny
                </div>
                <div className="tf-g4" style={{ paddingTop: 24, borderTop: `1px solid ${BORD}` }}>
                  {[
                    ['10+',  'Years trading'],
                    ['3',    'Core markets'],
                    ['6+',   'Live bots'],
                    ['3.2k', 'Active traders'],
                  ].map(([n, l]) => (
                    <div key={l}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 800, color: GOLD, letterSpacing: '-1px', lineHeight: 1 }}>{n}</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: TXT3, marginTop: 8 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Our Services</div>
              <h2 className="tf-h2">What <span className="g">MyTradeApp</span> provides</h2>
              <p className="tf-sub">From free tools to fully automated bots and 1-on-1 coaching — everything a retail trader actually needs.</p>
            </div>
            <div className="tf-g4">
              {SERVICES.map((s) => (
                <div key={s.k} className="tf-card" style={{ cursor: 'pointer' }} onClick={() => go(s.k)}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 11,
                    display: 'grid', placeItems: 'center',
                    background: GSOFT, border: `1px solid ${GBORD}`,
                    color: GOLD, fontSize: 18, fontWeight: 900, marginBottom: 16,
                  }}>◆</div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: TXT, margin: '0 0 9px', letterSpacing: '-.2px' }}>{s.t}</h3>
                  <p style={{ fontSize: 12.5, lineHeight: 1.6, color: TXT2, margin: '0 0 16px', minHeight: 60 }}>{s.d}</p>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: .4 }}>{s.c} →</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= MARKETS ================= */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Markets</div>
              <h2 className="tf-h2">Three instruments. <span className="g">Total mastery.</span></h2>
              <p className="tf-sub">We trade a tiny universe so every bot, every calculator and every risk rule is tuned to the exact behaviour of that market.</p>
            </div>

            <div className="tf-g3" style={{ marginBottom: 22 }}>
              {MARKETS.map((mk, i) => {
                const price = priceOf(mk.sym);
                const chg = chgOf(mk.sym);
                const up = chg >= 0;
                return (
                  <div
                    key={mk.sym}
                    onClick={() => setTab(i)}
                    className="tf-card"
                    style={{
                      cursor: 'pointer',
                      borderColor: i === tab ? GOLD : BORD,
                      background: i === tab ? CARD2 : CARD,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 11,
                        display: 'grid', placeItems: 'center',
                        background: GSOFT, border: `1px solid ${GBORD}`,
                        color: GOLD, fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11, fontWeight: 800,
                      }}>{mk.label.split('/')[0]}</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: TXT }}>{mk.label}</div>
                        <div style={{ fontSize: 11, color: TXT3, marginTop: 2 }}>{mk.name}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: TXT, marginBottom: 6 }}>
                      {price ? fmtPrice(mk.sym, price) : '—'}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: up ? GRN : RED }}>
                      {up ? '▲' : '▼'} {up ? '+' : ''}{fmt(chg, 2)}%
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="tf-card" style={{ padding: '28px 26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: TXT, letterSpacing: '-.5px', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 12.5, color: TXT3 }}>{m.name}</div>
                </div>
                <div style={{ display: 'flex', gap: 22 }}>
                  {[['Spread', m.spread], ['ATR (D1)', m.atr], ['Volatility', m.vol]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: TXT3 }}>{k}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, fontWeight: 800, color: TXT, marginTop: 5 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, color: TXT2, margin: '0 0 20px', maxWidth: 640 }}>{m.desc}</p>
              <button className="tf-btn tf-btn-gold" onClick={() => onTrade && onTrade(m.sym)}>Trade {m.label} →</button>
            </div>
          </div>
        </div>

        {/* ================= BOTS ================= */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Automation</div>
              <h2 className="tf-h2">Trading bots, tuned <span className="g">one market each</span></h2>
              <p className="tf-sub">Every strategy is built for a single instrument. No generic multi-asset logic — just focused systems with transparent performance.</p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 22 }}>
              {['All', 'EUR/USD', 'BTC/USD', 'XAU/USD'].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  style={{
                    padding: '9px 18px', borderRadius: 22,
                    border: `1px solid ${filter === c ? GOLD : BORD}`,
                    background: filter === c ? GSOFT : 'transparent',
                    color: filter === c ? GOLD : TXT2,
                    fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {c}
                  <span style={{ opacity: .6, marginLeft: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5 }}>
                    {c === 'All' ? BOTS.length : BOTS.filter((b) => b.m === c).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="tf-g3">
              {filtered.map((b) => (
                <div key={b.n} className="tf-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 15.5, fontWeight: 800, color: TXT }}>{b.n}</div>
                      <div style={{ fontSize: 11, color: TXT3, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{b.m} · {b.tf}</div>
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: 1,
                      padding: '5px 9px', borderRadius: 6,
                      background: 'rgba(34,197,94,.1)', color: GRN,
                      border: '1px solid rgba(34,197,94,.28)',
                    }}>● LIVE</span>
                  </div>
                  <div className="tf-g2" style={{ gap: 10, marginBottom: 16 }}>
                    {[
                      ['Win rate', `${b.w}%`, GRN],
                      ['Trades', b.tr.toLocaleString(), TXT],
                      ['Max DD', `-${b.dd}%`, RED],
                      ['Profit factor', b.pf, GOLD],
                    ].map(([k, v, c]) => (
                      <div key={k} style={{ padding: '10px 12px', borderRadius: 10, background: BG2, border: `1px solid ${BORD}` }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: TXT3 }}>{k}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 800, marginTop: 5, color: c }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 5, borderRadius: 4, background: BORD, marginBottom: 18, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${b.w}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})` }} />
                  </div>
                  <button
                    onClick={() => go('bots')}
                    style={{
                      width: '100%', padding: 11, borderRadius: 9, background: 'transparent',
                      border: `1.5px solid ${GBORD}`, color: GOLD,
                      fontFamily: 'inherit', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                    }}
                  >Configure bot</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CALCULATOR ================= */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Free Tools</div>
              <h2 className="tf-h2">Size every trade. <span className="g">Protect every account.</span></h2>
              <p className="tf-sub">Two tools that do more for your account than any indicator ever will.</p>
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto' }} className="tf-card">
              <h3 style={{ fontSize: 19, fontWeight: 800, color: TXT, margin: '0 0 4px', letterSpacing: '-.5px' }}>Lot Size Calculator</h3>
              <p style={{ fontSize: 12, color: TXT3, margin: '0 0 24px' }}>EUR/USD standard lot · pip value $10</p>

              {[
                { l:'Account balance ($)', v:bal,  min:100, max:100000, step:100,  set:setBal,  disp:`$${bal.toLocaleString()}`, warn:false },
                { l:'Risk per trade (%)',  v:risk, min:0.1, max:5,      step:0.1,  set:setRisk, disp:`${risk}%`, warn:risk > 2 },
                { l:'Stop-loss (pips)',    v:sl,   min:5,   max:200,    step:1,    set:setSl,   disp:`${sl} pips`, warn:false },
              ].map((f, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: TXT3 }}>{f.l}</label>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: f.warn ? RED : GOLD }}>{f.disp}</span>
                  </div>
                  <input
                    type="range" min={f.min} max={f.max} step={f.step} value={f.v}
                    onChange={(e) => f.set(Number(e.target.value))}
                    style={{ width: '100%', accentColor: f.warn ? RED : GOLD }}
                  />
                </div>
              ))}

              <div style={{
                padding: 20, borderRadius: 12, background: GSOFT, border: `1px solid ${GBORD}`,
                display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: TXT3 }}>Position size</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: GOLD, lineHeight: 1, marginTop: 6 }}>{lots.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: TXT2, marginTop: 4 }}>standard lots</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: TXT3 }}>Risk amount</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: TXT, lineHeight: 1, marginTop: 6 }}>${riskAmt.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: TXT2, marginTop: 4 }}>at {risk}% risk</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= HOW IT WORKS ================= */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">How it works</div>
              <h2 className="tf-h2">From sign-up to <span className="g">automated</span> in four steps</h2>
            </div>
            <div className="tf-g4">
              {[
                { n:'01', t:'Create your account', d:'Sign up in under a minute. No broker lock-in — connect any supported MT4/MT5 or crypto venue.' },
                { n:'02', t:'Size your risk',      d:'Run the calculator, set your risk %, and let the risk manager cap your daily exposure.' },
                { n:'03', t:'Switch on a bot',     d:'Pick a strategy for EUR/USD, BTC/USD or XAU/USD and let it execute while you watch.' },
                { n:'04', t:'Review & refine',     d:'Every trade lands in your journal with expectancy stats, so next week is sharper than the last.' },
              ].map((s) => (
                <div key={s.n} className="tf-card">
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 34, fontWeight: 900, letterSpacing: -2, color: GOLD, lineHeight: 1, marginBottom: 16 }}>{s.n}</div>
                  <h4 style={{ fontSize: 14.5, fontWeight: 800, color: TXT, margin: '0 0 9px' }}>{s.t}</h4>
                  <p style={{ fontSize: 12.5, lineHeight: 1.65, color: TXT2, margin: 0 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= FOREX BASICS ================= */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Forex 101</div>
              <h2 className="tf-h2">Everything a new trader <span className="g">needs to know</span></h2>
              <p className="tf-sub">Straight answers to the questions every retail trader asks in their first month.</p>
            </div>
            <div className="tf-g2">
              {BASICS.map((b) => (
                <div key={b.t} className="tf-card" style={{ padding: '24px 26px' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: TXT, margin: '0 0 8px' }}>{b.t}</h4>
                  <p style={{ fontSize: 12.5, lineHeight: 1.7, color: TXT2, margin: 0 }}>{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= SESSIONS ================= */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Market clock</div>
              <h2 className="tf-h2">The four <span className="g">forex sessions</span></h2>
              <p className="tf-sub">Know when the market moves — timing matters as much as direction.</p>
            </div>
            <div className="tf-g4">
              {SESSIONS.map((s) => (
                <div key={s.n} className="tf-card" style={{ borderLeft: `3px solid ${s.c}`, paddingLeft: 22 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: TXT, marginBottom: 6 }}>{s.n}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 700, color: s.c, marginBottom: 10 }}>{s.h}</div>
                  <div style={{ fontSize: 11.5, lineHeight: 1.6, color: TXT2 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= PIP TABLE ================= */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Reference</div>
              <h2 className="tf-h2">Pip value <span className="g">cheat-sheet</span></h2>
              <p className="tf-sub">What one pip is worth per lot size, for the instruments you actually trade.</p>
            </div>
            <div style={{ borderRadius: 14, border: `1px solid ${BORD}`, background: CARD, overflow: 'hidden' }}>
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
                  {PIPS.map((r) => (
                    <tr key={r.p}>
                      <td><strong style={{ color: TXT }}>{r.p}</strong></td>
                      <td className="r num">{r.pip}</td>
                      <td className="r num">{r.s}</td>
                      <td className="r num">{r.m}</td>
                      <td className="r num">{r.mi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= STRATEGIES ================= */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Strategy library</div>
              <h2 className="tf-h2">Four strategies, <span className="g">explained simply</span></h2>
              <p className="tf-sub">The playbooks behind our bots — written so a beginner can follow.</p>
            </div>
            <div className="tf-g2">
              {STRATS.map((s) => (
                <div key={s.n} className="tf-card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: TXT, margin: 0 }}>{s.n}</h4>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                      color: GOLD, padding: '4px 8px', borderRadius: 5, background: GSOFT,
                    }}>{s.m} · {s.tf}</span>
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.7, color: TXT2, margin: 0 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= EVENTS ================= */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">This week</div>
              <h2 className="tf-h2">High-impact <span className="g">events to watch</span></h2>
              <p className="tf-sub">Filtered for EUR/USD, BTC/USD and XAU/USD. Volatility clusters around these releases.</p>
            </div>
            <div style={{ borderRadius: 14, border: `1px solid ${BORD}`, background: CARD, overflow: 'hidden' }}>
              {EVENTS.map((e, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 70px 1fr auto',
                  gap: 14, alignItems: 'center', padding: '16px 22px',
                  borderBottom: i === EVENTS.length - 1 ? 'none' : `1px solid ${BORD}`,
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, letterSpacing: 1, color: GOLD }}>{e.d}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: TXT2 }}>{e.t}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TXT }}>{e.e}</div>
                  <div style={{
                    fontSize: 9.5, fontWeight: 800, letterSpacing: .9, textTransform: 'uppercase',
                    padding: '5px 10px', borderRadius: 6,
                    background: e.i === 'Very High' ? 'rgba(239,68,68,.12)' : e.i === 'High' ? 'rgba(245,165,36,.12)' : 'rgba(59,130,246,.12)',
                    color: e.i === 'Very High' ? RED : e.i === 'High' ? '#f5a524' : '#3b82f6',
                  }}>{e.i}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= GLOSSARY ================= */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Glossary</div>
              <h2 className="tf-h2">Forex terms, <span className="g">defined plainly</span></h2>
            </div>
            <div className="tf-g2">
              {GLOSS.map((g) => (
                <div key={g.k} style={{
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  padding: '16px 18px', borderRadius: 12,
                  border: `1px solid ${BORD}`, background: CARD,
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, fontWeight: 800, color: GOLD,
                    minWidth: 100, paddingTop: 2,
                  }}>{g.k}</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.65, color: TXT2 }}>{g.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= JOURNEY / TIMELINE ================= */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Journey</div>
              <h2 className="tf-h2">The road to <span className="g">MyTradeApp</span></h2>
              <p className="tf-sub">A decade of trading, losing, learning and rebuilding — written down honestly.</p>
            </div>
            <div className="tf-timeline">
              {[
                { y:'2014', t:'First live account',     d:'Opened with $500. Lost most of it in three months. That loss became the foundation for everything I built afterward.' },
                { y:'2016', t:'Full-time trader',       d:'Left the day job after 18 months of consistent profitability. Focused entirely on EUR/USD and risk management.' },
                { y:'2018', t:'Built my first bot',     d:'A simple M5 scalper for EUR/USD that ran overnight. Not profitable yet, but it never skipped a session.' },
                { y:'2020', t:'Added gold and crypto',  d:'Extended the framework to XAU/USD and BTC/USD. Same risk rules — three very different animals.' },
                { y:'2023', t:'MyTradeApp is born',     d:'Packaged the tools I built for myself into one terminal. Third-party, broker-agnostic, focused on what actually moves the needle.' },
                { y:'2025', t:'A community of traders', d:'Thousands of retail traders now use MyTradeApp every week. Same tools, same discipline, no hype.' },
              ].map((t) => (
                <div className="tf-tl" key={t.y}>
                  <div className="y">{t.y}</div>
                  <h6>{t.t}</h6>
                  <p>{t.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= PRICING ================= */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">Pricing</div>
              <h2 className="tf-h2">Simple plans. <span className="g">No lock-in.</span></h2>
              <p className="tf-sub">Start free, upgrade when you are ready to run live bots.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
              <div style={{
                display: 'inline-flex', padding: 4, borderRadius: 12,
                background: CARD2, border: `1px solid ${BORD}`,
              }}>
                {['Monthly', 'Annual · save 17%'].map((l, i) => (
                  <button
                    key={l}
                    onClick={() => setAnnual(i === 1)}
                    style={{
                      padding: '10px 20px', borderRadius: 9, border: 'none',
                      background: (annual ? i === 1 : i === 0) ? GOLD : 'transparent',
                      color: (annual ? i === 1 : i === 0) ? '#0a0a0a' : TXT2,
                      fontFamily: 'inherit', fontSize: 12.5, fontWeight: 800, cursor: 'pointer',
                    }}
                  >{l}</button>
                ))}
              </div>
            </div>

            <div className="tf-g3">
              {PLANS.map((p) => {
                const price = annual
                  ? (p.p === 'Free' ? 'Free' : p.p === '$29' ? '$290' : '$790')
                  : p.p;
                return (
                  <div key={p.n} style={{
                    position: 'relative', padding: '32px 28px 28px', borderRadius: 18,
                    border: `1px solid ${p.hl ? GOLD : BORD}`,
                    background: p.hl ? CARD2 : CARD,
                  }}>
                    {p.hl && (
                      <span style={{
                        position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                        padding: '6px 16px', borderRadius: 22,
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
                        color: '#0a0a0a', fontSize: 9.5, fontWeight: 900,
                        letterSpacing: 1.2, textTransform: 'uppercase',
                      }}>Most popular</span>
                    )}
                    <h4 style={{ fontSize: 14, fontWeight: 800, letterSpacing: .7, textTransform: 'uppercase', color: GOLD, margin: '0 0 14px' }}>{p.n}</h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 38, fontWeight: 800, letterSpacing: '-1.6px', color: TXT, lineHeight: 1 }}>{price}</span>
                      <span style={{ fontSize: 12.5, color: TXT3, fontWeight: 600 }}>{annual && p.p !== 'Free' ? '/ year' : p.per}</span>
                    </div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.65, color: TXT2, marginBottom: 22, minHeight: 42 }}>{p.d}</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {p.f.map((f) => (
                        <li key={f} style={{ display: 'flex', gap: 10, fontSize: 12.5, lineHeight: 1.5, color: TXT2 }}>
                          <span style={{ color: GOLD, fontWeight: 900 }}>✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => go('bots')}
                      className={p.hl ? 'tf-btn tf-btn-gold' : 'tf-btn tf-btn-outline'}
                      style={{ width: '100%', padding: 13 }}
                    >{p.p === 'Free' ? 'Start free' : `Choose ${p.n}`}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= QUOTE ================= */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div className="tf-quote-band">
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 48, lineHeight: .55, color: GOLD, opacity: .5 }}>“</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: TXT, lineHeight: 1.5, marginBottom: 14 }}>{QUOTES[q]}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {QUOTES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setQ(i)}
                      aria-label={`Quote ${i + 1}`}
                      style={{
                        width: i === q ? 22 : 8, height: 8, borderRadius: 4,
                        background: i === q ? GOLD : BORD,
                        border: 'none', cursor: 'pointer', padding: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FAQ ================= */}
        <div className="tf-sec tf-alt">
          <div className="tf-wrap">
            <div className="tf-head">
              <div className="tf-eye">FAQ</div>
              <h2 className="tf-h2">Questions traders <span className="g">ask first</span></h2>
            </div>
            <div className="tf-g2">
              {FAQS.map((f, i) => {
                const open = faq === i;
                return (
                  <div key={f.q} style={{
                    borderRadius: 14, border: `1px solid ${open ? GBORD : BORD}`,
                    background: CARD, overflow: 'hidden',
                  }}>
                    <button
                      onClick={() => setFaq(open ? null : i)}
                      style={{
                        width: '100%', padding: '18px 22px',
                        background: 'transparent', border: 'none',
                        display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer', textAlign: 'left',
                        fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700,
                        color: open ? GOLD : TXT,
                      }}
                    >
                      <span style={{ flex: 1 }}>{f.q}</span>
                      <span style={{ fontSize: 18, color: GOLD, lineHeight: 1 }}>{open ? '−' : '+'}</span>
                    </button>
                    {open && (
                      <div style={{ padding: '0 22px 20px', fontSize: 13, lineHeight: 1.75, color: TXT2 }}>
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= FINAL CTA ================= */}
        <div className="tf-sec">
          <div className="tf-wrap">
            <div style={{
              maxWidth: 780, margin: '0 auto', textAlign: 'center',
              padding: '60px 30px', borderRadius: 22,
              border: `1px solid ${GBORD}`, background: CARD,
            }}>
              <h2 style={{
                fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 900,
                letterSpacing: '-1.5px', color: TXT, margin: '0 0 16px', lineHeight: 1.1,
              }}>
                Ready to trade with <span style={{ color: GOLD }}>an edge</span>?
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: TXT2, maxWidth: 560, margin: '0 auto 30px' }}>
                Start with the free tools, then let a bot handle the execution. No broker lock-in,
                no hidden promises — just a better way to trade EUR/USD, BTC/USD and XAU/USD.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button className="tf-btn tf-btn-gold" onClick={() => go('bots')}>Join MyTradeApp →</button>
                <button className="tf-btn tf-btn-outline" onClick={() => go('strength')}>Check Currency Strength</button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= NOTICE ================= */}
        <div style={{ padding: '0 22px 70px' }}>
          <div className="tf-wrap">
            <div className="tf-notice">
              <span style={{ color: GOLD, fontWeight: 900, flexShrink: 0 }}>ⓘ</span>
              <span style={{ fontSize: 12.5, lineHeight: 1.7, color: TXT2 }}>
                MyTradeApp is a third-party analytics and automation platform created by Tonny
                (Tonnyfx) — not a broker or investment advisor. All performance figures shown are
                simulated and for illustration only. Trading forex, crypto and metals carries
                significant risk of loss. Never risk capital you cannot afford to lose.
              </span>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}