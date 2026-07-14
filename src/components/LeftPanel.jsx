// src/components/LeftPanel.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

/* =============================
   MAIN PANEL
============================= */
const PanelContainer = styled.div`
  width: 260px;
  min-width: 260px;
  height: calc(100vh - 48px);
  background: ${p => p.theme.colors.background};
  border-right: 1px solid ${p => p.theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  overflow-y: auto;
  gap: 10px;
`;

/* =============================
   NAV
============================= */
const NavList = styled.div`
  display: flex;
  gap: 6px;
`;

const NavItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  color: ${p => p.active ? p.theme.colors.text : p.theme.colors.textMuted};
  background: ${p => p.active ? p.theme.colors.accentActive : 'transparent'};
  border: 1px solid ${p => p.active ? p.theme.colors.accent : p.theme.colors.border};

  &:hover {
    background: ${p => p.theme.colors.backgroundSecondary};
  }

  .badge {
    margin-left: 4px;
    font-size: 11px;
    color: ${p => p.theme.colors.textMuted};
  }
`;

/* =============================
   EMPTY STATE
============================= */
const EmptyState = styled.div`
  text-align: center;
  padding: 20px 10px;
  color: ${p => p.theme.colors.textMuted};

  .icon {
    font-size: 22px;
    margin-bottom: 6px;
  }

  .title {
    font-size: 13px;
    font-weight: 500;
    color: ${p => p.theme.colors.text};
  }

  .subtitle {
    font-size: 11px;
  }
`;

/* =============================
   SESSION
============================= */
const SessionBox = styled.div`
  border-top: 1px solid ${p => p.theme.colors.border};
  padding-top: 10px;
`;

const SessionLabel = styled.div`
  font-size: 11px;
  color: ${p => p.theme.colors.textMuted};
`;

const SessionPL = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.isNegative ? p.theme.colors.danger : p.theme.colors.success};
`;

const TradesSummary = styled.div`
  font-size: 11px;
  color: ${p => p.theme.colors.textMuted};

  .wins { color: ${p => p.theme.colors.success}; }
  .losses { color: ${p => p.theme.colors.danger}; }
`;

/* =============================
   FOOTER (STATUS + SOUND)
============================= */
const Footer = styled.div`
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid ${p => p.theme.colors.border};
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${p => p.theme.colors.accent};
    animation: ${p => p.active ? pulse : 'none'} 1.5s infinite;
  }

  .text {
    font-size: 11px;
    color: ${p => p.theme.colors.textMuted};
  }
`;

const SoundButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${p => p.isMuted ? p.theme.colors.border : p.theme.colors.accent};
  background: ${p => p.isMuted ? 'transparent' : p.theme.colors.accentActive};
  color: ${p => p.isMuted ? p.theme.colors.textMuted : p.theme.colors.accent};
  cursor: pointer;
  font-size: 12px;

  svg {
    font-size: 18px;
  }

  &:hover {
    background: ${p => p.theme.colors.accentActive};
  }
`;

/* =============================
   COMPONENT
============================= */
const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [isMuted, setIsMuted] = useState(false);

  const [data, setData] = useState({
    openCount: 0,
    closedCount: 8,
    sessionPL: -1270,
    trades: { wins: 0, losses: 7, total: 7 }
  });

  const toggleSound = () => {
    setIsMuted(prev => !prev);
    localStorage.setItem('soundMuted', JSON.stringify(!isMuted));
  };

  useEffect(() => {
    const saved = localStorage.getItem('soundMuted');
    if (saved) setIsMuted(JSON.parse(saved));
  }, []);

  const isNegative = data.sessionPL < 0;

  return (
    <PanelContainer>

      {/* NAV */}
      <NavList>
        <NavItem active={activeTab === 'open'} onClick={() => setActiveTab('open')}>
          Open <span className="badge">{data.openCount}</span>
        </NavItem>

        <NavItem active={activeTab === 'closed'} onClick={() => setActiveTab('closed')}>
          Closed <span className="badge">{data.closedCount}</span>
        </NavItem>

        <NavItem active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')}>
          Transactions
        </NavItem>
      </NavList>

      {/* EMPTY */}
      <EmptyState>
        <div className="icon">📭</div>
        <div className="title">No open positions</div>
        <div className="subtitle">Trades will appear here</div>
      </EmptyState>

      {/* SESSION */}
      <SessionBox>
        <SessionLabel>Last Session</SessionLabel>
        <SessionPL isNegative={isNegative}>
          {isNegative ? '-' : ''}${Math.abs(data.sessionPL).toFixed(2)}
        </SessionPL>

        <TradesSummary>
          {data.trades.total} trades (
          <span className="wins">{data.trades.wins}W</span> /{' '}
          <span className="losses">{data.trades.losses}L</span>)
        </TradesSummary>
      </SessionBox>

      {/* FOOTER */}
      <Footer>
        <StatusRow>

          <Status active>
            <span className="dot" />
            <span className="text">Live</span>
          </Status>

          <SoundButton isMuted={isMuted} onClick={toggleSound}>
            {isMuted ? <HiSpeakerXMark /> : <HiSpeakerWave />}
            {isMuted ? 'Muted' : 'Sound'}
          </SoundButton>

        </StatusRow>
      </Footer>

    </PanelContainer>
  );
};

export default LeftPanel;