// src/pages/Academy.jsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// ============================================
// SVG ICONS
// ============================================
const BookOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ProgressIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const TOCIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const CircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9V4h12v5" />
    <rect x="10" y="13" width="4" height="8" />
    <path d="M9 21h6" />
    <circle cx="12" cy="9" r="5" />
    <path d="M6 9h12" />
    <path d="M6 9c-1.5 0-3-1.5-3-3V4h3" />
    <path d="M18 9c1.5 0 3-1.5 3-3V4h-3" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const DerivIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ForexIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// ============================================
// STYLED COMPONENTS
// ============================================

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${props => props.theme?.colors?.surface || '#0F172A'};
  padding: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.scrollbar || '#2a2e3d'};
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const CourseSelection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 60vh;
`;

const HeroText = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeIn} 0.8s ease;

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 18px;
    border-radius: 30px;
    background: ${props => props.theme?.colors?.accentLight || 'rgba(56, 189, 248, 0.08)'};
    border: 1px solid ${props => props.theme?.colors?.accent + '20' || 'rgba(56, 189, 248, 0.1)'};
    color: ${props => props.theme?.colors?.accent || '#38bdf8'};
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  .title {
    font-size: 42px;
    font-weight: 800;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    line-height: 1.2;
    margin-bottom: 16px;

    .gradient {
      background: linear-gradient(135deg, #22c55e, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .subtitle {
    font-size: 18px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.8;
  }

  @media (max-width: 768px) {
    .title { font-size: 32px; }
    .subtitle { font-size: 16px; }
  }
`;

const CourseCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  max-width: 900px;
  width: 100%;
  animation: ${fadeIn} 1s ease;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CourseCard = styled.div`
  background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.015)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};
  border-radius: 20px;
  padding: 40px 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    border-color: ${props => props.accent || props.theme?.colors?.accent || '#38bdf8'};
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4);
    background: ${props => props.theme?.colors?.bgHover || 'rgba(255, 255, 255, 0.03)'};
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: ${props => props.accent + '18' || 'rgba(56, 189, 248, 0.12)'};
    color: ${props => props.accent || props.theme?.colors?.accent || '#38bdf8'};
    margin-bottom: 24px;
  }

  .card-title {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    margin-bottom: 12px;
  }

  .card-desc {
    font-size: 14px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    line-height: 1.7;
    margin-bottom: 20px;
  }

  .card-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
    align-items: center;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const CourseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.06)'};

  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
    background: transparent;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: ${props => props.theme?.colors?.text || '#fff'};
      border-color: ${props => props.theme?.colors?.accent || '#3b82f6'};
    }
  }

  .course-info {
    h2 {
      font-size: 22px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.text || '#f1f5f9'};
      margin: 0;
    }
    .course-sub {
      font-size: 12px;
      color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
      margin-top: 2px;
    }
  }
`;

const TOCSection = styled.div`
  max-width: 900px;
  margin: 0 auto 40px;
  width: 100%;
  background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.015)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  border-radius: 16px;
  padding: 24px 28px;
  animation: ${fadeIn} 0.7s ease;

  .toc-title {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
    }
  }

  .toc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    .toc-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
      font-size: 13px;
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover {
        background: ${props => props.theme?.colors?.accentLight || 'rgba(56, 189, 248, 0.04)'};
        color: ${props => props.theme?.colors?.text || '#f1f5f9'};
      }

      .num {
        font-size: 11px;
        font-weight: 700;
        color: ${props => props.theme?.colors?.accent || '#38bdf8'};
        min-width: 28px;
      }

      .label {
        flex: 1;
      }

      .status-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 16px;
    .toc-grid { grid-template-columns: 1fr; }
    .toc-title { font-size: 17px; }
  }
`;

const LessonContainer = styled.div`
  max-width: 900px;
  margin: 0 auto 24px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease;
`;

const LessonCard = styled.div`
  background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.015)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
  border-radius: 16px;
  padding: 28px 30px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '20' || 'rgba(56, 189, 248, 0.06)'};
    background: ${props => props.theme?.colors?.bgHover || 'rgba(255, 255, 255, 0.02)'};
  }

  .lesson-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.02)'};

    .lesson-number {
      font-size: 12px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.accent || '#38bdf8'};
      background: ${props => props.theme?.colors?.accentLight || 'rgba(56, 189, 248, 0.08)'};
      padding: 2px 12px;
      border-radius: 20px;
      flex-shrink: 0;
    }

    .lesson-title {
      font-size: 20px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.text || '#f1f5f9'};
      flex: 1;
    }

    .lesson-duration {
      font-size: 11px;
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      background: ${props => props.theme?.colors?.bg || 'rgba(255, 255, 255, 0.02)'};
      padding: 2px 12px;
      border-radius: 20px;
      border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    }
  }

  .lesson-content {
    color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
    font-size: 15px;
    line-height: 1.9;

    h3 {
      color: ${props => props.theme?.colors?.text || '#f1f5f9'};
      font-size: 20px;
      font-weight: 600;
      margin: 28px 0 14px 0;
      padding-bottom: 6px;
      border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.02)'};
    }

    h4 {
      color: ${props => props.theme?.colors?.text || '#e2e8f0'};
      font-size: 17px;
      font-weight: 600;
      margin: 20px 0 10px 0;
    }

    h5 {
      color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
      font-size: 15px;
      font-weight: 600;
      margin: 16px 0 8px 0;
    }

    p {
      margin-bottom: 14px;
    }

    ul, ol {
      margin: 10px 0 14px 24px;
      li {
        margin-bottom: 8px;
      }
    }

    .highlight-box {
      background: ${props => props.theme?.colors?.accentLight || 'rgba(56, 189, 248, 0.04)'};
      border-left: 3px solid ${props => props.theme?.colors?.accent || '#38bdf8'};
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
    }

    .warning-box {
      background: rgba(239, 68, 68, 0.04);
      border-left: 3px solid #ef4444;
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
    }

    .success-box {
      background: rgba(34, 197, 94, 0.04);
      border-left: 3px solid #22c55e;
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
    }

    .example-box {
      background: rgba(251, 191, 36, 0.04);
      border: 1px solid rgba(251, 191, 36, 0.08);
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
    }

    .code-block {
      background: ${props => props.theme?.colors?.surface || 'rgba(0, 0, 0, 0.3)'};
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: ${props => props.theme?.colors?.text || '#e2e8f0'};
      overflow-x: auto;
      margin: 10px 0;
      border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.03)'};
    }

    .key-takeaway {
      background: rgba(129, 140, 248, 0.04);
      border: 1px solid rgba(129, 140, 248, 0.08);
      padding: 14px 18px;
      border-radius: 8px;
      margin: 14px 0;

      strong {
        color: #818cf8;
      }
    }

    .definition-box {
      background: rgba(34, 197, 94, 0.02);
      border: 1px solid rgba(34, 197, 94, 0.06);
      padding: 12px 16px;
      border-radius: 8px;
      margin: 10px 0;

      .term {
        color: #22c55e;
        font-weight: 700;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;

      th, td {
        padding: 10px 14px;
        border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.04)'};
        text-align: left;
        font-size: 14px;
      }

      th {
        background: ${props => props.theme?.colors?.accentLight || 'rgba(56, 189, 248, 0.04)'};
        color: ${props => props.theme?.colors?.text || '#f1f5f9'};
        font-weight: 600;
      }

      td {
        color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
      }
    }
  }

  @media (max-width: 768px) {
    padding: 18px 16px;
    .lesson-header {
      .lesson-title { font-size: 17px; }
      .lesson-duration { font-size: 10px; }
    }
    .lesson-content { font-size: 14px; h3 { font-size: 17px; } h4 { font-size: 15px; } }
  }
`;

const CompletionBanner = styled.div`
  text-align: center;
  padding: 40px 20px;
  margin: 20px auto;
  background: rgba(34, 197, 94, 0.04);
  border: 1px solid rgba(34, 197, 94, 0.08);
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease;

  .trophy-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    color: #fbbf24;
  }

  .title {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    margin-bottom: 6px;
  }

  .subtitle {
    font-size: 16px;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
  }
`;

const Footer = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme?.colors?.border || 'rgba(255, 255, 255, 0.02)'};
  text-align: center;
  font-size: 11px;
  color: ${props => props.theme?.colors?.textMuted || '#4a4f5e'};
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;

