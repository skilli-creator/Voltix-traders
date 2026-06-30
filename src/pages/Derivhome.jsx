import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
// KEYFRAMES - CINEMATIC
// ============================================
const floatIn = keyframes`
  0% { opacity: 0; transform: translateY(40px) scale(0.95) rotateX(5deg); filter: blur(8px); }
  60% { transform: translateY(-5px) scale(1.01) rotateX(0deg); filter: blur(0px); }
  100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); filter: blur(0px); }
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
  0%, 100% { opacity: 0.08; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(1.06); }
`;

const slideGlow = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(200%) skewX(-20deg); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.08); }
  50% { box-shadow: 0 0 50px rgba(34, 197, 94, 0.2); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-12px) scale(1.02); }
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
  filter: blur(120px);
  animation: ${breathe} 8s ease-in-out infinite;

  &:nth-child(1) {
    width: 550px;
    height: 550px;
    top: -220px;
    right: -180px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.05), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 450px;
    height: 450px;
    bottom: -180px;
    left: -120px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.04), transparent 70%);
    animation-delay: -2.5s;
  }

  &:nth-child(3) {
    width: 350px;
    height: 350px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(129, 140, 248, 0.025), transparent 70%);
    animation-delay: -5s;
  }

  @media (max-width: 768px) {
    &:nth-child(1) { width: 280px; height: 280px; top: -120px; right: -80px; }
    &:nth-child(2) { width: 220px; height: 220px; bottom: -80px; left: -60px; }
    &:nth-child(3) { width: 160px; height: 160px; }
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.012) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.4;
`;

const GlowLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, #818cf8, transparent);
  opacity: 0.08;
`;

// ============================================
// TOPBAR
// ============================================
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 32px;
  background: rgba(5, 10, 24, 0.75);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.04);
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

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .logo-icon {
    font-size: 1.6rem;
    filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.1));
  }

  .logo-text {
    font-size: 1.4rem;
    font-weight: 800;
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

    &::after {
      content: '';
      position: absolute;
      inset: -7px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite 0.5s;
    }
  }

  @media (max-width: 768px) {
    .logo-text { font-size: 1.2rem; }
    .logo-icon { font-size: 1.3rem; }
    .live-dot { width: 6px; height: 6px; }
  }
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 30px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.02);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(56, 189, 248, 0.15);
    color: #f1f5f9;
    transform: translateX(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 12px;
  }
`;

// ============================================
// MAIN CONTENT
// ============================================
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 24px 16px 40px;
  }
`;

const BadgeGlow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(34, 197, 94, 0.04);
  border: 1px solid rgba(34, 197, 94, 0.06);
  padding: 6px 18px 6px 12px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 600;
  color: #4ade80;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .live-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #22c55e;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 4px 12px 4px 8px;
  }
`;

const Title = styled.h1`
  font-size: 52px;
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 16px;
  letter-spacing: -1.5px;

  .gradient-text {
    background: linear-gradient(135deg, #22c55e, #38bdf8, #818cf8, #c084fc);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ${shimmer} 6s ease-in-out infinite;
  }

  @media (max-width: 1024px) {
    font-size: 40px;
  }

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 28px;
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// ============================================
// CONNECT PANEL
// ============================================
const ConnectPanel = styled.div`
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(16px);
  border-radius: 28px;
  padding: 36px 32px;
  border: 1px solid rgba(255, 255, 255, 0.025);
  max-width: 540px;
  margin: 0 auto 32px;
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
    opacity: 0.15;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 28px;
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
    animation: ${rotateGlow} 25s linear infinite;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 24px 18px;
    margin: 0 auto 20px;
  }
`;

const SectionTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  .icon {
    font-size: 1.4rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SectionSubtitle = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

// ============================================
// OAUTH BUTTON
// ============================================
const OAuthButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #22c55e, #16a34a, #0d9488);
  background-size: 200% 200%;
  color: #0a0f1f;
  border-radius: 32px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border: none;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(34, 197, 94, 0.08);
  animation: ${shimmer} 8s ease-in-out infinite;

  .btn-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
    animation: ${slideGlow} 4s ease-in-out infinite;
    z-index: 1;
  }

  .btn-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.03), transparent 70%);
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: 0;
  }

  .btn-content {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 2;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 8px 40px rgba(34, 197, 94, 0.15);
  }

  &:hover:not(:disabled) .btn-glow {
    opacity: 1;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
    display: inline-block;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 0.85rem;
  }
`;

// ============================================
// MESSAGE
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

const AccountSignup = styled.div`
  margin-top: 16px;
  font-size: 13px;
  color: #94a3b8;
  text-align: center;

  a {
    color: #38bdf8;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1.5px;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      transition: width 0.3s ease;
    }

    &:hover {
      color: #7dd3fc;
    }

    &:hover::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

