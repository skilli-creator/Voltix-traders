// src/pages/PaymentAgentDashboard.jsx

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(41, 98, 255, 0.1); }
  50% { box-shadow: 0 0 60px rgba(41, 98, 255, 0.2); }
`;

// ============================================
// LAYOUT
// ============================================
const AppContainer = styled.div`
  min-height: calc(100vh - 48px);
  background: ${props => props.theme?.colors?.background || '#080c18'};
  display: flex;
  position: relative;
`;

// ============================================
// SIDEBAR - Premium Minimal
// ============================================
const Sidebar = styled.div`
  width: 240px;
  min-width: 240px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c1020'};
  padding: 28px 16px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  position: sticky;
  top: 0;
  overflow-y: auto;
  border-right: 1px solid rgba(255,255,255,0.03);

  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px 24px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  margin-bottom: 24px;

  .mark {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'aa' || '#4a7aff'})`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: #fff;
    font-size: 14px;
  }

  .name {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    letter-spacing: -0.3px;
  }

  .tag {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 500;
    margin-top: -2px;
  }
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 20px;
`;

const NavLabel = styled.div`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.theme?.colors?.textMuted || '#64748b'};
  padding: 0 12px;
  margin-bottom: 6px;
  font-weight: 600;
  opacity: 0.4;
`;

const NavLink = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? '#fff' : props.theme?.colors?.textMuted || '#64748b'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.08)' : 'transparent'};
  font-size: 13px;
  font-weight: 500;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: ${props => props.active ? 'translateY(-50%) scaleY(1)' : 'translateY(-50%) scaleY(0)'};
    width: 3px;
    height: 20px;
    background: ${props => props.theme?.colors?.accent || '#2962ff'};
    border-radius: 0 4px 4px 0;
    transition: transform 0.25s ease;
  }

  &:hover {
    background: rgba(255,255,255,0.03);
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
    opacity: ${props => props.active ? 1 : 0.5};
  }

  .badge {
    margin-left: auto;
    background: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 10px;
    border-radius: 12px;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

// ============================================
// MOBILE HEADER
// ============================================
const MobileHeader = styled.div`
  display: none;
  padding: 16px 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c1020'};
  border-bottom: 1px solid rgba(255,255,255,0.04);

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'aa' || '#4a7aff'})`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: #fff;
    font-size: 12px;
  }

  .name {
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }
`;

// ============================================
// BOTTOM NAV - Mobile
// ============================================
const BottomNav = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c1020'};
  border-top: 1px solid rgba(255,255,255,0.04);
  padding: 8px 12px 12px;
  z-index: 100;
  justify-content: space-around;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const BottomLink = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.textMuted || '#64748b'};
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.06)' : 'transparent'};
  font-size: 9px;
  font-weight: 500;
  flex: 1;
  text-align: center;

  .icon { font-size: 18px; }
  .label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.3px; }
  .badge {
    font-size: 7px;
    font-weight: 700;
    padding: 1px 8px;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: #fff;
    margin-top: -2px;
  }
`;

// ============================================
// MAIN CONTENT
// ============================================
const Content = styled.div`
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 1024px) {
    padding: 24px 28px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    padding-bottom: 90px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    padding-bottom: 80px;
  }
`;

// ============================================
// PAGE HEADER
// ============================================
const PageHeader = styled.div`
  margin-bottom: 28px;

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    letter-spacing: -0.3px;
  }

  p {
    font-size: 14px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 400;
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
    h1 { font-size: 20px; }
    p { font-size: 13px; }
  }
`;

// ============================================
// BALANCE CARD - Premium
// ============================================
const BalanceCard = styled.div`
  padding: 32px 36px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'aa' || '#4a7aff'})`};
  border-radius: 16px;
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  overflow: hidden;
  animation: ${glowPulse} 3s ease-in-out infinite;

  .bg-pattern {
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }

  .bg-pattern-2 {
    position: absolute;
    bottom: -40%;
    left: -5%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255,255,255,0.02);
  }

  .left {
    position: relative;
    z-index: 1;
  }

  .label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .amount {
    font-size: 36px;
    font-weight: 700;
    color: #fff;
    margin-top: 4px;
    letter-spacing: -0.5px;
  }

  .sub {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    font-weight: 400;
    margin-top: 2px;
  }

  .actions {
    display: flex;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    .amount { font-size: 28px; }
    .actions { width: 100%; }
  }
`;

const Btn = styled.button`
  padding: 10px 28px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  background: rgba(255,255,255,0.06);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255,255,255,0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 12px;
    flex: 1;
  }
