// src/components/ChartPanel.jsx
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import styled, { keyframes, ThemeContext } from 'styled-components';

// ============================================
// VOLATILITY MARKETS DEFINITION
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

// Helper to reliably parse HEX colors to RGBA
const getRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== 'string') return `rgba(128, 128, 128, ${alpha})`;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(128, 128, 128, ${alpha})`;
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
};

const hexToRgb = (hex) => {
  if (!hex || typeof hex !== 'string') return { r: 128, g: 128, b: 128 };
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return isNaN(num) ? { r: 128, g: 128, b: 128 } : { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

// ============================================
// ANIMATIONS
// ============================================
const pulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// ============================================
// STYLED COMPONENTS
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
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
  animation: ${fadeIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding: 12px 18px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  z-index: 10;
  transition: background 0.2s ease, border-color 0.2s ease;

  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 8px;
  }
`;

const SymbolInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;

  .symbol-row {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }

  .symbol-label {
    font-size: 10px;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .market-selector {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: ${props => props.theme.colors.text};
    font-size: 13px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    transition: all 0.15s ease;
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    user-select: none;

    &:hover {
      border-color: ${props => props.theme.colors.accent};
      box-shadow: 0 0 12px ${props => getRgba(props.theme.colors.accent, 0.15)};
    }

    .dropdown-arrow {
      font-size: 10px;
      color: ${props => props.theme.colors.textMuted};
      transition: transform 0.2s ease;
      transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    }
  }

  .price-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
  }

  .price {
    font-size: 22px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.5px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  }

  .change {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${props => props.$isNegative ? getRgba(props.theme.colors.danger, 0.12) : getRgba(props.theme.colors.success, 0.12)};
    color: ${props => props.$isNegative ? props.theme.colors.danger : props.theme.colors.success};
    font-family: 'JetBrains Mono', monospace;
  }

  .change-time {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    font-family: monospace;
  }
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: ${props => props.theme.colors.accent};
  font-weight: 600;
  background: ${props => getRgba(props.theme.colors.accent, 0.1)};
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid ${props => getRgba(props.theme.colors.accent, 0.3)};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme.colors.accent};
    animation: ${pulse} 1.5s ease-in-out infinite;
    box-shadow: 0 0 6px ${props => props.theme.colors.accent};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  width: 260px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 12px 32px ${props => getRgba(props.theme.colors.shadow || '#000000', 0.25)};
  display: ${props => props.$isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(8px);

  .dropdown-title {
    font-size: 10px;
    font-weight: 600;
    color: ${props => props.theme.colors.textMuted};
    padding: 10px 12px 6px 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar || props.theme.colors.border};
    border-radius: 4px;
  }
`;

const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.$active ? props.theme.colors.text : props.theme.colors.textSecondary || props.theme.colors.textMuted};
  background: ${props => props.$active ? getRgba(props.theme.colors.accent, 0.12) : 'transparent'};
  transition: all 0.12s ease;
  border-bottom: 1px solid ${props => getRgba(props.theme.colors.border, 0.4)};

  &:hover {
    background: ${props => getRgba(props.theme.colors.accent, 0.1)};
    color: ${props => props.theme.colors.text};
  }

  .left-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .market-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .display-name {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }

  .system-symbol {
    font-size: 9px;
    color: ${props => props.theme.colors.textMuted};
    font-family: monospace;
  }

  .badge-1s {
    font-size: 8px;
    font-weight: 700;
    color: #ffffff;
    background: ${props => props.theme.colors.accent};
    padding: 1px 4px;
    border-radius: 3px;
    margin-left: 4px;
  }

  .star-fav {
    color: ${props => props.$active ? props.theme.colors.accent : getRgba(props.theme.colors.textMuted, 0.3)};
    font-size: 12px;
  }
`;

const ChartWrapper = styled.div`
  flex: 1;
  position: relative;
  min-height: 0;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
  z-index: 2;
`;

const ChartCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const DigitStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 24px);
  max-width: 640px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  gap: 6px;
  pointer-events: none;
  z-index: 5;
`;

const DigitItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 0;

  .circle-badge {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${props => props.theme.colors.backgroundSecondary};
    border: 1px solid ${props => 
      props.$isLastDigit 
        ? props.theme.colors.accent 
        : props.theme.colors.border
    };
    box-shadow: ${props => props.$isLastDigit ? `0 0 12px ${getRgba(props.theme.colors.accent, 0.4)}` : 'none'};
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    @media (max-width: 480px) {
      width: 28px;
      height: 28px;
    }
  }

  .digit-num {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    line-height: 1;

    @media (max-width: 480px) {
      font-size: 10px;
    }
  }

  .pct-text {
    font-size: 8px;
    font-family: monospace;
    font-weight: 600;
    color: ${props => 
      props.$isMax 
        ? props.theme.colors.accent 
        : props.theme.colors.textMuted
    };
    line-height: 1;
    margin-top: 2px;

    @media (max-width: 480px) {
      font-size: 7px;
    }
  }

  .active-arrow {
    position: absolute;
    bottom: -10px;
    font-size: 8px;
    color: ${props => props.theme.colors.accent};
    opacity: ${props => props.$isLastDigit ? 1 : 0};
    transform: ${props => props.$isLastDigit ? 'translateY(0)' : 'translateY(-3px)'};
    transition: all 0.2s ease;
  }
`;

