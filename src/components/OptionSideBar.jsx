// src/components/OptionSideBar.jsx
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// KEYFRAMES
// ============================================
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 ${props => props.theme?.colors?.danger || '#EF4444'}; }
  50% { opacity: 0.85; transform: scale(1.15); box-shadow: 0 0 0 6px rgba(0, 0, 0, 0); }
`;

const modalSlideIn = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(40px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const modalBackdrop = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const countUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.2); }
`;

// ============================================
// SVG ICONS
// ============================================
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const VoiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const VoiceOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const AcademyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const AccountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const ManagementIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const RiskIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const TermsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CompanyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9z" />
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CloseXIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

// ============================================
// PREMIUM MODAL
// ============================================

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 1000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${modalBackdrop} 0.3s ease;
`;

const ModalContainer = styled.div`
  max-width: 540px;
  width: 100%;
  max-height: 85vh;
  background: ${props => props.theme?.colors?.surface || '#0F172A'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  border-radius: 24px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  animation: ${modalSlideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${props => props.theme?.colors?.accent || '#3B82F6'}, 
      ${props => props.theme?.colors?.accent + '80' || '#60A5FA'}, 
      ${props => props.theme?.colors?.accent || '#3B82F6'}
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.02), transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    margin: 12px;
    border-radius: 20px;
    max-height: 90vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  flex-shrink: 0;
  position: relative;
  z-index: 1;

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
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .title-text {
    font-size: 17px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    letter-spacing: -0.3px;
  }

  .title-badge {
    font-size: 9px;
    font-weight: 700;
    padding: 3px 12px;
    border-radius: 12px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    border: 1px solid ${props => props.theme?.colors?.accent + '20' || 'rgba(59, 130, 246, 0.06)'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
    background: ${props => props.theme?.colors?.background || 'rgba(255, 255, 255, 0.02)'};
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.06)'};
      transform: rotate(90deg) scale(1.05);
    }

    &:active {
      transform: rotate(90deg) scale(0.95);
    }
  }

  @media (max-width: 480px) {
    padding: 16px 18px 12px 18px;
    .title-text { font-size: 15px; }
    .title-icon { width: 34px; height: 34px; }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px;
  position: relative;
  z-index: 1;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.06)'};
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 14px 16px 18px;
  }
`;

// ============================================
// NOTIFICATIONS
// ============================================
const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${props => props.read ? 'transparent' : props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.04)'};
  border: 1px solid ${props => props.read ? 'transparent' : props.theme?.colors?.accent + '15' || 'rgba(59, 130, 246, 0.04)'};
  margin-bottom: 6px;
  transition: all 0.25s ease;

  &:hover { 
    background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.02)'}; 
    transform: translateX(2px);
  }

  .notif-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: ${props => props.type === 'trade' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
    color: ${props => props.type === 'trade' ? '#10B981' : '#3B82F6'};
  }

  .notif-content { flex: 1; min-width: 0; }
  .notif-title { 
    font-size: 13px; 
    font-weight: 600; 
    color: ${props => props.theme?.colors?.text || '#F8FAFC'}; 
    margin-bottom: 2px; 
  }
  .notif-desc { 
    font-size: 11.5px; 
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'}; 
    font-weight: 400; 
    line-height: 1.5; 
  }
  .notif-time { 
    font-size: 10px; 
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; 
    margin-top: 3px; 
    font-weight: 400; 
  }
  .notif-dot { 
    width: 7px; 
    height: 7px; 
    border-radius: 50%; 
    background: ${props => props.theme?.colors?.accent || '#3B82F6'}; 
    flex-shrink: 0; 
    margin-top: 4px; 
    ${props => props.read && 'display: none;'} 
    animation: ${pulseGlow} 2s infinite;
  }
`;

// ============================================
// VOICE SETTINGS
// ============================================
const VoiceToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${props => props.theme?.colors?.background || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  margin-bottom: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '30' || 'rgba(59, 130, 246, 0.15)'};
  }

  .toggle-label { 
    font-size: 13px; 
    font-weight: 600; 
    color: ${props => props.theme?.colors?.text || '#F8FAFC'}; 
  }
  .toggle-status { 
    font-size: 10px; 
    font-weight: 700; 
    padding: 3px 10px; 
    border-radius: 8px; 
    color: ${props => props.active ? '#10B981' : '#94A3B8'}; 
    background: ${props => props.active ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)'}; 
  }
`;

const ToggleSwitch = styled.button`
  width: 44px;
  height: 26px;
  border-radius: 13px;
  border: none;
  background: ${props => props.active ? props.theme?.colors?.accent || '#3B82F6' : props.theme?.colors?.scrollbar || '#2a2e3d'};
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '22px' : '2px'};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.text || '#ffffff'};
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  &:hover { 
    opacity: 0.85; 
    transform: scale(1.02);
  }
  &:active { transform: scale(0.98); }
