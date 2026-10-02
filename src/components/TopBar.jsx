// src/components/TopBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

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
// SVG ICONS
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

const CheckmarkIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 7-7" />
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

// ---------- Forex nav icons ----------
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.6V20h13V9.6" />
    <path d="M9.5 20v-5h5v5" />
  </svg>
);

const CalculatorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2.5" />
    <path d="M8 7.5h8" />
    <path d="M8 12h1.5M12 12h1.5M16 12h.01M8 16h1.5M12 16h1.5M16 16h.01" />
  </svg>
);

const StrengthIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 20v-8" />
    <path d="M12 20V4" />
    <path d="M19 20v-5" />
  </svg>
);

const BotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="7.5" width="17" height="12" rx="3.5" />
    <path d="M12 7.5V4" />
    <circle cx="12" cy="3.4" r="1" />
    <path d="M9 13h.01M15 13h.01" />
    <path d="M9.5 16.5h5" />
  </svg>
);

// ============================================
// ⚠️ KEEP THIS EXPORT — other files import it.
//    The TopBar itself no longer renders these
//    buttons, but the export must remain intact.
// ============================================
export const FOREX_NAV_ITEMS = [
  { key: 'home',     label: 'Home',           path: '/forexdash',          icon: <DashboardIcon /> },
  { key: 'lot',      label: 'Lot Calculator', path: '/forexdash/lot',      icon: <CalculatorIcon /> },
  { key: 'strength', label: 'Strength',       path: '/forexdash/strength', icon: <StrengthIcon /> },
  { key: 'bots',     label: 'Bots',           path: '/forexdash/bots',     icon: <BotsIcon /> },
];

// ============================================
// FOREX SESSION DISPLAY — replaces the nav buttons
// ============================================
const SessionWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px;
  padding: 5px 12px;
  background: ${p => p.theme?.colors?.background || 'rgba(255,255,255,0.03)'};
  border: 1px solid ${p => p.theme?.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 12px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    margin: 0 6px;
    gap: 6px;
    padding: 4px 10px;
  }

  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    margin: 6px 0 0;
    padding: 8px 12px;
    border-radius: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    justify-content: flex-start;
  }
  @media (max-width: 768px) {
    &::-webkit-scrollbar { display: none; }
  }
`;

const LiveClock = styled.span`
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.theme?.colors?.text || '#ffffff'};
  padding: 3px 8px;
  border-radius: 6px;
  background: ${p => p.theme?.colors?.surface || 'rgba(255,255,255,0.06)'};
  border: 1px solid ${p => p.theme?.colors?.border || 'rgba(255,255,255,0.08)'};
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    font-size: 10px;
    padding: 2px 6px;
  }
`;

const SessionChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 9px;
  background: ${p => (p.$open ? p.$color + '22' : 'transparent')};
  border: 1px solid ${p => (p.$open ? p.$color + '66' : (p.theme?.colors?.border || 'rgba(255,255,255,0.06)'))};
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: ${p => (p.$open ? '0 0 12px ' + p.$color + '22' : 'none')};

  .flag {
    font-size: 16px;
    line-height: 1;
    filter: ${p => (p.$open ? 'none' : 'grayscale(0.75)')};
    opacity: ${p => (p.$open ? 1 : 0.55)};
  }

  .name {
    font-size: 11.5px;
    font-weight: 700;
    color: ${p => (p.$open ? (p.theme?.colors?.text || '#ffffff') : (p.theme?.colors?.textMuted || '#94a3b8'))};
    line-height: 1;
  }

  .live {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.7px;
    padding: 2px 5px;
    border-radius: 4px;
    background: ${p => p.$color + '33'};
    color: ${p => p.$color};
    border: 1px solid ${p => p.$color + '55'};
    margin-left: 2px;
  }

  @media (max-width: 1024px) {
    padding: 4px 8px;
    gap: 5px;
    .flag { font-size: 14px; }
    .name { font-size: 10.5px; }
    .live { display: none; }
  }

  @media (max-width: 768px) {
    padding: 5px 9px;
    gap: 6px;
    .flag { font-size: 15px; }
    .name { font-size: 11.5px; }
    .live { display: inline-block; font-size: 8px; padding: 2px 5px; }
  }
`;

const FOREX_SESSIONS = [
  { key: 'sydney',  name: 'Sydney',   flag: '🇦🇺', openUTC: 22, closeUTC: 7,  color: '#a855f7' },
  { key: 'tokyo',   name: 'Tokyo',    flag: '🇯🇵', openUTC: 0,  closeUTC: 9,  color: '#3b82f6' },
  { key: 'london',  name: 'London',   flag: '🇬🇧', openUTC: 7,  closeUTC: 16, color: '#22c55e' },
  { key: 'newyork', name: 'New York', flag: '🇺🇸', openUTC: 12, closeUTC: 21, color: '#f5a524' },
];

const ForexSessionDisplay = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const isOpen = (from, to) =>
    from < to ? utcHours >= from && utcHours < to : utcHours >= from || utcHours < to;
  const utcTime = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;

  return (
    <SessionWrap>
      <LiveClock>{utcTime} UTC</LiveClock>
      {FOREX_SESSIONS.map((s) => {
        const open = isOpen(s.openUTC, s.closeUTC);
        return (
          <SessionChip key={s.key} $open={open} $color={s.color} title={`${s.name} · ${open ? 'Open' : 'Closed'}`}>
            <span className="flag">{s.flag}</span>
            <span className="name">{s.name}</span>
            {open && <span className="live">LIVE</span>}
          </SessionChip>
        );
      })}
    </SessionWrap>
  );
};

