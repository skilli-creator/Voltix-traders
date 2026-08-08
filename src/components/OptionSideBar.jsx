// src/components/OptionSideBar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Academy from '../pages/Academy'; // <-- Correct import path

// ============================================
// KEYFRAMES
// ============================================
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.45); }
  50% { opacity: 0.85; transform: scale(1.12); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
`;

const modalSlideIn = keyframes`
  from { opacity: 0; transform: scale(0.94) translateY(24px); }
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

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
`;

// ============================================
// SVG ICONS
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

const CopyTradeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const PerformanceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const JournalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const DiamondIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const AwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <polyline points="9 14 9 22 12 20 15 22 15 14" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const UserPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ============================================
// FULL PANEL (Right Side Slide-in)
// ============================================
const FullPanelOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);   /* transparent, no blur */
  z-index: 2000;
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: flex-end;
  animation: ${modalBackdrop} 0.3s ease;
`;

const FullPanelContainer = styled.div`
  width: 75%;
  height: 100vh;
  height: 100dvh;
  background: ${props => props.theme?.colors?.surface || '#0F172A'};
  border-left: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  animation: ${slideInRight} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.4);

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
      ${props => props.theme?.colors?.accent || '#3B82F6'},
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 4s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FullPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  flex-shrink: 0;

  .panel-title-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .panel-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  }

  .panel-title {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    letter-spacing: -0.3px;
  }

  .panel-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
    background: transparent;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
      transform: rotate(90deg);
    }
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    .panel-title { font-size: 16px; }
    .panel-icon { width: 34px; height: 34px; }
  }
`;

const FullPanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.12)'};
    border-radius: 99px;
  }

  & > div {
    padding: 24px 28px;
  }

  @media (max-width: 480px) {
    & > div {
      padding: 16px;
    }
  }
`;

// ============================================
// PREMIUM MODAL (Small Popups)
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);   /* very light, background visible, no blur */
  z-index: 1000;
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${modalBackdrop} 0.28s ease;
  overflow: hidden;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const ModalContainer = styled.div`
  max-width: ${props => props.settings ? '560px' : '480px'};
  width: 100%;
  max-height: 90vh;
  background: ${props => props.theme?.colors?.surface || '#0F172A'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  border-radius: 20px;
  box-shadow: ${props => props.theme?.colors?.shadow || '0 32px 80px rgba(0, 0, 0, 0.6)'};
  animation: ${modalSlideIn} 0.32s cubic-bezier(0.16, 1, 0.3, 1);
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
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme?.colors?.accent || '#3B82F6'},
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 4s ease-in-out infinite;
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
    margin: 8px;
    border-radius: 16px;
    max-height: 92vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  flex-shrink: 0;
  position: relative;
  z-index: 1;

  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.1)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
    flex-shrink: 0;
  }

  .title-text {
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    letter-spacing: -0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title-badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 999px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.1)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
    flex-shrink: 0;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
    background: transparent;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    cursor: pointer;
    transition: all 0.25s ease;
    flex-shrink: 0;

    &:hover {
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
      transform: rotate(90deg) scale(1.05);
    }
  }

  @media (max-width: 480px) {
    padding: 12px 14px 10px;
    .title-text { font-size: 14px; }
    .title-icon { width: 30px; height: 30px; }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
  position: relative;
  z-index: 1;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.12)'};
    border-radius: 99px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px 16px;
  }
`;

// ============================================
// JOURNAL SPECIFIC STYLES (NEW)
// ============================================
const JournalContainer = styled.div`
  display: flex; flex-direction: column; height: 100%;
  color: ${p => p.theme?.colors?.text || '#F8FAFC'};
`;

const JournalToolbar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0; border-bottom: 1px solid ${p => p.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  margin-bottom: 16px; flex-wrap: wrap; gap: 12px;

  .toolbar-left { display: flex; align-items: center; gap: 12px; }
  .toolbar-right { display: flex; align-items: center; gap: 12px; }
`;

const FilterChip = styled.button`
  padding: 6px 14px; border-radius: 20px;
  border: 1px solid ${p => p.active ? p.theme?.colors?.accent || '#3B82F6' : 'rgba(255,255,255,0.08)'};
  background: ${p => p.active ? (p.theme?.colors?.accentLight || 'rgba(59,130,246,0.1)') : 'transparent'};
  color: ${p => p.active ? p.theme?.colors?.accent || '#3B82F6' : p.theme?.colors?.textSecondary || '#94A3B8'};
  font-size: 11px; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: rgba(255,255,255,0.12); color: ${p => p.theme?.colors?.text || '#F8FAFC'}; }
`;

const JournalButton = styled.button`
  padding: 7px 16px; border-radius: 8px;
  border: 1px solid ${p => p.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  background: ${p => p.primary ? (p.theme?.colors?.accent || '#3B82F6') : 'transparent'};
  color: ${p => p.primary ? '#ffffff' : p.theme?.colors?.textSecondary || '#94A3B8'};
  font-size: 11px; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: ${p => p.theme?.colors?.accent || '#3B82F6'}; color: ${p => p.theme?.colors?.text || '#F8FAFC'}; }
`;

const StatsRow = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px; margin-bottom: 20px;
`;

const StatBox = styled.div`
  background: ${p => p.theme?.colors?.bg || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${p => p.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 10px; padding: 12px 14px;
  text-align: center;
  .stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.6px; color: ${p => p.theme?.colors?.textMuted || '#64748B'}; margin-bottom: 4px; }
  .stat-value { font-size: 20px; font-weight: 700; color: ${p => p.color || p.theme?.colors?.text || '#F8FAFC'}; font-family: 'Courier New', monospace; }
  .stat-sub { font-size: 10px; color: ${p => p.theme?.colors?.textMuted || '#94A3B8'}; margin-top: 2px; }
`;

const TableContainer = styled.div`
  flex: 1; overflow-y: auto; border-radius: 10px;
  border: 1px solid ${p => p.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  background: ${p => p.theme?.colors?.bg || 'rgba(255,255,255,0.02)'};
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
`;

const JournalTable = styled.table`
  width: 100%; border-collapse: collapse; font-size: 11px;
  th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.04); }
  th { font-weight: 600; color: ${p => p.theme?.colors?.textMuted || '#64748B'}; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; position: sticky; top: 0; background: ${p => p.theme?.colors?.surface || '#0F172A'}; }
  td { color: ${p => p.theme?.colors?.textSecondary || '#CBD5E1'}; }
  .win { color: #10B981; font-weight: 600; }
  .loss { color: #EF4444; font-weight: 600; }
  .pending { color: #F59E0B; }
  .notes-cell { max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
`;

const NoteModal = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.2); z-index: 3000;
  display: flex; align-items: center; justify-content: center;
  animation: ${fadeIn} 0.2s ease;
`;
const NoteModalContent = styled.div`
  background: ${p => p.theme?.colors?.surface || '#0F172A'};
  border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;
  padding: 24px; width: 90%; max-width: 420px;
  color: ${p => p.theme?.colors?.text || '#F8FAFC'};
  display: flex; flex-direction: column; gap: 12px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6);
  .title { font-size: 15px; font-weight: 700; }
  textarea { flex: 1; min-height: 80px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; color: inherit; padding: 12px; font-size: 12px; outline: none; resize: vertical; }
  .actions { display: flex; gap: 8px; justify-content: flex-end; }
`;

// ============================================
// SETTINGS STYLES
// ============================================
const SettingsProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 20px;
  background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 14px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  margin-bottom: 18px;
  animation: ${fadeUp} 0.3s ease;

  .profile-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  }

  .profile-info {
    flex: 1;
    min-width: 0;
  }

  .profile-name {
    font-size: 17px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    letter-spacing: -0.2px;
  }

  .profile-email {
    font-size: 13px;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-top: 2px;
  }

  .profile-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #10B981;
    background: rgba(16, 185, 129, 0.1);
    padding: 3px 12px;
    border-radius: 999px;
    margin-top: 4px;

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10B981;
      animation: ${pulseGlow} 2s infinite;
    }
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  animation: ${fadeUp} 0.4s ease;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsCard = styled.div`
  background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 14px;
  padding: 16px 18px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  }

  .card-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.theme?.colors?.textMuted || '#4b5563'};
    }
  }
`;

const SettingsField = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    font-size: 9.5px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#475569'};
    margin-bottom: 3px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .val {
    font-size: 12px;
    color: ${props => props.theme?.colors?.text || '#e2e8f0'};
    padding: 6px 10px;
    background: ${props => props.theme?.colors?.surface || 'rgba(255, 255, 255, 0.02)'};
    border-radius: 8px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.03)'};
    min-height: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .age-badge {
    font-size: 9px;
    color: #4ade80;
    background: rgba(34, 197, 94, 0.06);
    padding: 2px 8px;
    border-radius: 20px;
    border: 1px solid rgba(34, 197, 94, 0.06);
    font-weight: 500;
    margin-left: 8px;
    white-space: nowrap;
  }

  input.inp, select.inp {
    width: 100%;
    padding: 6px 10px;
    background: ${props => props.theme?.colors?.surface || 'rgba(255, 255, 255, 0.02)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
    border-radius: 8px;
    color: ${props => props.theme?.colors?.text || '#e2e8f0'};
    font-size: 12px;
    transition: all 0.2s ease;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: ${props => props.theme?.colors?.accent || 'rgba(34, 197, 94, 0.28)'};
      box-shadow: 0 0 12px ${props => props.theme?.colors?.accentLight || 'rgba(34, 197, 94, 0.05)'};
      background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.03)'};
    }

    &::placeholder {
      color: ${props => props.theme?.colors?.textMuted || '#374151'};
    }

    &.err {
      border-color: rgba(239, 68, 68, 0.3);
    }
  }

  select.inp {
    appearance: none;
    cursor: pointer;

    option {
      background: ${props => props.theme?.colors?.surface || '#040810'};
      color: ${props => props.theme?.colors?.text || '#e2e8f0'};
    }
  }

  .err-msg {
    font-size: 9.5px;
    color: #ef4444;
    margin-top: 3px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const SettingsBtnRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const SettingsBtn = styled.button`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: inherit;

  &.primary {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #040810;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(34, 197, 94, 0.25);
    }
  }

  &.secondary {
    background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.03)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
    color: ${props => props.theme?.colors?.text || '#e2e8f0'};

    &:hover {
      background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.06)'};
      transform: translateY(-2px);
    }
  }

  &.danger {
    background: rgba(239, 68, 68, 0.07);
    border: 1px solid rgba(239, 68, 68, 0.14);
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.14);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.1);
    }
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 480px) {
    padding: 5px 12px;
    font-size: 9.5px;
  }
`;

const SettingsDangerZone = styled.div`
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.025);
  border: 1px solid rgba(239, 68, 68, 0.05);

  .dtitle {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #ef4444;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 3px;
  }

  .ddesc {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    margin-bottom: 8px;
  }
`;

const SettingsSuccess = styled.div`
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.1);
  color: #4ade80;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 11px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 7px;
  animation: ${fadeUp} 0.4s ease;
`;

// ============================================
// HELP & SUPPORT STYLES
// ============================================
const HelpContactCard = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  margin-bottom: 10px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || 'rgba(59, 130, 246, 0.3)'};
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.02)'};
  }

  .contact-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-bottom: 6px;
  }

  .contact-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .contact-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.06)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    flex-shrink: 0;
  }

  .contact-info {
    flex: 1;
    min-width: 0;
  }

  .contact-title {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
  }

  .contact-value {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
    word-break: break-all;
  }

  .contact-action {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
    background: transparent;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: ${props => props.theme?.colors?.accent || '#3B82F6'};
      color: #ffffff;
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    }
  }
