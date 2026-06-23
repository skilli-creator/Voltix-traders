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
    background: #0a0a0f;
    color: #ffffff;
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #1a1a2e; }
  ::-webkit-scrollbar-thumb { background: #00d4ff; border-radius: 10px; }
`;

// ============================================
// KEYFRAMES
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.95); }
`;

const rotateGlow = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

// ===== BACKGROUND =====
const Background = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 50%, rgba(138, 43, 226, 0.03) 0%, transparent 60%),
    #0a0a0f;
`;

const Grid = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
`;

const GlowLine = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  z-index: 0;
  background: linear-gradient(90deg, transparent, #00d4ff, #8a2be2, transparent);
  opacity: 0.3;
`;

// ===== TOPBAR =====
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 48px;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: ${fadeIn} 0.6s ease;

  @media (max-width: 768px) {
    padding: 12px 20px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #00d4ff, #8a2be2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: #0a0a0f;
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.15);
`;

const LogoText = styled.div`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;

  .voltix {
    color: #ffffff;
  }

  .deriv {
    background: linear-gradient(135deg, #00d4ff, #8a2be2);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 400;
    margin-left: 4px;
  }
`;

const TopbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: #8888aa;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.02);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(0, 212, 255, 0.2);
    color: #ffffff;
  }
`;

// ===== MAIN =====
const Main = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px 80px;

  @media (max-width: 768px) {
    padding: 30px 16px 60px;
  }
`;