`;

const VolumeSlider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: ${props => props.theme?.colors?.background || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  margin-bottom: 8px;

  .slider-label { 
    font-size: 11.5px; 
    font-weight: 600; 
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'}; 
    min-width: 32px; 
  }
  input[type="range"] {
    flex: 1; 
    -webkit-appearance: none; 
    height: 4px; 
    border-radius: 2px; 
    background: ${props => props.theme?.colors?.scrollbar || '#2a2e3d'}; 
    outline: none;
    transition: all 0.3s ease;
    &::-webkit-slider-thumb { 
      -webkit-appearance: none; 
      width: 16px; 
      height: 16px; 
      border-radius: 50%; 
      background: ${props => props.theme?.colors?.accent || '#3B82F6'}; 
      cursor: pointer; 
      border: 2px solid ${props => props.theme?.colors?.surface || '#0F172A'}; 
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease;
    }
    &::-webkit-slider-thumb:hover { transform: scale(1.1); }
    &:disabled { opacity: 0.4; }
  }
  .slider-value { 
    font-size: 13px; 
    font-weight: 700; 
    color: ${props => props.theme?.colors?.text || '#F8FAFC'}; 
    min-width: 28px; 
    text-align: right; 
  }
`;

const VoiceEventItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.02)'};
  &:last-child { border-bottom: none; }

  .event-name { 
    font-size: 12px; 
    font-weight: 500; 
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'}; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
  }
  .event-dot { 
    width: 6px; 
    height: 6px; 
    border-radius: 50%; 
    background: ${props => props.enabled ? '#10B981' : '#94A3B8'}; 
    transition: all 0.3s ease;
  }
  .event-status { 
    font-size: 10px; 
    font-weight: 700; 
    color: ${props => props.enabled ? '#10B981' : '#94A3B8'}; 
    cursor: pointer; 
    padding: 2px 12px; 
    border-radius: 8px; 
    background: ${props => props.enabled ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.02)'}; 
    transition: all 0.3s ease; 
    &:hover { 
      opacity: 0.7; 
      transform: scale(1.02);
    }
  }
`;

// ============================================
// ACCOUNT INFO - Premium
// ============================================
const AccountInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.03)'};
  &:last-child { border-bottom: none; }

  .row-label { 
    font-size: 12px; 
    font-weight: 500; 
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; 
  }
  .row-value { 
    font-size: 13px; 
    font-weight: 700; 
    color: ${props => props.theme?.colors?.text || '#F8FAFC'}; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
  }
  .status-indicator { 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    font-size: 12px; 
    font-weight: 700; 
    color: #10B981; 
    .dot { 
      width: 7px; 
      height: 7px; 
      border-radius: 50%; 
      background: #10B981; 
      animation: ${pulseGlow} 2s infinite; 
    } 
  }
`;

// ============================================
// PREMIUM RISK CALCULATOR
// ============================================
const CalcInputGroup = styled.div`
  margin-bottom: 14px;

  .calc-label {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    .calc-hint { 
      font-size: 9px; 
      font-weight: 400; 
      color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; 
      opacity: 0.4; 
      text-transform: none; 
      letter-spacing: 0;
    }
  }

  .calc-input-wrap {
    display: flex;
    align-items: center;
    background: ${props => props.theme?.colors?.background || 'rgba(255, 255, 255, 0.02)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      box-shadow: 0 0 0 4px ${props => props.theme?.colors?.accent + '15' || 'rgba(59, 130, 246, 0.06)'};
    }

    .calc-prefix {
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
      background: ${props => props.theme?.colors?.surface || 'rgba(255, 255, 255, 0.02)'};
      border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.02)'};
      min-width: 24px;
      text-align: center;
    }

    input {
      flex: 1;
      padding: 10px 14px;
      background: transparent;
      border: none;
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      font-size: 14px;
      font-weight: 600;
      outline: none;
      width: 100%;
      min-width: 0;
      &::placeholder { 
        color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; 
        font-weight: 400; 
        opacity: 0.2; 
      }
      &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      &[type="number"] { -moz-appearance: textfield; }
    }
  }
`;

const CalcResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
  animation: ${countUp} 0.5s ease;

  @media (max-width: 480px) { grid-template-columns: 1fr 1fr; }
`;

const CalcResultBox = styled.div`
  padding: 14px 12px;
  border-radius: 10px;
  text-align: center;
  background: ${props => 
    props.type === 'risk' ? 'rgba(239, 68, 68, 0.05)' : 
    props.type === 'reward' ? 'rgba(16, 185, 129, 0.05)' : 
    'rgba(59, 130, 246, 0.05)'
  };
  border: 1px solid ${props => 
    props.type === 'risk' ? 'rgba(239, 68, 68, 0.08)' : 
    props.type === 'reward' ? 'rgba(16, 185, 129, 0.08)' : 
    'rgba(59, 130, 246, 0.08)'
  };
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .result-label { 
    font-size: 8px; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 0.6px; 
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; 
    margin-bottom: 3px; 
  }
  .result-value { 
    font-size: 16px; 
    font-weight: 700; 
    color: ${props => 
      props.type === 'risk' ? '#EF4444' : 
      props.type === 'reward' ? '#10B981' : 
      props.theme?.colors?.accent || '#3B82F6'
    }; 
  }
  .result-sub { 
    font-size: 8px; 
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; 
    margin-top: 3px; 
    font-weight: 400; 
    opacity: 0.5; 
  }
