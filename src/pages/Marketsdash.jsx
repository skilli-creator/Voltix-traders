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
// KEYFRAMES
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

const slideGlow = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(200%) skewX(-20deg); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmerLine = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const floatPulse = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.03); }
`;

const cosmicFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(1deg); }
  75% { transform: translateY(5px) rotate(-1deg); }
`;

const shimmerWave = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const modalSlideUp = keyframes`
  0% { opacity: 0; transform: translateY(40px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.8) translateY(30px); }
  70% { transform: scale(1.02) translateY(-5px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const shimmerBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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

// ============================================
// TOPBAR - With Settings Avatar
// ============================================
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: rgba(5, 10, 24, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: ${floatIn} 0.6s ease;

  @media (max-width: 768px) {
    padding: 12px 16px;
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
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Greeting = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;

  .highlight {
    color: #f1f5f9;
    font-weight: 600;
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

  .settings-tooltip {
    position: absolute;
    bottom: -36px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(5, 10, 24, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(34, 197, 94, 0.15);
    color: #f1f5f9;
    padding: 4px 14px;
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
      border-bottom: 6px solid rgba(34, 197, 94, 0.15);
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
    bottom: -40px;
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
`;

// ============================================
// MESSAGE COMPONENT
// ============================================
const MessageArea = styled.div`
  margin-top: 14px;
  font-size: 13px;
  padding: 10px 16px;
  border-radius: 16px;
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  gap: 10px;
  background: ${props => {
    switch(props.type) {
      case 'success': return 'rgba(34, 197, 94, 0.04)';
      case 'error': return 'rgba(239, 68, 68, 0.04)';
      case 'info': return 'rgba(56, 189, 248, 0.04)';
      default: return 'rgba(0, 0, 0, 0.15)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'success': return '#4ade80';
      case 'error': return '#f87171';
      case 'info': return '#60a5fa';
      default: return '#94a3b8';
    }
  }};
  border: 1px solid ${props => {
    switch(props.type) {
      case 'success': return 'rgba(34, 197, 94, 0.06)';
      case 'error': return 'rgba(239, 68, 68, 0.06)';
      case 'info': return 'rgba(56, 189, 248, 0.06)';
      default: return 'rgba(255, 255, 255, 0.015)';
    }
  }};

  .msg-icon {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 12px;
  }
`;

