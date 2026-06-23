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
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Derivdash = () => {
  return (
    <DashboardContainer>
      <TopBar />
      <MainContent>
        <LeftPanel />
        <ChartPanel />
        <RightPanel />
      </MainContent>
    </DashboardContainer>
  );
};

export default Derivdash;