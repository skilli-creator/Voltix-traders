// src/components/TopBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
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
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
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

const MobileMoneyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
    <line x1="8" y1="6" x2="16" y2="6" />
  </svg>
);

const MPesaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 8l4 8 4-8" />
  </svg>
);

const AirtelIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M7 12l3 3 7-7" />
  </svg>
);

const OverviewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
    <circle cx="12" cy="16" r="5" />
    <circle cx="12" cy="16" r="2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ============================================
// THEME‑AWARE MODAL COMPONENTS
// ============================================

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.25s ease;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  background: ${p => p.theme.colors?.modalBg || p.theme.colors?.surface || '#0F172A'};
  border: 1px solid ${p => p.theme.colors?.modalBorder || p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 24px;
  box-shadow: ${p => p.theme.colors?.modalShadow || '0 20px 60px rgba(0,0,0,0.4)'};
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 480px) {
    max-width: 100%;
    margin: 12px;
    border-radius: 18px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${p => p.theme.colors?.modalBorder || p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
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
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
    border: 1px solid ${p => p.theme.colors?.modalBorder || p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  }

  .title-text {
    font-size: 18px;
    font-weight: 700;
    color: ${p => p.theme.colors?.text || '#F8FAFC'};
    letter-spacing: -0.3px;
  }

  .title-sub {
    font-size: 12px;
    font-weight: 400;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-top: 1px;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid ${p => p.theme.colors?.modalBorder || p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
    background: transparent;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
      background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'};
      transform: rotate(90deg);
    }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px;
  color: ${p => p.theme.colors?.text || '#F8FAFC'};

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { 
    background: ${p => p.theme.colors?.scrollbar || 'rgba(255,255,255,0.1)'}; 
    border-radius: 10px; 
  }
  &::-webkit-scrollbar-track { background: transparent; }
`;

// ============================================
// KENYA DISCLAIMER (theme‑aware)
// ============================================
const KenyaDisclaimer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${p => p.theme.colors?.warningBg || 'rgba(251,191,36,0.1)'};
  border: 1px solid ${p => p.theme.colors?.warningBorder || 'rgba(251,191,36,0.15)'};
  margin-bottom: 16px;

  .disclaimer-icon {
    font-size: 18px;
    color: ${p => p.theme.colors?.warning || '#F59E0B'};
    flex-shrink: 0;
  }

  .disclaimer-text {
    font-size: 12px;
    font-weight: 500;
    color: ${p => p.theme.colors?.warningText || '#F8FAFC'};
    line-height: 1.5;
  }
`;

// ============================================
// MOBILE NETWORK SELECTOR (theme‑aware)
// ============================================
const MobileNetworkSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;

  .network-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 10px;
    border-radius: 12px;
    border: 1.5px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
    background: ${p => p.theme.colors?.bg || p.theme.colors?.background || 'rgba(255,255,255,0.02)'};
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};

    &:hover {
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'};
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
      transform: translateY(-2px);
      box-shadow: 0 4px 16px ${p => p.theme.colors?.shadow || 'rgba(0,0,0,0.2)'};
    }

    &.selected {
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.12)'};
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
    }

    .network-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${p => p.theme.colors?.accent || '#3B82F6'};
      margin-bottom: 4px;
    }

    .network-name {
      font-size: 13px;
      font-weight: 700;
    }
  }
`;

// ============================================
// FORM INPUTS (theme‑aware)
// ============================================
const FormGroup = styled.div`
  margin-bottom: 14px;

  label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    background: ${p => p.theme.colors?.inputBg || p.theme.colors?.bg || 'rgba(255,255,255,0.03)'};
    border: 1.5px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
    border-radius: 10px;
    padding: 0 14px;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      box-shadow: 0 0 0 3px ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
      background: ${p => p.theme.colors?.inputFocusBg || p.theme.colors?.surface || 'rgba(255,255,255,0.06)'};
    }

    .prefix {
      font-size: 14px;
      font-weight: 600;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      margin-right: 6px;
    }

    input {
      flex: 1;
      padding: 12px 0;
      background: transparent;
      border: none;
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
      font-size: 15px;
      font-weight: 500;
      outline: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;

      &::placeholder {
        color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
        font-weight: 400;
        opacity: 0.5;
      }

      &:disabled {
        opacity: 0.6;
        cursor: default;
        background: ${p => p.theme.colors?.inputDisabledBg || 'rgba(255,255,255,0.02)'};
      }
    }

    .suffix {
      font-size: 12px;
      font-weight: 500;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    }
  }

  .helper-text {
    font-size: 11px;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-top: 4px;
  }
