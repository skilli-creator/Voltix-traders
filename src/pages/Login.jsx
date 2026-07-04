import React, { useState } from 'react';
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
`;

// ============================================
// ANIMATIONS
// ============================================
const floatIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(60px) scale(0.92) rotateX(5deg);
    filter: blur(8px);
  }
  60% { 
    transform: translateY(-8px) scale(1.01) rotateX(0deg);
    filter: blur(0px);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0px);
  }
`;

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const shimmer = keyframes`
  0% { background-position: -300% center; }
  100% { background-position: 300% center; }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.08); }
`;

const slideGlow = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(200%) skewX(-20deg); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
    background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 280px;
    height: 280px;
    bottom: -120px;
    left: -80px;
    background: radial-gradient(circle, rgba(129, 140, 248, 0.08), transparent 70%);
    animation-delay: -2.5s;
  }

  &:nth-child(3) {
    width: 180px;
    height: 180px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(192, 132, 252, 0.05), transparent 70%);
    animation-delay: -5s;
  }
`;

const GlowLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
  opacity: 0.08;
`;

// ============================================
// FLOATING FORM CONTAINER (PHONE PREMIUM)
// ============================================
const FloatingFormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 0;
  background: transparent;
  position: relative;
  z-index: 2;
  animation: ${floatIn} 0.9s cubic-bezier(0.16, 1, 0.3, 1);

  /* Phone: floating card with shadow */
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 8px;
  }
`;

const FormCard = styled.div`
  background: rgba(8, 18, 38, 0.65);
  backdrop-filter: blur(32px);
  border-radius: 48px;
  padding: 36px 28px 32px;
  border: 1px solid rgba(56, 189, 248, 0.06);
  box-shadow: 
    0 40px 100px -20px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(56, 189, 248, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;

  /* Animated gradient border */
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
      transparent,
      rgba(192, 132, 252, 0.04),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 15s linear infinite;
    pointer-events: none;
  }

  /* Top glow */
  &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: 20%;
    right: 20%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
    opacity: 0.15;
    border-radius: 0 0 4px 4px;
  }

  /* Floating shimmer overlay */
  .shimmer-overlay {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 40%, rgba(56, 189, 248, 0.02), transparent 60%);
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 28px 18px 24px;
    border-radius: 32px;
    &::before {
      border-radius: 33px;
    }
  }
`;

// ============================================
// PREMIUM BRAND SECTION
// ============================================
const BrandSection = styled.div`
  text-align: center;
  margin-bottom: 28px;

  @media (max-width: 480px) {
    margin-bottom: 20px;
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
  position: relative;

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

const PremiumTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 2px;

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

const PremiumSubhead = styled.p`
  font-size: 13px;
  color: #94a3b8;
  font-weight: 400;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

// ============================================
// TOGGLE - PREMIUM
// ============================================
const ToggleWrapper = styled.div`
  display: flex;
  gap: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 40px;
  padding: 4px;
  margin-bottom: 22px;
  border: 1px solid rgba(255, 255, 255, 0.03);

  @media (max-width: 480px) {
    padding: 3px;
    gap: 4px;
    margin-bottom: 16px;
  }
`;

const ToggleOption = styled.button`
  flex: 1;
  padding: 8px 12px;
  border-radius: 32px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.active ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'transparent'};
  color: ${props => props.active ? '#0a0f1f' : '#94a3b8'};
  border: none;
  position: relative;
  overflow: hidden;

  ${props => props.active && `
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.2);
  `}

  .toggle-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
    animation: ${props => props.active ? slideGlow : 'none'} 3s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 11px;
  }
`;

// ============================================
// FORM ELEMENTS - PREMIUM
// ============================================
const Form = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 14px;
  text-align: left;

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const FloatingLabel = styled.label`
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.6px;

  .icon {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 9px;
    .icon { font-size: 10px; }
  }
`;

const PremiumInputWrapper = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  border: 1.5px solid rgba(255, 255, 255, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(135deg, transparent, rgba(56, 189, 248, 0.03), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:focus-within {
    border-color: rgba(56, 189, 248, 0.15);
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.04);
    background: rgba(255, 255, 255, 0.04);
  }

  &:focus-within::before {
    opacity: 1;
  }

  @media (max-width: 480px) {
    border-radius: 18px;
    border-width: 1px;
  }
`;

