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
  // =========================================================================
  // FINANCIAL & HIGH-FREQUENCY TRADING (HFT) TERMINALS
  // =========================================================================
  bloombergTerminal: {
    name: 'Bloomberg Pro',
    category: 'terminal',
    colors: {
      bg: '#000000',
      surface: '#0d0d0d',
      surfaceHover: '#171717',
      surfaceActive: '#242424',
      surfaceGlass: 'rgba(13, 13, 13, 0.92)',
      glassBorder: 'rgba(255, 153, 0, 0.2)',
      glassBlur: '16px',
      border: '#1f1f1f',
      borderMuted: '#121212',
      text: '#ff9900',
      textSecondary: '#d1a153',
      textMuted: '#785e2f',
      accent: '#ff9900',
      accentHover: '#ffad33',
      accentLight: 'rgba(255, 153, 0, 0.1)',
      accentMuted: 'rgba(255, 153, 0, 0.25)',
      success: '#00ff66',
      warning: '#ffcc00',
      danger: '#ff3333',
      shadow: '0 20px 40px -15px rgba(0, 0, 0, 0.95)',
      scrollbar: '#262626',
    }
  },

  quantOLED: {
    name: 'Quant Black (OLED)',
    category: 'dark',
    colors: {
      bg: '#000000',
      surface: '#050505',
      surfaceHover: '#0d0d0d',
      surfaceActive: '#171717',
      surfaceGlass: 'rgba(5, 5, 5, 0.95)',
      glassBorder: 'rgba(59, 130, 246, 0.2)',
      glassBlur: '24px',
      border: '#121212',
      borderMuted: '#0a0a0a',
      text: '#ffffff',
      textSecondary: '#888888',
      textMuted: '#444444',
      accent: '#3b82f6',
      accentHover: '#60a5fa',
      accentLight: 'rgba(59, 130, 246, 0.12)',
      accentMuted: 'rgba(59, 130, 246, 0.25)',
      success: '#00e676',
      warning: '#ffb300',
      danger: '#ff1744',
      shadow: '0 24px 48px -12px rgba(0, 0, 0, 1)',
      scrollbar: '#1a1a1a',
    }
  },

  binanceFutures: {
    name: 'Futures Dark',
    category: 'dark',
    colors: {
      bg: '#0b0e11',
      surface: '#181a20',
      surfaceHover: '#2b313a',
      surfaceActive: '#363c4e',
      surfaceGlass: 'rgba(24, 26, 32, 0.9)',
      glassBorder: 'rgba(240, 185, 11, 0.2)',
      glassBlur: '20px',
      border: '#2b313a',
      borderMuted: '#1e2329',
      text: '#eaecef',
      textSecondary: '#848e9c',
      textMuted: '#474d57',
      accent: '#f0b90b',
      accentHover: '#fcd535',
      accentLight: 'rgba(240, 185, 11, 0.12)',
      accentMuted: 'rgba(240, 185, 11, 0.25)',
      success: '#0ecb81',
      warning: '#f0b90b',
      danger: '#f6465d',
      shadow: '0 20px 40px -15px rgba(0, 0, 0, 0.85)',
      scrollbar: '#2b313a',
    }
  },

  cyberpunkNeon: {
    name: 'Cyber Matrix',
    category: 'dark',
    colors: {
      bg: '#030712',
      surface: '#0b0f19',
      surfaceHover: '#151c2e',
      surfaceActive: '#1f293d',
      surfaceGlass: 'rgba(11, 15, 25, 0.88)',
      glassBorder: 'rgba(6, 182, 212, 0.3)',
      glassBlur: '20px',
      border: '#1e293b',
      borderMuted: '#0f172a',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      textMuted: '#475569',
      accent: '#06b6d4',
      accentHover: '#22d3ee',
      accentLight: 'rgba(6, 182, 212, 0.15)',
      accentMuted: 'rgba(6, 182, 212, 0.3)',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#ff0055',
      shadow: '0 20px 40px -15px rgba(6, 182, 212, 0.15)',
      scrollbar: '#1e293b',
    }
  },

  // =========================================================================
  // LUXURY, EXECUTIVE & ENTERPRISE DESIGN SYSTEMS
  // =========================================================================
  monacoLuxury: {
    name: 'Monaco Obsidian',
    category: 'dark',
    colors: {
      bg: '#0a0a0a',
      surface: '#121212',
      surfaceHover: '#1a1a1a',
      surfaceActive: '#262626',
      surfaceGlass: 'rgba(18, 18, 18, 0.88)',
      glassBorder: 'rgba(212, 175, 55, 0.25)',
      glassBlur: '20px',
      border: '#222222',
      borderMuted: '#141414',
      text: '#f5f5f7',
      textSecondary: '#a1a1a6',
      textMuted: '#515154',
      accent: '#d4af37',
      accentHover: '#e5c158',
      accentLight: 'rgba(212, 175, 55, 0.12)',
      accentMuted: 'rgba(212, 175, 55, 0.25)',
      success: '#2e7d32',
      warning: '#ed6c02',
      danger: '#d32f2f',
      shadow: '0 20px 40px -15px rgba(0, 0, 0, 0.95)',
      scrollbar: '#2a2a2a',
    }
  },

  titaniumLight: {
    name: 'Titanium Pro (Light)',
    category: 'light',
    colors: {
      bg: '#f3f4f6',
      surface: '#ffffff',
      surfaceHover: '#f9fafb',
      surfaceActive: '#edf0f5',
      surfaceGlass: 'rgba(255, 255, 255, 0.85)',
      glassBorder: 'rgba(0, 0, 0, 0.08)',
      glassBlur: '20px',
      border: '#e5e7eb',
      borderMuted: '#f3f4f6',
      text: '#111827',
      textSecondary: '#4b5563',
      textMuted: '#9ca3af',
      accent: '#4f46e5',
      accentHover: '#4338ca',
      accentLight: 'rgba(79, 70, 229, 0.08)',
      accentMuted: 'rgba(79, 70, 229, 0.18)',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      shadow: '0 20px 30px -10px rgba(0, 0, 0, 0.05)',
      scrollbar: '#d1d5db',
    }
  },

  nordicFrost: {
    name: 'Nordic Frost',
    category: 'dark',
    colors: {
      bg: '#181b28',
      surface: '#222738',
      surfaceHover: '#2d334a',
      surfaceActive: '#38405c',
      surfaceGlass: 'rgba(34, 39, 56, 0.88)',
      glassBorder: 'rgba(129, 161, 193, 0.25)',
      glassBlur: '20px',
      border: '#2e354f',
      borderMuted: '#1d2233',
      text: '#eceff4',
      textSecondary: '#d8dee9',
      textMuted: '#4c566a',
      accent: '#88c0d0',
      accentHover: '#8fbcbb',
      accentLight: 'rgba(136, 192, 208, 0.15)',
      accentMuted: 'rgba(136, 192, 208, 0.3)',
      success: '#a3be8c',
      warning: '#ebcb8b',
      danger: '#bf616a',
      shadow: '0 20px 40px -15px rgba(15, 17, 26, 0.85)',
      scrollbar: '#2e354f',
    }
  },

  tokyoNight: {
    name: 'Tokyo Night Prime',
    category: 'dark',
    colors: {
      bg: '#1a1b26',
      surface: '#24283b',
      surfaceHover: '#2f354f',
      surfaceActive: '#3b4263',
      surfaceGlass: 'rgba(36, 40, 59, 0.88)',
      glassBorder: 'rgba(122, 162, 247, 0.25)',
      glassBlur: '20px',
      border: '#2f354f',
      borderMuted: '#1f2335',
      text: '#a9b1d6',
      textSecondary: '#787c99',
      textMuted: '#565f89',
      accent: '#7aa2f7',
      accentHover: '#bb9af7',
      accentLight: 'rgba(122, 162, 247, 0.15)',
      accentMuted: 'rgba(122, 162, 247, 0.3)',
      success: '#9ece6a',
      warning: '#e0af68',
      danger: '#f7768e',
      shadow: '0 20px 40px -15px rgba(16, 17, 24, 0.9)',
      scrollbar: '#2f354f',
    }
  }
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