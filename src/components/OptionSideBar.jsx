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
  position: fixed; inset: 0; background: rgba(0,0,0,0.25); z-index:2000;
  display: ${p => p.isOpen ? 'flex' : 'none'}; align-items:center; justify-content:flex-end;
  animation: ${modalBackdrop} 0.3s ease;
`;
const FullPanelContainer = styled.div`
  width: 75%; height: 100vh; height: 100dvh;
  background: ${p => p.theme.colors?.surface || '#0F172A'};
  border-left: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  animation: ${slideInRight} 0.4s cubic-bezier(0.16,1,0.3,1);
  display: flex; flex-direction: column; position: relative; overflow: hidden;
  box-shadow: -8px 0 40px rgba(0,0,0,0.4);
  &::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, ${p => p.theme.colors?.accent || '#3B82F6'}, transparent);
    background-size: 200% 100%; animation: ${shimmer} 4s ease-in-out infinite;
  }
  @media (max-width:768px) { width:100%; }
`;
const FullPanelHeader = styled.div`
  display:flex; align-items:center; justify-content:space-between; padding:20px 24px;
  border-bottom:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; flex-shrink:0;
  .panel-title-group { display:flex; align-items:center; gap:12px; }
  .panel-icon {
    display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px;
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
    border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  }
  .panel-title { font-size:18px; font-weight:700; color: ${p => p.theme.colors?.text || '#F8FAFC'}; letter-spacing:-0.3px; }
  .panel-close-btn {
    display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:10px;
    border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; background:transparent;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'}; cursor:pointer; transition:all 0.25s ease;
    &:hover { border-color: ${p => p.theme.colors?.accent || '#3B82F6'}; color: ${p => p.theme.colors?.text || '#F8FAFC'}; background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'}; transform:rotate(90deg); }
  }
  @media (max-width:480px) { padding:14px 16px; .panel-title { font-size:16px; } .panel-icon { width:34px; height:34px; } }
`;
const FullPanelBody = styled.div`
  flex:1; overflow-y:auto; padding:0;
  &::-webkit-scrollbar { width:5px; } &::-webkit-scrollbar-track { background:transparent; }
  &::-webkit-scrollbar-thumb { background: ${p => p.theme.colors?.scrollbar || 'rgba(255,255,255,0.12)'}; border-radius:99px; }
  & > div { padding:24px 28px; }
  @media (max-width:480px) { & > div { padding:16px; } }
`;

// ============================================
// PREMIUM MODAL (Small Popups)
// ============================================
const ModalOverlay = styled.div`
  position: fixed; inset:0; background:rgba(0,0,0,0.15); z-index:1000;
  display: ${p => p.isOpen ? 'flex' : 'none'}; align-items:center; justify-content:center; padding:20px;
  animation: ${modalBackdrop} 0.28s ease; overflow:hidden;
  @media (max-width:480px) { padding:12px; }
`;
const ModalContainer = styled.div`
  max-width: ${p => p.settings ? '560px' : '480px'}; width:100%; max-height:90vh;
  background: ${p => p.theme.colors?.surface || '#0F172A'};
  border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius:20px; box-shadow: ${p => p.theme.colors?.shadow || '0 32px 80px rgba(0,0,0,0.6)'};
  animation: ${modalSlideIn} 0.32s cubic-bezier(0.16,1,0.3,1);
  display:flex; flex-direction:column; position:relative; overflow:hidden;
  &::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, ${p => p.theme.colors?.accent || '#3B82F6'}, transparent);
    background-size:200% 100%; animation: ${shimmer} 4s ease-in-out infinite;
  }
  &::after {
    content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%;
    background: radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.02), transparent 70%);
    pointer-events:none;
  }
  @media (max-width:480px) { max-width:100%; margin:8px; border-radius:16px; max-height:92vh; }
