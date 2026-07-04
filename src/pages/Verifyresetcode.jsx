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
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #050a18;
    color: #f1f5f9;
    padding: 16px;
    overflow: hidden;
    position: relative;
  }

  #root {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  @media (max-width: 480px) {
    body {
      padding: 8px;
    }
  }
`;

// ============================================
// KEYFRAMES - CINEMATIC
// ============================================
const floatIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(40px) scale(0.95) rotateX(5deg);
    filter: blur(8px);
  }
  60% { 
    transform: translateY(-5px) scale(1.01) rotateX(0deg);
    filter: blur(0px);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0px);
  }
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
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.08); }
  50% { box-shadow: 0 0 50px rgba(34, 197, 94, 0.2); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
`;

const inputFocus = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.8) translateY(20px); }
  70% { transform: scale(1.05) translateY(-3px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
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
  animation: ${breathe} 7s ease-in-out infinite;

  &:nth-child(1) {
    width: 350px;
    height: 350px;
    top: -150px;
    right: -120px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.08), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 280px;
    height: 280px;
    bottom: -120px;
    left: -80px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.06), transparent 70%);
    animation-delay: -2.5s;
  }

  &:nth-child(3) {
    width: 180px;
    height: 180px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(129, 140, 248, 0.04), transparent 70%);
    animation-delay: -5s;
  }

  @media (max-width: 480px) {
    &:nth-child(1) {
      width: 200px;
      height: 200px;
      top: -100px;
      right: -80px;
    }
    &:nth-child(2) {
      width: 160px;
      height: 160px;
      bottom: -80px;
      left: -60px;
    }
    &:nth-child(3) {
      width: 120px;
      height: 120px;
    }
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.015) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.4;
`;

const GlowLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, transparent);
  opacity: 0.08;
`;

// ============================================
// MAIN CONTAINER - UPDATED FROM LOGIN
// ============================================
const Container = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 36px 28px 32px;
  background: rgba(8, 18, 38, 0.55);
  backdrop-filter: blur(32px);
  border-radius: 48px;
  position: relative;
  z-index: 2;
  animation: ${floatIn} 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(56, 189, 248, 0.04);
  box-shadow: 0 32px 80px -16px rgba(0, 0, 0, 0.6);

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 49px;
    padding: 1px;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(56, 189, 248, 0.06),
      transparent,
      rgba(129, 140, 248, 0.06),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 15s linear infinite;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: 20%;
    right: 20%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #22c55e, #38bdf8, transparent);
    opacity: 0.1;
    border-radius: 0 0 4px 4px;
  }

  .shimmer-overlay {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 40%, rgba(56, 189, 248, 0.02), transparent 60%);
    pointer-events: none;
  }

  &.error-shake {
    animation: ${shake} 0.4s ease-in-out;
  }

  @media (max-width: 480px) {
    padding: 24px 16px 20px;
    border-radius: 32px;
    max-width: 100%;
    &::before {
      border-radius: 33px;
    }
  }
