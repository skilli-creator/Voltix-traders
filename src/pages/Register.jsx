import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #f0f2f5;
    color: #1a2332;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  #root {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    body {
      padding: 16px;
    }
  }

  @media (max-width: 480px) {
    body {
      padding: 12px;
    }
  }
`;

// ============================================
// MAIN WRAPPER
// ============================================
const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.03);
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  min-height: 90vh;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
    border-radius: 24px;
  }

  @media (max-width: 480px) {
    border-radius: 16px;
  }
`;

// ============================================
// LEFT COLUMN - SIGN UP
// ============================================
const LeftColumn = styled.div`
  padding: 48px 44px 40px 44px;
  background: #ffffff;
  overflow-y: auto;

  @media (max-width: 1024px) {
    padding: 40px 32px 32px 32px;
  }

  @media (max-width: 768px) {
    padding: 32px 24px 24px 24px;
  }

  @media (max-width: 480px) {
    padding: 24px 16px 20px 16px;
  }
`;

const Brand = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1a2332;
  letter-spacing: -0.3px;
  margin-bottom: 4px;

  span {
    color: #2563eb;
  }
`;

const SubHeader = styled.div`
  font-size: 15px;
  color: #6b7a8f;
  margin-bottom: 28px;

  a {
    color: #2563eb;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Field = styled.div`
  margin-bottom: 18px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a2332;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 16px;
  font-size: 15px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #fafbfc;
  outline: none;
  font-family: inherit;
  color: #1a2332;
  transition: border 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #a0aec0;
  }

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.06);
    background: #ffffff;
  }

  @media (max-width: 480px) {
    padding: 11px 14px;
    font-size: 14px;
    border-radius: 10px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 13px 16px;
  font-size: 15px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #fafbfc;
  outline: none;
  font-family: inherit;
  color: #1a2332;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.06);
    background: #ffffff;
  }

  @media (max-width: 480px) {
    padding: 11px 14px;
    font-size: 14px;
    border-radius: 10px;
  }
`;

const Hint = styled.span`
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 3px;
`;

const PasswordRules = styled.ul`
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px 16px;
  margin-top: 6px;
  list-style: none;
  border: 1px solid #f1f4f8;

  li {
    font-size: 13px;
    color: #475569;
    padding: 2px 0;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: "•";
      color: #2563eb;
      font-weight: 700;
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    li {
      font-size: 12px;
    }
  }
`;

const PhoneRow = styled.div`
  display: flex;
  gap: 10px;

  select {
    width: 90px;
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

const VerificationBox = styled.div`
  background: #f8fafc;
  border: 1.5px dashed #dce2ec;
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 4px;

  .code {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 8px;
    color: #1a2332;
    background: #ffffff;
    padding: 4px 16px 4px 20px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-family: monospace;
  }

  .label {
    font-size: 14px;
    font-weight: 500;
    color: #1a2332;
  }

  .input-wrap {
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
      color: #1a2332;

      &:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.06);
      }

      &::placeholder {
        color: #a0aec0;
      }
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;

    .code {
      text-align: center;
      letter-spacing: 6px;
      font-size: 22px;
    }

    .input-wrap {
      min-width: auto;
    }
  }
`;

const Checkboxes = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: #1a2332;
    line-height: 1.5;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    min-width: 18px;
    margin-top: 2px;
    accent-color: #2563eb;
    cursor: pointer;
  }

  a {
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

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: #2563eb;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-top: 20px;
  letter-spacing: 0.2px;

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
    font-size: 15px;
    border-radius: 12px;
    margin-top: 16px;
  }
