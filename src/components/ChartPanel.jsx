// src/components/ChartPanel.jsx
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import styled, { keyframes, ThemeContext } from 'styled-components';

// ============================================
// ALL VOLATILITY MARKETS (Deriv Official)
// ============================================
const VOLATILITY_MARKETS = [
  { symbol: 'R_100_1S', name: 'Volatility 100 (1s) Index', display: '100 (1s)', color: '#a855f7', isOneSec: true },
  { symbol: 'R_10_1S', name: 'Volatility 10 (1s) Index', display: '10 (1s)', color: '#2962ff', isOneSec: true },
  { symbol: 'R_25_1S', name: 'Volatility 25 (1s) Index', display: '25 (1s)', color: '#3b82f6', isOneSec: true },
  { symbol: 'R_50_1S', name: 'Volatility 50 (1s) Index', display: '50 (1s)', color: '#6366f1', isOneSec: true },
  { symbol: 'R_75_1S', name: 'Volatility 75 (1s) Index', display: '75 (1s)', color: '#8b5cf6', isOneSec: true },
  { symbol: 'R_10', name: 'Volatility 10 Index', display: '10', color: '#10b981', isOneSec: false },
  { symbol: 'R_25', name: 'Volatility 25 Index', display: '25', color: '#059669', isOneSec: false },
  { symbol: 'R_50', name: 'Volatility 50 Index', display: '50', color: '#047857', isOneSec: false },
  { symbol: 'R_75', name: 'Volatility 75 Index', display: '75', color: '#065f46', isOneSec: false },
  { symbol: 'R_100', name: 'Volatility 100 Index', display: '100', color: '#064e3b', isOneSec: false },
];

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============================================
// STYLED COMPONENTS - ALL THEME BASED
// ============================================
const PanelContainer = styled.div`
  flex: 1;
  background: ${props => props.theme.colors.bg || props.theme.colors.background};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
  transition: all 0.3s ease;
  font-weight: 700;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding: 12px 20px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface || props.theme.colors.backgroundSecondary};
  z-index: 10;
  transition: all 0.3s ease;
  font-weight: 700;

  @media (max-width: 768px) {
    padding: 8px 12px;
    flex-wrap: wrap;
    gap: 6px;
  }
  @media (max-width: 480px) {
    padding: 6px 8px;
    gap: 4px;
  }
`;

const SymbolInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
  font-weight: 700;

  @media (max-width: 480px) { gap: 2px; }

  .symbol-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;

    @media (max-width: 480px) { gap: 4px; }
  }

  .symbol-label {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 480px) { font-size: 9px; }
  }

  .market-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: ${props => props.theme.colors.text};
    font-size: 15px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;
    background: ${props => props.theme.colors.surface || props.theme.colors.backgroundSecondary};
    border: 2px solid ${props => props.theme.colors.border};

    @media (max-width: 480px) {
      font-size: 12px;
      padding: 2px 6px;
    }

    &:hover {
      background: ${props => props.theme.colors.surfaceHover || props.theme.colors.backgroundTertiary};
      border-color: ${props => props.theme.colors.accent};
      box-shadow: 0 0 20px ${props => props.theme.colors.accent + '30'};
    }

    .selected-candle {
      display: flex;
      align-items: center;
      gap: 2px;
      height: 20px;
      opacity: 0.8;
      flex-shrink: 0;

      .candle {
        width: 3px;
        background: ${props => props.theme.colors.textMuted};
        position: relative;
        border-radius: 1px;
        &::before {
          content: '';
          position: absolute;
          width: 1px;
          background: inherit;
          left: 1px;
          border-radius: 1px;
        }
      }
      .c1 { height: 12px; background: ${props => props.theme.colors.danger}; &::before { height: 18px; top: -3px; } }
      .c2 { height: 15px; background: ${props => props.theme.colors.success}; &::before { height: 20px; top: -2px; } }
      .c3 { height: 9px;  background: ${props => props.theme.colors.danger}; &::before { height: 14px; top: -2px; } }
    }

    .selected-name {
      white-space: nowrap;
    }

    .dropdown-arrow {
      font-size: 11px;
      color: ${props => props.theme.colors.textMuted};
      transition: transform 0.2s ease;
      transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
      @media (max-width: 480px) { font-size: 9px; }
    }
  }

  .price-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    @media (max-width: 480px) { gap: 4px; }
  }

  .price {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.5px;
    font-family: 'Courier New', Courier, monospace;
    @media (max-width: 480px) { font-size: 18px; }
  }

  .change {
    font-size: 12px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    background: ${props => props.isNegative ? props.theme.colors.danger + '25' : props.theme.colors.success + '25'};
    color: ${props => props.isNegative ? props.theme.colors.danger : props.theme.colors.success};
    @media (max-width: 480px) { font-size: 10px; padding: 1px 4px; }
  }

  .change-time {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    font-family: monospace;
    font-weight: 700;
    @media (max-width: 480px) { font-size: 9px; }
  }
