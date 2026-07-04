import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.1); }
  50% { box-shadow: 0 0 60px rgba(34, 197, 94, 0.3); }
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

const shimmerLine = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const floatPulse = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-8px) scale(1.02); }
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

// ============================================
// TOPBAR - Minimal
// ============================================
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: rgba(5, 10, 24, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: ${floatIn} 0.6s ease;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: 800;
  text-decoration: none;

  .logo-icon {
    font-size: 1.6rem;
  }

  .logo-text {
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
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Greeting = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;

  .highlight {
    color: #f1f5f9;
    font-weight: 600;
  }
`;

const LogoutButton = styled.button`
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #ef4444;
  padding: 6px 14px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #ef4444;
    color: #0a0f1f;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
  }
`;

// ============================================
// FLOATING CONNECT BUTTON - SUPER DESIGNED
// ============================================
const ConnectButtonWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: ${floatPulse} 3s ease-in-out infinite;
  cursor: pointer;

  @media (max-width: 768px) {
    bottom: 24px;
    width: 90%;
    max-width: 400px;
  }
`;

const ConnectButton = styled.button`
  position: relative;
  padding: 18px 48px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  border-radius: 60px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 10px 40px rgba(34, 197, 94, 0.25),
    0 0 80px rgba(34, 197, 94, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  letter-spacing: 0.5px;
  width: 100%;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.15), 
      transparent
    );
    animation: ${slideGlow} 4s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 62px;
    padding: 2px;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(34, 197, 94, 0.3),
      transparent,
      rgba(56, 189, 248, 0.3),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 6s linear infinite;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0 20px 60px rgba(34, 197, 94, 0.4),
      0 0 100px rgba(34, 197, 94, 0.15);
  }

  &:active {
    transform: scale(0.96);
  }

  .button-icon {
    margin-right: 12px;
    font-size: 1.3rem;
    display: inline-block;
    animation: ${floatPulse} 2s ease-in-out infinite;
  }

  .button-text {
    position: relative;
    z-index: 1;
  }

  .connect-badge {
    position: absolute;
    top: -10px;
    right: -10px;
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    color: #fff;
    font-size: 0.55rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    animation: ${pulseGlow} 2s ease-in-out infinite;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 0.95rem;
    white-space: normal;

    .button-icon {
      font-size: 1.1rem;
    }

    .connect-badge {
      top: -8px;
      right: -8px;
      font-size: 0.45rem;
      padding: 3px 10px;
    }
  }
`;

// ============================================
// CONNECT MODAL - Super designed
// ============================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  z-index: 2000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${floatIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background: linear-gradient(145deg, rgba(10, 20, 40, 0.98), rgba(5, 10, 24, 0.98));
  border-radius: 32px;
  padding: 40px 48px;
  max-width: 520px;
  width: 100%;
  border: 1px solid rgba(56, 189, 248, 0.08);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
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
    animation: ${shimmerLine} 2s linear infinite;
  }

  @media (max-width: 768px) {
    padding: 28px 20px;
    margin: 0 12px;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    transform: rotate(90deg);
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #f1f5f9, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const ModalSubtitle = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 28px;
  line-height: 1.6;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.button`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #f1f5f9;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.color || 'linear-gradient(90deg, #22c55e, #38bdf8)'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(56, 189, 248, 0.08);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    transform: scale(0.97);
  }

  .option-icon {
    font-size: 2.4rem;
    display: block;
    margin-bottom: 10px;
  }

  .option-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .option-desc {
    font-size: 0.7rem;
    color: #94a3b8;
  }

  .option-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 0.5rem;
    padding: 2px 10px;
    border-radius: 12px;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.1);
    color: #4ade80;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`;

const ModalFooter = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 0.7rem;
  color: #4b5563;

  .highlight {
    color: #38bdf8;
  }
`;

// ============================================
// MAIN CONTENT - Minimal
// ============================================
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 100px;
  position: relative;
  z-index: 2;
  text-align: center;

  @media (max-width: 768px) {
    padding: 24px 16px 80px;
  }
`;

const WelcomeText = styled.div`
  animation: ${floatIn} 0.7s ease;
  margin-top: 40px;

  h1 {
    font-size: 2.8rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 12px;

    .highlight {
      background: linear-gradient(135deg, #22c55e, #38bdf8);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  p {
    font-size: 1.1rem;
    color: #94a3b8;
    max-width: 500px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 0.95rem;
    }
  }
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 8px 20px;
  border-radius: 30px;
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.08);
  font-size: 0.75rem;
  color: #4ade80;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('Trader');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
      navigate('/');
      return;
    }

    setUser(userData);
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Trader';
    setGreeting(fullName);
  }, [navigate]);

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleConnectAccount = (type) => {
    // Navigate to respective dashboard
    const routes = {
      deriv: '/derivhome',
      forex: '/derivdash'
    };
    navigate(routes[type]);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'T';
  };

  return (
    <>
      <GlobalStyle />

      <BackgroundContainer>
        <GradientOrb />
        <GradientOrb />
        <GradientOrb />
        <GridOverlay />
      </BackgroundContainer>

      <Topbar>
        <Brand to="/dashboard">
          <span className="logo-icon">🔷</span>
          <span className="logo-text">Voltix Traders</span>
          <span className="live-dot" />
        </Brand>
        <ProfileArea>
          <Greeting>
            👋 <span className="highlight">{greeting}</span>
          </Greeting>
          <LogoutButton onClick={handleLogout}>🚪 Logout</LogoutButton>
        </ProfileArea>
      </Topbar>

      <Container>
        <WelcomeText>
          <h1>
            Ready to Trade? <br />
            <span className="highlight">Connect Your Account</span>
          </h1>
          <p>Choose your preferred trading platform and start executing in seconds.</p>
        </WelcomeText>

        <StatusIndicator>
          <span className="dot" />
          System Ready • 24/7 Active
        </StatusIndicator>
      </Container>

      {/* FLOATING CONNECT BUTTON - SUPER DESIGNED */}
      <ConnectButtonWrapper>
        <ConnectButton onClick={handleConnect}>
          <span className="button-icon">⚡</span>
          <span className="button-text">Connect Your Accounts</span>
          <span className="connect-badge">Live</span>
        </ConnectButton>
      </ConnectButtonWrapper>

      {/* CONNECT MODAL */}
      <ModalOverlay isOpen={isModalOpen}>
        <ModalContainer>
          <ModalClose onClick={() => setIsModalOpen(false)}>✕</ModalClose>
          <ModalTitle>Connect Platform</ModalTitle>
          <ModalSubtitle>
            Select your trading platform to sync your account and start trading.
          </ModalSubtitle>

          <OptionGrid>
            <OptionCard 
              color="linear-gradient(90deg, #a855f7, #7c3aed)"
              onClick={() => handleConnectAccount('deriv')}
            >
              <span className="option-badge">24/7</span>
              <span className="option-icon">📊</span>
              <div className="option-name">Deriv</div>
              <div className="option-desc">Synthetic indices • Options</div>
            </OptionCard>

            <OptionCard 
              color="linear-gradient(90deg, #2563eb, #1d4ed8)"
              onClick={() => handleConnectAccount('forex')}
            >
              <span className="option-badge">24/5</span>
              <span className="option-icon">💱</span>
              <div className="option-name">Forex</div>
              <div className="option-desc">Major • Minor • Exotic pairs</div>
            </OptionCard>
          </OptionGrid>

          <ModalFooter>
            Secure connection • <span className="highlight">256-bit encrypted</span>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
    </>
  );
};

export default Dashboard;