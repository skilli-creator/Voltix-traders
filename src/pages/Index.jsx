// src/pages/SignUp.jsx

import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

/* ============================================================
   THEME (isolated so it doesn't depend on your dashboard themes)
   ============================================================ */
const theme = {
  colors: {
    bg: '#0a0d14',
    panel: '#0f1420',
    panelAlt: '#141b2d',
    surface: '#161d2e',
    surfaceHover: '#1c2438',
    border: '#232c42',
    borderFocus: '#3b82f6',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    accent: '#3b82f6',
    accentHover: '#2563eb',
    accentSoft: 'rgba(59, 130, 246, 0.12)',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    shadow: '0 20px 60px -20px rgba(0, 0, 0, 0.6)',
    shadowSm: '0 4px 14px -4px rgba(0, 0, 0, 0.4)',
    gradientAd: 'linear-gradient(135deg, #1e293b 0%, #0f172a 55%, #020617 100%)',
    gradientBtn: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
};

/* ============================================================
   GLOBAL RESET (scoped to this page only via a class)
   ============================================================ */
const GlobalStyle = createGlobalStyle`
  .mtapp-signup, .mtapp-signup * { box-sizing: border-box; }
  .mtapp-signup {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
      Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

/* ============================================================
   ANIMATIONS
   ============================================================ */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const floaty = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
`;

const pulseRing = keyframes`
  0%   { transform: scale(0.9); opacity: 0.7; }
  70%  { transform: scale(1.35); opacity: 0; }
  100% { transform: scale(1.35); opacity: 0; }
`;

/* ============================================================
   LAYOUT
   ============================================================ */
const Page = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  background: ${theme.colors.bg};
  color: ${theme.colors.text};

  /* Phone / tablet: hide the ad panel, sign up takes the whole screen */
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

/* ============================================================
   LEFT — SIGN UP FORM
   ============================================================ */
const FormSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 40px;
  position: relative;
  overflow-y: auto;

  @media (max-width: 1024px) {
    padding: 32px 20px 48px;
    justify-content: flex-start;
  }
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 440px;
  animation: ${fadeUp} 0.5s ease both;

  @media (max-width: 1024px) {
    max-width: 460px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    margin-bottom: 28px;
  }
`;

const BrandMark = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${theme.colors.gradientBtn};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  color: #fff;
  box-shadow: 0 6px 18px -6px rgba(59, 130, 246, 0.6);
`;

const BrandName = styled.span`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: ${theme.colors.text};

  span {
    color: ${theme.colors.accent};
  }
`;

const Heading = styled.h1`
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0 0 8px;
  color: ${theme.colors.text};

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const Subheading = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  margin: 0 0 28px;
  line-height: 1.5;
`;

const SocialRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 22px;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 12px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  color: ${theme.colors.text};
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  svg { flex-shrink: 0; }

  &:hover {
    background: ${theme.colors.surfaceHover};
    border-color: #334155;
  }
  &:active { transform: scale(0.98); }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0;
  color: ${theme.colors.textMuted};
  font-size: 12px;
  font-weight: 500;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${theme.colors.border};
  }
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  margin-bottom: 7px;
  letter-spacing: 0.1px;
`;

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  padding-right: ${props => (props.hasToggle ? '44px' : '14px')};
  background: ${theme.colors.surface};
  border: 1px solid ${props => (props.error ? theme.colors.danger : theme.colors.border)};
  border-radius: 10px;
  color: ${theme.colors.text};
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder { color: ${theme.colors.textMuted}; }

  &:focus {
    border-color: ${props => (props.error ? theme.colors.danger : theme.colors.borderFocus)};
    box-shadow: 0 0 0 3px
      ${props => (props.error ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)')};
  }
`;

