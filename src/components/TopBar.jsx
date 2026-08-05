import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// ANIMATIONS & MICRO-INTERACTIONS
// ============================================
const pulseGlow = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.08); }
`;

const liveRipple = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

// ============================================
// VECTOR SVG ICONS (PROFESSIONAL NO-EMOJI SYSTEM)
// ============================================
const ChevronDownIcon = ({ className }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const LogoMarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const VerifiedCheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const WalletIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const DepositIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12" />
    <path d="m8 11 4 4 4-4" />
    <path d="M3 21h18" />
  </svg>
);

const WithdrawIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 17V5" />
    <path d="m8 9 4-4 4 4" />
    <path d="M3 21h18" />
  </svg>
);

const TransferIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 3 4 4-4 4" />
    <path d="M20 7H4" />
    <path d="m8 21-4-4 4-4" />
    <path d="M4 17h16" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
);

const SecurityKeyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ThemeSwatchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
  </svg>
);

const PowerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v10" />
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
  </svg>
);

// ============================================
// STYLED CONTAINERS & LAYOUT
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
  min-height: 74px;
  flex-shrink: 0;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 1024px) {
    padding: 12px 20px;
    gap: 12px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 16px;
  }
`;

// ===== LEFT SECTION: BRAND + USER PROFILE IDENTITY TRIGGER =====
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
`;

const BrandStack = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;

  .logo-emblem {
    width: 34px;
    height: 34px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
  }

  .brand-title {
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.4px;
    display: flex;
    align-items: center;
    gap: 3px;

    .mta-app {
      color: ${props => props.theme?.colors?.text || '#ffffff'};
    }
    .deriv-tag {
      color: #ff444f !important;
      font-style: italic;
      font-weight: 900;
      letter-spacing: -0.2px;
    }
  }

  .status-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    animation: ${liveRipple} 2s infinite;
  }
`;