`;

// Recent last 3 digits with label
const RecentDigits = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: 4px;
  font-weight: 700;
  font-family: 'Courier New', Courier, monospace;

  .label {
    font-size: 9px;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 2px;
    white-space: nowrap;

    @media (max-width: 480px) {
      font-size: 7px;
      margin-right: 0px;
    }
  }

  .digit-box {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.accentLight || props.theme.colors.accentActive};
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    transition: all 0.15s ease;

    &:last-child {
      border-color: ${props => props.theme.colors.accent};
      box-shadow: 0 0 10px ${props => props.theme.colors.accent + '80'};
      color: ${props => props.theme.colors.accent};
    }
  }

  @media (max-width: 480px) {
    gap: 3px;
    .digit-box {
      width: 20px;
      height: 20px;
      font-size: 12px;
    }
  }
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${props => props.theme.colors.accent};
  font-weight: 700;
  background: ${props => props.theme.colors.accentLight || props.theme.colors.accentActive};
  padding: 4px 12px;
  border-radius: 20px;
  border: 2px solid ${props => props.theme.colors.accent};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 9px;
    padding: 2px 8px;
    gap: 4px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme.colors.accent};
    animation: ${pulse} 1.5s ease-in-out infinite;
    box-shadow: 0 0 8px ${props => props.theme.colors.accent};
    @media (max-width: 480px) { width: 4px; height: 4px; }
  }
`;

// ===== MARKET SELECTION DROPDOWN =====
const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: ${props => props.theme.colors.surface || props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  width: 280px;
  max-height: 340px;
  overflow-y: auto;
  z-index: 9999;
  box-shadow: 0 20px 50px ${props => props.theme.colors.shadow};
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-weight: 700;

  @media (max-width: 480px) { width: 220px; max-height: 260px; left: -10px; }

  .dropdown-title {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme.colors.textMuted};
    padding: 10px 14px 6px 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${props => props.theme.colors.border};
    @media (max-width: 480px) { font-size: 9px; padding: 6px 10px 4px 10px; }
  }

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: ${props => props.theme.colors.scrollbar}; border-radius: 4px; }
`;

const DropdownItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textSecondary};
  background: ${props => props.active ? props.theme.colors.accentLight || props.theme.colors.accentActive : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 2px solid ${props => props.theme.colors.border + '40'};
  font-weight: 700;
  @media (max-width: 480px) { padding: 6px 10px; }

  &:hover {
    background: ${props => props.theme.colors.accentLight || props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};
  }

  .left-container { display: flex; align-items: center; gap: 12px; @media (max-width: 480px) { gap: 6px; } }
  .candle-icon-mock {
    display: flex; align-items: center; gap: 2px; height: 20px; opacity: 0.75; flex-shrink: 0;
    @media (max-width: 480px) { display: none; }
    .candle { width: 3px; background: ${props => props.theme.colors.textMuted}; position: relative; &::before { content: ''; position: absolute; width: 1px; background: inherit; left: 1px; } }
    .c1 { height: 12px; background: ${props => props.theme.colors.danger}; &::before { height: 18px; top: -3px; } }
    .c2 { height: 15px; background: ${props => props.theme.colors.success}; &::before { height: 20px; top: -2px; } }
    .c3 { height: 9px;  background: ${props => props.theme.colors.danger}; &::before { height: 14px; top: -2px; } }
  }
  .market-meta { display: flex; flex-direction: column; gap: 1px; }
  .display-name { font-size: 13px; font-weight: 700; color: ${props => props.theme.colors.text}; @media (max-width: 480px) { font-size: 11px; } }
  .system-symbol { font-size: 10px; color: ${props => props.theme.colors.textMuted}; font-family: monospace; font-weight: 700; @media (max-width: 480px) { font-size: 8px; } }
  .badge-1s { font-size: 8px; font-weight: 700; color: ${props => props.theme.colors.text}; background: ${props => props.theme.colors.danger}; padding: 1px 4px; border-radius: 3px; text-transform: uppercase; }
  .star-fav { color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textMuted + '40'}; font-size: 14px; @media (max-width: 480px) { font-size: 11px; } }
`;