// ============================================
// FUNDS MODAL COMPONENTS (unchanged from original)
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

  @media (max-width: 768px) {
    padding: clamp(10px, 3vw, 16px);
  }
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

  .title-group { display: flex; align-items: center; gap: 10px; }

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

  @media (max-width: 768px) {
    padding: clamp(14px, 3.5vw, 18px) clamp(14px, 4vw, 20px) clamp(10px, 3vw, 14px);
    .title-group { gap: clamp(10px, 3vw, 14px); }
    .title-icon {
      width: clamp(40px, 11vw, 50px);
      height: clamp(40px, 11vw, 50px);
      border-radius: clamp(10px, 3vw, 14px);
    }
    .title-text { font-size: clamp(15px, 4.2vw, 18px); }
    .title-sub { font-size: clamp(11px, 3vw, 13px); }
    .close-btn {
      width: clamp(38px, 10.5vw, 46px);
      height: clamp(38px, 10.5vw, 46px);
      border-radius: clamp(8px, 2.6vw, 12px);
    }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
  color: ${p => p.theme.colors?.text || '#F8FAFC'};
  position: relative;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: ${p => p.theme.colors?.scrollbar || 'rgba(255,255,255,0.15)'};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track { background: transparent; }

  @media (max-width: 768px) {
    padding: clamp(14px, 3.5vw, 18px) clamp(14px, 4vw, 20px) clamp(16px, 4vw, 22px);
  }
`;

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

  @media (max-width: 768px) {
    padding: clamp(10px, 3vw, 14px) clamp(12px, 3.6vw, 16px);
    font-size: clamp(12px, 3.4vw, 14px);
    border-radius: clamp(8px, 2.4vw, 12px);
    margin-bottom: clamp(14px, 4vw, 20px);
    line-height: 1.5;
    gap: clamp(8px, 2.4vw, 12px);
  }
`;

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

  @media (max-width: 768px) {
    padding: clamp(10px, 3vw, 14px) clamp(12px, 3.6vw, 16px);
    font-size: clamp(12px, 3.4vw, 14px);
    border-radius: clamp(8px, 2.4vw, 12px);
    margin-bottom: clamp(14px, 4vw, 20px);
    line-height: 1.5;
  }
`;

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

  @media (max-width: 768px) {
    padding: clamp(14px, 4vw, 20px);
    font-size: clamp(14px, 3.8vw, 16px);
    border-radius: clamp(8px, 2.4vw, 12px);
    margin-bottom: clamp(14px, 4vw, 20px);
    line-height: 1.6;
  }
`;

const SuccessOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: ${fadeIn} 0.25s ease;
  border-radius: 20px;
  padding: 20px;

  @media (max-width: 768px) {
    padding: clamp(16px, 4.5vw, 24px);
    border-radius: clamp(16px, 4.2vw, 22px);
  }
`;

const SuccessCard = styled.div`
  background: ${p => p.theme.colors?.surface || '#0F172A'};
  border: 1px solid ${p => p.theme.colors?.border || 'rgba(255,255,255,0.1)'};
  border-radius: 24px;
  padding: 48px 32px 36px;
  text-align: center;
  max-width: 320px;
  width: 100%;
  box-shadow: 0 30px 50px rgba(0,0,0,0.5);
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  .check-icon {
    color: #22C55E;
    margin-bottom: 28px;
    display: flex;
    justify-content: center;
    svg { filter: drop-shadow(0 4px 12px rgba(34,197,94,0.4)); }
  }

  .success-title {
    font-size: 22px;
    font-weight: 800;
    color: ${p => p.theme.colors?.text || '#F8FAFC'};
    margin-bottom: 16px;
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
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(34,197,94,0.4);
    }
  }

  @media (max-width: 768px) {
    padding: clamp(36px, 10vw, 48px) clamp(22px, 6vw, 32px) clamp(28px, 8vw, 36px);
    border-radius: clamp(18px, 5vw, 24px);
    max-width: min(380px, 100%);
    .check-icon { margin-bottom: clamp(20px, 6vw, 28px); }
    .success-title { font-size: clamp(20px, 5.6vw, 24px); margin-bottom: clamp(12px, 3.6vw, 16px); }
    .success-detail { font-size: clamp(14px, 3.8vw, 16px); margin-bottom: clamp(24px, 6.5vw, 32px); line-height: 1.7; }
    .close-button {
      padding: clamp(14px, 4vw, 18px) 0;
      border-radius: clamp(12px, 3.6vw, 16px);
      font-size: clamp(15px, 4.2vw, 17px);
    }
  }
`;

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

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      &[type='number'] { -moz-appearance: textfield; }
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

  @media (max-width: 768px) {
    margin-bottom: clamp(14px, 4vw, 20px);

    label {
      font-size: clamp(11px, 3.2vw, 13px);
      margin-bottom: clamp(5px, 1.6vw, 8px);
      letter-spacing: 0.4px;
    }

    .input-wrap {
      border-radius: clamp(8px, 2.6vw, 12px);
      padding: 0 clamp(12px, 3.6vw, 16px);
      min-height: clamp(44px, 12vw, 54px);

      .prefix { font-size: clamp(14px, 4vw, 17px); margin-right: clamp(6px, 2vw, 10px); }
      input {
        padding: clamp(10px, 3vw, 14px) 0;
        font-size: clamp(15px, 4.2vw, 18px);
        &::placeholder { font-size: clamp(14px, 4vw, 17px); }
      }
      .suffix { font-size: clamp(12px, 3.4vw, 15px); }
    }

    .helper-text { font-size: clamp(11px, 3vw, 13px); margin-top: clamp(4px, 1.4vw, 6px); }
    .error-text { font-size: clamp(11px, 3vw, 13px); margin-top: clamp(4px, 1.4vw, 6px); }
  }
`;

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

  &:active:not(:disabled) { transform: scale(0.98); }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: clamp(14px, 3.8vw, 18px) 0;
    border-radius: clamp(10px, 3vw, 14px);
    font-size: clamp(15px, 4.2vw, 18px);
    margin-top: clamp(6px, 2vw, 10px);
  }
