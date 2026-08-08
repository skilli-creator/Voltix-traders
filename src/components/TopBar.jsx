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
  max-width: 440px;
  max-height: 85vh;
  background: ${p => p.theme.colors?.surface || '#0F172A'};
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 20px;
  box-shadow: ${p => p.theme.colors?.shadow || '0 20px 60px rgba(0,0,0,0.4)'};
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 480px) {
    max-width: 100%;
    margin: 12px;
    border-radius: 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  flex-shrink: 0;

  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  }

  .title-text {
    font-size: 16px;
    font-weight: 700;
    color: ${p => p.theme.colors?.text || '#F8FAFC'};
    letter-spacing: -0.3px;
  }

  .title-sub {
    font-size: 11px;
    font-weight: 400;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-top: 1px;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
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
  padding: 16px 20px 20px;
  color: ${p => p.theme.colors?.text || '#F8FAFC'};

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { 
    background: ${p => p.theme.colors?.scrollbar || 'rgba(255,255,255,0.15)'}; 
    border-radius: 10px; 
  }
  &::-webkit-scrollbar-track { background: transparent; }
`;

// ============================================
// KENYA DISCLAIMER – THEME‑AWARE
// ============================================
const KenyaDisclaimer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${p => p.theme.colors?.warningBg || 'rgba(251,191,36,0.1)'};
  border: 1px solid ${p => p.theme.colors?.warningBorder || 'rgba(251,191,36,0.15)'};
  margin-bottom: 14px;
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.theme.colors?.warningText || '#F8FAFC'};
  line-height: 1.4;
`;

// ============================================
// WALLET TRANSFER INFO – THEME‑AWARE
// ============================================
const WalletInfo = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  background: ${p => p.theme.colors?.infoBg || 'rgba(59,130,246,0.08)'};
  border: 1px solid ${p => p.theme.colors?.infoBorder || 'rgba(59,130,246,0.12)'};
  margin-bottom: 14px;
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.theme.colors?.infoText || '#93C5FD'};
  line-height: 1.4;
`;

// ============================================
// CONFIRMATION PROMPT – THEME‑AWARE (no hardcoded colors)
// ============================================
const ConfirmationMessage = styled.div`
  text-align: center;
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 8px;
  background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
  color: ${p => p.theme.colors?.accent || '#3B82F6'};
  font-weight: 600;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.1)'};
`;

// ============================================
// MOBILE NETWORK SELECTOR – AD-LIKE BOXES
// ============================================
const MobileNetworkSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;

  .network-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 10px;
    border-radius: 14px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s ease;
    color: #FFFFFF;
    position: relative;
    overflow: hidden;

    &.mpesa {
      background: linear-gradient(135deg, #28A745 0%, #20C997 100%);
      border-color: #28A745;
    }

    &.airtel {
      background: linear-gradient(135deg, #E53935 0%, #FF5252 100%);
      border-color: #E53935;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }

    /* Selected state: white border + checkmark */
    &.selected {
      border-color: #FFFFFF;
      box-shadow: 0 0 15px rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.3);
    }

    &.selected::after {
      content: '✓';
      position: absolute;
      top: 6px;
      right: 6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      color: #000;
      font-weight: 700;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .network-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      margin-bottom: 6px;
      opacity: 0.95;
    }

    .network-name {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.3px;
    }

    .network-tagline {
      font-size: 9px;
      opacity: 0.85;
      margin-top: 3px;
      font-weight: 500;
    }
  }
`;

// ============================================
// FORM INPUTS (theme‑aware)
// ============================================
const FormGroup = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-bottom: 3px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    background: ${p => p.theme.colors?.inputBg || p.theme.colors?.bg || 'rgba(255,255,255,0.03)'};
    border: 1.5px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
    border-radius: 10px;
    padding: 0 12px;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      box-shadow: 0 0 0 3px ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
      background: ${p => p.theme.colors?.inputFocusBg || p.theme.colors?.surface || 'rgba(255,255,255,0.06)'};
    }

    .prefix {
      font-size: 13px;
      font-weight: 600;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      margin-right: 6px;
    }

    input {
      flex: 1;
      padding: 10px 0;
      background: transparent;
      border: none;
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
      font-size: 14px;
      font-weight: 500;
      outline: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;

      &::placeholder {
        color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
        font-weight: 400;
        opacity: 0.5;
      }
    }

    .suffix {
      font-size: 11px;
      font-weight: 500;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    }
  }

  .helper-text {
    font-size: 10px;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-top: 3px;
  }

  .error-text {
    font-size: 10px;
    color: #EF4444;
    margin-top: 3px;
    font-weight: 500;
  }
