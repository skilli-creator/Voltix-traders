// src/components/TopBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// ANIMATIONS - SMOOTH & SUBTLE
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const rotateIn = keyframes`
  from { transform: rotate(0deg) scale(0.8); }
  to { transform: rotate(360deg) scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ============================================
// ICONS - CLEAN & MINIMAL
// ============================================
const ThemeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const DepositIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const WithdrawIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 6 10.5 15.5 15.5 10.5 23 18" />
    <polyline points="7 6 1 6 1 12" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronDownIcon = ({ open }) => (
  <svg 
    width="10" 
    height="10" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckmarkIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 7-7" />
  </svg>
);

const ExitIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v10" />
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
  </svg>
);

const EyeIcon = ({ visible }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const StrengthIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// ============================================
// FROSTED GLASS COMPONENTS - ULTRA TRANSPARENT
// ============================================

// TopBar - clean, minimal, with subtle glass
const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 32px;
  background: rgba(10, 14, 23, 0.55);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 64px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;

  @media (max-width: 1024px) {
    padding: 8px 20px;
    flex-wrap: wrap;
    gap: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 8px 16px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
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
  min-width: 160px;

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
  gap: 6px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    order: 2;
  }
`;

// Brand
const BrandContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BrandText = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 700;
  user-select: none;
  cursor: default;
  gap: 2px;
  
  .voltix {
    color: #ffffff;
    letter-spacing: -0.3px;
  }
  
  .badge {
    font-size: 9px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(34, 197, 94, 0.15);
    color: #22C55E;
    border: 1px solid rgba(34, 197, 94, 0.15);
    margin-left: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const PlatformSelector = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #22C55E;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  .chevron {
    display: flex;
    align-items: center;
    color: #22C55E;
    opacity: 0.6;
  }
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;

  .status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${props => props.connected ? '#22C55E' : '#EF4444'};
    animation: ${pulse} 2s ease-in-out infinite;
  }

  .status-text {
    font-size: 9px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.35);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

// Sidebar toggle
const SidebarToggle = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3.5px;
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .line {
    display: block;
    height: 1.5px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:nth-child(1) {
      width: 16px;
      transform: ${props => props.isOpen ? 'rotate(45deg) translate(3.5px, 4px)' : 'rotate(0)'};
    }
    &:nth-child(2) {
      width: 12px;
      opacity: ${props => props.isOpen ? '0' : '1'};
      transform: ${props => props.isOpen ? 'scaleX(0)' : 'scaleX(1)'};
    }
    &:nth-child(3) {
      width: ${props => props.isOpen ? '16px' : '8px'};
      transform: ${props => props.isOpen ? 'rotate(-45deg) translate(3.5px, -4px)' : 'rotate(0)'};
    }
  }
`;

// ============================================
// DROPDOWNS - ULTRA FROSTED GLASS
// ============================================
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const GlassDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  max-width: 90vw;
  max-height: 400px;
  overflow-y: auto;
  background: rgba(10, 14, 23, 0.3);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.96)'};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 300;
  overflow: hidden;

  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 10px; }
`;

const PlatformDropdown = styled(GlassDropdown)`
  min-width: 140px;
  left: 0;
  right: auto;
`;

const MenuHeader = styled.div`
  padding: 6px 12px 8px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  margin-bottom: 2px;
`;

// ============================================
// BUTTONS & CONTROLS - CLEAN & MINIMAL
// ============================================
const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: rgba(255, 255, 255, 0.5);
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(34, 197, 94, 0.3);
    color: #22C55E;

    .theme-icon {
      animation: ${rotateIn} 0.5s ease;
    }
  }

  .theme-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #22C55E;
    transition: all 0.3s ease;
  }
`;

const FundsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 8px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  background: rgba(34, 197, 94, 0.06);
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(34, 197, 94, 0.12);
    border-color: rgba(34, 197, 94, 0.4);
    transform: translateY(-1px);
  }

  .funds-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #22C55E;
  }

  .funds-content {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .funds-title {
    font-size: 12px;
    font-weight: 600;
  }

  .funds-sub {
    font-size: 8px;
    color: rgba(255, 255, 255, 0.25);
    font-weight: 500;
    letter-spacing: 0.2px;
  }

  .arrow {
    display: flex;
    align-items: center;
    opacity: 0.4;
    margin-left: 2px;
  }

  @media (max-width: 480px) {
    padding: 4px 10px;
    .funds-sub { display: none; }
    .funds-title { font-size: 11px; }
  }
`;

