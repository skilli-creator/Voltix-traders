// src/components/TopBar.jsx
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

const rotateIn = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.08); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ============================================
// PROFESSIONAL SVG ICONS
// ============================================
const ThemeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const FundsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const DepositIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const WithdrawIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ExitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v10" />
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
  </svg>
);

const ChevronDownIcon = ({ open }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckmarkIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 7-7" />
  </svg>
);

const MPesaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 8l4 8 4-8" />
  </svg>
);

const OverviewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
    <circle cx="12" cy="16" r="5" />
    <circle cx="12" cy="16" r="2" />
  </svg>
);

const EyeIcon = ({ visible }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="m14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

// ============================================
// FUNDS MODAL COMPONENTS – THEME‑AWARE
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 460px;
  max-height: 85vh;
  background: ${p => p.theme.colors?.surface || '#0F172A'};
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 24px;
  box-shadow: ${p => p.theme.colors?.shadow || '0 24px 80px rgba(0,0,0,0.6)'};
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 480px) {
    max-width: 100%;
    margin: 12px;
    border-radius: 20px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  flex-shrink: 0;

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: ${p => p.theme.colors?.accentLight || 'rgba(212,175,55,0.1)'};
    color: ${p => p.theme.colors?.accent || '#D4AF37'};
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(212,175,55,0.2)'};
  }

  .title-text {
    font-size: 18px;
    font-weight: 800;
    color: ${p => p.theme.colors?.text || '#F8FAFC'};
    letter-spacing: -0.3px;
  }

  .title-sub {
    font-size: 12px;
    font-weight: 500;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-top: 2px;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
    background: transparent;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      border-color: ${p => p.theme.colors?.accent || '#D4AF37'};
      color: ${p => p.theme.colors?.accent || '#D4AF37'};
      background: ${p => p.theme.colors?.accentLight || 'rgba(212,175,55,0.08)'};
      transform: rotate(90deg);
    }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px;
  color: ${p => p.theme.colors?.text || '#F8FAFC'};
  position: relative;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { 
    background: ${p => p.theme.colors?.scrollbar || 'rgba(255,255,255,0.15)'}; 
    border-radius: 10px; 
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    background: ${p => p.theme.colors?.inputBg || p.theme.colors?.bg || 'rgba(255,255,255,0.03)'};
    border: 1.5px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
    border-radius: 12px;
    padding: 0 16px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    &:focus-within {
      border-color: ${p => p.theme.colors?.accent || '#D4AF37'};
      box-shadow: 0 0 0 4px ${p => p.theme.colors?.accentLight || 'rgba(212,175,55,0.1)'};
      background: ${p => p.theme.colors?.inputFocusBg || p.theme.colors?.surface || 'rgba(255,255,255,0.06)'};
    }

    .prefix {
      font-size: 14px;
      font-weight: 700;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      margin-right: 8px;
    }

    input {
      flex: 1;
      padding: 14px 0;
      background: transparent;
      border: none;
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
      font-size: 16px;
      font-weight: 600;
      outline: none;

      &::placeholder {
        color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
        font-weight: 400;
        opacity: 0.5;
      }
    }
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background: linear-gradient(
    135deg, 
    ${p => p.theme.colors?.accent || '#D4AF37'}, 
    ${p => p.theme.colors?.accentHover || '#AA8C2C'}
  );
  color: ${p => p.theme.colors?.buttonText || '#000000'};
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px ${p => p.theme.colors?.accentLight || 'rgba(212,175,55,0.3)'};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============================================
// CORE CONTAINERS
// ============================================
const TopBarWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 28px;
  background: ${props => props.theme?.colors?.surfaceGlass || 'rgba(11, 15, 25, 0.85)'};
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
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

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const GlassDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 320px;
  max-width: 90vw;
  max-height: 450px;
  overflow-y: auto;
  background: ${props => props.theme?.colors?.surfaceGlass || 'rgba(15, 17, 26, 0.96)'};
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid ${props => props.theme?.colors?.glassBorder || 'rgba(255,255,255,0.12)'};
  border-radius: 16px;
  padding: 12px;
  box-shadow: ${props => props.theme?.colors?.shadow || '0 24px 60px -10px rgba(0,0,0,0.6)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.96)'};
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 300;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
`;

const MenuHeader = styled.div`
  padding: 8px 12px 10px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.08)'};
  margin-bottom: 8px;
