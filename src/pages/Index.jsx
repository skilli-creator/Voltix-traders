import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// ============================================
// GLOBAL STYLES (applied to body)
// ============================================
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', 'Poppins', sans-serif;
    background: #0a0f1f;
    color: #f1f5f9;
    overflow-x: hidden;
    line-height: 1.5;
  }
`;

// ============================================
// KEYFRAMES
// ============================================
const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

// Background gradient (replaces body::before)
const BackgroundGradient = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.08), transparent 70%),
              radial-gradient(circle at 80% 70%, rgba(56, 189, 248, 0.08), transparent 70%);
  pointer-events: none;
  z-index: 0;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid rgba(34, 197, 94, 0.2);
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #22c55e, #38bdf8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;

  a {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: 0.2s;

    &:hover {
      color: #22c55e;
    }
  }
`;

const Hero = styled.section`
  text-align: center;
  padding: 100px 20px 80px;
  animation: ${fadeSlideUp} 0.8s ease;
`;

const HeroBadge = styled.div`
  display: inline-block;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  padding: 6px 18px;
  border-radius: 60px;
  font-size: 13px;
  font-weight: 500;
  color: #22c55e;
  margin-bottom: 28px;
`;

const HeroTitle = styled.h1`
  font-size: 64px;
  font-weight: 800;
  background: linear-gradient(125deg, #ffffff, #22c55e, #38bdf8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 20px;
  letter-spacing: -1.2px;

  @media (max-width: 768px) {
    font-size: 42px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #9ca3cf;
  max-width: 700px;
  margin: 0 auto 36px;
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

// ===== BUTTONS =====
const Button = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  text-decoration: none;
  cursor: pointer;
  border: none;

  &.primary {
    background: linear-gradient(105deg, #22c55e, #16a34a);
    color: #0a0f1f;
    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 28px rgba(34, 197, 94, 0.45);
      background: linear-gradient(105deg, #2dd4bf, #22c55e);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    backdrop-filter: blur(4px);

    &:hover {
      background: rgba(34, 197, 94, 0.2);
      border-color: #22c55e;
      transform: translateY(-2px);
    }
  }

  &.outline-light {
    background: transparent;
    border: 1px solid #22c55e;
    color: #22c55e;

    &:hover {
      background: #22c55e;
      color: #0a0f1f;
    }
  }

  &.white-bg {
    background: white;
    color: #0a0f1f;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 28px rgba(34, 197, 94, 0.45);
    }
  }
`;

// ===== FEATURES =====
const FeaturesSection = styled.section`
  padding: 80px 0;
  background: rgba(2, 6, 23, 0.5);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 56px;
  background: linear-gradient(135deg, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 32px;
`;

const FeatureCard = styled.div`
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  padding: 32px 24px;
  border-radius: 28px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    border-color: #22c55e;
    background: rgba(20, 35, 55, 0.85);
    box-shadow: 0 20px 35px -12px rgba(34, 197, 94, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 42px;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 12px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #9ca3af;
  line-height: 1.5;
`;

// ===== STEPS =====
const StepsSection = styled.section`
  padding: 80px 0;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 40px;
  margin-top: 40px;
`;

const StepItem = styled.div`
  text-align: center;
  padding: 24px;
`;

const StepNumber = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  margin: 0 auto 20px;
  color: #0a0f1f;