`;

// ============================================
// RISK CALCULATOR STYLES
// ============================================
const RiskInputGroup = styled.div`
  margin-bottom: 16px;

  .risk-label {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    .risk-hint {
      font-size: 9px;
      font-weight: 400;
      opacity: 0.4;
      text-transform: none;
      letter-spacing: 0;
    }
  }

  .risk-input-wrap {
    display: flex;
    align-items: center;
    background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      box-shadow: 0 0 0 4px ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.1)'};
    }

    .risk-prefix {
      padding: 12px 14px;
      font-size: 14px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
      background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.03)'};
      border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
      min-width: 40px;
      text-align: center;
    }

    input {
      flex: 1;
      padding: 12px 14px;
      background: transparent;
      border: none;
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      font-size: 15px;
      font-weight: 600;
      outline: none;
      width: 100%;
      min-width: 0;

      &::placeholder {
        color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
        font-weight: 400;
        opacity: 0.3;
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
  }
`;

const RiskCalculateBtn = styled.button`
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 4px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    animation: ${shimmer} 4s ease-in-out infinite;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.3)'};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RiskResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
  animation: ${fadeUp} 0.5s ease;

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const RiskResultBox = styled.div`
  padding: 14px 12px;
  border-radius: 12px;
  text-align: center;
  background: ${props =>
    props.type === 'risk'
      ? 'rgba(239, 68, 68, 0.06)'
      : props.type === 'reward'
      ? 'rgba(16, 185, 129, 0.06)'
      : props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.06)'};
  border: 1px solid ${props =>
    props.type === 'risk'
      ? 'rgba(239, 68, 68, 0.1)'
      : props.type === 'reward'
      ? 'rgba(16, 185, 129, 0.1)'
      : props.theme?.colors?.border || 'rgba(59, 130, 246, 0.1)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  }

  .result-label {
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-bottom: 4px;
  }

  .result-value {
    font-size: 18px;
    font-weight: 700;
    color: ${props =>
      props.type === 'risk'
        ? '#EF4444'
        : props.type === 'reward'
        ? '#10B981'
        : props.theme?.colors?.accent || '#3B82F6'};
  }

  .result-sub {
    font-size: 9px;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-top: 4px;
    opacity: 0.6;
    font-weight: 500;
  }
`;

const RiskSummaryBox = styled.div`
  margin-top: 14px;
  padding: 14px 18px;
  background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 12px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  animation: ${fadeUp} 0.6s ease;

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    font-size: 12px;
    font-weight: 500;

    .label {
      color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    }

    .value {
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      font-weight: 600;
    }

    &.highlight-risk .value {
      color: #EF4444;
    }

    &.highlight-reward .value {
      color: #10B981;
    }

    &.highlight-ratio .value {
      color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    }
  }

  .summary-divider {
    height: 1px;
    background: ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
    margin: 6px 0;
  }
`;

// ============================================
// COPY TRADING STYLES
// ============================================
const CopyTradingWrapper = styled.div`
  animation: ${fadeUp} 0.4s ease;
`;

const CopyHeroSection = styled.div`
  text-align: center;
  padding: 8px 0 14px;

  .badge {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 20px;
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.1);
    color: #38bdf8;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .title {
    font-size: 20px;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.1;
    margin-bottom: 4px;

    .gradient {
      background: linear-gradient(135deg, #22c55e, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .subtitle {
    font-size: 12px;
    color: #94a3b8;
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.5;
  }
`;

const MasterTraderCardCompact = styled.div`
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.04), rgba(129, 140, 248, 0.02));
  border: 1px solid rgba(56, 189, 248, 0.06);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.03), transparent 70%);
    border-radius: 50%;
  }

  .master-header {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;

    .master-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #22c55e, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(56, 189, 248, 0.2);
    }

    .master-info {
      flex: 1;
      min-width: 0;

      .master-name {
        font-size: 14px;
        font-weight: 700;
        color: #f1f5f9;
      }

      .master-title {
        font-size: 10px;
        color: #64748b;
        display: flex;
        align-items: center;
        gap: 5px;

        .live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
          animation: ${breathe} 2s ease-in-out infinite;
        }
      }
    }

    .master-badge {
      font-size: 9px;
      padding: 3px 12px;
      border-radius: 20px;
      background: rgba(34, 197, 94, 0.08);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.1);
      font-weight: 600;
      flex-shrink: 0;
    }
  }

  .master-stats {
    display: flex;
    gap: 16px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.02);
    position: relative;
    z-index: 1;

    .stat {
      .stat-value {
        font-size: 14px;
        font-weight: 700;
        color: #f1f5f9;
        font-family: 'Courier New', monospace;
      }
      .stat-label {
        font-size: 8px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-top: 1px;
      }
    }
  }
`;

const ClientsGridCompact = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const ClientCardCompact = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid ${props => props.active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.04)'};
  border-radius: 12px;
  padding: 12px 12px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: rgba(56, 189, 248, 0.06);
    background: rgba(255, 255, 255, 0.02);
  }

  ${props => props.active && `
    border-color: rgba(34, 197, 94, 0.15);
    background: rgba(34, 197, 94, 0.02);
  `}

  .client-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;

    .client-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #818cf8, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .client-info {
      flex: 1;
      min-width: 0;

      .client-name {
        font-size: 11px;
        font-weight: 600;
        color: #f1f5f9;
      }

      .client-token {
        font-size: 8px;
        color: #64748b;
        font-family: 'Courier New', monospace;
        word-break: break-all;
      }
    }

    .status-badge {
      font-size: 7px;
      padding: 2px 8px;
      border-radius: 20px;
      font-weight: 600;
      flex-shrink: 0;

      &.active {
        background: rgba(34, 197, 94, 0.08);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.1);
      }

      &.pending {
        background: rgba(251, 191, 36, 0.08);
        color: #fbbf24;
        border: 1px solid rgba(251, 191, 36, 0.1);
      }

      &.inactive {
        background: rgba(239, 68, 68, 0.08);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.1);
      }
    }
  }

  .client-details {
    display: flex;
    gap: 8px;
    margin: 4px 0 6px;
    padding: 4px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);

    .detail {
      flex: 1;
      text-align: center;

      .detail-value {
        font-size: 11px;
        font-weight: 700;
        color: #f1f5f9;
        font-family: 'Courier New', monospace;
      }

      .detail-label {
        font-size: 6px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-top: 1px;
      }
    }
  }

  .client-actions {
    display: flex;
    gap: 4px;

    .action-btn {
      flex: 1;
      padding: 4px 0;
      border: none;
      border-radius: 6px;
      font-size: 9px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &.remove {
        background: rgba(239, 68, 68, 0.08);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.1);

        &:hover {
          background: rgba(239, 68, 68, 0.15);
        }
      }

      &.view {
        background: rgba(255, 255, 255, 0.04);
        color: #94a3b8;
        border: 1px solid rgba(255, 255, 255, 0.04);

        &:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #f1f5f9;
        }
      }

      &.activate {
        background: rgba(34, 197, 94, 0.08);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.1);

        &:hover {
          background: rgba(34, 197, 94, 0.15);
        }
      }
    }
  }
