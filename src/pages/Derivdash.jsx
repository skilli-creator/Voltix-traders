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
    flex: 1;
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

  /* Phone: FULL WIDTH at BOTTOM */
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    min-width: unset;
    height: auto;
    max-height: 160px;
    min-height: 120px;
    border-right: none;
    border-top: 1px solid #1e2a3a;
    overflow-y: auto;
    order: 3; /* 👈 BOTTOM */
  }
`;

// ===== CHART PANEL (Responsive) =====
const ChartWrapper = styled.div`
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: #0d1117;

  /* Phone: TOP (after TopBar) */
  @media (max-width: 768px) {
    flex: 1;
    min-height: 35vh;
    height: auto;
    overflow: hidden;
    order: 0; /* 👈 TOP */
  }

  /* Small phones: ensure chart is visible */
  @media (max-width: 480px) {
    min-height: 30vh;
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

  /* Phone: FULL WIDTH in MIDDLE */
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    min-width: unset;
    height: auto;
    max-height: 250px;
    min-height: 180px;
    border-left: none;
    border-top: 1px solid #1e2a3a;
    overflow-y: auto;
    order: 1; /* 👈 MIDDLE (after Chart) */
  }

  /* Small phones */
  @media (max-width: 480px) {
    max-height: 220px;
    min-height: 150px;
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