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
    background: #f8fafc;
    color: #0b1a33;
    padding: 24px;
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
      padding: 12px;
    }
  }
`;

// ============================================
// ANIMATIONS
// ============================================
const floatIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(30px) scale(0.96);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
`;

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.8); opacity: 0; }
`;

// ============================================
// MAIN CONTAINER - MATCHES VALETAX LAYOUT
// ============================================
const Container = styled.div`
  max-width: 1040px;
  width: 100%;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  animation: ${floatIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    border-radius: 24px;
  }
`;

// ============================================
// LEFT PANEL - SIGN UP FORM
// ============================================
const LeftPanel = styled.div`
  padding: 48px 40px 40px 40px;
  background: #ffffff;

  @media (max-width: 820px) {
    padding: 32px 24px;
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
  }
`;

const Brand = styled.div`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #0b1a33;
  margin-bottom: 6px;

  span {
    color: #2563eb;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const SignInLink = styled.div`
  font-size: 15px;
  color: #4b5563;
  margin-bottom: 32px;

  a {
    color: #2563eb;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

const Form = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

const Hint = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin-top: 2px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #f9fafb;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  font-family: inherit;
  color: #0b1a33;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    background: #ffffff;
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 14px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #f9fafb;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  font-family: inherit;
  color: #0b1a33;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234b5563' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    background: #ffffff;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 14px;
  }
`;

const PhoneRow = styled.div`
  display: flex;
  gap: 8px;

  select {
    width: 90px;
    flex-shrink: 0;
  }

  input {
    flex: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;

    select {
      width: 100%;
    }
  }
`;

const PasswordHints = styled.ul`
  background: #f1f5f9;
  border-radius: 10px;
  padding: 12px 16px;
  margin-top: 8px;
  font-size: 13px;
  color: #334155;
  list-style: none;

  li {
    padding: 2px 0;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: "•";
      color: #2563eb;
      font-weight: 700;
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 10px 14px;
  }
`;

const CodeBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px 20px;
  border: 1.5px dashed #d1d9e6;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 4px;

  .code-digits {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 8px;
    color: #0b1a33;
    background: #ffffff;
    padding: 4px 16px 4px 20px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
  }

  .code-label {
    font-size: 14px;
    color: #1e293b;
    font-weight: 500;
  }

  .code-input {
    flex: 1;
    min-width: 120px;

    input {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 15px;
      background: #ffffff;
      outline: none;
      font-family: inherit;
      color: #0b1a33;

      &:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }
    }
  }

  @media (max-width: 820px) {
    flex-direction: column;
    align-items: stretch;

    .code-digits {
      text-align: center;
      letter-spacing: 6px;
      font-size: 24px;
    }
  }
`;

const CheckboxGroup = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: #1e293b;
    line-height: 1.5;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    min-width: 18px;
    margin-top: 1px;
    accent-color: #2563eb;
    border-radius: 4px;
    cursor: pointer;
  }

  .terms-link {
    color: #2563eb;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #2563eb;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-top: 22px;
  letter-spacing: 0.3px;

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 14px;
    font-size: 16px;
    margin-top: 18px;
  }
`;

const Message = styled.div`
  margin-top: 12px;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 10px;
  background: ${props => props.isError ? 'rgba(239, 68, 68, 0.06)' : 'rgba(34, 197, 94, 0.06)'};
  color: ${props => props.color || '#6b7280'};
  border: 1px solid ${props => props.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
  text-align: center;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    font-size: 12px;
    min-height: 36px;
  }
`;

// ============================================
// RIGHT PANEL - PROMO + DASHBOARD
// ============================================
const RightPanel = styled.div`
  background: #f1f5f9;
  padding: 48px 40px 40px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 820px) {
    padding: 32px 24px;
    gap: 24px;
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
    gap: 20px;
  }
`;

const PromoBox = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #e9edf2;

  .icon-wrap {
    font-size: 32px;
    color: #2563eb;
    margin-bottom: 12px;
  }

  .badge {
    display: inline-block;
    background: #dbeafe;
    color: #1d4ed8;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 14px;
    border-radius: 20px;
    letter-spacing: 0.3px;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #0b1a33;
    margin-bottom: 6px;
  }

  p {
    color: #4b5563;
    font-size: 14px;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;

    h2 {
      font-size: 18px;
    }

    p {
      font-size: 13px;
    }
  }
`;

const Dashboard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 24px 20px 24px;
  border: 1px solid #e9edf2;

  .dash-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      font-size: 16px;
      font-weight: 700;
      color: #0b1a33;

      .dash-sub {
        font-weight: 400;
        color: #4b5563;
      }
    }

    > span {
      font-size: 12px;
      color: #6b7280;
    }
  }

  .dash-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 20px;

    .dash-item {
      display: flex;
      flex-direction: column;

      .label {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .value {
        font-size: 22px;
        font-weight: 700;
        color: #0b1a33;
      }

      .sub {
        font-size: 13px;
        color: #4b5563;
      }
    }
  }

  .dash-divider {
    border-top: 1px solid #e9edf2;
    margin: 16px 0 12px 0;
  }

  .dash-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;

    a {
      color: #2563eb;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .stars {
      color: #f59e0b;
      letter-spacing: 2px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    padding: 16px;

    .dash-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .dash-header h3 {
      font-size: 14px;
    }

    .dash-item .value {
      font-size: 18px;
    }

    .dash-footer {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
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
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
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
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Hint>Make sure you enter a valid email. It will be used for login.</Hint>
            </FormGroup>

            {/* Password */}
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
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
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                placeholder="Full Name"
                value={`${firstName} ${lastName}`}
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
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneRow>
                <Select
                  id="phoneCode"
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
                  id="phone"
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
            <div className="icon-wrap">⚡</div>
            <div className="badge">Trusted by traders</div>
            <h2>Swift and Secure Payouts</h2>
            <p>
              Enjoy the convenience of fast and secure transactions — withdraw
              your earnings in minutes, not days.
            </p>
          </PromoBox>

          <Dashboard>
            <div className="dash-header">
              <h3>
                MyTradeApp <span className="dash-sub">Partnership</span>
              </h3>
              <span>Summary</span>
            </div>

            <div className="dash-grid">
              <div className="dash-item">
                <span className="label">Partnership overview</span>
                <span className="value">$0</span>
                <span className="sub">Commissioned Earned</span>
              </div>
              <div className="dash-item">
                <span className="label">&nbsp;</span>
                <span className="value">0</span>
                <span className="sub">Referred Clients</span>
              </div>
              <div className="dash-item">
                <span className="label">&nbsp;</span>
                <span className="value">0</span>
                <span className="sub">Referred Account</span>
              </div>
              <div className="dash-item">
                <span className="label">&nbsp;</span>
                <span className="value">Today</span>
                <span className="sub">0 lots</span>
              </div>
            </div>

            <div className="dash-divider"></div>

            <div className="dash-footer">
              <a href="#">
                <span style={{ marginRight: '6px' }}>↗</span>
                Share your rating
              </a>
              <span className="stars">★★★★☆</span>
            </div>
          </Dashboard>
        </RightPanel>
      </Container>
    </>
  );
};

export default Register;