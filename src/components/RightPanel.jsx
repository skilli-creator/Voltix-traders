import React, { useState, useMemo, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// ALL VOLATILITY MARKETS (Deriv Official) - COPIED FROM CHARTPANEL
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

  /* Tablet */
  @media (max-width: 1024px) and (min-width: 769px) {
    width: 220px;
    min-width: 220px;
    padding: 10px 10px 6px 10px;
  }

  /* Phone */
  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: 100%;
    padding: 6px 8px 4px 8px;
    border-left: none;
    background: #0a0e17;
    gap: 4px;
  }

  @media (max-width: 480px) {
    padding: 4px 4px 2px 4px;
    gap: 3px;
  }
`;

// ============================================
// 1. MARKET SELECTOR (NEW - SYNCED WITH CHARTPANEL)
// ============================================

const MarketSelectorWrapper = styled.div`
  position: relative;
  animation: ${fadeIn} 0.3s ease;
  margin-bottom: 4px;

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
    gap: 8px;
    min-width: 0;
  }

  .market-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.color || '#2962ff'};
    flex-shrink: 0;
  }

  .market-name {
    font-size: 13px;
    font-weight: 600;
    color: #f1f5f9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .market-badge {
    font-size: 8px;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    color: #94a3b8;
    flex-shrink: 0;
  }

  .arrow {
    font-size: 10px;
    color: #5a6070;
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    .market-name { font-size: 12px; }
    .market-dot { width: 6px; height: 6px; }
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
  max-height: 200px;
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
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.color || '#2962ff'};
    flex-shrink: 0;
  }

  .name {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .badge-1s {
    font-size: 7px;
    font-weight: 700;
    color: #ffffff;
    background: #ff4444;
    padding: 1px 4px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .check {
    color: #2962ff;
    font-size: 14px;
    opacity: ${props => props.active ? 1 : 0};
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    .name { font-size: 11px; }
    .dot { width: 6px; height: 6px; }
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
  .icon { font-size: 16px; color: #2962ff; }
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
    .icon { font-size: 14px; }
    .badge { font-size: 6px; padding: 1px 4px; }
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    .label { font-size: 11px; }
    .icon { font-size: 12px; }
    gap: 3px;
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
    border-radius: 6px;
  }
`;

const DropdownOption = styled.div`
  padding: 10px 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between;
  color: ${props => props.active ? '#ffffff' : '#8a93a6'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.12)' : 'transparent'};
  font-size: 13px; transition: all 0.15s ease;

  &:hover { background: rgba(255, 255, 255, 0.04); color: #ffffff; }
  .check { color: #2962ff; font-size: 14px; opacity: ${props => props.active ? 1 : 0}; }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 11px;
  }
`;

// ============================================
// 3. TRADE MODE TOGGLE
// ============================================

const TradeModeWrapper = styled.div`
  display: flex; flex-direction: column; gap: 3px;
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 768px) {
    gap: 2px;
  }

  @media (max-width: 480px) {
    gap: 1px;
  }
`;

const TradeModeLabel = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  font-size: 9px; text-transform: uppercase; color: #5a6070;
  letter-spacing: 0.8px; font-weight: 600;
  .hint { font-size: 8px; color: #3a4055; text-transform: none; letter-spacing: 0; }

  @media (max-width: 768px) {
    font-size: 8px;
    .hint { font-size: 7px; }
  }

  @media (max-width: 480px) {
    font-size: 7px;
    .hint { font-size: 6px; }
  }
`;

const TradeModeButtons = styled.div`
  display: flex; gap: 3px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px; padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.04);

  @media (max-width: 768px) {
    padding: 2px;
    gap: 2px;
  }

  @media (max-width: 480px) {
    padding: 1px;
    gap: 2px;
  }
`;

const TradeModeButton = styled.button`
  flex: 1; padding: 6px 0; border: none; border-radius: 5px;
  background: ${props => props.active ? 'linear-gradient(135deg, #2962ff, #1a4fcf)' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#8a93a6'};
  font-size: 11px; font-weight: 600; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  ${props => props.active && `box-shadow: 0 4px 12px rgba(41, 98, 255, 0.3);`}
  &:hover { color: ${props => props.active ? '#ffffff' : '#d1d4dc'}; }
  .mode-icon { margin-right: 4px; }

  @media (max-width: 768px) {
    padding: 4px 0;
    font-size: 10px;
    .mode-icon { margin-right: 3px; font-size: 9px; }
  }

  @media (max-width: 480px) {
    padding: 3px 0;
    font-size: 9px;
    .mode-icon { margin-right: 2px; font-size: 8px; }
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

  .bot-icon { font-size: 18px; display: block; margin-bottom: 1px; }
  .bot-name { font-size: 10px; font-weight: 600; color: #d1d4dc; }
  .bot-type { font-size: 7px; text-transform: uppercase; color: #5a6070; margin-top: 1px; letter-spacing: 0.3px; }
  .bot-badge {
    font-size: 6px; text-transform: uppercase; padding: 1px 5px;
    border-radius: 4px; background: rgba(41, 98, 255, 0.15);
    color: #2962ff; display: inline-block; margin-top: 1px;
  }

  @media (max-width: 768px) {
    padding: 6px 4px;
    .bot-icon { font-size: 16px; }
    .bot-name { font-size: 9px; }
    .bot-type { font-size: 6px; }
    .bot-badge { font-size: 5px; padding: 1px 3px; }
  }

  @media (max-width: 480px) {
    padding: 4px 3px;
    .bot-icon { font-size: 14px; }
    .bot-name { font-size: 8px; }
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

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 2px;

  @media (max-width: 480px) {
    gap: 1px;
  }
`;

const InputLabel = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  font-size: 8px; text-transform: uppercase;
  color: #8a93a6;
  letter-spacing: 0.6px;
  font-weight: 700;

  .suffix { font-size: 7px; color: #4a4f5e; text-transform: none; letter-spacing: 0; font-weight: 400; }
  .optional {
    font-size: 6px; color: #4a4f5e; text-transform: none;
    background: rgba(255,255,255,0.04); padding: 0 5px; border-radius: 3px;
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
    .suffix { font-size: 5px; }
    .optional { font-size: 4px; padding: 0 2px; }
  }
`;

const InputRow = styled.div`
  display: flex; align-items: center; gap: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(26, 31, 46, 0.8);
  border-radius: 5px;
  transition: all 0.2s ease; overflow: hidden;

  &:focus-within { border-color: rgba(41, 98, 255, 0.6); box-shadow: 0 0 0 3px rgba(41, 98, 255, 0.08); }
  .prefix {
    padding: 4px 6px; font-size: 11px; font-weight: 600;
    color: #5a6070; background: rgba(255, 255, 255, 0.02);
    border-right: 1px solid rgba(26, 31, 46, 0.8);
  }

  @media (max-width: 768px) {
    border-radius: 4px;
    .prefix { padding: 3px 4px; font-size: 10px; }
  }

  @media (max-width: 480px) {
    border-radius: 3px;
    .prefix { padding: 2px 3px; font-size: 9px; }
  }
`;

const StyledInput = styled.input`
  flex: 1; padding: 4px 6px; background: transparent;
  border: none; color: #d1d4dc; font-size: 12px; font-weight: 500;
  outline: none; width: 100%; min-width: 0;

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none; margin: 0;
  }
  &[type="number"] { -moz-appearance: textfield; }
  &::placeholder { color: #3a4055; font-weight: 400; font-size: 11px; }

  @media (max-width: 768px) {
    padding: 3px 4px;
    font-size: 11px;
    &::placeholder { font-size: 10px; }
  }

  @media (max-width: 480px) {
    padding: 2px 3px;
    font-size: 10px;
    &::placeholder { font-size: 9px; }
  }
`;

// ============================================
// 6. MARTINGALE
// ============================================

const MartingaleLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 8px;
  text-transform: uppercase;
  color: #8a93a6;
  letter-spacing: 0.6px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 7px;
    gap: 3px;
  }

  @media (max-width: 480px) {
    font-size: 6px;
    gap: 2px;
  }
`;

const MartingaleToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(26, 31, 46, 0.8);
  border-radius: 5px;
  height: 28px;

  @media (max-width: 768px) {
    padding: 3px 6px;
    height: 24px;
    gap: 4px;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    padding: 2px 4px;
    height: 20px;
    gap: 3px;
    border-radius: 3px;
  }
`;

const ToggleTrack = styled.div`
  width: 32px;
  height: 18px;
  background: ${props => props.active ? 'linear-gradient(135deg, #2962ff, #1a4fcf)' : '#2a2e3d'};
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;

  &:hover { box-shadow: 0 0 12px rgba(41, 98, 255, 0.15); }
  .thumb {
    width: 14px; height: 14px; background: #ffffff;
    border-radius: 50%; position: absolute; top: 2px;
    left: ${props => props.active ? '16px' : '2px'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 26px;
    height: 15px;
    .thumb {
      width: 11px; height: 11px;
      left: ${props => props.active ? '13px' : '2px'};
      top: 2px;
    }
  }

  @media (max-width: 480px) {
    width: 22px;
    height: 12px;
    border-radius: 6px;
    .thumb {
      width: 8px; height: 8px;
      left: ${props => props.active ? '12px' : '2px'};
      top: 2px;
    }
  }
`;

const ToggleStatus = styled.span`
  font-size: 8px;
  color: ${props => props.active ? '#22c55e' : '#4a4f5e'};
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 7px;
  }

  @media (max-width: 480px) {
    font-size: 6px;
  }
`;

// ============================================
// 7. DIGIT STATS - EXACT MATCH FROM CHARTPANEL
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

  /* Only show on phone */
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
      width: 26px;
      height: 26px;
      border-width: 1.5px;
    }
  }

  .digit-num {
    font-size: 10px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;

    @media (max-width: 480px) {
      font-size: 9px;
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
      font-size: 6px;
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
      font-size: 6px;
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
  border: 1px solid ${props => props.selected ? 'rgba(41, 98, 255, 0.6)' : 'rgba(26, 31, 46, 0.8)'};
  border-radius: 5px;
  background: ${props => props.selected ? 'rgba(41, 98, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)'};
  color: ${props => props.selected ? '#2962ff' : '#8a93a6'};
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover { border-color: rgba(41, 98, 255, 0.5); color: #d1d4dc; transform: translateY(-1px); }
  ${props => props.selected && `box-shadow: 0 0 16px rgba(41, 98, 255, 0.15);`}
  &:disabled { opacity: 0.3; cursor: not-allowed; transform: none !important; }

  @media (max-width: 768px) {
    padding: 5px 0;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 3px 0;
    font-size: 11px;
  }
`;

// ============================================
// 9. EVEN/ODD BUTTONS
// ============================================

const EvenOddButtons = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const EvenOddButton = styled.button`
  padding: 10px 0; border: none; border-radius: 8px;
  background: ${props => props.variant === 'even'
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))'};
  border: 1px solid ${props => props.variant === 'even' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.variant === 'even' ? '#22c55e' : '#ef4444'};
  cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex; flex-direction: column; align-items: center; gap: 1px;

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
    padding: 6px 0;
    border-radius: 5px;
    .label { font-size: 11px; }
    .payout { font-size: 8px; }
    .sub { font-size: 7px; }
  }
`;

// ============================================
// 10. TRADE BUTTONS
// ============================================

const TradeButtonsWrapper = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const TradeButton = styled.button`
  padding: 10px 0; border: none; border-radius: 8px;
  background: ${props => props.variant === 'primary'
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))'};
  border: 1px solid ${props => props.variant === 'primary' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.variant === 'primary' ? '#22c55e' : '#ef4444'};
  cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex; flex-direction: column; align-items: center; gap: 1px;

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
    padding: 6px 0;
    border-radius: 5px;
    .label { font-size: 11px; }
    .payout { font-size: 8px; }
    .sub { font-size: 7px; }
  }
`;

// ============================================
// 11. RUN BUTTON
// ============================================

const RunButton = styled.button`
  width: 100%; padding: 10px 0; border: none; border-radius: 8px;
  background: linear-gradient(135deg, #2962ff, #1a4fcf);
  color: #ffffff; font-size: 13px; font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(41, 98, 255, 0.3);
  position: relative; overflow: hidden;
  animation: ${fadeIn} 0.5s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  flex-shrink: 0;

  &::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%;
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
    padding: 6px 0;
    font-size: 11px;
    border-radius: 5px;
    .run-icon { margin-right: 3px; font-size: 10px; }
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
    .trades { font-size: 9px; }
    .pl { font-size: 12px; padding: 2px 6px; }
    .pl-label { font-size: 6px; }
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
    icon: '🎯',
    badge: 'Precision',
  },
  {
    id: 'hunter',
    name: 'Digit Hunter',
    type: 'Matches/Differs',
    icon: '🔍',
    badge: 'Hunter',
  },
  {
    id: 'overload',
    name: 'Overload X',
    type: 'Over/Under',
    icon: '⚡',
    badge: 'Power',
  },
  {
    id: 'reversal',
    name: 'Reversal King',
    type: 'Over/Under',
    icon: '👑',
    badge: 'King',
  },
  {
    id: 'martingale',
    name: 'Martingale Beast',
    type: 'Even/Odd',
    icon: '🦁',
    badge: 'Beast',
  },
  {
    id: 'echo',
    name: 'Echo Trader',
    type: 'Even/Odd',
    icon: '🔄',
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
  const [stake, setStake] = useState('');
  const [targetProfit, setTargetProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  // === MARKET SELECTOR STATE ===
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [localSelectedMarket, setLocalSelectedMarket] = useState(VOLATILITY_MARKETS[0]);

  // Use external market if provided, otherwise use local
  const selectedMarket = externalMarket || localSelectedMarket;

  // === DIGIT STATS STATE ===
  const [digitStats, setDigitStats] = useState(Array(10).fill(0).map((_, i) => ({ digit: i, pct: 10 })));
  const [lastDigit, setLastDigit] = useState(5);
  const [movementDirection, setMovementDirection] = useState('down');
  const [price, setPrice] = useState(8459.65);

  const tradeTypes = [
    { id: 'overunder', label: 'Over/Under', icon: '📈' },
    { id: 'evenodd', label: 'Even/Odd', icon: '🔢' },
    { id: 'matches', label: 'Matches/Differs', icon: '🎯' },
  ];

  const getCurrentTrade = () => tradeTypes.find(t => t.id === tradeType) || tradeTypes[0];

  const filteredBots = useMemo(() => {
    return BOTS.filter(bot => bot.type === getCurrentTrade().label);
  }, [tradeType]);

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

  const handleTradeTypeSelect = (id) => {
    setTradeType(id);
    setIsDropdownOpen(false);
    setSelectedDigit(null);
    setSelectedBot(null);
  };

  const handleDigitSelect = (digit) => {
    setSelectedDigit(selectedDigit === digit ? null : digit);
  };

  const handleBotSelect = (botId) => {
    setSelectedBot(selectedBot === botId ? null : botId);
  };

  const handlePlaceTrade = (direction, digit) => {
    console.log(`Trade placed: ${direction} ${digit} on ${tradeType}`);
  };

  const handleRunAuto = () => {
    console.log('Auto trading started');
  };

  const toggleMartingale = () => setMartingale(!martingale);

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

  // === CALCULATE DIGIT STATS ===
  const allPercentages = digitStats.map(s => s.pct);
  const maxPct = Math.max(...allPercentages);
  const minPct = Math.min(...allPercentages);

  // Check if we're on phone view
  const isPhone = window.innerWidth <= 768;

  // ===== RENDER INPUTS =====
  const renderInputs = (showAdvanced = true) => (
    <>
      <InputGrid>
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

        {showAdvanced && (
          <>
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

            <InputGroup>
              <MartingaleLabel>
                <span className="icon">🔄</span>
                <span>Martingale</span>
              </MartingaleLabel>
              <MartingaleToggle>
                <ToggleTrack active={martingale} onClick={toggleMartingale}>
                  <div className="thumb" />
                </ToggleTrack>
                <ToggleStatus active={martingale}>
                  {martingale ? 'ON' : 'OFF'}
                </ToggleStatus>
              </MartingaleToggle>
            </InputGroup>
          </>
        )}
      </InputGrid>
    </>
  );

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
          <span className="market-name">{selectedMarket.display}</span>
          <span className="market-badge">{selectedMarket.isOneSec ? '1s' : ''}</span>
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
              <span className="name">{market.display}</span>
              {market.isOneSec && <span className="badge-1s">1s</span>}
            </div>
            <span className="check">✓</span>
          </MarketOption>
        ))}
      </MarketDropdown>
    </MarketSelectorWrapper>
  );

  // ===== RENDER DIGIT GRID =====
  const renderDigitGrid = () => (
    <DigitGridWrapper>
      <DigitGridLabel>Select a digit</DigitGridLabel>
      <DigitGrid>
        {digits.map((digit) => (
          <DigitButton
            key={digit}
            selected={selectedDigit === digit}
            onClick={() => handleDigitSelect(digit)}
          >
            {digit}
          </DigitButton>
        ))}
      </DigitGrid>
    </DigitGridWrapper>
  );

  // ===== RENDER RUN BUTTON =====
  const renderRunButton = (disabled = false) => (
    <RunButton onClick={handleRunAuto} disabled={disabled}>
      <span className="run-icon">▶</span> Run {tradeMode === 'use-bots' ? 'Bot' : 'Auto'}
    </RunButton>
  );

  // ===== RENDER EVEN/ODD BUTTONS =====
  const renderEvenOddButtons = () => (
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

  // ===== RENDER TRADE BUTTONS =====
  const renderTradeButtons = () => {
    if (selectedDigit === null) return null;

    const digit = selectedDigit;

    if (tradeType === 'overunder') {
      return (
        <TradeButtonsWrapper>
          <TradeButton variant="primary" onClick={() => handlePlaceTrade('Over', digit)}>
            <span className="label">📈 Over {digit}</span>
            <span className="payout">${payoutOver.toFixed(2)} ({payoutOverPct}%)</span>
            <span className="sub">${stake || 0} stake</span>
          </TradeButton>
          <TradeButton variant="secondary" onClick={() => handlePlaceTrade('Under', digit)}>
            <span className="label">📉 Under {digit}</span>
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
            <span className="label">🎯 Matches {digit}</span>
            <span className="payout">Payout $0.00</span>
            <span className="sub">${stake || 0} stake</span>
          </TradeButton>
          <TradeButton variant="secondary" onClick={() => handlePlaceTrade('Differs', digit)}>
            <span className="label">🎯 Differs {digit}</span>
            <span className="payout">Payout $0.00</span>
            <span className="sub">${stake || 0} stake</span>
          </TradeButton>
        </TradeButtonsWrapper>
      );
    }

    return null;
  };

  return (
    <PanelContainer>
      {/* 1. MARKET SELECTOR - ONLY ON PHONE */}
      {isPhone && renderMarketSelector()}

      {/* 2. TRADE TYPE SELECTOR */}
      <TradeTypeWrapper>
        <TradeTypeButton isOpen={isDropdownOpen} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="left">
            <span className="icon">{getCurrentTrade().icon}</span>
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
              <span>{type.icon} {type.label}</span>
              <span className="check">✓</span>
            </DropdownOption>
          ))}
        </Dropdown>
      </TradeTypeWrapper>

      {/* 3. TRADE MODE */}
      <TradeModeWrapper>
        <TradeModeLabel>
          <span>Trade Mode</span>
          <span className="hint">{tradeMode === 'auto' ? 'Auto' : tradeMode === 'manual' ? 'Manual' : 'Bot'}</span>
        </TradeModeLabel>
        <TradeModeButtons>
          <TradeModeButton active={tradeMode === 'auto'} onClick={() => setTradeMode('auto')}>
            <span className="mode-icon">⚡</span> Auto
          </TradeModeButton>
          <TradeModeButton active={tradeMode === 'manual'} onClick={() => setTradeMode('manual')}>
            <span className="mode-icon">👆</span> Manual
          </TradeModeButton>
          <TradeModeButton active={tradeMode === 'use-bots'} onClick={() => setTradeMode('use-bots')}>
            <span className="mode-icon">🤖</span> Bots
          </TradeModeButton>
        </TradeModeButtons>
      </TradeModeWrapper>

      {/* 4. BOT SELECTION */}
      {tradeMode === 'use-bots' && (
        <>
          <BotHeader>
            <div className="title">🤖 Select Your Bot</div>
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
                <span className="bot-icon">{bot.icon}</span>
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
              ✅ {filteredBots.find(b => b.id === selectedBot)?.name} ready
            </div>
          )}
        </>
      )}

      {/* 5. INPUTS */}
      {tradeMode === 'manual' ? renderInputs(false) : renderInputs(true)}

      {/* 6. DIGIT STATS - ONLY ON PHONE IN MANUAL MODE */}
      {tradeMode === 'manual' && isPhone && renderDigitStats()}

      {/* 7. DIGIT GRID */}
      {tradeMode === 'manual' && (tradeType === 'overunder' || tradeType === 'matches') && renderDigitGrid()}

      {/* 8. TRADE BUTTONS */}
      {tradeMode === 'manual' ? (
        tradeType === 'evenodd' ? renderEvenOddButtons() : renderTradeButtons()
      ) : tradeMode === 'use-bots' ? (
        renderRunButton(!selectedBot)
      ) : (
        renderRunButton(false)
      )}

      {/* 9. SESSION INFO (Bottom) */}
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
    </PanelContainer>
  );
};

export default RightPanel;