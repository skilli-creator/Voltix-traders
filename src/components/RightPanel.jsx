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
// ANIMATIONS
// ============================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${props => props.theme?.colors?.accent + '20' || 'rgba(41, 98, 255, 0.1)'}; }
  50% { box-shadow: 0 0 30px ${props => props.theme?.colors?.accent + '35' || 'rgba(41, 98, 255, 0.2)'}; }
`;

const floatPulse = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const PanelContainer = styled.div`
  width: 290px;
  min-width: 290px;
  background: ${props => props.theme?.colors?.background || '#0b0e14'};
  border-left: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  padding: 16px 14px 12px 14px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
  overflow-y: auto;
  gap: 6px;
  position: relative;
  box-sizing: border-box;
  transition: background 0.3s ease, border-color 0.3s ease;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.06)'};
    border-radius: 4px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    width: 220px;
    min-width: 220px;
    padding: 12px 10px 8px 10px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: 100%;
    padding: 8px 16px 6px 16px !important;
    border-left: none;
    background: ${props => props.theme?.colors?.background || '#0a0e17'};
    gap: 4px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px 4px 12px !important;
    gap: 3px;
  }
`;

// ============================================
// PHONE TWO-COLUMN WRAPPER
// ============================================

const PhoneTwoColumnWrapper = styled.div`
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px !important;
    margin-bottom: 2px;
    width: 100%;
    box-sizing: border-box;
  }

  @media (max-width: 480px) {
    gap: 8px !important;
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
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.background + '60' || 'rgba(255,255,255,0.04)'};
    border-color: ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  .market-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.color || props.theme?.colors?.accent || '#2962ff'};
    flex-shrink: 0;
  }

  .market-name {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow {
    font-size: 9px;
    color: ${props => props.theme?.colors?.textMuted || '#5a6070'};
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    flex-shrink: 0;
    margin-left: 6px;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    .market-name { font-size: 11px; }
    .market-dot { width: 5px; height: 5px; }
  }
`;

const MarketDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 8px 32px ${props => props.theme?.colors?.shadow || 'rgba(0,0,0,0.4)'};
  max-height: 260px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.06)'};
    border-radius: 4px;
  }
`;

const MarketOption = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme?.colors?.text || '#ffffff' : props.theme?.colors?.textMuted || '#94a3b8'};
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid ${props => props.theme?.colors?.border + '30' || 'rgba(255,255,255,0.02)'};

  &:hover {
    background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.03)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.color || props.theme?.colors?.accent || '#2962ff'};
    flex-shrink: 0;
  }

  .option-name {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .check {
    color: ${props => props.theme?.colors?.accent || '#2962ff'};
    font-size: 13px;
    opacity: ${props => props.active ? 1 : 0};
    flex-shrink: 0;
    margin-left: 6px;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    .option-name { font-size: 11px; }
    .dot { width: 5px; height: 5px; }
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
  padding: 8px 12px;
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.isOpen ? props.theme?.colors?.accent + '60' || 'rgba(41,98,255,0.3)' : props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'};
    background: ${props => props.theme?.colors?.background + '60' || 'rgba(255,255,255,0.04)'};
  }

  .left { display: flex; align-items: center; gap: 8px; }
  .label { font-size: 13px; font-weight: 500; color: ${props => props.theme?.colors?.text || '#d1d4dc'}; }
  .arrow {
    font-size: 10px; color: ${props => props.theme?.colors?.textMuted || '#5a6070'};
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
  .badge {
    font-size: 7px; text-transform: uppercase; padding: 1px 8px;
    border-radius: 10px; background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.1)'};
    color: ${props => props.theme?.colors?.accent || '#2962ff'};
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    .label { font-size: 12px; }
    .badge { font-size: 6px; padding: 1px 6px; }
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    .label { font-size: 11px; }
    .arrow { font-size: 9px; }
    .badge { font-size: 5px; padding: 1px 5px; }
  }
`;

const Dropdown = styled.div`
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 8px; overflow: hidden; z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 8px 32px ${props => props.theme?.colors?.shadow || 'rgba(0,0,0,0.4)'};
  backdrop-filter: blur(10px);

  @media (max-width: 480px) {
    border-radius: 6px;
  }
`;

const DropdownOption = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme?.colors?.text || '#ffffff' : props.theme?.colors?.textMuted || '#8a93a6'};
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};
  font-size: 12px;
  transition: all 0.15s ease;

  &:hover { background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.03)'}; color: ${props => props.theme?.colors?.text || '#ffffff'}; }
  .check { color: ${props => props.theme?.colors?.accent || '#2962ff'}; font-size: 13px; opacity: ${props => props.active ? 1 : 0}; }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 11px;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    font-size: 10px;
    .check { font-size: 11px; }
  }
`;

// ============================================
// 3. TRADE MODE TOGGLE
// ============================================

const TradeModeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 768px) {
    gap: 2px;
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
  color: ${props => props.theme?.colors?.textMuted || '#64748b'};
  letter-spacing: 0.6px;
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
  gap: 3px;
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  border-radius: 8px;
  padding: 3px;
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};

  @media (max-width: 768px) {
    padding: 2px;
    gap: 2px;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    padding: 2px;
    gap: 2px;
    border-radius: 5px;
  }
`;

const TradeModeButton = styled.button`
  flex: 1;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})` : 'transparent'};
  color: ${props => props.active ? props.theme?.colors?.text || '#ffffff' : props.theme?.colors?.textMuted || '#8a93a6'};
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  letter-spacing: 0.3px;

  ${props => props.active && `
    box-shadow: 0 2px 12px ${props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.2)'};
  `}

  &:hover {
    color: ${props => props.active ? props.theme?.colors?.text || '#ffffff' : props.theme?.colors?.text || '#d1d4dc'};
    background: ${props => props.active ? `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})` : props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  }

  &:active {
    transform: scale(0.97);
  }

  .mode-label {
    font-size: 10px;
    font-weight: 600;
  }

  .mode-shortcut {
    font-size: 6px;
    opacity: 0.4;
    font-weight: 400;
    letter-spacing: 0.5px;
    background: rgba(255,255,255,0.05);
    padding: 1px 5px;
    border-radius: 4px;
    display: ${props => props.active ? 'inline-block' : 'none'};
  }

  @media (max-width: 768px) {
    padding: 5px 8px;
    font-size: 9px;
    border-radius: 5px;
    .mode-label { font-size: 9px; }
    .mode-shortcut { font-size: 5px; padding: 0px 4px; }
  }

  @media (max-width: 480px) {
    padding: 4px 6px;
    font-size: 8px;
    border-radius: 4px;
    gap: 2px;
    .mode-label { font-size: 8px; }
    .mode-shortcut { display: none; }
  }
`;

// ============================================
// 4. BOT SELECTION
// ============================================

const BotGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    gap: 3px;
  }
`;

const BotCard = styled.div`
  padding: 6px 4px;
  background: ${props => props.selected ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.selected ? props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)' : props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.15)'};
    transform: translateY(-1px);
  }

  ${props => props.selected && `
    border-color: ${props.theme?.colors?.accent || '#2962ff'};
    box-shadow: 0 0 20px ${props.theme?.colors?.accent + '15' || 'rgba(41,98,255,0.08)'};
    animation: ${pulseGlow} 2s ease-in-out infinite;
  `}

  .bot-name { font-size: 9px; font-weight: 600; color: ${props => props.theme?.colors?.text || '#d1d4dc'}; }
  .bot-type { font-size: 6px; text-transform: uppercase; color: ${props => props.theme?.colors?.textMuted || '#5a6070'}; margin-top: 1px; letter-spacing: 0.3px; }
  .bot-badge {
    font-size: 5px; text-transform: uppercase; padding: 1px 6px;
    border-radius: 4px; background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.08)'};
    color: ${props => props.theme?.colors?.accent || '#2962ff'}; display: inline-block; margin-top: 1px;
  }

  @media (max-width: 768px) {
    padding: 5px 3px;
    .bot-name { font-size: 8px; }
    .bot-type { font-size: 5px; }
    .bot-badge { font-size: 4px; padding: 1px 4px; }
  }

  @media (max-width: 480px) {
    padding: 4px 2px;
    .bot-name { font-size: 7px; }
    .bot-type { font-size: 5px; }
    .bot-badge { font-size: 4px; padding: 1px 3px; }
  }
