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

const spin = keyframes`
  to { transform: rotate(360deg); }
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
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    color: #f1f5f9;
    transform: translateX(-4px);
  }

  .arrow {
    font-size: 18px;
    line-height: 1;
  }
`;

// ===== HERO SECTION =====
const HeroSection = styled.div`
  text-align: center;
  padding: 20px 20px 30px;
  animation: ${fadeIn} 0.6s ease;

  .badge {
    display: inline-block;
    padding: 4px 16px;
    border-radius: 20px;
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.1);
    color: #38bdf8;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .title {
    font-size: 32px;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.1;
    margin-bottom: 8px;

    .gradient {
      background: linear-gradient(135deg, #22c55e, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .subtitle {
    font-size: 14px;
    color: #94a3b8;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    padding: 16px 12px 20px;
    .title { font-size: 24px; }
    .subtitle { font-size: 13px; }
  }
`;

// ===== MASTER TRADER CARD =====
const MasterTraderCard = styled.div`
  max-width: 700px;
  margin: 0 auto 20px;
  width: 100%;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.04), rgba(129, 140, 248, 0.02));
  border: 1px solid rgba(56, 189, 248, 0.06);
  border-radius: 16px;
  padding: 20px 24px;
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
    gap: 14px;
    position: relative;
    z-index: 1;

    .master-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #22c55e, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(56, 189, 248, 0.2);
    }

    .master-info {
      flex: 1;

      .master-name {
        font-size: 18px;
        font-weight: 700;
        color: #f1f5f9;
      }

      .master-title {
        font-size: 12px;
        color: #64748b;
        margin-top: 1px;
        display: flex;
        align-items: center;
        gap: 8px;

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
          animation: ${breathe} 2s ease-in-out infinite;
        }
      }
    }

    .master-badge {
      font-size: 10px;
      padding: 4px 14px;
      border-radius: 20px;
      background: rgba(34, 197, 94, 0.08);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.1);
      font-weight: 600;
    }
  }

  .master-stats {
    display: flex;
    gap: 24px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.02);
    position: relative;
    z-index: 1;

    .stat {
      .stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #f1f5f9;
        font-family: 'Courier New', monospace;
      }
      .stat-label {
        font-size: 10px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-top: 1px;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 16px 18px;
    .master-avatar { width: 44px; height: 44px; font-size: 18px; }
    .master-name { font-size: 16px; }
    .master-stats { gap: 16px; .stat .stat-value { font-size: 15px; } }
  }
`;

// ===== CONNECT FRIEND SECTION =====
const ConnectSection = styled.div`
  max-width: 700px;
  margin: 0 auto 24px;
  width: 100%;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 24px 28px;
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
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-subtitle {
    font-size: 12px;
    color: #94a3b8;
    margin-bottom: 16px;
  }

  .input-group {
    display: flex;
    gap: 12px;
    align-items: center;
    position: relative;
    z-index: 1;

    .input-wrapper {
      flex: 1;
      position: relative;

      .input-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        color: #64748b;
      }

      input {
        width: 100%;
        padding: 12px 12px 12px 44px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 10px;
        color: #f1f5f9;
        font-size: 14px;
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

        &.loading {
          opacity: 0.6;
        }
      }
    }

    .connect-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #4a4f5e, #2a2e3d);
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
      cursor: not-allowed;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
      opacity: 0.6;
      pointer-events: none;

      .coming-soon-badge {
        font-size: 9px;
        text-transform: uppercase;
        padding: 1px 8px;
        border-radius: 10px;
        background: rgba(56, 189, 248, 0.08);
        color: #38bdf8;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .btn-shimmer {
        position: absolute;
        top: 0;
        left: -100%;
        width: 60%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
        animation: ${shimmer} 4s ease-in-out infinite;
      }
    }
  }

  .connection-status {
    margin-top: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
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
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;

      &.green { background: #22c55e; animation: ${breathe} 2s ease-in-out infinite; }
      &.red { background: #ef4444; }
      &.blue { background: #38bdf8; animation: ${breathe} 2s ease-in-out infinite; }
    }
  }

  @media (max-width: 600px) {
    padding: 18px 16px;
    .input-group {
      flex-direction: column;
      .connect-btn { width: 100%; justify-content: center; }
    }
  }

  @media (max-width: 480px) {
    padding: 14px 12px;
  }
`;

