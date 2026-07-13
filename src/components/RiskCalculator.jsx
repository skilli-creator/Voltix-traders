// src/components/RiskCalculator.jsx
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
  0%, 100% { box-shadow: 0 0 20px rgba(41, 98, 255, 0.08); }
  50% { box-shadow: 0 0 40px rgba(41, 98, 255, 0.15); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ============================================
// STYLED COMPONENTS - UPDATED WITH THEME
// ============================================

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  background: ${props => props.theme.colors.background};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const CalculatorContainer = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${props => props.theme.colors.backgroundSecondary};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 28px 24px 24px;
  box-shadow: 0 20px 60px ${props => props.theme.colors.shadow};
  animation: ${fadeIn} 0.4s ease;
  max-height: 90vh;
  overflow-y: auto;
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
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
  color: ${props => props.theme.colors.textMuted};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
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
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 20px;

  .icon {
    font-size: 28px;
    width: 48px;
    height: 48px;
    background: ${props => props.theme.colors.accentActive};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .header-text {
    flex: 1;
  }

  .title {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    letter-spacing: 0.3px;
  }

  .subtitle {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 400;
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
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  animation: ${pulseGlow} 3s ease-in-out infinite;
  margin-bottom: 4px;
  transition: all 0.3s ease;

  .label {
    font-size: 11px;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 600;
    letter-spacing: 0.6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 0;
    background: ${props => props.theme.colors.background + '40'};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: ${props => props.theme.colors.accent};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.accent + '15'};
    }
  }

  .prefix {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.colors.textMuted};
    background: ${props => props.theme.colors.background + '40'};
    border-right: 1px solid ${props => props.theme.colors.border};
  }

  .input {
    flex: 1;
    padding: 8px 12px;
    background: transparent;
    border: none;
    color: ${props => props.theme.colors.text};
    font-size: 14px;
    font-weight: 500;
    outline: none;
    width: 100%;
    min-width: 0;

    &::placeholder {
      color: ${props => props.theme.colors.textMuted + '60'};
      font-weight: 400;
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
    background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
    color: ${props => props.theme.colors.text};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px ${props => props.theme.colors.accent + '50'};
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

  @media (max-width: 400px) {
    gap: 6px;
  }
`;

const ResultCard = styled.div`
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 12px 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.theme.colors.accent + '40'};
    background: ${props => props.theme.colors.background + '60'};
  }

  .result-label {
    font-size: 9px;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-bottom: 3px;
  }

  .result-value {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.3px;
  }

  .result-sub {
    font-size: 10px;
    color: ${props => props.theme.colors.textMuted};
    margin-top: 2px;
  }

  .result-badge {
    position: absolute;
    top: 6px;
    right: 8px;
    font-size: 7px;
    text-transform: uppercase;
    padding: 1px 6px;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;

    &.low {
      background: rgba(34, 197, 94, 0.15);
      color: ${props => props.theme.colors.success};
    }
    &.medium {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }
    &.high {
      background: rgba(239, 68, 68, 0.15);
      color: ${props => props.theme.colors.danger};
    }
  }

  .result-color-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => `linear-gradient(90deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
    opacity: 0.3;
  }

  &.full-width {
    grid-column: 1 / -1;
  }

  &.highlight {
    border-color: ${props => props.theme.colors.accent + '30'};
    background: ${props => props.theme.colors.accentActive};
  }

  @media (max-width: 480px) {
    padding: 10px 8px;
    .result-value {
      font-size: 15px;
    }
    .result-label {
      font-size: 8px;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  gap: 10px;
  animation: ${fadeIn} 0.5s ease;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-top: 16px;

  .empty-icon {
    font-size: 40px;
    opacity: 0.3;
  }

  .empty-title {
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.colors.textMuted};
  }

  .empty-sub {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted + '80'};
    text-align: center;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    padding: 18px 12px;
    .empty-icon { font-size: 32px; }
    .empty-title { font-size: 12px; }
    .empty-sub { font-size: 10px; }
  }
`;

