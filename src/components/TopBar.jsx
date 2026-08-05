import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// KEYFRAMES FOR LIVE DOT
// ============================================
const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

// ============================================
// STYLED COMPONENTS - UPDATED WITH THEME
// ============================================

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  background: ${props => props.theme?.colors?.surface || props.theme?.colors?.backgroundSecondary || '#0a0a0c'};
  border-bottom: 2px solid ${props => props.theme?.colors?.border || '#1f1f24'};
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 64px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  font-weight: 700;

  @media (max-width: 1024px) {
    padding: 10px 20px;
    flex-wrap: wrap;
    min-height: auto;
    gap: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px 16px;
    min-height: auto;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    gap: 4px;
  }
`;

// ===== LEFT SIDE - SIDEBAR TOGGLE + BRAND =====
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  font-weight: 700;

  @media (max-width: 480px) {
    gap: 10px;
    width: 100%;
    justify-content: flex-start;
  }
`;

// ===== SIDEBAR TOGGLE ICON =====
const SidebarToggle = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: ${props => props.theme?.colors?.surfaceHover || props.theme?.colors?.tabActive || '#141417'};
  border: 2px solid ${props => props.theme?.colors?.border || '#1f1f24'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceActive || props.theme?.colors?.accentActive || '#1f1f24'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    transform: scale(1.05);
    box-shadow: 0 0 30px ${props => (props.theme?.colors?.accent || '#3b82f6') + '40'};
  }

  &:active {
    transform: scale(0.92);
  }

  .line {
    display: block;
    width: 18px;
    height: 2px;
    background: ${props => props.isOpen ? 
      `linear-gradient(90deg, ${props.theme?.colors?.accent || '#3b82f6'}, ${props.theme?.colors?.accent || '#3b82f6'}dd)` : 
      `linear-gradient(90deg, ${props.theme?.colors?.textMuted || '#52525b'}, ${props.theme?.colors?.textSecondary || '#a1a1aa'})`
    };
    border-radius: 2px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;

    &:nth-child(1) {
      width: ${props => props.isOpen ? '20px' : '18px'};
      transform: ${props => props.isOpen ? 'rotate(45deg) translate(3px, 3px)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      width: ${props => props.isOpen ? '0px' : '14px'};
      opacity: ${props => props.isOpen ? '0' : '1'};
      transform: ${props => props.isOpen ? 'scaleX(0)' : 'scaleX(1)'};
      transform-origin: center;
    }

    &:nth-child(3) {
      width: ${props => props.isOpen ? '20px' : '10px'};
      transform: ${props => props.isOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'rotate(0)'};
    }
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    gap: 4px;
    .line {
      width: 16px;
      height: 2px;
      &:nth-child(1) {
        width: ${props => props.isOpen ? '18px' : '16px'};
      }
      &:nth-child(3) {
        width: ${props => props.isOpen ? '18px' : '8px'};
      }
    }
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    gap: 3px;
    .line {
      width: 14px;
      height: 2px;
      &:nth-child(1) {
        width: ${props => props.isOpen ? '16px' : '14px'};
      }
      &:nth-child(3) {
        width: ${props => props.isOpen ? '16px' : '6px'};
      }
    }
  }
`;

// ===== BRAND =====
const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;

  .icon {
    font-size: 1.6rem;
    animation: ${float} 3s ease-in-out infinite;
  }

  .brand-text {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 700;
  }

  .voltix {
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#3b82f6'}, ${(props.theme?.colors?.accent || '#3b82f6')}dd)`};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
  }

  .deriv {
    color: #FF0000 !important;
    font-style: italic;
    font-weight: 700;
    letter-spacing: 0.5px;
    -webkit-text-fill-color: #FF0000 !important;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.accent || '#3b82f6'};
    position: relative;
    margin-left: 4px;
    flex-shrink: 0;
    border: 1px solid ${props => props.theme?.colors?.accent || '#3b82f6'};

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: ${props => props.theme?.colors?.accent || '#3b82f6'};
      animation: ${pulseRing} 2s ease-out infinite;
    }

    &::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      background: ${props => props.theme?.colors?.accent || '#3b82f6'};
      animation: ${pulseRing} 2s ease-out infinite 0.5s;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    .live-dot {
      width: 6px;
      height: 6px;
      &::before { inset: -3px; }
      &::after { inset: -6px; }
    }
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    .live-dot {
      width: 5px;
      height: 5px;
      &::before { inset: -2px; }
      &::after { inset: -5px; }
    }
  }
