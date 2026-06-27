import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// ============================================
// GLOBAL STYLES
// ============================================
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #050a18;
    color: #f1f5f9;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #0a0f1f;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #22c55e, #38bdf8);
    border-radius: 4px;
  }
`;

// ============================================
// KEYFRAMES
// ============================================
const floatIn = keyframes`
  0% { opacity: 0; transform: translateY(30px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -300% center; }
  100% { background-position: 300% center; }
`;

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
`;

const slideGlow = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(200%) skewX(-20deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.1); }
  50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.2); }
`;

const countUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// ============================================
// PREMIUM NOTIFICATION ANIMATIONS
// ============================================
const slideIn = keyframes`
  0% { transform: translateX(100%) scale(0.9); opacity: 0; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
`;

const slideOut = keyframes`
  0% { transform: translateX(0) scale(1); opacity: 1; }
  100% { transform: translateX(100%) scale(0.9); opacity: 0; }
`;

const shimmerLine = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

// ============================================
// BACKGROUND
// ============================================
const BackgroundContainer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const GradientOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: ${breathe} 8s ease-in-out infinite;

  &:nth-child(1) {
    width: 500px;
    height: 500px;
    top: -200px;
    right: -150px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.06), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: -100px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.05), transparent 70%);
    animation-delay: -2.5s;
  }

  &:nth-child(3) {
    width: 300px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(129, 140, 248, 0.03), transparent 70%);
    animation-delay: -5s;
  }

  @media (max-width: 768px) {
    &:nth-child(1) { width: 250px; height: 250px; top: -100px; right: -80px; }
    &:nth-child(2) { width: 200px; height: 200px; bottom: -80px; left: -60px; }
    &:nth-child(3) { width: 150px; height: 150px; }
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.015) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
`;

const GlowLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, transparent);
  opacity: 0.1;
`;

// ============================================
// PREMIUM NOTIFICATION COMPONENT
// ============================================
const NotificationContainer = styled.div`
  position: fixed;
  top: 90px;
  right: 24px;
  z-index: 1000;
  max-width: 420px;
  width: 100%;
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};

  @media (max-width: 768px) {
    top: 80px;
    right: 16px;
    left: 16px;
    max-width: none;
    width: auto;
  }
`;

const NotificationCard = styled.div`
  background: linear-gradient(135deg, rgba(5, 10, 24, 0.95), rgba(10, 20, 40, 0.95));
  backdrop-filter: blur(24px);
  border-radius: 20px;
  padding: 20px 24px 20px 24px;
  border: 1px solid rgba(34, 197, 94, 0.15);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(34, 197, 94, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, transparent);
    animation: ${shimmerLine} 2s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.03), transparent 70%);
    pointer-events: none;
  }

  .glow-ring {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.05), transparent 70%);
    animation: ${pulseGlow} 3s ease-in-out infinite;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;

  .icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(56, 189, 248, 0.15));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    border: 1px solid rgba(34, 197, 94, 0.1);
    flex-shrink: 0;
  }

  .title {
    font-size: 14px;
    font-weight: 700;
    background: linear-gradient(135deg, #22c55e, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: 0.3px;
  }

  .close-btn {
    margin-left: auto;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      transform: rotate(90deg);
    }
  }
`;

const NotificationBody = styled.div`
  position: relative;
  z-index: 1;

  .greeting-text {
    font-size: 20px;
    font-weight: 700;
    color: #f1f5f9;
    line-height: 1.3;

    .highlight {
      background: linear-gradient(135deg, #22c55e, #38bdf8);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  .sub-text {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 8px;

    .status-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseGlow} 2s ease-in-out infinite;
    }

    .time-stamp {
      color: #4b5563;
      font-size: 11px;
    }
  }
`;

// ============================================
// TOPBAR
// ============================================
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 32px;
  background: rgba(5, 10, 24, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: ${floatIn} 0.6s ease;

  @media (max-width: 768px) {
    padding: 12px 16px;
    flex-direction: column;
    gap: 10px;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: 800;
  text-decoration: none;

  .logo-icon {
    font-size: 1.6rem;
  }

  .logo-text {
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    .logo-icon { font-size: 1.3rem; }
    .live-dot { width: 6px; height: 6px; }
  }
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
`;

const Greeting = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;

  .highlight {
    color: #f1f5f9;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const ProfileAvatar = styled(Link)`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  background: linear-gradient(135deg, #1a2332, #0a0f1f);
  border: 2px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.05);
  text-decoration: none;

  &:hover {
    border-color: #22c55e;
    transform: scale(1.08) rotate(-3deg);
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.15);
  }

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid rgba(34, 197, 94, 0.1);
    animation: ${pulseRing} 2s ease-out infinite;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

