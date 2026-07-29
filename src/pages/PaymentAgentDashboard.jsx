// src/pages/PaymentAgentDashboard.jsx

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const DashboardContainer = styled.div`
  min-height: calc(100vh - 48px);
  background: ${props => props.theme?.colors?.background || '#0a0e17'};
  padding: 24px 32px;
  animation: ${fadeIn} 0.5s ease;

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

// ============================================
// BALANCE CARD
// ============================================
const BalanceCard = styled.div`
  padding: 24px 28px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
  border-radius: 16px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  animation: ${fadeIn} 0.5s ease;
  box-shadow: 0 8px 32px ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'};

  .balance-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .balance-label {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .balance-amount {
    font-size: 32px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.5px;
  }

  .balance-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    font-weight: 700;
  }

  .balance-right {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    padding: 18px 20px;
    flex-direction: column;
    align-items: flex-start;
    .balance-amount { font-size: 26px; }
    .balance-right { width: 100%; }
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    .balance-amount { font-size: 22px; }
  }
`;

const ActionButton = styled.button`
  padding: 10px 24px;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 12px;
    flex: 1;
    justify-content: center;
  }
`;

// ============================================
// STATS GRID
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
  }
`;

const StatCard = styled.div`
  padding: 16px 18px;
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
  }

  .stat-label {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    margin-top: 4px;
  }

  .stat-change {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.positive ? props.theme?.colors?.success || '#22c55e' : props.theme?.colors?.danger || '#ef4444'};
    margin-top: 2px;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    .stat-value { font-size: 18px; }
  }
`;

