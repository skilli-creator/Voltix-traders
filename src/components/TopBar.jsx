import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const sidebarIconRotate = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(90deg); }
  100% { transform: rotate(0deg); }
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

// ===== LEFT SIDE - SIDEBAR TOGGLE + BRAND =====
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// ===== CREATIVE SIDEBAR TOGGLE ICON =====
const SidebarToggle = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: rgba(56, 189, 248, 0.05);
  border: 1px solid rgba(56, 189, 248, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding: 0;

  &:hover {
    background: rgba(56, 189, 248, 0.12);
    border-color: rgba(56, 189, 248, 0.3);
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(56, 189, 248, 0.1);
  }

  &:active {
    transform: scale(0.92);
  }

  .line {
    display: block;
    width: 18px;
    height: 2px;
    background: linear-gradient(90deg, #94a3b8, #38bdf8);
    border-radius: 2px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;

    &:nth-child(1) {
      width: ${props => props.isOpen ? '20px' : '18px'};
      transform: ${props => props.isOpen ? 'rotate(45deg) translate(3px, 3px)' : 'rotate(0)'};
      background: ${props => props.isOpen ? 'linear-gradient(90deg, #38bdf8, #818cf8)' : 'linear-gradient(90deg, #94a3b8, #38bdf8)'};
    }

    &:nth-child(2) {
      width: ${props => props.isOpen ? '0px' : '14px'};
      opacity: ${props => props.isOpen ? '0' : '1'};
      transform: ${props => props.isOpen ? 'scaleX(0)' : 'scaleX(1)'};
      transform-origin: center;
    }

    &:nth-child(3) {
      width: ${props => props.isOpen ? '20px' : '10px'};
      transform: ${props => props.isOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'rotate(0)'};
      background: ${props => props.isOpen ? 'linear-gradient(90deg, #38bdf8, #818cf8)' : 'linear-gradient(90deg, #94a3b8, #38bdf8)'};
    }
  }

  .toggle-tooltip {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    background: rgba(8, 18, 38, 0.95);
    backdrop-filter: blur(8px);
    color: #94a3b8;
    font-size: 10px;
    padding: 3px 8px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    border: 1px solid rgba(56, 189, 248, 0.1);
  }

  &:hover .toggle-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    gap: 4px;
    .line {
      width: 16px;
      height: 1.5px;
      &:nth-child(1) {
        width: ${props => props.isOpen ? '18px' : '16px'};
      }
      &:nth-child(3) {
        width: ${props => props.isOpen ? '18px' : '8px'};
      }
    }
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    gap: 3px;
    .line {
      width: 14px;
      height: 1.5px;
      &:nth-child(1) {
        width: ${props => props.isOpen ? '16px' : '14px'};
      }
      &:nth-child(3) {
        width: ${props => props.isOpen ? '16px' : '6px'};
      }
    }
  }
`;

// ===== BRAND =====
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
  min-width: 280px;
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
    min-width: 240px;
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
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
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
    padding: 3px;
    width: 100%;
  }

  .toggle-option {
    flex: 1;
    padding: 6px 8px;
    border-radius: 16px;
    border: none;
    background: transparent;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;

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

  @media (max-width: 480px) {
    padding: 8px 12px;
    .toggle-option {
      font-size: 10px;
      padding: 4px 6px;
    }
  }
`;

// ===== PROFESSIONAL FUNDS BUTTON =====
const ProfessionalFundsButton = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px 8px 20px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  background: linear-gradient(135deg, #1a2a4a, #0d1b2a);
  color: #e8edf5;
  border: 1px solid rgba(56, 189, 248, 0.15);
  letter-spacing: 0.3px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #38bdf8, #818cf8);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(56, 189, 248, 0.3);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);

    &::before {
      opacity: 1;
    }

    &::after {
      transform: scaleX(1);
    }

    .funds-icon {
      transform: scale(1.05);
    }

    .arrow-right {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  .funds-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: rgba(56, 189, 248, 0.08);
    font-size: 16px;
    transition: all 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 6px;
      border: 1px solid rgba(56, 189, 248, 0.1);
    }
  }

  .funds-content {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
  }

  .funds-title {
    font-size: 13px;
    font-weight: 600;
    color: #f1f5f9;
    letter-spacing: 0.5px;
  }

  .funds-subtitle {
    font-size: 10px;
    color: #94a3b8;
    font-weight: 400;
    letter-spacing: 0.2px;
  }

  .arrow-right {
    margin-left: auto;
    font-size: 14px;
    color: #94a3b8;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    padding: 6px 16px 6px 14px;
    gap: 8px;
    .funds-icon {
      width: 26px;
      height: 26px;
      font-size: 13px;
    }
    .funds-title {
      font-size: 11px;
    }
    .funds-subtitle {
      font-size: 9px;
    }
    .arrow-right {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    padding: 5px 12px 5px 10px;
    gap: 6px;
    .funds-icon {
      width: 22px;
      height: 22px;
      font-size: 11px;
    }
    .funds-title {
      font-size: 10px;
    }
    .funds-subtitle {
      display: none;
    }
    .arrow-right {
      font-size: 10px;
    }
  }
`;

// ===== PREMIUM EXIT BUTTON =====
const PremiumExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(148, 163, 184, 0.03);
  color: #94a3b8;
  position: relative;
  letter-spacing: 0.3px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.03);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, rgba(239, 68, 68, 0.3), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    transform: translateX(-2px);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 1;
    }

    .exit-icon-container {
      background: rgba(239, 68, 68, 0.08);
      border-color: rgba(239, 68, 68, 0.2);
    }

    .exit-arrow-icon {
      transform: translateX(4px);
      color: #ef4444;
    }
  }

  &:active {
    transform: scale(0.97);
  }

  .exit-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid rgba(148, 163, 184, 0.08);
    background: rgba(148, 163, 184, 0.03);
    transition: all 0.3s ease;
  }

  .exit-icon {
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .exit-text {
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .exit-arrow-icon {
    font-size: 14px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: #64748b;
    margin-left: 2px;
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    padding: 6px 14px;
    gap: 8px;
    font-size: 11px;
    .exit-icon-container {
      width: 24px;
      height: 24px;
    }
    .exit-icon {
      font-size: 12px;
    }
    .exit-arrow-icon {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    gap: 6px;
    font-size: 10px;
    .exit-icon-container {
      width: 20px;
      height: 20px;
    }
    .exit-icon {
      font-size: 10px;
    }
    .exit-text {
      display: none;
    }
    .exit-arrow-icon {
      font-size: 10px;
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const TopPanel = ({ isSidebarOpen, onSidebarToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [accountType, setAccountType] = useState('real');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Exchange rates (1 USD = X)
  const exchangeRates = {
    USD: 1,
    KSh: 150.50,
    EUR: 0.92
  };

  const accountData = {
    code: 'CR123456',
    real: { 
      balance: 7110.00, 
      currency: 'USD',
      flag: '🇺🇸',
      kshBalance: 7110.00 * 150.50,
      eurBalance: 7110.00 * 0.92
    },
    demo: { 
      balance: 10000.00, 
      currency: 'USD',
      flag: '🎯',
      kshBalance: 10000.00 * 150.50,
      eurBalance: 10000.00 * 0.92
    }
  };

  const currentAccount = accountType === 'real' ? accountData.real : accountData.demo;

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const getCurrencyFlag = () => {
    if (accountType === 'demo') return '🎯';
    switch(selectedCurrency) {
      case 'USD': return '🇺🇸';
      case 'KSh': return '🇰🇪';
      case 'EUR': return '🇪🇺';
      default: return '🇺🇸';
    }
  };

  const formatNumber = (number) => {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getFormattedBalance = () => {
    let amount = currentAccount.balance;
    let symbol = '$';

    switch(selectedCurrency) {
      case 'USD':
        amount = currentAccount.balance;
        symbol = '$';
        break;
      case 'KSh':
        amount = currentAccount.kshBalance;
        symbol = 'KSh';
        break;
      case 'EUR':
        amount = currentAccount.eurBalance;
        symbol = '€';
        break;
      default:
        amount = currentAccount.balance;
        symbol = '$';
    }

    return `${symbol} ${formatNumber(amount)}`;
  };

  const getDropdownBalance = () => {
    let amount = currentAccount.balance;
    let symbol = '$';

    switch(selectedCurrency) {
      case 'USD':
        amount = currentAccount.balance;
        symbol = '$';
        break;
      case 'KSh':
        amount = currentAccount.kshBalance;
        symbol = 'KSh';
        break;
      case 'EUR':
        amount = currentAccount.eurBalance;
        symbol = '€';
        break;
      default:
        amount = currentAccount.balance;
        symbol = '$';
    }

    return `${symbol} ${formatNumber(amount)}`;
  };

  const handleExit = () => {
    navigate('/');
  };

  const handleSidebarToggle = () => {
    if (onSidebarToggle) {
      onSidebarToggle();
    }
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
      <LeftSection>
        <SidebarToggle 
          isOpen={isSidebarOpen} 
          onClick={handleSidebarToggle}
          aria-label="Toggle sidebar"
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
          <span className="toggle-tooltip">
            {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
          </span>
        </SidebarToggle>

        <Brand>
          <span className="icon">🔷</span>
          <span className="brand-text">
            <span className="voltix">Voltix Traders.</span>
            <span className="deriv">deriv</span>
          </span>
          <span className="live-dot" />
        </Brand>
      </LeftSection>

      <RightSection>
        <AccountCode>{accountData.code}</AccountCode>

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <AccountBadge onClick={toggleDropdown}>
            <span className="flag">{getCurrencyFlag()}</span>
            <span className="balance">{getFormattedBalance()}</span>
            <span className="currency-toggle">
              {selectedCurrency}
            </span>
            <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>▾</span>
          </AccountBadge>

          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem 
              onClick={() => setAccountType('real')}
              className={accountType === 'real' ? 'active' : ''}
            >
              {getCurrencyFlag()} Real Account
              <span className="balance-small">
                {getDropdownBalance()}
              </span>
              <span className="check">✓</span>
            </DropdownItem>

            <DropdownItem 
              onClick={() => setAccountType('demo')}
              className={accountType === 'demo' ? 'active' : ''}
            >
              🎯 Demo Account
              <span className="balance-small">
                {getDropdownBalance()}
              </span>
              <span className="check">✓</span>
            </DropdownItem>

            <CurrencyToggle>
              <span className="label">💱 Show balance in:</span>
              <div className="toggle-group">
                <button 
                  className={`toggle-option ${selectedCurrency === 'USD' ? 'active' : ''}`}
                  onClick={() => handleCurrencyChange('USD')}
                >
                  🇺🇸 USD
                </button>
                <button 
                  className={`toggle-option ${selectedCurrency === 'EUR' ? 'active' : ''}`}
                  onClick={() => handleCurrencyChange('EUR')}
                >
                  🇪🇺 EUR
                </button>
                <button 
                  className={`toggle-option ${selectedCurrency === 'KSh' ? 'active' : ''}`}
                  onClick={() => handleCurrencyChange('KSh')}
                >
                  🇰🇪 KSh
                </button>
              </div>
            </CurrencyToggle>
          </DropdownMenu>
        </div>

        <ProfessionalFundsButton 
          href="https://app.rubicash.com/account/dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="funds-icon">💰</span>
          <span className="funds-content">
            <span className="funds-title">Funds</span>
            <span className="funds-subtitle">Secure transactions</span>
          </span>
          <span className="arrow-right">→</span>
        </ProfessionalFundsButton>

        <PremiumExitButton onClick={handleExit}>
          <span className="exit-icon-container">
            <span className="exit-icon">⏻</span>
          </span>
          <span className="exit-text">Exit</span>
          <span className="exit-arrow-icon">→</span>
        </PremiumExitButton>
      </RightSection>
    </TopBar>
  );
};

export default TopPanel;