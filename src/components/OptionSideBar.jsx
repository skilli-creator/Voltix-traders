// src/components/OptionSideBar.jsx
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// KEYFRAMES & MICRO-INTERACTIONS
// ============================================
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.15);
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
`;

// ============================================
// STYLED COMPONENTS - PROFESSIONAL THEME
// ============================================

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${props => props.theme.colors.shadow || 'rgba(10, 15, 29, 0.7)'};
  backdrop-filter: blur(4px);
  z-index: 98;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${props => props.theme.colors.backgroundSecondary || '#0F172A'};
  border-right: 1px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.08)'};
  transform: ${props => (props.isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);

  @media (max-width: 768px) {
    width: 290px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 100;
  background: ${props => props.theme.colors.background || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme.colors.textMuted || '#94A3B8'};
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.accentActive || 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.theme.colors.text || '#FFFFFF'};
    border-color: ${props => props.theme.colors.accent || '#3B82F6'};
  }

  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar || 'rgba(255, 255, 255, 0.15)'};
    border-radius: 99px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textMuted || 'rgba(255, 255, 255, 0.3)'};
  }
`;

// ===== SIDEBAR HEADER =====
const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 16px 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.08)'};
  animation: ${slideIn} 0.3s ease;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props =>
      `linear-gradient(135deg, ${props.theme.colors.accent || '#3B82F6'}, #1D4ED8)`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px ${props => (props.theme.colors.accent ? `${props.theme.colors.accent}40` : 'rgba(59, 130, 246, 0.3)')};
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-size: 13.5px;
    font-weight: 600;
    color: ${props => props.theme.colors.text || '#F8FAFC'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-email {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted || '#94A3B8'};
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// ===== NAVIGATION SECTION & ITEMS =====
const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: ${slideIn} 0.4s ease;
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme.colors.textMuted || '#64748B'};
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 8px;
  margin-bottom: 4px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${props => (props.active ? (props.theme.colors.accentActive || 'rgba(59, 130, 246, 0.12)') : 'transparent')};
  color: ${props => (props.active ? (props.theme.colors.accent || '#3B82F6') : (props.theme.colors.textSecondary || '#CBD5E1'))};

  &:hover {
    background: ${props => props.theme.colors.accentActive || 'rgba(59, 130, 246, 0.08)'};
    color: ${props => props.theme.colors.text || '#F8FAFC'};
    transform: translateX(2px);
  }

  ${props =>
    props.active &&
    css`
      font-weight: 600;
      &::before {
        content: '';
        position: absolute;
        left: -14px;
        top: 50%;
        transform: translateY(-50%);
        width: 3.5px;
        height: 18px;
        background: ${props.theme.colors.accent || '#3B82F6'};
        border-radius: 0 4px 4px 0;
        box-shadow: 0 0 10px ${props.theme.colors.accent || '#3B82F6'};
      }
    `}

  .nav-icon {
    font-size: 16px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  &:hover .nav-icon {
    transform: scale(1.1);
  }

  .nav-label {
    flex: 1;
    font-size: 12.5px;
    letter-spacing: 0.1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 6px;
    background: ${props => (props.active ? (props.theme.colors.accent || '#3B82F6') : 'rgba(255, 255, 255, 0.06)')};
    color: ${props => (props.active ? '#FFFFFF' : (props.theme.colors.textMuted || '#94A3B8'))};
    text-transform: uppercase;
    letter-spacing: 0.4px;
    flex-shrink: 0;
  }

  .notification-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${props => props.theme.colors.danger || '#EF4444'};
    animation: ${pulseGlow} 2s infinite;
    flex-shrink: 0;
  }
`;

// ===== CARDS (RESPONSIBLE TRADING & ABOUT) =====
const SideCard = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  background: ${props => props.theme.colors.background || 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.08)'};
  animation: ${fadeIn} 0.4s ease;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: ${props => (props.theme.colors.accent ? `${props.theme.colors.accent}60` : 'rgba(59, 130, 246, 0.4)')};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .card-title {
    font-size: 11.5px;
    font-weight: 600;
    color: ${props => props.theme.colors.text || '#F8FAFC'};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      font-size: 14px;
    }
  }

  .card-item {
    font-size: 10.5px;
    color: ${props => props.theme.colors.textSecondary || '#94A3B8'};
    padding: 3px 0;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    line-height: 1.45;

    .bullet {
      color: ${props => props.theme.colors.accent || '#3B82F6'};
      font-weight: 700;
      flex-shrink: 0;
    }

    .highlight {
      color: ${props => props.theme.colors.text || '#F8FAFC'};
      font-weight: 600;
    }
  }

  .learn-more {
    margin-top: 10px;
    font-size: 10.5px;
    color: ${props => props.theme.colors.accent || '#3B82F6'};
    cursor: pointer;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: gap 0.2s ease, color 0.2s ease;

    &:hover {
      gap: 7px;
      color: ${props => props.theme.colors.accentHover || '#60A5FA'};
    }
  }
`;

