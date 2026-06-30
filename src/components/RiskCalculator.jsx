import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

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
// STYLED COMPONENTS
// ============================================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 16px;
  gap: 16px;
  overflow-y: auto;
  background: linear-gradient(180deg, #0b0e14 0%, #0f131a 100%);

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #2a2e3d;
    border-radius: 4px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.06);

  .icon {
    font-size: 28px;
  }

  .title {
    font-size: 18px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: 0.3px;
  }

  .subtitle {
    font-size: 11px;
    color: #64748b;
    font-weight: 400;
    margin-top: 2px;
  }
`;

const CapitalInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 16px;
  animation: ${fadeIn} 0.4s ease;
  animation: ${pulseGlow} 3s ease-in-out infinite;

  .label {
    font-size: 11px;
    text-transform: uppercase;
    color: #94a3b8;
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
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: rgba(41, 98, 255, 0.4);
      box-shadow: 0 0 0 3px rgba(41, 98, 255, 0.05);
    }
  }

  .prefix {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 700;
    color: #5a6070;
    background: rgba(255, 255, 255, 0.02);
    border-right: 1px solid rgba(255, 255, 255, 0.04);
  }

  .input {
    flex: 1;
    padding: 8px 12px;
    background: transparent;
    border: none;
    color: #f1f5f9;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    width: 100%;
    min-width: 0;

    &::placeholder {
      color: #3a4055;
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
    background: linear-gradient(135deg, #2962ff, #1a4fcf);
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(41, 98, 255, 0.3);
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
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  animation: ${fadeIn} 0.6s ease;
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 14px 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(56, 189, 248, 0.08);
    background: rgba(255, 255, 255, 0.025);
    transform: translateY(-2px);
  }

  .result-label {
    font-size: 9px;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-bottom: 4px;
  }

  .result-value {
    font-size: 20px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.3px;
  }

  .result-sub {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
  }

  .result-badge {
    position: absolute;
    top: 8px;
    right: 10px;
    font-size: 8px;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 600;
    letter-spacing: 0.3px;

    &.low {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }
    &.medium {
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
    }
    &.high {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  }

  .result-color-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #2962ff, #818cf8);
    opacity: 0.3;
  }

  &.full-width {
    grid-column: 1 / -1;
  }

  &.highlight {
    border-color: rgba(41, 98, 255, 0.15);
    background: rgba(41, 98, 255, 0.03);
  }

  @media (max-width: 480px) {
    padding: 12px 10px;
    .result-value {
      font-size: 17px;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  gap: 12px;
  animation: ${fadeIn} 0.5s ease;
  border: 1px dashed rgba(255, 255, 255, 0.04);
  border-radius: 12px;

  .empty-icon {
    font-size: 48px;
    opacity: 0.3;
  }

  .empty-title {
    font-size: 14px;
    font-weight: 500;
    color: #94a3b8;
  }

  .empty-sub {
    font-size: 12px;
    color: #4a4f5e;
    text-align: center;
    line-height: 1.6;
  }
`;

