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
    background: #060b18;
    color: #f1f5f9;
    padding: 12px;
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
// KEYFRAMES - ADVANCED ANIMATIONS
// ============================================
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
`;

const slideGlow = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

// ============================================
// STYLED COMPONENTS - ADVANCED
// ============================================

// ---- Background Particles ----
const ParticleContainer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.size || '4px'};
  height: ${props => props.size || '4px'};
  background: ${props => props.color || 'rgba(56, 189, 248, 0.3)'};
  border-radius: 50%;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  box-shadow: 0 0 20px ${props => props.color || 'rgba(56, 189, 248, 0.1)'};
`;

// ---- Background Orbs ----
const OrbContainer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: ${breathe} 6s ease-in-out infinite;

  &:nth-child(1) {
    width: 350px;
    height: 350px;
    top: -150px;
    right: -100px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 300px;
    height: 300px;
    bottom: -120px;
    left: -80px;
    background: radial-gradient(circle, rgba(129, 140, 248, 0.08), transparent 70%);
    animation-delay: -2s;
  }

  &:nth-child(3) {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(192, 132, 252, 0.06), transparent 70%);
    animation-delay: -4s;
  }

  @media (max-width: 480px) {
    &:nth-child(1) {
      width: 200px;
      height: 200px;
      top: -100px;
      right: -60px;
    }
    &:nth-child(2) {
      width: 180px;
      height: 180px;
      bottom: -80px;
      left: -50px;
    }
    &:nth-child(3) {
      width: 120px;
      height: 120px;
    }
  }
`;

// ---- Main Container ----
const LoginContainer = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px 32px 32px;
  background: rgba(8, 18, 38, 0.6);
  backdrop-filter: blur(32px);
  border-radius: 48px;
  position: relative;
  z-index: 2;
  animation: ${fadeSlideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(56, 189, 248, 0.06);
  box-shadow: 0 32px 80px -16px rgba(0, 0, 0, 0.6);

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
      rgba(56, 189, 248, 0.1),
      transparent,
      rgba(129, 140, 248, 0.1),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 8s linear infinite;
    pointer-events: none;
  }

  /* Top glow line */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
    opacity: 0.3;
    border-radius: 0 0 4px 4px;
  }

  @media (max-width: 480px) {
    padding: 28px 18px 24px;
    border-radius: 32px;
    max-width: 100%;

    &::before {
      border-radius: 33px;
    }
  }
`;

// ---- Brand Section ----
const BrandSection = styled.div`
  text-align: center;
  margin-bottom: 28px;

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const LogoWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px 6px 12px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.04));
  border: 1px solid rgba(34, 197, 94, 0.1);
  border-radius: 40px;
  margin-bottom: 14px;

  .logo-icon {
    font-size: 16px;
  }

  .logo-text {
    font-size: 11px;
    font-weight: 600;
    color: #4ade80;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: ${pulseRing} 2s ease-out infinite;
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
    padding: 4px 14px 4px 10px;
    .logo-text {
      font-size: 10px;
    }
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #f1f5f9, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 4px;

  .highlight {
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
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

// ---- Toggle ----
const MethodToggle = styled.div`
  display: flex;
  gap: 6px;
  background: rgba(0, 0, 0, 0.35);
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
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.active ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'transparent'};
  color: ${props => props.active ? '#0a0f1f' : '#94a3b8'};
  border: none;
  position: relative;
  overflow: hidden;

  ${props => props.active && `
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.25);
  `}

  .btn-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    animation: ${props => props.active ? slideGlow : 'none'} 3s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 11px;
  }
`;

// ---- Form ----
const Form = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
  text-align: left;

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const InputLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;

  .label-icon {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 4px;
    .label-icon {
      font-size: 12px;
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1.5px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: rgba(34, 197, 94, 0.3);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.06);
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 480px) {
    border-radius: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #f1f5f9;
  font-size: 14px;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: #4b5563;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 13px;
    &::placeholder {
      font-size: 12px;
    }
  }
`;

const TogglePasswordBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background: none;
  border: none;
  font-size: 16px;
  color: #6b7280;
  padding: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #f1f5f9;
  }

  @media (max-width: 480px) {
    right: 10px;
    font-size: 14px;
  }
`;

const PhoneHelper = styled.div`
  font-size: 10px;
  color: #4b5563;
  margin-top: 4px;
  padding-left: 4px;

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

// ---- Options ----
const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 14px 0 22px;

  @media (max-width: 480px) {
    margin: 10px 0 16px;
  }
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
  cursor: pointer;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #22c55e;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    input[type="checkbox"] {
      width: 14px;
      height: 14px;
    }
  }
`;

const ForgotLink = styled(Link)`
  color: #38bdf8;
  cursor: pointer;
  font-size: 12px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #7dd3fc;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

// ---- Login Button ----
const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 32px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #0a0f1f;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(34, 197, 94, 0.15);

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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    animation: ${slideGlow} 4s ease-in-out infinite;
  }

  .btn-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 40px rgba(34, 197, 94, 0.3);
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
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
    border-radius: 28px;
  }
`;

// ---- Message ----
const MessageArea = styled.div`
  margin-top: 14px;
  font-size: 13px;
  min-height: 36px;
  padding: 8px 14px;
  border-radius: 24px;
  background: ${props => props.isError ? 'rgba(239, 68, 68, 0.06)' : 'rgba(0, 0, 0, 0.2)'};
  color: ${props => props.color || '#94a3b8'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid ${props => props.isError ? 'rgba(239, 68, 68, 0.08)' : 'transparent'};

  .msg-icon {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    min-height: 32px;
    padding: 6px 10px;
    border-radius: 18px;
    .msg-icon {
      font-size: 12px;
    }
  }
`;

// ---- Resend Button ----
const ResendButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 28px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(59, 130, 246, 0.3);
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 12px;
    border-radius: 22px;
  }
`;

// ---- Footer Links ----
const FooterLinks = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;

  a {
    color: #38bdf8;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #7dd3fc;
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 16px;
    gap: 4px;
  }
`;

// ============================================
// PARTICLES DATA
// ============================================
const particles = [
  { size: '3px', top: '10%', left: '5%', duration: '8s', delay: '0s', color: 'rgba(56, 189, 248, 0.2)' },
  { size: '4px', top: '20%', left: '85%', duration: '10s', delay: '1s', color: 'rgba(129, 140, 248, 0.15)' },
  { size: '2px', top: '40%', left: '10%', duration: '7s', delay: '2s', color: 'rgba(192, 132, 252, 0.2)' },
  { size: '5px', top: '60%', left: '90%', duration: '12s', delay: '0.5s', color: 'rgba(56, 189, 248, 0.15)' },
  { size: '3px', top: '75%', left: '15%', duration: '9s', delay: '3s', color: 'rgba(129, 140, 248, 0.2)' },
  { size: '4px', top: '85%', left: '80%', duration: '11s', delay: '1.5s', color: 'rgba(192, 132, 252, 0.15)' },
  { size: '2px', top: '5%', left: '50%', duration: '6s', delay: '2.5s', color: 'rgba(56, 189, 248, 0.3)' },
  { size: '3px', top: '95%', left: '45%', duration: '13s', delay: '0.8s', color: 'rgba(129, 140, 248, 0.15)' },
];

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
        
        setMessage('✅ New verification code sent! Redirecting...');
        setMessageColor('#22c55e');
        setIsError(false);
        setIsLoading(false);
        setShowResendButton(false);
        
        setTimeout(() => {
          navigate('/verify');
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || 'Failed to resend code'}`);
        setMessageColor('#f87171');
        setIsError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Cannot connect to server. Please try again.');
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
        setMessage('Please enter a valid email address');
        setMessageColor('#f87171');
        setIsError(true);
        isValid = false;
      }
    } else {
      identifier = phone.trim();
      if (!identifier) {
        setMessage('Please enter your phone number');
        setMessageColor('#f87171');
        setIsError(true);
        isValid = false;
      } else if (!validatePhone(identifier)) {
        setMessage('Please enter a valid phone number with country code');
        setMessageColor('#f87171');
        setIsError(true);
        isValid = false;
      }
    }

    if (!passwordTrimmed) {
      setMessage('Please enter your password');
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
        setMessage('✅ Login successful! Redirecting...');
        setMessageColor('#22c55e');
        setIsError(false);
        setIsLoading(false);
        
        setTimeout(() => {
          navigate('/marketsdash');
        }, 1500);
      } else {
        const errorMsg = data.error || '';
        if (errorMsg.toLowerCase().includes('verify') || errorMsg.toLowerCase().includes('verified')) {
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
      setMessage('Cannot connect to server. Please try again.');
      setMessageColor('#f87171');
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      
      <OrbContainer>
        <Orb />
        <Orb />
        <Orb />
      </OrbContainer>

      <ParticleContainer>
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </ParticleContainer>

      <LoginContainer>
        <BrandSection>
          <LogoWrapper>
            <span className="logo-icon">🔷</span>
            <span className="logo-text">Voltix Traders</span>
            <span className="live-dot" />
          </LogoWrapper>
          <Title>
            Welcome <span className="highlight">Back</span>
          </Title>
          <Subhead>Access your trading dashboard</Subhead>
        </BrandSection>

        <MethodToggle>
          <ToggleOption 
            active={activeMethod === 'email'} 
            onClick={() => handleMethodToggle('email')}
          >
            <span className="btn-shimmer" />
            📧 Email
          </ToggleOption>
          <ToggleOption 
            active={activeMethod === 'phone'} 
            onClick={() => handleMethodToggle('phone')}
          >
            <span className="btn-shimmer" />
            📱 Phone
          </ToggleOption>
        </MethodToggle>

        <Form onSubmit={handleSubmit}>
          {activeMethod === 'email' && (
            <InputGroup>
              <InputLabel>
                <span className="label-icon">📧</span> Email Address
              </InputLabel>
              <InputWrapper>
                <Input
                  type="email"
                  placeholder="trader@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </InputWrapper>
            </InputGroup>
          )}

          {activeMethod === 'phone' && (
            <InputGroup>
              <InputLabel>
                <span className="label-icon">📞</span> Phone Number
              </InputLabel>
              <InputWrapper>
                <Input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </InputWrapper>
              <PhoneHelper>Include country code (e.g., +1, +44)</PhoneHelper>
            </InputGroup>
          )}

          <InputGroup>
            <InputLabel>
              <span className="label-icon">🔒</span> Password
            </InputLabel>
            <InputWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TogglePasswordBtn 
                type="button" 
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️'}
              </TogglePasswordBtn>
            </InputWrapper>
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

          <LoginButton type="submit" disabled={isLoading}>
            <div className="btn-shimmer" />
            <div className="btn-glow" />
            <div className="btn-content">
              {isLoading ? '⏳ Signing In...' : '🚀 Sign In'}
            </div>
          </LoginButton>
        </Form>

        <MessageArea color={messageColor} isError={isError}>
          <span className="msg-icon">
            {isError ? '❌' : messageColor === '#22c55e' ? '✅' : messageColor === '#fbbf24' ? '⚠️' : 'ℹ️'}
          </span>
          {message || '\u00A0'}
        </MessageArea>

        {showResendButton && (
          <ResendButton onClick={handleResendVerification} disabled={isLoading}>
            📧 Resend Verification Code
          </ResendButton>
        )}

        <FooterLinks>
          New to Voltix? <Link to="/register">Create free account →</Link>
        </FooterLinks>
      </LoginContainer>
    </>
  );
};

export default Login;