// ============================================
// CINEMATIC POPUP
// ============================================
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(16px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${floatIn} 0.4s ease;
`;

const PopupCard = styled.div`
  background: linear-gradient(160deg, rgba(8, 18, 38, 0.92), rgba(3, 8, 20, 0.92));
  backdrop-filter: blur(32px);
  border-radius: 40px;
  padding: 48px 40px 40px;
  max-width: 420px;
  width: 92%;
  border: 1px solid rgba(56, 189, 248, 0.04);
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: ${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    height: 4px;
    background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, #818cf8, #22c55e);
    background-size: 300% 100%;
    animation: ${shimmerBorder} 4s ease-in-out infinite;
    border-radius: 40px 40px 0 0;
    opacity: 0.3;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 40px;
    padding: 1px;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(56, 189, 248, 0.03),
      transparent,
      rgba(129, 140, 248, 0.03),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 25s linear infinite;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 32px 20px 28px;
    border-radius: 28px;
    &::before { border-radius: 28px 28px 0 0; }
    &::after { border-radius: 28px; }
  }
`;

const PopupSpinner = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  position: relative;

  .ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    animation: ${spin} 1.4s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.02);
  }
  .ring:nth-child(1) {
    border-top-color: #22c55e;
    animation-duration: 1.4s;
    filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.1));
  }
  .ring:nth-child(2) {
    inset: 12px;
    border-top-color: #38bdf8;
    animation-duration: 2s;
    animation-direction: reverse;
    filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.1));
  }
  .ring:nth-child(3) {
    inset: 24px;
    border-top-color: #818cf8;
    animation-duration: 2.8s;
    filter: drop-shadow(0 0 8px rgba(129, 140, 248, 0.1));
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    .ring { border-width: 2px; }
    .ring:nth-child(2) { inset: 8px; }
    .ring:nth-child(3) { inset: 16px; }
  }
`;

const PopupIcon = styled.div`
  font-size: 44px;
  margin-bottom: 14px;
  animation: ${floatPulse} 2.5s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(56, 189, 248, 0.05));

  @media (max-width: 480px) {
    font-size: 34px;
  }
`;

const PopupTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 6px;
  letter-spacing: -0.3px;

  @media (max-width: 480px) {
    font-size: 19px;
  }
`;

const PopupSubtitle = styled.p`
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const PopupHint = styled.p`
  color: #4b5563;
  font-size: 12px;
  margin-top: 12px;
  animation: ${pulseGlow} 2.5s ease-in-out infinite;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const PopupProgress = styled.div`
  margin-top: 18px;
  height: 2px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  .bar {
    height: 100%;
    width: ${props => props.progress || '0%'};
    background: linear-gradient(90deg, #22c55e, #38bdf8, #818cf8);
    border-radius: 4px;
    transition: width 0.5s ease;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
  }

  @media (max-width: 480px) {
    margin-top: 14px;
    height: 1.5px;
  }
`;

const PopupCloseButton = styled.button`
  margin-top: 20px;
  padding: 6px 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 30px;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #f1f5f9;
    border-color: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 4px 16px;
  }
`;

// ============================================
// FLOATING CONNECT BUTTON - SUPER PREMIUM
// ============================================
const ConnectButtonWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: ${cosmicFloat} 4s ease-in-out infinite;
  cursor: pointer;

  @media (max-width: 768px) {
    bottom: 24px;
    width: 90%;
    max-width: 400px;
  }
`;

const ConnectButton = styled.button`
  position: relative;
  padding: 20px 52px;
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.05)' : 'linear-gradient(135deg, #22c55e, #16a34a)'};
  border: none;
  border-radius: 60px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.disabled ? 'none' : `
    0 10px 40px rgba(34, 197, 94, 0.3),
    0 0 80px rgba(34, 197, 94, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15)
  `};
  overflow: hidden;
  letter-spacing: 0.5px;
  width: 100%;
  white-space: nowrap;
  opacity: ${props => props.disabled ? 0.5 : 1};

  /* Premium gradient border glow */
  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 63px;
    padding: 3px;
    background: conic-gradient(
      from 0deg,
      #22c55e,
      #38bdf8,
      #a855f7,
      #22c55e,
      #38bdf8,
      #22c55e
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 8s linear infinite;
    opacity: ${props => props.disabled ? 0 : 0.6};
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: ${props => props.disabled ? 0 : 1};
  }

  /* Shimmer effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 300%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${shimmerWave} 3s ease-in-out infinite;
  }

  /* Inner glow on hover */
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-6px) scale(1.03)'};
    box-shadow: ${props => props.disabled ? 'none' : `
      0 20px 60px rgba(34, 197, 94, 0.5),
      0 0 100px rgba(34, 197, 94, 0.2)
    `};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.96)'};
  }

  .button-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }

  .button-icon {
    font-size: 1.5rem;
    display: inline-block;
    animation: ${floatPulse} 2s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  }

  .button-text {
    position: relative;
    z-index: 1;
  }

  .button-arrow {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
    display: inline-block;
  }

  &:hover .button-arrow {
    transform: ${props => props.disabled ? 'none' : 'translateX(6px)'};
  }

  .connect-badge {
    position: absolute;
    top: -12px;
    right: -12px;
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    color: #fff;
    font-size: 0.55rem;
    font-weight: 700;
    padding: 4px 14px;
    border-radius: 20px;
    animation: ${pulseGlow} 2s ease-in-out infinite;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 2;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
    display: inline-block;
  }

  /* Floating particles */
  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(34, 197, 94, 0.6);
    border-radius: 50%;
    pointer-events: none;
    animation: ${glowPulse} 2s ease-in-out infinite;
  }

  .particle:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .particle:nth-child(2) {
    bottom: 20%;
    right: 10%;
    animation-delay: 0.7s;
  }

  .particle:nth-child(3) {
    top: 10%;
    right: 30%;
    animation-delay: 1.4s;
  }

  .particle:nth-child(4) {
    bottom: 10%;
    left: 30%;
    animation-delay: 2.1s;
  }

  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 0.95rem;
    white-space: normal;

    .button-icon {
      font-size: 1.2rem;
    }

    .connect-badge {
      top: -8px;
      right: -8px;
      font-size: 0.45rem;
      padding: 3px 10px;
    }

    .particle {
      display: none;
    }
  }
`;

// ============================================
// CONNECT MODAL - Super Premium with OAuth
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(16px);
  z-index: 2000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${floatIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background: linear-gradient(160deg, rgba(10, 20, 40, 0.98), rgba(5, 10, 24, 0.98));
  border-radius: 32px;
  padding: 44px 48px;
  max-width: 540px;
  width: 100%;
  border: 1px solid rgba(56, 189, 248, 0.06);
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(34, 197, 94, 0.03);
  position: relative;
  overflow: hidden;
  animation: ${modalSlideUp} 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Animated gradient border */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 34px;
    padding: 2px;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(34, 197, 94, 0.2),
      rgba(56, 189, 248, 0.2),
      rgba(129, 140, 248, 0.2),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 10s linear infinite;
    pointer-events: none;
  }

  /* Top glow line */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, transparent);
    animation: ${shimmerLine} 2s linear infinite;
  }

  @media (max-width: 768px) {
    padding: 28px 20px;
    margin: 0 12px;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
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
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #f1f5f9, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;

  .title-icon {
    font-size: 1.4rem;
  }
`;

const ModalSubtitle = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 30px;
  line-height: 1.6;
  padding-right: 20px;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.button`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: #f1f5f9;
  position: relative;
  overflow: hidden;

  /* Top gradient bar */
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

  /* Glow on hover */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: radial-gradient(circle at center, ${props => props.glowColor || 'rgba(34, 197, 94, 0.05)'}, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(56, 189, 248, 0.08);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
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

  .option-content {
    position: relative;
    z-index: 1;
  }

  .option-icon {
    font-size: 2.8rem;
    display: block;
    margin-bottom: 10px;
  }

  .option-name {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .option-desc {
    font-size: 0.75rem;
    color: #94a3b8;
    line-height: 1.4;
  }

  .option-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 0.5rem;
    padding: 3px 12px;
    border-radius: 12px;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.1);
    color: #4ade80;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    z-index: 1;
  }

  .option-features {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;

    .feature-tag {
      font-size: 0.55rem;
      padding: 2px 10px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.03);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
  }

  .oauth-status {
    margin-top: 12px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.6rem;
    background: rgba(34, 197, 94, 0.05);
    border: 1px solid rgba(34, 197, 94, 0.05);
    color: #4ade80;
    display: inline-block;
  }

  @media (max-width: 480px) {
    padding: 22px 16px;
    .option-icon { font-size: 2.2rem; }
    .option-name { font-size: 0.95rem; }
  }
`;

const ModalFooter = styled.div`
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  color: #4b5563;

  .security-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #38bdf8;
    font-weight: 500;

    .lock-icon {
      font-size: 0.9rem;
    }
  }

  .support-link {
    color: #4b5563;
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;

    &:hover {
      color: #22c55e;
      transform: translateX(4px);
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
`;

// ============================================
// MAIN CONTENT - Minimal & Elegant
// ============================================
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px 100px;
  position: relative;
  z-index: 2;
  text-align: center;

  @media (max-width: 768px) {
    padding: 32px 16px 80px;
  }
`;

const HeroSection = styled.div`
  animation: ${floatIn} 0.7s ease;
  margin-top: 20px;

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 30px;
    background: rgba(34, 197, 94, 0.05);
    border: 1px solid rgba(34, 197, 94, 0.08);
    font-size: 0.7rem;
    color: #4ade80;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 20px;

    .badge-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseGlow} 2s ease-in-out infinite;
    }
  }

  h1 {
    font-size: 3.2rem;
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 16px;

    .highlight {
      background: linear-gradient(135deg, #22c55e, #38bdf8);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #22c55e, #38bdf8);
        border-radius: 2px;
        opacity: 0.3;
      }
    }
  }

  .hero-sub {
    font-size: 1.15rem;
    color: #94a3b8;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 32px;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-number {
        font-size: 1.6rem;
        font-weight: 700;
        background: linear-gradient(135deg, #f1f5f9, #94a3b8);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .stat-label {
        font-size: 0.65rem;
        color: #4b5563;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.2rem;
    }
    .hero-sub {
      font-size: 1rem;
    }
    .hero-stats {
      gap: 24px;
      flex-wrap: wrap;
      .stat-item .stat-number { font-size: 1.2rem; }
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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupProgress, setPopupProgress] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  useEffect(() => {
    if (showPopup && !isLoading) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, isLoading]);

  const showCustomMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
  };

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleConnectAccount = async (type) => {
    if (type === 'deriv') {
      await handleDerivOAuth();
    } else {
      navigate('/derivdash');
      setIsModalOpen(false);
    }
  };

  const handleDerivOAuth = async () => {
    setIsLoading(true);
    setIsModalOpen(false);
    setShowPopup(true);
    setPopupProgress(10);
    setPopupMessage('Initiating secure connection...');

    try {
      const authToken = localStorage.getItem('token');

      setPopupProgress(30);
      setPopupMessage('Authenticating with Deriv...');
      await new Promise(resolve => setTimeout(resolve, 600));

      const response = await fetch(
        `${API_BASE_URL}/deriv/oauth/initiate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            token: authToken
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.auth_url) {
        setPopupProgress(70);
        setPopupMessage('Redirecting to Deriv login...');
        await new Promise(resolve => setTimeout(resolve, 500));

        setPopupProgress(100);
        setTimeout(() => {
          window.location.href = data.auth_url;
        }, 400);
      } else {
        setPopupProgress(100);
        setPopupMessage('Connection failed');
        showCustomMessage(
          `Connection failed: ${data.error || 'Unknown error'}`,
          'error'
        );
        setIsLoading(false);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (error) {
      console.error('OAuth error:', error);
      setPopupProgress(100);
      setPopupMessage('Connection error');
      showCustomMessage(
        'Cannot connect to server. Please check your connection.',
        'error'
      );
      setIsLoading(false);
      setTimeout(() => setShowPopup(false), 2500);
    }
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

  const closePopup = () => {
    if (!isLoading) {
      setShowPopup(false);
    }
  };

  const handleSupportClick = () => {
    navigate('/settings');
    setIsModalOpen(false);
  };

  return (
    <>
      <GlobalStyle />

      <BackgroundContainer>
        <GradientOrb />
        <GradientOrb />
        <GradientOrb />
        <GridOverlay />
      </BackgroundContainer>

      <Topbar>
        <Brand to="/dashboard">
          <span className="logo-icon">◆</span>
          <span className="logo-text">Voltix Traders</span>
          <span className="live-dot" />
        </Brand>
        <ProfileArea>
          <Greeting>
            Welcome, <span className="highlight">{greeting}</span>
          </Greeting>
          <ProfileAvatar to="/settings">
            {getInitials()}
            <span className="settings-tooltip">⚙ Account Settings</span>
          </ProfileAvatar>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </ProfileArea>
      </Topbar>

      <Container>
        <HeroSection>
          <div className="hero-badge">
            <span className="badge-dot" />
            System Online • Ready for Trading
          </div>
          <h1>
            Welcome to the <br />
            <span className="highlight">Future of Trading</span>
          </h1>
          <p className="hero-sub">
            Connect your trading account and access real-time markets with AI-powered insights.
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
              <span className="stat-number">0</span>
              <span className="stat-label">Commission</span>
            </div>
          </div>
        </HeroSection>
      </Container>

      {/* SUPER PREMIUM FLOATING CONNECT BUTTON */}
      <ConnectButtonWrapper>
        <ConnectButton 
          onClick={handleConnect}
          disabled={isLoading}
        >
          <span className="particle" />
          <span className="particle" />
          <span className="particle" />
          <span className="particle" />
          <span className="connect-badge">Live</span>
          <span className="button-content">
            {isLoading ? (
              <>
                <span className="spinner">⟳</span>
                <span className="button-text">Connecting...</span>
              </>
            ) : (
              <>
                <span className="button-icon">🔗</span>
                <span className="button-text">Connect Your Accounts</span>
                <span className="button-arrow">→</span>
              </>
            )}
          </span>
        </ConnectButton>
      </ConnectButtonWrapper>

      {/* CONNECT MODAL */}
      <ModalOverlay isOpen={isModalOpen}>
        <ModalContainer>
          <ModalClose onClick={() => setIsModalOpen(false)}>✕</ModalClose>
          <ModalTitle>
            <span className="title-icon">◆</span>
            Connect Platform
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
                </div>
                <div className="oauth-status">🔐 OAuth 2.0 Secure</div>
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
                </div>
              </div>
            </OptionCard>
          </OptionGrid>

          <MessageArea show={showMessage} type={messageType}>
            <span className="msg-icon">
              {messageType === 'success' ? '✓' : 
               messageType === 'error' ? '✗' : 
               'ℹ'}
            </span>
            {message}
          </MessageArea>

          <ModalFooter>
            <span className="security-badge">
              <span className="lock-icon">🔒</span>
              256-bit Encrypted Connection
            </span>
            <span 
              className="support-link" 
              onClick={handleSupportClick}
            >
              Need help? →
            </span>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>

      {/* CINEMATIC POPUP */}
      {showPopup && (
        <Overlay onClick={closePopup}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            {popupMessage.includes('failed') || popupMessage.includes('error') ? (
              <PopupIcon>⚠</PopupIcon>
            ) : popupMessage.includes('Redirecting') ? (
              <PopupIcon>◆</PopupIcon>
            ) : (
              <PopupSpinner>
                <div className="ring" />
                <div className="ring" />
                <div className="ring" />
              </PopupSpinner>
            )}

            <PopupTitle>
              {popupMessage.includes('failed') || popupMessage.includes('error') ? 'Error' : 'Connecting...'}
            </PopupTitle>

            <PopupSubtitle>{popupMessage}</PopupSubtitle>

            {!popupMessage.includes('failed') && 
             !popupMessage.includes('error') && 
             !popupMessage.includes('Redirecting') && (
              <PopupHint>Please wait — redirecting securely...</PopupHint>
            )}

            <PopupProgress progress={popupProgress}>
              <div className="bar" />
            </PopupProgress>

            {(popupMessage.includes('failed') || popupMessage.includes('error')) && (
              <PopupCloseButton onClick={closePopup}>Close</PopupCloseButton>
            )}
          </PopupCard>
        </Overlay>
      )}
    </>
  );
};

export default Dashboard;