// src/pages/PaymentAgentDashboard.jsx

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============================================
// KENYAN BANKS LIST
// ============================================
const KENYAN_BANKS = [
  'Equity Bank Kenya',
  'KCB Bank Kenya',
  'Co-operative Bank of Kenya',
  'Absa Bank Kenya',
  'Standard Chartered Bank Kenya',
  'NCBA Bank Kenya',
  'Diamond Trust Bank (DTB)',
  'I&M Bank Kenya',
  'Stanbic Bank Kenya',
  'Citibank Kenya',
  'Bank of Africa Kenya',
  'Consolidated Bank of Kenya',
  'Development Bank of Kenya',
  'Ecobank Kenya',
  'Family Bank Kenya',
  'First Community Bank',
  'Guardian Bank Kenya',
  'Gulf African Bank',
  'Habib Bank Kenya',
  'HFC Bank Kenya',
  'Jamii Bora Bank',
  'Middle East Bank Kenya',
  'M Oriental Bank',
  'National Bank of Kenya',
  'NIC Bank Kenya',
  'Paramount Bank Kenya',
  'Prime Bank Kenya',
  'Sidian Bank Kenya',
  'Spire Bank Kenya',
  'Transnational Bank Kenya',
  'Victoria Commercial Bank',
];

// ============================================
// LAYOUT
// ============================================
const AppContainer = styled.div`
  min-height: calc(100vh - 48px);
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (min-width: 768px) {
    flex-direction: row;
    background: #f5f7fa;
  }
`;

// ============================================
// SIDEBAR - Desktop
// ============================================
const Sidebar = styled.div`
  width: 220px;
  min-width: 220px;
  background: #ffffff;
  border-right: 1px solid #e8ecf0;
  padding: 32px 20px;
  display: none;
  flex-direction: column;
  height: calc(100vh - 48px);
  position: sticky;
  top: 0;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const SidebarBrand = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  padding: 0 12px 28px 12px;
  border-bottom: 1px solid #e8ecf0;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
`;

const SidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SidebarNavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? '#2962ff' : '#5a6378'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.06)' : 'transparent'};
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '500'};

  &:hover {
    background: rgba(41, 98, 255, 0.04);
    color: #2962ff;
  }

  .icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
  }
`;

// ============================================
// BOTTOM NAV - Mobile
// ============================================
const BottomNav = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e8ecf0;
  padding: 8px 12px 12px;
  z-index: 100;
  justify-content: space-around;

  @media (min-width: 768px) {
    display: none;
  }
`;

const BottomNavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  cursor: pointer;
  color: ${props => props.active ? '#2962ff' : '#8a93a6'};
  font-size: 10px;
  font-weight: 500;
  transition: all 0.2s ease;

  .icon {
    font-size: 22px;
  }

  .label {
    font-size: 9px;
  }
`;

// ============================================
// MAIN CONTENT
// ============================================
const MainContent = styled.div`
  flex: 1;
  padding: 24px 20px;
  padding-bottom: 80px;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: 32px 40px;
    max-width: 600px;
    padding-bottom: 32px;
    margin: 0;
  }

  @media (min-width: 1024px) {
    padding: 40px 48px;
    max-width: 700px;
  }
`;

// ============================================
// HEADER
// ============================================
const Header = styled.div`
  margin-bottom: 28px;
  animation: ${fadeIn} 0.4s ease;

  .greeting {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.3px;
  }

  .sub {
    font-size: 14px;
    color: #8a93a6;
    font-weight: 400;
    margin-top: 2px;
  }
`;

// ============================================
// WALLET BALANCE CARD
// ============================================
const WalletCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #e8ecf0;
  animation: ${slideUp} 0.5s ease;

  .client-id {
    font-size: 11px;
    color: #8a93a6;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .balance {
    font-size: 32px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.5px;
  }

  .currency {
    font-size: 14px;
    color: #8a93a6;
    font-weight: 500;
    margin-left: 4px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
  }

  .badge {
    background: #f0f2f5;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .badge.deriv {
    background: #e8f0fe;
    color: #2962ff;
  }

  .badge.transfers {
    background: #f5f0e8;
    color: #b8860b;
  }
`;

// ============================================
// QUICK ACTIONS
// ============================================
const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 28px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const QuickAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e8ecf0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2962ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(41, 98, 255, 0.06);
  }

  .icon {
    font-size: 24px;
  }

  .label {
    font-size: 11px;
    font-weight: 600;
    color: #1a1a2e;
  }
