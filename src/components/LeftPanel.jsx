// src/components/LeftPanel.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PanelContainer = styled.div`
  width: 260px;
  min-width: 260px;
  height: calc(100vh - 48px);
  background: #ffffff;
  border-right: 2px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 10px 8px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 50;
  transition: background 0.3s ease, border-color 0.3s ease;
  animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: #1a1a1a;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 150%;

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
    background: #ffffff;
  }

  @media (max-width: 480px) {
    padding: 4px 6px;
    font-size: 12px;
  }
`;

const NavList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  padding: 0 2px;
  width: 100%;

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
  color: ${props => props.active ? '#1a1a1a' : '#666666'};
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  border: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: #1a1a1a;
    border-color: ${props => props.theme.colors.accent};
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.active ? '#1a1a1a' : '#666666'};
  }

  .badge {
    font-size: 11px;
    font-weight: 600;
    padding: 0 3px;
    border-radius: 3px;
    background: ${props => props.active ? props.theme.colors.accent + '30' : props.theme.colors.backgroundSecondary};
    color: ${props => props.active ? props.theme.colors.accent : '#666666'};
    &::before { content: '('; }
    &::after { content: ')'; }
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    .label { font-size: 12px; }
    .badge { font-size: 10px; }
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    .label { font-size: 11px; }
    .badge { font-size: 9px; }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #ffffff;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  width: 200px;
  max-height: 280px;
  overflow-y: auto;
  z-index: 9999;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a1a;

  @media (max-width: 480px) {
    width: 180px;
    max-height: 220px;
    left: -10px;
  }

  .dropdown-title {
    font-size: 11px;
    font-weight: 600;
    color: #666666;
    padding: 10px 14px 6px 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${props => props.theme.colors.border};

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
  color: ${props => props.active ? '#1a1a1a' : '#666666'};
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 2px solid ${props => props.theme.colors.border + '40'};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 480px) {
    padding: 6px 10px;
  }

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    color: #1a1a1a;
  }

  .left-container {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 480px) {
      gap: 6px;
    }
  }

  .market-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .display-name {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a1a;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }

  .system-symbol {
    font-size: 10px;
    color: #666666;
    font-family: 'Inter', monospace;
    font-weight: 400;

    @media (max-width: 480px) {
      font-size: 8px;
    }
  }

  .badge-count {
    font-size: 10px;
    font-weight: 600;
    color: #1a1a1a;
    background: ${props => props.theme.colors.accentActive};
    padding: 1px 6px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.colors.accent};

    @media (max-width: 480px) {
      font-size: 8px;
      padding: 1px 4px;
    }
  }

  .star-fav {
    color: ${props => props.active ? props.theme.colors.accent : '#66666640'};
    font-size: 14px;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }
`;

const DropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
  background: #f5f5f5;
  border: 2px solid ${props => props.theme.colors.border};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 2px 6px;
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 20px ${props => props.theme.colors.accent + '30'};
  }

  .dropdown-arrow {
    font-size: 11px;
    color: #666666;
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};

    @media (max-width: 480px) {
      font-size: 9px;
    }
  }
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
  color: #666666;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  .icon { 
    font-size: 18px; 
    margin-bottom: 2px; 
    color: #999999; 
  }
  .title { 
    font-size: 13px; 
    font-weight: 600; 
    color: #1a1a1a; 
    margin-bottom: 1px; 
  }
  .subtitle { 
    font-size: 11px; 
    font-weight: 400;
    color: #666666; 
  }

  @media (max-width: 768px) {
    padding: 4px 2px;
    .icon { font-size: 14px; }
    .title { font-size: 12px; }
    .subtitle { font-size: 10px; }
  }

  @media (max-width: 480px) {
    padding: 2px 2px;
    .icon { font-size: 12px; }
    .title { font-size: 11px; }
    .subtitle { font-size: 9px; }
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 768px) {
    gap: 1px;
    padding-top: 2px;
  }
`;

const SessionSection = styled.div`
  padding: 0 2px;
`;

const SessionLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #666666;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

const SessionPL = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.isNegative ? '#dc2626' : '#16a34a'};

  .currency {
    font-size: 10px;
    font-weight: 600;
    color: #666666;
    margin-left: 1px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    .currency { font-size: 9px; }
  }

  @media (max-width: 480px) {
    font-size: 12px;
    .currency { font-size: 8px; }
  }
`;

const SessionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 2px;
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
  color: ${props => props.isMuted ? '#666666' : '#1a1a1a'};
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
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    font-size: 10px;
    border-width: 1.5px;
  }
`;

const SessionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TradesSummary = styled.div`
  font-size: 11px;
  color: #666666;
  padding: 0 2px;
  font-weight: 400;

  .wins { color: #16a34a; font-weight: 600; }
  .losses { color: #dc2626; font-weight: 600; }

  @media (max-width: 768px) {
    font-size: 10px;
  }

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const StatusDot = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #666666;
  font-weight: 600;
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
    font-size: 9px;
    .dot { width: 4px; height: 4px; }
  }

  @media (max-width: 480px) {
    font-size: 8px;
    .dot { width: 3px; height: 3px; }
  }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 2px 2px 0 2px;
`;

const PositionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 2px;
  margin-bottom: 2px;
`;

const PositionsTitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [isConnected, setIsConnected] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('All Positions');

  const [data, setData] = useState({
    openCount: 0,
    closedCount: 8,
    sessionPL: -1270.00,
    openPositions: 0,
    trades: { wins: 0, losses: 7, total: 7 }
  });

  const viewOptions = [
    { name: 'All Positions', count: data.openCount + data.closedCount },
    { name: 'Open Positions', count: data.openCount },
    { name: 'Closed Positions', count: data.closedCount },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleSound = () => {
    setIsMuted(!isMuted);
    const event = new CustomEvent('soundToggle', { detail: { isMuted: !isMuted } });
    window.dispatchEvent(event);
    localStorage.setItem('soundMuted', JSON.stringify(!isMuted));
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  
  const selectView = (viewName) => {
    setSelectedView(viewName);
    setIsDropdownOpen(false);
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

      <PositionsHeader>
        <PositionsTitle>Positions</PositionsTitle>
        <DropdownTrigger 
          isOpen={isDropdownOpen} 
          onClick={toggleDropdown}
        >
          <span>{selectedView}</span>
          <span className="dropdown-arrow">▾</span>
          
          <DropdownMenu 
            isOpen={isDropdownOpen} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dropdown-title">Filter Positions</div>
            {viewOptions.map((option) => (
              <DropdownItem
                key={option.name}
                active={selectedView === option.name}
                onClick={() => selectView(option.name)}
              >
                <div className="left-container">
                  <div className="market-meta">
                    <span className="display-name">{option.name}</span>
                  </div>
                </div>
                <span className="badge-count">{option.count}</span>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </DropdownTrigger>
      </PositionsHeader>

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