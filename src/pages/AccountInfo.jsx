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
  50% { transform: translateY(-6px); }
`;

const countUp = keyframes`
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

// ===== ACCOUNT SUMMARY CARD =====
const AccountSummaryCard = styled.div`
  max-width: 900px;
  margin: 0 auto 24px;
  width: 100%;
  background: linear-gradient(135deg, rgba(41, 98, 255, 0.04), rgba(129, 140, 248, 0.02));
  border: 1px solid rgba(56, 189, 248, 0.06);
  border-radius: 20px;
  padding: 28px 30px;
  animation: ${fadeIn} 0.7s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.03), transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(129, 140, 248, 0.02), transparent 70%);
    border-radius: 50%;
  }

  .account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;

    .account-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .account-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(34, 197, 94, 0.08);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.1);

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
        animation: ${breathe} 2s ease-in-out infinite;
      }
    }
  }

  .account-balance {
    position: relative;
    z-index: 1;

    .balance-label {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .balance-value {
      font-size: 42px;
      font-weight: 800;
      color: #f1f5f9;
      margin: 4px 0 2px;
      letter-spacing: -1px;
      animation: ${countUp} 0.6s ease;
    }

    .balance-change {
      font-size: 13px;
      color: #22c55e;
      font-weight: 500;
    }
  }

  .account-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.02);
    position: relative;
    z-index: 1;

    .meta-item {
      .meta-label {
        font-size: 9px;
        text-transform: uppercase;
        color: #64748b;
        letter-spacing: 0.5px;
      }
      .meta-value {
        font-size: 14px;
        font-weight: 600;
        color: #f1f5f9;
        margin-top: 2px;
        font-family: 'Courier New', monospace;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    .account-balance .balance-value { font-size: 30px; }
    .account-meta { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
    .account-balance .balance-value { font-size: 24px; }
    .account-meta { grid-template-columns: 1fr 1fr; gap: 8px; }
  }
`;

