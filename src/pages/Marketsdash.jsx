import React, { useState, useEffect } from 'react';
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
// ULTRA PREMIUM KEYFRAMES
// ============================================
const floatIn = keyframes`
  0% { opacity: 0; transform: translateY(30px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.1); }
  50% { box-shadow: 0 0 60px rgba(34, 197, 94, 0.3); }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmerWave = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const cosmicFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(0.5deg); }
  75% { transform: translateY(8px) rotate(-0.5deg); }
`;

const modalSlideUp = keyframes`
  0% { opacity: 0; transform: translateY(60px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.5); }
`;

const shimmerBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const particleFloat = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 0; }
  50% { transform: translate(20px, -30px) scale(1.5); opacity: 0.8; }
  100% { transform: translate(-10px, -60px) scale(0.5); opacity: 0; }
`;

const rippleExpand = keyframes`
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const textReveal = keyframes`
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
`;

const magneticPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// ============================================
// BACKGROUND - Enhanced
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
  filter: blur(120px);
  animation: ${breathe} 10s ease-in-out infinite;

  &:nth-child(1) {
    width: 600px;
    height: 600px;
    top: -250px;
    right: -200px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.08), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 500px;
    height: 500px;
    bottom: -200px;
    left: -150px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.06), transparent 70%);
    animation-delay: -3s;
  }

  &:nth-child(3) {
    width: 400px;
    height: 400px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(129, 140, 248, 0.04), transparent 70%);
    animation-delay: -6s;
  }

  &:nth-child(4) {
    width: 300px;
    height: 300px;
    top: 20%;
    left: 20%;
    background: radial-gradient(circle, rgba(236, 72, 153, 0.03), transparent 70%);
    animation-delay: -2s;
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.2;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
`;

// ============================================
// TOPBAR - Ultra Premium
// ============================================
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 40px;
  background: rgba(5, 10, 24, 0.6);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: ${floatIn} 0.6s ease;

  @media (max-width: 768px) {
    padding: 14px 20px;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 800;
  text-decoration: none;
  position: relative;

  .logo-icon {
    font-size: 1.8rem;
    animation: ${cosmicFloat} 3s ease-in-out infinite;
  }

  .logo-text {
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: -0.5px;
  }

  .logo-badge {
    position: absolute;
    top: -8px;
    right: -20px;
    font-size: 0.5rem;
    padding: 2px 8px;
    border-radius: 10px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    position: relative;
    margin-left: -4px;

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite;
    }
  }
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Greeting = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;

  .highlight {
    color: #f1f5f9;
    font-weight: 600;
    background: linear-gradient(135deg, #22c55e, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const ProfileAvatar = styled(Link)`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 17px;
  background: linear-gradient(135deg, #1a2332, #0a0f1f);
  border: 2px solid rgba(34, 197, 94, 0.2);
  color: #22c55e;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.05);
  text-decoration: none;

  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    padding: 2px;
    background: conic-gradient(from 0deg, #22c55e, #38bdf8, #a855f7, #22c55e);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 4s linear infinite;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: scale(1.1) rotate(-5deg);
    border-color: #22c55e;
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.2);
  }

  &:hover::before {
    opacity: 1;
  }

  .settings-tooltip {
    position: absolute;
    bottom: -38px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(5, 10, 24, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(34, 197, 94, 0.1);
    color: #f1f5f9;
    padding: 5px 16px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 500;
    white-space: nowrap;
    letter-spacing: 0.3px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid rgba(34, 197, 94, 0.1);
    }

    &::after {
      content: '';
      position: absolute;
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid rgba(5, 10, 24, 0.95);
    }
  }

  &:hover .settings-tooltip {
    opacity: 1;
    bottom: -44px;
  }
`;

const LogoutButton = styled.button`
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 7px 16px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #ef4444;
    color: #0a0f1f;
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 24px rgba(239, 68, 68, 0.25);
  }
`;

// ============================================
// FLOATING CONNECT BUTTON - ULTRA PREMIUM
// ============================================
const ConnectButtonWrapper = styled.div`
  position: fixed;
  bottom: 44px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: ${cosmicFloat} 4s ease-in-out infinite;

  @media (max-width: 768px) {
    bottom: 28px;
    width: 92%;
    max-width: 420px;
  }
