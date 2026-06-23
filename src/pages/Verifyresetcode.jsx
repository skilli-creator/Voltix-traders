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
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

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

// ============================================
// STYLED COMPONENTS
// ============================================

// Background components
const BackgroundGrid = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
`;

const Orb = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.25;
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
    width: 350px;
    height: 350px;
    background: #3b82f6;
    bottom: -120px;
    right: -80px;
  }
`;

const Container = styled.div`
  max-width: 450px;
  width: 100%;
  padding: 44px 40px;
  background: rgba(8, 18, 38, 0.85);
  backdrop-filter: blur(18px);
  border-radius: 52px;
  text-align: center;
  border: 1px solid rgba(34, 197, 94, 0.2);
  animation: ${fadeSlideUp} 0.6s ease;
  transition: transform 0.3s ease;
  margin: 0 auto;

  &.error-shake {
    animation: ${shake} 0.3s ease-in-out;
  }

  @media (max-width: 520px) {
    padding: 32px 24px;
    margin: 16px;
  }
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #22c55e, #38bdf8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: 520px) {
    font-size: 1.4rem;
  }
`;

const Subhead = styled.p`
  color: #9ca3af;
  font-size: 0.85rem;
  margin-bottom: 30px;
`;

// ===== FORM ELEMENTS =====
const Form = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  text-align: center;
  margin-bottom: 24px;

  label {
    font-size: 13px;
    color: #cbd5e1;
    display: block;
    margin-bottom: 8px;
  }
`;

const CodeInput = styled.input`
  width: 100%;
  max-width: 200px;
  padding: 14px 16px;
  border-radius: 32px;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  background: #0a122a;
  color: white;
  font-size: 24px;
  text-align: center;
  letter-spacing: 5px;
  outline: none;
  margin: 0 auto;
  display: block;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;

  &:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }

  &::placeholder {
    color: #6b7280;
    letter-spacing: 2px;
  }

  @media (max-width: 520px) {
    max-width: 160px;
    font-size: 20px;
    padding: 12px;
  }
`;

const SubmitButton = styled.button`
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

const ResendLink = styled.div`
  margin-top: 15px;

  a {
    color: #3b82f6;
    cursor: pointer;
    font-size: 13px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Message = styled.div`
  margin-top: 20px;
  font-size: 13px;
  padding: 10px;
  border-radius: 60px;
  background: ${props => props.bg || 'rgba(0, 0, 0, 0.3)'};
  color: ${props => props.color || '#94a3b8'};
  transition: all 0.3s ease;
  min-height: 44px;
`;

const BackLink = styled.div`
  margin-top: 20px;
  font-size: 13px;

  a {
    color: #3b82f6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const VerifyResetCode = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // State
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [messageBg, setMessageBg] = useState('rgba(0, 0, 0, 0.3)');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // ✅ FIXED: Vite uses import.meta.env instead of process.env
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Check for email in sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // No email found, redirect to forgot password
      setMessage('⚠️ No email found. Please request a password reset.');
      setMessageColor('#fbbf24');
      setMessageBg('rgba(251, 191, 36, 0.1)');
      
      setTimeout(() => {
        navigate('/forgotpass');
      }, 2000);
    }

    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [navigate]);

  // Shake animation
  const shakeContainer = () => {
    if (containerRef.current) {
      containerRef.current.classList.add('error-shake');
      setTimeout(() => {
        containerRef.current.classList.remove('error-shake');
      }, 300);
    }
  };

  // Handle code input - only allow digits and limit to 6
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    
    // Clear message when user types
    if (message && messageColor === '#f87171') {
      setMessage('');
      setMessageColor('#94a3b8');
      setMessageBg('rgba(0, 0, 0, 0.3)');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const codeTrimmed = code.trim();
    
    // Clear previous message
    setMessage('');
    setMessageColor('#94a3b8');
    setMessageBg('rgba(0, 0, 0, 0.3)');

    // Validation
    if (!codeTrimmed || codeTrimmed.length !== 6) {
      setMessage('❌ Please enter the complete 6-digit verification code');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      shakeContainer();
      return;
    }

    if (!email) {
      setMessage('❌ No email found. Please request a password reset.');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      return;
    }

    setIsLoading(true);
    setMessage('⏳ Verifying code...');
    setMessageColor('#94a3b8');
    setMessageBg('rgba(0, 0, 0, 0.3)');

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
        // Store reset token for password reset step
        sessionStorage.setItem('resetToken', data.reset_token);
        
        setMessage('✅ Code verified! Redirecting...');
        setMessageColor('#22c55e');
        setMessageBg('rgba(34, 197, 94, 0.1)');
        setIsLoading(false);

        setTimeout(() => {
          navigate('/resetpass');
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || 'Invalid verification code'}`);
        setMessageColor('#f87171');
        setMessageBg('rgba(239, 68, 68, 0.1)');
        setIsLoading(false);
        shakeContainer();
        // Clear code on error
        setCode('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('❌ Cannot connect to server. Please make sure the backend is running.');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      setIsLoading(false);
      shakeContainer();
    }
  };

  // Handle resend code
  const handleResend = async () => {
    if (isResending) return;

    if (!email) {
      setMessage('❌ No email found. Please request a password reset.');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      return;
    }

    setIsResending(true);
    setMessage('⏳ Resending code...');
    setMessageColor('#94a3b8');
    setMessageBg('rgba(0, 0, 0, 0.3)');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ New code sent to your email!');
        setMessageColor('#22c55e');
        setMessageBg('rgba(34, 197, 94, 0.1)');
        // Clear code input
        setCode('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        setMessage(`❌ ${data.error || 'Failed to resend code'}`);
        setMessageColor('#f87171');
        setMessageBg('rgba(239, 68, 68, 0.1)');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('❌ Cannot connect to server. Please try again.');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
    } finally {
      setIsResending(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundGrid />
      <Orb className="orb-1" />
      <Orb className="orb-2" />

      <Container ref={containerRef}>
        <Logo>🔷Voltix Traders</Logo>
        <Title>Enter Verification Code</Title>
        <Subhead>We sent a 6-digit code to your email</Subhead>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label>📧 Verification Code</label>
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
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '⏳ Verifying...' : 'Verify Code →'}
          </SubmitButton>
        </Form>

        <ResendLink>
          <a onClick={handleResend} style={{ opacity: isResending ? 0.6 : 1 }}>
            {isResending ? '⏳ Sending...' : "⟳ Didn't receive code? Resend"}
          </a>
        </ResendLink>

        <Message color={messageColor} bg={messageBg}>
          {message || '\u00A0'}
        </Message>

        <BackLink>
          <Link to="/forgotpass">← Back</Link>
        </BackLink>
      </Container>
    </>
  );
};

export default VerifyResetCode;