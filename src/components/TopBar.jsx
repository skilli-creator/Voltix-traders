import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// KEYFRAMES FOR LIVE DOT
// ============================================
const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    padding: 10px 20px;
    flex-wrap: wrap;
    height: auto;
    gap: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px 16px;
    height: auto;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

// ===== LEFT SIDE - BRAND WITH LIVE DOT =====
const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;

  .icon {
    font-size: 1.6rem;
    animation: ${float} 3s ease-in-out infinite;
  }

  .brand-text {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .voltix {
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .deriv {
    color: #ff444f;
    font-style: italic;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    position: relative;
    margin-left: 4px;
    flex-shrink: 0;

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite;
    }

    &::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite 0.5s;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    .live-dot {
      width: 6px;
      height: 6px;
      &::before { inset: -3px; }
      &::after { inset: -6px; }
    }
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    .live-dot {
      width: 5px;
      height: 5px;
      &::before { inset: -2px; }
      &::after { inset: -5px; }
    }
  }
`;

// ===== RIGHT SIDE - ACCOUNT ACTIONS =====
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

// ===== ACCOUNT CODE =====
const AccountCode = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
  font-family: 'Courier New', monospace;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 3px 6px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 2px 4px;
  }
`;

// ===== ACCOUNT BADGE =====
const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px 6px 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  user-select: none;

  &:hover {
    background: rgba(20, 30, 55, 0.9);
    border-color: rgba(56, 189, 248, 0.5);
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.05);
  }

  .flag {
    font-size: 18px;
  }

  .balance {
    font-size: 14px;
    font-weight: 600;
    color: #f1f5f9;
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .currency-toggle {
    font-size: 10px;
    color: #94a3b8;
    background: rgba(56, 189, 248, 0.1);
    padding: 2px 6px;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.2s ease;
    margin-left: 2px;

    &:hover {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
    }
  }

  .chevron {
    font-size: 12px;
    color: #94a3b8;
    transition: transform 0.2s ease;
    margin-left: 4px;

    &.open {
      transform: rotate(180deg);
    }
  }

  @media (max-width: 768px) {
    padding: 4px 12px 4px 8px;
    .balance {
      font-size: 12px;
    }
    .flag {
      font-size: 16px;
    }
    .chevron {
      font-size: 10px;
    }
    .currency-toggle {
      font-size: 9px;
      padding: 1px 4px;
    }
  }

  @media (max-width: 480px) {
    padding: 3px 8px 3px 6px;
    .balance {
      font-size: 11px;
    }
    .flag {
      font-size: 14px;
    }
    gap: 4px;
    .currency-toggle {
      font-size: 8px;
      padding: 1px 3px;
    }
  }
`;

// ===== DROPDOWN MENU =====
const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 260px;
  background: rgba(8, 18, 38, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 12px;
  padding: 6px 0;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease;
  z-index: 200;
  overflow: hidden;

  @media (max-width: 480px) {
    min-width: 220px;
    right: -10px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
  color: #cbd5e1;

  &:hover {
    background: rgba(56, 189, 248, 0.08);
    color: #f1f5f9;
  }

  &.active {
    background: rgba(56, 189, 248, 0.12);
    color: #38bdf8;

    .check {
      display: block;
    }
  }

  .flag {
    font-size: 16px;
  }

  .label {
    flex: 1;
  }

  .balance-small {
    font-size: 12px;
    color: #94a3b8;
  }

  .check {
    display: none;
    color: #38bdf8;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const CurrencyToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-top: 1px solid rgba(56, 189, 248, 0.1);
  margin-top: 4px;
  background: rgba(56, 189, 248, 0.03);

  .label {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .toggle-group {
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 2px;
    flex: 1;
  }

  .toggle-option {
    flex: 1;
    padding: 4px 8px;
    border-radius: 16px;
    border: none;
    background: transparent;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #cbd5e1;
    }

    &.active {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

// ===== ACTION BUTTONS =====
const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 30px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #f1f5f9;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    padding: 5px 12px;
    font-size: 11px;
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 10px;
    gap: 4px;
  }
`;

const WithdrawButton = styled(ActionButton)`
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
`;

const DepositButton = styled(ActionButton)`
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
`;

const LogoutButton = styled(ActionButton)`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
`;

// ============================================
// MAIN COMPONENT
// ============================================

const TopPanel = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [accountType, setAccountType] = useState('real');
  const [showBalanceInKsh, setShowBalanceInKsh] = useState(false);
  const dropdownRef = useRef(null);

  const accountData = {
    code: 'CR123456',
    real: { 
      balance: 7110.00, 
      currency: 'USD', 
      flag: '🇰🇪', // Changed from 🇺🇸 to 🇰🇪
      kshBalance: 7110.00 * 150.50 
    },
    demo: { 
      balance: 10000.00, 
      currency: 'USD', 
      flag: '🎯', 
      kshBalance: 10000.00 * 150.50 
    }
  };

  const currentAccount = accountType === 'real' ? accountData.real : accountData.demo;

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleCurrencyToggle = (showKsh) => {
    setShowBalanceInKsh(showKsh);
  };

  const formatCurrency = (amount, currency) => {
    if (showBalanceInKsh) {
      const kshAmount = amount * 150.50;
      return `KSh ${kshAmount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${currency === 'USD' ? '$' : 'USD'} ${amount.toFixed(2)}`;
  };

  const getDisplayBalance = () => {
    if (showBalanceInKsh) {
      return `KSh ${currentAccount.kshBalance.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${currentAccount.balance.toFixed(2)}`;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <TopBar>
      <Brand>
        <span className="icon">🔷</span>
        <span className="brand-text">
          <span className="voltix">Voltix Traders.</span>
          <span className="deriv">deriv</span>
        </span>
        <span className="live-dot" />
      </Brand>

      <RightSection>
        <AccountCode>{accountData.code}</AccountCode>

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <AccountBadge onClick={toggleDropdown}>
            <span className="flag">{currentAccount.flag}</span>
            <span className="balance">{getDisplayBalance()}</span>
            <span className="currency-toggle">
              {showBalanceInKsh ? 'KSh' : '$'}
            </span>
            <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>▾</span>
          </AccountBadge>

          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem 
              onClick={() => setAccountType('real')}
              className={accountType === 'real' ? 'active' : ''}
            >
              🇰🇪 Real Account
              <span className="balance-small">
                {formatCurrency(currentAccount.balance, currentAccount.currency)}
              </span>
              <span className="check">✓</span>
            </DropdownItem>

            <DropdownItem 
              onClick={() => setAccountType('demo')}
              className={accountType === 'demo' ? 'active' : ''}
            >
              🎯 Demo Account
              <span className="balance-small">
                {formatCurrency(currentAccount.balance, currentAccount.currency)}
              </span>
              <span className="check">✓</span>
            </DropdownItem>

            <CurrencyToggle>
              <span className="label">💱 Show balance in:</span>
              <div className="toggle-group">
                <button 
                  className={`toggle-option ${!showBalanceInKsh ? 'active' : ''}`}
                  onClick={() => handleCurrencyToggle(false)}
                >
                  💵 USD
                </button>
                <button 
                  className={`toggle-option ${showBalanceInKsh ? 'active' : ''}`}
                  onClick={() => handleCurrencyToggle(true)}
                >
                  🇰🇪 KSh
                </button>
              </div>
            </CurrencyToggle>
          </DropdownMenu>
        </div>

        <WithdrawButton>💰 Withdraw</WithdrawButton>
        <DepositButton>📥 Deposit</DepositButton>
        <LogoutButton>🚪 Logout</LogoutButton>
      </RightSection>
    </TopBar>
  );
};

export default TopPanel;