`;

const IconThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.03)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.12)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${props => props.theme?.colors?.text || '#ffffff'};

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#D4AF37'};
    box-shadow: 0 0 20px ${props => (props.theme?.colors?.accent || '#D4AF37') + '25'};
    background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255,255,255,0.08)'};

    .theme-icon {
      animation: ${rotateIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      color: ${props => props.theme?.colors?.accent || '#D4AF37'};
    }
  }
`;

const ThemeOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(212,175,55,0.08)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    transform: translateX(2px);
  }

  &.active {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(212,175,55,0.15)'};
    color: ${props => props.theme?.colors?.accent || '#D4AF37'};
    border: 1px solid ${props => props.theme?.colors?.accent || '#D4AF37'}40;
  }
`;

const FundsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme?.colors?.accent || '#D4AF37'};
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0) 100%);
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(0, 0, 0, 0) 100%);
    box-shadow: 0 4px 20px ${props => (props.theme?.colors?.accent || '#D4AF37') + '30'};
    transform: translateY(-1px);
  }

  .funds-icon-wrapper {
    color: ${props => props.theme?.colors?.accent || '#D4AF37'};
  }

  .funds-content {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1.3;
  }

  .funds-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.3px;
  }

  .funds-sub {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const FundsOption = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
  border: 1px solid transparent;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255,255,255,0.05)'};
    border-color: ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.1)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    transform: translateX(2px);
  }

  .fund-icon {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.03)'};
    color: ${props => props.theme?.colors?.accent || '#D4AF37'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.08)'};
  }

  .fund-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .fund-name {
    font-size: 14px;
    font-weight: 700;
  }

  .fund-desc {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 500;
    margin-top: 2px;
  }
`;