const SettingsIcon = styled(Link)`
  color: #94a3b8;
  font-size: 20px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  position: relative;

  &:hover {
    color: #22c55e;
    transform: rotate(90deg);
    background: rgba(34, 197, 94, 0.05);
    border-color: rgba(34, 197, 94, 0.1);
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.05);
  }

  .tooltip {
    position: absolute;
    bottom: -32px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #94a3b8;
    background: rgba(5, 10, 24, 0.9);
    padding: 2px 10px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.03);
  }

  &:hover .tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 17px;
  }
`;

const LogoutButton = styled.button`
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #ef4444;
  padding: 6px 14px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #ef4444;
    color: #0a0f1f;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 4px 10px;
  }
`;

// ============================================
// MAIN CONTENT
// ============================================
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 24px 60px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 20px 16px 40px;
  }
`;

// ---- Welcome Banner ----
const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.04), rgba(56, 189, 248, 0.04));
  border-radius: 24px;
  padding: 24px 32px;
  margin-bottom: 28px;
  border: 1px solid rgba(56, 189, 248, 0.04);
  animation: ${floatIn} 0.7s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, transparent);
    opacity: 0.3;
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 4px;

    .highlight {
      background: linear-gradient(135deg, #22c55e, #38bdf8);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  p {
    color: #94a3b8;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    padding: 18px 20px;
    h3 { font-size: 1.1rem; }
    p { font-size: 0.8rem; }
  }
`;

// ---- Slogan ----
const Slogan = styled.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 8px;
  transition: opacity 0.3s ease;
  padding: 0 16px;

  .quote-mark {
    color: #22c55e;
    font-size: 1.6rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    .quote-mark { font-size: 1.2rem; }
  }
`;

const MarketIntro = styled.div`
  text-align: center;
  margin: 16px 0 32px;
  font-size: 0.75rem;
  color: #4b5563;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;

  .accent {
    color: #38bdf8;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
    margin: 12px 0 20px;
  }
`;

// ---- Market Grid ----
const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MarketCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 32px 24px 28px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.03);
  position: relative;
  overflow: hidden;
  animation: ${floatIn} 0.8s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.color || 'linear-gradient(90deg, #22c55e, #38bdf8)'};
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(56, 189, 248, 0.02),
      transparent,
      rgba(129, 140, 248, 0.02),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 20s linear infinite;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: rgba(56, 189, 248, 0.06);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover::after {
    opacity: 1;
  }

  &:active {
    transform: scale(0.97);
  }

  .card-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.02), transparent);
    transition: left 0.6s ease;
    pointer-events: none;
  }

  &:hover .card-shimmer {
    left: 100%;
  }

  .market-icon {
    font-size: 44px;
    margin-bottom: 14px;
    display: block;
  }

  .market-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 6px;
  }

  .market-desc {
    font-size: 0.8rem;
    color: #94a3b8;
    line-height: 1.6;
  }

  .market-badge {
    display: inline-block;
    margin-top: 12px;
    font-size: 0.6rem;
    padding: 3px 12px;
    border-radius: 20px;
    background: rgba(34, 197, 94, 0.06);
    border: 1px solid rgba(34, 197, 94, 0.06);
    color: #4ade80;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .market-status {
    position: absolute;
    top: 14px;
    right: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.6rem;
    color: #4ade80;
    text-transform: uppercase;
    letter-spacing: 0.3px;

    .status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseGlow} 2s ease-in-out infinite;
    }
  }

  @media (max-width: 768px) {
    padding: 24px 18px 20px;
    .market-icon { font-size: 36px; }
    .market-title { font-size: 1.2rem; }
    .market-desc { font-size: 0.75rem; }
    .market-status { font-size: 0.5rem; top: 10px; right: 10px; }
  }
`;

// ---- Stats Ticker ----
const StatsTicker = styled.div`
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 16px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  animation: ${floatIn} 1s ease;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    padding: 12px 16px;
    gap: 12px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 10px 12px;
  }
`;

const StatBlock = styled.div`
  text-align: center;
  padding: 4px 0;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 20%;
    height: 60%;
    width: 1px;
    background: rgba(255, 255, 255, 0.03);
  }

  &:last-child::after {
    display: none;
  }

  @media (max-width: 768px) {
    &:nth-child(2)::after {
      display: none;
    }
  }

  @media (max-width: 480px) {
    padding: 2px 0;
  }
`;

const StatLabel = styled.div`
  font-size: 0.65rem;
  color: #4b5563;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.55rem;
  }
`;

const StatNumber = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f1f5f9, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${countUp} 0.6s ease;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

// ============================================
// FOOTER
// ============================================
const PremiumFooter = styled.footer`
  margin-top: 50px;
  background: rgba(3, 7, 18, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  padding: 40px 32px 24px;

  @media (max-width: 768px) {
    padding: 28px 16px 18px;
    margin-top: 30px;
  }
`;

