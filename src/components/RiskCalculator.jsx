// src/components/OptionSideBar.jsx
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// KEYFRAMES
// ============================================
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(41, 98, 255, 0.08); }
  50% { box-shadow: 0 0 40px rgba(41, 98, 255, 0.15); }
`;

const modalSlideIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const modalBackdrop = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ============================================
// SVG ICONS
// ============================================

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const VoiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const VoiceOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const AcademyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const AccountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const ManagementIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const RiskIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const TermsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CompanyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9z" />
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CloseXIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ============================================
// RISK CALCULATOR SVG ICONS
// ============================================

const RiskCalculatorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="16" y1="10" x2="8" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="12" y2="18" />
  </svg>
);

// ============================================
// RISK CALCULATOR COMPONENT (Integrated)
// ============================================

const RiskCalculatorContent = ({ onClose }) => {
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

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  const getRiskBadge = (level) => {
    const badges = {
      low: { label: 'Low Risk', className: 'low' },
      medium: { label: 'Medium Risk', className: 'medium' },
      high: { label: 'High Risk', className: 'high' },
    };
    return badges[level] || badges.low;
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <div style={{
        background: 'rgba(8, 18, 38, 0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.06)',
        borderRadius: '16px',
        padding: '20px 18px 18px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        maxHeight: '70vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.06)',
          marginBottom: '16px',
        }}>
          <div style={{
            fontSize: '24px',
            width: '44px',
            height: '44px',
            background: 'rgba(56, 189, 248, 0.05)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#3B82F6',
          }}>
            <RiskCalculatorIcon />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '0.3px' }}>Risk Calculator</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '400', marginTop: '1px' }}>Professional risk management</div>
          </div>
        </div>

        {/* Capital Input */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.015)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
          padding: '14px',
          animation: `${pulseGlow} 3s ease-in-out infinite`,
          marginBottom: '4px',
        }}>
          <div style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            color: '#94a3b8',
            fontWeight: '600',
            letterSpacing: '0.6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>Account Capital</span>
            <span style={{ fontSize: '8px', color: '#4a4f5e' }}>Enter balance</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '8px',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
          }}>
            <span style={{
              padding: '7px 10px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#5a6070',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRight: '1px solid rgba(255, 255, 255, 0.04)',
            }}>$</span>
            <input
              type="number"
              placeholder="0.00"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') calculateRisk(); }}
              style={{
                flex: 1,
                padding: '7px 10px',
                background: 'transparent',
                border: 'none',
                color: '#f1f5f9',
                fontSize: '13px',
                fontWeight: '500',
                outline: 'none',
                width: '100%',
                minWidth: '0',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            onClick={calculateRisk}
            disabled={!capital || parseFloat(capital) <= 0 || isCalculating}
            style={{
              width: '100%',
              padding: '9px 0',
              border: 'none',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2962ff, #1a4fcf)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              opacity: (!capital || parseFloat(capital) <= 0 || isCalculating) ? 0.5 : 1,
            }}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Risk'}
          </button>
        </div>

        {/* Results */}
        {results ? (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              marginTop: '14px',
            }}>
              <div style={{
                background: 'rgba(41, 98, 255, 0.03)',
                border: '1px solid rgba(41, 98, 255, 0.08)',
                borderRadius: '8px',
                padding: '10px 8px',
                gridColumn: '1 / -1',
              }}>
                <div style={{ fontSize: '8px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.6px', marginBottom: '2px' }}>Stake</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>{formatCurrency(results.stake)}</div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>per trade</div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                padding: '10px 8px',
              }}>
                <div style={{ fontSize: '8px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.6px', marginBottom: '2px' }}>Martingale</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>×{MARTINGALE_MULTIPLIER}</div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>{formatCurrency(results.martingaleSize)}</div>
              </div>

              <div style={{
                background: 'rgba(34, 197, 94, 0.03)',
                border: '1px solid rgba(34, 197, 94, 0.08)',
                borderRadius: '8px',
                padding: '10px 8px',
              }}>
                <div style={{ fontSize: '8px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.6px', marginBottom: '2px' }}>Take Profit</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#22c55e' }}>{formatCurrency(results.takeProfit)}</div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>+{results.rewardPotential}%</div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.03)',
                border: '1px solid rgba(239, 68, 68, 0.08)',
                borderRadius: '8px',
                padding: '10px 8px',
              }}>
                <div style={{ fontSize: '8px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.6px', marginBottom: '2px' }}>Stop Loss</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444' }}>{formatCurrency(results.stopLoss)}</div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>-{results.riskPercentage}%</div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                padding: '10px 8px',
                gridColumn: '1 / -1',
              }}>
                <div style={{ fontSize: '8px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.6px', marginBottom: '2px' }}>Risk-Reward Ratio</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>1:{RISK_REWARD_RATIO}</span>
                  <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: `${(RISK_REWARD_RATIO / 3) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #38bdf8)', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '9px', color: '#94a3b8' }}>{RISK_REWARD_RATIO}:1</span>
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>Risk $1 to gain ${RISK_REWARD_RATIO}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(56, 189, 248, 0.02)',
              border: '1px solid rgba(56, 189, 248, 0.04)',
              borderRadius: '8px',
              padding: '10px 12px',
              marginTop: '8px',
            }}>
              <div style={{ fontSize: '8px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.6px', marginBottom: '4px' }}>Quick Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
                <div style={{ textAlign: 'center', padding: '4px 2px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#22c55e' }}>{results.maxTradesPerDay}</div>
                  <div style={{ fontSize: '6px', textTransform: 'uppercase', color: '#64748b', marginTop: '1px', letterSpacing: '0.3px' }}>Max/Day</div>
                </div>
                <div style={{ textAlign: 'center', padding: '4px 2px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: results.riskLevel === 'high' ? '#ef4444' : '#fbbf24' }}>{results.riskPercentage}%</div>
                  <div style={{ fontSize: '6px', textTransform: 'uppercase', color: '#64748b', marginTop: '1px', letterSpacing: '0.3px' }}>Risk/Trade</div>
                </div>
                <div style={{ textAlign: 'center', padding: '4px 2px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8' }}>{results.rewardPotential}%</div>
                  <div style={{ fontSize: '6px', textTransform: 'uppercase', color: '#64748b', marginTop: '1px', letterSpacing: '0.3px' }}>Reward</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 16px',
            gap: '8px',
            border: '1px dashed rgba(255, 255, 255, 0.04)',
            borderRadius: '10px',
            marginTop: '14px',
          }}>
            <div style={{ fontSize: '32px', opacity: '0.3' }}>📊</div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}>No Calculation Yet</div>
            <div style={{ fontSize: '10px', color: '#4a4f5e', textAlign: 'center', lineHeight: '1.6' }}>
              Enter your account capital above<br />
              to get professional risk metrics.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MODAL COMPONENTS
