// src/components/LeftPanel.jsx

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// PREMIUM ANIMATIONS
// ============================================
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.9); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.08); }
`;

const rippleEffect = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============================================
// PROFESSIONAL SVG ICONS
// ============================================
const SoundOnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const SoundOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

// ============================================
// STYLED COMPONENTS - PREMIUM THEME
// ============================================

const PanelContainer = styled.div`
  width: 100%;
  min-width: 0;
  height: 100%;
  background: ${props => props.theme?.colors?.surface || props.theme?.colors?.background || '#0b0f19'};
  border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 50;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.06)'};
    border-radius: 10px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 8px 6px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: 100%;
    padding: 8px 10px;
    border-right: none;
    background: ${props => props.theme?.colors?.surface || '#0b0f19'};
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
  }
`;

const NavList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  padding: 4px;
  background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  margin-bottom: 4px;
  width: 100%;
  font-weight: 700;

  @media (max-width: 768px) {
    gap: 3px;
    padding: 3px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    gap: 2px;
    padding: 2px;
    border-radius: 6px;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${props => props.active ? props.theme?.colors?.text || '#ffffff' : props.theme?.colors?.textMuted || '#94a3b8'};
  background: ${props => props.active ? props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)' : 'transparent'};
  border: 1px solid ${props => props.active ? props.theme?.colors?.accent || '#3b82f6' : 'transparent'};
  white-space: nowrap;
  font-size: 11px;
  font-weight: 700;
  flex: 1;

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.06)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    border-color: ${props => props.active ? props.theme?.colors?.accent || '#3b82f6' : props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  }

  .label {
    font-size: 11px;
    font-weight: 700;
  }

  .badge {
    font-size: 9px;
    font-weight: 700;
    padding: 0 6px;
    border-radius: 4px;
    background: ${props => props.active ? props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)' : props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.04)'};
    color: ${props => props.active ? props.theme?.colors?.accent || '#3b82f6' : props.theme?.colors?.textMuted || '#94a3b8'};
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    border-radius: 6px;
    .label { font-size: 10px; }
    .badge { font-size: 8px; padding: 0 4px; }
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    border-radius: 5px;
    .label { font-size: 9px; }
    .badge { font-size: 7px; padding: 0 3px; }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  margin: 6px 0;
  transition: background 0.3s ease;
  opacity: 0.6;

  @media (max-width: 768px) {
    margin: 4px 0;
  }
`;

const NoPositions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  margin: 4px 0;
  background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 12px;
  border: 1px dashed ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.04)'};
  }

  .icon { 
    font-size: 28px; 
    margin-bottom: 6px;
    opacity: 0.5;
    transition: all 0.3s ease;
  }

  &:hover .icon {
    opacity: 0.8;
    transform: scale(1.05);
  }

  .title { 
    font-size: 11px; 
    font-weight: 700; 
    color: ${props => props.theme?.colors?.text || '#ffffff'}; 
    margin-bottom: 2px; 
    letter-spacing: 0.3px;
  }

  .subtitle { 
    font-size: 9px; 
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'}; 
    letter-spacing: 0.2px;
  }

  @media (max-width: 768px) {
    padding: 14px 12px;
    border-radius: 10px;
    .icon { font-size: 22px; margin-bottom: 4px; }
    .title { font-size: 10px; }
    .subtitle { font-size: 8px; }
  }

  @media (max-width: 480px) {
    padding: 10px 8px;
    border-radius: 8px;
    .icon { font-size: 18px; margin-bottom: 3px; }
    .title { font-size: 9px; }
    .subtitle { font-size: 7px; }
  }
`;

const BottomContent = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  transition: border-color 0.3s ease;
  font-weight: 700;
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 768px) {
    gap: 3px;
    padding-top: 6px;
  }

  @media (max-width: 480px) {
    gap: 2px;
    padding-top: 4px;
  }
`;

const SessionSection = styled.div`
  padding: 6px 10px;
  background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.04)'};
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    border-radius: 6px;
  }
`;

const SessionLabel = styled.div`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 7px;
    letter-spacing: 0.4px;
  }
`;

