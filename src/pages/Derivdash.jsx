// src/pages/Derivdash.jsx (Swipeable Version with Sidebar + Fullscreen)

import React, { useState, useRef, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import TopBar from '../components/TopBar';
import OptionSideBar from '../components/OptionSideBar';
import LeftPanel from '../components/LeftPanel';
import ChartPanel from '../components/ChartPanel';
import RightPanel from '../components/RightPanel';

/**
 * Modern Design System - Premium Color Schemes
 */
const themes = {
  // === PREMIUM LIGHT ===
  purePaper: {
    name: 'Pure Paper',
    category: 'light',
    colors: {
      bg: '#fafafa',
      surface: '#ffffff',
      surfaceHover: '#f4f4f5',
      surfaceActive: '#e4e4e7',
      surfaceGlass: 'rgba(255, 255, 255, 0.85)',
      glassBorder: 'rgba(0, 0, 0, 0.06)',
      glassBlur: '24px',
      border: '#e4e4e7',
      borderMuted: '#f4f4f5',
      text: '#09090b',
      textSecondary: '#52525b',
      textMuted: '#a1a1aa',
      accent: '#18181b',
      accentHover: '#27272a',
      accentLight: 'rgba(24, 24, 27, 0.06)',
      accentMuted: 'rgba(24, 24, 27, 0.14)',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      shadow: '0 8px 30px -6px rgba(0, 0, 0, 0.08)',
      scrollbar: '#d4d4d8',
    }
  },
  softNord: {
    name: 'Soft Nord',
    category: 'light',
    colors: {
      bg: '#eceff4',
      surface: '#ffffff',
      surfaceHover: '#e5e9f0',
      surfaceActive: '#d8dee9',
      surfaceGlass: 'rgba(255, 255, 255, 0.82)',
      glassBorder: 'rgba(76, 86, 106, 0.12)',
      glassBlur: '22px',
      border: '#d8dee9',
      borderMuted: '#e5e9f0',
      text: '#2e3440',
      textSecondary: '#4c566a',
      textMuted: '#81a1c1',
      accent: '#5e81ac',
      accentHover: '#81a1c1',
      accentLight: 'rgba(94, 129, 172, 0.12)',
      accentMuted: 'rgba(94, 129, 172, 0.22)',
      success: '#a3be8c',
      warning: '#ebcb8b',
      danger: '#bf616a',
      shadow: '0 12px 32px -8px rgba(46, 52, 64, 0.1)',
      scrollbar: '#d8dee9',
    }
  },
  ivoryBlue: {
    name: 'Ivory Blue',
    category: 'light',
    colors: {
      bg: '#f8fafc',
      surface: '#ffffff',
      surfaceHover: '#f1f5f9',
      surfaceActive: '#e2e8f0',
      surfaceGlass: 'rgba(255, 255, 255, 0.88)',
      glassBorder: 'rgba(14, 165, 233, 0.15)',
      glassBlur: '20px',
      border: '#e2e8f0',
      borderMuted: '#f1f5f9',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      accent: '#0ea5e9',
      accentHover: '#0284c7',
      accentLight: 'rgba(14, 165, 233, 0.1)',
      accentMuted: 'rgba(14, 165, 233, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      shadow: '0 10px 28px -8px rgba(14, 165, 233, 0.08)',
      scrollbar: '#cbd5e1',
    }
  },

  // === TRADING / FINANCIAL TERMINALS ===
  terminalOrange: {
    name: 'Terminal Orange',
    category: 'dark',
    colors: {
      bg: '#050505',
      surface: '#0c0c0c',
      surfaceHover: '#161616',
      surfaceActive: '#222222',
      surfaceGlass: 'rgba(12, 12, 12, 0.94)',
      glassBorder: 'rgba(255, 140, 0, 0.22)',
      glassBlur: '18px',
      border: '#1c1c1c',
      borderMuted: '#111111',
      text: '#ff9f1a',
      textSecondary: '#c47a12',
      textMuted: '#6b4a0e',
      accent: '#ff8c00',
      accentHover: '#ffb347',
      accentLight: 'rgba(255, 140, 0, 0.12)',
      accentMuted: 'rgba(255, 140, 0, 0.28)',
      success: '#00e676',
      warning: '#ffd600',
      danger: '#ff1744',
      shadow: '0 24px 48px -12px rgba(0, 0, 0, 0.95)',
      scrollbar: '#222222',
    }
  },
  quantVoid: {
    name: 'Quant Void',
    category: 'dark',
    colors: {
      bg: '#000000',
      surface: '#030303',
      surfaceHover: '#0a0a0a',
      surfaceActive: '#121212',
      surfaceGlass: 'rgba(3, 3, 3, 0.96)',
      glassBorder: 'rgba(56, 189, 248, 0.18)',
      glassBlur: '28px',
      border: '#0f0f0f',
      borderMuted: '#070707',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      textMuted: '#475569',
      accent: '#38bdf8',
      accentHover: '#7dd3fc',
      accentLight: 'rgba(56, 189, 248, 0.1)',
      accentMuted: 'rgba(56, 189, 248, 0.22)',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      shadow: '0 32px 64px -16px rgba(0, 0, 0, 1)',
      scrollbar: '#1a1a1a',
    }
  },
  exchangeGold: {
    name: 'Exchange Gold',
    category: 'dark',
    colors: {
      bg: '#0a0b0d',
      surface: '#12141a',
      surfaceHover: '#1c1f28',
      surfaceActive: '#282c38',
      surfaceGlass: 'rgba(18, 20, 26, 0.92)',
      glassBorder: 'rgba(246, 200, 68, 0.22)',
      glassBlur: '20px',
      border: '#232732',
      borderMuted: '#161820',
      text: '#f5f5f7',
      textSecondary: '#a1a1aa',
      textMuted: '#52525b',
      accent: '#f6c844',
      accentHover: '#fcd34d',
      accentLight: 'rgba(246, 200, 68, 0.12)',
      accentMuted: 'rgba(246, 200, 68, 0.26)',
      success: '#22c55e',
      warning: '#f6c844',
      danger: '#ef4444',
      shadow: '0 20px 40px -12px rgba(0, 0, 0, 0.9)',
      scrollbar: '#232732',
    }
  },

  // === SOLID DARK & ATMOSPHERIC ===
  voidBlack: {
    name: 'Void Black',
    category: 'dark',
    colors: {
      bg: '#000000',
      surface: '#08080a',
      surfaceHover: '#111114',
      surfaceActive: '#1a1a1f',
      surfaceGlass: 'rgba(8, 8, 10, 0.9)',
      glassBorder: 'rgba(255, 255, 255, 0.08)',
      glassBlur: '24px',
      border: '#1a1a1f',
      borderMuted: '#111114',
      text: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#52525b',
      accent: '#6366f1',
      accentHover: '#818cf8',
      accentLight: 'rgba(99, 102, 241, 0.12)',
      accentMuted: 'rgba(99, 102, 241, 0.25)',
      success: '#22c55e',
      warning: '#eab308',
      danger: '#ef4444',
      shadow: '0 24px 48px -12px rgba(0, 0, 0, 0.95)',
      scrollbar: '#27272a',
    }
  },
  deepIndigo: {
    name: 'Deep Indigo',
    category: 'dark',
    colors: {
      bg: '#06080f',
      surface: '#0c1220',
      surfaceHover: '#151d30',
      surfaceActive: '#1e293b',
      surfaceGlass: 'rgba(12, 18, 32, 0.9)',
      glassBorder: 'rgba(99, 102, 241, 0.22)',
      glassBlur: '22px',
      border: '#1e293b',
      borderMuted: '#0f172a',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      accent: '#818cf8',
      accentHover: '#a5b4fc',
      accentLight: 'rgba(129, 140, 248, 0.12)',
      accentMuted: 'rgba(129, 140, 248, 0.26)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171',
      shadow: '0 20px 40px -12px rgba(6, 8, 15, 0.85)',
      scrollbar: '#1e293b',
    }
  },
  abyssalTeal: {
    name: 'Abyssal Teal',
    category: 'dark',
    colors: {
      bg: '#020b0f',
      surface: '#06161c',
      surfaceHover: '#0c242c',
      surfaceActive: '#12333d',
      surfaceGlass: 'rgba(6, 22, 28, 0.9)',
      glassBorder: 'rgba(45, 212, 191, 0.22)',
      glassBlur: '22px',
      border: '#134e4a',
      borderMuted: '#0a2a30',
      text: '#f0fdfa',
      textSecondary: '#5eead4',
      textMuted: '#2dd4bf',
      accent: '#2dd4bf',
      accentHover: '#5eead4',
      accentLight: 'rgba(45, 212, 191, 0.12)',
      accentMuted: 'rgba(45, 212, 191, 0.26)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171',
      shadow: '0 20px 40px -12px rgba(2, 11, 15, 0.85)',
      scrollbar: '#134e4a',
    }
  },
  nebula: {
    name: 'Nebula',
    category: 'dark',
    colors: {
      bg: '#08050f',
      surface: '#120c1f',
      surfaceHover: '#1c1432',
      surfaceActive: '#281c48',
      surfaceGlass: 'rgba(18, 12, 31, 0.9)',
      glassBorder: 'rgba(167, 139, 250, 0.22)',
      glassBlur: '22px',
      border: '#2e1f4e',
      borderMuted: '#160f28',
      text: '#f5f3ff',
      textSecondary: '#c4b5fd',
      textMuted: '#8b5cf6',
      accent: '#a78bfa',
      accentHover: '#c4b5fd',
      accentLight: 'rgba(167, 139, 250, 0.12)',
      accentMuted: 'rgba(167, 139, 250, 0.26)',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      shadow: '0 20px 40px -12px rgba(8, 5, 15, 0.9)',
      scrollbar: '#2e1f4e',
    }
  },
  moss: {
    name: 'Deep Moss',
    category: 'dark',
    colors: {
      bg: '#030a07',
      surface: '#081611',
      surfaceHover: '#0f241c',
      surfaceActive: '#163328',
      surfaceGlass: 'rgba(8, 22, 17, 0.9)',
      glassBorder: 'rgba(52, 211, 153, 0.22)',
      glassBlur: '22px',
      border: '#14532d',
      borderMuted: '#0a1f16',
      text: '#ecfdf5',
      textSecondary: '#6ee7b7',
      textMuted: '#34d399',
      accent: '#34d399',
      accentHover: '#6ee7b7',
      accentLight: 'rgba(52, 211, 153, 0.12)',
      accentMuted: 'rgba(52, 211, 153, 0.26)',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#f87171',
      shadow: '0 20px 40px -12px rgba(3, 10, 7, 0.85)',
      scrollbar: '#14532d',
    }
  },
  ember: {
    name: 'Ember',
    category: 'dark',
    colors: {
      bg: '#0c0604',
      surface: '#1a0f0b',
      surfaceHover: '#271610',
      surfaceActive: '#382018',
      surfaceGlass: 'rgba(26, 15, 11, 0.9)',
      glassBorder: 'rgba(251, 146, 60, 0.22)',
      glassBlur: '22px',
      border: '#431407',
      borderMuted: '#1c0d08',
      text: '#fff7ed',
      textSecondary: '#fdba74',
      textMuted: '#fb923c',
      accent: '#fb923c',
      accentHover: '#fdba74',
      accentLight: 'rgba(251, 146, 60, 0.12)',
      accentMuted: 'rgba(251, 146, 60, 0.26)',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      shadow: '0 20px 40px -12px rgba(12, 6, 4, 0.85)',
      scrollbar: '#431407',
    }
  },
  tokyoPrime: {
    name: 'Tokyo Prime',
    category: 'dark',
    colors: {
      bg: '#16161e',
      surface: '#1f2335',
      surfaceHover: '#292e42',
      surfaceActive: '#3b4261',
      surfaceGlass: 'rgba(31, 35, 53, 0.9)',
      glassBorder: 'rgba(122, 162, 247, 0.22)',
      glassBlur: '20px',
      border: '#292e42',
      borderMuted: '#1a1b26',
      text: '#c0caf5',
      textSecondary: '#a9b1d6',
      textMuted: '#565f89',
      accent: '#7aa2f7',
      accentHover: '#89b4fa',
      accentLight: 'rgba(122, 162, 247, 0.12)',
      accentMuted: 'rgba(122, 162, 247, 0.26)',
      success: '#9ece6a',
      warning: '#e0af68',
      danger: '#f7768e',
      shadow: '0 20px 40px -12px rgba(22, 22, 30, 0.9)',
      scrollbar: '#292e42',
    }
  },

  // === LUXURY / GOLD ===
  obsidianGold: {
    name: 'Obsidian Gold',
    category: 'dark',
    colors: {
      bg: '#070605',
      surface: '#12100c',
      surfaceHover: '#1c1912',
      surfaceActive: '#292418',
      surfaceGlass: 'rgba(18, 16, 12, 0.92)',
      glassBorder: 'rgba(234, 179, 8, 0.28)',
      glassBlur: '22px',
      border: '#292418',
      borderMuted: '#16130d',
      text: '#fef9c3',
      textSecondary: '#eab308',
      textMuted: '#a16207',
      accent: '#eab308',
      accentHover: '#facc15',
      accentLight: 'rgba(234, 179, 8, 0.12)',
      accentMuted: 'rgba(234, 179, 8, 0.26)',
      success: '#22c55e',
      warning: '#f97316',
      danger: '#ef4444',
      shadow: '0 20px 40px -12px rgba(234, 179, 8, 0.1)',
      scrollbar: '#292418',
    }
  },
  roseNoir: {
    name: 'Rose Noir',
    category: 'dark',
    colors: {
      bg: '#0a0608',
      surface: '#140c10',
      surfaceHover: '#1f1218',
      surfaceActive: '#2c1a22',
      surfaceGlass: 'rgba(20, 12, 16, 0.92)',
      glassBorder: 'rgba(244, 114, 182, 0.22)',
      glassBlur: '22px',
      border: '#3b1c2a',
      borderMuted: '#1a0c12',
      text: '#fdf2f8',
      textSecondary: '#f9a8d4',
      textMuted: '#ec4899',
      accent: '#f472b6',
      accentHover: '#f9a8d4',
      accentLight: 'rgba(244, 114, 182, 0.12)',
      accentMuted: 'rgba(244, 114, 182, 0.26)',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      shadow: '0 20px 40px -12px rgba(10, 6, 8, 0.9)',
      scrollbar: '#3b1c2a',
    }
  },
  champagne: {
    name: 'Champagne',
    category: 'light',
    colors: {
      bg: '#faf7f2',
      surface: '#ffffff',
      surfaceHover: '#f5f0e8',
      surfaceActive: '#ebe3d6',
      surfaceGlass: 'rgba(255, 255, 255, 0.9)',
      glassBorder: 'rgba(180, 140, 50, 0.18)',
      glassBlur: '22px',
      border: '#e8dcc8',
      borderMuted: '#f3ecdf',
      text: '#1c1917',
      textSecondary: '#78716c',
      textMuted: '#a8a29e',
      accent: '#b45309',
      accentHover: '#92400e',
      accentLight: 'rgba(180, 83, 9, 0.1)',
      accentMuted: 'rgba(180, 83, 9, 0.2)',
      success: '#15803d',
      warning: '#c2410c',
      danger: '#b91c1c',
      shadow: '0 12px 32px -8px rgba(180, 140, 50, 0.1)',
      scrollbar: '#d6c4a8',
    }
  },

  // === EXTRA STAND-OUTS ===
  cyberpunk: {
    name: 'Cyberpunk',
    category: 'dark',
    colors: {
      bg: '#0a0014',
      surface: '#120024',
      surfaceHover: '#1c0038',
      surfaceActive: '#2a0050',
      surfaceGlass: 'rgba(18, 0, 36, 0.9)',
      glassBorder: 'rgba(236, 72, 153, 0.25)',
      glassBlur: '20px',
      border: '#3b0764',
      borderMuted: '#1a002e',
      text: '#fce7f3',
      textSecondary: '#f9a8d4',
      textMuted: '#db2777',
      accent: '#ec4899',
      accentHover: '#f472b6',
      accentLight: 'rgba(236, 72, 153, 0.14)',
      accentMuted: 'rgba(236, 72, 153, 0.28)',
      success: '#22d3ee',
      warning: '#facc15',
      danger: '#f43f5e',
      shadow: '0 20px 40px -12px rgba(10, 0, 20, 0.9)',
      scrollbar: '#3b0764',
    }
  },
  arctic: {
    name: 'Arctic',
    category: 'dark',
    colors: {
      bg: '#0a0f14',
      surface: '#111827',
      surfaceHover: '#1e293b',
      surfaceActive: '#334155',
      surfaceGlass: 'rgba(17, 24, 39, 0.9)',
      glassBorder: 'rgba(148, 163, 184, 0.2)',
      glassBlur: '22px',
      border: '#1e293b',
      borderMuted: '#0f172a',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      accent: '#94a3b8',
      accentHover: '#cbd5e1',
      accentLight: 'rgba(148, 163, 184, 0.12)',
      accentMuted: 'rgba(148, 163, 184, 0.24)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171',
      shadow: '0 20px 40px -12px rgba(10, 15, 20, 0.85)',
      scrollbar: '#1e293b',
    }
  },
};
// ===== STYLED COMPONENTS - ALL THEME BASED =====
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: ${props => props.isFullscreen ? '100dvh' : '100vh'};
  background: ${props => props.theme.colors.bg || props.theme.colors.background};
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
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
  width: 100%;
  max-width: 100%;
  min-width: 0;
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
  width: 100%;
  max-width: 100%;
  min-width: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const PanelWrapper = styled.div`
  flex: ${props => props.flex || '1'};
  min-width: 0;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  & > * {
    flex: 1;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    height: 100% !important;
    overflow: hidden;
  }
`;

const MobileLayout = styled.div`
  display: none;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const PanelsContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  position: relative;
`;

const MobilePanelWrapper = styled.div`
  flex: 0 0 100%;
  min-width: 0;
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
  min-width: 0;
  width: 100%;
  max-width: 100%;
`;

const MobileTabs = styled.div`
  display: flex;
  background: ${props => props.theme.colors.surface || props.theme.colors.backgroundSecondary};
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
  background: ${props => props.active ? props.theme.colors.accentLight : 'transparent'};
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
    background: ${props => props.theme.colors.accentLight};
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
  background: ${props => props.theme.colors.surface || props.theme.colors.backgroundSecondary};
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
    background: ${props => props.theme.colors.accentLight};
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

// ===== TOOLTIP =====
const Tooltip = styled.span`
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.colors.surface || props.theme.colors.backgroundSecondary};
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
    border-left: 5px solid ${props => props.theme.colors.surface || props.theme.colors.backgroundSecondary};
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

