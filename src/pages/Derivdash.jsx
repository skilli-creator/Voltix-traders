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
  position: relative;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    min-height: 0;
  }
`;

// ===== CHART PANEL =====
const ChartWrapper = styled.div`
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: #0d1117;

  @media (max-width: 768px) {
    flex: 0 0 38%;
    height: auto;
    min-height: 0;
    overflow: hidden;
    order: 0;
  }

  @media (max-width: 480px) {
    flex: 0 0 35%;
  }
`;

// ===== RIGHT PANEL =====
const RightPanelWrapper = styled.div`
  flex: 0 0 290px;
  min-width: 290px;
  height: 100%;
  overflow-y: auto;
  border-left: 1px solid #1e2a3a;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
    border-radius: 10px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    flex: 0 0 220px;
    min-width: 220px;
  }

  @media (max-width: 768px) {
    flex: 0 0 31%;
    width: 100%;
    min-width: unset;
    height: auto;
    min-height: 0;
    border-left: none;
    border-top: 1px solid #1e2a3a;
    overflow-y: auto;
    order: 1;
    padding: 6px 8px;
    background: #0f131a;
  }

  @media (max-width: 480px) {
    flex: 0 0 28%;
    padding: 4px 6px;
  }
`;

// ===== LEFT PANEL =====
const LeftPanelWrapper = styled.div`
  flex: 0 0 260px;
  min-width: 260px;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #1e2a3a;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
    border-radius: 10px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    flex: 0 0 180px;
    min-width: 180px;
  }

  @media (max-width: 768px) {
    flex: 0 0 31%;
    width: 100%;
    min-width: unset;
    height: auto;
    min-height: 0;
    border-right: none;
    border-top: 1px solid #1e2a3a;
    overflow-y: auto;
    order: 2;
    padding: 4px 6px;
    background: #0d1117;
  }

  @media (max-width: 480px) {
    flex: 0 0 28%;
    padding: 4px 4px;
  }
`;

const Derivdash = () => {
  return (
    <DashboardContainer>
      <TopBar />
      <MainContent>
        <ChartWrapper>
          <ChartPanel />
        </ChartWrapper>
        <RightPanelWrapper>
          <RightPanel />
        </RightPanelWrapper>
        <LeftPanelWrapper>
          <LeftPanel />
        </LeftPanelWrapper>
      </MainContent>
    </DashboardContainer>
  );
};

export default Derivdash;