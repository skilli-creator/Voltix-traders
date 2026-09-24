// src/pages/SignUp.jsx — Gold theme + M-with-crossline logo + shuffled 32-image slideshow + marketing panel

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

/* ============================================================
   SLIDESHOW IMAGES — src/assets/images/
   ============================================================ */
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import image3 from '../assets/images/image3.png';
import image4 from '../assets/images/image4.png';
import image5 from '../assets/images/image5.png';
import image6 from '../assets/images/image6.png';
import image7 from '../assets/images/image7.png';
import image8 from '../assets/images/image8.png';
import image9 from '../assets/images/image9.png';
import image10 from '../assets/images/image10.png';
import image11 from '../assets/images/image11.png';
import image12 from '../assets/images/image12.png';


const SLIDES = [
  { src: image1,  alt: 'MyTradeApp trading platform' },
  { src: image2,  alt: 'MyTradeApp live markets' },
  { src: image3,  alt: 'MyTradeApp analytics' },
  { src: image4,  alt: 'MyTradeApp portfolio' },
  { src: image5,  alt: 'MyTradeApp automation' },
  { src: image6,  alt: 'MyTradeApp order flow' },
  { src: image7,  alt: 'MyTradeApp watchlist' },
  { src: image8,  alt: 'MyTradeApp signals' },
  { src: image9,  alt: 'MyTradeApp risk tools' },
  { src: image10, alt: 'MyTradeApp mobile app' },
  { src: image11, alt: 'MyTradeApp community' },
  { src: image12, alt: 'MyTradeApp charting' },
  
];

const SLIDE_INTERVAL_MS = 5000;

