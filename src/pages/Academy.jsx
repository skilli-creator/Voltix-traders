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
// DERIV COURSE CONTENT (expanded lessons)
// ============================================
const derivLessons = [
  {
    id: 1,
    title: "What is Trading?",
    duration: "20 min",
    content: `
      <h3>Welcome to the World of Trading</h3>
      <p>Imagine you're at a local market. You see a farmer selling apples for $1 each. You know that across town, apples are selling for $2 each. You buy 100 apples for $100, take them across town, and sell them for $200. You just made $100 profit! Congratulations - you just traded!</p>
      <p>Trading, in its simplest form, is the act of buying something at a lower price and selling it at a higher price. The difference between the buy price and the sell price is your profit (or loss).</p>
      <div class="highlight-box">
        <strong>Core Concept:</strong><br>Trading = Buying Low + Selling High<br>or<br>Trading = Selling High + Buying Low (when shorting)
      </div>
      <h3>What Makes Prices Move?</h3>
      <p>Prices move because of supply and demand. Let's understand this with a simple example:</p>
      <div class="example-box">
        <strong>Supply & Demand Example:</strong><br>
        Imagine 100 people want to buy apples, but only 50 apples available.<br>
        • Demand = 100, Supply = 50<br>
        • Result: Price goes UP because more people want apples than are available.<br><br>
        Now imagine 50 people want to buy apples, but 100 apples available.<br>
        • Demand = 50, Supply = 100<br>
        • Result: Price goes DOWN because more apples than people want.
      </div>
      <h3>What is Deriv?</h3>
      <p>Deriv is a leading online trading platform that allows you to trade various financial instruments. It was created to make trading accessible to everyone, from complete beginners to experienced professionals.</p>
      <p>Deriv offers several types of trading accounts:</p>
      <ul>
        <li><strong>Demo Account:</strong> Virtual money for practice (highly recommended for beginners)</li>
        <li><strong>Real Account:</strong> Real money trading</li>
        <li><strong>Deriv X:</strong> Advanced trading platform for experts</li>
        <li><strong>Deriv GO:</strong> Mobile trading app</li>
      </ul>
      <h3>What Can You Trade on Deriv?</h3>
      <p>Deriv offers a wide variety of markets. Think of them like different "shops" in a mall:</p>
      <h4>1. Volatility Indices (Deriv's Speciality)</h4>
      <p>These are artificial markets created by Deriv using mathematical formulas. They don't exist in the real world, which makes them special:</p>
      <ul>
        <li><strong>No News Impact:</strong> Real-world news doesn't affect them</li>
        <li><strong>Always Open:</strong> Trade 24/7, 365 days a year</li>
        <li><strong>Predictable Movements:</strong> They follow mathematical patterns</li>
      </ul>
      <table>
        <tr><th>Index Name</th><th>Movement Speed</th><th>Risk Level</th><th>Best For</th></tr>
        <tr><td>Volatility 10</td><td>Slow</td><td>Very Low</td><td>Beginners</td></tr>
        <tr><td>Volatility 25</td><td>Moderate</td><td>Low</td><td>Beginners</td></tr>
        <tr><td>Volatility 50</td><td>Active</td><td>Medium</td><td>Intermediate</td></tr>
        <tr><td>Volatility 75</td><td>Fast</td><td>High</td><td>Advanced</td></tr>
        <tr><td>Volatility 100</td><td>Very Fast</td><td>Very High</td><td>Experts</td></tr>
      </table>
      <div class="highlight-box"><strong>Beginner Tip:</strong> Start with Volatility 10 or 25. They move slowly enough to learn without being overwhelmed.</div>
      <h4>2. Forex (Foreign Exchange)</h4>
      <p>Forex involves trading different currencies against each other. This is the largest financial market in the world!</p>
      <ul>
        <li><strong>EUR/USD:</strong> Euro vs US Dollar</li>
        <li><strong>GBP/USD:</strong> British Pound vs US Dollar</li>
        <li><strong>USD/JPY:</strong> US Dollar vs Japanese Yen</li>
        <li><strong>USD/CHF:</strong> US Dollar vs Swiss Franc</li>
        <li><strong>AUD/USD:</strong> Australian Dollar vs US Dollar</li>
      </ul>
      <h4>3. Commodities</h4>
      <ul>
        <li><strong>Gold (XAU/USD):</strong> A safe-haven asset</li>
        <li><strong>Silver (XAG/USD):</strong> Both industrial and precious metal</li>
        <li><strong>Oil (WTI, Brent):</strong> Crude oil, affected by global events</li>
      </ul>
      <h4>4. Cryptocurrencies</h4>
      <ul>
        <li><strong>Bitcoin (BTC/USD):</strong> The first and most well-known</li>
        <li><strong>Ethereum (ETH/USD):</strong> Second largest</li>
      </ul>
      <h3>Understanding Your Trading Account</h3>
      <div class="definition-box">
        <p><span class="term">Balance:</span> Total amount of money in your account.</p>
        <p><span class="term">Equity:</span> Current account value including open trades.</p>
        <p><span class="term">Free Margin:</span> Money available to open new trades.</p>
        <p><span class="term">Margin:</span> Money required to open a trade.</p>
        <p><span class="term">Leverage:</span> A loan that lets you trade with more money. Use with caution!</p>
      </div>
      <h3>Understanding Risk and Reward</h3>
      <div class="example-box">
        <strong>Risk & Reward Example:</strong><br>
        You place a $10 trade. Payout is $19.20.<br>
        • Risk: $10 (you lose $10 if wrong)<br>
        • Reward: $19.20 (you gain $19.20 if right)<br>
        • Risk/Reward Ratio: 1:1.92
      </div>
      <h3>The 3 Golden Rules of Trading</h3>
      <div class="success-box"><strong>Rule 1: Risk Only 2% Per Trade</strong><br>If you have $100, risk no more than $2 per trade.</div>
      <div class="success-box"><strong>Rule 2: Use a Demo Account First</strong><br>Practice until consistently profitable with virtual money.</div>
      <div class="success-box"><strong>Rule 3: Learn From Every Trade</strong><br>Write down what you did, why, and what happened.</div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Trading is buying low and selling high. Start with a demo account, risk only 2% per trade, and learn from every trade.</div>
    `
  },
  {
    id: 2,
    title: "Understanding Markets",
    duration: "25 min",
    content: `
      <h3>What Are Markets?</h3>
      <p>Think of markets like different departments in a store. Each has its own characteristics and risk levels.</p>
      <h3>Volatility Indices - The Beginner's Friend</h3>
      <p>Deriv's signature product, perfect for learning.</p>
      <h4>What is Volatility?</h4>
      <ul>
        <li><strong>Low Volatility:</strong> Light breeze - slow, gentle movements</li>
        <li><strong>High Volatility:</strong> Strong wind - fast, powerful movements</li>
      </ul>
      <div class="highlight-box"><strong>Why Volatility Indices are Great for Beginners:</strong><br>1. Always Open 2. No News Impact 3. Predictable 4. Flexible 5. Available 365 Days</div>
      <h3>Forex Markets</h3>
      <p>Forex always involves two currencies. You're buying one and selling another at the same time.</p>
      <div class="example-box">
        <strong>Forex Example:</strong><br>
        EUR/USD = 1.1000<br>
        If you think Euro will get stronger, BUY EUR/USD.<br>
        If you think Dollar will get stronger, SELL EUR/USD.
      </div>
      <p>Major Forex Pairs:</p>
      <table>
        <tr><th>Pair</th><th>Nickname</th></tr>
        <tr><td>EUR/USD</td><td>"Fiber"</td></tr>
        <tr><td>GBP/USD</td><td>"Cable"</td></tr>
        <tr><td>USD/JPY</td><td>"Ninja"</td></tr>
      </table>
      <h3>Commodity Markets</h3>
      <p>Gold, Silver, Oil. Prices influenced by real-world factors.</p>
      <h3>Cryptocurrency Markets</h3>
      <p>Digital assets with 24/7 trading.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Master ONE market first before trying others. Start with Volatility 10 or 25.</div>
    `
  },
  {
    id: 3,
    title: "Trade Types",
    duration: "25 min",
    content: `
      <h3>Understanding Trade Types</h3>
      <p>Think of trade types like different games you can play. On Deriv, you have four main types.</p>
      <h3>1. Over/Under (The Trend Game)</h3>
      <p>Predict whether the next price will be higher or lower.</p>
      <div class="definition-box"><p><span class="term">OVER:</span> Price will go UP.</p><p><span class="term">UNDER:</span> Price will go DOWN.</p></div>
      <div class="example-box"><strong>Example:</strong> Current: 8,459. Choose OVER if you think next price will be higher.</div>
      <h4>When to Choose OVER/UNDER</h4>
      <p>Trade with the trend: OVER in uptrend, UNDER in downtrend.</p>
      <h3>2. Even/Odd (The Number Game)</h3>
      <p>Predict if last digit will be even or odd. 50% chance each.</p>
      <h3>3. Matches/Differs (The Matching Game)</h3>
      <p>Pick a number (0-9) and predict if the last digit will match or differ.</p>
      <table>
        <tr><th>Choice</th><th>Winning Numbers</th><th>Probability</th></tr>
        <tr><td>MATCHES</td><td>1 specific number</td><td>10%</td></tr>
        <tr><td>DIFFERS</td><td>9 numbers (not your choice)</td><td>90%</td></tr>
      </table>
      <h3>4. Touch/No Touch (Advanced)</h3>
      <p>Predict if price will touch a specific level.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Each trade type has its own strategy. Over/Under is the most popular and beginner-friendly.</div>
    `
  },
  {
    id: 4,
    title: "Reading Charts",
    duration: "30 min",
    content: `
      <h3>Understanding Charts</h3>
      <p>Charts are the windows into the market. They show you where prices have been and where they might be going.</p>
      <h3>Candlestick Charts (Most Important)</h3>
      <p>Each candle shows open, high, low, close.</p>
      <div class="example-box"><strong>Candlestick Anatomy:</strong> Green/White = Price went UP. Red/Black = Price went DOWN. Long body = strong move. Long wicks = indecision.</div>
      <h3>The Three Market States</h3>
      <p>📈 Uptrend: higher highs and higher lows. 📉 Downtrend: lower highs and lower lows. ➡️ Sideways: price bounces between two levels.</p>
      <h3>Support and Resistance</h3>
      <p>Support: a floor where price tends to bounce up. Resistance: a ceiling where price tends to bounce down.</p>
      <h3>Technical Indicators</h3>
      <p>Moving Averages, RSI, MACD.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Learn to read candlestick patterns, support/resistance, and trendlines. Practice daily!</div>
    `
  },
  {
    id: 5,
    title: "Risk Management",
    duration: "25 min",
    content: `
      <h3>Why Risk Management is Everything</h3>
      <p>Protect your capital first. Make profits second.</p>
      <h3>The 2% Rule (Your Survival Guide)</h3>
      <div class="warning-box"><strong>Never risk more than 2% of your account on any single trade.</strong></div>
      <div class="example-box"><strong>Account: $1,000.</strong> Risk: $20 per trade. After 20 losses in a row, you still have $670!</div>
      <h3>The 6% Daily Rule</h3>
      <p>If you lose 6% of your account in one day, STOP TRADING.</p>
      <h3>Position Sizing</h3>
      <p>Deciding how much to risk on each trade.</p>
      <h3>Risk Psychology</h3>
      <p>Losses hurt more than wins feel good. Small losses are okay. Revenge trading is the #1 cause of big losses.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Follow the 2% rule, 6% daily rule, and always calculate your position size. Protect your capital first.</div>
    `
  },
  {
    id: 6,
    title: "Trading Psychology",
    duration: "20 min",
    content: `
      <h3>Your Mind is Your Most Powerful Trading Tool</h3>
      <p>Strategy = 25%, Risk Management = 25%, Psychology = 50%.</p>
      <h3>The 5 Psychological Traps</h3>
      <p>Fear, Greed, Revenge Trading, Overconfidence, Analysis Paralysis.</p>
      <h3>The Trading Journal</h3>
      <p>Write down every trade: what, why, feelings, lessons.</p>
      <h3>Building Trading Discipline</h3>
      <p>Daily habits: prepare, warm up, trade your plan, take breaks, review, learn, rest.</p>
      <h3>The "Stop" Signs</h3>
      <p>Angry? Frustrated? Lost 3 in a row? STOP.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Master your mind to master trading.</div>
    `
  },
  {
    id: 7,
    title: "Technical Indicators Deep Dive",
    duration: "35 min",
    content: `
      <h3>What Are Technical Indicators?</h3>
      <p>Technical indicators are mathematical calculations based on price, volume, or open interest. They help traders identify trends, momentum, volatility, and potential reversal points.</p>
      <p>Think of indicators as tools in a toolbox. You don't need to use every tool for every job. Pick a few that work for your strategy.</p>
      <h4>Categories of Indicators</h4>
      <ul>
        <li><strong>Trend Indicators:</strong> Moving Averages, Parabolic SAR. Help identify the direction.</li>
        <li><strong>Momentum Oscillators:</strong> RSI, Stochastic, MACD. Measure speed of price changes.</li>
        <li><strong>Volatility Indicators:</strong> Bollinger Bands, Average True Range (ATR). Show how much price moves.</li>
        <li><strong>Volume Indicators:</strong> On-Balance Volume (OBV), Chaikin Money Flow. Show buying/selling pressure.</li>
      </ul>
      <h3>Moving Averages (MA)</h3>
      <p>A moving average smooths price data to show the underlying trend. It's one of the most popular indicators.</p>
      <p><strong>Types:</strong></p>
      <ul>
        <li><strong>Simple Moving Average (SMA):</strong> Equal weight to all prices in the period.</li>
        <li><strong>Exponential Moving Average (EMA):</strong> More weight to recent prices, faster to react.</li>
      </ul>
      <p><strong>Common periods:</strong> 20 (short-term), 50 (medium-term), 200 (long-term). When a shorter MA crosses above a longer MA, it's a bullish signal (Golden Cross). Below is bearish (Death Cross).</p>
      <h3>Relative Strength Index (RSI)</h3>
      <p>RSI measures the magnitude of recent price changes to evaluate overbought or oversold conditions. It ranges from 0 to 100.</p>
      <ul>
        <li><strong>Overbought (above 70):</strong> Price may reverse down.</li>
        <li><strong>Oversold (below 30):</strong> Price may reverse up.</li>
        <li><strong>Divergence:</strong> Price makes new high but RSI makes lower high → bearish divergence.</li>
      </ul>
      <h3>Moving Average Convergence Divergence (MACD)</h3>
      <p>MACD consists of the MACD line (difference between 12 and 26 EMAs) and a signal line (9 EMA of MACD). The histogram shows the difference.</p>
      <p><strong>Signals:</strong> MACD line crosses above signal → buy. Below → sell. Also watch for divergences.</p>
      <h3>Bollinger Bands</h3>
      <p>Consist of a middle SMA and two standard deviation lines above and below. Price tends to stay within the bands. When bands squeeze, volatility is low and a breakout may be near. When price touches the upper band, it may be overbought; lower band, oversold.</p>
      <h3>How to Use Indicators Effectively</h3>
      <div class="highlight-box">
        <strong>Pro Tips:</strong>
        <ul>
          <li>Use 2-3 complementary indicators (e.g., one trend, one momentum).</li>
          <li>Don't overload your chart – too many indicators cause confusion.</li>
          <li>Always confirm signals with price action.</li>
          <li>Practice on a demo account to find the right combination.</li>
        </ul>
      </div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Indicators are tools, not crystal balls. Combine them with price action for better decision-making.</div>
    `
  },
  {
    id: 8,
    title: "Candlestick Patterns",
    duration: "30 min",
    content: `
      <h3>Why Candlestick Patterns Matter</h3>
      <p>Candlesticks reveal the psychology of the market. Each candle tells a story about who won the battle between buyers and sellers during that period.</p>
      <h3>Single Candlestick Patterns</h3>
      <ul>
        <li><strong>Doji:</strong> Open and close are nearly equal. Indecision. Could signal reversal.</li>
        <li><strong>Hammer:</strong> Small body, long lower wick. Appears in downtrend, bullish reversal.</li>
        <li><strong>Shooting Star:</strong> Small body, long upper wick. Appears in uptrend, bearish reversal.</li>
        <li><strong>Marubozu:</strong> Full body, no or very short wicks. Strong momentum (bullish if green, bearish if red).</li>
      </ul>
      <h3>Two-Candle Patterns</h3>
      <ul>
        <li><strong>Bullish Engulfing:</strong> Small red candle followed by large green candle that completely engulfs the red. Strong buy signal.</li>
        <li><strong>Bearish Engulfing:</strong> Small green followed by large red. Strong sell signal.</li>
        <li><strong>Tweezer Tops/Bottoms:</strong> Two candles with same high (top) or same low (bottom). Reversal signal.</li>
      </ul>
      <h3>Three-Candle Patterns</h3>
      <ul>
        <li><strong>Morning Star:</strong> Long red, small body (can be doji), long green. Bullish reversal.</li>
        <li><strong>Evening Star:</strong> Long green, small body, long red. Bearish reversal.</li>
        <li><strong>Three White Soldiers:</strong> Three consecutive long green candles with each closing higher. Strong uptrend.</li>
        <li><strong>Three Black Crows:</strong> Three consecutive long red candles. Strong downtrend.</li>
      </ul>
      <h3>How to Trade Candlestick Patterns</h3>
      <p>Patterns are more reliable when they appear at key support/resistance levels. Always wait for confirmation (e.g., next candle closes beyond pattern) before entering.</p>
      <div class="warning-box"><strong>Warning:</strong> Candlestick patterns alone are not enough. Combine with trend analysis and indicators.</div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Master a few high-probability patterns and use them to time entries/exits.</div>
    `
  },
  {
    id: 9,
    title: "Support and Resistance Mastery",
    duration: "30 min",
    content: `
      <h3>What Are Support and Resistance?</h3>
      <p>Support is a price level where buying interest is strong enough to prevent the price from falling further. Resistance is where selling pressure overcomes buying pressure, preventing the price from rising.</p>
      <p>They are the foundation of technical analysis because they represent key zones where traders make decisions.</p>
      <h3>How to Draw Support/Resistance</h3>
      <ul>
        <li>Look for areas where price has reversed multiple times.</li>
        <li>Use horizontal lines to mark these levels.</li>
        <li>More touches = stronger level.</li>
        <li>Previous support can become resistance after a breakdown, and vice versa.</li>
      </ul>
      <h3>Dynamic Support/Resistance</h3>
      <p>Moving averages can act as dynamic support/resistance. In an uptrend, the 50 EMA may serve as support. In a downtrend, it may act as resistance.</p>
      <h3>Trading Strategies Using S/R</h3>
      <ul>
        <li><strong>Bounce:</strong> Buy at support, sell at resistance, with stop just beyond.</li>
        <li><strong>Breakout:</strong> When price breaks a level decisively, trade in the breakout direction with a stop just inside the level.</li>
        <li><strong>Retest:</strong> After a breakout, price often returns to test the broken level (now flipped). Enter on the retest.</li>
      </ul>
      <div class="example-box">
        <strong>Example:</strong><br>
        Support: 8,400. Resistance: 8,500.<br>
        Price breaks above 8,500 with volume. Then pulls back to 8,500. Enter long at 8,500 with stop at 8,480.
      </div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Support and resistance are the most important concepts. Mark them on every chart you analyze.</div>
    `
  },
  {
    id: 10,
    title: "Developing a Trading Plan",
    duration: "25 min",
    content: `
      <h3>Why You Need a Trading Plan</h3>
      <p>A trading plan is a written set of rules that defines your trading strategy, risk management, and goals. It removes emotion and ensures consistency.</p>
      <h3>Components of a Trading Plan</h3>
      <ul>
        <li><strong>Market(s):</strong> Which market you will trade (e.g., Volatility 25).</li>
        <li><strong>Trade Type:</strong> Over/Under, etc.</li>
        <li><strong>Entry Criteria:</strong> What conditions must be met to enter (e.g., trend, pattern, indicator signal).</li>
        <li><strong>Exit Criteria:</strong> When to take profit (e.g., target, trailing stop).</li>
        <li><strong>Risk Management:</strong> Max risk per trade (2%), daily loss limit, max trades per day.</li>
        <li><strong>Trading Session:</strong> When you will trade (e.g., 9am-11am).</li>
        <li><strong>Performance Review:</strong> How often you'll review your trades.</li>
      </ul>
      <div class="example-box">
        <strong>Sample Plan:</strong><br>
        Market: Volatility 25<br>
        Trade Type: Over/Under, 1-tick duration<br>
        Entry: When 5 EMA crosses above 20 EMA and price is above 200 EMA (uptrend). Enter OVER.<br>
        Exit: Automatic at tick end. No early exit.<br>
        Risk: 2% of account per trade. Max 3 trades per day. Daily loss limit 6%.<br>
        Review: End of day, journal all trades.
      </div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Plan your trade and trade your plan. Without a plan, you're gambling.</div>
    `
  },
  {
    id: 11,
    title: "Money Management",
    duration: "20 min",
    content: `
      <h3>What is Money Management?</h3>
      <p>Money management is how you control your capital to minimize losses and maximize gains. It's the backbone of sustainable trading.</p>
      <h3>Key Principles</h3>
      <ul>
        <li><strong>Risk Per Trade:</strong> Never more than 2%. As account grows, absolute dollar risk increases but percentage stays constant.</li>
        <li><strong>Risk-Reward Ratio:</strong> Aim for at least 1:2. Over time, even a 40% win rate can be profitable.</li>
        <li><strong>Compound Growth:</strong> Reinvest profits. A 5% monthly return doubles your account in ~14 months.</li>
        <li><strong>Drawdown Control:</strong> After a losing streak, reduce position size until confidence and performance return.</li>
      </ul>
      <table>
        <tr><th>Account Size</th><th>2% Risk</th><th>Target Monthly Return (5%)</th></tr>
        <tr><td>$100</td><td>$2</td><td>$5</td></tr>
        <tr><td>$1,000</td><td>$20</td><td>$50</td></tr>
        <tr><td>$10,000</td><td>$200</td><td>$500</td></tr>
      </table>
      <div class="warning-box"><strong>Never risk more than you can afford to lose. Trading is not a get-rich-quick scheme.</strong></div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Consistent small gains add up. Protect your capital.</div>
    `
  },
  {
    id: 12,
    title: "Demo Trading Practice",
    duration: "15 min",
    content: `
      <h3>Why Demo Trading is Crucial</h3>
      <p>A demo account lets you trade with virtual money in real market conditions. It's your training ground.</p>
      <h3>How to Use a Demo Account</h3>
      <ol>
        <li>Open a free Deriv demo account.</li>
        <li>Set the virtual balance to the amount you plan to deposit later.</li>
        <li>Treat it like real money. Follow your trading plan strictly.</li>
        <li>Track every trade in a journal.</li>
        <li>Only move to a real account after you've achieved at least 2 weeks of consistent profitability (win rate >55% and positive P&L).</li>
      </ol>
      <div class="success-box"><strong>Goal:</strong> Prove your strategy works before risking real capital.</div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Demo trading is the bridge between learning and earning. Don't skip it.</div>
    `
  },
  {
    id: 13,
    title: "Real Account Transition",
    duration: "15 min",
    content: `
      <h3>When to Go Real</h3>
      <p>Only after you've demonstrated discipline and consistent results on demo for at least 4 weeks.</p>
      <h3>First Real Trade Checklist</h3>
      <ul>
        <li>Start with the smallest possible stake.</li>
        <li>Risk only 1% per trade initially to adjust to the psychological difference.</li>
        <li>Continue journaling.</li>
        <li>Stick to your plan – don't let emotions take over.</li>
      </ul>
      <p>The biggest difference is the psychological weight of real money. Accept that you may feel fear or greed. Acknowledge and manage it.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Transition slowly. There's no rush.</div>
    `
  },
  {
    id: 14,
    title: "Common Trading Mistakes",
    duration: "20 min",
    content: `
      <h3>Mistakes That Destroy Accounts</h3>
      <ul>
        <li><strong>No Stop Loss:</strong> One bad trade wipes out gains.</li>
        <li><strong>Revenge Trading:</strong> Trying to recover losses leads to bigger losses.</li>
        <li><strong>Overtrading:</strong> Too many trades, no edge.</li>
        <li><strong>Ignoring the Trend:</strong> Fighting the market.</li>
        <li><strong>Emotional Trading:</strong> Fear and greed override logic.</li>
        <li><strong>Position Sizing Too Large:</strong> Risking too much per trade.</li>
      </ul>
      <h3>How to Avoid Them</h3>
      <p>Stick to your plan, keep a journal, and review your trades weekly. If you see patterns of mistakes, take a break.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Learn from mistakes, don't repeat them.</div>
    `
  },
  {
    id: 15,
    title: "Advanced Over/Under Strategies",
    duration: "30 min",
    content: `
      <h3>Beyond Basic Over/Under</h3>
      <p>Once you understand trends, you can refine your entries.</p>
      <h4>Strategy 1: Moving Average Crossover with Momentum</h4>
      <p>Use 5 EMA and 20 EMA. When 5 crosses above 20 and RSI > 50, enter OVER on a 1-tick trade. Opposite for UNDER.</p>
      <h4>Strategy 2: Support/Resistance Bounce</h4>
      <p>Wait for price to touch a key support level. Look for a bullish candle pattern (hammer, engulfing). Enter OVER. Use tight stops (few ticks).</p>
      <h4>Strategy 3: Breakout Retest</h4>
      <p>When price breaks a resistance level, wait for a pullback to that level (now support). Confirm with a bullish candle, then enter OVER.</p>
      <h4>Strategy 4: News-Free Zones</h4>
      <p>Volatility indices are unaffected by news, but major forex news can impact trader sentiment. For pure Deriv trading, focus on chart patterns.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Combine multiple confirmations to increase your edge.</div>
    `
  },
  {
    id: 16,
    title: "Advanced Matches/Differs Strategies",
    duration: "25 min",
    content: `
      <h3>Matches/Differs Deep Dive</h3>
      <p>This trade type can be used strategically, not just gambling.</p>
      <h4>DIFFERS as a Base Strategy</h4>
      <p>Since DIFFERS has a 90% probability per digit, some traders use it as a compounding strategy. Risk small amounts (1% of account) and aim for many consecutive wins.</p>
      <div class="warning-box"><strong>Warning:</strong> Even with 90% win rate, a losing streak can happen. Always stick to position sizing.</div>
      <h4>Number Selection Based on Statistics</h4>
      <p>After many ticks, digits tend to distribute evenly. If digit "5" has appeared less frequently recently, MATCHES on 5 could be a statistical play, but it's still random.</p>
      <h4>Combining with Trend</h4>
      <p>When price is in a strong uptrend, the last digits may follow a pattern (e.g., higher numbers more often). Keep a log to see if there's a bias.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Treat Matches/Differs as a probability game, not a prediction. Manage risk accordingly.</div>
    `
  },
  {
    id: 17,
    title: "Introduction to Deriv X",
    duration: "20 min",
    content: `
      <h3>What is Deriv X?</h3>
      <p>Deriv X is a more advanced trading platform by Deriv. It offers CFDs (Contracts for Difference) on forex, commodities, crypto, and synthetic indices.</p>
      <p>It's designed for experienced traders who want more control, advanced charting tools, and the ability to set stop-loss/take-profit levels.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Multiple chart types and timeframes.</li>
        <li>Over 80 indicators.</li>
        <li>Customizable layouts.</li>
        <li>Risk management tools.</li>
        <li>One-click trading.</li>
      </ul>
      <p>Start with a demo account on Deriv X to learn the interface before trading real money.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Deriv X is for advanced traders. Master the basics first.</div>
    `
  },
  {
    id: 18,
    title: "Using Derivatives for Hedging",
    duration: "25 min",
    content: `
      <h3>What is Hedging?</h3>
      <p>Hedging is a strategy to reduce risk by taking an offsetting position. For example, if you have a long position in EUR/USD on a standard forex account, you could short a correlated pair on Deriv to reduce exposure.</p>
      <h3>Hedging with Volatility Indices</h3>
      <p>Volatility indices are not directly correlated to real-world assets, so they can be used as a hedge when markets are unpredictable. If your main portfolio is stocks, you could trade an index on Deriv during high-volatility periods to protect gains.</p>
      <h3>Practical Example</h3>
      <p>You own gold ETF shares. When economic uncertainty rises, gold price may drop due to a strong USD. You could take a short position on XAU/USD on Deriv to offset potential losses.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Hedging can protect your capital, but it's an advanced technique. Learn it thoroughly before applying.</div>
    `
  },
  {
    id: 19,
    title: "Trading Journal Best Practices",
    duration: "20 min",
    content: `
      <h3>Why a Journal is Essential</h3>
      <p>A trading journal helps you identify patterns in your decision-making, both good and bad. It's the single most effective tool for improvement.</p>
      <h3>What to Record</h3>
      <ul>
        <li>Date and time of trade</li>
        <li>Market and trade type</li>
        <li>Entry and exit price</li>
        <li>Stake and P&L</li>
        <li>Reason for entry (setup, pattern, indicators)</li>
        <li>Emotions during trade (fear, confidence, doubt)</li>
        <li>Screenshot of chart at entry</li>
        <li>What went well / what could be improved</li>
      </ul>
      <h3>How to Use the Journal</h3>
      <p>At the end of each week, review your journal. Look for: winning setups, losing setups, emotional triggers. Adjust your plan based on data.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> A journal turns trading from random chance into a measurable skill.</div>
    `
  },
  {
    id: 20,
    title: "The Journey to Consistent Profitability",
    duration: "20 min",
    content: `
      <h3>It's a Marathon, Not a Sprint</h3>
      <p>Most new traders fail because they expect quick riches. Success in trading takes months or years of practice, discipline, and continuous learning.</p>
      <h3>Stages of a Trader</h3>
      <ol>
        <li><strong>Unconscious Incompetence:</strong> You don't know what you don't know. (Many beginners)</li>
        <li><strong>Conscious Incompetence:</strong> You realize how much there is to learn.</li>
        <li><strong>Conscious Competence:</strong> You can trade profitably with effort and focus.</li>
        <li><strong>Unconscious Competence:</strong> Skills become second nature.</li>
      </ol>
      <p>Most profitable traders have been through this journey. Stay humble, keep learning, and never stop improving.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> The path to mastery is long but rewarding. Embrace the journey.</div>
    `
  }
];