`;

const BotHeader = styled.div`
  text-align: center;
  padding: 2px 0 3px 0;
  animation: ${fadeIn} 0.4s ease;

  .title { font-size: 11px; font-weight: 500; color: ${props => props.theme?.colors?.text || '#d1d4dc'}; }
  .subtitle {
    font-size: 9px; color: ${props => props.theme?.colors?.textMuted || '#5a6070'}; margin-top: 1px;
    .highlight { color: ${props => props.theme?.colors?.accent || '#2962ff'}; font-weight: 600; }
  }

  @media (max-width: 768px) {
    padding: 0 0 2px 0;
    .title { font-size: 10px; }
    .subtitle { font-size: 8px; }
  }

  @media (max-width: 480px) {
    .title { font-size: 9px; }
    .subtitle { font-size: 7px; }
  }
`;

// ============================================
// 5. INPUT FIELDS
// ============================================

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 768px) {
    gap: 4px;
  }

  @media (max-width: 480px) {
    gap: 3px;
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
  font-size: 7px;
  text-transform: uppercase;
  color: ${props => props.theme?.colors?.textMuted || '#8a93a6'};
  letter-spacing: 0.5px;
  font-weight: 600;

  .suffix { 
    font-size: 6px; 
    color: ${props => props.theme?.colors?.textMuted + '60' || '#4a4f5e'}; 
    text-transform: none; 
    letter-spacing: 0; 
    font-weight: 400; 
  }
  .optional {
    font-size: 5px; 
    color: ${props => props.theme?.colors?.textMuted + '60' || '#4a4f5e'}; 
    text-transform: none;
    background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'}; 
    padding: 0 4px; 
    border-radius: 3px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
    font-weight: 400;
  }

  @media (max-width: 768px) {
    font-size: 6px;
    .suffix { font-size: 5px; }
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
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 5px;
  transition: all 0.2s ease;
  overflow: hidden;

  &:focus-within { 
    border-color: ${props => props.theme?.colors?.accent + '50' || 'rgba(41,98,255,0.25)'}; 
    box-shadow: 0 0 0 2px ${props => props.theme?.colors?.accent + '10' || 'rgba(41,98,255,0.05)'}; 
  }
  
  .prefix {
    padding: 3px 6px;
    font-size: 10px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#5a6070'};
    background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
    border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  }

  @media (max-width: 768px) {
    border-radius: 4px;
    .prefix { padding: 2px 4px; font-size: 9px; }
  }

  @media (max-width: 480px) {
    border-radius: 3px;
    .prefix { padding: 2px 3px; font-size: 8px; }
  }
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 3px 6px;
  background: transparent;
  border: none;
  color: ${props => props.theme?.colors?.text || '#d1d4dc'};
  font-size: 11px;
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
    color: ${props => props.theme?.colors?.textMuted + '40' || '#3a4055'};
    font-weight: 400;
    font-size: 10px;
  }

  @media (max-width: 768px) {
    padding: 2px 4px;
    font-size: 10px;
    &::placeholder { font-size: 9px; }
  }

  @media (max-width: 480px) {
    padding: 2px 3px;
    font-size: 9px;
    &::placeholder { font-size: 8px; }
  }
`;

// ===== TOGGLE COMPONENTS =====
const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 5px;
  padding: 2px 5px;
  height: 26px;
  gap: 3px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 2px 4px;
    height: 22px;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    padding: 1px 3px;
    height: 20px;
    border-radius: 3px;
    gap: 2px;
  }
`;

const ToggleLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 6px;
  text-transform: uppercase;
  color: ${props => props.theme?.colors?.textMuted || '#8a93a6'};
  letter-spacing: 0.4px;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 5px;
    gap: 1px;
  }

  @media (max-width: 480px) {
    font-size: 5px;
    gap: 1px;
  }
`;

const ToggleTrack = styled.div`
  width: 24px;
  height: 14px;
  background: ${props => props.active ? `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})` : props.theme?.colors?.scrollbar || '#2a2e3d'};
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  flex-shrink: 0;

  &:hover { box-shadow: 0 0 12px ${props => props.theme?.colors?.accent + '20' || 'rgba(41,98,255,0.1)'}; }
  
  .thumb {
    width: 10px;
    height: 10px;
    background: ${props => props.theme?.colors?.text || '#ffffff'};
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '12px' : '2px'};
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  @media (max-width: 768px) {
    width: 20px;
    height: 12px;
    .thumb {
      width: 8px;
      height: 8px;
      left: ${props => props.active ? '10px' : '2px'};
      top: 2px;
    }
  }

  @media (max-width: 480px) {
    width: 18px;
    height: 10px;
    border-radius: 5px;
    .thumb {
      width: 6px;
      height: 6px;
      left: ${props => props.active ? '10px' : '2px'};
      top: 2px;
    }
  }
`;

const ToggleStatus = styled.span`
  font-size: 6px;
  color: ${props => props.active ? '#22c55e' : props.theme?.colors?.textMuted + '60' || '#4a4f5e'};
  font-weight: 600;
  min-width: 16px;

  @media (max-width: 768px) {
    font-size: 5px;
    min-width: 12px;
  }

  @media (max-width: 480px) {
    font-size: 5px;
    min-width: 10px;
  }
`;

// ===== DROPDOWN SELECT =====
const DropdownSelect = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DropdownSelectButton = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 1px 5px 1px 6px;
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 9px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  height: 20px;
  min-width: 28px;
  justify-content: center;

  &:hover {
    background: ${props => props.theme?.colors?.background + '60' || 'rgba(255,255,255,0.04)'};
    border-color: ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.15)'};
  }

  .dropdown-arrow {
    font-size: 6px;
    color: ${props => props.theme?.colors?.textMuted || '#5a6070'};
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }

  @media (max-width: 768px) {
    font-size: 8px;
    height: 16px;
    padding: 1px 4px 1px 5px;
    min-width: 24px;
  }

  @media (max-width: 480px) {
    font-size: 7px;
    height: 14px;
    padding: 1px 3px 1px 4px;
    min-width: 20px;
    gap: 1px;
  }
`;

const DropdownSelectMenu = styled.div`
  position: absolute;
  top: calc(100% + 3px);
  right: 0;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.15s ease;
  box-shadow: 0 8px 24px ${props => props.theme?.colors?.shadow || 'rgba(0,0,0,0.4)'};
  max-height: 150px;
  overflow-y: auto;
  min-width: 40px;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.06)'};
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    max-height: 120px;
    min-width: 32px;
  }
`;

const DropdownSelectItem = styled.div`
  padding: 4px 8px;
  cursor: pointer;
  font-size: 9px;
  font-weight: 500;
  color: ${props => props.active ? props.theme?.colors?.text || '#ffffff' : props.theme?.colors?.textMuted || '#94a3b8'};
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};
  transition: all 0.15s ease;
  text-align: center;

  &:hover {
    background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.03)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  @media (max-width: 768px) {
    font-size: 8px;
    padding: 3px 6px;
  }

  @media (max-width: 480px) {
    font-size: 7px;
    padding: 3px 5px;
  }
