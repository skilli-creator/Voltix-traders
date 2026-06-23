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
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', 'Poppins', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: radial-gradient(ellipse at 30% 20%, #0a1428, #02040c);
    color: #f1f5f9;
    padding: 20px;
    position: relative;
    overflow-x: hidden;
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
// KEYFRAMES
// ============================================
const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
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
  background-image: radial-gradient(rgba(56, 189, 248, 0.06) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
`;

const Orb = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;

  &.orb-1 {
    width: 300px;
    height: 300px;
    background: #22c55e;
    top: -100px;
    left: -100px;
  }

  &.orb-2 {
    width: 400px;
    height: 400px;
    background: #3b82f6;
    bottom: -150px;
    right: -100px;
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 44px 40px;
  background: rgba(8, 18, 38, 0.8);
  backdrop-filter: blur(18px);
  border-radius: 52px;
  box-shadow: 0 30px 55px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(34, 197, 94, 0.2);
  text-align: center;
  position: relative;
  z-index: 2;
  animation: ${fadeSlideUp} 0.6s ease;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }

  @media (max-width: 520px) {
    padding: 32px 24px;
    margin: 16px;

    h2 {
      font-size: 1.6rem;
    }
  }
`;

const LogoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  padding: 8px 22px;
  border-radius: 60px;
  margin-bottom: 28px;
  font-weight: 700;
  font-size: 14px;
  color: #0a0f1f;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Subhead = styled.p`
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 32px;
`;

const MethodToggle = styled.div`
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 60px;
  padding: 6px;
  margin-bottom: 28px;
`;

const ToggleOption = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  background: transparent;
  color: #94a3b8;
  border: none;

  &.active {
    background: linear-gradient(105deg, #22c55e, #16a34a);
    color: #0a0f1f;
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
  }
`;

const Form = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
  text-align: left;

  label {
    font-size: 13px;
    font-weight: 500;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 32px;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  background: #0a122a;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
    background: #0f1838;
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const TogglePasswordBtn = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  padding: 4px;
`;

const PhoneHelper = styled.div`
  font-size: 10px;
  color: #6b7280;
  margin-top: 4px;
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 16px 0 24px;
`;

const ForgotLink = styled(Link)`
  color: #3b82f6;
  cursor: pointer;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 40px;
  background: linear-gradient(105deg, #22c55e, #16a34a);
  color: #0a0f1f;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(105deg, #2dd4bf, #22c55e);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const MessageArea = styled.div`
  margin-top: 20px;
  font-size: 13px;
  min-height: 44px;
  padding: 8px;
  border-radius: 60px;
  background: rgba(0, 0, 0, 0.3);
  color: ${props => props.color || '#94a3b8'};
  transition: all 0.3s ease;
`;

// ✅ Professional Resend/Verify Button
const ResendButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border: none;
  border-radius: 40px;
  background: linear-gradient(105deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(105deg, #2563eb, #1d4ed8);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &::before {
    content: '📧';
    margin-right: 4px;
  }
`;

const RegisterLink = styled.div`
  margin-top: 28px;
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
`;

const FooterNote = styled.footer`
  position: fixed;
  bottom: 16px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #4b5563;
  z-index: 2;
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
  
  // State for resend verification
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendUserId, setResendUserId] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Validate phone number format
  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  // Handle login method toggle
  const handleMethodToggle = (method) => {
    setActiveMethod(method);
    setMessage('');
    setMessageColor('#94a3b8');
    setShowResendButton(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Resend verification code
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
        
        setMessage('✅ New verification code sent! Redirecting to verification...');
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

  // Handle form submission
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
        setMessage('❌ Please enter a valid phone number with country code (e.g., +1234567890)');
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
      setMessage('❌ Cannot connect to server. Please make sure the backend is running.');
      setMessageColor('#f87171');
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    const identifier = activeMethod === 'email' ? email : phone;
    if (identifier) {
      alert(`Password reset request for: ${identifier}\n\nPlease contact admin@voltix.com for assistance.`);
    } else {
      alert('Please enter your email or phone number first.');
    }
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundGrid />
      <Orb className="orb-1" />
      <Orb className="orb-2" />

      <LoginContainer>
        <LogoBadge>🔷Voltix Traders• Sign In</LogoBadge>
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
              <label>📧 Email Address</label>
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
              <label>📞 Phone Number</label>
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
            <label>🔒 Password</label>
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

        {/* ✅ Professional Resend/Verify Button - Below Message Area */}
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