`;

// ============================================
// ACTION BUTTON (theme‑aware)
// ============================================
const ActionButton = styled.button`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  background: linear-gradient(
    135deg, 
    ${p => p.theme.colors?.accent || '#3B82F6'}, 
    ${p => p.theme.colors?.accentHover || '#2563EB'}
  );
  color: ${p => p.theme.colors?.buttonText || '#FFFFFF'};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 4px;

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
// OVERVIEW STYLES (theme‑aware, compact)
// ============================================
const OverviewBalance = styled.div`
  background: linear-gradient(
    135deg, 
    ${p => p.theme.colors?.accent || '#3B82F6'}, 
    ${p => p.theme.colors?.accentDark || '#1D4ED8'}
  );
  border-radius: 14px;
  padding: 20px 20px;
  margin-bottom: 14px;
  text-align: center;

  .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
  }

  .nickname {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    font-family: 'Courier New', monospace;
    margin-bottom: 8px;
  }

  .balance-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 4px;
  }

  .balance {
    font-size: 30px;
    font-weight: 800;
    color: #FFFFFF;
    font-family: 'Courier New', monospace;
  }

  .eye-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 8px;
    padding: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #FFFFFF;

    &:hover {
      background: rgba(255,255,255,0.25);
    }
  }

  .sub {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 4px;
  }
`;

const OverviewStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;

  .stat {
    text-align: center;
    padding: 12px 6px;
    border-radius: 10px;
    background: ${p => p.theme.colors?.bg || p.theme.colors?.background || 'rgba(255,255,255,0.02)'};
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'};

    .stat-value {
      font-size: 16px;
      font-weight: 700;
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
      font-family: 'Courier New', monospace;
    }

    .stat-label {
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      margin-top: 2px;
    }
  }
`;

const RecentTransactions = styled.div`
  .section-title {
    font-size: 11px;
    font-weight: 700;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .tx-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    border-bottom: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'};

    &:last-child { border-bottom: none; }

    .tx-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.06)'};
      color: ${p => p.theme.colors?.accent || '#3B82F6'};
    }

    .tx-info {
      flex: 1;
      .tx-name {
        font-size: 12px;
        font-weight: 600;
        color: ${p => p.theme.colors?.text || '#F8FAFC'};
      }
      .tx-date {
        font-size: 9px;
        color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      }
    }

    .tx-amount {
      font-weight: 700;
      font-family: 'Courier New', monospace;
      font-size: 12px;

      &.positive { color: ${p => p.theme.colors?.success || '#22C55E'}; }
      &.negative { color: ${p => p.theme.colors?.danger || '#EF4444'}; }
    }
  }
`;

// ============================================
// TRANSACTION HISTORY (theme‑aware, compact)
// ============================================
const HistoryFilter = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;

  .filter-btn {
    padding: 3px 12px;
    border-radius: 20px;
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
    background: transparent;
    font-size: 10px;
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
    padding: 8px 0;
    border-bottom: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.03)'};

    &:last-child { border-bottom: none; }

    .left {
      display: flex;
      align-items: center;
      gap: 8px;

      .h-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.06)'};
        color: ${p => p.theme.colors?.accent || '#3B82F6'};
      }

      .h-info {
        .h-name {
          font-size: 12px;
          font-weight: 600;
          color: ${p => p.theme.colors?.text || '#F8FAFC'};
        }
        .h-date {
          font-size: 9px;
          color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
        }
        .h-reference {
          font-size: 9px;
          color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
          font-family: 'Courier New', monospace;
        }
      }
    }

    .h-amount {
      font-weight: 700;
      font-size: 12px;
      font-family: 'Courier New', monospace;

      &.positive { color: ${p => p.theme.colors?.success || '#22C55E'}; }
      &.negative { color: ${p => p.theme.colors?.danger || '#EF4444'}; }
    }
  }
`;

