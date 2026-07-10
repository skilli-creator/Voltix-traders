// src/components/ChartPanel.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
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
// STYLED COMPONENTS - UPDATED WITH THEME
// ============================================
const PanelContainer = styled.div`
  flex: 1;
  background: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
  transition: background 0.3s ease;
`;

// ===== HEADER =====
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding: 12px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background + 'cc'};
  backdrop-filter: blur(12px);
  z-index: 10;
  transition: all 0.3s ease;

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

  @media (max-width: 480px) {
    gap: 2px;
  }

  .symbol-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      gap: 4px;
    }
  }

  .symbol-label {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 480px) {
      font-size: 9px;
    }
  }

  .market-selector {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    color: ${props => props.theme.colors.text};
    font-size: 15px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;
    background: ${props => props.theme.colors.background + '60'};
    border: 1px solid ${props => props.theme.colors.border};

    @media (max-width: 480px) {
      font-size: 12px;
      padding: 2px 6px;
    }

    &:hover {
      background: ${props => props.theme.colors.background + '80'};
      border-color: ${props => props.theme.colors.accent + '50'};
    }

    .dropdown-arrow {
      font-size: 11px;
      color: ${props => props.theme.colors.textMuted};
      transition: transform 0.2s ease;
      transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};

      @media (max-width: 480px) {
        font-size: 9px;
      }
    }
  }

  .price-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      gap: 4px;
    }
  }

  .price {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.5px;
    font-family: 'Courier New', Courier, monospace;

    @media (max-width: 480px) {
      font-size: 18px;
    }
  }

  .change {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    background: ${props => props.isNegative ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'};
    color: ${props => props.isNegative ? '#ff4a4a' : '#00e676'};

    @media (max-width: 480px) {
      font-size: 10px;
      padding: 1px 4px;
    }
  }

  .change-time {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    font-family: monospace;

    @media (max-width: 480px) {
      font-size: 9px;
    }
  }
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #00e676;
  font-weight: 600;
  background: rgba(0, 230, 118, 0.08);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(0, 230, 118, 0.15);
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
    background: #00e676;
    animation: ${pulse} 1.5s ease-in-out infinite;
    box-shadow: 0 0 8px #00e676;

    @media (max-width: 480px) {
      width: 4px;
      height: 4px;
    }
  }
`;

// ===== MARKET SELECTION DROPDOWN =====
const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  width: 280px;
  max-height: 340px;
  overflow-y: auto;
  z-index: 9999;
  box-shadow: 0 20px 50px ${props => props.theme.colors.shadow};
  backdrop-filter: blur(25px);
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 480px) {
    width: 220px;
    max-height: 260px;
    left: -10px;
  }

  .dropdown-title {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme.colors.textMuted};
    padding: 10px 14px 6px 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid ${props => props.theme.colors.border};

    @media (max-width: 480px) {
      font-size: 9px;
      padding: 6px 10px 4px 10px;
    }
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }
`;

const DropdownItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid ${props => props.theme.colors.border + '40'};

  @media (max-width: 480px) {
    padding: 6px 10px;
  }

  &:hover {
    background: ${props => props.theme.colors.background + '40'};
    color: ${props => props.theme.colors.text};
  }

  .left-container {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 480px) {
      gap: 6px;
    }
  }

  .candle-icon-mock {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 20px;
    opacity: 0.75;

    @media (max-width: 480px) {
      display: none;
    }

    .candle {
      width: 3px;
      background: ${props => props.theme.colors.textMuted};
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 1px;
        background: inherit;
        left: 1px;
      }
    }
    .c1 { height: 12px; background: #ef4444; &::before { height: 18px; top: -3px; } }
    .c2 { height: 15px; background: #22c55e; &::before { height: 20px; top: -2px; } }
    .c3 { height: 9px;  background: #ef4444; &::before { height: 14px; top: -2px; } }
  }

  .market-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .display-name {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }

  .system-symbol {
    font-size: 10px;
    color: ${props => props.theme.colors.textMuted};
    font-family: monospace;

    @media (max-width: 480px) {
      font-size: 8px;
    }
  }

  .badge-1s {
    font-size: 8px;
    font-weight: 700;
    color: #ffffff;
    background: #ff4444;
    padding: 1px 4px;
    border-radius: 3px;
    text-transform: uppercase;
  }

  .star-fav {
    color: ${props => props.active ? '#ffb300' : props.theme.colors.textMuted + '40'};
    font-size: 14px;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }
`;

// ===== CHART =====
const ChartWrapper = styled.div`
  flex: 1;
  position: relative;
  min-height: 0;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
  z-index: 2;
  transition: background 0.3s ease;
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

  @media (max-width: 768px) {
    width: calc(100% - 16px);
    bottom: 48px;
    gap: 5px;
  }

  @media (max-width: 480px) {
    width: calc(100% - 8px);
    bottom: 42px;
    gap: 4px;
  }

  @media (max-width: 380px) {
    width: calc(100% - 4px);
    bottom: 38px;
    gap: 3px;
  }
`;

const DigitItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 2px;
  min-width: 0;

  .circle-badge {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${props => props.theme.colors.background + 'f0'};
    border: 2px solid ${props => 
      props.isLastDigit 
        ? (props.direction === 'up' ? '#00e676' : '#ff4a4a') 
        : props.theme.colors.border
    };
    box-shadow: ${props => props.isLastDigit ? `0 0 15px ${props.direction === 'up' ? 'rgba(0,230,118,0.5)' : 'rgba(255,74,74,0.5)'}` : 'none'};
    transition: all 0.15s ease;

    @media (max-width: 768px) {
      width: 34px;
      height: 34px;
      border-width: 2px;
    }

    @media (max-width: 480px) {
      width: 32px;
      height: 32px;
      border-width: 2px;
    }

    @media (max-width: 380px) {
      width: 28px;
      height: 28px;
      border-width: 1.5px;
    }
  }

  .digit-num {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    line-height: 1;

    @media (max-width: 768px) {
      font-size: 13px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
    }

    @media (max-width: 380px) {
      font-size: 10px;
    }
  }

  .pct-text {
    font-size: 8px;
    font-family: monospace;
    font-weight: 500;
    color: ${props => 
      props.isMax 
        ? '#00e676' 
        : (props.isMin ? '#ff4a4a' : props.theme.colors.textMuted)
    };
    line-height: 1;
    margin-top: 0px;

    @media (max-width: 768px) {
      font-size: 7px;
    }

    @media (max-width: 480px) {
      font-size: 7px;
    }

    @media (max-width: 380px) {
      font-size: 6px;
    }
  }

  .active-arrow {
    position: absolute;
    bottom: -4px;
    font-size: 10px;
    color: #ff9800;
    display: ${props => props.isLastDigit ? 'block' : 'none'};
    line-height: 1;

    @media (max-width: 480px) {
      font-size: 8px;
      bottom: -3px;
    }

    @media (max-width: 380px) {
      font-size: 7px;
      bottom: -2px;
    }
  }
`;

// ============================================
// CANVAS POLYFILL
// ============================================
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (r > w/2) r = w/2;
    if (r > h/2) r = h/2;
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    return this;
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
        }

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

    // Get theme colors from the ThemeContext
    const bgColor = theme.colors.background || '#0a0e17';
    const textColor = theme.colors.text || '#ffffff';
    const textMutedColor = theme.colors.textMuted || '#4e5d78';
    
    // Parse hex color to RGB for gradient
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 10, g: 14, b: 23 };
    };

    const rgb = hexToRgb(bgColor);
    
    // Create gradient background that matches the theme
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, `rgb(${Math.min(rgb.r + 2, 255)}, ${Math.min(rgb.g + 2, 255)}, ${Math.min(rgb.b + 4, 255)})`);
    bgGrad.addColorStop(1, `rgb(${Math.max(rgb.r - 2, 0)}, ${Math.max(rgb.g - 2, 0)}, ${Math.max(rgb.b - 4, 0)})`);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const pad = { top: 25, bottom: 35, left: 15, right: 65 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const prices = ticks.map(t => t.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const paddingP = (maxP - minP) * 0.1 || 0.5;
    const minPBound = minP - paddingP;
    const maxPBound = maxP + paddingP;
    const range = maxPBound - minPBound || 1;

    const yScale = (p) => pad.top + chartH - ((p - minPBound) / range) * chartH;
    const xScale = (i) => pad.left + (i / (ticks.length - 1)) * chartW;

    // Grid lines - use theme text muted color with low opacity
    const gridColor = hexToRgb(textMutedColor);
    ctx.strokeStyle = `rgba(${gridColor.r}, ${gridColor.g}, ${gridColor.b}, 0.1)`;
    ctx.lineWidth = 1;
    
    const gridRows = 5;
    for (let i = 0; i <= gridRows; i++) {
      const y = pad.top + (i / gridRows) * chartH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
    }

    const gridCols = 10;
    for (let i = 0; i <= gridCols; i++) {
      const x = pad.left + (i / gridCols) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, height - pad.bottom);
      ctx.stroke();
    }

    const lineColor = movementDirection === 'up' ? '#00e676' : '#ff4a4a';
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    for (let i = 0; i < ticks.length; i++) {
      const x = xScale(i);
      const y = yScale(ticks[i].price);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    const lastX = xScale(ticks.length - 1);
    ctx.lineTo(lastX, height - pad.bottom);
    ctx.lineTo(pad.left, height - pad.bottom);
    ctx.closePath();

    const fillGrad = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
    fillGrad.addColorStop(0, movementDirection === 'up' ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 74, 74, 0.08)');
    fillGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    const currentPrice = ticks[ticks.length - 1].price;
    const currentY = yScale(currentPrice);

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(lastX, currentY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Dashed line
    const dashColor = hexToRgb(textColor);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = `rgba(${dashColor.r}, ${dashColor.g}, ${dashColor.b}, 0.15)`;
    ctx.beginPath();
    ctx.moveTo(lastX, currentY);
    ctx.lineTo(width - pad.right, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Price badge
    const badgeW = 55;
    const badgeH = 20;
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.roundRect(width - pad.right + 4, currentY - badgeH / 2, badgeW, badgeH, 4);
    ctx.fill();

    // Badge text color - use theme background for contrast
    ctx.fillStyle = bgColor;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentPrice.toFixed(2), width - pad.right + 4 + badgeW / 2, currentY);

    // Y-axis labels - use theme text muted color
    ctx.fillStyle = textMutedColor;
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const yTicksCount = 4;
    for (let i = 0; i <= yTicksCount; i++) {
      const targetP = maxPBound - (i / yTicksCount) * range;
      const targetY = yScale(targetP);
      ctx.fillText(targetP.toFixed(2), width - pad.right + 6, targetY);
    }

    // X-axis labels - use theme text muted color
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = textMutedColor;
    ctx.font = '10px monospace';
    
    const sampleTimes = ['08:00', '11:00', '14:00', '17:00', '20:00'];
    sampleTimes.forEach((t, idx) => {
      const posX = pad.left + (idx / (sampleTimes.length - 1)) * chartW;
      ctx.fillText(t, posX, height - pad.bottom + 6);
    });

  }, [ticks, movementDirection, theme]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectMarket = (market) => {
    setSelectedMarket(market);
    setIsDropdownOpen(false);
  };

  const allPercentages = digitStats.map(s => s.pct);
  const maxPct = Math.max(...allPercentages);
  const minPct = Math.min(...allPercentages);

  return (
    <PanelContainer>
      <Header>
        <SymbolInfo isNegative={isNegative}>
          <div className="symbol-row">
            <span className="symbol-label">Volatility Index</span>
            <div
              className="market-selector"
              isOpen={isDropdownOpen}
              onClick={toggleDropdown}
            >
              <span>{selectedMarket.name}</span>
              <span className="dropdown-arrow">▾</span>
              
              <DropdownMenu isOpen={isDropdownOpen} onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-title">Volatility Indices</div>
                {VOLATILITY_MARKETS.map((market) => (
                  <DropdownItem
                    key={market.symbol}
                    active={selectedMarket.symbol === market.symbol}
                    onClick={() => selectMarket(market)}
                  >
                    <div className="left-container">
                      <div className="candle-icon-mock">
                        <div className="candle c1" />
                        <div className="candle c2" />
                        <div className="candle c3" />
                      </div>
                      <div className="market-meta">
                        <span className="display-name">
                          {market.name.split(' (1s)')[0]} {market.isOneSec && <span className="badge-1s">1s</span>}
                        </span>
                        <span className="system-symbol">{market.symbol}</span>
                      </div>
                    </div>
                    <span className="star-fav">★</span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </div>
          </div>
          <div className="price-row">
            <span className="price">{price.toFixed(2)}</span>
            <span className="change">
              {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%)
            </span>
            <span className="change-time">• {currentTime}</span>
          </div>
        </SymbolInfo>

        <LiveIndicator>
          <span className="dot" />
          Live Feed
        </LiveIndicator>
      </Header>

      <ChartWrapper>
        <ChartCanvas ref={canvasRef} />

        <DigitStatsContainer>
          {digitStats.map((stat) => {
            const isLastDigit = stat.digit === lastDigit;
            return (
              <DigitItem
                key={stat.digit}
                isLastDigit={isLastDigit}
                isMax={stat.pct === maxPct}
                isMin={stat.pct === minPct}
                direction={movementDirection}
              >
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