`;

const OverviewBalance = styled.div`
  background: linear-gradient(
    135deg,
    ${p => p.theme.colors?.accent || '#3B82F6'},
    ${p => p.theme.colors?.accentDark || '#1D4ED8'}
  );
  border-radius: 14px;
  padding: 20px;
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
    word-break: break-all;
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

    &:hover { background: rgba(255,255,255,0.25); }
  }

  .sub {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    padding: clamp(20px, 5.5vw, 26px) clamp(14px, 4vw, 20px);
    border-radius: clamp(12px, 3.5vw, 16px);
    margin-bottom: clamp(14px, 4vw, 20px);
    .label { font-size: clamp(12px, 3.2vw, 14px); letter-spacing: 0.6px; }
    .nickname { font-size: clamp(12px, 3.2vw, 14px); margin-bottom: clamp(6px, 2vw, 10px); }
    .balance-row { gap: clamp(8px, 2.4vw, 12px); }
    .balance { font-size: clamp(26px, 7.5vw, 34px); }
    .eye-btn {
      padding: clamp(6px, 1.8vw, 9px);
      border-radius: clamp(8px, 2.4vw, 10px);
      svg { width: clamp(18px, 5vw, 22px); height: clamp(18px, 5vw, 22px); }
    }
    .sub { font-size: clamp(12px, 3.4vw, 14px); margin-top: clamp(4px, 1.4vw, 8px); }
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
      word-break: break-all;
    }

    .stat-label {
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      color: ${p => p.theme.colors?.textMuted || '#94A3B8'};
      margin-top: 2px;
    }
  }

  @media (max-width: 768px) {
    gap: clamp(8px, 2.4vw, 12px);
    margin-bottom: clamp(14px, 4vw, 20px);
    .stat {
      padding: clamp(12px, 3.4vw, 16px) clamp(4px, 1.6vw, 8px);
      border-radius: clamp(10px, 3vw, 14px);
      .stat-value { font-size: clamp(14px, 4vw, 17px); }
      .stat-label { font-size: clamp(10px, 2.8vw, 12px); margin-top: clamp(3px, 1vw, 6px); }
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
      .tx-name { font-size: 12px; font-weight: 600; color: ${p => p.theme.colors?.text || '#F8FAFC'}; }
      .tx-date { font-size: 9px; color: ${p => p.theme.colors?.textMuted || '#94A3B8'}; }
    }

    .tx-amount {
      font-weight: 700;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      &.positive { color: ${p => p.theme.colors?.success || '#22C55E'}; }
      &.negative { color: ${p => p.theme.colors?.danger || '#EF4444'}; }
    }
  }

  @media (max-width: 768px) {
    .section-title { font-size: clamp(12px, 3.2vw, 14px); margin-bottom: clamp(8px, 2.4vw, 12px); }
    .tx-item {
      padding: clamp(10px, 3vw, 14px) clamp(8px, 2.4vw, 12px);
      gap: clamp(10px, 3vw, 14px);
      .tx-icon {
        width: clamp(34px, 9.6vw, 44px);
        height: clamp(34px, 9.6vw, 44px);
        border-radius: clamp(8px, 2.6vw, 12px);
        svg { width: clamp(16px, 4.6vw, 22px); height: clamp(16px, 4.6vw, 22px); }
      }
      .tx-info {
        .tx-name { font-size: clamp(13px, 3.6vw, 15px); }
        .tx-date { font-size: clamp(11px, 3vw, 13px); }
      }
      .tx-amount { font-size: clamp(13px, 3.6vw, 15px); }
    }
  }
`;

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

  @media (max-width: 768px) {
    gap: clamp(6px, 2vw, 10px);
    margin-bottom: clamp(12px, 3.6vw, 16px);
    .filter-btn {
      padding: clamp(6px, 1.8vw, 9px) clamp(14px, 4vw, 20px);
      font-size: clamp(12px, 3.2vw, 14px);
      border-radius: clamp(20px, 5.4vw, 24px);
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
        .h-name { font-size: 12px; font-weight: 600; color: ${p => p.theme.colors?.text || '#F8FAFC'}; }
        .h-date { font-size: 9px; color: ${p => p.theme.colors?.textMuted || '#94A3B8'}; }
        .h-reference { font-size: 9px; color: ${p => p.theme.colors?.textMuted || '#94A3B8'}; font-family: 'Courier New', monospace; }
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

  @media (max-width: 768px) {
    .history-item {
      padding: clamp(10px, 3vw, 14px) 0;
      gap: clamp(8px, 2.4vw, 12px);
      .left {
        gap: clamp(10px, 3vw, 14px);
        .h-icon {
          width: clamp(34px, 9.6vw, 44px);
          height: clamp(34px, 9.6vw, 44px);
          border-radius: clamp(8px, 2.6vw, 12px);
          svg { width: clamp(16px, 4.6vw, 22px); height: clamp(16px, 4.6vw, 22px); }
        }
        .h-info {
          .h-name { font-size: clamp(13px, 3.6vw, 15px); }
          .h-date { font-size: clamp(11px, 3vw, 13px); }
          .h-reference { font-size: clamp(11px, 3vw, 13px); }
        }
      }
      .h-amount { font-size: clamp(13px, 3.6vw, 15px); }
    }
  }
`;

