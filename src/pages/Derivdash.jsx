// src/pages/Derivdash.jsx (Swipeable Version with Sidebar + Fullscreen + Theme Switch)

import React, { useState, useRef, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import TopBar from '../components/TopBar';
import OptionSideBar from '../components/OptionSideBar';
import LeftPanel from '../components/LeftPanel';
import ChartPanel from '../components/ChartPanel';
import RightPanel from '../components/RightPanel';
import RiskCalculator from '../components/RiskCalculator';

// ===== THEME DEFINITIONS =====
const themes = {
  black: {
    name: 'Black',
    colors: {
      background: '#0a0f1f',
      backgroundSecondary: '#0f131a',
      backgroundTertiary: '#1a1f2f',
      text: '#f1f5f9',
      textSecondary: '#8a93a6',
      textMuted: '#5a6378',
      border: '#1e2a3a',
      accent: '#2962ff',
      accentHover: '#4a7aff',
      accentActive: 'rgba(41, 98, 255, 0.15)',
      card: '#141a2a',
      shadow: 'rgba(0, 0, 0, 0.3)',
      tabActive: 'rgba(41, 98, 255, 0.15)',
      scrollbar: '#2a2e3d',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      background: '#0d1117',
      backgroundSecondary: '#161b22',
      backgroundTertiary: '#1c2333',
      text: '#f0f6fc',
      textSecondary: '#8b949e',
      textMuted: '#484f58',
      border: '#30363d',
      accent: '#58a6ff',
      accentHover: '#79c0ff',
      accentActive: 'rgba(88, 166, 255, 0.15)',
      card: '#161b22',
      shadow: 'rgba(0, 0, 0, 0.4)',
      tabActive: 'rgba(88, 166, 255, 0.15)',
      scrollbar: '#21262d',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  darkBlue: {
    name: 'Dark Blue',
    colors: {
      background: '#0a1628',
      backgroundSecondary: '#0f1f3a',
      backgroundTertiary: '#162a4a',
      text: '#e8edf5',
      textSecondary: '#8899bb',
      textMuted: '#4a5a7a',
      border: '#1a2a4a',
      accent: '#4dabf7',
      accentHover: '#74c0fc',
      accentActive: 'rgba(77, 171, 247, 0.15)',
      card: '#0f1f3a',
      shadow: 'rgba(0, 10, 30, 0.5)',
      tabActive: 'rgba(77, 171, 247, 0.15)',
      scrollbar: '#1a2a4a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  midnight: {
    name: 'Midnight',
    colors: {
      background: '#0c0e1a',
      backgroundSecondary: '#13152a',
      backgroundTertiary: '#1a1d3a',
      text: '#e8e8ff',
      textSecondary: '#8a8ac0',
      textMuted: '#4a4a7a',
      border: '#1a1d3a',
      accent: '#7c7cf8',
      accentHover: '#9d9dfa',
      accentActive: 'rgba(124, 124, 248, 0.15)',
      card: '#13152a',
      shadow: 'rgba(0, 0, 20, 0.5)',
      tabActive: 'rgba(124, 124, 248, 0.15)',
      scrollbar: '#1a1d3a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  darkGreen: {
    name: 'Dark Green',
    colors: {
      background: '#0a1a0a',
      backgroundSecondary: '#0f2a0f',
      backgroundTertiary: '#1a3a1a',
      text: '#e8f5e8',
      textSecondary: '#8ab88a',
      textMuted: '#4a7a4a',
      border: '#1a3a1a',
      accent: '#48bb78',
      accentHover: '#68d391',
      accentActive: 'rgba(72, 187, 120, 0.15)',
      card: '#0f2a0f',
      shadow: 'rgba(0, 20, 0, 0.4)',
      tabActive: 'rgba(72, 187, 120, 0.15)',
      scrollbar: '#1a3a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  white: {
    name: 'White',
    colors: {
      background: '#f0f2f5',
      backgroundSecondary: '#ffffff',
      backgroundTertiary: '#f8f9fa',
      text: '#1a1a2e',
      textSecondary: '#4a4a5a',
      textMuted: '#8a8a9a',
      border: '#dce0e5',
      accent: '#2563eb',
      accentHover: '#3b82f6',
      accentActive: 'rgba(37, 99, 235, 0.1)',
      card: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.08)',
      tabActive: 'rgba(37, 99, 235, 0.1)',
      scrollbar: '#c8ced4',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  lightGray: {
    name: 'Light Gray',
    colors: {
      background: '#e8ecf0',
      backgroundSecondary: '#f5f7fa',
      backgroundTertiary: '#ffffff',
      text: '#1a1a2e',
      textSecondary: '#4a4a5a',
      textMuted: '#8a8a9a',
      border: '#d0d5dd',
      accent: '#4a6cf7',
      accentHover: '#6b8af8',
      accentActive: 'rgba(74, 108, 247, 0.1)',
      card: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.06)',
      tabActive: 'rgba(74, 108, 247, 0.1)',
      scrollbar: '#c8ced4',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  blue: {
    name: 'Blue',
    colors: {
      background: '#0c1a3a',
      backgroundSecondary: '#11244a',
      backgroundTertiary: '#1a305a',
      text: '#e8f0fe',
      textSecondary: '#8ab4f8',
      textMuted: '#5a8ab8',
      border: '#1a3a6a',
      accent: '#4fc3f7',
      accentHover: '#81d4fa',
      accentActive: 'rgba(79, 195, 247, 0.15)',
      card: '#162a52',
      shadow: 'rgba(0, 20, 60, 0.4)',
      tabActive: 'rgba(79, 195, 247, 0.15)',
      scrollbar: '#1a4a7a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      background: '#0a1a2e',
      backgroundSecondary: '#0f2740',
      backgroundTertiary: '#163552',
      text: '#e8f4f8',
      textSecondary: '#8ac4d8',
      textMuted: '#4a7a8a',
      border: '#1a3a52',
      accent: '#4dd0e1',
      accentHover: '#80deea',
      accentActive: 'rgba(77, 208, 225, 0.15)',
      card: '#0f2740',
      shadow: 'rgba(0, 20, 40, 0.4)',
      tabActive: 'rgba(77, 208, 225, 0.15)',
      scrollbar: '#1a4a5a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  purple: {
    name: 'Purple',
    colors: {
      background: '#1a0a2e',
      backgroundSecondary: '#221040',
      backgroundTertiary: '#2a1a52',
      text: '#f0e8f8',
      textSecondary: '#c8a8f0',
      textMuted: '#7a5a9a',
      border: '#2a1a4a',
      accent: '#b388ff',
      accentHover: '#ccb0ff',
      accentActive: 'rgba(179, 136, 255, 0.15)',
      card: '#221040',
      shadow: 'rgba(20, 0, 40, 0.4)',
      tabActive: 'rgba(179, 136, 255, 0.15)',
      scrollbar: '#2a1a4a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  pink: {
    name: 'Pink',
    colors: {
      background: '#2e0a1a',
      backgroundSecondary: '#401028',
      backgroundTertiary: '#521a35',
      text: '#f8e8f0',
      textSecondary: '#f0a8c8',
      textMuted: '#9a5a7a',
      border: '#4a1a30',
      accent: '#ff80ab',
      accentHover: '#ffa0c4',
      accentActive: 'rgba(255, 128, 171, 0.15)',
      card: '#401028',
      shadow: 'rgba(40, 0, 20, 0.4)',
      tabActive: 'rgba(255, 128, 171, 0.15)',
      scrollbar: '#4a1a30',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  red: {
    name: 'Red',
    colors: {
      background: '#1a0a0a',
      backgroundSecondary: '#2a1212',
      backgroundTertiary: '#3a1a1a',
      text: '#ffe8e8',
      textSecondary: '#e88a8a',
      textMuted: '#b85a5a',
      border: '#4a1a1a',
      accent: '#ff6b6b',
      accentHover: '#ff8a8a',
      accentActive: 'rgba(255, 107, 107, 0.15)',
      card: '#2a1212',
      shadow: 'rgba(30, 0, 0, 0.4)',
      tabActive: 'rgba(255, 107, 107, 0.15)',
      scrollbar: '#4a1a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  orange: {
    name: 'Orange',
    colors: {
      background: '#1a0f0a',
      backgroundSecondary: '#2a1810',
      backgroundTertiary: '#3a2218',
      text: '#f8f0e8',
      textSecondary: '#f0c8a8',
      textMuted: '#9a7a5a',
      border: '#4a2a1a',
      accent: '#ff8a50',
      accentHover: '#ffa070',
      accentActive: 'rgba(255, 138, 80, 0.15)',
      card: '#2a1810',
      shadow: 'rgba(30, 15, 0, 0.4)',
      tabActive: 'rgba(255, 138, 80, 0.15)',
      scrollbar: '#4a2a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  yellow: {
    name: 'Yellow',
    colors: {
      background: '#1a1a0a',
      backgroundSecondary: '#2a2a12',
      backgroundTertiary: '#3a3a1a',
      text: '#fff8e0',
      textSecondary: '#e8d88a',
      textMuted: '#b8a85a',
      border: '#4a4a1a',
      accent: '#ffd54f',
      accentHover: '#ffe082',
      accentActive: 'rgba(255, 213, 79, 0.15)',
      card: '#2a2a12',
      shadow: 'rgba(30, 30, 0, 0.4)',
      tabActive: 'rgba(255, 213, 79, 0.15)',
      scrollbar: '#4a4a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  gold: {
    name: 'Gold',
    colors: {
      background: '#1a150a',
      backgroundSecondary: '#2a2010',
      backgroundTertiary: '#3a2a18',
      text: '#f8f0e0',
      textSecondary: '#f0d888',
      textMuted: '#9a8a5a',
      border: '#4a3a1a',
      accent: '#ffd700',
      accentHover: '#ffe44d',
      accentActive: 'rgba(255, 215, 0, 0.15)',
      card: '#2a2010',
      shadow: 'rgba(30, 25, 0, 0.4)',
      tabActive: 'rgba(255, 215, 0, 0.15)',
      scrollbar: '#4a3a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  teal: {
    name: 'Teal',
    colors: {
      background: '#0a1a1a',
      backgroundSecondary: '#102a2a',
      backgroundTertiary: '#1a3a3a',
      text: '#e8f8f8',
      textSecondary: '#8ad8d8',
      textMuted: '#5a9a9a',
      border: '#1a4a4a',
      accent: '#4dd0b0',
      accentHover: '#80dec8',
      accentActive: 'rgba(77, 208, 176, 0.15)',
      card: '#102a2a',
      shadow: 'rgba(0, 30, 30, 0.4)',
      tabActive: 'rgba(77, 208, 176, 0.15)',
      scrollbar: '#1a4a4a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  violet: {
    name: 'Violet',
    colors: {
      background: '#100a1a',
      backgroundSecondary: '#1a102a',
      backgroundTertiary: '#2a1a3a',
      text: '#f0e8f8',
      textSecondary: '#c8a8e8',
      textMuted: '#7a5a9a',
      border: '#2a1a4a',
      accent: '#9b59b6',
      accentHover: '#b07cc6',
      accentActive: 'rgba(155, 89, 182, 0.15)',
      card: '#1a102a',
      shadow: 'rgba(20, 0, 30, 0.4)',
      tabActive: 'rgba(155, 89, 182, 0.15)',
      scrollbar: '#2a1a4a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  cosmic: {
    name: 'Cosmic',
    colors: {
      background: '#0a0818',
      backgroundSecondary: '#100c2a',
      backgroundTertiary: '#18103a',
      text: '#e8e0ff',
      textSecondary: '#b8a0f0',
      textMuted: '#6a5a9a',
      border: '#1a1040',
      accent: '#7c3aed',
      accentHover: '#9d6df2',
      accentActive: 'rgba(124, 58, 237, 0.15)',
      card: '#100c2a',
      shadow: 'rgba(10, 0, 30, 0.5)',
      tabActive: 'rgba(124, 58, 237, 0.15)',
      scrollbar: '#1a1040',
      success: '#22c55e',
      danger: '#ef4444',
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      background: '#0a120a',
      backgroundSecondary: '#101e10',
      backgroundTertiary: '#182a18',
      text: '#e8f0e8',
      textSecondary: '#90b890',
      textMuted: '#5a7a5a',
      border: '#1a2a1a',
      accent: '#52b788',
      accentHover: '#76c8a0',
      accentActive: 'rgba(82, 183, 136, 0.15)',
      card: '#101e10',
      shadow: 'rgba(0, 20, 0, 0.4)',
      tabActive: 'rgba(82, 183, 136, 0.15)',
      scrollbar: '#1a2a1a',
      success: '#22c55e',
      danger: '#ef4444',
    }
  }
};

// ===== STYLED COMPONENTS - ALL THEME BASED =====
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: ${props => props.isFullscreen ? '100dvh' : '100vh'};
  background: ${props => props.theme.colors.background};
  overflow: hidden;
  position: relative;
  width: 100%;
  transition: background 0.3s ease;
  font-weight: 700;
  
  ${props => props.isFullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  `}
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: ${props => props.isSidebarOpen && props.isDesktop ? '280px' : '0'};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const DesktopLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileLayout = styled.div`
  display: none;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const PanelsContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const PanelWrapper = styled.div`
  flex: 0 0 100%;
  height: 100%;
  overflow-y: auto;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-${props => props.index * 100}%);
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 2px;
  }
`;

const PanelContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MobileTabs = styled.div`
  display: flex;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-top: 2px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  padding: 4px 8px;
  gap: 4px;
  z-index: 10;
  font-weight: 700;

  @media (max-width: 480px) {
    padding: 3px 4px;
    gap: 2px;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 8px 4px;
  border: 2px solid transparent;
  background: ${props => props.active ? props.theme.colors.tabActive : 'transparent'};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
    transition: color 0.2s ease;
    
    svg {
      stroke: currentColor;
      transition: stroke 0.2s ease;
    }
  }

  .label {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
  }

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    border-color: ${props => props.active ? props.theme.colors.accent : 'transparent'};
    
    .icon {
      color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.text};
    }
  }

  @media (max-width: 480px) {
    padding: 6px 2px;
    .label {
      font-size: 7px;
    }
    .icon svg {
      width: 18px;
      height: 18px;
    }
  }
`;

// ===== FLOATING BUTTONS CONTAINER =====
const FloatingButtonsContainer = styled.div`
  position: fixed;
  bottom: ${props => props.isMobile ? '80px' : '24px'};
  right: ${props => props.isMobile ? '12px' : '24px'};
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  @media (max-width: 480px) {
    bottom: 72px;
    right: 10px;
    gap: 8px;
  }

  @media (min-width: 769px) {
    bottom: 24px;
    right: 24px;
    gap: 12px;
  }
`;

// ===== FULLSCREEN BUTTON =====
const FullscreenButton = styled.button`
  width: ${props => props.isMobile ? '44px' : '48px'};
  height: ${props => props.isMobile ? '44px' : '48px'};
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};
  position: relative;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    border-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.accent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: ${props => props.isMobile ? '18px' : '22px'};
    height: ${props => props.isMobile ? '18px' : '22px'};
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

// ===== THEME SWITCH BUTTON =====
const ThemeToggleButton = styled.button`
  width: ${props => props.isMobile ? '44px' : '48px'};
  height: ${props => props.isMobile ? '44px' : '48px'};
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.isMobile ? '18px' : '20px'};
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};
  position: relative;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    border-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.accent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

// ===== TOOLTIP =====
const Tooltip = styled.span`
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  letter-spacing: 0.3px;
  border: 2px solid ${props => props.theme.colors.border};
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  font-weight: 700;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid ${props => props.theme.colors.backgroundSecondary};
  }

  ${props => props.show && `
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) translateX(-4px);
  `}

  @media (max-width: 768px) {
    display: none;
  }
`;

// ===== THEME DROPDOWN =====
const ThemeDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 6px;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
  max-height: 360px;
  overflow-y: auto;
  box-shadow: 0 8px 32px ${props => props.theme.colors.shadow};
  animation: slideUp 0.2s ease;
  font-weight: 700;

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

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    min-width: 130px;
    right: -5px;
    max-height: 280px;
  }
`;

// ===== THEME OPTION =====
const ThemeOption = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? props.theme.colors.accentActive : 'transparent'};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: ${props => props.active ? '700' : '400'};
  width: 100%;
  text-align: left;

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};
  }

  .color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid ${props => props.theme.colors.border};
    flex-shrink: 0;
    transition: border-color 0.2s ease;
  }

  ${props => props.active && `
    .color-dot {
      border-color: ${props.theme.colors.accent};
    }
  `}

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 11px;
    
    .color-dot {
      width: 14px;
      height: 14px;
    }
  }
`;

// Professional SVG Icons
const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
  </svg>
);

const TradeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const PositionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const FullscreenEnterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const FullscreenExitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="10" y1="14" x2="3" y2="21" />
    <line x1="14" y1="10" x2="21" y2="3" />
  </svg>
);

const ThemeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const panels = [
  { id: 'chart', label: 'Chart', icon: <ChartIcon />, component: ChartPanel },
  { id: 'trade', label: 'Trade', icon: <TradeIcon />, component: RightPanel },
  { id: 'positions', label: 'Positions', icon: <PositionsIcon />, component: LeftPanel },
];

// Theme color map for dots
const themeColorMap = {
  black: '#0b0f1a',
  dark: '#111827',
  darkBlue: '#0f172a',
  midnight: '#0b132b',
  darkGreen: '#052e16',
  white: '#f9fafb',
  lightGray: '#e5e7eb',
  blue: '#1d4ed8',
  ocean: '#0369a1',
  purple: '#6d28d9',
  pink: '#db2777',
  red: '#dc2626',
  orange: '#ea580c',
  yellow: '#eab308',
  gold: '#d4af37',
  teal: '#0d9488',
  violet: '#7c3aed',
  cosmic: '#1e1b4b',
  forest: '#14532d',
};

// ============================================
// MAIN COMPONENT
// ============================================
const Derivdash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showRiskCalculator, setShowRiskCalculator] = useState(false); // ← ADD THIS
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null);
  const themeDropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsDesktop(!mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = document.fullscreenElement !== null;
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < panels.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const toggleThemeDropdown = () => {
    setIsThemeDropdownOpen(!isThemeDropdownOpen);
  };

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    setIsThemeDropdownOpen(false);
  };

  // Function to toggle RiskCalculator view
  const toggleRiskCalculator = () => {
    setShowRiskCalculator(!showRiskCalculator);
  };

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <DashboardContainer 
        ref={containerRef}
        isFullscreen={isFullscreen}
      >
        <TopBar 
          isSidebarOpen={isSidebarOpen} 
          onSidebarToggle={toggleSidebar} 
        />

        <OptionSideBar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />

        <MainContent isSidebarOpen={isSidebarOpen} isDesktop={isDesktop}>
          {showRiskCalculator ? (
            <RiskCalculator onBack={toggleRiskCalculator} />
          ) : (
            <>
              <DesktopLayout>
                <LeftPanel />
                <ChartPanel />
                <RightPanel />
              </DesktopLayout>

              <MobileLayout>
                <PanelsContainer
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {panels.map((panel, index) => {
                    const Component = panel.component;
                    return (
                      <PanelWrapper
                        key={panel.id}
                        index={activeIndex}
                        style={{
                          transform: `translateX(-${activeIndex * 100}%)`
                        }}
                      >
                        <PanelContent>
                          <Component />
                        </PanelContent>
                      </PanelWrapper>
                    );
                  })}
                </PanelsContainer>

                <MobileTabs>
                  {panels.map((panel, index) => (
                    <TabButton
                      key={panel.id}
                      active={activeIndex === index}
                      onClick={() => setActiveIndex(index)}
                    >
                      <span className="icon">{panel.icon}</span>
                      <span className="label">{panel.label}</span>
                    </TabButton>
                  ))}
                </MobileTabs>
              </MobileLayout>
            </>
          )}
        </MainContent>

        {/* Floating Buttons */}
        <FloatingButtonsContainer isMobile={isMobile}>
          <div ref={themeDropdownRef} style={{ position: 'relative' }}>
            <ThemeToggleButton
              onClick={toggleThemeDropdown}
              isMobile={isMobile}
              aria-label="Toggle Theme"
              onMouseEnter={() => setHoveredButton('theme')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <ThemeIcon />
              <Tooltip show={hoveredButton === 'theme' && !isMobile}>
                Change Theme
              </Tooltip>
            </ThemeToggleButton>

            <ThemeDropdown isOpen={isThemeDropdownOpen}>
              {Object.entries(themes).map(([key, theme]) => (
                <ThemeOption
                  key={key}
                  active={currentTheme === key}
                  onClick={() => changeTheme(key)}
                >
                  <span 
                    className="color-dot" 
                    style={{ background: themeColorMap[key] }}
                  />
                  {theme.name}
                </ThemeOption>
              ))}
            </ThemeDropdown>
          </div>

          <FullscreenButton 
            onClick={toggleFullscreen}
            isFullscreen={isFullscreen}
            isMobile={isMobile}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            onMouseEnter={() => setHoveredButton('fullscreen')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
            <Tooltip show={hoveredButton === 'fullscreen' && !isMobile}>
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </Tooltip>
          </FullscreenButton>
        </FloatingButtonsContainer>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Derivdash;