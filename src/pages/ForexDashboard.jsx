// frontend/src/pages/ForexDashboard.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { FaChartLine, FaArrowUp, FaArrowDown, FaExchangeAlt, 
  FaClock, FaWallet, FaCog, FaSignOutAlt, FaBell, FaSearch,
  FaStar, FaStarHalf, FaLightbulb, FaShieldAlt, FaGlobe } from 'react-icons/fa';

// ============================================
// STYLED COMPONENTS
// ============================================

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a0e1a;
    color: #e8edf5;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #131926;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #f7931a, #fbb731);
    border-radius: 4px;
  }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(247, 147, 26, 0.1); }
  50% { box-shadow: 0 0 40px rgba(247, 147, 26, 0.3); }
`;

const shimmerLine = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const floatPulse = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const tickerScroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

// ============================================
// LAYOUT COMPONENTS
// ============================================

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0a0e1a;
`;

const Sidebar = styled.div`
  width: 240px;
  background: linear-gradient(180deg, #0f1525, #0a0e1a);
  border-right: 1px solid rgba(255, 255, 255, 0.03);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    width: 280px;
  }
`;

const SidebarOverlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  margin-bottom: 24px;

  .logo-icon {
    font-size: 28px;
    color: #f7931a;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 800;
    background: linear-gradient(135deg, #f7931a, #fbb731);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .logo-sub {
    font-size: 9px;
    color: #6a7a8e;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const NavSection = styled.div`
  flex: 1;
`;

const NavLabel = styled.div`
  font-size: 10px;
  color: #4a5a6e;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px 12px 8px;
  font-weight: 600;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#f7931a' : '#8a9aae'};
  background: ${props => props.active ? 'rgba(247, 147, 26, 0.06)' : 'transparent'};
  margin-bottom: 2px;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
    color: #e8edf5;
  }

  .nav-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }

  .nav-text {
    font-size: 13px;
    font-weight: 500;
  }

  .nav-badge {
    margin-left: auto;
    background: #f7931a;
    color: #0a0e1a;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 12px;
  }

  ${props => props.active && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 20%;
      height: 60%;
      width: 3px;
      background: linear-gradient(180deg, #f7931a, #fbb731);
      border-radius: 0 4px 4px 0;
    }
  `}
`;

const SidebarFooter = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  padding-top: 16px;
  margin-top: auto;
`;

// ============================================
// MAIN CONTENT
// ============================================

const MainContent = styled.div`
  flex: 1;
  margin-left: 240px;
  padding: 20px 28px 40px;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .menu-toggle {
    display: none;
    background: none;
    border: none;
    color: #e8edf5;
    font-size: 24px;
    cursor: pointer;
    padding: 4px 8px;

    @media (max-width: 768px) {
      display: block;
    }
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #e8edf5;
  }

  .page-subtitle {
    font-size: 13px;
    color: #6a7a8e;
  }
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MarketStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.08);
  border-radius: 30px;
  font-size: 11px;
  color: #4ade80;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 30px;
  padding: 6px 16px;

  input {
    background: transparent;
    border: none;
    color: #e8edf5;
    font-size: 12px;
    outline: none;
    width: 140px;

    &::placeholder {
      color: #4a5a6e;
    }
  }

  svg {
    color: #4a5a6e;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    input { width: 80px; }
  }
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a9aae;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #e8edf5;
  }

  .notification-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ef4444;
    border: 1px solid #0a0e1a;
  }
`;

// ============================================
// TICKER TAPE
// ============================================

const TickerTape = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 8px 0;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(90deg, #0a0e1a, transparent);
    z-index: 2;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(270deg, #0a0e1a, transparent);
    z-index: 2;
    pointer-events: none;
  }
`;

const TickerContent = styled.div`
  display: flex;
  gap: 40px;
  animation: ${tickerScroll} 60s linear infinite;
  white-space: nowrap;
  width: max-content;
`;

const TickerItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;

  .pair {
    font-weight: 600;
    color: #e8edf5;
  }

  .price {
    font-weight: 500;
    color: #8a9aae;
  }

  .change {
    font-weight: 600;
    color: ${props => props.change > 0 ? '#4ade80' : props.change < 0 ? '#f87171' : '#8a9aae'};
  }