`;
const ModalHeader = styled.div`
  display:flex; align-items:center; justify-content:space-between; padding:16px 20px 12px;
  border-bottom:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; flex-shrink:0; position:relative; z-index:1;
  .title-group { display:flex; align-items:center; gap:10px; min-width:0; }
  .title-icon {
    display:flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:10px;
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
    border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; flex-shrink:0;
  }
  .title-text { font-size:15px; font-weight:700; color: ${p => p.theme.colors?.text || '#F8FAFC'}; letter-spacing:-0.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .title-badge {
    font-size:9px; font-weight:700; padding:2px 8px; border-radius:999px;
    background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
    color: ${p => p.theme.colors?.accent || '#3B82F6'};
    border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; flex-shrink:0;
  }
  .close-btn {
    display:flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:8px;
    border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; background:transparent;
    color: ${p => p.theme.colors?.textMuted || '#94A3B8'}; cursor:pointer; transition:all 0.25s ease; flex-shrink:0;
    &:hover { border-color: ${p => p.theme.colors?.accent || '#3B82F6'}; color: ${p => p.theme.colors?.text || '#F8FAFC'}; background: ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.08)'}; transform:rotate(90deg) scale(1.05); }
  }
  @media (max-width:480px) { padding:12px 14px 10px; .title-text { font-size:14px; } .title-icon { width:30px; height:30px; } }
`;
const ModalBody = styled.div`
  flex:1; overflow-y:auto; padding:16px 20px 20px; position:relative; z-index:1;
  &::-webkit-scrollbar { width:4px; } &::-webkit-scrollbar-track { background:transparent; }
  &::-webkit-scrollbar-thumb { background: ${p => p.theme.colors?.scrollbar || 'rgba(255,255,255,0.12)'}; border-radius:99px; }
  @media (max-width:480px) { padding:12px 14px 16px; }
`;

// ============================================
// JOURNAL SPECIFIC STYLES
// ============================================
const JournalContainer = styled.div` display:flex; flex-direction:column; height:100%; color: ${p => p.theme.colors?.text || '#F8FAFC'}; `;
const JournalToolbar = styled.div`
  display:flex; align-items:center; justify-content:space-between; padding:16px 0;
  border-bottom:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; margin-bottom:16px; flex-wrap:wrap; gap:12px;
  .toolbar-left { display:flex; align-items:center; gap:12px; }
  .toolbar-right { display:flex; align-items:center; gap:12px; }
`;
const FilterChip = styled.button`
  padding:6px 14px; border-radius:20px;
  border:1px solid ${p => p.active ? p.theme.colors?.accent || '#3B82F6' : 'rgba(255,255,255,0.08)'};
  background: ${p => p.active ? (p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)') : 'transparent'};
  color: ${p => p.active ? p.theme.colors?.accent || '#3B82F6' : p.theme.colors?.textSecondary || '#94A3B8'};
  font-size:11px; font-weight:600; cursor:pointer; transition:all 0.2s ease;
  &:hover { border-color:rgba(255,255,255,0.12); color: ${p => p.theme.colors?.text || '#F8FAFC'}; }
`;
const JournalButton = styled.button`
  padding:7px 16px; border-radius:8px;
  border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  background: ${p => p.primary ? (p.theme.colors?.accent || '#3B82F6') : 'transparent'};
  color: ${p => p.primary ? '#ffffff' : p.theme.colors?.textSecondary || '#94A3B8'};
  font-size:11px; font-weight:600; cursor:pointer; transition:all 0.2s ease;
  &:hover { border-color: ${p => p.theme.colors?.accent || '#3B82F6'}; color: ${p => p.theme.colors?.text || '#F8FAFC'}; }
`;
const StatsRow = styled.div` display:grid; grid-template-columns:repeat(auto-fit, minmax(100px,1fr)); gap:12px; margin-bottom:20px; `;
const StatBox = styled.div`
  background: ${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
  border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius:10px; padding:12px 14px; text-align:center;
  .stat-label { font-size:9px; text-transform:uppercase; letter-spacing:0.6px; color:${p => p.theme.colors?.textMuted || '#64748B'}; margin-bottom:4px; }
  .stat-value { font-size:20px; font-weight:700; color:${p => p.color || p.theme.colors?.text || '#F8FAFC'}; font-family:'Courier New', monospace; }
  .stat-sub { font-size:10px; color:${p => p.theme.colors?.textMuted || '#94A3B8'}; margin-top:2px; }
`;
const TableContainer = styled.div`
  flex:1; overflow-y:auto; border-radius:10px;
  border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'};
  background: ${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
  &::-webkit-scrollbar { width:4px; } &::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:2px; }
`;
const JournalTable = styled.table`
  width:100%; border-collapse:collapse; font-size:11px;
  th, td { padding:10px 12px; text-align:left; border-bottom:1px solid rgba(255,255,255,0.04); }
  th { font-weight:600; color:${p => p.theme.colors?.textMuted || '#64748B'}; font-size:10px; text-transform:uppercase; letter-spacing:0.5px; position:sticky; top:0; background:${p => p.theme.colors?.surface || '#0F172A'}; }
  td { color:${p => p.theme.colors?.textSecondary || '#CBD5E1'}; }
  .win { color:#10B981; font-weight:600; }
  .loss { color:#EF4444; font-weight:600; }
  .pending { color:#F59E0B; }
  .notes-cell { max-width:150px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; cursor:pointer; }
`;
const NoteModal = styled.div`
  position:fixed; inset:0; background:rgba(0,0,0,0.2); z-index:3000; display:flex; align-items:center; justify-content:center;
  animation: ${fadeIn} 0.2s ease;
`;
const NoteModalContent = styled.div`
  background: ${p => p.theme.colors?.surface || '#0F172A'};
  border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:24px; width:90%; max-width:420px;
  color:${p => p.theme.colors?.text || '#F8FAFC'}; display:flex; flex-direction:column; gap:12px;
  box-shadow:0 24px 60px rgba(0,0,0,0.6);
  .title { font-size:15px; font-weight:700; }
  textarea { flex:1; min-height:80px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:8px; color:inherit; padding:12px; font-size:12px; outline:none; resize:vertical; }
  .actions { display:flex; gap:8px; justify-content:flex-end; }
`;

// ============================================
// SETTINGS STYLES
// ============================================
const SettingsProfileCard = styled.div`
  display:flex; align-items:center; gap:16px; padding:20px 20px;
  background: ${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
  border-radius:14px; border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; margin-bottom:18px;
  animation: ${fadeUp} 0.3s ease;
  .profile-avatar { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg, #3B82F6, #1D4ED8); display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:700; color:#ffffff; flex-shrink:0; box-shadow:0 4px 20px rgba(59,130,246,0.3); }
  .profile-info { flex:1; min-width:0; }
  .profile-name { font-size:17px; font-weight:700; color:${p => p.theme.colors?.text || '#F8FAFC'}; letter-spacing:-0.2px; }
  .profile-email { font-size:13px; color:${p => p.theme.colors?.textMuted || '#94A3B8'}; margin-top:2px; }
  .profile-status { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; color:#10B981; background:rgba(16,185,129,0.1); padding:3px 12px; border-radius:999px; margin-top:4px;
    .status-dot { width:6px; height:6px; border-radius:50%; background:#10B981; animation:${pulseGlow} 2s infinite; }
  }
`;
const SettingsGrid = styled.div` display:grid; grid-template-columns:1fr 1fr; gap:14px; animation:${fadeUp} 0.4s ease; @media (max-width:520px) { grid-template-columns:1fr; } `;
const SettingsCard = styled.div`
  background: ${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
  border-radius:14px; padding:16px 18px; border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'}; transition:all 0.2s ease;
  &:hover { border-color: ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'}; }
  .card-head { display:flex; align-items:center; gap:8px; font-size:11px; font-weight:600; color:${p => p.theme.colors?.text || '#F8FAFC'}; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'};
    .icon { display:flex; align-items:center; justify-content:center; color:${p => p.theme.colors?.textMuted || '#4b5563'}; }
  }
`;
const SettingsField = styled.div`
  margin-bottom:12px;
  label { display:block; font-size:9.5px; font-weight:600; color:${p => p.theme.colors?.textMuted || '#475569'}; margin-bottom:3px; letter-spacing:0.5px; text-transform:uppercase; }
  .val { font-size:12px; color:${p => p.theme.colors?.text || '#e2e8f0'}; padding:6px 10px; background:${p => p.theme.colors?.surface || 'rgba(255,255,255,0.02)'}; border-radius:8px; border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.03)'}; min-height:34px; display:flex; align-items:center; justify-content:space-between; }
  .age-badge { font-size:9px; color:#4ade80; background:rgba(34,197,94,0.06); padding:2px 8px; border-radius:20px; border:1px solid rgba(34,197,94,0.06); font-weight:500; margin-left:8px; white-space:nowrap; }
  input.inp, select.inp {
    width:100%; padding:6px 10px; background:${p => p.theme.colors?.surface || 'rgba(255,255,255,0.02)'};
    border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; border-radius:8px;
    color:${p => p.theme.colors?.text || '#e2e8f0'}; font-size:12px; transition:all 0.2s ease; font-family:inherit;
    &:focus { outline:none; border-color:${p => p.theme.colors?.accent || 'rgba(34,197,94,0.28)'}; box-shadow:0 0 12px ${p => p.theme.colors?.accentLight || 'rgba(34,197,94,0.05)'}; background:${p => p.theme.colors?.bg || 'rgba(255,255,255,0.03)'}; }
    &::placeholder { color:${p => p.theme.colors?.textMuted || '#374151'}; }
    &.err { border-color:rgba(239,68,68,0.3); }
  }
  select.inp { appearance:none; cursor:pointer;
    option { background:${p => p.theme.colors?.surface || '#040810'}; color:${p => p.theme.colors?.text || '#e2e8f0'}; }
  }
  .err-msg { font-size:9.5px; color:#ef4444; margin-top:3px; display:flex; align-items:center; gap:4px; }
`;
const SettingsBtnRow = styled.div` display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; `;
const SettingsBtn = styled.button`
  padding:6px 16px; border-radius:20px; font-size:10.5px; font-weight:600; cursor:pointer; transition:all 0.3s ease; border:none; display:inline-flex; align-items:center; gap:5px; font-family:inherit;
  &.primary { background:linear-gradient(135deg, #22c55e, #16a34a); color:#040810;
    &:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(34,197,94,0.25); }
  }
  &.secondary { background:${p => p.theme.colors?.bg || 'rgba(255,255,255,0.03)'}; border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; color:${p => p.theme.colors?.text || '#e2e8f0'};
    &:hover { background:${p => p.theme.colors?.bg || 'rgba(255,255,255,0.06)'}; transform:translateY(-2px); }
  }
  &.danger { background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.14); color:#ef4444;
    &:hover { background:rgba(239,68,68,0.14); transform:translateY(-2px); box-shadow:0 6px 16px rgba(239,68,68,0.1); }
  }
  &:disabled { opacity:0.45; cursor:not-allowed; transform:none !important; }
  @media (max-width:480px) { padding:5px 12px; font-size:9.5px; }
`;
const SettingsDangerZone = styled.div`
  margin-top:14px; padding:14px 16px; border-radius:12px; background:rgba(239,68,68,0.025); border:1px solid rgba(239,68,68,0.05);
  .dtitle { display:flex; align-items:center; gap:6px; color:#ef4444; font-size:11px; font-weight:600; margin-bottom:3px; }
  .ddesc { font-size:10px; color:${p => p.theme.colors?.textMuted || '#64748b'}; margin-bottom:8px; }
`;
const SettingsSuccess = styled.div`
  background:rgba(34,197,94,0.06); border:1px solid rgba(34,197,94,0.1); color:#4ade80; padding:8px 14px; border-radius:9px; font-size:11px; margin-bottom:14px; display:flex; align-items:center; gap:7px; animation:${fadeUp} 0.4s ease;
`;

// ============================================
// HELP & SUPPORT STYLES
// ============================================
const HelpContactCard = styled.div`
  padding:14px 16px; border-radius:12px; background:${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
  border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; margin-bottom:10px; transition:all 0.2s ease;
  &:hover { border-color:${p => p.theme.colors?.accent || 'rgba(59,130,246,0.3)'}; background:${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.02)'}; }
  .contact-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:${p => p.theme.colors?.textMuted || '#94A3B8'}; margin-bottom:6px; }
  .contact-row { display:flex; align-items:center; gap:12px; }
  .contact-icon { display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:8px; background:${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.06)'}; color:${p => p.theme.colors?.accent || '#3B82F6'}; flex-shrink:0; }
  .contact-info { flex:1; min-width:0; }
  .contact-title { font-size:11px; font-weight:600; color:${p => p.theme.colors?.text || '#F8FAFC'}; }
  .contact-value { font-size:12px; font-weight:500; color:${p => p.theme.colors?.textSecondary || '#CBD5E1'}; word-break:break-all; }
  .contact-action { font-size:11px; font-weight:600; color:${p => p.theme.colors?.accent || '#3B82F6'}; cursor:pointer; padding:4px 12px; border-radius:6px; border:1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'}; background:transparent; transition:all 0.2s ease; flex-shrink:0;
    &:hover { background:${p => p.theme.colors?.accent || '#3B82F6'}; color:#ffffff; border-color:${p => p.theme.colors?.accent || '#3B82F6'}; }
  }
`;

// ============================================
// RISK CALCULATOR STYLES (updated)
// ============================================
const RiskInputGroup = styled.div`
  margin-bottom: 16px;
  .risk-label {
    font-size: 11px; font-weight: 700; color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
    margin-bottom: 6px; display: flex; align-items:center; gap: 8px;
    text-transform: uppercase; letter-spacing: 0.5px;
    .risk-hint {
      font-size: 9px; font-weight: 400; opacity: 0.4; text-transform:none; letter-spacing:0;
    }
  }
  .risk-input-wrap {
    display: flex; align-items:center;
    background: ${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
    border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.08)'};
    border-radius: 12px; overflow: hidden; transition: all 0.3s ease;
    &:focus-within {
      border-color: ${p => p.theme.colors?.accent || '#3B82F6'};
      box-shadow: 0 0 0 4px ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.1)'};
    }
    .risk-prefix {
      padding: 12px 14px; font-size: 14px; font-weight: 700;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      background: ${p => p.theme.colors?.surfaceHover || 'rgba(255,255,255,0.03)'};
      border-right: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
      min-width: 40px; text-align: center;
    }
    input {
      flex: 1; padding: 12px 14px; background: transparent; border: none;
      color: ${p => p.theme.colors?.text || '#F8FAFC'}; font-size: 15px; font-weight: 600;
      outline: none; width: 100%; min-width: 0;
      &::placeholder { color: ${p => p.theme.colors?.textMuted || '#94A3B8'}; opacity:0.5; }
      &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { -webkit-appearance: none; margin:0; }
      &[type='number'] { -moz-appearance: textfield; }
    }
  }
`;
const RiskCalculateBtn = styled.button`
  width: 100%; padding: 14px 0; border: none; border-radius: 12px;
  background: linear-gradient(135deg, ${p => p.theme.colors?.accent || '#3B82F6'}, ${p => p.theme.colors?.accentHover || '#2563EB'});
  color: #FFFFFF; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s ease;
  margin-top: 4px; position: relative; overflow: hidden;
  &::before {
    content: ''; position: absolute; top:0; left:-100%; width:60%; height:100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    animation: ${shimmer} 4s ease-in-out infinite;
  }
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px ${p => p.theme.colors?.accentLight || 'rgba(59,130,246,0.25)'}; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const RiskResultsGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 16px;
  animation: ${fadeUp} 0.5s ease;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;
const RiskResultBox = styled.div`
  padding: 14px 12px; border-radius: 12px; text-align: center;
  background: ${p => p.type === 'risk' ? 'rgba(239,68,68,0.06)' : p.type === 'reward' ? 'rgba(16,185,129,0.06)' : p.theme.colors?.accentLight || 'rgba(59,130,246,0.06)'};
  border: 1px solid ${p => p.type === 'risk' ? 'rgba(239,68,68,0.1)' : p.type === 'reward' ? 'rgba(16,185,129,0.1)' : p.theme.colors?.border || 'rgba(59,130,246,0.1)'};
  transition: all 0.3s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 6px 24px rgba(0,0,0,0.15); }
  .result-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing:0.6px; color: ${p => p.theme.colors?.textMuted || '#94A3B8'}; margin-bottom:4px; }
  .result-value { font-size: 18px; font-weight: 700; color: ${p => p.type === 'risk' ? '#EF4444' : p.type === 'reward' ? '#10B981' : p.theme.colors?.accent || '#3B82F6'}; }
  .result-sub { font-size: 9px; color: ${p => p.theme.colors?.textMuted || '#94A3B8'}; margin-top:4px; opacity:0.6; font-weight:500; }
`;
const RiskSummaryBox = styled.div`
  margin-top: 14px; padding: 14px 18px;
  background: ${p => p.theme.colors?.bg || 'rgba(255,255,255,0.02)'};
  border-radius: 12px; border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.06)'};
  animation: ${fadeUp} 0.6s ease;
  .summary-row { display:flex; justify-content:space-between; padding:5px 0; font-size:12px; font-weight:500;
    .label { color: ${p => p.theme.colors?.textMuted || '#94A3B8'}; }
    .value { color: ${p => p.theme.colors?.text || '#F8FAFC'}; font-weight:600; }
    &.highlight-risk .value { color:#EF4444; }
    &.highlight-reward .value { color:#10B981; }
    &.highlight-ratio .value { color:${p => p.theme.colors?.accent || '#3B82F6'}; }
  }
  .summary-divider { height:1px; background: ${p => p.theme.colors?.border || 'rgba(255,255,255,0.04)'}; margin:6px 0; }
`;

// ============================================
// COPY TRADING STYLES (unchanged)
// ============================================
const CopyTradingWrapper = styled.div` animation:${fadeUp} 0.4s ease; `;
const CopyHeroSection = styled.div`
  text-align:center; padding:8px 0 14px;
  .badge { display:inline-block; padding:3px 12px; border-radius:20px; background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.1); color:#38bdf8; font-size:10px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:6px; }
  .title { font-size:20px; font-weight:800; color:#f1f5f9; line-height:1.1; margin-bottom:4px;
    .gradient { background:linear-gradient(135deg, #22c55e, #38bdf8, #818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  }
  .subtitle { font-size:12px; color:#94a3b8; max-width:400px; margin:0 auto; line-height:1.5; }
`;
const MasterTraderCardCompact = styled.div` /* ... same as before */ `;
const ClientsGridCompact = styled.div` /* ... */ `;
const ClientCardCompact = styled.div` /* ... */ `;
const AddClientButtonCompact = styled.button` /* ... */ `;
const EmptyStateCompact = styled.div` /* ... */ `;
const ConnectSectionCompact = styled.div` /* ... */ `;

// (In the interest of length, the remaining styled components are omitted from this response but are identical to the earlier full file.)

// ============================================
// RESPONSIBLE TRADING POPUP, ABOUT US, etc. (unchanged)
// ============================================
// (All styled components remain as before)

// ============================================
// SIDEBAR LAYOUT (unchanged)
// ============================================
const Overlay = styled.div` /* ... */ `;
const SidebarContainer = styled.aside` /* ... */ `;
const CloseButton = styled.button` /* ... */ `;
const SidebarContent = styled.div` /* ... */ `;
const SidebarHeader = styled.div` /* ... */ `;
const NavSection = styled.div` /* ... */ `;
const SectionLabel = styled.div` /* ... */ `;
const NavItem = styled.div` /* ... */ `;
const SideCard = styled.div` /* ... */ `;
const FeedbackSection = styled.div` /* ... */ `;
const SidebarFooter = styled.footer` /* ... */ `;

// ============================================
// GLOBAL LOG TRADE FUNCTION
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
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(70);
  const [voiceEvents, setVoiceEvents] = useState({ trade: true, price: true, market: false, system: true });
  const [popupType, setPopupType] = useState(null);
  const [popupData, setPopupData] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSettingsPopup, setIsSettingsPopup] = useState(false);
  const [isFullPanelOpen, setIsFullPanelOpen] = useState(false);
  const [fullPanelContent, setFullPanelContent] = useState(null);
  const [currentPanel, setCurrentPanel] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dobError, setDobError] = useState('');
  const [calculatedAge, setCalculatedAge] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '', date_of_birth: '', gender: '', email: ''
  });
  // Risk calculator state – updated for Deriv
  const [calcAccountBalance, setCalcAccountBalance] = useState('');
  const [calcRiskPercent, setCalcRiskPercent] = useState(2);
  const [calcPayout, setCalcPayout] = useState(80);
  const [calcDailyLossLimit, setCalcDailyLossLimit] = useState('');
  const [calculated, setCalculated] = useState(false);
  // Copy Trading state
  const [copyTokenInput, setCopyTokenInput] = useState('');
  const [copyClientNameInput, setCopyClientNameInput] = useState('');
  const [copyConnecting, setCopyConnecting] = useState(false);
  const [copyConnectionStatus, setCopyConnectionStatus] = useState(null);
  const [copyClients, setCopyClients] = useState([]);
  const [copyShowAddClient, setCopyShowAddClient] = useState(false);
  // Journal state
  const [journalTrades, setJournalTrades] = useState([]);
  const [filter, setFilter] = useState('all');
  const [noteModal, setNoteModal] = useState(null);
  const [editNote, setEditNote] = useState('');

  // Load user & journal
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
    if (userData.date_of_birth) setCalculatedAge(calculateAge(userData.date_of_birth));
  }, []);
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
  const getMaxDate = () => { const d = new Date(); d.setFullYear(d.getFullYear() - 10); return d.toISOString().split('T')[0]; };
  const validateDob = (dob) => {
    if (!dob) { setDobError(''); setCalculatedAge(null); return true; }
    const birthDate = new Date(dob);
    const maxDate = new Date(getMaxDate());
    if (birthDate > maxDate) { setDobError('You must be at least 10 years old'); setCalculatedAge(null); return false; }
    setCalculatedAge(calculateAge(dob)); setDobError(''); return true;
  };
  const handleDobChange = (e) => { const v = e.target.value; setFormData(prev => ({ ...prev, date_of_birth: v })); validateDob(v); };
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSaveProfile = () => {
    if (formData.date_of_birth && !validateDob(formData.date_of_birth)) return;
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...userData, ...formData };
    localStorage.setItem('user', JSON.stringify(updated));
    setIsEditing(false); setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  const handleDeleteAccount = () => {
    if (window.confirm('Delete your account? This cannot be undone.')) {
      localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); closePopup();
    }
  };
  const closeSidebarOnMobile = () => { if (window.innerWidth <= 768) onClose(); };
  const openPopup = (type, data = {}, isSettings = false) => { setPopupType(type); setPopupData(data); setIsSettingsPopup(isSettings); setIsPopupOpen(true); };
  const closePopup = () => { setIsPopupOpen(false); setTimeout(() => setPopupType(null), 300); };
  const openFullPanel = (content) => { setFullPanelContent(content); setIsFullPanelOpen(true); };
  const closeFullPanel = () => { setIsFullPanelOpen(false); setCurrentPanel(null); setTimeout(() => setFullPanelContent(null), 300); };
  const handleNavClick = (item, path) => { setActiveItem(item); if (path) navigate(path); closeSidebarOnMobile(); };

  // ---- RISK CALCULATOR LOGIC ----
  const calculateRisk = () => {
    if (!calcAccountBalance || parseFloat(calcAccountBalance) <= 0) return;
    setCalculated(true);
  };
  const getRiskResults = () => {
    const balance = parseFloat(calcAccountBalance) || 0;
    const riskPercent = parseFloat(calcRiskPercent) || 2;
    const payoutPercent = parseFloat(calcPayout) || 80;
    const dailyLossLimit = parseFloat(calcDailyLossLimit) || 0;
    const stake = balance * (riskPercent / 100);
    const potentialProfit = stake * (payoutPercent / 100);
    const potentialLoss = stake;
    const riskRewardRatio = payoutPercent / 100;
    let maxTradesPerDay = 0;
    if (dailyLossLimit > 0) {
      const dailyLossAmount = balance * (dailyLossLimit / 100);
      maxTradesPerDay = Math.floor(dailyLossAmount / stake);
    }
    return { stake, potentialProfit, potentialLoss, riskRewardRatio, maxTradesPerDay, dailyLossLimit, balance };
  };
  const riskResults = getRiskResults();

  // ---- COPY TRADING LOGIC (unchanged) ----
  const handleCopyConnect = () => { /* ... */ };
  const handleCopyRemoveClient = (clientId) => { setCopyClients(prev => prev.filter(c => c.id !== clientId)); };
  const handleCopyActivateClient = (clientId) => { setCopyClients(prev => prev.map(c => c.id === clientId ? { ...c, status: 'active' } : c)); };
  const handleCopyViewClient = (clientId) => {};
  const getCopyStatusBadge = (status) => {
    const badges = { active: { label: 'Active', className: 'active' }, pending: { label: 'Pending', className: 'pending' }, inactive: { label: 'Inactive', className: 'inactive' } };
    return badges[status] || badges.inactive;
  };

  // ---- HANDLERS ----
  const handleSettingsClick = () => { /* ... same as before, using openPopup('settings', ...) */ };
  const handleHelpClick = () => { /* ... */ };
  const handleResponsibleTradingClick = () => { /* ... */ };
  const handleAboutClick = () => { /* ... */ };
  const handleAcademyClick = () => { setActiveItem('academy'); setCurrentPanel('academy'); openFullPanel(<Academy />); };
  const handleRiskCalculatorClick = () => {
    setActiveItem('risk-calculator');
    setCalculated(false);
    setCalcAccountBalance('');
    setCalcRiskPercent(2);
    setCalcPayout(80);
    setCalcDailyLossLimit('');
    openPopup('risk-calculator', { title: 'Risk Calculator', icon: <RiskIcon />, badge: 'Deriv' });
  };
  const handleCopyTradingClick = () => { /* ... */ };
  const handlePerformanceClick = () => { /* ... */ };
  const handleJournalClick = () => { /* ... (same journal logic) */ };
  const handleNotificationsClick = () => { /* ... */ };
  const handleVoiceClick = () => { /* ... */ };
  const handleAccountInfoClick = () => { /* ... */ };
  const handleHowToUseClick = () => { /* ... */ };
  const handleTermsClick = () => { /* ... */ };

  // ---- RENDER POPUP CONTENT ----
  const renderPopupContent = () => {
    switch (popupType) {
      case 'settings': return ( /* ... */ );
      case 'help': return ( /* ... */ );
      case 'responsible-trading': return ( /* ... */ );
      case 'about': return ( /* ... */ );
      case 'risk-calculator':
        return (
          <>
            <RiskInputGroup>
              <div className="risk-label">Account Balance <span className="risk-hint">(USD)</span></div>
              <div className="risk-input-wrap">
                <span className="risk-prefix">$</span>
                <input type="number" placeholder="Enter your account balance" value={calcAccountBalance} onChange={e => setCalcAccountBalance(e.target.value)} min="0" step="100" />
              </div>
            </RiskInputGroup>
            <RiskInputGroup>
              <div className="risk-label">Risk per Trade <span className="risk-hint">(%)</span></div>
              <div className="risk-input-wrap">
                <span className="risk-prefix">%</span>
                <input type="number" placeholder="2" value={calcRiskPercent} onChange={e => setCalcRiskPercent(e.target.value)} min="0.1" max="100" step="0.1" />
              </div>
            </RiskInputGroup>
            <RiskInputGroup>
              <div className="risk-label">Payout <span className="risk-hint">(%)</span><span style={{fontSize:'9px',opacity:0.5}}>Typical: 80%</span></div>
              <div className="risk-input-wrap">
                <span className="risk-prefix">%</span>
                <input type="number" placeholder="80" value={calcPayout} onChange={e => setCalcPayout(e.target.value)} min="1" max="1000" step="0.1" />
              </div>
            </RiskInputGroup>
            <RiskInputGroup>
              <div className="risk-label">Daily Loss Limit <span className="risk-hint">(% of balance, optional)</span></div>
              <div className="risk-input-wrap">
                <span className="risk-prefix">%</span>
                <input type="number" placeholder="5" value={calcDailyLossLimit} onChange={e => setCalcDailyLossLimit(e.target.value)} min="0" max="100" step="0.5" />
              </div>
            </RiskInputGroup>
            <RiskCalculateBtn onClick={calculateRisk} disabled={!calcAccountBalance || parseFloat(calcAccountBalance) <= 0}>Calculate</RiskCalculateBtn>
            {calculated && parseFloat(calcAccountBalance) > 0 && (
              <>
                <RiskResultsGrid>
                  <RiskResultBox type="stake">
                    <div className="result-label">Stake</div>
                    <div className="result-value">${riskResults.stake.toFixed(2)}</div>
                    <div className="result-sub">Risk: {calcRiskPercent}%</div>
                  </RiskResultBox>
                  <RiskResultBox type="reward">
                    <div className="result-label">Potential Profit</div>
                    <div className="result-value">${riskResults.potentialProfit.toFixed(2)}</div>
                    <div className="result-sub">{calcPayout}% payout</div>
                  </RiskResultBox>
                  <RiskResultBox type="risk">
                    <div className="result-label">Potential Loss</div>
                    <div className="result-value">${riskResults.potentialLoss.toFixed(2)}</div>
                    <div className="result-sub">Full stake</div>
                  </RiskResultBox>
                  <RiskResultBox type="ratio">
                    <div className="result-label">Risk/Reward</div>
                    <div className="result-value">1:{riskResults.riskRewardRatio.toFixed(2)}</div>
                    <div className="result-sub">Payout ratio</div>
                  </RiskResultBox>
                </RiskResultsGrid>
                {calcDailyLossLimit && parseFloat(calcDailyLossLimit) > 0 && (
                  <RiskSummaryBox>
                    <div className="summary-row highlight-ratio">
                      <span className="label">Max Trades / Day</span>
                      <span className="value">{riskResults.maxTradesPerDay}</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-row">
                      <span className="label">Daily Loss Allowed</span>
                      <span className="value">${(riskResults.balance * (riskResults.dailyLossLimit / 100)).toFixed(2)}</span>
                    </div>
                  </RiskSummaryBox>
                )}
              </>
            )}
          </>
        );
      case 'copy-trading': return ( /* ... */ );
      case 'performance': return ( /* ... */ );
      case 'notifications': return ( /* ... */ );
      case 'voice': return ( /* ... */ );
      case 'account-info': return ( /* ... */ );
      case 'how-to-use': return ( /* ... */ );
      case 'terms': return ( /* ... */ );
      default: return null;
    }
  };

  // ---- Journal logic ----
  const exportCSV = () => { /* ... */ };
  const filteredTrades = useMemo(() => { if (filter === 'all') return journalTrades; return journalTrades.filter(t => t.result === filter); }, [journalTrades, filter]);
  const stats = useMemo(() => { /* ... */ }, [journalTrades]);
  const handleNoteSave = () => { /* ... */ };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      {/* Full Panel (Academy / Journal) */}
      <FullPanelOverlay isOpen={isFullPanelOpen} onClick={closeFullPanel}>
        <FullPanelContainer onClick={e => e.stopPropagation()}>
          <FullPanelHeader>
            <div className="panel-title-group">
              <span className="panel-icon">{currentPanel === 'journal' ? <JournalIcon /> : <AcademyIcon />}</span>
              <span className="panel-title">{currentPanel === 'journal' ? 'Trading Journal' : 'MyTradeApp Academy'}</span>
            </div>
            <button className="panel-close-btn" onClick={closeFullPanel}><CloseIcon /></button>
          </FullPanelHeader>
          <FullPanelBody>{fullPanelContent}</FullPanelBody>
        </FullPanelContainer>
      </FullPanelOverlay>

      {/* Small Modal Popups */}
      <ModalOverlay isOpen={isPopupOpen} onClick={closePopup}>
        <ModalContainer settings={isSettingsPopup} onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <div className="title-group">
              <span className="title-icon">{popupData?.icon}</span>
              <span className="title-text">{popupData?.title}</span>
              {popupData?.badge && <span className="title-badge">{popupData.badge}</span>}
            </div>
            <button className="close-btn" onClick={closePopup}><CloseXIcon /></button>
          </ModalHeader>
          <ModalBody>{renderPopupContent()}</ModalBody>
        </ModalContainer>
      </ModalOverlay>

      {/* Note editing modal */}
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
              <span className="nav-icon"><BellIcon /></span><span className="nav-label">Notifications</span>
              {hasNotifications && <span className="notification-dot" />}
              <span className="badge">2</span>
            </NavItem>
            <NavItem active={activeItem === 'voice'} onClick={handleVoiceClick}>
              <span className="nav-icon">{voiceEnabled ? <VoiceIcon /> : <VoiceOffIcon />}</span><span className="nav-label">Voice Notifications</span>
              <span className="badge" style={{ background: voiceEnabled ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: voiceEnabled ? '#10B981' : '#EF4444' }}>{voiceEnabled ? 'On' : 'Off'}</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Learning</SectionLabel>
            <NavItem active={activeItem === 'academy'} onClick={handleAcademyClick}>
              <span className="nav-icon"><AcademyIcon /></span><span className="nav-label">MyTradeApp Academy</span><span className="badge">NEW</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Account</SectionLabel>
            <NavItem active={activeItem === 'account-info'} onClick={handleAccountInfoClick}>
              <span className="nav-icon"><AccountIcon /></span><span className="nav-label">Deriv Account Info</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Trading</SectionLabel>
            <NavItem active={activeItem === 'copy-trading'} onClick={handleCopyTradingClick}>
              <span className="nav-icon"><CopyTradeIcon /></span><span className="nav-label">Copy Trading</span><span className="badge">BETA</span>
            </NavItem>
            <NavItem active={activeItem === 'performance'} onClick={handlePerformanceClick}>
              <span className="nav-icon"><PerformanceIcon /></span><span className="nav-label">Performance</span>
            </NavItem>
            <NavItem active={activeItem === 'journal'} onClick={handleJournalClick}>
              <span className="nav-icon"><JournalIcon /></span><span className="nav-label">Journal</span>
            </NavItem>
            <NavItem active={activeItem === 'risk-calculator'} onClick={handleRiskCalculatorClick}>
              <span className="nav-icon"><RiskIcon /></span><span className="nav-label">Risk Calculator</span>
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
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''} ${star <= hoverRating && star > rating ? 'hover' : ''}`}
                    onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                    <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  </button>
                ))}
              </div>
              <div className="star-rating-text">{rating > 0 ? getRatingText(rating) : 'Tap a star to rate'}</div>
              <textarea className="feedback-textarea" placeholder="Share your feedback or suggestions..." value={feedbackText} onChange={e => setFeedbackText(e.target.value)} disabled={isSubmitting} />
              <button className="feedback-submit" onClick={handleSubmitFeedback} disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Submit Feedback'}</button>
              {submitStatus && <div className="feedback-status">{submitStatus}</div>}
            </FeedbackSection>
          </NavSection>

          <NavSection>
            <SectionLabel>Information</SectionLabel>
            <NavItem active={activeItem === 'how-to-use'} onClick={handleHowToUseClick}>
              <span className="nav-icon"><BookIcon /></span><span className="nav-label">How to Use</span>
            </NavItem>
            <NavItem active={activeItem === 'terms'} onClick={handleTermsClick}>
              <span className="nav-icon"><TermsIcon /></span><span className="nav-label">Terms & Conditions</span>
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
          <div className="footer-item" onClick={handleSettingsClick}><span className="footer-icon"><SettingsIcon /></span> Settings</div>
          <div className="footer-item" onClick={handleHelpClick}><span className="footer-icon"><HelpIcon /></span> Help & Support</div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default OptionSideBar;