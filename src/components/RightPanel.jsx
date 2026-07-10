// src/components/RightPanel.jsx
import React, { useState, useMemo, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// ALL VOLATILITY MARKETS (Deriv Official)
// ============================================
const VOLATILITY_MARKETS = [
  { symbol: 'R_100_1S', name: 'Volatility 100 (1s) Index', display: '100 (1s)', color: '#a855f7', isOneSec: true },
  { symbol: 'R_10_1S', name: 'Volatility 10 (1s) Index', display: '10 (1s)', color: '#2962ff', isOneSec: true },
  { symbol: 'R_25_1S', name: 'Volatility 25 (1s) Index', display: '25 (1s)', color: '#3b82f6', isOneSec: true },
  { symbol: 'R_50_1S', name: 'Volatility 50 (1s) Index', display: '50 (1s)', color: '#6366f1', isOneSec: true },
  { symbol: 'R_75_1S', name: 'Volatility 75 (1s) Index', display: '75 (1s)', color: '#8b5cf6', isOneSec: true },
  { symbol: 'R_10', name: 'Volatility 10 Index', display: '10', color: '#10b981', isOneSec: false },
  { symbol: 'R_25', name: 'Volatility 25 Index', display: '25', color: '#059669', isOneSec: false },
  { symbol: 'R_50', name: 'Volatility 50 Index', display: '50', color: '#047857', isOneSec: false },
  { symbol: 'R_75', name: 'Volatility 75 Index', display: '75', color: '#065f46', isOneSec: false },
  { symbol: 'R_100', name: 'Volatility 100 Index', display: '100', color: '#064e3b', isOneSec: false },
];

// ============================================
// ANIMATIONS - UPDATED WITH THEME
// ============================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${props => props.theme.colors.accent + '25'}; }
  50% { box-shadow: 0 0 40px ${props => props.theme.colors.accent + '40'}; }
`;

const floatPulse = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

// ============================================
// STYLED COMPONENTS - UPDATED WITH THEME
// ============================================

const PanelContainer = styled.div`
  width: 290px;
  min-width: 290px;
  background: ${props => props.theme.colors.background};
  border-left: 1px solid ${props => props.theme.colors.border};
  padding: 14px 14px 10px 14px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
  overflow-y: auto;
  gap: 8px;
  position: relative;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    width: 220px;
    min-width: 220px;
    padding: 10px 10px 6px 10px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: 100%;
    padding: 6px 20px 4px 20px !important;
    border-left: none;
    background: ${props => props.theme.colors.background};
    gap: 4px;
    box-sizing: border-box;
  }

  @media (max-width: 480px) {
    padding: 4px 16px 2px 16px !important;
    gap: 2px;
  }
`;

// ============================================
// PHONE TWO-COLUMN WRAPPER
// ============================================

const PhoneTwoColumnWrapper = styled.div`
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px !important;
    margin-bottom: 2px;
    width: 100%;
    box-sizing: border-box;
  }

  @media (max-width: 480px) {
    gap: 12px !important;
  }

  @media (min-width: 769px) {
    display: block;
  }
