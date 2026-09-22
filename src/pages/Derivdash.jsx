// src/pages/Derivdash.jsx (Swipeable Version with Sidebar + Sticky Mobile UI)

import React, { useState, useRef, useEffect } from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
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

// ===== ANIMATIONS =====
const panelFadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* Height of the fixed bottom tab bar (used for paddings). */
const MOBILE_TABS_HEIGHT = '58px';

// ===== STYLED COMPONENTS - ALL THEME BASED =====
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${props => props.theme.colors.bg || props.theme.colors.background};
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  transition: background 0.3s ease;
  font-weight: 700;

  /* PHONE VIEW
     The DOCUMENT itself must scroll for the mobile browser to collapse
     its own tab / address bar. So we drop the fixed height and let the
     content grow naturally. */
  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: visible;
    max-width: 100%;
  }
`;

/* Wraps TopBar so it stays pinned to the top on mobile while the page
   scrolls. Combined with document scrolling this is what keeps our bar
   visible after the browser hides its own chrome. */
const TopBarStickyWrapper = styled.div`
  position: relative;
  z-index: 40;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    z-index: 40;
    background: ${props => props.theme.colors.bg || props.theme.colors.background};
    box-shadow: 0 2px 12px ${props => props.theme.colors.shadow};
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: ${props => (props.isSidebarOpen && props.isDesktop ? '280px' : '0')};

  @media (max-width: 768px) {
    margin-left: 0;
    overflow: visible;
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
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;

  @media (max-width: 768px) {
    display: flex;
    overflow: visible;
  }
`;

const PanelsContainer = styled.div`
  display: block;
  flex: 1;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  position: relative;
  overflow: visible;
  /* leave room for the fixed bottom tab bar so nothing is covered */
  padding-bottom: calc(${MOBILE_TABS_HEIGHT} + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
`;

const MobilePanelWrapper = styled.div`
  display: ${props => (props.active ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  /* must be visible so its children can grow and let the document scroll */
  overflow: visible;
  min-height: calc(100vh - ${MOBILE_TABS_HEIGHT});
  min-height: calc(100dvh - ${MOBILE_TABS_HEIGHT});
  animation: ${panelFadeIn} 0.25s ease both;
  box-sizing: border-box;
`;

const PanelContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: visible;

  & > * {
    flex: 1 1 auto;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
  }
`;

/* FIXED BOTTOM TABS (phone view). position: fixed keeps these pinned to
   the viewport no matter how far the user scrolls. env(safe-area-inset-bottom)
   handles phones with a home indicator. */
const MobileTabs = styled.div`
  display: flex;
  align-items: stretch;
  background: ${props => props.theme.colors.surface || props.theme.colors.backgroundSecondary};
  border-top: 2px solid ${props => props.theme.colors.border};
  padding: 4px 8px calc(4px + env(safe-area-inset-bottom, 0px)) 8px;
  gap: 4px;
  font-weight: 700;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 -6px 20px ${props => props.theme.colors.shadow};

  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 50;

  @media (max-width: 480px) {
    padding: 3px 4px calc(3px + env(safe-area-inset-bottom, 0px)) 4px;
    gap: 2px;
  }

  /* never show on desktop */
  @media (min-width: 769px) {
    display: none;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 8px 4px;
  border: 2px solid transparent;
  background: ${props => (props.active ? props.theme.colors.accentLight : 'transparent')};
  color: ${props => (props.active ? props.theme.colors.accent : props.theme.colors.textSecondary)};
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  -webkit-tap-highlight-color: transparent;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => (props.active ? props.theme.colors.accent : props.theme.colors.textSecondary)};
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
    border-color: ${props => (props.active ? props.theme.colors.accent : 'transparent')};

    .icon {
      color: ${props => (props.active ? props.theme.colors.accent : props.theme.colors.text)};
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
  const [currentTheme, setCurrentTheme] = useState('dark');

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

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

  /* PHONE VIEW: force the whole page (html / body / app root / any
     descendant) to be part of one single document-level scroll context.

     Mobile browsers auto-hide their tab / address bar ONLY when the
     window itself scrolls. If any inner element traps the scroll with
     its own overflow, the browser chrome never collapses. This injected
     stylesheet neutralizes those traps on mobile so the window scrolls. */
  useEffect(() => {
    if (!isMobile) return undefined;

    const STYLE_ID = 'derivdash-mobile-scroll';
    const existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.innerHTML = `
      html, body {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        height: auto !important;
        min-height: 100% !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior-y: auto !important;
      }
      #root {
        overflow: visible !important;
        height: auto !important;
        min-height: 100vh !important;
        min-height: 100dvh !important;
      }
      /* Let every panel inside the dashboard flow with the page instead
         of creating its own inner scroll box, otherwise the browser
         chrome will not collapse. */
      #root [data-mobile-scroll-reset],
      #root [data-mobile-scroll-reset] * {
        overflow: visible !important;
        max-height: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    };
  }, [isMobile]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const goToPanel = (index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
    touchStartY.current = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    touchEndY.current = e.changedTouches[0].screenY;

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;

    /* only treat it as a swipe when clearly horizontal,
       so vertical page scrolling is never hijacked */
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0 && activeIndex < panels.length - 1) {
        goToPanel(activeIndex + 1);
      } else if (diffX < 0 && activeIndex > 0) {
        goToPanel(activeIndex - 1);
      }
    }
  };

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <DashboardContainer>
        <TopBarStickyWrapper>
          <TopBar
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={toggleSidebar}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
          />
        </TopBarStickyWrapper>

        <OptionSideBar isOpen={isSidebarOpen} onClose={closeSidebar} />

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
            <PanelsContainer onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              {panels.map((panel, index) => {
                const Component = panel.component;
                return (
                  <MobilePanelWrapper
                    key={panel.id}
                    active={activeIndex === index}
                    data-mobile-scroll-reset
                  >
                    <PanelContent data-mobile-scroll-reset>
                      <Component />
                    </PanelContent>
                  </MobilePanelWrapper>
                );
              })}
            </PanelsContainer>
          </MobileLayout>
        </MainContent>

        {/* Fixed bottom tab bar (mobile only). Kept outside MobileLayout
            so position: fixed anchors to the viewport, not a scroll box. */}
        <MobileTabs>
          {panels.map((panel, index) => (
            <TabButton
              key={panel.id}
              active={activeIndex === index}
              onClick={() => goToPanel(index)}
            >
              <span className="icon">{panel.icon}</span>
              <span className="label">{panel.label}</span>
            </TabButton>
          ))}
        </MobileTabs>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Derivdash;