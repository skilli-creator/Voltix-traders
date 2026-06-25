// src/pages/Derivdash.jsx

import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import TopBar from '../components/TopBar';
import LeftPanel from '../components/LeftPanel';
import ChartPanel from '../components/ChartPanel';
import RightPanel from '../components/RightPanel';

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #080c18;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// ===== DESKTOP LAYOUT =====
const DesktopLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

// ===== MOBILE LAYOUT =====
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

// ---- Mobile Header (Compact) ----
const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: rgba(8, 12, 24, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
  min-height: 44px;

  .symbol {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .symbol-name {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
  }

  .symbol-change {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.isNegative ? '#ef4444' : '#22c55e'};
    background: ${props => props.isNegative ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)'};
    padding: 2px 8px;
    border-radius: 12px;
  }

  .price {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    font-family: 'Courier New', monospace;
  }
`;

// ---- Chart Area ----
const ChartArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  background: #080c18;
`;

// ---- Bottom Navigation ----
const BottomNav = styled.div`
  display: flex;
  background: rgba(8, 12, 24, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
  padding: 4px 0;
  backdrop-filter: blur(20px);
`;

const NavItem = styled.button`
  flex: 1;
  padding: 4px 0;
  border: none;
  background: transparent;
  color: ${props => props.active ? '#2962ff' : '#6b7280'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  position: relative;

  .icon {
    font-size: 20px;
    transition: transform 0.2s ease;
  }

  .label {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  ${props => props.active && `
    .icon { transform: scale(1.1); }
    &::after {
      content: '';
      position: absolute;
      top: -1px;
      left: 30%;
      right: 30%;
      height: 2px;
      background: linear-gradient(90deg, #2962ff, #818cf8);
      border-radius: 0 0 2px 2px;
    }
  `}

  &:hover {
    color: ${props => props.active ? '#2962ff' : '#9ca3af'};
  }
`;

// ---- Panel Container (Swipeable) ----
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

// ---- Panel Content ----
const PanelContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease;
`;

// ---- Quick Stats Bar ----
const StatsBar = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  flex-shrink: 0;

  .stat {
    text-align: center;
  }

  .stat-value {
    font-size: 12px;
    font-weight: 600;
    color: #ffffff;
  }

  .stat-label {
    font-size: 7px;
    text-transform: uppercase;
    color: #6b7280;
    letter-spacing: 0.5px;
    margin-top: 1px;
  }

  .stat-value.positive { color: #22c55e; }
  .stat-value.negative { color: #ef4444; }
`;

const panels = [
  { id: 'chart', label: 'Chart', icon: '📊', component: ChartPanel },
  { id: 'trade', label: 'Trade', icon: '📈', component: RightPanel },
  { id: 'positions', label: 'Positions', icon: '💼', component: LeftPanel },
];

// ============================================
// MAIN COMPONENT
// ============================================

const Derivdash = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [price, setPrice] = useState(8459.65);
  const [change, setChange] = useState(39.59);
  const [changePct, setChangePct] = useState(0.47);
  const [isNegative, setIsNegative] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate price updates for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 2;
      const newPrice = parseFloat((price + delta).toFixed(2));
      setPrice(newPrice);
      const newChange = newPrice - 8459.65;
      setChange(newChange);
      setChangePct((newChange / 8459.65) * 100);
      setIsNegative(newChange < 0);
    }, 2000);
    return () => clearInterval(interval);
  }, [price]);

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

  return (
    <DashboardContainer>
      <TopBar />

      <DesktopLayout>
        <LeftPanel />
        <ChartPanel />
        <RightPanel />
      </DesktopLayout>

      <MobileLayout>
        {/* Mobile Header with Live Price */}
        <MobileHeader isNegative={isNegative}>
          <div className="symbol">
            <span className="symbol-name">R_100</span>
            <span className="symbol-change">
              {change >= 0 ? '+' : ''}{changePct.toFixed(2)}%
            </span>
          </div>
          <div className="price">
            ${price.toFixed(2)}
          </div>
        </MobileHeader>

        {/* Stats Bar */}
        <StatsBar>
          <div className="stat">
            <div className="stat-value">24h</div>
            <div className="stat-label">Volume</div>
          </div>
          <div className="stat">
            <div className="stat-value">$12.4K</div>
            <div className="stat-label">Open Interest</div>
          </div>
          <div className="stat">
            <div className="stat-value">$1.2M</div>
            <div className="stat-label">Market Cap</div>
          </div>
        </StatsBar>

        {/* Swipeable Panels */}
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

        {/* Bottom Navigation */}
        <BottomNav>
          {panels.map((panel, index) => (
            <NavItem
              key={panel.id}
              active={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            >
              <span className="icon">{panel.icon}</span>
              <span className="label">{panel.label}</span>
            </NavItem>
          ))}
        </BottomNav>
      </MobileLayout>
    </DashboardContainer>
  );
};

export default Derivdash;