// ============================================
// CORE CONTAINERS (unchanged)
// ============================================

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 28px;
  background: ${props => props.theme?.colors?.surface || '#0b0f19'};
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
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.12)'};
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
// GLASS DROPDOWN – UNCHANGED
// ============================================
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
// 1. THEME BUTTON – UNCHANGED
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
// 2. FUNDS BUTTON – UNCHANGED
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
`;

// ============================================
// 3. ACCOUNT BADGE – UNCHANGED
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
// 4. EXIT BUTTON – UNCHANGED
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
// THEME DEFINITIONS
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
// SPINNER COMPONENT (FOR DEPOSIT WAITING)
// ============================================
const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto 12px;
`;

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
  const [showBalance, setShowBalance] = useState(false);

  // New states for withdrawal confirmation
  const [withdrawConfirmationStep, setWithdrawConfirmationStep] = useState(false);
  const [withdrawConfirmationData, setWithdrawConfirmationData] = useState(null);
  const [confirmationPhone, setConfirmationPhone] = useState('');
  const [confirmationError, setConfirmationError] = useState('');

  // New state for deposit waiting screen
  const [depositPending, setDepositPending] = useState(false);
  
  const dropdownRef = useRef(null);
  const themeRef = useRef(null);
  const fundsRef = useRef(null);
  const navigate = useNavigate();

  // Exchange rates for Kenya (KES)
  const DEPOSIT_RATE = 131;  // 1 USD = 131 KES (deposit)
  const WITHDRAW_RATE = 126; // 1 USD = 126 KES (withdraw)

  // Generate a realistic Deriv account ID (like client_mq98tio2zxum)
  const generateAccountNickname = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'client_';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const [accountNickname] = useState(generateAccountNickname());

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
    const currencyInfo = COUNTRY_CURRENCIES.find(c => c.code === selectedCurrency);
    const symbol = currencyInfo?.symbol || '$';
    return `${symbol} ${formatNumberWithCommas(acc.balance)}`;
  };

  const getMaskedBalance = (acc) => {
    const currencyInfo = COUNTRY_CURRENCIES.find(c => c.code === selectedCurrency);
    const symbol = currencyInfo?.symbol || '$';
    return `${symbol} ****.**`;
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

  const closeModal = () => {
    setFundModalAction(null);
    setShowBalance(false);
    // Reset confirmation states
    setWithdrawConfirmationStep(false);
    setWithdrawConfirmationData(null);
    setConfirmationPhone('');
    setConfirmationError('');
    // Reset deposit pending
    setDepositPending(false);
  };

  const handleFundAction = (action) => {
    setIsFundsOpen(false);
    setFundModalAction(action);
    if (action === 'deposit' || action === 'withdraw') {
      setSelectedNetwork('mpesa');
      setAmount('');
      setPhoneNumber('');
    } else if (action === 'overview') {
      setShowBalance(false);
    }
  };

  const handleSubmitDeposit = () => {
    // Show STK push waiting screen instead of alert
    setDepositPending(true);
  };

  const handleSubmitWithdraw = () => {
    // Start phone number confirmation step
    setWithdrawConfirmationStep(true);
    setWithdrawConfirmationData({
      amount: amount,
      network: selectedNetwork,
      originalPhone: phoneNumber,
    });
  };

  const handleConfirmWithdraw = () => {
    if (confirmationPhone !== withdrawConfirmationData.originalPhone) {
      setConfirmationError('Phone numbers do not match. Please try again.');
      return;
    }
    // Proceed with withdrawal (simulate)
    const networkName = withdrawConfirmationData.network === 'mpesa' ? 'M-Pesa' : 'Airtel Money';
    const kesAmount = (parseFloat(withdrawConfirmationData.amount) * WITHDRAW_RATE).toFixed(0);
    alert(
      `Withdrawal Request Submitted\n\n` +
      `Network: ${networkName}\n` +
      `Phone: +254${withdrawConfirmationData.originalPhone}\n` +
      `Amount: $${withdrawConfirmationData.amount} (≈ KES ${kesAmount})\n\n` +
      `Funds will be sent to your mobile wallet shortly.`
    );
    // Reset all withdrawal states and close modal
    closeModal();
  };

  // Validate phone number: only digits, must start with 1 or 7, max 9 digits
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    // Allow empty or must start with 1 or 7
    if (value === '' || (value.length > 0 && (value.charAt(0) === '1' || value.charAt(0) === '7'))) {
      if (value.length <= 9) {
        setPhoneNumber(value);
      }
    }
  };

  const handleConfirmationPhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || (value.length > 0 && (value.charAt(0) === '1' || value.charAt(0) === '7'))) {
      if (value.length <= 9) {
        setConfirmationPhone(value);
      }
    }
    if (confirmationError) setConfirmationError('');
  };

  // Validate amount: only numbers, min 1, max 2000
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      const num = parseFloat(value);
      if (value === '' || (num >= 1 && num <= 2000)) {
        setAmount(value);
      }
    }
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
    { icon: <OverviewIcon />, name: 'Overview', desc: 'View your balance and activity', action: 'overview' },
    { icon: <DepositIcon />, name: 'Deposit', desc: 'Add funds via mobile wallet', action: 'deposit' },
    { icon: <WithdrawIcon />, name: 'Withdraw', desc: 'Withdraw to mobile wallet', action: 'withdraw' },
    { icon: <HistoryIcon />, name: 'History', desc: 'View transaction history', action: 'history' },
  ];

  const sampleTransactions = [
    { id: 1, type: 'deposit', name: 'Deposit via M-Pesa', date: 'Today, 10:23 AM', amount: 50.00, positive: true, ref: 'MP-2024-00123' },
    { id: 2, type: 'withdraw', name: 'Withdrawal to M-Pesa', date: 'Yesterday, 3:15 PM', amount: 20.00, positive: false, ref: 'WD-2024-00456' },
    { id: 4, type: 'deposit', name: 'Deposit via Airtel Money', date: 'Aug 5, 9:45 AM', amount: 100.00, positive: true, ref: 'AM-2024-00156' },
    { id: 5, type: 'withdraw', name: 'Withdrawal to Airtel Money', date: 'Aug 4, 6:20 PM', amount: 30.00, positive: false, ref: 'WD-2024-00178' },
  ];

  const renderModalContent = () => {
    const networkName = selectedNetwork === 'mpesa' ? 'M-Pesa' : 'Airtel Money';
    const rate = fundModalAction === 'deposit' ? DEPOSIT_RATE : WITHDRAW_RATE;

    switch (fundModalAction) {
      case 'overview':
        return (
          <>
            <OverviewBalance>
              <div className="label">Deriv Main Wallet</div>
              <div className="nickname">{accountNickname}</div>
              <div className="balance-row">
                <div className="balance">
                  {showBalance ? getFormattedBalance(currentAccount) : getMaskedBalance(currentAccount)}
                </div>
                <div className="eye-btn" onClick={() => setShowBalance(!showBalance)}>
                  <EyeIcon visible={showBalance} />
                </div>
              </div>
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
        // Show waiting screen if deposit is pending
        if (depositPending) {
          return (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Spinner />
              <div style={{ 
                fontSize: '15px', 
                fontWeight: 600, 
                marginBottom: '12px',
                color: '#F8FAFC'
              }}>
                Please wait for the payment prompt on your phone and enter your PIN to complete the transaction.
              </div>
              <button 
                onClick={() => setDepositPending(false)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                OK
              </button>
            </div>
          );
        }

        return (
          <>
            <KenyaDisclaimer>
              This service is available exclusively in Kenya. Only M-Pesa and Airtel Money mobile wallets are supported.
            </KenyaDisclaimer>

            <WalletInfo>
              If your deposited funds are not visible for trading, kindly log into your Deriv account and transfer them from your main wallet to your Options wallet.
            </WalletInfo>

            <FormGroup>
              <label>Deposit to</label>
              <div className="input-wrap">
                <span className="prefix" style={{ fontSize: '11px', fontWeight: '500' }}>Wallet</span>
                <input 
                  type="text" 
                  value="Deriv Main Wallet"
                  disabled
                  style={{ fontWeight: '600', opacity: 0.7 }}
                />
              </div>
            </FormGroup>

            <MobileNetworkSelector>
              <div 
                className={`network-option mpesa ${selectedNetwork === 'mpesa' ? 'selected' : ''}`}
                onClick={() => setSelectedNetwork('mpesa')}
              >
                <div className="network-icon"><MPesaIcon /></div>
                <div className="network-name">M-Pesa</div>
                <div className="network-tagline">Fast & Secure</div>
              </div>
              <div 
                className={`network-option airtel ${selectedNetwork === 'airtel' ? 'selected' : ''}`}
                onClick={() => setSelectedNetwork('airtel')}
              >
                <div className="network-icon"><AirtelIcon /></div>
                <div className="network-name">Airtel Money</div>
                <div className="network-tagline">Instant Transfer</div>
              </div>
            </MobileNetworkSelector>

            <FormGroup>
              <label>Phone Number (starting with 1 or 7)</label>
              <div className="input-wrap">
                <span className="prefix">+254</span>
                <input 
                  type="tel" 
                  placeholder="1XX or 7XX XXX XXX" 
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={9}
                />
              </div>
              <div className="helper-text">Enter your {networkName} phone number (9 digits, must start with 1 or 7)</div>
            </FormGroup>

            <FormGroup>
              <label>Amount (USD) - Min $1 / Max $2,000</label>
              <div className="input-wrap">
                <span className="prefix">$</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={handleAmountChange}
                  min="1"
                  max="2000"
                  step="0.01"
                />
                <span className="suffix">≈ KES {(parseFloat(amount || 0) * rate).toFixed(0)}</span>
              </div>
              <div className="helper-text">Exchange rate: 1 USD = {rate} KES</div>
            </FormGroup>

            <ActionButton 
              onClick={handleSubmitDeposit} 
              disabled={!amount || parseFloat(amount) < 1 || parseFloat(amount) > 2000 || !phoneNumber || phoneNumber.length !== 9}
            >
              Deposit to Deriv
            </ActionButton>
          </>
        );

      case 'withdraw':
        // Show confirmation step inside the withdrawal modal
        if (withdrawConfirmationStep && withdrawConfirmationData) {
          const confirmNetworkName = withdrawConfirmationData.network === 'mpesa' ? 'M-Pesa' : 'Airtel Money';
          return (
            <div>
              <KenyaDisclaimer>
                Please confirm your phone number before proceeding.
              </KenyaDisclaimer>
              
              {/* Theme‑aware confirmation message – no hardcoded background */}
              <ConfirmationMessage>
                Kindly re-enter your phone number to ensure it is correct before proceeding with your ${withdrawConfirmationData.amount} withdrawal.
              </ConfirmationMessage>

              <FormGroup>
                <label>Selected Network</label>
                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: withdrawConfirmationData.network === 'mpesa' 
                    ? 'linear-gradient(135deg, #28A745 0%, #20C997 100%)' 
                    : 'linear-gradient(135deg, #E53935 0%, #FF5252 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 600
                }}>
                  <span>{withdrawConfirmationData.network === 'mpesa' ? <MPesaIcon /> : <AirtelIcon />}</span>
                  {confirmNetworkName}
                </div>
              </FormGroup>
              <FormGroup>
                <label>Re-enter Phone Number (starting with 1 or 7)</label>
                <div className="input-wrap">
                  <span className="prefix">+254</span>
                  <input 
                    type="tel" 
                    placeholder="1XX or 7XX XXX XXX" 
                    value={confirmationPhone}
                    onChange={handleConfirmationPhoneChange}
                    maxLength={9}
                  />
                </div>
                <div className="helper-text">Must match the number you entered earlier</div>
                {confirmationError && <div className="error-text">{confirmationError}</div>}
              </FormGroup>
              <ActionButton 
                onClick={handleConfirmWithdraw}
                disabled={confirmationPhone.length !== 9}
              >
                Confirm Withdrawal
              </ActionButton>
              <button 
                onClick={() => setWithdrawConfirmationStep(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            </div>
          );
        }

        return (
          <>
            <KenyaDisclaimer>
              This service is available exclusively in Kenya. Only M-Pesa and Airtel Money mobile wallets are supported.
            </KenyaDisclaimer>

            <WalletInfo>
              If your available balance appears incorrect, kindly log into your Deriv account and transfer funds from your Options wallet to your main wallet before proceeding.
            </WalletInfo>

            <FormGroup>
              <label>Withdraw From</label>
              <div className="input-wrap">
                <span className="prefix" style={{ fontSize: '11px', fontWeight: '500' }}>Wallet</span>
                <input 
                  type="text" 
                  value="Deriv Main Wallet"
                  disabled
                  style={{ fontWeight: '600', opacity: 0.7 }}
                />
                <span className="suffix">{getFormattedBalance(currentAccount)}</span>
              </div>
            </FormGroup>

            <MobileNetworkSelector>
              <div 
                className={`network-option mpesa ${selectedNetwork === 'mpesa' ? 'selected' : ''}`}
                onClick={() => setSelectedNetwork('mpesa')}
              >
                <div className="network-icon"><MPesaIcon /></div>
                <div className="network-name">M-Pesa</div>
                <div className="network-tagline">Fast & Secure</div>
              </div>
              <div 
                className={`network-option airtel ${selectedNetwork === 'airtel' ? 'selected' : ''}`}
                onClick={() => setSelectedNetwork('airtel')}
              >
                <div className="network-icon"><AirtelIcon /></div>
                <div className="network-name">Airtel Money</div>
                <div className="network-tagline">Instant Transfer</div>
              </div>
            </MobileNetworkSelector>

            <FormGroup>
              <label>Mobile Wallet Number (starting with 1 or 7)</label>
              <div className="input-wrap">
                <span className="prefix">+254</span>
                <input 
                  type="tel" 
                  placeholder="1XX or 7XX XXX XXX" 
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={9}
                />
              </div>
              <div className="helper-text">Enter your {networkName} wallet number (9 digits, starts with 1 or 7)</div>
            </FormGroup>

            <FormGroup>
              <label>Amount to Withdraw (USD) - Min $1 / Max $2,000</label>
              <div className="input-wrap">
                <span className="prefix">$</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={handleAmountChange}
                  min="1"
                  max="2000"
                  step="0.01"
                />
                <span className="suffix">≈ KES {(parseFloat(amount || 0) * rate).toFixed(0)}</span>
              </div>
              <div className="helper-text">Exchange rate: 1 USD = {rate} KES</div>
            </FormGroup>

            <ActionButton 
              onClick={handleSubmitWithdraw} 
              disabled={!amount || parseFloat(amount) < 1 || parseFloat(amount) > 2000 || !phoneNumber || phoneNumber.length !== 9}
            >
              Withdraw to Mobile Wallet
            </ActionButton>
          </>
        );

      case 'history':
        return (
          <>
            <HistoryFilter>
              <button className="filter-btn active" onClick={(e) => { e.currentTarget.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); e.currentTarget.classList.add('active'); }}>All</button>
              <button className="filter-btn" onClick={(e) => { e.currentTarget.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); e.currentTarget.classList.add('active'); }}>Deposits</button>
              <button className="filter-btn" onClick={(e) => { e.currentTarget.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); e.currentTarget.classList.add('active'); }}>Withdrawals</button>
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
          {/* 1. THEME BUTTON */}
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

          {/* 2. FUNDS BUTTON */}
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
                  onClick={() => handleFundAction(option.action)}
                >
                  <span className="fund-icon">{option.icon}</span>
                  <span className="fund-info">
                    <span className="fund-name">{option.name}</span>
                    <span className="fund-desc">{option.desc}</span>
                  </span>
                </FundsOption>
              ))}
            </GlassDropdownMenu>
          </DropdownContainer>

          {/* 3. ACCOUNT BADGE */}
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

      {/* FUNDS MODAL - Transparent background */}
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