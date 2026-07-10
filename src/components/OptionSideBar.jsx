// src/components/OptionSideBar.jsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// KEYFRAMES
// ============================================
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// ============================================
// STYLED COMPONENTS - UPDATED WITH THEME
// ============================================

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${props => props.theme.colors.backgroundSecondary + 'f0'};
  backdrop-filter: blur(20px);
  border-right: 1px solid ${props => props.theme.colors.border};
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    top: 0;
    height: 100vh;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

// ===== SCROLLABLE CONTENT =====
const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 76px 16px 8px 16px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 80px 16px 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 74px 14px 6px 14px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 98;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

// ===== SIDEBAR HEADER =====
const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px 16px 4px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 16px;
  animation: ${slideIn} 0.4s ease;
  flex-shrink: 0;

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    box-shadow: 0 4px 20px ${props => props.theme.colors.accent + '25'};
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    letter-spacing: 0.3px;
  }

  .user-email {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    margin-top: 2px;
    letter-spacing: 0.2px;
    word-break: break-all;
  }

  @media (max-width: 768px) {
    padding: 10px 4px 12px 4px;
    margin-bottom: 12px;
    
    .avatar {
      width: 40px;
      height: 40px;
      font-size: 17px;
    }
    .user-name {
      font-size: 14px;
    }
    .user-email {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    padding: 8px 4px 10px 4px;
    margin-bottom: 10px;
    gap: 10px;
    
    .avatar {
      width: 36px;
      height: 36px;
      font-size: 15px;
      border-radius: 10px;
    }
    .user-name {
      font-size: 13px;
    }
    .user-email {
      font-size: 10px;
    }
  }
`;

// ===== NAVIGATION ITEMS =====
const NavSection = styled.div`
  margin-bottom: 20px;
  animation: ${slideIn} 0.5s ease;

  @media (max-width: 768px) {
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${props => props.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding: 0 4px;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 9px;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    letter-spacing: 0.8px;
    margin-bottom: 3px;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin-bottom: 2px;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textMuted};

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};
  }

  &.active {
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 24px;
      background: ${props => `linear-gradient(180deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
      border-radius: 0 3px 3px 0;
    }

    .nav-icon {
      color: ${props => props.theme.colors.accent};
    }

    .badge {
      background: ${props => props.theme.colors.accentActive};
      color: ${props => props.theme.colors.accent};
    }
  }

  .nav-icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .nav-label {
    flex: 1;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.2px;
  }

  .badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 20px;
    background: ${props => props.theme.colors.background + '60'};
    color: ${props => props.theme.colors.textMuted};
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 12px;
    border-radius: 8px;
    
    .nav-icon {
      font-size: 16px;
      width: 20px;
    }
    .nav-label {
      font-size: 12px;
    }
    .badge {
      font-size: 8px;
      padding: 1px 8px;
    }
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    gap: 10px;
    border-radius: 6px;
    margin-bottom: 1px;
    
    .nav-icon {
      font-size: 14px;
      width: 18px;
    }
    .nav-label {
      font-size: 11px;
    }
    .badge {
      font-size: 7px;
      padding: 1px 6px;
    }
  }
`;

// ===== FEEDBACK SECTION =====
const FeedbackSection = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: ${props => props.theme.colors.accentActive};
  border: 1px solid ${props => props.theme.colors.border};
  animation: ${fadeIn} 0.6s ease;

  .feedback-label {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 500;
    margin-bottom: 8px;
    letter-spacing: 0.3px;
  }

  .stars {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    justify-content: center;
  }

  .star {
    font-size: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${props => props.theme.colors.border};
    line-height: 1;

    &:hover {
      transform: scale(1.2);
    }

    &.active {
      color: #fbbf24;
      text-shadow: 0 0 30px rgba(251, 191, 36, 0.2);
    }

    &:hover ~ .star {
      color: ${props => props.theme.colors.border};
    }
  }

  .feedback-textarea {
    width: 100%;
    min-height: 70px;
    padding: 10px 12px;
    background: ${props => props.theme.colors.background + '40'};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    color: ${props => props.theme.colors.text};
    font-size: 12px;
    font-family: inherit;
    resize: vertical;
    outline: none;
    transition: all 0.2s ease;
    margin-bottom: 10px;

    &::placeholder {
      color: ${props => props.theme.colors.textMuted + '60'};
    }

    &:focus {
      border-color: ${props => props.theme.colors.accent};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.accent + '15'};
    }
  }

  .feedback-submit {
    width: 100%;
    padding: 8px 0;
    border: none;
    border-radius: 8px;
    background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
    color: ${props => props.theme.colors.text};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px ${props => props.theme.colors.accent + '50'};
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
    font-size: 11px;
    text-align: center;
    color: #22c55e;
  }

  @media (max-width: 768px) {
    padding: 12px;
    
    .feedback-label {
      font-size: 10px;
      margin-bottom: 6px;
    }
    .star {
      font-size: 20px;
      gap: 6px;
    }
    .feedback-textarea {
      min-height: 60px;
      font-size: 11px;
    }
    .feedback-submit {
      font-size: 11px;
      padding: 7px 0;
    }
  }

  @media (max-width: 480px) {
    padding: 10px;
    
    .feedback-label {
      font-size: 9px;
      margin-bottom: 4px;
    }
    .star {
      font-size: 18px;
      gap: 4px;
    }
    .feedback-textarea {
      min-height: 50px;
      font-size: 10px;
      padding: 8px 10px;
    }
    .feedback-submit {
      font-size: 10px;
      padding: 6px 0;
    }
  }
`;

// ===== FOOTER - STICKY AT BOTTOM =====
const SidebarFooter = styled.div`
  flex-shrink: 0;
  padding: 12px 16px 20px 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary + 'f0'};
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.7s ease;

  .footer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${props => props.theme.colors.textMuted};
    font-size: 13px;
    font-weight: 500;

    &:hover {
      background: ${props => props.theme.colors.accentActive};
      color: ${props => props.theme.colors.text};
    }

    .footer-icon {
      font-size: 16px;
    }
  }

  @media (max-width: 768px) {
    padding: 8px 14px 14px 14px;
    
    .footer-item {
      padding: 8px 10px;
      font-size: 12px;
      gap: 10px;
      
      .footer-icon {
        font-size: 14px;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 6px 12px 12px 12px;
    
    .footer-item {
      padding: 6px 10px;
      font-size: 11px;
      gap: 8px;
      border-radius: 6px;
      
      .footer-icon {
        font-size: 13px;
      }
    }
  }
`;

// ===== CLOSE BUTTON FOR MOBILE =====
const CloseButton = styled.button`
  display: none;
  position: fixed;
  top: 12px;
  right: 16px;
  z-index: 100;
  background: ${props => props.theme.colors.background + '80'};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textMuted};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};
  }

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    top: 14px;
    right: 16px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
    top: 12px;
    right: 12px;
  }