`;

// ============================================
// 1. MARKET SELECTOR - ONLY ON PHONE
// ============================================

const MarketSelectorWrapper = styled.div`
  position: relative;
  animation: ${fadeIn} 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MarketSelectorButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.background + '60'};
    border-color: ${props => props.theme.colors.accent + '50'};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .market-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.color || props.theme.colors.accent};
    flex-shrink: 0;
  }

  .market-name {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .arrow {
    font-size: 10px;
    color: ${props => props.theme.colors.textMuted};
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    flex-shrink: 0;
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    .market-name { font-size: 10px; }
    .market-dot { width: 5px; height: 5px; }
    .arrow { font-size: 8px; }
  }
`;

const MarketDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.backgroundSecondary + 'f0'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 12px 40px ${props => props.theme.colors.shadow};
  backdrop-filter: blur(20px);
  max-height: 260px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }
`;

const MarketOption = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid ${props => props.theme.colors.border + '40'};

  &:hover {
    background: ${props => props.theme.colors.background + '40'};
    color: ${props => props.theme.colors.text};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.color || props.theme.colors.accent};
    flex-shrink: 0;
  }

  .option-name {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .check {
    color: ${props => props.theme.colors.accent};
    font-size: 14px;
    opacity: ${props => props.active ? 1 : 0};
    flex-shrink: 0;
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    .option-name { font-size: 10px; }
    .dot { width: 5px; height: 5px; }
    .check { font-size: 11px; }
  }
`;

// ============================================
// 2. TRADE TYPE SELECTOR
// ============================================

const TradeTypeWrapper = styled.div`
  position: relative;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const TradeTypeButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${props => props.theme.colors.background + '60'};
  border: 1px solid ${props => props.isOpen ? props.theme.colors.accent + '90' : props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &:hover {
    border-color: ${props => props.theme.colors.accent + '90'};
    background: ${props => props.theme.colors.accentActive};
  }

  .left { display: flex; align-items: center; gap: 10px; }
  .label { font-size: 14px; font-weight: 500; color: ${props => props.theme.colors.text}; letter-spacing: 0.2px; }
  .arrow {
    font-size: 12px; color: ${props => props.theme.colors.textMuted};
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
  .badge {
    font-size: 7px; text-transform: uppercase; padding: 2px 6px;
    border-radius: 8px; background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.accent}; font-weight: 600; letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    .label { font-size: 12px; }
    .badge { font-size: 6px; padding: 1px 4px; }
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    .label { font-size: 10px; }
    gap: 2px;
    .arrow { font-size: 9px; }
    .badge { font-size: 5px; padding: 1px 3px; }
  }
`;

const Dropdown = styled.div`
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: ${props => props.theme.colors.backgroundSecondary + 'f0'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px; overflow: hidden; z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 12px 40px ${props => props.theme.colors.shadow};
  backdrop-filter: blur(20px);

  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;

const DropdownOption = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  font-size: 13px;
  transition: all 0.15s ease;

  &:hover { background: ${props => props.theme.colors.background + '40'}; color: ${props => props.theme.colors.text}; }
  .check { color: ${props => props.theme.colors.accent}; font-size: 14px; opacity: ${props => props.active ? 1 : 0}; }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 4px 6px;
    font-size: 10px;
    .check { font-size: 11px; }
  }
`;

// ============================================
// 3. TRADE MODE TOGGLE - UPDATED WITH THEME
// ============================================

const TradeModeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 768px) {
    gap: 3px;
  }

  @media (max-width: 480px) {
    gap: 2px;
  }
`;

const TradeModeLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 8px;
  text-transform: uppercase;
  color: ${props => props.theme.colors.textMuted};
  letter-spacing: 0.8px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 7px;
  }

  @media (max-width: 480px) {
    font-size: 6px;
  }
`;

const TradeModeButtons = styled.div`
  display: flex;
  gap: 4px;
  background: ${props => props.theme.colors.background + '40'};
  border-radius: 10px;
  padding: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;

  @media (max-width: 768px) {
    padding: 3px;
    gap: 3px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 2px;
    gap: 2px;
    border-radius: 6px;
  }
`;

const TradeModeButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)` : 'transparent'};
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  letter-spacing: 0.3px;

  ${props => props.active && `
    box-shadow: 0 4px 16px ${props.theme.colors.accent + '50'};
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      pointer-events: none;
    }
  `}

  &:hover {
    color: ${props => props.active ? props.theme.colors.text : props.theme.colors.text};
    background: ${props => props.active ? `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)` : props.theme.colors.background + '40'};
  }

  &:active {
    transform: scale(0.97);
  }

  .mode-label {
    font-size: 11px;
    font-weight: 600;
  }

  .mode-shortcut {
    font-size: 7px;
    opacity: 0.4;
    font-weight: 400;
    letter-spacing: 0.5px;
    background: rgba(255,255,255,0.06);
    padding: 1px 6px;
    border-radius: 4px;
    display: ${props => props.active ? 'inline-block' : 'none'};
  }

  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: 10px;
    border-radius: 6px;
    .mode-label { font-size: 10px; }
    .mode-shortcut { font-size: 6px; padding: 0px 4px; }
  }

  @media (max-width: 480px) {
    padding: 4px 4px;
    font-size: 8px;
    border-radius: 4px;
    gap: 3px;
    .mode-label { font-size: 8px; }
    .mode-shortcut { display: none; }
  }