// ============================================
// CANVAS POLYFILL
// ============================================
if (typeof window !== 'undefined' && CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
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
  const dropdownRef = useRef(null);
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
  const [currentTime, setCurrentTime] = useState('');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Market Data Simulation
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

        const priceStr = newPrice.toFixed(2);
        const currentLastDigit = parseInt(priceStr.slice(-1), 10);
        if (!isNaN(currentLastDigit)) {
          setLastDigit(currentLastDigit);
        }

        const digits = Array(10).fill(0);
        updated.forEach(t => {
          const str = t.price.toFixed(2);
          const d = parseInt(str.slice(-1), 10);
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

  // Canvas Drawing Logic
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || ticks.length < 2 || !theme || !theme.colors) return;

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

    // Dynamic Theme Colors
    const bgColor = theme.colors.background || '#0f172a';
    const textColor = theme.colors.text || '#f8fafc';
    const textMutedColor = theme.colors.textMuted || '#64748b';
    const accentColor = theme.colors.accent || '#3b82f6';
    const borderColor = theme.colors.border || '#1e293b';

    const bgRgb = hexToRgb(bgColor);
    const gridRgb = hexToRgb(borderColor);
    const accentRgb = hexToRgb(accentColor);

    // Smooth gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, `rgb(${Math.min(bgRgb.r + 4, 255)}, ${Math.min(bgRgb.g + 4, 255)}, ${Math.min(bgRgb.b + 6, 255)})`);
    bgGrad.addColorStop(1, bgColor);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const pad = { top: 20, bottom: 60, left: 15, right: 65 };
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

    // Grid lines
    ctx.strokeStyle = `rgba(${gridRgb.r}, ${gridRgb.g}, ${gridRgb.b}, 0.5)`;
    ctx.lineWidth = 1;
    
    const gridRows = 4;
    for (let i = 0; i <= gridRows; i++) {
      const y = pad.top + (i / gridRows) * chartH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
    }

    // Chart Line
    ctx.beginPath();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    for (let i = 0; i < ticks.length; i++) {
      const x = xScale(i);
      const y = yScale(ticks[i].price);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Area Fill
    const lastX = xScale(ticks.length - 1);
    ctx.lineTo(lastX, height - pad.bottom);
    ctx.lineTo(pad.left, height - pad.bottom);
    ctx.closePath();

    const fillGrad = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
    fillGrad.addColorStop(0, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.18)`);
    fillGrad.addColorStop(1, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0)`);
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Current price pulse dot
    const currentPrice = ticks[ticks.length - 1].price;
    const currentY = yScale(currentPrice);

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(lastX, currentY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Price Axis Guide Line
    const dashRgb = hexToRgb(textColor);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = `rgba(${dashRgb.r}, ${dashRgb.g}, ${dashRgb.b}, 0.15)`;
    ctx.beginPath();
    ctx.moveTo(lastX, currentY);
    ctx.lineTo(width - pad.right, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Price Badge
    const badgeW = 54;
    const badgeH = 18;
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(width - pad.right + 4, currentY - badgeH / 2, badgeW, badgeH, 4);
    ctx.fill();

    // Badge Text
    ctx.fillStyle = bgColor;
    ctx.font = '600 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentPrice.toFixed(2), width - pad.right + 4 + badgeW / 2, currentY);

    // Y-axis Labels
    ctx.fillStyle = textMutedColor;
    ctx.font = '500 9px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const yTicksCount = 4;
    for (let i = 0; i <= yTicksCount; i++) {
      const targetP = maxPBound - (i / yTicksCount) * range;
      const targetY = yScale(targetP);
      ctx.fillText(targetP.toFixed(2), width - pad.right + 6, targetY);
    }
  }, [ticks, theme]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => drawChart();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawChart]);

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
        <SymbolInfo $isNegative={isNegative}>
          <div className="symbol-row" ref={dropdownRef}>
            <span className="symbol-label">Volatility Index</span>
            <div
              className="market-selector"
              $isOpen={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedMarket.name}</span>
              <span className="dropdown-arrow">▾</span>
            </div>

            <DropdownMenu $isOpen={isDropdownOpen} onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-title">Volatility Indices</div>
              {VOLATILITY_MARKETS.map((market) => (
                <DropdownItem
                  key={market.symbol}
                  $active={selectedMarket.symbol === market.symbol}
                  onClick={() => selectMarket(market)}
                >
                  <div className="left-container">
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
                $isLastDigit={isLastDigit}
                $isMax={stat.pct === maxPct}
                $isMin={stat.pct === minPct}
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