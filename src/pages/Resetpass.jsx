import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
// MAIN CONTAINER
// ============================================
const Container = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px 32px 32px;
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
  gap: 8px;
  padding: 5px 18px 5px 12px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.06), rgba(56, 189, 248, 0.02));
  border: 1px solid rgba(34, 197, 94, 0.04);
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
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
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

// ============================================
// FORM ELEMENTS
// ============================================
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

const FloatingLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .icon {
    font-size: 13px;
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

const TogglePasswordBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background: none;
  border: none;
  font-size: 15px;
  color: #6b7280;
  padding: 4px;
  transition: color 0.3s ease;

  &:hover {
    color: #f1f5f9;
  }

  @media (max-width: 480px) {
    right: 10px;
    font-size: 13px;
  }
`;

// ============================================
// PASSWORD STRENGTH
// ============================================
const StrengthContainer = styled.div`
  margin-top: 6px;
`;

const StrengthMeter = styled.div`
  height: 3px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  width: ${props => props.width || '0%'};
  height: 100%;
  background: ${props => props.color || '#ef4444'};
  transition: width 0.4s ease;
  border-radius: 4px;
  box-shadow: 0 0 20px ${props => props.color ? `${props.color}30` : 'transparent'};
`;

const StrengthText = styled.div`
  font-size: 10px;
  margin-top: 3px;
  color: ${props => props.color || '#6b7280'};
  transition: color 0.3s ease;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 9px;
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

// ============================================
// MAIN COMPONENT
// ============================================

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthWidth, setStrengthWidth] = useState('0%');
  const [strengthColor, setStrengthColor] = useState('#ef4444');
  const [strengthLabel, setStrengthLabel] = useState('Enter a strong password');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      sessionStorage.setItem('resetToken', tokenFromUrl);
    } else {
      const storedToken = sessionStorage.getItem('resetToken');
      if (storedToken) {
        setResetToken(storedToken);
      } else {
        setMessage('No reset token found. Please request a password reset.');
        setMessageColor('#fbbf24');
        setIsError(false);
        
        setTimeout(() => {
          navigate('/forgotpass');
        }, 2000);
      }
    }
  }, [location, navigate]);

  const checkStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    
    const widthMap = ['0%', '20%', '40%', '60%', '80%', '100%'];
    const colorMap = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#22c55e', '#2dd4bf'];
    const textMap = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
    
    setStrengthScore(score);
    setStrengthWidth(widthMap[score]);
    setStrengthColor(colorMap[score]);
    setStrengthLabel(textMap[score]);
    
    return score;
  };

  useEffect(() => {
    if (newPassword) {
      checkStrength(newPassword);
    } else {
      setStrengthWidth('0%');
      setStrengthColor('#ef4444');
      setStrengthLabel('Enter a strong password');
    }
  }, [newPassword]);

  const togglePasswordVisibility = (field) => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const shakeContainer = () => {
    if (containerRef.current) {
      containerRef.current.classList.add('error-shake');
      setTimeout(() => {
        containerRef.current.classList.remove('error-shake');
      }, 400);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newPasswordTrimmed = newPassword.trim();
    const confirmPasswordTrimmed = confirmPassword.trim();
    
    setMessage('');
    setMessageColor('#94a3b8');
    setIsError(false);

    if (!newPasswordTrimmed || !confirmPasswordTrimmed) {
      setMessage('Please fill in all fields');
      setMessageColor('#f87171');
      setIsError(true);
      shakeContainer();
      return;
    }

    if (newPasswordTrimmed !== confirmPasswordTrimmed) {
      setMessage('Passwords do not match');
      setMessageColor('#f87171');
      setIsError(true);
      shakeContainer();
      return;
    }

    if (newPasswordTrimmed.length < 6) {
      setMessage('Password must be at least 6 characters');
      setMessageColor('#f87171');
      setIsError(true);
      shakeContainer();
      return;
    }

    const strength = checkStrength(newPasswordTrimmed);
    if (strength < 2) {
      setMessage('Please choose a stronger password');
      setMessageColor('#f87171');
      setIsError(true);
      shakeContainer();
      return;
    }

    if (!resetToken) {
      setMessage('No reset token found. Please request a new password reset.');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('Resetting password...');
    setMessageColor('#94a3b8');
    setIsError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: newPasswordTrimmed,
          confirm_password: confirmPasswordTrimmed
        })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.clear();
        localStorage.removeItem('resetToken');
        
        setMessage('✅ Password reset successful! Redirecting to login...');
        setMessageColor('#22c55e');
        setIsError(false);
        setIsLoading(false);

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`❌ ${data.error || 'Reset failed'}`);
        setMessageColor('#f87171');
        setIsError(true);
        setIsLoading(false);
        shakeContainer();
      }
    } catch (error) {
      console.error('Reset error:', error);
      setMessage('Cannot connect to server. Please try again.');
      setMessageColor('#f87171');
      setIsError(true);
      setIsLoading(false);
      shakeContainer();
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
        <BrandSection>
          <PremiumLogo>
            <span className="logo-icon">🔷</span>
            <span className="logo-text">Voltix Traders</span>
            <span className="status-dot" />
          </PremiumLogo>
          <Title>
            <span className="gradient-text">Create New Password</span>
          </Title>
          <Subhead>Enter your new password below</Subhead>
        </BrandSection>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <FloatingLabel>
              <span className="icon">🔒</span> New Password
            </FloatingLabel>
            <PremiumInputWrapper>
              <PremiumInput
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoFocus
                required
              />
              <TogglePasswordBtn
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                aria-label="Toggle password visibility"
              >
                {showNewPassword ? '🙈' : '👁️'}
              </TogglePasswordBtn>
            </PremiumInputWrapper>
            
            <StrengthContainer>
              <StrengthMeter>
                <StrengthFill width={strengthWidth} color={strengthColor} />
              </StrengthMeter>
              <StrengthText color={strengthColor}>
                {strengthLabel}
              </StrengthText>
            </StrengthContainer>
          </InputGroup>

          <InputGroup>
            <FloatingLabel>
              <span className="icon">✓</span> Confirm Password
            </FloatingLabel>
            <PremiumInputWrapper>
              <PremiumInput
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <TogglePasswordBtn
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </TogglePasswordBtn>
            </PremiumInputWrapper>
          </InputGroup>

          <PremiumButton type="submit" disabled={isLoading}>
            <div className="btn-shimmer" />
            <div className="btn-glow" />
            <span className="btn-content">
              {isLoading ? '⏳ Resetting...' : 'Reset Password →'}
            </span>
          </PremiumButton>
        </Form>

        <PremiumMessage color={messageColor} isError={isError}>
          <span className="msg-icon">
            {isError ? '❌' : messageColor === '#22c55e' ? '✅' : 'ℹ️'}
          </span>
          {message || '\u00A0'}
        </PremiumMessage>

        <PremiumFooter>
          <Link to="/login">← Back to Login</Link>
        </PremiumFooter>
      </Container>
    </>
  );
};

export default ResetPassword;