const FooterGrid = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }
`;

const FooterCol = styled.div`
  h4 {
    color: #f1f5f9;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 14px;
    letter-spacing: 0.3px;
  }

  p, a {
    font-size: 0.75rem;
    color: #94a3b8;
    line-height: 1.8;
    text-decoration: none;
    display: block;
    transition: all 0.3s ease;
  }

  a:hover {
    color: #22c55e;
    transform: translateX(4px);
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .footer-logo-text {
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .footer-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #22c55e;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite;
    }
  }

  @media (max-width: 480px) {
    h4 { font-size: 0.75rem; }
    p, a { font-size: 0.7rem; }
    .footer-logo { justify-content: center; }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 480px) {
    justify-content: center;
  }

  span {
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #94a3b8;

    &:hover {
      color: #22c55e;
      transform: translateY(-3px);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  font-size: 0.65rem;
  color: #4b5563;

  span {
    color: #22c55e;
  }

  @media (max-width: 768px) {
    font-size: 0.55rem;
    margin-top: 20px;
    padding-top: 12px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('Trader');
  const [quote, setQuote] = useState('"Trade Smart. Stay Disciplined. Let the Market Reward Your Patience."');
  const [volume, setVolume] = useState(187.4);
  const [signals, setSignals] = useState(142);
  const [users, setUsers] = useState(2847);
  const [timestamp, setTimestamp] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState('');
  const quoteIndexRef = useRef(0);
  const notificationTimeoutRef = useRef(null);

  const quotes = [
    '"Trade Smart. Stay Disciplined. Let the Market Reward Your Patience."',
    '"The trend is your friend until the end."',
    '"Risk management is the cornerstone of survival."',
    '"Let your profits run, cut your losses short."',
    '"Emotions are the enemy of good trading."'
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
      navigate('/login');
      return;
    }

    setUser(userData);
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Trader';
    setGreeting(fullName);

    // Show welcome notification with a small delay for smooth animation
    setTimeout(() => {
      setShowNotification(true);
      const now = new Date();
      setNotificationTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    }, 800);

    // Auto-dismiss notification after 6 seconds
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, 6000);

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [navigate]);

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setVolume(prev => Math.max(165, Math.min(220, prev + (Math.random() - 0.5) * 2.4)));
      setSignals(prev => Math.max(120, Math.min(320, prev + Math.floor(Math.random() * 5) - 1)));
      setUsers(prev => Math.max(2500, Math.min(3600, prev + Math.floor(Math.random() * 7) - 2)));
    }, 5500);
    return () => clearInterval(statsInterval);
  }, []);

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      setTimestamp(`🕒 ${now.toUTCString().slice(5, 25)} UTC`);
    };
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      quoteIndexRef.current = (quoteIndexRef.current + 1) % quotes.length;
      const quoteElement = document.getElementById('animatedQuote');
      if (quoteElement) {
        quoteElement.style.opacity = '0';
        setTimeout(() => {
          setQuote(quotes[quoteIndexRef.current]);
          quoteElement.style.opacity = '1';
        }, 200);
      }
    }, 7000);
    return () => clearInterval(quoteInterval);
  }, [quotes]);

  const openMarket = (market, e) => {
    const card = e.currentTarget;
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%);
      top: 0;
      left: 0;
      border-radius: 24px;
      pointer-events: none;
      animation: fadeOut 0.5s ease-out forwards;
    `;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);

    setTimeout(() => {
      const routes = {
        deriv: '/derivhome',
        forex: '/derivdash'
      };
      navigate(routes[market]);
    }, 150);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'T';
  };

  return (
    <>
      <GlobalStyle />

      <BackgroundContainer>
        <GradientOrb />
        <GradientOrb />
        <GradientOrb />
        <GridOverlay />
        <GlowLine />
      </BackgroundContainer>

      {/* PREMIUM NOTIFICATION */}
      <NotificationContainer isVisible={showNotification}>
        <NotificationCard>
          <div className="glow-ring" />
          <NotificationHeader>
            <div className="icon-wrapper">🎉</div>
            <span className="title">Welcome Back</span>
            <button className="close-btn" onClick={handleCloseNotification}>✕</button>
          </NotificationHeader>
          <NotificationBody>
            <div className="greeting-text">
              Hello, <span className="highlight">{greeting}</span> 👋
            </div>
            <div className="sub-text">
              <span className="status-dot" />
              You're now connected to Voltix Traders
              <span className="time-stamp">• {notificationTime}</span>
            </div>
          </NotificationBody>
        </NotificationCard>
      </NotificationContainer>

      <Topbar>
        <Brand to="/dashboard">
          <span className="logo-icon">🔷</span>
          <span className="logo-text">Voltix Traders</span>
          <span className="live-dot" />
        </Brand>
        <ProfileArea>
          <Greeting>
            👋 <span className="highlight">{greeting}</span>
          </Greeting>
          <ProfileAvatar to="/settings" title="Account Settings">
            {getInitials()}
          </ProfileAvatar>
          <SettingsIcon to="/settings" title="Account Settings">
            ⚙️
            <span className="tooltip">Settings</span>
          </SettingsIcon>
          <LogoutButton onClick={handleLogout}>🚪 Logout</LogoutButton>
        </ProfileArea>
      </Topbar>

      <Container>
        <WelcomeBanner>
          <h3>
            Welcome back, <span className="highlight">{greeting}</span>! 👋
          </h3>
          <p>Your AI-powered trading terminal is ready. Select a market to begin.</p>
        </WelcomeBanner>

        <Slogan id="animatedQuote">
          <span className="quote-mark">“</span>
          {quote.replace(/"/g, '')}
          <span className="quote-mark">”</span>
        </Slogan>

        <MarketIntro>
          <span className="accent">⟡</span> SELECT YOUR TRADING ARENA <span className="accent">⟡</span>
        </MarketIntro>

        <MarketGrid>
          <MarketCard color="linear-gradient(90deg, #a855f7, #7c3aed)" onClick={(e) => openMarket('deriv', e)}>
            <div className="card-shimmer" />
            <span className="market-status">
              <span className="status-dot" />
              Live
            </span>
            <span className="market-icon">📊</span>
            <div className="market-title">Deriv</div>
            <div className="market-desc">Synthetic indices • Options • High-frequency</div>
            <span className="market-badge">24/7 Trading</span>
          </MarketCard>

          <MarketCard color="linear-gradient(90deg, #2563eb, #1d4ed8)" onClick={(e) => openMarket('forex', e)}>
            <div className="card-shimmer" />
            <span className="market-status">
              <span className="status-dot" />
              Live
            </span>
            <span className="market-icon">💱</span>
            <div className="market-title">Forex</div>
            <div className="market-desc">Major, minor & exotic currency pairs</div>
            <span className="market-badge">24/5 Trading</span>
          </MarketCard>
        </MarketGrid>

        <StatsTicker>
          <StatBlock>
            <StatLabel>🌍 24h Volume</StatLabel>
            <StatNumber>${volume.toFixed(1)}B</StatNumber>
          </StatBlock>
          <StatBlock>
            <StatLabel>📊 Active Markets</StatLabel>
            <StatNumber>2</StatNumber>
          </StatBlock>
          <StatBlock>
            <StatLabel>🔵 AI Signals Today</StatLabel>
            <StatNumber>{signals}</StatNumber>
          </StatBlock>
          <StatBlock>
            <StatLabel>👥 Connected Users</StatLabel>
            <StatNumber>{users.toLocaleString()}</StatNumber>
          </StatBlock>
        </StatsTicker>
      </Container>

      <PremiumFooter>
        <FooterGrid>
          <FooterCol>
            <div className="footer-logo">
              <span>🔷</span>
              <span className="footer-logo-text">Voltix Traders</span>
              <span className="footer-dot" />
            </div>
            <p>Next-gen multi-market execution engine</p>
            <p>Smart order routing • AI predictive models • Risk management</p>
            <SocialIcons>
              <span>🐦</span>
              <span>📘</span>
              <span>💼</span>
              <span>📸</span>
            </SocialIcons>
          </FooterCol>
          <FooterCol>
            <h4>📊 Market Hours</h4>
            <p>Forex: 24/5 (Sun 22:00 - Fri 22:00 GMT)</p>
            <p>Deriv: 24/7 synthetic indices</p>
          </FooterCol>
          <FooterCol>
            <h4>📚 Resources</h4>
            <a href="#">API Documentation</a>
            <a href="#">Trading guides</a>
            <a href="#">Risk disclosure</a>
            <a href="#">Support center</a>
          </FooterCol>
          <FooterCol>
            <h4>⚖️ Legal</h4>
            <p>CFDs and forex trading involve high risk.</p>
            <p>74-89% of retail traders lose money.</p>
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
          </FooterCol>
        </FooterGrid>
        <FooterBottom>
          <span>{timestamp}</span> • Trade responsibly • AI insights for educational purposes only
        </FooterBottom>
      </PremiumFooter>

      <style>
        {`
          @keyframes fadeOut {
            0% { opacity: 0.8; transform: scale(0.9); }
            100% { opacity: 0; transform: scale(1.2); }
          }
        `}
      </style>
    </>
  );
};

export default Dashboard;