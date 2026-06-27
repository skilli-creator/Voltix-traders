import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    overflow-x: hidden;
    line-height: 1.6;
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
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const shimmer = keyframes`
  0% { background-position: -300% center; }
  100% { background-position: 300% center; }
`;

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(40px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
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

// ============================================
// STYLED COMPONENTS
// ============================================

// ---- Background ----
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
    width: 600px;
    height: 600px;
    top: -250px;
    right: -200px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.06), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 500px;
    height: 500px;
    bottom: -200px;
    left: -150px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.05), transparent 70%);
    animation-delay: -2.5s;
  }

  &:nth-child(3) {
    width: 400px;
    height: 400px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(129, 140, 248, 0.03), transparent 70%);
    animation-delay: -5s;
  }

  @media (max-width: 768px) {
    &:nth-child(1) { width: 300px; height: 300px; top: -120px; right: -80px; }
    &:nth-child(2) { width: 250px; height: 250px; bottom: -80px; left: -60px; }
    &:nth-child(3) { width: 180px; height: 180px; }
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.015) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
`;

// ---- Container ----
const Container = styled.div`
  width: 92%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    width: 95%;
  }
`;

// ---- Navbar ----
const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.08), transparent);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px 0;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.6rem;
  font-weight: 800;
  text-decoration: none;
  letter-spacing: -0.5px;

  .logo-icon {
    font-size: 1.8rem;
  }

  .logo-text {
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .logo-traders {
    font-weight: 300;
    color: #94a3b8;
    font-size: 1.2rem;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    position: relative;
    margin-left: 4px;

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite;
    }

    &::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite 0.5s;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    .logo-icon { font-size: 1.4rem; }
    .logo-traders { font-size: 1rem; }
    .live-dot { width: 6px; height: 6px; }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #22c55e, #38bdf8);
      transition: width 0.3s ease;
    }

    &:hover {
      color: #f1f5f9;
    }

    &:hover::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    a { font-size: 0.75rem; }
  }
`;

// ---- Hero ----
const Hero = styled.section`
  text-align: center;
  padding: 80px 20px 60px;
  animation: ${fadeSlideUp} 0.8s ease;

  @media (max-width: 768px) {
    padding: 50px 12px 40px;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.1);
  padding: 6px 18px 6px 12px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 600;
  color: #4ade80;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 4px 12px 4px 8px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 62px;
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 20px;
  letter-spacing: -2px;

  .gradient-text {
    background: linear-gradient(135deg, #22c55e, #38bdf8, #818cf8);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ${shimmer} 6s ease-in-out infinite;
  }

  @media (max-width: 1024px) {
    font-size: 48px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
    letter-spacing: -1px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 32px;
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  cursor: pointer;
  border: none;
  position: relative;
  overflow: hidden;

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

  &.primary {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #0a0f1f;
    box-shadow: 0 4px 24px rgba(34, 197, 94, 0.15);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 36px rgba(34, 197, 94, 0.25);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: #f1f5f9;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.8rem;
  }
`;

// ============================================
// PLATFORM SHOWCASE WITH PREMIUM IMAGES
// ============================================
const PlatformsSection = styled.section`
  padding: 60px 0;
  position: relative;

  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.5px;

  .gradient {
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const SectionSub = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 28px;
  }
`;

const PlatformGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 100%;
  }
`;

const PlatformCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;

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
    z-index: 1;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(34, 197, 94, 0.08);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }

  .platform-image-wrapper {
    position: relative;
    overflow: hidden;
    height: 200px;
  }

  .platform-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }

  .platform-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(5, 10, 24, 0.8) 100%);
    pointer-events: none;
  }

  &:hover .platform-image {
    transform: scale(1.05);
  }

  .platform-content {
    padding: 24px 20px 20px;
  }

  .platform-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .platform-icon {
    font-size: 32px;
  }

  .platform-badge {
    font-size: 0.6rem;
    padding: 2px 10px;
    border-radius: 20px;
    background: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.1);
    color: #4ade80;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .platform-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 4px;
  }

  .platform-desc {
    font-size: 0.85rem;
    color: #94a3b8;
    line-height: 1.7;
    margin-bottom: 14px;
  }

  .platform-features {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .feature-tag {
    font-size: 0.65rem;
    padding: 3px 10px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.04);
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    .platform-image-wrapper { height: 160px; }
    .platform-content { padding: 16px 16px 14px; }
    .platform-name { font-size: 1rem; }
    .platform-desc { font-size: 0.8rem; }
    .platform-icon { font-size: 26px; }
  }
`;

