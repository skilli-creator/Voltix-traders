// src/pages/PaymentAgentDashboard.jsx

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${props => props.theme?.colors?.accent + '20' || 'rgba(41,98,255,0.1)'}; }
  50% { box-shadow: 0 0 50px ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'}; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const modalSlideIn = keyframes`
  from { opacity: 0; transform: scale(0.9) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const modalBackdrop = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const toastSlide = keyframes`
  from { opacity: 0; transform: translateX(50px) scale(0.9); }
  to { opacity: 1; transform: translateX(0) scale(1); }
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
  padding: 28px 32px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
  border-radius: 20px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  animation: ${fadeIn} 0.5s ease;
  box-shadow: 0 8px 40px ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -40%;
    left: -10%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
  }

  .balance-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    z-index: 1;
  }

  .balance-label {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .balance-amount {
    font-size: 36px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.1);
  }

  .balance-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    font-weight: 700;
  }

  .balance-right {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    flex-direction: column;
    align-items: flex-start;
    .balance-amount { font-size: 28px; }
    .balance-right { width: 100%; }
  }

  @media (max-width: 480px) {
    padding: 16px 18px;
    .balance-amount { font-size: 24px; }
  }
`;

const ActionButton = styled.button`
  padding: 12px 28px;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.4);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 480px) {
    padding: 10px 18px;
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
  padding: 18px 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeIn} 0.5s ease;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.15)'};
    transform: translateY(-4px);
    box-shadow: 0 8px 32px ${props => props.theme?.colors?.shadow || 'rgba(0,0,0,0.2)'};
  }

  .stat-label {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 24px;
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
    .stat-value { font-size: 20px; }
  }
`;

// ============================================
// FILTER BUTTONS
// ============================================
const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const FilterButton = styled.button`
  padding: 6px 18px;
  border: 2px solid ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 20px;
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};
  color: ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.textMuted || '#64748b'};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
    color: ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.text || '#f1f5f9'};
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    padding: 5px 12px;
    font-size: 10px;
  }
`;

// ============================================
// SUPER SMOOTH MODAL
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 1000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${modalBackdrop} 0.3s ease;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 500px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.08)'};
  border-radius: 24px;
  padding: 32px 36px;
  animation: ${modalSlideIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => `linear-gradient(90deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'}, ${props.theme?.colors?.accent || '#2962ff'})`};
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    padding: 24px 20px;
    border-radius: 20px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  .title {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    display: flex;
    align-items: center;
    gap: 12px;

    .icon {
      font-size: 24px;
    }
  }

  .close {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
      color: ${props => props.theme?.colors?.text || '#f1f5f9'};
      transform: rotate(90deg);
      background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)'};
    }
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
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
    padding: 12px 16px;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
    border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
    border-radius: 12px;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    font-size: 14px;
    font-weight: 700;
    outline: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus {
      border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
      box-shadow: 0 0 0 4px ${props => props.theme?.colors?.accent + '20' || 'rgba(41,98,255,0.05)'};
      transform: scale(1.01);
    }

    &::placeholder {
      color: ${props => props.theme?.colors?.textMuted + '60' || '#4a4f5e'};
      font-weight: 400;
    }
  }

  select option {
    background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  }

  .input-icon {
    position: relative;

    input {
      padding-left: 40px;
    }

    .icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      opacity: 0.6;
    }
  }
`;

const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentMethodOption = styled.div`
  padding: 12px;
  border: 2px solid ${props => props.selected ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.selected ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)' : 'transparent'};

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
    transform: translateY(-2px);
  }

  .method-icon {
    font-size: 24px;
    display: block;
    margin-bottom: 4px;
  }

  .method-name {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.selected ? props.theme?.colors?.text || '#f1f5f9' : props.theme?.colors?.textMuted || '#64748b'};
  }

  @media (max-width: 480px) {
    padding: 10px;
    .method-icon { font-size: 20px; }
    .method-name { font-size: 10px; }
  }
