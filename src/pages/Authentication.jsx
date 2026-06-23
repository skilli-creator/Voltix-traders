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

// Background grid overlay
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

const VerifyContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 40px 36px;
  background: rgba(8, 18, 38, 0.88);
  backdrop-filter: blur(20px);
  border-radius: 56px;
  box-shadow: 0 30px 55px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(34, 197, 94, 0.25);
  text-align: center;
  position: relative;
  z-index: 2;
  animation: ${fadeSlideUp} 0.6s ease;

  @media (max-width: 600px) {
    padding: 28px 20px;
    margin: 16px;
  }
`;

const LogoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  padding: 8px 22px;
  border-radius: 60px;
  margin-bottom: 24px;
  font-weight: 700;
  font-size: 14px;
  color: #0a0f1f;
`;

const Title = styled.h2`
  font-size: 1.8rem;
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
  margin-bottom: 20px;
`;

const DestinationInfo = styled.div`
  background: rgba(34, 197, 94, 0.1);
  padding: 12px;
  border-radius: 40px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #cbd5e1;
  border: 1px solid rgba(34, 197, 94, 0.2);
  word-break: break-all;

  span {
    color: #22c55e;
    font-weight: 600;
  }
`;

// ===== CODE INPUTS =====
const CodeInputs = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 24px 0 20px;

  @media (max-width: 600px) {
    gap: 6px;
  }
`;

const CodeDigit = styled.input`
  width: 52px;
  height: 60px;
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  background: #0a122a;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: white;
  outline: none;
  font-family: monospace;
  transition: all 0.2s ease;

  &:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  }

  @media (max-width: 600px) {
    width: 44px;
    height: 52px;
    font-size: 22px;
  }
`;

const TimerSection = styled.div`
  font-size: 13px;
  color: #94a3b8;
  margin: 16px 0;
`;

const Timer = styled.span`
  color: #facc15;
  font-weight: 600;
`;

const ResendLink = styled.span`
  color: ${props => props.canResend ? '#3b82f6' : '#64748b'};
  cursor: ${props => props.canResend ? 'pointer' : 'not-allowed'};
  font-size: 13px;
  font-weight: 500;

  &:hover {
    text-decoration: ${props => props.canResend ? 'underline' : 'none'};
  }
`;

const VerifyButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 44px;
  background: linear-gradient(105deg, #22c55e, #16a34a);
  color: #0a0f1f;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;

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

const BackLink = styled.div`
  margin-top: 24px;
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
  font-size: 11px;
  color: #4b5563;
  z-index: 2;
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Verify = () => {
  const navigate = useNavigate();
  
  // State
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  
  // Refs for input focus
  const inputRefs = useRef([]);

  // ✅ FIXED: Vite uses import.meta.env instead of process.env
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Load user data from localStorage
  useEffect(() => {
    const email = localStorage.getItem('userEmail') || '';
    const id = localStorage.getItem('tempUserId');
    
    setUserEmail(email);
    setUserId(id);
    
    if (!email || !id) {
      setMessage('⚠️ No verification session found. Please register again.');
      setMessageColor('#fbbf24');
    }
  }, []);

  // Start timer on mount
  useEffect(() => {
    startTimer();
    // Focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Cleanup timer on unmount
    return () => {
      if (window.timerInterval) {
        clearInterval(window.timerInterval);
      }
    };
  }, []);

  // Mask email for display
  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return email;
    const [local, domain] = email.split('@');
    const maskedLocal = local.length <= 3 
      ? local 
      : local.slice(0, 2) + '****' + local.slice(-1);
    return `${maskedLocal}@${domain}`;
  };

  // Timer functions
  const startTimer = () => {
    if (window.timerInterval) {
      clearInterval(window.timerInterval);
    }
    
    setTimeLeft(120);
    setCanResend(false);
    
    window.timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(window.timerInterval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle code input change
  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle keydown for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 6);
    
    if (digits) {
      const newCode = [...code];
      for (let i = 0; i < digits.length; i++) {
        newCode[i] = digits[i];
      }
      setCode(newCode);
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex].focus();
    }
  };

  // Get full code as string
  const getEnteredCode = () => {
    return code.join('');
  };

  // Verify email
  const verifyEmail = async () => {
    const enteredCode = getEnteredCode();
    
    if (enteredCode.length < 6) {
      setMessage('❌ Please enter the complete 6-digit verification code');
      setMessageColor('#f87171');
      return;
    }
    
    if (!userId) {
      setMessage('❌ No user session found. Please register again.');
      setMessageColor('#f87171');
      return;
    }
    
    setIsLoading(true);
    setMessage('⏳ Verifying...');
    setMessageColor('#94a3b8');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: parseInt(userId), 
          code: enteredCode 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Email verified successfully! Redirecting to login...');
        setMessageColor('#22c55e');
        setIsLoading(false);
        
        // Clear session data
        localStorage.removeItem('tempUserId');
        localStorage.removeItem('userEmail');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`❌ ${data.error || 'Invalid verification code'}`);
        setMessageColor('#f87171');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('❌ Cannot connect to server. Please make sure the backend is running.');
      setMessageColor('#f87171');
      setIsLoading(false);
    }
  };

  // Resend code
  const resendCode = async () => {
    if (!canResend) {
      setMessage(`⚠️ Please wait ${timeLeft} seconds before requesting a new code`);
      setMessageColor('#fbbf24');
      return;
    }
    
    setMessage('⏳ Sending new verification code...');
    setMessageColor('#94a3b8');
    
    try {
      // Call backend to resend code
      const response = await fetch(`${API_BASE_URL}/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId) })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ New verification code sent to your email!');
        setMessageColor('#22c55e');
        // Reset code inputs
        setCode(['', '', '', '', '', '']);
        startTimer();
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        setMessage(`❌ ${data.error || 'Failed to resend code'}`);
        setMessageColor('#f87171');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('❌ Failed to resend code. Please try again.');
      setMessageColor('#f87171');
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verifyEmail();
    }
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundGrid />
      <Orb className="orb-1" />
      <Orb className="orb-2" />

      <VerifyContainer>
        <LogoBadge>🔷Voltix Traders• Verify Account</LogoBadge>
        <Title>Verify Your Email</Title>
        <Subhead>We've sent a 6-digit verification code to your email</Subhead>

        <DestinationInfo>
          📧 Verification sent to <span>{maskEmail(userEmail)}</span>
        </DestinationInfo>

        <CodeInputs>
          {code.map((digit, index) => (
            <CodeDigit
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onKeyPress={handleKeyPress}
              onPaste={index === 0 ? handlePaste : undefined}
              autoFocus={index === 0}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </CodeInputs>

        <TimerSection>
          <span>⏱️ Code expires in </span>
          <Timer>{formatTime(timeLeft)}</Timer>
        </TimerSection>

        <TimerSection>
          <span>Didn't receive a code? </span>
          <ResendLink 
            canResend={canResend}
            onClick={resendCode}
          >
            Resend code
          </ResendLink>
        </TimerSection>

        <VerifyButton 
          onClick={verifyEmail}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Verifying...' : '✓ Verify Email'}
        </VerifyButton>

        <MessageArea color={messageColor}>
          {message || '\u00A0'}
        </MessageArea>

        <BackLink>
          <Link to="/login">← Back to Login</Link>
        </BackLink>
      </VerifyContainer>

      <FooterNote>
        © 2026 Voltix — Email verification required for account security
      </FooterNote>
    </>
  );
};

export default Verify;