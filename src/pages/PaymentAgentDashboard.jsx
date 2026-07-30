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

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const modalSlide = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${props => props.theme?.colors?.accent + '15' || 'rgba(41,98,255,0.05)'}; }
  50% { box-shadow: 0 0 40px ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.1)'}; }
`;

// ============================================
// LAYOUT
// ============================================
const DashboardWrapper = styled.div`
  min-height: calc(100vh - 48px);
  background: ${props => props.theme?.colors?.background || '#080c14'};
  display: flex;
  flex-direction: column;

  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

// ============================================
// SIDEBAR - Desktop
// ============================================
const SidebarDesktop = styled.div`
  width: 240px;
  min-width: 240px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c101e'};
  border-right: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  position: sticky;
  top: 0;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.04)'};
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px 20px 12px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  margin-bottom: 24px;

  .logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'cc' || '#1a4fcf'})`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
  }

  .name {
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .role {
    font-size: 10px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
    margin-top: -1px;
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
  letter-spacing: 0.8px;
  color: ${props => props.theme?.colors?.textMuted || '#64748b'};
  padding: 0 12px;
  margin-bottom: 4px;
  font-weight: 700;
  opacity: 0.5;
`;

const NavItemDesktop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? props.theme?.colors?.text || '#f1f5f9' : props.theme?.colors?.textMuted || '#64748b'};
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.04)' : 'transparent'};
  border-left: 2px solid ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : 'transparent'};
  font-size: 12px;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.03)'};
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .icon {
    font-size: 15px;
    width: 20px;
    text-align: center;
    opacity: 0.6;
  }

  .badge {
    margin-left: auto;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 10px;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: #fff;
  }
`;

const NavSpacer = styled.div`
  flex: 1;
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
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c101e'};
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  padding: 6px 8px;
  z-index: 100;
  justify-content: space-around;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavItemMobile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.textMuted || '#64748b'};
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.04)' : 'transparent'};
  font-size: 9px;
  font-weight: 700;
  flex: 1;
  text-align: center;

  .icon {
    font-size: 18px;
  }

  .label {
    font-size: 8px;
  }

  .badge {
    font-size: 8px;
    font-weight: 700;
    padding: 1px 8px;
    border-radius: 10px;
    background: ${props => props.theme?.colors?.danger || '#ef4444'};
    color: #fff;
    margin-top: -4px;
  }
`;

// ============================================
// MAIN CONTENT
// ============================================
const MainArea = styled.div`
  flex: 1;
  padding: 28px 36px;
  overflow-y: auto;
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 1024px) {
    padding: 24px 28px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    padding-bottom: 80px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    padding-bottom: 72px;
  }
`;

// ============================================
// PAGE HEADER
// ============================================
const PageHeader = styled.div`
  margin-bottom: 28px;

  .title {
    font-size: 22px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    letter-spacing: -0.3px;
  }

  .sub {
    font-size: 13px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
    .title { font-size: 19px; }
    .sub { font-size: 12px; }
  }
`;

// ============================================
// BALANCE CARD
// ============================================
const BalanceCard = styled.div`
  padding: 28px 32px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'cc' || '#1a4fcf'})`};
  border-radius: 14px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  overflow: hidden;
  animation: ${pulseGlow} 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: -60%;
    right: -10%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -40%;
    left: -5%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.02);
  }

  .left {
    position: relative;
    z-index: 1;
  }

  .label {
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .amount {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    margin-top: 2px;
  }

  .sub {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    font-weight: 700;
    margin-top: 2px;
  }

  .actions {
    display: flex;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    flex-direction: column;
    align-items: flex-start;
    .amount { font-size: 26px; }
    .actions { width: 100%; }
  }

  @media (max-width: 480px) {
    padding: 16px 18px;
    .amount { font-size: 22px; }
  }
`;

const Btn = styled.button`
  padding: 10px 22px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 11px;
    flex: 1;
  }
`;

// ============================================
// STATS
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
  }
`;

const StatCard = styled.div`
  padding: 18px 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c101e'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.05)'};
  }

  .label {
    font-size: 10px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    margin-top: 4px;
  }

  .change {
    font-size: 10px;
    font-weight: 700;
    margin-top: 2px;
    color: ${props => props.positive ? props.theme?.colors?.success || '#22c55e' : props.theme?.colors?.danger || '#ef4444'};
  }
`;

