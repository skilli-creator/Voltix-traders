import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  background: rgba(3, 7, 18, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.12);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    padding: 8px 18px;
    height: auto;
    min-height: 52px;
    gap: 6px;
  }

  @media (max-width: 768px) {
    padding: 6px 14px;
    min-height: 48px;
    gap: 4px;
  }

  @media (max-width: 480px) {
    padding: 4px 10px;
    min-height: 44px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;

  .icon {
    font-size: 1.3rem;
  }

  .brand-text {
    display: flex;
    align-items: center;
    gap: 3px;
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
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 4px;
    .icon { font-size: 1rem; }
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const AccountCode = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  font-family: 'Courier New', monospace;
  padding: 3px 6px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    font-size: 9px;
    padding: 2px 4px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    padding: 1px 3px;
  }
`;

const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px 4px 8px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  user-select: none;

  &:hover {
    background: rgba(20, 30, 55, 0.9);
    border-color: rgba(56, 189, 248, 0.4);
    box-shadow: 0 0 16px rgba(56, 189, 248, 0.04);
  }

  .flag {
    font-size: 15px;
  }

  .balance {
    font-size: 12px;
    font-weight: 600;
    color: #f1f5f9;
  }

  .chevron {
    font-size: 10px;
    color: #94a3b8;
    transition: transform 0.2s ease;
    margin-left: 2px;

    &.open {
      transform: rotate(180deg);
    }
  }

  @media (max-width: 768px) {
    padding: 3px 8px 3px 6px;
    .balance { font-size: 10px; }
    .flag { font-size: 13px; }
    .chevron { font-size: 9px; }
  }

  @media (max-width: 480px) {
    padding: 2px 6px 2px 4px;
    .balance { font-size: 9px; }
    .flag { font-size: 11px; }
    .chevron { font-size: 8px; }
    gap: 3px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 200px;
  background: rgba(8, 18, 38, 0.96);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 10px;
  padding: 4px 0;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-6px)'};
  transition: all 0.2s ease;
  z-index: 200;
  overflow: hidden;

  @media (max-width: 480px) {
    min-width: 160px;
    right: -8px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
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
    font-size: 14px;
  }

  .label {
    flex: 1;
  }

  .balance-small {
    font-size: 11px;
    color: #94a3b8;
  }

  .check {
    display: none;
    color: #38bdf8;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 11px;
    .flag { font-size: 12px; }
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 24px;
  border: none;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f1f5f9;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    padding: 4px 10px;
    font-size: 10px;
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    font-size: 9px;
    gap: 2px;
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

const TopPanel = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [accountType, setAccountType] = useState('real');
  const dropdownRef = useRef(null);

  const accountData = {
    code: 'CR123456',
    real: { balance: 7110.00, currency: 'USD', flag: '🇺🇸' },
    demo: { balance: 10000.00, currency: 'USD', flag: '🎯' }
  };

  const currentAccount = accountType === 'real' ? accountData.real : accountData.demo;

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
      </Brand>

      <RightSection>
        <AccountCode>{accountData.code}</AccountCode>

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <AccountBadge onClick={toggleDropdown}>
            <span className="flag">{currentAccount.flag}</span>
            <span className="balance">${currentAccount.balance.toFixed(2)}</span>
            <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>▾</span>
          </AccountBadge>

          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem onClick={() => setAccountType('real')}>
              🇺🇸 Real Account
            </DropdownItem>
            <DropdownItem onClick={() => setAccountType('demo')}>
              🎯 Demo Account
            </DropdownItem>
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