`;

// ============================================
// TRANSACTIONS LIST
// ============================================
const TransactionsList = styled.div`
  animation: ${fadeIn} 0.6s ease;
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #e8ecf0;

  &:last-child {
    border-bottom: none;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: #f0f2f5;
  }

  .icon-wrap.deposit {
    background: #e8f5e9;
  }

  .icon-wrap.withdrawal {
    background: #fce4ec;
  }

  .info {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .meta {
    font-size: 11px;
    color: #8a93a6;
    font-weight: 400;
  }

  .right {
    text-align: right;
  }

  .amount {
    font-size: 14px;
    font-weight: 600;
  }

  .amount.positive {
    color: #22c55e;
  }

  .amount.negative {
    color: #ef4444;
  }

  .status {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    padding: 1px 10px;
    border-radius: 12px;
    display: inline-block;
  }

  .status.completed {
    color: #22c55e;
    background: #e8f5e9;
  }

  .status.pending {
    color: #f59e0b;
    background: #fef3c7;
  }

  .status.failed {
    color: #ef4444;
    background: #fce4ec;
  }
`;

// ============================================
// MODAL
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: ${props => props.open ? 'flex' : 'none'};
  align-items: flex-end;
  justify-content: center;
  padding: 0;

  @media (min-width: 768px) {
    align-items: center;
    padding: 20px;
  }
`;

const ModalSheet = styled.div`
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  padding: 24px 24px 32px;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 90vh;
  overflow-y: auto;

  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 32px;
    max-height: 85vh;
  }
`;

const ModalHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #dce0e5;
  border-radius: 4px;
  margin: 0 auto 20px;

  @media (min-width: 768px) {
    display: none;
  }
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #5a6378;
    margin-bottom: 4px;
  }

  input, select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #dce0e5;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a2e;
    background: #f8f9fa;
    outline: none;
    transition: border-color 0.2s ease;
    box-sizing: border-box;

    &:focus {
      border-color: #2962ff;
      background: #ffffff;
    }

    &::placeholder {
      color: #8a93a6;
    }
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a6378' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 40px;

    option {
      background: #ffffff;
    }
  }
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
`;

const MethodOption = styled.div`
  padding: 12px 8px;
  border: 2px solid ${props => props.selected ? '#2962ff' : '#dce0e5'};
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? 'rgba(41, 98, 255, 0.04)' : '#f8f9fa'};

  &:hover {
    border-color: #2962ff;
  }

  .name {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.selected ? '#2962ff' : '#1a1a2e'};
  }

  .sub {
    font-size: 9px;
    color: #8a93a6;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #2962ff;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1a4fcf;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============================================
// TOAST
// ============================================
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 380px;
  width: 90%;
  pointer-events: none;

  @media (min-width: 768px) {
    top: 24px;
    right: 24px;
    left: auto;
    transform: none;
  }
`;

const Toast = styled.div`
  pointer-events: auto;
  padding: 14px 18px;
  border-radius: 12px;
  background: #ffffff;
  border-left: 4px solid ${props => props.type === 'success' ? '#22c55e' : '#ef4444'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon { font-size: 18px; flex-shrink: 0; }
  .content { flex: 1; }
  .title { font-size: 13px; font-weight: 600; color: #1a1a2e; }
  .msg { font-size: 11px; font-weight: 400; color: #5a6378; }
  .close {
    background: none;
    border: none;
    color: #8a93a6;
    cursor: pointer;
    font-size: 14px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentAgentDashboard = () => {
  const [page, setPage] = useState('home');
  const [modalOpen, setModalOpen] = useState(false);
  const [txType, setTxType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('safaricom');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [balance, setBalance] = useState(0.06);

  const transactions = [
    { id: '#001', type: 'deposit', amount: 12450.00, status: 'completed', date: 'Today, 14:32', method: 'Safaricom' },
    { id: '#002', type: 'withdrawal', amount: 8230.50, status: 'pending', date: 'Today, 13:15', method: 'Airtel' },
    { id: '#003', type: 'deposit', amount: 5670.00, status: 'completed', date: 'Today, 12:42', method: 'Bank Transfer' },
    { id: '#004', type: 'deposit', amount: 23400.00, status: 'completed', date: 'Yesterday, 11:00', method: 'Safaricom' },
    { id: '#005', type: 'withdrawal', amount: 3200.00, status: 'failed', date: 'Yesterday, 09:30', method: 'Airtel' },
  ];

  const methods = [
    { id: 'safaricom', name: 'Safaricom', sub: 'M-Pesa' },
    { id: 'airtel', name: 'Airtel', sub: 'Airtel Money' },
    { id: 'bank', name: 'Bank', sub: 'Transfer' },
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'help', label: 'Help', icon: '❓' },
    { id: 'account', label: 'Account', icon: '👤' },
  ];

  const addToast = (title, msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const validateAndSubmit = () => {
    const amountNum = parseFloat(amount);
    
    if (!amount || isNaN(amountNum) || amountNum < 1) {
      addToast('Invalid Amount', 'Minimum amount is $1.00', 'error');
      return;
    }

    if (method === 'safaricom' || method === 'airtel') {
      if (!phoneNumber || phoneNumber.length < 10) {
        addToast('Invalid Phone Number', 'Please enter a valid phone number', 'error');
        return;
      }
      const phoneRegex = /^0[17]\d{8}$/;
      if (!phoneRegex.test(phoneNumber)) {
        addToast('Invalid Phone Number', 'Please enter a valid Kenyan phone number', 'error');
        return;
      }
    }

    if (method === 'bank') {
      if (!selectedBank) {
        addToast('Select Bank', 'Please select your bank', 'error');
        return;
      }
      if (!accountNumber || accountNumber.length < 6) {
        addToast('Invalid Account Number', 'Please enter a valid bank account number', 'error');
        return;
      }
    }

    setProcessing(true);
    setTimeout(() => {
      const methodName = methods.find(m => m.id === method)?.name || 'Unknown';
      const displayAmount = amountNum.toFixed(2);
      
      if (txType === 'deposit') {
        setBalance(prev => prev + amountNum);
        addToast('Deposit Successful', `$${displayAmount} added via ${methodName}`, 'success');
      } else {
        if (amountNum > balance) {
          addToast('Insufficient Balance', 'You do not have enough funds', 'error');
          setProcessing(false);
          return;
        }
        setBalance(prev => prev - amountNum);
        addToast('Withdrawal Initiated', `$${displayAmount} requested via ${methodName}`, 'success');
      }

      setProcessing(false);
      setModalOpen(false);
      setAmount('');
      setPhoneNumber('');
      setSelectedBank('');
      setAccountNumber('');
    }, 1200);
  };

  const renderContent = () => {
    switch(page) {
      case 'home':
        return (
          <>
            <Header>
              <div className="greeting">Welcome Back, TONNY</div>
              <div className="sub">Manage your funds and transactions</div>
            </Header>

            <WalletCard>
              <div className="client-id">client_mq98fho5zxum</div>
              <div className="balance">
                ${balance.toFixed(2)}
                <span className="currency">USD</span>
              </div>
              <div className="row">
                <span className="badge deriv">Deriv</span>
                <span className="badge transfers">Transfers</span>
              </div>
            </WalletCard>

            <QuickActions>
              <QuickAction onClick={() => { setTxType('deposit'); setModalOpen(true); }}>
                <span className="icon">💰</span>
                <span className="label">Deposit</span>
              </QuickAction>
              <QuickAction onClick={() => { setTxType('withdraw'); setModalOpen(true); }}>
                <span className="icon">💳</span>
                <span className="label">Withdraw</span>
              </QuickAction>
              <QuickAction onClick={() => setPage('activity')}>
                <span className="icon">📊</span>
                <span className="label">History</span>
              </QuickAction>
              <QuickAction>
                <span className="icon">🔄</span>
                <span className="label">Re-auth</span>
              </QuickAction>
            </QuickActions>

            <TransactionsList>
              {transactions.slice(0, 3).map((tx, index) => (
                <TransactionItem key={index}>
                  <div className="left">
                    <div className={`icon-wrap ${tx.type}`}>
                      {tx.type === 'deposit' ? '↓' : '↑'}
                    </div>
                    <div className="info">
                      <div className="title">{tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</div>
                      <div className="meta">{tx.method} · {tx.date}</div>
                    </div>
                  </div>
                  <div className="right">
                    <div className={`amount ${tx.type === 'deposit' ? 'positive' : 'negative'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                    <span className={`status ${tx.status}`}>{tx.status}</span>
                  </div>
                </TransactionItem>
              ))}
            </TransactionsList>
          </>
        );

      case 'activity':
        return (
          <>
            <Header>
              <div className="greeting">Activity</div>
              <div className="sub">All your transactions</div>
            </Header>

            <TransactionsList>
              {transactions.map((tx, index) => (
                <TransactionItem key={index}>
                  <div className="left">
                    <div className={`icon-wrap ${tx.type}`}>
                      {tx.type === 'deposit' ? '↓' : '↑'}
                    </div>
                    <div className="info">
                      <div className="title">{tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</div>
                      <div className="meta">{tx.method} · {tx.date}</div>
                    </div>
                  </div>
                  <div className="right">
                    <div className={`amount ${tx.type === 'deposit' ? 'positive' : 'negative'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                    <span className={`status ${tx.status}`}>{tx.status}</span>
                  </div>
                </TransactionItem>
              ))}
            </TransactionsList>
          </>
        );

      case 'help':
        return (
          <>
            <Header>
              <div className="greeting">Help & Support</div>
              <div className="sub">We're here to help</div>
            </Header>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e8ecf0' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
                Frequently Asked Questions
              </div>
              <div style={{ fontSize: '13px', color: '#5a6378', lineHeight: '1.8' }}>
                <strong>How do I deposit?</strong><br />
                Click the Deposit button, select your payment method, and enter the details.<br /><br />
                <strong>How long do withdrawals take?</strong><br />
                Withdrawals are processed instantly for M-Pesa and Airtel, 24-48 hours for bank transfers.<br /><br />
                <strong>What payment methods are supported?</strong><br />
                Safaricom M-Pesa, Airtel Money, and Bank Transfers.
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e8ecf0', marginTop: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
                Contact Support
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                <span style={{ color: '#8a93a6' }}>Email</span>
                <span style={{ color: '#1a1a2e', fontWeight: '500' }}>support@voltixtraders.com</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                <span style={{ color: '#8a93a6' }}>Phone</span>
                <span style={{ color: '#1a1a2e', fontWeight: '500' }}>+254 700 123 456</span>
              </div>
            </div>
          </>
        );

      case 'account':
        return (
          <>
            <Header>
              <div className="greeting">Account</div>
              <div className="sub">Manage your account details</div>
            </Header>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e8ecf0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8ecf0' }}>
                <span style={{ fontSize: '13px', color: '#8a93a6' }}>Name</span>
                <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '500' }}>TONNY</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8ecf0' }}>
                <span style={{ fontSize: '13px', color: '#8a93a6' }}>Email</span>
                <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '500' }}>tonny@voltixtraders.com</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8ecf0' }}>
                <span style={{ fontSize: '13px', color: '#8a93a6' }}>Phone</span>
                <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '500' }}>+254 712 345 678</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: '13px', color: '#8a93a6' }}>Client ID</span>
                <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '500' }}>client_mq98fho5zxum</span>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ToastContainer>
        {toasts.map(t => (
          <Toast key={t.id} type={t.type}>
            <span className="icon">{t.type === 'success' ? '✓' : '✕'}</span>
            <div className="content">
              <div className="title">{t.title}</div>
              <div className="msg">{t.msg}</div>
            </div>
            <button className="close" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>✕</button>
          </Toast>
        ))}
      </ToastContainer>

      <AppContainer>
        {/* Desktop Sidebar */}
        <Sidebar>
          <SidebarBrand>Voltix</SidebarBrand>
          <SidebarNav>
            {navItems.map(item => (
              <SidebarNavItem
                key={item.id}
                active={page === item.id}
                onClick={() => setPage(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </Sidebar>

        {/* Main Content */}
        <MainContent>
          {renderContent()}
        </MainContent>
      </AppContainer>

      {/* Mobile Bottom Nav */}
      <BottomNav>
        {navItems.map(item => (
          <BottomNavItem
            key={item.id}
            active={page === item.id}
            onClick={() => setPage(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </BottomNavItem>
        ))}
      </BottomNav>

      {/* Modal */}
      <ModalOverlay open={modalOpen} onClick={() => !processing && setModalOpen(false)}>
        <ModalSheet onClick={e => e.stopPropagation()}>
          <ModalHandle />
          <ModalTitle>{txType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</ModalTitle>

          <FormGroup>
            <label>Amount (USD) · Min $1.00</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              disabled={processing}
            />
          </FormGroup>

          <label style={{ fontSize: '12px', fontWeight: '600', color: '#5a6378', marginBottom: '4px', display: 'block' }}>
            Payment Method
          </label>
          <MethodGrid>
            {methods.map(m => (
              <MethodOption
                key={m.id}
                selected={method === m.id}
                onClick={() => setMethod(m.id)}
              >
                <div className="name">{m.name}</div>
                <div className="sub">{m.sub}</div>
              </MethodOption>
            ))}
          </MethodGrid>

          {(method === 'safaricom' || method === 'airtel') && (
            <FormGroup>
              <label>{method === 'safaricom' ? 'Safaricom' : 'Airtel'} Phone Number</label>
              <input
                type="tel"
                placeholder="0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                maxLength="10"
                disabled={processing}
              />
            </FormGroup>
          )}

          {method === 'bank' && (
            <>
              <FormGroup>
                <label>Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  disabled={processing}
                >
                  <option value="">— Select your bank —</option>
                  {KENYAN_BANKS.map((bank, index) => (
                    <option key={index} value={bank}>{bank}</option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label>Bank Account Number</label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  disabled={processing}
                />
              </FormGroup>
            </>
          )}

          <SubmitBtn onClick={validateAndSubmit} disabled={processing}>
            {processing ? 'Processing...' : txType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
          </SubmitBtn>
        </ModalSheet>
      </ModalOverlay>
    </>
  );
};

export default PaymentAgentDashboard;