const PremiumInput = styled.input`
  width: 100%;
  padding: 11px 16px;
  background: transparent;
  border: none;
  color: #f1f5f9;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  letter-spacing: 0.2px;

  &::placeholder {
    color: #4b5563;
    font-size: 13px;
    font-weight: 400;
  }

  @media (max-width: 480px) {
    padding: 9px 12px;
    font-size: 13px;
    &::placeholder { font-size: 12px; }
  }
`;

// ============================================
// SPLIT ROW - PHONE OPTIMIZED
// ============================================
const SplitRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

// ============================================
// PREMIUM BUTTON
// ============================================
const PremiumButton = styled.button`
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 32px;
  background: linear-gradient(135deg, #22c55e, #16a34a, #0d9488);
  background-size: 200% 200%;
  color: #0a0f1f;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-top: 4px;
  box-shadow: 0 4px 30px rgba(34, 197, 94, 0.12);
  animation: ${shimmer} 6s ease-in-out infinite;

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    z-index: 2;
  }

  .btn-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${slideGlow} 4s ease-in-out infinite;
    z-index: 1;
  }

  .btn-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.06), transparent 70%);
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: 0;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 8px 40px rgba(34, 197, 94, 0.2);
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
// OPTIONS ROW
// ============================================
const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0 18px;

  @media (max-width: 480px) {
    margin: 8px 0 14px;
  }
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #94a3b8;
  cursor: pointer;

  input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: #22c55e;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    input[type="checkbox"] {
      width: 12px;
      height: 12px;
    }
  }
`;

const ForgotLink = styled(Link)`
  color: #38bdf8;
  cursor: pointer;
  font-size: 11px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #7dd3fc;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

// ============================================
// MESSAGE
// ============================================
const PremiumMessage = styled.div`
  margin-top: 12px;
  font-size: 12px;
  min-height: 34px;
  padding: 6px 14px;
  border-radius: 24px;
  background: ${props => props.isError ? 'rgba(239, 68, 68, 0.04)' : 'rgba(0, 0, 0, 0.12)'};
  color: ${props => props.color || '#94a3b8'};
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid ${props => props.isError ? 'rgba(239, 68, 68, 0.06)' : 'transparent'};

  .msg-icon {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    min-height: 28px;
    padding: 4px 10px;
    border-radius: 18px;
    .msg-icon { font-size: 11px; }
  }