`;

const AddClientButtonCompact = styled.button`
  padding: 12px 0;
  border: 2px dashed rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 100%;

  &:hover {
    border-color: rgba(56, 189, 248, 0.2);
    background: rgba(255, 255, 255, 0.01);
    color: #f1f5f9;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
  }

  .text {
    font-size: 11px;
  }

  .sub-text {
    font-size: 9px;
    color: #4a4f5e;
  }
`;

const EmptyStateCompact = styled.div`
  text-align: center;
  padding: 20px 16px;
  border: 1px dashed rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  grid-column: 1 / -1;

  .empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4a4f5e;
    margin-bottom: 8px;
  }

  .empty-title {
    font-size: 13px;
    font-weight: 600;
    color: #f1f5f9;
  }

  .empty-sub {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
  }
`;

const ConnectSectionCompact = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 14px;

  .section-title {
    font-size: 13px;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-subtitle {
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 10px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .input-wrapper {
      position: relative;

      .input-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      input {
        width: 100%;
        padding: 8px 10px 8px 34px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        color: #f1f5f9;
        font-size: 12px;
        outline: none;
        transition: all 0.2s ease;
        font-family: 'Courier New', monospace;

        &::placeholder {
          color: #4a4f5e;
        }

        &:focus {
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.05);
        }
      }
    }

    .action-row {
      display: flex;
      gap: 8px;
      width: 100%;

      .connect-btn {
        flex: 1;
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #2962ff, #1a4fcf);
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(41, 98, 255, 0.3);
        }

        &:active:not(:disabled) {
          transform: scale(0.98);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
          animation: ${shimmer} 4s ease-in-out infinite;
        }
      }

      .cancel-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(239, 68, 68, 0.2);
        }
      }
    }
  }

  .connection-status {
    margin-top: 8px;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 6px;

    &.success {
      background: rgba(34, 197, 94, 0.04);
      border: 1px solid rgba(34, 197, 94, 0.06);
      color: #22c55e;
    }

    &.error {
      background: rgba(239, 68, 68, 0.04);
      border: 1px solid rgba(239, 68, 68, 0.06);
      color: #ef4444;
    }

    &.info {
      background: rgba(56, 189, 248, 0.04);
      border: 1px solid rgba(56, 189, 248, 0.06);
      color: #38bdf8;
    }

    .status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      flex-shrink: 0;

      &.green { background: #22c55e; animation: ${breathe} 2s ease-in-out infinite; }
      &.red { background: #ef4444; }
      &.blue { background: #38bdf8; animation: ${breathe} 2s ease-in-out infinite; }
    }
  }
`;

// ============================================
// RESPONSIBLE TRADING POPUP
// ============================================
const ResponsibleTradingContent = styled.div`
  .rt-section {
    margin-bottom: 16px;
    padding: 14px 16px;
    border-radius: 12px;
    background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  }

  .rt-title {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rt-desc {
    font-size: 11.5px;
    line-height: 1.7;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
  }

  .rt-bullet {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 4px 0;
    font-size: 11.5px;
    line-height: 1.6;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};

    .bullet-dot {
      color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .highlight {
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      font-weight: 600;
    }
  }

  .rt-tip {
    padding: 12px 16px;
    border-radius: 10px;
    background: rgba(59, 130, 246, 0.04);
    border: 1px solid rgba(59, 130, 246, 0.08);
    margin-top: 10px;

    .tip-title {
      font-size: 11px;
      font-weight: 600;
      color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      margin-bottom: 2px;
    }

    .tip-text {
      font-size: 11px;
      color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
      line-height: 1.6;
    }
  }
`;

// ============================================
// ABOUT US POPUP
// ============================================
const AboutContent = styled.div`
  .about-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px;
    margin-bottom: 16px;
    border-radius: 14px;
    background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    }

    .logo-text {
      font-size: 22px;
      font-weight: 800;
      background: linear-gradient(135deg, #3B82F6, #1D4ED8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .about-section {
    margin-bottom: 14px;
    padding: 14px 16px;
    border-radius: 12px;
    background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  }

  .about-title {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    margin-bottom: 4px;
  }

  .about-desc {
    font-size: 11.5px;
    line-height: 1.7;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
  }

  .about-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 10px;

    @media (max-width: 400px) {
      grid-template-columns: 1fr;
    }
  }

  .about-feature {
    padding: 10px 12px;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
    text-align: center;

    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      margin-bottom: 4px;
    }

    .feature-name {
      font-size: 10.5px;
      font-weight: 600;
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    }

    .feature-desc {
      font-size: 9.5px;
      color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
      margin-top: 2px;
    }
  }
`;

// ============================================
// NOTIFICATIONS
// ============================================
const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${props =>
    props.read
      ? 'transparent'
      : props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.06)'};
  border: 1px solid ${props =>
    props.read
      ? 'transparent'
      : props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  margin-bottom: 6px;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.04)'};
  }

  .notif-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: ${props =>
      props.type === 'trade' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)'};
    color: ${props => (props.type === 'trade' ? '#10B981' : props.theme?.colors?.accent || '#3B82F6')};
  }

  .notif-content { flex: 1; min-width: 0; }
  .notif-title {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    margin-bottom: 2px;
  }
  .notif-desc {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
    line-height: 1.45;
  }
  .notif-time {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-top: 3px;
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
// VOICE SETTINGS
// ============================================
const VoiceToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  margin-bottom: 10px;

  .toggle-label {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
  }
  .toggle-status {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 999px;
    color: ${props => (props.active ? '#10B981' : props.theme?.colors?.textMuted || '#94A3B8')};
    background: ${props =>
      props.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)'};
  }
`;

const ToggleSwitch = styled.button`
  width: 42px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: ${props =>
    props.active
      ? props.theme?.colors?.accent || '#3B82F6'
      : props.theme?.colors?.scrollbar || '#2a2e3d'};
  cursor: pointer;
  transition: background 0.25s ease;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => (props.active ? '20px' : '2px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.text || '#ffffff'};
    transition: left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  &:hover { opacity: 0.9; }
`;

const VolumeSlider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
  border-radius: 10px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  margin-bottom: 10px;

  .slider-label {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
    min-width: 28px;
  }

  input[type='range'] {
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
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    }

    &:disabled { opacity: 0.4; }
  }

  .slider-value {
    font-size: 12px;
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
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme?.colors?.borderMuted || 'rgba(255, 255, 255, 0.04)'};

  &:last-child { border-bottom: none; }

  .event-name {
    font-size: 11px;
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
    background: ${props => (props.enabled ? '#10B981' : props.theme?.colors?.textMuted || '#94A3B8')};
  }

  .event-status {
    font-size: 9px;
    font-weight: 700;
    color: ${props => (props.enabled ? '#10B981' : props.theme?.colors?.textMuted || '#94A3B8')};
    cursor: pointer;
    padding: 3px 8px;
    border-radius: 6px;
    background: ${props =>
      props.enabled ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.04)'};
    transition: opacity 0.2s ease;

    &:hover { opacity: 0.75; }
  }
`;

// ============================================
// ACCOUNT INFO
// ============================================
const AccountInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid ${props => props.theme?.colors?.borderMuted || 'rgba(255, 255, 255, 0.04)'};

  &:last-child { border-bottom: none; }

  .row-label {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
  }

  .row-value {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.success || '#10B981'};

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${props => props.theme?.colors?.success || '#10B981'};
      animation: ${pulseGlow} 2s infinite;
    }
  }
`;

// ============================================
// HOW TO USE / TERMS
// ============================================
const StepItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme?.colors?.borderMuted || 'rgba(255, 255, 255, 0.04)'};

  &:last-child { border-bottom: none; }

  .step-number {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  }

  .step-content { flex: 1; min-width: 0; }
  .step-title {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    margin-bottom: 2px;
  }
  .step-desc {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
    line-height: 1.5;
  }
`;