// ============================================
// COURSE DATA – DERIV (25 comprehensive lessons)
// ============================================
const derivLessons = [
  {
    id: 1,
    title: "Welcome to Trading: The Basics",
    duration: "45 min",
    content: `
      <h3>What is Trading, Really?</h3>
      <p>Trading is simply the exchange of one asset for another with the goal of making a profit. It's as old as civilization itself. In modern financial markets, you can trade currencies, commodities, indices, and more without ever physically owning them. The profit comes from correctly predicting the direction of price movement.</p>
      <p>Think of it like buying a used car at a low price and selling it for a higher price. The difference is your profit. In trading, you're doing the same thing but with financial instruments, and you can do it much faster – sometimes in seconds.</p>
      <div class="highlight-box">
        <strong>Core Concept:</strong> Trading = Buying Low + Selling High<br>
        or<br>
        Trading = Selling High + Buying Low (short selling, available on some platforms like Deriv)
      </div>
      <h3>Why Trade?</h3>
      <p>People trade for many reasons: to grow their savings, to achieve financial independence, or simply for the intellectual challenge. The markets offer opportunities 24 hours a day, 5 days a week, and can be accessed from anywhere with an internet connection.</p>
      <p>Unlike traditional jobs, trading isn't limited by location or a fixed salary. Your earnings are directly tied to your skill and discipline. That's both the appeal and the danger.</p>
      <h3>Can Anyone Learn to Trade?</h3>
      <p>Yes, absolutely. Trading is a skill like any other – it can be learned through study, practice, and experience. You don't need a degree in finance or a special background. What you do need is patience, emotional control, and a willingness to treat trading as a business, not a gamble.</p>
      <p>Many of the world's most successful traders started as complete beginners. The key is to approach the learning process systematically and never stop improving.</p>
      <h3>The Difference Between Trading and Gambling</h3>
      <p>Gambling relies purely on chance. In a casino, the odds are mathematically stacked against you, and no amount of skill can change that. Trading, on the other hand, allows you to use analysis, strategy, and risk management to tilt the odds in your favor.</p>
      <p>Successful traders don't "bet" on outcomes; they identify high-probability setups and manage their risk so that over a large number of trades, they come out ahead. That's why trading is often called "speculation" – you're speculating based on information, not guessing blindly.</p>
      <h3>What You'll Learn in This Course</h3>
      <p>This comprehensive Deriv trading course will take you from absolute beginner to confident trader. We'll cover:</p>
      <ul>
        <li><strong>Module 1:</strong> The foundations of trading and financial markets</li>
        <li><strong>Module 2:</strong> Understanding Deriv's platform, accounts, and trade types</li>
        <li><strong>Module 3:</strong> Reading charts and technical analysis</li>
        <li><strong>Module 4:</strong> Advanced strategies and risk management</li>
        <li><strong>Module 5:</strong> Trading psychology and business plan</li>
      </ul>
      <p>By the end, you'll have a complete toolkit to start your trading journey with a solid foundation.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Trading is a skill that can be mastered through education and discipline. It's not gambling when done correctly.</div>
    `
  },
  {
    id: 2,
    title: "Understanding Financial Markets",
    duration: "50 min",
    content: `
      <h3>What Are Financial Markets?</h3>
      <p>Financial markets are platforms where buyers and sellers exchange assets like currencies, stocks, commodities, and derivatives. They serve three main purposes: to facilitate trade, to provide liquidity, and to allow price discovery (determining what an asset is worth based on supply and demand).</p>
      <p>Think of a farmers' market: farmers bring produce, buyers negotiate prices, and transactions happen openly. The same principle applies to financial markets, but on a global scale and with electronic systems.</p>
      <h3>Types of Markets You Can Trade</h3>
      <h4>1. Forex (Foreign Exchange)</h4>
      <p>The largest and most liquid market in the world, with over $7 trillion traded daily. It involves exchanging one currency for another. Currencies are always traded in pairs (e.g., EUR/USD). The price reflects how much of the quote currency is needed to buy one unit of the base currency.</p>
      <p>Forex is open 24 hours a day, 5 days a week, and is influenced by economic data, interest rates, and geopolitical events.</p>
      <h4>2. Commodities</h4>
      <p>Physical goods such as gold, silver, oil, natural gas, and agricultural products. Commodity prices are driven by supply and demand factors: weather, mining output, political instability, and global economic health.</p>
      <p>For example, if a hurricane disrupts oil production in the Gulf of Mexico, the price of crude oil may spike due to reduced supply.</p>
      <h4>3. Indices</h4>
      <p>A stock index tracks the performance of a group of stocks. Examples include the S&P 500 (US), FTSE 100 (UK), and Nikkei 225 (Japan). Trading an index means you're speculating on the overall movement of that market rather than individual stocks.</p>
      <h4>4. Cryptocurrencies</h4>
      <p>Digital assets like Bitcoin and Ethereum. They're known for extreme volatility and 24/7 trading. While they can offer large gains, they also carry significant risk due to regulatory uncertainty and market sentiment swings.</p>
      <h4>5. Volatility Indices (Deriv Exclusive)</h4>
      <p>These are synthetic indices created by Deriv to simulate different levels of market volatility. They're not affected by real-world news, making them a unique trading instrument for practicing or implementing strategies in a controlled environment.</p>
      <h3>Why Volatility Indices are Special</h3>
      <p>Volatility indices are based on mathematical formulas that produce a continuous stream of random numbers with a specified volatility. This means they have no gaps, no news events, and no external influences. They're perfect for backtesting strategies and for trading when major forex markets are closed.</p>
      <p>The indices are named after their volatility level: 10, 25, 50, 75, 100. The higher the number, the faster and more dramatic the price movements.</p>
      <table>
        <tr><th>Index</th><th>Average Movement (ticks/min)</th><th>Recommended Trader Level</th></tr>
        <tr><td>Volatility 10</td><td>50-100</td><td>Absolute Beginner</td></tr>
        <tr><td>Volatility 25</td><td>100-200</td><td>Beginner</td></tr>
        <tr><td>Volatility 50</td><td>200-300</td><td>Intermediate</td></tr>
        <tr><td>Volatility 75</td><td>300-400</td><td>Advanced</td></tr>
        <tr><td>Volatility 100</td><td>400+</td><td>Expert</td></tr>
      </table>
      <div class="highlight-box">
        <strong>Tip:</strong> Always start with the lowest volatility and work your way up. Many traders never trade above 25.
      </div>
      <h3>Market Participants</h3>
      <p>Who moves the markets? The main players include:</p>
      <ul>
        <li><strong>Central Banks:</strong> They set interest rates and monetary policy, which directly impact currency values.</li>
        <li><strong>Institutional Investors:</strong> Pension funds, hedge funds, and mutual funds that trade huge volumes.</li>
        <li><strong>Corporations:</strong> Companies that need to exchange currencies for international business.</li>
        <li><strong>Retail Traders:</strong> Individuals like you and me, trading from home with a computer and internet.</li>
      </ul>
      <p>As a retail trader, your goal is not to fight the giants but to ride the waves they create.</p>
      <h3>Market Hours and Sessions</h3>
      <p>Forex and many other markets operate in three main sessions: Asian (Tokyo), European (London), and American (New York). The overlap between London and New York (8:00 AM – 12:00 PM EST) is the most active period, often producing the largest moves.</p>
      <p>Volatility indices, however, trade 24/7, so you can practice anytime.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Understand the markets you're trading. Each has unique characteristics and driving factors. Start with volatility indices for a controlled learning environment.</div>
    `
  },
  {
    id: 3,
    title: "Introduction to Deriv",
    duration: "40 min",
    content: `
      <h3>What is Deriv?</h3>
      <p>Deriv is an online trading platform founded in 1999. Originally known as Binary.com, it rebranded to Deriv in 2020 to reflect a broader range of trading instruments. The company is regulated by multiple authorities, including the Malta Financial Services Authority (MFSA), the Labuan Financial Services Authority (Malaysia), and the Vanuatu Financial Services Commission.</p>
      <p>Deriv offers a user-friendly environment for both beginners and experienced traders. It provides three main trading platforms: Deriv Trader (formerly DTrader), Deriv Bot (for automated trading), and Deriv X (advanced CFD trading).</p>
      <h3>Deriv Trader – The Entry-Level Platform</h3>
      <p>Deriv Trader is the simplest platform. It focuses on "options trading" (also called digital options or contracts for difference with fixed durations). You can choose from various trade types like Over/Under, Even/Odd, Matches/Differs, and Touch/No Touch.</p>
      <p>The platform has a clean interface: a chart, trade buttons, and a panel to select trade parameters. You don't need to set stop-losses or take-profits manually; each trade has a predetermined payout and loss limit.</p>
      <h4>Key Features of Deriv Trader:</h4>
      <ul>
        <li>Trade durations from 1 tick to several hours</li>
        <li>Payouts up to 90% or more on some contracts</li>
        <li>Mobile app (Deriv GO) for trading on the go</li>
        <li>Demo account with $10,000 virtual money</li>
        <li>Multiple chart types and indicators</li>
      </ul>
      <h3>Deriv X – Advanced CFD Trading</h3>
      <p>Deriv X is for experienced traders who want more control. It allows you to trade CFDs (Contracts for Difference) on forex, commodities, crypto, and synthetic indices with customizable leverage, stop-loss, and take-profit.</p>
      <p>The platform is web-based with a customizable layout, over 90 indicators, and multiple order types (market, limit, stop).</p>
      <h3>Deriv Bot – Automated Trading</h3>
      <p>Deriv Bot lets you create trading robots using a simple drag-and-drop interface. You can automate your strategies without coding. It's great for testing ideas and executing trades while you sleep.</p>
      <h3>Account Types</h3>
      <p>Deriv offers several account types:</p>
      <ul>
        <li><strong>Demo Account:</strong> Virtual money, same market conditions. Perfect for learning.</li>
        <li><strong>Real Money Account:</strong> Standard account for live trading. Minimum deposit is as low as $5.</li>
        <li><strong>Financial Account:</strong> For trading forex and CFDs on Deriv X.</li>
        <li><strong>Synthetic Account:</strong> For trading volatility indices and other synthetic products.</li>
      </ul>
      <p>It's recommended to start with a demo account and switch to real only after consistent profitability for at least one month.</p>
      <h3>Deposits and Withdrawals</h3>
      <p>Deriv supports various payment methods: bank transfer, credit/debit cards, e-wallets (Skrill, Neteller, Perfect Money), and cryptocurrencies. Withdrawals are usually processed within 24 hours. For Kenyan users, M‑Pesa is a popular method.</p>
      <h3>Getting Started</h3>
      <p>Create an account at deriv.com, verify your email, and log into the demo platform. Spend at least 10 hours familiarizing yourself with the interface before placing your first trade.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Deriv provides multiple platforms for different skill levels. Start with Deriv Trader demo, then explore as you progress.</div>
    `
  },
  {
    id: 4,
    title: "Supply, Demand, and Price Action",
    duration: "55 min",
    content: `
      <h3>The Fundamental Law of Economics</h3>
      <p>Every price you see on a chart is the result of supply and demand. When more people want to buy an asset than sell it (demand > supply), the price goes up. When more people want to sell than buy (supply > demand), the price goes down.</p>
      <p>This is not a theory; it's a fact. All technical analysis and indicators are simply tools to measure supply and demand in different ways.</p>
      <h4>What Causes Demand to Increase?</h4>
      <ul>
        <li>Positive news about the asset (e.g., good earnings report, economic growth)</li>
        <li>Low interest rates (investors seek higher returns)</li>
        <li>Market sentiment shifting to "risk-on"</li>
        <li>Technical patterns indicating a potential rise (attracting more buyers)</li>
      </ul>
      <h4>What Causes Supply to Increase?</h4>
      <ul>
        <li>Negative news (e.g., recession fears, political instability)</li>
        <li>High interest rates (investors move to safer assets)</li>
        <li>Profit-taking by existing holders</li>
        <li>Technical breakdowns (triggering sell stops)</li>
      </ul>
      <h3>Price Action – Reading the Footprint</h3>
      <p>Price action is the study of raw price movement without indicators. It's based on the idea that all information is reflected in the price itself. Candlestick charts are the most common way to visualize price action.</p>
      <p>Each candlestick represents a specific time period (e.g., 1 minute, 5 minutes, 1 hour). It shows the open, high, low, and close prices. The body's color tells you if the close was higher (green/white) or lower (red/black) than the open.</p>
      <h4>The Psychology Behind Candlesticks</h4>
      <p>A long green candle indicates strong buying pressure. Sellers tried to push price down (lower wick) but buyers ultimately won, pushing price close to the high. A long red candle shows strong selling pressure.</p>
      <p>Wicks (shadows) represent rejection. A long upper wick means price was pushed up but sellers came in strong and pushed it back down – a potential reversal signal if at a resistance level.</p>
      <h3>Support and Resistance – The Building Blocks</h3>
      <p>Support is a price level where buying interest is strong enough to overcome selling pressure, causing price to "bounce" up. Resistance is the opposite – a level where selling overwhelms buying, forcing price down.</p>
      <p>These levels are not exact lines but zones. The more times a level has been tested and held, the stronger it becomes. When a level breaks, it often switches roles (support becomes resistance and vice versa).</p>
      <h4>How to Identify Support and Resistance</h4>
      <ul>
        <li>Look for areas where price has reversed multiple times.</li>
        <li>Use swing highs and swing lows on the chart.</li>
        <li>Psychological round numbers (e.g., 1.1000 on EUR/USD) often act as levels.</li>
        <li>Moving averages can act as dynamic support/resistance.</li>
      </ul>
      <div class="example-box">
        <strong>Example:</strong> On a 5-minute chart of Volatility 25, price bounces off 8,450 three times in an hour. That's a strong support. If price breaks below 8,450 with a large red candle, that support is broken, and it may now act as resistance.
      </div>
      <h3>Trendlines – Drawing the Path</h3>
      <p>A trendline connects two or more swing points. An upward sloping trendline (connecting higher lows) indicates an uptrend. A downward sloping line (connecting lower highs) indicates a downtrend. The angle of the trendline shows the strength of the trend.</p>
      <p>Breaking a trendline can signal a potential reversal or acceleration of the trend.</p>
      <h3>Putting It All Together</h3>
      <p>Successful trading often involves combining support/resistance and price action. For example, if price is approaching a known resistance level and a bearish engulfing pattern forms, that's a high-probability sell signal.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Master supply and demand. Learn to read candlesticks, support/resistance, and trendlines. These three elements form the foundation of technical analysis.</div>
    `
  },
  {
    id: 5,
    title: "Trade Types on Deriv Trader",
    duration: "60 min",
    content: `
      <h3>Overview of Trade Types</h3>
      <p>Deriv Trader offers several contract types, each with unique characteristics. Understanding them is crucial because your strategy must match the trade type. Let's dive deep into each.</p>
      <h4>1. Over/Under (Rise/Fall)</h4>
      <p>This is the most popular contract. You predict whether the price at the end of the contract will be higher (Over) or lower (Under) than the entry price. It's a directional bet.</p>
      <p><strong>Duration:</strong> From 1 tick to 10 ticks (on volatility indices) or longer on other markets.</p>
      <p><strong>Payout:</strong> Typically 80-90% of your stake if correct. If wrong, you lose your stake.</p>
      <h5>When to Choose Over/Under</h5>
      <ul>
        <li>When you have a strong directional bias based on analysis.</li>
        <li>In trending markets.</li>
        <li>When a breakout or breakdown occurs.</li>
      </ul>
      <h5>Common Mistakes</h5>
      <ul>
        <li>Trading against the trend.</li>
        <li>Using too long a duration during high volatility (overexposure).</li>
        <li>Not considering the tick size and spread.</li>
      </ul>
      <h4>2. Even/Odd</h4>
      <p>Predict whether the last digit of the price at expiry will be even (0,2,4,6,8) or odd (1,3,5,7,9). It's completely random, with a 50% probability per trade. The payout is usually lower (around 80%) because the probability is high.</p>
      <p><strong>Strategy:</strong> Some traders use statistical approaches (looking for streaks), but in reality, each outcome is independent. This trade type is more for entertainment than serious income.</p>
      <h4>3. Matches/Differs</h4>
      <p>You select a specific digit (0-9) and predict whether the last digit will match (Matches) or differ (Differs).</p>
      <ul>
        <li><strong>Matches:</strong> 10% probability, high payout (~8x).</li>
        <li><strong>Differs:</strong> 90% probability, low payout (~1.1x).</li>
      </ul>
      <p>Differs is often used as a building block for compounding strategies because of the high win rate. But one losing trade can wipe out several wins if not risk-managed.</p>
      <h5>Example:</h5>
      <p>If you choose digit 7 and "Differs", you win if the last digit is anything but 7. Over 10 trades, you'd expect 9 wins and 1 loss. If each win gives 10% profit, but a loss is 100% of stake, you end up slightly negative unless you adjust stake sizing.</p>
      <h4>4. Touch/No Touch</h4>
      <p>Here, you set a target price. You win if the price touches that target at any point during the contract (Touch) or if it never touches it (No Touch).</p>
      <p><strong>Duration:</strong> Typically longer (minutes to hours).</p>
      <p>This trade type is excellent for range-bound markets. If you see a strong support and resistance, you can bet on No Touch for a price outside that range.</p>
      <h4>5. High/Low (Barrier)</h4>
      <p>Similar to Over/Under, but you set a specific barrier price. If the price closes above (or below) that barrier, you win. Payouts vary based on barrier distance.</p>
      <h3>Choosing the Right Trade Type</h3>
      <p>Your choice should depend on your market analysis. If you expect a strong trend, Over/Under is suitable. If the market is ranging, No Touch or Differs might work. Always align the trade type with your market outlook.</p>
      <h3>Risk Across Trade Types</h3>
      <p>All trade types on Deriv Trader have a fixed maximum loss (your stake) and fixed potential profit. This is different from standard forex where losses can exceed your deposit. That makes Deriv Trader a good learning ground because you can't lose more than you put in.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Master Over/Under first. It's the most straightforward and teaches you directional analysis. Then explore others based on your market conditions.</div>
    `
  },
  {
    id: 6,
    title: "Candlestick Patterns – A Complete Guide",
    duration: "70 min",
    content: `
      <h3>Why Candlestick Patterns Matter</h3>
      <p>Candlesticks are the language of the market. Each pattern tells a story of the battle between buyers and sellers. Learning to read them gives you a significant edge because you can spot reversals and continuations before they happen.</p>
      <p>This lesson covers the most important patterns, their psychology, and how to trade them effectively on Deriv.</p>
      <h3>Single Candlestick Patterns</h3>
      <h4>1. Doji</h4>
      <p>Open and close are almost equal. It signifies indecision. When a doji appears after a strong trend, it could indicate a potential reversal. There are several types: dragonfly doji (long lower wick, bullish), gravestone doji (long upper wick, bearish), and long-legged doji.</p>
      <h4>2. Marubozu</h4>
      <p>A candle with no or very short wicks, indicating strong momentum. A green marubozu shows buyers controlled the entire period. A red marubozu shows sellers dominated. Continuation likely.</p>
      <h4>3. Hammer and Shooting Star</h4>
      <p>A hammer occurs in a downtrend: small body, long lower wick (at least twice the body), little upper wick. It suggests that sellers pushed price down but buyers stepped in and pushed it back up – potential reversal up.</p>
      <p>A shooting star occurs in an uptrend: small body, long upper wick, little lower wick. Sellers rejected higher prices, potential reversal down.</p>
      <h3>Two-Candle Patterns</h3>
      <h4>1. Bullish Engulfing</h4>
      <p>A small red candle followed by a large green candle that completely engulfs the previous candle's body. It indicates a strong shift from selling to buying. More reliable at support levels.</p>
      <h4>2. Bearish Engulfing</h4>
      <p>Small green followed by large red that engulfs it. Signals shift to selling. Reliable at resistance.</p>
      <h4>3. Piercing Line</h4>
      <p>Similar to engulfing but the green candle opens below the previous close and closes above the midpoint of the prior red body. Bullish reversal.</p>
      <h4>4. Dark Cloud Cover</h4>
      <p>Green candle followed by a red that opens above the prior close and closes below the midpoint of the green body. Bearish reversal.</p>
      <h3>Three-Candle Patterns</h3>
      <h4>1. Morning Star</h4>
      <p>A bottom reversal pattern: long red candle, small-body candle (could be doji) that gaps down, then long green candle that closes well into the first red body. Strong buy signal.</p>
      <h4>2. Evening Star</h4>
      <p>Top reversal: long green, small body, long red that closes deep into the first green. Strong sell signal.</p>
      <h4>3. Three White Soldiers</h4>
      <p>Three consecutive long green candles, each closing higher. Indicates strong uptrend and continuation.</p>
      <h4>4. Three Black Crows</h4>
      <p>Three long red candles, each closing lower. Strong downtrend.</p>
      <h3>Combining Patterns with Support/Resistance</h3>
      <p>A pattern is much more powerful when it appears at a key level. For example, a morning star forming at a major support level gives a high-probability trade. Conversely, patterns in the middle of a range have less significance.</p>
      <p>Always wait for confirmation. For a bullish reversal pattern, wait for the next candle to close above the pattern's high before entering. This reduces false signals.</p>
      <h3>Practical Exercise</h3>
      <p>Open a demo chart on Volatility 10. Scroll back and try to identify at least 5 of the patterns discussed. Note where they occurred and what happened next. This practice builds pattern recognition, which is critical for live trading.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Candlestick patterns are powerful, but they must be used in context with support/resistance and trend analysis. Practice identifying them until they become second nature.</div>
    `
  },
  {
    id: 7,
    title: "Technical Indicators Deep Dive – Part 1",
    duration: "65 min",
    content: `
      <h3>What Are Technical Indicators?</h3>
      <p>Indicators are mathematical calculations based on price and/or volume. They help you analyze trends, momentum, volatility, and market strength. While they shouldn't be used in isolation, they add confirmation to your price action analysis.</p>
      <p>Indicators fall into four main categories: trend-following, oscillators, volatility, and volume. This lesson covers trend indicators and oscillators.</p>
      <h3>Trend Indicators</h3>
      <h4>1. Moving Averages (MA)</h4>
      <p>A moving average smooths price data by creating a constantly updated average price. It's one of the most popular indicators.</p>
      <ul>
        <li><strong>Simple Moving Average (SMA):</strong> Arithmetic mean of closing prices over a period.</li>
        <li><strong>Exponential Moving Average (EMA):</strong> Gives more weight to recent prices, making it more responsive.</li>
      </ul>
      <p><strong>Common periods:</strong></p>
      <ul>
        <li>20 MA – short-term trend</li>
        <li>50 MA – intermediate trend</li>
        <li>200 MA – long-term trend</li>
      </ul>
      <p><strong>Usage:</strong> In an uptrend, price tends to stay above the MA. In a downtrend, below. Crossovers (e.g., 20 EMA crossing above 50 EMA) generate buy/sell signals.</p>
      <h5>Golden Cross and Death Cross</h5>
      <p>When the 50 MA crosses above the 200 MA, it's a "Golden Cross" – a strong bullish signal. When 50 crosses below 200, it's a "Death Cross" – bearish. These are long-term signals.</p>
      <h4>2. Parabolic SAR</h4>
      <p>Places dots on the chart to indicate potential reversals. When dots are below price, it's an uptrend; above, a downtrend. Good for trailing stops but can give false signals in choppy markets.</p>
      <h3>Oscillators</h3>
      <p>Oscillators move within a bounded range, typically 0-100. They help identify overbought/oversold conditions and momentum shifts.</p>
      <h4>1. Relative Strength Index (RSI)</h4>
      <p>Measures the speed and change of price movements. Ranges from 0 to 100.</p>
      <ul>
        <li><strong>Overbought:</strong> Above 70 – price may be due for a pullback.</li>
        <li><strong>Oversold:</strong> Below 30 – price may be due for a bounce.</li>
        <li><strong>Divergence:</strong> Price makes a new high but RSI makes a lower high → bearish divergence (possible reversal). Opposite for bullish divergence.</li>
      </ul>
      <p>RSI works best in ranging markets. In strong trends, it can stay overbought or oversold for long periods.</p>
      <h4>2. Stochastic Oscillator</h4>
      <p>Compares a closing price to its price range over a given period. Two lines: %K (fast) and %D (slow). Overbought >80, oversold <20. Crossovers of the two lines give signals. Divergence also works.</p>
      <h4>3. Moving Average Convergence Divergence (MACD)</h4>
      <p>Consists of the MACD line (difference between 12 and 26 EMA) and a signal line (9 EMA of MACD). The histogram shows the difference.</p>
      <ul>
        <li><strong>Signal:</strong> MACD line crosses above signal line → buy.</li>
        <li><strong>Zero line crossover:</strong> MACD moves above zero → bullish momentum.</li>
        <li><strong>Divergence:</strong> Price making higher high, MACD making lower high → bearish divergence.</li>
      </ul>
      <p>MACD is both a trend and momentum indicator.</p>
      <h3>How to Use Indicators Without Overloading</h3>
      <p>Many beginners make the mistake of putting 5+ indicators on their chart, leading to "analysis paralysis". Instead, choose one trend indicator (e.g., 50 EMA) and one oscillator (e.g., RSI). That's enough to start.</p>
      <p>Always base your final decision on price action. Indicators are secondary.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Use indicators to confirm, not to predict. Keep it simple. Trend indicator + oscillator + price action = solid strategy.</div>
    `
  },
  {
    id: 8,
    title: "Technical Indicators Deep Dive – Part 2",
    duration: "60 min",
    content: `
      <h3>Volatility Indicators</h3>
      <p>Volatility indicators measure the rate of price movement, not direction. They help you adjust your strategy to current market conditions.</p>
      <h4>1. Bollinger Bands</h4>
      <p>Created by John Bollinger, these consist of a middle band (usually 20 SMA) and two outer bands (2 standard deviations). The bands widen during high volatility and contract during low volatility.</p>
      <ul>
        <li><strong>Bollinger Squeeze:</strong> When bands narrow, a breakout is likely. You can prepare for a trade in either direction.</li>
        <li><strong>Walking the Bands:</strong> In a strong trend, price may "walk" the upper or lower band. This indicates trend continuation, not necessarily overbought/oversold.</li>
        <li><strong>Bounce off bands:</strong> In a ranging market, price often reverses after touching a band.</li>
      </ul>
      <h4>2. Average True Range (ATR)</h4>
      <p>ATR measures average volatility over a given period (commonly 14). It doesn't show direction, just how much the price typically moves. Use ATR to set stop-loss distances. If ATR is 50 pips, setting a stop 30 pips away would likely get hit by normal noise.</p>
      <h4>3. Keltner Channels</h4>
      <p>Similar to Bollinger Bands but uses ATR for width. Often combined with Bollinger Bands for squeeze identification.</p>
      <h3>Volume Indicators</h3>
      <p>Volume in forex is not the actual volume (since there's no central exchange) but tick volume (number of price changes). On volatility indices, tick volume can still provide useful information.</p>
      <h4>1. Volume (Tick Volume)</h4>
      <p>High volume during a move indicates strong participation and confirms the trend. Low volume suggests a weak move. Volume spikes at support/resistance often precede reversals.</p>
      <h4>2. On-Balance Volume (OBV)</h4>
      <p>OBV adds volume on up days and subtracts on down days, creating a cumulative line. Divergence between OBV and price can signal trend weakness. For example, price rising but OBV falling suggests the uptrend may not be sustainable.</p>
      <h3>Combining Indicators: The Power of Confluence</h3>
      <p>Confluence means multiple indicators or analysis methods pointing to the same conclusion. For example, if:</p>
      <ul>
        <li>Price is at a major support level</li>
        <li>RSI is oversold (below 30)</li>
        <li>Bollinger Bands are at the lower band</li>
        <li>A bullish engulfing pattern forms</li>
      </ul>
      <p>That's high confluence, and a buy trade has a higher probability of success. The more confirmations, the better, but don't overcomplicate.</p>
      <h3>Indicator Settings and Customization</h3>
      <p>Default settings work for most traders, but you can adjust. For example, in choppy markets, using a longer period for RSI (21 instead of 14) can reduce false signals. Experiment on demo to find what works for your trading style.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Understand the purpose of each indicator. Use volatility indicators to gauge market energy, volume to confirm strength, and always seek confluence.</div>
    `
  },
  {
    id: 9,
    title: "Chart Patterns for Trend Continuation and Reversal",
    duration: "70 min",
    content: `
      <h3>Chart Patterns Overview</h3>
      <p>Chart patterns are formations created by price movements that signal either a continuation of the current trend or a reversal. They take longer to form than candlestick patterns and offer more reliable trading opportunities.</p>
      <p>We'll divide them into two categories: reversal patterns and continuation patterns.</p>
      <h3>Reversal Patterns</h3>
      <h4>1. Head and Shoulders</h4>
      <p>One of the most reliable bearish reversal patterns. It consists of three peaks: the left shoulder, the head (highest), and the right shoulder. The neckline connects the lows between the peaks. When price breaks below the neckline, it signals a bearish reversal.</p>
      <p><strong>Target:</strong> Measure the distance from the head to the neckline and project that downward from the breakout point.</p>
      <p><strong>Inverse Head and Shoulders:</strong> Same but upside down, indicating a bullish reversal.</p>
      <h4>2. Double Top and Double Bottom</h4>
      <p>Double top: Two peaks at roughly the same level, indicating resistance. Break below the valley (support) confirms reversal. Target: distance from peaks to valley projected downward.</p>
      <p>Double bottom: Two troughs, breaks above resistance, bullish.</p>
      <h4>3. Triple Top/Bottom</h4>
      <p>Same concept as double but with three touches. More reliable but rarer.</p>
      <h4>4. Rounding Bottom (Saucer)</h4>
      <p>Gradual shift from downtrend to uptrend, forming a rounded shape. The breakout above the rim confirms.</p>
      <h3>Continuation Patterns</h3>
      <h4>1. Triangles</h4>
      <ul>
        <li><strong>Ascending Triangle:</strong> Flat top, rising bottom line. Bullish continuation.</li>
        <li><strong>Descending Triangle:</strong> Flat bottom, descending top line. Bearish continuation.</li>
        <li><strong>Symmetrical Triangle:</strong> Converging lines, can break either way. Best to wait for breakout.</li>
      </ul>
      <p>Breakout from a triangle often occurs before the apex. Volume should confirm the breakout.</p>
      <h4>2. Flags and Pennants</h4>
      <p>Short-term consolidation after a strong move. Flag: rectangular channel sloping against the trend. Pennant: small symmetrical triangle. They indicate the trend will resume after the pause.</p>
      <p>Entry: when price breaks out of the flag/pennant in the direction of the prior trend.</p>
      <h4>3. Wedges</h4>
      <ul>
        <li><strong>Rising Wedge:</strong> Both lines slope up, converging. Bearish reversal if after an uptrend.</li>
        <li><strong>Falling Wedge:</strong> Both lines slope down, converging. Bullish reversal if after a downtrend.</li>
      </ul>
      <h4>4. Cup and Handle</h4>
      <p>A bullish continuation pattern shaped like a teacup. The "cup" is a rounding bottom, and the "handle" is a small downward drift or consolidation. Breakout above the handle's resistance triggers a buy.</p>
      <h3>How to Trade Patterns on Deriv</h3>
      <p>Because Deriv Trader uses fixed durations, you need to consider the time it takes for a pattern to play out. Touch/No Touch contracts are excellent for pattern breakouts: set a target at the pattern's projected target and choose "Touch". For Over/Under, wait for the breakout candle to close beyond the pattern, then enter in the direction of the breakout with a short duration.</p>
      <p>Always place a mental stop (or use Touch/No Touch as a risk management tool).</p>
      <h3>Pattern Reliability</h3>
      <p>No pattern works 100% of the time. Patterns on higher timeframes (1H, 4H) are more reliable than on 1-minute charts. The longer the pattern forms, the stronger the potential move.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Learn to identify these patterns on a chart. They provide a roadmap for potential price moves. Combine with support/resistance for best results.</div>
    `
  },
  {
    id: 10,
    title: "Risk Management – The Secret to Survival",
    duration: "60 min",
    content: `
      <h3>Why Risk Management is Everything</h3>
      <p>You can have a 60% win rate and still lose money if you don't manage your risk. Conversely, a 40% win rate can be profitable with proper risk/reward. Risk management separates amateurs from professionals.</p>
      <p>In trading, your number one job is to protect your capital. Without capital, you can't trade.</p>
      <h3>The 2% Rule</h3>
      <p>Never risk more than 2% of your total account on a single trade. If you have $1,000, your maximum loss per trade should be $20. This rule ensures that even a series of losses won't wipe you out.</p>
      <p>Why 2%? Because losing streaks happen. Here's the math: if you risk 2% per trade and lose 10 trades in a row, you'll still have about 82% of your account left. Risk 10% per trade and 10 losses leave you with only 35%. Recovery becomes nearly impossible.</p>
      <div class="example-box">
        <strong>Account: $1,000</strong><br>
        Risking 2%: $20 per trade. After 5 losses: $900 (down 10%). You need about 11% gain to recover.<br>
        Risking 10%: $100 per trade. After 5 losses: $500 (down 50%). You need 100% gain to recover! This is why high risk kills accounts.
      </div>
      <h3>The 6% Daily Loss Rule</h3>
      <p>If you lose 6% of your account in one day, stop trading immediately. This prevents emotional revenge trading. For a $1,000 account, that's $60. Once you hit that limit, log off and come back tomorrow with a fresh mind.</p>
      <h3>Position Sizing</h3>
      <p>On Deriv Trader, your "stake" is the amount you risk per trade. That stake should always be calculated based on your account size and risk percentage.</p>
      <p>Example: Account $500, risk 2% = $10 per trade. That's your max stake regardless of how "sure" you feel about a trade.</p>
      <h3>Risk/Reward Ratio</h3>
      <p>This is the relationship between how much you risk and how much you stand to gain. In Over/Under contracts on Deriv, the payout is often around 80-90%, meaning if you risk $10, you can win $18-19. The reward is 1.8-1.9 times the risk – a very good ratio.</p>
      <p>However, that doesn't mean you should take every trade. You must still have an edge. The payout alone doesn't guarantee profitability; win rate matters too.</p>
      <h3>Drawdowns and Recovery</h3>
      <p>A drawdown is the reduction of your account from its peak. For example, if you grow $1,000 to $1,200 and then drop to $1,100, your drawdown is 8.3% from the peak. The larger the drawdown, the harder it is to recover. Keep drawdowns small.</p>
      <h3>Risk Management Checklist Before Every Trade</h3>
      <ul>
        <li>Am I risking exactly 2% of my account?</li>
        <li>Have I reached my daily loss limit?</li>
        <li>Is there a clear reason for this trade (setup, pattern)?</li>
        <li>Am I calm and rational, not emotional?</li>
      </ul>
      <p>If you can't answer yes to all, don't place the trade.</p>
      <h3>Using a Trade Journal for Risk Control</h3>
      <p>Write down every trade: the setup, the stake, the result, and your emotional state. Reviewing your journal helps you identify patterns – maybe you tend to overtrade after a win, or you increase stakes after a loss. Data doesn't lie.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Risk management is non-negotiable. Follow the 2% rule, set daily loss limits, and keep a journal. This discipline will keep you in the game long enough to become profitable.</div>
    `
  },
  {
    id: 11,
    title: "Trading Psychology: Mastering Your Mind",
    duration: "55 min",
    content: `
      <h3>The Mental Game</h3>
      <p>Your psychology is 50% of your success. The markets are a reflection of collective human emotion – fear, greed, hope, and despair. If you can't manage your own emotions, the market will manage them for you.</p>
      <h3>The Four Major Emotions in Trading</h3>
      <h4>1. Fear</h4>
      <p>Fear of losing money, fear of missing out (FOMO), fear of being wrong. Fear causes you to exit winning trades too early, avoid taking valid signals, or freeze and do nothing.</p>
      <p><strong>Solution:</strong> Accept that losses are part of trading. If you have a proven strategy and follow risk management, one loss means nothing. Trust your system.</p>
      <h4>2. Greed</h4>
      <p>Greed makes you over-leverage, hold trades too long hoping for a bigger win, or take trades outside your plan because you see potential profit.</p>
      <p><strong>Solution:</strong> Set profit targets and stick to them. Remember, small consistent gains compound. A 5% monthly return doubles your account in about 14 months.</p>
      <h4>3. Overconfidence</h4>
      <p>After a winning streak, you might feel invincible and increase your risk. This usually leads to a big loss that wipes out previous gains.</p>
      <p><strong>Solution:</strong> Stay humble. The market doesn't care about your past wins. Stick to your rules regardless of recent performance.</p>
      <h4>4. Revenge Trading</h4>
      <p>The urge to immediately recover a loss by placing a bigger trade. This is the fastest way to blow an account.</p>
      <p><strong>Solution:</strong> Have a mandatory cooling-off period after a loss. Step away from the screen for at least 15 minutes. Remind yourself that tomorrow is another day.</p>
      <h3>Building a Trading Routine</h3>
      <p>Consistency comes from routine. Here's a sample daily schedule:</p>
      <ol>
        <li><strong>Pre-market:</strong> Review economic calendar, check your plan, do a brief meditation or breathing exercise.</li>
        <li><strong>Trading session:</strong> Follow your strategy, take only high-probability setups, log each trade.</li>
        <li><strong>Post-session:</strong> Review your journal, calculate win rate and P&L, identify mistakes, and plan for the next session.</li>
      </ol>
      <h3>Visualization and Affirmations</h3>
      <p>Many successful traders use mental rehearsal. Before trading, close your eyes and visualize yourself calmly executing your plan, accepting losses, and walking away when the daily limit is hit. Affirmations like "I am a disciplined trader" can reprogram your subconscious.</p>
      <h3>The Importance of Health</h3>
      <p>Physical health impacts mental clarity. Exercise, sleep, and diet affect decision-making. Don't trade when tired or hungry. Treat trading like a performance sport.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Your mind is your biggest asset or your biggest liability. Develop emotional discipline through routine, journaling, and self-awareness.</div>
    `
  },
  {
    id: 12,
    title: "Building Your Trading Plan",
    duration: "50 min",
    content: `
      <h3>What is a Trading Plan?</h3>
      <p>A trading plan is a written document that outlines your trading rules, goals, and methods. It's your business plan. Without it, you're gambling.</p>
      <h3>Components of a Robust Plan</h3>
      <h4>1. Trading Goals</h4>
      <p>Define what you want to achieve: e.g., "I will achieve a 55% win rate with a 1.8 reward/risk ratio over 100 trades, resulting in a 5% monthly return." Make goals specific, measurable, and realistic.</p>
      <h4>2. Market and Instrument</h4>
      <p>Specify exactly what you'll trade. Example: "I will trade only Volatility 25 index, using the Over/Under contract type with a duration of 1 tick."</p>
      <h4>3. Entry Criteria</h4>
      <p>Describe the exact conditions that must be present to enter a trade. Example: "Enter an UP trade when the 5 EMA crosses above 20 EMA, RSI > 50, and a bullish engulfing pattern forms near support."</p>
      <h4>4. Exit Criteria</h4>
      <p>On Deriv Trader, the exit is predetermined by contract expiry, but you still need criteria for when NOT to trade. Also, if using Deriv X, define stop-loss and take-profit rules.</p>
      <h4>5. Risk Management Rules</h4>
      <ul>
        <li>Max stake per trade: 2% of account.</li>
        <li>Max trades per day: 5.</li>
        <li>Daily loss limit: 6%.</li>
        <li>Weekly loss limit: 10%.</li>
      </ul>
      <h4>6. Trading Schedule</h4>
      <p>When will you trade? Volatility indices are available 24/7, but your mind isn't. Choose specific hours, e.g., "9:00 AM – 11:00 AM and 8:00 PM – 10:00 PM EAT".</p>
      <h4>7. Performance Review</h4>
      <p>How often will you review your performance? Daily, weekly, monthly. What metrics will you track? Win rate, average win/loss, drawdown, largest losing streak, etc.</p>
      <h3>Example Trading Plan (Abbreviated)</h3>
      <p>Here's a sample for a Deriv Trader user:</p>
      <div class="example-box">
        <strong>Trading Plan: Volatility 25 Over/Under</strong><br><br>
        <strong>Account:</strong> Demo initially, real after 50 consecutive profitable trades on demo.<br>
        <strong>Risk:</strong> 2% per trade, max 5 trades/day, daily stop at 6%.<br>
        <strong>Entry:</strong><br>
        - Bullish: 5 EMA > 20 EMA, RSI > 50, price above 200 EMA, bullish candle pattern near support → UP trade, 1 tick.<br>
        - Bearish: Opposite.<br>
        <strong>Do Not Trade:</strong> During news, when tired, after 2 consecutive losses (take a break).<br>
        <strong>Review:</strong> End of session, fill journal.
      </div>
      <h3>Sticking to the Plan</h3>
      <p>The best plan is useless if not followed. Treat deviations as serious violations. If you break a rule, penalize yourself (e.g., no trading the next day). This builds discipline.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Write your plan, print it, and place it next to your screen. Follow it like a legal contract. Adjust only after thorough review, not on a whim.</div>
    `
  },
  {
    id: 13,
    title: "Demo Trading: Your Training Ground",
    duration: "40 min",
    content: `
      <h3>Why Demo Trade?</h3>
      <p>Demo trading allows you to practice in a risk-free environment. You can test strategies, learn the platform, and build confidence. Many new traders skip this step and lose real money unnecessarily.</p>
      <h3>How Long Should You Demo?</h3>
      <p>There's no set time, but a good rule of thumb is to demo trade until you achieve consistent profitability for at least one month. This means your equity curve is steadily rising, your win rate is acceptable (above 55% for Over/Under with 1.8 R:R), and you haven't broken any risk rules.</p>
      <h3>Treat Demo Like Real Money</h3>
      <p>The biggest mistake is to trade demo recklessly because it's "play money". This builds bad habits. Set your demo balance to the amount you plan to deposit later (e.g., $100), and risk only 2% per trade. This way, the transition to real will be seamless.</p>
      <h3>What to Practice</h3>
      <ul>
        <li>Executing your trading plan exactly as written.</li>
        <li>Identifying your setups quickly.</li>
        <li>Managing emotions during winning and losing streaks.</li>
        <li>Using the platform's features (trade history, notes, indicators).</li>
      </ul>
      <h3>Demo to Real Transition Checklist</h3>
      <p>Before funding a real account, answer these:</p>
      <ul>
        <li>Have I had at least 50 trades on demo with my plan? Yes/No</li>
        <li>Is my win rate above 55% (for directional trades)? Yes/No</li>
        <li>Have I achieved a positive expectancy (average win > average loss when weighted by probability)? Yes/No</li>
        <li>Did I follow my risk management rules in at least 95% of trades? Yes/No</li>
        <li>Can I accept losses without emotional distress? Yes/No</li>
      </ul>
      <p>If all are yes, you're ready. If not, keep practicing.</p>
      <h3>Common Demo Pitfalls</h3>
      <p>Some traders can't replicate demo success in real because emotions kick in. The solution is to start real with very small stakes (minimum $0.35 on Deriv) until you get used to real money's psychological weight. Scale up gradually.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Demo trading is not optional; it's mandatory. Master your strategy before risking a single real dollar.</div>
    `
  },
  {
    id: 14,
    title: "Advanced Over/Under Strategies",
    duration: "65 min",
    content: `
      <h3>Moving Average Crossover with Confluence</h3>
      <p>This strategy uses three EMAs: 5, 20, and 50. A buy signal occurs when 5 crosses above 20, both are above 50, and RSI > 50. Additionally, look for the crossover to happen at a support level or after a bullish candlestick pattern. Exit after 1 tick (fixed duration).</p>
      <p>For sell: 5 crosses below 20, both below 50, RSI < 50, near resistance.</p>
      <h4>Trade Management:</h4>
      <p>Since durations are short, you don't need to manage the trade after entry. The key is filtering out low-quality setups. Be patient.</p>
      <h3>Support/Resistance Bounce Strategy</h3>
      <p>Identify strong support and resistance levels on a 5-minute chart. When price approaches a level, wait for a reversal candlestick pattern (hammer at support, shooting star at resistance) or a engulfing pattern. Enter Over/Under in the direction of the reversal.</p>
      <p>Example: Price reaches 8,600 (resistance). A shooting star forms. Enter a DOWN trade at the close of the shooting star candle, 1 tick duration.</p>
      <h3>Breakout Retest Strategy</h3>
      <p>Wait for price to break a key level with a strong candle. Then wait for price to retrace back to that level (now support or resistance). Look for a confirmation candle (e.g., bullish engulfing at broken resistance turned support). Enter in the breakout direction.</p>
      <h3>News-Based Strategy (Forex Focus)</h3>
      <p>Although this course focuses on Deriv, if you trade forex, you can incorporate high-impact news. However, with volatility indices, news isn't a factor. But on forex pairs, the strategy is: wait for the news release, observe the initial reaction, then trade the reversal or continuation based on technical levels.</p>
      <p><strong>Remember:</strong> News trading is advanced and risky.</p>
      <h3>Combining Multiple Timeframes</h3>
      <p>Use a top-down approach: check the 1-hour chart for overall trend and key levels. Then drop to 5-minute for entry timing. This increases the probability because you're trading in the direction of the higher timeframe trend.</p>
      <h3>Performance Metrics</h3>
      <p>Track each strategy's win rate, average win, average loss, and maximum drawdown. Over time, you'll see which one works best for your personality and market conditions. Stick to 1-2 strategies that you have confidence in.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Strategy refinement is continuous. Backtest on demo, keep a detailed log, and discard what doesn't work. Simplicity wins.</div>
    `
  },
  {
    id: 15,
    title: "Introduction to Deriv X for Advanced Traders",
    duration: "50 min",
    content: `
      <h3>Why Deriv X?</h3>
      <p>Deriv X is for traders who want more control. Unlike Deriv Trader's fixed contracts, Deriv X uses CFDs (Contracts for Difference) where you can set your own stop-loss and take-profit. It also offers a wider range of assets, including forex, commodities, crypto, and synthetic indices with leverage.</p>
      <h3>Platform Features</h3>
      <ul>
        <li>Customizable workspace with multiple chart windows.</li>
        <li>90+ indicators and drawing tools.</li>
        <li>Multiple order types: Market, Limit, Stop, Trailing Stop.</li>
        <li>Risk management tools: Stop-Loss, Take-Profit, Margin Call alerts.</li>
        <li>TradingView-powered charts.</li>
      </ul>
      <h3>Understanding CFDs</h3>
      <p>When you trade a CFD, you're not buying the actual asset but a contract that mirrors its price. If you buy (go long) and the price rises, you profit. If it falls, you lose. The profit/loss is the difference between the entry and exit price, multiplied by the contract size.</p>
      <p>Leverage: You can control a larger position with less capital. Example: With 1:100 leverage, a $100 margin controls a $10,000 position. A 1% move in your favor yields a 100% profit on margin, but a 1% move against you wipes out your margin. Use leverage wisely.</p>
      <h3>Setting Stop-Loss and Take-Profit</h3>
      <p>Always use a stop-loss. Determine it based on technical levels (e.g., just below support for a long trade). The take-profit should be at least 2x the risk to maintain a good risk/reward ratio.</p>
      <h4>Example:</h4>
      <p>You go long on EUR/USD at 1.1050, stop at 1.1020 (30 pips risk), take-profit at 1.1110 (60 pips reward). Ratio 1:2.</p>
      <h3>Risk Management on Deriv X</h3>
      <p>The same rules apply: risk per trade = max 2% of account. Calculate position size using a lot size calculator: Position Size = (Account Risk in USD) / (Stop Loss in pips x Pip Value). Demo practice is essential.</p>
      <h3>Transitioning from Trader to Deriv X</h3>
      <p>First, master Deriv Trader and the fundamentals. Once you're consistently profitable there, open a Deriv X demo and practice for a few weeks. Only then consider real money.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Deriv X offers more flexibility but requires deeper knowledge. Don't jump in too early. Master the basics first.</div>
    `
  },
  {
    id: 16,
    title: "Automated Trading with Deriv Bot",
    duration: "40 min",
    content: `
      <h3>What is Deriv Bot?</h3>
      <p>Deriv Bot is a visual tool that lets you build trading robots without coding. You drag and drop blocks to define conditions and actions, like "if RSI < 30, then buy an Over contract". It runs on Deriv's servers, so your trades execute even if your computer is off.</p>
      <h3>Building Your First Bot</h3>
      <ol>
        <li>Open Deriv Bot from the platform menu.</li>
        <li>Select a market (e.g., Volatility 25).</li>
        <li>Add a condition: "RSI (14) < 30".</li>
        <li>Add action: "Buy UP contract, duration 1 tick, stake $1".</li>
        <li>Set a take-profit and max loss for the bot.</li>
        <li>Run on demo first.</li>
      </ol>
      <h3>Backtesting and Optimization</h3>
      <p>Deriv Bot allows you to backtest using historical tick data. You can see how your bot would have performed. But beware of over-optimization (curve-fitting): a bot that works perfectly on past data may fail in live markets because conditions change. Keep strategies simple and robust.</p>
      <h3>Risks of Automated Trading</h3>
      <p>Bots can execute hundreds of trades quickly. A bug or market anomaly can cause large losses. Always set a maximum daily loss limit for the bot. Monitor it regularly, especially at first.</p>
      <h3>Who Should Use Bots?</h3>
      <p>Bots are great for executing simple, repetitive strategies and for removing emotional decision-making. However, they require a solid understanding of trading principles. Don't use a bot to replace learning; use it as a tool once you have a proven manual strategy.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Automation can be powerful, but it's not a shortcut. Only automate a strategy you've already proven manually on demo.</div>
    `
  },
  {
    id: 17,
    title: "Money Management for Long-Term Growth",
    duration: "55 min",
    content: `
      <h3>The Compound Effect</h3>
      <p>Albert Einstein called compound interest the "eighth wonder of the world". In trading, compounding means reinvesting your profits to grow your account exponentially. If you can achieve a consistent 5% monthly return, a $1,000 account becomes $1,800 in one year, $3,200 in two years, and over $100,000 in ten years – without adding new funds.</p>
      <p>The key is consistency and avoiding large drawdowns. A single -30% month sets you back significantly.</p>
      <h3>Fixed Fractional Money Management</h3>
      <p>This is the 2% rule we've discussed. As your account grows, the dollar risk per trade increases. For example, if you risk 2%:</p>
      <ul>
        <li>$1,000 account → risk $20</li>
        <li>$1,200 account → risk $24</li>
        <li>$1,500 account → risk $30</li>
      </ul>
      <p>This method lets you compound while controlling risk.</p>
      <h3>Scaling In and Out</h3>
      <p>On Deriv Trader, you can't scale into a single contract, but you can take multiple separate trades. If a strong trend is confirmed, you could take two or three trades in the same direction, but always ensuring total risk doesn't exceed the daily limit. Scaling out (taking partial profits) isn't applicable with fixed contracts.</p>
      <h3>Drawdown and Recovery Math</h3>
      <table>
        <tr><th>Drawdown</th><th>Required Gain to Break Even</th></tr>
        <tr><td>10%</td><td>11%</td></tr>
        <tr><td>25%</td><td>33%</td></tr>
        <tr><td>50%</td><td>100%</td></tr>
        <tr><td>75%</td><td>300%</td></tr>
        <tr><td>90%</td><td>900%</td></tr>
      </table>
      <p>This shows why protecting capital is critical. A 50% loss requires a 100% gain just to get back to where you started. That's why we never risk too much.</p>
      <h3>Managing a Withdrawal Plan</h3>
      <p>Once you're consistently profitable, decide on a withdrawal strategy. Many traders withdraw a percentage of profits monthly while leaving the principal to grow. For example, withdraw 30% of monthly profit, reinvest 70%. This creates a sustainable income stream.</p>
      <h3>Avoiding the "Gambler's Fallacy"</h3>
      <p>After several losses, the gambler's fallacy makes you think you're "due" for a win and increases stakes. In trading, each trade is independent. Stick to your plan regardless of recent outcomes.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Money management is the science of growing your account while protecting it. Compound with discipline, avoid large drawdowns, and have a withdrawal plan.</div>
    `
  },
  {
    id: 18,
    title: "Trading Journal and Performance Analysis",
    duration: "45 min",
    content: `
      <h3>Why Keep a Journal?</h3>
      <p>A trading journal is a record of all your trades, including the setup, emotions, and outcome. It transforms trading from a black box into a measurable skill. You can't improve what you don't measure.</p>
      <h3>What to Record</h3>
      <ul>
        <li><strong>Date and Time:</strong> To identify your best trading sessions.</li>
        <li><strong>Market and Trade Type:</strong> e.g., Volatility 25, Over/Under.</li>
        <li><strong>Entry/Exit Price and Stake:</strong></li>
        <li><strong>Setup:</strong> What pattern or indicator combination triggered the trade? Screenshot the chart.</li>
        <li><strong>Emotion:</strong> How did you feel before, during, after? (Calm, anxious, confident)</li>
        <li><strong>Outcome:</strong> Win/Loss, P&L.</li>
        <li><strong>Notes:</strong> What went well? What would you do differently?</li>
      </ul>
      <h3>Analyzing Your Journal</h3>
      <p>After 50 trades, you'll have enough data to spot patterns. Calculate your win rate, average win/loss, profit factor, and maximum drawdown. Look for common mistakes: maybe you lose most trades on Mondays, or when you trade a particular pattern, or when you're tired. Use this data to refine your plan.</p>
      <h4>Example Analysis:</h4>
      <p>You discover that trades taken with RSI > 70 (overbought) as a sell signal have a 70% win rate, but those with RSI between 50-70 have only 40%. You'd adjust your plan to only take sell signals when RSI is overbought.</p>
      <h3>Tools for Journaling</h3>
      <p>You can use a spreadsheet (Google Sheets, Excel), a notebook, or specialized trading journal software like Edgewonk or Tradervue. The important thing is consistency.</p>
      <h3>Weekly and Monthly Reviews</h3>
      <p>Set aside time each weekend to review your week. Look at the big picture: equity curve, adherence to plan, psychological state. Monthly reviews should inform whether you need to change your strategy or adjust risk parameters.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> A journal is your roadmap to improvement. Without it, you're driving blind. Commit to journaling every trade.</div>
    `
  },
  {
    id: 19,
    title: "Common Trading Mistakes and How to Avoid Them",
    duration: "50 min",
    content: `
      <h3>Learning from Others' Errors</h3>
      <p>Most new traders make the same mistakes. By being aware of them, you can avoid the costly pitfalls. Here are the top mistakes and how to prevent them.</p>
      <h4>1. Lack of a Trading Plan</h4>
      <p>Symptom: Entering trades impulsively, switching strategies frequently. Solution: Write a detailed plan and stick to it.</p>
      <h4>2. Overtrading</h4>
      <p>Trading too often, usually due to boredom or excitement. This leads to poor setup quality. Solution: Set a maximum number of trades per day (3-5). If you exceed, stop.</p>
      <h4>3. Revenge Trading</h4>
      <p>After a loss, immediately trying to get the money back with a bigger trade. Solution: Walk away after a loss. Do something unrelated for 15 minutes.</p>
      <h4>4. Ignoring Stop Losses</h4>
      <p>On Deriv Trader, the maximum loss is fixed per trade, but on Deriv X, not using a stop loss can lead to catastrophic losses. Always use a stop.</p>
      <h4>5. Overleveraging</h4>
      <p>Using high leverage because you want to make more with less. Solution: Use low leverage (1:10 or less) until you have extensive experience.</p>
      <h4>6. Chasing the Market</h4>
      <p>Buying after a big move has already happened, hoping it will continue. Solution: Wait for pullbacks or retests. The best trades come to you.</p>
      <h4>7. Not Keeping a Journal</h4>
      <p>Without records, you'll repeat mistakes. Solution: Start journaling today.</p>
      <h4>8. Emotional Trading</h4>
      <p>Letting a win streak make you arrogant or a losing streak make you fearful. Solution: Practice mindfulness, take breaks, and follow the plan regardless of recent outcomes.</p>
      <h4>9. Unrealistic Expectations</h4>
      <p>Expecting to double your account in a week. This leads to excessive risk. Solution: Aim for 5% monthly growth. That's an outstanding return.</p>
      <h4>10. Neglecting Education</h4>
      <p>Thinking you know enough. The markets evolve, and learning never stops. Solution: Read books, watch webinars, review your trades.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Mistakes are inevitable, but awareness reduces their frequency and severity. Focus on process, not profits.</div>
    `
  },
  {
    id: 20,
    title: "Taxes, Legal, and Ethics in Trading",
    duration: "35 min",
    content: `
      <h3>Understanding Your Obligations</h3>
      <p>Trading income is taxable in most countries. Laws vary, so consult a local tax professional. In Kenya, for example, capital gains from trading may be subject to tax, though enforcement varies. It's your responsibility to declare and pay taxes on your profits.</p>
      <h3>Keeping Records</h3>
      <p>Maintain a record of all deposits, withdrawals, and trades. Deriv provides a detailed statement that you can download. This will be essential for tax filing.</p>
      <h3>Regulation and Your Safety</h3>
      <p>Deriv is regulated by multiple authorities, which means they must follow strict rules on client fund segregation and fair trading. Always trade with regulated brokers. Avoid unregulated offshore brokers that can disappear with your money.</p>
      <h3>Ethical Trading</h3>
      <p>Don't engage in market manipulation or use insider information. Treat trading as a profession. Be honest with yourself about your results. Integrity is crucial for long-term success.</p>
      <h3>Responsible Trading</h3>
      <p>Trading should not be an addiction. If you find yourself unable to stop, or you're trading with money you can't afford to lose, seek help. Deriv offers self-exclusion tools. Trading is a tool for financial freedom, not a substitute for a healthy life.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Be a responsible trader. Pay your taxes, trade with regulated brokers, and keep a healthy balance between trading and life.</div>
    `
  },
  {
    id: 21,
    title: "Advanced Risk Tools: Hedging and Correlation",
    duration: "45 min",
    content: `
      <h3>What is Hedging?</h3>
      <p>Hedging is taking a position to offset potential losses in another position. On Deriv, you can hedge by taking opposite trades on correlated assets. For example, if you're long on EUR/USD, you could short USD/CHF (since they often move inversely). A loss on one may be partly offset by a gain on the other.</p>
      <h3>Correlation Between Assets</h3>
      <p>Correlation measures how two assets move relative to each other. Positive correlation means they move in the same direction (EUR/USD and GBP/USD). Negative means opposite (EUR/USD and USD/CHF). You can find correlation data online.</p>
      <p>Be careful: correlations can break during extreme events. Never assume they're fixed.</p>
      <h3>Using Volatility Indices for Hedging</h3>
      <p>Since volatility indices are not correlated to real-world markets, they can't directly hedge a forex position. However, you can use them to create a diversified portfolio: if one market is slow, another might be active, smoothing out returns.</p>
      <h3>Portfolio Diversification</h3>
      <p>Instead of putting all your capital in one market, split it among 2-3 uncorrelated instruments. For example, trade Volatility 25, EUR/USD, and Gold. This reduces the impact of a losing streak in one market.</p>
      <h3>Dynamic Position Sizing</h3>
      <p>Adjust your stake based on recent performance and volatility. After a losing streak, you might reduce risk to 1% until confidence returns. When volatility is high, reduce position size to maintain the same dollar risk.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Hedging and diversification are advanced techniques. Use them to protect profits, not to increase leverage.</div>
    `
  },
  {
    id: 22,
    title: "Psychology of Profit and Loss",
    duration: "40 min",
    content: `
      <h3>Why We Self-Sabotage</h3>
      <p>Even with a proven strategy, traders often fail because of psychological traps related to profits and losses. Understanding these can help you overcome them.</p>
      <h3>Loss Aversion</h3>
      <p>Humans feel the pain of a loss about twice as intensely as the pleasure of an equivalent gain. This leads to holding losing trades too long (hoping they'll turn around) and closing winning trades too early (to lock in the good feeling).</p>
      <p>On Deriv Trader, loss is fixed, so you can't hold a loser. But loss aversion still makes you hesitant to take the next trade after a loss. The solution is to trust the long-term expectancy of your strategy.</p>
      <h3>The Dunning-Kruger Effect</h3>
      <p>Beginners often overestimate their ability after a few wins. This leads to overconfidence and taking larger risks. Remember: a few wins prove nothing. Only after hundreds of trades can you evaluate your true skill.</p>
      <h3>Confirmation Bias</h3>
      <p>We tend to seek information that confirms our existing beliefs. If you think the market will go up, you'll subconsciously ignore bearish signals. Always consider the opposing view. Ask, "What would make me wrong?"</p>
      <h3>Managing the Emotional Cycle</h3>
      <p>The typical emotional cycle of a trade: hope (after entry), anxiety (as price moves), relief (when in profit), greed (wanting more), fear (when price reverses), despair (if it hits stop). Recognizing this cycle helps you detach and make rational decisions.</p>
      <p>Use breathing techniques and a pre-trade checklist to stay centered.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> The market is a reflection of collective psychology. Master your own mind to profit from others' emotional mistakes.</div>
    `
  },
  {
    id: 23,
    title: "Building a Trading Routine for Consistency",
    duration: "35 min",
    content: `
      <h3>Why a Routine Matters</h3>
      <p>Consistency is the holy grail of trading. A routine eliminates guesswork and reduces emotional decisions. It trains your brain that "it's time to focus".</p>
      <h3>Sample Morning Routine (30-45 minutes)</h3>
      <ol>
        <li><strong>Physical warm-up:</strong> Light exercise, shower.</li>
        <li><strong>Mental prep:</strong> 5 minutes meditation or deep breathing.</li>
        <li><strong>Market review:</strong> Check higher timeframe charts of your chosen markets. Mark support/resistance.</li>
        <li><strong>Plan review:</strong> Read your trading plan aloud.</li>
        <li><strong>Pre-trade declaration:</strong> Say "I will follow my plan. I accept the risk. I will not revenge trade."</li>
      </ol>
      <h3>During the Session</h3>
      <ul>
        <li>Only open your chart when you're ready.</li>
        <li>Wait for your setup; don't force trades.</li>
        <li>After each trade, record it immediately.</li>
        <li>Take a short break every hour.</li>
      </ul>
      <h3>Post-Session Routine</h3>
      <ol>
        <li>Close charts.</li>
        <li>Review all trades for the session.</li>
        <li>Write a summary: what worked, what didn't, how you felt.</li>
        <li>Plan for the next session.</li>
        <li>Disconnect completely – no chart watching.</li>
      </ol>
      <h3>Adapting the Routine</h3>
      <p>Your routine should fit your lifestyle. If you work a day job, maybe you trade only in the evening. The key is consistency, not the exact schedule.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> A solid routine is the backbone of a professional trader. Build one and stick to it religiously.</div>
    `
  },
  {
    id: 24,
    title: "Scaling Up: From Micro to Standard Lots",
    duration: "40 min",
    content: `
      <h3>When to Increase Your Size</h3>
      <p>Only increase your position size after you've demonstrated consistent profitability at your current level for a significant period (e.g., 3 months). Do it gradually: if you risk $20 per trade and your account grows to where 2% is now $30, you increase to $30. But don't jump from $20 to $100 just because you had a good week.</p>
      <h3>Psychological Challenges of Scaling</h3>
      <p>As the dollar amounts increase, emotions amplify. A $50 loss may feel devastating even if it's still 2% of a $2,500 account. The key is to view the numbers as percentages, not dollars. If you can't detach, you may need to stay at a comfortable level until desensitized.</p>
      <h3>The Concept of "Unit" Trading</h3>
      <p>In forex, a standard lot is 100,000 units. Many retail traders start with micro lots (1,000 units) or mini lots (10,000). On Deriv X, you can set the volume. Start with the smallest possible and increase slowly.</p>
      <h3>When to Add More Instruments</h3>
      <p>Master one market before adding a second. When you do add, allocate a small portion of capital to the new market and track its performance separately. Don't let it interfere with your primary market.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Scaling is a marathon, not a sprint. Consistency at each level before moving up.</div>
    `
  },
  {
    id: 25,
    title: "The Path to Mastery and Lifelong Learning",
    duration: "30 min",
    content: `
      <h3>Trading as a Journey</h3>
      <p>Mastery in trading takes years, not months. There will be setbacks, but each one teaches something. The most successful traders never stop learning. They read books, attend seminars, and constantly analyze their performance.</p>
      <h3>Recommended Resources</h3>
      <ul>
        <li>Books: "Trading in the Zone" by Mark Douglas, "Technical Analysis of the Financial Markets" by John Murphy.</li>
        <li>Websites: BabyPips (forex), Investopedia.</li>
        <li>Communities: Deriv's community forum, trading subreddits (but beware of noise).</li>
      </ul>
      <h3>The 10,000-Hour Rule</h3>
      <p>Research suggests that world-class expertise requires about 10,000 hours of deliberate practice. You won't become an expert overnight. But with consistent, focused practice, you can achieve competency much sooner.</p>
      <h3>Defining Success</h3>
      <p>Success isn't just about money. It's about consistency, discipline, and the freedom that comes from being in control of your financial future. Define your own version of success.</p>
      <h3>Final Words</h3>
      <p>You now have a comprehensive foundation. The rest is up to you. Apply what you've learned, stay disciplined, and never give up. The markets reward patience and persistence.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Stay humble, keep learning, and enjoy the journey. Welcome to the world of trading!</div>
    `
  }
];

