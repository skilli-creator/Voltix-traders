// src/components/OptionSideBar.jsx
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// KEYFRAMES & MICRO-INTERACTIONS
// ============================================
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 0 ${props => props.theme?.colors?.danger || '#EF4444'};
  }
  50% {
    opacity: 0.85;
    transform: scale(1.15);
    box-shadow: 0 0 0 6px rgba(0, 0, 0, 0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(60px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const slideOutRight = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(60px) scale(0.96);
  }
`;

const pulseVoice = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

// ============================================
// PROFESSIONAL SVG ICONS
// ============================================

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const VoiceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const VoiceOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const AcademyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const AccountIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const ManagementIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const RiskIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const TermsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CompanyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9z" />
  </svg>
);

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CloseXIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CalculatorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="16" y1="10" x2="8" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="12" y2="18" />
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

// ============================================
// PROFESSIONAL RIGHT-SLIDING POPUP
// ============================================

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: flex-end;
  animation: ${fadeIn} 0.3s ease;
`;

const PopupContainer = styled.div`
  width: 480px;
  max-width: 90vw;
  height: 100vh;
  background: ${props => props.theme?.colors?.surface || props.theme?.colors?.backgroundSecondary || '#0F172A'};
  border-left: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.5)'};
  animation: ${props => props.isClosing ? slideOutRight : slideInRight} 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
  }
`;

const PopupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  flex-shrink: 0;
  background: ${props => props.theme?.colors?.surface || props.theme?.colors?.backgroundSecondary || '#0F172A'};

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
  }

  .title {
    font-size: 17px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    letter-spacing: -0.3px;
  }

  .title-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 12px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
    background: transparent;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
    }
  }
`;

const PopupBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.15)'};
    border-radius: 10px;
  }
`;

// ============================================
// NOTIFICATIONS COMPONENT
// ============================================
const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${props => props.read ? 'transparent' : props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.04)'};
  border: 1px solid ${props => props.read ? 'transparent' : props.theme?.colors?.accent + '20' || 'rgba(59, 130, 246, 0.08)'};
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.02)'};
  }

  .notif-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: ${props => props.type === 'trade' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)'};
    color: ${props => props.type === 'trade' ? '#10B981' : '#3B82F6'};
  }

  .notif-content {
    flex: 1;
    min-width: 0;
  }

  .notif-title {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    margin-bottom: 2px;
  }

  .notif-desc {
    font-size: 12px;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
    font-weight: 400;
    line-height: 1.4;
  }

  .notif-time {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-top: 4px;
    font-weight: 400;
  }

  .notif-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.accent || '#3B82F6'};
    flex-shrink: 0;
    margin-top: 4px;
    ${props => props.read && 'display: none;'}
  }
`;

// ============================================
// VOICE SETTINGS COMPONENT
// ============================================
const VoiceSettingsGroup = styled.div`
  margin-bottom: 16px;

  .group-label {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    display: block;
  }
`;

const VoiceToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${props => props.theme?.colors?.background || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  margin-bottom: 8px;

  .toggle-label {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
  }

  .toggle-status {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.active ? '#10B981' : '#94A3B8'};
    padding: 2px 10px;
    border-radius: 12px;
    background: ${props => props.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const ToggleSwitch = styled.button`
  width: 44px;
  height: 26px;
  border-radius: 13px;
  border: none;
  background: ${props => props.active ? props.theme?.colors?.accent || '#3B82F6' : props.theme?.colors?.scrollbar || '#2a2e3d'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '20px' : '2px'};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.text || '#ffffff'};
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    opacity: 0.9;
  }
`;

const VolumeSlider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: ${props => props.theme?.colors?.background || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};

  .slider-label {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
    min-width: 40px;
  }

  input[type="range"] {
    flex: 1;
    -webkit-appearance: none;
    height: 4px;
    border-radius: 2px;
    background: ${props => props.theme?.colors?.scrollbar || '#2a2e3d'};
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${props => props.theme?.colors?.accent || '#3B82F6'};
      cursor: pointer;
      border: 2px solid ${props => props.theme?.colors?.surface || '#0F172A'};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }

  .slider-value {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    min-width: 30px;
    text-align: right;
  }
`;

const VoiceEventItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;

  .event-name {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
    flex: 1;
  }

  .event-status {
    font-size: 10px;
    font-weight: 700;
    color: ${props => props.enabled ? '#10B981' : '#94A3B8'};
  }