// ============================================
// FEATURES SECTION
// ============================================
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  padding: 28px 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.4s ease;
  text-align: left;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(34, 197, 94, 0.06);
    background: rgba(255, 255, 255, 0.04);
  }

  .icon {
    font-size: 28px;
    margin-bottom: 12px;
    display: block;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 6px;
    color: #f1f5f9;
  }

  p {
    font-size: 0.8rem;
    color: #94a3b8;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

// ============================================
// HOW IT WORKS
// ============================================
const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const StepCard = styled.div`
  text-align: center;
  padding: 24px;

  .step-number {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    color: #0a0f1f;
    margin: 0 auto 14px;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 6px;
    color: #f1f5f9;
  }

  p {
    font-size: 0.85rem;
    color: #94a3b8;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    padding: 16px;
    .step-number { width: 40px; height: 40px; font-size: 15px; }
    h3 { font-size: 1rem; }
    p { font-size: 0.8rem; }
  }
`;

// ============================================
// STATS
// ============================================
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(34, 197, 94, 0.06);
    transform: translateY(-2px);
  }

  .number {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .label {
    font-size: 0.7rem;
    color: #94a3b8;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
    .number { font-size: 1.4rem; }
    .label { font-size: 0.6rem; }
  }
`;

// ============================================
// CTA
// ============================================
const CTASection = styled.section`
  padding: 80px 20px;
  text-align: center;
  background: linear-gradient(180deg, transparent, rgba(34, 197, 94, 0.02), transparent);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.08), transparent);
  }

  @media (max-width: 768px) {
    padding: 50px 16px;
  }
`;

// ============================================
// FOOTER
// ============================================
const PremiumFooter = styled.footer`
  background: rgba(3, 7, 18, 0.9);
  backdrop-filter: blur(20px);
  padding: 48px 32px 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.02);

  @media (max-width: 768px) {
    padding: 32px 16px 20px;
  }
`;

const FooterGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
`;

const FooterCol = styled.div`
  h4 {
    color: #f1f5f9;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 16px;
  }

  p, a {
    font-size: 0.8rem;
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
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .footer-logo-text {
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .footer-dot {
    width: 6px;
    height: 6px;
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

  @media (max-width: 480px) {
    h4 { font-size: 0.8rem; }
    p, a { font-size: 0.7rem; }
    .footer-logo { justify-content: center; }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 12px;

  @media (max-width: 480px) {
    justify-content: center;
  }

  span {
    font-size: 18px;
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
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  font-size: 0.7rem;
  color: #4b5563;

  span {
    color: #22c55e;
  }

  @media (max-width: 768px) {
    font-size: 0.6rem;
    margin-top: 24px;
    padding-top: 16px;
  }
`;

// ============================================
// PREMIUM TRADING IMAGES
// ============================================
const IMAGES = {
  deriv: 'https://images.unsplash.com/photo-1642104704073-2ce4af2da869?w=800&h=400&fit=crop&crop=center',
  forex: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&crop=center',
  hero: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop&crop=center',
  trading: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&crop=center',
  finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&crop=center',
};

// ============================================
// MAIN COMPONENT
// ============================================

