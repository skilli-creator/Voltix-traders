import React from 'react';
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

  /* Phone: allow scrolling */
  @media (max-width: 768px) {
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  /* Phone: stack vertically */
  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    gap: 0;
  }

  /* Tablet: adjust spacing */
  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 0;
  }
`;

// ===== LEFT PANEL (Responsive) =====
const LeftPanelWrapper = styled.div`
  flex: 0 0 260px;
  min-width: 260px;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #1e2a3a;

  /* Tablet: smaller width */
  @media (max-width: 1024px) and (min-width: 769px) {
    flex: 0 0 200px;
    min-width: 200px;
  }

  /* Phone: full width, compact */
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    min-width: unset;
    height: auto;
    max-height: 180px;
    border-right: none;
    border-bottom: 1px solid #1e2a3a;
    overflow-y: auto;
  }
`;

// ===== CHART PANEL (Responsive) =====
const ChartWrapper = styled.div`
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: #0d1117;

  /* Phone: takes most of the space */
  @media (max-width: 768px) {
    flex: 1;
    min-height: 45vh;
    height: auto;
    overflow: hidden;
  }

  /* Small phones: ensure chart is visible */
  @media (max-width: 480px) {
    min-height: 40vh;
  }
`;

// ===== RIGHT PANEL (Responsive) =====
const RightPanelWrapper = styled.div`
  flex: 0 0 290px;
  min-width: 290px;
  height: 100%;
  overflow-y: auto;
  border-left: 1px solid #1e2a3a;

  /* Tablet: smaller width */
  @media (max-width: 1024px) and (min-width: 769px) {
    flex: 0 0 220px;
    min-width: 220px;
  }

  /* Phone: full width, at bottom */
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    min-width: unset;
    height: auto;
    max-height: 280px;
    border-left: none;
    border-top: 1px solid #1e2a3a;
    overflow-y: auto;
  }

  /* Small phones: taller panel */
  @media (max-width: 480px) {
    max-height: 320px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Derivdash = () => {
  return (
    <DashboardContainer>
      <TopBar />
      <MainContent>
        <LeftPanelWrapper>
          <LeftPanel />
        </LeftPanelWrapper>
        <ChartWrapper>
          <ChartPanel />
        </ChartWrapper>
        <RightPanelWrapper>
          <RightPanel />
        </RightPanelWrapper>
      </MainContent>
    </DashboardContainer>
  );
};

export default Derivdash;