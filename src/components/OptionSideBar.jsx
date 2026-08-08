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
// SVG ICONS (unchanged)
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
// SETTINGS STYLES (unchanged)
// ============================================
// ... (all existing styled components preserved: SettingsProfileCard, ...)
// (They are omitted here for brevity but remain in the actual file)
// ... (must include all the styles from the current file you provided)

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

  // ... (all existing helpers: calculateAge, getMaxDate, validateDob, etc. remain unchanged)

  // ===== JOURNAL LOGIC =====
  const filteredTrades = useMemo(() => {
    if (filter === 'all') return journalTrades;
    return journalTrades.filter(t => t.result === filter);
  }, [journalTrades, filter]);

  const stats = useMemo(() => {
    const wins = journalTrades.filter(t => t.result === 'win').length;
    const losses = journalTrades.filter(t => t.result === 'loss').length;
    const total = wins + losses;
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
    const totalPnL = journalTrades.reduce((acc, t) => acc + (t.payout || 0) - (t.stake || 0), 0);
    const best = Math.max(...journalTrades.map(t => (t.payout || 0) - (t.stake || 0)), 0);
    const worst = Math.min(...journalTrades.map(t => (t.payout || 0) - (t.stake || 0)), 0);
    return { wins, losses, total, winRate, totalPnL, best, worst };
  }, [journalTrades]);

  const handleNoteSave = () => {
    if (noteModal === null) return;
    const updated = journalTrades.map(t => t.id === noteModal ? { ...t, notes: editNote } : t);
    setJournalTrades(updated);
    localStorage.setItem('tradeJournal', JSON.stringify(updated));
    setNoteModal(null);
    setEditNote('');
  };

  const exportCSV = () => {
    const headers = ['Date', 'Market', 'Type', 'Direction', 'Stake', 'Payout', 'Result', 'Strategy', 'Mode', 'Notes'];
    const rows = journalTrades.map(t => [
      new Date(t.timestamp).toLocaleString(),
      t.market, t.tradeType, t.direction, t.stake, t.payout, t.result, t.strategy, t.mode, t.notes
    ]);
    const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `trade_journal_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // Journal content for the full panel
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

  // ===== HANDLERS (updated Journal) =====
  const handleJournalClick = () => {
    setActiveItem('journal');
    setCurrentPanel('journal');
    setFullPanelContent(journalContent);
    setIsFullPanelOpen(true);
  };

  const handleAcademyClick = () => {
    setActiveItem('academy');
    setCurrentPanel('academy');
    openFullPanel(<Academy />);
  };

  const closeFullPanel = () => {
    setIsFullPanelOpen(false);
    setCurrentPanel(null);
    setTimeout(() => setFullPanelContent(null), 300);
  };

  // ... (all other handlers unchanged: settings, help, risk, copy trading, etc.)

  // ============================================
  // RENDER
  // ============================================
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
          {/* ... (all NavSection items unchanged) ... */}
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