`;

const ConnectButton = styled.button`
  position: relative;
  padding: 22px 56px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  border-radius: 80px;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 12px 48px rgba(34, 197, 94, 0.35),
    0 0 100px rgba(34, 197, 94, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  overflow: hidden;
  letter-spacing: 0.5px;
  width: 100%;
  white-space: nowrap;

  /* Animated gradient border */
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 84px;
    padding: 4px;
    background: linear-gradient(
      90deg,
      #22c55e,
      #38bdf8,
      #a855f7,
      #f59e0b,
      #22c55e,
      #38bdf8
    );
    background-size: 300% 100%;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${shimmerBorder} 4s ease infinite;
    opacity: 0.7;
    transition: opacity 0.4s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  /* Shimmer overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 400%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.15), 
      rgba(255, 255, 255, 0.05),
      transparent
    );
    animation: ${shimmerWave} 3s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-8px) scale(1.04);
    box-shadow: 
      0 24px 64px rgba(34, 197, 94, 0.5),
      0 0 120px rgba(34, 197, 94, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  .button-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .button-icon {
    font-size: 1.6rem;
    display: inline-block;
    animation: ${magneticPulse} 2s ease-in-out infinite;
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.2));
  }

  .button-text {
    position: relative;
    z-index: 1;
    letter-spacing: 0.3px;
  }

  .button-arrow {
    font-size: 1.3rem;
    transition: all 0.4s ease;
    display: inline-block;
  }

  &:hover .button-arrow {
    transform: translateX(10px) scale(1.2);
  }

  .connect-badge {
    position: absolute;
    top: -14px;
    right: -14px;
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 5px 16px;
    border-radius: 20px;
    animation: ${pulseGlow} 1.5s ease-in-out infinite;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    z-index: 2;
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
  }

  .ripple-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: ${rippleExpand} 1.5s ease-out infinite;

    &:nth-child(1) {
      width: 100px;
      height: 100px;
      top: -20px;
      right: -20px;
      animation-delay: 0s;
    }

    &:nth-child(2) {
      width: 80px;
      height: 80px;
      bottom: -15px;
      left: -15px;
      animation-delay: 0.5s;
    }

    &:nth-child(3) {
      width: 60px;
      height: 60px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 1s;
    }
  }

  @media (max-width: 768px) {
    padding: 18px 32px;
    font-size: 1rem;
    white-space: normal;

    .button-icon {
      font-size: 1.3rem;
    }

    .connect-badge {
      top: -10px;
      right: -10px;
      font-size: 0.5rem;
      padding: 4px 12px;
    }

    .ripple {
      display: none;
    }
  }
`;

// ============================================
// CONNECT MODAL - ULTRA PREMIUM
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  z-index: 2000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${floatIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background: linear-gradient(160deg, rgba(10, 20, 40, 0.98), rgba(5, 10, 24, 0.99));
  border-radius: 40px;
  padding: 48px 52px;
  max-width: 580px;
  width: 100%;
  border: 1px solid rgba(56, 189, 248, 0.04);
  box-shadow: 
    0 48px 96px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(34, 197, 94, 0.02);
  position: relative;
  overflow: hidden;
  animation: ${modalSlideUp} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Animated gradient border */
  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 43px;
    padding: 3px;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(34, 197, 94, 0.15),
      rgba(56, 189, 248, 0.15),
      rgba(129, 140, 248, 0.15),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 8s linear infinite;
    pointer-events: none;
  }

  /* Top glow bar */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, transparent);
    animation: ${shimmerWave} 2s linear infinite;
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
    margin: 0 12px;
    border-radius: 32px;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 18px;
  right: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    transform: rotate(90deg) scale(1.1);
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${textReveal} 0.8s ease;

  .title-icon {
    font-size: 1.6rem;
    animation: ${cosmicFloat} 3s ease-in-out infinite;
  }

  .title-text {
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const ModalSubtitle = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 32px;
  line-height: 1.7;
  padding-right: 20px;
  animation: ${floatIn} 0.8s ease;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  animation: ${floatIn} 0.6s ease 0.2s both;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.button`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 24px;
  padding: 30px 22px 26px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  color: #f1f5f9;
  position: relative;
  overflow: hidden;

  /* Gradient top bar */
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

  /* Glow background */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background: radial-gradient(circle at center, ${props => props.glowColor || 'rgba(34, 197, 94, 0.03)'}, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.03);
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(56, 189, 248, 0.06);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover::after {
    opacity: 1;
  }

  &:active {
    transform: scale(0.95);
  }

  .option-content {
    position: relative;
    z-index: 1;
  }

  .option-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 12px;
    transition: transform 0.4s ease;
  }

  &:hover .option-icon {
    transform: scale(1.1) rotate(-5deg);
  }

  .option-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .option-desc {
    font-size: 0.8rem;
    color: #94a3b8;
    line-height: 1.5;
  }

  .option-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 0.5rem;
    padding: 4px 14px;
    border-radius: 14px;
    background: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.08);
    color: #4ade80;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 1;
  }

  .option-features {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;

    .feature-tag {
      font-size: 0.55rem;
      padding: 3px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.03);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      transition: all 0.3s ease;
    }

    &:hover .feature-tag {
      border-color: rgba(56, 189, 248, 0.1);
      color: #f1f5f9;
    }
  }

  @media (max-width: 480px) {
    padding: 24px 18px 20px;
    .option-icon { font-size: 2.4rem; }
    .option-name { font-size: 1rem; }
  }
`;

const ModalFooter = styled.div`
  margin-top: 30px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #4b5563;
  animation: ${floatIn} 0.6s ease 0.4s both;

  .security-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #38bdf8;
    font-weight: 500;

    .lock-icon {
      font-size: 1rem;
    }

    .encryption-text {
      background: linear-gradient(135deg, #38bdf8, #22c55e);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  .support-link {
    color: #4b5563;
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      color: #22c55e;
      transform: translateX(4px);
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    align-items: center;
    text-align: center;
  }
`;

// ============================================
// MAIN CONTENT - Minimal & Powerful
// ============================================
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 70px 24px 120px;
  position: relative;
  z-index: 2;
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 16px 90px;
  }
