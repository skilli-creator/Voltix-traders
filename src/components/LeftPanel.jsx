// src/components/LeftPanel.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${props => props.theme?.colors?.accent + '20' || 'rgba(41,98,255,0.1)'}; }
  50% { box-shadow: 0 0 40px ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'}; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PanelContainer = styled.div`
  width: 280px;
  min-width: 280px;
  height: calc(100vh - 48px);
  background: ${props => props.theme.colors.background};
  border-right: 2px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 50;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      ${props => props.theme.colors.accent}, 
      ${props => props.theme.colors.accent + '60'}, 
      ${props => props.theme.colors.accent}
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 10px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    width: 200px;
    min-width: 200px;
    padding: 12px 8px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: 100%;
    padding: 10px 12px;
    border-right: none;
    background: ${props => props.theme.colors.background};

    &::before {
      display: none;
    }
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;

// ===== NAVIGATION TABS =====
const NavList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  padding: 4px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  margin-bottom: 8px;
  font-weight: 700;

  @media (max-width: 768px) {
    gap: 3px;
    padding: 3px;
    border-radius: 10px;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    gap: 2px;
    padding: 2px;
    border-radius: 8px;
    margin-bottom: 4px;
  }
`;

const NavItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
  background: ${props => props.active ? `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent + 'dd'})` : 'transparent'};
  border: none;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 700;
  position: relative;
  overflow: hidden;

  ${props => props.active && `
    box-shadow: 0 4px 16px ${props.theme.colors.accent + '40'};
    animation: ${glowPulse} 2s ease-in-out infinite;
  `}

  &:hover {
    background: ${props => props.active ? `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent + 'dd'})` : props.theme.colors.accentActive};
    color: ${props => props.active ? props.theme.colors.text : props.theme.colors.text};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }

  .label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  .badge {
    font-size: 9px;
    font-weight: 700;
    padding: 1px 8px;
    border-radius: 12px;
    background: ${props => props.active ? 'rgba(255,255,255,0.2)' : props.theme.colors.backgroundSecondary};
    color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
    transition: all 0.2s ease;
  }

  @media (max-width: 768px) {
    padding: 6px 8px;
    border-radius: 6px;
    .label { font-size: 10px; }
    .badge { font-size: 8px; padding: 1px 6px; }
  }

  @media (max-width: 480px) {
    padding: 5px 6px;
    border-radius: 5px;
    .label { font-size: 9px; }
    .badge { font-size: 7px; padding: 1px 5px; }
  }
`;

const Divider = styled.div`
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    ${props => props.theme.colors.border}, 
    transparent
  );
  margin: 6px 0;
  transition: background 0.3s ease;
  opacity: 0.6;

  @media (max-width: 768px) {
    margin: 4px 0;
  }
`;

// ===== NO POSITIONS =====
const NoPositions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  margin: 8px 0;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 2px dashed ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent + '40'};
    background: ${props => props.theme.colors.accentActive};
  }

  .icon { 
    font-size: 32px; 
    margin-bottom: 8px;
    opacity: 0.6;
    transition: all 0.3s ease;
  }

  &:hover .icon {
    opacity: 1;
    transform: scale(1.1);
  }

  .title { 
    font-size: 12px; 
    font-weight: 700; 
    color: ${props => props.theme.colors.text}; 
    margin-bottom: 2px; 
    letter-spacing: 0.3px;
  }

  .subtitle { 
    font-size: 9px; 
    font-weight: 700;
    color: ${props => props.theme.colors.textMuted}; 
    letter-spacing: 0.2px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
    margin: 4px 0;
    border-radius: 10px;
    .icon { font-size: 24px; margin-bottom: 6px; }
    .title { font-size: 11px; }
    .subtitle { font-size: 8px; }
  }

  @media (max-width: 480px) {
    padding: 12px 10px;
    border-radius: 8px;
    .icon { font-size: 20px; margin-bottom: 4px; }
    .title { font-size: 10px; }
    .subtitle { font-size: 7px; }
  }
`;

// ===== BOTTOM CONTENT =====
const BottomContent = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 8px;
  border-top: 2px solid ${props => props.theme.colors.border};
  transition: border-color 0.3s ease;
  font-weight: 700;
  animation: ${slideUp} 0.4s ease;

  @media (max-width: 768px) {
    gap: 4px;
    padding-top: 6px;
  }

  @media (max-width: 480px) {
    gap: 3px;
    padding-top: 4px;
  }
`;

// ===== SESSION SECTION =====
const SessionSection = styled.div`
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 10px;
  border: 2px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent + '30'};
    background: ${props => props.theme.colors.accentActive};
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    border-radius: 6px;
  }
`;

const SessionLabel = styled.div`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${props => props.theme.colors.textMuted};
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 7px;
    letter-spacing: 0.6px;
  }
`;

const SessionPL = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.isNegative ? props.theme.colors.danger : props.theme.colors.success};
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 2px;

  .currency {
    font-size: 10px;
    font-weight: 700;
    color: ${props => props.theme.colors.textMuted};
    opacity: 0.6;
  }

  .change-indicator {
    font-size: 12px;
    margin-left: 4px;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    .currency { font-size: 9px; }
    .change-indicator { font-size: 10px; }
  }

  @media (max-width: 480px) {
    font-size: 13px;
    .currency { font-size: 8px; }
    .change-indicator { font-size: 9px; }
  }