// ============================================
// CORE CONTAINERS
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
  z-index: 200;
  min-height: 76px;
  flex-shrink: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 1024px) {
    padding: 12px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    padding: calc(clamp(12px, 3.4vw, 18px) + env(safe-area-inset-top, 0px)) clamp(14px, 4vw, 20px) clamp(12px, 3.4vw, 16px);
    min-height: auto;
    flex-wrap: wrap;
    gap: clamp(10px, 3vw, 14px);
    align-items: center;
    z-index: 200;
  }

  @media (max-width: 480px) {
    padding: calc(clamp(10px, 3.2vw, 16px) + env(safe-area-inset-top, 0px)) clamp(12px, 3.6vw, 16px) clamp(10px, 3.2vw, 14px);
    gap: clamp(8px, 2.6vw, 12px);
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: clamp(10px, 3vw, 14px);
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 480px) {
    gap: clamp(8px, 2.6vw, 12px);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 8px;
  }

  @media (max-width: 768px) {
    gap: clamp(6px, 2vw, 10px);
    width: 100%;
    justify-content: flex-end;
    order: 2;
    flex-wrap: nowrap;
  }

  @media (max-width: 480px) {
    gap: clamp(5px, 1.8vw, 8px);
    justify-content: flex-end;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const GlassDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: auto;
  min-width: 300px;
  max-width: 90vw;
  max-height: 450px;
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
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

  @media (max-width: 768px) {
    min-width: 0;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 140px);
    max-height: calc(100dvh - 140px);
    padding: clamp(6px, 2vw, 10px);
    border-radius: clamp(12px, 3.5vw, 16px);
  }
`;

const RightAnchoredDropdown = styled(GlassDropdownMenu)`
  left: auto;
  right: 0;
`;

const FundsDropdownMenu = styled(GlassDropdownMenu)`
  left: auto;
  right: 0;

  @media (max-width: 768px) {
    left: 0;
    right: auto;
  }
`;

const ThemeDropdownMenu = styled(GlassDropdownMenu)`
  left: 0;
  right: auto;
  min-width: 180px;
  width: max-content;

  @media (max-width: 768px) {
    min-width: 0;
    width: auto;
    max-width: calc(100vw - 32px);
  }
`;

const PlatformDropdown = styled(GlassDropdownMenu)`
  min-width: 210px;
  left: 0;
  right: auto;

  @media (max-width: 768px) {
    min-width: 0;
    max-width: calc(100vw - 32px);
  }
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
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: clamp(6px, 2vw, 10px) clamp(10px, 3vw, 14px) clamp(8px, 2.6vw, 12px);
    font-size: clamp(11px, 3.2vw, 13px);
    letter-spacing: 0.7px;
    margin-bottom: clamp(4px, 1.4vw, 8px);
  }
`;

const DropdownSection = styled.div`
  padding: 8px 0 0;
  margin-top: 4px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};

  @media (max-width: 768px) {
    padding: clamp(6px, 2vw, 10px) 0 0;
    margin-top: clamp(4px, 1.4vw, 8px);
  }
