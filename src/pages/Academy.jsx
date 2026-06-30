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

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
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
  padding: 30px 20px 40px;
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
    font-size: 38px;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.1;
    margin-bottom: 12px;

    .gradient {
      background: linear-gradient(135deg, #22c55e, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .subtitle {
    font-size: 16px;
    color: #94a3b8;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    padding: 20px 12px 30px;
    .title {
      font-size: 28px;
    }
    .subtitle {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .title {
      font-size: 24px;
    }
  }
`;

// ===== PROGRESS BAR =====
const ProgressSection = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 30px;
  animation: ${fadeIn} 0.7s ease;

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .label {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    .percentage {
      font-size: 14px;
      font-weight: 700;
      color: #38bdf8;
    }
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 4px;
    overflow: hidden;
    position: relative;

    .fill {
      height: 100%;
      background: linear-gradient(90deg, #22c55e, #38bdf8, #818cf8);
      border-radius: 4px;
      transition: width 0.6s ease;
      width: 0%;
    }
  }

  .progress-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 10px;
    color: #4a4f5e;

    span {
      color: #64748b;
    }
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    .percentage { font-size: 12px; }
    .progress-stats { font-size: 9px; }
  }
`;

// ===== LEVELS =====
const LevelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.8s ease;
`;

const LevelCard = styled.div`
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 20px 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.5s ease;
  animation-delay: ${props => props.delay || '0s'};

  &:hover {
    border-color: rgba(56, 189, 248, 0.08);
    background: rgba(255, 255, 255, 0.025);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.color || 'linear-gradient(90deg, #22c55e, #38bdf8)'};
    opacity: 0.6;
  }

  &.completed {
    border-color: rgba(34, 197, 94, 0.15);
    &::before {
      background: linear-gradient(90deg, #22c55e, #059669);
      opacity: 1;
    }
  }

  &.locked {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      border-color: rgba(255, 255, 255, 0.04);
      box-shadow: none;
    }
  }

  .level-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 8px;

    .level-number {
      font-size: 12px;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.08);
      padding: 2px 10px;
      border-radius: 20px;
      flex-shrink: 0;
    }

    .level-title {
      font-size: 18px;
      font-weight: 700;
      color: #f1f5f9;
      flex: 1;
    }

    .level-badge {
      font-size: 10px;
      padding: 2px 12px;
      border-radius: 20px;
      font-weight: 600;

      &.beginner {
        background: rgba(34, 197, 94, 0.08);
        color: #22c55e;
      }
      &.intermediate {
        background: rgba(251, 191, 36, 0.08);
        color: #fbbf24;
      }
      &.advanced {
        background: rgba(239, 68, 68, 0.08);
        color: #ef4444;
      }
      &.expert {
        background: rgba(129, 140, 248, 0.08);
        color: #818cf8;
      }
      &.complete {
        background: rgba(34, 197, 94, 0.12);
        color: #22c55e;
      }
      &.locked-badge {
        background: rgba(255, 255, 255, 0.04);
        color: #4a4f5e;
      }
    }

    .status-icon {
      font-size: 20px;
    }
  }

  .level-description {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 12px;
    padding-left: 4px;
  }

  .level-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.02);

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #64748b;

      .icon {
        font-size: 14px;
      }
    }

    .meta-item.highlight {
      color: #38bdf8;
    }
  }

  @media (max-width: 768px) {
    padding: 16px 18px;
    .level-header {
      .level-title {
        font-size: 16px;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 14px 14px;
    .level-header {
      .level-title {
        font-size: 14px;
      }
    }
    .level-description {
      font-size: 12px;
    }
    .level-meta {
      gap: 10px;
      .meta-item {
        font-size: 10px;
      }
    }
  }
`;

// ===== EXPANDED CONTENT =====
const ExpandedContent = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  animation: ${fadeIn} 0.4s ease;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const LessonItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  &.completed {
    .lesson-status {
      color: #22c55e;
    }
  }

  .lesson-status {
    font-size: 16px;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
  }

  .lesson-info {
    flex: 1;
    .lesson-title {
      font-size: 13px;
      font-weight: 500;
      color: #f1f5f9;
    }
    .lesson-desc {
      font-size: 11px;
      color: #64748b;
      margin-top: 1px;
    }
  }

  .lesson-duration {
    font-size: 10px;
    color: #4a4f5e;
    flex-shrink: 0;
  }

  .lesson-play {
    font-size: 14px;
    color: #38bdf8;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    .lesson-info .lesson-title {
      font-size: 12px;
    }
  }
`;

// ===== STATS BAR =====
const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-width: 900px;
  margin: 0 auto 24px;
  width: 100%;
  animation: ${fadeIn} 0.9s ease;

  .stat-item {
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 14px 12px;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(56, 189, 248, 0.08);
    }

    .stat-number {
      font-size: 22px;
      font-weight: 700;
      color: #f1f5f9;
    }

    .stat-label {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    .stat-item {
      padding: 10px 8px;
      .stat-number {
        font-size: 18px;
      }
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Academy = () => {
  const navigate = useNavigate();
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);

  // Course Data
  const levels = [
    {
      id: 0,
      title: 'Foundation',
      badge: 'Beginner',
      badgeClass: 'beginner',
      color: 'linear-gradient(90deg, #22c55e, #38bdf8)',
      description: 'Learn the absolute basics of Deriv trading. No prior knowledge needed!',
      duration: '2 weeks',
      lessons: 6,
      totalLessons: 6,
      delay: '0s',
      icon: '🌱',
      lessonsList: [
        { id: 'l1', title: 'What is Deriv Trading?', desc: 'Understand the platform and what you can trade', duration: '10 min' },
        { id: 'l2', title: 'Understanding Markets', desc: 'Learn about Volatility Indices, Forex, and more', duration: '15 min' },
        { id: 'l3', title: 'Over/Under Explained', desc: 'Master the most common trade type', duration: '12 min' },
        { id: 'l4', title: 'Even/Odd Explained', desc: 'Learn the simple number guessing game', duration: '10 min' },
        { id: 'l5', title: 'Matches/Differs Explained', desc: 'Understand the matching concept', duration: '10 min' },
        { id: 'l6', title: 'Your First Trade', desc: 'Step-by-step guide to making your first trade', duration: '15 min' },
      ]
    },
    {
      id: 1,
      title: 'Getting Started',
      badge: 'Beginner',
      badgeClass: 'beginner',
      color: 'linear-gradient(90deg, #38bdf8, #818cf8)',
      description: 'Set up your account and start trading with confidence.',
      duration: '2 weeks',
      lessons: 6,
      totalLessons: 6,
      delay: '0.1s',
      icon: '🚀',
      lessonsList: [
        { id: 'l7', title: 'Creating Your Account', desc: 'Step-by-step account setup guide', duration: '10 min' },
        { id: 'l8', title: 'Using Demo Account', desc: 'Practice with virtual money', duration: '12 min' },
        { id: 'l9', title: 'Reading Charts', desc: 'Understanding candlesticks and patterns', duration: '18 min' },
        { id: 'l10', title: 'Basic Strategy', desc: 'Simple strategy for beginners', duration: '15 min' },
        { id: 'l11', title: 'Risk Management 101', desc: 'Protect your money with simple rules', duration: '14 min' },
        { id: 'l12', title: 'Making Your First Trade', desc: 'Real trade with proper setup', duration: '12 min' },
      ]
    },
    {
      id: 2,
      title: 'Building Skills',
      badge: 'Intermediate',
      badgeClass: 'intermediate',
      color: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
      description: 'Develop your trading skills and learn to analyze the markets.',
      duration: '3 weeks',
      lessons: 6,
      totalLessons: 6,
      delay: '0.2s',
      icon: '📈',
      lessonsList: [
        { id: 'l13', title: 'Technical Analysis', desc: 'Learn to read price action and patterns', duration: '20 min' },
        { id: 'l14', title: 'Support & Resistance', desc: 'Identify key levels in the market', duration: '16 min' },
        { id: 'l15', title: 'Trend Following', desc: 'Trade with the trend for higher success', duration: '18 min' },
        { id: 'l16', title: 'Trading Strategies', desc: '3 proven strategies for consistent profits', duration: '22 min' },
        { id: 'l17', title: 'Advanced Risk Management', desc: 'Professional money management techniques', duration: '16 min' },
        { id: 'l18', title: 'Trading Psychology', desc: 'Control your emotions while trading', duration: '15 min' },
      ]
    },
    {
      id: 3,
      title: 'Advanced Strategies',
      badge: 'Advanced',
      badgeClass: 'advanced',
      color: 'linear-gradient(90deg, #ef4444, #dc2626)',
      description: 'Master advanced strategies and become a consistent trader.',
      duration: '3 weeks',
      lessons: 6,
      totalLessons: 6,
      delay: '0.3s',
      icon: '🎯',
      lessonsList: [
        { id: 'l19', title: 'Reversal Patterns', desc: 'Spot and trade market reversals', duration: '20 min' },
        { id: 'l20', title: 'Fibonacci Retracement', desc: 'Use Fibonacci for better entries', duration: '18 min' },
        { id: 'l21', title: 'Volume Analysis', desc: 'Understand volume and momentum', duration: '16 min' },
        { id: 'l22', title: 'Advanced Strategies', desc: '4 advanced strategies for experts', duration: '22 min' },
        { id: 'l23', title: 'Risk-Reward Mastery', desc: 'Optimize your risk-reward ratio', duration: '14 min' },
        { id: 'l24', title: 'Building Your System', desc: 'Create your personalized trading system', duration: '18 min' },
      ]
    },
    {
      id: 4,
      title: 'Expert Level',
      badge: 'Expert',
      badgeClass: 'expert',
      color: 'linear-gradient(90deg, #818cf8, #6366f1)',
      description: 'Achieve professional trader status with advanced techniques.',
      duration: '4 weeks',
      lessons: 6,
      totalLessons: 6,
      delay: '0.4s',
      icon: '🏆',
      lessonsList: [
        { id: 'l25', title: 'Market Profile', desc: 'Understanding institutional trading', duration: '22 min' },
        { id: 'l26', title: 'Order Flow', desc: 'Reading the tape and smart money', duration: '20 min' },
        { id: 'l27', title: 'Correlation Trading', desc: 'Trade correlated assets effectively', duration: '18 min' },
        { id: 'l28', title: 'Professional Strategies', desc: 'Institutional-grade trading strategies', duration: '24 min' },
        { id: 'l29', title: 'Business of Trading', desc: 'Turn trading into a profitable business', duration: '20 min' },
        { id: 'l30', title: 'Mastery & Review', desc: 'Review everything and become a pro', duration: '25 min' },
      ]
    }
  ];

  // Calculate total lessons
  const totalLessons = levels.reduce((acc, level) => acc + level.lessonsList.length, 0);

  // Toggle expanded level
  const toggleLevel = (levelId) => {
    setExpandedLevel(expandedLevel === levelId ? null : levelId);
  };

  // Toggle lesson completion
  const toggleLesson = (lessonId) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  // Update progress
  useEffect(() => {
    const completed = completedLessons.length;
    const total = totalLessons;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    setProgress(percentage);
  }, [completedLessons, totalLessons]);

  // Check if level is completed
  const isLevelComplete = (level) => {
    const levelLessonIds = level.lessonsList.map(l => l.id);
    return levelLessonIds.every(id => completedLessons.includes(id));
  };

  // Check if level is locked
  const isLevelLocked = (levelIndex) => {
    if (levelIndex === 0) return false;
    const previousLevel = levels[levelIndex - 1];
    return !isLevelComplete(previousLevel);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <PageWrapper>
      <BackButton onClick={handleGoBack}>
        <span className="arrow">←</span> Back
      </BackButton>

      {/* HERO SECTION */}
      <HeroSection>
        <div className="badge">🎓 Learn Trading</div>
        <h1 className="title">
          Voltix Traders <span className="gradient">Academy</span>
        </h1>
        <p className="subtitle">
          Master Deriv trading from absolute beginner to expert level.
          Complete our comprehensive course and become a professional trader.
        </p>
      </HeroSection>

      {/* STATS BAR */}
      <StatsBar>
        <div className="stat-item">
          <div className="stat-number">{levels.length}</div>
          <div className="stat-label">Levels</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{totalLessons}</div>
          <div className="stat-label">Lessons</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{completedLessons.length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{progress}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </StatsBar>

      {/* PROGRESS SECTION */}
      <ProgressSection>
        <div className="progress-header">
          <span className="label">Course Progress</span>
          <span className="percentage">{progress}% Complete</span>
        </div>
        <div className="progress-bar">
          <div className="fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-stats">
          <span>{completedLessons.length} of {totalLessons} lessons completed</span>
          <span>{progress === 100 ? '🎉 Course Complete!' : `Keep going!`}</span>
        </div>
      </ProgressSection>

      {/* LEVELS */}
      <LevelsContainer>
        {levels.map((level, index) => {
          const completed = isLevelComplete(level);
          const locked = isLevelLocked(index);
          const lessonCount = level.lessonsList.length;
          const completedInLevel = level.lessonsList.filter(l => completedLessons.includes(l.id)).length;

          return (
            <LevelCard
              key={level.id}
              delay={level.delay}
              color={level.color}
              className={completed ? 'completed' : locked ? 'locked' : ''}
              onClick={() => !locked && toggleLevel(level.id)}
            >
              <div className="level-header">
                <span className="level-number">Level {level.id + 1}</span>
                <span className="level-title">{level.icon} {level.title}</span>
                <span className={`level-badge ${locked ? 'locked-badge' : level.badgeClass}`}>
                  {locked ? '🔒 Locked' : level.badge}
                </span>
                {completed && <span className="status-icon">✅</span>}
              </div>

              <div className="level-description">
                {level.description}
              </div>

              <div className="level-meta">
                <span className="meta-item">
                  <span className="icon">📚</span> {lessonCount} lessons
                </span>
                <span className="meta-item">
                  <span className="icon">⏱️</span> {level.duration}
                </span>
                <span className="meta-item highlight">
                  <span className="icon">📊</span> {completedInLevel}/{lessonCount} done
                </span>
                {locked && (
                  <span className="meta-item" style={{ color: '#ef4444' }}>
                    <span className="icon">🔒</span> Complete previous level first
                  </span>
                )}
              </div>

              <ExpandedContent isOpen={expandedLevel === level.id}>
                {level.lessonsList.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <LessonItem
                      key={lesson.id}
                      className={isCompleted ? 'completed' : ''}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!locked) toggleLesson(lesson.id);
                      }}
                    >
                      <span className="lesson-status">
                        {isCompleted ? '✅' : '📖'}
                      </span>
                      <div className="lesson-info">
                        <div className="lesson-title">{lesson.title}</div>
                        <div className="lesson-desc">{lesson.desc}</div>
                      </div>
                      <span className="lesson-duration">{lesson.duration}</span>
                      <span className="lesson-play">{isCompleted ? '📖' : '▶️'}</span>
                    </LessonItem>
                  );
                })}
              </ExpandedContent>
            </LevelCard>
          );
        })}
      </LevelsContainer>

      {/* COMPLETION MESSAGE */}
      {progress === 100 && (
        <div style={{
          textAlign: 'center',
          padding: '30px 20px',
          marginTop: '20px',
          background: 'rgba(34, 197, 94, 0.04)',
          border: '1px solid rgba(34, 197, 94, 0.08)',
          borderRadius: '16px',
          animation: `${fadeIn} 0.8s ease`
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉🏆🎉</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
            Congratulations!
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            You've completed the entire Voltix Traders Academy course!
            <br />
            You're now ready to trade like a professional! 🚀
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        textAlign: 'center',
        fontSize: '11px',
        color: '#4a4f5e'
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