// src/pages/forexdash.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopPanel from '../components/TopBar';
import ForexHome from '../components/forexhome';
import LotSize from '../components/lotsize';
import Strength from '../components/strength';
import ForexBots from '../components/forexbots';

/* =========================================================
   SHARED CONSTANTS (exported for components)
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
   SHARED HELPERS (exported for components)
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
   SHARED UI PRIMITIVES (exported for components)
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
   INTERNAL INITIAL DATA CREATORS
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
    { id: 'trend', name: 'TrendRider', tag: 'Trend Following', sym: 'EURUSD', tf: 'H1', color: '#00d68f', on: true,  winRate: 64.2, trades: 412,  pnl: 4820.55, dd: '6.4%'  },
    { id: 'grid',  name: 'GridMaster', tag: 'Grid / DCA',      sym: 'GBPUSD', tf: 'M15',color: '#3b82f6', on: true,  winRate: 78.9, trades: 1284, pnl: 3115.20, dd: '12.1%' },
    { id: 'scalp', name: 'ScalperX',   tag: 'High Frequency',  sym: 'USDJPY', tf: 'M5', color: '#f5a524', on: false, winRate: 58.3, trades: 3902, pnl: 1740.80, dd: '9.7%'  },
    { id: 'mean',  name: 'MeanRev Pro',tag: 'Mean Reversion',  sym: 'AUDUSD', tf: 'H4', color: '#a855f7', on: true,  winRate: 61.5, trades: 286,  pnl: -620.40, dd: '15.3%' },
    { id: 'news',  name: 'NewsHunter', tag: 'Breakout',        sym: 'XAUUSD', tf: 'M30',color: '#ec4899', on: false, winRate: 52.7, trades: 174,  pnl: 2260.10, dd: '18.6%' },
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
   VIEW META
   ========================================================= */
const VIEW_META = {
  home:     ['Dashboard',               'Live market overview & account summary'],
  lot:      ['Lot Size Calculator',     'Risk-based position sizing across all instruments'],
  strength: ['Currency Strength Meter', 'Relative strength of the 8 major currencies'],
  bots:     ['Trading Bots',            'Automated strategies running on your account'],
};

/* =========================================================
   MAIN PAGE
   ========================================================= */