const ToggleBtn = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: ${theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover { color: ${theme.colors.textSecondary}; }
`;

const ErrorText = styled.span`
  display: block;
  font-size: 12px;
  color: ${theme.colors.danger};
  margin-top: 6px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 6px 0 20px;
  font-size: 13px;
  flex-wrap: wrap;
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  font-size: 13px;
  line-height: 1.5;
  user-select: none;

  input {
    appearance: none;
    -webkit-appearance: none;
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    margin-top: 1px;
    border: 1.5px solid ${theme.colors.border};
    border-radius: 5px;
    background: ${theme.colors.surface};
    cursor: pointer;
    position: relative;
    transition: all 0.15s ease;
  }

  input:checked {
    background: ${theme.colors.accent};
    border-color: ${theme.colors.accent};
  }

  input:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1.5px;
    width: 4px;
    height: 9px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  a {
    color: ${theme.colors.accent};
    text-decoration: none;
    font-weight: 600;
  }
  a:hover { text-decoration: underline; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px 16px;
  background: ${theme.colors.gradientBtn};
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.1px;
  box-shadow: 0 8px 22px -10px rgba(59, 130, 246, 0.7);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover { transform: translateY(-1px); box-shadow: 0 12px 28px -10px rgba(59, 130, 246, 0.85); }
  &:active { transform: translateY(0) scale(0.99); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const Spinner = styled.span`
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const BottomText = styled.p`
  margin: 24px 0 0;
  text-align: center;
  font-size: 13.5px;
  color: ${theme.colors.textSecondary};

  a {
    color: ${theme.colors.accent};
    font-weight: 600;
    text-decoration: none;
    margin-left: 4px;
  }
  a:hover { text-decoration: underline; }
`;

/* ============================================================
   RIGHT — AD / MARKETING PANEL
   ============================================================ */
const AdSide = styled.div`
  position: relative;
  background: ${theme.colors.gradientAd};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 56px;

  /* Grid pattern */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
    pointer-events: none;
  }

  /* Accent glow */
  &::after {
    content: '';
    position: absolute;
    top: -140px;
    right: -140px;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 65%);
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const AdContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 520px;
  width: 100%;
  animation: ${fadeUp} 0.7s ease 0.1s both;
`;

const AdBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: ${theme.colors.accentSoft};
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #93c5fd;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  margin-bottom: 22px;

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${theme.colors.success};
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 1.5px solid ${theme.colors.success};
      animation: ${pulseRing} 1.8s ease-out infinite;
    }
  }
`;

const AdHeading = styled.h2`
  font-size: 40px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 0 0 16px;
  color: #f8fafc;

  span {
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const AdSub = styled.p`
  font-size: 15.5px;
  line-height: 1.65;
  color: ${theme.colors.textSecondary};
  margin: 0 0 36px;
  max-width: 460px;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 0 0 40px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateX(4px);
    border-color: rgba(59, 130, 246, 0.35);
  }
`;

const FeatureIcon = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: ${theme.colors.accentSoft};
  border: 1px solid rgba(59, 130, 246, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;

  svg { width: 18px; height: 18px; }
`;

const FeatureText = styled.div`
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #e2e8f0;
    margin: 0 0 3px;
    letter-spacing: -0.1px;
  }
  p {
    font-size: 13px;
    color: ${theme.colors.textSecondary};
    margin: 0;
    line-height: 1.5;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding-top: 28px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
`;

const Stat = styled.div`
  .value {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: #f1f5f9;
    margin-bottom: 3px;
  }
  .label {
    font-size: 12px;
    color: ${theme.colors.textMuted};
    font-weight: 500;
  }
`;

const FloatingTicker = styled.div`
  position: absolute;
  bottom: 44px;
  right: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 12px;
  font-size: 12.5px;
  box-shadow: ${theme.colors.shadowSm};
  animation: ${floaty} 4s ease-in-out infinite;
  z-index: 2;

  .sym { color: #94a3b8; font-weight: 600; letter-spacing: 0.3px; }
  .price { color: #f1f5f9; font-weight: 700; font-variant-numeric: tabular-nums; }
  .chg { color: ${theme.colors.success}; font-weight: 600; }
`;

/* ============================================================
   ICONS
   ============================================================ */
const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C36.9 40 44 35 44 24c0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="m19 9-5 5-4-4-3 3"/>
  </svg>
);

/* ============================================================
   COMPONENT
   ============================================================ */