`;

// ============================================
// MAIN COMPONENT (UNCHANGED)
// ============================================

const OptionSideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('academy');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleNavClick = (item, path) => {
    setActiveItem(item);
    if (path) {
      navigate(path);
    }
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleSettingsNavigation = () => {
    navigate('/settings');
    if (window.innerWidth <= 768) {
      onClose();
    }
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
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
        <CloseButton isOpen={isOpen} onClick={onClose}>
          ✕
        </CloseButton>

        <SidebarContent>
          <SidebarHeader>
            <div className="avatar">VT</div>
            <div className="user-info">
              <div className="user-name">John Trader</div>
              <div className="user-email">john@voltixtraders.com</div>
            </div>
          </SidebarHeader>

          {/* MAIN NAVIGATION - Only Major Options */}
          <NavSection>
            <SectionLabel>Learning</SectionLabel>
            
            <NavItem 
              active={activeItem === 'academy'}
              onClick={() => handleNavClick('academy', '/academy')}
            >
              <span className="nav-icon">📚</span>
              <span className="nav-label">Voltix Traders Academy</span>
              <span className="badge">NEW</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Account</SectionLabel>
            
            <NavItem 
              active={activeItem === 'account-info'}
              onClick={() => handleNavClick('account-info', '/account-info')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Deriv Account Information</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Trading</SectionLabel>
            
            <NavItem 
              active={activeItem === 'switch-to-forex'}
              onClick={() => handleNavClick('switch-to-forex', '/switch-to-forex')}
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
              active={activeItem === 'risk-calculator'}
              onClick={() => handleNavClick('risk-calculator', '/risk-calculator')}
            >
              <span className="nav-icon">🧮</span>
              <span className="nav-label">Risk Calculator</span>
            </NavItem>
          </NavSection>

          {/* FEEDBACK SECTION */}
          <NavSection>
            <SectionLabel>Feedback</SectionLabel>
            
            <FeedbackSection>
              <div className="feedback-label">Rate your experience</div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
              {rating > 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '11px', 
                  color: '#94a3b8', 
                  marginBottom: '8px' 
                }}>
                  {getRatingText(rating)}
                </div>
              )}
              <textarea
                className="feedback-textarea"
                placeholder="Share your thoughts, suggestions, or issues..."
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
        </SidebarContent>

        {/* FOOTER - Now always visible at bottom */}
        <SidebarFooter>
          <div className="footer-item" onClick={handleSettingsNavigation}>
            <span className="footer-icon">⚙️</span>
            Settings
          </div>
          <div className="footer-item" onClick={handleSettingsNavigation}>
            <span className="footer-icon">❓</span>
            Help & Support
          </div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default OptionSideBar;