// ===== CHART =====
const ChartWrapper = styled.div`
  flex: 1;
  position: relative;
  min-height: 0;
  background: ${props => props.theme.colors.bg || props.theme.colors.background};
  overflow: hidden;
  z-index: 2;
  transition: background 0.3s ease;
  cursor: crosshair;
`;

const ChartCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

// ===== FLOATING DIGIT OVERLAY CONTAINER =====
const DigitStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 20px);
  max-width: 680px;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  position: absolute;
  bottom: 55px;
  left: 50%;
  transform: translateX(-50%);
  gap: 6px;
  pointer-events: none;
  z-index: 1;
  font-weight: 700;

  @media (max-width: 768px) { width: calc(100% - 16px); bottom: 48px; gap: 5px; }
  @media (max-width: 480px) { width: calc(100% - 8px); bottom: 42px; gap: 4px; }
  @media (max-width: 380px) { width: calc(100% - 4px); bottom: 38px; gap: 3px; }
`;

const DigitItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 2px;
  min-width: 0;
  font-weight: 700;

  .circle-badge {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    background: ${props => props.theme.colors.surface || props.theme.colors.backgroundSecondary};
    border: 2px solid ${props => props.isLastDigit ? props.theme.colors.accent : props.theme.colors.border};
    box-shadow: ${props => props.isLastDigit ? `0 0 15px ${props.theme.colors.accent + '80'}` : 'none'};
    transition: all 0.15s ease;
    @media (max-width: 768px) { width: 34px; height: 34px; border-width: 2px; }
    @media (max-width: 480px) { width: 32px; height: 32px; border-width: 2px; }
    @media (max-width: 380px) { width: 28px; height: 28px; border-width: 2px; }
  }

  .digit-num {
    font-size: 14px; font-weight: 700; color: ${props => props.theme.colors.text}; line-height: 1;
    @media (max-width: 768px) { font-size: 13px; }
    @media (max-width: 480px) { font-size: 12px; }
    @media (max-width: 380px) { font-size: 10px; }
  }

  .pct-text {
    font-size: 8px; font-family: monospace; font-weight: 700;
    color: ${props => props.isMax ? props.theme.colors.accent : props.theme.colors.textMuted};
    line-height: 1; margin-top: 0px;
    @media (max-width: 768px) { font-size: 7px; }
    @media (max-width: 480px) { font-size: 7px; }
    @media (max-width: 380px) { font-size: 6px; }
  }

  .active-arrow {
    position: absolute; bottom: -4px; font-size: 10px; color: ${props => props.theme.colors.accent};
    display: ${props => props.isLastDigit ? 'block' : 'none'}; line-height: 1; font-weight: 700;
    @media (max-width: 480px) { font-size: 8px; bottom: -3px; }
    @media (max-width: 380px) { font-size: 7px; bottom: -2px; }
  }
`;

// ============================================
// CANVAS POLYFILL
// ============================================
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (r > w/2) r = w/2; if (r > h/2) r = h/2;
    this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r); return this;
  };
}

