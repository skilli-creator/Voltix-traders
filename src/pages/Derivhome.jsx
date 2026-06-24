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
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif;
    background: radial-gradient(ellipse at 30% 10%, #0b1a2e, #03050b);
    color: #f1f5f9;
    line-height: 1.5;
    min-height: 100vh;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #0f172a;
  }
  ::-webkit-scrollbar-thumb {
    background: #2d3a5e;
    border-radius: 8px;
  }
`;

// ============================================
// KEYFRAMES
// ============================================
const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

// ===== TOPBAR =====
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 40px;
  background: rgba(3, 7, 18, 0.75);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 720px) {
    padding: 14px 20px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.span`
  font-size: 28px;
  filter: drop-shadow(0 0 6px #38bdf8);
`;

const LogoText = styled.h2`
  font-weight: 700;
  background: linear-gradient(135deg, #e0f2fe, #38bdf8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.3px;
`;

const BackButton = styled(Link)`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 40px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  &:hover {
    background: #2d3a5e;
    border-color: #38bdf8;
    color: white;
  }
`;

// ===== CONTAINER =====
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 28px;
  text-align: center;

  @media (max-width: 720px) {
    padding: 24px 20px;
  }
`;

const BadgeGlow = styled.div`
  display: inline-flex;
  background: rgba(15, 42, 68, 0.7);
  backdrop-filter: blur(4px);
  padding: 8px 20px;
  border-radius: 60px;
  border: 1px solid rgba(56, 189, 248, 0.4);
  font-size: 13px;
  font-weight: 500;
  color: #7dd3fc;
  letter-spacing: 0.3px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 16px 0 20px;
  letter-spacing: -1px;

  @media (max-width: 720px) {
    font-size: 42px;
  }
`;

const Highlight = styled.span`
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #9ca3af;
  max-width: 700px;
  margin: 0 auto 36px;
  line-height: 1.5;
`;

// ===== CONNECT PANEL =====
const ConnectPanel = styled.div`
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(12px);
  border-radius: 36px;
  padding: 40px 32px;
  margin: 40px 0 20px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  transition: all 0.2s;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const SectionSubtitle = styled.p`
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 24px;
  text-align: center;
`;

// ===== OAUTH BUTTON =====
const OAuthButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(105deg, #0ea5e9, #3b82f6);
  color: white;
  border-radius: 40px;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border: none;
  transition: all 0.25s ease;
  box-shadow: 0 6px 14px rgba(14, 165, 233, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px rgba(14, 165, 233, 0.3);
    background: linear-gradient(105deg, #0284c7, #2563eb);
  }

  &:disabled {
    opacity: 0.6;
  }

  .spinner {
    animation: ${pulse} 1s ease-in-out infinite;
  }
`;

// ===== MESSAGE =====
const MessageArea = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  display: ${props => props.show ? 'block' : 'none'};
  background: ${props => {
    switch(props.type) {
      case 'success': return 'rgba(34, 197, 94, 0.15)';
      case 'error': return 'rgba(239, 68, 68, 0.15)';
      case 'info': return 'rgba(56, 189, 248, 0.15)';
      default: return 'rgba(0, 0, 0, 0.3)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'info': return '#38bdf8';
      default: return '#94a3b8';
    }
  }};
  border: 1px solid ${props => {
    switch(props.type) {
      case 'success': return 'rgba(34, 197, 94, 0.2)';
      case 'error': return 'rgba(239, 68, 68, 0.2)';
      case 'info': return 'rgba(56, 189, 248, 0.2)';
      default: return 'transparent';
    }
  }};
`;

const AccountSignup = styled.div`
  margin-top: 20px;
  font-size: 13px;
  color: #64748b;

  a {
    color: #38bdf8;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ===== CARDS =====
const Cards = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 60px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background: rgba(11, 22, 38, 0.75);
  backdrop-filter: blur(4px);
  padding: 28px 24px;
  width: 300px;
  border-radius: 28px;
  text-align: left;
  border: 1px solid rgba(51, 65, 85, 0.6);
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);

  &:hover {
    transform: translateY(-6px);
    border-color: #38bdf8;
    background: rgba(20, 34, 58, 0.85);
    box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.4);
  }
`;

const CardIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 12px;
  background: linear-gradient(120deg, #f1f5f9, #b9d0f0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const CardDescription = styled.p`
  color: #a0afc7;
  line-height: 1.5;
`;

const Powered = styled.div`
  margin-top: 60px;
  font-size: 12px;
  color: #4b5563;
  padding-top: 20px;
  border-top: 1px solid #1e2a44;
  display: flex;
  justify-content: center;
  gap: 6px;

  span {
    color: #38bdf8;
    font-weight: 600;
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

      console.log("Sending token:", authToken); // ✅ DEBUG

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

      console.log("Backend response:", data); // ✅ DEBUG

      if (response.ok && data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        showCustomMessage(
          `Connection failed: ${data.error || 'Unknown error'}`,
          'error'
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error('OAuth error:', error);
      showCustomMessage(
        'Cannot connect to server. Please check your connection.',
        'error'
      );
      setIsLoading(false);
    }
  };


  return (
    <>
      <GlobalStyle />

      <Topbar>
        <Logo>
          <LogoIcon>🔷</LogoIcon>
          <LogoText>Voltix Traders • Deriv</LogoText>
        </Logo>
        <BackButton to="/Marketsdash">← Back to Markets</BackButton>
      </Topbar>

      <Container>
        <BadgeGlow>🤖 AI-Powered Deriv Trading Signals</BadgeGlow>
        <Title>
          Trade Deriv with <Highlight>Voltix</Highlight>
        </Title>
        <Subtitle>
          Precision execution, multi-contract intelligence, and real-time confidence analytics.
        </Subtitle>

        <ConnectPanel>
          <SectionTitle>
            <span>🔐</span> Connect Your Deriv Account
          </SectionTitle>
          <SectionSubtitle>
            Securely connect your Deriv account via OAuth 2.0.
          </SectionSubtitle>

          <OAuthButton 
            onClick={handleOAuthConnect}
            disabled={isLoading || !isAuthenticated}
          >
            {isLoading ? (
              <>
                <span className="spinner">⟳</span> Connecting...
              </>
            ) : (
              '🔵 Connect with Deriv OAuth'
            )}
          </OAuthButton>

          <AccountSignup>
            🚀 New to Deriv trading?{' '}
            <a href="https://deriv.com/" target="_blank" rel="noopener noreferrer">
              Open a free Deriv account →
            </a>
          </AccountSignup>

          <MessageArea show={showMessage} type={messageType}>
            {message}
          </MessageArea>
        </ConnectPanel>

        <Cards>
          <Card>
            <CardIcon>⚙️</CardIcon>
            <CardTitle>All Trades Engine</CardTitle>
            <CardDescription>
              Executes all types of trades with smart order flow and risk-aware logic.
            </CardDescription>
          </Card>
          <Card>
            <CardIcon>📈</CardIcon>
            <CardTitle>High-Spec Analysis</CardTitle>
            <CardDescription>
              Real-time market analysis, confidence scoring &amp; AI-driven entry points.
            </CardDescription>
          </Card>
          <Card>
            <CardIcon>🔒</CardIcon>
            <CardTitle>Secure Connection Layer</CardTitle>
            <CardDescription>
              OAuth 2.0 authentication with encrypted infrastructure. Your credentials never touch our servers.
            </CardDescription>
          </Card>
        </Cards>

        <Powered>
          Powered by <span>Deriv</span> — All trading actions executed on Deriv's official infrastructure. Trade responsibly.
        </Powered>
      </Container>
    </>
  );
};

export default DerivTrading;// Force rebuild: Wed Jun 24 12:33:14 PM EAT 2026
// Force rebuild: Wed Jun 24 12:33:31 PM EAT 2026
// Force rebuild: Wed Jun 24 02:32:28 PM EAT 2026
// Force rebuild: Wed Jun 24 02:39:58 PM EAT 2026
// Force rebuild: Wed Jun 24 02:46:37 PM EAT 2026
// Force rebuild: Wed Jun 24 07:44:27 PM EAT 2026
