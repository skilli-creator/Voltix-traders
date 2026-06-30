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
// STYLED COMPONENTS
// ============================================

const SidebarContainer = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  width: 280px;
  height: calc(100vh - 64px);
  background: rgba(3, 7, 18, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(56, 189, 248, 0.08);
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
    padding-top: 0;
  }
`;

// ===== SCROLLABLE CONTENT =====
const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 16px 8px 16px;
  -webkit-overflow-scrolling: touch;
  padding-top: 16px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 12px 16px 8px 16px;
    padding-top: 70px;
  }

  @media (max-width: 480px) {
    padding: 10px 14px 6px 14px;
    padding-top: 65px;
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
  padding: 0 4px 16px 4px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.06);
  margin-bottom: 16px;
  animation: ${slideIn} 0.4s ease;
  flex-shrink: 0;

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: white;
    box-shadow: 0 4px 20px rgba(56, 189, 248, 0.15);
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: #f1f5f9;
    letter-spacing: 0.3px;
  }

  .user-email {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
    letter-spacing: 0.2px;
    word-break: break-all;
  }

  @media (max-width: 768px) {
    padding: 0 4px 12px 4px;
    margin-bottom: 12px;
    
    .avatar {
      width: 36px;
      height: 36px;
      font-size: 15px;
    }
    .user-name {
      font-size: 13px;
    }
    .user-email {
      font-size: 10px;
    }
  }

  @media (max-width: 480px) {
    padding: 0 4px 10px 4px;
    margin-bottom: 10px;
    gap: 10px;
    
    .avatar {
      width: 32px;
      height: 32px;
      font-size: 13px;
      border-radius: 10px;
    }
    .user-name {
      font-size: 12px;
    }
    .user-email {
      font-size: 9px;
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
  color: #64748b;
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
  color: ${props => props.active ? '#f1f5f9' : '#94a3b8'};

  &:hover {
    background: rgba(56, 189, 248, 0.06);
    color: #f1f5f9;
  }

  &.active {
    background: rgba(56, 189, 248, 0.08);
    color: #f1f5f9;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 24px;
      background: linear-gradient(180deg, #38bdf8, #818cf8);
      border-radius: 0 3px 3px 0;
    }

    .nav-icon {
      color: #38bdf8;
    }

    .badge {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
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
    background: rgba(255, 255, 255, 0.04);
    color: #94a3b8;
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
  background: rgba(56, 189, 248, 0.03);
  border: 1px solid rgba(56, 189, 248, 0.06);
  animation: ${fadeIn} 0.6s ease;

  .feedback-label {
    font-size: 11px;
    color: #94a3b8;
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
    color: #334155;
    line-height: 1;

    &:hover {
      transform: scale(1.2);
    }

    &.active {
      color: #fbbf24;
      text-shadow: 0 0 30px rgba(251, 191, 36, 0.2);
    }

    &:hover ~ .star {
      color: #334155;
    }
  }

  .feedback-textarea {
    width: 100%;
    min-height: 70px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    color: #f1f5f9;
    font-size: 12px;
    font-family: inherit;
    resize: vertical;
    outline: none;
    transition: all 0.2s ease;
    margin-bottom: 10px;

    &::placeholder {
      color: #4a4f5e;
    }

    &:focus {
      border-color: rgba(56, 189, 248, 0.3);
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.05);
    }
  }

  .feedback-submit {
    width: 100%;
    padding: 8px 0;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #2962ff, #1a4fcf);
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(41, 98, 255, 0.3);
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
  border-top: 1px solid rgba(56, 189, 248, 0.06);
  background: rgba(3, 7, 18, 0.98);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.7s ease;
  margin-top: auto;

  .footer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;

    &:hover {
      background: rgba(255, 255, 255, 0.03);
      color: #94a3b8;
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
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
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
    background: rgba(255, 255, 255, 0.15);
    color: #f1f5f9;
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
      // Send feedback to backend email endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          feedback: feedbackText.trim(),
          user: 'John Trader', // This would come from user context
          email: 'john@voltixtraders.com' // This would come from user context
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
              <span className="nav-label">Your Deriv Account Information</span>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel>Tools</SectionLabel>
            
            <NavItem 
              active={activeItem === 'risk-calculator'}
              onClick={() => handleNavClick('risk-calculator', '/risk-calculator')}
            >
              <span className="nav-icon">📊</span>
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

        {/* FOOTER */}
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