// ===== FOLLOWERS LIST =====
const FollowersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto 24px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FollowerCard = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid ${props => props.active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.04)'};
  border-radius: 16px;
  padding: 18px 16px;
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

  .follower-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;

    .follower-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #818cf8, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .follower-info {
      flex: 1;
      min-width: 0;

      .follower-name {
        font-size: 13px;
        font-weight: 600;
        color: #f1f5f9;
      }

      .follower-token {
        font-size: 10px;
        color: #64748b;
        font-family: 'Courier New', monospace;
        margin-top: 1px;
        word-break: break-all;
      }
    }

    .status-badge {
      font-size: 8px;
      padding: 2px 10px;
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

  .follower-details {
    display: flex;
    gap: 12px;
    margin: 8px 0 10px;
    padding: 8px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);

    .detail {
      flex: 1;
      text-align: center;

      .detail-value {
        font-size: 13px;
        font-weight: 700;
        color: #f1f5f9;
        font-family: 'Courier New', monospace;
      }

      .detail-label {
        font-size: 7px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-top: 1px;
      }
    }
  }

  .follower-actions {
    display: flex;
    gap: 6px;

    .action-btn {
      flex: 1;
      padding: 6px 0;
      border: none;
      border-radius: 6px;
      font-size: 11px;
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
    padding: 14px 12px;
    .follower-details { gap: 8px; }
  }
`;

// ===== EMPTY STATE =====
const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  border: 1px dashed rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  grid-column: 1 / -1;

  .empty-icon {
    font-size: 48px;
    opacity: 0.3;
    margin-bottom: 12px;
  }

  .empty-title {
    font-size: 16px;
    font-weight: 600;
    color: #f1f5f9;
  }

  .empty-sub {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const CopyTrading = () => {
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [followers, setFollowers] = useState([
    {
      id: 1,
      name: 'Sarah Williams',
      token: '0x7a3f...9b2e',
      status: 'active',
      copiedTrades: 156,
      profit: 2340.50,
      avatar: 'SW'
    },
    {
      id: 2,
      name: 'Michael Chen',
      token: '0x9d4c...1f8a',
      status: 'pending',
      copiedTrades: 89,
      profit: 1245.30,
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Jessica Patel',
      token: '0x2b8f...7e3c',
      status: 'active',
      copiedTrades: 312,
      profit: 4567.80,
      avatar: 'JP'
    },
    {
      id: 4,
      name: 'David Kim',
      token: '0x5c9e...4a1d',
      status: 'inactive',
      copiedTrades: 45,
      profit: 678.20,
      avatar: 'DK'
    },
    {
      id: 5,
      name: 'Emma Rodriguez',
      token: '0x8f2a...6b7c',
      status: 'active',
      copiedTrades: 234,
      profit: 3456.90,
      avatar: 'ER'
    }
  ]);

  const [totalCopiedTrades] = useState(836);
  const [totalProfit] = useState(12288.70);
  const [activeFollowers] = useState(3);

  const handleConnect = () => {
    if (!tokenInput.trim()) {
      setConnectionStatus({
        type: 'error',
        message: 'Please enter a valid API token'
      });
      return;
    }

    setConnecting(true);
    setConnectionStatus({
      type: 'info',
      message: 'Verifying API token...'
    });

    setTimeout(() => {
      const exists = followers.some(f => f.token === tokenInput.trim());
      
      if (exists) {
        setConnectionStatus({
          type: 'error',
          message: 'This follower is already in your list'
        });
        setConnecting(false);
        return;
      }

      const newFollower = {
        id: Date.now(),
        name: `Trader ${tokenInput.trim().slice(0, 6)}`,
        token: tokenInput.trim(),
        status: 'pending',
        copiedTrades: 0,
        profit: 0,
        avatar: tokenInput.trim().slice(0, 2).toUpperCase()
      };

      setFollowers(prev => [newFollower, ...prev]);
      setConnectionStatus({
        type: 'success',
        message: `Successfully added ${newFollower.name}! They will copy your trades once activated.`
      });
      setTokenInput('');
      setConnecting(false);

      setTimeout(() => {
        setConnectionStatus(null);
      }, 5000);
    }, 1500);
  };

  const handleRemoveFollower = (followerId) => {
    setFollowers(prev => prev.filter(f => f.id !== followerId));
  };

  const handleActivateFollower = (followerId) => {
    setFollowers(prev => prev.map(f => 
      f.id === followerId ? { ...f, status: 'active' } : f
    ));
  };

  const handleViewFollower = (followerId) => {
    console.log('View follower details:', followerId);
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
        <div className="badge">🔄 Copy Trading</div>
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
          <span className="master-badge">🟢 Active</span>
        </div>
        <div className="master-stats">
          <div className="stat">
            <div className="stat-value">{activeFollowers}</div>
            <div className="stat-label">Active Followers</div>
          </div>
          <div className="stat">
            <div className="stat-value">{totalCopiedTrades}</div>
            <div className="stat-label">Total Copied Trades</div>
          </div>
          <div className="stat">
            <div className="stat-value" style={{ color: '#22c55e' }}>${totalProfit.toFixed(2)}</div>
            <div className="stat-label">Total Follower Profit</div>
          </div>
        </div>
      </MasterTraderCard>

      {/* CONNECT FRIEND SECTION */}
      <ConnectSection>
        <div className="section-title">🔗 Add a Follower</div>
        <div className="section-subtitle">
          Enter your friend's API token to let them copy your trades
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <span className="input-icon">🔑</span>
            <input
              type="text"
              placeholder="Enter friend's API token (e.g., 0x7a3f...9b2e)"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConnect();
              }}
              className={connecting ? 'loading' : ''}
            />
          </div>
          <button 
            className="connect-btn" 
            disabled
          >
            <span className="btn-shimmer" />
            <span className="coming-soon-badge">Coming Soon</span>
          </button>
        </div>

        {connectionStatus && (
          <div className={`connection-status ${connectionStatus.type}`}>
            <span className={`status-dot ${connectionStatus.type === 'success' ? 'green' : connectionStatus.type === 'error' ? 'red' : 'blue'}`} />
            {connectionStatus.message}
          </div>
        )}
      </ConnectSection>

      {/* FOLLOWERS LIST */}
      <FollowersGrid>
        {followers.length === 0 ? (
          <EmptyState>
            <div className="empty-icon">📭</div>
            <div className="empty-title">No Followers Yet</div>
            <div className="empty-sub">
              Add your first follower using their API token above.
            </div>
          </EmptyState>
        ) : (
          followers.map((follower) => {
            const status = getStatusBadge(follower.status);
            
            return (
              <FollowerCard key={follower.id} active={follower.status === 'active'}>
                <div className="follower-header">
                  <div className="follower-avatar">{follower.avatar}</div>
                  <div className="follower-info">
                    <div className="follower-name">{follower.name}</div>
                    <div className="follower-token">{follower.token}</div>
                  </div>
                  <span className={`status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="follower-details">
                  <div className="detail">
                    <div className="detail-value">{follower.copiedTrades}</div>
                    <div className="detail-label">Trades</div>
                  </div>
                  <div className="detail">
                    <div className="detail-value" style={{ color: follower.profit > 0 ? '#22c55e' : '#ef4444' }}>
                      ${follower.profit.toFixed(2)}
                    </div>
                    <div className="detail-label">Profit</div>
                  </div>
                </div>

                <div className="follower-actions">
                  {follower.status === 'pending' ? (
                    <>
                      <button className="action-btn activate" onClick={() => handleActivateFollower(follower.id)}>
                        ✅ Activate
                      </button>
                      <button className="action-btn remove" onClick={() => handleRemoveFollower(follower.id)}>
                        Remove
                      </button>
                    </>
                  ) : follower.status === 'active' ? (
                    <>
                      <button className="action-btn view" onClick={() => handleViewFollower(follower.id)}>
                        👁️ View
                      </button>
                      <button className="action-btn remove" onClick={() => handleRemoveFollower(follower.id)}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn activate" onClick={() => handleActivateFollower(follower.id)}>
                        🔄 Reactivate
                      </button>
                      <button className="action-btn remove" onClick={() => handleRemoveFollower(follower.id)}>
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </FollowerCard>
            );
          })
        )}
      </FollowersGrid>

      {/* FOOTER */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        textAlign: 'center',
        fontSize: '11px',
        color: '#4a4f5e',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
      }}>
        Voltix Traders • Copy Trading
        <span style={{ display: 'block', marginTop: '2px', color: '#3a4055' }}>
          🔄 Share your trades with followers and grow together
        </span>
      </div>
    </PageWrapper>
  );
};

export default CopyTrading;