`;

// ============================================
// ACTION BUTTON (theme‑aware)
// ============================================
const ActionButton = styled.button`
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background: linear-gradient(
    135deg, 
    ${p => p.theme.colors?.accent || '#3B82F6'}, 
    ${p => p.theme.colors?.accentHover || '#2563EB'}
  );
  color: ${p => p.theme.colors?.buttonText || '#FFFFFF'};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.25)'};
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
// OVERVIEW STYLES (theme‑aware)
// ============================================
const OverviewBalance = styled.div`
  background: linear-gradient(
    135deg, 
    ${p => p.theme.colors?.accent || '#3B82F6'}, 
    ${p => p.theme.colors?.accentDark || '#1D4ED8'}
  );
  border-radius: 16px;
  padding: 24px 24px;
  margin-bottom: 18px;
  text-align: center;

  .label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
  }

  .balance {
    font-size: 36px;
    font-weight: 800;
    color: #FFFFFF;
    margin-top: 4px;
    font-family: 'Courier New', monospace;
  }

  .sub {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 2px;
  }
`;

const OverviewStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 18px;

  .stat {
    text-align: center;
    padding: 14px 8px;
    border-radius: 12px;
    background: ${p => p.theme.colors?.bg || p.theme.colors?.background || 'rgba(255,255,255,0.02)'};
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'};

    .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
      font-family: 'Courier New', monospace;
    }

    .stat-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      margin-top: 2px;
    }
  }
`;

const RecentTransactions = styled.div`
  .section-title {
    font-size: 12px;
    font-weight: 700;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  .tx-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    border-bottom: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'};

    &:last-child { border-bottom: none; }

    .tx-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.06)'};
      color: ${p => p.theme.colors?.accent || '#3B82F6'};
    }

    .tx-info {
      flex: 1;
      .tx-name {
        font-size: 13px;
        font-weight: 600;
        color: ${p => p.theme.colors?.text || '#F8FAFC'};
      }
      .tx-date {
        font-size: 10px;
        color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      }
    }

    .tx-amount {
      font-weight: 700;
      font-family: 'Courier New', monospace;
      font-size: 13px;

      &.positive { color: ${p => p.theme.colors?.success || '#22C55E'}; }
      &.negative { color: ${p => p.theme.colors?.danger || '#EF4444'}; }
    }
  }
`;

// ============================================
// TRANSACTION HISTORY (theme‑aware)
// ============================================
const HistoryFilter = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;

  .filter-btn {
    padding: 4px 14px;
    border-radius: 20px;
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
    background: transparent;
    font-size: 11px;
    font-weight: 600;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    cursor: pointer;
    transition: all 0.2s ease;

    &.active {
      background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.12)'};
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      color: ${p => p.theme.colors?.accent || '#3B82F6'};
    }

    &:hover:not(.active) {
      border-color: ${p => p.theme.colors?.borderHover || 'rgba(255,255,255,0.12)'};
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
    }
  }
`;

const HistoryList = styled.div`
  .history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.03)'};

    &:last-child { border-bottom: none; }

    .left {
      display: flex;
      align-items: center;
      gap: 10px;

      .h-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 8px;
        background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.06)'};
        color: ${p => p.theme.colors?.accent || '#3B82F6'};
      }

      .h-info {
        .h-name {
          font-size: 13px;
          font-weight: 600;
          color: ${p => p.theme.colors?.text || '#F8FAFC'};
        }
        .h-date {
          font-size: 10px;
          color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
        }
        .h-reference {
          font-size: 10px;
          color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
          font-family: 'Courier New', monospace;
        }
      }
    }

    .h-amount {
      font-weight: 700;
      font-size: 13px;
      font-family: 'Courier New', monospace;

      &.positive { color: ${p => p.theme.colors?.success || '#22C55E'}; }
      &.negative { color: ${p => p.theme.colors?.danger || '#EF4444'}; }
    }
  }
`;