`;

// ===== RIGHT SIDE - ACCOUNT ACTIONS =====
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  font-weight: 700;

  @media (max-width: 1024px) {
    gap: 10px;
    justify-content: center;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    justify-content: center;
  }
`;

// ===== DROPDOWN CONTAINER =====
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// ===== TRANSLUCENT SOLID DROPDOWN MENU =====
const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  max-width: 90vw;
  background: ${props => props.theme?.colors?.surfaceGlass || 'rgba(10, 10, 12, 0.92)'};
  backdrop-filter: blur(${props => props.theme?.colors?.glassBlur || '20px'}) saturate(180%);
  -webkit-backdrop-filter: blur(${props => props.theme?.colors?.glassBlur || '20px'}) saturate(180%);
  border: 1px solid ${props => props.theme?.colors?.glassBorder || 'rgba(255, 255, 255, 0.12)'};
  border-radius: 14px;
  padding: 8px 0;
  box-shadow: ${props => props.theme?.colors?.shadow || '0 20px 40px -15px rgba(0, 0, 0, 0.9)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 200;
  overflow: hidden;
  font-weight: 700;

  @media (max-width: 480px) {
    min-width: 220px;
    right: -5px;
    max-width: 85vw;
  }

  @media (max-width: 380px) {
    min-width: 180px;
    right: -10px;
    max-width: 80vw;
  }
`;

// ===== THEME TOGGLE BUTTON =====
const ThemeToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: ${props => props.theme?.colors?.surface || '#0a0a0c'};
  border: 2px solid ${props => props.theme?.colors?.border || '#1f1f24'};
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#141417'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 20px ${props => (props.theme?.colors?.accent || '#3b82f6') + '30'};
  }

  .theme-icon {
    font-size: 15px;
    display: flex;
    align-items: center;
  }

  .theme-label {
    font-size: 12px;
    white-space: nowrap;

    @media (max-width: 600px) {
      display: none;
    }
  }

  .chevron {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#52525b'};
    transition: transform 0.2s ease;

    &.open {
      transform: rotate(180deg);
    }
  }

  @media (max-width: 768px) {
    padding: 4px 10px;
  }
`;

const ThemeHeader = styled.div`
  padding: 8px 16px 6px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${props => props.theme?.colors?.textMuted || '#52525b'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  margin-bottom: 4px;
`;

const ThemeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textSecondary || '#a1a1aa'};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  &.active {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};

    .check {
      display: block;
    }
  }

  .swatch {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.2)'};
    flex-shrink: 0;
  }

  .label {
    flex: 1;
    white-space: nowrap;
  }

  .check {
    display: none;
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    font-weight: 800;
  }
`;

// ===== ACCOUNT BADGE =====
const AccountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px 6px 12px;
  background: ${props => props.theme?.colors?.surface || '#0a0a0c'};
  border: 2px solid ${props => props.theme?.colors?.border || '#1f1f24'};
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#141417'};
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    box-shadow: 0 0 20px ${props => (props.theme?.colors?.accent || '#3b82f6') + '30'};
  }

  .flag {
    font-size: 18px;
  }

  .balance {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .currency-toggle {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textSecondary || '#a1a1aa'};
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    padding: 2px 6px;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.2s ease;
    margin-left: 2px;

    &:hover {
      background: ${props => (props.theme?.colors?.accent || '#3b82f6') + '40'};
      color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    }
  }

  .chevron {
    font-size: 12px;
    color: ${props => props.theme?.colors?.textMuted || '#52525b'};
    transition: transform 0.2s ease;
    margin-left: 4px;

    &.open {
      transform: rotate(180deg);
    }
  }

  @media (max-width: 768px) {
    padding: 4px 12px 4px 8px;
    .balance { font-size: 12px; }
    .flag { font-size: 16px; }
    .chevron { font-size: 10px; }
    .currency-toggle {
      font-size: 9px;
      padding: 1px 4px;
    }
  }

  @media (max-width: 480px) {
    padding: 3px 8px 3px 6px;
    .balance { font-size: 11px; }
    .flag { font-size: 14px; }
    gap: 4px;
    .currency-toggle {
      font-size: 8px;
      padding: 1px 3px;
    }
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textSecondary || '#a1a1aa'};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  &.active {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};

    .check { display: block; }
  }

  .flag { font-size: 16px; flex-shrink: 0; }
  .label { flex: 1; white-space: nowrap; font-weight: 700; }
  .balance-small {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#52525b'};
    white-space: nowrap;
  }

  .check {
    display: none;
    color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    flex-shrink: 0;
    font-weight: 700;
  }
`;

