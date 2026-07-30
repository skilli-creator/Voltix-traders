// src/pages/PaymentAgentDashboard.jsx

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.1); }
  50% { box-shadow: 0 0 80px rgba(99, 102, 241, 0.2); }
`;

const modalSlide = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
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
  background: #06080f;
  display: flex;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.03), transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(236, 72, 153, 0.02), transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: 100vh;
  }
`;

// ============================================
// SIDEBAR - Desktop Only
// ============================================
const Sidebar = styled.div`
  width: 260px;
  min-width: 260px;
  background: rgba(10, 12, 22, 0.8);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,255,255,0.03);
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  position: sticky;
  top: 0;
  overflow-y: auto;
  z-index: 10;

  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 10px; }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 12px 28px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  margin-bottom: 28px;

  .logo-ring {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid rgba(99, 102, 241, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: ${pulse} 3s ease-in-out infinite;
  }

  .logo-ring::before {
    content: '';
    position: absolute;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: 1px solid rgba(99, 102, 241, 0.1);
    animation: ${orbit} 8s linear infinite;
  }

  .logo-inner {
    font-size: 16px;
    font-weight: 800;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .brand-name {
    font-size: 17px;
    font-weight: 700;
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .brand-tag {
    font-size: 10px;
    color: rgba(148, 163, 184, 0.5);
    font-weight: 400;
    margin-top: -2px;
  }
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
`;

const NavLabel = styled.div`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(148, 163, 184, 0.3);
  padding: 0 14px;
  margin-bottom: 8px;
  font-weight: 600;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${props => props.active ? '#f1f5f9' : 'rgba(148, 163, 184, 0.6)'};
  background: ${props => props.active ? 'rgba(99, 102, 241, 0.08)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(99, 102, 241, 0.15)' : 'transparent'};
  font-size: 13px;
  font-weight: 500;

  .icon {
    font-size: 16px;
    width: 22px;
    text-align: center;
    opacity: ${props => props.active ? 1 : 0.4};
  }

  &:hover {
    background: rgba(255,255,255,0.02);
    color: #f1f5f9;
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
  background: rgba(10, 12, 22, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.03);
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  box-sizing: border-box;

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

  .logo-ring {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(99, 102, 241, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-inner {
    font-size: 12px;
    font-weight: 800;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .brand-name {
    font-size: 15px;
    font-weight: 700;
    color: #f1f5f9;
  }
`;

// ============================================
// BOTTOM NAV - Mobile Only
// ============================================
const BottomNav = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 12, 22, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.03);
  padding: 8px 8px 12px;
  z-index: 100;
  justify-content: space-around;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const BottomItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? '#6366f1' : 'rgba(148, 163, 184, 0.5)'};
  font-size: 9px;
  font-weight: 500;
  flex: 1;
  text-align: center;
  min-width: 0;

  .icon { font-size: 18px; }
  .label { font-size: 7px; text-transform: uppercase; letter-spacing: 0.3px; }

  @media (max-width: 400px) {
    .icon { font-size: 16px; }
    .label { font-size: 6px; }
  }
`;

// ============================================
// CONTENT
// ============================================
const Content = styled.div`
  flex: 1;
  padding: 36px 44px;
  overflow-y: auto;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 28px 32px;
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    padding-bottom: 80px;
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    padding-bottom: 76px;
  }
`;

// ============================================
// PAGE HEADER
// ============================================
const PageHeader = styled.div`
  margin-bottom: 32px;
  animation: ${fadeIn} 0.6s ease;

  h1 {
    font-size: 26px;
    font-weight: 700;
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 14px;
    color: rgba(148, 163, 184, 0.6);
    font-weight: 400;
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
    h1 { font-size: 20px; }
    p { font-size: 12px; }
  }