export default function ForexDash() {
  const { view: urlView } = useParams();
  const navigate = useNavigate();

  // Derive current view from URL — '/forexdash' = home, '/forexdash/lot' = lot, etc.
  const view = urlView && VIEW_META[urlView] ? urlView : 'home';

  const [strength, setStrength] = useState(createInitialStrength);
  const [pairs, setPairs] = useState(() => createInitialPairs(strength));
  const [account] = useState({ balance: 25000, currency: 'USD' });
  const [positions, setPositions] = useState([
    { sym: 'EURUSD', side: 'buy',  lots: 0.5, entry: 1.0821  },
    { sym: 'GBPJPY', side: 'sell', lots: 0.2, entry: 189.45  },
    { sym: 'XAUUSD', side: 'buy',  lots: 0.1, entry: 2028.4  },
  ]);
  const [equityHistory, setEquityHistory] = useState(() => createInitialEquityHistory(25000));
  const [bots, setBots] = useState(createInitialBots);
  const [selectedPair, setSelectedPair] = useState('EURUSD');

  /* ---- Market simulation: strength walk ---- */
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

  /* ---- Reprice instruments when strength changes ---- */
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

  /* ---- Equity history tracking ---- */
  useEffect(() => {
    const pl = totalPL(positions, pairs, strength);
    const equity = account.balance + pl;
    setEquityHistory((prev) => {
      const next = [...prev, equity];
      if (next.length > 90) next.shift();
      return next;
    });
  }, [positions, pairs, strength, account.balance]);

  /* ---- Bot performance simulation ---- */
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

  /* ---- Callbacks ---- */
  const onTrade = useCallback((sym) => {
    setSelectedPair(sym);
    navigate('/forexdash/lot');
  }, [navigate]);

  const onClosePosition = useCallback((index) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onToggleBot = useCallback((id) => {
    setBots((prev) => prev.map((b) => (b.id === id ? { ...b, on: !b.on } : b)));
  }, []);

  const onViewChange = useCallback((v) => {
    navigate(v === 'home' ? '/forexdash' : `/forexdash/${v}`);
  }, [navigate]);

  const equity = account.balance + totalPL(positions, pairs, strength);

  return (
    <>
      {/* ============ SHARED DASHBOARD STYLES ============ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#070c16;--panel:#0e1626;--panel2:#121c30;--panel3:#16223a;
          --border:#1d2a44;--border-soft:#16223a;
          --text:#e8eefb;--muted:#7d90b0;--dim:#5a6b88;
          --green:#00d68f;--red:#ff4d6a;--blue:#3b82f6;
          --amber:#f5a524;--purple:#a855f7;
          --radius:14px;
          --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
        }
        html,body,#root{height:100%}
        body{
          background:var(--bg);color:var(--text);
          font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
          font-size:14px;line-height:1.45;-webkit-font-smoothing:antialiased;overflow-x:hidden;
        }
        ::-webkit-scrollbar{width:9px;height:9px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1e2b45;border-radius:8px;border:2px solid var(--bg)}
        ::-webkit-scrollbar-thumb:hover{background:#2b3d5e}
        button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
        input,select{font-family:inherit}
        .pos{color:var(--green)!important}
        .neg{color:var(--red)!important}
        .muted{color:var(--muted)}
        .num{font-family:var(--mono);font-variant-numeric:tabular-nums}

        /* ---- Page shell ---- */
        .forex-page{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
        .forex-content{padding:24px 26px 60px;flex:1;max-width:1600px;margin:0 auto;width:100%}
        @media (max-width:768px){ .forex-content{padding:18px 14px 80px} }

        /* ---- Cards ---- */
        .card{background:linear-gradient(180deg,#0f1829 0%,#0d1524 100%);border:1px solid var(--border-soft);border-radius:var(--radius);overflow:hidden}
        .card-head{display:flex;align-items:center;gap:12px;padding:15px 18px;border-bottom:1px solid var(--border-soft)}
        .card-head h3{font-size:13.5px;font-weight:600;letter-spacing:-.1px}
        .card-head .spacer{flex:1}
        .tag{font-size:10.5px;font-weight:600;padding:3px 9px;border-radius:20px;background:#182338;color:var(--muted);border:1px solid var(--border)}

        /* ---- Stat cards ---- */
        .stat-card{background:linear-gradient(180deg,#0f1829 0%,#0d1524 100%);border:1px solid var(--border-soft);border-radius:var(--radius);padding:17px 18px;position:relative;overflow:hidden}
        .stat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent-line,#00d68f),transparent);opacity:.75}
        .stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}
        .stat-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.9px;font-weight:600}
        .stat-icon{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:#16223a}
        .stat-icon svg{width:14px;height:14px;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
        .stat-value{font-family:var(--mono);font-size:23px;font-weight:500;letter-spacing:-.6px;line-height:1.15}
        .stat-foot{font-size:11.5px;color:var(--dim);margin-top:6px;display:flex;align-items:center;gap:5px}
        .delta{font-weight:600;font-size:11.5px}

        /* ---- Grids ---- */
        .grid-2{display:grid;grid-template-columns:1.85fr 1fr;gap:15px;margin-bottom:18px}
        .grid-eq{display:grid;grid-template-columns:1fr;gap:15px;margin-bottom:18px}
        @media (max-width:1180px){ .grid-2{grid-template-columns:1fr} }

        /* ---- Tables ---- */
        .tbl{width:100%;border-collapse:collapse}
        .tbl th{text-align:left;font-size:10.5px;text-transform:uppercase;letter-spacing:.9px;color:var(--dim);font-weight:600;padding:11px 18px;border-bottom:1px solid var(--border-soft);white-space:nowrap}
        .tbl td{padding:11px 18px;border-bottom:1px solid rgba(22,34,58,.6);font-size:13px;white-space:nowrap}
        .tbl tbody tr{transition:.13s}
        .tbl tbody tr:hover{background:rgba(30,43,69,.35)}
        .tbl tbody tr:last-child td{border-bottom:none}
        .tbl .r{text-align:right}
        .sym-cell{display:flex;align-items:center;gap:10px}
        .sym-badge{width:34px;height:34px;border-radius:9px;flex:none;display:grid;place-items:center;font-size:10px;font-weight:700;letter-spacing:.3px;background:#16223a;color:#9fb3d1;border:1px solid var(--border)}
        .sym-name{font-weight:600;font-size:13px;letter-spacing:-.1px}
        .sym-desc{font-size:10.5px;color:var(--dim)}
        .spark{width:82px;height:28px;display:block}
        .chart{width:100%;height:100%;display:block}

        /* ---- Side tag / buttons ---- */
        .side-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.6px;padding:3px 8px;border-radius:5px}
        .side-tag.buy{background:rgba(0,214,143,.13);color:var(--green)}
        .side-tag.sell{background:rgba(255,77,106,.13);color:var(--red)}

        .btn{padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:600;transition:.16s;border:1px solid transparent}
        .btn.primary{background:var(--green);color:#04150f}
        .btn.primary:hover{background:#1ee8a3;box-shadow:0 4px 16px rgba(0,214,143,.25)}
        .btn.ghost{background:#16223a;border-color:var(--border);color:var(--muted)}
        .btn.ghost:hover{background:#1d2b47;color:var(--text)}
        .btn.sm{padding:5px 11px;font-size:11.5px;border-radius:7px}
        .btn.trade{background:#16223a;border:1px solid var(--border);color:#9fb3d1;padding:5px 12px;font-size:11.5px;border-radius:7px}
        .btn.trade:hover{background:rgba(0,214,143,.14);color:var(--green);border-color:rgba(0,214,143,.3)}
        .icon-x{color:var(--dim);font-size:16px;line-height:1;padding:2px 7px;border-radius:6px}
        .icon-x:hover{background:rgba(255,77,106,.13);color:var(--red)}

        /* ---- Strength bars ---- */
        .st-row{display:grid;grid-template-columns:44px 1fr 62px;align-items:center;gap:12px;padding:7px 18px}
        .st-cur{font-size:12px;font-weight:700;letter-spacing:.4px;color:#c3d3ea}
        .st-track{position:relative;height:22px;background:#0c1424;border-radius:6px;overflow:hidden;border:1px solid var(--border-soft)}
        .st-mid{position:absolute;left:50%;top:0;bottom:0;width:1px;background:#26364f}
        .st-bar{position:absolute;top:3px;bottom:3px;border-radius:4px;transition:width .5s cubic-bezier(.4,0,.2,1),left .5s,right .5s}
        .st-bar.pos{background:linear-gradient(90deg,rgba(0,214,143,.55),var(--green))}
        .st-bar.neg{background:linear-gradient(270deg,rgba(255,77,106,.55),var(--red))}
        .st-val{font-family:var(--mono);font-size:12px;text-align:right;font-weight:500}

        /* ---- Notice ---- */
        .notice{display:flex;align-items:center;gap:10px;margin-top:18px;padding:12px 16px;border-radius:11px;background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.18);font-size:12px;color:#8fb0e0}
        .notice svg{width:15px;height:15px;flex:none;stroke:#5f8fd6;fill:none;stroke-width:1.8;stroke-linecap:round}
        .empty{padding:36px;text-align:center;color:var(--dim);font-size:12.5px}

        /* ---- View animation ---- */
        .view{display:block;animation:fade .28s ease}
        @keyframes fade{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
      `}</style>

      <div className="forex-page">
        {/* TopBar handles the whole chrome: brand, platform switcher, nav buttons, actions */}
        <TopPanel />

        <div className="forex-content">
          {view === 'home' && (
            <ForexHome
              pairs={pairs}
              positions={positions}
              account={account}
              equityHistory={equityHistory}
              strength={strength}
              onTrade={onTrade}
              onClosePosition={onClosePosition}
              onViewChange={onViewChange}
            />
          )}
          {view === 'lot'      && <LotSize  pairs={pairs} strength={strength} initialPair={selectedPair} />}
          {view === 'strength' && <Strength strength={strength} />}
          {view === 'bots'     && <ForexBots bots={bots} onToggleBot={onToggleBot} />}
        </div>
      </div>
    </>
  );
}