// ============================================
// CARDS
// ============================================
const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(12px);
  padding: 24px 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.06), transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: rgba(56, 189, 248, 0.04);
    background: rgba(255, 255, 255, 0.025);
    box-shadow: 0 24px 48px -16px rgba(0, 0, 0, 0.4);
  }

  &:hover::before {
    opacity: 1;
  }

  .card-icon {
    font-size: 28px;
    margin-bottom: 12px;
    display: block;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 6px;
  }

  .card-desc {
    font-size: 0.8rem;
    color: #94a3b8;
    line-height: 1.7;
  }

  .card-number {
    position: absolute;
    bottom: 12px;
    right: 16px;
    font-size: 36px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.015);
    letter-spacing: -3px;
    font-family: 'Courier New', monospace;
  }

  @media (max-width: 768px) {
    padding: 18px 16px;
    .card-icon { font-size: 24px; }
    .card-title { font-size: 0.9rem; }
    .card-desc { font-size: 0.75rem; }
    .card-number { font-size: 28px; }
  }
`;

const Powered = styled.div`
  margin-top: 40px;
  font-size: 0.7rem;
  color: #4b5563;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.015);
  padding-top: 24px;

  span {
    color: #38bdf8;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

// ============================================
// CINEMATIC POPUP
// ============================================
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
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
  animation: ${float} 2.5s ease-in-out infinite;
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
// MAIN COMPONENT
// ============================================

const DerivTrading = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('Connecting to Deriv...');
  const [popupProgress, setPopupProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login first to connect your Deriv account');
      setMessageType('error');
      setShowMessage(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setIsAuthenticated(true);
    }
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

  const handleOAuthConnect = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
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

  const closePopup = () => {
    if (!isLoading) {
      setShowPopup(false);
    }
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

      <Topbar>
        <Logo>
          <span className="logo-icon">◆</span>
          <span className="logo-text">Voltix Traders</span>
          <span className="live-dot" />
        </Logo>
        <BackButton to="/Marketsdash">← Back</BackButton>
      </Topbar>

      <Container>
        <BadgeGlow>
          <span className="live-dot" />
          AI-Powered Deriv Trading
        </BadgeGlow>

        <Title>
          Trade <span className="gradient-text">Deriv</span> with<br />Intelligent Precision
        </Title>

        <Subtitle>
          Harness the power of AI-driven analytics and secure OAuth 2.0 integration
          to trade smarter, faster, and more profitably.
        </Subtitle>

        <ConnectPanel>
          <SectionTitle>
            <span className="icon">🔒</span> Connect Your Deriv Account
          </SectionTitle>
          <SectionSubtitle>
            Securely connect your Deriv account via OAuth 2.0
          </SectionSubtitle>

          <OAuthButton 
            onClick={handleOAuthConnect}
            disabled={isLoading || !isAuthenticated}
          >
            <div className="btn-shimmer" />
            <div className="btn-glow" />
            <span className="btn-content">
              {isLoading ? (
                <>
                  <span className="spinner">⟳</span> Connecting...
                </>
              ) : (
                'Connect with Deriv OAuth'
              )}
            </span>
          </OAuthButton>

          <AccountSignup>
            New to Deriv trading?{' '}
            <a href="https://deriv.com/" target="_blank" rel="noopener noreferrer">
              Open a free Deriv account →
            </a>
          </AccountSignup>

          <MessageArea show={showMessage} type={messageType}>
            <span className="msg-icon">
              {messageType === 'success' ? '✓' : 
               messageType === 'error' ? '✗' : 
               'i'}
            </span>
            {message}
          </MessageArea>
        </ConnectPanel>

        <Cards>
          <Card>
            <span className="card-icon">⚙</span>
            <h3 className="card-title">All Trades Engine</h3>
            <p className="card-desc">Executes all types of trades with smart order flow and risk-aware logic.</p>
            <span className="card-number">01</span>
          </Card>

          <Card>
            <span className="card-icon">📈</span>
            <h3 className="card-title">High-Spec Analysis</h3>
            <p className="card-desc">Real-time market analysis, confidence scoring &amp; AI-driven entry points.</p>
            <span className="card-number">02</span>
          </Card>

          <Card>
            <span className="card-icon">🔒</span>
            <h3 className="card-title">Secure Connection Layer</h3>
            <p className="card-desc">OAuth 2.0 authentication with encrypted infrastructure.</p>
            <span className="card-number">03</span>
          </Card>
        </Cards>

        <Powered>
          Powered by <span>Deriv</span> — All trading actions executed on Deriv's official infrastructure. Trade responsibly.
        </Powered>
      </Container>

      {showPopup && (
        <Overlay onClick={closePopup}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            {popupMessage.includes('failed') || popupMessage.includes('error') ? (
              <PopupIcon>⚠</PopupIcon>
            ) : popupMessage.includes('Redirecting') ? (
              <PopupIcon>▶</PopupIcon>
            ) : (
              <PopupSpinner>
                <div className="ring" />
                <div className="ring" />
                <div className="ring" />
              </PopupSpinner>
            )}

            <PopupTitle>
              {popupMessage.includes('failed') || popupMessage.includes('error') ? 'Oops!' : 'Connecting...'}
            </PopupTitle>

            <PopupSubtitle>{popupMessage}</PopupSubtitle>

            {!popupMessage.includes('failed') && !popupMessage.includes('error') && !popupMessage.includes('Redirecting') && (
              <PopupHint>Hang tight — we're redirecting you securely...</PopupHint>
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

export default DerivTrading;