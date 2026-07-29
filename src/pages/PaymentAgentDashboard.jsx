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

const modalSlideIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const toastSlide = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

// Main Layout
const DashboardLayout = styled.div`
  display: flex;
  min-height: calc(100vh - 48px);
  background: ${props => props.theme?.colors?.background || '#0a0e17'};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Sidebar
const Sidebar = styled.div`
  width: 260px;
  min-width: 260px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border-right: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  position: sticky;
  top: 0;
  overflow-y: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.06)'};
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: auto;
    position: relative;
    padding: 16px;
    border-right: none;
    border-bottom: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
    flex-direction: row;
    overflow-x: auto;
    flex-wrap: nowrap;
    gap: 4px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 2px;
  }
`;

const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px 20px 12px;
  border-bottom: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  margin-bottom: 20px;

  .brand-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
  }

  .brand-text {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    letter-spacing: -0.3px;
  }

  .brand-sub {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileBrand = styled.div`
  display: none;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border-radius: 10px;
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  flex-shrink: 0;

  .brand-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
  }

  .brand-text {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${props => props.active ? props.theme?.colors?.text || '#f1f5f9' : props.theme?.colors?.textSecondary || '#94a3b8'};
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};
  border: 2px solid ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : 'transparent'};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  position: relative;

  &:hover {
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.04)'};
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .nav-icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .nav-badge {
    margin-left: auto;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 10px;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 11px;
    border-radius: 8px;
    flex-shrink: 0;

    .nav-icon {
      font-size: 14px;
      width: 20px;
    }
    .nav-badge {
      font-size: 8px;
      padding: 1px 6px;
    }
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 10px;
    .nav-icon { font-size: 12px; width: 16px; }
  }
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: row;
    margin-bottom: 0;
    gap: 4px;
  }
`;

const NavLabel = styled.div`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${props => props.theme?.colors?.textMuted || '#64748b'};
  padding: 0 12px;
  margin-bottom: 6px;
  font-weight: 700;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavSpacer = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Main Content
const MainContent = styled.div`
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

// Page Header
const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;

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
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    .title { font-size: 20px; }
    .subtitle { font-size: 12px; }
  }
`;

// Balance Card
const BalanceCard = styled.div`
  padding: 28px 32px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
  border-radius: 16px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 8px 32px ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.15)'};

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

  .balance-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    flex-direction: column;
    align-items: flex-start;
    .balance-amount { font-size: 26px; }
    .balance-actions { width: 100%; }
  }

  @media (max-width: 480px) {
    padding: 16px 18px;
    .balance-amount { font-size: 22px; }
  }
`;

const ActionButton = styled.button`
  padding: 10px 24px;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

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

// Stats Grid
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
  }
`;

const StatCard = styled.div`
  padding: 18px 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.1)'};
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
    margin-top: 2px;
    color: ${props => props.positive ? props.theme?.colors?.success || '#22c55e' : props.theme?.colors?.danger || '#ef4444'};
  }
`;

// Filter Bar
const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 6px 18px;
  border: 2px solid ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 20px;
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};
  color: ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.textMuted || '#64748b'};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
    color: ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.text || '#f1f5f9'};
  }
`;

// Transaction Table
const TableCard = styled.div`
  padding: 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 12px;

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
      background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
      padding: 1px 10px;
      border-radius: 12px;
      border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    overflow-x: auto;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
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
    padding: 10px 14px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
    border-bottom: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
    white-space: nowrap;
  }

  tbody td {
    padding: 10px 14px;
    font-size: 12px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    border-bottom: 2px solid ${props => props.theme?.colors?.border + '20' || 'rgba(255,255,255,0.02)'};
    white-space: nowrap;
    font-weight: 700;
  }

  tbody tr:hover {
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.02)'};
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 14px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .status-completed {
    color: ${props => props.theme?.colors?.success || '#22c55e'};
    background: ${props => props.theme?.colors?.success + '15' || 'rgba(34,197,94,0.06)'};
    border: 2px solid ${props => props.theme?.colors?.success + '30' || 'rgba(34,197,94,0.1)'};
  }

  .status-pending {
    color: #f59e0b;
    background: rgba(245,158,11,0.06);
    border: 2px solid rgba(245,158,11,0.1);
  }

  .status-failed {
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    background: ${props => props.theme?.colors?.danger + '15' || 'rgba(239,68,68,0.06)'};
    border: 2px solid ${props => props.theme?.colors?.danger + '30' || 'rgba(239,68,68,0.1)'};
  }

  .status-processing {
    color: ${props => props.theme?.colors?.accent || '#2962ff'};
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)'};
    border: 2px solid ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.1)'};
  }

  .amount-positive {
    color: ${props => props.theme?.colors?.success || '#22c55e'};
  }

  .amount-negative {
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
  }

  .method-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
    border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(12px);
  z-index: 1000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 16px;
  padding: 28px 32px;
  animation: ${modalSlideIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);

  @media (max-width: 480px) {
    padding: 20px;
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
  }

  .close-btn {
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
    border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
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
      color: ${props => props.theme?.colors?.textMuted + '50' || '#4a4f5e'};
      font-weight: 400;
    }
  }

  select option {
    background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  }