`;

// ============================================
// ACCOUNT INFO COMPONENT
// ============================================
const AccountInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};

  &:last-child {
    border-bottom: none;
  }

  .row-label {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
  }

  .row-value {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

// ============================================
// RISK CALCULATOR COMPONENT
// ============================================
const CalcInputGroup = styled.div`
  margin-bottom: 14px;

  .calc-label {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-bottom: 4px;
    display: block;
  }

  .calc-input-wrap {
    display: flex;
    align-items: center;
    background: ${props => props.theme?.colors?.background || 'rgba(255, 255, 255, 0.02)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s ease;

    &:focus-within {
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    }

    .calc-prefix {
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
      background: ${props => props.theme?.colors?.surface || 'rgba(255, 255, 255, 0.02)'};
      border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
    }

    input {
      flex: 1;
      padding: 8px 12px;
      background: transparent;
      border: none;
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      font-size: 13px;
      font-weight: 600;
      outline: none;
      width: 100%;

      &::placeholder {
        color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
        font-weight: 400;
      }
    }
  }
`;

const CalcResultRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.04)'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.accent + '20' || 'rgba(59, 130, 246, 0.08)'};
  margin-bottom: 6px;

  .result-label {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
  }

  .result-value {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
  }

  &.success .result-value {
    color: #10B981;
  }

  &.danger .result-value {
    color: #EF4444;
  }
`;

// ============================================
// HOW TO USE COMPONENT
// ============================================
const StepItem = styled.div`
  display: flex;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};

  &:last-child {
    border-bottom: none;
  }

  .step-number {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    margin-bottom: 2px;
  }

  .step-desc {
    font-size: 12px;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
    font-weight: 400;
    line-height: 1.5;
  }
`;

// ============================================
// SIDEBAR STYLED COMPONENTS
// ============================================

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${props => props.theme?.colors?.overlay || props.theme?.colors?.shadow || 'rgba(10, 15, 29, 0.7)'};
  backdrop-filter: blur(4px);
  z-index: 98;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${props => props.theme?.colors?.sidebarBackground || props.theme?.colors?.surface || props.theme?.colors?.backgroundSecondary || '#0F172A'};
  border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  transform: ${props => (props.isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 4px 0 24px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.25)'};

  @media (max-width: 768px) {
    width: 290px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 100;
  background: ${props => props.theme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || props.theme?.colors?.accentActive || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme?.colors?.text || '#FFFFFF'};
    border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
  }

  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.15)'};
    border-radius: 99px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme?.colors?.textMuted || 'rgba(255, 255, 255, 0.3)'};
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 16px 10px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  animation: ${slideIn} 0.3s ease;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props =>
      props.theme?.colors?.gradientPrimary ||
      `linear-gradient(135deg, ${props.theme?.colors?.accent || '#3B82F6'}, #1D4ED8)`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.buttonText || '#ffffff'};
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}40` : 'rgba(59, 130, 246, 0.3)')};
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-size: 13.5px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-email {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: ${slideIn} 0.4s ease;
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMuted || '#64748B'};
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 8px;
  margin-bottom: 4px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${props => (props.active ? (props.theme?.colors?.accentLight || props.theme?.colors?.accentActive || 'rgba(59, 130, 246, 0.12)') : 'transparent')};
  color: ${props => (props.active ? (props.theme?.colors?.accent || '#3B82F6') : (props.theme?.colors?.textSecondary || '#CBD5E1'))};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || props.theme?.colors?.accentActive || 'rgba(59, 130, 246, 0.08)'};
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    transform: translateX(2px);
  }

  ${props =>
    props.active &&
    css`
      font-weight: 600;
      &::before {
        content: '';
        position: absolute;
        left: -14px;
        top: 50%;
        transform: translateY(-50%);
        width: 3.5px;
        height: 18px;
        background: ${props.theme?.colors?.accent || '#3B82F6'};
        border-radius: 0 4px 4px 0;
        box-shadow: 0 0 10px ${props.theme?.colors?.accent || '#3B82F6'};
      }
    `}

  .nav-icon {
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  &:hover .nav-icon {
    transform: scale(1.1);
  }

  .nav-label {
    flex: 1;
    font-size: 12.5px;
    letter-spacing: 0.1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 6px;
    background: ${props => (props.active ? (props.theme?.colors?.accent || '#3B82F6') : (props.theme?.colors?.badgeBg || 'rgba(255, 255, 255, 0.06)'))};
    color: ${props => (props.active ? (props.theme?.colors?.buttonText || '#FFFFFF') : (props.theme?.colors?.textMuted || '#94A3B8'))};
    text-transform: uppercase;
    letter-spacing: 0.4px;
    flex-shrink: 0;
  }

  .notification-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.danger || '#EF4444'};
    animation: ${pulseGlow} 2s infinite;
    flex-shrink: 0;
  }
`;