// ============================================
// MAIN PANEL COMPONENT
// ============================================
const ChartPanel = () => {
  const canvasRef = useRef(null);
  const theme = useContext(ThemeContext);
  const [selectedMarket, setSelectedMarket] = useState(VOLATILITY_MARKETS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [price, setPrice] = useState(8459.65);
  const [change, setChange] = useState(39.59);
  const [changePct, setChangePct] = useState(0.47);
  const [isNegative, setIsNegative] = useState(false);
  const [ticks, setTicks] = useState([]);
  const [digitStats, setDigitStats] = useState(Array(10).fill(0).map((_, i) => ({ digit: i, pct: 10 })));
  const [lastDigit, setLastDigit] = useState(5);
  const [movementDirection, setMovementDirection] = useState('down');
  const [currentTime, setCurrentTime] = useState('');

  // Crosshair state
  const [crosshairData, setCrosshairData] = useState(null);
  const padRef = useRef({ top: 25, bottom: 35, left: 15, right: 65 });
  const chartSizeRef = useRef({ chartW: 0, chartH: 0 });

  // State for last digits of the last 3 prices
  const [recentLastDigits, setRecentLastDigits] = useState([null, null, null]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let basePrice = selectedMarket.symbol.includes('100') ? 8459.65 : 230.15;
    const initialTicks = [];
    for (let i = 0; i < 120; i++) {
      const delta = (Math.random() - 0.5) * (basePrice * 0.001);
      basePrice = parseFloat((basePrice + delta).toFixed(2));
      initialTicks.push({ time: Date.now() - (120 - i) * 1000, price: basePrice });
    }
    setTicks(initialTicks);
    setCrosshairData(null);

    // Set last digits of last 3 initial ticks
    if (initialTicks.length >= 3) {
      const lastThreeTicks = initialTicks.slice(-3);
      const digits = lastThreeTicks.map(t => parseInt(t.price.toFixed(2).slice(-1)));
      setRecentLastDigits(digits);
    } else {
      const digits = initialTicks.map(t => parseInt(t.price.toFixed(2).slice(-1)));
      while (digits.length < 3) digits.unshift(null);
      setRecentLastDigits(digits.slice(0,3));
    }

    const interval = setInterval(() => {
      setTicks(prev => {
        if (prev.length === 0) return prev;
        const previousPrice = prev[prev.length - 1].price;
        const delta = (Math.random() - 0.5) * (previousPrice * 0.0008);
        const newPrice = parseFloat((previousPrice + delta).toFixed(2));
        const newTick = { time: Date.now(), price: newPrice };
        const updated = [...prev.slice(-140), newTick];

        setPrice(newPrice);
        const newChange = newPrice - initialTicks[0].price;
        setChange(newChange);
        setChangePct((newChange / initialTicks[0].price) * 100);
        setIsNegative(newChange < 0);
        setMovementDirection(newPrice >= previousPrice ? 'up' : 'down');

        const priceStr = newPrice.toFixed(2);
        const currentLastDigit = parseInt(priceStr.slice(-1));
        if (!isNaN(currentLastDigit)) {
          setLastDigit(currentLastDigit);
          // Update recent last digits: shift left and add new digit
          setRecentLastDigits(prev => {
            const next = [...prev.slice(1), currentLastDigit];
            return next;
          });
        }

        // Digit stats
        const digits = Array(10).fill(0);
        updated.forEach(t => {
          const str = t.price.toFixed(2);
          const d = parseInt(str.slice(-1));
          if (!isNaN(d)) digits[d]++;
        });
        const total = updated.length || 1;
        const stats = digits.map((count, i) => ({
          digit: i,
          pct: parseFloat(((count / total) * 100).toFixed(1))
        }));
        setDigitStats(stats);

        return updated;
      });
    }, selectedMarket.isOneSec ? 1000 : 2000);

    return () => clearInterval(interval);
  }, [selectedMarket]);

  // Canvas drawing effect (unchanged, but includes crosshair)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || ticks.length < 2 || !theme) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const bgColor = theme.colors.bg || theme.colors.background;
    const textColor = theme.colors.text;
    const textMutedColor = theme.colors.textMuted;
    const accentColor = theme.colors.accent;
    const borderColor = theme.colors.border;
    const surfaceColor = theme.colors.surface || theme.colors.backgroundSecondary;

    const hexToRgb = (hex) => {
      if (!hex) return { r: 10, g: 14, b: 23 };
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 10, g: 14, b: 23 };
    };

    const rgb = hexToRgb(bgColor);
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, `rgb(${Math.min(rgb.r+2,255)}, ${Math.min(rgb.g+2,255)}, ${Math.min(rgb.b+4,255)})`);
    bgGrad.addColorStop(1, `rgb(${Math.max(rgb.r-2,0)}, ${Math.max(rgb.g-2,0)}, ${Math.max(rgb.b-4,0)})`);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const pad = { top: 25, bottom: 35, left: 15, right: 65 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;
    if (chartW <= 0 || chartH <= 0) return;

    padRef.current = pad;
    chartSizeRef.current = { chartW, chartH };

    const prices = ticks.map(t => t.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const paddingP = (maxP - minP) * 0.1 || 0.5;
    const minPBound = minP - paddingP;
    const maxPBound = maxP + paddingP;
    const range = maxPBound - minPBound || 1;

    const yScale = (p) => pad.top + chartH - ((p - minPBound) / range) * chartH;
    const xScale = (i) => pad.left + (i / (ticks.length - 1)) * chartW;

    // Grid
    const gridRgb = hexToRgb(borderColor);
    ctx.strokeStyle = `rgba(${gridRgb.r},${gridRgb.g},${gridRgb.b},0.3)`;
    ctx.lineWidth = 2;
    for (let i=0; i<=5; i++) { const y=pad.top+(i/5)*chartH; ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(width-pad.right,y); ctx.stroke(); }
    for (let i=0; i<=10; i++) { const x=pad.left+(i/10)*chartW; ctx.beginPath(); ctx.moveTo(x,pad.top); ctx.lineTo(x,height-pad.bottom); ctx.stroke(); }

    // Line
    ctx.beginPath();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (let i=0; i<ticks.length; i++) {
      const x = xScale(i), y = yScale(ticks[i].price);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();

    // Fill
    const lastX = xScale(ticks.length-1);
    ctx.lineTo(lastX, height-pad.bottom); ctx.lineTo(pad.left, height-pad.bottom); ctx.closePath();
    const fillRgb = hexToRgb(accentColor);
    const fillGrad = ctx.createLinearGradient(0, pad.top, 0, height-pad.bottom);
    fillGrad.addColorStop(0, `rgba(${fillRgb.r},${fillRgb.g},${fillRgb.b},0.15)`);
    fillGrad.addColorStop(1, `rgba(${fillRgb.r},${fillRgb.g},${fillRgb.b},0)`);
    ctx.fillStyle = fillGrad; ctx.fill();

    // Current price dot
    const currentPrice = ticks[ticks.length-1].price;
    const currentY = yScale(currentPrice);
    ctx.fillStyle = accentColor; ctx.beginPath(); ctx.arc(lastX, currentY, 4.5, 0, Math.PI*2); ctx.fill();

    // Dashed line
    const dashRgb = hexToRgb(textColor);
    ctx.setLineDash([4,4]); ctx.strokeStyle = `rgba(${dashRgb.r},${dashRgb.g},${dashRgb.b},0.15)`;
    ctx.beginPath(); ctx.moveTo(lastX,currentY); ctx.lineTo(width-pad.right,currentY); ctx.stroke(); ctx.setLineDash([]);

    // Price badge
    const badgeW=55, badgeH=20;
    ctx.fillStyle = accentColor; ctx.beginPath(); ctx.roundRect(width-pad.right+4, currentY-badgeH/2, badgeW, badgeH, 4); ctx.fill();
    ctx.fillStyle = surfaceColor; ctx.font='bold 10px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(currentPrice.toFixed(2), width-pad.right+4+badgeW/2, currentY);

    // Y-axis labels
    ctx.fillStyle = textMutedColor; ctx.font='bold 10px monospace'; ctx.textAlign='left'; ctx.textBaseline='middle';
    for (let i=0; i<=4; i++) { const p = maxPBound - (i/4)*range; ctx.fillText(p.toFixed(2), width-pad.right+6, yScale(p)); }

    // X-axis labels
    ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillStyle=textMutedColor; ctx.font='bold 10px monospace';
    const times = ['08:00','11:00','14:00','17:00','20:00'];
    times.forEach((t, idx) => ctx.fillText(t, pad.left+(idx/(times.length-1))*chartW, height-pad.bottom+6));

    // Border
    const borderRgb = hexToRgb(borderColor);
    ctx.strokeStyle = `rgba(${borderRgb.r},${borderRgb.g},${borderRgb.b},0.2)`; ctx.lineWidth=1; ctx.strokeRect(pad.left,pad.top,chartW,chartH);

    // Crosshair
    if (crosshairData && crosshairData.index >= 0) {
      const { index, price: crossPrice, time } = crosshairData;
      const cx = xScale(index), cy = yScale(crossPrice);
      ctx.save(); ctx.setLineDash([4,6]); ctx.strokeStyle=accentColor; ctx.lineWidth=1.5; ctx.globalAlpha=0.8;
      ctx.beginPath(); ctx.moveTo(cx, pad.top); ctx.lineTo(cx, height-pad.bottom); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad.left, cy); ctx.lineTo(width-pad.right, cy); ctx.stroke(); ctx.restore();

      const tooltipFont = 'bold 11px monospace'; ctx.font = tooltipFont;
      const priceText = crossPrice.toFixed(2); const timeText = new Date(time).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const fullText = `${priceText}  ${timeText}`; const textMetrics = ctx.measureText(fullText); const textWidth = textMetrics.width;
      const paddingX = 8, paddingY = 6; const tooltipWidth = textWidth+paddingX*2; const tooltipHeight=22;
      let tooltipX = cx+10, tooltipY = cy-30;
      if (tooltipX+tooltipWidth > width-pad.right) tooltipX = cx - tooltipWidth - 10;
      if (tooltipY < pad.top+5) tooltipY = cy+15;

      ctx.save(); ctx.globalAlpha=0.95; ctx.fillStyle=surfaceColor; ctx.strokeStyle=accentColor; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5); ctx.fill(); ctx.stroke(); ctx.restore();

      ctx.save(); ctx.fillStyle=textColor; ctx.font=tooltipFont; ctx.textBaseline='middle'; ctx.textAlign='left';
      ctx.fillText(fullText, tooltipX+paddingX, tooltipY+tooltipHeight/2); ctx.restore();
    }
  }, [ticks, movementDirection, theme, crosshairData]);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas || ticks.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
    const pad = padRef.current; const { chartW, chartH } = chartSizeRef.current;
    const relX = mouseX - pad.left, relY = mouseY - pad.top;
    if (relX >= 0 && relX <= chartW && relY >= 0 && relY <= chartH) {
      const idx = Math.round((relX / chartW) * (ticks.length - 1));
      const clampedIdx = Math.max(0, Math.min(idx, ticks.length - 1));
      const tick = ticks[clampedIdx];
      if (tick) {
        setCrosshairData({ index: clampedIdx, price: tick.price, time: tick.time });
        return;
      }
    }
    setCrosshairData(null);
  }, [ticks]);

  const handleMouseLeave = useCallback(() => setCrosshairData(null), []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectMarket = (market) => { setSelectedMarket(market); setIsDropdownOpen(false); };

  const allPercentages = digitStats.map(s => s.pct);
  const maxPct = Math.max(...allPercentages), minPct = Math.min(...allPercentages);

  return (
    <PanelContainer>
      <Header>
        <SymbolInfo isNegative={isNegative}>
          <div className="symbol-row">
            <span className="symbol-label">Volatility Index</span>
            <div className="market-selector" isOpen={isDropdownOpen} onClick={toggleDropdown}>
              <div className="selected-candle">
                <div className="candle c1" /><div className="candle c2" /><div className="candle c3" />
              </div>
              <span className="selected-name">{selectedMarket.name}</span>
              <span className="dropdown-arrow">▾</span>
              <DropdownMenu isOpen={isDropdownOpen} onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-title">Volatility Indices</div>
                {VOLATILITY_MARKETS.map((market) => (
                  <DropdownItem key={market.symbol} active={selectedMarket.symbol === market.symbol} onClick={() => selectMarket(market)}>
                    <div className="left-container">
                      <div className="candle-icon-mock"><div className="candle c1" /><div className="candle c2" /><div className="candle c3" /></div>
                      <div className="market-meta">
                        <span className="display-name">{market.name.split(' (1s)')[0]} {market.isOneSec && <span className="badge-1s">1s</span>}</span>
                        <span className="system-symbol">{market.symbol}</span>
                      </div>
                    </div>
                    <span className="star-fav">★</span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </div>

            {/* Last 3 digits with label */}
            <RecentDigits>
              <span className="label">Last 3:</span>
              {recentLastDigits.map((digit, idx) => (
                <div key={idx} className="digit-box">
                  {digit !== null ? digit : '-'}
                </div>
              ))}
            </RecentDigits>
          </div>

          <div className="price-row">
            <span className="price">{price.toFixed(2)}</span>
            <span className="change">
              {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%)
            </span>
            <span className="change-time">• {currentTime}</span>
          </div>
        </SymbolInfo>

        <LiveIndicator><span className="dot" /> Live Feed</LiveIndicator>
      </Header>

      <ChartWrapper onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <ChartCanvas ref={canvasRef} />
        <DigitStatsContainer>
          {digitStats.map((stat) => {
            const isLastDigit = stat.digit === lastDigit;
            return (
              <DigitItem key={stat.digit} isLastDigit={isLastDigit} isMax={stat.pct === maxPct} isMin={stat.pct === minPct} direction={movementDirection}>
                <div className="circle-badge">
                  <span className="digit-num">{stat.digit}</span>
                  <span className="pct-text">{stat.pct}%</span>
                </div>
                <span className="active-arrow">▲</span>
              </DigitItem>
            );
          })}
        </DigitStatsContainer>
      </ChartWrapper>
    </PanelContainer>
  );
};

export default ChartPanel;