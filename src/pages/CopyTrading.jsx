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

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
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

// ===== CONNECT TRADER SECTION =====
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
      background: linear-gradient(135deg, #2962ff, #1a4fcf);
      color: #ffffff;
      font-size: 13px;
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

// ===== TRADERS LIST =====
const TradersGrid = styled.div`
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

const TraderCard = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid ${props => props.connected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.04)'};
  border-radius: 16px;
  padding: 20px 18px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(56, 189, 248, 0.06);
    background: rgba(255, 255, 255, 0.02);
    transform: translateY(-2px);
  }

  ${props => props.connected && `
    border-color: rgba(34, 197, 94, 0.15);
    background: rgba(34, 197, 94, 0.02);
  `}

  .trader-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .trader-info {
      flex: 1;
      min-width: 0;

      .trader-name {
        font-size: 14px;
        font-weight: 600;
        color: #f1f5f9;
      }

      .trader-token {
        font-size: 11px;
        color: #64748b;
        font-family: 'Courier New', monospace;
        margin-top: 1px;
        word-break: break-all;
      }
    }

    .status-badge {
      font-size: 9px;
      padding: 2px 10px;
      border-radius: 20px;
      font-weight: 600;
      flex-shrink: 0;

      &.connected {
        background: rgba(34, 197, 94, 0.08);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.1);
      }

      &.pending {
        background: rgba(251, 191, 36, 0.08);
        color: #fbbf24;
        border: 1px solid rgba(251, 191, 36, 0.1);
      }

      &.disconnected {
        background: rgba(239, 68, 68, 0.08);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.1);
      }
    }
  }

  .trader-stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
    margin: 12px 0;
    padding: 10px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);

    .stat {
      text-align: center;

      .stat-value {
        font-size: 15px;
        font-weight: 700;
        color: #f1f5f9;
        font-family: 'Courier New', monospace;

        &.win { color: #22c55e; }
        &.loss { color: #ef4444; }
        &.rate { color: #38bdf8; }
      }

      .stat-label {
        font-size: 8px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-top: 1px;
      }
    }
  }

  .trader-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;

    .action-btn {
      flex: 1;
      padding: 8px 0;
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &.copy {
        background: linear-gradient(135deg, #2962ff, #1a4fcf);
        color: white;

        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(41, 98, 255, 0.3);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

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

      &.copying {
        background: rgba(34, 197, 94, 0.08);
        color: #22c55e;
        cursor: not-allowed;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(34, 197, 94, 0.1);
          border-top-color: #22c55e;
          border-radius: 50%;
          animation: ${spin} 0.8s linear infinite;
        }
      }
    }
  }

  @media (max-width: 480px) {
    padding: 16px 14px;
    .trader-stats { grid-template-columns: 1fr 1fr 1fr; }
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
  const [traders, setTraders] = useState([
    {
      id: 1,
      name: 'Elite Trader',
      token: '0x7a3f...9b2e',
      status: 'connected',
      wins: 156,
      losses: 89,
      winRate: 63.7,
      avatar: 'ET'
    },
    {
      id: 2,
      name: 'Crypto King',
      token: '0x9d4c...1f8a',
      status: 'pending',
      wins: 234,
      losses: 145,
      winRate: 61.7,
      avatar: 'CK'
    },
    {
      id: 3,
      name: 'Volatility Pro',
      token: '0x2b8f...7e3c',
      status: 'connected',
      wins: 89,
      losses: 52,
      winRate: 63.1,
      avatar: 'VP'
    },
    {
      id: 4,
      name: 'Deriv Master',
      token: '0x5c9e...4a1d',
      status: 'disconnected',
      wins: 312,
      losses: 198,
      winRate: 61.2,
      avatar: 'DM'
    },
    {
      id: 5,
      name: 'Scalper Elite',
      token: '0x8f2a...6b7c',
      status: 'connected',
      wins: 445,
      losses: 267,
      winRate: 62.5,
      avatar: 'SE'
    }
  ]);

  const [copyingStates, setCopyingStates] = useState({});

  const handleConnect = () => {
    if (!tokenInput.trim()) {
      setConnectionStatus({
        type: 'error',
        message: 'Please enter a valid trader token'
      });
      return;
    }

    setConnecting(true);
    setConnectionStatus({
      type: 'info',
      message: 'Verifying trader token...'
    });

    // Simulate API call
    setTimeout(() => {
      // Check if token already exists
      const exists = traders.some(t => t.token === tokenInput.trim());
      
      if (exists) {
        setConnectionStatus({
          type: 'error',
          message: 'This trader is already in your list'
        });
        setConnecting(false);
        return;
      }

      // Simulate finding a trader
      const foundTrader = {
        id: Date.now(),
        name: `Trader ${tokenInput.trim().slice(0, 6)}`,
        token: tokenInput.trim(),
        status: 'pending',
        wins: Math.floor(Math.random() * 200) + 50,
        losses: Math.floor(Math.random() * 150) + 30,
        winRate: (Math.random() * 20 + 50).toFixed(1),
        avatar: tokenInput.trim().slice(0, 2).toUpperCase()
      };

      setTraders(prev => [foundTrader, ...prev]);
      setConnectionStatus({
        type: 'success',
        message: `Successfully connected to ${foundTrader.name}!`
      });
      setTokenInput('');
      setConnecting(false);

      // Clear status after 5 seconds
      setTimeout(() => {
        setConnectionStatus(null);
      }, 5000);
    }, 1500);
  };

  const handleCopyTrade = (traderId) => {
    setCopyingStates(prev => ({ ...prev, [traderId]: true }));

    // Simulate copy trading
    setTimeout(() => {
      setCopyingStates(prev => ({ ...prev, [traderId]: false }));
      // Update trader status to connected
      setTraders(prev => prev.map(t => 
        t.id === traderId ? { ...t, status: 'connected' } : t
      ));
    }, 2000);
  };

  const handleRemoveTrader = (traderId) => {
    setTraders(prev => prev.filter(t => t.id !== traderId));
  };

  const handleViewTrader = (traderId) => {
    console.log('View trader details:', traderId);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusBadge = (status) => {
    const badges = {
      connected: { label: 'Connected', className: 'connected' },
      pending: { label: 'Pending', className: 'pending' },
      disconnected: { label: 'Disconnected', className: 'disconnected' }
    };
    return badges[status] || badges.disconnected;
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
          Connect with successful traders and automatically copy their trades using their unique token.
        </p>
      </HeroSection>

      {/* CONNECT SECTION */}
      <ConnectSection>
        <div className="section-title">🔗 Connect a Trader</div>
        <div className="section-subtitle">
          Enter a trader's unique token to start copying their trades automatically
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <span className="input-icon">🔑</span>
            <input
              type="text"
              placeholder="Enter trader token (e.g., 0x7a3f...9b2e)"
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
            onClick={handleConnect}
            disabled={connecting || !tokenInput.trim()}
          >
            <span className="btn-shimmer" />
            {connecting ? 'Connecting...' : 'Connect'}
          </button>
        </div>

        {connectionStatus && (
          <div className={`connection-status ${connectionStatus.type}`}>
            <span className={`status-dot ${connectionStatus.type === 'success' ? 'green' : connectionStatus.type === 'error' ? 'red' : 'blue'}`} />
            {connectionStatus.message}
          </div>
        )}
      </ConnectSection>

      {/* TRADERS LIST */}
      <TradersGrid>
        {traders.length === 0 ? (
          <EmptyState>
            <div className="empty-icon">📭</div>
            <div className="empty-title">No Traders Connected</div>
            <div className="empty-sub">
              Connect with your first trader using their token above to start copy trading.
            </div>
          </EmptyState>
        ) : (
          traders.map((trader) => {
            const status = getStatusBadge(trader.status);
            const isCopying = copyingStates[trader.id];
            
            return (
              <TraderCard key={trader.id} connected={trader.status === 'connected'}>
                <div className="trader-header">
                  <div className="avatar">{trader.avatar}</div>
                  <div className="trader-info">
                    <div className="trader-name">{trader.name}</div>
                    <div className="trader-token">{trader.token}</div>
                  </div>
                  <span className={`status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="trader-stats">
                  <div className="stat">
                    <div className="stat-value win">{trader.wins}</div>
                    <div className="stat-label">Wins</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value loss">{trader.losses}</div>
                    <div className="stat-label">Losses</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value rate">{trader.winRate}%</div>
                    <div className="stat-label">Win Rate</div>
                  </div>
                </div>

                <div className="trader-actions">
                  {trader.status === 'connected' ? (
                    <>
                      <button className="action-btn view" onClick={() => handleViewTrader(trader.id)}>
                        👁️ View
                      </button>
                      <button className="action-btn remove" onClick={() => handleRemoveTrader(trader.id)}>
                        Remove
                      </button>
                    </>
                  ) : trader.status === 'pending' ? (
                    <>
                      <button 
                        className="action-btn copy" 
                        onClick={() => handleCopyTrade(trader.id)}
                        disabled={isCopying}
                      >
                        {isCopying ? (
                          <>
                            <span className="spinner" />
                            Copying...
                          </>
                        ) : (
                          '📋 Copy Trade'
                        )}
                      </button>
                      <button className="action-btn remove" onClick={() => handleRemoveTrader(trader.id)}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="action-btn copy" 
                        onClick={() => handleCopyTrade(trader.id)}
                        disabled={isCopying}
                      >
                        {isCopying ? (
                          <>
                            <span className="spinner" />
                            Copying...
                          </>
                        ) : (
                          '🔄 Reconnect'
                        )}
                      </button>
                      <button className="action-btn remove" onClick={() => handleRemoveTrader(trader.id)}>
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </TraderCard>
            );
          })
        )}
      </TradersGrid>

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
          🔄 Copy successful traders and grow your portfolio
        </span>
      </div>
    </PageWrapper>
  );
};

export default CopyTrading;