const SignUp = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.';
    if (!form.email.trim()) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Please create a password.';
    else if (form.password.length < 8)
      next.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword)
      next.confirmPassword = 'Passwords do not match.';
    if (!agreed) next.agreed = 'Please accept the Terms to continue.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    // TODO: wire up your real sign up request here
    // await fetch('/api/auth/signup', { ... })
    setTimeout(() => {
      setLoading(false);
      // e.g. navigate('/verify-email')
    }, 1500);
  };

  const handleSocial = (provider) => {
    // TODO: wire up OAuth
    // window.location.href = `/api/auth/${provider}`;
  };

  return (
    <>
      <GlobalStyle />
      <Page className="mtapp-signup">
        {/* ============ LEFT: SIGN UP ============ */}
        <FormSide>
          <FormInner>
            <Brand>
              <BrandMark>M</BrandMark>
              <BrandName>
                My<span>TradeApp</span>
              </BrandName>
            </Brand>

            <Heading>Create your account</Heading>
            <Subheading>
              Join thousands of traders. Start building your portfolio in minutes.
            </Subheading>

            <SocialRow>
              <SocialButton type="button" onClick={() => handleSocial('google')}>
                <GoogleIcon /> Google
              </SocialButton>
              <SocialButton type="button" onClick={() => handleSocial('apple')}>
                <AppleIcon /> Apple
              </SocialButton>
            </SocialRow>

            <Divider>or continue with email</Divider>

            <form onSubmit={handleSubmit} noValidate>
              <Field>
                <Label htmlFor="fullName">Full name</Label>
                <InputWrap>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={update('fullName')}
                    error={!!errors.fullName}
                  />
                </InputWrap>
                {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
              </Field>

              <Field>
                <Label htmlFor="email">Email address</Label>
                <InputWrap>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={update('email')}
                    error={!!errors.email}
                  />
                </InputWrap>
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </Field>

              <Field>
                <Label htmlFor="password">Password</Label>
                <InputWrap>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={update('password')}
                    error={!!errors.password}
                    hasToggle
                  />
                  <ToggleBtn
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </ToggleBtn>
                </InputWrap>
                {errors.password && <ErrorText>{errors.password}</ErrorText>}
              </Field>

              <Field>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <InputWrap>
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    error={!!errors.confirmPassword}
                    hasToggle
                  />
                  <ToggleBtn
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </ToggleBtn>
                </InputWrap>
                {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
              </Field>

              <Row>
                <CheckLabel>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) setErrors((p) => ({ ...p, agreed: '' }));
                    }}
                  />
                  <span>
                    I agree to the <a href="/terms">Terms</a> and{' '}
                    <a href="/privacy">Privacy Policy</a>.
                  </span>
                </CheckLabel>
              </Row>
              {errors.agreed && (
                <div style={{ marginTop: -12, marginBottom: 16 }}>
                  <ErrorText>{errors.agreed}</ErrorText>
                </div>
              )}

              <SubmitBtn type="submit" disabled={loading}>
                {loading && <Spinner />}
                {loading ? 'Creating account…' : 'Create account'}
              </SubmitBtn>
            </form>

            <BottomText>
              Already have an account?<a href="/signin">Sign in</a>
            </BottomText>
          </FormInner>
        </FormSide>

        {/* ============ RIGHT: AD PANEL ============ */}
        <AdSide>
          <AdContent>
            <AdBadge>
              <span className="dot" />
              Live markets · 0% commission on your first 30 days
            </AdBadge>

            <AdHeading>
              Trade smarter.<br />
              Grow <span>faster</span>.
            </AdHeading>

            <AdSub>
              Real-time data, pro-grade charting, and instant order execution —
              all in one beautifully simple platform built for serious traders.
            </AdSub>

            <FeatureList>
              <Feature>
                <FeatureIcon><BoltIcon /></FeatureIcon>
                <FeatureText>
                  <h4>Lightning-fast execution</h4>
                  <p>Sub-second order routing across global markets with zero slippage on liquid pairs.</p>
                </FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon><ChartIcon /></FeatureIcon>
                <FeatureText>
                  <h4>Pro charting & analytics</h4>
                  <p>50+ indicators, multi-timeframe overlays, and drawing tools used by professionals.</p>
                </FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon><ShieldIcon /></FeatureIcon>
                <FeatureText>
                  <h4>Bank-grade security</h4>
                  <p>256-bit encryption, 2FA, and segregated accounts — your capital stays protected.</p>
                </FeatureText>
              </Feature>
            </FeatureList>

            <StatsRow>
              <Stat>
                <div className="value">2.4M+</div>
                <div className="label">Active traders</div>
              </Stat>
              <Stat>
                <div className="value">$18B</div>
                <div className="label">Monthly volume</div>
              </Stat>
              <Stat>
                <div className="value">99.99%</div>
                <div className="label">Uptime SLA</div>
              </Stat>
            </StatsRow>
          </AdContent>

          <FloatingTicker>
            <span className="sym">BTC/USD</span>
            <span className="price">67,842.10</span>
            <span className="chg">+2.41%</span>
          </FloatingTicker>
        </AdSide>
      </Page>
    </>
  );
};

export default SignUp;