// src/pages/forexdash.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import TopPanel from '../components/TopBar';
import OptionSideBar from '../components/OptionSideBar';
import ForexHome from '../components/forexhome';
import LotSize from '../components/lotsize';
import Strength from '../components/strength';
import ForexBots from '../components/forexbots';
import TradingViewView from '../components/forex/TradingViewView';

/* =========================================================
   THEMES (mirrors the ones defined in Derivdash.jsx)
   — keep these in sync if you ever add a new theme key
   ========================================================= */
const themes = {
  white: {
    name: 'White', category: 'light',
    colors: {
      bg: '#f4f6f9', surface: '#ffffff', surfaceHover: '#f1f4f8', surfaceActive: '#e8edf4',
      surfaceElevated: '#ffffff', surfaceGlass: 'rgba(255, 255, 255, 0.78)',
      glassBorder: 'rgba(15, 23, 42, 0.06)', glassBlur: '24px',
      border: '#e2e8f0', borderMuted: '#eef2f7',
      text: '#0f172a', textSecondary: '#475569', textMuted: '#94a3b8',
      accent: '#2563eb', accentHover: '#1d4ed8', accentSoft: '#3b82f6',
      accentLight: 'rgba(37, 99, 235, 0.08)', accentMuted: 'rgba(37, 99, 235, 0.16)',
      accentGlow: '0 0 24px rgba(37, 99, 235, 0.18)',
      success: '#059669', warning: '#d97706', danger: '#dc2626',
      shadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -6px rgba(15, 23, 42, 0.08)',
      shadowElevated: '0 4px 12px rgba(15, 23, 42, 0.06), 0 20px 40px -12px rgba(15, 23, 42, 0.12)',
      scrollbar: '#cbd5e1', ring: 'rgba(37, 99, 235, 0.35)',
    },
  },
  dark: {
    name: 'Dark', category: 'dark',
    colors: {
      bg: '#09090b', surface: '#121214', surfaceHover: '#1a1a1e', surfaceActive: '#232328',
      surfaceElevated: '#18181b', surfaceGlass: 'rgba(18, 18, 20, 0.72)',
      glassBorder: 'rgba(255, 255, 255, 0.07)', glassBlur: '28px',
      border: '#27272a', borderMuted: '#1c1c1f',
      text: '#fafafa', textSecondary: '#a1a1aa', textMuted: '#71717a',
      accent: '#3b82f6', accentHover: '#60a5fa', accentSoft: '#60a5fa',
      accentLight: 'rgba(59, 130, 246, 0.12)', accentMuted: 'rgba(59, 130, 246, 0.22)',
      accentGlow: '0 0 28px rgba(59, 130, 246, 0.22)',
      success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 32px -8px rgba(0, 0, 0, 0.65)',
      shadowElevated: '0 8px 24px rgba(0, 0, 0, 0.45), 0 24px 48px -12px rgba(0, 0, 0, 0.75)',
      scrollbar: '#3f3f46', ring: 'rgba(59, 130, 246, 0.4)',
    },
  },
  gold: {
    name: 'Gold', category: 'dark',
    colors: {
      bg: '#0b0a08', surface: '#141310', surfaceHover: '#1c1a16', surfaceActive: '#25221c',
      surfaceElevated: '#1a1814', surfaceGlass: 'rgba(20, 19, 16, 0.75)',
      glassBorder: 'rgba(212, 175, 55, 0.14)', glassBlur: '28px',
      border: '#2a2620', borderMuted: '#1c1a16',
      text: '#f8f5ef', textSecondary: '#b8b0a0', textMuted: '#7a7368',
      accent: '#d4af37', accentHover: '#e6c45a', accentSoft: '#e5c158',
      accentLight: 'rgba(212, 175, 55, 0.10)', accentMuted: 'rgba(212, 175, 55, 0.20)',
      accentGlow: '0 0 28px rgba(212, 175, 55, 0.20)',
      success: '#34a853', warning: '#f0a020', danger: '#e04545',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.5), 0 14px 36px -10px rgba(0, 0, 0, 0.75)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.5), 0 28px 56px -14px rgba(0, 0, 0, 0.8)',
      scrollbar: '#3a3530', ring: 'rgba(212, 175, 55, 0.35)',
    },
  },
  forest: {
    name: 'Forest', category: 'dark',
    colors: {
      bg: '#050c09', surface: '#0c1713', surfaceHover: '#12221c', surfaceActive: '#1a2f27',
      surfaceElevated: '#101c17', surfaceGlass: 'rgba(12, 23, 19, 0.75)',
      glassBorder: 'rgba(16, 185, 129, 0.14)', glassBlur: '28px',
      border: '#1a332a', borderMuted: '#12221c',
      text: '#ecfdf5', textSecondary: '#a7f3d0', textMuted: '#6b9e8a',
      accent: '#10b981', accentHover: '#34d399', accentSoft: '#34d399',
      accentLight: 'rgba(16, 185, 129, 0.12)', accentMuted: 'rgba(16, 185, 129, 0.22)',
      accentGlow: '0 0 28px rgba(16, 185, 129, 0.22)',
      success: '#34d399', warning: '#f59e0b', danger: '#f43f5e',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.45), 0 14px 36px -10px rgba(2, 12, 8, 0.7)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.45), 0 28px 56px -14px rgba(2, 12, 8, 0.75)',
      scrollbar: '#1f3d32', ring: 'rgba(16, 185, 129, 0.4)',
    },
  },
  ocean: {
    name: 'Ocean', category: 'dark',
    colors: {
      bg: '#030b12', surface: '#081621', surfaceHover: '#0d2130', surfaceActive: '#132c40',
      surfaceElevated: '#0b1c28', surfaceGlass: 'rgba(8, 22, 33, 0.75)',
      glassBorder: 'rgba(14, 165, 233, 0.14)', glassBlur: '28px',
      border: '#143447', borderMuted: '#0d2130',
      text: '#f0f9ff', textSecondary: '#7dd3fc', textMuted: '#5a8fa8',
      accent: '#0ea5e9', accentHover: '#38bdf8', accentSoft: '#38bdf8',
      accentLight: 'rgba(14, 165, 233, 0.12)', accentMuted: 'rgba(14, 165, 233, 0.22)',
      accentGlow: '0 0 28px rgba(14, 165, 233, 0.22)',
      success: '#10b981', warning: '#f59e0b', danger: '#f43f5e',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.45), 0 14px 36px -10px rgba(1, 12, 22, 0.7)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.45), 0 28px 56px -14px rgba(1, 12, 22, 0.75)',
      scrollbar: '#1a3d52', ring: 'rgba(14, 165, 233, 0.4)',
    },
  },
  red: {
    name: 'Red', category: 'dark',
    colors: {
      bg: '#0c0505', surface: '#160a0a', surfaceHover: '#221010', surfaceActive: '#2e1616',
      surfaceElevated: '#1c0e0e', surfaceGlass: 'rgba(22, 10, 10, 0.75)',
      glassBorder: 'rgba(239, 68, 68, 0.14)', glassBlur: '28px',
      border: '#2e1616', borderMuted: '#221010',
      text: '#fef2f2', textSecondary: '#fca5a5', textMuted: '#9f6b6b',
      accent: '#ef4444', accentHover: '#f87171', accentSoft: '#f87171',
      accentLight: 'rgba(239, 68, 68, 0.12)', accentMuted: 'rgba(239, 68, 68, 0.22)',
      accentGlow: '0 0 28px rgba(239, 68, 68, 0.22)',
      success: '#10b981', warning: '#f59e0b', danger: '#f87171',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.45), 0 14px 36px -10px rgba(12, 4, 4, 0.7)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.45), 0 28px 56px -14px rgba(12, 4, 4, 0.75)',
      scrollbar: '#3a1c1c', ring: 'rgba(239, 68, 68, 0.4)',
    },
  },
  orange: {
    name: 'Orange', category: 'dark',
    colors: {
      bg: '#0c0703', surface: '#16100a', surfaceHover: '#22180f', surfaceActive: '#2e2115',
      surfaceElevated: '#1c140c', surfaceGlass: 'rgba(22, 16, 10, 0.75)',
      glassBorder: 'rgba(249, 115, 22, 0.14)', glassBlur: '28px',
      border: '#2e2115', borderMuted: '#22180f',
      text: '#fff7ed', textSecondary: '#fdba74', textMuted: '#a07a4e',
      accent: '#f97316', accentHover: '#fb923c', accentSoft: '#fb923c',
      accentLight: 'rgba(249, 115, 22, 0.12)', accentMuted: 'rgba(249, 115, 22, 0.22)',
      accentGlow: '0 0 28px rgba(249, 115, 22, 0.22)',
      success: '#10b981', warning: '#fbbf24', danger: '#ef4444',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.45), 0 14px 36px -10px rgba(12, 6, 2, 0.7)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.45), 0 28px 56px -14px rgba(12, 6, 2, 0.75)',
      scrollbar: '#3a2a18', ring: 'rgba(249, 115, 22, 0.4)',
    },
  },
};

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
  for (const cc of CURRENCIES) {
    raw[cc] = strength[cc];
    logSum += Math.log(strength[cc]);
  }
  const geo = Math.exp(logSum / CURRENCIES.length);
  const out = {};
  for (const cc of CURRENCIES) out[cc] = (raw[cc] / geo - 1) * 100;
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
   INITIAL DATA
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
   PAGE
   ========================================================= */