const RiskSummary = styled.div`
  background: ${props => props.theme.colors.accentActive};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  animation: ${fadeIn} 0.7s ease;
  margin-top: 8px;

  .summary-title {
    font-size: 9px;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-bottom: 6px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
  }

  .summary-item {
    text-align: center;
    padding: 6px 2px;
    background: ${props => props.theme.colors.background + '40'};
    border-radius: 6px;

    .value {
      font-size: 13px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
    }

    .label {
      font-size: 7px;
      text-transform: uppercase;
      color: ${props => props.theme.colors.textMuted};
      margin-top: 1px;
      letter-spacing: 0.3px;
    }
  }

  @media (max-width: 480px) {
    padding: 10px 10px;
    .summary-item {
      .value { font-size: 11px; }
      .label { font-size: 6px; }
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const RiskCalculator = () => {
  const navigate = useNavigate();
  const [capital, setCapital] = useState('');
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Risk management constants
  const RISK_PER_TRADE = 0.02;
  const MAX_RISK_PER_DAY = 0.06;
  const MARTINGALE_MULTIPLIER = 2;
  const RISK_REWARD_RATIO = 2;

  const calculateRisk = () => {
    if (!capital || parseFloat(capital) <= 0) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      const accountCapital = parseFloat(capital);
      const riskPerTrade = accountCapital * RISK_PER_TRADE;
      const maxRiskPerDay = accountCapital * MAX_RISK_PER_DAY;
      const martingaleSize = riskPerTrade * MARTINGALE_MULTIPLIER;
      const takeProfit = riskPerTrade * RISK_REWARD_RATIO;
      const stopLoss = riskPerTrade;
      
      const maxTradesPerDay = Math.floor(maxRiskPerDay / riskPerTrade);
      const riskPercentage = ((riskPerTrade / accountCapital) * 100).toFixed(1);
      const rewardPotential = ((takeProfit / accountCapital) * 100).toFixed(1);
      
      let riskLevel = 'low';
      if (riskPercentage > 2.5) {
        riskLevel = 'high';
      } else if (riskPercentage > 1.5) {
        riskLevel = 'medium';
      }

      setResults({
        stake: riskPerTrade,
        martingaleSize: martingaleSize,
        takeProfit: takeProfit,
        stopLoss: stopLoss,
        maxTradesPerDay: maxTradesPerDay,
        riskPercentage: riskPercentage,
        rewardPotential: rewardPotential,
        riskLevel: riskLevel,
        accountCapital: accountCapital,
      });
      
      setIsCalculating(false);
    }, 600);
  };

  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };

  const getRiskBadge = (level) => {
    const badges = {
      low: { label: 'Low Risk', className: 'low' },
      medium: { label: 'Medium Risk', className: 'medium' },
      high: { label: 'High Risk', className: 'high' },
    };
    return badges[level] || badges.low;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <PageWrapper>
      <CalculatorContainer>
        <BackButton onClick={handleGoBack}>
          <span className="arrow">←</span> Back
        </BackButton>

        <Header>
          <div className="icon">🧮</div>
          <div className="header-text">
            <div className="title">Risk Calculator</div>
            <div className="subtitle">Professional risk management</div>
          </div>
        </Header>

        <CapitalInput>
          <div className="label">
            <span>Account Capital</span>
            <span style={{ fontSize: '9px', color: '#4a4f5e' }}>Enter balance</span>
          </div>
          <div className="input-wrapper">
            <span className="prefix">$</span>
            <input
              className="input"
              type="number"
              placeholder="0.00"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') calculateRisk();
              }}
            />
          </div>
          <button 
            className="calculate-btn" 
            onClick={calculateRisk}
            disabled={!capital || parseFloat(capital) <= 0 || isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Risk'}
          </button>
        </CapitalInput>

        {results ? (
          <>
            <ResultsGrid>
              <ResultCard className="highlight">
                <div className="result-label">Stake</div>
                <div className="result-value">{formatCurrency(results.stake)}</div>
                <div className="result-sub">per trade</div>
                <div className="result-color-bar" />
              </ResultCard>

              <ResultCard className="highlight">
                <div className="result-label">Martingale</div>
                <div className="result-value">×{MARTINGALE_MULTIPLIER}</div>
                <div className="result-sub">{formatCurrency(results.martingaleSize)}</div>
                <div className="result-color-bar" />
              </ResultCard>

              <ResultCard>
                <div className="result-label">Take Profit</div>
                <div className="result-value" style={{ color: '#22c55e' }}>
                  {formatCurrency(results.takeProfit)}
                </div>
                <div className="result-sub">+{results.rewardPotential}%</div>
                <div className="result-badge low">Profit</div>
              </ResultCard>

              <ResultCard>
                <div className="result-label">Stop Loss</div>
                <div className="result-value" style={{ color: '#ef4444' }}>
                  {formatCurrency(results.stopLoss)}
                </div>
                <div className="result-sub">-{results.riskPercentage}%</div>
                <div className={`result-badge ${getRiskBadge(results.riskLevel).className}`}>
                  {getRiskBadge(results.riskLevel).label}
                </div>
              </ResultCard>

              <ResultCard fullWidth>
                <div className="result-label">Risk-Reward Ratio</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                  <span className="result-value" style={{ fontSize: '15px' }}>
                    1:{RISK_REWARD_RATIO}
                  </span>
                  <div style={{ 
                    flex: 1, 
                    height: '3px', 
                    background: 'rgba(255,255,255,0.04)', 
                    borderRadius: '4px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${(RISK_REWARD_RATIO / 3) * 100}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #22c55e, #38bdf8)',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                    {RISK_REWARD_RATIO}:1
                  </span>
                </div>
                <div className="result-sub">Risk $1 to gain ${RISK_REWARD_RATIO}</div>
              </ResultCard>
            </ResultsGrid>

            <RiskSummary>
              <div className="summary-title">Quick Summary</div>
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="value" style={{ color: '#22c55e' }}>{results.maxTradesPerDay}</div>
                  <div className="label">Max/Day</div>
                </div>
                <div className="summary-item">
                  <div className="value" style={{ color: results.riskLevel === 'high' ? '#ef4444' : '#fbbf24' }}>
                    {results.riskPercentage}%
                  </div>
                  <div className="label">Risk/Trade</div>
                </div>
                <div className="summary-item">
                  <div className="value" style={{ color: '#38bdf8' }}>
                    {results.rewardPotential}%
                  </div>
                  <div className="label">Reward</div>
                </div>
              </div>
            </RiskSummary>
          </>
        ) : (
          <EmptyState>
            <span className="empty-icon">📊</span>
            <div className="empty-title">No Calculation Yet</div>
            <div className="empty-sub">
              Enter your account capital above<br />
              to get professional risk metrics.
            </div>
          </EmptyState>
        )}
      </CalculatorContainer>
    </PageWrapper>
  );
};

export default RiskCalculator;