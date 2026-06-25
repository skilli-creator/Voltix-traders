// src/components/TopBar.jsx (Mobile-optimized)

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(8, 12, 24, 0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.06);
  height: 48px;
  flex-shrink: 0;
  z-index: 100;

  @media (min-width: 769px) {
    padding: 12px 32px;
    height: 64px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;

  .icon { font-size: 1rem; }
  .brand-text { display: flex; align-items: center; gap: 2px; }
  .voltix {
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .deriv { color: #ff444f; font-style: italic; }

  @media (min-width: 769px) {
    font-size: 1.2rem;
    gap: 10px;
    .icon { font-size: 1.3rem; }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (min-width: 769px) {
    gap: 16px;
  }
`;

const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px 3px 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  cursor: pointer;

  .flag { font-size: 12px; }
  .balance { font-size: 10px; font-weight: 600; color: #f1f5f9; }

  @media (min-width: 769px) {
    padding: 6px 16px 6px 10px;
    gap: 8px;
    .flag { font-size: 16px; }
    .balance { font-size: 13px; }
  }
`;

const ActionButton = styled.button`
  display: none;
  padding: 3px 8px;
  border-radius: 16px;
  border: none;
  font-size: 9px;
  font-weight: 500;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;

  @media (min-width: 769px) {
    display: flex;
    padding: 6px 14px;
    font-size: 12px;
    gap: 4px;
  }
`;

const WithdrawButton = styled(ActionButton)`
  background: rgba(56, 189, 248, 0.08);
  color: #38bdf8;
`;
const DepositButton = styled(ActionButton)`
  background: rgba(34, 197, 94, 0.08);
  color: #22c55e;
`;
const LogoutButton = styled(ActionButton)`
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
`;

const AccountCode = styled.span`
  display: none;
  font-size: 9px;
  color: #94a3b8;
  font-family: 'Courier New', monospace;
  padding: 2px 4px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;

  @media (min-width: 769px) {
    display: inline;
    font-size: 12px;
    padding: 4px 8px;
  }
`;

const TopPanel = () => {
  const [accountType, setAccountType] = useState('real');
  const accountData = {
    code: 'CR123456',
    real: { balance: 7110.00, flag: '🇺🇸' },
    demo: { balance: 10000.00, flag: '🎯' }
  };
  const currentAccount = accountType === 'real' ? accountData.real : accountData.demo;

  return (
    <TopBar>
      <Brand>
        <span className="icon">🔷</span>
        <span className="brand-text">
          <span className="voltix">Voltix</span>
          <span className="deriv">deriv</span>
        </span>
      </Brand>

      <RightSection>
        <AccountCode>{accountData.code}</AccountCode>
        <AccountBadge>
          <span className="flag">{currentAccount.flag}</span>
          <span className="balance">${currentAccount.balance.toFixed(2)}</span>
        </AccountBadge>
        <WithdrawButton>💰</WithdrawButton>
        <DepositButton>📥</DepositButton>
        <LogoutButton>🚪</LogoutButton>
      </RightSection>
    </TopBar>
  );
};

export default TopPanel;