`;

// ============================================
// 4. BOT SELECTION - UPDATED WITH THEME
// ============================================

const BotGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    gap: 2px;
  }
`;

const BotCard = styled.div`
  padding: 8px 6px;
  background: ${props => props.selected ? props.theme.colors.accentActive : props.theme.colors.background + '40'};
  border: 1px solid ${props => props.selected ? props.theme.colors.accent + '80' : props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  backdrop-filter: blur(10px);

  &:hover {
    border-color: ${props => props.theme.colors.accent + '60'};
    transform: translateY(-1px);
    box-shadow: 0 4px 16px ${props => props.theme.colors.shadow};
  }

  ${props => props.selected && `
    border-color: ${props.theme.colors.accent};
    box-shadow: 0 0 20px ${props.theme.colors.accent + '25'};
    animation: ${pulseGlow} 2s ease-in-out infinite;
  `}

  .bot-name { font-size: 10px; font-weight: 600; color: ${props => props.theme.colors.text}; }
  .bot-type { font-size: 7px; text-transform: uppercase; color: ${props => props.theme.colors.textMuted}; margin-top: 1px; letter-spacing: 0.3px; }
  .bot-badge {
    font-size: 6px; text-transform: uppercase; padding: 1px 5px;
    border-radius: 4px; background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.accent}; display: inline-block; margin-top: 1px;
  }

  @media (max-width: 768px) {
    padding: 6px 4px;
    .bot-name { font-size: 9px; }
    .bot-type { font-size: 6px; }
    .bot-badge { font-size: 5px; padding: 1px 3px; }
  }

  @media (max-width: 480px) {
    padding: 3px 2px;
    .bot-name { font-size: 7px; }
    .bot-type { font-size: 5px; }
    .bot-badge { font-size: 4px; padding: 1px 2px; }
  }
`;

const BotHeader = styled.div`
  text-align: center;
  padding: 2px 0 4px 0;
  animation: ${fadeIn} 0.4s ease;

  .title { font-size: 12px; font-weight: 500; color: ${props => props.theme.colors.text}; }
  .subtitle {
    font-size: 10px; color: ${props => props.theme.colors.textMuted}; margin-top: 1px;
    .highlight { color: ${props => props.theme.colors.accent}; font-weight: 600; }
  }

  @media (max-width: 768px) {
    padding: 0 0 2px 0;
    .title { font-size: 10px; }
    .subtitle { font-size: 8px; }
  }

  @media (max-width: 480px) {
    .title { font-size: 8px; }
    .subtitle { font-size: 7px; }
  }
`;

// ============================================
// 5. INPUT FIELDS - UPDATED WITH THEME
// ============================================

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 480px) {
    gap: 1px;
  }
