import React, { useState, useEffect } from 'react';
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
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
  0%, 100% { opacity: 0.08; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(1.05); }
`;

const slideGlow = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(200%) skewX(-20deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.08); }
  50% { box-shadow: 0 0 50px rgba(34, 197, 94, 0.2); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmerBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const cosmicFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-6px) rotate(0.5deg); }
  75% { transform: translateY(6px) rotate(-0.5deg); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.5); }
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
  filter: blur(120px);
  animation: ${breathe} 10s ease-in-out infinite;

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
    &:nth-child(1) { width: 300px; height: 300px; top: -120px; right: -80px; filter: blur(80px); }
    &:nth-child(2) { width: 250px; height: 250px; bottom: -80px; left: -60px; filter: blur(80px); }
    &:nth-child(3) { width: 180px; height: 180px; filter: blur(60px); }
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

  @media (max-width: 768px) {
    background-size: 30px 30px;
    opacity: 0.3;
  }
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
  padding: 20px 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.06), transparent);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 14px;
    padding: 14px 0;
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
    color: #38bdf8;
  }

  .logo-text {
    background: linear-gradient(135deg, #38bdf8, #818cf8);
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

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const NavButton = styled(Link)`
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &.login {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: #94a3b8;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
      color: #f1f5f9;
      transform: translateY(-2px);
    }
  }

  &.register {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #0a0f1f;
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(34, 197, 94, 0.2);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    padding: 6px 14px;
    font-size: 0.75rem;
  }
`;

// ---- Hero ----
const Hero = styled.section`
  text-align: center;
  padding: 100px 20px 60px;
  animation: ${fadeSlideUp} 0.8s ease;

  @media (max-width: 768px) {
    padding: 50px 12px 30px;
  }

  @media (max-width: 480px) {
    padding: 30px 12px 20px;
  }
`;

const HeroBadge = styled.div`
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
  margin-bottom: 28px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 9px;
    padding: 4px 12px 4px 8px;
    gap: 4px;
    margin-bottom: 20px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 72px;
  font-weight: 800;
  line-height: 1.02;
  margin-bottom: 16px;
  letter-spacing: -2.5px;

  .gradient-text {
    background: linear-gradient(135deg, #22c55e, #38bdf8, #818cf8);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ${shimmer} 6s ease-in-out infinite;
  }

  @media (max-width: 1024px) {
    font-size: 52px;
  }

  @media (max-width: 768px) {
    font-size: 36px;
    letter-spacing: -1px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #94a3b8;
  max-width: 520px;
  margin: 0 auto 36px;
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    max-width: 100%;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 36px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 1rem;
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
    box-shadow: 0 4px 30px rgba(34, 197, 94, 0.15);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(34, 197, 94, 0.3);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: #f1f5f9;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 10px 18px;
    font-size: 0.8rem;
  }
`;

// ============================================
// FEATURES - Minimal
// ============================================
const FeaturesSection = styled.section`
  padding: 40px 0 60px;

  @media (max-width: 768px) {
    padding: 20px 0 40px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  padding: 24px 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.4s ease;
  text-align: center;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(56, 189, 248, 0.06);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.3);
  }

  .feature-icon {
    font-size: 2.4rem;
    display: block;
    margin-bottom: 10px;
  }

  .feature-name {
    font-size: 1rem;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 4px;
  }

  .feature-desc {
    font-size: 0.8rem;
    color: #94a3b8;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 18px 16px;
    .feature-icon { font-size: 1.8rem; }
    .feature-name { font-size: 0.9rem; }
    .feature-desc { font-size: 0.75rem; }
  }
`;

// ============================================
// CTA - Minimal
// ============================================
const CTASection = styled.section`
  padding: 40px 20px 80px;
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 25%;
    right: 25%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.06), transparent);
  }

  @media (max-width: 768px) {
    padding: 20px 16px 50px;
    &::before {
      left: 10%;
      right: 10%;
    }
  }
`;

const CTATitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -1px;

  .highlight {
    background: linear-gradient(135deg, #22c55e, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const CTASub = styled.p`
  color: #94a3b8;
  max-width: 460px;
  margin: 0 auto 32px;
  font-size: 1.05rem;
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

// ============================================
// ORIGINAL FOOTER
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

  .footer-logo-icon {
    font-size: 1.4rem;
    color: #38bdf8;
  }

  .footer-logo-text {
    background: linear-gradient(135deg, #38bdf8, #818cf8);
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

  .footer-tagline {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-top: 2px;
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
                <span className="logo-icon">◆</span>
                <span className="logo-text">Voltix</span>
                <span className="logo-traders">Traders</span>
                <span className="live-dot" />
              </Logo>
              <NavActions>
                <NavButton to="/Login" className="login">Login</NavButton>
                <NavButton to="/Register" className="register">Register</NavButton>
              </NavActions>
            </Navbar>
          </Container>
        </header>

        {/* ===== HERO ===== */}
        <Container>
          <Hero>
            <HeroBadge>
              <span className="live-dot" />
              Multi-Platform Trading
            </HeroBadge>
            <HeroTitle>
              Trade <span className="gradient-text">Smarter</span>
              <br />
              Across <span className="gradient-text">All Markets</span>
            </HeroTitle>
            <HeroSubtitle>
              Connect your accounts and deploy AI-powered strategies across Deriv and Forex markets.
            </HeroSubtitle>
            <HeroButtons>
              <HeroButton to="/Register" className="primary">
                <span className="btn-shimmer" />
                Get Started Free
              </HeroButton>
              <HeroButton to="/Login" className="secondary">
                Sign In
              </HeroButton>
            </HeroButtons>
          </Hero>
        </Container>

        {/* ===== FEATURES ===== */}
        <FeaturesSection>
          <Container>
            <FeaturesGrid>
              <FeatureCard>
                <span className="feature-icon">🤖</span>
                <div className="feature-name">AI-Powered</div>
                <div className="feature-desc">Automated trading strategies</div>
              </FeatureCard>
              <FeatureCard>
                <span className="feature-icon">📊</span>
                <div className="feature-name">Real-Time Data</div>
                <div className="feature-desc">Live market analytics</div>
              </FeatureCard>
              <FeatureCard>
                <span className="feature-icon">🔐</span>
                <div className="feature-name">Secure</div>
                <div className="feature-desc">Bank-grade encryption</div>
              </FeatureCard>
            </FeaturesGrid>
          </Container>
        </FeaturesSection>

        {/* ===== CTA ===== */}
        <CTASection>
          <Container>
            <CTATitle>
              Ready to <span className="highlight">Trade Smarter</span>?
            </CTATitle>
            <CTASub>
              Join thousands of traders using Voltix to automate and grow across all markets.
            </CTASub>
            <HeroButton to="/Register" className="primary">
              <span className="btn-shimmer" />
              Create Free Account
            </HeroButton>
          </Container>
        </CTASection>

        {/* ===== ORIGINAL FOOTER ===== */}
        <PremiumFooter>
          <FooterGrid>
            <FooterCol>
              <div className="footer-logo">
                <span className="footer-logo-icon">◆</span>
                <span className="footer-logo-text">Voltix Traders</span>
                <span className="footer-dot" />
              </div>
              <p className="footer-tagline">Next-gen multi-market execution engine</p>
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
      </div>
    </>
  );
};

export default Index;