// ============================================
// TOP BAR CONTAINERS
// ============================================

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 28px;
  background: ${p => p.theme.colors?.surface || '#0b0f19'};
  border-bottom: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
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
  background: ${p => p.theme.colors?.background || 'rgba(255,255,255,0.03)'};
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.12)'};
    border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
    box-shadow: 0 0 16px ${p => p.theme.colors?.accent ? p.theme.colors.accent + '25' : 'rgba(59,130,246,0.15)'};
  }

  &:active {
    transform: scale(0.94);
  }

  .line {
    display: block;
    height: 2px;
    background: ${p => p.theme.colors?.text || '#ffffff'};
    border-radius: 4px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:nth-child(1) {
      width: 18px;
      transform: ${p => p.isOpen ? 'rotate(45deg) translate(4px, 4.5px)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      width: 14px;
      opacity: ${p => p.isOpen ? '0' : '1'};
      transform: ${p => p.isOpen ? 'scaleX(0)' : 'scaleX(1)'};
    }

    &:nth-child(3) {
      width: ${p => p.isOpen ? '18px' : '10px'};
      transform: ${p => p.isOpen ? 'rotate(-45deg) translate(4px, -4.5px)' : 'rotate(0)'};
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
    color: ${p => p.theme.colors?.text || '#ffffff'};
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
    background: ${p => p.theme.colors?.accent || '#10b981'};
    position: relative;
    margin-left: 2px;
    flex-shrink: 0;

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: ${p => p.theme.colors?.accent || '#10b981'};
      animation: ${pulseRing} 2s ease-out infinite;
    }
  }
`;

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

// ============================================
// IMPROVED GLASS DROPDOWN
// ============================================
const GlassDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 300px;
  max-width: 90vw;
  max-height: 450px;
  overflow-y: auto;
  background: ${p => p.theme.colors?.dropdownBg || `rgba(15, 23, 42, 0.96)`};
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid ${p => p.theme.colors?.dropdownBorder || 'rgba(255,255,255,0.08)'};
  border-radius: 18px;
  padding: 8px;
  box-shadow: ${p => p.theme.colors?.dropdownShadow || '0 25px 50px -12px rgba(0,0,0,0.5)'};
  opacity: ${p => p.isOpen ? 1 : 0};
  visibility: ${p => p.isOpen ? 'visible' : 'hidden'};
  transform: ${p => p.isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)'};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 300;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${p => p.theme.colors?.accent || '#3B82F6'},
      transparent
    );
    opacity: 0.6;
    border-radius: 18px 18px 0 0;
  }

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { 
    background: ${p => p.theme.colors?.scrollbar || 'rgba(255,255,255,0.15)'}; 
    border-radius: 10px; 
  }
`;

const MenuHeader = styled.div`
  padding: 8px 12px 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${p => p.theme.colors?.textMuted || '#94a3b8'};
  border-bottom: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  margin-bottom: 4px;
`;

// ============================================
// 1. THEME BUTTON & ITEMS (unchanged but fully themed)
// ============================================
const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: ${p => p.theme.colors?.buttonBg || 'rgba(255,255,255,0.04)'};
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${p => p.theme.colors?.text || '#ffffff'};
  font-size: 12.5px;
  font-weight: 600;

  &:hover {
    border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
    box-shadow: 0 0 16px ${p => p.theme.colors?.accent ? p.theme.colors.accent + '20' : 'rgba(59,130,246,0.1)'};

    .theme-icon {
      animation: ${rotateIn} 0.6s ease;
    }
  }

  .theme-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
    transition: all 0.3s ease;
  }

  .swatch-glow {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${p => p.activeColor || '#3b82f6'};
    box-shadow: 0 0 10px ${p => p.activeColor || '#3b82f6'};
    animation: ${pulseGlow} 2.5s infinite;
  }

  .theme-name {
    font-weight: 600;
    font-size: 12px;
  }

  .chevron {
    display: flex;
    align-items: center;
    opacity: 0.6;
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
  color: ${p => p.theme.colors?.textSecondary || '#cbd5e1'};

  &:hover {
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    color: ${p => p.theme.colors?.text || '#ffffff'};
  }

  &.active {
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.12)'};
    color: ${p => p.theme.colors?.accent || '#3b82f6'};
  }

  .color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1.5px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.15)'};
    flex-shrink: 0;
  }

  .theme-label {
    flex: 1;
  }

  .check-mark {
    color: ${p => p.theme.colors?.accent || '#3b82f6'};
    font-weight: 700;
  }
