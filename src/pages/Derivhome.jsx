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

// ===== BUTTONS =====
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(105deg, #0ea5e9, #3b82f6);
  color: white;
  border-radius: 40px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
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
    cursor: not-allowed;
    transform: none;
  }

  &.secondary {
    background: #1e293b;
    border: 1px solid #334155;
    box-shadow: none;

    &:hover:not(:disabled) {
      background: #2d3a5e;
      border-color: #38bdf8;
      transform: translateY(-2px);
    }
  }
`;

// ===== CONNECT PANEL =====
const ConnectPanel = styled.div`
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(12px);
  border-radius: 36px;
  padding: 32px 28px;
  margin: 40px 0 20px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  transition: all 0.2s;
`;

const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 20px 0;
  color: #4b5563;
  font-size: 14px;

  hr {
    width: 80px;
    background: #2d3a5e;
    height: 1px;
    border: none;
  }
`;

const TokenBox = styled.div`
  max-width: 440px;
  margin: 0 auto;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 44px 14px 20px;
  background: #0f172a;
  border: 1.5px solid #1e293b;
  border-radius: 60px;
  color: #f1f5f9;
  font-size: 14px;
  transition: all 0.2s;
  outline: none;

  &:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
  }
`;

const ToggleEye = styled.button`
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #94a3b8;
  font-size: 18px;
  transition: 0.2s;
  background: none;
  border: none;

  &:hover {
    color: #38bdf8;
  }
`;

const AccountSignup = styled.div`
  margin-top: 20px;
  font-size: 14px;
  color: #9ca3af;
`;

const SignupLink = styled.a`
  color: #38bdf8;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px dashed #38bdf8;

  &:hover {
    border-bottom-style: solid;
  }
`;

// ===== MESSAGE =====
const MessageArea = styled.div`
  margin-top: 20px;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  display: ${props => props.show ? 'block' : 'none'};
  background: ${props => {
    switch(props.type) {
      case 'success': return 'rgba(34, 197, 94, 0.2)';
      case 'error': return 'rgba(239, 68, 68, 0.2)';
      case 'info': return 'rgba(56, 189, 248, 0.2)';
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
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'info': return '#38bdf8';
      default: return 'transparent';
    }
  }};
  white-space: pre-line;
`;

// ===== CARDS =====
const Cards = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 70px;
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
  margin-top: 80px;
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
  const [apiToken, setApiToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ FIXED: Vite uses import.meta.env instead of process.env
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login first to connect your Deriv account');
      setMessageType('error');
      setShowMessage(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  const showCustomMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
  };

  // Connect with API Token
  const handleConnect = async () => {
    if (!isAuthenticated) return;

    const token = apiToken.trim();
    const accountType = 'Demo'; // Can be 'Real' or 'Demo'

    if (!token) {
      showCustomMessage('⚠️ Please paste your Deriv API token', 'error');
      return;
    }

    setIsLoading(true);
    setMessage('🔄 Connecting...');
    setMessageType('info');
    setShowMessage(true);

    try {
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/deriv/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          api_token: token,
          account_type: accountType
        })
      });

      const data = await response.json();

      if (response.ok) {
        showCustomMessage(
          `✅ ${data.message}!\n\nAccount ID: ${data.account.account_id}\nBalance: $${data.account.balance} ${data.account.currency}`,
          'success'
        );

        // Store connection info in localStorage
        localStorage.setItem('deriv_connected', 'true');
        localStorage.setItem('deriv_account_id', data.account.account_id);
        localStorage.setItem('deriv_balance', data.account.balance);

        setIsLoading(false);

        // Redirect to trading dashboard after 2 seconds
        setTimeout(() => {
          navigate('/derivdash');
        }, 2000);
      } else {
        showCustomMessage(`❌ Connection failed: ${data.error}`, 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Connection error:', error);
      showCustomMessage(
        '❌ Cannot connect to server. Please make sure the backend is running.',
        'error'
      );
      setIsLoading(false);
    }
  };

  // OAuth button handler
  const handleOAuth = () => {
    showCustomMessage(
      '🔐 Deriv OAuth integration coming soon! Please use API token for now.',
      'info'
    );
  };

  return (
    <>
      <GlobalStyle />

      {/* Topbar */}
      <Topbar>
        <Logo>
          <LogoText>🔷Voltix Traders• Deriv</LogoText>
        </Logo>
        <BackButton to="/Marketsdash">← Back to Markets</BackButton>
      </Topbar>

      {/* Main Content */}
      <Container>
        <BadgeGlow>🤖 AI-Powered Deriv Trading Signals</BadgeGlow>
        <Title>
          Trade Deriv with <Highlight>Voltix </Highlight>
        </Title>
        <Subtitle>
          Precision execution, multi-contract intelligence, and real-time confidence analytics.
        </Subtitle>

        <ConnectPanel>
          <SectionTitle>
            <span>🔄</span>Connect Your Deriv Account
          </SectionTitle>

          <Button onClick={handleOAuth} id="oauthBtn">
            🔵 Connect via Deriv OAuth (Recommended)
          </Button>

          <OrDivider>
            <hr /> <span>secure alternative</span> <hr />
          </OrDivider>

          <TokenBox>
            <PasswordWrapper>
              <Input
                type={showToken ? 'text' : 'password'}
                placeholder="Paste your Deriv API token (read/trade)"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                disabled={isLoading}
              />
              <ToggleEye onClick={toggleTokenVisibility}>
                {showToken ? '🙈' : '👁️'}
              </ToggleEye>
            </PasswordWrapper>
            <Button
              className="secondary"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? '🔄 Connecting...' : '🔐 Connect with API Token'}
            </Button>
            <AccountSignup>
              🚀 New to Deriv trading?
              <SignupLink
                href="https://deriv.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open a free Deriv account →
              </SignupLink>
            </AccountSignup>
          </TokenBox>

          <MessageArea
            show={showMessage}
            type={messageType}
          >
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
              OAuth + token authentication with encrypted infrastructure.
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

export default DerivTrading;