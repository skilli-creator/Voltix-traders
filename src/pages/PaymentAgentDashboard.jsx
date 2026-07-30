// src/pages/PaymentAgentDashboard.jsx

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.1); }
  50% { box-shadow: 0 0 80px rgba(99, 102, 241, 0.2); }
`;

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
`;

// ============================================
// SIDEBAR - Futuristic
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
  position: relative;

  .icon {
    font-size: 16px;
    width: 22px;
    text-align: center;
    opacity: ${props => props.active ? 1 : 0.4};
  }

  .badge {
    margin-left: auto;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 10px;
    border-radius: 20px;
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
  background: rgba(10, 12, 22, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.03);

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
// BOTTOM NAV - Futuristic
// ============================================
const BottomNav = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 12, 22, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.03);
  padding: 8px 12px 14px;
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
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? '#6366f1' : 'rgba(148, 163, 184, 0.5)'};
  font-size: 9px;
  font-weight: 500;
  flex: 1;
  text-align: center;
  position: relative;

  .icon { font-size: 18px; }
  .label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; }

  .badge {
    position: absolute;
    top: 0;
    right: 50%;
    transform: translateX(50%);
    background: linear-gradient(135deg, #6366f1, #ec4899);
    color: #fff;
    font-size: 7px;
    font-weight: 700;
    padding: 1px 8px;
    border-radius: 10px;
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

  @media (max-width: 1024px) {
    padding: 28px 32px;
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
    margin-bottom: 24px;
    h1 { font-size: 22px; }
  }
`;

// ============================================
// BALANCE CARD - Neon Glow
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
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    .amount { font-size: 28px; }
    .actions { width: 100%; }
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
  border-radius: 20px;
  border: 1px solid ${props => props.active ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.03)'};
  background: ${props => props.active ? 'rgba(99, 102, 241, 0.06)' : 'transparent'};
  color: ${props => props.active ? '#6366f1' : 'rgba(148, 163, 184, 0.5)'};
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.2);
    color: ${props => props.active ? '#6366f1' : '#f1f5f9'};
  }
`;

// ============================================
// TABLE
// ============================================
const TableWrap = styled.div`
  background: rgba(255,255,255,0.01);
  border-radius: 14px;
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
    color: #f1f5f9;

    .count {
      font-size: 11px;
      font-weight: 500;
      color: rgba(148, 163, 184, 0.4);
      background: rgba(255,255,255,0.02);
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
    letter-spacing: 0.8px;
    color: rgba(148, 163, 184, 0.3);
    border-bottom: 1px solid rgba(255,255,255,0.03);
    font-weight: 600;
  }

  tbody td {
    padding: 8px 12px;
    font-size: 12px;
    color: rgba(148, 163, 184, 0.7);
    border-bottom: 1px solid rgba(255,255,255,0.02);
    font-weight: 400;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,0.01); }

  .id { color: #f1f5f9; font-weight: 500; }
  .pos { color: #34d399; }
  .neg { color: #f87171; }

  .status {
    display: inline-block;
    padding: 2px 14px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-completed {
    color: #34d399;
    background: rgba(52, 211, 153, 0.04);
  }

  .status-pending {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.04);
  }

  .status-failed {
    color: #f87171;
    background: rgba(248, 113, 113, 0.04);
  }

  .method {
    display: inline-block;
    padding: 2px 12px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 500;
    background: rgba(255,255,255,0.02);
  }

  .date {
    color: rgba(148, 163, 184, 0.3);
    font-size: 11px;
  }
`;

// ============================================
// CARDS
// ============================================
const Card = styled.div`
  background: rgba(255,255,255,0.01);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.03);
  padding: 24px 28px;
  margin-bottom: 16px;

  .title {
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 8px;
  }

  .desc {
    font-size: 13px;
    color: rgba(148, 163, 184, 0.6);
    line-height: 1.8;
  }

  .row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.02);
    &:last-child { border-bottom: none; }
    .lbl { font-size: 13px; color: rgba(148, 163, 184, 0.4); }
    .val { font-size: 13px; color: #f1f5f9; font-weight: 500; }
  }

  .contact-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 13px;
    .lbl { color: rgba(148, 163, 184, 0.4); }
    .val { color: #f1f5f9; font-weight: 500; }
  }
`;

// ============================================
// MODAL - Futuristic
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(20px);
  z-index: 1000;
  display: ${props => props.open ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(10, 12, 22, 0.95);
  border-radius: 20px;
  padding: 32px 36px;
  animation: ${fadeIn} 0.3s ease;
  border: 1px solid rgba(99, 102, 241, 0.08);

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
    color: #f1f5f9;
  }

  button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.03);
    background: transparent;
    color: rgba(148, 163, 184, 0.4);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: rgba(99, 102, 241, 0.2);
      color: #f1f5f9;
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
    color: rgba(148, 163, 184, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    padding: 10px 14px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.03);
    border-radius: 8px;
    color: #f1f5f9;
    font-size: 14px;
    font-weight: 500;
    outline: none;

    &:focus {
      border-color: rgba(99, 102, 241, 0.3);
    }

    &::placeholder {
      color: rgba(148, 163, 184, 0.2);
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
  border: 1px solid ${props => props.selected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.03)'};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? 'rgba(99, 102, 241, 0.04)' : 'transparent'};

  &:hover {
    border-color: rgba(99, 102, 241, 0.2);
  }

  .name {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.selected ? '#f1f5f9' : 'rgba(148, 163, 184, 0.5)'};
  }

  .sub {
    font-size: 9px;
    color: rgba(148, 163, 184, 0.3);
    margin-top: 2px;
  }
`;

const Submit = styled.button`
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 4px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
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
    { id: 'bank', name: 'Bank', sub: 'Wire' }
  ];

  const nav = [
    { id: 'home', label: 'Dashboard', icon: '◇' },
    { id: 'transactions', label: 'Transactions', icon: '◈' },
    { id: 'deposits', label: 'Deposits', icon: '▽' },
    { id: 'withdrawals', label: 'Withdrawals', icon: '△' },
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
          <Brand>
            <div className="logo-ring">
              <div className="logo-inner">VT</div>
            </div>
            <div>
              <div className="brand-name">Voltix</div>
              <div className="brand-tag">Payment Agent</div>
            </div>
          </Brand>

          {nav.slice(0, 4).map(item => (
            <NavItem key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.id === 'transactions' && <span className="badge">12</span>}
            </NavItem>
          ))}

          <Spacer />

          <NavSection>
            <NavLabel>Support</NavLabel>
            {nav.slice(4).map(item => (
              <NavItem key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </NavItem>
            ))}
          </NavSection>
        </Sidebar>

        {/* Mobile Header */}
        <MobileHeader>
          <div className="brand">
            <div className="logo-ring">
              <div className="logo-inner">VT</div>
            </div>
            <span className="brand-name">Voltix</span>
          </div>
        </MobileHeader>

        {/* Content */}
        <Content>
          {renderPage()}
        </Content>
      </AppContainer>

      {/* Bottom Nav */}
      <BottomNav>
        {nav.map(item => (
          <BottomItem key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
            {item.id === 'transactions' && <span className="badge">12</span>}
          </BottomItem>
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