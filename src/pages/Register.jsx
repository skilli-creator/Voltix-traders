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
    background: #f0f2f5;
    color: #0b1a33;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  #root {
    width: 100%;
    max-width: 1440px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    body {
      padding: 12px;
    }
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
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// ============================================
// MAIN CONTAINER
// ============================================
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  width: 100%;
  max-width: 1200px;
  min-height: 90vh;
  max-height: 95vh;
  background: #ffffff;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.08), 0 10px 30px rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    max-height: none;
    min-height: auto;
    border-radius: 28px;
  }

  @media (max-width: 480px) {
    border-radius: 20px;
  }
`;

// ============================================
// LEFT PANEL - SIGN UP FORM
// ============================================
const LeftPanel = styled.div`
  padding: 48px 44px 40px 44px;
  background: #ffffff;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 1200px) {
    padding: 36px 32px 32px 32px;
  }

  @media (max-width: 768px) {
    padding: 28px 24px 24px 24px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px 16px 16px;
  }
`;

const Brand = styled.div`
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #0b1a33;
  margin-bottom: 4px;

  span {
    color: #2563eb;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const SignInLink = styled.div`
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 32px;

  a {
    color: #2563eb;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  letter-spacing: 0.2px;
`;

const Hint = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: #94a3b8;
  margin-top: 3px;
  line-height: 1.4;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 1.5px solid #e8ecf0;
  border-radius: 14px;
  background: #fafbfc;
  transition: all 0.25s ease;
  outline: none;
  font-family: inherit;
  color: #0b1a33;

  &::placeholder {
    color: #b0b8c4;
    font-size: 14px;
  }

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.06);
    background: #ffffff;
  }

  &:hover:not(:focus) {
    border-color: #d0d7e2;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 12px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 1.5px solid #e8ecf0;
  border-radius: 14px;
  background: #fafbfc;
  transition: all 0.25s ease;
  outline: none;
  font-family: inherit;
  color: #0b1a33;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='10' viewBox='0 0 14 10'%3E%3Cpath d='M1 2l6 6 6-6' stroke='%2394a3b8' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 44px;
  cursor: pointer;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.06);
    background-color: #ffffff;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 12px;
  }
`;

const PhoneRow = styled.div`
  display: flex;
  gap: 10px;

  select {
    width: 100px;
    flex-shrink: 0;
  }

  input {
    flex: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;

    select {
      width: 100%;
    }
  }
`;

const PasswordHints = styled.ul`
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
  list-style: none;
  border: 1px solid #f1f4f9;

  li {
    padding: 3px 0;
    display: flex;
    align-items: center;
    gap: 10px;

    &::before {
      content: "●";
      color: #2563eb;
      font-size: 10px;
    }
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 10px 14px;
  }
`;

const CodeBox = styled.div`
  background: #f8fafc;
  border-radius: 14px;
  padding: 14px 20px;
  border: 1.5px dashed #dce2ec;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 2px;

  .code-digits {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: 10px;
    color: #0b1a33;
    background: #ffffff;
    padding: 6px 18px 6px 22px;
    border-radius: 12px;
    border: 1.5px solid #e8ecf0;
    font-family: 'Inter', monospace;
  }

  .code-label {
    font-size: 14px;
    color: #1e293b;
    font-weight: 500;
  }

  .code-input {
    flex: 1;
    min-width: 140px;

    input {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid #e8ecf0;
      border-radius: 12px;
      font-size: 15px;
      background: #ffffff;
      outline: none;
      font-family: inherit;
      color: #0b1a33;
      transition: all 0.25s ease;

      &:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.06);
      }

      &::placeholder {
        color: #b0b8c4;
      }
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;

    .code-digits {
      text-align: center;
      letter-spacing: 6px;
      font-size: 26px;
    }

    .code-input {
      min-width: auto;
    }
  }
`;

const CheckboxGroup = styled.div`
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14px;
    color: #1e293b;
    line-height: 1.5;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    min-width: 20px;
    margin-top: 1px;
    accent-color: #2563eb;
    border-radius: 5px;
    cursor: pointer;
    border: 2px solid #dce2ec;

    &:checked {
      border-color: #2563eb;
    }
  }

  .terms-link {
    color: #2563eb;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 13px;
    gap: 10px;
  }
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 18px;
  background: #2563eb;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 20px;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(37, 99, 235, 0.25);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 15px;
    font-size: 16px;
    border-radius: 14px;
    margin-top: 16px;
  }
`;

const Message = styled.div`
  margin-top: 14px;
  font-size: 14px;
  padding: 12px 16px;
  border-radius: 14px;
  background: ${props => props.isError ? 'rgba(239, 68, 68, 0.06)' : 'rgba(34, 197, 94, 0.06)'};
  color: ${props => props.color || '#6b7280'};
  border: 1px solid ${props => props.isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)'};
  text-align: center;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 13px;
    min-height: 40px;
    padding: 10px 14px;
  }
`;

// ============================================
// RIGHT PANEL - PROMO + DASHBOARD
// ============================================
const RightPanel = styled.div`
  background: #f8fafc;
  padding: 48px 44px 40px 44px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;

  @media (max-width: 1200px) {
    padding: 36px 32px 32px 32px;
  }

  @media (max-width: 768px) {
    padding: 28px 24px 24px 24px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px 16px 16px;
  }
`;

const PromoBox = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #eef2f6;

  .icon-wrap {
    font-size: 36px;
    margin-bottom: 12px;
    display: block;
  }

  .badge {
    display: inline-block;
    background: #dbeafe;
    color: #1d4ed8;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 16px;
    border-radius: 20px;
    letter-spacing: 0.3px;
    margin-bottom: 14px;
  }

  h2 {
    font-size: 22px;
    font-weight: 700;
    color: #0b1a33;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  p {
    color: #4b5563;
    font-size: 15px;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    padding: 24px 20px;

    h2 {
      font-size: 19px;
    }

    p {
      font-size: 14px;
    }
  }
`;

// Bottom section with accounts
const BottomSection = styled.div`
  margin-top: 24px;
`;

const NavTabs = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  span {
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    padding: 6px 14px;
    border-radius: 10px;
    cursor: default;
    transition: all 0.2s;

    &:first-child {
      color: #0b1a33;
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
  }

  @media (max-width: 480px) {
    gap: 2px;

    span {
      font-size: 12px;
      padding: 4px 10px;
    }
  }
`;

const AccountCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 28px;
  border: 1px solid #eef2f6;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);

  .account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .account-type {
      font-size: 13px;
      font-weight: 600;
      color: #6b7280;
      letter-spacing: 0.3px;
    }

    .account-badge {
      font-size: 11px;
      font-weight: 600;
      color: #22c55e;
      background: #dcfce7;
      padding: 2px 14px;
      border-radius: 20px;
    }
  }

  .account-details {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .account-number {
      .label {
        font-size: 11px;
        font-weight: 500;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .number {
        font-size: 20px;
        font-weight: 700;
        color: #0b1a33;
        margin-top: 2px;
        letter-spacing: 0.5px;
      }
    }

    .account-balance {
      text-align: right;

      .label {
        font-size: 11px;
        font-weight: 500;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .balance {
        font-size: 28px;
        font-weight: 800;
        color: #0b1a33;
        margin-top: 2px;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 18px 16px;

    .account-details {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .account-balance {
        text-align: left;
        width: 100%;
      }
    }

    .account-details .account-number .number {
      font-size: 17px;
    }

    .account-details .account-balance .balance {
      font-size: 24px;
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Register = () => {
  const navigate = useNavigate();
  
  const [country, setCountry] = useState('KE');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneCode, setPhoneCode] = useState('+254');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(true);
  
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#6b7280');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstNameTrimmed = firstName.trim();
    const lastNameTrimmed = lastName.trim();
    const phoneTrimmed = phoneNumber.trim();
    const emailTrimmed = email.trim();
    const passwordTrimmed = password;

    if (!firstNameTrimmed || !lastNameTrimmed) {
      setMessage('First & last name required');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (!phoneTrimmed || !emailTrimmed || !passwordTrimmed) {
      setMessage('All fields required');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (!validatePhone(phoneTrimmed)) {
      setMessage('Valid phone with country code required');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
      setMessage('Please enter a valid email address');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (passwordTrimmed.length < 8 || passwordTrimmed.length > 15) {
      setMessage('Password must be 8-15 characters');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (!/[a-z]/.test(passwordTrimmed) || !/[A-Z]/.test(passwordTrimmed)) {
      setMessage('Use both uppercase and lowercase letters');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (!/[0-9]/.test(passwordTrimmed) || !/[a-zA-Z]/.test(passwordTrimmed)) {
      setMessage('Use a combination of numbers and English letters');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (!verificationCode.trim()) {
      setMessage('Please enter the verification code');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (!termsAccepted) {
      setMessage('You must accept the Terms and Conditions');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('Creating account...');
    setMessageColor('#6b7280');
    setIsError(false);

    try {
      const fullPhone = phoneCode + phoneTrimmed;
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstNameTrimmed,
          last_name: lastNameTrimmed,
          phone: fullPhone,
          email: emailTrimmed,
          password: passwordTrimmed,
          country: country,
          verification_code: verificationCode.trim(),
          marketing_opt_in: marketingAccepted
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        localStorage.setItem('tempUserId', data.user_id);
        localStorage.setItem('userEmail', emailTrimmed);
        
        setMessage('Account created! Check your email.');
        setMessageColor('#22c55e');
        setIsError(false);
        setIsLoading(false);
        
        setTimeout(() => {
          navigate('/verify');
        }, 2000);
      } else {
        setMessage(data.error || 'Registration failed. Please try again.');
        setMessageColor('#ef4444');
        setIsError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Cannot connect to server. Please check your connection.');
      setMessageColor('#ef4444');
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      
      <Container>
        {/* ========== LEFT PANEL ========== */}
        <LeftPanel>
          <Brand>MyTradeApp</Brand>
          <SignInLink>
            Already have an account? <Link to="/login">Sign In</Link>
          </SignInLink>

          <Form onSubmit={handleSubmit}>
            {/* Country */}
            <FormGroup>
              <Label>Country</Label>
              <Select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="KE">Kenya</option>
                <option value="NG">Nigeria</option>
                <option value="ZA">South Africa</option>
                <option value="GH">Ghana</option>
                <option value="UG">Uganda</option>
                <option value="TZ">Tanzania</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
              </Select>
            </FormGroup>

            {/* Email */}
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Hint>Make sure you enter a valid email. It will be used for login.</Hint>
            </FormGroup>

            {/* Password */}
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordHints>
                <li>Use from 8 to 15 characters</li>
                <li>Use both uppercase and lowercase letters</li>
                <li>Use a combination of numbers and English letters</li>
              </PasswordHints>
            </FormGroup>

            {/* Full Name */}
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                placeholder="Full Name"
                value={firstName + (lastName ? ' ' + lastName : '')}
                onChange={(e) => {
                  const parts = e.target.value.split(' ');
                  setFirstName(parts[0] || '');
                  setLastName(parts.slice(1).join(' ') || '');
                }}
                required
              />
            </FormGroup>

            {/* Phone Number */}
            <FormGroup>
              <Label>Phone Number</Label>
              <PhoneRow>
                <Select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                >
                  <option value="+254">+254</option>
                  <option value="+234">+234</option>
                  <option value="+27">+27</option>
                  <option value="+233">+233</option>
                  <option value="+256">+256</option>
                  <option value="+255">+255</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </Select>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </PhoneRow>
            </FormGroup>

            {/* Verification Code */}
            <FormGroup>
              <Label>Please enter this number</Label>
              <CodeBox>
                <span className="code-digits">7 9 1 0</span>
                <span className="code-label">Number</span>
                <div className="code-input">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
              </CodeBox>
            </FormGroup>

            {/* Checkboxes */}
            <CheckboxGroup>
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                I confirm that I'm not a U.S. tax person, I'm over 18, and I accept
                <a href="#" className="terms-link">Terms and Conditions</a>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                />
                I agree to receive MyTradeApp marketing updates
              </label>
            </CheckboxGroup>

            {/* Submit */}
            <SignUpButton type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign up'}
            </SignUpButton>
          </Form>

          {message && (
            <Message color={messageColor} isError={isError}>
              {message}
            </Message>
          )}
        </LeftPanel>

        {/* ========== RIGHT PANEL ========== */}
        <RightPanel>
          <PromoBox>
            <span className="icon-wrap">📈</span>
            <div className="badge">⚡ Trusted by traders</div>
            <h2>Trade with confidence</h2>
            <p>Navigate the financial markets effortlessly</p>
          </PromoBox>

          <BottomSection>
            <NavTabs>
              <span>Accounts</span>
              <span>Funds</span>
              <span>Partners</span>
              <span>Copy/Trading</span>
              <span>Promotions</span>
            </NavTabs>

            <AccountCard>
              <div className="account-header">
                <span className="account-type">Accounts | Real</span>
                <span className="account-badge">● Live</span>
              </div>
              <div className="account-details">
                <div className="account-number">
                  <div className="label">ACCOUNT</div>
                  <div className="number">Standard</div>
                  <div className="number" style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                    25458291
                  </div>
                </div>
                <div className="account-balance">
                  <div className="label">BALANCE</div>
                  <div className="balance">$348.55</div>
                </div>
              </div>
            </AccountCard>
          </BottomSection>
        </RightPanel>
      </Container>
    </>
  );
};

export default Register;