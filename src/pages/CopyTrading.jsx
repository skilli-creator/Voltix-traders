import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.05); }
  50% { box-shadow: 0 0 40px rgba(56, 189, 248, 0.15); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(180deg, #0b0e14 0%, #0f131a 100%);
  padding: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #2a2e3d;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 0;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    color: #f1f5f9;
    transform: translateX(-4px);
  }

  .arrow {
    font-size: 16px;
    line-height: 1;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 8px;
    .arrow { font-size: 14px; }
  }
`;

// ===== HERO SECTION =====
const HeroSection = styled.div`
  text-align: center;
  padding: 16px 16px 20px;
  animation: ${fadeIn} 0.6s ease;

  .badge {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 20px;
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.1);
    color: #38bdf8;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .title {
    font-size: 28px;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.1;
    margin-bottom: 6px;

    .gradient {
      background: linear-gradient(135deg, #22c55e, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .subtitle {
    font-size: 13px;
    color: #94a3b8;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 12px 12px 14px;
    .title { font-size: 22px; }
    .subtitle { font-size: 12px; }
  }

  @media (max-width: 480px) {
    padding: 8px 8px 10px;
    .badge { font-size: 9px; padding: 2px 10px; }
    .title { font-size: 18px; }
    .subtitle { font-size: 11px; }
  }
`;

// ===== MASTER TRADER CARD =====
const MasterTraderCard = styled.div`
  max-width: 700px;
  margin: 0 auto 16px;
  width: 100%;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.04), rgba(129, 140, 248, 0.02));
  border: 1px solid rgba(56, 189, 248, 0.06);
  border-radius: 14px;
  padding: 16px 20px;
  animation: ${fadeIn} 0.7s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.03), transparent 70%);
    border-radius: 50%;
  }

  .master-header {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 1;

    .master-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #22c55e, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(56, 189, 248, 0.2);
    }

    .master-info {
      flex: 1;

      .master-name {
        font-size: 16px;
        font-weight: 700;
        color: #f1f5f9;
      }

      .master-title {
        font-size: 11px;
        color: #64748b;
        margin-top: 1px;
        display: flex;
        align-items: center;
        gap: 6px;

        .live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
          animation: ${breathe} 2s ease-in-out infinite;
        }
      }
    }

    .master-badge {
      font-size: 9px;
      padding: 3px 12px;
      border-radius: 20px;
      background: rgba(34, 197, 94, 0.08);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.1);
      font-weight: 600;
    }
  }

  .master-stats {
    display: flex;
    gap: 20px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.02);
    position: relative;
    z-index: 1;

    .stat {
      .stat-value {
        font-size: 16px;
        font-weight: 700;
        color: #f1f5f9;
        font-family: 'Courier New', monospace;
      }
      .stat-label {
        font-size: 9px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-top: 1px;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 12px 14px;
    .master-avatar { width: 38px; height: 38px; font-size: 15px; }
    .master-name { font-size: 14px; }
    .master-title { font-size: 10px; }
    .master-stats { gap: 14px; .stat .stat-value { font-size: 14px; } }
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    border-radius: 12px;
    .master-avatar { width: 32px; height: 32px; font-size: 12px; }
    .master-name { font-size: 13px; }
    .master-title { font-size: 9px; }
    .master-stats { gap: 10px; .stat .stat-value { font-size: 12px; } .stat .stat-label { font-size: 8px; } }
    .master-badge { font-size: 8px; padding: 2px 8px; }
  }
`;

// ===== CONNECT SECTION =====
const ConnectSection = styled.div`
  max-width: 700px;
  margin: 0 auto 16px;
  width: 100%;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  padding: 18px 20px;
  animation: ${fadeIn} 0.7s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.03), transparent 70%);
    border-radius: 50%;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-subtitle {
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 12px;
  }

  .input-group {
    display: flex;
    gap: 10px;
    align-items: center;
    position: relative;
    z-index: 1;

    .input-wrapper {
      flex: 1;
      position: relative;

      .input-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        color: #64748b;
      }

      input {
        width: 100%;
        padding: 10px 10px 10px 38px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        color: #f1f5f9;
        font-size: 13px;
        outline: none;
        transition: all 0.2s ease;
        font-family: 'Courier New', monospace;

        &::placeholder {
          color: #4a4f5e;
        }

        &:focus {
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.05);
        }
      }
    }

    .connect-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #2962ff, #1a4fcf);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
      position: relative;
      overflow: hidden;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(41, 98, 255, 0.3);
      }

      &:active:not(:disabled) {
        transform: scale(0.98);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-shimmer {
        position: absolute;
        top: 0;
        left: -100%;
        width: 60%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
        animation: ${shimmer} 4s ease-in-out infinite;
      }
    }
  }

  .connection-status {
    margin-top: 10px;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    z-index: 1;

    &.success {
      background: rgba(34, 197, 94, 0.04);
      border: 1px solid rgba(34, 197, 94, 0.06);
      color: #22c55e;
    }

    &.error {
      background: rgba(239, 68, 68, 0.04);
      border: 1px solid rgba(239, 68, 68, 0.06);
      color: #ef4444;
    }

    &.info {
      background: rgba(56, 189, 248, 0.04);
      border: 1px solid rgba(56, 189, 248, 0.06);
      color: #38bdf8;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;

      &.green { background: #22c55e; animation: ${breathe} 2s ease-in-out infinite; }
      &.red { background: #ef4444; }
      &.blue { background: #38bdf8; animation: ${breathe} 2s ease-in-out infinite; }
    }
  }

  @media (max-width: 600px) {
    padding: 14px 14px;
    .input-group {
      flex-direction: column;
      .connect-btn { width: 100%; justify-content: center; }
    }
  }

  @media (max-width: 480px) {
    padding: 12px 10px;
    border-radius: 12px;
    .section-title { font-size: 13px; }
    .section-subtitle { font-size: 10px; }
    .input-group .input-wrapper input { font-size: 12px; padding: 8px 8px 8px 34px; }
    .input-group .connect-btn { font-size: 11px; padding: 8px 16px; }
    .connection-status { font-size: 11px; padding: 6px 10px; }
  }
`;

// ===== CLIENTS LIST =====
const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  max-width: 900px;
  margin: 0 auto 16px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const ClientCard = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid ${props => props.active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.04)'};
  border-radius: 14px;
  padding: 14px 14px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(56, 189, 248, 0.06);
    background: rgba(255, 255, 255, 0.02);
    transform: translateY(-2px);
  }

  ${props => props.active && `
    border-color: rgba(34, 197, 94, 0.15);
    background: rgba(34, 197, 94, 0.02);
  `}

  .client-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;

    .client-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #818cf8, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .client-info {
      flex: 1;
      min-width: 0;

      .client-name {
        font-size: 12px;
        font-weight: 600;
        color: #f1f5f9;
      }

      .client-token {
        font-size: 9px;
        color: #64748b;
        font-family: 'Courier New', monospace;
        margin-top: 1px;
        word-break: break-all;
      }
    }

    .status-badge {
      font-size: 7px;
      padding: 2px 8px;
      border-radius: 20px;
      font-weight: 600;
      flex-shrink: 0;

      &.active {
        background: rgba(34, 197, 94, 0.08);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.1);
      }

      &.pending {
        background: rgba(251, 191, 36, 0.08);
        color: #fbbf24;
        border: 1px solid rgba(251, 191, 36, 0.1);
      }

      &.inactive {
        background: rgba(239, 68, 68, 0.08);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.1);
      }
    }
  }

  .client-details {
    display: flex;
    gap: 10px;
    margin: 6px 0 8px;
    padding: 6px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);

    .detail {
      flex: 1;
      text-align: center;

      .detail-value {
        font-size: 12px;
        font-weight: 700;
        color: #f1f5f9;
        font-family: 'Courier New', monospace;
      }

      .detail-label {
        font-size: 6px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-top: 1px;
      }
    }
  }

  .client-actions {
    display: flex;
    gap: 4px;

    .action-btn {
      flex: 1;
      padding: 5px 0;
      border: none;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &.remove {
        background: rgba(239, 68, 68, 0.08);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.1);

        &:hover {
          background: rgba(239, 68, 68, 0.15);
        }
      }

      &.view {
        background: rgba(255, 255, 255, 0.04);
        color: #94a3b8;
        border: 1px solid rgba(255, 255, 255, 0.04);

        &:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #f1f5f9;
        }
      }

      &.activate {
        background: rgba(34, 197, 94, 0.08);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.1);

        &:hover {
          background: rgba(34, 197, 94, 0.15);
        }
      }
    }
  }

  @media (max-width: 480px) {
    padding: 10px 10px;
    border-radius: 12px;
    .client-avatar { width: 28px; height: 28px; font-size: 10px; }
    .client-name { font-size: 11px; }
    .client-token { font-size: 8px; }
    .client-details .detail .detail-value { font-size: 11px; }
    .client-actions .action-btn { font-size: 9px; padding: 4px 0; }
  }
`;

// ===== ADD CLIENT BUTTON =====
const AddClientButton = styled.button`
  padding: 14px 0;
  border: 2px dashed rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 100%;

  &:hover {
    border-color: rgba(56, 189, 248, 0.2);
    background: rgba(255, 255, 255, 0.01);
    color: #f1f5f9;
  }

  .icon {
    font-size: 24px;
  }

  .text {
    font-size: 12px;
  }

  .sub-text {
    font-size: 10px;
    color: #4a4f5e;
  }

  @media (max-width: 480px) {
    padding: 10px 0;
    .icon { font-size: 20px; }
    .text { font-size: 11px; }
    .sub-text { font-size: 9px; }
  }
`;

// ===== EMPTY STATE =====
const EmptyState = styled.div`
  text-align: center;
  padding: 30px 20px;
  border: 1px dashed rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  grid-column: 1 / -1;

  .empty-icon {
    font-size: 40px;
    opacity: 0.3;
    margin-bottom: 10px;
  }

  .empty-title {
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
  }

  .empty-sub {
    font-size: 12px;
    color: #64748b;
    margin-top: 3px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    .empty-icon { font-size: 32px; }
    .empty-title { font-size: 13px; }
    .empty-sub { font-size: 11px; }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const CopyTrading = () => {
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState('');
  const [clientNameInput, setClientNameInput] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [clients, setClients] = useState([]);
  const [showAddClient, setShowAddClient] = useState(false);

  const [totalCopiedTrades] = useState(0);
  const [totalProfit] = useState(0);
  const [activeClients] = useState(0);

  const handleConnect = () => {
    if (!tokenInput.trim()) {
      setConnectionStatus({
        type: 'error',
        message: 'Please enter a valid API token'
      });
      return;
    }

    if (!clientNameInput.trim()) {
      setConnectionStatus({
        type: 'error',
        message: 'Please enter the client\'s name'
      });
      return;
    }

    setConnecting(true);
    setConnectionStatus({
      type: 'info',
      message: 'Adding client...'
    });

    setTimeout(() => {
      const exists = clients.some(c => c.token === tokenInput.trim());
      
      if (exists) {
        setConnectionStatus({
          type: 'error',
          message: 'This client is already in your list'
        });
        setConnecting(false);
        return;
      }

      const newClient = {
        id: Date.now(),
        name: clientNameInput.trim(),
        token: tokenInput.trim(),
        status: 'pending',
        copiedTrades: 0,
        profit: 0,
        avatar: clientNameInput.trim().slice(0, 2).toUpperCase()
      };

      setClients(prev => [newClient, ...prev]);
      setConnectionStatus({
        type: 'success',
        message: `Successfully added ${newClient.name}! They will copy your trades once activated.`
      });
      setTokenInput('');
      setClientNameInput('');
      setShowAddClient(false);
      setConnecting(false);

      setTimeout(() => {
        setConnectionStatus(null);
      }, 5000);
    }, 1500);
  };

  const handleRemoveClient = (clientId) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const handleActivateClient = (clientId) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, status: 'active' } : c
    ));
  };

  const handleViewClient = (clientId) => {
    console.log('View client details:', clientId);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Active', className: 'active' },
      pending: { label: 'Pending', className: 'pending' },
      inactive: { label: 'Inactive', className: 'inactive' }
    };
    return badges[status] || badges.inactive;
  };

  return (
    <PageWrapper>
      <BackButton onClick={handleGoBack}>
        <span className="arrow">←</span> Back
      </BackButton>

      <HeroSection>
        <div className="badge">Copy Trading</div>
        <h1 className="title">
          Copy <span className="gradient">Trading</span>
        </h1>
        <p className="subtitle">
          Master trader dashboard. Manage your followers and share your trades with them.
        </p>
      </HeroSection>

      {/* MASTER TRADER CARD */}
      <MasterTraderCard>
        <div className="master-header">
          <div className="master-avatar">VT</div>
          <div className="master-info">
            <div className="master-name">John Trader</div>
            <div className="master-title">
              <span className="live-dot" />
              Master Trader • Live Copy Trading
            </div>
          </div>
          <span className="master-badge">Active</span>
        </div>
        <div className="master-stats">
          <div className="stat">
            <div className="stat-value">{clients.filter(c => c.status === 'active').length}</div>
            <div className="stat-label">Active Followers</div>
          </div>
          <div className="stat">
            <div className="stat-value">{clients.reduce((sum, c) => sum + c.copiedTrades, 0)}</div>
            <div className="stat-label">Total Copied Trades</div>
          </div>
          <div className="stat">
            <div className="stat-value" style={{ color: '#22c55e' }}>
              ${clients.reduce((sum, c) => sum + c.profit, 0).toFixed(2)}
            </div>
            <div className="stat-label">Total Follower Profit</div>
          </div>
        </div>
      </MasterTraderCard>

      {/* CLIENTS LIST */}
      <ClientsGrid>
        {clients.length === 0 ? (
          <EmptyState>
            <div className="empty-icon">📭</div>
            <div className="empty-title">No Followers Yet</div>
            <div className="empty-sub">
              Click the "Add Client" button below to start adding followers.
            </div>
          </EmptyState>
        ) : (
          clients.map((client) => {
            const status = getStatusBadge(client.status);
            
            return (
              <ClientCard key={client.id} active={client.status === 'active'}>
                <div className="client-header">
                  <div className="client-avatar">{client.avatar}</div>
                  <div className="client-info">
                    <div className="client-name">{client.name}</div>
                    <div className="client-token">{client.token}</div>
                  </div>
                  <span className={`status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="client-details">
                  <div className="detail">
                    <div className="detail-value">{client.copiedTrades}</div>
                    <div className="detail-label">Trades</div>
                  </div>
                  <div className="detail">
                    <div className="detail-value" style={{ color: client.profit > 0 ? '#22c55e' : '#ef4444' }}>
                      ${client.profit.toFixed(2)}
                    </div>
                    <div className="detail-label">Profit</div>
                  </div>
                </div>

                <div className="client-actions">
                  {client.status === 'pending' ? (
                    <>
                      <button className="action-btn activate" onClick={() => handleActivateClient(client.id)}>
                        Activate
                      </button>
                      <button className="action-btn remove" onClick={() => handleRemoveClient(client.id)}>
                        Remove
                      </button>
                    </>
                  ) : client.status === 'active' ? (
                    <>
                      <button className="action-btn view" onClick={() => handleViewClient(client.id)}>
                        View
                      </button>
                      <button className="action-btn remove" onClick={() => handleRemoveClient(client.id)}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn activate" onClick={() => handleActivateClient(client.id)}>
                        Reactivate
                      </button>
                      <button className="action-btn remove" onClick={() => handleRemoveClient(client.id)}>
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </ClientCard>
            );
          })
        )}

        {/* ADD CLIENT BUTTON */}
        {!showAddClient ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <AddClientButton onClick={() => setShowAddClient(true)}>
              <span className="icon">➕</span>
              <span className="text">Add Client</span>
              <span className="sub-text">Enter their API token to start copy trading</span>
            </AddClientButton>
          </div>
        ) : (
          <div style={{ gridColumn: '1 / -1' }}>
            <ConnectSection style={{ marginBottom: 0 }}>
              <div className="section-title">Add New Client</div>
              <div className="section-subtitle">
                Enter your client's name and API token to add them
              </div>

              <div className="input-group" style={{ flexDirection: 'column', gap: '8px' }}>
                <div className="input-wrapper" style={{ width: '100%' }}>
                  <span className="input-icon">◈</span>
                  <input
                    type="text"
                    placeholder="Enter client's name (e.g., John Smith)"
                    value={clientNameInput}
                    onChange={(e) => setClientNameInput(e.target.value)}
                    className={connecting ? 'loading' : ''}
                  />
                </div>
                <div className="input-wrapper" style={{ width: '100%' }}>
                  <span className="input-icon">◈</span>
                  <input
                    type="text"
                    placeholder="Enter client's API token (e.g., 0x7a3f...9b2e)"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConnect();
                    }}
                    className={connecting ? 'loading' : ''}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button 
                    className="connect-btn" 
                    onClick={handleConnect}
                    disabled={connecting || !tokenInput.trim() || !clientNameInput.trim()}
                    style={{ flex: 1 }}
                  >
                    <span className="btn-shimmer" />
                    {connecting ? 'Adding...' : 'Add Client'}
                  </button>
                  <button 
                    className="connect-btn" 
                    onClick={() => {
                      setShowAddClient(false);
                      setTokenInput('');
                      setClientNameInput('');
                      setConnectionStatus(null);
                    }}
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      flex: '0.5'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {connectionStatus && (
                <div className={`connection-status ${connectionStatus.type}`}>
                  <span className={`status-dot ${connectionStatus.type === 'success' ? 'green' : connectionStatus.type === 'error' ? 'red' : 'blue'}`} />
                  {connectionStatus.message}
                </div>
              )}
            </ConnectSection>
          </div>
        )}
      </ClientsGrid>

      {/* FOOTER */}
      <div style={{
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        textAlign: 'center',
        fontSize: '10px',
        color: '#4a4f5e',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
      }}>
        Voltix Traders • Copy Trading
        <span style={{ display: 'block', marginTop: '2px', color: '#3a4055' }}>
          Share your trades with followers and grow together
        </span>
      </div>
    </PageWrapper>
  );
};

export default CopyTrading;