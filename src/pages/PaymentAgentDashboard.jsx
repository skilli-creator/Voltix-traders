// src/pages/PaymentAgentDashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${props => props.theme?.colors?.accent + '20' || 'rgba(41,98,255,0.1)'}; }
  50% { box-shadow: 0 0 40px ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'}; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const countUp = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const DashboardContainer = styled.div`
  min-height: calc(100vh - 48px);
  background: ${props => props.theme?.colors?.background || '#0a0e17'};
  padding: 24px 32px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 1024px) {
    padding: 20px 24px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    box-shadow: 0 4px 20px ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'};
    animation: ${pulseGlow} 3s ease-in-out infinite;
  }

  .title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .title {
    font-size: 22px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    letter-spacing: -0.3px;
  }

  .subtitle {
    font-size: 13px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .icon { width: 40px; height: 40px; font-size: 18px; }
    .title { font-size: 20px; }
    .subtitle { font-size: 12px; }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const DateRangeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 8px;
  color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .arrow {
    font-size: 10px;
    opacity: 0.6;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 11px;
    width: 100%;
    justify-content: center;
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  color: ${props => props.theme?.colors?.textMuted || '#64748b'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    transform: rotate(45deg);
  }

  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
    font-size: 14px;
  }
`;

// ============================================
// STATS CARDS
// ============================================
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }
`;

const StatCard = styled.div`
  padding: 18px 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.15)'};
    transform: translateY(-2px);
    box-shadow: 0 8px 32px ${props => props.theme?.colors?.shadow || 'rgba(0,0,0,0.2)'};
  }

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-icon {
    font-size: 20px;
    opacity: 0.7;
  }

  .stat-value {
    font-size: 26px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    animation: ${countUp} 0.6s ease;
    animation-delay: ${props => props.delay || '0s'};
    animation-fill-mode: both;
  }

  .stat-change {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    margin-top: 6px;
    padding: 2px 10px;
    border-radius: 12px;
    color: ${props => props.positive ? props.theme?.colors?.success || '#22c55e' : props.theme?.colors?.danger || '#ef4444'};
    background: ${props => props.positive 
      ? (props.theme?.colors?.success + '15' || 'rgba(34,197,94,0.08)')
      : (props.theme?.colors?.danger + '15' || 'rgba(239,68,68,0.08)')
    };
    border: 2px solid ${props => props.positive 
      ? (props.theme?.colors?.success + '30' || 'rgba(34,197,94,0.15)')
      : (props.theme?.colors?.danger + '30' || 'rgba(239,68,68,0.15)')
    };
  }

  @media (max-width: 1024px) {
    padding: 16px 18px;
    .stat-value { font-size: 22px; }
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    .stat-value { font-size: 20px; }
    .stat-icon { font-size: 16px; }
  }
`;

// ============================================
// CHARTS
// ============================================
const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const ChartCard = styled.div`
  padding: 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 12px;
  animation: ${fadeIn} 0.5s ease;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .chart-title {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .chart-subtitle {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
  }

  .chart-container {
    width: 100%;
    height: 240px;

    @media (max-width: 768px) {
      height: 200px;
    }

    @media (max-width: 480px) {
      height: 180px;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

// ============================================
// TRANSACTIONS TABLE
// ============================================
const TableCard = styled.div`
  padding: 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 12px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease;
  animation-delay: 0.3s;
  animation-fill-mode: both;

  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .table-title {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    display: flex;
    align-items: center;
    gap: 8px;

    .count {
      font-size: 11px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.03)'};
      padding: 1px 10px;
      border-radius: 12px;
      border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
    }
  }

  .table-actions {
    display: flex;
    gap: 8px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    overflow-x: auto;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.06)'};
    border-radius: 4px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-weight: 700;

  thead {
    tr {
      border-bottom: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
    }

    th {
      text-align: left;
      padding: 10px 12px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      font-weight: 700;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 2px solid ${props => props.theme?.colors?.border + '30' || 'rgba(255,255,255,0.02)'};
      transition: background 0.2s ease;

      &:hover {
        background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.03)'};
      }

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: 10px 12px;
      font-size: 12px;
      color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
      white-space: nowrap;
      font-weight: 700;

      .client {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: ${props => props.theme?.colors?.text || '#ffffff'};
        font-weight: 700;
        flex-shrink: 0;
      }

      .client-name {
        color: ${props => props.theme?.colors?.text || '#f1f5f9'};
        font-weight: 700;
      }

      .status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 12px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .status-completed {
        color: ${props => props.theme?.colors?.success || '#22c55e'};
        background: ${props => props.theme?.colors?.success + '15' || 'rgba(34,197,94,0.08)'};
        border: 2px solid ${props => props.theme?.colors?.success + '30' || 'rgba(34,197,94,0.15)'};
      }

      .status-pending {
        color: #f59e0b;
        background: rgba(245,158,11,0.08);
        border: 2px solid rgba(245,158,11,0.15);
      }

      .status-failed {
        color: ${props => props.theme?.colors?.danger || '#ef4444'};
        background: ${props => props.theme?.colors?.danger + '15' || 'rgba(239,68,68,0.08)'};
        border: 2px solid ${props => props.theme?.colors?.danger + '30' || 'rgba(239,68,68,0.15)'};
      }

      .status-processing {
        color: ${props => props.theme?.colors?.accent || '#2962ff'};
        background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.08)'};
        border: 2px solid ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.15)'};
      }

      .amount-positive {
        color: ${props => props.theme?.colors?.success || '#22c55e'};
        font-weight: 700;
      }

      .amount-negative {
        color: ${props => props.theme?.colors?.danger || '#ef4444'};
        font-weight: 700;
      }

      .amount-neutral {
        color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
      }
    }
  }

  @media (max-width: 768px) {
    thead th, tbody td {
      padding: 8px 10px;
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    thead th, tbody td {
      padding: 6px 8px;
      font-size: 10px;
    }
    .avatar { width: 24px; height: 24px; font-size: 8px; }
    .status { padding: 2px 8px; font-size: 8px; }
  }
`;

// ============================================
// CLIENTS SECTION
// ============================================
const ClientsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ClientCard = styled.div`
  padding: 18px 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 12px;
  animation: ${fadeIn} 0.5s ease;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.15)'};
    transform: translateY(-2px);
  }

  .client-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .client-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    flex-shrink: 0;
  }

  .client-info {
    flex: 1;
    min-width: 0;
  }

  .client-name {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .client-email {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
  }

  .client-stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .stat-label {
    font-size: 8px;
    text-transform: uppercase;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    letter-spacing: 0.3px;
    font-weight: 700;
    margin-top: 1px;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    .client-avatar { width: 38px; height: 38px; font-size: 14px; }
    .client-name { font-size: 13px; }
    .stat-number { font-size: 14px; }
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    .client-avatar { width: 34px; height: 34px; font-size: 12px; }
    .client-name { font-size: 12px; }
    .stat-number { font-size: 12px; }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentAgentDashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ===== STATS DATA =====
  const stats = [
    {
      label: 'Total Volume',
      value: '$2,847,293.50',
      icon: '💰',
      change: '+12.5%',
      positive: true,
      delay: '0.05s'
    },
    {
      label: 'Active Clients',
      value: '1,847',
      icon: '👥',
      change: '+8.3%',
      positive: true,
      delay: '0.10s'
    },
    {
      label: 'Transactions Today',
      value: '342',
      icon: '📊',
      change: '-2.1%',
      positive: false,
      delay: '0.15s'
    },
    {
      label: 'Total Commission',
      value: '$147,890.00',
      icon: '💳',
      change: '+18.7%',
      positive: true,
      delay: '0.20s'
    }
  ];

  // ===== CHART DATA =====
  const volumeData = [
    { name: 'Mon', volume: 320, deposits: 280, withdrawals: 40 },
    { name: 'Tue', volume: 450, deposits: 390, withdrawals: 60 },
    { name: 'Wed', volume: 380, deposits: 320, withdrawals: 60 },
    { name: 'Thu', volume: 520, deposits: 450, withdrawals: 70 },
    { name: 'Fri', volume: 490, deposits: 410, withdrawals: 80 },
    { name: 'Sat', volume: 280, deposits: 230, withdrawals: 50 },
    { name: 'Sun', volume: 310, deposits: 260, withdrawals: 50 }
  ];

  const pieData = [
    { name: 'Deposits', value: 65, color: '#22c55e' },
    { name: 'Withdrawals', value: 25, color: '#ef4444' },
    { name: 'Transfers', value: 10, color: '#2962ff' }
  ];

  // ===== TRANSACTIONS DATA =====
  const transactions = [
    { id: '#TRX-7841', client: 'Sarah Johnson', amount: '+$12,450.00', type: 'Deposit', status: 'completed', time: '2 min ago' },
    { id: '#TRX-7840', client: 'Michael Chen', amount: '-$8,230.50', type: 'Withdrawal', status: 'pending', time: '15 min ago' },
    { id: '#TRX-7839', client: 'Emma Williams', amount: '+$5,670.00', type: 'Deposit', status: 'processing', time: '42 min ago' },
    { id: '#TRX-7838', client: 'James Brown', amount: '+$23,400.00', type: 'Deposit', status: 'completed', time: '1 hour ago' },
    { id: '#TRX-7837', client: 'Lisa Martinez', amount: '-$3,200.00', type: 'Withdrawal', status: 'failed', time: '2 hours ago' },
    { id: '#TRX-7836', client: 'David Kim', amount: '+$9,875.00', type: 'Deposit', status: 'completed', time: '3 hours ago' },
    { id: '#TRX-7835', client: 'Rachel Adams', amount: '+$15,300.00', type: 'Deposit', status: 'completed', time: '4 hours ago' },
    { id: '#TRX-7834', client: 'Robert Taylor', amount: '-$6,750.00', type: 'Withdrawal', status: 'pending', time: '5 hours ago' }
  ];

  // ===== CLIENTS DATA =====
  const clients = [
    { name: 'Sarah Johnson', email: 'sarah.j@email.com', deposits: 42, withdrawals: 18, total: '$187,450' },
    { name: 'Michael Chen', email: 'michael.c@email.com', deposits: 28, withdrawals: 12, total: '$94,230' },
    { name: 'Emma Williams', email: 'emma.w@email.com', deposits: 35, withdrawals: 8, total: '$156,780' },
    { name: 'James Brown', email: 'james.b@email.com', deposits: 51, withdrawals: 22, total: '$234,100' }
  ];

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  const getAmountClass = (amount) => {
    if (amount.startsWith('+')) return 'amount-positive';
    if (amount.startsWith('-')) return 'amount-negative';
    return 'amount-neutral';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderLeft>
          <div className="icon">💳</div>
          <div className="title-group">
            <span className="title">Payment Agent Dashboard</span>
            <span className="subtitle">Real-time transaction monitoring & client management</span>
          </div>
        </HeaderLeft>
        <HeaderRight>
          <DateRangeButton>
            📅 Last 7 Days
            <span className="arrow">▾</span>
          </DateRangeButton>
          <RefreshButton onClick={handleRefresh} style={{ transform: isRefreshing ? 'rotate(360deg)' : 'none' }}>
            🔄
          </RefreshButton>
        </HeaderRight>
      </DashboardHeader>

      {/* STATS CARDS */}
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            positive={stat.positive}
            delay={stat.delay}
          >
            <div className="stat-header">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-icon">{stat.icon}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">
              {stat.positive ? '↑' : '↓'} {stat.change}
            </div>
          </StatCard>
        ))}
      </StatsGrid>

      {/* CHARTS */}
      <ChartsGrid>
        <ChartCard delay="0.25s">
          <div className="chart-header">
            <div>
              <div className="chart-title">Transaction Volume</div>
              <div className="chart-subtitle">Weekly overview of deposits, withdrawals & transfers</div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,14,23,0.95)',
                    border: '2px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="deposits" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdrawals" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard delay="0.30s">
          <div className="chart-header">
            <div>
              <div className="chart-title">Transaction Distribution</div>
              <div className="chart-subtitle">Deposits, withdrawals & transfers</div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,14,23,0.95)',
                    border: '2px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </ChartsGrid>

      {/* TRANSACTIONS TABLE */}
      <TableCard>
        <div className="table-header">
          <div className="table-title">
            Recent Transactions
            <span className="count">{transactions.length}</span>
          </div>
          <div className="table-actions">
            <DateRangeButton style={{ padding: '4px 12px', fontSize: '10px' }}>
              View All →
            </DateRangeButton>
          </div>
        </div>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '11px' }}>
                    {tx.id}
                  </td>
                  <td>
                    <div className="client">
                      <div className="avatar">{getInitials(tx.client)}</div>
                      <span className="client-name">{tx.client}</span>
                    </div>
                  </td>
                  <td className={getAmountClass(tx.amount)}>
                    {tx.amount}
                  </td>
                  <td>{tx.type}</td>
                  <td>
                    <span className={`status ${getStatusClass(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '11px' }}>
                    {tx.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </TableCard>

      {/* CLIENTS SECTION */}
      <ClientsSection>
        {clients.map((client, index) => (
          <ClientCard key={index} delay={`${0.35 + (index * 0.05)}s`}>
            <div className="client-header">
              <div className="client-avatar">{getInitials(client.name)}</div>
              <div className="client-info">
                <div className="client-name">{client.name}</div>
                <div className="client-email">{client.email}</div>
              </div>
            </div>
            <div className="client-stats">
              <div className="stat-item">
                <div className="stat-number">{client.deposits}</div>
                <div className="stat-label">Deposits</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{client.withdrawals}</div>
                <div className="stat-label">Withdrawals</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" style={{ color: '#22c55e' }}>
                  {client.total}
                </div>
                <div className="stat-label">Total Volume</div>
              </div>
            </div>
          </ClientCard>
        ))}
      </ClientsSection>
    </DashboardContainer>
  );
};

export default PaymentAgentDashboard;