const Index = () => {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      setTimestamp(`🕒 ${now.toUTCString().slice(5, 25)} UTC`);
    };
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <GlobalStyle />

      <BackgroundContainer>
        <GradientOrb />
        <GradientOrb />
        <GradientOrb />
        <GridOverlay />
      </BackgroundContainer>

      <div className="app-wrapper">
        {/* ===== HEADER ===== */}
        <header>
          <Container>
            <Navbar>
              <Logo to="/">
                <span className="logo-icon">🔷</span>
                <span className="logo-text">Voltix</span>
                <span className="logo-traders">Traders</span>
                <span className="live-dot" />
              </Logo>
              <NavLinks>
                <a href="#platforms">Platforms</a>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#stats">Stats</a>
                <Link to="/login">Login</Link>
              </NavLinks>
            </Navbar>
          </Container>
        </header>

        {/* ===== HERO ===== */}
        <Container>
          <Hero>
            <HeroBadge>
              <span className="live-dot" />
              Multi-Platform Trading • 99.9% Uptime
            </HeroBadge>
            <HeroTitle>
              Trade <span className="gradient-text">Deriv</span> and <br />
              <span className="gradient-text">Forex</span> All-in-One
            </HeroTitle>
            <HeroSubtitle>
              The ultimate trading automation platform. Deploy AI-powered strategies across
              Deriv and Forex markets from a single premium dashboard.
            </HeroSubtitle>
            <HeroButtons>
              <Button to="/Register" className="primary">
                <span className="btn-shimmer" />
                🚀 Start Trading Free
              </Button>
              <Button to="/Login" className="secondary">
                🔐 Login
              </Button>
            </HeroButtons>
          </Hero>
        </Container>

        {/* ===== PLATFORMS ===== */}
        <PlatformsSection id="platforms">
          <Container>
            <SectionTitle>
              <span className="gradient">Supported Platforms</span>
            </SectionTitle>
            <SectionSub>Connect and trade on the world's leading financial markets</SectionSub>
            <PlatformGrid>
              {/* Deriv */}
              <PlatformCard color="linear-gradient(90deg, #a855f7, #7c3aed)">
                <div className="platform-image-wrapper">
                  <img
                    src={IMAGES.deriv}
                    alt="Deriv Trading Platform"
                    className="platform-image"
                    loading="lazy"
                  />
                  <div className="platform-image-overlay" />
                </div>
                <div className="platform-content">
                  <div className="platform-header">
                    <span className="platform-icon">📊</span>
                    <span className="platform-badge">Synthetic Indices</span>
                  </div>
                  <div className="platform-name">Deriv</div>
                  <div className="platform-desc">
                    Trade synthetic indices, forex, and cryptocurrencies with low spreads and
                    high leverage on Deriv's award-winning platform.
                  </div>
                  <div className="platform-features">
                    <span className="feature-tag">Synthetic Indices</span>
                    <span className="feature-tag">Forex</span>
                    <span className="feature-tag">Options</span>
                    <span className="feature-tag">High Leverage</span>
                  </div>
                </div>
              </PlatformCard>

              {/* Forex */}
              <PlatformCard color="linear-gradient(90deg, #2563eb, #1d4ed8)">
                <div className="platform-image-wrapper">
                  <img
                    src={IMAGES.forex}
                    alt="Forex Trading"
                    className="platform-image"
                    loading="lazy"
                  />
                  <div className="platform-image-overlay" />
                </div>
                <div className="platform-content">
                  <div className="platform-header">
                    <span className="platform-icon">💱</span>
                    <span className="platform-badge">Currency Trading</span>
                  </div>
                  <div className="platform-name">Forex</div>
                  <div className="platform-desc">
                    Trade major, minor, and exotic currency pairs with institutional-grade
                    execution and real-time market analysis.
                  </div>
                  <div className="platform-features">
                    <span className="feature-tag">Major Pairs</span>
                    <span className="feature-tag">Exotic Pairs</span>
                    <span className="feature-tag">Low Spreads</span>
                    <span className="feature-tag">24/5 Trading</span>
                  </div>
                </div>
              </PlatformCard>
            </PlatformGrid>
          </Container>
        </PlatformsSection>

        {/* ===== FEATURES ===== */}
        <section id="features" style={{ padding: '60px 0' }}>
          <Container>
            <SectionTitle>
              <span className="gradient">Powerful Features</span>
            </SectionTitle>
            <SectionSub>Everything you need to trade smarter and faster</SectionSub>
            <FeaturesGrid>
              <FeatureCard>
                <span className="icon">🤖</span>
                <h3>AI Trading Bots</h3>
                <p>Deploy automated strategies with machine learning and advanced backtesting.</p>
              </FeatureCard>
              <FeatureCard>
                <span className="icon">📊</span>
                <h3>Multi-Market Data</h3>
                <p>Real-time prices, charts, and order books from all connected exchanges.</p>
              </FeatureCard>
              <FeatureCard>
                <span className="icon">🛡️</span>
                <h3>Risk Management</h3>
                <p>Advanced stop-loss, take-profit, and dynamic position sizing tools.</p>
              </FeatureCard>
              <FeatureCard>
                <span className="icon">⚡</span>
                <h3>Lightning Execution</h3>
                <p>Ultra-low latency order execution with institutional-grade infrastructure.</p>
              </FeatureCard>
              <FeatureCard>
                <span className="icon">📈</span>
                <h3>Advanced Analytics</h3>
                <p>Real-time portfolio tracking, performance metrics, and trade history.</p>
              </FeatureCard>
              <FeatureCard>
                <span className="icon">🔐</span>
                <h3>Bank-Grade Security</h3>
                <p>256-bit encryption, MPC custody, and enterprise-level protection.</p>
              </FeatureCard>
            </FeaturesGrid>
          </Container>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" style={{ padding: '60px 0', background: 'rgba(255,255,255,0.005)' }}>
          <Container>
            <SectionTitle>
              <span className="gradient">How It Works</span>
            </SectionTitle>
            <SectionSub>Get started in three simple steps</SectionSub>
            <StepsGrid>
              <StepCard>
                <div className="step-number">1</div>
                <h3>Create Account</h3>
                <p>Sign up and access your trading dashboard instantly. No credit card required.</p>
              </StepCard>
              <StepCard>
                <div className="step-number">2</div>
                <h3>Connect Exchange</h3>
                <p>Link your Deriv or Forex accounts via secure API connection.</p>
              </StepCard>
              <StepCard>
                <div className="step-number">3</div>
                <h3>Start Trading</h3>
                <p>Deploy AI bots, monitor markets, and grow your portfolio in real-time.</p>
              </StepCard>
            </StepsGrid>
          </Container>
        </section>

        {/* ===== STATS ===== */}
        <section id="stats" style={{ padding: '60px 0' }}>
          <Container>
            <SectionTitle>
              <span className="gradient">Platform Growth</span>
            </SectionTitle>
            <StatsGrid>
              <StatCard>
                <div className="number">10K+</div>
                <div className="label">Active Traders</div>
              </StatCard>
              <StatCard>
                <div className="number">$2M+</div>
                <div className="label">Trades Executed</div>
              </StatCard>
              <StatCard>
                <div className="number">99.99%</div>
                <div className="label">Uptime</div>
              </StatCard>
              <StatCard>
                <div className="number">24/7</div>
                <div className="label">Support</div>
              </StatCard>
            </StatsGrid>
          </Container>
        </section>

        {/* ===== CTA ===== */}
        <CTASection>
          <Container>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '12px' }}>
              Ready to <span style={{ color: '#22c55e' }}>Trade Smarter</span>?
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '28px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              Join thousands of traders using Voltix to automate and grow across all markets.
            </p>
            <Button to="/Register" className="primary">
              <span className="btn-shimmer" />
              Create Free Account →
            </Button>
          </Container>
        </CTASection>

        {/* ===== FOOTER ===== */}
        <PremiumFooter>
          <FooterGrid>
            <FooterCol>
              <div className="footer-logo">
                <span>🔷</span>
                <span className="footer-logo-text">Voltix Traders</span>
                <span className="footer-dot" />
              </div>
              <p>The ultimate multi-platform trading automation platform.</p>
              <SocialIcons>
                <span>🐦</span>
                <span>📘</span>
                <span>💼</span>
                <span>📸</span>
              </SocialIcons>
            </FooterCol>
            <FooterCol>
              <h4>📊 Platforms</h4>
              <a href="#">Deriv</a>
              <a href="#">Forex</a>
            </FooterCol>
            <FooterCol>
              <h4>📚 Resources</h4>
              <a href="#">API Docs</a>
              <a href="#">Trading Guides</a>
              <a href="#">Support</a>
            </FooterCol>
            <FooterCol>
              <h4>⚖️ Legal</h4>
              <p>High risk trading. 74-89% of retail accounts lose money.</p>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
            </FooterCol>
          </FooterGrid>
          <FooterBottom>
            <span>{timestamp}</span> • © 2026 Voltix Traders • Trade responsibly
          </FooterBottom>
        </PremiumFooter>
      </div>
    </>
  );
};

export default Index;