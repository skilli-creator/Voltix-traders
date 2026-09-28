import { useState, useEffect, useCallback, useMemo } from 'react';
import ForexTopbar from '../components/forextopbar';
import ForexHome from '../components/forexhome';
import LotSize from '../components/lotsize';
import Strength from '../components/strength';
import ForexBots from '../components/forexbots';
import '../styles.css';

/* =========================================================
   SHARED CONSTANTS
   ========================================================= */
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'NZD', 'CAD'];

export const CUR_NAMES = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
  CHF: 'Swiss Franc', AUD: 'Australian Dollar', NZD: 'New Zealand Dollar',
  CAD: 'Canadian Dollar', XAU: 'Gold',
};

export const BASE_USD = {
  USD: 1, EUR: 1.0850, GBP: 1.2650, JPY: 1 / 149.5, CHF: 1 / 0.885,
  AUD: 0.655, NZD: 0.605, CAD: 1 / 1.355,
};

export const PAIRS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
  'EURJPY', 'GBPJPY', 'EURGBP', 'AUDJPY', 'EURCHF', 'GBPAUD', 'NZDJPY',
  'CADJPY', 'CHFJPY',
];

export const INSTRUMENTS = [...PAIRS, 'XAUUSD'];
export const WATCHLIST = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD', 'XAUUSD'];

/* =========================================================
   SHARED HELPERS
   ========================================================= */
export const fmt = (n, d = 2) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const fmtMoney = (n) => (n < 0 ? '-$' : '$') + fmt(Math.abs(n), 2);

export const fmtPrice = (sym, p) => {
  const q = sym.slice(3, 6);
  const d = sym === 'XAUUSD' ? 2 : q === 'JPY' ? 3 : 5;
  return fmt(p, d);
};

export const pipSizeOf = (sym) => (sym.slice(3, 6) === 'JPY' ? 0.01 : 0.0001);
export const contractOf = (sym) => (sym === 'XAUUSD' ? 100 : 100000);

export const usdValueOf = (currency, strength) => {
  if (currency === 'USD') return 1;
  return (BASE_USD[currency] || 1) * (strength[currency] || 1);
};

export const priceOf = (sym, strength) => {
  const b = sym.slice(0, 3);
  const q = sym.slice(3, 6);
  return (BASE_USD[b] * strength[b]) / (BASE_USD[q] * strength[q]);
};

export const pipValueUSD = (sym, lots, strength) => {
  const q = sym.slice(3, 6);
  return pipSizeOf(sym) * contractOf(sym) * lots * usdValueOf(q, strength);
};

export const currencyStrength = (strength) => {
  const raw = {};
  let logSum = 0;
  for (const c of CURRENCIES) {
    raw[c] = strength[c];
    logSum += Math.log(strength[c]);
  }
  const geo = Math.exp(logSum / CURRENCIES.length);
  const out = {};
  for (const c of CURRENCIES) out[c] = (raw[c] / geo - 1) * 100;
  return out;
};

export const positionPL = (p, pairs, strength) => {
  const price = pairs[p.sym].price;
  const dir = p.side === 'buy' ? 1 : -1;
  const pips = ((price - p.entry) / pipSizeOf(p.sym)) * dir;
  return pips * pipValueUSD(p.sym, p.lots, strength);
};

export const totalPL = (positions, pairs, strength) =>
  positions.reduce((s, p) => s + positionPL(p, pairs, strength), 0);

/* =========================================================
   SHARED UI PRIMITIVES
   ========================================================= */
