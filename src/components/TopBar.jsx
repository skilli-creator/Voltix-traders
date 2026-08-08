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

// ============================================
// PROFESSIONAL SVG ICONS
// ============================================

// Theme Icon (Star/Sun)
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

// Funds Icon (Wallet)
const FundsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

// Deposit Icon
const DepositIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// Withdraw Icon
const WithdrawIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// Transfer Icon
const TransferIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

// History Icon
const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Exit Icon
const ExitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v10" />
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
  </svg>
);

// Arrow Right Icon
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Chevron Down Icon
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
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
  >
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

// ===== LEFT SECTION =====
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
  background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.03)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme?.colors?.accentActive || 'rgba(59,130,246,0.1)'};
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

// ===== RIGHT SECTION =====
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

// ===== GLASS DROPDOWN =====
const GlassDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 300px;
  max-width: 90vw;
  max-height: 450px;
  overflow-y: auto;
  background: ${props => props.theme?.colors?.surfaceGlass || 'rgba(15,17,23,0.94)'};
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid ${props => props.theme?.colors?.glassBorder || 'rgba(255,255,255,0.12)'};
  border-radius: 14px;
  padding: 8px;
  box-shadow: ${props => props.theme?.colors?.shadow || '0 20px 40px -10px rgba(0,0,0,0.6)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.98)'};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 300;
  overflow: hidden;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
`;

const MenuHeader = styled.div`
  padding: 6px 10px 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.08)'};
  margin-bottom: 4px;
`;

// ============================================
// 1. THEME BUTTON - Updated with premium styling
// ============================================
const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.12)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 12.5px;
  font-weight: 600;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 16px ${props => (props.theme?.colors?.accent || '#3b82f6') + '20'};

    .theme-icon {
      animation: ${rotateIn} 0.6s ease;
    }
  }

  .theme-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    transition: all 0.3s ease;
  }

  .swatch-glow {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.activeColor || '#3b82f6'};
    box-shadow: 0 0 10px ${props => props.activeColor || '#3b82f6'};
    animation: ${pulseGlow} 2.5s infinite;
  }

  .theme-name {
    font-weight: 600;
    font-size: 12px;
  }

  .chevron {
    display: flex;
    align-items: center;
    opacity: 0.7;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    .theme-name { display: none; }
  }
`;

const ThemeOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  &.active {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.12)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.15);
    flex-shrink: 0;
  }

  .theme-label {
    flex: 1;
  }

  .check-mark {
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    font-weight: 700;
  }
`;

// ============================================
// 2. FUNDS BUTTON - Updated with premium styling
// ============================================
const FundsButton = styled.button`
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
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%);
    box-shadow: 0 0 20px ${props => (props.theme?.colors?.accent || '#3b82f6') + '30'};
    transform: translateY(-1px);
  }

  .funds-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .funds-content {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .funds-title {
    font-size: 12.5px;
    font-weight: 700;
  }

  .funds-sub {
    font-size: 9px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 500;
    letter-spacing: 0.2px;
  }

  .arrow {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease, color 0.3s ease;
    opacity: 0.8;
    margin-left: 2px;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    .funds-sub { display: none; }
    .funds-title { font-size: 11px; }
  }
`;

const FundsOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 13px;
  font-weight: 600;

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .fund-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.03)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .fund-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .fund-name {
    font-weight: 700;
  }

  .fund-desc {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 400;
  }

  .fund-arrow {
    opacity: 0.3;
    transition: all 0.2s ease;
  }

  &:hover .fund-arrow {
    opacity: 1;
    transform: translateX(4px);
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }
`;

// ============================================
// 3. ACCOUNT BADGE WITH REAL/DEMO DISPLAY
// ============================================
const COUNTRY_CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro', symbol: '€' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound', symbol: '£' },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', flag: '🇨🇭', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar', symbol: 'AU$' },
  { code: 'CNY', flag: '🇨🇳', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', flag: '🇧🇷', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', flag: '🇿🇦', name: 'South African Rand', symbol: 'R' },
  { code: 'KSh', flag: '🇰🇪', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'NGN', flag: '🇳🇬', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'EGP', flag: '🇪🇬', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'MAD', flag: '🇲🇦', name: 'Moroccan Dirham', symbol: 'DH' },
  { code: 'GHS', flag: '🇬🇭', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'TZS', flag: '🇹🇿', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'UGX', flag: '🇺🇬', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'RWF', flag: '🇷🇼', name: 'Rwandan Franc', symbol: 'FRw' },
  { code: 'ZMW', flag: '🇿🇲', name: 'Zambian Kwacha', symbol: 'ZK' },
  { code: 'MXN', flag: '🇲🇽', name: 'Mexican Peso', symbol: 'Mex$' },
  { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', flag: '🇭🇰', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', flag: '🇳🇿', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SEK', flag: '🇸🇪', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', flag: '🇳🇴', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', flag: '🇩🇰', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', flag: '🇵🇱', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'TRY', flag: '🇹🇷', name: 'Turkish Lira', symbol: '₺' },
  { code: 'SAR', flag: '🇸🇦', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'QAR', flag: '🇶🇦', name: 'Qatari Rial', symbol: '﷼' },
  { code: 'KWD', flag: '🇰🇼', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'BHD', flag: '🇧🇭', name: 'Bahraini Dinar', symbol: 'د.ب' },
  { code: 'OMR', flag: '🇴🇲', name: 'Omani Rial', symbol: '﷼' },
  { code: 'JOD', flag: '🇯🇴', name: 'Jordanian Dinar', symbol: 'د.ا' },
  { code: 'IQD', flag: '🇮🇶', name: 'Iraqi Dinar', symbol: 'ع.د' },
  { code: 'LYD', flag: '🇱🇾', name: 'Libyan Dinar', symbol: 'ل.د' },
  { code: 'TND', flag: '🇹🇳', name: 'Tunisian Dinar', symbol: 'د.ت' },
  { code: 'DZD', flag: '🇩🇿', name: 'Algerian Dinar', symbol: 'د.ج' },
  { code: 'ETB', flag: '🇪🇹', name: 'Ethiopian Birr', symbol: 'Br' },
];

