// src/pages/Academy.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

// ============================================
// STYLED COMPONENTS - UPDATED WITH THEME
// ============================================

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 20px;
  overflow-y: auto;
  transition: background 0.3s ease;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textMuted};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    color: ${props => props.theme.colors.text};
    transform: translateX(-4px);
  }

  .arrow {
    font-size: 18px;
    line-height: 1;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 40px 20px 50px;
  animation: ${fadeIn} 0.6s ease;

  .badge {
    display: inline-block;
    padding: 4px 16px;
    border-radius: 20px;
    background: ${props => props.theme.colors.accentActive};
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.accent};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .title {
    font-size: 42px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
    line-height: 1.1;
    margin-bottom: 16px;

    .gradient {
      background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .subtitle {
    font-size: 18px;
    color: ${props => props.theme.colors.textMuted};
    max-width: 650px;
    margin: 0 auto;
    line-height: 1.8;
  }

  .course-meta {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 24px;
    flex-wrap: wrap;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: ${props => props.theme.colors.textMuted};
      background: ${props => props.theme.colors.background + '40'};
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid ${props => props.theme.colors.border};

      .icon { font-size: 16px; }
    }
  }

  @media (max-width: 768px) {
    padding: 24px 12px 30px;
    .title { font-size: 28px; }
    .subtitle { font-size: 15px; }
    .course-meta { gap: 12px; .meta-item { font-size: 11px; padding: 4px 12px; } }
  }

  @media (max-width: 480px) {
    .title { font-size: 24px; }
  }
`;

const TOCSection = styled.div`
  max-width: 900px;
  margin: 0 auto 40px;
  width: 100%;
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px 28px;
  animation: ${fadeIn} 0.7s ease;

  .toc-title {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;

    .icon { font-size: 24px; }
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
      color: ${props => props.theme.colors.textMuted};
      font-size: 13px;
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover {
        background: ${props => props.theme.colors.accentActive};
        color: ${props => props.theme.colors.text};
      }

      .num {
        font-size: 11px;
        font-weight: 700;
        color: ${props => props.theme.colors.accent};
        min-width: 28px;
      }

      .label {
        flex: 1;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 16px 16px;
    .toc-grid {
      grid-template-columns: 1fr;
    }
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
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 28px 30px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent + '30'};
    background: ${props => props.theme.colors.background + '60'};
  }

  .lesson-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${props => props.theme.colors.border};

    .lesson-number {
      font-size: 12px;
      font-weight: 700;
      color: ${props => props.theme.colors.accent};
      background: ${props => props.theme.colors.accentActive};
      padding: 2px 12px;
      border-radius: 20px;
      flex-shrink: 0;
    }

    .lesson-title {
      font-size: 20px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      flex: 1;
    }

    .lesson-duration {
      font-size: 11px;
      color: ${props => props.theme.colors.textMuted};
      background: ${props => props.theme.colors.background + '40'};
      padding: 2px 12px;
      border-radius: 20px;
      border: 1px solid ${props => props.theme.colors.border};
      flex-shrink: 0;
    }
  }

  .lesson-content {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 15px;
    line-height: 1.9;

    h3 {
      color: ${props => props.theme.colors.text};
      font-size: 20px;
      font-weight: 600;
      margin: 28px 0 14px 0;
      padding-bottom: 6px;
      border-bottom: 1px solid ${props => props.theme.colors.border};
    }

    h4 {
      color: ${props => props.theme.colors.text};
      font-size: 17px;
      font-weight: 600;
      margin: 20px 0 10px 0;
    }

    h5 {
      color: ${props => props.theme.colors.textSecondary};
      font-size: 15px;
      font-weight: 600;
      margin: 16px 0 8px 0;
    }

    p {
      margin-bottom: 14px;
      color: ${props => props.theme.colors.textSecondary};
    }

    ul, ol {
      margin: 10px 0 14px 24px;
      li {
        margin-bottom: 8px;
        color: ${props => props.theme.colors.textSecondary};
      }
    }

    .highlight-box {
      background: ${props => props.theme.colors.accentActive};
      border-left: 3px solid ${props => props.theme.colors.accent};
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
      color: ${props => props.theme.colors.textSecondary};
    }

    .warning-box {
      background: rgba(239, 68, 68, 0.06);
      border-left: 3px solid #ef4444;
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
      color: ${props => props.theme.colors.textSecondary};
    }

    .success-box {
      background: rgba(34, 197, 94, 0.06);
      border-left: 3px solid #22c55e;
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
      color: ${props => props.theme.colors.textSecondary};
    }

    .example-box {
      background: rgba(251, 191, 36, 0.06);
      border: 1px solid rgba(251, 191, 36, 0.12);
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
      color: ${props => props.theme.colors.textSecondary};
    }

    .code-block {
      background: ${props => props.theme.colors.background + '80'};
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: ${props => props.theme.colors.text};
      overflow-x: auto;
      margin: 10px 0;
      border: 1px solid ${props => props.theme.colors.border};
    }

    .key-takeaway {
      background: rgba(129, 140, 248, 0.06);
      border: 1px solid rgba(129, 140, 248, 0.12);
      padding: 14px 18px;
      border-radius: 8px;
      margin: 14px 0;
      color: ${props => props.theme.colors.textSecondary};

      strong {
        color: ${props => props.theme.colors.accent};
      }
    }

    .definition-box {
      background: rgba(34, 197, 94, 0.04);
      border: 1px solid rgba(34, 197, 94, 0.08);
      padding: 12px 16px;
      border-radius: 8px;
      margin: 10px 0;
      color: ${props => props.theme.colors.textSecondary};

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
        border: 1px solid ${props => props.theme.colors.border};
        text-align: left;
        font-size: 14px;
      }

      th {
        background: ${props => props.theme.colors.accentActive};
        color: ${props => props.theme.colors.text};
        font-weight: 600;
      }

      td {
        color: ${props => props.theme.colors.textSecondary};
      }
    }

    strong {
      color: ${props => props.theme.colors.text};
    }
  }

  @media (max-width: 768px) {
    padding: 18px 16px;
    .lesson-header {
      .lesson-title { font-size: 17px; }
      .lesson-duration { font-size: 10px; }
    }
    .lesson-content {
      font-size: 14px;
      h3 { font-size: 17px; }
      h4 { font-size: 15px; }
    }
  }

  @media (max-width: 480px) {
    padding: 14px 12px;
    .lesson-header .lesson-title { font-size: 15px; }
  }
