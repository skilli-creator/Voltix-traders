// src/pages/Derivdash.jsx (Swipeable Version with Sidebar + Fullscreen + Theme Switch)

import React, { useState, useRef, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import TopBar from '../components/TopBar';
import OptionSideBar from '../components/OptionSideBar';
import LeftPanel from '../components/LeftPanel';
import ChartPanel from '../components/ChartPanel';
import RightPanel from '../components/RightPanel';

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
    }
  }
};

// ===== STYLED COMPONENTS =====
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
  border-top: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  padding: 4px 8px;
  gap: 4px;
  z-index: 10;

  @media (max-width: 480px) {
    padding: 3px 4px;
    gap: 2px;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 8px 4px;
  border: none;
  background: ${props => props.active ? props.theme.colors.tabActive : 'transparent'};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
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
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    
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

// ===== FULLSCREEN BUTTON =====
const FullscreenButton = styled.button`
  position: fixed;
  bottom: ${props => {
    if (props.isMobile) {
      return props.isFullscreen ? '16px' : '80px';
    }
    return '24px';
  }};
  right: ${props => props.isMobile ? '16px' : '24px'};
  z-index: 50;
  width: ${props => props.isMobile ? '44px' : '48px'};
  height: ${props => props.isMobile ? '44px' : '48px'};
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary}dd;
  backdrop-filter: blur(16px);
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};

  &:hover {
    background: ${props => props.theme.colors.tabActive};
    border-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.accent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: ${props => props.isMobile ? '20px' : '22px'};
    height: ${props => props.isMobile ? '20px' : '22px'};
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    bottom: ${props => props.isFullscreen ? '12px' : '72px'};
    right: 12px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (min-width: 769px) {
    width: 48px;
    height: 48px;
    bottom: 24px;
    right: 24px;
    
    &:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 32px ${props => props.theme.colors.accent}33;
    }
  }
`;

const FullscreenTooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.backgroundSecondary}ee;
  backdrop-filter: blur(12px);
  color: ${props => props.theme.colors.text};
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  letter-spacing: 0.3px;
  border: 1px solid ${props => props.theme.colors.border};
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  font-weight: 500;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${props => props.theme.colors.backgroundSecondary}ee;
  }

  ${FullscreenButton}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-4px);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// ===== THEME SWITCH BUTTON =====
const ThemeSwitchContainer = styled.div`
  position: fixed;
  bottom: ${props => {
    if (props.isMobile) {
      return props.isFullscreen ? '72px' : '136px';
    }
    return '80px';
  }};
  right: ${props => props.isMobile ? '16px' : '24px'};
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
`;

const ThemeToggleButton = styled.button`
  width: ${props => props.isMobile ? '44px' : '48px'};
  height: ${props => props.isMobile ? '44px' : '48px'};
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary}dd;
  backdrop-filter: blur(16px);
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.isMobile ? '18px' : '20px'};
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.tabActive};
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

const ThemeDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: ${props => props.theme.colors.backgroundSecondary}ee;
  backdrop-filter: blur(16px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 6px;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
  box-shadow: 0 8px 32px ${props => props.theme.colors.shadow};
  animation: slideUp 0.2s ease;

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
    min-width: 120px;
    right: -10px;
  }
`;

const ThemeOption = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? props.theme.colors.tabActive : 'transparent'};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: ${props => props.active ? '600' : '400'};
  width: 100%;
  text-align: left;

  &:hover {
    background: ${props => props.theme.colors.tabActive};
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
    font-size: 12px;
    
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

const themeColorMap = {
  black: '#0a0f1f',
  white: '#f0f2f5',
  blue: '#0c1a3a',
  yellow: '#1a1a0a',
  red: '#1a0a0a'
};

const Derivdash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('black');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
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
        </MainContent>

        {/* Theme Switch */}
        <ThemeSwitchContainer 
          isMobile={isMobile} 
          isFullscreen={isFullscreen}
          ref={themeDropdownRef}
        >
          <ThemeToggleButton
            onClick={toggleThemeDropdown}
            isMobile={isMobile}
            aria-label="Toggle Theme"
          >
            <ThemeIcon />
            <FullscreenTooltip>
              Change Theme
            </FullscreenTooltip>
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
        </ThemeSwitchContainer>

        {/* Fullscreen Toggle Button */}
        <FullscreenButton 
          onClick={toggleFullscreen}
          isFullscreen={isFullscreen}
          isMobile={isMobile}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
          <FullscreenTooltip>
            {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </FullscreenTooltip>
        </FullscreenButton>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Derivdash;