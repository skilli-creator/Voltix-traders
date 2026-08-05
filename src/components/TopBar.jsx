import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// ANIMATION KEYFRAMES
// ============================================
const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.4); opacity: 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

// ============================================
// CORE CONTAINERS
// ============================================

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 28px;
  background: ${props => props.theme?.colors?.surface || props.theme?.colors?.backgroundSecondary || '#0a0a0c'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 64px;
  flex-shrink: 0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 1024px) {
    padding: 10px 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px 16px;
    gap: 8px;
  }
`;

// ===== LEFT SECTION: TOGGLE + BRAND =====
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const SidebarToggle = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 38px;
  height: 38px;
  background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
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
      width: ${props => props.isOpen ? '18px' : '18px'};
      transform: ${props => props.isOpen ? 'rotate(45deg) translate(4px, 4.5px)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      width: 14px;
      opacity: ${props => props.isOpen ? '0' : '1'};
      transform: ${props => props.isOpen ? 'scaleX(0)' : 'scaleX(1)'};
    }

    &:nth-child(3) {
      width: ${props => props.isOpen ? '18px' : '10px'};
      transform: ${props => props.isOpen ? 'rotate(-45deg) translate(4px, -4.5px)' : 'rotate(0)'};
    }
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
  user-select: none;

  .brand-text {
    display: flex;
    align-items: center;
    gap: 4px;
    letter-spacing: -0.4px;
  }

  .voltix {
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .deriv {
    color: #ff444f !important;
    font-style: italic;
    font-weight: 900;
    letter-spacing: -0.2px;
  }

  .live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.accent || '#10b981'};
    position: relative;
    margin-left: 2px;
    flex-shrink: 0;

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: ${props => props.theme?.colors?.accent || '#10b981'};
      animation: ${pulseRing} 2s ease-out infinite;
    }
  }
`;

// ===== RIGHT SECTION: ACTIONS =====
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// ===== SOLID TRANSLUCENT DROPDOWN POPUP =====
const GlassDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 270px;
  max-width: 90vw;
  background: ${props => props.theme?.colors?.surfaceGlass || 'rgba(15, 17, 23, 0.94)'};
  backdrop-filter: blur(${props => props.theme?.colors?.glassBlur || '24px'}) saturate(190%);
  -webkit-backdrop-filter: blur(${props => props.theme?.colors?.glassBlur || '24px'}) saturate(190%);
  border: 1px solid ${props => props.theme?.colors?.glassBorder || 'rgba(255, 255, 255, 0.12)'};
  border-radius: 14px;
  padding: 8px;
  box-shadow: ${props => props.theme?.colors?.shadow || '0 20px 40px -10px rgba(0,0,0,0.6)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.98)'};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 300;
  overflow: hidden;
`;

// ===== BUTTON 1: THEME SWITCHER (LEFT OF FUNDS) =====
const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: ${props => props.theme?.colors?.surface || '#0f172a'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 13px;
  font-weight: 600;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .theme-swatch {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 8px ${props => (props.activeColor || '#3b82f6') + '60'};
  }

  .label-text {
    @media (max-width: 640px) {
      display: none;
    }
  }

  .chevron {
    font-size: 10px;
    opacity: 0.6;
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

const MenuHeader = styled.div`
  padding: 6px 10px 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  margin-bottom: 4px;
`;

const ThemeOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
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

  .color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
  }

  .title {
    flex: 1;
  }

  .check-mark {
    font-size: 12px;
    font-weight: 800;
  }
`;

// ===== BUTTON 2: FUNDS BUTTON =====
const ProfessionalFundsButton = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 16px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.theme?.colors?.surface || '#0f172a'};
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    transform: translateY(-1px);

    .arrow { transform: translateX(3px); color: ${props => props.theme?.colors?.accent || '#3b82f6'}; }
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    font-size: 13px;
  }

  .arrow {
    font-size: 12px;
    transition: transform 0.2s ease, color 0.2s ease;
    opacity: 0.7;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    .sub { display: none; }
  }
