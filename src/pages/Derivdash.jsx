// src/pages/Derivdash.jsx (Swipeable Version with Sidebar + Fullscreen for All Devices)

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import TopBar from '../components/TopBar';
import OptionSideBar from '../components/OptionSideBar';
import LeftPanel from '../components/LeftPanel';
import ChartPanel from '../components/ChartPanel';
import RightPanel from '../components/RightPanel';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: ${props => props.isFullscreen ? '100dvh' : '100vh'};
  background: #0a0f1f;
  overflow: hidden;
  position: relative;
  width: 100%;
  
  /* Prevent scrolling on body when in fullscreen */
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
    background: #2a2e3d;
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
  background: #0f131a;
  border-top: 1px solid #1e2a3a;
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
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.15)' : 'transparent'};
  color: ${props => props.active ? '#2962ff' : '#8a93a6'};
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
    color: ${props => props.active ? '#2962ff' : '#8a93a6'};
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
      color: ${props => props.active ? '#2962ff' : '#c8d0dc'};
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

// ===== FULLSCREEN BUTTON - Visible on ALL Devices =====
const FullscreenButton = styled.button`
  position: fixed;
  bottom: ${props => {
    if (props.isMobile) {
      return props.isFullscreen ? '16px' : '80px';
    }
    return '24px'; // Desktop position
  }};
  right: ${props => props.isMobile ? '16px' : '24px'};
  z-index: 50;
  width: ${props => props.isMobile ? '44px' : '48px'};
  height: ${props => props.isMobile ? '44px' : '48px'};
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 19, 26, 0.85);
  backdrop-filter: blur(16px);
  color: #8a93a6;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(41, 98, 255, 0.15);
    border-color: rgba(41, 98, 255, 0.2);
    color: #2962ff;
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
    /* Desktop specific styles */
    width: 48px;
    height: 48px;
    bottom: 24px;
    right: 24px;
    
    &:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 32px rgba(41, 98, 255, 0.2);
    }
  }
`;

// ===== FULLSCREEN TOOLTIP (Desktop only) =====
const FullscreenTooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(8, 18, 38, 0.95);
  backdrop-filter: blur(12px);
  color: #f1f5f9;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  letter-spacing: 0.3px;
  border: 1px solid rgba(255, 255, 255, 0.06);
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
    border-top: 5px solid rgba(8, 18, 38, 0.95);
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

// ===== FULLSCREEN SVG ICONS =====
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

const Derivdash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsDesktop(!mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle fullscreen change events
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
        // Enter fullscreen
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
        // Exit fullscreen
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
    <DashboardContainer 
      ref={containerRef}
      isFullscreen={isFullscreen}
    >
      {/* Top Bar with Sidebar Toggle */}
      <TopBar 
        isSidebarOpen={isSidebarOpen} 
        onSidebarToggle={toggleSidebar} 
      />

      {/* Sidebar Component */}
      <OptionSideBar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />

      {/* Main Content - Pushes right when sidebar is open on desktop */}
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

      {/* Fullscreen Toggle Button - Visible on ALL Devices */}
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
  );
};

export default Derivdash;