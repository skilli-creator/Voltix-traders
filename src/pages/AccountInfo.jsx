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

const breathe = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

const countUp = keyframes`
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
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
  max-width: 600px;
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
      background: ${props => props.status === 'Active' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
      color: ${props => props.status === 'Active' ? '#22c55e' : '#ef4444'};
      border: 1px solid ${props => props.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${props => props.status === 'Active' ? '#22c55e' : '#ef4444'};
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

    .balance-currency {
      font-size: 16px;
      color: #64748b;
      font-weight: 500;
    }
  }

  .account-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto 24px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 18px 16px;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: rgba(56, 189, 248, 0.06);
    background: rgba(255, 255, 255, 0.02);
    transform: translateY(-2px);
  }

  .card-icon {
    font-size: 28px;
    margin-bottom: 6px;
  }

  .card-value {
    font-size: 20px;
    font-weight: 700;
    color: #f1f5f9;
    font-family: 'Courier New', monospace;
  }

  .card-label {
    font-size: 10px;
    color: #64748b;
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  @media (max-width: 480px) {
    padding: 14px 12px;
    .card-value { font-size: 17px; }
    .card-icon { font-size: 24px; }
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
          margin: 600.00,
          leverage: '1:500',
          status: 'Active',
          loginStatus: 'online'
        },
        profile: {
          name: 'John Trader',
          email: 'john@voltixtraders.com'
        }
      });
      setLoading(false);
    }, 1200);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatCurrency = (value) => {
    return `${value.toFixed(2)}`;
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

  const { account, profile } = accountData;

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
          View your account details, balance, and trading information.
        </p>
      </HeroSection>

      {/* ACCOUNT SUMMARY */}
      <AccountSummaryCard status={account.status}>
        <div className="account-header">
          <span className="account-label">Account Summary</span>
          <span className="account-status">
            <span className="dot" />
            {account.status}
          </span>
        </div>
        <div className="account-balance">
          <div className="balance-label">Total Balance</div>
          <div className="balance-value">
            {account.currency} {formatCurrency(account.balance)}
          </div>
          <div className="balance-currency">Equity: {account.currency} {formatCurrency(account.equity)}</div>
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
          <div className="meta-item">
            <div className="meta-label">Margin Used</div>
            <div className="meta-value">{account.currency} {formatCurrency(account.margin)}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Login Status</div>
            <div className="meta-value" style={{ color: account.loginStatus === 'online' ? '#22c55e' : '#ef4444' }}>
              {account.loginStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
            </div>
          </div>
        </div>
      </AccountSummaryCard>

      {/* QUICK INFO CARDS */}
      <InfoGrid>
        <InfoCard>
          <div className="card-icon">👤</div>
          <div className="card-value">{profile.name}</div>
          <div className="card-label">Account Holder</div>
        </InfoCard>

        <InfoCard>
          <div className="card-icon">📧</div>
          <div className="card-value" style={{ fontSize: '14px' }}>{profile.email}</div>
          <div className="card-label">Email Address</div>
        </InfoCard>

        <InfoCard>
          <div className="card-icon">💰</div>
          <div className="card-value">{account.currency} {formatCurrency(account.balance)}</div>
          <div className="card-label">Available Balance</div>
        </InfoCard>
      </InfoGrid>

      {/* FOOTER */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        textAlign: 'center',
        fontSize: '11px',
        color: '#4a4f5e',
        maxWidth: '600px',
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