`;

const InputLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 8px;
  text-transform: uppercase;
  color: ${props => props.theme.colors.textMuted};
  letter-spacing: 0.6px;
  font-weight: 700;

  .suffix { 
    font-size: 7px; 
    color: ${props => props.theme.colors.textMuted + '80'}; 
    text-transform: none; 
    letter-spacing: 0; 
    font-weight: 400; 
  }
  .optional {
    font-size: 6px; 
    color: ${props => props.theme.colors.textMuted + '80'}; 
    text-transform: none;
    background: ${props => props.theme.colors.background + '40'}; 
    padding: 0 5px; 
    border-radius: 3px;
    border: 1px solid ${props => props.theme.colors.border};
    font-weight: 400;
  }

  @media (max-width: 768px) {
    font-size: 7px;
    .suffix { font-size: 6px; }
    .optional { font-size: 5px; padding: 0 3px; }
  }

  @media (max-width: 480px) {
    font-size: 6px;
    letter-spacing: 0.4px;
    .suffix { font-size: 5px; }
    .optional { font-size: 4px; padding: 0 2px; }
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  transition: all 0.2s ease;
  overflow: hidden;

  &:focus-within { 
    border-color: ${props => props.theme.colors.accent + '90'}; 
    box-shadow: 0 0 0 3px ${props => props.theme.colors.accent + '15'}; 
  }
  
  .prefix {
    padding: 4px 6px;
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme.colors.textMuted};
    background: ${props => props.theme.colors.background + '40'};
    border-right: 1px solid ${props => props.theme.colors.border};
  }

  @media (max-width: 768px) {
    border-radius: 4px;
    .prefix { padding: 3px 4px; font-size: 10px; }
  }

  @media (max-width: 480px) {
    border-radius: 3px;
    .prefix { padding: 2px 3px; font-size: 8px; }
  }
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 4px 6px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 12px;
  font-weight: 500;
  outline: none;
  width: 100%;
  min-width: 0;

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] { -moz-appearance: textfield; }
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted + '60'};
    font-weight: 400;
    font-size: 11px;
  }

  @media (max-width: 768px) {
    padding: 3px 4px;
    font-size: 11px;
    &::placeholder { font-size: 10px; }
  }

  @media (max-width: 480px) {
    padding: 2px 3px;
    font-size: 9px;
    &::placeholder { font-size: 8px; }
  }
`;

// ===== TOGGLE COMPONENTS (Compact) - UPDATED WITH THEME =====
const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  padding: 3px 6px;
  height: 28px;
  gap: 4px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 2px 4px;
    height: 24px;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    padding: 2px 3px;
    height: 20px;
    border-radius: 3px;
    gap: 2px;
  }
`;

const ToggleLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 7px;
  text-transform: uppercase;
  color: ${props => props.theme.colors.textMuted};
  letter-spacing: 0.5px;
  font-weight: 700;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 6px;
    gap: 2px;
  }

  @media (max-width: 480px) {
    font-size: 5px;
    gap: 1px;
  }
`;

const ToggleTrack = styled.div`
  width: 28px;
  height: 16px;
  background: ${props => props.active ? `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)` : props.theme.colors.scrollbar};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;

  &:hover { box-shadow: 0 0 12px ${props => props.theme.colors.accent + '25'}; }
  
  .thumb {
    width: 12px;
    height: 12px;
    background: ${props => props.theme.colors.text};
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '14px' : '2px'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px ${props => props.theme.colors.shadow};
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 14px;
    .thumb {
      width: 10px;
      height: 10px;
      left: ${props => props.active ? '12px' : '2px'};
      top: 2px;
    }
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 12px;
    border-radius: 6px;
    .thumb {
      width: 8px;
      height: 8px;
      left: ${props => props.active ? '10px' : '2px'};
      top: 2px;
    }
  }
`;

const ToggleStatus = styled.span`
  font-size: 7px;
  color: ${props => props.active ? '#22c55e' : props.theme.colors.textMuted + '80'};
  font-weight: 600;
  min-width: 18px;

  @media (max-width: 768px) {
    font-size: 6px;
    min-width: 14px;
  }

  @media (max-width: 480px) {
    font-size: 5px;
    min-width: 12px;
  }
`;

// ===== DROPDOWN SELECT (Compact) - UPDATED WITH THEME =====
const DropdownSelect = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DropdownSelectButton = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px 2px 8px;
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 10px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  height: 22px;
  min-width: 32px;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.background + '60'};
    border-color: ${props => props.theme.colors.accent + '50'};
  }

  .dropdown-arrow {
    font-size: 7px;
    color: ${props => props.theme.colors.textMuted};
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }

  @media (max-width: 768px) {
    font-size: 9px;
    height: 18px;
    padding: 1px 4px 1px 6px;
    min-width: 28px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    height: 16px;
    padding: 1px 3px 1px 4px;
    min-width: 24px;
    gap: 2px;
  }