// ============================================

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${modalBackdrop} 0.3s ease;
`;

const ModalContainer = styled.div`
  max-width: 520px;
  width: 100%;
  max-height: 85vh;
  background: ${props => props.theme?.colors?.surface || '#0F172A'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  border-radius: 20px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
  animation: ${modalSlideIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${props => props.theme?.colors?.accent || '#3B82F6'}, 
      ${props => props.theme?.colors?.accent + '60' || '#60A5FA'}, 
      ${props => props.theme?.colors?.accent || '#3B82F6'}
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    margin: 12px;
    border-radius: 16px;
    max-height: 90vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px 22px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  flex-shrink: 0;

  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.06)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
    flex-shrink: 0;
  }

  .title-text {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    letter-spacing: -0.3px;
  }

  .title-badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 12px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.06)'};
    color: ${props => props.theme?.colors?.accent || '#3B82F6'};
    border: 1px solid ${props => props.theme?.colors?.accent + '20' || 'rgba(59, 130, 246, 0.06)'};
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
    background: transparent;
    color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
      color: ${props => props.theme?.colors?.text || '#F8FAFC'};
      background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.04)'};
      transform: rotate(90deg);
    }
  }

  @media (max-width: 480px) {
    padding: 14px 16px 10px 16px;
    .title-text { font-size: 14px; }
    .title-icon { width: 30px; height: 30px; }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 18px 22px 22px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.06)'};
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px 16px;
  }