`;

// ============================================
// 6. AI ANALYSIS
// ============================================

const AIButtonContainer = styled.div`
  position: fixed;
  bottom: ${props => props.isMobile ? '140px' : '140px'};
  right: ${props => props.isMobile ? '12px' : '24px'};
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 480px) {
    bottom: 120px;
    right: 10px;
  }

  @media (min-width: 769px) {
    bottom: 140px;
    right: 24px;
  }
`;

const AIFloatingButton = styled.button`
  width: ${props => props.isMobile ? '44px' : '48px'};
  height: ${props => props.isMobile ? '44px' : '48px'};
  border-radius: 50%;
  border: none;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#818cf8'})`};
  color: ${props => props.theme?.colors?.text || 'white'};
  font-size: ${props => props.isMobile ? '11px' : '14px'};
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 20px ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.2)'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  animation: ${floatPulse} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.05) translateY(-3px);
    box-shadow: 0 4px 30px ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.3)'};
  }

  &:active {
    transform: scale(0.95);
  }

  .ai-label {
    font-size: ${props => props.isMobile ? '5px' : '6px'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.8;
    margin-top: 1px;
  }
`;

const AIAnalysisPanel = styled.div`
  position: fixed;
  bottom: ${props => props.isMobile ? '180px' : '160px'};
  right: ${props => props.isMobile ? '8px' : '24px'};
  width: ${props => props.isMobile ? '220px' : '280px'};
  max-height: ${props => props.isMobile ? '340px' : '400px'};
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(8,18,38,0.96)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 12px;
  padding: ${props => props.isMobile ? '14px 16px' : '16px 20px'};
  z-index: 51;
  box-shadow: 0 12px 48px ${props => props.theme?.colors?.shadow || 'rgba(0,0,0,0.4)'};
  animation: ${fadeIn} 0.3s ease;
  display: ${props => props.isOpen ? 'block' : 'none'};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.06)'};
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    width: 200px;
    right: 8px;
    bottom: 130px;
    max-height: 300px;
    padding: 12px 14px;
  }
`;

const AIAnalysisHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};

  .title {
    font-size: ${props => props.isMobile ? '11px' : '13px'};
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .title-icon {
    width: ${props => props.isMobile ? '24px' : '28px'};
    height: ${props => props.isMobile ? '24px' : '28px'};
    border-radius: 6px;
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#818cf8'})`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.isMobile ? '10px' : '12px'};
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || 'white'};
  }

  .close-btn {
    background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    width: 26px;
    height: 26px;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${props => props.theme?.colors?.background + '60' || 'rgba(255,255,255,0.04)'};
      color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 8px;
    padding-bottom: 6px;
    .title { font-size: 10px; }
    .title-icon { width: 20px; height: 20px; font-size: 9px; }
    .close-btn { width: 22px; height: 22px; font-size: 10px; }
  }
`;

const AIScannerInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0;
`;

const AISelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  .label {
    font-size: 8px;
    text-transform: uppercase;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    font-weight: 600;
    letter-spacing: 0.5px;
  }
`;

// ===== AI DROPDOWN SELECTOR =====
const AIDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const AIDropdownButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.background + '60' || 'rgba(255,255,255,0.04)'};
    border-color: ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.15)'};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    flex: 1;
  }

  .ai-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.color || props.theme?.colors?.accent || '#2962ff'};
    flex-shrink: 0;
  }

  .ai-selected-text {
    font-size: 11px;
    font-weight: 500;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow {
    font-size: 8px;
    color: ${props => props.theme?.colors?.textMuted || '#5a6070'};
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    flex-shrink: 0;
    margin-left: 6px;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    .ai-selected-text { font-size: 10px; }
    .ai-dot { width: 5px; height: 5px; }
  }
`;

const AIDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  right: 0;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 8px 24px ${props => props.theme?.colors?.shadow || 'rgba(0,0,0,0.4)'};
  max-height: 180px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.06)'};
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    max-height: 140px;
  }