`;

// ===== TRADES SUMMARY =====
const TradesSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 10px;
  border: 2px solid ${props => props.theme.colors.border};
  font-size: 9px;
  font-weight: 700;
  color: ${props => props.theme.colors.textMuted};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent + '30'};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stats {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .wins { 
    color: ${props => props.theme.colors.success};
    font-weight: 700;
  }

  .losses { 
    color: ${props => props.theme.colors.danger};
    font-weight: 700;
  }

  .win-rate {
    font-size: 8px;
    padding: 2px 8px;
    border-radius: 12px;
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.accent};
  }

  @media (max-width: 768px) {
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 8px;
    .win-rate { font-size: 7px; padding: 1px 6px; }
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 7px;
    .win-rate { font-size: 6px; padding: 1px 5px; }
  }
`;

// ===== SOUND FOOTER =====
const SoundFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${props => props.theme.colors.accent};
    background: ${props => props.theme.colors.accentActive};
    transform: translateY(-1px);
    box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};
  }

  .status-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.theme.colors.accent};
    animation: ${props => props.isConnected ? pulse : 'none'} 1.5s ease-in-out infinite;
    border: 2px solid ${props => props.theme.colors.accent};
    box-shadow: 0 0 12px ${props => props.theme.colors.accent + '40'};
  }

  .status-text {
    font-size: 9px;
    font-weight: 700;
    color: ${props => props.theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 768px) {
      font-size: 8px;
    }
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    border-radius: 6px;
  }
`;

const SoundIconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 2px solid ${props => props.isMuted ? props.theme.colors.border : props.theme.colors.accent};
  background: ${props => props.isMuted ? 'transparent' : props.theme.colors.accentActive};
  color: ${props => props.isMuted ? props.theme.colors.textMuted : props.theme.colors.accent};
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;

  &:hover {
    transform: scale(1.05);
    border-color: ${props => props.theme.colors.accent};
    background: ${props => props.theme.colors.accentActive};
    box-shadow: 0 4px 16px ${props => props.isMuted ? 'transparent' : props.theme.colors.accent + '40'};
  }

  &:active {
    transform: scale(0.95);
  }

  .icon {
    font-size: 18px;
    line-height: 1;
    transition: all 0.3s ease;
  }

  .label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    .icon { font-size: 16px; }
    .label { font-size: 8px; }
  }

  @media (max-width: 480px) {
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 11px;
    gap: 4px;
    .icon { font-size: 14px; }
    .label { font-size: 7px; }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

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
    const event = new CustomEvent('soundToggle', { detail: { isMuted: !isMuted } });
    window.dispatchEvent(event);
    localStorage.setItem('soundMuted', JSON.stringify(!isMuted));
  };

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
  const winRate = data.trades.total > 0 
    ? Math.round((data.trades.wins / data.trades.total) * 100) 
    : 0;

  return (
    <PanelContainer>
      <NavList>
        <NavItem 
          active={activeTab === 'open'} 
          onClick={() => handleTabClick('open')}
        >
          <span className="label">📊 Open</span>
          <span className="badge">{data.openCount}</span>
        </NavItem>

        <NavItem 
          active={activeTab === 'closed'} 
          onClick={() => handleTabClick('closed')}
        >
          <span className="label">✅ Closed</span>
          <span className="badge">{data.closedCount}</span>
        </NavItem>

        <NavItem 
          active={activeTab === 'transactions'} 
          onClick={() => handleTabClick('transactions')}
        >
          <span className="label">📋 History</span>
        </NavItem>
      </NavList>

      <NoPositions>
        <div className="icon">📭</div>
        <div className="title">No Active Positions</div>
        <div className="subtitle">Your trades will appear here</div>
      </NoPositions>

      <Divider />

      <BottomContent>
        <SessionSection>
          <SessionLabel>📈 Session Performance</SessionLabel>
          <SessionPL isNegative={isNegative}>
            {isNegative ? '−' : '+'}${Math.abs(data.sessionPL).toFixed(2)}
            <span className="currency">USD</span>
            <span className="change-indicator">
              {isNegative ? '↓' : '↑'}
            </span>
          </SessionPL>
        </SessionSection>

        <TradesSummary>
          <div className="left">
            <span>📊 Trades</span>
            <span className="stats">
              <span className="wins">{data.trades.wins}W</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span className="losses">{data.trades.losses}L</span>
            </span>
          </div>
          <span className="win-rate">
            {winRate}% Win Rate
          </span>
        </TradesSummary>

        <SoundFooter isConnected={isConnected}>
          <div className="status-group">
            <span className="dot" />
            <span className="status-text">
              {isConnected ? '● Live' : '○ Disconnected'}
            </span>
          </div>
          <SoundIconButton 
            isMuted={isMuted} 
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Click to unmute' : 'Click to mute'}
          >
            <span className="icon">{isMuted ? '🔇' : '🔊'}</span>
            <span className="label">{isMuted ? 'Muted' : 'Sound'}</span>
          </SoundIconButton>
        </SoundFooter>
      </BottomContent>
    </PanelContainer>
  );
};

export default LeftPanel;