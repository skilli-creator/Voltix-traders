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
  overflow-y: auto;
  padding: 24px 16px;

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
    width: 100%;
    top: 0;
    height: 100vh;
    padding: 20px 16px;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
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
  padding: 0 4px 24px 4px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.06);
  margin-bottom: 20px;
  animation: ${slideIn} 0.4s ease;

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
  }

  .user-info {
    flex: 1;
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
  }
`;

// ===== NAVIGATION ITEMS =====
const NavSection = styled.div`
  margin-bottom: 28px;
  animation: ${slideIn} 0.5s ease;
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding: 0 4px;
  margin-bottom: 8px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin-bottom: 2px;
  color: ${props => props.active ? '#f1f5f9' : '#94a3b8'};

  &:hover {
    background: rgba(56, 189, 248, 0.06);
    color: #f1f5f9;

    .nav-icon {
      transform: scale(1.05);
    }

    .arrow {
      opacity: 1;
      transform: translateX(0);
    }
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
  }

  .arrow {
    opacity: 0;
    transform: translateX(-8px);
    transition: all 0.3s ease;
    font-size: 12px;
    color: #64748b;
  }
`;

const SubItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 14px 8px 44px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #94a3b8;
  font-size: 12px;
  margin-left: 8px;

  &:hover {
    background: rgba(56, 189, 248, 0.04);
    color: #f1f5f9;
  }

  &.active {
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.06);
  }

  .sub-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.4;
    flex-shrink: 0;
  }
`;

// ===== RATING SECTION =====
const RatingSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(56, 189, 248, 0.03);
  border: 1px solid rgba(56, 189, 248, 0.06);
  animation: ${fadeIn} 0.6s ease;

  .rating-label {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
    margin-bottom: 10px;
    letter-spacing: 0.3px;
  }

  .stars {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
  }

  .star {
    font-size: 22px;
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

  .rating-text {
    font-size: 11px;
    color: #64748b;
    text-align: center;
    letter-spacing: 0.2px;
  }
`;

// ===== FOOTER =====
const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(56, 189, 248, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: ${fadeIn} 0.7s ease;

  .footer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #64748b;
    font-size: 12px;

    &:hover {
      background: rgba(255, 255, 255, 0.03);
      color: #94a3b8;
    }

    .footer-icon {
      font-size: 14px;
    }
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const OptionsSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('academy');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleNavClick = (item, path) => {
    setActiveItem(item);
    if (path) {
      navigate(path);
    }
    // Close on mobile
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleSubItemClick = (item) => {
    setActiveItem(item);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleRating = (value) => {
    setRating(value);
    // You can add API call here to save rating
    console.log(`User rated: ${value} stars`);
  };

  const getRatingText = (value) => {
    const texts = {
      1: 'Needs Improvement 😔',
      2: 'Fair 🤔',
      3: 'Good 🙂',
      4: 'Great 😊',
      5: 'Excellent 🚀'
    };
    return texts[value] || 'Rate your experience';
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <div className="avatar">VT</div>
          <div className="user-info">
            <div className="user-name">John Trader</div>
            <div className="user-email">john@voltixtraders.com</div>
          </div>
        </SidebarHeader>

        {/* MAIN NAVIGATION */}
        <NavSection>
          <SectionLabel>Learning</SectionLabel>
          
          <NavItem 
            active={activeItem === 'academy'}
            onClick={() => handleNavClick('academy', '/academy')}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-label">Voltix Traders Academy</span>
            <span className="badge">NEW</span>
            <span className="arrow">→</span>
          </NavItem>

          <NavItem 
            active={activeItem === 'lessons'}
            onClick={() => handleNavClick('lessons', '/lessons')}
            style={{ paddingLeft: '44px' }}
          >
            <span className="nav-icon" style={{ fontSize: '14px' }}>▸</span>
            <span className="nav-label" style={{ fontSize: '12px' }}>Deriv Trading Lessons</span>
          </NavItem>

          <NavItem 
            active={activeItem === 'advanced'}
            onClick={() => handleNavClick('advanced', '/advanced-lessons')}
            style={{ paddingLeft: '44px' }}
          >
            <span className="nav-icon" style={{ fontSize: '14px' }}>▸</span>
            <span className="nav-label" style={{ fontSize: '12px' }}>Advanced Strategies</span>
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
            <span className="arrow">→</span>
          </NavItem>

          <NavItem 
            active={activeItem === 'linked-accounts'}
            onClick={() => handleNavClick('linked-accounts', '/linked-accounts')}
            style={{ paddingLeft: '44px' }}
          >
            <span className="nav-icon" style={{ fontSize: '14px' }}>▸</span>
            <span className="nav-label" style={{ fontSize: '12px' }}>Connected Accounts</span>
          </NavItem>

          <NavItem 
            active={activeItem === 'security'}
            onClick={() => handleNavClick('security', '/security')}
            style={{ paddingLeft: '44px' }}
          >
            <span className="nav-icon" style={{ fontSize: '14px' }}>▸</span>
            <span className="nav-label" style={{ fontSize: '12px' }}>Security Settings</span>
          </NavItem>
        </NavSection>

        {/* RATING SECTION */}
        <NavSection>
          <SectionLabel>Feedback</SectionLabel>
          
          <RatingSection>
            <div className="rating-label">⭐ Rate your trading experience</div>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="rating-text">
              {rating > 0 ? getRatingText(rating) : 'Tap a star to rate'}
            </div>
          </RatingSection>
        </NavSection>

        {/* FOOTER */}
        <SidebarFooter>
          <div className="footer-item" onClick={() => navigate('/settings')}>
            <span className="footer-icon">⚙️</span>
            Settings
          </div>
          <div className="footer-item" onClick={() => navigate('/help')}>
            <span className="footer-icon">❓</span>
            Help & Support
          </div>
          <div className="footer-item" style={{ color: '#ef4444' }}>
            <span className="footer-icon">🚪</span>
            Sign Out
          </div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default OptionsSidebar;