export default function ForexDash() {
  const { view: urlView } = useParams();
  const navigate = useNavigate();

  const view = urlView || 'home';

  // ✅ Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Theme state — controlled here, changed by TopBar, consumed by every child
  const [currentTheme, setCurrentTheme] = useState('gold');
  const handleThemeChange = (name) => setCurrentTheme(name);

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

  // ✅ Sync page background + meta tags when theme changes (same pattern as Derivdash)
  useEffect(() => {
    const themeObj = themes[currentTheme] || themes.dark;
    const colors = themeObj.colors || {};
    const surface = colors.surface || colors.bg || '#0b0a08';
    const bg = colors.bg || surface;
    const scheme = themeObj.category === 'light' ? 'light' : 'dark';

    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', surface);

    let metaScheme = document.querySelector('meta[name="color-scheme"]');
    if (!metaScheme) {
      metaScheme = document.createElement('meta');
      metaScheme.setAttribute('name', 'color-scheme');
      document.head.appendChild(metaScheme);
    }
    metaScheme.setAttribute('content', scheme);

    document.documentElement.style.backgroundColor = bg;
    if (document.body) document.body.style.backgroundColor = bg;

    return () => {};
  }, [currentTheme]);

  // Market simulation: strength walk
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

  // Reprice instruments
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

  // Equity history
  useEffect(() => {
    const pl = totalPL(positions, pairs, strength);
    const equity = account.balance + pl;
    setEquityHistory((prev) => {
      const next = [...prev, equity];
      if (next.length > 90) next.shift();
      return next;
    });
  }, [positions, pairs, strength, account.balance]);

  // Bot simulation
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

  const t = themes[currentTheme] || themes.dark;
  const c = t.colors;

  return (
    <ThemeProvider theme={t}>
      <>
        {/* ============ SHARED DASHBOARD STYLES (theme-driven) ============ */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

          *{box-sizing:border-box;margin:0;padding:0}
          :root{
            --bg:${c.bg};
            --panel:${c.surface};
            --panel2:${c.surfaceElevated};
            --panel3:${c.surfaceHover};
            --border:${c.border};
            --border-soft:${c.borderMuted};
            --text:${c.text};
            --muted:${c.textSecondary};
            --dim:${c.textMuted};
            --green:${c.success};
            --red:${c.danger};
            --blue:${c.accent};
            --amber:${c.warning};
            --purple:${c.accentSoft};
            --radius:14px;
            --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
          }
          html,body,#root{height:100%}
          body{
            background:${c.bg};
            color:${c.text};
            font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
            font-size:14px;line-height:1.45;-webkit-font-smoothing:antialiased;overflow-x:hidden;
            transition:background .3s ease,color .3s ease;
          }
          ::-webkit-scrollbar{width:9px;height:9px}
          ::-webkit-scrollbar-track{background:transparent}
          ::-webkit-scrollbar-thumb{background:${c.scrollbar};border-radius:8px;border:2px solid ${c.bg}}
          ::-webkit-scrollbar-thumb:hover{background:${c.textMuted}}
          button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
          input,select{font-family:inherit}
          .pos{color:${c.success}!important}
          .neg{color:${c.danger}!important}
          .muted{color:${c.textSecondary}}
          .num{font-family:var(--mono);font-variant-numeric:tabular-nums}

          /* ---- Page shell ---- */
          .forex-page{
            min-height:100vh;
            background:${c.bg};
            display:flex;
            flex-direction:column;
            transition:background .3s ease;
          }
          .forex-content{padding:24px 26px 60px;flex:1;max-width:1600px;margin:0 auto;width:100%}
          @media (max-width:768px){ .forex-content{padding:18px 14px 80px} }

          /* ---- Cards ---- */
          .card{
            background:linear-gradient(180deg, ${c.surfaceElevated} 0%, ${c.surface} 100%);
            border:1px solid ${c.borderMuted};
            border-radius:var(--radius);
            overflow:hidden;
            transition:background .3s ease,border-color .3s ease;
          }
          .card-head{
            display:flex;align-items:center;gap:12px;
            padding:15px 18px;
            border-bottom:1px solid ${c.borderMuted};
          }
          .card-head h3{font-size:13.5px;font-weight:600;letter-spacing:-.1px;color:${c.text}}
          .card-head .spacer{flex:1}
          .tag{
            font-size:10.5px;font-weight:600;padding:3px 9px;border-radius:20px;
            background:${c.accentLight};
            color:${c.textSecondary};
            border:1px solid ${c.border};
          }

          /* ---- Stat cards ---- */
          .stat-card{
            background:linear-gradient(180deg, ${c.surfaceElevated} 0%, ${c.surface} 100%);
            border:1px solid ${c.borderMuted};
            border-radius:var(--radius);
            padding:17px 18px;position:relative;overflow:hidden;
            transition:background .3s ease,border-color .3s ease;
          }
          .stat-card::after{
            content:'';position:absolute;top:0;left:0;right:0;height:2px;
            background:linear-gradient(90deg,var(--accent-line,${c.accent}),transparent);
            opacity:.75;
          }
          .stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}
          .stat-label{font-size:11px;color:${c.textSecondary};text-transform:uppercase;letter-spacing:.9px;font-weight:600}
          .stat-icon{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:${c.surfaceHover}}
          .stat-icon svg{width:14px;height:14px;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
          .stat-value{font-family:var(--mono);font-size:23px;font-weight:500;letter-spacing:-.6px;line-height:1.15;color:${c.text}}
          .stat-foot{font-size:11.5px;color:${c.textMuted};margin-top:6px;display:flex;align-items:center;gap:5px}
          .delta{font-weight:600;font-size:11.5px}

          /* ---- Grids ---- */
          .grid-2{display:grid;grid-template-columns:1.85fr 1fr;gap:15px;margin-bottom:18px}
          .grid-eq{display:grid;grid-template-columns:1fr;gap:15px;margin-bottom:18px}
          @media (max-width:1180px){ .grid-2{grid-template-columns:1fr} }

          /* ---- Tables ---- */
          .tbl{width:100%;border-collapse:collapse}
          .tbl th{
            text-align:left;font-size:10.5px;text-transform:uppercase;letter-spacing:.9px;
            color:${c.textMuted};font-weight:600;padding:11px 18px;
            border-bottom:1px solid ${c.borderMuted};white-space:nowrap;
          }
          .tbl td{
            padding:11px 18px;
            border-bottom:1px solid ${c.borderMuted};
            font-size:13px;white-space:nowrap;color:${c.text};
          }
          .tbl tbody tr{transition:.13s}
          .tbl tbody tr:hover{background:${c.surfaceHover}}
          .tbl tbody tr:last-child td{border-bottom:none}
          .tbl .r{text-align:right}
          .sym-cell{display:flex;align-items:center;gap:10px}
          .sym-badge{
            width:34px;height:34px;border-radius:9px;flex:none;display:grid;place-items:center;
            font-size:10px;font-weight:700;letter-spacing:.3px;
            background:${c.surfaceHover};color:${c.textSecondary};
            border:1px solid ${c.border};
          }
          .sym-name{font-weight:600;font-size:13px;letter-spacing:-.1px;color:${c.text}}
          .sym-desc{font-size:10.5px;color:${c.textMuted}}
          .spark{width:82px;height:28px;display:block}
          .chart{width:100%;height:100%;display:block}

          /* ---- Side tag / buttons ---- */
          .side-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.6px;padding:3px 8px;border-radius:5px}
          .side-tag.buy{background:${c.accentLight};color:${c.success}}
          .side-tag.sell{background:${c.accentLight};color:${c.danger}}

          .btn{padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:600;transition:.16s;border:1px solid transparent}
          .btn.primary{background:${c.accent};color:${c.bg}}
          .btn.primary:hover{background:${c.accentHover};box-shadow:${c.accentGlow}}
          .btn.ghost{background:${c.surfaceHover};border-color:${c.border};color:${c.textSecondary}}
          .btn.ghost:hover{background:${c.surfaceActive};color:${c.text}}
          .btn.sm{padding:5px 11px;font-size:11.5px;border-radius:7px}
          .btn.trade{
            background:${c.surfaceHover};border:1px solid ${c.border};color:${c.textSecondary};
            padding:5px 12px;font-size:11.5px;border-radius:7px;
          }
          .btn.trade:hover{
            background:${c.accentLight};color:${c.accent};border-color:${c.accentMuted};
          }
          .icon-x{color:${c.textMuted};font-size:16px;line-height:1;padding:2px 7px;border-radius:6px}
          .icon-x:hover{background:${c.accentLight};color:${c.danger}}

          /* ---- Strength bars ---- */
          .st-row{display:grid;grid-template-columns:44px 1fr 62px;align-items:center;gap:12px;padding:7px 18px}
          .st-cur{font-size:12px;font-weight:700;letter-spacing:.4px;color:${c.text}}
          .st-track{
            position:relative;height:22px;background:${c.surface};
            border-radius:6px;overflow:hidden;border:1px solid ${c.borderMuted};
          }
          .st-mid{position:absolute;left:50%;top:0;bottom:0;width:1px;background:${c.border}}
          .st-bar{
            position:absolute;top:3px;bottom:3px;border-radius:4px;
            transition:width .5s cubic-bezier(.4,0,.2,1),left .5s,right .5s;
          }
          .st-bar.pos{background:linear-gradient(90deg, ${c.accentLight}, ${c.success})}
          .st-bar.neg{background:linear-gradient(270deg, ${c.accentLight}, ${c.danger})}
          .st-val{font-family:var(--mono);font-size:12px;text-align:right;font-weight:500}

          /* ---- Notice ---- */
          .notice{
            display:flex;align-items:center;gap:10px;margin-top:18px;
            padding:12px 16px;border-radius:11px;
            background:${c.accentLight};
            border:1px solid ${c.accentMuted};
            font-size:12px;color:${c.textSecondary};
          }
          .notice svg{width:15px;height:15px;flex:none;stroke:${c.accent};fill:none;stroke-width:1.8;stroke-linecap:round}
          .empty{padding:36px;text-align:center;color:${c.textMuted};font-size:12.5px}

          /* ---- View animation ---- */
          .view{display:block;animation:fade .28s ease}
          @keyframes fade{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
        `}</style>

        <div className="forex-page">
          <TopPanel
            isSidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen((v) => !v)}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
          />

          {/* ✅ OptionSideBar stays mounted; visibility is controlled by `isOpen`
              and its internal styled-components read from ThemeProvider */}
          <OptionSideBar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

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
            {view === 'lot'         && <LotSize pairs={pairs} strength={strength} initialPair={selectedPair} />}
            {view === 'strength'    && <Strength strength={strength} />}
            {view === 'bots'        && <ForexBots bots={bots} onToggleBot={onToggleBot} />}
            {view === 'tradingview' && <TradingViewView />}
          </div>
        </div>
      </>
    </ThemeProvider>
  );
}