const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .flag { font-size: 16px; }
  .balance { 
    font-weight: 700;
    color: #ffffff;
    font-family: 'Courier New', monospace;
  }
  .account-type {
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 1px 8px;
    border-radius: 4px;
    background: ${props => props.isDemo ? 'rgba(59,130,246,0.12)' : 'rgba(34,197,94,0.12)'};
    color: ${props => props.isDemo ? '#60a5fa' : '#22C55E'};
    border: 1px solid ${props => props.isDemo ? 'rgba(59,130,246,0.15)' : 'rgba(34,197,94,0.15)'};
  }
  .currency-tag {
    font-size: 8px;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.4);
    font-weight: 700;
  }
  .chevron { display: flex; align-items: center; opacity: 0.3; }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 11px;
    .flag { font-size: 14px; }
    .currency-tag { font-size: 7px; padding: 0 4px; }
    .account-type { font-size: 7px; padding: 0 6px; }
    .balance { font-size: 11px; }
  }
`;

const ExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: transparent;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(239, 68, 68, 0.3);
    color: #EF4444;
    background: rgba(239, 68, 68, 0.06);
    transform: translateX(-2px);
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 10px;
    .exit-icon { width: 12px; height: 12px; }
  }
`;

// ============================================
// THEME OPTIONS
// ============================================
const THEME_OPTIONS = [
  { key: 'dark', name: 'Dark', color: '#0a0e17' },
  { key: 'light', name: 'Light', color: '#f0f2f5' },
  { key: 'forest', name: 'Forest', color: '#060d09' },
  { key: 'ocean', name: 'Ocean', color: '#040a12' },
  { key: 'gold', name: 'Gold', color: '#0b0906' },
];

const ThemeOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.8);
  }

  &.active {
    background: rgba(34, 197, 94, 0.06);
    color: #22C55E;
  }

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }

  .label { flex: 1; }
  .check { color: #22C55E; font-weight: 700; }
`;

const FundsOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.8);
  }

  .icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: rgba(34, 197, 94, 0.06);
    color: #22C55E;
    border: 1px solid rgba(34, 197, 94, 0.06);
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .name { font-weight: 600; color: rgba(255, 255, 255, 0.8); }
  .desc { font-size: 10px; color: rgba(255, 255, 255, 0.25); }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  font-weight: 500;
  outline: none;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:focus {
    border-color: rgba(34, 197, 94, 0.3);
    background: rgba(255, 255, 255, 0.04);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.15);
  }
`;

const CurrencyOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.8);
  }

  &.active {
    background: rgba(34, 197, 94, 0.06);
    color: #22C55E;
  }

  .flag { font-size: 16px; }
  .code { font-weight: 600; min-width: 28px; }
  .name { flex: 1; font-size: 10px; color: rgba(255, 255, 255, 0.2); }
  .check { color: #22C55E; }
`;

const CurrencyList = styled.div`
  max-height: 140px;
  overflow-y: auto;
  margin-top: 2px;

  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.04); border-radius: 10px; }
`;

// ============================================
// MODAL - ULTRA FROSTED GLASS
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 420px;
  max-height: 80vh;
  background: rgba(10, 14, 23, 0.65);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    max-width: 100%;
    margin: 12px;
    border-radius: 14px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;

  .group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(34, 197, 94, 0.08);
    color: #22C55E;
    border: 1px solid rgba(34, 197, 94, 0.06);
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.2px;
  }

  .sub {
    font-size: 11px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.25);
    margin-top: 1px;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.04);
    background: transparent;
    color: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      border-color: rgba(239, 68, 68, 0.3);
      color: #EF4444;
      transform: rotate(90deg);
    }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
  color: #ffffff;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.04); border-radius: 10px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

const KenyaDisclaimer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(251, 191, 36, 0.04);
  border: 1px solid rgba(251, 191, 36, 0.06);
  margin-bottom: 12px;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;

  &:before {
    content: '🇰🇪';
    font-size: 16px;
  }
`;