const RiskSummary = styled.div`
  background: rgba(56, 189, 248, 0.02);
  border: 1px solid rgba(56, 189, 248, 0.04);
  border-radius: 12px;
  padding: 14px 16px;
  animation: ${fadeIn} 0.7s ease;

  .summary-title {
    font-size: 10px;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-bottom: 8px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }

  .summary-item {
    text-align: center;
    padding: 8px 4px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;

    .value {
      font-size: 14px;
      font-weight: 700;
      color: #f1f5f9;
    }

    .label {
      font-size: 8px;
      text-transform: uppercase;
      color: #64748b;
      margin-top: 2px;
      letter-spacing: 0.3px;
    }
  }

  @media (max-width: 480px) {
    .summary-grid {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 4px;
    }
    .summary-item {
      padding: 6px 2px;
      .value { font-size: 12px; }
      .label { font-size: 7px; }
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const RiskCalculator = () => {
  const [capital, setCapital] = useState('');
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Risk management constants (based on professional trading standards)
  const RISK_PER_TRADE = 0.02; // 2% risk per trade
  const MAX_RISK_PER_DAY = 0.06; // 6% max risk per day
  const MARTINGALE_MULTIPLIER = 2;
  const RISK_REWARD_RATIO = 2; // 1:2 risk-reward ratio

  const calculateRisk = () => {
    if (!capital || parseFloat(capital) <= 0) return;

    setIsCalculating(true);
    
    // Simulate calculation delay for premium feel
    setTimeout(() => {
      const accountCapital = parseFloat(capital);
      const riskPerTrade = accountCapital * RISK_PER_TRADE;
      const maxRiskPerDay = accountCapital * MAX_RISK_PER_DAY;
      const martingaleSize = riskPerTrade * MARTINGALE_MULTIPLIER;
      const takeProfit = riskPerTrade * RISK_REWARD_RATIO;
      const stopLoss = riskPerTrade;
      
      // Additional risk metrics
      const maxTradesPerDay = Math.floor(maxRiskPerDay / riskPerTrade);
      const riskPercentage = ((riskPerTrade / accountCapital) * 100).toFixed(1);
      const rewardPotential = ((takeProfit / accountCapital) * 100).toFixed(1);
      
      // Risk level assessment
      let riskLevel = 'low';
      let riskColor = '#22c55e';
      if (riskPercentage > 2.5) {
        riskLevel = 'high';
        riskColor = '#ef4444';
      } else if (riskPercentage > 1.5) {
        riskLevel = 'medium';
        riskColor = '#fbbf24';
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
        riskColor: riskColor,
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

  return (
    <Container>
      <Header>
        <span className="icon">🧮</span>
        <div>
          <div className="title">Risk Calculator</div>
          <div className="subtitle">Professional risk management for Deriv trading</div>
        </div>
      </Header>

      <CapitalInput>
        <div className="label">
          <span>Account Capital</span>
          <span style={{ fontSize: '9px', color: '#4a4f5e' }}>Enter your total balance</span>
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
              <div className="result-label">Martingale Size</div>
              <div className="result-value">×{MARTINGALE_MULTIPLIER}</div>
              <div className="result-sub">{formatCurrency(results.martingaleSize)}</div>
              <div className="result-color-bar" />
            </ResultCard>

            <ResultCard>
              <div className="result-label">Take Profit</div>
              <div className="result-value" style={{ color: '#22c55e' }}>
                {formatCurrency(results.takeProfit)}
              </div>
              <div className="result-sub">+{results.rewardPotential}% return</div>
              <div className="result-badge low">Profit</div>
            </ResultCard>

            <ResultCard>
              <div className="result-label">Stop Loss</div>
              <div className="result-value" style={{ color: '#ef4444' }}>
                {formatCurrency(results.stopLoss)}
              </div>
              <div className="result-sub">-{results.riskPercentage}% risk</div>
              <div className={`result-badge ${getRiskBadge(results.riskLevel).className}`}>
                {getRiskBadge(results.riskLevel).label}
              </div>
            </ResultCard>

            <ResultCard fullWidth>
              <div className="result-label">Risk-Reward Ratio</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                <span className="result-value" style={{ fontSize: '16px' }}>
                  1:{RISK_REWARD_RATIO}
                </span>
                <div style={{ 
                  flex: 1, 
                  height: '4px', 
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
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {RISK_REWARD_RATIO}:1
                </span>
              </div>
              <div className="result-sub">Risk $1 to gain ${RISK_REWARD_RATIO}</div>
            </ResultCard>
          </ResultsGrid>

          <RiskSummary>
            <div className="summary-title">Risk Summary</div>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="value" style={{ color: '#22c55e' }}>{results.maxTradesPerDay}</div>
                <div className="label">Max Trades/Day</div>
              </div>
              <div className="summary-item">
                <div className="value" style={{ color: results.riskLevel === 'high' ? '#ef4444' : '#fbbf24' }}>
                  {results.riskPercentage}%
                </div>
                <div className="label">Risk per Trade</div>
              </div>
              <div className="summary-item">
                <div className="value" style={{ color: '#38bdf8' }}>
                  {results.rewardPotential}%
                </div>
                <div className="label">Reward Potential</div>
              </div>
            </div>
          </RiskSummary>
        </>
      ) : (
        <EmptyState>
          <span className="empty-icon">📊</span>
          <div className="empty-title">No Calculation Yet</div>
          <div className="empty-sub">
            Enter your account capital above and click "Calculate Risk"<br />
            to get professional risk management metrics.
          </div>
        </EmptyState>
      )}
    </Container>
  );
};

export default RiskCalculator;