`;

// ============================================
// 2. FUNDS BUTTON & OPTIONS (IMPROVED DESIGN)
// ============================================
const FundsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 15px;
  border-radius: 10px;
  border: 1px solid ${p => p.theme.colors?.accent || '#3B82F6'};
  background: ${p => p.theme.colors?.fundsBg || 'rgba(59,130,246,0.15)'};
  color: ${p => p.theme.colors?.text || '#ffffff'};
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: ${p => p.theme.colors?.fundsBgHover || 'rgba(59,130,246,0.25)'};
    box-shadow: 0 0 20px ${p => p.theme.colors?.accent ? p.theme.colors.accent + '30' : 'rgba(59,130,246,0.2)'};
    transform: translateY(-1px);
  }

  .funds-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
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
    color: ${p => p.theme.colors?.textMuted || '#94a3b8'};
    font-weight: 500;
    letter-spacing: 0.2px;
  }

  .arrow {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease, color 0.3s ease;
    opacity: 0.6;
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
  gap: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${p => p.theme.colors?.textSecondary || '#cbd5e1'};
  font-size: 13px;
  font-weight: 600;
  position: relative;

  &:hover {
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    color: ${p => p.theme.colors?.text || '#ffffff'};

    .fund-icon {
      background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.15)'};
      transform: scale(1.05);
    }

    &::after {
      content: '→';
      position: absolute;
      right: 14px;
      font-size: 14px;
      color: ${p => p.theme.colors?.accent || '#3B82F6'};
      opacity: 0.8;
      transition: opacity 0.2s;
    }
  }

  .fund-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: ${p => p.theme.colors?.background || 'rgba(255,255,255,0.03)'};
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
    transition: all 0.2s ease;
  }

  .fund-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .fund-name {
    font-weight: 700;
    margin-bottom: 1px;
  }

  .fund-desc {
    font-size: 11px;
    color: ${p => p.theme.colors?.textMuted || '#94a3b8'};
    font-weight: 400;
  }
`;

// ============================================
// 3. ACCOUNT BADGE (themed)
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
  background: ${p => p.theme.colors?.surface || 'rgba(15,23,42,0.6)'};
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.1)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  font-size: 12.5px;
  font-weight: 700;
  color: ${p => p.theme.colors?.text || '#ffffff'};

  &:hover {
    background: ${p => p.theme.colors?.surfaceHover || '#1e293b'};
    border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
    box-shadow: 0 0 20px ${p => p.theme.colors?.accent ? p.theme.colors.accent + '15' : 'rgba(59,130,246,0.1)'};
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
    background: ${p => p.isDemo ? 'rgba(59,130,246,0.12)' : 'rgba(52,211,153,0.12)'};
    color: ${p => p.isDemo ? '#60a5fa' : '#34d399'};
    border: 1px solid ${p => p.isDemo ? 'rgba(59,130,246,0.2)' : 'rgba(52,211,153,0.2)'};
    margin-left: 4px;
  }

  .currency-tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.15)'};
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
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

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 8px;
  background: ${p => p.theme.colors?.background || 'rgba(255,255,255,0.02)'};
  color: ${p => p.theme.colors?.text || '#ffffff'};
  font-size: 12px;
  font-weight: 500;
  outline: none;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:focus {
    border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
    box-shadow: 0 0 0 3px ${p => p.theme.colors?.accent ? p.theme.colors.accent + '15' : 'rgba(59,130,246,0.15)'};
  }

  &::placeholder {
    color: ${p => p.theme.colors?.textMuted || '#64748b'};
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
  color: ${p => p.theme.colors?.textSecondary || '#cbd5e1'};

  &:hover {
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.06)'};
    color: ${p => p.theme.colors?.text || '#ffffff'};
  }

  &.active {
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.12)'};
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
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
    color: ${p => p.theme.colors?.textMuted || '#94a3b8'};
  }

  .check {
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
  }
`;

const CurrencyList = styled.div`
  max-height: 180px;
  overflow-y: auto;
  margin-top: 4px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { 
    background: ${p => p.theme.colors?.scrollbar || 'rgba(255,255,255,0.1)'}; 
    border-radius: 10px; 
  }