const CurrencyToggle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid ${props => props.theme?.colors?.border || '#1f1f24'};
  margin-top: 4px;

  .label {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#52525b'};
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  .toggle-group {
    display: flex;
    gap: 4px;
    background: ${props => props.theme?.colors?.surfaceHover || '#141417'};
    border-radius: 20px;
    padding: 3px;
    width: 100%;
  }

  .toggle-option {
    flex: 1;
    padding: 6px 8px;
    border-radius: 16px;
    border: 2px solid transparent;
    background: transparent;
    color: ${props => props.theme?.colors?.textMuted || '#52525b'};
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    white-space: nowrap;

    &:hover {
      color: ${props => props.theme?.colors?.textSecondary || '#a1a1aa'};
    }

    &.active {
      background: ${props => props.theme?.colors?.surfaceActive || '#1f1f24'};
      color: ${props => props.theme?.colors?.accent || '#3b82f6'};
      border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
      box-shadow: 0 0 20px ${props => (props.theme?.colors?.accent || '#3b82f6') + '30'};
    }
  }
`;

// ===== PROFESSIONAL FUNDS BUTTON =====
const ProfessionalFundsButton = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px 8px 20px;
  border-radius: 8px;
  border: 2px solid ${props => props.theme?.colors?.border || '#1f1f24'};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  background: ${props => props.theme?.colors?.bg || '#000000'};
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  letter-spacing: 0.3px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => `linear-gradient(135deg, ${(props.theme?.colors?.accent || '#3b82f6')}25, transparent)`};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};

    &::before { opacity: 1; }
    .arrow-right { transform: translateX(4px); }
  }

  .funds-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: ${props => props.theme?.colors?.surfaceHover || '#141417'};
    font-size: 16px;
    border: 2px solid ${props => props.theme?.colors?.border || '#1f1f24'};
  }

  .funds-content {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
  }

  .funds-title {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .funds-subtitle {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#52525b'};
    font-weight: 700;
  }

  .arrow-right {
    margin-left: auto;
    font-size: 14px;
    color: ${props => props.theme?.colors?.textMuted || '#52525b'};
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    padding: 6px 16px 6px 14px;
    gap: 8px;
    .funds-icon { width: 26px; height: 26px; font-size: 13px; }
    .funds-title { font-size: 11px; }
    .funds-subtitle { font-size: 9px; }
  }

  @media (max-width: 480px) {
    padding: 4px 10px 4px 8px;
    gap: 5px;
    .funds-icon { width: 20px; height: 20px; font-size: 10px; }
    .funds-title { font-size: 9px; }
    .funds-subtitle { display: none; }
  }
`;

// ===== PREMIUM EXIT BUTTON =====
const PremiumExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-radius: 8px;
  border: 2px solid ${props => props.theme?.colors?.border || '#1f1f24'};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.theme?.colors?.bg || '#000000'};
  color: ${props => props.theme?.colors?.textSecondary || '#a1a1aa'};
  position: relative;
  flex-shrink: 0;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    transform: translateX(-2px);

    .exit-arrow-icon {
      transform: translateX(4px);
      color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    }
  }

  .exit-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 2px solid ${props => props.theme?.colors?.border || '#1f1f24'};
    background: ${props => props.theme?.colors?.surface || '#0a0a0c'};
  }

  .exit-icon {
    width: 16px;
    height: 16px;
    color: ${props => props.theme?.colors?.textMuted || '#52525b'};
  }

  .exit-text {
    font-weight: 700;
    white-space: nowrap;
  }

  .exit-arrow-icon {
    font-size: 14px;
    transition: all 0.4s ease;
    color: ${props => props.theme?.colors?.textMuted || '#52525b'};
    margin-left: 2px;
  }

  @media (max-width: 768px) {
    padding: 5px 14px;
    gap: 6px;
    font-size: 11px;
    .exit-icon-container { width: 24px; height: 24px; }
  }

  @media (max-width: 480px) {
    padding: 4px 10px;
    gap: 4px;
    font-size: 10px;
    .exit-icon-container { width: 22px; height: 22px; }
    .exit-text { font-size: 9px; }
  }
