import React from 'react';
import styled from 'styled-components';

// Import Components
import TopBar from '../components/TopBar';
import LeftPanel from '../components/LeftPanel';
import ChartPanel from '../components/ChartPanel';
import RightPanel from '../components/RightPanel';

// ============================================
// STYLED COMPONENTS
// ============================================

const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0a0f1f;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 0;
`;

// Left Panel - 1 part
const LeftWrapper = styled.div`
  width: 240px;
  min-width: 240px;
  flex-shrink: 0;
  height: 100%;
`;

// Chart Panel - 3 parts
const ChartWrapper = styled.div`
  flex: 3;
  min-width: 0;
  height: 100%;
`;

// Right Panel - 1 part
const RightWrapper = styled.div`
  width: 320px;
  min-width: 320px;
  flex-shrink: 0;
  height: 100%;
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Derivash = () => {
  return (
    <DashboardLayout>
      <TopBar />
      <MainContent>
        <LeftWrapper>
          <LeftPanel />
        </LeftWrapper>
        <ChartWrapper>
          <ChartPanel />
        </ChartWrapper>
        <RightWrapper>
          <RightPanel />
        </RightWrapper>
      </MainContent>
    </DashboardLayout>
  );
};

export default Derivash;