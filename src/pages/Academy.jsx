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

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.05); }
  50% { box-shadow: 0 0 40px rgba(56, 189, 248, 0.1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(180deg, #0b0e14 0%, #0f131a 100%);
  padding: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #2a2e3d;
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
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    color: #f1f5f9;
    transform: translateX(-4px);
  }

  .arrow {
    font-size: 18px;
    line-height: 1;
  }
`;

// ===== HERO SECTION =====
const HeroSection = styled.div`
  text-align: center;
  padding: 40px 20px 50px;
  animation: ${fadeIn} 0.6s ease;

  .badge {
    display: inline-block;
    padding: 4px 16px;
    border-radius: 20px;
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.1);
    color: #38bdf8;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .title {
    font-size: 42px;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.1;
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
    color: #94a3b8;
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
      color: #64748b;
      background: rgba(255, 255, 255, 0.02);
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.04);

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

// ===== TABLE OF CONTENTS =====
const TOCSection = styled.div`
  max-width: 900px;
  margin: 0 auto 40px;
  width: 100%;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 24px 28px;
  animation: ${fadeIn} 0.7s ease;

  .toc-title {
    font-size: 20px;
    font-weight: 700;
    color: #f1f5f9;
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
      color: #94a3b8;
      font-size: 13px;
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover {
        background: rgba(56, 189, 248, 0.04);
        color: #f1f5f9;
      }

      .num {
        font-size: 11px;
        font-weight: 700;
        color: #38bdf8;
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

// ===== LESSON CONTAINER =====
const LessonContainer = styled.div`
  max-width: 900px;
  margin: 0 auto 24px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease;
`;

const LessonCard = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 28px 30px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(56, 189, 248, 0.06);
    background: rgba(255, 255, 255, 0.02);
  }

  .lesson-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);

    .lesson-number {
      font-size: 12px;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.08);
      padding: 2px 12px;
      border-radius: 20px;
      flex-shrink: 0;
    }

    .lesson-title {
      font-size: 20px;
      font-weight: 700;
      color: #f1f5f9;
      flex: 1;
    }

    .lesson-duration {
      font-size: 11px;
      color: #64748b;
      background: rgba(255, 255, 255, 0.02);
      padding: 2px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.04);
      flex-shrink: 0;
    }
  }

  .lesson-content {
    color: #cbd5e1;
    font-size: 15px;
    line-height: 1.9;

    h3 {
      color: #f1f5f9;
      font-size: 17px;
      font-weight: 600;
      margin: 20px 0 10px 0;
    }

    h4 {
      color: #e2e8f0;
      font-size: 15px;
      font-weight: 600;
      margin: 16px 0 8px 0;
    }

    p {
      margin-bottom: 12px;
    }

    ul, ol {
      margin: 10px 0 14px 20px;
      li {
        margin-bottom: 6px;
      }
    }

    .highlight-box {
      background: rgba(56, 189, 248, 0.04);
      border-left: 3px solid #38bdf8;
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
      background: rgba(0, 0, 0, 0.3);
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #e2e8f0;
      overflow-x: auto;
      margin: 10px 0;
      border: 1px solid rgba(255, 255, 255, 0.03);
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

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;

      th, td {
        padding: 10px 14px;
        border: 1px solid rgba(255, 255, 255, 0.04);
        text-align: left;
        font-size: 14px;
      }

      th {
        background: rgba(56, 189, 248, 0.04);
        color: #f1f5f9;
        font-weight: 600;
      }

      td {
        color: #cbd5e1;
      }
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
      h3 { font-size: 15px; }
    }
  }

  @media (max-width: 480px) {
    padding: 14px 12px;
    .lesson-header .lesson-title { font-size: 15px; }
  }
`;

// ============================================
// LESSON DATA
// ============================================

const lessons = [
  {
    id: 1,
    title: "What is Deriv Trading?",
    duration: "10 min",
    content: `
      <h3>Welcome to the World of Trading!</h3>
      
      <p>Imagine you're at a market buying and selling fruits. You buy apples when they're cheap and sell them when they're expensive. That's trading!</p>
      
      <p>Deriv is like a digital marketplace where you can trade different assets. Instead of fruits, you trade things like:</p>
      
      <ul>
        <li><strong>Volatility Indices</strong> - Special markets that move up and down</li>
        <li><strong>Forex</strong> - Different currencies like USD, EUR, GBP</li>
        <li><strong>Commodities</strong> - Gold, Silver, Oil</li>
        <li><strong>Cryptocurrencies</strong> - Bitcoin, Ethereum</li>
      </ul>
      
      <div class="highlight-box">
        <strong>💡 Key Point:</strong> Trading is simply guessing whether a price will go UP or DOWN.
      </div>
      
      <h3>How Does It Work?</h3>
      
      <p>When you trade on Deriv, you're making a prediction. You look at a chart, see what's happening, and guess what will happen next.</p>
      
      <div class="example-box">
        <strong>📊 Example:</strong> You see the price of Volatility 100 at 8,459. You think it will go higher. You place a trade predicting it will go UP. If you're right, you win money!
      </div>
      
      <h3>The 3 Golden Rules</h3>
      
      <ul>
        <li><strong>Rule 1:</strong> Never risk more than you can afford to lose</li>
        <li><strong>Rule 2:</strong> Always use a demo account first</li>
        <li><strong>Rule 3:</strong> Learn from every trade, win or lose</li>
      </ul>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Deriv trading is about making educated guesses on price movements. Start small, learn consistently, and you'll improve over time.
      </div>
    `
  },
  {
    id: 2,
    title: "Understanding Markets",
    duration: "15 min",
    content: `
      <h3>What Are Markets?</h3>
      
      <p>Think of markets like different shops in a mall. Each shop sells different things. On Deriv, you have different markets to choose from.</p>
      
      <h3>Deriv's Main Markets</h3>
      
      <table>
        <tr>
          <th>Market</th>
          <th>What It Is</th>
          <th>Best For</th>
        </tr>
        <tr>
          <td>Volatility Indices</td>
          <td>Artificial markets that move based on math</td>
          <td>Beginners</td>
        </tr>
        <tr>
          <td>Forex</td>
          <td>Real-world currency trading</td>
          <td>Intermediate</td>
        </tr>
        <tr>
          <td>Commodities</td>
          <td>Physical assets like gold and oil</td>
          <td>Advanced</td>
        </tr>
        <tr>
          <td>Cryptocurrencies</td>
          <td>Digital currencies like Bitcoin</td>
          <td>Experts</td>
        </tr>
      </table>
      
      <h3>Volatility Indices - Your Best Friend!</h3>
      
      <p>Volatility Indices are Deriv's special creation. They're like a video game market - they follow rules based on math, not real-world events. This makes them perfect for beginners!</p>
      
      <div class="highlight-box">
        <strong>💡 Fun Fact:</strong> Volatility 100 is the most popular market on Deriv. It moves a lot, making it exciting to trade!
      </div>
      
      <div class="success-box">
        <strong>✅ Tip:</strong> Start with Volatility 10 or 25. They move slower, making them easier to learn with.
      </div>
      
      <h4>Understanding Market Numbers</h4>
      
      <p>You'll see numbers like R_10, R_25, R_50, R_75, R_100. These represent how much the price moves:</p>
      
      <ul>
        <li><strong>R_10:</strong> Small movements, slow pace</li>
        <li><strong>R_25:</strong> Medium movements</li>
        <li><strong>R_50:</strong> Active movements</li>
        <li><strong>R_75:</strong> Fast movements</li>
        <li><strong>R_100:</strong> Very fast, big movements</li>
      </ul>
      
      <div class="warning-box">
        <strong>⚠️ Warning:</strong> Higher numbers mean more movement, but also more risk. Start with lower numbers!
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Choose markets that match your skill level. Beginners should start with Volatility 10 or 25. As you improve, you can try more active markets.
      </div>
    `
  },
  {
    id: 3,
    title: "Over/Under Explained",
    duration: "12 min",
    content: `
      <h3>The Simplest Trade Type</h3>
      
      <p>Imagine you have a number: 50. You need to guess if the next number will be higher or lower than 50.</p>
      
      <p><strong>OVER:</strong> You think it will be MORE than 50</p>
      <p><strong>UNDER:</strong> You think it will be LESS than 50</p>
      
      <div class="example-box">
        <strong>📊 Real Example:</strong>
        <br>Current price: 8,459
        <br>You predict: OVER 8,459
        <br>Price goes to: 8,460 → YOU WIN! 🎉
        <br>Price goes to: 8,458 → YOU LOSE! 😢
      </div>
      
      <h3>When to Choose OVER</h3>
      
      <div class="success-box">
        <strong>📈 OVER Signals:</strong>
        <ul>
          <li>Price is going UP (trending higher)</li>
          <li>Green candles appear on the chart</li>
          <li>Market is in an uptrend</li>
          <li>Good news about the market</li>
        </ul>
      </div>
      
      <h3>When to Choose UNDER</h3>
      
      <div class="warning-box">
        <strong>📉 UNDER Signals:</strong>
        <ul>
          <li>Price is going DOWN (trending lower)</li>
          <li>Red candles appear on the chart</li>
          <li>Market is in a downtrend</li>
          <li>Bad news about the market</li>
        </ul>
      </div>
      
      <div class="highlight-box">
        <strong>💡 Pro Tip:</strong> Don't guess randomly! Look at the chart. If the line is going UP, choose OVER. If it's going DOWN, choose UNDER.
      </div>
      
      <h3>Practice Example</h3>
      
      <p>You're looking at Volatility 100. The price has been going up for 5 minutes. You see it's currently at 8,460. What do you choose?</p>
      
      <div class="example-box">
        <strong>✅ Answer:</strong> Since the price is going UP, you should choose OVER!
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Over/Under is the simplest and most popular trade type. Always check the trend before choosing. Trade WITH the trend!
      </div>
    `
  },
  {
    id: 4,
    title: "Even/Odd Explained",
    duration: "10 min",
    content: `
      <h3>The Number Guessing Game</h3>
      
      <p>This is like playing a game where you guess if a number is even or odd.</p>
      
      <p><strong>EVEN:</strong> The last digit will be 0, 2, 4, 6, or 8</p>
      <p><strong>ODD:</strong> The last digit will be 1, 3, 5, 7, or 9</p>
      
      <div class="example-box">
        <strong>📊 Example:</strong>
        <br>Price: 8,459
        <br>Last digit: 9
        <br>If you chose ODD → YOU WIN! 🎉
        <br>If you chose EVEN → YOU LOSE! 😢
      </div>
      
      <h3>Understanding Probability</h3>
      
      <p>Since there are 5 even numbers and 5 odd numbers, the chance of winning is about 50%.</p>
      
      <div class="highlight-box">
        <strong>💡 Fun Fact:</strong> In Deriv, Even/Odd has a 50% chance of winning, making it a fair game!
      </div>
      
      <h3>Tips for Even/Odd Trading</h3>
      
      <ul>
        <li>Look at the last 5 digits to see a pattern</li>
        <li>If the last 3 digits were odd, even might be more likely</li>
        <li>Don't chase patterns - each digit is independent</li>
        <li>Use small stakes since it's 50/50</li>
      </ul>
      
      <div class="warning-box">
        <strong>⚠️ Important:</strong> Even/Odd is random. No strategy can guarantee a win. Treat it like a game of chance.
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Even/Odd is simple and fun. It's good for quick trades, but remember it's based on luck, not skill.
      </div>
    `
  },
  {
    id: 5,
    title: "Matches/Differs Explained",
    duration: "10 min",
    content: `
      <h3>The Matching Game</h3>
      
      <p>This is like playing a matching game. You pick a number, and you guess if the last digit will match your number.</p>
      
      <p><strong>MATCHES:</strong> The last digit will be the SAME as your chosen number</p>
      <p><strong>DIFFERS:</strong> The last digit will be DIFFERENT from your chosen number</p>
      
      <div class="example-box">
        <strong>📊 Example:</strong>
        <br>You choose: 5
        <br>You predict: MATCHES 5
        <br>Last digit becomes: 5 → YOU WIN! 🎉
        <br>Last digit becomes: 7 → YOU LOSE! 😢
      </div>
      
      <h3>Understanding the Odds</h3>
      
      <p>There are 10 possible digits (0-9). If you choose MATCHES, you have a 10% chance of winning. If you choose DIFFERS, you have a 90% chance.</p>
      
      <table>
        <tr>
          <th>Choice</th>
          <th>Chance of Winning</th>
          <th>Payout</th>
        </tr>
        <tr>
          <td>MATCHES</td>
          <td>10%</td>
          <td>High (around 8x)</td>
        </tr>
        <tr>
          <td>DIFFERS</td>
          <td>90%</td>
          <td>Low (around 1.1x)</td>
        </tr>
      </table>
      
      <div class="highlight-box">
        <strong>💡 Strategy:</strong> Many traders choose DIFFERS because it wins 90% of the time. But the payout is small. MATCHES pays more but wins less often.
      </div>
      
      <h3>Pro Tip</h3>
      
      <div class="success-box">
        <strong>✅ Tip:</strong> If you want consistent small wins, choose DIFFERS. If you want a big win, choose MATCHES on your lucky number!
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Matches/Differs is a high-risk, high-reward game. Choose MATCHES for big wins, DIFFERS for consistent small wins.
      </div>
    `
  },
  {
    id: 6,
    title: "Your First Trade",
    duration: "15 min",
    content: `
      <h3>Making Your First Trade</h3>
      
      <p>Follow these steps to make your first trade. Don't worry if it's confusing - everyone starts here!</p>
      
      <h4>Step 1: Open Deriv</h4>
      <p>Go to app.deriv.com and log in to your account. If you don't have one, create a demo account first.</p>
      
      <h4>Step 2: Choose Your Market</h4>
      <p>Select "Volatility 100 (1s) Index" - it's beginner-friendly!</p>
      
      <h4>Step 3: Pick Your Trade Type</h4>
      <p>Start with "Over/Under" - it's the simplest.</p>
      
      <h4>Step 4: Set Your Stake</h4>
      <p>Enter $1. Never risk more than 2% of your account.</p>
      
      <h4>Step 5: Choose Your Direction</h4>
      <p>Look at the chart. If it's going UP, choose OVER. If it's going DOWN, choose UNDER.</p>
      
      <h4>Step 6: Click "Purchase"</h4>
      <p>Click the button and wait for the result!</p>
      
      <div class="example-box">
        <strong>📊 Walk Through:</strong>
        <br>1. Open app.deriv.com
        <br>2. Click on Volatility 100 (1s)
        <br>3. Select "Over/Under"
        <br>4. Type 1 in the stake box
        <br>5. Check the chart - is it going UP or DOWN?
        <br>6. Click "Purchase" and watch!
      </div>
      
      <div class="success-box">
        <strong>✅ Congratulations!</strong>
        <br>You just made your first trade. Win or lose, you learned something valuable!
      </div>
      
      <div class="highlight-box">
        <strong>💡 Remember:</strong>
        <ul>
          <li>Start with small stakes ($1)</li>
          <li>Only trade with money you can afford to lose</li>
          <li>Write down what you learned</li>
          <li>Every trade is a lesson!</li>
        </ul>
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Your first trade is the most important step. Win or lose, you've started your trading journey!
      </div>
    `
  },
  {
    id: 7,
    title: "Creating Your Account",
    duration: "10 min",
    content: `
      <h3>Creating Your Deriv Account</h3>
      
      <p>Let's get you set up with Deriv so you can start trading!</p>
      
      <h4>Step 1: Visit Deriv.com</h4>
      <p>Go to deriv.com and click "Sign Up" in the top right corner.</p>
      
      <h4>Step 2: Enter Your Email</h4>
      <p>Use a valid email address. You'll need to verify it.</p>
      
      <h4>Step 3: Create a Password</h4>
      <p>Make it strong! Use letters, numbers, and special characters.</p>
      
      <h4>Step 4: Verify Your Email</h4>
      <p>Check your email for the verification link and click it.</p>
      
      <div class="success-box">
        <strong>✅ You're In!</strong>
        <br>You now have a Deriv account. Next, let's set up your demo account.
      </div>
      
      <h3>Setting Up Your Demo Account</h3>
      
      <p>A demo account gives you virtual money to practice with. It's like a video game where you can learn without risking real money.</p>
      
      <ul>
        <li>You get $10,000 in virtual money</li>
        <li>You can reset it anytime</li>
        <li>All trades are practice</li>
        <li>Perfect for learning!</li>
      </ul>
      
      <div class="highlight-box">
        <strong>💡 Pro Tip:</strong> Use your demo account for at least 2 weeks before using real money. Practice until you're consistent!
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> A demo account is your best friend when starting. It's free, safe, and you can learn without risking real money.
      </div>
    `
  },
  {
    id: 8,
    title: "Using Demo Account",
    duration: "12 min",
    content: `
      <h3>Mastering Your Demo Account</h3>
      
      <p>Think of your demo account as a training ground. Here's how to use it effectively:</p>
      
      <h4>Why Use a Demo Account?</h4>
      
      <ul>
        <li><strong>No Risk:</strong> It's virtual money. You can't lose real cash!</li>
        <li><strong>Learn Faster:</strong> Make mistakes without consequences</li>
        <li><strong>Test Strategies:</strong> Try different approaches and see what works</li>
        <li><strong>Build Confidence:</strong> Gain experience before using real money</li>
      </ul>
      
      <div class="success-box">
        <strong>✅ Challenge:</strong> Make 100 trades on your demo account. Aim for 50% win rate. This will teach you discipline!
      </div>
      
      <h3>What to Practice</h3>
      
      <div class="example-box">
        <strong>📊 Practice Plan:</strong>
        <br>Week 1: Learn the platform and make 20 trades
        <br>Week 2: Focus on one strategy and make 30 trades
        <br>Week 3: Try different trade types and make 30 trades
        <br>Week 4: Review your results and prepare for real trading
      </div>
      
      <h3>Common Demo Mistakes</h3>
      
      <div class="warning-box">
        <strong>⚠️ Watch Out For:</strong>
        <ul>
          <li>Pretending it's real money and stressing out</li>
          <li>Not taking it seriously because it's virtual</li>
          <li>Using too much money per trade</li>
          <li>Not keeping a trading journal</li>
        </ul>
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Treat your demo account like it's real money. The habits you build here will follow you to real trading.
      </div>
    `
  },
  {
    id: 9,
    title: "Reading Charts",
    duration: "18 min",
    content: `
      <h3>Understanding Charts</h3>
      
      <p>Charts show you what's happening with the price. Learning to read them is like learning to read a map!</p>
      
      <h3>What Are Candlesticks?</h3>
      
      <p>Candlesticks are the building blocks of charts. Each one shows you what happened during a specific time period.</p>
      
      <div class="example-box">
        <strong>📊 Candlestick Anatomy:</strong>
        <br>🟢 Green/White = Price went UP (Bullish)
        <br>🔴 Red/Black = Price went DOWN (Bearish)
        <br>
        <br>Body = Open to Close
        <br>Wick = High to Low
      </div>
      
      <h3>Key Chart Patterns</h3>
      
      <ul>
        <li><strong>Uptrend:</strong> Higher highs and higher lows → Price is going UP</li>
        <li><strong>Downtrend:</strong> Lower highs and lower lows → Price is going DOWN</li>
        <li><strong>Sideways:</strong> Price moves between two levels → No clear direction</li>
      </ul>
      
      <div class="highlight-box">
        <strong>💡 Remember:</strong>
        <br>📈 Uptrend = Look for OVER trades
        <br>📉 Downtrend = Look for UNDER trades
        <br>➡️ Sideways = Wait for a breakout
      </div>
      
      <h3>Simple Chart Reading</h3>
      
      <p>Just follow these simple rules:</p>
      
      <ul>
        <li>Look at the recent candles - are they mostly green or red?</li>
        <li>If mostly green → price is going UP → choose OVER</li>
        <li>If mostly red → price is going DOWN → choose UNDER</li>
        <li>If mixed → wait for a clearer signal</li>
      </ul>
      
      <div class="success-box">
        <strong>✅ Practice:</strong> Look at a chart for 5 minutes. Notice the pattern. Is it going up or down? Trust your eyes!
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Charts tell you the story of the market. Learn to read them, and you'll make better trading decisions.
      </div>
    `
  },
  {
    id: 10,
    title: "Basic Strategy",
    duration: "15 min",
    content: `
      <h3>Your First Trading Strategy</h3>
      
      <p>A strategy is a set of rules you follow when trading. Here's a simple one to get you started.</p>
      
      <h3>The 20-Minute Momentum Strategy</h3>
      
      <p>This strategy works best on 1-minute charts.</p>
      
      <div class="example-box">
        <strong>📊 Rules:</strong>
        <br>1. Look at the 1-minute chart
        <br>2. Find a strong green or red candle
        <br>3. Trade in that direction
        <br>4. Use a 1-tick duration
        <br>5. Risk only 2% of your account
      </div>
      
      <h3>When to Enter</h3>
      
      <div class="success-box">
        <strong>✅ Entry Signals:</strong>
        <ul>
          <li>Strong green candle → Trade OVER</li>
          <li>Strong red candle → Trade UNDER</li>
          <li>Wait for confirmation (next candle same direction)</li>
          <li>Use limit orders for better prices</li>
        </ul>
      </div>
      
      <h3>When to Exit</h3>
      
      <div class="warning-box">
        <strong>⚠️ Exit Rules:</strong>
        <ul>
          <li>Take profit at 5-10 ticks</li>
          <li>Use stop loss at 2% risk</li>
          <li>If unsure, just take the win</li>
          <li>Better to win small than lose big</li>
        </ul>
      </div>
      
      <h3>Backtesting Your Strategy</h3>
      
      <p>Before using this strategy, test it on your demo account:</p>
      
      <ul>
        <li>Make 20 trades using this strategy</li>
        <li>Write down each result</li>
        <li>Calculate your win rate</li>
        <li>If it's above 50%, it's working!</li>
      </ul>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> A good strategy gives you a plan to follow. Start simple, test it, and improve it over time.
      </div>
    `
  },
  {
    id: 11,
    title: "Risk Management 101",
    duration: "14 min",
    content: `
      <h3>Why Risk Management Matters</h3>
      
      <p>Risk management is the most important skill in trading. It's like wearing a seatbelt - it keeps you safe!</p>
      
      <div class="highlight-box">
        <strong>💡 The Golden Rule:</strong>
        <br>Never risk more than you can afford to lose.
        <br>Always risk 2% or less per trade.
      </div>
      
      <h3>The 2% Rule</h3>
      
      <p>If you have $1,000, you should risk no more than $20 per trade.</p>
      
      <table>
        <tr>
          <th>Account Size</th>
          <th>2% Risk</th>
          <th>Max Stake</th>
        </tr>
        <tr>
          <td>$100</td>
          <td>$2</td>
          <td>$2</td>
        </tr>
        <tr>
          <td>$500</td>
          <td>$10</td>
          <td>$10</td>
        </tr>
        <tr>
          <td>$1,000</td>
          <td>$20</td>
          <td>$20</td>
        </tr>
        <tr>
          <td>$5,000</td>
          <td>$100</td>
          <td>$100</td>
        </tr>
      </table>
      
      <div class="warning-box">
        <strong>⚠️ Warning:</strong> Never risk more than 2%. This protects your account from big losses.
      </div>
      
      <h3>The 6% Daily Rule</h3>
      
      <p>If you lose 6% of your account in one day, STOP TRADING.</p>
      
      <p>Example: If you have $1,000 and you lose $60, take a break and come back tomorrow.</p>
      
      <div class="success-box">
        <strong>✅ Why This Works:</strong>
        <ul>
          <li>Prevents revenge trading</li>
          <li>Protects your account</li>
          <li>Keeps your emotions in check</li>
          <li>Ensures you live to trade another day</li>
        </ul>
      </div>
      
      <h3>Position Sizing</h3>
      
      <p>Position sizing is deciding how much to risk on each trade. Here's the formula:</p>
      
      <div class="code-block">
        Position Size = (Account Size × Risk %) / (Stop Loss)
      </div>
      
      <div class="example-box">
        <strong>📊 Example:</strong>
        <br>Account: $1,000
        <br>Risk: 2% ($20)
        <br>Stop Loss: 5 ticks
        <br>Position Size = $20 / 5 = $4 per tick
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Risk management is your #1 priority. Protect your account first, make profits second.
      </div>
    `
  },
  {
    id: 12,
    title: "Making Your First Trade",
    duration: "12 min",
    content: `
      <h3>Ready for Your First Real Trade?</h3>
      
      <p>If you've practiced on your demo account and feel confident, it's time for your first real trade. Take it slow!</p>
      
      <h4>Pre-Trade Checklist</h4>
      
      <div class="example-box">
        <strong>📋 Before Every Trade:</strong>
        <br>☑️ Is this a high-probability setup?
        <br>☑️ Is the trend clear?
        <br>☑️ Am I risking only 2%?
        <br>☑️ Do I have a stop loss in mind?
        <br>☑️ Am I calm and focused?
      </div>
      
      <h3>Step-by-Step Trade</h3>
      
      <div class="success-box">
        <strong>📈 Step 1:</strong> Look at the chart. Identify the trend.
        <br><strong>📈 Step 2:</strong> Choose your trade type (start with Over/Under)
        <br><strong>📈 Step 3:</strong> Set your stake (2% of your account)
        <br><strong>📈 Step 4:</strong> Make your prediction
        <br><strong>📈 Step 5:</strong> Click Purchase
        <br><strong>📈 Step 6:</strong> Wait for the result
        <br><strong>📈 Step 7:</strong> Learn from the outcome
      </div>
      
      <h3>What to Do After Your Trade</h3>
      
      <ul>
        <li><strong>Win:</strong> Great! Why did you win? Write it down.</li>
        <li><strong>Lose:</strong> That's okay! What went wrong? Learn from it.</li>
        <li><strong>In both cases:</strong> Write in your trading journal!</li>
      </ul>
      
      <div class="highlight-box">
        <strong>💡 Remember:</strong>
        <br>Your first trade is about LEARNING, not winning.
        <br>Every expert was once a beginner.
        <br>Win or lose, you're getting better!
      </div>
      
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Your first real trade is a milestone. Celebrate it, learn from it, and keep going!
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

      {/* HERO SECTION */}
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
          <span className="meta-item">
            <span className="icon">📚</span> {lessons.length} Lessons
          </span>
          <span className="meta-item">
            <span className="icon">⏱️</span> ~3 Hours Total
          </span>
          <span className="meta-item">
            <span className="icon">📊</span> {progress}% Complete
          </span>
          <span className="meta-item">
            <span className="icon">🎯</span> Beginner to Pro
          </span>
        </div>
      </HeroSection>

      {/* TABLE OF CONTENTS */}
      <TOCSection>
        <div className="toc-title">
          <span className="icon">📑</span> Table of Contents
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
              <span style={{ 
                fontSize: '10px', 
                color: completedLessons.includes(lesson.id) ? '#22c55e' : '#4a4f5e',
                marginLeft: 'auto'
              }}>
                {completedLessons.includes(lesson.id) ? '✅' : '📖'}
              </span>
            </div>
          ))}
        </div>
      </TOCSection>

      {/* LESSONS */}
      <LessonContainer>
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          
          return (
            <LessonCard key={lesson.id} id={`lesson-${lesson.id}`}>
              <div className="lesson-header">
                <span className="lesson-number">Lesson {lesson.id}</span>
                <span className="lesson-title">{lesson.title}</span>
                <span className="lesson-duration">{lesson.duration}</span>
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isCompleted ? '#22c55e' : '#64748b',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    padding: '0 4px'
                  }}
                >
                  {isCompleted ? '✅' : '○'}
                </button>
              </div>
              <div 
                className="lesson-content"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </LessonCard>
          );
        })}
      </LessonContainer>

      {/* COMPLETION MESSAGE */}
      {progress === 100 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          marginTop: '20px',
          marginBottom: '20px',
          background: 'rgba(34, 197, 94, 0.04)',
          border: '1px solid rgba(34, 197, 94, 0.08)',
          borderRadius: '16px',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          animation: `${fadeIn} 0.8s ease`
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉🏆🎉</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
            Congratulations!
          </div>
          <div style={{ fontSize: '16px', color: '#94a3b8' }}>
            You've completed all {lessons.length} lessons!
            <br />
            You're now ready to start your trading journey with confidence. 🚀
          </div>
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => {
                lessons.forEach(l => {
                  if (!completedLessons.includes(l.id)) {
                    setCompletedLessons(prev => [...prev, l.id]);
                  }
                });
              }}
              style={{
                padding: '8px 24px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '8px',
                color: '#22c55e',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Mark All Complete
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        textAlign: 'center',
        fontSize: '11px',
        color: '#4a4f5e',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
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