`;

// ============================================
// BRAND SECTION
// ============================================
const BrandSection = styled.div`
  text-align: center;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const PremiumLogo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 18px 5px 12px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.06), rgba(129, 140, 248, 0.02));
  border: 1px solid rgba(56, 189, 248, 0.04);
  border-radius: 40px;
  margin-bottom: 14px;

  .logo-icon {
    font-size: 16px;
  }

  .logo-text {
    font-size: 11px;
    font-weight: 700;
    background: linear-gradient(135deg, #e0f2fe, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: 0.3px;
  }

  .status-dot {
    width: 5px;
    height: 5px;
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
    padding: 4px 12px 4px 8px;
    gap: 6px;
    .logo-text { font-size: 10px; }
    .logo-icon { font-size: 14px; }
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 4px;

  .gradient-text {
    background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ${shimmer} 6s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const Subhead = styled.p`
  font-size: 14px;
  color: #94a3b8;
  font-weight: 400;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

// ============================================
// FORM
// ============================================
const Form = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  text-align: center;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const FloatingLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .icon {
    font-size: 13px;
    color: #4b5563;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    .icon { font-size: 11px; }
  }
`;

const PremiumInputWrapper = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  border: 1.5px solid rgba(255, 255, 255, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  max-width: 220px;
  margin: 0 auto;
  animation: ${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(135deg, transparent, rgba(34, 197, 94, 0.03), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:focus-within {
    border-color: rgba(34, 197, 94, 0.12);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.03);
    background: rgba(255, 255, 255, 0.03);
    animation: ${inputFocus} 0.3s ease;
  }

  &:focus-within::before {
    opacity: 1;
  }

  @media (max-width: 480px) {
    border-radius: 18px;
    border-width: 1px;
    max-width: 180px;
  }
`;

const CodeInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: none;
  color: #f1f5f9;
  font-size: 28px;
  text-align: center;
  letter-spacing: 8px;
  outline: none;
  font-family: 'Courier New', monospace;
  font-weight: 700;

  &::placeholder {
    color: #4b5563;
    letter-spacing: 4px;
    font-weight: 400;
  }

  @media (max-width: 480px) {
    padding: 11px 12px;
    font-size: 22px;
    letter-spacing: 6px;
    &::placeholder { letter-spacing: 3px; }
  }
`;

// ============================================
// BUTTON
// ============================================
const PremiumButton = styled.button`
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 32px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  background-size: 200% 200%;
  color: #0a0f1f;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-top: 4px;
  box-shadow: 0 4px 24px rgba(34, 197, 94, 0.08);
  animation: ${shimmer} 6s ease-in-out infinite;

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 2;
  }

  .btn-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
    animation: ${slideGlow} 4s ease-in-out infinite;
    z-index: 1;
  }

  .btn-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04), transparent 70%);
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: 0;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 8px 36px rgba(34, 197, 94, 0.12);
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
    animation: none;
  }

  @media (max-width: 480px) {
    padding: 11px;
    font-size: 14px;
    border-radius: 28px;
  }
`;

// ============================================
// RESEND LINK
// ============================================
const ResendLink = styled.div`
  margin-top: 14px;
  text-align: center;

  a {
    color: #38bdf8;
    cursor: pointer;
    font-size: 13px;
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
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      transition: width 0.3s ease;
    }

    &:hover {
      color: #7dd3fc;
    }

    &:hover::after {
      width: 100%;
    }
  }

  .resend-icon {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  a:hover .resend-icon {
    transform: rotate(180deg);
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 12px;
  }
`;

// ============================================
// MESSAGE
// ============================================
const PremiumMessage = styled.div`
  margin-top: 14px;
  font-size: 13px;
  min-height: 36px;
  padding: 8px 16px;
  border-radius: 24px;
  background: ${props => props.isError ? 'rgba(239, 68, 68, 0.04)' : 'rgba(0, 0, 0, 0.08)'};
  color: ${props => props.color || '#94a3b8'};
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid ${props => props.isError ? 'rgba(239, 68, 68, 0.04)' : 'transparent'};

  .msg-icon {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    min-height: 30px;
    padding: 6px 12px;
    border-radius: 18px;
    .msg-icon { font-size: 12px; }
  }
`;

// ============================================
// FOOTER LINKS
// ============================================
const PremiumFooter = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: center;
  gap: 4px;
  font-size: 13px;
  color: #94a3b8;

  a {
    color: #38bdf8;
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
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      transition: width 0.3s ease;
    }

    &:hover {
      color: #7dd3fc;
    }

    &:hover::after {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 14px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const VerifyResetCode = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setMessage('No email found. Please request a password reset.');
      setMessageColor('#fbbf24');
      setIsError(false);
      
      setTimeout(() => {
        navigate('/forgotpass');
      }, 2000);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [navigate]);

  const shakeContainer = () => {
    if (containerRef.current) {
      containerRef.current.classList.add('error-shake');
      setTimeout(() => {
        containerRef.current.classList.remove('error-shake');
      }, 400);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    
    if (message && messageColor === '#f87171') {
      setMessage('');
      setMessageColor('#94a3b8');
      setIsError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const codeTrimmed = code.trim();
    
    setMessage('');
    setMessageColor('#94a3b8');
    setIsError(false);

    if (!codeTrimmed || codeTrimmed.length !== 6) {
      setMessage('Please enter the complete 6-digit verification code');
      setMessageColor('#f87171');
      setIsError(true);
      shakeContainer();
      return;
    }

    if (!email) {
      setMessage('No email found. Please request a password reset.');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('Verifying code...');
    setMessageColor('#94a3b8');
    setIsError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          code: codeTrimmed 
        })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('resetToken', data.reset_token);
        
        setMessage('Code verified! Redirecting...');
        setMessageColor('#22c55e');
        setIsError(false);
        setIsLoading(false);

        setTimeout(() => {
          navigate('/resetpass');
        }, 1500);
      } else {
        setMessage(`${data.error || 'Invalid verification code'}`);
        setMessageColor('#f87171');
        setIsError(true);
        setIsLoading(false);
        shakeContainer();
        setCode('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('Cannot connect to server. Please try again.');
      setMessageColor('#f87171');
      setIsError(true);
      setIsLoading(false);
      shakeContainer();
    }
  };

  const handleResend = async () => {
    if (isResending) return;

    if (!email) {
      setMessage('No email found. Please request a password reset.');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    setIsResending(true);
    setMessage('Resending code...');
    setMessageColor('#94a3b8');
    setIsError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New code sent to your email!');
        setMessageColor('#22c55e');
        setIsError(false);
        setCode('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        setMessage(`${data.error || 'Failed to resend code'}`);
        setMessageColor('#f87171');
        setIsError(true);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Cannot connect to server. Please try again.');
      setMessageColor('#f87171');
      setIsError(true);
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
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

      <Container ref={containerRef}>
        <div className="shimmer-overlay" />

        <BrandSection>
          <PremiumLogo>
            <span className="logo-icon">🔷</span>
            <span className="logo-text">Voltix Traders</span>
            <span className="status-dot" />
          </PremiumLogo>
          <Title>
            <span className="gradient-text">Verify Code</span>
          </Title>
          <Subhead>We sent a 6-digit code to your email</Subhead>
        </BrandSection>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <FloatingLabel>
              <span className="icon">◈</span> Verification Code
            </FloatingLabel>
            <PremiumInputWrapper>
              <CodeInput
                ref={inputRef}
                type="text"
                maxLength="6"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                onKeyPress={handleKeyPress}
                autoFocus
                disabled={isLoading}
                aria-label="6-digit verification code"
              />
            </PremiumInputWrapper>
          </InputGroup>

          <PremiumButton type="submit" disabled={isLoading}>
            <div className="btn-shimmer" />
            <div className="btn-glow" />
            <span className="btn-content">
              {isLoading ? 'Verifying...' : 'Verify Code →'}
            </span>
          </PremiumButton>
        </Form>

        <ResendLink>
          <a onClick={handleResend} style={{ opacity: isResending ? 0.6 : 1 }}>
            <span className="resend-icon">⟳</span>
            {isResending ? ' Sending...' : " Didn't receive code? Resend"}
          </a>
        </ResendLink>

        <PremiumMessage color={messageColor} isError={isError}>
          <span className="msg-icon">
            {isError ? '✗' : messageColor === '#22c55e' ? '✓' : 'i'}
          </span>
          {message || '\u00A0'}
        </PremiumMessage>

        <PremiumFooter>
          <Link to="/forgotpass">← Back</Link>
        </PremiumFooter>
      </Container>
    </>
  );
};

export default VerifyResetCode;