`;

const IconThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.05)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.12)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  padding: 0;
  flex-shrink: 0;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 16px ${props => (props.theme?.colors?.accent || '#3b82f6') + '20'};
    .theme-icon { animation: ${rotateIn} 0.6s ease; }
  }

  .theme-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    width: clamp(40px, 11vw, 50px);
    height: clamp(40px, 11vw, 50px);
    border-radius: clamp(10px, 3vw, 14px);
    svg { width: clamp(18px, 5vw, 24px); height: clamp(18px, 5vw, 24px); }
  }

  @media (max-width: 480px) {
    width: clamp(38px, 10.5vw, 46px);
    height: clamp(38px, 10.5vw, 46px);
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

  .flag-badge { flex-shrink: 0; }

  .theme-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & > span:not(.color-dot):not(.theme-label):not(.flag-badge) {
    flex-shrink: 0;
    white-space: nowrap;
  }

  .check-mark { color: ${props => props.theme?.colors?.accent || '#3b82f6'}; font-weight: 700; flex-shrink: 0; }

  @media (max-width: 768px) {
    padding: clamp(10px, 3vw, 14px) clamp(10px, 3vw, 14px);
    gap: clamp(10px, 3vw, 14px);
    font-size: clamp(13px, 3.8vw, 16px);
    border-radius: clamp(8px, 2.6vw, 12px);
    .color-dot { width: clamp(16px, 4.6vw, 20px); height: clamp(16px, 4.6vw, 20px); }
    .flag-badge { font-size: clamp(16px, 4.6vw, 20px); }
  }
`;

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
  flex-shrink: 0;

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

  .funds-content { display: flex; flex-direction: column; line-height: 1.2; }
  .funds-title { font-size: 12.5px; font-weight: 700; white-space: nowrap; }
  .funds-sub {
    font-size: 9px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 500;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }

  .arrow {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease, color 0.3s ease;
    opacity: 0.8;
    margin-left: 2px;
  }

  @media (max-width: 768px) {
    padding: clamp(10px, 2.8vw, 14px) clamp(12px, 3.6vw, 16px);
    gap: clamp(8px, 2.4vw, 12px);
    border-radius: clamp(10px, 3vw, 14px);
    .funds-sub { display: none; }
    .funds-title { font-size: clamp(13px, 3.8vw, 16px); }
    .funds-icon-wrapper svg { width: clamp(18px, 5vw, 22px); height: clamp(18px, 5vw, 22px); }
  }

  @media (max-width: 480px) {
    padding: clamp(9px, 2.6vw, 12px) clamp(10px, 3vw, 14px);
    gap: clamp(6px, 2vw, 10px);
    .funds-title { font-size: clamp(12px, 3.6vw, 15px); }
    .funds-icon-wrapper svg { width: clamp(16px, 4.6vw, 20px); height: clamp(16px, 4.6vw, 20px); }
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
    flex-shrink: 0;
  }

  .fund-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .fund-name { font-weight: 700; white-space: nowrap; }
  .fund-desc {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    padding: clamp(12px, 3.4vw, 16px) clamp(10px, 3vw, 14px);
    gap: clamp(12px, 3.6vw, 16px);
    border-radius: clamp(8px, 2.6vw, 12px);

    .fund-icon {
      width: clamp(36px, 10vw, 46px);
      height: clamp(36px, 10vw, 46px);
      border-radius: clamp(8px, 2.6vw, 12px);
      svg { width: clamp(18px, 5vw, 22px); height: clamp(18px, 5vw, 22px); }
    }
    .fund-name { font-size: clamp(14px, 4vw, 17px); }
    .fund-desc { font-size: clamp(12px, 3.2vw, 14px); }
  }

  @media (max-width: 480px) {
    padding: clamp(10px, 3vw, 14px) clamp(8px, 2.6vw, 12px);
    gap: clamp(10px, 3vw, 14px);

    .fund-icon {
      width: clamp(34px, 9.6vw, 42px);
      height: clamp(34px, 9.6vw, 42px);
      svg { width: clamp(16px, 4.6vw, 20px); height: clamp(16px, 4.6vw, 20px); }
    }
    .fund-name { font-size: clamp(13px, 3.8vw, 16px); }
    .fund-desc { font-size: clamp(11px, 3vw, 13px); }
  }
`;

const DISPLAY_CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar',       symbol: '$',   rate: 1,        decimals: 2 },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro',            symbol: '€',   rate: 0.92,     decimals: 2 },
  { code: 'KSH', flag: '🇰🇪', name: 'Kenyan Shilling', symbol: 'KSh', rate: 131,      decimals: 2 },
  { code: 'BTC', flag: '₿',  name: 'Bitcoin',          symbol: '₿',   rate: 0.0000154, decimals: 8 },
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
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#1e293b'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 20px ${props => (props.theme?.colors?.accent || '#3b82f6') + '15'};
  }

  .flag-badge { font-size: 16px; flex-shrink: 0; }
  .balance-display { font-weight: 700; white-space: nowrap; }

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
    white-space: nowrap;
    flex-shrink: 0;
  }

  .currency-tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.15)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    font-weight: 800;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .chevron { display: flex; align-items: center; opacity: 0.6; flex-shrink: 0; }

  @media (max-width: 768px) {
    padding: clamp(10px, 2.8vw, 14px) clamp(10px, 3vw, 14px);
    font-size: clamp(13px, 3.6vw, 15px);
    gap: clamp(6px, 2vw, 10px);
    border-radius: clamp(10px, 3vw, 14px);
    .flag-badge { font-size: clamp(16px, 4.6vw, 20px); }
    .currency-tag { font-size: clamp(9px, 2.6vw, 11px); padding: 2px clamp(5px, 1.6vw, 8px); }
    .account-type-badge { font-size: clamp(9px, 2.6vw, 11px); padding: 2px clamp(5px, 1.6vw, 8px); margin-left: 3px; }
    .chevron svg { width: clamp(12px, 3.4vw, 15px); height: clamp(12px, 3.4vw, 15px); }
  }

  @media (max-width: 480px) {
    padding: clamp(8px, 2.6vw, 12px) clamp(8px, 2.6vw, 12px);
    gap: clamp(5px, 1.8vw, 8px);
    font-size: clamp(12px, 3.4vw, 14px);
    .flag-badge { font-size: clamp(15px, 4.4vw, 18px); }
    .balance-display { font-size: clamp(12px, 3.4vw, 14px); }
    .currency-tag { display: none; }
    .account-type-badge { font-size: clamp(8px, 2.4vw, 10px); padding: 1px clamp(4px, 1.4vw, 7px); margin-left: 2px; }
    .chevron svg { width: clamp(10px, 3vw, 13px); height: clamp(10px, 3vw, 13px); }
  }
`;

const CurrencyOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
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

  .flag { font-size: 16px; min-width: 20px; text-align: center; flex-shrink: 0; }
  .code { font-weight: 700; min-width: 34px; white-space: nowrap; flex-shrink: 0; }
  .name {
    flex: 1;
    font-weight: 500;
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .check { color: ${props => props.theme?.colors?.accent || '#3b82f6'}; flex-shrink: 0; }

  @media (max-width: 768px) {
    padding: clamp(11px, 3vw, 14px) clamp(10px, 3vw, 14px);
    gap: clamp(10px, 3vw, 14px);
    border-radius: clamp(8px, 2.6vw, 12px);
    .flag { font-size: clamp(18px, 5vw, 22px); min-width: clamp(22px, 6.5vw, 28px); }
    .code { min-width: clamp(38px, 11vw, 48px); font-size: clamp(13px, 3.6vw, 15px); }
    .name { font-size: clamp(11px, 3vw, 13px); }
    .check { font-size: clamp(14px, 4vw, 17px); }
  }

  @media (max-width: 480px) {
    padding: clamp(10px, 2.8vw, 12px) clamp(8px, 2.6vw, 12px);
    gap: clamp(8px, 2.4vw, 12px);
    .flag { font-size: clamp(16px, 4.6vw, 20px); min-width: clamp(20px, 6vw, 24px); }
    .code { min-width: clamp(34px, 10vw, 44px); font-size: clamp(12px, 3.4vw, 14px); }
    .name { font-size: clamp(10px, 2.8vw, 12px); }
  }
`;

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
  flex-shrink: 0;

  &:hover {
    border-color: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    background: ${props => (props.theme?.colors?.danger || '#ef4444') + '15'};
    transform: translateX(-2px);
    .exit-icon { stroke: ${props => props.theme?.colors?.danger || '#ef4444'}; }
  }

  .exit-icon { width: 16px; height: 16px; transition: stroke 0.3s ease; display: flex; }

  @media (max-width: 768px) {
    padding: clamp(10px, 2.8vw, 14px) clamp(12px, 3.6vw, 16px);
    font-size: clamp(13px, 3.6vw, 15px);
    border-radius: clamp(10px, 3vw, 14px);
    gap: clamp(6px, 2vw, 10px);
    .exit-icon { width: clamp(16px, 4.6vw, 20px); height: clamp(16px, 4.6vw, 20px); }
  }

  @media (max-width: 480px) {
    padding: clamp(9px, 2.6vw, 12px) clamp(10px, 3vw, 14px);
    font-size: clamp(12px, 3.4vw, 14px);
    gap: clamp(4px, 1.4vw, 8px);
    span:not(.exit-icon) { display: none; }
    .exit-icon { width: clamp(16px, 4.6vw, 20px); height: clamp(16px, 4.6vw, 20px); }
  }
`;

const THEME_OPTIONS = [
  { key: 'white',  name: 'White',  color: '#f4f6f9' },
  { key: 'dark',   name: 'Dark',   color: '#09090b' },
  { key: 'gold',   name: 'Gold',   color: '#0b0a08' },
  { key: 'forest', name: 'Forest', color: '#050c09' },
  { key: 'ocean',  name: 'Ocean',  color: '#030b12' },
  { key: 'red',    name: 'Red',    color: '#0c0505' },
  { key: 'orange', name: 'Orange', color: '#0c0703' },
];

const PLATFORM_OPTIONS = {
  deriv: { label: 'deriv', color: '#ff444f', definition: 'Synthetic Indices', route: '/derivdash' },
  forex: { label: 'forex', color: '#3b82f6', definition: 'Currency Pairs',     route: '/forexdash' },
};

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
// BRAND COMPONENTS
// ============================================
const BrandContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
`;

const BrandText = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.35rem;
  font-weight: 800;
  user-select: none;
  cursor: default;
  gap: 2px;
  white-space: nowrap;

  .voltix {
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  @media (max-width: 768px) {
    font-size: clamp(1.05rem, 4.6vw, 1.3rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(1rem, 4.4vw, 1.2rem);
  }
`;

const PlatformSelector = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: ${props => props.$color || '#ff444f'};
  font-style: italic;
  font-weight: 900;
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  transition: color 0.25s ease;

  &:hover { opacity: 0.9; }

  .chevron {
    display: flex;
    align-items: center;
    color: inherit;
    transition: color 0.25s ease;
  }

  .platform-definition {
    font-size: 0.6em;
    font-style: italic;
    font-weight: 600;
    opacity: 0.75;
    letter-spacing: 0.2px;
    white-space: nowrap;
    color: inherit;
  }

  @media (max-width: 480px) {
    .platform-definition { display: none; }
  }
`;

const PlatformOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
  font-weight: 700;
  font-style: italic;
  color: ${props => (props.$active ? props.$color : props.theme?.colors?.textSecondary || '#cbd5e1')};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59,130,246,0.08)'};
    color: ${props => props.$color};
  }

  .platform-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$color};
    box-shadow: 0 0 8px ${props => props.$color};
    flex-shrink: 0;
  }

  .platform-desc {
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    margin-left: auto;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    padding: clamp(11px, 3vw, 14px) clamp(10px, 3vw, 14px);
    gap: clamp(10px, 3vw, 14px);
    font-size: clamp(13px, 3.6vw, 15px);
    border-radius: clamp(8px, 2.6vw, 12px);
    .platform-dot { width: clamp(9px, 2.6vw, 12px); height: clamp(9px, 2.6vw, 12px); }
    .platform-desc { font-size: clamp(11px, 3vw, 13px); }
  }
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 3px;

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${props => props.connected ? '#10b981' : '#ef4444'};
    box-shadow: 0 0 6px ${props => props.connected ? '#10b981' : '#ef4444'};
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }

  .status-text {
    font-size: 10px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    gap: clamp(5px, 1.6vw, 8px);
    margin-top: clamp(3px, 1vw, 6px);
    .status-dot {
      width: clamp(8px, 2.4vw, 11px);
      height: clamp(8px, 2.4vw, 11px);
    }
    .status-text { font-size: clamp(10px, 2.8vw, 12px); letter-spacing: 0.4px; }
  }

  @media (max-width: 480px) {
    .status-text { font-size: clamp(9px, 2.6vw, 11px); }
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

  &:active { transform: scale(0.94); }

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

  @media (max-width: 768px) {
    width: clamp(42px, 11.5vw, 52px);
    height: clamp(42px, 11.5vw, 52px);
    border-radius: clamp(10px, 3vw, 14px);
    gap: clamp(4px, 1.4vw, 7px);
    .line {
      height: clamp(2px, 0.6vw, 3px);
      &:nth-child(1) { width: clamp(20px, 5.6vw, 26px); transform: ${props => props.isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0)'}; }
      &:nth-child(2) { width: clamp(16px, 4.6vw, 21px); }
      &:nth-child(3) { width: ${props => props.isOpen ? 'clamp(20px, 5.6vw, 26px)' : 'clamp(11px, 3.2vw, 15px)'}; transform: ${props => props.isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'rotate(0)'}; }
    }
  }

  @media (max-width: 480px) {
    width: clamp(40px, 11vw, 48px);
    height: clamp(40px, 11vw, 48px);
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const TopPanel = ({
  isSidebarOpen,
  onSidebarToggle,
  currentTheme = 'gold',
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
  const topBarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const DEPOSIT_RATE = 131;
  const WITHDRAW_RATE = 126;

  const isForex = location.pathname.startsWith('/forex');
  const isDeriv = location.pathname.startsWith('/deriv');
  const showSidebarToggle = !!onSidebarToggle;

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

  useEffect(() => {
    if (location.pathname.startsWith('/forex')) {
      setPlatform('forex');
    } else if (location.pathname.startsWith('/deriv')) {
      setPlatform('deriv');
    }
  }, [location.pathname]);

  const getCurrencyInfo = (code = selectedCurrency) =>
    DISPLAY_CURRENCIES.find(c => c.code === code) || DISPLAY_CURRENCIES[0];

  const convertFromUSD = (usdAmount, code = selectedCurrency) => {
    const info = getCurrencyInfo(code);
    return usdAmount * info.rate;
  };

  const formatAmount = (amountInSelectedCurrency, { withSymbol = true, code = selectedCurrency } = {}) => {
    const info = getCurrencyInfo(code);
    let fixed = amountInSelectedCurrency.toFixed(info.decimals);

    if (info.decimals <= 2) {
      fixed = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return withSymbol ? `${info.symbol} ${fixed}` : fixed;
  };

  const formatFromUSD = (usdAmount, opts) =>
    formatAmount(convertFromUSD(usdAmount), opts);

  const getFormattedBalance = (acc) => formatFromUSD(acc.balance);

  const getMaskedBalance = () => {
    const info = getCurrencyInfo();
    const mask = info.decimals > 2 ? `${'*'.repeat(1)}.${'*'.repeat(info.decimals)}` : '****.**';
    return `${info.symbol} ${mask}`;
  };

  const getCurrencyFlag = () => getCurrencyInfo().flag;

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

  const handlePlatformSelect = (key) => {
    const opt = PLATFORM_OPTIONS[key];
    setPlatform(key);
    setIsPlatformOpen(false);
    if (opt?.route && location.pathname !== opt.route) {
      navigate(opt.route);
    }
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

  useEffect(() => {
    const el = topBarRef.current;
    if (!el) return;

    const setH = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      if (h > 0) {
        document.documentElement.style.setProperty('--topbar-h', `${h}px`);
      }
    };

    setH();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(setH);
      ro.observe(el);
    }
    window.addEventListener('resize', setH);
    window.addEventListener('orientationchange', setH);

    const t = setTimeout(setH, 250);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', setH);
      window.removeEventListener('orientationchange', setH);
      clearTimeout(t);
    };
  }, []);

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
                  {showBalance ? getFormattedBalance(currentAccount) : getMaskedBalance()}
                </div>
                <div className="eye-btn" onClick={() => setShowBalance(!showBalance)}>
                  <EyeIcon visible={showBalance} />
                </div>
              </div>
              <div className="sub">{currentAccount.label} Account • {selectedCurrency}</div>
            </OverviewBalance>
            <OverviewStats>
              <div className="stat">
                <div className="stat-value">
                  {formatFromUSD(parseFloat(currentAccount.balance) * 0.1, { withSymbol: false })}
                </div>
                <div className="stat-label">Invested</div>
              </div>
              <div className="stat">
                <div className="stat-value" style={{ color: '#22C55E' }}>
                  +{formatFromUSD(12.50)}
                </div>
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
                    {tx.positive ? '+' : '-'}{formatFromUSD(tx.amount)}
                  </div>
                </div>
              ))}
            </RecentTransactions>
          </>
        );

      case 'deposit':
        if (depositPending) {
          return (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Spinner />
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', color: '#F8FAFC' }}>
                Please wait for the payment prompt on your phone and enter your PIN to complete the transaction.
              </div>
              <button
                onClick={() => setDepositPending(false)}
                style={{ padding: '8px 20px', borderRadius: '8px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                OK
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
                <input type="text" value="Deriv Main Wallet" disabled style={{ fontWeight: '600', opacity: 0.7 }} />
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
                style={{ width: '100%', padding: '10px', marginTop: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#94A3B8', fontWeight: 600, cursor: 'pointer' }}
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
                <input type="text" value="Deriv Main Wallet" disabled style={{ fontWeight: '600', opacity: 0.7 }} />
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
                    {tx.positive ? '+' : '-'}{formatFromUSD(tx.amount)}
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
      <TopBar ref={topBarRef}>
        <LeftSection className="left-section">
          {showSidebarToggle && (
            <SidebarToggle
              isOpen={isSidebarOpen}
              onClick={onSidebarToggle}
              className="sidebar-toggle"
              aria-label="Toggle sidebar"
            >
              <span className="line" />
              <span className="line" />
              <span className="line" />
            </SidebarToggle>
          )}

          <BrandContainer>
            <BrandText>
              <span className="voltix">MyTradeApp.</span>
              <DropdownContainer ref={platformRef}>
                <PlatformSelector
                  onClick={togglePlatformDropdown}
                  $color={PLATFORM_OPTIONS[platform].color}
                >
                  <span>{PLATFORM_OPTIONS[platform].label}</span>
                  <span className="platform-definition">
                    ({PLATFORM_OPTIONS[platform].definition})
                  </span>
                  <span className="chevron"><ChevronDownIcon open={isPlatformOpen} /></span>
                </PlatformSelector>
                <PlatformDropdown isOpen={isPlatformOpen}>
                  <MenuHeader>Select Platform</MenuHeader>
                  {Object.entries(PLATFORM_OPTIONS).map(([key, opt]) => (
                    <PlatformOptionItem
                      key={key}
                      $active={platform === key}
                      $color={opt.color}
                      onClick={() => handlePlatformSelect(key)}
                    >
                      <span className="platform-dot" />
                      <span>{opt.label}</span>
                      <span className="platform-desc">({opt.definition})</span>
                    </PlatformOptionItem>
                  ))}
                </PlatformDropdown>
              </DropdownContainer>
            </BrandText>
            <ConnectionStatus connected={connected}>
              <span className="status-dot" />
              <span className="status-text">{connected ? 'Connected' : 'Disconnected'}</span>
            </ConnectionStatus>
          </BrandContainer>
        </LeftSection>

        {/* Forex-only: live session display (replaces the old nav buttons) */}
        {isForex && <ForexSessionDisplay />}

        <RightSection>
          <DropdownContainer ref={themeRef}>
            <IconThemeButton onClick={toggleThemeDropdown} aria-label="Change theme">
              <span className="theme-icon"><ThemeIcon /></span>
            </IconThemeButton>
            <ThemeDropdownMenu isOpen={isThemeOpen}>
              <MenuHeader>Choose Theme</MenuHeader>
              {THEME_OPTIONS.map((t) => (
                <ThemeOptionItem
                  key={t.key}
                  onClick={() => { if (onThemeChange) onThemeChange(t.key); setIsThemeOpen(false); }}
                  className={currentTheme === t.key ? 'active' : ''}
                >
                  <span className="color-dot" style={{ background: t.color }} />
                  <span className="theme-label">{t.name}</span>
                  {currentTheme === t.key && <span className="check-mark">✓</span>}
                </ThemeOptionItem>
              ))}
            </ThemeDropdownMenu>
          </DropdownContainer>

          {!isForex && (
            <DropdownContainer ref={fundsRef}>
              <FundsButton onClick={toggleFundsDropdown}>
                <span className="funds-icon-wrapper"><FundsIcon /></span>
                <span className="funds-content">
                  <span className="funds-title">Funds</span>
                  <span className="funds-sub">Manage your money</span>
                </span>
                <span className="arrow"><ChevronDownIcon open={isFundsOpen} /></span>
              </FundsButton>
              <FundsDropdownMenu isOpen={isFundsOpen}>
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
              </FundsDropdownMenu>
            </DropdownContainer>
          )}

          {!isForex && (
            <DropdownContainer ref={dropdownRef}>
              <AccountBadge onClick={toggleDropdown} isDemo={isDemo}>
                <span className="flag-badge">{getCurrencyFlag()}</span>
                <span className="balance-display">{getFormattedBalance(currentAccount)}</span>
                <span className="account-type-badge">{currentAccount.label}</span>
                <span className="currency-tag">{selectedCurrency}</span>
                <span className="chevron"><ChevronDownIcon open={isDropdownOpen} /></span>
              </AccountBadge>
              <RightAnchoredDropdown isOpen={isDropdownOpen}>
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
                <DropdownSection>
                  <MenuHeader style={{ marginBottom: '6px' }}>Display currency in</MenuHeader>
                  {DISPLAY_CURRENCIES.map((curr) => (
                    <CurrencyOptionItem
                      key={curr.code}
                      onClick={() => { setSelectedCurrency(curr.code); setIsDropdownOpen(false); }}
                      className={selectedCurrency === curr.code ? 'active' : ''}
                    >
                      <span className="flag">{curr.flag}</span>
                      <span className="code">{curr.code}</span>
                      <span className="name">{curr.name}</span>
                      {selectedCurrency === curr.code && <span className="check">✓</span>}
                    </CurrencyOptionItem>
                  ))}
                </DropdownSection>
              </RightAnchoredDropdown>
            </DropdownContainer>
          )}

          <ExitButton
            className="exit-button"
            onClick={() => navigate('/')}
            aria-label="Exit"
          >
            <span className="exit-icon"><ExitIcon /></span>
            <span>Exit</span>
          </ExitButton>
        </RightSection>
      </TopBar>

      {fundModalAction && createPortal(
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
        </ModalOverlay>,
        document.body
      )}
    </>
  );
};

export default TopPanel;