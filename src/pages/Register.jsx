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
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #050a18;
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
// ANIMATIONS
// ============================================
const floatIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(40px) scale(0.95);
    filter: blur(4px);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
`;

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
`;

const shimmer = keyframes`
  0% { background-position: -300% center; }
  100% { background-position: 300% center; }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.12; transform: scale(1); }
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
  filter: blur(80px);
  animation: ${breathe} 7s ease-in-out infinite;

  &:nth-child(1) {
    width: 250px;
    height: 250px;
    top: -100px;
    right: -80px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.10), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 200px;
    height: 200px;
    bottom: -80px;
    left: -60px;
    background: radial-gradient(circle, rgba(129, 140, 248, 0.06), transparent 70%);
    animation-delay: -2.5s;
  }

  &:nth-child(3) {
    width: 120px;
    height: 120px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(192, 132, 252, 0.04), transparent 70%);
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
  opacity: 0.06;
`;

// ============================================
// COMPACT FLOATING FORM
// ============================================
const FloatingFormContainer = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 0;
  position: relative;
  z-index: 2;
  animation: ${floatIn} 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 96vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 0 4px;
    max-height: 98vh;
  }
`;

const FormCard = styled.div`
  background: rgba(8, 18, 38, 0.6);
  backdrop-filter: blur(32px);
  border-radius: 36px;
  padding: 24px 22px 20px;
  border: 1px solid rgba(56, 189, 248, 0.04);
  box-shadow: 
    0 30px 80px -15px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(56, 189, 248, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 37px;
    padding: 1px;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(56, 189, 248, 0.05),
      transparent,
      rgba(129, 140, 248, 0.05),
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
    left: 25%;
    right: 25%;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
    opacity: 0.12;
    border-radius: 0 0 4px 4px;
  }

  @media (max-width: 480px) {
    padding: 18px 14px 16px;
    border-radius: 28px;
    &::before {
      border-radius: 29px;
    }
  }
`;

// ============================================
// BRAND SECTION - COMPACT
// ============================================
const BrandSection = styled.div`
  text-align: center;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const PremiumLogo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 14px 3px 10px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(129, 140, 248, 0.02));
  border: 1px solid rgba(56, 189, 248, 0.03);
  border-radius: 30px;
  margin-bottom: 8px;

  .logo-icon {
    font-size: 13px;
  }

  .logo-text {
    font-size: 10px;
    font-weight: 700;
    background: linear-gradient(135deg, #e0f2fe, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: 0.2px;
  }

  .status-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #22c55e;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite;
    }
  }

  @media (max-width: 480px) {
    padding: 2px 10px 2px 8px;
    .logo-text { font-size: 9px; }
    .logo-icon { font-size: 11px; }
  }
`;

const PremiumTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 1px;

  .gradient-text {
    background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ${shimmer} 6s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const PremiumSubhead = styled.p`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 400;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

// ============================================
// COMPACT FORM ELEMENTS
// ============================================
const Form = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 8px;
  text-align: left;

  @media (max-width: 480px) {
    margin-bottom: 6px;
  }
`;

const FloatingLabel = styled.label`
  font-size: 9px;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .icon {
    font-size: 10px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    .icon { font-size: 9px; }
  }
`;

const PremiumInputWrapper = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:focus-within {
    border-color: rgba(56, 189, 248, 0.12);
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.03);
    background: rgba(255, 255, 255, 0.03);
  }

  @media (max-width: 480px) {
    border-radius: 16px;
  }
`;

const PremiumInput = styled.input`
  width: 100%;
  padding: 8px 14px;
  background: transparent;
  border: none;
  color: #f1f5f9;
  font-size: 13px;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: #4b5563;
    font-size: 12px;
    font-weight: 400;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 12px;
    &::placeholder { font-size: 11px; }
  }
`;

const SplitRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const TogglePasswordBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background: none;
  border: none;
  font-size: 13px;
  color: #6b7280;
  padding: 2px;
  transition: color 0.3s ease;

  &:hover {
    color: #f1f5f9;
  }

  @media (max-width: 480px) {
    right: 8px;
    font-size: 11px;
  }
`;

const PhoneHelper = styled.div`
  font-size: 8px;
  color: #4b5563;
  margin-top: 1px;
  padding-left: 4px;

  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

// ============================================
// PASSWORD STRENGTH - COMPACT
// ============================================
const StrengthContainer = styled.div`
  margin-top: 3px;
`;

const StrengthMeter = styled.div`
  height: 2px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 2px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  width: ${props => props.width || '0%'};
  height: 100%;
  background: ${props => props.color || '#ef4444'};
  transition: width 0.4s ease;
  border-radius: 2px;
`;

const StrengthText = styled.div`
  font-size: 8px;
  margin-top: 2px;
  color: ${props => props.color || '#6b7280'};
  transition: color 0.3s ease;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

// ============================================
// BUTTON - COMPACT
// ============================================
const PremiumButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 24px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  background-size: 200% 200%;
  color: #0a0f1f;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-top: 2px;
  box-shadow: 0 3px 20px rgba(34, 197, 94, 0.08);
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    animation: ${slideGlow} 4s ease-in-out infinite;
    z-index: 1;
  }

  .btn-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04), transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 30px rgba(34, 197, 94, 0.15);
  }

  &:hover:not(:disabled) .btn-glow {
    opacity: 1;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 12px;
    border-radius: 20px;
  }
`;

// ============================================
// MESSAGE - COMPACT
// ============================================
const PremiumMessage = styled.div`
  margin-top: 8px;
  font-size: 11px;
  min-height: 28px;
  padding: 4px 12px;
  border-radius: 18px;
  background: ${props => props.isError ? 'rgba(239, 68, 68, 0.04)' : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.color || '#94a3b8'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid ${props => props.isError ? 'rgba(239, 68, 68, 0.04)' : 'transparent'};

  .msg-icon {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    min-height: 24px;
    padding: 3px 8px;
    border-radius: 14px;
    .msg-icon { font-size: 10px; }
  }
`;