const WalletInfo = styled.div`
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(34, 197, 94, 0.04);
  border: 1px solid rgba(34, 197, 94, 0.06);
  margin-bottom: 12px;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.4;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.25);
    margin-bottom: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 8px;
    padding: 0 12px;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: rgba(34, 197, 94, 0.3);
      background: rgba(255, 255, 255, 0.04);
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.04);
    }

    .prefix {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.2);
      margin-right: 6px;
    }

    input {
      flex: 1;
      padding: 9px 0;
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 13px;
      font-weight: 500;
      outline: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;

      &::placeholder {
        color: rgba(255, 255, 255, 0.1);
        font-weight: 400;
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
      font-size: 11px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.15);
    }
  }

  .helper-text {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.15);
    margin-top: 3px;
  }

  .error-text {
    font-size: 10px;
    color: #EF4444;
    margin-top: 3px;
    font-weight: 500;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #22C55E, #16A34A);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 4px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(34, 197, 94, 0.2);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const OverviewBalance = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.05));
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 14px;
  text-align: center;
  border: 1px solid rgba(34, 197, 94, 0.06);

  .label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
  }

  .nickname {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.2);
    font-weight: 500;
    font-family: 'Courier New', monospace;
    margin-bottom: 6px;
  }

  .balance-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 2px;
  }

  .balance {
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    font-family: 'Courier New', monospace;
    letter-spacing: -1px;
  }

  .eye-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 6px;
    padding: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: rgba(255,255,255,0.3);

    &:hover {
      background: rgba(255,255,255,0.08);
    }
  }

  .sub {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.15);
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
    padding: 10px 6px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.02);

    .stat-value {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      font-family: 'Courier New', monospace;
    }

    .stat-label {
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(255, 255, 255, 0.15);
      margin-top: 2px;
      font-weight: 600;
    }
  }
`;

const RecentTransactions = styled.div`
  .section-title {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.15);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
  }

  .tx-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);

    &:last-child { border-bottom: none; }

    .tx-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: rgba(34, 197, 94, 0.04);
      color: #22C55E;
    }

    .tx-info {
      flex: 1;
      .tx-name {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
      }
      .tx-date {
        font-size: 9px;
        color: rgba(255, 255, 255, 0.15);
      }
    }

    .tx-amount {
      font-weight: 700;
      font-family: 'Courier New', monospace;
      font-size: 12px;

      &.positive { color: #22C55E; }
      &.negative { color: #EF4444; }
    }
  }
`;

const HistoryFilter = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;

  .filter-btn {
    padding: 3px 12px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.04);
    background: transparent;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;

    &.active {
      background: rgba(34, 197, 94, 0.06);
      border-color: rgba(34, 197, 94, 0.2);
      color: #22C55E;
    }

    &:hover:not(.active) {
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const HistoryList = styled.div`
  .history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);

    &:last-child { border-bottom: none; }

    .left {
      display: flex;
      align-items: center;
      gap: 8px;

      .h-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: rgba(34, 197, 94, 0.04);
        color: #22C55E;
      }

      .h-info {
        .h-name {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }
        .h-date {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.12);
        }
        .h-reference {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.08);
          font-family: 'Courier New', monospace;
        }
      }
    }

    .h-amount {
      font-weight: 700;
      font-size: 12px;
      font-family: 'Courier New', monospace;

      &.positive { color: #22C55E; }
      &.negative { color: #EF4444; }
    }
  }
`;

const ConfirmationMessage = styled.div`
  text-align: center;
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.04);
  color: #22C55E;
  font-weight: 600;
  font-size: 12px;
  line-height: 1.6;
  border: 1px solid rgba(34, 197, 94, 0.06);
`;

const SuccessOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: ${fadeIn} 0.3s ease;
  border-radius: 16px;
  padding: 20px;
`;

const SuccessCard = styled.div`
  background: rgba(10, 14, 23, 0.7);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 40px 28px 32px;
  text-align: center;
  max-width: 300px;
  width: 100%;
  box-shadow: 0 30px 60px rgba(0,0,0,0.4);
  animation: ${slideUp} 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  .check-icon {
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
  }

  .success-title {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 8px;
  }

  .success-detail {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 28px;
    line-height: 1.8;
    font-weight: 400;
  }

  .close-button {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    background: linear-gradient(135deg, #22C55E, #16A34A);
    color: #fff;
    border: none;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 30px rgba(34,197,94,0.2);
    }
  }
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255,255,255,0.04);
  border-top-color: #22C55E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 14px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ============================================