`;

const AIDropdownItem = styled.div`
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme?.colors?.text || '#ffffff' : props.theme?.colors?.textMuted || '#94a3b8'};
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid ${props => props.theme?.colors?.border + '30' || 'rgba(255,255,255,0.02)'};

  &:hover {
    background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.03)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    flex: 1;
  }

  .ai-item-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.color || props.theme?.colors?.accent || '#2962ff'};
    flex-shrink: 0;
  }

  .ai-item-name {
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ai-check {
    color: ${props => props.theme?.colors?.accent || '#2962ff'};
    font-size: 12px;
    opacity: ${props => props.active ? 1 : 0};
    flex-shrink: 0;
    margin-left: 6px;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    .ai-item-name { font-size: 10px; }
    .ai-item-dot { width: 5px; height: 5px; }
    .ai-check { font-size: 10px; }
  }
`;

// ===== AI Trade Type Dropdown =====
const AITradeTypeDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const AITradeTypeButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.background + '60' || 'rgba(255,255,255,0.04)'};
    border-color: ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.15)'};
  }

  .ai-type-selected {
    font-size: 11px;
    font-weight: 500;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow {
    font-size: 8px;
    color: ${props => props.theme?.colors?.textMuted || '#5a6070'};
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    flex-shrink: 0;
    margin-left: 6px;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    .ai-type-selected { font-size: 10px; }
  }
`;

const AITradeTypeMenu = styled.div`
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  right: 0;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 8px 24px ${props => props.theme?.colors?.shadow || 'rgba(0,0,0,0.4)'};
  max-height: 150px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.06)'};
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    max-height: 120px;
  }
`;

const AITradeTypeItem = styled.div`
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? props.theme?.colors?.text || '#ffffff' : props.theme?.colors?.textMuted || '#94a3b8'};
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid ${props => props.theme?.colors?.border + '30' || 'rgba(255,255,255,0.02)'};

  &:hover {
    background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.03)'};
    color: ${props => props.theme?.colors?.text || '#ffffff'};
  }

  .ai-type-name {
    font-size: 11px;
    font-weight: 500;
  }

  .ai-check {
    color: ${props => props.theme?.colors?.accent || '#2962ff'};
    font-size: 12px;
    opacity: ${props => props.active ? 1 : 0};
    flex-shrink: 0;
    margin-left: 6px;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    .ai-type-name { font-size: 10px; }
    .ai-check { font-size: 10px; }
  }
`;

const AIScanButton = styled.button`
  width: 100%;
  padding: 8px 0;
  border: none;
  border-radius: 6px;
  background: ${props => props.theme?.colors?.background + '60' || 'rgba(255,255,255,0.03)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  color: ${props => props.theme?.colors?.textMuted || '#64748b'};
  font-size: 11px;
  font-weight: 500;
  cursor: not-allowed;
  transition: all 0.3s ease;
  opacity: 0.5;
  margin-top: 2px;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;

  .scan-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .coming-soon-badge {
    font-size: 6px;
    text-transform: uppercase;
    padding: 1px 6px;
    border-radius: 8px;
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)'};
    color: ${props => props.theme?.colors?.accent || '#38bdf8'};
    font-weight: 600;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 6px 0;
    .coming-soon-badge { font-size: 5px; padding: 1px 5px; }
  }
`;

// ============================================
// 7. DIGIT STATS
// ============================================

const DigitStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 3px 1px;
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
  padding-bottom: 4px;
  min-width: 0;

  .circle-badge {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${props => props.theme?.colors?.background + 'f0' || 'rgba(20,28,43,0.95)'};
    border: 1.5px solid ${props => 
      props.isLastDigit 
        ? (props.direction === 'up' ? '#00e676' : '#ff4a4a') 
        : props.theme?.colors?.border || 'rgba(255,255,255,0.06)'
    };
    box-shadow: ${props => props.isLastDigit ? `0 0 10px ${props.direction === 'up' ? 'rgba(0,230,118,0.3)' : 'rgba(255,74,74,0.3)'}` : 'none'};
    transition: all 0.15s ease;

    @media (max-width: 480px) {
      width: 22px;
      height: 22px;
      border-width: 1.5px;
    }
  }

  .digit-num {
    font-size: 9px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    line-height: 1;

    @media (max-width: 480px) {
      font-size: 7px;
    }
  }

  .pct-text {
    font-size: 6px;
    font-family: monospace;
    font-weight: 500;
    color: ${props => 
      props.isMax 
        ? '#00e676' 
        : (props.isMin ? '#ff4a4a' : props.theme?.colors?.textMuted || '#728096')
    };
    line-height: 1;
    margin-top: 0px;

    @media (max-width: 480px) {
      font-size: 5px;
    }
  }

  .active-arrow {
    position: absolute;
    bottom: -2px;
    font-size: 6px;
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
// 8. DIGIT GRID
// ============================================

const DigitGridWrapper = styled.div`
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 480px) {
    margin: 1px 0;
  }
`;

const DigitGridLabel = styled.div`
  font-size: 8px; text-transform: uppercase;
  color: ${props => props.theme?.colors?.textMuted || '#8a93a6'};
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 2px;

  @media (max-width: 768px) {
    font-size: 7px;
    margin-bottom: 1px;
  }

  @media (max-width: 480px) {
    font-size: 6px;
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
  padding: 5px 0;
  border: 1px solid ${props => {
    if (props.disabled) return props.theme?.colors?.border + '40' || 'rgba(255,255,255,0.02)';
    return props.selected ? props.theme?.colors?.accent + '60' || 'rgba(41,98,255,0.3)' : props.theme?.colors?.border || 'rgba(255,255,255,0.04)';
  }};
  border-radius: 4px;
  background: ${props => {
    if (props.disabled) return props.theme?.colors?.background + '20' || 'rgba(255,255,255,0.01)';
    return props.selected ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)';
  }};
  color: ${props => {
    if (props.disabled) return props.theme?.colors?.textMuted + '40' || '#4a4f5e';
    return props.selected ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.textMuted || '#8a93a6';
  }};
  font-size: 12px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.3 : 1};

  &:hover {
    border-color: ${props => props.disabled ? props.theme?.colors?.border + '40' || 'rgba(255,255,255,0.02)' : props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'};
    color: ${props => props.disabled ? props.theme?.colors?.textMuted + '40' || '#4a4f5e' : props.theme?.colors?.text || '#d1d4dc'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
  }
  
  ${props => props.selected && !props.disabled && `
    box-shadow: 0 0 12px ${props.theme?.colors?.accent + '15' || 'rgba(41,98,255,0.08)'};
  `}
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    padding: 4px 0;
    font-size: 11px;
  }

  @media (max-width: 480px) {
    padding: 3px 0;
    font-size: 10px;
  }
`;

// ============================================
// 9. EVEN/ODD BUTTONS
// ============================================

const EvenOddButtons = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    gap: 3px;
  }
`;

const EvenOddButton = styled.button`
  padding: 8px 0;
  border: none;
  border-radius: 6px;
  background: ${props => props.variant === 'even'
    ? 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))'
    : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))'};
  border: 1px solid ${props => props.variant === 'even' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'};
  color: ${props => props.variant === 'even' ? '#22c55e' : '#ef4444'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.variant === 'even'
      ? '0 4px 16px rgba(34,197,94,0.1)'
      : '0 4px 16px rgba(239,68,68,0.1)'};
  }
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  .label { font-size: 12px; font-weight: 600; }
  .payout { font-size: 9px; font-weight: 400; opacity: 0.7; }
  .sub { font-size: 8px; opacity: 0.5; font-weight: 400; }

  @media (max-width: 768px) {
    padding: 6px 0;
    .label { font-size: 11px; }
    .payout { font-size: 8px; }
    .sub { font-size: 7px; }
  }

  @media (max-width: 480px) {
    padding: 4px 0;
    .label { font-size: 10px; }
    .payout { font-size: 7px; }
    .sub { font-size: 6px; }
    border-radius: 4px;
  }
`;

// ============================================
// 10. TRADE BUTTONS
// ============================================

const TradeButtonsWrapper = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    gap: 3px;
  }
`;

const TradeButton = styled.button`
  padding: 8px 0;
  border: none;
  border-radius: 6px;
  background: ${props => props.variant === 'primary'
    ? 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))'
    : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))'};
  border: 1px solid ${props => props.variant === 'primary' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'};
  color: ${props => props.variant === 'primary' ? '#22c55e' : '#ef4444'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.variant === 'primary'
      ? '0 4px 16px rgba(34,197,94,0.1)'
      : '0 4px 16px rgba(239,68,68,0.1)'};
  }
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  .label { font-size: 12px; font-weight: 600; }
  .payout { font-size: 9px; font-weight: 400; opacity: 0.7; }
  .sub { font-size: 8px; opacity: 0.5; font-weight: 400; }

  @media (max-width: 768px) {
    padding: 6px 0;
    .label { font-size: 11px; }
    .payout { font-size: 8px; }
    .sub { font-size: 7px; }
  }

  @media (max-width: 480px) {
    padding: 4px 0;
    .label { font-size: 10px; }
    .payout { font-size: 7px; }
    .sub { font-size: 6px; }
    border-radius: 4px;
  }
`;

// ============================================
// 11. RUN BUTTON
// ============================================

const RunButton = styled.button`
  width: 100%;
  padding: 8px 0;
  border: none;
  border-radius: 6px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 12px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  box-shadow: 0 2px 12px ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.2)'};
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  flex-shrink: 0;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.disabled ? '0 2px 12px rgba(41,98,255,0.2)' : '0 4px 20px rgba(41,98,255,0.3)'};
  }
  &:active { transform: ${props => props.disabled ? 'none' : 'scale(0.98)'}; }
  .run-icon { margin-right: 4px; }

  @media (max-width: 768px) {
    padding: 6px 0;
    font-size: 11px;
    .run-icon { margin-right: 3px; }
  }

  @media (max-width: 480px) {
    padding: 5px 0;
    font-size: 10px;
    border-radius: 4px;
    .run-icon { margin-right: 2px; font-size: 8px; }
  }
`;

// ============================================
// 12. SESSION INFO (Bottom)
// ============================================

const SessionInfo = styled.div`
  padding-top: 8px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
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
    font-size: 7px;
    text-transform: uppercase;
    color: ${props => props.theme?.colors?.textMuted || '#5a6070'};
    letter-spacing: 0.4px;
    font-weight: 600;
  }

  .trades {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#8a93a6'};
    font-weight: 500;
  }

  .wins { color: #22c55e; }
  .losses { color: #ef4444; }

  .pl {
    font-size: 14px;
    font-weight: 700;
    color: #ef4444;
    padding: 2px 10px;
    border-radius: 4px;
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.08);
  }

  .pl-label {
    font-size: 7px;
    text-transform: uppercase;
    color: ${props => props.theme?.colors?.textMuted || '#5a6070'};
    letter-spacing: 0.4px;
    text-align: right;
  }

  @media (max-width: 768px) {
    padding-top: 6px;
    .label { font-size: 6px; }
    .trades { font-size: 9px; }
    .pl { font-size: 12px; padding: 2px 8px; }
    .pl-label { font-size: 6px; }
  }

  @media (max-width: 480px) {
    padding-top: 4px;
    .label { font-size: 6px; }
    .trades { font-size: 8px; }
    .pl { font-size: 11px; padding: 1px 6px; }
    .pl-label { font-size: 6px; }
  }
`;

