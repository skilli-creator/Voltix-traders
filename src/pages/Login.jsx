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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: radial-gradient(ellipse at 30% 20%, #0a1428, #02040c);
    color: #f1f5f9;
    padding: 16px;
    position: relative;
    overflow-x: hidden;
  }

  #root {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 8px;
  }

  /* Mobile optimizations */
  @media (max-width: 480px) {
    body {
      padding: 8px;
    }
  }
`;

// ============================================
// KEYFRAMES
// ============================================
const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const BackgroundGrid = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(56, 189, 248, 0.04) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  z-index: 0;

  @media (max-width: 480px) {
    background-size: 20px 20px;
  }
`;

const Orb = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.25;
  pointer-events: none;
  z-index: 0;

  &.orb-1 {
    width: 200px;
    height: 200px;
    background: #22c55e;
    top: -80px;
    left: -80px;
  }

  &.orb-2 {
    width: 300px;
    height: 300px;
    background: #3b82f6;
    bottom: -120px;
    right: -80px;
  }

  @media (max-width: 480px) {
    &.orb-1 {
      width: 150px;
      height: 150px;
      top: -60px;
      left: -60px;
    }
    &.orb-2 {
      width: 200px;
      height: 200px;
      bottom: -80px;
      right: -60px;
    }
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 36px 28px;
  background: rgba(8, 18, 38, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  box-shadow: 0 30px 55px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(34, 197, 94, 0.15);
  text-align: center;
  position: relative;
  z-index: 2;
  animation: ${fadeSlideUp} 0.5s ease;

  @media (max-width: 480px) {
    padding: 24px 16px;
    border-radius: 28px;
    max-width: 100%;
  }
`;

const LogoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  padding: 6px 16px;
  border-radius: 40px;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 12px;
  color: #0a0f1f;

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 5px 12px;
    margin-bottom: 16px;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 4px;
  background: linear-gradient(135deg, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subhead = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-bottom: 18px;
  }
`;

const MethodToggle = styled.div`
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 40px;
  padding: 5px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    gap: 6px;
    padding: 4px;
  }
`;

const ToggleOption = styled.button`
  flex: 1;
  padding: 8px 12px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  background: transparent;
  color: #94a3b8;
  border: none;

  &.active {
    background: linear-gradient(105deg, #22c55e, #16a34a);
    color: #0a0f1f;
    box-shadow: 0 2px 12px rgba(34, 197, 94, 0.25);
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 6px 8px;
  }
`;

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
  gap: 4px;
  margin-bottom: 6px;

  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 24px;
  border: 1.5px solid rgba(255, 255, 255, 0.06);
  background: #0a122a;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.25s ease;
  font-family: inherit;

  &:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
    background: #0f1838;
  }

  &::placeholder {
    color: #6b7280;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 20px;
    &::placeholder {
      font-size: 12px;
    }
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
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
  color: #9ca3af;
  padding: 4px;

  @media (max-width: 480px) {
    right: 10px;
    font-size: 14px;
  }
`;

const PhoneHelper = styled.div`
  font-size: 10px;
  color: #6b7280;
  margin-top: 4px;

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 12px 0 20px;

  @media (max-width: 480px) {
    margin: 8px 0 14px;
  }
`;

const ForgotLink = styled(Link)`
  color: #3b82f6;
  cursor: pointer;
  font-size: 12px;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 32px;
  background: linear-gradient(105deg, #22c55e, #16a34a);
  color: #0a0f1f;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: linear-gradient(105deg, #2dd4bf, #22c55e);
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 11px;
    font-size: 0.85rem;
    border-radius: 28px;
  }
`;

const MessageArea = styled.div`
  margin-top: 16px;
  font-size: 13px;
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.25);
  color: ${props => props.color || '#94a3b8'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    font-size: 12px;
    min-height: 36px;
    padding: 6px 10px;
  }
`;

const ResendButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(105deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: linear-gradient(105deg, #2563eb, #1d4ed8);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 0.75rem;
    border-radius: 24px;
    &::before {
      content: '📧';
      margin-right: 2px;
    }
  }
`;

const RegisterLink = styled.div`
  margin-top: 20px;
  font-size: 13px;
  color: #94a3b8;

  a {
    color: #22c55e;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 16px;
  }
`;

const FooterNote = styled.footer`
  position: fixed;
  bottom: 12px;
  width: 100%;
  text-align: center;
  font-size: 10px;
  color: #4b5563;
  z-index: 2;

  @media (max-width: 480px) {
    bottom: 8px;
    font-size: 9px;
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
  const [isLoading, setIsLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendUserId, setResendUserId] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  const handleMethodToggle = (method) => {
    setActiveMethod(method);
    setMessage('');
    setMessageColor('#94a3b8');
    setShowResendButton(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResendVerification = async () => {
    if (!resendEmail) {
      setMessage('❌ No email found. Please register again.');
      setMessageColor('#f87171');
      return;
    }

    setIsLoading(true);
    setMessage('⏳ Resending verification code...');
    setMessageColor('#94a3b8');

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
        setIsLoading(false);
        setShowResendButton(false);
        
        setTimeout(() => {
          navigate('/verify');
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || 'Failed to resend code'}`);
        setMessageColor('#f87171');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('❌ Cannot connect to server. Please try again.');
      setMessageColor('#f87171');
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
        setMessage('❌ Please enter a valid email address');
        setMessageColor('#f87171');
        isValid = false;
      }
    } else {
      identifier = phone.trim();
      if (!identifier) {
        setMessage('❌ Please enter your phone number');
        setMessageColor('#f87171');
        isValid = false;
      } else if (!validatePhone(identifier)) {
        setMessage('❌ Please enter a valid phone number with country code');
        setMessageColor('#f87171');
        isValid = false;
      }
    }

    if (!passwordTrimmed) {
      setMessage('❌ Please enter your password');
      setMessageColor('#f87171');
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    setMessage('⏳ Authenticating...');
    setMessageColor('#94a3b8');
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('✅ Login successful! Redirecting...');
        setMessageColor('#22c55e');
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
          setIsLoading(false);
        } else {
          setMessage(`❌ ${errorMsg || 'Login failed'}`);
          setMessageColor('#f87171');
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Cannot connect to server. Please try again.');
      setMessageColor('#f87171');
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundGrid />
      <Orb className="orb-1" />
      <Orb className="orb-2" />

      <LoginContainer>
        <LogoBadge>🔷 Voltix Traders</LogoBadge>
        <Title>Welcome Back</Title>
        <Subhead>Access your trading dashboard</Subhead>

        <MethodToggle>
          <ToggleOption 
            className={activeMethod === 'email' ? 'active' : ''}
            onClick={() => handleMethodToggle('email')}
          >
            📧 Email
          </ToggleOption>
          <ToggleOption 
            className={activeMethod === 'phone' ? 'active' : ''}
            onClick={() => handleMethodToggle('phone')}
          >
            📱 Phone
          </ToggleOption>
        </MethodToggle>

        <Form onSubmit={handleSubmit}>
          {activeMethod === 'email' && (
            <InputGroup>
              <InputLabel>📧 Email Address</InputLabel>
              <Input
                type="email"
                placeholder="trader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </InputGroup>
          )}

          {activeMethod === 'phone' && (
            <InputGroup>
              <InputLabel>📞 Phone Number</InputLabel>
              <Input
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                required
              />
              <PhoneHelper>Include country code (e.g., +1, +44)</PhoneHelper>
            </InputGroup>
          )}

          <InputGroup>
            <InputLabel>🔒 Password</InputLabel>
            <PasswordWrapper>
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
            </PasswordWrapper>
          </InputGroup>

          <OptionsRow>
            <ForgotLink to="/forgotpass">
              Forgot password?
            </ForgotLink>
          </OptionsRow>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? '⏳ Signing In...' : '🚀 Sign In'}
          </LoginButton>
        </Form>

        <MessageArea color={messageColor}>
          {message || '\u00A0'}
        </MessageArea>

        {showResendButton && (
          <ResendButton onClick={handleResendVerification} disabled={isLoading}>
            Resend Verification Code
          </ResendButton>
        )}

        <RegisterLink>
          Don't have an account? <Link to="/register">Create free account →</Link>
        </RegisterLink>
      </LoginContainer>

      <FooterNote>
        © 2026 Voltix — AI Powered Trading Platform
      </FooterNote>
    </>
  );
};

export default Login;