/* Fisher–Yates shuffle — returns a new array in random order. */
const buildShuffledOrder = (len) => {
  const arr = Array.from({ length: len }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/* ============================================================
   API CONFIG
   ============================================================ */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ENDPOINTS = {
  signup:          `${API_BASE_URL}/auth/signup`,
  login:           `${API_BASE_URL}/auth/login`,
  verifyEmail:     `${API_BASE_URL}/auth/verify`,
  resendCode:      `${API_BASE_URL}/auth/resend-code`,
  forgotPassword:  `${API_BASE_URL}/auth/forgot-password`,
  verifyResetCode: `${API_BASE_URL}/auth/verify-reset-code`,
  resetPassword:   `${API_BASE_URL}/auth/reset-password`,
};

/* ============================================================
   THEME — DARK GOLD
   ============================================================ */
const theme = {
  colors: {
    bg: '#0c0a06',
    surface: '#1a150d',
    surfaceHover: '#241d12',
    border: '#332a1b',
    borderFocus: '#d4af37',
    text: '#faf6ec',
    textSecondary: '#b3a486',
    textMuted: '#7c7057',

    accent: '#d4af37',
    accentSoft: 'rgba(212, 175, 55, 0.12)',
    accentLine: 'rgba(212, 175, 55, 0.28)',
    goldLight: '#f7e08a',
    onGold: '#1a1408',

    success: '#10b981',
    successSoft: 'rgba(16, 185, 129, 0.1)',
    warning: '#f59e0b',
    warningSoft: 'rgba(245, 158, 11, 0.1)',
    danger: '#ef4444',
    dangerSoft: 'rgba(239, 68, 68, 0.1)',

    shadowSm: '0 4px 14px -4px rgba(0, 0, 0, 0.5)',
    shadowMd: '0 12px 32px -12px rgba(0, 0, 0, 0.6)',
    shadowLg: '0 24px 60px -20px rgba(0, 0, 0, 0.8)',

    gradientAd: 'linear-gradient(135deg, #241b0d 0%, #140f07 55%, #050402 100%)',
    gradientBtn: 'linear-gradient(135deg, #f7e08a 0%, #d4af37 48%, #a97b12 100%)',
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
    color: ${theme.colors.text};
  }

  html:has(.mtapp-signup),
  body:has(.mtapp-signup) {
    margin: 0;
    padding: 0;
    background: ${theme.colors.bg};
  }

  @media (min-width: 1025px) {
    html:has(.mtapp-signup),
    body:has(.mtapp-signup) {
      height: 100vh;
      overflow: hidden;
    }
  }

  @media (max-width: 1024px) {
    html:has(.mtapp-signup),
    body:has(.mtapp-signup) {
      height: auto;
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  /* Hide scrollbars on both panels */
  .mtapp-signup .form-side,
  .mtapp-signup .form-side *,
  .mtapp-signup .ad-side,
  .mtapp-signup .ad-side * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .mtapp-signup .form-side::-webkit-scrollbar,
  .mtapp-signup .form-side *::-webkit-scrollbar,
  .mtapp-signup .ad-side::-webkit-scrollbar,
  .mtapp-signup .ad-side *::-webkit-scrollbar {
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
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  background: ${theme.colors.bg};
  color: ${theme.colors.text};
  align-items: stretch;

  @media (max-width: 1024px) {
    height: auto;
    min-height: 100dvh;
    overflow: visible;
    grid-template-columns: 1fr;
    align-items: start;
  }
`;

const FormSide = styled.div`
  position: relative;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 96px 32px 64px;
  background: ${theme.colors.bg};

  @media (max-width: 1024px) {
    height: auto;
    min-height: 100dvh;
    overflow: visible;
    padding: 96px 16px 40px;
  }

  @media (max-width: 480px) {
    padding: 92px 14px 32px;
  }
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 420px;
  margin: auto 0;
  animation: ${fadeUp} 0.5s ease both;

  @media (max-width: 1024px) {
    max-width: 440px;
    margin: 0 auto;
  }
`;

/* ============================================================
   BRAND
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

  @media (max-width: 1024px) { top: 20px; left: 20px; gap: 10px; }
  @media (max-width: 480px) { top: 16px; left: 16px; gap: 9px; }
`;

const BrandLogo = styled.div`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  filter: drop-shadow(0 8px 18px rgba(212, 175, 55, 0.45));

  svg { display: block; width: 100%; height: 100%; }
  @media (max-width: 480px) { width: 38px; height: 38px; }
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
  @media (max-width: 480px) { font-size: 18px; }
`;

const BrandTag = styled.span`
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
  margin-top: 1px;
  @media (max-width: 480px) { font-size: 9.5px; }
`;

/* ============================================================
   BRAND SVG LOGO — letter "M" with a crossline
   ============================================================ */
const BrandLogoSvg = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="mtBrandGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbeaa4" />
        <stop offset="42%" stopColor="#e6c356" />
        <stop offset="78%" stopColor="#c99a24" />
        <stop offset="100%" stopColor="#96690c" />
      </linearGradient>
      <linearGradient id="mtBrandCross" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f7e08a" />
        <stop offset="100%" stopColor="#c99a24" />
      </linearGradient>
    </defs>

    {/* The letter M */}
    <path
      d="M14 36 V12 L24 26 L34 12 V36"
      fill="none"
      stroke="url(#mtBrandGold)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Crossline — dynamic diagonal slash through the M */}
    <line
      x1="8" y1="38"
      x2="40" y2="10"
      stroke="url(#mtBrandCross)"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.9"
    />
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
  @media (max-width: 480px) { font-size: 24px; }
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
const Field = styled.div`margin-bottom: 16px;`;

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
      ${props => (props.error ? 'rgba(239, 68, 68, 0.18)' : 'rgba(212, 175, 55, 0.18)')};
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

  input:checked { background: ${theme.colors.accent}; border-color: ${theme.colors.accent}; }

  input:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1.5px;
    width: 4px;
    height: 9px;
    border: solid ${theme.colors.onGold};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  a,
  button {
    color: ${theme.colors.accent};
    text-decoration: none;
    font-weight: 600;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    cursor: pointer;
    display: inline;
  }
  a:hover,
  button:hover { text-decoration: underline; }
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
  color: ${theme.colors.onGold};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.1px;
  box-shadow: 0 8px 22px -10px rgba(212, 175, 55, 0.75);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 28px -10px rgba(212, 175, 55, 0.9); }
  &:active:not(:disabled) { transform: translateY(0) scale(0.99); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const Spinner = styled.span`
  width: 15px;
  height: 15px;
  border: 2px solid rgba(26, 20, 8, 0.3);
  border-top-color: ${theme.colors.onGold};
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
    &.unmet { color: ${theme.colors.textMuted}; }
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
  background: #14100a;
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
  &:hover { background: ${theme.colors.surfaceHover}; color: ${theme.colors.accent}; }
  &:hover svg { transform: rotate(180deg); }
  &:active { transform: scale(0.96); }
`;

/* ============================================================
   MESSAGE — with gold variant + optional hidden icon
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
    props.kind === 'error' ? theme.colors.dangerSoft
    : props.kind === 'success' ? theme.colors.successSoft
    : props.kind === 'gold' ? theme.colors.accentSoft
    : theme.colors.warningSoft};
  color: ${props =>
    props.kind === 'error' ? theme.colors.danger
    : props.kind === 'success' ? theme.colors.success
    : props.kind === 'gold' ? theme.colors.goldLight
    : theme.colors.warning};
  border: 1px solid
    ${props =>
      props.kind === 'error' ? 'rgba(239, 68, 68, 0.25)'
      : props.kind === 'success' ? 'rgba(16, 185, 129, 0.25)'
      : props.kind === 'gold' ? theme.colors.accentLine
      : 'rgba(245, 158, 11, 0.25)'};

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2.4; fill: none; stroke-linecap: round; stroke-linejoin: round; }
  }
`;

/* ============================================================
   AD SIDE — marketing panel with contained slideshow
   ============================================================ */
const AdSide = styled.div`
  position: relative;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${theme.colors.gradientAd};
  padding: 44px 48px 40px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212, 175, 55, 0.05) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse at center, #000 25%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse at center, #000 25%, transparent 80%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -180px;
    right: -180px;
    width: 460px;
    height: 460px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.32) 0%, transparent 65%);
    pointer-events: none;
  }

  @media (max-width: 1024px) { display: none; }
`;

const AdInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  animation: ${fadeUp} 0.7s ease 0.1s both;
`;

const AdBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: ${theme.colors.accentSoft};
  border: 1px solid ${theme.colors.accentLine};
  color: ${theme.colors.goldLight};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  margin-bottom: 18px;

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
  font-size: 36px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 0 0 12px;
  color: #fbf7ec;

  span {
    background: linear-gradient(135deg, #fbeaa4 0%, #d4af37 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const AdSub = styled.p`
  font-size: 14.5px;
  line-height: 1.6;
  color: ${theme.colors.textSecondary};
  margin: 0 0 22px;
  max-width: 440px;
`;

/* ---- Contained slideshow card ---- */
const SlideshowCard = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 240px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(212, 175, 55, 0.18);
  box-shadow:
    0 20px 40px -22px rgba(0, 0, 0, 0.9),
    0 0 0 1px rgba(212, 175, 55, 0.08);
  margin-bottom: 20px;
  background: #140f07;
`;

const SlideLayer = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${props => (props.active ? 1 : 0)};
  transition: opacity 1.2s ease-in-out;
  will-change: opacity;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    pointer-events: none;
  }
`;

const SlideDots = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
  padding: 0 8px;
`;

const Dot = styled.button`
  width: ${props => (props.active ? '20px' : '6px')};
  height: 6px;
  border-radius: 999px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${props => (props.active ? '#f7e08a' : 'rgba(255, 255, 255, 0.45)')};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: width 0.35s ease, background 0.35s ease;
  &:hover { background: rgba(255, 255, 255, 0.9); }
`;

const SlideLabel = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(20, 15, 7, 0.78);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: #e4d7b4;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
`;

/* ---- Feature mini-grid ---- */
const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const MiniFeature = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 12px 13px;
  background: rgba(45, 36, 20, 0.5);
  border: 1px solid rgba(212, 175, 55, 0.12);
  border-radius: 12px;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(212, 175, 55, 0.4);
  }

  .icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: ${theme.colors.accentSoft};
    border: 1px solid ${theme.colors.accentLine};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.goldLight};
    svg { width: 14px; height: 14px; }
  }

  h5 {
    font-size: 12px;
    font-weight: 700;
    color: #ece3cd;
    margin: 0;
    letter-spacing: -0.1px;
  }

  p {
    font-size: 11px;
    color: ${theme.colors.textSecondary};
    margin: 0;
    line-height: 1.4;
  }
`;

/* ---- Stats strip ---- */
const StatsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 14px 16px;
  background: rgba(45, 36, 20, 0.45);
  border: 1px solid rgba(212, 175, 55, 0.12);
  border-radius: 14px;
  margin-bottom: 16px;

  .stat {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .value {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.4px;
      color: ${theme.colors.goldLight};
    }
    .label {
      font-size: 10.5px;
      color: ${theme.colors.textMuted};
      font-weight: 600;
      letter-spacing: 0.2px;
      text-transform: uppercase;
    }
  }
`;

/* ---- Testimonial ---- */
const Testimonial = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(20, 15, 7, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.12);
  border-left: 2px solid ${theme.colors.accent};
  border-radius: 12px;

  .avatar {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f7e08a 0%, #c99a24 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
    color: ${theme.colors.onGold};
    letter-spacing: 0.3px;
  }

  .body {
    flex: 1;

    .quote {
      font-size: 12.5px;
      color: #ded2b6;
      line-height: 1.55;
      margin: 0 0 6px;
      font-style: italic;
    }

    .who {
      font-size: 11px;
      color: ${theme.colors.textMuted};
      font-weight: 600;
    }
    .who strong { color: #ece3cd; font-weight: 700; }
  }
`;

/* ============================================================
   SLIDESHOW COMPONENT — shuffled playback
   ============================================================ */
const Slideshow = () => {
  const total = SLIDES.length;

  const [order, setOrder] = useState(() => buildShuffledOrder(total));
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (total <= 1) return undefined;

    const t = setInterval(() => {
      setPos((p) => {
        const next = p + 1;
        if (next >= total) {
          setOrder(buildShuffledOrder(total));
          return 0;
        }
        return next;
      });
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(t);
  }, [total]);

  const activeSlideIndex = order[pos];

  return (
    <SlideshowCard>
      {SLIDES.map((slide, i) => (
        <SlideLayer key={i} active={i === activeSlideIndex}>
          <img src={slide.src} alt={slide.alt} draggable="false" />
        </SlideLayer>
      ))}

      <SlideLabel>
        Preview · {pos + 1} / {total}
      </SlideLabel>

      {total > 1 && (
        <SlideDots role="tablist" aria-label="Slideshow navigation">
          {Array.from({ length: total }).map((_, i) => (
            <Dot
              key={i}
              active={i === pos}
              onClick={() => setPos(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === pos}
              role="tab"
            />
          ))}
        </SlideDots>
      )}
    </SlideshowCard>
  );
};

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

  @media (max-width: 480px) { padding: 14px; align-items: flex-start; padding-top: 40px; }
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: ${props => (props.wide ? '540px' : '440px')};
  background: #120e07;
  border: 1px solid ${theme.colors.border};
  border-radius: 18px;
  padding: 28px 26px 24px;
  position: relative;
  box-shadow:
    0 24px 70px -12px rgba(0, 0, 0, 0.9),
    0 0 0 1px rgba(212, 175, 55, 0.1);
  animation: ${modalPopIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (max-width: 480px) { padding: 22px 18px 18px; border-radius: 16px; }
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
  z-index: 2;

  &:hover { background: rgba(212, 175, 55, 0.08); color: ${theme.colors.text}; }
  svg { width: 18px; height: 18px; }
`;

const ModalIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: ${props => props.bg || theme.colors.accentSoft};
  border: 1px solid ${props => props.border || theme.colors.accentLine};
  svg { width: 30px; height: 30px; display: block; }
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
  strong { color: ${theme.colors.text}; font-weight: 600; }
`;

const ModalBody = styled.div`margin-bottom: 14px;`;

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

  &:hover { background: ${theme.colors.surfaceHover}; color: ${theme.colors.text}; border-color: #4a3c22; }
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
  gap: 5px;
  svg { width: 13px; height: 13px; stroke: currentColor; }
  &:hover { text-decoration: underline; }
  &:disabled { opacity: 0.55; cursor: not-allowed; text-decoration: none; }
`;

/* ============================================================
   TERMS & CONDITIONS — scrollable body + typography
   ============================================================ */
const TermsScroll = styled.div`
  max-height: 44vh;
  overflow-y: auto;
  padding-right: 8px;
  margin: 0 0 4px;
  text-align: left;

  scrollbar-width: thin;
  scrollbar-color: rgba(212, 175, 55, 0.28) transparent;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.28);
    border-radius: 99px;
  }
  &::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.45); }

  @media (max-width: 480px) { max-height: 56vh; }
`;

const TermsSection = styled.div`
  margin-bottom: 16px;
  &:last-child { margin-bottom: 0; }
`;

const TermsTitle = styled.h3`
  font-size: 13.5px;
  font-weight: 700;
  color: ${theme.colors.goldLight};
  margin: 0 0 6px;
  letter-spacing: -0.1px;
`;

const TermsText = styled.p`
  font-size: 12.5px;
  line-height: 1.65;
  color: ${theme.colors.textSecondary};
  margin: 0;
  strong { color: ${theme.colors.text}; font-weight: 600; }
`;

const TermsBullet = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 3px 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: ${theme.colors.textSecondary};

  .dot {
    color: ${theme.colors.accent};
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }
  strong { color: ${theme.colors.text}; font-weight: 600; }
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
      ${props => (props.error ? 'rgba(239, 68, 68, 0.18)' : 'rgba(212, 175, 55, 0.18)')};
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
  width: 76px;
  height: 76px;
  position: relative;
  margin-bottom: 16px;
  svg { width: 100%; height: 100%; display: block; }

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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-3.1-6.8" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const XCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const MailSealIcon = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mailGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f7e08a" /><stop offset="100%" stopColor="#c99a24" />
      </linearGradient>
    </defs>
    <rect x="3" y="7" width="26" height="19" rx="4" fill="url(#mailGrad)" opacity="0.16" stroke="url(#mailGrad)" strokeWidth="1.6" />
    <path d="M5 10 L16 19 L27 10" fill="none" stroke="url(#mailGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="8" r="5" fill="#10b981" />
    <path d="M21.5 8.2 L23.2 10 L26.5 6.5" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const KeyShieldIcon = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="keyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <path d="M16 3 L27 8 V15 C27 22 22 26 16 29 C10 26 5 22 5 15 V8 Z" fill="url(#keyGrad)" opacity="0.14" stroke="url(#keyGrad)" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="13" cy="17" r="3.4" fill="none" stroke="url(#keyGrad)" strokeWidth="2" />
    <path d="M16.2 17 L23 17 M21 17 L21 20 M23 17 L23 20" fill="none" stroke="url(#keyGrad)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ShieldLockIcon = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f7e08a" /><stop offset="100%" stopColor="#c99a24" />
      </linearGradient>
    </defs>
    <path d="M16 3 L28 8 V16 C28 23 23 27 16 30 C9 27 4 23 4 16 V8 Z" fill="url(#shieldGrad)" opacity="0.14" stroke="url(#shieldGrad)" strokeWidth="1.8" strokeLinejoin="round" />
    <rect x="11" y="15" width="10" height="8" rx="1.8" fill="none" stroke="url(#shieldGrad)" strokeWidth="2" />
    <path d="M13.5 15 V12.5 a2.5 2.5 0 0 1 5 0 V15" fill="none" stroke="url(#shieldGrad)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="19" r="1.2" fill="url(#shieldGrad)" />
  </svg>
);

const TermsDocIcon = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="termsGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f7e08a" /><stop offset="100%" stopColor="#c99a24" />
      </linearGradient>
    </defs>
    <path
      d="M8 3 H20 L26 9 V27 a2 2 0 0 1 -2 2 H8 a2 2 0 0 1 -2 -2 V5 a2 2 0 0 1 2 -2 Z"
      fill="url(#termsGrad)" opacity="0.14" stroke="url(#termsGrad)" strokeWidth="1.8" strokeLinejoin="round"
    />
    <path d="M20 3 V9 H26" fill="none" stroke="url(#termsGrad)" strokeWidth="1.8" strokeLinejoin="round" />
    <line x1="11" y1="14" x2="23" y2="14" stroke="url(#termsGrad)" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="11" y1="18" x2="23" y2="18" stroke="url(#termsGrad)" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="11" y1="22" x2="19" y2="22" stroke="url(#termsGrad)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CheckCircleMini = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ResendMiniIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-3.1-6.8" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const SuccessCircleSvg = () => (
  <svg viewBox="0 0 62 62" xmlns="http://www.w3.org/2000/svg">
    <circle cx="31" cy="31" r="28" />
    <path d="M20 32 l7 7 l15 -15" />
  </svg>
);

/* ============================================================
   CAPTCHA HELPERS
   ============================================================ */
const randomHsl = (s, l) => `hsl(${Math.floor(Math.random() * 360)}, ${s}%, ${l}%)`;

const buildCaptcha = () => {
  const code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
  const seed = Math.floor(Math.random() * 10000);

  const chars = code.split('').map((ch, i) => ({
    ch, x: 22 + i * 27, y: 36 + (Math.random() - 0.5) * 6,
    rotate: (Math.random() - 0.5) * 34, fontSize: 24 + Math.random() * 8,
    color: randomHsl(65, 62), fontWeight: 600 + Math.floor(Math.random() * 3) * 100,
  }));

  const lines = Array.from({ length: 4 }, () => ({
    x1: Math.random() * 200, y1: Math.random() * 66,
    x2: Math.random() * 200, y2: Math.random() * 66, color: randomHsl(60, 60),
  }));

  const dots = Array.from({ length: 36 }, () => ({
    cx: Math.random() * 200, cy: Math.random() * 66,
    r: 0.5 + Math.random() * 1.6, color: randomHsl(55, 62),
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
          <stop offset="0%" stopColor="#120e08" /><stop offset="100%" stopColor="#241b0e" />
        </linearGradient>
        <filter id={`captchaWarp-${seed}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency="0.02 0.05" numOctaves="2" seed={seed % 100} result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <rect width="200" height="66" fill={`url(#captchaBg-${seed})`} />
      {dots.map((d, i) => <circle key={`dot-${i}`} cx={d.cx} cy={d.cy} r={d.r} fill={d.color} opacity="0.55" />)}
      {lines.map((l, i) => <line key={`line-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth="1.4" opacity="0.55" />)}
      <g filter={`url(#captchaWarp-${seed})`}>
        {chars.map((c, i) => (
          <text key={`ch-${i}`} x={c.x} y={c.y} fontSize={c.fontSize} fontWeight={c.fontWeight} fill={c.color}
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
  const focusIndex = (i) => { const el = inputsRef.current[i]; if (el) el.focus(); };

  useEffect(() => { if (autoFocus) focusIndex(0); }, [autoFocus]);

  const handleChange = (i, raw) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      const next = value.split(''); next[i] = ''; onChange(next.join('')); return;
    }
    const next = value.split('');
    for (let k = 0; k < digits.length && i + k < length; k++) next[i + k] = digits[k];
    onChange(next.join('').slice(0, length));
    focusIndex(Math.min(i + digits.length, length - 1));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      const next = value.split(''); next[i - 1] = '';
      onChange(next.join('')); focusIndex(i - 1); e.preventDefault();
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
const EmailVerificationModal = ({ open, email, userId, onClose, onVerified, onContinue }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendNote, setResendNote] = useState('');

  useEffect(() => {
    if (open) {
      setCode(''); setError(''); setVerifying(false); setVerified(false);
      setResendIn(30); setResendNote('');
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

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (code.length !== 6) { setError('Please enter all 6 digits.'); return; }
    setError(''); setVerifying(true);
    try {
      const storedUserId = userId || localStorage.getItem('tempUserId');
      const response = await fetch(ENDPOINTS.verifyEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: storedUserId ? parseInt(storedUserId, 10) : null, code }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem('tempUserId'); localStorage.removeItem('userEmail');
        setVerifying(false); setVerified(true);
        if (onVerified) onVerified();
      } else {
        setError(data.error || 'Invalid verification code');
        setVerifying(false); setCode('');
      }
    } catch (err) {
      console.error('Verify error:', err);
      setError('Cannot connect to server. Please try again.');
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || resending) return;
    setResending(true); setResendNote('');
    try {
      const storedUserId = userId || localStorage.getItem('tempUserId');
      const response = await fetch(ENDPOINTS.resendCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: storedUserId ? parseInt(storedUserId, 10) : null, email }),
      });
      const data = await response.json();
      if (response.ok) {
        setResendIn(30);
        setResendNote('A new code has been sent to your email.');
      } else {
        setResendNote(data.error || 'Failed to resend code.');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setResendNote('Cannot connect to server.');
    } finally { setResending(false); }
  };

  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label="Close"><CloseIcon /></ModalClose>
        {verified ? (
          <SuccessWrap>
            <SuccessCircle><SuccessCircleSvg /></SuccessCircle>
            <ModalTitle>Email verified</ModalTitle>
            <ModalSubtitle style={{ marginBottom: 8 }}>
              Your account is now active. Sign in to continue.
            </ModalSubtitle>
            <ModalActions style={{ width: '100%' }}>
              <SubmitBtn type="button" onClick={() => { if (onContinue) onContinue(); else onClose(); }}>
                Continue to sign in
              </SubmitBtn>
            </ModalActions>
          </SuccessWrap>
        ) : (
          <form onSubmit={handleVerify}>
            <ModalIcon><MailSealIcon /></ModalIcon>
            <ModalTitle>Verify your email</ModalTitle>
            <ModalSubtitle>
              We sent a 6-digit code to <strong>{email || 'your email'}</strong>.
              <br />Enter it below to activate your account.
            </ModalSubtitle>
            <ModalBody>
              <OtpInput value={code} onChange={(v) => { setCode(v); if (error) setError(''); }}
                error={!!error} disabled={verifying} autoFocus />
              {error && <ErrorText style={{ textAlign: 'center', marginTop: 2 }}>{error}</ErrorText>}
              <ResendRow style={{ marginTop: 12 }}>
                <span>Didn't get the code?</span>
                {resendIn > 0 ? (
                  <span style={{ color: theme.colors.textMuted }}>Resend in {resendIn}s</span>
                ) : (
                  <LinkButton type="button" onClick={handleResend} disabled={resending}>
                    <ResendMiniIcon />{resending ? 'Sending' : 'Resend code'}
                  </LinkButton>
                )}
              </ResendRow>
              {resendNote && (
                <div style={{ marginTop: 10, fontSize: 13, color: theme.colors.success, textAlign: 'center' }}>
                  {resendNote}
                </div>
              )}
            </ModalBody>
            <SubmitBtn type="submit" disabled={verifying || code.length !== 6}>
              {verifying && <Spinner />}{verifying ? 'Verifying' : 'Verify email'}
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
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) { setEmail(''); setError(''); setSending(false); setSent(false); }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError('Enter a valid email address.'); return; }
    setError(''); setSending(true);
    try {
      const response = await fetch(ENDPOINTS.forgotPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('resetEmail', trimmed);
        setSending(false); setSent(true);
        setTimeout(() => { if (onCodeSent) onCodeSent(trimmed); }, 800);
      } else {
        setError(data.error || 'Failed to send reset code.');
        setSending(false);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Cannot connect to server. Please try again.');
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label="Close"><CloseIcon /></ModalClose>
        {sent ? (
          <SuccessWrap>
            <SuccessCircle><SuccessCircleSvg /></SuccessCircle>
            <ModalTitle>Code sent</ModalTitle>
            <ModalSubtitle style={{ marginBottom: 8 }}>
              Check <strong>{email}</strong> for the reset code.
            </ModalSubtitle>
          </SuccessWrap>
        ) : (
          <form onSubmit={handleSubmit}>
            <ModalIcon bg="rgba(245, 158, 11, 0.12)" border="rgba(245, 158, 11, 0.28)">
              <KeyShieldIcon />
            </ModalIcon>
            <ModalTitle>Forgot your password?</ModalTitle>
            <ModalSubtitle>
              Enter the email tied to your MyTradeApp account and we'll send you a secure reset code.
            </ModalSubtitle>
            <ModalBody>
              <Field>
                <Label htmlFor="forgotEmail">Email address</Label>
                <InputWrap>
                  <Input id="forgotEmail" type="email" placeholder="you@example.com"
                    autoComplete="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                    error={!!error} autoFocus />
                </InputWrap>
                {error && <ErrorText>{error}</ErrorText>}
              </Field>
            </ModalBody>
            <SubmitBtn type="submit" disabled={sending}>
              {sending && <Spinner />}{sending ? 'Sending code' : 'Send reset code'}
            </SubmitBtn>
            <ModalActions>
              <SecondaryBtn type="button" onClick={onClose}>Cancel</SecondaryBtn>
            </ModalActions>
          </form>
        )}
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
  const [done, setDone] = useState(false);
  const [resendIn, setResendIn] = useState(30);
  const [resending, setResending] = useState(false);
  const [resendNote, setResendNote] = useState('');

  useEffect(() => {
    if (open) {
      setCode(''); setPassword(''); setConfirm('');
      setShowPw(false); setShowCf(false); setErrors({});
      setLoading(false); setDone(false); setResendIn(30); setResendNote('');
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

  const handleReset = async (e) => {
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
    try {
      const verifyRes = await fetch(ENDPOINTS.verifyResetCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setErrors({ code: verifyData.error || 'Invalid verification code.' });
        setLoading(false); return;
      }
      const resetToken = verifyData.reset_token;
      sessionStorage.setItem('resetToken', resetToken);

      const resetRes = await fetch(ENDPOINTS.resetPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_token: resetToken, new_password: password, confirm_password: confirm }),
      });
      const resetData = await resetRes.json();
      if (resetRes.ok) {
        sessionStorage.clear(); localStorage.removeItem('resetToken');
        setLoading(false); setDone(true);
        setTimeout(() => { if (onResetDone) onResetDone(); }, 900);
      } else {
        setErrors({ confirm: resetData.error || 'Reset failed.' });
        setLoading(false);
      }
    } catch (err) {
      console.error('Reset error:', err);
      setErrors({ confirm: 'Cannot connect to server. Please check your network and try again.' });
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || resending) return;
    setResending(true); setResendNote('');
    try {
      const response = await fetch(ENDPOINTS.forgotPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setResendIn(30);
        setResendNote('A new code has been sent to your email.');
        setCode('');
      } else {
        setResendNote(data.error || 'Failed to resend code.');
      }
    } catch (err) { setResendNote('Cannot connect to server.'); }
    finally { setResending(false); }
  };

  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label="Close"><CloseIcon /></ModalClose>
        {done ? (
          <SuccessWrap>
            <SuccessCircle><SuccessCircleSvg /></SuccessCircle>
            <ModalTitle>Password updated</ModalTitle>
            <ModalSubtitle style={{ marginBottom: 8 }}>
              You can now sign in with your new password.
            </ModalSubtitle>
          </SuccessWrap>
        ) : (
          <form onSubmit={handleReset}>
            <ModalIcon><ShieldLockIcon /></ModalIcon>
            <ModalTitle>Reset your password</ModalTitle>
            <ModalSubtitle>
              Enter the 6-digit code sent to <strong>{email || 'your email'}</strong>{' '}
              and choose a new password.
            </ModalSubtitle>
            <ModalBody>
              <OtpInput value={code} onChange={(v) => { setCode(v); if (errors.code) setErrors((p) => ({ ...p, code: '' })); }}
                error={!!errors.code} disabled={loading} autoFocus />
              {errors.code && <ErrorText style={{ textAlign: 'center', marginTop: 2 }}>{errors.code}</ErrorText>}
              <ResendRow style={{ marginTop: 12, marginBottom: 16 }}>
                <span>Didn't get the code?</span>
                {resendIn > 0 ? (
                  <span style={{ color: theme.colors.textMuted }}>Resend in {resendIn}s</span>
                ) : (
                  <LinkButton type="button" onClick={handleResend} disabled={resending}>
                    <ResendMiniIcon />{resending ? 'Sending' : 'Resend code'}
                  </LinkButton>
                )}
              </ResendRow>
              {resendNote && (
                <div style={{ marginTop: -8, marginBottom: 12, fontSize: 13, color: theme.colors.success, textAlign: 'center' }}>
                  {resendNote}
                </div>
              )}
              <Field>
                <Label htmlFor="resetPassword">New password</Label>
                <InputWrap>
                  <Input id="resetPassword" type={showPw ? 'text' : 'password'}
                    placeholder="At least 8 characters" autoComplete="new-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: '' })); }}
                    error={!!errors.password} hasToggle />
                  <ToggleBtn type="button" onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </ToggleBtn>
                </InputWrap>
                <StrengthText color={strength.color}>{strength.label}</StrengthText>
                <RequirementsList>
                  <li className={pwChecks.length ? 'met' : 'unmet'}>
                    <span className="check"><CheckCircleMini /></span>8+ characters
                  </li>
                  <li className={pwChecks.upper ? 'met' : 'unmet'}>
                    <span className="check"><CheckCircleMini /></span>Uppercase
                  </li>
                  <li className={pwChecks.number ? 'met' : 'unmet'}>
                    <span className="check"><CheckCircleMini /></span>Number
                  </li>
                  <li className={pwChecks.symbol ? 'met' : 'unmet'}>
                    <span className="check"><CheckCircleMini /></span>Symbol
                  </li>
                </RequirementsList>
                {errors.password && <ErrorText style={{ marginTop: 8 }}>{errors.password}</ErrorText>}
              </Field>
              <Field>
                <Label htmlFor="resetConfirm">Confirm new password</Label>
                <InputWrap>
                  <Input id="resetConfirm" type={showCf ? 'text' : 'password'}
                    placeholder="Re-enter new password" autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); if (errors.confirm) setErrors((p) => ({ ...p, confirm: '' })); }}
                    error={!!errors.confirm} hasToggle />
                  <ToggleBtn type="button" onClick={() => setShowCf((v) => !v)}
                    aria-label={showCf ? 'Hide password' : 'Show password'}>
                    {showCf ? <EyeOffIcon /> : <EyeIcon />}
                  </ToggleBtn>
                </InputWrap>
                {errors.confirm && <ErrorText>{errors.confirm}</ErrorText>}
              </Field>
            </ModalBody>
            <SubmitBtn type="submit" disabled={loading}>
              {loading && <Spinner />}{loading ? 'Resetting' : 'Reset password'}
            </SubmitBtn>
            <ModalActions>
              <SecondaryBtn type="button" onClick={onBack}>Back</SecondaryBtn>
            </ModalActions>
          </form>
        )}
      </ModalCard>
    </ModalBackdrop>
  );
};

/* ============================================================
   MODAL 4 — TERMS & CONDITIONS (popup on this page)
   ============================================================ */
const TermsModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard wide onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label="Close"><CloseIcon /></ModalClose>

        <ModalIcon><TermsDocIcon /></ModalIcon>
        <ModalTitle>Terms &amp; Conditions</ModalTitle>
        <ModalSubtitle style={{ marginBottom: 16 }}>
          Please read these terms carefully before creating your account.
        </ModalSubtitle>

        <TermsScroll>
          <TermsSection>
            <TermsTitle>1. Introduction</TermsTitle>
            <TermsText>
              Welcome to MyTradeApp. By using our third-party trading application,
              you agree to these Terms and Conditions.
            </TermsText>
          </TermsSection>

          <TermsSection>
            <TermsTitle>2. Acceptance of Terms</TermsTitle>
            <TermsText>
              By accessing or using MyTradeApp, you confirm that you have read,
              understood, and agree to be bound by these Terms.
            </TermsText>
            <TermsBullet>
              <span className="dot">•</span>
              <span>You must be at least <strong>18 years old</strong> to use this App.</span>
            </TermsBullet>
            <TermsBullet>
              <span className="dot">•</span>
              <span>You are <strong>solely responsible</strong> for all trading decisions.</span>
            </TermsBullet>
            <TermsBullet>
              <span className="dot">•</span>
              <span>Trading involves <strong>significant financial risk</strong>.</span>
            </TermsBullet>
          </TermsSection>

          <TermsSection>
            <TermsTitle>3. Services Provided</TermsTitle>
            <TermsText>
              MyTradeApp provides automated trading, AI-assisted analysis, manual
              trading, bot deployment, and real-time market data from Deriv via APIs.
            </TermsText>
          </TermsSection>

          <TermsSection>
            <TermsTitle>4. Account Responsibility</TermsTitle>
            <TermsText>
              You are fully responsible for all trades executed through the App.
              MyTradeApp does not store your login credentials.
            </TermsText>
            <TermsBullet>
              <span className="dot">•</span>
              <span>You must <strong>not share</strong> your trading credentials.</span>
            </TermsBullet>
            <TermsBullet>
              <span className="dot">•</span>
              <span>You are responsible for <strong>all financial losses</strong>.</span>
            </TermsBullet>
          </TermsSection>

          <TermsSection>
            <TermsTitle>5. Limitation of Liability</TermsTitle>
            <TermsText>
              MyTradeApp provides the App "as is" without any warranties. We are not
              liable for any financial losses, technical issues, or damages arising
              from your use of the App.
            </TermsText>
          </TermsSection>

          <TermsSection>
            <TermsTitle>6. Privacy Policy</TermsTitle>
            <TermsText>
              We do not store your Deriv or Forex login credentials. We collect
              minimal data necessary for app functionality and never sell your
              personal data.
            </TermsText>
          </TermsSection>

          <TermsSection>
            <TermsTitle>7. Governing Law</TermsTitle>
            <TermsText>
              These Terms shall be governed by the laws of the jurisdiction where
              MyTradeApp operates.
            </TermsText>
          </TermsSection>

          <TermsSection>
            <TermsTitle>8. Contact Us</TermsTitle>
            <TermsText>
              For questions or concerns, contact us at <strong>support@mytradeapp.com</strong>
            </TermsText>
          </TermsSection>
        </TermsScroll>

        <ModalActions>
          <SubmitBtn type="button" onClick={onClose}>I understand</SubmitBtn>
        </ModalActions>
      </ModalCard>
    </ModalBackdrop>
  );
};

/* ============================================================
   MESSAGE ICON PICKER — gold variant renders no icon
   ============================================================ */
const MessageIcon = ({ kind }) => {
  if (kind === 'gold') return null;
  if (kind === 'error') return <XCircleIcon />;
  if (kind === 'success') return <CheckIcon />;
  return <AlertIcon />;
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const SignUp = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signup');

  const [signupForm, setSignupForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
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
  const [verifyUserId, setVerifyUserId] = useState(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  useEffect(() => { setCaptcha(buildCaptcha()); }, []);

  const refreshCaptcha = () => {
    setCaptcha(buildCaptcha());
    setCaptchaInput('');
    setCaptchaError('');
  };

  const clearMessage = () => { setMessage(''); setMessageKind('info'); };

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setSignupErrors({}); setLoginErrors({}); setCaptchaError('');
    setShowPassword(false); setShowConfirm(false);
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

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  const validateSignup = () => {
    const next = {};
    const { fullName, email, phone, password, confirmPassword } = signupForm;

    if (!fullName.trim()) next.fullName = 'Please enter your full name.';
    else if (fullName.trim().length < 2) next.fullName = 'Name must be at least 2 characters.';

    if (!email.trim()) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = 'Enter a valid email address.';

    if (!phone.trim()) next.phone = 'Please enter your phone number.';
    else if (!validatePhone(phone.trim()))
      next.phone = 'Enter a valid phone with country code (e.g. +254...).';

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
    setMessage('Creating your account');
    setMessageKind('info');

    const fullNameTrimmed = signupForm.fullName.trim();
    const [firstName, ...rest] = fullNameTrimmed.split(/\s+/);
    const lastName = rest.join(' ') || '';

    try {
      const response = await fetch(ENDPOINTS.signup, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: signupForm.phone.trim(),
          email: signupForm.email.trim(),
          password: signupForm.password,
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        localStorage.setItem('tempUserId', data.user_id);
        localStorage.setItem('userEmail', signupForm.email.trim());
        setVerifyUserId(data.user_id);
        setVerifyEmail(signupForm.email.trim());
        setVerifyModalOpen(true);
        setLoading(false); clearMessage(); refreshCaptcha();
        setSignupForm({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
        setAgreed(false);
      } else {
        setMessage(data.error || 'Registration failed');
        setMessageKind('error'); setLoading(false); refreshCaptcha();
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Cannot connect to server.');
      setMessageKind('error'); setLoading(false); refreshCaptcha();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const next = validateLogin();
    setLoginErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setMessage('Signing you in'); setMessageKind('gold');

    try {
      const response = await fetch(ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email.trim(), password: loginForm.password }),
      });
      const data = await response.json();

      if (response.ok) {
        if (rememberMe) localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Welcome back! Redirecting...');
        setMessageKind('gold'); setLoading(false);
        setTimeout(() => { navigate('/Derivdash'); }, 1200);
      } else {
        const errorMsg = data.error || 'Login failed';
        if (errorMsg.toLowerCase().includes('verify')) {
          localStorage.setItem('userEmail', loginForm.email.trim());
          if (data.user_id) localStorage.setItem('tempUserId', data.user_id);
          setVerifyUserId(data.user_id || null);
          setVerifyEmail(loginForm.email.trim());
          setVerifyModalOpen(true);
          setLoading(false); clearMessage();
        } else {
          setMessage(errorMsg); setMessageKind('error'); setLoading(false);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Cannot connect to server.');
      setMessageKind('error'); setLoading(false);
    }
  };

  const handleVerified = () => {};

  const handleVerifyContinue = () => {
    setVerifyModalOpen(false);
    setMode('login');
    setLoginForm({ email: verifyEmail, password: '' });
    setMessage('Email verified. Please sign in.');
    setMessageKind('gold');
  };

  const handleForgotCodeSent = (email) => {
    setForgotModalOpen(false);
    setResetEmail(email);
    setResetModalOpen(true);
  };

  const handleResetDone = () => {
    setResetModalOpen(false);
    setMessage('Password updated. You can now log in with your new password.');
    setMessageKind('gold');
    setMode('login');
    setLoginForm({ email: resetEmail, password: '' });
  };

  return (
    <>
      <GlobalStyle />
      <Page className="mtapp-signup">
        <FormSide className="form-side">
          <Brand>
            <BrandLogo><BrandLogoSvg /></BrandLogo>
            <BrandText>
              <BrandName>My<span>TradeApp</span></BrandName>
              <BrandTag>Markets · Simplified</BrandTag>
            </BrandText>
          </Brand>

          <FormInner>
            {mode === 'signup' ? (
              <>
                <Heading>Sign up</Heading>
                <SwitchRow>
                  Already have an account?
                  <button type="button" onClick={() => switchMode('login')}>Log in</button>
                </SwitchRow>
              </>
            ) : (
              <>
                <Heading>Log in</Heading>
                <SwitchRow>
                  Don't have an account?
                  <button type="button" onClick={() => switchMode('signup')}>Sign up</button>
                </SwitchRow>
              </>
            )}

            {mode === 'signup' && (
              <form onSubmit={handleSignup} noValidate>
                <Field>
                  <Label htmlFor="fullName">Full name</Label>
                  <InputWrap>
                    <Input id="fullName" type="text" placeholder="e.g Tonny Kyalo" autoComplete="name"
                      value={signupForm.fullName} onChange={updateSignup('fullName')}
                      error={!!signupErrors.fullName} />
                  </InputWrap>
                  {signupErrors.fullName && <ErrorText>{signupErrors.fullName}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="signupEmail">Email address</Label>
                  <InputWrap>
                    <Input id="signupEmail" type="email" placeholder="you@example.com"
                      autoComplete="email" value={signupForm.email}
                      onChange={updateSignup('email')} error={!!signupErrors.email} />
                  </InputWrap>
                  {signupErrors.email && <ErrorText>{signupErrors.email}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="signupPhone">Phone number</Label>
                  <InputWrap>
                    <Input id="signupPhone" type="tel" placeholder="+254 712 345 678"
                      autoComplete="tel" value={signupForm.phone}
                      onChange={updateSignup('phone')} error={!!signupErrors.phone} />
                  </InputWrap>
                  {signupErrors.phone && <ErrorText>{signupErrors.phone}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="signupPassword">Password</Label>
                  <InputWrap>
                    <Input id="signupPassword" type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters" autoComplete="new-password"
                      value={signupForm.password} onChange={updateSignup('password')}
                      error={!!signupErrors.password} hasToggle />
                    <ToggleBtn type="button" onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </ToggleBtn>
                  </InputWrap>
                  <StrengthText color={passwordStrength.color}>{passwordStrength.label}</StrengthText>
                  <RequirementsList>
                    <li className={passwordChecks.length ? 'met' : 'unmet'}>
                      <span className="check"><CheckCircleMini /></span>8+ characters
                    </li>
                    <li className={passwordChecks.upper ? 'met' : 'unmet'}>
                      <span className="check"><CheckCircleMini /></span>Uppercase letter
                    </li>
                    <li className={passwordChecks.number ? 'met' : 'unmet'}>
                      <span className="check"><CheckCircleMini /></span>Number
                    </li>
                    <li className={passwordChecks.symbol ? 'met' : 'unmet'}>
                      <span className="check"><CheckCircleMini /></span>Symbol
                    </li>
                  </RequirementsList>
                  {signupErrors.password && <ErrorText style={{ marginTop: 8 }}>{signupErrors.password}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <InputWrap>
                    <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter your password" autoComplete="new-password"
                      value={signupForm.confirmPassword} onChange={updateSignup('confirmPassword')}
                      error={!!signupErrors.confirmPassword} hasToggle />
                    <ToggleBtn type="button" onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </ToggleBtn>
                  </InputWrap>
                  {signupErrors.confirmPassword && <ErrorText>{signupErrors.confirmPassword}</ErrorText>}
                </Field>

                <Field>
                  <Label>Security check</Label>
                  <CaptchaRow>
                    <CaptchaFrame aria-label="CAPTCHA: enter the numbers you see">
                      <CaptchaSvg captcha={captcha} />
                    </CaptchaFrame>
                    <RefreshBtn type="button" onClick={refreshCaptcha}
                      aria-label="Refresh security code" title="Get a new code">
                      <RefreshIcon />
                    </RefreshBtn>
                  </CaptchaRow>
                  <InputWrap>
                    <Input type="text" inputMode="numeric" autoComplete="off" maxLength={6}
                      placeholder="Enter the 6 numbers above" value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value.replace(/\D/g, ''));
                        if (captchaError) setCaptchaError('');
                      }}
                      error={!!captchaError} />
                  </InputWrap>
                  {captchaError && <ErrorText>{captchaError}</ErrorText>}
                </Field>

                <RowBetween>
                  <CheckLabel>
                    <input type="checkbox" checked={agreed}
                      onChange={(e) => {
                        setAgreed(e.target.checked);
                        if (signupErrors.agreed) setSignupErrors((p) => ({ ...p, agreed: '' }));
                      }} />
                    <span>
                      I agree to the{' '}
                      <button type="button" onClick={() => setTermsModalOpen(true)}>
                        Terms and Conditions
                      </button>.
                    </span>
                  </CheckLabel>
                </RowBetween>
                {signupErrors.agreed && (
                  <div style={{ marginTop: -10, marginBottom: 14 }}>
                    <ErrorText>{signupErrors.agreed}</ErrorText>
                  </div>
                )}

                <SubmitBtn type="submit" disabled={loading}>
                  {loading && <Spinner />}{loading ? 'Creating account' : 'Create account'}
                </SubmitBtn>
              </form>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} noValidate>
                <Field>
                  <Label htmlFor="loginEmail">Email address</Label>
                  <InputWrap>
                    <Input id="loginEmail" type="email" placeholder="you@example.com"
                      autoComplete="email" value={loginForm.email}
                      onChange={updateLogin('email')} error={!!loginErrors.email} />
                  </InputWrap>
                  {loginErrors.email && <ErrorText>{loginErrors.email}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="loginPassword">Password</Label>
                  <InputWrap>
                    <Input id="loginPassword" type={showPassword ? 'text' : 'password'}
                      placeholder="Your password" autoComplete="current-password"
                      value={loginForm.password} onChange={updateLogin('password')}
                      error={!!loginErrors.password} hasToggle />
                    <ToggleBtn type="button" onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </ToggleBtn>
                  </InputWrap>
                  {loginErrors.password && <ErrorText>{loginErrors.password}</ErrorText>}
                </Field>

                <RowBetween>
                  <CheckLabel>
                    <input type="checkbox" checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)} />
                    <span>Keep me signed in</span>
                  </CheckLabel>
                  <ForgotLink type="button" onClick={() => setForgotModalOpen(true)}>
                    Forgot password?
                  </ForgotLink>
                </RowBetween>

                <SubmitBtn type="submit" disabled={loading}>
                  {loading && <Spinner />}{loading ? 'Signing in' : 'Log in'}
                </SubmitBtn>
              </form>
            )}

            {message && (
              <Message kind={messageKind}>
                {messageKind !== 'gold' && (
                  <span className="icon"><MessageIcon kind={messageKind} /></span>
                )}
                {message}
              </Message>
            )}
          </FormInner>
        </FormSide>

        <AdSide className="ad-side">
          <AdInner>
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

            <Slideshow />

            <FeatureGrid>
              <MiniFeature>
                <div className="icon"><BoltIcon /></div>
                <h5>Fast execution</h5>
                <p>Sub-second order routing</p>
              </MiniFeature>
              <MiniFeature>
                <div className="icon"><ChartIcon /></div>
                <h5>Pro analytics</h5>
                <p>50+ indicators & tools</p>
              </MiniFeature>
              <MiniFeature>
                <div className="icon"><ShieldIcon /></div>
                <h5>Secure by design</h5>
                <p>2FA & segregated funds</p>
              </MiniFeature>
            </FeatureGrid>

            <StatsStrip>
              <div className="stat">
                <div className="value">2.4M+</div>
                <div className="label">Traders</div>
              </div>
              <div className="stat">
                <div className="value">$18B</div>
                <div className="label">Volume/mo</div>
              </div>
              <div className="stat">
                <div className="value">99.99%</div>
                <div className="label">Uptime</div>
              </div>
            </StatsStrip>

            <Testimonial>
              <div className="avatar">AK</div>
              <div className="body">
                <p className="quote">
                  "The cleanest trading interface I've used. Orders fill instantly
                  and the analytics are genuinely useful — not just noise."
                </p>
                <div className="who">
                  <strong>Alex Kim</strong> · Active trader since 2022
                </div>
              </div>
            </Testimonial>
          </AdInner>
        </AdSide>
      </Page>

      <EmailVerificationModal
        open={verifyModalOpen}
        email={verifyEmail}
        userId={verifyUserId}
        onClose={() => setVerifyModalOpen(false)}
        onVerified={handleVerified}
        onContinue={handleVerifyContinue}
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

      <TermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </>
  );
};

export default SignUp;