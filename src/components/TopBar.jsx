// src/components/TopBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// ANIMATION KEYFRAMES - ELEVATED
// ============================================
const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.8); opacity: 0; }
`;

const rotateIn = keyframes`
  from { transform: rotate(0deg) scale(0.8); opacity: 0; }
  to { transform: rotate(360deg) scale(1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.4); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-12px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ============================================
// PREMIUM SVG ICONS - REFINED
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
    <line x1="8" y1="15" x2="16" y2="15" />
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
    <polyline points="1 6 10.5 15.5 15.5 10.5 23 18" />
    <polyline points="7 6 1 6 1 12" />
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
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
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

const MusicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="6 4 20 12 6 20 6 4" />
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="4 4 18 12 4 20 4 4" />
  </svg>
);

const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="20 4 6 12 20 20 20 4" />
  </svg>
);

// ============================================
// FUNDS MODAL - PREMIUM DESIGN WITH CLEAR TRANSPARENT BACKGROUND
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.12); /* Very light transparent overlay */
  backdrop-filter: blur(4px); /* Subtle blur for legibility */
  -webkit-backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 460px;
  max-height: 85vh;
  background: ${p => p.theme.colors?.surface || '#0F172A'};
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 24px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset;
  animation: ${slideUp} 0.35s cubic-bezier(0.16, 1, 0.3, 1);
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
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.12)'};
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
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
    background: ${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
      background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
      transform: rotate(90deg) scale(1.05);
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
    background: ${p => p.theme.colors?.scrollbar || 'rgba(255,255,255,0.12)'}; 
    border-radius: 10px; 
  }
  &::-webkit-scrollbar-track { background: transparent; }
`;

const KenyaDisclaimer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${p => p.theme.colors?.warningBg || 'rgba(251,191,36,0.08)'};
  border: 1px solid ${p => p.theme.colors?.warningBorder || 'rgba(251,191,36,0.12)'};
  margin-bottom: 14px;
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.theme.colors?.warningText || '#F8FAFC'};
  line-height: 1.4;

  &:before {
    content: '🇰🇪';
    font-size: 18px;
  }
`;

const WalletInfo = styled.div`
  padding: 10px 14px;
  border-radius: 10px;
  background: ${p => p.theme.colors?.infoBg || 'rgba(59,130,246,0.06)'};
  border: 1px solid ${p => p.theme.colors?.infoBorder || 'rgba(59,130,246,0.1)'};
  margin-bottom: 14px;
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.theme.colors?.infoText || '#93C5FD'};
  line-height: 1.4;
`;

const ConfirmationMessage = styled.div`
  text-align: center;
  margin-bottom: 16px;
  padding: 14px 16px;
  border-radius: 10px;
  background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'};
  color: ${p => p.theme.colors?.accent || '#3B82F6'};
  font-weight: 600;
  font-size: 13px;
  line-height: 1.6;
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
`;

const SuccessOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1); /* Very transparent */
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: ${fadeIn} 0.3s ease;
  border-radius: 24px;
  padding: 20px;