`;

const HeroSection = styled.div`
  animation: ${floatIn} 0.7s ease;

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 20px;
    border-radius: 40px;
    background: rgba(34, 197, 94, 0.04);
    border: 1px solid rgba(34, 197, 94, 0.06);
    font-size: 0.7rem;
    color: #4ade80;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 28px;
    backdrop-filter: blur(12px);

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseGlow} 1.5s ease-in-out infinite;
    }

    .badge-text {
      font-weight: 600;
    }
  }

  h1 {
    font-size: 3.6rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 20px;
    letter-spacing: -1px;

    .highlight {
      background: linear-gradient(135deg, #22c55e, #38bdf8);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #22c55e, #38bdf8);
        border-radius: 2px;
        opacity: 0.2;
        animation: ${shimmerWave} 3s linear infinite;
        background-size: 200% 100%;
      }
    }
  }

  .hero-sub {
    font-size: 1.2rem;
    color: #94a3b8;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.8;
    font-weight: 400;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    margin-top: 40px;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-number {
        font-size: 1.8rem;
        font-weight: 700;
        background: linear-gradient(135deg, #f1f5f9, #94a3b8);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        letter-spacing: -0.5px;
      }

      .stat-label {
        font-size: 0.7rem;
        color: #4b5563;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        margin-top: 2px;
        font-weight: 500;
      }
    }
  }

  @media (max-width: 768px) {
    .hero-badge {
      font-size: 0.6rem;
      padding: 6px 16px;
    }

    h1 {
      font-size: 2.4rem;
    }

    .hero-sub {
      font-size: 1rem;
      padding: 0 10px;
    }

    .hero-stats {
      gap: 28px;
      flex-wrap: wrap;

      .stat-item .stat-number {
        font-size: 1.4rem;
      }

      .stat-item .stat-label {
        font-size: 0.6rem;
      }
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('Trader');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
      navigate('/');
      return;
    }

    setUser(userData);
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Trader';
    setGreeting(fullName);
  }, [navigate]);

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleConnectAccount = (type) => {
    const routes = {
      deriv: '/derivhome',
      forex: '/derivdash'
    };
    navigate(routes[type]);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
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
        <GradientOrb />
        <GridOverlay />
      </BackgroundContainer>

      <Topbar>
        <Brand to="/dashboard">
          <span className="logo-icon">🔷</span>
          <span className="logo-text">Voltix</span>
          <span className="logo-badge">Pro</span>
          <span className="live-dot" />
        </Brand>
        <ProfileArea>
          <Greeting>
            👋 <span className="highlight">{greeting}</span>
          </Greeting>
          <ProfileAvatar to="/settings">
            {getInitials()}
            <span className="settings-tooltip">⚙️ Account Settings</span>
          </ProfileAvatar>
          <LogoutButton onClick={handleLogout}>🚪 Logout</LogoutButton>
        </ProfileArea>
      </Topbar>

      <Container>
        <HeroSection>
          <div className="hero-badge">
            <span className="badge-dot" />
            <span className="badge-text">System Online • Ready for Trading</span>
          </div>
          <h1>
            Welcome to the <br />
            <span className="highlight">Future of Trading</span>
          </h1>
          <p className="hero-sub">
            Connect your trading account and unlock real-time markets with AI-powered insights.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Trading</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Markets</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0%</span>
              <span className="stat-label">Commission</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">AI</span>
              <span className="stat-label">Powered</span>
            </div>
          </div>
        </HeroSection>
      </Container>

      {/* ULTRA PREMIUM FLOATING CONNECT BUTTON */}
      <ConnectButtonWrapper>
        <ConnectButton onClick={handleConnect}>
          <div className="ripple-container">
            <div className="ripple" />
            <div className="ripple" />
            <div className="ripple" />
          </div>
          <span className="connect-badge">⚡ Live</span>
          <span className="button-content">
            <span className="button-icon">🔗</span>
            <span className="button-text">Connect Your Accounts</span>
            <span className="button-arrow">→</span>
          </span>
        </ConnectButton>
      </ConnectButtonWrapper>

      {/* ULTRA PREMIUM CONNECT MODAL */}
      <ModalOverlay isOpen={isModalOpen}>
        <ModalContainer>
          <ModalClose onClick={() => setIsModalOpen(false)}>✕</ModalClose>
          <ModalTitle>
            <span className="title-icon">🚀</span>
            <span className="title-text">Connect Platform</span>
          </ModalTitle>
          <ModalSubtitle>
            Select your preferred trading platform to sync your account and start executing trades instantly.
          </ModalSubtitle>

          <OptionGrid>
            <OptionCard 
              color="linear-gradient(90deg, #a855f7, #7c3aed)"
              glowColor="rgba(168, 85, 247, 0.08)"
              onClick={() => handleConnectAccount('deriv')}
            >
              <span className="option-badge">24/7</span>
              <div className="option-content">
                <span className="option-icon">📊</span>
                <div className="option-name">Deriv</div>
                <div className="option-desc">Synthetic indices • Options</div>
                <div className="option-features">
                  <span className="feature-tag">High-Freq</span>
                  <span className="feature-tag">AI Signals</span>
                  <span className="feature-tag">0% Fee</span>
                </div>
              </div>
            </OptionCard>

            <OptionCard 
              color="linear-gradient(90deg, #2563eb, #1d4ed8)"
              glowColor="rgba(37, 99, 235, 0.08)"
              onClick={() => handleConnectAccount('forex')}
            >
              <span className="option-badge">24/5</span>
              <div className="option-content">
                <span className="option-icon">💱</span>
                <div className="option-name">Forex</div>
                <div className="option-desc">Major • Minor • Exotic pairs</div>
                <div className="option-features">
                  <span className="feature-tag">Leverage</span>
                  <span className="feature-tag">Spreads</span>
                  <span className="feature-tag">Liquid</span>
                </div>
              </div>
            </OptionCard>
          </OptionGrid>

          <ModalFooter>
            <span className="security-badge">
              <span className="lock-icon">🔒</span>
              <span className="encryption-text">256-bit Encrypted Connection</span>
            </span>
            <a href="#" className="support-link">
              Need help? <span>→</span>
            </a>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
    </>
  );
};

export default Dashboard;