// ============================================
// 13. SINGLE BUY BUTTON - PREMIUM STYLE FOR ACCUMULATORS
// ============================================

const SingleTradeButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2px 0;
  animation: ${fadeIn} 0.5s ease;
`;

const SingleTradeButton = styled.button`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-size: 13px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.25s ease;
  box-shadow: 0 2px 16px ${props => props.theme?.colors?.accent + '25' || 'rgba(41,98,255,0.15)'};
  position: relative;
  overflow: hidden;
  opacity: ${props => props.disabled ? 0.5 : 1};
  letter-spacing: 0.3px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px ${props => props.theme?.colors?.accent + '35' || 'rgba(41,98,255,0.2)'};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  .buy-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    position: relative;
    z-index: 1;
  }

  .buy-icon {
    font-size: 16px;
    opacity: 0.9;
  }

  .buy-text {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .buy-divider {
    width: 1px;
    height: 20px;
    background: rgba(255,255,255,0.15);
  }

  .buy-payout {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 400;
    opacity: 0.9;
  }

  .payout-amount {
    font-weight: 700;
    font-size: 12px;
  }

  .payout-pct {
    background: rgba(255,255,255,0.1);
    padding: 1px 8px;
    border-radius: 8px;
    font-size: 9px;
    font-weight: 600;
  }

  .stake-info {
    font-size: 9px;
    font-weight: 400;
    opacity: 0.5;
    margin-left: 2px;
  }

  @media (max-width: 768px) {
    padding: 10px 0;
    border-radius: 6px;
    font-size: 12px;

    .buy-icon { font-size: 14px; }
    .buy-text { font-size: 12px; }
    .buy-payout { font-size: 10px; }
    .payout-amount { font-size: 11px; }
    .buy-divider { height: 18px; }
  }

  @media (max-width: 480px) {
    padding: 8px 0;
    border-radius: 5px;
    font-size: 11px;

    .buy-content { gap: 8px; flex-wrap: wrap; justify-content: center; }
    .buy-icon { font-size: 12px; }
    .buy-text { font-size: 11px; }
    .buy-payout { font-size: 9px; gap: 4px; }
    .payout-amount { font-size: 10px; }
    .payout-pct { font-size: 8px; padding: 1px 5px; }
    .buy-divider { height: 14px; }
    .stake-info { font-size: 8px; }
  }
`;

// ============================================
// BOT DATA
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
// MAIN COMPONENT
// ============================================

const RightPanel = ({ selectedMarket: externalMarket, onMarketChange }) => {
  const [tradeType, setTradeType] = useState('overunder');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tradeMode, setTradeMode] = useState('auto');
  const [selectedDigit, setSelectedDigit] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [martingale, setMartingale] = useState(false);
  const [martingaleMultiplier, setMartingaleMultiplier] = useState(1.5);
  const [bulkTrading, setBulkTrading] = useState(false);
  const [bulkCount, setBulkCount] = useState(2);
  const [stake, setStake] = useState('');
  const [targetProfit, setTargetProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [duration, setDuration] = useState(5);
  const [growthRate, setGrowthRate] = useState(1);

  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);

  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMarket, setAiMarket] = useState(VOLATILITY_MARKETS[0].symbol);
  const [aiTradeType, setAiTradeType] = useState('overunder');

  const [isAIMarketDropdownOpen, setIsAIMarketDropdownOpen] = useState(false);
  const [isAITradeTypeDropdownOpen, setIsAITradeTypeDropdownOpen] = useState(false);

  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
  const [isMartingaleDropdownOpen, setIsMartingaleDropdownOpen] = useState(false);
  const [isGrowthRateDropdownOpen, setIsGrowthRateDropdownOpen] = useState(false);

  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [localSelectedMarket, setLocalSelectedMarket] = useState(VOLATILITY_MARKETS[0]);

  const selectedMarket = externalMarket || localSelectedMarket;

  const [digitStats, setDigitStats] = useState(Array(10).fill(0).map((_, i) => ({ digit: i, pct: 10 })));
  const [lastDigit, setLastDigit] = useState(5);
  const [movementDirection, setMovementDirection] = useState('down');
  const [price, setPrice] = useState(8459.65);

  const getTradeTypes = () => {
    const baseTypes = [
      { id: 'overunder', label: 'Over/Under' },
      { id: 'evenodd', label: 'Even/Odd' },
      { id: 'matches', label: 'Matches/Differs' },
      { id: 'accumulators', label: 'Accumulators' },
    ];
    
    if (tradeMode === 'auto') {
      return [...baseTypes, { id: 'random', label: 'Random' }];
    }
    
    return baseTypes;
  };

  const tradeTypes = getTradeTypes();

  const getCurrentTrade = () => tradeTypes.find(t => t.id === tradeType) || tradeTypes[0];

  const filteredBots = useMemo(() => {
    if (tradeType === 'accumulators') {
      return BOTS;
    }
    return BOTS.filter(bot => bot.type === getCurrentTrade().label);
  }, [tradeType]);

  const bulkOptions = Array.from({ length: 19 }, (_, i) => i + 2);
  const martingaleOptions = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
  const durationOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const growthRateOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 2;
      const newPrice = parseFloat((price + delta).toFixed(2));
      setPrice(newPrice);
      
      const priceStr = newPrice.toFixed(2);
      const currentLastDigit = parseInt(priceStr.slice(-1));
      if (!isNaN(currentLastDigit)) {
        setLastDigit(currentLastDigit);
      }
      
      setMovementDirection(delta >= 0 ? 'up' : 'down');
      
      setDigitStats(prev => {
        return prev.map(stat => {
          let newPct = stat.pct + (Math.random() - 0.5) * 2;
          newPct = Math.max(5, Math.min(20, newPct));
          return {
            ...stat,
            pct: parseFloat(newPct.toFixed(1))
          };
        });
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [price]);

  const handleStakeChange = (e) => {
    const val = parseFloat(e.target.value);
    setStake(val < 0 || isNaN(val) ? '' : e.target.value);
  };

  const handleTargetProfitChange = (e) => {
    const val = parseFloat(e.target.value);
    setTargetProfit(val < 0 || isNaN(val) ? '' : e.target.value);
  };

  const handleStopLossChange = (e) => {
    const val = parseFloat(e.target.value);
    setStopLoss(val < 0 || isNaN(val) ? '' : e.target.value);
  };

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const payoutOver = 13.57;
  const payoutOverPct = 35.71;
  const payoutUnder = 47.50;
  const payoutUnderPct = 375.00;
  const payoutEven = 0.20;
  const payoutOdd = 0.20;
  const accumulatorPayout = 50.00;
  const accumulatorPayoutPct = 500.00;

  const handleTradeTypeSelect = (id) => {
    setTradeType(id);
    setIsDropdownOpen(false);
    setSelectedDigit(null);
    setSelectedBot(null);
    
    if (id === 'random') {
      const randomDigit = Math.floor(Math.random() * 10);
      setSelectedDigit(randomDigit);
    }
  };

  const handleDigitSelect = (digit) => {
    if (tradeMode === 'manual' && tradeType === 'overunder') {
      if (digit === 0 || digit === 9) {
        return;
      }
    }
    setSelectedDigit(selectedDigit === digit ? null : digit);
  };

  const isDigitDisabled = (digit) => {
    if (tradeMode === 'manual' && tradeType === 'overunder') {
      return digit === 0 || digit === 9;
    }
    return false;
  };

  const handleBotSelect = (botId) => {
    setSelectedBot(selectedBot === botId ? null : botId);
  };

  const handlePlaceTrade = (direction, digit) => {
    const tradeDigit = tradeType === 'random' ? selectedDigit : digit;
    console.log(`Trade placed: ${direction} ${tradeDigit} on ${tradeType}`);
    console.log(`Bulk Trading: ${bulkTrading ? `Opening ${bulkCount} trades` : 'Single trade'}`);
    console.log(`Duration: ${duration} ticks`);
    if (tradeMode !== 'manual') {
      console.log(`Martingale: ${martingale ? `Multiplier ${martingaleMultiplier}x` : 'Disabled'}`);
    }
    if (tradeType === 'accumulators') {
      console.log(`Growth Rate: ${growthRate}%`);
    }
  };

  const handleRunAuto = () => {
    console.log('Auto trading started');
    console.log(`Bulk Trading: ${bulkTrading ? `Opening ${bulkCount} trades` : 'Single trade'}`);
    console.log(`Duration: ${duration} ticks`);
    if (tradeMode !== 'manual') {
      console.log(`Martingale: ${martingale ? `Multiplier ${martingaleMultiplier}x` : 'Disabled'}`);
    }
    if (tradeType === 'accumulators') {
      console.log(`Growth Rate: ${growthRate}%`);
    }
  };

  const toggleMartingale = () => setMartingale(!martingale);
  const toggleBulkTrading = () => setBulkTrading(!bulkTrading);
  const toggleAI = () => {
    setIsAIOpen(!isAIOpen);
  };

  const handleMarketSelect = (market) => {
    setLocalSelectedMarket(market);
    setIsMarketDropdownOpen(false);
    if (onMarketChange) {
      onMarketChange(market);
    }
  };

  const toggleMarketDropdown = () => {
    setIsMarketDropdownOpen(!isMarketDropdownOpen);
  };

  const handleAIMarketSelect = (market) => {
    setAiMarket(market.symbol);
    setIsAIMarketDropdownOpen(false);
  };

  const toggleAIMarketDropdown = () => {
    setIsAIMarketDropdownOpen(!isAIMarketDropdownOpen);
  };

  const getSelectedAIMarket = () => {
    return VOLATILITY_MARKETS.find(m => m.symbol === aiMarket) || VOLATILITY_MARKETS[0];
  };

  const handleAITradeTypeSelect = (typeId) => {
    setAiTradeType(typeId);
    setIsAITradeTypeDropdownOpen(false);
  };

  const toggleAITradeTypeDropdown = () => {
    setIsAITradeTypeDropdownOpen(!isAITradeTypeDropdownOpen);
  };

  const getSelectedAITradeType = () => {
    return tradeTypes.find(t => t.id === aiTradeType) || tradeTypes[0];
  };

  const allPercentages = digitStats.map(s => s.pct);
  const maxPct = Math.max(...allPercentages);
  const minPct = Math.min(...allPercentages);

  const isPhone = window.innerWidth <= 768;

  const renderDropdownSelect = (options, value, onChange, isOpen, setIsOpen, formatValue = null) => (
    <DropdownSelect>
      <DropdownSelectButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {formatValue ? formatValue(value) : value}
        <span className="dropdown-arrow">▾</span>
      </DropdownSelectButton>
      <DropdownSelectMenu isOpen={isOpen}>
        {options.map((option) => (
          <DropdownSelectItem
            key={option}
            active={option === value}
            onClick={() => {
              onChange(option);
              setIsOpen(false);
            }}
          >
            {formatValue ? formatValue(option) : option}
          </DropdownSelectItem>
        ))}
      </DropdownSelectMenu>
    </DropdownSelect>
  );

  const renderMarketSelector = () => (
    <MarketSelectorWrapper>
      <MarketSelectorButton 
        isOpen={isMarketDropdownOpen}
        onClick={toggleMarketDropdown}
        color={selectedMarket.color}
      >
        <div className="left">
          <span className="market-dot" />
          <span className="market-name">{selectedMarket.name}</span>
        </div>
        <span className="arrow">▾</span>
      </MarketSelectorButton>
      
      <MarketDropdown isOpen={isMarketDropdownOpen}>
        {VOLATILITY_MARKETS.map((market) => (
          <MarketOption
            key={market.symbol}
            active={selectedMarket.symbol === market.symbol}
            color={market.color}
            onClick={() => handleMarketSelect(market)}
          >
            <div className="left">
              <span className="dot" />
              <span className="option-name">{market.name}</span>
            </div>
            <span className="check">✓</span>
          </MarketOption>
        ))}
      </MarketDropdown>
    </MarketSelectorWrapper>
  );

  const renderBulkTradingToggle = () => (
    <InputGroup>
      <InputLabel>
        <span>Bulk Trading</span>
        <span className="suffix">{bulkTrading ? `${bulkCount}t` : 'Off'}</span>
      </InputLabel>
      <ToggleWrapper>
        <ToggleLabel>Bulk</ToggleLabel>
        <ToggleTrack active={bulkTrading} onClick={toggleBulkTrading}>
          <div className="thumb" />
        </ToggleTrack>
        <ToggleStatus active={bulkTrading}>
          {bulkTrading ? 'ON' : 'OFF'}
        </ToggleStatus>
        {bulkTrading && renderDropdownSelect(
          bulkOptions,
          bulkCount,
          setBulkCount,
          isBulkDropdownOpen,
          setIsBulkDropdownOpen
        )}
      </ToggleWrapper>
    </InputGroup>
  );

  const renderMartingaleToggle = () => {
    if (tradeMode === 'manual') return null;
    
    return (
      <InputGroup>
        <InputLabel>
          <span>Martingale</span>
          <span className="suffix">{martingale ? `${martingaleMultiplier}x` : 'Off'}</span>
        </InputLabel>
        <ToggleWrapper>
          <ToggleLabel>Mult.</ToggleLabel>
          <ToggleTrack active={martingale} onClick={toggleMartingale}>
            <div className="thumb" />
          </ToggleTrack>
          <ToggleStatus active={martingale}>
            {martingale ? 'ON' : 'OFF'}
          </ToggleStatus>
          {martingale && renderDropdownSelect(
            martingaleOptions,
            martingaleMultiplier,
            setMartingaleMultiplier,
            isMartingaleDropdownOpen,
            setIsMartingaleDropdownOpen,
            (val) => `${val}x`
          )}
        </ToggleWrapper>
      </InputGroup>
    );
  };

  const renderDurationDropdown = () => {
    if (tradeMode !== 'manual') return null;
    if (tradeType === 'accumulators') return null;
    
    return (
      <InputGroup>
        <InputLabel>
          <span>Duration</span>
          <span className="suffix">Ticks</span>
        </InputLabel>
        <ToggleWrapper>
          <ToggleLabel>Ticks</ToggleLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'flex-end' }}>
            {renderDropdownSelect(
              durationOptions,
              duration,
              setDuration,
              isDurationDropdownOpen,
              setIsDurationDropdownOpen
            )}
          </div>
        </ToggleWrapper>
      </InputGroup>
    );
  };

  const renderGrowthRateDropdown = () => {
    if (tradeMode !== 'manual') return null;
    if (tradeType !== 'accumulators') return null;
    
    return (
      <InputGroup>
        <InputLabel>
          <span>Growth Rate</span>
          <span className="suffix">%</span>
        </InputLabel>
        <ToggleWrapper>
          <ToggleLabel>Rate</ToggleLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'flex-end' }}>
            {renderDropdownSelect(
              growthRateOptions,
              growthRate,
              setGrowthRate,
              isGrowthRateDropdownOpen,
              setIsGrowthRateDropdownOpen,
              (val) => `${val}%`
            )}
          </div>
        </ToggleWrapper>
      </InputGroup>
    );
  };

  const renderInputs = () => {
    const isManual = tradeMode === 'manual';
    
    return (
      <InputGrid>
        <div style={{ gridColumn: '1', gridRow: '1' }}>
          <InputGroup>
            <InputLabel>
              <span>Stake</span>
              <span className="suffix">Min: $0.50</span>
            </InputLabel>
            <InputRow>
              <span className="prefix">$</span>
              <StyledInput
                type="number"
                value={stake}
                onChange={handleStakeChange}
                step="0.50"
                min="0"
                placeholder="10"
              />
            </InputRow>
          </InputGroup>
        </div>

        <div style={{ gridColumn: '2', gridRow: '1' }}>
          {renderBulkTradingToggle()}
        </div>

        {isManual && tradeType !== 'accumulators' && (
          <div style={{ gridColumn: '1', gridRow: '2' }}>
            {renderDurationDropdown()}
          </div>
        )}

        {isManual && tradeType === 'accumulators' && (
          <div style={{ gridColumn: '1', gridRow: '2' }}>
            {renderGrowthRateDropdown()}
          </div>
        )}

        {!isManual && (
          <div style={{ gridColumn: '1', gridRow: '2' }}>
            <InputGroup>
              <InputLabel>
                <span>Target Profit</span>
                <span className="optional">Opt.</span>
              </InputLabel>
              <InputRow>
                <span className="prefix">$</span>
                <StyledInput
                  type="number"
                  value={targetProfit}
                  onChange={handleTargetProfitChange}
                  step="10"
                  min="0"
                  placeholder="200"
                />
              </InputRow>
            </InputGroup>
          </div>
        )}

        {!isManual && (
          <div style={{ gridColumn: '2', gridRow: '2' }}>
            {renderMartingaleToggle()}
          </div>
        )}

        {!isManual && (
          <div style={{ gridColumn: '1', gridRow: '3' }}>
            <InputGroup>
              <InputLabel>
                <span>Stop Loss</span>
                <span className="optional">Opt.</span>
              </InputLabel>
              <InputRow>
                <span className="prefix">$</span>
                <StyledInput
                  type="number"
                  value={stopLoss}
                  onChange={handleStopLossChange}
                  step="10"
                  min="0"
                  placeholder="999"
                />
              </InputRow>
            </InputGroup>
          </div>
        )}
      </InputGrid>
    );
  };

  const renderAIScanner = () => {
    const selectedAIMarket = getSelectedAIMarket();
    const selectedAITradeType = getSelectedAITradeType();

    return (
      <>
        <AIButtonContainer isMobile={isPhone}>
          <AIFloatingButton 
            onClick={toggleAI}
            isMobile={isPhone}
          >
            <span>AI</span>
            <span className="ai-label">Analyze</span>
          </AIFloatingButton>
        </AIButtonContainer>
        
        <AIAnalysisPanel isOpen={isAIOpen} isMobile={isPhone}>
          <AIAnalysisHeader isMobile={isPhone}>
            <div className="title">
              <span className="title-icon">AI</span>
              Market Scanner
            </div>
            <button className="close-btn" onClick={toggleAI}>✕</button>
          </AIAnalysisHeader>
          
          <AIScannerInputs>
            <AISelectWrapper>
              <span className="label">Select Market</span>
              <AIDropdown>
                <AIDropdownButton 
                  isOpen={isAIMarketDropdownOpen}
                  onClick={toggleAIMarketDropdown}
                  color={selectedAIMarket.color}
                >
                  <div className="left">
                    <span className="ai-dot" />
                    <span className="ai-selected-text">{selectedAIMarket.name}</span>
                  </div>
                  <span className="arrow">▾</span>
                </AIDropdownButton>
                
                <AIDropdownMenu isOpen={isAIMarketDropdownOpen}>
                  {VOLATILITY_MARKETS.map((market) => (
                    <AIDropdownItem
                      key={market.symbol}
                      active={aiMarket === market.symbol}
                      color={market.color}
                      onClick={() => handleAIMarketSelect(market)}
                    >
                      <div className="left">
                        <span className="ai-item-dot" />
                        <span className="ai-item-name">{market.name}</span>
                      </div>
                      <span className="ai-check">✓</span>
                    </AIDropdownItem>
                  ))}
                </AIDropdownMenu>
              </AIDropdown>
            </AISelectWrapper>
            
            <AISelectWrapper>
              <span className="label">Trade Type</span>
              <AITradeTypeDropdown>
                <AITradeTypeButton 
                  isOpen={isAITradeTypeDropdownOpen}
                  onClick={toggleAITradeTypeDropdown}
                >
                  <span className="ai-type-selected">{selectedAITradeType.label}</span>
                  <span className="arrow">▾</span>
                </AITradeTypeButton>
                
                <AITradeTypeMenu isOpen={isAITradeTypeDropdownOpen}>
                  {tradeTypes.map((type) => (
                    <AITradeTypeItem
                      key={type.id}
                      active={aiTradeType === type.id}
                      onClick={() => handleAITradeTypeSelect(type.id)}
                    >
                      <span className="ai-type-name">{type.label}</span>
                      <span className="ai-check">✓</span>
                    </AITradeTypeItem>
                  ))}
                </AITradeTypeMenu>
              </AITradeTypeDropdown>
            </AISelectWrapper>
            
            <AIScanButton disabled>
              <span className="scan-text">
                Scan Market
                <span className="coming-soon-badge">Coming Soon</span>
              </span>
            </AIScanButton>
          </AIScannerInputs>
        </AIAnalysisPanel>
      </>
    );
  };

  const renderDigitStats = () => (
    <DigitStatsContainer>
      {digitStats.map((stat) => {
        const isLastDigit = stat.digit === lastDigit;
        return (
          <DigitItem
            key={stat.digit}
            isLastDigit={isLastDigit}
            isMax={stat.pct === maxPct}
            isMin={stat.pct === minPct}
            direction={movementDirection}
          >
            <div className="circle-badge">
              <span className="digit-num">{stat.digit}</span>
              <span className="pct-text">{stat.pct}%</span>
            </div>
            <span className="active-arrow">▲</span>
          </DigitItem>
        );
      })}
    </DigitStatsContainer>
  );

  const renderDigitGrid = () => {
    if (tradeType === 'random' || tradeType === 'evenodd' || tradeType === 'accumulator') return null;
    
    return (
      <DigitGridWrapper>
        <DigitGridLabel>
          {tradeMode === 'manual' && tradeType === 'overunder' 
            ? 'Select a digit (1-8)' 
            : 'Select a digit'}
        </DigitGridLabel>
        <DigitGrid>
          {digits.map((digit) => {
            const disabled = isDigitDisabled(digit);
            return (
              <DigitButton
                key={digit}
                selected={selectedDigit === digit}
                disabled={disabled}
                onClick={() => handleDigitSelect(digit)}
              >
                {digit}
              </DigitButton>
            );
          })}
        </DigitGrid>
      </DigitGridWrapper>
    );
  };

  const renderAccumulatorButtons = () => {
    if (tradeType !== 'accumulators') return null;
    
    const isDisabled = !stake || parseFloat(stake) <= 0;
    
    return (
      <SingleTradeButtonWrapper>
        <SingleTradeButton 
          onClick={() => handlePlaceTrade('Buy', '')}
          disabled={isDisabled}
        >
          <div className="buy-content">
            <span className="buy-icon">📈</span>
            <span className="buy-text">Buy</span>
            <span className="buy-divider" />
            <span className="buy-payout">
              <span>Payout</span>
              <span className="payout-amount">${accumulatorPayout.toFixed(2)}</span>
              <span className="payout-pct">{accumulatorPayoutPct}%</span>
            </span>
            <span className="stake-info">${stake || 0}</span>
          </div>
        </SingleTradeButton>
      </SingleTradeButtonWrapper>
    );
  };

  const renderRunButton = (disabled = false) => (
    <RunButton onClick={handleRunAuto} disabled={disabled}>
      <span className="run-icon">▶</span> Run {tradeMode === 'use-bots' ? 'Bot' : 'Auto'}
    </RunButton>
  );

  const renderEvenOddButtons = () => {
    if (tradeType !== 'evenodd') return null;
    
    return (
      <EvenOddButtons>
        <EvenOddButton variant="even" onClick={() => handlePlaceTrade('Even', '')}>
          <span className="label">Even</span>
          <span className="payout">Payout ${payoutEven.toFixed(2)}</span>
          <span className="sub">${stake || 0} stake</span>
        </EvenOddButton>
        <EvenOddButton variant="odd" onClick={() => handlePlaceTrade('Odd', '')}>
          <span className="label">Odd</span>
          <span className="payout">Payout ${payoutOdd.toFixed(2)}</span>
          <span className="sub">${stake || 0} stake</span>
        </EvenOddButton>
      </EvenOddButtons>
    );
  };

  const renderTradeButtons = () => {
    if (tradeType === 'evenodd' || tradeType === 'random' || tradeType === 'accumulator') return null;
    if (selectedDigit === null) return null;

    const digit = selectedDigit;

    if (tradeType === 'overunder') {
      return (
        <TradeButtonsWrapper>
          <TradeButton variant="primary" onClick={() => handlePlaceTrade('Over', digit)}>
            <span className="label">Over {digit}</span>
            <span className="payout">${payoutOver.toFixed(2)} ({payoutOverPct}%)</span>
            <span className="sub">${stake || 0} stake</span>
          </TradeButton>
          <TradeButton variant="secondary" onClick={() => handlePlaceTrade('Under', digit)}>
            <span className="label">Under {digit}</span>
            <span className="payout">${payoutUnder.toFixed(2)} ({payoutUnderPct}%)</span>
            <span className="sub">${stake || 0} stake</span>
          </TradeButton>
        </TradeButtonsWrapper>
      );
    }

    if (tradeType === 'matches') {
      return (
        <TradeButtonsWrapper>
          <TradeButton variant="primary" onClick={() => handlePlaceTrade('Matches', digit)}>
            <span className="label">Matches {digit}</span>
            <span className="payout">Payout $0.00</span>
            <span className="sub">${stake || 0} stake</span>
          </TradeButton>
          <TradeButton variant="secondary" onClick={() => handlePlaceTrade('Differs', digit)}>
            <span className="label">Differs {digit}</span>
            <span className="payout">Payout $0.00</span>
            <span className="sub">${stake || 0} stake</span>
          </TradeButton>
        </TradeButtonsWrapper>
      );
    }

    return null;
  };

  const renderAIFloatingButton = () => {
    if (tradeMode !== 'manual') return null;
    return renderAIScanner();
  };

  return (
    <PanelContainer>
      <PhoneTwoColumnWrapper>
        {isPhone && renderMarketSelector()}

        <TradeTypeWrapper>
          <TradeTypeButton isOpen={isDropdownOpen} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="left">
              <span className="label">{getCurrentTrade().label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge">Active</span>
              <span className="arrow">▾</span>
            </div>
          </TradeTypeButton>
          <Dropdown isOpen={isDropdownOpen}>
            {tradeTypes.map((type) => (
              <DropdownOption
                key={type.id}
                active={tradeType === type.id}
                onClick={() => handleTradeTypeSelect(type.id)}
              >
                <span>{type.label}</span>
                <span className="check">✓</span>
              </DropdownOption>
            ))}
          </Dropdown>
        </TradeTypeWrapper>
      </PhoneTwoColumnWrapper>

      <TradeModeWrapper>
        <TradeModeLabel>
          <span>Execution Mode</span>
        </TradeModeLabel>
        <TradeModeButtons>
          <TradeModeButton 
            active={tradeMode === 'auto'} 
            onClick={() => {
              setTradeMode('auto');
              if (tradeType === 'random') {
                setTradeType('overunder');
                setSelectedDigit(null);
              }
            }}
          >
            <span className="mode-label">Auto</span>
            <span className="mode-shortcut">AI</span>
          </TradeModeButton>
          <TradeModeButton 
            active={tradeMode === 'manual'} 
            onClick={() => {
              setTradeMode('manual');
              if (tradeType === 'random') {
                setTradeType('overunder');
                setSelectedDigit(null);
              }
            }}
          >
            <span className="mode-label">Manual</span>
            <span className="mode-shortcut">Tap</span>
          </TradeModeButton>
          <TradeModeButton 
            active={tradeMode === 'use-bots'} 
            onClick={() => {
              setTradeMode('use-bots');
              if (tradeType === 'random') {
                setTradeType('overunder');
                setSelectedDigit(null);
              }
            }}
          >
            <span className="mode-label">Bots</span>
            <span className="mode-shortcut">AI+</span>
          </TradeModeButton>
        </TradeModeButtons>
      </TradeModeWrapper>

      {tradeMode === 'use-bots' && (
        <>
          <BotHeader>
            <div className="title">Select Your Bot</div>
            <div className="subtitle">
              <span className="highlight">print maziwa</span> — choose your weapon
            </div>
          </BotHeader>
          <BotGrid>
            {filteredBots.map((bot) => (
              <BotCard
                key={bot.id}
                selected={selectedBot === bot.id}
                onClick={() => handleBotSelect(bot.id)}
              >
                <div className="bot-name">{bot.name}</div>
                <div className="bot-type">{bot.type}</div>
                <span className="bot-badge">{bot.badge}</span>
              </BotCard>
            ))}
          </BotGrid>
          {selectedBot && (
            <div style={{
              fontSize: '9px', color: '#5a6070', textAlign: 'center',
              padding: '2px 0', animation: `${fadeIn} 0.3s ease`,
              borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '2px', paddingTop: '3px'
            }}>
              {filteredBots.find(b => b.id === selectedBot)?.name} ready
            </div>
          )}
        </>
      )}

      {renderInputs()}

      {tradeMode === 'manual' && isPhone && renderDigitStats()}

      {tradeMode === 'manual' && (tradeType === 'overunder' || tradeType === 'matches') && renderDigitGrid()}

      {tradeMode === 'manual' && tradeType === 'evenodd' && renderEvenOddButtons()}

      {tradeMode === 'manual' && renderAccumulatorButtons()}

      {tradeMode === 'manual' && tradeType !== 'evenodd' && tradeType !== 'accumulator' && renderTradeButtons()}

      {tradeMode === 'use-bots' ? (
        renderRunButton(!selectedBot)
      ) : tradeMode === 'auto' ? (
        renderRunButton(false)
      ) : null}

      <SessionInfo>
        <div className="left">
          <div className="label">Last Session</div>
          <div className="trades">
            <span className="wins">0W</span> / <span className="losses">5L</span> (5 trades)
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="pl-label">Session P/L</div>
          <div className="pl">-$310.00</div>
        </div>
      </SessionInfo>

      {renderAIFloatingButton()}
    </PanelContainer>
  );
};

export default RightPanel;