`;

const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
`;

const PaymentMethodOption = styled.div`
  padding: 10px;
  border: 2px solid ${props => props.selected ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
  }

  .method-name {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.selected ? props.theme?.colors?.text || '#f1f5f9' : props.theme?.colors?.textMuted || '#64748b'};
  }

  .method-sub {
    font-size: 9px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    margin-top: 2px;
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
  margin-top: 4px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.15)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Toast
const ToastContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 24px;
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
  border: 2px solid ${props => props.type === 'success' ? props.theme?.colors?.success + '50' || 'rgba(34,197,94,0.2)' : props.theme?.colors?.danger + '50' || 'rgba(239,68,68,0.2)'};
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  animation: ${toastSlide} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  .toast-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  .toast-content {
    flex: 1;
  }

  .toast-title {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .toast-message {
    font-size: 11px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    font-weight: 700;
  }

  .toast-close {
    background: none;
    border: none;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentAgentDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('safaricom');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [balance, setBalance] = useState(2847293.50);

  const [transactions, setTransactions] = useState([
    { id: '#TRX-7841', type: 'Deposit', amount: 12450.00, status: 'completed', date: '2026-07-29 14:32', method: 'Safaricom' },
    { id: '#TRX-7840', type: 'Withdrawal', amount: 8230.50, status: 'pending', date: '2026-07-29 13:15', method: 'Airtel' },
    { id: '#TRX-7839', type: 'Deposit', amount: 5670.00, status: 'processing', date: '2026-07-29 12:42', method: 'Bank Transfer' },
    { id: '#TRX-7838', type: 'Deposit', amount: 23400.00, status: 'completed', date: '2026-07-29 11:00', method: 'Safaricom' },
    { id: '#TRX-7837', type: 'Withdrawal', amount: 3200.00, status: 'failed', date: '2026-07-29 09:30', method: 'Airtel' },
    { id: '#TRX-7836', type: 'Deposit', amount: 8750.00, status: 'completed', date: '2026-07-28 16:45', method: 'Bank Transfer' },
    { id: '#TRX-7835', type: 'Withdrawal', amount: 15000.00, status: 'pending', date: '2026-07-28 14:20', method: 'Safaricom' },
    { id: '#TRX-7834', type: 'Deposit', amount: 3200.00, status: 'completed', date: '2026-07-28 11:00', method: 'Airtel' },
  ]);

  const stats = [
    { label: 'Total Deposits', value: '$2,847,293.50', change: '+12.5%', positive: true },
    { label: 'Total Withdrawals', value: '$847,293.50', change: '-3.2%', positive: false },
    { label: 'Pending Transactions', value: '12', change: '+2', positive: true },
    { label: 'Successful Trades', value: '1,847', change: '+8.3%', positive: true }
  ];

  const paymentMethods = [
    { id: 'safaricom', name: 'Safaricom', sub: 'M-Pesa' },
    { id: 'airtel', name: 'Airtel', sub: 'Airtel Money' },
    { id: 'bank', name: 'Bank Transfer', sub: 'Wire Transfer' }
  ];

  const navItems = {
    main: [
      { id: 'home', label: 'Dashboard', icon: '▣' },
      { id: 'transactions', label: 'Transactions', icon: '▤' },
      { id: 'deposits', label: 'Deposits', icon: '↓' },
      { id: 'withdrawals', label: 'Withdrawals', icon: '↑' },
    ],
    secondary: [
      { id: 'support', label: 'Help & Support', icon: '?' },
      { id: 'account', label: 'Account', icon: '⚙' },
    ]
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'deposits') return tx.type === 'Deposit';
    if (filter === 'withdrawals') return tx.type === 'Withdrawal';
    return true;
  });

  const addToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const handleTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Invalid Amount', 'Please enter a valid amount', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const methodName = paymentMethods.find(m => m.id === paymentMethod)?.name || 'Unknown';
      const newTransaction = {
        id: `#TRX-${Math.floor(Math.random() * 9000 + 1000)}`,
        type: transactionType === 'deposit' ? 'Deposit' : 'Withdrawal',
        amount: parseFloat(amount),
        status: 'pending',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        method: methodName
      };

      setTransactions([newTransaction, ...transactions]);

      if (transactionType === 'deposit') {
        setBalance(prev => prev + parseFloat(amount));
        addToast(
          'Deposit Successful',
          `$${parseFloat(amount).toFixed(2)} added via ${methodName}`,
          'success'
        );
      } else {
        setBalance(prev => prev - parseFloat(amount));
        addToast(
          'Withdrawal Initiated',
          `$${parseFloat(amount).toFixed(2)} requested via ${methodName}`,
          'success'
        );
      }

      setIsProcessing(false);
      setIsModalOpen(false);
      setAmount('');
    }, 1500);
  };

  const getStatusClass = (status) => `status-${status}`;

  return (
    <DashboardLayout>
      {/* TOASTS */}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} type={toast.type}>
            <span className="toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>✕</button>
          </Toast>
        ))}
      </ToastContainer>

      {/* SIDEBAR */}
      <Sidebar>
        <SidebarBrand>
          <div className="brand-icon">VT</div>
          <div>
            <div className="brand-text">Voltix</div>
            <div className="brand-sub">Payment Agent</div>
          </div>
        </SidebarBrand>

        <MobileBrand>
          <div className="brand-icon">VT</div>
          <span className="brand-text">Voltix Pay</span>
        </MobileBrand>

        <NavSection>
          {navItems.main.map((item) => (
            <NavItem
              key={item.id}
              active={activePage === item.id}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id === 'transactions' && <span className="nav-badge">12</span>}
            </NavItem>
          ))}
        </NavSection>

        <NavSpacer />

        <NavSection>
          <NavLabel>Support</NavLabel>
          {navItems.secondary.map((item) => (
            <NavItem
              key={item.id}
              active={activePage === item.id}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavItem>
          ))}
        </NavSection>
      </Sidebar>

      {/* MAIN CONTENT */}
      <MainContent>
        <PageHeader>
          <div>
            <div className="title">Payment Dashboard</div>
            <div className="subtitle">Manage deposits, withdrawals, and transactions</div>
          </div>
        </PageHeader>

        {/* BALANCE */}
        <BalanceCard>
          <div>
            <div className="balance-label">Available Balance</div>
            <div className="balance-amount">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="balance-sub">USD · Real-time</div>
          </div>
          <div className="balance-actions">
            <ActionButton onClick={() => { setTransactionType('deposit'); setIsModalOpen(true); }}>
              Deposit
            </ActionButton>
            <ActionButton onClick={() => { setTransactionType('withdraw'); setIsModalOpen(true); }}>
              Withdraw
            </ActionButton>
          </div>
        </BalanceCard>

        {/* STATS */}
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index} positive={stat.positive}>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change">{stat.positive ? '↑' : '↓'} {stat.change}</div>
            </StatCard>
          ))}
        </StatsGrid>

        {/* TRANSACTIONS */}
        <TableCard>
          <div className="table-header">
            <div className="table-title">
              Recent Transactions
              <span className="count">{filteredTransactions.length}</span>
            </div>
          </div>

          <FilterBar>
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
            <FilterButton active={filter === 'deposits'} onClick={() => setFilter('deposits')}>Deposits</FilterButton>
            <FilterButton active={filter === 'withdrawals'} onClick={() => setFilter('withdrawals')}>Withdrawals</FilterButton>
          </FilterBar>

          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ color: '#f1f5f9', fontWeight: '700' }}>{tx.id}</td>
                    <td>{tx.type}</td>
                    <td className={tx.type === 'Deposit' ? 'amount-positive' : 'amount-negative'}>
                      {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td>
                      <span className="method-tag">{tx.method}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(tx.status)}`}>
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
      </MainContent>

      {/* MODAL */}
      <ModalOverlay isOpen={isModalOpen} onClick={() => !isProcessing && setIsModalOpen(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <span className="title">{transactionType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</span>
            <button className="close-btn" onClick={() => !isProcessing && setIsModalOpen(false)}>✕</button>
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
              <PaymentMethodGrid>
                {paymentMethods.map((method) => (
                  <PaymentMethodOption
                    key={method.id}
                    selected={paymentMethod === method.id}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="method-name">{method.name}</div>
                    <div className="method-sub">{method.sub}</div>
                  </PaymentMethodOption>
                ))}
              </PaymentMethodGrid>
            </FormGroup>

            {paymentMethod === 'safaricom' && (
              <FormGroup>
                <label>Safaricom Number</label>
                <input type="text" placeholder="07XX XXX XXX" value="0712 345 678" disabled />
              </FormGroup>
            )}

            {paymentMethod === 'airtel' && (
              <FormGroup>
                <label>Airtel Number</label>
                <input type="text" placeholder="07XX XXX XXX" value="0733 456 789" disabled />
              </FormGroup>
            )}

            {paymentMethod === 'bank' && (
              <FormGroup>
                <label>Bank Account</label>
                <input type="text" placeholder="Account Number" value="****5678" disabled />
              </FormGroup>
            )}

            <SubmitButton onClick={handleTransaction} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : transactionType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </SubmitButton>
          </ModalBody>
        </Modal>
      </ModalOverlay>
    </DashboardLayout>
  );
};

export default PaymentAgentDashboard;