// ===== HERO =====
const Hero = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeIn} 0.8s ease;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 18px 6px 10px;
  background: rgba(0, 212, 255, 0.06);
  border: 1px solid rgba(0, 212, 255, 0.1);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #00d4ff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 24px;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00d4ff;
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 16px;
  letter-spacing: -1.5px;

  .highlight {
    background: linear-gradient(135deg, #00d4ff, #8a2be2);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 34px;
  }
`;

const HeroSub = styled.p`
  font-size: 16px;
  color: #666688;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

// ===== CONNECT SECTION =====
const ConnectSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
  animation: ${fadeIn} 0.8s ease 0.2s both;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ConnectCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 40px 36px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00d4ff, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(0, 212, 255, 0.1);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CardIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
`;

const CardDesc = styled.p`
  font-size: 14px;
  color: #666688;
  margin-bottom: 24px;
  line-height: 1.7;
`;

const ConnectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 14px 24px;
  background: ${props => props.primary ? 'linear-gradient(135deg, #00d4ff, #8a2be2)' : 'rgba(255, 255, 255, 0.04)'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.06)'};
  border-radius: 10px;
  color: ${props => props.primary ? '#0a0a0f' : '#8888aa'};
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? '0 8px 30px rgba(0, 212, 255, 0.2)' : 'none'};
    background: ${props => props.primary ? 'linear-gradient(135deg, #00d4ff, #8a2be2)' : 'rgba(255, 255, 255, 0.06)'};
  }

  &:disabled {
    opacity: 0.5;
  }

  .spinner {
    animation: ${rotateGlow} 1s linear infinite;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #8888aa;

  .check {
    color: #00d4ff;
    font-size: 16px;
  }
`;

// ===== STATS =====
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 60px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 40px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Stat = styled.div`
  text-align: center;

  .number {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #ffffff, #8888aa);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .label {
    font-size: 12px;
    color: #444466;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

// ===== MESSAGE =====
const Message = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  gap: 10px;
  background: ${props => {
    switch(props.type) {
      case 'success': return 'rgba(0, 212, 255, 0.06)';
      case 'error': return 'rgba(255, 68, 68, 0.06)';
      case 'info': return 'rgba(255, 255, 255, 0.03)';
      default: return 'rgba(0, 0, 0, 0.3)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'success': return '#00d4ff';
      case 'error': return '#ff4444';
      case 'info': return '#8888aa';
      default: return '#8888aa';
    }
  }};
  border: 1px solid ${props => {
    switch(props.type) {
      case 'success': return 'rgba(0, 212, 255, 0.08)';
      case 'error': return 'rgba(255, 68, 68, 0.08)';
      case 'info': return 'rgba(255, 255, 255, 0.04)';
      default: return 'rgba(255, 255, 255, 0.04)';
    }
  }};
`;

// ===== FOOTER =====
const Footer = styled.div`
  text-align: center;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  margin-top: 20px;

  p {
    font-size: 12px;
    color: #333355;

    span {
      color: #00d4ff;
    }
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
    showCustomMessage('Connecting to Deriv...', 'info');

    try {
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/deriv/oauth/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();

      if (response.ok && data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        showCustomMessage(`Connection failed: ${data.error || 'Unknown error'}`, 'error');
        setIsLoading(false);
      }
    } catch (error) {
      showCustomMessage('Cannot connect to server. Please check your connection.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Background />
      <Grid />
      <GlowLine />

      <Topbar>
        <Logo to="/">
          <LogoIcon>⟡</LogoIcon>
          <LogoText>
            <span className="voltix">Voltix</span>
            <span className="deriv">• deriv</span>
          </LogoText>
        </Logo>
        <TopbarActions>
          <BackButton to="/Marketsdash">← Back</BackButton>
        </TopbarActions>
      </Topbar>

      <Main>
        <Hero>
          <Badge>
            <span className="dot" />
            Live • Secure • Fast
          </Badge>
          <HeroTitle>
            Trade <span className="highlight">Deriv</span><br />Like a Pro
          </HeroTitle>
          <HeroSub>
            Connect your account and start trading with AI-powered tools
          </HeroSub>
        </Hero>

        <ConnectSection>
          {/* OAuth Card */}
          <ConnectCard>
            <CardIcon>🔐</CardIcon>
            <CardTitle>OAuth Connection</CardTitle>
            <CardDesc>
              Securely connect your Deriv account using OAuth 2.0. 
              Your credentials never touch our servers.
            </CardDesc>

            <FeatureList>
              <Feature>
                <span className="check">✓</span>
                Zero credential storage
              </Feature>
              <Feature>
                <span className="check">✓</span>
                Real & Demo accounts
              </Feature>
              <Feature>
                <span className="check">✓</span>
                Instant market access
              </Feature>
            </FeatureList>

            <ConnectButton 
              primary 
              onClick={handleOAuthConnect}
              disabled={isLoading || !isAuthenticated}
            >
              {isLoading ? (
                <>
                  <span className="spinner">⟳</span> Connecting...
                </>
              ) : (
                'Connect with Deriv OAuth'
              )}
            </ConnectButton>

            <Message show={showMessage} type={messageType}>
              <span>
                {messageType === 'success' ? '✓' : 
                 messageType === 'error' ? '✕' : 
                 '•'}
              </span>
              {message}
            </Message>
          </ConnectCard>

          {/* Info Card */}
          <ConnectCard>
            <CardIcon>🚀</CardIcon>
            <CardTitle>Why Voltix?</CardTitle>
            <CardDesc>
              Built for traders who demand precision, speed, and reliability.
            </CardDesc>

            <FeatureList>
              <Feature>
                <span className="check">✓</span>
                AI-powered trading signals
              </Feature>
              <Feature>
                <span className="check">✓</span>
                Real-time market analytics
              </Feature>
              <Feature>
                <span className="check">✓</span>
                Automated risk management
              </Feature>
              <Feature>
                <span className="check">✓</span>
                24/7 market monitoring
              </Feature>
            </FeatureList>

            <div style={{ marginTop: '16px' }}>
              <a 
                href="https://deriv.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#666688',
                  textDecoration: 'none',
                  fontSize: '13px',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#00d4ff'}
                onMouseLeave={(e) => e.target.style.color = '#666688'}
              >
                New to Deriv? Create account →
              </a>
            </div>
          </ConnectCard>
        </ConnectSection>

        <StatsGrid>
          <Stat>
            <div className="number">99.9%</div>
            <div className="label">Uptime</div>
          </Stat>
          <Stat>
            <div className="number">50ms</div>
            <div className="label">Execution Speed</div>
          </Stat>
          <Stat>
            <div className="number">256-bit</div>
            <div className="label">Encryption</div>
          </Stat>
        </StatsGrid>

        <Footer>
          <p>
            Powered by <span>Deriv</span> • All trades executed on official infrastructure • Trade responsibly
          </p>
        </Footer>
      </Main>
    </>
  );
};

export default DerivTrading;