// MUSIC PLAYER - MINIMAL
// ============================================
const MusicPlayerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 4px 14px 4px 12px;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(34, 197, 94, 0.15);
    background: rgba(255, 255, 255, 0.03);
  }

  .label {
    font-size: 9px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  @media (max-width: 600px) {
    padding: 3px 10px 3px 8px;
    .label { font-size: 7px; }
  }
`;

const MusicDropdownButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  padding: 2px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.03);
  }

  @media (max-width: 600px) {
    max-width: 80px;
    font-size: 10px;
  }
`;

const MusicDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 14, 23, 0.4);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  width: 300px;
  max-height: 380px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  padding: 12px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.04); border-radius: 10px; }

  @media (max-width: 400px) {
    width: 260px;
  }
`;

const MusicSearchInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  margin-bottom: 8px;
  outline: none;

  &:focus {
    border-color: rgba(34, 197, 94, 0.2);
  }
`;

const MusicResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .thumb {
    width: 34px;
    height: 34px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.02);
    object-fit: cover;
    flex-shrink: 0;
  }

  .note {
    width: 34px;
    height: 34px;
    border-radius: 6px;
    background: rgba(34, 197, 94, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #22C55E;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    .title {
      font-size: 11px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .channel {
      font-size: 9px;
      color: rgba(255, 255, 255, 0.1);
    }
  }

  &.active {
    background: rgba(34, 197, 94, 0.04);
    border-left: 2px solid #22C55E;
  }
`;

const MusicControlButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    color: #22C55E;
    background: rgba(255, 255, 255, 0.03);
  }

  @media (max-width: 600px) {
    width: 20px;
    height: 20px;
    svg { width: 12px; height: 12px; }
  }
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 50px;
  height: 2px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.04);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #22C55E;
    cursor: pointer;
    border: 2px solid rgba(10, 14, 23, 0.8);
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  &::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #22C55E;
    cursor: pointer;
    border: 2px solid rgba(10, 14, 23, 0.8);
  }

  @media (max-width: 600px) {
    width: 30px;
  }
`;

const VolumeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="6 4 20 12 6 20 6 4" />
  </svg>
);

const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const NextIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="4 4 18 12 4 20 4 4" />
  </svg>
);

const PrevIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="20 4 6 12 20 20 20 4" />
  </svg>
);

const MusicIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

// ============================================
// COUNTRY CURRENCIES
// ============================================
const COUNTRY_CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro', symbol: '€' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound', symbol: '£' },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', flag: '🇨🇭', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar', symbol: 'AU$' },
  { code: 'KSh', flag: '🇰🇪', name: 'Kenyan Shilling', symbol: 'KSh' },
];