// ============================================
// FOREX COURSE CONTENT (expanded lessons)
// ============================================
const forexLessons = [
  {
    id: 1,
    title: "Forex Fundamentals",
    duration: "20 min",
    content: `
      <h3>What is Forex Trading?</h3>
      <p>Forex (Foreign Exchange) is the global marketplace for trading national currencies. With a daily trading volume exceeding $7 trillion, it's the world's largest financial market.</p>
      <p>Unlike stocks, forex trading happens 24 hours a day, 5 days a week, across major financial centers: Sydney, Tokyo, London, New York.</p>
      <h3>How Currency Pairs Work</h3>
      <p>Forex is always traded in pairs: EUR/USD, GBP/JPY, etc. You buy one currency and sell another simultaneously.</p>
      <div class="definition-box">
        <p><span class="term">Base Currency:</span> The first currency in the pair (e.g., EUR in EUR/USD).</p>
        <p><span class="term">Quote Currency:</span> The second currency (e.g., USD).</p>
        <p><span class="term">Exchange Rate:</span> How much of the quote currency is needed to buy one unit of the base currency.</p>
      </div>
      <div class="example-box">
        <strong>Example:</strong><br>
        EUR/USD = 1.1000<br>
        This means 1 Euro = 1.10 US Dollars. If you buy EUR/USD, you're buying Euros and selling Dollars.
      </div>
      <h3>Major, Minor, and Exotic Pairs</h3>
      <ul>
        <li><strong>Major Pairs:</strong> Always include USD and another major currency (EUR/USD, GBP/USD, USD/JPY). Most liquid.</li>
        <li><strong>Minor Pairs:</strong> Don't include USD (e.g., EUR/GBP, GBP/JPY).</li>
        <li><strong>Exotic Pairs:</strong> Major currency + emerging market currency (e.g., USD/TRY, EUR/ZAR). High spreads.</li>
      </ul>
      <h3>What Moves Forex Markets?</h3>
      <ul>
        <li><strong>Interest Rates:</strong> Higher rates → currency strengthens.</li>
        <li><strong>Economic Data:</strong> GDP, employment, inflation.</li>
        <li><strong>Geopolitical Events:</strong> Elections, wars, trade deals.</li>
        <li><strong>Market Sentiment:</strong> Fear/greed drives price.</li>
      </ul>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Forex is the largest market in the world. Start with major pairs. Understand what moves currencies.</div>
    `
  },
  {
    id: 2,
    title: "Currency Pairs & Quotes",
    duration: "25 min",
    content: `
      <h3>Reading a Forex Quote</h3>
      <p>A typical quote looks like: GBP/USD 1.3100/1.3102.</p>
      <ul>
        <li><strong>Bid:</strong> Price you can sell at (1.3100).</li>
        <li><strong>Ask:</strong> Price you can buy at (1.3102).</li>
        <li><strong>Spread:</strong> Difference (0.0002 = 2 pips).</li>
      </ul>
      <h3>What is a Pip?</h3>
      <p>A pip (percentage in point) is the smallest standard price movement. For most pairs, it's the fourth decimal place (0.0001). For JPY pairs, it's the second (0.01).</p>
      <div class="example-box">
        <strong>Pip Calculation:</strong><br>
        EUR/USD moves from 1.1000 to 1.1005 = 5 pips.<br>
        USD/JPY moves from 110.00 to 110.30 = 30 pips.
      </div>
      <h3>Lot Sizes</h3>
      <ul>
        <li><strong>Standard Lot:</strong> 100,000 units of base currency.</li>
        <li><strong>Mini Lot:</strong> 10,000 units.</li>
        <li><strong>Micro Lot:</strong> 1,000 units.</li>
      </ul>
      <p>Most retail traders use mini or micro lots to control risk.</p>
      <h3>Bid/Ask Spread</h3>
      <p>The spread is the broker's fee. Lower spread = better for traders. Major pairs usually have spreads of 0-3 pips.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Understand pips and lots. They determine your profit or loss on each trade.</div>
    `
  },
  {
    id: 3,
    title: "Technical Analysis",
    duration: "30 min",
    content: `
      <h3>Why Technical Analysis?</h3>
      <p>Technical analysis uses historical price data to predict future movements. It's especially useful in forex because fundamentals can change slowly but price patterns repeat.</p>
      <h3>Key Chart Types</h3>
      <ul>
        <li><strong>Candlestick Charts:</strong> Most popular, shows open/high/low/close.</li>
        <li><strong>Line Charts:</strong> Simple, closing prices only.</li>
        <li><strong>Bar Charts:</strong> OHLC data.</li>
      </ul>
      <h3>Important Patterns</h3>
      <ul>
        <li><strong>Head and Shoulders:</strong> Trend reversal pattern.</li>
        <li><strong>Double Top/Bottom:</strong> Strong reversal signals.</li>
        <li><strong>Triangles:</strong> Consolidation before breakout.</li>
      </ul>
      <h3>Indicators</h3>
      <ul>
        <li><strong>Moving Averages:</strong> Smooth price to show trend.</li>
        <li><strong>RSI:</strong> Overbought/oversold (above 70, below 30).</li>
        <li><strong>Bollinger Bands:</strong> Volatility and potential reversals.</li>
        <li><strong>MACD:</strong> Momentum and trend strength.</li>
      </ul>
      <div class="success-box">
        <strong>Tip:</strong> Don't overload your chart with indicators. Use 2-3 that you understand well.
      </div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Technical analysis helps you find high-probability trade setups. Practice reading charts daily.</div>
    `
  },
  {
    id: 4,
    title: "Fundamental Analysis",
    duration: "25 min",
    content: `
      <h3>What is Fundamental Analysis?</h3>
      <p>Fundamental analysis evaluates a currency's value based on economic, political, and social factors. It's about understanding the "why" behind price moves.</p>
      <h3>Key Economic Indicators</h3>
      <ul>
        <li><strong>Interest Rate Decisions:</strong> Central banks set rates. Higher rates attract foreign investment → currency strengthens.</li>
        <li><strong>Gross Domestic Product (GDP):</strong> Measures economic growth.</li>
        <li><strong>Employment Data:</strong> Non-farm payrolls (US), unemployment rate.</li>
        <li><strong>Inflation (CPI):</strong> Rising inflation can lead to rate hikes.</li>
        <li><strong>Retail Sales:</strong> Consumer spending health.</li>
      </ul>
      <h3>Central Banks</h3>
      <ul>
        <li><strong>Federal Reserve (Fed):</strong> US central bank.</li>
        <li><strong>European Central Bank (ECB):</strong> Eurozone.</li>
        <li><strong>Bank of England (BoE):</strong> UK.</li>
        <li><strong>Bank of Japan (BoJ):</strong> Japan.</li>
      </ul>
      <p>Pay attention to their statements and minutes – they drive forex trends.</p>
      <h3>Economic Calendar</h3>
      <p>Use an economic calendar to track upcoming news releases. High-impact events can cause sharp price movements.</p>
      <div class="warning-box">
        <strong>Warning:</strong> Trading during major news releases can be risky. Spreads widen and slippage occurs. Beginners should avoid trading 15 minutes before/after high-impact news.
      </div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Combine technical and fundamental analysis for a complete trading strategy.</div>
    `
  },
  {
    id: 5,
    title: "Risk Management in Forex",
    duration: "25 min",
    content: `
      <h3>The Golden Rule</h3>
      <p>Never risk more than 1-2% of your account on a single trade. This preserves your capital during losing streaks.</p>
      <h3>Stop Loss & Take Profit</h3>
      <ul>
        <li><strong>Stop Loss:</strong> Automatically closes a losing trade at a predetermined level.</li>
        <li><strong>Take Profit:</strong> Automatically closes a winning trade at your target.</li>
      </ul>
      <p>Always use a stop loss. Never move it further from entry – only to lock in profits.</p>
      <h3>Leverage – Double-Edged Sword</h3>
      <p>Leverage amplifies both gains and losses. Example: 1:100 leverage means you control $100,000 with only $1,000. A 1% move against you wipes out your capital.</p>
      <div class="warning-box"><strong>High leverage is dangerous.</strong> Many traders lose money because of excessive leverage. Start with low leverage (1:10 or less).</div>
      <h3>Risk-Reward Ratio</h3>
      <p>Aim for a minimum 1:2 ratio: risk 1 to make 2. Even with a 40% win rate, you can be profitable.</p>
      <h3>Daily Loss Limit</h3>
      <p>Set a maximum daily loss (e.g., 5% of account). Once hit, stop trading. Revenge trading destroys accounts.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Capital preservation is priority #1. Always use stops, control leverage, and set daily loss limits.</div>
    `
  },
  {
    id: 6,
    title: "Forex Trading Strategies",
    duration: "20 min",
    content: `
      <h3>Popular Strategies for Beginners</h3>
      <h4>1. Trend Following</h4>
      <p>"The trend is your friend." Buy in an uptrend, sell in a downtrend. Use moving averages to confirm direction.</p>
      <h4>2. Breakout Trading</h4>
      <p>Identify key support/resistance levels. Enter when price breaks out with momentum. Confirm with volume or candlestick patterns.</p>
      <h4>3. Range Trading</h4>
      <p>When price moves between clear support and resistance, buy at support and sell at resistance. Stop out if the level breaks.</p>
      <h4>4. News Trading (Advanced)</h4>
      <p>Trade based on economic news releases. Requires quick execution and understanding of market expectations. Risky for new traders.</p>
      <div class="highlight-box">
        <strong>Advice:</strong> Start with trend following. It's simple, effective, and keeps you on the right side of the market.
      </div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Pick one strategy, master it on a demo account, then trade it consistently.</div>
    `
  },
  {
    id: 7,
    title: "Understanding Leverage and Margin",
    duration: "20 min",
    content: `
      <h3>What is Leverage?</h3>
      <p>Leverage allows you to control a larger position with a smaller amount of capital. It's expressed as a ratio (e.g., 1:50).</p>
      <p><strong>Example:</strong> With 1:100 leverage, a $1,000 account can control $100,000 worth of currency.</p>
      <h3>Margin</h3>
      <p>Margin is the amount of capital required to open a leveraged position. If you want to trade $100,000 with 1:100 leverage, you need $1,000 margin.</p>
      <h3>Margin Call</h3>
      <p>If your position moves against you and your equity falls below the required margin, your broker may issue a margin call, asking you to deposit more funds or close the position. If not met, positions may be automatically liquidated.</p>
      <div class="warning-box"><strong>Use leverage responsibly.</strong> It magnifies both profits and losses. Many beginners blow their accounts because of excessive leverage.</div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Understand how leverage works before using it. Start with low leverage.</div>
    `
  },
  {
    id: 8,
    title: "Order Types",
    duration: "15 min",
    content: `
      <h3>Market Order</h3>
      <p>Buy or sell immediately at the current market price.</p>
      <h3>Limit Order</h3>
      <p>Set a specific price to enter (e.g., buy EUR/USD at 1.1000 when current is 1.1050). Only executes if price reaches that level.</p>
      <h3>Stop Order</h3>
      <p>A stop order becomes a market order once a specified price is reached. Often used for stop-loss or entry on breakouts.</p>
      <h3>Stop-Loss Order</h3>
      <p>Automatically exits a losing trade at a predetermined price to limit losses.</p>
      <h3>Take-Profit Order</h3>
      <p>Automatically exits a winning trade at a target price to lock in profits.</p>
      <h3>Trailing Stop</h3>
      <p>A stop-loss that moves with the price as it moves in your favor, locking in more profit.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Use orders to manage trades without constant screen watching.</div>
    `
  },
  {
    id: 9,
    title: "Chart Patterns",
    duration: "25 min",
    content: `
      <h3>Continuation Patterns</h3>
      <ul>
        <li><strong>Flags and Pennants:</strong> Brief pause during a strong trend, then continuation.</li>
        <li><strong>Wedges:</strong> Rising wedge (bearish), falling wedge (bullish).</li>
      </ul>
      <h3>Reversal Patterns</h3>
      <ul>
        <li><strong>Head and Shoulders:</strong> Three peaks, middle highest. Break below neckline signals reversal.</li>
        <li><strong>Double Top/Bottom:</strong> Two failed attempts to break a level, then reversal.</li>
        <li><strong>Rounding Bottom:</strong> Slow shift from downtrend to uptrend.</li>
      </ul>
      <h3>How to Trade Patterns</h3>
      <p>Wait for pattern completion and a confirmed breakout. Measure the height of the pattern to set a price target.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Patterns provide a visual map of market psychology. Combine with other tools.</div>
    `
  },
  {
    id: 10,
    title: "Fibonacci Trading",
    duration: "20 min",
    content: `
      <h3>What is Fibonacci?</h3>
      <p>Fibonacci retracements are based on key ratios: 23.6%, 38.2%, 50%, 61.8%, and 78.6%. Traders use them to predict potential support/resistance levels during a pullback.</p>
      <p>How to draw: In an uptrend, draw from swing low to swing high. The retracement levels show where price might bounce back up.</p>
      <div class="example-box">
        <strong>Example:</strong> EUR/USD rallies from 1.1000 to 1.1200. Retracement to 61.8% = 1.1124. If price bounces from that level, it's a potential buy.
      </div>
      <h3>Fibonacci Extensions</h3>
      <p>Used to set profit targets. Common levels: 127.2%, 161.8%.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Fibonacci works well in trending markets when combined with other confirmations.</div>
    `
  },
  {
    id: 11,
    title: "Moving Averages and Trends",
    duration: "20 min",
    content: `
      <h3>Using Moving Averages to Define Trend</h3>
      <p>A simple rule: Price above 200 EMA = long-term uptrend. Below = downtrend.</p>
      <p>For shorter trends, use 20 and 50 EMAs. When 20 > 50, short-term uptrend.</p>
      <h3>Moving Average Crossover</h3>
      <p>When a faster MA crosses above a slower MA, it's a buy signal. Below, sell.</p>
      <h3>Dynamic Support/Resistance</h3>
      <p>MAs can act as support in uptrend and resistance in downtrend.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> MAs are foundational. Use them to stay in the direction of the trend.</div>
    `
  },
  {
    id: 12,
    title: "Oscillators (RSI, MACD, Stochastics)",
    duration: "25 min",
    content: `
      <h3>RSI (Relative Strength Index)</h3>
      <p>Measures speed and change of price movements. Ranges 0-100. Above 70 overbought, below 30 oversold.</p>
      <h3>Stochastic Oscillator</h3>
      <p>Compares closing price to price range over a period. Overbought >80, oversold <20. Two lines: %K (fast) and %D (slow).</p>
      <h3>MACD Revisited</h3>
      <p>Also an oscillator. Crossovers, divergences, and zero-line crossover are signals.</p>
      <div class="highlight-box">
        <strong>Divergence:</strong> When price makes a higher high but RSI makes a lower high → bearish divergence. Powerful reversal signal.
      </div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Oscillators help identify overbought/oversold conditions and potential reversals.</div>
    `
  },
  {
    id: 13,
    title: "Bollinger Bands",
    duration: "15 min",
    content: `
      <h3>Components</h3>
      <p>Middle band = 20-period SMA. Upper and lower bands = 2 standard deviations from middle.</p>
      <h3>How to Use</h3>
      <ul>
        <li>Price touching upper band → overbought (potential sell).</li>
        <li>Price touching lower band → oversold (potential buy).</li>
        <li>Band squeeze → low volatility, breakout imminent.</li>
        <li>Band expansion → high volatility, trend continuation.</li>
      </ul>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Bollinger Bands are great for volatility analysis and reversal trades in ranging markets.</div>
    `
  },
  {
    id: 14,
    title: "Japanese Candlesticks",
    duration: "20 min",
    content: `
      <h3>Recap of Key Patterns</h3>
      <p>Doji, Hammer, Shooting Star, Engulfing, Morning/Evening Star.</p>
      <h3>Additional Patterns</h3>
      <ul>
        <li><strong>Piercing Line:</strong> Bullish reversal. Red candle, then green opens below previous low and closes above 50% of prior red.</li>
        <li><strong>Dark Cloud Cover:</strong> Bearish reversal. Green, then red opens above prior high and closes below 50% of prior green.</li>
      </ul>
      <p>Context matters: candlestick patterns are more reliable at key S/R levels.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Candlesticks reflect market sentiment. Use them with other analysis.</div>
    `
  },
  {
    id: 15,
    title: "Economic Calendar Trading",
    duration: "20 min",
    content: `
      <h3>How to Trade News Events</h3>
      <p>High-impact news (NFP, interest rate decisions) can cause massive volatility. Some traders avoid it; others trade the spike.</p>
      <h4>Straddle Strategy</h4>
      <p>Place a buy stop above resistance and a sell stop below support before news. One order triggers if price breaks out. Risk management is crucial.</p>
      <h4>Fade the Spike</h4>
      <p>After an initial spike, price often retraces. Trade in the opposite direction after a reversal pattern.</p>
      <div class="warning-box"><strong>Not recommended for beginners.</strong> Slippage and whipsaws can cause large losses.</div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Understand the event's expected impact vs actual to trade news effectively.</div>
    `
  },
  {
    id: 16,
    title: "Central Bank Policies",
    duration: "20 min",
    content: `
      <h3>Why Central Banks Matter</h3>
      <p>Central banks control monetary policy. Their decisions on interest rates, quantitative easing, and forward guidance directly affect currency values.</p>
      <h3>Key Central Banks</h3>
      <ul>
        <li><strong>Federal Reserve (Fed):</strong> Dual mandate - maximum employment, stable prices.</li>
        <li><strong>ECB:</strong> Price stability in Eurozone.</li>
        <li><strong>BoE:</strong> UK's monetary authority.</li>
        <li><strong>BoJ:</strong> Known for ultra-loose policy.</li>
        <li><strong>RBA (Australia), RBNZ (New Zealand), BOC (Canada).</strong></li>
      </ul>
      <p>When a central bank is hawkish (signals rate hikes), the currency strengthens. Dovish (rate cuts) weakens it.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Follow central bank announcements to anticipate long-term forex trends.</div>
    `
  },
  {
    id: 17,
    title: "Carry Trade Strategy",
    duration: "15 min",
    content: `
      <h3>What is a Carry Trade?</h3>
      <p>You borrow a currency with a low interest rate and invest in a currency with a high interest rate, profiting from the interest rate differential.</p>
      <p>Example: Borrow JPY (low rate) to buy AUD (high rate). You earn the interest difference as long as the exchange rate doesn't move against you.</p>
      <div class="warning-box"><strong>Risk:</strong> Exchange rate volatility can wipe out interest gains. Use stops.</div>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Carry trades work best in stable, trending markets. Monitor central bank rate changes.</div>
    `
  },
  {
    id: 18,
    title: "Scalping vs Day Trading vs Swing Trading",
    duration: "20 min",
    content: `
      <h3>Scalping</h3>
      <p>Very short-term trades (seconds to minutes). High frequency, small profits. Requires low spreads and fast execution. Stressful.</p>
      <h3>Day Trading</h3>
      <p>Trades opened and closed within the same day. No overnight positions. Less stress than scalping, but requires focus during session.</p>
      <h3>Swing Trading</h3>
      <p>Positions held for days to weeks, capturing larger price swings. Less screen time, but requires patience and wider stops.</p>
      <h3>Which is Best for You?</h3>
      <p>Beginners often start with swing trading on higher timeframes (4H, daily) to avoid noise. Day trading is popular for those with more time.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Choose a style that fits your personality, schedule, and risk tolerance.</div>
    `
  },
  {
    id: 19,
    title: "Correlation Between Pairs",
    duration: "15 min",
    content: `
      <h3>Positive Correlation</h3>
      <p>Pairs that move in the same direction. Example: EUR/USD and GBP/USD often move together because both are against USD.</p>
      <h3>Negative Correlation</h3>
      <p>Pairs that move opposite. Example: EUR/USD and USD/CHF (strong negative correlation).</p>
      <p>Understanding correlation helps avoid doubling risk (trading two positively correlated pairs in the same direction) and for hedging.</p>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Always check correlation when trading multiple pairs to manage overall exposure.</div>
    `
  },
  {
    id: 20,
    title: "Trading Psychology for Forex",
    duration: "20 min",
    content: `
      <h3>Emotions in Forex</h3>
      <p>The forex market is 24/5, always moving. This can trigger overtrading and FOMO.</p>
      <h3>Key Psychological Challenges</h3>
      <ul>
        <li><strong>Impatience:</strong> Entering trades before setup is complete.</li>
        <li><strong>Greed:</strong> Holding too long, not taking profits.</li>
        <li><strong>Fear:</strong> Closing winning trades too early.</li>
        <li><strong>Revenge:</strong> After a loss, immediately enter another trade to recover.</li>
      </ul>
      <h3>How to Build Mental Fortitude</h3>
      <ul>
        <li>Meditate or do deep breathing before trading sessions.</li>
        <li>Stick to your plan regardless of outcome.</li>
        <li>Accept losses as part of business.</li>
        <li>Take regular breaks.</li>
      </ul>
      <div class="key-takeaway"><strong>Key Takeaway:</strong> Master your mind, or the market will master you.</div>
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
                Learn everything about Deriv's platform, volatility indices, trade types, and winning strategies. 20 in-depth lessons.
              </div>
              <div className="card-meta">
                <span className="meta-item">
                  <BookOpenIcon style={{width:14,height:14}} /> 20 Lessons
                </span>
                <span className="meta-item">
                  <ClockIcon style={{width:14,height:14}} /> ~10 Hours
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
                Understand the world's largest financial market. Currency pairs, analysis, risk management, and advanced strategies. 20 comprehensive lessons.
              </div>
              <div className="card-meta">
                <span className="meta-item">
                  <BookOpenIcon style={{width:14,height:14}} /> 20 Lessons
                </span>
                <span className="meta-item">
                  <ClockIcon style={{width:14,height:14}} /> ~10 Hours
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