const TermsSection = styled.div`
  margin-bottom: 14px;

  .terms-title {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    margin-bottom: 6px;
  }

  .terms-text {
    font-size: 11px;
    line-height: 1.65;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
  }

  .terms-bullet {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 3px 0;
    font-size: 11px;
    line-height: 1.55;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};

    .bullet-dot {
      color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 1px;
    }
  }
`;

// ============================================
// SIDEBAR LAYOUT
// ============================================
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 98;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.28s ease, visibility 0.28s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 288px;
  height: 100vh;
  height: 100dvh;
  background: ${props =>
    props.theme?.colors?.sidebarBackground ||
    props.theme?.colors?.surface ||
    '#0F172A'};
  border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  transform: ${props => (props.isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 4px 0 32px rgba(0, 0, 0, 0.35);

  @media (max-width: 768px) {
    width: min(300px, 88vw);
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
  background: ${props => props.theme?.colors?.surfaceHover || 'rgba(255, 255, 255, 0.06)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)'};
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
  padding: 18px 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.12)'};
    border-radius: 99px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme?.colors?.textMuted || 'rgba(255, 255, 255, 0.25)'};
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 16px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  animation: ${slideIn} 0.3s ease;

  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      ${props => props.theme?.colors?.accent || '#3B82F6'},
      ${props => props.theme?.colors?.accentHover || '#1D4ED8'}
    );
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.4px;
    box-shadow: 0 4px 14px ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.35)'};
    flex-shrink: 0;
  }

  .user-info { flex: 1; min-width: 0; }
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
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  animation: ${slideIn} 0.35s ease;
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMuted || '#64748B'};
  text-transform: uppercase;
  letter-spacing: 0.9px;
  padding: 0 10px;
  margin-bottom: 4px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${props =>
    props.active
      ? props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.1)'
      : 'transparent'};
  color: ${props =>
    props.active
      ? props.theme?.colors?.accent || '#3B82F6'
      : props.theme?.colors?.textSecondary || '#CBD5E1'};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
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
        width: 3px;
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
    transform: scale(1.08);
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
    background: ${props =>
      props.active
        ? props.theme?.colors?.accent || '#3B82F6'
        : 'rgba(255, 255, 255, 0.06)'};
    color: ${props =>
      props.active ? '#FFFFFF' : props.theme?.colors?.textMuted || '#94A3B8'};
    text-transform: uppercase;
    letter-spacing: 0.3px;
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
  border-radius: 12px;
  background: ${props => props.theme?.colors?.bg || 'rgba(15, 23, 42, 0.35)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  animation: ${fadeIn} 0.35s ease;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || 'rgba(59, 130, 246, 0.35)'};
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
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
      color: ${props => props.theme?.colors?.accent || '#3B82F6'};
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
    font-size: 11px;
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
  border-radius: 12px;
  background: ${props => props.theme?.colors?.bg || 'rgba(15, 23, 42, 0.35)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  animation: ${fadeIn} 0.35s ease;

  .feedback-label {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    margin-bottom: 10px;
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
    color: rgba(255, 255, 255, 0.14);
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    &:hover {
      transform: scale(1.18);
    }

    &.active,
    &.hover {
      color: ${props => props.theme?.colors?.warning || '#F59E0B'};
      filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.35));
    }
  }

  .star-rating-text {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 10px;
    min-height: 16px;
    color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'};
  }

  .feedback-textarea {
    width: 100%;
    min-height: 68px;
    padding: 10px 12px;
    background: ${props => props.theme?.colors?.surface || 'rgba(255, 255, 255, 0.03)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
    border-radius: 10px;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    font-size: 12px;
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
      box-shadow: 0 0 0 3px ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)'};
    }
  }

  .feedback-submit {
    width: 100%;
    padding: 10px 0;
    border: none;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.accent || '#3B82F6'};
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: ${props => props.theme?.colors?.accentHover || '#2563EB'};
      box-shadow: 0 4px 14px ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.25)'};
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
    font-size: 11px;
    text-align: center;
    color: ${props => props.theme?.colors?.success || '#10B981'};
    font-weight: 500;
  }
