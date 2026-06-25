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

  @media (min-width: 769px) {
    body {
      padding: 32px;
    }
  }
`;

// ============================================
// KEYFRAMES
// ============================================
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(2deg); }
`;

const shimmer = keyframes`
  0% { background-position: -300% center; }
  100% { background-position: 300% center; }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(50px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.08); }
`;

const slideGlow = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(200%) skewX(-20deg); }
`;

const pulseText = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

// ============================================
// BACKGROUND COMPONENTS
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
    width: 450px;
    height: 450px;
    top: -200px;
    right: -150px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.10), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 380px;
    height: 380px;
    bottom: -180px;
    left: -120px;
    background: radial-gradient(circle, rgba(129, 140, 248, 0.08), transparent 70%);
    animation-delay: -2.5s;
  }

  &:nth-child(3) {
    width: 250px;
    height: 250px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(192, 132, 252, 0.05), transparent 70%);
    animation-delay: -5s;
  }

  @media (max-width: 768px) {
    &:nth-child(1) {
      width: 250px;
      height: 250px;
      top: -120px;
      right: -80px;
    }
    &:nth-child(2) {
      width: 220px;
      height: 220px;
      bottom: -100px;
      left: -60px;
    }
    &:nth-child(3) {
      width: 150px;
      height: 150px;
    }
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;

  @media (max-width: 768px) {
    background-size: 30px 30px;
    opacity: 0.3;
  }
`;

const GlowLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
  opacity: 0.15;
  animation: ${pulseText} 4s ease-in-out infinite;
`;

const ParticleContainer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.size || '3px'};
  height: ${props => props.size || '3px'};
  background: ${props => props.color || 'rgba(56, 189, 248, 0.25)'};
  border-radius: 50%;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  animation: ${float} ${props => props.duration || '8s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  box-shadow: 0 0 25px ${props => props.color || 'rgba(56, 189, 248, 0.08)'};
`;

// ============================================
// MAIN CONTAINER - DIFFERENT ON PHONE VS LAPTOP
// ============================================
const RegisterContainer = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 40px 32px 32px;
  background: rgba(8, 18, 38, 0.55);
  backdrop-filter: blur(40px);
  border-radius: 56px;
  position: relative;
  z-index: 2;
  animation: ${fadeSlideUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(56, 189, 248, 0.05);
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 57px;
    padding: 1px;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(56, 189, 248, 0.08),
      transparent,
      rgba(129, 140, 248, 0.08),
      transparent,
      rgba(192, 132, 252, 0.05),
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ${rotateGlow} 12s linear infinite;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: 15%;
    right: 15%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
    opacity: 0.2;
    border-radius: 0 0 4px 4px;
  }

  /* ===== LAPTOP: Wider, more spacious ===== */
  @media (min-width: 769px) {
    max-width: 540px;
    padding: 48px 44px 40px;
    border-radius: 64px;

    &::before {
      border-radius: 65px;
    }
  }

  /* ===== PHONE: Compact, full width ===== */
  @media (max-width: 768px) {
    padding: 24px 16px 20px;
    border-radius: 32px;
    max-width: 100%;
    &::before {
      border-radius: 33px;
    }
  }
