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
const RegisterContainer = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 36px 28px 28px;
  background: rgba(8, 18, 38, 0.6);
  backdrop-filter: blur(32px);
  border-radius: 48px;
  position: relative;
  z-index: 2;
  animation: ${fadeSlideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(56, 189, 248, 0.06);
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
    padding: 24px 16px 20px;
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
  margin-bottom: 24px;

  @media (max-width: 480px) {
    margin-bottom: 18px;
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
  font-size: 26px;
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
    font-size: 20px;
  }
`;

const Subhead = styled.p`
  font-size: 13px;
  color: #94a3b8;
  font-weight: 400;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

// ---- Form ----
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

const InputLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;

  .label-icon {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 3px;
    .label-icon {
      font-size: 11px;
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
  padding: 11px 16px;
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
    padding: 9px 12px;
    font-size: 13px;
    &::placeholder {
      font-size: 12px;
    }
  }
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0;
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
  margin-top: 3px;
  padding-left: 4px;

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

// ---- Password Strength ----
const StrengthMeter = styled.div`
  margin-top: 6px;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  width: ${props => props.width || '0%'};
  height: 100%;
  background-color: ${props => props.color || '#ef4444'};
  transition: width 0.4s ease;
  border-radius: 4px;
`;

const StrengthText = styled.div`
  font-size: 10px;
  margin-top: 4px;
  color: ${props => props.color || '#6b7280'};
  transition: color 0.3s ease;

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

// ---- Register Button ----
const RegisterButton = styled.button`
  width: 100%;
  padding: 13px;
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
  margin-top: 4px;
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
    padding: 11px;
    font-size: 14px;
    border-radius: 28px;
  }
`;

// ---- Message ----
const MessageArea = styled.div`
  margin-top: 12px;
  font-size: 13px;
  min-height: 34px;
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
    min-height: 30px;
    padding: 6px 10px;
    border-radius: 18px;
    .msg-icon {
      font-size: 12px;
    }
  }
`;

// ---- Footer Links ----
const FooterLinks = styled.div`
  margin-top: 18px;
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
    margin-top: 14px;
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
      setMessage('First name and last name are required');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    if (!phoneTrimmed || !emailTrimmed || !passwordTrimmed) {
      setMessage('All fields are required');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    if (!validatePhone(phoneTrimmed)) {
      setMessage('Please enter a valid phone number with country code');
      setMessageColor('#f87171');
      setIsError(true);
      return;
    }

    if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
      setMessage('Please enter a valid email address');
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
      setMessage('Password must be at least 6 characters');
      setMessageColor('#fbbf24');
      setIsError(false);
      return;
    }

    const strength = checkStrength(passwordTrimmed);
    if (strength < 2) {
      setMessage('Please choose a stronger password');
      setMessageColor('#fbbf24');
      setIsError(false);
      return;
    }

    setIsLoading(true);
    setMessage('Creating your account...');
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
        
        setMessage('✅ Account created! Check your email for verification code.');
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

      <RegisterContainer>
        <BrandSection>
          <LogoWrapper>
            <span className="logo-icon">🔷</span>
            <span className="logo-text">Voltix Traders</span>
            <span className="live-dot" />
          </LogoWrapper>
          <Title>
            Create <span className="highlight">Account</span>
          </Title>
          <Subhead>Start your automated trading journey</Subhead>
        </BrandSection>

        <Form onSubmit={handleSubmit}>
          <NameRow>
            <InputGroup>
              <InputLabel>
                <span className="label-icon">📝</span> First Name
              </InputLabel>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputLabel>
                <span className="label-icon">📝</span> Last Name
              </InputLabel>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </InputWrapper>
            </InputGroup>
          </NameRow>

          <InputGroup>
            <InputLabel>
              <span className="label-icon">📞</span> Phone Number
            </InputLabel>
            <InputWrapper>
              <Input
                type="tel"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </InputWrapper>
            <PhoneHelper>Include country code (e.g., +1, +44)</PhoneHelper>
          </InputGroup>

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
                required
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <InputLabel>
              <span className="label-icon">🔒</span> Password
            </InputLabel>
            <InputWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TogglePasswordBtn 
                type="button" 
                onClick={() => togglePasswordVisibility('password')}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️'}
              </TogglePasswordBtn>
            </InputWrapper>
            
            <StrengthMeter>
              <StrengthFill width={strengthWidth} color={strengthColor} />
            </StrengthMeter>
            <StrengthText color={strengthColor}>
              {strengthLabel}
            </StrengthText>
          </InputGroup>

          <InputGroup>
            <InputLabel>
              <span className="label-icon">✓</span> Confirm Password
            </InputLabel>
            <InputWrapper>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
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
            </InputWrapper>
          </InputGroup>

          <RegisterButton type="submit" disabled={isLoading}>
            <div className="btn-shimmer" />
            <div className="btn-glow" />
            <div className="btn-content">
              {isLoading ? '⏳ Creating Account...' : '🚀 Register & Start Trading'}
            </div>
          </RegisterButton>
        </Form>

        <MessageArea color={messageColor} isError={isError}>
          <span className="msg-icon">
            {isError ? '❌' : messageColor === '#22c55e' ? '✅' : messageColor === '#fbbf24' ? '⚠️' : 'ℹ️'}
          </span>
          {message || '\u00A0'}
        </MessageArea>

        <FooterLinks>
          Already have an account? <Link to="/login">Sign in →</Link>
        </FooterLinks>
      </RegisterContainer>
    </>
  );
};

export default Register;