`;

// ============================================
// BALANCE CARD
// ============================================
const BalanceCard = styled.div`
  padding: 32px 36px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(236, 72, 153, 0.05));
  border-radius: 20px;
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  border: 1px solid rgba(99, 102, 241, 0.08);
  animation: ${glow} 4s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .glow-ring {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.05), transparent 70%);
    pointer-events: none;
  }

  .left {
    position: relative;
    z-index: 1;
  }

  .label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(148, 163, 184, 0.6);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .amount {
    font-size: 38px;
    font-weight: 700;
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 4px;
    letter-spacing: -0.5px;
  }

  .sub {
    font-size: 13px;
    color: rgba(148, 163, 184, 0.4);
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
    padding: 20px 24px;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    .amount { font-size: 28px; }
    .actions { width: 100%; flex-direction: row; }
  }

  @media (max-width: 480px) {
    padding: 16px 18px;
    .amount { font-size: 24px; }
    .actions { flex-direction: column; }
    .actions button { width: 100%; }
  }
`;

const Btn = styled.button`
  padding: 10px 28px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.deposit {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    border: none;
  }

  &.withdraw {
    background: transparent;
    color: #f1f5f9;
    border: 1px solid rgba(255,255,255,0.06);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  &:hover::before {
    transform: translateX(100%);
  }

  &:hover {
    transform: translateY(-2px);
  }

  &.deposit:hover {
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
  }

  &.withdraw:hover {
    background: rgba(255,255,255,0.02);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 12px;
    flex: 1;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 12px;
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

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

const Stat = styled.div`
  padding: 18px 22px;
  background: rgba(255,255,255,0.01);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.03);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.1);
    transform: translateY(-4px);
  }

  .stat-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #ec4899);
    opacity: 0.3;
  }

  .label {
    font-size: 11px;
    font-weight: 500;
    color: rgba(148, 163, 184, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    margin-top: 6px;
  }

  .change {
    font-size: 11px;
    font-weight: 500;
    margin-top: 4px;
    color: ${props => props.positive ? '#34d399' : '#f87171'};
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    .value { font-size: 18px; }
    .label { font-size: 10px; }
    .change { font-size: 10px; }
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    .value { font-size: 16px; }
    .label { font-size: 9px; }
    .change { font-size: 9px; }
  }
`;

// ============================================
// ACTIONS GRID - Client focused
// ============================================
const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const ActionCard = styled.div`
  padding: 24px 20px;
  background: rgba(255,255,255,0.01);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.03);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.15);
    transform: translateY(-4px);
    background: rgba(99, 102, 241, 0.02);
  }

  .action-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .action-title {
    font-size: 14px;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 4px;
  }

  .action-desc {
    font-size: 11px;
    color: rgba(148, 163, 184, 0.4);
    font-weight: 400;
  }

  @media (max-width: 768px) {
    padding: 18px 16px;
    .action-icon { font-size: 28px; }
    .action-title { font-size: 13px; }
    .action-desc { font-size: 10px; }
  }

  @media (max-width: 480px) {
    padding: 16px 14px;
    .action-icon { font-size: 24px; }
    .action-title { font-size: 12px; }
    .action-desc { font-size: 10px; }
  }
`;

// ============================================
// MODAL
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 1000;
  display: ${props => props.open ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 480px;
  background: linear-gradient(145deg, rgba(16, 18, 30, 0.95), rgba(10, 12, 22, 0.98));
  border-radius: 24px;
  padding: 36px 40px;
  animation: ${modalSlide} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(99, 102, 241, 0.08);
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    border-radius: 24px 24px 0 0;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #ec4899, #6366f1);
    background-size: 200% 100%;
    animation: ${fadeIn} 2s ease-in-out infinite;
  }

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 10px; }

  @media (max-width: 768px) {
    padding: 28px 24px;
    max-height: 95vh;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    max-height: 95vh;
    border-radius: 18px;
  }
`;

const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.03);

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${props => props.type === 'deposit' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    border: 1px solid ${props => props.type === 'deposit' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)'};
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.3px;
  }

  .subtitle {
    font-size: 12px;
    color: rgba(148, 163, 184, 0.4);
    font-weight: 400;
    margin-top: 2px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.03);
    background: rgba(255,255,255,0.02);
    color: rgba(148, 163, 184, 0.4);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba(99, 102, 241, 0.2);
      color: #f1f5f9;
      background: rgba(99, 102, 241, 0.04);
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
    padding-bottom: 12px;
    .title-icon { width: 34px; height: 34px; font-size: 15px; }
    h3 { font-size: 17px; }
    .subtitle { font-size: 11px; }
    .close-btn { width: 30px; height: 30px; font-size: 14px; }
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 480px) {
    gap: 14px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(148, 163, 184, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    .required {
      color: #f87171;
      font-size: 12px;
    }

    .min-amount {
      font-size: 10px;
      color: rgba(148, 163, 184, 0.3);
      text-transform: none;
      letter-spacing: 0;
      font-weight: 400;
    }
  }

  input, select {
    padding: 12px 16px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 10px;
    color: #f1f5f9;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: all 0.2s ease;
    font-family: inherit;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      border-color: rgba(99, 102, 241, 0.3);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.04);
    }

    &::placeholder {
      color: rgba(148, 163, 184, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;
    cursor: pointer;

    option {
      background: #0c1020;
      color: #f1f5f9;
      padding: 8px;
    }

    &:hover {
      border-color: rgba(99, 102, 241, 0.15);
    }
  }

  .helper-text {
    font-size: 10px;
    color: rgba(148, 163, 184, 0.25);
    margin-top: 4px;
    font-weight: 400;
  }

  @media (max-width: 480px) {
    input, select { padding: 10px 14px; font-size: 13px; }
    label { font-size: 10px; }
    .helper-text { font-size: 9px; }
  }
`;

const AmountDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.02);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.04);
  transition: all 0.2s ease;

  &:focus-within {
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.04);
  }

  .currency {
    font-size: 18px;
    font-weight: 700;
    color: rgba(148, 163, 184, 0.3);
  }

  .input-field {
    flex: 1;
    background: transparent;
    border: none;
    color: #f1f5f9;
    font-size: 18px;
    font-weight: 600;
    outline: none;
    padding: 0;
    min-width: 0;
    width: 100%;

    &::placeholder {
      color: rgba(148, 163, 184, 0.15);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }

  .min-label {
    font-size: 10px;
    color: rgba(148, 163, 184, 0.25);
    font-weight: 400;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    .currency { font-size: 16px; }
    .input-field { font-size: 16px; }
    .min-label { font-size: 9px; }
  }
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;

  @media (max-width: 400px) {
    gap: 4px;
  }
`;

const Method = styled.div`
  padding: 12px 8px;
  border: 1px solid ${props => props.selected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.03)'};
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? 'rgba(99, 102, 241, 0.04)' : 'transparent'};
  position: relative;

  &:hover {
    border-color: rgba(99, 102, 241, 0.2);
  }

  .method-name {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.selected ? '#f1f5f9' : 'rgba(148, 163, 184, 0.5)'};
  }

  .method-sub {
    font-size: 9px;
    color: rgba(148, 163, 184, 0.3);
    margin-top: 2px;
  }

  .check-mark {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-size: 11px;
    display: ${props => props.selected ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 10px 4px;
    .method-name { font-size: 11px; }
    .method-sub { font-size: 8px; }
  }
`;

const Submit = styled.button`
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  &:hover:not(:disabled)::before {
    transform: translateX(100%);
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
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
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(10, 12, 22, 0.95);
  border: 1px solid ${props => props.type === 'success' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)'};
  backdrop-filter: blur(20px);
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon { font-size: 16px; flex-shrink: 0; }
  .content { flex: 1; }
  .title { font-size: 12px; font-weight: 600; color: #f1f5f9; }
  .msg { font-size: 11px; font-weight: 400; color: rgba(148, 163, 184, 0.6); }
  .close {
    background: none;
    border: none;
    color: rgba(148, 163, 184, 0.3);
    cursor: pointer;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    .title { font-size: 11px; }
    .msg { font-size: 10px; }
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
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(10, 12, 22, 0.95);
  border: 1px solid ${props => props.type === 'success' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)'};
  backdrop-filter: blur(20px);
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon { font-size: 16px; flex-shrink: 0; }
  .content { flex: 1; }
  .title { font-size: 12px; font-weight: 600; color: #f1f5f9; }
  .msg { font-size: 11px; font-weight: 400; color: rgba(148, 163, 184, 0.6); }
  .close {
    background: none;
    border: none;
    color: rgba(148, 163, 184, 0.3);
    cursor: pointer;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    .title { font-size: 11px; }
    .msg { font-size: 10px; }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentAgentDashboard = () => {
  const [page, setPage] = useState('home');
  const [modal, setModal] = useState(false);
  const [txType, setTxType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('safaricom');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [balance, setBalance] = useState(2847293.50);

  const stats = [
    { label: 'Total Deposits', value: '$2.8M', change: '+12.5%', positive: true },
    { label: 'Total Withdrawals', value: '$847K', change: '-3.2%', positive: false },
    { label: 'Pending', value: '12', change: '+2', positive: true },
    { label: 'Success Rate', value: '97.8%', change: '+1.2%', positive: true }
  ];

  const methods = [
    { id: 'safaricom', name: 'Safaricom', sub: 'M-Pesa' },
    { id: 'airtel', name: 'Airtel', sub: 'Airtel Money' },
    { id: 'bank', name: 'Bank Transfer', sub: 'Wire' }
  ];

  const nav = [
    { id: 'home', label: 'Dashboard', icon: '◇' },
    { id: 'deposits', label: 'Deposits', icon: '▽' },
    { id: 'withdrawals', label: 'Withdrawals', icon: '△' },
    { id: 'support', label: 'Support', icon: '?' },
    { id: 'account', label: 'Account', icon: '⚙' },
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
        addToast('Invalid Phone Number', 'Please enter a valid phone number (e.g., 0712345678)', 'error');
        return;
      }
      const phoneRegex = /^0[17]\d{8}$/;
      if (!phoneRegex.test(phoneNumber)) {
        addToast('Invalid Phone Number', 'Please enter a valid Kenyan phone number starting with 0', 'error');
        return;
      }
    }

    if (method === 'bank') {
      if (!selectedBank) {
        addToast('Select Bank', 'Please select your bank from the list', 'error');
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
          addToast('Insufficient Balance', 'You do not have enough funds to withdraw', 'error');
          setProcessing(false);
          return;
        }
        setBalance(prev => prev - amountNum);
        addToast('Withdrawal Initiated', `$${displayAmount} requested via ${methodName}`, 'success');
      }

      setProcessing(false);
      setModal(false);
      setAmount('');
      setPhoneNumber('');
      setSelectedBank('');
      setAccountNumber('');
    }, 1200);
  };

  const renderPage = () => {
    switch(page) {
      case 'home':
        return (
          <>
            <PageHeader>
              <h1>Dashboard</h1>
              <p>Manage your funds and transactions</p>
            </PageHeader>

            <BalanceCard>
              <div className="glow-ring" />
              <div className="left">
                <div className="label">Available Balance</div>
                <div className="amount">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="sub">USD · Live</div>
              </div>
              <div className="actions">
                <Btn className="deposit" onClick={() => { setTxType('deposit'); setModal(true); }}>Deposit</Btn>
                <Btn className="withdraw" onClick={() => { setTxType('withdraw'); setModal(true); }}>Withdraw</Btn>
              </div>
            </BalanceCard>

            <Stats>
              {stats.map((s, i) => (
                <Stat key={i} positive={s.positive}>
                  <div className="stat-line" />
                  <div className="label">{s.label}</div>
                  <div className="value">{s.value}</div>
                  <div className="change">{s.positive ? '↑' : '↓'} {s.change}</div>
                </Stat>
              ))}
            </Stats>

            <ActionsGrid>
              <ActionCard onClick={() => { setTxType('deposit'); setModal(true); }}>
                <div className="action-icon">💰</div>
                <div className="action-title">Deposit</div>
                <div className="action-desc">Add funds to your account</div>
              </ActionCard>
              <ActionCard onClick={() => { setTxType('withdraw'); setModal(true); }}>
                <div className="action-icon">💳</div>
                <div className="action-title">Withdraw</div>
                <div className="action-desc">Request a withdrawal</div>
              </ActionCard>
              <ActionCard>
                <div className="action-icon">📊</div>
                <div className="action-title">Transaction History</div>
                <div className="action-desc">View your transactions</div>
              </ActionCard>
            </ActionsGrid>
          </>
        );

      case 'deposits':
        return (
          <>
            <PageHeader>
              <h1>Deposits</h1>
              <p>Add funds to your account</p>
            </PageHeader>
            <BalanceCard style={{ marginBottom: '0' }}>
              <div className="glow-ring" />
              <div className="left">
                <div className="label">Deposit Funds</div>
                <div className="amount" style={{ fontSize: '24px' }}>Enter deposit details</div>
                <div className="sub">Funds will be credited instantly</div>
              </div>
              <div className="actions">
                <Btn className="deposit" onClick={() => { setTxType('deposit'); setModal(true); }}>
                  New Deposit
                </Btn>
              </div>
            </BalanceCard>
          </>
        );

      case 'withdrawals':
        return (
          <>
            <PageHeader>
              <h1>Withdrawals</h1>
              <p>Request a withdrawal</p>
            </PageHeader>
            <BalanceCard style={{ marginBottom: '0' }}>
              <div className="glow-ring" />
              <div className="left">
                <div className="label">Withdraw Funds</div>
                <div className="amount" style={{ fontSize: '24px' }}>Enter withdrawal details</div>
                <div className="sub">Funds will be sent to your account</div>
              </div>
              <div className="actions">
                <Btn className="withdraw" onClick={() => { setTxType('withdraw'); setModal(true); }}>
                  New Withdrawal
                </Btn>
              </div>
            </BalanceCard>
          </>
        );

      case 'support':
        return (
          <>
            <PageHeader>
              <h1>Support</h1>
              <p>We're here to help</p>
            </PageHeader>
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.03)',
              padding: '24px 28px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                Frequently Asked Questions
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.6)', lineHeight: '1.8' }}>
                <strong>How do I deposit?</strong><br />
                Click the Deposit button, select your payment method, and enter the details.<br /><br />
                <strong>How long do withdrawals take?</strong><br />
                Withdrawals are processed instantly for M-Pesa and Airtel, 24-48 hours for bank transfers.<br /><br />
                <strong>What payment methods are supported?</strong><br />
                Safaricom M-Pesa, Airtel Money, and Bank Transfers.
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.03)',
              padding: '24px 28px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                Contact Support
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                <span style={{ color: 'rgba(148, 163, 184, 0.4)' }}>Email</span>
                <span style={{ color: '#f1f5f9', fontWeight: '500' }}>support@voltixtraders.com</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                <span style={{ color: 'rgba(148, 163, 184, 0.4)' }}>Phone</span>
                <span style={{ color: '#f1f5f9', fontWeight: '500' }}>+254 700 123 456</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                <span style={{ color: 'rgba(148, 163, 184, 0.4)' }}>Live Chat</span>
                <span style={{ color: '#f1f5f9', fontWeight: '500' }}>Available 24/7</span>
              </div>
            </div>
          </>
        );

      case 'account':
        return (
          <>
            <PageHeader>
              <h1>Account</h1>
              <p>Manage your account details</p>
            </PageHeader>
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.03)',
              padding: '24px 28px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.4)' }}>Name</span>
                <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '500' }}>John Trader</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.4)' }}>Email</span>
                <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '500' }}>john@voltixtraders.com</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.4)' }}>Phone</span>
                <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '500' }}>+254 712 345 678</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.4)' }}>Account Type</span>
                <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '500' }}>Premium</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.4)' }}>Joined</span>
                <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '500' }}>January 2026</span>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.03)',
              padding: '24px 28px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.4)' }}>Safaricom</span>
                <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '500' }}>0712 345 678</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.4)' }}>Airtel</span>
                <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '500' }}>0733 456 789</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.4)' }}>Bank Account</span>
                <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '500' }}>****5678</span>
              </div>
            </div>
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
        <Sidebar>
          <Brand>
            <div className="logo-ring">
              <div className="logo-inner">VT</div>
            </div>
            <div>
              <div className="brand-name">Voltix</div>
              <div className="brand-tag">Payment Agent</div>
            </div>
          </Brand>

          {nav.slice(0, 3).map(item => (
            <NavItem key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavItem>
          ))}

          <Spacer />

          <NavSection>
            <NavLabel>Support</NavLabel>
            {nav.slice(3).map(item => (
              <NavItem key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </NavItem>
            ))}
          </NavSection>
        </Sidebar>

        <MobileHeader>
          <div className="brand">
            <div className="logo-ring">
              <div className="logo-inner">VT</div>
            </div>
            <span className="brand-name">Voltix</span>
          </div>
        </MobileHeader>

        <Content>
          {renderPage()}
        </Content>
      </AppContainer>

      <BottomNav>
        {nav.map(item => (
          <BottomItem key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </BottomItem>
        ))}
      </BottomNav>

      {/* MODAL */}
      <ModalOverlay open={modal} onClick={() => !processing && setModal(false)}>
        <ModalBox onClick={e => e.stopPropagation()}>
          <ModalHead type={txType}>
            <div className="title-group">
              <div className="title-icon">
                {txType === 'deposit' ? '↓' : '↑'}
              </div>
              <div>
                <h3>{txType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</h3>
                <div className="subtitle">
                  {txType === 'deposit' ? 'Add funds to your account' : 'Request a withdrawal'}
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={() => !processing && setModal(false)}>✕</button>
          </ModalHead>

          <ModalBody>
            <Field>
              <label>
                Amount (USD)
                <span className="min-amount">Min: $1.00</span>
              </label>
              <AmountDisplay>
                <span className="currency">$</span>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  disabled={processing}
                />
                <span className="min-label">min $1</span>
              </AmountDisplay>
            </Field>

            <Field>
              <label>Payment Method <span className="required">*</span></label>
              <MethodGrid>
                {methods.map(m => (
                  <Method key={m.id} selected={method === m.id} onClick={() => setMethod(m.id)}>
                    <div className="method-name">{m.name}</div>
                    <div className="method-sub">{m.sub}</div>
                    <div className="check-mark">✓</div>
                  </Method>
                ))}
              </MethodGrid>
            </Field>

            {(method === 'safaricom' || method === 'airtel') && (
              <Field>
                <label>
                  {method === 'safaricom' ? 'Safaricom' : 'Airtel'} Phone Number
                  <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength="10"
                  disabled={processing}
                />
                <div className="helper-text">Enter 10-digit number starting with 0 (e.g., 0712345678)</div>
              </Field>
            )}

            {method === 'bank' && (
              <>
                <Field>
                  <label>Select Bank <span className="required">*</span></label>
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
                </Field>

                <Field>
                  <label>Bank Account Number <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter your bank account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={processing}
                  />
                  <div className="helper-text">Enter your account number (digits only)</div>
                </Field>
              </>
            )}

            <Submit onClick={validateAndSubmit} disabled={processing}>
              {processing ? 'Processing...' : txType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </Submit>
          </ModalBody>
        </ModalBox>
      </ModalOverlay>
    </>
  );
};

export default PaymentAgentDashboard;