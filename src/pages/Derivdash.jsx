// src/pages/Derivdash.jsx (Swipeable Version)

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import TopBar from '../components/TopBar';
import LeftPanel from '../components/LeftPanel';
import ChartPanel from '../components/ChartPanel';
import RightPanel from '../components/RightPanel';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0a0f1f;
  overflow: hidden;
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
  gap: 1px;

  .icon {
    font-size: 18px;
  }

  .label {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
`;

const panels = [
  { id: 'chart', label: 'Chart', icon: '📊', component: ChartPanel },
  { id: 'trade', label: 'Trade', icon: '📈', component: RightPanel },
  { id: 'positions', label: 'Positions', icon: '💼', component: LeftPanel },
];

const Derivdash = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    </DashboardContainer>
  );
};

export default Derivdash;