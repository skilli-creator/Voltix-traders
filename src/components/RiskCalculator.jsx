import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// KEYFRAMES
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${props => props.theme.colors.accent + '15' || 'rgba(41, 98, 255, 0.08)'}; }
  50% { box-shadow: 0 0 40px ${props => props.theme.colors.accent + '30' || 'rgba(41, 98, 255, 0.15)'}; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ============================================
// STYLED COMPONENTS WITH CURRENT THEME
// ============================================

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  background: ${props => props.theme.colors.background || 'linear-gradient(180deg, #0b0e14 0%, #0f131a 100%)'};
  font-weight: 700;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const CalculatorContainer = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${props => props.theme.colors.backgroundSecondary || 'rgba(8, 18, 38, 0.92)'};
  backdrop-filter: blur(20px);
  border: 2px solid ${props => props.theme.colors.border || 'rgba(56, 189, 248, 0.06)'};
  border-radius: 20px;
  padding: 28px 24px 24px;
  box-shadow: 0 12px 40px ${props => props.theme.colors.shadow || 'rgba(0, 0, 0, 0.4)'};
  animation: ${fadeIn} 0.4s ease;
  max-height: 90vh;
  overflow-y: auto;
  font-weight: 700;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border || '#2a2e3d'};
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px 16px;
    max-width: 100%;
    border-radius: 16px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textMuted || '#94a3b8'};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.text || '#f1f5f9'};
    transform: translateX(-4px);
  }

  .arrow {
    font-size: 18px;
    line-height: 1;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border || 'rgba(56, 189, 248, 0.06)'};
  margin-bottom: 20px;
  font-weight: 700;

  .icon {
    font-size: 28px;
    width: 48px;
    height: 48px;
    background: ${props => props.theme.colors.accentActive || 'rgba(56, 189, 248, 0.05)'};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 2px solid ${props => props.theme.colors.border || 'transparent'};
  }

  .header-text {
    flex: 1;
  }

  .title {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text || '#f1f5f9'};
    letter-spacing: 0.3px;
  }

  .subtitle {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted || '#64748b'};
    font-weight: 700;
    margin-top: 1px;
  }

  @media (max-width: 480px) {
    .icon {
      width: 40px;
      height: 40px;
      font-size: 22px;
    }
    .title {
      font-size: 16px;
    }
  }
`;

const CapitalInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${props => props.theme.colors.backgroundSecondary || 'rgba(255, 255, 255, 0.015)'};
  border: 2px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.04)'};
  border-radius: 12px;
  padding: 16px;
  animation: ${pulseGlow} 3s ease-in-out infinite;
  margin-bottom: 4px;
  font-weight: 700;

  .label {
    font-size: 11px;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textMuted || '#94a3b8'};
    font-weight: 700;
    letter-spacing: 0.6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 0;
    background: ${props => props.theme.colors.background || 'rgba(255, 255, 255, 0.02)'};
    border: 2px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.04)'};
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: ${props => props.theme.colors.accent || 'rgba(41, 98, 255, 0.4)'};
      box-shadow: 0 0 20px ${props => props.theme.colors.accent + '30' || 'rgba(41, 98, 255, 0.05)'};
    }
  }

  .prefix {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.colors.textMuted || '#5a6070'};
    background: ${props => props.theme.colors.backgroundTertiary || 'rgba(255, 255, 255, 0.02)'};
    border-right: 2px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.04)'};
  }

  .input {
    flex: 1;
    padding: 8px 12px;
    background: transparent;
    border: none;
    color: ${props => props.theme.colors.text || '#f1f5f9'};
    font-size: 14px;
    font-weight: 700;
    outline: none;
    width: 100%;
    min-width: 0;

    &::placeholder {
      color: ${props => props.theme.colors.textMuted || '#3a4055'};
      font-weight: 700;
    }

    &[type="number"]::-webkit-inner-spin-button,
    &[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type="number"] { -moz-appearance: textfield; }
  }

  .calculate-btn {
    width: 100%;
    padding: 10px 0;
    margin-top: 4px;
    border: none;
    border-radius: 8px;
    background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent || '#2962ff'}, ${props.theme.colors.accent}dd)`};
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 0 30px ${props => props.theme.colors.accent + '40'};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
      animation: ${shimmer} 4s ease-in-out infinite;
      z-index: 1;
    }
  }

  @media (max-width: 480px) {
    padding: 12px;
    .prefix { padding: 6px 10px; font-size: 13px; }
    .input { padding: 6px 10px; font-size: 13px; }
    .calculate-btn { padding: 8px 0; font-size: 12px; }
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 16px;
  animation: ${fadeIn} 0.6s ease;
  font-weight: 700;

  @media (max-width: 400px) {
    gap: 6px;
  }
`;

const ResultCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary || 'rgba(255, 255, 255, 0.015)'};
  border: 2px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.04)'};
  border-radius: 10px;
  padding: 12px 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-weight: 700;

  &:hover {
    border-color: ${props => props.theme.colors.accent || 'rgba(56, 189, 248, 0.08)'};
    background: ${props => props.theme.colors.backgroundTertiary || 'rgba(255, 255, 255, 0.025)'};
  }

  .result-label {
    font-size: 9px;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textMuted || '#64748b'};
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .result-value {
    font-size: 15px;
    color: ${props => props.theme.colors.text || '#f1f5f9'};
    font-weight: 700;
    margin-top: 4px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

export default function RiskCalculator() {
  const navigate = useNavigate();
  const [capital, setCapital] = useState('');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const capitalNum = parseFloat(capital);
    if (isNaN(capitalNum) || capitalNum <= 0) return;

    // Execution Calculations based on matrix configurations
    setResults({
      stake: capitalNum * 0.01,
      target: capitalNum * 0.05,
      maxMartingale: Math.floor(Math.log(capitalNum / (capitalNum * 0.01)) / Math.log(2.1)),
    });
  };

  return (
    <PageWrapper>
      <CalculatorContainer>
        <BackButton onClick={() => navigate(-1)}>
          <span className="arrow">←</span> Back to Trading Terminal
        </BackButton>

        <Header>
          <div className="icon">📊</div>
          <div className="header-text">
            <div className="title">Risk Parameter Matrix</div>
            <div className="subtitle">Optimize mathematical trade sizes instantly</div>
          </div>
        </Header>

        <CapitalInput>
          <div className="label">
            <span>Trading Balance Account</span>
            <span>USD</span>
          </div>
          <div className="input-wrapper">
            <span className="prefix">$</span>
            <input 
              className="input" 
              type="number" 
              placeholder="0.00"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
            />
          </div>
          <button 
            className="calculate-btn" 
            disabled={!capital || parseFloat(capital) <= 0}
            onClick={handleCalculate}
          >
            Compute Matrix Strategy
          </button>
        </CapitalInput>

        {results && (
          <ResultsGrid>
            <ResultCard>
              <div className="result-label">Base Matrix Stake</div>
              <div className="result-value">${results.stake.toFixed(2)}</div>
            </ResultCard>
            <ResultCard>
              <div className="result-label">Daily Session Target</div>
              <div className="result-value">${results.target.toFixed(2)}</div>
            </ResultCard>
            <ResultCard>
              <div className="result-label">Martingale Threshold</div>
              <div className="result-value">{results.maxMartingale} Steps</div>
            </ResultCard>
            <ResultCard>
              <div className="result-label">Recommended Strategy</div>
              <div className="result-value" style={{ fontSize: '12px', color: '#10b981' }}>Alpha Bot Optimal</div>
            </ResultCard>
          </ResultsGrid>
        )}
      </CalculatorContainer>
    </PageWrapper>
  );
}