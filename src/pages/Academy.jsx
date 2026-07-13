// src/pages/Academy.jsx
import React, { useState } from 'react';
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
  background: ${props => props.theme?.colors?.background || '#0b0e14'};
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
    background: ${props => props.theme?.colors?.scrollbar || '#2a2e3d'};
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
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
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
    background: ${props => props.theme?.colors?.accentActive || 'rgba(56,189,248,0.08)'};
    border: 1px solid ${props => props.theme?.colors?.border || 'rgba(56,189,248,0.1)'};
    color: ${props => props.theme?.colors?.accent || '#38bdf8'};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .title {
    font-size: 42px;
    font-weight: 800;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    line-height: 1.1;
    margin-bottom: 16px;

    .gradient {
      background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#818cf8'})`};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .subtitle {
    font-size: 18px;
    color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
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
      color: ${props => props.theme?.colors?.textMuted || '#64748b'};
      background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};

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
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.015)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
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
      color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
      font-size: 13px;
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover {
        background: ${props => props.theme?.colors?.accentActive || 'rgba(56,189,248,0.04)'};
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
  background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.015)'};
  border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
  border-radius: 16px;
  padding: 28px 30px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent + '30' || 'rgba(56,189,248,0.06)'};
    background: ${props => props.theme?.colors?.background + '60' || 'rgba(255,255,255,0.02)'};
  }

  .lesson-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.02)'};

    .lesson-number {
      font-size: 12px;
      font-weight: 700;
      color: ${props => props.theme?.colors?.accent || '#38bdf8'};
      background: ${props => props.theme?.colors?.accentActive || 'rgba(56,189,248,0.08)'};
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
      background: ${props => props.theme?.colors?.background + '40' || 'rgba(255,255,255,0.02)'};
      padding: 2px 12px;
      border-radius: 20px;
      border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
      flex-shrink: 0;
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
      border-bottom: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.02)'};
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
      color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
    }

    ul, ol {
      margin: 10px 0 14px 24px;
      li {
        margin-bottom: 8px;
        color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
      }
    }

    .highlight-box {
      background: ${props => props.theme?.colors?.accentActive || 'rgba(56,189,248,0.04)'};
      border-left: 3px solid ${props => props.theme?.colors?.accent || '#38bdf8'};
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
      color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
    }

    .warning-box {
      background: rgba(239, 68, 68, 0.04);
      border-left: 3px solid #ef4444;
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
      color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
    }

    .success-box {
      background: rgba(34, 197, 94, 0.04);
      border-left: 3px solid #22c55e;
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
      color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
    }

    .example-box {
      background: rgba(251, 191, 36, 0.04);
      border: 1px solid rgba(251, 191, 36, 0.08);
      padding: 14px 18px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 14px;
      color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
    }

    .code-block {
      background: ${props => props.theme?.colors?.background + '80' || 'rgba(0,0,0,0.3)'};
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: ${props => props.theme?.colors?.text || '#e2e8f0'};
      overflow-x: auto;
      margin: 10px 0;
      border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.03)'};
    }

    .key-takeaway {
      background: rgba(129, 140, 248, 0.04);
      border: 1px solid rgba(129, 140, 248, 0.08);
      padding: 14px 18px;
      border-radius: 8px;
      margin: 14px 0;
      color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};

      strong {
        color: ${props => props.theme?.colors?.accent || '#818cf8'};
      }
    }

    .definition-box {
      background: rgba(34, 197, 94, 0.02);
      border: 1px solid rgba(34, 197, 94, 0.06);
      padding: 12px 16px;
      border-radius: 8px;
      margin: 10px 0;
      color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};

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
        border: 1px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.04)'};
        text-align: left;
        font-size: 14px;
      }

      th {
        background: ${props => props.theme?.colors?.accentActive || 'rgba(56,189,248,0.04)'};
        color: ${props => props.theme?.colors?.text || '#f1f5f9'};
        font-weight: 600;
      }

      td {
        color: ${props => props.theme?.colors?.textSecondary || '#cbd5e1'};
      }
    }

    strong {
      color: ${props => props.theme?.colors?.text || '#f1f5f9'};
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
// LESSON DATA (UNCHANGED)
// ============================================

const lessons = [
  {
    id: 1,
    title: "What is Trading?",
    duration: "20 min",
    content: `
      <h3>Welcome to the World of Trading</h3>
      <p>Imagine you're at a local market. You see a farmer selling apples for $1 each. You know that across town, apples are selling for $2 each. You buy 100 apples for $100, take them across town, and sell them for $200. You just made $100 profit! Congratulations - you just traded!</p>
      <div class="highlight-box">
        <strong>💡 Core Concept:</strong>
        <br>Trading = Buying Low + Selling High
      </div>
      <p>This is the fundamental law of trading: When demand exceeds supply, prices rise. When supply exceeds demand, prices fall.</p>
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Trading is buying low and selling high. Always start with a demo account, risk only 2% per trade, and learn from every trade.
      </div>
    `
  },
  {
    id: 2,
    title: "Understanding Markets",
    duration: "25 min",
    content: `
      <h3>What Are Markets?</h3>
      <p>Think of markets like different departments in a large store. Each department sells different products, has different prices, and operates differently.</p>
      <div class="highlight-box">
        <strong>💡 Why Volatility Indices are Great for Beginners:</strong>
        <br>1. Always Open: Trade 24/7
        <br>2. No News Impact
        <br>3. Predictable patterns
      </div>
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Different markets have different characteristics. Choose ONE market to start with and master it before trying others.
      </div>
    `
  },
  {
    id: 3,
    title: "Trade Types",
    duration: "25 min",
    content: `
      <h3>Understanding Trade Types</h3>
      <p>Think of trade types like different games you can play. Each game has different rules, and each has its own strategy.</p>
      <div class="example-box">
        <strong>📊 Example:</strong>
        <br>Current price: 8,459
        <br>You think the price will go higher.
        <br>You choose: OVER
        <br>✅ If the next price is higher → YOU WIN!
      </div>
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Each trade type has its own strategy. Master one trade type before moving to the next!
      </div>
    `
  },
  {
    id: 4,
    title: "Reading Charts",
    duration: "30 min",
    content: `
      <h3>Understanding Charts</h3>
      <p>Charts are the windows into the market. They show you what's happening with prices, where they've been, and where they might be going.</p>
      <div class="example-box">
        <strong>📊 Support & Resistance:</strong>
        <br>Support: Price bounces UP from here
        <br>Resistance: Price bounces DOWN from here
      </div>
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Learn to read candlestick patterns, support/resistance, and trendlines. Practice reading charts daily!
      </div>
    `
  },
  {
    id: 5,
    title: "Risk Management",
    duration: "25 min",
    content: `
      <h3>Why Risk Management is Everything</h3>
      <p>Risk management is the single most important skill in trading. Without proper risk management, even the best traders will eventually lose everything.</p>
      <div class="warning-box">
        <strong>⚠️ The 2% Rule:</strong>
        <br>Never risk more than 2% of your account on any single trade.
      </div>
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Follow the 2% rule, the 6% daily rule, and always calculate your position size. Protect your capital first!
      </div>
    `
  },
  {
    id: 6,
    title: "Trading Psychology",
    duration: "20 min",
    content: `
      <h3>Your Mind is Your Most Powerful Trading Tool</h3>
      <p>Your mind is the most important part of your trading system. Even with the best strategy, if your psychology is poor, you'll fail.</p>
      <div class="success-box">
        <strong>✅ Daily Habits of Successful Traders:</strong>
        <br>1. Prepare: Review your plan before trading
        <br>2. Trade Your Plan: Follow your strategy exactly
        <br>3. Review: Journal every trade
      </div>
      <div class="key-takeaway">
        <strong>🎯 Key Takeaway:</strong> Trading psychology is half of your success. Manage your emotions, keep a journal, and build discipline.
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
          background: 'rgba(34, 197, 94, 0.04)', border: '1px solid rgba(34, 197, 94, 0.08)',
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