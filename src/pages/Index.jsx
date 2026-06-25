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
// KEYFRAMES - PREMIUM ANIMATIONS
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

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.1); }
  50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.2); }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const slideGlow = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(200%) skewX(-20deg); }
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
  animation: ${breathe} 7s ease-in-out infinite;

  &:nth-child(1) {
    width: 500px;
    height: 500px;
    top: -200px;
    right: -150px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.08), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: -100px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.06), transparent 70%);
    animation-delay: -2.5s;
  }

  &:nth-child(3) {
    width: 300px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(129, 140, 248, 0.04), transparent 70%);
    animation-delay: -5s;
  }

  @media (max-width: 768px) {
    &:nth-child(1) {
      width: 300px;
      height: 300px;
      top: -120px;
      right: -80px;
    }
    &:nth-child(2) {
      width: 250px;
      height: 250px;
      bottom: -80px;
      left: -60px;
    }
    &:nth-child(3) {
      width: 180px;
      height: 180px;
    }
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.4;
`;

const GlowLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, transparent);
  opacity: 0.15;
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
    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.15), transparent);
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
    background: linear-gradient(135deg, #e0f2fe, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .logo-deriv {
    color: #ff444f;
    font-style: italic;
    font-weight: 400;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    .logo-icon { font-size: 1.4rem; }
    .logo-deriv { font-size: 1rem; }
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
  border: 1px solid rgba(34, 197, 94, 0.12);
  padding: 6px 18px 6px 12px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 600;
  color: #4ade80;
  margin-bottom: 24px;
  letter-spacing: 0.3px;
  text-transform: uppercase;

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

  @media (max-width: 480px) {
    font-size: 26px;
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

// ---- Buttons ----
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

// ---- Features ----
const FeaturesSection = styled.section`
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
  margin-bottom: 48px;
  letter-spacing: -0.5px;

  .gradient {
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 32px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  padding: 28px 24px;
  border-radius: 24px;
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
    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(34, 197, 94, 0.08);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }

  .icon {
    font-size: 32px;
    margin-bottom: 14px;
    display: block;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #f1f5f9;
  }

  p {
    font-size: 0.85rem;
    color: #94a3b8;
    line-height: 1.7;
  }

  .feature-number {
    position: absolute;
    bottom: 12px;
    right: 16px;
    font-size: 40px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.02);
    letter-spacing: -4px;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 20px 18px;
    .icon { font-size: 26px; }
    h3 { font-size: 1rem; }
    p { font-size: 0.8rem; }
  }
`;

// ---- Stats ----
const StatsSection = styled.section`
  padding: 60px 0;
  background: rgba(255, 255, 255, 0.01);
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);

  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

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

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
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
    font-size: 2.2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .label {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
    .number { font-size: 1.6rem; }
    .label { font-size: 0.65rem; }
  }
`;

// ---- CTA ----
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
    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent);
  }

  @media (max-width: 768px) {
    padding: 50px 16px;
  }
`;

const CTATitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.5px;

  .gradient {
    background: linear-gradient(135deg, #22c55e, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const CTASub = styled.p`
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 28px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

// ---- Footer ----
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
  text-align: left;

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
    letter-spacing: 0.3px;
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
    font-size: 1.2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0f2fe, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    h4 { font-size: 0.8rem; }
    p, a { font-size: 0.7rem; }
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
        <GlowLine />
      </BackgroundContainer>

      <div className="app-wrapper">
        {/* ===== HEADER ===== */}
        <header>
          <Container>
            <Navbar>
              <Logo to="/">
                <span className="logo-icon">🔷</span>
                <span className="logo-text">Voltix</span>
                <span className="logo-deriv">.deriv</span>
              </Logo>
              <NavLinks>
                <a href="#features">Features</a>
                <a href="#markets">Markets</a>
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
              Live Trading • 99.9% Uptime
            </HeroBadge>
            <HeroTitle>
              Automate Your Trading <br />
              with <span className="gradient-text">Voltix</span>
            </HeroTitle>
            <HeroSubtitle>
              Deploy powerful trading bots, monitor markets in real-time, and grow your strategy —
              all from one premium dashboard.
            </HeroSubtitle>
            <HeroButtons>
              <Button to="/Register" className="primary">
                <span className="btn-shimmer" />
                🚀 Start Trading
              </Button>
              <Button to="/Login" className="secondary">
                🔐 Login
              </Button>
            </HeroButtons>
          </Hero>
        </Container>

        {/* ===== FEATURES ===== */}
        <FeaturesSection id="features">
          <Container>
            <SectionTitle>
              <span className="gradient">Platform Features</span>
            </SectionTitle>
            <FeatureGrid>
              <FeatureCard>
                <span className="icon">🤖</span>
                <h3>Automated Bots</h3>
                <p>24/7 trading bots with custom strategies, backtesting, and real-time optimization.</p>
                <span className="feature-number">01</span>
              </FeatureCard>
              <FeatureCard>
                <span className="icon">📊</span>
                <h3>Live Market Data</h3>
                <p>Real-time charts, order books, and price feeds from top global exchanges.</p>
                <span className="feature-number">02</span>
              </FeatureCard>
              <FeatureCard>
                <span className="icon">🛡️</span>
                <h3>Risk Management</h3>
                <p>Advanced stop-loss, take-profit, and multi-layer portfolio protection tools.</p>
                <span className="feature-number">03</span>
              </FeatureCard>
              <FeatureCard>
                <span className="icon">☁️</span>
                <h3>Cloud Native</h3>
                <p>Run bots securely 24/7 with enterprise-grade infrastructure and 99.99% uptime SLA.</p>
                <span className="feature-number">04</span>
              </FeatureCard>
            </FeatureGrid>
          </Container>
        </FeaturesSection>

        {/* ===== STATS ===== */}
        <StatsSection id="stats">
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
        </StatsSection>

        {/* ===== CTA ===== */}
        <CTASection>
          <Container>
            <CTATitle>
              Start Trading <span className="gradient">Smarter</span> Today
            </CTATitle>
            <CTASub>
              Join thousands of traders using Voltix to automate and grow their portfolios.
            </CTASub>
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
              <div className="footer-logo">🔷 Voltix Traders</div>
              <p>Next-gen trading automation platform for retail and institutional traders.</p>
              <SocialIcons>
                <span>🐦</span>
                <span>📘</span>
                <span>💼</span>
                <span>📸</span>
              </SocialIcons>
            </FooterCol>
            <FooterCol>
              <h4>📊 Markets</h4>
              <a href="#">Forex</a>
              <a href="#">Cryptocurrency</a>
              <a href="#">Synthetic Indices</a>
              <a href="#">Commodities</a>
            </FooterCol>
            <FooterCol>
              <h4>📚 Resources</h4>
              <a href="#">API Docs</a>
              <a href="#">Trading Guides</a>
              <a href="#">Risk Disclosure</a>
              <a href="#">Support</a>
            </FooterCol>
            <FooterCol>
              <h4>⚖️ Legal</h4>
              <p>CFDs and crypto trading involve high risk. 74-89% of retail accounts lose money.</p>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </FooterCol>
          </FooterGrid>
          <FooterBottom>
            <span>{timestamp}</span> • © 2026 Voltix — Automated Trading Platform • Trade responsibly
          </FooterBottom>
        </PremiumFooter>
      </div>
    </>
  );
};

export default Index;