`;

const SidebarFooter = styled.footer`
  flex-shrink: 0;
  padding: 12px 14px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  background: ${props =>
    props.theme?.colors?.sidebarBackground ||
    props.theme?.colors?.surface ||
    '#0F172A'};
  display: flex;
  flex-direction: column;
  gap: 2px;

  .footer-item {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${props => props.theme?.colors?.textSecondary || '#94A3B8'};
    font-size: 12px;
    font-weight: 500;

    &:hover {
      background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)'};
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
// GLOBAL LOG TRADE FUNCTION (NEW)
// ============================================
if (!window.logTrade) {
  window.logTrade = (trade) => {
    const journal = JSON.parse(localStorage.getItem('tradeJournal') || '[]');
    journal.unshift({ ...trade, id: trade.id || Date.now(), notes: trade.notes || '' });
    localStorage.setItem('tradeJournal', JSON.stringify(journal));
    window.dispatchEvent(new Event('tradeLogUpdated'));
  };
}

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
  const [isSettingsPopup, setIsSettingsPopup] = useState(false);

  // Full Panel state
  const [isFullPanelOpen, setIsFullPanelOpen] = useState(false);
  const [fullPanelContent, setFullPanelContent] = useState(null);
  const [currentPanel, setCurrentPanel] = useState(null); // 'academy' or 'journal'

  // Settings state
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dobError, setDobError] = useState('');
  const [calculatedAge, setCalculatedAge] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    email: ''
  });

  // Risk calculator state
  const [calcAccountBalance, setCalcAccountBalance] = useState('');
  const [calcRiskPercent, setCalcRiskPercent] = useState(2);
  const [calcStopLoss, setCalcStopLoss] = useState(50);
  const [calcTakeProfit, setCalcTakeProfit] = useState(150);
  const [calculated, setCalculated] = useState(false);

  // Copy Trading state
  const [copyTokenInput, setCopyTokenInput] = useState('');
  const [copyClientNameInput, setCopyClientNameInput] = useState('');
  const [copyConnecting, setCopyConnecting] = useState(false);
  const [copyConnectionStatus, setCopyConnectionStatus] = useState(null);
  const [copyClients, setCopyClients] = useState([]);
  const [copyShowAddClient, setCopyShowAddClient] = useState(false);

  // ---------- NEW JOURNAL STATE ----------
  const [journalTrades, setJournalTrades] = useState([]);
  const [filter, setFilter] = useState('all'); // all, win, loss
  const [noteModal, setNoteModal] = useState(null);
  const [editNote, setEditNote] = useState('');

  // Load user data for settings
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setFormData({
      first_name: userData.first_name || 'Tonny',
      last_name: userData.last_name || 'Mutua Kyalo',
      phone: userData.phone || '',
      date_of_birth: userData.date_of_birth || '',
      gender: userData.gender || '',
      email: userData.email || 'tonnykyalo054@gmail.com'
    });
    if (userData.date_of_birth) {
      const age = calculateAge(userData.date_of_birth);
      setCalculatedAge(age);
    }
  }, []);

  // Load journal on mount and listen for updates
  useEffect(() => {
    const loadJournal = () => setJournalTrades(JSON.parse(localStorage.getItem('tradeJournal') || '[]'));
    loadJournal();
    window.addEventListener('tradeLogUpdated', loadJournal);
    return () => window.removeEventListener('tradeLogUpdated', loadJournal);
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const b = new Date(dob), t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    const m = t.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
    return age;
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 10);
    return d.toISOString().split('T')[0];
  };

  const validateDob = (dob) => {
    if (!dob) { setDobError(''); setCalculatedAge(null); return true; }
    const birthDate = new Date(dob);
    const maxDate = new Date(getMaxDate());
    if (birthDate > maxDate) {
      setDobError('You must be at least 10 years old');
      setCalculatedAge(null);
      return false;
    }
    setCalculatedAge(calculateAge(dob));
    setDobError('');
    return true;
  };

  const handleDobChange = (e) => {
    const v = e.target.value;
    setFormData(prev => ({ ...prev, date_of_birth: v }));
    validateDob(v);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (formData.date_of_birth && !validateDob(formData.date_of_birth)) return;
    
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...userData, ...formData };
    localStorage.setItem('user', JSON.stringify(updated));
    
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Delete your account? This cannot be undone.')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      closePopup();
    }
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) onClose();
  };

  const openPopup = (data, isSettings = false) => {
    setPopupData(data);
    setIsSettingsPopup(isSettings);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setPopupData(null), 300);
  };

  const openFullPanel = (content) => {
    setFullPanelContent(content);
    setIsFullPanelOpen(true);
  };

  const closeFullPanel = () => {
    setIsFullPanelOpen(false);
    setCurrentPanel(null);
    setTimeout(() => setFullPanelContent(null), 300);
  };

  const handleNavClick = (item, path) => {
    setActiveItem(item);
    if (path) navigate(path);
    closeSidebarOnMobile();
  };

  // ===== RISK CALCULATOR LOGIC =====
  const calculateRisk = () => {
    if (!calcAccountBalance || parseFloat(calcAccountBalance) <= 0) return;
    setCalculated(true);
  };

  const getRiskResults = () => {
    const balance = parseFloat(calcAccountBalance) || 0;
    const riskPercent = parseFloat(calcRiskPercent) || 0;
    const stopLoss = parseFloat(calcStopLoss) || 1;
    const takeProfit = parseFloat(calcTakeProfit) || 1;

    const riskAmount = balance * (riskPercent / 100);
    const rewardAmount = balance * ((takeProfit / stopLoss) * (riskPercent / 100));
    const riskRewardRatio = riskAmount > 0 ? rewardAmount / riskAmount : 0;
    const positionSize = stopLoss > 0 ? riskAmount / (stopLoss / 100) : 0;
    const maxLoss = riskAmount;
    const maxProfit = rewardAmount;
    const stakeAmount = riskAmount;

    return { riskAmount, rewardAmount, riskRewardRatio, positionSize, maxLoss, maxProfit, stakeAmount, balance };
  };

  const riskResults = getRiskResults();

  // ===== COPY TRADING LOGIC =====
  const handleCopyConnect = () => {
    if (!copyTokenInput.trim()) {
      setCopyConnectionStatus({
        type: 'error',
        message: 'Please enter a valid API token'
      });
      return;
    }

    if (!copyClientNameInput.trim()) {
      setCopyConnectionStatus({
        type: 'error',
        message: 'Please enter the client\'s name'
      });
      return;
    }

    setCopyConnecting(true);
    setCopyConnectionStatus({
      type: 'info',
      message: 'Adding client...'
    });

    setTimeout(() => {
      const exists = copyClients.some(c => c.token === copyTokenInput.trim());
      
      if (exists) {
        setCopyConnectionStatus({
          type: 'error',
          message: 'This client is already in your list'
        });
        setCopyConnecting(false);
        return;
      }

      const newClient = {
        id: Date.now(),
        name: copyClientNameInput.trim(),
        token: copyTokenInput.trim(),
        status: 'pending',
        copiedTrades: 0,
        profit: 0,
        avatar: copyClientNameInput.trim().slice(0, 2).toUpperCase()
      };

      setCopyClients(prev => [newClient, ...prev]);
      setCopyConnectionStatus({
        type: 'success',
        message: `Successfully added ${newClient.name}! They will copy your trades once activated.`
      });
      setCopyTokenInput('');
      setCopyClientNameInput('');
      setCopyShowAddClient(false);
      setCopyConnecting(false);

      setTimeout(() => {
        setCopyConnectionStatus(null);
      }, 5000);
    }, 1500);
  };

  const handleCopyRemoveClient = (clientId) => {
    setCopyClients(prev => prev.filter(c => c.id !== clientId));
  };

  const handleCopyActivateClient = (clientId) => {
    setCopyClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, status: 'active' } : c
    ));
  };

  const handleCopyViewClient = (clientId) => {
    // View client details
  };

  const getCopyStatusBadge = (status) => {
    const badges = {
      active: { label: 'Active', className: 'active' },
      pending: { label: 'Pending', className: 'pending' },
      inactive: { label: 'Inactive', className: 'inactive' }
    };
    return badges[status] || badges.inactive;
  };

  // ===== SETTINGS HANDLER =====
  const handleSettingsClick = () => {
    setActiveItem('settings');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setFormData({
      first_name: userData.first_name || 'Tonny',
      last_name: userData.last_name || 'Mutua Kyalo',
      phone: userData.phone || '',
      date_of_birth: userData.date_of_birth || '',
      gender: userData.gender || '',
      email: userData.email || 'tonnykyalo054@gmail.com'
    });
    if (userData.date_of_birth) {
      setCalculatedAge(calculateAge(userData.date_of_birth));
    }
    setIsEditing(false);
    setShowSuccess(false);
    setDobError('');

    openPopup({
      title: 'Account Settings',
      icon: <SettingsIcon />,
      content: (
        <>
          <SettingsProfileCard>
            <div className="profile-avatar">
              {formData.first_name && formData.last_name 
                ? `${formData.first_name[0]}${formData.last_name[0]}`.toUpperCase()
                : 'T'}
            </div>
            <div className="profile-info">
              <div className="profile-name">
                {formData.first_name || formData.last_name 
                  ? `${formData.first_name} ${formData.last_name}`.trim() 
                  : 'Tonny Mutua Kyalo'}
              </div>
              <div className="profile-email">{formData.email || 'tonnykyalo054@gmail.com'}</div>
              <div className="profile-status">
                <span className="status-dot" />
                Active
              </div>
            </div>
          </SettingsProfileCard>

          {showSuccess && (
            <SettingsSuccess>
              <CheckIcon /> Profile updated successfully!
            </SettingsSuccess>
          )}

          <SettingsGrid>
            <SettingsCard>
              <div className="card-head">
                <span className="icon"><DiamondIcon /></span> Personal Information
              </div>

              <SettingsField>
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    className="inp"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First name"
                  />
                ) : (
                  <div className="val">{formData.first_name || 'Not set'}</div>
                )}
              </SettingsField>

              <SettingsField>
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    className="inp"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last name"
                  />
                ) : (
                  <div className="val">{formData.last_name || 'Not set'}</div>
                )}
              </SettingsField>

              <SettingsField>
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    className="inp"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                  />
                ) : (
                  <div className="val">{formData.phone || 'Not set'}</div>
                )}
              </SettingsField>

              <SettingsField>
                <label>Email Address</label>
                <div className="val" style={{ color: '#64748b' }}>
                  {formData.email || 'Not set'}
                </div>
              </SettingsField>

              <SettingsField>
                <label>Date of Birth</label>
                {isEditing ? (
                  <>
                    <input
                      type="date"
                      name="date_of_birth"
                      className={`inp${dobError ? ' err' : ''}`}
                      value={formData.date_of_birth}
                      onChange={handleDobChange}
                      max={getMaxDate()}
                    />
                    {dobError && <div className="err-msg">! {dobError}</div>}
                    {formData.date_of_birth && !dobError && calculatedAge !== null && (
                      <div style={{ fontSize: '10px', color: '#4ade80', marginTop: '4px' }}>
                        ✓ Age: <strong>{calculatedAge}</strong> yrs
                      </div>
                    )}
                  </>
                ) : (
                  <div className="val">
                    <span>{formData.date_of_birth || 'Not set'}</span>
                    {formData.date_of_birth && calculatedAge !== null && (
                      <span className="age-badge">◇ {calculatedAge} yrs</span>
                    )}
                  </div>
                )}
              </SettingsField>

              <SettingsField>
                <label>Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    className="inp"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="val">
                    {formData.gender 
                      ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) 
                      : 'Not set'}
                  </div>
                )}
              </SettingsField>

              <SettingsBtnRow>
                {isEditing ? (
                  <>
                    <SettingsBtn className="primary" onClick={handleSaveProfile} disabled={!!dobError}>
                      <CheckIcon /> Save
                    </SettingsBtn>
                    <SettingsBtn
                      className="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setDobError('');
                        const userData = JSON.parse(localStorage.getItem('user') || '{}');
                        setFormData({
                          first_name: userData.first_name || 'Tonny',
                          last_name: userData.last_name || 'Mutua Kyalo',
                          phone: userData.phone || '',
                          date_of_birth: userData.date_of_birth || '',
                          gender: userData.gender || '',
                          email: userData.email || 'tonnykyalo054@gmail.com'
                        });
                        if (userData.date_of_birth) {
                          setCalculatedAge(calculateAge(userData.date_of_birth));
                        }
                      }}
                    >
                      Cancel
                    </SettingsBtn>
                  </>
                ) : (
                  <SettingsBtn className="primary" onClick={() => setIsEditing(true)}>
                    <EditIcon /> Edit Profile
                  </SettingsBtn>
                )}
              </SettingsBtnRow>
            </SettingsCard>

            <SettingsCard>
              <div className="card-head">
                <span className="icon"><DiamondIcon /></span> Security & Privacy
              </div>

              <SettingsField>
                <label>Password</label>
                <div className="val" style={{ justifyContent: 'space-between' }}>
                  <span>••••••••</span>
                  <SettingsBtn
                    className="secondary"
                    style={{ padding: '3px 10px', fontSize: '9px' }}
                    onClick={() => alert('Password change coming soon.')}
                  >
                    Change
                  </SettingsBtn>
                </div>
              </SettingsField>

              <SettingsField>
                <label>Account Created</label>
                <div className="val" style={{ color: '#64748b', fontSize: '11px' }}>
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </SettingsField>

              <SettingsDangerZone>
                <div className="dtitle"><LogoutIcon /> Danger Zone</div>
                <div className="ddesc">Permanently delete your account and all data. Cannot be undone.</div>
                <SettingsBtn className="danger" onClick={handleDeleteAccount}>
                  Delete Account
                </SettingsBtn>
              </SettingsDangerZone>
            </SettingsCard>
          </SettingsGrid>
        </>
      )
    }, true);
  };

  // ===== HELP & SUPPORT HANDLER =====
  const handleHelpClick = () => {
    setActiveItem('help');
    openPopup({
      title: 'Help & Support',
      icon: <HelpIcon />,
      content: (
        <>
          <HelpContactCard>
            <div className="contact-label">Email Support</div>
            <div className="contact-row">
              <div className="contact-icon"><EmailIcon /></div>
              <div className="contact-info">
                <div className="contact-title">Email</div>
                <div className="contact-value">tonnykyalo054@gmail.com</div>
              </div>
              <button 
                className="contact-action"
                onClick={() => window.location.href = 'mailto:tonnykyalo054@gmail.com'}
              >
                Send
              </button>
            </div>
          </HelpContactCard>

          <HelpContactCard>
            <div className="contact-label">Phone Support</div>
            <div className="contact-row">
              <div className="contact-icon"><PhoneIcon /></div>
              <div className="contact-info">
                <div className="contact-title">Call Us</div>
                <div className="contact-value">0704 182 603</div>
              </div>
              <button 
                className="contact-action"
                onClick={() => window.location.href = 'tel:0704182603'}
              >
                Call
              </button>
            </div>
          </HelpContactCard>

          <HelpContactCard>
            <div className="contact-label">WhatsApp</div>
            <div className="contact-row">
              <div className="contact-icon"><WhatsAppIcon /></div>
              <div className="contact-info">
                <div className="contact-title">WhatsApp</div>
                <div className="contact-value">0704 182 603</div>
              </div>
              <button 
                className="contact-action"
                onClick={() => window.open('https://wa.me/254704182603', '_blank')}
              >
                Chat
              </button>
            </div>
          </HelpContactCard>
        </>
      )
    });
  };

  // ===== RESPONSIBLE TRADING HANDLER =====
  const handleResponsibleTradingClick = () => {
    setActiveItem('responsible-trading');
    openPopup({
      title: 'Responsible Trading',
      icon: <ShieldIcon />,
      content: (
        <ResponsibleTradingContent>
          <div className="rt-section">
            <div className="rt-title"><InfoIcon /> What is Responsible Trading?</div>
            <div className="rt-desc">
              Responsible trading means maintaining control over your trading activities and making informed decisions. It's about protecting your financial well-being while engaging in trading activities.
            </div>
          </div>

          <div className="rt-section">
            <div className="rt-title"><DiamondIcon /> Key Principles</div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Set <span className="highlight">deposit limits</span> to control your capital budget and prevent overspending.</span>
            </div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Take regular <span className="highlight">trading breaks</span> to maintain discipline and avoid emotional decisions.</span>
            </div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Trade only with <span className="highlight">risk capital</span> — money you can afford to lose without affecting your daily life.</span>
            </div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Use <span className="highlight">stop-loss orders</span> to automatically limit potential losses on each trade.</span>
            </div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Never trade under the influence of <span className="highlight">alcohol or drugs</span> or during emotional distress.</span>
            </div>
          </div>

          <div className="rt-section">
            <div className="rt-title"><InfoIcon /> Warning Signs</div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Chasing losses by increasing trade sizes</span>
            </div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Borrowing money to trade</span>
            </div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Trading with money meant for essential expenses</span>
            </div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Feeling anxious or stressed about trading</span>
            </div>
            <div className="rt-bullet">
              <span className="bullet-dot">•</span>
              <span>Neglecting work, family, or health for trading</span>
            </div>
          </div>

          <div className="rt-tip">
            <div className="tip-title"><AwardIcon /> Pro Tip</div>
            <div className="tip-text">
              Consider using the <strong style={{ color: '#F8FAFC' }}>Risk Calculator</strong> tool in this sidebar to determine your optimal position size based on your account balance and risk tolerance.
            </div>
          </div>
        </ResponsibleTradingContent>
      )
    });
  };

  // ===== ABOUT US HANDLER =====
  const handleAboutClick = () => {
    setActiveItem('about');
    openPopup({
      title: 'About MyTradeApp',
      icon: <CompanyIcon />,
      content: (
        <AboutContent>
          <div className="about-logo">
            <span className="logo-icon"><LogoIcon /></span>
            <span className="logo-text">MyTradeApp</span>
          </div>

          <div className="about-section">
            <div className="about-title"><InfoIcon /> Our Mission</div>
            <div className="about-desc">
              MyTradeApp is a third-party trading application designed to provide traders with powerful tools, real-time market data, and automated execution capabilities for the Deriv platform.
            </div>
          </div>

          <div className="about-section">
            <div className="about-title"><DiamondIcon /> What We Offer</div>
            <div className="about-features">
              <div className="about-feature">
                <div className="feature-icon"><TrendingUpIcon /></div>
                <div className="feature-name">Real-Time Data</div>
                <div className="feature-desc">Live market streams</div>
              </div>
              <div className="about-feature">
                <div className="feature-icon"><SettingsIcon /></div>
                <div className="feature-name">Auto Trading</div>
                <div className="feature-desc">Automated execution</div>
              </div>
              <div className="about-feature">
                <div className="feature-icon"><ShieldIcon /></div>
                <div className="feature-name">Risk Management</div>
                <div className="feature-desc">Smart risk tools</div>
              </div>
              <div className="about-feature">
                <div className="feature-icon"><LockIcon /></div>
                <div className="feature-name">Secure</div>
                <div className="feature-desc">Your data is safe</div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <div className="about-title"><HelpIcon /> Contact Us</div>
            <div className="about-desc">
              Have questions or need support? Reach out to us through the <strong style={{ color: '#F8FAFC' }}>Help & Support</strong> section or email us at <strong style={{ color: '#3B82F6' }}>tonnykyalo054@gmail.com</strong>
            </div>
          </div>
        </AboutContent>
      )
    });
  };

  // ===== ACADEMY HANDLER (Full Panel) =====
  const handleAcademyClick = () => {
    setActiveItem('academy');
    setCurrentPanel('academy');
    openFullPanel(<Academy />);
  };

  // ===== RISK CALCULATOR HANDLER =====
  const handleRiskCalculatorClick = () => {
    setActiveItem('risk-calculator');
    setCalculated(false);
    setCalcAccountBalance('');
    openPopup({
      title: 'Risk Calculator',
      icon: <RiskIcon />,
      badge: 'Premium',
      content: (
        <>
          <RiskInputGroup>
            <div className="risk-label">
              Account Balance <span className="risk-hint">(USD)</span>
            </div>
            <div className="risk-input-wrap">
              <span className="risk-prefix">$</span>
              <input 
                type="number" 
                placeholder="Enter your account balance" 
                value={calcAccountBalance}
                onChange={(e) => setCalcAccountBalance(e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </RiskInputGroup>

          <RiskCalculateBtn 
            onClick={calculateRisk}
            disabled={!calcAccountBalance || parseFloat(calcAccountBalance) <= 0}
          >
            Calculate Risk
          </RiskCalculateBtn>

          {calculated && parseFloat(calcAccountBalance) > 0 && (
            <>
              <RiskResultsGrid>
                <RiskResultBox type="stake">
                  <div className="result-label">Stake Amount</div>
                  <div className="result-value">${riskResults.stakeAmount.toFixed(2)}</div>
                  <div className="result-sub">per trade</div>
                </RiskResultBox>
                <RiskResultBox type="risk">
                  <div className="result-label">Risk Amount</div>
                  <div className="result-value">${riskResults.riskAmount.toFixed(2)}</div>
                  <div className="result-sub">{calcRiskPercent}% of balance</div>
                </RiskResultBox>
                <RiskResultBox type="reward">
                  <div className="result-label">Reward Amount</div>
                  <div className="result-value">${riskResults.rewardAmount.toFixed(2)}</div>
                  <div className="result-sub">
                    {((parseFloat(calcTakeProfit) / parseFloat(calcStopLoss)) * parseFloat(calcRiskPercent)).toFixed(2)}%
                  </div>
                </RiskResultBox>
              </RiskResultsGrid>

              <RiskSummaryBox>
                <div className="summary-row">
                  <span className="label">Position Size</span>
                  <span className="value">{riskResults.positionSize.toFixed(2)} units</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row highlight-risk">
                  <span className="label">Max Loss</span>
                  <span className="value">${riskResults.maxLoss.toFixed(2)}</span>
                </div>
                <div className="summary-row highlight-reward">
                  <span className="label">Max Profit</span>
                  <span className="value">${riskResults.maxProfit.toFixed(2)}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row highlight-ratio">
                  <span className="label">Risk/Reward Ratio</span>
                  <span className="value">1:{riskResults.riskRewardRatio.toFixed(2)}</span>
                </div>
              </RiskSummaryBox>
            </>
          )}
        </>
      )
    });
  };

  // ===== COPY TRADING HANDLER =====
  const handleCopyTradingClick = () => {
    setActiveItem('copy-trading');
    setCopyShowAddClient(false);
    setCopyConnectionStatus(null);
    
    openPopup({
      title: 'Copy Trading',
      icon: <CopyTradeIcon />,
      badge: 'BETA',
      content: (
        <CopyTradingWrapper>
          <CopyHeroSection>
            <div className="badge">Copy Trading</div>
            <h1 className="title">
              Copy <span className="gradient">Trading</span>
            </h1>
            <p className="subtitle">
              Master trader dashboard. Manage your followers and share your trades with them.
            </p>
          </CopyHeroSection>

          <MasterTraderCardCompact>
            <div className="master-header">
              <div className="master-avatar">VT</div>
              <div className="master-info">
                <div className="master-name">John Trader</div>
                <div className="master-title">
                  <span className="live-dot" />
                  Master Trader • Live Copy Trading
                </div>
              </div>
              <span className="master-badge">Active</span>
            </div>
            <div className="master-stats">
              <div className="stat">
                <div className="stat-value">{copyClients.filter(c => c.status === 'active').length}</div>
                <div className="stat-label">Active Followers</div>
              </div>
              <div className="stat">
                <div className="stat-value">{copyClients.reduce((sum, c) => sum + c.copiedTrades, 0)}</div>
                <div className="stat-label">Total Copied Trades</div>
              </div>
              <div className="stat">
                <div className="stat-value" style={{ color: '#22c55e' }}>
                  ${copyClients.reduce((sum, c) => sum + c.profit, 0).toFixed(2)}
                </div>
                <div className="stat-label">Total Follower Profit</div>
              </div>
            </div>
          </MasterTraderCardCompact>

          <ClientsGridCompact>
            {copyClients.length === 0 ? (
              <EmptyStateCompact>
                <div className="empty-icon"><UsersIcon /></div>
                <div className="empty-title">No Followers Yet</div>
                <div className="empty-sub">
                  Click the "Add Client" button below to start adding followers.
                </div>
              </EmptyStateCompact>
            ) : (
              copyClients.map((client) => {
                const status = getCopyStatusBadge(client.status);
                
                return (
                  <ClientCardCompact key={client.id} active={client.status === 'active'}>
                    <div className="client-header">
                      <div className="client-avatar">{client.avatar}</div>
                      <div className="client-info">
                        <div className="client-name">{client.name}</div>
                        <div className="client-token">{client.token}</div>
                      </div>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="client-details">
                      <div className="detail">
                        <div className="detail-value">{client.copiedTrades}</div>
                        <div className="detail-label">Trades</div>
                      </div>
                      <div className="detail">
                        <div className="detail-value" style={{ color: client.profit > 0 ? '#22c55e' : '#ef4444' }}>
                          ${client.profit.toFixed(2)}
                        </div>
                        <div className="detail-label">Profit</div>
                      </div>
                    </div>

                    <div className="client-actions">
                      {client.status === 'pending' ? (
                        <>
                          <button className="action-btn activate" onClick={() => handleCopyActivateClient(client.id)}>
                            Activate
                          </button>
                          <button className="action-btn remove" onClick={() => handleCopyRemoveClient(client.id)}>
                            Remove
                          </button>
                        </>
                      ) : client.status === 'active' ? (
                        <>
                          <button className="action-btn view" onClick={() => handleCopyViewClient(client.id)}>
                            View
                          </button>
                          <button className="action-btn remove" onClick={() => handleCopyRemoveClient(client.id)}>
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="action-btn activate" onClick={() => handleCopyActivateClient(client.id)}>
                            Reactivate
                          </button>
                          <button className="action-btn remove" onClick={() => handleCopyRemoveClient(client.id)}>
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </ClientCardCompact>
                );
              })
            )}

            {!copyShowAddClient ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <AddClientButtonCompact onClick={() => setCopyShowAddClient(true)}>
                  <span className="icon"><UserPlusIcon /></span>
                  <span className="text">Add Client</span>
                  <span className="sub-text">Enter their API token to start copy trading</span>
                </AddClientButtonCompact>
              </div>
            ) : (
              <div style={{ gridColumn: '1 / -1' }}>
                <ConnectSectionCompact>
                  <div className="section-title"><UserPlusIcon /> Add New Client</div>
                  <div className="section-subtitle">
                    Enter your client's name and API token to add them
                  </div>

                  <div className="input-group">
                    <div className="input-wrapper">
                      <span className="input-icon"><UserIcon /></span>
                      <input
                        type="text"
                        placeholder="Enter client's name (e.g., John Smith)"
                        value={copyClientNameInput}
                        onChange={(e) => setCopyClientNameInput(e.target.value)}
                      />
                    </div>
                    <div className="input-wrapper">
                      <span className="input-icon"><DiamondIcon /></span>
                      <input
                        type="text"
                        placeholder="Enter client's API token (e.g., 0x7a3f...9b2e)"
                        value={copyTokenInput}
                        onChange={(e) => setCopyTokenInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCopyConnect();
                        }}
                      />
                    </div>
                    <div className="action-row">
                      <button 
                        className="connect-btn" 
                        onClick={handleCopyConnect}
                        disabled={copyConnecting || !copyTokenInput.trim() || !copyClientNameInput.trim()}
                      >
                        <span className="btn-shimmer" />
                        {copyConnecting ? 'Adding...' : 'Add Client'}
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={() => {
                          setCopyShowAddClient(false);
                          setCopyTokenInput('');
                          setCopyClientNameInput('');
                          setCopyConnectionStatus(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {copyConnectionStatus && (
                    <div className={`connection-status ${copyConnectionStatus.type}`}>
                      <span className={`status-dot ${copyConnectionStatus.type === 'success' ? 'green' : copyConnectionStatus.type === 'error' ? 'red' : 'blue'}`} />
                      {copyConnectionStatus.message}
                    </div>
                  )}
                </ConnectSectionCompact>
              </div>
            )}
          </ClientsGridCompact>
        </CopyTradingWrapper>
      )
    });
  };

  // ===== PERFORMANCE HANDLER =====
  const handlePerformanceClick = () => {
    setActiveItem('performance');
    openPopup({
      title: 'Performance',
      icon: <PerformanceIcon />,
      content: (
        <div>
          <div style={{
            padding: '20px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.04)'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px', color: '#3B82F6' }}>
              <PerformanceIcon />
            </div>
            <h3 style={{ color: '#F8FAFC', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Trading Performance
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '13px' }}>
              Your trading performance metrics will appear here.
            </p>
          </div>
        </div>
      )
    });
  };

  // ===== JOURNAL HANDLER (NEW - opens in full panel) =====
  const handleJournalClick = () => {
    setActiveItem('journal');
    setCurrentPanel('journal');
    // Build journal content dynamically using current state
    const journalContent = (
      <JournalContainer>
        <JournalToolbar>
          <div className="toolbar-left">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All Trades</FilterChip>
            <FilterChip active={filter === 'win'} onClick={() => setFilter('win')}>Wins</FilterChip>
            <FilterChip active={filter === 'loss'} onClick={() => setFilter('loss')}>Losses</FilterChip>
          </div>
          <div className="toolbar-right">
            <JournalButton onClick={exportCSV}>Export CSV</JournalButton>
          </div>
        </JournalToolbar>

        <StatsRow>
          <StatBox color="#10B981">
            <div className="stat-label">Win Rate</div>
            <div className="stat-value">{stats.winRate}%</div>
            <div className="stat-sub">{stats.wins}W / {stats.losses}L</div>
          </StatBox>
          <StatBox color={stats.totalPnL >= 0 ? '#10B981' : '#EF4444'}>
            <div className="stat-label">Total P&L</div>
            <div className="stat-value">{stats.totalPnL >= 0 ? '+' : ''}${Math.abs(stats.totalPnL).toFixed(2)}</div>
            <div className="stat-sub">Net profit/loss</div>
          </StatBox>
          <StatBox color="#10B981">
            <div className="stat-label">Best Trade</div>
            <div className="stat-value">+${Math.abs(stats.best).toFixed(2)}</div>
            <div className="stat-sub">Max profit</div>
          </StatBox>
          <StatBox color="#EF4444">
            <div className="stat-label">Worst Trade</div>
            <div className="stat-value">-${Math.abs(stats.worst).toFixed(2)}</div>
            <div className="stat-sub">Max loss</div>
          </StatBox>
        </StatsRow>

        <TableContainer>
          <JournalTable>
            <thead>
              <tr>
                <th>Date</th><th>Market</th><th>Type</th><th>Direction</th>
                <th>Stake</th><th>Payout</th><th>Result</th>
                <th>Strategy</th><th>Mode</th><th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>No trades recorded yet.</td></tr>
              ) : (
                filteredTrades.map(t => (
                  <tr key={t.id}>
                    <td>{new Date(t.timestamp).toLocaleDateString()}<br/><span style={{fontSize:9,color:'#64748B'}}>{new Date(t.timestamp).toLocaleTimeString()}</span></td>
                    <td>{t.market}</td>
                    <td>{t.tradeType}</td>
                    <td>{t.direction}</td>
                    <td>${t.stake?.toFixed(2) || '0.00'}</td>
                    <td>${t.payout?.toFixed(2) || '0.00'}</td>
                    <td className={t.result === 'win' ? 'win' : t.result === 'loss' ? 'loss' : 'pending'}>{t.result}</td>
                    <td>{t.strategy || '-'}</td>
                    <td>{t.mode}</td>
                    <td className="notes-cell" onClick={() => { setNoteModal(t.id); setEditNote(t.notes); }}>{t.notes || 'Add note...'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </JournalTable>
        </TableContainer>
      </JournalContainer>
    );
    setFullPanelContent(journalContent);
    setIsFullPanelOpen(true);
  };

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
      title: 'Deriv Account Information',
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

  const handleHowToUseClick = () => {
    setActiveItem('how-to-use');
    openPopup({
      title: 'How to Use This Tool',
      icon: <BookIcon />,
      content: (
        <>
          <StepItem><div className="step-number">1</div><div className="step-content"><div className="step-title">Connect Your Account</div><div className="step-desc">Link your Deriv account to access real-time trading data and execute trades directly.</div></div></StepItem>
          <StepItem><div className="step-number">2</div><div className="step-content"><div className="step-title">Select a Market</div><div className="step-desc">Choose from multiple volatility indices including 1s and standard options to start trading.</div></div></StepItem>
          <StepItem><div className="step-number">3</div><div className="step-content"><div className="step-title">Choose Your Strategy</div><div className="step-desc">Select between manual, auto, or bot-assisted trading modes based on your preference.</div></div></StepItem>
          <StepItem><div className="step-number">4</div><div className="step-content"><div className="step-title">Monitor Your Positions</div><div className="step-desc">Track open positions, view performance metrics, and manage risk in real-time.</div></div></StepItem>
          <StepItem><div className="step-number">5</div><div className="step-content"><div className="step-title">Customize Experience</div><div className="step-desc">Personalize themes, notification settings, and display preferences to suit your workflow.</div></div></StepItem>
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
          <TermsSection><div className="terms-title">1. Introduction</div><div className="terms-text">Welcome to MyTradeApp. By using our third-party trading application, you agree to these Terms and Conditions.</div></TermsSection>
          <TermsSection><div className="terms-title">2. Acceptance of Terms</div><div className="terms-text">By accessing or using MyTradeApp, you confirm that you have read, understood, and agree to be bound by these Terms.</div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>You must be at least <strong style={{ color: '#F8FAFC' }}>18 years old</strong> to use this App.</span></div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>You are <strong style={{ color: '#F8FAFC' }}>solely responsible</strong> for all trading decisions.</span></div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>Trading involves <strong style={{ color: '#EF4444' }}>significant financial risk</strong>.</span></div>
          </TermsSection>
          <TermsSection><div className="terms-title">3. Services Provided</div><div className="terms-text">MyTradeApp provides automated trading, AI-assisted analysis, manual trading, bot deployment, and real-time market data from Deriv via APIs.</div></TermsSection>
          <TermsSection><div className="terms-title">4. Account Responsibility</div><div className="terms-text">You are fully responsible for all trades executed through the App. MyTradeApp does not store your login credentials.</div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>You must <strong style={{ color: '#F8FAFC' }}>not share</strong> your trading credentials.</span></div>
            <div className="terms-bullet"><span className="bullet-dot">•</span><span>You are responsible for <strong style={{ color: '#F8FAFC' }}>all financial losses</strong>.</span></div>
          </TermsSection>
          <TermsSection><div className="terms-title">5. Limitation of Liability</div><div className="terms-text">MyTradeApp provides the App "as is" without any warranties. We are not liable for any financial losses, technical issues, or damages arising from your use of the App.</div></TermsSection>
          <TermsSection><div className="terms-title">6. Privacy Policy</div><div className="terms-text">We do not store your Deriv or Forex login credentials. We collect minimal data necessary for app functionality and never sell your personal data.</div></TermsSection>
          <TermsSection><div className="terms-title">7. Governing Law</div><div className="terms-text">These Terms shall be governed by the laws of the jurisdiction where MyTradeApp operates.</div></TermsSection>
          <TermsSection><div className="terms-title">8. Contact Us</div><div className="terms-text">For questions or concerns, contact us at <strong style={{ color: '#3B82F6' }}>support@mytradeapp.com</strong></div></TermsSection>
        </>
      )
    });
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) { setSubmitStatus('Please select a rating'); setTimeout(() => setSubmitStatus(''), 3000); return; }
    if (!feedbackText.trim()) { setSubmitStatus('Please write your feedback'); setTimeout(() => setSubmitStatus(''), 3000); return; }
    setIsSubmitting(true);
    setSubmitStatus('Sending feedback...');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('Thank you for your feedback!');
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
      {/* Full Panel (Academy / Journal) */}
      <FullPanelOverlay isOpen={isFullPanelOpen} onClick={closeFullPanel}>
        <FullPanelContainer onClick={(e) => e.stopPropagation()}>
          <FullPanelHeader>
            <div className="panel-title-group">
              <span className="panel-icon">
                {currentPanel === 'journal' ? <JournalIcon /> : <AcademyIcon />}
              </span>
              <span className="panel-title">
                {currentPanel === 'journal' ? 'Trading Journal' : 'MyTradeApp Academy'}
              </span>
            </div>
            <button className="panel-close-btn" onClick={closeFullPanel}>
              <CloseIcon />
            </button>
          </FullPanelHeader>
          <FullPanelBody>
            {fullPanelContent}
          </FullPanelBody>
        </FullPanelContainer>
      </FullPanelOverlay>

      {/* Small Modal Popups (unchanged) */}
      <ModalOverlay isOpen={isPopupOpen} onClick={closePopup}>
        <ModalContainer settings={isSettingsPopup} onClick={(e) => e.stopPropagation()}>
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

      {/* Note editing modal (new) */}
      {noteModal && (
        <NoteModal onClick={() => setNoteModal(null)}>
          <NoteModalContent onClick={e => e.stopPropagation()}>
            <div className="title">Edit Trade Note</div>
            <textarea value={editNote} onChange={e => setEditNote(e.target.value)} placeholder="Add your observations..." />
            <div className="actions">
              <JournalButton onClick={() => setNoteModal(null)}>Cancel</JournalButton>
              <JournalButton primary onClick={handleNoteSave}>Save</JournalButton>
            </div>
          </NoteModalContent>
        </NoteModal>
      )}

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
              <span className="badge" style={{ background: voiceEnabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: voiceEnabled ? '#10B981' : '#EF4444' }}>{voiceEnabled ? 'On' : 'Off'}</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Learning</SectionLabel>
            <NavItem active={activeItem === 'academy'} onClick={handleAcademyClick}>
              <span className="nav-icon"><AcademyIcon /></span>
              <span className="nav-label">MyTradeApp Academy</span>
              <span className="badge">NEW</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Account</SectionLabel>
            <NavItem active={activeItem === 'account-info'} onClick={handleAccountInfoClick}>
              <span className="nav-icon"><AccountIcon /></span>
              <span className="nav-label">Deriv Account Info</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Trading</SectionLabel>
            <NavItem active={activeItem === 'copy-trading'} onClick={handleCopyTradingClick}>
              <span className="nav-icon"><CopyTradeIcon /></span>
              <span className="nav-label">Copy Trading</span>
              <span className="badge">BETA</span>
            </NavItem>
            <NavItem active={activeItem === 'performance'} onClick={handlePerformanceClick}>
              <span className="nav-icon"><PerformanceIcon /></span>
              <span className="nav-label">Performance</span>
            </NavItem>
            <NavItem active={activeItem === 'journal'} onClick={handleJournalClick}>
              <span className="nav-icon"><JournalIcon /></span>
              <span className="nav-label">Journal</span>
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
              <div className="learn-more" onClick={handleResponsibleTradingClick}>Learn more →</div>
            </SideCard>
          </NavSection>

          <NavSection>
            <SectionLabel>Feedback</SectionLabel>
            <FeedbackSection>
              <div className="feedback-label">Rate your experience</div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''} ${star <= hoverRating && star > rating ? 'hover' : ''}`} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                    <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  </button>
                ))}
              </div>
              <div className="star-rating-text">{rating > 0 ? getRatingText(rating) : 'Tap a star to rate'}</div>
              <textarea className="feedback-textarea" placeholder="Share your feedback or suggestions..." value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} disabled={isSubmitting} />
              <button className="feedback-submit" onClick={handleSubmitFeedback} disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Submit Feedback'}</button>
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
              <div className="learn-more" onClick={handleAboutClick}>About us →</div>
            </SideCard>
          </NavSection>
        </SidebarContent>

        <SidebarFooter>
          <div className="footer-item" onClick={handleSettingsClick}>
            <span className="footer-icon"><SettingsIcon /></span> Settings
          </div>
          <div className="footer-item" onClick={handleHelpClick}>
            <span className="footer-icon"><HelpIcon /></span> Help & Support
          </div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default OptionSideBar;