`;

// ===== MARKET PREVIEW =====
const MarketPreview = styled.section`
  padding: 80px 0;
  background: linear-gradient(0deg, #020617, #0a0f1f);
`;

const MarketShowcase = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;

  img {
    width: 100%;
    border-radius: 28px;
    box-shadow: 0 25px 45px -12px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(34, 197, 94, 0.3);
    transition: 0.3s;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

// ===== STATS =====
const StatsSection = styled.section`
  padding: 80px 0;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 64px;
  flex-wrap: wrap;
  margin-top: 40px;

  @media (max-width: 768px) {
    gap: 32px;
  }
`;

const StatCard = styled.div`
  h2 {
    font-size: 48px;
    font-weight: 800;
    color: #22c55e;
  }
`;

// ===== CTA =====
const CTASection = styled.section`
  padding: 100px 20px;
  text-align: center;
  background: linear-gradient(135deg, #0b1a2e, #051220);
  border-top: 1px solid rgba(34, 197, 94, 0.2);
  border-bottom: 1px solid rgba(34, 197, 94, 0.2);
`;

// ===== FOOTER =====
const PremiumFooter = styled.footer`
  background: #030712;
  padding: 56px 32px 32px;
  border-top: 1px solid #1e293b;
`;

const FooterGrid = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 48px;
  text-align: left;
`;

const FooterCol = styled.div`
  h4 {
    color: #22c55e;
    font-size: 1.1rem;
    margin-bottom: 20px;
    font-weight: 600;
    border-left: 3px solid #22c55e;
    padding-left: 12px;
  }

  p,
  a {
    font-size: 0.8rem;
    color: #8b9ac0;
    line-height: 1.7;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
    transition: 0.2s;
  }

  a:hover {
    color: #22c55e;
    transform: translateX(5px);
    display: inline-block;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 12px;

  span {
    font-size: 20px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      color: #22c55e;
      transform: translateY(-3px);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #1e2a44;
  font-size: 12px;
  color: #5f6e97;
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Index = () => {
  const [timestamp, setTimestamp] = useState('');
  const statsRef = useRef([]);

  // Update timestamp
  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      setTimestamp(`🕒 ${now.toUTCString().slice(5, 25)} UTC`);
    };
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  // Counter animation
  useEffect(() => {
    const counters = document.querySelectorAll('.stat-card h2');
    counters.forEach((counter) => {
      const text = counter.innerText;
      const numeric = parseInt(text.replace(/[^0-9]/g, ''));
      if (!isNaN(numeric) && text.includes('+')) {
        let current = 0;
        const increment = Math.ceil(numeric / 50);
        const updateCounter = () => {
          current += increment;
          if (current >= numeric) {
            counter.innerText = text;
            return;
          }
          counter.innerText = current.toLocaleString() + '+';
          requestAnimationFrame(updateCounter);
        };
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            updateCounter();
            observer.disconnect();
          }
        });
        observer.observe(counter);
      }
    });
  }, []);

  // Smooth scroll for anchor links
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }, []);

  return (
    <>
      <GlobalStyle />
      <BackgroundGradient />

      <div className="app-wrapper">
        {/* ===== HEADER ===== */}
        <header>
          <Container>
            <Navbar>
              <Logo>🔷Voltix Traders</Logo>
              <NavLinks>
                <a href="#">Features</a>
                <a href="#">Markets</a>
                <a href="#">Pricing</a>
                <a href="#">Docs</a>
              </NavLinks>
            </Navbar>
          </Container>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main>
          {/* Hero Section */}
          <Container>
            <Hero>
              <HeroBadge>⚡ AI-Powered Trading Infrastructure</HeroBadge>
              <HeroTitle>
                Automate Your Trading
                <br />
                with{' '}
                <span
                  style={{
                    background: 'linear-gradient(125deg,#22c55e,#38bdf8)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Voltix
                </span>
              </HeroTitle>
              <HeroSubtitle>
                Deploy powerful trading bots, monitor markets in real-time, and grow your strategy — all from one
                dashboard.
              </HeroSubtitle>
              <HeroButtons>
                <Button href="/Register" className="primary">
                  🚀 Start Trading
                </Button>
                <Button href="/Login" className="secondary">
                  🔐 Login
                </Button>
              </HeroButtons>
            </Hero>
          </Container>

          {/* Features Section */}
          <FeaturesSection>
            <Container>
              <SectionTitle>Platform Features</SectionTitle>
              <FeatureGrid>
                <FeatureCard>
                  <FeatureIcon>🤖</FeatureIcon>
                  <FeatureTitle>Automated Bots</FeatureTitle>
                  <FeatureDescription>24/7 trading bots with custom strategies and backtesting.</FeatureDescription>
                </FeatureCard>
                <FeatureCard>
                  <FeatureIcon>📊</FeatureIcon>
                  <FeatureTitle>Live Market Data</FeatureTitle>
                  <FeatureDescription>Real-time charts, order books, and price feeds from top exchanges.</FeatureDescription>
                </FeatureCard>
                <FeatureCard>
                  <FeatureIcon>🛡️</FeatureIcon>
                  <FeatureTitle>Risk Management</FeatureTitle>
                  <FeatureDescription>Stop-loss, take-profit, and portfolio protection tools.</FeatureDescription>
                </FeatureCard>
                <FeatureCard>
                  <FeatureIcon>☁️</FeatureIcon>
                  <FeatureTitle>Cloud Ready</FeatureTitle>
                  <FeatureDescription>Run bots securely 24/7 with 99.99% uptime SLA.</FeatureDescription>
                </FeatureCard>
              </FeatureGrid>
            </Container>
          </FeaturesSection>

          {/* Steps Section */}
          <StepsSection>
            <Container>
              <SectionTitle>How It Works</SectionTitle>
              <StepsGrid>
                <StepItem>
                  <StepNumber>1</StepNumber>
                  <h3>Create Account</h3>
                  <p>Sign up and access your trading dashboard instantly.</p>
                </StepItem>
                <StepItem>
                  <StepNumber>2</StepNumber>
                  <h3>Deploy Markets</h3>
                  <p>Select your market and connect exchange via API.</p>
                </StepItem>
                <StepItem>
                  <StepNumber>3</StepNumber>
                  <h3>Monitor Profits</h3>
                  <p>Track performance with live analytics and reports.</p>
                </StepItem>
              </StepsGrid>
            </Container>
          </StepsSection>

          {/* Market Preview */}
          <MarketPreview>
            <Container>
              <MarketShowcase>
                <div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
                    Trade Global Markets
                    <br />
                    in Real-Time
                  </h2>
                  <p style={{ color: '#9ca3af', marginBottom: '28px' }}>
                    Forex, Crypto, Synthetic Indices — all in one powerful platform. Low latency, deep liquidity,
                    and institutional execution.
                  </p>
                  <Button href="#" className="outline-light">
                    Explore Markets →
                  </Button>
                </div>
                <img
                  src="https://images.pexels.com/photos/34482029/pexels-photo-34482029.jpeg"
                  alt="Trading on mobile"
                />
              </MarketShowcase>
            </Container>
          </MarketPreview>

          {/* Why Choose Voltix */}
          <section style={{ padding: '80px 0' }}>
            <Container>
              <SectionTitle>Why Traders Choose Voltix</SectionTitle>
              <FeatureGrid>
                <FeatureCard>
                  <FeatureIcon>⚡</FeatureIcon>
                  <FeatureTitle>Fast Execution</FeatureTitle>
                  <FeatureDescription>Ultra-low latency matching engine.</FeatureDescription>
                </FeatureCard>
                <FeatureCard>
                  <FeatureIcon>📡</FeatureIcon>
                  <FeatureTitle>AI Signals</FeatureTitle>
                  <FeatureDescription>Advanced algorithms analyze markets.</FeatureDescription>
                </FeatureCard>
                <FeatureCard>
                  <FeatureIcon>🔐</FeatureIcon>
                  <FeatureTitle>Secure Platform</FeatureTitle>
                  <FeatureDescription>Bank-level encryption &amp; MPC custody.</FeatureDescription>
                </FeatureCard>
                <FeatureCard>
                  <FeatureIcon>📈</FeatureIcon>
                  <FeatureTitle>Multi-Market Access</FeatureTitle>
                  <FeatureDescription>Trade Forex, Crypto, Deriv indices.</FeatureDescription>
                </FeatureCard>
              </FeatureGrid>
            </Container>
          </section>

          {/* Built for Real Traders */}
          <section style={{ padding: '80px 0', background: 'rgba(2, 6, 23, 0.6)' }}>
            <Container
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '48px',
                alignItems: 'center',
              }}
            >
              <div>
                <h2 style={{ fontSize: '2rem' }}>Built for Real Traders</h2>
                <p style={{ color: '#9ca3af', margin: '20px 0' }}>
                  Voltix gives you full control of your strategy. Monitor charts, automate trades, and react
                  to markets instantly with our advanced suite.
                </p>
                <Button href="/Register" className="primary">
                  Get Started
                </Button>
              </div>
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
                style={{ width: '100%', borderRadius: '28px', border: '1px solid #22c55e30' }}
                alt="Trading charts"
              />
            </Container>
          </section>

          {/* Stats Section */}
          <StatsSection>
            <Container>
              <SectionTitle>Platform Growth</SectionTitle>
              <StatsGrid>
                <StatCard className="stat-card">
                  <h2>10K+</h2>
                  <p>Active Traders</p>
                </StatCard>
                <StatCard className="stat-card">
                  <h2>$2M+</h2>
                  <p>Trades Executed</p>
                </StatCard>
                <StatCard className="stat-card">
                  <h2>99.99%</h2>
                  <p>Uptime</p>
                </StatCard>
                <StatCard className="stat-card">
                  <h2>24/7</h2>
                  <p>Support</p>
                </StatCard>
              </StatsGrid>
            </Container>
          </StatsSection>

          {/* CTA Section */}
          <CTASection>
            <Container>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Start Trading Smarter Today</h2>
              <p style={{ marginBottom: '32px', color: '#cbd5e1' }}>
                Join thousands of traders using Voltix to automate and grow.
              </p>
              <Button href="/Register" className="white-bg">
                Create Free Account →
              </Button>
            </Container>
          </CTASection>
        </main>

        {/* ===== FOOTER ===== */}
        <PremiumFooter>
          <FooterGrid>
            <FooterCol>
              <h4>🔷 Voltix Traders</h4>
              <p>Next-gen trading automation platform for retail &amp; institutional traders.</p>
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