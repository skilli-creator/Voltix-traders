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

const spinGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// ============================================
// PROFESSIONAL SVG ICONS (NO EMOJIS)
// ============================================
const StarThemeIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PremiumFundsIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M12 12h.01" />
    <path d="M17 12h.01" />
    <path d="M7 12h.01" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PowerIcon = ({ className }) => (
  <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v10" />
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
  </svg>
);

const ChevronIcon = ({ className }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

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
    color: #ff444f;
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

const GlassDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: ${props => props.width || '280px'};
  max-width: 90vw;
  background: ${props => props.theme?.colors?.surfaceGlass || 'rgba(15, 17, 23, 0.98)'};
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid ${props => props.theme?.colors?.glassBorder || 'rgba(255, 255, 255, 0.12)'};
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.8);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.98)'};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 300;
  overflow: hidden;
`;

const MenuHeader = styled.div`
  padding: 4px 10px 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
`;

// ===== 1. THEME SWITCHER (MODIFIED) =====
const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
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
    border-color: ${props => props.activeColor || '#3b82f6'};
    .theme-icon { color: ${props => props.activeColor || '#3b82f6'}; }
  }

  .theme-icon {
    transition: color 0.2s ease;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  }

  .label-text {
    display: flex;
    align-items: center;
    gap: 6px;
    @media (max-width: 640px) { display: none; }
  }

  .active-theme-name {
    color: ${props => props.activeColor || '#3b82f6'};
    font-weight: 700;
  }

  .chevron {
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
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
    background: ${props => props.theme?.colors?.accentLight || 'rgba(255, 255, 255, 0.05)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  &.active {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .color-dot {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
  }

  .title { flex: 1; }
  .check-mark { color: ${props => props.theme?.colors?.accent || '#3b82f6'}; }
`;

// ===== 2. PROFESSIONAL FUNDS BUTTON (MODIFIED) =====
const ProfessionalFundsButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.accent || '#3b82f6'};
  background: linear-gradient(180deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.05) 100%);
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);

  &:hover {
    background: linear-gradient(180deg, rgba(59,130,246,0.25) 0%, rgba(37,99,235,0.15) 100%);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    transform: translateY(-1px);
  }

  .icon-wrapper {
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    display: flex;
    align-items: center;
  }
`;

// ===== 3. ACCOUNT / CURRENCY DROPDOWN (MODIFIED) =====
const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px;
  background: ${props => props.theme?.colors?.surface || '#0f172a'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-size: 13.5px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#ffffff'};

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .country-code-badge {
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-family: monospace;
    font-weight: 800;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  }

  .balance-text {
    font-family: 'Inter', -apple-system, sans-serif;
    letter-spacing: -0.2px;
  }

  .chevron {
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    transition: transform 0.2s ease;
    &.open { transform: rotate(180deg); }
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  margin-bottom: 10px;
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
  }

  input {
    width: 100%;
    background: ${props => props.theme?.colors?.surface || '#0f172a'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.1)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    border-radius: 8px;
    padding: 10px 10px 10px 34px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    }
    
    &::placeholder {
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    }
  }
`;

const CurrencyScrollList = styled.div`
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { 
    background: rgba(255, 255, 255, 0.1); 
    border-radius: 10px; 
  }
  &::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
`;

const CurrencyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
  margin-bottom: 2px;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.05)'};
  }

  &.active {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
  }

  .country-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .text-badge {
    width: 28px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 10px;
    font-weight: 800;
    font-family: monospace;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .details {
    display: flex;
    flex-direction: column;
  }

  .country-name {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .currency-code {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  }

  .check-icon {
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }
`;

// ===== 4. EXIT BUTTON =====
const ExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  background: transparent;
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    background: rgba(239, 68, 68, 0.1);
  }
`;

// ============================================
// DATA CONSTANTS
// ============================================
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

const WORLD_CURRENCIES = [
  { country: 'United States', code: 'US', currency: 'USD', symbol: '$', rate: 1 },
  { country: 'Eurozone', code: 'EU', currency: 'EUR', symbol: '€', rate: 0.92 },
  { country: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£', rate: 0.79 },
  { country: 'Kenya', code: 'KE', currency: 'KES', symbol: 'KSh', rate: 130.50 },
  { country: 'Japan', code: 'JP', currency: 'JPY', symbol: '¥', rate: 150.00 },
  { country: 'Canada', code: 'CA', currency: 'CAD', symbol: 'C$', rate: 1.35 },
  { country: 'Australia', code: 'AU', currency: 'AUD', symbol: 'A$', rate: 1.50 },
  { country: 'Switzerland', code: 'CH', currency: 'CHF', symbol: 'Fr', rate: 0.90 },
  { country: 'India', code: 'IN', currency: 'INR', symbol: '₹', rate: 83.00 },
  { country: 'South Africa', code: 'ZA', currency: 'ZAR', symbol: 'R', rate: 19.00 },
  { country: 'China', code: 'CN', currency: 'CNY', symbol: '¥', rate: 7.20 },
  { country: 'United Arab Emirates', code: 'AE', currency: 'AED', symbol: 'د.إ', rate: 3.67 }
];

// ============================================
// MAIN COMPONENT
// ============================================
const TopPanel = ({ isSidebarOpen, onSidebarToggle, currentTheme = 'dark', onThemeChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  
  // Base balance logic
  const [baseUsdBalance] = useState(10000.00); 
  const [selectedCurrency, setSelectedCurrency] = useState(WORLD_CURRENCIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef(null);
  const themeRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsThemeOpen(false);
    setSearchQuery('');
  };

  const toggleThemeDropdown = () => {
    setIsThemeOpen(!isThemeOpen);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeThemeObj = THEME_OPTIONS.find(t => t.key === currentTheme) || THEME_OPTIONS[2];

  // Search logic
  const filteredCurrencies = WORLD_CURRENCIES.filter(c => 
    c.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.currency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formatting balance based on selected country rate
  const convertedBalance = baseUsdBalance * selectedCurrency.rate;
  const formattedBalance = convertedBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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
        {/* 1. THEME SWITCHER */}
        <DropdownContainer ref={themeRef}>
          <ThemeButton onClick={toggleThemeDropdown} activeColor={activeThemeObj.color}>
            <StarThemeIcon className="theme-icon" />
            <span className="label-text">
              Change Theme: <span className="active-theme-name">{activeThemeObj.name}</span>
            </span>
            <ChevronIcon className={`chevron ${isThemeOpen ? 'open' : ''}`} />
          </ThemeButton>

          <GlassDropdownMenu isOpen={isThemeOpen} width="220px">
            <MenuHeader>Interface Palette</MenuHeader>
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
                {currentTheme === t.key && <CheckIcon className="check-mark" />}
              </ThemeOptionItem>
            ))}
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* 2. PREMIUM FUNDS BUTTON */}
        <ProfessionalFundsButton href="/funds-management" target="_blank" rel="noopener noreferrer">
          <div className="icon-wrapper">
            <PremiumFundsIcon />
          </div>
          <span>Manage Funds</span>
        </ProfessionalFundsButton>

        {/* 3. ACCOUNT/CURRENCY DROPDOWN */}
        <DropdownContainer ref={dropdownRef}>
          <AccountBadge onClick={toggleDropdown}>
            <span className="country-code-badge">{selectedCurrency.code}</span>
            <span className="balance-text">{selectedCurrency.symbol} {formattedBalance}</span>
            <ChevronIcon className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
          </AccountBadge>

          <GlassDropdownMenu isOpen={isDropdownOpen} width="320px">
            <MenuHeader>Select Region / Currency</MenuHeader>
            
            <SearchInputWrapper>
              <SearchIcon className="search-icon" />
              <input 
                type="text" 
                placeholder="Search country or currency..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isDropdownOpen}
              />
            </SearchInputWrapper>

            <CurrencyScrollList>
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map((item) => (
                  <CurrencyItem 
                    key={item.currency}
                    className={selectedCurrency.currency === item.currency ? 'active' : ''}
                    onClick={() => {
                      setSelectedCurrency(item);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="country-info">
                      <div className="text-badge">{item.code}</div>
                      <div className="details">
                        <span className="country-name">{item.country}</span>
                        <span className="currency-code">{item.currency} - {item.symbol}</span>
                      </div>
                    </div>
                    {selectedCurrency.currency === item.currency && (
                      <CheckIcon className="check-icon" />
                    )}
                  </CurrencyItem>
                ))
              ) : (
                <div style={{ padding: '10px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                  No matches found.
                </div>
              )}
            </CurrencyScrollList>
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