const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: ${props => props.theme?.colors?.surface || 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.1)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    border-color: ${props => props.theme?.colors?.accent || '#D4AF37'};
    box-shadow: 0 0 20px ${props => (props.theme?.colors?.accent || '#D4AF37') + '15'};
  }

  .flag-badge { 
    font-size: 18px; 
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
  
  .balance-display { 
    font-size: 15px;
    font-weight: 800; 
    font-family: 'SF Mono', 'Courier New', monospace;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    letter-spacing: -0.5px;
  }
  
  .account-type-badge {
    font-size: 9px;
    font-weight: 800;
    padding: 3px 6px;
    background: ${props => props.theme?.colors?.accent || '#D4AF37'};
    color: #000000;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const COUNTRY_CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro', symbol: '€' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound', symbol: '£' },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen', symbol: '¥' },
  { code: 'KSh', flag: '🇰🇪', name: 'Kenyan Shilling', symbol: 'KSh' }
];

export default function TopBar() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isFundsModalOpen, setIsFundsModalOpen] = useState(false);
  
  const balance = "10,245.50";
  const currency = "USD";
  const flag = "🇺🇸";
  const accountType = "REAL";

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <>
      <TopBarWrapper>
        <Section gap="20px">
          <DropdownContainer>
            <FundsButton onClick={() => toggleDropdown('funds')}>
              <div className="funds-icon-wrapper"><FundsIcon /></div>
              <div className="funds-content">
                <span className="funds-title">Cashier</span>
                <span className="funds-sub">Deposit / Withdraw</span>
              </div>
              <ChevronDownIcon open={activeDropdown === 'funds'} />
            </FundsButton>

            <GlassDropdownMenu isOpen={activeDropdown === 'funds'} style={{ left: 0, right: 'auto' }}>
              <MenuHeader>Transactions</MenuHeader>
              <FundsOption onClick={() => { setIsFundsModalOpen(true); setActiveDropdown(null); }}>
                <div className="fund-icon"><DepositIcon /></div>
                <div className="fund-info">
                  <span className="fund-name">Deposit Funds</span>
                  <span className="fund-desc">Add capital to your account</span>
                </div>
              </FundsOption>
              <FundsOption onClick={() => { setIsFundsModalOpen(true); setActiveDropdown(null); }}>
                <div className="fund-icon"><WithdrawIcon /></div>
                <div className="fund-info">
                  <span className="fund-name">Withdraw</span>
                  <span className="fund-desc">Transfer to your bank</span>
                </div>
              </FundsOption>
              <FundsOption>
                <div className="fund-icon"><HistoryIcon /></div>
                <div className="fund-info">
                  <span className="fund-name">History</span>
                  <span className="fund-desc">View past transactions</span>
                </div>
              </FundsOption>
            </GlassDropdownMenu>
          </DropdownContainer>
        </Section>

        <Section gap="12px">
          <DropdownContainer>
            <AccountBadge onClick={() => toggleDropdown('account')}>
              <span className="flag-badge">{flag}</span>
              <span className="balance-display">{currency} {balance}</span>
              <span className="account-type-badge">{accountType}</span>
              <ChevronDownIcon open={activeDropdown === 'account'} />
            </AccountBadge>

            <GlassDropdownMenu isOpen={activeDropdown === 'account'}>
              <MenuHeader>Select Currency</MenuHeader>
              {COUNTRY_CURRENCIES.map(c => (
                <ThemeOptionItem key={c.code} className={c.code === currency ? 'active' : ''}>
                  <span style={{ fontSize: '16px' }}>{c.flag}</span>
                  <span style={{ flex: 1 }}>{c.name} ({c.code})</span>
                  {c.code === currency && <span>✓</span>}
                </ThemeOptionItem>
              ))}
            </GlassDropdownMenu>
          </DropdownContainer>

          <DropdownContainer>
            <IconThemeButton aria-label="Toggle Theme" onClick={() => toggleDropdown('theme')}>
              <div className="theme-icon"><ThemeIcon /></div>
            </IconThemeButton>

            <GlassDropdownMenu isOpen={activeDropdown === 'theme'}>
              <MenuHeader>Terminal Themes</MenuHeader>
              <ThemeOptionItem className="active">
                <div className="color-dot" style={{ background: '#0B0F19', borderColor: '#D4AF37' }}></div>
                <span className="theme-label">Institutional Dark (Gold)</span>
                <span className="check-mark">✓</span>
              </ThemeOptionItem>
              <ThemeOptionItem>
                <div className="color-dot" style={{ background: '#ffffff', borderColor: '#e2e8f0' }}></div>
                <span className="theme-label">Pure White (Solid)</span>
              </ThemeOptionItem>
            </GlassDropdownMenu>
          </DropdownContainer>

          <IconThemeButton aria-label="Exit" onClick={() => navigate('/logout')}>
            <ExitIcon />
          </IconThemeButton>
        </Section>
      </TopBarWrapper>

      {/* MODALS */}
      {isFundsModalOpen && (
        <ModalOverlay onClick={() => setIsFundsModalOpen(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <div className="title-group">
                <div className="title-icon"><DepositIcon /></div>
                <div>
                  <div className="title-text">Deposit Funds</div>
                  <div className="title-sub">Secure transaction gateway</div>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsFundsModalOpen(false)}>
                <CloseIcon />
              </button>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <label>Amount ({currency})</label>
                <div className="input-wrap">
                  <span className="prefix">$</span>
                  <input type="number" placeholder="Enter amount..." />
                </div>
              </FormGroup>
              <ActionButton>Proceed to Payment</ActionButton>
            </ModalBody>
          </ModalCard>
        </ModalOverlay>
      )}
    </>
  );
}