`;

const DropdownSelectMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: ${props => props.theme.colors.backgroundSecondary + 'f0'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.15s ease;
  box-shadow: 0 8px 30px ${props => props.theme.colors.shadow};
  backdrop-filter: blur(20px);
  max-height: 150px;
  overflow-y: auto;
  min-width: 44px;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    max-height: 120px;
    min-width: 36px;
  }
`;

const DropdownSelectItem = styled.div`
  padding: 5px 10px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  transition: all 0.15s ease;
  text-align: center;

  &:hover {
    background: ${props => props.theme.colors.background + '40'};
    color: ${props => props.theme.colors.text};
  }

  @media (max-width: 768px) {
    font-size: 9px;
    padding: 4px 8px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    padding: 3px 6px;
  }
`;

// ============================================
// 6. AI ANALYSIS - UPDATED WITH THEME
// ============================================

const AIFloatingButton = styled.button`
  position: fixed;
  bottom: 90px;
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 24px ${props => props.theme.colors.accent + '50'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  animation: ${floatPulse} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.1) translateY(-4px);
    box-shadow: 0 8px 40px ${props => props.theme.colors.accent + '60'};
  }

  &:active {
    transform: scale(0.95);
  }

  .ai-label {
    font-size: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.8;
    margin-top: 1px;
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    bottom: 76px;
    right: 10px;
    font-size: 11px;
    
    .ai-label {
      font-size: 5px;
    }
  }
`;

const AIAnalysisPanel = styled.div`
  position: fixed;
  bottom: 160px;
  right: 16px;
  width: 280px;
  max-height: 400px;
  background: ${props => props.theme.colors.backgroundSecondary + 'f0'};
  backdrop-filter: blur(24px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 18px 20px;
  z-index: 51;
  box-shadow: 0 24px 80px ${props => props.theme.colors.shadow};
  animation: ${fadeIn} 0.3s ease;
  display: ${props => props.isOpen ? 'block' : 'none'};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    width: 220px;
    right: 8px;
    bottom: 130px;
    max-height: 340px;
    padding: 14px 16px;
  }
`;

const AIAnalysisHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  .title {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.3px;
  }

  .title-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }

  .close-btn {
    background: ${props => props.theme.colors.background + '40'};
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.textMuted};
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${props => props.theme.colors.background + '60'};
      color: ${props => props.theme.colors.text};
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 10px;
    padding-bottom: 6px;
    .title { font-size: 11px; }
    .title-icon { width: 24px; height: 24px; font-size: 10px; }
    .close-btn { width: 26px; height: 26px; font-size: 12px; }
  }
`;

const AIScannerInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;
`;

const AISelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 9px;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 600;
    letter-spacing: 0.6px;
  }
`;

// ===== REDESIGNED AI DROPDOWN SELECTOR - UPDATED WITH THEME =====
const AIDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const AIDropdownButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.background + '60'};
    border-color: ${props => props.theme.colors.accent + '50'};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  .ai-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.color || props.theme.colors.accent};
    flex-shrink: 0;
  }

  .ai-selected-text {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .arrow {
    font-size: 10px;
    color: ${props => props.theme.colors.textMuted};
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    flex-shrink: 0;
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    .ai-selected-text { font-size: 10px; }
    .ai-dot { width: 6px; height: 6px; }
  }
`;

const AIDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.backgroundSecondary + 'f0'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 12px 40px ${props => props.theme.colors.shadow};
  backdrop-filter: blur(20px);
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    max-height: 160px;
  }
