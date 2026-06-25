// src/pages/Derivdash.jsx

import React, { useState } from 'react';
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

  @media (max-width: 768px) {
    display: flex;
  }
`;

// ---- Mobile Chart Area ----
const MobileChartArea = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
`;

// ---- Mobile Bottom Tabs ----
const MobileTabs = styled.div`
  display: flex;
  background: #0f131a;
  border-top: 1px solid #1e2a3a;
  flex-shrink: 0;
  padding: 4px 8px;
  gap: 4px;
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

// ---- Mobile Panel Container ----
const MobilePanel = styled.div`
  flex: 1;
  overflow: hidden;
  display: ${props => props.active ? 'flex' : 'none'};
  flex-direction: column;
  background: #0a0e17;
`;

const Derivdash = () => {
  const [activeTab, setActiveTab] = useState('chart');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DashboardContainer>
      <TopBar />

      <DesktopLayout>
        <LeftPanel />
        <ChartPanel />
        <RightPanel />
      </DesktopLayout>

      <MobileLayout>
        {/* Chart Area */}
        <MobileChartArea>
          <ChartPanel />
        </MobileChartArea>

        {/* Bottom Tabs */}
        <MobileTabs>
          <TabButton 
            active={activeTab === 'chart'} 
            onClick={() => setActiveTab('chart')}
          >
            <span className="icon">📊</span>
            <span className="label">Chart</span>
          </TabButton>

          <TabButton 
            active={activeTab === 'trade'} 
            onClick={() => setActiveTab('trade')}
          >
            <span className="icon">📈</span>
            <span className="label">Trade</span>
          </TabButton>

          <TabButton 
            active={activeTab === 'positions'} 
            onClick={() => setActiveTab('positions')}
          >
            <span className="icon">💼</span>
            <span className="label">Positions</span>
          </TabButton>

          <TabButton 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
          >
            <span className="icon">📊</span>
            <span className="label">Stats</span>
          </TabButton>
        </MobileTabs>

        {/* Panel Content */}
        <MobilePanel active={activeTab === 'chart'}>
          <ChartPanel />
        </MobilePanel>

        <MobilePanel active={activeTab === 'trade'}>
          <RightPanel />
        </MobilePanel>

        <MobilePanel active={activeTab === 'positions'}>
          <LeftPanel />
        </MobilePanel>

        <MobilePanel active={activeTab === 'analytics'}>
          {/* Analytics Panel - You can add this */}
          <div style={{ padding: '20px', color: '#94a3b8', textAlign: 'center' }}>
            📊 Analytics coming soon
          </div>
        </MobilePanel>
      </MobileLayout>
    </DashboardContainer>
  );
};

export default Derivdash;