`;

// ============================================
// STATS
// ============================================
const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  padding: 18px 22px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c1020'};
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.03);

  .label {
    font-size: 11px;
    font-weight: 500;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 22px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    margin-top: 4px;
  }

  .change {
    font-size: 11px;
    font-weight: 500;
    margin-top: 4px;
    color: ${props => props.positive ? props.theme?.colors?.success || '#22c55e' : props.theme?.colors?.danger || '#ef4444'};
  }
`;

// ============================================
// FILTERS
// ============================================
const Filters = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 18px;
  flex-wrap: wrap;
`;

const Filter = styled.button`
  padding: 5px 18px;
  border: 1px solid ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : 'rgba(255,255,255,0.04)'};
  border-radius: 16px;
  background: ${props => props.active ? 'rgba(41, 98, 255, 0.06)' : 'transparent'};
  color: ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.textMuted || '#64748b'};
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
    color: ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.text || '#f1f5f9'};
  }
`;

// ============================================
// TABLE
// ============================================
const TableWrap = styled.div`
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c1020'};
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.03);
  padding: 20px 0;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 16px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};

    .count {
      font-size: 11px;
      font-weight: 500;
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      background: rgba(255,255,255,0.03);
      padding: 1px 10px;
      border-radius: 10px;
      margin-left: 8px;
    }
  }

  @media (max-width: 768px) {
    padding: 16px 0;
    .head { padding: 0 16px 12px 16px; }
  }
`;

const TableScroll = styled.div`
  overflow-x: auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-weight: 500;
  min-width: 600px;

  thead th {
    text-align: left;
    padding: 8px 12px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-weight: 600;
  }

  tbody td {
    padding: 8px 12px;
    font-size: 12px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    border-bottom: 1px solid rgba(255,255,255,0.02);
    font-weight: 500;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,0.02); }

  .id { color: ${props => props.theme?.colors?.text || '#f1f5f9'}; font-weight: 600; }
  .pos { color: ${props => props.theme?.colors?.success || '#22c55e'}; }
  .neg { color: ${props => props.theme?.colors?.danger || '#ef4444'}; }

  .status {
    display: inline-block;
    padding: 2px 14px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-completed {
    color: ${props => props.theme?.colors?.success || '#22c55e'};
    background: rgba(34, 197, 94, 0.06);
  }

  .status-pending {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.06);
  }

  .status-failed {
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    background: rgba(239, 68, 68, 0.06);
  }

  .method {
    display: inline-block;
    padding: 2px 12px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 500;
    background: rgba(255,255,255,0.03);
  }

  .date {
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-size: 11px;
  }
`;

// ============================================
// SUPPORT & ACCOUNT CARDS
// ============================================
const Card = styled.div`
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c1020'};
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.03);
  padding: 24px 28px;
  margin-bottom: 16px;

  .title {
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    margin-bottom: 8px;
  }

  .desc {
    font-size: 13px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    line-height: 1.8;
  }

  .row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    &:last-child { border-bottom: none; }
    .lbl { font-size: 13px; color: ${props => props.theme?.colors?.textMuted || '#64748b'}; }
    .val { font-size: 13px; color: ${props => props.theme?.colors?.text || '#f1f5f9'}; font-weight: 500; }
  }

  .contact-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 13px;
    .lbl { color: ${props => props.theme?.colors?.textMuted || '#64748b'}; }
    .val { color: ${props => props.theme?.colors?.text || '#f1f5f9'}; font-weight: 500; }
  }
`;

// ============================================
// MODAL
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(12px);
  z-index: 1000;
  display: ${props => props.open ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 440px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c1020'};
  border-radius: 16px;
  padding: 32px 36px;
  animation: ${scaleIn} 0.3s ease;
  border: 1px solid rgba(255,255,255,0.04);

  @media (max-width: 480px) {
    padding: 24px 20px;
  }
`;

const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.04);
    background: transparent;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-size: 14px;
    cursor: pointer;
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

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 10px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    padding: 10px 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 8px;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    font-size: 14px;
    font-weight: 500;
    outline: none;

    &:focus {
      border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
    }

    &::placeholder {
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      opacity: 0.3;
    }
  }
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
`;

const Method = styled.div`
  padding: 10px;
  border: 1px solid ${props => props.selected ? props.theme?.colors?.accent || '#2962ff' : 'rgba(255,255,255,0.04)'};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? 'rgba(41, 98, 255, 0.06)' : 'transparent'};

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
  }

  .name {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.selected ? props.theme?.colors?.text || '#f1f5f9' : props.theme?.colors?.textMuted || '#64748b'};
  }

  .sub {
    font-size: 9px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    margin-top: 2px;
  }