// ============================================
// FILTERS
// ============================================
const FilterBar = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  padding: 5px 16px;
  border: 1px solid ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  border-radius: 16px;
  background: ${props => props.active ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.04)' : 'transparent'};
  color: ${props => props.active ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.textMuted || '#64748b'};
  font-size: 10px;
  font-weight: 700;
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
const TableCard = styled.div`
  padding: 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c101e'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  border-radius: 10px;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .title {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};

    .count {
      font-size: 10px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.02)'};
      padding: 1px 10px;
      border-radius: 10px;
      border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
      margin-left: 6px;
    }
  }

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || 'rgba(255,255,255,0.04)'};
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-weight: 700;
  min-width: 600px;

  thead th {
    text-align: left;
    padding: 8px 12px;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
    font-weight: 700;
  }

  tbody td {
    padding: 8px 12px;
    font-size: 11px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.02)'};
    font-weight: 700;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.02)'}; }

  .id { color: ${props => props.theme?.colors?.text || '#f1f5f9'}; font-weight: 700; }
  .positive { color: ${props => props.theme?.colors?.success || '#22c55e'}; }
  .negative { color: ${props => props.theme?.colors?.danger || '#ef4444'}; }

  .status {
    display: inline-flex;
    padding: 2px 12px;
    border-radius: 10px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .status-completed {
    color: ${props => props.theme?.colors?.success || '#22c55e'};
    background: ${props => props.theme?.colors?.success + '10' || 'rgba(34,197,94,0.04)'};
    border: 1px solid ${props => props.theme?.colors?.success + '20' || 'rgba(34,197,94,0.06)'};
  }

  .status-pending {
    color: #f59e0b;
    background: rgba(245,158,11,0.04);
    border: 1px solid rgba(245,158,11,0.06);
  }

  .status-failed {
    color: ${props => props.theme?.colors?.danger || '#ef4444'};
    background: ${props => props.theme?.colors?.danger + '10' || 'rgba(239,68,68,0.04)'};
    border: 1px solid ${props => props.theme?.colors?.danger + '20' || 'rgba(239,68,68,0.06)'};
  }

  .method {
    display: inline-flex;
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 9px;
    font-weight: 700;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.01)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  }
`;

// ============================================
// SUPPORT PAGE
// ============================================
const SupportCard = styled.div`
  padding: 20px 24px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c101e'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  border-radius: 10px;
  margin-bottom: 16px;

  .title {
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    margin-bottom: 8px;
  }

  .desc {
    font-size: 12px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    font-weight: 700;
    line-height: 1.8;
  }

  .contact {
    margin-top: 12px;
    padding: 12px 16px;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.01)'};
    border-radius: 8px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};

    .row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 12px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
      .lbl { color: ${props => props.theme?.colors?.textMuted || '#64748b'}; }
      .val { color: ${props => props.theme?.colors?.text || '#f1f5f9'}; }
    }
  }
`;

// ============================================
// ACCOUNT PAGE
// ============================================
const AccountCard = styled.div`
  padding: 20px 24px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c101e'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  border-radius: 10px;
  margin-bottom: 16px;

  .row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.02)'};
    &:last-child { border-bottom: none; }
    .lbl { font-size: 12px; font-weight: 700; color: ${props => props.theme?.colors?.textMuted || '#64748b'}; }
    .val { font-size: 12px; font-weight: 700; color: ${props => props.theme?.colors?.text || '#f1f5f9'}; }
  }
`;

// ============================================
// MODAL
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: ${props => props.open ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 440px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c101e'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 14px;
  padding: 28px 32px;
  animation: ${modalSlide} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .title {
    font-size: 17px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  }

  .close {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
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
  gap: 14px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 10px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    padding: 10px 14px;
    background: ${props => props.theme?.colors?.background || 'rgba(255,255,255,0.01)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
    border-radius: 8px;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    font-size: 13px;
    font-weight: 700;
    outline: none;

    &:focus {
      border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
    }

    &::placeholder {
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      font-weight: 400;
      opacity: 0.4;
    }
  }
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
`;

const MethodOption = styled.div`
  padding: 10px;
  border: 1px solid ${props => props.selected ? props.theme?.colors?.accent || '#2962ff' : props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? props.theme?.colors?.accentActive || 'rgba(41,98,255,0.04)' : 'transparent'};

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
  }

  .name {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.selected ? props.theme?.colors?.text || '#f1f5f9' : props.theme?.colors?.textMuted || '#64748b'};
  }

  .sub {
    font-size: 8px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    margin-top: 2px;
  }