`;

// ============================================
// BRAND SECTION - DIFFERENT SIZES
// ============================================
const BrandSection = styled.div`
  text-align: center;
  margin-bottom: 28px;

  @media (min-width: 769px) {
    margin-bottom: 36px;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const LogoWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 20px 6px 14px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(129, 140, 248, 0.04));
  border: 1px solid rgba(56, 189, 248, 0.06);
  border-radius: 40px;
  margin-bottom: 16px;
  position: relative;
  backdrop-filter: blur(10px);

  .logo-icon {
    font-size: 18px;
  }

  .logo-text {
    font-size: 12px;
    font-weight: 700;
    background: linear-gradient(135deg, #e0f2fe, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: 0.5px;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2.5s ease-out infinite;
    }

    &::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2.5s ease-out infinite 0.5s;
    }
  }

  @media (min-width: 769px) {
    padding: 8px 28px 8px 18px;
    gap: 12px;
    margin-bottom: 24px;

    .logo-icon {
      font-size: 22px;
    }
    .logo-text {
      font-size: 14px;
    }
  }

  @media (max-width: 768px) {
    padding: 4px 14px 4px 10px;
    gap: 6px;
    .logo-text { font-size: 11px; }
    .logo-icon { font-size: 16px; }
  }
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 4px;

  .gradient-text {
    background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ${shimmer} 5s ease-in-out infinite;
  }

  @media (min-width: 769px) {
    font-size: 38px;
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subhead = styled.p`
  font-size: 14px;
  color: #94a3b8;
  font-weight: 400;
  letter-spacing: 0.2px;

  @media (min-width: 769px) {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

// ============================================
// FORM ELEMENTS - RESPONSIVE
// ============================================
const Form = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 14px;
  text-align: left;

  @media (min-width: 769px) {
    margin-bottom: 18px;
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const InputLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .label-icon {
    font-size: 13px;
  }

  @media (min-width: 769px) {
    font-size: 12px;
    margin-bottom: 6px;
    .label-icon { font-size: 15px; }
  }

  @media (max-width: 768px) {
    font-size: 10px;
    .label-icon { font-size: 11px; }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 28px;
  border: 1.5px solid rgba(255, 255, 255, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 28px;
    padding: 1px;
    background: linear-gradient(135deg, transparent, rgba(56, 189, 248, 0.03), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:focus-within {
    border-color: rgba(56, 189, 248, 0.2);
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.04);
    background: rgba(255, 255, 255, 0.04);
  }

  &:focus-within::before {
    opacity: 1;
  }

  @media (min-width: 769px) {
    border-radius: 32px;
    border-width: 2px;
  }

  @media (max-width: 768px) {
    border-radius: 20px;
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
  letter-spacing: 0.2px;

  &::placeholder {
    color: #4b5563;
    font-size: 13px;
    font-weight: 400;
  }

  @media (min-width: 769px) {
    padding: 14px 20px;
    font-size: 16px;
    &::placeholder { font-size: 14px; }
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    &::placeholder { font-size: 12px; }
  }
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 769px) {
    gap: 16px;
  }

  @media (max-width: 768px) {
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
  transition: all 0.3s ease;

  &:hover {
    color: #f1f5f9;
    transform: translateY(-50%) scale(1.1);
  }

  @media (min-width: 769px) {
    right: 18px;
    font-size: 18px;
  }

  @media (max-width: 768px) {
    right: 10px;
    font-size: 14px;
  }
`;

const PhoneHelper = styled.div`
  font-size: 10px;
  color: #4b5563;
  margin-top: 3px;
  padding-left: 4px;

  @media (min-width: 769px) {
    font-size: 11px;
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

// ============================================
// PASSWORD STRENGTH
// ============================================
const StrengthContainer = styled.div`
  margin-top: 6px;

  @media (min-width: 769px) {
    margin-top: 8px;
  }
`;

const StrengthMeter = styled.div`
  height: 3px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  overflow: hidden;

  @media (min-width: 769px) {
    height: 4px;
  }
`;

const StrengthFill = styled.div`
  width: ${props => props.width || '0%'};
  height: 100%;
  background: ${props => props.color || '#ef4444'};
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  box-shadow: 0 0 20px ${props => props.color ? `${props.color}30` : 'transparent'};
`;

const StrengthText = styled.div`
  font-size: 10px;
  margin-top: 4px;
  color: ${props => props.color || '#6b7280'};
  transition: color 0.3s ease;
  font-weight: 500;

  @media (min-width: 769px) {
    font-size: 11px;
    margin-top: 6px;
  }

  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

// ============================================
// BUTTON
// ============================================
const RegisterButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 36px;
  background: linear-gradient(135deg, #22c55e, #16a34a, #0d9488);
  background-size: 200% 200%;
  color: #0a0f1f;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-top: 6px;
  box-shadow: 0 4px 30px rgba(34, 197, 94, 0.15);
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
    animation: ${slideGlow} 5s ease-in-out infinite;
    z-index: 1;
  }

  .btn-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.08), transparent 70%);
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: 0;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 8px 50px rgba(34, 197, 94, 0.25);
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

  @media (min-width: 769px) {
    padding: 16px;
    font-size: 17px;
    border-radius: 40px;
    margin-top: 10px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 14px;
    border-radius: 28px;
  }
`;

// ============================================
// MESSAGE
// ============================================
const MessageArea = styled.div`
  margin-top: 14px;
  font-size: 13px;
  min-height: 38px;
  padding: 8px 16px;
  border-radius: 28px;
  background: ${props => props.isError ? 'rgba(239, 68, 68, 0.04)' : 'rgba(0, 0, 0, 0.15)'};
  color: ${props => props.color || '#94a3b8'};
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid ${props => props.isError ? 'rgba(239, 68, 68, 0.06)' : 'transparent'};
  backdrop-filter: blur(10px);

  .msg-icon {
    font-size: 14px;
  }

  @media (min-width: 769px) {
    margin-top: 18px;
    font-size: 14px;
    min-height: 44px;
    padding: 10px 20px;
    border-radius: 32px;
    .msg-icon { font-size: 16px; }
  }

  @media (max-width: 768px) {
    font-size: 12px;
    min-height: 32px;
    padding: 6px 12px;
    border-radius: 20px;
    .msg-icon { font-size: 12px; }
  }
`;

// ============================================
// FOOTER
// ============================================
const FooterLinks = styled.div`
  margin-top: 20px;
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

  @media (min-width: 769px) {
    margin-top: 28px;
    font-size: 14px;
    gap: 6px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 16px;
  }
`;

// ============================================
// PARTICLES DATA
// ============================================
const particles = [
  { size: '3px', top: '8%', left: '3%', duration: '9s', delay: '0s', color: 'rgba(56, 189, 248, 0.2)' },
  { size: '4px', top: '15%', left: '88%', duration: '11s', delay: '1.2s', color: 'rgba(129, 140, 248, 0.15)' },
  { size: '2px', top: '35%', left: '5%', duration: '7s', delay: '2.5s', color: 'rgba(192, 132, 252, 0.2)' },
  { size: '5px', top: '55%', left: '93%', duration: '13s', delay: '0.8s', color: 'rgba(56, 189, 248, 0.12)' },
  { size: '3px', top: '70%', left: '10%', duration: '10s', delay: '3.5s', color: 'rgba(129, 140, 248, 0.18)' },
  { size: '4px', top: '85%', left: '85%', duration: '12s', delay: '1.8s', color: 'rgba(192, 132, 252, 0.12)' },
  { size: '2px', top: '3%', left: '45%', duration: '6s', delay: '2s', color: 'rgba(56, 189, 248, 0.25)' },
  { size: '3px', top: '95%', left: '50%', duration: '14s', delay: '0.5s', color: 'rgba(129, 140, 248, 0.12)' },
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
      
      <BackgroundContainer>
        <GradientOrb />
        <GradientOrb />
        <GradientOrb />
        <GridOverlay />
        <GlowLine />
      </BackgroundContainer>

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
            Create <span className="gradient-text">Account</span>
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