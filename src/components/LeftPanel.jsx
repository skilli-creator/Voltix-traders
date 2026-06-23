import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// KEYFRAMES
// ============================================

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const PanelContainer = styled.div`
  width: 260px;
  min-width: 260px;
  height: calc(100vh - 48px);
  background: #0d1117;
  border-right: 1px solid #1e2a3a;
  display: flex;
  flex-direction: column;
  padding: 10px 4px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 50;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    width: 56px;
    min-width: 56px;
    padding: 12px 8px;
  }
`;

// ===== NAVIGATION (FIXED SPACING + FONT) =====
const NavList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  padding: 0 2px;
  width: 100%;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;

  color: ${props => props.active ? '#d1d4dc' : '#787b86'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.06)' : 'transparent'};
  border: ${props => props.active ? '1px solid rgba(41, 98, 255, 0.08)' : 'none'};

  flex: unset; /* IMPORTANT: prevents wide spacing */
  white-space: nowrap;
  font-size: 11px;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #d1d4dc;
  }

  .label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0;
  }

  .badge {
    font-size: 10px;
    font-weight: 500;
    padding: 0 3px;
    border-radius: 3px;
    margin-left: 2px;
    background: ${props => props.active ? 'rgba(41, 98, 255, 0.2)' : 'rgba(255,255,255,0.06)'};
    color: ${props => props.active ? '#2962ff' : '#787b86'};

    &::before { content: '('; }
    &::after { content: ')'; }
  }

  @media (max-width: 768px) {
    padding: 6px 4px;
    .label, .badge { display: none; }
  }
`;

// ===== DIVIDER =====
const Divider = styled.div`
  height: 1px;
  background: #1e2a3a;
  margin: 4px 0;
`;

// ===== NO OPEN POSITIONS =====
const NoPositions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 2px;
  color: #787b86;
  text-align: center;

  .icon { font-size: 16px; margin-bottom: 2px; color: #2a2d3e; }
  .title { font-size: 9px; font-weight: 500; color: #d1d4dc; margin-bottom: 1px; }
  .subtitle { font-size: 7px; color: #787b86; }
`;

// ===== BOTTOM CONTENT =====
const BottomContent = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 4px;
  border-top: 1px solid #1e2a3a;
`;

const SessionSection = styled.div`
  padding: 0 2px;
`;

const SessionLabel = styled.div`
  font-size: 6px;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  color: #787b86;
`;

const SessionPL = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.isNegative ? '#ff4757' : '#00b894'};

  .currency {
    font-size: 8px;
    font-weight: 400;
    color: #787b86;
    margin-left: 1px;
  }
`;

const TradesSummary = styled.div`
  font-size: 7px;
  color: #787b86;
  padding: 0 2px;

  .wins { color: #00b894; }
  .losses { color: #ff4757; }
`;

const StatusFooter = styled.div`
  padding: 2px 2px 0 2px;
  display: flex;
  align-items: center;
  gap: 3px;

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${props => props.isConnected ? '#00b894' : '#ff4757'};
    animation: ${props => props.isConnected ? pulse : 'none'} 1.5s ease-in-out infinite;
  }

  .status-text {
    font-size: 7px;
    color: #787b86;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [isConnected, setIsConnected] = useState(true);

  const [data, setData] = useState({
    openCount: 0,
    closedCount: 8,
    sessionPL: -1270.00,
    openPositions: 0,
    trades: { wins: 0, losses: 7, total: 7 }
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        sessionPL: prev.sessionPL + (Math.random() - 0.5) * 5,
        openPositions: Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isNegative = data.sessionPL < 0;

  return (
    <PanelContainer>
      <NavList>
        <NavItem active={activeTab === 'open'} onClick={() => handleTabClick('open')}>
          <span className="label">Open</span>
          <span className="badge">{data.openCount}</span>
        </NavItem>

        <NavItem active={activeTab === 'closed'} onClick={() => handleTabClick('closed')}>
          <span className="label">Closed</span>
          <span className="badge">{data.closedCount}</span>
        </NavItem>

        <NavItem active={activeTab === 'transactions'} onClick={() => handleTabClick('transactions')}>
          <span className="label">Transactions</span>
        </NavItem>
      </NavList>

      <Divider />

      <NoPositions>
        <div className="icon">📭</div>
        <div className="title">No open positions</div>
        <div className="subtitle">Your active trades will appear here</div>
      </NoPositions>

      <Divider />

      <BottomContent>
        <SessionSection>
          <SessionLabel>Last Session</SessionLabel>
          <SessionPL isNegative={isNegative}>
            {isNegative ? '-' : ''}${Math.abs(data.sessionPL).toFixed(2)}
            <span className="currency">USD</span>
          </SessionPL>
        </SessionSection>

        <TradesSummary>
          {data.trades.total} trades (
          <span className="wins">{data.trades.wins}W</span> /{' '}
          <span className="losses">{data.trades.losses}L</span>)
        </TradesSummary>

        <StatusFooter isConnected={isConnected}>
          <span className="dot" />
          <span className="status-text">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </StatusFooter>
      </BottomContent>
    </PanelContainer>
  );
};

export default LeftPanel;