// ===== INFO GRID =====
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto 24px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 20px 22px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(56, 189, 248, 0.06);
    background: rgba(255, 255, 255, 0.02);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;

    .card-icon {
      font-size: 18px;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(56, 189, 248, 0.04);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-title {
      font-size: 13px;
      font-weight: 600;
      color: #f1f5f9;
      flex: 1;
    }

    .card-badge {
      font-size: 9px;
      padding: 2px 10px;
      border-radius: 20px;
      background: rgba(56, 189, 248, 0.06);
      color: #38bdf8;
      font-weight: 600;
    }
  }

  .card-content {
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.02);

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 12px;
        color: #94a3b8;
      }

      .value {
        font-size: 13px;
        font-weight: 500;
        color: #f1f5f9;
        font-family: 'Courier New', monospace;

        &.highlight {
          color: #38bdf8;
        }

        &.success {
          color: #22c55e;
        }

        &.warning {
          color: #fbbf24;
        }

        &.danger {
          color: #ef4444;
        }
      }
    }
  }

  .card-progress {
    margin-top: 12px;
    .progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 4px;
      overflow: hidden;
      .fill {
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, #38bdf8, #818cf8);
        width: 0%;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 16px 14px;
    .card-header .card-title { font-size: 12px; }
    .card-content .info-row .label { font-size: 11px; }
    .card-content .info-row .value { font-size: 12px; }
  }
`;

// ===== FULL WIDTH CARD =====
const FullWidthCard = styled.div`
  max-width: 900px;
  margin: 0 auto 24px;
  width: 100%;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 24px 28px;
  animation: ${fadeIn} 0.9s ease;

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;

    .icon { font-size: 18px; }
  }

  .activity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;

    .activity-item {
      background: rgba(255, 255, 255, 0.02);
      padding: 12px 14px;
      border-radius: 10px;
      text-align: center;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.04);
      }

      .number {
        font-size: 20px;
        font-weight: 700;
        color: #f1f5f9;
      }

      .label {
        font-size: 10px;
        color: #64748b;
        margin-top: 2px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      &.total { border-bottom: 2px solid #38bdf8; }
      &.won { border-bottom: 2px solid #22c55e; }
      &.lost { border-bottom: 2px solid #ef4444; }
    }
  }

  @media (max-width: 600px) {
    padding: 18px 16px;
    .activity-grid { grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .activity-item .number { font-size: 16px; }
  }

  @media (max-width: 480px) {
    padding: 14px 12px;
  }
`;

// ===== LOADING =====
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  flex-direction: column;
  gap: 16px;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.03);
    border-top-color: #38bdf8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .text {
    font-size: 13px;
    color: #64748b;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const AccountInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState(null);

  // Simulated API data - In production, fetch from actual API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccountData({
        account: {
          id: 'CR123456',
          type: 'Real',
          balance: 7110.00,
          currency: 'USD',
          equity: 7345.50,
          freeMargin: 6745.50,
          margin: 600.00,
          leverage: '1:500',
          status: 'Active'
        },
        profile: {
          name: 'John Trader',
          email: 'john@voltixtraders.com',
          country: 'Kenya',
          phone: '+254 712 345 678',
          verified: true,
          kycLevel: 'Level 2',
          joined: '2024-01-15'
        },
        trading: {
          totalTrades: 342,
          won: 189,
          lost: 153,
          winRate: 55.26,
          profit: 1420.50,
          loss: -890.30,
          netProfit: 530.20,
          bestTrade: 45.60,
          worstTrade: -28.30,
          averageWin: 7.52,
          averageLoss: -5.82
        },
        connectedAccounts: [
          { platform: 'Deriv', status: 'Connected', lastSync: '2024-06-30 14:30' },
          { platform: 'MetaTrader 5', status: 'Connected', lastSync: '2024-06-30 13:45' },
          { platform: 'Deriv X', status: 'Pending', lastSync: '2024-06-29 09:00' }
        ],
        security: {
          twoFactorAuth: true,
          lastLogin: '2024-06-30 14:25',
          ip: '192.168.1.100',
          device: 'Chrome / Windows',
          loginHistory: [
            { date: '2024-06-30 14:25', device: 'Chrome / Windows', location: 'Nairobi, Kenya' },
            { date: '2024-06-29 10:15', device: 'Firefox / Windows', location: 'Nairobi, Kenya' },
            { date: '2024-06-28 20:30', device: 'Safari / iOS', location: 'Mombasa, Kenya' }
          ]
        },
        recentTrades: [
          { id: 1, market: 'Volatility 100', type: 'Over', stake: 10, result: 'Win', profit: 9.20, time: '14:25' },
          { id: 2, market: 'Volatility 50', type: 'Under', stake: 5, result: 'Loss', profit: -5.00, time: '14:18' },
          { id: 3, market: 'Volatility 25', type: 'Even', stake: 8, result: 'Win', profit: 7.20, time: '14:10' },
          { id: 4, market: 'Volatility 10', type: 'Over', stake: 12, result: 'Win', profit: 10.80, time: '14:02' },
          { id: 5, market: 'Volatility 100', type: 'Matches', stake: 3, result: 'Loss', profit: -3.00, time: '13:55' }
        ]
      });
      setLoading(false);
    }, 1500);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <PageWrapper>
        <BackButton onClick={handleGoBack}>
          <span className="arrow">←</span> Back
        </BackButton>
        <LoadingSpinner>
          <div className="spinner" />
          <div className="text">Fetching account information...</div>
        </LoadingSpinner>
      </PageWrapper>
    );
  }

  if (!accountData) {
    return (
      <PageWrapper>
        <BackButton onClick={handleGoBack}>
          <span className="arrow">←</span> Back
        </BackButton>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>😕</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9' }}>No Account Data</div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>
            Could not fetch account information. Please try again later.
          </div>
        </div>
      </PageWrapper>
    );
  }

  const { account, profile, trading, connectedAccounts, security, recentTrades } = accountData;

  return (
    <PageWrapper>
      <BackButton onClick={handleGoBack}>
        <span className="arrow">←</span> Back
      </BackButton>

      <HeroSection>
        <div className="badge">🔐 Account Overview</div>
        <h1 className="title">
          Your <span className="gradient">Deriv Account</span>
        </h1>
        <p className="subtitle">
          Complete overview of your trading account, performance metrics, and security settings.
        </p>
      </HeroSection>

      {/* ACCOUNT SUMMARY */}
      <AccountSummaryCard>
        <div className="account-header">
          <span className="account-label">Account Summary</span>
          <span className="account-status">
            <span className="dot" />
            {account.status}
          </span>
        </div>
        <div className="account-balance">
          <div className="balance-label">Total Balance</div>
          <div className="balance-value">{formatCurrency(account.balance)}</div>
          <div className="balance-change">+{formatCurrency(trading.netProfit)} this month</div>
        </div>
        <div className="account-meta">
          <div className="meta-item">
            <div className="meta-label">Account ID</div>
            <div className="meta-value">{account.id}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Account Type</div>
            <div className="meta-value">{account.type}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Leverage</div>
            <div className="meta-value">{account.leverage}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Currency</div>
            <div className="meta-value">{account.currency}</div>
          </div>
        </div>
      </AccountSummaryCard>

      {/* INFO GRID */}
      <InfoGrid>
        {/* Profile Card */}
        <InfoCard>
          <div className="card-header">
            <span className="card-icon">👤</span>
            <span className="card-title">Profile Information</span>
            <span className="card-badge">{profile.kycLevel}</span>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="label">Name</span>
              <span className="value">{profile.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email</span>
              <span className="value">{profile.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Country</span>
              <span className="value">{profile.country}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone</span>
              <span className="value">{profile.phone}</span>
            </div>
            <div className="info-row">
              <span className="label">Verified</span>
              <span className="value success">{profile.verified ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div className="info-row">
              <span className="label">Joined</span>
              <span className="value">{formatDate(profile.joined)}</span>
            </div>
          </div>
        </InfoCard>

        {/* Trading Stats Card */}
        <InfoCard>
          <div className="card-header">
            <span className="card-icon">📊</span>
            <span className="card-title">Trading Statistics</span>
            <span className="card-badge">Lifetime</span>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="label">Total Trades</span>
              <span className="value">{trading.totalTrades}</span>
            </div>
            <div className="info-row">
              <span className="label">Won</span>
              <span className="value success">{trading.won}</span>
            </div>
            <div className="info-row">
              <span className="label">Lost</span>
              <span className="value danger">{trading.lost}</span>
            </div>
            <div className="info-row">
              <span className="label">Win Rate</span>
              <span className="value highlight">{trading.winRate}%</span>
            </div>
            <div className="info-row">
              <span className="label">Net Profit</span>
              <span className="value success">{formatCurrency(trading.netProfit)}</span>
            </div>
            <div className="info-row">
              <span className="label">Best Trade</span>
              <span className="value success">{formatCurrency(trading.bestTrade)}</span>
            </div>
          </div>
          <div className="card-progress">
            <div className="progress-label">
              <span>Win Rate Target: 60%</span>
              <span>{trading.winRate}%</span>
            </div>
            <div className="progress-bar">
              <div className="fill" style={{ width: `${Math.min((trading.winRate / 60) * 100, 100)}%` }} />
            </div>
          </div>
        </InfoCard>

        {/* Connected Accounts Card */}
        <InfoCard>
          <div className="card-header">
            <span className="card-icon">🔗</span>
            <span className="card-title">Connected Accounts</span>
            <span className="card-badge">{connectedAccounts.length}</span>
          </div>
          <div className="card-content">
            {connectedAccounts.map((conn, index) => (
              <div className="info-row" key={index}>
                <span className="label">{conn.platform}</span>
                <span className={`value ${conn.status === 'Connected' ? 'success' : 'warning'}`}>
                  {conn.status}
                </span>
              </div>
            ))}
          </div>
        </InfoCard>

        {/* Security Card */}
        <InfoCard>
          <div className="card-header">
            <span className="card-icon">🔒</span>
            <span className="card-title">Security</span>
            <span className="card-badge">Active</span>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="label">2FA Enabled</span>
              <span className={`value ${security.twoFactorAuth ? 'success' : 'warning'}`}>
                {security.twoFactorAuth ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Last Login</span>
              <span className="value">{security.lastLogin}</span>
            </div>
            <div className="info-row">
              <span className="label">IP Address</span>
              <span className="value" style={{ fontSize: '11px' }}>{security.ip}</span>
            </div>
            <div className="info-row">
              <span className="label">Device</span>
              <span className="value" style={{ fontSize: '11px' }}>{security.device}</span>
            </div>
          </div>
        </InfoCard>
      </InfoGrid>

      {/* RECENT TRADES */}
      <FullWidthCard>
        <div className="card-title">
          <span className="icon">📈</span>
          Recent Trades
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Time</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Market</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Type</th>
                <th style={{ padding: '10px 8px', textAlign: 'right', color: '#64748b', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Stake</th>
                <th style={{ padding: '10px 8px', textAlign: 'right', color: '#64748b', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Result</th>
                <th style={{ padding: '10px 8px', textAlign: 'right', color: '#64748b', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade) => (
                <tr key={trade.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '8px', color: '#94a3b8', fontSize: '12px' }}>{trade.time}</td>
                  <td style={{ padding: '8px', color: '#f1f5f9', fontWeight: 500 }}>{trade.market}</td>
                  <td style={{ padding: '8px', color: '#94a3b8' }}>{trade.type}</td>
                  <td style={{ padding: '8px', textAlign: 'right', color: '#f1f5f9' }}>{formatCurrency(trade.stake)}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: trade.result === 'Win' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                      color: trade.result === 'Win' ? '#22c55e' : '#ef4444'
                    }}>
                      {trade.result}
                    </span>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', color: trade.profit > 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                    {formatCurrency(trade.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FullWidthCard>

      {/* LOGIN HISTORY */}
      <FullWidthCard>
        <div className="card-title">
          <span className="icon">🕐</span>
          Login History
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Date & Time</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Device</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {security.loginHistory.map((login, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '8px', color: '#94a3b8', fontSize: '12px' }}>{login.date}</td>
                  <td style={{ padding: '8px', color: '#f1f5f9' }}>{login.device}</td>
                  <td style={{ padding: '8px', color: '#94a3b8' }}>{login.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FullWidthCard>

      {/* ACTIVITY SUMMARY */}
      <FullWidthCard>
        <div className="card-title">
          <span className="icon">📊</span>
          Trading Activity Summary
        </div>
        <div className="activity-grid">
          <div className="activity-item total">
            <div className="number">{trading.totalTrades}</div>
            <div className="label">Total Trades</div>
          </div>
          <div className="activity-item won">
            <div className="number">{trading.won}</div>
            <div className="label">Won</div>
          </div>
          <div className="activity-item lost">
            <div className="number">{trading.lost}</div>
            <div className="label">Lost</div>
          </div>
          <div className="activity-item total">
            <div className="number">{trading.winRate}%</div>
            <div className="label">Win Rate</div>
          </div>
          <div className="activity-item won">
            <div className="number">{formatCurrency(trading.netProfit)}</div>
            <div className="label">Net Profit</div>
          </div>
          <div className="activity-item lost">
            <div className="number">{formatCurrency(trading.averageWin)}</div>
            <div className="label">Avg Win</div>
          </div>
        </div>
      </FullWidthCard>

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
        Voltix Traders • Account Information
        <span style={{ display: 'block', marginTop: '2px', color: '#3a4055' }}>
          🔐 Your data is secure and encrypted
        </span>
      </div>
    </PageWrapper>
  );
};

export default AccountInfo;