`;

// ============================================
// STATS CARDS
// ============================================

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 18px 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    transform: translateY(-2px);
  }

  .stat-label {
    font-size: 11px;
    color: #6a7a8e;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    margin-top: 6px;
    color: #e8edf5;
  }

  .stat-change {
    font-size: 12px;
    font-weight: 500;
    margin-top: 4px;
    color: ${props => props.change > 0 ? '#4ade80' : props.change < 0 ? '#f87171' : '#6a7a8e'};
  }

  .stat-icon {
    float: right;
    font-size: 28px;
    opacity: 0.3;
    color: #f7931a;
  }
`;

// ============================================
// TRADING GRID
// ============================================

const TradingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div``;

const RightPanel = styled.div``;

// ============================================
// CHART SECTION
// ============================================

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ChartTitle = styled.div`
  .pair-name {
    font-size: 18px;
    font-weight: 700;
    color: #e8edf5;
  }

  .pair-price {
    font-size: 28px;
    font-weight: 700;
    margin-left: 12px;
    color: ${props => props.change > 0 ? '#4ade80' : props.change < 0 ? '#f87171' : '#e8edf5'};
  }

  .pair-change {
    font-size: 14px;
    font-weight: 500;
    margin-left: 8px;
    color: ${props => props.change > 0 ? '#4ade80' : props.change < 0 ? '#f87171' : '#6a7a8e'};
  }
`;

const ChartControls = styled.div`
  display: flex;
  gap: 6px;
`;

const ChartButton = styled.button`
  background: ${props => props.active ? 'rgba(247, 147, 26, 0.12)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(247, 147, 26, 0.15)' : 'rgba(255, 255, 255, 0.04)'};
  color: ${props => props.active ? '#f7931a' : '#6a7a8e'};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #e8edf5;
    border-color: rgba(255, 255, 255, 0.08);
  }
`;

const ChartArea = styled.div`
  height: 320px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a5a6e;
  font-size: 14px;
  position: relative;
  overflow: hidden;

  .chart-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    svg {
      font-size: 48px;
      opacity: 0.1;
    }
  }

  .chart-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(0deg, rgba(247, 147, 26, 0.03), transparent);
    
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #f7931a, #fbb731);
      box-shadow: 0 0 40px rgba(247, 147, 26, 0.1);
    }
  }
`;

// ============================================
// ORDER BOOK / TRADING PANEL
// ============================================

const TradingPanel = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 20px;
`;

const PanelTabs = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  padding-bottom: 12px;
`;

const PanelTab = styled.button`
  background: ${props => props.active ? 'rgba(247, 147, 26, 0.06)' : 'transparent'};
  border: none;
  color: ${props => props.active ? '#f7931a' : '#6a7a8e'};
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #e8edf5;
  }
`;

const PriceDisplay = styled.div`
  text-align: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  margin-bottom: 16px;

  .bid-price {
    font-size: 24px;
    font-weight: 700;
    color: #4ade80;
  }

  .ask-price {
    font-size: 24px;
    font-weight: 700;
    color: #f87171;
  }

  .spread {
    font-size: 11px;
    color: #6a7a8e;
    margin-top: 4px;
  }

  .pair-label {
    font-size: 12px;
    color: #6a7a8e;
    font-weight: 500;
  }
`;

const OrderInput = styled.div`
  margin-bottom: 12px;

  label {
    font-size: 11px;
    color: #6a7a8e;
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
  }

  input {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 10px;
    padding: 8px 12px;
    color: #e8edf5;
    font-size: 14px;
    outline: none;
    transition: all 0.3s ease;

    &:focus {
      border-color: rgba(247, 147, 26, 0.2);
    }
  }
`;

const OrderButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
`;

const OrderButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.type === 'buy' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
  color: ${props => props.type === 'buy' ? '#4ade80' : '#f87171'};
  border: 1px solid ${props => props.type === 'buy' ? 'rgba(34, 197, 94, 0.06)' : 'rgba(239, 68, 68, 0.06)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.type === 'buy' 
      ? '0 8px 30px rgba(34, 197, 94, 0.15)' 
      : '0 8px 30px rgba(239, 68, 68, 0.15)'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const QuickAmounts = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 8px 0;

  button {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.03);
    color: #6a7a8e;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: #e8edf5;
      border-color: rgba(255, 255, 255, 0.06);
    }
  }
`;

// ============================================
// OPEN POSITIONS
// ============================================

const PositionsSection = styled.div`
  margin-top: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #8a9aae;
  }

  span {
    font-size: 11px;
    color: #6a7a8e;
  }
`;

const PositionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.01);
  border-radius: 12px;
  margin-bottom: 6px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .pos-pair {
    font-size: 13px;
    font-weight: 600;
  }

  .pos-type {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
    background: ${props => props.type === 'BUY' ? 'rgba(34, 197, 94, 0.06)' : 'rgba(239, 68, 68, 0.06)'};
    color: ${props => props.type === 'BUY' ? '#4ade80' : '#f87171'};
  }

  .pos-pnl {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.pnl > 0 ? '#4ade80' : props.pnl < 0 ? '#f87171' : '#6a7a8e'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 0;
  color: #4a5a6e;
  font-size: 13px;

  svg {
    font-size: 32px;
    opacity: 0.2;
    margin-bottom: 8px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const ForexDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [marketData, setMarketData] = useState({});
  const [wsConnected, setWsConnected] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [tradeAmount, setTradeAmount] = useState(100);
  const [positions, setPositions] = useState([]);
  const [activeTab, setActiveTab] = useState('trade');
  const [chartTimeframe, setChartTimeframe] = useState('1D');

  const wsRef = useRef(null);

  const forexPairs = [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar' },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar' },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar' },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
  ];

  // Mock price data (replace with real WebSocket)
  const generatePrice = (base) => {
    const change = (Math.random() - 0.5) * 0.002;
    return {
      bid: base * (1 + change - 0.0001),
      ask: base * (1 + change + 0.0001),
      price: base * (1 + change),
      change: change,
      changePercent: change * 100,
    };
  };

  const mockPrices = {
    'EUR/USD': 1.0925,
    'GBP/USD': 1.2850,
    'USD/JPY': 148.50,
    'AUD/USD': 0.6650,
    'USD/CAD': 1.3450,
    'USD/CHF': 0.8750,
  };

  useEffect(() => {
    // Connect to WebSocket
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:5000');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'forex_update') {
            setMarketData(data.data);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPrices = {};
      forexPairs.forEach(pair => {
        const basePrice = mockPrices[pair.symbol] || 1.0;
        const priceData = generatePrice(basePrice);
        updatedPrices[pair.symbol] = {
          ...priceData,
          symbol: pair.symbol,
        };
        mockPrices[pair.symbol] = priceData.price;
      });
      setMarketData(updatedPrices);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTrade = (type) => {
    const price = marketData[selectedPair]?.price || 0;
    if (!price) return;

    const newPosition = {
      id: Date.now(),
      pair: selectedPair,
      type: type,
      price: price,
      amount: tradeAmount,
      timestamp: new Date().toISOString(),
    };

    setPositions([newPosition, ...positions]);
    setBalance(balance - (type === 'BUY' ? tradeAmount : 0));
  };

  const getCurrentPrice = (symbol) => {
    return marketData[symbol]?.price || 0;
  };

  const getChangePercent = (symbol) => {
    return marketData[symbol]?.changePercent || 0;
  };

  const getPriceColor = (change) => {
    if (change > 0) return '#4ade80';
    if (change < 0) return '#f87171';
    return '#6a7a8e';
  };

  const selectedPrice = marketData[selectedPair] || {};

  return (
    <>
      <GlobalStyle />
      <DashboardWrapper>
        {/* Sidebar */}
        <SidebarOverlay 
          isOpen={isSidebarOpen} 
          onClick={() => setIsSidebarOpen(false)}
        />
        <Sidebar isOpen={isSidebarOpen}>
          <Logo>
            <span className="logo-icon">⚡</span>
            <div>
              <div className="logo-text">Voltix Traders</div>
              <div className="logo-sub">Forex</div>
            </div>
          </Logo>

          <NavSection>
            <NavLabel>Main</NavLabel>
            <NavItem active>
              <span className="nav-icon"><FaChartLine /></span>
              <span className="nav-text">Dashboard</span>
            </NavItem>
            <NavItem>
              <span className="nav-icon"><FaExchangeAlt /></span>
              <span className="nav-text">Trading</span>
              <span className="nav-badge">Live</span>
            </NavItem>
            <NavItem>
              <span className="nav-icon"><FaWallet /></span>
              <span className="nav-text">Portfolio</span>
            </NavItem>

            <NavLabel>Markets</NavLabel>
            {forexPairs.map(pair => (
              <NavItem 
                key={pair.symbol}
                active={selectedPair === pair.symbol}
                onClick={() => setSelectedPair(pair.symbol)}
              >
                <span className="nav-text">{pair.symbol}</span>
                <span className="nav-text" style={{ 
                  marginLeft: 'auto', 
                  fontSize: '11px',
                  color: getPriceColor(getChangePercent(pair.symbol))
                }}>
                  {getChangePercent(pair.symbol) > 0 ? '+' : ''}{getChangePercent(pair.symbol).toFixed(2)}%
                </span>
              </NavItem>
            ))}
          </NavSection>

          <SidebarFooter>
            <NavItem onClick={() => navigate('/settings')}>
              <span className="nav-icon"><FaCog /></span>
              <span className="nav-text">Settings</span>
            </NavItem>
            <NavItem>
              <span className="nav-icon"><FaSignOutAlt /></span>
              <span className="nav-text">Logout</span>
            </NavItem>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <MainContent>
          <TopBar>
            <TopBarLeft>
              <button 
                className="menu-toggle"
                onClick={() => setIsSidebarOpen(true)}
              >
                ☰
              </button>
              <div>
                <div className="page-title">Forex Trading</div>
                <div className="page-subtitle">Real-time currency trading dashboard</div>
              </div>
            </TopBarLeft>
            <TopBarRight>
              <MarketStatus>
                <span className="status-dot" />
                {wsConnected ? 'Live' : 'Connecting...'}
              </MarketStatus>
              <SearchBar>
                <FaSearch />
                <input placeholder="Search pairs..." />
              </SearchBar>
              <IconButton>
                <FaBell />
                <span className="notification-dot" />
              </IconButton>
              <IconButton>
                <FaGlobe />
              </IconButton>
            </TopBarRight>
          </TopBar>

          {/* Ticker Tape */}
          <TickerTape>
            <TickerContent>
              {forexPairs.map(pair => (
                <TickerItem 
                  key={pair.symbol}
                  change={getChangePercent(pair.symbol)}
                >
                  <span className="pair">{pair.symbol}</span>
                  <span className="price">{getCurrentPrice(pair.symbol).toFixed(5)}</span>
                  <span className="change">
                    {getChangePercent(pair.symbol) > 0 ? '+' : ''}
                    {getChangePercent(pair.symbol).toFixed(2)}%
                  </span>
                </TickerItem>
              ))}
              {/* Duplicate for seamless loop */}
              {forexPairs.map(pair => (
                <TickerItem 
                  key={pair.symbol + '-dup'}
                  change={getChangePercent(pair.symbol)}
                >
                  <span className="pair">{pair.symbol}</span>
                  <span className="price">{getCurrentPrice(pair.symbol).toFixed(5)}</span>
                  <span className="change">
                    {getChangePercent(pair.symbol) > 0 ? '+' : ''}
                    {getChangePercent(pair.symbol).toFixed(2)}%
                  </span>
                </TickerItem>
              ))}
            </TickerContent>
          </TickerTape>

          {/* Stats Grid */}
          <StatsGrid>
            <StatCard change={2.4}>
              <FaWallet className="stat-icon" />
              <div className="stat-label">Balance</div>
              <div className="stat-value">${balance.toFixed(2)}</div>
              <div className="stat-change">+2.4% today</div>
            </StatCard>
            <StatCard change={1.8}>
              <FaChartLine className="stat-icon" />
              <div className="stat-label">Equity</div>
              <div className="stat-value">${(balance * 1.12).toFixed(2)}</div>
              <div className="stat-change">+1.8% today</div>
            </StatCard>
            <StatCard change={-0.5}>
              <FaExchangeAlt className="stat-icon" />
              <div className="stat-label">Open Trades</div>
              <div className="stat-value">{positions.length}</div>
              <div className="stat-change">-0.5% today</div>
            </StatCard>
            <StatCard change={3.1}>
              <FaLightbulb className="stat-icon" />
              <div className="stat-label">Win Rate</div>
              <div className="stat-value">68%</div>
              <div className="stat-change">+3.1% this week</div>
            </StatCard>
          </StatsGrid>

          {/* Trading Grid */}
          <TradingGrid>
            <LeftPanel>
              {/* Chart */}
              <ChartContainer>
                <ChartHeader>
                  <ChartTitle change={selectedPrice.change || 0}>
                    <span className="pair-name">{selectedPair}</span>
                    <span className="pair-price">
                      {selectedPrice.price?.toFixed(5) || '0.00000'}
                    </span>
                    <span className="pair-change">
                      {selectedPrice.changePercent > 0 ? '+' : ''}
                      {selectedPrice.changePercent?.toFixed(2) || '0.00'}%
                    </span>
                  </ChartTitle>
                  <ChartControls>
                    {['1D', '1W', '1M', '3M', '1Y'].map(tf => (
                      <ChartButton 
                        key={tf}
                        active={chartTimeframe === tf}
                        onClick={() => setChartTimeframe(tf)}
                      >
                        {tf}
                      </ChartButton>
                    ))}
                  </ChartControls>
                </ChartHeader>
                <ChartArea>
                  <div className="chart-placeholder">
                    <FaChartLine />
                    <span>Live chart will render here</span>
                    <span style={{ fontSize: '11px', color: '#4a5a6e' }}>
                      {selectedPair} • {chartTimeframe}
                    </span>
                  </div>
                  <div className="chart-line" />
                </ChartArea>
              </ChartContainer>
            </LeftPanel>

            {/* Right Panel - Trading */}
            <RightPanel>
              <TradingPanel>
                <PanelTabs>
                  <PanelTab 
                    active={activeTab === 'trade'}
                    onClick={() => setActiveTab('trade')}
                  >
                    Trade
                  </PanelTab>
                  <PanelTab 
                    active={activeTab === 'positions'}
                    onClick={() => setActiveTab('positions')}
                  >
                    Positions
                  </PanelTab>
                </PanelTabs>

                {activeTab === 'trade' ? (
                  <>
                    <PriceDisplay>
                      <div>
                        <span className="pair-label">BID</span>
                        <div className="bid-price">
                          {selectedPrice.bid?.toFixed(5) || '0.00000'}
                        </div>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <span className="pair-label">ASK</span>
                        <div className="ask-price">
                          {selectedPrice.ask?.toFixed(5) || '0.00000'}
                        </div>
                      </div>
                      <div className="spread">
                        Spread: {((selectedPrice.ask || 0) - (selectedPrice.bid || 0)).toFixed(5)}
                      </div>
                    </PriceDisplay>

                    <OrderInput>
                      <label>Amount (USD)</label>
                      <input 
                        type="number" 
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(Number(e.target.value))}
                        min="1"
                      />
                    </OrderInput>

                    <QuickAmounts>
                      {[10, 50, 100, 500, 1000].map(amount => (
                        <button 
                          key={amount}
                          onClick={() => setTradeAmount(amount)}
                        >
                          ${amount}
                        </button>
                      ))}
                    </QuickAmounts>

                    <OrderButtons>
                      <OrderButton 
                        type="buy" 
                        onClick={() => handleTrade('BUY')}
                      >
                        <FaArrowUp style={{ marginRight: '6px' }} />
                        BUY
                      </OrderButton>
                      <OrderButton 
                        type="sell" 
                        onClick={() => handleTrade('SELL')}
                      >
                        <FaArrowDown style={{ marginRight: '6px' }} />
                        SELL
                      </OrderButton>
                    </OrderButtons>
                  </>
                ) : (
                  <PositionsSection>
                    <SectionHeader>
                      <h3>Open Positions</h3>
                      <span>{positions.length} positions</span>
                    </SectionHeader>
                    {positions.length > 0 ? (
                      positions.map(pos => (
                        <PositionItem 
                          key={pos.id}
                          type={pos.type}
                          pnl={pos.type === 'BUY' ? 2.5 : -1.2}
                        >
                          <div>
                            <div className="pos-pair">{pos.pair}</div>
                            <div className="pos-type">{pos.type}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '13px' }}>
                              ${pos.amount}
                            </div>
                            <div className="pos-pnl">
                              {pos.type === 'BUY' ? '+' : '-'}${
                                (pos.type === 'BUY' ? 2.5 : 1.2).toFixed(2)
                              }
                            </div>
                          </div>
                        </PositionItem>
                      ))
                    ) : (
                      <EmptyState>
                        <FaChartLine />
                        <div>No open positions</div>
                        <div style={{ fontSize: '11px' }}>
                          Place a trade to get started
                        </div>
                      </EmptyState>
                    )}
                  </PositionsSection>
                )}
              </TradingPanel>
            </RightPanel>
          </TradingGrid>
        </MainContent>
      </DashboardWrapper>
    </>
  );
};

export default ForexDashboard;