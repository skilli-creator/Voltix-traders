// src/components/LeftPanel.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const PanelContainer = styled.div`
  width: 100%;
  min-width: 0;
  height: 100%;
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
    padding: 8px 6px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: 100%;
    padding: clamp(10px, 3vw, 16px) clamp(12px, 3.6vw, 18px);
    border-right: none;
    background: ${props => props.theme.colors.background};
    gap: clamp(2px, 0.8vw, 6px);
  }

  @media (max-width: 480px) {
    padding: clamp(8px, 2.6vw, 14px) clamp(10px, 3.2vw, 16px);
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
    gap: clamp(4px, 1.4vw, 8px);
    justify-content: space-around;
    padding: 0 clamp(2px, 0.6vw, 4px);
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
  flex: 1;

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
    padding: clamp(10px, 2.8vw, 14px) clamp(8px, 2.4vw, 14px);
    border-radius: clamp(6px, 2vw, 10px);
    gap: clamp(4px, 1.2vw, 6px);
    .label { font-size: clamp(12px, 3.4vw, 15px); }
    .badge {
      font-size: clamp(11px, 3.2vw, 14px);
      padding: 1px clamp(5px, 1.6vw, 8px);
      border-radius: clamp(4px, 1.2vw, 6px);
    }
  }

  @media (max-width: 480px) {
    padding: clamp(9px, 2.6vw, 12px) clamp(6px, 2vw, 10px);
    .label { font-size: clamp(11px, 3.2vw, 14px); }
    .badge { font-size: clamp(10px, 3vw, 13px); }
  }
`;

const Divider = styled.div`
  height: 2px;
  background: ${props => props.theme.colors.border};
  margin: 4px 0;
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    margin: clamp(6px, 2vw, 10px) 0;
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
    padding: clamp(16px, 4.5vw, 24px) clamp(6px, 2vw, 12px);
    .icon {
      font-size: clamp(24px, 7vw, 34px);
      margin-bottom: clamp(4px, 1.4vw, 8px);
    }
    .title {
      font-size: clamp(13px, 3.8vw, 16px);
      margin-bottom: clamp(3px, 1vw, 6px);
    }
    .subtitle { font-size: clamp(11px, 3.2vw, 14px); }
  }

  @media (max-width: 480px) {
    padding: clamp(14px, 4vw, 20px) clamp(4px, 1.6vw, 10px);
    .icon { font-size: clamp(22px, 6.5vw, 30px); }
    .title { font-size: clamp(12px, 3.6vw, 15px); }
    .subtitle { font-size: clamp(10px, 3vw, 13px); }
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
    gap: clamp(4px, 1.4vw, 8px);
    padding-top: clamp(8px, 2.6vw, 14px);
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
    font-size: clamp(10px, 2.8vw, 12px);
    letter-spacing: 0.4px;
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
    font-size: clamp(16px, 4.6vw, 20px);
    .currency {
      font-size: clamp(10px, 3vw, 13px);
      margin-left: clamp(2px, 0.8vw, 4px);
    }
  }

  @media (max-width: 480px) {
    font-size: clamp(15px, 4.4vw, 19px);
    .currency { font-size: clamp(10px, 3vw, 12px); }
  }
`;

// ===== SESSION ROW WITH SOUND ICON ON LEFT =====
const SessionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 2px;

  @media (max-width: 768px) {
    gap: clamp(10px, 3vw, 16px);
    padding: 0 clamp(2px, 0.8vw, 4px);
  }
`;

const SoundIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isMuted ? 'transparent' : props.theme.colors.accentActive};
  border: 2px solid ${props => props.isMuted ? props.theme.colors.border : props.theme.colors.accent};
  border-radius: 50%;
  width: 28px;
  height: 28px;
  color: ${props => props.isMuted ? props.theme.colors.textMuted : props.theme.colors.accent};
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 14px;
  flex-shrink: 0;
  line-height: 1;

  &:hover {
    transform: scale(1.1);
    border-color: ${props => props.theme.colors.accent};
    background: ${props => props.theme.colors.accentActive};
    box-shadow: 0 2px 12px ${props => props.isMuted ? 'transparent' : props.theme.colors.accent + '40'};
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    width: clamp(40px, 11vw, 52px);
    height: clamp(40px, 11vw, 52px);
    font-size: clamp(18px, 5vw, 24px);
    border-width: clamp(2px, 0.5vw, 3px);
  }

  @media (max-width: 480px) {
    width: clamp(38px, 10.5vw, 48px);
    height: clamp(38px, 10.5vw, 48px);
    font-size: clamp(17px, 4.8vw, 22px);
  }
`;

const SessionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TradesSummary = styled.div`
  font-size: 8px;
  color: ${props => props.theme.colors.textMuted};
  padding: 0 2px;
  font-weight: 700;

  .wins { color: ${props => props.theme.colors.success}; }
  .losses { color: ${props => props.theme.colors.danger}; }

  @media (max-width: 768px) {
    font-size: clamp(11px, 3.2vw, 14px);
    padding: 0 clamp(2px, 0.8vw, 4px);
  }

  @media (max-width: 480px) {
    font-size: clamp(11px, 3.2vw, 13px);
  }
`;

// ===== STATUS DOT =====
const StatusDot = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 7px;
  color: ${props => props.theme.colors.textMuted};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${props => props.theme.colors.accent};
    animation: ${props => props.isConnected ? pulse : 'none'} 1.5s ease-in-out infinite;
    border: 1px solid ${props => props.theme.colors.accent};
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: clamp(10px, 2.8vw, 12px);
    gap: clamp(6px, 1.8vw, 10px);
    letter-spacing: 0.4px;
    .dot {
      width: clamp(8px, 2.4vw, 11px);
      height: clamp(8px, 2.4vw, 11px);
      border-width: 1.5px;
    }
  }

  @media (max-width: 480px) {
    font-size: clamp(9px, 2.6vw, 11px);
    .dot {
      width: clamp(7px, 2.2vw, 10px);
      height: clamp(7px, 2.2vw, 10px);
    }
  }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 2px 2px 0 2px;

  @media (max-width: 768px) {
    padding: clamp(4px, 1.4vw, 8px) clamp(2px, 0.8vw, 4px) 0;
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
        <SessionRow>
          <SoundIcon 
            isMuted={isMuted} 
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Click to unmute' : 'Click to mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </SoundIcon>
          <SessionContent>
            <SessionSection>
              <SessionLabel>Last Session</SessionLabel>
              <SessionPL isNegative={isNegative}>
                {isNegative ? '-' : ''}${Math.abs(data.sessionPL).toFixed(2)}
                <span className="currency">USD</span>
              </SessionPL>
            </SessionSection>
          </SessionContent>
        </SessionRow>

        <TradesSummary>
          {data.trades.total} trades (
          <span className="wins">{data.trades.wins}W</span> /{' '}
          <span className="losses">{data.trades.losses}L</span>)
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