`;

// ============================================
// SIDEBAR COMPONENTS
// ============================================

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${props => props.theme?.colors?.overlay || 'rgba(10, 15, 29, 0.7)'};
  backdrop-filter: blur(4px);
  z-index: 98;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  @media (min-width: 769px) { display: none; }
`;

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${props => props.theme?.colors?.sidebarBackground || props.theme?.colors?.surface || '#0F172A'};
  border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  transform: ${props => (props.isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 4px 0 24px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.25)'};
  @media (max-width: 768px) { width: 290px; }
  @media (max-width: 480px) { width: 100%; }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 100;
  background: ${props => props.theme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme?.colors?.textMuted || '#94A3B8'};
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.12)'};
    color: ${props => props.theme?.colors?.text || '#FFFFFF'};
    border-color: ${props => props.theme?.colors?.accent || '#3B82F6'};
  }
  @media (max-width: 768px) { display: ${props => (props.isOpen ? 'flex' : 'none')}; }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: ${props => props.theme?.colors?.scrollbar || 'rgba(255, 255, 255, 0.12)'}; border-radius: 99px; }
  &::-webkit-scrollbar-thumb:hover { background: ${props => props.theme?.colors?.textMuted || 'rgba(255, 255, 255, 0.25)'}; }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 16px 10px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  animation: ${slideIn} 0.3s ease;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.gradientPrimary || `linear-gradient(135deg, ${props.theme?.colors?.accent || '#3B82F6'}, #1D4ED8)`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.buttonText || '#ffffff'};
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}40` : 'rgba(59, 130, 246, 0.3)')};
    flex-shrink: 0;
  }

  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 13.5px; font-weight: 600; color: ${props => props.theme?.colors?.text || '#F8FAFC'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-email { font-size: 11px; color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: ${slideIn} 0.4s ease;
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMuted || '#64748B'};
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 8px;
  margin-bottom: 4px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${props => (props.active ? (props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.08)') : 'transparent')};
  color: ${props => (props.active ? (props.theme?.colors?.accent || '#3B82F6') : (props.theme?.colors?.textSecondary || '#CBD5E1'))};

  &:hover {
    background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.06)'};
    color: ${props => props.theme?.colors?.text || '#F8FAFC'};
    transform: translateX(2px);
  }

  ${props => props.active && css`
    font-weight: 600;
    &::before {
      content: '';
      position: absolute;
      left: -14px;
      top: 50%;
      transform: translateY(-50%);
      width: 3.5px;
      height: 18px;
      background: ${props.theme?.colors?.accent || '#3B82F6'};
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 10px ${props.theme?.colors?.accent || '#3B82F6'};
    }
  `}

  .nav-icon { width: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s ease; }
  &:hover .nav-icon { transform: scale(1.1); }
  .nav-label { flex: 1; font-size: 12.5px; letter-spacing: 0.1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 6px;
    background: ${props => (props.active ? (props.theme?.colors?.accent || '#3B82F6') : (props.theme?.colors?.badgeBg || 'rgba(255, 255, 255, 0.06)'))};
    color: ${props => (props.active ? (props.theme?.colors?.buttonText || '#FFFFFF') : (props.theme?.colors?.textMuted || '#94A3B8'))};
    text-transform: uppercase;
    letter-spacing: 0.4px;
    flex-shrink: 0;
  }

  .notification-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${props => props.theme?.colors?.danger || '#EF4444'};
    animation: ${pulseGlow} 2s infinite;
    flex-shrink: 0;
  }
`;

const SideCard = styled.div`
  padding: 12px 14px;
  border-radius: 8px;
  background: ${props => props.theme?.colors?.cardBackground || 'rgba(15, 23, 42, 0.4)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  animation: ${fadeIn} 0.4s ease;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}50` : 'rgba(59, 130, 246, 0.3)')};
    box-shadow: 0 4px 16px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.15)'};
  }

  .card-title { font-size: 11.5px; font-weight: 600; color: ${props => props.theme?.colors?.text || '#F8FAFC'}; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; .icon { display: flex; align-items: center; justify-content: center; } }
  .card-item { font-size: 10.5px; color: ${props => props.theme?.colors?.textSecondary || '#94A3B8'}; padding: 3px 0; display: flex; align-items: flex-start; gap: 6px; line-height: 1.4; .bullet { color: ${props => props.theme?.colors?.accent || '#3B82F6'}; font-weight: 700; flex-shrink: 0; } .highlight { color: ${props => props.theme?.colors?.text || '#F8FAFC'}; font-weight: 600; } }
  .learn-more { margin-top: 8px; font-size: 10.5px; color: ${props => props.theme?.colors?.accent || '#3B82F6'}; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease; &:hover { gap: 7px; color: ${props => props.theme?.colors?.accentHover || '#60A5FA'}; } }