// ============================================
// FOOTER
// ============================================
const PremiumFooter = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
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
      bottom: -1px;
      left: 0;
      width: 0;
      height: 1px;
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
    font-size: 10px;
    margin-top: 10px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Register = () => {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthWidth, setStrengthWidth] = useState('0%');
  const [strengthColor, setStrengthColor] = useState('#ef4444');
  const [strengthLabel, setStrengthLabel] = useState('Enter a strong password');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
    if (password) {
      checkStrength(password);
    } else {
      setStrengthWidth('0%');
      setStrengthColor('#ef4444');
      setStrengthLabel('Enter a strong password');
    }
  }, [password]);

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstNameTrimmed = firstName.trim();
    const lastNameTrimmed = lastName.trim();
    const phoneTrimmed = phoneNumber.trim();
    const emailTrimmed = email.trim();
    const passwordTrimmed = password;
    const confirmPasswordTrimmed = confirmPassword;

    if (!firstNameTrimmed || !lastNameTrimmed) {
      setMessage('First and last name required');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    if (!phoneTrimmed || !emailTrimmed || !passwordTrimmed) {
      setMessage('All fields required');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    if (!validatePhone(phoneTrimmed)) {
      setMessage('Valid phone with country code');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
      setMessage('Valid email address');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    if (passwordTrimmed !== confirmPasswordTrimmed) {
      setMessage('Passwords do not match');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    if (passwordTrimmed.length < 6) {
      setMessage('Password must be 6+ characters');
      setMessageColor('#fbbf24');
      setIsError(false);
      return;
    }

    const strength = checkStrength(passwordTrimmed);
    if (strength < 2) {
      setMessage('Choose a stronger password');
      setMessageColor('#fbbf24');
      setIsError(false);
      return;
    }

    setIsLoading(true);
    setMessage('Creating account...');
    setMessageColor('#94a3b8');
    setIsError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstNameTrimmed,
          last_name: lastNameTrimmed,
          phone: phoneTrimmed,
          email: emailTrimmed,
          password: passwordTrimmed
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        localStorage.setItem('tempUserId', data.user_id);
        localStorage.setItem('userEmail', emailTrimmed);
        
        setMessage('✅ Account created! Check your email.');
        setMessageColor('#22c55e');
        setIsError(false);
        setIsLoading(false);
        
        setTimeout(() => {
          navigate('/verify');
        }, 2000);
      } else {
        setMessage(`❌ ${data.error || 'Registration failed'}`);
        setMessageColor('#f87171');
        setIsError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
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
          <BrandSection>
            <PremiumLogo>
              <span className="logo-icon">🔷</span>
              <span className="logo-text">Voltix Traders</span>
              <span className="status-dot" />
            </PremiumLogo>
            <PremiumTitle>
              Create <span className="gradient-text">Account</span>
            </PremiumTitle>
            <PremiumSubhead>Start your automated trading journey</PremiumSubhead>
          </BrandSection>

          <Form onSubmit={handleSubmit}>
            {/* FIRST & LAST NAME - SPLIT ROW */}
            <SplitRow>
              <InputGroup>
                <FloatingLabel>
                  <span className="icon">📝</span> First
                </FloatingLabel>
                <PremiumInputWrapper>
                  <PremiumInput
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </PremiumInputWrapper>
              </InputGroup>

              <InputGroup>
                <FloatingLabel>
                  <span className="icon">📝</span> Last
                </FloatingLabel>
                <PremiumInputWrapper>
                  <PremiumInput
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </PremiumInputWrapper>
              </InputGroup>
            </SplitRow>

            {/* PHONE */}
            <InputGroup>
              <FloatingLabel>
                <span className="icon">📞</span> Phone
              </FloatingLabel>
              <PremiumInputWrapper>
                <PremiumInput
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </PremiumInputWrapper>
              <PhoneHelper>Include country code (e.g., +1, +44)</PhoneHelper>
            </InputGroup>

            {/* EMAIL */}
            <InputGroup>
              <FloatingLabel>
                <span className="icon">📧</span> Email
              </FloatingLabel>
              <PremiumInputWrapper>
                <PremiumInput
                  type="email"
                  placeholder="trader@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </PremiumInputWrapper>
            </InputGroup>

            {/* PASSWORD */}
            <InputGroup>
              <FloatingLabel>
                <span className="icon">🔒</span> Password
              </FloatingLabel>
              <PremiumInputWrapper>
                <PremiumInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <TogglePasswordBtn 
                  type="button" 
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword ? '🙈' : '👁️'}
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

            {/* CONFIRM PASSWORD */}
            <InputGroup>
              <FloatingLabel>
                <span className="icon">✓</span> Confirm
              </FloatingLabel>
              <PremiumInputWrapper>
                <PremiumInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <TogglePasswordBtn 
                  type="button" 
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </TogglePasswordBtn>
              </PremiumInputWrapper>
            </InputGroup>

            <PremiumButton type="submit" disabled={isLoading}>
              <div className="btn-shimmer" />
              <div className="btn-glow" />
              <div className="btn-content">
                {isLoading ? '⏳ Creating...' : '🚀 Register & Start Trading'}
              </div>
            </PremiumButton>
          </Form>

          <PremiumMessage color={messageColor} isError={isError}>
            <span className="msg-icon">
              {isError ? '❌' : messageColor === '#22c55e' ? '✅' : messageColor === '#fbbf24' ? '⚠️' : 'ℹ️'}
            </span>
            {message || '\u00A0'}
          </PremiumMessage>

          <PremiumFooter>
            Already have an account? <Link to="/login">Sign in →</Link>
          </PremiumFooter>
        </FormCard>
      </FloatingFormContainer>
    </>
  );
};

export default Register;