`;

// ============================================
// COMPLETE LESSON DATA (UNCHANGED)
// ============================================

const lessons = [
  {
    id: 1,
    title: "What is Trading?",
    duration: "20 min",
    content: `
      <h3>Welcome to the World of Trading</h3>
      
      <p>Imagine you're at a local market. You see a farmer selling apples for $1 each. You know that across town, apples are selling for $2 each. You buy 100 apples for $100, take them across town, and sell them for $200. You just made $100 profit! Congratulations - you just traded!</p>
      
      <p>Trading, in its simplest form, is the act of buying something at a lower price and selling it at a higher price. The difference between the buy price and the sell price is your profit (or loss).</p>
      
      <div class="highlight-box">
        <strong>💡 Core Concept:</strong>
        <br>Trading = Buying Low + Selling High
        <br>or
        <br>Trading = Selling High + Buying Low (when shorting)
      </div>
      
      <h3>What Makes Prices Move?</h3>
      
      <p>Prices move because of supply and demand. Let's understand this with a simple example:</p>
      
      <div class="example-box">
        <strong>📊 Supply & Demand Example:</strong>
        <br>
        <br>Imagine there are 100 people who want to buy apples, but only 50 apples available.
        <br>• Demand (buyers) = 100
        <br>• Supply (apples) = 50
        <br>• Result: Price goes UP because more people want apples than apples available.
        <br>
        <br>Now imagine there are 50 people who want to buy apples, but 100 apples available.
        <br>• Demand (buyers) = 50
        <br>• Supply (apples) = 100
        <br>• Result: Price goes DOWN because more apples available than people want.
      </div>
      
      <p>This is the fundamental law of trading: When demand exceeds supply, prices rise. When supply exceeds demand, prices fall.</p>
      
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
      
      <p>Deriv offers a wide variety of markets. Think of them like different "shops" in a shopping mall, each selling different products:</p>
      
      <h4>1. Volatility Indices (Deriv's Speciality)</h4>
      <p>These are artificial markets created by Deriv using mathematical formulas. They don't exist in the real world, which makes them special:</p>
      <ul>
        <li><strong>No News Impact:</strong> Real-world news doesn't affect them</li>
        <li><strong>Always Open:</strong> Trade 24/7, 365 days a year</li>
        <li><strong>Predictable Movements:</strong> They follow mathematical patterns</li>
        <li><strong>Leverage Options:</strong> Choose from 10, 25, 50, 75, or 100 volatility</li>
      </ul>
      
      <table>
        <tr>
          <th>Index Name</th>
          <th>Movement Speed</th>
          <th>Risk Level</th>
          <th>Best For</th>
        </tr>
        <tr>
          <td>Volatility 10</td>
          <td>Slow</td>
          <td>Very Low</td>
          <td>Beginners</td>
        </tr>
        <tr>
          <td>Volatility 25</td>
          <td>Moderate</td>
          <td>Low</td>
          <td>Beginners</td>
        </tr>
        <tr>
          <td>Volatility 50</td>
          <td>Active</td>
          <td>Medium</td>
          <td>Intermediate</td>
        </tr>
        <tr>
          <td>Volatility 75</td>
          <td>Fast</td>
          <td>High</td>
          <td>Advanced</td>
        </tr>
        <tr>
          <td>Volatility 100</td>
          <td>Very Fast</td>
          <td>Very High</td>
          <td>Experts</td>
        </tr>
      </table>
      
      <div class="highlight-box">
        <strong>💡 Beginner Tip:</strong> Start with Volatility 10 or 25. They move slowly enough that you can see what's happening and learn without being overwhelmed.
      </div>
      
      <h4>2. Forex (Foreign Exchange)</h4>
      <p>Forex involves trading different currencies against each other. For example, trading USD against EUR (US Dollar vs Euro). This is the largest financial market in the world!</p>
      <p>Common forex pairs include:</p>
      <ul>
        <li><strong>EUR/USD:</strong> Euro vs US Dollar</li>
        <li><strong>GBP/USD:</strong> British Pound vs US Dollar</li>
        <li><strong>USD/JPY:</strong> US Dollar vs Japanese Yen</li>
        <li><strong>USD/CHF:</strong> US Dollar vs Swiss Franc</li>
        <li><strong>AUD/USD:</strong> Australian Dollar vs US Dollar</li>
      </ul>
      
      <h4>3. Commodities</h4>
      <p>Commodities are physical assets that you can trade. Their prices are influenced by real-world supply and demand, news, and global events.</p>
      <ul>
        <li><strong>Gold (XAU/USD):</strong> A safe-haven asset, price often rises during uncertainty</li>
        <li><strong>Silver (XAG/USD):</strong> Both an industrial and precious metal</li>
        <li><strong>Oil (WTI, Brent):</strong> Crude oil, affected by global events</li>
        <li><strong>Natural Gas:</strong> Used for heating and electricity</li>
      </ul>
      
      <h4>4. Cryptocurrencies</h4>
      <p>Digital or virtual currencies that use cryptography for security. They are highly volatile and can move rapidly.</p>
      <ul>
        <li><strong>Bitcoin (BTC/USD):</strong> The first and most well-known cryptocurrency</li>
        <li><strong>Ethereum (ETH/USD):</strong> Second largest cryptocurrency</li>
        <li><strong>Litecoin (LTC/USD):</strong> Lighter version of Bitcoin</li>
        <li><strong>Ripple (XRP/USD):</strong> Focused on financial institutions</li>
      </ul>
      
      <h3>Understanding Your Trading Account</h3>
      
      <p>When you trade, you'll see various numbers and terms. Let's break them down:</p>
      
      <div class="definition-box">
        <p><span class="term">Balance:</span> The total amount of money in your account.</p>
        <p><span class="term">Equity:</span> Your current account value including open trades. Balance + P&L (Profit & Loss).</p>
        <p><span class="term">Free Margin:</span> The money available to open new trades. Equity - Margin.</p>
        <p><span class="term">Margin:</span> The money required to open a trade.</p>
        <p><span class="term">Leverage:</span> A loan that lets you trade with more money than you have. Use with caution!</p>
      </div>
      
      <h3>Understanding Risk and Reward</h3>
      
      <p>Every trade has two possible outcomes: win or lose. The risk is how much you could lose. The reward is how much you could win.</p>
      
      <div class="example-box">
        <strong>📊 Risk & Reward Example:</strong>
        <br>You place a $10 trade. The payout is $19.20.
        <br>• Risk: $10 (you lose $10 if you're wrong)
        <br>• Reward: $19.20 (you gain $19.20 if you're right)
        <br>• Risk/Reward Ratio: 1:1.92 (for every $1 risked, you could win $1.92)
      </div>
      
      <p>The <strong>Risk/Reward Ratio</strong> is one of the most important concepts in trading. A ratio of 1:2 means you risk $1 to gain $2. Professional traders aim for at least 1:1.5 or higher.</p>
      
      <div class="warning-box">
        <strong>⚠️ Critical Concept:</strong>
        <br>You should always know your risk before placing a trade. Never trade without understanding exactly how much you could lose.
      </div>
      
      <h3>The 3 Golden Rules of Trading</h3>
      
      <p>Before you make your first trade, memorize these rules. They'll save you thousands of dollars in losses:</p>
      
      <div class="success-box">
        <strong>✅ Rule 1: Risk Only 2% Per Trade</strong>
        <br>If you have $100 in your account, risk no more than $2 on any single trade. This ensures you can survive losing streaks.
      </div>
      
      <div class="success-box">
        <strong>✅ Rule 2: Use a Demo Account First</strong>
        <br>Practice until you're consistently profitable with virtual money. This takes 2-4 weeks minimum. Don't rush into real money trading!
      </div>
      
      <div class="success-box">
        <strong>✅ Rule 3: Learn From Every Trade</strong>
        <br>Write down what you did, why you did it, and what happened. This is how you improve. Winners and losers both teach valuable lessons.
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Trading is buying low and selling high. Deriv offers many markets including Volatility Indices, Forex, Commodities, and Cryptocurrencies. Always start with a demo account, risk only 2% per trade, and learn from every trade. The journey of a thousand trades begins with a single click!
      </div>
    `
  },
  {
    id: 2,
    title: "Understanding Markets",
    duration: "25 min",
    content: `
      <h3>What Are Markets?</h3>
      
      <p>Think of markets like different departments in a large store. Each department sells different products, has different prices, and operates differently. In trading, each market has its own characteristics, movement patterns, and risk levels.</p>
      
      <p>Understanding the market you're trading is crucial. It's like knowing whether you're driving a car, a truck, or a motorcycle - each handles differently!</p>
      
      <h3>Volatility Indices - The Beginner's Friend</h3>
      
      <p>Volatility Indices are Deriv's signature product and the best place for beginners to start. But what exactly are they?</p>
      
      <h4>What is Volatility?</h4>
      <p>Volatility refers to how much and how quickly the price moves. Think of it like the wind:</p>
      <ul>
        <li><strong>Low Volatility:</strong> Light breeze - slow, gentle movements</li>
        <li><strong>High Volatility:</strong> Strong wind - fast, powerful movements</li>
      </ul>
      
      <p>Volatility Indices are artificial markets that simulate different levels of volatility. They don't exist in the real world, which makes them perfect for learning because they're predictable.</p>
      
      <div class="highlight-box">
        <strong>💡 Why Volatility Indices are Great for Beginners:</strong>
        <br>1. <strong>Always Open:</strong> Trade 24/7, no market closures
        <br>2. <strong>No News Impact:</strong> News events don't cause sudden moves
        <br>3. <strong>Predictable:</strong> They follow mathematical patterns
        <br>4. <strong>Flexible:</strong> You can choose your preferred volatility level
        <br>5. <strong>Available 365 Days:</strong> No holidays, no weekends off
      </div>
      
      <h3>Understanding Volatility Levels</h3>
      
      <p>Deriv offers five volatility indices. Let's understand each one:</p>
      
      <h4>Volatility 10 (R_10)</h4>
      <p>This is the slowest and most beginner-friendly index. Price moves are small and gradual.</p>
      <ul>
        <li><strong>Movement:</strong> 50-100 points per minute</li>
        <li><strong>Risk Level:</strong> Very Low</li>
        <li><strong>Best For:</strong> Complete beginners learning the platform</li>
        <li><strong>Recommended Duration:</strong> 1-5 ticks</li>
        <li><strong>Strategy:</strong> Great for learning to read trends</li>
      </ul>
      
      <h4>Volatility 25 (R_25)</h4>
      <p>A step up from R_10, with moderate movements that are still beginner-friendly.</p>
      <ul>
        <li><strong>Movement:</strong> 100-200 points per minute</li>
        <li><strong>Risk Level:</strong> Low</li>
        <li><strong>Best For:</strong> Beginners ready for more action</li>
        <li><strong>Recommended Duration:</strong> 1-3 ticks</li>
        <li><strong>Strategy:</strong> Good for trend following</li>
      </ul>
      
      <h4>Volatility 50 (R_50)</h4>
      <p>Active movements that provide more opportunities but also more risk.</p>
      <ul>
        <li><strong>Movement:</strong> 200-300 points per minute</li>
        <li><strong>Risk Level:</strong> Medium</li>
        <li><strong>Best For:</strong> Intermediate traders</li>
        <li><strong>Recommended Duration:</strong> 1-2 ticks</li>
        <li><strong>Strategy:</strong> Momentum and breakout trading</li>
      </ul>
      
      <h4>Volatility 75 (R_75)</h4>
      <p>Fast movements that require quick decisions and good risk management.</p>
      <ul>
        <li><strong>Movement:</strong> 300-400 points per minute</li>
        <li><strong>Risk Level:</strong> High</li>
        <li><strong>Best For:</strong> Advanced traders</li>
        <li><strong>Recommended Duration:</strong> 1 tick</li>
        <li><strong>Strategy:</strong> Scalping and momentum</li>
      </ul>
      
      <h4>Volatility 100 (R_100)</h4>
      <p>The fastest and most volatile index, offering big moves but big risks.</p>
      <ul>
        <li><strong>Movement:</strong> 400-500+ points per minute</li>
        <li><strong>Risk Level:</strong> Very High</li>
        <li><strong>Best For:</strong> Expert traders</li>
        <li><strong>Recommended Duration:</strong> 1 tick only</li>
        <li><strong>Strategy:</strong> Quick scalping</li>
      </ul>
      
      <div class="warning-box">
        <strong>⚠️ Important Warning:</strong>
        <br>Higher volatility = Higher risk.
        <br>Start with R_10 or R_25. As you gain experience and confidence, you can gradually move to higher volatility levels.
        <br>Never jump straight to R_100 as a beginner!
      </div>
      
      <h3>Forex Markets</h3>
      
      <p>Forex (Foreign Exchange) is the largest financial market in the world. It involves trading currencies against each other.</p>
      
      <h4>How Forex Works</h4>
      <p>Forex always involves two currencies. You're buying one currency and selling another at the same time. This is why currencies are always shown in pairs.</p>
      
      <div class="example-box">
        <strong>📊 Forex Example:</strong>
        <br>EUR/USD = 1.1000
        <br>This means: 1 Euro = 1.10 US Dollars
        <br>
        <br>If you think the Euro will get stronger against the Dollar, you BUY EUR/USD.
        <br>If you think the Dollar will get stronger against the Euro, you SELL EUR/USD.
        <br>
        <br>If EUR/USD moves from 1.1000 to 1.1050, you make money on a BUY trade.
        <br>If it moves from 1.1000 to 1.0950, you lose money on a BUY trade.
      </div>
      
      <p>Major Forex Pairs (most traded):</p>
      <table>
        <tr>
          <th>Currency Pair</th>
          <th>Nickname</th>
          <th>What It Represents</th>
        </tr>
        <tr>
          <td>EUR/USD</td>
          <td>"Fiber"</td>
          <td>Euro vs US Dollar</td>
        </tr>
        <tr>
          <td>GBP/USD</td>
          <td>"Cable"</td>
          <td>British Pound vs US Dollar</td>
        </tr>
        <tr>
          <td>USD/JPY</td>
          <td>"Ninja"</td>
          <td>US Dollar vs Japanese Yen</td>
        </tr>
        <tr>
          <td>USD/CHF</td>
          <td>"Swissy"</td>
          <td>US Dollar vs Swiss Franc</td>
        </tr>
        <tr>
          <td>AUD/USD</td>
          <td>"Aussie"</td>
          <td>Australian Dollar vs US Dollar</td>
        </tr>
      </table>
      
      <h3>Commodity Markets</h3>
      
      <p>Commodities are physical assets that you can trade. Their prices are influenced by real-world factors.</p>
      
      <h4>Gold (XAU/USD)</h4>
      <p>Gold is a "safe-haven" asset. When markets are uncertain, people buy gold, which pushes the price up.</p>
      <ul>
        <li>Price influenced by: Inflation, global events, central bank policies</li>
        <li>Often moves inverse to the US Dollar</li>
        <li>Considered a long-term investment</li>
        <li>Good for hedging against inflation</li>
      </ul>
      
      <h4>Silver (XAG/USD)</h4>
      <p>Silver has both precious metal and industrial uses.</p>
      <ul>
        <li>Price influenced by: Industrial demand, global economy</li>
        <li>More volatile than gold</li>
        <li>Used in electronics, solar panels, jewelry</li>
      </ul>
      
      <h4>Oil (WTI)</h4>
      <p>Crude oil is one of the most traded commodities globally.</p>
      <ul>
        <li>Price influenced by: OPEC decisions, global demand, geopolitical events</li>
        <li>Very sensitive to world news</li>
        <li>Two main types: WTI (US) and Brent (International)</li>
      </ul>
      
      <h3>Cryptocurrency Markets</h3>
      
      <p>Cryptocurrencies are digital assets that use blockchain technology. They're known for high volatility and 24/7 trading.</p>
      
      <h4>Bitcoin (BTC)</h4>
      <p>Bitcoin is the first and most well-known cryptocurrency.</p>
      <ul>
        <li>Limited supply: Only 21 million Bitcoins will ever exist</li>
        <li>Price influenced by: Adoption, regulation, sentiment</li>
        <li>Highly volatile (can move 5-10% in a day)</li>
        <li>Trades 24/7, no market close</li>
      </ul>
      
      <h4>Ethereum (ETH)</h4>
      <p>Ethereum is more than just a currency - it's a platform for smart contracts.</p>
      <ul>
        <li>Second largest cryptocurrency by market cap</li>
        <li>Used for decentralized applications (dApps)</li>
        <li>Transitioning to more eco-friendly "proof of stake"</li>
        <li>Highly volatile</li>
      </ul>
      
      <div class="highlight-box">
        <strong>💡 Which Market Should You Choose?</strong>
        <br>
        <br><strong>If you're a beginner:</strong> Start with Volatility 10 or 25
        <br><strong>If you want real-world trading:</strong> Try Forex
        <br><strong>If you want to hedge:</strong> Consider Gold
        <br><strong>If you want excitement:</strong> Try Cryptocurrencies
        <br>
        <br>Remember: Master ONE market first before trying others!
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Different markets have different characteristics. Volatility Indices are perfect for beginners. Forex offers real-world currency trading. Commodities let you trade physical assets. Cryptocurrencies offer high volatility. Choose ONE market to start with and master it before trying others.
      </div>
    `
  },
  {
    id: 3,
    title: "Trade Types",
    duration: "25 min",
    content: `
      <h3>Understanding Trade Types</h3>
      
      <p>Think of trade types like different games you can play. Each game has different rules, and each has its own strategy. On Deriv, you have four main trade types to choose from.</p>
      
      <div class="highlight-box">
        <strong>💡 Pro Tip:</strong> Start with just ONE trade type and master it. Most professional traders specialize in one type. Don't try to learn them all at once!
      </div>
      
      <h3>1. Over/Under (The Trend Game)</h3>
      
      <p>This is the simplest and most popular trade type on Deriv. It's perfect for beginners!</p>
      
      <h4>How It Works</h4>
      <p>You look at the current price and predict whether the next price will be higher or lower.</p>
      
      <div class="definition-box">
        <p><span class="term">OVER:</span> You predict the price will go UP from where it is now.</p>
        <p><span class="term">UNDER:</span> You predict the price will go DOWN from where it is now.</p>
      </div>
      
      <div class="example-box">
        <strong>📊 Example:</strong>
        <br>Current price: 8,459
        <br>You think the price will go higher than 8,459.
        <br>You choose: OVER
        <br>
        <br>✅ If the next price is 8,460 or higher → YOU WIN!
        <br>❌ If the next price is 8,458 or lower → YOU LOSE!
        <br>
        <br>OR...
        <br>
        <br>You think the price will go lower than 8,459.
        <br>You choose: UNDER
        <br>
        <br>✅ If the next price is 8,458 or lower → YOU WIN!
        <br>❌ If the next price is 8,460 or higher → YOU LOSE!
      </div>
      
      <h4>When to Choose OVER</h4>
      <div class="success-box">
        <strong>📈 OVER Signals:</strong>
        <ul>
          <li>Price is going UP (green candles on chart)</li>
          <li>Market is in an uptrend (higher highs, higher lows)</li>
          <li>Price bounced off support (a low point)</li>
          <li>Strong green candle just appeared (momentum)</li>
          <li>Price is above the moving average</li>
          <li>Good news about the market</li>
        </ul>
      </div>
      
      <h4>When to Choose UNDER</h4>
      <div class="warning-box">
        <strong>📉 UNDER Signals:</strong>
        <ul>
          <li>Price is going DOWN (red candles on chart)</li>
          <li>Market is in a downtrend (lower highs, lower lows)</li>
          <li>Price hit resistance (a high point)</li>
          <li>Strong red candle just appeared (momentum)</li>
          <li>Price is below the moving average</li>
          <li>Bad news about the market</li>
        </ul>
      </div>
      
      <h4>Common Mistakes with Over/Under</h4>
      <ul>
        <li><strong>Mistake 1:</strong> Choosing OVER when the chart is going DOWN (trading against the trend)</li>
        <li><strong>Mistake 2:</strong> Choosing UNDER when the chart is going UP (trading against the trend)</li>
        <li><strong>Mistake 3:</strong> Not looking at the chart at all (guessing randomly)</li>
        <li><strong>Mistake 4:</strong> Using too much money (stake too high)</li>
        <li><strong>Mistake 5:</strong> Trading too often (overtrading)</li>
        <li><strong>Mistake 6:</strong> Not using stop losses</li>
        <li><strong>Mistake 7:</strong> Not considering the overall trend</li>
      </ul>
      
      <div class="highlight-box">
        <strong>💡 The 80/20 Rule:</strong>
        <br>80% of your wins will come from following the trend.
        <br>20% will come from reversals.
        <br>Trade WITH the trend, not against it!
      </div>
      
      <h3>2. Even/Odd (The Number Game)</h3>
      
      <p>This is the simplest trade type, based entirely on luck. It's fun and easy to understand.</p>
      
      <h4>How It Works</h4>
      <p>You look at the last digit of the price and predict whether it will be even or odd.</p>
      
      <div class="definition-box">
        <p><span class="term">EVEN:</span> The last digit will be 0, 2, 4, 6, or 8.</p>
        <p><span class="term">ODD:</span> The last digit will be 1, 3, 5, 7, or 9.</p>
      </div>
      
      <div class="example-box">
        <strong>📊 Example:</strong>
        <br>Price: 8,459
        <br>Last digit: 9
        <br>
        <br>You choose: ODD
        <br>✅ The last digit is 9 → YOU WIN! 🎉
        <br>
        <br>You choose: EVEN
        <br>❌ The last digit is 9 → YOU LOSE! 😢
      </div>
      
      <h4>Understanding Probability</h4>
      <p>Since there are 5 even numbers and 5 odd numbers, the chance of winning is exactly 50%.</p>
      
      <table>
        <tr>
          <th>Choice</th>
          <th>Winning Numbers</th>
          <th>Chance of Win</th>
        </tr>
        <tr>
          <td>EVEN</td>
          <td>0, 2, 4, 6, 8</td>
          <td>50%</td>
        </tr>
        <tr>
          <td>ODD</td>
          <td>1, 3, 5, 7, 9</td>
          <td>50%</td>
        </tr>
      </table>
      
      <h4>Pattern Recognition Tips</h4>
      <ul>
        <li>Look at the last 5-10 digits for patterns</li>
        <li>If the last 3 digits were odd, even might be more likely</li>
        <li>Don't chase "streaks" - each digit is independent</li>
        <li>Some traders look for "reversion to the mean" (too many of one type)</li>
        <li>Remember: It's still 50/50, patterns are not guaranteed</li>
      </ul>
      
      <div class="warning-box">
        <strong>⚠️ Important Warning:</strong>
        <br>Even/Odd is random. No strategy can guarantee a win.
        <br>Don't double your stake to "recover" losses.
        <br>Treat it like a game, not a money-making strategy.
      </div>
      
      <h3>3. Matches/Differs (The Matching Game)</h3>
      
      <p>This is a more advanced trade type that offers both high-risk and low-risk options.</p>
      
      <h4>How It Works</h4>
      <p>You pick a number (0-9) and predict whether the last digit will match your chosen number.</p>
      
      <div class="definition-box">
        <p><span class="term">MATCHES:</span> The last digit will be the SAME as your chosen number.</p>
        <p><span class="term">DIFFERS:</span> The last digit will be DIFFERENT from your chosen number.</p>
      </div>
      
      <div class="example-box">
        <strong>📊 Example:</strong>
        <br>You choose: 5
        <br>
        <br>You predict: MATCHES 5
        <br>✅ If last digit is 5 → YOU WIN!
        <br>❌ If last digit is any number EXCEPT 5 → YOU LOSE!
        <br>
        <br>You predict: DIFFERS 5
        <br>✅ If last digit is NOT 5 → YOU WIN!
        <br>❌ If last digit is 5 → YOU LOSE!
      </div>
      
      <h4>Understanding Probability</h4>
      <p>There are 10 possible digits (0-9).</p>
      
      <table>
        <tr>
          <th>Choice</th>
          <th>Winning Numbers</th>
          <th>Chance of Winning</th>
          <th>Typical Payout</th>
        </tr>
        <tr>
          <td>MATCHES</td>
          <td>1 specific number</td>
          <td>10%</td>
          <td>High (~8x)</td>
        </tr>
        <tr>
          <td>DIFFERS</td>
          <td>9 numbers (not your choice)</td>
          <td>90%</td>
          <td>Low (~1.1x)</td>
        </tr>
      </table>
      
      <h4>Strategy for MATCHES</h4>
      <ul>
        <li>Use when you feel lucky (it's a gamble)</li>
        <li>Use small stakes (you'll lose 90% of the time)</li>
        <li>Look for number patterns</li>
        <li>Combine with other strategies</li>
        <li>When you win, the payout is large</li>
      </ul>
      
      <h4>Strategy for DIFFERS</h4>
      <ul>
        <li>Use for consistent small wins (wins 90% of the time)</li>
        <li>Can use larger stakes (less risk)</li>
        <li>Good for building confidence</li>
        <li>Small profits add up over time</li>
        <li>Less exciting but more reliable</li>
      </ul>
      
      <div class="highlight-box">
        <strong>💡 Pro Tip:</strong>
        <br>Many professional traders use DIFFERS as their "base" strategy.
        <br>90% win rate means you win most of the time.
        <br>Even though the payout is small, consistent wins add up!
      </div>
      
      <h3>4. Touch/No Touch (Advanced)</h3>
      
      <p>This is an advanced trade type where you predict if the price will touch a specific level.</p>
      
      <h4>How It Works</h4>
      <p>You set a price target (higher or lower) and predict if the price will touch that level before the trade ends.</p>
      
      <div class="definition-box">
        <p><span class="term">TOUCH:</span> You predict the price will HIT your target level.</p>
        <p><span class="term">NO TOUCH:</span> You predict the price will NOT hit your target level.</p>
      </div>
      
      <div class="example-box">
        <strong>📊 Example:</strong>
        <br>Current price: 8,459
        <br>You set target: 8,500 (higher)
        <br>
        <br>TOUCH 8,500: You predict price will go to 8,500
        <br>✅ If price hits 8,500 → YOU WIN!
        <br>❌ If price stays below 8,500 → YOU LOSE!
        <br>
        <br>NO TOUCH 8,500: You predict price will NOT go to 8,500
        <br>✅ If price stays below 8,500 → YOU WIN!
        <br>❌ If price hits 8,500 → YOU LOSE!
      </div>
      
      <h4>Strategy for Touch/No Touch</h4>
      <ul>
        <li><strong>TOUCH:</strong> Use during trending markets (high chance of reaching target)</li>
        <li><strong>NO TOUCH:</strong> Use during sideways markets (unlikely to reach target)</li>
        <li>Set targets at realistic levels (not too far, not too close)</li>
        <li>Consider market volatility (more volatile = more likely to touch)</li>
        <li>Use longer durations for more time to reach the target</li>
      </ul>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Each trade type has its own strategy and risk level. Over/Under is the most popular and beginner-friendly. Even/Odd is simple and 50/50. Matches/Differs offers both high-risk and low-risk options. Touch/No Touch is for advanced traders. Master one trade type before moving to the next!
      </div>
    `
  },
  {
    id: 4,
    title: "Reading Charts",
    duration: "30 min",
    content: `
      <h3>Understanding Charts</h3>
      
      <p>Charts are the windows into the market. They show you what's happening with prices, where they've been, and where they might be going. Learning to read charts is one of the most important skills you'll develop as a trader.</p>
      
      <p>Think of charts like a map. Just as a map shows you roads, cities, and terrain, a chart shows you price movements, trends, and patterns.</p>
      
      <h3>Types of Charts</h3>
      
      <h4>1. Line Charts</h4>
      <p>The simplest type of chart. It connects the closing prices of each period with a line.</p>
      <ul>
        <li><strong>Pros:</strong> Clean, easy to read, shows overall trend</li>
        <li><strong>Cons:</strong> Loses detail, doesn't show price action</li>
        <li><strong>Best For:</strong> Beginners getting started</li>
      </ul>
      
      <h4>2. Bar Charts</h4>
      <p>Shows more detail than line charts. Each bar represents one period of trading.</p>
      <ul>
        <li><strong>Shows:</strong> Open, High, Low, Close</li>
        <li><strong>Pros:</strong> More information than line charts</li>
        <li><strong>Cons:</strong> Less popular than candlesticks</li>
        <li><strong>Best For:</strong> Traders who want quick price info</li>
      </ul>
      
      <h4>3. Candlestick Charts (Most Important)</h4>
      <p>These are the most popular charts and the ones you'll use most often. Candlesticks show you a lot of information in one visual.</p>
      
      <div class="example-box">
        <strong>📊 Candlestick Anatomy:</strong>
        <br>
        <br>🟢 <strong>Green/White Candle:</strong> Price went UP
        <br>• Body: Shows the difference between open and close
        <br>• Upper Wick: Shows the high price
        <br>• Lower Wick: Shows the low price
        <br>• Open: Price when the period started
        <br>• Close: Price when the period ended
        <br>
        <br>🔴 <strong>Red/Black Candle:</strong> Price went DOWN
        <br>• Body: Shows the difference between open and close
        <br>• Upper Wick: Shows the high price
        <br>• Lower Wick: Shows the low price
        <br>• Open: Price when the period started
        <br>• Close: Price when the period ended
        <br>
        <br>The longer the body, the stronger the move.
        <br>The longer the wicks, the more indecision.
      </div>
      
      <h3>The Three Market States</h3>
      
      <div class="highlight-box">
        <strong>💡 Market States:</strong>
        <br>
        <br>📈 <strong>UPTREND:</strong>
        <br>• Price makes higher highs (each peak is higher)
        <br>• Price makes higher lows (each valley is higher)
        <br>• More green candles than red
        <br>• Moving averages point UP
        <br>• Look for OVER trades
        <br>
        <br>📉 <strong>DOWNTREND:</strong>
        <br>• Price makes lower highs (each peak is lower)
        <br>• Price makes lower lows (each valley is lower)
        <br>• More red candles than green
        <br>• Moving averages point DOWN
        <br>• Look for UNDER trades
        <br>
        <br>➡️ <strong>SIDEWAYS (RANGE):</strong>
        <br>• Price bounces between two levels
        <br>• No clear direction
        <br>• Equal number of green and red candles
        <br>• Moving averages are flat
        <br>• Wait for a breakout before trading
      </div>
      
      <h3>Key Chart Patterns</h3>
      
      <h4>Support and Resistance</h4>
      <p>These are crucial concepts that every trader must understand.</p>
      
      <div class="definition-box">
        <p><span class="term">Support:</span> A price level where the market tends to bounce UP. Think of it like a floor - the price usually doesn't go below it.</p>
        <p><span class="term">Resistance:</span> A price level where the market tends to bounce DOWN. Think of it like a ceiling - the price usually doesn't go above it.</p>
      </div>
      
      <div class="example-box">
        <strong>📊 Support & Resistance Example:</strong>
        <br>
        <br>Resistance: 8,500 (price bounces DOWN from here)
        <br>Current Price: 8,459
        <br>Support: 8,400 (price bounces UP from here)
        <br>
        <br>At Support (8,400):
        <br>• Price is likely to bounce UP
        <br>• Look for OVER trades
        <br>• Consider taking profit at resistance
        <br>
        <br>At Resistance (8,500):
        <br>• Price is likely to bounce DOWN
        <br>• Look for UNDER trades
        <br>• Consider taking profit at support
        <br>
        <br>Breakout (above resistance or below support):
        <br>• Price breaking above resistance = likely to keep going UP
        <br>• Price breaking below support = likely to keep going DOWN
        <br>• Trade in the breakout direction
      </div>
      
      <h4>Trendlines</h4>
      <p>Trendlines are diagonal lines drawn along the peaks or valleys of the price to show the direction of the trend.</p>
      <ul>
        <li><strong>Uptrend Line:</strong> Drawn along the lows (valleys) - shows rising trend</li>
        <li><strong>Downtrend Line:</strong> Drawn along the highs (peaks) - shows falling trend</li>
        <li><strong>Break of Trendline:</strong> Often signals a trend reversal</li>
        <li><strong>Bounce from Trendline:</strong> Confirms the trend is continuing</li>
      </ul>
      
      <h4>Common Candlestick Patterns</h4>
      <ul>
        <li><strong>Doji:</strong> Small body, long wicks. Shows indecision. Often signals reversal.</li>
        <li><strong>Hammer:</strong> Small body, long lower wick. Bullish reversal signal.</li>
        <li><strong>Shooting Star:</strong> Small body, long upper wick. Bearish reversal signal.</li>
        <li><strong>Engulfing Pattern:</strong> One candle completely covers the previous candle. Strong reversal signal.</li>
        <li><strong>Three Green Candle:</strong> Three green candles in a row. Shows strong uptrend.</li>
        <li><strong>Three Red Candle:</strong> Three red candles in a row. Shows strong downtrend.</li>
      </ul>
      
      <div class="success-box">
        <strong>✅ Chart Reading Exercise:</strong>
        <br>
        <br>1. Open your Deriv chart on Volatility 10
        <br>2. Look at the last 20 candles
        <br>3. Answer these questions:
        <br>• What is the trend? (UP, DOWN, or SIDEWAYS?)
        <br>• Are there more green or red candles?
        <br>• Where are the support and resistance levels?
        <br>• Do you see any candlestick patterns?
        <br>• What would your next trade be? (OVER or UNDER?)
        <br>
        <br>Do this for 10 minutes every day. You'll become a chart reading expert!
      </div>
      
      <h3>Technical Indicators (Advanced)</h3>
      
      <p>These are mathematical calculations based on price and volume. They help you analyze the market.</p>
      
      <h4>Moving Averages (MA)</h4>
      <p>Calculates the average price over a specific period. Smooths out price data to show the trend.</p>
      <ul>
        <li><strong>Simple MA (SMA):</strong> Equal weight to all prices</li>
        <li><strong>Exponential MA (EMA):</strong> More weight to recent prices</li>
        <li><strong>Signal:</strong> Price above MA = Uptrend, Price below MA = Downtrend</li>
      </ul>
      
      <h4>Relative Strength Index (RSI)</h4>
      <p>Measures the speed and change of price movements. Shows if the market is overbought or oversold.</p>
      <ul>
        <li><strong>Overbought (RSI > 70):</strong> Price may fall (look for UNDER)</li>
        <li><strong>Oversold (RSI < 30):</strong> Price may rise (look for OVER)</li>
        <li><strong>Neutral (RSI between 30-70):</strong> No clear signal</li>
      </ul>
      
      <h4>Moving Average Convergence Divergence (MACD)</h4>
      <p>Shows the relationship between two moving averages. Helps identify trend direction and momentum.</p>
      <ul>
        <li><strong>Line above zero:</strong> Bullish (uptrend)</li>
        <li><strong>Line below zero:</strong> Bearish (downtrend)</li>
        <li><strong>Crossing up:</strong> Buy signal (look for OVER)</li>
        <li><strong>Crossing down:</strong> Sell signal (look for UNDER)</li>
      </ul>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Charts tell the story of the market. Learn to read candlestick patterns, support/resistance, and trendlines. Master one indicator at a time. Practice reading charts daily and you'll become a skilled analyst!
      </div>
    `
  },
  {
    id: 5,
    title: "Risk Management",
    duration: "25 min",
    content: `
      <h3>Why Risk Management is Everything</h3>
      
      <p>Risk management is the single most important skill in trading. It's more important than knowing strategies, reading charts, or understanding markets. Without proper risk management, even the best traders will eventually lose everything.</p>
      
      <div class="highlight-box">
        <strong>💡 The Golden Rule of Trading:</strong>
        <br>Protect your capital first. Make profits second.
        <br>Never risk more than you can afford to lose.
        <br>Always risk 2% or less per trade.
        <br>This is rule #1. Everything else is secondary.
      </div>
      
      <p>Think of your trading account like your car. You wouldn't drive without a seatbelt, insurance, or safety features. Risk management is the seatbelt of trading - it keeps you safe when things go wrong.</p>
      
      <h3>The 2% Rule (Your Survival Guide)</h3>
      
      <p>This is the most important rule in trading. It will save your account many times over.</p>
      
      <div class="warning-box">
        <strong>⚠️ The 2% Rule:</strong>
        <br>Never risk more than 2% of your account on any single trade.
        <br>
        <br>If you have $1,000, risk no more than $20 per trade.
        <br>If you have $500, risk no more than $10 per trade.
        <br>If you have $100, risk no more than $2 per trade.
        <br>
        <br>This rule ensures you survive losing streaks and can trade another day.
      </div>
      
      <p>Let's understand why this rule is so important with an example:</p>
      
      <div class="example-box">
        <strong>📊 The Power of 2%:</strong>
        <br>
        <br><strong>Trader A (No Risk Management):</strong>
        <br>Account: $1,000
        <br>Trade 1: Risk $500 (50%) → LOSS
        <br>Account now: $500
        <br>Trade 2: Risk $500 (100%) → LOSS
        <br>Account now: $0
        <br>Result: BROKE IN 2 TRADES! 😭
        <br>
        <br><strong>Trader B (2% Rule):</strong>
        <br>Account: $1,000
        <br>Trade 1: Risk $20 (2%) → LOSS
        <br>Account now: $980
        <br>Trade 2: Risk $19.60 (2%) → LOSS
        <br>Account now: $960.40
        <br>Trade 3: Risk $19.20 (2%) → LOSS
        <br>Account now: $941.20
        <br>Result: AFTER 20 LOSSES IN A ROW → STILL HAS $670! 🎉
        <br>
        <br>The 2% rule allows you to survive losing streaks!
      </div>
      
      <h3>The 6% Daily Rule</h3>
      
      <p>Just as important as the 2% rule. This rule prevents you from destroying your account in a single bad day.</p>
      
      <div class="warning-box">
        <strong>⚠️ The 6% Daily Rule:</strong>
        <br>If you lose 6% of your account in one day, STOP TRADING.
        <br>
        <br>Account: $1,000
        <br>6% Daily Loss Limit: $60
        <br>
        <br>If you lose $60 in a day, STOP!
        <br>Come back tomorrow with a fresh start.
        <br>
        <br>This rule prevents:
        <br>• Revenge trading (trying to recover losses)
        <br>• Emotional trading (making bad decisions under stress)
        <br>• Account destruction (losing everything)
        <br>• Overtrading (taking too many trades)
      </div>
      
      <h3>Position Sizing</h3>
      
      <p>Position sizing is deciding how much to risk on each trade. It's a crucial skill that combines your account size, risk percentage, and stop loss.</p>
      
      <div class="code-block">
        Position Size Formula:
        Position Size = (Account Size × Risk %) / (Stop Loss in Ticks)
      </div>
      
      <div class="example-box">
        <strong>📊 Position Sizing Example:</strong>
        <br>Account: $1,000
        <br>Risk: 2% ($20)
        <br>Stop Loss: 5 ticks
        <br>
        <br>Position Size = $20 / 5 = $4 per tick
        <br>
        <br>This means you should risk $4 for every 1 tick movement.
        <br>
        <br>If you make 5 ticks profit: $4 × 5 = $20 profit (2% return)
        <br>If you lose 5 ticks: $4 × 5 = $20 loss (2% loss)
        <br>
        <br>This ensures each trade risks exactly 2% of your account.
      </div>
      
      <h3>Different Risk Scenarios</h3>
      
      <table>
        <tr>
          <th>Account Size</th>
          <th>2% Risk</th>
          <th>6% Daily Limit</th>
          <th>Max Trades/Day (2% each)</th>
        </tr>
        <tr>
          <td>$100</td>
          <td>$2</td>
          <td>$6</td>
          <td>3</td>
        </tr>
        <tr>
          <td>$500</td>
          <td>$10</td>
          <td>$30</td>
          <td>3</td>
        </tr>
        <tr>
          <td>$1,000</td>
          <td>$20</td>
          <td>$60</td>
          <td>3</td>
        </tr>
        <tr>
          <td>$5,000</td>
          <td>$100</td>
          <td>$300</td>
          <td>3</td>
        </tr>
        <tr>
          <td>$10,000</td>
          <td>$200</td>
          <td>$600</td>
          <td>3</td>
        </tr>
      </table>
      
      <h3>Risk Psychology</h3>
      
      <div class="highlight-box">
        <strong>💡 Understanding Your Mind:</strong>
        <br>
        <br>• <strong>Losses hurt more than wins feel good.</strong> This is human nature. A $20 loss feels worse than a $20 win feels good.
        <br>
        <br>• <strong>Small losses are okay.</strong> In fact, they're expected. Professional traders lose 40-50% of the time.
        <br>
        <br>• <strong>Big losses destroy accounts.</strong> One big loss can undo weeks of progress.
        <br>
        <br>• <strong>Revenge trading is the #1 cause of big losses.</strong> Don't try to recover losses by increasing your stake.
        <br>
        <br>• <strong>Greed leads to overtrading.</strong> Stick to your plan, don't chase profits.
      </div>
      
      <h3>Risk Management Checklist</h3>
      
      <div class="success-box">
        <strong>✅ Before Every Trade:</strong>
        <br>
        <br>☐ Am I risking 2% or less?
        <br>☐ Have I calculated my position size correctly?
        <br>☐ Do I have a stop loss in mind?
        <br>☐ Is my daily loss limit still intact?
        <br>☐ Am I calm and not emotional?
        <br>☐ Do I have a clear reason for this trade?
        <br>
        <br>If you answer NO to any of these, DON'T TAKE THE TRADE!
      </div>
      
      <h3>Risk Management Mistakes</h3>
      
      <ul>
        <li><strong>Mistake 1:</strong> Risking more than 2% per trade</li>
        <li><strong>Mistake 2:</strong> Not having a stop loss</li>
        <li><strong>Mistake 3:</strong> Moving your stop loss (never do this!)</li>
        <li><strong>Mistake 4:</strong> Overtrading after a loss</li>
        <li><strong>Mistake 5:</strong> Risking too much on one trade</li>
        <li><strong>Mistake 6:</strong> Not adjusting position size for different markets</li>
        <li><strong>Mistake 7:</strong> Trading when emotional</li>
        <li><strong>Mistake 8:</strong> Not respecting the daily loss limit</li>
      </ul>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Risk management is your most important skill. Follow the 2% rule, the 6% daily rule, and always calculate your position size. Protect your capital first, make profits second. Without proper risk management, you cannot succeed long-term.
      </div>
    `
  },
  {
    id: 6,
    title: "Trading Psychology",
    duration: "20 min",
    content: `
      <h3>Your Mind is Your Most Powerful Trading Tool</h3>
      
      <p>Your mind is the most important part of your trading system. Even with the best strategy, if your psychology is poor, you'll fail. Professional traders spend as much time on psychology as they do on strategy.</p>
      
      <div class="highlight-box">
        <strong>💡 The Trading Triangle:</strong>
        <br>
        <br>📊 Strategy = 25%
        <br>💰 Risk Management = 25%
        <br>🧠 Psychology = 50%
        <br>
        <br>Your mind is half of your success!
      </div>
      
      <h3>The 5 Psychological Traps</h3>
      
      <h4>1. Fear</h4>
      <p>Fear is the most common emotion in trading. It manifests in many ways:</p>
      <ul>
        <li><strong>Fear of losing:</strong> Prevents you from taking good trades</li>
        <li><strong>Fear of missing out (FOMO):</strong> Causes you to chase trades</li>
        <li><strong>Fear of winning:</strong> Makes you exit winning trades too early</li>
        <li><strong>Fear of being wrong:</strong> Makes you hold losing trades too long</li>
      </ul>
      
      <div class="success-box">
        <strong>✅ How to Overcome Fear:</strong>
        <br>• Use proper risk management (2% rule)
        <br>• Focus on the process, not the outcome
        <br>• Accept that losses are part of trading
        <br>• Practice on demo account to build confidence
        <br>• Trust your strategy and system
      </div>
      
      <h4>2. Greed</h4>
      <p>Greed is just as dangerous as fear. It causes you to:</p>
      <ul>
        <li><strong>Overtrade:</strong> Taking too many trades</li>
        <li><strong>Overrisk:</strong> Risking too much on one trade</li>
        <li><strong>Chase profits:</strong> Staying in winning trades too long</li>
        <li><strong>Ignore rules:</strong> Breaking your trading plan</li>
      </ul>
      
      <div class="warning-box">
        <strong>⚠️ How to Overcome Greed:</strong>
        <br>• Set realistic daily profit targets
        <br>• Take profits when your target is hit
        <br>• Stick to your position sizing
        <br>• Remember: The market will still be there tomorrow
        <br>• Focus on consistency, not size
      </div>
      
      <h4>3. Revenge Trading</h4>
      <p>This is the most destructive emotion. It occurs when you lose money and try to "get it back" by taking bigger risks.</p>
      
      <div class="example-box">
        <strong>📊 Revenge Trading Example:</strong>
        <br>You lose $20 on a trade.
        <br>Your brain says: "I need to get that $20 back!"
        <br>You take a $40 trade to recover it.
        <br>You lose again.
        <br>Now you're down $60.
        <br>You take a $100 trade...
        <br>
        <br>This is a DEATH SPIRAL. Stop it immediately.
      </div>
      
      <h4>4. Overconfidence</h4>
      <p>After a few wins, traders often become overconfident and start taking unnecessary risks.</p>
      <ul>
        <li>You had 5 wins in a row? Great! But don't increase your stake.</li>
        <li>You've been profitable for a week? Good! But stay disciplined.</li>
        <li>One good trade doesn't mean you're an expert.</li>
      </ul>
      
      <h4>5. Analysis Paralysis</h4>
      <p>Overthinking every trade. Analyzing too many indicators. Waiting for the "perfect" setup.</p>
      <ul>
        <li>Check 2-3 things (trend, support/resistance, momentum)</li>
        <li>Make a decision</li>
        <li>If your setup appears, TAKE THE TRADE</li>
        <li>If you hesitate, skip it</li>
      </ul>
      
      <h3>The Trading Journal</h3>
      
      <p>A trading journal is your most important tool for improving psychology. It helps you identify patterns in your behavior and decision-making.</p>
      
      <div class="example-box">
        <strong>📊 What to Write in Your Journal:</strong>
        <br>
        <br><strong>For Each Trade:</strong>
        <br>• Market and trade type
        <br>• Entry price and exit price
        <br>• Stake and position size
        <br>• Win or loss
        <br>• What was your reasoning?
        <br>• What were you feeling?
        <br>• What did you learn?
        <br>
        <br><strong>End of Day Review:</strong>
        <br>• Total trades and win rate
        <br>• Total profit/loss
        <br>• What went well?
        <br>• What needs improvement?
        <br>• One thing to do differently tomorrow
      </div>
      
      <h3>Building Trading Discipline</h3>
      
      <div class="success-box">
        <strong>✅ Daily Habits of Successful Traders:</strong>
        <br>
        <br>1. <strong>Prepare:</strong> Review your plan before trading
        <br>2. <strong>Warm Up:</strong> Check markets, get into the right mindset
        <br>3. <strong>Trade Your Plan:</strong> Follow your strategy exactly
        <br>4. <strong>Take Breaks:</strong> Step away every 2 hours
        <br>5. <strong>Review:</strong> Journal every trade
        <br>6. <strong>Learn:</strong> One new thing every day
        <br>7. <strong>Rest:</strong> Get enough sleep
        <br>8. <strong>Exercise:</strong> Physical activity helps mental clarity
        <br>9. <strong>Meditate:</strong> 5-10 minutes of mindfulness
        <br>10. <strong>Stay Humble:</strong> Markets are always changing
      </div>
      
      <h3>The "Stop" Signs</h3>
      
      <p>Know when to stop trading. These are clear signals that you need a break:</p>
      
      <ul>
        <li><strong>You feel angry or frustrated</strong> - STOP</li>
        <li><strong>You've lost 3 trades in a row</strong> - STOP</li>
        <li><strong>You've reached your daily loss limit</strong> - STOP</li>
        <li><strong>You can't focus or concentrate</strong> - STOP</li>
        <li><strong>You're thinking about "recovering" losses</strong> - STOP</li>
        <li><strong>You haven't slept well</strong> - STOP</li>
        <li><strong>You're distracted by personal issues</strong> - STOP</li>
      </ul>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Trading psychology is half of your success. Manage your emotions, keep a journal, and build discipline. Know when to stop and when to trade. Your mind is your greatest asset or your biggest enemy. Master it and you'll master trading.
      </div>
    `
  }
];

// ============================================
// MAIN COMPONENT
// ============================================

const Academy = () => {
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState([]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleLesson = (lessonId) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const scrollToLesson = (id) => {
    const element = document.getElementById(`lesson-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const progress = lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0;

  return (
    <PageWrapper>
      <BackButton onClick={handleGoBack}>
        <span className="arrow">←</span> Back
      </BackButton>

      <HeroSection>
        <div className="badge">🎓 Complete Course</div>
        <h1 className="title">
          Voltix Traders <span className="gradient">Academy</span>
        </h1>
        <p className="subtitle">
          Your complete guide to Deriv trading. From absolute beginner to confident trader.
          Start with lesson 1 and progress through the course at your own pace.
        </p>
        <div className="course-meta">
          <span className="meta-item"><span className="icon">📚</span> {lessons.length} Lessons</span>
          <span className="meta-item"><span className="icon">⏱️</span> ~3 Hours Total</span>
          <span className="meta-item"><span className="icon">📊</span> {progress}% Complete</span>
          <span className="meta-item"><span className="icon">🎯</span> Beginner to Pro</span>
        </div>
      </HeroSection>

      <TOCSection>
        <div className="toc-title"><span className="icon">📑</span> Table of Contents</div>
        <div className="toc-grid">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="toc-item" onClick={() => scrollToLesson(lesson.id)}>
              <span className="num">{lesson.id}.</span>
              <span className="label">{lesson.title}</span>
              <span style={{ fontSize: '10px', color: completedLessons.includes(lesson.id) ? '#22c55e' : '#4a4f5e', marginLeft: 'auto' }}>
                {completedLessons.includes(lesson.id) ? '✅' : '📖'}
              </span>
            </div>
          ))}
        </div>
      </TOCSection>

      <LessonContainer>
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          return (
            <LessonCard key={lesson.id} id={`lesson-${lesson.id}`}>
              <div className="lesson-header">
                <span className="lesson-number">Lesson {lesson.id}</span>
                <span className="lesson-title">{lesson.title}</span>
                <span className="lesson-duration">{lesson.duration}</span>
                <button onClick={() => toggleLesson(lesson.id)} style={{
                  background: 'none', border: 'none', color: isCompleted ? '#22c55e' : '#64748b',
                  fontSize: '20px', cursor: 'pointer', transition: 'all 0.2s ease', padding: '0 4px'
                }}>
                  {isCompleted ? '✅' : '○'}
                </button>
              </div>
              <div className="lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </LessonCard>
          );
        })}
      </LessonContainer>

      {progress === 100 && (
        <div style={{
          textAlign: 'center', padding: '40px 20px', marginTop: '20px', marginBottom: '20px',
          background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.08)',
          borderRadius: '16px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', width: '100%',
          animation: `${fadeIn} 0.8s ease`
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉🏆🎉</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
            Congratulations!
          </div>
          <div style={{ fontSize: '16px', color: '#94a3b8' }}>
            You've completed all {lessons.length} lessons! You're now ready to start your trading journey with confidence. 🚀
          </div>
        </div>
      )}

      <div style={{
        marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        textAlign: 'center', fontSize: '11px', color: '#4a4f5e', maxWidth: '900px',
        marginLeft: 'auto', marginRight: 'auto', width: '100%'
      }}>
        Voltix Traders Academy © 2024 • Learn. Practice. Master.
        <span style={{ display: 'block', marginTop: '2px', color: '#3a4055' }}>
          🎓 Every expert was once a beginner. Keep learning!
        </span>
      </div>
    </PageWrapper>
  );
};

export default Academy;