const panels = [
  { id: 'chart', label: 'Chart', icon: <ChartIcon />, component: ChartPanel },
  { id: 'trade', label: 'Trade', icon: <TradeIcon />, component: RightPanel },
  { id: 'positions', label: 'Positions', icon: <PositionsIcon />, component: LeftPanel },
];

// ============================================
// MAIN COMPONENT
// ============================================
const Derivdash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark'); // Theme state managed here
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null);

  // Theme change handler - passed to TopBar
  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
  };

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

  // Auto-fullscreen for phone/tablet devices
  useEffect(() => {
    const autoFullscreen = async () => {
      if (window.innerWidth <= 1024 && !document.fullscreenElement) {
        try {
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
        } catch (error) {
          console.log('Auto-fullscreen not supported or blocked');
        }
      }
    };

    autoFullscreen();

    const handleOrientationChange = () => {
      if (window.innerWidth <= 1024 && !document.fullscreenElement) {
        autoFullscreen();
      }
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
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

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <DashboardContainer 
        ref={containerRef}
        isFullscreen={isFullscreen}
      >
        <TopBar 
          isSidebarOpen={isSidebarOpen} 
          onSidebarToggle={toggleSidebar}
          currentTheme={currentTheme}        // Pass current theme to TopBar
          onThemeChange={handleThemeChange}  // Pass theme change handler
        />

        <OptionSideBar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />

        <MainContent isSidebarOpen={isSidebarOpen} isDesktop={isDesktop}>
          <DesktopLayout>
            <PanelWrapper flex="0 0 25%">
              <LeftPanel />
            </PanelWrapper>
            <PanelWrapper flex="0 0 50%">
              <ChartPanel />
            </PanelWrapper>
            <PanelWrapper flex="0 0 25%">
              <RightPanel />
            </PanelWrapper>
          </DesktopLayout>

          <MobileLayout>
            <PanelsContainer
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {panels.map((panel, index) => {
                const Component = panel.component;
                return (
                  <MobilePanelWrapper
                    key={panel.id}
                    index={activeIndex}
                  >
                    <PanelContent>
                      <Component />
                    </PanelContent>
                  </MobilePanelWrapper>
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
        </MainContent>

        {/* Floating Buttons - Only Fullscreen */}
        <FloatingButtonsContainer isMobile={isMobile}>
          <FullscreenButton 
            onClick={toggleFullscreen}
            isFullscreen={isFullscreen}
            isMobile={isMobile}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
          </FullscreenButton>
        </FloatingButtonsContainer>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Derivdash;