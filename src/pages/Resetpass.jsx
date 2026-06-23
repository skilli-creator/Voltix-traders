import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// ============================================
// GLOBAL STYLES - FIXED
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
    justify-content: center;
    align-items: center;
    background: radial-gradient(ellipse at 30% 20%, #0a1428, #02040c);
    color: #f1f5f9;
    padding: 20px;
    margin: 0;
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

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(ellipse at 30% 20%, #0a1428, #02040c);
  padding: 20px;
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
  text-align: left;
  margin-bottom: 24px;

  label {
    font-size: 13px;
    color: #cbd5e1;
    display: block;
    margin-bottom: 8px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 45px 14px 16px;
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

const TogglePasswordBtn = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  transition: color 0.2s;
  z-index: 2;
  padding: 5px;
  line-height: 1;

  &:hover {
    color: #22c55e;
  }

  &:focus {
    outline: none;
  }
`;

// ===== PASSWORD STRENGTH =====
const StrengthMeter = styled.div`
  margin-top: 8px;
  height: 4px;
  background: #1e293b;
  border-radius: 4px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  width: ${props => props.width || '0%'};
  height: 100%;
  background-color: ${props => props.color || '#ef4444'};
  transition: width 0.3s ease;
`;

const StrengthText = styled.div`
  font-size: 10px;
  margin-top: 5px;
  color: ${props => props.color || '#64748b'};
  transition: color 0.3s ease;
`;

// ===== BUTTONS =====
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
  margin-top: 10px;

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
// MAIN COMPONENT
// ============================================

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  // State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [messageBg, setMessageBg] = useState('rgba(0, 0, 0, 0.3)');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // Password strength
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthWidth, setStrengthWidth] = useState('0%');
  const [strengthColor, setStrengthColor] = useState('#ef4444');
  const [strengthLabel, setStrengthLabel] = useState('Enter a strong password');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Check for reset token in URL or sessionStorage
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
        setMessage('⚠️ No reset token found. Please request a password reset.');
        setMessageColor('#fbbf24');
        setMessageBg('rgba(251, 191, 36, 0.1)');
        
        setTimeout(() => {
          navigate('/forgotpass');
        }, 2000);
      }
    }
  }, [location, navigate]);

  // Check password strength
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

  // Handle password input
  useEffect(() => {
    if (newPassword) {
      checkStrength(newPassword);
    } else {
      setStrengthWidth('0%');
      setStrengthColor('#ef4444');
      setStrengthLabel('Enter a strong password');
    }
  }, [newPassword]);

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

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
    
    const newPasswordTrimmed = newPassword.trim();
    const confirmPasswordTrimmed = confirmPassword.trim();
    
    setMessage('');
    setMessageColor('#94a3b8');
    setMessageBg('rgba(0, 0, 0, 0.3)');

    if (!newPasswordTrimmed || !confirmPasswordTrimmed) {
      setMessage('❌ Please fill in all fields');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      shakeContainer();
      return;
    }

    if (newPasswordTrimmed !== confirmPasswordTrimmed) {
      setMessage('❌ Passwords do not match');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      shakeContainer();
      return;
    }

    if (newPasswordTrimmed.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      shakeContainer();
      return;
    }

    const strength = checkStrength(newPasswordTrimmed);
    if (strength < 2) {
      setMessage('❌ Please choose a stronger password');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      shakeContainer();
      return;
    }

    if (!resetToken) {
      setMessage('❌ No reset token found. Please request a new password reset.');
      setMessageColor('#f87171');
      setMessageBg('rgba(239, 68, 68, 0.1)');
      return;
    }

    setIsLoading(true);
    setMessage('⏳ Resetting password...');
    setMessageColor('#94a3b8');
    setMessageBg('rgba(0, 0, 0, 0.3)');

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
        setMessageBg('rgba(34, 197, 94, 0.1)');
        setIsLoading(false);

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`❌ ${data.error || 'Reset failed'}`);
        setMessageColor('#f87171');
        setMessageBg('rgba(239, 68, 68, 0.1)');
        setIsLoading(false);
        shakeContainer();
      }
    } catch (error) {
      console.error('Reset error:', error);
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
      <PageWrapper>
        <Container ref={containerRef}>
          <Logo>🔷Voltix Traders</Logo>
          <Title>Create New Password</Title>
          <Subhead>Enter your new password below</Subhead>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <label>🔒 New Password</label>
              <InputWrapper>
                <Input
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
              </InputWrapper>
              
              <StrengthMeter>
                <StrengthFill width={strengthWidth} color={strengthColor} />
              </StrengthMeter>
              <StrengthText color={strengthColor}>
                {strengthLabel}
              </StrengthText>
            </InputGroup>

            <InputGroup>
              <label>✓ Confirm Password</label>
              <InputWrapper>
                <Input
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
              </InputWrapper>
            </InputGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? '⏳ Resetting...' : 'Reset Password →'}
            </SubmitButton>
          </Form>

          <Message color={messageColor} bg={messageBg}>
            {message || '\u00A0'}
          </Message>

          <BackLink>
            <Link to="/login">← Back to Login</Link>
          </BackLink>
        </Container>
      </PageWrapper>
    </>
  );
};

export default ResetPassword;