// ============================================
// FOREX COURSE DATA (25 comprehensive lessons)
// ============================================
const forexLessons = [
  {
    id: 1,
    title: "Forex Trading: The Biggest Market",
    duration: "45 min",
    content: `
      <h3>What is Forex?</h3>
      <p>Forex, short for foreign exchange, is the global decentralized market for trading currencies. It is the largest and most liquid financial market in the world, with a daily trading volume exceeding $7 trillion. To put that in perspective, the New York Stock Exchange trades about $200 billion daily – forex is 35 times larger!</p>
      <p>Forex operates 24 hours a day, five days a week, across major financial centers: Sydney, Tokyo, London, and New York. It involves participants from central banks and financial institutions to individual retail traders.</p>
      <h3>How Currency Trading Works</h3>
      <p>Currencies are always traded in pairs. You are simultaneously buying one currency and selling another. For example, if you buy EUR/USD, you are buying the euro and selling the US dollar. You profit if the euro appreciates against the dollar.</p>
      <p>The exchange rate tells you how much of the quote currency is needed to buy one unit of the base currency. If EUR/USD = 1.1000, it costs 1.10 USD to buy 1 euro.</p>
      <h3>Major, Minor, and Exotic Pairs</h3>
      <ul>
        <li><strong>Major Pairs:</strong> Include USD and another major currency. Examples: EUR/USD, USD/JPY, GBP/USD, USD/CHF. These have the highest liquidity and lowest spreads.</li>
        <li><strong>Minor Pairs (Crosses):</strong> Do not involve USD. Examples: EUR/GBP, GBP/JPY, AUD/NZD.</li>
        <li><strong>Exotic Pairs:</strong> One major currency and one from an emerging economy. Examples: USD/TRY (Turkish lira), EUR/ZAR (South African rand). High spreads, high volatility.</li>
      </ul>
      <p>Beginners should stick to major pairs because they are more predictable and have lower trading costs.</p>
      <h3>Market Participants</h3>
      <p>Understanding who moves the market helps you anticipate price action:</p>
      <ul>
        <li><strong>Central Banks:</strong> The most influential players. They set interest rates and monetary policy. For instance, when the Federal Reserve raises rates, the USD tends to strengthen.</li>
        <li><strong>Commercial Banks and Financial Institutions:</strong> They facilitate transactions for clients and trade for their own accounts. Their massive volume can cause sharp moves.</li>
        <li><strong>Hedge Funds and Investment Managers:</strong> Speculate on currency movements with large capital.</li>
        <li><strong>Corporations:</strong> Companies involved in international trade need to exchange currencies, affecting supply and demand.</li>
        <li><strong>Retail Traders:</strong> Individuals like you. Though small individually, collectively retail traders can influence short-term moves.</li>
      </ul>
      <h3>Why Trade Forex?</h3>
      <p>High liquidity means you can enter and exit positions easily. Low transaction costs (spreads) make it affordable. 24-hour trading gives flexibility. Leverage allows you to control larger positions with a small deposit, but be cautious – leverage is a double-edged sword.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Forex is the largest market. Focus on major pairs, understand the players, and start with small positions.</div>
    `
  },
  {
    id: 2,
    title: "Pips, Lots, and Leverage – The Basics",
    duration: "50 min",
    content: `
      <h3>What is a Pip?</h3>
      <p>A pip (percentage in point) is the smallest standard unit of price movement in forex. For most currency pairs, a pip is the fourth decimal place (0.0001). For example, if EUR/USD moves from 1.1050 to 1.1055, it has moved 5 pips. For yen-based pairs (USD/JPY), a pip is the second decimal place (0.01).</p>
      <p>Some brokers now quote an extra digit (fractional pip), but standard calculations use whole pips.</p>
      <h4>Pip Value</h4>
      <p>The monetary value of a pip depends on the currency pair and the size of your trade. For a standard lot (100,000 units) of EUR/USD, one pip is worth $10. For a mini lot (10,000 units), it's $1. For a micro lot (1,000 units), it's $0.10.</p>
      <p>Formula: Pip Value = (Pip in decimal places * Trade Size) / Current Exchange Rate. Most brokers calculate this automatically.</p>
      <h3>Lot Sizes</h3>
      <ul>
        <li><strong>Standard Lot:</strong> 100,000 units of base currency. Risk for a 50-pip stop is $500 (very high for small accounts).</li>
        <li><strong>Mini Lot:</strong> 10,000 units. 50-pip risk = $50.</li>
        <li><strong>Micro Lot:</strong> 1,000 units. 50-pip risk = $5.</li>
      </ul>
      <p>New traders should use micro lots to keep risk small while learning.</p>
      <h3>Leverage</h3>
      <p>Leverage allows you to control a larger position with a smaller amount of money. It's expressed as a ratio, like 1:100. With 1:100 leverage, a $1,000 deposit (margin) allows you to trade up to $100,000.</p>
      <p>While leverage amplifies profits, it equally amplifies losses. A 1% adverse move can wipe out your entire account if you use maximum leverage. Professional traders rarely use more than 1:10 on live accounts.</p>
      <h4>Margin and Margin Call</h4>
      <p>Margin is the deposit required to open a leveraged position. If your account equity falls below the required margin (due to losses), your broker may issue a margin call, asking you to add funds or close positions. If not met, they may close positions automatically to prevent further losses.</p>
      <h4>Choosing the Right Leverage</h4>
      <p>Start with low leverage (1:10 or 1:30) until you have a proven track record. Higher leverage doesn't mean higher returns if you use proper position sizing – it just increases the risk of ruin.</p>
      <div class="example-box">
        <strong>Example:</strong> You have a $1,000 account. Using 1:100 leverage, you could open a standard lot trade ($100,000) that only requires $1,000 margin. A 10-pip move against you ($100 loss) wipes out 10% of your account. With 1:10 leverage, you'd need $10,000 margin for the same trade, which you don't have, so you'd trade smaller. That's protection.
      </div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Understand pips, lots, and leverage. Use micro lots and low leverage to protect your capital while learning.</div>
    `
  },
  {
    id: 3,
    title: "Technical Analysis: The Foundation",
    duration: "65 min",
    content: `
      <h3>What is Technical Analysis?</h3>
      <p>Technical analysis is the study of historical price movements to forecast future price direction. It's based on three principles: (1) Market action discounts everything – all known information is already reflected in the price. (2) Prices move in trends. (3) History tends to repeat itself because human psychology is constant.</p>
      <h3>Types of Charts</h3>
      <ul>
        <li><strong>Line Chart:</strong> Connects closing prices, good for a quick overview.</li>
        <li><strong>Bar Chart:</strong> Shows open, high, low, close (OHLC).</li>
        <li><strong>Candlestick Chart:</strong> Also OHLC but visually easier to interpret. This is the standard.</li>
      </ul>
      <h3>Key Candlestick Patterns</h3>
      <p>(Similar to Deriv course but adapted for forex timeframes)</p>
      <p>Engulfing patterns, hammers, shooting stars, doji – these are universal. In forex, they often signal reversals at support/resistance levels.</p>
      <h3>Support and Resistance</h3>
      <p>Support is a price floor where buying interest exceeds selling pressure. Resistance is a ceiling where selling exceeds buying. These levels can be horizontal or diagonal (trendlines).</p>
      <p>The more times a level is tested and holds, the stronger it is. Once broken, a support level becomes resistance, and vice versa.</p>
      <h3>Trendlines and Channels</h3>
      <p>Draw trendlines by connecting two or more swing points. An ascending trendline connects higher lows; descending connects lower highs. Channels add a parallel line to define a trading range. Trade in the direction of the trend until the trendline breaks.</p>
      <h3>Moving Averages</h3>
      <p>Moving averages smooth price data to show the underlying trend. The 50-period and 200-period are widely watched by institutional traders. When price is above the 200 MA, the long-term trend is up.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Technical analysis is the language of the market. Master chart reading before moving to indicators.</div>
    `
  },
  {
    id: 4,
    title: "Fundamental Analysis in Forex",
    duration: "60 min",
    content: `
      <h3>What Moves Currencies?</h3>
      <p>Fundamental analysis evaluates economic, social, and political forces that affect supply and demand. In forex, the main drivers are interest rates, economic data, and geopolitics.</p>
      <h3>Interest Rates – The Big Driver</h3>
      <p>Central banks set interest rates to control inflation and stimulate growth. Higher interest rates offer better returns on investments in that currency, attracting foreign capital and causing the currency to appreciate. Conversely, rate cuts can weaken a currency.</p>
      <p>Example: If the US Federal Reserve raises rates while the European Central Bank keeps rates low, the USD tends to strengthen against the EUR.</p>
      <h3>Key Economic Indicators</h3>
      <ul>
        <li><strong>Gross Domestic Product (GDP):</strong> Measures economic growth. Strong GDP = stronger currency.</li>
        <li><strong>Employment Data:</strong> Non-Farm Payrolls (NFP) in the US is the most watched. Rising employment signals a healthy economy.</li>
        <li><strong>Inflation (CPI):</strong> Moderate inflation is normal; high inflation may lead to rate hikes, which could strengthen the currency.</li>
        <li><strong>Retail Sales:</strong> Indicates consumer spending, a major economic driver.</li>
        <li><strong>Manufacturing PMI:</strong> Purchasing Managers' Index – above 50 indicates expansion.</li>
      </ul>
      <h3>Central Bank Speeches and Minutes</h3>
      <p>Statements from central bank officials can cause volatility. When the Fed Chair speaks, markets listen. Pay attention to the tone – hawkish (favoring tighter policy) vs. dovish (looser).</p>
      <h3>Economic Calendar</h3>
      <p>An essential tool. It lists upcoming economic events with their expected impact. High-impact events like NFP can cause 100+ pip moves in minutes. Beginners should avoid trading 15 minutes before and after such events.</p>
      <h3>Combining Technical and Fundamental Analysis</h3>
      <p>Use fundamentals to understand the "why" behind a trend, and technicals to time entries and exits. For example, if the Fed is hawkish, that's a fundamental reason to be bullish on USD. Wait for a technical pullback to a support level to enter a long trade.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Fundamentals drive the long-term trend. Use them to form a bias, then use technicals for execution.</div>
    `
  },
  {
    id: 5,
    title: "Advanced Chart Patterns",
    duration: "70 min",
    content: `
      <h3>Harmonic Patterns</h3>
      <p>Harmonic patterns use Fibonacci retracements and extensions to identify potential reversal zones. The most common are the Gartley, Butterfly, Bat, and Crab patterns. They require precise ratios. For example, a bullish Gartley pattern forms when price retraces to the 0.618 Fibonacci level of the XA leg, then bounces at the 1.272 extension of the BC leg. These are advanced and require practice.</p>
      <h3>Elliott Wave Theory</h3>
      <p>Proposed by Ralph Nelson Elliott, this theory suggests that markets move in repetitive cycles of five waves in the direction of the trend (impulse waves) followed by three corrective waves. It's a complex tool but can provide a roadmap. Many traders combine it with Fibonacci.</p>
      <h3>Point and Figure Charts</h3>
      <p>These ignore time and only plot price changes. They filter out noise and show clear support/resistance levels. Useful for long-term analysis.</p>
      <h3>Renko Charts</h3>
      <p>Similar to Point and Figure, Renko charts use "bricks" of a fixed price size. A new brick forms only when price moves by the specified amount. This smooths trends and eliminates minor fluctuations.</p>
      <h3>Multiple Timeframe Analysis</h3>
      <p>Combine charts of three different timeframes:</p>
      <ul>
        <li><strong>Long-term (daily/weekly):</strong> Determine the major trend and key levels.</li>
        <li><strong>Medium-term (4-hour):</strong> Identify patterns and potential trade setups.</li>
        <li><strong>Short-term (15-minute):</strong> Time your entry precisely.</li>
      </ul>
      <p>Always trade in the direction of the higher timeframe trend. If the daily is bullish, only look for long signals on the lower timeframes.</p>
      <h3>How to Choose the Right Timeframe</h3>
      <p>It depends on your trading style. Scalpers use 1-5 minute charts. Day traders use 15-minute to 1-hour. Swing traders use 4-hour and daily. Position traders use weekly. Start with a longer timeframe to reduce noise and stress.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Multiple timeframe analysis increases edge. Filter trades by higher timeframe direction.</div>
    `
  },
  {
    id: 6,
    title: "Fibonacci Trading",
    duration: "50 min",
    content: `
      <h3>Fibonacci Sequence in Trading</h3>
      <p>The Fibonacci sequence (0,1,1,2,3,5,8,13,21…) and its ratios (23.6%, 38.2%, 50%, 61.8%, 78.6%) appear frequently in financial markets because they reflect natural patterns of crowd psychology.</p>
      <h3>Fibonacci Retracements</h3>
      <p>Used to identify potential support and resistance levels during a correction in a trend. In an uptrend, draw from swing low to swing high; the retracement levels show where price might pull back to before resuming up. The 61.8% level is the most significant ("golden ratio").</p>
      <p>When price bounces from a Fibonacci level, it's a high-probability trade entry.</p>
      <h3>Fibonacci Extensions</h3>
      <p>Used to set profit targets. Common extension levels: 127.2%, 161.8%. In an uptrend, draw from swing low to swing high, then back to the retracement low. The extension projects where the next leg might end.</p>
      <h3>Fibonacci and Confluence</h3>
      <p>Fibonacci levels are more powerful when they coincide with other technical tools: a 61.8% retracement level that also matches a previous resistance turned support and a 200 EMA is a strong confluence zone.</p>
      <h3>Pitfalls</h3>
      <p>Fibonacci is not magic. It doesn't work in all market conditions, especially during news events or when the trend is very strong without pullbacks. Don't trade solely based on Fib levels; always have confirmation.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Fibonacci is a tool, not a crystal ball. Combine with other analysis to increase reliability.</div>
    `
  },
  {
    id: 7,
    title: "Oscillators and Momentum Indicators",
    duration: "55 min",
    content: `
      <h3>RSI – Relative Strength Index</h3>
      <p>Created by J. Welles Wilder, RSI measures the speed and change of price movements. It oscillates between 0 and 100. Traditionally, overbought (>70) suggests a potential reversal down, and oversold (<30) suggests up. However, in strong trends, RSI can remain overbought/oversold for long periods.</p>
      <p>A better use is divergence: when price makes a higher high but RSI makes a lower high, it's a bearish divergence warning. When price makes a lower low but RSI makes a higher low, bullish divergence.</p>
      <h3>Stochastic Oscillator</h3>
      <p>Developed by George Lane, it compares a closing price to its price range over a period. It has two lines: %K and %D. Readings above 80 are overbought, below 20 oversold. Crossovers of these lines generate signals, but again, they can be premature in trending markets. Use with trend filters.</p>
      <h3>MACD – Moving Average Convergence Divergence</h3>
      <p>Combines trend and momentum. The MACD line is the difference between 12-period and 26-period EMAs. The signal line is a 9-period EMA of the MACD line. The histogram visualizes the difference. Crossovers, zero-line cross, and divergence are the main signals.</p>
      <p>MACD is best on higher timeframes (1H and above) where it produces fewer false signals.</p>
      <h3>Commodity Channel Index (CCI)</h3>
      <p>Originally developed for commodities, it measures current price level relative to average price. Readings above +100 indicate overbought; below -100 oversold. It can also identify cyclical turns.</p>
      <h3>How to Use Oscillators Together</h3>
      <p>Don't put three oscillators on one chart; they'll all show similar information. Choose one that resonates with you and master it. Combine it with a trend indicator and price action.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Oscillators work best in ranging markets. In trends, use them for divergence and extreme readings with caution.</div>
    `
  },
  {
    id: 8,
    title: "Volume and Market Profile",
    duration: "45 min",
    content: `
      <h3>Volume in Forex</h3>
      <p>True volume in forex is not centralized, but tick volume (number of price changes) is a good proxy. High tick volume indicates active participation and validates a move. Low volume suggests lack of interest and possible false breakout.</p>
      <p>Volume indicators: Volume histogram, On-Balance Volume (OBV), Chaikin Money Flow. OBV divergence is particularly useful: rising prices with falling OBV suggest weakness.</p>
      <h3>Market Profile</h3>
      <p>A method of organizing price data over time to show value areas, control points, and extremes. It's less common in retail forex but used by institutional traders. The "value area" is where 70% of the volume occurred; it acts as a magnet for price. Trading from value area extremes can be profitable.</p>
      <h3>Order Flow and Depth of Market</h3>
      <p>Order flow shows the actual buy and sell orders at different price levels. While not available on all platforms, understanding that large orders (icebergs) can create support/resistance helps. Deriv X offers market depth for some instruments.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Volume confirms price. Look for increasing volume on breakouts and divergences for warning signs.</div>
    `
  },
  {
    id: 9,
    title: "Trading the News",
    duration: "50 min",
    content: `
      <h3>Why News Matters</h3>
      <p>Economic news releases can cause massive volatility in seconds. For forex traders, news like NFP, interest rate decisions, and CPI can be opportunities or traps.</p>
      <h3>Types of News Impact</h3>
      <ul>
        <li><strong>High Impact (Red):</strong> Expect strong moves, spreads widen, slippage possible.</li>
        <li><strong>Medium Impact (Orange):</strong> Moderate moves.</li>
        <li><strong>Low Impact (Yellow):</strong> Minor, often ignored.</li>
      </ul>
      <h3>Strategies for News Trading</h3>
      <h4>1. Straddle Trade</h4>
      <p>Place a buy stop order above recent resistance and a sell stop below recent support before the news. Whichever direction price breaks, you get in with a trade. The risk is a whipsaw where both orders get triggered, resulting in a double loss. To mitigate, use wide stops or trade only on very clean setups.</p>
      <h4>2. Fade the Move</h4>
      <p>After the initial spike, price often retraces. Wait for a reversal pattern on a 5-minute chart and trade against the spike. This is riskier and requires quick reaction.</p>
      <h4>3. Wait and React</h4>
      <p>Let the market digest the news for 15 minutes, then analyze the resulting trend. Enter after a clear direction is established. This is the safest approach.</p>
      <h3>Precautions</h3>
      <ul>
        <li>Never hold a position into major news without a stop-loss.</li>
        <li>Expect spreads to widen significantly; your pending order may not be filled at the price you see.</li>
        <li>Use a demo account to practice news trading before live.</li>
      </ul>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> News trading is advanced. For beginners, it's often better to wait until the dust settles and trade the technical aftermath.</div>
    `
  },
  {
    id: 10,
    title: "Risk Management in Forex",
    duration: "55 min",
    content: `
      <h3>The 1% Rule</h3>
      <p>In forex, because leverage can amplify losses, many professionals risk only 1% per trade. With a $1,000 account, that's $10 risk. This ultra-conservative approach allows you to survive long losing streaks and avoid emotional distress.</p>
      <h3>Calculating Position Size</h3>
      <p>Position size = (Account Risk in USD) / (Stop Loss in pips * Pip Value). For a micro lot on EUR/USD, pip value is about $0.10. If you want to risk $10 with a 20-pip stop: $10 / (20 * $0.10) = $10 / $2 = 5 micro lots (5,000 units). A calculator simplifies this.</p>
      <h3>Stop Loss Placement</h3>
      <p>Place your stop beyond a technical level that would invalidate the trade. For a long trade, put it a few pips below support. Don't use arbitrary numbers like 20 pips for every trade; volatility changes. Use ATR to set dynamic stops.</p>
      <h3>Trailing Stops</h3>
      <p>A trailing stop moves with the price as it moves in your favor, locking in profit. Set it at a distance equal to, say, 2x ATR. If the price reverses, the stop is hit and you exit with profit. Many brokers offer automated trailing stops.</p>
      <h3>Risk of Overnight and Weekend Gaps</h3>
      <p>Forex is closed weekends, but news can cause gaps when markets reopen. These gaps can jump over your stop-loss, resulting in a larger loss than expected (slippage). Reduce position size before weekends or avoid holding positions.</p>
      <h3>Correlation Risk</h3>
      <p>If you're long EUR/USD and also long GBP/USD, you're doubling your exposure to USD weakness. Use a correlation matrix to see how pairs relate and avoid over-concentration.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Position sizing is the most critical skill in risk management. Always calculate it before entering.</div>
    `
  },
  {
    id: 11,
    title: "Forex Trading Strategies",
    duration: "60 min",
    content: `
      <h3>Trend Following</h3>
      <p>Identify a trend using a 200-period moving average and a trendline. Go long when price pulls back to the trendline or a moving average and shows a bullish candlestick pattern. Hold until the trend shows signs of reversal. Use a trailing stop.</p>
      <h3>Breakout Strategy</h3>
      <p>Identify a consolidation range (support and resistance). Place a buy stop just above resistance and a sell stop just below support. When price breaks out, one order triggers. Set stop-loss on the other side of the range. Take-profit at a distance equal to the range height.</p>
      <h3>Carry Trade</h3>
      <p>Borrow a currency with a low interest rate (like JPY) to buy a currency with a high rate (like AUD). You earn the interest differential (swap). This strategy works best in stable trending markets where the high-yield currency is appreciating. Risk is that a sharp reversal could wipe out interest gains. Use stops.</p>
      <h3>Mean Reversion (Range Trading)</h3>
      <p>In sideways markets, sell at resistance and buy at support. Use oscillators like RSI to confirm overbought/oversold. Set stops just outside the range.</p>
      <h3>News Scalping</h3>
      <p>For very advanced traders: use a 1-minute chart and trade the immediate reaction to news. This requires fast execution and is not recommended for beginners.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Pick one strategy that matches your personality and master it. Don't strategy-hop.</div>
    `
  },
  {
    id: 12,
    title: "Japanese Candlesticks Revisited",
    duration: "45 min",
    content: `
      <h3>More Patterns</h3>
      <p>Recap of doji, hammer, engulfing, morning/evening star. Plus:</p>
      <ul>
        <li><strong>Piercing Line:</strong> Bullish reversal pattern after a downtrend.</li>
        <li><strong>Dark Cloud Cover:</strong> Bearish reversal after an uptrend.</li>
        <li><strong>Harami:</strong> Small body inside previous large body – potential reversal.</li>
      </ul>
      <h3>Using Candlesticks in Context</h3>
      <p>A hammer at a key support level with bullish RSI divergence is a strong buy signal. A hammer in the middle of a range is noise.</p>
      <h3>Candlestick Patterns with Multiple Timeframes</h3>
      <p>A bearish engulfing on the 4-hour chart near a major resistance is a much stronger signal than on a 5-minute chart. Always check higher timeframes for confirmation.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Candlesticks tell a story. Combine them with technical levels for high-probability setups.</div>
    `
  },
  {
    id: 13,
    title: "Moving Averages and Dynamic Support/Resistance",
    duration: "40 min",
    content: `
      <h3>Moving Average Types</h3>
      <p>SMA vs EMA – EMA reacts faster. Which you use depends on your strategy. For long-term trend identification, SMA is fine. For entry timing, EMA.</p>
      <h3>Moving Average Envelopes and Channels</h3>
      <p>Envelopes are offset lines above and below a moving average by a fixed percentage. Price touching the envelope band can signal reversal or continuation depending on trend. Donchian channels use the highest high and lowest low over a period, often used for breakout strategies.</p>
      <h3>Multiple Moving Averages</h3>
      <p>Using 5, 10, and 20 EMAs together can show short-term trend alignment. When they fan out in order, the trend is strong.</p>
      <h3>How to Use MAs for Entry and Exit</h3>
      <p>Enter when price pulls back to a key MA and resumes trend direction. Exit when price closes below a MA (for longs) or above (for shorts).</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Moving averages are the simplest and most effective trend tools. Learn to use them as dynamic support/resistance.</div>
    `
  },
  {
    id: 14,
    title: "Bollinger Bands and Volatility",
    duration: "45 min",
    content: `
      <h3>How Bollinger Bands Work</h3>
      <p>In a ranging market, price tends to bounce within the bands. In a trending market, price can ride the upper or lower band. The squeeze (bands narrowing) indicates a breakout is coming.</p>
      <h3>Bollinger Band Width</h3>
      <p>An indicator that measures the distance between the bands. Low width signals low volatility and potential breakout.</p>
      <h3>Bollinger %B</h3>
      <p>Shows where price is relative to the bands. Above 1 means price is above the upper band; below 0 means below the lower band. This can indicate overbought/oversold extremes.</p>
      <h3>Combining with RSI</h3>
      <p>When RSI is oversold and price touches the lower band, it's a high-probability reversal signal in a ranging market.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Bollinger Bands are great for identifying volatility and potential reversals. Use with other indicators.</div>
    `
  },
  {
    id: 15,
    title: "Ichimoku Cloud – A Complete System",
    duration: "60 min",
    content: `
      <h3>What is Ichimoku?</h3>
      <p>Developed by Japanese journalist Goichi Hosoda, Ichimoku Kinko Hyo is a comprehensive indicator that defines support/resistance, trend, and momentum in one view. It consists of five lines:</p>
      <ul>
        <li><strong>Tenkan-sen (Conversion Line):</strong> (9-period high + low)/2. Measures short-term trend.</li>
        <li><strong>Kijun-sen (Base Line):</strong> (26-period high + low)/2. Medium-term trend; acts as support/resistance.</li>
        <li><strong>Senkou Span A (Leading Span A):</strong> (Tenkan + Kijun)/2, plotted 26 periods ahead.</li>
        <li><strong>Senkou Span B (Leading Span B):</strong> (52-period high + low)/2, plotted 26 periods ahead.</li>
        <li><strong>Chikou Span (Lagging Span):</strong> Close price plotted 26 periods behind.</li>
      </ul>
      <h3>Cloud (Kumo)</h3>
      <p>The space between Senkou Span A and B forms the cloud. It's a key area: price above the cloud = bullish trend; below = bearish; inside = neutral/transition.</p>
      <h3>Signals</h3>
      <ul>
        <li><strong>Tenkan/Kijun Cross:</strong> Tenkan crosses above Kijun – bullish; below – bearish. More reliable when above the cloud.</li>
        <li><strong>Price vs Cloud:</strong> A break above the cloud is a strong bullish signal. Cloud also acts as future support/resistance.</li>
      </ul>
      <h3>Using Ichimoku for Different Timeframes</h3>
      <p>Ichimoku works on all timeframes, but it's most effective on daily and 4-hour charts. Many professional forex traders rely on it.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Ichimoku is a complete trading system. It takes time to learn but can significantly improve your analysis.</div>
    `
  },
  {
    id: 16,
    title: "Harmonic Trading Patterns",
    duration: "50 min",
    content: `
      <h3>Gartley, Butterfly, Bat, Crab</h3>
      <p>These patterns use Fibonacci retracements and extensions to define precise reversal zones (Potential Reversal Zone - PRZ). When price enters the PRZ and a reversal candlestick pattern forms, it's a high-probability trade. Each pattern has specific ratios for legs XA, AB, BC, CD.</p>
      <p>Example: Bullish Butterfly pattern: XA retraces 0.786, AB retraces 0.50 of XA, BC extends 1.27 of AB, CD extends 1.618 of BC. PRZ is where D completes.</p>
      <h3>How to Trade Harmonics</h3>
      <p>Use a harmonic pattern scanner (available on many platforms) to identify patterns. Wait for completion and confirmation candle. Place stop beyond the PRZ. Target first at 0.382 retracement of AD, then 0.618.</p>
      <h3>Advantages and Disadvantages</h3>
      <p>High precision, good risk/reward, but patterns can be subjective and require practice. Not suitable for scalping due to time required for formation.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Harmonic patterns are advanced tools. Study each pattern thoroughly and paper trade before going live.</div>
    `
  },
  {
    id: 17,
    title: "Elliott Wave Theory",
    duration: "55 min",
    content: `
      <h3>Basic Wave Structure</h3>
      <p>A trending market moves in a 5-wave impulse (1,2,3,4,5) followed by a 3-wave correction (A,B,C). Within the impulse, waves 1,3,5 are motive, and 2 and 4 are corrective. Wave 3 is usually the longest and strongest.</p>
      <h3>Rules and Guidelines</h3>
      <ul>
        <li>Wave 2 never retraces more than 100% of wave 1.</li>
        <li>Wave 3 is never the shortest impulse wave.</li>
        <li>Wave 4 never overlaps wave 1 territory (in cash forex).</li>
      </ul>
      <p>These rules help you label waves correctly. Violations suggest your count is wrong.</p>
      <h3>Fibonacci Relationship</h3>
      <p>Elliott Wave and Fibonacci are deeply connected. Common retracements: wave 2 often retraces 50-61.8% of wave 1. Wave 4 often retraces 38.2% of wave 3.</p>
      <h3>Applying to Trading</h3>
      <p>Once you identify that wave 2 has completed, you can enter at the start of wave 3 with a stop below wave 1 low. Wave 3 is typically the most profitable. The challenge is correctly identifying the current wave in real time; it's easier in hindsight.</p>
      <h3>Practical Use</h3>
      <p>Many traders use Elliott Wave as a general framework rather than strict counting. For instance, if you suspect a wave 3 is beginning, you can be more aggressive in position sizing while managing risk.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Elliott Wave is subjective and takes years to master. Use it as a supplementary tool, not a standalone system.</div>
    `
  },
  {
    id: 18,
    title: "Forex Trading Plan and Journaling",
    duration: "40 min",
    content: `
      <h3>Why a Plan Matters</h3>
      <p>Similar to the Deriv plan, but adapted for forex. A forex trading plan should specify the currency pairs you trade, your session times, risk parameters, strategy details, and review schedule.</p>
      <h3>Components of a Forex Trading Plan</h3>
      <ul>
        <li><strong>Market and Pairs:</strong> e.g., "I will trade only EUR/USD during the London session."</li>
        <li><strong>Technical Setup:</strong> "I will enter long when the 50 EMA is above 200 EMA, price bounces off 50 EMA, and a bullish engulfing pattern forms on the 15-minute chart."</li>
        <li><strong>Risk:</strong> "Risk 1% per trade, stop loss at 1.5x ATR below entry, take profit at 2x risk."</li>
        <li><strong>Trading Hours:</strong> "8:00-12:00 GMT+3."</li>
        <li><strong>Review:</strong> "Daily journal, weekly performance review."</li>
      </ul>
      <h3>Journaling Specifics for Forex</h3>
      <p>Include the currency pair, direction, lot size, entry/exit price, pips gained/lost, the setup, and a screenshot. Over time, you'll see which setups work best.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> A plan and journal are non-negotiable for professional forex trading.</div>
    `
  },
  {
    id: 19,
    title: "Psychology of Forex Trading",
    duration: "50 min",
    content: `
      <h3>Unique Psychological Challenges</h3>
      <p>Forex is 24/5, which can lead to overtrading and burnout. The availability of high leverage tempts traders to take excessive risk. The constant flow of news can create FOMO.</p>
      <h3>Staying Disciplined</h3>
      <p>Set strict trading hours. Use smaller lot sizes to reduce emotional attachment. Accept that some days you'll lose; that's normal. Focus on the process, not the money.</p>
      <h3>Dealing with Drawdown</h3>
      <p>If you hit a 20% drawdown, cut your risk in half until equity recovers. This prevents the downward spiral of desperation.</p>
      <h3>Visualization and Mindfulness</h3>
      <p>Practice seeing yourself calmly executing your plan, accepting small losses, and sticking to rules. This mental rehearsal builds neural pathways that help in real situations.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Forex psychology is about discipline, patience, and emotional control. It's the differentiator between winners and losers.</div>
    `
  },
  {
    id: 20,
    title: "Scalping, Day Trading, Swing Trading",
    duration: "40 min",
    content: `
      <h3>Scalping</h3>
      <p>Very short-term trades (seconds to minutes). Aim for small profits (5-10 pips) with tight stops. Requires low spreads, fast execution, and intense focus. Not recommended for beginners due to high stress and transaction costs.</p>
      <h3>Day Trading</h3>
      <p>Positions opened and closed within the same day. Traders use 5-minute to 1-hour charts. No overnight risk. Good for those who can monitor markets throughout the day.</p>
      <h3>Swing Trading</h3>
      <p>Hold positions for several days to weeks, aiming for larger price swings. Uses 4-hour and daily charts. Less screen time, but requires wider stops and the ability to withstand overnight gaps.</p>
      <h3>Which Style is Right for You?</h3>
      <p>Consider your personality: if you're patient and don't like staring at screens, swing trading is ideal. If you thrive on fast action, day trading. But start with swing or day trading to learn, then adjust.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Choose a trading style that fits your lifestyle and personality. Don't force yourself into a style that causes stress.</div>
    `
  },
  {
    id: 21,
    title: "Advanced Risk Management Techniques",
    duration: "45 min",
    content: `
      <h3>Monte Carlo Simulation</h3>
      <p>A statistical method to model possible outcomes of your trading strategy based on random sequences of your historical trades. It can estimate the probability of drawdowns, helping you size positions appropriately. Some trading platforms and external tools offer this.</p>
      <h3>Value at Risk (VaR)</h3>
      <p>Measures the maximum loss expected over a given time period at a certain confidence level. For example, a daily VaR of $100 at 95% confidence means there's a 5% chance of losing more than $100 in a day. Professional traders use VaR to set risk limits.</p>
      <h3>Optimal f</h3>
      <p>A mathematical formula to determine the optimal fraction of capital to risk per trade to maximize growth. It often suggests higher risk than the 2% rule, but it can lead to large drawdowns. Most traders prefer a fixed fractional approach for its psychological comfort.</p>
      <h3>Dynamic Allocation</h3>
      <p>Adjust your total exposure based on recent performance and market volatility. In high-volatility environments, reduce position size. After a losing streak, reduce risk. This requires discipline but can smooth equity curves.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Risk management can be as simple or complex as you make it. The 1-2% rule is a golden standard that works for almost everyone.</div>
    `
  },
  {
    id: 22,
    title: "Intermarket Analysis",
    duration: "50 min",
    content: `
      <h3>What is Intermarket Analysis?</h3>
      <p>It studies the relationships between different asset classes: currencies, bonds, commodities, and stocks. For example, a rise in oil prices can benefit the Canadian dollar (CAD) because Canada is a major oil exporter. A rise in US bond yields can strengthen the USD.</p>
      <h3>Key Relationships</h3>
      <ul>
        <li><strong>USD and Gold:</strong> Typically inverse. When USD rises, gold falls (and vice versa).</li>
        <li><strong>USD and Commodities:</strong> Commodities are often priced in USD, so a stronger USD makes them more expensive, potentially reducing demand.</li>
        <li><strong>Bond Yields and Currencies:</strong> Higher yields attract capital flows, boosting the currency.</li>
        <li><strong>Stock Markets and Risk Sentiment:</strong> When stocks rise (risk-on), safe-haven currencies like JPY and CHF tend to weaken, while commodity currencies (AUD, NZD) strengthen.</li>
      </ul>
      <h3>Applying Intermarket Analysis</h3>
      <p>Before trading EUR/USD, check the German DAX index, US S&P 500, and US-German bond yield spread. If all align, your trade has more conviction. This is a holistic approach used by macro traders.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Markets are interconnected. A broader view improves your understanding and timing.</div>
    `
  },
  {
    id: 23,
    title: "Building a Diversified Forex Portfolio",
    duration: "40 min",
    content: `
      <h3>Why Diversify?</h3>
      <p>Trading multiple uncorrelated currency pairs reduces the impact of a single losing trade or a pair-specific event. For instance, if you trade EUR/USD, USD/JPY, and GBP/JPY, you have exposure to different economies, spreading risk.</p>
      <h3>Correlation Matrix</h3>
      <p>Use a correlation table to ensure you're not doubling risk. High positive correlation (0.8+) means pairs move together; avoid trading them in the same direction. Aim for pairs with low or negative correlation.</p>
      <h3>Allocation of Capital</h3>
      <p>Divide your total risk capital among the selected pairs. If you have a $3,000 account and risk 1% total ($30) across three pairs, each trade could risk 0.33% ($10). Alternatively, you can risk 1% per pair but ensure the pairs are not highly correlated.</p>
      <h3>Rebalancing</h3>
      <p>Over time, some pairs may generate more profits. You can reallocate capital, but avoid deviating from your risk per trade. The goal is steady growth, not maximizing one winner.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Diversification reduces risk without necessarily reducing returns. Use correlation to build an efficient portfolio.</div>
    `
  },
  {
    id: 24,
    title: "Forex Trading Tools and Platforms",
    duration: "35 min",
    content: `
      <h3>MT4 and MT5</h3>
      <p>MetaTrader 4 (MT4) is the most popular forex trading platform, known for its Expert Advisors (automated trading) and vast indicator library. MT5 is the newer version with more timeframes and built-in economic calendar.</p>
      <h3>TradingView</h3>
      <p>A web-based charting platform with a social network. It offers powerful drawing tools, Pine Script for creating custom indicators, and a large community sharing ideas. Many brokers integrate with TradingView.</p>
      <h3>cTrader</h3>
      <p>An alternative to MT4, offering advanced order types, depth of market, and a sleek interface. Preferred by some professional traders.</p>
      <h3>Position Size Calculators</h3>
      <p>Always use a calculator to determine lot size before entering. Many brokers provide them. A simple Google search for "forex position size calculator" yields many free options.</p>
      <h3>Economic Calendar</h3>
      <p>ForexFactory.com is the gold standard. Mark high-impact events and plan your trading around them.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Use the right tools to streamline your trading. A good platform and a reliable calendar are essential.</div>
    `
  },
  {
    id: 25,
    title: "Becoming a Full-Time Forex Trader",
    duration: "40 min",
    content: `
      <h3>Is It Possible?</h3>
      <p>Yes, but it's not easy. Full-time traders treat trading as a business. They have a large enough capital base to generate a livable income from a modest monthly return (e.g., 5% of a $100,000 account is $5,000/month). They have multiple years of consistent track record.</p>
      <h3>Financial Preparation</h3>
      <p>Never trade with money you need for living expenses. Have at least 6-12 months of living costs saved separately. If you're dependent on trading income to pay rent next month, you'll trade emotionally.</p>
      <h3>Business Plan</h3>
      <p>Write a full business plan including mission, goals, capital requirements, operational expenses (internet, data, education), risk management, and growth projections. This will keep you accountable.</p>
      <h3>Continuous Education</h3>
      <p>The markets evolve. Stay updated with financial news, read trading books, attend webinars. Join trading communities but be wary of false gurus.</p>
      <h3>Mental Health and Lifestyle</h3>
      <p>Trading can be isolating. Maintain a social life, exercise regularly, and have hobbies outside trading. A balanced life leads to better trading decisions.</p>
      <h3>The Ultimate Goal: Financial Freedom</h3>
      <p>The dream is to generate passive income and have the freedom to live life on your own terms. That's worth the effort. Stay disciplined, and you can achieve it.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Trading professionally is a marathon. Build skills, capital, and a solid plan before taking the leap.</div>
    `
  }
];