`;

const AIDropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid ${props => props.theme.colors.border + '40'};

  &:hover {
    background: ${props => props.theme.colors.background + '40'};
    color: ${props => props.theme.colors.text};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  .ai-item-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.color || props.theme.colors.accent};
    flex-shrink: 0;
  }

  .ai-item-name {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .ai-check {
    color: ${props => props.theme.colors.accent};
    font-size: 14px;
    opacity: ${props => props.active ? 1 : 0};
    flex-shrink: 0;
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    .ai-item-name { font-size: 10px; }
    .ai-item-dot { width: 6px; height: 6px; }
    .ai-check { font-size: 11px; }
  }
`;

// ===== AI Trade Type Dropdown - UPDATED WITH THEME =====
const AITradeTypeDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const AITradeTypeButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.background + '60'};
    border-color: ${props => props.theme.colors.accent + '50'};
  }

  .ai-type-selected {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow {
    font-size: 10px;
    color: ${props => props.theme.colors.textMuted};
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    flex-shrink: 0;
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    .ai-type-selected { font-size: 10px; }
  }
`;

const AITradeTypeMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.backgroundSecondary + 'f0'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 12px 40px ${props => props.theme.colors.shadow};
  backdrop-filter: blur(20px);
  max-height: 150px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    max-height: 120px;
  }
`;

const AITradeTypeItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid ${props => props.theme.colors.border + '40'};

  &:hover {
    background: ${props => props.theme.colors.background + '40'};
    color: ${props => props.theme.colors.text};
  }

  .ai-type-name {
    font-size: 12px;
    font-weight: 500;
  }

  .ai-check {
    color: ${props => props.theme.colors.accent};
    font-size: 14px;
    opacity: ${props => props.active ? 1 : 0};
    flex-shrink: 0;
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    .ai-type-name { font-size: 10px; }
    .ai-check { font-size: 11px; }
  }
`;

const AIScanButton = styled.button`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  background: ${props => props.theme.colors.background + 'cc'};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textMuted};
  font-size: 12px;
  font-weight: 500;
  cursor: not-allowed;
  transition: all 0.3s ease;
  opacity: 0.6;
  margin-top: 4px;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => `linear-gradient(90deg, transparent, ${props.theme.colors.accent + '20'}, transparent)`};
  }

  .scan-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .coming-soon-badge {
    font-size: 7px;
    text-transform: uppercase;
    padding: 1px 8px;
    border-radius: 10px;
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.accent};
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 8px 0;
  }
`;

// ============================================
// 7. DIGIT STATS - UPDATED WITH THEME
// ============================================

const DigitStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 680px;
  padding: 4px 2px;
  background: transparent;
  border: none;
  box-shadow: none;
  gap: 2px;

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 480px) {
    gap: 1px;
    padding: 2px 1px;
  }
`;

const DigitItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 6px;
  min-width: 0;

  .circle-badge {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${props => props.theme.colors.background + 'f0'};
    border: 1.5px solid ${props => 
      props.isLastDigit 
        ? (props.direction === 'up' ? '#00e676' : '#ff4a4a') 
        : props.theme.colors.border
    };
    box-shadow: ${props => props.isLastDigit ? `0 0 10px ${props.direction === 'up' ? 'rgba(0,230,118,0.4)' : 'rgba(255,74,74,0.4)'}` : 'none'};
    transition: all 0.15s ease;

    @media (max-width: 480px) {
      width: 24px;
      height: 24px;
      border-width: 1.5px;
    }
  }

  .digit-num {
    font-size: 10px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    line-height: 1;

    @media (max-width: 480px) {
      font-size: 8px;
    }
  }

  .pct-text {
    font-size: 7px;
    font-family: monospace;
    font-weight: 500;
    color: ${props => 
      props.isMax 
        ? '#00e676' 
        : (props.isMin ? '#ff4a4a' : props.theme.colors.textMuted)
    };
    line-height: 1;
    margin-top: 1px;

    @media (max-width: 480px) {
      font-size: 5px;
    }
  }

  .active-arrow {
    position: absolute;
    bottom: -2px;
    font-size: 7px;
    color: #ff9800; 
    display: ${props => props.isLastDigit ? 'block' : 'none'};
    line-height: 1;

    @media (max-width: 480px) {
      font-size: 5px;
      bottom: -1px;
    }
  }