`;

const Message = styled.div`
  margin-top: 14px;
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 12px;
  background: ${props => props.isError ? 'rgba(239, 68, 68, 0.05)' : 'rgba(34, 197, 94, 0.05)'};
  color: ${props => props.color || '#6b7a8f'};
  border: 1px solid ${props => props.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
  text-align: center;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ============================================
// RIGHT COLUMN - SWIFT PAYOUTS + PARTNERSHIP
// ============================================
const RightColumn = styled.div`
  background: #f8fafc;
  padding: 48px 44px 40px 44px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 1024px) {
    padding: 40px 32px 32px 32px;
  }

  @media (max-width: 768px) {
    padding: 32px 24px 24px 24px;
  }

  @media (max-width: 480px) {
    padding: 24px 16px 20px 16px;
  }
`;

// ====== Swift & Secure Payouts ======
const PayoutCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 24px;
  border: 1px solid #eef2f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  .icon {
    font-size: 32px;
    margin-bottom: 8px;
    display: block;
  }

  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #1a2332;
    margin-bottom: 4px;
  }

  p {
    color: #6b7a8f;
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

// ====== Partnership Dashboard ======
const PartnershipSection = styled.div`
  margin-top: 24px;
`;

const PartnershipHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1a2332;

    span {
      font-weight: 400;
      color: #6b7a8f;
    }
  }

  .summary-label {
    font-size: 12px;
    font-weight: 500;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`;

const PartnershipGrid = styled.div`
  background: #ffffff;
  border-radius: 18px;
  padding: 22px 24px;
  border: 1px solid #eef2f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 20px;

    .item {
      display: flex;
      flex-direction: column;

      .label {
        font-size: 11px;
        font-weight: 500;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .value {
        font-size: 22px;
        font-weight: 700;
        color: #1a2332;
        margin-top: 2px;
      }

      .sub {
        font-size: 13px;
        color: #6b7a8f;
        margin-top: 1px;
      }
    }
  }

  .divider {
    border-top: 1px solid #eef2f6;
    margin: 16px 0 12px 0;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2px;

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

    .grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .footer {
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
  const [messageColor, setMessageColor] = useState('#6b7a8f');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstNameTrimmed = firstName.trim();
    const lastNameTrimmed = lastName.trim();
    const phoneTrimmed = phoneNumber.trim();
    const emailTrimmed = email.trim();
    const passwordTrimmed = password;

    if (!firstNameTrimmed || !lastNameTrimmed) {
      setMessage('First and last name are required');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (!phoneTrimmed || !emailTrimmed || !passwordTrimmed) {
      setMessage('All fields are required');
      setMessageColor('#ef4444');
      setIsError(true);
      return;
    }

    if (phoneTrimmed.replace(/\D/g, '').length < 8) {
      setMessage('Please enter a valid phone number');
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
    setMessage('Creating your account...');
    setMessageColor('#6b7a8f');
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
          marketing_opt_in: marketingAccepted,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        localStorage.setItem('tempUserId', data.user_id);
        localStorage.setItem('userEmail', emailTrimmed);

        setMessage('Account created! Please check your email.');
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
      setMessage('Unable to connect to the server. Please check your connection.');
      setMessageColor('#ef4444');
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        {/* ===== LEFT: SIGN UP ===== */}
        <LeftColumn>
          <Brand>MyTradeApp</Brand>
          <SubHeader>
            Already have an account? <Link to="/login">Sign In</Link>
          </SubHeader>

          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>Country</Label>
              <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="KE">Kenya</option>
                <option value="NG">Nigeria</option>
                <option value="ZA">South Africa</option>
                <option value="GH">Ghana</option>
                <option value="UG">Uganda</option>
                <option value="TZ">Tanzania</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
              </Select>
            </Field>

            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Hint>Make sure you enter a valid email. It will be used for login.</Hint>
            </Field>

            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordRules>
                <li>Use from 8 to 15 characters</li>
                <li>Use both uppercase and lowercase letters</li>
                <li>Use a combination of numbers and English letters</li>
              </PasswordRules>
            </Field>

            <Field>
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
            </Field>

            <Field>
              <Label>Phone Number</Label>
              <PhoneRow>
                <Select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)}>
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
            </Field>

            <Field>
              <Label>Please enter this number</Label>
              <VerificationBox>
                <span className="code">7 9 1 0</span>
                <span className="label">Number</span>
                <div className="input-wrap">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
              </VerificationBox>
            </Field>

            <Checkboxes>
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                I confirm that I'm not a U.S. tax person, I'm over 18, and I accept
                <a href="#">Terms and Conditions</a>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                />
                I agree to receive MyTradeApp marketing updates
              </label>
            </Checkboxes>

            <SubmitBtn type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign up'}
            </SubmitBtn>
          </Form>

          {message && (
            <Message color={messageColor} isError={isError}>
              {message}
            </Message>
          )}
        </LeftColumn>

        {/* ===== RIGHT: SWIFT PAYOUTS + PARTNERSHIP ===== */}
        <RightColumn>
          {/* Swift and Secure Payouts */}
          <PayoutCard>
            <span className="icon">⚡</span>
            <h2>Swift and Secure Payouts</h2>
            <p>Enjoy the convenience of fast and secure transactions</p>
          </PayoutCard>

          {/* Partnership Dashboard */}
          <PartnershipSection>
            <PartnershipHeader>
              <h3>
                MyTradeApp <span>Partnership</span>
              </h3>
              <span className="summary-label">Summary</span>
            </PartnershipHeader>

            <PartnershipGrid>
              <div className="grid">
                <div className="item">
                  <span className="label">Partnership overview</span>
                  <span className="value">$0</span>
                  <span className="sub">Commissioned Earned</span>
                </div>
                <div className="item">
                  <span className="label">&nbsp;</span>
                  <span className="value">0</span>
                  <span className="sub">Referred Clients</span>
                </div>
                <div className="item">
                  <span className="label">&nbsp;</span>
                  <span className="value">0</span>
                  <span className="sub">Referred Account</span>
                </div>
                <div className="item">
                  <span className="label">&nbsp;</span>
                  <span className="value">Today</span>
                  <span className="sub">0 lots</span>
                </div>
              </div>

              <div className="divider" />

              <div className="footer">
                <a href="#">
                  <span style={{ marginRight: '6px' }}>↗</span>
                  Share your rating
                </a>
                <span className="stars">★★★★☆</span>
              </div>
            </PartnershipGrid>
          </PartnershipSection>
        </RightColumn>
      </Wrapper>
    </>
  );
};

export default Register;