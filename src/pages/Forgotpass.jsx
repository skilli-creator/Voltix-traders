import React, { useState, useRef } from 'react';
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
  text-align: left;
  margin-bottom: 24px;

  label {
    font-size: 13px;
    color: #cbd5e1;
    display: block;
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

  &:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }

  &::placeholder {
    color: #6b7280;
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
// BACKGROUND STYLED COMPONENTS
// ============================================

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

// ============================================
// MAIN COMPONENT
// ============================================

const ForgotPassword = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // State
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [messageBg, setMessageBg] = useState('rgba(0, 0, 0, 0.3)');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ FIXED: Vite uses import.meta.env instead of process.env
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Shake animation
  const shakeContainer = () => {
    if (containerRef.current) {
      containerRef.current.classList.add('error-shake');
      setTimeout(() => {
        containerRef.current.classList.remove('error-shake');
      }, 300);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailTrimmed = email.trim();
    
    // Clear previous message
    setMessage('');
    setMessageColor('#94a3b8');
    setMessageBg('rgba(0, 0, 0, 0.3)');

    // Validation
    if (!emailTrimmed) {
      setMessage('❌ Please enter your email address');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      shakeContainer();
      return;
    }

    if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
      setMessage('❌ Please enter a valid email address');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      shakeContainer();
      return;
    }

    setIsLoading(true);
    setMessage('⏳ Sending reset code...');
    setMessageColor('#94a3b8');
    setMessageBg('rgba(0, 0, 0, 0.3)');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrimmed })
      });

      const data = await response.json();

      if (response.ok) {
        // Store email for verification step
        sessionStorage.setItem('resetEmail', emailTrimmed);
        
        setMessage('✅ Reset code sent! Redirecting...');
        setMessageColor('#22c55e');
        setMessageBg('rgba(34, 197, 94, 0.1)');
        setIsLoading(false);

        setTimeout(() => {
          navigate('/verifyresetcode');
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || 'Failed to send reset code'}`);
        setMessageColor('#f87171');
        setMessageBg('rgba(239, 68, 68, 0.1)');
        setIsLoading(false);
        shakeContainer();
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('❌ Cannot connect to server. Please make sure the backend is running.');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      setIsLoading(false);
      shakeContainer();
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
        <Title>Forgot Password?</Title>
        <Subhead>Enter your email to receive a reset code</Subhead>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label>📧 Email Address</label>
            <Input
              type="email"
              placeholder="trader@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '⏳ Sending...' : 'Send Reset Code →'}
          </SubmitButton>
        </Form>

        <Message color={messageColor} bg={messageBg}>
          {message || '\u00A0'}
        </Message>

        <BackLink>
          <Link to="/login">← Back to Login</Link>
        </BackLink>
      </Container>
    </>
  );
};

export default ForgotPassword;