// USER AVATAR & DROPDOWN MENU TRIGGER (REPLACES OLD HAMBURGER TOGGLE)
const UserIdentityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px 5px 6px;
  background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: ${props => props.theme?.colors?.surfaceActive || 'rgba(255, 255, 255, 0.08)'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 14px ${props => (props.theme?.colors?.accent || '#3b82f6') + '20'};
  }

  .avatar-box {
    width: 32px;
    height: 32px;
    border-radius: 7px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.5px;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
  }

  .identity-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.15;

    @media (max-width: 480px) {
      display: none;
    }
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .user-name {
    font-size: 11.5px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .account-type-pill {
    font-size: 8.5px;
    font-weight: 800;
    text-transform: uppercase;
    padding: 1px 5px;
    border-radius: 4px;
    letter-spacing: 0.4px;
    
    &.real {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    &.demo {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
  }

  .user-email {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-family: monospace;
    margin-top: 1px;
  }

  .chevron-icon {
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
  width: ${props => props.width || '260px'};
  background: ${props => props.theme?.colors?.surfaceGlass || 'rgba(11, 15, 25, 0.96)'};
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
  font-size: 9.5px;
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

  .item-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  }

  .title { flex: 1; }
  .badge-tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    font-weight: 700;
  }
`;

// ===== PREMIUM THEME BUTTON =====
const PremiumThemeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: ${props => props.theme?.colors?.surface || 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.12)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 12.5px;
  font-weight: 600;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 14px ${props => (props.theme?.colors?.accent || '#3b82f6') + '20'};
  }

  .swatch-glow {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.activeColor || '#3b82f6'};
    box-shadow: 0 0 8px ${props => props.activeColor || '#3b82f6'};
    animation: ${pulseGlow} 2.5s infinite;
  }

  .chevron-icon {
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

// ===== PREMIUM FUNDS BUTTON & DROPDOWN =====
const PremiumFundsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 15px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.accent || '#3b82f6'};
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(37, 99, 235, 0.08) 100%);
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.28) 0%, rgba(37, 99, 235, 0.18) 100%);
    box-shadow: 0 0 16px ${props => (props.theme?.colors?.accent || '#3b82f6') + '30'};
  }

  .chevron-icon {
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

// ===== ACCOUNT BALANCE BADGE =====
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

  .chevron-icon {
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

const CurrencyControlGroup = styled.div`
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};

  .label {
    font-size: 9.5px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 700;
    margin-bottom: 6px;
    display: block;
    text-transform: uppercase;
  }

  .segmented-control {
    display: flex;
    gap: 4px;
    background: ${props => props.theme?.colors?.background || '#020617'};
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

// SYSTEM PALETTES
const THEME_OPTIONS = [
  { key: 'dark', name: 'Solid Dark', color: '#09090b' },
  { key: 'midnight', name: 'Midnight Indigo', color: '#070a12' },
  { key: 'ocean', name: 'Deep Ocean', color: '#020d14' },
  { key: 'cosmic', name: 'Cosmic Violet', color: '#07040d' },
  { key: 'light', name: 'Pure White', color: '#ffffff' }
];

// ============================================
// MAIN TOPPANEL COMPONENT EXPORT
// ============================================
const TopPanel = ({ currentTheme = 'dark', onThemeChange }) => {
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
    real: { balance: 7110.00, kshBalance: 7110.00 * 150.50, eurBalance: 7110.00 * 0.92 },
    demo: { balance: 10000.00, kshBalance: 10000.00 * 150.50, eurBalance: 10000.00 * 0.92 }
  };

  const currentAccount = accountType === 'real' ? accountData.real : accountData.demo;

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
      case 'KSh': return `KSh ${formatNumber(acc.kshBalance)}`;
      case 'EUR': return `€ ${formatNumber(acc.eurBalance)}`;
      default: return `$ ${formatNumber(acc.balance)}`;
    }
  };

  const activeThemeObj = THEME_OPTIONS.find(t => t.key === currentTheme) || THEME_OPTIONS[0];

  return (
    <TopBar>
      {/* BRAND & USER MATRIX */}
      <LeftSection>
        <BrandStack onClick={() => navigate('/dashboard')}>
          <div className="logo-emblem">
            <LogoMarkIcon />
          </div>
          <div className="brand-title">
            <span className="mta-app">MyTradeApp.</span>
            <span className="deriv-tag">deriv</span>
          </div>
          <span className="status-indicator" />
        </BrandStack>

        {/* USER PROFILE & FULL RESTORED ACCOUNTS MENU (REPLACES 3-LINE ICON) */}
        <DropdownContainer ref={userMenuRef}>
          <UserIdentityBadge onClick={() => { closeAllDropdowns(); setIsUserMenuOpen(!isUserMenuOpen); }}>
            <div className="avatar-box">TK</div>
            <div className="identity-info">
              <div className="name-row">
                <span className="user-name">Tonny Kyalo</span>
                <span className={`account-type-pill ${accountType}`}>{accountType}</span>
              </div>
              <span className="user-email">kyalotonny6@gmail.com</span>
            </div>
            <ChevronDownIcon className={`chevron-icon ${isUserMenuOpen ? 'open' : ''}`} />
          </UserIdentityBadge>

          <GlassDropdownMenu isOpen={isUserMenuOpen} alignLeft width="280px">
            <MenuHeader>User Identity & Verification</MenuHeader>
            
            <DropdownItem onClick={() => { navigate('/profile'); closeAllDropdowns(); }}>
              <div className="item-icon-wrapper"><ShieldIcon /></div>
              <span className="title">Tonny Kyalo</span>
              <span className="badge-tag">Verified</span>
            </DropdownItem>
            
            <DropdownItem onClick={() => { navigate('/security'); closeAllDropdowns(); }}>
              <div className="item-icon-wrapper"><SecurityKeyIcon /></div>
              <span className="title">Security & 2FA</span>
            </DropdownItem>

            <DropdownItem onClick={() => { navigate('/settings'); closeAllDropdowns(); }}>
              <div className="item-icon-wrapper"><SettingsIcon /></div>
              <span className="title">Terminal Preferences</span>
            </DropdownItem>

            <MenuHeader style={{ marginTop: '8px' }}>Account Switcher</MenuHeader>

            <DropdownItem
              className={accountType === 'real' ? 'active' : ''}
              onClick={() => { setAccountType('real'); closeAllDropdowns(); }}
            >
              <div className="item-icon-wrapper"><WalletIcon /></div>
              <span className="title">Real Account</span>
              <span style={{ fontSize: '11px', opacity: 0.7, fontFamily: 'monospace' }}>
                {getFormattedBalance(accountData.real)}
              </span>
            </DropdownItem>

            <DropdownItem
              className={accountType === 'demo' ? 'active' : ''}
              onClick={() => { setAccountType('demo'); closeAllDropdowns(); }}
            >
              <div className="item-icon-wrapper"><WalletIcon /></div>
              <span className="title">Demo Account</span>
              <span style={{ fontSize: '11px', opacity: 0.7, fontFamily: 'monospace' }}>
                {getFormattedBalance(accountData.demo)}
              </span>
            </DropdownItem>
          </GlassDropdownMenu>
        </DropdownContainer>
      </LeftSection>

      {/* RIGHT SIDE CONTROLS */}
      <RightSection>
        {/* MODERN GLASS THEME BUTTON */}
        <DropdownContainer ref={themeRef}>
          <PremiumThemeToggle
            activeColor={activeThemeObj.color}
            onClick={() => { closeAllDropdowns(); setIsThemeOpen(!isThemeOpen); }}
          >
            <span className="swatch-glow" />
            <span>{activeThemeObj.name}</span>
            <ChevronDownIcon className={`chevron-icon ${isThemeOpen ? 'open' : ''}`} />
          </PremiumThemeToggle>

          <GlassDropdownMenu isOpen={isThemeOpen}>
            <MenuHeader>Color Palettes</MenuHeader>
            {THEME_OPTIONS.map(t => (
              <DropdownItem
                key={t.key}
                className={currentTheme === t.key ? 'active' : ''}
                onClick={() => {
                  if (onThemeChange) onThemeChange(t.key);
                  closeAllDropdowns();
                }}
              >
                <div className="item-icon-wrapper" style={{ color: t.color }}>
                  <ThemeSwatchIcon />
                </div>
                <span className="title">{t.name}</span>
              </DropdownItem>
            ))}
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* INTERACTIVE FUNDS DROPDOWN MENU */}
        <DropdownContainer ref={fundsRef}>
          <PremiumFundsButton onClick={() => { closeAllDropdowns(); setIsFundsOpen(!isFundsOpen); }}>
            <WalletIcon />
            <span>Funds</span>
            <ChevronDownIcon className={`chevron-icon ${isFundsOpen ? 'open' : ''}`} />
          </PremiumFundsButton>

          <GlassDropdownMenu isOpen={isFundsOpen}>
            <MenuHeader>Cashier Services</MenuHeader>
            <DropdownItem onClick={() => { navigate('/cashier/overview'); closeAllDropdowns(); }}>
              <div className="item-icon-wrapper"><WalletIcon /></div>
              <span className="title">Cashier Overview</span>
            </DropdownItem>
            <DropdownItem onClick={() => { navigate('/cashier/deposit'); closeAllDropdowns(); }}>
              <div className="item-icon-wrapper"><DepositIcon /></div>
              <span className="title">Deposit Funds</span>
            </DropdownItem>
            <DropdownItem onClick={() => { navigate('/cashier/withdraw'); closeAllDropdowns(); }}>
              <div className="item-icon-wrapper"><WithdrawIcon /></div>
              <span className="title">Withdraw Funds</span>
            </DropdownItem>
            <DropdownItem onClick={() => { navigate('/cashier/p2p'); closeAllDropdowns(); }}>
              <div className="item-icon-wrapper"><TransferIcon /></div>
              <span className="title">Deriv P2P</span>
            </DropdownItem>
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* RESTORED ACCOUNT BALANCE BADGE & CURRENCY SWITCHER */}
        <DropdownContainer ref={accountRef}>
          <AccountBadge onClick={() => { closeAllDropdowns(); setIsAccountOpen(!isAccountOpen); }}>
            <span>{getFormattedBalance(currentAccount)}</span>
            <span className="currency-tag">{selectedCurrency}</span>
            <ChevronDownIcon className={`chevron-icon ${isAccountOpen ? 'open' : ''}`} />
          </AccountBadge>

          <GlassDropdownMenu isOpen={isAccountOpen}>
            <MenuHeader>Account Tier</MenuHeader>
            <DropdownItem
              className={accountType === 'real' ? 'active' : ''}
              onClick={() => { setAccountType('real'); closeAllDropdowns(); }}
            >
              <div className="item-icon-wrapper"><VerifiedCheckIcon /></div>
              <span className="title">Real Account</span>
            </DropdownItem>
            <DropdownItem
              className={accountType === 'demo' ? 'active' : ''}
              onClick={() => { setAccountType('demo'); closeAllDropdowns(); }}
            >
              <div className="item-icon-wrapper"><WalletIcon /></div>
              <span className="title">Demo Practice</span>
            </DropdownItem>

            <CurrencyControlGroup>
              <span className="label">Base Currency</span>
              <div className="segmented-control">
                {['USD', 'EUR', 'KSh'].map(curr => (
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

        {/* EXIT BUTTON */}
        <ExitButton onClick={() => navigate('/')}>
          <PowerIcon />
          <span>Exit</span>
        </ExitButton>
      </RightSection>
    </TopBar>
  );
};

export default TopPanel;