`;

const SubmitBtn = styled.button`
  padding: 11px;
  border: none;
  border-radius: 8px;
  background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'cc' || '#1a4fcf'})`};
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 4px;

  &:hover:not(:disabled) { transform: translateY(-2px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
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
  background: ${props => props.theme?.colors?.backgroundSecondary || '#0c101e'};
  border: 1px solid ${props => props.type === 'success' ? props.theme?.colors?.success + '40' || 'rgba(34,197,94,0.1)' : props.theme?.colors?.danger + '40' || 'rgba(239,68,68,0.1)'};
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon { font-size: 16px; flex-shrink: 0; }
  .content { flex: 1; }
  .title { font-size: 12px; font-weight: 700; color: ${props => props.theme?.colors?.text || '#f1f5f9'}; }
  .msg { font-size: 10px; font-weight: 700; color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'}; }
  .close { background: none; border: none; color: ${props => props.theme?.colors?.textMuted || '#64748b'}; cursor: pointer; font-size: 12px; }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentAgentDashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [txType, setTxType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('safaricom');
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [balance, setBalance] = useState(2847293.50);

  const [transactions] = useState([
    { id: '#TRX-7841', type: 'Deposit', amount: 12450.00, status: 'completed', date: '2026-07-29 14:32', method: 'Safaricom' },
    { id: '#TRX-7840', type: 'Withdrawal', amount: 8230.50, status: 'pending', date: '2026-07-29 13:15', method: 'Airtel' },
    { id: '#TRX-7839', type: 'Deposit', amount: 5670.00, status: 'processing', date: '2026-07-29 12:42', method: 'Bank Transfer' },
    { id: '#TRX-7838', type: 'Deposit', amount: 23400.00, status: 'completed', date: '2026-07-29 11:00', method: 'Safaricom' },
    { id: '#TRX-7837', type: 'Withdrawal', amount: 3200.00, status: 'failed', date: '2026-07-29 09:30', method: 'Airtel' },
  ]);

  const stats = [
    { label: 'Total Deposits', value: '$2,847,293.50', change: '+12.5%', positive: true },
    { label: 'Total Withdrawals', value: '$847,293.50', change: '-3.2%', positive: false },
    { label: 'Pending', value: '12', change: '+2', positive: true },
    { label: 'Success Rate', value: '97.8%', change: '+1.2%', positive: true }
  ];

  const methods = [
    { id: 'safaricom', name: 'Safaricom', sub: 'M-Pesa' },
    { id: 'airtel', name: 'Airtel', sub: 'Airtel Money' },
    { id: 'bank', name: 'Bank Transfer', sub: 'Wire' }
  ];

  const navMain = [
    { id: 'home', label: 'Dashboard', icon: '▣' },
    { id: 'transactions', label: 'Transactions', icon: '▤' },
    { id: 'deposits', label: 'Deposits', icon: '↓' },
    { id: 'withdrawals', label: 'Withdrawals', icon: '↑' },
  ];

  const navSec = [
    { id: 'support', label: 'Help & Support', icon: '?' },
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
      setModalOpen(false);
      setAmount('');
    }, 1200);
  };

  const renderPage = () => {
    switch(activePage) {
      case 'home': return (
        <>
          <PageHeader><div className="title">Dashboard</div><div className="sub">Overview of your payment activity</div></PageHeader>

          <BalanceCard>
            <div className="left">
              <div className="label">Available Balance</div>
              <div className="amount">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="sub">USD · Real-time</div>
            </div>
            <div className="actions">
              <Btn onClick={() => { setTxType('deposit'); setModalOpen(true); }}>Deposit</Btn>
              <Btn onClick={() => { setTxType('withdraw'); setModalOpen(true); }}>Withdraw</Btn>
            </div>
          </BalanceCard>

          <StatsGrid>
            {stats.map((s, i) => (
              <StatCard key={i} positive={s.positive}>
                <div className="label">{s.label}</div>
                <div className="value">{s.value}</div>
                <div className="change">{s.positive ? '↑' : '↓'} {s.change}</div>
              </StatCard>
            ))}
          </StatsGrid>

          <TableCard>
            <div className="head">
              <div className="title">Recent Transactions <span className="count">{transactions.length}</span></div>
            </div>
            <TableWrap>
              <Table>
                <thead><tr><th>ID</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {transactions.slice(0, 5).map(tx => (
                    <tr key={tx.id}>
                      <td className="id">{tx.id}</td>
                      <td>{tx.type}</td>
                      <td className={tx.type === 'Deposit' ? 'positive' : 'negative'}>{tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}</td>
                      <td><span className="method">{tx.method}</span></td>
                      <td><span className={`status status-${tx.status}`}>{tx.status}</span></td>
                      <td style={{ color: '#64748b', fontSize: '10px' }}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </TableCard>
        </>
      );

      case 'transactions': return (
        <>
          <PageHeader><div className="title">All Transactions</div><div className="sub">Complete transaction history</div></PageHeader>
          <TableCard>
            <div className="head"><div className="title">Transactions <span className="count">{filtered.length}</span></div></div>
            <FilterBar>
              <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterBtn>
              <FilterBtn active={filter === 'deposits'} onClick={() => setFilter('deposits')}>Deposits</FilterBtn>
              <FilterBtn active={filter === 'withdrawals'} onClick={() => setFilter('withdrawals')}>Withdrawals</FilterBtn>
            </FilterBar>
            <TableWrap>
              <Table>
                <thead><tr><th>ID</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {filtered.map(tx => (
                    <tr key={tx.id}>
                      <td className="id">{tx.id}</td>
                      <td>{tx.type}</td>
                      <td className={tx.type === 'Deposit' ? 'positive' : 'negative'}>{tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}</td>
                      <td><span className="method">{tx.method}</span></td>
                      <td><span className={`status status-${tx.status}`}>{tx.status}</span></td>
                      <td style={{ color: '#64748b', fontSize: '10px' }}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </TableCard>
        </>
      );

      case 'deposits': return (
        <>
          <PageHeader><div className="title">Deposits</div><div className="sub">All deposit transactions</div></PageHeader>
          <TableCard>
            <div className="head"><div className="title">Deposit History <span className="count">{transactions.filter(t => t.type === 'Deposit').length}</span></div></div>
            <TableWrap>
              <Table>
                <thead><tr><th>ID</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {transactions.filter(t => t.type === 'Deposit').map(tx => (
                    <tr key={tx.id}>
                      <td className="id">{tx.id}</td>
                      <td className="positive">+${tx.amount.toFixed(2)}</td>
                      <td><span className="method">{tx.method}</span></td>
                      <td><span className={`status status-${tx.status}`}>{tx.status}</span></td>
                      <td style={{ color: '#64748b', fontSize: '10px' }}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </TableCard>
        </>
      );

      case 'withdrawals': return (
        <>
          <PageHeader><div className="title">Withdrawals</div><div className="sub">All withdrawal transactions</div></PageHeader>
          <TableCard>
            <div className="head"><div className="title">Withdrawal History <span className="count">{transactions.filter(t => t.type === 'Withdrawal').length}</span></div></div>
            <TableWrap>
              <Table>
                <thead><tr><th>ID</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {transactions.filter(t => t.type === 'Withdrawal').map(tx => (
                    <tr key={tx.id}>
                      <td className="id">{tx.id}</td>
                      <td className="negative">-${tx.amount.toFixed(2)}</td>
                      <td><span className="method">{tx.method}</span></td>
                      <td><span className={`status status-${tx.status}`}>{tx.status}</span></td>
                      <td style={{ color: '#64748b', fontSize: '10px' }}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </TableCard>
        </>
      );

      case 'support': return (
        <>
          <PageHeader><div className="title">Help & Support</div><div className="sub">We're here to help</div></PageHeader>
          <SupportCard>
            <div className="title">Frequently Asked Questions</div>
            <div className="desc">
              <strong>How do I deposit?</strong><br />
              Click Deposit, select your method, and follow the instructions.<br /><br />
              <strong>How long do withdrawals take?</strong><br />
              Processed within 24-48 hours depending on your method.<br /><br />
              <strong>What payment methods are supported?</strong><br />
              Safaricom M-Pesa, Airtel Money, and Bank Transfers.
            </div>
          </SupportCard>
          <SupportCard>
            <div className="title">Contact Us</div>
            <div className="contact">
              <div className="row"><span className="lbl">Email</span><span className="val">support@voltixtraders.com</span></div>
              <div className="row"><span className="lbl">Phone</span><span className="val">+254 700 123 456</span></div>
              <div className="row"><span className="lbl">Live Chat</span><span className="val">Available 24/7</span></div>
            </div>
          </SupportCard>
        </>
      );

      case 'account': return (
        <>
          <PageHeader><div className="title">Account</div><div className="sub">Manage your account details</div></PageHeader>
          <AccountCard>
            <div className="row"><span className="lbl">Name</span><span className="val">John Trader</span></div>
            <div className="row"><span className="lbl">Email</span><span className="val">john@voltixtraders.com</span></div>
            <div className="row"><span className="lbl">Phone</span><span className="val">+254 712 345 678</span></div>
            <div className="row"><span className="lbl">Account Type</span><span className="val">Premium</span></div>
            <div className="row"><span className="lbl">Joined</span><span className="val">January 2026</span></div>
          </AccountCard>
          <AccountCard>
            <div className="row"><span className="lbl">Safaricom</span><span className="val">0712 345 678</span></div>
            <div className="row"><span className="lbl">Airtel</span><span className="val">0733 456 789</span></div>
            <div className="row"><span className="lbl">Bank Account</span><span className="val">****5678</span></div>
          </AccountCard>
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

      <DashboardWrapper>
        {/* DESKTOP SIDEBAR */}
        <SidebarDesktop>
          <Brand>
            <div className="logo">VT</div>
            <div>
              <div className="name">Voltix</div>
              <div className="role">Payment Agent</div>
            </div>
          </Brand>

          <NavGroup>
            {navMain.map(item => (
              <NavItemDesktop key={item.id} active={activePage === item.id} onClick={() => setActivePage(item.id)}>
                <span className="icon">{item.icon}</span>
                {item.label}
                {item.id === 'transactions' && <span className="badge">12</span>}
              </NavItemDesktop>
            ))}
          </NavGroup>

          <NavSpacer />

          <NavGroup>
            <NavLabel>Support</NavLabel>
            {navSec.map(item => (
              <NavItemDesktop key={item.id} active={activePage === item.id} onClick={() => setActivePage(item.id)}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </NavItemDesktop>
            ))}
          </NavGroup>
        </SidebarDesktop>

        {/* MAIN CONTENT */}
        <MainArea>
          {renderPage()}
        </MainArea>
      </DashboardWrapper>

      {/* MOBILE BOTTOM NAV */}
      <BottomNav>
        {[...navMain, ...navSec].map(item => (
          <NavItemMobile key={item.id} active={activePage === item.id} onClick={() => setActivePage(item.id)}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
            {item.id === 'transactions' && <span className="badge">12</span>}
          </NavItemMobile>
        ))}
      </BottomNav>

      {/* MODAL */}
      <ModalOverlay open={modalOpen} onClick={() => !processing && setModalOpen(false)}>
        <Modal onClick={e => e.stopPropagation()}>
          <ModalHead>
            <span className="title">{txType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</span>
            <button className="close" onClick={() => !processing && setModalOpen(false)}>✕</button>
          </ModalHead>
          <ModalBody>
            <FormGroup>
              <label>Amount (USD)</label>
              <input type="number" placeholder={txType === 'deposit' ? 'Enter deposit amount' : 'Enter withdrawal amount'} value={amount} onChange={e => setAmount(e.target.value)} min="1" step="0.01" disabled={processing} />
            </FormGroup>

            <FormGroup>
              <label>Payment Method</label>
              <MethodGrid>
                {methods.map(m => (
                  <MethodOption key={m.id} selected={method === m.id} onClick={() => setMethod(m.id)}>
                    <div className="name">{m.name}</div>
                    <div className="sub">{m.sub}</div>
                  </MethodOption>
                ))}
              </MethodGrid>
            </FormGroup>

            {method === 'safaricom' && (
              <FormGroup>
                <label>Safaricom Number</label>
                <input type="text" placeholder="07XX XXX XXX" value="0712 345 678" disabled />
              </FormGroup>
            )}

            {method === 'airtel' && (
              <FormGroup>
                <label>Airtel Number</label>
                <input type="text" placeholder="07XX XXX XXX" value="0733 456 789" disabled />
              </FormGroup>
            )}

            {method === 'bank' && (
              <FormGroup>
                <label>Bank Account</label>
                <input type="text" placeholder="Account Number" value="****5678" disabled />
              </FormGroup>
            )}

            <SubmitBtn onClick={handleTx} disabled={processing}>
              {processing ? 'Processing...' : txType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </SubmitBtn>
          </ModalBody>
        </Modal>
      </ModalOverlay>
    </>
  );
};

export default PaymentAgentDashboard;