`;

// ============================================
// RESEND BUTTON
// ============================================
const ResendButton = styled.button`
  width: 100%;
  padding: 9px;
  margin-top: 8px;
  border: none;
  border-radius: 24px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(59, 130, 246, 0.2);
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 7px;
    font-size: 11px;
    border-radius: 20px;
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
  font-size: 12px;
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
    font-size: 11px;
    margin-top: 14px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Login = () => {
  const navigate = useNavigate();
  const [activeMethod, setActiveMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendUserId, setResendUserId] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  const handleMethodToggle = (method) => {
    setActiveMethod(method);
    setMessage('');
    setMessageColor('#94a3b8');
    setIsError(false);
    setShowResendButton(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResendVerification = async () => {
    if (!resendEmail) {
      setMessage('No email found. Please register again.');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('Resending verification code...');
    setMessageColor('#94a3b8');
    setIsError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: resendEmail,
          user_id: resendUserId 
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userEmail', resendEmail);
        if (resendUserId) {
          localStorage.setItem('tempUserId', resendUserId);
        }
        
        setMessage('✅ New code sent! Redirecting...');
        setMessageColor('#22c55e');
        setIsError(false);
        setIsLoading(false);
        setShowResendButton(false);
        
        setTimeout(() => {
          navigate('/verify');
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || 'Failed to resend'}`);
        setMessageColor('#f87171');
        setIsError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Cannot connect to server.');
      setMessageColor('#f87171');
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordTrimmed = password.trim();
    let identifier = '';
    let isValid = true;

    if (activeMethod === 'email') {
      identifier = email.trim();
      if (!identifier || !identifier.includes('@')) {
        setMessage('Valid email required');
        setMessageColor('#f87171');
        setIsError(true);
        isValid = false;
      }
    } else {
      identifier = phone.trim();
      if (!identifier) {
        setMessage('Phone number required');
        setMessageColor('#f87171');
        setIsError(true);
        isValid = false;
      } else if (!validatePhone(identifier)) {
        setMessage('Valid phone with country code');
        setMessageColor('#f87171');
        setIsError(true);
        isValid = false;
      }
    }

    if (!passwordTrimmed) {
      setMessage('Password required');
      setMessageColor('#f87171');
      setIsError(true);
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    setMessage('Authenticating...');
    setMessageColor('#94a3b8');
    setIsError(false);
    setShowResendButton(false);

    try {
      const payload = activeMethod === 'email' 
        ? { email: identifier, password: passwordTrimmed }
        : { phone: identifier, password: passwordTrimmed };

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Welcome back! Redirecting...');
        setMessageColor('#22c55e');
        setIsError(false);
        setIsLoading(false);
        
        setTimeout(() => {
          navigate('/marketsdash');
        }, 1500);
      } else {
        const errorMsg = data.error || '';
        if (errorMsg.toLowerCase().includes('verify')) {
          setResendEmail(identifier);
          setResendUserId(data.user_id || null);
          setShowResendButton(true);
          setMessage(`⚠️ ${errorMsg}`);
          setMessageColor('#fbbf24');
          setIsError(false);
          setIsLoading(false);
        } else {
          setMessage(`❌ ${errorMsg || 'Login failed'}`);
          setMessageColor('#f87171');
          setIsError(true);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Cannot connect to server.');
      setMessageColor('#f87171');
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      
      <BackgroundContainer>
        <GradientOrb />
        <GradientOrb />
        <GradientOrb />
        <GlowLine />
      </BackgroundContainer>

      <FloatingFormContainer>
        <FormCard>
          <div className="shimmer-overlay" />

          <BrandSection>
            <PremiumLogo>
              <span className="logo-icon">🔷</span>
              <span className="logo-text">Voltix Traders</span>
              <span className="status-dot" />
            </PremiumLogo>
            <PremiumTitle>
              Welcome <span className="gradient-text">Back</span>
            </PremiumTitle>
            <PremiumSubhead>Access your trading dashboard</PremiumSubhead>
          </BrandSection>

          <ToggleWrapper>
            <ToggleOption 
              active={activeMethod === 'email'} 
              onClick={() => handleMethodToggle('email')}
            >
              <span className="toggle-shimmer" />
              📧 Email
            </ToggleOption>
            <ToggleOption 
              active={activeMethod === 'phone'} 
              onClick={() => handleMethodToggle('phone')}
            >
              <span className="toggle-shimmer" />
              📱 Phone
            </ToggleOption>
          </ToggleWrapper>

          <Form onSubmit={handleSubmit}>
            {activeMethod === 'email' ? (
              <InputGroup>
                <FloatingLabel>
                  <span className="icon">📧</span> Email Address
                </FloatingLabel>
                <PremiumInputWrapper>
                  <PremiumInput
                    type="email"
                    placeholder="trader@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </PremiumInputWrapper>
              </InputGroup>
            ) : (
              <InputGroup>
                <FloatingLabel>
                  <span className="icon">📞</span> Phone Number
                </FloatingLabel>
                <PremiumInputWrapper>
                  <PremiumInput
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </PremiumInputWrapper>
              </InputGroup>
            )}

            <InputGroup>
              <FloatingLabel>
                <span className="icon">🔒</span> Password
              </FloatingLabel>
              <PremiumInputWrapper>
                <PremiumInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '15px',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </PremiumInputWrapper>
            </InputGroup>

            <OptionsRow>
              <RememberMe>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </RememberMe>
              <ForgotLink to="/forgotpass">
                Forgot password?
              </ForgotLink>
            </OptionsRow>

            <PremiumButton type="submit" disabled={isLoading}>
              <div className="btn-shimmer" />
              <div className="btn-glow" />
              <div className="btn-content">
                {isLoading ? '⏳ Signing In...' : '🚀 Sign In'}
              </div>
            </PremiumButton>
          </Form>

          <PremiumMessage color={messageColor} isError={isError}>
            <span className="msg-icon">
              {isError ? '❌' : messageColor === '#22c55e' ? '✅' : messageColor === '#fbbf24' ? '⚠️' : 'ℹ️'}
            </span>
            {message || '\u00A0'}
          </PremiumMessage>

          {showResendButton && (
            <ResendButton onClick={handleResendVerification} disabled={isLoading}>
              📧 Resend Verification Code
            </ResendButton>
          )}

          <PremiumFooter>
            New to Voltix? <Link to="/register">Create free account →</Link>
          </PremiumFooter>
        </FormCard>
      </FloatingFormContainer>
    </>
  );
};

export default Login;