`;

const SubmitButton = styled.button`
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 6px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  &:hover:not(:disabled)::before {
    transform: translateX(100%);
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px ${props => props.theme?.colors?.accent + '40' || 'rgba(41,98,255,0.2)'};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// ============================================
// TOAST NOTIFICATION
// ============================================
const ToastContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  width: 100%;
  pointer-events: none;

  @media (max-width: 480px) {
    right: 12px;
    left: 12px;
    max-width: none;
    top: 70px;
  }
`;

const Toast = styled.div`
  pointer-events: auto;
  padding: 16px 20px;
  border-radius: 16px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#111622'};
  border: 2px solid ${props => props.type === 'success' ? props.theme?.colors?.success + '60' || 'rgba(34,197,94,0.3)' : props.theme?.colors?.danger + '60' || 'rgba(239,68,68,0.3)'};
  box-shadow: 0 12px 48px rgba(0,0,0,0.5);
  animation: ${toastSlide} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(20px);

  .icon {
    font-size: 22px;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
  }

  .title {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .message {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    margin-top: 1px;
  }

  .close-toast {
    background: none;
    border: none;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
    transition: all 0.2s ease;

    &:hover {
      color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    }
  }
`;

// ============================================
// TRANSACTION TABLE
// ============================================
const TableCard = styled.div`
  padding: 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 16px;
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
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    display: flex;
    align-items: center;
    gap: 8px;

    .count {
      font-size: 11px;
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.03)'};
      padding: 1px 12px;
      border-radius: 14px;
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
    padding: 12px 14px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
    border-bottom: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
    white-space: nowrap;
  }

  tbody td {
    padding: 12px 14px;
    font-size: 12px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    border-bottom: 2px solid ${props => props.theme?.colors?.border + '30' || 'rgba(255,255,255,0.02)'};
    white-space: nowrap;
    font-weight: 700;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr {
    transition: all 0.2s ease;
  }

  tbody tr:hover {
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.03)'};
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 14px;
    border-radius: 14px;
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
  }

  .amount-negative {
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
  }

  .method-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 700;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
    border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  }

  @media (max-width: 768px) {
    thead th, tbody td { padding: 8px 10px; font-size: 11px; }
  }

  @media (max-width: 480px) {
    thead th, tbody td { padding: 6px 8px; font-size: 10px; }
    .status { padding: 2px 10px; font-size: 8px; }
    .method-badge { font-size: 8px; padding: 1px 6px; }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentAgentDashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(2847293.50);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('safaricom');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

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
    { id: 'safaricom', name: 'Safaricom', icon: '📱' },
    { id: 'airtel', name: 'Airtel', icon: '📱' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' }
  ];

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
          'Deposit Successful! ✅',
          `$${parseFloat(amount).toFixed(2)} has been added to your account via ${methodName}`,
          'success'
        );
      } else {
        setBalance(prev => prev - parseFloat(amount));
        addToast(
          'Withdrawal Initiated! 💳',
          `$${parseFloat(amount).toFixed(2)} has been requested via ${methodName}`,
          'success'
        );
      }

      setIsProcessing(false);
      setIsModalOpen(false);
      setAmount('');
    }, 1500);
  };

  const getStatusClass = (status) => `status-${status}`;
  const getAmountClass = (amount, type) => type === 'Deposit' ? 'amount-positive' : 'amount-negative';

  return (
    <DashboardContainer>
      {/* TOASTS */}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} type={toast.type}>
            <span className="icon">{toast.type === 'success' ? '✅' : '❌'}</span>
            <div className="content">
              <div className="title">{toast.title}</div>
              <div className="message">{toast.message}</div>
            </div>
            <button className="close-toast" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>✕</button>
          </Toast>
        ))}
      </ToastContainer>

      <DashboardHeader>
        <HeaderLeft>
          <div className="icon">💳</div>
          <div className="title-group">
            <span className="title">Payment Dashboard</span>
            <span className="subtitle">Deposit & withdraw via Safaricom, Airtel, or Bank Transfer</span>
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
            <span className="count">{filteredTransactions.length}</span>
          </div>
        </div>

        {/* FILTERS */}
        <FilterContainer>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            📊 All
          </FilterButton>
          <FilterButton active={filter === 'deposits'} onClick={() => setFilter('deposits')}>
            💰 Deposits
          </FilterButton>
          <FilterButton active={filter === 'withdrawals'} onClick={() => setFilter('withdrawals')}>
            💳 Withdrawals
          </FilterButton>
        </FilterContainer>

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
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ color: '#f1f5f9', fontWeight: '700' }}>{tx.id}</td>
                  <td>{tx.type}</td>
                  <td className={tx.type === 'Deposit' ? 'amount-positive' : 'amount-negative'}>
                    {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td>
                    <span className="method-badge">
                      {tx.method === 'Safaricom' ? '📱' : tx.method === 'Airtel' ? '📱' : '🏦'} {tx.method}
                    </span>
                  </td>
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

      {/* SUPER SMOOTH MODAL */}
      <ModalOverlay isOpen={isModalOpen} onClick={() => !isProcessing && setIsModalOpen(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <div className="title">
              <span className="icon">{transactionType === 'deposit' ? '💰' : '💳'}</span>
              {transactionType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </div>
            <button className="close" onClick={() => !isProcessing && setIsModalOpen(false)}>✕</button>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Amount (USD)</label>
              <div className="input-icon">
                <span className="icon">$</span>
                <input
                  type="number"
                  placeholder={transactionType === 'deposit' ? 'Enter deposit amount' : 'Enter withdrawal amount'}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  disabled={isProcessing}
                />
              </div>
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
                    <span className="method-icon">{method.icon}</span>
                    <span className="method-name">{method.name}</span>
                  </PaymentMethodOption>
                ))}
              </PaymentMethodGrid>
            </FormGroup>

            {paymentMethod === 'safaricom' && (
              <FormGroup>
                <label>Safaricom Phone Number</label>
                <div className="input-icon">
                  <span className="icon">📱</span>
                  <input type="text" placeholder="07XX XXX XXX" value="0712 345 678" disabled />
                </div>
              </FormGroup>
            )}

            {paymentMethod === 'airtel' && (
              <FormGroup>
                <label>Airtel Phone Number</label>
                <div className="input-icon">
                  <span className="icon">📱</span>
                  <input type="text" placeholder="07XX XXX XXX" value="0733 456 789" disabled />
                </div>
              </FormGroup>
            )}

            {paymentMethod === 'bank' && (
              <FormGroup>
                <label>Bank Account</label>
                <div className="input-icon">
                  <span className="icon">🏦</span>
                  <input type="text" placeholder="Account Number" value="****5678" disabled />
                </div>
              </FormGroup>
            )}

            <SubmitButton onClick={handleTransaction} disabled={isProcessing}>
              {isProcessing ? (
                <span>⏳ Processing...</span>
              ) : (
                transactionType === 'deposit' ? '💰 Deposit Funds' : '💳 Withdraw Funds'
              )}
            </SubmitButton>
          </ModalBody>
        </Modal>
      </ModalOverlay>
    </DashboardContainer>
  );
};

export default PaymentAgentDashboard;