`;

const SuccessCard = styled.div`
  background: ${p => p.theme.colors?.surface || '#0F172A'};
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.1)'};
  border-radius: 24px;
  padding: 48px 32px 36px;
  text-align: center;
  max-width: 320px;
  width: 100%;
  box-shadow: 0 40px 60px rgba(0,0,0,0.5);
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  .check-icon {
    color: #22C55E;
    margin-bottom: 28px;
    display: flex;
    justify-content: center;
    animation: ${breathe} 2s ease-in-out infinite;

    svg {
      filter: drop-shadow(0 4px 16px rgba(34,197,94,0.3));
    }
  }

  .success-title {
    font-size: 24px;
    font-weight: 800;
    color: ${p => p.theme.colors?.text || '#F8FAFC'};
    margin-bottom: 12px;
  }

  .success-detail {
    font-size: 14px;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-bottom: 32px;
    line-height: 1.8;
    font-weight: 500;
  }

  .close-button {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    background: linear-gradient(135deg, #22C55E, #16A34A);
    color: #fff;
    border: none;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(34,197,94,0.4);
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 14px;

  label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    background: ${p => p.theme.colors?.inputBg || 'rgba(255,255,255,0.03)'};
    border: 1.5px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
    border-radius: 12px;
    padding: 0 14px;
    transition: all 0.25s ease;

    &:focus-within {
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      box-shadow: 0 0 0 4px ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
      background: ${p => p.theme.colors?.inputFocusBg || 'rgba(255,255,255,0.06)'};
    }

    .prefix {
      font-size: 13px;
      font-weight: 600;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      margin-right: 8px;
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
        opacity: 0.4;
      }

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      &[type='number'] {
        -moz-appearance: textfield;
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

  .error-text {
    font-size: 11px;
    color: #EF4444;
    margin-top: 4px;
    font-weight: 500;
  }
`;

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
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 40px ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.3)'};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
    pointer-events: none;
  }
`;

const OverviewBalance = styled.div`
  background: linear-gradient(
    135deg, 
    ${p => p.theme.colors?.accent || '#3B82F6'}, 
    ${p => p.theme.colors?.accentDark || '#1D4ED8'}
  );
  border-radius: 16px;
  padding: 24px 24px;
  margin-bottom: 16px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 600;
  }

  .nickname {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
    font-family: 'Courier New', monospace;
    margin-bottom: 8px;
  }

  .balance-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 4px;
  }

  .balance {
    font-size: 36px;
    font-weight: 800;
    color: #FFFFFF;
    font-family: 'Courier New', monospace;
    letter-spacing: -1px;
  }

  .eye-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px;
    padding: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #FFFFFF;

    &:hover {
      background: rgba(255,255,255,0.25);
      transform: scale(1.05);
    }
  }

  .sub {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 6px;
    font-weight: 500;
  }
`;

const OverviewStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;

  .stat {
    text-align: center;
    padding: 14px 8px;
    border-radius: 12px;
    background: ${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'};
    transition: all 0.2s ease;

    &:hover {
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.05)'};
    }

    .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: ${p => p.theme.colors?.text || '#F8FAFC'};
      font-family: 'Courier New', monospace;
    }

    .stat-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      margin-top: 4px;
      font-weight: 600;
    }
  }
`;

const RecentTransactions = styled.div`
  .section-title {
    font-size: 11px;
    font-weight: 700;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 10px;
  }

  .tx-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    border-bottom: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'};
    transition: all 0.2s ease;

    &:hover {
      background: ${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
    }

    &:last-child { border-bottom: none; }

    .tx-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 10px;
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
        font-weight: 500;
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
        border-radius: 10px;
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
          font-weight: 500;
        }
        .h-reference {
          font-size: 10px;
          color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
          font-family: 'Courier New', monospace;
          opacity: 0.7;
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
// CORE CONTAINERS - ELEGANT
// ============================================
const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 32px;
  background: ${props => props.theme?.colors?.surface || '#0b0f19'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 72px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${props => props.theme?.colors?.accent || '#3B82F6'}40, transparent);
  }

  @media (max-width: 1024px) {
    padding: 10px 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 10px 16px;
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

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 200px;

  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    flex: none;
    justify-content: center;
    padding-top: 4px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    order: 2;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const GlassDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 300px;
  max-width: 90vw;
  max-height: 460px;
  overflow-y: auto;
  background: rgba(15, 17, 23, 0.65); /* More transparent */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${props => props.theme?.colors?.glassBorder || 'rgba(255,255,255,0.06)'};
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 30px 60px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02) inset;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.96)'};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 300;
  overflow: hidden;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
`;

const PlatformDropdown = styled(GlassDropdownMenu)`
  min-width: 160px;
  left: 0;
  right: auto;
`;

const MenuHeader = styled.div`
  padding: 6px 12px 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  margin-bottom: 4px;
`;

const IconThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.03)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  padding: 0;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 24px ${props => (props.theme?.colors?.accent || '#3b82f6') + '25'};
    transform: translateY(-1px);

    .theme-icon {
      animation: ${rotateIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  .theme-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    transition: all 0.3s ease;
  }
`;

const ThemeOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
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

  .color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .theme-label {
    flex: 1;
  }

  .check-mark {
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    font-weight: 700;
    font-size: 14px;
  }
`;

const FundsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 18px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme?.colors?.accent || '#3b82f6'};
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%);
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.1) 100%);
    box-shadow: 0 0 30px ${props => (props.theme?.colors?.accent || '#3b82f6') + '25'};
    transform: translateY(-1px);
    border-color: ${props => props.theme?.colors?.accentHover || '#2563EB'};
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
    font-size: 13px;
    font-weight: 700;
  }

  .funds-sub {
    font-size: 9px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .arrow {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease, color 0.3s ease;
    opacity: 0.6;
    margin-left: 4px;
  }

  @media (max-width: 480px) {
    padding: 5px 12px;
    .funds-sub { display: none; }
    .funds-title { font-size: 11px; }
    gap: 6px;
  }
`;

