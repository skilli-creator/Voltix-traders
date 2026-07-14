// src/components/LeftPanel.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const PanelContainer = styled.div`
  width: 260px;
  min-width: 260px;
  height: calc(100vh - 48px);
  background: ${props => props.theme.colors.background};
  border-right: 2px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 10px 8px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 50;
  transition: background 0.3s ease, border-color 0.3s ease;
  font-weight: 700;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 10px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    width: 180px;
    min-width: 180px;
    padding: 8px 6px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: 100%;
    padding: 6px 8px;
    border-right: none;
    background: ${props => props.theme.colors.background};
  }

  @media (max-width: 480px) {
    padding: 4px 6px;
  }
`;

const NavList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  padding: 0 2px;
  width: 100%;
  font-weight: 700;

  @media (max-width: 768px) {
    gap: 4px;
    justify-content: space-around;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  border: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  white-space: nowrap;
  font-size: 11px;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.accent};
  }

  .label {
    font-size: 11px;
    font-weight: 700;
  }

  .badge {
    font-size: 10px;
    font-weight: 700;
    padding: 0 3px;
    border-radius: 3px;
    background: ${props => props.active ? props.theme.colors.accent + '30' : props.theme.colors.backgroundSecondary};
    color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textMuted};
    &::before { content: '('; }
    &::after { content: ')'; }
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    .label { font-size: 10px; }
    .badge { font-size: 9px; }
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    .label { font-size: 9px; }
    .badge { font-size: 8px; }
  }
`;

// ===== SOUND TOGGLE BUTTON =====
const SoundToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.isMuted ? props.theme.colors.backgroundSecondary : props.theme.colors.accentActive};
  color: ${props => props.isMuted ? props.theme.colors.textMuted : props.theme.colors.accent};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 11px;
  font-weight: 700;
  margin-left: auto;
  white-space: nowrap;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.accent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  .icon {
    font-size: 14px;
    line-height: 1;
  }

  .label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    padding: 2px 6px;
    .icon { font-size: 12px; }
    .label { font-size: 8px; }
  }

  @media (max-width: 480px) {
    padding: 2px 4px;
    .icon { font-size: 10px; }
    .label { font-size: 7px; }
  }
`;

const NavItemWithSound = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 3px;
`;

const Divider = styled.div`
  height: 2px;
  background: ${props => props.theme.colors.border};
  margin: 4px 0;
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    margin: 2px 0;
  }
`;

const NoPositions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 4px;
  color: ${props => props.theme.colors.textMuted};
  text-align: center;
  font-weight: 700;

  .icon { 
    font-size: 18px; 
    margin-bottom: 2px; 
    color: ${props => props.theme.colors.textMuted + '50'}; 
  }
  .title { 
    font-size: 10px; 
    font-weight: 700; 
    color: ${props => props.theme.colors.text}; 
    margin-bottom: 1px; 
  }
  .subtitle { 
    font-size: 8px; 
    font-weight: 700;
    color: ${props => props.theme.colors.textMuted}; 
  }

  @media (max-width: 768px) {
    padding: 4px 2px;
    .icon { font-size: 14px; }
    .title { font-size: 9px; }
    .subtitle { font-size: 7px; }
  }

  @media (max-width: 480px) {
    padding: 2px 2px;
    .icon { font-size: 12px; }
    .title { font-size: 8px; }
    .subtitle { font-size: 6px; }
  }
`;

const BottomContent = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 4px;
  border-top: 2px solid ${props => props.theme.colors.border};
  transition: border-color 0.3s ease;
  font-weight: 700;

  @media (max-width: 768px) {
    gap: 1px;
    padding-top: 2px;
  }
`;

const SessionSection = styled.div`
  padding: 0 2px;
  font-weight: 700;
`;

const SessionLabel = styled.div`
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: ${props => props.theme.colors.textMuted};
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 6px;
  }
`;

const SessionPL = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.isNegative ? props.theme.colors.danger : props.theme.colors.success};

  .currency {
    font-size: 8px;
    font-weight: 700;
    color: ${props => props.theme.colors.textMuted};
    margin-left: 1px;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    .currency { font-size: 7px; }
  }

  @media (max-width: 480px) {
    font-size: 10px;
    .currency { font-size: 6px; }
  }
`;

const TradesSummary = styled.div`
  font-size: 8px;
  color: ${props => props.theme.colors.textMuted};
  padding: 0 2px;
  font-weight: 700;

  .wins { color: ${props => props.theme.colors.success}; }
  .losses { color: ${props => props.theme.colors.danger}; }

  @media (max-width: 768px) {
    font-size: 7px;
  }

  @media (max-width: 480px) {
    font-size: 6px;
  }
`;

const StatusFooter = styled.div`
  padding: 2px 2px 0 2px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${props => props.theme.colors.accent};
    animation: ${props => props.isConnected ? pulse : 'none'} 1.5s ease-in-out infinite;
    border: 1px solid ${props => props.theme.colors.accent};
  }

  .status-text {
    font-size: 8px;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 700;

    @media (max-width: 768px) {
      font-size: 7px;
    }
  }
`;

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [isConnected, setIsConnected] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

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

  const toggleSound = () => {
    setIsMuted(!isMuted);
    // Dispatch custom event for sound toggle
    const event = new CustomEvent('soundToggle', { detail: { isMuted: !isMuted } });
    window.dispatchEvent(event);
    
    // Optional: Save preference to localStorage
    localStorage.setItem('soundMuted', JSON.stringify(!isMuted));
  };

  // Load sound preference from localStorage on mount
  useEffect(() => {
    const savedMuteState = localStorage.getItem('soundMuted');
    if (savedMuteState !== null) {
      setIsMuted(JSON.parse(savedMuteState));
    }
  }, []);

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
        <NavItemWithSound>
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

          <SoundToggle 
            isMuted={isMuted} 
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Click to unmute' : 'Click to mute'}
          >
            <span className="icon">{isMuted ? '🔇' : '🔊'}</span>
            <span className="label">{isMuted ? 'Muted' : 'Sound'}</span>
          </SoundToggle>
        </NavItemWithSound>
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