const SideCard = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  background: ${props => props.theme?.colors?.cardBackground || props.theme?.colors?.surface || props.theme?.colors?.background || 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  animation: ${fadeIn} 0.4s ease;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}60` : 'rgba(59, 130, 246, 0.4)')};
    box-shadow: 0 4px 16px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.2)'};
  }

  .card-title {
    font-size: 11.5px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .card-item {
    font-size: 10.5px;
    color: ${props => props.theme?.colors?.textSecondary || '#94A3B8'};
    padding: 3px 0;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    line-height: 1.45;

    .bullet {
      color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      font-weight: 700;
      flex-shrink: 0;
    }

    .highlight {
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      font-weight: 600;
    }
  }

  .learn-more {
    margin-top: 10px;
    font-size: 10.5px;
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    cursor: pointer;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: gap 0.2s ease, color 0.2s ease;

    &:hover {
      gap: 7px;
      color: ${props => props.theme?.colors?.accentHover || '#60A5FA'};
    }
  }
`;

const FeedbackSection = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: ${props => props.theme?.colors?.cardBackground || props.theme?.colors?.surface || props.theme?.colors?.background || 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  animation: ${fadeIn} 0.4s ease;

  .feedback-label {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-bottom: 8px;
    text-align: center;
  }

  .stars {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
    justify-content: center;
  }

  .star-btn {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: ${props => props.theme?.colors?.starInactive || props.theme?.colors?.border || 'rgba(255, 255, 255, 0.15)'};
    transition: transform 0.15s ease, color 0.15s ease, filter 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    &:hover {
      transform: scale(1.25);
    }

    &.active,
    &.hover {
      color: ${props => props.theme?.colors?.starActive || '#F59E0B'};
      filter: drop-shadow(0 0 6px ${props => (props.theme?.colors?.starActive ? `${props.theme.colors.starActive}80` : 'rgba(245, 158, 11, 0.5)')});
    }
  }

  .star-rating-text {
    text-align: center;
    font-size: 10.5px;
    font-weight: 600;
    margin-bottom: 10px;
    min-height: 16px;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
  }

  .feedback-textarea {
    width: 100%;
    min-height: 64px;
    padding: 8px 10px;
    background: ${props => props.theme?.colors?.inputBackground || props.theme?.colors?.surface || props.theme?.colors?.backgroundSecondary || '#0F172A'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
    border-radius: 6px;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    font-size: 11.5px;
    font-family: inherit;
    resize: none;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    margin-bottom: 10px;

    &::placeholder {
      color: ${props => props.theme?.colors?.textMuted || '#64748B'};
    }

    &:focus {
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      box-shadow: 0 0 0 2px ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}30` : 'rgba(59, 130, 246, 0.2)')};
    }
  }

  .feedback-submit {
    width: 100%;
    padding: 8px 0;
    border: none;
    border-radius: 6px;
    background: ${props => props.theme?.colors?.accent || '#3B82F6'};
    color: ${props => props.theme?.colors?.buttonText || '#ffffff'};
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: ${props => props.theme?.colors?.accentHover || '#2563EB'};
      box-shadow: 0 4px 12px ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}40` : 'rgba(59, 130, 246, 0.3)')};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .feedback-status {
    margin-top: 8px;
    font-size: 10.5px;
    text-align: center;
    color: ${props => props.theme?.colors?.success || '#10B981'};
    font-weight: 500;
  }
`;

const SidebarFooter = styled.footer`
  flex-shrink: 0;
  padding: 12px 14px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  background: ${props => props.theme?.colors?.sidebarBackground || props.theme?.colors?.surface || props.theme?.colors?.backgroundSecondary || '#0F172A'};
  display: flex;
  flex-direction: column;
  gap: 2px;

  .footer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${props => props.theme?.colors?.textSecondary || '#94A3B8'};
    font-size: 12px;
    font-weight: 500;

    &:hover {
      background: ${props => props.theme?.colors?.accentLight || props.theme?.colors?.accentActive || 'rgba(59, 130, 246, 0.08)'};
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    }

    .footer-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const OptionSideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('academy');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(70);
  
  // Popup states
  const [popupData, setPopupData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const openPopup = (data) => {
    setPopupData(data);
    setIsPopupOpen(true);
    setIsClosing(false);
  };

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      setPopupData(null);
      setIsClosing(false);
    }, 350);
  };

  const handleNavClick = (item, path) => {
    setActiveItem(item);
    if (path) navigate(path);
    closeSidebarOnMobile();
  };

  // ===== NOTIFICATIONS =====
  const handleNotificationsClick = () => {
    setActiveItem('notifications');
    setHasNotifications(false);
    
    const notifications = [
      { id: 1, type: 'trade', title: 'Trade Executed', desc: 'Buy order #TRX-7841 filled at $12,450.00', time: '2 min ago', read: false },
      { id: 2, type: 'alert', title: 'Market Alert', desc: 'Volatility 100 (1s) Index reached resistance level', time: '15 min ago', read: false },
      { id: 3, type: 'trade', title: 'Position Closed', desc: 'Sell order #TRX-7839 closed at $5,670.00', time: '1 hour ago', read: true },
      { id: 4, type: 'alert', title: 'System Update', desc: 'New trading features available in version 2.1.0', time: '3 hours ago', read: true },
    ];

    openPopup({
      title: 'Notifications',
      icon: <BellIcon />,
      badge: '2 New',
      content: (
        <>
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} read={notif.read} type={notif.type}>
              <div className="notif-icon">
                {notif.type === 'trade' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
              </div>
              <div className="notif-content">
                <div className="notif-title">{notif.title}</div>
                <div className="notif-desc">{notif.desc}</div>
                <div className="notif-time">{notif.time}</div>
              </div>
              <div className="notif-dot" />
            </NotificationItem>
          ))}
        </>
      )
    });
  };

  // ===== VOICE NOTIFICATIONS =====
  const handleVoiceClick = () => {
    setActiveItem('voice');
    
    openPopup({
      title: 'Voice Notifications',
      icon: voiceEnabled ? <VoiceIcon /> : <VoiceOffIcon />,
      badge: voiceEnabled ? 'Active' : 'Muted',
      content: (
        <>
          <VoiceToggleRow active={voiceEnabled}>
            <span className="toggle-label">Voice Notifications</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="toggle-status">{voiceEnabled ? 'On' : 'Off'}</span>
              <ToggleSwitch active={voiceEnabled} onClick={() => setVoiceEnabled(!voiceEnabled)} />
            </div>
          </VoiceToggleRow>

          <VoiceSettingsGroup>
            <span className="group-label">Volume</span>
            <VolumeSlider>
              <span className="slider-label">Vol</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={voiceVolume} 
                onChange={(e) => setVoiceVolume(parseInt(e.target.value))}
                disabled={!voiceEnabled}
              />
              <span className="slider-value">{voiceVolume}%</span>
            </VolumeSlider>
          </VoiceSettingsGroup>

          <VoiceSettingsGroup>
            <span className="group-label">Notification Events</span>
            <VoiceEventItem enabled={true}>
              <span className="event-name">Trade Execution</span>
              <span className="event-status">Enabled</span>
            </VoiceEventItem>
            <VoiceEventItem enabled={true}>
              <span className="event-name">Price Alerts</span>
              <span className="event-status">Enabled</span>
            </VoiceEventItem>
            <VoiceEventItem enabled={false}>
              <span className="event-name">Market Signals</span>
              <span className="event-status">Disabled</span>
            </VoiceEventItem>
            <VoiceEventItem enabled={true}>
              <span className="event-name">System Updates</span>
              <span className="event-status">Enabled</span>
            </VoiceEventItem>
          </VoiceSettingsGroup>
        </>
      )
    });
  };

  // ===== ACCOUNT INFO =====
  const handleAccountInfoClick = () => {
    setActiveItem('account-info');
    
    openPopup({
      title: 'Deriv Account Information',
      icon: <AccountIcon />,
      content: (
        <>
          <AccountInfoRow>
            <span className="row-label">Account ID</span>
            <span className="row-value">ACC-8472-001</span>
          </AccountInfoRow>
          <AccountInfoRow>
            <span className="row-label">Type</span>
            <span className="row-value">Real Trading</span>
          </AccountInfoRow>
          <AccountInfoRow>
            <span className="row-label">Balance</span>
            <span className="row-value" style={{ color: '#10B981' }}>$7,110.00 USD</span>
          </AccountInfoRow>
          <AccountInfoRow>
            <span className="row-label">Status</span>
            <span className="row-value">
              <span style={{ 
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                marginRight: '6px'
              }} />
              Active
            </span>
          </AccountInfoRow>
          <AccountInfoRow>
            <span className="row-label">Joined</span>
            <span className="row-value">January 2026</span>
          </AccountInfoRow>
          <AccountInfoRow>
            <span className="row-label">Last Login</span>
            <span className="row-value">Today, 14:32</span>
          </AccountInfoRow>
        </>
      )
    });
  };

  // ===== RISK CALCULATOR =====
  const [calcStake, setCalcStake] = useState(100);
  const [calcRisk, setCalcRisk] = useState(2);
  const [calcStopLoss, setCalcStopLoss] = useState(50);
  const [calcTakeProfit, setCalcTakeProfit] = useState(150);

  const handleRiskCalculatorClick = () => {
    setActiveItem('risk-calculator');
    
    const riskAmount = calcStake * (calcRisk / 100);
    const rewardAmount = calcStake * ((calcTakeProfit / calcStopLoss) * (calcRisk / 100));
    
    openPopup({
      title: 'Risk Calculator',
      icon: <RiskIcon />,
      content: (
        <>
          <CalcInputGroup>
            <span className="calc-label">Stake Amount</span>
            <div className="calc-input-wrap">
              <span className="calc-prefix">$</span>
              <input 
                type="number" 
                value={calcStake} 
                onChange={(e) => setCalcStake(parseFloat(e.target.value) || 0)}
                min="0"
                step="10"
              />
            </div>
          </CalcInputGroup>

          <CalcInputGroup>
            <span className="calc-label">Risk Percentage</span>
            <div className="calc-input-wrap">
              <span className="calc-prefix">%</span>
              <input 
                type="number" 
                value={calcRisk} 
                onChange={(e) => setCalcRisk(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.5"
              />
            </div>
          </CalcInputGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <CalcInputGroup>
              <span className="calc-label">Stop Loss</span>
              <div className="calc-input-wrap">
                <span className="calc-prefix">$</span>
                <input 
                  type="number" 
                  value={calcStopLoss} 
                  onChange={(e) => setCalcStopLoss(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="5"
                />
              </div>
            </CalcInputGroup>

            <CalcInputGroup>
              <span className="calc-label">Take Profit</span>
              <div className="calc-input-wrap">
                <span className="calc-prefix">$</span>
                <input 
                  type="number" 
                  value={calcTakeProfit} 
                  onChange={(e) => setCalcTakeProfit(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="5"
                />
              </div>
            </CalcInputGroup>
          </div>

          <div style={{ marginTop: '8px' }}>
            <CalcResultRow>
              <span className="result-label">Risk Amount</span>
              <span className="result-value">${riskAmount.toFixed(2)}</span>
            </CalcResultRow>
            <CalcResultRow className="success">
              <span className="result-label">Reward Amount</span>
              <span className="result-value">${rewardAmount.toFixed(2)}</span>
            </CalcResultRow>
            <CalcResultRow>
              <span className="result-label">Risk/Reward Ratio</span>
              <span className="result-value">
                1:{(rewardAmount / (riskAmount || 0.01)).toFixed(2)}
              </span>
            </CalcResultRow>
          </div>
        </>
      )
    });
  };

  // ===== HOW TO USE =====
  const handleHowToUseClick = () => {
    setActiveItem('how-to-use');
    
    const steps = [
      { number: 1, title: 'Connect Your Account', desc: 'Link your Deriv account to access real-time trading data and execute trades directly from the platform.' },
      { number: 2, title: 'Select a Market', desc: 'Choose from multiple volatility indices including 1s and standard options to start trading.' },
      { number: 3, title: 'Choose Your Strategy', desc: 'Select between manual, auto, or bot-assisted trading modes based on your preference.' },
      { number: 4, title: 'Monitor Your Positions', desc: 'Track open positions, view performance metrics, and manage risk in real-time.' },
      { number: 5, title: 'Customize Experience', desc: 'Personalize themes, notification settings, and display preferences to suit your workflow.' },
    ];

    openPopup({
      title: 'How to Use This Tool',
      icon: <BookIcon />,
      content: (
        <>
          {steps.map((step) => (
            <StepItem key={step.number}>
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </StepItem>
          ))}
        </>
      )
    });
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      setSubmitStatus('Please select a rating');
      setTimeout(() => setSubmitStatus(''), 3000);
      return;
    }

    if (!feedbackText.trim()) {
      setSubmitStatus('Please write your feedback');
      setTimeout(() => setSubmitStatus(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Sending feedback...');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedback: feedbackText.trim(),
          user: 'John Trader',
          email: 'john@voltixtraders.com'
        }),
      });

      if (response.ok) {
        setSubmitStatus('Thank you for your feedback!');
        setRating(0);
        setFeedbackText('');
        setTimeout(() => setSubmitStatus(''), 5000);
      } else {
        setSubmitStatus('Failed to send. Please try again.');
        setTimeout(() => setSubmitStatus(''), 3000);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitStatus('Connection error. Please try again.');
      setTimeout(() => setSubmitStatus(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (value) => {
    const texts = {
      1: 'Needs Improvement',
      2: 'Fair',
      3: 'Good',
      4: 'Great',
      5: 'Excellent'
    };
    return texts[value] || '';
  };

  return (
    <>
      {/* PROFESSIONAL RIGHT-SLIDING POPUP */}
      <PopupOverlay isOpen={isPopupOpen} onClick={closePopup}>
        <PopupContainer isClosing={isClosing} onClick={(e) => e.stopPropagation()}>
          <PopupHeader>
            <div className="title-group">
              <span className="title-icon">{popupData?.icon}</span>
              <span className="title">{popupData?.title}</span>
              {popupData?.badge && (
                <span className="title-badge">{popupData.badge}</span>
              )}
            </div>
            <button className="close-btn" onClick={closePopup}>
              <CloseXIcon />
            </button>
          </PopupHeader>
          <PopupBody>
            {popupData?.content}
          </PopupBody>
        </PopupContainer>
      </PopupOverlay>

      {/* SIDEBAR */}
      <Overlay isOpen={isOpen} onClick={onClose} />
      
      <SidebarContainer isOpen={isOpen}>
        <CloseButton isOpen={isOpen} onClick={onClose} aria-label="Close Sidebar">
          ✕
        </CloseButton>

        <SidebarContent>
          {/* USER HEADER */}
          <SidebarHeader>
            <div className="avatar">VT</div>
            <div className="user-info">
              <div className="user-name">John Trader</div>
              <div className="user-email">john@voltixtraders.com</div>
            </div>
          </SidebarHeader>

          {/* UPDATES SECTION */}
          <NavSection>
            <SectionLabel>Updates</SectionLabel>
            <NavItem 
              active={activeItem === 'notifications'}
              onClick={handleNotificationsClick}
            >
              <span className="nav-icon"><BellIcon /></span>
              <span className="nav-label">Notifications</span>
              {hasNotifications && <span className="notification-dot" />}
              <span className="badge">2</span>
            </NavItem>
            <NavItem 
              active={activeItem === 'voice'}
              onClick={handleVoiceClick}
            >
              <span className="nav-icon">{voiceEnabled ? <VoiceIcon /> : <VoiceOffIcon />}</span>
              <span className="nav-label">Voice Notifications</span>
              <span className="badge" style={{ 
                background: voiceEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: voiceEnabled ? '#10B981' : '#EF4444'
              }}>
                {voiceEnabled ? 'On' : 'Off'}
              </span>
            </NavItem>
          </NavSection>

          {/* LEARNING SECTION */}
          <NavSection>
            <SectionLabel>Learning</SectionLabel>
            <NavItem 
              active={activeItem === 'academy'}
              onClick={() => handleNavClick('academy', '/academy')}
            >
              <span className="nav-icon"><AcademyIcon /></span>
              <span className="nav-label">Voltix Academy</span>
              <span className="badge">NEW</span>
            </NavItem>
          </NavSection>

          {/* ACCOUNT SECTION */}
          <NavSection>
            <SectionLabel>Account</SectionLabel>
            <NavItem 
              active={activeItem === 'account-info'}
              onClick={handleAccountInfoClick}
            >
              <span className="nav-icon"><AccountIcon /></span>
              <span className="nav-label">Deriv Account Info</span>
            </NavItem>
          </NavSection>

          {/* TRADING SECTION */}
          <NavSection>
            <SectionLabel>Trading</SectionLabel>
            <NavItem 
              active={activeItem === 'copy-trading'}
              onClick={() => handleNavClick('copy-trading', '/copy-trading')}
            >
              <span className="nav-icon"><CopyIcon /></span>
              <span className="nav-label">Copy Trading</span>
              <span className="badge">BETA</span>
            </NavItem>

            <NavItem 
              active={activeItem === 'account-management'}
              onClick={() => handleNavClick('account-management', '/account-management')}
            >
              <span className="nav-icon"><ManagementIcon /></span>
              <span className="nav-label">Account Management</span>
              <span className="badge">NEW</span>
            </NavItem>

            <NavItem 
              active={activeItem === 'risk-calculator'}
              onClick={handleRiskCalculatorClick}
            >
              <span className="nav-icon"><RiskIcon /></span>
              <span className="nav-label">Risk Calculator</span>
            </NavItem>
          </NavSection>

          {/* WELLNESS */}
          <NavSection>
            <SectionLabel>Wellness</SectionLabel>
            <SideCard>
              <div className="card-title">
                <span className="icon"><ShieldIcon /></span>
                Responsible Trading
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Set <span className="highlight">deposit limits</span> to control your capital budget.</span>
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Take regular <span className="highlight">trading breaks</span> to maintain discipline.</span>
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Trade only with risk capital you can afford to lose.</span>
              </div>
              <div 
                className="learn-more" 
                onClick={() => handleNavClick('responsible-trading', '/responsible-trading')}
              >
                Learn more →
              </div>
            </SideCard>
          </NavSection>

          {/* FEEDBACK SECTION */}
          <NavSection>
            <SectionLabel>Feedback</SectionLabel>
            <FeedbackSection>
              <div className="feedback-label">Rate your experience</div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${
                      star <= (hoverRating || rating) ? 'active' : ''
                    } ${star <= hoverRating && star > rating ? 'hover' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} star`}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="star-rating-text">
                {rating > 0 ? getRatingText(rating) : 'Tap a star to rate'}
              </div>
              <textarea
                className="feedback-textarea"
                placeholder="Share your feedback or suggestions..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                disabled={isSubmitting}
              />
              <button 
                className="feedback-submit" 
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit Feedback'}
              </button>
              {submitStatus && (
                <div className="feedback-status">{submitStatus}</div>
              )}
            </FeedbackSection>
          </NavSection>

          {/* INFORMATION SECTION */}
          <NavSection>
            <SectionLabel>Information</SectionLabel>
            <NavItem 
              active={activeItem === 'how-to-use'}
              onClick={handleHowToUseClick}
            >
              <span className="nav-icon"><BookIcon /></span>
              <span className="nav-label">How to Use</span>
            </NavItem>
            <NavItem 
              active={activeItem === 'terms'}
              onClick={() => handleNavClick('terms', '/terms')}
            >
              <span className="nav-icon"><TermsIcon /></span>
              <span className="nav-label">Terms & Conditions</span>
            </NavItem>
          </NavSection>

          {/* COMPANY SECTION */}
          <NavSection>
            <SectionLabel>Company</SectionLabel>
            <SideCard>
              <div className="card-title">
                <span className="icon"><CompanyIcon /></span>
                About Voltix Traders
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Third-party trading application for Deriv platform.</span>
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Provides real-time API market streams and automated execution tools.</span>
              </div>
              <div 
                className="learn-more" 
                onClick={() => handleNavClick('about', '/about')}
              >
                About us →
              </div>
            </SideCard>
          </NavSection>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter>
          <div className="footer-item" onClick={() => handleNavClick('settings', '/settings')}>
            <span className="footer-icon"><SettingsIcon /></span>
            Settings
          </div>
          <div className="footer-item" onClick={() => handleNavClick('help', '/settings')}>
            <span className="footer-icon"><HelpIcon /></span>
            Help & Support
          </div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default OptionSideBar;