`;

const Submit = styled.button`
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'aa' || '#4a7aff'})`};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 4px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(41, 98, 255, 0.2);
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
  top: 80px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 340px;
  width: 100%;
  pointer-events: none;

  @media (max-width: 480px) {
    right: 12px;
    left: 12px;
    max-width: none;
  }
`;

const Toast = styled.div`
  pointer-events: auto;
  padding: 12px 16px;
  border-radius: 10px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c1020'};
  border: 1px solid ${props => props.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon { font-size: 16px; flex-shrink: 0; }
  .content { flex: 1; }
  .title { font-size: 12px; font-weight: 600; color: ${props => props.theme?.colors?.text || '#f1f5f9'}; }
  .msg { font-size: 11px; font-weight: 400; color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'}; }
  .close {
    background: none;
    border: none;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    cursor: pointer;
    font-size: 12px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentAgentDashboard = () => {
  const [page, setPage] = useState('home');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [txType, setTxType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('safaricom');
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [balance, setBalance] = useState(2847293.50);

  const transactions = [
    { id: '#TRX-7841', type: 'Deposit', amount: 12450.00, status: 'completed', date: 'Jul 29, 14:32', method: 'Safaricom' },
    { id: '#TRX-7840', type: 'Withdrawal', amount: 8230.50, status: 'pending', date: 'Jul 29, 13:15', method: 'Airtel' },
    { id: '#TRX-7839', type: 'Deposit', amount: 5670.00, status: 'processing', date: 'Jul 29, 12:42', method: 'Bank Transfer' },
    { id: '#TRX-7838', type: 'Deposit', amount: 23400.00, status: 'completed', date: 'Jul 29, 11:00', method: 'Safaricom' },
    { id: '#TRX-7837', type: 'Withdrawal', amount: 3200.00, status: 'failed', date: 'Jul 29, 09:30', method: 'Airtel' },
  ];

  const stats = [
    { label: 'Total Deposits', value: '$2.8M', change: '+12.5%', positive: true },
    { label: 'Total Withdrawals', value: '$847K', change: '-3.2%', positive: false },
    { label: 'Pending', value: '12', change: '+2', positive: true },
    { label: 'Success Rate', value: '97.8%', change: '+1.2%', positive: true }
  ];

  const methods = [
    { id: 'safaricom', name: 'Safaricom', sub: 'M-Pesa' },
    { id: 'airtel', name: 'Airtel', sub: 'Airtel Money' },
    { id: 'bank', name: 'Bank', sub: 'Wire Transfer' }
  ];

  const nav = [
    { id: 'home', label: 'Dashboard', icon: '◆' },
    { id: 'transactions', label: 'Transactions', icon: '◈' },
    { id: 'deposits', label: 'Deposits', icon: '▼' },
    { id: 'withdrawals', label: 'Withdrawals', icon: '▲' },
    { id: 'support', label: 'Support', icon: '?' },
    { id: 'account', label: 'Account', icon: '⚙' },
  ];

  const filtered = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'deposits') return tx.type === 'Deposit';
    if (filter === 'withdrawals') return tx.type === 'Withdrawal';
    return true;
  });

  const addToast = (title, msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleTx = () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Invalid Amount', 'Please enter a valid amount', 'error');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const name = methods.find(m => m.id === method)?.name || 'Unknown';
      if (txType === 'deposit') {
        setBalance(prev => prev + parseFloat(amount));
        addToast('Deposit Successful', `$${parseFloat(amount).toFixed(2)} added via ${name}`, 'success');
      } else {
        setBalance(prev => prev - parseFloat(amount));
        addToast('Withdrawal Initiated', `$${parseFloat(amount).toFixed(2)} requested via ${name}`, 'success');
      }
      setProcessing(false);
      setModal(false);
      setAmount('');
    }, 1200);
  };

  const renderPage = () => {
    switch(page) {
      case 'home':
        return (
          <>
            <PageHeader>
              <h1>Dashboard</h1>
              <p>Overview of your payment activity</p>
            </PageHeader>

            <BalanceCard>
              <div className="bg-pattern" />
              <div className="bg-pattern-2" />
              <div className="left">
                <div className="label">Available Balance</div>
                <div className="amount">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="sub">USD · Live</div>
              </div>
              <div className="actions">
                <Btn onClick={() => { setTxType('deposit'); setModal(true); }}>Deposit</Btn>
                <Btn onClick={() => { setTxType('withdraw'); setModal(true); }}>Withdraw</Btn>
              </div>
            </BalanceCard>

            <Stats>
              {stats.map((s, i) => (
                <Stat key={i} positive={s.positive}>
                  <div className="label">{s.label}</div>
                  <div className="value">{s.value}</div>
                  <div className="change">{s.positive ? '↑' : '↓'} {s.change}</div>
                </Stat>
              ))}
            </Stats>

            <TableWrap>
              <div className="head">
                <div className="title">Recent Activity <span className="count">{transactions.length}</span></div>
              </div>
              <TableScroll>
                <Table>
                  <thead><tr><th>ID</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {transactions.slice(0, 5).map(tx => (
                      <tr key={tx.id}>
                        <td className="id">{tx.id}</td>
                        <td>{tx.type}</td>
                        <td className={tx.type === 'Deposit' ? 'pos' : 'neg'}>{tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}</td>
                        <td><span className="method">{tx.method}</span></td>
                        <td><span className={`status status-${tx.status}`}>{tx.status}</span></td>
                        <td className="date">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableScroll>
            </TableWrap>
          </>
        );

      case 'transactions':
        return (
          <>
            <PageHeader><h1>Transactions</h1><p>Complete transaction history</p></PageHeader>
            <TableWrap>
              <div className="head"><div className="title">All Transactions <span className="count">{filtered.length}</span></div></div>
              <Filters>
                <Filter active={filter === 'all'} onClick={() => setFilter('all')}>All</Filter>
                <Filter active={filter === 'deposits'} onClick={() => setFilter('deposits')}>Deposits</Filter>
                <Filter active={filter === 'withdrawals'} onClick={() => setFilter('withdrawals')}>Withdrawals</Filter>
              </Filters>
              <TableScroll>
                <Table>
                  <thead><tr><th>ID</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {filtered.map(tx => (
                      <tr key={tx.id}>
                        <td className="id">{tx.id}</td>
                        <td>{tx.type}</td>
                        <td className={tx.type === 'Deposit' ? 'pos' : 'neg'}>{tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}</td>
                        <td><span className="method">{tx.method}</span></td>
                        <td><span className={`status status-${tx.status}`}>{tx.status}</span></td>
                        <td className="date">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableScroll>
            </TableWrap>
          </>
        );

      case 'deposits':
        return (
          <>
            <PageHeader><h1>Deposits</h1><p>All deposit transactions</p></PageHeader>
            <TableWrap>
              <div className="head"><div className="title">Deposit History <span className="count">{transactions.filter(t => t.type === 'Deposit').length}</span></div></div>
              <TableScroll>
                <Table>
                  <thead><tr><th>ID</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {transactions.filter(t => t.type === 'Deposit').map(tx => (
                      <tr key={tx.id}>
                        <td className="id">{tx.id}</td>
                        <td className="pos">+${tx.amount.toFixed(2)}</td>
                        <td><span className="method">{tx.method}</span></td>
                        <td><span className={`status status-${tx.status}`}>{tx.status}</span></td>
                        <td className="date">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableScroll>
            </TableWrap>
          </>
        );

      case 'withdrawals':
        return (
          <>
            <PageHeader><h1>Withdrawals</h1><p>All withdrawal transactions</p></PageHeader>
            <TableWrap>
              <div className="head"><div className="title">Withdrawal History <span className="count">{transactions.filter(t => t.type === 'Withdrawal').length}</span></div></div>
              <TableScroll>
                <Table>
                  <thead><tr><th>ID</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {transactions.filter(t => t.type === 'Withdrawal').map(tx => (
                      <tr key={tx.id}>
                        <td className="id">{tx.id}</td>
                        <td className="neg">-${tx.amount.toFixed(2)}</td>
                        <td><span className="method">{tx.method}</span></td>
                        <td><span className={`status status-${tx.status}`}>{tx.status}</span></td>
                        <td className="date">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableScroll>
            </TableWrap>
          </>
        );

      case 'support':
        return (
          <>
            <PageHeader><h1>Support</h1><p>We're here to help</p></PageHeader>
            <Card>
              <div className="title">Frequently Asked Questions</div>
              <div className="desc">
                <strong>How do I deposit?</strong><br />
                Click Deposit, select your payment method, and follow the instructions.<br /><br />
                <strong>How long do withdrawals take?</strong><br />
                Processed within 24-48 hours.<br /><br />
                <strong>Supported methods?</strong><br />
                Safaricom M-Pesa, Airtel Money, and Bank Transfers.
              </div>
            </Card>
            <Card>
              <div className="title">Contact</div>
              <div className="contact-row"><span className="lbl">Email</span><span className="val">support@voltixtraders.com</span></div>
              <div className="contact-row"><span className="lbl">Phone</span><span className="val">+254 700 123 456</span></div>
              <div className="contact-row"><span className="lbl">Live Chat</span><span className="val">Available 24/7</span></div>
            </Card>
          </>
        );

      case 'account':
        return (
          <>
            <PageHeader><h1>Account</h1><p>Manage your account details</p></PageHeader>
            <Card>
              <div className="row"><span className="lbl">Name</span><span className="val">John Trader</span></div>
              <div className="row"><span className="lbl">Email</span><span className="val">john@voltixtraders.com</span></div>
              <div className="row"><span className="lbl">Phone</span><span className="val">+254 712 345 678</span></div>
              <div className="row"><span className="lbl">Type</span><span className="val">Premium</span></div>
              <div className="row"><span className="lbl">Joined</span><span className="val">January 2026</span></div>
            </Card>
            <Card>
              <div className="row"><span className="lbl">Safaricom</span><span className="val">0712 345 678</span></div>
              <div className="row"><span className="lbl">Airtel</span><span className="val">0733 456 789</span></div>
              <div className="row"><span className="lbl">Bank</span><span className="val">****5678</span></div>
            </Card>
          </>
        );

      default: return null;
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
        {/* Sidebar */}
        <Sidebar>
          <Logo>
            <div className="mark">VT</div>
            <div>
              <div className="name">Voltix</div>
              <div className="tag">Payment Agent</div>
            </div>
          </Logo>

          <NavGroup>
            {nav.slice(0, 4).map(item => (
              <NavLink key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
                <span className="icon">{item.icon}</span>
                {item.label}
                {item.id === 'transactions' && <span className="badge">12</span>}
              </NavLink>
            ))}
          </NavGroup>

          <Spacer />

          <NavGroup>
            <NavLabel>Support</NavLabel>
            {nav.slice(4).map(item => (
              <NavLink key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </NavGroup>
        </Sidebar>

        {/* Mobile Header */}
        <MobileHeader>
          <div className="brand">
            <div className="mark">VT</div>
            <span className="name">Voltix</span>
          </div>
        </MobileHeader>

        {/* Content */}
        <Content>
          {renderPage()}
        </Content>
      </AppContainer>

      {/* Bottom Nav - Mobile */}
      <BottomNav>
        {nav.map(item => (
          <BottomLink key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
            {item.id === 'transactions' && <span className="badge">12</span>}
          </BottomLink>
        ))}
      </BottomNav>

      {/* Modal */}
      <ModalOverlay open={modal} onClick={() => !processing && setModal(false)}>
        <ModalBox onClick={e => e.stopPropagation()}>
          <ModalHead>
            <h3>{txType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</h3>
            <button onClick={() => !processing && setModal(false)}>✕</button>
          </ModalHead>
          <ModalBody>
            <Field>
              <label>Amount (USD)</label>
              <input type="number" placeholder={txType === 'deposit' ? 'Enter deposit amount' : 'Enter withdrawal amount'} value={amount} onChange={e => setAmount(e.target.value)} min="1" disabled={processing} />
            </Field>

            <Field>
              <label>Payment Method</label>
              <MethodGrid>
                {methods.map(m => (
                  <Method key={m.id} selected={method === m.id} onClick={() => setMethod(m.id)}>
                    <div className="name">{m.name}</div>
                    <div className="sub">{m.sub}</div>
                  </Method>
                ))}
              </MethodGrid>
            </Field>

            {method === 'safaricom' && (
              <Field>
                <label>Safaricom Number</label>
                <input type="text" value="0712 345 678" disabled />
              </Field>
            )}

            {method === 'airtel' && (
              <Field>
                <label>Airtel Number</label>
                <input type="text" value="0733 456 789" disabled />
              </Field>
            )}

            {method === 'bank' && (
              <Field>
                <label>Bank Account</label>
                <input type="text" value="****5678" disabled />
              </Field>
            )}

            <Submit onClick={handleTx} disabled={processing}>
              {processing ? 'Processing...' : txType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </Submit>
          </ModalBody>
        </ModalBox>
      </ModalOverlay>
    </>
  );
};

export default PaymentAgentDashboard;