const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: ${props => props.theme?.colors?.surface || 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  font-size: 12.5px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#ffffff'};

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 20px ${props => (props.theme?.colors?.accent || '#3b82f6') + '15'};
  }

  .flag-badge {
    font-size: 16px;
  }

  .balance-display {
    font-weight: 700;
  }

  .account-type-badge {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 2px 8px;
    border-radius: 4px;
    background: ${props => props.isDemo ? 'rgba(59,130,246,0.12)' : 'rgba(52,211,153,0.12)'};
    color: ${props => props.isDemo ? '#60a5fa' : '#34d399'};
    border: 1px solid ${props => props.isDemo ? 'rgba(59,130,246,0.2)' : 'rgba(52,211,153,0.2)'};
    margin-left: 4px;
  }

  .currency-tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.15)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    font-weight: 800;
  }

  .chevron {
    display: flex;
    align-items: center;
    opacity: 0.6;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 12px;
    .flag-badge { font-size: 14px; }
    .currency-tag { font-size: 8px; padding: 1px 6px; }
    .account-type-badge { font-size: 8px; padding: 1px 6px; }
  }
`;

// ===== CURRENCY SEARCH INPUT =====
const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 8px;
  background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 12px;
  font-weight: 500;
  outline: none;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:focus {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => (props.theme?.colors?.accent || '#3b82f6') + '15'};
  }

  &::placeholder {
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 400;
  }
`;

const CurrencyOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.06)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  &.active {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.1)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }

  .flag {
    font-size: 16px;
  }

  .code {
    font-weight: 700;
    min-width: 30px;
  }

  .name {
    flex: 1;
    font-weight: 500;
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  }

  .check {
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
  }
`;

const CurrencyList = styled.div`
  max-height: 180px;
  overflow-y: auto;
  margin-top: 4px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
`;

// ============================================
// 4. EXIT BUTTON
// ============================================
const ExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.1)'};
  background: ${props => props.theme?.colors?.surface || 'transparent'};
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    background: ${props => (props.theme?.colors?.danger || '#ef4444') + '15'};
    transform: translateX(-2px);

    .exit-icon { stroke: ${props => props.theme?.colors?.danger || '#ef4444'}; }
  }

  .exit-icon {
    width: 16px;
    height: 16px;
    transition: stroke 0.3s ease;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 11px;
    .exit-icon { width: 14px; height: 14px; }
  }
`;

// ============================================
// THEME DEFINITIONS - Premium themes (matching Derivdash)
// ============================================
const THEME_OPTIONS = [
  { key: 'white', name: 'White', color: '#f4f6f9' },
  { key: 'dark', name: 'Dark', color: '#09090b' },
  { key: 'gold', name: 'Gold', color: '#0b0a08' },
  { key: 'forest', name: 'Forest', color: '#050c09' },
  { key: 'ocean', name: 'Ocean', color: '#030b12' },
  { key: 'red', name: 'Red', color: '#0c0505' },
  { key: 'orange', name: 'Orange', color: '#0c0703' },
];
// ============================================
// MAIN COMPONENT
// ============================================

