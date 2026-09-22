// src/pages/SignUp.jsx

import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

/* ============================================================
   THEME
   ============================================================ */
const theme = {
  colors: {
    bg: '#0a0d14',
    surface: '#161d2e',
    surfaceHover: '#1c2438',
    border: '#232c42',
    borderFocus: '#3b82f6',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    accent: '#3b82f6',
    accentSoft: 'rgba(59, 130, 246, 0.12)',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    shadowSm: '0 4px 14px -4px rgba(0, 0, 0, 0.4)',
    gradientAd: 'linear-gradient(135deg, #1e293b 0%, #0f172a 55%, #020617 100%)',
    gradientBtn: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
};

/* ============================================================
   GLOBAL RESET
   ============================================================ */
const GlobalStyle = createGlobalStyle`
  .mtapp-signup, .mtapp-signup * { box-sizing: border-box; }
  .mtapp-signup {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
      Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html:has(.mtapp-signup),
  body:has(.mtapp-signup) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    height: auto;
    min-height: 100%;
    background: ${theme.colors.bg};
  }

  .mtapp-signup .form-side,
  .mtapp-signup .form-side * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .mtapp-signup .form-side::-webkit-scrollbar,
  .mtapp-signup .form-side *::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
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

const spinAnim = keyframes`
  to { transform: rotate(360deg); }
`;

const modalPopIn = keyframes`
  0%   { opacity: 0; transform: translateY(16px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const checkPop = keyframes`
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const drawRing = keyframes`
  from { stroke-dashoffset: 200; }
  to   { stroke-dashoffset: 0; }
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
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    min-height: 100dvh;
    align-items: start;
  }
`;

const FormSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 96px 32px 40px;
  position: relative;
  overflow: visible;

  @media (max-width: 1024px) {
    padding: 96px 16px 40px;
    justify-content: flex-start;
    align-items: center;
  }

  @media (max-width: 480px) {
    padding: 92px 14px 32px;
  }
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 420px;
  animation: ${fadeUp} 0.5s ease both;

  @media (max-width: 1024px) {
    max-width: 440px;
  }
`;

/* ============================================================
   BRAND — absolutely positioned top-left of the form side
   ============================================================ */
const Brand = styled.div`
  position: absolute;
  top: 32px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 5;
  animation: ${fadeUp} 0.5s ease both;

  @media (max-width: 1024px) {
    top: 20px;
    left: 20px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    top: 16px;
    left: 16px;
    gap: 9px;
  }
`;

const BrandLogo = styled.div`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  filter: drop-shadow(0 8px 18px rgba(59, 130, 246, 0.35));

  svg { display: block; width: 100%; height: 100%; }

  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
  }
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.15;
`;

const BrandName = styled.span`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: ${theme.colors.text};

  span { color: ${theme.colors.accent}; }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const BrandTag = styled.span`
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
  margin-top: 1px;

  @media (max-width: 480px) {
    font-size: 9.5px;
  }
`;

/* ============================================================
   BRAND SVG LOGO
   ============================================================ */
const BrandLogoSvg = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="mtBrandBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="55%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="mtBrandLine" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
      </linearGradient>
    </defs>

    {/* rounded square backdrop */}
    <rect x="0" y="0" width="48" height="48" rx="13" fill="url(#mtBrandBg)" />

    {/* soft inner highlight */}
    <path
      d="M4 15 C4 8 8 4 15 4 L33 4 C40 4 44 8 44 15 L44 33 C44 40 40 44 33 44 L15 44 C8 44 4 40 4 33 Z"
      fill="none"
      stroke="#ffffff"
      strokeOpacity="0.08"
      strokeWidth="1"
    />

    {/* ascending chart line ending with an arrowhead */}
    <path
      d="M10 32 L16 23 L22 28 L33 14"
      stroke="url(#mtBrandLine)"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* arrowhead */}
    <path
      d="M27 14 L33 14 L33 20"
      stroke="#ffffff"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* start-point dot */}
    <circle cx="10" cy="32" r="2" fill="#ffffff" />
  </svg>
);

/* ============================================================
   HEADING + SWITCH LINK
   ============================================================ */
const Heading = styled.h1`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0 0 6px;
  color: ${theme.colors.text};

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const SwitchRow = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  margin: 0 0 22px;
  line-height: 1.5;

  button {
    background: none;
    border: none;
    padding: 0;
    margin-left: 4px;
    color: ${theme.colors.accent};
    font-weight: 600;
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;

    &:hover { text-decoration: underline; }
  }
`;

/* ============================================================
   FORM ELEMENTS
   ============================================================ */
const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  margin-bottom: 6px;
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
  font-size: 14.5px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder { color: ${theme.colors.textMuted}; font-size: 14px; }

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

  svg { width: 18px; height: 18px; }
  &:hover { color: ${theme.colors.textSecondary}; }
`;

const ErrorText = styled.span`
  display: block;
  font-size: 13px;
  color: ${theme.colors.danger};
  margin-top: 6px;
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  font-size: 13.5px;
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

const RowBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 6px 0 20px;
  font-size: 13.5px;
  flex-wrap: wrap;
`;

const ForgotLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${theme.colors.accent};
  font-weight: 600;
  font-size: 13.5px;
  font-family: inherit;
  cursor: pointer;

  &:hover { text-decoration: underline; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px 16px;
  background: ${theme.colors.gradientBtn};
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.1px;
  box-shadow: 0 8px 20px -10px rgba(59, 130, 246, 0.7);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 12px 26px -10px rgba(59, 130, 246, 0.85);
  }
  &:active:not(:disabled) { transform: translateY(0) scale(0.99); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const Spinner = styled.span`
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spinAnim} 0.7s linear infinite;
`;

/* ============================================================
   PASSWORD REQUIREMENTS
   ============================================================ */
const StrengthText = styled.div`
  font-size: 13px;
  margin-top: 6px;
  color: ${props => props.color || theme.colors.textMuted};
  font-weight: 600;
  transition: color 0.3s ease;
`;

const RequirementsList = styled.ul`
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 14px;

  li {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 500;
    transition: color 0.2s ease;

    .check {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      border-radius: 50%;
      border: 1.5px solid currentColor;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      svg {
        width: 9px;
        height: 9px;
        stroke: currentColor;
        stroke-width: 3;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
    }

    &.met {
      color: ${theme.colors.success};
      .check {
        background: ${theme.colors.success};
        border-color: ${theme.colors.success};
        svg { stroke: #fff; opacity: 1; }
      }
    }
    &.unmet {
      color: ${theme.colors.textMuted};
    }
  }
`;

/* ============================================================
   CAPTCHA
   ============================================================ */
const CaptchaRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  margin-bottom: 10px;
`;

const CaptchaFrame = styled.div`
  flex: 1;
  height: 64px;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background: #0f172a;

  svg { display: block; width: 100%; height: 100%; }
`;

const RefreshBtn = styled.button`
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  svg { width: 18px; height: 18px; transition: transform 0.4s ease; }

  &:hover {
    background: ${theme.colors.surfaceHover};
    color: ${theme.colors.text};
  }
  &:hover svg { transform: rotate(180deg); }
  &:active { transform: scale(0.96); }
`;

/* ============================================================
   MESSAGE
   ============================================================ */
const Message = styled.div`
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 9px;
  background: ${props =>
    props.kind === 'error'
      ? 'rgba(239, 68, 68, 0.08)'
      : props.kind === 'success'
      ? 'rgba(16, 185, 129, 0.08)'
      : 'rgba(245, 158, 11, 0.08)'};
  color: ${props =>
    props.kind === 'error'
      ? theme.colors.danger
      : props.kind === 'success'
      ? theme.colors.success
      : theme.colors.warning};
  border: 1px solid
    ${props =>
      props.kind === 'error'
        ? 'rgba(239, 68, 68, 0.25)'
        : props.kind === 'success'
        ? 'rgba(16, 185, 129, 0.25)'
        : 'rgba(245, 158, 11, 0.25)'};

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 2.4;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
`;

/* ============================================================
   AD PANEL
   ============================================================ */
const AdSide = styled.div`
  position: relative;
  background: ${theme.colors.gradientAd};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px;

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
`;

const Stat = styled.div`
  .value {
    font-size: 22px;
    font-weight: 700;
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
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 12px;
  font-size: 12.5px;
  box-shadow: ${theme.colors.shadowSm};
  animation: ${floaty} 4s ease-in-out infinite;
  z-index: 2;

  .sym { color: #94a3b8; font-weight: 600; }
  .price { color: #f1f5f9; font-weight: 700; }
  .chg { color: ${theme.colors.success}; font-weight: 600; }
`;

/* ============================================================
   MODAL PRIMITIVES
   ============================================================ */
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: 14px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: #0d1421;
  border: 1px solid ${theme.colors.border};
  border-radius: 18px;
  padding: 28px 26px 24px;
  position: relative;
  box-shadow:
    0 24px 70px -12px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(59, 130, 246, 0.08);
  animation: ${modalPopIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (max-width: 480px) {
    padding: 22px 18px 18px;
    border-radius: 16px;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${theme.colors.text};
  }

  svg { width: 18px; height: 18px; }
`;

const ModalIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: ${props => props.bg || theme.colors.accentSoft};
  border: 1px solid ${props => props.border || 'rgba(59, 130, 246, 0.25)'};
  color: ${props => props.color || '#60a5fa'};

  svg { width: 24px; height: 24px; }
`;

const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
  text-align: center;
  margin: 0 0 8px;
  color: ${theme.colors.text};
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  color: ${theme.colors.textSecondary};
  margin: 0 0 22px;

  strong {
    color: ${theme.colors.text};
    font-weight: 600;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 14px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const SecondaryBtn = styled.button`
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  color: ${theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  font-family: inherit;

  &:hover {
    background: ${theme.colors.surfaceHover};
    color: ${theme.colors.text};
    border-color: #334155;
  }
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${theme.colors.accent};
  font-weight: 600;
  font-size: 13.5px;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover { text-decoration: underline; }
  &:disabled { opacity: 0.55; cursor: not-allowed; text-decoration: none; }
`;

/* ============================================================
   OTP INPUT
   ============================================================ */
const OtpRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin: 6px 0 16px;
`;

const OtpBox = styled.input`
  width: 100%;
  aspect-ratio: 1 / 1.15;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border: 1.5px solid ${props => (props.error ? theme.colors.danger : theme.colors.border)};
  border-radius: 10px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  padding: 0;
  caret-color: ${theme.colors.accent};

  &:focus {
    border-color: ${props => (props.error ? theme.colors.danger : theme.colors.accent)};
    background: ${theme.colors.surfaceHover};
    box-shadow: 0 0 0 3px
      ${props => (props.error ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.18)')};
  }

  &:disabled { opacity: 0.6; }
`;

const ResendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13.5px;
  color: ${theme.colors.textMuted};
  margin-top: 4px;
`;

/* ============================================================
   SUCCESS STATE
   ============================================================ */
const SuccessWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4px 0 2px;
`;

const SuccessCircle = styled.div`
  width: 70px;
  height: 70px;
  position: relative;
  margin-bottom: 16px;

  svg { width: 100%; height: 100%; }

  circle {
    stroke: ${theme.colors.success};
    stroke-width: 3;
    fill: none;
    stroke-dasharray: 200;
    animation: ${drawRing} 0.7s ease-out forwards;
  }

  path {
    stroke: ${theme.colors.success};
    stroke-width: 3.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: ${checkPop} 0.5s ease-out 0.4s forwards;
  }
`;

/* ============================================================
   SVG ICONS
   ============================================================ */
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-3.1-6.8"/>
    <polyline points="21 3 21 9 15 9"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="13"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const XCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 6-10 7L2 6"/>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="4.5"/>
    <path d="m21 2-9.6 9.6"/>
    <path d="m15.5 7.5 3 3L22 7l-3-3"/>
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="m19 9-5 5-4-4-3 3"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ============================================================
   CAPTCHA HELPERS
   ============================================================ */
const randomHsl = (s, l) => `hsl(${Math.floor(Math.random() * 360)}, ${s}%, ${l}%)`;

const buildCaptcha = () => {
  const code = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');

  const seed = Math.floor(Math.random() * 10000);

  const chars = code.split('').map((ch, i) => ({
    ch,
    x: 22 + i * 27,
    y: 36 + (Math.random() - 0.5) * 6,
    rotate: (Math.random() - 0.5) * 34,
    fontSize: 24 + Math.random() * 8,
    color: randomHsl(65, 62),
    fontWeight: 600 + Math.floor(Math.random() * 3) * 100,
  }));

  const lines = Array.from({ length: 4 }, () => ({
    x1: Math.random() * 200,
    y1: Math.random() * 66,
    x2: Math.random() * 200,
    y2: Math.random() * 66,
    color: randomHsl(60, 60),
  }));

  const dots = Array.from({ length: 36 }, () => ({
    cx: Math.random() * 200,
    cy: Math.random() * 66,
    r: 0.5 + Math.random() * 1.6,
    color: randomHsl(55, 62),
  }));

  return { code, seed, chars, lines, dots };
};

const CaptchaSvg = ({ captcha }) => {
  if (!captcha) return null;
  const { seed, chars, lines, dots } = captcha;

  return (
    <svg viewBox="0 0 200 66" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`captchaBg-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1224" />
          <stop offset="100%" stopColor="#172033" />
        </linearGradient>
        <filter id={`captchaWarp-${seed}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.02 0.05"
            numOctaves="2"
            seed={seed % 100}
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <rect width="200" height="66" fill={`url(#captchaBg-${seed})`} />
      {dots.map((d, i) => (
        <circle key={`dot-${i}`} cx={d.cx} cy={d.cy} r={d.r} fill={d.color} opacity="0.55" />
      ))}
      {lines.map((l, i) => (
        <line key={`line-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={l.color} strokeWidth="1.4" opacity="0.55" />
      ))}
      <g filter={`url(#captchaWarp-${seed})`}>
        {chars.map((c, i) => (
          <text key={`ch-${i}`} x={c.x} y={c.y}
            fontSize={c.fontSize} fontWeight={c.fontWeight} fill={c.color}
            fontFamily="'Courier New', 'Lucida Console', monospace"
            transform={`rotate(${c.rotate} ${c.x} ${c.y})`}
            style={{ userSelect: 'none', pointerEvents: 'none' }}>
            {c.ch}
          </text>
        ))}
      </g>
    </svg>
  );
};

/* ============================================================
   OTP INPUT COMPONENT
   ============================================================ */
const OtpInput = ({ length = 6, value, onChange, error, disabled, autoFocus }) => {
  const inputsRef = useRef([]);

  const focusIndex = (i) => {
    const el = inputsRef.current[i];
    if (el) el.focus();
  };

  useEffect(() => {
    if (autoFocus) focusIndex(0);
  }, [autoFocus]);

  const handleChange = (i, raw) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      const next = value.split('');
      next[i] = '';
      onChange(next.join(''));
      return;
    }
    const next = value.split('');
    for (let k = 0; k < digits.length && i + k < length; k++) {
      next[i + k] = digits[k];
    }
    onChange(next.join('').slice(0, length));
    focusIndex(Math.min(i + digits.length, length - 1));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      const next = value.split('');
      next[i - 1] = '';
      onChange(next.join(''));
      focusIndex(i - 1);
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' && i > 0) focusIndex(i - 1);
    if (e.key === 'ArrowRight' && i < length - 1) focusIndex(i + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (!text) return;
    onChange(text.padEnd(length, '').slice(0, length));
    focusIndex(Math.min(text.length, length - 1));
  };

  return (
    <OtpRow>
      {Array.from({ length }).map((_, i) => (
        <OtpBox
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={length}
          value={value[i] || ''}
          disabled={disabled}
          error={error}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </OtpRow>
  );
};

/* ============================================================
   MODAL 1 — EMAIL VERIFICATION
   ============================================================ */
const EmailVerificationModal = ({ open, email, onClose, onVerified }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendNote, setResendNote] = useState('');

  useEffect(() => {
    if (open) {
      setCode('');
      setError('');
      setVerifying(false);
      setVerified(false);
      setResendIn(30);
      setResendNote('');
    }
  }, [open]);

  useEffect(() => {
    if (!open || resendIn <= 0) return undefined;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [open, resendIn]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleVerify = (e) => {
    e?.preventDefault();
    if (code.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    setError('');
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      if (onVerified) onVerified();
    }, 1200);
  };

  const handleResend = () => {
    if (resendIn > 0 || resending) return;
    setResending(true);
    setResendNote('');
    setTimeout(() => {
      setResending(false);
      setResendIn(30);
      setResendNote('A new code has been sent to your email.');
    }, 900);
  };

  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label="Close">
          <CloseIcon />
        </ModalClose>

        {verified ? (
          <SuccessWrap>
            <SuccessCircle>
              <svg viewBox="0 0 62 62">
                <circle cx="31" cy="31" r="28" />
                <path d="M20 32 l7 7 l15 -15" />
              </svg>
            </SuccessCircle>
            <ModalTitle>Email verified</ModalTitle>
            <ModalSubtitle style={{ marginBottom: 8 }}>
              Your account is now active. You can start using MyTradeApp.
            </ModalSubtitle>
            <ModalActions style={{ width: '100%' }}>
              <SubmitBtn type="button" onClick={onClose}>
                Continue to dashboard
              </SubmitBtn>
            </ModalActions>
          </SuccessWrap>
        ) : (
          <form onSubmit={handleVerify}>
            <ModalIcon>
              <MailIcon />
            </ModalIcon>

            <ModalTitle>Verify your email</ModalTitle>
            <ModalSubtitle>
              We sent a 6-digit code to <strong>{email || 'your email'}</strong>.
              <br />Enter it below to activate your account.
            </ModalSubtitle>

            <ModalBody>
              <OtpInput
                value={code}
                onChange={(v) => {
                  setCode(v);
                  if (error) setError('');
                }}
                error={!!error}
                disabled={verifying}
                autoFocus
              />
              {error && (
                <ErrorText style={{ textAlign: 'center', marginTop: 2 }}>
                  {error}
                </ErrorText>
              )}

              <ResendRow style={{ marginTop: 12 }}>
                <span>Didn&apos;t get the code?</span>
                {resendIn > 0 ? (
                  <span style={{ color: theme.colors.textMuted }}>
                    Resend in {resendIn}s
                  </span>
                ) : (
                  <LinkButton
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                  >
                    {resending ? 'Sending…' : 'Resend code'}
                  </LinkButton>
                )}
              </ResendRow>

              {resendNote && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: theme.colors.success,
                    textAlign: 'center',
                  }}
                >
                  {resendNote}
                </div>
              )}
            </ModalBody>

            <SubmitBtn type="submit" disabled={verifying || code.length !== 6}>
              {verifying && <Spinner />}
              {verifying ? 'Verifying…' : 'Verify email'}
            </SubmitBtn>
          </form>
        )}
      </ModalCard>
    </ModalBackdrop>
  );
};

/* ============================================================
   MODAL 2 — FORGOT PASSWORD
   ============================================================ */
const ForgotPasswordModal = ({ open, onClose, onCodeSent }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail('');
      setError('');
      setSending(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setSending(true);

    setTimeout(() => {
      setSending(false);
      if (onCodeSent) onCodeSent(trimmed);
    }, 1200);
  };

  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label="Close">
          <CloseIcon />
        </ModalClose>

        <form onSubmit={handleSubmit}>
          <ModalIcon
            bg="rgba(245, 158, 11, 0.12)"
            border="rgba(245, 158, 11, 0.28)"
            color={theme.colors.warning}
          >
            <KeyIcon />
          </ModalIcon>

          <ModalTitle>Forgot your password?</ModalTitle>
          <ModalSubtitle>
            Enter the email tied to your MyTradeApp account and we&apos;ll
            send you a secure reset code.
          </ModalSubtitle>

          <ModalBody>
            <Field>
              <Label htmlFor="forgotEmail">Email address</Label>
              <InputWrap>
                <Input
                  id="forgotEmail"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  error={!!error}
                  autoFocus
                />
              </InputWrap>
              {error && <ErrorText>{error}</ErrorText>}
            </Field>
          </ModalBody>

          <SubmitBtn type="submit" disabled={sending}>
            {sending && <Spinner />}
            {sending ? 'Sending reset code…' : 'Send reset code'}
          </SubmitBtn>

          <ModalActions>
            <SecondaryBtn type="button" onClick={onClose}>
              Cancel
            </SecondaryBtn>
          </ModalActions>
        </form>
      </ModalCard>
    </ModalBackdrop>
  );
};

/* ============================================================
   MODAL 3 — RESET PASSWORD
   ============================================================ */
const ResetPasswordModal = ({ open, email, onClose, onResetDone, onBack }) => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);
  const [resending, setResending] = useState(false);
  const [resendNote, setResendNote] = useState('');

  useEffect(() => {
    if (open) {
      setCode('');
      setPassword('');
      setConfirm('');
      setShowPw(false);
      setShowCf(false);
      setErrors({});
      setLoading(false);
      setResendIn(30);
      setResendNote('');
    }
  }, [open]);

  useEffect(() => {
    if (!open || resendIn <= 0) return undefined;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [open, resendIn]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const pwChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const strength = (() => {
    if (!password) return { color: theme.colors.textMuted, label: 'Enter a strong password' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const colorMap = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#22c55e', '#2dd4bf'];
    const textMap = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
    return { color: colorMap[score], label: textMap[score] };
  })();

  const handleReset = (e) => {
    e.preventDefault();
    const next = {};
    if (code.length !== 6) next.code = 'Enter the 6-digit code.';
    if (!pwChecks.length) next.password = 'Password must be at least 8 characters.';
    else if (!pwChecks.upper && !pwChecks.number && !pwChecks.symbol)
      next.password = 'Include uppercase letters, numbers, or symbols.';
    if (password !== confirm) next.confirm = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (onResetDone) onResetDone();
    }, 1400);
  };

  const handleResend = () => {
    if (resendIn > 0 || resending) return;
    setResending(true);
    setResendNote('');
    setTimeout(() => {
      setResending(false);
      setResendIn(30);
      setResendNote('A new code has been sent.');
    }, 900);
  };

  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label="Close">
          <CloseIcon />
        </ModalClose>

        <form onSubmit={handleReset}>
          <ModalIcon>
            <ShieldCheckIcon />
          </ModalIcon>

          <ModalTitle>Reset your password</ModalTitle>
          <ModalSubtitle>
            Enter the 6-digit code sent to <strong>{email || 'your email'}</strong>{' '}
            and choose a new password.
          </ModalSubtitle>

          <ModalBody>
            <OtpInput
              value={code}
              onChange={(v) => {
                setCode(v);
                if (errors.code) setErrors((p) => ({ ...p, code: '' }));
              }}
              error={!!errors.code}
              disabled={loading}
              autoFocus
            />
            {errors.code && (
              <ErrorText style={{ textAlign: 'center', marginTop: 2 }}>
                {errors.code}
              </ErrorText>
            )}

            <ResendRow style={{ marginTop: 12, marginBottom: 16 }}>
              <span>Didn&apos;t get the code?</span>
              {resendIn > 0 ? (
                <span style={{ color: theme.colors.textMuted }}>
                  Resend in {resendIn}s
                </span>
              ) : (
                <LinkButton
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? 'Sending…' : 'Resend code'}
                </LinkButton>
              )}
            </ResendRow>
            {resendNote && (
              <div
                style={{
                  marginTop: -8,
                  marginBottom: 12,
                  fontSize: 13,
                  color: theme.colors.success,
                  textAlign: 'center',
                }}
              >
                {resendNote}
              </div>
            )}

            <Field>
              <Label htmlFor="resetPassword">New password</Label>
              <InputWrap>
                <Input
                  id="resetPassword"
                  type={showPw ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                  }}
                  error={!!errors.password}
                  hasToggle
                />
                <ToggleBtn
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </ToggleBtn>
              </InputWrap>
              <StrengthText color={strength.color}>{strength.label}</StrengthText>
              <RequirementsList>
                <li className={pwChecks.length ? 'met' : 'unmet'}>
                  <span className="check"><CheckIcon /></span>
                  8+ characters
                </li>
                <li className={pwChecks.upper ? 'met' : 'unmet'}>
                  <span className="check"><CheckIcon /></span>
                  Uppercase
                </li>
                <li className={pwChecks.number ? 'met' : 'unmet'}>
                  <span className="check"><CheckIcon /></span>
                  Number
                </li>
                <li className={pwChecks.symbol ? 'met' : 'unmet'}>
                  <span className="check"><CheckIcon /></span>
                  Symbol
                </li>
              </RequirementsList>
              {errors.password && (
                <ErrorText style={{ marginTop: 8 }}>{errors.password}</ErrorText>
              )}
            </Field>

            <Field>
              <Label htmlFor="resetConfirm">Confirm new password</Label>
              <InputWrap>
                <Input
                  id="resetConfirm"
                  type={showCf ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (errors.confirm) setErrors((p) => ({ ...p, confirm: '' }));
                  }}
                  error={!!errors.confirm}
                  hasToggle
                />
                <ToggleBtn
                  type="button"
                  onClick={() => setShowCf((v) => !v)}
                  aria-label={showCf ? 'Hide password' : 'Show password'}
                >
                  {showCf ? <EyeOffIcon /> : <EyeIcon />}
                </ToggleBtn>
              </InputWrap>
              {errors.confirm && <ErrorText>{errors.confirm}</ErrorText>}
            </Field>
          </ModalBody>

          <SubmitBtn type="submit" disabled={loading}>
            {loading && <Spinner />}
            {loading ? 'Resetting…' : 'Reset password'}
          </SubmitBtn>

          <ModalActions>
            <SecondaryBtn type="button" onClick={onBack}>
              Back
            </SecondaryBtn>
          </ModalActions>
        </form>
      </ModalCard>
    </ModalBackdrop>
  );
};

/* ============================================================
   MESSAGE ICON PICKER
   ============================================================ */
const MessageIcon = ({ kind }) => {
  if (kind === 'error') return <XCircleIcon />;
  if (kind === 'success') return <CheckIcon />;
  return <AlertIcon />;
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const SignUp = () => {
  const [mode, setMode] = useState('signup');

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const [captcha, setCaptcha] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageKind, setMessageKind] = useState('info');

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    setCaptcha(buildCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(buildCaptcha());
    setCaptchaInput('');
    setCaptchaError('');
  };

  const clearMessage = () => {
    setMessage('');
    setMessageKind('info');
  };

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setSignupErrors({});
    setLoginErrors({});
    setCaptchaError('');
    setShowPassword(false);
    setShowConfirm(false);
    clearMessage();
    if (newMode === 'signup') refreshCaptcha();
  };

  const updateSignup = (key) => (e) => {
    setSignupForm((f) => ({ ...f, [key]: e.target.value }));
    if (signupErrors[key]) setSignupErrors((prev) => ({ ...prev, [key]: '' }));
    clearMessage();
  };

  const updateLogin = (key) => (e) => {
    setLoginForm((f) => ({ ...f, [key]: e.target.value }));
    if (loginErrors[key]) setLoginErrors((prev) => ({ ...prev, [key]: '' }));
    clearMessage();
  };

  const passwordChecks = {
    length: signupForm.password.length >= 8,
    upper: /[A-Z]/.test(signupForm.password),
    number: /[0-9]/.test(signupForm.password),
    symbol: /[^A-Za-z0-9]/.test(signupForm.password),
  };

  const passwordStrength = (() => {
    const pw = signupForm.password;
    if (!pw) return { color: theme.colors.textMuted, label: 'Enter a strong password' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const colorMap = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#22c55e', '#2dd4bf'];
    const textMap = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
    return { color: colorMap[score], label: textMap[score] };
  })();

  const validateSignup = () => {
    const next = {};
    const { fullName, email, password, confirmPassword } = signupForm;

    if (!fullName.trim()) next.fullName = 'Please enter your full name.';
    else if (fullName.trim().length < 2) next.fullName = 'Name must be at least 2 characters.';

    if (!email.trim()) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = 'Enter a valid email address.';

    if (!password) next.password = 'Please create a password.';
    else if (!passwordChecks.length) next.password = 'Password must be at least 8 characters.';
    else if (!passwordChecks.upper && !passwordChecks.number && !passwordChecks.symbol)
      next.password = 'Include uppercase letters, numbers, or symbols.';

    if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.';

    if (!agreed) next.agreed = 'Please accept the Terms to continue.';

    if (!captchaInput.trim()) setCaptchaError('Enter the code shown above.');
    else if (captchaInput.trim() !== captcha?.code)
      setCaptchaError('Incorrect code. Please try again.');
    else setCaptchaError('');

    return { next, captchaOk: captchaInput.trim() === captcha?.code };
  };

  const validateLogin = () => {
    const next = {};
    if (!loginForm.email.trim()) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email.trim()))
      next.email = 'Enter a valid email address.';
    if (!loginForm.password) next.password = 'Please enter your password.';
    return next;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { next, captchaOk } = validateSignup();
    setSignupErrors(next);

    if (Object.keys(next).length || !captchaOk) {
      if (!captchaOk && captchaInput.trim()) refreshCaptcha();
      return;
    }

    setLoading(true);
    setMessage('Creating your account…');
    setMessageKind('info');

    setTimeout(() => {
      setLoading(false);
      clearMessage();

      setVerifyEmail(signupForm.email.trim());
      setVerifyModalOpen(true);

      refreshCaptcha();
      setSignupForm({ fullName: '', email: '', password: '', confirmPassword: '' });
      setAgreed(false);
    }, 1500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const next = validateLogin();
    setLoginErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setMessage('Signing you in…');
    setMessageKind('info');

    setTimeout(() => {
      setLoading(false);
      setMessage('Signed in successfully.');
      setMessageKind('success');
    }, 1500);
  };

  const handleVerified = () => {};

  const handleForgotCodeSent = (email) => {
    setForgotModalOpen(false);
    setResetEmail(email);
    setResetModalOpen(true);
  };

  const handleResetDone = () => {
    setResetModalOpen(false);
    setMessage('Password updated. You can now log in with your new password.');
    setMessageKind('success');
    setMode('login');
    setLoginForm({ email: resetEmail, password: '' });
  };

  return (
    <>
      <GlobalStyle />
      <Page className="mtapp-signup">
        <FormSide className="form-side">
          {/* Brand — fixed at top-left of the form side */}
          <Brand>
            <BrandLogo>
              <BrandLogoSvg />
            </BrandLogo>
            <BrandText>
              <BrandName>
                My<span>TradeApp</span>
              </BrandName>
              <BrandTag>Markets · Simplified</BrandTag>
            </BrandText>
          </Brand>

          <FormInner>
            {mode === 'signup' ? (
              <>
                <Heading>Sign up</Heading>
                <SwitchRow>
                  Already have an account?
                  <button type="button" onClick={() => switchMode('login')}>
                    Log in
                  </button>
                </SwitchRow>
              </>
            ) : (
              <>
                <Heading>Log in</Heading>
                <SwitchRow>
                  Don&apos;t have an account?
                  <button type="button" onClick={() => switchMode('signup')}>
                    Sign up
                  </button>
                </SwitchRow>
              </>
            )}

            {mode === 'signup' && (
              <form onSubmit={handleSignup} noValidate>
                <Field>
                  <Label htmlFor="fullName">Full name</Label>
                  <InputWrap>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      value={signupForm.fullName}
                      onChange={updateSignup('fullName')}
                      error={!!signupErrors.fullName}
                    />
                  </InputWrap>
                  {signupErrors.fullName && <ErrorText>{signupErrors.fullName}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="signupEmail">Email address</Label>
                  <InputWrap>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={signupForm.email}
                      onChange={updateSignup('email')}
                      error={!!signupErrors.email}
                    />
                  </InputWrap>
                  {signupErrors.email && <ErrorText>{signupErrors.email}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="signupPassword">Password</Label>
                  <InputWrap>
                    <Input
                      id="signupPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      value={signupForm.password}
                      onChange={updateSignup('password')}
                      error={!!signupErrors.password}
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

                  <StrengthText color={passwordStrength.color}>
                    {passwordStrength.label}
                  </StrengthText>

                  <RequirementsList>
                    <li className={passwordChecks.length ? 'met' : 'unmet'}>
                      <span className="check"><CheckIcon /></span>
                      8+ characters
                    </li>
                    <li className={passwordChecks.upper ? 'met' : 'unmet'}>
                      <span className="check"><CheckIcon /></span>
                      Uppercase letter
                    </li>
                    <li className={passwordChecks.number ? 'met' : 'unmet'}>
                      <span className="check"><CheckIcon /></span>
                      Number
                    </li>
                    <li className={passwordChecks.symbol ? 'met' : 'unmet'}>
                      <span className="check"><CheckIcon /></span>
                      Symbol
                    </li>
                  </RequirementsList>

                  {signupErrors.password && (
                    <ErrorText style={{ marginTop: 8 }}>{signupErrors.password}</ErrorText>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <InputWrap>
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      value={signupForm.confirmPassword}
                      onChange={updateSignup('confirmPassword')}
                      error={!!signupErrors.confirmPassword}
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
                  {signupErrors.confirmPassword && (
                    <ErrorText>{signupErrors.confirmPassword}</ErrorText>
                  )}
                </Field>

                <Field>
                  <Label>Security check</Label>
                  <CaptchaRow>
                    <CaptchaFrame aria-label="CAPTCHA: enter the numbers you see">
                      <CaptchaSvg captcha={captcha} />
                    </CaptchaFrame>
                    <RefreshBtn
                      type="button"
                      onClick={refreshCaptcha}
                      aria-label="Refresh security code"
                      title="Get a new code"
                    >
                      <RefreshIcon />
                    </RefreshBtn>
                  </CaptchaRow>
                  <InputWrap>
                    <Input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={6}
                      placeholder="Enter the 6 numbers above"
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value.replace(/\D/g, ''));
                        if (captchaError) setCaptchaError('');
                      }}
                      error={!!captchaError}
                    />
                  </InputWrap>
                  {captchaError && <ErrorText>{captchaError}</ErrorText>}
                </Field>

                <RowBetween>
                  <CheckLabel>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => {
                        setAgreed(e.target.checked);
                        if (signupErrors.agreed)
                          setSignupErrors((p) => ({ ...p, agreed: '' }));
                      }}
                    />
                    <span>
                      I agree to the <a href="/terms">Terms</a> and{' '}
                      <a href="/privacy">Privacy Policy</a>.
                    </span>
                  </CheckLabel>
                </RowBetween>
                {signupErrors.agreed && (
                  <div style={{ marginTop: -10, marginBottom: 14 }}>
                    <ErrorText>{signupErrors.agreed}</ErrorText>
                  </div>
                )}

                <SubmitBtn type="submit" disabled={loading}>
                  {loading && <Spinner />}
                  {loading ? 'Creating account…' : 'Create account'}
                </SubmitBtn>
              </form>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} noValidate>
                <Field>
                  <Label htmlFor="loginEmail">Email address</Label>
                  <InputWrap>
                    <Input
                      id="loginEmail"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={loginForm.email}
                      onChange={updateLogin('email')}
                      error={!!loginErrors.email}
                    />
                  </InputWrap>
                  {loginErrors.email && <ErrorText>{loginErrors.email}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="loginPassword">Password</Label>
                  <InputWrap>
                    <Input
                      id="loginPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      autoComplete="current-password"
                      value={loginForm.password}
                      onChange={updateLogin('password')}
                      error={!!loginErrors.password}
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
                  {loginErrors.password && <ErrorText>{loginErrors.password}</ErrorText>}
                </Field>

                <RowBetween>
                  <CheckLabel>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Keep me signed in</span>
                  </CheckLabel>
                  <ForgotLink
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                  >
                    Forgot password?
                  </ForgotLink>
                </RowBetween>

                <SubmitBtn type="submit" disabled={loading}>
                  {loading && <Spinner />}
                  {loading ? 'Signing in…' : 'Log in'}
                </SubmitBtn>
              </form>
            )}

            {message && (
              <Message kind={messageKind}>
                <span className="icon">
                  <MessageIcon kind={messageKind} />
                </span>
                {message}
              </Message>
            )}
          </FormInner>
        </FormSide>

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

      <EmailVerificationModal
        open={verifyModalOpen}
        email={verifyEmail}
        onClose={() => setVerifyModalOpen(false)}
        onVerified={handleVerified}
      />

      <ForgotPasswordModal
        open={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        onCodeSent={handleForgotCodeSent}
      />

      <ResetPasswordModal
        open={resetModalOpen}
        email={resetEmail}
        onClose={() => setResetModalOpen(false)}
        onResetDone={handleResetDone}
        onBack={() => {
          setResetModalOpen(false);
          setForgotModalOpen(true);
        }}
      />
    </>
  );
};

export default SignUp;