// ============================================
// MUSIC PLAYER LOGIC
// ============================================
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
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(searchQuery)}&type=video&key=${YOUTUBE_API_KEY}`
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
      <span className="label"><MusicIcon /> Music</span>

      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <MusicDropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {currentTitle.length > 16 ? currentTitle.substring(0, 14) + '…' : currentTitle}
          <ChevronDownIcon open={isDropdownOpen} />
        </MusicDropdownButton>

        <MusicDropdownMenu isOpen={isDropdownOpen}>
          <div style={{ marginBottom: 6, fontSize: 9, color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
            Search YouTube
          </div>
          <MusicSearchInput
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button
              onClick={handleSearch}
              style={{
                background: 'transparent',
                border: '1px solid rgba(34,197,94,0.2)',
                color: '#22C55E',
                padding: '3px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(34,197,94,0.06)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
            >
              Search
            </button>
          </div>

          {isSearching && <div style={{ textAlign: 'center', padding: 10, fontSize: 11, color: 'rgba(255,255,255,0.1)' }}>Searching…</div>}

          {searchResults.length > 0 && (
            <>
              <div style={{ marginTop: 6, marginBottom: 6, fontSize: 9, color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
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
              <div style={{ marginTop: 10, marginBottom: 6, fontSize: 9, color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
                Favourites
              </div>
              {localTracks.map((track, index) => (
                <MusicResultItem
                  key={track.src}
                  className={currentSource === 'local' && index === currentLocalIndex ? 'active' : ''}
                  onClick={() => playLocalTrack(index)}
                >
                  <div className="note"><MusicIcon /></div>
                  <div className="info">
                    <div className="title">{track.title}</div>
                  </div>
                </MusicResultItem>
              ))}
            </>
          )}
        </MusicDropdownMenu>
      </div>

      <MusicControlButton onClick={handlePrev}><PrevIcon /></MusicControlButton>
      <MusicControlButton onClick={togglePlay}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</MusicControlButton>
      <MusicControlButton onClick={handleNext}><NextIcon /></MusicControlButton>

      <VolumeIcon />
      <VolumeSlider type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />

      <audio ref={audioRef} style={{ display: 'none' }} onEnded={handleLocalEnded} />
      <div ref={playerContainerRef} style={{ display: 'none' }} />
    </MusicPlayerContainer>
  );
};

// ============================================
// MAIN TOPPANEL COMPONENT
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

  const fundOptions = [
    { icon: <OverviewIcon />, name: 'Overview', desc: 'View your balance', action: 'overview' },
    { icon: <DepositIcon />, name: 'Deposit', desc: 'Add funds via M-Pesa', action: 'deposit' },
    { icon: <WithdrawIcon />, name: 'Withdraw', desc: 'Withdraw to M-Pesa', action: 'withdraw' },
    { icon: <HistoryIcon />, name: 'History', desc: 'Transaction history', action: 'history' },
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
            <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
              <Spinner />
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: '#ffffff' }}>
                Please wait for the payment prompt on your phone and enter your PIN to complete the transaction.
              </div>
              <button 
                onClick={() => setDepositPending(false)}
                style={{ padding: '8px 20px', borderRadius: '6px', background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(34,197,94,0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(34,197,94,0.12)'}
              >
                OK, I understand
              </button>
            </div>
          );
        }

        return (
          <>
            <KenyaDisclaimer>This service is available exclusively in Kenya. Only M‑Pesa mobile wallet is supported.</KenyaDisclaimer>
            <WalletInfo>If your deposited funds are not visible for trading, log into your Deriv account and transfer them from your main wallet to your Options wallet.</WalletInfo>
            <FormGroup>
              <label>Deposit to</label>
              <div className="input-wrap">
                <span className="prefix">Wallet</span>
                <input type="text" value="Deriv Main Wallet" disabled style={{ fontWeight: '600', opacity: 0.4 }} />
              </div>
            </FormGroup>
            <FormGroup>
              <label>M‑Pesa Phone Number (starting with 1 or 7)</label>
              <div className="input-wrap">
                <span className="prefix">+254</span>
                <input type="tel" placeholder="1XX or 7XX XXX XXX" value={phoneNumber} onChange={handlePhoneChange} maxLength={9} />
              </div>
              <div className="helper-text">9 digits, must start with 1 or 7</div>
            </FormGroup>
            <FormGroup>
              <label>Amount (USD) - Min $1 / Max $2,000</label>
              <div className="input-wrap">
                <span className="prefix">$</span>
                <input type="number" placeholder="0.00" value={amount} onChange={handleAmountChange} min="1" max="2000" step="0.01" />
                <span className="suffix">≈ KES {(parseFloat(amount || 0) * rate).toFixed(0)}</span>
              </div>
              <div className="helper-text">1 USD = {rate} KES</div>
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
                <div className="check-icon"><CheckmarkIcon size={64} /></div>
                <div className="success-title">Request Submitted</div>
                <div className="success-detail">
                  Withdrawal of <strong>${withdrawConfirmationData.amount}</strong> to M‑Pesa <strong>+254{withdrawConfirmationData.originalPhone}</strong><br />
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
                Re-enter your phone number to confirm your ${withdrawConfirmationData.amount} withdrawal.
              </ConfirmationMessage>
              <FormGroup>
                <label>Re-enter M‑Pesa Phone Number</label>
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
                style={{ width: '100%', padding: '10px', marginTop: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', color: 'rgba(255,255,255,0.2)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.04)'}
              >
                Back
              </button>
            </div>
          );
        }

        return (
          <>
            <KenyaDisclaimer>This service is available exclusively in Kenya. Only M‑Pesa mobile wallet is supported.</KenyaDisclaimer>
            <WalletInfo>If your available balance appears incorrect, log into your Deriv account and transfer funds from your Options wallet to your main wallet.</WalletInfo>
            <FormGroup>
              <label>Withdraw From</label>
              <div className="input-wrap">
                <span className="prefix">Wallet</span>
                <input type="text" value="Deriv Main Wallet" disabled style={{ fontWeight: '600', opacity: 0.4 }} />
                <span className="suffix">{getFormattedBalance(currentAccount)}</span>
              </div>
            </FormGroup>
            <FormGroup>
              <label>M‑Pesa Wallet Number (starting with 1 or 7)</label>
              <div className="input-wrap">
                <span className="prefix">+254</span>
                <input type="tel" placeholder="1XX or 7XX XXX XXX" value={phoneNumber} onChange={handlePhoneChange} maxLength={9} />
              </div>
              <div className="helper-text">9 digits, starts with 1 or 7</div>
            </FormGroup>
            <FormGroup>
              <label>Amount to Withdraw (USD) - Min $1 / Max $2,000</label>
              <div className="input-wrap">
                <span className="prefix">$</span>
                <input type="number" placeholder="0.00" value={amount} onChange={handleAmountChange} min="1" max="2000" step="0.01" />
                <span className="suffix">≈ KES {(parseFloat(amount || 0) * rate).toFixed(0)}</span>
              </div>
              <div className="helper-text">1 USD = {rate} KES</div>
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
          <SidebarToggle isOpen={isSidebarOpen} onClick={onSidebarToggle}>
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </SidebarToggle>

          <BrandContainer>
            <BrandText>
              <span className="voltix">MyTradeApp</span>
              <span className="badge">Beta</span>
              <DropdownContainer ref={platformRef}>
                <PlatformSelector onClick={togglePlatformDropdown}>
                  <span style={{ color: platform === 'deriv' ? '#22C55E' : '#60a5fa' }}>{platform}</span>
                  <span className="chevron"><ChevronDownIcon open={isPlatformOpen} /></span>
                </PlatformSelector>
                <PlatformDropdown isOpen={isPlatformOpen}>
                  <MenuHeader>Select Platform</MenuHeader>
                  <div style={{ cursor: 'pointer', padding: '8px 14px', borderRadius: '6px', fontWeight: 600, color: platform === 'deriv' ? '#22C55E' : 'rgba(255,255,255,0.2)', transition: 'all 0.15s ease' }} onClick={() => { setPlatform('deriv'); setIsPlatformOpen(false); }}>Deriv</div>
                  <div style={{ cursor: 'pointer', padding: '8px 14px', borderRadius: '6px', fontWeight: 600, color: platform === 'forex' ? '#60a5fa' : 'rgba(255,255,255,0.2)', transition: 'all 0.15s ease' }} onClick={() => { setPlatform('forex'); setIsPlatformOpen(false); }}>Forex</div>
                  <div style={{ cursor: 'pointer', padding: '8px 14px', borderRadius: '6px', fontWeight: 600, color: platform === 'crypto' ? '#f59e0b' : 'rgba(255,255,255,0.2)', transition: 'all 0.15s ease' }} onClick={() => { setPlatform('crypto'); setIsPlatformOpen(false); }}>Crypto</div>
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
            <IconButton onClick={toggleThemeDropdown}>
              <span className="theme-icon"><ThemeIcon /></span>
            </IconButton>
            <GlassDropdown isOpen={isThemeOpen}>
              <MenuHeader>Choose Theme</MenuHeader>
              {THEME_OPTIONS.map((t) => (
                <ThemeOptionItem key={t.key} onClick={() => { if (onThemeChange) onThemeChange(t.key); setIsThemeOpen(false); }} className={currentTheme === t.key ? 'active' : ''}>
                  <span className="dot" style={{ background: t.color }} />
                  <span className="label">{t.name}</span>
                  {currentTheme === t.key && <span className="check">✓</span>}
                </ThemeOptionItem>
              ))}
            </GlassDropdown>
          </DropdownContainer>

          <DropdownContainer ref={fundsRef}>
            <FundsButton onClick={toggleFundsDropdown}>
              <span className="funds-icon-wrapper"><FundsIcon /></span>
              <span className="funds-content">
                <span className="funds-title">Funds</span>
                <span className="funds-sub">Manage</span>
              </span>
              <span className="arrow"><ChevronDownIcon open={isFundsOpen} /></span>
            </FundsButton>
            <GlassDropdown isOpen={isFundsOpen}>
              <MenuHeader>Funds Management</MenuHeader>
              {fundOptions.map((option, index) => (
                <FundsOption key={index} onClick={() => handleFundAction(option.action)}>
                  <span className="icon">{option.icon}</span>
                  <span className="info">
                    <span className="name">{option.name}</span>
                    <span className="desc">{option.desc}</span>
                  </span>
                </FundsOption>
              ))}
            </GlassDropdown>
          </DropdownContainer>

          <DropdownContainer ref={dropdownRef}>
            <AccountBadge onClick={toggleDropdown} isDemo={isDemo}>
              <span className="flag">{getCurrencyFlag()}</span>
              <span className="balance">{getFormattedBalance(currentAccount)}</span>
              <span className="account-type">{currentAccount.label}</span>
              <span className="currency-tag">{selectedCurrency}</span>
              <span className="chevron"><ChevronDownIcon open={isDropdownOpen} /></span>
            </AccountBadge>
            <GlassDropdown isOpen={isDropdownOpen}>
              <MenuHeader>Account</MenuHeader>
              <ThemeOptionItem onClick={() => { setAccountType('real'); setIsDropdownOpen(false); }} className={accountType === 'real' ? 'active' : ''}>
                <span style={{ fontSize: '16px' }}>🏦</span>
                <span className="label">Real Account</span>
                <span style={{ fontSize: '11px', opacity: 0.3, color: '#22C55E' }}>{getFormattedBalance(accountData.real)}</span>
              </ThemeOptionItem>
              <ThemeOptionItem onClick={() => { setAccountType('demo'); setIsDropdownOpen(false); }} className={accountType === 'demo' ? 'active' : ''}>
                <span style={{ fontSize: '16px' }}>🎯</span>
                <span className="label">Demo Practice</span>
                <span style={{ fontSize: '11px', opacity: 0.3, color: '#60a5fa' }}>{getFormattedBalance(accountData.demo)}</span>
              </ThemeOptionItem>
              <div style={{ padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.02)', marginTop: '4px' }}>
                <MenuHeader style={{ marginBottom: '4px' }}>Currency</MenuHeader>
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
                    <div style={{ padding: '10px', textAlign: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '11px' }}>No currencies found</div>
                  )}
                </CurrencyList>
              </div>
            </GlassDropdown>
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
              <div className="group">
                <div className="icon">
                  {fundModalAction === 'overview' && <OverviewIcon />}
                  {fundModalAction === 'deposit' && <DepositIcon />}
                  {fundModalAction === 'withdraw' && <WithdrawIcon />}
                  {fundModalAction === 'history' && <HistoryIcon />}
                </div>
                <div>
                  <div className="title">
                    {fundModalAction === 'overview' && 'Funds Overview'}
                    {fundModalAction === 'deposit' && 'Deposit via M‑Pesa'}
                    {fundModalAction === 'withdraw' && 'Withdraw to M‑Pesa'}
                    {fundModalAction === 'history' && 'Transaction History'}
                  </div>
                  {fundModalAction === 'deposit' && <div className="sub">Add funds using M‑Pesa</div>}
                  {fundModalAction === 'withdraw' && <div className="sub">Withdraw to your M‑Pesa wallet</div>}
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