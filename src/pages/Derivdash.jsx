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
  white: {
    name: 'White',
    category: 'light',
    colors: {
      bg: '#f4f6f9',
      surface: '#ffffff',
      surfaceHover: '#f1f4f8',
      surfaceActive: '#e8edf4',
      surfaceElevated: '#ffffff',
      surfaceGlass: 'rgba(255, 255, 255, 0.78)',
      glassBorder: 'rgba(15, 23, 42, 0.06)',
      glassBlur: '24px',
      border: '#e2e8f0',
      borderMuted: '#eef2f7',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      accent: '#2563eb',
      accentHover: '#1d4ed8',
      accentSoft: '#3b82f6',
      accentLight: 'rgba(37, 99, 235, 0.08)',
      accentMuted: 'rgba(37, 99, 235, 0.16)',
      accentGlow: '0 0 24px rgba(37, 99, 235, 0.18)',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      shadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -6px rgba(15, 23, 42, 0.08)',
      shadowElevated: '0 4px 12px rgba(15, 23, 42, 0.06), 0 20px 40px -12px rgba(15, 23, 42, 0.12)',
      scrollbar: '#cbd5e1',
      ring: 'rgba(37, 99, 235, 0.35)',
    },
  },

  dark: {
    name: 'Dark',
    category: 'dark',
    colors: {
      bg: '#09090b',
      surface: '#121214',
      surfaceHover: '#1a1a1e',
      surfaceActive: '#232328',
      surfaceElevated: '#18181b',
      surfaceGlass: 'rgba(18, 18, 20, 0.72)',
      glassBorder: 'rgba(255, 255, 255, 0.07)',
      glassBlur: '28px',
      border: '#27272a',
      borderMuted: '#1c1c1f',
      text: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#71717a',
      accent: '#3b82f6',
      accentHover: '#60a5fa',
      accentSoft: '#60a5fa',
      accentLight: 'rgba(59, 130, 246, 0.12)',
      accentMuted: 'rgba(59, 130, 246, 0.22)',
      accentGlow: '0 0 28px rgba(59, 130, 246, 0.22)',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 32px -8px rgba(0, 0, 0, 0.65)',
      shadowElevated: '0 8px 24px rgba(0, 0, 0, 0.45), 0 24px 48px -12px rgba(0, 0, 0, 0.75)',
      scrollbar: '#3f3f46',
      ring: 'rgba(59, 130, 246, 0.4)',
    },
  },

  gold: {
    name: 'Gold',
    category: 'dark',
    colors: {
      bg: '#0b0a08',
      surface: '#141310',
      surfaceHover: '#1c1a16',
      surfaceActive: '#25221c',
      surfaceElevated: '#1a1814',
      surfaceGlass: 'rgba(20, 19, 16, 0.75)',
      glassBorder: 'rgba(212, 175, 55, 0.14)',
      glassBlur: '28px',
      border: '#2a2620',
      borderMuted: '#1c1a16',
      text: '#f8f5ef',
      textSecondary: '#b8b0a0',
      textMuted: '#7a7368',
      accent: '#d4af37',
      accentHover: '#e6c45a',
      accentSoft: '#e5c158',
      accentLight: 'rgba(212, 175, 55, 0.10)',
      accentMuted: 'rgba(212, 175, 55, 0.20)',
      accentGlow: '0 0 28px rgba(212, 175, 55, 0.20)',
      success: '#34a853',
      warning: '#f0a020',
      danger: '#e04545',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.5), 0 14px 36px -10px rgba(0, 0, 0, 0.75)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.5), 0 28px 56px -14px rgba(0, 0, 0, 0.8)',
      scrollbar: '#3a3530',
      ring: 'rgba(212, 175, 55, 0.35)',
    },
  },

  forest: {
    name: 'Forest',
    category: 'dark',
    colors: {
      bg: '#050c09',
      surface: '#0c1713',
      surfaceHover: '#12221c',
      surfaceActive: '#1a2f27',
      surfaceElevated: '#101c17',
      surfaceGlass: 'rgba(12, 23, 19, 0.75)',
      glassBorder: 'rgba(16, 185, 129, 0.14)',
      glassBlur: '28px',
      border: '#1a332a',
      borderMuted: '#12221c',
      text: '#ecfdf5',
      textSecondary: '#a7f3d0',
      textMuted: '#6b9e8a',
      accent: '#10b981',
      accentHover: '#34d399',
      accentSoft: '#34d399',
      accentLight: 'rgba(16, 185, 129, 0.12)',
      accentMuted: 'rgba(16, 185, 129, 0.22)',
      accentGlow: '0 0 28px rgba(16, 185, 129, 0.22)',
      success: '#34d399',
      warning: '#f59e0b',
      danger: '#f43f5e',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.45), 0 14px 36px -10px rgba(2, 12, 8, 0.7)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.45), 0 28px 56px -14px rgba(2, 12, 8, 0.75)',
      scrollbar: '#1f3d32',
      ring: 'rgba(16, 185, 129, 0.4)',
    },
  },

  ocean: {
    name: 'Ocean',
    category: 'dark',
    colors: {
      bg: '#030b12',
      surface: '#081621',
      surfaceHover: '#0d2130',
      surfaceActive: '#132c40',
      surfaceElevated: '#0b1c28',
      surfaceGlass: 'rgba(8, 22, 33, 0.75)',
      glassBorder: 'rgba(14, 165, 233, 0.14)',
      glassBlur: '28px',
      border: '#143447',
      borderMuted: '#0d2130',
      text: '#f0f9ff',
      textSecondary: '#7dd3fc',
      textMuted: '#5a8fa8',
      accent: '#0ea5e9',
      accentHover: '#38bdf8',
      accentSoft: '#38bdf8',
      accentLight: 'rgba(14, 165, 233, 0.12)',
      accentMuted: 'rgba(14, 165, 233, 0.22)',
      accentGlow: '0 0 28px rgba(14, 165, 233, 0.22)',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#f43f5e',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.45), 0 14px 36px -10px rgba(1, 12, 22, 0.7)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.45), 0 28px 56px -14px rgba(1, 12, 22, 0.75)',
      scrollbar: '#1a3d52',
      ring: 'rgba(14, 165, 233, 0.4)',
    },
  },

  red: {
    name: 'Red',
    category: 'dark',
    colors: {
      bg: '#0c0505',
      surface: '#160a0a',
      surfaceHover: '#221010',
      surfaceActive: '#2e1616',
      surfaceElevated: '#1c0e0e',
      surfaceGlass: 'rgba(22, 10, 10, 0.75)',
      glassBorder: 'rgba(239, 68, 68, 0.14)',
      glassBlur: '28px',
      border: '#2e1616',
      borderMuted: '#221010',
      text: '#fef2f2',
      textSecondary: '#fca5a5',
      textMuted: '#9f6b6b',
      accent: '#ef4444',
      accentHover: '#f87171',
      accentSoft: '#f87171',
      accentLight: 'rgba(239, 68, 68, 0.12)',
      accentMuted: 'rgba(239, 68, 68, 0.22)',
      accentGlow: '0 0 28px rgba(239, 68, 68, 0.22)',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#f87171',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.45), 0 14px 36px -10px rgba(12, 4, 4, 0.7)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.45), 0 28px 56px -14px rgba(12, 4, 4, 0.75)',
      scrollbar: '#3a1c1c',
      ring: 'rgba(239, 68, 68, 0.4)',
    },
  },

  orange: {
    name: 'Orange',
    category: 'dark',
    colors: {
      bg: '#0c0703',
      surface: '#16100a',
      surfaceHover: '#22180f',
      surfaceActive: '#2e2115',
      surfaceElevated: '#1c140c',
      surfaceGlass: 'rgba(22, 16, 10, 0.75)',
      glassBorder: 'rgba(249, 115, 22, 0.14)',
      glassBlur: '28px',
      border: '#2e2115',
      borderMuted: '#22180f',
      text: '#fff7ed',
      textSecondary: '#fdba74',
      textMuted: '#a07a4e',
      accent: '#f97316',
      accentHover: '#fb923c',
      accentSoft: '#fb923c',
      accentLight: 'rgba(249, 115, 22, 0.12)',
      accentMuted: 'rgba(249, 115, 22, 0.22)',
      accentGlow: '0 0 28px rgba(249, 115, 22, 0.22)',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#ef4444',
      shadow: '0 1px 2px rgba(0, 0, 0, 0.45), 0 14px 36px -10px rgba(12, 6, 2, 0.7)',
      shadowElevated: '0 10px 28px rgba(0, 0, 0, 0.45), 0 28px 56px -14px rgba(12, 6, 2, 0.75)',
      scrollbar: '#3a2a18',
      ring: 'rgba(249, 115, 22, 0.4)',
    },
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