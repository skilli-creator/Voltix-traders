import React, { useState, useEffect, useRef } from 'react';
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
    background: linear-gradient(180deg, #f7931a, #e68a00);
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
  0%, 100% { box-shadow: 0 0 20px rgba(247, 147, 26, 0.08); }
  50% { box-shadow: 0 0 50px rgba(247, 147, 26, 0.2); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-12px) scale(1.02); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmerBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const countUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
    background: radial-gradient(circle, rgba(247, 147, 26, 0.05), transparent 70%);
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
  background: linear-gradient(90deg, transparent, #f7931a, #e68a00, transparent);
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
    filter: drop-shadow(0 0 12px rgba(247, 147, 26, 0.1));
  }

  .logo-text {
    font-size: 1.4rem;
    font-weight: 800;
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .logo-suffix {
    font-size: 1rem;
    font-weight: 400;
    color: #4b5563;
    margin-left: 4px;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f7931a;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: #f7931a;
      animation: ${pulseRing} 2s ease-out infinite;
    }

    &::after {
      content: '';
      position: absolute;
      inset: -7px;
      border-radius: 50%;
      background: #f7931a;
      animation: ${pulseRing} 2s ease-out infinite 0.5s;
    }
  }

  @media (max-width: 768px) {
    .logo-text { font-size: 1.2rem; }
    .logo-icon { font-size: 1.3rem; }
    .live-dot { width: 6px; height: 6px; }
    .logo-suffix { font-size: 0.8rem; }
  }
`;

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(247, 147, 26, 0.06);
  border: 1px solid rgba(247, 147, 26, 0.1);
  border-radius: 30px;
  font-size: 11px;
  color: #f7931a;
  font-weight: 500;

  .badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #f7931a;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 4px 12px;
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
    border-color: rgba(247, 147, 26, 0.2);
    color: #f1f5f9;
    transform: translateX(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 12px;
  }
};

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
  background: rgba(247, 147, 26, 0.04);
  border: 1px solid rgba(247, 147, 26, 0.06);
  padding: 6px 18px 6px 12px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 600;
  color: #f7931a;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .live-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #f7931a;
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
    background: linear-gradient(135deg, #f7931a, #e68a00, #f0b90b);
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
    background: linear-gradient(90deg, transparent, #f7931a, #e68a00, transparent);
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
      rgba(247, 147, 26, 0.02),
      transparent,
      rgba(230, 138, 0, 0.02),
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
// COMING SOON BUTTON
// ============================================
const ComingSoonButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  border-radius: 32px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: not-allowed;
  border: 1px solid rgba(255, 255, 255, 0.04);
  position: relative;
  overflow: hidden;

  .btn-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.02), transparent);
    animation: ${slideGlow} 4s ease-in-out infinite;
    z-index: 1;
  }

  .btn-content {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 2;
  }

  .coming-soon-tag {
    font-size: 0.6rem;
    padding: 2px 10px;
    border-radius: 20px;
    background: rgba(247, 147, 26, 0.06);
    border: 1px solid rgba(247, 147, 26, 0.06);
    color: #f7931a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 0.85rem;
  }
`;

const AccountSignup = styled.div`
  margin-top: 16px;
  font-size: 13px;
  color: #94a3b8;
  text-align: center;

  a {
    color: #f7931a;
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
      background: linear-gradient(90deg, #f7931a, #e68a00);
      transition: width 0.3s ease;
    }

    &:hover {
      color: #f0b90b;
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
// CRYPTO STATS
// ============================================
const CryptoStats = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 16px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  margin-top: 32px;
  animation: ${floatIn} 0.8s ease;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    padding: 12px 16px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 10px 12px;
  }
`;

const StatItem = styled.div`
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

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f1f5f9, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${countUp} 0.6s ease;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

// ============================================
// SENTIMENT BOX
// ============================================
const SentimentBox = styled.div`
  margin-top: 16px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  display: inline-block;
  font-size: 0.8rem;
  color: #94a3b8;
  transition: opacity 0.3s ease;
  animation: ${floatIn} 0.9s ease;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 8px 14px;
    display: block;
    text-align: center;
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
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(247, 147, 26, 0.06), transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: rgba(247, 147, 26, 0.04);
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

// ============================================
// FOOTER
// ============================================
const PremiumFooter = styled.footer`
  margin-top: 60px;
  background: rgba(3, 7, 18, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  padding: 40px 32px 24px;
  border-radius: 32px 32px 0 0;

  @media (max-width: 768px) {
    padding: 28px 16px 18px;
    margin-top: 40px;
    border-radius: 20px 20px 0 0;
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
    color: #f7931a;
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
    background: #f7931a;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: #f7931a;
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
      color: #f7931a;
      transform: translateY(-3px);
    }
  }
`;

const RiskWarning = styled.div`
  text-align: center;
  margin-top: 24px;
  padding: 12px 20px;
  background: rgba(239, 68, 68, 0.03);
  border: 1px solid rgba(239, 68, 68, 0.04);
  border-radius: 16px;
  font-size: 0.65rem;
  color: #4b5563;
  line-height: 1.6;

  strong {
    color: #f87171;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 0.55rem;
    padding: 10px 14px;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  font-size: 0.65rem;
  color: #4b5563;

  span {
    color: #f7931a;
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

const Binancehome = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState({
    btc: 67432,
    eth: 3521,
    bnb: 598,
    volume: 48.2
  });
  const [sentiment, setSentiment] = useState('📊 AI Market Sentiment: 🟢 Bullish on Bitcoin, Neutral on Altcoins');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const sentimentRef = useRef(null);

  const sentiments = [
    "📊 AI Sentiment: Strong buy signal on ETH/BTC pair",
    "🔮 Short-term volatility expected – hedge mode active",
    "💡 Whale accumulation detected on BNB chain",
    "🔵 High confidence: Layer 2 tokens showing strength",
    "📈 Bullish divergence detected on BTC dominance",
    "🔴 Bearish signal: Altcoin season cooling off"
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    const priceInterval = setInterval(() => {
      setPrices(prev => {
        let { btc, eth, bnb, volume } = prev;
        btc += (Math.random() - 0.5) * 85;
        eth += (Math.random() - 0.5) * 18;
        bnb += (Math.random() - 0.5) * 4.2;
        volume += (Math.random() - 0.5) * 0.7;
        btc = Math.max(59000, Math.min(78000, btc));
        eth = Math.max(3100, Math.min(4300, eth));
        bnb = Math.max(510, Math.min(690, bnb));
        volume = Math.max(38, Math.min(68, volume));
        return { btc, eth, bnb, volume };
      });
    }, 4200);
    return () => clearInterval(priceInterval);
  }, []);

  useEffect(() => {
    const sentimentInterval = setInterval(() => {
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      setSentiment(`🧠 ${randomSentiment}`);
    }, 13000);
    return () => clearInterval(sentimentInterval);
  }, []);

  const handleCardClick = (title) => {
    alert(`🔍 ${title}: This feature will be available when Binance integration is fully released.`);
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
          <span className="logo-suffix">.Binance</span>
          <span className="live-dot" />
        </Logo>
        <LiveBadge>
          <span className="badge-dot" />
          🔥 AI Live • 24/7 Markets
        </LiveBadge>
        <BackButton to="/marketsdash">← Back</BackButton>
      </Topbar>

      <Container>
        <BadgeGlow>
          <span className="live-dot" />
          🤖 Binance Smart AI • Real-time signals
        </BadgeGlow>

        <Title>
          Trade Crypto with <span className="gradient-text">AI Precision</span>
        </Title>

        <Subtitle>
          Voltix delivers institutional-grade Binance execution, multi-asset AI scanning,
          and low-latency order routing — all in one dashboard.
        </Subtitle>

        <ConnectPanel>
          <SectionTitle>
            <span className="icon">🟠</span> Connect Your Binance Account
          </SectionTitle>
          <SectionSubtitle>
            Securely connect your Binance account via OAuth 2.0
          </SectionSubtitle>

          <ComingSoonButton disabled>
            <div className="btn-shimmer" />
            <span className="btn-content">
              🔗 Connect Binance Account
              <span className="coming-soon-tag">Coming Soon</span>
            </span>
          </ComingSoonButton>

          <AccountSignup>
            🚀 New to crypto?{' '}
            <a href="https://www.binance.com/en" target="_blank" rel="noopener noreferrer">
              Open a Binance account →
            </a>
          </AccountSignup>
        </ConnectPanel>

        <CryptoStats>
          <StatItem>
            <StatLabel>BTC/USDT</StatLabel>
            <StatValue>${prices.btc.toFixed(0)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>ETH/USDT</StatLabel>
            <StatValue>${prices.eth.toFixed(0)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>BNB/USDT</StatLabel>
            <StatValue>${prices.bnb.toFixed(0)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>24h Volume</StatLabel>
            <StatValue>${prices.volume.toFixed(1)}B</StatValue>
          </StatItem>
        </CryptoStats>

        <SentimentBox ref={sentimentRef}>
          {sentiment}
        </SentimentBox>

        <Cards>
          <Card onClick={() => handleCardClick('Smart Order Router')}>
            <span className="card-icon">🧠</span>
            <h3 className="card-title">Smart Order Router</h3>
            <p className="card-desc">AI finds best liquidity across spot, futures & margin — minimal slippage.</p>
            <span className="card-number">01</span>
          </Card>

          <Card onClick={() => handleCardClick('On-chain Alpha')}>
            <span className="card-icon">📡</span>
            <h3 className="card-title">On-chain Alpha</h3>
            <p className="card-desc">Real-time whale alerts + sentiment analysis for BTC, ETH, altcoins.</p>
            <span className="card-number">02</span>
          </Card>

          <Card onClick={() => handleCardClick('Binance API Connect')}>
            <span className="card-icon">🔐</span>
            <h3 className="card-title">Binance API Connect</h3>
            <p className="card-desc">Secure OAuth & API key integration, encrypted & read-only by default.</p>
            <span className="card-number">03</span>
          </Card>
        </Cards>
      </Container>

      <PremiumFooter>
        <FooterGrid>
          <FooterCol>
            <div className="footer-logo">
              <span>🔷</span>
              <span className="footer-logo-text">Voltix Traders</span>
              <span className="footer-dot" />
            </div>
            <p>AI-driven Binance automation suite</p>
            <p>Smart scalping • Grid trading • DCA bots</p>
            <SocialIcons>
              <span>🐦</span>
              <span>📘</span>
              <span>📸</span>
              <span>💬</span>
            </SocialIcons>
          </FooterCol>
          <FooterCol>
            <h4>📈 Crypto Market</h4>
            <p>Top Gainers: SOL +12% | AVAX +8%</p>
            <p>Fear & Greed Index: 64 (Greed)</p>
            <p>BTC Dominance: 52.3%</p>
            <p>Next halving countdown: 310 days</p>
          </FooterCol>
          <FooterCol>
            <h4>📚 Resources</h4>
            <a href="#">Binance API Guide</a>
            <a href="#">AI Trading Strategies</a>
            <a href="#">Risk management</a>
            <a href="#">Support & Docs</a>
          </FooterCol>
          <FooterCol>
            <h4>⚖️ Legal</h4>
            <p>Cryptocurrency trading involves high risk.</p>
            <p>Only invest what you can afford to lose.</p>
            <a href="#">Terms of service</a>
            <a href="#">Privacy policy</a>
          </FooterCol>
        </FooterGrid>

        <RiskWarning>
          <strong>🚨 HIGH-RISK WARNING:</strong> Trading digital assets carries substantial risk.
          Past performance does not guarantee future results. AI signals are for informational
          purposes only. Always DYOR.
        </RiskWarning>

        <FooterBottom>
          <span>🕒 Live</span> • © 2026 Voltix Traders • Trade responsibly
        </FooterBottom>
      </PremiumFooter>
    </>
  );
};

export default Binancehome;