`;

// ===== ICONS =====
const PowerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
    <path d="M12 2v8" />
    <path d="M4.93 10.93a8 8 0 1 0 14.14 0" />
  </svg>
);

const PaletteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879 1.011.159 1.562-.767 1.562-1.379 0-.549-.016-1.169-.025-1.956-2.583.56-3.13-1.245-3.13-1.245-.455-1.157-1.11-1.465-1.11-1.465-.843-.576.064-.564.064-.564.932.065 1.423.957 1.423.957.828 1.419 2.17.009 2.7.765.083-.6.323-1.01.589-1.242-2.345-.266-4.811-1.173-4.811-5.22 0-1.153.411-2.095 1.086-2.833-.109-.267-.471-1.341.103-2.793 0 0 .886-.283 2.903 1.082a10.12 10.12 0 0 1 2.642-.356c.896.004 1.798.121 2.643.356 2.015-1.365 2.901-1.082 2.901-1.082.576 1.452.214 2.526.105 2.793.676.738 1.085 1.68 1.085 2.833 0 4.058-2.47 4.951-4.823 5.212.333.287.63.854.63 1.722 0 1.243-.011 2.247-.011 2.553 0 .618.544 1.547 1.571 1.376C18.347 21.124 22 16.989 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// Preset list to map colors dynamically
const THEME_OPTIONS = [
  { key: 'light', name: 'Pure White', color: '#ffffff' },
  { key: 'minimalWhite', name: 'Minimal White', color: '#f9fafb' },
  { key: 'dark', name: 'Solid Dark', color: '#000000' },
  { key: 'midnight', name: 'Midnight Indigo', color: '#070a12' },
  { key: 'ocean', name: 'Deep Ocean', color: '#020d14' },
  { key: 'cosmic', name: 'Cosmic Violet', color: '#07040d' },
  { key: 'forest', name: 'Emerald Forest', color: '#040d0a' },
  { key: 'sunset', name: 'Warm Sunset', color: '#0f0705' }
];

// ============================================
// MAIN COMPONENT
// ============================================

const TopPanel = ({ isSidebarOpen, onSidebarToggle, currentTheme = 'dark', onThemeChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [accountType, setAccountType] = useState('real');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  const dropdownRef = useRef(null);
  const themeRef = useRef(null);
  const navigate = useNavigate();

  const accountData = {
    real: { 
      balance: 7110.00, 
      currency: 'USD',
      flag: '🇺🇸',
      kshBalance: 7110.00 * 150.50,
      eurBalance: 7110.00 * 0.92
    },
    demo: { 
      balance: 10000.00, 
      currency: 'USD',
      flag: '🎯',
      kshBalance: 10000.00 * 150.50,
      eurBalance: 10000.00 * 0.92
    }
  };

  const currentAccount = accountType === 'real' ? accountData.real : accountData.demo;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsThemeOpen(false);
  };

  const toggleThemeDropdown = () => {
    setIsThemeOpen(!isThemeOpen);
    setIsDropdownOpen(false);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const getCurrencyFlag = () => {
    if (accountType === 'demo') return '🎯';
    switch(selectedCurrency) {
      case 'USD': return '🇺🇸';
      case 'KSh': return '🇰🇪';
      case 'EUR': return '🇪🇺';
      default: return '🇺🇸';
    }
  };

  const formatNumber = (number) => {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getFormattedBalance = (account) => {
    let amount = account.balance;
    let symbol = '$';

    switch(selectedCurrency) {
      case 'USD':
        amount = account.balance;
        symbol = '$';
        break;
      case 'KSh':
        amount = account.kshBalance;
        symbol = 'KSh';
        break;
      case 'EUR':
        amount = account.eurBalance;
        symbol = '€';
        break;
      default:
        amount = account.balance;
        symbol = '$';
    }

    return `${symbol} ${formatNumber(amount)}`;
  };

  const handleAccountSwitch = (type) => {
    setAccountType(type);
    setIsDropdownOpen(false);
  };

  const handleSelectTheme = (themeKey) => {
    if (onThemeChange) {
      onThemeChange(themeKey);
    }
    setIsThemeOpen(false);
  };

  const handleExit = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find active theme object label
  const activeThemeObj = THEME_OPTIONS.find(t => t.key === currentTheme) || THEME_OPTIONS[2];

  return (
    <TopBar>
      <LeftSection>
        <SidebarToggle 
          isOpen={isSidebarOpen} 
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
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
        {/* FUNDS BUTTON */}
        <ProfessionalFundsButton 
          href="/payment-dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="funds-icon">💰</span>
          <span className="funds-content">
            <span className="funds-title">Funds</span>
            <span className="funds-subtitle">Secure transactions</span>
          </span>
          <span className="arrow-right">→</span>
        </ProfessionalFundsButton>

        {/* THEME CONTROL BUTTON */}
        <DropdownContainer ref={themeRef}>
          <ThemeToggleButton onClick={toggleThemeDropdown}>
            <span className="theme-icon"><PaletteIcon /></span>
            <span className="theme-label">{activeThemeObj.name}</span>
            <span className={`chevron ${isThemeOpen ? 'open' : ''}`}>▾</span>
          </ThemeToggleButton>

          <DropdownMenu isOpen={isThemeOpen}>
            <ThemeHeader>Select Application Theme</ThemeHeader>
            {THEME_OPTIONS.map((t) => (
              <ThemeItem
                key={t.key}
                onClick={() => handleSelectTheme(t.key)}
                className={currentTheme === t.key ? 'active' : ''}
              >
                <span className="swatch" style={{ background: t.color }} />
                <span className="label">{t.name}</span>
                <span className="check">✓</span>
              </ThemeItem>
            ))}
          </DropdownMenu>
        </DropdownContainer>

        {/* ACCOUNT BALANCE */}
        <DropdownContainer ref={dropdownRef}>
          <AccountBadge onClick={toggleDropdown}>
            <span className="flag">{getCurrencyFlag()}</span>
            <span className="balance">{getFormattedBalance(currentAccount)}</span>
            <span className="currency-toggle">
              {selectedCurrency}
            </span>
            <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>▾</span>
          </AccountBadge>

          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem 
              onClick={() => handleAccountSwitch('real')}
              className={accountType === 'real' ? 'active' : ''}
            >
              <span className="flag">🇺🇸</span>
              <span className="label">Real Account</span>
              <span className="balance-small">
                {getFormattedBalance(accountData.real)}
              </span>
              <span className="check">✓</span>
            </DropdownItem>

            <DropdownItem 
              onClick={() => handleAccountSwitch('demo')}
              className={accountType === 'demo' ? 'active' : ''}
            >
              <span className="flag">🎯</span>
              <span className="label">Demo Account</span>
              <span className="balance-small">
                {getFormattedBalance(accountData.demo)}
              </span>
              <span className="check">✓</span>
            </DropdownItem>

            <CurrencyToggle>
              <span className="label">Show balance in:</span>
              <div className="toggle-group">
                <button 
                  className={`toggle-option ${selectedCurrency === 'USD' ? 'active' : ''}`}
                  onClick={() => handleCurrencyChange('USD')}
                >
                  USD
                </button>
                <button 
                  className={`toggle-option ${selectedCurrency === 'EUR' ? 'active' : ''}`}
                  onClick={() => handleCurrencyChange('EUR')}
                >
                  EUR
                </button>
                <button 
                  className={`toggle-option ${selectedCurrency === 'KSh' ? 'active' : ''}`}
                  onClick={() => handleCurrencyChange('KSh')}
                >
                  KSh
                </button>
              </div>
            </CurrencyToggle>
          </DropdownMenu>
        </DropdownContainer>

        {/* EXIT BUTTON */}
        <PremiumExitButton onClick={handleExit}>
          <span className="exit-icon-container">
            <span className="exit-icon"><PowerIcon /></span>
          </span>
          <span className="exit-text">Exit</span>
          <span className="exit-arrow-icon">→</span>
        </PremiumExitButton>
      </RightSection>
    </TopBar>
  );
};

export default TopPanel;