`;

// ============================================
// 8. DIGIT GRID - UPDATED WITH THEME
// ============================================

const DigitGridWrapper = styled.div`
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 480px) {
    margin: 1px 0;
  }
`;

const DigitGridLabel = styled.div`
  font-size: 9px; text-transform: uppercase;
  color: ${props => props.theme.colors.textMuted};
  letter-spacing: 0.6px;
  font-weight: 600;
  margin-bottom: 3px;

  @media (max-width: 768px) {
    font-size: 8px;
    margin-bottom: 2px;
  }

  @media (max-width: 480px) {
    font-size: 7px;
    margin-bottom: 1px;
  }
`;

const DigitGrid = styled.div`
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 3px;

  @media (max-width: 480px) {
    gap: 2px;
  }
`;

const DigitButton = styled.button`
  padding: 6px 0;
  border: 1px solid ${props => {
    if (props.disabled) return props.theme.colors.border + '40';
    return props.selected ? props.theme.colors.accent + '90' : props.theme.colors.border;
  }};
  border-radius: 5px;
  background: ${props => {
    if (props.disabled) return props.theme.colors.background + '20';
    return props.selected ? props.theme.colors.accentActive : props.theme.colors.background + '40';
  }};
  color: ${props => {
    if (props.disabled) return props.theme.colors.textMuted + '60';
    return props.selected ? props.theme.colors.accent : props.theme.colors.textMuted;
  }};
  font-size: 13px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.disabled ? 0.4 : 1};

  &:hover {
    border-color: ${props => props.disabled ? props.theme.colors.border + '40' : props.theme.colors.accent + '80'};
    color: ${props => props.disabled ? props.theme.colors.textMuted + '60' : props.theme.colors.text};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
  }
  
  ${props => props.selected && !props.disabled && `
    box-shadow: 0 0 16px ${props.theme.colors.accent + '25'};
  `}
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    padding: 5px 0;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 3px 0;
    font-size: 10px;
  }
`;

// ============================================
// 9. EVEN/ODD BUTTONS - UPDATED WITH THEME
// ============================================

const EvenOddButtons = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    gap: 3px;
  }
`;

const EvenOddButton = styled.button`
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  background: ${props => props.variant === 'even'
    ? `linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))`
    : `linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))`};
  border: 1px solid ${props => props.variant === 'even' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.variant === 'even' ? '#22c55e' : '#ef4444'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'even'
      ? '0 8px 24px rgba(34, 197, 94, 0.2)'
      : '0 8px 24px rgba(239, 68, 68, 0.2)'};
  }
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  .label { font-size: 13px; font-weight: 600; }
  .payout { font-size: 10px; font-weight: 400; opacity: 0.7; }
  .sub { font-size: 9px; opacity: 0.5; font-weight: 400; }

  @media (max-width: 768px) {
    padding: 8px 0;
    .label { font-size: 12px; }
    .payout { font-size: 9px; }
    .sub { font-size: 8px; }
  }

  @media (max-width: 480px) {
    padding: 5px 0;
    .label { font-size: 10px; }
    .payout { font-size: 8px; }
    .sub { font-size: 7px; }
    border-radius: 4px;
  }
`;

// ============================================
// 10. TRADE BUTTONS - UPDATED WITH THEME
// ============================================

const TradeButtonsWrapper = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    gap: 3px;
  }
`;

const TradeButton = styled.button`
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  background: ${props => props.variant === 'primary'
    ? `linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))`
    : `linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))`};
  border: 1px solid ${props => props.variant === 'primary' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.variant === 'primary' ? '#22c55e' : '#ef4444'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'primary'
      ? '0 8px 24px rgba(34, 197, 94, 0.2)'
      : '0 8px 24px rgba(239, 68, 68, 0.2)'};
  }
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  .label { font-size: 13px; font-weight: 600; }
  .payout { font-size: 10px; font-weight: 400; opacity: 0.7; }
  .sub { font-size: 9px; opacity: 0.5; font-weight: 400; }

  @media (max-width: 768px) {
    padding: 8px 0;
    .label { font-size: 12px; }
    .payout { font-size: 9px; }
    .sub { font-size: 8px; }
  }

  @media (max-width: 480px) {
    padding: 5px 0;
    .label { font-size: 10px; }
    .payout { font-size: 8px; }
    .sub { font-size: 7px; }
    border-radius: 4px;
  }
