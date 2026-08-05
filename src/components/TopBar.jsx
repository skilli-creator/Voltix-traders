// src/components/TopBar.jsx

import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// ANIMATIONS
// ============================================
const pulseGlow = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.08); }
`;

const rippleEffect = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

// ============================================
// CONTAINER STRUCTURES
// ============================================
const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 28px;
  background: ${props => props.theme?.colors?.surface || props.theme?.colors?.backgroundSecondary || '#0b0f19'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 76px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 1024px) {
    padding: 12px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 16px;
  }
`;

// ===== LEFT SECTION: BRAND & USER MATRIX =====
const LeftSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    align-items: center;
  }
`;

const SidebarToggle = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 40px;
  height: 40px;
  margin-top: 2px;
  background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.12)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceActive || 'rgba(255, 255, 255, 0.08)'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 16px ${props => (props.theme?.colors?.accent || '#3b82f6') + '25'};
  }

  &:active {
    transform: scale(0.94);
  }

  .line {
    display: block;
    height: 2px;
    background: ${props => props.theme?.colors?.text || '#ffffff'};
    border-radius: 4px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:nth-child(1) {
      width: 18px;
      transform: ${props => (props.isOpen ? 'rotate(45deg) translate(4px, 4.5px)' : 'rotate(0)')};
    }
    &:nth-child(2) {
      width: 14px;
      opacity: ${props => (props.isOpen ? '0' : '1')};
      transform: ${props => (props.isOpen ? 'scaleX(0)' : 'scaleX(1)')};
    }
    &:nth-child(3) {
      width: ${props => (props.isOpen ? '18px' : '10px')};
      transform: ${props => (props.isOpen ? 'rotate(-45deg) translate(4px, -4.5px)' : 'rotate(0)')};
    }
  }
`;

const BrandStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  .logo-icon {
    width: 26px;
    height: 26px;
    background: linear-gradient(135deg, #ff444f 0%, #3b82f6 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(255, 68, 79, 0.3);

    svg {
      width: 15px;
      height: 15px;
      fill: #ffffff;
    }
  }

  .brand-title {
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 3px;

    .voltix {
      color: ${props => props.theme?.colors?.text || '#ffffff'};
    }
    .deriv {
      color: #ff444f !important;
      font-style: italic;
      font-weight: 900;
    }
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    animation: ${rippleEffect} 2s infinite;
  }
`;

// ===== USER PROFILE ROW & DROPDOWN =====
const UserIdentityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceActive || 'rgba(255, 255, 255, 0.08)'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .avatar {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.5px;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }

  .user-name {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .user-email {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  }

  .chevron {
    font-size: 9px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

// ===== RIGHT SECTION CONTROLS =====
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const GlassDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: ${props => (props.alignLeft ? 'auto' : '0')};
  left: ${props => (props.alignLeft ? '0' : 'auto')};
  min-width: 240px;
  background: ${props => props.theme?.colors?.surfaceGlass || 'rgba(11, 15, 25, 0.95)'};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${props => props.theme?.colors?.glassBorder || 'rgba(255, 255, 255, 0.12)'};
  border-radius: 14px;
  padding: 8px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7);
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transform: ${props => (props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.98)')};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 300;
  overflow: hidden;
`;

const MenuHeader = styled.div`
  padding: 6px 10px 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  margin-bottom: 4px;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12.5px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  &.active {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .item-icon {
    font-size: 14px;
    width: 18px;
    text-align: center;
  }

  .title { flex: 1; }
  .badge-tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
`;

// ===== PREMIUM THEME SWITCHER =====
const PremiumThemeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.12)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 12.5px;
  font-weight: 600;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 16px ${props => (props.theme?.colors?.accent || '#3b82f6') + '20'};
  }

  .swatch-glow {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.activeColor || '#3b82f6'};
    box-shadow: 0 0 10px ${props => props.activeColor || '#3b82f6'};
    animation: ${pulseGlow} 2.5s infinite;
  }

  .chevron {
    font-size: 9px;
    opacity: 0.7;
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

// ===== PREMIUM FUNDS DROPDOWN BUTTON =====
const PremiumFundsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 15px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.accent || '#3b82f6'};
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%);
    box-shadow: 0 0 20px ${props => (props.theme?.colors?.accent || '#3b82f6') + '30'};
  }

  .funds-icon {
    font-size: 14px;
  }

  .chevron {
    font-size: 9px;
    opacity: 0.8;
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

// ===== ACCOUNT BADGE & EXIT =====
const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: ${props => props.theme?.colors?.surface || 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-size: 12.5px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#ffffff'};

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .currency-tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    font-weight: 800;
  }

  .chevron {
    font-size: 9px;
    opacity: 0.6;
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

const ExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.theme?.colors?.surface || 'transparent'};
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    background: ${props => (props.theme?.colors?.danger || '#ef4444') + '15'};
  }