`;

const CalcSummaryBox = styled.div`
  margin-top: 12px;
  padding: 14px 18px;
  background: ${props => props.theme?.colors?.background || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  animation: ${countUp} 0.6s ease;

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 12px;
    font-weight: 500;
    .label { 
      color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; 
    }
    .value { 
      color: ${props => props.theme?.colors?.text || '#F8FAFC'}; 
      font-weight: 600;
    }
    &.risk .value { color: '#EF4444'; }
    &.reward .value { color: '#10B981'; }
  }
`;

// ============================================
// HOW TO USE - Premium
// ============================================
const StepItem = styled.div`
  display: flex;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.03)'};
  &:last-child { border-bottom: none; }

  .step-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
    border: 1px solid ${props => props.theme?.colors?.accent + '20' || 'rgba(59, 130, 246, 0.06)'};
    transition: all 0.3s ease;
  }

  &:hover .step-number {
    transform: scale(1.1);
    background: ${props => props.theme?.colors?.accent || '#3B82F6'};
    color: white;
  }

  .step-content { flex: 1; }
  .step-title { 
    font-size: 13px; 
    font-weight: 600; 
    color: ${props => props.theme?.colors?.text || '#F8FAFC'}; 
    margin-bottom: 2px; 
  }
  .step-desc { 
    font-size: 11.5px; 
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'}; 
    font-weight: 400; 
    line-height: 1.6; 
  }
`;

// ============================================
// TERMS & CONDITIONS - Premium
// ============================================
const TermsSection = styled.div`
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${props => props.theme?.colors?.background || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.03)'};

  .terms-title { 
    font-size: 13px; 
    font-weight: 700; 
    color: ${props => props.theme?.colors?.text || '#F8FAFC'}; 
    margin-bottom: 4px; 
  }
  .terms-text { 
    font-size: 11.5px; 
    line-height: 1.8; 
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'}; 
    font-weight: 400; 
  }
  .terms-bullet {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 3px 0;
    font-size: 11.5px;
    line-height: 1.6;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
    font-weight: 400;
    .bullet-dot { 
      color: ${props => props.theme?.colors?.accent || '#3B82F6'}; 
      font-weight: 700; 
      flex-shrink: 0; 
      margin-top: 2px; 
    }
  }
`;

// ============================================
// SIDEBAR STYLED COMPONENTS
// ============================================

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${props => props.theme?.colors?.overlay || 'rgba(10, 15, 29, 0.7)'};
  backdrop-filter: blur(6px);
  z-index: 98;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  @media (min-width: 769px) { display: none; }
`;

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${props => props.theme?.colors?.sidebarBackground || '#0F172A'};
  border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  transform: ${props => (props.isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 4px 0 40px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.3)'};
  @media (max-width: 768px) { width: 290px; }
  @media (max-width: 480px) { width: 100%; }
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
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)'};
    color: ${props => props.theme?.colors?.text || '#FFFFFF'};
    border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    transform: rotate(90deg);
  }
  @media (max-width: 768px) { display: ${props => (props.isOpen ? 'flex' : 'none')}; }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.12)'}; border-radius: 99px; }
  &::-webkit-scrollbar-thumb:hover { background: ${props => props.theme?.colors?.textMuted || 'rgba(255, 255, 255, 0.25)'}; }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 16px 10px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  animation: ${slideIn} 0.3s ease;

  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: ${props => props.theme?.colors?.gradientPrimary || `linear-gradient(135deg, ${props.theme?.colors?.accent || '#3B82F6'}, #1D4ED8)`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.buttonText || '#ffffff'};
    letter-spacing: 0.5px;
    box-shadow: 0 4px 16px ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}40` : 'rgba(59, 130, 246, 0.35)')};
    flex-shrink: 0;
  }

  .user-info { flex: 1; min-width: 0; }
  .user-name { 
    font-size: 14px; 
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
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${props => (props.active ? (props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)') : 'transparent')};
  color: ${props => (props.active ? (props.theme?.colors?.accent || '#3B82F6') : (props.theme?.colors?.textSecondary || '#CBD5E1'))};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.05)'};
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    transform: translateX(3px);
  }

  ${props => props.active && css`
    font-weight: 600;
    &::before {
      content: '';
      position: absolute;
      left: -14px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background: ${props.theme?.colors?.accent || '#3B82F6'};
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 16px ${props.theme?.colors?.accent || '#3B82F6'};
    }
  `}

  .nav-icon { 
    width: 20px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    flex-shrink: 0; 
    transition: transform 0.3s ease; 
  }
  &:hover .nav-icon { transform: scale(1.1); }
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
    padding: 2px 8px;
    border-radius: 8px;
    background: ${props => (props.active ? (props.theme?.colors?.accent || '#3B82F6') : (props.theme?.colors?.badgeBg || 'rgba(255, 255, 255, 0.04)'))};
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
  padding: 14px 16px;
  border-radius: 10px;
  background: ${props => props.theme?.colors?.cardBackground || 'rgba(15, 23, 42, 0.4)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.05)'};
  animation: ${fadeIn} 0.4s ease;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}40` : 'rgba(59, 130, 246, 0.25)')};
    box-shadow: 0 4px 20px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.15)'};
    transform: translateY(-1px);
  }

  .card-title { 
    font-size: 12px; 
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
      color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    } 
  }
  .card-item { 
    font-size: 11px; 
    color: ${props => props.theme?.colors?.textSecondary || '#94A3B8'}; 
    padding: 4px 0; 
    display: flex; 
    align-items: flex-start; 
    gap: 8px; 
    line-height: 1.5; 
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
    margin-top: 8px; 
    font-size: 11px; 
    color: ${props => props.theme?.colors?.accent || '#3B82F6'}; 
    cursor: pointer; 
    font-weight: 600; 
    display: inline-flex; 
    align-items: center; 
    gap: 4px; 
    transition: all 0.3s ease; 
    &:hover { 
      gap: 10px; 
      color: ${props => props.theme?.colors?.accentHover || '#60A5FA'}; 
    } 
  }
