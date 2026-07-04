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
// MAIN CONTAINER - LOGIN.JSX STYLE
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
// DESTINATION INFO
// ============================================
const DestinationInfo = styled.div`
  background: rgba(34, 197, 94, 0.04);
  padding: 10px 16px;
  border-radius: 24px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #cbd5e1;
  border: 1px solid rgba(34, 197, 94, 0.04);
  text-align: center;

  span {
    color: #22c55e;
    font-weight: 600;
  }

  .icon {
    font-size: 13px;
    color: #4b5563;
    margin-right: 6px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 12px;
  }
`;

// ============================================
// CODE INPUTS
// ============================================
const CodeInputs = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0 16px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const CodeDigit = styled.input`
  width: 52px;
  height: 58px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.02);
  border: 1.5px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  color: #f1f5f9;
  outline: none;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
  animation: ${popIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:focus {
    border-color: rgba(34, 197, 94, 0.12);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.03);
    background: rgba(255, 255, 255, 0.03);
    animation: ${inputFocus} 0.3s ease;
  }

  &::placeholder {
    color: #4b5563;
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 50px;
    font-size: 20px;
    border-radius: 12px;
  }
`;

// ============================================
// TIMER SECTION
// ============================================
const TimerSection = styled.div`
  font-size: 13px;
  color: #94a3b8;
  margin: 12px 0;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Timer = styled.span`
  color: #facc15;
  font-weight: 600;
`;

const ResendLink = styled.span`
  color: ${props => props.canResend ? '#38bdf8' : '#64748b'};
  cursor: ${props => props.canResend ? 'pointer' : 'not-allowed'};
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: ${props => props.canResend ? 'underline' : 'none'};
    color: ${props => props.canResend ? '#7dd3fc' : '#64748b'};
  }

  @media (max-width: 480px) {
    font-size: 12px;
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

const FooterNote = styled.footer`
  position: fixed;
  bottom: 16px;
  width: 100%;
  text-align: center;
  font-size: 11px;
  color: #4b5563;
  z-index: 2;
  pointer-events: none;

  @media (max-width: 480px) {
    font-size: 10px;
    bottom: 12px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Verify = () => {
  const navigate = useNavigate();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || '';
    const id = localStorage.getItem('tempUserId');
    
    setUserEmail(email);
    setUserId(id);
    
    if (!email || !id) {
      setMessage('No verification session found. Please register again.');
      setMessageColor('#fbbf24');
      setIsError(false);
    }
  }, []);

  useEffect(() => {
    startTimer();
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    return () => {
      if (window.timerInterval) {
        clearInterval(window.timerInterval);
      }
    };
  }, []);

  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return email;
    const [local, domain] = email.split('@');
    const maskedLocal = local.length <= 3 
      ? local 
      : local.slice(0, 2) + '****' + local.slice(-1);
    return `${maskedLocal}@${domain}`;
  };

  const startTimer = () => {
    if (window.timerInterval) {
      clearInterval(window.timerInterval);
    }
    
    setTimeLeft(120);
    setCanResend(false);
    
    window.timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(window.timerInterval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (message && messageColor === '#f87171') {
      setMessage('');
      setMessageColor('#94a3b8');
      setIsError(false);
    }
    
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 6);
    
    if (digits) {
      const newCode = [...code];
      for (let i = 0; i < digits.length; i++) {
        newCode[i] = digits[i];
      }
      setCode(newCode);
      
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex].focus();
    }
  };

  const getEnteredCode = () => {
    return code.join('');
  };

  const verifyEmail = async () => {
    const enteredCode = getEnteredCode();
    
    if (enteredCode.length < 6) {
      setMessage('Please enter the complete 6-digit verification code');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }
    
    if (!userId) {
      setMessage('No user session found. Please register again.');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }
    
    setIsLoading(true);
    setMessage('Verifying...');
    setMessageColor('#94a3b8');
    setIsError(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: parseInt(userId), 
          code: enteredCode 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Email verified successfully! Redirecting...');
        setMessageColor('#22c55e');
        setIsError(false);
        setIsLoading(false);
        
        localStorage.removeItem('tempUserId');
        localStorage.removeItem('userEmail');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`${data.error || 'Invalid verification code'}`);
        setMessageColor('#f87171');
        setIsError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('Cannot connect to server. Please try again.');
      setMessageColor('#f87171');
      setIsError(true);
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (!canResend) {
      setMessage(`Please wait ${timeLeft} seconds before requesting a new code`);
      setMessageColor('#fbbf24');
      setIsError(false);
      return;
    }
    
    setMessage('Sending new verification code...');
    setMessageColor('#94a3b8');
    setIsError(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId) })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('New verification code sent to your email!');
        setMessageColor('#22c55e');
        setIsError(false);
        setCode(['', '', '', '', '', '']);
        startTimer();
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        setMessage(`${data.error || 'Failed to resend code'}`);
        setMessageColor('#f87171');
        setIsError(true);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Failed to resend code. Please try again.');
      setMessageColor('#f87171');
      setIsError(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verifyEmail();
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

      <Container>
        <div className="shimmer-overlay" />

        <BrandSection>
          <PremiumLogo>
            <span className="logo-icon">🔷</span>
            <span className="logo-text">Voltix Traders</span>
            <span className="status-dot" />
          </PremiumLogo>
          <Title>
            <span className="gradient-text">Verify Email</span>
          </Title>
          <Subhead>Enter the 6-digit code sent to your email</Subhead>
        </BrandSection>

        <DestinationInfo>
          <span className="icon">◈</span>
          Verification sent to <span>{maskEmail(userEmail)}</span>
        </DestinationInfo>

        <CodeInputs>
          {code.map((digit, index) => (
            <CodeDigit
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onKeyPress={handleKeyPress}
              onPaste={index === 0 ? handlePaste : undefined}
              autoFocus={index === 0}
              disabled={isLoading}
              aria-label={`Digit ${index + 1}`}
              placeholder="0"
            />
          ))}
        </CodeInputs>

        <TimerSection>
          <span>Code expires in </span>
          <Timer>{formatTime(timeLeft)}</Timer>
        </TimerSection>

        <TimerSection>
          <span>Didn't receive a code? </span>
          <ResendLink 
            canResend={canResend}
            onClick={resendCode}
          >
            Resend code
          </ResendLink>
        </TimerSection>

        <PremiumButton onClick={verifyEmail} disabled={isLoading}>
          <div className="btn-shimmer" />
          <div className="btn-glow" />
          <span className="btn-content">
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </span>
        </PremiumButton>

        <PremiumMessage color={messageColor} isError={isError}>
          <span className="msg-icon">
            {isError ? '✗' : messageColor === '#22c55e' ? '✓' : messageColor === '#fbbf24' ? '!' : 'i'}
          </span>
          {message || '\u00A0'}
        </PremiumMessage>

        <PremiumFooter>
          <Link to="/login">← Back to Login</Link>
        </PremiumFooter>
      </Container>

      <FooterNote>
        © 2026 Voltix — Email verification required for account security
      </FooterNote>
    </>
  );
};

export default Verify;