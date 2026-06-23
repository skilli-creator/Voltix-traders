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

// Background grid overlay (replaces body::before)
const BackgroundGrid = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px);
  background-size: 35px 35px;
  pointer-events: none;
  z-index: 0;
`;

const RegisterContainer = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 44px 40px;
  background: rgba(8, 18, 38, 0.85);
  backdrop-filter: blur(18px);
  border-radius: 52px;
  box-shadow: 0 30px 55px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(34, 197, 94, 0.2);
  text-align: center;
  position: relative;
  z-index: 2;
  animation: ${fadeSlideUp} 0.6s ease;

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

// ===== FORM ELEMENTS =====
const Form = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 22px;
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

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    gap: 0;
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
  margin-top: 6px;
  color: #9ca3af;
`;

// ===== BUTTONS =====
const RegisterButton = styled.button`
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
  margin-top: 12px;

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
  margin-top: 18px;
  font-size: 13px;
  min-height: 44px;
  padding: 8px;
  border-radius: 60px;
  background: rgba(0, 0, 0, 0.3);
  color: ${props => props.color || '#94a3b8'};
  transition: all 0.3s ease;
`;

const LoginLink = styled.div`
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

// ============================================
// MAIN COMPONENT
// ============================================

const Register = () => {
  const navigate = useNavigate();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#94a3b8');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password strength
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthWidth, setStrengthWidth] = useState('0%');
  const [strengthColor, setStrengthColor] = useState('#ef4444');
  const [strengthLabel, setStrengthLabel] = useState('Enter a strong password');

  // ✅ FIXED: Vite uses import.meta.env instead of process.env
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Password strength checker
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
    if (password) {
      checkStrength(password);
    } else {
      setStrengthWidth('0%');
      setStrengthColor('#ef4444');
      setStrengthLabel('Enter a strong password');
    }
  }, [password]);

  // Validate phone number
  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstNameTrimmed = firstName.trim();
    const lastNameTrimmed = lastName.trim();
    const phoneTrimmed = phoneNumber.trim();
    const emailTrimmed = email.trim();
    const passwordTrimmed = password;
    const confirmPasswordTrimmed = confirmPassword;

    // Validation
    if (!firstNameTrimmed || !lastNameTrimmed) {
      setMessage('❌ First name and last name are required');
      setMessageColor('#f87171');
      return;
    }

    if (!phoneTrimmed || !emailTrimmed || !passwordTrimmed) {
      setMessage('❌ All fields are required');
      setMessageColor('#f87171');
      return;
    }

    if (!validatePhone(phoneTrimmed)) {
      setMessage('❌ Please enter a valid phone number with country code');
      setMessageColor('#f87171');
      return;
    }

    if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
      setMessage('❌ Please enter a valid email address');
      setMessageColor('#f87171');
      return;
    }

    if (passwordTrimmed !== confirmPasswordTrimmed) {
      setMessage('❌ Passwords do not match');
      setMessageColor('#f87171');
      return;
    }

    if (passwordTrimmed.length < 6) {
      setMessage('⚠️ Password must be at least 6 characters');
      setMessageColor('#fbbf24');
      return;
    }

    const strength = checkStrength(passwordTrimmed);
    if (strength < 2) {
      setMessage('⚠️ Please choose a stronger password');
      setMessageColor('#fbbf24');
      return;
    }

    setIsLoading(true);
    setMessage('⏳ Creating your account...');
    setMessageColor('#94a3b8');

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
        setIsLoading(false);
        
        setTimeout(() => {
          navigate('/verify');
        }, 2000);
      } else {
        setMessage(`❌ ${data.error || 'Registration failed'}`);
        setMessageColor('#f87171');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('❌ Cannot connect to server. Please make sure the backend is running.');
      setMessageColor('#f87171');
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundGrid />

      <RegisterContainer>
        <LogoBadge>🔷Voltix Traders• Join the future</LogoBadge>
        <Title>Create Account</Title>
        <Subhead>Start your automated trading journey</Subhead>

        <Form onSubmit={handleSubmit}>
          {/* Name Row */}
          <NameRow>
            <InputGroup>
              <label>📝 First Name</label>
              <Input
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>📝 Last Name</label>
              <Input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </InputGroup>
          </NameRow>

          {/* Phone Number */}
          <InputGroup>
            <label>📞 Phone Number</label>
            <Input
              type="tel"
              placeholder="+1 234 567 8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <PhoneHelper>Include country code (e.g., +1, +44)</PhoneHelper>
          </InputGroup>

          {/* Email */}
          <InputGroup>
            <label>📧 Email Address</label>
            <Input
              type="email"
              placeholder="trader@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          {/* Password */}
          <InputGroup>
            <label>🔒 Password</label>
            <PasswordWrapper>
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
            </PasswordWrapper>
            
            {/* Password Strength Meter */}
            <StrengthMeter>
              <StrengthFill width={strengthWidth} color={strengthColor} />
            </StrengthMeter>
            <StrengthText>{strengthLabel}</StrengthText>
          </InputGroup>

          {/* Confirm Password */}
          <InputGroup>
            <label>✓ Confirm Password</label>
            <PasswordWrapper>
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
            </PasswordWrapper>
          </InputGroup>

          {/* Submit Button */}
          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? '⏳ Creating Account...' : '🚀 Register & Start Trading'}
          </RegisterButton>
        </Form>

        {/* Message Area */}
        <MessageArea color={messageColor}>
          {message || '\u00A0'}
        </MessageArea>

        {/* Login Link */}
        <LoginLink>
          Already have an account? <Link to="/login">Sign in →</Link>
        </LoginLink>
      </RegisterContainer>
    </>
  );
};

export default Register;