`;

// ===== BUTTON 3: ACCOUNT BADGE =====
const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: ${props => props.theme?.colors?.surface || '#0f172a'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#ffffff'};

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .flag-badge {
    font-size: 14px;
  }

  .currency-tag {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 6px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    font-weight: 800;
  }

  .chevron {
    font-size: 10px;
    opacity: 0.6;
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

const CurrencyControlGroup = styled.div`
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};

  .label {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 700;
    margin-bottom: 6px;
    display: block;
    text-transform: uppercase;
  }

  .segmented-control {
    display: flex;
    gap: 4px;
    background: ${props => props.theme?.colors?.bg || '#020617'};
    padding: 3px;
    border-radius: 8px;
  }

  .segment-btn {
    flex: 1;
    border: none;
    background: transparent;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-size: 11px;
    font-weight: 700;
    padding: 5px 0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover { color: ${props => props.theme?.colors?.text || '#ffffff'}; }
    &.active {
      background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
      color: ${props => props.theme?.colors?.accent || '#3b82f6'};
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
  }
`;

// ===== BUTTON 4: EXIT BUTTON =====
const ExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.theme?.colors?.surface || '#0f172a'};
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    background: ${props => (props.theme?.colors?.danger || '#ef4444') + '10'};

    .exit-icon { stroke: ${props => props.theme?.colors?.danger || '#ef4444'}; }
  }

  .exit-icon {
    width: 15px;
    height: 15px;
    transition: stroke 0.2s ease;
  }
`;

const PowerIcon = () => (
  <svg className="exit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v10" />
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
  </svg>
);

// THEME DEFINITIONS
const THEME_OPTIONS = [
  { key: 'light', name: 'Pure White', color: '#ffffff' },
  { key: 'minimalWhite', name: 'Minimal White', color: '#f8fafc' },
  { key: 'dark', name: 'Solid Dark', color: '#09090b' },
  { key: 'midnight', name: 'Midnight Indigo', color: '#070a12' },
  { key: 'ocean', name: 'Deep Ocean', color: '#020d14' },
  { key: 'cosmic', name: 'Cosmic Violet', color: '#07040d' },
  { key: 'forest', name: 'Emerald Forest', color: '#040d0a' },
  { key: 'sunset', name: 'Warm Sunset', color: '#0f0705' }
];

// ============================================
// MAIN COMPONENT EXPORT
// ============================================

const TopPanel = ({ isSidebarOpen, onSidebarToggle, currentTheme = 'dark', onThemeChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [accountType, setAccountType] = useState('real');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  const dropdownRef = useRef(null);
  const themeRef = useRef(null);
  const navigate = useNavigate();

  const accountData = {
    real: { balance: 7110.00, kshBalance: 7110.00 * 150.50, eurBalance: 7110.00 * 0.92 },
    demo: { balance: 10000.00, kshBalance: 10000.00 * 150.50, eurBalance: 10000.00 * 0.92 }
  };

  const currentAccount = accountType === 'real' ? accountData.real : accountData.demo;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsThemeOpen(false);
  };

  const toggleThemeDropdown = () => {
    setIsThemeOpen(!isThemeOpen);
    setIsDropdownOpen(false);
  };

  const formatNumber = (num) => num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const getFormattedBalance = (acc) => {
    switch (selectedCurrency) {
      case 'KSh': return `KSh ${formatNumber(acc.kshBalance)}`;
      case 'EUR': return `€ ${formatNumber(acc.eurBalance)}`;
      default: return `$ ${formatNumber(acc.balance)}`;
    }
  };

  const getCurrencyFlag = () => {
    if (accountType === 'demo') return '🎯';
    switch (selectedCurrency) {
      case 'KSh': return '🇰🇪';
      case 'EUR': return '🇪🇺';
      default: return '🇺🇸';
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target)) setIsThemeOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeThemeObj = THEME_OPTIONS.find(t => t.key === currentTheme) || THEME_OPTIONS[2];

  return (
    <TopBar>
      <LeftSection>
        <SidebarToggle isOpen={isSidebarOpen} onClick={onSidebarToggle} aria-label="Toggle sidebar">
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </SidebarToggle>

        <Brand>
          <span className="brand-text">
            <span className="voltix">MyTradeApp.</span>
            <span className="deriv">deriv</span>
          </span>
          <span className="live-dot" />
        </Brand>
      </LeftSection>

      <RightSection>
        {/* 1. THEME SWITCHER BUTTON (LEFT OF FUNDS) */}
        <DropdownContainer ref={themeRef}>
          <ThemeButton onClick={toggleThemeDropdown} activeColor={activeThemeObj.color}>
            <span className="theme-swatch" style={{ background: activeThemeObj.color }} />
            <span className="label-text">{activeThemeObj.name}</span>
            <span className={`chevron ${isThemeOpen ? 'open' : ''}`}>▾</span>
          </ThemeButton>

          <GlassDropdownMenu isOpen={isThemeOpen}>
            <MenuHeader>Color Schemes</MenuHeader>
            {THEME_OPTIONS.map((t) => (
              <ThemeOptionItem
                key={t.key}
                onClick={() => {
                  if (onThemeChange) onThemeChange(t.key);
                  setIsThemeOpen(false);
                }}
                className={currentTheme === t.key ? 'active' : ''}
              >
                <span className="color-dot" style={{ background: t.color }} />
                <span className="title">{t.name}</span>
                {currentTheme === t.key && <span className="check-mark">✓</span>}
              </ThemeOptionItem>
            ))}
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* 2. FUNDS BUTTON */}
        <ProfessionalFundsButton href="/payment-dashboard" target="_blank" rel="noopener noreferrer">
          <span className="icon-wrapper">💳</span>
          <span>Funds</span>
          <span className="arrow">→</span>
        </ProfessionalFundsButton>

        {/* 3. ACCOUNT BALANCE DROPDOWN */}
        <DropdownContainer ref={dropdownRef}>
          <AccountBadge onClick={toggleDropdown}>
            <span className="flag-badge">{getCurrencyFlag()}</span>
            <span>{getFormattedBalance(currentAccount)}</span>
            <span className="currency-tag">{selectedCurrency}</span>
            <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>▾</span>
          </AccountBadge>

          <GlassDropdownMenu isOpen={isDropdownOpen}>
            <MenuHeader>Account Tier</MenuHeader>
            <ThemeOptionItem
              onClick={() => { setAccountType('real'); setIsDropdownOpen(false); }}
              className={accountType === 'real' ? 'active' : ''}
            >
              <span className="flag-badge">🇺🇸</span>
              <span className="title">Real Account</span>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>{getFormattedBalance(accountData.real)}</span>
            </ThemeOptionItem>

            <ThemeOptionItem
              onClick={() => { setAccountType('demo'); setIsDropdownOpen(false); }}
              className={accountType === 'demo' ? 'active' : ''}
            >
              <span className="flag-badge">🎯</span>
              <span className="title">Demo Practice</span>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>{getFormattedBalance(accountData.demo)}</span>
            </ThemeOptionItem>

            <CurrencyControlGroup>
              <span className="label">Display Currency</span>
              <div className="segmented-control">
                {['USD', 'EUR', 'KSh'].map((curr) => (
                  <button
                    key={curr}
                    className={`segment-btn ${selectedCurrency === curr ? 'active' : ''}`}
                    onClick={() => setSelectedCurrency(curr)}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </CurrencyControlGroup>
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* 4. EXIT BUTTON */}
        <ExitButton onClick={() => navigate('/')}>
          <PowerIcon />
          <span>Exit</span>
        </ExitButton>
      </RightSection>
    </TopBar>
  );
};

export default TopPanel;