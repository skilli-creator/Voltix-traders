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
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(41, 98, 255, 0.15); }
  50% { box-shadow: 0 0 40px rgba(41, 98, 255, 0.3); }
`;

const floatPulse = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const PanelContainer = styled.div`
  width: 290px;
  min-width: 290px;
  background: linear-gradient(180deg, #0b0e14 0%, #0f131a 100%);
  border-left: 1px solid rgba(26, 31, 46, 0.8);
  padding: 14px 14px 10px 14px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
  overflow-y: auto;
  gap: 8px;
  position: relative;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #2a2e3d;
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
    background: #0a0e17;
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(41, 98, 255, 0.3);
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
    background: ${props => props.color || '#2962ff'};
    flex-shrink: 0;
  }

  .market-name {
    font-size: 12px;
    font-weight: 600;
    color: #f1f5f9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .arrow {
    font-size: 10px;
    color: #5a6070;
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
  background: rgba(21, 26, 38, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  max-height: 260px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const MarketOption = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.08)' : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
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
    background: ${props => props.color || '#2962ff'};
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
    color: #2962ff;
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  border: 1px solid ${props => props.isOpen ? 'rgba(41, 98, 255, 0.6)' : 'rgba(26, 31, 46, 0.8)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &:hover {
    border-color: rgba(41, 98, 255, 0.6);
    background: rgba(41, 98, 255, 0.06);
  }

  .left { display: flex; align-items: center; gap: 10px; }
  .label { font-size: 14px; font-weight: 500; color: #d1d4dc; letter-spacing: 0.2px; }
  .arrow {
    font-size: 12px; color: #5a6070;
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
  .badge {
    font-size: 7px; text-transform: uppercase; padding: 2px 6px;
    border-radius: 8px; background: rgba(41, 98, 255, 0.15);
    color: #2962ff; font-weight: 600; letter-spacing: 0.5px;
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
  background: rgba(21, 26, 38, 0.98); border: 1px solid rgba(26, 31, 46, 0.8);
  border-radius: 8px; overflow: hidden; z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
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
  color: ${props => props.active ? '#ffffff' : '#8a93a6'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.12)' : 'transparent'};
  font-size: 13px;
  transition: all 0.15s ease;

  &:hover { background: rgba(255, 255, 255, 0.04); color: #ffffff; }
  .check { color: #2962ff; font-size: 14px; opacity: ${props => props.active ? 1 : 0}; }

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
// 3. TRADE MODE TOGGLE - PREMIUM DESIGN (BLUE INDICATOR REMOVED)
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
  color: #64748b;
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
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.04);
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
  background: ${props => props.active ? 'linear-gradient(135deg, #2962ff, #1a4fcf)' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#8a93a6'};
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
    box-shadow: 0 4px 16px rgba(41, 98, 255, 0.35);
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
    color: ${props => props.active ? '#ffffff' : '#d1d4dc'};
    background: ${props => props.active ? 'linear-gradient(135deg, #2962ff, #1a4fcf)' : 'rgba(255,255,255,0.04)'};
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
// 4. BOT SELECTION
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
  background: ${props => props.selected ? 'rgba(41, 98, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.selected ? 'rgba(41, 98, 255, 0.5)' : 'rgba(26, 31, 46, 0.8)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  backdrop-filter: blur(10px);

  &:hover {
    border-color: rgba(41, 98, 255, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  ${props => props.selected && `
    border-color: #2962ff;
    box-shadow: 0 0 20px rgba(41, 98, 255, 0.15);
    animation: ${pulseGlow} 2s ease-in-out infinite;
  `}

  .bot-name { font-size: 10px; font-weight: 600; color: #d1d4dc; }
  .bot-type { font-size: 7px; text-transform: uppercase; color: #5a6070; margin-top: 1px; letter-spacing: 0.3px; }
  .bot-badge {
    font-size: 6px; text-transform: uppercase; padding: 1px 5px;
    border-radius: 4px; background: rgba(41, 98, 255, 0.15);
    color: #2962ff; display: inline-block; margin-top: 1px;
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

  .title { font-size: 12px; font-weight: 500; color: #d1d4dc; }
  .subtitle {
    font-size: 10px; color: #5a6070; margin-top: 1px;
    .highlight { color: #2962ff; font-weight: 600; }
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
// 5. INPUT FIELDS
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
  color: #8a93a6;
  letter-spacing: 0.6px;
  font-weight: 700;

  .suffix { 
    font-size: 7px; 
    color: #4a4f5e; 
    text-transform: none; 
    letter-spacing: 0; 
    font-weight: 400; 
  }
  .optional {
    font-size: 6px; 
    color: #4a4f5e; 
    text-transform: none;
    background: rgba(255,255,255,0.04); 
    padding: 0 5px; 
    border-radius: 3px;
    border: 1px solid rgba(255,255,255,0.04);
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(26, 31, 46, 0.8);
  border-radius: 5px;
  transition: all 0.2s ease;
  overflow: hidden;

  &:focus-within { 
    border-color: rgba(41, 98, 255, 0.6); 
    box-shadow: 0 0 0 3px rgba(41, 98, 255, 0.08); 
  }
  
  .prefix {
    padding: 4px 6px;
    font-size: 11px;
    font-weight: 600;
    color: #5a6070;
    background: rgba(255, 255, 255, 0.02);
    border-right: 1px solid rgba(26, 31, 46, 0.8);
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
  color: #d1d4dc;
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
    color: #3a4055;
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

// ===== TOGGLE COMPONENTS (Compact) =====
const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(26, 31, 46, 0.8);
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
  color: #8a93a6;
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
  background: ${props => props.active ? 'linear-gradient(135deg, #2962ff, #1a4fcf)' : '#2a2e3d'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;

  &:hover { box-shadow: 0 0 12px rgba(41, 98, 255, 0.15); }
  
  .thumb {
    width: 12px;
    height: 12px;
    background: #ffffff;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '14px' : '2px'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
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
  color: ${props => props.active ? '#22c55e' : '#4a4f5e'};
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

// ===== DROPDOWN SELECT (Compact) =====
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
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 10px;
  font-weight: 600;
  color: #f1f5f9;
  height: 22px;
  min-width: 32px;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(41, 98, 255, 0.3);
  }

  .dropdown-arrow {
    font-size: 7px;
    color: #5a6070;
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
  background: rgba(21, 26, 38, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.15s ease;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  max-height: 150px;
  overflow-y: auto;
  min-width: 44px;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
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
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.08)' : 'transparent'};
  transition: all 0.15s ease;
  text-align: center;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
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
// 6. AI ANALYSIS - PREMIUM PROFESSIONAL DESIGN WITH REDESIGNED DROPDOWNS
// ============================================

const AIFloatingButton = styled.button`
  position: fixed;
  bottom: 90px;
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #2962ff, #818cf8);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(41, 98, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  animation: ${floatPulse} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.1) translateY(-4px);
    box-shadow: 0 8px 40px rgba(41, 98, 255, 0.4);
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
  background: rgba(8, 18, 38, 0.96);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(56, 189, 248, 0.08);
  border-radius: 16px;
  padding: 18px 20px;
  z-index: 51;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
  animation: ${fadeIn} 0.3s ease;
  display: ${props => props.isOpen ? 'block' : 'none'};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
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
  border-bottom: 1px solid rgba(56, 189, 248, 0.06);

  .title {
    font-size: 13px;
    font-weight: 700;
    color: #f1f5f9;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.3px;
  }

  .title-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #2962ff, #818cf8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.04);
    color: #64748b;
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
      background: rgba(255, 255, 255, 0.08);
      color: #f1f5f9;
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
    color: #94a3b8;
    font-weight: 600;
    letter-spacing: 0.6px;
  }
`;

// ===== REDESIGNED AI DROPDOWN SELECTOR =====
const AIDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const AIDropdownButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(41, 98, 255, 0.3);
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
    background: ${props => props.color || '#2962ff'};
    flex-shrink: 0;
  }

  .ai-selected-text {
    font-size: 12px;
    font-weight: 500;
    color: #f1f5f9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .arrow {
    font-size: 10px;
    color: #5a6070;
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
  background: rgba(21, 26, 38, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
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
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.08)' : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
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
    background: ${props => props.color || '#2962ff'};
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
    color: #2962ff;
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

// ===== AI Trade Type Dropdown =====
const AITradeTypeDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const AITradeTypeButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(41, 98, 255, 0.3);
  }

  .ai-type-selected {
    font-size: 12px;
    font-weight: 500;
    color: #f1f5f9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow {
    font-size: 10px;
    color: #5a6070;
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
  background: rgba(21, 26, 38, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.2s ease;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  max-height: 150px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
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
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.08)' : 'transparent'};
  transition: all 0.15s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
  }

  .ai-type-name {
    font-size: 12px;
    font-weight: 500;
  }

  .ai-check {
    color: #2962ff;
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
  background: linear-gradient(135deg, #1a2a4a, #0d1b2a);
  border: 1px solid rgba(56, 189, 248, 0.08);
  color: #64748b;
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
    background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.1), transparent);
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
    background: rgba(56, 189, 248, 0.08);
    color: #38bdf8;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 8px 0;
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
    background: rgba(20, 28, 43, 0.95);
    border: 1.5px solid ${props => 
      props.isLastDigit 
        ? (props.direction === 'up' ? '#00e676' : '#ff4a4a') 
        : 'rgba(255, 255, 255, 0.08)'
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
    color: #ffffff;
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
        : (props.isMin ? '#ff4a4a' : '#728096')
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
// 8. DIGIT GRID - WITH RESTRICTION (1-8 only for Over/Under in Manual mode)
// ============================================

const DigitGridWrapper = styled.div`
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 480px) {
    margin: 1px 0;
  }
`;

const DigitGridLabel = styled.div`
  font-size: 9px; text-transform: uppercase;
  color: #8a93a6;
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
    if (props.disabled) return 'rgba(255, 255, 255, 0.02)';
    return props.selected ? 'rgba(41, 98, 255, 0.6)' : 'rgba(26, 31, 46, 0.8)';
  }};
  border-radius: 5px;
  background: ${props => {
    if (props.disabled) return 'rgba(255, 255, 255, 0.01)';
    return props.selected ? 'rgba(41, 98, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)';
  }};
  color: ${props => {
    if (props.disabled) return '#4a4f5e';
    return props.selected ? '#2962ff' : '#8a93a6';
  }};
  font-size: 13px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.disabled ? 0.4 : 1};

  &:hover {
    border-color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.02)' : 'rgba(41, 98, 255, 0.5)'};
    color: ${props => props.disabled ? '#4a4f5e' : '#d1d4dc'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
  }
  
  ${props => props.selected && !props.disabled && `
    box-shadow: 0 0 16px rgba(41, 98, 255, 0.15);
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
// 9. EVEN/ODD BUTTONS
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
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))'};
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
// 10. TRADE BUTTONS
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
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))'};
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
// 11. RUN BUTTON
// ============================================

const RunButton = styled.button`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #2962ff, #1a4fcf);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(41, 98, 255, 0.3);
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
    box-shadow: ${props => props.disabled ? '0 4px 16px rgba(41, 98, 255, 0.3)' : '0 8px 28px rgba(41, 98, 255, 0.4)'};
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
// 12. SESSION INFO (Bottom)
// ============================================

const SessionInfo = styled.div`
  padding-top: 10px;
  border-top: 1px solid rgba(26, 31, 46, 0.6);
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
    color: #5a6070;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .trades {
    font-size: 11px;
    color: #8a93a6;
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
    color: #5a6070;
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

  // Duration dropdown state
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);

  // AI Analysis state
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMarket, setAiMarket] = useState(VOLATILITY_MARKETS[0].symbol);
  const [aiTradeType, setAiTradeType] = useState('overunder');

  // AI Dropdown states
  const [isAIMarketDropdownOpen, setIsAIMarketDropdownOpen] = useState(false);
  const [isAITradeTypeDropdownOpen, setIsAITradeTypeDropdownOpen] = useState(false);

  // Dropdown states
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
  const [isMartingaleDropdownOpen, setIsMartingaleDropdownOpen] = useState(false);

  // === MARKET SELECTOR STATE ===
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [localSelectedMarket, setLocalSelectedMarket] = useState(VOLATILITY_MARKETS[0]);

  const selectedMarket = externalMarket || localSelectedMarket;

  // === DIGIT STATS STATE ===
  const [digitStats, setDigitStats] = useState(Array(10).fill(0).map((_, i) => ({ digit: i, pct: 10 })));
  const [lastDigit, setLastDigit] = useState(5);
  const [movementDirection, setMovementDirection] = useState('down');
  const [price, setPrice] = useState(8459.65);

  // ============================================
  // TRADE TYPES WITH ACCUMULATORS
  // ============================================
  const getTradeTypes = () => {
    const baseTypes = [
      { id: 'overunder', label: 'Over/Under' },
      { id: 'evenodd', label: 'Even/Odd' },
      { id: 'matches', label: 'Matches/Differs' },
      { id: 'accumulator', label: 'Accumulator' }, // Added Accumulator
    ];
    
    // Add Random only in Auto mode
    if (tradeMode === 'auto') {
      return [...baseTypes, { id: 'random', label: 'Random' }];
    }
    
    return baseTypes;
  };

  const tradeTypes = getTradeTypes();

  const getCurrentTrade = () => tradeTypes.find(t => t.id === tradeType) || tradeTypes[0];

  const filteredBots = useMemo(() => {
    // For Accumulator, show specific bots or all bots
    if (tradeType === 'accumulator') {
      return BOTS; // Show all bots for accumulator
    }
    return BOTS.filter(bot => bot.type === getCurrentTrade().label);
  }, [tradeType]);

  // Bulk count options (2-20)
  const bulkOptions = Array.from({ length: 19 }, (_, i) => i + 2);

  // Martingale multiplier options
  const martingaleOptions = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

  // Duration options (1-10)
  const durationOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // === DIGIT STATS LOGIC ===
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
    
    // If Random is selected, auto-select a random digit
    if (id === 'random') {
      const randomDigit = Math.floor(Math.random() * 10);
      setSelectedDigit(randomDigit);
    }
  };

  const handleDigitSelect = (digit) => {
    // In Manual mode with Over/Under, only allow digits 1-8
    if (tradeMode === 'manual' && tradeType === 'overunder') {
      if (digit === 0 || digit === 9) {
        return; // Do nothing for 0 and 9
      }
    }
    setSelectedDigit(selectedDigit === digit ? null : digit);
  };

  // Check if a digit should be disabled
  const isDigitDisabled = (digit) => {
    // In Manual mode with Over/Under, disable 0 and 9
    if (tradeMode === 'manual' && tradeType === 'overunder') {
      return digit === 0 || digit === 9;
    }
    return false;
  };

  const handleBotSelect = (botId) => {
    setSelectedBot(selectedBot === botId ? null : botId);
  };

  const handlePlaceTrade = (direction, digit) => {
    // If trade type is Random, use the random digit
    const tradeDigit = tradeType === 'random' ? selectedDigit : digit;
    console.log(`Trade placed: ${direction} ${tradeDigit} on ${tradeType}`);
    console.log(`Bulk Trading: ${bulkTrading ? `Opening ${bulkCount} trades` : 'Single trade'}`);
    console.log(`Duration: ${duration} ticks`);
    if (tradeMode !== 'manual') {
      console.log(`Martingale: ${martingale ? `Multiplier ${martingaleMultiplier}x` : 'Disabled'}`);
    }
  };

  const handleRunAuto = () => {
    console.log('Auto trading started');
    console.log(`Bulk Trading: ${bulkTrading ? `Opening ${bulkCount} trades` : 'Single trade'}`);
    console.log(`Duration: ${duration} ticks`);
    if (tradeMode !== 'manual') {
      console.log(`Martingale: ${martingale ? `Multiplier ${martingaleMultiplier}x` : 'Disabled'}`);
    }
  };

  const toggleMartingale = () => setMartingale(!martingale);
  const toggleBulkTrading = () => setBulkTrading(!bulkTrading);
  const toggleAI = () => {
    setIsAIOpen(!isAIOpen);
  };

  // === MARKET SELECTOR HANDLERS ===
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

  // === AI MARKET SELECTOR HANDLERS ===
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

  // === AI TRADE TYPE HANDLERS ===
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

  // === CALCULATE DIGIT STATS ===
  const allPercentages = digitStats.map(s => s.pct);
  const maxPct = Math.max(...allPercentages);
  const minPct = Math.min(...allPercentages);

  const isPhone = window.innerWidth <= 768;

  // ===== RENDER DROPDOWN SELECT =====
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

  // ===== RENDER MARKET SELECTOR =====
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

  // ===== RENDER COMPACT TOGGLES =====
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

  // ===== RENDER DURATION DROPDOWN (Manual Mode Only) =====
  const renderDurationDropdown = () => {
    if (tradeMode !== 'manual') return null;
    
    return (
      <InputGroup>
        <InputLabel>
          <span>Duration</span>
          <span className="suffix">Ticks</span>
        </InputLabel>
        <ToggleWrapper>
          <ToggleLabel>Ticks</ToggleLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'flex-end' }}>
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

  // ===== RENDER INPUTS - EXACT LAYOUT =====
  const renderInputs = () => {
    const isManual = tradeMode === 'manual';
    
    return (
      <InputGrid>
        {/* Row 1, Column 1: STAKE */}
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

        {/* Row 1, Column 2: BULK TRADING */}
        <div style={{ gridColumn: '2', gridRow: '1' }}>
          {renderBulkTradingToggle()}
        </div>

        {/* Row 2, Column 1: TARGET PROFIT - Auto & Bots only */}
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

        {/* Row 2, Column 2: MARTINGALE - Auto & Bots only */}
        {!isManual && (
          <div style={{ gridColumn: '2', gridRow: '2' }}>
            {renderMartingaleToggle()}
          </div>
        )}

        {/* Row 3, Column 1: STOP LOSS - Auto & Bots only */}
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

  // ===== RENDER AI MARKET SCANNER =====
  const renderAIScanner = () => {
    const selectedAIMarket = getSelectedAIMarket();
    const selectedAITradeType = getSelectedAITradeType();

    return (
      <>
        <AIFloatingButton onClick={toggleAI}>
          <span>AI</span>
          <span className="ai-label">Analyze</span>
        </AIFloatingButton>
        
        <AIAnalysisPanel isOpen={isAIOpen}>
          <AIAnalysisHeader>
            <div className="title">
              <span className="title-icon">AI</span>
              Market Scanner
            </div>
            <button className="close-btn" onClick={toggleAI}>✕</button>
          </AIAnalysisHeader>
          
          <AIScannerInputs>
            {/* AI Market Select - Premium Dropdown */}
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
            
            {/* AI Trade Type - Premium Dropdown */}
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

  // ===== RENDER DIGIT STATS =====
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

  // ===== RENDER DIGIT GRID - WITH 1-8 RESTRICTION =====
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

  // ===== RENDER ACCUMULATOR BUTTONS =====
  const renderAccumulatorButtons = () => {
    if (tradeType !== 'accumulator') return null;
    
    return (
      <TradeButtonsWrapper>
        <TradeButton variant="primary" onClick={() => handlePlaceTrade('Up', '')}>
          <span className="label">Up</span>
          <span className="payout">${accumulatorPayout.toFixed(2)} ({accumulatorPayoutPct}%)</span>
          <span className="sub">${stake || 0} stake</span>
        </TradeButton>
        <TradeButton variant="secondary" onClick={() => handlePlaceTrade('Down', '')}>
          <span className="label">Down</span>
          <span className="payout">${accumulatorPayout.toFixed(2)} ({accumulatorPayoutPct}%)</span>
          <span className="sub">${stake || 0} stake</span>
        </TradeButton>
      </TradeButtonsWrapper>
    );
  };

  // ===== RENDER RUN BUTTON =====
  const renderRunButton = (disabled = false) => (
    <RunButton onClick={handleRunAuto} disabled={disabled}>
      <span className="run-icon">▶</span> Run {tradeMode === 'use-bots' ? 'Bot' : 'Auto'}
    </RunButton>
  );

  // ===== RENDER EVEN/ODD BUTTONS =====
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

  // ===== RENDER TRADE BUTTONS =====
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

  // ===== RENDER AI FLOATING BUTTON (Manual Mode Only - All Devices) =====
  const renderAIFloatingButton = () => {
    if (tradeMode !== 'manual') return null;
    return renderAIScanner();
  };

  return (
    <PanelContainer>
      {/* PHONE TWO-COLUMN WRAPPER - Market & Trade Type side by side on phone only */}
      <PhoneTwoColumnWrapper>
        {/* 1. MARKET SELECTOR - ONLY ON PHONE */}
        {isPhone && renderMarketSelector()}

        {/* 2. TRADE TYPE SELECTOR */}
        <TradeTypeWrapper>
          <TradeTypeButton isOpen={isDropdownOpen} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="left">
              <span className="label">{getCurrentTrade().label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

      {/* 3. TRADE MODE - PREMIUM DESIGN (BLUE INDICATOR REMOVED) */}
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

      {/* 4. BOT SELECTION */}
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
              fontSize: '10px', color: '#5a6070', textAlign: 'center',
              padding: '2px 0', animation: `${fadeIn} 0.3s ease`,
              borderTop: '1px solid rgba(26, 31, 46, 0.6)', marginTop: '3px', paddingTop: '4px'
            }}>
              {filteredBots.find(b => b.id === selectedBot)?.name} ready
            </div>
          )}
        </>
      )}

      {/* 5. INPUTS - EXACT LAYOUT */}
      {renderInputs()}

      {/* 6. DIGIT STATS - ONLY ON PHONE IN MANUAL MODE */}
      {tradeMode === 'manual' && isPhone && renderDigitStats()}

      {/* 7. DIGIT GRID - WITH 1-8 RESTRICTION */}
      {tradeMode === 'manual' && (tradeType === 'overunder' || tradeType === 'matches') && renderDigitGrid()}

      {/* 8. EVEN/ODD BUTTONS */}
      {tradeMode === 'manual' && tradeType === 'evenodd' && renderEvenOddButtons()}

      {/* 9. ACCUMULATOR BUTTONS */}
      {tradeMode === 'manual' && renderAccumulatorButtons()}

      {/* 10. TRADE BUTTONS */}
      {tradeMode === 'manual' && tradeType !== 'evenodd' && tradeType !== 'accumulator' && renderTradeButtons()}

      {/* 11. RUN BUTTON - Auto & Bots modes */}
      {tradeMode === 'use-bots' ? (
        renderRunButton(!selectedBot)
      ) : tradeMode === 'auto' ? (
        renderRunButton(false)
      ) : null}

      {/* 12. SESSION INFO (Bottom) */}
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

      {/* 13. AI FLOATING BUTTON - MANUAL MODE ONLY (All Devices) */}
      {renderAIFloatingButton()}
    </PanelContainer>
  );
};

export default RightPanel;