`;

const FeedbackSection = styled.div`
  padding: 16px;
  border-radius: 10px;
  background: ${props => props.theme?.colors?.cardBackground || 'rgba(15, 23, 42, 0.4)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.05)'};
  animation: ${fadeIn} 0.4s ease;

  .feedback-label { 
    font-size: 12px; 
    font-weight: 600; 
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; 
    margin-bottom: 10px; 
    text-align: center; 
  }
  .stars { 
    display: flex; 
    gap: 8px; 
    margin-bottom: 10px; 
    justify-content: center; 
  }
  .star-btn {
    background: transparent; 
    border: none; 
    padding: 0; 
    cursor: pointer; 
    color: ${props => props.theme?.colors?.starInactive || 'rgba(255, 255, 255, 0.12)'}; 
    transition: all 0.2s ease; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    svg { width: 22px; height: 22px; fill: currentColor; }
    &:hover { transform: scale(1.25); }
    &.active, &.hover { 
      color: ${props => props.theme?.colors?.starActive || '#F59E0B'}; 
      filter: drop-shadow(0 0 8px ${props => (props.theme?.colors?.starActive ? `${props.theme.colors.starActive}60` : 'rgba(245, 158, 11, 0.3)')}); 
    }
  }
  .star-rating-text { 
    text-align: center; 
    font-size: 11px; 
    font-weight: 600; 
    margin-bottom: 12px; 
    min-height: 18px; 
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'}; 
  }
  .feedback-textarea {
    width: 100%; 
    min-height: 70px; 
    padding: 10px 12px; 
    background: ${props => props.theme?.colors?.inputBackground || 'rgba(255, 255, 255, 0.02)'}; 
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.05)'}; 
    border-radius: 8px; 
    color: ${props => props.theme?.colors?.text || '#F8FAFC'}; 
    font-size: 12px; 
    font-family: inherit; 
    resize: none; 
    outline: none; 
    transition: all 0.3s ease; 
    margin-bottom: 12px;
    &::placeholder { color: ${props => props.theme?.colors?.textMuted || '#64748B'}; }
    &:focus { 
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'}; 
      box-shadow: 0 0 0 3px ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}20` : 'rgba(59, 130, 246, 0.08)')}; 
    }
  }
  .feedback-submit {
    width: 100%; 
    padding: 10px 0; 
    border: none; 
    border-radius: 8px; 
    background: ${props => props.theme?.colors?.accent || '#3B82F6'}; 
    color: ${props => props.theme?.colors?.buttonText || '#ffffff'}; 
    font-size: 12px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.3s ease;
    &:hover:not(:disabled) { 
      background: ${props => props.theme?.colors?.accentHover || '#2563EB'}; 
      box-shadow: 0 4px 16px ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}40` : 'rgba(59, 130, 246, 0.2)')}; 
      transform: translateY(-1px);
    }
    &:active:not(:disabled) { transform: scale(0.98); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
  .feedback-status { 
    margin-top: 10px; 
    font-size: 11px; 
    text-align: center; 
    color: ${props => props.theme?.colors?.success || '#10B981'}; 
    font-weight: 500; 
  }
`;

const SidebarFooter = styled.footer`
  flex-shrink: 0;
  padding: 12px 14px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  background: ${props => props.theme?.colors?.sidebarBackground || '#0F172A'};
  display: flex;
  flex-direction: column;
  gap: 2px;

  .footer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    color: ${props => props.theme?.colors?.textSecondary || '#94A3B8'};
    font-size: 12px;
    font-weight: 500;
    &:hover { 
      background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.05)'}; 
      color: ${props => props.theme?.colors?.text || '#F8FAFC'}; 
      transform: translateX(2px);
    }
    .footer-icon { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      opacity: 0.7;
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
  
  // Voice states
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(70);
  const [voiceEvents, setVoiceEvents] = useState({ trade: true, price: true, market: false, system: true });
  
  // Popup state
  const [popupData, setPopupData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Premium Risk calculator state
  const [calcAccountBalance, setCalcAccountBalance] = useState(10000);
  const [calcRiskPercent, setCalcRiskPercent] = useState(2);
  const [calcStopLoss, setCalcStopLoss] = useState(50);
  const [calcTakeProfit, setCalcTakeProfit] = useState(150);
  const [calculated, setCalculated] = useState(false);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) onClose();
  };

  const openPopup = (data) => {
    setPopupData(data);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setPopupData(null), 300);
  };

  const handleNavClick = (item, path) => {
    setActiveItem(item);
    if (path) navigate(path);
    closeSidebarOnMobile();
  };

  // ===== PREMIUM RISK CALCULATOR LOGIC =====
  const calculateRisk = () => {
    setCalculated(true);
  };

  const getRiskResults = () => {
    const riskAmount = calcAccountBalance * (calcRiskPercent / 100);
    const rewardAmount = calcAccountBalance * ((calcTakeProfit / calcStopLoss) * (calcRiskPercent / 100));
    const riskRewardRatio = riskAmount > 0 ? rewardAmount / riskAmount : 0;
    const positionSize = calcStopLoss > 0 ? riskAmount / (calcStopLoss / 100) : 0;
    const maxLoss = riskAmount;
    const maxProfit = rewardAmount;

    return { riskAmount, rewardAmount, riskRewardRatio, positionSize, maxLoss, maxProfit };
  };

  const riskResults = getRiskResults();

  // ===== ALL POPUP HANDLERS =====
  const handleNotificationsClick = () => {
    setActiveItem('notifications');
    setHasNotifications(false);
    openPopup({
      title: 'Notifications',
      icon: <BellIcon />,
      badge: '2 New',
      content: (
        <>
          <NotificationItem read={false} type="trade">
            <div className="notif-icon"><TrendingUpIcon /></div>
            <div className="notif-content">
              <div className="notif-title">Trade Executed</div>
              <div className="notif-desc">Buy order #TRX-7841 filled at $12,450.00</div>
              <div className="notif-time">2 min ago</div>
            </div>
            <div className="notif-dot" />
          </NotificationItem>
          <NotificationItem read={false} type="alert">
            <div className="notif-icon"><TrendingDownIcon /></div>
            <div className="notif-content">
              <div className="notif-title">Market Alert</div>
              <div className="notif-desc">Volatility 100 (1s) Index reached resistance level</div>
              <div className="notif-time">15 min ago</div>
            </div>
            <div className="notif-dot" />
          </NotificationItem>
          <NotificationItem read={true} type="trade">
            <div className="notif-icon"><TrendingUpIcon /></div>
            <div className="notif-content">
              <div className="notif-title">Position Closed</div>
              <div className="notif-desc">Sell order #TRX-7839 closed at $5,670.00</div>
              <div className="notif-time">1 hour ago</div>
            </div>
          </NotificationItem>
          <NotificationItem read={true} type="alert">
            <div className="notif-icon"><BellIcon /></div>
            <div className="notif-content">
              <div className="notif-title">System Update</div>
              <div className="notif-desc">New trading features available in version 2.1.0</div>
              <div className="notif-time">3 hours ago</div>
            </div>
          </NotificationItem>
        </>
      )
    });
  };

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="toggle-status">{voiceEnabled ? 'On' : 'Off'}</span>
              <ToggleSwitch active={voiceEnabled} onClick={() => setVoiceEnabled(!voiceEnabled)} />
            </div>
          </VoiceToggleRow>
          <VolumeSlider>
            <span className="slider-label">Vol</span>
            <input type="range" min="0" max="100" value={voiceVolume} onChange={(e) => setVoiceVolume(parseInt(e.target.value))} disabled={!voiceEnabled} />
            <span className="slider-value">{voiceVolume}%</span>
          </VolumeSlider>
          <VoiceEventItem enabled={voiceEvents.trade}>
            <span className="event-name"><span className="event-dot" />Trade Execution</span>
            <span className="event-status" onClick={() => setVoiceEvents({...voiceEvents, trade: !voiceEvents.trade})}>
              {voiceEvents.trade ? 'Enabled' : 'Disabled'}
            </span>
          </VoiceEventItem>
          <VoiceEventItem enabled={voiceEvents.price}>
            <span className="event-name"><span className="event-dot" />Price Alerts</span>
            <span className="event-status" onClick={() => setVoiceEvents({...voiceEvents, price: !voiceEvents.price})}>
              {voiceEvents.price ? 'Enabled' : 'Disabled'}
            </span>
          </VoiceEventItem>
          <VoiceEventItem enabled={voiceEvents.market}>
            <span className="event-name"><span className="event-dot" />Market Signals</span>
            <span className="event-status" onClick={() => setVoiceEvents({...voiceEvents, market: !voiceEvents.market})}>
              {voiceEvents.market ? 'Enabled' : 'Disabled'}
            </span>
          </VoiceEventItem>
          <VoiceEventItem enabled={voiceEvents.system}>
            <span className="event-name"><span className="event-dot" />System Updates</span>
            <span className="event-status" onClick={() => setVoiceEvents({...voiceEvents, system: !voiceEvents.system})}>
              {voiceEvents.system ? 'Enabled' : 'Disabled'}
            </span>
          </VoiceEventItem>
        </>
      )
    });
  };

  const handleAccountInfoClick = () => {
    setActiveItem('account-info');
    openPopup({
      title: 'Account Information',
      icon: <AccountIcon />,
      content: (
        <>
          <AccountInfoRow><span className="row-label">Account ID</span><span className="row-value">ACC-8472-001</span></AccountInfoRow>
          <AccountInfoRow><span className="row-label">Account Type</span><span className="row-value">Real Trading</span></AccountInfoRow>
          <AccountInfoRow><span className="row-label">Balance</span><span className="row-value" style={{ color: '#10B981' }}>$7,110.00 USD</span></AccountInfoRow>
          <AccountInfoRow><span className="row-label">Status</span><span className="row-value"><span className="status-indicator"><span className="dot" />Active</span></span></AccountInfoRow>
          <AccountInfoRow><span className="row-label">Joined</span><span className="row-value">January 2026</span></AccountInfoRow>
          <AccountInfoRow><span className="row-label">Last Login</span><span className="row-value">Today, 14:32</span></AccountInfoRow>
        </>
      )
    });
  };

  const handleRiskCalculatorClick = () => {
    setActiveItem('risk-calculator');
    setCalculated(false);
    openPopup({
      title: 'Risk Calculator',
      icon: <RiskIcon />,
      badge: 'Premium',
      content: (
        <>
          <CalcInputGroup>
            <span className="calc-label">Account Balance <span className="calc-hint">(USD)</span></span>
            <div className="calc-input-wrap">
              <span className="calc-prefix">$</span>
              <input 
                type="number" 
                value={calcAccountBalance} 
                onChange={(e) => setCalcAccountBalance(parseFloat(e.target.value) || 0)} 
                min="0" 
                step="100" 
                placeholder="Enter balance"
              />
            </div>
          </CalcInputGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <CalcInputGroup>
              <span className="calc-label">Risk % <span className="calc-hint">(per trade)</span></span>
              <div className="calc-input-wrap">
                <span className="calc-prefix">%</span>
                <input 
                  type="number" 
                  value={calcRiskPercent} 
                  onChange={(e) => setCalcRiskPercent(parseFloat(e.target.value) || 0)} 
                  min="0" 
                  max="100" 
                  step="0.5" 
                />
              </div>
            </CalcInputGroup>
            <CalcInputGroup>
              <span className="calc-label">Stop Loss <span className="calc-hint">(pips)</span></span>
              <div className="calc-input-wrap">
                <span className="calc-prefix">SL</span>
                <input 
                  type="number" 
                  value={calcStopLoss} 
                  onChange={(e) => setCalcStopLoss(parseFloat(e.target.value) || 0)} 
                  min="1" 
                  step="5" 
                />
              </div>
            </CalcInputGroup>
          </div>
          <CalcInputGroup>
            <span className="calc-label">Take Profit <span className="calc-hint">(pips)</span></span>
            <div className="calc-input-wrap">
              <span className="calc-prefix">TP</span>
              <input 
                type="number" 
                value={calcTakeProfit} 
                onChange={(e) => setCalcTakeProfit(parseFloat(e.target.value) || 0)} 
                min="1" 
                step="5" 
              />
            </div>
          </CalcInputGroup>

          <button 
            onClick={calculateRisk} 
            style={{
              width: '100%',
              padding: '12px 0',
              border: 'none',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '6px',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.25)';
            }}
          >
            Calculate Risk
          </button>

          {calculated && (
            <>
              <CalcResultsGrid>
                <CalcResultBox type="risk">
                  <div className="result-label">Risk Amount</div>
                  <div className="result-value">${riskResults.riskAmount.toFixed(2)}</div>
                  <div className="result-sub">{calcRiskPercent}% of balance</div>
                </CalcResultBox>
                <CalcResultBox type="reward">
                  <div className="result-label">Reward Amount</div>
                  <div className="result-value">${riskResults.rewardAmount.toFixed(2)}</div>
                  <div className="result-sub">{((calcTakeProfit / calcStopLoss) * calcRiskPercent).toFixed(2)}%</div>
                </CalcResultBox>
                <CalcResultBox type="ratio">
                  <div className="result-label">Risk/Reward</div>
                  <div className="result-value">1:{riskResults.riskRewardRatio.toFixed(2)}</div>
                  <div className="result-sub">{riskResults.riskRewardRatio.toFixed(2)}x</div>
                </CalcResultBox>
              </CalcResultsGrid>
              <CalcSummaryBox>
                <div className="summary-row">
                  <span className="label">Position Size</span>
                  <span className="value">{riskResults.positionSize.toFixed(2)} units</span>
                </div>
                <div className="summary-row risk">
                  <span className="label">Max Loss</span>
                  <span className="value" style={{ color: '#EF4444' }}>${riskResults.maxLoss.toFixed(2)}</span>
                </div>
                <div className="summary-row reward">
                  <span className="label">Max Profit</span>
                  <span className="value" style={{ color: '#10B981' }}>${riskResults.maxProfit.toFixed(2)}</span>
                </div>
              </CalcSummaryBox>
            </>
          )}
        </>
      )
    });
  };

  const handleHowToUseClick = () => {
    setActiveItem('how-to-use');
    openPopup({
      title: 'How to Use',
      icon: <BookIcon />,
      content: (
        <>
          <StepItem>
            <div className="step-number">1</div>
            <div className="step-content">
              <div className="step-title">Connect Your Account</div>
              <div className="step-desc">Link your Deriv account to access real-time trading data and execute trades directly.</div>
            </div>
          </StepItem>
          <StepItem>
            <div className="step-number">2</div>
            <div className="step-content">
              <div className="step-title">Select a Market</div>
              <div className="step-desc">Choose from multiple volatility indices including 1s and standard options to start trading.</div>
            </div>
          </StepItem>
          <StepItem>
            <div className="step-number">3</div>
            <div className="step-content">
              <div className="step-title">Choose Your Strategy</div>
              <div className="step-desc">Select between manual, auto, or bot-assisted trading modes based on your preference.</div>
            </div>
          </StepItem>
          <StepItem>
            <div className="step-number">4</div>
            <div className="step-content">
              <div className="step-title">Monitor Your Positions</div>
              <div className="step-desc">Track open positions, view performance metrics, and manage risk in real-time.</div>
            </div>
          </StepItem>
          <StepItem>
            <div className="step-number">5</div>
            <div className="step-content">
              <div className="step-title">Customize Experience</div>
              <div className="step-desc">Personalize themes, notification settings, and display preferences to suit your workflow.</div>
            </div>
          </StepItem>
        </>
      )
    });
  };

  const handleTermsClick = () => {
    setActiveItem('terms');
    openPopup({
      title: 'Terms & Conditions',
      icon: <TermsIcon />,
      badge: 'v2.0',
      content: (
        <>
          <TermsSection>
            <div className="terms-title">1. Introduction</div>
            <div className="terms-text">Welcome to MyTradeApp. By using our third-party trading application, you agree to these Terms and Conditions.</div>
          </TermsSection>
          <TermsSection>
            <div className="terms-title">2. Acceptance of Terms</div>
            <div className="terms-text">By accessing or using MyTradeApp, you confirm that you have read, understood, and agree to be bound by these Terms.</div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>You must be at least <strong style={{ color: '#F8FAFC' }}>18 years old</strong> to use this App.</span></div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>You are <strong style={{ color: '#F8FAFC' }}>solely responsible</strong> for all trading decisions.</span></div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>Trading involves <strong style={{ color: '#EF4444' }}>significant financial risk</strong>.</span></div>
          </TermsSection>
          <TermsSection>
            <div className="terms-title">3. Services Provided</div>
            <div className="terms-text">MyTradeApp provides automated trading, AI-assisted analysis, manual trading, bot deployment, and real-time market data from Deriv via APIs.</div>
          </TermsSection>
          <TermsSection>
            <div className="terms-title">4. Account Responsibility</div>
            <div className="terms-text">You are fully responsible for all trades executed through the App. MyTradeApp does not store your login credentials.</div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>You must <strong style={{ color: '#F8FAFC' }}>not share</strong> your trading credentials.</span></div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>You are responsible for <strong style={{ color: '#F8FAFC' }}>all financial losses</strong>.</span></div>
          </TermsSection>
          <TermsSection>
            <div className="terms-title">5. Limitation of Liability</div>
            <div className="terms-text">MyTradeApp provides the App "as is" without any warranties. We are not liable for any financial losses, technical issues, or damages arising from your use of the App.</div>
          </TermsSection>
          <TermsSection>
            <div className="terms-title">6. Privacy Policy</div>
            <div className="terms-text">We do not store your Deriv or Forex login credentials. We collect minimal data necessary for app functionality and never sell your personal data.</div>
          </TermsSection>
          <TermsSection>
            <div className="terms-title">7. Governing Law</div>
            <div className="terms-text">These Terms shall be governed by the laws of the jurisdiction where MyTradeApp operates.</div>
          </TermsSection>
          <TermsSection>
            <div className="terms-title">8. Contact Us</div>
            <div className="terms-text">For questions or concerns, contact us at <strong style={{ color: '#3B82F6' }}>support@mytradeapp.com</strong></div>
          </TermsSection>
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('Thank you for your feedback! 🎉');
      setRating(0);
      setFeedbackText('');
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      setSubmitStatus('Failed to send. Please try again.');
      setTimeout(() => setSubmitStatus(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (value) => {
    const texts = { 1: 'Needs Improvement', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };
    return texts[value] || '';
  };

  return (
    <>
      <ModalOverlay isOpen={isPopupOpen} onClick={closePopup}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <div className="title-group">
              <span className="title-icon">{popupData?.icon}</span>
              <span className="title-text">{popupData?.title}</span>
              {popupData?.badge && <span className="title-badge">{popupData.badge}</span>}
            </div>
            <button className="close-btn" onClick={closePopup}><CloseXIcon /></button>
          </ModalHeader>
          <ModalBody>{popupData?.content}</ModalBody>
        </ModalContainer>
      </ModalOverlay>

      <Overlay isOpen={isOpen} onClick={onClose} />
      <SidebarContainer isOpen={isOpen}>
        <CloseButton isOpen={isOpen} onClick={onClose}>✕</CloseButton>
        <SidebarContent>
          <SidebarHeader>
            <div className="avatar">MT</div>
            <div className="user-info">
              <div className="user-name">John Trader</div>
              <div className="user-email">john@mytradeapp.com</div>
            </div>
          </SidebarHeader>

          <NavSection>
            <SectionLabel>Updates</SectionLabel>
            <NavItem active={activeItem === 'notifications'} onClick={handleNotificationsClick}>
              <span className="nav-icon"><BellIcon /></span>
              <span className="nav-label">Notifications</span>
              {hasNotifications && <span className="notification-dot" />}
              <span className="badge">2</span>
            </NavItem>
            <NavItem active={activeItem === 'voice'} onClick={handleVoiceClick}>
              <span className="nav-icon">{voiceEnabled ? <VoiceIcon /> : <VoiceOffIcon />}</span>
              <span className="nav-label">Voice Notifications</span>
              <span className="badge" style={{ 
                background: voiceEnabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', 
                color: voiceEnabled ? '#10B981' : '#EF4444' 
              }}>{voiceEnabled ? 'On' : 'Off'}</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Learning</SectionLabel>
            <NavItem active={activeItem === 'academy'} onClick={() => handleNavClick('academy', '/academy')}>
              <span className="nav-icon"><AcademyIcon /></span>
              <span className="nav-label">MyTradeApp Academy</span>
              <span className="badge">NEW</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Account</SectionLabel>
            <NavItem active={activeItem === 'account-info'} onClick={handleAccountInfoClick}>
              <span className="nav-icon"><AccountIcon /></span>
              <span className="nav-label">Account Info</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Trading</SectionLabel>
            <NavItem active={activeItem === 'copy-trading'} onClick={() => handleNavClick('copy-trading', '/copy-trading')}>
              <span className="nav-icon"><CopyIcon /></span>
              <span className="nav-label">Copy Trading</span>
              <span className="badge">BETA</span>
            </NavItem>
            <NavItem active={activeItem === 'account-management'} onClick={() => handleNavClick('account-management', '/account-management')}>
              <span className="nav-icon"><ManagementIcon /></span>
              <span className="nav-label">Account Management</span>
              <span className="badge">NEW</span>
            </NavItem>
            <NavItem active={activeItem === 'risk-calculator'} onClick={handleRiskCalculatorClick}>
              <span className="nav-icon"><RiskIcon /></span>
              <span className="nav-label">Risk Calculator</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Wellness</SectionLabel>
            <SideCard>
              <div className="card-title"><span className="icon"><ShieldIcon /></span>Responsible Trading</div>
              <div className="card-item"><span className="bullet">•</span><span>Set <span className="highlight">deposit limits</span> to control your capital budget.</span></div>
              <div className="card-item"><span className="bullet">•</span><span>Take regular <span className="highlight">trading breaks</span> to maintain discipline.</span></div>
              <div className="card-item"><span className="bullet">•</span><span>Trade only with risk capital you can afford to lose.</span></div>
              <div className="learn-more" onClick={() => handleNavClick('responsible-trading', '/responsible-trading')}>Learn more →</div>
            </SideCard>
          </NavSection>

          <NavSection>
            <SectionLabel>Feedback</SectionLabel>
            <FeedbackSection>
              <div className="feedback-label">Rate your experience</div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''} ${star <= hoverRating && star > rating ? 'hover' : ''}`} 
                    onClick={() => setRating(star)} 
                    onMouseEnter={() => setHoverRating(star)} 
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  </button>
                ))}
              </div>
              <div className="star-rating-text">{rating > 0 ? getRatingText(rating) : 'Tap a star to rate'}</div>
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
              {submitStatus && <div className="feedback-status">{submitStatus}</div>}
            </FeedbackSection>
          </NavSection>

          <NavSection>
            <SectionLabel>Information</SectionLabel>
            <NavItem active={activeItem === 'how-to-use'} onClick={handleHowToUseClick}>
              <span className="nav-icon"><BookIcon /></span>
              <span className="nav-label">How to Use</span>
            </NavItem>
            <NavItem active={activeItem === 'terms'} onClick={handleTermsClick}>
              <span className="nav-icon"><TermsIcon /></span>
              <span className="nav-label">Terms & Conditions</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Company</SectionLabel>
            <SideCard>
              <div className="card-title"><span className="icon"><CompanyIcon /></span>About MyTradeApp</div>
              <div className="card-item"><span className="bullet">•</span><span>Third-party trading application for Deriv platform.</span></div>
              <div className="card-item"><span className="bullet">•</span><span>Provides real-time API market streams and automated execution tools.</span></div>
              <div className="learn-more" onClick={() => handleNavClick('about', '/about')}>About us →</div>
            </SideCard>
          </NavSection>
        </SidebarContent>

        <SidebarFooter>
          <div className="footer-item" onClick={() => handleNavClick('settings', '/settings')}>
            <span className="footer-icon"><SettingsIcon /></span> Settings
          </div>
          <div className="footer-item" onClick={() => handleNavClick('help', '/help')}>
            <span className="footer-icon"><HelpIcon /></span> Help & Support
          </div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default OptionSideBar;