export const Sparkline = ({ values, w = 100, h = 30, color = '#00d68f' }) => {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - 3 - ((v - min) / range) * (h - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6"
        vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

export const AreaChart = ({ values, w, h, color, id }) => {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 8;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const line = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2"
        vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

export const StatCard = ({ label, value, sub, accent, icon, valueClass = '' }) => (
  <div className="stat-card" style={{ '--accent-line': accent }}>
    <div className="stat-top">
      <span className="stat-label">{label}</span>
      {icon && <div className="stat-icon">{icon}</div>}
    </div>
    <div className={`stat-value ${valueClass}`}>{value}</div>
    <div className="stat-foot">{sub}</div>
  </div>
);

/* =========================================================
   INITIAL DATA CREATORS
   ========================================================= */
const createInitialStrength = () => {
  const init = {};
  CURRENCIES.forEach((c) => (init[c] = 1));
  return init;
};

const createInitialPairs = (strength) => {
  const init = {};
  INSTRUMENTS.forEach((sym) => {
    const base = sym === 'XAUUSD' ? 2035.4 : priceOf(sym, strength);
    const hist = [];
    let v = base * (1 - (Math.random() - 0.5) * 0.006);
    for (let i = 0; i < 60; i++) {
      v *= 1 + (Math.random() - 0.5) * 0.0016;
      hist.push(v);
    }
    hist[hist.length - 1] = base;
    init[sym] = { open: hist[0], price: base, history: hist };
  });
  return init;
};

const createInitialBots = () => {
  const bots = [
    { id: 'trend', name: 'TrendRider', tag: 'Trend Following', sym: 'EURUSD', tf: 'H1', color: '#00d68f', on: true, winRate: 64.2, trades: 412, pnl: 4820.55, dd: '6.4%' },
    { id: 'grid', name: 'GridMaster', tag: 'Grid / DCA', sym: 'GBPUSD', tf: 'M15', color: '#3b82f6', on: true, winRate: 78.9, trades: 1284, pnl: 3115.2, dd: '12.1%' },
    { id: 'scalp', name: 'ScalperX', tag: 'High Frequency', sym: 'USDJPY', tf: 'M5', color: '#f5a524', on: false, winRate: 58.3, trades: 3902, pnl: 1740.8, dd: '9.7%' },
    { id: 'mean', name: 'MeanRev Pro', tag: 'Mean Reversion', sym: 'AUDUSD', tf: 'H4', color: '#a855f7', on: true, winRate: 61.5, trades: 286, pnl: -620.4, dd: '15.3%' },
    { id: 'news', name: 'NewsHunter', tag: 'Breakout', sym: 'XAUUSD', tf: 'M30', color: '#ec4899', on: false, winRate: 52.7, trades: 174, pnl: 2260.1, dd: '18.6%' },
  ];
  bots.forEach((b) => {
    b.history = [];
    let v = b.pnl * 0.35;
    for (let i = 0; i < 60; i++) {
      v += (Math.random() - 0.47) * Math.abs(b.pnl) * 0.05 + b.pnl * 0.011;
      b.history.push(v);
    }
    b.history[b.history.length - 1] = b.pnl;
  });
  return bots;
};

const createInitialEquityHistory = (balance) => {
  const hist = [];
  let eq = balance;
  for (let i = 0; i < 70; i++) {
    eq += (Math.random() - 0.48) * 55;
    hist.push(eq);
  }
  return hist;
};

/* =========================================================
   MAIN PAGE
   ========================================================= */
const PAGE_META = {
  home: ['Dashboard', 'Live market overview & account summary'],
  lot: ['Lot Size Calculator', 'Risk-based position sizing across all instruments'],
  strength: ['Currency Strength Meter', 'Relative strength of the 8 major currencies'],
  bots: ['Trading Bots', 'Automated strategies running on your account'],
};

export default function ForexDash() {
  const [view, setView] = useState('home');
  const [strength, setStrength] = useState(createInitialStrength);
  const [pairs, setPairs] = useState(() => createInitialPairs(strength));
  const [account] = useState({ balance: 25000, currency: 'USD' });
  const [positions, setPositions] = useState([
    { sym: 'EURUSD', side: 'buy', lots: 0.5, entry: 1.0821 },
    { sym: 'GBPJPY', side: 'sell', lots: 0.2, entry: 189.45 },
    { sym: 'XAUUSD', side: 'buy', lots: 0.1, entry: 2028.4 },
  ]);
  const [equityHistory, setEquityHistory] = useState(() => createInitialEquityHistory(25000));
  const [bots, setBots] = useState(createInitialBots);
  const [selectedPair, setSelectedPair] = useState('EURUSD');

  const onTrade = useCallback((sym) => {
    setSelectedPair(sym);
    setView('lot');
  }, []);

  const onClosePosition = useCallback((index) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onToggleBot = useCallback((id) => {
    setBots((prev) => prev.map((b) => (b.id === id ? { ...b, on: !b.on } : b)));
  }, []);

  // Market simulation — strength
  useEffect(() => {
    const id = setInterval(() => {
      setStrength((prev) => {
        const next = { ...prev };
        for (const c of CURRENCIES) {
          next[c] = prev[c] * (1 + (Math.random() - 0.5) * 0.001) + (1 - prev[c]) * 0.0015;
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Reprice instruments when strength changes
  useEffect(() => {
    setPairs((prev) => {
      const next = { ...prev };
      for (const sym of PAIRS) {
        const p = prev[sym];
        const newPrice = priceOf(sym, strength);
        const history = [...p.history, newPrice];
        if (history.length > 80) history.shift();
        next[sym] = { ...p, price: newPrice, history };
      }
      const g = prev.XAUUSD;
      const newGold = g.price * (1 + (Math.random() - 0.5) * 0.0016 + (1 - g.price / 2035.4) * 0.0004);
      const goldHist = [...g.history, newGold];
      if (goldHist.length > 80) goldHist.shift();
      next.XAUUSD = { ...g, price: newGold, history: goldHist };
      return next;
    });
  }, [strength]);

  // Track equity history
  useEffect(() => {
    const pl = totalPL(positions, pairs, strength);
    const equity = account.balance + pl;
    setEquityHistory((prev) => {
      const next = [...prev, equity];
      if (next.length > 90) next.shift();
      return next;
    });
  }, [positions, pairs, strength, account.balance]);

  // Simulate bot performance
  useEffect(() => {
    const id = setInterval(() => {
      setBots((prev) =>
        prev.map((b) => {
          if (!b.on) return b;
          const newPnl = b.pnl + (Math.random() - 0.44) * 14;
          const newTrades = b.trades + (Math.random() < 0.14 ? 1 : 0);
          const history = [...b.history, newPnl];
          if (history.length > 80) history.shift();
          return { ...b, pnl: newPnl, trades: newTrades, history };
        })
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const meta = PAGE_META[view] || PAGE_META.home;
  const equity = account.balance + totalPL(positions, pairs, strength);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: <svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.6V20h13V9.6" /><path d="M9.5 20v-5h5v5" /></svg> },
    { id: 'lot', label: 'Lot Calculator', icon: <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2.5" /><path d="M8 7.5h8" /><path d="M8 12h1.5M12 12h1.5M16 12h.01M8 16h1.5M12 16h1.5M16 16h.01" /></svg> },
    { id: 'strength', label: 'Strength Meter', icon: <svg viewBox="0 0 24 24"><path d="M5 20v-8" /><path d="M12 20V4" /><path d="M19 20v-5" /></svg> },
    { id: 'bots', label: 'Bots', badge: bots.length, icon: <svg viewBox="0 0 24 24"><rect x="3.5" y="7.5" width="17" height="12" rx="3.5" /><path d="M12 7.5V4" /><circle cx="12" cy="3.4" r="1" /><path d="M9 13h.01M15 13h.01" /><path d="M9.5 16.5h5" /></svg> },
  ];

  return (
    <div className="app">
      {/* ---------- Sidebar ---------- */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="#04150f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l5-6 4 4 8-9" />
              <path d="M15 6h5v5" />
            </svg>
          </div>
          <div className="brand-text">
            <b>NovaFX</b>
            <span>Terminal</span>
          </div>
        </div>

        <nav className="nav">
          <div className="nav-label">Trading</div>
          {navItems.filter((i) => i.id !== 'bots').map((item) => (
            <button key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <div className="nav-label">Automation</div>
          {navItems.filter((i) => i.id === 'bots').map((item) => (
            <button key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}>
              {item.icon}
              <span>{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="side-foot">
          <div className="user-card">
            <div className="avatar">AK</div>
            <div className="user-meta">
              <b>Alex Kim</b>
              <span>Pro Account</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <div className="main">
        <ForexTopbar title={meta[0]} subtitle={meta[1]} equity={equity} />

        <div className="content">
          {view === 'home' && (
            <ForexHome
              pairs={pairs}
              positions={positions}
              account={account}
              equityHistory={equityHistory}
              strength={strength}
              onTrade={onTrade}
              onClosePosition={onClosePosition}
              onViewChange={setView}
            />
          )}
          {view === 'lot' && (
            <LotSize pairs={pairs} strength={strength} initialPair={selectedPair} />
          )}
          {view === 'strength' && <Strength strength={strength} />}
          {view === 'bots' && <ForexBots bots={bots} onToggleBot={onToggleBot} />}
        </div>
      </div>
    </div>
  );
}