const TopPanel = ({ 
  isSidebarOpen, 
  onSidebarToggle, 
  currentTheme = 'dark', 
  onThemeChange // <-- Theme control from Derivdash
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isFundsOpen, setIsFundsOpen] = useState(false);
  const [accountType, setAccountType] = useState('real');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [currencySearch, setCurrencySearch] = useState('');
  
  const dropdownRef = useRef(null);
  const themeRef = useRef(null);
  const fundsRef = useRef(null);
  const navigate = useNavigate();

  // Exchange rates
  const exchangeRates = {
  USD: 1, EUR: 0.93, GBP: 0.80, JPY: 155.00, CHF: 0.89, CAD: 1.37, AUD: 1.55, CNY: 7.25, INR: 83.90, BRL: 5.10,
  ZAR: 19.20, KSh: 129.00, NGN: 1600.00, EGP: 49.50, MAD: 10.20, GHS: 13.20, KES: 129.00, TZS: 2550.00, UGX: 3850.00, RWF: 1350.00,
  ZMW: 27.50, MXN: 18.20, SGD: 1.36, HKD: 7.83, NZD: 1.68, SEK: 10.80, NOK: 10.90, DKK: 6.95, PLN: 4.20, TRY: 33.50,
  SAR: 3.75, AED: 3.67, QAR: 3.64, KWD: 0.31, BHD: 0.38, OMR: 0.38, JOD: 0.71, IQD: 1310.00, LYD: 4.90, TND: 3.15,
  DZD: 135.50, ETB: 57.50
};

  const getExchangeRate = (currency) => exchangeRates[currency] || 1;

  const accountData = {
    real: { balance: 100.00, label: 'Real' },
    demo: { balance: 10000.00, label: 'Demo' }
  };

  const currentAccount = accountType === 'real' ? accountData.real : accountData.demo;
  const isDemo = accountType === 'demo';

  const formatNumberWithCommas = (number) => {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getFormattedBalance = (acc) => {
    const rate = getExchangeRate(selectedCurrency);
    const converted = acc.balance * rate;
    const currencyInfo = COUNTRY_CURRENCIES.find(c => c.code === selectedCurrency);
    const symbol = currencyInfo?.symbol || '$';
    return `${symbol} ${formatNumberWithCommas(converted)}`;
  };

  const getCurrencyFlag = () => {
    const currencyInfo = COUNTRY_CURRENCIES.find(c => c.code === selectedCurrency);
    return currencyInfo?.flag || '🇺🇸';
  };

  const filteredCurrencies = COUNTRY_CURRENCIES.filter(c => 
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsThemeOpen(false);
    setIsFundsOpen(false);
  };

  const toggleThemeDropdown = () => {
    setIsThemeOpen(!isThemeOpen);
    setIsDropdownOpen(false);
    setIsFundsOpen(false);
  };

  const toggleFundsDropdown = () => {
    setIsFundsOpen(!isFundsOpen);
    setIsDropdownOpen(false);
    setIsThemeOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
      if (fundsRef.current && !fundsRef.current.contains(e.target)) {
        setIsFundsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeThemeObj = THEME_OPTIONS.find(t => t.key === currentTheme) || THEME_OPTIONS[0];

  const fundOptions = [
    { icon: <DepositIcon />, name: 'Deposit', desc: 'Add funds to your account' },
    { icon: <WithdrawIcon />, name: 'Withdraw', desc: 'Request a withdrawal' },
    { icon: <TransferIcon />, name: 'Transfer', desc: 'Transfer between accounts' },
    { icon: <HistoryIcon />, name: 'History', desc: 'View transaction history' },
  ];

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
        {/* 1. THEME BUTTON - Controls theme for all pages */}
        <DropdownContainer ref={themeRef}>
          <ThemeButton onClick={toggleThemeDropdown} activeColor={activeThemeObj.color}>
            <span className="theme-icon"><ThemeIcon /></span>
            <span className="swatch-glow" style={{ background: activeThemeObj.color }} />
            <span className="theme-name">{activeThemeObj.name}</span>
            <span className="chevron"><ChevronDownIcon open={isThemeOpen} /></span>
          </ThemeButton>

          <GlassDropdownMenu isOpen={isThemeOpen}>
            <MenuHeader>Choose Theme</MenuHeader>
            {THEME_OPTIONS.map((t) => (
              <ThemeOptionItem
                key={t.key}
                onClick={() => {
                  if (onThemeChange) {
                    onThemeChange(t.key); // <-- Updates theme in Derivdash
                  }
                  setIsThemeOpen(false);
                }}
                className={currentTheme === t.key ? 'active' : ''}
              >
                <span className="color-dot" style={{ background: t.color }} />
                <span className="theme-label">{t.name}</span>
                {currentTheme === t.key && <span className="check-mark">✓</span>}
              </ThemeOptionItem>
            ))}
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* 2. FUNDS BUTTON - Premium styled */}
        <DropdownContainer ref={fundsRef}>
          <FundsButton onClick={toggleFundsDropdown}>
            <span className="funds-icon-wrapper"><FundsIcon /></span>
            <span className="funds-content">
              <span className="funds-title">Funds</span>
              <span className="funds-sub">Manage your money</span>
            </span>
            <span className="arrow"><ChevronDownIcon open={isFundsOpen} /></span>
          </FundsButton>

          <GlassDropdownMenu isOpen={isFundsOpen}>
            <MenuHeader>Funds Management</MenuHeader>
            {fundOptions.map((option, index) => (
              <FundsOption 
                key={index}
                onClick={() => {
                  setIsFundsOpen(false);
                  if (option.name === 'Deposit') {
                    navigate('/payment-dashboard');
                  } else if (option.name === 'Withdraw') {
                    navigate('/payment-dashboard');
                  } else if (option.name === 'Transfer') {
                    alert('Transfer feature coming soon');
                  } else if (option.name === 'History') {
                    navigate('/payment-dashboard');
                  }
                }}
              >
                <span className="fund-icon">{option.icon}</span>
                <span className="fund-info">
                  <span className="fund-name">{option.name}</span>
                  <span className="fund-desc">{option.desc}</span>
                </span>
                <span className="fund-arrow"><ArrowRightIcon /></span>
              </FundsOption>
            ))}
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* 3. ACCOUNT BALANCE - Shows Real/Demo badge */}
        <DropdownContainer ref={dropdownRef}>
          <AccountBadge onClick={toggleDropdown} isDemo={isDemo}>
            <span className="flag-badge">{getCurrencyFlag()}</span>
            <span className="balance-display">{getFormattedBalance(currentAccount)}</span>
            <span className="account-type-badge">{currentAccount.label}</span>
            <span className="currency-tag">{selectedCurrency}</span>
            <span className="chevron"><ChevronDownIcon open={isDropdownOpen} /></span>
          </AccountBadge>

          <GlassDropdownMenu isOpen={isDropdownOpen}>
            <MenuHeader>Account</MenuHeader>
            
            <ThemeOptionItem
              onClick={() => { setAccountType('real'); setIsDropdownOpen(false); }}
              className={accountType === 'real' ? 'active' : ''}
            >
              <span className="flag-badge" style={{ fontSize: '16px' }}>🏦</span>
              <span className="theme-label">Real Account</span>
              <span style={{ fontSize: '11px', opacity: 0.6, color: '#34d399' }}>{getFormattedBalance(accountData.real)}</span>
            </ThemeOptionItem>

            <ThemeOptionItem
              onClick={() => { setAccountType('demo'); setIsDropdownOpen(false); }}
              className={accountType === 'demo' ? 'active' : ''}
            >
              <span className="flag-badge" style={{ fontSize: '16px' }}>🎯</span>
              <span className="theme-label">Demo Practice</span>
              <span style={{ fontSize: '11px', opacity: 0.6, color: '#60a5fa' }}>{getFormattedBalance(accountData.demo)}</span>
            </ThemeOptionItem>

            <div style={{ padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '4px' }}>
              <MenuHeader style={{ marginBottom: '6px' }}>Currency</MenuHeader>
              <SearchInput 
                type="text" 
                placeholder="Search currency..." 
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
              />
              <CurrencyList>
                {filteredCurrencies.length > 0 ? (
                  filteredCurrencies.map((curr) => (
                    <CurrencyOptionItem
                      key={curr.code}
                      onClick={() => {
                        setSelectedCurrency(curr.code);
                        setCurrencySearch('');
                        setIsDropdownOpen(false);
                      }}
                      className={selectedCurrency === curr.code ? 'active' : ''}
                    >
                      <span className="flag">{curr.flag}</span>
                      <span className="code">{curr.code}</span>
                      <span className="name">{curr.name}</span>
                      {selectedCurrency === curr.code && <span className="check">✓</span>}
                    </CurrencyOptionItem>
                  ))
                ) : (
                  <div style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                    No currencies found
                  </div>
                )}
              </CurrencyList>
            </div>
          </GlassDropdownMenu>
        </DropdownContainer>

        {/* 4. EXIT BUTTON */}
        <ExitButton onClick={() => navigate('/')}>
          <span className="exit-icon"><ExitIcon /></span>
          <span>Exit</span>
        </ExitButton>
      </RightSection>
    </TopBar>
  );
};

export default TopPanel;