`;

// ============================================
// 11. RUN BUTTON - UPDATED WITH THEME
// ============================================

const RunButton = styled.button`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px ${props => props.theme.colors.accent + '50'};
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s ease;
  }
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? `0 4px 16px ${props.theme.colors.accent + '50'}` : `0 8px 28px ${props.theme.colors.accent + '60'}`};
  }
  &:hover::before { left: ${props => props.disabled ? '-100%' : '100%'}; }
  &:active { transform: ${props => props.disabled ? 'none' : 'scale(0.98)'}; }
  .run-icon { margin-right: 6px; }

  @media (max-width: 768px) {
    padding: 8px 0;
    font-size: 12px;
    .run-icon { margin-right: 4px; }
  }

  @media (max-width: 480px) {
    padding: 5px 0;
    font-size: 10px;
    border-radius: 4px;
    .run-icon { margin-right: 3px; font-size: 9px; }
  }
`;

// ============================================
// 12. SESSION INFO (Bottom) - UPDATED WITH THEME
// ============================================

const SessionInfo = styled.div`
  padding-top: 10px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  .left {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .label {
    font-size: 8px;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textMuted};
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .trades {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 500;
  }

  .wins { color: #22c55e; }
  .losses { color: #ef4444; }

  .pl {
    font-size: 16px;
    font-weight: 700;
    color: #ef4444;
    padding: 3px 10px;
    border-radius: 5px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.15);
  }

  .pl-label {
    font-size: 8px;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textMuted};
    letter-spacing: 0.5px;
    text-align: right;
  }

  @media (max-width: 768px) {
    padding-top: 6px;
    .label { font-size: 7px; }
    .trades { font-size: 10px; }
    .pl { font-size: 14px; padding: 2px 8px; }
    .pl-label { font-size: 7px; }
  }

  @media (max-width: 480px) {
    padding-top: 4px;
    .label { font-size: 6px; }
    .trades { font-size: 8px; }
    .pl { font-size: 12px; padding: 2px 6px; }
    .pl-label { font-size: 6px; }
  }
`;

// ... (BOTS data and rest of the component code remains the same)

// ============================================
// BOT DATA - NO EMOJIS
// ============================================

const BOTS = [
  {
    id: 'sniper',
    name: 'Voltix Sniper',
    type: 'Matches/Differs',
    badge: 'Precision',
  },
  {
    id: 'hunter',
    name: 'Digit Hunter',
    type: 'Matches/Differs',
    badge: 'Hunter',
  },
  {
    id: 'overload',
    name: 'Overload X',
    type: 'Over/Under',
    badge: 'Power',
  },
  {
    id: 'reversal',
    name: 'Reversal King',
    type: 'Over/Under',
    badge: 'King',
  },
  {
    id: 'martingale',
    name: 'Martingale Beast',
    type: 'Even/Odd',
    badge: 'Beast',
  },
  {
    id: 'echo',
    name: 'Echo Trader',
    type: 'Even/Odd',
    badge: 'Echo',
  },
];

// ============================================
// MAIN COMPONENT (The rest remains the same with theme updates applied)
// ============================================

const RightPanel = ({ selectedMarket: externalMarket, onMarketChange }) => {
  // ... (all state declarations remain the same)
  // ... (all handlers remain the same)
  // ... (all render functions remain the same, but they now use theme through styled components)

  // The component logic remains identical, just the styled components above have been updated
  // to use theme variables instead of hardcoded colors.
};

export default RightPanel;