`;

// ============================================
// 4. EXIT BUTTON (themed)
// ============================================
const ExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.1)'};
  background: ${p => p.theme.colors?.surface || 'transparent'};
  color: ${p => p.theme.colors?.textSecondary || '#cbd5e1'};
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: ${p => p.theme.colors?.danger || '#ef4444'};
    color: ${p => p.theme.colors?.danger || '#ef4444'};
    background: ${p => p.theme.colors?.danger ? p.theme.colors.danger + '15' : 'rgba(239,68,68,0.1)'};
    transform: translateX(-2px);

    .exit-icon { stroke: ${p => p.theme.colors?.danger || '#ef4444'}; }
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
// THEME OPTIONS
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
  onThemeChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isFundsOpen, setIsFundsOpen] = useState(false);
  const [accountType, setAccountType] = useState('real');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [currencySearch, setCurrencySearch] = useState('');
  
  // Funds Modal state
  const [fundModalAction, setFundModalAction] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('mpesa');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionReference, setTransactionReference] = useState('');
  
  const dropdownRef = useRef(null);
  const themeRef = useRef(null);
  const fundsRef = useRef(null);
  const navigate = useNavigate();

  // Exchange rates (unchanged)
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

  const closeModal = () => setFundModalAction(null);

  const handleFundAction = (action) => {
    setIsFundsOpen(false);
    setFundModalAction(action);
    if (action === 'overview') {
      // reset
    } else if (action === 'deposit' || action === 'withdraw') {
      setSelectedNetwork('mpesa');
      setAmount('');
      setPhoneNumber('');
      setTransactionReference('');
    }
  };

  const handleSubmitDeposit = () => {
    const networkName = selectedNetwork === 'mpesa' ? 'M-Pesa' : 'Airtel Money';
    alert(`Deposit Request\n\n` +
      `Network: ${networkName}\n` +
      `Phone: ${phoneNumber}\n` +
      `Amount: $${amount}\n\n` +
      `A confirmation SMS will be sent to your phone.\n` +
      `This service is available in Kenya only.`);
  };

  const handleSubmitWithdraw = () => {
    const networkName = selectedNetwork === 'mpesa' ? 'M-Pesa' : 'Airtel Money';
    alert(`Withdrawal Request\n\n` +
      `Network: ${networkName}\n` +
      `Phone: ${phoneNumber}\n` +
      `Amount: $${amount}\n\n` +
      `Funds will be sent to your mobile wallet within 24 hours.\n` +
      `This service is available in Kenya only.`);
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

  // Funds options (Transfer removed)
  const fundOptions = [
    { icon: <OverviewIcon />, name: 'Overview', desc: 'View your balance and activity', action: 'overview' },
    { icon: <DepositIcon />, name: 'Deposit', desc: 'Add funds via mobile wallet', action: 'deposit' },
    { icon: <WithdrawIcon />, name: 'Withdraw', desc: 'Withdraw to mobile wallet', action: 'withdraw' },
    { icon: <HistoryIcon />, name: 'History', desc: 'View transaction history', action: 'history' },
  ];

  const sampleTransactions = [
    { id: 1, type: 'deposit', name: 'Deposit via M-Pesa', date: 'Today, 10:23 AM', amount: 50.00, positive: true, ref: 'MP-2024-00123' },
    { id: 2, type: 'withdraw', name: 'Withdrawal to M-Pesa', date: 'Yesterday, 3:15 PM', amount: 20.00, positive: false, ref: 'WD-2024-00456' },
    { id: 3, type: 'deposit', name: 'Deposit via Airtel Money', date: 'Aug 5, 9:45 AM', amount: 100.00, positive: true, ref: 'AM-2024-00156' },
    { id: 4, type: 'withdraw', name: 'Withdrawal to Airtel Money', date: 'Aug 4, 6:20 PM', amount: 30.00, positive: false, ref: 'WD-2024-00178' },
  ];

  // Render modal content based on action
  const renderModalContent = () => {
    switch (fundModalAction) {
      case 'overview':
        return (
          <>
            <OverviewBalance>
              <div className="label">Total Balance</div>
              <div className="balance">{getFormattedBalance(currentAccount)}</div>
              <div className="sub">{currentAccount.label} Account • {selectedCurrency}</div>
            </OverviewBalance>
            <OverviewStats>
              <div className="stat">
                <div className="stat-value">{formatNumberWithCommas(parseFloat(currentAccount.balance) * 0.1)}</div>
                <div className="stat-label">Invested</div>
              </div>
              <div className="stat">
                <div className="stat-value" style={{ color: '#22C55E' }}>+$12.50</div>
                <div className="stat-label">Profit</div>
              </div>
              <div className="stat">
                <div className="stat-value">0</div>
                <div className="stat-label">Active Trades</div>
              </div>
            </OverviewStats>
            <RecentTransactions>
              <div className="section-title">Recent Transactions</div>
              {sampleTransactions.slice(0, 3).map(tx => (
                <div key={tx.id} className="tx-item">
                  <div className="tx-icon">
                    {tx.type === 'deposit' && <DepositIcon />}
                    {tx.type === 'withdraw' && <WithdrawIcon />}
                  </div>
                  <div className="tx-info">
                    <div className="tx-name">{tx.name}</div>
                    <div className="tx-date">{tx.date}</div>
                  </div>
                  <div className={`tx-amount ${tx.positive ? 'positive' : 'negative'}`}>
                    {tx.positive ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </RecentTransactions>
          </>
        );
      case 'deposit':
        return (
          <>
            <KenyaDisclaimer>
              <span className="disclaimer-icon">🇰🇪</span>
              <span className="disclaimer-text">
                This payment agent operates exclusively in <strong>Kenya</strong>. 
                Only M-Pesa and Airtel Money mobile wallets are supported.
              </span>
            </KenyaDisclaimer>

            <FormGroup>
              <label>Deposit to Deriv Account</label>
              <div className="input-wrap">
                <span className="prefix" style={{ fontSize: '11px', fontWeight: '500' }}>Account</span>
                <input type="text" value="Deriv Trading Account" disabled style={{ fontWeight: '600', opacity: 0.7 }} />
              </div>
            </FormGroup>

            <MobileNetworkSelector>
              <div className={`network-option ${selectedNetwork === 'mpesa' ? 'selected' : ''}`} onClick={() => setSelectedNetwork('mpesa')}>
                <div className="network-icon"><MPesaIcon /></div>
                <div className="network-name">M-Pesa</div>
              </div>
              <div className={`network-option ${selectedNetwork === 'airtel' ? 'selected' : ''}`} onClick={() => setSelectedNetwork('airtel')}>
                <div className="network-icon"><AirtelIcon /></div>
                <div className="network-name">Airtel Money</div>
              </div>
            </MobileNetworkSelector>

            <FormGroup>
              <label>Phone Number</label>
              <div className="input-wrap">
                <span className="prefix">+254</span>
                <input type="tel" placeholder="7XX XXX XXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="helper-text">Enter your {selectedNetwork === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} registered phone number</div>
            </FormGroup>

            <FormGroup>
              <label>Amount (USD)</label>
              <div className="input-wrap">
                <span className="prefix">$</span>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" step="0.01" />
                <span className="suffix">≈ KES {(parseFloat(amount) * 129).toFixed(0)}</span>
              </div>
              <div className="helper-text">Exchange rate: 1 USD = 129 KES</div>
            </FormGroup>

            <ActionButton onClick={handleSubmitDeposit} disabled={!amount || parseFloat(amount) <= 0 || !phoneNumber || phoneNumber.length < 8}>
              Deposit to Deriv
            </ActionButton>
          </>
        );
      case 'withdraw':
        return (
          <>
            <KenyaDisclaimer>
              <span className="disclaimer-icon">🇰🇪</span>
              <span className="disclaimer-text">
                Withdrawals are processed to mobile wallets only. 
                This service is exclusively available in <strong>Kenya</strong>.
              </span>
            </KenyaDisclaimer>

            <FormGroup>
              <label>Withdraw From</label>
              <div className="input-wrap">
                <span className="prefix" style={{ fontSize: '11px', fontWeight: '500' }}>Account</span>
                <input type="text" value="Deriv Trading Account" disabled style={{ fontWeight: '600', opacity: 0.7 }} />
                <span className="suffix">{getFormattedBalance(currentAccount)}</span>
              </div>
            </FormGroup>

            <MobileNetworkSelector>
              <div className={`network-option ${selectedNetwork === 'mpesa' ? 'selected' : ''}`} onClick={() => setSelectedNetwork('mpesa')}>
                <div className="network-icon"><MPesaIcon /></div>
                <div className="network-name">M-Pesa</div>
              </div>
              <div className={`network-option ${selectedNetwork === 'airtel' ? 'selected' : ''}`} onClick={() => setSelectedNetwork('airtel')}>
                <div className="network-icon"><AirtelIcon /></div>
                <div className="network-name">Airtel Money</div>
              </div>
            </MobileNetworkSelector>

            <FormGroup>
              <label>Mobile Wallet Number</label>
              <div className="input-wrap">
                <span className="prefix">+254</span>
                <input type="tel" placeholder="7XX XXX XXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="helper-text">Enter your {selectedNetwork === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} wallet phone number</div>
            </FormGroup>

            <FormGroup>
              <label>Amount to Withdraw (USD)</label>
              <div className="input-wrap">
                <span className="prefix">$</span>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" step="0.01" />
                <span className="suffix">≈ KES {(parseFloat(amount) * 129).toFixed(0)}</span>
              </div>
              <div className="helper-text">Exchange rate: 1 USD = 129 KES</div>
            </FormGroup>

            <ActionButton onClick={handleSubmitWithdraw} disabled={!amount || parseFloat(amount) <= 0 || !phoneNumber || phoneNumber.length < 8}>
              Withdraw to Mobile Wallet
            </ActionButton>
          </>
        );
      case 'history':
        return (
          <>
            <HistoryFilter>
              <button className="filter-btn active" onClick={(e) => { /* ... */ }}>All</button>
              <button className="filter-btn" onClick={(e) => { /* ... */ }}>Deposits</button>
              <button className="filter-btn" onClick={(e) => { /* ... */ }}>Withdrawals</button>
            </HistoryFilter>
            <HistoryList>
              {sampleTransactions.map(tx => (
                <div key={tx.id} className="history-item">
                  <div className="left">
                    <div className="h-icon">
                      {tx.type === 'deposit' && <DepositIcon />}
                      {tx.type === 'withdraw' && <WithdrawIcon />}
                    </div>
                    <div className="h-info">
                      <div className="h-name">{tx.name}</div>
                      <div className="h-date">{tx.date}</div>
                      <div className="h-reference">Ref: {tx.ref}</div>
                    </div>
                  </div>
                  <div className={`h-amount ${tx.positive ? 'positive' : 'negative'}`}>
                    {tx.positive ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </HistoryList>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
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
          {/* THEME BUTTON */}
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
                    if (onThemeChange) onThemeChange(t.key);
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

          {/* FUNDS BUTTON */}
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
                <FundsOption key={index} onClick={() => handleFundAction(option.action)}>
                  <span className="fund-icon">{option.icon}</span>
                  <span className="fund-info">
                    <span className="fund-name">{option.name}</span>
                    <span className="fund-desc">{option.desc}</span>
                  </span>
                </FundsOption>
              ))}
            </GlassDropdownMenu>
          </DropdownContainer>

          {/* ACCOUNT BADGE */}
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

          {/* EXIT BUTTON */}
          <ExitButton onClick={() => navigate('/')}>
            <span className="exit-icon"><ExitIcon /></span>
            <span>Exit</span>
          </ExitButton>
        </RightSection>
      </TopBar>

      {/* FUNDS MODAL */}
      {fundModalAction && (
        <ModalOverlay onClick={closeModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div className="title-group">
                <div className="title-icon">
                  {fundModalAction === 'overview' && <OverviewIcon />}
                  {fundModalAction === 'deposit' && <DepositIcon />}
                  {fundModalAction === 'withdraw' && <WithdrawIcon />}
                  {fundModalAction === 'history' && <HistoryIcon />}
                </div>
                <div>
                  <div className="title-text">
                    {fundModalAction === 'overview' && 'Funds Overview'}
                    {fundModalAction === 'deposit' && 'Deposit to Deriv'}
                    {fundModalAction === 'withdraw' && 'Withdraw from Deriv'}
                    {fundModalAction === 'history' && 'Transaction History'}
                  </div>
                  {fundModalAction === 'deposit' && <div className="title-sub">Add funds using mobile money</div>}
                  {fundModalAction === 'withdraw' && <div className="title-sub">Withdraw to your mobile wallet</div>}
                </div>
              </div>
              <button className="close-btn" onClick={closeModal}><CloseIcon /></button>
            </ModalHeader>
            <ModalBody>
              {renderModalContent()}
            </ModalBody>
          </ModalCard>
        </ModalOverlay>
      )}
    </>
  );
};

export default TopPanel;