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

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.1); }
  50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.2); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .logo-icon {
    font-size: 1.6rem;
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
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.02);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(56, 189, 248, 0.2);
    color: #f1f5f9;
    transform: translateX(-4px);
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
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.08);
  padding: 6px 18px 6px 12px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 600;
  color: #4ade80;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.3px;

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
    background: linear-gradient(135deg, #22c55e, #38bdf8, #818cf8);
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
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// ============================================
// CONNECT PANEL
// ============================================
const ConnectPanel = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 36px 32px;
  border: 1px solid rgba(255, 255, 255, 0.03);
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
    opacity: 0.2;
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
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #0a0f1f;
  border-radius: 32px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(34, 197, 94, 0.12);

  .btn-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    animation: ${slideGlow} 4s ease-in-out infinite;
    z-index: 1;
  }

  .btn-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04), transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 36px rgba(34, 197, 94, 0.2);
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
      case 'success': return 'rgba(34, 197, 94, 0.06)';
      case 'error': return 'rgba(239, 68, 68, 0.06)';
      case 'info': return 'rgba(56, 189, 248, 0.06)';
      default: return 'rgba(0, 0, 0, 0.2)';
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
      case 'success': return 'rgba(34, 197, 94, 0.08)';
      case 'error': return 'rgba(239, 68, 68, 0.08)';
      case 'info': return 'rgba(56, 189, 248, 0.08)';
      default: return 'rgba(255, 255, 255, 0.02)';
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
    transition: color 0.3s ease;

    &:hover {
      color: #7dd3fc;
      text-decoration: underline;
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
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  padding: 24px 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
    background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.08), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(56, 189, 248, 0.06);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
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
    font-size: 32px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.02);
    letter-spacing: -3px;
  }

  @media (max-width: 768px) {
    padding: 18px 16px;
    .card-icon { font-size: 24px; }
    .card-title { font-size: 0.9rem; }
    .card-desc { font-size: 0.75rem; }
  }
`;

const Powered = styled.div`
  margin-top: 40px;
  font-size: 0.7rem;
  color: #4b5563;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
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
// FLOATING POPUP / MODAL
// ============================================
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${floatIn} 0.3s ease;
`;

const PopupCard = styled.div`
  background: linear-gradient(145deg, rgba(8, 18, 38, 0.95), rgba(5, 10, 24, 0.95));
  backdrop-filter: blur(32px);
  border-radius: 32px;
  padding: 44px 36px;
  max-width: 400px;
  width: 90%;
  border: 1px solid rgba(56, 189, 248, 0.06);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
  text-align: center;
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

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 32px;
    padding: 1px;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(56, 189, 248, 0.04),
      transparent,
      rgba(129, 140, 248, 0.04),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 20s linear infinite;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 32px 20px;
    border-radius: 24px;
  }
`;

const PopupSpinner = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  position: relative;

  .ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #22c55e;
    animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .ring:nth-child(1) {
    animation-duration: 1.2s;
  }
  .ring:nth-child(2) {
    inset: 10px;
    border-top-color: #38bdf8;
    animation-duration: 1.8s;
    animation-direction: reverse;
  }
  .ring:nth-child(3) {
    inset: 20px;
    border-top-color: #818cf8;
    animation-duration: 2.4s;
  }

  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    .ring { border-width: 2px; }
  }
`;

const PopupIcon = styled.div`
  font-size: 40px;
  margin-bottom: 14px;
  animation: ${float} 2s ease-in-out infinite;

  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const PopupTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 6px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const PopupSubtitle = styled.p`
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const PopupHint = styled.p`
  color: #4b5563;
  font-size: 11px;
  margin-top: 12px;
  animation: ${pulseGlow} 2s ease-in-out infinite;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const PopupCloseButton = styled.button`
  margin-top: 18px;
  padding: 6px 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 30px;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #f1f5f9;
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

  const showCustomMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
  };

  const handleOAuthConnect = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setShowPopup(true);
    setPopupMessage('🔐 Initiating secure connection...');

    try {
      const authToken = localStorage.getItem('token');

      setPopupMessage('🔄 Authenticating with Deriv...');
      await new Promise(resolve => setTimeout(resolve, 800));

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
        setPopupMessage('🚀 Redirecting to Deriv login...');
        await new Promise(resolve => setTimeout(resolve, 600));

        window.location.href = data.auth_url;
      } else {
        setPopupMessage('❌ Connection failed');
        showCustomMessage(
          `Connection failed: ${data.error || 'Unknown error'}`,
          'error'
        );
        setIsLoading(false);
        setTimeout(() => setShowPopup(false), 1500);
      }
    } catch (error) {
      console.error('OAuth error:', error);
      setPopupMessage('❌ Connection error');
      showCustomMessage(
        'Cannot connect to server. Please check your connection.',
        'error'
      );
      setIsLoading(false);
      setTimeout(() => setShowPopup(false), 2000);
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
          <span className="logo-icon">🔷</span>
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
            <span className="icon">🔐</span> Connect Your Deriv Account
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
                '🔵 Connect with Deriv OAuth'
              )}
            </span>
          </OAuthButton>

          <AccountSignup>
            🚀 New to Deriv trading?{' '}
            <a href="https://deriv.com/" target="_blank" rel="noopener noreferrer">
              Open a free Deriv account →
            </a>
          </AccountSignup>

          <MessageArea show={showMessage} type={messageType}>
            <span className="msg-icon">
              {messageType === 'success' ? '✅' : 
               messageType === 'error' ? '❌' : 
               'ℹ️'}
            </span>
            {message}
          </MessageArea>
        </ConnectPanel>

        <Cards>
          <Card>
            <span className="card-icon">⚙️</span>
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
            {popupMessage.includes('❌') ? (
              <PopupIcon>⚠️</PopupIcon>
            ) : popupMessage.includes('🚀') ? (
              <PopupIcon>🚀</PopupIcon>
            ) : (
              <PopupSpinner>
                <div className="ring" />
                <div className="ring" />
                <div className="ring" />
              </PopupSpinner>
            )}

            <PopupTitle>
              {popupMessage.includes('❌') ? 'Oops!' : 'Connecting...'}
            </PopupTitle>

            <PopupSubtitle>{popupMessage}</PopupSubtitle>

            {!popupMessage.includes('❌') && !popupMessage.includes('🚀') && (
              <PopupHint>⏳ Hang tight — we're redirecting you securely...</PopupHint>
            )}

            {popupMessage.includes('❌') && (
              <PopupCloseButton onClick={closePopup}>Close</PopupCloseButton>
            )}
          </PopupCard>
        </Overlay>
      )}
    </>
  );
};

export default DerivTrading;