// ===== FEEDBACK SECTION =====
const FeedbackSection = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: ${props => props.theme.colors.background || 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.08)'};
  animation: ${fadeIn} 0.4s ease;

  .feedback-label {
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme.colors.textMuted || '#94A3B8'};
    margin-bottom: 8px;
    text-align: center;
  }

  .stars {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
    justify-content: center;
  }

  .star-btn {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.15)'};
    transition: transform 0.15s ease, color 0.15s ease, filter 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    &:hover {
      transform: scale(1.25);
    }

    &.active,
    &.hover {
      color: #F59E0B;
      filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.5));
    }
  }

  .star-rating-text {
    text-align: center;
    font-size: 10.5px;
    font-weight: 600;
    margin-bottom: 10px;
    min-height: 16px;
    color: ${props => props.theme.colors.textSecondary || '#CBD5E1'};
  }

  .feedback-textarea {
    width: 100%;
    min-height: 64px;
    padding: 8px 10px;
    background: ${props => props.theme.colors.backgroundSecondary || '#0F172A'};
    border: 1px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.1)'};
    border-radius: 6px;
    color: ${props => props.theme.colors.text || '#F8FAFC'};
    font-size: 11.5px;
    font-family: inherit;
    resize: none;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    margin-bottom: 10px;

    &::placeholder {
      color: ${props => props.theme.colors.textMuted || '#64748B'};
    }

    &:focus {
      border-color: ${props => props.theme.colors.accent || '#3B82F6'};
      box-shadow: 0 0 0 2px ${props => (props.theme.colors.accent ? `${props.theme.colors.accent}30` : 'rgba(59, 130, 246, 0.2)')};
    }
  }

  .feedback-submit {
    width: 100%;
    padding: 8px 0;
    border: none;
    border-radius: 6px;
    background: ${props => props.theme.colors.accent || '#3B82F6'};
    color: #ffffff;
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: ${props => props.theme.colors.accentHover || '#2563EB'};
      box-shadow: 0 4px 12px ${props => (props.theme.colors.accent ? `${props.theme.colors.accent}40` : 'rgba(59, 130, 246, 0.3)')};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .feedback-status {
    margin-top: 8px;
    font-size: 10.5px;
    text-align: center;
    color: ${props => props.theme.colors.success || '#10B981'};
    font-weight: 500;
  }
`;

// ===== FOOTER =====
const SidebarFooter = styled.footer`
  flex-shrink: 0;
  padding: 12px 14px;
  border-top: 1px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.08)'};
  background: ${props => props.theme.colors.backgroundSecondary || '#0F172A'};
  display: flex;
  flex-direction: column;
  gap: 2px;

  .footer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${props => props.theme.colors.textSecondary || '#94A3B8'};
    font-size: 12px;
    font-weight: 500;

    &:hover {
      background: ${props => props.theme.colors.accentActive || 'rgba(59, 130, 246, 0.08)'};
      color: ${props => props.theme.colors.text || '#F8FAFC'};
    }

    .footer-icon {
      font-size: 14px;
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const OptionSideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('academy');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleNavClick = (item, path) => {
    setActiveItem(item);
    if (path) navigate(path);
    closeSidebarOnMobile();
  };

  const handleNotificationsClick = () => {
    setActiveItem('notifications');
    setHasNotifications(false);
    navigate('/notifications');
    closeSidebarOnMobile();
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      setSubmitStatus('Please select a rating');
      setTimeout(() => setSubmitStatus(''), 3000);
      return;
    }

    if (!feedbackText.trim()) {
      setSubmitStatus('Please write your feedback');
      setTimeout(() => setSubmitStatus(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Sending feedback...');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedback: feedbackText.trim(),
          user: 'John Trader',
          email: 'john@voltixtraders.com'
        }),
      });

      if (response.ok) {
        setSubmitStatus('Thank you for your feedback!');
        setRating(0);
        setFeedbackText('');
        setTimeout(() => setSubmitStatus(''), 5000);
      } else {
        setSubmitStatus('Failed to send. Please try again.');
        setTimeout(() => setSubmitStatus(''), 3000);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitStatus('Connection error. Please try again.');
      setTimeout(() => setSubmitStatus(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (value) => {
    const texts = {
      1: 'Needs Improvement',
      2: 'Fair',
      3: 'Good',
      4: 'Great',
      5: 'Excellent'
    };
    return texts[value] || '';
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      
      <SidebarContainer isOpen={isOpen}>
        <CloseButton isOpen={isOpen} onClick={onClose} aria-label="Close Sidebar">
          ✕
        </CloseButton>

        <SidebarContent>
          {/* USER HEADER */}
          <SidebarHeader>
            <div className="avatar">VT</div>
            <div className="user-info">
              <div className="user-name">John Trader</div>
              <div className="user-email">john@voltixtraders.com</div>
            </div>
          </SidebarHeader>

          {/* UPDATES SECTION */}
          <NavSection>
            <SectionLabel>Updates</SectionLabel>
            <NavItem 
              active={activeItem === 'notifications'}
              onClick={handleNotificationsClick}
            >
              <span className="nav-icon">🔔</span>
              <span className="nav-label">Notifications</span>
              {hasNotifications && <span className="notification-dot" />}
              <span className="badge">2</span>
            </NavItem>
          </NavSection>

          {/* LEARNING SECTION */}
          <NavSection>
            <SectionLabel>Learning</SectionLabel>
            <NavItem 
              active={activeItem === 'academy'}
              onClick={() => handleNavClick('academy', '/academy')}
            >
              <span className="nav-icon">📚</span>
              <span className="nav-label">Voltix Academy</span>
              <span className="badge">NEW</span>
            </NavItem>
          </NavSection>

          {/* ACCOUNT SECTION */}
          <NavSection>
            <SectionLabel>Account</SectionLabel>
            <NavItem 
              active={activeItem === 'account-info'}
              onClick={() => handleNavClick('account-info', '/account-info')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Deriv Account Info</span>
            </NavItem>
          </NavSection>

          {/* TRADING SECTION */}
          <NavSection>
            <SectionLabel>Trading</SectionLabel>
            <NavItem 
              active={activeItem === 'switch-to-forex'}
              onClick={() => handleNavClick('switch-to-forex', '/forex')}
            >
              <span className="nav-icon">💱</span>
              <span className="nav-label">Switch to Forex</span>
              <span className="badge">HOT</span>
            </NavItem>

            <NavItem 
              active={activeItem === 'copy-trading'}
              onClick={() => handleNavClick('copy-trading', '/copy-trading')}
            >
              <span className="nav-icon">🔄</span>
              <span className="nav-label">Copy Trading</span>
              <span className="badge">BETA</span>
            </NavItem>

            <NavItem 
              active={activeItem === 'account-management'}
              onClick={() => handleNavClick('account-management', '/account-management')}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-label">Account Management</span>
              <span className="badge">NEW</span>
            </NavItem>

            <NavItem 
              active={activeItem === 'risk-calculator'}
              onClick={() => handleNavClick('risk-calculator', '/risk-calculator')}
            >
              <span className="nav-icon">🧮</span>
              <span className="nav-label">Risk Calculator</span>
            </NavItem>
          </NavSection>

          {/* WELLNESS / RESPONSIBLE TRADING */}
          <NavSection>
            <SectionLabel>Wellness</SectionLabel>
            <SideCard>
              <div className="card-title">
                <span className="icon">🛡️</span>
                Responsible Trading
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Set <span className="highlight">deposit limits</span> to control your capital budget.</span>
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Take regular <span className="highlight">trading breaks</span> to maintain discipline.</span>
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Trade only with risk capital you can afford to lose.</span>
              </div>
              <div 
                className="learn-more" 
                onClick={() => handleNavClick('responsible-trading', '/responsible-trading')}
              >
                Learn more →
              </div>
            </SideCard>
          </NavSection>

          {/* FEEDBACK SECTION */}
          <NavSection>
            <SectionLabel>Feedback</SectionLabel>
            <FeedbackSection>
              <div className="feedback-label">Rate your experience</div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${
                      star <= (hoverRating || rating) ? 'active' : ''
                    } ${star <= hoverRating && star > rating ? 'hover' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} star`}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="star-rating-text">
                {rating > 0 ? getRatingText(rating) : 'Tap a star to rate'}
              </div>
              <textarea
                className="feedback-textarea"
                placeholder="Share your feedback or suggestions..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                disabled={isSubmitting}
              />
              <button 
                className="feedback-submit" 
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit Feedback'}
              </button>
              {submitStatus && (
                <div className="feedback-status">{submitStatus}</div>
              )}
            </FeedbackSection>
          </NavSection>

          {/* GUIDE & LEGAL SECTION */}
          <NavSection>
            <SectionLabel>Information</SectionLabel>
            <NavItem 
              active={activeItem === 'how-to-use'}
              onClick={() => handleNavClick('how-to-use', '/how-to-use')}
            >
              <span className="nav-icon">📖</span>
              <span className="nav-label">How to Use</span>
            </NavItem>
            <NavItem 
              active={activeItem === 'terms'}
              onClick={() => handleNavClick('terms', '/terms')}
            >
              <span className="nav-icon">⚖️</span>
              <span className="nav-label">Terms & Conditions</span>
            </NavItem>
          </NavSection>

          {/* COMPANY SECTION */}
          <NavSection>
            <SectionLabel>Company</SectionLabel>
            <SideCard>
              <div className="card-title">
                <span className="icon">🏢</span>
                About Voltix Traders
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Third-party app supporting Deriv & Forex platforms.</span>
              </div>
              <div className="card-item">
                <span className="bullet">•</span>
                <span>Provides real-time API market streams and automated execution tools.</span>
              </div>
              <div 
                className="learn-more" 
                onClick={() => handleNavClick('about', '/about')}
              >
                About us →
              </div>
            </SideCard>
          </NavSection>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter>
          <div className="footer-item" onClick={() => handleNavClick('settings', '/settings')}>
            <span className="footer-icon">⚙️</span>
            Settings
          </div>
          <div className="footer-item" onClick={() => handleNavClick('help', '/settings')}>
            <span className="footer-icon">❓</span>
            Help & Support
          </div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default OptionSideBar;