// ============================================
// TRANSACTION MODAL
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 16px;
  padding: 28px 32px;
  animation: ${slideDown} 0.3s ease;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .title {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
    background: transparent;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
      color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    }
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input, select {
    padding: 10px 14px;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
    border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
    border-radius: 8px;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    font-size: 14px;
    font-weight: 700;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
      box-shadow: 0 0 0 3px ${props => props.theme?.colors?.accent + '20' || 'rgba(41,98,255,0.05)'};
    }

    &::placeholder {
      color: ${props => props.theme?.colors?.textMuted + '60' || '#4a4f5e'};
      font-weight: 400;
    }
  }

  select option {
    background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// ============================================
// TRANSACTION TABLE
// ============================================
const TableCard = styled.div`
  padding: 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 12px;
  animation: ${fadeIn} 0.5s ease;

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
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.03)'};
      padding: 1px 10px;
      border-radius: 12px;
      border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
    }
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

  thead th {
    text-align: left;
    padding: 10px 12px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
    border-bottom: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
    white-space: nowrap;
  }

  tbody td {
    padding: 10px 12px;
    font-size: 12px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    border-bottom: 2px solid ${props => props.theme?.colors?.border + '30' || 'rgba(255,255,255,0.02)'};
    white-space: nowrap;
    font-weight: 700;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.03)'};
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

  .amount-positive {
    color: ${props => props.theme?.colors?.success || '#22c55e'};
  }

  .amount-negative {
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
  }

  @media (max-width: 768px) {
    thead th, tbody td { padding: 8px 10px; font-size: 11px; }
  }

  @media (max-width: 480px) {
    thead th, tbody td { padding: 6px 8px; font-size: 10px; }
    .status { padding: 2px 8px; font-size: 8px; }
  }
`;

// ============================================
// TOAST NOTIFICATION
// ============================================
const ToastContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
  width: 100%;
  pointer-events: none;
`;

const Toast = styled.div`
  pointer-events: auto;
  padding: 14px 18px;
  border-radius: 12px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 2px solid ${props => props.type === 'success' ? props.theme?.colors?.success + '60' || 'rgba(34,197,94,0.3)' : props.theme?.colors?.danger + '60' || 'rgba(239,68,68,0.3)'};
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  animation: ${slideDown} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .message {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    flex: 1;
  }

  .close-toast {
    background: none;
    border: none;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    cursor: pointer;
    font-size: 14px;
    padding: 0 4px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentAgentDashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(2847293.50);
  const [transactions, setTransactions] = useState([
    { id: '#TRX-7841', type: 'Deposit', amount: 12450.00, status: 'completed', date: '2026-07-29 14:32', method: 'Bank Transfer' },
    { id: '#TRX-7840', type: 'Withdrawal', amount: 8230.50, status: 'pending', date: '2026-07-29 13:15', method: 'Crypto' },
    { id: '#TRX-7839', type: 'Deposit', amount: 5670.00, status: 'processing', date: '2026-07-29 12:42', method: 'Credit Card' },
    { id: '#TRX-7838', type: 'Deposit', amount: 23400.00, status: 'completed', date: '2026-07-29 11:00', method: 'Bank Transfer' },
    { id: '#TRX-7837', type: 'Withdrawal', amount: 3200.00, status: 'failed', date: '2026-07-29 09:30', method: 'Crypto' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  const stats = [
    { label: 'Total Deposits', value: '$2,847,293.50', change: '+12.5%', positive: true },
    { label: 'Total Withdrawals', value: '$847,293.50', change: '-3.2%', positive: false },
    { label: 'Pending Transactions', value: '12', change: '+2', positive: true },
    { label: 'Successful Trades', value: '1,847', change: '+8.3%', positive: true }
  ];

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const handleTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newTransaction = {
        id: `#TRX-${Math.floor(Math.random() * 9000 + 1000)}`,
        type: transactionType === 'deposit' ? 'Deposit' : 'Withdrawal',
        amount: parseFloat(amount),
        status: 'pending',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        method: paymentMethod === 'bank' ? 'Bank Transfer' : paymentMethod === 'crypto' ? 'Crypto' : 'Credit Card'
      };

      setTransactions([newTransaction, ...transactions]);

      if (transactionType === 'deposit') {
        setBalance(prev => prev + parseFloat(amount));
        addToast(`✅ Deposit of $${parseFloat(amount).toFixed(2)} submitted successfully!`, 'success');
      } else {
        setBalance(prev => prev - parseFloat(amount));
        addToast(`✅ Withdrawal of $${parseFloat(amount).toFixed(2)} submitted successfully!`, 'success');
      }

      setIsProcessing(false);
      setIsModalOpen(false);
      setAmount('');
    }, 1500);
  };

  const getStatusClass = (status) => `status-${status}`;
  const getAmountClass = (amount) => amount >= 0 ? 'amount-positive' : 'amount-negative';

  return (
    <DashboardContainer>
      {/* TOASTS */}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} type={toast.type}>
            <span className="icon">{toast.type === 'success' ? '✅' : '❌'}</span>
            <span className="message">{toast.message}</span>
            <button className="close-toast" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>✕</button>
          </Toast>
        ))}
      </ToastContainer>

      <DashboardHeader>
        <HeaderLeft>
          <div className="icon">💳</div>
          <div className="title-group">
            <span className="title">Payment Dashboard</span>
            <span className="subtitle">Deposit & withdraw directly through Voltix Traders</span>
          </div>
        </HeaderLeft>
      </DashboardHeader>

      {/* BALANCE CARD */}
      <BalanceCard>
        <div className="balance-left">
          <span className="balance-label">Available Balance</span>
          <span className="balance-amount">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="balance-sub">USD • Real-time balance</span>
        </div>
        <div className="balance-right">
          <ActionButton onClick={() => { setTransactionType('deposit'); setIsModalOpen(true); }}>
            💰 Deposit
          </ActionButton>
          <ActionButton onClick={() => { setTransactionType('withdraw'); setIsModalOpen(true); }}>
            💳 Withdraw
          </ActionButton>
        </div>
      </BalanceCard>

      {/* STATS */}
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} delay={`${0.05 + (index * 0.05)}s`} positive={stat.positive}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">{stat.positive ? '↑' : '↓'} {stat.change}</div>
          </StatCard>
        ))}
      </StatsGrid>

      {/* TRANSACTIONS TABLE */}
      <TableCard>
        <div className="table-header">
          <div className="table-title">
            Recent Transactions
            <span className="count">{transactions.length}</span>
          </div>
        </div>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ color: '#f1f5f9', fontWeight: '700' }}>{tx.id}</td>
                  <td>{tx.type}</td>
                  <td className={tx.type === 'Deposit' ? 'amount-positive' : 'amount-negative'}>
                    {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td>{tx.method}</td>
                  <td>
                    <span className={`status ${getStatusClass(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '11px' }}>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </TableCard>

      {/* TRANSACTION MODAL */}
      <ModalOverlay isOpen={isModalOpen} onClick={() => !isProcessing && setIsModalOpen(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <div className="title">
              {transactionType === 'deposit' ? '💰 Deposit Funds' : '💳 Withdraw Funds'}
            </div>
            <button className="close" onClick={() => !isProcessing && setIsModalOpen(false)}>✕</button>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Amount (USD)</label>
              <input
                type="number"
                placeholder={transactionType === 'deposit' ? 'Enter deposit amount' : 'Enter withdrawal amount'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                disabled={isProcessing}
              />
            </FormGroup>

            <FormGroup>
              <label>Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={isProcessing}>
                <option value="bank">🏦 Bank Transfer</option>
                <option value="crypto">₿ Cryptocurrency</option>
                <option value="card">💳 Credit Card</option>
              </select>
            </FormGroup>

            {paymentMethod === 'bank' && (
              <FormGroup>
                <label>Bank Account (Last 4 digits)</label>
                <input type="text" placeholder="****5678" value="****5678" disabled />
              </FormGroup>
            )}

            {paymentMethod === 'crypto' && (
              <FormGroup>
                <label>Wallet Address</label>
                <input type="text" placeholder="0x... (will be provided)" value="0x7F4e...B3c2" disabled />
              </FormGroup>
            )}

            {paymentMethod === 'card' && (
              <FormGroup>
                <label>Card (Last 4 digits)</label>
                <input type="text" placeholder="****4242" value="****4242" disabled />
              </FormGroup>
            )}

            <SubmitButton onClick={handleTransaction} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : transactionType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </SubmitButton>
          </ModalBody>
        </Modal>
      </ModalOverlay>
    </DashboardContainer>
  );
};

export default PaymentAgentDashboard;