const FundsOption = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 13px;
  font-weight: 600;

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.06)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .fund-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
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
  gap: 10px;
  padding: 7px 16px;
  background: ${props => props.theme?.colors?.surface || 'rgba(15, 23, 42, 0.5)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#ffffff'};

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 30px ${props => (props.theme?.colors?.accent || '#3b82f6') + '15'};
    transform: translateY(-1px);
  }

  .flag-badge { font-size: 18px; }
  .balance-display { font-weight: 700; }
  .account-type-badge {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 2px 10px;
    border-radius: 6px;
    background: ${props => props.isDemo ? 'rgba(59,130,246,0.12)' : 'rgba(52,211,153,0.12)'};
    color: ${props => props.isDemo ? '#60a5fa' : '#34d399'};
    border: 1px solid ${props => props.isDemo ? 'rgba(59,130,246,0.2)' : 'rgba(52,211,153,0.2)'};
    margin-left: 4px;
  }
  .currency-tag {
    font-size: 9px;
    padding: 2px 8px;
    border-radius: 6px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.12)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    font-weight: 800;
  }
  .chevron { display: flex; align-items: center; opacity: 0.5; }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 12px;
    gap: 6px;
    .flag-badge { font-size: 14px; }
    .currency-tag { font-size: 8px; padding: 1px 6px; }
    .account-type-badge { font-size: 8px; padding: 1px 6px; }
    .balance-display { font-size: 12px; }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 14px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 10px;
  background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 12px;
  font-weight: 500;
  outline: none;
  transition: all 0.2s ease;
  margin-bottom: 6px;

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
  gap: 12px;
  padding: 8px 14px;
  border-radius: 10px;
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

  .flag { font-size: 18px; }
  .code { font-weight: 700; min-width: 32px; }
  .name { flex: 1; font-weight: 500; font-size: 11px; color: ${props => props.theme?.colors?.textMuted || '#94a3b8'}; }
  .check { color: ${props => props.theme?.colors?.accent || '#3b82f6'}; font-weight: 700; }
`;

const CurrencyList = styled.div`
  max-height: 180px;
  overflow-y: auto;
  margin-top: 4px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
`;

const ExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  background: ${props => props.theme?.colors?.surface || 'transparent'};
  color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    background: ${props => (props.theme?.colors?.danger || '#ef4444') + '12'};
    transform: translateX(-2px) scale(0.98);

    .exit-icon { stroke: ${props => props.theme?.colors?.danger || '#ef4444'}; }
  }

  .exit-icon {
    width: 16px;
    height: 16px;
    transition: stroke 0.3s ease;
  }

  @media (max-width: 480px) {
    padding: 5px 12px;
    font-size: 11px;
    .exit-icon { width: 14px; height: 14px; }
  }
`;

const THEME_OPTIONS = [
  { key: 'white', name: 'White', color: '#f4f6f9' },
  { key: 'dark', name: 'Dark', color: '#09090b' },
  { key: 'gold', name: 'Gold', color: '#0b0a08' },
  { key: 'forest', name: 'Forest', color: '#050c09' },
  { key: 'ocean', name: 'Ocean', color: '#030b12' },
  { key: 'red', name: 'Red', color: '#0c0505' },
  { key: 'orange', name: 'Orange', color: '#0c0703' },
];

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto 16px;
`;

// ============================================
// MUSIC PLAYER - PREMIUM DESIGN
// ============================================
const MusicPlayerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.theme.colors?.surface || '#1a1f2e'};
  border: 1px solid ${props => props.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 40px;
  padding: 6px 18px 6px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.25);
    border-color: ${props => props.theme.colors?.accent || '#3B82F6'}40;
  }

  .music-label {
    font-size: 10px;
    font-weight: 700;
    color: ${props => props.theme.colors?.textMuted || '#94a3b8'};
    text-transform: uppercase;
    letter-spacing: 0.8px;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  .label-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors?.accent || '#3B82F6'};
  }

  @media (max-width: 600px) {
    padding: 4px 12px;
    gap: 6px;
    .music-label { font-size: 8px; }
  }
`;

const MusicDropdownButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  color: ${props => props.theme.colors?.text || '#ffffff'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  padding: 4px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors?.accent || '#3B82F6'};
    background: ${props => props.theme.colors?.accentLight || 'rgba(59,130,246,0.05)'};
  }

  @media (max-width: 600px) {
    max-width: 100px;
    font-size: 10px;
    padding: 2px 8px;
  }
`;

const MusicDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors?.surface || '#0F172A'};
  border: 1px solid ${props => props.theme.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 16px;
  width: 340px;
  max-height: 420px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 30px 60px rgba(0,0,0,0.4);
  padding: 14px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }

  @media (max-width: 400px) {
    width: 300px;
  }
`;

const MusicSearchInput = styled.input`
  width: 100%;
  padding: 8px 14px;
  border: 1px solid ${props => props.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 10px;
  background: ${props => props.theme.colors?.background || 'rgba(255,255,255,0.02)'};
  color: ${props => props.theme.colors?.text || '#ffffff'};
  font-size: 12px;
  margin-bottom: 8px;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors?.accent || '#3B82F6'};
  }
`;

const MusicResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.theme.colors?.accentLight || 'rgba(59,130,246,0.06)'};
  }

  .thumb {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: ${props => props.theme.colors?.border || 'rgba(255,255,255,0.06)'};
    object-fit: cover;
    flex-shrink: 0;
  }

  .music-note-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: ${props => props.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors?.accent || '#3B82F6'};
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    .title {
      font-size: 12px;
      font-weight: 600;
      color: ${props => props.theme.colors?.text || '#ffffff'};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .channel {
      font-size: 10px;
      color: ${props => props.theme.colors?.textMuted || '#94a3b8'};
    }
  }

  &.active {
    background: ${props => props.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    border-left: 3px solid ${props => props.theme.colors?.accent || '#3B82F6'};
    padding-left: 9px;
  }
`;

const MusicControlButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors?.text || '#ffffff'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background: ${props => props.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    color: ${props => props.theme.colors?.accent || '#3B82F6'};
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    width: 24px;
    height: 24px;
    svg { width: 14px; height: 14px; }
  }
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 60px;
  height: 3px;
  border-radius: 2px;
  background: ${props => props.theme.colors?.border || 'rgba(255,255,255,0.1)'};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.theme.colors?.accent || '#3B82F6'};
    cursor: pointer;
    border: 2px solid ${props => props.theme.colors?.surface || '#0F172A'};
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.theme.colors?.accent || '#3B82F6'};
    cursor: pointer;
    border: 2px solid ${props => props.theme.colors?.surface || '#0F172A'};
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  @media (max-width: 600px) {
    width: 40px;
  }
`;

const YOUTUBE_API_KEY = 'YOUR_API_KEY_HERE';

const musicFiles = import.meta.glob('../assets/music/*.mp3', { eager: true, import: 'default' });

const localTracks = Object.entries(musicFiles)
  .map(([path, url]) => {
    const fileName = path.split('/').pop() || path;
    const title = fileName.replace(/\.mp3$/, '');
    return { title, src: url };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

const MusicPlayer = () => {
  const [currentSource, setCurrentSource] = useState('local');
  const [currentLocalIndex, setCurrentLocalIndex] = useState(0);
  const [currentYoutubeVideoId, setCurrentYoutubeVideoId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(localTracks[0]?.title || 'Select Song');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const audioRef = useRef(null);
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = () => createYoutubePlayer();
      document.head.appendChild(tag);
    } else {
      createYoutubePlayer();
    }
    return () => {
      if (playerRef.current) playerRef.current.destroy();
    };
  }, []);

  const createYoutubePlayer = () => {
    if (playerContainerRef.current && window.YT && !playerRef.current) {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '0',
        width: '0',
        playerVars: { controls: 0, autoplay: 0 },
        events: {
          onReady: (e) => e.target.setVolume(volume * 100),
          onStateChange: (e) => {
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
            if (e.data === window.YT.PlayerState.PLAYING && playerRef.current) {
              const data = playerRef.current.getVideoData();
              if (data && data.title) setCurrentTitle(data.title);
            }
          },
        },
      });
    }
  };

  const playLocalTrack = (index) => {
    if (audioRef.current) {
      audioRef.current.src = localTracks[index].src;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    setCurrentLocalIndex(index);
    setCurrentTitle(localTracks[index].title);
    setCurrentSource('local');
    if (playerRef.current) playerRef.current.pauseVideo();
  };

  const playYoutubeVideo = (videoId, title) => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
      playerRef.current.setVolume(volume * 100);
    }
    setCurrentYoutubeVideoId(videoId);
    setCurrentTitle(title);
    setCurrentSource('youtube');
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentSource === 'local') {
      const nextIndex = (currentLocalIndex + 1) % localTracks.length;
      playLocalTrack(nextIndex);
    } else if (playerRef.current) {
      playerRef.current.nextVideo();
    }
  };

  const handlePrev = () => {
    if (currentSource === 'local') {
      const prevIndex = (currentLocalIndex - 1 + localTracks.length) % localTracks.length;
      playLocalTrack(prevIndex);
    } else if (playerRef.current) {
      playerRef.current.previousVideo();
    }
  };

  const togglePlay = () => {
    if (currentSource === 'local') {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      }
    } else if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
    if (playerRef.current) playerRef.current.setVolume(vol * 100);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || YOUTUBE_API_KEY === 'YOUR_API_KEY_HERE') return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(searchQuery)}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      if (data.items) setSearchResults(data.items);
    } catch (error) {
      console.error('YouTube search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocalEnded = () => {
    handleNext();
  };

  return (
    <MusicPlayerContainer>
      <div className="music-label">
        <span className="label-icon"><MusicIcon /></span>
        <span>Music</span>
      </div>

      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <MusicDropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {currentTitle.length > 20 ? currentTitle.substring(0, 18) + '...' : currentTitle}
          <ChevronDownIcon open={isDropdownOpen} />
        </MusicDropdownButton>

        <MusicDropdownMenu isOpen={isDropdownOpen}>
          <div style={{ marginBottom: 8, fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
            Search YouTube
          </div>
          <MusicSearchInput
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button
              onClick={handleSearch}
              style={{
                background: 'transparent',
                border: '1px solid #3b82f6',
                color: '#3b82f6',
                padding: '4px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(59,130,246,0.1)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
            >
              Search
            </button>
          </div>

          {isSearching && <div style={{ textAlign: 'center', padding: 12, fontSize: 12, color: '#94a3b8' }}>Searching...</div>}

          {searchResults.length > 0 && (
            <>
              <div style={{ marginTop: 8, marginBottom: 8, fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
                Results
              </div>
              {searchResults.map(item => (
                <MusicResultItem key={item.id.videoId} onClick={() => playYoutubeVideo(item.id.videoId, item.snippet.title)}>
                  <img className="thumb" src={item.snippet.thumbnails.default.url} alt="" />
                  <div className="info">
                    <div className="title">{item.snippet.title}</div>
                    <div className="channel">{item.snippet.channelTitle}</div>
                  </div>
                </MusicResultItem>
              ))}
            </>
          )}

          {localTracks.length > 0 && (
            <>
              <div style={{ marginTop: 12, marginBottom: 8, fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
                Favourites
              </div>
              {localTracks.map((track, index) => (
                <MusicResultItem
                  key={track.src}
                  className={currentSource === 'local' && index === currentLocalIndex ? 'active' : ''}
                  onClick={() => playLocalTrack(index)}
                >
                  <div className="music-note-icon"><MusicIcon /></div>
                  <div className="info">
                    <div className="title">{track.title}</div>
                  </div>
                </MusicResultItem>
              ))}
            </>
          )}
          {localTracks.length === 0 && (
            <div style={{ padding: 12, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
              No local songs found. Add .mp3 files to src/assets/music/
            </div>
          )}
        </MusicDropdownMenu>
      </div>

      <MusicControlButton onClick={handlePrev} aria-label="Previous">
        <PrevIcon />
      </MusicControlButton>
      <MusicControlButton onClick={togglePlay} aria-label="Play/Pause">
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </MusicControlButton>
      <MusicControlButton onClick={handleNext} aria-label="Next">
        <NextIcon />
      </MusicControlButton>

      <VolumeIcon />
      <VolumeSlider
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />

      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        onEnded={handleLocalEnded}
      />
      <div ref={playerContainerRef} style={{ display: 'none' }} />
    </MusicPlayerContainer>
  );
};

// ============================================
// BRAND COMPONENTS - REFINED
// ============================================
const BrandContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BrandText = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 800;
  user-select: none;
  cursor: default;
  gap: 4px;
  
  .voltix {
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    letter-spacing: -0.5px;
  }
`;

const PlatformSelector = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #ff444f;
  font-style: italic;
  font-weight: 900;
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }

  .chevron {
    display: flex;
    align-items: center;
    color: inherit;
    transition: transform 0.2s;
  }
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${props => props.connected ? '#10b981' : '#ef4444'};
    box-shadow: 0 0 10px ${props => props.connected ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'};
    animation: ${props => props.connected ? breathe : ''} 2s ease-in-out infinite;
  }

  .status-text {
    font-size: 10px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
  background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 24px ${props => (props.theme?.colors?.accent || '#3b82f6') + '20'};
  }

  &:active {
    transform: scale(0.94);
  }

  .line {
    display: block;
    height: 2px;
    background: ${props => props.theme?.colors?.text || '#ffffff'};
    border-radius: 4px;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

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
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [platform, setPlatform] = useState('deriv');
  const [connected, setConnected] = useState(true);
  const [accountType, setAccountType] = useState('real');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [currencySearch, setCurrencySearch] = useState('');
  
  const [fundModalAction, setFundModalAction] = useState(null);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showBalance, setShowBalance] = useState(false);

  const [withdrawConfirmationStep, setWithdrawConfirmationStep] = useState(false);
  const [withdrawConfirmationData, setWithdrawConfirmationData] = useState(null);
  const [confirmationPhone, setConfirmationPhone] = useState('');
  const [confirmationError, setConfirmationError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const [depositPending, setDepositPending] = useState(false);
  
  const dropdownRef = useRef(null);
  const themeRef = useRef(null);
  const fundsRef = useRef(null);
  const platformRef = useRef(null);
  const navigate = useNavigate();

  const DEPOSIT_RATE = 131;
  const WITHDRAW_RATE = 126;

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
    setIsPlatformOpen(false);
  };

  const toggleThemeDropdown = () => {
    setIsThemeOpen(!isThemeOpen);
    setIsDropdownOpen(false);
    setIsFundsOpen(false);
    setIsPlatformOpen(false);
  };

  const toggleFundsDropdown = () => {
    setIsFundsOpen(!isFundsOpen);
    setIsDropdownOpen(false);
    setIsThemeOpen(false);
    setIsPlatformOpen(false);
  };

  const togglePlatformDropdown = () => {
    setIsPlatformOpen(!isPlatformOpen);
    setIsDropdownOpen(false);
    setIsThemeOpen(false);
    setIsFundsOpen(false);
  };

  const closeModal = () => {
    setFundModalAction(null);
    setShowBalance(false);
    setWithdrawConfirmationStep(false);
    setWithdrawConfirmationData(null);
    setConfirmationPhone('');
    setConfirmationError('');
    setWithdrawSuccess(false);
    setDepositPending(false);
  };

  const handleFundAction = (action) => {
    setIsFundsOpen(false);
    setFundModalAction(action);
    if (action === 'deposit' || action === 'withdraw') {
      setAmount('');
      setPhoneNumber('');
      setWithdrawConfirmationStep(false);
      setWithdrawSuccess(false);
    } else if (action === 'overview') {
      setShowBalance(false);
    }
  };

  const handleSubmitDeposit = () => {
    setDepositPending(true);
  };

  const handleSubmitWithdraw = () => {
    setWithdrawConfirmationStep(true);
    setWithdrawConfirmationData({
      amount: amount,
      originalPhone: phoneNumber,
    });
  };

  const handleConfirmWithdraw = () => {
    if (confirmationPhone !== withdrawConfirmationData.originalPhone) {
      setConfirmationError('Phone numbers do not match. Please try again.');
      return;
    }
    setWithdrawSuccess(true);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
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
      if (platformRef.current && !platformRef.current.contains(e.target)) {
        setIsPlatformOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeThemeObj = THEME_OPTIONS.find(t => t.key === currentTheme) || THEME_OPTIONS[0];

  const fundOptions = [
    { icon: <OverviewIcon />, name: 'Overview', desc: 'View your balance and activity', action: 'overview' },
    { icon: <DepositIcon />, name: 'Deposit', desc: 'Add funds via M‑Pesa', action: 'deposit' },
    { icon: <WithdrawIcon />, name: 'Withdraw', desc: 'Withdraw to M‑Pesa', action: 'withdraw' },
    { icon: <HistoryIcon />, name: 'History', desc: 'View transaction history', action: 'history' },
  ];

  const sampleTransactions = [
    { id: 1, type: 'deposit', name: 'Deposit via M-Pesa', date: 'Today, 10:23 AM', amount: 50.00, positive: true, ref: 'MP-2024-00123' },
    { id: 2, type: 'withdraw', name: 'Withdrawal to M-Pesa', date: 'Yesterday, 3:15 PM', amount: 20.00, positive: false, ref: 'WD-2024-00456' },
  ];

  const renderModalContent = () => {
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
        if (depositPending) {
          return (
            <div style={{ textAlign: 'center', padding: '30px 0 20px' }}>
              <Spinner />
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#F8FAFC' }}>
                Please wait for the payment prompt on your phone and enter your PIN to complete the transaction.
              </div>
              <button 
                onClick={() => setDepositPending(false)}
                style={{ padding: '10px 24px', borderRadius: '10px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => e.target.style.background = '#2563EB'}
                onMouseLeave={(e) => e.target.style.background = '#3B82F6'}
              >
                OK, I understand
              </button>
            </div>
          );
        }

        return (
          <>
            <KenyaDisclaimer>This service is available exclusively in Kenya. Only M‑Pesa mobile wallet is supported.</KenyaDisclaimer>
            <WalletInfo>If your deposited funds are not visible for trading, kindly log into your Deriv account and transfer them from your main wallet to your Options wallet.</WalletInfo>
            <FormGroup>
              <label>Deposit to</label>
              <div className="input-wrap">
                <span className="prefix" style={{ fontSize: '11px', fontWeight: '500' }}>Wallet</span>
                <input type="text" value="Deriv Main Wallet" disabled style={{ fontWeight: '600', opacity: 0.6 }} />
              </div>
            </FormGroup>
            <FormGroup>
              <label>M‑Pesa Phone Number (starting with 1 or 7)</label>
              <div className="input-wrap">
                <span className="prefix">+254</span>
                <input type="tel" placeholder="1XX or 7XX XXX XXX" value={phoneNumber} onChange={handlePhoneChange} maxLength={9} />
              </div>
              <div className="helper-text">Enter your M‑Pesa registered phone number (9 digits, must start with 1 or 7)</div>
            </FormGroup>
            <FormGroup>
              <label>Amount (USD) - Min $1 / Max $2,000</label>
              <div className="input-wrap">
                <span className="prefix">$</span>
                <input type="number" placeholder="0.00" value={amount} onChange={handleAmountChange} min="1" max="2000" step="0.01" />
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
        if (withdrawSuccess) {
          const kesAmount = withdrawConfirmationData ? (parseFloat(withdrawConfirmationData.amount) * WITHDRAW_RATE).toFixed(0) : '0';
          return (
            <SuccessOverlay>
              <SuccessCard>
                <div className="check-icon"><CheckmarkIcon size={72} /></div>
                <div className="success-title">Request Submitted</div>
                <div className="success-detail">
                  Your withdrawal of <strong>${withdrawConfirmationData.amount}</strong> to M‑Pesa <strong>+254{withdrawConfirmationData.originalPhone}</strong> has been received.<br />
                  ≈ KES {kesAmount}
                </div>
                <button className="close-button" onClick={closeModal}>Close</button>
              </SuccessCard>
            </SuccessOverlay>
          );
        }

        if (withdrawConfirmationStep && withdrawConfirmationData) {
          return (
            <div>
              <KenyaDisclaimer>Please confirm your phone number before proceeding.</KenyaDisclaimer>
              <ConfirmationMessage>
                Kindly re-enter your phone number to ensure it is correct before proceeding with your ${withdrawConfirmationData.amount} withdrawal.
              </ConfirmationMessage>
              <FormGroup>
                <label>Re-enter M‑Pesa Phone Number (starting with 1 or 7)</label>
                <div className="input-wrap">
                  <span className="prefix">+254</span>
                  <input type="tel" placeholder="1XX or 7XX XXX XXX" value={confirmationPhone} onChange={handleConfirmationPhoneChange} maxLength={9} />
                </div>
                <div className="helper-text">Must match the number you entered earlier</div>
                {confirmationError && <div className="error-text">{confirmationError}</div>}
              </FormGroup>
              <ActionButton onClick={handleConfirmWithdraw} disabled={confirmationPhone.length !== 9}>
                Confirm Withdrawal
              </ActionButton>
              <button 
                onClick={() => setWithdrawConfirmationStep(false)}
                style={{ width: '100%', padding: '12px', marginTop: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#94A3B8', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                Back
              </button>
            </div>
          );
        }

        return (
          <>
            <KenyaDisclaimer>This service is available exclusively in Kenya. Only M‑Pesa mobile wallet is supported.</KenyaDisclaimer>
            <WalletInfo>If your available balance appears incorrect, kindly log into your Deriv account and transfer funds from your Options wallet to your main wallet before proceeding.</WalletInfo>
            <FormGroup>
              <label>Withdraw From</label>
              <div className="input-wrap">
                <span className="prefix" style={{ fontSize: '11px', fontWeight: '500' }}>Wallet</span>
                <input type="text" value="Deriv Main Wallet" disabled style={{ fontWeight: '600', opacity: 0.6 }} />
                <span className="suffix">{getFormattedBalance(currentAccount)}</span>
              </div>
            </FormGroup>
            <FormGroup>
              <label>M‑Pesa Wallet Number (starting with 1 or 7)</label>
              <div className="input-wrap">
                <span className="prefix">+254</span>
                <input type="tel" placeholder="1XX or 7XX XXX XXX" value={phoneNumber} onChange={handlePhoneChange} maxLength={9} />
              </div>
              <div className="helper-text">Enter your M‑Pesa wallet number (9 digits, starts with 1 or 7)</div>
            </FormGroup>
            <FormGroup>
              <label>Amount to Withdraw (USD) - Min $1 / Max $2,000</label>
              <div className="input-wrap">
                <span className="prefix">$</span>
                <input type="number" placeholder="0.00" value={amount} onChange={handleAmountChange} min="1" max="2000" step="0.01" />
                <span className="suffix">≈ KES {(parseFloat(amount || 0) * rate).toFixed(0)}</span>
              </div>
              <div className="helper-text">Exchange rate: 1 USD = {rate} KES</div>
            </FormGroup>
            <ActionButton 
              onClick={handleSubmitWithdraw} 
              disabled={!amount || parseFloat(amount) < 1 || parseFloat(amount) > 2000 || !phoneNumber || phoneNumber.length !== 9}
            >
              Withdraw to M‑Pesa
            </ActionButton>
          </>
        );

      case 'history':
        return (
          <>
            <HistoryFilter>
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Deposits</button>
              <button className="filter-btn">Withdrawals</button>
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

          <BrandContainer>
            <BrandText>
              <span className="voltix">MyTradeApp.</span>
              <DropdownContainer ref={platformRef}>
                <PlatformSelector onClick={togglePlatformDropdown}>
                  <span style={{ color: platform === 'deriv' ? '#ff444f' : '#3b82f6' }}>{platform}</span>
                  <span className="chevron"><ChevronDownIcon open={isPlatformOpen} /></span>
                </PlatformSelector>
                <PlatformDropdown isOpen={isPlatformOpen}>
                  <MenuHeader>Select Platform</MenuHeader>
                  <div style={{ cursor: 'pointer', padding: '10px 14px', borderRadius: '10px', fontWeight: 600, color: platform === 'deriv' ? '#ff444f' : '#cbd5e1', transition: 'all 0.15s ease' }} onClick={() => { setPlatform('deriv'); setIsPlatformOpen(false); }}>Deriv</div>
                  <div style={{ cursor: 'pointer', padding: '10px 14px', borderRadius: '10px', fontWeight: 600, color: platform === 'forex' ? '#3b82f6' : '#cbd5e1', transition: 'all 0.15s ease' }} onClick={() => { setPlatform('forex'); setIsPlatformOpen(false); }}>Forex</div>
                  <div style={{ cursor: 'pointer', padding: '10px 14px', borderRadius: '10px', fontWeight: 600, color: platform === 'crypto' ? '#16cebc' : '#cbd5e1', transition: 'all 0.15s ease' }} onClick={() => { setPlatform('crypto'); setIsPlatformOpen(false); }}>Crypto</div>
                </PlatformDropdown>
              </DropdownContainer>
            </BrandText>
            <ConnectionStatus connected={connected}>
              <span className="status-dot" />
              <span className="status-text">{connected ? 'Connected' : 'Disconnected'}</span>
            </ConnectionStatus>
          </BrandContainer>
        </LeftSection>

        <CenterSection>
          <MusicPlayer />
        </CenterSection>

        <RightSection>
          <DropdownContainer ref={themeRef}>
            <IconThemeButton onClick={toggleThemeDropdown}>
              <span className="theme-icon"><ThemeIcon /></span>
            </IconThemeButton>
            <GlassDropdownMenu isOpen={isThemeOpen}>
              <MenuHeader>Choose Theme</MenuHeader>
              {THEME_OPTIONS.map((t) => (
                <ThemeOptionItem key={t.key} onClick={() => { if (onThemeChange) onThemeChange(t.key); setIsThemeOpen(false); }} className={currentTheme === t.key ? 'active' : ''}>
                  <span className="color-dot" style={{ background: t.color }} />
                  <span className="theme-label">{t.name}</span>
                  {currentTheme === t.key && <span className="check-mark">✓</span>}
                </ThemeOptionItem>
              ))}
            </GlassDropdownMenu>
          </DropdownContainer>

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
              <ThemeOptionItem onClick={() => { setAccountType('real'); setIsDropdownOpen(false); }} className={accountType === 'real' ? 'active' : ''}>
                <span className="flag-badge" style={{ fontSize: '16px' }}>🏦</span>
                <span className="theme-label">Real Account</span>
                <span style={{ fontSize: '11px', opacity: 0.6, color: '#34d399' }}>{getFormattedBalance(accountData.real)}</span>
              </ThemeOptionItem>
              <ThemeOptionItem onClick={() => { setAccountType('demo'); setIsDropdownOpen(false); }} className={accountType === 'demo' ? 'active' : ''}>
                <span className="flag-badge" style={{ fontSize: '16px' }}>🎯</span>
                <span className="theme-label">Demo Practice</span>
                <span style={{ fontSize: '11px', opacity: 0.6, color: '#60a5fa' }}>{getFormattedBalance(accountData.demo)}</span>
              </ThemeOptionItem>
              <div style={{ padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '4px' }}>
                <MenuHeader style={{ marginBottom: '6px' }}>Currency</MenuHeader>
                <SearchInput type="text" placeholder="Search currency..." value={currencySearch} onChange={(e) => setCurrencySearch(e.target.value)} />
                <CurrencyList>
                  {filteredCurrencies.length > 0 ? (
                    filteredCurrencies.map((curr) => (
                      <CurrencyOptionItem key={curr.code} onClick={() => { setSelectedCurrency(curr.code); setCurrencySearch(''); setIsDropdownOpen(false); }} className={selectedCurrency === curr.code ? 'active' : ''}>
                        <span className="flag">{curr.flag}</span>
                        <span className="code">{curr.code}</span>
                        <span className="name">{curr.name}</span>
                        {selectedCurrency === curr.code && <span className="check">✓</span>}
                      </CurrencyOptionItem>
                    ))
                  ) : (
                    <div style={{ padding: '14px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>No currencies found</div>
                  )}
                </CurrencyList>
              </div>
            </GlassDropdownMenu>
          </DropdownContainer>

          <ExitButton onClick={() => navigate('/')}>
            <span className="exit-icon"><ExitIcon /></span>
            <span>Exit</span>
          </ExitButton>
        </RightSection>
      </TopBar>

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
                    {fundModalAction === 'deposit' && 'Deposit via M‑Pesa'}
                    {fundModalAction === 'withdraw' && 'Withdraw to M‑Pesa'}
                    {fundModalAction === 'history' && 'Transaction History'}
                  </div>
                  {fundModalAction === 'deposit' && <div className="title-sub">Add funds using M‑Pesa</div>}
                  {fundModalAction === 'withdraw' && <div className="title-sub">Withdraw to your M‑Pesa wallet</div>}
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