// ============================================
// MAIN COMPONENT
// ============================================

const Academy = () => {
  const [selectedCourse, setSelectedCourse] = useState(null); // 'deriv' or 'forex'
  const [completedLessons, setCompletedLessons] = useState({ deriv: [], forex: [] });

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const goBack = () => {
    setSelectedCourse(null);
  };

  const toggleLessonCompletion = (course, lessonId) => {
    setCompletedLessons(prev => {
      const courseLessons = prev[course] || [];
      const updated = courseLessons.includes(lessonId)
        ? courseLessons.filter(id => id !== lessonId)
        : [...courseLessons, lessonId];
      return { ...prev, [course]: updated };
    });
  };

  const scrollToLesson = (id) => {
    const element = document.getElementById(`lesson-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getCourseData = () => {
    return selectedCourse === 'deriv' ? derivLessons : forexLessons;
  };

  const getCourseProgress = () => {
    const lessons = getCourseData();
    const completed = completedLessons[selectedCourse]?.length || 0;
    return Math.round((completed / lessons.length) * 100) || 0;
  };

  // Course selection screen
  if (!selectedCourse) {
    return (
      <PageWrapper>
        <CourseSelection>
          <HeroText>
            <div className="badge">
              <GraduationCapIcon />
              Trading Education
            </div>
            <h1 className="title">
              Welcome to <span className="gradient">MyTradeApp Academy</span>
            </h1>
            <p className="subtitle">
              Master the art of trading with comprehensive courses designed for complete beginners.
              Choose your path and start learning today.
            </p>
          </HeroText>

          <CourseCards>
            <CourseCard 
              accent="#ff444f"
              onClick={() => handleSelectCourse('deriv')}
            >
              <div className="icon-wrapper">
                <DerivIcon />
              </div>
              <div className="card-title">Deriv Trading</div>
              <div className="card-desc">
                Learn everything about Deriv's platform, volatility indices, trade types, and advanced strategies. 25 in-depth lessons covering all aspects.
              </div>
              <div className="card-meta">
                <span className="meta-item">
                  <BookOpenIcon style={{width:14,height:14}} /> 25 Lessons
                </span>
                <span className="meta-item">
                  <ClockIcon style={{width:14,height:14}} /> ~20 Hours
                </span>
              </div>
            </CourseCard>

            <CourseCard 
              accent="#3b82f6"
              onClick={() => handleSelectCourse('forex')}
            >
              <div className="icon-wrapper">
                <ForexIcon />
              </div>
              <div className="card-title">Forex Trading</div>
              <div className="card-desc">
                Understand the world's largest financial market. Currency pairs, technical and fundamental analysis, risk management, and professional strategies. 25 comprehensive lessons.
              </div>
              <div className="card-meta">
                <span className="meta-item">
                  <BookOpenIcon style={{width:14,height:14}} /> 25 Lessons
                </span>
                <span className="meta-item">
                  <ClockIcon style={{width:14,height:14}} /> ~20 Hours
                </span>
              </div>
            </CourseCard>
          </CourseCards>
        </CourseSelection>

        <Footer>
          MyTradeApp Academy • Learn. Practice. Master.
        </Footer>
      </PageWrapper>
    );
  }

  // Course view
  const lessons = getCourseData();
  const courseTitle = selectedCourse === 'deriv' ? 'Deriv Trading' : 'Forex Trading';
  const courseAccent = selectedCourse === 'deriv' ? '#ff444f' : '#3b82f6';
  const progress = getCourseProgress();

  return (
    <PageWrapper>
      <CourseHeader>
        <button className="back-btn" onClick={goBack}>
          <ArrowLeftIcon />
        </button>
        <div className="course-info">
          <h2>{courseTitle}</h2>
          <div className="course-sub">{lessons.length} Lessons • {progress}% Complete</div>
        </div>
      </CourseHeader>

      <TOCSection>
        <div className="toc-title">
          <span className="icon"><TOCIcon /></span>
          Table of Contents
        </div>
        <div className="toc-grid">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="toc-item" 
              onClick={() => scrollToLesson(lesson.id)}
            >
              <span className="num">{lesson.id}.</span>
              <span className="label">{lesson.title}</span>
              <span className="status-icon">
                {completedLessons[selectedCourse]?.includes(lesson.id) 
                  ? <CheckCircleIcon style={{ color: '#22c55e' }} />
                  : <CircleIcon style={{ color: '#4a4f5e' }} />
                }
              </span>
            </div>
          ))}
        </div>
      </TOCSection>

      <LessonContainer>
        {lessons.map((lesson) => {
          const isCompleted = completedLessons[selectedCourse]?.includes(lesson.id);
          return (
            <LessonCard key={lesson.id} id={`lesson-${lesson.id}`}>
              <div className="lesson-header">
                <span className="lesson-number" style={{color: courseAccent, background: `${courseAccent}15`}}>
                  Lesson {lesson.id}
                </span>
                <span className="lesson-title">{lesson.title}</span>
                <span className="lesson-duration">
                  <ClockIcon style={{ width: '12px', height: '12px' }} />
                  {lesson.duration}
                </span>
                <button 
                  className="toggle-btn" 
                  onClick={() => toggleLessonCompletion(selectedCourse, lesson.id)}
                >
                  {isCompleted 
                    ? <CheckCircleIcon style={{ color: '#22c55e' }} />
                    : <CircleIcon style={{ color: '#64748b' }} />
                  }
                </button>
              </div>
              <div className="lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </LessonCard>
          );
        })}
      </LessonContainer>

      {progress === 100 && (
        <CompletionBanner>
          <div className="trophy-icon"><TrophyIcon /></div>
          <div className="title">Congratulations!</div>
          <div className="subtitle">
            You've completed the full {courseTitle} course! You're ready to apply your skills with confidence.
          </div>
        </CompletionBanner>
      )}

      <Footer>
        MyTradeApp Academy • Learn. Practice. Master.
      </Footer>
    </PageWrapper>
  );
};

export default Academy;