`;

const FeedbackSection = styled.div`
  padding: 14px;
  border-radius: 8px;
  background: ${props => props.theme?.colors?.cardBackground || 'rgba(15, 23, 42, 0.4)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  animation: ${fadeIn} 0.4s ease;

  .feedback-label { font-size: 11px; font-weight: 600; color: ${props => props.theme?.colors?.textMuted || '#94A3B8'}; margin-bottom: 8px; text-align: center; }
  .stars { display: flex; gap: 6px; margin-bottom: 8px; justify-content: center; }
  .star-btn {
    background: transparent; border: none; padding: 0; cursor: pointer; color: ${props => props.theme?.colors?.starInactive || 'rgba(255, 255, 255, 0.12)'}; transition: all 0.15s ease; display: flex; align-items: center; justify-content: center;
    svg { width: 20px; height: 20px; fill: currentColor; }
    &:hover { transform: scale(1.2); }
    &.active, &.hover { color: ${props => props.theme?.colors?.starActive || '#F59E0B'}; filter: drop-shadow(0 0 6px ${props => (props.theme?.colors?.starActive ? `${props.theme.colors.starActive}60` : 'rgba(245, 158, 11, 0.3)')}); }
  }
  .star-rating-text { text-align: center; font-size: 10.5px; font-weight: 600; margin-bottom: 10px; min-height: 16px; color: ${props => props.theme?.colors?.textSecondary || '#CBD5E1'}; }
  .feedback-textarea {
    width: 100%; min-height: 64px; padding: 8px 10px; background: ${props => props.theme?.colors?.inputBackground || 'rgba(255, 255, 255, 0.02)'}; border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'}; border-radius: 6px; color: ${props => props.theme?.colors?.text || '#F8FAFC'}; font-size: 11.5px; font-family: inherit; resize: none; outline: none; transition: all 0.2s ease; margin-bottom: 10px;
    &::placeholder { color: ${props => props.theme?.colors?.textMuted || '#64748B'}; }
    &:focus { border-color: ${props => props.theme?.colors?.accent || '#3B82F6'}; box-shadow: 0 0 0 2px ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}25` : 'rgba(59, 130, 246, 0.1)')}; }
  }
  .feedback-submit {
    width: 100%; padding: 8px 0; border: none; border-radius: 6px; background: ${props => props.theme?.colors?.accent || '#3B82F6'}; color: ${props => props.theme?.colors?.buttonText || '#ffffff'}; font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
    &:hover:not(:disabled) { background: ${props => props.theme?.colors?.accentHover || '#2563EB'}; box-shadow: 0 4px 12px ${props => (props.theme?.colors?.accent ? `${props.theme.colors.accent}35` : 'rgba(59, 130, 246, 0.15)')}; }
    &:active:not(:disabled) { transform: scale(0.98); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
  .feedback-status { margin-top: 8px; font-size: 10.5px; text-align: center; color: ${props => props.theme?.colors?.success || '#10B981'}; font-weight: 500; }
`;

const SidebarFooter = styled.footer`
  flex-shrink: 0;
  padding: 12px 14px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.08)'};
  background: ${props => props.theme?.colors?.sidebarBackground || '#0F172A'};
  display: flex;
  flex-direction: column;
  gap: 2px;

  .footer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${props => props.theme?.colors?.textSecondary || '#94A3B8'};
    font-size: 12px;
    font-weight: 500;
    &:hover { background: ${props => props.theme?.colors?.accentLight || 'rgba(59, 130, 246, 0.06)'}; color: ${props => props.theme?.colors?.text || '#F8FAFC'}; }
    .footer-icon { display: flex; align-items: center; justify-content: center; }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const OptionSideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('academy');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);
  
  // Voice states
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(70);
  const [voiceEvents, setVoiceEvents] = useState({ trade: true, price: true, market: false, system: true });
  
  // Popup state
  const [popupData, setPopupData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRiskCalculatorOpen, setIsRiskCalculatorOpen] = useState(false);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) onClose();
  };

  const openPopup = (data) => {
    setPopupData(data);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setPopupData(null), 300);
  };

  const handleNavClick = (item, path) => {
    setActiveItem(item);
    if (path) navigate(path);
    closeSidebarOnMobile();
  };

  // ===== ALL POPUP HANDLERS =====
  const handleNotificationsClick = () => {
    setActiveItem('notifications');
    setHasNotifications(false);
    openPopup({
      title: 'Notifications',
      icon: <BellIcon />,
      badge: '2 New',
      content: (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.04)', marginBottom: '4px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', background: 'rgba(16, 185, 129, 0.08)', color: '#10B981' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#F8FAFC' }}>Trade Executed</div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '400', lineHeight: '1.4' }}>Buy order #TRX-7841 filled at $12,450.00</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px', fontWeight: '400' }}>2 min ago</div>
            </div>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6', flexShrink: '0', marginTop: '3px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.04)', marginBottom: '4px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', background: 'rgba(59, 130, 246, 0.08)', color: '#3B82F6' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', font-weight: '600', color: '#F8FAFC' }}>Market Alert</div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '400', lineHeight: '1.4' }}>Volatility 100 (1s) Index reached resistance level</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px', fontWeight: '400' }}>15 min ago</div>
            </div>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6', flexShrink: '0', marginTop: '3px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', background: 'rgba(16, 185, 129, 0.08)', color: '#10B981' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', font-weight: '600', color: '#F8FAFC' }}>Position Closed</div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '400', lineHeight: '1.4' }}>Sell order #TRX-7839 closed at $5,670.00</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px', fontWeight: '400' }}>1 hour ago</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', borderRadius: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', background: 'rgba(59, 130, 246, 0.08)', color: '#3B82F6' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', font-weight: '600', color: '#F8FAFC' }}>System Update</div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '400', lineHeight: '1.4' }}>New trading features available in version 2.1.0</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px', fontWeight: '400' }}>3 hours ago</div>
            </div>
          </div>
        </>
      )
    });
  };

  const handleVoiceClick = () => {
    setActiveItem('voice');
    openPopup({
      title: 'Voice Notifications',
      icon: voiceEnabled ? <VoiceIcon /> : <VoiceOffIcon />,
      badge: voiceEnabled ? 'Active' : 'Muted',
      content: (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.04)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#F8FAFC' }}>Voice Notifications</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 8px', borderRadius: '8px', color: voiceEnabled ? '#10B981' : '#94A3B8', background: voiceEnabled ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.02)' }}>{voiceEnabled ? 'On' : 'Off'}</span>
              <button onClick={() => setVoiceEnabled(!voiceEnabled)} style={{ width: '40px', height: '24px', borderRadius: '12px', border: 'none', background: voiceEnabled ? '#3B82F6' : '#2a2e3d', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', flexShrink: '0' }}>
                <div style={{ position: 'absolute', top: '2px', left: voiceEnabled ? '20px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#ffffff', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.04)', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#CBD5E1', minWidth: '30px' }}>Vol</span>
            <input type="range" min="0" max="100" value={voiceVolume} onChange={(e) => setVoiceVolume(parseInt(e.target.value))} disabled={!voiceEnabled} style={{ flex: 1, WebkitAppearance: 'none', height: '3px', borderRadius: '2px', background: '#2a2e3d', outline: 'none' }} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', minWidth: '26px', textAlign: 'right' }}>{voiceVolume}%</span>
          </div>
          <div style={{ padding: '5px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: '500', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: voiceEvents.trade ? '#10B981' : '#94A3B8' }} />Trade Execution</span>
            <span onClick={() => setVoiceEvents({...voiceEvents, trade: !voiceEvents.trade})} style={{ fontSize: '9px', fontWeight: '700', color: voiceEvents.trade ? '#10B981' : '#94A3B8', cursor: 'pointer', padding: '1px 8px', borderRadius: '6px', background: voiceEvents.trade ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)' }}>{voiceEvents.trade ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div style={{ padding: '5px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: '500', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: voiceEvents.price ? '#10B981' : '#94A3B8' }} />Price Alerts</span>
            <span onClick={() => setVoiceEvents({...voiceEvents, price: !voiceEvents.price})} style={{ fontSize: '9px', fontWeight: '700', color: voiceEvents.price ? '#10B981' : '#94A3B8', cursor: 'pointer', padding: '1px 8px', borderRadius: '6px', background: voiceEvents.price ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)' }}>{voiceEvents.price ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div style={{ padding: '5px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: '500', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: voiceEvents.market ? '#10B981' : '#94A3B8' }} />Market Signals</span>
            <span onClick={() => setVoiceEvents({...voiceEvents, market: !voiceEvents.market})} style={{ fontSize: '9px', fontWeight: '700', color: voiceEvents.market ? '#10B981' : '#94A3B8', cursor: 'pointer', padding: '1px 8px', borderRadius: '6px', background: voiceEvents.market ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)' }}>{voiceEvents.market ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div style={{ padding: '5px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: '500', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: voiceEvents.system ? '#10B981' : '#94A3B8' }} />System Updates</span>
            <span onClick={() => setVoiceEvents({...voiceEvents, system: !voiceEvents.system})} style={{ fontSize: '9px', fontWeight: '700', color: voiceEvents.system ? '#10B981' : '#94A3B8', cursor: 'pointer', padding: '1px 8px', borderRadius: '6px', background: voiceEvents.system ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)' }}>{voiceEvents.system ? 'Enabled' : 'Disabled'}</span>
          </div>
        </>
      )
    });
  };

  const handleAccountInfoClick = () => {
    setActiveItem('account-info');
    openPopup({
      title: 'Deriv Account Information',
      icon: <AccountIcon />,
      content: (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>Account ID</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC' }}>ACC-8472-001</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>Account Type</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC' }}>Real Trading</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>Balance</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#10B981' }}>$7,110.00 USD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>Status</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#10B981' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                Active
              </span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>Joined</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC' }}>January 2026</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>Last Login</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC' }}>Today, 14:32</span>
          </div>
        </>
      )
    });
  };

  const handleRiskCalculatorClick = () => {
    setActiveItem('risk-calculator');
    setIsRiskCalculatorOpen(true);
    openPopup({
      title: 'Risk Calculator',
      icon: <RiskIcon />,
      content: <RiskCalculatorContent onClose={closePopup} />
    });
  };

  const handleHowToUseClick = () => {
    setActiveItem('how-to-use');
    openPopup({
      title: 'How to Use This Tool',
      icon: <BookIcon />,
      content: (
        <>
          <div style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.06)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0', border: '1px solid rgba(59, 130, 246, 0.06)' }}>1</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: '600', color: '#F8FAFC', marginBottom: '1px' }}>Connect Your Account</div><div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '400', lineHeight: '1.5' }}>Link your Deriv account to access real-time trading data.</div></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.06)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0', border: '1px solid rgba(59, 130, 246, 0.06)' }}>2</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: '600', color: '#F8FAFC', marginBottom: '1px' }}>Select a Market</div><div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '400', lineHeight: '1.5' }}>Choose from multiple volatility indices to start trading.</div></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.06)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0', border: '1px solid rgba(59, 130, 246, 0.06)' }}>3</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: '600', color: '#F8FAFC', marginBottom: '1px' }}>Choose Your Strategy</div><div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '400', lineHeight: '1.5' }}>Select manual, auto, or bot-assisted trading modes.</div></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.06)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0', border: '1px solid rgba(59, 130, 246, 0.06)' }}>4</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: '600', color: '#F8FAFC', marginBottom: '1px' }}>Monitor Your Positions</div><div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '400', lineHeight: '1.5' }}>Track open positions and manage risk in real-time.</div></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', padding: '10px 0' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.06)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0', border: '1px solid rgba(59, 130, 246, 0.06)' }}>5</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: '600', color: '#F8FAFC', marginBottom: '1px' }}>Customize Experience</div><div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '400', lineHeight: '1.5' }}>Personalize themes and notification settings.</div></div>
          </div>
        </>
      )
    });
  };

  const handleTermsClick = () => {
    setActiveItem('terms');
    openPopup({
      title: 'Terms & Conditions',
      icon: <TermsIcon />,
      badge: 'v2.0',
      content: (
        <>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>1. Introduction</div>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#CBD5E1', fontWeight: '400' }}>Welcome to MyTradeApp. By using our third-party trading application, you agree to these Terms and Conditions.</div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>2. Acceptance of Terms</div>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#CBD5E1', fontWeight: '400' }}>By accessing or using MyTradeApp, you confirm that you have read, understood, and agree to be bound by these Terms.</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '2px 0', fontSize: '11px', lineHeight: '1.6', color: '#CBD5E1', fontWeight: '400' }}>
              <span style={{ color: '#3B82F6', fontWeight: '700', flexShrink: '0', marginTop: '2px' }}>•</span>
              <span>You must be at least <strong style={{ color: '#F8FAFC' }}>18 years old</strong> to use this App.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '2px 0', fontSize: '11px', lineHeight: '1.6', color: '#CBD5E1', fontWeight: '400' }}>
              <span style={{ color: '#3B82F6', fontWeight: '700', flexShrink: '0', marginTop: '2px' }}>•</span>
              <span>You are <strong style={{ color: '#F8FAFC' }}>solely responsible</strong> for all trading decisions.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '2px 0', fontSize: '11px', lineHeight: '1.6', color: '#CBD5E1', fontWeight: '400' }}>
              <span style={{ color: '#3B82F6', fontWeight: '700', flexShrink: '0', marginTop: '2px' }}>•</span>
              <span>Trading involves <strong style={{ color: '#EF4444' }}>significant financial risk</strong>.</span>
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>3. Services Provided</div>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#CBD5E1', fontWeight: '400' }}>MyTradeApp provides automated trading, AI-assisted analysis, manual trading, bot deployment, and real-time market data from Deriv via APIs.</div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>4. Account Responsibility</div>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#CBD5E1', fontWeight: '400' }}>You are fully responsible for all trades executed through the App. MyTradeApp does not store your login credentials.</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '2px 0', fontSize: '11px', lineHeight: '1.6', color: '#CBD5E1', fontWeight: '400' }}>
              <span style={{ color: '#3B82F6', fontWeight: '700', flexShrink: '0', marginTop: '2px' }}>•</span>
              <span>You must <strong style={{ color: '#F8FAFC' }}>not share</strong> your trading credentials.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '2px 0', fontSize: '11px', lineHeight: '1.6', color: '#CBD5E1', fontWeight: '400' }}>
              <span style={{ color: '#3B82F6', fontWeight: '700', flexShrink: '0', marginTop: '2px' }}>•</span>
              <span>You are responsible for <strong style={{ color: '#F8FAFC' }}>all financial losses</strong>.</span>
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>5. Limitation of Liability</div>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#CBD5E1', fontWeight: '400' }}>MyTradeApp provides the App "as is" without any warranties. We are not liable for any financial losses, technical issues, or damages arising from your use of the App.</div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>6. Privacy Policy</div>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#CBD5E1', fontWeight: '400' }}>We do not store your Deriv or Forex login credentials. We collect minimal data necessary for app functionality and never sell your personal data.</div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>7. Governing Law</div>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#CBD5E1', fontWeight: '400' }}>These Terms shall be governed by the laws of the jurisdiction where MyTradeApp operates.</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>8. Contact Us</div>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#CBD5E1', fontWeight: '400' }}>For questions or concerns, contact us at <strong style={{ color: '#3B82F6' }}>support@mytradeapp.com</strong></div>
          </div>
        </>
      )
    });
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) { setSubmitStatus('Please select a rating'); setTimeout(() => setSubmitStatus(''), 3000); return; }
    if (!feedbackText.trim()) { setSubmitStatus('Please write your feedback'); setTimeout(() => setSubmitStatus(''), 3000); return; }
    setIsSubmitting(true);
    setSubmitStatus('Sending feedback...');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('Thank you for your feedback!');
      setRating(0);
      setFeedbackText('');
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      setSubmitStatus('Failed to send. Please try again.');
      setTimeout(() => setSubmitStatus(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (value) => {
    const texts = { 1: 'Needs Improvement', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };
    return texts[value] || '';
  };

  return (
    <>
      <ModalOverlay isOpen={isPopupOpen} onClick={closePopup}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <div className="title-group">
              <span className="title-icon">{popupData?.icon}</span>
              <span className="title-text">{popupData?.title}</span>
              {popupData?.badge && <span className="title-badge">{popupData.badge}</span>}
            </div>
            <button className="close-btn" onClick={closePopup}><CloseXIcon /></button>
          </ModalHeader>
          <ModalBody>{popupData?.content}</ModalBody>
        </ModalContainer>
      </ModalOverlay>

      <Overlay isOpen={isOpen} onClick={onClose} />
      <SidebarContainer isOpen={isOpen}>
        <CloseButton isOpen={isOpen} onClick={onClose}>✕</CloseButton>
        <SidebarContent>
          <SidebarHeader>
            <div className="avatar">MT</div>
            <div className="user-info">
              <div className="user-name">John Trader</div>
              <div className="user-email">john@mytradeapp.com</div>
            </div>
          </SidebarHeader>

          <NavSection>
            <SectionLabel>Updates</SectionLabel>
            <NavItem active={activeItem === 'notifications'} onClick={handleNotificationsClick}>
              <span className="nav-icon"><BellIcon /></span>
              <span className="nav-label">Notifications</span>
              {hasNotifications && <span className="notification-dot" />}
              <span className="badge">2</span>
            </NavItem>
            <NavItem active={activeItem === 'voice'} onClick={handleVoiceClick}>
              <span className="nav-icon">{voiceEnabled ? <VoiceIcon /> : <VoiceOffIcon />}</span>
              <span className="nav-label">Voice Notifications</span>
              <span className="badge" style={{ background: voiceEnabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: voiceEnabled ? '#10B981' : '#EF4444' }}>{voiceEnabled ? 'On' : 'Off'}</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Learning</SectionLabel>
            <NavItem active={activeItem === 'academy'} onClick={() => handleNavClick('academy', '/academy')}>
              <span className="nav-icon"><AcademyIcon /></span>
              <span className="nav-label">MyTradeApp Academy</span>
              <span className="badge">NEW</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Account</SectionLabel>
            <NavItem active={activeItem === 'account-info'} onClick={handleAccountInfoClick}>
              <span className="nav-icon"><AccountIcon /></span>
              <span className="nav-label">Deriv Account Info</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Trading</SectionLabel>
            <NavItem active={activeItem === 'copy-trading'} onClick={() => handleNavClick('copy-trading', '/copy-trading')}>
              <span className="nav-icon"><CopyIcon /></span>
              <span className="nav-label">Copy Trading</span>
              <span className="badge">BETA</span>
            </NavItem>
            <NavItem active={activeItem === 'account-management'} onClick={() => handleNavClick('account-management', '/account-management')}>
              <span className="nav-icon"><ManagementIcon /></span>
              <span className="nav-label">Account Management</span>
              <span className="badge">NEW</span>
            </NavItem>
            <NavItem active={activeItem === 'risk-calculator'} onClick={handleRiskCalculatorClick}>
              <span className="nav-icon"><RiskIcon /></span>
              <span className="nav-label">Risk Calculator</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Wellness</SectionLabel>
            <SideCard>
              <div className="card-title"><span className="icon"><ShieldIcon /></span>Responsible Trading</div>
              <div className="card-item"><span className="bullet">•</span><span>Set <span className="highlight">deposit limits</span> to control your capital budget.</span></div>
              <div className="card-item"><span className="bullet">•</span><span>Take regular <span className="highlight">trading breaks</span> to maintain discipline.</span></div>
              <div className="card-item"><span className="bullet">•</span><span>Trade only with risk capital you can afford to lose.</span></div>
              <div className="learn-more" onClick={() => handleNavClick('responsible-trading', '/responsible-trading')}>Learn more →</div>
            </SideCard>
          </NavSection>

          <NavSection>
            <SectionLabel>Feedback</SectionLabel>
            <FeedbackSection>
              <div className="feedback-label">Rate your experience</div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''} ${star <= hoverRating && star > rating ? 'hover' : ''}`} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                    <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  </button>
                ))}
              </div>
              <div className="star-rating-text">{rating > 0 ? getRatingText(rating) : 'Tap a star to rate'}</div>
              <textarea className="feedback-textarea" placeholder="Share your feedback or suggestions..." value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} disabled={isSubmitting} />
              <button className="feedback-submit" onClick={handleSubmitFeedback} disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Submit Feedback'}</button>
              {submitStatus && <div className="feedback-status">{submitStatus}</div>}
            </FeedbackSection>
          </NavSection>

          <NavSection>
            <SectionLabel>Information</SectionLabel>
            <NavItem active={activeItem === 'how-to-use'} onClick={handleHowToUseClick}>
              <span className="nav-icon"><BookIcon /></span>
              <span className="nav-label">How to Use</span>
            </NavItem>
            <NavItem active={activeItem === 'terms'} onClick={handleTermsClick}>
              <span className="nav-icon"><TermsIcon /></span>
              <span className="nav-label">Terms & Conditions</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Company</SectionLabel>
            <SideCard>
              <div className="card-title"><span className="icon"><CompanyIcon /></span>About MyTradeApp</div>
              <div className="card-item"><span className="bullet">•</span><span>Third-party trading application for Deriv platform.</span></div>
              <div className="card-item"><span className="bullet">•</span><span>Provides real-time API market streams and automated execution tools.</span></div>
              <div className="learn-more" onClick={() => handleNavClick('about', '/about')}>About us →</div>
            </SideCard>
          </NavSection>
        </SidebarContent>

        <SidebarFooter>
          <div className="footer-item" onClick={() => handleNavClick('settings', '/settings')}>
            <span className="footer-icon"><SettingsIcon /></span> Settings
          </div>
          <div className="footer-item" onClick={() => handleNavClick('help', '/settings')}>
            <span className="footer-icon"><HelpIcon /></span> Help & Support
          </div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default OptionSideBar;