`;

// THEME PALETTES
const THEME_OPTIONS = [
  { key: 'dark', name: 'Solid Dark', color: '#09090b' },
  { key: 'midnight', name: 'Midnight Indigo', color: '#070a12' },
  { key: 'ocean', name: 'Deep Ocean', color: '#020d14' },
  { key: 'cosmic', name: 'Cosmic Violet', color: '#07040d' },
  { key: 'light', name: 'Pure White', color: '#ffffff' },
  { key: 'darkBlue', name: 'Deep Blue', color: '#0f172a' },
  { key: 'forest', name: 'Emerald', color: '#040d0a' },
  { key: 'darkGreen', name: 'Forest Green', color: '#052e16' },
  { key: 'black', name: 'Pure Black', color: '#000000' },
  { key: 'lightGray', name: 'Light Gray', color: '#e5e7eb' },
];

// ============================================
// MAIN TOPPANEL COMPONENT
// ============================================
const TopPanel = ({ 
  isSidebarOpen, 
  onSidebarToggle, 
  currentTheme = 'dark', 
  onThemeChange 
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFundsOpen, setIsFundsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountType, setAccountType] = useState('real');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const userMenuRef = useRef(null);
  const fundsRef = useRef(null);
  const themeRef = useRef(null);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  const accountData = {
    real: { balance: 7110.0, label: 'Real' },
    demo: { balance: 10000.0, label: 'Demo' }
  };

  const currentAccount = accountType === 'real' ? accountData.real : accountData.demo;
  const isDemo = accountType === 'demo';

  const closeAllDropdowns = () => {
    setIsUserMenuOpen(false);
    setIsFundsOpen(false);
    setIsThemeOpen(false);
    setIsAccountOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (
        userMenuRef.current && !userMenuRef.current.contains(e.target) &&
        fundsRef.current && !fundsRef.current.contains(e.target) &&
        themeRef.current && !themeRef.current.contains(e.target) &&
        accountRef.current && !accountRef.current.contains(e.target)
      ) {
        closeAllDropdowns();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatNumber = num => num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const getFormattedBalance = acc => {
    switch (selectedCurrency) {
      case 'KSh': return `KSh ${formatNumber(acc.balance * 150.5)}`;
      case 'EUR': return `€ ${formatNumber(acc.balance * 0.92)}`;
      default: return `$ ${formatNumber(acc.balance)}`;
    }
  };

  const activeThemeObj = THEME_OPTIONS.find(t => t.key === currentTheme) || THEME_OPTIONS[0];

  return (
    <TopBar>
      {/* BRAND & USER MATRIX */}
      <LeftSection>
        <SidebarToggle isOpen={isSidebarOpen} onClick={onSidebarToggle} aria-label="Toggle sidebar">
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </SidebarToggle>

        <BrandStack>
          <BrandLogo onClick={() => navigate('/dashboard')}>
            <div className="logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="brand-title">
              <span className="voltix">MyTradeApp.</span>
              <span className="deriv">deriv</span>
            </div>
            <span className="status-dot" />
          </BrandLogo>

          {/* USER DISPLAY WITH MENU DROPDOWN */}
          <DropdownContainer ref={userMenuRef}>
            <UserIdentityBadge onClick={() => { closeAllDropdowns(); setIsUserMenuOpen(!isUserMenuOpen); }}>
              <div className="avatar">TK</div>
              <div className="user-details">
                <span className="user-name">Tonny Kyalo</span>
                <span className="user-email">kyalotonny6@gmail.com</span>
              </div>
              <span className={`chevron ${isUserMenuOpen ? 'open' : ''}`}>▾</span>
            </UserIdentityBadge>

            <GlassDropdownMenu isOpen={isUserMenuOpen} alignLeft>
              <MenuHeader>User Account</MenuHeader>
              <DropdownItem onClick={() => { navigate('/profile'); closeAllDropdowns(); }}>
                <span className="item-icon">👤</span>
                <span className="title">Profile & Verification</span>
                <span className="badge-tag">Verified</span>
              </DropdownItem>
              <DropdownItem onClick={() => { navigate('/security'); closeAllDropdowns(); }}>
                <span className="item-icon">🔒</span>
                <span className="title">Security & 2FA</span>
              </DropdownItem>
              <DropdownItem onClick={() => { navigate('/api-tokens'); closeAllDropdowns(); }}>
                <span className="item-icon">🔑</span>
                <span className="title">API Tokens</span>
              </DropdownItem>
            </GlassDropdownMenu>
          </DropdownContainer>
        </BrandStack>
      </LeftSection>

      {/* RIGHT SIDE CONTROLS */}
      <RightSection>
        {/* CUSTOM THEME BUTTON */}
        <DropdownContainer ref={themeRef}>
          <PremiumThemeToggle
            activeColor={activeThemeObj.color}
            onClick={() => { closeAllDropdowns(); setIsThemeOpen(!isThemeOpen); }}
          >
            <span className="swatch-glow" />
            <span>{activeThemeObj.name}</span>
            <span className={`chevron ${isThemeOpen ? 'open' : ''}`}>▾</span>
          </PremiumThemeToggle>

          <GlassDropdownMenu isOpen={isThemeOpen}>
            <MenuHeader>Choose Theme</MenuHeader>
            {THEME_OPTIONS.map(t => (
              <DropdownItem
                key={t.key}
                className={currentTheme === t.key ? 'active' : ''}
                onClick={() => {
                  if (onThemeChange) onThemeChange(t.key);
                  closeAllDropdowns();
                }}
              >
                <span className="item-icon" style={{ color: t.color }}>●</span>
                <span className="title">{t.name}</span>
              </DropdownItem>
            ))}
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* FUNDS DROPDOWN */}
        <DropdownContainer ref={fundsRef}>
          <PremiumFundsButton onClick={() => { closeAllDropdowns(); setIsFundsOpen(!isFundsOpen); }}>
            <span className="funds-icon">💳</span>
            <span>Funds</span>
            <span className={`chevron ${isFundsOpen ? 'open' : ''}`}>▾</span>
          </PremiumFundsButton>

          <GlassDropdownMenu isOpen={isFundsOpen}>
            <MenuHeader>Cashier Services</MenuHeader>
            <DropdownItem onClick={() => { navigate('/cashier/overview'); closeAllDropdowns(); }}>
              <span className="item-icon">📊</span>
              <span className="title">Cashier Overview</span>
            </DropdownItem>
            <DropdownItem onClick={() => { navigate('/cashier/deposit'); closeAllDropdowns(); }}>
              <span className="item-icon">📥</span>
              <span className="title">Deposit Funds</span>
            </DropdownItem>
            <DropdownItem onClick={() => { navigate('/cashier/withdraw'); closeAllDropdowns(); }}>
              <span className="item-icon">📤</span>
              <span className="title">Withdraw Funds</span>
            </DropdownItem>
            <DropdownItem onClick={() => { navigate('/cashier/p2p'); closeAllDropdowns(); }}>
              <span className="item-icon">🔄</span>
              <span className="title">Deriv P2P</span>
            </DropdownItem>
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* ACCOUNT BALANCE BADGE */}
        <DropdownContainer ref={accountRef}>
          <AccountBadge onClick={() => { closeAllDropdowns(); setIsAccountOpen(!isAccountOpen); }}>
            <span>{isDemo ? '🎯' : '🇺🇸'}</span>
            <span>{getFormattedBalance(currentAccount)}</span>
            <span className="currency-tag">{selectedCurrency}</span>
            <span className={`chevron ${isAccountOpen ? 'open' : ''}`}>▾</span>
          </AccountBadge>

          <GlassDropdownMenu isOpen={isAccountOpen}>
            <MenuHeader>Switch Account</MenuHeader>
            <DropdownItem
              className={accountType === 'real' ? 'active' : ''}
              onClick={() => { setAccountType('real'); closeAllDropdowns(); }}
            >
              <span className="item-icon">🇺🇸</span>
              <span className="title">Real Account</span>
              <span className="badge-tag">Live</span>
            </DropdownItem>
            <DropdownItem
              className={accountType === 'demo' ? 'active' : ''}
              onClick={() => { setAccountType('demo'); closeAllDropdowns(); }}
            >
              <span className="item-icon">🎯</span>
              <span className="title">Demo Account</span>
              <span className="badge-tag">Practice</span>
            </DropdownItem>
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* EXIT BUTTON */}
        <ExitButton onClick={() => navigate('/')}>
          <span>⏻</span>
          <span>Exit</span>
        </ExitButton>
      </RightSection>
    </TopBar>
  );
};

export default TopPanel;