const SessionPL = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.isNegative ? props.theme?.colors?.danger || '#ef4444' : props.theme?.colors?.success || '#22c55e'};
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 2px;

  .currency {
    font-size: 9px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    opacity: 0.5;
  }

  .change-indicator {
    font-size: 11px;
    margin-left: 2px;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    .currency { font-size: 8px; }
    .change-indicator { font-size: 10px; }
  }

  @media (max-width: 480px) {
    font-size: 11px;
    .currency { font-size: 7px; }
    .change-indicator { font-size: 9px; }
  }
`;

// ===== SESSION ROW WITH SOUND ICON ON LEFT =====
const SessionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
`;

const SoundIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isMuted ? 'transparent' : props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
  border: 1px solid ${props => props.isMuted ? props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)' : props.theme?.colors?.accent || '#3b82f6'};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: ${props => props.isMuted ? props.theme?.colors?.textMuted || '#94a3b8' : props.theme?.colors?.accent || '#3b82f6'};
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  font-size: 14px;
  flex-shrink: 0;
  line-height: 1;
  box-shadow: ${props => props.isMuted ? 'none' : `0 0 16px ${props.theme?.colors?.accent || '#3b82f6'}20`};

  &:hover {
    transform: scale(1.1);
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)'};
    box-shadow: 0 2px 20px ${props => props.isMuted ? 'transparent' : props.theme?.colors?.accent + '30' || 'rgba(59, 130, 246, 0.15)'};
  }

  &:active {
    transform: scale(0.9);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    width: 22px;
    height: 22px;
    font-size: 10px;
    border-width: 1.5px;
  }
`;

const SessionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TradesSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  font-size: 9px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stats {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .wins { 
    color: ${props => props.theme?.colors?.success || '#22c55e'};
    font-weight: 700;
  }

  .losses { 
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    font-weight: 700;
  }

  .win-rate {
    font-size: 8px;
    padding: 1px 8px;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    font-weight: 700;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 8px;
    .win-rate { font-size: 7px; padding: 1px 6px; }
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    border-radius: 6px;
    font-size: 7px;
    .win-rate { font-size: 6px; padding: 0 5px; }
  }
`;

// ===== STATUS DOT =====
const StatusDot = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 8px;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.accent || '#3b82f6'};
    animation: ${props => props.isConnected ? pulse : 'none'} 1.5s ease-in-out infinite;
    border: 1px solid ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 10px ${props => props.theme?.colors?.accent || '#3b82f6'}40;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 7px;
    .dot { width: 5px; height: 5px; }
  }

  @media (max-width: 480px) {
    font-size: 6px;
    .dot { width: 4px; height: 4px; }
  }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 4px 0 4px;

  @media (max-width: 768px) {
    padding: 2px 2px 0 2px;
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
        <NavItem active={activeTab === 'open'} onClick={() => handleTabClick('open')}>
          <span className="label">Open</span>
          <span className="badge">{data.openCount}</span>
        </NavItem>

        <NavItem active={activeTab === 'closed'} onClick={() => handleTabClick('closed')}>
          <span className="label">Closed</span>
          <span className="badge">{data.closedCount}</span>
        </NavItem>

        <NavItem active={activeTab === 'transactions'} onClick={() => handleTabClick('transactions')}>
          <span className="label">History</span>
        </NavItem>
      </NavList>

      <Divider />

      <NoPositions>
        <div className="icon">📭</div>
        <div className="title">No Active Positions</div>
        <div className="subtitle">Your trades will appear here</div>
      </NoPositions>

      <Divider />

      <BottomContent>
        <SessionRow>
          <SoundIcon 
            isMuted={isMuted} 
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Click to unmute' : 'Click to mute'}
          >
            <span className="icon">
              {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
            </span>
          </SoundIcon>
          <SessionContent>
            <SessionSection>
              <SessionLabel>Session Performance</SessionLabel>
              <SessionPL isNegative={isNegative}>
                {isNegative ? '−' : '+'}${Math.abs(data.sessionPL).toFixed(2)}
                <span className="currency">USD</span>
                <span className="change-indicator">
                  {isNegative ? '↓' : '↑'}
                </span>
              </SessionPL>
            </SessionSection>
          </SessionContent>
        </SessionRow>

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

        <StatusRow>
          <StatusDot isConnected={isConnected}>
            <span className="dot" />
            {isConnected ? 'Live' : 'Disconnected'}
          </StatusDot>
        </StatusRow>
      </BottomContent>
    </PanelContainer>
  );
};

export default LeftPanel;